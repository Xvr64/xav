/**
 * GLSL adaptation of Eye / Creation / BigBang / Galaxy / BlackHole and Engine.colour
 * from Mohammd Asadi's eye_of_creation.py, MIT, copyright 2026 Mohammd Asadi.
 * Full notice: public/licenses/eye-of-creation.txt. Original constants and SDF control
 * points retained. NumPy arrays become fragments at character-grid resolution.
 * Browser adaptations: stable value-noise hash, SDF normals from screen derivatives, no glitch cuts.
 *
 * Written for the Direct3D shader compiler, which inlines every call and unrolls every loop:
 * one uber-shader of all the worlds takes it minutes and can hang the GPU process. So each
 * transition is its own program (STAGE, its world and the next, each called once) and the
 * noise, finger, star and spark loops are spelled out as helpers with the same arithmetic.
 */
export const CREATION_WORLDS = `
const float PI=3.14159265359;
const float TAU=6.28318530718;
float sat(float x){return clamp(x,0.,1.);}
float ss(float a,float b,float x){float f=sat((x-a)/(b-a));return f*f*(3.-2.*f);}
float sq(float x){return x*x;}
mat2 rot(float a){return mat2(cos(a),sin(a),-sin(a),cos(a));}
float hash(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453);}
float vn(vec2 p,float period){
 vec2 i=floor(p),f=fract(p),u=f*f*(3.-2.*f);vec2 j=i+1.;
 if(period>0.){i.x=mod(i.x,period);j.x=mod(j.x,period);}
 return mix(mix(hash(i),hash(vec2(j.x,i.y)),u.x),mix(hash(vec2(i.x,j.y)),hash(j),u.x),u.y);
}
float octave(inout vec2 p,inout float period,inout float amp,inout float norm){
 float v=amp*vn(p,period);norm+=amp;amp*=.5;
 if(period>0.){p=p*2.+vec2(0,7.3);period*=2.;}else p=p*2.03+vec2(17.1,-9.2);
 return v;
}
float fb2(vec2 p,float q){float s=0.,a=.5,n=0.;s+=octave(p,q,a,n);s+=octave(p,q,a,n);return s/n;}
float fb3(vec2 p,float q){float s=0.,a=.5,n=0.;s+=octave(p,q,a,n);s+=octave(p,q,a,n);s+=octave(p,q,a,n);return s/n;}
float fb4(vec2 p,float q){float s=0.,a=.5,n=0.;s+=octave(p,q,a,n);s+=octave(p,q,a,n);s+=octave(p,q,a,n);s+=octave(p,q,a,n);return s/n;}
vec3 stars1(vec2 p,float logz,float t,float r,float a,float N,float K,float par,float seed){
 vec2 uv=vec2((a/TAU+.5)*N,(log(r)-par*logz)*K),c=floor(uv);c.x=mod(c.x,N);
 float h=hash(c+vec2(seed*1013.,0)),h2=hash(c+vec2(77,seed*389.));
 float arc=(fract(uv.x)-(.25+.5*h2))*TAU*r/N,rad=(fract(uv.y)-.5)*r/K;
 float tw=.65+.35*sin((t+uAmbient)*(1.5+4.*h2)+h2*60.);
 return step(h,clamp(26.*TAU*r*r/(N*K),0.,.9))*exp(-(arc*arc+rad*rad)/.00022)*(.35+.9*h2)*tw*mix(vec3(.65,.78,1),vec3(1,.85,.7),h2);
}
vec3 stars(vec2 p,float logz,float t){
 float r=length(p)+.00001,a=atan(p.y,p.x);
 return stars1(p,logz,t,r,a,120.,8.,.22,1.)+stars1(p,logz,t,r,a,220.,14.,.45,5.);
}
#if STAGE<=1&&!defined(EYE_ONLY)
float cap(vec2 p,vec2 a,vec2 b,float ra,float rb){vec2 ba=b-a;float h=sat(dot(p-a,ba)/dot(ba,ba));return length(p-a-ba*h)-mix(ra,rb,h);}
float sm(float a,float b,float k){float h=sat(.5+.5*(b-a)/k);return mix(b,a,h)-k*h*(1.-h);}
float finger(vec2 p,vec2 a,vec2 b,vec2 c,vec3 r){return sm(cap(p,a,b,r.x,r.y),cap(p,b,c,r.y,r.z),.012);}
void joinPart(inout float d,float part,inout float first,inout float second){
 d=sm(d,part,.03);second=min(second,max(first,part));first=min(first,part);
}
float handAdam(vec2 p,out float crease){
 float d,first,second=10.;
 d=cap(p,vec2(-2.9,-.55),vec2(-1.12,-.20),.19,.135);
 d=sm(d,cap(p,vec2(-1.12,-.20),vec2(-.66,-.10),.135,.12),.06);
 d=sm(d,cap(p,vec2(-1.,-.24),vec2(-.70,-.17),.11,.09),.05);first=d;
 joinPart(d,finger(p,vec2(-.64,-.05),vec2(-.36,-.005),vec2(-.07,0),vec3(.052,.045,.036)),first,second);
 joinPart(d,finger(p,vec2(-.65,-.11),vec2(-.43,-.16),vec2(-.29,-.25),vec3(.050,.044,.036)),first,second);
 joinPart(d,finger(p,vec2(-.69,-.15),vec2(-.51,-.23),vec2(-.41,-.32),vec3(.046,.041,.034)),first,second);
 joinPart(d,finger(p,vec2(-.73,-.19),vec2(-.61,-.27),vec2(-.55,-.34),vec3(.040,.036,.030)),first,second);
 joinPart(d,finger(p,vec2(-.90,-.06),vec2(-.66,.06),vec2(-.47,.075),vec3(.060,.048,.038)),first,second);
 crease=exp(-(first*first+second*second)/.00013)*ss(0.,-.012,d);return d;
}
float handGod(vec2 p,out float crease){
 float d,first,second=10.;
 d=cap(p,vec2(2.9,.62),vec2(1.15,.22),.21,.145);
 d=sm(d,cap(p,vec2(1.15,.22),vec2(.68,.09),.145,.12),.06);
 d=sm(d,cap(p,vec2(1.02,.25),vec2(.72,.16),.11,.09),.05);first=d;
 joinPart(d,finger(p,vec2(.66,.06),vec2(.37,.03),vec2(.07,.02),vec3(.054,.046,.037)),first,second);
 joinPart(d,finger(p,vec2(.67,.13),vec2(.45,.17),vec2(.34,.09),vec3(.050,.044,.038)),first,second);
 joinPart(d,finger(p,vec2(.71,.18),vec2(.53,.22),vec2(.45,.14),vec3(.047,.041,.035)),first,second);
 joinPart(d,finger(p,vec2(.76,.22),vec2(.62,.26),vec2(.56,.19),vec3(.041,.037,.031)),first,second);
 joinPart(d,finger(p,vec2(.88,.04),vec2(.66,-.05),vec2(.50,-.065),vec3(.060,.048,.039)),first,second);
 crease=exp(-(first*first+second*second)/.00013)*ss(0.,-.012,d);return d;
}
// The SDF's gradient from its screen derivatives: the normal without evaluating a hand again.
vec2 sdfGradient(float d,vec2 px,vec2 py){
 float dx=dFdx(d),dy=dFdy(d),det=px.x*py.y-px.y*py.x;
 return abs(det)<1e-14?vec2(0):vec2(dx*py.y-dy*px.y,px.x*dy-py.x*dx)/det;
}
vec3 handShade(vec2 p,bool god,float d,float crease,vec2 g){
 float q=sat(-d/.075);float slope=(1.-q)/sqrt(max(.015,1.-sq(1.-q)));
 vec3 n=normalize(vec3(g*slope,1.));
 float diff=max(0.,dot(n,normalize(vec3(-.45,.75,.48))));
 float fill=max(0.,dot(n,vec3(.35,-.65,.4)))*.35;
 float spec=pow(max(0.,dot(n,vec3(-.3,.55,.78))),24.)*.6;
 vec3 base=god?vec3(1,.76,.55):vec3(1,.70,.48);
 if(god)base=mix(base,vec3(.78,.30,.50),ss(1.02,1.10,p.x+.3*p.y)*sat(.6+.6*fb3(p*vec2(9,3),0.)));
 return base*(.12+1.25*pow(diff,1.4)+fill)*(.92+.16*vn(p*45.,0.))*(1.-.7*crease)+spec*(1.-crease)*vec3(1,.95,.85);
}
vec2 godOffset(float t,float pt){float d=ss(1.8,4.5,pt),a=t+uAmbient;return vec2(.34*(1.-ss(-.8,1.5,pt))+.006*sin(a*1.3)*(1.-d),.008*sin(a*.9)*(1.-d));}
float adamOffset(float t,float pt){float d=ss(1.8,4.5,pt),a=t+uAmbient;return (.010*sin(a*.7+1.)+.02*(ss(.4,1.6,pt)-1.))*(1.-d);}
#endif
#if STAGE==0
vec3 eye(vec2 p,float t,float pt){
 float d=ss(1.,4.,pt),op=ss(-.5,0.,pt),amb=t+uAmbient;
 if(d<=0.)op*=1.-exp(-sq((mod(uAmbient+2.5,5.3)-5.)/.08));
 float xn=clamp(p.x/1.32,-1.6,1.6),lid=max(0.,1.-xn*xn),closed=-.06*lid-.02;
 float upper=mix(closed,.66*pow(lid,.7)+.04*xn,op),lower=mix(closed,-.46*pow(lid,.85)+.02*xn,min(1.,op*1.25));
 float du=upper-p.y,dl=p.y-lower,inside=ss(0.,.022,du)*ss(0.,.022,dl)*step(0.0001,lid);
 float r=length(p)+.000001,ao=.22+.78*ss(0.,.24,min(du,dl)),corner=1.-.5*ss(.5,1.,abs(xn));
 float v=fb3(p*3.3+vec2(3.1,-1.7),0.),veins=(1.-ss(0.,.03,abs(v-.5)))*ss(.48,1.,r);
 vec3 scl=mix(vec3(.93,.88,.84)*ao*corner,vec3(.8,.12,.10)*ao,veins*.75);
 scl=mix(scl,vec3(.85,.35,.38),exp(-(sq(p.x+1.13)/.006+sq(p.y+.01)/.004))*.8);
 float rp=.115*(1.+.07*sin(amb*.8))*(1.+.55*d),tt=sat((r-rp)/(.4-rp));
 float a=atan(p.y,p.x),u=(a/TAU+.5)*48.;
 float f=fb3(vec2(u,r*7.-amb*.03),48.),f2=fb2(vec2(u*.25,r*3.+5.),12.);
 float fib=clamp(.22+1.15*pow(f,1.6)+.35*(f2-.5),0.,2.);
 vec3 ic=mix(vec3(1,.6,.16),vec3(.10,.52,.48),ss(.18,.85,tt+.15*(f2-.5)));
 vec3 iris=ic*(fib+.55*exp(-sq((tt-.27)/.07))*f)*(1.-.88*ss(.78,1.,tt))*ss(0.,.07,tt)*(.42+.58*ss(0.,.22,du));
 float pm=ss(rp+.006,rp-.006,r);vec3 ball=mix(scl,iris,ss(.412,.388,r))*(1.-pm);
 ball+=(1.-pm)*(exp(-(sq(p.x+.14)+sq(p.y-.14))/.0018)*1.9+exp(-(sq(p.x-.10)+sq(p.y+.10))/.0005)*.9);
 float sk=fb3(p*2.2+vec2(0,4),0.),crease=exp(-sq((p.y-(.66*pow(lid,.55)+.17))/.035))*lid;
 vec3 skin=vec3(.62,.36,.26)*(.42+.75*sk)*(.22+.78*ss(0.,.13,min(abs(du),abs(dl))))*(1.-.7*crease)*exp(-(p.x*p.x/5.+p.y*p.y/1.5));
 skin+=vec3(.9,.42,.42)*exp(-sq((dl+.014)/.012))*lid*op*.8;
 return mix(skin,ball,inside);
}
#endif
#if STAGE<=1&&!defined(EYE_ONLY)
float boltLine(vec2 p,float t,float q,vec2 at,vec2 gt,float cell,float fk){
 float jy=(vn(vec2(p.x*70.+fk*13.,(t+uAmbient)*14.+fk*5.),0.)-.5)*.022*sin(PI*q);
 float yb=mix(at.y,gt.y,q)+jy;
 return exp(-sq((p.y-yb)/(.0025+cell*.55)))*step(at.x,p.x)*step(p.x,gt.x);
}
vec3 creationHands(vec2 p,float t,float pt,float zoom){
 float amb=t+uAmbient;
 p/=1.5;zoom*=1.5;vec2 go=godOffset(t,pt),ao=vec2(0,adamOffset(t,pt));float ca,cg;
 float da=handAdam(p-ao,ca),dg=handGod(p-go,cg);
 vec2 px=dFdx(p),py=dFdy(p),ga=sdfGradient(da,px,py),gg=sdfGradient(dg,px,py);
 vec2 b=p-vec2(1.15,.85);float a=atan(b.y,b.x);
 float rays=pow(.5+.5*cos(a*14.+2.*fb2(vec2(a*3.,amb*.15),0.)),6.)*exp(-length(b)/1.6)*.35;
 vec3 color=rays*vec3(1,.78,.42)+ss(.45,.85,fb4(p*1.2+vec2(amb*.03,0),0.))*.22*vec3(.35,.22,.55);
 float cell=max(.001,.01/zoom);float ba=ss(cell*.6,-cell*.6,da),bg=ss(cell*.6,-cell*.6,dg);
 if(da<cell)color=mix(color,handShade(p-ao,false,da,ca,ga),ba);
 if(dg<cell)color=mix(color,handShade(p-go,true,dg,cg,gg),bg);
 color+=vec3(1,.85,.55)*exp(-sq(max(da,0.)/(.014+cell)))*step(0.,da)*.35;
 color+=vec3(1,.82,.5)*exp(-sq(max(dg,0.)/(.014+cell)))*step(0.,dg)*.45;
 vec2 gt=vec2(.07,.02)+go,at=vec2(-.07,0)+ao,mid=(gt+at)*.5;
 float charge=ss(.3,1.6,pt),q=sat((p.x-at.x)/max(.001,gt.x-at.x));
 float bolt=max(max(boltLine(p,t,q,at,gt,cell,0.),boltLine(p,t,q,at,gt,cell,1.)),boltLine(p,t,q,at,gt,cell,2.));
 float rr=length(p-mid),flash=ss(.6,1.,ss(1.8,4.5,pt));
 color+=bolt*charge*(.75+.25*sin(amb*37.)*sin(amb*23.))*1.6*vec3(.75,.9,1);
 color+=exp(-rr*zoom/(.03+.07*charge))*charge*1.3*vec3(1,.9,.7);
 return color+exp(-rr*zoom/(.25+2.*flash))*flash*1.6*vec3(1,.97,.9);
}
#endif
#if STAGE==1||STAGE==2
vec3 bangLayer(float r,float a,float dist,float speed,float seed,float N,float K,vec3 tint){
 vec2 uv=vec2((a/TAU+.5)*N+seed*.37,K/r+dist*1.5),c=floor(uv);
 float h=hash(vec2(mod(c.x,N)+seed*7919.,c.y)),h2=hash(c+vec2(31,seed*104729.));
 float arc=(fract(uv.x)-(.3+.4*h2))*TAU*r/N,radial=sat(1.-abs(fract(uv.y)-.5)/min(.48,.04+speed*.05));
 float star=step(.8,h)*exp(-sq(arc/.010))*radial*ss(.03,.35,r);
 return star*(.5+.9*h2)*1.4*tint;
}
vec3 bang(vec2 p,float t,float pt){
 float r=length(p)+.0001,a=atan(p.y,p.x),age=max(pt,0.)*2.5,speed=.6+2.6*age,dist=1.5*pt+1.3*age*age;
 vec3 outc=bangLayer(r,a,dist,speed,1.,90.,1.,vec3(.7,.85,1))+bangLayer(r,a,dist,speed,2.,150.,1.6,vec3(1,.75,.95))+bangLayer(r,a,dist,speed,3.,240.,2.4,vec3(.85,1,1));
 float neb=fb3(vec2((a/TAU+.5)*10.,2./(r+.08)+dist*2.),10.);
 float plasma=ss(.55,.95,neb)*ss(.05,.6,r)*(.10+.07*min(age,3.));
 float heat=exp(-max(pt*2.5+.3,0.)*1.6);
 return outc+plasma*vec3(.55,.25,.85)+plasma*plasma*.8*vec3(.2,.6,1)+exp(-r/(.12+heat))*(.25+1.3*heat)*vec3(1,.92,.8);
}
#endif
#if STAGE==2||STAGE==3
vec3 galaxy(vec2 p,float t){
 float amb=t+uAmbient;
 vec2 q=rot(.45)*p;q.y/=.58;float r=length(q)+.0001,a=atan(q.y,q.x),spiral=a+amb*.16-2.3*log(r);
 vec2 gas=r*vec2(cos(a+amb*.35/(r+.35)),sin(a+amb*.35/(r+.35)));
 float arm=pow(.5+.5*cos(2.*spiral),3.),n=fb4(gas*4.,0.),dust=pow(.5+.5*cos(2.*spiral-.55),8.)*ss(.06,.3,r),disk=exp(-r/.45);
 float dens=disk*(.18+1.25*arm*(.35+.95*n))*(1.-.65*dust*n)*1.5;
 float bulge=exp(-sq(r/.13))*1.1+exp(-r/.02)*.9,knots=ss(.80,.95,vn(gas*26.,0.))*arm*disk*2.5;
 return dens*vec3(.45,.62,1)+bulge*vec3(1,.82,.52)+knots*vec3(1,.32,.62)+exp(-length(p)/.9)*.08*vec3(.5,.4,.9);
}
#endif
#if STAGE==3||STAGE==4
vec3 blackHole(vec2 p,float t){
 float amb=t+uAmbient;
 vec2 q=rot(.1)*p;float r=length(q)+.00001,a=atan(q.y,q.x),rh=.26;
 vec2 d=q/vec2(1,.19);float rd=length(d)+.00001,ad=atan(d.y,d.x);
 float n=fb3(vec2((ad-amb*1.2/(pow(rd,1.5)+.1))/TAU*24.,rd*9.),24.);
 float band=ss(rh*1.25,rh*1.7,rd)*ss(1.6,.75,rd),dop=1.+.7*(-d.x/rd);
 float disk=band*(.3+1.2*n*n)*pow(.55/rd,1.2)*dop;
 if(q.y>0.&&r<rh*1.02)disk=0.;
 float lr=r-rh*1.12,hn=fb2(vec2(a/TAU*20.-amb*.65,r*10.),20.);
 float halo=(exp(-sq(lr/.05))+.3*exp(-max(lr,0.)/.12))*step(rh,r)*(.35+.9*hn)*(1.+.5*(-q.x/r))*(.55+.45*abs(sin(a)));
 float ring=exp(-sq((r-rh*1.03)/.012))*1.4,shadow=ss(rh*.97,rh*1.02,r);
 float I=((halo*.9+ring)*shadow+disk)*.9;
 return vec3(sat(I*1.9),pow(sat(I*1.6-.45),1.1),sat(I*2.2-1.35))+ring*shadow*.25*vec3(.6,.8,1);
}
#endif
`;

/** The transition STAGE plays: its world, its portal, and the next world seen through it. */
export const CREATION_SEQUENCE = `
#if STAGE<5
#if STAGE==0
// The hands are by far the slowest to compile. A cold visit opens the eye on this variant, its
// pupil dark, while the full program compiles alongside; the hands then fade up inside the pupil.
uniform float uPortal;
vec3 thisWorld(vec2 p,float t,float pt,float zoom){return eye(p,t,pt);}
#ifdef EYE_ONLY
vec3 nextWorld(vec2 p,float t,float pt,float zoom){return vec3(0);}
#else
vec3 nextWorld(vec2 p,float t,float pt,float zoom){return creationHands(p,t,pt,zoom)*uPortal;}
#endif
#elif STAGE==1
vec3 thisWorld(vec2 p,float t,float pt,float zoom){return creationHands(p,t,pt,zoom);}
vec3 nextWorld(vec2 p,float t,float pt,float zoom){return bang(p,t,pt);}
#elif STAGE==2
vec3 thisWorld(vec2 p,float t,float pt,float zoom){return bang(p,t,pt);}
vec3 nextWorld(vec2 p,float t,float pt,float zoom){return galaxy(p,t)+stars(p,0.,t)*.65;}
#elif STAGE==3
vec3 thisWorld(vec2 p,float t,float pt,float zoom){return galaxy(p,t)+stars(p,0.,t)*.65;}
vec3 nextWorld(vec2 p,float t,float pt,float zoom){return blackHole(p,t)+stars(p,0.,t)*ss(.30,.4,length(p))*.45;}
#else
vec3 thisWorld(vec2 p,float t,float pt,float zoom){return blackHole(p,t)+stars(p,0.,t)*ss(.30,.4,length(p))*.45;}
vec3 nextWorld(vec2 p,float t,float pt,float zoom){return arrival(p,t)*ss(15.2,16.1,t);}
#endif
vec3 originalSequence(vec2 p,float t,float rho){
 const int index=STAGE;
 float start=index==0?0.:index==1?4.:index==2?8.5:index==3?11.5:15.;
 float dur=index==0?4.:index==1?4.5:index==2?3.:index==3?3.5:3.5;
 float hold=index==0?1.:index==1?1.8:index==2?.35:index==3?.8:.9;
 float pt=t-start,s=sat((pt-hold)/(dur-hold)),e=s*s*(3.-2.*s);
#if STAGE==0
 float pr=.115*(1.+.07*sin((t+uAmbient)*.8))*(1.+.55*e);
#else
 float pr=index==1?.045:index==2?.05:index==3?.035:.26*.97;
#endif
 vec2 portal=vec2(0);
#if STAGE==1
 portal=(vec2(.07,.02)+godOffset(t,pt)+vec2(-.07,adamOffset(t,pt)))*.75;
#endif
 float roll=index==0?.25:index==1?-.16:index==2?.32:index==3?-.28:.2;
 float zoom=exp(e*log(rho/pr));vec2 q=rot(roll*sin(PI*e))*p,centre=portal*(1.-pow(1.-e,3.));
 vec3 col=thisWorld(centre+q/zoom,t,pt,zoom);
 vec2 delta=q-(portal-centre)*zoom;float radius=pr*zoom;
 vec2 inside=delta/radius*rho;
#if STAGE==0||STAGE==4
 float mask=ss(radius+.006+.015*radius,radius-.006-.015*radius,length(delta));
 col=mix(col,nextWorld(inside,t,pt-dur,1.),mask);
#else
 float alpha=index==1?ss(.72,1.,s):index==3?ss(.2,.85,s):ss(.35,1.,s);
 float weight=alpha+(1.-alpha)*(index==2?.55:0.);
 col=col*(1.-alpha)+nextWorld(inside,t,pt-dur,1.)*weight;
#endif
 return col;
}
#endif
`;
