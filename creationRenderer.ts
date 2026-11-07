import { beginLink, buildAtlas, type Atlas, type LinkInProgress, type Program } from './GradientASCII';
import { loadLandDots } from './glyphcssGlobe';
import { CREATION_SEQUENCE, CREATION_WORLDS } from './creationWorlds';
import {
  PASSAGE_END, PASSAGE_EYE_END, PASSAGE_PROGRAM, PASSAGE_RESUME,
  creation, journeyProgramAt, journeyPrograms, journeyStart, type JourneyProgram
} from './creationTimeline';

/** How long the eye can hold with a dark pupil: its portal starts opening just after (hold 5.5 s). */
const EYE_ONLY_UNTIL = 5.4;
const f = (n: number) => n.toFixed(1);
/**
 * One program per transition: STAGE 0-4 play a world and the next through its portal, 5 the arrival.
 * The Passage's program (PASSAGE) is the eye's (STAGE 0) without the hands: its pupil opens on
 * hyperspace instead, and the tunnel drops out of it onto the arrival's own frame at PASSAGE_RESUME.
 */
const field = (stage: number, eyeOnly = false, passage = false) => `#version 300 es
#define STAGE ${stage}
${eyeOnly ? '#define EYE_ONLY' : ''}
${passage ? '#define PASSAGE' : ''}
precision highp float;
uniform float uTime;
uniform float uAspect;
uniform vec3 uWater;
uniform vec3 uInk;
uniform sampler2D uLand;
in vec2 vUv;
out vec4 outColor;
${CREATION_WORLDS}
#if STAGE>=4||defined(PASSAGE)
#ifdef PASSAGE
// Set by passageTunnel for the arrival it draws: how much further out the planet still is, and how
// far the hyperspace stars have still to fall back to the arrival's own (both identity at the seam).
float passageFar=1.,passageWarp=0.,passageStreak=0.;
// The arrival's stars1, its cells stretched along their own radius into streaks while warping.
vec3 streak1(vec2 p,float logz,float t,float r,float a,float N,float K,float par,float seed){
 vec2 uv=vec2((a/TAU+.5)*N,(log(r)-par*logz)*K),c=floor(uv);c.x=mod(c.x,N);
 float h=hash(c+vec2(seed*1013.,0)),h2=hash(c+vec2(77,seed*389.));
 float along=fract(uv.y)-.5;
 float arc=(fract(uv.x)-(.25+.5*h2))*TAU*r/N,rad=along*r/K/(1.+passageStreak);
 float tw=.65+.35*sin(t*(1.5+4.*h2)+h2*60.);
 // A long streak thins toward its cell's ends instead of stopping at the edge
 float tail=mix(1.,sat(1.-4.*along*along),sat(passageStreak*.5));
 return step(h,clamp(26.*TAU*r*r/(N*K),0.,.9))*exp(-(arc*arc+rad*rad)/.00022)*tail*(.35+.9*h2)*tw*mix(vec3(.65,.78,1),vec3(1,.85,.7),h2);
}
// At rest (no warp, no streak) exactly the arrival's own stars once its exit is complete.
vec3 passageStars(vec2 p,float t){
 float r=length(p)+.00001,a=atan(p.y,p.x),logz=-1.8+(t-60.)*.025+passageWarp;
 vec3 s=streak1(p,logz,t,r,a,120.,8.,.22,1.)+streak1(p,logz,t,r,a,220.,14.,.45,5.);
 return s*.45*(1.+sat(passageStreak*.25));
}
#endif
// The globe's spherical coordinates for a point on or above the Earth, at this moment's longitude.
vec2 earthUv(vec3 n,float t){
 float lon=mix(-85.,-140.,ss(62.,72.,t))*PI/180.,lat=-15.*PI/180.;
 vec3 forward=vec3(cos(lat)*cos(lon),cos(lat)*sin(lon),sin(lat));
 vec3 right=vec3(-sin(lon),cos(lon),0),up=cross(forward,right);
 vec3 earth=n.x*right+n.y*up+n.z*forward;
 return vec2(atan(earth.y,earth.x)/TAU+.5,asin(clamp(earth.z,-1.,1.))/PI+.5);
}
// A cloud deck is a sphere of its own: seen from above over the planet, overhead once beneath it.
// It thins to nothing around the camera, so the descent passes through it instead of hitting it.
float cloudDeck(vec3 ro,vec3 rd,float h,float altitude,float t,float freq,float far){
 float r=1.+h,b=dot(ro,rd),c=dot(ro,ro)-r*r,disc=b*b-c;
 if(disc<0.)return 0.;
 float root=sqrt(disc),hit=c>0.?-b-root:-b+root;
 if(hit<=0.||hit>far)return 0.;
 vec2 uv=earthUv(normalize(ro+rd*hit),t);
 float warp=fb2(vec2(uv.x*16.,uv.y*8.),16.)-.5;
 float n=fb4(vec2(uv.x*freq+t*.05+warp*3.,uv.y*freq*.55+warp*2.),freq);
 // Weather comes in systems: whole regions clear, so the oceans and continents stay readable
 float weather=fb2(vec2(uv.x*5.,uv.y*4.)+vec2(3.7,1.3),5.);
 // Far decks melt into the haze near the horizon rather than ending in a hard band
 float haze=ss(.3,1.,hit/(sqrt(altitude*(altitude+2.))+sqrt(2.*h)))*ss(.35,.015,altitude);
 return ss(.6,.76,n+(weather-.5)*.55)*ss(.15,1.2,abs(altitude-h)/h)*(1.-haze);
}
// One scale of swell: its weighted height, its glitter and its weight (none when out of scale).
vec3 waveBand(vec2 at,float altitude,float t,float f){
 float g=exp(-sq(log(altitude*f/5.)/1.1));
 if(g<.01)return vec3(0);
 vec2 q=at*f*vec2(1,1.7)+vec2(t*.12,-t*.3);
 return vec3(g*fb3(q,0.),g*fb2(q+vec2(19.3,-7.1),0.),g);
}
// The same spherical coordinates and ETOPO land data used by the later globe.
// One ray/sphere intersection per glyph, no second globe engine or WebGL context.
vec3 arrival(vec2 p,float t){
 float exit=ss(54.,60.,t),approach=ss(60.,68.,t),descent=ss(68.,77.,t);
 float altitude=mix(10.,4.,exit);altitude=mix(altitude,1.4,approach);
 altitude=exp(mix(log(altitude),log(.0004),descent));
#ifdef PASSAGE
 // From hyperspace, not the black hole: the same approach, further out (descent is still 0 here)
 altitude=mix(4.,1.4,approach)*passageFar;
#endif
 // The camera pitches up from the planet's centre toward its horizon as it falls
 float tilt=ss(68.5,74.,t)*1.32,ct=cos(tilt),st=sin(tilt);
 vec3 rd=normalize(vec3(p*.42,-1));rd=vec3(rd.x,rd.y*ct-rd.z*st,rd.y*st+rd.z*ct);
 vec3 ro=vec3(0,0,1.+altitude);
 float air=ss(.35,.015,altitude),low=ss(.015,.0008,altitude);
 vec3 horizon=mix(vec3(.24,.55,.86),uWater,low),zenith=mix(vec3(.02,.1,.32),mix(uInk,uWater,.35),low);
 vec3 sky=mix(horizon,zenith,1.-exp(-max(rd.z,0.)*5.));
 vec3 sun=normalize(vec3(.1,1.,.1));
 float b=dot(ro,rd),c=dot(ro,ro)-1.,disc=b*b-c;
 vec3 color;float light=1.,far=1e6;
 if(disc<0.||b>0.){
#ifdef PASSAGE
   vec3 space=passageStars(p,t)*(1.-air);
#else
   vec3 space=stars(p,-exit*1.8+(t-60.)*.025,t)*(.75-.3*exit)*(1.-air);
#endif
   space+=vec3(.004,.009,.023);
   float miss=sqrt(max(0.,dot(ro,ro)-b*b))-1.;
   space+=exp(-max(miss,0.)*16.)*vec3(.10,.36,.80)*.7;
   color=mix(space,sky+exp((dot(rd,sun)-1.)*30.)*.35,air);
 }else{
   float hit=-b-sqrt(disc);far=hit;vec3 at=ro+rd*hit,n=normalize(at);
   float land=texture(uLand,earthUv(n,t)).r;
   light=.14+.86*max(0.,dot(n,normalize(vec3(-.5,.35,1))));
   vec3 sea=mix(vec3(.025,.17,.38),uInk*.85,ss(.3,.03,altitude));
   sea=mix(sea,mix(uInk,uWater,.6),low);
   // Swells resolve band by band as they come into scale, foreshortening toward the horizon
   vec3 waves=waveBand(at.xy,altitude,t,60.)+waveBand(at.xy,altitude,t,600.)+waveBand(at.xy,altitude,t,6000.)+waveBand(at.xy,altitude,t,24000.);
   float swell=waves.x/(waves.z+.001),glitter=waves.y/(waves.z+.001);
   float close=air*exp(-hit/(altitude*9.));
   sea*=1.+(swell-.5)*.75*close;
   vec3 ripple=normalize(n+vec3(swell-.5,glitter-.5,0)*.3*close);
   sea+=pow(max(dot(reflect(rd,ripple),sun),0.),60.)*air*vec3(.82,.88,.92)*.9;
   vec3 ground=mix(vec3(.16,.32,.22),vec3(.52,.45,.28),ss(.45,.9,land));
   color=mix(sea,ground,ss(.06,.3,land)*ss(.002,.05,altitude))*light;
   color+=pow(1.-max(0.,dot(n,-rd)),4.)*vec3(.09,.35,.62)*.65*(1.-air);
   color=mix(color,horizon,pow(sat(hit/sqrt(altitude*(altitude+2.))),3.)*air);
 }
 vec3 white=mix(vec3(.86,.9,.93),horizon,.4*air)*light;
 color=mix(color,white,cloudDeck(ro,rd,.012,altitude,t,128.,far)*.62);
 color=mix(color,white,cloudDeck(ro,rd,.06,altitude,t,64.,far)*.62);
 // A breath of mist as the camera passes through each deck: never a flash
 color=mix(color,vec3(.6,.77,.9),exp(-sq((altitude-.06)/.03))*.22+exp(-sq((altitude-.012)/.006))*.22);
 return color;
}
#ifdef PASSAGE
/**
 * The Passage's star tunnel, on its own clock t (0..${f(PASSAGE_END)}). The stars stream out of
 * the centre, accelerating as the pupil opens and stretching into streaks, then fall back to rest
 * while the planet grows out of a point ahead; at ${f(PASSAGE_END)} this is arrival(p,${f(PASSAGE_RESUME)})
 * exactly, the frame the arrival program picks up from.
 */
vec3 passageTunnel(vec2 p,float t){
 float x=sat((t-3.)/(${f(PASSAGE_END)}-3.));
 passageWarp=-40.*(1.-x*x*x*(x*(x*6.-15.)+10.));
 passageStreak=6.5*16.*x*x*(1.-x)*(1.-x);
 passageFar=exp(log(60.)*(1.-ss(13.,${f(PASSAGE_END)},t)));
 return arrival(p,t+${f(PASSAGE_RESUME - PASSAGE_END)});
}
#endif
#endif
${CREATION_SEQUENCE}
void main(){
 vec2 p=(vUv-.5)*vec2(uAspect,1.)*2.;float fit=max(1.,1.45/uAspect);p*=fit;
#if STAGE<5
#ifdef PASSAGE
 // Once the pupil has taken the whole screen the eye is gone: only the tunnel is left to draw
 vec3 color=uTime<${f(PASSAGE_EYE_END)}?originalSequence(p,uTime,length(vec2(uAspect*fit,fit))*1.06):passageTunnel(p,uTime)*uPortal;
#else
 vec3 color=originalSequence(p,uTime,length(vec2(uAspect*fit,fit))*1.06);
#endif
 // The original exponential tone map
 outColor=vec4(clamp(1.-exp(-max(color,vec3(0))*1.6),0.,1.),1.);
#else
 vec3 color=arrival(p,uTime);
 float alpha=1.;
 if(uTime>=76.){
   // The surface passes up through the camera, refracting a narrow meniscus.
   // Below it is the ACTUAL native ocean already drawn in this framebuffer.
   float passage=ss(76.,81.,uTime);
   float surface=mix(-.15,1.15,passage)+.025*sin(vUv.x*12.+uTime*1.6)*sin(PI*passage);
   alpha=ss(surface-.055,surface+.055,vUv.y);
   float edge=exp(-sq((vUv.y-surface)/.028))*sin(PI*passage);
   color=mix(color,uWater,ss(77.,80.5,uTime));color+=edge*vec3(.08,.13,.16);
 }
 // Retain the original exponential tone map; ease to the native ocean's linear ink.
 vec3 cosmic=1.-exp(-max(color,vec3(0))*1.6);
 color=mix(cosmic,color,ss(67.,76.,uTime));
 outColor=vec4(clamp(color,0.,1.),alpha);
#endif
}`;

const SCREEN = `#version 300 es
precision highp float;
uniform sampler2D uField;
uniform sampler2D uAtlas;
uniform sampler2D uNativeAtlas;
uniform vec2 uNativeGrid;
uniform float uNativeCount;
uniform vec2 uCanvas;
uniform vec2 uCell;
uniform vec2 uAnchor;
uniform vec3 uNativeInk;
uniform vec2 uAtlasGrid;
uniform float uCount;
uniform float uTime;
in vec2 vUv;
out vec4 outColor;
void main(){
 // Rows count down from the anchor, as in the ocean's own pass, so the lattices meet exactly
 vec2 coord=(vec2(gl_FragCoord.x,uCanvas.y-gl_FragCoord.y)-uAnchor)/uCell,cell=floor(coord),local=coord-cell;
 vec2 centre=((cell+.5)*uCell+uAnchor)/uCanvas;
 vec4 field=texture(uField,vec2(centre.x,1.-centre.y));
 float lum=dot(field.rgb,vec3(.30,.55,.15));
 float level=pow(clamp((lum-.035)*1.2,0.,1.),.72);
 float index=floor(level*(uCount-1.));
 vec2 atlas=vec2((mod(index,uAtlasGrid.x)+local.x)/uAtlasGrid.x,(floor(index/uAtlasGrid.x)+local.y)/uAtlasGrid.y);
 float glyph=textureGrad(uAtlas,atlas,dFdx(coord/uAtlasGrid),dFdy(coord/uAtlasGrid)).a;
 vec3 glow=texture(uField,vUv).rgb;
 float mx=max(max(field.r,field.g),field.b);
 vec3 hue=field.rgb/max(mx,.001);
 vec3 ink=hue*(.62+.7*mx);
 float ocean=smoothstep(71.,78.,uTime);
 float pick=fract(sin(dot(cell,vec2(127.1,311.7)))*43758.5453);
 float tone=mix(level,fract(pick*7.31),.6);
 float nativeIndex=max(1.,floor(tone*(uNativeCount-1.)));
 vec2 nativeUv=vec2((mod(nativeIndex,uNativeGrid.x)+local.x)/uNativeGrid.x,(floor(nativeIndex/uNativeGrid.x)+local.y)/uNativeGrid.y);
 float nativeGlyph=textureGrad(uNativeAtlas,nativeUv,dFdx(coord/uNativeGrid),dFdy(coord/uNativeGrid)).a;
 glyph=mix(glyph,nativeGlyph*step(pick,.42),smoothstep(70.,78.,uTime));
 // The water lifts as a whole; each glyph turns from cosmic light to ocean ink at its own moment,
 // so there is never a stretch where every glyph has the water's own brightness and disappears.
 float turned=clamp(ocean*1.7-pick*.7,0.,1.);
 vec3 color=glow*mix(.21,.99,ocean)+glyph*mix(ink*.88,(uNativeInk-glow)*.5,turned);
 outColor=vec4(clamp(color,0.,1.),field.a);
}`;

/** The ocean's own glyph lattice (device px), so the opening's grid can settle exactly onto it. */
export interface CreationLattice { cellW: number; cellH: number; startH: number; anchorX: number; anchorY: number; }
export interface CreationRenderer {
  /** Resolves once the land, the screen pass and the first transition can draw. */
  ready: Promise<void>;
  /** Whether the transition playing at this moment has finished compiling. */
  canDraw(time: number): boolean;
  /** A program failed to link after the opening had started. */
  failed(): boolean;
  draw(time: number, width: number, height: number, water: Float32Array, ink: Float32Array, native: Atlas, lattice: CreationLattice): void;
  destroy(): void;
}
export function createCreationRenderer(gl: WebGL2RenderingContext): CreationRenderer {
  // Compiled in the chosen journey's playing order (creationTimeline's journeyPrograms), without
  // ever waiting on the GPU on the main thread: a cold Direct3D compile takes seconds, and each
  // transition is ahead of the next by a world's length. If one is not there in time, the clock
  // holds at the seam (canDraw). The eye-only variant runs alongside. Programs a journey never
  // draws are never compiled; while the visitor is still choosing, the likeliest go first.
  type Key=JourneyProgram;
  let screen:Program|null=null,screenLink:LinkInProgress|null=null,broken=false,timer=0;
  let main:{key:Key;link:LinkInProgress}|null=null,eyeLink:LinkInProgress|null=null;
  let drewEyeOnly=false;
  const programs=new Map<Key,Program>(),linkedAt=new Map<Key,number>();
  const source=(key:Key)=>key==='eye'?field(0,true):key===PASSAGE_PROGRAM?field(0,true,true):field(key);
  /** An eye can open on its eye-only variant (pupil dark) while its full program compiles. */
  const opensOnEye=(program:number)=>program===0||program===PASSAGE_PROGRAM;
  const drawable=(t:number)=>{
    if(t>=81)return true;
    const program=journeyProgramAt(t);
    return programs.has(program)||(opensOnEye(program)&&t<EYE_ONLY_UNTIL&&programs.has('eye'));
  };
  let compiled:()=>void,refuse:(error:Error)=>void;
  const shadersReady=new Promise<void>((resolve,reject)=>{compiled=resolve;refuse=reject;});
  const pump=()=>{
    timer=0;
    if(disposed)return;
    if(!screen&&!screenLink)screenLink=beginLink(gl,SCREEN);
    const order=journeyPrograms();
    if(screen){
      if(!eyeLink&&order.includes('eye')&&!programs.has('eye'))eyeLink=beginLink(gl,source('eye'));
      const key=main?undefined:order.find(k=>k!=='eye'&&!programs.has(k));
      if(key!==undefined)main={key,link:beginLink(gl,source(key))};
    }
    const s=screenLink?.poll(),eye=eyeLink?.poll(),result=main?.link.poll();
    if(s===null||eye===null||result===null){broken=true;refuse(new Error('Creation shader compilation failed'));return;}
    const now=performance.now();
    if(s){screen=s;screenLink=null;}
    if(eye){programs.set('eye',eye);linkedAt.set('eye',now);eyeLink=null;}
    if(result&&main){programs.set(main.key,result);linkedAt.set(main.key,now);main=null;}
    if(screen&&drawable(journeyStart()))compiled();
    // Idle once the route is compiled; a journey chosen later wakes it (see wake)
    if(screenLink||eyeLink||main||order.some(k=>!programs.has(k)))timer=window.setTimeout(pump,s||eye||result?0:50);
  };
  const wake=()=>{if(!timer&&!disposed&&!broken)pump();};
  creation.listeners.add(wake);
  const atlas=buildAtlas(gl, ' .\'\x60^",:;Il!i><~+_-?][}{1)(|/tfjrxnuvczXYUJCLQ0OZmwqpdbkhao*#MW&8%B@$', "'IBM Plex Mono', monospace");
  const texture=gl.createTexture()!,landTexture=gl.createTexture()!,fbo=gl.createFramebuffer()!;
  for(const tex of [texture,landTexture]){
    gl.bindTexture(gl.TEXTURE_2D,tex);
    gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MIN_FILTER,gl.LINEAR);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MAG_FILTER,gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_WRAP_S,gl.CLAMP_TO_EDGE);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_WRAP_T,gl.CLAMP_TO_EDGE);
  }
  let disposed=false,cols=0,rows=0;
  pump();
  const land=loadLandDots().then(dots=>{
    if(disposed)return;
    // Rasterise once, from the already shared 3D land vectors. Never read pixels per frame.
    // Half resolution with overlapping dots: linear filtering then reads as coastline, not as a dot grid.
    const map=document.createElement('canvas');map.width=360;map.height=180;const ctx=map.getContext('2d')!;
    ctx.fillStyle='#000';ctx.fillRect(0,0,360,180);
    for(let i=0;i<dots.xyz.length;i+=3){
      const x=(Math.atan2(dots.xyz[i+1],dots.xyz[i])/Math.PI/2+.5)*360;
      const y=(Math.asin(dots.xyz[i+2])/Math.PI+.5)*180;
      const band=i/3<dots.bands[1]?110:i/3<dots.bands[2]?175:235;
      ctx.fillStyle=`rgb(${band},${band},${band})`;ctx.fillRect(x-1.1,y-1,2.2,2);
    }
    gl.activeTexture(gl.TEXTURE2);gl.bindTexture(gl.TEXTURE_2D,landTexture);gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL,false);
    gl.texImage2D(gl.TEXTURE_2D,0,gl.RGBA,gl.RGBA,gl.UNSIGNED_BYTE,map);
  });
  return {ready:Promise.all([land,shadersReady]).then(()=>undefined),
    canDraw:drawable,
    failed:()=>broken,
    draw(t,width,height,water,ink,native,lattice){
      const program=journeyProgramAt(t);
      const eyeOnly=programs.get('eye');
      const world=programs.get(program)??(opensOnEye(program)?eyeOnly:undefined);
      if(!world||!screen){
        // A journey's first program still compiling: hold the dark of space, never the water behind
        if(t<76){gl.clearColor(.003,.006,.012,1);gl.clear(gl.COLOR_BUFFER_BIT);}
        return;
      }
      if(world===eyeOnly)drewEyeOnly=true;
      // The field keeps the finest grid; only the glyph cells grow, continuously, from the anchor,
      // closing on the ocean's lattice. Eased, so the final cell size arrives at rest.
      const x=Math.max(0,Math.min(1,(t-70)/11)),blend=x*x*(3-2*x);
      const startW=lattice.startH*.6;
      const r=Math.ceil(height/lattice.startH),c=Math.ceil(width/startW);
      gl.activeTexture(gl.TEXTURE0);gl.bindTexture(gl.TEXTURE_2D,texture);
      if(c!==cols||r!==rows){cols=c;rows=r;gl.texImage2D(gl.TEXTURE_2D,0,gl.RGBA8,c,r,0,gl.RGBA,gl.UNSIGNED_BYTE,null);}
      gl.bindFramebuffer(gl.FRAMEBUFFER,fbo);gl.framebufferTexture2D(gl.FRAMEBUFFER,gl.COLOR_ATTACHMENT0,gl.TEXTURE_2D,texture,0);
      gl.disable(gl.BLEND);gl.viewport(0,0,c,r);gl.useProgram(world.program);
      const u=world.uniforms;gl.uniform1f(u.uTime,t);gl.uniform1f(u.uAspect,width/height);
      gl.uniform1f(u.uPortal,drewEyeOnly?Math.min(1,(performance.now()-(linkedAt.get(program)??0))/800):1);
      gl.uniform3fv(u.uWater,water.subarray(0,3));gl.uniform3fv(u.uInk,ink.subarray(0,3));
      gl.activeTexture(gl.TEXTURE2);gl.bindTexture(gl.TEXTURE_2D,landTexture);gl.uniform1i(u.uLand,2);
      gl.drawArrays(gl.TRIANGLES,0,3);
      gl.bindFramebuffer(gl.FRAMEBUFFER,null);gl.viewport(0,0,width,height);gl.useProgram(screen.program);
      const s=screen.uniforms;gl.activeTexture(gl.TEXTURE0);gl.bindTexture(gl.TEXTURE_2D,texture);gl.uniform1i(s.uField,0);
      gl.activeTexture(gl.TEXTURE1);gl.bindTexture(gl.TEXTURE_2D,atlas.texture);gl.uniform1i(s.uAtlas,1);
      gl.activeTexture(gl.TEXTURE3);gl.bindTexture(gl.TEXTURE_2D,native.texture);gl.uniform1i(s.uNativeAtlas,3);
      gl.uniform2f(s.uNativeGrid,...native.grid);gl.uniform1f(s.uNativeCount,native.count);
      gl.uniform2f(s.uCanvas,width,height);gl.uniform2f(s.uAnchor,lattice.anchorX,lattice.anchorY);
      gl.uniform2f(s.uCell,startW+(lattice.cellW-startW)*blend,lattice.startH+(lattice.cellH-lattice.startH)*blend);
      gl.uniform3fv(s.uNativeInk,ink.subarray(0,3));
      gl.uniform2f(s.uAtlasGrid,...atlas.grid);gl.uniform1f(s.uCount,atlas.count);gl.uniform1f(s.uTime,t);
      gl.enable(gl.BLEND);gl.blendFunc(gl.SRC_ALPHA,gl.ONE_MINUS_SRC_ALPHA);gl.drawArrays(gl.TRIANGLES,0,3);gl.disable(gl.BLEND);
    },
    destroy(){
      disposed=true;clearTimeout(timer);creation.listeners.delete(wake);
      screenLink?.cancel();main?.link.cancel();eyeLink?.cancel();
      for(const p of [screen,...programs.values()])if(p)gl.deleteProgram(p.program);
      gl.deleteTexture(texture);gl.deleteTexture(landTexture);gl.deleteTexture(atlas.texture);gl.deleteFramebuffer(fbo);
    }
  };
}
