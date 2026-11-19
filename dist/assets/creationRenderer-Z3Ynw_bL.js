import{c as Y,m as Z,n as V,o as $,p as P,q as ee,s as te,P as H,t as ae,u as oe,v as re,x as se,y as m,z as K,A as le}from"./portfolio-CBN130-0.js";import"./utils-Crv3BWuX.js";const ie=`
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
 float tw=.65+.35*sin(t*(1.5+4.*h2)+h2*60.);
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
vec2 godOffset(float t,float pt){float d=ss(7.,13.,pt);return vec2(.34*(1.-ss(-1.,6.,pt))+.006*sin(t*1.3)*(1.-d),.008*sin(t*.9)*(1.-d));}
float adamOffset(float t,float pt){return (.010*sin(t*.7+1.)+.02*(ss(3.,6.5,pt)-1.))*(1.-ss(7.,13.,pt));}
#endif
#if STAGE==0
vec3 eye(vec2 p,float t,float pt){
 float d=ss(5.5,12.,pt);float op=ss(-1.5,.25,pt);
 if(d<=0.)op*=1.-exp(-sq((mod(t,5.3)-5.)/.08));
 float xn=clamp(p.x/1.32,-1.6,1.6),lid=max(0.,1.-xn*xn),closed=-.06*lid-.02;
 float upper=mix(closed,.66*pow(lid,.7)+.04*xn,op),lower=mix(closed,-.46*pow(lid,.85)+.02*xn,min(1.,op*1.25));
 float du=upper-p.y,dl=p.y-lower,inside=ss(0.,.022,du)*ss(0.,.022,dl)*step(0.0001,lid);
 float r=length(p)+.000001,ao=.22+.78*ss(0.,.24,min(du,dl)),corner=1.-.5*ss(.5,1.,abs(xn));
 float v=fb3(p*3.3+vec2(3.1,-1.7),0.),veins=(1.-ss(0.,.03,abs(v-.5)))*ss(.48,1.,r);
 vec3 scl=mix(vec3(.93,.88,.84)*ao*corner,vec3(.8,.12,.10)*ao,veins*.75);
 scl=mix(scl,vec3(.85,.35,.38),exp(-(sq(p.x+1.13)/.006+sq(p.y+.01)/.004))*.8);
 float rp=.115*(1.+.07*sin(t*.8))*(1.+.55*d),tt=sat((r-rp)/(.4-rp));
 float a=atan(p.y,p.x),u=(a/TAU+.5)*48.;
 float f=fb3(vec2(u,r*7.-t*.03),48.),f2=fb2(vec2(u*.25,r*3.+5.),12.);
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
 float jy=(vn(vec2(p.x*70.+fk*13.,t*14.+fk*5.),0.)-.5)*.022*sin(PI*q);
 float yb=mix(at.y,gt.y,q)+jy;
 return exp(-sq((p.y-yb)/(.0025+cell*.55)))*step(at.x,p.x)*step(p.x,gt.x);
}
vec3 creationHands(vec2 p,float t,float pt,float zoom){
 p/=1.5;zoom*=1.5;vec2 go=godOffset(t,pt),ao=vec2(0,adamOffset(t,pt));float ca,cg;
 float da=handAdam(p-ao,ca),dg=handGod(p-go,cg);
 vec2 px=dFdx(p),py=dFdy(p),ga=sdfGradient(da,px,py),gg=sdfGradient(dg,px,py);
 vec2 b=p-vec2(1.15,.85);float a=atan(b.y,b.x);
 float rays=pow(.5+.5*cos(a*14.+2.*fb2(vec2(a*3.,t*.15),0.)),6.)*exp(-length(b)/1.6)*.35;
 vec3 color=rays*vec3(1,.78,.42)+ss(.45,.85,fb4(p*1.2+vec2(t*.03,0),0.))*.22*vec3(.35,.22,.55);
 float cell=max(.001,.01/zoom);float ba=ss(cell*.6,-cell*.6,da),bg=ss(cell*.6,-cell*.6,dg);
 if(da<cell)color=mix(color,handShade(p-ao,false,da,ca,ga),ba);
 if(dg<cell)color=mix(color,handShade(p-go,true,dg,cg,gg),bg);
 color+=vec3(1,.85,.55)*exp(-sq(max(da,0.)/(.014+cell)))*step(0.,da)*.35;
 color+=vec3(1,.82,.5)*exp(-sq(max(dg,0.)/(.014+cell)))*step(0.,dg)*.45;
 vec2 gt=vec2(.07,.02)+go,at=vec2(-.07,0)+ao,mid=(gt+at)*.5;
 float charge=ss(2.5,6.5,pt),q=sat((p.x-at.x)/max(.001,gt.x-at.x));
 float bolt=max(max(boltLine(p,t,q,at,gt,cell,0.),boltLine(p,t,q,at,gt,cell,1.)),boltLine(p,t,q,at,gt,cell,2.));
 float rr=length(p-mid),flash=ss(.6,1.,ss(7.,13.,pt));
 color+=bolt*charge*(.75+.25*sin(t*37.)*sin(t*23.))*1.6*vec3(.75,.9,1);
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
 float r=length(p)+.0001,a=atan(p.y,p.x),age=max(pt,0.),speed=.6+2.6*age,dist=.6*pt+1.3*age*age;
 vec3 outc=bangLayer(r,a,dist,speed,1.,90.,1.,vec3(.7,.85,1))+bangLayer(r,a,dist,speed,2.,150.,1.6,vec3(1,.75,.95))+bangLayer(r,a,dist,speed,3.,240.,2.4,vec3(.85,1,1));
 float neb=fb3(vec2((a/TAU+.5)*10.,2./(r+.08)+dist*2.),10.);
 float plasma=ss(.55,.95,neb)*ss(.05,.6,r)*(.10+.07*min(age,3.));
 float heat=exp(-max(pt+.3,0.)*1.6);
 return outc+plasma*vec3(.55,.25,.85)+plasma*plasma*.8*vec3(.2,.6,1)+exp(-r/(.12+heat))*(.25+1.3*heat)*vec3(1,.92,.8);
}
#endif
#if STAGE==2||STAGE==3
vec3 galaxy(vec2 p,float t){
 vec2 q=rot(.45)*p;q.y/=.58;float r=length(q)+.0001,a=atan(q.y,q.x),spiral=a+t*.10-2.3*log(r);
 vec2 gas=r*vec2(cos(a+t*.25/(r+.35)),sin(a+t*.25/(r+.35)));
 float arm=pow(.5+.5*cos(2.*spiral),3.),n=fb4(gas*4.,0.),dust=pow(.5+.5*cos(2.*spiral-.55),8.)*ss(.06,.3,r),disk=exp(-r/.45);
 float dens=disk*(.18+1.25*arm*(.35+.95*n))*(1.-.65*dust*n)*1.5;
 float bulge=exp(-sq(r/.13))*1.1+exp(-r/.02)*.9,knots=ss(.80,.95,vn(gas*26.,0.))*arm*disk*2.5;
 return dens*vec3(.45,.62,1)+bulge*vec3(1,.82,.52)+knots*vec3(1,.32,.62)+exp(-length(p)/.9)*.08*vec3(.5,.4,.9);
}
#endif
#if STAGE==3||STAGE==4
vec3 blackHole(vec2 p,float t){
 vec2 q=rot(.1)*p;float r=length(q)+.00001,a=atan(q.y,q.x),rh=.26;
 vec2 d=q/vec2(1,.19);float rd=length(d)+.00001,ad=atan(d.y,d.x);
 float n=fb3(vec2((ad-t*.9/(pow(rd,1.5)+.1))/TAU*24.,rd*9.),24.);
 float band=ss(rh*1.25,rh*1.7,rd)*ss(1.6,.75,rd),dop=1.+.7*(-d.x/rd);
 float disk=band*(.3+1.2*n*n)*pow(.55/rd,1.2)*dop;
 if(q.y>0.&&r<rh*1.02)disk=0.;
 float lr=r-rh*1.12,hn=fb2(vec2(a/TAU*20.-t*.5,r*10.),20.);
 float halo=(exp(-sq(lr/.05))+.3*exp(-max(lr,0.)/.12))*step(rh,r)*(.35+.9*hn)*(1.+.5*(-q.x/r))*(.55+.45*abs(sin(a)));
 float ring=exp(-sq((r-rh*1.03)/.012))*1.4,shadow=ss(rh*.97,rh*1.02,r);
 float I=((halo*.9+ring)*shadow+disk)*.9;
 return vec3(sat(I*1.9),pow(sat(I*1.6-.45),1.1),sat(I*2.2-1.35))+ring*shadow*.25*vec3(.6,.8,1);
}
#endif
`,ce=`
#if STAGE<5
#if STAGE==0
// The hands are by far the slowest to compile. A cold visit opens the eye on this variant, its
// pupil dark, while the full program compiles alongside; the hands then fade up inside the pupil.
uniform float uPortal;
vec3 thisWorld(vec2 p,float t,float pt,float zoom){return eye(p,t,pt);}
#if defined(PASSAGE)
// The Passage: no hands in this pupil, the star tunnel instead (creationRenderer's passageTunnel)
vec3 nextWorld(vec2 p,float t,float pt,float zoom){return passageTunnel(p,t)*uPortal;}
#elif defined(EYE_ONLY)
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
vec3 nextWorld(vec2 p,float t,float pt,float zoom){return arrival(p,t);}
#endif
vec3 originalSequence(vec2 p,float t,float rho){
 const int index=STAGE;
 float start=index==0?0.:index==1?12.:index==2?25.:index==3?33.:43.;
 float dur=index==0?12.:index==1?13.:index==2?8.:index==3?10.:11.;
 float hold=index==0?5.5:index==1?7.:index==2?1.:index==3?3.:3.5;
 float pt=t-start,s=sat((pt-hold)/(dur-hold)),e=s*s*(3.-2.*s);
#if STAGE==0
 float pr=.115*(1.+.07*sin(t*.8))*(1.+.55*e);
#else
 float pr=index==1?.045:index==2?.05:index==3?.035:.26*.97;
#endif
 vec2 portal=vec2(0);
#if STAGE==1
 portal=(vec2(.07,.02)+godOffset(t,pt)+vec2(-.07,adamOffset(t,pt)))*.75;
#endif
 float roll=index==0?.45:index==1?-.25:index==2?.6:index==3?-.5:.35;
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
`,ne=5.4,u=e=>e.toFixed(1),U=(e,f=!1,c=!1)=>`#version 300 es
#define STAGE ${e}
${f?"#define EYE_ONLY":""}
${c?"#define PASSAGE":""}
precision highp float;
uniform float uTime;
uniform float uAspect;
uniform vec3 uWater;
uniform vec3 uInk;
uniform sampler2D uLand;
in vec2 vUv;
out vec4 outColor;
${ie}
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
 * The Passage's star tunnel, on its own clock t (0..${u(m)}). The stars stream out of
 * the centre, accelerating as the pupil opens and stretching into streaks, then fall back to rest
 * while the planet grows out of a point ahead; at ${u(m)} this is arrival(p,${u(K)})
 * exactly, the frame the arrival program picks up from.
 */
vec3 passageTunnel(vec2 p,float t){
 float x=sat((t-3.)/(${u(m)}-3.));
 passageWarp=-40.*(1.-x*x*x*(x*(x*6.-15.)+10.));
 passageStreak=6.5*16.*x*x*(1.-x)*(1.-x);
 passageFar=exp(log(60.)*(1.-ss(13.,${u(m)},t)));
 return arrival(p,t+${u(K-m)});
}
#endif
#endif
${ce}
void main(){
 vec2 p=(vUv-.5)*vec2(uAspect,1.)*2.;float fit=max(1.,1.45/uAspect);p*=fit;
#if STAGE<5
#ifdef PASSAGE
 // Once the pupil has taken the whole screen the eye is gone: only the tunnel is left to draw
 vec3 color=uTime<${u(le)}?originalSequence(p,uTime,length(vec2(uAspect*fit,fit))*1.06):passageTunnel(p,uTime)*uPortal;
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
}`,fe=`#version 300 es
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
// The arrival's handoff (journeyHandoff.ts): 1 = whole, as always outside it
uniform float uReveal;
uniform float uRevealShape;
uniform float uRevealClock;
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
 if(uReveal<1.){
   // Cell by cell out of the arrival's dark, in the order of the destination's own shape: the eye
   // opens from a horizontal slit along its lid curve, the Earth gathers inward from its silhouette.
   // Same mapping as the field's p, so the shape sits exactly where the world will be.
   float aspect=uCanvas.x/uCanvas.y;
   vec2 q=(centre-.5)*vec2(aspect,1.)*2.*max(1.,1.45/aspect);
   float order;
   if(uRevealShape<.5){
     float xn=q.x/1.32,d=abs(q.y)/(.6*pow(max(0.,1.-xn*xn),.75)+.03);
     order=d/(1.+d);
   }else{
     float r=length(q)/.486;
     order=r<1.?(1.-r)*.42:.3+min(1.,(r-1.)/2.2)*.62;
   }
   float shown=clamp((uReveal*1.3-order*.8-pick*.2-.02)/.16,0.,1.);
   // Its edge decodes: the cells it is passing flicker through the ramp before they settle
   float front=shown*(1.-shown)*4.;
   float flick=fract(sin(dot(cell+floor(uRevealClock*16.),vec2(12.9898,78.233)))*43758.5453);
   float fi=floor(flick*(uCount-1.));
   vec2 fuv=vec2((mod(fi,uAtlasGrid.x)+local.x)/uAtlasGrid.x,(floor(fi/uAtlasGrid.x)+local.y)/uAtlasGrid.y);
   float decoding=textureGrad(uAtlas,fuv,dFdx(coord/uAtlasGrid),dFdy(coord/uAtlasGrid)).a*step(.5,pick+level);
   color=mix(vec3(.004,.012,.039),color,shown)+decoding*front*vec3(.59,.75,.84)*.7;
 }
 outColor=vec4(clamp(color,0.,1.),field.a);
}`;function ve(e){let f=null,c=null,q=!1,b=0,i=null,d=null,N=!1;const p=new Map,S=new Map,_=t=>t==="eye"?U(0,!0):t===H?U(0,!0,!0):U(t),C=t=>t===0||t===H,I=t=>{if(t>=81)return!0;const a=$(t);return p.has(a)||C(a)&&t<ne&&p.has("eye")};let F,D;const Q=new Promise((t,a)=>{F=t,D=a}),G=()=>{if(b=0,E)return;!f&&!c&&(c=P(e,fe));const t=ee();if(f){!d&&t.includes("eye")&&!p.has("eye")&&(d=P(e,_("eye")));const n=i?void 0:t.find(o=>o!=="eye"&&!p.has(o));n!==void 0&&(i={key:n,link:P(e,_(n))})}const a=c==null?void 0:c.poll(),s=d==null?void 0:d.poll(),l=i==null?void 0:i.link.poll();if(a===null||s===null||l===null){q=!0,D(new Error("Creation shader compilation failed"));return}const v=performance.now();a&&(f=a,c=null),s&&(p.set("eye",s),S.set("eye",v),d=null),l&&i&&(p.set(i.key,l),S.set(i.key,v),i=null),f&&I(te())&&F(),(c||d||i||t.some(n=>!p.has(n)))&&(b=window.setTimeout(G,a||s||l?0:50))},L=()=>{!b&&!E&&!q&&G()};Y.listeners.add(L);const y=Z(e," .'`^\",:;Il!i><~+_-?][}{1)(|/tfjrxnuvczXYUJCLQ0OZmwqpdbkhao*#MW&8%B@$","'IBM Plex Mono', monospace"),x=e.createTexture(),T=e.createTexture(),W=e.createFramebuffer();for(const t of[x,T])e.bindTexture(e.TEXTURE_2D,t),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_MIN_FILTER,e.LINEAR),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_MAG_FILTER,e.LINEAR),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_WRAP_S,e.CLAMP_TO_EDGE),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_WRAP_T,e.CLAMP_TO_EDGE);let E=!1,O=0,X=0;G();const J=V().then(t=>{if(E)return;const a=document.createElement("canvas");a.width=360,a.height=180;const s=a.getContext("2d");s.fillStyle="#000",s.fillRect(0,0,360,180);for(let l=0;l<t.xyz.length;l+=3){const v=(Math.atan2(t.xyz[l+1],t.xyz[l])/Math.PI/2+.5)*360,n=(Math.asin(t.xyz[l+2])/Math.PI+.5)*180,o=l/3<t.bands[1]?110:l/3<t.bands[2]?175:235;s.fillStyle=`rgb(${o},${o},${o})`,s.fillRect(v-1.1,n-1,2.2,2)}e.activeTexture(e.TEXTURE2),e.bindTexture(e.TEXTURE_2D,T),e.pixelStorei(e.UNPACK_FLIP_Y_WEBGL,!1),e.texImage2D(e.TEXTURE_2D,0,e.RGBA,e.RGBA,e.UNSIGNED_BYTE,a)});return{ready:Promise.all([J,Q]).then(()=>{}),canDraw:I,failed:()=>q,draw(t,a,s,l,v,n,o){const k=$(t),j=p.get("eye"),g=p.get(k)??(C(k)?j:void 0);if(!g||!f){t<76&&(e.clearColor(.003,.006,.012,1),e.clear(e.COLOR_BUFFER_BIT));return}g===j&&(N=!0);const R=Math.max(0,Math.min(1,(t-70)/11)),M=R*R*(3-2*R),z=o.startH*.6,A=Math.ceil(s/o.startH),w=Math.ceil(a/z);e.activeTexture(e.TEXTURE0),e.bindTexture(e.TEXTURE_2D,x),(w!==O||A!==X)&&(O=w,X=A,e.texImage2D(e.TEXTURE_2D,0,e.RGBA8,w,A,0,e.RGBA,e.UNSIGNED_BYTE,null)),e.bindFramebuffer(e.FRAMEBUFFER,W),e.framebufferTexture2D(e.FRAMEBUFFER,e.COLOR_ATTACHMENT0,e.TEXTURE_2D,x,0),e.disable(e.BLEND),e.viewport(0,0,w,A),e.useProgram(g.program);const h=g.uniforms;e.uniform1f(h.uTime,t),e.uniform1f(h.uAspect,a/s),e.uniform1f(h.uPortal,N?Math.min(1,(performance.now()-(S.get(k)??0))/800):1),e.uniform3fv(h.uWater,l.subarray(0,3)),e.uniform3fv(h.uInk,v.subarray(0,3)),e.activeTexture(e.TEXTURE2),e.bindTexture(e.TEXTURE_2D,T),e.uniform1i(h.uLand,2),e.drawArrays(e.TRIANGLES,0,3),e.bindFramebuffer(e.FRAMEBUFFER,null),e.viewport(0,0,a,s),e.useProgram(f.program);const r=f.uniforms;e.activeTexture(e.TEXTURE0),e.bindTexture(e.TEXTURE_2D,x),e.uniform1i(r.uField,0),e.activeTexture(e.TEXTURE1),e.bindTexture(e.TEXTURE_2D,y.texture),e.uniform1i(r.uAtlas,1),e.activeTexture(e.TEXTURE3),e.bindTexture(e.TEXTURE_2D,n.texture),e.uniform1i(r.uNativeAtlas,3),e.uniform2f(r.uNativeGrid,...n.grid),e.uniform1f(r.uNativeCount,n.count),e.uniform2f(r.uCanvas,a,s),e.uniform2f(r.uAnchor,o.anchorX,o.anchorY),e.uniform2f(r.uCell,z+(o.cellW-z)*M,o.startH+(o.cellH-o.startH)*M),e.uniform3fv(r.uNativeInk,v.subarray(0,3)),e.uniform2f(r.uAtlasGrid,...y.grid),e.uniform1f(r.uCount,y.count),e.uniform1f(r.uTime,t);const B=performance.now();e.uniform1f(r.uReveal,ae(B)),e.uniform1f(r.uRevealClock,oe(B)),e.uniform1f(r.uRevealShape,re(se.journey)==="planet"?1:0),e.enable(e.BLEND),e.blendFunc(e.SRC_ALPHA,e.ONE_MINUS_SRC_ALPHA),e.drawArrays(e.TRIANGLES,0,3),e.disable(e.BLEND)},destroy(){E=!0,clearTimeout(b),Y.listeners.delete(L),c==null||c.cancel(),i==null||i.link.cancel(),d==null||d.cancel();for(const t of[f,...p.values()])t&&e.deleteProgram(t.program);e.deleteTexture(x),e.deleteTexture(T),e.deleteTexture(y.texture),e.deleteFramebuffer(W)}}}export{ve as createCreationRenderer};
