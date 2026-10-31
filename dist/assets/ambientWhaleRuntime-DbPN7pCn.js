var Gc=Object.defineProperty;var Hc=(n,e,t)=>e in n?Gc(n,e,{enumerable:!0,configurable:!0,writable:!0,value:t}):n[e]=t;var Xe=(n,e,t)=>Hc(n,typeof e!="symbol"?e+"":e,t);import{l as Vc,c as Wc,a as Nl,w as Rn,b as Bt,g as Xc,r as qc,d as Cn,i as Yc,e as $t,f as Kc,h as $c,j as Mo,k as Zc,s as jc}from"./index-DquDwuKy.js";/**
 * @license
 * Copyright 2010-2024 Three.js Authors
 * SPDX-License-Identifier: MIT
 */const Ja="170",Jc=0,So=1,Qc=2,Fl=1,eu=2,xn=3,Xn=0,Rt=1,ln=2,Gn=0,Di=1,yo=2,Eo=3,To=4,hs=5,ni=100,tu=101,nu=102,iu=103,su=104,ru=200,fs=201,au=202,ou=203,oa=204,ui=205,lu=206,cu=207,uu=208,hu=209,fu=210,du=211,pu=212,mu=213,gu=214,la=0,ca=1,ua=2,Fi=3,ha=4,fa=5,da=6,pa=7,Ol=0,_u=1,vu=2,Hn=0,xu=1,Mu=2,Su=3,yu=4,Eu=5,Tu=6,Au=7,Bl=300,Oi=301,Bi=302,ma=303,ga=304,mr=306,_a=1e3,ri=1001,va=1002,ft=1003,bu=1004,bs=1005,Gt=1006,Er=1007,ai=1008,sn=1009,zl=1010,kl=1011,ds=1012,Qa=1013,hi=1014,un=1015,xs=1016,eo=1017,to=1018,zi=1020,Gl=35902,Hl=1021,Vl=1022,Ht=1023,Wl=1024,Xl=1025,Li=1026,ki=1027,ql=1028,no=1029,Yl=1030,io=1031,so=1033,Js=33776,Qs=33777,er=33778,tr=33779,xa=35840,Ma=35841,Sa=35842,ya=35843,Ea=36196,Ta=37492,Aa=37496,ba=37808,wa=37809,Ra=37810,Ca=37811,Pa=37812,Da=37813,La=37814,Ia=37815,Ua=37816,Na=37817,Fa=37818,Oa=37819,Ba=37820,za=37821,nr=36492,ka=36494,Ga=36495,Kl=36283,Ha=36284,Va=36285,Wa=36286,wu=3200,Ru=3201,Cu=0,Pu=1,Bn="",kt="srgb",qi="srgb-linear",gr="linear",Je="srgb",di=7680,Ao=519,Du=512,Lu=513,Iu=514,$l=515,Uu=516,Nu=517,Fu=518,Ou=519,bo=35044,zn="300 es",Mn=2e3,or=2001;class Yi{addEventListener(e,t){this._listeners===void 0&&(this._listeners={});const i=this._listeners;i[e]===void 0&&(i[e]=[]),i[e].indexOf(t)===-1&&i[e].push(t)}hasEventListener(e,t){if(this._listeners===void 0)return!1;const i=this._listeners;return i[e]!==void 0&&i[e].indexOf(t)!==-1}removeEventListener(e,t){if(this._listeners===void 0)return;const s=this._listeners[e];if(s!==void 0){const r=s.indexOf(t);r!==-1&&s.splice(r,1)}}dispatchEvent(e){if(this._listeners===void 0)return;const i=this._listeners[e.type];if(i!==void 0){e.target=this;const s=i.slice(0);for(let r=0,a=s.length;r<a;r++)s[r].call(this,e);e.target=null}}}const xt=["00","01","02","03","04","05","06","07","08","09","0a","0b","0c","0d","0e","0f","10","11","12","13","14","15","16","17","18","19","1a","1b","1c","1d","1e","1f","20","21","22","23","24","25","26","27","28","29","2a","2b","2c","2d","2e","2f","30","31","32","33","34","35","36","37","38","39","3a","3b","3c","3d","3e","3f","40","41","42","43","44","45","46","47","48","49","4a","4b","4c","4d","4e","4f","50","51","52","53","54","55","56","57","58","59","5a","5b","5c","5d","5e","5f","60","61","62","63","64","65","66","67","68","69","6a","6b","6c","6d","6e","6f","70","71","72","73","74","75","76","77","78","79","7a","7b","7c","7d","7e","7f","80","81","82","83","84","85","86","87","88","89","8a","8b","8c","8d","8e","8f","90","91","92","93","94","95","96","97","98","99","9a","9b","9c","9d","9e","9f","a0","a1","a2","a3","a4","a5","a6","a7","a8","a9","aa","ab","ac","ad","ae","af","b0","b1","b2","b3","b4","b5","b6","b7","b8","b9","ba","bb","bc","bd","be","bf","c0","c1","c2","c3","c4","c5","c6","c7","c8","c9","ca","cb","cc","cd","ce","cf","d0","d1","d2","d3","d4","d5","d6","d7","d8","d9","da","db","dc","dd","de","df","e0","e1","e2","e3","e4","e5","e6","e7","e8","e9","ea","eb","ec","ed","ee","ef","f0","f1","f2","f3","f4","f5","f6","f7","f8","f9","fa","fb","fc","fd","fe","ff"],Tr=Math.PI/180,Xa=180/Math.PI;function Ms(){const n=Math.random()*4294967295|0,e=Math.random()*4294967295|0,t=Math.random()*4294967295|0,i=Math.random()*4294967295|0;return(xt[n&255]+xt[n>>8&255]+xt[n>>16&255]+xt[n>>24&255]+"-"+xt[e&255]+xt[e>>8&255]+"-"+xt[e>>16&15|64]+xt[e>>24&255]+"-"+xt[t&63|128]+xt[t>>8&255]+"-"+xt[t>>16&255]+xt[t>>24&255]+xt[i&255]+xt[i>>8&255]+xt[i>>16&255]+xt[i>>24&255]).toLowerCase()}function bt(n,e,t){return Math.max(e,Math.min(t,n))}function Bu(n,e){return(n%e+e)%e}function Ar(n,e,t){return(1-t)*n+t*e}function Qi(n,e){switch(e.constructor){case Float32Array:return n;case Uint32Array:return n/4294967295;case Uint16Array:return n/65535;case Uint8Array:return n/255;case Int32Array:return Math.max(n/2147483647,-1);case Int16Array:return Math.max(n/32767,-1);case Int8Array:return Math.max(n/127,-1);default:throw new Error("Invalid component type.")}}function At(n,e){switch(e.constructor){case Float32Array:return n;case Uint32Array:return Math.round(n*4294967295);case Uint16Array:return Math.round(n*65535);case Uint8Array:return Math.round(n*255);case Int32Array:return Math.round(n*2147483647);case Int16Array:return Math.round(n*32767);case Int8Array:return Math.round(n*127);default:throw new Error("Invalid component type.")}}class Ve{constructor(e=0,t=0){Ve.prototype.isVector2=!0,this.x=e,this.y=t}get width(){return this.x}set width(e){this.x=e}get height(){return this.y}set height(e){this.y=e}set(e,t){return this.x=e,this.y=t,this}setScalar(e){return this.x=e,this.y=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;default:throw new Error("index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;default:throw new Error("index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y)}copy(e){return this.x=e.x,this.y=e.y,this}add(e){return this.x+=e.x,this.y+=e.y,this}addScalar(e){return this.x+=e,this.y+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this}subScalar(e){return this.x-=e,this.y-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this}multiply(e){return this.x*=e.x,this.y*=e.y,this}multiplyScalar(e){return this.x*=e,this.y*=e,this}divide(e){return this.x/=e.x,this.y/=e.y,this}divideScalar(e){return this.multiplyScalar(1/e)}applyMatrix3(e){const t=this.x,i=this.y,s=e.elements;return this.x=s[0]*t+s[3]*i+s[6],this.y=s[1]*t+s[4]*i+s[7],this}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this}clamp(e,t){return this.x=Math.max(e.x,Math.min(t.x,this.x)),this.y=Math.max(e.y,Math.min(t.y,this.y)),this}clampScalar(e,t){return this.x=Math.max(e,Math.min(t,this.x)),this.y=Math.max(e,Math.min(t,this.y)),this}clampLength(e,t){const i=this.length();return this.divideScalar(i||1).multiplyScalar(Math.max(e,Math.min(t,i)))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this}negate(){return this.x=-this.x,this.y=-this.y,this}dot(e){return this.x*e.x+this.y*e.y}cross(e){return this.x*e.y-this.y*e.x}lengthSq(){return this.x*this.x+this.y*this.y}length(){return Math.sqrt(this.x*this.x+this.y*this.y)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)}normalize(){return this.divideScalar(this.length()||1)}angle(){return Math.atan2(-this.y,-this.x)+Math.PI}angleTo(e){const t=Math.sqrt(this.lengthSq()*e.lengthSq());if(t===0)return Math.PI/2;const i=this.dot(e)/t;return Math.acos(bt(i,-1,1))}distanceTo(e){return Math.sqrt(this.distanceToSquared(e))}distanceToSquared(e){const t=this.x-e.x,i=this.y-e.y;return t*t+i*i}manhattanDistanceTo(e){return Math.abs(this.x-e.x)+Math.abs(this.y-e.y)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this}lerpVectors(e,t,i){return this.x=e.x+(t.x-e.x)*i,this.y=e.y+(t.y-e.y)*i,this}equals(e){return e.x===this.x&&e.y===this.y}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this}rotateAround(e,t){const i=Math.cos(t),s=Math.sin(t),r=this.x-e.x,a=this.y-e.y;return this.x=r*i-a*s+e.x,this.y=r*s+a*i+e.y,this}random(){return this.x=Math.random(),this.y=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y}}class Ne{constructor(e,t,i,s,r,a,o,l,c){Ne.prototype.isMatrix3=!0,this.elements=[1,0,0,0,1,0,0,0,1],e!==void 0&&this.set(e,t,i,s,r,a,o,l,c)}set(e,t,i,s,r,a,o,l,c){const u=this.elements;return u[0]=e,u[1]=s,u[2]=o,u[3]=t,u[4]=r,u[5]=l,u[6]=i,u[7]=a,u[8]=c,this}identity(){return this.set(1,0,0,0,1,0,0,0,1),this}copy(e){const t=this.elements,i=e.elements;return t[0]=i[0],t[1]=i[1],t[2]=i[2],t[3]=i[3],t[4]=i[4],t[5]=i[5],t[6]=i[6],t[7]=i[7],t[8]=i[8],this}extractBasis(e,t,i){return e.setFromMatrix3Column(this,0),t.setFromMatrix3Column(this,1),i.setFromMatrix3Column(this,2),this}setFromMatrix4(e){const t=e.elements;return this.set(t[0],t[4],t[8],t[1],t[5],t[9],t[2],t[6],t[10]),this}multiply(e){return this.multiplyMatrices(this,e)}premultiply(e){return this.multiplyMatrices(e,this)}multiplyMatrices(e,t){const i=e.elements,s=t.elements,r=this.elements,a=i[0],o=i[3],l=i[6],c=i[1],u=i[4],f=i[7],d=i[2],m=i[5],_=i[8],v=s[0],p=s[3],h=s[6],A=s[1],S=s[4],g=s[7],P=s[2],b=s[5],w=s[8];return r[0]=a*v+o*A+l*P,r[3]=a*p+o*S+l*b,r[6]=a*h+o*g+l*w,r[1]=c*v+u*A+f*P,r[4]=c*p+u*S+f*b,r[7]=c*h+u*g+f*w,r[2]=d*v+m*A+_*P,r[5]=d*p+m*S+_*b,r[8]=d*h+m*g+_*w,this}multiplyScalar(e){const t=this.elements;return t[0]*=e,t[3]*=e,t[6]*=e,t[1]*=e,t[4]*=e,t[7]*=e,t[2]*=e,t[5]*=e,t[8]*=e,this}determinant(){const e=this.elements,t=e[0],i=e[1],s=e[2],r=e[3],a=e[4],o=e[5],l=e[6],c=e[7],u=e[8];return t*a*u-t*o*c-i*r*u+i*o*l+s*r*c-s*a*l}invert(){const e=this.elements,t=e[0],i=e[1],s=e[2],r=e[3],a=e[4],o=e[5],l=e[6],c=e[7],u=e[8],f=u*a-o*c,d=o*l-u*r,m=c*r-a*l,_=t*f+i*d+s*m;if(_===0)return this.set(0,0,0,0,0,0,0,0,0);const v=1/_;return e[0]=f*v,e[1]=(s*c-u*i)*v,e[2]=(o*i-s*a)*v,e[3]=d*v,e[4]=(u*t-s*l)*v,e[5]=(s*r-o*t)*v,e[6]=m*v,e[7]=(i*l-c*t)*v,e[8]=(a*t-i*r)*v,this}transpose(){let e;const t=this.elements;return e=t[1],t[1]=t[3],t[3]=e,e=t[2],t[2]=t[6],t[6]=e,e=t[5],t[5]=t[7],t[7]=e,this}getNormalMatrix(e){return this.setFromMatrix4(e).invert().transpose()}transposeIntoArray(e){const t=this.elements;return e[0]=t[0],e[1]=t[3],e[2]=t[6],e[3]=t[1],e[4]=t[4],e[5]=t[7],e[6]=t[2],e[7]=t[5],e[8]=t[8],this}setUvTransform(e,t,i,s,r,a,o){const l=Math.cos(r),c=Math.sin(r);return this.set(i*l,i*c,-i*(l*a+c*o)+a+e,-s*c,s*l,-s*(-c*a+l*o)+o+t,0,0,1),this}scale(e,t){return this.premultiply(br.makeScale(e,t)),this}rotate(e){return this.premultiply(br.makeRotation(-e)),this}translate(e,t){return this.premultiply(br.makeTranslation(e,t)),this}makeTranslation(e,t){return e.isVector2?this.set(1,0,e.x,0,1,e.y,0,0,1):this.set(1,0,e,0,1,t,0,0,1),this}makeRotation(e){const t=Math.cos(e),i=Math.sin(e);return this.set(t,-i,0,i,t,0,0,0,1),this}makeScale(e,t){return this.set(e,0,0,0,t,0,0,0,1),this}equals(e){const t=this.elements,i=e.elements;for(let s=0;s<9;s++)if(t[s]!==i[s])return!1;return!0}fromArray(e,t=0){for(let i=0;i<9;i++)this.elements[i]=e[i+t];return this}toArray(e=[],t=0){const i=this.elements;return e[t]=i[0],e[t+1]=i[1],e[t+2]=i[2],e[t+3]=i[3],e[t+4]=i[4],e[t+5]=i[5],e[t+6]=i[6],e[t+7]=i[7],e[t+8]=i[8],e}clone(){return new this.constructor().fromArray(this.elements)}}const br=new Ne;function Zl(n){for(let e=n.length-1;e>=0;--e)if(n[e]>=65535)return!0;return!1}function lr(n){return document.createElementNS("http://www.w3.org/1999/xhtml",n)}function zu(){const n=lr("canvas");return n.style.display="block",n}const wo={};function as(n){n in wo||(wo[n]=!0,console.warn(n))}function ku(n,e,t){return new Promise(function(i,s){function r(){switch(n.clientWaitSync(e,n.SYNC_FLUSH_COMMANDS_BIT,0)){case n.WAIT_FAILED:s();break;case n.TIMEOUT_EXPIRED:setTimeout(r,t);break;default:i()}}setTimeout(r,t)})}function Gu(n){const e=n.elements;e[2]=.5*e[2]+.5*e[3],e[6]=.5*e[6]+.5*e[7],e[10]=.5*e[10]+.5*e[11],e[14]=.5*e[14]+.5*e[15]}function Hu(n){const e=n.elements;e[11]===-1?(e[10]=-e[10]-1,e[14]=-e[14]):(e[10]=-e[10],e[14]=-e[14]+1)}const qe={enabled:!0,workingColorSpace:qi,spaces:{},convert:function(n,e,t){return this.enabled===!1||e===t||!e||!t||(this.spaces[e].transfer===Je&&(n.r=Sn(n.r),n.g=Sn(n.g),n.b=Sn(n.b)),this.spaces[e].primaries!==this.spaces[t].primaries&&(n.applyMatrix3(this.spaces[e].toXYZ),n.applyMatrix3(this.spaces[t].fromXYZ)),this.spaces[t].transfer===Je&&(n.r=Ii(n.r),n.g=Ii(n.g),n.b=Ii(n.b))),n},fromWorkingColorSpace:function(n,e){return this.convert(n,this.workingColorSpace,e)},toWorkingColorSpace:function(n,e){return this.convert(n,e,this.workingColorSpace)},getPrimaries:function(n){return this.spaces[n].primaries},getTransfer:function(n){return n===Bn?gr:this.spaces[n].transfer},getLuminanceCoefficients:function(n,e=this.workingColorSpace){return n.fromArray(this.spaces[e].luminanceCoefficients)},define:function(n){Object.assign(this.spaces,n)},_getMatrix:function(n,e,t){return n.copy(this.spaces[e].toXYZ).multiply(this.spaces[t].fromXYZ)},_getDrawingBufferColorSpace:function(n){return this.spaces[n].outputColorSpaceConfig.drawingBufferColorSpace},_getUnpackColorSpace:function(n=this.workingColorSpace){return this.spaces[n].workingColorSpaceConfig.unpackColorSpace}};function Sn(n){return n<.04045?n*.0773993808:Math.pow(n*.9478672986+.0521327014,2.4)}function Ii(n){return n<.0031308?n*12.92:1.055*Math.pow(n,.41666)-.055}const Ro=[.64,.33,.3,.6,.15,.06],Co=[.2126,.7152,.0722],Po=[.3127,.329],Do=new Ne().set(.4123908,.3575843,.1804808,.212639,.7151687,.0721923,.0193308,.1191948,.9505322),Lo=new Ne().set(3.2409699,-1.5373832,-.4986108,-.9692436,1.8759675,.0415551,.0556301,-.203977,1.0569715);qe.define({[qi]:{primaries:Ro,whitePoint:Po,transfer:gr,toXYZ:Do,fromXYZ:Lo,luminanceCoefficients:Co,workingColorSpaceConfig:{unpackColorSpace:kt},outputColorSpaceConfig:{drawingBufferColorSpace:kt}},[kt]:{primaries:Ro,whitePoint:Po,transfer:Je,toXYZ:Do,fromXYZ:Lo,luminanceCoefficients:Co,outputColorSpaceConfig:{drawingBufferColorSpace:kt}}});let pi;class Vu{static getDataURL(e){if(/^data:/i.test(e.src)||typeof HTMLCanvasElement>"u")return e.src;let t;if(e instanceof HTMLCanvasElement)t=e;else{pi===void 0&&(pi=lr("canvas")),pi.width=e.width,pi.height=e.height;const i=pi.getContext("2d");e instanceof ImageData?i.putImageData(e,0,0):i.drawImage(e,0,0,e.width,e.height),t=pi}return t.width>2048||t.height>2048?(console.warn("THREE.ImageUtils.getDataURL: Image converted to jpg for performance reasons",e),t.toDataURL("image/jpeg",.6)):t.toDataURL("image/png")}static sRGBToLinear(e){if(typeof HTMLImageElement<"u"&&e instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&e instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&e instanceof ImageBitmap){const t=lr("canvas");t.width=e.width,t.height=e.height;const i=t.getContext("2d");i.drawImage(e,0,0,e.width,e.height);const s=i.getImageData(0,0,e.width,e.height),r=s.data;for(let a=0;a<r.length;a++)r[a]=Sn(r[a]/255)*255;return i.putImageData(s,0,0),t}else if(e.data){const t=e.data.slice(0);for(let i=0;i<t.length;i++)t instanceof Uint8Array||t instanceof Uint8ClampedArray?t[i]=Math.floor(Sn(t[i]/255)*255):t[i]=Sn(t[i]);return{data:t,width:e.width,height:e.height}}else return console.warn("THREE.ImageUtils.sRGBToLinear(): Unsupported image type. No color space conversion applied."),e}}let Wu=0;class jl{constructor(e=null){this.isSource=!0,Object.defineProperty(this,"id",{value:Wu++}),this.uuid=Ms(),this.data=e,this.dataReady=!0,this.version=0}set needsUpdate(e){e===!0&&this.version++}toJSON(e){const t=e===void 0||typeof e=="string";if(!t&&e.images[this.uuid]!==void 0)return e.images[this.uuid];const i={uuid:this.uuid,url:""},s=this.data;if(s!==null){let r;if(Array.isArray(s)){r=[];for(let a=0,o=s.length;a<o;a++)s[a].isDataTexture?r.push(wr(s[a].image)):r.push(wr(s[a]))}else r=wr(s);i.url=r}return t||(e.images[this.uuid]=i),i}}function wr(n){return typeof HTMLImageElement<"u"&&n instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&n instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&n instanceof ImageBitmap?Vu.getDataURL(n):n.data?{data:Array.from(n.data),width:n.width,height:n.height,type:n.data.constructor.name}:(console.warn("THREE.Texture: Unable to serialize Texture."),{})}let Xu=0;class St extends Yi{constructor(e=St.DEFAULT_IMAGE,t=St.DEFAULT_MAPPING,i=ri,s=ri,r=Gt,a=ai,o=Ht,l=sn,c=St.DEFAULT_ANISOTROPY,u=Bn){super(),this.isTexture=!0,Object.defineProperty(this,"id",{value:Xu++}),this.uuid=Ms(),this.name="",this.source=new jl(e),this.mipmaps=[],this.mapping=t,this.channel=0,this.wrapS=i,this.wrapT=s,this.magFilter=r,this.minFilter=a,this.anisotropy=c,this.format=o,this.internalFormat=null,this.type=l,this.offset=new Ve(0,0),this.repeat=new Ve(1,1),this.center=new Ve(0,0),this.rotation=0,this.matrixAutoUpdate=!0,this.matrix=new Ne,this.generateMipmaps=!0,this.premultiplyAlpha=!1,this.flipY=!0,this.unpackAlignment=4,this.colorSpace=u,this.userData={},this.version=0,this.onUpdate=null,this.isRenderTargetTexture=!1,this.pmremVersion=0}get image(){return this.source.data}set image(e=null){this.source.data=e}updateMatrix(){this.matrix.setUvTransform(this.offset.x,this.offset.y,this.repeat.x,this.repeat.y,this.rotation,this.center.x,this.center.y)}clone(){return new this.constructor().copy(this)}copy(e){return this.name=e.name,this.source=e.source,this.mipmaps=e.mipmaps.slice(0),this.mapping=e.mapping,this.channel=e.channel,this.wrapS=e.wrapS,this.wrapT=e.wrapT,this.magFilter=e.magFilter,this.minFilter=e.minFilter,this.anisotropy=e.anisotropy,this.format=e.format,this.internalFormat=e.internalFormat,this.type=e.type,this.offset.copy(e.offset),this.repeat.copy(e.repeat),this.center.copy(e.center),this.rotation=e.rotation,this.matrixAutoUpdate=e.matrixAutoUpdate,this.matrix.copy(e.matrix),this.generateMipmaps=e.generateMipmaps,this.premultiplyAlpha=e.premultiplyAlpha,this.flipY=e.flipY,this.unpackAlignment=e.unpackAlignment,this.colorSpace=e.colorSpace,this.userData=JSON.parse(JSON.stringify(e.userData)),this.needsUpdate=!0,this}toJSON(e){const t=e===void 0||typeof e=="string";if(!t&&e.textures[this.uuid]!==void 0)return e.textures[this.uuid];const i={metadata:{version:4.6,type:"Texture",generator:"Texture.toJSON"},uuid:this.uuid,name:this.name,image:this.source.toJSON(e).uuid,mapping:this.mapping,channel:this.channel,repeat:[this.repeat.x,this.repeat.y],offset:[this.offset.x,this.offset.y],center:[this.center.x,this.center.y],rotation:this.rotation,wrap:[this.wrapS,this.wrapT],format:this.format,internalFormat:this.internalFormat,type:this.type,colorSpace:this.colorSpace,minFilter:this.minFilter,magFilter:this.magFilter,anisotropy:this.anisotropy,flipY:this.flipY,generateMipmaps:this.generateMipmaps,premultiplyAlpha:this.premultiplyAlpha,unpackAlignment:this.unpackAlignment};return Object.keys(this.userData).length>0&&(i.userData=this.userData),t||(e.textures[this.uuid]=i),i}dispose(){this.dispatchEvent({type:"dispose"})}transformUv(e){if(this.mapping!==Bl)return e;if(e.applyMatrix3(this.matrix),e.x<0||e.x>1)switch(this.wrapS){case _a:e.x=e.x-Math.floor(e.x);break;case ri:e.x=e.x<0?0:1;break;case va:Math.abs(Math.floor(e.x)%2)===1?e.x=Math.ceil(e.x)-e.x:e.x=e.x-Math.floor(e.x);break}if(e.y<0||e.y>1)switch(this.wrapT){case _a:e.y=e.y-Math.floor(e.y);break;case ri:e.y=e.y<0?0:1;break;case va:Math.abs(Math.floor(e.y)%2)===1?e.y=Math.ceil(e.y)-e.y:e.y=e.y-Math.floor(e.y);break}return this.flipY&&(e.y=1-e.y),e}set needsUpdate(e){e===!0&&(this.version++,this.source.needsUpdate=!0)}set needsPMREMUpdate(e){e===!0&&this.pmremVersion++}}St.DEFAULT_IMAGE=null;St.DEFAULT_MAPPING=Bl;St.DEFAULT_ANISOTROPY=1;class tt{constructor(e=0,t=0,i=0,s=1){tt.prototype.isVector4=!0,this.x=e,this.y=t,this.z=i,this.w=s}get width(){return this.z}set width(e){this.z=e}get height(){return this.w}set height(e){this.w=e}set(e,t,i,s){return this.x=e,this.y=t,this.z=i,this.w=s,this}setScalar(e){return this.x=e,this.y=e,this.z=e,this.w=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setZ(e){return this.z=e,this}setW(e){return this.w=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;case 2:this.z=t;break;case 3:this.w=t;break;default:throw new Error("index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;case 2:return this.z;case 3:return this.w;default:throw new Error("index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y,this.z,this.w)}copy(e){return this.x=e.x,this.y=e.y,this.z=e.z,this.w=e.w!==void 0?e.w:1,this}add(e){return this.x+=e.x,this.y+=e.y,this.z+=e.z,this.w+=e.w,this}addScalar(e){return this.x+=e,this.y+=e,this.z+=e,this.w+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this.z=e.z+t.z,this.w=e.w+t.w,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this.z+=e.z*t,this.w+=e.w*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this.z-=e.z,this.w-=e.w,this}subScalar(e){return this.x-=e,this.y-=e,this.z-=e,this.w-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this.z=e.z-t.z,this.w=e.w-t.w,this}multiply(e){return this.x*=e.x,this.y*=e.y,this.z*=e.z,this.w*=e.w,this}multiplyScalar(e){return this.x*=e,this.y*=e,this.z*=e,this.w*=e,this}applyMatrix4(e){const t=this.x,i=this.y,s=this.z,r=this.w,a=e.elements;return this.x=a[0]*t+a[4]*i+a[8]*s+a[12]*r,this.y=a[1]*t+a[5]*i+a[9]*s+a[13]*r,this.z=a[2]*t+a[6]*i+a[10]*s+a[14]*r,this.w=a[3]*t+a[7]*i+a[11]*s+a[15]*r,this}divide(e){return this.x/=e.x,this.y/=e.y,this.z/=e.z,this.w/=e.w,this}divideScalar(e){return this.multiplyScalar(1/e)}setAxisAngleFromQuaternion(e){this.w=2*Math.acos(e.w);const t=Math.sqrt(1-e.w*e.w);return t<1e-4?(this.x=1,this.y=0,this.z=0):(this.x=e.x/t,this.y=e.y/t,this.z=e.z/t),this}setAxisAngleFromRotationMatrix(e){let t,i,s,r;const l=e.elements,c=l[0],u=l[4],f=l[8],d=l[1],m=l[5],_=l[9],v=l[2],p=l[6],h=l[10];if(Math.abs(u-d)<.01&&Math.abs(f-v)<.01&&Math.abs(_-p)<.01){if(Math.abs(u+d)<.1&&Math.abs(f+v)<.1&&Math.abs(_+p)<.1&&Math.abs(c+m+h-3)<.1)return this.set(1,0,0,0),this;t=Math.PI;const S=(c+1)/2,g=(m+1)/2,P=(h+1)/2,b=(u+d)/4,w=(f+v)/4,D=(_+p)/4;return S>g&&S>P?S<.01?(i=0,s=.707106781,r=.707106781):(i=Math.sqrt(S),s=b/i,r=w/i):g>P?g<.01?(i=.707106781,s=0,r=.707106781):(s=Math.sqrt(g),i=b/s,r=D/s):P<.01?(i=.707106781,s=.707106781,r=0):(r=Math.sqrt(P),i=w/r,s=D/r),this.set(i,s,r,t),this}let A=Math.sqrt((p-_)*(p-_)+(f-v)*(f-v)+(d-u)*(d-u));return Math.abs(A)<.001&&(A=1),this.x=(p-_)/A,this.y=(f-v)/A,this.z=(d-u)/A,this.w=Math.acos((c+m+h-1)/2),this}setFromMatrixPosition(e){const t=e.elements;return this.x=t[12],this.y=t[13],this.z=t[14],this.w=t[15],this}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this.z=Math.min(this.z,e.z),this.w=Math.min(this.w,e.w),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this.z=Math.max(this.z,e.z),this.w=Math.max(this.w,e.w),this}clamp(e,t){return this.x=Math.max(e.x,Math.min(t.x,this.x)),this.y=Math.max(e.y,Math.min(t.y,this.y)),this.z=Math.max(e.z,Math.min(t.z,this.z)),this.w=Math.max(e.w,Math.min(t.w,this.w)),this}clampScalar(e,t){return this.x=Math.max(e,Math.min(t,this.x)),this.y=Math.max(e,Math.min(t,this.y)),this.z=Math.max(e,Math.min(t,this.z)),this.w=Math.max(e,Math.min(t,this.w)),this}clampLength(e,t){const i=this.length();return this.divideScalar(i||1).multiplyScalar(Math.max(e,Math.min(t,i)))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this.w=Math.floor(this.w),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this.w=Math.ceil(this.w),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this.w=Math.round(this.w),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this.w=Math.trunc(this.w),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this.w=-this.w,this}dot(e){return this.x*e.x+this.y*e.y+this.z*e.z+this.w*e.w}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)+Math.abs(this.w)}normalize(){return this.divideScalar(this.length()||1)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this.z+=(e.z-this.z)*t,this.w+=(e.w-this.w)*t,this}lerpVectors(e,t,i){return this.x=e.x+(t.x-e.x)*i,this.y=e.y+(t.y-e.y)*i,this.z=e.z+(t.z-e.z)*i,this.w=e.w+(t.w-e.w)*i,this}equals(e){return e.x===this.x&&e.y===this.y&&e.z===this.z&&e.w===this.w}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this.z=e[t+2],this.w=e[t+3],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e[t+2]=this.z,e[t+3]=this.w,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this.z=e.getZ(t),this.w=e.getW(t),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this.w=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z,yield this.w}}class qu extends Yi{constructor(e=1,t=1,i={}){super(),this.isRenderTarget=!0,this.width=e,this.height=t,this.depth=1,this.scissor=new tt(0,0,e,t),this.scissorTest=!1,this.viewport=new tt(0,0,e,t);const s={width:e,height:t,depth:1};i=Object.assign({generateMipmaps:!1,internalFormat:null,minFilter:Gt,depthBuffer:!0,stencilBuffer:!1,resolveDepthBuffer:!0,resolveStencilBuffer:!0,depthTexture:null,samples:0,count:1},i);const r=new St(s,i.mapping,i.wrapS,i.wrapT,i.magFilter,i.minFilter,i.format,i.type,i.anisotropy,i.colorSpace);r.flipY=!1,r.generateMipmaps=i.generateMipmaps,r.internalFormat=i.internalFormat,this.textures=[];const a=i.count;for(let o=0;o<a;o++)this.textures[o]=r.clone(),this.textures[o].isRenderTargetTexture=!0;this.depthBuffer=i.depthBuffer,this.stencilBuffer=i.stencilBuffer,this.resolveDepthBuffer=i.resolveDepthBuffer,this.resolveStencilBuffer=i.resolveStencilBuffer,this.depthTexture=i.depthTexture,this.samples=i.samples}get texture(){return this.textures[0]}set texture(e){this.textures[0]=e}setSize(e,t,i=1){if(this.width!==e||this.height!==t||this.depth!==i){this.width=e,this.height=t,this.depth=i;for(let s=0,r=this.textures.length;s<r;s++)this.textures[s].image.width=e,this.textures[s].image.height=t,this.textures[s].image.depth=i;this.dispose()}this.viewport.set(0,0,e,t),this.scissor.set(0,0,e,t)}clone(){return new this.constructor().copy(this)}copy(e){this.width=e.width,this.height=e.height,this.depth=e.depth,this.scissor.copy(e.scissor),this.scissorTest=e.scissorTest,this.viewport.copy(e.viewport),this.textures.length=0;for(let i=0,s=e.textures.length;i<s;i++)this.textures[i]=e.textures[i].clone(),this.textures[i].isRenderTargetTexture=!0;const t=Object.assign({},e.texture.image);return this.texture.source=new jl(t),this.depthBuffer=e.depthBuffer,this.stencilBuffer=e.stencilBuffer,this.resolveDepthBuffer=e.resolveDepthBuffer,this.resolveStencilBuffer=e.resolveStencilBuffer,e.depthTexture!==null&&(this.depthTexture=e.depthTexture.clone()),this.samples=e.samples,this}dispose(){this.dispatchEvent({type:"dispose"})}}class Tn extends qu{constructor(e=1,t=1,i={}){super(e,t,i),this.isWebGLRenderTarget=!0}}class Jl extends St{constructor(e=null,t=1,i=1,s=1){super(null),this.isDataArrayTexture=!0,this.image={data:e,width:t,height:i,depth:s},this.magFilter=ft,this.minFilter=ft,this.wrapR=ri,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1,this.layerUpdates=new Set}addLayerUpdate(e){this.layerUpdates.add(e)}clearLayerUpdates(){this.layerUpdates.clear()}}class Yu extends St{constructor(e=null,t=1,i=1,s=1){super(null),this.isData3DTexture=!0,this.image={data:e,width:t,height:i,depth:s},this.magFilter=ft,this.minFilter=ft,this.wrapR=ri,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}}class Ki{constructor(e=0,t=0,i=0,s=1){this.isQuaternion=!0,this._x=e,this._y=t,this._z=i,this._w=s}static slerpFlat(e,t,i,s,r,a,o){let l=i[s+0],c=i[s+1],u=i[s+2],f=i[s+3];const d=r[a+0],m=r[a+1],_=r[a+2],v=r[a+3];if(o===0){e[t+0]=l,e[t+1]=c,e[t+2]=u,e[t+3]=f;return}if(o===1){e[t+0]=d,e[t+1]=m,e[t+2]=_,e[t+3]=v;return}if(f!==v||l!==d||c!==m||u!==_){let p=1-o;const h=l*d+c*m+u*_+f*v,A=h>=0?1:-1,S=1-h*h;if(S>Number.EPSILON){const P=Math.sqrt(S),b=Math.atan2(P,h*A);p=Math.sin(p*b)/P,o=Math.sin(o*b)/P}const g=o*A;if(l=l*p+d*g,c=c*p+m*g,u=u*p+_*g,f=f*p+v*g,p===1-o){const P=1/Math.sqrt(l*l+c*c+u*u+f*f);l*=P,c*=P,u*=P,f*=P}}e[t]=l,e[t+1]=c,e[t+2]=u,e[t+3]=f}static multiplyQuaternionsFlat(e,t,i,s,r,a){const o=i[s],l=i[s+1],c=i[s+2],u=i[s+3],f=r[a],d=r[a+1],m=r[a+2],_=r[a+3];return e[t]=o*_+u*f+l*m-c*d,e[t+1]=l*_+u*d+c*f-o*m,e[t+2]=c*_+u*m+o*d-l*f,e[t+3]=u*_-o*f-l*d-c*m,e}get x(){return this._x}set x(e){this._x=e,this._onChangeCallback()}get y(){return this._y}set y(e){this._y=e,this._onChangeCallback()}get z(){return this._z}set z(e){this._z=e,this._onChangeCallback()}get w(){return this._w}set w(e){this._w=e,this._onChangeCallback()}set(e,t,i,s){return this._x=e,this._y=t,this._z=i,this._w=s,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._w)}copy(e){return this._x=e.x,this._y=e.y,this._z=e.z,this._w=e.w,this._onChangeCallback(),this}setFromEuler(e,t=!0){const i=e._x,s=e._y,r=e._z,a=e._order,o=Math.cos,l=Math.sin,c=o(i/2),u=o(s/2),f=o(r/2),d=l(i/2),m=l(s/2),_=l(r/2);switch(a){case"XYZ":this._x=d*u*f+c*m*_,this._y=c*m*f-d*u*_,this._z=c*u*_+d*m*f,this._w=c*u*f-d*m*_;break;case"YXZ":this._x=d*u*f+c*m*_,this._y=c*m*f-d*u*_,this._z=c*u*_-d*m*f,this._w=c*u*f+d*m*_;break;case"ZXY":this._x=d*u*f-c*m*_,this._y=c*m*f+d*u*_,this._z=c*u*_+d*m*f,this._w=c*u*f-d*m*_;break;case"ZYX":this._x=d*u*f-c*m*_,this._y=c*m*f+d*u*_,this._z=c*u*_-d*m*f,this._w=c*u*f+d*m*_;break;case"YZX":this._x=d*u*f+c*m*_,this._y=c*m*f+d*u*_,this._z=c*u*_-d*m*f,this._w=c*u*f-d*m*_;break;case"XZY":this._x=d*u*f-c*m*_,this._y=c*m*f-d*u*_,this._z=c*u*_+d*m*f,this._w=c*u*f+d*m*_;break;default:console.warn("THREE.Quaternion: .setFromEuler() encountered an unknown order: "+a)}return t===!0&&this._onChangeCallback(),this}setFromAxisAngle(e,t){const i=t/2,s=Math.sin(i);return this._x=e.x*s,this._y=e.y*s,this._z=e.z*s,this._w=Math.cos(i),this._onChangeCallback(),this}setFromRotationMatrix(e){const t=e.elements,i=t[0],s=t[4],r=t[8],a=t[1],o=t[5],l=t[9],c=t[2],u=t[6],f=t[10],d=i+o+f;if(d>0){const m=.5/Math.sqrt(d+1);this._w=.25/m,this._x=(u-l)*m,this._y=(r-c)*m,this._z=(a-s)*m}else if(i>o&&i>f){const m=2*Math.sqrt(1+i-o-f);this._w=(u-l)/m,this._x=.25*m,this._y=(s+a)/m,this._z=(r+c)/m}else if(o>f){const m=2*Math.sqrt(1+o-i-f);this._w=(r-c)/m,this._x=(s+a)/m,this._y=.25*m,this._z=(l+u)/m}else{const m=2*Math.sqrt(1+f-i-o);this._w=(a-s)/m,this._x=(r+c)/m,this._y=(l+u)/m,this._z=.25*m}return this._onChangeCallback(),this}setFromUnitVectors(e,t){let i=e.dot(t)+1;return i<Number.EPSILON?(i=0,Math.abs(e.x)>Math.abs(e.z)?(this._x=-e.y,this._y=e.x,this._z=0,this._w=i):(this._x=0,this._y=-e.z,this._z=e.y,this._w=i)):(this._x=e.y*t.z-e.z*t.y,this._y=e.z*t.x-e.x*t.z,this._z=e.x*t.y-e.y*t.x,this._w=i),this.normalize()}angleTo(e){return 2*Math.acos(Math.abs(bt(this.dot(e),-1,1)))}rotateTowards(e,t){const i=this.angleTo(e);if(i===0)return this;const s=Math.min(1,t/i);return this.slerp(e,s),this}identity(){return this.set(0,0,0,1)}invert(){return this.conjugate()}conjugate(){return this._x*=-1,this._y*=-1,this._z*=-1,this._onChangeCallback(),this}dot(e){return this._x*e._x+this._y*e._y+this._z*e._z+this._w*e._w}lengthSq(){return this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w}length(){return Math.sqrt(this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w)}normalize(){let e=this.length();return e===0?(this._x=0,this._y=0,this._z=0,this._w=1):(e=1/e,this._x=this._x*e,this._y=this._y*e,this._z=this._z*e,this._w=this._w*e),this._onChangeCallback(),this}multiply(e){return this.multiplyQuaternions(this,e)}premultiply(e){return this.multiplyQuaternions(e,this)}multiplyQuaternions(e,t){const i=e._x,s=e._y,r=e._z,a=e._w,o=t._x,l=t._y,c=t._z,u=t._w;return this._x=i*u+a*o+s*c-r*l,this._y=s*u+a*l+r*o-i*c,this._z=r*u+a*c+i*l-s*o,this._w=a*u-i*o-s*l-r*c,this._onChangeCallback(),this}slerp(e,t){if(t===0)return this;if(t===1)return this.copy(e);const i=this._x,s=this._y,r=this._z,a=this._w;let o=a*e._w+i*e._x+s*e._y+r*e._z;if(o<0?(this._w=-e._w,this._x=-e._x,this._y=-e._y,this._z=-e._z,o=-o):this.copy(e),o>=1)return this._w=a,this._x=i,this._y=s,this._z=r,this;const l=1-o*o;if(l<=Number.EPSILON){const m=1-t;return this._w=m*a+t*this._w,this._x=m*i+t*this._x,this._y=m*s+t*this._y,this._z=m*r+t*this._z,this.normalize(),this}const c=Math.sqrt(l),u=Math.atan2(c,o),f=Math.sin((1-t)*u)/c,d=Math.sin(t*u)/c;return this._w=a*f+this._w*d,this._x=i*f+this._x*d,this._y=s*f+this._y*d,this._z=r*f+this._z*d,this._onChangeCallback(),this}slerpQuaternions(e,t,i){return this.copy(e).slerp(t,i)}random(){const e=2*Math.PI*Math.random(),t=2*Math.PI*Math.random(),i=Math.random(),s=Math.sqrt(1-i),r=Math.sqrt(i);return this.set(s*Math.sin(e),s*Math.cos(e),r*Math.sin(t),r*Math.cos(t))}equals(e){return e._x===this._x&&e._y===this._y&&e._z===this._z&&e._w===this._w}fromArray(e,t=0){return this._x=e[t],this._y=e[t+1],this._z=e[t+2],this._w=e[t+3],this._onChangeCallback(),this}toArray(e=[],t=0){return e[t]=this._x,e[t+1]=this._y,e[t+2]=this._z,e[t+3]=this._w,e}fromBufferAttribute(e,t){return this._x=e.getX(t),this._y=e.getY(t),this._z=e.getZ(t),this._w=e.getW(t),this._onChangeCallback(),this}toJSON(){return this.toArray()}_onChange(e){return this._onChangeCallback=e,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._w}}class N{constructor(e=0,t=0,i=0){N.prototype.isVector3=!0,this.x=e,this.y=t,this.z=i}set(e,t,i){return i===void 0&&(i=this.z),this.x=e,this.y=t,this.z=i,this}setScalar(e){return this.x=e,this.y=e,this.z=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setZ(e){return this.z=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;case 2:this.z=t;break;default:throw new Error("index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;case 2:return this.z;default:throw new Error("index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y,this.z)}copy(e){return this.x=e.x,this.y=e.y,this.z=e.z,this}add(e){return this.x+=e.x,this.y+=e.y,this.z+=e.z,this}addScalar(e){return this.x+=e,this.y+=e,this.z+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this.z=e.z+t.z,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this.z+=e.z*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this.z-=e.z,this}subScalar(e){return this.x-=e,this.y-=e,this.z-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this.z=e.z-t.z,this}multiply(e){return this.x*=e.x,this.y*=e.y,this.z*=e.z,this}multiplyScalar(e){return this.x*=e,this.y*=e,this.z*=e,this}multiplyVectors(e,t){return this.x=e.x*t.x,this.y=e.y*t.y,this.z=e.z*t.z,this}applyEuler(e){return this.applyQuaternion(Io.setFromEuler(e))}applyAxisAngle(e,t){return this.applyQuaternion(Io.setFromAxisAngle(e,t))}applyMatrix3(e){const t=this.x,i=this.y,s=this.z,r=e.elements;return this.x=r[0]*t+r[3]*i+r[6]*s,this.y=r[1]*t+r[4]*i+r[7]*s,this.z=r[2]*t+r[5]*i+r[8]*s,this}applyNormalMatrix(e){return this.applyMatrix3(e).normalize()}applyMatrix4(e){const t=this.x,i=this.y,s=this.z,r=e.elements,a=1/(r[3]*t+r[7]*i+r[11]*s+r[15]);return this.x=(r[0]*t+r[4]*i+r[8]*s+r[12])*a,this.y=(r[1]*t+r[5]*i+r[9]*s+r[13])*a,this.z=(r[2]*t+r[6]*i+r[10]*s+r[14])*a,this}applyQuaternion(e){const t=this.x,i=this.y,s=this.z,r=e.x,a=e.y,o=e.z,l=e.w,c=2*(a*s-o*i),u=2*(o*t-r*s),f=2*(r*i-a*t);return this.x=t+l*c+a*f-o*u,this.y=i+l*u+o*c-r*f,this.z=s+l*f+r*u-a*c,this}project(e){return this.applyMatrix4(e.matrixWorldInverse).applyMatrix4(e.projectionMatrix)}unproject(e){return this.applyMatrix4(e.projectionMatrixInverse).applyMatrix4(e.matrixWorld)}transformDirection(e){const t=this.x,i=this.y,s=this.z,r=e.elements;return this.x=r[0]*t+r[4]*i+r[8]*s,this.y=r[1]*t+r[5]*i+r[9]*s,this.z=r[2]*t+r[6]*i+r[10]*s,this.normalize()}divide(e){return this.x/=e.x,this.y/=e.y,this.z/=e.z,this}divideScalar(e){return this.multiplyScalar(1/e)}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this.z=Math.min(this.z,e.z),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this.z=Math.max(this.z,e.z),this}clamp(e,t){return this.x=Math.max(e.x,Math.min(t.x,this.x)),this.y=Math.max(e.y,Math.min(t.y,this.y)),this.z=Math.max(e.z,Math.min(t.z,this.z)),this}clampScalar(e,t){return this.x=Math.max(e,Math.min(t,this.x)),this.y=Math.max(e,Math.min(t,this.y)),this.z=Math.max(e,Math.min(t,this.z)),this}clampLength(e,t){const i=this.length();return this.divideScalar(i||1).multiplyScalar(Math.max(e,Math.min(t,i)))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this}dot(e){return this.x*e.x+this.y*e.y+this.z*e.z}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)}normalize(){return this.divideScalar(this.length()||1)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this.z+=(e.z-this.z)*t,this}lerpVectors(e,t,i){return this.x=e.x+(t.x-e.x)*i,this.y=e.y+(t.y-e.y)*i,this.z=e.z+(t.z-e.z)*i,this}cross(e){return this.crossVectors(this,e)}crossVectors(e,t){const i=e.x,s=e.y,r=e.z,a=t.x,o=t.y,l=t.z;return this.x=s*l-r*o,this.y=r*a-i*l,this.z=i*o-s*a,this}projectOnVector(e){const t=e.lengthSq();if(t===0)return this.set(0,0,0);const i=e.dot(this)/t;return this.copy(e).multiplyScalar(i)}projectOnPlane(e){return Rr.copy(this).projectOnVector(e),this.sub(Rr)}reflect(e){return this.sub(Rr.copy(e).multiplyScalar(2*this.dot(e)))}angleTo(e){const t=Math.sqrt(this.lengthSq()*e.lengthSq());if(t===0)return Math.PI/2;const i=this.dot(e)/t;return Math.acos(bt(i,-1,1))}distanceTo(e){return Math.sqrt(this.distanceToSquared(e))}distanceToSquared(e){const t=this.x-e.x,i=this.y-e.y,s=this.z-e.z;return t*t+i*i+s*s}manhattanDistanceTo(e){return Math.abs(this.x-e.x)+Math.abs(this.y-e.y)+Math.abs(this.z-e.z)}setFromSpherical(e){return this.setFromSphericalCoords(e.radius,e.phi,e.theta)}setFromSphericalCoords(e,t,i){const s=Math.sin(t)*e;return this.x=s*Math.sin(i),this.y=Math.cos(t)*e,this.z=s*Math.cos(i),this}setFromCylindrical(e){return this.setFromCylindricalCoords(e.radius,e.theta,e.y)}setFromCylindricalCoords(e,t,i){return this.x=e*Math.sin(t),this.y=i,this.z=e*Math.cos(t),this}setFromMatrixPosition(e){const t=e.elements;return this.x=t[12],this.y=t[13],this.z=t[14],this}setFromMatrixScale(e){const t=this.setFromMatrixColumn(e,0).length(),i=this.setFromMatrixColumn(e,1).length(),s=this.setFromMatrixColumn(e,2).length();return this.x=t,this.y=i,this.z=s,this}setFromMatrixColumn(e,t){return this.fromArray(e.elements,t*4)}setFromMatrix3Column(e,t){return this.fromArray(e.elements,t*3)}setFromEuler(e){return this.x=e._x,this.y=e._y,this.z=e._z,this}setFromColor(e){return this.x=e.r,this.y=e.g,this.z=e.b,this}equals(e){return e.x===this.x&&e.y===this.y&&e.z===this.z}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this.z=e[t+2],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e[t+2]=this.z,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this.z=e.getZ(t),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this}randomDirection(){const e=Math.random()*Math.PI*2,t=Math.random()*2-1,i=Math.sqrt(1-t*t);return this.x=i*Math.cos(e),this.y=t,this.z=i*Math.sin(e),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z}}const Rr=new N,Io=new Ki;class Ss{constructor(e=new N(1/0,1/0,1/0),t=new N(-1/0,-1/0,-1/0)){this.isBox3=!0,this.min=e,this.max=t}set(e,t){return this.min.copy(e),this.max.copy(t),this}setFromArray(e){this.makeEmpty();for(let t=0,i=e.length;t<i;t+=3)this.expandByPoint(Zt.fromArray(e,t));return this}setFromBufferAttribute(e){this.makeEmpty();for(let t=0,i=e.count;t<i;t++)this.expandByPoint(Zt.fromBufferAttribute(e,t));return this}setFromPoints(e){this.makeEmpty();for(let t=0,i=e.length;t<i;t++)this.expandByPoint(e[t]);return this}setFromCenterAndSize(e,t){const i=Zt.copy(t).multiplyScalar(.5);return this.min.copy(e).sub(i),this.max.copy(e).add(i),this}setFromObject(e,t=!1){return this.makeEmpty(),this.expandByObject(e,t)}clone(){return new this.constructor().copy(this)}copy(e){return this.min.copy(e.min),this.max.copy(e.max),this}makeEmpty(){return this.min.x=this.min.y=this.min.z=1/0,this.max.x=this.max.y=this.max.z=-1/0,this}isEmpty(){return this.max.x<this.min.x||this.max.y<this.min.y||this.max.z<this.min.z}getCenter(e){return this.isEmpty()?e.set(0,0,0):e.addVectors(this.min,this.max).multiplyScalar(.5)}getSize(e){return this.isEmpty()?e.set(0,0,0):e.subVectors(this.max,this.min)}expandByPoint(e){return this.min.min(e),this.max.max(e),this}expandByVector(e){return this.min.sub(e),this.max.add(e),this}expandByScalar(e){return this.min.addScalar(-e),this.max.addScalar(e),this}expandByObject(e,t=!1){e.updateWorldMatrix(!1,!1);const i=e.geometry;if(i!==void 0){const r=i.getAttribute("position");if(t===!0&&r!==void 0&&e.isInstancedMesh!==!0)for(let a=0,o=r.count;a<o;a++)e.isMesh===!0?e.getVertexPosition(a,Zt):Zt.fromBufferAttribute(r,a),Zt.applyMatrix4(e.matrixWorld),this.expandByPoint(Zt);else e.boundingBox!==void 0?(e.boundingBox===null&&e.computeBoundingBox(),ws.copy(e.boundingBox)):(i.boundingBox===null&&i.computeBoundingBox(),ws.copy(i.boundingBox)),ws.applyMatrix4(e.matrixWorld),this.union(ws)}const s=e.children;for(let r=0,a=s.length;r<a;r++)this.expandByObject(s[r],t);return this}containsPoint(e){return e.x>=this.min.x&&e.x<=this.max.x&&e.y>=this.min.y&&e.y<=this.max.y&&e.z>=this.min.z&&e.z<=this.max.z}containsBox(e){return this.min.x<=e.min.x&&e.max.x<=this.max.x&&this.min.y<=e.min.y&&e.max.y<=this.max.y&&this.min.z<=e.min.z&&e.max.z<=this.max.z}getParameter(e,t){return t.set((e.x-this.min.x)/(this.max.x-this.min.x),(e.y-this.min.y)/(this.max.y-this.min.y),(e.z-this.min.z)/(this.max.z-this.min.z))}intersectsBox(e){return e.max.x>=this.min.x&&e.min.x<=this.max.x&&e.max.y>=this.min.y&&e.min.y<=this.max.y&&e.max.z>=this.min.z&&e.min.z<=this.max.z}intersectsSphere(e){return this.clampPoint(e.center,Zt),Zt.distanceToSquared(e.center)<=e.radius*e.radius}intersectsPlane(e){let t,i;return e.normal.x>0?(t=e.normal.x*this.min.x,i=e.normal.x*this.max.x):(t=e.normal.x*this.max.x,i=e.normal.x*this.min.x),e.normal.y>0?(t+=e.normal.y*this.min.y,i+=e.normal.y*this.max.y):(t+=e.normal.y*this.max.y,i+=e.normal.y*this.min.y),e.normal.z>0?(t+=e.normal.z*this.min.z,i+=e.normal.z*this.max.z):(t+=e.normal.z*this.max.z,i+=e.normal.z*this.min.z),t<=-e.constant&&i>=-e.constant}intersectsTriangle(e){if(this.isEmpty())return!1;this.getCenter(es),Rs.subVectors(this.max,es),mi.subVectors(e.a,es),gi.subVectors(e.b,es),_i.subVectors(e.c,es),Pn.subVectors(gi,mi),Dn.subVectors(_i,gi),Kn.subVectors(mi,_i);let t=[0,-Pn.z,Pn.y,0,-Dn.z,Dn.y,0,-Kn.z,Kn.y,Pn.z,0,-Pn.x,Dn.z,0,-Dn.x,Kn.z,0,-Kn.x,-Pn.y,Pn.x,0,-Dn.y,Dn.x,0,-Kn.y,Kn.x,0];return!Cr(t,mi,gi,_i,Rs)||(t=[1,0,0,0,1,0,0,0,1],!Cr(t,mi,gi,_i,Rs))?!1:(Cs.crossVectors(Pn,Dn),t=[Cs.x,Cs.y,Cs.z],Cr(t,mi,gi,_i,Rs))}clampPoint(e,t){return t.copy(e).clamp(this.min,this.max)}distanceToPoint(e){return this.clampPoint(e,Zt).distanceTo(e)}getBoundingSphere(e){return this.isEmpty()?e.makeEmpty():(this.getCenter(e.center),e.radius=this.getSize(Zt).length()*.5),e}intersect(e){return this.min.max(e.min),this.max.min(e.max),this.isEmpty()&&this.makeEmpty(),this}union(e){return this.min.min(e.min),this.max.max(e.max),this}applyMatrix4(e){return this.isEmpty()?this:(pn[0].set(this.min.x,this.min.y,this.min.z).applyMatrix4(e),pn[1].set(this.min.x,this.min.y,this.max.z).applyMatrix4(e),pn[2].set(this.min.x,this.max.y,this.min.z).applyMatrix4(e),pn[3].set(this.min.x,this.max.y,this.max.z).applyMatrix4(e),pn[4].set(this.max.x,this.min.y,this.min.z).applyMatrix4(e),pn[5].set(this.max.x,this.min.y,this.max.z).applyMatrix4(e),pn[6].set(this.max.x,this.max.y,this.min.z).applyMatrix4(e),pn[7].set(this.max.x,this.max.y,this.max.z).applyMatrix4(e),this.setFromPoints(pn),this)}translate(e){return this.min.add(e),this.max.add(e),this}equals(e){return e.min.equals(this.min)&&e.max.equals(this.max)}}const pn=[new N,new N,new N,new N,new N,new N,new N,new N],Zt=new N,ws=new Ss,mi=new N,gi=new N,_i=new N,Pn=new N,Dn=new N,Kn=new N,es=new N,Rs=new N,Cs=new N,$n=new N;function Cr(n,e,t,i,s){for(let r=0,a=n.length-3;r<=a;r+=3){$n.fromArray(n,r);const o=s.x*Math.abs($n.x)+s.y*Math.abs($n.y)+s.z*Math.abs($n.z),l=e.dot($n),c=t.dot($n),u=i.dot($n);if(Math.max(-Math.max(l,c,u),Math.min(l,c,u))>o)return!1}return!0}const Ku=new Ss,ts=new N,Pr=new N;class _r{constructor(e=new N,t=-1){this.isSphere=!0,this.center=e,this.radius=t}set(e,t){return this.center.copy(e),this.radius=t,this}setFromPoints(e,t){const i=this.center;t!==void 0?i.copy(t):Ku.setFromPoints(e).getCenter(i);let s=0;for(let r=0,a=e.length;r<a;r++)s=Math.max(s,i.distanceToSquared(e[r]));return this.radius=Math.sqrt(s),this}copy(e){return this.center.copy(e.center),this.radius=e.radius,this}isEmpty(){return this.radius<0}makeEmpty(){return this.center.set(0,0,0),this.radius=-1,this}containsPoint(e){return e.distanceToSquared(this.center)<=this.radius*this.radius}distanceToPoint(e){return e.distanceTo(this.center)-this.radius}intersectsSphere(e){const t=this.radius+e.radius;return e.center.distanceToSquared(this.center)<=t*t}intersectsBox(e){return e.intersectsSphere(this)}intersectsPlane(e){return Math.abs(e.distanceToPoint(this.center))<=this.radius}clampPoint(e,t){const i=this.center.distanceToSquared(e);return t.copy(e),i>this.radius*this.radius&&(t.sub(this.center).normalize(),t.multiplyScalar(this.radius).add(this.center)),t}getBoundingBox(e){return this.isEmpty()?(e.makeEmpty(),e):(e.set(this.center,this.center),e.expandByScalar(this.radius),e)}applyMatrix4(e){return this.center.applyMatrix4(e),this.radius=this.radius*e.getMaxScaleOnAxis(),this}translate(e){return this.center.add(e),this}expandByPoint(e){if(this.isEmpty())return this.center.copy(e),this.radius=0,this;ts.subVectors(e,this.center);const t=ts.lengthSq();if(t>this.radius*this.radius){const i=Math.sqrt(t),s=(i-this.radius)*.5;this.center.addScaledVector(ts,s/i),this.radius+=s}return this}union(e){return e.isEmpty()?this:this.isEmpty()?(this.copy(e),this):(this.center.equals(e.center)===!0?this.radius=Math.max(this.radius,e.radius):(Pr.subVectors(e.center,this.center).setLength(e.radius),this.expandByPoint(ts.copy(e.center).add(Pr)),this.expandByPoint(ts.copy(e.center).sub(Pr))),this)}equals(e){return e.center.equals(this.center)&&e.radius===this.radius}clone(){return new this.constructor().copy(this)}}const mn=new N,Dr=new N,Ps=new N,Ln=new N,Lr=new N,Ds=new N,Ir=new N;class Ql{constructor(e=new N,t=new N(0,0,-1)){this.origin=e,this.direction=t}set(e,t){return this.origin.copy(e),this.direction.copy(t),this}copy(e){return this.origin.copy(e.origin),this.direction.copy(e.direction),this}at(e,t){return t.copy(this.origin).addScaledVector(this.direction,e)}lookAt(e){return this.direction.copy(e).sub(this.origin).normalize(),this}recast(e){return this.origin.copy(this.at(e,mn)),this}closestPointToPoint(e,t){t.subVectors(e,this.origin);const i=t.dot(this.direction);return i<0?t.copy(this.origin):t.copy(this.origin).addScaledVector(this.direction,i)}distanceToPoint(e){return Math.sqrt(this.distanceSqToPoint(e))}distanceSqToPoint(e){const t=mn.subVectors(e,this.origin).dot(this.direction);return t<0?this.origin.distanceToSquared(e):(mn.copy(this.origin).addScaledVector(this.direction,t),mn.distanceToSquared(e))}distanceSqToSegment(e,t,i,s){Dr.copy(e).add(t).multiplyScalar(.5),Ps.copy(t).sub(e).normalize(),Ln.copy(this.origin).sub(Dr);const r=e.distanceTo(t)*.5,a=-this.direction.dot(Ps),o=Ln.dot(this.direction),l=-Ln.dot(Ps),c=Ln.lengthSq(),u=Math.abs(1-a*a);let f,d,m,_;if(u>0)if(f=a*l-o,d=a*o-l,_=r*u,f>=0)if(d>=-_)if(d<=_){const v=1/u;f*=v,d*=v,m=f*(f+a*d+2*o)+d*(a*f+d+2*l)+c}else d=r,f=Math.max(0,-(a*d+o)),m=-f*f+d*(d+2*l)+c;else d=-r,f=Math.max(0,-(a*d+o)),m=-f*f+d*(d+2*l)+c;else d<=-_?(f=Math.max(0,-(-a*r+o)),d=f>0?-r:Math.min(Math.max(-r,-l),r),m=-f*f+d*(d+2*l)+c):d<=_?(f=0,d=Math.min(Math.max(-r,-l),r),m=d*(d+2*l)+c):(f=Math.max(0,-(a*r+o)),d=f>0?r:Math.min(Math.max(-r,-l),r),m=-f*f+d*(d+2*l)+c);else d=a>0?-r:r,f=Math.max(0,-(a*d+o)),m=-f*f+d*(d+2*l)+c;return i&&i.copy(this.origin).addScaledVector(this.direction,f),s&&s.copy(Dr).addScaledVector(Ps,d),m}intersectSphere(e,t){mn.subVectors(e.center,this.origin);const i=mn.dot(this.direction),s=mn.dot(mn)-i*i,r=e.radius*e.radius;if(s>r)return null;const a=Math.sqrt(r-s),o=i-a,l=i+a;return l<0?null:o<0?this.at(l,t):this.at(o,t)}intersectsSphere(e){return this.distanceSqToPoint(e.center)<=e.radius*e.radius}distanceToPlane(e){const t=e.normal.dot(this.direction);if(t===0)return e.distanceToPoint(this.origin)===0?0:null;const i=-(this.origin.dot(e.normal)+e.constant)/t;return i>=0?i:null}intersectPlane(e,t){const i=this.distanceToPlane(e);return i===null?null:this.at(i,t)}intersectsPlane(e){const t=e.distanceToPoint(this.origin);return t===0||e.normal.dot(this.direction)*t<0}intersectBox(e,t){let i,s,r,a,o,l;const c=1/this.direction.x,u=1/this.direction.y,f=1/this.direction.z,d=this.origin;return c>=0?(i=(e.min.x-d.x)*c,s=(e.max.x-d.x)*c):(i=(e.max.x-d.x)*c,s=(e.min.x-d.x)*c),u>=0?(r=(e.min.y-d.y)*u,a=(e.max.y-d.y)*u):(r=(e.max.y-d.y)*u,a=(e.min.y-d.y)*u),i>a||r>s||((r>i||isNaN(i))&&(i=r),(a<s||isNaN(s))&&(s=a),f>=0?(o=(e.min.z-d.z)*f,l=(e.max.z-d.z)*f):(o=(e.max.z-d.z)*f,l=(e.min.z-d.z)*f),i>l||o>s)||((o>i||i!==i)&&(i=o),(l<s||s!==s)&&(s=l),s<0)?null:this.at(i>=0?i:s,t)}intersectsBox(e){return this.intersectBox(e,mn)!==null}intersectTriangle(e,t,i,s,r){Lr.subVectors(t,e),Ds.subVectors(i,e),Ir.crossVectors(Lr,Ds);let a=this.direction.dot(Ir),o;if(a>0){if(s)return null;o=1}else if(a<0)o=-1,a=-a;else return null;Ln.subVectors(this.origin,e);const l=o*this.direction.dot(Ds.crossVectors(Ln,Ds));if(l<0)return null;const c=o*this.direction.dot(Lr.cross(Ln));if(c<0||l+c>a)return null;const u=-o*Ln.dot(Ir);return u<0?null:this.at(u/a,r)}applyMatrix4(e){return this.origin.applyMatrix4(e),this.direction.transformDirection(e),this}equals(e){return e.origin.equals(this.origin)&&e.direction.equals(this.direction)}clone(){return new this.constructor().copy(this)}}class rt{constructor(e,t,i,s,r,a,o,l,c,u,f,d,m,_,v,p){rt.prototype.isMatrix4=!0,this.elements=[1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1],e!==void 0&&this.set(e,t,i,s,r,a,o,l,c,u,f,d,m,_,v,p)}set(e,t,i,s,r,a,o,l,c,u,f,d,m,_,v,p){const h=this.elements;return h[0]=e,h[4]=t,h[8]=i,h[12]=s,h[1]=r,h[5]=a,h[9]=o,h[13]=l,h[2]=c,h[6]=u,h[10]=f,h[14]=d,h[3]=m,h[7]=_,h[11]=v,h[15]=p,this}identity(){return this.set(1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1),this}clone(){return new rt().fromArray(this.elements)}copy(e){const t=this.elements,i=e.elements;return t[0]=i[0],t[1]=i[1],t[2]=i[2],t[3]=i[3],t[4]=i[4],t[5]=i[5],t[6]=i[6],t[7]=i[7],t[8]=i[8],t[9]=i[9],t[10]=i[10],t[11]=i[11],t[12]=i[12],t[13]=i[13],t[14]=i[14],t[15]=i[15],this}copyPosition(e){const t=this.elements,i=e.elements;return t[12]=i[12],t[13]=i[13],t[14]=i[14],this}setFromMatrix3(e){const t=e.elements;return this.set(t[0],t[3],t[6],0,t[1],t[4],t[7],0,t[2],t[5],t[8],0,0,0,0,1),this}extractBasis(e,t,i){return e.setFromMatrixColumn(this,0),t.setFromMatrixColumn(this,1),i.setFromMatrixColumn(this,2),this}makeBasis(e,t,i){return this.set(e.x,t.x,i.x,0,e.y,t.y,i.y,0,e.z,t.z,i.z,0,0,0,0,1),this}extractRotation(e){const t=this.elements,i=e.elements,s=1/vi.setFromMatrixColumn(e,0).length(),r=1/vi.setFromMatrixColumn(e,1).length(),a=1/vi.setFromMatrixColumn(e,2).length();return t[0]=i[0]*s,t[1]=i[1]*s,t[2]=i[2]*s,t[3]=0,t[4]=i[4]*r,t[5]=i[5]*r,t[6]=i[6]*r,t[7]=0,t[8]=i[8]*a,t[9]=i[9]*a,t[10]=i[10]*a,t[11]=0,t[12]=0,t[13]=0,t[14]=0,t[15]=1,this}makeRotationFromEuler(e){const t=this.elements,i=e.x,s=e.y,r=e.z,a=Math.cos(i),o=Math.sin(i),l=Math.cos(s),c=Math.sin(s),u=Math.cos(r),f=Math.sin(r);if(e.order==="XYZ"){const d=a*u,m=a*f,_=o*u,v=o*f;t[0]=l*u,t[4]=-l*f,t[8]=c,t[1]=m+_*c,t[5]=d-v*c,t[9]=-o*l,t[2]=v-d*c,t[6]=_+m*c,t[10]=a*l}else if(e.order==="YXZ"){const d=l*u,m=l*f,_=c*u,v=c*f;t[0]=d+v*o,t[4]=_*o-m,t[8]=a*c,t[1]=a*f,t[5]=a*u,t[9]=-o,t[2]=m*o-_,t[6]=v+d*o,t[10]=a*l}else if(e.order==="ZXY"){const d=l*u,m=l*f,_=c*u,v=c*f;t[0]=d-v*o,t[4]=-a*f,t[8]=_+m*o,t[1]=m+_*o,t[5]=a*u,t[9]=v-d*o,t[2]=-a*c,t[6]=o,t[10]=a*l}else if(e.order==="ZYX"){const d=a*u,m=a*f,_=o*u,v=o*f;t[0]=l*u,t[4]=_*c-m,t[8]=d*c+v,t[1]=l*f,t[5]=v*c+d,t[9]=m*c-_,t[2]=-c,t[6]=o*l,t[10]=a*l}else if(e.order==="YZX"){const d=a*l,m=a*c,_=o*l,v=o*c;t[0]=l*u,t[4]=v-d*f,t[8]=_*f+m,t[1]=f,t[5]=a*u,t[9]=-o*u,t[2]=-c*u,t[6]=m*f+_,t[10]=d-v*f}else if(e.order==="XZY"){const d=a*l,m=a*c,_=o*l,v=o*c;t[0]=l*u,t[4]=-f,t[8]=c*u,t[1]=d*f+v,t[5]=a*u,t[9]=m*f-_,t[2]=_*f-m,t[6]=o*u,t[10]=v*f+d}return t[3]=0,t[7]=0,t[11]=0,t[12]=0,t[13]=0,t[14]=0,t[15]=1,this}makeRotationFromQuaternion(e){return this.compose($u,e,Zu)}lookAt(e,t,i){const s=this.elements;return Lt.subVectors(e,t),Lt.lengthSq()===0&&(Lt.z=1),Lt.normalize(),In.crossVectors(i,Lt),In.lengthSq()===0&&(Math.abs(i.z)===1?Lt.x+=1e-4:Lt.z+=1e-4,Lt.normalize(),In.crossVectors(i,Lt)),In.normalize(),Ls.crossVectors(Lt,In),s[0]=In.x,s[4]=Ls.x,s[8]=Lt.x,s[1]=In.y,s[5]=Ls.y,s[9]=Lt.y,s[2]=In.z,s[6]=Ls.z,s[10]=Lt.z,this}multiply(e){return this.multiplyMatrices(this,e)}premultiply(e){return this.multiplyMatrices(e,this)}multiplyMatrices(e,t){const i=e.elements,s=t.elements,r=this.elements,a=i[0],o=i[4],l=i[8],c=i[12],u=i[1],f=i[5],d=i[9],m=i[13],_=i[2],v=i[6],p=i[10],h=i[14],A=i[3],S=i[7],g=i[11],P=i[15],b=s[0],w=s[4],D=s[8],E=s[12],M=s[1],C=s[5],H=s[9],F=s[13],W=s[2],$=s[6],k=s[10],j=s[14],V=s[3],ne=s[7],Q=s[11],re=s[15];return r[0]=a*b+o*M+l*W+c*V,r[4]=a*w+o*C+l*$+c*ne,r[8]=a*D+o*H+l*k+c*Q,r[12]=a*E+o*F+l*j+c*re,r[1]=u*b+f*M+d*W+m*V,r[5]=u*w+f*C+d*$+m*ne,r[9]=u*D+f*H+d*k+m*Q,r[13]=u*E+f*F+d*j+m*re,r[2]=_*b+v*M+p*W+h*V,r[6]=_*w+v*C+p*$+h*ne,r[10]=_*D+v*H+p*k+h*Q,r[14]=_*E+v*F+p*j+h*re,r[3]=A*b+S*M+g*W+P*V,r[7]=A*w+S*C+g*$+P*ne,r[11]=A*D+S*H+g*k+P*Q,r[15]=A*E+S*F+g*j+P*re,this}multiplyScalar(e){const t=this.elements;return t[0]*=e,t[4]*=e,t[8]*=e,t[12]*=e,t[1]*=e,t[5]*=e,t[9]*=e,t[13]*=e,t[2]*=e,t[6]*=e,t[10]*=e,t[14]*=e,t[3]*=e,t[7]*=e,t[11]*=e,t[15]*=e,this}determinant(){const e=this.elements,t=e[0],i=e[4],s=e[8],r=e[12],a=e[1],o=e[5],l=e[9],c=e[13],u=e[2],f=e[6],d=e[10],m=e[14],_=e[3],v=e[7],p=e[11],h=e[15];return _*(+r*l*f-s*c*f-r*o*d+i*c*d+s*o*m-i*l*m)+v*(+t*l*m-t*c*d+r*a*d-s*a*m+s*c*u-r*l*u)+p*(+t*c*f-t*o*m-r*a*f+i*a*m+r*o*u-i*c*u)+h*(-s*o*u-t*l*f+t*o*d+s*a*f-i*a*d+i*l*u)}transpose(){const e=this.elements;let t;return t=e[1],e[1]=e[4],e[4]=t,t=e[2],e[2]=e[8],e[8]=t,t=e[6],e[6]=e[9],e[9]=t,t=e[3],e[3]=e[12],e[12]=t,t=e[7],e[7]=e[13],e[13]=t,t=e[11],e[11]=e[14],e[14]=t,this}setPosition(e,t,i){const s=this.elements;return e.isVector3?(s[12]=e.x,s[13]=e.y,s[14]=e.z):(s[12]=e,s[13]=t,s[14]=i),this}invert(){const e=this.elements,t=e[0],i=e[1],s=e[2],r=e[3],a=e[4],o=e[5],l=e[6],c=e[7],u=e[8],f=e[9],d=e[10],m=e[11],_=e[12],v=e[13],p=e[14],h=e[15],A=f*p*c-v*d*c+v*l*m-o*p*m-f*l*h+o*d*h,S=_*d*c-u*p*c-_*l*m+a*p*m+u*l*h-a*d*h,g=u*v*c-_*f*c+_*o*m-a*v*m-u*o*h+a*f*h,P=_*f*l-u*v*l-_*o*d+a*v*d+u*o*p-a*f*p,b=t*A+i*S+s*g+r*P;if(b===0)return this.set(0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0);const w=1/b;return e[0]=A*w,e[1]=(v*d*r-f*p*r-v*s*m+i*p*m+f*s*h-i*d*h)*w,e[2]=(o*p*r-v*l*r+v*s*c-i*p*c-o*s*h+i*l*h)*w,e[3]=(f*l*r-o*d*r-f*s*c+i*d*c+o*s*m-i*l*m)*w,e[4]=S*w,e[5]=(u*p*r-_*d*r+_*s*m-t*p*m-u*s*h+t*d*h)*w,e[6]=(_*l*r-a*p*r-_*s*c+t*p*c+a*s*h-t*l*h)*w,e[7]=(a*d*r-u*l*r+u*s*c-t*d*c-a*s*m+t*l*m)*w,e[8]=g*w,e[9]=(_*f*r-u*v*r-_*i*m+t*v*m+u*i*h-t*f*h)*w,e[10]=(a*v*r-_*o*r+_*i*c-t*v*c-a*i*h+t*o*h)*w,e[11]=(u*o*r-a*f*r-u*i*c+t*f*c+a*i*m-t*o*m)*w,e[12]=P*w,e[13]=(u*v*s-_*f*s+_*i*d-t*v*d-u*i*p+t*f*p)*w,e[14]=(_*o*s-a*v*s-_*i*l+t*v*l+a*i*p-t*o*p)*w,e[15]=(a*f*s-u*o*s+u*i*l-t*f*l-a*i*d+t*o*d)*w,this}scale(e){const t=this.elements,i=e.x,s=e.y,r=e.z;return t[0]*=i,t[4]*=s,t[8]*=r,t[1]*=i,t[5]*=s,t[9]*=r,t[2]*=i,t[6]*=s,t[10]*=r,t[3]*=i,t[7]*=s,t[11]*=r,this}getMaxScaleOnAxis(){const e=this.elements,t=e[0]*e[0]+e[1]*e[1]+e[2]*e[2],i=e[4]*e[4]+e[5]*e[5]+e[6]*e[6],s=e[8]*e[8]+e[9]*e[9]+e[10]*e[10];return Math.sqrt(Math.max(t,i,s))}makeTranslation(e,t,i){return e.isVector3?this.set(1,0,0,e.x,0,1,0,e.y,0,0,1,e.z,0,0,0,1):this.set(1,0,0,e,0,1,0,t,0,0,1,i,0,0,0,1),this}makeRotationX(e){const t=Math.cos(e),i=Math.sin(e);return this.set(1,0,0,0,0,t,-i,0,0,i,t,0,0,0,0,1),this}makeRotationY(e){const t=Math.cos(e),i=Math.sin(e);return this.set(t,0,i,0,0,1,0,0,-i,0,t,0,0,0,0,1),this}makeRotationZ(e){const t=Math.cos(e),i=Math.sin(e);return this.set(t,-i,0,0,i,t,0,0,0,0,1,0,0,0,0,1),this}makeRotationAxis(e,t){const i=Math.cos(t),s=Math.sin(t),r=1-i,a=e.x,o=e.y,l=e.z,c=r*a,u=r*o;return this.set(c*a+i,c*o-s*l,c*l+s*o,0,c*o+s*l,u*o+i,u*l-s*a,0,c*l-s*o,u*l+s*a,r*l*l+i,0,0,0,0,1),this}makeScale(e,t,i){return this.set(e,0,0,0,0,t,0,0,0,0,i,0,0,0,0,1),this}makeShear(e,t,i,s,r,a){return this.set(1,i,r,0,e,1,a,0,t,s,1,0,0,0,0,1),this}compose(e,t,i){const s=this.elements,r=t._x,a=t._y,o=t._z,l=t._w,c=r+r,u=a+a,f=o+o,d=r*c,m=r*u,_=r*f,v=a*u,p=a*f,h=o*f,A=l*c,S=l*u,g=l*f,P=i.x,b=i.y,w=i.z;return s[0]=(1-(v+h))*P,s[1]=(m+g)*P,s[2]=(_-S)*P,s[3]=0,s[4]=(m-g)*b,s[5]=(1-(d+h))*b,s[6]=(p+A)*b,s[7]=0,s[8]=(_+S)*w,s[9]=(p-A)*w,s[10]=(1-(d+v))*w,s[11]=0,s[12]=e.x,s[13]=e.y,s[14]=e.z,s[15]=1,this}decompose(e,t,i){const s=this.elements;let r=vi.set(s[0],s[1],s[2]).length();const a=vi.set(s[4],s[5],s[6]).length(),o=vi.set(s[8],s[9],s[10]).length();this.determinant()<0&&(r=-r),e.x=s[12],e.y=s[13],e.z=s[14],jt.copy(this);const c=1/r,u=1/a,f=1/o;return jt.elements[0]*=c,jt.elements[1]*=c,jt.elements[2]*=c,jt.elements[4]*=u,jt.elements[5]*=u,jt.elements[6]*=u,jt.elements[8]*=f,jt.elements[9]*=f,jt.elements[10]*=f,t.setFromRotationMatrix(jt),i.x=r,i.y=a,i.z=o,this}makePerspective(e,t,i,s,r,a,o=Mn){const l=this.elements,c=2*r/(t-e),u=2*r/(i-s),f=(t+e)/(t-e),d=(i+s)/(i-s);let m,_;if(o===Mn)m=-(a+r)/(a-r),_=-2*a*r/(a-r);else if(o===or)m=-a/(a-r),_=-a*r/(a-r);else throw new Error("THREE.Matrix4.makePerspective(): Invalid coordinate system: "+o);return l[0]=c,l[4]=0,l[8]=f,l[12]=0,l[1]=0,l[5]=u,l[9]=d,l[13]=0,l[2]=0,l[6]=0,l[10]=m,l[14]=_,l[3]=0,l[7]=0,l[11]=-1,l[15]=0,this}makeOrthographic(e,t,i,s,r,a,o=Mn){const l=this.elements,c=1/(t-e),u=1/(i-s),f=1/(a-r),d=(t+e)*c,m=(i+s)*u;let _,v;if(o===Mn)_=(a+r)*f,v=-2*f;else if(o===or)_=r*f,v=-1*f;else throw new Error("THREE.Matrix4.makeOrthographic(): Invalid coordinate system: "+o);return l[0]=2*c,l[4]=0,l[8]=0,l[12]=-d,l[1]=0,l[5]=2*u,l[9]=0,l[13]=-m,l[2]=0,l[6]=0,l[10]=v,l[14]=-_,l[3]=0,l[7]=0,l[11]=0,l[15]=1,this}equals(e){const t=this.elements,i=e.elements;for(let s=0;s<16;s++)if(t[s]!==i[s])return!1;return!0}fromArray(e,t=0){for(let i=0;i<16;i++)this.elements[i]=e[i+t];return this}toArray(e=[],t=0){const i=this.elements;return e[t]=i[0],e[t+1]=i[1],e[t+2]=i[2],e[t+3]=i[3],e[t+4]=i[4],e[t+5]=i[5],e[t+6]=i[6],e[t+7]=i[7],e[t+8]=i[8],e[t+9]=i[9],e[t+10]=i[10],e[t+11]=i[11],e[t+12]=i[12],e[t+13]=i[13],e[t+14]=i[14],e[t+15]=i[15],e}}const vi=new N,jt=new rt,$u=new N(0,0,0),Zu=new N(1,1,1),In=new N,Ls=new N,Lt=new N,Uo=new rt,No=new Ki;class An{constructor(e=0,t=0,i=0,s=An.DEFAULT_ORDER){this.isEuler=!0,this._x=e,this._y=t,this._z=i,this._order=s}get x(){return this._x}set x(e){this._x=e,this._onChangeCallback()}get y(){return this._y}set y(e){this._y=e,this._onChangeCallback()}get z(){return this._z}set z(e){this._z=e,this._onChangeCallback()}get order(){return this._order}set order(e){this._order=e,this._onChangeCallback()}set(e,t,i,s=this._order){return this._x=e,this._y=t,this._z=i,this._order=s,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._order)}copy(e){return this._x=e._x,this._y=e._y,this._z=e._z,this._order=e._order,this._onChangeCallback(),this}setFromRotationMatrix(e,t=this._order,i=!0){const s=e.elements,r=s[0],a=s[4],o=s[8],l=s[1],c=s[5],u=s[9],f=s[2],d=s[6],m=s[10];switch(t){case"XYZ":this._y=Math.asin(bt(o,-1,1)),Math.abs(o)<.9999999?(this._x=Math.atan2(-u,m),this._z=Math.atan2(-a,r)):(this._x=Math.atan2(d,c),this._z=0);break;case"YXZ":this._x=Math.asin(-bt(u,-1,1)),Math.abs(u)<.9999999?(this._y=Math.atan2(o,m),this._z=Math.atan2(l,c)):(this._y=Math.atan2(-f,r),this._z=0);break;case"ZXY":this._x=Math.asin(bt(d,-1,1)),Math.abs(d)<.9999999?(this._y=Math.atan2(-f,m),this._z=Math.atan2(-a,c)):(this._y=0,this._z=Math.atan2(l,r));break;case"ZYX":this._y=Math.asin(-bt(f,-1,1)),Math.abs(f)<.9999999?(this._x=Math.atan2(d,m),this._z=Math.atan2(l,r)):(this._x=0,this._z=Math.atan2(-a,c));break;case"YZX":this._z=Math.asin(bt(l,-1,1)),Math.abs(l)<.9999999?(this._x=Math.atan2(-u,c),this._y=Math.atan2(-f,r)):(this._x=0,this._y=Math.atan2(o,m));break;case"XZY":this._z=Math.asin(-bt(a,-1,1)),Math.abs(a)<.9999999?(this._x=Math.atan2(d,c),this._y=Math.atan2(o,r)):(this._x=Math.atan2(-u,m),this._y=0);break;default:console.warn("THREE.Euler: .setFromRotationMatrix() encountered an unknown order: "+t)}return this._order=t,i===!0&&this._onChangeCallback(),this}setFromQuaternion(e,t,i){return Uo.makeRotationFromQuaternion(e),this.setFromRotationMatrix(Uo,t,i)}setFromVector3(e,t=this._order){return this.set(e.x,e.y,e.z,t)}reorder(e){return No.setFromEuler(this),this.setFromQuaternion(No,e)}equals(e){return e._x===this._x&&e._y===this._y&&e._z===this._z&&e._order===this._order}fromArray(e){return this._x=e[0],this._y=e[1],this._z=e[2],e[3]!==void 0&&(this._order=e[3]),this._onChangeCallback(),this}toArray(e=[],t=0){return e[t]=this._x,e[t+1]=this._y,e[t+2]=this._z,e[t+3]=this._order,e}_onChange(e){return this._onChangeCallback=e,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._order}}An.DEFAULT_ORDER="XYZ";class ec{constructor(){this.mask=1}set(e){this.mask=(1<<e|0)>>>0}enable(e){this.mask|=1<<e|0}enableAll(){this.mask=-1}toggle(e){this.mask^=1<<e|0}disable(e){this.mask&=~(1<<e|0)}disableAll(){this.mask=0}test(e){return(this.mask&e.mask)!==0}isEnabled(e){return(this.mask&(1<<e|0))!==0}}let ju=0;const Fo=new N,xi=new Ki,gn=new rt,Is=new N,ns=new N,Ju=new N,Qu=new Ki,Oo=new N(1,0,0),Bo=new N(0,1,0),zo=new N(0,0,1),ko={type:"added"},eh={type:"removed"},Mi={type:"childadded",child:null},Ur={type:"childremoved",child:null};class Ct extends Yi{constructor(){super(),this.isObject3D=!0,Object.defineProperty(this,"id",{value:ju++}),this.uuid=Ms(),this.name="",this.type="Object3D",this.parent=null,this.children=[],this.up=Ct.DEFAULT_UP.clone();const e=new N,t=new An,i=new Ki,s=new N(1,1,1);function r(){i.setFromEuler(t,!1)}function a(){t.setFromQuaternion(i,void 0,!1)}t._onChange(r),i._onChange(a),Object.defineProperties(this,{position:{configurable:!0,enumerable:!0,value:e},rotation:{configurable:!0,enumerable:!0,value:t},quaternion:{configurable:!0,enumerable:!0,value:i},scale:{configurable:!0,enumerable:!0,value:s},modelViewMatrix:{value:new rt},normalMatrix:{value:new Ne}}),this.matrix=new rt,this.matrixWorld=new rt,this.matrixAutoUpdate=Ct.DEFAULT_MATRIX_AUTO_UPDATE,this.matrixWorldAutoUpdate=Ct.DEFAULT_MATRIX_WORLD_AUTO_UPDATE,this.matrixWorldNeedsUpdate=!1,this.layers=new ec,this.visible=!0,this.castShadow=!1,this.receiveShadow=!1,this.frustumCulled=!0,this.renderOrder=0,this.animations=[],this.userData={}}onBeforeShadow(){}onAfterShadow(){}onBeforeRender(){}onAfterRender(){}applyMatrix4(e){this.matrixAutoUpdate&&this.updateMatrix(),this.matrix.premultiply(e),this.matrix.decompose(this.position,this.quaternion,this.scale)}applyQuaternion(e){return this.quaternion.premultiply(e),this}setRotationFromAxisAngle(e,t){this.quaternion.setFromAxisAngle(e,t)}setRotationFromEuler(e){this.quaternion.setFromEuler(e,!0)}setRotationFromMatrix(e){this.quaternion.setFromRotationMatrix(e)}setRotationFromQuaternion(e){this.quaternion.copy(e)}rotateOnAxis(e,t){return xi.setFromAxisAngle(e,t),this.quaternion.multiply(xi),this}rotateOnWorldAxis(e,t){return xi.setFromAxisAngle(e,t),this.quaternion.premultiply(xi),this}rotateX(e){return this.rotateOnAxis(Oo,e)}rotateY(e){return this.rotateOnAxis(Bo,e)}rotateZ(e){return this.rotateOnAxis(zo,e)}translateOnAxis(e,t){return Fo.copy(e).applyQuaternion(this.quaternion),this.position.add(Fo.multiplyScalar(t)),this}translateX(e){return this.translateOnAxis(Oo,e)}translateY(e){return this.translateOnAxis(Bo,e)}translateZ(e){return this.translateOnAxis(zo,e)}localToWorld(e){return this.updateWorldMatrix(!0,!1),e.applyMatrix4(this.matrixWorld)}worldToLocal(e){return this.updateWorldMatrix(!0,!1),e.applyMatrix4(gn.copy(this.matrixWorld).invert())}lookAt(e,t,i){e.isVector3?Is.copy(e):Is.set(e,t,i);const s=this.parent;this.updateWorldMatrix(!0,!1),ns.setFromMatrixPosition(this.matrixWorld),this.isCamera||this.isLight?gn.lookAt(ns,Is,this.up):gn.lookAt(Is,ns,this.up),this.quaternion.setFromRotationMatrix(gn),s&&(gn.extractRotation(s.matrixWorld),xi.setFromRotationMatrix(gn),this.quaternion.premultiply(xi.invert()))}add(e){if(arguments.length>1){for(let t=0;t<arguments.length;t++)this.add(arguments[t]);return this}return e===this?(console.error("THREE.Object3D.add: object can't be added as a child of itself.",e),this):(e&&e.isObject3D?(e.removeFromParent(),e.parent=this,this.children.push(e),e.dispatchEvent(ko),Mi.child=e,this.dispatchEvent(Mi),Mi.child=null):console.error("THREE.Object3D.add: object not an instance of THREE.Object3D.",e),this)}remove(e){if(arguments.length>1){for(let i=0;i<arguments.length;i++)this.remove(arguments[i]);return this}const t=this.children.indexOf(e);return t!==-1&&(e.parent=null,this.children.splice(t,1),e.dispatchEvent(eh),Ur.child=e,this.dispatchEvent(Ur),Ur.child=null),this}removeFromParent(){const e=this.parent;return e!==null&&e.remove(this),this}clear(){return this.remove(...this.children)}attach(e){return this.updateWorldMatrix(!0,!1),gn.copy(this.matrixWorld).invert(),e.parent!==null&&(e.parent.updateWorldMatrix(!0,!1),gn.multiply(e.parent.matrixWorld)),e.applyMatrix4(gn),e.removeFromParent(),e.parent=this,this.children.push(e),e.updateWorldMatrix(!1,!0),e.dispatchEvent(ko),Mi.child=e,this.dispatchEvent(Mi),Mi.child=null,this}getObjectById(e){return this.getObjectByProperty("id",e)}getObjectByName(e){return this.getObjectByProperty("name",e)}getObjectByProperty(e,t){if(this[e]===t)return this;for(let i=0,s=this.children.length;i<s;i++){const a=this.children[i].getObjectByProperty(e,t);if(a!==void 0)return a}}getObjectsByProperty(e,t,i=[]){this[e]===t&&i.push(this);const s=this.children;for(let r=0,a=s.length;r<a;r++)s[r].getObjectsByProperty(e,t,i);return i}getWorldPosition(e){return this.updateWorldMatrix(!0,!1),e.setFromMatrixPosition(this.matrixWorld)}getWorldQuaternion(e){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(ns,e,Ju),e}getWorldScale(e){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(ns,Qu,e),e}getWorldDirection(e){this.updateWorldMatrix(!0,!1);const t=this.matrixWorld.elements;return e.set(t[8],t[9],t[10]).normalize()}raycast(){}traverse(e){e(this);const t=this.children;for(let i=0,s=t.length;i<s;i++)t[i].traverse(e)}traverseVisible(e){if(this.visible===!1)return;e(this);const t=this.children;for(let i=0,s=t.length;i<s;i++)t[i].traverseVisible(e)}traverseAncestors(e){const t=this.parent;t!==null&&(e(t),t.traverseAncestors(e))}updateMatrix(){this.matrix.compose(this.position,this.quaternion,this.scale),this.matrixWorldNeedsUpdate=!0}updateMatrixWorld(e){this.matrixAutoUpdate&&this.updateMatrix(),(this.matrixWorldNeedsUpdate||e)&&(this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),this.matrixWorldNeedsUpdate=!1,e=!0);const t=this.children;for(let i=0,s=t.length;i<s;i++)t[i].updateMatrixWorld(e)}updateWorldMatrix(e,t){const i=this.parent;if(e===!0&&i!==null&&i.updateWorldMatrix(!0,!1),this.matrixAutoUpdate&&this.updateMatrix(),this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),t===!0){const s=this.children;for(let r=0,a=s.length;r<a;r++)s[r].updateWorldMatrix(!1,!0)}}toJSON(e){const t=e===void 0||typeof e=="string",i={};t&&(e={geometries:{},materials:{},textures:{},images:{},shapes:{},skeletons:{},animations:{},nodes:{}},i.metadata={version:4.6,type:"Object",generator:"Object3D.toJSON"});const s={};s.uuid=this.uuid,s.type=this.type,this.name!==""&&(s.name=this.name),this.castShadow===!0&&(s.castShadow=!0),this.receiveShadow===!0&&(s.receiveShadow=!0),this.visible===!1&&(s.visible=!1),this.frustumCulled===!1&&(s.frustumCulled=!1),this.renderOrder!==0&&(s.renderOrder=this.renderOrder),Object.keys(this.userData).length>0&&(s.userData=this.userData),s.layers=this.layers.mask,s.matrix=this.matrix.toArray(),s.up=this.up.toArray(),this.matrixAutoUpdate===!1&&(s.matrixAutoUpdate=!1),this.isInstancedMesh&&(s.type="InstancedMesh",s.count=this.count,s.instanceMatrix=this.instanceMatrix.toJSON(),this.instanceColor!==null&&(s.instanceColor=this.instanceColor.toJSON())),this.isBatchedMesh&&(s.type="BatchedMesh",s.perObjectFrustumCulled=this.perObjectFrustumCulled,s.sortObjects=this.sortObjects,s.drawRanges=this._drawRanges,s.reservedRanges=this._reservedRanges,s.visibility=this._visibility,s.active=this._active,s.bounds=this._bounds.map(o=>({boxInitialized:o.boxInitialized,boxMin:o.box.min.toArray(),boxMax:o.box.max.toArray(),sphereInitialized:o.sphereInitialized,sphereRadius:o.sphere.radius,sphereCenter:o.sphere.center.toArray()})),s.maxInstanceCount=this._maxInstanceCount,s.maxVertexCount=this._maxVertexCount,s.maxIndexCount=this._maxIndexCount,s.geometryInitialized=this._geometryInitialized,s.geometryCount=this._geometryCount,s.matricesTexture=this._matricesTexture.toJSON(e),this._colorsTexture!==null&&(s.colorsTexture=this._colorsTexture.toJSON(e)),this.boundingSphere!==null&&(s.boundingSphere={center:s.boundingSphere.center.toArray(),radius:s.boundingSphere.radius}),this.boundingBox!==null&&(s.boundingBox={min:s.boundingBox.min.toArray(),max:s.boundingBox.max.toArray()}));function r(o,l){return o[l.uuid]===void 0&&(o[l.uuid]=l.toJSON(e)),l.uuid}if(this.isScene)this.background&&(this.background.isColor?s.background=this.background.toJSON():this.background.isTexture&&(s.background=this.background.toJSON(e).uuid)),this.environment&&this.environment.isTexture&&this.environment.isRenderTargetTexture!==!0&&(s.environment=this.environment.toJSON(e).uuid);else if(this.isMesh||this.isLine||this.isPoints){s.geometry=r(e.geometries,this.geometry);const o=this.geometry.parameters;if(o!==void 0&&o.shapes!==void 0){const l=o.shapes;if(Array.isArray(l))for(let c=0,u=l.length;c<u;c++){const f=l[c];r(e.shapes,f)}else r(e.shapes,l)}}if(this.isSkinnedMesh&&(s.bindMode=this.bindMode,s.bindMatrix=this.bindMatrix.toArray(),this.skeleton!==void 0&&(r(e.skeletons,this.skeleton),s.skeleton=this.skeleton.uuid)),this.material!==void 0)if(Array.isArray(this.material)){const o=[];for(let l=0,c=this.material.length;l<c;l++)o.push(r(e.materials,this.material[l]));s.material=o}else s.material=r(e.materials,this.material);if(this.children.length>0){s.children=[];for(let o=0;o<this.children.length;o++)s.children.push(this.children[o].toJSON(e).object)}if(this.animations.length>0){s.animations=[];for(let o=0;o<this.animations.length;o++){const l=this.animations[o];s.animations.push(r(e.animations,l))}}if(t){const o=a(e.geometries),l=a(e.materials),c=a(e.textures),u=a(e.images),f=a(e.shapes),d=a(e.skeletons),m=a(e.animations),_=a(e.nodes);o.length>0&&(i.geometries=o),l.length>0&&(i.materials=l),c.length>0&&(i.textures=c),u.length>0&&(i.images=u),f.length>0&&(i.shapes=f),d.length>0&&(i.skeletons=d),m.length>0&&(i.animations=m),_.length>0&&(i.nodes=_)}return i.object=s,i;function a(o){const l=[];for(const c in o){const u=o[c];delete u.metadata,l.push(u)}return l}}clone(e){return new this.constructor().copy(this,e)}copy(e,t=!0){if(this.name=e.name,this.up.copy(e.up),this.position.copy(e.position),this.rotation.order=e.rotation.order,this.quaternion.copy(e.quaternion),this.scale.copy(e.scale),this.matrix.copy(e.matrix),this.matrixWorld.copy(e.matrixWorld),this.matrixAutoUpdate=e.matrixAutoUpdate,this.matrixWorldAutoUpdate=e.matrixWorldAutoUpdate,this.matrixWorldNeedsUpdate=e.matrixWorldNeedsUpdate,this.layers.mask=e.layers.mask,this.visible=e.visible,this.castShadow=e.castShadow,this.receiveShadow=e.receiveShadow,this.frustumCulled=e.frustumCulled,this.renderOrder=e.renderOrder,this.animations=e.animations.slice(),this.userData=JSON.parse(JSON.stringify(e.userData)),t===!0)for(let i=0;i<e.children.length;i++){const s=e.children[i];this.add(s.clone())}return this}}Ct.DEFAULT_UP=new N(0,1,0);Ct.DEFAULT_MATRIX_AUTO_UPDATE=!0;Ct.DEFAULT_MATRIX_WORLD_AUTO_UPDATE=!0;const Jt=new N,_n=new N,Nr=new N,vn=new N,Si=new N,yi=new N,Go=new N,Fr=new N,Or=new N,Br=new N,zr=new tt,kr=new tt,Gr=new tt;class Qt{constructor(e=new N,t=new N,i=new N){this.a=e,this.b=t,this.c=i}static getNormal(e,t,i,s){s.subVectors(i,t),Jt.subVectors(e,t),s.cross(Jt);const r=s.lengthSq();return r>0?s.multiplyScalar(1/Math.sqrt(r)):s.set(0,0,0)}static getBarycoord(e,t,i,s,r){Jt.subVectors(s,t),_n.subVectors(i,t),Nr.subVectors(e,t);const a=Jt.dot(Jt),o=Jt.dot(_n),l=Jt.dot(Nr),c=_n.dot(_n),u=_n.dot(Nr),f=a*c-o*o;if(f===0)return r.set(0,0,0),null;const d=1/f,m=(c*l-o*u)*d,_=(a*u-o*l)*d;return r.set(1-m-_,_,m)}static containsPoint(e,t,i,s){return this.getBarycoord(e,t,i,s,vn)===null?!1:vn.x>=0&&vn.y>=0&&vn.x+vn.y<=1}static getInterpolation(e,t,i,s,r,a,o,l){return this.getBarycoord(e,t,i,s,vn)===null?(l.x=0,l.y=0,"z"in l&&(l.z=0),"w"in l&&(l.w=0),null):(l.setScalar(0),l.addScaledVector(r,vn.x),l.addScaledVector(a,vn.y),l.addScaledVector(o,vn.z),l)}static getInterpolatedAttribute(e,t,i,s,r,a){return zr.setScalar(0),kr.setScalar(0),Gr.setScalar(0),zr.fromBufferAttribute(e,t),kr.fromBufferAttribute(e,i),Gr.fromBufferAttribute(e,s),a.setScalar(0),a.addScaledVector(zr,r.x),a.addScaledVector(kr,r.y),a.addScaledVector(Gr,r.z),a}static isFrontFacing(e,t,i,s){return Jt.subVectors(i,t),_n.subVectors(e,t),Jt.cross(_n).dot(s)<0}set(e,t,i){return this.a.copy(e),this.b.copy(t),this.c.copy(i),this}setFromPointsAndIndices(e,t,i,s){return this.a.copy(e[t]),this.b.copy(e[i]),this.c.copy(e[s]),this}setFromAttributeAndIndices(e,t,i,s){return this.a.fromBufferAttribute(e,t),this.b.fromBufferAttribute(e,i),this.c.fromBufferAttribute(e,s),this}clone(){return new this.constructor().copy(this)}copy(e){return this.a.copy(e.a),this.b.copy(e.b),this.c.copy(e.c),this}getArea(){return Jt.subVectors(this.c,this.b),_n.subVectors(this.a,this.b),Jt.cross(_n).length()*.5}getMidpoint(e){return e.addVectors(this.a,this.b).add(this.c).multiplyScalar(1/3)}getNormal(e){return Qt.getNormal(this.a,this.b,this.c,e)}getPlane(e){return e.setFromCoplanarPoints(this.a,this.b,this.c)}getBarycoord(e,t){return Qt.getBarycoord(e,this.a,this.b,this.c,t)}getInterpolation(e,t,i,s,r){return Qt.getInterpolation(e,this.a,this.b,this.c,t,i,s,r)}containsPoint(e){return Qt.containsPoint(e,this.a,this.b,this.c)}isFrontFacing(e){return Qt.isFrontFacing(this.a,this.b,this.c,e)}intersectsBox(e){return e.intersectsTriangle(this)}closestPointToPoint(e,t){const i=this.a,s=this.b,r=this.c;let a,o;Si.subVectors(s,i),yi.subVectors(r,i),Fr.subVectors(e,i);const l=Si.dot(Fr),c=yi.dot(Fr);if(l<=0&&c<=0)return t.copy(i);Or.subVectors(e,s);const u=Si.dot(Or),f=yi.dot(Or);if(u>=0&&f<=u)return t.copy(s);const d=l*f-u*c;if(d<=0&&l>=0&&u<=0)return a=l/(l-u),t.copy(i).addScaledVector(Si,a);Br.subVectors(e,r);const m=Si.dot(Br),_=yi.dot(Br);if(_>=0&&m<=_)return t.copy(r);const v=m*c-l*_;if(v<=0&&c>=0&&_<=0)return o=c/(c-_),t.copy(i).addScaledVector(yi,o);const p=u*_-m*f;if(p<=0&&f-u>=0&&m-_>=0)return Go.subVectors(r,s),o=(f-u)/(f-u+(m-_)),t.copy(s).addScaledVector(Go,o);const h=1/(p+v+d);return a=v*h,o=d*h,t.copy(i).addScaledVector(Si,a).addScaledVector(yi,o)}equals(e){return e.a.equals(this.a)&&e.b.equals(this.b)&&e.c.equals(this.c)}}const tc={aliceblue:15792383,antiquewhite:16444375,aqua:65535,aquamarine:8388564,azure:15794175,beige:16119260,bisque:16770244,black:0,blanchedalmond:16772045,blue:255,blueviolet:9055202,brown:10824234,burlywood:14596231,cadetblue:6266528,chartreuse:8388352,chocolate:13789470,coral:16744272,cornflowerblue:6591981,cornsilk:16775388,crimson:14423100,cyan:65535,darkblue:139,darkcyan:35723,darkgoldenrod:12092939,darkgray:11119017,darkgreen:25600,darkgrey:11119017,darkkhaki:12433259,darkmagenta:9109643,darkolivegreen:5597999,darkorange:16747520,darkorchid:10040012,darkred:9109504,darksalmon:15308410,darkseagreen:9419919,darkslateblue:4734347,darkslategray:3100495,darkslategrey:3100495,darkturquoise:52945,darkviolet:9699539,deeppink:16716947,deepskyblue:49151,dimgray:6908265,dimgrey:6908265,dodgerblue:2003199,firebrick:11674146,floralwhite:16775920,forestgreen:2263842,fuchsia:16711935,gainsboro:14474460,ghostwhite:16316671,gold:16766720,goldenrod:14329120,gray:8421504,green:32768,greenyellow:11403055,grey:8421504,honeydew:15794160,hotpink:16738740,indianred:13458524,indigo:4915330,ivory:16777200,khaki:15787660,lavender:15132410,lavenderblush:16773365,lawngreen:8190976,lemonchiffon:16775885,lightblue:11393254,lightcoral:15761536,lightcyan:14745599,lightgoldenrodyellow:16448210,lightgray:13882323,lightgreen:9498256,lightgrey:13882323,lightpink:16758465,lightsalmon:16752762,lightseagreen:2142890,lightskyblue:8900346,lightslategray:7833753,lightslategrey:7833753,lightsteelblue:11584734,lightyellow:16777184,lime:65280,limegreen:3329330,linen:16445670,magenta:16711935,maroon:8388608,mediumaquamarine:6737322,mediumblue:205,mediumorchid:12211667,mediumpurple:9662683,mediumseagreen:3978097,mediumslateblue:8087790,mediumspringgreen:64154,mediumturquoise:4772300,mediumvioletred:13047173,midnightblue:1644912,mintcream:16121850,mistyrose:16770273,moccasin:16770229,navajowhite:16768685,navy:128,oldlace:16643558,olive:8421376,olivedrab:7048739,orange:16753920,orangered:16729344,orchid:14315734,palegoldenrod:15657130,palegreen:10025880,paleturquoise:11529966,palevioletred:14381203,papayawhip:16773077,peachpuff:16767673,peru:13468991,pink:16761035,plum:14524637,powderblue:11591910,purple:8388736,rebeccapurple:6697881,red:16711680,rosybrown:12357519,royalblue:4286945,saddlebrown:9127187,salmon:16416882,sandybrown:16032864,seagreen:3050327,seashell:16774638,sienna:10506797,silver:12632256,skyblue:8900331,slateblue:6970061,slategray:7372944,slategrey:7372944,snow:16775930,springgreen:65407,steelblue:4620980,tan:13808780,teal:32896,thistle:14204888,tomato:16737095,turquoise:4251856,violet:15631086,wheat:16113331,white:16777215,whitesmoke:16119285,yellow:16776960,yellowgreen:10145074},Un={h:0,s:0,l:0},Us={h:0,s:0,l:0};function Hr(n,e,t){return t<0&&(t+=1),t>1&&(t-=1),t<1/6?n+(e-n)*6*t:t<1/2?e:t<2/3?n+(e-n)*6*(2/3-t):n}class je{constructor(e,t,i){return this.isColor=!0,this.r=1,this.g=1,this.b=1,this.set(e,t,i)}set(e,t,i){if(t===void 0&&i===void 0){const s=e;s&&s.isColor?this.copy(s):typeof s=="number"?this.setHex(s):typeof s=="string"&&this.setStyle(s)}else this.setRGB(e,t,i);return this}setScalar(e){return this.r=e,this.g=e,this.b=e,this}setHex(e,t=kt){return e=Math.floor(e),this.r=(e>>16&255)/255,this.g=(e>>8&255)/255,this.b=(e&255)/255,qe.toWorkingColorSpace(this,t),this}setRGB(e,t,i,s=qe.workingColorSpace){return this.r=e,this.g=t,this.b=i,qe.toWorkingColorSpace(this,s),this}setHSL(e,t,i,s=qe.workingColorSpace){if(e=Bu(e,1),t=bt(t,0,1),i=bt(i,0,1),t===0)this.r=this.g=this.b=i;else{const r=i<=.5?i*(1+t):i+t-i*t,a=2*i-r;this.r=Hr(a,r,e+1/3),this.g=Hr(a,r,e),this.b=Hr(a,r,e-1/3)}return qe.toWorkingColorSpace(this,s),this}setStyle(e,t=kt){function i(r){r!==void 0&&parseFloat(r)<1&&console.warn("THREE.Color: Alpha component of "+e+" will be ignored.")}let s;if(s=/^(\w+)\(([^\)]*)\)/.exec(e)){let r;const a=s[1],o=s[2];switch(a){case"rgb":case"rgba":if(r=/^\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(o))return i(r[4]),this.setRGB(Math.min(255,parseInt(r[1],10))/255,Math.min(255,parseInt(r[2],10))/255,Math.min(255,parseInt(r[3],10))/255,t);if(r=/^\s*(\d+)\%\s*,\s*(\d+)\%\s*,\s*(\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(o))return i(r[4]),this.setRGB(Math.min(100,parseInt(r[1],10))/100,Math.min(100,parseInt(r[2],10))/100,Math.min(100,parseInt(r[3],10))/100,t);break;case"hsl":case"hsla":if(r=/^\s*(\d*\.?\d+)\s*,\s*(\d*\.?\d+)\%\s*,\s*(\d*\.?\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(o))return i(r[4]),this.setHSL(parseFloat(r[1])/360,parseFloat(r[2])/100,parseFloat(r[3])/100,t);break;default:console.warn("THREE.Color: Unknown color model "+e)}}else if(s=/^\#([A-Fa-f\d]+)$/.exec(e)){const r=s[1],a=r.length;if(a===3)return this.setRGB(parseInt(r.charAt(0),16)/15,parseInt(r.charAt(1),16)/15,parseInt(r.charAt(2),16)/15,t);if(a===6)return this.setHex(parseInt(r,16),t);console.warn("THREE.Color: Invalid hex color "+e)}else if(e&&e.length>0)return this.setColorName(e,t);return this}setColorName(e,t=kt){const i=tc[e.toLowerCase()];return i!==void 0?this.setHex(i,t):console.warn("THREE.Color: Unknown color "+e),this}clone(){return new this.constructor(this.r,this.g,this.b)}copy(e){return this.r=e.r,this.g=e.g,this.b=e.b,this}copySRGBToLinear(e){return this.r=Sn(e.r),this.g=Sn(e.g),this.b=Sn(e.b),this}copyLinearToSRGB(e){return this.r=Ii(e.r),this.g=Ii(e.g),this.b=Ii(e.b),this}convertSRGBToLinear(){return this.copySRGBToLinear(this),this}convertLinearToSRGB(){return this.copyLinearToSRGB(this),this}getHex(e=kt){return qe.fromWorkingColorSpace(Mt.copy(this),e),Math.round(bt(Mt.r*255,0,255))*65536+Math.round(bt(Mt.g*255,0,255))*256+Math.round(bt(Mt.b*255,0,255))}getHexString(e=kt){return("000000"+this.getHex(e).toString(16)).slice(-6)}getHSL(e,t=qe.workingColorSpace){qe.fromWorkingColorSpace(Mt.copy(this),t);const i=Mt.r,s=Mt.g,r=Mt.b,a=Math.max(i,s,r),o=Math.min(i,s,r);let l,c;const u=(o+a)/2;if(o===a)l=0,c=0;else{const f=a-o;switch(c=u<=.5?f/(a+o):f/(2-a-o),a){case i:l=(s-r)/f+(s<r?6:0);break;case s:l=(r-i)/f+2;break;case r:l=(i-s)/f+4;break}l/=6}return e.h=l,e.s=c,e.l=u,e}getRGB(e,t=qe.workingColorSpace){return qe.fromWorkingColorSpace(Mt.copy(this),t),e.r=Mt.r,e.g=Mt.g,e.b=Mt.b,e}getStyle(e=kt){qe.fromWorkingColorSpace(Mt.copy(this),e);const t=Mt.r,i=Mt.g,s=Mt.b;return e!==kt?`color(${e} ${t.toFixed(3)} ${i.toFixed(3)} ${s.toFixed(3)})`:`rgb(${Math.round(t*255)},${Math.round(i*255)},${Math.round(s*255)})`}offsetHSL(e,t,i){return this.getHSL(Un),this.setHSL(Un.h+e,Un.s+t,Un.l+i)}add(e){return this.r+=e.r,this.g+=e.g,this.b+=e.b,this}addColors(e,t){return this.r=e.r+t.r,this.g=e.g+t.g,this.b=e.b+t.b,this}addScalar(e){return this.r+=e,this.g+=e,this.b+=e,this}sub(e){return this.r=Math.max(0,this.r-e.r),this.g=Math.max(0,this.g-e.g),this.b=Math.max(0,this.b-e.b),this}multiply(e){return this.r*=e.r,this.g*=e.g,this.b*=e.b,this}multiplyScalar(e){return this.r*=e,this.g*=e,this.b*=e,this}lerp(e,t){return this.r+=(e.r-this.r)*t,this.g+=(e.g-this.g)*t,this.b+=(e.b-this.b)*t,this}lerpColors(e,t,i){return this.r=e.r+(t.r-e.r)*i,this.g=e.g+(t.g-e.g)*i,this.b=e.b+(t.b-e.b)*i,this}lerpHSL(e,t){this.getHSL(Un),e.getHSL(Us);const i=Ar(Un.h,Us.h,t),s=Ar(Un.s,Us.s,t),r=Ar(Un.l,Us.l,t);return this.setHSL(i,s,r),this}setFromVector3(e){return this.r=e.x,this.g=e.y,this.b=e.z,this}applyMatrix3(e){const t=this.r,i=this.g,s=this.b,r=e.elements;return this.r=r[0]*t+r[3]*i+r[6]*s,this.g=r[1]*t+r[4]*i+r[7]*s,this.b=r[2]*t+r[5]*i+r[8]*s,this}equals(e){return e.r===this.r&&e.g===this.g&&e.b===this.b}fromArray(e,t=0){return this.r=e[t],this.g=e[t+1],this.b=e[t+2],this}toArray(e=[],t=0){return e[t]=this.r,e[t+1]=this.g,e[t+2]=this.b,e}fromBufferAttribute(e,t){return this.r=e.getX(t),this.g=e.getY(t),this.b=e.getZ(t),this}toJSON(){return this.getHex()}*[Symbol.iterator](){yield this.r,yield this.g,yield this.b}}const Mt=new je;je.NAMES=tc;let th=0;class ys extends Yi{static get type(){return"Material"}get type(){return this.constructor.type}set type(e){}constructor(){super(),this.isMaterial=!0,Object.defineProperty(this,"id",{value:th++}),this.uuid=Ms(),this.name="",this.blending=Di,this.side=Xn,this.vertexColors=!1,this.opacity=1,this.transparent=!1,this.alphaHash=!1,this.blendSrc=oa,this.blendDst=ui,this.blendEquation=ni,this.blendSrcAlpha=null,this.blendDstAlpha=null,this.blendEquationAlpha=null,this.blendColor=new je(0,0,0),this.blendAlpha=0,this.depthFunc=Fi,this.depthTest=!0,this.depthWrite=!0,this.stencilWriteMask=255,this.stencilFunc=Ao,this.stencilRef=0,this.stencilFuncMask=255,this.stencilFail=di,this.stencilZFail=di,this.stencilZPass=di,this.stencilWrite=!1,this.clippingPlanes=null,this.clipIntersection=!1,this.clipShadows=!1,this.shadowSide=null,this.colorWrite=!0,this.precision=null,this.polygonOffset=!1,this.polygonOffsetFactor=0,this.polygonOffsetUnits=0,this.dithering=!1,this.alphaToCoverage=!1,this.premultipliedAlpha=!1,this.forceSinglePass=!1,this.visible=!0,this.toneMapped=!0,this.userData={},this.version=0,this._alphaTest=0}get alphaTest(){return this._alphaTest}set alphaTest(e){this._alphaTest>0!=e>0&&this.version++,this._alphaTest=e}onBeforeRender(){}onBeforeCompile(){}customProgramCacheKey(){return this.onBeforeCompile.toString()}setValues(e){if(e!==void 0)for(const t in e){const i=e[t];if(i===void 0){console.warn(`THREE.Material: parameter '${t}' has value of undefined.`);continue}const s=this[t];if(s===void 0){console.warn(`THREE.Material: '${t}' is not a property of THREE.${this.type}.`);continue}s&&s.isColor?s.set(i):s&&s.isVector3&&i&&i.isVector3?s.copy(i):this[t]=i}}toJSON(e){const t=e===void 0||typeof e=="string";t&&(e={textures:{},images:{}});const i={metadata:{version:4.6,type:"Material",generator:"Material.toJSON"}};i.uuid=this.uuid,i.type=this.type,this.name!==""&&(i.name=this.name),this.color&&this.color.isColor&&(i.color=this.color.getHex()),this.roughness!==void 0&&(i.roughness=this.roughness),this.metalness!==void 0&&(i.metalness=this.metalness),this.sheen!==void 0&&(i.sheen=this.sheen),this.sheenColor&&this.sheenColor.isColor&&(i.sheenColor=this.sheenColor.getHex()),this.sheenRoughness!==void 0&&(i.sheenRoughness=this.sheenRoughness),this.emissive&&this.emissive.isColor&&(i.emissive=this.emissive.getHex()),this.emissiveIntensity!==void 0&&this.emissiveIntensity!==1&&(i.emissiveIntensity=this.emissiveIntensity),this.specular&&this.specular.isColor&&(i.specular=this.specular.getHex()),this.specularIntensity!==void 0&&(i.specularIntensity=this.specularIntensity),this.specularColor&&this.specularColor.isColor&&(i.specularColor=this.specularColor.getHex()),this.shininess!==void 0&&(i.shininess=this.shininess),this.clearcoat!==void 0&&(i.clearcoat=this.clearcoat),this.clearcoatRoughness!==void 0&&(i.clearcoatRoughness=this.clearcoatRoughness),this.clearcoatMap&&this.clearcoatMap.isTexture&&(i.clearcoatMap=this.clearcoatMap.toJSON(e).uuid),this.clearcoatRoughnessMap&&this.clearcoatRoughnessMap.isTexture&&(i.clearcoatRoughnessMap=this.clearcoatRoughnessMap.toJSON(e).uuid),this.clearcoatNormalMap&&this.clearcoatNormalMap.isTexture&&(i.clearcoatNormalMap=this.clearcoatNormalMap.toJSON(e).uuid,i.clearcoatNormalScale=this.clearcoatNormalScale.toArray()),this.dispersion!==void 0&&(i.dispersion=this.dispersion),this.iridescence!==void 0&&(i.iridescence=this.iridescence),this.iridescenceIOR!==void 0&&(i.iridescenceIOR=this.iridescenceIOR),this.iridescenceThicknessRange!==void 0&&(i.iridescenceThicknessRange=this.iridescenceThicknessRange),this.iridescenceMap&&this.iridescenceMap.isTexture&&(i.iridescenceMap=this.iridescenceMap.toJSON(e).uuid),this.iridescenceThicknessMap&&this.iridescenceThicknessMap.isTexture&&(i.iridescenceThicknessMap=this.iridescenceThicknessMap.toJSON(e).uuid),this.anisotropy!==void 0&&(i.anisotropy=this.anisotropy),this.anisotropyRotation!==void 0&&(i.anisotropyRotation=this.anisotropyRotation),this.anisotropyMap&&this.anisotropyMap.isTexture&&(i.anisotropyMap=this.anisotropyMap.toJSON(e).uuid),this.map&&this.map.isTexture&&(i.map=this.map.toJSON(e).uuid),this.matcap&&this.matcap.isTexture&&(i.matcap=this.matcap.toJSON(e).uuid),this.alphaMap&&this.alphaMap.isTexture&&(i.alphaMap=this.alphaMap.toJSON(e).uuid),this.lightMap&&this.lightMap.isTexture&&(i.lightMap=this.lightMap.toJSON(e).uuid,i.lightMapIntensity=this.lightMapIntensity),this.aoMap&&this.aoMap.isTexture&&(i.aoMap=this.aoMap.toJSON(e).uuid,i.aoMapIntensity=this.aoMapIntensity),this.bumpMap&&this.bumpMap.isTexture&&(i.bumpMap=this.bumpMap.toJSON(e).uuid,i.bumpScale=this.bumpScale),this.normalMap&&this.normalMap.isTexture&&(i.normalMap=this.normalMap.toJSON(e).uuid,i.normalMapType=this.normalMapType,i.normalScale=this.normalScale.toArray()),this.displacementMap&&this.displacementMap.isTexture&&(i.displacementMap=this.displacementMap.toJSON(e).uuid,i.displacementScale=this.displacementScale,i.displacementBias=this.displacementBias),this.roughnessMap&&this.roughnessMap.isTexture&&(i.roughnessMap=this.roughnessMap.toJSON(e).uuid),this.metalnessMap&&this.metalnessMap.isTexture&&(i.metalnessMap=this.metalnessMap.toJSON(e).uuid),this.emissiveMap&&this.emissiveMap.isTexture&&(i.emissiveMap=this.emissiveMap.toJSON(e).uuid),this.specularMap&&this.specularMap.isTexture&&(i.specularMap=this.specularMap.toJSON(e).uuid),this.specularIntensityMap&&this.specularIntensityMap.isTexture&&(i.specularIntensityMap=this.specularIntensityMap.toJSON(e).uuid),this.specularColorMap&&this.specularColorMap.isTexture&&(i.specularColorMap=this.specularColorMap.toJSON(e).uuid),this.envMap&&this.envMap.isTexture&&(i.envMap=this.envMap.toJSON(e).uuid,this.combine!==void 0&&(i.combine=this.combine)),this.envMapRotation!==void 0&&(i.envMapRotation=this.envMapRotation.toArray()),this.envMapIntensity!==void 0&&(i.envMapIntensity=this.envMapIntensity),this.reflectivity!==void 0&&(i.reflectivity=this.reflectivity),this.refractionRatio!==void 0&&(i.refractionRatio=this.refractionRatio),this.gradientMap&&this.gradientMap.isTexture&&(i.gradientMap=this.gradientMap.toJSON(e).uuid),this.transmission!==void 0&&(i.transmission=this.transmission),this.transmissionMap&&this.transmissionMap.isTexture&&(i.transmissionMap=this.transmissionMap.toJSON(e).uuid),this.thickness!==void 0&&(i.thickness=this.thickness),this.thicknessMap&&this.thicknessMap.isTexture&&(i.thicknessMap=this.thicknessMap.toJSON(e).uuid),this.attenuationDistance!==void 0&&this.attenuationDistance!==1/0&&(i.attenuationDistance=this.attenuationDistance),this.attenuationColor!==void 0&&(i.attenuationColor=this.attenuationColor.getHex()),this.size!==void 0&&(i.size=this.size),this.shadowSide!==null&&(i.shadowSide=this.shadowSide),this.sizeAttenuation!==void 0&&(i.sizeAttenuation=this.sizeAttenuation),this.blending!==Di&&(i.blending=this.blending),this.side!==Xn&&(i.side=this.side),this.vertexColors===!0&&(i.vertexColors=!0),this.opacity<1&&(i.opacity=this.opacity),this.transparent===!0&&(i.transparent=!0),this.blendSrc!==oa&&(i.blendSrc=this.blendSrc),this.blendDst!==ui&&(i.blendDst=this.blendDst),this.blendEquation!==ni&&(i.blendEquation=this.blendEquation),this.blendSrcAlpha!==null&&(i.blendSrcAlpha=this.blendSrcAlpha),this.blendDstAlpha!==null&&(i.blendDstAlpha=this.blendDstAlpha),this.blendEquationAlpha!==null&&(i.blendEquationAlpha=this.blendEquationAlpha),this.blendColor&&this.blendColor.isColor&&(i.blendColor=this.blendColor.getHex()),this.blendAlpha!==0&&(i.blendAlpha=this.blendAlpha),this.depthFunc!==Fi&&(i.depthFunc=this.depthFunc),this.depthTest===!1&&(i.depthTest=this.depthTest),this.depthWrite===!1&&(i.depthWrite=this.depthWrite),this.colorWrite===!1&&(i.colorWrite=this.colorWrite),this.stencilWriteMask!==255&&(i.stencilWriteMask=this.stencilWriteMask),this.stencilFunc!==Ao&&(i.stencilFunc=this.stencilFunc),this.stencilRef!==0&&(i.stencilRef=this.stencilRef),this.stencilFuncMask!==255&&(i.stencilFuncMask=this.stencilFuncMask),this.stencilFail!==di&&(i.stencilFail=this.stencilFail),this.stencilZFail!==di&&(i.stencilZFail=this.stencilZFail),this.stencilZPass!==di&&(i.stencilZPass=this.stencilZPass),this.stencilWrite===!0&&(i.stencilWrite=this.stencilWrite),this.rotation!==void 0&&this.rotation!==0&&(i.rotation=this.rotation),this.polygonOffset===!0&&(i.polygonOffset=!0),this.polygonOffsetFactor!==0&&(i.polygonOffsetFactor=this.polygonOffsetFactor),this.polygonOffsetUnits!==0&&(i.polygonOffsetUnits=this.polygonOffsetUnits),this.linewidth!==void 0&&this.linewidth!==1&&(i.linewidth=this.linewidth),this.dashSize!==void 0&&(i.dashSize=this.dashSize),this.gapSize!==void 0&&(i.gapSize=this.gapSize),this.scale!==void 0&&(i.scale=this.scale),this.dithering===!0&&(i.dithering=!0),this.alphaTest>0&&(i.alphaTest=this.alphaTest),this.alphaHash===!0&&(i.alphaHash=!0),this.alphaToCoverage===!0&&(i.alphaToCoverage=!0),this.premultipliedAlpha===!0&&(i.premultipliedAlpha=!0),this.forceSinglePass===!0&&(i.forceSinglePass=!0),this.wireframe===!0&&(i.wireframe=!0),this.wireframeLinewidth>1&&(i.wireframeLinewidth=this.wireframeLinewidth),this.wireframeLinecap!=="round"&&(i.wireframeLinecap=this.wireframeLinecap),this.wireframeLinejoin!=="round"&&(i.wireframeLinejoin=this.wireframeLinejoin),this.flatShading===!0&&(i.flatShading=!0),this.visible===!1&&(i.visible=!1),this.toneMapped===!1&&(i.toneMapped=!1),this.fog===!1&&(i.fog=!1),Object.keys(this.userData).length>0&&(i.userData=this.userData);function s(r){const a=[];for(const o in r){const l=r[o];delete l.metadata,a.push(l)}return a}if(t){const r=s(e.textures),a=s(e.images);r.length>0&&(i.textures=r),a.length>0&&(i.images=a)}return i}clone(){return new this.constructor().copy(this)}copy(e){this.name=e.name,this.blending=e.blending,this.side=e.side,this.vertexColors=e.vertexColors,this.opacity=e.opacity,this.transparent=e.transparent,this.blendSrc=e.blendSrc,this.blendDst=e.blendDst,this.blendEquation=e.blendEquation,this.blendSrcAlpha=e.blendSrcAlpha,this.blendDstAlpha=e.blendDstAlpha,this.blendEquationAlpha=e.blendEquationAlpha,this.blendColor.copy(e.blendColor),this.blendAlpha=e.blendAlpha,this.depthFunc=e.depthFunc,this.depthTest=e.depthTest,this.depthWrite=e.depthWrite,this.stencilWriteMask=e.stencilWriteMask,this.stencilFunc=e.stencilFunc,this.stencilRef=e.stencilRef,this.stencilFuncMask=e.stencilFuncMask,this.stencilFail=e.stencilFail,this.stencilZFail=e.stencilZFail,this.stencilZPass=e.stencilZPass,this.stencilWrite=e.stencilWrite;const t=e.clippingPlanes;let i=null;if(t!==null){const s=t.length;i=new Array(s);for(let r=0;r!==s;++r)i[r]=t[r].clone()}return this.clippingPlanes=i,this.clipIntersection=e.clipIntersection,this.clipShadows=e.clipShadows,this.shadowSide=e.shadowSide,this.colorWrite=e.colorWrite,this.precision=e.precision,this.polygonOffset=e.polygonOffset,this.polygonOffsetFactor=e.polygonOffsetFactor,this.polygonOffsetUnits=e.polygonOffsetUnits,this.dithering=e.dithering,this.alphaTest=e.alphaTest,this.alphaHash=e.alphaHash,this.alphaToCoverage=e.alphaToCoverage,this.premultipliedAlpha=e.premultipliedAlpha,this.forceSinglePass=e.forceSinglePass,this.visible=e.visible,this.toneMapped=e.toneMapped,this.userData=JSON.parse(JSON.stringify(e.userData)),this}dispose(){this.dispatchEvent({type:"dispose"})}set needsUpdate(e){e===!0&&this.version++}onBuild(){console.warn("Material: onBuild() has been removed.")}}class nc extends ys{static get type(){return"MeshBasicMaterial"}constructor(e){super(),this.isMeshBasicMaterial=!0,this.color=new je(16777215),this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.specularMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new An,this.combine=Ol,this.reflectivity=1,this.refractionRatio=.98,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.lightMap=e.lightMap,this.lightMapIntensity=e.lightMapIntensity,this.aoMap=e.aoMap,this.aoMapIntensity=e.aoMapIntensity,this.specularMap=e.specularMap,this.alphaMap=e.alphaMap,this.envMap=e.envMap,this.envMapRotation.copy(e.envMapRotation),this.combine=e.combine,this.reflectivity=e.reflectivity,this.refractionRatio=e.refractionRatio,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.wireframeLinecap=e.wireframeLinecap,this.wireframeLinejoin=e.wireframeLinejoin,this.fog=e.fog,this}}const ct=new N,Ns=new Ve;class ut{constructor(e,t,i=!1){if(Array.isArray(e))throw new TypeError("THREE.BufferAttribute: array should be a Typed Array.");this.isBufferAttribute=!0,this.name="",this.array=e,this.itemSize=t,this.count=e!==void 0?e.length/t:0,this.normalized=i,this.usage=bo,this.updateRanges=[],this.gpuType=un,this.version=0}onUploadCallback(){}set needsUpdate(e){e===!0&&this.version++}setUsage(e){return this.usage=e,this}addUpdateRange(e,t){this.updateRanges.push({start:e,count:t})}clearUpdateRanges(){this.updateRanges.length=0}copy(e){return this.name=e.name,this.array=new e.array.constructor(e.array),this.itemSize=e.itemSize,this.count=e.count,this.normalized=e.normalized,this.usage=e.usage,this.gpuType=e.gpuType,this}copyAt(e,t,i){e*=this.itemSize,i*=t.itemSize;for(let s=0,r=this.itemSize;s<r;s++)this.array[e+s]=t.array[i+s];return this}copyArray(e){return this.array.set(e),this}applyMatrix3(e){if(this.itemSize===2)for(let t=0,i=this.count;t<i;t++)Ns.fromBufferAttribute(this,t),Ns.applyMatrix3(e),this.setXY(t,Ns.x,Ns.y);else if(this.itemSize===3)for(let t=0,i=this.count;t<i;t++)ct.fromBufferAttribute(this,t),ct.applyMatrix3(e),this.setXYZ(t,ct.x,ct.y,ct.z);return this}applyMatrix4(e){for(let t=0,i=this.count;t<i;t++)ct.fromBufferAttribute(this,t),ct.applyMatrix4(e),this.setXYZ(t,ct.x,ct.y,ct.z);return this}applyNormalMatrix(e){for(let t=0,i=this.count;t<i;t++)ct.fromBufferAttribute(this,t),ct.applyNormalMatrix(e),this.setXYZ(t,ct.x,ct.y,ct.z);return this}transformDirection(e){for(let t=0,i=this.count;t<i;t++)ct.fromBufferAttribute(this,t),ct.transformDirection(e),this.setXYZ(t,ct.x,ct.y,ct.z);return this}set(e,t=0){return this.array.set(e,t),this}getComponent(e,t){let i=this.array[e*this.itemSize+t];return this.normalized&&(i=Qi(i,this.array)),i}setComponent(e,t,i){return this.normalized&&(i=At(i,this.array)),this.array[e*this.itemSize+t]=i,this}getX(e){let t=this.array[e*this.itemSize];return this.normalized&&(t=Qi(t,this.array)),t}setX(e,t){return this.normalized&&(t=At(t,this.array)),this.array[e*this.itemSize]=t,this}getY(e){let t=this.array[e*this.itemSize+1];return this.normalized&&(t=Qi(t,this.array)),t}setY(e,t){return this.normalized&&(t=At(t,this.array)),this.array[e*this.itemSize+1]=t,this}getZ(e){let t=this.array[e*this.itemSize+2];return this.normalized&&(t=Qi(t,this.array)),t}setZ(e,t){return this.normalized&&(t=At(t,this.array)),this.array[e*this.itemSize+2]=t,this}getW(e){let t=this.array[e*this.itemSize+3];return this.normalized&&(t=Qi(t,this.array)),t}setW(e,t){return this.normalized&&(t=At(t,this.array)),this.array[e*this.itemSize+3]=t,this}setXY(e,t,i){return e*=this.itemSize,this.normalized&&(t=At(t,this.array),i=At(i,this.array)),this.array[e+0]=t,this.array[e+1]=i,this}setXYZ(e,t,i,s){return e*=this.itemSize,this.normalized&&(t=At(t,this.array),i=At(i,this.array),s=At(s,this.array)),this.array[e+0]=t,this.array[e+1]=i,this.array[e+2]=s,this}setXYZW(e,t,i,s,r){return e*=this.itemSize,this.normalized&&(t=At(t,this.array),i=At(i,this.array),s=At(s,this.array),r=At(r,this.array)),this.array[e+0]=t,this.array[e+1]=i,this.array[e+2]=s,this.array[e+3]=r,this}onUpload(e){return this.onUploadCallback=e,this}clone(){return new this.constructor(this.array,this.itemSize).copy(this)}toJSON(){const e={itemSize:this.itemSize,type:this.array.constructor.name,array:Array.from(this.array),normalized:this.normalized};return this.name!==""&&(e.name=this.name),this.usage!==bo&&(e.usage=this.usage),e}}class ic extends ut{constructor(e,t,i){super(new Uint16Array(e),t,i)}}class sc extends ut{constructor(e,t,i){super(new Uint32Array(e),t,i)}}class li extends ut{constructor(e,t,i){super(new Float32Array(e),t,i)}}let nh=0;const zt=new rt,Vr=new Ct,Ei=new N,It=new Ss,is=new Ss,mt=new N;class rn extends Yi{constructor(){super(),this.isBufferGeometry=!0,Object.defineProperty(this,"id",{value:nh++}),this.uuid=Ms(),this.name="",this.type="BufferGeometry",this.index=null,this.indirect=null,this.attributes={},this.morphAttributes={},this.morphTargetsRelative=!1,this.groups=[],this.boundingBox=null,this.boundingSphere=null,this.drawRange={start:0,count:1/0},this.userData={}}getIndex(){return this.index}setIndex(e){return Array.isArray(e)?this.index=new(Zl(e)?sc:ic)(e,1):this.index=e,this}setIndirect(e){return this.indirect=e,this}getIndirect(){return this.indirect}getAttribute(e){return this.attributes[e]}setAttribute(e,t){return this.attributes[e]=t,this}deleteAttribute(e){return delete this.attributes[e],this}hasAttribute(e){return this.attributes[e]!==void 0}addGroup(e,t,i=0){this.groups.push({start:e,count:t,materialIndex:i})}clearGroups(){this.groups=[]}setDrawRange(e,t){this.drawRange.start=e,this.drawRange.count=t}applyMatrix4(e){const t=this.attributes.position;t!==void 0&&(t.applyMatrix4(e),t.needsUpdate=!0);const i=this.attributes.normal;if(i!==void 0){const r=new Ne().getNormalMatrix(e);i.applyNormalMatrix(r),i.needsUpdate=!0}const s=this.attributes.tangent;return s!==void 0&&(s.transformDirection(e),s.needsUpdate=!0),this.boundingBox!==null&&this.computeBoundingBox(),this.boundingSphere!==null&&this.computeBoundingSphere(),this}applyQuaternion(e){return zt.makeRotationFromQuaternion(e),this.applyMatrix4(zt),this}rotateX(e){return zt.makeRotationX(e),this.applyMatrix4(zt),this}rotateY(e){return zt.makeRotationY(e),this.applyMatrix4(zt),this}rotateZ(e){return zt.makeRotationZ(e),this.applyMatrix4(zt),this}translate(e,t,i){return zt.makeTranslation(e,t,i),this.applyMatrix4(zt),this}scale(e,t,i){return zt.makeScale(e,t,i),this.applyMatrix4(zt),this}lookAt(e){return Vr.lookAt(e),Vr.updateMatrix(),this.applyMatrix4(Vr.matrix),this}center(){return this.computeBoundingBox(),this.boundingBox.getCenter(Ei).negate(),this.translate(Ei.x,Ei.y,Ei.z),this}setFromPoints(e){const t=this.getAttribute("position");if(t===void 0){const i=[];for(let s=0,r=e.length;s<r;s++){const a=e[s];i.push(a.x,a.y,a.z||0)}this.setAttribute("position",new li(i,3))}else{for(let i=0,s=t.count;i<s;i++){const r=e[i];t.setXYZ(i,r.x,r.y,r.z||0)}e.length>t.count&&console.warn("THREE.BufferGeometry: Buffer size too small for points data. Use .dispose() and create a new geometry."),t.needsUpdate=!0}return this}computeBoundingBox(){this.boundingBox===null&&(this.boundingBox=new Ss);const e=this.attributes.position,t=this.morphAttributes.position;if(e&&e.isGLBufferAttribute){console.error("THREE.BufferGeometry.computeBoundingBox(): GLBufferAttribute requires a manual bounding box.",this),this.boundingBox.set(new N(-1/0,-1/0,-1/0),new N(1/0,1/0,1/0));return}if(e!==void 0){if(this.boundingBox.setFromBufferAttribute(e),t)for(let i=0,s=t.length;i<s;i++){const r=t[i];It.setFromBufferAttribute(r),this.morphTargetsRelative?(mt.addVectors(this.boundingBox.min,It.min),this.boundingBox.expandByPoint(mt),mt.addVectors(this.boundingBox.max,It.max),this.boundingBox.expandByPoint(mt)):(this.boundingBox.expandByPoint(It.min),this.boundingBox.expandByPoint(It.max))}}else this.boundingBox.makeEmpty();(isNaN(this.boundingBox.min.x)||isNaN(this.boundingBox.min.y)||isNaN(this.boundingBox.min.z))&&console.error('THREE.BufferGeometry.computeBoundingBox(): Computed min/max have NaN values. The "position" attribute is likely to have NaN values.',this)}computeBoundingSphere(){this.boundingSphere===null&&(this.boundingSphere=new _r);const e=this.attributes.position,t=this.morphAttributes.position;if(e&&e.isGLBufferAttribute){console.error("THREE.BufferGeometry.computeBoundingSphere(): GLBufferAttribute requires a manual bounding sphere.",this),this.boundingSphere.set(new N,1/0);return}if(e){const i=this.boundingSphere.center;if(It.setFromBufferAttribute(e),t)for(let r=0,a=t.length;r<a;r++){const o=t[r];is.setFromBufferAttribute(o),this.morphTargetsRelative?(mt.addVectors(It.min,is.min),It.expandByPoint(mt),mt.addVectors(It.max,is.max),It.expandByPoint(mt)):(It.expandByPoint(is.min),It.expandByPoint(is.max))}It.getCenter(i);let s=0;for(let r=0,a=e.count;r<a;r++)mt.fromBufferAttribute(e,r),s=Math.max(s,i.distanceToSquared(mt));if(t)for(let r=0,a=t.length;r<a;r++){const o=t[r],l=this.morphTargetsRelative;for(let c=0,u=o.count;c<u;c++)mt.fromBufferAttribute(o,c),l&&(Ei.fromBufferAttribute(e,c),mt.add(Ei)),s=Math.max(s,i.distanceToSquared(mt))}this.boundingSphere.radius=Math.sqrt(s),isNaN(this.boundingSphere.radius)&&console.error('THREE.BufferGeometry.computeBoundingSphere(): Computed radius is NaN. The "position" attribute is likely to have NaN values.',this)}}computeTangents(){const e=this.index,t=this.attributes;if(e===null||t.position===void 0||t.normal===void 0||t.uv===void 0){console.error("THREE.BufferGeometry: .computeTangents() failed. Missing required attributes (index, position, normal or uv)");return}const i=t.position,s=t.normal,r=t.uv;this.hasAttribute("tangent")===!1&&this.setAttribute("tangent",new ut(new Float32Array(4*i.count),4));const a=this.getAttribute("tangent"),o=[],l=[];for(let D=0;D<i.count;D++)o[D]=new N,l[D]=new N;const c=new N,u=new N,f=new N,d=new Ve,m=new Ve,_=new Ve,v=new N,p=new N;function h(D,E,M){c.fromBufferAttribute(i,D),u.fromBufferAttribute(i,E),f.fromBufferAttribute(i,M),d.fromBufferAttribute(r,D),m.fromBufferAttribute(r,E),_.fromBufferAttribute(r,M),u.sub(c),f.sub(c),m.sub(d),_.sub(d);const C=1/(m.x*_.y-_.x*m.y);isFinite(C)&&(v.copy(u).multiplyScalar(_.y).addScaledVector(f,-m.y).multiplyScalar(C),p.copy(f).multiplyScalar(m.x).addScaledVector(u,-_.x).multiplyScalar(C),o[D].add(v),o[E].add(v),o[M].add(v),l[D].add(p),l[E].add(p),l[M].add(p))}let A=this.groups;A.length===0&&(A=[{start:0,count:e.count}]);for(let D=0,E=A.length;D<E;++D){const M=A[D],C=M.start,H=M.count;for(let F=C,W=C+H;F<W;F+=3)h(e.getX(F+0),e.getX(F+1),e.getX(F+2))}const S=new N,g=new N,P=new N,b=new N;function w(D){P.fromBufferAttribute(s,D),b.copy(P);const E=o[D];S.copy(E),S.sub(P.multiplyScalar(P.dot(E))).normalize(),g.crossVectors(b,E);const C=g.dot(l[D])<0?-1:1;a.setXYZW(D,S.x,S.y,S.z,C)}for(let D=0,E=A.length;D<E;++D){const M=A[D],C=M.start,H=M.count;for(let F=C,W=C+H;F<W;F+=3)w(e.getX(F+0)),w(e.getX(F+1)),w(e.getX(F+2))}}computeVertexNormals(){const e=this.index,t=this.getAttribute("position");if(t!==void 0){let i=this.getAttribute("normal");if(i===void 0)i=new ut(new Float32Array(t.count*3),3),this.setAttribute("normal",i);else for(let d=0,m=i.count;d<m;d++)i.setXYZ(d,0,0,0);const s=new N,r=new N,a=new N,o=new N,l=new N,c=new N,u=new N,f=new N;if(e)for(let d=0,m=e.count;d<m;d+=3){const _=e.getX(d+0),v=e.getX(d+1),p=e.getX(d+2);s.fromBufferAttribute(t,_),r.fromBufferAttribute(t,v),a.fromBufferAttribute(t,p),u.subVectors(a,r),f.subVectors(s,r),u.cross(f),o.fromBufferAttribute(i,_),l.fromBufferAttribute(i,v),c.fromBufferAttribute(i,p),o.add(u),l.add(u),c.add(u),i.setXYZ(_,o.x,o.y,o.z),i.setXYZ(v,l.x,l.y,l.z),i.setXYZ(p,c.x,c.y,c.z)}else for(let d=0,m=t.count;d<m;d+=3)s.fromBufferAttribute(t,d+0),r.fromBufferAttribute(t,d+1),a.fromBufferAttribute(t,d+2),u.subVectors(a,r),f.subVectors(s,r),u.cross(f),i.setXYZ(d+0,u.x,u.y,u.z),i.setXYZ(d+1,u.x,u.y,u.z),i.setXYZ(d+2,u.x,u.y,u.z);this.normalizeNormals(),i.needsUpdate=!0}}normalizeNormals(){const e=this.attributes.normal;for(let t=0,i=e.count;t<i;t++)mt.fromBufferAttribute(e,t),mt.normalize(),e.setXYZ(t,mt.x,mt.y,mt.z)}toNonIndexed(){function e(o,l){const c=o.array,u=o.itemSize,f=o.normalized,d=new c.constructor(l.length*u);let m=0,_=0;for(let v=0,p=l.length;v<p;v++){o.isInterleavedBufferAttribute?m=l[v]*o.data.stride+o.offset:m=l[v]*u;for(let h=0;h<u;h++)d[_++]=c[m++]}return new ut(d,u,f)}if(this.index===null)return console.warn("THREE.BufferGeometry.toNonIndexed(): BufferGeometry is already non-indexed."),this;const t=new rn,i=this.index.array,s=this.attributes;for(const o in s){const l=s[o],c=e(l,i);t.setAttribute(o,c)}const r=this.morphAttributes;for(const o in r){const l=[],c=r[o];for(let u=0,f=c.length;u<f;u++){const d=c[u],m=e(d,i);l.push(m)}t.morphAttributes[o]=l}t.morphTargetsRelative=this.morphTargetsRelative;const a=this.groups;for(let o=0,l=a.length;o<l;o++){const c=a[o];t.addGroup(c.start,c.count,c.materialIndex)}return t}toJSON(){const e={metadata:{version:4.6,type:"BufferGeometry",generator:"BufferGeometry.toJSON"}};if(e.uuid=this.uuid,e.type=this.type,this.name!==""&&(e.name=this.name),Object.keys(this.userData).length>0&&(e.userData=this.userData),this.parameters!==void 0){const l=this.parameters;for(const c in l)l[c]!==void 0&&(e[c]=l[c]);return e}e.data={attributes:{}};const t=this.index;t!==null&&(e.data.index={type:t.array.constructor.name,array:Array.prototype.slice.call(t.array)});const i=this.attributes;for(const l in i){const c=i[l];e.data.attributes[l]=c.toJSON(e.data)}const s={};let r=!1;for(const l in this.morphAttributes){const c=this.morphAttributes[l],u=[];for(let f=0,d=c.length;f<d;f++){const m=c[f];u.push(m.toJSON(e.data))}u.length>0&&(s[l]=u,r=!0)}r&&(e.data.morphAttributes=s,e.data.morphTargetsRelative=this.morphTargetsRelative);const a=this.groups;a.length>0&&(e.data.groups=JSON.parse(JSON.stringify(a)));const o=this.boundingSphere;return o!==null&&(e.data.boundingSphere={center:o.center.toArray(),radius:o.radius}),e}clone(){return new this.constructor().copy(this)}copy(e){this.index=null,this.attributes={},this.morphAttributes={},this.groups=[],this.boundingBox=null,this.boundingSphere=null;const t={};this.name=e.name;const i=e.index;i!==null&&this.setIndex(i.clone(t));const s=e.attributes;for(const c in s){const u=s[c];this.setAttribute(c,u.clone(t))}const r=e.morphAttributes;for(const c in r){const u=[],f=r[c];for(let d=0,m=f.length;d<m;d++)u.push(f[d].clone(t));this.morphAttributes[c]=u}this.morphTargetsRelative=e.morphTargetsRelative;const a=e.groups;for(let c=0,u=a.length;c<u;c++){const f=a[c];this.addGroup(f.start,f.count,f.materialIndex)}const o=e.boundingBox;o!==null&&(this.boundingBox=o.clone());const l=e.boundingSphere;return l!==null&&(this.boundingSphere=l.clone()),this.drawRange.start=e.drawRange.start,this.drawRange.count=e.drawRange.count,this.userData=e.userData,this}dispose(){this.dispatchEvent({type:"dispose"})}}const Ho=new rt,Zn=new Ql,Fs=new _r,Vo=new N,Os=new N,Bs=new N,zs=new N,Wr=new N,ks=new N,Wo=new N,Gs=new N;class Vt extends Ct{constructor(e=new rn,t=new nc){super(),this.isMesh=!0,this.type="Mesh",this.geometry=e,this.material=t,this.updateMorphTargets()}copy(e,t){return super.copy(e,t),e.morphTargetInfluences!==void 0&&(this.morphTargetInfluences=e.morphTargetInfluences.slice()),e.morphTargetDictionary!==void 0&&(this.morphTargetDictionary=Object.assign({},e.morphTargetDictionary)),this.material=Array.isArray(e.material)?e.material.slice():e.material,this.geometry=e.geometry,this}updateMorphTargets(){const t=this.geometry.morphAttributes,i=Object.keys(t);if(i.length>0){const s=t[i[0]];if(s!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let r=0,a=s.length;r<a;r++){const o=s[r].name||String(r);this.morphTargetInfluences.push(0),this.morphTargetDictionary[o]=r}}}}getVertexPosition(e,t){const i=this.geometry,s=i.attributes.position,r=i.morphAttributes.position,a=i.morphTargetsRelative;t.fromBufferAttribute(s,e);const o=this.morphTargetInfluences;if(r&&o){ks.set(0,0,0);for(let l=0,c=r.length;l<c;l++){const u=o[l],f=r[l];u!==0&&(Wr.fromBufferAttribute(f,e),a?ks.addScaledVector(Wr,u):ks.addScaledVector(Wr.sub(t),u))}t.add(ks)}return t}raycast(e,t){const i=this.geometry,s=this.material,r=this.matrixWorld;s!==void 0&&(i.boundingSphere===null&&i.computeBoundingSphere(),Fs.copy(i.boundingSphere),Fs.applyMatrix4(r),Zn.copy(e.ray).recast(e.near),!(Fs.containsPoint(Zn.origin)===!1&&(Zn.intersectSphere(Fs,Vo)===null||Zn.origin.distanceToSquared(Vo)>(e.far-e.near)**2))&&(Ho.copy(r).invert(),Zn.copy(e.ray).applyMatrix4(Ho),!(i.boundingBox!==null&&Zn.intersectsBox(i.boundingBox)===!1)&&this._computeIntersections(e,t,Zn)))}_computeIntersections(e,t,i){let s;const r=this.geometry,a=this.material,o=r.index,l=r.attributes.position,c=r.attributes.uv,u=r.attributes.uv1,f=r.attributes.normal,d=r.groups,m=r.drawRange;if(o!==null)if(Array.isArray(a))for(let _=0,v=d.length;_<v;_++){const p=d[_],h=a[p.materialIndex],A=Math.max(p.start,m.start),S=Math.min(o.count,Math.min(p.start+p.count,m.start+m.count));for(let g=A,P=S;g<P;g+=3){const b=o.getX(g),w=o.getX(g+1),D=o.getX(g+2);s=Hs(this,h,e,i,c,u,f,b,w,D),s&&(s.faceIndex=Math.floor(g/3),s.face.materialIndex=p.materialIndex,t.push(s))}}else{const _=Math.max(0,m.start),v=Math.min(o.count,m.start+m.count);for(let p=_,h=v;p<h;p+=3){const A=o.getX(p),S=o.getX(p+1),g=o.getX(p+2);s=Hs(this,a,e,i,c,u,f,A,S,g),s&&(s.faceIndex=Math.floor(p/3),t.push(s))}}else if(l!==void 0)if(Array.isArray(a))for(let _=0,v=d.length;_<v;_++){const p=d[_],h=a[p.materialIndex],A=Math.max(p.start,m.start),S=Math.min(l.count,Math.min(p.start+p.count,m.start+m.count));for(let g=A,P=S;g<P;g+=3){const b=g,w=g+1,D=g+2;s=Hs(this,h,e,i,c,u,f,b,w,D),s&&(s.faceIndex=Math.floor(g/3),s.face.materialIndex=p.materialIndex,t.push(s))}}else{const _=Math.max(0,m.start),v=Math.min(l.count,m.start+m.count);for(let p=_,h=v;p<h;p+=3){const A=p,S=p+1,g=p+2;s=Hs(this,a,e,i,c,u,f,A,S,g),s&&(s.faceIndex=Math.floor(p/3),t.push(s))}}}}function ih(n,e,t,i,s,r,a,o){let l;if(e.side===Rt?l=i.intersectTriangle(a,r,s,!0,o):l=i.intersectTriangle(s,r,a,e.side===Xn,o),l===null)return null;Gs.copy(o),Gs.applyMatrix4(n.matrixWorld);const c=t.ray.origin.distanceTo(Gs);return c<t.near||c>t.far?null:{distance:c,point:Gs.clone(),object:n}}function Hs(n,e,t,i,s,r,a,o,l,c){n.getVertexPosition(o,Os),n.getVertexPosition(l,Bs),n.getVertexPosition(c,zs);const u=ih(n,e,t,i,Os,Bs,zs,Wo);if(u){const f=new N;Qt.getBarycoord(Wo,Os,Bs,zs,f),s&&(u.uv=Qt.getInterpolatedAttribute(s,o,l,c,f,new Ve)),r&&(u.uv1=Qt.getInterpolatedAttribute(r,o,l,c,f,new Ve)),a&&(u.normal=Qt.getInterpolatedAttribute(a,o,l,c,f,new N),u.normal.dot(i.direction)>0&&u.normal.multiplyScalar(-1));const d={a:o,b:l,c,normal:new N,materialIndex:0};Qt.getNormal(Os,Bs,zs,d.normal),u.face=d,u.barycoord=f}return u}class Es extends rn{constructor(e=1,t=1,i=1,s=1,r=1,a=1){super(),this.type="BoxGeometry",this.parameters={width:e,height:t,depth:i,widthSegments:s,heightSegments:r,depthSegments:a};const o=this;s=Math.floor(s),r=Math.floor(r),a=Math.floor(a);const l=[],c=[],u=[],f=[];let d=0,m=0;_("z","y","x",-1,-1,i,t,e,a,r,0),_("z","y","x",1,-1,i,t,-e,a,r,1),_("x","z","y",1,1,e,i,t,s,a,2),_("x","z","y",1,-1,e,i,-t,s,a,3),_("x","y","z",1,-1,e,t,i,s,r,4),_("x","y","z",-1,-1,e,t,-i,s,r,5),this.setIndex(l),this.setAttribute("position",new li(c,3)),this.setAttribute("normal",new li(u,3)),this.setAttribute("uv",new li(f,2));function _(v,p,h,A,S,g,P,b,w,D,E){const M=g/w,C=P/D,H=g/2,F=P/2,W=b/2,$=w+1,k=D+1;let j=0,V=0;const ne=new N;for(let Q=0;Q<k;Q++){const re=Q*C-F;for(let be=0;be<$;be++){const Fe=be*M-H;ne[v]=Fe*A,ne[p]=re*S,ne[h]=W,c.push(ne.x,ne.y,ne.z),ne[v]=0,ne[p]=0,ne[h]=b>0?1:-1,u.push(ne.x,ne.y,ne.z),f.push(be/w),f.push(1-Q/D),j+=1}}for(let Q=0;Q<D;Q++)for(let re=0;re<w;re++){const be=d+re+$*Q,Fe=d+re+$*(Q+1),B=d+(re+1)+$*(Q+1),Z=d+(re+1)+$*Q;l.push(be,Fe,Z),l.push(Fe,B,Z),V+=6}o.addGroup(m,V,E),m+=V,d+=j}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new Es(e.width,e.height,e.depth,e.widthSegments,e.heightSegments,e.depthSegments)}}function Gi(n){const e={};for(const t in n){e[t]={};for(const i in n[t]){const s=n[t][i];s&&(s.isColor||s.isMatrix3||s.isMatrix4||s.isVector2||s.isVector3||s.isVector4||s.isTexture||s.isQuaternion)?s.isRenderTargetTexture?(console.warn("UniformsUtils: Textures of render targets cannot be cloned via cloneUniforms() or mergeUniforms()."),e[t][i]=null):e[t][i]=s.clone():Array.isArray(s)?e[t][i]=s.slice():e[t][i]=s}}return e}function yt(n){const e={};for(let t=0;t<n.length;t++){const i=Gi(n[t]);for(const s in i)e[s]=i[s]}return e}function sh(n){const e=[];for(let t=0;t<n.length;t++)e.push(n[t].clone());return e}function rc(n){const e=n.getRenderTarget();return e===null?n.outputColorSpace:e.isXRRenderTarget===!0?e.texture.colorSpace:qe.workingColorSpace}const rh={clone:Gi,merge:yt};var ah=`void main() {
	gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
}`,oh=`void main() {
	gl_FragColor = vec4( 1.0, 0.0, 0.0, 1.0 );
}`;class wt extends ys{static get type(){return"ShaderMaterial"}constructor(e){super(),this.isShaderMaterial=!0,this.defines={},this.uniforms={},this.uniformsGroups=[],this.vertexShader=ah,this.fragmentShader=oh,this.linewidth=1,this.wireframe=!1,this.wireframeLinewidth=1,this.fog=!1,this.lights=!1,this.clipping=!1,this.forceSinglePass=!0,this.extensions={clipCullDistance:!1,multiDraw:!1},this.defaultAttributeValues={color:[1,1,1],uv:[0,0],uv1:[0,0]},this.index0AttributeName=void 0,this.uniformsNeedUpdate=!1,this.glslVersion=null,e!==void 0&&this.setValues(e)}copy(e){return super.copy(e),this.fragmentShader=e.fragmentShader,this.vertexShader=e.vertexShader,this.uniforms=Gi(e.uniforms),this.uniformsGroups=sh(e.uniformsGroups),this.defines=Object.assign({},e.defines),this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.fog=e.fog,this.lights=e.lights,this.clipping=e.clipping,this.extensions=Object.assign({},e.extensions),this.glslVersion=e.glslVersion,this}toJSON(e){const t=super.toJSON(e);t.glslVersion=this.glslVersion,t.uniforms={};for(const s in this.uniforms){const a=this.uniforms[s].value;a&&a.isTexture?t.uniforms[s]={type:"t",value:a.toJSON(e).uuid}:a&&a.isColor?t.uniforms[s]={type:"c",value:a.getHex()}:a&&a.isVector2?t.uniforms[s]={type:"v2",value:a.toArray()}:a&&a.isVector3?t.uniforms[s]={type:"v3",value:a.toArray()}:a&&a.isVector4?t.uniforms[s]={type:"v4",value:a.toArray()}:a&&a.isMatrix3?t.uniforms[s]={type:"m3",value:a.toArray()}:a&&a.isMatrix4?t.uniforms[s]={type:"m4",value:a.toArray()}:t.uniforms[s]={value:a}}Object.keys(this.defines).length>0&&(t.defines=this.defines),t.vertexShader=this.vertexShader,t.fragmentShader=this.fragmentShader,t.lights=this.lights,t.clipping=this.clipping;const i={};for(const s in this.extensions)this.extensions[s]===!0&&(i[s]=!0);return Object.keys(i).length>0&&(t.extensions=i),t}}class ac extends Ct{constructor(){super(),this.isCamera=!0,this.type="Camera",this.matrixWorldInverse=new rt,this.projectionMatrix=new rt,this.projectionMatrixInverse=new rt,this.coordinateSystem=Mn}copy(e,t){return super.copy(e,t),this.matrixWorldInverse.copy(e.matrixWorldInverse),this.projectionMatrix.copy(e.projectionMatrix),this.projectionMatrixInverse.copy(e.projectionMatrixInverse),this.coordinateSystem=e.coordinateSystem,this}getWorldDirection(e){return super.getWorldDirection(e).negate()}updateMatrixWorld(e){super.updateMatrixWorld(e),this.matrixWorldInverse.copy(this.matrixWorld).invert()}updateWorldMatrix(e,t){super.updateWorldMatrix(e,t),this.matrixWorldInverse.copy(this.matrixWorld).invert()}clone(){return new this.constructor().copy(this)}}const Nn=new N,Xo=new Ve,qo=new Ve;class Ut extends ac{constructor(e=50,t=1,i=.1,s=2e3){super(),this.isPerspectiveCamera=!0,this.type="PerspectiveCamera",this.fov=e,this.zoom=1,this.near=i,this.far=s,this.focus=10,this.aspect=t,this.view=null,this.filmGauge=35,this.filmOffset=0,this.updateProjectionMatrix()}copy(e,t){return super.copy(e,t),this.fov=e.fov,this.zoom=e.zoom,this.near=e.near,this.far=e.far,this.focus=e.focus,this.aspect=e.aspect,this.view=e.view===null?null:Object.assign({},e.view),this.filmGauge=e.filmGauge,this.filmOffset=e.filmOffset,this}setFocalLength(e){const t=.5*this.getFilmHeight()/e;this.fov=Xa*2*Math.atan(t),this.updateProjectionMatrix()}getFocalLength(){const e=Math.tan(Tr*.5*this.fov);return .5*this.getFilmHeight()/e}getEffectiveFOV(){return Xa*2*Math.atan(Math.tan(Tr*.5*this.fov)/this.zoom)}getFilmWidth(){return this.filmGauge*Math.min(this.aspect,1)}getFilmHeight(){return this.filmGauge/Math.max(this.aspect,1)}getViewBounds(e,t,i){Nn.set(-1,-1,.5).applyMatrix4(this.projectionMatrixInverse),t.set(Nn.x,Nn.y).multiplyScalar(-e/Nn.z),Nn.set(1,1,.5).applyMatrix4(this.projectionMatrixInverse),i.set(Nn.x,Nn.y).multiplyScalar(-e/Nn.z)}getViewSize(e,t){return this.getViewBounds(e,Xo,qo),t.subVectors(qo,Xo)}setViewOffset(e,t,i,s,r,a){this.aspect=e/t,this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=e,this.view.fullHeight=t,this.view.offsetX=i,this.view.offsetY=s,this.view.width=r,this.view.height=a,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){const e=this.near;let t=e*Math.tan(Tr*.5*this.fov)/this.zoom,i=2*t,s=this.aspect*i,r=-.5*s;const a=this.view;if(this.view!==null&&this.view.enabled){const l=a.fullWidth,c=a.fullHeight;r+=a.offsetX*s/l,t-=a.offsetY*i/c,s*=a.width/l,i*=a.height/c}const o=this.filmOffset;o!==0&&(r+=e*o/this.getFilmWidth()),this.projectionMatrix.makePerspective(r,r+s,t,t-i,e,this.far,this.coordinateSystem),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(e){const t=super.toJSON(e);return t.object.fov=this.fov,t.object.zoom=this.zoom,t.object.near=this.near,t.object.far=this.far,t.object.focus=this.focus,t.object.aspect=this.aspect,this.view!==null&&(t.object.view=Object.assign({},this.view)),t.object.filmGauge=this.filmGauge,t.object.filmOffset=this.filmOffset,t}}const Ti=-90,Ai=1;class lh extends Ct{constructor(e,t,i){super(),this.type="CubeCamera",this.renderTarget=i,this.coordinateSystem=null,this.activeMipmapLevel=0;const s=new Ut(Ti,Ai,e,t);s.layers=this.layers,this.add(s);const r=new Ut(Ti,Ai,e,t);r.layers=this.layers,this.add(r);const a=new Ut(Ti,Ai,e,t);a.layers=this.layers,this.add(a);const o=new Ut(Ti,Ai,e,t);o.layers=this.layers,this.add(o);const l=new Ut(Ti,Ai,e,t);l.layers=this.layers,this.add(l);const c=new Ut(Ti,Ai,e,t);c.layers=this.layers,this.add(c)}updateCoordinateSystem(){const e=this.coordinateSystem,t=this.children.concat(),[i,s,r,a,o,l]=t;for(const c of t)this.remove(c);if(e===Mn)i.up.set(0,1,0),i.lookAt(1,0,0),s.up.set(0,1,0),s.lookAt(-1,0,0),r.up.set(0,0,-1),r.lookAt(0,1,0),a.up.set(0,0,1),a.lookAt(0,-1,0),o.up.set(0,1,0),o.lookAt(0,0,1),l.up.set(0,1,0),l.lookAt(0,0,-1);else if(e===or)i.up.set(0,-1,0),i.lookAt(-1,0,0),s.up.set(0,-1,0),s.lookAt(1,0,0),r.up.set(0,0,1),r.lookAt(0,1,0),a.up.set(0,0,-1),a.lookAt(0,-1,0),o.up.set(0,-1,0),o.lookAt(0,0,1),l.up.set(0,-1,0),l.lookAt(0,0,-1);else throw new Error("THREE.CubeCamera.updateCoordinateSystem(): Invalid coordinate system: "+e);for(const c of t)this.add(c),c.updateMatrixWorld()}update(e,t){this.parent===null&&this.updateMatrixWorld();const{renderTarget:i,activeMipmapLevel:s}=this;this.coordinateSystem!==e.coordinateSystem&&(this.coordinateSystem=e.coordinateSystem,this.updateCoordinateSystem());const[r,a,o,l,c,u]=this.children,f=e.getRenderTarget(),d=e.getActiveCubeFace(),m=e.getActiveMipmapLevel(),_=e.xr.enabled;e.xr.enabled=!1;const v=i.texture.generateMipmaps;i.texture.generateMipmaps=!1,e.setRenderTarget(i,0,s),e.render(t,r),e.setRenderTarget(i,1,s),e.render(t,a),e.setRenderTarget(i,2,s),e.render(t,o),e.setRenderTarget(i,3,s),e.render(t,l),e.setRenderTarget(i,4,s),e.render(t,c),i.texture.generateMipmaps=v,e.setRenderTarget(i,5,s),e.render(t,u),e.setRenderTarget(f,d,m),e.xr.enabled=_,i.texture.needsPMREMUpdate=!0}}class oc extends St{constructor(e,t,i,s,r,a,o,l,c,u){e=e!==void 0?e:[],t=t!==void 0?t:Oi,super(e,t,i,s,r,a,o,l,c,u),this.isCubeTexture=!0,this.flipY=!1}get images(){return this.image}set images(e){this.image=e}}class ch extends Tn{constructor(e=1,t={}){super(e,e,t),this.isWebGLCubeRenderTarget=!0;const i={width:e,height:e,depth:1},s=[i,i,i,i,i,i];this.texture=new oc(s,t.mapping,t.wrapS,t.wrapT,t.magFilter,t.minFilter,t.format,t.type,t.anisotropy,t.colorSpace),this.texture.isRenderTargetTexture=!0,this.texture.generateMipmaps=t.generateMipmaps!==void 0?t.generateMipmaps:!1,this.texture.minFilter=t.minFilter!==void 0?t.minFilter:Gt}fromEquirectangularTexture(e,t){this.texture.type=t.type,this.texture.colorSpace=t.colorSpace,this.texture.generateMipmaps=t.generateMipmaps,this.texture.minFilter=t.minFilter,this.texture.magFilter=t.magFilter;const i={uniforms:{tEquirect:{value:null}},vertexShader:`

				varying vec3 vWorldDirection;

				vec3 transformDirection( in vec3 dir, in mat4 matrix ) {

					return normalize( ( matrix * vec4( dir, 0.0 ) ).xyz );

				}

				void main() {

					vWorldDirection = transformDirection( position, modelMatrix );

					#include <begin_vertex>
					#include <project_vertex>

				}
			`,fragmentShader:`

				uniform sampler2D tEquirect;

				varying vec3 vWorldDirection;

				#include <common>

				void main() {

					vec3 direction = normalize( vWorldDirection );

					vec2 sampleUV = equirectUv( direction );

					gl_FragColor = texture2D( tEquirect, sampleUV );

				}
			`},s=new Es(5,5,5),r=new wt({name:"CubemapFromEquirect",uniforms:Gi(i.uniforms),vertexShader:i.vertexShader,fragmentShader:i.fragmentShader,side:Rt,blending:Gn});r.uniforms.tEquirect.value=t;const a=new Vt(s,r),o=t.minFilter;return t.minFilter===ai&&(t.minFilter=Gt),new lh(1,10,this).update(e,a),t.minFilter=o,a.geometry.dispose(),a.material.dispose(),this}clear(e,t,i,s){const r=e.getRenderTarget();for(let a=0;a<6;a++)e.setRenderTarget(this,a),e.clear(t,i,s);e.setRenderTarget(r)}}const Xr=new N,uh=new N,hh=new Ne;class ei{constructor(e=new N(1,0,0),t=0){this.isPlane=!0,this.normal=e,this.constant=t}set(e,t){return this.normal.copy(e),this.constant=t,this}setComponents(e,t,i,s){return this.normal.set(e,t,i),this.constant=s,this}setFromNormalAndCoplanarPoint(e,t){return this.normal.copy(e),this.constant=-t.dot(this.normal),this}setFromCoplanarPoints(e,t,i){const s=Xr.subVectors(i,t).cross(uh.subVectors(e,t)).normalize();return this.setFromNormalAndCoplanarPoint(s,e),this}copy(e){return this.normal.copy(e.normal),this.constant=e.constant,this}normalize(){const e=1/this.normal.length();return this.normal.multiplyScalar(e),this.constant*=e,this}negate(){return this.constant*=-1,this.normal.negate(),this}distanceToPoint(e){return this.normal.dot(e)+this.constant}distanceToSphere(e){return this.distanceToPoint(e.center)-e.radius}projectPoint(e,t){return t.copy(e).addScaledVector(this.normal,-this.distanceToPoint(e))}intersectLine(e,t){const i=e.delta(Xr),s=this.normal.dot(i);if(s===0)return this.distanceToPoint(e.start)===0?t.copy(e.start):null;const r=-(e.start.dot(this.normal)+this.constant)/s;return r<0||r>1?null:t.copy(e.start).addScaledVector(i,r)}intersectsLine(e){const t=this.distanceToPoint(e.start),i=this.distanceToPoint(e.end);return t<0&&i>0||i<0&&t>0}intersectsBox(e){return e.intersectsPlane(this)}intersectsSphere(e){return e.intersectsPlane(this)}coplanarPoint(e){return e.copy(this.normal).multiplyScalar(-this.constant)}applyMatrix4(e,t){const i=t||hh.getNormalMatrix(e),s=this.coplanarPoint(Xr).applyMatrix4(e),r=this.normal.applyMatrix3(i).normalize();return this.constant=-s.dot(r),this}translate(e){return this.constant-=e.dot(this.normal),this}equals(e){return e.normal.equals(this.normal)&&e.constant===this.constant}clone(){return new this.constructor().copy(this)}}const jn=new _r,Vs=new N;class lc{constructor(e=new ei,t=new ei,i=new ei,s=new ei,r=new ei,a=new ei){this.planes=[e,t,i,s,r,a]}set(e,t,i,s,r,a){const o=this.planes;return o[0].copy(e),o[1].copy(t),o[2].copy(i),o[3].copy(s),o[4].copy(r),o[5].copy(a),this}copy(e){const t=this.planes;for(let i=0;i<6;i++)t[i].copy(e.planes[i]);return this}setFromProjectionMatrix(e,t=Mn){const i=this.planes,s=e.elements,r=s[0],a=s[1],o=s[2],l=s[3],c=s[4],u=s[5],f=s[6],d=s[7],m=s[8],_=s[9],v=s[10],p=s[11],h=s[12],A=s[13],S=s[14],g=s[15];if(i[0].setComponents(l-r,d-c,p-m,g-h).normalize(),i[1].setComponents(l+r,d+c,p+m,g+h).normalize(),i[2].setComponents(l+a,d+u,p+_,g+A).normalize(),i[3].setComponents(l-a,d-u,p-_,g-A).normalize(),i[4].setComponents(l-o,d-f,p-v,g-S).normalize(),t===Mn)i[5].setComponents(l+o,d+f,p+v,g+S).normalize();else if(t===or)i[5].setComponents(o,f,v,S).normalize();else throw new Error("THREE.Frustum.setFromProjectionMatrix(): Invalid coordinate system: "+t);return this}intersectsObject(e){if(e.boundingSphere!==void 0)e.boundingSphere===null&&e.computeBoundingSphere(),jn.copy(e.boundingSphere).applyMatrix4(e.matrixWorld);else{const t=e.geometry;t.boundingSphere===null&&t.computeBoundingSphere(),jn.copy(t.boundingSphere).applyMatrix4(e.matrixWorld)}return this.intersectsSphere(jn)}intersectsSprite(e){return jn.center.set(0,0,0),jn.radius=.7071067811865476,jn.applyMatrix4(e.matrixWorld),this.intersectsSphere(jn)}intersectsSphere(e){const t=this.planes,i=e.center,s=-e.radius;for(let r=0;r<6;r++)if(t[r].distanceToPoint(i)<s)return!1;return!0}intersectsBox(e){const t=this.planes;for(let i=0;i<6;i++){const s=t[i];if(Vs.x=s.normal.x>0?e.max.x:e.min.x,Vs.y=s.normal.y>0?e.max.y:e.min.y,Vs.z=s.normal.z>0?e.max.z:e.min.z,s.distanceToPoint(Vs)<0)return!1}return!0}containsPoint(e){const t=this.planes;for(let i=0;i<6;i++)if(t[i].distanceToPoint(e)<0)return!1;return!0}clone(){return new this.constructor().copy(this)}}function cc(){let n=null,e=!1,t=null,i=null;function s(r,a){t(r,a),i=n.requestAnimationFrame(s)}return{start:function(){e!==!0&&t!==null&&(i=n.requestAnimationFrame(s),e=!0)},stop:function(){n.cancelAnimationFrame(i),e=!1},setAnimationLoop:function(r){t=r},setContext:function(r){n=r}}}function fh(n){const e=new WeakMap;function t(o,l){const c=o.array,u=o.usage,f=c.byteLength,d=n.createBuffer();n.bindBuffer(l,d),n.bufferData(l,c,u),o.onUploadCallback();let m;if(c instanceof Float32Array)m=n.FLOAT;else if(c instanceof Uint16Array)o.isFloat16BufferAttribute?m=n.HALF_FLOAT:m=n.UNSIGNED_SHORT;else if(c instanceof Int16Array)m=n.SHORT;else if(c instanceof Uint32Array)m=n.UNSIGNED_INT;else if(c instanceof Int32Array)m=n.INT;else if(c instanceof Int8Array)m=n.BYTE;else if(c instanceof Uint8Array)m=n.UNSIGNED_BYTE;else if(c instanceof Uint8ClampedArray)m=n.UNSIGNED_BYTE;else throw new Error("THREE.WebGLAttributes: Unsupported buffer data format: "+c);return{buffer:d,type:m,bytesPerElement:c.BYTES_PER_ELEMENT,version:o.version,size:f}}function i(o,l,c){const u=l.array,f=l.updateRanges;if(n.bindBuffer(c,o),f.length===0)n.bufferSubData(c,0,u);else{f.sort((m,_)=>m.start-_.start);let d=0;for(let m=1;m<f.length;m++){const _=f[d],v=f[m];v.start<=_.start+_.count+1?_.count=Math.max(_.count,v.start+v.count-_.start):(++d,f[d]=v)}f.length=d+1;for(let m=0,_=f.length;m<_;m++){const v=f[m];n.bufferSubData(c,v.start*u.BYTES_PER_ELEMENT,u,v.start,v.count)}l.clearUpdateRanges()}l.onUploadCallback()}function s(o){return o.isInterleavedBufferAttribute&&(o=o.data),e.get(o)}function r(o){o.isInterleavedBufferAttribute&&(o=o.data);const l=e.get(o);l&&(n.deleteBuffer(l.buffer),e.delete(o))}function a(o,l){if(o.isInterleavedBufferAttribute&&(o=o.data),o.isGLBufferAttribute){const u=e.get(o);(!u||u.version<o.version)&&e.set(o,{buffer:o.buffer,type:o.type,bytesPerElement:o.elementSize,version:o.version});return}const c=e.get(o);if(c===void 0)e.set(o,t(o,l));else if(c.version<o.version){if(c.size!==o.array.byteLength)throw new Error("THREE.WebGLAttributes: The size of the buffer attribute's array buffer does not match the original size. Resizing buffer attributes is not supported.");i(c.buffer,o,l),c.version=o.version}}return{get:s,remove:r,update:a}}class $i extends rn{constructor(e=1,t=1,i=1,s=1){super(),this.type="PlaneGeometry",this.parameters={width:e,height:t,widthSegments:i,heightSegments:s};const r=e/2,a=t/2,o=Math.floor(i),l=Math.floor(s),c=o+1,u=l+1,f=e/o,d=t/l,m=[],_=[],v=[],p=[];for(let h=0;h<u;h++){const A=h*d-a;for(let S=0;S<c;S++){const g=S*f-r;_.push(g,-A,0),v.push(0,0,1),p.push(S/o),p.push(1-h/l)}}for(let h=0;h<l;h++)for(let A=0;A<o;A++){const S=A+c*h,g=A+c*(h+1),P=A+1+c*(h+1),b=A+1+c*h;m.push(S,g,b),m.push(g,P,b)}this.setIndex(m),this.setAttribute("position",new li(_,3)),this.setAttribute("normal",new li(v,3)),this.setAttribute("uv",new li(p,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new $i(e.width,e.height,e.widthSegments,e.heightSegments)}}var dh=`#ifdef USE_ALPHAHASH
	if ( diffuseColor.a < getAlphaHashThreshold( vPosition ) ) discard;
#endif`,ph=`#ifdef USE_ALPHAHASH
	const float ALPHA_HASH_SCALE = 0.05;
	float hash2D( vec2 value ) {
		return fract( 1.0e4 * sin( 17.0 * value.x + 0.1 * value.y ) * ( 0.1 + abs( sin( 13.0 * value.y + value.x ) ) ) );
	}
	float hash3D( vec3 value ) {
		return hash2D( vec2( hash2D( value.xy ), value.z ) );
	}
	float getAlphaHashThreshold( vec3 position ) {
		float maxDeriv = max(
			length( dFdx( position.xyz ) ),
			length( dFdy( position.xyz ) )
		);
		float pixScale = 1.0 / ( ALPHA_HASH_SCALE * maxDeriv );
		vec2 pixScales = vec2(
			exp2( floor( log2( pixScale ) ) ),
			exp2( ceil( log2( pixScale ) ) )
		);
		vec2 alpha = vec2(
			hash3D( floor( pixScales.x * position.xyz ) ),
			hash3D( floor( pixScales.y * position.xyz ) )
		);
		float lerpFactor = fract( log2( pixScale ) );
		float x = ( 1.0 - lerpFactor ) * alpha.x + lerpFactor * alpha.y;
		float a = min( lerpFactor, 1.0 - lerpFactor );
		vec3 cases = vec3(
			x * x / ( 2.0 * a * ( 1.0 - a ) ),
			( x - 0.5 * a ) / ( 1.0 - a ),
			1.0 - ( ( 1.0 - x ) * ( 1.0 - x ) / ( 2.0 * a * ( 1.0 - a ) ) )
		);
		float threshold = ( x < ( 1.0 - a ) )
			? ( ( x < a ) ? cases.x : cases.y )
			: cases.z;
		return clamp( threshold , 1.0e-6, 1.0 );
	}
#endif`,mh=`#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, vAlphaMapUv ).g;
#endif`,gh=`#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,_h=`#ifdef USE_ALPHATEST
	#ifdef ALPHA_TO_COVERAGE
	diffuseColor.a = smoothstep( alphaTest, alphaTest + fwidth( diffuseColor.a ), diffuseColor.a );
	if ( diffuseColor.a == 0.0 ) discard;
	#else
	if ( diffuseColor.a < alphaTest ) discard;
	#endif
#endif`,vh=`#ifdef USE_ALPHATEST
	uniform float alphaTest;
#endif`,xh=`#ifdef USE_AOMAP
	float ambientOcclusion = ( texture2D( aoMap, vAoMapUv ).r - 1.0 ) * aoMapIntensity + 1.0;
	reflectedLight.indirectDiffuse *= ambientOcclusion;
	#if defined( USE_CLEARCOAT ) 
		clearcoatSpecularIndirect *= ambientOcclusion;
	#endif
	#if defined( USE_SHEEN ) 
		sheenSpecularIndirect *= ambientOcclusion;
	#endif
	#if defined( USE_ENVMAP ) && defined( STANDARD )
		float dotNV = saturate( dot( geometryNormal, geometryViewDir ) );
		reflectedLight.indirectSpecular *= computeSpecularOcclusion( dotNV, ambientOcclusion, material.roughness );
	#endif
#endif`,Mh=`#ifdef USE_AOMAP
	uniform sampler2D aoMap;
	uniform float aoMapIntensity;
#endif`,Sh=`#ifdef USE_BATCHING
	#if ! defined( GL_ANGLE_multi_draw )
	#define gl_DrawID _gl_DrawID
	uniform int _gl_DrawID;
	#endif
	uniform highp sampler2D batchingTexture;
	uniform highp usampler2D batchingIdTexture;
	mat4 getBatchingMatrix( const in float i ) {
		int size = textureSize( batchingTexture, 0 ).x;
		int j = int( i ) * 4;
		int x = j % size;
		int y = j / size;
		vec4 v1 = texelFetch( batchingTexture, ivec2( x, y ), 0 );
		vec4 v2 = texelFetch( batchingTexture, ivec2( x + 1, y ), 0 );
		vec4 v3 = texelFetch( batchingTexture, ivec2( x + 2, y ), 0 );
		vec4 v4 = texelFetch( batchingTexture, ivec2( x + 3, y ), 0 );
		return mat4( v1, v2, v3, v4 );
	}
	float getIndirectIndex( const in int i ) {
		int size = textureSize( batchingIdTexture, 0 ).x;
		int x = i % size;
		int y = i / size;
		return float( texelFetch( batchingIdTexture, ivec2( x, y ), 0 ).r );
	}
#endif
#ifdef USE_BATCHING_COLOR
	uniform sampler2D batchingColorTexture;
	vec3 getBatchingColor( const in float i ) {
		int size = textureSize( batchingColorTexture, 0 ).x;
		int j = int( i );
		int x = j % size;
		int y = j / size;
		return texelFetch( batchingColorTexture, ivec2( x, y ), 0 ).rgb;
	}
#endif`,yh=`#ifdef USE_BATCHING
	mat4 batchingMatrix = getBatchingMatrix( getIndirectIndex( gl_DrawID ) );
#endif`,Eh=`vec3 transformed = vec3( position );
#ifdef USE_ALPHAHASH
	vPosition = vec3( position );
#endif`,Th=`vec3 objectNormal = vec3( normal );
#ifdef USE_TANGENT
	vec3 objectTangent = vec3( tangent.xyz );
#endif`,Ah=`float G_BlinnPhong_Implicit( ) {
	return 0.25;
}
float D_BlinnPhong( const in float shininess, const in float dotNH ) {
	return RECIPROCAL_PI * ( shininess * 0.5 + 1.0 ) * pow( dotNH, shininess );
}
vec3 BRDF_BlinnPhong( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in vec3 specularColor, const in float shininess ) {
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNH = saturate( dot( normal, halfDir ) );
	float dotVH = saturate( dot( viewDir, halfDir ) );
	vec3 F = F_Schlick( specularColor, 1.0, dotVH );
	float G = G_BlinnPhong_Implicit( );
	float D = D_BlinnPhong( shininess, dotNH );
	return F * ( G * D );
} // validated`,bh=`#ifdef USE_IRIDESCENCE
	const mat3 XYZ_TO_REC709 = mat3(
		 3.2404542, -0.9692660,  0.0556434,
		-1.5371385,  1.8760108, -0.2040259,
		-0.4985314,  0.0415560,  1.0572252
	);
	vec3 Fresnel0ToIor( vec3 fresnel0 ) {
		vec3 sqrtF0 = sqrt( fresnel0 );
		return ( vec3( 1.0 ) + sqrtF0 ) / ( vec3( 1.0 ) - sqrtF0 );
	}
	vec3 IorToFresnel0( vec3 transmittedIor, float incidentIor ) {
		return pow2( ( transmittedIor - vec3( incidentIor ) ) / ( transmittedIor + vec3( incidentIor ) ) );
	}
	float IorToFresnel0( float transmittedIor, float incidentIor ) {
		return pow2( ( transmittedIor - incidentIor ) / ( transmittedIor + incidentIor ));
	}
	vec3 evalSensitivity( float OPD, vec3 shift ) {
		float phase = 2.0 * PI * OPD * 1.0e-9;
		vec3 val = vec3( 5.4856e-13, 4.4201e-13, 5.2481e-13 );
		vec3 pos = vec3( 1.6810e+06, 1.7953e+06, 2.2084e+06 );
		vec3 var = vec3( 4.3278e+09, 9.3046e+09, 6.6121e+09 );
		vec3 xyz = val * sqrt( 2.0 * PI * var ) * cos( pos * phase + shift ) * exp( - pow2( phase ) * var );
		xyz.x += 9.7470e-14 * sqrt( 2.0 * PI * 4.5282e+09 ) * cos( 2.2399e+06 * phase + shift[ 0 ] ) * exp( - 4.5282e+09 * pow2( phase ) );
		xyz /= 1.0685e-7;
		vec3 rgb = XYZ_TO_REC709 * xyz;
		return rgb;
	}
	vec3 evalIridescence( float outsideIOR, float eta2, float cosTheta1, float thinFilmThickness, vec3 baseF0 ) {
		vec3 I;
		float iridescenceIOR = mix( outsideIOR, eta2, smoothstep( 0.0, 0.03, thinFilmThickness ) );
		float sinTheta2Sq = pow2( outsideIOR / iridescenceIOR ) * ( 1.0 - pow2( cosTheta1 ) );
		float cosTheta2Sq = 1.0 - sinTheta2Sq;
		if ( cosTheta2Sq < 0.0 ) {
			return vec3( 1.0 );
		}
		float cosTheta2 = sqrt( cosTheta2Sq );
		float R0 = IorToFresnel0( iridescenceIOR, outsideIOR );
		float R12 = F_Schlick( R0, 1.0, cosTheta1 );
		float T121 = 1.0 - R12;
		float phi12 = 0.0;
		if ( iridescenceIOR < outsideIOR ) phi12 = PI;
		float phi21 = PI - phi12;
		vec3 baseIOR = Fresnel0ToIor( clamp( baseF0, 0.0, 0.9999 ) );		vec3 R1 = IorToFresnel0( baseIOR, iridescenceIOR );
		vec3 R23 = F_Schlick( R1, 1.0, cosTheta2 );
		vec3 phi23 = vec3( 0.0 );
		if ( baseIOR[ 0 ] < iridescenceIOR ) phi23[ 0 ] = PI;
		if ( baseIOR[ 1 ] < iridescenceIOR ) phi23[ 1 ] = PI;
		if ( baseIOR[ 2 ] < iridescenceIOR ) phi23[ 2 ] = PI;
		float OPD = 2.0 * iridescenceIOR * thinFilmThickness * cosTheta2;
		vec3 phi = vec3( phi21 ) + phi23;
		vec3 R123 = clamp( R12 * R23, 1e-5, 0.9999 );
		vec3 r123 = sqrt( R123 );
		vec3 Rs = pow2( T121 ) * R23 / ( vec3( 1.0 ) - R123 );
		vec3 C0 = R12 + Rs;
		I = C0;
		vec3 Cm = Rs - T121;
		for ( int m = 1; m <= 2; ++ m ) {
			Cm *= r123;
			vec3 Sm = 2.0 * evalSensitivity( float( m ) * OPD, float( m ) * phi );
			I += Cm * Sm;
		}
		return max( I, vec3( 0.0 ) );
	}
#endif`,wh=`#ifdef USE_BUMPMAP
	uniform sampler2D bumpMap;
	uniform float bumpScale;
	vec2 dHdxy_fwd() {
		vec2 dSTdx = dFdx( vBumpMapUv );
		vec2 dSTdy = dFdy( vBumpMapUv );
		float Hll = bumpScale * texture2D( bumpMap, vBumpMapUv ).x;
		float dBx = bumpScale * texture2D( bumpMap, vBumpMapUv + dSTdx ).x - Hll;
		float dBy = bumpScale * texture2D( bumpMap, vBumpMapUv + dSTdy ).x - Hll;
		return vec2( dBx, dBy );
	}
	vec3 perturbNormalArb( vec3 surf_pos, vec3 surf_norm, vec2 dHdxy, float faceDirection ) {
		vec3 vSigmaX = normalize( dFdx( surf_pos.xyz ) );
		vec3 vSigmaY = normalize( dFdy( surf_pos.xyz ) );
		vec3 vN = surf_norm;
		vec3 R1 = cross( vSigmaY, vN );
		vec3 R2 = cross( vN, vSigmaX );
		float fDet = dot( vSigmaX, R1 ) * faceDirection;
		vec3 vGrad = sign( fDet ) * ( dHdxy.x * R1 + dHdxy.y * R2 );
		return normalize( abs( fDet ) * surf_norm - vGrad );
	}
#endif`,Rh=`#if NUM_CLIPPING_PLANES > 0
	vec4 plane;
	#ifdef ALPHA_TO_COVERAGE
		float distanceToPlane, distanceGradient;
		float clipOpacity = 1.0;
		#pragma unroll_loop_start
		for ( int i = 0; i < UNION_CLIPPING_PLANES; i ++ ) {
			plane = clippingPlanes[ i ];
			distanceToPlane = - dot( vClipPosition, plane.xyz ) + plane.w;
			distanceGradient = fwidth( distanceToPlane ) / 2.0;
			clipOpacity *= smoothstep( - distanceGradient, distanceGradient, distanceToPlane );
			if ( clipOpacity == 0.0 ) discard;
		}
		#pragma unroll_loop_end
		#if UNION_CLIPPING_PLANES < NUM_CLIPPING_PLANES
			float unionClipOpacity = 1.0;
			#pragma unroll_loop_start
			for ( int i = UNION_CLIPPING_PLANES; i < NUM_CLIPPING_PLANES; i ++ ) {
				plane = clippingPlanes[ i ];
				distanceToPlane = - dot( vClipPosition, plane.xyz ) + plane.w;
				distanceGradient = fwidth( distanceToPlane ) / 2.0;
				unionClipOpacity *= 1.0 - smoothstep( - distanceGradient, distanceGradient, distanceToPlane );
			}
			#pragma unroll_loop_end
			clipOpacity *= 1.0 - unionClipOpacity;
		#endif
		diffuseColor.a *= clipOpacity;
		if ( diffuseColor.a == 0.0 ) discard;
	#else
		#pragma unroll_loop_start
		for ( int i = 0; i < UNION_CLIPPING_PLANES; i ++ ) {
			plane = clippingPlanes[ i ];
			if ( dot( vClipPosition, plane.xyz ) > plane.w ) discard;
		}
		#pragma unroll_loop_end
		#if UNION_CLIPPING_PLANES < NUM_CLIPPING_PLANES
			bool clipped = true;
			#pragma unroll_loop_start
			for ( int i = UNION_CLIPPING_PLANES; i < NUM_CLIPPING_PLANES; i ++ ) {
				plane = clippingPlanes[ i ];
				clipped = ( dot( vClipPosition, plane.xyz ) > plane.w ) && clipped;
			}
			#pragma unroll_loop_end
			if ( clipped ) discard;
		#endif
	#endif
#endif`,Ch=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
	uniform vec4 clippingPlanes[ NUM_CLIPPING_PLANES ];
#endif`,Ph=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
#endif`,Dh=`#if NUM_CLIPPING_PLANES > 0
	vClipPosition = - mvPosition.xyz;
#endif`,Lh=`#if defined( USE_COLOR_ALPHA )
	diffuseColor *= vColor;
#elif defined( USE_COLOR )
	diffuseColor.rgb *= vColor;
#endif`,Ih=`#if defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#elif defined( USE_COLOR )
	varying vec3 vColor;
#endif`,Uh=`#if defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#elif defined( USE_COLOR ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
	varying vec3 vColor;
#endif`,Nh=`#if defined( USE_COLOR_ALPHA )
	vColor = vec4( 1.0 );
#elif defined( USE_COLOR ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
	vColor = vec3( 1.0 );
#endif
#ifdef USE_COLOR
	vColor *= color;
#endif
#ifdef USE_INSTANCING_COLOR
	vColor.xyz *= instanceColor.xyz;
#endif
#ifdef USE_BATCHING_COLOR
	vec3 batchingColor = getBatchingColor( getIndirectIndex( gl_DrawID ) );
	vColor.xyz *= batchingColor.xyz;
#endif`,Fh=`#define PI 3.141592653589793
#define PI2 6.283185307179586
#define PI_HALF 1.5707963267948966
#define RECIPROCAL_PI 0.3183098861837907
#define RECIPROCAL_PI2 0.15915494309189535
#define EPSILON 1e-6
#ifndef saturate
#define saturate( a ) clamp( a, 0.0, 1.0 )
#endif
#define whiteComplement( a ) ( 1.0 - saturate( a ) )
float pow2( const in float x ) { return x*x; }
vec3 pow2( const in vec3 x ) { return x*x; }
float pow3( const in float x ) { return x*x*x; }
float pow4( const in float x ) { float x2 = x*x; return x2*x2; }
float max3( const in vec3 v ) { return max( max( v.x, v.y ), v.z ); }
float average( const in vec3 v ) { return dot( v, vec3( 0.3333333 ) ); }
highp float rand( const in vec2 uv ) {
	const highp float a = 12.9898, b = 78.233, c = 43758.5453;
	highp float dt = dot( uv.xy, vec2( a,b ) ), sn = mod( dt, PI );
	return fract( sin( sn ) * c );
}
#ifdef HIGH_PRECISION
	float precisionSafeLength( vec3 v ) { return length( v ); }
#else
	float precisionSafeLength( vec3 v ) {
		float maxComponent = max3( abs( v ) );
		return length( v / maxComponent ) * maxComponent;
	}
#endif
struct IncidentLight {
	vec3 color;
	vec3 direction;
	bool visible;
};
struct ReflectedLight {
	vec3 directDiffuse;
	vec3 directSpecular;
	vec3 indirectDiffuse;
	vec3 indirectSpecular;
};
#ifdef USE_ALPHAHASH
	varying vec3 vPosition;
#endif
vec3 transformDirection( in vec3 dir, in mat4 matrix ) {
	return normalize( ( matrix * vec4( dir, 0.0 ) ).xyz );
}
vec3 inverseTransformDirection( in vec3 dir, in mat4 matrix ) {
	return normalize( ( vec4( dir, 0.0 ) * matrix ).xyz );
}
mat3 transposeMat3( const in mat3 m ) {
	mat3 tmp;
	tmp[ 0 ] = vec3( m[ 0 ].x, m[ 1 ].x, m[ 2 ].x );
	tmp[ 1 ] = vec3( m[ 0 ].y, m[ 1 ].y, m[ 2 ].y );
	tmp[ 2 ] = vec3( m[ 0 ].z, m[ 1 ].z, m[ 2 ].z );
	return tmp;
}
bool isPerspectiveMatrix( mat4 m ) {
	return m[ 2 ][ 3 ] == - 1.0;
}
vec2 equirectUv( in vec3 dir ) {
	float u = atan( dir.z, dir.x ) * RECIPROCAL_PI2 + 0.5;
	float v = asin( clamp( dir.y, - 1.0, 1.0 ) ) * RECIPROCAL_PI + 0.5;
	return vec2( u, v );
}
vec3 BRDF_Lambert( const in vec3 diffuseColor ) {
	return RECIPROCAL_PI * diffuseColor;
}
vec3 F_Schlick( const in vec3 f0, const in float f90, const in float dotVH ) {
	float fresnel = exp2( ( - 5.55473 * dotVH - 6.98316 ) * dotVH );
	return f0 * ( 1.0 - fresnel ) + ( f90 * fresnel );
}
float F_Schlick( const in float f0, const in float f90, const in float dotVH ) {
	float fresnel = exp2( ( - 5.55473 * dotVH - 6.98316 ) * dotVH );
	return f0 * ( 1.0 - fresnel ) + ( f90 * fresnel );
} // validated`,Oh=`#ifdef ENVMAP_TYPE_CUBE_UV
	#define cubeUV_minMipLevel 4.0
	#define cubeUV_minTileSize 16.0
	float getFace( vec3 direction ) {
		vec3 absDirection = abs( direction );
		float face = - 1.0;
		if ( absDirection.x > absDirection.z ) {
			if ( absDirection.x > absDirection.y )
				face = direction.x > 0.0 ? 0.0 : 3.0;
			else
				face = direction.y > 0.0 ? 1.0 : 4.0;
		} else {
			if ( absDirection.z > absDirection.y )
				face = direction.z > 0.0 ? 2.0 : 5.0;
			else
				face = direction.y > 0.0 ? 1.0 : 4.0;
		}
		return face;
	}
	vec2 getUV( vec3 direction, float face ) {
		vec2 uv;
		if ( face == 0.0 ) {
			uv = vec2( direction.z, direction.y ) / abs( direction.x );
		} else if ( face == 1.0 ) {
			uv = vec2( - direction.x, - direction.z ) / abs( direction.y );
		} else if ( face == 2.0 ) {
			uv = vec2( - direction.x, direction.y ) / abs( direction.z );
		} else if ( face == 3.0 ) {
			uv = vec2( - direction.z, direction.y ) / abs( direction.x );
		} else if ( face == 4.0 ) {
			uv = vec2( - direction.x, direction.z ) / abs( direction.y );
		} else {
			uv = vec2( direction.x, direction.y ) / abs( direction.z );
		}
		return 0.5 * ( uv + 1.0 );
	}
	vec3 bilinearCubeUV( sampler2D envMap, vec3 direction, float mipInt ) {
		float face = getFace( direction );
		float filterInt = max( cubeUV_minMipLevel - mipInt, 0.0 );
		mipInt = max( mipInt, cubeUV_minMipLevel );
		float faceSize = exp2( mipInt );
		highp vec2 uv = getUV( direction, face ) * ( faceSize - 2.0 ) + 1.0;
		if ( face > 2.0 ) {
			uv.y += faceSize;
			face -= 3.0;
		}
		uv.x += face * faceSize;
		uv.x += filterInt * 3.0 * cubeUV_minTileSize;
		uv.y += 4.0 * ( exp2( CUBEUV_MAX_MIP ) - faceSize );
		uv.x *= CUBEUV_TEXEL_WIDTH;
		uv.y *= CUBEUV_TEXEL_HEIGHT;
		#ifdef texture2DGradEXT
			return texture2DGradEXT( envMap, uv, vec2( 0.0 ), vec2( 0.0 ) ).rgb;
		#else
			return texture2D( envMap, uv ).rgb;
		#endif
	}
	#define cubeUV_r0 1.0
	#define cubeUV_m0 - 2.0
	#define cubeUV_r1 0.8
	#define cubeUV_m1 - 1.0
	#define cubeUV_r4 0.4
	#define cubeUV_m4 2.0
	#define cubeUV_r5 0.305
	#define cubeUV_m5 3.0
	#define cubeUV_r6 0.21
	#define cubeUV_m6 4.0
	float roughnessToMip( float roughness ) {
		float mip = 0.0;
		if ( roughness >= cubeUV_r1 ) {
			mip = ( cubeUV_r0 - roughness ) * ( cubeUV_m1 - cubeUV_m0 ) / ( cubeUV_r0 - cubeUV_r1 ) + cubeUV_m0;
		} else if ( roughness >= cubeUV_r4 ) {
			mip = ( cubeUV_r1 - roughness ) * ( cubeUV_m4 - cubeUV_m1 ) / ( cubeUV_r1 - cubeUV_r4 ) + cubeUV_m1;
		} else if ( roughness >= cubeUV_r5 ) {
			mip = ( cubeUV_r4 - roughness ) * ( cubeUV_m5 - cubeUV_m4 ) / ( cubeUV_r4 - cubeUV_r5 ) + cubeUV_m4;
		} else if ( roughness >= cubeUV_r6 ) {
			mip = ( cubeUV_r5 - roughness ) * ( cubeUV_m6 - cubeUV_m5 ) / ( cubeUV_r5 - cubeUV_r6 ) + cubeUV_m5;
		} else {
			mip = - 2.0 * log2( 1.16 * roughness );		}
		return mip;
	}
	vec4 textureCubeUV( sampler2D envMap, vec3 sampleDir, float roughness ) {
		float mip = clamp( roughnessToMip( roughness ), cubeUV_m0, CUBEUV_MAX_MIP );
		float mipF = fract( mip );
		float mipInt = floor( mip );
		vec3 color0 = bilinearCubeUV( envMap, sampleDir, mipInt );
		if ( mipF == 0.0 ) {
			return vec4( color0, 1.0 );
		} else {
			vec3 color1 = bilinearCubeUV( envMap, sampleDir, mipInt + 1.0 );
			return vec4( mix( color0, color1, mipF ), 1.0 );
		}
	}
#endif`,Bh=`vec3 transformedNormal = objectNormal;
#ifdef USE_TANGENT
	vec3 transformedTangent = objectTangent;
#endif
#ifdef USE_BATCHING
	mat3 bm = mat3( batchingMatrix );
	transformedNormal /= vec3( dot( bm[ 0 ], bm[ 0 ] ), dot( bm[ 1 ], bm[ 1 ] ), dot( bm[ 2 ], bm[ 2 ] ) );
	transformedNormal = bm * transformedNormal;
	#ifdef USE_TANGENT
		transformedTangent = bm * transformedTangent;
	#endif
#endif
#ifdef USE_INSTANCING
	mat3 im = mat3( instanceMatrix );
	transformedNormal /= vec3( dot( im[ 0 ], im[ 0 ] ), dot( im[ 1 ], im[ 1 ] ), dot( im[ 2 ], im[ 2 ] ) );
	transformedNormal = im * transformedNormal;
	#ifdef USE_TANGENT
		transformedTangent = im * transformedTangent;
	#endif
#endif
transformedNormal = normalMatrix * transformedNormal;
#ifdef FLIP_SIDED
	transformedNormal = - transformedNormal;
#endif
#ifdef USE_TANGENT
	transformedTangent = ( modelViewMatrix * vec4( transformedTangent, 0.0 ) ).xyz;
	#ifdef FLIP_SIDED
		transformedTangent = - transformedTangent;
	#endif
#endif`,zh=`#ifdef USE_DISPLACEMENTMAP
	uniform sampler2D displacementMap;
	uniform float displacementScale;
	uniform float displacementBias;
#endif`,kh=`#ifdef USE_DISPLACEMENTMAP
	transformed += normalize( objectNormal ) * ( texture2D( displacementMap, vDisplacementMapUv ).x * displacementScale + displacementBias );
#endif`,Gh=`#ifdef USE_EMISSIVEMAP
	vec4 emissiveColor = texture2D( emissiveMap, vEmissiveMapUv );
	#ifdef DECODE_VIDEO_TEXTURE_EMISSIVE
		emissiveColor = sRGBTransferEOTF( emissiveColor );
	#endif
	totalEmissiveRadiance *= emissiveColor.rgb;
#endif`,Hh=`#ifdef USE_EMISSIVEMAP
	uniform sampler2D emissiveMap;
#endif`,Vh="gl_FragColor = linearToOutputTexel( gl_FragColor );",Wh=`vec4 LinearTransferOETF( in vec4 value ) {
	return value;
}
vec4 sRGBTransferEOTF( in vec4 value ) {
	return vec4( mix( pow( value.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), value.rgb * 0.0773993808, vec3( lessThanEqual( value.rgb, vec3( 0.04045 ) ) ) ), value.a );
}
vec4 sRGBTransferOETF( in vec4 value ) {
	return vec4( mix( pow( value.rgb, vec3( 0.41666 ) ) * 1.055 - vec3( 0.055 ), value.rgb * 12.92, vec3( lessThanEqual( value.rgb, vec3( 0.0031308 ) ) ) ), value.a );
}`,Xh=`#ifdef USE_ENVMAP
	#ifdef ENV_WORLDPOS
		vec3 cameraToFrag;
		if ( isOrthographic ) {
			cameraToFrag = normalize( vec3( - viewMatrix[ 0 ][ 2 ], - viewMatrix[ 1 ][ 2 ], - viewMatrix[ 2 ][ 2 ] ) );
		} else {
			cameraToFrag = normalize( vWorldPosition - cameraPosition );
		}
		vec3 worldNormal = inverseTransformDirection( normal, viewMatrix );
		#ifdef ENVMAP_MODE_REFLECTION
			vec3 reflectVec = reflect( cameraToFrag, worldNormal );
		#else
			vec3 reflectVec = refract( cameraToFrag, worldNormal, refractionRatio );
		#endif
	#else
		vec3 reflectVec = vReflect;
	#endif
	#ifdef ENVMAP_TYPE_CUBE
		vec4 envColor = textureCube( envMap, envMapRotation * vec3( flipEnvMap * reflectVec.x, reflectVec.yz ) );
	#else
		vec4 envColor = vec4( 0.0 );
	#endif
	#ifdef ENVMAP_BLENDING_MULTIPLY
		outgoingLight = mix( outgoingLight, outgoingLight * envColor.xyz, specularStrength * reflectivity );
	#elif defined( ENVMAP_BLENDING_MIX )
		outgoingLight = mix( outgoingLight, envColor.xyz, specularStrength * reflectivity );
	#elif defined( ENVMAP_BLENDING_ADD )
		outgoingLight += envColor.xyz * specularStrength * reflectivity;
	#endif
#endif`,qh=`#ifdef USE_ENVMAP
	uniform float envMapIntensity;
	uniform float flipEnvMap;
	uniform mat3 envMapRotation;
	#ifdef ENVMAP_TYPE_CUBE
		uniform samplerCube envMap;
	#else
		uniform sampler2D envMap;
	#endif
	
#endif`,Yh=`#ifdef USE_ENVMAP
	uniform float reflectivity;
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		varying vec3 vWorldPosition;
		uniform float refractionRatio;
	#else
		varying vec3 vReflect;
	#endif
#endif`,Kh=`#ifdef USE_ENVMAP
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		
		varying vec3 vWorldPosition;
	#else
		varying vec3 vReflect;
		uniform float refractionRatio;
	#endif
#endif`,$h=`#ifdef USE_ENVMAP
	#ifdef ENV_WORLDPOS
		vWorldPosition = worldPosition.xyz;
	#else
		vec3 cameraToVertex;
		if ( isOrthographic ) {
			cameraToVertex = normalize( vec3( - viewMatrix[ 0 ][ 2 ], - viewMatrix[ 1 ][ 2 ], - viewMatrix[ 2 ][ 2 ] ) );
		} else {
			cameraToVertex = normalize( worldPosition.xyz - cameraPosition );
		}
		vec3 worldNormal = inverseTransformDirection( transformedNormal, viewMatrix );
		#ifdef ENVMAP_MODE_REFLECTION
			vReflect = reflect( cameraToVertex, worldNormal );
		#else
			vReflect = refract( cameraToVertex, worldNormal, refractionRatio );
		#endif
	#endif
#endif`,Zh=`#ifdef USE_FOG
	vFogDepth = - mvPosition.z;
#endif`,jh=`#ifdef USE_FOG
	varying float vFogDepth;
#endif`,Jh=`#ifdef USE_FOG
	#ifdef FOG_EXP2
		float fogFactor = 1.0 - exp( - fogDensity * fogDensity * vFogDepth * vFogDepth );
	#else
		float fogFactor = smoothstep( fogNear, fogFar, vFogDepth );
	#endif
	gl_FragColor.rgb = mix( gl_FragColor.rgb, fogColor, fogFactor );
#endif`,Qh=`#ifdef USE_FOG
	uniform vec3 fogColor;
	varying float vFogDepth;
	#ifdef FOG_EXP2
		uniform float fogDensity;
	#else
		uniform float fogNear;
		uniform float fogFar;
	#endif
#endif`,ef=`#ifdef USE_GRADIENTMAP
	uniform sampler2D gradientMap;
#endif
vec3 getGradientIrradiance( vec3 normal, vec3 lightDirection ) {
	float dotNL = dot( normal, lightDirection );
	vec2 coord = vec2( dotNL * 0.5 + 0.5, 0.0 );
	#ifdef USE_GRADIENTMAP
		return vec3( texture2D( gradientMap, coord ).r );
	#else
		vec2 fw = fwidth( coord ) * 0.5;
		return mix( vec3( 0.7 ), vec3( 1.0 ), smoothstep( 0.7 - fw.x, 0.7 + fw.x, coord.x ) );
	#endif
}`,tf=`#ifdef USE_LIGHTMAP
	uniform sampler2D lightMap;
	uniform float lightMapIntensity;
#endif`,nf=`LambertMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularStrength = specularStrength;`,sf=`varying vec3 vViewPosition;
struct LambertMaterial {
	vec3 diffuseColor;
	float specularStrength;
};
void RE_Direct_Lambert( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in LambertMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectDiffuse_Lambert( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in LambertMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_Lambert
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Lambert`,rf=`uniform bool receiveShadow;
uniform vec3 ambientLightColor;
#if defined( USE_LIGHT_PROBES )
	uniform vec3 lightProbe[ 9 ];
#endif
vec3 shGetIrradianceAt( in vec3 normal, in vec3 shCoefficients[ 9 ] ) {
	float x = normal.x, y = normal.y, z = normal.z;
	vec3 result = shCoefficients[ 0 ] * 0.886227;
	result += shCoefficients[ 1 ] * 2.0 * 0.511664 * y;
	result += shCoefficients[ 2 ] * 2.0 * 0.511664 * z;
	result += shCoefficients[ 3 ] * 2.0 * 0.511664 * x;
	result += shCoefficients[ 4 ] * 2.0 * 0.429043 * x * y;
	result += shCoefficients[ 5 ] * 2.0 * 0.429043 * y * z;
	result += shCoefficients[ 6 ] * ( 0.743125 * z * z - 0.247708 );
	result += shCoefficients[ 7 ] * 2.0 * 0.429043 * x * z;
	result += shCoefficients[ 8 ] * 0.429043 * ( x * x - y * y );
	return result;
}
vec3 getLightProbeIrradiance( const in vec3 lightProbe[ 9 ], const in vec3 normal ) {
	vec3 worldNormal = inverseTransformDirection( normal, viewMatrix );
	vec3 irradiance = shGetIrradianceAt( worldNormal, lightProbe );
	return irradiance;
}
vec3 getAmbientLightIrradiance( const in vec3 ambientLightColor ) {
	vec3 irradiance = ambientLightColor;
	return irradiance;
}
float getDistanceAttenuation( const in float lightDistance, const in float cutoffDistance, const in float decayExponent ) {
	float distanceFalloff = 1.0 / max( pow( lightDistance, decayExponent ), 0.01 );
	if ( cutoffDistance > 0.0 ) {
		distanceFalloff *= pow2( saturate( 1.0 - pow4( lightDistance / cutoffDistance ) ) );
	}
	return distanceFalloff;
}
float getSpotAttenuation( const in float coneCosine, const in float penumbraCosine, const in float angleCosine ) {
	return smoothstep( coneCosine, penumbraCosine, angleCosine );
}
#if NUM_DIR_LIGHTS > 0
	struct DirectionalLight {
		vec3 direction;
		vec3 color;
	};
	uniform DirectionalLight directionalLights[ NUM_DIR_LIGHTS ];
	void getDirectionalLightInfo( const in DirectionalLight directionalLight, out IncidentLight light ) {
		light.color = directionalLight.color;
		light.direction = directionalLight.direction;
		light.visible = true;
	}
#endif
#if NUM_POINT_LIGHTS > 0
	struct PointLight {
		vec3 position;
		vec3 color;
		float distance;
		float decay;
	};
	uniform PointLight pointLights[ NUM_POINT_LIGHTS ];
	void getPointLightInfo( const in PointLight pointLight, const in vec3 geometryPosition, out IncidentLight light ) {
		vec3 lVector = pointLight.position - geometryPosition;
		light.direction = normalize( lVector );
		float lightDistance = length( lVector );
		light.color = pointLight.color;
		light.color *= getDistanceAttenuation( lightDistance, pointLight.distance, pointLight.decay );
		light.visible = ( light.color != vec3( 0.0 ) );
	}
#endif
#if NUM_SPOT_LIGHTS > 0
	struct SpotLight {
		vec3 position;
		vec3 direction;
		vec3 color;
		float distance;
		float decay;
		float coneCos;
		float penumbraCos;
	};
	uniform SpotLight spotLights[ NUM_SPOT_LIGHTS ];
	void getSpotLightInfo( const in SpotLight spotLight, const in vec3 geometryPosition, out IncidentLight light ) {
		vec3 lVector = spotLight.position - geometryPosition;
		light.direction = normalize( lVector );
		float angleCos = dot( light.direction, spotLight.direction );
		float spotAttenuation = getSpotAttenuation( spotLight.coneCos, spotLight.penumbraCos, angleCos );
		if ( spotAttenuation > 0.0 ) {
			float lightDistance = length( lVector );
			light.color = spotLight.color * spotAttenuation;
			light.color *= getDistanceAttenuation( lightDistance, spotLight.distance, spotLight.decay );
			light.visible = ( light.color != vec3( 0.0 ) );
		} else {
			light.color = vec3( 0.0 );
			light.visible = false;
		}
	}
#endif
#if NUM_RECT_AREA_LIGHTS > 0
	struct RectAreaLight {
		vec3 color;
		vec3 position;
		vec3 halfWidth;
		vec3 halfHeight;
	};
	uniform sampler2D ltc_1;	uniform sampler2D ltc_2;
	uniform RectAreaLight rectAreaLights[ NUM_RECT_AREA_LIGHTS ];
#endif
#if NUM_HEMI_LIGHTS > 0
	struct HemisphereLight {
		vec3 direction;
		vec3 skyColor;
		vec3 groundColor;
	};
	uniform HemisphereLight hemisphereLights[ NUM_HEMI_LIGHTS ];
	vec3 getHemisphereLightIrradiance( const in HemisphereLight hemiLight, const in vec3 normal ) {
		float dotNL = dot( normal, hemiLight.direction );
		float hemiDiffuseWeight = 0.5 * dotNL + 0.5;
		vec3 irradiance = mix( hemiLight.groundColor, hemiLight.skyColor, hemiDiffuseWeight );
		return irradiance;
	}
#endif`,af=`#ifdef USE_ENVMAP
	vec3 getIBLIrradiance( const in vec3 normal ) {
		#ifdef ENVMAP_TYPE_CUBE_UV
			vec3 worldNormal = inverseTransformDirection( normal, viewMatrix );
			vec4 envMapColor = textureCubeUV( envMap, envMapRotation * worldNormal, 1.0 );
			return PI * envMapColor.rgb * envMapIntensity;
		#else
			return vec3( 0.0 );
		#endif
	}
	vec3 getIBLRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness ) {
		#ifdef ENVMAP_TYPE_CUBE_UV
			vec3 reflectVec = reflect( - viewDir, normal );
			reflectVec = normalize( mix( reflectVec, normal, roughness * roughness) );
			reflectVec = inverseTransformDirection( reflectVec, viewMatrix );
			vec4 envMapColor = textureCubeUV( envMap, envMapRotation * reflectVec, roughness );
			return envMapColor.rgb * envMapIntensity;
		#else
			return vec3( 0.0 );
		#endif
	}
	#ifdef USE_ANISOTROPY
		vec3 getIBLAnisotropyRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness, const in vec3 bitangent, const in float anisotropy ) {
			#ifdef ENVMAP_TYPE_CUBE_UV
				vec3 bentNormal = cross( bitangent, viewDir );
				bentNormal = normalize( cross( bentNormal, bitangent ) );
				bentNormal = normalize( mix( bentNormal, normal, pow2( pow2( 1.0 - anisotropy * ( 1.0 - roughness ) ) ) ) );
				return getIBLRadiance( viewDir, bentNormal, roughness );
			#else
				return vec3( 0.0 );
			#endif
		}
	#endif
#endif`,of=`ToonMaterial material;
material.diffuseColor = diffuseColor.rgb;`,lf=`varying vec3 vViewPosition;
struct ToonMaterial {
	vec3 diffuseColor;
};
void RE_Direct_Toon( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in ToonMaterial material, inout ReflectedLight reflectedLight ) {
	vec3 irradiance = getGradientIrradiance( geometryNormal, directLight.direction ) * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectDiffuse_Toon( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in ToonMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_Toon
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Toon`,cf=`BlinnPhongMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularColor = specular;
material.specularShininess = shininess;
material.specularStrength = specularStrength;`,uf=`varying vec3 vViewPosition;
struct BlinnPhongMaterial {
	vec3 diffuseColor;
	vec3 specularColor;
	float specularShininess;
	float specularStrength;
};
void RE_Direct_BlinnPhong( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in BlinnPhongMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
	reflectedLight.directSpecular += irradiance * BRDF_BlinnPhong( directLight.direction, geometryViewDir, geometryNormal, material.specularColor, material.specularShininess ) * material.specularStrength;
}
void RE_IndirectDiffuse_BlinnPhong( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in BlinnPhongMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_BlinnPhong
#define RE_IndirectDiffuse		RE_IndirectDiffuse_BlinnPhong`,hf=`PhysicalMaterial material;
material.diffuseColor = diffuseColor.rgb * ( 1.0 - metalnessFactor );
vec3 dxy = max( abs( dFdx( nonPerturbedNormal ) ), abs( dFdy( nonPerturbedNormal ) ) );
float geometryRoughness = max( max( dxy.x, dxy.y ), dxy.z );
material.roughness = max( roughnessFactor, 0.0525 );material.roughness += geometryRoughness;
material.roughness = min( material.roughness, 1.0 );
#ifdef IOR
	material.ior = ior;
	#ifdef USE_SPECULAR
		float specularIntensityFactor = specularIntensity;
		vec3 specularColorFactor = specularColor;
		#ifdef USE_SPECULAR_COLORMAP
			specularColorFactor *= texture2D( specularColorMap, vSpecularColorMapUv ).rgb;
		#endif
		#ifdef USE_SPECULAR_INTENSITYMAP
			specularIntensityFactor *= texture2D( specularIntensityMap, vSpecularIntensityMapUv ).a;
		#endif
		material.specularF90 = mix( specularIntensityFactor, 1.0, metalnessFactor );
	#else
		float specularIntensityFactor = 1.0;
		vec3 specularColorFactor = vec3( 1.0 );
		material.specularF90 = 1.0;
	#endif
	material.specularColor = mix( min( pow2( ( material.ior - 1.0 ) / ( material.ior + 1.0 ) ) * specularColorFactor, vec3( 1.0 ) ) * specularIntensityFactor, diffuseColor.rgb, metalnessFactor );
#else
	material.specularColor = mix( vec3( 0.04 ), diffuseColor.rgb, metalnessFactor );
	material.specularF90 = 1.0;
#endif
#ifdef USE_CLEARCOAT
	material.clearcoat = clearcoat;
	material.clearcoatRoughness = clearcoatRoughness;
	material.clearcoatF0 = vec3( 0.04 );
	material.clearcoatF90 = 1.0;
	#ifdef USE_CLEARCOATMAP
		material.clearcoat *= texture2D( clearcoatMap, vClearcoatMapUv ).x;
	#endif
	#ifdef USE_CLEARCOAT_ROUGHNESSMAP
		material.clearcoatRoughness *= texture2D( clearcoatRoughnessMap, vClearcoatRoughnessMapUv ).y;
	#endif
	material.clearcoat = saturate( material.clearcoat );	material.clearcoatRoughness = max( material.clearcoatRoughness, 0.0525 );
	material.clearcoatRoughness += geometryRoughness;
	material.clearcoatRoughness = min( material.clearcoatRoughness, 1.0 );
#endif
#ifdef USE_DISPERSION
	material.dispersion = dispersion;
#endif
#ifdef USE_IRIDESCENCE
	material.iridescence = iridescence;
	material.iridescenceIOR = iridescenceIOR;
	#ifdef USE_IRIDESCENCEMAP
		material.iridescence *= texture2D( iridescenceMap, vIridescenceMapUv ).r;
	#endif
	#ifdef USE_IRIDESCENCE_THICKNESSMAP
		material.iridescenceThickness = (iridescenceThicknessMaximum - iridescenceThicknessMinimum) * texture2D( iridescenceThicknessMap, vIridescenceThicknessMapUv ).g + iridescenceThicknessMinimum;
	#else
		material.iridescenceThickness = iridescenceThicknessMaximum;
	#endif
#endif
#ifdef USE_SHEEN
	material.sheenColor = sheenColor;
	#ifdef USE_SHEEN_COLORMAP
		material.sheenColor *= texture2D( sheenColorMap, vSheenColorMapUv ).rgb;
	#endif
	material.sheenRoughness = clamp( sheenRoughness, 0.07, 1.0 );
	#ifdef USE_SHEEN_ROUGHNESSMAP
		material.sheenRoughness *= texture2D( sheenRoughnessMap, vSheenRoughnessMapUv ).a;
	#endif
#endif
#ifdef USE_ANISOTROPY
	#ifdef USE_ANISOTROPYMAP
		mat2 anisotropyMat = mat2( anisotropyVector.x, anisotropyVector.y, - anisotropyVector.y, anisotropyVector.x );
		vec3 anisotropyPolar = texture2D( anisotropyMap, vAnisotropyMapUv ).rgb;
		vec2 anisotropyV = anisotropyMat * normalize( 2.0 * anisotropyPolar.rg - vec2( 1.0 ) ) * anisotropyPolar.b;
	#else
		vec2 anisotropyV = anisotropyVector;
	#endif
	material.anisotropy = length( anisotropyV );
	if( material.anisotropy == 0.0 ) {
		anisotropyV = vec2( 1.0, 0.0 );
	} else {
		anisotropyV /= material.anisotropy;
		material.anisotropy = saturate( material.anisotropy );
	}
	material.alphaT = mix( pow2( material.roughness ), 1.0, pow2( material.anisotropy ) );
	material.anisotropyT = tbn[ 0 ] * anisotropyV.x + tbn[ 1 ] * anisotropyV.y;
	material.anisotropyB = tbn[ 1 ] * anisotropyV.x - tbn[ 0 ] * anisotropyV.y;
#endif`,ff=`struct PhysicalMaterial {
	vec3 diffuseColor;
	float roughness;
	vec3 specularColor;
	float specularF90;
	float dispersion;
	#ifdef USE_CLEARCOAT
		float clearcoat;
		float clearcoatRoughness;
		vec3 clearcoatF0;
		float clearcoatF90;
	#endif
	#ifdef USE_IRIDESCENCE
		float iridescence;
		float iridescenceIOR;
		float iridescenceThickness;
		vec3 iridescenceFresnel;
		vec3 iridescenceF0;
	#endif
	#ifdef USE_SHEEN
		vec3 sheenColor;
		float sheenRoughness;
	#endif
	#ifdef IOR
		float ior;
	#endif
	#ifdef USE_TRANSMISSION
		float transmission;
		float transmissionAlpha;
		float thickness;
		float attenuationDistance;
		vec3 attenuationColor;
	#endif
	#ifdef USE_ANISOTROPY
		float anisotropy;
		float alphaT;
		vec3 anisotropyT;
		vec3 anisotropyB;
	#endif
};
vec3 clearcoatSpecularDirect = vec3( 0.0 );
vec3 clearcoatSpecularIndirect = vec3( 0.0 );
vec3 sheenSpecularDirect = vec3( 0.0 );
vec3 sheenSpecularIndirect = vec3(0.0 );
vec3 Schlick_to_F0( const in vec3 f, const in float f90, const in float dotVH ) {
    float x = clamp( 1.0 - dotVH, 0.0, 1.0 );
    float x2 = x * x;
    float x5 = clamp( x * x2 * x2, 0.0, 0.9999 );
    return ( f - vec3( f90 ) * x5 ) / ( 1.0 - x5 );
}
float V_GGX_SmithCorrelated( const in float alpha, const in float dotNL, const in float dotNV ) {
	float a2 = pow2( alpha );
	float gv = dotNL * sqrt( a2 + ( 1.0 - a2 ) * pow2( dotNV ) );
	float gl = dotNV * sqrt( a2 + ( 1.0 - a2 ) * pow2( dotNL ) );
	return 0.5 / max( gv + gl, EPSILON );
}
float D_GGX( const in float alpha, const in float dotNH ) {
	float a2 = pow2( alpha );
	float denom = pow2( dotNH ) * ( a2 - 1.0 ) + 1.0;
	return RECIPROCAL_PI * a2 / pow2( denom );
}
#ifdef USE_ANISOTROPY
	float V_GGX_SmithCorrelated_Anisotropic( const in float alphaT, const in float alphaB, const in float dotTV, const in float dotBV, const in float dotTL, const in float dotBL, const in float dotNV, const in float dotNL ) {
		float gv = dotNL * length( vec3( alphaT * dotTV, alphaB * dotBV, dotNV ) );
		float gl = dotNV * length( vec3( alphaT * dotTL, alphaB * dotBL, dotNL ) );
		float v = 0.5 / ( gv + gl );
		return saturate(v);
	}
	float D_GGX_Anisotropic( const in float alphaT, const in float alphaB, const in float dotNH, const in float dotTH, const in float dotBH ) {
		float a2 = alphaT * alphaB;
		highp vec3 v = vec3( alphaB * dotTH, alphaT * dotBH, a2 * dotNH );
		highp float v2 = dot( v, v );
		float w2 = a2 / v2;
		return RECIPROCAL_PI * a2 * pow2 ( w2 );
	}
#endif
#ifdef USE_CLEARCOAT
	vec3 BRDF_GGX_Clearcoat( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in PhysicalMaterial material) {
		vec3 f0 = material.clearcoatF0;
		float f90 = material.clearcoatF90;
		float roughness = material.clearcoatRoughness;
		float alpha = pow2( roughness );
		vec3 halfDir = normalize( lightDir + viewDir );
		float dotNL = saturate( dot( normal, lightDir ) );
		float dotNV = saturate( dot( normal, viewDir ) );
		float dotNH = saturate( dot( normal, halfDir ) );
		float dotVH = saturate( dot( viewDir, halfDir ) );
		vec3 F = F_Schlick( f0, f90, dotVH );
		float V = V_GGX_SmithCorrelated( alpha, dotNL, dotNV );
		float D = D_GGX( alpha, dotNH );
		return F * ( V * D );
	}
#endif
vec3 BRDF_GGX( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in PhysicalMaterial material ) {
	vec3 f0 = material.specularColor;
	float f90 = material.specularF90;
	float roughness = material.roughness;
	float alpha = pow2( roughness );
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNL = saturate( dot( normal, lightDir ) );
	float dotNV = saturate( dot( normal, viewDir ) );
	float dotNH = saturate( dot( normal, halfDir ) );
	float dotVH = saturate( dot( viewDir, halfDir ) );
	vec3 F = F_Schlick( f0, f90, dotVH );
	#ifdef USE_IRIDESCENCE
		F = mix( F, material.iridescenceFresnel, material.iridescence );
	#endif
	#ifdef USE_ANISOTROPY
		float dotTL = dot( material.anisotropyT, lightDir );
		float dotTV = dot( material.anisotropyT, viewDir );
		float dotTH = dot( material.anisotropyT, halfDir );
		float dotBL = dot( material.anisotropyB, lightDir );
		float dotBV = dot( material.anisotropyB, viewDir );
		float dotBH = dot( material.anisotropyB, halfDir );
		float V = V_GGX_SmithCorrelated_Anisotropic( material.alphaT, alpha, dotTV, dotBV, dotTL, dotBL, dotNV, dotNL );
		float D = D_GGX_Anisotropic( material.alphaT, alpha, dotNH, dotTH, dotBH );
	#else
		float V = V_GGX_SmithCorrelated( alpha, dotNL, dotNV );
		float D = D_GGX( alpha, dotNH );
	#endif
	return F * ( V * D );
}
vec2 LTC_Uv( const in vec3 N, const in vec3 V, const in float roughness ) {
	const float LUT_SIZE = 64.0;
	const float LUT_SCALE = ( LUT_SIZE - 1.0 ) / LUT_SIZE;
	const float LUT_BIAS = 0.5 / LUT_SIZE;
	float dotNV = saturate( dot( N, V ) );
	vec2 uv = vec2( roughness, sqrt( 1.0 - dotNV ) );
	uv = uv * LUT_SCALE + LUT_BIAS;
	return uv;
}
float LTC_ClippedSphereFormFactor( const in vec3 f ) {
	float l = length( f );
	return max( ( l * l + f.z ) / ( l + 1.0 ), 0.0 );
}
vec3 LTC_EdgeVectorFormFactor( const in vec3 v1, const in vec3 v2 ) {
	float x = dot( v1, v2 );
	float y = abs( x );
	float a = 0.8543985 + ( 0.4965155 + 0.0145206 * y ) * y;
	float b = 3.4175940 + ( 4.1616724 + y ) * y;
	float v = a / b;
	float theta_sintheta = ( x > 0.0 ) ? v : 0.5 * inversesqrt( max( 1.0 - x * x, 1e-7 ) ) - v;
	return cross( v1, v2 ) * theta_sintheta;
}
vec3 LTC_Evaluate( const in vec3 N, const in vec3 V, const in vec3 P, const in mat3 mInv, const in vec3 rectCoords[ 4 ] ) {
	vec3 v1 = rectCoords[ 1 ] - rectCoords[ 0 ];
	vec3 v2 = rectCoords[ 3 ] - rectCoords[ 0 ];
	vec3 lightNormal = cross( v1, v2 );
	if( dot( lightNormal, P - rectCoords[ 0 ] ) < 0.0 ) return vec3( 0.0 );
	vec3 T1, T2;
	T1 = normalize( V - N * dot( V, N ) );
	T2 = - cross( N, T1 );
	mat3 mat = mInv * transposeMat3( mat3( T1, T2, N ) );
	vec3 coords[ 4 ];
	coords[ 0 ] = mat * ( rectCoords[ 0 ] - P );
	coords[ 1 ] = mat * ( rectCoords[ 1 ] - P );
	coords[ 2 ] = mat * ( rectCoords[ 2 ] - P );
	coords[ 3 ] = mat * ( rectCoords[ 3 ] - P );
	coords[ 0 ] = normalize( coords[ 0 ] );
	coords[ 1 ] = normalize( coords[ 1 ] );
	coords[ 2 ] = normalize( coords[ 2 ] );
	coords[ 3 ] = normalize( coords[ 3 ] );
	vec3 vectorFormFactor = vec3( 0.0 );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 0 ], coords[ 1 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 1 ], coords[ 2 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 2 ], coords[ 3 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 3 ], coords[ 0 ] );
	float result = LTC_ClippedSphereFormFactor( vectorFormFactor );
	return vec3( result );
}
#if defined( USE_SHEEN )
float D_Charlie( float roughness, float dotNH ) {
	float alpha = pow2( roughness );
	float invAlpha = 1.0 / alpha;
	float cos2h = dotNH * dotNH;
	float sin2h = max( 1.0 - cos2h, 0.0078125 );
	return ( 2.0 + invAlpha ) * pow( sin2h, invAlpha * 0.5 ) / ( 2.0 * PI );
}
float V_Neubelt( float dotNV, float dotNL ) {
	return saturate( 1.0 / ( 4.0 * ( dotNL + dotNV - dotNL * dotNV ) ) );
}
vec3 BRDF_Sheen( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, vec3 sheenColor, const in float sheenRoughness ) {
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNL = saturate( dot( normal, lightDir ) );
	float dotNV = saturate( dot( normal, viewDir ) );
	float dotNH = saturate( dot( normal, halfDir ) );
	float D = D_Charlie( sheenRoughness, dotNH );
	float V = V_Neubelt( dotNV, dotNL );
	return sheenColor * ( D * V );
}
#endif
float IBLSheenBRDF( const in vec3 normal, const in vec3 viewDir, const in float roughness ) {
	float dotNV = saturate( dot( normal, viewDir ) );
	float r2 = roughness * roughness;
	float a = roughness < 0.25 ? -339.2 * r2 + 161.4 * roughness - 25.9 : -8.48 * r2 + 14.3 * roughness - 9.95;
	float b = roughness < 0.25 ? 44.0 * r2 - 23.7 * roughness + 3.26 : 1.97 * r2 - 3.27 * roughness + 0.72;
	float DG = exp( a * dotNV + b ) + ( roughness < 0.25 ? 0.0 : 0.1 * ( roughness - 0.25 ) );
	return saturate( DG * RECIPROCAL_PI );
}
vec2 DFGApprox( const in vec3 normal, const in vec3 viewDir, const in float roughness ) {
	float dotNV = saturate( dot( normal, viewDir ) );
	const vec4 c0 = vec4( - 1, - 0.0275, - 0.572, 0.022 );
	const vec4 c1 = vec4( 1, 0.0425, 1.04, - 0.04 );
	vec4 r = roughness * c0 + c1;
	float a004 = min( r.x * r.x, exp2( - 9.28 * dotNV ) ) * r.x + r.y;
	vec2 fab = vec2( - 1.04, 1.04 ) * a004 + r.zw;
	return fab;
}
vec3 EnvironmentBRDF( const in vec3 normal, const in vec3 viewDir, const in vec3 specularColor, const in float specularF90, const in float roughness ) {
	vec2 fab = DFGApprox( normal, viewDir, roughness );
	return specularColor * fab.x + specularF90 * fab.y;
}
#ifdef USE_IRIDESCENCE
void computeMultiscatteringIridescence( const in vec3 normal, const in vec3 viewDir, const in vec3 specularColor, const in float specularF90, const in float iridescence, const in vec3 iridescenceF0, const in float roughness, inout vec3 singleScatter, inout vec3 multiScatter ) {
#else
void computeMultiscattering( const in vec3 normal, const in vec3 viewDir, const in vec3 specularColor, const in float specularF90, const in float roughness, inout vec3 singleScatter, inout vec3 multiScatter ) {
#endif
	vec2 fab = DFGApprox( normal, viewDir, roughness );
	#ifdef USE_IRIDESCENCE
		vec3 Fr = mix( specularColor, iridescenceF0, iridescence );
	#else
		vec3 Fr = specularColor;
	#endif
	vec3 FssEss = Fr * fab.x + specularF90 * fab.y;
	float Ess = fab.x + fab.y;
	float Ems = 1.0 - Ess;
	vec3 Favg = Fr + ( 1.0 - Fr ) * 0.047619;	vec3 Fms = FssEss * Favg / ( 1.0 - Ems * Favg );
	singleScatter += FssEss;
	multiScatter += Fms * Ems;
}
#if NUM_RECT_AREA_LIGHTS > 0
	void RE_Direct_RectArea_Physical( const in RectAreaLight rectAreaLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
		vec3 normal = geometryNormal;
		vec3 viewDir = geometryViewDir;
		vec3 position = geometryPosition;
		vec3 lightPos = rectAreaLight.position;
		vec3 halfWidth = rectAreaLight.halfWidth;
		vec3 halfHeight = rectAreaLight.halfHeight;
		vec3 lightColor = rectAreaLight.color;
		float roughness = material.roughness;
		vec3 rectCoords[ 4 ];
		rectCoords[ 0 ] = lightPos + halfWidth - halfHeight;		rectCoords[ 1 ] = lightPos - halfWidth - halfHeight;
		rectCoords[ 2 ] = lightPos - halfWidth + halfHeight;
		rectCoords[ 3 ] = lightPos + halfWidth + halfHeight;
		vec2 uv = LTC_Uv( normal, viewDir, roughness );
		vec4 t1 = texture2D( ltc_1, uv );
		vec4 t2 = texture2D( ltc_2, uv );
		mat3 mInv = mat3(
			vec3( t1.x, 0, t1.y ),
			vec3(    0, 1,    0 ),
			vec3( t1.z, 0, t1.w )
		);
		vec3 fresnel = ( material.specularColor * t2.x + ( vec3( 1.0 ) - material.specularColor ) * t2.y );
		reflectedLight.directSpecular += lightColor * fresnel * LTC_Evaluate( normal, viewDir, position, mInv, rectCoords );
		reflectedLight.directDiffuse += lightColor * material.diffuseColor * LTC_Evaluate( normal, viewDir, position, mat3( 1.0 ), rectCoords );
	}
#endif
void RE_Direct_Physical( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	#ifdef USE_CLEARCOAT
		float dotNLcc = saturate( dot( geometryClearcoatNormal, directLight.direction ) );
		vec3 ccIrradiance = dotNLcc * directLight.color;
		clearcoatSpecularDirect += ccIrradiance * BRDF_GGX_Clearcoat( directLight.direction, geometryViewDir, geometryClearcoatNormal, material );
	#endif
	#ifdef USE_SHEEN
		sheenSpecularDirect += irradiance * BRDF_Sheen( directLight.direction, geometryViewDir, geometryNormal, material.sheenColor, material.sheenRoughness );
	#endif
	reflectedLight.directSpecular += irradiance * BRDF_GGX( directLight.direction, geometryViewDir, geometryNormal, material );
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectDiffuse_Physical( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectSpecular_Physical( const in vec3 radiance, const in vec3 irradiance, const in vec3 clearcoatRadiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight) {
	#ifdef USE_CLEARCOAT
		clearcoatSpecularIndirect += clearcoatRadiance * EnvironmentBRDF( geometryClearcoatNormal, geometryViewDir, material.clearcoatF0, material.clearcoatF90, material.clearcoatRoughness );
	#endif
	#ifdef USE_SHEEN
		sheenSpecularIndirect += irradiance * material.sheenColor * IBLSheenBRDF( geometryNormal, geometryViewDir, material.sheenRoughness );
	#endif
	vec3 singleScattering = vec3( 0.0 );
	vec3 multiScattering = vec3( 0.0 );
	vec3 cosineWeightedIrradiance = irradiance * RECIPROCAL_PI;
	#ifdef USE_IRIDESCENCE
		computeMultiscatteringIridescence( geometryNormal, geometryViewDir, material.specularColor, material.specularF90, material.iridescence, material.iridescenceFresnel, material.roughness, singleScattering, multiScattering );
	#else
		computeMultiscattering( geometryNormal, geometryViewDir, material.specularColor, material.specularF90, material.roughness, singleScattering, multiScattering );
	#endif
	vec3 totalScattering = singleScattering + multiScattering;
	vec3 diffuse = material.diffuseColor * ( 1.0 - max( max( totalScattering.r, totalScattering.g ), totalScattering.b ) );
	reflectedLight.indirectSpecular += radiance * singleScattering;
	reflectedLight.indirectSpecular += multiScattering * cosineWeightedIrradiance;
	reflectedLight.indirectDiffuse += diffuse * cosineWeightedIrradiance;
}
#define RE_Direct				RE_Direct_Physical
#define RE_Direct_RectArea		RE_Direct_RectArea_Physical
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Physical
#define RE_IndirectSpecular		RE_IndirectSpecular_Physical
float computeSpecularOcclusion( const in float dotNV, const in float ambientOcclusion, const in float roughness ) {
	return saturate( pow( dotNV + ambientOcclusion, exp2( - 16.0 * roughness - 1.0 ) ) - 1.0 + ambientOcclusion );
}`,df=`
vec3 geometryPosition = - vViewPosition;
vec3 geometryNormal = normal;
vec3 geometryViewDir = ( isOrthographic ) ? vec3( 0, 0, 1 ) : normalize( vViewPosition );
vec3 geometryClearcoatNormal = vec3( 0.0 );
#ifdef USE_CLEARCOAT
	geometryClearcoatNormal = clearcoatNormal;
#endif
#ifdef USE_IRIDESCENCE
	float dotNVi = saturate( dot( normal, geometryViewDir ) );
	if ( material.iridescenceThickness == 0.0 ) {
		material.iridescence = 0.0;
	} else {
		material.iridescence = saturate( material.iridescence );
	}
	if ( material.iridescence > 0.0 ) {
		material.iridescenceFresnel = evalIridescence( 1.0, material.iridescenceIOR, dotNVi, material.iridescenceThickness, material.specularColor );
		material.iridescenceF0 = Schlick_to_F0( material.iridescenceFresnel, 1.0, dotNVi );
	}
#endif
IncidentLight directLight;
#if ( NUM_POINT_LIGHTS > 0 ) && defined( RE_Direct )
	PointLight pointLight;
	#if defined( USE_SHADOWMAP ) && NUM_POINT_LIGHT_SHADOWS > 0
	PointLightShadow pointLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_POINT_LIGHTS; i ++ ) {
		pointLight = pointLights[ i ];
		getPointLightInfo( pointLight, geometryPosition, directLight );
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_POINT_LIGHT_SHADOWS )
		pointLightShadow = pointLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getPointShadow( pointShadowMap[ i ], pointLightShadow.shadowMapSize, pointLightShadow.shadowIntensity, pointLightShadow.shadowBias, pointLightShadow.shadowRadius, vPointShadowCoord[ i ], pointLightShadow.shadowCameraNear, pointLightShadow.shadowCameraFar ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_SPOT_LIGHTS > 0 ) && defined( RE_Direct )
	SpotLight spotLight;
	vec4 spotColor;
	vec3 spotLightCoord;
	bool inSpotLightMap;
	#if defined( USE_SHADOWMAP ) && NUM_SPOT_LIGHT_SHADOWS > 0
	SpotLightShadow spotLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHTS; i ++ ) {
		spotLight = spotLights[ i ];
		getSpotLightInfo( spotLight, geometryPosition, directLight );
		#if ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS )
		#define SPOT_LIGHT_MAP_INDEX UNROLLED_LOOP_INDEX
		#elif ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
		#define SPOT_LIGHT_MAP_INDEX NUM_SPOT_LIGHT_MAPS
		#else
		#define SPOT_LIGHT_MAP_INDEX ( UNROLLED_LOOP_INDEX - NUM_SPOT_LIGHT_SHADOWS + NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS )
		#endif
		#if ( SPOT_LIGHT_MAP_INDEX < NUM_SPOT_LIGHT_MAPS )
			spotLightCoord = vSpotLightCoord[ i ].xyz / vSpotLightCoord[ i ].w;
			inSpotLightMap = all( lessThan( abs( spotLightCoord * 2. - 1. ), vec3( 1.0 ) ) );
			spotColor = texture2D( spotLightMap[ SPOT_LIGHT_MAP_INDEX ], spotLightCoord.xy );
			directLight.color = inSpotLightMap ? directLight.color * spotColor.rgb : directLight.color;
		#endif
		#undef SPOT_LIGHT_MAP_INDEX
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
		spotLightShadow = spotLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getShadow( spotShadowMap[ i ], spotLightShadow.shadowMapSize, spotLightShadow.shadowIntensity, spotLightShadow.shadowBias, spotLightShadow.shadowRadius, vSpotLightCoord[ i ] ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_DIR_LIGHTS > 0 ) && defined( RE_Direct )
	DirectionalLight directionalLight;
	#if defined( USE_SHADOWMAP ) && NUM_DIR_LIGHT_SHADOWS > 0
	DirectionalLightShadow directionalLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_DIR_LIGHTS; i ++ ) {
		directionalLight = directionalLights[ i ];
		getDirectionalLightInfo( directionalLight, directLight );
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_DIR_LIGHT_SHADOWS )
		directionalLightShadow = directionalLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getShadow( directionalShadowMap[ i ], directionalLightShadow.shadowMapSize, directionalLightShadow.shadowIntensity, directionalLightShadow.shadowBias, directionalLightShadow.shadowRadius, vDirectionalShadowCoord[ i ] ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_RECT_AREA_LIGHTS > 0 ) && defined( RE_Direct_RectArea )
	RectAreaLight rectAreaLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_RECT_AREA_LIGHTS; i ++ ) {
		rectAreaLight = rectAreaLights[ i ];
		RE_Direct_RectArea( rectAreaLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if defined( RE_IndirectDiffuse )
	vec3 iblIrradiance = vec3( 0.0 );
	vec3 irradiance = getAmbientLightIrradiance( ambientLightColor );
	#if defined( USE_LIGHT_PROBES )
		irradiance += getLightProbeIrradiance( lightProbe, geometryNormal );
	#endif
	#if ( NUM_HEMI_LIGHTS > 0 )
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_HEMI_LIGHTS; i ++ ) {
			irradiance += getHemisphereLightIrradiance( hemisphereLights[ i ], geometryNormal );
		}
		#pragma unroll_loop_end
	#endif
#endif
#if defined( RE_IndirectSpecular )
	vec3 radiance = vec3( 0.0 );
	vec3 clearcoatRadiance = vec3( 0.0 );
#endif`,pf=`#if defined( RE_IndirectDiffuse )
	#ifdef USE_LIGHTMAP
		vec4 lightMapTexel = texture2D( lightMap, vLightMapUv );
		vec3 lightMapIrradiance = lightMapTexel.rgb * lightMapIntensity;
		irradiance += lightMapIrradiance;
	#endif
	#if defined( USE_ENVMAP ) && defined( STANDARD ) && defined( ENVMAP_TYPE_CUBE_UV )
		iblIrradiance += getIBLIrradiance( geometryNormal );
	#endif
#endif
#if defined( USE_ENVMAP ) && defined( RE_IndirectSpecular )
	#ifdef USE_ANISOTROPY
		radiance += getIBLAnisotropyRadiance( geometryViewDir, geometryNormal, material.roughness, material.anisotropyB, material.anisotropy );
	#else
		radiance += getIBLRadiance( geometryViewDir, geometryNormal, material.roughness );
	#endif
	#ifdef USE_CLEARCOAT
		clearcoatRadiance += getIBLRadiance( geometryViewDir, geometryClearcoatNormal, material.clearcoatRoughness );
	#endif
#endif`,mf=`#if defined( RE_IndirectDiffuse )
	RE_IndirectDiffuse( irradiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif
#if defined( RE_IndirectSpecular )
	RE_IndirectSpecular( radiance, iblIrradiance, clearcoatRadiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif`,gf=`#if defined( USE_LOGDEPTHBUF )
	gl_FragDepth = vIsPerspective == 0.0 ? gl_FragCoord.z : log2( vFragDepth ) * logDepthBufFC * 0.5;
#endif`,_f=`#if defined( USE_LOGDEPTHBUF )
	uniform float logDepthBufFC;
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,vf=`#ifdef USE_LOGDEPTHBUF
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,xf=`#ifdef USE_LOGDEPTHBUF
	vFragDepth = 1.0 + gl_Position.w;
	vIsPerspective = float( isPerspectiveMatrix( projectionMatrix ) );
#endif`,Mf=`#ifdef USE_MAP
	vec4 sampledDiffuseColor = texture2D( map, vMapUv );
	#ifdef DECODE_VIDEO_TEXTURE
		sampledDiffuseColor = sRGBTransferEOTF( sampledDiffuseColor );
	#endif
	diffuseColor *= sampledDiffuseColor;
#endif`,Sf=`#ifdef USE_MAP
	uniform sampler2D map;
#endif`,yf=`#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
	#if defined( USE_POINTS_UV )
		vec2 uv = vUv;
	#else
		vec2 uv = ( uvTransform * vec3( gl_PointCoord.x, 1.0 - gl_PointCoord.y, 1 ) ).xy;
	#endif
#endif
#ifdef USE_MAP
	diffuseColor *= texture2D( map, uv );
#endif
#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, uv ).g;
#endif`,Ef=`#if defined( USE_POINTS_UV )
	varying vec2 vUv;
#else
	#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
		uniform mat3 uvTransform;
	#endif
#endif
#ifdef USE_MAP
	uniform sampler2D map;
#endif
#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,Tf=`float metalnessFactor = metalness;
#ifdef USE_METALNESSMAP
	vec4 texelMetalness = texture2D( metalnessMap, vMetalnessMapUv );
	metalnessFactor *= texelMetalness.b;
#endif`,Af=`#ifdef USE_METALNESSMAP
	uniform sampler2D metalnessMap;
#endif`,bf=`#ifdef USE_INSTANCING_MORPH
	float morphTargetInfluences[ MORPHTARGETS_COUNT ];
	float morphTargetBaseInfluence = texelFetch( morphTexture, ivec2( 0, gl_InstanceID ), 0 ).r;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		morphTargetInfluences[i] =  texelFetch( morphTexture, ivec2( i + 1, gl_InstanceID ), 0 ).r;
	}
#endif`,wf=`#if defined( USE_MORPHCOLORS )
	vColor *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		#if defined( USE_COLOR_ALPHA )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ) * morphTargetInfluences[ i ];
		#elif defined( USE_COLOR )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ).rgb * morphTargetInfluences[ i ];
		#endif
	}
#endif`,Rf=`#ifdef USE_MORPHNORMALS
	objectNormal *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) objectNormal += getMorph( gl_VertexID, i, 1 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,Cf=`#ifdef USE_MORPHTARGETS
	#ifndef USE_INSTANCING_MORPH
		uniform float morphTargetBaseInfluence;
		uniform float morphTargetInfluences[ MORPHTARGETS_COUNT ];
	#endif
	uniform sampler2DArray morphTargetsTexture;
	uniform ivec2 morphTargetsTextureSize;
	vec4 getMorph( const in int vertexIndex, const in int morphTargetIndex, const in int offset ) {
		int texelIndex = vertexIndex * MORPHTARGETS_TEXTURE_STRIDE + offset;
		int y = texelIndex / morphTargetsTextureSize.x;
		int x = texelIndex - y * morphTargetsTextureSize.x;
		ivec3 morphUV = ivec3( x, y, morphTargetIndex );
		return texelFetch( morphTargetsTexture, morphUV, 0 );
	}
#endif`,Pf=`#ifdef USE_MORPHTARGETS
	transformed *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) transformed += getMorph( gl_VertexID, i, 0 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,Df=`float faceDirection = gl_FrontFacing ? 1.0 : - 1.0;
#ifdef FLAT_SHADED
	vec3 fdx = dFdx( vViewPosition );
	vec3 fdy = dFdy( vViewPosition );
	vec3 normal = normalize( cross( fdx, fdy ) );
#else
	vec3 normal = normalize( vNormal );
	#ifdef DOUBLE_SIDED
		normal *= faceDirection;
	#endif
#endif
#if defined( USE_NORMALMAP_TANGENTSPACE ) || defined( USE_CLEARCOAT_NORMALMAP ) || defined( USE_ANISOTROPY )
	#ifdef USE_TANGENT
		mat3 tbn = mat3( normalize( vTangent ), normalize( vBitangent ), normal );
	#else
		mat3 tbn = getTangentFrame( - vViewPosition, normal,
		#if defined( USE_NORMALMAP )
			vNormalMapUv
		#elif defined( USE_CLEARCOAT_NORMALMAP )
			vClearcoatNormalMapUv
		#else
			vUv
		#endif
		);
	#endif
	#if defined( DOUBLE_SIDED ) && ! defined( FLAT_SHADED )
		tbn[0] *= faceDirection;
		tbn[1] *= faceDirection;
	#endif
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	#ifdef USE_TANGENT
		mat3 tbn2 = mat3( normalize( vTangent ), normalize( vBitangent ), normal );
	#else
		mat3 tbn2 = getTangentFrame( - vViewPosition, normal, vClearcoatNormalMapUv );
	#endif
	#if defined( DOUBLE_SIDED ) && ! defined( FLAT_SHADED )
		tbn2[0] *= faceDirection;
		tbn2[1] *= faceDirection;
	#endif
#endif
vec3 nonPerturbedNormal = normal;`,Lf=`#ifdef USE_NORMALMAP_OBJECTSPACE
	normal = texture2D( normalMap, vNormalMapUv ).xyz * 2.0 - 1.0;
	#ifdef FLIP_SIDED
		normal = - normal;
	#endif
	#ifdef DOUBLE_SIDED
		normal = normal * faceDirection;
	#endif
	normal = normalize( normalMatrix * normal );
#elif defined( USE_NORMALMAP_TANGENTSPACE )
	vec3 mapN = texture2D( normalMap, vNormalMapUv ).xyz * 2.0 - 1.0;
	mapN.xy *= normalScale;
	normal = normalize( tbn * mapN );
#elif defined( USE_BUMPMAP )
	normal = perturbNormalArb( - vViewPosition, normal, dHdxy_fwd(), faceDirection );
#endif`,If=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,Uf=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,Nf=`#ifndef FLAT_SHADED
	vNormal = normalize( transformedNormal );
	#ifdef USE_TANGENT
		vTangent = normalize( transformedTangent );
		vBitangent = normalize( cross( vNormal, vTangent ) * tangent.w );
	#endif
#endif`,Ff=`#ifdef USE_NORMALMAP
	uniform sampler2D normalMap;
	uniform vec2 normalScale;
#endif
#ifdef USE_NORMALMAP_OBJECTSPACE
	uniform mat3 normalMatrix;
#endif
#if ! defined ( USE_TANGENT ) && ( defined ( USE_NORMALMAP_TANGENTSPACE ) || defined ( USE_CLEARCOAT_NORMALMAP ) || defined( USE_ANISOTROPY ) )
	mat3 getTangentFrame( vec3 eye_pos, vec3 surf_norm, vec2 uv ) {
		vec3 q0 = dFdx( eye_pos.xyz );
		vec3 q1 = dFdy( eye_pos.xyz );
		vec2 st0 = dFdx( uv.st );
		vec2 st1 = dFdy( uv.st );
		vec3 N = surf_norm;
		vec3 q1perp = cross( q1, N );
		vec3 q0perp = cross( N, q0 );
		vec3 T = q1perp * st0.x + q0perp * st1.x;
		vec3 B = q1perp * st0.y + q0perp * st1.y;
		float det = max( dot( T, T ), dot( B, B ) );
		float scale = ( det == 0.0 ) ? 0.0 : inversesqrt( det );
		return mat3( T * scale, B * scale, N );
	}
#endif`,Of=`#ifdef USE_CLEARCOAT
	vec3 clearcoatNormal = nonPerturbedNormal;
#endif`,Bf=`#ifdef USE_CLEARCOAT_NORMALMAP
	vec3 clearcoatMapN = texture2D( clearcoatNormalMap, vClearcoatNormalMapUv ).xyz * 2.0 - 1.0;
	clearcoatMapN.xy *= clearcoatNormalScale;
	clearcoatNormal = normalize( tbn2 * clearcoatMapN );
#endif`,zf=`#ifdef USE_CLEARCOATMAP
	uniform sampler2D clearcoatMap;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform sampler2D clearcoatNormalMap;
	uniform vec2 clearcoatNormalScale;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform sampler2D clearcoatRoughnessMap;
#endif`,kf=`#ifdef USE_IRIDESCENCEMAP
	uniform sampler2D iridescenceMap;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform sampler2D iridescenceThicknessMap;
#endif`,Gf=`#ifdef OPAQUE
diffuseColor.a = 1.0;
#endif
#ifdef USE_TRANSMISSION
diffuseColor.a *= material.transmissionAlpha;
#endif
gl_FragColor = vec4( outgoingLight, diffuseColor.a );`,Hf=`vec3 packNormalToRGB( const in vec3 normal ) {
	return normalize( normal ) * 0.5 + 0.5;
}
vec3 unpackRGBToNormal( const in vec3 rgb ) {
	return 2.0 * rgb.xyz - 1.0;
}
const float PackUpscale = 256. / 255.;const float UnpackDownscale = 255. / 256.;const float ShiftRight8 = 1. / 256.;
const float Inv255 = 1. / 255.;
const vec4 PackFactors = vec4( 1.0, 256.0, 256.0 * 256.0, 256.0 * 256.0 * 256.0 );
const vec2 UnpackFactors2 = vec2( UnpackDownscale, 1.0 / PackFactors.g );
const vec3 UnpackFactors3 = vec3( UnpackDownscale / PackFactors.rg, 1.0 / PackFactors.b );
const vec4 UnpackFactors4 = vec4( UnpackDownscale / PackFactors.rgb, 1.0 / PackFactors.a );
vec4 packDepthToRGBA( const in float v ) {
	if( v <= 0.0 )
		return vec4( 0., 0., 0., 0. );
	if( v >= 1.0 )
		return vec4( 1., 1., 1., 1. );
	float vuf;
	float af = modf( v * PackFactors.a, vuf );
	float bf = modf( vuf * ShiftRight8, vuf );
	float gf = modf( vuf * ShiftRight8, vuf );
	return vec4( vuf * Inv255, gf * PackUpscale, bf * PackUpscale, af );
}
vec3 packDepthToRGB( const in float v ) {
	if( v <= 0.0 )
		return vec3( 0., 0., 0. );
	if( v >= 1.0 )
		return vec3( 1., 1., 1. );
	float vuf;
	float bf = modf( v * PackFactors.b, vuf );
	float gf = modf( vuf * ShiftRight8, vuf );
	return vec3( vuf * Inv255, gf * PackUpscale, bf );
}
vec2 packDepthToRG( const in float v ) {
	if( v <= 0.0 )
		return vec2( 0., 0. );
	if( v >= 1.0 )
		return vec2( 1., 1. );
	float vuf;
	float gf = modf( v * 256., vuf );
	return vec2( vuf * Inv255, gf );
}
float unpackRGBAToDepth( const in vec4 v ) {
	return dot( v, UnpackFactors4 );
}
float unpackRGBToDepth( const in vec3 v ) {
	return dot( v, UnpackFactors3 );
}
float unpackRGToDepth( const in vec2 v ) {
	return v.r * UnpackFactors2.r + v.g * UnpackFactors2.g;
}
vec4 pack2HalfToRGBA( const in vec2 v ) {
	vec4 r = vec4( v.x, fract( v.x * 255.0 ), v.y, fract( v.y * 255.0 ) );
	return vec4( r.x - r.y / 255.0, r.y, r.z - r.w / 255.0, r.w );
}
vec2 unpackRGBATo2Half( const in vec4 v ) {
	return vec2( v.x + ( v.y / 255.0 ), v.z + ( v.w / 255.0 ) );
}
float viewZToOrthographicDepth( const in float viewZ, const in float near, const in float far ) {
	return ( viewZ + near ) / ( near - far );
}
float orthographicDepthToViewZ( const in float depth, const in float near, const in float far ) {
	return depth * ( near - far ) - near;
}
float viewZToPerspectiveDepth( const in float viewZ, const in float near, const in float far ) {
	return ( ( near + viewZ ) * far ) / ( ( far - near ) * viewZ );
}
float perspectiveDepthToViewZ( const in float depth, const in float near, const in float far ) {
	return ( near * far ) / ( ( far - near ) * depth - far );
}`,Vf=`#ifdef PREMULTIPLIED_ALPHA
	gl_FragColor.rgb *= gl_FragColor.a;
#endif`,Wf=`vec4 mvPosition = vec4( transformed, 1.0 );
#ifdef USE_BATCHING
	mvPosition = batchingMatrix * mvPosition;
#endif
#ifdef USE_INSTANCING
	mvPosition = instanceMatrix * mvPosition;
#endif
mvPosition = modelViewMatrix * mvPosition;
gl_Position = projectionMatrix * mvPosition;`,Xf=`#ifdef DITHERING
	gl_FragColor.rgb = dithering( gl_FragColor.rgb );
#endif`,qf=`#ifdef DITHERING
	vec3 dithering( vec3 color ) {
		float grid_position = rand( gl_FragCoord.xy );
		vec3 dither_shift_RGB = vec3( 0.25 / 255.0, -0.25 / 255.0, 0.25 / 255.0 );
		dither_shift_RGB = mix( 2.0 * dither_shift_RGB, -2.0 * dither_shift_RGB, grid_position );
		return color + dither_shift_RGB;
	}
#endif`,Yf=`float roughnessFactor = roughness;
#ifdef USE_ROUGHNESSMAP
	vec4 texelRoughness = texture2D( roughnessMap, vRoughnessMapUv );
	roughnessFactor *= texelRoughness.g;
#endif`,Kf=`#ifdef USE_ROUGHNESSMAP
	uniform sampler2D roughnessMap;
#endif`,$f=`#if NUM_SPOT_LIGHT_COORDS > 0
	varying vec4 vSpotLightCoord[ NUM_SPOT_LIGHT_COORDS ];
#endif
#if NUM_SPOT_LIGHT_MAPS > 0
	uniform sampler2D spotLightMap[ NUM_SPOT_LIGHT_MAPS ];
#endif
#ifdef USE_SHADOWMAP
	#if NUM_DIR_LIGHT_SHADOWS > 0
		uniform sampler2D directionalShadowMap[ NUM_DIR_LIGHT_SHADOWS ];
		varying vec4 vDirectionalShadowCoord[ NUM_DIR_LIGHT_SHADOWS ];
		struct DirectionalLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform DirectionalLightShadow directionalLightShadows[ NUM_DIR_LIGHT_SHADOWS ];
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
		uniform sampler2D spotShadowMap[ NUM_SPOT_LIGHT_SHADOWS ];
		struct SpotLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform SpotLightShadow spotLightShadows[ NUM_SPOT_LIGHT_SHADOWS ];
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		uniform sampler2D pointShadowMap[ NUM_POINT_LIGHT_SHADOWS ];
		varying vec4 vPointShadowCoord[ NUM_POINT_LIGHT_SHADOWS ];
		struct PointLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
			float shadowCameraNear;
			float shadowCameraFar;
		};
		uniform PointLightShadow pointLightShadows[ NUM_POINT_LIGHT_SHADOWS ];
	#endif
	float texture2DCompare( sampler2D depths, vec2 uv, float compare ) {
		return step( compare, unpackRGBAToDepth( texture2D( depths, uv ) ) );
	}
	vec2 texture2DDistribution( sampler2D shadow, vec2 uv ) {
		return unpackRGBATo2Half( texture2D( shadow, uv ) );
	}
	float VSMShadow (sampler2D shadow, vec2 uv, float compare ){
		float occlusion = 1.0;
		vec2 distribution = texture2DDistribution( shadow, uv );
		float hard_shadow = step( compare , distribution.x );
		if (hard_shadow != 1.0 ) {
			float distance = compare - distribution.x ;
			float variance = max( 0.00000, distribution.y * distribution.y );
			float softness_probability = variance / (variance + distance * distance );			softness_probability = clamp( ( softness_probability - 0.3 ) / ( 0.95 - 0.3 ), 0.0, 1.0 );			occlusion = clamp( max( hard_shadow, softness_probability ), 0.0, 1.0 );
		}
		return occlusion;
	}
	float getShadow( sampler2D shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord ) {
		float shadow = 1.0;
		shadowCoord.xyz /= shadowCoord.w;
		shadowCoord.z += shadowBias;
		bool inFrustum = shadowCoord.x >= 0.0 && shadowCoord.x <= 1.0 && shadowCoord.y >= 0.0 && shadowCoord.y <= 1.0;
		bool frustumTest = inFrustum && shadowCoord.z <= 1.0;
		if ( frustumTest ) {
		#if defined( SHADOWMAP_TYPE_PCF )
			vec2 texelSize = vec2( 1.0 ) / shadowMapSize;
			float dx0 = - texelSize.x * shadowRadius;
			float dy0 = - texelSize.y * shadowRadius;
			float dx1 = + texelSize.x * shadowRadius;
			float dy1 = + texelSize.y * shadowRadius;
			float dx2 = dx0 / 2.0;
			float dy2 = dy0 / 2.0;
			float dx3 = dx1 / 2.0;
			float dy3 = dy1 / 2.0;
			shadow = (
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx0, dy0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( 0.0, dy0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx1, dy0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx2, dy2 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( 0.0, dy2 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx3, dy2 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx0, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx2, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy, shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx3, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx1, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx2, dy3 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( 0.0, dy3 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx3, dy3 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx0, dy1 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( 0.0, dy1 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx1, dy1 ), shadowCoord.z )
			) * ( 1.0 / 17.0 );
		#elif defined( SHADOWMAP_TYPE_PCF_SOFT )
			vec2 texelSize = vec2( 1.0 ) / shadowMapSize;
			float dx = texelSize.x;
			float dy = texelSize.y;
			vec2 uv = shadowCoord.xy;
			vec2 f = fract( uv * shadowMapSize + 0.5 );
			uv -= f * texelSize;
			shadow = (
				texture2DCompare( shadowMap, uv, shadowCoord.z ) +
				texture2DCompare( shadowMap, uv + vec2( dx, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, uv + vec2( 0.0, dy ), shadowCoord.z ) +
				texture2DCompare( shadowMap, uv + texelSize, shadowCoord.z ) +
				mix( texture2DCompare( shadowMap, uv + vec2( -dx, 0.0 ), shadowCoord.z ),
					 texture2DCompare( shadowMap, uv + vec2( 2.0 * dx, 0.0 ), shadowCoord.z ),
					 f.x ) +
				mix( texture2DCompare( shadowMap, uv + vec2( -dx, dy ), shadowCoord.z ),
					 texture2DCompare( shadowMap, uv + vec2( 2.0 * dx, dy ), shadowCoord.z ),
					 f.x ) +
				mix( texture2DCompare( shadowMap, uv + vec2( 0.0, -dy ), shadowCoord.z ),
					 texture2DCompare( shadowMap, uv + vec2( 0.0, 2.0 * dy ), shadowCoord.z ),
					 f.y ) +
				mix( texture2DCompare( shadowMap, uv + vec2( dx, -dy ), shadowCoord.z ),
					 texture2DCompare( shadowMap, uv + vec2( dx, 2.0 * dy ), shadowCoord.z ),
					 f.y ) +
				mix( mix( texture2DCompare( shadowMap, uv + vec2( -dx, -dy ), shadowCoord.z ),
						  texture2DCompare( shadowMap, uv + vec2( 2.0 * dx, -dy ), shadowCoord.z ),
						  f.x ),
					 mix( texture2DCompare( shadowMap, uv + vec2( -dx, 2.0 * dy ), shadowCoord.z ),
						  texture2DCompare( shadowMap, uv + vec2( 2.0 * dx, 2.0 * dy ), shadowCoord.z ),
						  f.x ),
					 f.y )
			) * ( 1.0 / 9.0 );
		#elif defined( SHADOWMAP_TYPE_VSM )
			shadow = VSMShadow( shadowMap, shadowCoord.xy, shadowCoord.z );
		#else
			shadow = texture2DCompare( shadowMap, shadowCoord.xy, shadowCoord.z );
		#endif
		}
		return mix( 1.0, shadow, shadowIntensity );
	}
	vec2 cubeToUV( vec3 v, float texelSizeY ) {
		vec3 absV = abs( v );
		float scaleToCube = 1.0 / max( absV.x, max( absV.y, absV.z ) );
		absV *= scaleToCube;
		v *= scaleToCube * ( 1.0 - 2.0 * texelSizeY );
		vec2 planar = v.xy;
		float almostATexel = 1.5 * texelSizeY;
		float almostOne = 1.0 - almostATexel;
		if ( absV.z >= almostOne ) {
			if ( v.z > 0.0 )
				planar.x = 4.0 - v.x;
		} else if ( absV.x >= almostOne ) {
			float signX = sign( v.x );
			planar.x = v.z * signX + 2.0 * signX;
		} else if ( absV.y >= almostOne ) {
			float signY = sign( v.y );
			planar.x = v.x + 2.0 * signY + 2.0;
			planar.y = v.z * signY - 2.0;
		}
		return vec2( 0.125, 0.25 ) * planar + vec2( 0.375, 0.75 );
	}
	float getPointShadow( sampler2D shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord, float shadowCameraNear, float shadowCameraFar ) {
		float shadow = 1.0;
		vec3 lightToPosition = shadowCoord.xyz;
		
		float lightToPositionLength = length( lightToPosition );
		if ( lightToPositionLength - shadowCameraFar <= 0.0 && lightToPositionLength - shadowCameraNear >= 0.0 ) {
			float dp = ( lightToPositionLength - shadowCameraNear ) / ( shadowCameraFar - shadowCameraNear );			dp += shadowBias;
			vec3 bd3D = normalize( lightToPosition );
			vec2 texelSize = vec2( 1.0 ) / ( shadowMapSize * vec2( 4.0, 2.0 ) );
			#if defined( SHADOWMAP_TYPE_PCF ) || defined( SHADOWMAP_TYPE_PCF_SOFT ) || defined( SHADOWMAP_TYPE_VSM )
				vec2 offset = vec2( - 1, 1 ) * shadowRadius * texelSize.y;
				shadow = (
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.xyy, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.yyy, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.xyx, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.yyx, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.xxy, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.yxy, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.xxx, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.yxx, texelSize.y ), dp )
				) * ( 1.0 / 9.0 );
			#else
				shadow = texture2DCompare( shadowMap, cubeToUV( bd3D, texelSize.y ), dp );
			#endif
		}
		return mix( 1.0, shadow, shadowIntensity );
	}
#endif`,Zf=`#if NUM_SPOT_LIGHT_COORDS > 0
	uniform mat4 spotLightMatrix[ NUM_SPOT_LIGHT_COORDS ];
	varying vec4 vSpotLightCoord[ NUM_SPOT_LIGHT_COORDS ];
#endif
#ifdef USE_SHADOWMAP
	#if NUM_DIR_LIGHT_SHADOWS > 0
		uniform mat4 directionalShadowMatrix[ NUM_DIR_LIGHT_SHADOWS ];
		varying vec4 vDirectionalShadowCoord[ NUM_DIR_LIGHT_SHADOWS ];
		struct DirectionalLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform DirectionalLightShadow directionalLightShadows[ NUM_DIR_LIGHT_SHADOWS ];
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
		struct SpotLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform SpotLightShadow spotLightShadows[ NUM_SPOT_LIGHT_SHADOWS ];
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		uniform mat4 pointShadowMatrix[ NUM_POINT_LIGHT_SHADOWS ];
		varying vec4 vPointShadowCoord[ NUM_POINT_LIGHT_SHADOWS ];
		struct PointLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
			float shadowCameraNear;
			float shadowCameraFar;
		};
		uniform PointLightShadow pointLightShadows[ NUM_POINT_LIGHT_SHADOWS ];
	#endif
#endif`,jf=`#if ( defined( USE_SHADOWMAP ) && ( NUM_DIR_LIGHT_SHADOWS > 0 || NUM_POINT_LIGHT_SHADOWS > 0 ) ) || ( NUM_SPOT_LIGHT_COORDS > 0 )
	vec3 shadowWorldNormal = inverseTransformDirection( transformedNormal, viewMatrix );
	vec4 shadowWorldPosition;
#endif
#if defined( USE_SHADOWMAP )
	#if NUM_DIR_LIGHT_SHADOWS > 0
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_DIR_LIGHT_SHADOWS; i ++ ) {
			shadowWorldPosition = worldPosition + vec4( shadowWorldNormal * directionalLightShadows[ i ].shadowNormalBias, 0 );
			vDirectionalShadowCoord[ i ] = directionalShadowMatrix[ i ] * shadowWorldPosition;
		}
		#pragma unroll_loop_end
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_POINT_LIGHT_SHADOWS; i ++ ) {
			shadowWorldPosition = worldPosition + vec4( shadowWorldNormal * pointLightShadows[ i ].shadowNormalBias, 0 );
			vPointShadowCoord[ i ] = pointShadowMatrix[ i ] * shadowWorldPosition;
		}
		#pragma unroll_loop_end
	#endif
#endif
#if NUM_SPOT_LIGHT_COORDS > 0
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHT_COORDS; i ++ ) {
		shadowWorldPosition = worldPosition;
		#if ( defined( USE_SHADOWMAP ) && UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
			shadowWorldPosition.xyz += shadowWorldNormal * spotLightShadows[ i ].shadowNormalBias;
		#endif
		vSpotLightCoord[ i ] = spotLightMatrix[ i ] * shadowWorldPosition;
	}
	#pragma unroll_loop_end
#endif`,Jf=`float getShadowMask() {
	float shadow = 1.0;
	#ifdef USE_SHADOWMAP
	#if NUM_DIR_LIGHT_SHADOWS > 0
	DirectionalLightShadow directionalLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_DIR_LIGHT_SHADOWS; i ++ ) {
		directionalLight = directionalLightShadows[ i ];
		shadow *= receiveShadow ? getShadow( directionalShadowMap[ i ], directionalLight.shadowMapSize, directionalLight.shadowIntensity, directionalLight.shadowBias, directionalLight.shadowRadius, vDirectionalShadowCoord[ i ] ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
	SpotLightShadow spotLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHT_SHADOWS; i ++ ) {
		spotLight = spotLightShadows[ i ];
		shadow *= receiveShadow ? getShadow( spotShadowMap[ i ], spotLight.shadowMapSize, spotLight.shadowIntensity, spotLight.shadowBias, spotLight.shadowRadius, vSpotLightCoord[ i ] ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
	PointLightShadow pointLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_POINT_LIGHT_SHADOWS; i ++ ) {
		pointLight = pointLightShadows[ i ];
		shadow *= receiveShadow ? getPointShadow( pointShadowMap[ i ], pointLight.shadowMapSize, pointLight.shadowIntensity, pointLight.shadowBias, pointLight.shadowRadius, vPointShadowCoord[ i ], pointLight.shadowCameraNear, pointLight.shadowCameraFar ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#endif
	return shadow;
}`,Qf=`#ifdef USE_SKINNING
	mat4 boneMatX = getBoneMatrix( skinIndex.x );
	mat4 boneMatY = getBoneMatrix( skinIndex.y );
	mat4 boneMatZ = getBoneMatrix( skinIndex.z );
	mat4 boneMatW = getBoneMatrix( skinIndex.w );
#endif`,ed=`#ifdef USE_SKINNING
	uniform mat4 bindMatrix;
	uniform mat4 bindMatrixInverse;
	uniform highp sampler2D boneTexture;
	mat4 getBoneMatrix( const in float i ) {
		int size = textureSize( boneTexture, 0 ).x;
		int j = int( i ) * 4;
		int x = j % size;
		int y = j / size;
		vec4 v1 = texelFetch( boneTexture, ivec2( x, y ), 0 );
		vec4 v2 = texelFetch( boneTexture, ivec2( x + 1, y ), 0 );
		vec4 v3 = texelFetch( boneTexture, ivec2( x + 2, y ), 0 );
		vec4 v4 = texelFetch( boneTexture, ivec2( x + 3, y ), 0 );
		return mat4( v1, v2, v3, v4 );
	}
#endif`,td=`#ifdef USE_SKINNING
	vec4 skinVertex = bindMatrix * vec4( transformed, 1.0 );
	vec4 skinned = vec4( 0.0 );
	skinned += boneMatX * skinVertex * skinWeight.x;
	skinned += boneMatY * skinVertex * skinWeight.y;
	skinned += boneMatZ * skinVertex * skinWeight.z;
	skinned += boneMatW * skinVertex * skinWeight.w;
	transformed = ( bindMatrixInverse * skinned ).xyz;
#endif`,nd=`#ifdef USE_SKINNING
	mat4 skinMatrix = mat4( 0.0 );
	skinMatrix += skinWeight.x * boneMatX;
	skinMatrix += skinWeight.y * boneMatY;
	skinMatrix += skinWeight.z * boneMatZ;
	skinMatrix += skinWeight.w * boneMatW;
	skinMatrix = bindMatrixInverse * skinMatrix * bindMatrix;
	objectNormal = vec4( skinMatrix * vec4( objectNormal, 0.0 ) ).xyz;
	#ifdef USE_TANGENT
		objectTangent = vec4( skinMatrix * vec4( objectTangent, 0.0 ) ).xyz;
	#endif
#endif`,id=`float specularStrength;
#ifdef USE_SPECULARMAP
	vec4 texelSpecular = texture2D( specularMap, vSpecularMapUv );
	specularStrength = texelSpecular.r;
#else
	specularStrength = 1.0;
#endif`,sd=`#ifdef USE_SPECULARMAP
	uniform sampler2D specularMap;
#endif`,rd=`#if defined( TONE_MAPPING )
	gl_FragColor.rgb = toneMapping( gl_FragColor.rgb );
#endif`,ad=`#ifndef saturate
#define saturate( a ) clamp( a, 0.0, 1.0 )
#endif
uniform float toneMappingExposure;
vec3 LinearToneMapping( vec3 color ) {
	return saturate( toneMappingExposure * color );
}
vec3 ReinhardToneMapping( vec3 color ) {
	color *= toneMappingExposure;
	return saturate( color / ( vec3( 1.0 ) + color ) );
}
vec3 CineonToneMapping( vec3 color ) {
	color *= toneMappingExposure;
	color = max( vec3( 0.0 ), color - 0.004 );
	return pow( ( color * ( 6.2 * color + 0.5 ) ) / ( color * ( 6.2 * color + 1.7 ) + 0.06 ), vec3( 2.2 ) );
}
vec3 RRTAndODTFit( vec3 v ) {
	vec3 a = v * ( v + 0.0245786 ) - 0.000090537;
	vec3 b = v * ( 0.983729 * v + 0.4329510 ) + 0.238081;
	return a / b;
}
vec3 ACESFilmicToneMapping( vec3 color ) {
	const mat3 ACESInputMat = mat3(
		vec3( 0.59719, 0.07600, 0.02840 ),		vec3( 0.35458, 0.90834, 0.13383 ),
		vec3( 0.04823, 0.01566, 0.83777 )
	);
	const mat3 ACESOutputMat = mat3(
		vec3(  1.60475, -0.10208, -0.00327 ),		vec3( -0.53108,  1.10813, -0.07276 ),
		vec3( -0.07367, -0.00605,  1.07602 )
	);
	color *= toneMappingExposure / 0.6;
	color = ACESInputMat * color;
	color = RRTAndODTFit( color );
	color = ACESOutputMat * color;
	return saturate( color );
}
const mat3 LINEAR_REC2020_TO_LINEAR_SRGB = mat3(
	vec3( 1.6605, - 0.1246, - 0.0182 ),
	vec3( - 0.5876, 1.1329, - 0.1006 ),
	vec3( - 0.0728, - 0.0083, 1.1187 )
);
const mat3 LINEAR_SRGB_TO_LINEAR_REC2020 = mat3(
	vec3( 0.6274, 0.0691, 0.0164 ),
	vec3( 0.3293, 0.9195, 0.0880 ),
	vec3( 0.0433, 0.0113, 0.8956 )
);
vec3 agxDefaultContrastApprox( vec3 x ) {
	vec3 x2 = x * x;
	vec3 x4 = x2 * x2;
	return + 15.5 * x4 * x2
		- 40.14 * x4 * x
		+ 31.96 * x4
		- 6.868 * x2 * x
		+ 0.4298 * x2
		+ 0.1191 * x
		- 0.00232;
}
vec3 AgXToneMapping( vec3 color ) {
	const mat3 AgXInsetMatrix = mat3(
		vec3( 0.856627153315983, 0.137318972929847, 0.11189821299995 ),
		vec3( 0.0951212405381588, 0.761241990602591, 0.0767994186031903 ),
		vec3( 0.0482516061458583, 0.101439036467562, 0.811302368396859 )
	);
	const mat3 AgXOutsetMatrix = mat3(
		vec3( 1.1271005818144368, - 0.1413297634984383, - 0.14132976349843826 ),
		vec3( - 0.11060664309660323, 1.157823702216272, - 0.11060664309660294 ),
		vec3( - 0.016493938717834573, - 0.016493938717834257, 1.2519364065950405 )
	);
	const float AgxMinEv = - 12.47393;	const float AgxMaxEv = 4.026069;
	color *= toneMappingExposure;
	color = LINEAR_SRGB_TO_LINEAR_REC2020 * color;
	color = AgXInsetMatrix * color;
	color = max( color, 1e-10 );	color = log2( color );
	color = ( color - AgxMinEv ) / ( AgxMaxEv - AgxMinEv );
	color = clamp( color, 0.0, 1.0 );
	color = agxDefaultContrastApprox( color );
	color = AgXOutsetMatrix * color;
	color = pow( max( vec3( 0.0 ), color ), vec3( 2.2 ) );
	color = LINEAR_REC2020_TO_LINEAR_SRGB * color;
	color = clamp( color, 0.0, 1.0 );
	return color;
}
vec3 NeutralToneMapping( vec3 color ) {
	const float StartCompression = 0.8 - 0.04;
	const float Desaturation = 0.15;
	color *= toneMappingExposure;
	float x = min( color.r, min( color.g, color.b ) );
	float offset = x < 0.08 ? x - 6.25 * x * x : 0.04;
	color -= offset;
	float peak = max( color.r, max( color.g, color.b ) );
	if ( peak < StartCompression ) return color;
	float d = 1. - StartCompression;
	float newPeak = 1. - d * d / ( peak + d - StartCompression );
	color *= newPeak / peak;
	float g = 1. - 1. / ( Desaturation * ( peak - newPeak ) + 1. );
	return mix( color, vec3( newPeak ), g );
}
vec3 CustomToneMapping( vec3 color ) { return color; }`,od=`#ifdef USE_TRANSMISSION
	material.transmission = transmission;
	material.transmissionAlpha = 1.0;
	material.thickness = thickness;
	material.attenuationDistance = attenuationDistance;
	material.attenuationColor = attenuationColor;
	#ifdef USE_TRANSMISSIONMAP
		material.transmission *= texture2D( transmissionMap, vTransmissionMapUv ).r;
	#endif
	#ifdef USE_THICKNESSMAP
		material.thickness *= texture2D( thicknessMap, vThicknessMapUv ).g;
	#endif
	vec3 pos = vWorldPosition;
	vec3 v = normalize( cameraPosition - pos );
	vec3 n = inverseTransformDirection( normal, viewMatrix );
	vec4 transmitted = getIBLVolumeRefraction(
		n, v, material.roughness, material.diffuseColor, material.specularColor, material.specularF90,
		pos, modelMatrix, viewMatrix, projectionMatrix, material.dispersion, material.ior, material.thickness,
		material.attenuationColor, material.attenuationDistance );
	material.transmissionAlpha = mix( material.transmissionAlpha, transmitted.a, material.transmission );
	totalDiffuse = mix( totalDiffuse, transmitted.rgb, material.transmission );
#endif`,ld=`#ifdef USE_TRANSMISSION
	uniform float transmission;
	uniform float thickness;
	uniform float attenuationDistance;
	uniform vec3 attenuationColor;
	#ifdef USE_TRANSMISSIONMAP
		uniform sampler2D transmissionMap;
	#endif
	#ifdef USE_THICKNESSMAP
		uniform sampler2D thicknessMap;
	#endif
	uniform vec2 transmissionSamplerSize;
	uniform sampler2D transmissionSamplerMap;
	uniform mat4 modelMatrix;
	uniform mat4 projectionMatrix;
	varying vec3 vWorldPosition;
	float w0( float a ) {
		return ( 1.0 / 6.0 ) * ( a * ( a * ( - a + 3.0 ) - 3.0 ) + 1.0 );
	}
	float w1( float a ) {
		return ( 1.0 / 6.0 ) * ( a *  a * ( 3.0 * a - 6.0 ) + 4.0 );
	}
	float w2( float a ){
		return ( 1.0 / 6.0 ) * ( a * ( a * ( - 3.0 * a + 3.0 ) + 3.0 ) + 1.0 );
	}
	float w3( float a ) {
		return ( 1.0 / 6.0 ) * ( a * a * a );
	}
	float g0( float a ) {
		return w0( a ) + w1( a );
	}
	float g1( float a ) {
		return w2( a ) + w3( a );
	}
	float h0( float a ) {
		return - 1.0 + w1( a ) / ( w0( a ) + w1( a ) );
	}
	float h1( float a ) {
		return 1.0 + w3( a ) / ( w2( a ) + w3( a ) );
	}
	vec4 bicubic( sampler2D tex, vec2 uv, vec4 texelSize, float lod ) {
		uv = uv * texelSize.zw + 0.5;
		vec2 iuv = floor( uv );
		vec2 fuv = fract( uv );
		float g0x = g0( fuv.x );
		float g1x = g1( fuv.x );
		float h0x = h0( fuv.x );
		float h1x = h1( fuv.x );
		float h0y = h0( fuv.y );
		float h1y = h1( fuv.y );
		vec2 p0 = ( vec2( iuv.x + h0x, iuv.y + h0y ) - 0.5 ) * texelSize.xy;
		vec2 p1 = ( vec2( iuv.x + h1x, iuv.y + h0y ) - 0.5 ) * texelSize.xy;
		vec2 p2 = ( vec2( iuv.x + h0x, iuv.y + h1y ) - 0.5 ) * texelSize.xy;
		vec2 p3 = ( vec2( iuv.x + h1x, iuv.y + h1y ) - 0.5 ) * texelSize.xy;
		return g0( fuv.y ) * ( g0x * textureLod( tex, p0, lod ) + g1x * textureLod( tex, p1, lod ) ) +
			g1( fuv.y ) * ( g0x * textureLod( tex, p2, lod ) + g1x * textureLod( tex, p3, lod ) );
	}
	vec4 textureBicubic( sampler2D sampler, vec2 uv, float lod ) {
		vec2 fLodSize = vec2( textureSize( sampler, int( lod ) ) );
		vec2 cLodSize = vec2( textureSize( sampler, int( lod + 1.0 ) ) );
		vec2 fLodSizeInv = 1.0 / fLodSize;
		vec2 cLodSizeInv = 1.0 / cLodSize;
		vec4 fSample = bicubic( sampler, uv, vec4( fLodSizeInv, fLodSize ), floor( lod ) );
		vec4 cSample = bicubic( sampler, uv, vec4( cLodSizeInv, cLodSize ), ceil( lod ) );
		return mix( fSample, cSample, fract( lod ) );
	}
	vec3 getVolumeTransmissionRay( const in vec3 n, const in vec3 v, const in float thickness, const in float ior, const in mat4 modelMatrix ) {
		vec3 refractionVector = refract( - v, normalize( n ), 1.0 / ior );
		vec3 modelScale;
		modelScale.x = length( vec3( modelMatrix[ 0 ].xyz ) );
		modelScale.y = length( vec3( modelMatrix[ 1 ].xyz ) );
		modelScale.z = length( vec3( modelMatrix[ 2 ].xyz ) );
		return normalize( refractionVector ) * thickness * modelScale;
	}
	float applyIorToRoughness( const in float roughness, const in float ior ) {
		return roughness * clamp( ior * 2.0 - 2.0, 0.0, 1.0 );
	}
	vec4 getTransmissionSample( const in vec2 fragCoord, const in float roughness, const in float ior ) {
		float lod = log2( transmissionSamplerSize.x ) * applyIorToRoughness( roughness, ior );
		return textureBicubic( transmissionSamplerMap, fragCoord.xy, lod );
	}
	vec3 volumeAttenuation( const in float transmissionDistance, const in vec3 attenuationColor, const in float attenuationDistance ) {
		if ( isinf( attenuationDistance ) ) {
			return vec3( 1.0 );
		} else {
			vec3 attenuationCoefficient = -log( attenuationColor ) / attenuationDistance;
			vec3 transmittance = exp( - attenuationCoefficient * transmissionDistance );			return transmittance;
		}
	}
	vec4 getIBLVolumeRefraction( const in vec3 n, const in vec3 v, const in float roughness, const in vec3 diffuseColor,
		const in vec3 specularColor, const in float specularF90, const in vec3 position, const in mat4 modelMatrix,
		const in mat4 viewMatrix, const in mat4 projMatrix, const in float dispersion, const in float ior, const in float thickness,
		const in vec3 attenuationColor, const in float attenuationDistance ) {
		vec4 transmittedLight;
		vec3 transmittance;
		#ifdef USE_DISPERSION
			float halfSpread = ( ior - 1.0 ) * 0.025 * dispersion;
			vec3 iors = vec3( ior - halfSpread, ior, ior + halfSpread );
			for ( int i = 0; i < 3; i ++ ) {
				vec3 transmissionRay = getVolumeTransmissionRay( n, v, thickness, iors[ i ], modelMatrix );
				vec3 refractedRayExit = position + transmissionRay;
		
				vec4 ndcPos = projMatrix * viewMatrix * vec4( refractedRayExit, 1.0 );
				vec2 refractionCoords = ndcPos.xy / ndcPos.w;
				refractionCoords += 1.0;
				refractionCoords /= 2.0;
		
				vec4 transmissionSample = getTransmissionSample( refractionCoords, roughness, iors[ i ] );
				transmittedLight[ i ] = transmissionSample[ i ];
				transmittedLight.a += transmissionSample.a;
				transmittance[ i ] = diffuseColor[ i ] * volumeAttenuation( length( transmissionRay ), attenuationColor, attenuationDistance )[ i ];
			}
			transmittedLight.a /= 3.0;
		
		#else
		
			vec3 transmissionRay = getVolumeTransmissionRay( n, v, thickness, ior, modelMatrix );
			vec3 refractedRayExit = position + transmissionRay;
			vec4 ndcPos = projMatrix * viewMatrix * vec4( refractedRayExit, 1.0 );
			vec2 refractionCoords = ndcPos.xy / ndcPos.w;
			refractionCoords += 1.0;
			refractionCoords /= 2.0;
			transmittedLight = getTransmissionSample( refractionCoords, roughness, ior );
			transmittance = diffuseColor * volumeAttenuation( length( transmissionRay ), attenuationColor, attenuationDistance );
		
		#endif
		vec3 attenuatedColor = transmittance * transmittedLight.rgb;
		vec3 F = EnvironmentBRDF( n, v, specularColor, specularF90, roughness );
		float transmittanceFactor = ( transmittance.r + transmittance.g + transmittance.b ) / 3.0;
		return vec4( ( 1.0 - F ) * attenuatedColor, 1.0 - ( 1.0 - transmittedLight.a ) * transmittanceFactor );
	}
#endif`,cd=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	varying vec2 vUv;
#endif
#ifdef USE_MAP
	varying vec2 vMapUv;
#endif
#ifdef USE_ALPHAMAP
	varying vec2 vAlphaMapUv;
#endif
#ifdef USE_LIGHTMAP
	varying vec2 vLightMapUv;
#endif
#ifdef USE_AOMAP
	varying vec2 vAoMapUv;
#endif
#ifdef USE_BUMPMAP
	varying vec2 vBumpMapUv;
#endif
#ifdef USE_NORMALMAP
	varying vec2 vNormalMapUv;
#endif
#ifdef USE_EMISSIVEMAP
	varying vec2 vEmissiveMapUv;
#endif
#ifdef USE_METALNESSMAP
	varying vec2 vMetalnessMapUv;
#endif
#ifdef USE_ROUGHNESSMAP
	varying vec2 vRoughnessMapUv;
#endif
#ifdef USE_ANISOTROPYMAP
	varying vec2 vAnisotropyMapUv;
#endif
#ifdef USE_CLEARCOATMAP
	varying vec2 vClearcoatMapUv;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	varying vec2 vClearcoatNormalMapUv;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	varying vec2 vClearcoatRoughnessMapUv;
#endif
#ifdef USE_IRIDESCENCEMAP
	varying vec2 vIridescenceMapUv;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	varying vec2 vIridescenceThicknessMapUv;
#endif
#ifdef USE_SHEEN_COLORMAP
	varying vec2 vSheenColorMapUv;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	varying vec2 vSheenRoughnessMapUv;
#endif
#ifdef USE_SPECULARMAP
	varying vec2 vSpecularMapUv;
#endif
#ifdef USE_SPECULAR_COLORMAP
	varying vec2 vSpecularColorMapUv;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	varying vec2 vSpecularIntensityMapUv;
#endif
#ifdef USE_TRANSMISSIONMAP
	uniform mat3 transmissionMapTransform;
	varying vec2 vTransmissionMapUv;
#endif
#ifdef USE_THICKNESSMAP
	uniform mat3 thicknessMapTransform;
	varying vec2 vThicknessMapUv;
#endif`,ud=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	varying vec2 vUv;
#endif
#ifdef USE_MAP
	uniform mat3 mapTransform;
	varying vec2 vMapUv;
#endif
#ifdef USE_ALPHAMAP
	uniform mat3 alphaMapTransform;
	varying vec2 vAlphaMapUv;
#endif
#ifdef USE_LIGHTMAP
	uniform mat3 lightMapTransform;
	varying vec2 vLightMapUv;
#endif
#ifdef USE_AOMAP
	uniform mat3 aoMapTransform;
	varying vec2 vAoMapUv;
#endif
#ifdef USE_BUMPMAP
	uniform mat3 bumpMapTransform;
	varying vec2 vBumpMapUv;
#endif
#ifdef USE_NORMALMAP
	uniform mat3 normalMapTransform;
	varying vec2 vNormalMapUv;
#endif
#ifdef USE_DISPLACEMENTMAP
	uniform mat3 displacementMapTransform;
	varying vec2 vDisplacementMapUv;
#endif
#ifdef USE_EMISSIVEMAP
	uniform mat3 emissiveMapTransform;
	varying vec2 vEmissiveMapUv;
#endif
#ifdef USE_METALNESSMAP
	uniform mat3 metalnessMapTransform;
	varying vec2 vMetalnessMapUv;
#endif
#ifdef USE_ROUGHNESSMAP
	uniform mat3 roughnessMapTransform;
	varying vec2 vRoughnessMapUv;
#endif
#ifdef USE_ANISOTROPYMAP
	uniform mat3 anisotropyMapTransform;
	varying vec2 vAnisotropyMapUv;
#endif
#ifdef USE_CLEARCOATMAP
	uniform mat3 clearcoatMapTransform;
	varying vec2 vClearcoatMapUv;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform mat3 clearcoatNormalMapTransform;
	varying vec2 vClearcoatNormalMapUv;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform mat3 clearcoatRoughnessMapTransform;
	varying vec2 vClearcoatRoughnessMapUv;
#endif
#ifdef USE_SHEEN_COLORMAP
	uniform mat3 sheenColorMapTransform;
	varying vec2 vSheenColorMapUv;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	uniform mat3 sheenRoughnessMapTransform;
	varying vec2 vSheenRoughnessMapUv;
#endif
#ifdef USE_IRIDESCENCEMAP
	uniform mat3 iridescenceMapTransform;
	varying vec2 vIridescenceMapUv;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform mat3 iridescenceThicknessMapTransform;
	varying vec2 vIridescenceThicknessMapUv;
#endif
#ifdef USE_SPECULARMAP
	uniform mat3 specularMapTransform;
	varying vec2 vSpecularMapUv;
#endif
#ifdef USE_SPECULAR_COLORMAP
	uniform mat3 specularColorMapTransform;
	varying vec2 vSpecularColorMapUv;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	uniform mat3 specularIntensityMapTransform;
	varying vec2 vSpecularIntensityMapUv;
#endif
#ifdef USE_TRANSMISSIONMAP
	uniform mat3 transmissionMapTransform;
	varying vec2 vTransmissionMapUv;
#endif
#ifdef USE_THICKNESSMAP
	uniform mat3 thicknessMapTransform;
	varying vec2 vThicknessMapUv;
#endif`,hd=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	vUv = vec3( uv, 1 ).xy;
#endif
#ifdef USE_MAP
	vMapUv = ( mapTransform * vec3( MAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ALPHAMAP
	vAlphaMapUv = ( alphaMapTransform * vec3( ALPHAMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_LIGHTMAP
	vLightMapUv = ( lightMapTransform * vec3( LIGHTMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_AOMAP
	vAoMapUv = ( aoMapTransform * vec3( AOMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_BUMPMAP
	vBumpMapUv = ( bumpMapTransform * vec3( BUMPMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_NORMALMAP
	vNormalMapUv = ( normalMapTransform * vec3( NORMALMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_DISPLACEMENTMAP
	vDisplacementMapUv = ( displacementMapTransform * vec3( DISPLACEMENTMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_EMISSIVEMAP
	vEmissiveMapUv = ( emissiveMapTransform * vec3( EMISSIVEMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_METALNESSMAP
	vMetalnessMapUv = ( metalnessMapTransform * vec3( METALNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ROUGHNESSMAP
	vRoughnessMapUv = ( roughnessMapTransform * vec3( ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ANISOTROPYMAP
	vAnisotropyMapUv = ( anisotropyMapTransform * vec3( ANISOTROPYMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOATMAP
	vClearcoatMapUv = ( clearcoatMapTransform * vec3( CLEARCOATMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	vClearcoatNormalMapUv = ( clearcoatNormalMapTransform * vec3( CLEARCOAT_NORMALMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	vClearcoatRoughnessMapUv = ( clearcoatRoughnessMapTransform * vec3( CLEARCOAT_ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_IRIDESCENCEMAP
	vIridescenceMapUv = ( iridescenceMapTransform * vec3( IRIDESCENCEMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	vIridescenceThicknessMapUv = ( iridescenceThicknessMapTransform * vec3( IRIDESCENCE_THICKNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SHEEN_COLORMAP
	vSheenColorMapUv = ( sheenColorMapTransform * vec3( SHEEN_COLORMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	vSheenRoughnessMapUv = ( sheenRoughnessMapTransform * vec3( SHEEN_ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULARMAP
	vSpecularMapUv = ( specularMapTransform * vec3( SPECULARMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULAR_COLORMAP
	vSpecularColorMapUv = ( specularColorMapTransform * vec3( SPECULAR_COLORMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	vSpecularIntensityMapUv = ( specularIntensityMapTransform * vec3( SPECULAR_INTENSITYMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_TRANSMISSIONMAP
	vTransmissionMapUv = ( transmissionMapTransform * vec3( TRANSMISSIONMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_THICKNESSMAP
	vThicknessMapUv = ( thicknessMapTransform * vec3( THICKNESSMAP_UV, 1 ) ).xy;
#endif`,fd=`#if defined( USE_ENVMAP ) || defined( DISTANCE ) || defined ( USE_SHADOWMAP ) || defined ( USE_TRANSMISSION ) || NUM_SPOT_LIGHT_COORDS > 0
	vec4 worldPosition = vec4( transformed, 1.0 );
	#ifdef USE_BATCHING
		worldPosition = batchingMatrix * worldPosition;
	#endif
	#ifdef USE_INSTANCING
		worldPosition = instanceMatrix * worldPosition;
	#endif
	worldPosition = modelMatrix * worldPosition;
#endif`;const dd=`varying vec2 vUv;
uniform mat3 uvTransform;
void main() {
	vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	gl_Position = vec4( position.xy, 1.0, 1.0 );
}`,pd=`uniform sampler2D t2D;
uniform float backgroundIntensity;
varying vec2 vUv;
void main() {
	vec4 texColor = texture2D( t2D, vUv );
	#ifdef DECODE_VIDEO_TEXTURE
		texColor = vec4( mix( pow( texColor.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), texColor.rgb * 0.0773993808, vec3( lessThanEqual( texColor.rgb, vec3( 0.04045 ) ) ) ), texColor.w );
	#endif
	texColor.rgb *= backgroundIntensity;
	gl_FragColor = texColor;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,md=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,gd=`#ifdef ENVMAP_TYPE_CUBE
	uniform samplerCube envMap;
#elif defined( ENVMAP_TYPE_CUBE_UV )
	uniform sampler2D envMap;
#endif
uniform float flipEnvMap;
uniform float backgroundBlurriness;
uniform float backgroundIntensity;
uniform mat3 backgroundRotation;
varying vec3 vWorldDirection;
#include <cube_uv_reflection_fragment>
void main() {
	#ifdef ENVMAP_TYPE_CUBE
		vec4 texColor = textureCube( envMap, backgroundRotation * vec3( flipEnvMap * vWorldDirection.x, vWorldDirection.yz ) );
	#elif defined( ENVMAP_TYPE_CUBE_UV )
		vec4 texColor = textureCubeUV( envMap, backgroundRotation * vWorldDirection, backgroundBlurriness );
	#else
		vec4 texColor = vec4( 0.0, 0.0, 0.0, 1.0 );
	#endif
	texColor.rgb *= backgroundIntensity;
	gl_FragColor = texColor;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,_d=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,vd=`uniform samplerCube tCube;
uniform float tFlip;
uniform float opacity;
varying vec3 vWorldDirection;
void main() {
	vec4 texColor = textureCube( tCube, vec3( tFlip * vWorldDirection.x, vWorldDirection.yz ) );
	gl_FragColor = texColor;
	gl_FragColor.a *= opacity;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,xd=`#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
varying vec2 vHighPrecisionZW;
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <skinbase_vertex>
	#include <morphinstance_vertex>
	#ifdef USE_DISPLACEMENTMAP
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vHighPrecisionZW = gl_Position.zw;
}`,Md=`#if DEPTH_PACKING == 3200
	uniform float opacity;
#endif
#include <common>
#include <packing>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
varying vec2 vHighPrecisionZW;
void main() {
	vec4 diffuseColor = vec4( 1.0 );
	#include <clipping_planes_fragment>
	#if DEPTH_PACKING == 3200
		diffuseColor.a = opacity;
	#endif
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <logdepthbuf_fragment>
	float fragCoordZ = 0.5 * vHighPrecisionZW[0] / vHighPrecisionZW[1] + 0.5;
	#if DEPTH_PACKING == 3200
		gl_FragColor = vec4( vec3( 1.0 - fragCoordZ ), opacity );
	#elif DEPTH_PACKING == 3201
		gl_FragColor = packDepthToRGBA( fragCoordZ );
	#elif DEPTH_PACKING == 3202
		gl_FragColor = vec4( packDepthToRGB( fragCoordZ ), 1.0 );
	#elif DEPTH_PACKING == 3203
		gl_FragColor = vec4( packDepthToRG( fragCoordZ ), 0.0, 1.0 );
	#endif
}`,Sd=`#define DISTANCE
varying vec3 vWorldPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <skinbase_vertex>
	#include <morphinstance_vertex>
	#ifdef USE_DISPLACEMENTMAP
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <worldpos_vertex>
	#include <clipping_planes_vertex>
	vWorldPosition = worldPosition.xyz;
}`,yd=`#define DISTANCE
uniform vec3 referencePosition;
uniform float nearDistance;
uniform float farDistance;
varying vec3 vWorldPosition;
#include <common>
#include <packing>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <clipping_planes_pars_fragment>
void main () {
	vec4 diffuseColor = vec4( 1.0 );
	#include <clipping_planes_fragment>
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	float dist = length( vWorldPosition - referencePosition );
	dist = ( dist - nearDistance ) / ( farDistance - nearDistance );
	dist = saturate( dist );
	gl_FragColor = packDepthToRGBA( dist );
}`,Ed=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
}`,Td=`uniform sampler2D tEquirect;
varying vec3 vWorldDirection;
#include <common>
void main() {
	vec3 direction = normalize( vWorldDirection );
	vec2 sampleUV = equirectUv( direction );
	gl_FragColor = texture2D( tEquirect, sampleUV );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,Ad=`uniform float scale;
attribute float lineDistance;
varying float vLineDistance;
#include <common>
#include <uv_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	vLineDistance = scale * lineDistance;
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
}`,bd=`uniform vec3 diffuse;
uniform float opacity;
uniform float dashSize;
uniform float totalSize;
varying float vLineDistance;
#include <common>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	if ( mod( vLineDistance, totalSize ) > dashSize ) {
		discard;
	}
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
}`,wd=`#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#if defined ( USE_ENVMAP ) || defined ( USE_SKINNING )
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinbase_vertex>
		#include <skinnormal_vertex>
		#include <defaultnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <fog_vertex>
}`,Rd=`uniform vec3 diffuse;
uniform float opacity;
#ifndef FLAT_SHADED
	varying vec3 vNormal;
#endif
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <fog_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	#ifdef USE_LIGHTMAP
		vec4 lightMapTexel = texture2D( lightMap, vLightMapUv );
		reflectedLight.indirectDiffuse += lightMapTexel.rgb * lightMapIntensity * RECIPROCAL_PI;
	#else
		reflectedLight.indirectDiffuse += vec3( 1.0 );
	#endif
	#include <aomap_fragment>
	reflectedLight.indirectDiffuse *= diffuseColor.rgb;
	vec3 outgoingLight = reflectedLight.indirectDiffuse;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,Cd=`#define LAMBERT
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,Pd=`#define LAMBERT
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float opacity;
#include <common>
#include <packing>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_lambert_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_lambert_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + totalEmissiveRadiance;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,Dd=`#define MATCAP
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <color_pars_vertex>
#include <displacementmap_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
	vViewPosition = - mvPosition.xyz;
}`,Ld=`#define MATCAP
uniform vec3 diffuse;
uniform float opacity;
uniform sampler2D matcap;
varying vec3 vViewPosition;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <normal_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	vec3 viewDir = normalize( vViewPosition );
	vec3 x = normalize( vec3( viewDir.z, 0.0, - viewDir.x ) );
	vec3 y = cross( viewDir, x );
	vec2 uv = vec2( dot( x, normal ), dot( y, normal ) ) * 0.495 + 0.5;
	#ifdef USE_MATCAP
		vec4 matcapColor = texture2D( matcap, uv );
	#else
		vec4 matcapColor = vec4( vec3( mix( 0.2, 0.8, uv.y ) ), 1.0 );
	#endif
	vec3 outgoingLight = diffuseColor.rgb * matcapColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,Id=`#define NORMAL
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	varying vec3 vViewPosition;
#endif
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	vViewPosition = - mvPosition.xyz;
#endif
}`,Ud=`#define NORMAL
uniform float opacity;
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	varying vec3 vViewPosition;
#endif
#include <packing>
#include <uv_pars_fragment>
#include <normal_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( 0.0, 0.0, 0.0, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	gl_FragColor = vec4( packNormalToRGB( normal ), diffuseColor.a );
	#ifdef OPAQUE
		gl_FragColor.a = 1.0;
	#endif
}`,Nd=`#define PHONG
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,Fd=`#define PHONG
uniform vec3 diffuse;
uniform vec3 emissive;
uniform vec3 specular;
uniform float shininess;
uniform float opacity;
#include <common>
#include <packing>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_phong_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_phong_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + reflectedLight.directSpecular + reflectedLight.indirectSpecular + totalEmissiveRadiance;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,Od=`#define STANDARD
varying vec3 vViewPosition;
#ifdef USE_TRANSMISSION
	varying vec3 vWorldPosition;
#endif
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
#ifdef USE_TRANSMISSION
	vWorldPosition = worldPosition.xyz;
#endif
}`,Bd=`#define STANDARD
#ifdef PHYSICAL
	#define IOR
	#define USE_SPECULAR
#endif
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float roughness;
uniform float metalness;
uniform float opacity;
#ifdef IOR
	uniform float ior;
#endif
#ifdef USE_SPECULAR
	uniform float specularIntensity;
	uniform vec3 specularColor;
	#ifdef USE_SPECULAR_COLORMAP
		uniform sampler2D specularColorMap;
	#endif
	#ifdef USE_SPECULAR_INTENSITYMAP
		uniform sampler2D specularIntensityMap;
	#endif
#endif
#ifdef USE_CLEARCOAT
	uniform float clearcoat;
	uniform float clearcoatRoughness;
#endif
#ifdef USE_DISPERSION
	uniform float dispersion;
#endif
#ifdef USE_IRIDESCENCE
	uniform float iridescence;
	uniform float iridescenceIOR;
	uniform float iridescenceThicknessMinimum;
	uniform float iridescenceThicknessMaximum;
#endif
#ifdef USE_SHEEN
	uniform vec3 sheenColor;
	uniform float sheenRoughness;
	#ifdef USE_SHEEN_COLORMAP
		uniform sampler2D sheenColorMap;
	#endif
	#ifdef USE_SHEEN_ROUGHNESSMAP
		uniform sampler2D sheenRoughnessMap;
	#endif
#endif
#ifdef USE_ANISOTROPY
	uniform vec2 anisotropyVector;
	#ifdef USE_ANISOTROPYMAP
		uniform sampler2D anisotropyMap;
	#endif
#endif
varying vec3 vViewPosition;
#include <common>
#include <packing>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <iridescence_fragment>
#include <cube_uv_reflection_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_physical_pars_fragment>
#include <fog_pars_fragment>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_physical_pars_fragment>
#include <transmission_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <clearcoat_pars_fragment>
#include <iridescence_pars_fragment>
#include <roughnessmap_pars_fragment>
#include <metalnessmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <roughnessmap_fragment>
	#include <metalnessmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <clearcoat_normal_fragment_begin>
	#include <clearcoat_normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_physical_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 totalDiffuse = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse;
	vec3 totalSpecular = reflectedLight.directSpecular + reflectedLight.indirectSpecular;
	#include <transmission_fragment>
	vec3 outgoingLight = totalDiffuse + totalSpecular + totalEmissiveRadiance;
	#ifdef USE_SHEEN
		float sheenEnergyComp = 1.0 - 0.157 * max3( material.sheenColor );
		outgoingLight = outgoingLight * sheenEnergyComp + sheenSpecularDirect + sheenSpecularIndirect;
	#endif
	#ifdef USE_CLEARCOAT
		float dotNVcc = saturate( dot( geometryClearcoatNormal, geometryViewDir ) );
		vec3 Fcc = F_Schlick( material.clearcoatF0, material.clearcoatF90, dotNVcc );
		outgoingLight = outgoingLight * ( 1.0 - material.clearcoat * Fcc ) + ( clearcoatSpecularDirect + clearcoatSpecularIndirect ) * material.clearcoat;
	#endif
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,zd=`#define TOON
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,kd=`#define TOON
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float opacity;
#include <common>
#include <packing>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <gradientmap_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_toon_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_toon_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + totalEmissiveRadiance;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,Gd=`uniform float size;
uniform float scale;
#include <common>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
#ifdef USE_POINTS_UV
	varying vec2 vUv;
	uniform mat3 uvTransform;
#endif
void main() {
	#ifdef USE_POINTS_UV
		vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	#endif
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <project_vertex>
	gl_PointSize = size;
	#ifdef USE_SIZEATTENUATION
		bool isPerspective = isPerspectiveMatrix( projectionMatrix );
		if ( isPerspective ) gl_PointSize *= ( scale / - mvPosition.z );
	#endif
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <worldpos_vertex>
	#include <fog_vertex>
}`,Hd=`uniform vec3 diffuse;
uniform float opacity;
#include <common>
#include <color_pars_fragment>
#include <map_particle_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_particle_fragment>
	#include <color_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
}`,Vd=`#include <common>
#include <batching_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <shadowmap_pars_vertex>
void main() {
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,Wd=`uniform vec3 color;
uniform float opacity;
#include <common>
#include <packing>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <logdepthbuf_pars_fragment>
#include <shadowmap_pars_fragment>
#include <shadowmask_pars_fragment>
void main() {
	#include <logdepthbuf_fragment>
	gl_FragColor = vec4( color, opacity * ( 1.0 - getShadowMask() ) );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
}`,Xd=`uniform float rotation;
uniform vec2 center;
#include <common>
#include <uv_pars_vertex>
#include <fog_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	vec4 mvPosition = modelViewMatrix[ 3 ];
	vec2 scale = vec2( length( modelMatrix[ 0 ].xyz ), length( modelMatrix[ 1 ].xyz ) );
	#ifndef USE_SIZEATTENUATION
		bool isPerspective = isPerspectiveMatrix( projectionMatrix );
		if ( isPerspective ) scale *= - mvPosition.z;
	#endif
	vec2 alignedPosition = ( position.xy - ( center - vec2( 0.5 ) ) ) * scale;
	vec2 rotatedPosition;
	rotatedPosition.x = cos( rotation ) * alignedPosition.x - sin( rotation ) * alignedPosition.y;
	rotatedPosition.y = sin( rotation ) * alignedPosition.x + cos( rotation ) * alignedPosition.y;
	mvPosition.xy += rotatedPosition;
	gl_Position = projectionMatrix * mvPosition;
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
}`,qd=`uniform vec3 diffuse;
uniform float opacity;
#include <common>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
}`,Ge={alphahash_fragment:dh,alphahash_pars_fragment:ph,alphamap_fragment:mh,alphamap_pars_fragment:gh,alphatest_fragment:_h,alphatest_pars_fragment:vh,aomap_fragment:xh,aomap_pars_fragment:Mh,batching_pars_vertex:Sh,batching_vertex:yh,begin_vertex:Eh,beginnormal_vertex:Th,bsdfs:Ah,iridescence_fragment:bh,bumpmap_pars_fragment:wh,clipping_planes_fragment:Rh,clipping_planes_pars_fragment:Ch,clipping_planes_pars_vertex:Ph,clipping_planes_vertex:Dh,color_fragment:Lh,color_pars_fragment:Ih,color_pars_vertex:Uh,color_vertex:Nh,common:Fh,cube_uv_reflection_fragment:Oh,defaultnormal_vertex:Bh,displacementmap_pars_vertex:zh,displacementmap_vertex:kh,emissivemap_fragment:Gh,emissivemap_pars_fragment:Hh,colorspace_fragment:Vh,colorspace_pars_fragment:Wh,envmap_fragment:Xh,envmap_common_pars_fragment:qh,envmap_pars_fragment:Yh,envmap_pars_vertex:Kh,envmap_physical_pars_fragment:af,envmap_vertex:$h,fog_vertex:Zh,fog_pars_vertex:jh,fog_fragment:Jh,fog_pars_fragment:Qh,gradientmap_pars_fragment:ef,lightmap_pars_fragment:tf,lights_lambert_fragment:nf,lights_lambert_pars_fragment:sf,lights_pars_begin:rf,lights_toon_fragment:of,lights_toon_pars_fragment:lf,lights_phong_fragment:cf,lights_phong_pars_fragment:uf,lights_physical_fragment:hf,lights_physical_pars_fragment:ff,lights_fragment_begin:df,lights_fragment_maps:pf,lights_fragment_end:mf,logdepthbuf_fragment:gf,logdepthbuf_pars_fragment:_f,logdepthbuf_pars_vertex:vf,logdepthbuf_vertex:xf,map_fragment:Mf,map_pars_fragment:Sf,map_particle_fragment:yf,map_particle_pars_fragment:Ef,metalnessmap_fragment:Tf,metalnessmap_pars_fragment:Af,morphinstance_vertex:bf,morphcolor_vertex:wf,morphnormal_vertex:Rf,morphtarget_pars_vertex:Cf,morphtarget_vertex:Pf,normal_fragment_begin:Df,normal_fragment_maps:Lf,normal_pars_fragment:If,normal_pars_vertex:Uf,normal_vertex:Nf,normalmap_pars_fragment:Ff,clearcoat_normal_fragment_begin:Of,clearcoat_normal_fragment_maps:Bf,clearcoat_pars_fragment:zf,iridescence_pars_fragment:kf,opaque_fragment:Gf,packing:Hf,premultiplied_alpha_fragment:Vf,project_vertex:Wf,dithering_fragment:Xf,dithering_pars_fragment:qf,roughnessmap_fragment:Yf,roughnessmap_pars_fragment:Kf,shadowmap_pars_fragment:$f,shadowmap_pars_vertex:Zf,shadowmap_vertex:jf,shadowmask_pars_fragment:Jf,skinbase_vertex:Qf,skinning_pars_vertex:ed,skinning_vertex:td,skinnormal_vertex:nd,specularmap_fragment:id,specularmap_pars_fragment:sd,tonemapping_fragment:rd,tonemapping_pars_fragment:ad,transmission_fragment:od,transmission_pars_fragment:ld,uv_pars_fragment:cd,uv_pars_vertex:ud,uv_vertex:hd,worldpos_vertex:fd,background_vert:dd,background_frag:pd,backgroundCube_vert:md,backgroundCube_frag:gd,cube_vert:_d,cube_frag:vd,depth_vert:xd,depth_frag:Md,distanceRGBA_vert:Sd,distanceRGBA_frag:yd,equirect_vert:Ed,equirect_frag:Td,linedashed_vert:Ad,linedashed_frag:bd,meshbasic_vert:wd,meshbasic_frag:Rd,meshlambert_vert:Cd,meshlambert_frag:Pd,meshmatcap_vert:Dd,meshmatcap_frag:Ld,meshnormal_vert:Id,meshnormal_frag:Ud,meshphong_vert:Nd,meshphong_frag:Fd,meshphysical_vert:Od,meshphysical_frag:Bd,meshtoon_vert:zd,meshtoon_frag:kd,points_vert:Gd,points_frag:Hd,shadow_vert:Vd,shadow_frag:Wd,sprite_vert:Xd,sprite_frag:qd},le={common:{diffuse:{value:new je(16777215)},opacity:{value:1},map:{value:null},mapTransform:{value:new Ne},alphaMap:{value:null},alphaMapTransform:{value:new Ne},alphaTest:{value:0}},specularmap:{specularMap:{value:null},specularMapTransform:{value:new Ne}},envmap:{envMap:{value:null},envMapRotation:{value:new Ne},flipEnvMap:{value:-1},reflectivity:{value:1},ior:{value:1.5},refractionRatio:{value:.98}},aomap:{aoMap:{value:null},aoMapIntensity:{value:1},aoMapTransform:{value:new Ne}},lightmap:{lightMap:{value:null},lightMapIntensity:{value:1},lightMapTransform:{value:new Ne}},bumpmap:{bumpMap:{value:null},bumpMapTransform:{value:new Ne},bumpScale:{value:1}},normalmap:{normalMap:{value:null},normalMapTransform:{value:new Ne},normalScale:{value:new Ve(1,1)}},displacementmap:{displacementMap:{value:null},displacementMapTransform:{value:new Ne},displacementScale:{value:1},displacementBias:{value:0}},emissivemap:{emissiveMap:{value:null},emissiveMapTransform:{value:new Ne}},metalnessmap:{metalnessMap:{value:null},metalnessMapTransform:{value:new Ne}},roughnessmap:{roughnessMap:{value:null},roughnessMapTransform:{value:new Ne}},gradientmap:{gradientMap:{value:null}},fog:{fogDensity:{value:25e-5},fogNear:{value:1},fogFar:{value:2e3},fogColor:{value:new je(16777215)}},lights:{ambientLightColor:{value:[]},lightProbe:{value:[]},directionalLights:{value:[],properties:{direction:{},color:{}}},directionalLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},directionalShadowMap:{value:[]},directionalShadowMatrix:{value:[]},spotLights:{value:[],properties:{color:{},position:{},direction:{},distance:{},coneCos:{},penumbraCos:{},decay:{}}},spotLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},spotLightMap:{value:[]},spotShadowMap:{value:[]},spotLightMatrix:{value:[]},pointLights:{value:[],properties:{color:{},position:{},decay:{},distance:{}}},pointLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{},shadowCameraNear:{},shadowCameraFar:{}}},pointShadowMap:{value:[]},pointShadowMatrix:{value:[]},hemisphereLights:{value:[],properties:{direction:{},skyColor:{},groundColor:{}}},rectAreaLights:{value:[],properties:{color:{},position:{},width:{},height:{}}},ltc_1:{value:null},ltc_2:{value:null}},points:{diffuse:{value:new je(16777215)},opacity:{value:1},size:{value:1},scale:{value:1},map:{value:null},alphaMap:{value:null},alphaMapTransform:{value:new Ne},alphaTest:{value:0},uvTransform:{value:new Ne}},sprite:{diffuse:{value:new je(16777215)},opacity:{value:1},center:{value:new Ve(.5,.5)},rotation:{value:0},map:{value:null},mapTransform:{value:new Ne},alphaMap:{value:null},alphaMapTransform:{value:new Ne},alphaTest:{value:0}}},on={basic:{uniforms:yt([le.common,le.specularmap,le.envmap,le.aomap,le.lightmap,le.fog]),vertexShader:Ge.meshbasic_vert,fragmentShader:Ge.meshbasic_frag},lambert:{uniforms:yt([le.common,le.specularmap,le.envmap,le.aomap,le.lightmap,le.emissivemap,le.bumpmap,le.normalmap,le.displacementmap,le.fog,le.lights,{emissive:{value:new je(0)}}]),vertexShader:Ge.meshlambert_vert,fragmentShader:Ge.meshlambert_frag},phong:{uniforms:yt([le.common,le.specularmap,le.envmap,le.aomap,le.lightmap,le.emissivemap,le.bumpmap,le.normalmap,le.displacementmap,le.fog,le.lights,{emissive:{value:new je(0)},specular:{value:new je(1118481)},shininess:{value:30}}]),vertexShader:Ge.meshphong_vert,fragmentShader:Ge.meshphong_frag},standard:{uniforms:yt([le.common,le.envmap,le.aomap,le.lightmap,le.emissivemap,le.bumpmap,le.normalmap,le.displacementmap,le.roughnessmap,le.metalnessmap,le.fog,le.lights,{emissive:{value:new je(0)},roughness:{value:1},metalness:{value:0},envMapIntensity:{value:1}}]),vertexShader:Ge.meshphysical_vert,fragmentShader:Ge.meshphysical_frag},toon:{uniforms:yt([le.common,le.aomap,le.lightmap,le.emissivemap,le.bumpmap,le.normalmap,le.displacementmap,le.gradientmap,le.fog,le.lights,{emissive:{value:new je(0)}}]),vertexShader:Ge.meshtoon_vert,fragmentShader:Ge.meshtoon_frag},matcap:{uniforms:yt([le.common,le.bumpmap,le.normalmap,le.displacementmap,le.fog,{matcap:{value:null}}]),vertexShader:Ge.meshmatcap_vert,fragmentShader:Ge.meshmatcap_frag},points:{uniforms:yt([le.points,le.fog]),vertexShader:Ge.points_vert,fragmentShader:Ge.points_frag},dashed:{uniforms:yt([le.common,le.fog,{scale:{value:1},dashSize:{value:1},totalSize:{value:2}}]),vertexShader:Ge.linedashed_vert,fragmentShader:Ge.linedashed_frag},depth:{uniforms:yt([le.common,le.displacementmap]),vertexShader:Ge.depth_vert,fragmentShader:Ge.depth_frag},normal:{uniforms:yt([le.common,le.bumpmap,le.normalmap,le.displacementmap,{opacity:{value:1}}]),vertexShader:Ge.meshnormal_vert,fragmentShader:Ge.meshnormal_frag},sprite:{uniforms:yt([le.sprite,le.fog]),vertexShader:Ge.sprite_vert,fragmentShader:Ge.sprite_frag},background:{uniforms:{uvTransform:{value:new Ne},t2D:{value:null},backgroundIntensity:{value:1}},vertexShader:Ge.background_vert,fragmentShader:Ge.background_frag},backgroundCube:{uniforms:{envMap:{value:null},flipEnvMap:{value:-1},backgroundBlurriness:{value:0},backgroundIntensity:{value:1},backgroundRotation:{value:new Ne}},vertexShader:Ge.backgroundCube_vert,fragmentShader:Ge.backgroundCube_frag},cube:{uniforms:{tCube:{value:null},tFlip:{value:-1},opacity:{value:1}},vertexShader:Ge.cube_vert,fragmentShader:Ge.cube_frag},equirect:{uniforms:{tEquirect:{value:null}},vertexShader:Ge.equirect_vert,fragmentShader:Ge.equirect_frag},distanceRGBA:{uniforms:yt([le.common,le.displacementmap,{referencePosition:{value:new N},nearDistance:{value:1},farDistance:{value:1e3}}]),vertexShader:Ge.distanceRGBA_vert,fragmentShader:Ge.distanceRGBA_frag},shadow:{uniforms:yt([le.lights,le.fog,{color:{value:new je(0)},opacity:{value:1}}]),vertexShader:Ge.shadow_vert,fragmentShader:Ge.shadow_frag}};on.physical={uniforms:yt([on.standard.uniforms,{clearcoat:{value:0},clearcoatMap:{value:null},clearcoatMapTransform:{value:new Ne},clearcoatNormalMap:{value:null},clearcoatNormalMapTransform:{value:new Ne},clearcoatNormalScale:{value:new Ve(1,1)},clearcoatRoughness:{value:0},clearcoatRoughnessMap:{value:null},clearcoatRoughnessMapTransform:{value:new Ne},dispersion:{value:0},iridescence:{value:0},iridescenceMap:{value:null},iridescenceMapTransform:{value:new Ne},iridescenceIOR:{value:1.3},iridescenceThicknessMinimum:{value:100},iridescenceThicknessMaximum:{value:400},iridescenceThicknessMap:{value:null},iridescenceThicknessMapTransform:{value:new Ne},sheen:{value:0},sheenColor:{value:new je(0)},sheenColorMap:{value:null},sheenColorMapTransform:{value:new Ne},sheenRoughness:{value:1},sheenRoughnessMap:{value:null},sheenRoughnessMapTransform:{value:new Ne},transmission:{value:0},transmissionMap:{value:null},transmissionMapTransform:{value:new Ne},transmissionSamplerSize:{value:new Ve},transmissionSamplerMap:{value:null},thickness:{value:0},thicknessMap:{value:null},thicknessMapTransform:{value:new Ne},attenuationDistance:{value:0},attenuationColor:{value:new je(0)},specularColor:{value:new je(1,1,1)},specularColorMap:{value:null},specularColorMapTransform:{value:new Ne},specularIntensity:{value:1},specularIntensityMap:{value:null},specularIntensityMapTransform:{value:new Ne},anisotropyVector:{value:new Ve},anisotropyMap:{value:null},anisotropyMapTransform:{value:new Ne}}]),vertexShader:Ge.meshphysical_vert,fragmentShader:Ge.meshphysical_frag};const Ws={r:0,b:0,g:0},Jn=new An,Yd=new rt;function Kd(n,e,t,i,s,r,a){const o=new je(0);let l=r===!0?0:1,c,u,f=null,d=0,m=null;function _(A){let S=A.isScene===!0?A.background:null;return S&&S.isTexture&&(S=(A.backgroundBlurriness>0?t:e).get(S)),S}function v(A){let S=!1;const g=_(A);g===null?h(o,l):g&&g.isColor&&(h(g,1),S=!0);const P=n.xr.getEnvironmentBlendMode();P==="additive"?i.buffers.color.setClear(0,0,0,1,a):P==="alpha-blend"&&i.buffers.color.setClear(0,0,0,0,a),(n.autoClear||S)&&(i.buffers.depth.setTest(!0),i.buffers.depth.setMask(!0),i.buffers.color.setMask(!0),n.clear(n.autoClearColor,n.autoClearDepth,n.autoClearStencil))}function p(A,S){const g=_(S);g&&(g.isCubeTexture||g.mapping===mr)?(u===void 0&&(u=new Vt(new Es(1,1,1),new wt({name:"BackgroundCubeMaterial",uniforms:Gi(on.backgroundCube.uniforms),vertexShader:on.backgroundCube.vertexShader,fragmentShader:on.backgroundCube.fragmentShader,side:Rt,depthTest:!1,depthWrite:!1,fog:!1})),u.geometry.deleteAttribute("normal"),u.geometry.deleteAttribute("uv"),u.onBeforeRender=function(P,b,w){this.matrixWorld.copyPosition(w.matrixWorld)},Object.defineProperty(u.material,"envMap",{get:function(){return this.uniforms.envMap.value}}),s.update(u)),Jn.copy(S.backgroundRotation),Jn.x*=-1,Jn.y*=-1,Jn.z*=-1,g.isCubeTexture&&g.isRenderTargetTexture===!1&&(Jn.y*=-1,Jn.z*=-1),u.material.uniforms.envMap.value=g,u.material.uniforms.flipEnvMap.value=g.isCubeTexture&&g.isRenderTargetTexture===!1?-1:1,u.material.uniforms.backgroundBlurriness.value=S.backgroundBlurriness,u.material.uniforms.backgroundIntensity.value=S.backgroundIntensity,u.material.uniforms.backgroundRotation.value.setFromMatrix4(Yd.makeRotationFromEuler(Jn)),u.material.toneMapped=qe.getTransfer(g.colorSpace)!==Je,(f!==g||d!==g.version||m!==n.toneMapping)&&(u.material.needsUpdate=!0,f=g,d=g.version,m=n.toneMapping),u.layers.enableAll(),A.unshift(u,u.geometry,u.material,0,0,null)):g&&g.isTexture&&(c===void 0&&(c=new Vt(new $i(2,2),new wt({name:"BackgroundMaterial",uniforms:Gi(on.background.uniforms),vertexShader:on.background.vertexShader,fragmentShader:on.background.fragmentShader,side:Xn,depthTest:!1,depthWrite:!1,fog:!1})),c.geometry.deleteAttribute("normal"),Object.defineProperty(c.material,"map",{get:function(){return this.uniforms.t2D.value}}),s.update(c)),c.material.uniforms.t2D.value=g,c.material.uniforms.backgroundIntensity.value=S.backgroundIntensity,c.material.toneMapped=qe.getTransfer(g.colorSpace)!==Je,g.matrixAutoUpdate===!0&&g.updateMatrix(),c.material.uniforms.uvTransform.value.copy(g.matrix),(f!==g||d!==g.version||m!==n.toneMapping)&&(c.material.needsUpdate=!0,f=g,d=g.version,m=n.toneMapping),c.layers.enableAll(),A.unshift(c,c.geometry,c.material,0,0,null))}function h(A,S){A.getRGB(Ws,rc(n)),i.buffers.color.setClear(Ws.r,Ws.g,Ws.b,S,a)}return{getClearColor:function(){return o},setClearColor:function(A,S=1){o.set(A),l=S,h(o,l)},getClearAlpha:function(){return l},setClearAlpha:function(A){l=A,h(o,l)},render:v,addToRenderList:p}}function $d(n,e){const t=n.getParameter(n.MAX_VERTEX_ATTRIBS),i={},s=d(null);let r=s,a=!1;function o(M,C,H,F,W){let $=!1;const k=f(F,H,C);r!==k&&(r=k,c(r.object)),$=m(M,F,H,W),$&&_(M,F,H,W),W!==null&&e.update(W,n.ELEMENT_ARRAY_BUFFER),($||a)&&(a=!1,g(M,C,H,F),W!==null&&n.bindBuffer(n.ELEMENT_ARRAY_BUFFER,e.get(W).buffer))}function l(){return n.createVertexArray()}function c(M){return n.bindVertexArray(M)}function u(M){return n.deleteVertexArray(M)}function f(M,C,H){const F=H.wireframe===!0;let W=i[M.id];W===void 0&&(W={},i[M.id]=W);let $=W[C.id];$===void 0&&($={},W[C.id]=$);let k=$[F];return k===void 0&&(k=d(l()),$[F]=k),k}function d(M){const C=[],H=[],F=[];for(let W=0;W<t;W++)C[W]=0,H[W]=0,F[W]=0;return{geometry:null,program:null,wireframe:!1,newAttributes:C,enabledAttributes:H,attributeDivisors:F,object:M,attributes:{},index:null}}function m(M,C,H,F){const W=r.attributes,$=C.attributes;let k=0;const j=H.getAttributes();for(const V in j)if(j[V].location>=0){const Q=W[V];let re=$[V];if(re===void 0&&(V==="instanceMatrix"&&M.instanceMatrix&&(re=M.instanceMatrix),V==="instanceColor"&&M.instanceColor&&(re=M.instanceColor)),Q===void 0||Q.attribute!==re||re&&Q.data!==re.data)return!0;k++}return r.attributesNum!==k||r.index!==F}function _(M,C,H,F){const W={},$=C.attributes;let k=0;const j=H.getAttributes();for(const V in j)if(j[V].location>=0){let Q=$[V];Q===void 0&&(V==="instanceMatrix"&&M.instanceMatrix&&(Q=M.instanceMatrix),V==="instanceColor"&&M.instanceColor&&(Q=M.instanceColor));const re={};re.attribute=Q,Q&&Q.data&&(re.data=Q.data),W[V]=re,k++}r.attributes=W,r.attributesNum=k,r.index=F}function v(){const M=r.newAttributes;for(let C=0,H=M.length;C<H;C++)M[C]=0}function p(M){h(M,0)}function h(M,C){const H=r.newAttributes,F=r.enabledAttributes,W=r.attributeDivisors;H[M]=1,F[M]===0&&(n.enableVertexAttribArray(M),F[M]=1),W[M]!==C&&(n.vertexAttribDivisor(M,C),W[M]=C)}function A(){const M=r.newAttributes,C=r.enabledAttributes;for(let H=0,F=C.length;H<F;H++)C[H]!==M[H]&&(n.disableVertexAttribArray(H),C[H]=0)}function S(M,C,H,F,W,$,k){k===!0?n.vertexAttribIPointer(M,C,H,W,$):n.vertexAttribPointer(M,C,H,F,W,$)}function g(M,C,H,F){v();const W=F.attributes,$=H.getAttributes(),k=C.defaultAttributeValues;for(const j in $){const V=$[j];if(V.location>=0){let ne=W[j];if(ne===void 0&&(j==="instanceMatrix"&&M.instanceMatrix&&(ne=M.instanceMatrix),j==="instanceColor"&&M.instanceColor&&(ne=M.instanceColor)),ne!==void 0){const Q=ne.normalized,re=ne.itemSize,be=e.get(ne);if(be===void 0)continue;const Fe=be.buffer,B=be.type,Z=be.bytesPerElement,ce=B===n.INT||B===n.UNSIGNED_INT||ne.gpuType===Qa;if(ne.isInterleavedBufferAttribute){const ee=ne.data,ye=ee.stride,Ce=ne.offset;if(ee.isInstancedInterleavedBuffer){for(let te=0;te<V.locationSize;te++)h(V.location+te,ee.meshPerAttribute);M.isInstancedMesh!==!0&&F._maxInstanceCount===void 0&&(F._maxInstanceCount=ee.meshPerAttribute*ee.count)}else for(let te=0;te<V.locationSize;te++)p(V.location+te);n.bindBuffer(n.ARRAY_BUFFER,Fe);for(let te=0;te<V.locationSize;te++)S(V.location+te,re/V.locationSize,B,Q,ye*Z,(Ce+re/V.locationSize*te)*Z,ce)}else{if(ne.isInstancedBufferAttribute){for(let ee=0;ee<V.locationSize;ee++)h(V.location+ee,ne.meshPerAttribute);M.isInstancedMesh!==!0&&F._maxInstanceCount===void 0&&(F._maxInstanceCount=ne.meshPerAttribute*ne.count)}else for(let ee=0;ee<V.locationSize;ee++)p(V.location+ee);n.bindBuffer(n.ARRAY_BUFFER,Fe);for(let ee=0;ee<V.locationSize;ee++)S(V.location+ee,re/V.locationSize,B,Q,re*Z,re/V.locationSize*ee*Z,ce)}}else if(k!==void 0){const Q=k[j];if(Q!==void 0)switch(Q.length){case 2:n.vertexAttrib2fv(V.location,Q);break;case 3:n.vertexAttrib3fv(V.location,Q);break;case 4:n.vertexAttrib4fv(V.location,Q);break;default:n.vertexAttrib1fv(V.location,Q)}}}}A()}function P(){D();for(const M in i){const C=i[M];for(const H in C){const F=C[H];for(const W in F)u(F[W].object),delete F[W];delete C[H]}delete i[M]}}function b(M){if(i[M.id]===void 0)return;const C=i[M.id];for(const H in C){const F=C[H];for(const W in F)u(F[W].object),delete F[W];delete C[H]}delete i[M.id]}function w(M){for(const C in i){const H=i[C];if(H[M.id]===void 0)continue;const F=H[M.id];for(const W in F)u(F[W].object),delete F[W];delete H[M.id]}}function D(){E(),a=!0,r!==s&&(r=s,c(r.object))}function E(){s.geometry=null,s.program=null,s.wireframe=!1}return{setup:o,reset:D,resetDefaultState:E,dispose:P,releaseStatesOfGeometry:b,releaseStatesOfProgram:w,initAttributes:v,enableAttribute:p,disableUnusedAttributes:A}}function Zd(n,e,t){let i;function s(c){i=c}function r(c,u){n.drawArrays(i,c,u),t.update(u,i,1)}function a(c,u,f){f!==0&&(n.drawArraysInstanced(i,c,u,f),t.update(u,i,f))}function o(c,u,f){if(f===0)return;e.get("WEBGL_multi_draw").multiDrawArraysWEBGL(i,c,0,u,0,f);let m=0;for(let _=0;_<f;_++)m+=u[_];t.update(m,i,1)}function l(c,u,f,d){if(f===0)return;const m=e.get("WEBGL_multi_draw");if(m===null)for(let _=0;_<c.length;_++)a(c[_],u[_],d[_]);else{m.multiDrawArraysInstancedWEBGL(i,c,0,u,0,d,0,f);let _=0;for(let v=0;v<f;v++)_+=u[v]*d[v];t.update(_,i,1)}}this.setMode=s,this.render=r,this.renderInstances=a,this.renderMultiDraw=o,this.renderMultiDrawInstances=l}function jd(n,e,t,i){let s;function r(){if(s!==void 0)return s;if(e.has("EXT_texture_filter_anisotropic")===!0){const w=e.get("EXT_texture_filter_anisotropic");s=n.getParameter(w.MAX_TEXTURE_MAX_ANISOTROPY_EXT)}else s=0;return s}function a(w){return!(w!==Ht&&i.convert(w)!==n.getParameter(n.IMPLEMENTATION_COLOR_READ_FORMAT))}function o(w){const D=w===xs&&(e.has("EXT_color_buffer_half_float")||e.has("EXT_color_buffer_float"));return!(w!==sn&&i.convert(w)!==n.getParameter(n.IMPLEMENTATION_COLOR_READ_TYPE)&&w!==un&&!D)}function l(w){if(w==="highp"){if(n.getShaderPrecisionFormat(n.VERTEX_SHADER,n.HIGH_FLOAT).precision>0&&n.getShaderPrecisionFormat(n.FRAGMENT_SHADER,n.HIGH_FLOAT).precision>0)return"highp";w="mediump"}return w==="mediump"&&n.getShaderPrecisionFormat(n.VERTEX_SHADER,n.MEDIUM_FLOAT).precision>0&&n.getShaderPrecisionFormat(n.FRAGMENT_SHADER,n.MEDIUM_FLOAT).precision>0?"mediump":"lowp"}let c=t.precision!==void 0?t.precision:"highp";const u=l(c);u!==c&&(console.warn("THREE.WebGLRenderer:",c,"not supported, using",u,"instead."),c=u);const f=t.logarithmicDepthBuffer===!0,d=t.reverseDepthBuffer===!0&&e.has("EXT_clip_control"),m=n.getParameter(n.MAX_TEXTURE_IMAGE_UNITS),_=n.getParameter(n.MAX_VERTEX_TEXTURE_IMAGE_UNITS),v=n.getParameter(n.MAX_TEXTURE_SIZE),p=n.getParameter(n.MAX_CUBE_MAP_TEXTURE_SIZE),h=n.getParameter(n.MAX_VERTEX_ATTRIBS),A=n.getParameter(n.MAX_VERTEX_UNIFORM_VECTORS),S=n.getParameter(n.MAX_VARYING_VECTORS),g=n.getParameter(n.MAX_FRAGMENT_UNIFORM_VECTORS),P=_>0,b=n.getParameter(n.MAX_SAMPLES);return{isWebGL2:!0,getMaxAnisotropy:r,getMaxPrecision:l,textureFormatReadable:a,textureTypeReadable:o,precision:c,logarithmicDepthBuffer:f,reverseDepthBuffer:d,maxTextures:m,maxVertexTextures:_,maxTextureSize:v,maxCubemapSize:p,maxAttributes:h,maxVertexUniforms:A,maxVaryings:S,maxFragmentUniforms:g,vertexTextures:P,maxSamples:b}}function Jd(n){const e=this;let t=null,i=0,s=!1,r=!1;const a=new ei,o=new Ne,l={value:null,needsUpdate:!1};this.uniform=l,this.numPlanes=0,this.numIntersection=0,this.init=function(f,d){const m=f.length!==0||d||i!==0||s;return s=d,i=f.length,m},this.beginShadows=function(){r=!0,u(null)},this.endShadows=function(){r=!1},this.setGlobalState=function(f,d){t=u(f,d,0)},this.setState=function(f,d,m){const _=f.clippingPlanes,v=f.clipIntersection,p=f.clipShadows,h=n.get(f);if(!s||_===null||_.length===0||r&&!p)r?u(null):c();else{const A=r?0:i,S=A*4;let g=h.clippingState||null;l.value=g,g=u(_,d,S,m);for(let P=0;P!==S;++P)g[P]=t[P];h.clippingState=g,this.numIntersection=v?this.numPlanes:0,this.numPlanes+=A}};function c(){l.value!==t&&(l.value=t,l.needsUpdate=i>0),e.numPlanes=i,e.numIntersection=0}function u(f,d,m,_){const v=f!==null?f.length:0;let p=null;if(v!==0){if(p=l.value,_!==!0||p===null){const h=m+v*4,A=d.matrixWorldInverse;o.getNormalMatrix(A),(p===null||p.length<h)&&(p=new Float32Array(h));for(let S=0,g=m;S!==v;++S,g+=4)a.copy(f[S]).applyMatrix4(A,o),a.normal.toArray(p,g),p[g+3]=a.constant}l.value=p,l.needsUpdate=!0}return e.numPlanes=v,e.numIntersection=0,p}}function Qd(n){let e=new WeakMap;function t(a,o){return o===ma?a.mapping=Oi:o===ga&&(a.mapping=Bi),a}function i(a){if(a&&a.isTexture){const o=a.mapping;if(o===ma||o===ga)if(e.has(a)){const l=e.get(a).texture;return t(l,a.mapping)}else{const l=a.image;if(l&&l.height>0){const c=new ch(l.height);return c.fromEquirectangularTexture(n,a),e.set(a,c),a.addEventListener("dispose",s),t(c.texture,a.mapping)}else return null}}return a}function s(a){const o=a.target;o.removeEventListener("dispose",s);const l=e.get(o);l!==void 0&&(e.delete(o),l.dispose())}function r(){e=new WeakMap}return{get:i,dispose:r}}class uc extends ac{constructor(e=-1,t=1,i=1,s=-1,r=.1,a=2e3){super(),this.isOrthographicCamera=!0,this.type="OrthographicCamera",this.zoom=1,this.view=null,this.left=e,this.right=t,this.top=i,this.bottom=s,this.near=r,this.far=a,this.updateProjectionMatrix()}copy(e,t){return super.copy(e,t),this.left=e.left,this.right=e.right,this.top=e.top,this.bottom=e.bottom,this.near=e.near,this.far=e.far,this.zoom=e.zoom,this.view=e.view===null?null:Object.assign({},e.view),this}setViewOffset(e,t,i,s,r,a){this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=e,this.view.fullHeight=t,this.view.offsetX=i,this.view.offsetY=s,this.view.width=r,this.view.height=a,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){const e=(this.right-this.left)/(2*this.zoom),t=(this.top-this.bottom)/(2*this.zoom),i=(this.right+this.left)/2,s=(this.top+this.bottom)/2;let r=i-e,a=i+e,o=s+t,l=s-t;if(this.view!==null&&this.view.enabled){const c=(this.right-this.left)/this.view.fullWidth/this.zoom,u=(this.top-this.bottom)/this.view.fullHeight/this.zoom;r+=c*this.view.offsetX,a=r+c*this.view.width,o-=u*this.view.offsetY,l=o-u*this.view.height}this.projectionMatrix.makeOrthographic(r,a,o,l,this.near,this.far,this.coordinateSystem),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(e){const t=super.toJSON(e);return t.object.zoom=this.zoom,t.object.left=this.left,t.object.right=this.right,t.object.top=this.top,t.object.bottom=this.bottom,t.object.near=this.near,t.object.far=this.far,this.view!==null&&(t.object.view=Object.assign({},this.view)),t}}const Ri=4,Yo=[.125,.215,.35,.446,.526,.582],ii=20,qr=new uc,Ko=new je;let Yr=null,Kr=0,$r=0,Zr=!1;const ti=(1+Math.sqrt(5))/2,bi=1/ti,$o=[new N(-ti,bi,0),new N(ti,bi,0),new N(-bi,0,ti),new N(bi,0,ti),new N(0,ti,-bi),new N(0,ti,bi),new N(-1,1,-1),new N(1,1,-1),new N(-1,1,1),new N(1,1,1)];class Zo{constructor(e){this._renderer=e,this._pingPongRenderTarget=null,this._lodMax=0,this._cubeSize=0,this._lodPlanes=[],this._sizeLods=[],this._sigmas=[],this._blurMaterial=null,this._cubemapMaterial=null,this._equirectMaterial=null,this._compileMaterial(this._blurMaterial)}fromScene(e,t=0,i=.1,s=100){Yr=this._renderer.getRenderTarget(),Kr=this._renderer.getActiveCubeFace(),$r=this._renderer.getActiveMipmapLevel(),Zr=this._renderer.xr.enabled,this._renderer.xr.enabled=!1,this._setSize(256);const r=this._allocateTargets();return r.depthBuffer=!0,this._sceneToCubeUV(e,i,s,r),t>0&&this._blur(r,0,0,t),this._applyPMREM(r),this._cleanup(r),r}fromEquirectangular(e,t=null){return this._fromTexture(e,t)}fromCubemap(e,t=null){return this._fromTexture(e,t)}compileCubemapShader(){this._cubemapMaterial===null&&(this._cubemapMaterial=Qo(),this._compileMaterial(this._cubemapMaterial))}compileEquirectangularShader(){this._equirectMaterial===null&&(this._equirectMaterial=Jo(),this._compileMaterial(this._equirectMaterial))}dispose(){this._dispose(),this._cubemapMaterial!==null&&this._cubemapMaterial.dispose(),this._equirectMaterial!==null&&this._equirectMaterial.dispose()}_setSize(e){this._lodMax=Math.floor(Math.log2(e)),this._cubeSize=Math.pow(2,this._lodMax)}_dispose(){this._blurMaterial!==null&&this._blurMaterial.dispose(),this._pingPongRenderTarget!==null&&this._pingPongRenderTarget.dispose();for(let e=0;e<this._lodPlanes.length;e++)this._lodPlanes[e].dispose()}_cleanup(e){this._renderer.setRenderTarget(Yr,Kr,$r),this._renderer.xr.enabled=Zr,e.scissorTest=!1,Xs(e,0,0,e.width,e.height)}_fromTexture(e,t){e.mapping===Oi||e.mapping===Bi?this._setSize(e.image.length===0?16:e.image[0].width||e.image[0].image.width):this._setSize(e.image.width/4),Yr=this._renderer.getRenderTarget(),Kr=this._renderer.getActiveCubeFace(),$r=this._renderer.getActiveMipmapLevel(),Zr=this._renderer.xr.enabled,this._renderer.xr.enabled=!1;const i=t||this._allocateTargets();return this._textureToCubeUV(e,i),this._applyPMREM(i),this._cleanup(i),i}_allocateTargets(){const e=3*Math.max(this._cubeSize,112),t=4*this._cubeSize,i={magFilter:Gt,minFilter:Gt,generateMipmaps:!1,type:xs,format:Ht,colorSpace:qi,depthBuffer:!1},s=jo(e,t,i);if(this._pingPongRenderTarget===null||this._pingPongRenderTarget.width!==e||this._pingPongRenderTarget.height!==t){this._pingPongRenderTarget!==null&&this._dispose(),this._pingPongRenderTarget=jo(e,t,i);const{_lodMax:r}=this;({sizeLods:this._sizeLods,lodPlanes:this._lodPlanes,sigmas:this._sigmas}=ep(r)),this._blurMaterial=tp(r,e,t)}return s}_compileMaterial(e){const t=new Vt(this._lodPlanes[0],e);this._renderer.compile(t,qr)}_sceneToCubeUV(e,t,i,s){const o=new Ut(90,1,t,i),l=[1,-1,1,1,1,1],c=[1,1,1,-1,-1,-1],u=this._renderer,f=u.autoClear,d=u.toneMapping;u.getClearColor(Ko),u.toneMapping=Hn,u.autoClear=!1;const m=new nc({name:"PMREM.Background",side:Rt,depthWrite:!1,depthTest:!1}),_=new Vt(new Es,m);let v=!1;const p=e.background;p?p.isColor&&(m.color.copy(p),e.background=null,v=!0):(m.color.copy(Ko),v=!0);for(let h=0;h<6;h++){const A=h%3;A===0?(o.up.set(0,l[h],0),o.lookAt(c[h],0,0)):A===1?(o.up.set(0,0,l[h]),o.lookAt(0,c[h],0)):(o.up.set(0,l[h],0),o.lookAt(0,0,c[h]));const S=this._cubeSize;Xs(s,A*S,h>2?S:0,S,S),u.setRenderTarget(s),v&&u.render(_,o),u.render(e,o)}_.geometry.dispose(),_.material.dispose(),u.toneMapping=d,u.autoClear=f,e.background=p}_textureToCubeUV(e,t){const i=this._renderer,s=e.mapping===Oi||e.mapping===Bi;s?(this._cubemapMaterial===null&&(this._cubemapMaterial=Qo()),this._cubemapMaterial.uniforms.flipEnvMap.value=e.isRenderTargetTexture===!1?-1:1):this._equirectMaterial===null&&(this._equirectMaterial=Jo());const r=s?this._cubemapMaterial:this._equirectMaterial,a=new Vt(this._lodPlanes[0],r),o=r.uniforms;o.envMap.value=e;const l=this._cubeSize;Xs(t,0,0,3*l,2*l),i.setRenderTarget(t),i.render(a,qr)}_applyPMREM(e){const t=this._renderer,i=t.autoClear;t.autoClear=!1;const s=this._lodPlanes.length;for(let r=1;r<s;r++){const a=Math.sqrt(this._sigmas[r]*this._sigmas[r]-this._sigmas[r-1]*this._sigmas[r-1]),o=$o[(s-r-1)%$o.length];this._blur(e,r-1,r,a,o)}t.autoClear=i}_blur(e,t,i,s,r){const a=this._pingPongRenderTarget;this._halfBlur(e,a,t,i,s,"latitudinal",r),this._halfBlur(a,e,i,i,s,"longitudinal",r)}_halfBlur(e,t,i,s,r,a,o){const l=this._renderer,c=this._blurMaterial;a!=="latitudinal"&&a!=="longitudinal"&&console.error("blur direction must be either latitudinal or longitudinal!");const u=3,f=new Vt(this._lodPlanes[s],c),d=c.uniforms,m=this._sizeLods[i]-1,_=isFinite(r)?Math.PI/(2*m):2*Math.PI/(2*ii-1),v=r/_,p=isFinite(r)?1+Math.floor(u*v):ii;p>ii&&console.warn(`sigmaRadians, ${r}, is too large and will clip, as it requested ${p} samples when the maximum is set to ${ii}`);const h=[];let A=0;for(let w=0;w<ii;++w){const D=w/v,E=Math.exp(-D*D/2);h.push(E),w===0?A+=E:w<p&&(A+=2*E)}for(let w=0;w<h.length;w++)h[w]=h[w]/A;d.envMap.value=e.texture,d.samples.value=p,d.weights.value=h,d.latitudinal.value=a==="latitudinal",o&&(d.poleAxis.value=o);const{_lodMax:S}=this;d.dTheta.value=_,d.mipInt.value=S-i;const g=this._sizeLods[s],P=3*g*(s>S-Ri?s-S+Ri:0),b=4*(this._cubeSize-g);Xs(t,P,b,3*g,2*g),l.setRenderTarget(t),l.render(f,qr)}}function ep(n){const e=[],t=[],i=[];let s=n;const r=n-Ri+1+Yo.length;for(let a=0;a<r;a++){const o=Math.pow(2,s);t.push(o);let l=1/o;a>n-Ri?l=Yo[a-n+Ri-1]:a===0&&(l=0),i.push(l);const c=1/(o-2),u=-c,f=1+c,d=[u,u,f,u,f,f,u,u,f,f,u,f],m=6,_=6,v=3,p=2,h=1,A=new Float32Array(v*_*m),S=new Float32Array(p*_*m),g=new Float32Array(h*_*m);for(let b=0;b<m;b++){const w=b%3*2/3-1,D=b>2?0:-1,E=[w,D,0,w+2/3,D,0,w+2/3,D+1,0,w,D,0,w+2/3,D+1,0,w,D+1,0];A.set(E,v*_*b),S.set(d,p*_*b);const M=[b,b,b,b,b,b];g.set(M,h*_*b)}const P=new rn;P.setAttribute("position",new ut(A,v)),P.setAttribute("uv",new ut(S,p)),P.setAttribute("faceIndex",new ut(g,h)),e.push(P),s>Ri&&s--}return{lodPlanes:e,sizeLods:t,sigmas:i}}function jo(n,e,t){const i=new Tn(n,e,t);return i.texture.mapping=mr,i.texture.name="PMREM.cubeUv",i.scissorTest=!0,i}function Xs(n,e,t,i,s){n.viewport.set(e,t,i,s),n.scissor.set(e,t,i,s)}function tp(n,e,t){const i=new Float32Array(ii),s=new N(0,1,0);return new wt({name:"SphericalGaussianBlur",defines:{n:ii,CUBEUV_TEXEL_WIDTH:1/e,CUBEUV_TEXEL_HEIGHT:1/t,CUBEUV_MAX_MIP:`${n}.0`},uniforms:{envMap:{value:null},samples:{value:1},weights:{value:i},latitudinal:{value:!1},dTheta:{value:0},mipInt:{value:0},poleAxis:{value:s}},vertexShader:ro(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			varying vec3 vOutputDirection;

			uniform sampler2D envMap;
			uniform int samples;
			uniform float weights[ n ];
			uniform bool latitudinal;
			uniform float dTheta;
			uniform float mipInt;
			uniform vec3 poleAxis;

			#define ENVMAP_TYPE_CUBE_UV
			#include <cube_uv_reflection_fragment>

			vec3 getSample( float theta, vec3 axis ) {

				float cosTheta = cos( theta );
				// Rodrigues' axis-angle rotation
				vec3 sampleDirection = vOutputDirection * cosTheta
					+ cross( axis, vOutputDirection ) * sin( theta )
					+ axis * dot( axis, vOutputDirection ) * ( 1.0 - cosTheta );

				return bilinearCubeUV( envMap, sampleDirection, mipInt );

			}

			void main() {

				vec3 axis = latitudinal ? poleAxis : cross( poleAxis, vOutputDirection );

				if ( all( equal( axis, vec3( 0.0 ) ) ) ) {

					axis = vec3( vOutputDirection.z, 0.0, - vOutputDirection.x );

				}

				axis = normalize( axis );

				gl_FragColor = vec4( 0.0, 0.0, 0.0, 1.0 );
				gl_FragColor.rgb += weights[ 0 ] * getSample( 0.0, axis );

				for ( int i = 1; i < n; i++ ) {

					if ( i >= samples ) {

						break;

					}

					float theta = dTheta * float( i );
					gl_FragColor.rgb += weights[ i ] * getSample( -1.0 * theta, axis );
					gl_FragColor.rgb += weights[ i ] * getSample( theta, axis );

				}

			}
		`,blending:Gn,depthTest:!1,depthWrite:!1})}function Jo(){return new wt({name:"EquirectangularToCubeUV",uniforms:{envMap:{value:null}},vertexShader:ro(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			varying vec3 vOutputDirection;

			uniform sampler2D envMap;

			#include <common>

			void main() {

				vec3 outputDirection = normalize( vOutputDirection );
				vec2 uv = equirectUv( outputDirection );

				gl_FragColor = vec4( texture2D ( envMap, uv ).rgb, 1.0 );

			}
		`,blending:Gn,depthTest:!1,depthWrite:!1})}function Qo(){return new wt({name:"CubemapToCubeUV",uniforms:{envMap:{value:null},flipEnvMap:{value:-1}},vertexShader:ro(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			uniform float flipEnvMap;

			varying vec3 vOutputDirection;

			uniform samplerCube envMap;

			void main() {

				gl_FragColor = textureCube( envMap, vec3( flipEnvMap * vOutputDirection.x, vOutputDirection.yz ) );

			}
		`,blending:Gn,depthTest:!1,depthWrite:!1})}function ro(){return`

		precision mediump float;
		precision mediump int;

		attribute float faceIndex;

		varying vec3 vOutputDirection;

		// RH coordinate system; PMREM face-indexing convention
		vec3 getDirection( vec2 uv, float face ) {

			uv = 2.0 * uv - 1.0;

			vec3 direction = vec3( uv, 1.0 );

			if ( face == 0.0 ) {

				direction = direction.zyx; // ( 1, v, u ) pos x

			} else if ( face == 1.0 ) {

				direction = direction.xzy;
				direction.xz *= -1.0; // ( -u, 1, -v ) pos y

			} else if ( face == 2.0 ) {

				direction.x *= -1.0; // ( -u, v, 1 ) pos z

			} else if ( face == 3.0 ) {

				direction = direction.zyx;
				direction.xz *= -1.0; // ( -1, v, -u ) neg x

			} else if ( face == 4.0 ) {

				direction = direction.xzy;
				direction.xy *= -1.0; // ( -u, -1, v ) neg y

			} else if ( face == 5.0 ) {

				direction.z *= -1.0; // ( u, v, -1 ) neg z

			}

			return direction;

		}

		void main() {

			vOutputDirection = getDirection( uv, faceIndex );
			gl_Position = vec4( position, 1.0 );

		}
	`}function np(n){let e=new WeakMap,t=null;function i(o){if(o&&o.isTexture){const l=o.mapping,c=l===ma||l===ga,u=l===Oi||l===Bi;if(c||u){let f=e.get(o);const d=f!==void 0?f.texture.pmremVersion:0;if(o.isRenderTargetTexture&&o.pmremVersion!==d)return t===null&&(t=new Zo(n)),f=c?t.fromEquirectangular(o,f):t.fromCubemap(o,f),f.texture.pmremVersion=o.pmremVersion,e.set(o,f),f.texture;if(f!==void 0)return f.texture;{const m=o.image;return c&&m&&m.height>0||u&&m&&s(m)?(t===null&&(t=new Zo(n)),f=c?t.fromEquirectangular(o):t.fromCubemap(o),f.texture.pmremVersion=o.pmremVersion,e.set(o,f),o.addEventListener("dispose",r),f.texture):null}}}return o}function s(o){let l=0;const c=6;for(let u=0;u<c;u++)o[u]!==void 0&&l++;return l===c}function r(o){const l=o.target;l.removeEventListener("dispose",r);const c=e.get(l);c!==void 0&&(e.delete(l),c.dispose())}function a(){e=new WeakMap,t!==null&&(t.dispose(),t=null)}return{get:i,dispose:a}}function ip(n){const e={};function t(i){if(e[i]!==void 0)return e[i];let s;switch(i){case"WEBGL_depth_texture":s=n.getExtension("WEBGL_depth_texture")||n.getExtension("MOZ_WEBGL_depth_texture")||n.getExtension("WEBKIT_WEBGL_depth_texture");break;case"EXT_texture_filter_anisotropic":s=n.getExtension("EXT_texture_filter_anisotropic")||n.getExtension("MOZ_EXT_texture_filter_anisotropic")||n.getExtension("WEBKIT_EXT_texture_filter_anisotropic");break;case"WEBGL_compressed_texture_s3tc":s=n.getExtension("WEBGL_compressed_texture_s3tc")||n.getExtension("MOZ_WEBGL_compressed_texture_s3tc")||n.getExtension("WEBKIT_WEBGL_compressed_texture_s3tc");break;case"WEBGL_compressed_texture_pvrtc":s=n.getExtension("WEBGL_compressed_texture_pvrtc")||n.getExtension("WEBKIT_WEBGL_compressed_texture_pvrtc");break;default:s=n.getExtension(i)}return e[i]=s,s}return{has:function(i){return t(i)!==null},init:function(){t("EXT_color_buffer_float"),t("WEBGL_clip_cull_distance"),t("OES_texture_float_linear"),t("EXT_color_buffer_half_float"),t("WEBGL_multisampled_render_to_texture"),t("WEBGL_render_shared_exponent")},get:function(i){const s=t(i);return s===null&&as("THREE.WebGLRenderer: "+i+" extension not supported."),s}}}function sp(n,e,t,i){const s={},r=new WeakMap;function a(f){const d=f.target;d.index!==null&&e.remove(d.index);for(const _ in d.attributes)e.remove(d.attributes[_]);for(const _ in d.morphAttributes){const v=d.morphAttributes[_];for(let p=0,h=v.length;p<h;p++)e.remove(v[p])}d.removeEventListener("dispose",a),delete s[d.id];const m=r.get(d);m&&(e.remove(m),r.delete(d)),i.releaseStatesOfGeometry(d),d.isInstancedBufferGeometry===!0&&delete d._maxInstanceCount,t.memory.geometries--}function o(f,d){return s[d.id]===!0||(d.addEventListener("dispose",a),s[d.id]=!0,t.memory.geometries++),d}function l(f){const d=f.attributes;for(const _ in d)e.update(d[_],n.ARRAY_BUFFER);const m=f.morphAttributes;for(const _ in m){const v=m[_];for(let p=0,h=v.length;p<h;p++)e.update(v[p],n.ARRAY_BUFFER)}}function c(f){const d=[],m=f.index,_=f.attributes.position;let v=0;if(m!==null){const A=m.array;v=m.version;for(let S=0,g=A.length;S<g;S+=3){const P=A[S+0],b=A[S+1],w=A[S+2];d.push(P,b,b,w,w,P)}}else if(_!==void 0){const A=_.array;v=_.version;for(let S=0,g=A.length/3-1;S<g;S+=3){const P=S+0,b=S+1,w=S+2;d.push(P,b,b,w,w,P)}}else return;const p=new(Zl(d)?sc:ic)(d,1);p.version=v;const h=r.get(f);h&&e.remove(h),r.set(f,p)}function u(f){const d=r.get(f);if(d){const m=f.index;m!==null&&d.version<m.version&&c(f)}else c(f);return r.get(f)}return{get:o,update:l,getWireframeAttribute:u}}function rp(n,e,t){let i;function s(d){i=d}let r,a;function o(d){r=d.type,a=d.bytesPerElement}function l(d,m){n.drawElements(i,m,r,d*a),t.update(m,i,1)}function c(d,m,_){_!==0&&(n.drawElementsInstanced(i,m,r,d*a,_),t.update(m,i,_))}function u(d,m,_){if(_===0)return;e.get("WEBGL_multi_draw").multiDrawElementsWEBGL(i,m,0,r,d,0,_);let p=0;for(let h=0;h<_;h++)p+=m[h];t.update(p,i,1)}function f(d,m,_,v){if(_===0)return;const p=e.get("WEBGL_multi_draw");if(p===null)for(let h=0;h<d.length;h++)c(d[h]/a,m[h],v[h]);else{p.multiDrawElementsInstancedWEBGL(i,m,0,r,d,0,v,0,_);let h=0;for(let A=0;A<_;A++)h+=m[A]*v[A];t.update(h,i,1)}}this.setMode=s,this.setIndex=o,this.render=l,this.renderInstances=c,this.renderMultiDraw=u,this.renderMultiDrawInstances=f}function ap(n){const e={geometries:0,textures:0},t={frame:0,calls:0,triangles:0,points:0,lines:0};function i(r,a,o){switch(t.calls++,a){case n.TRIANGLES:t.triangles+=o*(r/3);break;case n.LINES:t.lines+=o*(r/2);break;case n.LINE_STRIP:t.lines+=o*(r-1);break;case n.LINE_LOOP:t.lines+=o*r;break;case n.POINTS:t.points+=o*r;break;default:console.error("THREE.WebGLInfo: Unknown draw mode:",a);break}}function s(){t.calls=0,t.triangles=0,t.points=0,t.lines=0}return{memory:e,render:t,programs:null,autoReset:!0,reset:s,update:i}}function op(n,e,t){const i=new WeakMap,s=new tt;function r(a,o,l){const c=a.morphTargetInfluences,u=o.morphAttributes.position||o.morphAttributes.normal||o.morphAttributes.color,f=u!==void 0?u.length:0;let d=i.get(o);if(d===void 0||d.count!==f){let E=function(){w.dispose(),i.delete(o),o.removeEventListener("dispose",E)};d!==void 0&&d.texture.dispose();const m=o.morphAttributes.position!==void 0,_=o.morphAttributes.normal!==void 0,v=o.morphAttributes.color!==void 0,p=o.morphAttributes.position||[],h=o.morphAttributes.normal||[],A=o.morphAttributes.color||[];let S=0;m===!0&&(S=1),_===!0&&(S=2),v===!0&&(S=3);let g=o.attributes.position.count*S,P=1;g>e.maxTextureSize&&(P=Math.ceil(g/e.maxTextureSize),g=e.maxTextureSize);const b=new Float32Array(g*P*4*f),w=new Jl(b,g,P,f);w.type=un,w.needsUpdate=!0;const D=S*4;for(let M=0;M<f;M++){const C=p[M],H=h[M],F=A[M],W=g*P*4*M;for(let $=0;$<C.count;$++){const k=$*D;m===!0&&(s.fromBufferAttribute(C,$),b[W+k+0]=s.x,b[W+k+1]=s.y,b[W+k+2]=s.z,b[W+k+3]=0),_===!0&&(s.fromBufferAttribute(H,$),b[W+k+4]=s.x,b[W+k+5]=s.y,b[W+k+6]=s.z,b[W+k+7]=0),v===!0&&(s.fromBufferAttribute(F,$),b[W+k+8]=s.x,b[W+k+9]=s.y,b[W+k+10]=s.z,b[W+k+11]=F.itemSize===4?s.w:1)}}d={count:f,texture:w,size:new Ve(g,P)},i.set(o,d),o.addEventListener("dispose",E)}if(a.isInstancedMesh===!0&&a.morphTexture!==null)l.getUniforms().setValue(n,"morphTexture",a.morphTexture,t);else{let m=0;for(let v=0;v<c.length;v++)m+=c[v];const _=o.morphTargetsRelative?1:1-m;l.getUniforms().setValue(n,"morphTargetBaseInfluence",_),l.getUniforms().setValue(n,"morphTargetInfluences",c)}l.getUniforms().setValue(n,"morphTargetsTexture",d.texture,t),l.getUniforms().setValue(n,"morphTargetsTextureSize",d.size)}return{update:r}}function lp(n,e,t,i){let s=new WeakMap;function r(l){const c=i.render.frame,u=l.geometry,f=e.get(l,u);if(s.get(f)!==c&&(e.update(f),s.set(f,c)),l.isInstancedMesh&&(l.hasEventListener("dispose",o)===!1&&l.addEventListener("dispose",o),s.get(l)!==c&&(t.update(l.instanceMatrix,n.ARRAY_BUFFER),l.instanceColor!==null&&t.update(l.instanceColor,n.ARRAY_BUFFER),s.set(l,c))),l.isSkinnedMesh){const d=l.skeleton;s.get(d)!==c&&(d.update(),s.set(d,c))}return f}function a(){s=new WeakMap}function o(l){const c=l.target;c.removeEventListener("dispose",o),t.remove(c.instanceMatrix),c.instanceColor!==null&&t.remove(c.instanceColor)}return{update:r,dispose:a}}class hc extends St{constructor(e,t,i,s,r,a,o,l,c,u=Li){if(u!==Li&&u!==ki)throw new Error("DepthTexture format must be either THREE.DepthFormat or THREE.DepthStencilFormat");i===void 0&&u===Li&&(i=hi),i===void 0&&u===ki&&(i=zi),super(null,s,r,a,o,l,u,i,c),this.isDepthTexture=!0,this.image={width:e,height:t},this.magFilter=o!==void 0?o:ft,this.minFilter=l!==void 0?l:ft,this.flipY=!1,this.generateMipmaps=!1,this.compareFunction=null}copy(e){return super.copy(e),this.compareFunction=e.compareFunction,this}toJSON(e){const t=super.toJSON(e);return this.compareFunction!==null&&(t.compareFunction=this.compareFunction),t}}const fc=new St,el=new hc(1,1),dc=new Jl,pc=new Yu,mc=new oc,tl=[],nl=[],il=new Float32Array(16),sl=new Float32Array(9),rl=new Float32Array(4);function Zi(n,e,t){const i=n[0];if(i<=0||i>0)return n;const s=e*t;let r=tl[s];if(r===void 0&&(r=new Float32Array(s),tl[s]=r),e!==0){i.toArray(r,0);for(let a=1,o=0;a!==e;++a)o+=t,n[a].toArray(r,o)}return r}function dt(n,e){if(n.length!==e.length)return!1;for(let t=0,i=n.length;t<i;t++)if(n[t]!==e[t])return!1;return!0}function pt(n,e){for(let t=0,i=e.length;t<i;t++)n[t]=e[t]}function vr(n,e){let t=nl[e];t===void 0&&(t=new Int32Array(e),nl[e]=t);for(let i=0;i!==e;++i)t[i]=n.allocateTextureUnit();return t}function cp(n,e){const t=this.cache;t[0]!==e&&(n.uniform1f(this.addr,e),t[0]=e)}function up(n,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y)&&(n.uniform2f(this.addr,e.x,e.y),t[0]=e.x,t[1]=e.y);else{if(dt(t,e))return;n.uniform2fv(this.addr,e),pt(t,e)}}function hp(n,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z)&&(n.uniform3f(this.addr,e.x,e.y,e.z),t[0]=e.x,t[1]=e.y,t[2]=e.z);else if(e.r!==void 0)(t[0]!==e.r||t[1]!==e.g||t[2]!==e.b)&&(n.uniform3f(this.addr,e.r,e.g,e.b),t[0]=e.r,t[1]=e.g,t[2]=e.b);else{if(dt(t,e))return;n.uniform3fv(this.addr,e),pt(t,e)}}function fp(n,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z||t[3]!==e.w)&&(n.uniform4f(this.addr,e.x,e.y,e.z,e.w),t[0]=e.x,t[1]=e.y,t[2]=e.z,t[3]=e.w);else{if(dt(t,e))return;n.uniform4fv(this.addr,e),pt(t,e)}}function dp(n,e){const t=this.cache,i=e.elements;if(i===void 0){if(dt(t,e))return;n.uniformMatrix2fv(this.addr,!1,e),pt(t,e)}else{if(dt(t,i))return;rl.set(i),n.uniformMatrix2fv(this.addr,!1,rl),pt(t,i)}}function pp(n,e){const t=this.cache,i=e.elements;if(i===void 0){if(dt(t,e))return;n.uniformMatrix3fv(this.addr,!1,e),pt(t,e)}else{if(dt(t,i))return;sl.set(i),n.uniformMatrix3fv(this.addr,!1,sl),pt(t,i)}}function mp(n,e){const t=this.cache,i=e.elements;if(i===void 0){if(dt(t,e))return;n.uniformMatrix4fv(this.addr,!1,e),pt(t,e)}else{if(dt(t,i))return;il.set(i),n.uniformMatrix4fv(this.addr,!1,il),pt(t,i)}}function gp(n,e){const t=this.cache;t[0]!==e&&(n.uniform1i(this.addr,e),t[0]=e)}function _p(n,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y)&&(n.uniform2i(this.addr,e.x,e.y),t[0]=e.x,t[1]=e.y);else{if(dt(t,e))return;n.uniform2iv(this.addr,e),pt(t,e)}}function vp(n,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z)&&(n.uniform3i(this.addr,e.x,e.y,e.z),t[0]=e.x,t[1]=e.y,t[2]=e.z);else{if(dt(t,e))return;n.uniform3iv(this.addr,e),pt(t,e)}}function xp(n,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z||t[3]!==e.w)&&(n.uniform4i(this.addr,e.x,e.y,e.z,e.w),t[0]=e.x,t[1]=e.y,t[2]=e.z,t[3]=e.w);else{if(dt(t,e))return;n.uniform4iv(this.addr,e),pt(t,e)}}function Mp(n,e){const t=this.cache;t[0]!==e&&(n.uniform1ui(this.addr,e),t[0]=e)}function Sp(n,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y)&&(n.uniform2ui(this.addr,e.x,e.y),t[0]=e.x,t[1]=e.y);else{if(dt(t,e))return;n.uniform2uiv(this.addr,e),pt(t,e)}}function yp(n,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z)&&(n.uniform3ui(this.addr,e.x,e.y,e.z),t[0]=e.x,t[1]=e.y,t[2]=e.z);else{if(dt(t,e))return;n.uniform3uiv(this.addr,e),pt(t,e)}}function Ep(n,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z||t[3]!==e.w)&&(n.uniform4ui(this.addr,e.x,e.y,e.z,e.w),t[0]=e.x,t[1]=e.y,t[2]=e.z,t[3]=e.w);else{if(dt(t,e))return;n.uniform4uiv(this.addr,e),pt(t,e)}}function Tp(n,e,t){const i=this.cache,s=t.allocateTextureUnit();i[0]!==s&&(n.uniform1i(this.addr,s),i[0]=s);let r;this.type===n.SAMPLER_2D_SHADOW?(el.compareFunction=$l,r=el):r=fc,t.setTexture2D(e||r,s)}function Ap(n,e,t){const i=this.cache,s=t.allocateTextureUnit();i[0]!==s&&(n.uniform1i(this.addr,s),i[0]=s),t.setTexture3D(e||pc,s)}function bp(n,e,t){const i=this.cache,s=t.allocateTextureUnit();i[0]!==s&&(n.uniform1i(this.addr,s),i[0]=s),t.setTextureCube(e||mc,s)}function wp(n,e,t){const i=this.cache,s=t.allocateTextureUnit();i[0]!==s&&(n.uniform1i(this.addr,s),i[0]=s),t.setTexture2DArray(e||dc,s)}function Rp(n){switch(n){case 5126:return cp;case 35664:return up;case 35665:return hp;case 35666:return fp;case 35674:return dp;case 35675:return pp;case 35676:return mp;case 5124:case 35670:return gp;case 35667:case 35671:return _p;case 35668:case 35672:return vp;case 35669:case 35673:return xp;case 5125:return Mp;case 36294:return Sp;case 36295:return yp;case 36296:return Ep;case 35678:case 36198:case 36298:case 36306:case 35682:return Tp;case 35679:case 36299:case 36307:return Ap;case 35680:case 36300:case 36308:case 36293:return bp;case 36289:case 36303:case 36311:case 36292:return wp}}function Cp(n,e){n.uniform1fv(this.addr,e)}function Pp(n,e){const t=Zi(e,this.size,2);n.uniform2fv(this.addr,t)}function Dp(n,e){const t=Zi(e,this.size,3);n.uniform3fv(this.addr,t)}function Lp(n,e){const t=Zi(e,this.size,4);n.uniform4fv(this.addr,t)}function Ip(n,e){const t=Zi(e,this.size,4);n.uniformMatrix2fv(this.addr,!1,t)}function Up(n,e){const t=Zi(e,this.size,9);n.uniformMatrix3fv(this.addr,!1,t)}function Np(n,e){const t=Zi(e,this.size,16);n.uniformMatrix4fv(this.addr,!1,t)}function Fp(n,e){n.uniform1iv(this.addr,e)}function Op(n,e){n.uniform2iv(this.addr,e)}function Bp(n,e){n.uniform3iv(this.addr,e)}function zp(n,e){n.uniform4iv(this.addr,e)}function kp(n,e){n.uniform1uiv(this.addr,e)}function Gp(n,e){n.uniform2uiv(this.addr,e)}function Hp(n,e){n.uniform3uiv(this.addr,e)}function Vp(n,e){n.uniform4uiv(this.addr,e)}function Wp(n,e,t){const i=this.cache,s=e.length,r=vr(t,s);dt(i,r)||(n.uniform1iv(this.addr,r),pt(i,r));for(let a=0;a!==s;++a)t.setTexture2D(e[a]||fc,r[a])}function Xp(n,e,t){const i=this.cache,s=e.length,r=vr(t,s);dt(i,r)||(n.uniform1iv(this.addr,r),pt(i,r));for(let a=0;a!==s;++a)t.setTexture3D(e[a]||pc,r[a])}function qp(n,e,t){const i=this.cache,s=e.length,r=vr(t,s);dt(i,r)||(n.uniform1iv(this.addr,r),pt(i,r));for(let a=0;a!==s;++a)t.setTextureCube(e[a]||mc,r[a])}function Yp(n,e,t){const i=this.cache,s=e.length,r=vr(t,s);dt(i,r)||(n.uniform1iv(this.addr,r),pt(i,r));for(let a=0;a!==s;++a)t.setTexture2DArray(e[a]||dc,r[a])}function Kp(n){switch(n){case 5126:return Cp;case 35664:return Pp;case 35665:return Dp;case 35666:return Lp;case 35674:return Ip;case 35675:return Up;case 35676:return Np;case 5124:case 35670:return Fp;case 35667:case 35671:return Op;case 35668:case 35672:return Bp;case 35669:case 35673:return zp;case 5125:return kp;case 36294:return Gp;case 36295:return Hp;case 36296:return Vp;case 35678:case 36198:case 36298:case 36306:case 35682:return Wp;case 35679:case 36299:case 36307:return Xp;case 35680:case 36300:case 36308:case 36293:return qp;case 36289:case 36303:case 36311:case 36292:return Yp}}class $p{constructor(e,t,i){this.id=e,this.addr=i,this.cache=[],this.type=t.type,this.setValue=Rp(t.type)}}class Zp{constructor(e,t,i){this.id=e,this.addr=i,this.cache=[],this.type=t.type,this.size=t.size,this.setValue=Kp(t.type)}}class jp{constructor(e){this.id=e,this.seq=[],this.map={}}setValue(e,t,i){const s=this.seq;for(let r=0,a=s.length;r!==a;++r){const o=s[r];o.setValue(e,t[o.id],i)}}}const jr=/(\w+)(\])?(\[|\.)?/g;function al(n,e){n.seq.push(e),n.map[e.id]=e}function Jp(n,e,t){const i=n.name,s=i.length;for(jr.lastIndex=0;;){const r=jr.exec(i),a=jr.lastIndex;let o=r[1];const l=r[2]==="]",c=r[3];if(l&&(o=o|0),c===void 0||c==="["&&a+2===s){al(t,c===void 0?new $p(o,n,e):new Zp(o,n,e));break}else{let f=t.map[o];f===void 0&&(f=new jp(o),al(t,f)),t=f}}}class ir{constructor(e,t){this.seq=[],this.map={};const i=e.getProgramParameter(t,e.ACTIVE_UNIFORMS);for(let s=0;s<i;++s){const r=e.getActiveUniform(t,s),a=e.getUniformLocation(t,r.name);Jp(r,a,this)}}setValue(e,t,i,s){const r=this.map[t];r!==void 0&&r.setValue(e,i,s)}setOptional(e,t,i){const s=t[i];s!==void 0&&this.setValue(e,i,s)}static upload(e,t,i,s){for(let r=0,a=t.length;r!==a;++r){const o=t[r],l=i[o.id];l.needsUpdate!==!1&&o.setValue(e,l.value,s)}}static seqWithValue(e,t){const i=[];for(let s=0,r=e.length;s!==r;++s){const a=e[s];a.id in t&&i.push(a)}return i}}function ol(n,e,t){const i=n.createShader(e);return n.shaderSource(i,t),n.compileShader(i),i}const Qp=37297;let em=0;function tm(n,e){const t=n.split(`
`),i=[],s=Math.max(e-6,0),r=Math.min(e+6,t.length);for(let a=s;a<r;a++){const o=a+1;i.push(`${o===e?">":" "} ${o}: ${t[a]}`)}return i.join(`
`)}const ll=new Ne;function nm(n){qe._getMatrix(ll,qe.workingColorSpace,n);const e=`mat3( ${ll.elements.map(t=>t.toFixed(4))} )`;switch(qe.getTransfer(n)){case gr:return[e,"LinearTransferOETF"];case Je:return[e,"sRGBTransferOETF"];default:return console.warn("THREE.WebGLProgram: Unsupported color space: ",n),[e,"LinearTransferOETF"]}}function cl(n,e,t){const i=n.getShaderParameter(e,n.COMPILE_STATUS),s=n.getShaderInfoLog(e).trim();if(i&&s==="")return"";const r=/ERROR: 0:(\d+)/.exec(s);if(r){const a=parseInt(r[1]);return t.toUpperCase()+`

`+s+`

`+tm(n.getShaderSource(e),a)}else return s}function im(n,e){const t=nm(e);return[`vec4 ${n}( vec4 value ) {`,`	return ${t[1]}( vec4( value.rgb * ${t[0]}, value.a ) );`,"}"].join(`
`)}function sm(n,e){let t;switch(e){case xu:t="Linear";break;case Mu:t="Reinhard";break;case Su:t="Cineon";break;case yu:t="ACESFilmic";break;case Tu:t="AgX";break;case Au:t="Neutral";break;case Eu:t="Custom";break;default:console.warn("THREE.WebGLProgram: Unsupported toneMapping:",e),t="Linear"}return"vec3 "+n+"( vec3 color ) { return "+t+"ToneMapping( color ); }"}const qs=new N;function rm(){qe.getLuminanceCoefficients(qs);const n=qs.x.toFixed(4),e=qs.y.toFixed(4),t=qs.z.toFixed(4);return["float luminance( const in vec3 rgb ) {",`	const vec3 weights = vec3( ${n}, ${e}, ${t} );`,"	return dot( weights, rgb );","}"].join(`
`)}function am(n){return[n.extensionClipCullDistance?"#extension GL_ANGLE_clip_cull_distance : require":"",n.extensionMultiDraw?"#extension GL_ANGLE_multi_draw : require":""].filter(os).join(`
`)}function om(n){const e=[];for(const t in n){const i=n[t];i!==!1&&e.push("#define "+t+" "+i)}return e.join(`
`)}function lm(n,e){const t={},i=n.getProgramParameter(e,n.ACTIVE_ATTRIBUTES);for(let s=0;s<i;s++){const r=n.getActiveAttrib(e,s),a=r.name;let o=1;r.type===n.FLOAT_MAT2&&(o=2),r.type===n.FLOAT_MAT3&&(o=3),r.type===n.FLOAT_MAT4&&(o=4),t[a]={type:r.type,location:n.getAttribLocation(e,a),locationSize:o}}return t}function os(n){return n!==""}function ul(n,e){const t=e.numSpotLightShadows+e.numSpotLightMaps-e.numSpotLightShadowsWithMaps;return n.replace(/NUM_DIR_LIGHTS/g,e.numDirLights).replace(/NUM_SPOT_LIGHTS/g,e.numSpotLights).replace(/NUM_SPOT_LIGHT_MAPS/g,e.numSpotLightMaps).replace(/NUM_SPOT_LIGHT_COORDS/g,t).replace(/NUM_RECT_AREA_LIGHTS/g,e.numRectAreaLights).replace(/NUM_POINT_LIGHTS/g,e.numPointLights).replace(/NUM_HEMI_LIGHTS/g,e.numHemiLights).replace(/NUM_DIR_LIGHT_SHADOWS/g,e.numDirLightShadows).replace(/NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS/g,e.numSpotLightShadowsWithMaps).replace(/NUM_SPOT_LIGHT_SHADOWS/g,e.numSpotLightShadows).replace(/NUM_POINT_LIGHT_SHADOWS/g,e.numPointLightShadows)}function hl(n,e){return n.replace(/NUM_CLIPPING_PLANES/g,e.numClippingPlanes).replace(/UNION_CLIPPING_PLANES/g,e.numClippingPlanes-e.numClipIntersection)}const cm=/^[ \t]*#include +<([\w\d./]+)>/gm;function qa(n){return n.replace(cm,hm)}const um=new Map;function hm(n,e){let t=Ge[e];if(t===void 0){const i=um.get(e);if(i!==void 0)t=Ge[i],console.warn('THREE.WebGLRenderer: Shader chunk "%s" has been deprecated. Use "%s" instead.',e,i);else throw new Error("Can not resolve #include <"+e+">")}return qa(t)}const fm=/#pragma unroll_loop_start\s+for\s*\(\s*int\s+i\s*=\s*(\d+)\s*;\s*i\s*<\s*(\d+)\s*;\s*i\s*\+\+\s*\)\s*{([\s\S]+?)}\s+#pragma unroll_loop_end/g;function fl(n){return n.replace(fm,dm)}function dm(n,e,t,i){let s="";for(let r=parseInt(e);r<parseInt(t);r++)s+=i.replace(/\[\s*i\s*\]/g,"[ "+r+" ]").replace(/UNROLLED_LOOP_INDEX/g,r);return s}function dl(n){let e=`precision ${n.precision} float;
	precision ${n.precision} int;
	precision ${n.precision} sampler2D;
	precision ${n.precision} samplerCube;
	precision ${n.precision} sampler3D;
	precision ${n.precision} sampler2DArray;
	precision ${n.precision} sampler2DShadow;
	precision ${n.precision} samplerCubeShadow;
	precision ${n.precision} sampler2DArrayShadow;
	precision ${n.precision} isampler2D;
	precision ${n.precision} isampler3D;
	precision ${n.precision} isamplerCube;
	precision ${n.precision} isampler2DArray;
	precision ${n.precision} usampler2D;
	precision ${n.precision} usampler3D;
	precision ${n.precision} usamplerCube;
	precision ${n.precision} usampler2DArray;
	`;return n.precision==="highp"?e+=`
#define HIGH_PRECISION`:n.precision==="mediump"?e+=`
#define MEDIUM_PRECISION`:n.precision==="lowp"&&(e+=`
#define LOW_PRECISION`),e}function pm(n){let e="SHADOWMAP_TYPE_BASIC";return n.shadowMapType===Fl?e="SHADOWMAP_TYPE_PCF":n.shadowMapType===eu?e="SHADOWMAP_TYPE_PCF_SOFT":n.shadowMapType===xn&&(e="SHADOWMAP_TYPE_VSM"),e}function mm(n){let e="ENVMAP_TYPE_CUBE";if(n.envMap)switch(n.envMapMode){case Oi:case Bi:e="ENVMAP_TYPE_CUBE";break;case mr:e="ENVMAP_TYPE_CUBE_UV";break}return e}function gm(n){let e="ENVMAP_MODE_REFLECTION";if(n.envMap)switch(n.envMapMode){case Bi:e="ENVMAP_MODE_REFRACTION";break}return e}function _m(n){let e="ENVMAP_BLENDING_NONE";if(n.envMap)switch(n.combine){case Ol:e="ENVMAP_BLENDING_MULTIPLY";break;case _u:e="ENVMAP_BLENDING_MIX";break;case vu:e="ENVMAP_BLENDING_ADD";break}return e}function vm(n){const e=n.envMapCubeUVHeight;if(e===null)return null;const t=Math.log2(e)-2,i=1/e;return{texelWidth:1/(3*Math.max(Math.pow(2,t),112)),texelHeight:i,maxMip:t}}function xm(n,e,t,i){const s=n.getContext(),r=t.defines;let a=t.vertexShader,o=t.fragmentShader;const l=pm(t),c=mm(t),u=gm(t),f=_m(t),d=vm(t),m=am(t),_=om(r),v=s.createProgram();let p,h,A=t.glslVersion?"#version "+t.glslVersion+`
`:"";t.isRawShaderMaterial?(p=["#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,_].filter(os).join(`
`),p.length>0&&(p+=`
`),h=["#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,_].filter(os).join(`
`),h.length>0&&(h+=`
`)):(p=[dl(t),"#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,_,t.extensionClipCullDistance?"#define USE_CLIP_DISTANCE":"",t.batching?"#define USE_BATCHING":"",t.batchingColor?"#define USE_BATCHING_COLOR":"",t.instancing?"#define USE_INSTANCING":"",t.instancingColor?"#define USE_INSTANCING_COLOR":"",t.instancingMorph?"#define USE_INSTANCING_MORPH":"",t.useFog&&t.fog?"#define USE_FOG":"",t.useFog&&t.fogExp2?"#define FOG_EXP2":"",t.map?"#define USE_MAP":"",t.envMap?"#define USE_ENVMAP":"",t.envMap?"#define "+u:"",t.lightMap?"#define USE_LIGHTMAP":"",t.aoMap?"#define USE_AOMAP":"",t.bumpMap?"#define USE_BUMPMAP":"",t.normalMap?"#define USE_NORMALMAP":"",t.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",t.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",t.displacementMap?"#define USE_DISPLACEMENTMAP":"",t.emissiveMap?"#define USE_EMISSIVEMAP":"",t.anisotropy?"#define USE_ANISOTROPY":"",t.anisotropyMap?"#define USE_ANISOTROPYMAP":"",t.clearcoatMap?"#define USE_CLEARCOATMAP":"",t.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",t.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",t.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",t.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",t.specularMap?"#define USE_SPECULARMAP":"",t.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",t.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",t.roughnessMap?"#define USE_ROUGHNESSMAP":"",t.metalnessMap?"#define USE_METALNESSMAP":"",t.alphaMap?"#define USE_ALPHAMAP":"",t.alphaHash?"#define USE_ALPHAHASH":"",t.transmission?"#define USE_TRANSMISSION":"",t.transmissionMap?"#define USE_TRANSMISSIONMAP":"",t.thicknessMap?"#define USE_THICKNESSMAP":"",t.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",t.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",t.mapUv?"#define MAP_UV "+t.mapUv:"",t.alphaMapUv?"#define ALPHAMAP_UV "+t.alphaMapUv:"",t.lightMapUv?"#define LIGHTMAP_UV "+t.lightMapUv:"",t.aoMapUv?"#define AOMAP_UV "+t.aoMapUv:"",t.emissiveMapUv?"#define EMISSIVEMAP_UV "+t.emissiveMapUv:"",t.bumpMapUv?"#define BUMPMAP_UV "+t.bumpMapUv:"",t.normalMapUv?"#define NORMALMAP_UV "+t.normalMapUv:"",t.displacementMapUv?"#define DISPLACEMENTMAP_UV "+t.displacementMapUv:"",t.metalnessMapUv?"#define METALNESSMAP_UV "+t.metalnessMapUv:"",t.roughnessMapUv?"#define ROUGHNESSMAP_UV "+t.roughnessMapUv:"",t.anisotropyMapUv?"#define ANISOTROPYMAP_UV "+t.anisotropyMapUv:"",t.clearcoatMapUv?"#define CLEARCOATMAP_UV "+t.clearcoatMapUv:"",t.clearcoatNormalMapUv?"#define CLEARCOAT_NORMALMAP_UV "+t.clearcoatNormalMapUv:"",t.clearcoatRoughnessMapUv?"#define CLEARCOAT_ROUGHNESSMAP_UV "+t.clearcoatRoughnessMapUv:"",t.iridescenceMapUv?"#define IRIDESCENCEMAP_UV "+t.iridescenceMapUv:"",t.iridescenceThicknessMapUv?"#define IRIDESCENCE_THICKNESSMAP_UV "+t.iridescenceThicknessMapUv:"",t.sheenColorMapUv?"#define SHEEN_COLORMAP_UV "+t.sheenColorMapUv:"",t.sheenRoughnessMapUv?"#define SHEEN_ROUGHNESSMAP_UV "+t.sheenRoughnessMapUv:"",t.specularMapUv?"#define SPECULARMAP_UV "+t.specularMapUv:"",t.specularColorMapUv?"#define SPECULAR_COLORMAP_UV "+t.specularColorMapUv:"",t.specularIntensityMapUv?"#define SPECULAR_INTENSITYMAP_UV "+t.specularIntensityMapUv:"",t.transmissionMapUv?"#define TRANSMISSIONMAP_UV "+t.transmissionMapUv:"",t.thicknessMapUv?"#define THICKNESSMAP_UV "+t.thicknessMapUv:"",t.vertexTangents&&t.flatShading===!1?"#define USE_TANGENT":"",t.vertexColors?"#define USE_COLOR":"",t.vertexAlphas?"#define USE_COLOR_ALPHA":"",t.vertexUv1s?"#define USE_UV1":"",t.vertexUv2s?"#define USE_UV2":"",t.vertexUv3s?"#define USE_UV3":"",t.pointsUvs?"#define USE_POINTS_UV":"",t.flatShading?"#define FLAT_SHADED":"",t.skinning?"#define USE_SKINNING":"",t.morphTargets?"#define USE_MORPHTARGETS":"",t.morphNormals&&t.flatShading===!1?"#define USE_MORPHNORMALS":"",t.morphColors?"#define USE_MORPHCOLORS":"",t.morphTargetsCount>0?"#define MORPHTARGETS_TEXTURE_STRIDE "+t.morphTextureStride:"",t.morphTargetsCount>0?"#define MORPHTARGETS_COUNT "+t.morphTargetsCount:"",t.doubleSided?"#define DOUBLE_SIDED":"",t.flipSided?"#define FLIP_SIDED":"",t.shadowMapEnabled?"#define USE_SHADOWMAP":"",t.shadowMapEnabled?"#define "+l:"",t.sizeAttenuation?"#define USE_SIZEATTENUATION":"",t.numLightProbes>0?"#define USE_LIGHT_PROBES":"",t.logarithmicDepthBuffer?"#define USE_LOGDEPTHBUF":"",t.reverseDepthBuffer?"#define USE_REVERSEDEPTHBUF":"","uniform mat4 modelMatrix;","uniform mat4 modelViewMatrix;","uniform mat4 projectionMatrix;","uniform mat4 viewMatrix;","uniform mat3 normalMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;","#ifdef USE_INSTANCING","	attribute mat4 instanceMatrix;","#endif","#ifdef USE_INSTANCING_COLOR","	attribute vec3 instanceColor;","#endif","#ifdef USE_INSTANCING_MORPH","	uniform sampler2D morphTexture;","#endif","attribute vec3 position;","attribute vec3 normal;","attribute vec2 uv;","#ifdef USE_UV1","	attribute vec2 uv1;","#endif","#ifdef USE_UV2","	attribute vec2 uv2;","#endif","#ifdef USE_UV3","	attribute vec2 uv3;","#endif","#ifdef USE_TANGENT","	attribute vec4 tangent;","#endif","#if defined( USE_COLOR_ALPHA )","	attribute vec4 color;","#elif defined( USE_COLOR )","	attribute vec3 color;","#endif","#ifdef USE_SKINNING","	attribute vec4 skinIndex;","	attribute vec4 skinWeight;","#endif",`
`].filter(os).join(`
`),h=[dl(t),"#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,_,t.useFog&&t.fog?"#define USE_FOG":"",t.useFog&&t.fogExp2?"#define FOG_EXP2":"",t.alphaToCoverage?"#define ALPHA_TO_COVERAGE":"",t.map?"#define USE_MAP":"",t.matcap?"#define USE_MATCAP":"",t.envMap?"#define USE_ENVMAP":"",t.envMap?"#define "+c:"",t.envMap?"#define "+u:"",t.envMap?"#define "+f:"",d?"#define CUBEUV_TEXEL_WIDTH "+d.texelWidth:"",d?"#define CUBEUV_TEXEL_HEIGHT "+d.texelHeight:"",d?"#define CUBEUV_MAX_MIP "+d.maxMip+".0":"",t.lightMap?"#define USE_LIGHTMAP":"",t.aoMap?"#define USE_AOMAP":"",t.bumpMap?"#define USE_BUMPMAP":"",t.normalMap?"#define USE_NORMALMAP":"",t.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",t.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",t.emissiveMap?"#define USE_EMISSIVEMAP":"",t.anisotropy?"#define USE_ANISOTROPY":"",t.anisotropyMap?"#define USE_ANISOTROPYMAP":"",t.clearcoat?"#define USE_CLEARCOAT":"",t.clearcoatMap?"#define USE_CLEARCOATMAP":"",t.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",t.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",t.dispersion?"#define USE_DISPERSION":"",t.iridescence?"#define USE_IRIDESCENCE":"",t.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",t.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",t.specularMap?"#define USE_SPECULARMAP":"",t.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",t.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",t.roughnessMap?"#define USE_ROUGHNESSMAP":"",t.metalnessMap?"#define USE_METALNESSMAP":"",t.alphaMap?"#define USE_ALPHAMAP":"",t.alphaTest?"#define USE_ALPHATEST":"",t.alphaHash?"#define USE_ALPHAHASH":"",t.sheen?"#define USE_SHEEN":"",t.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",t.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",t.transmission?"#define USE_TRANSMISSION":"",t.transmissionMap?"#define USE_TRANSMISSIONMAP":"",t.thicknessMap?"#define USE_THICKNESSMAP":"",t.vertexTangents&&t.flatShading===!1?"#define USE_TANGENT":"",t.vertexColors||t.instancingColor||t.batchingColor?"#define USE_COLOR":"",t.vertexAlphas?"#define USE_COLOR_ALPHA":"",t.vertexUv1s?"#define USE_UV1":"",t.vertexUv2s?"#define USE_UV2":"",t.vertexUv3s?"#define USE_UV3":"",t.pointsUvs?"#define USE_POINTS_UV":"",t.gradientMap?"#define USE_GRADIENTMAP":"",t.flatShading?"#define FLAT_SHADED":"",t.doubleSided?"#define DOUBLE_SIDED":"",t.flipSided?"#define FLIP_SIDED":"",t.shadowMapEnabled?"#define USE_SHADOWMAP":"",t.shadowMapEnabled?"#define "+l:"",t.premultipliedAlpha?"#define PREMULTIPLIED_ALPHA":"",t.numLightProbes>0?"#define USE_LIGHT_PROBES":"",t.decodeVideoTexture?"#define DECODE_VIDEO_TEXTURE":"",t.decodeVideoTextureEmissive?"#define DECODE_VIDEO_TEXTURE_EMISSIVE":"",t.logarithmicDepthBuffer?"#define USE_LOGDEPTHBUF":"",t.reverseDepthBuffer?"#define USE_REVERSEDEPTHBUF":"","uniform mat4 viewMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;",t.toneMapping!==Hn?"#define TONE_MAPPING":"",t.toneMapping!==Hn?Ge.tonemapping_pars_fragment:"",t.toneMapping!==Hn?sm("toneMapping",t.toneMapping):"",t.dithering?"#define DITHERING":"",t.opaque?"#define OPAQUE":"",Ge.colorspace_pars_fragment,im("linearToOutputTexel",t.outputColorSpace),rm(),t.useDepthPacking?"#define DEPTH_PACKING "+t.depthPacking:"",`
`].filter(os).join(`
`)),a=qa(a),a=ul(a,t),a=hl(a,t),o=qa(o),o=ul(o,t),o=hl(o,t),a=fl(a),o=fl(o),t.isRawShaderMaterial!==!0&&(A=`#version 300 es
`,p=[m,"#define attribute in","#define varying out","#define texture2D texture"].join(`
`)+`
`+p,h=["#define varying in",t.glslVersion===zn?"":"layout(location = 0) out highp vec4 pc_fragColor;",t.glslVersion===zn?"":"#define gl_FragColor pc_fragColor","#define gl_FragDepthEXT gl_FragDepth","#define texture2D texture","#define textureCube texture","#define texture2DProj textureProj","#define texture2DLodEXT textureLod","#define texture2DProjLodEXT textureProjLod","#define textureCubeLodEXT textureLod","#define texture2DGradEXT textureGrad","#define texture2DProjGradEXT textureProjGrad","#define textureCubeGradEXT textureGrad"].join(`
`)+`
`+h);const S=A+p+a,g=A+h+o,P=ol(s,s.VERTEX_SHADER,S),b=ol(s,s.FRAGMENT_SHADER,g);s.attachShader(v,P),s.attachShader(v,b),t.index0AttributeName!==void 0?s.bindAttribLocation(v,0,t.index0AttributeName):t.morphTargets===!0&&s.bindAttribLocation(v,0,"position"),s.linkProgram(v);function w(C){if(n.debug.checkShaderErrors){const H=s.getProgramInfoLog(v).trim(),F=s.getShaderInfoLog(P).trim(),W=s.getShaderInfoLog(b).trim();let $=!0,k=!0;if(s.getProgramParameter(v,s.LINK_STATUS)===!1)if($=!1,typeof n.debug.onShaderError=="function")n.debug.onShaderError(s,v,P,b);else{const j=cl(s,P,"vertex"),V=cl(s,b,"fragment");console.error("THREE.WebGLProgram: Shader Error "+s.getError()+" - VALIDATE_STATUS "+s.getProgramParameter(v,s.VALIDATE_STATUS)+`

Material Name: `+C.name+`
Material Type: `+C.type+`

Program Info Log: `+H+`
`+j+`
`+V)}else H!==""?console.warn("THREE.WebGLProgram: Program Info Log:",H):(F===""||W==="")&&(k=!1);k&&(C.diagnostics={runnable:$,programLog:H,vertexShader:{log:F,prefix:p},fragmentShader:{log:W,prefix:h}})}s.deleteShader(P),s.deleteShader(b),D=new ir(s,v),E=lm(s,v)}let D;this.getUniforms=function(){return D===void 0&&w(this),D};let E;this.getAttributes=function(){return E===void 0&&w(this),E};let M=t.rendererExtensionParallelShaderCompile===!1;return this.isReady=function(){return M===!1&&(M=s.getProgramParameter(v,Qp)),M},this.destroy=function(){i.releaseStatesOfProgram(this),s.deleteProgram(v),this.program=void 0},this.type=t.shaderType,this.name=t.shaderName,this.id=em++,this.cacheKey=e,this.usedTimes=1,this.program=v,this.vertexShader=P,this.fragmentShader=b,this}let Mm=0;class Sm{constructor(){this.shaderCache=new Map,this.materialCache=new Map}update(e){const t=e.vertexShader,i=e.fragmentShader,s=this._getShaderStage(t),r=this._getShaderStage(i),a=this._getShaderCacheForMaterial(e);return a.has(s)===!1&&(a.add(s),s.usedTimes++),a.has(r)===!1&&(a.add(r),r.usedTimes++),this}remove(e){const t=this.materialCache.get(e);for(const i of t)i.usedTimes--,i.usedTimes===0&&this.shaderCache.delete(i.code);return this.materialCache.delete(e),this}getVertexShaderID(e){return this._getShaderStage(e.vertexShader).id}getFragmentShaderID(e){return this._getShaderStage(e.fragmentShader).id}dispose(){this.shaderCache.clear(),this.materialCache.clear()}_getShaderCacheForMaterial(e){const t=this.materialCache;let i=t.get(e);return i===void 0&&(i=new Set,t.set(e,i)),i}_getShaderStage(e){const t=this.shaderCache;let i=t.get(e);return i===void 0&&(i=new ym(e),t.set(e,i)),i}}class ym{constructor(e){this.id=Mm++,this.code=e,this.usedTimes=0}}function Em(n,e,t,i,s,r,a){const o=new ec,l=new Sm,c=new Set,u=[],f=s.logarithmicDepthBuffer,d=s.vertexTextures;let m=s.precision;const _={MeshDepthMaterial:"depth",MeshDistanceMaterial:"distanceRGBA",MeshNormalMaterial:"normal",MeshBasicMaterial:"basic",MeshLambertMaterial:"lambert",MeshPhongMaterial:"phong",MeshToonMaterial:"toon",MeshStandardMaterial:"physical",MeshPhysicalMaterial:"physical",MeshMatcapMaterial:"matcap",LineBasicMaterial:"basic",LineDashedMaterial:"dashed",PointsMaterial:"points",ShadowMaterial:"shadow",SpriteMaterial:"sprite"};function v(E){return c.add(E),E===0?"uv":`uv${E}`}function p(E,M,C,H,F){const W=H.fog,$=F.geometry,k=E.isMeshStandardMaterial?H.environment:null,j=(E.isMeshStandardMaterial?t:e).get(E.envMap||k),V=j&&j.mapping===mr?j.image.height:null,ne=_[E.type];E.precision!==null&&(m=s.getMaxPrecision(E.precision),m!==E.precision&&console.warn("THREE.WebGLProgram.getParameters:",E.precision,"not supported, using",m,"instead."));const Q=$.morphAttributes.position||$.morphAttributes.normal||$.morphAttributes.color,re=Q!==void 0?Q.length:0;let be=0;$.morphAttributes.position!==void 0&&(be=1),$.morphAttributes.normal!==void 0&&(be=2),$.morphAttributes.color!==void 0&&(be=3);let Fe,B,Z,ce;if(ne){const Ze=on[ne];Fe=Ze.vertexShader,B=Ze.fragmentShader}else Fe=E.vertexShader,B=E.fragmentShader,l.update(E),Z=l.getVertexShaderID(E),ce=l.getFragmentShaderID(E);const ee=n.getRenderTarget(),ye=n.state.buffers.depth.getReversed(),Ce=F.isInstancedMesh===!0,te=F.isBatchedMesh===!0,oe=!!E.map,ve=!!E.matcap,De=!!j,R=!!E.aoMap,Oe=!!E.lightMap,he=!!E.bumpMap,Re=!!E.normalMap,me=!!E.displacementMap,Ie=!!E.emissiveMap,Se=!!E.metalnessMap,T=!!E.roughnessMap,x=E.anisotropy>0,O=E.clearcoat>0,K=E.dispersion>0,Y=E.iridescence>0,q=E.sheen>0,fe=E.transmission>0,ae=x&&!!E.anisotropyMap,xe=O&&!!E.clearcoatMap,He=O&&!!E.clearcoatNormalMap,ie=O&&!!E.clearcoatRoughnessMap,ge=Y&&!!E.iridescenceMap,Le=Y&&!!E.iridescenceThicknessMap,Pe=q&&!!E.sheenColorMap,Me=q&&!!E.sheenRoughnessMap,We=!!E.specularMap,ke=!!E.specularColorMap,Qe=!!E.specularIntensityMap,L=fe&&!!E.transmissionMap,ue=fe&&!!E.thicknessMap,X=!!E.gradientMap,J=!!E.alphaMap,_e=E.alphaTest>0,de=!!E.alphaHash,Be=!!E.extensions;let at=Hn;E.toneMapped&&(ee===null||ee.isXRRenderTarget===!0)&&(at=n.toneMapping);const vt={shaderID:ne,shaderType:E.type,shaderName:E.name,vertexShader:Fe,fragmentShader:B,defines:E.defines,customVertexShaderID:Z,customFragmentShaderID:ce,isRawShaderMaterial:E.isRawShaderMaterial===!0,glslVersion:E.glslVersion,precision:m,batching:te,batchingColor:te&&F._colorsTexture!==null,instancing:Ce,instancingColor:Ce&&F.instanceColor!==null,instancingMorph:Ce&&F.morphTexture!==null,supportsVertexTextures:d,outputColorSpace:ee===null?n.outputColorSpace:ee.isXRRenderTarget===!0?ee.texture.colorSpace:qi,alphaToCoverage:!!E.alphaToCoverage,map:oe,matcap:ve,envMap:De,envMapMode:De&&j.mapping,envMapCubeUVHeight:V,aoMap:R,lightMap:Oe,bumpMap:he,normalMap:Re,displacementMap:d&&me,emissiveMap:Ie,normalMapObjectSpace:Re&&E.normalMapType===Pu,normalMapTangentSpace:Re&&E.normalMapType===Cu,metalnessMap:Se,roughnessMap:T,anisotropy:x,anisotropyMap:ae,clearcoat:O,clearcoatMap:xe,clearcoatNormalMap:He,clearcoatRoughnessMap:ie,dispersion:K,iridescence:Y,iridescenceMap:ge,iridescenceThicknessMap:Le,sheen:q,sheenColorMap:Pe,sheenRoughnessMap:Me,specularMap:We,specularColorMap:ke,specularIntensityMap:Qe,transmission:fe,transmissionMap:L,thicknessMap:ue,gradientMap:X,opaque:E.transparent===!1&&E.blending===Di&&E.alphaToCoverage===!1,alphaMap:J,alphaTest:_e,alphaHash:de,combine:E.combine,mapUv:oe&&v(E.map.channel),aoMapUv:R&&v(E.aoMap.channel),lightMapUv:Oe&&v(E.lightMap.channel),bumpMapUv:he&&v(E.bumpMap.channel),normalMapUv:Re&&v(E.normalMap.channel),displacementMapUv:me&&v(E.displacementMap.channel),emissiveMapUv:Ie&&v(E.emissiveMap.channel),metalnessMapUv:Se&&v(E.metalnessMap.channel),roughnessMapUv:T&&v(E.roughnessMap.channel),anisotropyMapUv:ae&&v(E.anisotropyMap.channel),clearcoatMapUv:xe&&v(E.clearcoatMap.channel),clearcoatNormalMapUv:He&&v(E.clearcoatNormalMap.channel),clearcoatRoughnessMapUv:ie&&v(E.clearcoatRoughnessMap.channel),iridescenceMapUv:ge&&v(E.iridescenceMap.channel),iridescenceThicknessMapUv:Le&&v(E.iridescenceThicknessMap.channel),sheenColorMapUv:Pe&&v(E.sheenColorMap.channel),sheenRoughnessMapUv:Me&&v(E.sheenRoughnessMap.channel),specularMapUv:We&&v(E.specularMap.channel),specularColorMapUv:ke&&v(E.specularColorMap.channel),specularIntensityMapUv:Qe&&v(E.specularIntensityMap.channel),transmissionMapUv:L&&v(E.transmissionMap.channel),thicknessMapUv:ue&&v(E.thicknessMap.channel),alphaMapUv:J&&v(E.alphaMap.channel),vertexTangents:!!$.attributes.tangent&&(Re||x),vertexColors:E.vertexColors,vertexAlphas:E.vertexColors===!0&&!!$.attributes.color&&$.attributes.color.itemSize===4,pointsUvs:F.isPoints===!0&&!!$.attributes.uv&&(oe||J),fog:!!W,useFog:E.fog===!0,fogExp2:!!W&&W.isFogExp2,flatShading:E.flatShading===!0,sizeAttenuation:E.sizeAttenuation===!0,logarithmicDepthBuffer:f,reverseDepthBuffer:ye,skinning:F.isSkinnedMesh===!0,morphTargets:$.morphAttributes.position!==void 0,morphNormals:$.morphAttributes.normal!==void 0,morphColors:$.morphAttributes.color!==void 0,morphTargetsCount:re,morphTextureStride:be,numDirLights:M.directional.length,numPointLights:M.point.length,numSpotLights:M.spot.length,numSpotLightMaps:M.spotLightMap.length,numRectAreaLights:M.rectArea.length,numHemiLights:M.hemi.length,numDirLightShadows:M.directionalShadowMap.length,numPointLightShadows:M.pointShadowMap.length,numSpotLightShadows:M.spotShadowMap.length,numSpotLightShadowsWithMaps:M.numSpotLightShadowsWithMaps,numLightProbes:M.numLightProbes,numClippingPlanes:a.numPlanes,numClipIntersection:a.numIntersection,dithering:E.dithering,shadowMapEnabled:n.shadowMap.enabled&&C.length>0,shadowMapType:n.shadowMap.type,toneMapping:at,decodeVideoTexture:oe&&E.map.isVideoTexture===!0&&qe.getTransfer(E.map.colorSpace)===Je,decodeVideoTextureEmissive:Ie&&E.emissiveMap.isVideoTexture===!0&&qe.getTransfer(E.emissiveMap.colorSpace)===Je,premultipliedAlpha:E.premultipliedAlpha,doubleSided:E.side===ln,flipSided:E.side===Rt,useDepthPacking:E.depthPacking>=0,depthPacking:E.depthPacking||0,index0AttributeName:E.index0AttributeName,extensionClipCullDistance:Be&&E.extensions.clipCullDistance===!0&&i.has("WEBGL_clip_cull_distance"),extensionMultiDraw:(Be&&E.extensions.multiDraw===!0||te)&&i.has("WEBGL_multi_draw"),rendererExtensionParallelShaderCompile:i.has("KHR_parallel_shader_compile"),customProgramCacheKey:E.customProgramCacheKey()};return vt.vertexUv1s=c.has(1),vt.vertexUv2s=c.has(2),vt.vertexUv3s=c.has(3),c.clear(),vt}function h(E){const M=[];if(E.shaderID?M.push(E.shaderID):(M.push(E.customVertexShaderID),M.push(E.customFragmentShaderID)),E.defines!==void 0)for(const C in E.defines)M.push(C),M.push(E.defines[C]);return E.isRawShaderMaterial===!1&&(A(M,E),S(M,E),M.push(n.outputColorSpace)),M.push(E.customProgramCacheKey),M.join()}function A(E,M){E.push(M.precision),E.push(M.outputColorSpace),E.push(M.envMapMode),E.push(M.envMapCubeUVHeight),E.push(M.mapUv),E.push(M.alphaMapUv),E.push(M.lightMapUv),E.push(M.aoMapUv),E.push(M.bumpMapUv),E.push(M.normalMapUv),E.push(M.displacementMapUv),E.push(M.emissiveMapUv),E.push(M.metalnessMapUv),E.push(M.roughnessMapUv),E.push(M.anisotropyMapUv),E.push(M.clearcoatMapUv),E.push(M.clearcoatNormalMapUv),E.push(M.clearcoatRoughnessMapUv),E.push(M.iridescenceMapUv),E.push(M.iridescenceThicknessMapUv),E.push(M.sheenColorMapUv),E.push(M.sheenRoughnessMapUv),E.push(M.specularMapUv),E.push(M.specularColorMapUv),E.push(M.specularIntensityMapUv),E.push(M.transmissionMapUv),E.push(M.thicknessMapUv),E.push(M.combine),E.push(M.fogExp2),E.push(M.sizeAttenuation),E.push(M.morphTargetsCount),E.push(M.morphAttributeCount),E.push(M.numDirLights),E.push(M.numPointLights),E.push(M.numSpotLights),E.push(M.numSpotLightMaps),E.push(M.numHemiLights),E.push(M.numRectAreaLights),E.push(M.numDirLightShadows),E.push(M.numPointLightShadows),E.push(M.numSpotLightShadows),E.push(M.numSpotLightShadowsWithMaps),E.push(M.numLightProbes),E.push(M.shadowMapType),E.push(M.toneMapping),E.push(M.numClippingPlanes),E.push(M.numClipIntersection),E.push(M.depthPacking)}function S(E,M){o.disableAll(),M.supportsVertexTextures&&o.enable(0),M.instancing&&o.enable(1),M.instancingColor&&o.enable(2),M.instancingMorph&&o.enable(3),M.matcap&&o.enable(4),M.envMap&&o.enable(5),M.normalMapObjectSpace&&o.enable(6),M.normalMapTangentSpace&&o.enable(7),M.clearcoat&&o.enable(8),M.iridescence&&o.enable(9),M.alphaTest&&o.enable(10),M.vertexColors&&o.enable(11),M.vertexAlphas&&o.enable(12),M.vertexUv1s&&o.enable(13),M.vertexUv2s&&o.enable(14),M.vertexUv3s&&o.enable(15),M.vertexTangents&&o.enable(16),M.anisotropy&&o.enable(17),M.alphaHash&&o.enable(18),M.batching&&o.enable(19),M.dispersion&&o.enable(20),M.batchingColor&&o.enable(21),E.push(o.mask),o.disableAll(),M.fog&&o.enable(0),M.useFog&&o.enable(1),M.flatShading&&o.enable(2),M.logarithmicDepthBuffer&&o.enable(3),M.reverseDepthBuffer&&o.enable(4),M.skinning&&o.enable(5),M.morphTargets&&o.enable(6),M.morphNormals&&o.enable(7),M.morphColors&&o.enable(8),M.premultipliedAlpha&&o.enable(9),M.shadowMapEnabled&&o.enable(10),M.doubleSided&&o.enable(11),M.flipSided&&o.enable(12),M.useDepthPacking&&o.enable(13),M.dithering&&o.enable(14),M.transmission&&o.enable(15),M.sheen&&o.enable(16),M.opaque&&o.enable(17),M.pointsUvs&&o.enable(18),M.decodeVideoTexture&&o.enable(19),M.decodeVideoTextureEmissive&&o.enable(20),M.alphaToCoverage&&o.enable(21),E.push(o.mask)}function g(E){const M=_[E.type];let C;if(M){const H=on[M];C=rh.clone(H.uniforms)}else C=E.uniforms;return C}function P(E,M){let C;for(let H=0,F=u.length;H<F;H++){const W=u[H];if(W.cacheKey===M){C=W,++C.usedTimes;break}}return C===void 0&&(C=new xm(n,M,E,r),u.push(C)),C}function b(E){if(--E.usedTimes===0){const M=u.indexOf(E);u[M]=u[u.length-1],u.pop(),E.destroy()}}function w(E){l.remove(E)}function D(){l.dispose()}return{getParameters:p,getProgramCacheKey:h,getUniforms:g,acquireProgram:P,releaseProgram:b,releaseShaderCache:w,programs:u,dispose:D}}function Tm(){let n=new WeakMap;function e(a){return n.has(a)}function t(a){let o=n.get(a);return o===void 0&&(o={},n.set(a,o)),o}function i(a){n.delete(a)}function s(a,o,l){n.get(a)[o]=l}function r(){n=new WeakMap}return{has:e,get:t,remove:i,update:s,dispose:r}}function Am(n,e){return n.groupOrder!==e.groupOrder?n.groupOrder-e.groupOrder:n.renderOrder!==e.renderOrder?n.renderOrder-e.renderOrder:n.material.id!==e.material.id?n.material.id-e.material.id:n.z!==e.z?n.z-e.z:n.id-e.id}function pl(n,e){return n.groupOrder!==e.groupOrder?n.groupOrder-e.groupOrder:n.renderOrder!==e.renderOrder?n.renderOrder-e.renderOrder:n.z!==e.z?e.z-n.z:n.id-e.id}function ml(){const n=[];let e=0;const t=[],i=[],s=[];function r(){e=0,t.length=0,i.length=0,s.length=0}function a(f,d,m,_,v,p){let h=n[e];return h===void 0?(h={id:f.id,object:f,geometry:d,material:m,groupOrder:_,renderOrder:f.renderOrder,z:v,group:p},n[e]=h):(h.id=f.id,h.object=f,h.geometry=d,h.material=m,h.groupOrder=_,h.renderOrder=f.renderOrder,h.z=v,h.group=p),e++,h}function o(f,d,m,_,v,p){const h=a(f,d,m,_,v,p);m.transmission>0?i.push(h):m.transparent===!0?s.push(h):t.push(h)}function l(f,d,m,_,v,p){const h=a(f,d,m,_,v,p);m.transmission>0?i.unshift(h):m.transparent===!0?s.unshift(h):t.unshift(h)}function c(f,d){t.length>1&&t.sort(f||Am),i.length>1&&i.sort(d||pl),s.length>1&&s.sort(d||pl)}function u(){for(let f=e,d=n.length;f<d;f++){const m=n[f];if(m.id===null)break;m.id=null,m.object=null,m.geometry=null,m.material=null,m.group=null}}return{opaque:t,transmissive:i,transparent:s,init:r,push:o,unshift:l,finish:u,sort:c}}function bm(){let n=new WeakMap;function e(i,s){const r=n.get(i);let a;return r===void 0?(a=new ml,n.set(i,[a])):s>=r.length?(a=new ml,r.push(a)):a=r[s],a}function t(){n=new WeakMap}return{get:e,dispose:t}}function wm(){const n={};return{get:function(e){if(n[e.id]!==void 0)return n[e.id];let t;switch(e.type){case"DirectionalLight":t={direction:new N,color:new je};break;case"SpotLight":t={position:new N,direction:new N,color:new je,distance:0,coneCos:0,penumbraCos:0,decay:0};break;case"PointLight":t={position:new N,color:new je,distance:0,decay:0};break;case"HemisphereLight":t={direction:new N,skyColor:new je,groundColor:new je};break;case"RectAreaLight":t={color:new je,position:new N,halfWidth:new N,halfHeight:new N};break}return n[e.id]=t,t}}}function Rm(){const n={};return{get:function(e){if(n[e.id]!==void 0)return n[e.id];let t;switch(e.type){case"DirectionalLight":t={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new Ve};break;case"SpotLight":t={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new Ve};break;case"PointLight":t={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new Ve,shadowCameraNear:1,shadowCameraFar:1e3};break}return n[e.id]=t,t}}}let Cm=0;function Pm(n,e){return(e.castShadow?2:0)-(n.castShadow?2:0)+(e.map?1:0)-(n.map?1:0)}function Dm(n){const e=new wm,t=Rm(),i={version:0,hash:{directionalLength:-1,pointLength:-1,spotLength:-1,rectAreaLength:-1,hemiLength:-1,numDirectionalShadows:-1,numPointShadows:-1,numSpotShadows:-1,numSpotMaps:-1,numLightProbes:-1},ambient:[0,0,0],probe:[],directional:[],directionalShadow:[],directionalShadowMap:[],directionalShadowMatrix:[],spot:[],spotLightMap:[],spotShadow:[],spotShadowMap:[],spotLightMatrix:[],rectArea:[],rectAreaLTC1:null,rectAreaLTC2:null,point:[],pointShadow:[],pointShadowMap:[],pointShadowMatrix:[],hemi:[],numSpotLightShadowsWithMaps:0,numLightProbes:0};for(let c=0;c<9;c++)i.probe.push(new N);const s=new N,r=new rt,a=new rt;function o(c){let u=0,f=0,d=0;for(let E=0;E<9;E++)i.probe[E].set(0,0,0);let m=0,_=0,v=0,p=0,h=0,A=0,S=0,g=0,P=0,b=0,w=0;c.sort(Pm);for(let E=0,M=c.length;E<M;E++){const C=c[E],H=C.color,F=C.intensity,W=C.distance,$=C.shadow&&C.shadow.map?C.shadow.map.texture:null;if(C.isAmbientLight)u+=H.r*F,f+=H.g*F,d+=H.b*F;else if(C.isLightProbe){for(let k=0;k<9;k++)i.probe[k].addScaledVector(C.sh.coefficients[k],F);w++}else if(C.isDirectionalLight){const k=e.get(C);if(k.color.copy(C.color).multiplyScalar(C.intensity),C.castShadow){const j=C.shadow,V=t.get(C);V.shadowIntensity=j.intensity,V.shadowBias=j.bias,V.shadowNormalBias=j.normalBias,V.shadowRadius=j.radius,V.shadowMapSize=j.mapSize,i.directionalShadow[m]=V,i.directionalShadowMap[m]=$,i.directionalShadowMatrix[m]=C.shadow.matrix,A++}i.directional[m]=k,m++}else if(C.isSpotLight){const k=e.get(C);k.position.setFromMatrixPosition(C.matrixWorld),k.color.copy(H).multiplyScalar(F),k.distance=W,k.coneCos=Math.cos(C.angle),k.penumbraCos=Math.cos(C.angle*(1-C.penumbra)),k.decay=C.decay,i.spot[v]=k;const j=C.shadow;if(C.map&&(i.spotLightMap[P]=C.map,P++,j.updateMatrices(C),C.castShadow&&b++),i.spotLightMatrix[v]=j.matrix,C.castShadow){const V=t.get(C);V.shadowIntensity=j.intensity,V.shadowBias=j.bias,V.shadowNormalBias=j.normalBias,V.shadowRadius=j.radius,V.shadowMapSize=j.mapSize,i.spotShadow[v]=V,i.spotShadowMap[v]=$,g++}v++}else if(C.isRectAreaLight){const k=e.get(C);k.color.copy(H).multiplyScalar(F),k.halfWidth.set(C.width*.5,0,0),k.halfHeight.set(0,C.height*.5,0),i.rectArea[p]=k,p++}else if(C.isPointLight){const k=e.get(C);if(k.color.copy(C.color).multiplyScalar(C.intensity),k.distance=C.distance,k.decay=C.decay,C.castShadow){const j=C.shadow,V=t.get(C);V.shadowIntensity=j.intensity,V.shadowBias=j.bias,V.shadowNormalBias=j.normalBias,V.shadowRadius=j.radius,V.shadowMapSize=j.mapSize,V.shadowCameraNear=j.camera.near,V.shadowCameraFar=j.camera.far,i.pointShadow[_]=V,i.pointShadowMap[_]=$,i.pointShadowMatrix[_]=C.shadow.matrix,S++}i.point[_]=k,_++}else if(C.isHemisphereLight){const k=e.get(C);k.skyColor.copy(C.color).multiplyScalar(F),k.groundColor.copy(C.groundColor).multiplyScalar(F),i.hemi[h]=k,h++}}p>0&&(n.has("OES_texture_float_linear")===!0?(i.rectAreaLTC1=le.LTC_FLOAT_1,i.rectAreaLTC2=le.LTC_FLOAT_2):(i.rectAreaLTC1=le.LTC_HALF_1,i.rectAreaLTC2=le.LTC_HALF_2)),i.ambient[0]=u,i.ambient[1]=f,i.ambient[2]=d;const D=i.hash;(D.directionalLength!==m||D.pointLength!==_||D.spotLength!==v||D.rectAreaLength!==p||D.hemiLength!==h||D.numDirectionalShadows!==A||D.numPointShadows!==S||D.numSpotShadows!==g||D.numSpotMaps!==P||D.numLightProbes!==w)&&(i.directional.length=m,i.spot.length=v,i.rectArea.length=p,i.point.length=_,i.hemi.length=h,i.directionalShadow.length=A,i.directionalShadowMap.length=A,i.pointShadow.length=S,i.pointShadowMap.length=S,i.spotShadow.length=g,i.spotShadowMap.length=g,i.directionalShadowMatrix.length=A,i.pointShadowMatrix.length=S,i.spotLightMatrix.length=g+P-b,i.spotLightMap.length=P,i.numSpotLightShadowsWithMaps=b,i.numLightProbes=w,D.directionalLength=m,D.pointLength=_,D.spotLength=v,D.rectAreaLength=p,D.hemiLength=h,D.numDirectionalShadows=A,D.numPointShadows=S,D.numSpotShadows=g,D.numSpotMaps=P,D.numLightProbes=w,i.version=Cm++)}function l(c,u){let f=0,d=0,m=0,_=0,v=0;const p=u.matrixWorldInverse;for(let h=0,A=c.length;h<A;h++){const S=c[h];if(S.isDirectionalLight){const g=i.directional[f];g.direction.setFromMatrixPosition(S.matrixWorld),s.setFromMatrixPosition(S.target.matrixWorld),g.direction.sub(s),g.direction.transformDirection(p),f++}else if(S.isSpotLight){const g=i.spot[m];g.position.setFromMatrixPosition(S.matrixWorld),g.position.applyMatrix4(p),g.direction.setFromMatrixPosition(S.matrixWorld),s.setFromMatrixPosition(S.target.matrixWorld),g.direction.sub(s),g.direction.transformDirection(p),m++}else if(S.isRectAreaLight){const g=i.rectArea[_];g.position.setFromMatrixPosition(S.matrixWorld),g.position.applyMatrix4(p),a.identity(),r.copy(S.matrixWorld),r.premultiply(p),a.extractRotation(r),g.halfWidth.set(S.width*.5,0,0),g.halfHeight.set(0,S.height*.5,0),g.halfWidth.applyMatrix4(a),g.halfHeight.applyMatrix4(a),_++}else if(S.isPointLight){const g=i.point[d];g.position.setFromMatrixPosition(S.matrixWorld),g.position.applyMatrix4(p),d++}else if(S.isHemisphereLight){const g=i.hemi[v];g.direction.setFromMatrixPosition(S.matrixWorld),g.direction.transformDirection(p),v++}}}return{setup:o,setupView:l,state:i}}function gl(n){const e=new Dm(n),t=[],i=[];function s(u){c.camera=u,t.length=0,i.length=0}function r(u){t.push(u)}function a(u){i.push(u)}function o(){e.setup(t)}function l(u){e.setupView(t,u)}const c={lightsArray:t,shadowsArray:i,camera:null,lights:e,transmissionRenderTarget:{}};return{init:s,state:c,setupLights:o,setupLightsView:l,pushLight:r,pushShadow:a}}function Lm(n){let e=new WeakMap;function t(s,r=0){const a=e.get(s);let o;return a===void 0?(o=new gl(n),e.set(s,[o])):r>=a.length?(o=new gl(n),a.push(o)):o=a[r],o}function i(){e=new WeakMap}return{get:t,dispose:i}}class Im extends ys{static get type(){return"MeshDepthMaterial"}constructor(e){super(),this.isMeshDepthMaterial=!0,this.depthPacking=wu,this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.wireframe=!1,this.wireframeLinewidth=1,this.setValues(e)}copy(e){return super.copy(e),this.depthPacking=e.depthPacking,this.map=e.map,this.alphaMap=e.alphaMap,this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this}}class Um extends ys{static get type(){return"MeshDistanceMaterial"}constructor(e){super(),this.isMeshDistanceMaterial=!0,this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.setValues(e)}copy(e){return super.copy(e),this.map=e.map,this.alphaMap=e.alphaMap,this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this}}const Nm=`void main() {
	gl_Position = vec4( position, 1.0 );
}`,Fm=`uniform sampler2D shadow_pass;
uniform vec2 resolution;
uniform float radius;
#include <packing>
void main() {
	const float samples = float( VSM_SAMPLES );
	float mean = 0.0;
	float squared_mean = 0.0;
	float uvStride = samples <= 1.0 ? 0.0 : 2.0 / ( samples - 1.0 );
	float uvStart = samples <= 1.0 ? 0.0 : - 1.0;
	for ( float i = 0.0; i < samples; i ++ ) {
		float uvOffset = uvStart + i * uvStride;
		#ifdef HORIZONTAL_PASS
			vec2 distribution = unpackRGBATo2Half( texture2D( shadow_pass, ( gl_FragCoord.xy + vec2( uvOffset, 0.0 ) * radius ) / resolution ) );
			mean += distribution.x;
			squared_mean += distribution.y * distribution.y + distribution.x * distribution.x;
		#else
			float depth = unpackRGBAToDepth( texture2D( shadow_pass, ( gl_FragCoord.xy + vec2( 0.0, uvOffset ) * radius ) / resolution ) );
			mean += depth;
			squared_mean += depth * depth;
		#endif
	}
	mean = mean / samples;
	squared_mean = squared_mean / samples;
	float std_dev = sqrt( squared_mean - mean * mean );
	gl_FragColor = pack2HalfToRGBA( vec2( mean, std_dev ) );
}`;function Om(n,e,t){let i=new lc;const s=new Ve,r=new Ve,a=new tt,o=new Im({depthPacking:Ru}),l=new Um,c={},u=t.maxTextureSize,f={[Xn]:Rt,[Rt]:Xn,[ln]:ln},d=new wt({defines:{VSM_SAMPLES:8},uniforms:{shadow_pass:{value:null},resolution:{value:new Ve},radius:{value:4}},vertexShader:Nm,fragmentShader:Fm}),m=d.clone();m.defines.HORIZONTAL_PASS=1;const _=new rn;_.setAttribute("position",new ut(new Float32Array([-1,-1,.5,3,-1,.5,-1,3,.5]),3));const v=new Vt(_,d),p=this;this.enabled=!1,this.autoUpdate=!0,this.needsUpdate=!1,this.type=Fl;let h=this.type;this.render=function(b,w,D){if(p.enabled===!1||p.autoUpdate===!1&&p.needsUpdate===!1||b.length===0)return;const E=n.getRenderTarget(),M=n.getActiveCubeFace(),C=n.getActiveMipmapLevel(),H=n.state;H.setBlending(Gn),H.buffers.color.setClear(1,1,1,1),H.buffers.depth.setTest(!0),H.setScissorTest(!1);const F=h!==xn&&this.type===xn,W=h===xn&&this.type!==xn;for(let $=0,k=b.length;$<k;$++){const j=b[$],V=j.shadow;if(V===void 0){console.warn("THREE.WebGLShadowMap:",j,"has no shadow.");continue}if(V.autoUpdate===!1&&V.needsUpdate===!1)continue;s.copy(V.mapSize);const ne=V.getFrameExtents();if(s.multiply(ne),r.copy(V.mapSize),(s.x>u||s.y>u)&&(s.x>u&&(r.x=Math.floor(u/ne.x),s.x=r.x*ne.x,V.mapSize.x=r.x),s.y>u&&(r.y=Math.floor(u/ne.y),s.y=r.y*ne.y,V.mapSize.y=r.y)),V.map===null||F===!0||W===!0){const re=this.type!==xn?{minFilter:ft,magFilter:ft}:{};V.map!==null&&V.map.dispose(),V.map=new Tn(s.x,s.y,re),V.map.texture.name=j.name+".shadowMap",V.camera.updateProjectionMatrix()}n.setRenderTarget(V.map),n.clear();const Q=V.getViewportCount();for(let re=0;re<Q;re++){const be=V.getViewport(re);a.set(r.x*be.x,r.y*be.y,r.x*be.z,r.y*be.w),H.viewport(a),V.updateMatrices(j,re),i=V.getFrustum(),g(w,D,V.camera,j,this.type)}V.isPointLightShadow!==!0&&this.type===xn&&A(V,D),V.needsUpdate=!1}h=this.type,p.needsUpdate=!1,n.setRenderTarget(E,M,C)};function A(b,w){const D=e.update(v);d.defines.VSM_SAMPLES!==b.blurSamples&&(d.defines.VSM_SAMPLES=b.blurSamples,m.defines.VSM_SAMPLES=b.blurSamples,d.needsUpdate=!0,m.needsUpdate=!0),b.mapPass===null&&(b.mapPass=new Tn(s.x,s.y)),d.uniforms.shadow_pass.value=b.map.texture,d.uniforms.resolution.value=b.mapSize,d.uniforms.radius.value=b.radius,n.setRenderTarget(b.mapPass),n.clear(),n.renderBufferDirect(w,null,D,d,v,null),m.uniforms.shadow_pass.value=b.mapPass.texture,m.uniforms.resolution.value=b.mapSize,m.uniforms.radius.value=b.radius,n.setRenderTarget(b.map),n.clear(),n.renderBufferDirect(w,null,D,m,v,null)}function S(b,w,D,E){let M=null;const C=D.isPointLight===!0?b.customDistanceMaterial:b.customDepthMaterial;if(C!==void 0)M=C;else if(M=D.isPointLight===!0?l:o,n.localClippingEnabled&&w.clipShadows===!0&&Array.isArray(w.clippingPlanes)&&w.clippingPlanes.length!==0||w.displacementMap&&w.displacementScale!==0||w.alphaMap&&w.alphaTest>0||w.map&&w.alphaTest>0){const H=M.uuid,F=w.uuid;let W=c[H];W===void 0&&(W={},c[H]=W);let $=W[F];$===void 0&&($=M.clone(),W[F]=$,w.addEventListener("dispose",P)),M=$}if(M.visible=w.visible,M.wireframe=w.wireframe,E===xn?M.side=w.shadowSide!==null?w.shadowSide:w.side:M.side=w.shadowSide!==null?w.shadowSide:f[w.side],M.alphaMap=w.alphaMap,M.alphaTest=w.alphaTest,M.map=w.map,M.clipShadows=w.clipShadows,M.clippingPlanes=w.clippingPlanes,M.clipIntersection=w.clipIntersection,M.displacementMap=w.displacementMap,M.displacementScale=w.displacementScale,M.displacementBias=w.displacementBias,M.wireframeLinewidth=w.wireframeLinewidth,M.linewidth=w.linewidth,D.isPointLight===!0&&M.isMeshDistanceMaterial===!0){const H=n.properties.get(M);H.light=D}return M}function g(b,w,D,E,M){if(b.visible===!1)return;if(b.layers.test(w.layers)&&(b.isMesh||b.isLine||b.isPoints)&&(b.castShadow||b.receiveShadow&&M===xn)&&(!b.frustumCulled||i.intersectsObject(b))){b.modelViewMatrix.multiplyMatrices(D.matrixWorldInverse,b.matrixWorld);const F=e.update(b),W=b.material;if(Array.isArray(W)){const $=F.groups;for(let k=0,j=$.length;k<j;k++){const V=$[k],ne=W[V.materialIndex];if(ne&&ne.visible){const Q=S(b,ne,E,M);b.onBeforeShadow(n,b,w,D,F,Q,V),n.renderBufferDirect(D,null,F,Q,b,V),b.onAfterShadow(n,b,w,D,F,Q,V)}}}else if(W.visible){const $=S(b,W,E,M);b.onBeforeShadow(n,b,w,D,F,$,null),n.renderBufferDirect(D,null,F,$,b,null),b.onAfterShadow(n,b,w,D,F,$,null)}}const H=b.children;for(let F=0,W=H.length;F<W;F++)g(H[F],w,D,E,M)}function P(b){b.target.removeEventListener("dispose",P);for(const D in c){const E=c[D],M=b.target.uuid;M in E&&(E[M].dispose(),delete E[M])}}}const Bm={[la]:ca,[ua]:da,[ha]:pa,[Fi]:fa,[ca]:la,[da]:ua,[pa]:ha,[fa]:Fi};function zm(n,e){function t(){let L=!1;const ue=new tt;let X=null;const J=new tt(0,0,0,0);return{setMask:function(_e){X!==_e&&!L&&(n.colorMask(_e,_e,_e,_e),X=_e)},setLocked:function(_e){L=_e},setClear:function(_e,de,Be,at,vt){vt===!0&&(_e*=at,de*=at,Be*=at),ue.set(_e,de,Be,at),J.equals(ue)===!1&&(n.clearColor(_e,de,Be,at),J.copy(ue))},reset:function(){L=!1,X=null,J.set(-1,0,0,0)}}}function i(){let L=!1,ue=!1,X=null,J=null,_e=null;return{setReversed:function(de){if(ue!==de){const Be=e.get("EXT_clip_control");ue?Be.clipControlEXT(Be.LOWER_LEFT_EXT,Be.ZERO_TO_ONE_EXT):Be.clipControlEXT(Be.LOWER_LEFT_EXT,Be.NEGATIVE_ONE_TO_ONE_EXT);const at=_e;_e=null,this.setClear(at)}ue=de},getReversed:function(){return ue},setTest:function(de){de?ee(n.DEPTH_TEST):ye(n.DEPTH_TEST)},setMask:function(de){X!==de&&!L&&(n.depthMask(de),X=de)},setFunc:function(de){if(ue&&(de=Bm[de]),J!==de){switch(de){case la:n.depthFunc(n.NEVER);break;case ca:n.depthFunc(n.ALWAYS);break;case ua:n.depthFunc(n.LESS);break;case Fi:n.depthFunc(n.LEQUAL);break;case ha:n.depthFunc(n.EQUAL);break;case fa:n.depthFunc(n.GEQUAL);break;case da:n.depthFunc(n.GREATER);break;case pa:n.depthFunc(n.NOTEQUAL);break;default:n.depthFunc(n.LEQUAL)}J=de}},setLocked:function(de){L=de},setClear:function(de){_e!==de&&(ue&&(de=1-de),n.clearDepth(de),_e=de)},reset:function(){L=!1,X=null,J=null,_e=null,ue=!1}}}function s(){let L=!1,ue=null,X=null,J=null,_e=null,de=null,Be=null,at=null,vt=null;return{setTest:function(Ze){L||(Ze?ee(n.STENCIL_TEST):ye(n.STENCIL_TEST))},setMask:function(Ze){ue!==Ze&&!L&&(n.stencilMask(Ze),ue=Ze)},setFunc:function(Ze,Yt,fn){(X!==Ze||J!==Yt||_e!==fn)&&(n.stencilFunc(Ze,Yt,fn),X=Ze,J=Yt,_e=fn)},setOp:function(Ze,Yt,fn){(de!==Ze||Be!==Yt||at!==fn)&&(n.stencilOp(Ze,Yt,fn),de=Ze,Be=Yt,at=fn)},setLocked:function(Ze){L=Ze},setClear:function(Ze){vt!==Ze&&(n.clearStencil(Ze),vt=Ze)},reset:function(){L=!1,ue=null,X=null,J=null,_e=null,de=null,Be=null,at=null,vt=null}}}const r=new t,a=new i,o=new s,l=new WeakMap,c=new WeakMap;let u={},f={},d=new WeakMap,m=[],_=null,v=!1,p=null,h=null,A=null,S=null,g=null,P=null,b=null,w=new je(0,0,0),D=0,E=!1,M=null,C=null,H=null,F=null,W=null;const $=n.getParameter(n.MAX_COMBINED_TEXTURE_IMAGE_UNITS);let k=!1,j=0;const V=n.getParameter(n.VERSION);V.indexOf("WebGL")!==-1?(j=parseFloat(/^WebGL (\d)/.exec(V)[1]),k=j>=1):V.indexOf("OpenGL ES")!==-1&&(j=parseFloat(/^OpenGL ES (\d)/.exec(V)[1]),k=j>=2);let ne=null,Q={};const re=n.getParameter(n.SCISSOR_BOX),be=n.getParameter(n.VIEWPORT),Fe=new tt().fromArray(re),B=new tt().fromArray(be);function Z(L,ue,X,J){const _e=new Uint8Array(4),de=n.createTexture();n.bindTexture(L,de),n.texParameteri(L,n.TEXTURE_MIN_FILTER,n.NEAREST),n.texParameteri(L,n.TEXTURE_MAG_FILTER,n.NEAREST);for(let Be=0;Be<X;Be++)L===n.TEXTURE_3D||L===n.TEXTURE_2D_ARRAY?n.texImage3D(ue,0,n.RGBA,1,1,J,0,n.RGBA,n.UNSIGNED_BYTE,_e):n.texImage2D(ue+Be,0,n.RGBA,1,1,0,n.RGBA,n.UNSIGNED_BYTE,_e);return de}const ce={};ce[n.TEXTURE_2D]=Z(n.TEXTURE_2D,n.TEXTURE_2D,1),ce[n.TEXTURE_CUBE_MAP]=Z(n.TEXTURE_CUBE_MAP,n.TEXTURE_CUBE_MAP_POSITIVE_X,6),ce[n.TEXTURE_2D_ARRAY]=Z(n.TEXTURE_2D_ARRAY,n.TEXTURE_2D_ARRAY,1,1),ce[n.TEXTURE_3D]=Z(n.TEXTURE_3D,n.TEXTURE_3D,1,1),r.setClear(0,0,0,1),a.setClear(1),o.setClear(0),ee(n.DEPTH_TEST),a.setFunc(Fi),he(!1),Re(So),ee(n.CULL_FACE),R(Gn);function ee(L){u[L]!==!0&&(n.enable(L),u[L]=!0)}function ye(L){u[L]!==!1&&(n.disable(L),u[L]=!1)}function Ce(L,ue){return f[L]!==ue?(n.bindFramebuffer(L,ue),f[L]=ue,L===n.DRAW_FRAMEBUFFER&&(f[n.FRAMEBUFFER]=ue),L===n.FRAMEBUFFER&&(f[n.DRAW_FRAMEBUFFER]=ue),!0):!1}function te(L,ue){let X=m,J=!1;if(L){X=d.get(ue),X===void 0&&(X=[],d.set(ue,X));const _e=L.textures;if(X.length!==_e.length||X[0]!==n.COLOR_ATTACHMENT0){for(let de=0,Be=_e.length;de<Be;de++)X[de]=n.COLOR_ATTACHMENT0+de;X.length=_e.length,J=!0}}else X[0]!==n.BACK&&(X[0]=n.BACK,J=!0);J&&n.drawBuffers(X)}function oe(L){return _!==L?(n.useProgram(L),_=L,!0):!1}const ve={[ni]:n.FUNC_ADD,[tu]:n.FUNC_SUBTRACT,[nu]:n.FUNC_REVERSE_SUBTRACT};ve[iu]=n.MIN,ve[su]=n.MAX;const De={[ru]:n.ZERO,[fs]:n.ONE,[au]:n.SRC_COLOR,[oa]:n.SRC_ALPHA,[fu]:n.SRC_ALPHA_SATURATE,[uu]:n.DST_COLOR,[lu]:n.DST_ALPHA,[ou]:n.ONE_MINUS_SRC_COLOR,[ui]:n.ONE_MINUS_SRC_ALPHA,[hu]:n.ONE_MINUS_DST_COLOR,[cu]:n.ONE_MINUS_DST_ALPHA,[du]:n.CONSTANT_COLOR,[pu]:n.ONE_MINUS_CONSTANT_COLOR,[mu]:n.CONSTANT_ALPHA,[gu]:n.ONE_MINUS_CONSTANT_ALPHA};function R(L,ue,X,J,_e,de,Be,at,vt,Ze){if(L===Gn){v===!0&&(ye(n.BLEND),v=!1);return}if(v===!1&&(ee(n.BLEND),v=!0),L!==hs){if(L!==p||Ze!==E){if((h!==ni||g!==ni)&&(n.blendEquation(n.FUNC_ADD),h=ni,g=ni),Ze)switch(L){case Di:n.blendFuncSeparate(n.ONE,n.ONE_MINUS_SRC_ALPHA,n.ONE,n.ONE_MINUS_SRC_ALPHA);break;case yo:n.blendFunc(n.ONE,n.ONE);break;case Eo:n.blendFuncSeparate(n.ZERO,n.ONE_MINUS_SRC_COLOR,n.ZERO,n.ONE);break;case To:n.blendFuncSeparate(n.ZERO,n.SRC_COLOR,n.ZERO,n.SRC_ALPHA);break;default:console.error("THREE.WebGLState: Invalid blending: ",L);break}else switch(L){case Di:n.blendFuncSeparate(n.SRC_ALPHA,n.ONE_MINUS_SRC_ALPHA,n.ONE,n.ONE_MINUS_SRC_ALPHA);break;case yo:n.blendFunc(n.SRC_ALPHA,n.ONE);break;case Eo:n.blendFuncSeparate(n.ZERO,n.ONE_MINUS_SRC_COLOR,n.ZERO,n.ONE);break;case To:n.blendFunc(n.ZERO,n.SRC_COLOR);break;default:console.error("THREE.WebGLState: Invalid blending: ",L);break}A=null,S=null,P=null,b=null,w.set(0,0,0),D=0,p=L,E=Ze}return}_e=_e||ue,de=de||X,Be=Be||J,(ue!==h||_e!==g)&&(n.blendEquationSeparate(ve[ue],ve[_e]),h=ue,g=_e),(X!==A||J!==S||de!==P||Be!==b)&&(n.blendFuncSeparate(De[X],De[J],De[de],De[Be]),A=X,S=J,P=de,b=Be),(at.equals(w)===!1||vt!==D)&&(n.blendColor(at.r,at.g,at.b,vt),w.copy(at),D=vt),p=L,E=!1}function Oe(L,ue){L.side===ln?ye(n.CULL_FACE):ee(n.CULL_FACE);let X=L.side===Rt;ue&&(X=!X),he(X),L.blending===Di&&L.transparent===!1?R(Gn):R(L.blending,L.blendEquation,L.blendSrc,L.blendDst,L.blendEquationAlpha,L.blendSrcAlpha,L.blendDstAlpha,L.blendColor,L.blendAlpha,L.premultipliedAlpha),a.setFunc(L.depthFunc),a.setTest(L.depthTest),a.setMask(L.depthWrite),r.setMask(L.colorWrite);const J=L.stencilWrite;o.setTest(J),J&&(o.setMask(L.stencilWriteMask),o.setFunc(L.stencilFunc,L.stencilRef,L.stencilFuncMask),o.setOp(L.stencilFail,L.stencilZFail,L.stencilZPass)),Ie(L.polygonOffset,L.polygonOffsetFactor,L.polygonOffsetUnits),L.alphaToCoverage===!0?ee(n.SAMPLE_ALPHA_TO_COVERAGE):ye(n.SAMPLE_ALPHA_TO_COVERAGE)}function he(L){M!==L&&(L?n.frontFace(n.CW):n.frontFace(n.CCW),M=L)}function Re(L){L!==Jc?(ee(n.CULL_FACE),L!==C&&(L===So?n.cullFace(n.BACK):L===Qc?n.cullFace(n.FRONT):n.cullFace(n.FRONT_AND_BACK))):ye(n.CULL_FACE),C=L}function me(L){L!==H&&(k&&n.lineWidth(L),H=L)}function Ie(L,ue,X){L?(ee(n.POLYGON_OFFSET_FILL),(F!==ue||W!==X)&&(n.polygonOffset(ue,X),F=ue,W=X)):ye(n.POLYGON_OFFSET_FILL)}function Se(L){L?ee(n.SCISSOR_TEST):ye(n.SCISSOR_TEST)}function T(L){L===void 0&&(L=n.TEXTURE0+$-1),ne!==L&&(n.activeTexture(L),ne=L)}function x(L,ue,X){X===void 0&&(ne===null?X=n.TEXTURE0+$-1:X=ne);let J=Q[X];J===void 0&&(J={type:void 0,texture:void 0},Q[X]=J),(J.type!==L||J.texture!==ue)&&(ne!==X&&(n.activeTexture(X),ne=X),n.bindTexture(L,ue||ce[L]),J.type=L,J.texture=ue)}function O(){const L=Q[ne];L!==void 0&&L.type!==void 0&&(n.bindTexture(L.type,null),L.type=void 0,L.texture=void 0)}function K(){try{n.compressedTexImage2D.apply(n,arguments)}catch(L){console.error("THREE.WebGLState:",L)}}function Y(){try{n.compressedTexImage3D.apply(n,arguments)}catch(L){console.error("THREE.WebGLState:",L)}}function q(){try{n.texSubImage2D.apply(n,arguments)}catch(L){console.error("THREE.WebGLState:",L)}}function fe(){try{n.texSubImage3D.apply(n,arguments)}catch(L){console.error("THREE.WebGLState:",L)}}function ae(){try{n.compressedTexSubImage2D.apply(n,arguments)}catch(L){console.error("THREE.WebGLState:",L)}}function xe(){try{n.compressedTexSubImage3D.apply(n,arguments)}catch(L){console.error("THREE.WebGLState:",L)}}function He(){try{n.texStorage2D.apply(n,arguments)}catch(L){console.error("THREE.WebGLState:",L)}}function ie(){try{n.texStorage3D.apply(n,arguments)}catch(L){console.error("THREE.WebGLState:",L)}}function ge(){try{n.texImage2D.apply(n,arguments)}catch(L){console.error("THREE.WebGLState:",L)}}function Le(){try{n.texImage3D.apply(n,arguments)}catch(L){console.error("THREE.WebGLState:",L)}}function Pe(L){Fe.equals(L)===!1&&(n.scissor(L.x,L.y,L.z,L.w),Fe.copy(L))}function Me(L){B.equals(L)===!1&&(n.viewport(L.x,L.y,L.z,L.w),B.copy(L))}function We(L,ue){let X=c.get(ue);X===void 0&&(X=new WeakMap,c.set(ue,X));let J=X.get(L);J===void 0&&(J=n.getUniformBlockIndex(ue,L.name),X.set(L,J))}function ke(L,ue){const J=c.get(ue).get(L);l.get(ue)!==J&&(n.uniformBlockBinding(ue,J,L.__bindingPointIndex),l.set(ue,J))}function Qe(){n.disable(n.BLEND),n.disable(n.CULL_FACE),n.disable(n.DEPTH_TEST),n.disable(n.POLYGON_OFFSET_FILL),n.disable(n.SCISSOR_TEST),n.disable(n.STENCIL_TEST),n.disable(n.SAMPLE_ALPHA_TO_COVERAGE),n.blendEquation(n.FUNC_ADD),n.blendFunc(n.ONE,n.ZERO),n.blendFuncSeparate(n.ONE,n.ZERO,n.ONE,n.ZERO),n.blendColor(0,0,0,0),n.colorMask(!0,!0,!0,!0),n.clearColor(0,0,0,0),n.depthMask(!0),n.depthFunc(n.LESS),a.setReversed(!1),n.clearDepth(1),n.stencilMask(4294967295),n.stencilFunc(n.ALWAYS,0,4294967295),n.stencilOp(n.KEEP,n.KEEP,n.KEEP),n.clearStencil(0),n.cullFace(n.BACK),n.frontFace(n.CCW),n.polygonOffset(0,0),n.activeTexture(n.TEXTURE0),n.bindFramebuffer(n.FRAMEBUFFER,null),n.bindFramebuffer(n.DRAW_FRAMEBUFFER,null),n.bindFramebuffer(n.READ_FRAMEBUFFER,null),n.useProgram(null),n.lineWidth(1),n.scissor(0,0,n.canvas.width,n.canvas.height),n.viewport(0,0,n.canvas.width,n.canvas.height),u={},ne=null,Q={},f={},d=new WeakMap,m=[],_=null,v=!1,p=null,h=null,A=null,S=null,g=null,P=null,b=null,w=new je(0,0,0),D=0,E=!1,M=null,C=null,H=null,F=null,W=null,Fe.set(0,0,n.canvas.width,n.canvas.height),B.set(0,0,n.canvas.width,n.canvas.height),r.reset(),a.reset(),o.reset()}return{buffers:{color:r,depth:a,stencil:o},enable:ee,disable:ye,bindFramebuffer:Ce,drawBuffers:te,useProgram:oe,setBlending:R,setMaterial:Oe,setFlipSided:he,setCullFace:Re,setLineWidth:me,setPolygonOffset:Ie,setScissorTest:Se,activeTexture:T,bindTexture:x,unbindTexture:O,compressedTexImage2D:K,compressedTexImage3D:Y,texImage2D:ge,texImage3D:Le,updateUBOMapping:We,uniformBlockBinding:ke,texStorage2D:He,texStorage3D:ie,texSubImage2D:q,texSubImage3D:fe,compressedTexSubImage2D:ae,compressedTexSubImage3D:xe,scissor:Pe,viewport:Me,reset:Qe}}function _l(n,e,t,i){const s=km(i);switch(t){case Hl:return n*e;case Wl:return n*e;case Xl:return n*e*2;case ql:return n*e/s.components*s.byteLength;case no:return n*e/s.components*s.byteLength;case Yl:return n*e*2/s.components*s.byteLength;case io:return n*e*2/s.components*s.byteLength;case Vl:return n*e*3/s.components*s.byteLength;case Ht:return n*e*4/s.components*s.byteLength;case so:return n*e*4/s.components*s.byteLength;case Js:case Qs:return Math.floor((n+3)/4)*Math.floor((e+3)/4)*8;case er:case tr:return Math.floor((n+3)/4)*Math.floor((e+3)/4)*16;case Ma:case ya:return Math.max(n,16)*Math.max(e,8)/4;case xa:case Sa:return Math.max(n,8)*Math.max(e,8)/2;case Ea:case Ta:return Math.floor((n+3)/4)*Math.floor((e+3)/4)*8;case Aa:return Math.floor((n+3)/4)*Math.floor((e+3)/4)*16;case ba:return Math.floor((n+3)/4)*Math.floor((e+3)/4)*16;case wa:return Math.floor((n+4)/5)*Math.floor((e+3)/4)*16;case Ra:return Math.floor((n+4)/5)*Math.floor((e+4)/5)*16;case Ca:return Math.floor((n+5)/6)*Math.floor((e+4)/5)*16;case Pa:return Math.floor((n+5)/6)*Math.floor((e+5)/6)*16;case Da:return Math.floor((n+7)/8)*Math.floor((e+4)/5)*16;case La:return Math.floor((n+7)/8)*Math.floor((e+5)/6)*16;case Ia:return Math.floor((n+7)/8)*Math.floor((e+7)/8)*16;case Ua:return Math.floor((n+9)/10)*Math.floor((e+4)/5)*16;case Na:return Math.floor((n+9)/10)*Math.floor((e+5)/6)*16;case Fa:return Math.floor((n+9)/10)*Math.floor((e+7)/8)*16;case Oa:return Math.floor((n+9)/10)*Math.floor((e+9)/10)*16;case Ba:return Math.floor((n+11)/12)*Math.floor((e+9)/10)*16;case za:return Math.floor((n+11)/12)*Math.floor((e+11)/12)*16;case nr:case ka:case Ga:return Math.ceil(n/4)*Math.ceil(e/4)*16;case Kl:case Ha:return Math.ceil(n/4)*Math.ceil(e/4)*8;case Va:case Wa:return Math.ceil(n/4)*Math.ceil(e/4)*16}throw new Error(`Unable to determine texture byte length for ${t} format.`)}function km(n){switch(n){case sn:case zl:return{byteLength:1,components:1};case ds:case kl:case xs:return{byteLength:2,components:1};case eo:case to:return{byteLength:2,components:4};case hi:case Qa:case un:return{byteLength:4,components:1};case Gl:return{byteLength:4,components:3}}throw new Error(`Unknown texture type ${n}.`)}function Gm(n,e,t,i,s,r,a){const o=e.has("WEBGL_multisampled_render_to_texture")?e.get("WEBGL_multisampled_render_to_texture"):null,l=typeof navigator>"u"?!1:/OculusBrowser/g.test(navigator.userAgent),c=new Ve,u=new WeakMap;let f;const d=new WeakMap;let m=!1;try{m=typeof OffscreenCanvas<"u"&&new OffscreenCanvas(1,1).getContext("2d")!==null}catch{}function _(T,x){return m?new OffscreenCanvas(T,x):lr("canvas")}function v(T,x,O){let K=1;const Y=Se(T);if((Y.width>O||Y.height>O)&&(K=O/Math.max(Y.width,Y.height)),K<1)if(typeof HTMLImageElement<"u"&&T instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&T instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&T instanceof ImageBitmap||typeof VideoFrame<"u"&&T instanceof VideoFrame){const q=Math.floor(K*Y.width),fe=Math.floor(K*Y.height);f===void 0&&(f=_(q,fe));const ae=x?_(q,fe):f;return ae.width=q,ae.height=fe,ae.getContext("2d").drawImage(T,0,0,q,fe),console.warn("THREE.WebGLRenderer: Texture has been resized from ("+Y.width+"x"+Y.height+") to ("+q+"x"+fe+")."),ae}else return"data"in T&&console.warn("THREE.WebGLRenderer: Image in DataTexture is too big ("+Y.width+"x"+Y.height+")."),T;return T}function p(T){return T.generateMipmaps}function h(T){n.generateMipmap(T)}function A(T){return T.isWebGLCubeRenderTarget?n.TEXTURE_CUBE_MAP:T.isWebGL3DRenderTarget?n.TEXTURE_3D:T.isWebGLArrayRenderTarget||T.isCompressedArrayTexture?n.TEXTURE_2D_ARRAY:n.TEXTURE_2D}function S(T,x,O,K,Y=!1){if(T!==null){if(n[T]!==void 0)return n[T];console.warn("THREE.WebGLRenderer: Attempt to use non-existing WebGL internal format '"+T+"'")}let q=x;if(x===n.RED&&(O===n.FLOAT&&(q=n.R32F),O===n.HALF_FLOAT&&(q=n.R16F),O===n.UNSIGNED_BYTE&&(q=n.R8)),x===n.RED_INTEGER&&(O===n.UNSIGNED_BYTE&&(q=n.R8UI),O===n.UNSIGNED_SHORT&&(q=n.R16UI),O===n.UNSIGNED_INT&&(q=n.R32UI),O===n.BYTE&&(q=n.R8I),O===n.SHORT&&(q=n.R16I),O===n.INT&&(q=n.R32I)),x===n.RG&&(O===n.FLOAT&&(q=n.RG32F),O===n.HALF_FLOAT&&(q=n.RG16F),O===n.UNSIGNED_BYTE&&(q=n.RG8)),x===n.RG_INTEGER&&(O===n.UNSIGNED_BYTE&&(q=n.RG8UI),O===n.UNSIGNED_SHORT&&(q=n.RG16UI),O===n.UNSIGNED_INT&&(q=n.RG32UI),O===n.BYTE&&(q=n.RG8I),O===n.SHORT&&(q=n.RG16I),O===n.INT&&(q=n.RG32I)),x===n.RGB_INTEGER&&(O===n.UNSIGNED_BYTE&&(q=n.RGB8UI),O===n.UNSIGNED_SHORT&&(q=n.RGB16UI),O===n.UNSIGNED_INT&&(q=n.RGB32UI),O===n.BYTE&&(q=n.RGB8I),O===n.SHORT&&(q=n.RGB16I),O===n.INT&&(q=n.RGB32I)),x===n.RGBA_INTEGER&&(O===n.UNSIGNED_BYTE&&(q=n.RGBA8UI),O===n.UNSIGNED_SHORT&&(q=n.RGBA16UI),O===n.UNSIGNED_INT&&(q=n.RGBA32UI),O===n.BYTE&&(q=n.RGBA8I),O===n.SHORT&&(q=n.RGBA16I),O===n.INT&&(q=n.RGBA32I)),x===n.RGB&&O===n.UNSIGNED_INT_5_9_9_9_REV&&(q=n.RGB9_E5),x===n.RGBA){const fe=Y?gr:qe.getTransfer(K);O===n.FLOAT&&(q=n.RGBA32F),O===n.HALF_FLOAT&&(q=n.RGBA16F),O===n.UNSIGNED_BYTE&&(q=fe===Je?n.SRGB8_ALPHA8:n.RGBA8),O===n.UNSIGNED_SHORT_4_4_4_4&&(q=n.RGBA4),O===n.UNSIGNED_SHORT_5_5_5_1&&(q=n.RGB5_A1)}return(q===n.R16F||q===n.R32F||q===n.RG16F||q===n.RG32F||q===n.RGBA16F||q===n.RGBA32F)&&e.get("EXT_color_buffer_float"),q}function g(T,x){let O;return T?x===null||x===hi||x===zi?O=n.DEPTH24_STENCIL8:x===un?O=n.DEPTH32F_STENCIL8:x===ds&&(O=n.DEPTH24_STENCIL8,console.warn("DepthTexture: 16 bit depth attachment is not supported with stencil. Using 24-bit attachment.")):x===null||x===hi||x===zi?O=n.DEPTH_COMPONENT24:x===un?O=n.DEPTH_COMPONENT32F:x===ds&&(O=n.DEPTH_COMPONENT16),O}function P(T,x){return p(T)===!0||T.isFramebufferTexture&&T.minFilter!==ft&&T.minFilter!==Gt?Math.log2(Math.max(x.width,x.height))+1:T.mipmaps!==void 0&&T.mipmaps.length>0?T.mipmaps.length:T.isCompressedTexture&&Array.isArray(T.image)?x.mipmaps.length:1}function b(T){const x=T.target;x.removeEventListener("dispose",b),D(x),x.isVideoTexture&&u.delete(x)}function w(T){const x=T.target;x.removeEventListener("dispose",w),M(x)}function D(T){const x=i.get(T);if(x.__webglInit===void 0)return;const O=T.source,K=d.get(O);if(K){const Y=K[x.__cacheKey];Y.usedTimes--,Y.usedTimes===0&&E(T),Object.keys(K).length===0&&d.delete(O)}i.remove(T)}function E(T){const x=i.get(T);n.deleteTexture(x.__webglTexture);const O=T.source,K=d.get(O);delete K[x.__cacheKey],a.memory.textures--}function M(T){const x=i.get(T);if(T.depthTexture&&(T.depthTexture.dispose(),i.remove(T.depthTexture)),T.isWebGLCubeRenderTarget)for(let K=0;K<6;K++){if(Array.isArray(x.__webglFramebuffer[K]))for(let Y=0;Y<x.__webglFramebuffer[K].length;Y++)n.deleteFramebuffer(x.__webglFramebuffer[K][Y]);else n.deleteFramebuffer(x.__webglFramebuffer[K]);x.__webglDepthbuffer&&n.deleteRenderbuffer(x.__webglDepthbuffer[K])}else{if(Array.isArray(x.__webglFramebuffer))for(let K=0;K<x.__webglFramebuffer.length;K++)n.deleteFramebuffer(x.__webglFramebuffer[K]);else n.deleteFramebuffer(x.__webglFramebuffer);if(x.__webglDepthbuffer&&n.deleteRenderbuffer(x.__webglDepthbuffer),x.__webglMultisampledFramebuffer&&n.deleteFramebuffer(x.__webglMultisampledFramebuffer),x.__webglColorRenderbuffer)for(let K=0;K<x.__webglColorRenderbuffer.length;K++)x.__webglColorRenderbuffer[K]&&n.deleteRenderbuffer(x.__webglColorRenderbuffer[K]);x.__webglDepthRenderbuffer&&n.deleteRenderbuffer(x.__webglDepthRenderbuffer)}const O=T.textures;for(let K=0,Y=O.length;K<Y;K++){const q=i.get(O[K]);q.__webglTexture&&(n.deleteTexture(q.__webglTexture),a.memory.textures--),i.remove(O[K])}i.remove(T)}let C=0;function H(){C=0}function F(){const T=C;return T>=s.maxTextures&&console.warn("THREE.WebGLTextures: Trying to use "+T+" texture units while this GPU supports only "+s.maxTextures),C+=1,T}function W(T){const x=[];return x.push(T.wrapS),x.push(T.wrapT),x.push(T.wrapR||0),x.push(T.magFilter),x.push(T.minFilter),x.push(T.anisotropy),x.push(T.internalFormat),x.push(T.format),x.push(T.type),x.push(T.generateMipmaps),x.push(T.premultiplyAlpha),x.push(T.flipY),x.push(T.unpackAlignment),x.push(T.colorSpace),x.join()}function $(T,x){const O=i.get(T);if(T.isVideoTexture&&me(T),T.isRenderTargetTexture===!1&&T.version>0&&O.__version!==T.version){const K=T.image;if(K===null)console.warn("THREE.WebGLRenderer: Texture marked for update but no image data found.");else if(K.complete===!1)console.warn("THREE.WebGLRenderer: Texture marked for update but image is incomplete");else{B(O,T,x);return}}t.bindTexture(n.TEXTURE_2D,O.__webglTexture,n.TEXTURE0+x)}function k(T,x){const O=i.get(T);if(T.version>0&&O.__version!==T.version){B(O,T,x);return}t.bindTexture(n.TEXTURE_2D_ARRAY,O.__webglTexture,n.TEXTURE0+x)}function j(T,x){const O=i.get(T);if(T.version>0&&O.__version!==T.version){B(O,T,x);return}t.bindTexture(n.TEXTURE_3D,O.__webglTexture,n.TEXTURE0+x)}function V(T,x){const O=i.get(T);if(T.version>0&&O.__version!==T.version){Z(O,T,x);return}t.bindTexture(n.TEXTURE_CUBE_MAP,O.__webglTexture,n.TEXTURE0+x)}const ne={[_a]:n.REPEAT,[ri]:n.CLAMP_TO_EDGE,[va]:n.MIRRORED_REPEAT},Q={[ft]:n.NEAREST,[bu]:n.NEAREST_MIPMAP_NEAREST,[bs]:n.NEAREST_MIPMAP_LINEAR,[Gt]:n.LINEAR,[Er]:n.LINEAR_MIPMAP_NEAREST,[ai]:n.LINEAR_MIPMAP_LINEAR},re={[Du]:n.NEVER,[Ou]:n.ALWAYS,[Lu]:n.LESS,[$l]:n.LEQUAL,[Iu]:n.EQUAL,[Fu]:n.GEQUAL,[Uu]:n.GREATER,[Nu]:n.NOTEQUAL};function be(T,x){if(x.type===un&&e.has("OES_texture_float_linear")===!1&&(x.magFilter===Gt||x.magFilter===Er||x.magFilter===bs||x.magFilter===ai||x.minFilter===Gt||x.minFilter===Er||x.minFilter===bs||x.minFilter===ai)&&console.warn("THREE.WebGLRenderer: Unable to use linear filtering with floating point textures. OES_texture_float_linear not supported on this device."),n.texParameteri(T,n.TEXTURE_WRAP_S,ne[x.wrapS]),n.texParameteri(T,n.TEXTURE_WRAP_T,ne[x.wrapT]),(T===n.TEXTURE_3D||T===n.TEXTURE_2D_ARRAY)&&n.texParameteri(T,n.TEXTURE_WRAP_R,ne[x.wrapR]),n.texParameteri(T,n.TEXTURE_MAG_FILTER,Q[x.magFilter]),n.texParameteri(T,n.TEXTURE_MIN_FILTER,Q[x.minFilter]),x.compareFunction&&(n.texParameteri(T,n.TEXTURE_COMPARE_MODE,n.COMPARE_REF_TO_TEXTURE),n.texParameteri(T,n.TEXTURE_COMPARE_FUNC,re[x.compareFunction])),e.has("EXT_texture_filter_anisotropic")===!0){if(x.magFilter===ft||x.minFilter!==bs&&x.minFilter!==ai||x.type===un&&e.has("OES_texture_float_linear")===!1)return;if(x.anisotropy>1||i.get(x).__currentAnisotropy){const O=e.get("EXT_texture_filter_anisotropic");n.texParameterf(T,O.TEXTURE_MAX_ANISOTROPY_EXT,Math.min(x.anisotropy,s.getMaxAnisotropy())),i.get(x).__currentAnisotropy=x.anisotropy}}}function Fe(T,x){let O=!1;T.__webglInit===void 0&&(T.__webglInit=!0,x.addEventListener("dispose",b));const K=x.source;let Y=d.get(K);Y===void 0&&(Y={},d.set(K,Y));const q=W(x);if(q!==T.__cacheKey){Y[q]===void 0&&(Y[q]={texture:n.createTexture(),usedTimes:0},a.memory.textures++,O=!0),Y[q].usedTimes++;const fe=Y[T.__cacheKey];fe!==void 0&&(Y[T.__cacheKey].usedTimes--,fe.usedTimes===0&&E(x)),T.__cacheKey=q,T.__webglTexture=Y[q].texture}return O}function B(T,x,O){let K=n.TEXTURE_2D;(x.isDataArrayTexture||x.isCompressedArrayTexture)&&(K=n.TEXTURE_2D_ARRAY),x.isData3DTexture&&(K=n.TEXTURE_3D);const Y=Fe(T,x),q=x.source;t.bindTexture(K,T.__webglTexture,n.TEXTURE0+O);const fe=i.get(q);if(q.version!==fe.__version||Y===!0){t.activeTexture(n.TEXTURE0+O);const ae=qe.getPrimaries(qe.workingColorSpace),xe=x.colorSpace===Bn?null:qe.getPrimaries(x.colorSpace),He=x.colorSpace===Bn||ae===xe?n.NONE:n.BROWSER_DEFAULT_WEBGL;n.pixelStorei(n.UNPACK_FLIP_Y_WEBGL,x.flipY),n.pixelStorei(n.UNPACK_PREMULTIPLY_ALPHA_WEBGL,x.premultiplyAlpha),n.pixelStorei(n.UNPACK_ALIGNMENT,x.unpackAlignment),n.pixelStorei(n.UNPACK_COLORSPACE_CONVERSION_WEBGL,He);let ie=v(x.image,!1,s.maxTextureSize);ie=Ie(x,ie);const ge=r.convert(x.format,x.colorSpace),Le=r.convert(x.type);let Pe=S(x.internalFormat,ge,Le,x.colorSpace,x.isVideoTexture);be(K,x);let Me;const We=x.mipmaps,ke=x.isVideoTexture!==!0,Qe=fe.__version===void 0||Y===!0,L=q.dataReady,ue=P(x,ie);if(x.isDepthTexture)Pe=g(x.format===ki,x.type),Qe&&(ke?t.texStorage2D(n.TEXTURE_2D,1,Pe,ie.width,ie.height):t.texImage2D(n.TEXTURE_2D,0,Pe,ie.width,ie.height,0,ge,Le,null));else if(x.isDataTexture)if(We.length>0){ke&&Qe&&t.texStorage2D(n.TEXTURE_2D,ue,Pe,We[0].width,We[0].height);for(let X=0,J=We.length;X<J;X++)Me=We[X],ke?L&&t.texSubImage2D(n.TEXTURE_2D,X,0,0,Me.width,Me.height,ge,Le,Me.data):t.texImage2D(n.TEXTURE_2D,X,Pe,Me.width,Me.height,0,ge,Le,Me.data);x.generateMipmaps=!1}else ke?(Qe&&t.texStorage2D(n.TEXTURE_2D,ue,Pe,ie.width,ie.height),L&&t.texSubImage2D(n.TEXTURE_2D,0,0,0,ie.width,ie.height,ge,Le,ie.data)):t.texImage2D(n.TEXTURE_2D,0,Pe,ie.width,ie.height,0,ge,Le,ie.data);else if(x.isCompressedTexture)if(x.isCompressedArrayTexture){ke&&Qe&&t.texStorage3D(n.TEXTURE_2D_ARRAY,ue,Pe,We[0].width,We[0].height,ie.depth);for(let X=0,J=We.length;X<J;X++)if(Me=We[X],x.format!==Ht)if(ge!==null)if(ke){if(L)if(x.layerUpdates.size>0){const _e=_l(Me.width,Me.height,x.format,x.type);for(const de of x.layerUpdates){const Be=Me.data.subarray(de*_e/Me.data.BYTES_PER_ELEMENT,(de+1)*_e/Me.data.BYTES_PER_ELEMENT);t.compressedTexSubImage3D(n.TEXTURE_2D_ARRAY,X,0,0,de,Me.width,Me.height,1,ge,Be)}x.clearLayerUpdates()}else t.compressedTexSubImage3D(n.TEXTURE_2D_ARRAY,X,0,0,0,Me.width,Me.height,ie.depth,ge,Me.data)}else t.compressedTexImage3D(n.TEXTURE_2D_ARRAY,X,Pe,Me.width,Me.height,ie.depth,0,Me.data,0,0);else console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()");else ke?L&&t.texSubImage3D(n.TEXTURE_2D_ARRAY,X,0,0,0,Me.width,Me.height,ie.depth,ge,Le,Me.data):t.texImage3D(n.TEXTURE_2D_ARRAY,X,Pe,Me.width,Me.height,ie.depth,0,ge,Le,Me.data)}else{ke&&Qe&&t.texStorage2D(n.TEXTURE_2D,ue,Pe,We[0].width,We[0].height);for(let X=0,J=We.length;X<J;X++)Me=We[X],x.format!==Ht?ge!==null?ke?L&&t.compressedTexSubImage2D(n.TEXTURE_2D,X,0,0,Me.width,Me.height,ge,Me.data):t.compressedTexImage2D(n.TEXTURE_2D,X,Pe,Me.width,Me.height,0,Me.data):console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()"):ke?L&&t.texSubImage2D(n.TEXTURE_2D,X,0,0,Me.width,Me.height,ge,Le,Me.data):t.texImage2D(n.TEXTURE_2D,X,Pe,Me.width,Me.height,0,ge,Le,Me.data)}else if(x.isDataArrayTexture)if(ke){if(Qe&&t.texStorage3D(n.TEXTURE_2D_ARRAY,ue,Pe,ie.width,ie.height,ie.depth),L)if(x.layerUpdates.size>0){const X=_l(ie.width,ie.height,x.format,x.type);for(const J of x.layerUpdates){const _e=ie.data.subarray(J*X/ie.data.BYTES_PER_ELEMENT,(J+1)*X/ie.data.BYTES_PER_ELEMENT);t.texSubImage3D(n.TEXTURE_2D_ARRAY,0,0,0,J,ie.width,ie.height,1,ge,Le,_e)}x.clearLayerUpdates()}else t.texSubImage3D(n.TEXTURE_2D_ARRAY,0,0,0,0,ie.width,ie.height,ie.depth,ge,Le,ie.data)}else t.texImage3D(n.TEXTURE_2D_ARRAY,0,Pe,ie.width,ie.height,ie.depth,0,ge,Le,ie.data);else if(x.isData3DTexture)ke?(Qe&&t.texStorage3D(n.TEXTURE_3D,ue,Pe,ie.width,ie.height,ie.depth),L&&t.texSubImage3D(n.TEXTURE_3D,0,0,0,0,ie.width,ie.height,ie.depth,ge,Le,ie.data)):t.texImage3D(n.TEXTURE_3D,0,Pe,ie.width,ie.height,ie.depth,0,ge,Le,ie.data);else if(x.isFramebufferTexture){if(Qe)if(ke)t.texStorage2D(n.TEXTURE_2D,ue,Pe,ie.width,ie.height);else{let X=ie.width,J=ie.height;for(let _e=0;_e<ue;_e++)t.texImage2D(n.TEXTURE_2D,_e,Pe,X,J,0,ge,Le,null),X>>=1,J>>=1}}else if(We.length>0){if(ke&&Qe){const X=Se(We[0]);t.texStorage2D(n.TEXTURE_2D,ue,Pe,X.width,X.height)}for(let X=0,J=We.length;X<J;X++)Me=We[X],ke?L&&t.texSubImage2D(n.TEXTURE_2D,X,0,0,ge,Le,Me):t.texImage2D(n.TEXTURE_2D,X,Pe,ge,Le,Me);x.generateMipmaps=!1}else if(ke){if(Qe){const X=Se(ie);t.texStorage2D(n.TEXTURE_2D,ue,Pe,X.width,X.height)}L&&t.texSubImage2D(n.TEXTURE_2D,0,0,0,ge,Le,ie)}else t.texImage2D(n.TEXTURE_2D,0,Pe,ge,Le,ie);p(x)&&h(K),fe.__version=q.version,x.onUpdate&&x.onUpdate(x)}T.__version=x.version}function Z(T,x,O){if(x.image.length!==6)return;const K=Fe(T,x),Y=x.source;t.bindTexture(n.TEXTURE_CUBE_MAP,T.__webglTexture,n.TEXTURE0+O);const q=i.get(Y);if(Y.version!==q.__version||K===!0){t.activeTexture(n.TEXTURE0+O);const fe=qe.getPrimaries(qe.workingColorSpace),ae=x.colorSpace===Bn?null:qe.getPrimaries(x.colorSpace),xe=x.colorSpace===Bn||fe===ae?n.NONE:n.BROWSER_DEFAULT_WEBGL;n.pixelStorei(n.UNPACK_FLIP_Y_WEBGL,x.flipY),n.pixelStorei(n.UNPACK_PREMULTIPLY_ALPHA_WEBGL,x.premultiplyAlpha),n.pixelStorei(n.UNPACK_ALIGNMENT,x.unpackAlignment),n.pixelStorei(n.UNPACK_COLORSPACE_CONVERSION_WEBGL,xe);const He=x.isCompressedTexture||x.image[0].isCompressedTexture,ie=x.image[0]&&x.image[0].isDataTexture,ge=[];for(let J=0;J<6;J++)!He&&!ie?ge[J]=v(x.image[J],!0,s.maxCubemapSize):ge[J]=ie?x.image[J].image:x.image[J],ge[J]=Ie(x,ge[J]);const Le=ge[0],Pe=r.convert(x.format,x.colorSpace),Me=r.convert(x.type),We=S(x.internalFormat,Pe,Me,x.colorSpace),ke=x.isVideoTexture!==!0,Qe=q.__version===void 0||K===!0,L=Y.dataReady;let ue=P(x,Le);be(n.TEXTURE_CUBE_MAP,x);let X;if(He){ke&&Qe&&t.texStorage2D(n.TEXTURE_CUBE_MAP,ue,We,Le.width,Le.height);for(let J=0;J<6;J++){X=ge[J].mipmaps;for(let _e=0;_e<X.length;_e++){const de=X[_e];x.format!==Ht?Pe!==null?ke?L&&t.compressedTexSubImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+J,_e,0,0,de.width,de.height,Pe,de.data):t.compressedTexImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+J,_e,We,de.width,de.height,0,de.data):console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .setTextureCube()"):ke?L&&t.texSubImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+J,_e,0,0,de.width,de.height,Pe,Me,de.data):t.texImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+J,_e,We,de.width,de.height,0,Pe,Me,de.data)}}}else{if(X=x.mipmaps,ke&&Qe){X.length>0&&ue++;const J=Se(ge[0]);t.texStorage2D(n.TEXTURE_CUBE_MAP,ue,We,J.width,J.height)}for(let J=0;J<6;J++)if(ie){ke?L&&t.texSubImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+J,0,0,0,ge[J].width,ge[J].height,Pe,Me,ge[J].data):t.texImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+J,0,We,ge[J].width,ge[J].height,0,Pe,Me,ge[J].data);for(let _e=0;_e<X.length;_e++){const Be=X[_e].image[J].image;ke?L&&t.texSubImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+J,_e+1,0,0,Be.width,Be.height,Pe,Me,Be.data):t.texImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+J,_e+1,We,Be.width,Be.height,0,Pe,Me,Be.data)}}else{ke?L&&t.texSubImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+J,0,0,0,Pe,Me,ge[J]):t.texImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+J,0,We,Pe,Me,ge[J]);for(let _e=0;_e<X.length;_e++){const de=X[_e];ke?L&&t.texSubImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+J,_e+1,0,0,Pe,Me,de.image[J]):t.texImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+J,_e+1,We,Pe,Me,de.image[J])}}}p(x)&&h(n.TEXTURE_CUBE_MAP),q.__version=Y.version,x.onUpdate&&x.onUpdate(x)}T.__version=x.version}function ce(T,x,O,K,Y,q){const fe=r.convert(O.format,O.colorSpace),ae=r.convert(O.type),xe=S(O.internalFormat,fe,ae,O.colorSpace),He=i.get(x),ie=i.get(O);if(ie.__renderTarget=x,!He.__hasExternalTextures){const ge=Math.max(1,x.width>>q),Le=Math.max(1,x.height>>q);Y===n.TEXTURE_3D||Y===n.TEXTURE_2D_ARRAY?t.texImage3D(Y,q,xe,ge,Le,x.depth,0,fe,ae,null):t.texImage2D(Y,q,xe,ge,Le,0,fe,ae,null)}t.bindFramebuffer(n.FRAMEBUFFER,T),Re(x)?o.framebufferTexture2DMultisampleEXT(n.FRAMEBUFFER,K,Y,ie.__webglTexture,0,he(x)):(Y===n.TEXTURE_2D||Y>=n.TEXTURE_CUBE_MAP_POSITIVE_X&&Y<=n.TEXTURE_CUBE_MAP_NEGATIVE_Z)&&n.framebufferTexture2D(n.FRAMEBUFFER,K,Y,ie.__webglTexture,q),t.bindFramebuffer(n.FRAMEBUFFER,null)}function ee(T,x,O){if(n.bindRenderbuffer(n.RENDERBUFFER,T),x.depthBuffer){const K=x.depthTexture,Y=K&&K.isDepthTexture?K.type:null,q=g(x.stencilBuffer,Y),fe=x.stencilBuffer?n.DEPTH_STENCIL_ATTACHMENT:n.DEPTH_ATTACHMENT,ae=he(x);Re(x)?o.renderbufferStorageMultisampleEXT(n.RENDERBUFFER,ae,q,x.width,x.height):O?n.renderbufferStorageMultisample(n.RENDERBUFFER,ae,q,x.width,x.height):n.renderbufferStorage(n.RENDERBUFFER,q,x.width,x.height),n.framebufferRenderbuffer(n.FRAMEBUFFER,fe,n.RENDERBUFFER,T)}else{const K=x.textures;for(let Y=0;Y<K.length;Y++){const q=K[Y],fe=r.convert(q.format,q.colorSpace),ae=r.convert(q.type),xe=S(q.internalFormat,fe,ae,q.colorSpace),He=he(x);O&&Re(x)===!1?n.renderbufferStorageMultisample(n.RENDERBUFFER,He,xe,x.width,x.height):Re(x)?o.renderbufferStorageMultisampleEXT(n.RENDERBUFFER,He,xe,x.width,x.height):n.renderbufferStorage(n.RENDERBUFFER,xe,x.width,x.height)}}n.bindRenderbuffer(n.RENDERBUFFER,null)}function ye(T,x){if(x&&x.isWebGLCubeRenderTarget)throw new Error("Depth Texture with cube render targets is not supported");if(t.bindFramebuffer(n.FRAMEBUFFER,T),!(x.depthTexture&&x.depthTexture.isDepthTexture))throw new Error("renderTarget.depthTexture must be an instance of THREE.DepthTexture");const K=i.get(x.depthTexture);K.__renderTarget=x,(!K.__webglTexture||x.depthTexture.image.width!==x.width||x.depthTexture.image.height!==x.height)&&(x.depthTexture.image.width=x.width,x.depthTexture.image.height=x.height,x.depthTexture.needsUpdate=!0),$(x.depthTexture,0);const Y=K.__webglTexture,q=he(x);if(x.depthTexture.format===Li)Re(x)?o.framebufferTexture2DMultisampleEXT(n.FRAMEBUFFER,n.DEPTH_ATTACHMENT,n.TEXTURE_2D,Y,0,q):n.framebufferTexture2D(n.FRAMEBUFFER,n.DEPTH_ATTACHMENT,n.TEXTURE_2D,Y,0);else if(x.depthTexture.format===ki)Re(x)?o.framebufferTexture2DMultisampleEXT(n.FRAMEBUFFER,n.DEPTH_STENCIL_ATTACHMENT,n.TEXTURE_2D,Y,0,q):n.framebufferTexture2D(n.FRAMEBUFFER,n.DEPTH_STENCIL_ATTACHMENT,n.TEXTURE_2D,Y,0);else throw new Error("Unknown depthTexture format")}function Ce(T){const x=i.get(T),O=T.isWebGLCubeRenderTarget===!0;if(x.__boundDepthTexture!==T.depthTexture){const K=T.depthTexture;if(x.__depthDisposeCallback&&x.__depthDisposeCallback(),K){const Y=()=>{delete x.__boundDepthTexture,delete x.__depthDisposeCallback,K.removeEventListener("dispose",Y)};K.addEventListener("dispose",Y),x.__depthDisposeCallback=Y}x.__boundDepthTexture=K}if(T.depthTexture&&!x.__autoAllocateDepthBuffer){if(O)throw new Error("target.depthTexture not supported in Cube render targets");ye(x.__webglFramebuffer,T)}else if(O){x.__webglDepthbuffer=[];for(let K=0;K<6;K++)if(t.bindFramebuffer(n.FRAMEBUFFER,x.__webglFramebuffer[K]),x.__webglDepthbuffer[K]===void 0)x.__webglDepthbuffer[K]=n.createRenderbuffer(),ee(x.__webglDepthbuffer[K],T,!1);else{const Y=T.stencilBuffer?n.DEPTH_STENCIL_ATTACHMENT:n.DEPTH_ATTACHMENT,q=x.__webglDepthbuffer[K];n.bindRenderbuffer(n.RENDERBUFFER,q),n.framebufferRenderbuffer(n.FRAMEBUFFER,Y,n.RENDERBUFFER,q)}}else if(t.bindFramebuffer(n.FRAMEBUFFER,x.__webglFramebuffer),x.__webglDepthbuffer===void 0)x.__webglDepthbuffer=n.createRenderbuffer(),ee(x.__webglDepthbuffer,T,!1);else{const K=T.stencilBuffer?n.DEPTH_STENCIL_ATTACHMENT:n.DEPTH_ATTACHMENT,Y=x.__webglDepthbuffer;n.bindRenderbuffer(n.RENDERBUFFER,Y),n.framebufferRenderbuffer(n.FRAMEBUFFER,K,n.RENDERBUFFER,Y)}t.bindFramebuffer(n.FRAMEBUFFER,null)}function te(T,x,O){const K=i.get(T);x!==void 0&&ce(K.__webglFramebuffer,T,T.texture,n.COLOR_ATTACHMENT0,n.TEXTURE_2D,0),O!==void 0&&Ce(T)}function oe(T){const x=T.texture,O=i.get(T),K=i.get(x);T.addEventListener("dispose",w);const Y=T.textures,q=T.isWebGLCubeRenderTarget===!0,fe=Y.length>1;if(fe||(K.__webglTexture===void 0&&(K.__webglTexture=n.createTexture()),K.__version=x.version,a.memory.textures++),q){O.__webglFramebuffer=[];for(let ae=0;ae<6;ae++)if(x.mipmaps&&x.mipmaps.length>0){O.__webglFramebuffer[ae]=[];for(let xe=0;xe<x.mipmaps.length;xe++)O.__webglFramebuffer[ae][xe]=n.createFramebuffer()}else O.__webglFramebuffer[ae]=n.createFramebuffer()}else{if(x.mipmaps&&x.mipmaps.length>0){O.__webglFramebuffer=[];for(let ae=0;ae<x.mipmaps.length;ae++)O.__webglFramebuffer[ae]=n.createFramebuffer()}else O.__webglFramebuffer=n.createFramebuffer();if(fe)for(let ae=0,xe=Y.length;ae<xe;ae++){const He=i.get(Y[ae]);He.__webglTexture===void 0&&(He.__webglTexture=n.createTexture(),a.memory.textures++)}if(T.samples>0&&Re(T)===!1){O.__webglMultisampledFramebuffer=n.createFramebuffer(),O.__webglColorRenderbuffer=[],t.bindFramebuffer(n.FRAMEBUFFER,O.__webglMultisampledFramebuffer);for(let ae=0;ae<Y.length;ae++){const xe=Y[ae];O.__webglColorRenderbuffer[ae]=n.createRenderbuffer(),n.bindRenderbuffer(n.RENDERBUFFER,O.__webglColorRenderbuffer[ae]);const He=r.convert(xe.format,xe.colorSpace),ie=r.convert(xe.type),ge=S(xe.internalFormat,He,ie,xe.colorSpace,T.isXRRenderTarget===!0),Le=he(T);n.renderbufferStorageMultisample(n.RENDERBUFFER,Le,ge,T.width,T.height),n.framebufferRenderbuffer(n.FRAMEBUFFER,n.COLOR_ATTACHMENT0+ae,n.RENDERBUFFER,O.__webglColorRenderbuffer[ae])}n.bindRenderbuffer(n.RENDERBUFFER,null),T.depthBuffer&&(O.__webglDepthRenderbuffer=n.createRenderbuffer(),ee(O.__webglDepthRenderbuffer,T,!0)),t.bindFramebuffer(n.FRAMEBUFFER,null)}}if(q){t.bindTexture(n.TEXTURE_CUBE_MAP,K.__webglTexture),be(n.TEXTURE_CUBE_MAP,x);for(let ae=0;ae<6;ae++)if(x.mipmaps&&x.mipmaps.length>0)for(let xe=0;xe<x.mipmaps.length;xe++)ce(O.__webglFramebuffer[ae][xe],T,x,n.COLOR_ATTACHMENT0,n.TEXTURE_CUBE_MAP_POSITIVE_X+ae,xe);else ce(O.__webglFramebuffer[ae],T,x,n.COLOR_ATTACHMENT0,n.TEXTURE_CUBE_MAP_POSITIVE_X+ae,0);p(x)&&h(n.TEXTURE_CUBE_MAP),t.unbindTexture()}else if(fe){for(let ae=0,xe=Y.length;ae<xe;ae++){const He=Y[ae],ie=i.get(He);t.bindTexture(n.TEXTURE_2D,ie.__webglTexture),be(n.TEXTURE_2D,He),ce(O.__webglFramebuffer,T,He,n.COLOR_ATTACHMENT0+ae,n.TEXTURE_2D,0),p(He)&&h(n.TEXTURE_2D)}t.unbindTexture()}else{let ae=n.TEXTURE_2D;if((T.isWebGL3DRenderTarget||T.isWebGLArrayRenderTarget)&&(ae=T.isWebGL3DRenderTarget?n.TEXTURE_3D:n.TEXTURE_2D_ARRAY),t.bindTexture(ae,K.__webglTexture),be(ae,x),x.mipmaps&&x.mipmaps.length>0)for(let xe=0;xe<x.mipmaps.length;xe++)ce(O.__webglFramebuffer[xe],T,x,n.COLOR_ATTACHMENT0,ae,xe);else ce(O.__webglFramebuffer,T,x,n.COLOR_ATTACHMENT0,ae,0);p(x)&&h(ae),t.unbindTexture()}T.depthBuffer&&Ce(T)}function ve(T){const x=T.textures;for(let O=0,K=x.length;O<K;O++){const Y=x[O];if(p(Y)){const q=A(T),fe=i.get(Y).__webglTexture;t.bindTexture(q,fe),h(q),t.unbindTexture()}}}const De=[],R=[];function Oe(T){if(T.samples>0){if(Re(T)===!1){const x=T.textures,O=T.width,K=T.height;let Y=n.COLOR_BUFFER_BIT;const q=T.stencilBuffer?n.DEPTH_STENCIL_ATTACHMENT:n.DEPTH_ATTACHMENT,fe=i.get(T),ae=x.length>1;if(ae)for(let xe=0;xe<x.length;xe++)t.bindFramebuffer(n.FRAMEBUFFER,fe.__webglMultisampledFramebuffer),n.framebufferRenderbuffer(n.FRAMEBUFFER,n.COLOR_ATTACHMENT0+xe,n.RENDERBUFFER,null),t.bindFramebuffer(n.FRAMEBUFFER,fe.__webglFramebuffer),n.framebufferTexture2D(n.DRAW_FRAMEBUFFER,n.COLOR_ATTACHMENT0+xe,n.TEXTURE_2D,null,0);t.bindFramebuffer(n.READ_FRAMEBUFFER,fe.__webglMultisampledFramebuffer),t.bindFramebuffer(n.DRAW_FRAMEBUFFER,fe.__webglFramebuffer);for(let xe=0;xe<x.length;xe++){if(T.resolveDepthBuffer&&(T.depthBuffer&&(Y|=n.DEPTH_BUFFER_BIT),T.stencilBuffer&&T.resolveStencilBuffer&&(Y|=n.STENCIL_BUFFER_BIT)),ae){n.framebufferRenderbuffer(n.READ_FRAMEBUFFER,n.COLOR_ATTACHMENT0,n.RENDERBUFFER,fe.__webglColorRenderbuffer[xe]);const He=i.get(x[xe]).__webglTexture;n.framebufferTexture2D(n.DRAW_FRAMEBUFFER,n.COLOR_ATTACHMENT0,n.TEXTURE_2D,He,0)}n.blitFramebuffer(0,0,O,K,0,0,O,K,Y,n.NEAREST),l===!0&&(De.length=0,R.length=0,De.push(n.COLOR_ATTACHMENT0+xe),T.depthBuffer&&T.resolveDepthBuffer===!1&&(De.push(q),R.push(q),n.invalidateFramebuffer(n.DRAW_FRAMEBUFFER,R)),n.invalidateFramebuffer(n.READ_FRAMEBUFFER,De))}if(t.bindFramebuffer(n.READ_FRAMEBUFFER,null),t.bindFramebuffer(n.DRAW_FRAMEBUFFER,null),ae)for(let xe=0;xe<x.length;xe++){t.bindFramebuffer(n.FRAMEBUFFER,fe.__webglMultisampledFramebuffer),n.framebufferRenderbuffer(n.FRAMEBUFFER,n.COLOR_ATTACHMENT0+xe,n.RENDERBUFFER,fe.__webglColorRenderbuffer[xe]);const He=i.get(x[xe]).__webglTexture;t.bindFramebuffer(n.FRAMEBUFFER,fe.__webglFramebuffer),n.framebufferTexture2D(n.DRAW_FRAMEBUFFER,n.COLOR_ATTACHMENT0+xe,n.TEXTURE_2D,He,0)}t.bindFramebuffer(n.DRAW_FRAMEBUFFER,fe.__webglMultisampledFramebuffer)}else if(T.depthBuffer&&T.resolveDepthBuffer===!1&&l){const x=T.stencilBuffer?n.DEPTH_STENCIL_ATTACHMENT:n.DEPTH_ATTACHMENT;n.invalidateFramebuffer(n.DRAW_FRAMEBUFFER,[x])}}}function he(T){return Math.min(s.maxSamples,T.samples)}function Re(T){const x=i.get(T);return T.samples>0&&e.has("WEBGL_multisampled_render_to_texture")===!0&&x.__useRenderToTexture!==!1}function me(T){const x=a.render.frame;u.get(T)!==x&&(u.set(T,x),T.update())}function Ie(T,x){const O=T.colorSpace,K=T.format,Y=T.type;return T.isCompressedTexture===!0||T.isVideoTexture===!0||O!==qi&&O!==Bn&&(qe.getTransfer(O)===Je?(K!==Ht||Y!==sn)&&console.warn("THREE.WebGLTextures: sRGB encoded textures have to use RGBAFormat and UnsignedByteType."):console.error("THREE.WebGLTextures: Unsupported texture color space:",O)),x}function Se(T){return typeof HTMLImageElement<"u"&&T instanceof HTMLImageElement?(c.width=T.naturalWidth||T.width,c.height=T.naturalHeight||T.height):typeof VideoFrame<"u"&&T instanceof VideoFrame?(c.width=T.displayWidth,c.height=T.displayHeight):(c.width=T.width,c.height=T.height),c}this.allocateTextureUnit=F,this.resetTextureUnits=H,this.setTexture2D=$,this.setTexture2DArray=k,this.setTexture3D=j,this.setTextureCube=V,this.rebindTextures=te,this.setupRenderTarget=oe,this.updateRenderTargetMipmap=ve,this.updateMultisampleRenderTarget=Oe,this.setupDepthRenderbuffer=Ce,this.setupFrameBufferTexture=ce,this.useMultisampledRTT=Re}function Hm(n,e){function t(i,s=Bn){let r;const a=qe.getTransfer(s);if(i===sn)return n.UNSIGNED_BYTE;if(i===eo)return n.UNSIGNED_SHORT_4_4_4_4;if(i===to)return n.UNSIGNED_SHORT_5_5_5_1;if(i===Gl)return n.UNSIGNED_INT_5_9_9_9_REV;if(i===zl)return n.BYTE;if(i===kl)return n.SHORT;if(i===ds)return n.UNSIGNED_SHORT;if(i===Qa)return n.INT;if(i===hi)return n.UNSIGNED_INT;if(i===un)return n.FLOAT;if(i===xs)return n.HALF_FLOAT;if(i===Hl)return n.ALPHA;if(i===Vl)return n.RGB;if(i===Ht)return n.RGBA;if(i===Wl)return n.LUMINANCE;if(i===Xl)return n.LUMINANCE_ALPHA;if(i===Li)return n.DEPTH_COMPONENT;if(i===ki)return n.DEPTH_STENCIL;if(i===ql)return n.RED;if(i===no)return n.RED_INTEGER;if(i===Yl)return n.RG;if(i===io)return n.RG_INTEGER;if(i===so)return n.RGBA_INTEGER;if(i===Js||i===Qs||i===er||i===tr)if(a===Je)if(r=e.get("WEBGL_compressed_texture_s3tc_srgb"),r!==null){if(i===Js)return r.COMPRESSED_SRGB_S3TC_DXT1_EXT;if(i===Qs)return r.COMPRESSED_SRGB_ALPHA_S3TC_DXT1_EXT;if(i===er)return r.COMPRESSED_SRGB_ALPHA_S3TC_DXT3_EXT;if(i===tr)return r.COMPRESSED_SRGB_ALPHA_S3TC_DXT5_EXT}else return null;else if(r=e.get("WEBGL_compressed_texture_s3tc"),r!==null){if(i===Js)return r.COMPRESSED_RGB_S3TC_DXT1_EXT;if(i===Qs)return r.COMPRESSED_RGBA_S3TC_DXT1_EXT;if(i===er)return r.COMPRESSED_RGBA_S3TC_DXT3_EXT;if(i===tr)return r.COMPRESSED_RGBA_S3TC_DXT5_EXT}else return null;if(i===xa||i===Ma||i===Sa||i===ya)if(r=e.get("WEBGL_compressed_texture_pvrtc"),r!==null){if(i===xa)return r.COMPRESSED_RGB_PVRTC_4BPPV1_IMG;if(i===Ma)return r.COMPRESSED_RGB_PVRTC_2BPPV1_IMG;if(i===Sa)return r.COMPRESSED_RGBA_PVRTC_4BPPV1_IMG;if(i===ya)return r.COMPRESSED_RGBA_PVRTC_2BPPV1_IMG}else return null;if(i===Ea||i===Ta||i===Aa)if(r=e.get("WEBGL_compressed_texture_etc"),r!==null){if(i===Ea||i===Ta)return a===Je?r.COMPRESSED_SRGB8_ETC2:r.COMPRESSED_RGB8_ETC2;if(i===Aa)return a===Je?r.COMPRESSED_SRGB8_ALPHA8_ETC2_EAC:r.COMPRESSED_RGBA8_ETC2_EAC}else return null;if(i===ba||i===wa||i===Ra||i===Ca||i===Pa||i===Da||i===La||i===Ia||i===Ua||i===Na||i===Fa||i===Oa||i===Ba||i===za)if(r=e.get("WEBGL_compressed_texture_astc"),r!==null){if(i===ba)return a===Je?r.COMPRESSED_SRGB8_ALPHA8_ASTC_4x4_KHR:r.COMPRESSED_RGBA_ASTC_4x4_KHR;if(i===wa)return a===Je?r.COMPRESSED_SRGB8_ALPHA8_ASTC_5x4_KHR:r.COMPRESSED_RGBA_ASTC_5x4_KHR;if(i===Ra)return a===Je?r.COMPRESSED_SRGB8_ALPHA8_ASTC_5x5_KHR:r.COMPRESSED_RGBA_ASTC_5x5_KHR;if(i===Ca)return a===Je?r.COMPRESSED_SRGB8_ALPHA8_ASTC_6x5_KHR:r.COMPRESSED_RGBA_ASTC_6x5_KHR;if(i===Pa)return a===Je?r.COMPRESSED_SRGB8_ALPHA8_ASTC_6x6_KHR:r.COMPRESSED_RGBA_ASTC_6x6_KHR;if(i===Da)return a===Je?r.COMPRESSED_SRGB8_ALPHA8_ASTC_8x5_KHR:r.COMPRESSED_RGBA_ASTC_8x5_KHR;if(i===La)return a===Je?r.COMPRESSED_SRGB8_ALPHA8_ASTC_8x6_KHR:r.COMPRESSED_RGBA_ASTC_8x6_KHR;if(i===Ia)return a===Je?r.COMPRESSED_SRGB8_ALPHA8_ASTC_8x8_KHR:r.COMPRESSED_RGBA_ASTC_8x8_KHR;if(i===Ua)return a===Je?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x5_KHR:r.COMPRESSED_RGBA_ASTC_10x5_KHR;if(i===Na)return a===Je?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x6_KHR:r.COMPRESSED_RGBA_ASTC_10x6_KHR;if(i===Fa)return a===Je?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x8_KHR:r.COMPRESSED_RGBA_ASTC_10x8_KHR;if(i===Oa)return a===Je?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x10_KHR:r.COMPRESSED_RGBA_ASTC_10x10_KHR;if(i===Ba)return a===Je?r.COMPRESSED_SRGB8_ALPHA8_ASTC_12x10_KHR:r.COMPRESSED_RGBA_ASTC_12x10_KHR;if(i===za)return a===Je?r.COMPRESSED_SRGB8_ALPHA8_ASTC_12x12_KHR:r.COMPRESSED_RGBA_ASTC_12x12_KHR}else return null;if(i===nr||i===ka||i===Ga)if(r=e.get("EXT_texture_compression_bptc"),r!==null){if(i===nr)return a===Je?r.COMPRESSED_SRGB_ALPHA_BPTC_UNORM_EXT:r.COMPRESSED_RGBA_BPTC_UNORM_EXT;if(i===ka)return r.COMPRESSED_RGB_BPTC_SIGNED_FLOAT_EXT;if(i===Ga)return r.COMPRESSED_RGB_BPTC_UNSIGNED_FLOAT_EXT}else return null;if(i===Kl||i===Ha||i===Va||i===Wa)if(r=e.get("EXT_texture_compression_rgtc"),r!==null){if(i===nr)return r.COMPRESSED_RED_RGTC1_EXT;if(i===Ha)return r.COMPRESSED_SIGNED_RED_RGTC1_EXT;if(i===Va)return r.COMPRESSED_RED_GREEN_RGTC2_EXT;if(i===Wa)return r.COMPRESSED_SIGNED_RED_GREEN_RGTC2_EXT}else return null;return i===zi?n.UNSIGNED_INT_24_8:n[i]!==void 0?n[i]:null}return{convert:t}}class Vm extends Ut{constructor(e=[]){super(),this.isArrayCamera=!0,this.cameras=e}}class Ys extends Ct{constructor(){super(),this.isGroup=!0,this.type="Group"}}const Wm={type:"move"};class Jr{constructor(){this._targetRay=null,this._grip=null,this._hand=null}getHandSpace(){return this._hand===null&&(this._hand=new Ys,this._hand.matrixAutoUpdate=!1,this._hand.visible=!1,this._hand.joints={},this._hand.inputState={pinching:!1}),this._hand}getTargetRaySpace(){return this._targetRay===null&&(this._targetRay=new Ys,this._targetRay.matrixAutoUpdate=!1,this._targetRay.visible=!1,this._targetRay.hasLinearVelocity=!1,this._targetRay.linearVelocity=new N,this._targetRay.hasAngularVelocity=!1,this._targetRay.angularVelocity=new N),this._targetRay}getGripSpace(){return this._grip===null&&(this._grip=new Ys,this._grip.matrixAutoUpdate=!1,this._grip.visible=!1,this._grip.hasLinearVelocity=!1,this._grip.linearVelocity=new N,this._grip.hasAngularVelocity=!1,this._grip.angularVelocity=new N),this._grip}dispatchEvent(e){return this._targetRay!==null&&this._targetRay.dispatchEvent(e),this._grip!==null&&this._grip.dispatchEvent(e),this._hand!==null&&this._hand.dispatchEvent(e),this}connect(e){if(e&&e.hand){const t=this._hand;if(t)for(const i of e.hand.values())this._getHandJoint(t,i)}return this.dispatchEvent({type:"connected",data:e}),this}disconnect(e){return this.dispatchEvent({type:"disconnected",data:e}),this._targetRay!==null&&(this._targetRay.visible=!1),this._grip!==null&&(this._grip.visible=!1),this._hand!==null&&(this._hand.visible=!1),this}update(e,t,i){let s=null,r=null,a=null;const o=this._targetRay,l=this._grip,c=this._hand;if(e&&t.session.visibilityState!=="visible-blurred"){if(c&&e.hand){a=!0;for(const v of e.hand.values()){const p=t.getJointPose(v,i),h=this._getHandJoint(c,v);p!==null&&(h.matrix.fromArray(p.transform.matrix),h.matrix.decompose(h.position,h.rotation,h.scale),h.matrixWorldNeedsUpdate=!0,h.jointRadius=p.radius),h.visible=p!==null}const u=c.joints["index-finger-tip"],f=c.joints["thumb-tip"],d=u.position.distanceTo(f.position),m=.02,_=.005;c.inputState.pinching&&d>m+_?(c.inputState.pinching=!1,this.dispatchEvent({type:"pinchend",handedness:e.handedness,target:this})):!c.inputState.pinching&&d<=m-_&&(c.inputState.pinching=!0,this.dispatchEvent({type:"pinchstart",handedness:e.handedness,target:this}))}else l!==null&&e.gripSpace&&(r=t.getPose(e.gripSpace,i),r!==null&&(l.matrix.fromArray(r.transform.matrix),l.matrix.decompose(l.position,l.rotation,l.scale),l.matrixWorldNeedsUpdate=!0,r.linearVelocity?(l.hasLinearVelocity=!0,l.linearVelocity.copy(r.linearVelocity)):l.hasLinearVelocity=!1,r.angularVelocity?(l.hasAngularVelocity=!0,l.angularVelocity.copy(r.angularVelocity)):l.hasAngularVelocity=!1));o!==null&&(s=t.getPose(e.targetRaySpace,i),s===null&&r!==null&&(s=r),s!==null&&(o.matrix.fromArray(s.transform.matrix),o.matrix.decompose(o.position,o.rotation,o.scale),o.matrixWorldNeedsUpdate=!0,s.linearVelocity?(o.hasLinearVelocity=!0,o.linearVelocity.copy(s.linearVelocity)):o.hasLinearVelocity=!1,s.angularVelocity?(o.hasAngularVelocity=!0,o.angularVelocity.copy(s.angularVelocity)):o.hasAngularVelocity=!1,this.dispatchEvent(Wm)))}return o!==null&&(o.visible=s!==null),l!==null&&(l.visible=r!==null),c!==null&&(c.visible=a!==null),this}_getHandJoint(e,t){if(e.joints[t.jointName]===void 0){const i=new Ys;i.matrixAutoUpdate=!1,i.visible=!1,e.joints[t.jointName]=i,e.add(i)}return e.joints[t.jointName]}}const Xm=`
void main() {

	gl_Position = vec4( position, 1.0 );

}`,qm=`
uniform sampler2DArray depthColor;
uniform float depthWidth;
uniform float depthHeight;

void main() {

	vec2 coord = vec2( gl_FragCoord.x / depthWidth, gl_FragCoord.y / depthHeight );

	if ( coord.x >= 1.0 ) {

		gl_FragDepth = texture( depthColor, vec3( coord.x - 1.0, coord.y, 1 ) ).r;

	} else {

		gl_FragDepth = texture( depthColor, vec3( coord.x, coord.y, 0 ) ).r;

	}

}`;class Ym{constructor(){this.texture=null,this.mesh=null,this.depthNear=0,this.depthFar=0}init(e,t,i){if(this.texture===null){const s=new St,r=e.properties.get(s);r.__webglTexture=t.texture,(t.depthNear!=i.depthNear||t.depthFar!=i.depthFar)&&(this.depthNear=t.depthNear,this.depthFar=t.depthFar),this.texture=s}}getMesh(e){if(this.texture!==null&&this.mesh===null){const t=e.cameras[0].viewport,i=new wt({vertexShader:Xm,fragmentShader:qm,uniforms:{depthColor:{value:this.texture},depthWidth:{value:t.z},depthHeight:{value:t.w}}});this.mesh=new Vt(new $i(20,20),i)}return this.mesh}reset(){this.texture=null,this.mesh=null}getDepthTexture(){return this.texture}}class Km extends Yi{constructor(e,t){super();const i=this;let s=null,r=1,a=null,o="local-floor",l=1,c=null,u=null,f=null,d=null,m=null,_=null;const v=new Ym,p=t.getContextAttributes();let h=null,A=null;const S=[],g=[],P=new Ve;let b=null;const w=new Ut;w.viewport=new tt;const D=new Ut;D.viewport=new tt;const E=[w,D],M=new Vm;let C=null,H=null;this.cameraAutoUpdate=!0,this.enabled=!1,this.isPresenting=!1,this.getController=function(B){let Z=S[B];return Z===void 0&&(Z=new Jr,S[B]=Z),Z.getTargetRaySpace()},this.getControllerGrip=function(B){let Z=S[B];return Z===void 0&&(Z=new Jr,S[B]=Z),Z.getGripSpace()},this.getHand=function(B){let Z=S[B];return Z===void 0&&(Z=new Jr,S[B]=Z),Z.getHandSpace()};function F(B){const Z=g.indexOf(B.inputSource);if(Z===-1)return;const ce=S[Z];ce!==void 0&&(ce.update(B.inputSource,B.frame,c||a),ce.dispatchEvent({type:B.type,data:B.inputSource}))}function W(){s.removeEventListener("select",F),s.removeEventListener("selectstart",F),s.removeEventListener("selectend",F),s.removeEventListener("squeeze",F),s.removeEventListener("squeezestart",F),s.removeEventListener("squeezeend",F),s.removeEventListener("end",W),s.removeEventListener("inputsourceschange",$);for(let B=0;B<S.length;B++){const Z=g[B];Z!==null&&(g[B]=null,S[B].disconnect(Z))}C=null,H=null,v.reset(),e.setRenderTarget(h),m=null,d=null,f=null,s=null,A=null,Fe.stop(),i.isPresenting=!1,e.setPixelRatio(b),e.setSize(P.width,P.height,!1),i.dispatchEvent({type:"sessionend"})}this.setFramebufferScaleFactor=function(B){r=B,i.isPresenting===!0&&console.warn("THREE.WebXRManager: Cannot change framebuffer scale while presenting.")},this.setReferenceSpaceType=function(B){o=B,i.isPresenting===!0&&console.warn("THREE.WebXRManager: Cannot change reference space type while presenting.")},this.getReferenceSpace=function(){return c||a},this.setReferenceSpace=function(B){c=B},this.getBaseLayer=function(){return d!==null?d:m},this.getBinding=function(){return f},this.getFrame=function(){return _},this.getSession=function(){return s},this.setSession=async function(B){if(s=B,s!==null){if(h=e.getRenderTarget(),s.addEventListener("select",F),s.addEventListener("selectstart",F),s.addEventListener("selectend",F),s.addEventListener("squeeze",F),s.addEventListener("squeezestart",F),s.addEventListener("squeezeend",F),s.addEventListener("end",W),s.addEventListener("inputsourceschange",$),p.xrCompatible!==!0&&await t.makeXRCompatible(),b=e.getPixelRatio(),e.getSize(P),s.renderState.layers===void 0){const Z={antialias:p.antialias,alpha:!0,depth:p.depth,stencil:p.stencil,framebufferScaleFactor:r};m=new XRWebGLLayer(s,t,Z),s.updateRenderState({baseLayer:m}),e.setPixelRatio(1),e.setSize(m.framebufferWidth,m.framebufferHeight,!1),A=new Tn(m.framebufferWidth,m.framebufferHeight,{format:Ht,type:sn,colorSpace:e.outputColorSpace,stencilBuffer:p.stencil})}else{let Z=null,ce=null,ee=null;p.depth&&(ee=p.stencil?t.DEPTH24_STENCIL8:t.DEPTH_COMPONENT24,Z=p.stencil?ki:Li,ce=p.stencil?zi:hi);const ye={colorFormat:t.RGBA8,depthFormat:ee,scaleFactor:r};f=new XRWebGLBinding(s,t),d=f.createProjectionLayer(ye),s.updateRenderState({layers:[d]}),e.setPixelRatio(1),e.setSize(d.textureWidth,d.textureHeight,!1),A=new Tn(d.textureWidth,d.textureHeight,{format:Ht,type:sn,depthTexture:new hc(d.textureWidth,d.textureHeight,ce,void 0,void 0,void 0,void 0,void 0,void 0,Z),stencilBuffer:p.stencil,colorSpace:e.outputColorSpace,samples:p.antialias?4:0,resolveDepthBuffer:d.ignoreDepthValues===!1})}A.isXRRenderTarget=!0,this.setFoveation(l),c=null,a=await s.requestReferenceSpace(o),Fe.setContext(s),Fe.start(),i.isPresenting=!0,i.dispatchEvent({type:"sessionstart"})}},this.getEnvironmentBlendMode=function(){if(s!==null)return s.environmentBlendMode},this.getDepthTexture=function(){return v.getDepthTexture()};function $(B){for(let Z=0;Z<B.removed.length;Z++){const ce=B.removed[Z],ee=g.indexOf(ce);ee>=0&&(g[ee]=null,S[ee].disconnect(ce))}for(let Z=0;Z<B.added.length;Z++){const ce=B.added[Z];let ee=g.indexOf(ce);if(ee===-1){for(let Ce=0;Ce<S.length;Ce++)if(Ce>=g.length){g.push(ce),ee=Ce;break}else if(g[Ce]===null){g[Ce]=ce,ee=Ce;break}if(ee===-1)break}const ye=S[ee];ye&&ye.connect(ce)}}const k=new N,j=new N;function V(B,Z,ce){k.setFromMatrixPosition(Z.matrixWorld),j.setFromMatrixPosition(ce.matrixWorld);const ee=k.distanceTo(j),ye=Z.projectionMatrix.elements,Ce=ce.projectionMatrix.elements,te=ye[14]/(ye[10]-1),oe=ye[14]/(ye[10]+1),ve=(ye[9]+1)/ye[5],De=(ye[9]-1)/ye[5],R=(ye[8]-1)/ye[0],Oe=(Ce[8]+1)/Ce[0],he=te*R,Re=te*Oe,me=ee/(-R+Oe),Ie=me*-R;if(Z.matrixWorld.decompose(B.position,B.quaternion,B.scale),B.translateX(Ie),B.translateZ(me),B.matrixWorld.compose(B.position,B.quaternion,B.scale),B.matrixWorldInverse.copy(B.matrixWorld).invert(),ye[10]===-1)B.projectionMatrix.copy(Z.projectionMatrix),B.projectionMatrixInverse.copy(Z.projectionMatrixInverse);else{const Se=te+me,T=oe+me,x=he-Ie,O=Re+(ee-Ie),K=ve*oe/T*Se,Y=De*oe/T*Se;B.projectionMatrix.makePerspective(x,O,K,Y,Se,T),B.projectionMatrixInverse.copy(B.projectionMatrix).invert()}}function ne(B,Z){Z===null?B.matrixWorld.copy(B.matrix):B.matrixWorld.multiplyMatrices(Z.matrixWorld,B.matrix),B.matrixWorldInverse.copy(B.matrixWorld).invert()}this.updateCamera=function(B){if(s===null)return;let Z=B.near,ce=B.far;v.texture!==null&&(v.depthNear>0&&(Z=v.depthNear),v.depthFar>0&&(ce=v.depthFar)),M.near=D.near=w.near=Z,M.far=D.far=w.far=ce,(C!==M.near||H!==M.far)&&(s.updateRenderState({depthNear:M.near,depthFar:M.far}),C=M.near,H=M.far),w.layers.mask=B.layers.mask|2,D.layers.mask=B.layers.mask|4,M.layers.mask=w.layers.mask|D.layers.mask;const ee=B.parent,ye=M.cameras;ne(M,ee);for(let Ce=0;Ce<ye.length;Ce++)ne(ye[Ce],ee);ye.length===2?V(M,w,D):M.projectionMatrix.copy(w.projectionMatrix),Q(B,M,ee)};function Q(B,Z,ce){ce===null?B.matrix.copy(Z.matrixWorld):(B.matrix.copy(ce.matrixWorld),B.matrix.invert(),B.matrix.multiply(Z.matrixWorld)),B.matrix.decompose(B.position,B.quaternion,B.scale),B.updateMatrixWorld(!0),B.projectionMatrix.copy(Z.projectionMatrix),B.projectionMatrixInverse.copy(Z.projectionMatrixInverse),B.isPerspectiveCamera&&(B.fov=Xa*2*Math.atan(1/B.projectionMatrix.elements[5]),B.zoom=1)}this.getCamera=function(){return M},this.getFoveation=function(){if(!(d===null&&m===null))return l},this.setFoveation=function(B){l=B,d!==null&&(d.fixedFoveation=B),m!==null&&m.fixedFoveation!==void 0&&(m.fixedFoveation=B)},this.hasDepthSensing=function(){return v.texture!==null},this.getDepthSensingMesh=function(){return v.getMesh(M)};let re=null;function be(B,Z){if(u=Z.getViewerPose(c||a),_=Z,u!==null){const ce=u.views;m!==null&&(e.setRenderTargetFramebuffer(A,m.framebuffer),e.setRenderTarget(A));let ee=!1;ce.length!==M.cameras.length&&(M.cameras.length=0,ee=!0);for(let Ce=0;Ce<ce.length;Ce++){const te=ce[Ce];let oe=null;if(m!==null)oe=m.getViewport(te);else{const De=f.getViewSubImage(d,te);oe=De.viewport,Ce===0&&(e.setRenderTargetTextures(A,De.colorTexture,d.ignoreDepthValues?void 0:De.depthStencilTexture),e.setRenderTarget(A))}let ve=E[Ce];ve===void 0&&(ve=new Ut,ve.layers.enable(Ce),ve.viewport=new tt,E[Ce]=ve),ve.matrix.fromArray(te.transform.matrix),ve.matrix.decompose(ve.position,ve.quaternion,ve.scale),ve.projectionMatrix.fromArray(te.projectionMatrix),ve.projectionMatrixInverse.copy(ve.projectionMatrix).invert(),ve.viewport.set(oe.x,oe.y,oe.width,oe.height),Ce===0&&(M.matrix.copy(ve.matrix),M.matrix.decompose(M.position,M.quaternion,M.scale)),ee===!0&&M.cameras.push(ve)}const ye=s.enabledFeatures;if(ye&&ye.includes("depth-sensing")){const Ce=f.getDepthInformation(ce[0]);Ce&&Ce.isValid&&Ce.texture&&v.init(e,Ce,s.renderState)}}for(let ce=0;ce<S.length;ce++){const ee=g[ce],ye=S[ce];ee!==null&&ye!==void 0&&ye.update(ee,Z,c||a)}re&&re(B,Z),Z.detectedPlanes&&i.dispatchEvent({type:"planesdetected",data:Z}),_=null}const Fe=new cc;Fe.setAnimationLoop(be),this.setAnimationLoop=function(B){re=B},this.dispose=function(){}}}const Qn=new An,$m=new rt;function Zm(n,e){function t(p,h){p.matrixAutoUpdate===!0&&p.updateMatrix(),h.value.copy(p.matrix)}function i(p,h){h.color.getRGB(p.fogColor.value,rc(n)),h.isFog?(p.fogNear.value=h.near,p.fogFar.value=h.far):h.isFogExp2&&(p.fogDensity.value=h.density)}function s(p,h,A,S,g){h.isMeshBasicMaterial||h.isMeshLambertMaterial?r(p,h):h.isMeshToonMaterial?(r(p,h),f(p,h)):h.isMeshPhongMaterial?(r(p,h),u(p,h)):h.isMeshStandardMaterial?(r(p,h),d(p,h),h.isMeshPhysicalMaterial&&m(p,h,g)):h.isMeshMatcapMaterial?(r(p,h),_(p,h)):h.isMeshDepthMaterial?r(p,h):h.isMeshDistanceMaterial?(r(p,h),v(p,h)):h.isMeshNormalMaterial?r(p,h):h.isLineBasicMaterial?(a(p,h),h.isLineDashedMaterial&&o(p,h)):h.isPointsMaterial?l(p,h,A,S):h.isSpriteMaterial?c(p,h):h.isShadowMaterial?(p.color.value.copy(h.color),p.opacity.value=h.opacity):h.isShaderMaterial&&(h.uniformsNeedUpdate=!1)}function r(p,h){p.opacity.value=h.opacity,h.color&&p.diffuse.value.copy(h.color),h.emissive&&p.emissive.value.copy(h.emissive).multiplyScalar(h.emissiveIntensity),h.map&&(p.map.value=h.map,t(h.map,p.mapTransform)),h.alphaMap&&(p.alphaMap.value=h.alphaMap,t(h.alphaMap,p.alphaMapTransform)),h.bumpMap&&(p.bumpMap.value=h.bumpMap,t(h.bumpMap,p.bumpMapTransform),p.bumpScale.value=h.bumpScale,h.side===Rt&&(p.bumpScale.value*=-1)),h.normalMap&&(p.normalMap.value=h.normalMap,t(h.normalMap,p.normalMapTransform),p.normalScale.value.copy(h.normalScale),h.side===Rt&&p.normalScale.value.negate()),h.displacementMap&&(p.displacementMap.value=h.displacementMap,t(h.displacementMap,p.displacementMapTransform),p.displacementScale.value=h.displacementScale,p.displacementBias.value=h.displacementBias),h.emissiveMap&&(p.emissiveMap.value=h.emissiveMap,t(h.emissiveMap,p.emissiveMapTransform)),h.specularMap&&(p.specularMap.value=h.specularMap,t(h.specularMap,p.specularMapTransform)),h.alphaTest>0&&(p.alphaTest.value=h.alphaTest);const A=e.get(h),S=A.envMap,g=A.envMapRotation;S&&(p.envMap.value=S,Qn.copy(g),Qn.x*=-1,Qn.y*=-1,Qn.z*=-1,S.isCubeTexture&&S.isRenderTargetTexture===!1&&(Qn.y*=-1,Qn.z*=-1),p.envMapRotation.value.setFromMatrix4($m.makeRotationFromEuler(Qn)),p.flipEnvMap.value=S.isCubeTexture&&S.isRenderTargetTexture===!1?-1:1,p.reflectivity.value=h.reflectivity,p.ior.value=h.ior,p.refractionRatio.value=h.refractionRatio),h.lightMap&&(p.lightMap.value=h.lightMap,p.lightMapIntensity.value=h.lightMapIntensity,t(h.lightMap,p.lightMapTransform)),h.aoMap&&(p.aoMap.value=h.aoMap,p.aoMapIntensity.value=h.aoMapIntensity,t(h.aoMap,p.aoMapTransform))}function a(p,h){p.diffuse.value.copy(h.color),p.opacity.value=h.opacity,h.map&&(p.map.value=h.map,t(h.map,p.mapTransform))}function o(p,h){p.dashSize.value=h.dashSize,p.totalSize.value=h.dashSize+h.gapSize,p.scale.value=h.scale}function l(p,h,A,S){p.diffuse.value.copy(h.color),p.opacity.value=h.opacity,p.size.value=h.size*A,p.scale.value=S*.5,h.map&&(p.map.value=h.map,t(h.map,p.uvTransform)),h.alphaMap&&(p.alphaMap.value=h.alphaMap,t(h.alphaMap,p.alphaMapTransform)),h.alphaTest>0&&(p.alphaTest.value=h.alphaTest)}function c(p,h){p.diffuse.value.copy(h.color),p.opacity.value=h.opacity,p.rotation.value=h.rotation,h.map&&(p.map.value=h.map,t(h.map,p.mapTransform)),h.alphaMap&&(p.alphaMap.value=h.alphaMap,t(h.alphaMap,p.alphaMapTransform)),h.alphaTest>0&&(p.alphaTest.value=h.alphaTest)}function u(p,h){p.specular.value.copy(h.specular),p.shininess.value=Math.max(h.shininess,1e-4)}function f(p,h){h.gradientMap&&(p.gradientMap.value=h.gradientMap)}function d(p,h){p.metalness.value=h.metalness,h.metalnessMap&&(p.metalnessMap.value=h.metalnessMap,t(h.metalnessMap,p.metalnessMapTransform)),p.roughness.value=h.roughness,h.roughnessMap&&(p.roughnessMap.value=h.roughnessMap,t(h.roughnessMap,p.roughnessMapTransform)),h.envMap&&(p.envMapIntensity.value=h.envMapIntensity)}function m(p,h,A){p.ior.value=h.ior,h.sheen>0&&(p.sheenColor.value.copy(h.sheenColor).multiplyScalar(h.sheen),p.sheenRoughness.value=h.sheenRoughness,h.sheenColorMap&&(p.sheenColorMap.value=h.sheenColorMap,t(h.sheenColorMap,p.sheenColorMapTransform)),h.sheenRoughnessMap&&(p.sheenRoughnessMap.value=h.sheenRoughnessMap,t(h.sheenRoughnessMap,p.sheenRoughnessMapTransform))),h.clearcoat>0&&(p.clearcoat.value=h.clearcoat,p.clearcoatRoughness.value=h.clearcoatRoughness,h.clearcoatMap&&(p.clearcoatMap.value=h.clearcoatMap,t(h.clearcoatMap,p.clearcoatMapTransform)),h.clearcoatRoughnessMap&&(p.clearcoatRoughnessMap.value=h.clearcoatRoughnessMap,t(h.clearcoatRoughnessMap,p.clearcoatRoughnessMapTransform)),h.clearcoatNormalMap&&(p.clearcoatNormalMap.value=h.clearcoatNormalMap,t(h.clearcoatNormalMap,p.clearcoatNormalMapTransform),p.clearcoatNormalScale.value.copy(h.clearcoatNormalScale),h.side===Rt&&p.clearcoatNormalScale.value.negate())),h.dispersion>0&&(p.dispersion.value=h.dispersion),h.iridescence>0&&(p.iridescence.value=h.iridescence,p.iridescenceIOR.value=h.iridescenceIOR,p.iridescenceThicknessMinimum.value=h.iridescenceThicknessRange[0],p.iridescenceThicknessMaximum.value=h.iridescenceThicknessRange[1],h.iridescenceMap&&(p.iridescenceMap.value=h.iridescenceMap,t(h.iridescenceMap,p.iridescenceMapTransform)),h.iridescenceThicknessMap&&(p.iridescenceThicknessMap.value=h.iridescenceThicknessMap,t(h.iridescenceThicknessMap,p.iridescenceThicknessMapTransform))),h.transmission>0&&(p.transmission.value=h.transmission,p.transmissionSamplerMap.value=A.texture,p.transmissionSamplerSize.value.set(A.width,A.height),h.transmissionMap&&(p.transmissionMap.value=h.transmissionMap,t(h.transmissionMap,p.transmissionMapTransform)),p.thickness.value=h.thickness,h.thicknessMap&&(p.thicknessMap.value=h.thicknessMap,t(h.thicknessMap,p.thicknessMapTransform)),p.attenuationDistance.value=h.attenuationDistance,p.attenuationColor.value.copy(h.attenuationColor)),h.anisotropy>0&&(p.anisotropyVector.value.set(h.anisotropy*Math.cos(h.anisotropyRotation),h.anisotropy*Math.sin(h.anisotropyRotation)),h.anisotropyMap&&(p.anisotropyMap.value=h.anisotropyMap,t(h.anisotropyMap,p.anisotropyMapTransform))),p.specularIntensity.value=h.specularIntensity,p.specularColor.value.copy(h.specularColor),h.specularColorMap&&(p.specularColorMap.value=h.specularColorMap,t(h.specularColorMap,p.specularColorMapTransform)),h.specularIntensityMap&&(p.specularIntensityMap.value=h.specularIntensityMap,t(h.specularIntensityMap,p.specularIntensityMapTransform))}function _(p,h){h.matcap&&(p.matcap.value=h.matcap)}function v(p,h){const A=e.get(h).light;p.referencePosition.value.setFromMatrixPosition(A.matrixWorld),p.nearDistance.value=A.shadow.camera.near,p.farDistance.value=A.shadow.camera.far}return{refreshFogUniforms:i,refreshMaterialUniforms:s}}function jm(n,e,t,i){let s={},r={},a=[];const o=n.getParameter(n.MAX_UNIFORM_BUFFER_BINDINGS);function l(A,S){const g=S.program;i.uniformBlockBinding(A,g)}function c(A,S){let g=s[A.id];g===void 0&&(_(A),g=u(A),s[A.id]=g,A.addEventListener("dispose",p));const P=S.program;i.updateUBOMapping(A,P);const b=e.render.frame;r[A.id]!==b&&(d(A),r[A.id]=b)}function u(A){const S=f();A.__bindingPointIndex=S;const g=n.createBuffer(),P=A.__size,b=A.usage;return n.bindBuffer(n.UNIFORM_BUFFER,g),n.bufferData(n.UNIFORM_BUFFER,P,b),n.bindBuffer(n.UNIFORM_BUFFER,null),n.bindBufferBase(n.UNIFORM_BUFFER,S,g),g}function f(){for(let A=0;A<o;A++)if(a.indexOf(A)===-1)return a.push(A),A;return console.error("THREE.WebGLRenderer: Maximum number of simultaneously usable uniforms groups reached."),0}function d(A){const S=s[A.id],g=A.uniforms,P=A.__cache;n.bindBuffer(n.UNIFORM_BUFFER,S);for(let b=0,w=g.length;b<w;b++){const D=Array.isArray(g[b])?g[b]:[g[b]];for(let E=0,M=D.length;E<M;E++){const C=D[E];if(m(C,b,E,P)===!0){const H=C.__offset,F=Array.isArray(C.value)?C.value:[C.value];let W=0;for(let $=0;$<F.length;$++){const k=F[$],j=v(k);typeof k=="number"||typeof k=="boolean"?(C.__data[0]=k,n.bufferSubData(n.UNIFORM_BUFFER,H+W,C.__data)):k.isMatrix3?(C.__data[0]=k.elements[0],C.__data[1]=k.elements[1],C.__data[2]=k.elements[2],C.__data[3]=0,C.__data[4]=k.elements[3],C.__data[5]=k.elements[4],C.__data[6]=k.elements[5],C.__data[7]=0,C.__data[8]=k.elements[6],C.__data[9]=k.elements[7],C.__data[10]=k.elements[8],C.__data[11]=0):(k.toArray(C.__data,W),W+=j.storage/Float32Array.BYTES_PER_ELEMENT)}n.bufferSubData(n.UNIFORM_BUFFER,H,C.__data)}}}n.bindBuffer(n.UNIFORM_BUFFER,null)}function m(A,S,g,P){const b=A.value,w=S+"_"+g;if(P[w]===void 0)return typeof b=="number"||typeof b=="boolean"?P[w]=b:P[w]=b.clone(),!0;{const D=P[w];if(typeof b=="number"||typeof b=="boolean"){if(D!==b)return P[w]=b,!0}else if(D.equals(b)===!1)return D.copy(b),!0}return!1}function _(A){const S=A.uniforms;let g=0;const P=16;for(let w=0,D=S.length;w<D;w++){const E=Array.isArray(S[w])?S[w]:[S[w]];for(let M=0,C=E.length;M<C;M++){const H=E[M],F=Array.isArray(H.value)?H.value:[H.value];for(let W=0,$=F.length;W<$;W++){const k=F[W],j=v(k),V=g%P,ne=V%j.boundary,Q=V+ne;g+=ne,Q!==0&&P-Q<j.storage&&(g+=P-Q),H.__data=new Float32Array(j.storage/Float32Array.BYTES_PER_ELEMENT),H.__offset=g,g+=j.storage}}}const b=g%P;return b>0&&(g+=P-b),A.__size=g,A.__cache={},this}function v(A){const S={boundary:0,storage:0};return typeof A=="number"||typeof A=="boolean"?(S.boundary=4,S.storage=4):A.isVector2?(S.boundary=8,S.storage=8):A.isVector3||A.isColor?(S.boundary=16,S.storage=12):A.isVector4?(S.boundary=16,S.storage=16):A.isMatrix3?(S.boundary=48,S.storage=48):A.isMatrix4?(S.boundary=64,S.storage=64):A.isTexture?console.warn("THREE.WebGLRenderer: Texture samplers can not be part of an uniforms group."):console.warn("THREE.WebGLRenderer: Unsupported uniform value type.",A),S}function p(A){const S=A.target;S.removeEventListener("dispose",p);const g=a.indexOf(S.__bindingPointIndex);a.splice(g,1),n.deleteBuffer(s[S.id]),delete s[S.id],delete r[S.id]}function h(){for(const A in s)n.deleteBuffer(s[A]);a=[],s={},r={}}return{bind:l,update:c,dispose:h}}class Jm{constructor(e={}){const{canvas:t=zu(),context:i=null,depth:s=!0,stencil:r=!1,alpha:a=!1,antialias:o=!1,premultipliedAlpha:l=!0,preserveDrawingBuffer:c=!1,powerPreference:u="default",failIfMajorPerformanceCaveat:f=!1,reverseDepthBuffer:d=!1}=e;this.isWebGLRenderer=!0;let m;if(i!==null){if(typeof WebGLRenderingContext<"u"&&i instanceof WebGLRenderingContext)throw new Error("THREE.WebGLRenderer: WebGL 1 is not supported since r163.");m=i.getContextAttributes().alpha}else m=a;const _=new Uint32Array(4),v=new Int32Array(4);let p=null,h=null;const A=[],S=[];this.domElement=t,this.debug={checkShaderErrors:!0,onShaderError:null},this.autoClear=!0,this.autoClearColor=!0,this.autoClearDepth=!0,this.autoClearStencil=!0,this.sortObjects=!0,this.clippingPlanes=[],this.localClippingEnabled=!1,this._outputColorSpace=kt,this.toneMapping=Hn,this.toneMappingExposure=1;const g=this;let P=!1,b=0,w=0,D=null,E=-1,M=null;const C=new tt,H=new tt;let F=null;const W=new je(0);let $=0,k=t.width,j=t.height,V=1,ne=null,Q=null;const re=new tt(0,0,k,j),be=new tt(0,0,k,j);let Fe=!1;const B=new lc;let Z=!1,ce=!1;const ee=new rt,ye=new rt,Ce=new N,te=new tt,oe={background:null,fog:null,environment:null,overrideMaterial:null,isScene:!0};let ve=!1;function De(){return D===null?V:1}let R=i;function Oe(y,I){return t.getContext(y,I)}try{const y={alpha:!0,depth:s,stencil:r,antialias:o,premultipliedAlpha:l,preserveDrawingBuffer:c,powerPreference:u,failIfMajorPerformanceCaveat:f};if("setAttribute"in t&&t.setAttribute("data-engine",`three.js r${Ja}`),t.addEventListener("webglcontextlost",J,!1),t.addEventListener("webglcontextrestored",_e,!1),t.addEventListener("webglcontextcreationerror",de,!1),R===null){const I="webgl2";if(R=Oe(I,y),R===null)throw Oe(I)?new Error("Error creating WebGL context with your selected attributes."):new Error("Error creating WebGL context.")}}catch(y){throw console.error("THREE.WebGLRenderer: "+y.message),y}let he,Re,me,Ie,Se,T,x,O,K,Y,q,fe,ae,xe,He,ie,ge,Le,Pe,Me,We,ke,Qe,L;function ue(){he=new ip(R),he.init(),ke=new Hm(R,he),Re=new jd(R,he,e,ke),me=new zm(R,he),Re.reverseDepthBuffer&&d&&me.buffers.depth.setReversed(!0),Ie=new ap(R),Se=new Tm,T=new Gm(R,he,me,Se,Re,ke,Ie),x=new Qd(g),O=new np(g),K=new fh(R),Qe=new $d(R,K),Y=new sp(R,K,Ie,Qe),q=new lp(R,Y,K,Ie),Pe=new op(R,Re,T),ie=new Jd(Se),fe=new Em(g,x,O,he,Re,Qe,ie),ae=new Zm(g,Se),xe=new bm,He=new Lm(he),Le=new Kd(g,x,O,me,q,m,l),ge=new Om(g,q,Re),L=new jm(R,Ie,Re,me),Me=new Zd(R,he,Ie),We=new rp(R,he,Ie),Ie.programs=fe.programs,g.capabilities=Re,g.extensions=he,g.properties=Se,g.renderLists=xe,g.shadowMap=ge,g.state=me,g.info=Ie}ue();const X=new Km(g,R);this.xr=X,this.getContext=function(){return R},this.getContextAttributes=function(){return R.getContextAttributes()},this.forceContextLoss=function(){const y=he.get("WEBGL_lose_context");y&&y.loseContext()},this.forceContextRestore=function(){const y=he.get("WEBGL_lose_context");y&&y.restoreContext()},this.getPixelRatio=function(){return V},this.setPixelRatio=function(y){y!==void 0&&(V=y,this.setSize(k,j,!1))},this.getSize=function(y){return y.set(k,j)},this.setSize=function(y,I,z=!0){if(X.isPresenting){console.warn("THREE.WebGLRenderer: Can't change size while VR device is presenting.");return}k=y,j=I,t.width=Math.floor(y*V),t.height=Math.floor(I*V),z===!0&&(t.style.width=y+"px",t.style.height=I+"px"),this.setViewport(0,0,y,I)},this.getDrawingBufferSize=function(y){return y.set(k*V,j*V).floor()},this.setDrawingBufferSize=function(y,I,z){k=y,j=I,V=z,t.width=Math.floor(y*z),t.height=Math.floor(I*z),this.setViewport(0,0,y,I)},this.getCurrentViewport=function(y){return y.copy(C)},this.getViewport=function(y){return y.copy(re)},this.setViewport=function(y,I,z,G){y.isVector4?re.set(y.x,y.y,y.z,y.w):re.set(y,I,z,G),me.viewport(C.copy(re).multiplyScalar(V).round())},this.getScissor=function(y){return y.copy(be)},this.setScissor=function(y,I,z,G){y.isVector4?be.set(y.x,y.y,y.z,y.w):be.set(y,I,z,G),me.scissor(H.copy(be).multiplyScalar(V).round())},this.getScissorTest=function(){return Fe},this.setScissorTest=function(y){me.setScissorTest(Fe=y)},this.setOpaqueSort=function(y){ne=y},this.setTransparentSort=function(y){Q=y},this.getClearColor=function(y){return y.copy(Le.getClearColor())},this.setClearColor=function(){Le.setClearColor.apply(Le,arguments)},this.getClearAlpha=function(){return Le.getClearAlpha()},this.setClearAlpha=function(){Le.setClearAlpha.apply(Le,arguments)},this.clear=function(y=!0,I=!0,z=!0){let G=0;if(y){let U=!1;if(D!==null){const se=D.texture.format;U=se===so||se===io||se===no}if(U){const se=D.texture.type,pe=se===sn||se===hi||se===ds||se===zi||se===eo||se===to,Ee=Le.getClearColor(),Te=Le.getClearAlpha(),Ue=Ee.r,ze=Ee.g,Ae=Ee.b;pe?(_[0]=Ue,_[1]=ze,_[2]=Ae,_[3]=Te,R.clearBufferuiv(R.COLOR,0,_)):(v[0]=Ue,v[1]=ze,v[2]=Ae,v[3]=Te,R.clearBufferiv(R.COLOR,0,v))}else G|=R.COLOR_BUFFER_BIT}I&&(G|=R.DEPTH_BUFFER_BIT),z&&(G|=R.STENCIL_BUFFER_BIT,this.state.buffers.stencil.setMask(4294967295)),R.clear(G)},this.clearColor=function(){this.clear(!0,!1,!1)},this.clearDepth=function(){this.clear(!1,!0,!1)},this.clearStencil=function(){this.clear(!1,!1,!0)},this.dispose=function(){t.removeEventListener("webglcontextlost",J,!1),t.removeEventListener("webglcontextrestored",_e,!1),t.removeEventListener("webglcontextcreationerror",de,!1),xe.dispose(),He.dispose(),Se.dispose(),x.dispose(),O.dispose(),q.dispose(),Qe.dispose(),L.dispose(),fe.dispose(),X.dispose(),X.removeEventListener("sessionstart",ho),X.removeEventListener("sessionend",fo),Yn.stop()};function J(y){y.preventDefault(),console.log("THREE.WebGLRenderer: Context Lost."),P=!0}function _e(){console.log("THREE.WebGLRenderer: Context Restored."),P=!1;const y=Ie.autoReset,I=ge.enabled,z=ge.autoUpdate,G=ge.needsUpdate,U=ge.type;ue(),Ie.autoReset=y,ge.enabled=I,ge.autoUpdate=z,ge.needsUpdate=G,ge.type=U}function de(y){console.error("THREE.WebGLRenderer: A WebGL context could not be created. Reason: ",y.statusMessage)}function Be(y){const I=y.target;I.removeEventListener("dispose",Be),at(I)}function at(y){vt(y),Se.remove(y)}function vt(y){const I=Se.get(y).programs;I!==void 0&&(I.forEach(function(z){fe.releaseProgram(z)}),y.isShaderMaterial&&fe.releaseShaderCache(y))}this.renderBufferDirect=function(y,I,z,G,U,se){I===null&&(I=oe);const pe=U.isMesh&&U.matrixWorld.determinant()<0,Ee=Bc(y,I,z,G,U);me.setMaterial(G,pe);let Te=z.index,Ue=1;if(G.wireframe===!0){if(Te=Y.getWireframeAttribute(z),Te===void 0)return;Ue=2}const ze=z.drawRange,Ae=z.attributes.position;let Ye=ze.start*Ue,et=(ze.start+ze.count)*Ue;se!==null&&(Ye=Math.max(Ye,se.start*Ue),et=Math.min(et,(se.start+se.count)*Ue)),Te!==null?(Ye=Math.max(Ye,0),et=Math.min(et,Te.count)):Ae!=null&&(Ye=Math.max(Ye,0),et=Math.min(et,Ae.count));const nt=et-Ye;if(nt<0||nt===1/0)return;Qe.setup(U,G,Ee,z,Te);let Tt,Ke=Me;if(Te!==null&&(Tt=K.get(Te),Ke=We,Ke.setIndex(Tt)),U.isMesh)G.wireframe===!0?(me.setLineWidth(G.wireframeLinewidth*De()),Ke.setMode(R.LINES)):Ke.setMode(R.TRIANGLES);else if(U.isLine){let we=G.linewidth;we===void 0&&(we=1),me.setLineWidth(we*De()),U.isLineSegments?Ke.setMode(R.LINES):U.isLineLoop?Ke.setMode(R.LINE_LOOP):Ke.setMode(R.LINE_STRIP)}else U.isPoints?Ke.setMode(R.POINTS):U.isSprite&&Ke.setMode(R.TRIANGLES);if(U.isBatchedMesh)if(U._multiDrawInstances!==null)Ke.renderMultiDrawInstances(U._multiDrawStarts,U._multiDrawCounts,U._multiDrawCount,U._multiDrawInstances);else if(he.get("WEBGL_multi_draw"))Ke.renderMultiDraw(U._multiDrawStarts,U._multiDrawCounts,U._multiDrawCount);else{const we=U._multiDrawStarts,dn=U._multiDrawCounts,$e=U._multiDrawCount,Kt=Te?K.get(Te).bytesPerElement:1,fi=Se.get(G).currentProgram.getUniforms();for(let Dt=0;Dt<$e;Dt++)fi.setValue(R,"_gl_DrawID",Dt),Ke.render(we[Dt]/Kt,dn[Dt])}else if(U.isInstancedMesh)Ke.renderInstances(Ye,nt,U.count);else if(z.isInstancedBufferGeometry){const we=z._maxInstanceCount!==void 0?z._maxInstanceCount:1/0,dn=Math.min(z.instanceCount,we);Ke.renderInstances(Ye,nt,dn)}else Ke.render(Ye,nt)};function Ze(y,I,z){y.transparent===!0&&y.side===ln&&y.forceSinglePass===!1?(y.side=Rt,y.needsUpdate=!0,As(y,I,z),y.side=Xn,y.needsUpdate=!0,As(y,I,z),y.side=ln):As(y,I,z)}this.compile=function(y,I,z=null){z===null&&(z=y),h=He.get(z),h.init(I),S.push(h),z.traverseVisible(function(U){U.isLight&&U.layers.test(I.layers)&&(h.pushLight(U),U.castShadow&&h.pushShadow(U))}),y!==z&&y.traverseVisible(function(U){U.isLight&&U.layers.test(I.layers)&&(h.pushLight(U),U.castShadow&&h.pushShadow(U))}),h.setupLights();const G=new Set;return y.traverse(function(U){if(!(U.isMesh||U.isPoints||U.isLine||U.isSprite))return;const se=U.material;if(se)if(Array.isArray(se))for(let pe=0;pe<se.length;pe++){const Ee=se[pe];Ze(Ee,z,U),G.add(Ee)}else Ze(se,z,U),G.add(se)}),S.pop(),h=null,G},this.compileAsync=function(y,I,z=null){const G=this.compile(y,I,z);return new Promise(U=>{function se(){if(G.forEach(function(pe){Se.get(pe).currentProgram.isReady()&&G.delete(pe)}),G.size===0){U(y);return}setTimeout(se,10)}he.get("KHR_parallel_shader_compile")!==null?se():setTimeout(se,10)})};let Yt=null;function fn(y){Yt&&Yt(y)}function ho(){Yn.stop()}function fo(){Yn.start()}const Yn=new cc;Yn.setAnimationLoop(fn),typeof self<"u"&&Yn.setContext(self),this.setAnimationLoop=function(y){Yt=y,X.setAnimationLoop(y),y===null?Yn.stop():Yn.start()},X.addEventListener("sessionstart",ho),X.addEventListener("sessionend",fo),this.render=function(y,I){if(I!==void 0&&I.isCamera!==!0){console.error("THREE.WebGLRenderer.render: camera is not an instance of THREE.Camera.");return}if(P===!0)return;if(y.matrixWorldAutoUpdate===!0&&y.updateMatrixWorld(),I.parent===null&&I.matrixWorldAutoUpdate===!0&&I.updateMatrixWorld(),X.enabled===!0&&X.isPresenting===!0&&(X.cameraAutoUpdate===!0&&X.updateCamera(I),I=X.getCamera()),y.isScene===!0&&y.onBeforeRender(g,y,I,D),h=He.get(y,S.length),h.init(I),S.push(h),ye.multiplyMatrices(I.projectionMatrix,I.matrixWorldInverse),B.setFromProjectionMatrix(ye),ce=this.localClippingEnabled,Z=ie.init(this.clippingPlanes,ce),p=xe.get(y,A.length),p.init(),A.push(p),X.enabled===!0&&X.isPresenting===!0){const se=g.xr.getDepthSensingMesh();se!==null&&yr(se,I,-1/0,g.sortObjects)}yr(y,I,0,g.sortObjects),p.finish(),g.sortObjects===!0&&p.sort(ne,Q),ve=X.enabled===!1||X.isPresenting===!1||X.hasDepthSensing()===!1,ve&&Le.addToRenderList(p,y),this.info.render.frame++,Z===!0&&ie.beginShadows();const z=h.state.shadowsArray;ge.render(z,y,I),Z===!0&&ie.endShadows(),this.info.autoReset===!0&&this.info.reset();const G=p.opaque,U=p.transmissive;if(h.setupLights(),I.isArrayCamera){const se=I.cameras;if(U.length>0)for(let pe=0,Ee=se.length;pe<Ee;pe++){const Te=se[pe];mo(G,U,y,Te)}ve&&Le.render(y);for(let pe=0,Ee=se.length;pe<Ee;pe++){const Te=se[pe];po(p,y,Te,Te.viewport)}}else U.length>0&&mo(G,U,y,I),ve&&Le.render(y),po(p,y,I);D!==null&&(T.updateMultisampleRenderTarget(D),T.updateRenderTargetMipmap(D)),y.isScene===!0&&y.onAfterRender(g,y,I),Qe.resetDefaultState(),E=-1,M=null,S.pop(),S.length>0?(h=S[S.length-1],Z===!0&&ie.setGlobalState(g.clippingPlanes,h.state.camera)):h=null,A.pop(),A.length>0?p=A[A.length-1]:p=null};function yr(y,I,z,G){if(y.visible===!1)return;if(y.layers.test(I.layers)){if(y.isGroup)z=y.renderOrder;else if(y.isLOD)y.autoUpdate===!0&&y.update(I);else if(y.isLight)h.pushLight(y),y.castShadow&&h.pushShadow(y);else if(y.isSprite){if(!y.frustumCulled||B.intersectsSprite(y)){G&&te.setFromMatrixPosition(y.matrixWorld).applyMatrix4(ye);const pe=q.update(y),Ee=y.material;Ee.visible&&p.push(y,pe,Ee,z,te.z,null)}}else if((y.isMesh||y.isLine||y.isPoints)&&(!y.frustumCulled||B.intersectsObject(y))){const pe=q.update(y),Ee=y.material;if(G&&(y.boundingSphere!==void 0?(y.boundingSphere===null&&y.computeBoundingSphere(),te.copy(y.boundingSphere.center)):(pe.boundingSphere===null&&pe.computeBoundingSphere(),te.copy(pe.boundingSphere.center)),te.applyMatrix4(y.matrixWorld).applyMatrix4(ye)),Array.isArray(Ee)){const Te=pe.groups;for(let Ue=0,ze=Te.length;Ue<ze;Ue++){const Ae=Te[Ue],Ye=Ee[Ae.materialIndex];Ye&&Ye.visible&&p.push(y,pe,Ye,z,te.z,Ae)}}else Ee.visible&&p.push(y,pe,Ee,z,te.z,null)}}const se=y.children;for(let pe=0,Ee=se.length;pe<Ee;pe++)yr(se[pe],I,z,G)}function po(y,I,z,G){const U=y.opaque,se=y.transmissive,pe=y.transparent;h.setupLightsView(z),Z===!0&&ie.setGlobalState(g.clippingPlanes,z),G&&me.viewport(C.copy(G)),U.length>0&&Ts(U,I,z),se.length>0&&Ts(se,I,z),pe.length>0&&Ts(pe,I,z),me.buffers.depth.setTest(!0),me.buffers.depth.setMask(!0),me.buffers.color.setMask(!0),me.setPolygonOffset(!1)}function mo(y,I,z,G){if((z.isScene===!0?z.overrideMaterial:null)!==null)return;h.state.transmissionRenderTarget[G.id]===void 0&&(h.state.transmissionRenderTarget[G.id]=new Tn(1,1,{generateMipmaps:!0,type:he.has("EXT_color_buffer_half_float")||he.has("EXT_color_buffer_float")?xs:sn,minFilter:ai,samples:4,stencilBuffer:r,resolveDepthBuffer:!1,resolveStencilBuffer:!1,colorSpace:qe.workingColorSpace}));const se=h.state.transmissionRenderTarget[G.id],pe=G.viewport||C;se.setSize(pe.z,pe.w);const Ee=g.getRenderTarget();g.setRenderTarget(se),g.getClearColor(W),$=g.getClearAlpha(),$<1&&g.setClearColor(16777215,.5),g.clear(),ve&&Le.render(z);const Te=g.toneMapping;g.toneMapping=Hn;const Ue=G.viewport;if(G.viewport!==void 0&&(G.viewport=void 0),h.setupLightsView(G),Z===!0&&ie.setGlobalState(g.clippingPlanes,G),Ts(y,z,G),T.updateMultisampleRenderTarget(se),T.updateRenderTargetMipmap(se),he.has("WEBGL_multisampled_render_to_texture")===!1){let ze=!1;for(let Ae=0,Ye=I.length;Ae<Ye;Ae++){const et=I[Ae],nt=et.object,Tt=et.geometry,Ke=et.material,we=et.group;if(Ke.side===ln&&nt.layers.test(G.layers)){const dn=Ke.side;Ke.side=Rt,Ke.needsUpdate=!0,go(nt,z,G,Tt,Ke,we),Ke.side=dn,Ke.needsUpdate=!0,ze=!0}}ze===!0&&(T.updateMultisampleRenderTarget(se),T.updateRenderTargetMipmap(se))}g.setRenderTarget(Ee),g.setClearColor(W,$),Ue!==void 0&&(G.viewport=Ue),g.toneMapping=Te}function Ts(y,I,z){const G=I.isScene===!0?I.overrideMaterial:null;for(let U=0,se=y.length;U<se;U++){const pe=y[U],Ee=pe.object,Te=pe.geometry,Ue=G===null?pe.material:G,ze=pe.group;Ee.layers.test(z.layers)&&go(Ee,I,z,Te,Ue,ze)}}function go(y,I,z,G,U,se){y.onBeforeRender(g,I,z,G,U,se),y.modelViewMatrix.multiplyMatrices(z.matrixWorldInverse,y.matrixWorld),y.normalMatrix.getNormalMatrix(y.modelViewMatrix),U.onBeforeRender(g,I,z,G,y,se),U.transparent===!0&&U.side===ln&&U.forceSinglePass===!1?(U.side=Rt,U.needsUpdate=!0,g.renderBufferDirect(z,I,G,U,y,se),U.side=Xn,U.needsUpdate=!0,g.renderBufferDirect(z,I,G,U,y,se),U.side=ln):g.renderBufferDirect(z,I,G,U,y,se),y.onAfterRender(g,I,z,G,U,se)}function As(y,I,z){I.isScene!==!0&&(I=oe);const G=Se.get(y),U=h.state.lights,se=h.state.shadowsArray,pe=U.state.version,Ee=fe.getParameters(y,U.state,se,I,z),Te=fe.getProgramCacheKey(Ee);let Ue=G.programs;G.environment=y.isMeshStandardMaterial?I.environment:null,G.fog=I.fog,G.envMap=(y.isMeshStandardMaterial?O:x).get(y.envMap||G.environment),G.envMapRotation=G.environment!==null&&y.envMap===null?I.environmentRotation:y.envMapRotation,Ue===void 0&&(y.addEventListener("dispose",Be),Ue=new Map,G.programs=Ue);let ze=Ue.get(Te);if(ze!==void 0){if(G.currentProgram===ze&&G.lightsStateVersion===pe)return vo(y,Ee),ze}else Ee.uniforms=fe.getUniforms(y),y.onBeforeCompile(Ee,g),ze=fe.acquireProgram(Ee,Te),Ue.set(Te,ze),G.uniforms=Ee.uniforms;const Ae=G.uniforms;return(!y.isShaderMaterial&&!y.isRawShaderMaterial||y.clipping===!0)&&(Ae.clippingPlanes=ie.uniform),vo(y,Ee),G.needsLights=kc(y),G.lightsStateVersion=pe,G.needsLights&&(Ae.ambientLightColor.value=U.state.ambient,Ae.lightProbe.value=U.state.probe,Ae.directionalLights.value=U.state.directional,Ae.directionalLightShadows.value=U.state.directionalShadow,Ae.spotLights.value=U.state.spot,Ae.spotLightShadows.value=U.state.spotShadow,Ae.rectAreaLights.value=U.state.rectArea,Ae.ltc_1.value=U.state.rectAreaLTC1,Ae.ltc_2.value=U.state.rectAreaLTC2,Ae.pointLights.value=U.state.point,Ae.pointLightShadows.value=U.state.pointShadow,Ae.hemisphereLights.value=U.state.hemi,Ae.directionalShadowMap.value=U.state.directionalShadowMap,Ae.directionalShadowMatrix.value=U.state.directionalShadowMatrix,Ae.spotShadowMap.value=U.state.spotShadowMap,Ae.spotLightMatrix.value=U.state.spotLightMatrix,Ae.spotLightMap.value=U.state.spotLightMap,Ae.pointShadowMap.value=U.state.pointShadowMap,Ae.pointShadowMatrix.value=U.state.pointShadowMatrix),G.currentProgram=ze,G.uniformsList=null,ze}function _o(y){if(y.uniformsList===null){const I=y.currentProgram.getUniforms();y.uniformsList=ir.seqWithValue(I.seq,y.uniforms)}return y.uniformsList}function vo(y,I){const z=Se.get(y);z.outputColorSpace=I.outputColorSpace,z.batching=I.batching,z.batchingColor=I.batchingColor,z.instancing=I.instancing,z.instancingColor=I.instancingColor,z.instancingMorph=I.instancingMorph,z.skinning=I.skinning,z.morphTargets=I.morphTargets,z.morphNormals=I.morphNormals,z.morphColors=I.morphColors,z.morphTargetsCount=I.morphTargetsCount,z.numClippingPlanes=I.numClippingPlanes,z.numIntersection=I.numClipIntersection,z.vertexAlphas=I.vertexAlphas,z.vertexTangents=I.vertexTangents,z.toneMapping=I.toneMapping}function Bc(y,I,z,G,U){I.isScene!==!0&&(I=oe),T.resetTextureUnits();const se=I.fog,pe=G.isMeshStandardMaterial?I.environment:null,Ee=D===null?g.outputColorSpace:D.isXRRenderTarget===!0?D.texture.colorSpace:qi,Te=(G.isMeshStandardMaterial?O:x).get(G.envMap||pe),Ue=G.vertexColors===!0&&!!z.attributes.color&&z.attributes.color.itemSize===4,ze=!!z.attributes.tangent&&(!!G.normalMap||G.anisotropy>0),Ae=!!z.morphAttributes.position,Ye=!!z.morphAttributes.normal,et=!!z.morphAttributes.color;let nt=Hn;G.toneMapped&&(D===null||D.isXRRenderTarget===!0)&&(nt=g.toneMapping);const Tt=z.morphAttributes.position||z.morphAttributes.normal||z.morphAttributes.color,Ke=Tt!==void 0?Tt.length:0,we=Se.get(G),dn=h.state.lights;if(Z===!0&&(ce===!0||y!==M)){const Ot=y===M&&G.id===E;ie.setState(G,y,Ot)}let $e=!1;G.version===we.__version?(we.needsLights&&we.lightsStateVersion!==dn.state.version||we.outputColorSpace!==Ee||U.isBatchedMesh&&we.batching===!1||!U.isBatchedMesh&&we.batching===!0||U.isBatchedMesh&&we.batchingColor===!0&&U.colorTexture===null||U.isBatchedMesh&&we.batchingColor===!1&&U.colorTexture!==null||U.isInstancedMesh&&we.instancing===!1||!U.isInstancedMesh&&we.instancing===!0||U.isSkinnedMesh&&we.skinning===!1||!U.isSkinnedMesh&&we.skinning===!0||U.isInstancedMesh&&we.instancingColor===!0&&U.instanceColor===null||U.isInstancedMesh&&we.instancingColor===!1&&U.instanceColor!==null||U.isInstancedMesh&&we.instancingMorph===!0&&U.morphTexture===null||U.isInstancedMesh&&we.instancingMorph===!1&&U.morphTexture!==null||we.envMap!==Te||G.fog===!0&&we.fog!==se||we.numClippingPlanes!==void 0&&(we.numClippingPlanes!==ie.numPlanes||we.numIntersection!==ie.numIntersection)||we.vertexAlphas!==Ue||we.vertexTangents!==ze||we.morphTargets!==Ae||we.morphNormals!==Ye||we.morphColors!==et||we.toneMapping!==nt||we.morphTargetsCount!==Ke)&&($e=!0):($e=!0,we.__version=G.version);let Kt=we.currentProgram;$e===!0&&(Kt=As(G,I,U));let fi=!1,Dt=!1,ji=!1;const it=Kt.getUniforms(),an=we.uniforms;if(me.useProgram(Kt.program)&&(fi=!0,Dt=!0,ji=!0),G.id!==E&&(E=G.id,Dt=!0),fi||M!==y){me.buffers.depth.getReversed()?(ee.copy(y.projectionMatrix),Gu(ee),Hu(ee),it.setValue(R,"projectionMatrix",ee)):it.setValue(R,"projectionMatrix",y.projectionMatrix),it.setValue(R,"viewMatrix",y.matrixWorldInverse);const bn=it.map.cameraPosition;bn!==void 0&&bn.setValue(R,Ce.setFromMatrixPosition(y.matrixWorld)),Re.logarithmicDepthBuffer&&it.setValue(R,"logDepthBufFC",2/(Math.log(y.far+1)/Math.LN2)),(G.isMeshPhongMaterial||G.isMeshToonMaterial||G.isMeshLambertMaterial||G.isMeshBasicMaterial||G.isMeshStandardMaterial||G.isShaderMaterial)&&it.setValue(R,"isOrthographic",y.isOrthographicCamera===!0),M!==y&&(M=y,Dt=!0,ji=!0)}if(U.isSkinnedMesh){it.setOptional(R,U,"bindMatrix"),it.setOptional(R,U,"bindMatrixInverse");const Ot=U.skeleton;Ot&&(Ot.boneTexture===null&&Ot.computeBoneTexture(),it.setValue(R,"boneTexture",Ot.boneTexture,T))}U.isBatchedMesh&&(it.setOptional(R,U,"batchingTexture"),it.setValue(R,"batchingTexture",U._matricesTexture,T),it.setOptional(R,U,"batchingIdTexture"),it.setValue(R,"batchingIdTexture",U._indirectTexture,T),it.setOptional(R,U,"batchingColorTexture"),U._colorsTexture!==null&&it.setValue(R,"batchingColorTexture",U._colorsTexture,T));const Ji=z.morphAttributes;if((Ji.position!==void 0||Ji.normal!==void 0||Ji.color!==void 0)&&Pe.update(U,z,Kt),(Dt||we.receiveShadow!==U.receiveShadow)&&(we.receiveShadow=U.receiveShadow,it.setValue(R,"receiveShadow",U.receiveShadow)),G.isMeshGouraudMaterial&&G.envMap!==null&&(an.envMap.value=Te,an.flipEnvMap.value=Te.isCubeTexture&&Te.isRenderTargetTexture===!1?-1:1),G.isMeshStandardMaterial&&G.envMap===null&&I.environment!==null&&(an.envMapIntensity.value=I.environmentIntensity),Dt&&(it.setValue(R,"toneMappingExposure",g.toneMappingExposure),we.needsLights&&zc(an,ji),se&&G.fog===!0&&ae.refreshFogUniforms(an,se),ae.refreshMaterialUniforms(an,G,V,j,h.state.transmissionRenderTarget[y.id]),ir.upload(R,_o(we),an,T)),G.isShaderMaterial&&G.uniformsNeedUpdate===!0&&(ir.upload(R,_o(we),an,T),G.uniformsNeedUpdate=!1),G.isSpriteMaterial&&it.setValue(R,"center",U.center),it.setValue(R,"modelViewMatrix",U.modelViewMatrix),it.setValue(R,"normalMatrix",U.normalMatrix),it.setValue(R,"modelMatrix",U.matrixWorld),G.isShaderMaterial||G.isRawShaderMaterial){const Ot=G.uniformsGroups;for(let bn=0,wn=Ot.length;bn<wn;bn++){const xo=Ot[bn];L.update(xo,Kt),L.bind(xo,Kt)}}return Kt}function zc(y,I){y.ambientLightColor.needsUpdate=I,y.lightProbe.needsUpdate=I,y.directionalLights.needsUpdate=I,y.directionalLightShadows.needsUpdate=I,y.pointLights.needsUpdate=I,y.pointLightShadows.needsUpdate=I,y.spotLights.needsUpdate=I,y.spotLightShadows.needsUpdate=I,y.rectAreaLights.needsUpdate=I,y.hemisphereLights.needsUpdate=I}function kc(y){return y.isMeshLambertMaterial||y.isMeshToonMaterial||y.isMeshPhongMaterial||y.isMeshStandardMaterial||y.isShadowMaterial||y.isShaderMaterial&&y.lights===!0}this.getActiveCubeFace=function(){return b},this.getActiveMipmapLevel=function(){return w},this.getRenderTarget=function(){return D},this.setRenderTargetTextures=function(y,I,z){Se.get(y.texture).__webglTexture=I,Se.get(y.depthTexture).__webglTexture=z;const G=Se.get(y);G.__hasExternalTextures=!0,G.__autoAllocateDepthBuffer=z===void 0,G.__autoAllocateDepthBuffer||he.has("WEBGL_multisampled_render_to_texture")===!0&&(console.warn("THREE.WebGLRenderer: Render-to-texture extension was disabled because an external texture was provided"),G.__useRenderToTexture=!1)},this.setRenderTargetFramebuffer=function(y,I){const z=Se.get(y);z.__webglFramebuffer=I,z.__useDefaultFramebuffer=I===void 0},this.setRenderTarget=function(y,I=0,z=0){D=y,b=I,w=z;let G=!0,U=null,se=!1,pe=!1;if(y){const Te=Se.get(y);if(Te.__useDefaultFramebuffer!==void 0)me.bindFramebuffer(R.FRAMEBUFFER,null),G=!1;else if(Te.__webglFramebuffer===void 0)T.setupRenderTarget(y);else if(Te.__hasExternalTextures)T.rebindTextures(y,Se.get(y.texture).__webglTexture,Se.get(y.depthTexture).__webglTexture);else if(y.depthBuffer){const Ae=y.depthTexture;if(Te.__boundDepthTexture!==Ae){if(Ae!==null&&Se.has(Ae)&&(y.width!==Ae.image.width||y.height!==Ae.image.height))throw new Error("WebGLRenderTarget: Attached DepthTexture is initialized to the incorrect size.");T.setupDepthRenderbuffer(y)}}const Ue=y.texture;(Ue.isData3DTexture||Ue.isDataArrayTexture||Ue.isCompressedArrayTexture)&&(pe=!0);const ze=Se.get(y).__webglFramebuffer;y.isWebGLCubeRenderTarget?(Array.isArray(ze[I])?U=ze[I][z]:U=ze[I],se=!0):y.samples>0&&T.useMultisampledRTT(y)===!1?U=Se.get(y).__webglMultisampledFramebuffer:Array.isArray(ze)?U=ze[z]:U=ze,C.copy(y.viewport),H.copy(y.scissor),F=y.scissorTest}else C.copy(re).multiplyScalar(V).floor(),H.copy(be).multiplyScalar(V).floor(),F=Fe;if(me.bindFramebuffer(R.FRAMEBUFFER,U)&&G&&me.drawBuffers(y,U),me.viewport(C),me.scissor(H),me.setScissorTest(F),se){const Te=Se.get(y.texture);R.framebufferTexture2D(R.FRAMEBUFFER,R.COLOR_ATTACHMENT0,R.TEXTURE_CUBE_MAP_POSITIVE_X+I,Te.__webglTexture,z)}else if(pe){const Te=Se.get(y.texture),Ue=I||0;R.framebufferTextureLayer(R.FRAMEBUFFER,R.COLOR_ATTACHMENT0,Te.__webglTexture,z||0,Ue)}E=-1},this.readRenderTargetPixels=function(y,I,z,G,U,se,pe){if(!(y&&y.isWebGLRenderTarget)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");return}let Ee=Se.get(y).__webglFramebuffer;if(y.isWebGLCubeRenderTarget&&pe!==void 0&&(Ee=Ee[pe]),Ee){me.bindFramebuffer(R.FRAMEBUFFER,Ee);try{const Te=y.texture,Ue=Te.format,ze=Te.type;if(!Re.textureFormatReadable(Ue)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not in RGBA or implementation defined format.");return}if(!Re.textureTypeReadable(ze)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not in UnsignedByteType or implementation defined type.");return}I>=0&&I<=y.width-G&&z>=0&&z<=y.height-U&&R.readPixels(I,z,G,U,ke.convert(Ue),ke.convert(ze),se)}finally{const Te=D!==null?Se.get(D).__webglFramebuffer:null;me.bindFramebuffer(R.FRAMEBUFFER,Te)}}},this.readRenderTargetPixelsAsync=async function(y,I,z,G,U,se,pe){if(!(y&&y.isWebGLRenderTarget))throw new Error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");let Ee=Se.get(y).__webglFramebuffer;if(y.isWebGLCubeRenderTarget&&pe!==void 0&&(Ee=Ee[pe]),Ee){const Te=y.texture,Ue=Te.format,ze=Te.type;if(!Re.textureFormatReadable(Ue))throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in RGBA or implementation defined format.");if(!Re.textureTypeReadable(ze))throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in UnsignedByteType or implementation defined type.");if(I>=0&&I<=y.width-G&&z>=0&&z<=y.height-U){me.bindFramebuffer(R.FRAMEBUFFER,Ee);const Ae=R.createBuffer();R.bindBuffer(R.PIXEL_PACK_BUFFER,Ae),R.bufferData(R.PIXEL_PACK_BUFFER,se.byteLength,R.STREAM_READ),R.readPixels(I,z,G,U,ke.convert(Ue),ke.convert(ze),0);const Ye=D!==null?Se.get(D).__webglFramebuffer:null;me.bindFramebuffer(R.FRAMEBUFFER,Ye);const et=R.fenceSync(R.SYNC_GPU_COMMANDS_COMPLETE,0);return R.flush(),await ku(R,et,4),R.bindBuffer(R.PIXEL_PACK_BUFFER,Ae),R.getBufferSubData(R.PIXEL_PACK_BUFFER,0,se),R.deleteBuffer(Ae),R.deleteSync(et),se}else throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: requested read bounds are out of range.")}},this.copyFramebufferToTexture=function(y,I=null,z=0){y.isTexture!==!0&&(as("WebGLRenderer: copyFramebufferToTexture function signature has changed."),I=arguments[0]||null,y=arguments[1]);const G=Math.pow(2,-z),U=Math.floor(y.image.width*G),se=Math.floor(y.image.height*G),pe=I!==null?I.x:0,Ee=I!==null?I.y:0;T.setTexture2D(y,0),R.copyTexSubImage2D(R.TEXTURE_2D,z,0,0,pe,Ee,U,se),me.unbindTexture()},this.copyTextureToTexture=function(y,I,z=null,G=null,U=0){y.isTexture!==!0&&(as("WebGLRenderer: copyTextureToTexture function signature has changed."),G=arguments[0]||null,y=arguments[1],I=arguments[2],U=arguments[3]||0,z=null);let se,pe,Ee,Te,Ue,ze,Ae,Ye,et;const nt=y.isCompressedTexture?y.mipmaps[U]:y.image;z!==null?(se=z.max.x-z.min.x,pe=z.max.y-z.min.y,Ee=z.isBox3?z.max.z-z.min.z:1,Te=z.min.x,Ue=z.min.y,ze=z.isBox3?z.min.z:0):(se=nt.width,pe=nt.height,Ee=nt.depth||1,Te=0,Ue=0,ze=0),G!==null?(Ae=G.x,Ye=G.y,et=G.z):(Ae=0,Ye=0,et=0);const Tt=ke.convert(I.format),Ke=ke.convert(I.type);let we;I.isData3DTexture?(T.setTexture3D(I,0),we=R.TEXTURE_3D):I.isDataArrayTexture||I.isCompressedArrayTexture?(T.setTexture2DArray(I,0),we=R.TEXTURE_2D_ARRAY):(T.setTexture2D(I,0),we=R.TEXTURE_2D),R.pixelStorei(R.UNPACK_FLIP_Y_WEBGL,I.flipY),R.pixelStorei(R.UNPACK_PREMULTIPLY_ALPHA_WEBGL,I.premultiplyAlpha),R.pixelStorei(R.UNPACK_ALIGNMENT,I.unpackAlignment);const dn=R.getParameter(R.UNPACK_ROW_LENGTH),$e=R.getParameter(R.UNPACK_IMAGE_HEIGHT),Kt=R.getParameter(R.UNPACK_SKIP_PIXELS),fi=R.getParameter(R.UNPACK_SKIP_ROWS),Dt=R.getParameter(R.UNPACK_SKIP_IMAGES);R.pixelStorei(R.UNPACK_ROW_LENGTH,nt.width),R.pixelStorei(R.UNPACK_IMAGE_HEIGHT,nt.height),R.pixelStorei(R.UNPACK_SKIP_PIXELS,Te),R.pixelStorei(R.UNPACK_SKIP_ROWS,Ue),R.pixelStorei(R.UNPACK_SKIP_IMAGES,ze);const ji=y.isDataArrayTexture||y.isData3DTexture,it=I.isDataArrayTexture||I.isData3DTexture;if(y.isRenderTargetTexture||y.isDepthTexture){const an=Se.get(y),Ji=Se.get(I),Ot=Se.get(an.__renderTarget),bn=Se.get(Ji.__renderTarget);me.bindFramebuffer(R.READ_FRAMEBUFFER,Ot.__webglFramebuffer),me.bindFramebuffer(R.DRAW_FRAMEBUFFER,bn.__webglFramebuffer);for(let wn=0;wn<Ee;wn++)ji&&R.framebufferTextureLayer(R.READ_FRAMEBUFFER,R.COLOR_ATTACHMENT0,Se.get(y).__webglTexture,U,ze+wn),y.isDepthTexture?(it&&R.framebufferTextureLayer(R.DRAW_FRAMEBUFFER,R.COLOR_ATTACHMENT0,Se.get(I).__webglTexture,U,et+wn),R.blitFramebuffer(Te,Ue,se,pe,Ae,Ye,se,pe,R.DEPTH_BUFFER_BIT,R.NEAREST)):it?R.copyTexSubImage3D(we,U,Ae,Ye,et+wn,Te,Ue,se,pe):R.copyTexSubImage2D(we,U,Ae,Ye,et+wn,Te,Ue,se,pe);me.bindFramebuffer(R.READ_FRAMEBUFFER,null),me.bindFramebuffer(R.DRAW_FRAMEBUFFER,null)}else it?y.isDataTexture||y.isData3DTexture?R.texSubImage3D(we,U,Ae,Ye,et,se,pe,Ee,Tt,Ke,nt.data):I.isCompressedArrayTexture?R.compressedTexSubImage3D(we,U,Ae,Ye,et,se,pe,Ee,Tt,nt.data):R.texSubImage3D(we,U,Ae,Ye,et,se,pe,Ee,Tt,Ke,nt):y.isDataTexture?R.texSubImage2D(R.TEXTURE_2D,U,Ae,Ye,se,pe,Tt,Ke,nt.data):y.isCompressedTexture?R.compressedTexSubImage2D(R.TEXTURE_2D,U,Ae,Ye,nt.width,nt.height,Tt,nt.data):R.texSubImage2D(R.TEXTURE_2D,U,Ae,Ye,se,pe,Tt,Ke,nt);R.pixelStorei(R.UNPACK_ROW_LENGTH,dn),R.pixelStorei(R.UNPACK_IMAGE_HEIGHT,$e),R.pixelStorei(R.UNPACK_SKIP_PIXELS,Kt),R.pixelStorei(R.UNPACK_SKIP_ROWS,fi),R.pixelStorei(R.UNPACK_SKIP_IMAGES,Dt),U===0&&I.generateMipmaps&&R.generateMipmap(we),me.unbindTexture()},this.copyTextureToTexture3D=function(y,I,z=null,G=null,U=0){return y.isTexture!==!0&&(as("WebGLRenderer: copyTextureToTexture3D function signature has changed."),z=arguments[0]||null,G=arguments[1]||null,y=arguments[2],I=arguments[3],U=arguments[4]||0),as('WebGLRenderer: copyTextureToTexture3D function has been deprecated. Use "copyTextureToTexture" instead.'),this.copyTextureToTexture(y,I,z,G,U)},this.initRenderTarget=function(y){Se.get(y).__webglFramebuffer===void 0&&T.setupRenderTarget(y)},this.initTexture=function(y){y.isCubeTexture?T.setTextureCube(y,0):y.isData3DTexture?T.setTexture3D(y,0):y.isDataArrayTexture||y.isCompressedArrayTexture?T.setTexture2DArray(y,0):T.setTexture2D(y,0),me.unbindTexture()},this.resetState=function(){b=0,w=0,D=null,me.reset(),Qe.reset()},typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}get coordinateSystem(){return Mn}get outputColorSpace(){return this._outputColorSpace}set outputColorSpace(e){this._outputColorSpace=e;const t=this.getContext();t.drawingBufferColorspace=qe._getDrawingBufferColorSpace(e),t.unpackColorSpace=qe._getUnpackColorSpace()}}class Ks extends Ct{constructor(){super(),this.isScene=!0,this.type="Scene",this.background=null,this.environment=null,this.fog=null,this.backgroundBlurriness=0,this.backgroundIntensity=1,this.backgroundRotation=new An,this.environmentIntensity=1,this.environmentRotation=new An,this.overrideMaterial=null,typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}copy(e,t){return super.copy(e,t),e.background!==null&&(this.background=e.background.clone()),e.environment!==null&&(this.environment=e.environment.clone()),e.fog!==null&&(this.fog=e.fog.clone()),this.backgroundBlurriness=e.backgroundBlurriness,this.backgroundIntensity=e.backgroundIntensity,this.backgroundRotation.copy(e.backgroundRotation),this.environmentIntensity=e.environmentIntensity,this.environmentRotation.copy(e.environmentRotation),e.overrideMaterial!==null&&(this.overrideMaterial=e.overrideMaterial.clone()),this.matrixAutoUpdate=e.matrixAutoUpdate,this}toJSON(e){const t=super.toJSON(e);return this.fog!==null&&(t.object.fog=this.fog.toJSON()),this.backgroundBlurriness>0&&(t.object.backgroundBlurriness=this.backgroundBlurriness),this.backgroundIntensity!==1&&(t.object.backgroundIntensity=this.backgroundIntensity),t.object.backgroundRotation=this.backgroundRotation.toArray(),this.environmentIntensity!==1&&(t.object.environmentIntensity=this.environmentIntensity),t.object.environmentRotation=this.environmentRotation.toArray(),t}}class Qm extends St{constructor(e=null,t=1,i=1,s,r,a,o,l,c=ft,u=ft,f,d){super(null,a,o,l,c,u,s,r,f,d),this.isDataTexture=!0,this.image={data:e,width:t,height:i},this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}}class e0 extends ys{static get type(){return"PointsMaterial"}constructor(e){super(),this.isPointsMaterial=!0,this.color=new je(16777215),this.map=null,this.alphaMap=null,this.size=1,this.sizeAttenuation=!0,this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.alphaMap=e.alphaMap,this.size=e.size,this.sizeAttenuation=e.sizeAttenuation,this.fog=e.fog,this}}const vl=new rt,Ya=new Ql,$s=new _r,Zs=new N;class t0 extends Ct{constructor(e=new rn,t=new e0){super(),this.isPoints=!0,this.type="Points",this.geometry=e,this.material=t,this.updateMorphTargets()}copy(e,t){return super.copy(e,t),this.material=Array.isArray(e.material)?e.material.slice():e.material,this.geometry=e.geometry,this}raycast(e,t){const i=this.geometry,s=this.matrixWorld,r=e.params.Points.threshold,a=i.drawRange;if(i.boundingSphere===null&&i.computeBoundingSphere(),$s.copy(i.boundingSphere),$s.applyMatrix4(s),$s.radius+=r,e.ray.intersectsSphere($s)===!1)return;vl.copy(s).invert(),Ya.copy(e.ray).applyMatrix4(vl);const o=r/((this.scale.x+this.scale.y+this.scale.z)/3),l=o*o,c=i.index,f=i.attributes.position;if(c!==null){const d=Math.max(0,a.start),m=Math.min(c.count,a.start+a.count);for(let _=d,v=m;_<v;_++){const p=c.getX(_);Zs.fromBufferAttribute(f,p),xl(Zs,p,l,s,e,t,this)}}else{const d=Math.max(0,a.start),m=Math.min(f.count,a.start+a.count);for(let _=d,v=m;_<v;_++)Zs.fromBufferAttribute(f,_),xl(Zs,_,l,s,e,t,this)}}updateMorphTargets(){const t=this.geometry.morphAttributes,i=Object.keys(t);if(i.length>0){const s=t[i[0]];if(s!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let r=0,a=s.length;r<a;r++){const o=s[r].name||String(r);this.morphTargetInfluences.push(0),this.morphTargetDictionary[o]=r}}}}}function xl(n,e,t,i,s,r,a){const o=Ya.distanceSqToPoint(n);if(o<t){const l=new N;Ya.closestPointToPoint(n,l),l.applyMatrix4(i);const c=s.ray.origin.distanceTo(l);if(c<s.near||c>s.far)return;r.push({distance:c,distanceToRay:Math.sqrt(o),point:l,index:e,face:null,faceIndex:null,barycoord:null,object:a})}}class n0 extends St{constructor(e,t,i,s,r,a,o,l,c){super(e,t,i,s,r,a,o,l,c),this.isCanvasTexture=!0,this.needsUpdate=!0}}typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("register",{detail:{revision:Ja}}));typeof window<"u"&&(window.__THREE__?console.warn("WARNING: Multiple instances of Three.js being imported."):window.__THREE__=Ja);const Wt=48,si=.965,Ci=.305,ls=.925,cs=0,sr=1,Ka=2,Ui=3,cr=4,en=0,i0=1,s0=2,r0=3,a0=4;function ao(n){const e=n.length,t=n.map(a=>a[0]),i=n.map(a=>a[1]),s=[];for(let a=0;a<e-1;a++)s.push((i[a+1]-i[a])/(t[a+1]-t[a]));const r=[s[0]];for(let a=1;a<e-1;a++)r.push(s[a-1]*s[a]<=0?0:(s[a-1]+s[a])/2);r.push(s[e-2]);for(let a=0;a<e-1;a++){if(s[a]===0){r[a]=0,r[a+1]=0;continue}const o=r[a]/s[a],l=r[a+1]/s[a],c=o*o+l*l;if(c>9){const u=3/Math.sqrt(c);r[a]=u*o*s[a],r[a+1]=u*l*s[a]}}return a=>{if(a<=t[0])return i[0];if(a>=t[e-1])return i[e-1];let o=0;for(;o<e-2&&a>t[o+1];)o++;const l=t[o+1]-t[o],c=(a-t[o])/l,u=c*c,f=u*c;return(2*f-3*u+1)*i[o]+(f-2*u+c)*l*r[o]+(-2*f+3*u)*i[o+1]+(f-u)*l*r[o+1]}}const o0=[[0,0,0,0,-.012],[.01,.024,.013,.025,-.012],[.035,.046,.025,.049,-.012],[.08,.066,.038,.071,-.011],[.15,.087,.055,.097,-.01],[.23,.107,.074,.118,-.008],[.31,.123,.094,.13,-.005],[.39,.129,.109,.126,-.001],[.47,.125,.114,.109,.004],[.55,.111,.112,.089,.009],[.62,.091,.104,.073,.012],[.69,.065,.086,.058,.013],[.77,.042,.064,.046,.011],[.84,.025,.044,.033,.008],[.9,.015,.028,.022,.005],[.94,.009,.015,.013,.002],[si,0,0,0,.001]],xr=n=>ao(o0.map(e=>[e[0],e[n]])),gc=xr(1),$a=xr(2),oo=xr(3),yn=xr(4),l0=ao([[0,2.7],[.2,2.6],[.45,2.1],[.65,2],[.8,1.65],[.95,1.45]]),c0=ao([[0,2.3],[.3,2.2],[.5,2],[.75,1.8],[.95,1.55]]),rr=.285,_c=n=>{const e=Math.min(1,n/rr);return yn(n)-oo(n)*(.08+.34*e**1.5)},vc=.292,u0=()=>_c(vc)+.017,Ni=(n,e,t)=>{const i=Math.max(0,Math.min(1,(t-n)/(e-n)));return i*i*(3-2*i)},Ml=(n,e)=>Math.sign(n)*Math.abs(n)**e,Za=n=>.016*Math.exp(-(((n-.61)/.065)**2)),h0=(()=>{const n=[];for(let e=.03;e<.235;e+=.026)n.push([e,0]);for(let e=.045;e<.215;e+=.03)n.push([e,.45],[e,-.45]);for(let e=.02;e<.12;e+=.028)n.push([e,.82],[e,-.82]);return n})();function f0(n,e){let t=0;for(const[i,s]of h0){const r=Math.hypot((n-i)/.0085,(e-s)/.16);r<1&&(t=Math.max(t,(1-r*r)**2))}return t}const wi=()=>({pos:[],info:[],spine:[],idx:[]}),En=n=>Math.max(0,Math.min(1,n))*(Wt-1);function Mr(n,e,t,i){for(let s=0;s<t-1;s++)for(let r=0;r<i;r++){const a=(r+1)%i,o=e+s*i+r,l=e+s*i+a,c=e+(s+1)*i+r,u=e+(s+1)*i+a;n.idx.push(o,c,l,l,c,u)}}function Hi(n,e,t,i,s){for(let r=0;r<t;r++){const a=e+r,o=e+(r+1)%t;s?n.idx.push(a,o,i):n.idx.push(o,a,i)}}function d0(n){for(let r=0;r<116;r++){const a=(r+1)/117,o=si*(.3*a+.7*(.5-.5*Math.cos(Math.PI*a))),l=gc(o),c=$a(o)+Za(o),u=oo(o),f=yn(o),d=l0(o),m=c0(o),_=_c(o);for(let v=0;v<56;v++){const p=2*Math.PI*v/56,h=Math.cos(p),A=Math.sin(p),S=A>=0?d:m;let g=l*Ml(h,2/S),P=f+(A>=0?c:u)*Ml(A,2/S),b=en;if(o<rr+.01&&Math.abs(h)>.25){const E=Math.exp(-(((P-_)/.0058)**2))*Ni(.004,.03,o)*(1-Ni(rr-.02,rr+.01,o)),M=Math.abs(h);g-=Math.sign(g)*.0075*E*M,P-=.0024*E,E>.38&&(b=i0)}if(o<.25){const E=l>1e-4?g/l:0,M=A>-.1?f0(o,E):0;if(M>0){const C=Math.hypot(g,P-f)||1;g+=g/C*.0042*M,P+=(P-f)/C*.0042*M,M>.3&&b===en&&(b=a0)}}Math.abs(h)>.35&&Math.hypot((o-vc)*.9,P-u0())<.0062&&(b=s0),P<f-u*.42&&o>.025&&o<.5&&(b=r0);const w=A*(A>=0?c:u)/Math.max(1e-4,Math.hypot(h*l,A*(A>=0?c:u))),D=.12+.88*Ni(-.62,.05,w);n.pos.push(g,P,o-.5),n.info.push(cs,b,D,o/si),n.spine.push(En(o))}}Mr(n,0,116,56);const i=n.pos.length/3;n.pos.push(0,yn(0),-.5),n.info.push(cs,en,.75,0),n.spine.push(0);const s=n.pos.length/3;n.pos.push(0,yn(si),si-.5),n.info.push(cs,en,.9,1),n.spine.push(En(si)),Hi(n,0,56,i,!0),Hi(n,6440,56,s,!1)}const lo=n=>1.32*Math.sqrt(Math.max(0,n))*(1-n)**.85/.6;function p0(){const i=[];for(let s=0;s<30;s++){const a=-.05+1.05*(1-(1-s/29)**1.35),o=Math.max(0,a);let l=.066*(1-.5*o**1.2);o>.8&&(l*=Math.sqrt(Math.max(0,1-((o-.8)/.2)**2))),l=Math.max(l,.0015);const c=.0042*Math.max(0,Math.sin(o*Math.PI*11))**2*Ni(.18,.32,o)*(1-Ni(.82,.95,o)),u=-.42*l+.05*o**1.6-c,f=.19*l+.0015,d=-.022*o**2;for(let m=0;m<14;m++){const _=2*Math.PI*m/14,v=.5-.5*Math.cos(_),p=Math.sin(_)>=0?1:-1,h=.06*f*Math.sin(Math.PI*v);i.push(a*.33,d+h+p*.5*f*lo(v),u+(l+c)*v)}}return{pos:i,rings:30,around:14}}function Sl(n,e,t,i){const s=n.pos.length/3,{pos:r,rings:a,around:o}=i;for(let u=0;u<r.length;u+=3){const f=r[u]/.33;n.pos.push(t?-r[u]:r[u],r[u+1],r[u+2]);const d=r[u+1]<0?0:1;n.info.push(e,en,.3+.22*d,.42+.3*Math.max(0,f)),n.spine.push(En(Ci))}const l=wi();Mr(l,0,a,o);const c=n.pos.length/3;n.pos.push(t?-.33:.33,-.022,.05+.002),n.info.push(e,en,.4,.72),n.spine.push(En(Ci)),Hi(l,(a-1)*o,o,c-s,!1);for(let u=0;u<l.idx.length;u+=3){const f=l.idx[u]+s,d=l.idx[u+1]+s,m=l.idx[u+2]+s;t?n.idx.push(f,m,d):n.idx.push(f,d,m)}}function m0(n){for(let a=0;a<49;a++){const o=a/48*2-1,l=Math.sign(o)*Math.abs(o)**.85,c=Math.abs(l),u=-.012+.098*c**1.35;let f=.074*Math.max(0,1-c**2.5)**.55+.0012;f-=.024*Math.max(0,1-c/.085)**1.3,f+=.0022*Math.sin(c*46)*Ni(.25,.4,c)*(1-c);const d=.017*(1-c)**1.25+.0014;for(let m=0;m<12;m++){const _=2*Math.PI*m/12,v=.5-.5*Math.cos(_),p=Math.sin(_)>=0?1:-1;n.pos.push(l*.168,p*.5*d*lo(v),u+f*v),n.info.push(Ui,en,p>0?.92:.46,.97+.03*c),n.spine.push(En(ls))}}Mr(n,0,49,12);const s=n.pos.length/3;n.pos.push(-.168-.001,0,.087),n.info.push(Ui,en,.8,1),n.spine.push(En(ls));const r=n.pos.length/3;n.pos.push(.168+.001,0,.087),n.info.push(Ui,en,.8,1),n.spine.push(En(ls)),Hi(n,0,12,s,!1),Hi(n,576,12,r,!0)}function g0(n){for(let r=0;r<10;r++){const a=r/9,o=.072*(1-a)**.75+.006,l=.615-.5+.048*a**1.2,c=.011*(1-a)+.0018;for(let u=0;u<10;u++){const f=2*Math.PI*u/10,d=.5-.5*Math.cos(f),m=Math.sin(f)>=0?1:-1,_=l+o*d,v=_+.5,h=yn(v)+$a(v)+Za(v)-.008+a*.043*(1-.35*d)+a*a*.005;n.pos.push(m*.5*c*lo(d),h,_),n.info.push(cr,en,.95,Math.min(1,v/si)),n.spine.push(En(v))}}Mr(n,0,10,10);const i=n.pos.length/3,s=.615+.048+.003;n.pos.push(0,yn(s)+$a(s)+Za(s)-.008+.0485,s-.5),n.info.push(cr,en,.95,s),n.spine.push(En(s)),Hi(n,90,10,i,!1)}function xc(n,e,t){const i=new Float32Array(t*3);for(let s=0;s<e.length;s+=3){const r=e[s]*3,a=e[s+1]*3,o=e[s+2]*3,l=n[a]-n[r],c=n[a+1]-n[r+1],u=n[a+2]-n[r+2],f=n[o]-n[r],d=n[o+1]-n[r+1],m=n[o+2]-n[r+2],_=c*m-u*d,v=u*f-l*m,p=l*d-c*f;for(const h of[r,a,o])i[h]+=_,i[h+1]+=v,i[h+2]+=p}for(let s=0;s<i.length;s+=3){const r=Math.hypot(i[s],i[s+1],i[s+2])||1;i[s]/=r,i[s+1]/=r,i[s+2]/=r}return i}function ss(n,e){const t=n.pos.length/3,i=xc(n.pos,n.idx,t);let s=0;for(let r=0;r<t;r++){const[a,o,l]=e(n.pos[r*3],n.pos[r*3+1],n.pos[r*3+2]);s+=i[r*3]*(n.pos[r*3]-a)+i[r*3+1]*(n.pos[r*3+1]-o)+i[r*3+2]*(n.pos[r*3+2]-l)}if(s<0)for(let r=0;r<n.idx.length;r+=3){const a=n.idx[r+1];n.idx[r+1]=n.idx[r+2],n.idx[r+2]=a}}const rs=[gc(Ci)*.74,yn(Ci)-oo(Ci)*.5,Ci-.5],yl=[0,yn(ls),ls-.5];let js=null;function Sr(){if(js)return js;const n=wi();d0(n),ss(n,(S,g,P)=>[0,yn(P+.5),P]);const e=wi();g0(e),ss(e,(S,g,P)=>[0,g,P]);const t=p0(),i=wi();Sl(i,Ka,!1,t),ss(i,(S,g,P)=>[S,-.022*(S/.33)**2,P]);const s=wi();Sl(s,sr,!0,t),ss(s,(S,g,P)=>[S,-.022*(S/.33)**2,P]);const r=wi();m0(r),ss(r,(S,g,P)=>[S,0,P]);const a=[n,e,s,i,r],o=a.reduce((S,g)=>S+g.pos.length/3,0),l=a.reduce((S,g)=>S+g.idx.length/3,0),c=new Float32Array(o*3),u=new Float32Array(o*3),f=new Float32Array(o),d=new Float32Array(o*4),m=new Float32Array(o*3),_=new Uint32Array(l*3),v=[],p=[-rs[0],rs[1],rs[2]];let h=0,A=0;for(const S of a){const g=S.pos.length/3,P=xc(S.pos,S.idx,g);for(let b=0;b<g;b++){const w=(h+b)*3,D=S.info[b*4],E=S.pos[b*3],M=S.pos[b*3+1],C=S.pos[b*3+2];if(u.set([P[b*3],P[b*3+1],P[b*3+2]],w),f[h+b]=S.spine[b],d.set(S.info.slice(b*4,b*4+4),(h+b)*4),D===cs||D===cr){const H=S.spine[b]/(Wt-1)-.5;c.set([E,M,C-H],w),m.set([E,M,C],w)}else{c.set([E,M,C],w);const H=D===Ui?yl:D===Ka?rs:p;m.set([H[0]+E,H[1]+M,H[2]+C],w)}}v.push({part:S.info[0],start:A/3,count:S.idx.length/3});for(let b=0;b<S.idx.length;b++)_[A+b]=S.idx[b]+h;h+=g,A+=S.idx.length}return js={offset:c,normal:u,spine:f,info:d,rest:m,index:_,vertexCount:o,pivots:{flipperL:p,flipperR:rs,fluke:yl},parts:v},js}function Mc(n){let e=n>>>0;return()=>{e=e+1831565813>>>0;let t=e;return t=Math.imul(t^t>>>15,t|1),t^=t+Math.imul(t^t>>>7,t|61),((t^t>>>14)>>>0)/4294967296}}function El(n,e,t){const i=Sr(),s=Mc(e),r=[],a=[];let o=0;for(let c=0;c<i.index.length;c+=3){const u=i.index[c];if(t&&!t(i.info,u))continue;const f=i.index[c+1],d=i.index[c+2],m=i.rest,_=[m[f*3]-m[u*3],m[f*3+1]-m[u*3+1],m[f*3+2]-m[u*3+2]],v=[m[d*3]-m[u*3],m[d*3+1]-m[u*3+1],m[d*3+2]-m[u*3+2]],p=.5*Math.hypot(_[1]*v[2]-_[2]*v[1],_[2]*v[0]-_[0]*v[2],_[0]*v[1]-_[1]*v[0]);o+=p,r.push(c),a.push(o)}const l={count:n,offset:new Float32Array(n*3),normal:new Float32Array(n*3),spine:new Float32Array(n),info:new Float32Array(n*4)};for(let c=0;c<n;c++){const u=s()*o;let f=0,d=a.length-1;for(;f<d;){const S=f+d>>1;a[S]<u?f=S+1:d=S}const m=r[f];let _=s(),v=s();_+v>1&&(_=1-_,v=1-v);const p=1-_-v,h=[i.index[m],i.index[m+1],i.index[m+2]],A=[p,_,v];for(let S=0;S<3;S++)l.offset[c*3+S]=A[0]*i.offset[h[0]*3+S]+A[1]*i.offset[h[1]*3+S]+A[2]*i.offset[h[2]*3+S],l.normal[c*3+S]=A[0]*i.normal[h[0]*3+S]+A[1]*i.normal[h[1]*3+S]+A[2]*i.normal[h[2]*3+S];l.spine[c]=A[0]*i.spine[h[0]]+A[1]*i.spine[h[1]]+A[2]*i.spine[h[2]];for(let S=0;S<4;S++)l.info[c*4+S]=i.info[h[0]*4+S];l.info[c*4+3]=A[0]*i.info[h[0]*4+3]+A[1]*i.info[h[1]*4+3]+A[2]*i.info[h[2]*4+3]}return l}const tn=(n,e)=>[n[0]+e[0],n[1]+e[1],n[2]+e[2]],Nt=(n,e)=>[n[0]-e[0],n[1]-e[1],n[2]-e[2]],ot=(n,e)=>[n[0]*e,n[1]*e,n[2]*e],Pt=(n,e)=>n[0]*e[0]+n[1]*e[1]+n[2]*e[2],kn=(n,e)=>[n[1]*e[2]-n[2]*e[1],n[2]*e[0]-n[0]*e[2],n[0]*e[1]-n[1]*e[0]],Xt=n=>Math.hypot(n[0],n[1],n[2]),qt=n=>{const e=Xt(n)||1;return[n[0]/e,n[1]/e,n[2]/e]},Sc=(n,e,t)=>[n[0]+(e[0]-n[0])*t,n[1]+(e[1]-n[1])*t,n[2]+(e[2]-n[2])*t],Vn=(n,e)=>{const t=qt(n),i=Math.sin(e/2);return[t[0]*i,t[1]*i,t[2]*i,Math.cos(e/2)]},Vi=(n,e)=>[n[3]*e[0]+n[0]*e[3]+n[1]*e[2]-n[2]*e[1],n[3]*e[1]-n[0]*e[2]+n[1]*e[3]+n[2]*e[0],n[3]*e[2]+n[0]*e[1]-n[1]*e[0]+n[2]*e[3],n[3]*e[3]-n[0]*e[0]-n[1]*e[1]-n[2]*e[2]],oi=n=>{const e=Math.hypot(n[0],n[1],n[2],n[3])||1;return[n[0]/e,n[1]/e,n[2]/e,n[3]/e]},_0=n=>[-n[0],-n[1],-n[2],n[3]],Ft=(n,e)=>{const[t,i,s,r]=n,a=2*(i*e[2]-s*e[1]),o=2*(s*e[0]-t*e[2]),l=2*(t*e[1]-i*e[0]);return[e[0]+r*a+(i*l-s*o),e[1]+r*o+(s*a-t*l),e[2]+r*l+(t*o-i*a)]},v0=(n,e,t)=>{let i=n[0]*e[0]+n[1]*e[1]+n[2]*e[2]+n[3]*e[3],s=e;if(i<0&&(i=-i,s=[-e[0],-e[1],-e[2],-e[3]]),i>.9995)return oi([n[0]+(s[0]-n[0])*t,n[1]+(s[1]-n[1])*t,n[2]+(s[2]-n[2])*t,n[3]+(s[3]-n[3])*t]);const r=Math.acos(i),a=Math.sin(r),o=Math.sin((1-t)*r)/a,l=Math.sin(t*r)/a;return[n[0]*o+s[0]*l,n[1]*o+s[1]*l,n[2]*o+s[2]*l,n[3]*o+s[3]*l]},x0=(n,e,t)=>{const i=n[0],s=n[1],r=n[2],a=e[0],o=e[1],l=e[2],c=t[0],u=t[1],f=t[2],d=i+o+f;if(d>0){const _=Math.sqrt(d+1)*2;return oi([(l-u)/_,(c-r)/_,(s-a)/_,.25*_])}if(i>o&&i>f){const _=Math.sqrt(1+i-o-f)*2;return oi([.25*_,(a+s)/_,(c+r)/_,(l-u)/_])}if(o>f){const _=Math.sqrt(1+o-i-f)*2;return oi([(a+s)/_,.25*_,(u+l)/_,(c-r)/_])}const m=Math.sqrt(1+f-i-o)*2;return oi([(c+r)/m,(u+l)/m,.25*m,(s-a)/m])},qn=[1,0,0],nn=[0,1,0],ps=[0,0,1];function ur(n,e,t=0){const i=qt(n);let s=Nt(e,ot(i,Pt(e,i)));Xt(s)<1e-5&&(s=Nt(ps,ot(i,Pt(ps,i))),Xt(s)<1e-5&&(s=Nt(qn,ot(i,Pt(qn,i))))),s=qt(s);const r=kn(i,s),a=x0(r,s,ot(i,-1));return t===0?a:Vi(Vn(i,t),a)}function yc(n){const e=Math.max(0,Math.min(1.6,n.effort)),t=n.stride??.95,i=n.distance/t*Math.PI*2+(n.phase??0),s=.16+.84*e,r=n.turn??0,a=n.climb??0,o=n.bank??0,l=Math.sin(i+.9),c=Math.cos(i+.9),u=Math.max(-.5,Math.min(.5,r*.35+o*.25)),f=1-Math.min(1,e),d={sweep:.05-.12*f,dihedral:.1*f-.04*a,twist:-.06*a},m=.13*s*l,_=.06*s*c,v=.09*s*c;return{stroke:i,amplitude:s,bendYaw:r,bendPitch:a,flipperL:{sweep:d.sweep-u*.4+_,dihedral:d.dihedral+u+m,twist:d.twist+v},flipperR:{sweep:d.sweep+u*.4+_,dihedral:d.dihedral-u+m,twist:d.twist+v},fluke:.5*s*Math.cos(i-2*Math.PI*.9-.98),flukeFlex:.09*s*Math.sin(i-2*Math.PI*.95-.98)}}const Qr=.38,Tl=2*Math.PI/1.25,M0=n=>.8*(.012-.06*n+.09*n*n+.075*n*n*n),S0=n=>.8*(-.06+.18*n+.225*n*n);function y0(n,e){const t=n.stroke-Tl*e;return n.amplitude*Math.atan(S0(e)*Math.sin(t)-Tl*M0(e)*Math.cos(t))}function Ec(n,e,t,i=0){const s=Wt,r=1/(s-1),a=Math.round(Qr*(s-1)),o=[];for(let c=0;c<s;c++){const u=c*r,f=n.bendYaw*(u-Qr),d=-n.bendPitch*(u-Qr)+y0(n,u),m=Vi(Vn(nn,f),Vn(qn,d));t.set(m,i+c*4),o.push(Ft(m,ps))}const l=new Array(s);l[a]=[0,0,a*r-.5];for(let c=a+1;c<s;c++)l[c]=tn(l[c-1],ot(tn(o[c-1],o[c]),r/2));for(let c=a-1;c>=0;c--)l[c]=Nt(l[c+1],ot(tn(o[c+1],o[c]),r/2));for(let c=0;c<s;c++)e.set([l[c][0],l[c][1],l[c][2],c*r],i+c*4)}const ea={sweep:.74,dihedral:.3,twist:.12};function hr(n,e){const t=ea.sweep+n.sweep,i=ea.dihedral-n.dihedral,s=ea.twist+n.twist,r=Vi(Vi(Vn(nn,-t),Vn(ps,-i)),Vn(qn,-s));return e?[r[0],-r[1],-r[2],r[3]]:r}const Tc=n=>Vn(qn,n.fluke),us=3;function E0(n,e,t,i=0){const s=Wt*4,r=t*us*s,a=e.subarray(r,r+s),o=e.subarray(r+s,r+2*s);Ec(n,a,o,0);const l=e.subarray(r+2*s,r+3*s);l.set(hr(n.flipperL,!0),0),l.set(hr(n.flipperR,!1),4),l.set(Tc(n),8),l.set([n.flukeFlex,i,0,0],12)}function Ac(n){const e=new Float32Array(Wt*4),t=new Float32Array(Wt*4);return Ec(n,e,t),{p:e,q:t,flipL:hr(n.flipperL,!0),flipR:hr(n.flipperR,!1),fluke:Tc(n),flukeFlex:n.flukeFlex}}function T0(n,e,t){const i=e.spine[t],s=Math.min(Wt-2,Math.floor(i)),r=i-s,a=Sc([n.p[s*4],n.p[s*4+1],n.p[s*4+2]],[n.p[s*4+4],n.p[s*4+5],n.p[s*4+6]],r),o=oi([n.q[s*4]+(n.q[s*4+4]-n.q[s*4])*r,n.q[s*4+1]+(n.q[s*4+5]-n.q[s*4+1])*r,n.q[s*4+2]+(n.q[s*4+6]-n.q[s*4+2])*r,n.q[s*4+3]+(n.q[s*4+7]-n.q[s*4+3])*r]),l=e.info[t*4];let c=[e.offset[t*3],e.offset[t*3+1],e.offset[t*3+2]];const u=e.spine[t]/(Wt-1)-.5;if(l===sr||l===Ka){const f=l===sr?e.pivots.flipperL:e.pivots.flipperR;c=tn([f[0],f[1],f[2]-u],Ft(l===sr?n.flipL:n.flipR,c))}else if(l===Ui){const f=e.pivots.fluke,d=[c[0],c[1]+n.flukeFlex*(c[0]/.168)**2,c[2]];c=tn([f[0],f[1],f[2]-u],Ft(n.fluke,d))}return tn(a,Ft(o,c))}const A0=64;function b0(n,e){let t=0,i=n.path(0);const s=Math.max(1,Math.ceil(A0*Math.abs(e)));for(let r=1;r<=s;r++){const a=n.path(e*r/s);t+=Xt(Nt(a,i)),i=a}return t/n.length}function w0(n,e){const t=n,i=.001,s=e.path(t-i),r=e.path(t),a=e.path(t+i),o=ot(Nt(a,s),1/(2*i)),l=ot(tn(Nt(a,ot(r,2)),s),1/(i*i)),c=Math.max(1e-6,Xt(o)),u=ot(o,1/c),f=e.up?e.up(t):nn,d=ur(u,f,0),m=Ft(d,qn),_=Ft(d,nn),v=Nt(l,ot(u,Pt(l,u))),p=ot(v,1/(c*c)),h=Pt(p,m)*e.length,A=Pt(p,_)*e.length,S=e.maxBank??.55,g=Math.max(-S,Math.min(S,h*(e.bankGain??.55))),P=ur(u,f,g),b=yc({distance:b0(e,t),effort:e.effort?e.effort(t):1,turn:h,climb:A,bank:g,phase:e.phase,stride:e.stride});return{position:r,quaternion:P,scale:e.length,articulation:b,bank:g}}const Et={ink:[24,60,89],inkFar:[44,84,116],contrast:1.45,farFade:.12,gamma:1.3,tone:.18},R0={mode:"shape",split:0,cellW:7,cellH:12,ink:Et.ink,inkFar:Et.inkFar,opacity:1,contrast:Et.contrast,farFade:Et.farFade,invert:!1,gamma:Et.gamma,tone:Et.tone},ar=[" ",".","·",":","-","=","+","*","x","#","%","@","_","/","\\","|","(",")","o","~",",","'","`",";",'"',"^","°","•"],C0=[".","·",":",";","+","*","x","#"],ht=n=>ar.indexOf(n),On=8;function P0(n,e,t='"JetBrains Mono", monospace'){const i=Math.ceil(ar.length/On),s=document.createElement("canvas");s.width=n*On,s.height=e*i;const r=s.getContext("2d",{willReadFrequently:!0}),a=Math.max(6,Math.min(n/.6,e*.92));r.font=`500 ${a.toFixed(2)}px ${t}`,r.textAlign="center",r.textBaseline="middle",r.fillStyle="#fff",ar.forEach((d,m)=>{const _=m%On*n+n/2,v=Math.floor(m/On)*e+e/2+a*.04;r.fillText(d,_,v)});const o=r.getImageData(0,0,s.width,s.height).data,l=ar.map((d,m)=>{const _=m%On*n,v=Math.floor(m/On)*e;let p=0;for(let h=0;h<e;h++)for(let A=0;A<n;A++)p+=o[((v+h)*s.width+_+A)*4+3];return p/(255*n*e)}),c=C0.map(d=>({i:ht(d),c:l[ht(d)]})).sort((d,m)=>d.c-m.c),u=[];let f=-1;for(const d of c)d.c-f<.012||(u.push(d.i),f=d.c);return{canvas:s,tileW:n,tileH:e,ramp:u,coverage:l}}const bc=`
uniform highp sampler2D uSkin;
uniform vec3 uPivotL;
uniform vec3 uPivotR;
uniform vec3 uPivotF;
const int SPINE_N = ${Wt};
vec4 skinTexel(int x, int row) { return texelFetch(uSkin, ivec2(x, row), 0); }
vec3 qrot(vec4 q, vec3 v) { vec3 t = 2.0 * cross(q.xyz, v); return v + q.w * t + cross(q.xyz, t); }
// Mirrors skinVertex() in whale3dPose.ts
void skinWhale(float spine, vec3 offset, vec3 nrm, float part, int row, out vec3 pos, out vec3 n, out vec3 tangent) {
  int i0 = min(int(floor(spine)), SPINE_N - 2);
  float t = spine - float(i0);
  vec3 P = mix(skinTexel(i0, row).xyz, skinTexel(i0 + 1, row).xyz, t);
  vec4 Q = normalize(mix(skinTexel(i0, row + 1), skinTexel(i0 + 1, row + 1), t));
  float sz = spine / float(SPINE_N - 1) - 0.5;
  vec3 off = offset;
  vec3 nn = nrm;
  if (part > 0.5 && part < 2.5) {
    bool left = part < 1.5;
    vec4 fq = skinTexel(left ? 0 : 1, row + 2);
    vec3 pv = left ? uPivotL : uPivotR;
    off = vec3(pv.xy, pv.z - sz) + qrot(fq, off);
    nn = qrot(fq, nn);
  } else if (part > 2.5 && part < 3.5) {
    vec4 fq = skinTexel(2, row + 2);
    float flex = skinTexel(3, row + 2).x;
    float sx = off.x / 0.168;
    off.y += flex * sx * sx;
    off = vec3(uPivotF.xy, uPivotF.z - sz) + qrot(fq, off);
    nn = qrot(fq, nn);
  }
  pos = P + qrot(Q, off);
  n = qrot(Q, nn);
  tangent = qrot(Q, vec3(0.0, 0.0, -1.0));
}
`,D0=`
${bc}
in float aSpine;
in vec4 aInfo;
uniform float uSkinRow;
out vec3 vViewN;
out vec3 vViewPos;
out vec4 vInfo;
out vec4 vMarks;
out vec3 vViewTan;
out vec3 vRestPos;
out vec3 vRestN;
void main() {
  vec3 p; vec3 n; vec3 tg;
  skinWhale(aSpine, position, normal, aInfo.x, int(uSkinRow), p, n, tg);
  vec4 view = viewMatrix * modelMatrix * vec4(p, 1.0);
  vViewPos = view.xyz;
  vViewN = normalize(mat3(viewMatrix) * mat3(modelMatrix) * n);
  vViewTan = mat3(viewMatrix) * mat3(modelMatrix) * tg;
  vInfo = aInfo;
  // Region ids are per-vertex integers: turn them into masks before they interpolate
  // (mouth, eye, throat pleats, tubercles)
  vMarks = vec4(abs(aInfo.y - 1.0) < 0.5 ? 1.0 : 0.0, abs(aInfo.y - 2.0) < 0.5 ? 1.0 : 0.0, abs(aInfo.y - 3.0) < 0.5 ? 1.0 : 0.0, abs(aInfo.y - 4.0) < 0.5 ? 1.0 : 0.0);
  vRestPos = position + vec3(0.0, 0.0, aSpine);
  // The body's rest normal: an angle around the body that the skin carries with it
  vRestN = normal;
  gl_Position = projectionMatrix * view;
}
`,L0=`
precision highp float;
in vec3 vViewN;
in vec3 vViewPos;
in vec4 vInfo;
in vec4 vMarks;
in vec3 vViewTan;
in vec3 vRestPos;
in vec3 vRestN;
layout(location = 0) out vec4 gInk;
layout(location = 1) out vec4 gMask;
layout(location = 2) out vec4 gMarks;
uniform vec3 uLight;
uniform vec2 uDepthRange;
uniform float uDissolve;
uniform vec4 uOccluder;
uniform float uOcclusion;
uniform float uInvert;
float hash(vec3 p) { return fract(sin(dot(p, vec3(12.9898, 78.233, 37.719))) * 43758.5453); }
void main() {
  // Unravel from the tail: the same key orders the particles that leave the body (convergence)
  if (uDissolve > 0.0) {
    float front = 1.0 - uDissolve;
    float edge = (hash(floor(vRestPos * 220.0)) - 0.5) * 0.07;
    if (vInfo.w + edge > front) discard;
  }
  vec3 n = normalize(vViewN);
  if (!gl_FrontFacing) n = -n;
  float lambert = dot(n, uLight);
  float wrap = lambert * 0.5 + 0.5;
  float facing = clamp(abs(n.z), 0.0, 1.0);
  float rim = 1.0 - facing;
  float pigment = vInfo.z;
  // Ink: pigment (dark back, pale belly) shaded by the light, deepening toward the silhouette
  // and into the core shadow, so the broad flank turns like a modelled surface
  // A raking light from above models the mass: the ridge of the back and the upper flank catch a
  // wet sheen, the flank turns through a core shadow below it, and the countershading keeps the
  // throat and belly pale beneath that shadow
  float shade = 1.0 - clamp(lambert, 0.0, 1.0);
  float core = smoothstep(0.0, -0.5, lambert);
  float sheen = pow(max(dot(n, normalize(uLight + vec3(0.0, 0.0, 1.0))), 0.0), 14.0);
  float ink = pigment * (0.4 + 0.52 * pow(shade, 1.3)) + 0.24 * core * (1.0 - 0.4 * pigment) + 0.3 * rim * rim * rim - 0.2 * sheen * pigment;
  ink = smoothstep(0.04, 0.97, ink);
  // The throat pleats: a pale pouch engraved with grooves running along the body. The groove
  // phase is the angle around the body at rest, so the grooves travel with the skin.
  float pleat = smoothstep(0.25, 0.85, vMarks.z) * (vInfo.x < 0.5 ? 1.0 : 0.0);
  float groove = 0.5 + 0.5 * cos(atan(vRestN.y, vRestN.x) * 38.0);
  ink = max(ink, pleat * (0.3 + 0.32 * groove));
  float knob = smoothstep(0.2, 0.7, vMarks.w);
  float light = clamp(0.15 + 0.85 * wrap * (1.0 - 0.55 * pigment) + 0.25 * pow(max(lambert, 0.0), 6.0), 0.0, 1.0);
  ink = mix(ink, light * 0.9 + 0.12 * rim, uInvert);
  float mouth = smoothstep(0.35, 0.8, vMarks.x);
  float eye = smoothstep(0.35, 0.8, vMarks.y);
  float depth = clamp((-vViewPos.z - uDepthRange.x) / max(1e-4, uDepthRange.y - uDepthRange.x), 0.0, 1.0);
  // A forming sphere hides what passes behind it
  float coverage = 1.0;
  if (uOcclusion > 0.0) {
    vec3 d = normalize(vViewPos);
    float tc = dot(uOccluder.xyz, d);
    float h2 = dot(uOccluder.xyz, uOccluder.xyz) - tc * tc;
    float r2 = uOccluder.w * uOccluder.w;
    if (h2 < r2) {
      float t0 = tc - sqrt(r2 - h2);
      if (t0 > 0.0 && t0 < length(vViewPos) - 1e-3) coverage = 1.0 - uOcclusion;
    }
  }
  gInk = vec4(clamp(ink, 0.0, 1.0), depth, n.x * 0.5 + 0.5, n.y * 0.5 + 0.5);
  // Screen direction of the body axis (for hatching along the form), and how strongly it shows
  vec2 tan2 = normalize(vViewTan).xy;
  // (0 means none, so an exactly level axis is kept just above it)
  float axial = length(tan2) > 0.32 ? max(fract(atan(tan2.y, tan2.x) / 3.14159265 + 1.0), 0.002) : 0.0;
  gMask = vec4(mouth, eye, axial, coverage);
  // Engraving marks: pleat pouch, groove line, tubercles, and appendages (kept pale and crisp)
  gMarks = vec4(pleat, groove * pleat, knob, vInfo.x > 0.5 && vInfo.x < 3.5 ? 1.0 : 0.0);
}
`,ta=`
void main() { gl_Position = vec4(position.xy, 0.0, 1.0); }
`,I0=`
precision highp float;
uniform sampler2D uInk;
uniform sampler2D uMask;
uniform vec2 uCanvas;   // device px
uniform vec2 uCell;     // device px
uniform vec2 uTexel;    // one G-buffer texel in uv
uniform float uSplit;   // columns (uv x) below this use luminance mode
uniform float uShape;   // 1 shape-aware, 0 luminance
uniform float uRamp[12];
uniform float uRampN;
uniform float uGamma;
uniform float uTone;
uniform vec4 uEdgeA;   // indices: '-', '_', '/', ''
uniform vec4 uEdgeB;    // indices: '|', '(', ')', 'o'
uniform vec4 uMarkG;    // indices: '=', '°', '•', ':'
uniform vec4 uToneG;    // indices: '·', '+', 'x', '#'
uniform sampler2D uMarks;
out vec4 outCell;

// 4×4 ordered dither by cell: neighbouring cells straddle two ramp steps instead of banding,
// and since the grid is locked to the canvas the pattern never shimmers
float bayer4(vec2 c) {
  vec2 p = mod(c, 4.0);
  int i = int(p.x) + int(p.y) * 4;
  int m[16] = int[16](0, 8, 2, 10, 12, 4, 14, 6, 3, 11, 1, 9, 15, 7, 13, 5);
  return (float(m[i]) + 0.5) / 16.0;
}
float rampGlyph(float v, vec2 cell) {
  float x = clamp(v * (uRampN - 0.4) + (bayer4(cell) - 0.5) * 0.9, 0.0, uRampN - 1.0);
  return uRamp[int(floor(x + 0.5))];
}
/** Oriented stroke for a line at angle a (radians, 0 … π, y up). */
float strokeGlyph(float a) {
  if (a < 0.3927 || a >= 2.7489) return uEdgeA.x;
  if (a < 1.1781) return uEdgeA.z;
  if (a < 1.9635) return uEdgeB.x;
  return uEdgeA.w;
}

void main() {
  vec2 cellIx = floor(gl_FragCoord.xy);              // x = column, y = row counted from the top
  vec2 px0 = cellIx * uCell;                         // cell's top-left, device px from the top-left
  // Most cells are open water: a 3 × 3 probe of coverage (one texel beyond the cell) skips them
  float probe = 0.0;
  for (int j = 0; j < 3; j++) {
    for (int i = 0; i < 3; i++) {
      vec2 sp = px0 + vec2(float(i), float(j)) * 0.5 * uCell;
      vec2 uv = vec2(sp.x / uCanvas.x, 1.0 - sp.y / uCanvas.y) + (vec2(float(i), float(j)) - 1.0) * uTexel * vec2(1.0, -1.0);
      probe = max(probe, texture(uMask, uv).a);
    }
  }
  if (probe <= 0.0) { outCell = vec4(0.0); return; }
  const int SX = 4;
  const int SY = 5;
  float covSum = 0.0, inkSum = 0.0, depthSum = 0.0, eyeSum = 0.0, mouthSum = 0.0;
  float pleatSum = 0.0, grooveSum = 0.0, knobSum = 0.0, appSum = 0.0;
  float jxx = 0.0, jyy = 0.0, jxy = 0.0, silE = 0.0, inE = 0.0;
  vec2 covGrad = vec2(0.0);
  vec2 covCentroid = vec2(0.0);
  vec2 axis = vec2(0.0);
  for (int j = 0; j < SY; j++) {
    for (int i = 0; i < SX; i++) {
      vec2 sp = px0 + (vec2(float(i), float(j)) + 0.5) / vec2(float(SX), float(SY)) * uCell;
      vec2 uv = vec2(sp.x / uCanvas.x, 1.0 - sp.y / uCanvas.y);
      vec4 a = texture(uInk, uv);
      vec4 m = texture(uMask, uv);
      float c = m.a;
      covSum += c;
      inkSum += a.r * c;
      depthSum += a.g * c;
      eyeSum += m.g * c;
      mouthSum += m.r * c;
      vec4 mk = texture(uMarks, uv);
      pleatSum += mk.r * c;
      grooveSum += mk.g * c;
      knobSum += mk.b * c;
      appSum += mk.a * c;
      // The axis angle wraps (0 and 1 are the same direction), so it is read unfiltered: a linear
      // blend of 0.99 and 0.01 would turn a level body's hatching vertical
      float ax = texelFetch(uMask, ivec2(uv * vec2(textureSize(uMask, 0))), 0).b;
      if (ax > 0.0) axis += vec2(cos(ax * 6.2831853), sin(ax * 6.2831853)) * c;
      covCentroid += (vec2(float(i), float(j)) + 0.5) / vec2(float(SX), float(SY)) * c;
      // Gradients (uv y up): silhouette from coverage, occluding contours from depth, creases
      // from normals, and the mouth line from its mask
      vec4 ax1 = texture(uInk, uv + vec2(uTexel.x, 0.0));
      vec4 ax0 = texture(uInk, uv - vec2(uTexel.x, 0.0));
      vec4 ay1 = texture(uInk, uv + vec2(0.0, uTexel.y));
      vec4 ay0 = texture(uInk, uv - vec2(0.0, uTexel.y));
      vec4 mx1 = texture(uMask, uv + vec2(uTexel.x, 0.0));
      vec4 mx0 = texture(uMask, uv - vec2(uTexel.x, 0.0));
      vec4 my1 = texture(uMask, uv + vec2(0.0, uTexel.y));
      vec4 my0 = texture(uMask, uv - vec2(0.0, uTexel.y));
      vec2 gc = vec2(mx1.a - mx0.a, my1.a - my0.a);
      float both = min(min(mx1.a, mx0.a), min(my1.a, my0.a));
      vec2 gd = vec2(ax1.g - ax0.g, ay1.g - ay0.g) * both;
      gd *= step(0.035, length(gd)) * 6.0;
      vec2 gnx = vec2(ax1.b - ax0.b, ay1.b - ay0.b) * both;
      vec2 gny = vec2(ax1.a - ax0.a, ay1.a - ay0.a) * both;
      vec2 gm = vec2(mx1.r - mx0.r, my1.r - my0.r);
      covGrad += gc;
      jxx += gc.x * gc.x + gd.x * gd.x + 0.2 * (gnx.x * gnx.x + gny.x * gny.x) + 0.6 * gm.x * gm.x;
      jyy += gc.y * gc.y + gd.y * gd.y + 0.2 * (gnx.y * gnx.y + gny.y * gny.y) + 0.6 * gm.y * gm.y;
      jxy += gc.x * gc.y + gd.x * gd.y + 0.2 * (gnx.x * gnx.y + gny.x * gny.y) + 0.6 * gm.x * gm.y;
      silE += dot(gc, gc);
      inE += dot(gd, gd) + 0.2 * (dot(gnx, gnx) + dot(gny, gny)) + 0.6 * dot(gm, gm);
    }
  }
  float n = float(SX * SY);
  float coverage = covSum / n;
  if (coverage < 0.02 && silE < 0.02) { outCell = vec4(0.0); return; }
  float ink = covSum > 0.0 ? inkSum / covSum : 0.0;
  float depth = covSum > 0.0 ? depthSum / covSum : 0.0;
  bool lum = uShape < 0.5 || (cellIx.x * uCell.x) / uCanvas.x < uSplit;
  float d = bayer4(cellIx);

  float glyph = 0.0;
  float alpha = 0.0;
  // Drawing class for the composite: 1 line work, else the tone cell's level (0.2 … 0.8)
  float cls = 1.0;
  if (lum) {
    // Luminance: mean ink (thinned at the silhouette by coverage) through the density ramp
    float v = pow(clamp(ink * smoothstep(0.15, 0.6, coverage), 0.0, 1.0), uGamma);
    if (coverage > 0.22 && v > 0.04) {
      glyph = rampGlyph(v, cellIx);
      alpha = 1.0;
      cls = 0.2 + 0.6 * v;
    }
  } else {
    float eye = eyeSum / n;
    float mouth = mouthSum / n;
    float body = max(covSum, 1e-3);
    float pleat = pleatSum / body;
    float groove = grooveSum / body;
    float knob = knobSum / n;
    float app = appSum / body;
    float tr = jxx + jyy;
    // Dominant gradient direction of the patch (structure tensor), then the contour across it
    float theta = 0.5 * atan(2.0 * jxy, jxx - jyy);
    float coherence = tr > 1e-5 ? sqrt((jxx - jyy) * (jxx - jyy) + 4.0 * jxy * jxy) / tr : 0.0;
    float lineA = mod(theta + 1.5707963, 3.14159265);
    // The silhouette is wherever the cell is partly covered: a soft edge still counts, so the
    // outline closes instead of breaking into punctuation. Its direction comes from the coverage
    // gradient itself (it points into the body), which is steadier than the tensor at an edge.
    bool silhouette = coverage > 0.05 && coverage < 0.94 && silE > 0.06;
    if (silhouette && length(covGrad) > 0.08) lineA = mod(atan(covGrad.y, covGrad.x) + 1.5707963, 3.14159265);
    bool contour = inE > 0.04 * n && coherence > 0.42 && coverage > 0.5;
    bool mouthLine = mouth > 0.1 && coverage > 0.55;
    float v = pow(clamp(ink, 0.0, 1.0), uGamma);
    float axisLen = length(axis) / body;
    float axisA = fract(atan(axis.y, axis.x) / 6.2831853 + 1.0) * 3.14159265;
    bool along = axisLen > 0.55;
    // The jaw line runs with the head; its crease mask is too thin to orient itself reliably
    if (mouthLine && !silhouette && along) lineA = axisA;
    bool level = axisA < 0.42 || axisA > 2.72;
    if (eye > 0.14 && coverage > 0.4) {
      glyph = uMarkG.z;
      alpha = 1.0;
    } else if (silhouette || contour || mouthLine) {
      vec2 cen = covSum > 0.0 ? covCentroid / covSum : vec2(0.5);
      if (lineA < 0.3927 || lineA >= 2.7489) {
        // Horizontal contour: an underscore when it runs along the cell's floor
        glyph = (silhouette && cen.y > 0.58) ? uEdgeA.y : uEdgeA.x;
      } else if (lineA < 1.1781) {
        glyph = uEdgeA.z;
      } else if (lineA < 1.9635) {
        // Round flanks read as parentheses; a sliver seen edge-on (a fin) as a bar
        glyph = silhouette && coverage > 0.3 ? (covGrad.x > 0.0 ? uEdgeB.y : uEdgeB.z) : uEdgeB.x;
      } else {
        glyph = uEdgeA.w;
      }
      alpha = silhouette ? 1.0 : (mouthLine ? 1.0 : 0.88);
    } else if (knob > 0.3 && coverage > 0.5) {
      // Tubercles: the knobs of the rostrum, each its own small ring
      glyph = uEdgeB.w;
      alpha = 0.95;
    } else if (pleat > 0.45 && coverage > 0.5) {
      // Throat grooves engraved along the body: doubled lines where they run level
      glyph = along ? (level ? (groove > 0.3 ? uMarkG.x : uEdgeA.x) : strokeGlyph(axisA)) : uMarkG.w;
      alpha = 0.55 + 0.4 * max(v, groove);
      cls = 0.4;
    } else if (coverage > 0.3) {
      // The body's mass as an engraver's tone scale: stipple in the light, hatching that runs
      // along the body through the mid tones, crosshatch in the shadow. No cell inside the body
      // is left empty except in the brightest light, so the form keeps its weight.
      float t = clamp(v * (app > 0.5 ? 0.8 : 1.0) + uTone * (app > 0.5 ? 0.5 : 1.0), 0.0, 1.0);
      float q = clamp(t * 6.0 + (d - 0.5) * 0.9, 0.0, 6.0);
      // Foreshortened (head- or tail-on) the body has no stroke direction to hatch along: carry
      // its tone a step lighter in stipple, so the form stays modelled instead of setting as a block
      if (!along) q = max(0.0, q - 1.1);
      int L = int(floor(q + 0.5));
      cls = 0.2 + 0.1 * float(L);
      // Engraved lines are spaced across the stroke direction: every other line in the light
      // tones, every line in the mid tones (the spacing, not the glyph, carries the tone)
      float sa = sin(axisA), ca = cos(axisA);
      float perp = -(cellIx.x + 0.5) * uCell.x * sa - (cellIx.y + 0.5) * uCell.y * ca;
      float pitch = uCell.x * abs(sa) + uCell.y * abs(ca);
      bool onLine = mod(floor(perp / pitch), 2.0) < 0.5;
      if (L == 0) {
        if (d < 0.4) { glyph = uToneG.x; alpha = 0.45; }
      } else if (L == 1) {
        if (along && onLine) { glyph = strokeGlyph(axisA); alpha = 0.5; }
        else if (d < 0.5) { glyph = uToneG.x; alpha = 0.55; }
      } else if (L == 2) {
        if (!along) { glyph = uMarkG.w; alpha = 0.7; }
        else if (onLine) { glyph = strokeGlyph(axisA); alpha = 0.72; }
        else if (d < 0.35) { glyph = uToneG.x; alpha = 0.55; }
      } else if (L == 3) {
        // Lines on every row; the in-between rows only partly, so the tone still breathes
        if (!along) { glyph = uToneG.y; alpha = 0.8; }
        else if (onLine || d < 0.55) { glyph = level ? (onLine ? uMarkG.x : uEdgeA.x) : strokeGlyph(axisA); alpha = 0.8; }
        else { glyph = uToneG.x; alpha = 0.6; }
      } else if (L == 4) {
        // Cross-hatching: strokes along the body, and between them doubled lines (level) or
        // crossings, so the deeper tone reads as denser engraving, never as a picket of bars
        glyph = !along ? uToneG.y : (onLine ? strokeGlyph(axisA) : (level ? uMarkG.x : uToneG.y));
        alpha = 0.88;
      } else if (L == 5) {
        glyph = d < 0.5 ? uToneG.z : (along ? strokeGlyph(axisA) : uToneG.y);
        alpha = 0.94;
      } else {
        // The deepest core shadow only: dense, but dithered so it never sets as a flat block
        glyph = d < 0.6 ? uToneG.w : uToneG.z;
        alpha = 1.0;
      }
    }
  }
  // B: tone toward the far ink with depth (the farther of two whales recedes)
  outCell = vec4(glyph / 255.0, alpha, clamp(depth * 0.6, 0.0, 1.0), cls);
}
`,U0=`
precision highp float;
uniform sampler2D uCells;
uniform sampler2D uAtlas;
uniform vec2 uCell;
uniform vec2 uTile;
uniform float uAtlasCols;
uniform float uCanvasH;
uniform vec3 uInk;
uniform vec3 uInkFar;
uniform float uOpacity;
uniform float uContrast;
uniform float uFarFade;
uniform float uInvert;
out vec4 outColor;
void main() {
  vec2 fc = vec2(gl_FragCoord.x, uCanvasH - gl_FragCoord.y);
  ivec2 cell = ivec2(floor(fc / uCell));
  vec4 c = texelFetch(uCells, cell, 0);
  float gi = floor(c.r * 255.0 + 0.5);
  // Nothing but the glyphs: no panel, no fill and no mask, so a whale's silhouette stays whole
  // wherever it swims (the copy keeps its own halo above this layer)
  if (c.g <= 0.0 || gi < 0.5) discard;
  // Line work (silhouette, contours, mouth, eye) is class 1; the body's tone cells carry their
  // engraver's level 0 … 1 below it
  float line = step(0.95, c.a);
  float level = clamp((c.a - 0.2) / 0.6, 0.0, 1.0) * (1.0 - line);
  vec2 local = floor(fc - vec2(cell) * uCell);
  vec2 tile = vec2(mod(gi, uAtlasCols), floor(gi / uAtlasCols));
  float a = texelFetch(uAtlas, ivec2(tile * uTile + min(local, uTile - 1.0)), 0).a * min(1.0, c.g * uContrast) * uOpacity;
  a *= 1.0 - uFarFade * c.b;
  vec3 col = mix(uInk, uInkFar, c.b);
  // The drawing and the deepest shadow take the strongest ink (deeper on light water, brighter
  // on the abyss), so the contour holds the form and the modelling reads in depth
  float strong = max(line, smoothstep(0.55, 1.0, level));
  col = mix(col, mix(col * 0.66, mix(col, vec3(1.0), 0.3), uInvert), strong * (1.0 - 0.6 * c.b));
  outColor = vec4(col * a, a);
}
`,N0=`
precision highp float;
uniform sampler2D uInk;
uniform sampler2D uMask;
uniform vec2 uCanvas;
uniform vec3 uInk3;
out vec4 outColor;
void main() {
  vec2 uv = gl_FragCoord.xy / uCanvas;
  vec4 a = texture(uInk, uv);
  vec4 m = texture(uMask, uv);
  float c = m.a;
  vec3 shade = mix(vec3(0.96), uInk3, a.r);
  shade = mix(shade, vec3(0.1), max(m.r, m.g));
  outColor = vec4(shade * c, c);
}
`,na=(n,e)=>n.set(e[0]/255,e[1]/255,e[2]/255);class wc{constructor(e,t={}){Xe(this,"renderer");Xe(this,"camera",new Ut(30,1,.1,200));Xe(this,"underlay",new Ks);Xe(this,"overlay",new Ks);Xe(this,"style",{...R0});Xe(this,"skinData");Xe(this,"skinTexture");Xe(this,"pivotUniforms");Xe(this,"lost",!1);Xe(this,"onContextLost",null);Xe(this,"scene",new Ks);Xe(this,"quadCamera",new uc(-1,1,1,-1,0,1));Xe(this,"whales",[]);Xe(this,"gbuffer");Xe(this,"cells");Xe(this,"cellMaterial");Xe(this,"compositeMaterial");Xe(this,"rawMaterial");Xe(this,"quad");Xe(this,"quadScene",new Ks);Xe(this,"atlas",null);Xe(this,"atlasTexture",null);Xe(this,"atlasKey","");Xe(this,"cssW",1);Xe(this,"cssH",1);Xe(this,"dpr",1);Xe(this,"gscale");Xe(this,"occluder",{center:new N,radius:0,amount:0});Xe(this,"light",new N(-.42,.8,.42).normalize());Xe(this,"tmp",new N);Xe(this,"onLost",e=>{var t;e.preventDefault(),this.lost=!0,(t=this.onContextLost)==null||t.call(this)});Xe(this,"onRestored",()=>{this.lost=!1,this.atlasKey="",this.skinTexture.needsUpdate=!0});Xe(this,"canvas");this.canvas=e;const i=t.maxWhales??2;this.gscale=t.gbufferScale??.75,this.renderer=new Jm({canvas:e,alpha:!0,premultipliedAlpha:!0,antialias:!1,powerPreference:"high-performance"}),this.renderer.setClearColor(0,0),this.renderer.autoClear=!1,e.addEventListener("webglcontextlost",this.onLost),e.addEventListener("webglcontextrestored",this.onRestored),this.skinData=new Float32Array(Wt*4*us*i),this.skinTexture=new Qm(this.skinData,Wt,us*i,Ht,un),this.skinTexture.minFilter=ft,this.skinTexture.magFilter=ft,this.skinTexture.needsUpdate=!0;const s=Sr(),r=new rn;r.setAttribute("position",new ut(s.offset,3)),r.setAttribute("normal",new ut(s.normal,3)),r.setAttribute("aSpine",new ut(s.spine,1)),r.setAttribute("aInfo",new ut(s.info,4)),r.setIndex(new ut(s.index,1)),this.pivotUniforms={uPivotL:{value:new N(...s.pivots.flipperL)},uPivotR:{value:new N(...s.pivots.flipperR)},uPivotF:{value:new N(...s.pivots.fluke)}};for(let a=0;a<i;a++){const o=new wt({glslVersion:zn,vertexShader:D0,fragmentShader:L0,side:ln,uniforms:{uSkin:{value:this.skinTexture},...this.pivotUniforms,uSkinRow:{value:a*us},uLight:{value:new N},uDepthRange:{value:new Ve(0,1)},uDissolve:{value:0},uOccluder:{value:new tt},uOcclusion:{value:0},uInvert:{value:0}}}),l=new Vt(r,o);l.frustumCulled=!1,l.visible=!1,this.scene.add(l),this.whales.push({mesh:l,material:o,state:null})}this.gbuffer=new Tn(1,1,{count:3,depthBuffer:!0,type:sn});for(const a of this.gbuffer.textures)a.minFilter=Gt,a.magFilter=Gt,a.generateMipmaps=!1;this.cells=new Tn(1,1,{depthBuffer:!1,type:sn}),this.cells.texture.minFilter=ft,this.cells.texture.magFilter=ft,this.cells.texture.generateMipmaps=!1,this.cellMaterial=new wt({glslVersion:zn,vertexShader:ta,fragmentShader:I0,depthTest:!1,depthWrite:!1,uniforms:{uInk:{value:null},uMask:{value:null},uCanvas:{value:new Ve},uCell:{value:new Ve},uTexel:{value:new Ve},uSplit:{value:0},uShape:{value:1},uRamp:{value:new Array(12).fill(0)},uRampN:{value:1},uGamma:{value:1},uTone:{value:0},uEdgeA:{value:new tt(ht("-"),ht("_"),ht("/"),ht("\\"))},uEdgeB:{value:new tt(ht("|"),ht("("),ht(")"),ht("o"))},uMarkG:{value:new tt(ht("="),ht("°"),ht("•"),ht(":"))},uToneG:{value:new tt(ht("·"),ht("+"),ht("x"),ht("#"))},uMarks:{value:null}}}),this.compositeMaterial=new wt({glslVersion:zn,vertexShader:ta,fragmentShader:U0,transparent:!0,premultipliedAlpha:!0,blending:hs,blendSrc:fs,blendDst:ui,depthTest:!1,depthWrite:!1,uniforms:{uCells:{value:this.cells.texture},uAtlas:{value:null},uCell:{value:new Ve},uTile:{value:new Ve},uAtlasCols:{value:On},uCanvasH:{value:1},uInk:{value:new N},uInkFar:{value:new N},uOpacity:{value:1},uContrast:{value:Et.contrast},uFarFade:{value:Et.farFade},uInvert:{value:0}}}),this.rawMaterial=new wt({glslVersion:zn,vertexShader:ta,fragmentShader:N0,transparent:!0,blending:hs,blendSrc:fs,blendDst:ui,depthTest:!1,depthWrite:!1,uniforms:{uInk:{value:null},uMask:{value:null},uCanvas:{value:new Ve},uInk3:{value:new N}}}),this.quad=new Vt(new $i(2,2),this.cellMaterial),this.quad.frustumCulled=!1,this.quadScene.add(this.quad)}resize(e,t,i){this.cssW=Math.max(1,e),this.cssH=Math.max(1,t),this.dpr=i,this.renderer.setPixelRatio(i),this.renderer.setSize(this.cssW,this.cssH,!1),this.camera.aspect=this.cssW/this.cssH,this.camera.updateProjectionMatrix(),this.gbuffer.setSize(Math.max(1,Math.round(this.cssW*this.gscale)),Math.max(1,Math.round(this.cssH*this.gscale))),this.atlasKey=""}get size(){return{width:this.cssW,height:this.cssH,dpr:this.dpr}}setStyle(e){Object.assign(this.style,e)}setResolution(e){this.gscale=Math.max(.35,Math.min(.75,e)),this.gbuffer.setSize(Math.max(1,Math.round(this.cssW*this.gscale)),Math.max(1,Math.round(this.cssH*this.gscale)))}setWhale(e,t){const i=this.whales[e];i&&(i.state=t,i.mesh.visible=!!t&&t.visible,!(!t||!t.visible)&&(i.mesh.position.set(...t.position),i.mesh.quaternion.set(...t.quaternion),i.mesh.scale.setScalar(t.scale),E0(t.articulation,this.skinData,e,t.dissolve),i.material.uniforms.uDissolve.value=t.dissolve))}setOccluder(e,t,i){this.occluder.center.set(...e),this.occluder.radius=t,this.occluder.amount=i}ensureCells(){var c;const e=Math.max(2,Math.round(this.style.cellW*this.dpr)),t=Math.max(3,Math.round(this.style.cellH*this.dpr)),i=Math.round(this.cssW*this.dpr),s=Math.round(this.cssH*this.dpr),r=`${e}x${t}:${i}x${s}`;if(r===this.atlasKey)return{cw:e,ch:t,W:i,H:s};this.atlasKey=r,this.atlas=P0(e,t),(c=this.atlasTexture)==null||c.dispose(),this.atlasTexture=new n0(this.atlas.canvas),this.atlasTexture.flipY=!1,this.atlasTexture.minFilter=ft,this.atlasTexture.magFilter=ft,this.atlasTexture.generateMipmaps=!1,this.cells.setSize(Math.ceil(i/e),Math.ceil(s/t));const a=this.atlas.ramp,o=this.cellMaterial.uniforms,l=new Array(12).fill(a[a.length-1]);return a.forEach((u,f)=>l[f]=u),o.uRamp.value=l,o.uRampN.value=Math.min(12,a.length),{cw:e,ch:t,W:i,H:s}}get glyphs(){var e,t;return this.ensureCells(),{texture:this.atlasTexture,tileW:((e=this.atlas)==null?void 0:e.tileW)??1,tileH:((t=this.atlas)==null?void 0:t.tileH)??1,cols:On}}invalidateAtlas(){this.atlasKey=""}render(e=!0){if(this.lost)return;const t=this.renderer,{cw:i,ch:s,W:r,H:a}=this.ensureCells();this.skinTexture.needsUpdate=!0,this.camera.updateMatrixWorld();const o=this.camera.matrixWorldInverse;let l=1/0,c=-1/0;for(const p of this.whales){if(!p.mesh.visible||!p.state)continue;const h=-this.tmp.set(...p.state.position).applyMatrix4(o).z;l=Math.min(l,h-p.state.scale*.7),c=Math.max(c,h+p.state.scale*.7)}const u=this.light,f=this.tmp.copy(this.occluder.center).applyMatrix4(o);for(const p of this.whales){const h=p.material.uniforms;h.uLight.value.copy(u),h.uDepthRange.value.set(Number.isFinite(l)?l:0,Number.isFinite(c)?c:1),h.uOccluder.value.set(f.x,f.y,f.z,this.occluder.radius),h.uOcclusion.value=this.occluder.amount,h.uInvert.value=this.style.invert?1:0}const d=this.whales.some(p=>p.mesh.visible);t.setRenderTarget(this.gbuffer),t.setClearColor(0,0),t.clear(!0,!0,!0),t.render(this.scene,this.camera);const[m,_,v]=this.gbuffer.textures;if(t.setRenderTarget(null),t.setClearColor(0,0),t.clear(!0,!0,!0),e&&this.underlay.children.length&&t.render(this.underlay,this.camera),d)if(this.style.mode==="raw"){const p=this.rawMaterial.uniforms;p.uInk.value=m,p.uMask.value=_,p.uCanvas.value.set(r,a),na(p.uInk3.value,this.style.ink),this.quad.material=this.rawMaterial,t.render(this.quadScene,this.quadCamera)}else{const p=this.cellMaterial.uniforms;p.uInk.value=m,p.uMask.value=_,p.uMarks.value=v,p.uCanvas.value.set(r,a),p.uCell.value.set(i,s),p.uTexel.value.set(1/this.gbuffer.width,1/this.gbuffer.height),p.uShape.value=this.style.mode==="shape"?1:0,p.uSplit.value=this.style.split,p.uGamma.value=this.style.gamma,p.uTone.value=this.style.tone,this.quad.material=this.cellMaterial,t.setRenderTarget(this.cells),t.clear(!0,!1,!1),t.render(this.quadScene,this.quadCamera),t.setRenderTarget(null);const h=this.compositeMaterial.uniforms;h.uAtlas.value=this.atlasTexture,h.uCell.value.set(i,s),h.uTile.value.set(i,s),h.uCanvasH.value=a,h.uInvert.value=this.style.invert?1:0,na(h.uInk.value,this.style.ink),na(h.uInkFar.value,this.style.inkFar),h.uOpacity.value=this.style.opacity,h.uContrast.value=this.style.contrast,h.uFarFade.value=this.style.farFade,this.quad.material=this.compositeMaterial,t.render(this.quadScene,this.quadCamera)}e&&this.overlay.children.length&&t.render(this.overlay,this.camera)}clear(){this.lost||(this.renderer.setRenderTarget(null),this.renderer.clear(!0,!0,!0))}dispose(){var e,t;this.canvas.removeEventListener("webglcontextlost",this.onLost),this.canvas.removeEventListener("webglcontextrestored",this.onRestored),this.gbuffer.dispose(),this.cells.dispose(),(e=this.atlasTexture)==null||e.dispose(),this.skinTexture.dispose(),(t=this.whales[0])==null||t.mesh.geometry.dispose();for(const i of this.whales)i.material.dispose();this.cellMaterial.dispose(),this.compositeMaterial.dispose(),this.rawMaterial.dispose(),this.quad.geometry.dispose(),this.renderer.dispose()}}const Rc=1.55,st={orbit:.15,sphere:.45,dissolve:.64,dissolveSpan:.19,earth:.84,handoff:.955,handoffEnd:.99},Wi=n=>Math.max(0,Math.min(1,n)),lt=(n,e,t)=>{const i=Wi((t-n)/(e-n));return i*i*(3-2*i)},cn=(n,e,t)=>n+(e-n)*t;function Xi(n){return n<st.orbit?cn(3.5,1.82,lt(0,st.orbit,n)**.85):n<st.sphere?cn(1.82,1.74,(n-st.orbit)/(st.sphere-st.orbit)):cn(1.74,1.22,lt(st.sphere,st.earth,n))}const fr=n=>cn(58,34,lt(.58,.84,n)),ci=4e3,Pi=new Float64Array(ci+1);for(let n=1;n<=ci;n++){const e=(n-.5)/ci;Pi[n]=Pi[n-1]+fr(e)/Xi(e)/ci}function F0(n){const e=Wi(n)*ci,t=Math.min(ci-1,Math.floor(e)),i=Pi[t]+(Pi[t+1]-Pi[t])*(e-t);return n<0?n*(fr(0)/Xi(0)):n>1?Pi[ci]+(n-1)*(fr(1)/Xi(1)):i}const O0=n=>fr(Wi(n))/Xi(Wi(n)),B0=n=>.66*lt(st.sphere-.03,.66,n),Cc=n=>.35+1.1*lt(st.sphere,st.earth,n);function ms(n,e){const t=(n===0?1:-1)*B0(e),i=Cc(e);return[-Math.sin(i)*Math.sin(t),Math.cos(t),Math.cos(i)*Math.sin(t)]}function Pc(n,e){const t=Xi(e),i=F0(e)+(n===0?0:Math.PI),s=Cc(e),r=ms(n,e),a=[Math.cos(s),0,Math.sin(s)],o=qt(kn(r,a)),l=(n===0?.16:-.16)*(1-lt(.55,.8,e))+.07*Math.sin(i*.5+n*1.7);return[t*(Math.cos(i)*a[0]+Math.sin(i)*o[0])+l*r[0],t*(Math.cos(i)*a[1]+Math.sin(i)*o[1])+l*r[1],t*(Math.cos(i)*a[2]+Math.sin(i)*o[2])+l*r[2]]}const z0=(n,e)=>cn(1.25,.7,lt(.05,st.orbit+.05,e))+.18*Math.sin(e*37+n*2.4)*(1-lt(.6,.8,e))-.3*lt(.66,.84,e);function k0(n,e=1){return{path:t=>Pc(n,t),up:t=>ms(n,t),length:Rc*e*(n===0?1:.94),effort:t=>z0(n,t),phase:n===0?0:2.3,stride:n===0?.95:.88,bankGain:.5,maxBank:.5}}const Dc=n=>-1.9*(1-lt(.6,.955,n))**2,Al=30,bl=16;function G0(n,e,t){const i=Math.tan(t/2*Math.PI/180),s=2*n/e;return Math.sqrt(1+1/(s*i)**2)}function Lc(n,e){const t=Wi(n),i=e.width/Math.max(1,e.height),s=i<.9,r=s?1.3:1,a=[0,1].map(b=>{const w=w0(t,k0(b,r)),D=Wi((t-st.dissolve)/st.dissolveSpan)*1.06;return{...w,dissolve:D,visible:D<1.05}}),o=lt(.6,.9,t),l=cn(Al,bl,o),c=Math.tan(Al/2*Math.PI/180),f=Xi(t)+Rc*r*(s?.3:.36),d=f/(c*i*(s?1:.94)),m=f*.62/(c*.86),_=Math.max(d,m),v=G0(e.globeR,e.height,bl),p=cn(_,v,o),h=cn(10,s?40:26,lt(0,.3,t))*(1-lt(.5,.9,t))*Math.PI/180,A=-34*lt(.05,.42,t)*(1-lt(.5,.88,t))*Math.PI/180,S=[p*Math.cos(h)*Math.sin(A),p*Math.sin(h),p*Math.cos(h)*Math.cos(A)],g=lt(.55,.88,t),P={position:S,up:[0,1,0],fov:l,centerX:cn(e.width/2,e.globeX,g),centerY:cn(e.height*(s?.46:.5),e.globeY,g)};return{p:t,whales:a,camera:P,spin:Dc(t),ortho:lt(.86,.955,t),occlusion:.92*lt(.6,.76,t),disc:lt(.78,.95,t),globeReveal:lt(st.handoff,st.handoffEnd-.005,t),layer:1-lt(st.handoffEnd-.004,1,t),orbitNormals:[ms(0,t),ms(1,t)],omega:O0(t)}}const H0=`
${bc}
in vec3 aGeo;
in vec4 aSkin;   // whale, spine, part, dissolve key
in vec3 aOff;
in vec4 aMeta;   // kind (0–2 land relief band, 3 graticule), seed, departure, travel time
uniform mat4 uModel[2];
uniform vec3 uAxis[2];
uniform float uP;
uniform float uOmega;
uniform mat3 uEarth;
uniform vec3 uCamPos;
uniform vec2 uCanvas;
uniform vec3 uGlobe;     // centre x, y and radius (CSS px)
uniform float uOrtho;
uniform float uOcc;
uniform float uDpr;
uniform vec2 uCellPx;    // glyph cell (CSS px)
uniform float uFlight[8];
uniform vec3 uInk;
uniform vec3 uBand[3];
uniform vec3 uGrat;
uniform float uDotScale;
out float vAlpha;
out vec3 vColor;
out float vGlyph;
out float vDot;
out float vBox;

vec3 rotAxis(vec3 v, vec3 k, float a) {
  return v * cos(a) + cross(k, v) * sin(a) + k * dot(k, v) * (1.0 - cos(a));
}

void main() {
  float age = uP - aMeta.z;
  if (age <= 0.0) { gl_Position = vec4(2.0, 2.0, 2.0, 1.0); gl_PointSize = 0.0; return; }
  float tau = clamp(age / aMeta.w, 0.0, 1.0);
  // Wake glyphs linger along the orbit (a trail behind the flukes) before they settle
  float hold = aMeta.x > 2.5 ? 0.4 : 0.0;
  float te = clamp((tau - hold) / (1.0 - hold), 0.0, 1.0);
  float e = te * te * (3.0 - 2.0 * te);
  int w = aSkin.x > 0.5 ? 1 : 0;
  vec3 axis = normalize(uAxis[w]);

  // Where it left the whale: the posed skin point, carried back along the orbit by the angle
  // the whale has swum since (so it hangs in the wake instead of riding along)
  vec3 p; vec3 n; vec3 tg;
  skinWhale(aSkin.y, aOff, vec3(0.0, 1.0, 0.0), aSkin.z, w * ${us}, p, n, tg);
  vec3 S = (uModel[w] * vec4(p, 1.0)).xyz;
  S = rotAxis(S, axis, -uOmega * age);

  // Where it settles: its dot on the turning Earth
  vec3 D = uEarth * aGeo;

  // The path spirals forward around the orbit's axis while it moves to the dot's latitude
  vec3 e1 = normalize(abs(axis.z) < 0.9 ? cross(axis, vec3(0.0, 0.0, 1.0)) : cross(axis, vec3(1.0, 0.0, 0.0)));
  vec3 e2 = cross(axis, e1);
  float rS = length(S);
  vec3 sS = S / max(rS, 1e-4);
  float phS = atan(dot(sS, e2), dot(sS, e1));
  float phD = atan(dot(D, e2), dot(D, e1));
  float laS = asin(clamp(dot(sS, axis), -1.0, 1.0));
  float laD = asin(clamp(dot(D, axis), -1.0, 1.0));
  float dph = mod(phD - phS, 6.2831853);
  float ph = phS + dph * e;
  float la = mix(laS, laD, smoothstep(0.0, 0.85, e));
  float r = mix(rS, 1.0, pow(e, 0.75));
  vec3 X = r * (cos(la) * (cos(ph) * e1 + sin(ph) * e2) + sin(la) * axis);

  vec4 clip = projectionMatrix * viewMatrix * vec4(X, 1.0);
  vec3 ndc = clip.xyz / clip.w;
  float settled = smoothstep(0.72, 1.0, tau);
  // Settled dots slide onto the Globe's orthographic framing (JourneyGlobe's projection)
  float k = uOrtho * settled;
  vec2 opx = uGlobe.xy + uGlobe.z * vec2(D.x, -D.y);
  vec2 ondc = vec2(opx.x / uCanvas.x * 2.0 - 1.0, 1.0 - opx.y / uCanvas.y * 2.0);
  gl_Position = vec4(mix(ndc.xy, ondc, k), 0.0, 1.0);

  // In flight: a glyph in whale ink, hidden while the forming sphere stands in front of it
  float occluded = 0.0;
  vec3 toX = X - uCamPos;
  float lx = length(toX);
  vec3 dir = toX / lx;
  float tc = dot(-uCamPos, dir);
  float h2 = dot(uCamPos, uCamPos) - tc * tc;
  if (h2 < 0.995 && tc - sqrt(0.995 - h2) < lx - 0.02) occluded = 1.0;
  float flight = 0.72 * (1.0 - uOcc * occluded);

  // Settled: the Globe's own dot — limb-faded alpha in its four buckets and relief colour
  float facing = mix(dot(normalize(D), normalize(uCamPos)), D.z, k);
  float rest = 0.0;
  float dotPx = 1.0;
  vec3 restCol = uGrat;
  if (aMeta.x < 2.5) {
    float limb = clamp((facing - 0.14) / 0.3, 0.0, 1.0);
    float al = (0.2 + facing * 0.65) * limb;
    int b = int(min(3.0, floor(al * 4.5)));
    rest = facing > 0.14 ? (b == 0 ? 0.13 : b == 1 ? 0.34 : b == 2 ? 0.56 : 0.78) : 0.0;
    dotPx = (0.75 + max(facing, 0.0)) * uDotScale;
    int band = int(aMeta.x + 0.5);
    restCol = band == 0 ? uBand[0] : band == 1 ? uBand[1] : uBand[2];
  } else {
    rest = facing > 0.0 ? mix(0.42, 0.16, uOrtho) * smoothstep(0.0, 0.25, facing) : 0.0;
    dotPx = 1.15;
  }
  vAlpha = mix(flight, rest, settled);
  vColor = mix(uInk, restCol, settled);
  vDot = settled;
  vGlyph = uFlight[int(floor(aMeta.y * 7.999))];
  vBox = uCellPx.x / uCellPx.y;
  gl_PointSize = max(1.0, mix(uCellPx.y, dotPx, settled) * uDpr);
}
`,V0=`
precision highp float;
uniform sampler2D uAtlas;
uniform vec2 uTile;
uniform float uAtlasCols;
uniform float uLayer;
in float vAlpha;
in vec3 vColor;
in float vGlyph;
in float vDot;
in float vBox;
out vec4 outColor;
void main() {
  vec2 pc = gl_PointCoord;
  float ga = 0.0;
  float u = (pc.x - 0.5) / vBox + 0.5;
  if (u >= 0.0 && u < 1.0) {
    vec2 tile = vec2(mod(vGlyph, uAtlasCols), floor(vGlyph / uAtlasCols));
    ga = texelFetch(uAtlas, ivec2((tile + vec2(u, pc.y)) * uTile), 0).a;
  }
  float a = mix(ga, 1.0, smoothstep(0.55, 1.0, vDot)) * vAlpha * uLayer;
  if (a < 0.004) discard;
  outColor = vec4(vColor * a, a);
}
`,W0=`
void main() { gl_Position = vec4(position.xy, 0.0, 1.0); }
`,X0=`
precision highp float;
uniform vec2 uCanvasDev;
uniform float uDpr;
uniform vec3 uDisc;      // centre x, y, radius (CSS px)
uniform float uAlpha;
out vec4 outColor;
void main() {
  vec2 P = vec2(gl_FragCoord.x, uCanvasDev.y - gl_FragCoord.y) / uDpr;
  vec2 c1 = uDisc.xy;
  float R = uDisc.z;
  float d = length(P - c1);
  if (d > R + 1.0) discard;
  vec2 c0 = c1 + vec2(-0.3, -0.35) * R;
  float r0 = 0.1 * R;
  vec2 cd = c1 - c0;
  float dr = R - r0;
  vec2 pd = P - c0;
  float a = dot(cd, cd) - dr * dr;
  float b = dot(pd, cd) + r0 * dr;
  float c = dot(pd, pd) - r0 * r0;
  float t = clamp((b + sqrt(max(0.0, b * b - a * c))) / a, 0.0, 1.0);
  vec4 col = mix(vec4(249.0, 248.0, 245.0, 0.95 * 255.0), vec4(231.0, 235.0, 236.0, 0.95 * 255.0), t) / 255.0;
  float fill = clamp(R - d + 0.5, 0.0, 1.0);
  // Hairline limb
  float ring = clamp(1.0 - abs(d - R) * uDpr, 0.0, 1.0);
  vec4 limb = vec4(31.0, 59.0, 87.0, 0.22 * 255.0) / 255.0;
  float af = col.a * fill;
  vec3 rgb = col.rgb * af;
  float al = af;
  float la = limb.a * ring;
  rgb = limb.rgb * la + rgb * (1.0 - la);
  al = la + al * (1.0 - la);
  outColor = vec4(rgb, al) * uAlpha;
}
`,q0=["·",".",":","·","+","'","-","."],Y0=[[86,99,109],[60,72,82],[38,49,58]],ia=n=>new N(n[0]/255,n[1]/255,n[2]/255);function K0(n,e){const t=Nl(n,e),{east:i,north:s}=Wc(t);return new Ne().set(i[0],i[1],i[2],s[0],s[1],s[2],t[0],t[1],t[2])}function $0(n,e,t){const i=t??new wc(n,{maxWhales:2,gbufferScale:.75});let s={width:1,height:1,globeX:0,globeY:0,globeR:1},r=1;const a=K0(e.lon,e.lat),o=new Ne,l=new Ne,c=new N,u=new Ki,f=new N,d=new wt({glslVersion:zn,vertexShader:W0,fragmentShader:X0,transparent:!0,blending:hs,blendSrc:fs,blendDst:ui,depthTest:!1,depthWrite:!1,uniforms:{uCanvasDev:{value:new Ve},uDpr:{value:1},uDisc:{value:new N},uAlpha:{value:0}}}),m=new Vt(new $i(2,2),d);m.frustumCulled=!1,i.underlay.add(m);const _=new wt({glslVersion:zn,vertexShader:H0,fragmentShader:V0,transparent:!0,blending:hs,blendSrc:fs,blendDst:ui,depthTest:!1,depthWrite:!1,uniforms:{uSkin:{value:i.skinTexture},...i.pivotUniforms,uModel:{value:[new rt,new rt]},uAxis:{value:[new N(0,1,0),new N(0,1,0)]},uP:{value:0},uOmega:{value:0},uEarth:{value:l},uCamPos:{value:new N},uCanvas:{value:new Ve},uGlobe:{value:new N},uOrtho:{value:0},uOcc:{value:0},uDpr:{value:1},uCellPx:{value:new Ve(6,10)},uFlight:{value:q0.map(ht)},uInk:{value:ia([31,59,87])},uBand:{value:Y0.map(ia)},uGrat:{value:ia([31,59,87])},uDotScale:{value:1},uAtlas:{value:null},uTile:{value:new Ve(1,1)},uAtlasCols:{value:8},uLayer:{value:1}}}),v=new t0(new rn,_);v.frustumCulled=!1,i.overlay.add(v);const p=(S,g)=>{const P=Mc(7),b=[],w=[],D=(Q,re)=>{const be=Nl(Q,re);b.push(be[0],be[1],be[2]),w.push(3)};for(let Q=-180;Q<180;Q+=30)for(let re=-78;re<=78;re+=3)D(Q,re);for(let Q=-60;Q<=60;Q+=30)for(let re=-180;re<180;re+=3)D(re,Q);const E=w.length;if(S&&g)for(let Q=0;Q<3;Q++)for(let re=g[Q];re<g[Q+1];re++)b.push(S[re*3],S[re*3+1],S[re*3+2]),w.push(Q);const M=w.length,C=El(4096,11),H=El(1024,12,(Q,re)=>Q[re*4]===Ui),F=new Float32Array(b),W=new Float32Array(M*4),$=new Float32Array(M*3),k=new Float32Array(M*4),j=a.elements,V=(Q,re,be,Fe)=>{const B=ms(Q,re),Z=Math.abs(B[2])<.9?[B[1],-B[0],0]:[0,B[2],-B[1]],ce=Math.hypot(Z[0],Z[1],Z[2]),ee=[Z[0]/ce,Z[1]/ce,Z[2]/ce],ye=[B[1]*ee[2]-B[2]*ee[1],B[2]*ee[0]-B[0]*ee[2],B[0]*ee[1]-B[1]*ee[0]],Ce=me=>Math.atan2(me[0]*ye[0]+me[1]*ye[1]+me[2]*ye[2],me[0]*ee[0]+me[1]*ee[1]+me[2]*ee[2]),te=Dc(Fe),oe=F[be*3],ve=F[be*3+1],De=F[be*3+2],R=Math.cos(te)*oe-Math.sin(te)*ve,Oe=Math.sin(te)*oe+Math.cos(te)*ve,he=[j[0]*R+j[3]*Oe+j[6]*De,j[1]*R+j[4]*Oe+j[7]*De,j[2]*R+j[5]*Oe+j[8]*De];return((Ce(he)-Ce(Pc(Q,re)))%(2*Math.PI)+2*Math.PI)%(2*Math.PI)};for(let Q=0;Q<M;Q++){const re=P(),be=Q<E,Fe=be?H:C,B=Math.floor(P()*Fe.count),Z=Fe.info[B*4+3],ce=be?st.sphere+.02+P()*(st.dissolve-st.sphere+.02):st.dissolve+(1-Math.min(1,Z))*st.dissolveSpan*.97+(re-.5)*.012,ee=ce+.08,ye=V(0,ce,Q,ee),Ce=V(1,ce,Q,ee),te=ye<=Ce?0:1,oe=Math.min(ye,Ce),ve=be?.1+oe/52+.03*P():Math.min(.955-.012-ce,.032+oe/44+.012*P());W.set([te,Fe.spine[B],Fe.info[B*4],Z],Q*4),$.set([Fe.offset[B*3],Fe.offset[B*3+1],Fe.offset[B*3+2]],Q*3),k.set([w[Q],re,ce,Math.max(.02,ve)],Q*4)}const ne=new rn;ne.setAttribute("position",new ut(F,3)),ne.setAttribute("aGeo",new ut(F,3)),ne.setAttribute("aSkin",new ut(W,4)),ne.setAttribute("aOff",new ut($,3)),ne.setAttribute("aMeta",new ut(k,4)),v.geometry.dispose(),v.geometry=ne};p(null,null);let h=!1;Vc().then(S=>{h||p(S.xyz,S.bands)}).catch(()=>{});const A={setView(S,g){s=S,r=g,i.resize(S.width,S.height,g),i.setStyle({mode:"shape",cellW:6,cellH:10})},render(S){i.setStyle({...Et,invert:!1});const g=Lc(S,s);g.whales.forEach((k,j)=>i.setWhale(j,{visible:k.visible,position:k.position,quaternion:k.quaternion,scale:k.scale,articulation:k.articulation,dissolve:k.dissolve}));const P=i.camera;P.fov=g.camera.fov,P.position.set(...g.camera.position),P.up.set(...g.camera.up),P.lookAt(0,0,0);const b=s.width,w=s.height;P.setViewOffset(b,w,b/2-g.camera.centerX,w/2-g.camera.centerY,b,w),P.updateProjectionMatrix(),i.setOccluder([0,0,0],1,g.occlusion),i.setStyle({opacity:g.layer});const D=Math.cos(g.spin),E=Math.sin(g.spin);o.set(D,-E,0,E,D,0,0,0,1),l.multiplyMatrices(a,o);const M=_.uniforms,C=i.glyphs;M.uP.value=g.p,M.uOmega.value=g.omega,M.uCamPos.value.copy(P.position),M.uCanvas.value.set(b,w),M.uGlobe.value.set(s.globeX,s.globeY,s.globeR),M.uOrtho.value=g.ortho,M.uOcc.value=g.occlusion,M.uDpr.value=r,M.uCellPx.value.set(i.style.cellW,i.style.cellH),M.uDotScale.value=Math.max(.75,Math.min(1.6,s.globeR/300)),M.uAtlas.value=C.texture,M.uTile.value.set(C.tileW,C.tileH),M.uAtlasCols.value=C.cols,M.uLayer.value=g.layer;for(let k=0;k<2;k++){const j=g.whales[k];M.uModel.value[k].compose(c.set(...j.position),u.set(...j.quaternion),f.setScalar(j.scale)),M.uAxis.value[k].set(...g.orbitNormals[k])}v.visible=g.p>st.sphere;const H=d.uniforms,F=Math.tan(P.fov/2*(Math.PI/180)),W=P.position.length(),$=w/2/F/Math.sqrt(Math.max(.001,W*W-1));return H.uCanvasDev.value.set(Math.round(b*r),Math.round(w*r)),H.uDpr.value=r,H.uDisc.value.set(g.camera.centerX,g.camera.centerY,$+(s.globeR-$)*g.ortho),H.uAlpha.value=g.disc*g.layer,m.visible=g.disc>.001,i.render(),{globeReveal:g.globeReveal,layer:g.layer}},clear(){i.clear()},finish(){const S=i.renderer.getContext(),g=new Uint8Array(4);S.readPixels(0,0,1,1,S.RGBA,S.UNSIGNED_BYTE,g)},get lost(){return i.lost},onContextLost:null,destroy(){h=!0,v.geometry.dispose(),_.dispose(),m.geometry.dispose(),d.dispose(),i.overlay.remove(v),i.underlay.remove(m),t||i.dispose()}};return t||(i.onContextLost=()=>{var S;return(S=A.onContextLost)==null?void 0:S.call(A)}),A}const wl=2.4,Z0=.9,ja=Math.PI*2,gs=(n,e)=>(n%e+e)%e,gt=(n,e,t)=>Math.max(e,Math.min(t,n));function _s(n,e){const t=Math.max(1,n),i=Math.max(1,e),s=Z0*Math.min(1.45*t,1.7*i,Math.max(1.12*t,.95*i)),r=i/(2*s);return{z:wl,fov:2*Math.atan(r/wl)*180/Math.PI,halfW:t/(2*s),halfH:r,px:s}}const j0=(n,e)=>n.halfH*(n.z-e)/n.z;let sa=null;function J0(){if(sa)return sa;const n=Sr(),e=new Map;for(let s=0;s<n.vertexCount;s++){const r=n.info[s*4],a=r===cs||r===cr?`b${Math.floor(n.spine[s]/Wt*14)}`:`p${r}`;e.has(a)||e.set(a,[]),e.get(a).push(s)}const t=[];for(const s of[-1,0,1])for(const r of[-1,0,1])for(const a of[-1,0,1])(s||r||a)&&t.push([s,r,a]);const i=new Set;for(const[s,r]of e){const a=s[0]==="b"?t.filter(o=>o[2]===0):t;for(const o of a){let l=r[0],c=-1/0;for(const u of r){const f=n.rest[u*3]*o[0]+n.rest[u*3+1]*o[1]+n.rest[u*3+2]*o[2];f>c&&(c=f,l=u)}i.add(l)}}return sa=[...i]}function Q0(n,e){const t=Sr(),i=Ac(n.articulation);let s=1/0,r=-1/0,a=1/0,o=-1/0;for(const l of J0()){const c=T0(i,t,l),u=Ft(n.quaternion,[c[0]*n.scale,c[1]*n.scale,c[2]*n.scale]),f=Math.max(.2,e.z-(u[2]+n.position[2])),d=(u[0]+n.position[0])*e.z/(f*e.halfW),m=(u[1]+n.position[1])*e.z/(f*e.halfH);d<s&&(s=d),d>r&&(r=d),m<a&&(a=m),m>o&&(o=m)}return[s,r,a,o]}const Rl=.05,Cl=.3,eg=.42,tg=.12,ng=.2,ig=.12,Pl=[-.42,-.12],Dl=[.12,.42];function Ll(n,e,t,i,s=i){const r=e+Rl+n*(.5-i),a=t-Rl-n*(.5-s);return r<=a?[r,a]:[(r+a)/2,(r+a)/2]}function Il(n,e,t,i){const[s,r]=t,a=(r-e)/Cl,o=(e-s)/Cl;n>0?n*=Wn(a):n<0&&(n*=Wn(o));const l=Math.max(0,e-r)-Math.max(0,s-e);return n-gt(l*i*1.6,-.3,.3)*Wn(Math.abs(l)/.05)}const Wn=n=>{const e=gt(n,0,1);return e*e*e*(e*(e*6-15)+10)},dr=(n,e,t,i)=>Wn((n-e)/i)*(1-Wn((n-t)/i)),sg=n=>dr(gs(n,263),115,166,18),rg=n=>dr(gs(n,211),60,96,16),ag=[290,230],og=[200,150],lg=(n,e)=>ja*Wn((gs(e+n*79,ag[n])-og[n])/20),co=[1,.9],cg=[.62,.55],ug=[.065,.028],Ic=(n,e)=>n===0?dr(gs(e,71),28,52,8):dr(gs(e+23,53),30,41,6),hg=[1.6,1.9],fg=[1.4,1.6],dg=n=>.7+1.45*Math.min(1,Math.abs(n)),pg=[.7,.95],mg=[.9,1.25],gg=1.6,_g=[.42,-.5],vg=[.42,.5],Uc=2.2,pr=.8,Ul=65*Math.PI/180;function ra(n,e,t){const i=_s(t.width,t.height),s=t.lanes[n]??{x:.5,y:.5},r=gt(t.weight,0,1)*.68,a=(s.x-.5)*2*i.halfW*r,o=((.5-(n===0?.6:.38))*(1-r)+(.5-s.y)*r)*2*i.halfH,l=(i.halfW*.78+.1)*(1-.45*r);let c,u,f;if(n===0){const d=e*ja/70+.55,m=rg(e);c=a+l*Math.sin(d)+.04*Math.sin(e*.021),u=o+.22*i.halfH*Math.sin(d*.61+.4)-.5*m,f=-.05+.4*Math.cos(d)-.3*m}else{const d=e*ja/50+3.1;c=a+.85*l*Math.sin(d)+.18*Math.sin(d*2.2+.7),u=o+.34*i.halfH*Math.sin(d*.73+1.7)+.06*Math.sin(d*2.9),f=-.45+.32*Math.cos(d)+.12*Math.sin(d*1.6+.3)}if(Number.isFinite(t.surfaceY)){const d=(.5-t.surfaceY/Math.max(1,t.height))*2*i.halfH-.16;u=d-Math.log1p(Math.exp((d-u)*12))/12}return[c,u,f]}function hn(n,e,t){const i=ra(n,e,t);if(n===0)return i;const s=_s(t.width,t.height),r=ra(0,e,t),a=ra(0,e-9,t),o=sg(e);i[0]+=(a[0]+.2*s.halfW*Math.sin(e*.12)-i[0])*o,i[1]+=(a[1]+.24-i[1])*o,i[2]+=(a[2]-.6-i[2])*o;const l=Nt(i,r),c=Xt(l),u=Math.log1p(Math.exp((.95-c)*4))/4,f=qt([l[0],l[1],l[2]-.1]);return[i[0]+f[0]*u,i[1]+f[1]*u,i[2]+f[2]*u]}const xg=(n=0)=>({s:0,sv:0,drift:[0,0],dv:[0,0],da:[0,0],di:[0,0],side:[0,0],sideV:[0,0],deep:[0,0],deepV:[0,0],roll:[n,n],swim:[0,0],fwd:[null,null],spin:[[0,0,0],[0,0,0]],up:[[0,1,0],[0,1,0]],bend:[[0,0],[0,0]],att:[[0,0,0,0],[0,0,0,0]],bank:[[0,0],[0,0]],ahead:0,surge:0}),Mg=.2,uo=(n,e)=>n.di[e]+(n.dv[e]-n.di[e])*Mg,Nc=n=>1+gg*Math.min(1,Math.abs(n)),Sg=(n,e,t)=>gt(-Pt(n,e)*Uc*(1+.35*Math.max(0,t)-.15*Math.max(0,-t)),-pr,pr),aa=(n,e,t=ps)=>{let i=Nt(n,ot(e,Pt(n,e)));return Xt(i)<1e-5&&(i=Nt(t,ot(e,Pt(t,e)))),qt(i)};function vs(n,e,t,i,s){const a=hn(n,e-1.2,t),o=hn(n,e+1.2,t),l=ot(Nt(o,a),Nc(s)/(2*1.2));l[2]*=1-.55*Math.min(1,Math.abs(s)),l[1]+=i;const c=Math.hypot(l[0],l[2]),u=dg(s);return Math.abs(l[1])>u*c&&(l[1]=Math.sign(l[1])*u*c),l}function yg(n,e,t,i,s){const r=Math.atan2(t[0],-t[2]),a=Math.asin(gt(t[1],-1,1)),o=n.att[e];if(!n.fwd[e]){o[0]=r,o[1]=a,o[2]=0,o[3]=0,n.fwd[e]=t,n.spin[e]=[0,0,0],n.up[e]=aa(nn,t);return}n.fwd[e];const l=Math.min(1,Math.abs(s)),c=2.2*(1+.4*l),u=pg[e]*(1+.2*l),f=mg[e]*(1+.5*l),d=Math.atan2(Math.sin(r-o[0]),Math.cos(r-o[0])),m=a-o[1],_=Math.cos(o[1]);let v=c*c*d-2*c*o[2],p=c*c*m-2*c*o[3];const h=Math.hypot(v*_,p);h>f&&(v*=f/h,p*=f/h);const A=2*(Math.hypot(o[2]*_,o[3])/u)**2;v-=A*o[2],p-=A*o[3];let S=o[2]+v*i,g=o[3]+p*i;const P=Math.hypot(S*_,g);P>u&&(S*=u/P,g*=u/P),o[0]+=S*i,o[1]=gt(o[1]+g*i,-Ul,Ul),o[2]=S,o[3]=g;const b=Math.cos(o[1]),w=Math.sin(o[1]),D=Math.cos(o[0]),E=Math.sin(o[0]),M=[b*E,w,-b*D],C=[b*D*S-w*E*g,b*g,b*E*S+w*D*g],H=kn(M,C);let F=n.up[e];const W=Xt(H)*i;if(W>0){const Q=qt(H),re=Math.cos(W),be=Math.sin(W);F=tn(tn(ot(F,re),ot(kn(Q,F),be)),ot(Q,Pt(Q,F)*(1-re)))}n.fwd[e]=M,n.spin[e]=H,F=aa(F,M,nn);const $=aa(nn,M,F),k=Math.atan2(Pt(kn(F,$),M),Pt(F,$)),j=gt(k,-1,1)*.6*b*i,V=Math.cos(j),ne=Math.sin(j);n.up[e]=qt(tn(ot(F,V),ot(kn(M,F),ne)))}function Eg(n,e,t,i,s){var S;if(!(t>0))return;const r=_s(s.width,s.height),a=gt(e,-1,1),l=a*n.s>=0&&Math.abs(a)<Math.abs(n.s)?1.3:3.4;n.sv+=(l*l*(a-n.s)-2*l*n.sv)*t,n.s+=n.sv*t;const c=n.s,u=gt(Math.tanh(c/.15)*n.sv,-1,1);n.surge+=(u-n.surge)*(1-Math.exp(-t/.35));const f=Nc(c);n.ahead+=(f-1)*t;const d=i+n.ahead,m=Number.isFinite(s.surfaceY)?gt(1-2*s.surfaceY/Math.max(1,s.height),-.2,1):1,_=[0,1].map(g=>tn(hn(g,d,s),[n.side[g],n.drift[g],n.deep[g]])),v=Nt(_[1],_[0]),p=[2.5*v[0],v[1],2*v[2]],h=Xt(p)>1e-4?qt(p):[0,0,-1],A=Math.min(.5,2.2*Math.log1p(Math.exp((.95-Xt(v))*5))/5);for(let g=0;g<2;g++){const P=(g===0?-.6:1)*A,b=hn(g,d-.6,s),w=hn(g,d+.6,s),D=hn(g,d,s),E=Math.hypot(w[0]-b[0],w[2]-b[2])/1.2*f,M=(w[0]-b[0])/1.2*f,C=(w[1]-b[1])/1.2*f,[H,F,W,$]=Q0(Oc(g,i,s,n),r),k=j0(r,D[2]+n.deep[g]),j=k*r.halfW/r.halfH,V=c>=0?hg[g]:fg[g];let ne=-c*V*Math.max(E,.05)*(1+.5*Math.abs(c))-C*Math.min(1,1.8*Math.abs(c));const Q=1-Math.min(1,Math.abs(c)/.2);ne-=gt(n.drift[g]*.1,-.03,.03)*Q,ne+=gt(((S=s.avoid)==null?void 0:S[g])??0,-.07,.07)*Q,ne+=h[1]*P;const re=(ne-n.di[g])/.45;n.di[g]+=re*t;const be=Math.min(1,Math.abs(c)),Fe=ng*be,B=tg+ig*Math.min(1,A/.25),Z=Ll($-W,-1,m,B+(c>0?Fe:0),B+(c<0?Fe:0)),ce=Wn(be/.6);c>0&&Pl[g]>Z[0]&&(Z[0]=Math.min(Z[1],Z[0]+(Pl[g]-Z[0])*ce)),c<0&&Dl[g]<Z[1]&&(Z[1]=Math.max(Z[0],Z[1]+(Dl[g]-Z[1])*ce));const ee=Il(C+n.di[g],(W+$)/2,Z,k)-C;n.da[g]=(ee-n.dv[g])/t,n.dv[g]=ee,n.drift[g]+=ee*t;const ye=-gt(n.side[g]*.2,-.035,.035),Ce=Il(M+ye+h[0]*P,(H+F)/2,Ll(F-H,-1,1,eg),j)-M;n.sideV[g]+=(Ce-n.sideV[g])*(1-Math.exp(-t/.3)),n.side[g]+=n.sideV[g]*t;const te=Math.min(0,.05-D[2])*be;let oe=Math.min(0,h[2]*P)-gt((n.deep[g]-te)*.25,-.06,.06);oe>0&&(oe*=Wn((.45-D[2]-n.deep[g])/.25)),n.deepV[g]+=(oe-n.deepV[g])*(1-Math.exp(-t/.4)),n.deep[g]+=n.deepV[g]*t;const ve=uo(n,g);n.roll[g]+=t*(1+1.4*Math.max(0,c)-.45*Math.max(0,-c)),n.swim[g]+=t*(ug[g]*(1-.65*Ic(g,d))+Math.hypot(E,C+ve))/co[g],yg(n,g,qt(vs(g,d,s,ve,c)),t,c);const[De,R]=Fc(g,d,s,n),Oe=1-Math.exp(-t/.45);n.bend[g]=[n.bend[g][0]+(De-n.bend[g][0])*Oe,n.bend[g][1]+(R-n.bend[g][1])*Oe];const he=n.bank[g],Re=n.fwd[g],me=gt(kn(Re,n.up[g])[2]*3,-1,1),Ie=Sg(n.spin[g],n.up[g],c)+_g[g]*n.att[g][3]+vg[g]*c*me,Se=1.5,T=.75;he[1]+=(Se*Se*(Ie-he[0])-2*T*Se*he[1])*t,he[0]+=he[1]*t}}function Fc(n,e,t,i){const r=hn(n,e,t),a=hn(n,e-1.2,t),o=hn(n,e+1.2,t),l=i?vs(n,e,t,uo(i,n),i.s):vs(n,e,t,0,0),c=ot([o[0]+a[0]-r[0]*2,o[1]+a[1]-r[1]*2,o[2]+a[2]-r[2]*2],1/(1.2*1.2));c[1]+=(i==null?void 0:i.da[n])??0;const u=Math.max(.005,Xt(l)),f=(i==null?void 0:i.fwd[n])??qt(l),d=ur(f,i?i.up[n]:nn),m=co[n],_=u*u+(.08*m)**2,v=i==null?void 0:i.spin[n],p=v?ot(kn(v,f),Math.sqrt(_)):c;return[gt(Pt(p,Ft(d,qn))*m/_,-.65,.65),gt(Pt(p,Ft(d,nn))*m/_,-.42,.42)]}function Oc(n,e,t,i){const s=e+((i==null?void 0:i.ahead)??0),r=hn(n,s,t),a=(i==null?void 0:i.s)??0,o=i?vs(n,s,t,uo(i,n),a):vs(n,s,t,0,0),l=Math.max(.005,Xt(o)),c=(i==null?void 0:i.fwd[n])??qt(o),u=i?i.up[n]:nn,f=co[n],[d,m]=i?i.bend[n]:Fc(n,s,t),_=i?i.bank[n][0]:gt(d*(l/f)*Uc,-pr,pr),v=_+lg(n,(i==null?void 0:i.roll[n])??e),p=Ic(n,s),h=i?i.surge:0,A=((.45+Math.min(.45,l/f*2.8))*(1-.92*p)+.4*Math.abs(a))*(1+.45*Math.min(0,h))+.55*Math.max(0,h),S=yc({distance:i?i.swim[n]:e*(n===0?.115:.135),effort:A,turn:d,climb:m,bank:_,phase:n*2.3,stride:cg[n]}),g=ur(c,u,v),P=S.stroke,b=.013*f*S.amplitude*Math.sin(P-2.4),w=.028*S.amplitude*Math.sin(P-1.2),D=Ft(g,nn);return{position:[r[0]+((i==null?void 0:i.side[n])??0)+D[0]*b,r[1]+((i==null?void 0:i.drift[n])??0)+D[1]*b,r[2]+((i==null?void 0:i.deep[n])??0)+D[2]*b],quaternion:oi(Vi(Vn(Ft(g,qn),w),g)),scale:f,bank:v,articulation:S}}const _t=(n,e,t)=>n+(e-n)*t,Fn=(n,e)=>Number.isFinite(n)?n:e;function Tg(n,e,t){const i=(r,a)=>({sweep:_t(r.sweep,a.sweep,t),dihedral:_t(r.dihedral,a.dihedral,t),twist:_t(r.twist,a.twist,t)}),s=Math.atan2(Math.sin(e.stroke-n.stroke),Math.cos(e.stroke-n.stroke));return{stroke:n.stroke+s*t,amplitude:_t(n.amplitude,e.amplitude,t),bendYaw:_t(n.bendYaw,e.bendYaw,t),bendPitch:_t(n.bendPitch,e.bendPitch,t),flipperL:i(n.flipperL,e.flipperL),flipperR:i(n.flipperR,e.flipperR),fluke:_t(n.fluke,e.fluke,t),flukeFlex:_t(n.flukeFlex,e.flukeFlex,t)}}function wg(n){var Ce;const e=document.createElement("canvas");e.className="absolute inset-0 w-full h-full block pointer-events-none",e.dataset.whaleRenderer="shared-3d",n.appendChild(e);let t;try{t=new wc(e,{gbufferScale:innerWidth<768?.5:.65})}catch{return e.remove(),()=>{}}let i=null,s="",r=!1,a=0,o=performance.now(),l=0,c=0,u=!0,f=0,d=0,m=innerWidth<768?.5:.65,_="",v=null,p=[],h=0,A=null,S=!1;const g=matchMedia("(prefers-reduced-motion: reduce)"),P=()=>g.matches||S,b=()=>Math.max(1,innerWidth||1),w=()=>Math.max(1,innerHeight||1),D=[0,0],E={width:b(),height:w(),weight:Fn(Rn.weight,0),lanes:Rn.lanes.map(te=>({...te})),surfaceY:Rn.surfaceY,avoid:D},M=(te,oe,ve,De,R)=>{let Oe=0;for(const he of te){const Re=Math.min(De,he.left+he.width)-Math.max(oe,he.left),me=Math.min(R,he.top+he.height)-Math.max(ve,he.top);Re>0&&me>0&&(Oe+=Re*me)}return Math.min(1,Oe/Math.max(1,(De-oe)*(R-ve)))},C=te=>{const oe=qc.read();for(let ve=0;ve<2;ve++){const De=Cn.spines[ve];let R=1/0,Oe=1/0,he=-1/0,Re=-1/0;for(let Ie=10;Ie<=30;Ie++){const Se=De[Ie*2],T=De[Ie*2+1];!Number.isFinite(Se)||!Number.isFinite(T)||(R=Math.min(R,Se),he=Math.max(he,Se),Oe=Math.min(Oe,T),Re=Math.max(Re,T))}let me=0;if(he>R&&oe.length){const Ie=.08*_s(b(),w()).px;if(R=Math.max(0,R-Ie),he=Math.min(b(),he+Ie),Oe-=Ie,Re+=Ie,he>R&&Re>0&&Oe<w()){const Se=w()*.3,T=M(oe,R,Oe,he,Re),x=M(oe,R,Oe-Se,he,Re-Se),O=M(oe,R,Oe+Se,he,Re+Se);me=Math.max(-1,Math.min(1,(O-x)*4))*.07*Math.min(1,T/.12)}}D[ve]=Fn(D[ve]+(me-D[ve])*(1-Math.exp(-te/1.2)),0)}},H=xg(0);let F=scrollY,W=0;const $=()=>Bt.listeners.forEach(te=>te()),k=()=>{const te=!!i&&!!$t.host&&!t.lost&&!P();Bt.ready!==te&&(Bt.ready=te,$())},j=()=>{const te=$t.host.getBoundingClientRect(),{cx:oe,cy:ve,baseR:De}=Kc(te.width,te.height);return{r:te,view:{width:te.width,height:te.height,globeX:oe,globeY:ve,globeR:De*1.08}}},V=()=>{const te=$t.firstCity;te&&$t.host&&s!==`${te.lon}:${te.lat}`&&(i==null||i.destroy(),i=$0(e,te,t),s=`${te.lon}:${te.lat}`),k()},ne=(te,oe,ve)=>{const De=Math.min(devicePixelRatio||1,te<768?1:1.25),R=`${te}:${oe}:${De}:${ve}`;return R===_?!1:(_=R,t.resize(te,oe,De),t.setStyle({mode:"shape",cellW:6,cellH:10}),!0)},Q=()=>{t.camera.updateMatrixWorld();const te=new N;p.forEach((oe,ve)=>{const De=Ac(oe.articulation);for(let R=0;R<48;R++){const Oe=Ft(oe.quaternion,[De.p[R*4]*oe.scale,De.p[R*4+1]*oe.scale,De.p[R*4+2]*oe.scale]);te.set(Oe[0]+oe.position[0],Oe[1]+oe.position[1],Oe[2]+oe.position[2]).project(t.camera),Cn.spines[ve][R*2]=(te.x+1)*innerWidth/2,Cn.spines[ve][R*2+1]=(1-te.y)*innerHeight/2}})},re=te=>{const oe=scrollY,ve=Math.max(-w()*.25,Math.min(w()*.25,Fn(oe-F,0)));F=oe;const De=te>0?ve/te:0;W=Fn(W+(De-W)*(1-Math.exp(-te/.12)),0),C(te),Eg(H,Math.tanh(W/(w()*.6)),te,c,E)},be=(te,oe)=>{e.parentElement!==n&&n.appendChild(e),ne(b(),w(),!1);const ve=P()?1:1-Math.exp(-te*1.3);E.width=b(),E.height=w(),E.weight=Fn(E.weight+(Fn(Rn.weight,0)-E.weight)*ve,0),E.lanes.forEach((Y,q)=>{const fe=Rn.lanes[q]??Y;Y.x=Fn(Y.x+(fe.x-Y.x)*ve,.5),Y.y=Fn(Y.y+(fe.y-Y.y)*ve,.5)}),E.surfaceY=Rn.surfaceY;const De=P()?void 0:H,R=[0,1].map(Y=>({...Oc(Y,c,E,De),dissolve:0,visible:!0}));(oe<=0||!v)&&(v=R),p=oe>0?v.map(Y=>({...Y})):R;const Oe=_s(b(),w()),he=t.camera,Re=P()?0:1-oe,me=.05*Math.sin(c*Math.PI*2/97)*Re,Ie=.035*Math.sin(c*Math.PI*2/131+1)*Re;if(he.position.set(me,Ie,Oe.z),he.up.set(0,1,0),he.lookAt(me*.35,Ie*.35,0),he.fov=Oe.fov,he.clearViewOffset(),oe>0&&$t.host){const{r:Y,view:q}=j(),fe=Lc(0,q),ae=new Ut(fe.camera.fov,q.width/q.height);ae.position.set(...fe.camera.position),ae.up.set(...fe.camera.up),ae.lookAt(0,0,0);const xe=_0(ae.quaternion.toArray()),He=Oe.z/ae.position.length();p=p.map((ge,Le)=>{const Pe=fe.whales[Le],Me=Ft(xe,[Pe.position[0]-fe.camera.position[0],Pe.position[1]-fe.camera.position[1],Pe.position[2]-fe.camera.position[2]]);return{...ge,position:Sc(ge.position,[Me[0]*He,Me[1]*He,Me[2]*He+Oe.z],oe),quaternion:v0(ge.quaternion,Vi(xe,Pe.quaternion),oe),scale:_t(ge.scale,Pe.scale*He,oe),articulation:Tg(ge.articulation,Pe.articulation,oe)}});const ie=Math.atan(Math.tan(fe.camera.fov*Math.PI/360)*w()/q.height)*360/Math.PI;he.fov=_t(Oe.fov,ie,oe),he.setViewOffset(b(),w(),(b()/2-Y.left-fe.camera.centerX)*oe,(w()/2-Y.top-fe.camera.centerY)*oe,b(),w())}he.updateProjectionMatrix(),t.setOccluder([0,0,0],0,0);const Se=1-$c(scrollY,Mo.start,Mo.travel)/255,T=Yc(Se),x=P()?Xc.rects.length?.5:1:oe>0?1:Rn.presence,O=Et.ink,K=Et.inkFar;t.setStyle({opacity:x*_t(1-.06*E.weight,1,oe),gamma:Et.gamma,tone:Et.tone,contrast:Et.contrast,farFade:Et.farFade,invert:T>.5,ink:[_t(O[0],196,T),_t(O[1],218,T),_t(O[2],228,T)],inkFar:[_t(K[0],132,T),_t(K[1],168,T),_t(K[2],182,T)]}),p.forEach((Y,q)=>t.setWhale(q,Y)),Cn.presence=x,t.render(!1),Q()},Fe=te=>{if(a=0,r||document.hidden||t.lost)return;const oe=Math.min(.05,Math.max(0,(te-o)/1e3));o=te,V();const ve=Zc(scrollY),De=Bt.ready&&!!$t.host&&Bt.length>0;h=De?jc(scrollY,Bt.start-innerHeight*.95,Bt.start):0;const R=De&&scrollY>=Bt.start&&ve<1,Oe=De&&scrollY<Bt.start&&h>0,he=De&&ve>=1&&Rn.presence<.002,Re=!P()&&!R&&!Oe&&!he&&A===null;if(Re?(c+=oe,re(oe)):F=scrollY,(u||Re)&&(u||te-l>=1e3/30)){const me=performance.now();if(R){e.parentElement!==$t.host&&$t.host.appendChild(e);const{view:Ie}=j();ne(Ie.width,Ie.height,!0)&&i.setView(Ie,Math.min(devicePixelRatio||1,Ie.width<768?1:1.25)),i.render(ve),Cn.presence=0}else he?(t.clear(),Cn.presence=0):be(oe,Oe?h:0);u=!1,l=te,f++,d+=(performance.now()-me-d)*.06,f%90===0&&d>19&&m>.36&&(m=Math.max(.35,m-.1),t.setResolution(m))}Re&&(a=requestAnimationFrame(Fe))},B=()=>{u=!0,!a&&!document.hidden&&!r&&(o=performance.now(),a=requestAnimationFrame(Fe))},Z=()=>{cancelAnimationFrame(a),a=0,o=performance.now(),document.hidden||B()},ce=()=>{v=null,k(),B()};t.onContextLost=()=>{e.style.visibility="hidden",k(),cancelAnimationFrame(a),a=0,Cn.presence=0};const ee=()=>{e.style.visibility="",k(),_="",B()};e.addEventListener("webglcontextrestored",ee),window.addEventListener("scroll",B,{passive:!0}),window.addEventListener("resize",B),document.addEventListener("visibilitychange",Z),g.addEventListener("change",ce),Bt.listeners.add(B),$t.refresh=B;const ye=new ResizeObserver(B);return ye.observe(document.body),(Ce=document.fonts)==null||Ce.ready.then(()=>{r||(t.invalidateAtlas(),B())}),B(),()=>{r=!0,cancelAnimationFrame(a),ye.disconnect(),window.removeEventListener("scroll",B),window.removeEventListener("resize",B),document.removeEventListener("visibilitychange",Z),g.removeEventListener("change",ce),e.removeEventListener("webglcontextrestored",ee),Bt.listeners.delete(B),$t.refresh===B&&($t.refresh=null),i==null||i.destroy(),t.dispose(),e.remove(),Bt.ready=!1,Cn.presence=0,$()}}export{wg as mountAmbientWhales};
