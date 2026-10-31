var Cc=Object.defineProperty;var Pc=(n,e,t)=>e in n?Cc(n,e,{enumerable:!0,configurable:!0,writable:!0,value:t}):n[e]=t;var Xe=(n,e,t)=>Pc(n,typeof e!="symbol"?e+"":e,t);import{l as Dc,c as Lc,a as Al,w as wn,b as Ft,g as Ic,r as Uc,d as Rn,i as Nc,e as Xt,f as Fc,h as Oc,j as mo,k as Bc,s as zc}from"./index-DcJSk5Ok.js";/**
 * @license
 * Copyright 2010-2024 Three.js Authors
 * SPDX-License-Identifier: MIT
 */const Ya="170",kc=0,go=1,Gc=2,bl=1,Hc=2,mn=3,Vn=0,Rt=1,sn=2,kn=0,Pi=1,_o=2,vo=3,xo=4,cs=5,ei=100,Vc=101,Wc=102,Xc=103,qc=104,Yc=200,us=201,Kc=202,$c=203,ta=204,li=205,Zc=206,jc=207,Jc=208,Qc=209,eu=210,tu=211,nu=212,iu=213,su=214,na=0,ia=1,sa=2,Ui=3,ra=4,aa=5,oa=6,la=7,wl=0,ru=1,au=2,Gn=0,ou=1,lu=2,cu=3,uu=4,hu=5,fu=6,du=7,Rl=300,Ni=301,Fi=302,ca=303,ua=304,hr=306,ha=1e3,ii=1001,fa=1002,ft=1003,pu=1004,Es=1005,zt=1006,vr=1007,si=1008,Jt=1009,Cl=1010,Pl=1011,hs=1012,Ka=1013,ci=1014,an=1015,gs=1016,$a=1017,Za=1018,Oi=1020,Dl=35902,Ll=1021,Il=1022,kt=1023,Ul=1024,Nl=1025,Di=1026,Bi=1027,Fl=1028,ja=1029,Ol=1030,Ja=1031,Qa=1033,$s=33776,Zs=33777,js=33778,Js=33779,da=35840,pa=35841,ma=35842,ga=35843,_a=36196,va=37492,xa=37496,Ma=37808,Sa=37809,ya=37810,Ea=37811,Ta=37812,Aa=37813,ba=37814,wa=37815,Ra=37816,Ca=37817,Pa=37818,Da=37819,La=37820,Ia=37821,Qs=36492,Ua=36494,Na=36495,Bl=36283,Fa=36284,Oa=36285,Ba=36286,mu=3200,gu=3201,_u=0,vu=1,On="",Bt="srgb",Wi="srgb-linear",fr="linear",Je="srgb",hi=7680,Mo=519,xu=512,Mu=513,Su=514,zl=515,yu=516,Eu=517,Tu=518,Au=519,So=35044,Bn="300 es",gn=2e3,sr=2001;class Xi{addEventListener(e,t){this._listeners===void 0&&(this._listeners={});const i=this._listeners;i[e]===void 0&&(i[e]=[]),i[e].indexOf(t)===-1&&i[e].push(t)}hasEventListener(e,t){if(this._listeners===void 0)return!1;const i=this._listeners;return i[e]!==void 0&&i[e].indexOf(t)!==-1}removeEventListener(e,t){if(this._listeners===void 0)return;const s=this._listeners[e];if(s!==void 0){const r=s.indexOf(t);r!==-1&&s.splice(r,1)}}dispatchEvent(e){if(this._listeners===void 0)return;const i=this._listeners[e.type];if(i!==void 0){e.target=this;const s=i.slice(0);for(let r=0,a=s.length;r<a;r++)s[r].call(this,e);e.target=null}}}const vt=["00","01","02","03","04","05","06","07","08","09","0a","0b","0c","0d","0e","0f","10","11","12","13","14","15","16","17","18","19","1a","1b","1c","1d","1e","1f","20","21","22","23","24","25","26","27","28","29","2a","2b","2c","2d","2e","2f","30","31","32","33","34","35","36","37","38","39","3a","3b","3c","3d","3e","3f","40","41","42","43","44","45","46","47","48","49","4a","4b","4c","4d","4e","4f","50","51","52","53","54","55","56","57","58","59","5a","5b","5c","5d","5e","5f","60","61","62","63","64","65","66","67","68","69","6a","6b","6c","6d","6e","6f","70","71","72","73","74","75","76","77","78","79","7a","7b","7c","7d","7e","7f","80","81","82","83","84","85","86","87","88","89","8a","8b","8c","8d","8e","8f","90","91","92","93","94","95","96","97","98","99","9a","9b","9c","9d","9e","9f","a0","a1","a2","a3","a4","a5","a6","a7","a8","a9","aa","ab","ac","ad","ae","af","b0","b1","b2","b3","b4","b5","b6","b7","b8","b9","ba","bb","bc","bd","be","bf","c0","c1","c2","c3","c4","c5","c6","c7","c8","c9","ca","cb","cc","cd","ce","cf","d0","d1","d2","d3","d4","d5","d6","d7","d8","d9","da","db","dc","dd","de","df","e0","e1","e2","e3","e4","e5","e6","e7","e8","e9","ea","eb","ec","ed","ee","ef","f0","f1","f2","f3","f4","f5","f6","f7","f8","f9","fa","fb","fc","fd","fe","ff"],xr=Math.PI/180,za=180/Math.PI;function _s(){const n=Math.random()*4294967295|0,e=Math.random()*4294967295|0,t=Math.random()*4294967295|0,i=Math.random()*4294967295|0;return(vt[n&255]+vt[n>>8&255]+vt[n>>16&255]+vt[n>>24&255]+"-"+vt[e&255]+vt[e>>8&255]+"-"+vt[e>>16&15|64]+vt[e>>24&255]+"-"+vt[t&63|128]+vt[t>>8&255]+"-"+vt[t>>16&255]+vt[t>>24&255]+vt[i&255]+vt[i>>8&255]+vt[i>>16&255]+vt[i>>24&255]).toLowerCase()}function At(n,e,t){return Math.max(e,Math.min(t,n))}function bu(n,e){return(n%e+e)%e}function Mr(n,e,t){return(1-t)*n+t*e}function ji(n,e){switch(e.constructor){case Float32Array:return n;case Uint32Array:return n/4294967295;case Uint16Array:return n/65535;case Uint8Array:return n/255;case Int32Array:return Math.max(n/2147483647,-1);case Int16Array:return Math.max(n/32767,-1);case Int8Array:return Math.max(n/127,-1);default:throw new Error("Invalid component type.")}}function Tt(n,e){switch(e.constructor){case Float32Array:return n;case Uint32Array:return Math.round(n*4294967295);case Uint16Array:return Math.round(n*65535);case Uint8Array:return Math.round(n*255);case Int32Array:return Math.round(n*2147483647);case Int16Array:return Math.round(n*32767);case Int8Array:return Math.round(n*127);default:throw new Error("Invalid component type.")}}class Ve{constructor(e=0,t=0){Ve.prototype.isVector2=!0,this.x=e,this.y=t}get width(){return this.x}set width(e){this.x=e}get height(){return this.y}set height(e){this.y=e}set(e,t){return this.x=e,this.y=t,this}setScalar(e){return this.x=e,this.y=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;default:throw new Error("index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;default:throw new Error("index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y)}copy(e){return this.x=e.x,this.y=e.y,this}add(e){return this.x+=e.x,this.y+=e.y,this}addScalar(e){return this.x+=e,this.y+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this}subScalar(e){return this.x-=e,this.y-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this}multiply(e){return this.x*=e.x,this.y*=e.y,this}multiplyScalar(e){return this.x*=e,this.y*=e,this}divide(e){return this.x/=e.x,this.y/=e.y,this}divideScalar(e){return this.multiplyScalar(1/e)}applyMatrix3(e){const t=this.x,i=this.y,s=e.elements;return this.x=s[0]*t+s[3]*i+s[6],this.y=s[1]*t+s[4]*i+s[7],this}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this}clamp(e,t){return this.x=Math.max(e.x,Math.min(t.x,this.x)),this.y=Math.max(e.y,Math.min(t.y,this.y)),this}clampScalar(e,t){return this.x=Math.max(e,Math.min(t,this.x)),this.y=Math.max(e,Math.min(t,this.y)),this}clampLength(e,t){const i=this.length();return this.divideScalar(i||1).multiplyScalar(Math.max(e,Math.min(t,i)))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this}negate(){return this.x=-this.x,this.y=-this.y,this}dot(e){return this.x*e.x+this.y*e.y}cross(e){return this.x*e.y-this.y*e.x}lengthSq(){return this.x*this.x+this.y*this.y}length(){return Math.sqrt(this.x*this.x+this.y*this.y)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)}normalize(){return this.divideScalar(this.length()||1)}angle(){return Math.atan2(-this.y,-this.x)+Math.PI}angleTo(e){const t=Math.sqrt(this.lengthSq()*e.lengthSq());if(t===0)return Math.PI/2;const i=this.dot(e)/t;return Math.acos(At(i,-1,1))}distanceTo(e){return Math.sqrt(this.distanceToSquared(e))}distanceToSquared(e){const t=this.x-e.x,i=this.y-e.y;return t*t+i*i}manhattanDistanceTo(e){return Math.abs(this.x-e.x)+Math.abs(this.y-e.y)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this}lerpVectors(e,t,i){return this.x=e.x+(t.x-e.x)*i,this.y=e.y+(t.y-e.y)*i,this}equals(e){return e.x===this.x&&e.y===this.y}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this}rotateAround(e,t){const i=Math.cos(t),s=Math.sin(t),r=this.x-e.x,a=this.y-e.y;return this.x=r*i-a*s+e.x,this.y=r*s+a*i+e.y,this}random(){return this.x=Math.random(),this.y=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y}}class Ue{constructor(e,t,i,s,r,a,o,l,c){Ue.prototype.isMatrix3=!0,this.elements=[1,0,0,0,1,0,0,0,1],e!==void 0&&this.set(e,t,i,s,r,a,o,l,c)}set(e,t,i,s,r,a,o,l,c){const u=this.elements;return u[0]=e,u[1]=s,u[2]=o,u[3]=t,u[4]=r,u[5]=l,u[6]=i,u[7]=a,u[8]=c,this}identity(){return this.set(1,0,0,0,1,0,0,0,1),this}copy(e){const t=this.elements,i=e.elements;return t[0]=i[0],t[1]=i[1],t[2]=i[2],t[3]=i[3],t[4]=i[4],t[5]=i[5],t[6]=i[6],t[7]=i[7],t[8]=i[8],this}extractBasis(e,t,i){return e.setFromMatrix3Column(this,0),t.setFromMatrix3Column(this,1),i.setFromMatrix3Column(this,2),this}setFromMatrix4(e){const t=e.elements;return this.set(t[0],t[4],t[8],t[1],t[5],t[9],t[2],t[6],t[10]),this}multiply(e){return this.multiplyMatrices(this,e)}premultiply(e){return this.multiplyMatrices(e,this)}multiplyMatrices(e,t){const i=e.elements,s=t.elements,r=this.elements,a=i[0],o=i[3],l=i[6],c=i[1],u=i[4],d=i[7],f=i[2],m=i[5],g=i[8],_=s[0],p=s[3],h=s[6],A=s[1],S=s[4],M=s[7],P=s[2],b=s[5],w=s[8];return r[0]=a*_+o*A+l*P,r[3]=a*p+o*S+l*b,r[6]=a*h+o*M+l*w,r[1]=c*_+u*A+d*P,r[4]=c*p+u*S+d*b,r[7]=c*h+u*M+d*w,r[2]=f*_+m*A+g*P,r[5]=f*p+m*S+g*b,r[8]=f*h+m*M+g*w,this}multiplyScalar(e){const t=this.elements;return t[0]*=e,t[3]*=e,t[6]*=e,t[1]*=e,t[4]*=e,t[7]*=e,t[2]*=e,t[5]*=e,t[8]*=e,this}determinant(){const e=this.elements,t=e[0],i=e[1],s=e[2],r=e[3],a=e[4],o=e[5],l=e[6],c=e[7],u=e[8];return t*a*u-t*o*c-i*r*u+i*o*l+s*r*c-s*a*l}invert(){const e=this.elements,t=e[0],i=e[1],s=e[2],r=e[3],a=e[4],o=e[5],l=e[6],c=e[7],u=e[8],d=u*a-o*c,f=o*l-u*r,m=c*r-a*l,g=t*d+i*f+s*m;if(g===0)return this.set(0,0,0,0,0,0,0,0,0);const _=1/g;return e[0]=d*_,e[1]=(s*c-u*i)*_,e[2]=(o*i-s*a)*_,e[3]=f*_,e[4]=(u*t-s*l)*_,e[5]=(s*r-o*t)*_,e[6]=m*_,e[7]=(i*l-c*t)*_,e[8]=(a*t-i*r)*_,this}transpose(){let e;const t=this.elements;return e=t[1],t[1]=t[3],t[3]=e,e=t[2],t[2]=t[6],t[6]=e,e=t[5],t[5]=t[7],t[7]=e,this}getNormalMatrix(e){return this.setFromMatrix4(e).invert().transpose()}transposeIntoArray(e){const t=this.elements;return e[0]=t[0],e[1]=t[3],e[2]=t[6],e[3]=t[1],e[4]=t[4],e[5]=t[7],e[6]=t[2],e[7]=t[5],e[8]=t[8],this}setUvTransform(e,t,i,s,r,a,o){const l=Math.cos(r),c=Math.sin(r);return this.set(i*l,i*c,-i*(l*a+c*o)+a+e,-s*c,s*l,-s*(-c*a+l*o)+o+t,0,0,1),this}scale(e,t){return this.premultiply(Sr.makeScale(e,t)),this}rotate(e){return this.premultiply(Sr.makeRotation(-e)),this}translate(e,t){return this.premultiply(Sr.makeTranslation(e,t)),this}makeTranslation(e,t){return e.isVector2?this.set(1,0,e.x,0,1,e.y,0,0,1):this.set(1,0,e,0,1,t,0,0,1),this}makeRotation(e){const t=Math.cos(e),i=Math.sin(e);return this.set(t,-i,0,i,t,0,0,0,1),this}makeScale(e,t){return this.set(e,0,0,0,t,0,0,0,1),this}equals(e){const t=this.elements,i=e.elements;for(let s=0;s<9;s++)if(t[s]!==i[s])return!1;return!0}fromArray(e,t=0){for(let i=0;i<9;i++)this.elements[i]=e[i+t];return this}toArray(e=[],t=0){const i=this.elements;return e[t]=i[0],e[t+1]=i[1],e[t+2]=i[2],e[t+3]=i[3],e[t+4]=i[4],e[t+5]=i[5],e[t+6]=i[6],e[t+7]=i[7],e[t+8]=i[8],e}clone(){return new this.constructor().fromArray(this.elements)}}const Sr=new Ue;function kl(n){for(let e=n.length-1;e>=0;--e)if(n[e]>=65535)return!0;return!1}function rr(n){return document.createElementNS("http://www.w3.org/1999/xhtml",n)}function wu(){const n=rr("canvas");return n.style.display="block",n}const yo={};function ss(n){n in yo||(yo[n]=!0,console.warn(n))}function Ru(n,e,t){return new Promise(function(i,s){function r(){switch(n.clientWaitSync(e,n.SYNC_FLUSH_COMMANDS_BIT,0)){case n.WAIT_FAILED:s();break;case n.TIMEOUT_EXPIRED:setTimeout(r,t);break;default:i()}}setTimeout(r,t)})}function Cu(n){const e=n.elements;e[2]=.5*e[2]+.5*e[3],e[6]=.5*e[6]+.5*e[7],e[10]=.5*e[10]+.5*e[11],e[14]=.5*e[14]+.5*e[15]}function Pu(n){const e=n.elements;e[11]===-1?(e[10]=-e[10]-1,e[14]=-e[14]):(e[10]=-e[10],e[14]=-e[14]+1)}const qe={enabled:!0,workingColorSpace:Wi,spaces:{},convert:function(n,e,t){return this.enabled===!1||e===t||!e||!t||(this.spaces[e].transfer===Je&&(n.r=_n(n.r),n.g=_n(n.g),n.b=_n(n.b)),this.spaces[e].primaries!==this.spaces[t].primaries&&(n.applyMatrix3(this.spaces[e].toXYZ),n.applyMatrix3(this.spaces[t].fromXYZ)),this.spaces[t].transfer===Je&&(n.r=Li(n.r),n.g=Li(n.g),n.b=Li(n.b))),n},fromWorkingColorSpace:function(n,e){return this.convert(n,this.workingColorSpace,e)},toWorkingColorSpace:function(n,e){return this.convert(n,e,this.workingColorSpace)},getPrimaries:function(n){return this.spaces[n].primaries},getTransfer:function(n){return n===On?fr:this.spaces[n].transfer},getLuminanceCoefficients:function(n,e=this.workingColorSpace){return n.fromArray(this.spaces[e].luminanceCoefficients)},define:function(n){Object.assign(this.spaces,n)},_getMatrix:function(n,e,t){return n.copy(this.spaces[e].toXYZ).multiply(this.spaces[t].fromXYZ)},_getDrawingBufferColorSpace:function(n){return this.spaces[n].outputColorSpaceConfig.drawingBufferColorSpace},_getUnpackColorSpace:function(n=this.workingColorSpace){return this.spaces[n].workingColorSpaceConfig.unpackColorSpace}};function _n(n){return n<.04045?n*.0773993808:Math.pow(n*.9478672986+.0521327014,2.4)}function Li(n){return n<.0031308?n*12.92:1.055*Math.pow(n,.41666)-.055}const Eo=[.64,.33,.3,.6,.15,.06],To=[.2126,.7152,.0722],Ao=[.3127,.329],bo=new Ue().set(.4123908,.3575843,.1804808,.212639,.7151687,.0721923,.0193308,.1191948,.9505322),wo=new Ue().set(3.2409699,-1.5373832,-.4986108,-.9692436,1.8759675,.0415551,.0556301,-.203977,1.0569715);qe.define({[Wi]:{primaries:Eo,whitePoint:Ao,transfer:fr,toXYZ:bo,fromXYZ:wo,luminanceCoefficients:To,workingColorSpaceConfig:{unpackColorSpace:Bt},outputColorSpaceConfig:{drawingBufferColorSpace:Bt}},[Bt]:{primaries:Eo,whitePoint:Ao,transfer:Je,toXYZ:bo,fromXYZ:wo,luminanceCoefficients:To,outputColorSpaceConfig:{drawingBufferColorSpace:Bt}}});let fi;class Du{static getDataURL(e){if(/^data:/i.test(e.src)||typeof HTMLCanvasElement>"u")return e.src;let t;if(e instanceof HTMLCanvasElement)t=e;else{fi===void 0&&(fi=rr("canvas")),fi.width=e.width,fi.height=e.height;const i=fi.getContext("2d");e instanceof ImageData?i.putImageData(e,0,0):i.drawImage(e,0,0,e.width,e.height),t=fi}return t.width>2048||t.height>2048?(console.warn("THREE.ImageUtils.getDataURL: Image converted to jpg for performance reasons",e),t.toDataURL("image/jpeg",.6)):t.toDataURL("image/png")}static sRGBToLinear(e){if(typeof HTMLImageElement<"u"&&e instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&e instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&e instanceof ImageBitmap){const t=rr("canvas");t.width=e.width,t.height=e.height;const i=t.getContext("2d");i.drawImage(e,0,0,e.width,e.height);const s=i.getImageData(0,0,e.width,e.height),r=s.data;for(let a=0;a<r.length;a++)r[a]=_n(r[a]/255)*255;return i.putImageData(s,0,0),t}else if(e.data){const t=e.data.slice(0);for(let i=0;i<t.length;i++)t instanceof Uint8Array||t instanceof Uint8ClampedArray?t[i]=Math.floor(_n(t[i]/255)*255):t[i]=_n(t[i]);return{data:t,width:e.width,height:e.height}}else return console.warn("THREE.ImageUtils.sRGBToLinear(): Unsupported image type. No color space conversion applied."),e}}let Lu=0;class Gl{constructor(e=null){this.isSource=!0,Object.defineProperty(this,"id",{value:Lu++}),this.uuid=_s(),this.data=e,this.dataReady=!0,this.version=0}set needsUpdate(e){e===!0&&this.version++}toJSON(e){const t=e===void 0||typeof e=="string";if(!t&&e.images[this.uuid]!==void 0)return e.images[this.uuid];const i={uuid:this.uuid,url:""},s=this.data;if(s!==null){let r;if(Array.isArray(s)){r=[];for(let a=0,o=s.length;a<o;a++)s[a].isDataTexture?r.push(yr(s[a].image)):r.push(yr(s[a]))}else r=yr(s);i.url=r}return t||(e.images[this.uuid]=i),i}}function yr(n){return typeof HTMLImageElement<"u"&&n instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&n instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&n instanceof ImageBitmap?Du.getDataURL(n):n.data?{data:Array.from(n.data),width:n.width,height:n.height,type:n.data.constructor.name}:(console.warn("THREE.Texture: Unable to serialize Texture."),{})}let Iu=0;class Mt extends Xi{constructor(e=Mt.DEFAULT_IMAGE,t=Mt.DEFAULT_MAPPING,i=ii,s=ii,r=zt,a=si,o=kt,l=Jt,c=Mt.DEFAULT_ANISOTROPY,u=On){super(),this.isTexture=!0,Object.defineProperty(this,"id",{value:Iu++}),this.uuid=_s(),this.name="",this.source=new Gl(e),this.mipmaps=[],this.mapping=t,this.channel=0,this.wrapS=i,this.wrapT=s,this.magFilter=r,this.minFilter=a,this.anisotropy=c,this.format=o,this.internalFormat=null,this.type=l,this.offset=new Ve(0,0),this.repeat=new Ve(1,1),this.center=new Ve(0,0),this.rotation=0,this.matrixAutoUpdate=!0,this.matrix=new Ue,this.generateMipmaps=!0,this.premultiplyAlpha=!1,this.flipY=!0,this.unpackAlignment=4,this.colorSpace=u,this.userData={},this.version=0,this.onUpdate=null,this.isRenderTargetTexture=!1,this.pmremVersion=0}get image(){return this.source.data}set image(e=null){this.source.data=e}updateMatrix(){this.matrix.setUvTransform(this.offset.x,this.offset.y,this.repeat.x,this.repeat.y,this.rotation,this.center.x,this.center.y)}clone(){return new this.constructor().copy(this)}copy(e){return this.name=e.name,this.source=e.source,this.mipmaps=e.mipmaps.slice(0),this.mapping=e.mapping,this.channel=e.channel,this.wrapS=e.wrapS,this.wrapT=e.wrapT,this.magFilter=e.magFilter,this.minFilter=e.minFilter,this.anisotropy=e.anisotropy,this.format=e.format,this.internalFormat=e.internalFormat,this.type=e.type,this.offset.copy(e.offset),this.repeat.copy(e.repeat),this.center.copy(e.center),this.rotation=e.rotation,this.matrixAutoUpdate=e.matrixAutoUpdate,this.matrix.copy(e.matrix),this.generateMipmaps=e.generateMipmaps,this.premultiplyAlpha=e.premultiplyAlpha,this.flipY=e.flipY,this.unpackAlignment=e.unpackAlignment,this.colorSpace=e.colorSpace,this.userData=JSON.parse(JSON.stringify(e.userData)),this.needsUpdate=!0,this}toJSON(e){const t=e===void 0||typeof e=="string";if(!t&&e.textures[this.uuid]!==void 0)return e.textures[this.uuid];const i={metadata:{version:4.6,type:"Texture",generator:"Texture.toJSON"},uuid:this.uuid,name:this.name,image:this.source.toJSON(e).uuid,mapping:this.mapping,channel:this.channel,repeat:[this.repeat.x,this.repeat.y],offset:[this.offset.x,this.offset.y],center:[this.center.x,this.center.y],rotation:this.rotation,wrap:[this.wrapS,this.wrapT],format:this.format,internalFormat:this.internalFormat,type:this.type,colorSpace:this.colorSpace,minFilter:this.minFilter,magFilter:this.magFilter,anisotropy:this.anisotropy,flipY:this.flipY,generateMipmaps:this.generateMipmaps,premultiplyAlpha:this.premultiplyAlpha,unpackAlignment:this.unpackAlignment};return Object.keys(this.userData).length>0&&(i.userData=this.userData),t||(e.textures[this.uuid]=i),i}dispose(){this.dispatchEvent({type:"dispose"})}transformUv(e){if(this.mapping!==Rl)return e;if(e.applyMatrix3(this.matrix),e.x<0||e.x>1)switch(this.wrapS){case ha:e.x=e.x-Math.floor(e.x);break;case ii:e.x=e.x<0?0:1;break;case fa:Math.abs(Math.floor(e.x)%2)===1?e.x=Math.ceil(e.x)-e.x:e.x=e.x-Math.floor(e.x);break}if(e.y<0||e.y>1)switch(this.wrapT){case ha:e.y=e.y-Math.floor(e.y);break;case ii:e.y=e.y<0?0:1;break;case fa:Math.abs(Math.floor(e.y)%2)===1?e.y=Math.ceil(e.y)-e.y:e.y=e.y-Math.floor(e.y);break}return this.flipY&&(e.y=1-e.y),e}set needsUpdate(e){e===!0&&(this.version++,this.source.needsUpdate=!0)}set needsPMREMUpdate(e){e===!0&&this.pmremVersion++}}Mt.DEFAULT_IMAGE=null;Mt.DEFAULT_MAPPING=Rl;Mt.DEFAULT_ANISOTROPY=1;class tt{constructor(e=0,t=0,i=0,s=1){tt.prototype.isVector4=!0,this.x=e,this.y=t,this.z=i,this.w=s}get width(){return this.z}set width(e){this.z=e}get height(){return this.w}set height(e){this.w=e}set(e,t,i,s){return this.x=e,this.y=t,this.z=i,this.w=s,this}setScalar(e){return this.x=e,this.y=e,this.z=e,this.w=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setZ(e){return this.z=e,this}setW(e){return this.w=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;case 2:this.z=t;break;case 3:this.w=t;break;default:throw new Error("index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;case 2:return this.z;case 3:return this.w;default:throw new Error("index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y,this.z,this.w)}copy(e){return this.x=e.x,this.y=e.y,this.z=e.z,this.w=e.w!==void 0?e.w:1,this}add(e){return this.x+=e.x,this.y+=e.y,this.z+=e.z,this.w+=e.w,this}addScalar(e){return this.x+=e,this.y+=e,this.z+=e,this.w+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this.z=e.z+t.z,this.w=e.w+t.w,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this.z+=e.z*t,this.w+=e.w*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this.z-=e.z,this.w-=e.w,this}subScalar(e){return this.x-=e,this.y-=e,this.z-=e,this.w-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this.z=e.z-t.z,this.w=e.w-t.w,this}multiply(e){return this.x*=e.x,this.y*=e.y,this.z*=e.z,this.w*=e.w,this}multiplyScalar(e){return this.x*=e,this.y*=e,this.z*=e,this.w*=e,this}applyMatrix4(e){const t=this.x,i=this.y,s=this.z,r=this.w,a=e.elements;return this.x=a[0]*t+a[4]*i+a[8]*s+a[12]*r,this.y=a[1]*t+a[5]*i+a[9]*s+a[13]*r,this.z=a[2]*t+a[6]*i+a[10]*s+a[14]*r,this.w=a[3]*t+a[7]*i+a[11]*s+a[15]*r,this}divide(e){return this.x/=e.x,this.y/=e.y,this.z/=e.z,this.w/=e.w,this}divideScalar(e){return this.multiplyScalar(1/e)}setAxisAngleFromQuaternion(e){this.w=2*Math.acos(e.w);const t=Math.sqrt(1-e.w*e.w);return t<1e-4?(this.x=1,this.y=0,this.z=0):(this.x=e.x/t,this.y=e.y/t,this.z=e.z/t),this}setAxisAngleFromRotationMatrix(e){let t,i,s,r;const l=e.elements,c=l[0],u=l[4],d=l[8],f=l[1],m=l[5],g=l[9],_=l[2],p=l[6],h=l[10];if(Math.abs(u-f)<.01&&Math.abs(d-_)<.01&&Math.abs(g-p)<.01){if(Math.abs(u+f)<.1&&Math.abs(d+_)<.1&&Math.abs(g+p)<.1&&Math.abs(c+m+h-3)<.1)return this.set(1,0,0,0),this;t=Math.PI;const S=(c+1)/2,M=(m+1)/2,P=(h+1)/2,b=(u+f)/4,w=(d+_)/4,L=(g+p)/4;return S>M&&S>P?S<.01?(i=0,s=.707106781,r=.707106781):(i=Math.sqrt(S),s=b/i,r=w/i):M>P?M<.01?(i=.707106781,s=0,r=.707106781):(s=Math.sqrt(M),i=b/s,r=L/s):P<.01?(i=.707106781,s=.707106781,r=0):(r=Math.sqrt(P),i=w/r,s=L/r),this.set(i,s,r,t),this}let A=Math.sqrt((p-g)*(p-g)+(d-_)*(d-_)+(f-u)*(f-u));return Math.abs(A)<.001&&(A=1),this.x=(p-g)/A,this.y=(d-_)/A,this.z=(f-u)/A,this.w=Math.acos((c+m+h-1)/2),this}setFromMatrixPosition(e){const t=e.elements;return this.x=t[12],this.y=t[13],this.z=t[14],this.w=t[15],this}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this.z=Math.min(this.z,e.z),this.w=Math.min(this.w,e.w),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this.z=Math.max(this.z,e.z),this.w=Math.max(this.w,e.w),this}clamp(e,t){return this.x=Math.max(e.x,Math.min(t.x,this.x)),this.y=Math.max(e.y,Math.min(t.y,this.y)),this.z=Math.max(e.z,Math.min(t.z,this.z)),this.w=Math.max(e.w,Math.min(t.w,this.w)),this}clampScalar(e,t){return this.x=Math.max(e,Math.min(t,this.x)),this.y=Math.max(e,Math.min(t,this.y)),this.z=Math.max(e,Math.min(t,this.z)),this.w=Math.max(e,Math.min(t,this.w)),this}clampLength(e,t){const i=this.length();return this.divideScalar(i||1).multiplyScalar(Math.max(e,Math.min(t,i)))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this.w=Math.floor(this.w),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this.w=Math.ceil(this.w),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this.w=Math.round(this.w),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this.w=Math.trunc(this.w),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this.w=-this.w,this}dot(e){return this.x*e.x+this.y*e.y+this.z*e.z+this.w*e.w}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)+Math.abs(this.w)}normalize(){return this.divideScalar(this.length()||1)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this.z+=(e.z-this.z)*t,this.w+=(e.w-this.w)*t,this}lerpVectors(e,t,i){return this.x=e.x+(t.x-e.x)*i,this.y=e.y+(t.y-e.y)*i,this.z=e.z+(t.z-e.z)*i,this.w=e.w+(t.w-e.w)*i,this}equals(e){return e.x===this.x&&e.y===this.y&&e.z===this.z&&e.w===this.w}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this.z=e[t+2],this.w=e[t+3],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e[t+2]=this.z,e[t+3]=this.w,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this.z=e.getZ(t),this.w=e.getW(t),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this.w=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z,yield this.w}}class Uu extends Xi{constructor(e=1,t=1,i={}){super(),this.isRenderTarget=!0,this.width=e,this.height=t,this.depth=1,this.scissor=new tt(0,0,e,t),this.scissorTest=!1,this.viewport=new tt(0,0,e,t);const s={width:e,height:t,depth:1};i=Object.assign({generateMipmaps:!1,internalFormat:null,minFilter:zt,depthBuffer:!0,stencilBuffer:!1,resolveDepthBuffer:!0,resolveStencilBuffer:!0,depthTexture:null,samples:0,count:1},i);const r=new Mt(s,i.mapping,i.wrapS,i.wrapT,i.magFilter,i.minFilter,i.format,i.type,i.anisotropy,i.colorSpace);r.flipY=!1,r.generateMipmaps=i.generateMipmaps,r.internalFormat=i.internalFormat,this.textures=[];const a=i.count;for(let o=0;o<a;o++)this.textures[o]=r.clone(),this.textures[o].isRenderTargetTexture=!0;this.depthBuffer=i.depthBuffer,this.stencilBuffer=i.stencilBuffer,this.resolveDepthBuffer=i.resolveDepthBuffer,this.resolveStencilBuffer=i.resolveStencilBuffer,this.depthTexture=i.depthTexture,this.samples=i.samples}get texture(){return this.textures[0]}set texture(e){this.textures[0]=e}setSize(e,t,i=1){if(this.width!==e||this.height!==t||this.depth!==i){this.width=e,this.height=t,this.depth=i;for(let s=0,r=this.textures.length;s<r;s++)this.textures[s].image.width=e,this.textures[s].image.height=t,this.textures[s].image.depth=i;this.dispose()}this.viewport.set(0,0,e,t),this.scissor.set(0,0,e,t)}clone(){return new this.constructor().copy(this)}copy(e){this.width=e.width,this.height=e.height,this.depth=e.depth,this.scissor.copy(e.scissor),this.scissorTest=e.scissorTest,this.viewport.copy(e.viewport),this.textures.length=0;for(let i=0,s=e.textures.length;i<s;i++)this.textures[i]=e.textures[i].clone(),this.textures[i].isRenderTargetTexture=!0;const t=Object.assign({},e.texture.image);return this.texture.source=new Gl(t),this.depthBuffer=e.depthBuffer,this.stencilBuffer=e.stencilBuffer,this.resolveDepthBuffer=e.resolveDepthBuffer,this.resolveStencilBuffer=e.resolveStencilBuffer,e.depthTexture!==null&&(this.depthTexture=e.depthTexture.clone()),this.samples=e.samples,this}dispose(){this.dispatchEvent({type:"dispose"})}}class Sn extends Uu{constructor(e=1,t=1,i={}){super(e,t,i),this.isWebGLRenderTarget=!0}}class Hl extends Mt{constructor(e=null,t=1,i=1,s=1){super(null),this.isDataArrayTexture=!0,this.image={data:e,width:t,height:i,depth:s},this.magFilter=ft,this.minFilter=ft,this.wrapR=ii,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1,this.layerUpdates=new Set}addLayerUpdate(e){this.layerUpdates.add(e)}clearLayerUpdates(){this.layerUpdates.clear()}}class Nu extends Mt{constructor(e=null,t=1,i=1,s=1){super(null),this.isData3DTexture=!0,this.image={data:e,width:t,height:i,depth:s},this.magFilter=ft,this.minFilter=ft,this.wrapR=ii,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}}class qi{constructor(e=0,t=0,i=0,s=1){this.isQuaternion=!0,this._x=e,this._y=t,this._z=i,this._w=s}static slerpFlat(e,t,i,s,r,a,o){let l=i[s+0],c=i[s+1],u=i[s+2],d=i[s+3];const f=r[a+0],m=r[a+1],g=r[a+2],_=r[a+3];if(o===0){e[t+0]=l,e[t+1]=c,e[t+2]=u,e[t+3]=d;return}if(o===1){e[t+0]=f,e[t+1]=m,e[t+2]=g,e[t+3]=_;return}if(d!==_||l!==f||c!==m||u!==g){let p=1-o;const h=l*f+c*m+u*g+d*_,A=h>=0?1:-1,S=1-h*h;if(S>Number.EPSILON){const P=Math.sqrt(S),b=Math.atan2(P,h*A);p=Math.sin(p*b)/P,o=Math.sin(o*b)/P}const M=o*A;if(l=l*p+f*M,c=c*p+m*M,u=u*p+g*M,d=d*p+_*M,p===1-o){const P=1/Math.sqrt(l*l+c*c+u*u+d*d);l*=P,c*=P,u*=P,d*=P}}e[t]=l,e[t+1]=c,e[t+2]=u,e[t+3]=d}static multiplyQuaternionsFlat(e,t,i,s,r,a){const o=i[s],l=i[s+1],c=i[s+2],u=i[s+3],d=r[a],f=r[a+1],m=r[a+2],g=r[a+3];return e[t]=o*g+u*d+l*m-c*f,e[t+1]=l*g+u*f+c*d-o*m,e[t+2]=c*g+u*m+o*f-l*d,e[t+3]=u*g-o*d-l*f-c*m,e}get x(){return this._x}set x(e){this._x=e,this._onChangeCallback()}get y(){return this._y}set y(e){this._y=e,this._onChangeCallback()}get z(){return this._z}set z(e){this._z=e,this._onChangeCallback()}get w(){return this._w}set w(e){this._w=e,this._onChangeCallback()}set(e,t,i,s){return this._x=e,this._y=t,this._z=i,this._w=s,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._w)}copy(e){return this._x=e.x,this._y=e.y,this._z=e.z,this._w=e.w,this._onChangeCallback(),this}setFromEuler(e,t=!0){const i=e._x,s=e._y,r=e._z,a=e._order,o=Math.cos,l=Math.sin,c=o(i/2),u=o(s/2),d=o(r/2),f=l(i/2),m=l(s/2),g=l(r/2);switch(a){case"XYZ":this._x=f*u*d+c*m*g,this._y=c*m*d-f*u*g,this._z=c*u*g+f*m*d,this._w=c*u*d-f*m*g;break;case"YXZ":this._x=f*u*d+c*m*g,this._y=c*m*d-f*u*g,this._z=c*u*g-f*m*d,this._w=c*u*d+f*m*g;break;case"ZXY":this._x=f*u*d-c*m*g,this._y=c*m*d+f*u*g,this._z=c*u*g+f*m*d,this._w=c*u*d-f*m*g;break;case"ZYX":this._x=f*u*d-c*m*g,this._y=c*m*d+f*u*g,this._z=c*u*g-f*m*d,this._w=c*u*d+f*m*g;break;case"YZX":this._x=f*u*d+c*m*g,this._y=c*m*d+f*u*g,this._z=c*u*g-f*m*d,this._w=c*u*d-f*m*g;break;case"XZY":this._x=f*u*d-c*m*g,this._y=c*m*d-f*u*g,this._z=c*u*g+f*m*d,this._w=c*u*d+f*m*g;break;default:console.warn("THREE.Quaternion: .setFromEuler() encountered an unknown order: "+a)}return t===!0&&this._onChangeCallback(),this}setFromAxisAngle(e,t){const i=t/2,s=Math.sin(i);return this._x=e.x*s,this._y=e.y*s,this._z=e.z*s,this._w=Math.cos(i),this._onChangeCallback(),this}setFromRotationMatrix(e){const t=e.elements,i=t[0],s=t[4],r=t[8],a=t[1],o=t[5],l=t[9],c=t[2],u=t[6],d=t[10],f=i+o+d;if(f>0){const m=.5/Math.sqrt(f+1);this._w=.25/m,this._x=(u-l)*m,this._y=(r-c)*m,this._z=(a-s)*m}else if(i>o&&i>d){const m=2*Math.sqrt(1+i-o-d);this._w=(u-l)/m,this._x=.25*m,this._y=(s+a)/m,this._z=(r+c)/m}else if(o>d){const m=2*Math.sqrt(1+o-i-d);this._w=(r-c)/m,this._x=(s+a)/m,this._y=.25*m,this._z=(l+u)/m}else{const m=2*Math.sqrt(1+d-i-o);this._w=(a-s)/m,this._x=(r+c)/m,this._y=(l+u)/m,this._z=.25*m}return this._onChangeCallback(),this}setFromUnitVectors(e,t){let i=e.dot(t)+1;return i<Number.EPSILON?(i=0,Math.abs(e.x)>Math.abs(e.z)?(this._x=-e.y,this._y=e.x,this._z=0,this._w=i):(this._x=0,this._y=-e.z,this._z=e.y,this._w=i)):(this._x=e.y*t.z-e.z*t.y,this._y=e.z*t.x-e.x*t.z,this._z=e.x*t.y-e.y*t.x,this._w=i),this.normalize()}angleTo(e){return 2*Math.acos(Math.abs(At(this.dot(e),-1,1)))}rotateTowards(e,t){const i=this.angleTo(e);if(i===0)return this;const s=Math.min(1,t/i);return this.slerp(e,s),this}identity(){return this.set(0,0,0,1)}invert(){return this.conjugate()}conjugate(){return this._x*=-1,this._y*=-1,this._z*=-1,this._onChangeCallback(),this}dot(e){return this._x*e._x+this._y*e._y+this._z*e._z+this._w*e._w}lengthSq(){return this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w}length(){return Math.sqrt(this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w)}normalize(){let e=this.length();return e===0?(this._x=0,this._y=0,this._z=0,this._w=1):(e=1/e,this._x=this._x*e,this._y=this._y*e,this._z=this._z*e,this._w=this._w*e),this._onChangeCallback(),this}multiply(e){return this.multiplyQuaternions(this,e)}premultiply(e){return this.multiplyQuaternions(e,this)}multiplyQuaternions(e,t){const i=e._x,s=e._y,r=e._z,a=e._w,o=t._x,l=t._y,c=t._z,u=t._w;return this._x=i*u+a*o+s*c-r*l,this._y=s*u+a*l+r*o-i*c,this._z=r*u+a*c+i*l-s*o,this._w=a*u-i*o-s*l-r*c,this._onChangeCallback(),this}slerp(e,t){if(t===0)return this;if(t===1)return this.copy(e);const i=this._x,s=this._y,r=this._z,a=this._w;let o=a*e._w+i*e._x+s*e._y+r*e._z;if(o<0?(this._w=-e._w,this._x=-e._x,this._y=-e._y,this._z=-e._z,o=-o):this.copy(e),o>=1)return this._w=a,this._x=i,this._y=s,this._z=r,this;const l=1-o*o;if(l<=Number.EPSILON){const m=1-t;return this._w=m*a+t*this._w,this._x=m*i+t*this._x,this._y=m*s+t*this._y,this._z=m*r+t*this._z,this.normalize(),this}const c=Math.sqrt(l),u=Math.atan2(c,o),d=Math.sin((1-t)*u)/c,f=Math.sin(t*u)/c;return this._w=a*d+this._w*f,this._x=i*d+this._x*f,this._y=s*d+this._y*f,this._z=r*d+this._z*f,this._onChangeCallback(),this}slerpQuaternions(e,t,i){return this.copy(e).slerp(t,i)}random(){const e=2*Math.PI*Math.random(),t=2*Math.PI*Math.random(),i=Math.random(),s=Math.sqrt(1-i),r=Math.sqrt(i);return this.set(s*Math.sin(e),s*Math.cos(e),r*Math.sin(t),r*Math.cos(t))}equals(e){return e._x===this._x&&e._y===this._y&&e._z===this._z&&e._w===this._w}fromArray(e,t=0){return this._x=e[t],this._y=e[t+1],this._z=e[t+2],this._w=e[t+3],this._onChangeCallback(),this}toArray(e=[],t=0){return e[t]=this._x,e[t+1]=this._y,e[t+2]=this._z,e[t+3]=this._w,e}fromBufferAttribute(e,t){return this._x=e.getX(t),this._y=e.getY(t),this._z=e.getZ(t),this._w=e.getW(t),this._onChangeCallback(),this}toJSON(){return this.toArray()}_onChange(e){return this._onChangeCallback=e,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._w}}class N{constructor(e=0,t=0,i=0){N.prototype.isVector3=!0,this.x=e,this.y=t,this.z=i}set(e,t,i){return i===void 0&&(i=this.z),this.x=e,this.y=t,this.z=i,this}setScalar(e){return this.x=e,this.y=e,this.z=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setZ(e){return this.z=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;case 2:this.z=t;break;default:throw new Error("index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;case 2:return this.z;default:throw new Error("index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y,this.z)}copy(e){return this.x=e.x,this.y=e.y,this.z=e.z,this}add(e){return this.x+=e.x,this.y+=e.y,this.z+=e.z,this}addScalar(e){return this.x+=e,this.y+=e,this.z+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this.z=e.z+t.z,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this.z+=e.z*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this.z-=e.z,this}subScalar(e){return this.x-=e,this.y-=e,this.z-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this.z=e.z-t.z,this}multiply(e){return this.x*=e.x,this.y*=e.y,this.z*=e.z,this}multiplyScalar(e){return this.x*=e,this.y*=e,this.z*=e,this}multiplyVectors(e,t){return this.x=e.x*t.x,this.y=e.y*t.y,this.z=e.z*t.z,this}applyEuler(e){return this.applyQuaternion(Ro.setFromEuler(e))}applyAxisAngle(e,t){return this.applyQuaternion(Ro.setFromAxisAngle(e,t))}applyMatrix3(e){const t=this.x,i=this.y,s=this.z,r=e.elements;return this.x=r[0]*t+r[3]*i+r[6]*s,this.y=r[1]*t+r[4]*i+r[7]*s,this.z=r[2]*t+r[5]*i+r[8]*s,this}applyNormalMatrix(e){return this.applyMatrix3(e).normalize()}applyMatrix4(e){const t=this.x,i=this.y,s=this.z,r=e.elements,a=1/(r[3]*t+r[7]*i+r[11]*s+r[15]);return this.x=(r[0]*t+r[4]*i+r[8]*s+r[12])*a,this.y=(r[1]*t+r[5]*i+r[9]*s+r[13])*a,this.z=(r[2]*t+r[6]*i+r[10]*s+r[14])*a,this}applyQuaternion(e){const t=this.x,i=this.y,s=this.z,r=e.x,a=e.y,o=e.z,l=e.w,c=2*(a*s-o*i),u=2*(o*t-r*s),d=2*(r*i-a*t);return this.x=t+l*c+a*d-o*u,this.y=i+l*u+o*c-r*d,this.z=s+l*d+r*u-a*c,this}project(e){return this.applyMatrix4(e.matrixWorldInverse).applyMatrix4(e.projectionMatrix)}unproject(e){return this.applyMatrix4(e.projectionMatrixInverse).applyMatrix4(e.matrixWorld)}transformDirection(e){const t=this.x,i=this.y,s=this.z,r=e.elements;return this.x=r[0]*t+r[4]*i+r[8]*s,this.y=r[1]*t+r[5]*i+r[9]*s,this.z=r[2]*t+r[6]*i+r[10]*s,this.normalize()}divide(e){return this.x/=e.x,this.y/=e.y,this.z/=e.z,this}divideScalar(e){return this.multiplyScalar(1/e)}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this.z=Math.min(this.z,e.z),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this.z=Math.max(this.z,e.z),this}clamp(e,t){return this.x=Math.max(e.x,Math.min(t.x,this.x)),this.y=Math.max(e.y,Math.min(t.y,this.y)),this.z=Math.max(e.z,Math.min(t.z,this.z)),this}clampScalar(e,t){return this.x=Math.max(e,Math.min(t,this.x)),this.y=Math.max(e,Math.min(t,this.y)),this.z=Math.max(e,Math.min(t,this.z)),this}clampLength(e,t){const i=this.length();return this.divideScalar(i||1).multiplyScalar(Math.max(e,Math.min(t,i)))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this}dot(e){return this.x*e.x+this.y*e.y+this.z*e.z}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)}normalize(){return this.divideScalar(this.length()||1)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this.z+=(e.z-this.z)*t,this}lerpVectors(e,t,i){return this.x=e.x+(t.x-e.x)*i,this.y=e.y+(t.y-e.y)*i,this.z=e.z+(t.z-e.z)*i,this}cross(e){return this.crossVectors(this,e)}crossVectors(e,t){const i=e.x,s=e.y,r=e.z,a=t.x,o=t.y,l=t.z;return this.x=s*l-r*o,this.y=r*a-i*l,this.z=i*o-s*a,this}projectOnVector(e){const t=e.lengthSq();if(t===0)return this.set(0,0,0);const i=e.dot(this)/t;return this.copy(e).multiplyScalar(i)}projectOnPlane(e){return Er.copy(this).projectOnVector(e),this.sub(Er)}reflect(e){return this.sub(Er.copy(e).multiplyScalar(2*this.dot(e)))}angleTo(e){const t=Math.sqrt(this.lengthSq()*e.lengthSq());if(t===0)return Math.PI/2;const i=this.dot(e)/t;return Math.acos(At(i,-1,1))}distanceTo(e){return Math.sqrt(this.distanceToSquared(e))}distanceToSquared(e){const t=this.x-e.x,i=this.y-e.y,s=this.z-e.z;return t*t+i*i+s*s}manhattanDistanceTo(e){return Math.abs(this.x-e.x)+Math.abs(this.y-e.y)+Math.abs(this.z-e.z)}setFromSpherical(e){return this.setFromSphericalCoords(e.radius,e.phi,e.theta)}setFromSphericalCoords(e,t,i){const s=Math.sin(t)*e;return this.x=s*Math.sin(i),this.y=Math.cos(t)*e,this.z=s*Math.cos(i),this}setFromCylindrical(e){return this.setFromCylindricalCoords(e.radius,e.theta,e.y)}setFromCylindricalCoords(e,t,i){return this.x=e*Math.sin(t),this.y=i,this.z=e*Math.cos(t),this}setFromMatrixPosition(e){const t=e.elements;return this.x=t[12],this.y=t[13],this.z=t[14],this}setFromMatrixScale(e){const t=this.setFromMatrixColumn(e,0).length(),i=this.setFromMatrixColumn(e,1).length(),s=this.setFromMatrixColumn(e,2).length();return this.x=t,this.y=i,this.z=s,this}setFromMatrixColumn(e,t){return this.fromArray(e.elements,t*4)}setFromMatrix3Column(e,t){return this.fromArray(e.elements,t*3)}setFromEuler(e){return this.x=e._x,this.y=e._y,this.z=e._z,this}setFromColor(e){return this.x=e.r,this.y=e.g,this.z=e.b,this}equals(e){return e.x===this.x&&e.y===this.y&&e.z===this.z}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this.z=e[t+2],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e[t+2]=this.z,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this.z=e.getZ(t),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this}randomDirection(){const e=Math.random()*Math.PI*2,t=Math.random()*2-1,i=Math.sqrt(1-t*t);return this.x=i*Math.cos(e),this.y=t,this.z=i*Math.sin(e),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z}}const Er=new N,Ro=new qi;class vs{constructor(e=new N(1/0,1/0,1/0),t=new N(-1/0,-1/0,-1/0)){this.isBox3=!0,this.min=e,this.max=t}set(e,t){return this.min.copy(e),this.max.copy(t),this}setFromArray(e){this.makeEmpty();for(let t=0,i=e.length;t<i;t+=3)this.expandByPoint(qt.fromArray(e,t));return this}setFromBufferAttribute(e){this.makeEmpty();for(let t=0,i=e.count;t<i;t++)this.expandByPoint(qt.fromBufferAttribute(e,t));return this}setFromPoints(e){this.makeEmpty();for(let t=0,i=e.length;t<i;t++)this.expandByPoint(e[t]);return this}setFromCenterAndSize(e,t){const i=qt.copy(t).multiplyScalar(.5);return this.min.copy(e).sub(i),this.max.copy(e).add(i),this}setFromObject(e,t=!1){return this.makeEmpty(),this.expandByObject(e,t)}clone(){return new this.constructor().copy(this)}copy(e){return this.min.copy(e.min),this.max.copy(e.max),this}makeEmpty(){return this.min.x=this.min.y=this.min.z=1/0,this.max.x=this.max.y=this.max.z=-1/0,this}isEmpty(){return this.max.x<this.min.x||this.max.y<this.min.y||this.max.z<this.min.z}getCenter(e){return this.isEmpty()?e.set(0,0,0):e.addVectors(this.min,this.max).multiplyScalar(.5)}getSize(e){return this.isEmpty()?e.set(0,0,0):e.subVectors(this.max,this.min)}expandByPoint(e){return this.min.min(e),this.max.max(e),this}expandByVector(e){return this.min.sub(e),this.max.add(e),this}expandByScalar(e){return this.min.addScalar(-e),this.max.addScalar(e),this}expandByObject(e,t=!1){e.updateWorldMatrix(!1,!1);const i=e.geometry;if(i!==void 0){const r=i.getAttribute("position");if(t===!0&&r!==void 0&&e.isInstancedMesh!==!0)for(let a=0,o=r.count;a<o;a++)e.isMesh===!0?e.getVertexPosition(a,qt):qt.fromBufferAttribute(r,a),qt.applyMatrix4(e.matrixWorld),this.expandByPoint(qt);else e.boundingBox!==void 0?(e.boundingBox===null&&e.computeBoundingBox(),Ts.copy(e.boundingBox)):(i.boundingBox===null&&i.computeBoundingBox(),Ts.copy(i.boundingBox)),Ts.applyMatrix4(e.matrixWorld),this.union(Ts)}const s=e.children;for(let r=0,a=s.length;r<a;r++)this.expandByObject(s[r],t);return this}containsPoint(e){return e.x>=this.min.x&&e.x<=this.max.x&&e.y>=this.min.y&&e.y<=this.max.y&&e.z>=this.min.z&&e.z<=this.max.z}containsBox(e){return this.min.x<=e.min.x&&e.max.x<=this.max.x&&this.min.y<=e.min.y&&e.max.y<=this.max.y&&this.min.z<=e.min.z&&e.max.z<=this.max.z}getParameter(e,t){return t.set((e.x-this.min.x)/(this.max.x-this.min.x),(e.y-this.min.y)/(this.max.y-this.min.y),(e.z-this.min.z)/(this.max.z-this.min.z))}intersectsBox(e){return e.max.x>=this.min.x&&e.min.x<=this.max.x&&e.max.y>=this.min.y&&e.min.y<=this.max.y&&e.max.z>=this.min.z&&e.min.z<=this.max.z}intersectsSphere(e){return this.clampPoint(e.center,qt),qt.distanceToSquared(e.center)<=e.radius*e.radius}intersectsPlane(e){let t,i;return e.normal.x>0?(t=e.normal.x*this.min.x,i=e.normal.x*this.max.x):(t=e.normal.x*this.max.x,i=e.normal.x*this.min.x),e.normal.y>0?(t+=e.normal.y*this.min.y,i+=e.normal.y*this.max.y):(t+=e.normal.y*this.max.y,i+=e.normal.y*this.min.y),e.normal.z>0?(t+=e.normal.z*this.min.z,i+=e.normal.z*this.max.z):(t+=e.normal.z*this.max.z,i+=e.normal.z*this.min.z),t<=-e.constant&&i>=-e.constant}intersectsTriangle(e){if(this.isEmpty())return!1;this.getCenter(Ji),As.subVectors(this.max,Ji),di.subVectors(e.a,Ji),pi.subVectors(e.b,Ji),mi.subVectors(e.c,Ji),Cn.subVectors(pi,di),Pn.subVectors(mi,pi),qn.subVectors(di,mi);let t=[0,-Cn.z,Cn.y,0,-Pn.z,Pn.y,0,-qn.z,qn.y,Cn.z,0,-Cn.x,Pn.z,0,-Pn.x,qn.z,0,-qn.x,-Cn.y,Cn.x,0,-Pn.y,Pn.x,0,-qn.y,qn.x,0];return!Tr(t,di,pi,mi,As)||(t=[1,0,0,0,1,0,0,0,1],!Tr(t,di,pi,mi,As))?!1:(bs.crossVectors(Cn,Pn),t=[bs.x,bs.y,bs.z],Tr(t,di,pi,mi,As))}clampPoint(e,t){return t.copy(e).clamp(this.min,this.max)}distanceToPoint(e){return this.clampPoint(e,qt).distanceTo(e)}getBoundingSphere(e){return this.isEmpty()?e.makeEmpty():(this.getCenter(e.center),e.radius=this.getSize(qt).length()*.5),e}intersect(e){return this.min.max(e.min),this.max.min(e.max),this.isEmpty()&&this.makeEmpty(),this}union(e){return this.min.min(e.min),this.max.max(e.max),this}applyMatrix4(e){return this.isEmpty()?this:(un[0].set(this.min.x,this.min.y,this.min.z).applyMatrix4(e),un[1].set(this.min.x,this.min.y,this.max.z).applyMatrix4(e),un[2].set(this.min.x,this.max.y,this.min.z).applyMatrix4(e),un[3].set(this.min.x,this.max.y,this.max.z).applyMatrix4(e),un[4].set(this.max.x,this.min.y,this.min.z).applyMatrix4(e),un[5].set(this.max.x,this.min.y,this.max.z).applyMatrix4(e),un[6].set(this.max.x,this.max.y,this.min.z).applyMatrix4(e),un[7].set(this.max.x,this.max.y,this.max.z).applyMatrix4(e),this.setFromPoints(un),this)}translate(e){return this.min.add(e),this.max.add(e),this}equals(e){return e.min.equals(this.min)&&e.max.equals(this.max)}}const un=[new N,new N,new N,new N,new N,new N,new N,new N],qt=new N,Ts=new vs,di=new N,pi=new N,mi=new N,Cn=new N,Pn=new N,qn=new N,Ji=new N,As=new N,bs=new N,Yn=new N;function Tr(n,e,t,i,s){for(let r=0,a=n.length-3;r<=a;r+=3){Yn.fromArray(n,r);const o=s.x*Math.abs(Yn.x)+s.y*Math.abs(Yn.y)+s.z*Math.abs(Yn.z),l=e.dot(Yn),c=t.dot(Yn),u=i.dot(Yn);if(Math.max(-Math.max(l,c,u),Math.min(l,c,u))>o)return!1}return!0}const Fu=new vs,Qi=new N,Ar=new N;class dr{constructor(e=new N,t=-1){this.isSphere=!0,this.center=e,this.radius=t}set(e,t){return this.center.copy(e),this.radius=t,this}setFromPoints(e,t){const i=this.center;t!==void 0?i.copy(t):Fu.setFromPoints(e).getCenter(i);let s=0;for(let r=0,a=e.length;r<a;r++)s=Math.max(s,i.distanceToSquared(e[r]));return this.radius=Math.sqrt(s),this}copy(e){return this.center.copy(e.center),this.radius=e.radius,this}isEmpty(){return this.radius<0}makeEmpty(){return this.center.set(0,0,0),this.radius=-1,this}containsPoint(e){return e.distanceToSquared(this.center)<=this.radius*this.radius}distanceToPoint(e){return e.distanceTo(this.center)-this.radius}intersectsSphere(e){const t=this.radius+e.radius;return e.center.distanceToSquared(this.center)<=t*t}intersectsBox(e){return e.intersectsSphere(this)}intersectsPlane(e){return Math.abs(e.distanceToPoint(this.center))<=this.radius}clampPoint(e,t){const i=this.center.distanceToSquared(e);return t.copy(e),i>this.radius*this.radius&&(t.sub(this.center).normalize(),t.multiplyScalar(this.radius).add(this.center)),t}getBoundingBox(e){return this.isEmpty()?(e.makeEmpty(),e):(e.set(this.center,this.center),e.expandByScalar(this.radius),e)}applyMatrix4(e){return this.center.applyMatrix4(e),this.radius=this.radius*e.getMaxScaleOnAxis(),this}translate(e){return this.center.add(e),this}expandByPoint(e){if(this.isEmpty())return this.center.copy(e),this.radius=0,this;Qi.subVectors(e,this.center);const t=Qi.lengthSq();if(t>this.radius*this.radius){const i=Math.sqrt(t),s=(i-this.radius)*.5;this.center.addScaledVector(Qi,s/i),this.radius+=s}return this}union(e){return e.isEmpty()?this:this.isEmpty()?(this.copy(e),this):(this.center.equals(e.center)===!0?this.radius=Math.max(this.radius,e.radius):(Ar.subVectors(e.center,this.center).setLength(e.radius),this.expandByPoint(Qi.copy(e.center).add(Ar)),this.expandByPoint(Qi.copy(e.center).sub(Ar))),this)}equals(e){return e.center.equals(this.center)&&e.radius===this.radius}clone(){return new this.constructor().copy(this)}}const hn=new N,br=new N,ws=new N,Dn=new N,wr=new N,Rs=new N,Rr=new N;class Vl{constructor(e=new N,t=new N(0,0,-1)){this.origin=e,this.direction=t}set(e,t){return this.origin.copy(e),this.direction.copy(t),this}copy(e){return this.origin.copy(e.origin),this.direction.copy(e.direction),this}at(e,t){return t.copy(this.origin).addScaledVector(this.direction,e)}lookAt(e){return this.direction.copy(e).sub(this.origin).normalize(),this}recast(e){return this.origin.copy(this.at(e,hn)),this}closestPointToPoint(e,t){t.subVectors(e,this.origin);const i=t.dot(this.direction);return i<0?t.copy(this.origin):t.copy(this.origin).addScaledVector(this.direction,i)}distanceToPoint(e){return Math.sqrt(this.distanceSqToPoint(e))}distanceSqToPoint(e){const t=hn.subVectors(e,this.origin).dot(this.direction);return t<0?this.origin.distanceToSquared(e):(hn.copy(this.origin).addScaledVector(this.direction,t),hn.distanceToSquared(e))}distanceSqToSegment(e,t,i,s){br.copy(e).add(t).multiplyScalar(.5),ws.copy(t).sub(e).normalize(),Dn.copy(this.origin).sub(br);const r=e.distanceTo(t)*.5,a=-this.direction.dot(ws),o=Dn.dot(this.direction),l=-Dn.dot(ws),c=Dn.lengthSq(),u=Math.abs(1-a*a);let d,f,m,g;if(u>0)if(d=a*l-o,f=a*o-l,g=r*u,d>=0)if(f>=-g)if(f<=g){const _=1/u;d*=_,f*=_,m=d*(d+a*f+2*o)+f*(a*d+f+2*l)+c}else f=r,d=Math.max(0,-(a*f+o)),m=-d*d+f*(f+2*l)+c;else f=-r,d=Math.max(0,-(a*f+o)),m=-d*d+f*(f+2*l)+c;else f<=-g?(d=Math.max(0,-(-a*r+o)),f=d>0?-r:Math.min(Math.max(-r,-l),r),m=-d*d+f*(f+2*l)+c):f<=g?(d=0,f=Math.min(Math.max(-r,-l),r),m=f*(f+2*l)+c):(d=Math.max(0,-(a*r+o)),f=d>0?r:Math.min(Math.max(-r,-l),r),m=-d*d+f*(f+2*l)+c);else f=a>0?-r:r,d=Math.max(0,-(a*f+o)),m=-d*d+f*(f+2*l)+c;return i&&i.copy(this.origin).addScaledVector(this.direction,d),s&&s.copy(br).addScaledVector(ws,f),m}intersectSphere(e,t){hn.subVectors(e.center,this.origin);const i=hn.dot(this.direction),s=hn.dot(hn)-i*i,r=e.radius*e.radius;if(s>r)return null;const a=Math.sqrt(r-s),o=i-a,l=i+a;return l<0?null:o<0?this.at(l,t):this.at(o,t)}intersectsSphere(e){return this.distanceSqToPoint(e.center)<=e.radius*e.radius}distanceToPlane(e){const t=e.normal.dot(this.direction);if(t===0)return e.distanceToPoint(this.origin)===0?0:null;const i=-(this.origin.dot(e.normal)+e.constant)/t;return i>=0?i:null}intersectPlane(e,t){const i=this.distanceToPlane(e);return i===null?null:this.at(i,t)}intersectsPlane(e){const t=e.distanceToPoint(this.origin);return t===0||e.normal.dot(this.direction)*t<0}intersectBox(e,t){let i,s,r,a,o,l;const c=1/this.direction.x,u=1/this.direction.y,d=1/this.direction.z,f=this.origin;return c>=0?(i=(e.min.x-f.x)*c,s=(e.max.x-f.x)*c):(i=(e.max.x-f.x)*c,s=(e.min.x-f.x)*c),u>=0?(r=(e.min.y-f.y)*u,a=(e.max.y-f.y)*u):(r=(e.max.y-f.y)*u,a=(e.min.y-f.y)*u),i>a||r>s||((r>i||isNaN(i))&&(i=r),(a<s||isNaN(s))&&(s=a),d>=0?(o=(e.min.z-f.z)*d,l=(e.max.z-f.z)*d):(o=(e.max.z-f.z)*d,l=(e.min.z-f.z)*d),i>l||o>s)||((o>i||i!==i)&&(i=o),(l<s||s!==s)&&(s=l),s<0)?null:this.at(i>=0?i:s,t)}intersectsBox(e){return this.intersectBox(e,hn)!==null}intersectTriangle(e,t,i,s,r){wr.subVectors(t,e),Rs.subVectors(i,e),Rr.crossVectors(wr,Rs);let a=this.direction.dot(Rr),o;if(a>0){if(s)return null;o=1}else if(a<0)o=-1,a=-a;else return null;Dn.subVectors(this.origin,e);const l=o*this.direction.dot(Rs.crossVectors(Dn,Rs));if(l<0)return null;const c=o*this.direction.dot(wr.cross(Dn));if(c<0||l+c>a)return null;const u=-o*Dn.dot(Rr);return u<0?null:this.at(u/a,r)}applyMatrix4(e){return this.origin.applyMatrix4(e),this.direction.transformDirection(e),this}equals(e){return e.origin.equals(this.origin)&&e.direction.equals(this.direction)}clone(){return new this.constructor().copy(this)}}class rt{constructor(e,t,i,s,r,a,o,l,c,u,d,f,m,g,_,p){rt.prototype.isMatrix4=!0,this.elements=[1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1],e!==void 0&&this.set(e,t,i,s,r,a,o,l,c,u,d,f,m,g,_,p)}set(e,t,i,s,r,a,o,l,c,u,d,f,m,g,_,p){const h=this.elements;return h[0]=e,h[4]=t,h[8]=i,h[12]=s,h[1]=r,h[5]=a,h[9]=o,h[13]=l,h[2]=c,h[6]=u,h[10]=d,h[14]=f,h[3]=m,h[7]=g,h[11]=_,h[15]=p,this}identity(){return this.set(1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1),this}clone(){return new rt().fromArray(this.elements)}copy(e){const t=this.elements,i=e.elements;return t[0]=i[0],t[1]=i[1],t[2]=i[2],t[3]=i[3],t[4]=i[4],t[5]=i[5],t[6]=i[6],t[7]=i[7],t[8]=i[8],t[9]=i[9],t[10]=i[10],t[11]=i[11],t[12]=i[12],t[13]=i[13],t[14]=i[14],t[15]=i[15],this}copyPosition(e){const t=this.elements,i=e.elements;return t[12]=i[12],t[13]=i[13],t[14]=i[14],this}setFromMatrix3(e){const t=e.elements;return this.set(t[0],t[3],t[6],0,t[1],t[4],t[7],0,t[2],t[5],t[8],0,0,0,0,1),this}extractBasis(e,t,i){return e.setFromMatrixColumn(this,0),t.setFromMatrixColumn(this,1),i.setFromMatrixColumn(this,2),this}makeBasis(e,t,i){return this.set(e.x,t.x,i.x,0,e.y,t.y,i.y,0,e.z,t.z,i.z,0,0,0,0,1),this}extractRotation(e){const t=this.elements,i=e.elements,s=1/gi.setFromMatrixColumn(e,0).length(),r=1/gi.setFromMatrixColumn(e,1).length(),a=1/gi.setFromMatrixColumn(e,2).length();return t[0]=i[0]*s,t[1]=i[1]*s,t[2]=i[2]*s,t[3]=0,t[4]=i[4]*r,t[5]=i[5]*r,t[6]=i[6]*r,t[7]=0,t[8]=i[8]*a,t[9]=i[9]*a,t[10]=i[10]*a,t[11]=0,t[12]=0,t[13]=0,t[14]=0,t[15]=1,this}makeRotationFromEuler(e){const t=this.elements,i=e.x,s=e.y,r=e.z,a=Math.cos(i),o=Math.sin(i),l=Math.cos(s),c=Math.sin(s),u=Math.cos(r),d=Math.sin(r);if(e.order==="XYZ"){const f=a*u,m=a*d,g=o*u,_=o*d;t[0]=l*u,t[4]=-l*d,t[8]=c,t[1]=m+g*c,t[5]=f-_*c,t[9]=-o*l,t[2]=_-f*c,t[6]=g+m*c,t[10]=a*l}else if(e.order==="YXZ"){const f=l*u,m=l*d,g=c*u,_=c*d;t[0]=f+_*o,t[4]=g*o-m,t[8]=a*c,t[1]=a*d,t[5]=a*u,t[9]=-o,t[2]=m*o-g,t[6]=_+f*o,t[10]=a*l}else if(e.order==="ZXY"){const f=l*u,m=l*d,g=c*u,_=c*d;t[0]=f-_*o,t[4]=-a*d,t[8]=g+m*o,t[1]=m+g*o,t[5]=a*u,t[9]=_-f*o,t[2]=-a*c,t[6]=o,t[10]=a*l}else if(e.order==="ZYX"){const f=a*u,m=a*d,g=o*u,_=o*d;t[0]=l*u,t[4]=g*c-m,t[8]=f*c+_,t[1]=l*d,t[5]=_*c+f,t[9]=m*c-g,t[2]=-c,t[6]=o*l,t[10]=a*l}else if(e.order==="YZX"){const f=a*l,m=a*c,g=o*l,_=o*c;t[0]=l*u,t[4]=_-f*d,t[8]=g*d+m,t[1]=d,t[5]=a*u,t[9]=-o*u,t[2]=-c*u,t[6]=m*d+g,t[10]=f-_*d}else if(e.order==="XZY"){const f=a*l,m=a*c,g=o*l,_=o*c;t[0]=l*u,t[4]=-d,t[8]=c*u,t[1]=f*d+_,t[5]=a*u,t[9]=m*d-g,t[2]=g*d-m,t[6]=o*u,t[10]=_*d+f}return t[3]=0,t[7]=0,t[11]=0,t[12]=0,t[13]=0,t[14]=0,t[15]=1,this}makeRotationFromQuaternion(e){return this.compose(Ou,e,Bu)}lookAt(e,t,i){const s=this.elements;return Lt.subVectors(e,t),Lt.lengthSq()===0&&(Lt.z=1),Lt.normalize(),Ln.crossVectors(i,Lt),Ln.lengthSq()===0&&(Math.abs(i.z)===1?Lt.x+=1e-4:Lt.z+=1e-4,Lt.normalize(),Ln.crossVectors(i,Lt)),Ln.normalize(),Cs.crossVectors(Lt,Ln),s[0]=Ln.x,s[4]=Cs.x,s[8]=Lt.x,s[1]=Ln.y,s[5]=Cs.y,s[9]=Lt.y,s[2]=Ln.z,s[6]=Cs.z,s[10]=Lt.z,this}multiply(e){return this.multiplyMatrices(this,e)}premultiply(e){return this.multiplyMatrices(e,this)}multiplyMatrices(e,t){const i=e.elements,s=t.elements,r=this.elements,a=i[0],o=i[4],l=i[8],c=i[12],u=i[1],d=i[5],f=i[9],m=i[13],g=i[2],_=i[6],p=i[10],h=i[14],A=i[3],S=i[7],M=i[11],P=i[15],b=s[0],w=s[4],L=s[8],E=s[12],x=s[1],C=s[5],V=s[9],F=s[13],W=s[2],K=s[6],G=s[10],Z=s[14],H=s[3],ne=s[7],J=s[11],re=s[15];return r[0]=a*b+o*x+l*W+c*H,r[4]=a*w+o*C+l*K+c*ne,r[8]=a*L+o*V+l*G+c*J,r[12]=a*E+o*F+l*Z+c*re,r[1]=u*b+d*x+f*W+m*H,r[5]=u*w+d*C+f*K+m*ne,r[9]=u*L+d*V+f*G+m*J,r[13]=u*E+d*F+f*Z+m*re,r[2]=g*b+_*x+p*W+h*H,r[6]=g*w+_*C+p*K+h*ne,r[10]=g*L+_*V+p*G+h*J,r[14]=g*E+_*F+p*Z+h*re,r[3]=A*b+S*x+M*W+P*H,r[7]=A*w+S*C+M*K+P*ne,r[11]=A*L+S*V+M*G+P*J,r[15]=A*E+S*F+M*Z+P*re,this}multiplyScalar(e){const t=this.elements;return t[0]*=e,t[4]*=e,t[8]*=e,t[12]*=e,t[1]*=e,t[5]*=e,t[9]*=e,t[13]*=e,t[2]*=e,t[6]*=e,t[10]*=e,t[14]*=e,t[3]*=e,t[7]*=e,t[11]*=e,t[15]*=e,this}determinant(){const e=this.elements,t=e[0],i=e[4],s=e[8],r=e[12],a=e[1],o=e[5],l=e[9],c=e[13],u=e[2],d=e[6],f=e[10],m=e[14],g=e[3],_=e[7],p=e[11],h=e[15];return g*(+r*l*d-s*c*d-r*o*f+i*c*f+s*o*m-i*l*m)+_*(+t*l*m-t*c*f+r*a*f-s*a*m+s*c*u-r*l*u)+p*(+t*c*d-t*o*m-r*a*d+i*a*m+r*o*u-i*c*u)+h*(-s*o*u-t*l*d+t*o*f+s*a*d-i*a*f+i*l*u)}transpose(){const e=this.elements;let t;return t=e[1],e[1]=e[4],e[4]=t,t=e[2],e[2]=e[8],e[8]=t,t=e[6],e[6]=e[9],e[9]=t,t=e[3],e[3]=e[12],e[12]=t,t=e[7],e[7]=e[13],e[13]=t,t=e[11],e[11]=e[14],e[14]=t,this}setPosition(e,t,i){const s=this.elements;return e.isVector3?(s[12]=e.x,s[13]=e.y,s[14]=e.z):(s[12]=e,s[13]=t,s[14]=i),this}invert(){const e=this.elements,t=e[0],i=e[1],s=e[2],r=e[3],a=e[4],o=e[5],l=e[6],c=e[7],u=e[8],d=e[9],f=e[10],m=e[11],g=e[12],_=e[13],p=e[14],h=e[15],A=d*p*c-_*f*c+_*l*m-o*p*m-d*l*h+o*f*h,S=g*f*c-u*p*c-g*l*m+a*p*m+u*l*h-a*f*h,M=u*_*c-g*d*c+g*o*m-a*_*m-u*o*h+a*d*h,P=g*d*l-u*_*l-g*o*f+a*_*f+u*o*p-a*d*p,b=t*A+i*S+s*M+r*P;if(b===0)return this.set(0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0);const w=1/b;return e[0]=A*w,e[1]=(_*f*r-d*p*r-_*s*m+i*p*m+d*s*h-i*f*h)*w,e[2]=(o*p*r-_*l*r+_*s*c-i*p*c-o*s*h+i*l*h)*w,e[3]=(d*l*r-o*f*r-d*s*c+i*f*c+o*s*m-i*l*m)*w,e[4]=S*w,e[5]=(u*p*r-g*f*r+g*s*m-t*p*m-u*s*h+t*f*h)*w,e[6]=(g*l*r-a*p*r-g*s*c+t*p*c+a*s*h-t*l*h)*w,e[7]=(a*f*r-u*l*r+u*s*c-t*f*c-a*s*m+t*l*m)*w,e[8]=M*w,e[9]=(g*d*r-u*_*r-g*i*m+t*_*m+u*i*h-t*d*h)*w,e[10]=(a*_*r-g*o*r+g*i*c-t*_*c-a*i*h+t*o*h)*w,e[11]=(u*o*r-a*d*r-u*i*c+t*d*c+a*i*m-t*o*m)*w,e[12]=P*w,e[13]=(u*_*s-g*d*s+g*i*f-t*_*f-u*i*p+t*d*p)*w,e[14]=(g*o*s-a*_*s-g*i*l+t*_*l+a*i*p-t*o*p)*w,e[15]=(a*d*s-u*o*s+u*i*l-t*d*l-a*i*f+t*o*f)*w,this}scale(e){const t=this.elements,i=e.x,s=e.y,r=e.z;return t[0]*=i,t[4]*=s,t[8]*=r,t[1]*=i,t[5]*=s,t[9]*=r,t[2]*=i,t[6]*=s,t[10]*=r,t[3]*=i,t[7]*=s,t[11]*=r,this}getMaxScaleOnAxis(){const e=this.elements,t=e[0]*e[0]+e[1]*e[1]+e[2]*e[2],i=e[4]*e[4]+e[5]*e[5]+e[6]*e[6],s=e[8]*e[8]+e[9]*e[9]+e[10]*e[10];return Math.sqrt(Math.max(t,i,s))}makeTranslation(e,t,i){return e.isVector3?this.set(1,0,0,e.x,0,1,0,e.y,0,0,1,e.z,0,0,0,1):this.set(1,0,0,e,0,1,0,t,0,0,1,i,0,0,0,1),this}makeRotationX(e){const t=Math.cos(e),i=Math.sin(e);return this.set(1,0,0,0,0,t,-i,0,0,i,t,0,0,0,0,1),this}makeRotationY(e){const t=Math.cos(e),i=Math.sin(e);return this.set(t,0,i,0,0,1,0,0,-i,0,t,0,0,0,0,1),this}makeRotationZ(e){const t=Math.cos(e),i=Math.sin(e);return this.set(t,-i,0,0,i,t,0,0,0,0,1,0,0,0,0,1),this}makeRotationAxis(e,t){const i=Math.cos(t),s=Math.sin(t),r=1-i,a=e.x,o=e.y,l=e.z,c=r*a,u=r*o;return this.set(c*a+i,c*o-s*l,c*l+s*o,0,c*o+s*l,u*o+i,u*l-s*a,0,c*l-s*o,u*l+s*a,r*l*l+i,0,0,0,0,1),this}makeScale(e,t,i){return this.set(e,0,0,0,0,t,0,0,0,0,i,0,0,0,0,1),this}makeShear(e,t,i,s,r,a){return this.set(1,i,r,0,e,1,a,0,t,s,1,0,0,0,0,1),this}compose(e,t,i){const s=this.elements,r=t._x,a=t._y,o=t._z,l=t._w,c=r+r,u=a+a,d=o+o,f=r*c,m=r*u,g=r*d,_=a*u,p=a*d,h=o*d,A=l*c,S=l*u,M=l*d,P=i.x,b=i.y,w=i.z;return s[0]=(1-(_+h))*P,s[1]=(m+M)*P,s[2]=(g-S)*P,s[3]=0,s[4]=(m-M)*b,s[5]=(1-(f+h))*b,s[6]=(p+A)*b,s[7]=0,s[8]=(g+S)*w,s[9]=(p-A)*w,s[10]=(1-(f+_))*w,s[11]=0,s[12]=e.x,s[13]=e.y,s[14]=e.z,s[15]=1,this}decompose(e,t,i){const s=this.elements;let r=gi.set(s[0],s[1],s[2]).length();const a=gi.set(s[4],s[5],s[6]).length(),o=gi.set(s[8],s[9],s[10]).length();this.determinant()<0&&(r=-r),e.x=s[12],e.y=s[13],e.z=s[14],Yt.copy(this);const c=1/r,u=1/a,d=1/o;return Yt.elements[0]*=c,Yt.elements[1]*=c,Yt.elements[2]*=c,Yt.elements[4]*=u,Yt.elements[5]*=u,Yt.elements[6]*=u,Yt.elements[8]*=d,Yt.elements[9]*=d,Yt.elements[10]*=d,t.setFromRotationMatrix(Yt),i.x=r,i.y=a,i.z=o,this}makePerspective(e,t,i,s,r,a,o=gn){const l=this.elements,c=2*r/(t-e),u=2*r/(i-s),d=(t+e)/(t-e),f=(i+s)/(i-s);let m,g;if(o===gn)m=-(a+r)/(a-r),g=-2*a*r/(a-r);else if(o===sr)m=-a/(a-r),g=-a*r/(a-r);else throw new Error("THREE.Matrix4.makePerspective(): Invalid coordinate system: "+o);return l[0]=c,l[4]=0,l[8]=d,l[12]=0,l[1]=0,l[5]=u,l[9]=f,l[13]=0,l[2]=0,l[6]=0,l[10]=m,l[14]=g,l[3]=0,l[7]=0,l[11]=-1,l[15]=0,this}makeOrthographic(e,t,i,s,r,a,o=gn){const l=this.elements,c=1/(t-e),u=1/(i-s),d=1/(a-r),f=(t+e)*c,m=(i+s)*u;let g,_;if(o===gn)g=(a+r)*d,_=-2*d;else if(o===sr)g=r*d,_=-1*d;else throw new Error("THREE.Matrix4.makeOrthographic(): Invalid coordinate system: "+o);return l[0]=2*c,l[4]=0,l[8]=0,l[12]=-f,l[1]=0,l[5]=2*u,l[9]=0,l[13]=-m,l[2]=0,l[6]=0,l[10]=_,l[14]=-g,l[3]=0,l[7]=0,l[11]=0,l[15]=1,this}equals(e){const t=this.elements,i=e.elements;for(let s=0;s<16;s++)if(t[s]!==i[s])return!1;return!0}fromArray(e,t=0){for(let i=0;i<16;i++)this.elements[i]=e[i+t];return this}toArray(e=[],t=0){const i=this.elements;return e[t]=i[0],e[t+1]=i[1],e[t+2]=i[2],e[t+3]=i[3],e[t+4]=i[4],e[t+5]=i[5],e[t+6]=i[6],e[t+7]=i[7],e[t+8]=i[8],e[t+9]=i[9],e[t+10]=i[10],e[t+11]=i[11],e[t+12]=i[12],e[t+13]=i[13],e[t+14]=i[14],e[t+15]=i[15],e}}const gi=new N,Yt=new rt,Ou=new N(0,0,0),Bu=new N(1,1,1),Ln=new N,Cs=new N,Lt=new N,Co=new rt,Po=new qi;class yn{constructor(e=0,t=0,i=0,s=yn.DEFAULT_ORDER){this.isEuler=!0,this._x=e,this._y=t,this._z=i,this._order=s}get x(){return this._x}set x(e){this._x=e,this._onChangeCallback()}get y(){return this._y}set y(e){this._y=e,this._onChangeCallback()}get z(){return this._z}set z(e){this._z=e,this._onChangeCallback()}get order(){return this._order}set order(e){this._order=e,this._onChangeCallback()}set(e,t,i,s=this._order){return this._x=e,this._y=t,this._z=i,this._order=s,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._order)}copy(e){return this._x=e._x,this._y=e._y,this._z=e._z,this._order=e._order,this._onChangeCallback(),this}setFromRotationMatrix(e,t=this._order,i=!0){const s=e.elements,r=s[0],a=s[4],o=s[8],l=s[1],c=s[5],u=s[9],d=s[2],f=s[6],m=s[10];switch(t){case"XYZ":this._y=Math.asin(At(o,-1,1)),Math.abs(o)<.9999999?(this._x=Math.atan2(-u,m),this._z=Math.atan2(-a,r)):(this._x=Math.atan2(f,c),this._z=0);break;case"YXZ":this._x=Math.asin(-At(u,-1,1)),Math.abs(u)<.9999999?(this._y=Math.atan2(o,m),this._z=Math.atan2(l,c)):(this._y=Math.atan2(-d,r),this._z=0);break;case"ZXY":this._x=Math.asin(At(f,-1,1)),Math.abs(f)<.9999999?(this._y=Math.atan2(-d,m),this._z=Math.atan2(-a,c)):(this._y=0,this._z=Math.atan2(l,r));break;case"ZYX":this._y=Math.asin(-At(d,-1,1)),Math.abs(d)<.9999999?(this._x=Math.atan2(f,m),this._z=Math.atan2(l,r)):(this._x=0,this._z=Math.atan2(-a,c));break;case"YZX":this._z=Math.asin(At(l,-1,1)),Math.abs(l)<.9999999?(this._x=Math.atan2(-u,c),this._y=Math.atan2(-d,r)):(this._x=0,this._y=Math.atan2(o,m));break;case"XZY":this._z=Math.asin(-At(a,-1,1)),Math.abs(a)<.9999999?(this._x=Math.atan2(f,c),this._y=Math.atan2(o,r)):(this._x=Math.atan2(-u,m),this._y=0);break;default:console.warn("THREE.Euler: .setFromRotationMatrix() encountered an unknown order: "+t)}return this._order=t,i===!0&&this._onChangeCallback(),this}setFromQuaternion(e,t,i){return Co.makeRotationFromQuaternion(e),this.setFromRotationMatrix(Co,t,i)}setFromVector3(e,t=this._order){return this.set(e.x,e.y,e.z,t)}reorder(e){return Po.setFromEuler(this),this.setFromQuaternion(Po,e)}equals(e){return e._x===this._x&&e._y===this._y&&e._z===this._z&&e._order===this._order}fromArray(e){return this._x=e[0],this._y=e[1],this._z=e[2],e[3]!==void 0&&(this._order=e[3]),this._onChangeCallback(),this}toArray(e=[],t=0){return e[t]=this._x,e[t+1]=this._y,e[t+2]=this._z,e[t+3]=this._order,e}_onChange(e){return this._onChangeCallback=e,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._order}}yn.DEFAULT_ORDER="XYZ";class Wl{constructor(){this.mask=1}set(e){this.mask=(1<<e|0)>>>0}enable(e){this.mask|=1<<e|0}enableAll(){this.mask=-1}toggle(e){this.mask^=1<<e|0}disable(e){this.mask&=~(1<<e|0)}disableAll(){this.mask=0}test(e){return(this.mask&e.mask)!==0}isEnabled(e){return(this.mask&(1<<e|0))!==0}}let zu=0;const Do=new N,_i=new qi,fn=new rt,Ps=new N,es=new N,ku=new N,Gu=new qi,Lo=new N(1,0,0),Io=new N(0,1,0),Uo=new N(0,0,1),No={type:"added"},Hu={type:"removed"},vi={type:"childadded",child:null},Cr={type:"childremoved",child:null};class Ct extends Xi{constructor(){super(),this.isObject3D=!0,Object.defineProperty(this,"id",{value:zu++}),this.uuid=_s(),this.name="",this.type="Object3D",this.parent=null,this.children=[],this.up=Ct.DEFAULT_UP.clone();const e=new N,t=new yn,i=new qi,s=new N(1,1,1);function r(){i.setFromEuler(t,!1)}function a(){t.setFromQuaternion(i,void 0,!1)}t._onChange(r),i._onChange(a),Object.defineProperties(this,{position:{configurable:!0,enumerable:!0,value:e},rotation:{configurable:!0,enumerable:!0,value:t},quaternion:{configurable:!0,enumerable:!0,value:i},scale:{configurable:!0,enumerable:!0,value:s},modelViewMatrix:{value:new rt},normalMatrix:{value:new Ue}}),this.matrix=new rt,this.matrixWorld=new rt,this.matrixAutoUpdate=Ct.DEFAULT_MATRIX_AUTO_UPDATE,this.matrixWorldAutoUpdate=Ct.DEFAULT_MATRIX_WORLD_AUTO_UPDATE,this.matrixWorldNeedsUpdate=!1,this.layers=new Wl,this.visible=!0,this.castShadow=!1,this.receiveShadow=!1,this.frustumCulled=!0,this.renderOrder=0,this.animations=[],this.userData={}}onBeforeShadow(){}onAfterShadow(){}onBeforeRender(){}onAfterRender(){}applyMatrix4(e){this.matrixAutoUpdate&&this.updateMatrix(),this.matrix.premultiply(e),this.matrix.decompose(this.position,this.quaternion,this.scale)}applyQuaternion(e){return this.quaternion.premultiply(e),this}setRotationFromAxisAngle(e,t){this.quaternion.setFromAxisAngle(e,t)}setRotationFromEuler(e){this.quaternion.setFromEuler(e,!0)}setRotationFromMatrix(e){this.quaternion.setFromRotationMatrix(e)}setRotationFromQuaternion(e){this.quaternion.copy(e)}rotateOnAxis(e,t){return _i.setFromAxisAngle(e,t),this.quaternion.multiply(_i),this}rotateOnWorldAxis(e,t){return _i.setFromAxisAngle(e,t),this.quaternion.premultiply(_i),this}rotateX(e){return this.rotateOnAxis(Lo,e)}rotateY(e){return this.rotateOnAxis(Io,e)}rotateZ(e){return this.rotateOnAxis(Uo,e)}translateOnAxis(e,t){return Do.copy(e).applyQuaternion(this.quaternion),this.position.add(Do.multiplyScalar(t)),this}translateX(e){return this.translateOnAxis(Lo,e)}translateY(e){return this.translateOnAxis(Io,e)}translateZ(e){return this.translateOnAxis(Uo,e)}localToWorld(e){return this.updateWorldMatrix(!0,!1),e.applyMatrix4(this.matrixWorld)}worldToLocal(e){return this.updateWorldMatrix(!0,!1),e.applyMatrix4(fn.copy(this.matrixWorld).invert())}lookAt(e,t,i){e.isVector3?Ps.copy(e):Ps.set(e,t,i);const s=this.parent;this.updateWorldMatrix(!0,!1),es.setFromMatrixPosition(this.matrixWorld),this.isCamera||this.isLight?fn.lookAt(es,Ps,this.up):fn.lookAt(Ps,es,this.up),this.quaternion.setFromRotationMatrix(fn),s&&(fn.extractRotation(s.matrixWorld),_i.setFromRotationMatrix(fn),this.quaternion.premultiply(_i.invert()))}add(e){if(arguments.length>1){for(let t=0;t<arguments.length;t++)this.add(arguments[t]);return this}return e===this?(console.error("THREE.Object3D.add: object can't be added as a child of itself.",e),this):(e&&e.isObject3D?(e.removeFromParent(),e.parent=this,this.children.push(e),e.dispatchEvent(No),vi.child=e,this.dispatchEvent(vi),vi.child=null):console.error("THREE.Object3D.add: object not an instance of THREE.Object3D.",e),this)}remove(e){if(arguments.length>1){for(let i=0;i<arguments.length;i++)this.remove(arguments[i]);return this}const t=this.children.indexOf(e);return t!==-1&&(e.parent=null,this.children.splice(t,1),e.dispatchEvent(Hu),Cr.child=e,this.dispatchEvent(Cr),Cr.child=null),this}removeFromParent(){const e=this.parent;return e!==null&&e.remove(this),this}clear(){return this.remove(...this.children)}attach(e){return this.updateWorldMatrix(!0,!1),fn.copy(this.matrixWorld).invert(),e.parent!==null&&(e.parent.updateWorldMatrix(!0,!1),fn.multiply(e.parent.matrixWorld)),e.applyMatrix4(fn),e.removeFromParent(),e.parent=this,this.children.push(e),e.updateWorldMatrix(!1,!0),e.dispatchEvent(No),vi.child=e,this.dispatchEvent(vi),vi.child=null,this}getObjectById(e){return this.getObjectByProperty("id",e)}getObjectByName(e){return this.getObjectByProperty("name",e)}getObjectByProperty(e,t){if(this[e]===t)return this;for(let i=0,s=this.children.length;i<s;i++){const a=this.children[i].getObjectByProperty(e,t);if(a!==void 0)return a}}getObjectsByProperty(e,t,i=[]){this[e]===t&&i.push(this);const s=this.children;for(let r=0,a=s.length;r<a;r++)s[r].getObjectsByProperty(e,t,i);return i}getWorldPosition(e){return this.updateWorldMatrix(!0,!1),e.setFromMatrixPosition(this.matrixWorld)}getWorldQuaternion(e){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(es,e,ku),e}getWorldScale(e){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(es,Gu,e),e}getWorldDirection(e){this.updateWorldMatrix(!0,!1);const t=this.matrixWorld.elements;return e.set(t[8],t[9],t[10]).normalize()}raycast(){}traverse(e){e(this);const t=this.children;for(let i=0,s=t.length;i<s;i++)t[i].traverse(e)}traverseVisible(e){if(this.visible===!1)return;e(this);const t=this.children;for(let i=0,s=t.length;i<s;i++)t[i].traverseVisible(e)}traverseAncestors(e){const t=this.parent;t!==null&&(e(t),t.traverseAncestors(e))}updateMatrix(){this.matrix.compose(this.position,this.quaternion,this.scale),this.matrixWorldNeedsUpdate=!0}updateMatrixWorld(e){this.matrixAutoUpdate&&this.updateMatrix(),(this.matrixWorldNeedsUpdate||e)&&(this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),this.matrixWorldNeedsUpdate=!1,e=!0);const t=this.children;for(let i=0,s=t.length;i<s;i++)t[i].updateMatrixWorld(e)}updateWorldMatrix(e,t){const i=this.parent;if(e===!0&&i!==null&&i.updateWorldMatrix(!0,!1),this.matrixAutoUpdate&&this.updateMatrix(),this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),t===!0){const s=this.children;for(let r=0,a=s.length;r<a;r++)s[r].updateWorldMatrix(!1,!0)}}toJSON(e){const t=e===void 0||typeof e=="string",i={};t&&(e={geometries:{},materials:{},textures:{},images:{},shapes:{},skeletons:{},animations:{},nodes:{}},i.metadata={version:4.6,type:"Object",generator:"Object3D.toJSON"});const s={};s.uuid=this.uuid,s.type=this.type,this.name!==""&&(s.name=this.name),this.castShadow===!0&&(s.castShadow=!0),this.receiveShadow===!0&&(s.receiveShadow=!0),this.visible===!1&&(s.visible=!1),this.frustumCulled===!1&&(s.frustumCulled=!1),this.renderOrder!==0&&(s.renderOrder=this.renderOrder),Object.keys(this.userData).length>0&&(s.userData=this.userData),s.layers=this.layers.mask,s.matrix=this.matrix.toArray(),s.up=this.up.toArray(),this.matrixAutoUpdate===!1&&(s.matrixAutoUpdate=!1),this.isInstancedMesh&&(s.type="InstancedMesh",s.count=this.count,s.instanceMatrix=this.instanceMatrix.toJSON(),this.instanceColor!==null&&(s.instanceColor=this.instanceColor.toJSON())),this.isBatchedMesh&&(s.type="BatchedMesh",s.perObjectFrustumCulled=this.perObjectFrustumCulled,s.sortObjects=this.sortObjects,s.drawRanges=this._drawRanges,s.reservedRanges=this._reservedRanges,s.visibility=this._visibility,s.active=this._active,s.bounds=this._bounds.map(o=>({boxInitialized:o.boxInitialized,boxMin:o.box.min.toArray(),boxMax:o.box.max.toArray(),sphereInitialized:o.sphereInitialized,sphereRadius:o.sphere.radius,sphereCenter:o.sphere.center.toArray()})),s.maxInstanceCount=this._maxInstanceCount,s.maxVertexCount=this._maxVertexCount,s.maxIndexCount=this._maxIndexCount,s.geometryInitialized=this._geometryInitialized,s.geometryCount=this._geometryCount,s.matricesTexture=this._matricesTexture.toJSON(e),this._colorsTexture!==null&&(s.colorsTexture=this._colorsTexture.toJSON(e)),this.boundingSphere!==null&&(s.boundingSphere={center:s.boundingSphere.center.toArray(),radius:s.boundingSphere.radius}),this.boundingBox!==null&&(s.boundingBox={min:s.boundingBox.min.toArray(),max:s.boundingBox.max.toArray()}));function r(o,l){return o[l.uuid]===void 0&&(o[l.uuid]=l.toJSON(e)),l.uuid}if(this.isScene)this.background&&(this.background.isColor?s.background=this.background.toJSON():this.background.isTexture&&(s.background=this.background.toJSON(e).uuid)),this.environment&&this.environment.isTexture&&this.environment.isRenderTargetTexture!==!0&&(s.environment=this.environment.toJSON(e).uuid);else if(this.isMesh||this.isLine||this.isPoints){s.geometry=r(e.geometries,this.geometry);const o=this.geometry.parameters;if(o!==void 0&&o.shapes!==void 0){const l=o.shapes;if(Array.isArray(l))for(let c=0,u=l.length;c<u;c++){const d=l[c];r(e.shapes,d)}else r(e.shapes,l)}}if(this.isSkinnedMesh&&(s.bindMode=this.bindMode,s.bindMatrix=this.bindMatrix.toArray(),this.skeleton!==void 0&&(r(e.skeletons,this.skeleton),s.skeleton=this.skeleton.uuid)),this.material!==void 0)if(Array.isArray(this.material)){const o=[];for(let l=0,c=this.material.length;l<c;l++)o.push(r(e.materials,this.material[l]));s.material=o}else s.material=r(e.materials,this.material);if(this.children.length>0){s.children=[];for(let o=0;o<this.children.length;o++)s.children.push(this.children[o].toJSON(e).object)}if(this.animations.length>0){s.animations=[];for(let o=0;o<this.animations.length;o++){const l=this.animations[o];s.animations.push(r(e.animations,l))}}if(t){const o=a(e.geometries),l=a(e.materials),c=a(e.textures),u=a(e.images),d=a(e.shapes),f=a(e.skeletons),m=a(e.animations),g=a(e.nodes);o.length>0&&(i.geometries=o),l.length>0&&(i.materials=l),c.length>0&&(i.textures=c),u.length>0&&(i.images=u),d.length>0&&(i.shapes=d),f.length>0&&(i.skeletons=f),m.length>0&&(i.animations=m),g.length>0&&(i.nodes=g)}return i.object=s,i;function a(o){const l=[];for(const c in o){const u=o[c];delete u.metadata,l.push(u)}return l}}clone(e){return new this.constructor().copy(this,e)}copy(e,t=!0){if(this.name=e.name,this.up.copy(e.up),this.position.copy(e.position),this.rotation.order=e.rotation.order,this.quaternion.copy(e.quaternion),this.scale.copy(e.scale),this.matrix.copy(e.matrix),this.matrixWorld.copy(e.matrixWorld),this.matrixAutoUpdate=e.matrixAutoUpdate,this.matrixWorldAutoUpdate=e.matrixWorldAutoUpdate,this.matrixWorldNeedsUpdate=e.matrixWorldNeedsUpdate,this.layers.mask=e.layers.mask,this.visible=e.visible,this.castShadow=e.castShadow,this.receiveShadow=e.receiveShadow,this.frustumCulled=e.frustumCulled,this.renderOrder=e.renderOrder,this.animations=e.animations.slice(),this.userData=JSON.parse(JSON.stringify(e.userData)),t===!0)for(let i=0;i<e.children.length;i++){const s=e.children[i];this.add(s.clone())}return this}}Ct.DEFAULT_UP=new N(0,1,0);Ct.DEFAULT_MATRIX_AUTO_UPDATE=!0;Ct.DEFAULT_MATRIX_WORLD_AUTO_UPDATE=!0;const Kt=new N,dn=new N,Pr=new N,pn=new N,xi=new N,Mi=new N,Fo=new N,Dr=new N,Lr=new N,Ir=new N,Ur=new tt,Nr=new tt,Fr=new tt;class $t{constructor(e=new N,t=new N,i=new N){this.a=e,this.b=t,this.c=i}static getNormal(e,t,i,s){s.subVectors(i,t),Kt.subVectors(e,t),s.cross(Kt);const r=s.lengthSq();return r>0?s.multiplyScalar(1/Math.sqrt(r)):s.set(0,0,0)}static getBarycoord(e,t,i,s,r){Kt.subVectors(s,t),dn.subVectors(i,t),Pr.subVectors(e,t);const a=Kt.dot(Kt),o=Kt.dot(dn),l=Kt.dot(Pr),c=dn.dot(dn),u=dn.dot(Pr),d=a*c-o*o;if(d===0)return r.set(0,0,0),null;const f=1/d,m=(c*l-o*u)*f,g=(a*u-o*l)*f;return r.set(1-m-g,g,m)}static containsPoint(e,t,i,s){return this.getBarycoord(e,t,i,s,pn)===null?!1:pn.x>=0&&pn.y>=0&&pn.x+pn.y<=1}static getInterpolation(e,t,i,s,r,a,o,l){return this.getBarycoord(e,t,i,s,pn)===null?(l.x=0,l.y=0,"z"in l&&(l.z=0),"w"in l&&(l.w=0),null):(l.setScalar(0),l.addScaledVector(r,pn.x),l.addScaledVector(a,pn.y),l.addScaledVector(o,pn.z),l)}static getInterpolatedAttribute(e,t,i,s,r,a){return Ur.setScalar(0),Nr.setScalar(0),Fr.setScalar(0),Ur.fromBufferAttribute(e,t),Nr.fromBufferAttribute(e,i),Fr.fromBufferAttribute(e,s),a.setScalar(0),a.addScaledVector(Ur,r.x),a.addScaledVector(Nr,r.y),a.addScaledVector(Fr,r.z),a}static isFrontFacing(e,t,i,s){return Kt.subVectors(i,t),dn.subVectors(e,t),Kt.cross(dn).dot(s)<0}set(e,t,i){return this.a.copy(e),this.b.copy(t),this.c.copy(i),this}setFromPointsAndIndices(e,t,i,s){return this.a.copy(e[t]),this.b.copy(e[i]),this.c.copy(e[s]),this}setFromAttributeAndIndices(e,t,i,s){return this.a.fromBufferAttribute(e,t),this.b.fromBufferAttribute(e,i),this.c.fromBufferAttribute(e,s),this}clone(){return new this.constructor().copy(this)}copy(e){return this.a.copy(e.a),this.b.copy(e.b),this.c.copy(e.c),this}getArea(){return Kt.subVectors(this.c,this.b),dn.subVectors(this.a,this.b),Kt.cross(dn).length()*.5}getMidpoint(e){return e.addVectors(this.a,this.b).add(this.c).multiplyScalar(1/3)}getNormal(e){return $t.getNormal(this.a,this.b,this.c,e)}getPlane(e){return e.setFromCoplanarPoints(this.a,this.b,this.c)}getBarycoord(e,t){return $t.getBarycoord(e,this.a,this.b,this.c,t)}getInterpolation(e,t,i,s,r){return $t.getInterpolation(e,this.a,this.b,this.c,t,i,s,r)}containsPoint(e){return $t.containsPoint(e,this.a,this.b,this.c)}isFrontFacing(e){return $t.isFrontFacing(this.a,this.b,this.c,e)}intersectsBox(e){return e.intersectsTriangle(this)}closestPointToPoint(e,t){const i=this.a,s=this.b,r=this.c;let a,o;xi.subVectors(s,i),Mi.subVectors(r,i),Dr.subVectors(e,i);const l=xi.dot(Dr),c=Mi.dot(Dr);if(l<=0&&c<=0)return t.copy(i);Lr.subVectors(e,s);const u=xi.dot(Lr),d=Mi.dot(Lr);if(u>=0&&d<=u)return t.copy(s);const f=l*d-u*c;if(f<=0&&l>=0&&u<=0)return a=l/(l-u),t.copy(i).addScaledVector(xi,a);Ir.subVectors(e,r);const m=xi.dot(Ir),g=Mi.dot(Ir);if(g>=0&&m<=g)return t.copy(r);const _=m*c-l*g;if(_<=0&&c>=0&&g<=0)return o=c/(c-g),t.copy(i).addScaledVector(Mi,o);const p=u*g-m*d;if(p<=0&&d-u>=0&&m-g>=0)return Fo.subVectors(r,s),o=(d-u)/(d-u+(m-g)),t.copy(s).addScaledVector(Fo,o);const h=1/(p+_+f);return a=_*h,o=f*h,t.copy(i).addScaledVector(xi,a).addScaledVector(Mi,o)}equals(e){return e.a.equals(this.a)&&e.b.equals(this.b)&&e.c.equals(this.c)}}const Xl={aliceblue:15792383,antiquewhite:16444375,aqua:65535,aquamarine:8388564,azure:15794175,beige:16119260,bisque:16770244,black:0,blanchedalmond:16772045,blue:255,blueviolet:9055202,brown:10824234,burlywood:14596231,cadetblue:6266528,chartreuse:8388352,chocolate:13789470,coral:16744272,cornflowerblue:6591981,cornsilk:16775388,crimson:14423100,cyan:65535,darkblue:139,darkcyan:35723,darkgoldenrod:12092939,darkgray:11119017,darkgreen:25600,darkgrey:11119017,darkkhaki:12433259,darkmagenta:9109643,darkolivegreen:5597999,darkorange:16747520,darkorchid:10040012,darkred:9109504,darksalmon:15308410,darkseagreen:9419919,darkslateblue:4734347,darkslategray:3100495,darkslategrey:3100495,darkturquoise:52945,darkviolet:9699539,deeppink:16716947,deepskyblue:49151,dimgray:6908265,dimgrey:6908265,dodgerblue:2003199,firebrick:11674146,floralwhite:16775920,forestgreen:2263842,fuchsia:16711935,gainsboro:14474460,ghostwhite:16316671,gold:16766720,goldenrod:14329120,gray:8421504,green:32768,greenyellow:11403055,grey:8421504,honeydew:15794160,hotpink:16738740,indianred:13458524,indigo:4915330,ivory:16777200,khaki:15787660,lavender:15132410,lavenderblush:16773365,lawngreen:8190976,lemonchiffon:16775885,lightblue:11393254,lightcoral:15761536,lightcyan:14745599,lightgoldenrodyellow:16448210,lightgray:13882323,lightgreen:9498256,lightgrey:13882323,lightpink:16758465,lightsalmon:16752762,lightseagreen:2142890,lightskyblue:8900346,lightslategray:7833753,lightslategrey:7833753,lightsteelblue:11584734,lightyellow:16777184,lime:65280,limegreen:3329330,linen:16445670,magenta:16711935,maroon:8388608,mediumaquamarine:6737322,mediumblue:205,mediumorchid:12211667,mediumpurple:9662683,mediumseagreen:3978097,mediumslateblue:8087790,mediumspringgreen:64154,mediumturquoise:4772300,mediumvioletred:13047173,midnightblue:1644912,mintcream:16121850,mistyrose:16770273,moccasin:16770229,navajowhite:16768685,navy:128,oldlace:16643558,olive:8421376,olivedrab:7048739,orange:16753920,orangered:16729344,orchid:14315734,palegoldenrod:15657130,palegreen:10025880,paleturquoise:11529966,palevioletred:14381203,papayawhip:16773077,peachpuff:16767673,peru:13468991,pink:16761035,plum:14524637,powderblue:11591910,purple:8388736,rebeccapurple:6697881,red:16711680,rosybrown:12357519,royalblue:4286945,saddlebrown:9127187,salmon:16416882,sandybrown:16032864,seagreen:3050327,seashell:16774638,sienna:10506797,silver:12632256,skyblue:8900331,slateblue:6970061,slategray:7372944,slategrey:7372944,snow:16775930,springgreen:65407,steelblue:4620980,tan:13808780,teal:32896,thistle:14204888,tomato:16737095,turquoise:4251856,violet:15631086,wheat:16113331,white:16777215,whitesmoke:16119285,yellow:16776960,yellowgreen:10145074},In={h:0,s:0,l:0},Ds={h:0,s:0,l:0};function Or(n,e,t){return t<0&&(t+=1),t>1&&(t-=1),t<1/6?n+(e-n)*6*t:t<1/2?e:t<2/3?n+(e-n)*6*(2/3-t):n}class je{constructor(e,t,i){return this.isColor=!0,this.r=1,this.g=1,this.b=1,this.set(e,t,i)}set(e,t,i){if(t===void 0&&i===void 0){const s=e;s&&s.isColor?this.copy(s):typeof s=="number"?this.setHex(s):typeof s=="string"&&this.setStyle(s)}else this.setRGB(e,t,i);return this}setScalar(e){return this.r=e,this.g=e,this.b=e,this}setHex(e,t=Bt){return e=Math.floor(e),this.r=(e>>16&255)/255,this.g=(e>>8&255)/255,this.b=(e&255)/255,qe.toWorkingColorSpace(this,t),this}setRGB(e,t,i,s=qe.workingColorSpace){return this.r=e,this.g=t,this.b=i,qe.toWorkingColorSpace(this,s),this}setHSL(e,t,i,s=qe.workingColorSpace){if(e=bu(e,1),t=At(t,0,1),i=At(i,0,1),t===0)this.r=this.g=this.b=i;else{const r=i<=.5?i*(1+t):i+t-i*t,a=2*i-r;this.r=Or(a,r,e+1/3),this.g=Or(a,r,e),this.b=Or(a,r,e-1/3)}return qe.toWorkingColorSpace(this,s),this}setStyle(e,t=Bt){function i(r){r!==void 0&&parseFloat(r)<1&&console.warn("THREE.Color: Alpha component of "+e+" will be ignored.")}let s;if(s=/^(\w+)\(([^\)]*)\)/.exec(e)){let r;const a=s[1],o=s[2];switch(a){case"rgb":case"rgba":if(r=/^\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(o))return i(r[4]),this.setRGB(Math.min(255,parseInt(r[1],10))/255,Math.min(255,parseInt(r[2],10))/255,Math.min(255,parseInt(r[3],10))/255,t);if(r=/^\s*(\d+)\%\s*,\s*(\d+)\%\s*,\s*(\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(o))return i(r[4]),this.setRGB(Math.min(100,parseInt(r[1],10))/100,Math.min(100,parseInt(r[2],10))/100,Math.min(100,parseInt(r[3],10))/100,t);break;case"hsl":case"hsla":if(r=/^\s*(\d*\.?\d+)\s*,\s*(\d*\.?\d+)\%\s*,\s*(\d*\.?\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(o))return i(r[4]),this.setHSL(parseFloat(r[1])/360,parseFloat(r[2])/100,parseFloat(r[3])/100,t);break;default:console.warn("THREE.Color: Unknown color model "+e)}}else if(s=/^\#([A-Fa-f\d]+)$/.exec(e)){const r=s[1],a=r.length;if(a===3)return this.setRGB(parseInt(r.charAt(0),16)/15,parseInt(r.charAt(1),16)/15,parseInt(r.charAt(2),16)/15,t);if(a===6)return this.setHex(parseInt(r,16),t);console.warn("THREE.Color: Invalid hex color "+e)}else if(e&&e.length>0)return this.setColorName(e,t);return this}setColorName(e,t=Bt){const i=Xl[e.toLowerCase()];return i!==void 0?this.setHex(i,t):console.warn("THREE.Color: Unknown color "+e),this}clone(){return new this.constructor(this.r,this.g,this.b)}copy(e){return this.r=e.r,this.g=e.g,this.b=e.b,this}copySRGBToLinear(e){return this.r=_n(e.r),this.g=_n(e.g),this.b=_n(e.b),this}copyLinearToSRGB(e){return this.r=Li(e.r),this.g=Li(e.g),this.b=Li(e.b),this}convertSRGBToLinear(){return this.copySRGBToLinear(this),this}convertLinearToSRGB(){return this.copyLinearToSRGB(this),this}getHex(e=Bt){return qe.fromWorkingColorSpace(xt.copy(this),e),Math.round(At(xt.r*255,0,255))*65536+Math.round(At(xt.g*255,0,255))*256+Math.round(At(xt.b*255,0,255))}getHexString(e=Bt){return("000000"+this.getHex(e).toString(16)).slice(-6)}getHSL(e,t=qe.workingColorSpace){qe.fromWorkingColorSpace(xt.copy(this),t);const i=xt.r,s=xt.g,r=xt.b,a=Math.max(i,s,r),o=Math.min(i,s,r);let l,c;const u=(o+a)/2;if(o===a)l=0,c=0;else{const d=a-o;switch(c=u<=.5?d/(a+o):d/(2-a-o),a){case i:l=(s-r)/d+(s<r?6:0);break;case s:l=(r-i)/d+2;break;case r:l=(i-s)/d+4;break}l/=6}return e.h=l,e.s=c,e.l=u,e}getRGB(e,t=qe.workingColorSpace){return qe.fromWorkingColorSpace(xt.copy(this),t),e.r=xt.r,e.g=xt.g,e.b=xt.b,e}getStyle(e=Bt){qe.fromWorkingColorSpace(xt.copy(this),e);const t=xt.r,i=xt.g,s=xt.b;return e!==Bt?`color(${e} ${t.toFixed(3)} ${i.toFixed(3)} ${s.toFixed(3)})`:`rgb(${Math.round(t*255)},${Math.round(i*255)},${Math.round(s*255)})`}offsetHSL(e,t,i){return this.getHSL(In),this.setHSL(In.h+e,In.s+t,In.l+i)}add(e){return this.r+=e.r,this.g+=e.g,this.b+=e.b,this}addColors(e,t){return this.r=e.r+t.r,this.g=e.g+t.g,this.b=e.b+t.b,this}addScalar(e){return this.r+=e,this.g+=e,this.b+=e,this}sub(e){return this.r=Math.max(0,this.r-e.r),this.g=Math.max(0,this.g-e.g),this.b=Math.max(0,this.b-e.b),this}multiply(e){return this.r*=e.r,this.g*=e.g,this.b*=e.b,this}multiplyScalar(e){return this.r*=e,this.g*=e,this.b*=e,this}lerp(e,t){return this.r+=(e.r-this.r)*t,this.g+=(e.g-this.g)*t,this.b+=(e.b-this.b)*t,this}lerpColors(e,t,i){return this.r=e.r+(t.r-e.r)*i,this.g=e.g+(t.g-e.g)*i,this.b=e.b+(t.b-e.b)*i,this}lerpHSL(e,t){this.getHSL(In),e.getHSL(Ds);const i=Mr(In.h,Ds.h,t),s=Mr(In.s,Ds.s,t),r=Mr(In.l,Ds.l,t);return this.setHSL(i,s,r),this}setFromVector3(e){return this.r=e.x,this.g=e.y,this.b=e.z,this}applyMatrix3(e){const t=this.r,i=this.g,s=this.b,r=e.elements;return this.r=r[0]*t+r[3]*i+r[6]*s,this.g=r[1]*t+r[4]*i+r[7]*s,this.b=r[2]*t+r[5]*i+r[8]*s,this}equals(e){return e.r===this.r&&e.g===this.g&&e.b===this.b}fromArray(e,t=0){return this.r=e[t],this.g=e[t+1],this.b=e[t+2],this}toArray(e=[],t=0){return e[t]=this.r,e[t+1]=this.g,e[t+2]=this.b,e}fromBufferAttribute(e,t){return this.r=e.getX(t),this.g=e.getY(t),this.b=e.getZ(t),this}toJSON(){return this.getHex()}*[Symbol.iterator](){yield this.r,yield this.g,yield this.b}}const xt=new je;je.NAMES=Xl;let Vu=0;class xs extends Xi{static get type(){return"Material"}get type(){return this.constructor.type}set type(e){}constructor(){super(),this.isMaterial=!0,Object.defineProperty(this,"id",{value:Vu++}),this.uuid=_s(),this.name="",this.blending=Pi,this.side=Vn,this.vertexColors=!1,this.opacity=1,this.transparent=!1,this.alphaHash=!1,this.blendSrc=ta,this.blendDst=li,this.blendEquation=ei,this.blendSrcAlpha=null,this.blendDstAlpha=null,this.blendEquationAlpha=null,this.blendColor=new je(0,0,0),this.blendAlpha=0,this.depthFunc=Ui,this.depthTest=!0,this.depthWrite=!0,this.stencilWriteMask=255,this.stencilFunc=Mo,this.stencilRef=0,this.stencilFuncMask=255,this.stencilFail=hi,this.stencilZFail=hi,this.stencilZPass=hi,this.stencilWrite=!1,this.clippingPlanes=null,this.clipIntersection=!1,this.clipShadows=!1,this.shadowSide=null,this.colorWrite=!0,this.precision=null,this.polygonOffset=!1,this.polygonOffsetFactor=0,this.polygonOffsetUnits=0,this.dithering=!1,this.alphaToCoverage=!1,this.premultipliedAlpha=!1,this.forceSinglePass=!1,this.visible=!0,this.toneMapped=!0,this.userData={},this.version=0,this._alphaTest=0}get alphaTest(){return this._alphaTest}set alphaTest(e){this._alphaTest>0!=e>0&&this.version++,this._alphaTest=e}onBeforeRender(){}onBeforeCompile(){}customProgramCacheKey(){return this.onBeforeCompile.toString()}setValues(e){if(e!==void 0)for(const t in e){const i=e[t];if(i===void 0){console.warn(`THREE.Material: parameter '${t}' has value of undefined.`);continue}const s=this[t];if(s===void 0){console.warn(`THREE.Material: '${t}' is not a property of THREE.${this.type}.`);continue}s&&s.isColor?s.set(i):s&&s.isVector3&&i&&i.isVector3?s.copy(i):this[t]=i}}toJSON(e){const t=e===void 0||typeof e=="string";t&&(e={textures:{},images:{}});const i={metadata:{version:4.6,type:"Material",generator:"Material.toJSON"}};i.uuid=this.uuid,i.type=this.type,this.name!==""&&(i.name=this.name),this.color&&this.color.isColor&&(i.color=this.color.getHex()),this.roughness!==void 0&&(i.roughness=this.roughness),this.metalness!==void 0&&(i.metalness=this.metalness),this.sheen!==void 0&&(i.sheen=this.sheen),this.sheenColor&&this.sheenColor.isColor&&(i.sheenColor=this.sheenColor.getHex()),this.sheenRoughness!==void 0&&(i.sheenRoughness=this.sheenRoughness),this.emissive&&this.emissive.isColor&&(i.emissive=this.emissive.getHex()),this.emissiveIntensity!==void 0&&this.emissiveIntensity!==1&&(i.emissiveIntensity=this.emissiveIntensity),this.specular&&this.specular.isColor&&(i.specular=this.specular.getHex()),this.specularIntensity!==void 0&&(i.specularIntensity=this.specularIntensity),this.specularColor&&this.specularColor.isColor&&(i.specularColor=this.specularColor.getHex()),this.shininess!==void 0&&(i.shininess=this.shininess),this.clearcoat!==void 0&&(i.clearcoat=this.clearcoat),this.clearcoatRoughness!==void 0&&(i.clearcoatRoughness=this.clearcoatRoughness),this.clearcoatMap&&this.clearcoatMap.isTexture&&(i.clearcoatMap=this.clearcoatMap.toJSON(e).uuid),this.clearcoatRoughnessMap&&this.clearcoatRoughnessMap.isTexture&&(i.clearcoatRoughnessMap=this.clearcoatRoughnessMap.toJSON(e).uuid),this.clearcoatNormalMap&&this.clearcoatNormalMap.isTexture&&(i.clearcoatNormalMap=this.clearcoatNormalMap.toJSON(e).uuid,i.clearcoatNormalScale=this.clearcoatNormalScale.toArray()),this.dispersion!==void 0&&(i.dispersion=this.dispersion),this.iridescence!==void 0&&(i.iridescence=this.iridescence),this.iridescenceIOR!==void 0&&(i.iridescenceIOR=this.iridescenceIOR),this.iridescenceThicknessRange!==void 0&&(i.iridescenceThicknessRange=this.iridescenceThicknessRange),this.iridescenceMap&&this.iridescenceMap.isTexture&&(i.iridescenceMap=this.iridescenceMap.toJSON(e).uuid),this.iridescenceThicknessMap&&this.iridescenceThicknessMap.isTexture&&(i.iridescenceThicknessMap=this.iridescenceThicknessMap.toJSON(e).uuid),this.anisotropy!==void 0&&(i.anisotropy=this.anisotropy),this.anisotropyRotation!==void 0&&(i.anisotropyRotation=this.anisotropyRotation),this.anisotropyMap&&this.anisotropyMap.isTexture&&(i.anisotropyMap=this.anisotropyMap.toJSON(e).uuid),this.map&&this.map.isTexture&&(i.map=this.map.toJSON(e).uuid),this.matcap&&this.matcap.isTexture&&(i.matcap=this.matcap.toJSON(e).uuid),this.alphaMap&&this.alphaMap.isTexture&&(i.alphaMap=this.alphaMap.toJSON(e).uuid),this.lightMap&&this.lightMap.isTexture&&(i.lightMap=this.lightMap.toJSON(e).uuid,i.lightMapIntensity=this.lightMapIntensity),this.aoMap&&this.aoMap.isTexture&&(i.aoMap=this.aoMap.toJSON(e).uuid,i.aoMapIntensity=this.aoMapIntensity),this.bumpMap&&this.bumpMap.isTexture&&(i.bumpMap=this.bumpMap.toJSON(e).uuid,i.bumpScale=this.bumpScale),this.normalMap&&this.normalMap.isTexture&&(i.normalMap=this.normalMap.toJSON(e).uuid,i.normalMapType=this.normalMapType,i.normalScale=this.normalScale.toArray()),this.displacementMap&&this.displacementMap.isTexture&&(i.displacementMap=this.displacementMap.toJSON(e).uuid,i.displacementScale=this.displacementScale,i.displacementBias=this.displacementBias),this.roughnessMap&&this.roughnessMap.isTexture&&(i.roughnessMap=this.roughnessMap.toJSON(e).uuid),this.metalnessMap&&this.metalnessMap.isTexture&&(i.metalnessMap=this.metalnessMap.toJSON(e).uuid),this.emissiveMap&&this.emissiveMap.isTexture&&(i.emissiveMap=this.emissiveMap.toJSON(e).uuid),this.specularMap&&this.specularMap.isTexture&&(i.specularMap=this.specularMap.toJSON(e).uuid),this.specularIntensityMap&&this.specularIntensityMap.isTexture&&(i.specularIntensityMap=this.specularIntensityMap.toJSON(e).uuid),this.specularColorMap&&this.specularColorMap.isTexture&&(i.specularColorMap=this.specularColorMap.toJSON(e).uuid),this.envMap&&this.envMap.isTexture&&(i.envMap=this.envMap.toJSON(e).uuid,this.combine!==void 0&&(i.combine=this.combine)),this.envMapRotation!==void 0&&(i.envMapRotation=this.envMapRotation.toArray()),this.envMapIntensity!==void 0&&(i.envMapIntensity=this.envMapIntensity),this.reflectivity!==void 0&&(i.reflectivity=this.reflectivity),this.refractionRatio!==void 0&&(i.refractionRatio=this.refractionRatio),this.gradientMap&&this.gradientMap.isTexture&&(i.gradientMap=this.gradientMap.toJSON(e).uuid),this.transmission!==void 0&&(i.transmission=this.transmission),this.transmissionMap&&this.transmissionMap.isTexture&&(i.transmissionMap=this.transmissionMap.toJSON(e).uuid),this.thickness!==void 0&&(i.thickness=this.thickness),this.thicknessMap&&this.thicknessMap.isTexture&&(i.thicknessMap=this.thicknessMap.toJSON(e).uuid),this.attenuationDistance!==void 0&&this.attenuationDistance!==1/0&&(i.attenuationDistance=this.attenuationDistance),this.attenuationColor!==void 0&&(i.attenuationColor=this.attenuationColor.getHex()),this.size!==void 0&&(i.size=this.size),this.shadowSide!==null&&(i.shadowSide=this.shadowSide),this.sizeAttenuation!==void 0&&(i.sizeAttenuation=this.sizeAttenuation),this.blending!==Pi&&(i.blending=this.blending),this.side!==Vn&&(i.side=this.side),this.vertexColors===!0&&(i.vertexColors=!0),this.opacity<1&&(i.opacity=this.opacity),this.transparent===!0&&(i.transparent=!0),this.blendSrc!==ta&&(i.blendSrc=this.blendSrc),this.blendDst!==li&&(i.blendDst=this.blendDst),this.blendEquation!==ei&&(i.blendEquation=this.blendEquation),this.blendSrcAlpha!==null&&(i.blendSrcAlpha=this.blendSrcAlpha),this.blendDstAlpha!==null&&(i.blendDstAlpha=this.blendDstAlpha),this.blendEquationAlpha!==null&&(i.blendEquationAlpha=this.blendEquationAlpha),this.blendColor&&this.blendColor.isColor&&(i.blendColor=this.blendColor.getHex()),this.blendAlpha!==0&&(i.blendAlpha=this.blendAlpha),this.depthFunc!==Ui&&(i.depthFunc=this.depthFunc),this.depthTest===!1&&(i.depthTest=this.depthTest),this.depthWrite===!1&&(i.depthWrite=this.depthWrite),this.colorWrite===!1&&(i.colorWrite=this.colorWrite),this.stencilWriteMask!==255&&(i.stencilWriteMask=this.stencilWriteMask),this.stencilFunc!==Mo&&(i.stencilFunc=this.stencilFunc),this.stencilRef!==0&&(i.stencilRef=this.stencilRef),this.stencilFuncMask!==255&&(i.stencilFuncMask=this.stencilFuncMask),this.stencilFail!==hi&&(i.stencilFail=this.stencilFail),this.stencilZFail!==hi&&(i.stencilZFail=this.stencilZFail),this.stencilZPass!==hi&&(i.stencilZPass=this.stencilZPass),this.stencilWrite===!0&&(i.stencilWrite=this.stencilWrite),this.rotation!==void 0&&this.rotation!==0&&(i.rotation=this.rotation),this.polygonOffset===!0&&(i.polygonOffset=!0),this.polygonOffsetFactor!==0&&(i.polygonOffsetFactor=this.polygonOffsetFactor),this.polygonOffsetUnits!==0&&(i.polygonOffsetUnits=this.polygonOffsetUnits),this.linewidth!==void 0&&this.linewidth!==1&&(i.linewidth=this.linewidth),this.dashSize!==void 0&&(i.dashSize=this.dashSize),this.gapSize!==void 0&&(i.gapSize=this.gapSize),this.scale!==void 0&&(i.scale=this.scale),this.dithering===!0&&(i.dithering=!0),this.alphaTest>0&&(i.alphaTest=this.alphaTest),this.alphaHash===!0&&(i.alphaHash=!0),this.alphaToCoverage===!0&&(i.alphaToCoverage=!0),this.premultipliedAlpha===!0&&(i.premultipliedAlpha=!0),this.forceSinglePass===!0&&(i.forceSinglePass=!0),this.wireframe===!0&&(i.wireframe=!0),this.wireframeLinewidth>1&&(i.wireframeLinewidth=this.wireframeLinewidth),this.wireframeLinecap!=="round"&&(i.wireframeLinecap=this.wireframeLinecap),this.wireframeLinejoin!=="round"&&(i.wireframeLinejoin=this.wireframeLinejoin),this.flatShading===!0&&(i.flatShading=!0),this.visible===!1&&(i.visible=!1),this.toneMapped===!1&&(i.toneMapped=!1),this.fog===!1&&(i.fog=!1),Object.keys(this.userData).length>0&&(i.userData=this.userData);function s(r){const a=[];for(const o in r){const l=r[o];delete l.metadata,a.push(l)}return a}if(t){const r=s(e.textures),a=s(e.images);r.length>0&&(i.textures=r),a.length>0&&(i.images=a)}return i}clone(){return new this.constructor().copy(this)}copy(e){this.name=e.name,this.blending=e.blending,this.side=e.side,this.vertexColors=e.vertexColors,this.opacity=e.opacity,this.transparent=e.transparent,this.blendSrc=e.blendSrc,this.blendDst=e.blendDst,this.blendEquation=e.blendEquation,this.blendSrcAlpha=e.blendSrcAlpha,this.blendDstAlpha=e.blendDstAlpha,this.blendEquationAlpha=e.blendEquationAlpha,this.blendColor.copy(e.blendColor),this.blendAlpha=e.blendAlpha,this.depthFunc=e.depthFunc,this.depthTest=e.depthTest,this.depthWrite=e.depthWrite,this.stencilWriteMask=e.stencilWriteMask,this.stencilFunc=e.stencilFunc,this.stencilRef=e.stencilRef,this.stencilFuncMask=e.stencilFuncMask,this.stencilFail=e.stencilFail,this.stencilZFail=e.stencilZFail,this.stencilZPass=e.stencilZPass,this.stencilWrite=e.stencilWrite;const t=e.clippingPlanes;let i=null;if(t!==null){const s=t.length;i=new Array(s);for(let r=0;r!==s;++r)i[r]=t[r].clone()}return this.clippingPlanes=i,this.clipIntersection=e.clipIntersection,this.clipShadows=e.clipShadows,this.shadowSide=e.shadowSide,this.colorWrite=e.colorWrite,this.precision=e.precision,this.polygonOffset=e.polygonOffset,this.polygonOffsetFactor=e.polygonOffsetFactor,this.polygonOffsetUnits=e.polygonOffsetUnits,this.dithering=e.dithering,this.alphaTest=e.alphaTest,this.alphaHash=e.alphaHash,this.alphaToCoverage=e.alphaToCoverage,this.premultipliedAlpha=e.premultipliedAlpha,this.forceSinglePass=e.forceSinglePass,this.visible=e.visible,this.toneMapped=e.toneMapped,this.userData=JSON.parse(JSON.stringify(e.userData)),this}dispose(){this.dispatchEvent({type:"dispose"})}set needsUpdate(e){e===!0&&this.version++}onBuild(){console.warn("Material: onBuild() has been removed.")}}class ql extends xs{static get type(){return"MeshBasicMaterial"}constructor(e){super(),this.isMeshBasicMaterial=!0,this.color=new je(16777215),this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.specularMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new yn,this.combine=wl,this.reflectivity=1,this.refractionRatio=.98,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.lightMap=e.lightMap,this.lightMapIntensity=e.lightMapIntensity,this.aoMap=e.aoMap,this.aoMapIntensity=e.aoMapIntensity,this.specularMap=e.specularMap,this.alphaMap=e.alphaMap,this.envMap=e.envMap,this.envMapRotation.copy(e.envMapRotation),this.combine=e.combine,this.reflectivity=e.reflectivity,this.refractionRatio=e.refractionRatio,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.wireframeLinecap=e.wireframeLinecap,this.wireframeLinejoin=e.wireframeLinejoin,this.fog=e.fog,this}}const ct=new N,Ls=new Ve;class ut{constructor(e,t,i=!1){if(Array.isArray(e))throw new TypeError("THREE.BufferAttribute: array should be a Typed Array.");this.isBufferAttribute=!0,this.name="",this.array=e,this.itemSize=t,this.count=e!==void 0?e.length/t:0,this.normalized=i,this.usage=So,this.updateRanges=[],this.gpuType=an,this.version=0}onUploadCallback(){}set needsUpdate(e){e===!0&&this.version++}setUsage(e){return this.usage=e,this}addUpdateRange(e,t){this.updateRanges.push({start:e,count:t})}clearUpdateRanges(){this.updateRanges.length=0}copy(e){return this.name=e.name,this.array=new e.array.constructor(e.array),this.itemSize=e.itemSize,this.count=e.count,this.normalized=e.normalized,this.usage=e.usage,this.gpuType=e.gpuType,this}copyAt(e,t,i){e*=this.itemSize,i*=t.itemSize;for(let s=0,r=this.itemSize;s<r;s++)this.array[e+s]=t.array[i+s];return this}copyArray(e){return this.array.set(e),this}applyMatrix3(e){if(this.itemSize===2)for(let t=0,i=this.count;t<i;t++)Ls.fromBufferAttribute(this,t),Ls.applyMatrix3(e),this.setXY(t,Ls.x,Ls.y);else if(this.itemSize===3)for(let t=0,i=this.count;t<i;t++)ct.fromBufferAttribute(this,t),ct.applyMatrix3(e),this.setXYZ(t,ct.x,ct.y,ct.z);return this}applyMatrix4(e){for(let t=0,i=this.count;t<i;t++)ct.fromBufferAttribute(this,t),ct.applyMatrix4(e),this.setXYZ(t,ct.x,ct.y,ct.z);return this}applyNormalMatrix(e){for(let t=0,i=this.count;t<i;t++)ct.fromBufferAttribute(this,t),ct.applyNormalMatrix(e),this.setXYZ(t,ct.x,ct.y,ct.z);return this}transformDirection(e){for(let t=0,i=this.count;t<i;t++)ct.fromBufferAttribute(this,t),ct.transformDirection(e),this.setXYZ(t,ct.x,ct.y,ct.z);return this}set(e,t=0){return this.array.set(e,t),this}getComponent(e,t){let i=this.array[e*this.itemSize+t];return this.normalized&&(i=ji(i,this.array)),i}setComponent(e,t,i){return this.normalized&&(i=Tt(i,this.array)),this.array[e*this.itemSize+t]=i,this}getX(e){let t=this.array[e*this.itemSize];return this.normalized&&(t=ji(t,this.array)),t}setX(e,t){return this.normalized&&(t=Tt(t,this.array)),this.array[e*this.itemSize]=t,this}getY(e){let t=this.array[e*this.itemSize+1];return this.normalized&&(t=ji(t,this.array)),t}setY(e,t){return this.normalized&&(t=Tt(t,this.array)),this.array[e*this.itemSize+1]=t,this}getZ(e){let t=this.array[e*this.itemSize+2];return this.normalized&&(t=ji(t,this.array)),t}setZ(e,t){return this.normalized&&(t=Tt(t,this.array)),this.array[e*this.itemSize+2]=t,this}getW(e){let t=this.array[e*this.itemSize+3];return this.normalized&&(t=ji(t,this.array)),t}setW(e,t){return this.normalized&&(t=Tt(t,this.array)),this.array[e*this.itemSize+3]=t,this}setXY(e,t,i){return e*=this.itemSize,this.normalized&&(t=Tt(t,this.array),i=Tt(i,this.array)),this.array[e+0]=t,this.array[e+1]=i,this}setXYZ(e,t,i,s){return e*=this.itemSize,this.normalized&&(t=Tt(t,this.array),i=Tt(i,this.array),s=Tt(s,this.array)),this.array[e+0]=t,this.array[e+1]=i,this.array[e+2]=s,this}setXYZW(e,t,i,s,r){return e*=this.itemSize,this.normalized&&(t=Tt(t,this.array),i=Tt(i,this.array),s=Tt(s,this.array),r=Tt(r,this.array)),this.array[e+0]=t,this.array[e+1]=i,this.array[e+2]=s,this.array[e+3]=r,this}onUpload(e){return this.onUploadCallback=e,this}clone(){return new this.constructor(this.array,this.itemSize).copy(this)}toJSON(){const e={itemSize:this.itemSize,type:this.array.constructor.name,array:Array.from(this.array),normalized:this.normalized};return this.name!==""&&(e.name=this.name),this.usage!==So&&(e.usage=this.usage),e}}class Yl extends ut{constructor(e,t,i){super(new Uint16Array(e),t,i)}}class Kl extends ut{constructor(e,t,i){super(new Uint32Array(e),t,i)}}class ri extends ut{constructor(e,t,i){super(new Float32Array(e),t,i)}}let Wu=0;const Ot=new rt,Br=new Ct,Si=new N,It=new vs,ts=new vs,mt=new N;class Qt extends Xi{constructor(){super(),this.isBufferGeometry=!0,Object.defineProperty(this,"id",{value:Wu++}),this.uuid=_s(),this.name="",this.type="BufferGeometry",this.index=null,this.indirect=null,this.attributes={},this.morphAttributes={},this.morphTargetsRelative=!1,this.groups=[],this.boundingBox=null,this.boundingSphere=null,this.drawRange={start:0,count:1/0},this.userData={}}getIndex(){return this.index}setIndex(e){return Array.isArray(e)?this.index=new(kl(e)?Kl:Yl)(e,1):this.index=e,this}setIndirect(e){return this.indirect=e,this}getIndirect(){return this.indirect}getAttribute(e){return this.attributes[e]}setAttribute(e,t){return this.attributes[e]=t,this}deleteAttribute(e){return delete this.attributes[e],this}hasAttribute(e){return this.attributes[e]!==void 0}addGroup(e,t,i=0){this.groups.push({start:e,count:t,materialIndex:i})}clearGroups(){this.groups=[]}setDrawRange(e,t){this.drawRange.start=e,this.drawRange.count=t}applyMatrix4(e){const t=this.attributes.position;t!==void 0&&(t.applyMatrix4(e),t.needsUpdate=!0);const i=this.attributes.normal;if(i!==void 0){const r=new Ue().getNormalMatrix(e);i.applyNormalMatrix(r),i.needsUpdate=!0}const s=this.attributes.tangent;return s!==void 0&&(s.transformDirection(e),s.needsUpdate=!0),this.boundingBox!==null&&this.computeBoundingBox(),this.boundingSphere!==null&&this.computeBoundingSphere(),this}applyQuaternion(e){return Ot.makeRotationFromQuaternion(e),this.applyMatrix4(Ot),this}rotateX(e){return Ot.makeRotationX(e),this.applyMatrix4(Ot),this}rotateY(e){return Ot.makeRotationY(e),this.applyMatrix4(Ot),this}rotateZ(e){return Ot.makeRotationZ(e),this.applyMatrix4(Ot),this}translate(e,t,i){return Ot.makeTranslation(e,t,i),this.applyMatrix4(Ot),this}scale(e,t,i){return Ot.makeScale(e,t,i),this.applyMatrix4(Ot),this}lookAt(e){return Br.lookAt(e),Br.updateMatrix(),this.applyMatrix4(Br.matrix),this}center(){return this.computeBoundingBox(),this.boundingBox.getCenter(Si).negate(),this.translate(Si.x,Si.y,Si.z),this}setFromPoints(e){const t=this.getAttribute("position");if(t===void 0){const i=[];for(let s=0,r=e.length;s<r;s++){const a=e[s];i.push(a.x,a.y,a.z||0)}this.setAttribute("position",new ri(i,3))}else{for(let i=0,s=t.count;i<s;i++){const r=e[i];t.setXYZ(i,r.x,r.y,r.z||0)}e.length>t.count&&console.warn("THREE.BufferGeometry: Buffer size too small for points data. Use .dispose() and create a new geometry."),t.needsUpdate=!0}return this}computeBoundingBox(){this.boundingBox===null&&(this.boundingBox=new vs);const e=this.attributes.position,t=this.morphAttributes.position;if(e&&e.isGLBufferAttribute){console.error("THREE.BufferGeometry.computeBoundingBox(): GLBufferAttribute requires a manual bounding box.",this),this.boundingBox.set(new N(-1/0,-1/0,-1/0),new N(1/0,1/0,1/0));return}if(e!==void 0){if(this.boundingBox.setFromBufferAttribute(e),t)for(let i=0,s=t.length;i<s;i++){const r=t[i];It.setFromBufferAttribute(r),this.morphTargetsRelative?(mt.addVectors(this.boundingBox.min,It.min),this.boundingBox.expandByPoint(mt),mt.addVectors(this.boundingBox.max,It.max),this.boundingBox.expandByPoint(mt)):(this.boundingBox.expandByPoint(It.min),this.boundingBox.expandByPoint(It.max))}}else this.boundingBox.makeEmpty();(isNaN(this.boundingBox.min.x)||isNaN(this.boundingBox.min.y)||isNaN(this.boundingBox.min.z))&&console.error('THREE.BufferGeometry.computeBoundingBox(): Computed min/max have NaN values. The "position" attribute is likely to have NaN values.',this)}computeBoundingSphere(){this.boundingSphere===null&&(this.boundingSphere=new dr);const e=this.attributes.position,t=this.morphAttributes.position;if(e&&e.isGLBufferAttribute){console.error("THREE.BufferGeometry.computeBoundingSphere(): GLBufferAttribute requires a manual bounding sphere.",this),this.boundingSphere.set(new N,1/0);return}if(e){const i=this.boundingSphere.center;if(It.setFromBufferAttribute(e),t)for(let r=0,a=t.length;r<a;r++){const o=t[r];ts.setFromBufferAttribute(o),this.morphTargetsRelative?(mt.addVectors(It.min,ts.min),It.expandByPoint(mt),mt.addVectors(It.max,ts.max),It.expandByPoint(mt)):(It.expandByPoint(ts.min),It.expandByPoint(ts.max))}It.getCenter(i);let s=0;for(let r=0,a=e.count;r<a;r++)mt.fromBufferAttribute(e,r),s=Math.max(s,i.distanceToSquared(mt));if(t)for(let r=0,a=t.length;r<a;r++){const o=t[r],l=this.morphTargetsRelative;for(let c=0,u=o.count;c<u;c++)mt.fromBufferAttribute(o,c),l&&(Si.fromBufferAttribute(e,c),mt.add(Si)),s=Math.max(s,i.distanceToSquared(mt))}this.boundingSphere.radius=Math.sqrt(s),isNaN(this.boundingSphere.radius)&&console.error('THREE.BufferGeometry.computeBoundingSphere(): Computed radius is NaN. The "position" attribute is likely to have NaN values.',this)}}computeTangents(){const e=this.index,t=this.attributes;if(e===null||t.position===void 0||t.normal===void 0||t.uv===void 0){console.error("THREE.BufferGeometry: .computeTangents() failed. Missing required attributes (index, position, normal or uv)");return}const i=t.position,s=t.normal,r=t.uv;this.hasAttribute("tangent")===!1&&this.setAttribute("tangent",new ut(new Float32Array(4*i.count),4));const a=this.getAttribute("tangent"),o=[],l=[];for(let L=0;L<i.count;L++)o[L]=new N,l[L]=new N;const c=new N,u=new N,d=new N,f=new Ve,m=new Ve,g=new Ve,_=new N,p=new N;function h(L,E,x){c.fromBufferAttribute(i,L),u.fromBufferAttribute(i,E),d.fromBufferAttribute(i,x),f.fromBufferAttribute(r,L),m.fromBufferAttribute(r,E),g.fromBufferAttribute(r,x),u.sub(c),d.sub(c),m.sub(f),g.sub(f);const C=1/(m.x*g.y-g.x*m.y);isFinite(C)&&(_.copy(u).multiplyScalar(g.y).addScaledVector(d,-m.y).multiplyScalar(C),p.copy(d).multiplyScalar(m.x).addScaledVector(u,-g.x).multiplyScalar(C),o[L].add(_),o[E].add(_),o[x].add(_),l[L].add(p),l[E].add(p),l[x].add(p))}let A=this.groups;A.length===0&&(A=[{start:0,count:e.count}]);for(let L=0,E=A.length;L<E;++L){const x=A[L],C=x.start,V=x.count;for(let F=C,W=C+V;F<W;F+=3)h(e.getX(F+0),e.getX(F+1),e.getX(F+2))}const S=new N,M=new N,P=new N,b=new N;function w(L){P.fromBufferAttribute(s,L),b.copy(P);const E=o[L];S.copy(E),S.sub(P.multiplyScalar(P.dot(E))).normalize(),M.crossVectors(b,E);const C=M.dot(l[L])<0?-1:1;a.setXYZW(L,S.x,S.y,S.z,C)}for(let L=0,E=A.length;L<E;++L){const x=A[L],C=x.start,V=x.count;for(let F=C,W=C+V;F<W;F+=3)w(e.getX(F+0)),w(e.getX(F+1)),w(e.getX(F+2))}}computeVertexNormals(){const e=this.index,t=this.getAttribute("position");if(t!==void 0){let i=this.getAttribute("normal");if(i===void 0)i=new ut(new Float32Array(t.count*3),3),this.setAttribute("normal",i);else for(let f=0,m=i.count;f<m;f++)i.setXYZ(f,0,0,0);const s=new N,r=new N,a=new N,o=new N,l=new N,c=new N,u=new N,d=new N;if(e)for(let f=0,m=e.count;f<m;f+=3){const g=e.getX(f+0),_=e.getX(f+1),p=e.getX(f+2);s.fromBufferAttribute(t,g),r.fromBufferAttribute(t,_),a.fromBufferAttribute(t,p),u.subVectors(a,r),d.subVectors(s,r),u.cross(d),o.fromBufferAttribute(i,g),l.fromBufferAttribute(i,_),c.fromBufferAttribute(i,p),o.add(u),l.add(u),c.add(u),i.setXYZ(g,o.x,o.y,o.z),i.setXYZ(_,l.x,l.y,l.z),i.setXYZ(p,c.x,c.y,c.z)}else for(let f=0,m=t.count;f<m;f+=3)s.fromBufferAttribute(t,f+0),r.fromBufferAttribute(t,f+1),a.fromBufferAttribute(t,f+2),u.subVectors(a,r),d.subVectors(s,r),u.cross(d),i.setXYZ(f+0,u.x,u.y,u.z),i.setXYZ(f+1,u.x,u.y,u.z),i.setXYZ(f+2,u.x,u.y,u.z);this.normalizeNormals(),i.needsUpdate=!0}}normalizeNormals(){const e=this.attributes.normal;for(let t=0,i=e.count;t<i;t++)mt.fromBufferAttribute(e,t),mt.normalize(),e.setXYZ(t,mt.x,mt.y,mt.z)}toNonIndexed(){function e(o,l){const c=o.array,u=o.itemSize,d=o.normalized,f=new c.constructor(l.length*u);let m=0,g=0;for(let _=0,p=l.length;_<p;_++){o.isInterleavedBufferAttribute?m=l[_]*o.data.stride+o.offset:m=l[_]*u;for(let h=0;h<u;h++)f[g++]=c[m++]}return new ut(f,u,d)}if(this.index===null)return console.warn("THREE.BufferGeometry.toNonIndexed(): BufferGeometry is already non-indexed."),this;const t=new Qt,i=this.index.array,s=this.attributes;for(const o in s){const l=s[o],c=e(l,i);t.setAttribute(o,c)}const r=this.morphAttributes;for(const o in r){const l=[],c=r[o];for(let u=0,d=c.length;u<d;u++){const f=c[u],m=e(f,i);l.push(m)}t.morphAttributes[o]=l}t.morphTargetsRelative=this.morphTargetsRelative;const a=this.groups;for(let o=0,l=a.length;o<l;o++){const c=a[o];t.addGroup(c.start,c.count,c.materialIndex)}return t}toJSON(){const e={metadata:{version:4.6,type:"BufferGeometry",generator:"BufferGeometry.toJSON"}};if(e.uuid=this.uuid,e.type=this.type,this.name!==""&&(e.name=this.name),Object.keys(this.userData).length>0&&(e.userData=this.userData),this.parameters!==void 0){const l=this.parameters;for(const c in l)l[c]!==void 0&&(e[c]=l[c]);return e}e.data={attributes:{}};const t=this.index;t!==null&&(e.data.index={type:t.array.constructor.name,array:Array.prototype.slice.call(t.array)});const i=this.attributes;for(const l in i){const c=i[l];e.data.attributes[l]=c.toJSON(e.data)}const s={};let r=!1;for(const l in this.morphAttributes){const c=this.morphAttributes[l],u=[];for(let d=0,f=c.length;d<f;d++){const m=c[d];u.push(m.toJSON(e.data))}u.length>0&&(s[l]=u,r=!0)}r&&(e.data.morphAttributes=s,e.data.morphTargetsRelative=this.morphTargetsRelative);const a=this.groups;a.length>0&&(e.data.groups=JSON.parse(JSON.stringify(a)));const o=this.boundingSphere;return o!==null&&(e.data.boundingSphere={center:o.center.toArray(),radius:o.radius}),e}clone(){return new this.constructor().copy(this)}copy(e){this.index=null,this.attributes={},this.morphAttributes={},this.groups=[],this.boundingBox=null,this.boundingSphere=null;const t={};this.name=e.name;const i=e.index;i!==null&&this.setIndex(i.clone(t));const s=e.attributes;for(const c in s){const u=s[c];this.setAttribute(c,u.clone(t))}const r=e.morphAttributes;for(const c in r){const u=[],d=r[c];for(let f=0,m=d.length;f<m;f++)u.push(d[f].clone(t));this.morphAttributes[c]=u}this.morphTargetsRelative=e.morphTargetsRelative;const a=e.groups;for(let c=0,u=a.length;c<u;c++){const d=a[c];this.addGroup(d.start,d.count,d.materialIndex)}const o=e.boundingBox;o!==null&&(this.boundingBox=o.clone());const l=e.boundingSphere;return l!==null&&(this.boundingSphere=l.clone()),this.drawRange.start=e.drawRange.start,this.drawRange.count=e.drawRange.count,this.userData=e.userData,this}dispose(){this.dispatchEvent({type:"dispose"})}}const Oo=new rt,Kn=new Vl,Is=new dr,Bo=new N,Us=new N,Ns=new N,Fs=new N,zr=new N,Os=new N,zo=new N,Bs=new N;class Gt extends Ct{constructor(e=new Qt,t=new ql){super(),this.isMesh=!0,this.type="Mesh",this.geometry=e,this.material=t,this.updateMorphTargets()}copy(e,t){return super.copy(e,t),e.morphTargetInfluences!==void 0&&(this.morphTargetInfluences=e.morphTargetInfluences.slice()),e.morphTargetDictionary!==void 0&&(this.morphTargetDictionary=Object.assign({},e.morphTargetDictionary)),this.material=Array.isArray(e.material)?e.material.slice():e.material,this.geometry=e.geometry,this}updateMorphTargets(){const t=this.geometry.morphAttributes,i=Object.keys(t);if(i.length>0){const s=t[i[0]];if(s!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let r=0,a=s.length;r<a;r++){const o=s[r].name||String(r);this.morphTargetInfluences.push(0),this.morphTargetDictionary[o]=r}}}}getVertexPosition(e,t){const i=this.geometry,s=i.attributes.position,r=i.morphAttributes.position,a=i.morphTargetsRelative;t.fromBufferAttribute(s,e);const o=this.morphTargetInfluences;if(r&&o){Os.set(0,0,0);for(let l=0,c=r.length;l<c;l++){const u=o[l],d=r[l];u!==0&&(zr.fromBufferAttribute(d,e),a?Os.addScaledVector(zr,u):Os.addScaledVector(zr.sub(t),u))}t.add(Os)}return t}raycast(e,t){const i=this.geometry,s=this.material,r=this.matrixWorld;s!==void 0&&(i.boundingSphere===null&&i.computeBoundingSphere(),Is.copy(i.boundingSphere),Is.applyMatrix4(r),Kn.copy(e.ray).recast(e.near),!(Is.containsPoint(Kn.origin)===!1&&(Kn.intersectSphere(Is,Bo)===null||Kn.origin.distanceToSquared(Bo)>(e.far-e.near)**2))&&(Oo.copy(r).invert(),Kn.copy(e.ray).applyMatrix4(Oo),!(i.boundingBox!==null&&Kn.intersectsBox(i.boundingBox)===!1)&&this._computeIntersections(e,t,Kn)))}_computeIntersections(e,t,i){let s;const r=this.geometry,a=this.material,o=r.index,l=r.attributes.position,c=r.attributes.uv,u=r.attributes.uv1,d=r.attributes.normal,f=r.groups,m=r.drawRange;if(o!==null)if(Array.isArray(a))for(let g=0,_=f.length;g<_;g++){const p=f[g],h=a[p.materialIndex],A=Math.max(p.start,m.start),S=Math.min(o.count,Math.min(p.start+p.count,m.start+m.count));for(let M=A,P=S;M<P;M+=3){const b=o.getX(M),w=o.getX(M+1),L=o.getX(M+2);s=zs(this,h,e,i,c,u,d,b,w,L),s&&(s.faceIndex=Math.floor(M/3),s.face.materialIndex=p.materialIndex,t.push(s))}}else{const g=Math.max(0,m.start),_=Math.min(o.count,m.start+m.count);for(let p=g,h=_;p<h;p+=3){const A=o.getX(p),S=o.getX(p+1),M=o.getX(p+2);s=zs(this,a,e,i,c,u,d,A,S,M),s&&(s.faceIndex=Math.floor(p/3),t.push(s))}}else if(l!==void 0)if(Array.isArray(a))for(let g=0,_=f.length;g<_;g++){const p=f[g],h=a[p.materialIndex],A=Math.max(p.start,m.start),S=Math.min(l.count,Math.min(p.start+p.count,m.start+m.count));for(let M=A,P=S;M<P;M+=3){const b=M,w=M+1,L=M+2;s=zs(this,h,e,i,c,u,d,b,w,L),s&&(s.faceIndex=Math.floor(M/3),s.face.materialIndex=p.materialIndex,t.push(s))}}else{const g=Math.max(0,m.start),_=Math.min(l.count,m.start+m.count);for(let p=g,h=_;p<h;p+=3){const A=p,S=p+1,M=p+2;s=zs(this,a,e,i,c,u,d,A,S,M),s&&(s.faceIndex=Math.floor(p/3),t.push(s))}}}}function Xu(n,e,t,i,s,r,a,o){let l;if(e.side===Rt?l=i.intersectTriangle(a,r,s,!0,o):l=i.intersectTriangle(s,r,a,e.side===Vn,o),l===null)return null;Bs.copy(o),Bs.applyMatrix4(n.matrixWorld);const c=t.ray.origin.distanceTo(Bs);return c<t.near||c>t.far?null:{distance:c,point:Bs.clone(),object:n}}function zs(n,e,t,i,s,r,a,o,l,c){n.getVertexPosition(o,Us),n.getVertexPosition(l,Ns),n.getVertexPosition(c,Fs);const u=Xu(n,e,t,i,Us,Ns,Fs,zo);if(u){const d=new N;$t.getBarycoord(zo,Us,Ns,Fs,d),s&&(u.uv=$t.getInterpolatedAttribute(s,o,l,c,d,new Ve)),r&&(u.uv1=$t.getInterpolatedAttribute(r,o,l,c,d,new Ve)),a&&(u.normal=$t.getInterpolatedAttribute(a,o,l,c,d,new N),u.normal.dot(i.direction)>0&&u.normal.multiplyScalar(-1));const f={a:o,b:l,c,normal:new N,materialIndex:0};$t.getNormal(Us,Ns,Fs,f.normal),u.face=f,u.barycoord=d}return u}class Ms extends Qt{constructor(e=1,t=1,i=1,s=1,r=1,a=1){super(),this.type="BoxGeometry",this.parameters={width:e,height:t,depth:i,widthSegments:s,heightSegments:r,depthSegments:a};const o=this;s=Math.floor(s),r=Math.floor(r),a=Math.floor(a);const l=[],c=[],u=[],d=[];let f=0,m=0;g("z","y","x",-1,-1,i,t,e,a,r,0),g("z","y","x",1,-1,i,t,-e,a,r,1),g("x","z","y",1,1,e,i,t,s,a,2),g("x","z","y",1,-1,e,i,-t,s,a,3),g("x","y","z",1,-1,e,t,i,s,r,4),g("x","y","z",-1,-1,e,t,-i,s,r,5),this.setIndex(l),this.setAttribute("position",new ri(c,3)),this.setAttribute("normal",new ri(u,3)),this.setAttribute("uv",new ri(d,2));function g(_,p,h,A,S,M,P,b,w,L,E){const x=M/w,C=P/L,V=M/2,F=P/2,W=b/2,K=w+1,G=L+1;let Z=0,H=0;const ne=new N;for(let J=0;J<G;J++){const re=J*C-F;for(let we=0;we<K;we++){const Be=we*x-V;ne[_]=Be*A,ne[p]=re*S,ne[h]=W,c.push(ne.x,ne.y,ne.z),ne[_]=0,ne[p]=0,ne[h]=b>0?1:-1,u.push(ne.x,ne.y,ne.z),d.push(we/w),d.push(1-J/L),Z+=1}}for(let J=0;J<L;J++)for(let re=0;re<w;re++){const we=f+re+K*J,Be=f+re+K*(J+1),B=f+(re+1)+K*(J+1),Q=f+(re+1)+K*J;l.push(we,Be,Q),l.push(Be,B,Q),H+=6}o.addGroup(m,H,E),m+=H,f+=Z}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new Ms(e.width,e.height,e.depth,e.widthSegments,e.heightSegments,e.depthSegments)}}function zi(n){const e={};for(const t in n){e[t]={};for(const i in n[t]){const s=n[t][i];s&&(s.isColor||s.isMatrix3||s.isMatrix4||s.isVector2||s.isVector3||s.isVector4||s.isTexture||s.isQuaternion)?s.isRenderTargetTexture?(console.warn("UniformsUtils: Textures of render targets cannot be cloned via cloneUniforms() or mergeUniforms()."),e[t][i]=null):e[t][i]=s.clone():Array.isArray(s)?e[t][i]=s.slice():e[t][i]=s}}return e}function St(n){const e={};for(let t=0;t<n.length;t++){const i=zi(n[t]);for(const s in i)e[s]=i[s]}return e}function qu(n){const e=[];for(let t=0;t<n.length;t++)e.push(n[t].clone());return e}function $l(n){const e=n.getRenderTarget();return e===null?n.outputColorSpace:e.isXRRenderTarget===!0?e.texture.colorSpace:qe.workingColorSpace}const Yu={clone:zi,merge:St};var Ku=`void main() {
	gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
}`,$u=`void main() {
	gl_FragColor = vec4( 1.0, 0.0, 0.0, 1.0 );
}`;class wt extends xs{static get type(){return"ShaderMaterial"}constructor(e){super(),this.isShaderMaterial=!0,this.defines={},this.uniforms={},this.uniformsGroups=[],this.vertexShader=Ku,this.fragmentShader=$u,this.linewidth=1,this.wireframe=!1,this.wireframeLinewidth=1,this.fog=!1,this.lights=!1,this.clipping=!1,this.forceSinglePass=!0,this.extensions={clipCullDistance:!1,multiDraw:!1},this.defaultAttributeValues={color:[1,1,1],uv:[0,0],uv1:[0,0]},this.index0AttributeName=void 0,this.uniformsNeedUpdate=!1,this.glslVersion=null,e!==void 0&&this.setValues(e)}copy(e){return super.copy(e),this.fragmentShader=e.fragmentShader,this.vertexShader=e.vertexShader,this.uniforms=zi(e.uniforms),this.uniformsGroups=qu(e.uniformsGroups),this.defines=Object.assign({},e.defines),this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.fog=e.fog,this.lights=e.lights,this.clipping=e.clipping,this.extensions=Object.assign({},e.extensions),this.glslVersion=e.glslVersion,this}toJSON(e){const t=super.toJSON(e);t.glslVersion=this.glslVersion,t.uniforms={};for(const s in this.uniforms){const a=this.uniforms[s].value;a&&a.isTexture?t.uniforms[s]={type:"t",value:a.toJSON(e).uuid}:a&&a.isColor?t.uniforms[s]={type:"c",value:a.getHex()}:a&&a.isVector2?t.uniforms[s]={type:"v2",value:a.toArray()}:a&&a.isVector3?t.uniforms[s]={type:"v3",value:a.toArray()}:a&&a.isVector4?t.uniforms[s]={type:"v4",value:a.toArray()}:a&&a.isMatrix3?t.uniforms[s]={type:"m3",value:a.toArray()}:a&&a.isMatrix4?t.uniforms[s]={type:"m4",value:a.toArray()}:t.uniforms[s]={value:a}}Object.keys(this.defines).length>0&&(t.defines=this.defines),t.vertexShader=this.vertexShader,t.fragmentShader=this.fragmentShader,t.lights=this.lights,t.clipping=this.clipping;const i={};for(const s in this.extensions)this.extensions[s]===!0&&(i[s]=!0);return Object.keys(i).length>0&&(t.extensions=i),t}}class Zl extends Ct{constructor(){super(),this.isCamera=!0,this.type="Camera",this.matrixWorldInverse=new rt,this.projectionMatrix=new rt,this.projectionMatrixInverse=new rt,this.coordinateSystem=gn}copy(e,t){return super.copy(e,t),this.matrixWorldInverse.copy(e.matrixWorldInverse),this.projectionMatrix.copy(e.projectionMatrix),this.projectionMatrixInverse.copy(e.projectionMatrixInverse),this.coordinateSystem=e.coordinateSystem,this}getWorldDirection(e){return super.getWorldDirection(e).negate()}updateMatrixWorld(e){super.updateMatrixWorld(e),this.matrixWorldInverse.copy(this.matrixWorld).invert()}updateWorldMatrix(e,t){super.updateWorldMatrix(e,t),this.matrixWorldInverse.copy(this.matrixWorld).invert()}clone(){return new this.constructor().copy(this)}}const Un=new N,ko=new Ve,Go=new Ve;class Ut extends Zl{constructor(e=50,t=1,i=.1,s=2e3){super(),this.isPerspectiveCamera=!0,this.type="PerspectiveCamera",this.fov=e,this.zoom=1,this.near=i,this.far=s,this.focus=10,this.aspect=t,this.view=null,this.filmGauge=35,this.filmOffset=0,this.updateProjectionMatrix()}copy(e,t){return super.copy(e,t),this.fov=e.fov,this.zoom=e.zoom,this.near=e.near,this.far=e.far,this.focus=e.focus,this.aspect=e.aspect,this.view=e.view===null?null:Object.assign({},e.view),this.filmGauge=e.filmGauge,this.filmOffset=e.filmOffset,this}setFocalLength(e){const t=.5*this.getFilmHeight()/e;this.fov=za*2*Math.atan(t),this.updateProjectionMatrix()}getFocalLength(){const e=Math.tan(xr*.5*this.fov);return .5*this.getFilmHeight()/e}getEffectiveFOV(){return za*2*Math.atan(Math.tan(xr*.5*this.fov)/this.zoom)}getFilmWidth(){return this.filmGauge*Math.min(this.aspect,1)}getFilmHeight(){return this.filmGauge/Math.max(this.aspect,1)}getViewBounds(e,t,i){Un.set(-1,-1,.5).applyMatrix4(this.projectionMatrixInverse),t.set(Un.x,Un.y).multiplyScalar(-e/Un.z),Un.set(1,1,.5).applyMatrix4(this.projectionMatrixInverse),i.set(Un.x,Un.y).multiplyScalar(-e/Un.z)}getViewSize(e,t){return this.getViewBounds(e,ko,Go),t.subVectors(Go,ko)}setViewOffset(e,t,i,s,r,a){this.aspect=e/t,this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=e,this.view.fullHeight=t,this.view.offsetX=i,this.view.offsetY=s,this.view.width=r,this.view.height=a,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){const e=this.near;let t=e*Math.tan(xr*.5*this.fov)/this.zoom,i=2*t,s=this.aspect*i,r=-.5*s;const a=this.view;if(this.view!==null&&this.view.enabled){const l=a.fullWidth,c=a.fullHeight;r+=a.offsetX*s/l,t-=a.offsetY*i/c,s*=a.width/l,i*=a.height/c}const o=this.filmOffset;o!==0&&(r+=e*o/this.getFilmWidth()),this.projectionMatrix.makePerspective(r,r+s,t,t-i,e,this.far,this.coordinateSystem),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(e){const t=super.toJSON(e);return t.object.fov=this.fov,t.object.zoom=this.zoom,t.object.near=this.near,t.object.far=this.far,t.object.focus=this.focus,t.object.aspect=this.aspect,this.view!==null&&(t.object.view=Object.assign({},this.view)),t.object.filmGauge=this.filmGauge,t.object.filmOffset=this.filmOffset,t}}const yi=-90,Ei=1;class Zu extends Ct{constructor(e,t,i){super(),this.type="CubeCamera",this.renderTarget=i,this.coordinateSystem=null,this.activeMipmapLevel=0;const s=new Ut(yi,Ei,e,t);s.layers=this.layers,this.add(s);const r=new Ut(yi,Ei,e,t);r.layers=this.layers,this.add(r);const a=new Ut(yi,Ei,e,t);a.layers=this.layers,this.add(a);const o=new Ut(yi,Ei,e,t);o.layers=this.layers,this.add(o);const l=new Ut(yi,Ei,e,t);l.layers=this.layers,this.add(l);const c=new Ut(yi,Ei,e,t);c.layers=this.layers,this.add(c)}updateCoordinateSystem(){const e=this.coordinateSystem,t=this.children.concat(),[i,s,r,a,o,l]=t;for(const c of t)this.remove(c);if(e===gn)i.up.set(0,1,0),i.lookAt(1,0,0),s.up.set(0,1,0),s.lookAt(-1,0,0),r.up.set(0,0,-1),r.lookAt(0,1,0),a.up.set(0,0,1),a.lookAt(0,-1,0),o.up.set(0,1,0),o.lookAt(0,0,1),l.up.set(0,1,0),l.lookAt(0,0,-1);else if(e===sr)i.up.set(0,-1,0),i.lookAt(-1,0,0),s.up.set(0,-1,0),s.lookAt(1,0,0),r.up.set(0,0,1),r.lookAt(0,1,0),a.up.set(0,0,-1),a.lookAt(0,-1,0),o.up.set(0,-1,0),o.lookAt(0,0,1),l.up.set(0,-1,0),l.lookAt(0,0,-1);else throw new Error("THREE.CubeCamera.updateCoordinateSystem(): Invalid coordinate system: "+e);for(const c of t)this.add(c),c.updateMatrixWorld()}update(e,t){this.parent===null&&this.updateMatrixWorld();const{renderTarget:i,activeMipmapLevel:s}=this;this.coordinateSystem!==e.coordinateSystem&&(this.coordinateSystem=e.coordinateSystem,this.updateCoordinateSystem());const[r,a,o,l,c,u]=this.children,d=e.getRenderTarget(),f=e.getActiveCubeFace(),m=e.getActiveMipmapLevel(),g=e.xr.enabled;e.xr.enabled=!1;const _=i.texture.generateMipmaps;i.texture.generateMipmaps=!1,e.setRenderTarget(i,0,s),e.render(t,r),e.setRenderTarget(i,1,s),e.render(t,a),e.setRenderTarget(i,2,s),e.render(t,o),e.setRenderTarget(i,3,s),e.render(t,l),e.setRenderTarget(i,4,s),e.render(t,c),i.texture.generateMipmaps=_,e.setRenderTarget(i,5,s),e.render(t,u),e.setRenderTarget(d,f,m),e.xr.enabled=g,i.texture.needsPMREMUpdate=!0}}class jl extends Mt{constructor(e,t,i,s,r,a,o,l,c,u){e=e!==void 0?e:[],t=t!==void 0?t:Ni,super(e,t,i,s,r,a,o,l,c,u),this.isCubeTexture=!0,this.flipY=!1}get images(){return this.image}set images(e){this.image=e}}class ju extends Sn{constructor(e=1,t={}){super(e,e,t),this.isWebGLCubeRenderTarget=!0;const i={width:e,height:e,depth:1},s=[i,i,i,i,i,i];this.texture=new jl(s,t.mapping,t.wrapS,t.wrapT,t.magFilter,t.minFilter,t.format,t.type,t.anisotropy,t.colorSpace),this.texture.isRenderTargetTexture=!0,this.texture.generateMipmaps=t.generateMipmaps!==void 0?t.generateMipmaps:!1,this.texture.minFilter=t.minFilter!==void 0?t.minFilter:zt}fromEquirectangularTexture(e,t){this.texture.type=t.type,this.texture.colorSpace=t.colorSpace,this.texture.generateMipmaps=t.generateMipmaps,this.texture.minFilter=t.minFilter,this.texture.magFilter=t.magFilter;const i={uniforms:{tEquirect:{value:null}},vertexShader:`

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
			`},s=new Ms(5,5,5),r=new wt({name:"CubemapFromEquirect",uniforms:zi(i.uniforms),vertexShader:i.vertexShader,fragmentShader:i.fragmentShader,side:Rt,blending:kn});r.uniforms.tEquirect.value=t;const a=new Gt(s,r),o=t.minFilter;return t.minFilter===si&&(t.minFilter=zt),new Zu(1,10,this).update(e,a),t.minFilter=o,a.geometry.dispose(),a.material.dispose(),this}clear(e,t,i,s){const r=e.getRenderTarget();for(let a=0;a<6;a++)e.setRenderTarget(this,a),e.clear(t,i,s);e.setRenderTarget(r)}}const kr=new N,Ju=new N,Qu=new Ue;class Jn{constructor(e=new N(1,0,0),t=0){this.isPlane=!0,this.normal=e,this.constant=t}set(e,t){return this.normal.copy(e),this.constant=t,this}setComponents(e,t,i,s){return this.normal.set(e,t,i),this.constant=s,this}setFromNormalAndCoplanarPoint(e,t){return this.normal.copy(e),this.constant=-t.dot(this.normal),this}setFromCoplanarPoints(e,t,i){const s=kr.subVectors(i,t).cross(Ju.subVectors(e,t)).normalize();return this.setFromNormalAndCoplanarPoint(s,e),this}copy(e){return this.normal.copy(e.normal),this.constant=e.constant,this}normalize(){const e=1/this.normal.length();return this.normal.multiplyScalar(e),this.constant*=e,this}negate(){return this.constant*=-1,this.normal.negate(),this}distanceToPoint(e){return this.normal.dot(e)+this.constant}distanceToSphere(e){return this.distanceToPoint(e.center)-e.radius}projectPoint(e,t){return t.copy(e).addScaledVector(this.normal,-this.distanceToPoint(e))}intersectLine(e,t){const i=e.delta(kr),s=this.normal.dot(i);if(s===0)return this.distanceToPoint(e.start)===0?t.copy(e.start):null;const r=-(e.start.dot(this.normal)+this.constant)/s;return r<0||r>1?null:t.copy(e.start).addScaledVector(i,r)}intersectsLine(e){const t=this.distanceToPoint(e.start),i=this.distanceToPoint(e.end);return t<0&&i>0||i<0&&t>0}intersectsBox(e){return e.intersectsPlane(this)}intersectsSphere(e){return e.intersectsPlane(this)}coplanarPoint(e){return e.copy(this.normal).multiplyScalar(-this.constant)}applyMatrix4(e,t){const i=t||Qu.getNormalMatrix(e),s=this.coplanarPoint(kr).applyMatrix4(e),r=this.normal.applyMatrix3(i).normalize();return this.constant=-s.dot(r),this}translate(e){return this.constant-=e.dot(this.normal),this}equals(e){return e.normal.equals(this.normal)&&e.constant===this.constant}clone(){return new this.constructor().copy(this)}}const $n=new dr,ks=new N;class Jl{constructor(e=new Jn,t=new Jn,i=new Jn,s=new Jn,r=new Jn,a=new Jn){this.planes=[e,t,i,s,r,a]}set(e,t,i,s,r,a){const o=this.planes;return o[0].copy(e),o[1].copy(t),o[2].copy(i),o[3].copy(s),o[4].copy(r),o[5].copy(a),this}copy(e){const t=this.planes;for(let i=0;i<6;i++)t[i].copy(e.planes[i]);return this}setFromProjectionMatrix(e,t=gn){const i=this.planes,s=e.elements,r=s[0],a=s[1],o=s[2],l=s[3],c=s[4],u=s[5],d=s[6],f=s[7],m=s[8],g=s[9],_=s[10],p=s[11],h=s[12],A=s[13],S=s[14],M=s[15];if(i[0].setComponents(l-r,f-c,p-m,M-h).normalize(),i[1].setComponents(l+r,f+c,p+m,M+h).normalize(),i[2].setComponents(l+a,f+u,p+g,M+A).normalize(),i[3].setComponents(l-a,f-u,p-g,M-A).normalize(),i[4].setComponents(l-o,f-d,p-_,M-S).normalize(),t===gn)i[5].setComponents(l+o,f+d,p+_,M+S).normalize();else if(t===sr)i[5].setComponents(o,d,_,S).normalize();else throw new Error("THREE.Frustum.setFromProjectionMatrix(): Invalid coordinate system: "+t);return this}intersectsObject(e){if(e.boundingSphere!==void 0)e.boundingSphere===null&&e.computeBoundingSphere(),$n.copy(e.boundingSphere).applyMatrix4(e.matrixWorld);else{const t=e.geometry;t.boundingSphere===null&&t.computeBoundingSphere(),$n.copy(t.boundingSphere).applyMatrix4(e.matrixWorld)}return this.intersectsSphere($n)}intersectsSprite(e){return $n.center.set(0,0,0),$n.radius=.7071067811865476,$n.applyMatrix4(e.matrixWorld),this.intersectsSphere($n)}intersectsSphere(e){const t=this.planes,i=e.center,s=-e.radius;for(let r=0;r<6;r++)if(t[r].distanceToPoint(i)<s)return!1;return!0}intersectsBox(e){const t=this.planes;for(let i=0;i<6;i++){const s=t[i];if(ks.x=s.normal.x>0?e.max.x:e.min.x,ks.y=s.normal.y>0?e.max.y:e.min.y,ks.z=s.normal.z>0?e.max.z:e.min.z,s.distanceToPoint(ks)<0)return!1}return!0}containsPoint(e){const t=this.planes;for(let i=0;i<6;i++)if(t[i].distanceToPoint(e)<0)return!1;return!0}clone(){return new this.constructor().copy(this)}}function Ql(){let n=null,e=!1,t=null,i=null;function s(r,a){t(r,a),i=n.requestAnimationFrame(s)}return{start:function(){e!==!0&&t!==null&&(i=n.requestAnimationFrame(s),e=!0)},stop:function(){n.cancelAnimationFrame(i),e=!1},setAnimationLoop:function(r){t=r},setContext:function(r){n=r}}}function eh(n){const e=new WeakMap;function t(o,l){const c=o.array,u=o.usage,d=c.byteLength,f=n.createBuffer();n.bindBuffer(l,f),n.bufferData(l,c,u),o.onUploadCallback();let m;if(c instanceof Float32Array)m=n.FLOAT;else if(c instanceof Uint16Array)o.isFloat16BufferAttribute?m=n.HALF_FLOAT:m=n.UNSIGNED_SHORT;else if(c instanceof Int16Array)m=n.SHORT;else if(c instanceof Uint32Array)m=n.UNSIGNED_INT;else if(c instanceof Int32Array)m=n.INT;else if(c instanceof Int8Array)m=n.BYTE;else if(c instanceof Uint8Array)m=n.UNSIGNED_BYTE;else if(c instanceof Uint8ClampedArray)m=n.UNSIGNED_BYTE;else throw new Error("THREE.WebGLAttributes: Unsupported buffer data format: "+c);return{buffer:f,type:m,bytesPerElement:c.BYTES_PER_ELEMENT,version:o.version,size:d}}function i(o,l,c){const u=l.array,d=l.updateRanges;if(n.bindBuffer(c,o),d.length===0)n.bufferSubData(c,0,u);else{d.sort((m,g)=>m.start-g.start);let f=0;for(let m=1;m<d.length;m++){const g=d[f],_=d[m];_.start<=g.start+g.count+1?g.count=Math.max(g.count,_.start+_.count-g.start):(++f,d[f]=_)}d.length=f+1;for(let m=0,g=d.length;m<g;m++){const _=d[m];n.bufferSubData(c,_.start*u.BYTES_PER_ELEMENT,u,_.start,_.count)}l.clearUpdateRanges()}l.onUploadCallback()}function s(o){return o.isInterleavedBufferAttribute&&(o=o.data),e.get(o)}function r(o){o.isInterleavedBufferAttribute&&(o=o.data);const l=e.get(o);l&&(n.deleteBuffer(l.buffer),e.delete(o))}function a(o,l){if(o.isInterleavedBufferAttribute&&(o=o.data),o.isGLBufferAttribute){const u=e.get(o);(!u||u.version<o.version)&&e.set(o,{buffer:o.buffer,type:o.type,bytesPerElement:o.elementSize,version:o.version});return}const c=e.get(o);if(c===void 0)e.set(o,t(o,l));else if(c.version<o.version){if(c.size!==o.array.byteLength)throw new Error("THREE.WebGLAttributes: The size of the buffer attribute's array buffer does not match the original size. Resizing buffer attributes is not supported.");i(c.buffer,o,l),c.version=o.version}}return{get:s,remove:r,update:a}}class Yi extends Qt{constructor(e=1,t=1,i=1,s=1){super(),this.type="PlaneGeometry",this.parameters={width:e,height:t,widthSegments:i,heightSegments:s};const r=e/2,a=t/2,o=Math.floor(i),l=Math.floor(s),c=o+1,u=l+1,d=e/o,f=t/l,m=[],g=[],_=[],p=[];for(let h=0;h<u;h++){const A=h*f-a;for(let S=0;S<c;S++){const M=S*d-r;g.push(M,-A,0),_.push(0,0,1),p.push(S/o),p.push(1-h/l)}}for(let h=0;h<l;h++)for(let A=0;A<o;A++){const S=A+c*h,M=A+c*(h+1),P=A+1+c*(h+1),b=A+1+c*h;m.push(S,M,b),m.push(M,P,b)}this.setIndex(m),this.setAttribute("position",new ri(g,3)),this.setAttribute("normal",new ri(_,3)),this.setAttribute("uv",new ri(p,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new Yi(e.width,e.height,e.widthSegments,e.heightSegments)}}var th=`#ifdef USE_ALPHAHASH
	if ( diffuseColor.a < getAlphaHashThreshold( vPosition ) ) discard;
#endif`,nh=`#ifdef USE_ALPHAHASH
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
#endif`,ih=`#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, vAlphaMapUv ).g;
#endif`,sh=`#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,rh=`#ifdef USE_ALPHATEST
	#ifdef ALPHA_TO_COVERAGE
	diffuseColor.a = smoothstep( alphaTest, alphaTest + fwidth( diffuseColor.a ), diffuseColor.a );
	if ( diffuseColor.a == 0.0 ) discard;
	#else
	if ( diffuseColor.a < alphaTest ) discard;
	#endif
#endif`,ah=`#ifdef USE_ALPHATEST
	uniform float alphaTest;
#endif`,oh=`#ifdef USE_AOMAP
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
#endif`,lh=`#ifdef USE_AOMAP
	uniform sampler2D aoMap;
	uniform float aoMapIntensity;
#endif`,ch=`#ifdef USE_BATCHING
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
#endif`,uh=`#ifdef USE_BATCHING
	mat4 batchingMatrix = getBatchingMatrix( getIndirectIndex( gl_DrawID ) );
#endif`,hh=`vec3 transformed = vec3( position );
#ifdef USE_ALPHAHASH
	vPosition = vec3( position );
#endif`,fh=`vec3 objectNormal = vec3( normal );
#ifdef USE_TANGENT
	vec3 objectTangent = vec3( tangent.xyz );
#endif`,dh=`float G_BlinnPhong_Implicit( ) {
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
} // validated`,ph=`#ifdef USE_IRIDESCENCE
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
#endif`,mh=`#ifdef USE_BUMPMAP
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
#endif`,gh=`#if NUM_CLIPPING_PLANES > 0
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
#endif`,_h=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
	uniform vec4 clippingPlanes[ NUM_CLIPPING_PLANES ];
#endif`,vh=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
#endif`,xh=`#if NUM_CLIPPING_PLANES > 0
	vClipPosition = - mvPosition.xyz;
#endif`,Mh=`#if defined( USE_COLOR_ALPHA )
	diffuseColor *= vColor;
#elif defined( USE_COLOR )
	diffuseColor.rgb *= vColor;
#endif`,Sh=`#if defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#elif defined( USE_COLOR )
	varying vec3 vColor;
#endif`,yh=`#if defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#elif defined( USE_COLOR ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
	varying vec3 vColor;
#endif`,Eh=`#if defined( USE_COLOR_ALPHA )
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
#endif`,Th=`#define PI 3.141592653589793
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
} // validated`,Ah=`#ifdef ENVMAP_TYPE_CUBE_UV
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
#endif`,bh=`vec3 transformedNormal = objectNormal;
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
#endif`,wh=`#ifdef USE_DISPLACEMENTMAP
	uniform sampler2D displacementMap;
	uniform float displacementScale;
	uniform float displacementBias;
#endif`,Rh=`#ifdef USE_DISPLACEMENTMAP
	transformed += normalize( objectNormal ) * ( texture2D( displacementMap, vDisplacementMapUv ).x * displacementScale + displacementBias );
#endif`,Ch=`#ifdef USE_EMISSIVEMAP
	vec4 emissiveColor = texture2D( emissiveMap, vEmissiveMapUv );
	#ifdef DECODE_VIDEO_TEXTURE_EMISSIVE
		emissiveColor = sRGBTransferEOTF( emissiveColor );
	#endif
	totalEmissiveRadiance *= emissiveColor.rgb;
#endif`,Ph=`#ifdef USE_EMISSIVEMAP
	uniform sampler2D emissiveMap;
#endif`,Dh="gl_FragColor = linearToOutputTexel( gl_FragColor );",Lh=`vec4 LinearTransferOETF( in vec4 value ) {
	return value;
}
vec4 sRGBTransferEOTF( in vec4 value ) {
	return vec4( mix( pow( value.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), value.rgb * 0.0773993808, vec3( lessThanEqual( value.rgb, vec3( 0.04045 ) ) ) ), value.a );
}
vec4 sRGBTransferOETF( in vec4 value ) {
	return vec4( mix( pow( value.rgb, vec3( 0.41666 ) ) * 1.055 - vec3( 0.055 ), value.rgb * 12.92, vec3( lessThanEqual( value.rgb, vec3( 0.0031308 ) ) ) ), value.a );
}`,Ih=`#ifdef USE_ENVMAP
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
#endif`,Uh=`#ifdef USE_ENVMAP
	uniform float envMapIntensity;
	uniform float flipEnvMap;
	uniform mat3 envMapRotation;
	#ifdef ENVMAP_TYPE_CUBE
		uniform samplerCube envMap;
	#else
		uniform sampler2D envMap;
	#endif
	
#endif`,Nh=`#ifdef USE_ENVMAP
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
#endif`,Fh=`#ifdef USE_ENVMAP
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		
		varying vec3 vWorldPosition;
	#else
		varying vec3 vReflect;
		uniform float refractionRatio;
	#endif
#endif`,Oh=`#ifdef USE_ENVMAP
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
#endif`,Bh=`#ifdef USE_FOG
	vFogDepth = - mvPosition.z;
#endif`,zh=`#ifdef USE_FOG
	varying float vFogDepth;
#endif`,kh=`#ifdef USE_FOG
	#ifdef FOG_EXP2
		float fogFactor = 1.0 - exp( - fogDensity * fogDensity * vFogDepth * vFogDepth );
	#else
		float fogFactor = smoothstep( fogNear, fogFar, vFogDepth );
	#endif
	gl_FragColor.rgb = mix( gl_FragColor.rgb, fogColor, fogFactor );
#endif`,Gh=`#ifdef USE_FOG
	uniform vec3 fogColor;
	varying float vFogDepth;
	#ifdef FOG_EXP2
		uniform float fogDensity;
	#else
		uniform float fogNear;
		uniform float fogFar;
	#endif
#endif`,Hh=`#ifdef USE_GRADIENTMAP
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
}`,Vh=`#ifdef USE_LIGHTMAP
	uniform sampler2D lightMap;
	uniform float lightMapIntensity;
#endif`,Wh=`LambertMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularStrength = specularStrength;`,Xh=`varying vec3 vViewPosition;
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
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Lambert`,qh=`uniform bool receiveShadow;
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
#endif`,Yh=`#ifdef USE_ENVMAP
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
#endif`,Kh=`ToonMaterial material;
material.diffuseColor = diffuseColor.rgb;`,$h=`varying vec3 vViewPosition;
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
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Toon`,Zh=`BlinnPhongMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularColor = specular;
material.specularShininess = shininess;
material.specularStrength = specularStrength;`,jh=`varying vec3 vViewPosition;
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
#define RE_IndirectDiffuse		RE_IndirectDiffuse_BlinnPhong`,Jh=`PhysicalMaterial material;
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
#endif`,Qh=`struct PhysicalMaterial {
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
}`,ef=`
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
#endif`,tf=`#if defined( RE_IndirectDiffuse )
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
#endif`,nf=`#if defined( RE_IndirectDiffuse )
	RE_IndirectDiffuse( irradiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif
#if defined( RE_IndirectSpecular )
	RE_IndirectSpecular( radiance, iblIrradiance, clearcoatRadiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif`,sf=`#if defined( USE_LOGDEPTHBUF )
	gl_FragDepth = vIsPerspective == 0.0 ? gl_FragCoord.z : log2( vFragDepth ) * logDepthBufFC * 0.5;
#endif`,rf=`#if defined( USE_LOGDEPTHBUF )
	uniform float logDepthBufFC;
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,af=`#ifdef USE_LOGDEPTHBUF
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,of=`#ifdef USE_LOGDEPTHBUF
	vFragDepth = 1.0 + gl_Position.w;
	vIsPerspective = float( isPerspectiveMatrix( projectionMatrix ) );
#endif`,lf=`#ifdef USE_MAP
	vec4 sampledDiffuseColor = texture2D( map, vMapUv );
	#ifdef DECODE_VIDEO_TEXTURE
		sampledDiffuseColor = sRGBTransferEOTF( sampledDiffuseColor );
	#endif
	diffuseColor *= sampledDiffuseColor;
#endif`,cf=`#ifdef USE_MAP
	uniform sampler2D map;
#endif`,uf=`#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
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
#endif`,hf=`#if defined( USE_POINTS_UV )
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
#endif`,ff=`float metalnessFactor = metalness;
#ifdef USE_METALNESSMAP
	vec4 texelMetalness = texture2D( metalnessMap, vMetalnessMapUv );
	metalnessFactor *= texelMetalness.b;
#endif`,df=`#ifdef USE_METALNESSMAP
	uniform sampler2D metalnessMap;
#endif`,pf=`#ifdef USE_INSTANCING_MORPH
	float morphTargetInfluences[ MORPHTARGETS_COUNT ];
	float morphTargetBaseInfluence = texelFetch( morphTexture, ivec2( 0, gl_InstanceID ), 0 ).r;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		morphTargetInfluences[i] =  texelFetch( morphTexture, ivec2( i + 1, gl_InstanceID ), 0 ).r;
	}
#endif`,mf=`#if defined( USE_MORPHCOLORS )
	vColor *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		#if defined( USE_COLOR_ALPHA )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ) * morphTargetInfluences[ i ];
		#elif defined( USE_COLOR )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ).rgb * morphTargetInfluences[ i ];
		#endif
	}
#endif`,gf=`#ifdef USE_MORPHNORMALS
	objectNormal *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) objectNormal += getMorph( gl_VertexID, i, 1 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,_f=`#ifdef USE_MORPHTARGETS
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
#endif`,vf=`#ifdef USE_MORPHTARGETS
	transformed *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) transformed += getMorph( gl_VertexID, i, 0 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,xf=`float faceDirection = gl_FrontFacing ? 1.0 : - 1.0;
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
vec3 nonPerturbedNormal = normal;`,Mf=`#ifdef USE_NORMALMAP_OBJECTSPACE
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
#endif`,Sf=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,yf=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,Ef=`#ifndef FLAT_SHADED
	vNormal = normalize( transformedNormal );
	#ifdef USE_TANGENT
		vTangent = normalize( transformedTangent );
		vBitangent = normalize( cross( vNormal, vTangent ) * tangent.w );
	#endif
#endif`,Tf=`#ifdef USE_NORMALMAP
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
#endif`,Af=`#ifdef USE_CLEARCOAT
	vec3 clearcoatNormal = nonPerturbedNormal;
#endif`,bf=`#ifdef USE_CLEARCOAT_NORMALMAP
	vec3 clearcoatMapN = texture2D( clearcoatNormalMap, vClearcoatNormalMapUv ).xyz * 2.0 - 1.0;
	clearcoatMapN.xy *= clearcoatNormalScale;
	clearcoatNormal = normalize( tbn2 * clearcoatMapN );
#endif`,wf=`#ifdef USE_CLEARCOATMAP
	uniform sampler2D clearcoatMap;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform sampler2D clearcoatNormalMap;
	uniform vec2 clearcoatNormalScale;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform sampler2D clearcoatRoughnessMap;
#endif`,Rf=`#ifdef USE_IRIDESCENCEMAP
	uniform sampler2D iridescenceMap;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform sampler2D iridescenceThicknessMap;
#endif`,Cf=`#ifdef OPAQUE
diffuseColor.a = 1.0;
#endif
#ifdef USE_TRANSMISSION
diffuseColor.a *= material.transmissionAlpha;
#endif
gl_FragColor = vec4( outgoingLight, diffuseColor.a );`,Pf=`vec3 packNormalToRGB( const in vec3 normal ) {
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
}`,Df=`#ifdef PREMULTIPLIED_ALPHA
	gl_FragColor.rgb *= gl_FragColor.a;
#endif`,Lf=`vec4 mvPosition = vec4( transformed, 1.0 );
#ifdef USE_BATCHING
	mvPosition = batchingMatrix * mvPosition;
#endif
#ifdef USE_INSTANCING
	mvPosition = instanceMatrix * mvPosition;
#endif
mvPosition = modelViewMatrix * mvPosition;
gl_Position = projectionMatrix * mvPosition;`,If=`#ifdef DITHERING
	gl_FragColor.rgb = dithering( gl_FragColor.rgb );
#endif`,Uf=`#ifdef DITHERING
	vec3 dithering( vec3 color ) {
		float grid_position = rand( gl_FragCoord.xy );
		vec3 dither_shift_RGB = vec3( 0.25 / 255.0, -0.25 / 255.0, 0.25 / 255.0 );
		dither_shift_RGB = mix( 2.0 * dither_shift_RGB, -2.0 * dither_shift_RGB, grid_position );
		return color + dither_shift_RGB;
	}
#endif`,Nf=`float roughnessFactor = roughness;
#ifdef USE_ROUGHNESSMAP
	vec4 texelRoughness = texture2D( roughnessMap, vRoughnessMapUv );
	roughnessFactor *= texelRoughness.g;
#endif`,Ff=`#ifdef USE_ROUGHNESSMAP
	uniform sampler2D roughnessMap;
#endif`,Of=`#if NUM_SPOT_LIGHT_COORDS > 0
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
#endif`,Bf=`#if NUM_SPOT_LIGHT_COORDS > 0
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
#endif`,zf=`#if ( defined( USE_SHADOWMAP ) && ( NUM_DIR_LIGHT_SHADOWS > 0 || NUM_POINT_LIGHT_SHADOWS > 0 ) ) || ( NUM_SPOT_LIGHT_COORDS > 0 )
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
#endif`,kf=`float getShadowMask() {
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
}`,Gf=`#ifdef USE_SKINNING
	mat4 boneMatX = getBoneMatrix( skinIndex.x );
	mat4 boneMatY = getBoneMatrix( skinIndex.y );
	mat4 boneMatZ = getBoneMatrix( skinIndex.z );
	mat4 boneMatW = getBoneMatrix( skinIndex.w );
#endif`,Hf=`#ifdef USE_SKINNING
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
#endif`,Vf=`#ifdef USE_SKINNING
	vec4 skinVertex = bindMatrix * vec4( transformed, 1.0 );
	vec4 skinned = vec4( 0.0 );
	skinned += boneMatX * skinVertex * skinWeight.x;
	skinned += boneMatY * skinVertex * skinWeight.y;
	skinned += boneMatZ * skinVertex * skinWeight.z;
	skinned += boneMatW * skinVertex * skinWeight.w;
	transformed = ( bindMatrixInverse * skinned ).xyz;
#endif`,Wf=`#ifdef USE_SKINNING
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
#endif`,Xf=`float specularStrength;
#ifdef USE_SPECULARMAP
	vec4 texelSpecular = texture2D( specularMap, vSpecularMapUv );
	specularStrength = texelSpecular.r;
#else
	specularStrength = 1.0;
#endif`,qf=`#ifdef USE_SPECULARMAP
	uniform sampler2D specularMap;
#endif`,Yf=`#if defined( TONE_MAPPING )
	gl_FragColor.rgb = toneMapping( gl_FragColor.rgb );
#endif`,Kf=`#ifndef saturate
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
vec3 CustomToneMapping( vec3 color ) { return color; }`,$f=`#ifdef USE_TRANSMISSION
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
#endif`,Zf=`#ifdef USE_TRANSMISSION
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
#endif`,jf=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
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
#endif`,Jf=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
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
#endif`,Qf=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
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
#endif`,ed=`#if defined( USE_ENVMAP ) || defined( DISTANCE ) || defined ( USE_SHADOWMAP ) || defined ( USE_TRANSMISSION ) || NUM_SPOT_LIGHT_COORDS > 0
	vec4 worldPosition = vec4( transformed, 1.0 );
	#ifdef USE_BATCHING
		worldPosition = batchingMatrix * worldPosition;
	#endif
	#ifdef USE_INSTANCING
		worldPosition = instanceMatrix * worldPosition;
	#endif
	worldPosition = modelMatrix * worldPosition;
#endif`;const td=`varying vec2 vUv;
uniform mat3 uvTransform;
void main() {
	vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	gl_Position = vec4( position.xy, 1.0, 1.0 );
}`,nd=`uniform sampler2D t2D;
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
}`,id=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,sd=`#ifdef ENVMAP_TYPE_CUBE
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
}`,rd=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,ad=`uniform samplerCube tCube;
uniform float tFlip;
uniform float opacity;
varying vec3 vWorldDirection;
void main() {
	vec4 texColor = textureCube( tCube, vec3( tFlip * vWorldDirection.x, vWorldDirection.yz ) );
	gl_FragColor = texColor;
	gl_FragColor.a *= opacity;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,od=`#include <common>
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
}`,ld=`#if DEPTH_PACKING == 3200
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
}`,cd=`#define DISTANCE
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
}`,ud=`#define DISTANCE
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
}`,hd=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
}`,fd=`uniform sampler2D tEquirect;
varying vec3 vWorldDirection;
#include <common>
void main() {
	vec3 direction = normalize( vWorldDirection );
	vec2 sampleUV = equirectUv( direction );
	gl_FragColor = texture2D( tEquirect, sampleUV );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,dd=`uniform float scale;
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
}`,pd=`uniform vec3 diffuse;
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
}`,md=`#include <common>
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
}`,gd=`uniform vec3 diffuse;
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
}`,_d=`#define LAMBERT
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
}`,vd=`#define LAMBERT
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
}`,xd=`#define MATCAP
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
}`,Md=`#define MATCAP
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
}`,Sd=`#define NORMAL
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
}`,yd=`#define NORMAL
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
}`,Ed=`#define PHONG
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
}`,Td=`#define PHONG
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
}`,Ad=`#define STANDARD
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
}`,bd=`#define STANDARD
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
}`,wd=`#define TOON
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
}`,Rd=`#define TOON
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
}`,Cd=`uniform float size;
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
}`,Pd=`uniform vec3 diffuse;
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
}`,Dd=`#include <common>
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
}`,Ld=`uniform vec3 color;
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
}`,Id=`uniform float rotation;
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
}`,Ud=`uniform vec3 diffuse;
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
}`,Ge={alphahash_fragment:th,alphahash_pars_fragment:nh,alphamap_fragment:ih,alphamap_pars_fragment:sh,alphatest_fragment:rh,alphatest_pars_fragment:ah,aomap_fragment:oh,aomap_pars_fragment:lh,batching_pars_vertex:ch,batching_vertex:uh,begin_vertex:hh,beginnormal_vertex:fh,bsdfs:dh,iridescence_fragment:ph,bumpmap_pars_fragment:mh,clipping_planes_fragment:gh,clipping_planes_pars_fragment:_h,clipping_planes_pars_vertex:vh,clipping_planes_vertex:xh,color_fragment:Mh,color_pars_fragment:Sh,color_pars_vertex:yh,color_vertex:Eh,common:Th,cube_uv_reflection_fragment:Ah,defaultnormal_vertex:bh,displacementmap_pars_vertex:wh,displacementmap_vertex:Rh,emissivemap_fragment:Ch,emissivemap_pars_fragment:Ph,colorspace_fragment:Dh,colorspace_pars_fragment:Lh,envmap_fragment:Ih,envmap_common_pars_fragment:Uh,envmap_pars_fragment:Nh,envmap_pars_vertex:Fh,envmap_physical_pars_fragment:Yh,envmap_vertex:Oh,fog_vertex:Bh,fog_pars_vertex:zh,fog_fragment:kh,fog_pars_fragment:Gh,gradientmap_pars_fragment:Hh,lightmap_pars_fragment:Vh,lights_lambert_fragment:Wh,lights_lambert_pars_fragment:Xh,lights_pars_begin:qh,lights_toon_fragment:Kh,lights_toon_pars_fragment:$h,lights_phong_fragment:Zh,lights_phong_pars_fragment:jh,lights_physical_fragment:Jh,lights_physical_pars_fragment:Qh,lights_fragment_begin:ef,lights_fragment_maps:tf,lights_fragment_end:nf,logdepthbuf_fragment:sf,logdepthbuf_pars_fragment:rf,logdepthbuf_pars_vertex:af,logdepthbuf_vertex:of,map_fragment:lf,map_pars_fragment:cf,map_particle_fragment:uf,map_particle_pars_fragment:hf,metalnessmap_fragment:ff,metalnessmap_pars_fragment:df,morphinstance_vertex:pf,morphcolor_vertex:mf,morphnormal_vertex:gf,morphtarget_pars_vertex:_f,morphtarget_vertex:vf,normal_fragment_begin:xf,normal_fragment_maps:Mf,normal_pars_fragment:Sf,normal_pars_vertex:yf,normal_vertex:Ef,normalmap_pars_fragment:Tf,clearcoat_normal_fragment_begin:Af,clearcoat_normal_fragment_maps:bf,clearcoat_pars_fragment:wf,iridescence_pars_fragment:Rf,opaque_fragment:Cf,packing:Pf,premultiplied_alpha_fragment:Df,project_vertex:Lf,dithering_fragment:If,dithering_pars_fragment:Uf,roughnessmap_fragment:Nf,roughnessmap_pars_fragment:Ff,shadowmap_pars_fragment:Of,shadowmap_pars_vertex:Bf,shadowmap_vertex:zf,shadowmask_pars_fragment:kf,skinbase_vertex:Gf,skinning_pars_vertex:Hf,skinning_vertex:Vf,skinnormal_vertex:Wf,specularmap_fragment:Xf,specularmap_pars_fragment:qf,tonemapping_fragment:Yf,tonemapping_pars_fragment:Kf,transmission_fragment:$f,transmission_pars_fragment:Zf,uv_pars_fragment:jf,uv_pars_vertex:Jf,uv_vertex:Qf,worldpos_vertex:ed,background_vert:td,background_frag:nd,backgroundCube_vert:id,backgroundCube_frag:sd,cube_vert:rd,cube_frag:ad,depth_vert:od,depth_frag:ld,distanceRGBA_vert:cd,distanceRGBA_frag:ud,equirect_vert:hd,equirect_frag:fd,linedashed_vert:dd,linedashed_frag:pd,meshbasic_vert:md,meshbasic_frag:gd,meshlambert_vert:_d,meshlambert_frag:vd,meshmatcap_vert:xd,meshmatcap_frag:Md,meshnormal_vert:Sd,meshnormal_frag:yd,meshphong_vert:Ed,meshphong_frag:Td,meshphysical_vert:Ad,meshphysical_frag:bd,meshtoon_vert:wd,meshtoon_frag:Rd,points_vert:Cd,points_frag:Pd,shadow_vert:Dd,shadow_frag:Ld,sprite_vert:Id,sprite_frag:Ud},oe={common:{diffuse:{value:new je(16777215)},opacity:{value:1},map:{value:null},mapTransform:{value:new Ue},alphaMap:{value:null},alphaMapTransform:{value:new Ue},alphaTest:{value:0}},specularmap:{specularMap:{value:null},specularMapTransform:{value:new Ue}},envmap:{envMap:{value:null},envMapRotation:{value:new Ue},flipEnvMap:{value:-1},reflectivity:{value:1},ior:{value:1.5},refractionRatio:{value:.98}},aomap:{aoMap:{value:null},aoMapIntensity:{value:1},aoMapTransform:{value:new Ue}},lightmap:{lightMap:{value:null},lightMapIntensity:{value:1},lightMapTransform:{value:new Ue}},bumpmap:{bumpMap:{value:null},bumpMapTransform:{value:new Ue},bumpScale:{value:1}},normalmap:{normalMap:{value:null},normalMapTransform:{value:new Ue},normalScale:{value:new Ve(1,1)}},displacementmap:{displacementMap:{value:null},displacementMapTransform:{value:new Ue},displacementScale:{value:1},displacementBias:{value:0}},emissivemap:{emissiveMap:{value:null},emissiveMapTransform:{value:new Ue}},metalnessmap:{metalnessMap:{value:null},metalnessMapTransform:{value:new Ue}},roughnessmap:{roughnessMap:{value:null},roughnessMapTransform:{value:new Ue}},gradientmap:{gradientMap:{value:null}},fog:{fogDensity:{value:25e-5},fogNear:{value:1},fogFar:{value:2e3},fogColor:{value:new je(16777215)}},lights:{ambientLightColor:{value:[]},lightProbe:{value:[]},directionalLights:{value:[],properties:{direction:{},color:{}}},directionalLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},directionalShadowMap:{value:[]},directionalShadowMatrix:{value:[]},spotLights:{value:[],properties:{color:{},position:{},direction:{},distance:{},coneCos:{},penumbraCos:{},decay:{}}},spotLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},spotLightMap:{value:[]},spotShadowMap:{value:[]},spotLightMatrix:{value:[]},pointLights:{value:[],properties:{color:{},position:{},decay:{},distance:{}}},pointLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{},shadowCameraNear:{},shadowCameraFar:{}}},pointShadowMap:{value:[]},pointShadowMatrix:{value:[]},hemisphereLights:{value:[],properties:{direction:{},skyColor:{},groundColor:{}}},rectAreaLights:{value:[],properties:{color:{},position:{},width:{},height:{}}},ltc_1:{value:null},ltc_2:{value:null}},points:{diffuse:{value:new je(16777215)},opacity:{value:1},size:{value:1},scale:{value:1},map:{value:null},alphaMap:{value:null},alphaMapTransform:{value:new Ue},alphaTest:{value:0},uvTransform:{value:new Ue}},sprite:{diffuse:{value:new je(16777215)},opacity:{value:1},center:{value:new Ve(.5,.5)},rotation:{value:0},map:{value:null},mapTransform:{value:new Ue},alphaMap:{value:null},alphaMapTransform:{value:new Ue},alphaTest:{value:0}}},nn={basic:{uniforms:St([oe.common,oe.specularmap,oe.envmap,oe.aomap,oe.lightmap,oe.fog]),vertexShader:Ge.meshbasic_vert,fragmentShader:Ge.meshbasic_frag},lambert:{uniforms:St([oe.common,oe.specularmap,oe.envmap,oe.aomap,oe.lightmap,oe.emissivemap,oe.bumpmap,oe.normalmap,oe.displacementmap,oe.fog,oe.lights,{emissive:{value:new je(0)}}]),vertexShader:Ge.meshlambert_vert,fragmentShader:Ge.meshlambert_frag},phong:{uniforms:St([oe.common,oe.specularmap,oe.envmap,oe.aomap,oe.lightmap,oe.emissivemap,oe.bumpmap,oe.normalmap,oe.displacementmap,oe.fog,oe.lights,{emissive:{value:new je(0)},specular:{value:new je(1118481)},shininess:{value:30}}]),vertexShader:Ge.meshphong_vert,fragmentShader:Ge.meshphong_frag},standard:{uniforms:St([oe.common,oe.envmap,oe.aomap,oe.lightmap,oe.emissivemap,oe.bumpmap,oe.normalmap,oe.displacementmap,oe.roughnessmap,oe.metalnessmap,oe.fog,oe.lights,{emissive:{value:new je(0)},roughness:{value:1},metalness:{value:0},envMapIntensity:{value:1}}]),vertexShader:Ge.meshphysical_vert,fragmentShader:Ge.meshphysical_frag},toon:{uniforms:St([oe.common,oe.aomap,oe.lightmap,oe.emissivemap,oe.bumpmap,oe.normalmap,oe.displacementmap,oe.gradientmap,oe.fog,oe.lights,{emissive:{value:new je(0)}}]),vertexShader:Ge.meshtoon_vert,fragmentShader:Ge.meshtoon_frag},matcap:{uniforms:St([oe.common,oe.bumpmap,oe.normalmap,oe.displacementmap,oe.fog,{matcap:{value:null}}]),vertexShader:Ge.meshmatcap_vert,fragmentShader:Ge.meshmatcap_frag},points:{uniforms:St([oe.points,oe.fog]),vertexShader:Ge.points_vert,fragmentShader:Ge.points_frag},dashed:{uniforms:St([oe.common,oe.fog,{scale:{value:1},dashSize:{value:1},totalSize:{value:2}}]),vertexShader:Ge.linedashed_vert,fragmentShader:Ge.linedashed_frag},depth:{uniforms:St([oe.common,oe.displacementmap]),vertexShader:Ge.depth_vert,fragmentShader:Ge.depth_frag},normal:{uniforms:St([oe.common,oe.bumpmap,oe.normalmap,oe.displacementmap,{opacity:{value:1}}]),vertexShader:Ge.meshnormal_vert,fragmentShader:Ge.meshnormal_frag},sprite:{uniforms:St([oe.sprite,oe.fog]),vertexShader:Ge.sprite_vert,fragmentShader:Ge.sprite_frag},background:{uniforms:{uvTransform:{value:new Ue},t2D:{value:null},backgroundIntensity:{value:1}},vertexShader:Ge.background_vert,fragmentShader:Ge.background_frag},backgroundCube:{uniforms:{envMap:{value:null},flipEnvMap:{value:-1},backgroundBlurriness:{value:0},backgroundIntensity:{value:1},backgroundRotation:{value:new Ue}},vertexShader:Ge.backgroundCube_vert,fragmentShader:Ge.backgroundCube_frag},cube:{uniforms:{tCube:{value:null},tFlip:{value:-1},opacity:{value:1}},vertexShader:Ge.cube_vert,fragmentShader:Ge.cube_frag},equirect:{uniforms:{tEquirect:{value:null}},vertexShader:Ge.equirect_vert,fragmentShader:Ge.equirect_frag},distanceRGBA:{uniforms:St([oe.common,oe.displacementmap,{referencePosition:{value:new N},nearDistance:{value:1},farDistance:{value:1e3}}]),vertexShader:Ge.distanceRGBA_vert,fragmentShader:Ge.distanceRGBA_frag},shadow:{uniforms:St([oe.lights,oe.fog,{color:{value:new je(0)},opacity:{value:1}}]),vertexShader:Ge.shadow_vert,fragmentShader:Ge.shadow_frag}};nn.physical={uniforms:St([nn.standard.uniforms,{clearcoat:{value:0},clearcoatMap:{value:null},clearcoatMapTransform:{value:new Ue},clearcoatNormalMap:{value:null},clearcoatNormalMapTransform:{value:new Ue},clearcoatNormalScale:{value:new Ve(1,1)},clearcoatRoughness:{value:0},clearcoatRoughnessMap:{value:null},clearcoatRoughnessMapTransform:{value:new Ue},dispersion:{value:0},iridescence:{value:0},iridescenceMap:{value:null},iridescenceMapTransform:{value:new Ue},iridescenceIOR:{value:1.3},iridescenceThicknessMinimum:{value:100},iridescenceThicknessMaximum:{value:400},iridescenceThicknessMap:{value:null},iridescenceThicknessMapTransform:{value:new Ue},sheen:{value:0},sheenColor:{value:new je(0)},sheenColorMap:{value:null},sheenColorMapTransform:{value:new Ue},sheenRoughness:{value:1},sheenRoughnessMap:{value:null},sheenRoughnessMapTransform:{value:new Ue},transmission:{value:0},transmissionMap:{value:null},transmissionMapTransform:{value:new Ue},transmissionSamplerSize:{value:new Ve},transmissionSamplerMap:{value:null},thickness:{value:0},thicknessMap:{value:null},thicknessMapTransform:{value:new Ue},attenuationDistance:{value:0},attenuationColor:{value:new je(0)},specularColor:{value:new je(1,1,1)},specularColorMap:{value:null},specularColorMapTransform:{value:new Ue},specularIntensity:{value:1},specularIntensityMap:{value:null},specularIntensityMapTransform:{value:new Ue},anisotropyVector:{value:new Ve},anisotropyMap:{value:null},anisotropyMapTransform:{value:new Ue}}]),vertexShader:Ge.meshphysical_vert,fragmentShader:Ge.meshphysical_frag};const Gs={r:0,b:0,g:0},Zn=new yn,Nd=new rt;function Fd(n,e,t,i,s,r,a){const o=new je(0);let l=r===!0?0:1,c,u,d=null,f=0,m=null;function g(A){let S=A.isScene===!0?A.background:null;return S&&S.isTexture&&(S=(A.backgroundBlurriness>0?t:e).get(S)),S}function _(A){let S=!1;const M=g(A);M===null?h(o,l):M&&M.isColor&&(h(M,1),S=!0);const P=n.xr.getEnvironmentBlendMode();P==="additive"?i.buffers.color.setClear(0,0,0,1,a):P==="alpha-blend"&&i.buffers.color.setClear(0,0,0,0,a),(n.autoClear||S)&&(i.buffers.depth.setTest(!0),i.buffers.depth.setMask(!0),i.buffers.color.setMask(!0),n.clear(n.autoClearColor,n.autoClearDepth,n.autoClearStencil))}function p(A,S){const M=g(S);M&&(M.isCubeTexture||M.mapping===hr)?(u===void 0&&(u=new Gt(new Ms(1,1,1),new wt({name:"BackgroundCubeMaterial",uniforms:zi(nn.backgroundCube.uniforms),vertexShader:nn.backgroundCube.vertexShader,fragmentShader:nn.backgroundCube.fragmentShader,side:Rt,depthTest:!1,depthWrite:!1,fog:!1})),u.geometry.deleteAttribute("normal"),u.geometry.deleteAttribute("uv"),u.onBeforeRender=function(P,b,w){this.matrixWorld.copyPosition(w.matrixWorld)},Object.defineProperty(u.material,"envMap",{get:function(){return this.uniforms.envMap.value}}),s.update(u)),Zn.copy(S.backgroundRotation),Zn.x*=-1,Zn.y*=-1,Zn.z*=-1,M.isCubeTexture&&M.isRenderTargetTexture===!1&&(Zn.y*=-1,Zn.z*=-1),u.material.uniforms.envMap.value=M,u.material.uniforms.flipEnvMap.value=M.isCubeTexture&&M.isRenderTargetTexture===!1?-1:1,u.material.uniforms.backgroundBlurriness.value=S.backgroundBlurriness,u.material.uniforms.backgroundIntensity.value=S.backgroundIntensity,u.material.uniforms.backgroundRotation.value.setFromMatrix4(Nd.makeRotationFromEuler(Zn)),u.material.toneMapped=qe.getTransfer(M.colorSpace)!==Je,(d!==M||f!==M.version||m!==n.toneMapping)&&(u.material.needsUpdate=!0,d=M,f=M.version,m=n.toneMapping),u.layers.enableAll(),A.unshift(u,u.geometry,u.material,0,0,null)):M&&M.isTexture&&(c===void 0&&(c=new Gt(new Yi(2,2),new wt({name:"BackgroundMaterial",uniforms:zi(nn.background.uniforms),vertexShader:nn.background.vertexShader,fragmentShader:nn.background.fragmentShader,side:Vn,depthTest:!1,depthWrite:!1,fog:!1})),c.geometry.deleteAttribute("normal"),Object.defineProperty(c.material,"map",{get:function(){return this.uniforms.t2D.value}}),s.update(c)),c.material.uniforms.t2D.value=M,c.material.uniforms.backgroundIntensity.value=S.backgroundIntensity,c.material.toneMapped=qe.getTransfer(M.colorSpace)!==Je,M.matrixAutoUpdate===!0&&M.updateMatrix(),c.material.uniforms.uvTransform.value.copy(M.matrix),(d!==M||f!==M.version||m!==n.toneMapping)&&(c.material.needsUpdate=!0,d=M,f=M.version,m=n.toneMapping),c.layers.enableAll(),A.unshift(c,c.geometry,c.material,0,0,null))}function h(A,S){A.getRGB(Gs,$l(n)),i.buffers.color.setClear(Gs.r,Gs.g,Gs.b,S,a)}return{getClearColor:function(){return o},setClearColor:function(A,S=1){o.set(A),l=S,h(o,l)},getClearAlpha:function(){return l},setClearAlpha:function(A){l=A,h(o,l)},render:_,addToRenderList:p}}function Od(n,e){const t=n.getParameter(n.MAX_VERTEX_ATTRIBS),i={},s=f(null);let r=s,a=!1;function o(x,C,V,F,W){let K=!1;const G=d(F,V,C);r!==G&&(r=G,c(r.object)),K=m(x,F,V,W),K&&g(x,F,V,W),W!==null&&e.update(W,n.ELEMENT_ARRAY_BUFFER),(K||a)&&(a=!1,M(x,C,V,F),W!==null&&n.bindBuffer(n.ELEMENT_ARRAY_BUFFER,e.get(W).buffer))}function l(){return n.createVertexArray()}function c(x){return n.bindVertexArray(x)}function u(x){return n.deleteVertexArray(x)}function d(x,C,V){const F=V.wireframe===!0;let W=i[x.id];W===void 0&&(W={},i[x.id]=W);let K=W[C.id];K===void 0&&(K={},W[C.id]=K);let G=K[F];return G===void 0&&(G=f(l()),K[F]=G),G}function f(x){const C=[],V=[],F=[];for(let W=0;W<t;W++)C[W]=0,V[W]=0,F[W]=0;return{geometry:null,program:null,wireframe:!1,newAttributes:C,enabledAttributes:V,attributeDivisors:F,object:x,attributes:{},index:null}}function m(x,C,V,F){const W=r.attributes,K=C.attributes;let G=0;const Z=V.getAttributes();for(const H in Z)if(Z[H].location>=0){const J=W[H];let re=K[H];if(re===void 0&&(H==="instanceMatrix"&&x.instanceMatrix&&(re=x.instanceMatrix),H==="instanceColor"&&x.instanceColor&&(re=x.instanceColor)),J===void 0||J.attribute!==re||re&&J.data!==re.data)return!0;G++}return r.attributesNum!==G||r.index!==F}function g(x,C,V,F){const W={},K=C.attributes;let G=0;const Z=V.getAttributes();for(const H in Z)if(Z[H].location>=0){let J=K[H];J===void 0&&(H==="instanceMatrix"&&x.instanceMatrix&&(J=x.instanceMatrix),H==="instanceColor"&&x.instanceColor&&(J=x.instanceColor));const re={};re.attribute=J,J&&J.data&&(re.data=J.data),W[H]=re,G++}r.attributes=W,r.attributesNum=G,r.index=F}function _(){const x=r.newAttributes;for(let C=0,V=x.length;C<V;C++)x[C]=0}function p(x){h(x,0)}function h(x,C){const V=r.newAttributes,F=r.enabledAttributes,W=r.attributeDivisors;V[x]=1,F[x]===0&&(n.enableVertexAttribArray(x),F[x]=1),W[x]!==C&&(n.vertexAttribDivisor(x,C),W[x]=C)}function A(){const x=r.newAttributes,C=r.enabledAttributes;for(let V=0,F=C.length;V<F;V++)C[V]!==x[V]&&(n.disableVertexAttribArray(V),C[V]=0)}function S(x,C,V,F,W,K,G){G===!0?n.vertexAttribIPointer(x,C,V,W,K):n.vertexAttribPointer(x,C,V,F,W,K)}function M(x,C,V,F){_();const W=F.attributes,K=V.getAttributes(),G=C.defaultAttributeValues;for(const Z in K){const H=K[Z];if(H.location>=0){let ne=W[Z];if(ne===void 0&&(Z==="instanceMatrix"&&x.instanceMatrix&&(ne=x.instanceMatrix),Z==="instanceColor"&&x.instanceColor&&(ne=x.instanceColor)),ne!==void 0){const J=ne.normalized,re=ne.itemSize,we=e.get(ne);if(we===void 0)continue;const Be=we.buffer,B=we.type,Q=we.bytesPerElement,ue=B===n.INT||B===n.UNSIGNED_INT||ne.gpuType===Ka;if(ne.isInterleavedBufferAttribute){const ie=ne.data,Ae=ie.stride,Pe=ne.offset;if(ie.isInstancedInterleavedBuffer){for(let ee=0;ee<H.locationSize;ee++)h(H.location+ee,ie.meshPerAttribute);x.isInstancedMesh!==!0&&F._maxInstanceCount===void 0&&(F._maxInstanceCount=ie.meshPerAttribute*ie.count)}else for(let ee=0;ee<H.locationSize;ee++)p(H.location+ee);n.bindBuffer(n.ARRAY_BUFFER,Be);for(let ee=0;ee<H.locationSize;ee++)S(H.location+ee,re/H.locationSize,B,J,Ae*Q,(Pe+re/H.locationSize*ee)*Q,ue)}else{if(ne.isInstancedBufferAttribute){for(let ie=0;ie<H.locationSize;ie++)h(H.location+ie,ne.meshPerAttribute);x.isInstancedMesh!==!0&&F._maxInstanceCount===void 0&&(F._maxInstanceCount=ne.meshPerAttribute*ne.count)}else for(let ie=0;ie<H.locationSize;ie++)p(H.location+ie);n.bindBuffer(n.ARRAY_BUFFER,Be);for(let ie=0;ie<H.locationSize;ie++)S(H.location+ie,re/H.locationSize,B,J,re*Q,re/H.locationSize*ie*Q,ue)}}else if(G!==void 0){const J=G[Z];if(J!==void 0)switch(J.length){case 2:n.vertexAttrib2fv(H.location,J);break;case 3:n.vertexAttrib3fv(H.location,J);break;case 4:n.vertexAttrib4fv(H.location,J);break;default:n.vertexAttrib1fv(H.location,J)}}}}A()}function P(){L();for(const x in i){const C=i[x];for(const V in C){const F=C[V];for(const W in F)u(F[W].object),delete F[W];delete C[V]}delete i[x]}}function b(x){if(i[x.id]===void 0)return;const C=i[x.id];for(const V in C){const F=C[V];for(const W in F)u(F[W].object),delete F[W];delete C[V]}delete i[x.id]}function w(x){for(const C in i){const V=i[C];if(V[x.id]===void 0)continue;const F=V[x.id];for(const W in F)u(F[W].object),delete F[W];delete V[x.id]}}function L(){E(),a=!0,r!==s&&(r=s,c(r.object))}function E(){s.geometry=null,s.program=null,s.wireframe=!1}return{setup:o,reset:L,resetDefaultState:E,dispose:P,releaseStatesOfGeometry:b,releaseStatesOfProgram:w,initAttributes:_,enableAttribute:p,disableUnusedAttributes:A}}function Bd(n,e,t){let i;function s(c){i=c}function r(c,u){n.drawArrays(i,c,u),t.update(u,i,1)}function a(c,u,d){d!==0&&(n.drawArraysInstanced(i,c,u,d),t.update(u,i,d))}function o(c,u,d){if(d===0)return;e.get("WEBGL_multi_draw").multiDrawArraysWEBGL(i,c,0,u,0,d);let m=0;for(let g=0;g<d;g++)m+=u[g];t.update(m,i,1)}function l(c,u,d,f){if(d===0)return;const m=e.get("WEBGL_multi_draw");if(m===null)for(let g=0;g<c.length;g++)a(c[g],u[g],f[g]);else{m.multiDrawArraysInstancedWEBGL(i,c,0,u,0,f,0,d);let g=0;for(let _=0;_<d;_++)g+=u[_]*f[_];t.update(g,i,1)}}this.setMode=s,this.render=r,this.renderInstances=a,this.renderMultiDraw=o,this.renderMultiDrawInstances=l}function zd(n,e,t,i){let s;function r(){if(s!==void 0)return s;if(e.has("EXT_texture_filter_anisotropic")===!0){const w=e.get("EXT_texture_filter_anisotropic");s=n.getParameter(w.MAX_TEXTURE_MAX_ANISOTROPY_EXT)}else s=0;return s}function a(w){return!(w!==kt&&i.convert(w)!==n.getParameter(n.IMPLEMENTATION_COLOR_READ_FORMAT))}function o(w){const L=w===gs&&(e.has("EXT_color_buffer_half_float")||e.has("EXT_color_buffer_float"));return!(w!==Jt&&i.convert(w)!==n.getParameter(n.IMPLEMENTATION_COLOR_READ_TYPE)&&w!==an&&!L)}function l(w){if(w==="highp"){if(n.getShaderPrecisionFormat(n.VERTEX_SHADER,n.HIGH_FLOAT).precision>0&&n.getShaderPrecisionFormat(n.FRAGMENT_SHADER,n.HIGH_FLOAT).precision>0)return"highp";w="mediump"}return w==="mediump"&&n.getShaderPrecisionFormat(n.VERTEX_SHADER,n.MEDIUM_FLOAT).precision>0&&n.getShaderPrecisionFormat(n.FRAGMENT_SHADER,n.MEDIUM_FLOAT).precision>0?"mediump":"lowp"}let c=t.precision!==void 0?t.precision:"highp";const u=l(c);u!==c&&(console.warn("THREE.WebGLRenderer:",c,"not supported, using",u,"instead."),c=u);const d=t.logarithmicDepthBuffer===!0,f=t.reverseDepthBuffer===!0&&e.has("EXT_clip_control"),m=n.getParameter(n.MAX_TEXTURE_IMAGE_UNITS),g=n.getParameter(n.MAX_VERTEX_TEXTURE_IMAGE_UNITS),_=n.getParameter(n.MAX_TEXTURE_SIZE),p=n.getParameter(n.MAX_CUBE_MAP_TEXTURE_SIZE),h=n.getParameter(n.MAX_VERTEX_ATTRIBS),A=n.getParameter(n.MAX_VERTEX_UNIFORM_VECTORS),S=n.getParameter(n.MAX_VARYING_VECTORS),M=n.getParameter(n.MAX_FRAGMENT_UNIFORM_VECTORS),P=g>0,b=n.getParameter(n.MAX_SAMPLES);return{isWebGL2:!0,getMaxAnisotropy:r,getMaxPrecision:l,textureFormatReadable:a,textureTypeReadable:o,precision:c,logarithmicDepthBuffer:d,reverseDepthBuffer:f,maxTextures:m,maxVertexTextures:g,maxTextureSize:_,maxCubemapSize:p,maxAttributes:h,maxVertexUniforms:A,maxVaryings:S,maxFragmentUniforms:M,vertexTextures:P,maxSamples:b}}function kd(n){const e=this;let t=null,i=0,s=!1,r=!1;const a=new Jn,o=new Ue,l={value:null,needsUpdate:!1};this.uniform=l,this.numPlanes=0,this.numIntersection=0,this.init=function(d,f){const m=d.length!==0||f||i!==0||s;return s=f,i=d.length,m},this.beginShadows=function(){r=!0,u(null)},this.endShadows=function(){r=!1},this.setGlobalState=function(d,f){t=u(d,f,0)},this.setState=function(d,f,m){const g=d.clippingPlanes,_=d.clipIntersection,p=d.clipShadows,h=n.get(d);if(!s||g===null||g.length===0||r&&!p)r?u(null):c();else{const A=r?0:i,S=A*4;let M=h.clippingState||null;l.value=M,M=u(g,f,S,m);for(let P=0;P!==S;++P)M[P]=t[P];h.clippingState=M,this.numIntersection=_?this.numPlanes:0,this.numPlanes+=A}};function c(){l.value!==t&&(l.value=t,l.needsUpdate=i>0),e.numPlanes=i,e.numIntersection=0}function u(d,f,m,g){const _=d!==null?d.length:0;let p=null;if(_!==0){if(p=l.value,g!==!0||p===null){const h=m+_*4,A=f.matrixWorldInverse;o.getNormalMatrix(A),(p===null||p.length<h)&&(p=new Float32Array(h));for(let S=0,M=m;S!==_;++S,M+=4)a.copy(d[S]).applyMatrix4(A,o),a.normal.toArray(p,M),p[M+3]=a.constant}l.value=p,l.needsUpdate=!0}return e.numPlanes=_,e.numIntersection=0,p}}function Gd(n){let e=new WeakMap;function t(a,o){return o===ca?a.mapping=Ni:o===ua&&(a.mapping=Fi),a}function i(a){if(a&&a.isTexture){const o=a.mapping;if(o===ca||o===ua)if(e.has(a)){const l=e.get(a).texture;return t(l,a.mapping)}else{const l=a.image;if(l&&l.height>0){const c=new ju(l.height);return c.fromEquirectangularTexture(n,a),e.set(a,c),a.addEventListener("dispose",s),t(c.texture,a.mapping)}else return null}}return a}function s(a){const o=a.target;o.removeEventListener("dispose",s);const l=e.get(o);l!==void 0&&(e.delete(o),l.dispose())}function r(){e=new WeakMap}return{get:i,dispose:r}}class ec extends Zl{constructor(e=-1,t=1,i=1,s=-1,r=.1,a=2e3){super(),this.isOrthographicCamera=!0,this.type="OrthographicCamera",this.zoom=1,this.view=null,this.left=e,this.right=t,this.top=i,this.bottom=s,this.near=r,this.far=a,this.updateProjectionMatrix()}copy(e,t){return super.copy(e,t),this.left=e.left,this.right=e.right,this.top=e.top,this.bottom=e.bottom,this.near=e.near,this.far=e.far,this.zoom=e.zoom,this.view=e.view===null?null:Object.assign({},e.view),this}setViewOffset(e,t,i,s,r,a){this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=e,this.view.fullHeight=t,this.view.offsetX=i,this.view.offsetY=s,this.view.width=r,this.view.height=a,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){const e=(this.right-this.left)/(2*this.zoom),t=(this.top-this.bottom)/(2*this.zoom),i=(this.right+this.left)/2,s=(this.top+this.bottom)/2;let r=i-e,a=i+e,o=s+t,l=s-t;if(this.view!==null&&this.view.enabled){const c=(this.right-this.left)/this.view.fullWidth/this.zoom,u=(this.top-this.bottom)/this.view.fullHeight/this.zoom;r+=c*this.view.offsetX,a=r+c*this.view.width,o-=u*this.view.offsetY,l=o-u*this.view.height}this.projectionMatrix.makeOrthographic(r,a,o,l,this.near,this.far,this.coordinateSystem),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(e){const t=super.toJSON(e);return t.object.zoom=this.zoom,t.object.left=this.left,t.object.right=this.right,t.object.top=this.top,t.object.bottom=this.bottom,t.object.near=this.near,t.object.far=this.far,this.view!==null&&(t.object.view=Object.assign({},this.view)),t}}const bi=4,Ho=[.125,.215,.35,.446,.526,.582],ti=20,Gr=new ec,Vo=new je;let Hr=null,Vr=0,Wr=0,Xr=!1;const Qn=(1+Math.sqrt(5))/2,Ti=1/Qn,Wo=[new N(-Qn,Ti,0),new N(Qn,Ti,0),new N(-Ti,0,Qn),new N(Ti,0,Qn),new N(0,Qn,-Ti),new N(0,Qn,Ti),new N(-1,1,-1),new N(1,1,-1),new N(-1,1,1),new N(1,1,1)];class Xo{constructor(e){this._renderer=e,this._pingPongRenderTarget=null,this._lodMax=0,this._cubeSize=0,this._lodPlanes=[],this._sizeLods=[],this._sigmas=[],this._blurMaterial=null,this._cubemapMaterial=null,this._equirectMaterial=null,this._compileMaterial(this._blurMaterial)}fromScene(e,t=0,i=.1,s=100){Hr=this._renderer.getRenderTarget(),Vr=this._renderer.getActiveCubeFace(),Wr=this._renderer.getActiveMipmapLevel(),Xr=this._renderer.xr.enabled,this._renderer.xr.enabled=!1,this._setSize(256);const r=this._allocateTargets();return r.depthBuffer=!0,this._sceneToCubeUV(e,i,s,r),t>0&&this._blur(r,0,0,t),this._applyPMREM(r),this._cleanup(r),r}fromEquirectangular(e,t=null){return this._fromTexture(e,t)}fromCubemap(e,t=null){return this._fromTexture(e,t)}compileCubemapShader(){this._cubemapMaterial===null&&(this._cubemapMaterial=Ko(),this._compileMaterial(this._cubemapMaterial))}compileEquirectangularShader(){this._equirectMaterial===null&&(this._equirectMaterial=Yo(),this._compileMaterial(this._equirectMaterial))}dispose(){this._dispose(),this._cubemapMaterial!==null&&this._cubemapMaterial.dispose(),this._equirectMaterial!==null&&this._equirectMaterial.dispose()}_setSize(e){this._lodMax=Math.floor(Math.log2(e)),this._cubeSize=Math.pow(2,this._lodMax)}_dispose(){this._blurMaterial!==null&&this._blurMaterial.dispose(),this._pingPongRenderTarget!==null&&this._pingPongRenderTarget.dispose();for(let e=0;e<this._lodPlanes.length;e++)this._lodPlanes[e].dispose()}_cleanup(e){this._renderer.setRenderTarget(Hr,Vr,Wr),this._renderer.xr.enabled=Xr,e.scissorTest=!1,Hs(e,0,0,e.width,e.height)}_fromTexture(e,t){e.mapping===Ni||e.mapping===Fi?this._setSize(e.image.length===0?16:e.image[0].width||e.image[0].image.width):this._setSize(e.image.width/4),Hr=this._renderer.getRenderTarget(),Vr=this._renderer.getActiveCubeFace(),Wr=this._renderer.getActiveMipmapLevel(),Xr=this._renderer.xr.enabled,this._renderer.xr.enabled=!1;const i=t||this._allocateTargets();return this._textureToCubeUV(e,i),this._applyPMREM(i),this._cleanup(i),i}_allocateTargets(){const e=3*Math.max(this._cubeSize,112),t=4*this._cubeSize,i={magFilter:zt,minFilter:zt,generateMipmaps:!1,type:gs,format:kt,colorSpace:Wi,depthBuffer:!1},s=qo(e,t,i);if(this._pingPongRenderTarget===null||this._pingPongRenderTarget.width!==e||this._pingPongRenderTarget.height!==t){this._pingPongRenderTarget!==null&&this._dispose(),this._pingPongRenderTarget=qo(e,t,i);const{_lodMax:r}=this;({sizeLods:this._sizeLods,lodPlanes:this._lodPlanes,sigmas:this._sigmas}=Hd(r)),this._blurMaterial=Vd(r,e,t)}return s}_compileMaterial(e){const t=new Gt(this._lodPlanes[0],e);this._renderer.compile(t,Gr)}_sceneToCubeUV(e,t,i,s){const o=new Ut(90,1,t,i),l=[1,-1,1,1,1,1],c=[1,1,1,-1,-1,-1],u=this._renderer,d=u.autoClear,f=u.toneMapping;u.getClearColor(Vo),u.toneMapping=Gn,u.autoClear=!1;const m=new ql({name:"PMREM.Background",side:Rt,depthWrite:!1,depthTest:!1}),g=new Gt(new Ms,m);let _=!1;const p=e.background;p?p.isColor&&(m.color.copy(p),e.background=null,_=!0):(m.color.copy(Vo),_=!0);for(let h=0;h<6;h++){const A=h%3;A===0?(o.up.set(0,l[h],0),o.lookAt(c[h],0,0)):A===1?(o.up.set(0,0,l[h]),o.lookAt(0,c[h],0)):(o.up.set(0,l[h],0),o.lookAt(0,0,c[h]));const S=this._cubeSize;Hs(s,A*S,h>2?S:0,S,S),u.setRenderTarget(s),_&&u.render(g,o),u.render(e,o)}g.geometry.dispose(),g.material.dispose(),u.toneMapping=f,u.autoClear=d,e.background=p}_textureToCubeUV(e,t){const i=this._renderer,s=e.mapping===Ni||e.mapping===Fi;s?(this._cubemapMaterial===null&&(this._cubemapMaterial=Ko()),this._cubemapMaterial.uniforms.flipEnvMap.value=e.isRenderTargetTexture===!1?-1:1):this._equirectMaterial===null&&(this._equirectMaterial=Yo());const r=s?this._cubemapMaterial:this._equirectMaterial,a=new Gt(this._lodPlanes[0],r),o=r.uniforms;o.envMap.value=e;const l=this._cubeSize;Hs(t,0,0,3*l,2*l),i.setRenderTarget(t),i.render(a,Gr)}_applyPMREM(e){const t=this._renderer,i=t.autoClear;t.autoClear=!1;const s=this._lodPlanes.length;for(let r=1;r<s;r++){const a=Math.sqrt(this._sigmas[r]*this._sigmas[r]-this._sigmas[r-1]*this._sigmas[r-1]),o=Wo[(s-r-1)%Wo.length];this._blur(e,r-1,r,a,o)}t.autoClear=i}_blur(e,t,i,s,r){const a=this._pingPongRenderTarget;this._halfBlur(e,a,t,i,s,"latitudinal",r),this._halfBlur(a,e,i,i,s,"longitudinal",r)}_halfBlur(e,t,i,s,r,a,o){const l=this._renderer,c=this._blurMaterial;a!=="latitudinal"&&a!=="longitudinal"&&console.error("blur direction must be either latitudinal or longitudinal!");const u=3,d=new Gt(this._lodPlanes[s],c),f=c.uniforms,m=this._sizeLods[i]-1,g=isFinite(r)?Math.PI/(2*m):2*Math.PI/(2*ti-1),_=r/g,p=isFinite(r)?1+Math.floor(u*_):ti;p>ti&&console.warn(`sigmaRadians, ${r}, is too large and will clip, as it requested ${p} samples when the maximum is set to ${ti}`);const h=[];let A=0;for(let w=0;w<ti;++w){const L=w/_,E=Math.exp(-L*L/2);h.push(E),w===0?A+=E:w<p&&(A+=2*E)}for(let w=0;w<h.length;w++)h[w]=h[w]/A;f.envMap.value=e.texture,f.samples.value=p,f.weights.value=h,f.latitudinal.value=a==="latitudinal",o&&(f.poleAxis.value=o);const{_lodMax:S}=this;f.dTheta.value=g,f.mipInt.value=S-i;const M=this._sizeLods[s],P=3*M*(s>S-bi?s-S+bi:0),b=4*(this._cubeSize-M);Hs(t,P,b,3*M,2*M),l.setRenderTarget(t),l.render(d,Gr)}}function Hd(n){const e=[],t=[],i=[];let s=n;const r=n-bi+1+Ho.length;for(let a=0;a<r;a++){const o=Math.pow(2,s);t.push(o);let l=1/o;a>n-bi?l=Ho[a-n+bi-1]:a===0&&(l=0),i.push(l);const c=1/(o-2),u=-c,d=1+c,f=[u,u,d,u,d,d,u,u,d,d,u,d],m=6,g=6,_=3,p=2,h=1,A=new Float32Array(_*g*m),S=new Float32Array(p*g*m),M=new Float32Array(h*g*m);for(let b=0;b<m;b++){const w=b%3*2/3-1,L=b>2?0:-1,E=[w,L,0,w+2/3,L,0,w+2/3,L+1,0,w,L,0,w+2/3,L+1,0,w,L+1,0];A.set(E,_*g*b),S.set(f,p*g*b);const x=[b,b,b,b,b,b];M.set(x,h*g*b)}const P=new Qt;P.setAttribute("position",new ut(A,_)),P.setAttribute("uv",new ut(S,p)),P.setAttribute("faceIndex",new ut(M,h)),e.push(P),s>bi&&s--}return{lodPlanes:e,sizeLods:t,sigmas:i}}function qo(n,e,t){const i=new Sn(n,e,t);return i.texture.mapping=hr,i.texture.name="PMREM.cubeUv",i.scissorTest=!0,i}function Hs(n,e,t,i,s){n.viewport.set(e,t,i,s),n.scissor.set(e,t,i,s)}function Vd(n,e,t){const i=new Float32Array(ti),s=new N(0,1,0);return new wt({name:"SphericalGaussianBlur",defines:{n:ti,CUBEUV_TEXEL_WIDTH:1/e,CUBEUV_TEXEL_HEIGHT:1/t,CUBEUV_MAX_MIP:`${n}.0`},uniforms:{envMap:{value:null},samples:{value:1},weights:{value:i},latitudinal:{value:!1},dTheta:{value:0},mipInt:{value:0},poleAxis:{value:s}},vertexShader:eo(),fragmentShader:`

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
		`,blending:kn,depthTest:!1,depthWrite:!1})}function Yo(){return new wt({name:"EquirectangularToCubeUV",uniforms:{envMap:{value:null}},vertexShader:eo(),fragmentShader:`

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
		`,blending:kn,depthTest:!1,depthWrite:!1})}function Ko(){return new wt({name:"CubemapToCubeUV",uniforms:{envMap:{value:null},flipEnvMap:{value:-1}},vertexShader:eo(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			uniform float flipEnvMap;

			varying vec3 vOutputDirection;

			uniform samplerCube envMap;

			void main() {

				gl_FragColor = textureCube( envMap, vec3( flipEnvMap * vOutputDirection.x, vOutputDirection.yz ) );

			}
		`,blending:kn,depthTest:!1,depthWrite:!1})}function eo(){return`

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
	`}function Wd(n){let e=new WeakMap,t=null;function i(o){if(o&&o.isTexture){const l=o.mapping,c=l===ca||l===ua,u=l===Ni||l===Fi;if(c||u){let d=e.get(o);const f=d!==void 0?d.texture.pmremVersion:0;if(o.isRenderTargetTexture&&o.pmremVersion!==f)return t===null&&(t=new Xo(n)),d=c?t.fromEquirectangular(o,d):t.fromCubemap(o,d),d.texture.pmremVersion=o.pmremVersion,e.set(o,d),d.texture;if(d!==void 0)return d.texture;{const m=o.image;return c&&m&&m.height>0||u&&m&&s(m)?(t===null&&(t=new Xo(n)),d=c?t.fromEquirectangular(o):t.fromCubemap(o),d.texture.pmremVersion=o.pmremVersion,e.set(o,d),o.addEventListener("dispose",r),d.texture):null}}}return o}function s(o){let l=0;const c=6;for(let u=0;u<c;u++)o[u]!==void 0&&l++;return l===c}function r(o){const l=o.target;l.removeEventListener("dispose",r);const c=e.get(l);c!==void 0&&(e.delete(l),c.dispose())}function a(){e=new WeakMap,t!==null&&(t.dispose(),t=null)}return{get:i,dispose:a}}function Xd(n){const e={};function t(i){if(e[i]!==void 0)return e[i];let s;switch(i){case"WEBGL_depth_texture":s=n.getExtension("WEBGL_depth_texture")||n.getExtension("MOZ_WEBGL_depth_texture")||n.getExtension("WEBKIT_WEBGL_depth_texture");break;case"EXT_texture_filter_anisotropic":s=n.getExtension("EXT_texture_filter_anisotropic")||n.getExtension("MOZ_EXT_texture_filter_anisotropic")||n.getExtension("WEBKIT_EXT_texture_filter_anisotropic");break;case"WEBGL_compressed_texture_s3tc":s=n.getExtension("WEBGL_compressed_texture_s3tc")||n.getExtension("MOZ_WEBGL_compressed_texture_s3tc")||n.getExtension("WEBKIT_WEBGL_compressed_texture_s3tc");break;case"WEBGL_compressed_texture_pvrtc":s=n.getExtension("WEBGL_compressed_texture_pvrtc")||n.getExtension("WEBKIT_WEBGL_compressed_texture_pvrtc");break;default:s=n.getExtension(i)}return e[i]=s,s}return{has:function(i){return t(i)!==null},init:function(){t("EXT_color_buffer_float"),t("WEBGL_clip_cull_distance"),t("OES_texture_float_linear"),t("EXT_color_buffer_half_float"),t("WEBGL_multisampled_render_to_texture"),t("WEBGL_render_shared_exponent")},get:function(i){const s=t(i);return s===null&&ss("THREE.WebGLRenderer: "+i+" extension not supported."),s}}}function qd(n,e,t,i){const s={},r=new WeakMap;function a(d){const f=d.target;f.index!==null&&e.remove(f.index);for(const g in f.attributes)e.remove(f.attributes[g]);for(const g in f.morphAttributes){const _=f.morphAttributes[g];for(let p=0,h=_.length;p<h;p++)e.remove(_[p])}f.removeEventListener("dispose",a),delete s[f.id];const m=r.get(f);m&&(e.remove(m),r.delete(f)),i.releaseStatesOfGeometry(f),f.isInstancedBufferGeometry===!0&&delete f._maxInstanceCount,t.memory.geometries--}function o(d,f){return s[f.id]===!0||(f.addEventListener("dispose",a),s[f.id]=!0,t.memory.geometries++),f}function l(d){const f=d.attributes;for(const g in f)e.update(f[g],n.ARRAY_BUFFER);const m=d.morphAttributes;for(const g in m){const _=m[g];for(let p=0,h=_.length;p<h;p++)e.update(_[p],n.ARRAY_BUFFER)}}function c(d){const f=[],m=d.index,g=d.attributes.position;let _=0;if(m!==null){const A=m.array;_=m.version;for(let S=0,M=A.length;S<M;S+=3){const P=A[S+0],b=A[S+1],w=A[S+2];f.push(P,b,b,w,w,P)}}else if(g!==void 0){const A=g.array;_=g.version;for(let S=0,M=A.length/3-1;S<M;S+=3){const P=S+0,b=S+1,w=S+2;f.push(P,b,b,w,w,P)}}else return;const p=new(kl(f)?Kl:Yl)(f,1);p.version=_;const h=r.get(d);h&&e.remove(h),r.set(d,p)}function u(d){const f=r.get(d);if(f){const m=d.index;m!==null&&f.version<m.version&&c(d)}else c(d);return r.get(d)}return{get:o,update:l,getWireframeAttribute:u}}function Yd(n,e,t){let i;function s(f){i=f}let r,a;function o(f){r=f.type,a=f.bytesPerElement}function l(f,m){n.drawElements(i,m,r,f*a),t.update(m,i,1)}function c(f,m,g){g!==0&&(n.drawElementsInstanced(i,m,r,f*a,g),t.update(m,i,g))}function u(f,m,g){if(g===0)return;e.get("WEBGL_multi_draw").multiDrawElementsWEBGL(i,m,0,r,f,0,g);let p=0;for(let h=0;h<g;h++)p+=m[h];t.update(p,i,1)}function d(f,m,g,_){if(g===0)return;const p=e.get("WEBGL_multi_draw");if(p===null)for(let h=0;h<f.length;h++)c(f[h]/a,m[h],_[h]);else{p.multiDrawElementsInstancedWEBGL(i,m,0,r,f,0,_,0,g);let h=0;for(let A=0;A<g;A++)h+=m[A]*_[A];t.update(h,i,1)}}this.setMode=s,this.setIndex=o,this.render=l,this.renderInstances=c,this.renderMultiDraw=u,this.renderMultiDrawInstances=d}function Kd(n){const e={geometries:0,textures:0},t={frame:0,calls:0,triangles:0,points:0,lines:0};function i(r,a,o){switch(t.calls++,a){case n.TRIANGLES:t.triangles+=o*(r/3);break;case n.LINES:t.lines+=o*(r/2);break;case n.LINE_STRIP:t.lines+=o*(r-1);break;case n.LINE_LOOP:t.lines+=o*r;break;case n.POINTS:t.points+=o*r;break;default:console.error("THREE.WebGLInfo: Unknown draw mode:",a);break}}function s(){t.calls=0,t.triangles=0,t.points=0,t.lines=0}return{memory:e,render:t,programs:null,autoReset:!0,reset:s,update:i}}function $d(n,e,t){const i=new WeakMap,s=new tt;function r(a,o,l){const c=a.morphTargetInfluences,u=o.morphAttributes.position||o.morphAttributes.normal||o.morphAttributes.color,d=u!==void 0?u.length:0;let f=i.get(o);if(f===void 0||f.count!==d){let E=function(){w.dispose(),i.delete(o),o.removeEventListener("dispose",E)};f!==void 0&&f.texture.dispose();const m=o.morphAttributes.position!==void 0,g=o.morphAttributes.normal!==void 0,_=o.morphAttributes.color!==void 0,p=o.morphAttributes.position||[],h=o.morphAttributes.normal||[],A=o.morphAttributes.color||[];let S=0;m===!0&&(S=1),g===!0&&(S=2),_===!0&&(S=3);let M=o.attributes.position.count*S,P=1;M>e.maxTextureSize&&(P=Math.ceil(M/e.maxTextureSize),M=e.maxTextureSize);const b=new Float32Array(M*P*4*d),w=new Hl(b,M,P,d);w.type=an,w.needsUpdate=!0;const L=S*4;for(let x=0;x<d;x++){const C=p[x],V=h[x],F=A[x],W=M*P*4*x;for(let K=0;K<C.count;K++){const G=K*L;m===!0&&(s.fromBufferAttribute(C,K),b[W+G+0]=s.x,b[W+G+1]=s.y,b[W+G+2]=s.z,b[W+G+3]=0),g===!0&&(s.fromBufferAttribute(V,K),b[W+G+4]=s.x,b[W+G+5]=s.y,b[W+G+6]=s.z,b[W+G+7]=0),_===!0&&(s.fromBufferAttribute(F,K),b[W+G+8]=s.x,b[W+G+9]=s.y,b[W+G+10]=s.z,b[W+G+11]=F.itemSize===4?s.w:1)}}f={count:d,texture:w,size:new Ve(M,P)},i.set(o,f),o.addEventListener("dispose",E)}if(a.isInstancedMesh===!0&&a.morphTexture!==null)l.getUniforms().setValue(n,"morphTexture",a.morphTexture,t);else{let m=0;for(let _=0;_<c.length;_++)m+=c[_];const g=o.morphTargetsRelative?1:1-m;l.getUniforms().setValue(n,"morphTargetBaseInfluence",g),l.getUniforms().setValue(n,"morphTargetInfluences",c)}l.getUniforms().setValue(n,"morphTargetsTexture",f.texture,t),l.getUniforms().setValue(n,"morphTargetsTextureSize",f.size)}return{update:r}}function Zd(n,e,t,i){let s=new WeakMap;function r(l){const c=i.render.frame,u=l.geometry,d=e.get(l,u);if(s.get(d)!==c&&(e.update(d),s.set(d,c)),l.isInstancedMesh&&(l.hasEventListener("dispose",o)===!1&&l.addEventListener("dispose",o),s.get(l)!==c&&(t.update(l.instanceMatrix,n.ARRAY_BUFFER),l.instanceColor!==null&&t.update(l.instanceColor,n.ARRAY_BUFFER),s.set(l,c))),l.isSkinnedMesh){const f=l.skeleton;s.get(f)!==c&&(f.update(),s.set(f,c))}return d}function a(){s=new WeakMap}function o(l){const c=l.target;c.removeEventListener("dispose",o),t.remove(c.instanceMatrix),c.instanceColor!==null&&t.remove(c.instanceColor)}return{update:r,dispose:a}}class tc extends Mt{constructor(e,t,i,s,r,a,o,l,c,u=Di){if(u!==Di&&u!==Bi)throw new Error("DepthTexture format must be either THREE.DepthFormat or THREE.DepthStencilFormat");i===void 0&&u===Di&&(i=ci),i===void 0&&u===Bi&&(i=Oi),super(null,s,r,a,o,l,u,i,c),this.isDepthTexture=!0,this.image={width:e,height:t},this.magFilter=o!==void 0?o:ft,this.minFilter=l!==void 0?l:ft,this.flipY=!1,this.generateMipmaps=!1,this.compareFunction=null}copy(e){return super.copy(e),this.compareFunction=e.compareFunction,this}toJSON(e){const t=super.toJSON(e);return this.compareFunction!==null&&(t.compareFunction=this.compareFunction),t}}const nc=new Mt,$o=new tc(1,1),ic=new Hl,sc=new Nu,rc=new jl,Zo=[],jo=[],Jo=new Float32Array(16),Qo=new Float32Array(9),el=new Float32Array(4);function Ki(n,e,t){const i=n[0];if(i<=0||i>0)return n;const s=e*t;let r=Zo[s];if(r===void 0&&(r=new Float32Array(s),Zo[s]=r),e!==0){i.toArray(r,0);for(let a=1,o=0;a!==e;++a)o+=t,n[a].toArray(r,o)}return r}function dt(n,e){if(n.length!==e.length)return!1;for(let t=0,i=n.length;t<i;t++)if(n[t]!==e[t])return!1;return!0}function pt(n,e){for(let t=0,i=e.length;t<i;t++)n[t]=e[t]}function pr(n,e){let t=jo[e];t===void 0&&(t=new Int32Array(e),jo[e]=t);for(let i=0;i!==e;++i)t[i]=n.allocateTextureUnit();return t}function jd(n,e){const t=this.cache;t[0]!==e&&(n.uniform1f(this.addr,e),t[0]=e)}function Jd(n,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y)&&(n.uniform2f(this.addr,e.x,e.y),t[0]=e.x,t[1]=e.y);else{if(dt(t,e))return;n.uniform2fv(this.addr,e),pt(t,e)}}function Qd(n,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z)&&(n.uniform3f(this.addr,e.x,e.y,e.z),t[0]=e.x,t[1]=e.y,t[2]=e.z);else if(e.r!==void 0)(t[0]!==e.r||t[1]!==e.g||t[2]!==e.b)&&(n.uniform3f(this.addr,e.r,e.g,e.b),t[0]=e.r,t[1]=e.g,t[2]=e.b);else{if(dt(t,e))return;n.uniform3fv(this.addr,e),pt(t,e)}}function ep(n,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z||t[3]!==e.w)&&(n.uniform4f(this.addr,e.x,e.y,e.z,e.w),t[0]=e.x,t[1]=e.y,t[2]=e.z,t[3]=e.w);else{if(dt(t,e))return;n.uniform4fv(this.addr,e),pt(t,e)}}function tp(n,e){const t=this.cache,i=e.elements;if(i===void 0){if(dt(t,e))return;n.uniformMatrix2fv(this.addr,!1,e),pt(t,e)}else{if(dt(t,i))return;el.set(i),n.uniformMatrix2fv(this.addr,!1,el),pt(t,i)}}function np(n,e){const t=this.cache,i=e.elements;if(i===void 0){if(dt(t,e))return;n.uniformMatrix3fv(this.addr,!1,e),pt(t,e)}else{if(dt(t,i))return;Qo.set(i),n.uniformMatrix3fv(this.addr,!1,Qo),pt(t,i)}}function ip(n,e){const t=this.cache,i=e.elements;if(i===void 0){if(dt(t,e))return;n.uniformMatrix4fv(this.addr,!1,e),pt(t,e)}else{if(dt(t,i))return;Jo.set(i),n.uniformMatrix4fv(this.addr,!1,Jo),pt(t,i)}}function sp(n,e){const t=this.cache;t[0]!==e&&(n.uniform1i(this.addr,e),t[0]=e)}function rp(n,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y)&&(n.uniform2i(this.addr,e.x,e.y),t[0]=e.x,t[1]=e.y);else{if(dt(t,e))return;n.uniform2iv(this.addr,e),pt(t,e)}}function ap(n,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z)&&(n.uniform3i(this.addr,e.x,e.y,e.z),t[0]=e.x,t[1]=e.y,t[2]=e.z);else{if(dt(t,e))return;n.uniform3iv(this.addr,e),pt(t,e)}}function op(n,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z||t[3]!==e.w)&&(n.uniform4i(this.addr,e.x,e.y,e.z,e.w),t[0]=e.x,t[1]=e.y,t[2]=e.z,t[3]=e.w);else{if(dt(t,e))return;n.uniform4iv(this.addr,e),pt(t,e)}}function lp(n,e){const t=this.cache;t[0]!==e&&(n.uniform1ui(this.addr,e),t[0]=e)}function cp(n,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y)&&(n.uniform2ui(this.addr,e.x,e.y),t[0]=e.x,t[1]=e.y);else{if(dt(t,e))return;n.uniform2uiv(this.addr,e),pt(t,e)}}function up(n,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z)&&(n.uniform3ui(this.addr,e.x,e.y,e.z),t[0]=e.x,t[1]=e.y,t[2]=e.z);else{if(dt(t,e))return;n.uniform3uiv(this.addr,e),pt(t,e)}}function hp(n,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z||t[3]!==e.w)&&(n.uniform4ui(this.addr,e.x,e.y,e.z,e.w),t[0]=e.x,t[1]=e.y,t[2]=e.z,t[3]=e.w);else{if(dt(t,e))return;n.uniform4uiv(this.addr,e),pt(t,e)}}function fp(n,e,t){const i=this.cache,s=t.allocateTextureUnit();i[0]!==s&&(n.uniform1i(this.addr,s),i[0]=s);let r;this.type===n.SAMPLER_2D_SHADOW?($o.compareFunction=zl,r=$o):r=nc,t.setTexture2D(e||r,s)}function dp(n,e,t){const i=this.cache,s=t.allocateTextureUnit();i[0]!==s&&(n.uniform1i(this.addr,s),i[0]=s),t.setTexture3D(e||sc,s)}function pp(n,e,t){const i=this.cache,s=t.allocateTextureUnit();i[0]!==s&&(n.uniform1i(this.addr,s),i[0]=s),t.setTextureCube(e||rc,s)}function mp(n,e,t){const i=this.cache,s=t.allocateTextureUnit();i[0]!==s&&(n.uniform1i(this.addr,s),i[0]=s),t.setTexture2DArray(e||ic,s)}function gp(n){switch(n){case 5126:return jd;case 35664:return Jd;case 35665:return Qd;case 35666:return ep;case 35674:return tp;case 35675:return np;case 35676:return ip;case 5124:case 35670:return sp;case 35667:case 35671:return rp;case 35668:case 35672:return ap;case 35669:case 35673:return op;case 5125:return lp;case 36294:return cp;case 36295:return up;case 36296:return hp;case 35678:case 36198:case 36298:case 36306:case 35682:return fp;case 35679:case 36299:case 36307:return dp;case 35680:case 36300:case 36308:case 36293:return pp;case 36289:case 36303:case 36311:case 36292:return mp}}function _p(n,e){n.uniform1fv(this.addr,e)}function vp(n,e){const t=Ki(e,this.size,2);n.uniform2fv(this.addr,t)}function xp(n,e){const t=Ki(e,this.size,3);n.uniform3fv(this.addr,t)}function Mp(n,e){const t=Ki(e,this.size,4);n.uniform4fv(this.addr,t)}function Sp(n,e){const t=Ki(e,this.size,4);n.uniformMatrix2fv(this.addr,!1,t)}function yp(n,e){const t=Ki(e,this.size,9);n.uniformMatrix3fv(this.addr,!1,t)}function Ep(n,e){const t=Ki(e,this.size,16);n.uniformMatrix4fv(this.addr,!1,t)}function Tp(n,e){n.uniform1iv(this.addr,e)}function Ap(n,e){n.uniform2iv(this.addr,e)}function bp(n,e){n.uniform3iv(this.addr,e)}function wp(n,e){n.uniform4iv(this.addr,e)}function Rp(n,e){n.uniform1uiv(this.addr,e)}function Cp(n,e){n.uniform2uiv(this.addr,e)}function Pp(n,e){n.uniform3uiv(this.addr,e)}function Dp(n,e){n.uniform4uiv(this.addr,e)}function Lp(n,e,t){const i=this.cache,s=e.length,r=pr(t,s);dt(i,r)||(n.uniform1iv(this.addr,r),pt(i,r));for(let a=0;a!==s;++a)t.setTexture2D(e[a]||nc,r[a])}function Ip(n,e,t){const i=this.cache,s=e.length,r=pr(t,s);dt(i,r)||(n.uniform1iv(this.addr,r),pt(i,r));for(let a=0;a!==s;++a)t.setTexture3D(e[a]||sc,r[a])}function Up(n,e,t){const i=this.cache,s=e.length,r=pr(t,s);dt(i,r)||(n.uniform1iv(this.addr,r),pt(i,r));for(let a=0;a!==s;++a)t.setTextureCube(e[a]||rc,r[a])}function Np(n,e,t){const i=this.cache,s=e.length,r=pr(t,s);dt(i,r)||(n.uniform1iv(this.addr,r),pt(i,r));for(let a=0;a!==s;++a)t.setTexture2DArray(e[a]||ic,r[a])}function Fp(n){switch(n){case 5126:return _p;case 35664:return vp;case 35665:return xp;case 35666:return Mp;case 35674:return Sp;case 35675:return yp;case 35676:return Ep;case 5124:case 35670:return Tp;case 35667:case 35671:return Ap;case 35668:case 35672:return bp;case 35669:case 35673:return wp;case 5125:return Rp;case 36294:return Cp;case 36295:return Pp;case 36296:return Dp;case 35678:case 36198:case 36298:case 36306:case 35682:return Lp;case 35679:case 36299:case 36307:return Ip;case 35680:case 36300:case 36308:case 36293:return Up;case 36289:case 36303:case 36311:case 36292:return Np}}class Op{constructor(e,t,i){this.id=e,this.addr=i,this.cache=[],this.type=t.type,this.setValue=gp(t.type)}}class Bp{constructor(e,t,i){this.id=e,this.addr=i,this.cache=[],this.type=t.type,this.size=t.size,this.setValue=Fp(t.type)}}class zp{constructor(e){this.id=e,this.seq=[],this.map={}}setValue(e,t,i){const s=this.seq;for(let r=0,a=s.length;r!==a;++r){const o=s[r];o.setValue(e,t[o.id],i)}}}const qr=/(\w+)(\])?(\[|\.)?/g;function tl(n,e){n.seq.push(e),n.map[e.id]=e}function kp(n,e,t){const i=n.name,s=i.length;for(qr.lastIndex=0;;){const r=qr.exec(i),a=qr.lastIndex;let o=r[1];const l=r[2]==="]",c=r[3];if(l&&(o=o|0),c===void 0||c==="["&&a+2===s){tl(t,c===void 0?new Op(o,n,e):new Bp(o,n,e));break}else{let d=t.map[o];d===void 0&&(d=new zp(o),tl(t,d)),t=d}}}class er{constructor(e,t){this.seq=[],this.map={};const i=e.getProgramParameter(t,e.ACTIVE_UNIFORMS);for(let s=0;s<i;++s){const r=e.getActiveUniform(t,s),a=e.getUniformLocation(t,r.name);kp(r,a,this)}}setValue(e,t,i,s){const r=this.map[t];r!==void 0&&r.setValue(e,i,s)}setOptional(e,t,i){const s=t[i];s!==void 0&&this.setValue(e,i,s)}static upload(e,t,i,s){for(let r=0,a=t.length;r!==a;++r){const o=t[r],l=i[o.id];l.needsUpdate!==!1&&o.setValue(e,l.value,s)}}static seqWithValue(e,t){const i=[];for(let s=0,r=e.length;s!==r;++s){const a=e[s];a.id in t&&i.push(a)}return i}}function nl(n,e,t){const i=n.createShader(e);return n.shaderSource(i,t),n.compileShader(i),i}const Gp=37297;let Hp=0;function Vp(n,e){const t=n.split(`
`),i=[],s=Math.max(e-6,0),r=Math.min(e+6,t.length);for(let a=s;a<r;a++){const o=a+1;i.push(`${o===e?">":" "} ${o}: ${t[a]}`)}return i.join(`
`)}const il=new Ue;function Wp(n){qe._getMatrix(il,qe.workingColorSpace,n);const e=`mat3( ${il.elements.map(t=>t.toFixed(4))} )`;switch(qe.getTransfer(n)){case fr:return[e,"LinearTransferOETF"];case Je:return[e,"sRGBTransferOETF"];default:return console.warn("THREE.WebGLProgram: Unsupported color space: ",n),[e,"LinearTransferOETF"]}}function sl(n,e,t){const i=n.getShaderParameter(e,n.COMPILE_STATUS),s=n.getShaderInfoLog(e).trim();if(i&&s==="")return"";const r=/ERROR: 0:(\d+)/.exec(s);if(r){const a=parseInt(r[1]);return t.toUpperCase()+`

`+s+`

`+Vp(n.getShaderSource(e),a)}else return s}function Xp(n,e){const t=Wp(e);return[`vec4 ${n}( vec4 value ) {`,`	return ${t[1]}( vec4( value.rgb * ${t[0]}, value.a ) );`,"}"].join(`
`)}function qp(n,e){let t;switch(e){case ou:t="Linear";break;case lu:t="Reinhard";break;case cu:t="Cineon";break;case uu:t="ACESFilmic";break;case fu:t="AgX";break;case du:t="Neutral";break;case hu:t="Custom";break;default:console.warn("THREE.WebGLProgram: Unsupported toneMapping:",e),t="Linear"}return"vec3 "+n+"( vec3 color ) { return "+t+"ToneMapping( color ); }"}const Vs=new N;function Yp(){qe.getLuminanceCoefficients(Vs);const n=Vs.x.toFixed(4),e=Vs.y.toFixed(4),t=Vs.z.toFixed(4);return["float luminance( const in vec3 rgb ) {",`	const vec3 weights = vec3( ${n}, ${e}, ${t} );`,"	return dot( weights, rgb );","}"].join(`
`)}function Kp(n){return[n.extensionClipCullDistance?"#extension GL_ANGLE_clip_cull_distance : require":"",n.extensionMultiDraw?"#extension GL_ANGLE_multi_draw : require":""].filter(rs).join(`
`)}function $p(n){const e=[];for(const t in n){const i=n[t];i!==!1&&e.push("#define "+t+" "+i)}return e.join(`
`)}function Zp(n,e){const t={},i=n.getProgramParameter(e,n.ACTIVE_ATTRIBUTES);for(let s=0;s<i;s++){const r=n.getActiveAttrib(e,s),a=r.name;let o=1;r.type===n.FLOAT_MAT2&&(o=2),r.type===n.FLOAT_MAT3&&(o=3),r.type===n.FLOAT_MAT4&&(o=4),t[a]={type:r.type,location:n.getAttribLocation(e,a),locationSize:o}}return t}function rs(n){return n!==""}function rl(n,e){const t=e.numSpotLightShadows+e.numSpotLightMaps-e.numSpotLightShadowsWithMaps;return n.replace(/NUM_DIR_LIGHTS/g,e.numDirLights).replace(/NUM_SPOT_LIGHTS/g,e.numSpotLights).replace(/NUM_SPOT_LIGHT_MAPS/g,e.numSpotLightMaps).replace(/NUM_SPOT_LIGHT_COORDS/g,t).replace(/NUM_RECT_AREA_LIGHTS/g,e.numRectAreaLights).replace(/NUM_POINT_LIGHTS/g,e.numPointLights).replace(/NUM_HEMI_LIGHTS/g,e.numHemiLights).replace(/NUM_DIR_LIGHT_SHADOWS/g,e.numDirLightShadows).replace(/NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS/g,e.numSpotLightShadowsWithMaps).replace(/NUM_SPOT_LIGHT_SHADOWS/g,e.numSpotLightShadows).replace(/NUM_POINT_LIGHT_SHADOWS/g,e.numPointLightShadows)}function al(n,e){return n.replace(/NUM_CLIPPING_PLANES/g,e.numClippingPlanes).replace(/UNION_CLIPPING_PLANES/g,e.numClippingPlanes-e.numClipIntersection)}const jp=/^[ \t]*#include +<([\w\d./]+)>/gm;function ka(n){return n.replace(jp,Qp)}const Jp=new Map;function Qp(n,e){let t=Ge[e];if(t===void 0){const i=Jp.get(e);if(i!==void 0)t=Ge[i],console.warn('THREE.WebGLRenderer: Shader chunk "%s" has been deprecated. Use "%s" instead.',e,i);else throw new Error("Can not resolve #include <"+e+">")}return ka(t)}const em=/#pragma unroll_loop_start\s+for\s*\(\s*int\s+i\s*=\s*(\d+)\s*;\s*i\s*<\s*(\d+)\s*;\s*i\s*\+\+\s*\)\s*{([\s\S]+?)}\s+#pragma unroll_loop_end/g;function ol(n){return n.replace(em,tm)}function tm(n,e,t,i){let s="";for(let r=parseInt(e);r<parseInt(t);r++)s+=i.replace(/\[\s*i\s*\]/g,"[ "+r+" ]").replace(/UNROLLED_LOOP_INDEX/g,r);return s}function ll(n){let e=`precision ${n.precision} float;
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
#define LOW_PRECISION`),e}function nm(n){let e="SHADOWMAP_TYPE_BASIC";return n.shadowMapType===bl?e="SHADOWMAP_TYPE_PCF":n.shadowMapType===Hc?e="SHADOWMAP_TYPE_PCF_SOFT":n.shadowMapType===mn&&(e="SHADOWMAP_TYPE_VSM"),e}function im(n){let e="ENVMAP_TYPE_CUBE";if(n.envMap)switch(n.envMapMode){case Ni:case Fi:e="ENVMAP_TYPE_CUBE";break;case hr:e="ENVMAP_TYPE_CUBE_UV";break}return e}function sm(n){let e="ENVMAP_MODE_REFLECTION";if(n.envMap)switch(n.envMapMode){case Fi:e="ENVMAP_MODE_REFRACTION";break}return e}function rm(n){let e="ENVMAP_BLENDING_NONE";if(n.envMap)switch(n.combine){case wl:e="ENVMAP_BLENDING_MULTIPLY";break;case ru:e="ENVMAP_BLENDING_MIX";break;case au:e="ENVMAP_BLENDING_ADD";break}return e}function am(n){const e=n.envMapCubeUVHeight;if(e===null)return null;const t=Math.log2(e)-2,i=1/e;return{texelWidth:1/(3*Math.max(Math.pow(2,t),112)),texelHeight:i,maxMip:t}}function om(n,e,t,i){const s=n.getContext(),r=t.defines;let a=t.vertexShader,o=t.fragmentShader;const l=nm(t),c=im(t),u=sm(t),d=rm(t),f=am(t),m=Kp(t),g=$p(r),_=s.createProgram();let p,h,A=t.glslVersion?"#version "+t.glslVersion+`
`:"";t.isRawShaderMaterial?(p=["#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,g].filter(rs).join(`
`),p.length>0&&(p+=`
`),h=["#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,g].filter(rs).join(`
`),h.length>0&&(h+=`
`)):(p=[ll(t),"#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,g,t.extensionClipCullDistance?"#define USE_CLIP_DISTANCE":"",t.batching?"#define USE_BATCHING":"",t.batchingColor?"#define USE_BATCHING_COLOR":"",t.instancing?"#define USE_INSTANCING":"",t.instancingColor?"#define USE_INSTANCING_COLOR":"",t.instancingMorph?"#define USE_INSTANCING_MORPH":"",t.useFog&&t.fog?"#define USE_FOG":"",t.useFog&&t.fogExp2?"#define FOG_EXP2":"",t.map?"#define USE_MAP":"",t.envMap?"#define USE_ENVMAP":"",t.envMap?"#define "+u:"",t.lightMap?"#define USE_LIGHTMAP":"",t.aoMap?"#define USE_AOMAP":"",t.bumpMap?"#define USE_BUMPMAP":"",t.normalMap?"#define USE_NORMALMAP":"",t.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",t.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",t.displacementMap?"#define USE_DISPLACEMENTMAP":"",t.emissiveMap?"#define USE_EMISSIVEMAP":"",t.anisotropy?"#define USE_ANISOTROPY":"",t.anisotropyMap?"#define USE_ANISOTROPYMAP":"",t.clearcoatMap?"#define USE_CLEARCOATMAP":"",t.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",t.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",t.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",t.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",t.specularMap?"#define USE_SPECULARMAP":"",t.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",t.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",t.roughnessMap?"#define USE_ROUGHNESSMAP":"",t.metalnessMap?"#define USE_METALNESSMAP":"",t.alphaMap?"#define USE_ALPHAMAP":"",t.alphaHash?"#define USE_ALPHAHASH":"",t.transmission?"#define USE_TRANSMISSION":"",t.transmissionMap?"#define USE_TRANSMISSIONMAP":"",t.thicknessMap?"#define USE_THICKNESSMAP":"",t.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",t.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",t.mapUv?"#define MAP_UV "+t.mapUv:"",t.alphaMapUv?"#define ALPHAMAP_UV "+t.alphaMapUv:"",t.lightMapUv?"#define LIGHTMAP_UV "+t.lightMapUv:"",t.aoMapUv?"#define AOMAP_UV "+t.aoMapUv:"",t.emissiveMapUv?"#define EMISSIVEMAP_UV "+t.emissiveMapUv:"",t.bumpMapUv?"#define BUMPMAP_UV "+t.bumpMapUv:"",t.normalMapUv?"#define NORMALMAP_UV "+t.normalMapUv:"",t.displacementMapUv?"#define DISPLACEMENTMAP_UV "+t.displacementMapUv:"",t.metalnessMapUv?"#define METALNESSMAP_UV "+t.metalnessMapUv:"",t.roughnessMapUv?"#define ROUGHNESSMAP_UV "+t.roughnessMapUv:"",t.anisotropyMapUv?"#define ANISOTROPYMAP_UV "+t.anisotropyMapUv:"",t.clearcoatMapUv?"#define CLEARCOATMAP_UV "+t.clearcoatMapUv:"",t.clearcoatNormalMapUv?"#define CLEARCOAT_NORMALMAP_UV "+t.clearcoatNormalMapUv:"",t.clearcoatRoughnessMapUv?"#define CLEARCOAT_ROUGHNESSMAP_UV "+t.clearcoatRoughnessMapUv:"",t.iridescenceMapUv?"#define IRIDESCENCEMAP_UV "+t.iridescenceMapUv:"",t.iridescenceThicknessMapUv?"#define IRIDESCENCE_THICKNESSMAP_UV "+t.iridescenceThicknessMapUv:"",t.sheenColorMapUv?"#define SHEEN_COLORMAP_UV "+t.sheenColorMapUv:"",t.sheenRoughnessMapUv?"#define SHEEN_ROUGHNESSMAP_UV "+t.sheenRoughnessMapUv:"",t.specularMapUv?"#define SPECULARMAP_UV "+t.specularMapUv:"",t.specularColorMapUv?"#define SPECULAR_COLORMAP_UV "+t.specularColorMapUv:"",t.specularIntensityMapUv?"#define SPECULAR_INTENSITYMAP_UV "+t.specularIntensityMapUv:"",t.transmissionMapUv?"#define TRANSMISSIONMAP_UV "+t.transmissionMapUv:"",t.thicknessMapUv?"#define THICKNESSMAP_UV "+t.thicknessMapUv:"",t.vertexTangents&&t.flatShading===!1?"#define USE_TANGENT":"",t.vertexColors?"#define USE_COLOR":"",t.vertexAlphas?"#define USE_COLOR_ALPHA":"",t.vertexUv1s?"#define USE_UV1":"",t.vertexUv2s?"#define USE_UV2":"",t.vertexUv3s?"#define USE_UV3":"",t.pointsUvs?"#define USE_POINTS_UV":"",t.flatShading?"#define FLAT_SHADED":"",t.skinning?"#define USE_SKINNING":"",t.morphTargets?"#define USE_MORPHTARGETS":"",t.morphNormals&&t.flatShading===!1?"#define USE_MORPHNORMALS":"",t.morphColors?"#define USE_MORPHCOLORS":"",t.morphTargetsCount>0?"#define MORPHTARGETS_TEXTURE_STRIDE "+t.morphTextureStride:"",t.morphTargetsCount>0?"#define MORPHTARGETS_COUNT "+t.morphTargetsCount:"",t.doubleSided?"#define DOUBLE_SIDED":"",t.flipSided?"#define FLIP_SIDED":"",t.shadowMapEnabled?"#define USE_SHADOWMAP":"",t.shadowMapEnabled?"#define "+l:"",t.sizeAttenuation?"#define USE_SIZEATTENUATION":"",t.numLightProbes>0?"#define USE_LIGHT_PROBES":"",t.logarithmicDepthBuffer?"#define USE_LOGDEPTHBUF":"",t.reverseDepthBuffer?"#define USE_REVERSEDEPTHBUF":"","uniform mat4 modelMatrix;","uniform mat4 modelViewMatrix;","uniform mat4 projectionMatrix;","uniform mat4 viewMatrix;","uniform mat3 normalMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;","#ifdef USE_INSTANCING","	attribute mat4 instanceMatrix;","#endif","#ifdef USE_INSTANCING_COLOR","	attribute vec3 instanceColor;","#endif","#ifdef USE_INSTANCING_MORPH","	uniform sampler2D morphTexture;","#endif","attribute vec3 position;","attribute vec3 normal;","attribute vec2 uv;","#ifdef USE_UV1","	attribute vec2 uv1;","#endif","#ifdef USE_UV2","	attribute vec2 uv2;","#endif","#ifdef USE_UV3","	attribute vec2 uv3;","#endif","#ifdef USE_TANGENT","	attribute vec4 tangent;","#endif","#if defined( USE_COLOR_ALPHA )","	attribute vec4 color;","#elif defined( USE_COLOR )","	attribute vec3 color;","#endif","#ifdef USE_SKINNING","	attribute vec4 skinIndex;","	attribute vec4 skinWeight;","#endif",`
`].filter(rs).join(`
`),h=[ll(t),"#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,g,t.useFog&&t.fog?"#define USE_FOG":"",t.useFog&&t.fogExp2?"#define FOG_EXP2":"",t.alphaToCoverage?"#define ALPHA_TO_COVERAGE":"",t.map?"#define USE_MAP":"",t.matcap?"#define USE_MATCAP":"",t.envMap?"#define USE_ENVMAP":"",t.envMap?"#define "+c:"",t.envMap?"#define "+u:"",t.envMap?"#define "+d:"",f?"#define CUBEUV_TEXEL_WIDTH "+f.texelWidth:"",f?"#define CUBEUV_TEXEL_HEIGHT "+f.texelHeight:"",f?"#define CUBEUV_MAX_MIP "+f.maxMip+".0":"",t.lightMap?"#define USE_LIGHTMAP":"",t.aoMap?"#define USE_AOMAP":"",t.bumpMap?"#define USE_BUMPMAP":"",t.normalMap?"#define USE_NORMALMAP":"",t.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",t.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",t.emissiveMap?"#define USE_EMISSIVEMAP":"",t.anisotropy?"#define USE_ANISOTROPY":"",t.anisotropyMap?"#define USE_ANISOTROPYMAP":"",t.clearcoat?"#define USE_CLEARCOAT":"",t.clearcoatMap?"#define USE_CLEARCOATMAP":"",t.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",t.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",t.dispersion?"#define USE_DISPERSION":"",t.iridescence?"#define USE_IRIDESCENCE":"",t.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",t.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",t.specularMap?"#define USE_SPECULARMAP":"",t.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",t.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",t.roughnessMap?"#define USE_ROUGHNESSMAP":"",t.metalnessMap?"#define USE_METALNESSMAP":"",t.alphaMap?"#define USE_ALPHAMAP":"",t.alphaTest?"#define USE_ALPHATEST":"",t.alphaHash?"#define USE_ALPHAHASH":"",t.sheen?"#define USE_SHEEN":"",t.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",t.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",t.transmission?"#define USE_TRANSMISSION":"",t.transmissionMap?"#define USE_TRANSMISSIONMAP":"",t.thicknessMap?"#define USE_THICKNESSMAP":"",t.vertexTangents&&t.flatShading===!1?"#define USE_TANGENT":"",t.vertexColors||t.instancingColor||t.batchingColor?"#define USE_COLOR":"",t.vertexAlphas?"#define USE_COLOR_ALPHA":"",t.vertexUv1s?"#define USE_UV1":"",t.vertexUv2s?"#define USE_UV2":"",t.vertexUv3s?"#define USE_UV3":"",t.pointsUvs?"#define USE_POINTS_UV":"",t.gradientMap?"#define USE_GRADIENTMAP":"",t.flatShading?"#define FLAT_SHADED":"",t.doubleSided?"#define DOUBLE_SIDED":"",t.flipSided?"#define FLIP_SIDED":"",t.shadowMapEnabled?"#define USE_SHADOWMAP":"",t.shadowMapEnabled?"#define "+l:"",t.premultipliedAlpha?"#define PREMULTIPLIED_ALPHA":"",t.numLightProbes>0?"#define USE_LIGHT_PROBES":"",t.decodeVideoTexture?"#define DECODE_VIDEO_TEXTURE":"",t.decodeVideoTextureEmissive?"#define DECODE_VIDEO_TEXTURE_EMISSIVE":"",t.logarithmicDepthBuffer?"#define USE_LOGDEPTHBUF":"",t.reverseDepthBuffer?"#define USE_REVERSEDEPTHBUF":"","uniform mat4 viewMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;",t.toneMapping!==Gn?"#define TONE_MAPPING":"",t.toneMapping!==Gn?Ge.tonemapping_pars_fragment:"",t.toneMapping!==Gn?qp("toneMapping",t.toneMapping):"",t.dithering?"#define DITHERING":"",t.opaque?"#define OPAQUE":"",Ge.colorspace_pars_fragment,Xp("linearToOutputTexel",t.outputColorSpace),Yp(),t.useDepthPacking?"#define DEPTH_PACKING "+t.depthPacking:"",`
`].filter(rs).join(`
`)),a=ka(a),a=rl(a,t),a=al(a,t),o=ka(o),o=rl(o,t),o=al(o,t),a=ol(a),o=ol(o),t.isRawShaderMaterial!==!0&&(A=`#version 300 es
`,p=[m,"#define attribute in","#define varying out","#define texture2D texture"].join(`
`)+`
`+p,h=["#define varying in",t.glslVersion===Bn?"":"layout(location = 0) out highp vec4 pc_fragColor;",t.glslVersion===Bn?"":"#define gl_FragColor pc_fragColor","#define gl_FragDepthEXT gl_FragDepth","#define texture2D texture","#define textureCube texture","#define texture2DProj textureProj","#define texture2DLodEXT textureLod","#define texture2DProjLodEXT textureProjLod","#define textureCubeLodEXT textureLod","#define texture2DGradEXT textureGrad","#define texture2DProjGradEXT textureProjGrad","#define textureCubeGradEXT textureGrad"].join(`
`)+`
`+h);const S=A+p+a,M=A+h+o,P=nl(s,s.VERTEX_SHADER,S),b=nl(s,s.FRAGMENT_SHADER,M);s.attachShader(_,P),s.attachShader(_,b),t.index0AttributeName!==void 0?s.bindAttribLocation(_,0,t.index0AttributeName):t.morphTargets===!0&&s.bindAttribLocation(_,0,"position"),s.linkProgram(_);function w(C){if(n.debug.checkShaderErrors){const V=s.getProgramInfoLog(_).trim(),F=s.getShaderInfoLog(P).trim(),W=s.getShaderInfoLog(b).trim();let K=!0,G=!0;if(s.getProgramParameter(_,s.LINK_STATUS)===!1)if(K=!1,typeof n.debug.onShaderError=="function")n.debug.onShaderError(s,_,P,b);else{const Z=sl(s,P,"vertex"),H=sl(s,b,"fragment");console.error("THREE.WebGLProgram: Shader Error "+s.getError()+" - VALIDATE_STATUS "+s.getProgramParameter(_,s.VALIDATE_STATUS)+`

Material Name: `+C.name+`
Material Type: `+C.type+`

Program Info Log: `+V+`
`+Z+`
`+H)}else V!==""?console.warn("THREE.WebGLProgram: Program Info Log:",V):(F===""||W==="")&&(G=!1);G&&(C.diagnostics={runnable:K,programLog:V,vertexShader:{log:F,prefix:p},fragmentShader:{log:W,prefix:h}})}s.deleteShader(P),s.deleteShader(b),L=new er(s,_),E=Zp(s,_)}let L;this.getUniforms=function(){return L===void 0&&w(this),L};let E;this.getAttributes=function(){return E===void 0&&w(this),E};let x=t.rendererExtensionParallelShaderCompile===!1;return this.isReady=function(){return x===!1&&(x=s.getProgramParameter(_,Gp)),x},this.destroy=function(){i.releaseStatesOfProgram(this),s.deleteProgram(_),this.program=void 0},this.type=t.shaderType,this.name=t.shaderName,this.id=Hp++,this.cacheKey=e,this.usedTimes=1,this.program=_,this.vertexShader=P,this.fragmentShader=b,this}let lm=0;class cm{constructor(){this.shaderCache=new Map,this.materialCache=new Map}update(e){const t=e.vertexShader,i=e.fragmentShader,s=this._getShaderStage(t),r=this._getShaderStage(i),a=this._getShaderCacheForMaterial(e);return a.has(s)===!1&&(a.add(s),s.usedTimes++),a.has(r)===!1&&(a.add(r),r.usedTimes++),this}remove(e){const t=this.materialCache.get(e);for(const i of t)i.usedTimes--,i.usedTimes===0&&this.shaderCache.delete(i.code);return this.materialCache.delete(e),this}getVertexShaderID(e){return this._getShaderStage(e.vertexShader).id}getFragmentShaderID(e){return this._getShaderStage(e.fragmentShader).id}dispose(){this.shaderCache.clear(),this.materialCache.clear()}_getShaderCacheForMaterial(e){const t=this.materialCache;let i=t.get(e);return i===void 0&&(i=new Set,t.set(e,i)),i}_getShaderStage(e){const t=this.shaderCache;let i=t.get(e);return i===void 0&&(i=new um(e),t.set(e,i)),i}}class um{constructor(e){this.id=lm++,this.code=e,this.usedTimes=0}}function hm(n,e,t,i,s,r,a){const o=new Wl,l=new cm,c=new Set,u=[],d=s.logarithmicDepthBuffer,f=s.vertexTextures;let m=s.precision;const g={MeshDepthMaterial:"depth",MeshDistanceMaterial:"distanceRGBA",MeshNormalMaterial:"normal",MeshBasicMaterial:"basic",MeshLambertMaterial:"lambert",MeshPhongMaterial:"phong",MeshToonMaterial:"toon",MeshStandardMaterial:"physical",MeshPhysicalMaterial:"physical",MeshMatcapMaterial:"matcap",LineBasicMaterial:"basic",LineDashedMaterial:"dashed",PointsMaterial:"points",ShadowMaterial:"shadow",SpriteMaterial:"sprite"};function _(E){return c.add(E),E===0?"uv":`uv${E}`}function p(E,x,C,V,F){const W=V.fog,K=F.geometry,G=E.isMeshStandardMaterial?V.environment:null,Z=(E.isMeshStandardMaterial?t:e).get(E.envMap||G),H=Z&&Z.mapping===hr?Z.image.height:null,ne=g[E.type];E.precision!==null&&(m=s.getMaxPrecision(E.precision),m!==E.precision&&console.warn("THREE.WebGLProgram.getParameters:",E.precision,"not supported, using",m,"instead."));const J=K.morphAttributes.position||K.morphAttributes.normal||K.morphAttributes.color,re=J!==void 0?J.length:0;let we=0;K.morphAttributes.position!==void 0&&(we=1),K.morphAttributes.normal!==void 0&&(we=2),K.morphAttributes.color!==void 0&&(we=3);let Be,B,Q,ue;if(ne){const Ze=nn[ne];Be=Ze.vertexShader,B=Ze.fragmentShader}else Be=E.vertexShader,B=E.fragmentShader,l.update(E),Q=l.getVertexShaderID(E),ue=l.getFragmentShaderID(E);const ie=n.getRenderTarget(),Ae=n.state.buffers.depth.getReversed(),Pe=F.isInstancedMesh===!0,ee=F.isBatchedMesh===!0,le=!!E.map,xe=!!E.matcap,Le=!!Z,R=!!E.aoMap,ze=!!E.lightMap,Me=!!E.bumpMap,Re=!!E.normalMap,ge=!!E.displacementMap,Ne=!!E.emissiveMap,Se=!!E.metalnessMap,T=!!E.roughnessMap,v=E.anisotropy>0,O=E.clearcoat>0,$=E.dispersion>0,Y=E.iridescence>0,q=E.sheen>0,he=E.transmission>0,ae=v&&!!E.anisotropyMap,_e=O&&!!E.clearcoatMap,He=O&&!!E.clearcoatNormalMap,te=O&&!!E.clearcoatRoughnessMap,pe=Y&&!!E.iridescenceMap,De=Y&&!!E.iridescenceThicknessMap,Ce=q&&!!E.sheenColorMap,ve=q&&!!E.sheenRoughnessMap,We=!!E.specularMap,ke=!!E.specularColorMap,Qe=!!E.specularIntensityMap,D=he&&!!E.transmissionMap,ce=he&&!!E.thicknessMap,X=!!E.gradientMap,j=!!E.alphaMap,me=E.alphaTest>0,fe=!!E.alphaHash,Fe=!!E.extensions;let at=Gn;E.toneMapped&&(ie===null||ie.isXRRenderTarget===!0)&&(at=n.toneMapping);const _t={shaderID:ne,shaderType:E.type,shaderName:E.name,vertexShader:Be,fragmentShader:B,defines:E.defines,customVertexShaderID:Q,customFragmentShaderID:ue,isRawShaderMaterial:E.isRawShaderMaterial===!0,glslVersion:E.glslVersion,precision:m,batching:ee,batchingColor:ee&&F._colorsTexture!==null,instancing:Pe,instancingColor:Pe&&F.instanceColor!==null,instancingMorph:Pe&&F.morphTexture!==null,supportsVertexTextures:f,outputColorSpace:ie===null?n.outputColorSpace:ie.isXRRenderTarget===!0?ie.texture.colorSpace:Wi,alphaToCoverage:!!E.alphaToCoverage,map:le,matcap:xe,envMap:Le,envMapMode:Le&&Z.mapping,envMapCubeUVHeight:H,aoMap:R,lightMap:ze,bumpMap:Me,normalMap:Re,displacementMap:f&&ge,emissiveMap:Ne,normalMapObjectSpace:Re&&E.normalMapType===vu,normalMapTangentSpace:Re&&E.normalMapType===_u,metalnessMap:Se,roughnessMap:T,anisotropy:v,anisotropyMap:ae,clearcoat:O,clearcoatMap:_e,clearcoatNormalMap:He,clearcoatRoughnessMap:te,dispersion:$,iridescence:Y,iridescenceMap:pe,iridescenceThicknessMap:De,sheen:q,sheenColorMap:Ce,sheenRoughnessMap:ve,specularMap:We,specularColorMap:ke,specularIntensityMap:Qe,transmission:he,transmissionMap:D,thicknessMap:ce,gradientMap:X,opaque:E.transparent===!1&&E.blending===Pi&&E.alphaToCoverage===!1,alphaMap:j,alphaTest:me,alphaHash:fe,combine:E.combine,mapUv:le&&_(E.map.channel),aoMapUv:R&&_(E.aoMap.channel),lightMapUv:ze&&_(E.lightMap.channel),bumpMapUv:Me&&_(E.bumpMap.channel),normalMapUv:Re&&_(E.normalMap.channel),displacementMapUv:ge&&_(E.displacementMap.channel),emissiveMapUv:Ne&&_(E.emissiveMap.channel),metalnessMapUv:Se&&_(E.metalnessMap.channel),roughnessMapUv:T&&_(E.roughnessMap.channel),anisotropyMapUv:ae&&_(E.anisotropyMap.channel),clearcoatMapUv:_e&&_(E.clearcoatMap.channel),clearcoatNormalMapUv:He&&_(E.clearcoatNormalMap.channel),clearcoatRoughnessMapUv:te&&_(E.clearcoatRoughnessMap.channel),iridescenceMapUv:pe&&_(E.iridescenceMap.channel),iridescenceThicknessMapUv:De&&_(E.iridescenceThicknessMap.channel),sheenColorMapUv:Ce&&_(E.sheenColorMap.channel),sheenRoughnessMapUv:ve&&_(E.sheenRoughnessMap.channel),specularMapUv:We&&_(E.specularMap.channel),specularColorMapUv:ke&&_(E.specularColorMap.channel),specularIntensityMapUv:Qe&&_(E.specularIntensityMap.channel),transmissionMapUv:D&&_(E.transmissionMap.channel),thicknessMapUv:ce&&_(E.thicknessMap.channel),alphaMapUv:j&&_(E.alphaMap.channel),vertexTangents:!!K.attributes.tangent&&(Re||v),vertexColors:E.vertexColors,vertexAlphas:E.vertexColors===!0&&!!K.attributes.color&&K.attributes.color.itemSize===4,pointsUvs:F.isPoints===!0&&!!K.attributes.uv&&(le||j),fog:!!W,useFog:E.fog===!0,fogExp2:!!W&&W.isFogExp2,flatShading:E.flatShading===!0,sizeAttenuation:E.sizeAttenuation===!0,logarithmicDepthBuffer:d,reverseDepthBuffer:Ae,skinning:F.isSkinnedMesh===!0,morphTargets:K.morphAttributes.position!==void 0,morphNormals:K.morphAttributes.normal!==void 0,morphColors:K.morphAttributes.color!==void 0,morphTargetsCount:re,morphTextureStride:we,numDirLights:x.directional.length,numPointLights:x.point.length,numSpotLights:x.spot.length,numSpotLightMaps:x.spotLightMap.length,numRectAreaLights:x.rectArea.length,numHemiLights:x.hemi.length,numDirLightShadows:x.directionalShadowMap.length,numPointLightShadows:x.pointShadowMap.length,numSpotLightShadows:x.spotShadowMap.length,numSpotLightShadowsWithMaps:x.numSpotLightShadowsWithMaps,numLightProbes:x.numLightProbes,numClippingPlanes:a.numPlanes,numClipIntersection:a.numIntersection,dithering:E.dithering,shadowMapEnabled:n.shadowMap.enabled&&C.length>0,shadowMapType:n.shadowMap.type,toneMapping:at,decodeVideoTexture:le&&E.map.isVideoTexture===!0&&qe.getTransfer(E.map.colorSpace)===Je,decodeVideoTextureEmissive:Ne&&E.emissiveMap.isVideoTexture===!0&&qe.getTransfer(E.emissiveMap.colorSpace)===Je,premultipliedAlpha:E.premultipliedAlpha,doubleSided:E.side===sn,flipSided:E.side===Rt,useDepthPacking:E.depthPacking>=0,depthPacking:E.depthPacking||0,index0AttributeName:E.index0AttributeName,extensionClipCullDistance:Fe&&E.extensions.clipCullDistance===!0&&i.has("WEBGL_clip_cull_distance"),extensionMultiDraw:(Fe&&E.extensions.multiDraw===!0||ee)&&i.has("WEBGL_multi_draw"),rendererExtensionParallelShaderCompile:i.has("KHR_parallel_shader_compile"),customProgramCacheKey:E.customProgramCacheKey()};return _t.vertexUv1s=c.has(1),_t.vertexUv2s=c.has(2),_t.vertexUv3s=c.has(3),c.clear(),_t}function h(E){const x=[];if(E.shaderID?x.push(E.shaderID):(x.push(E.customVertexShaderID),x.push(E.customFragmentShaderID)),E.defines!==void 0)for(const C in E.defines)x.push(C),x.push(E.defines[C]);return E.isRawShaderMaterial===!1&&(A(x,E),S(x,E),x.push(n.outputColorSpace)),x.push(E.customProgramCacheKey),x.join()}function A(E,x){E.push(x.precision),E.push(x.outputColorSpace),E.push(x.envMapMode),E.push(x.envMapCubeUVHeight),E.push(x.mapUv),E.push(x.alphaMapUv),E.push(x.lightMapUv),E.push(x.aoMapUv),E.push(x.bumpMapUv),E.push(x.normalMapUv),E.push(x.displacementMapUv),E.push(x.emissiveMapUv),E.push(x.metalnessMapUv),E.push(x.roughnessMapUv),E.push(x.anisotropyMapUv),E.push(x.clearcoatMapUv),E.push(x.clearcoatNormalMapUv),E.push(x.clearcoatRoughnessMapUv),E.push(x.iridescenceMapUv),E.push(x.iridescenceThicknessMapUv),E.push(x.sheenColorMapUv),E.push(x.sheenRoughnessMapUv),E.push(x.specularMapUv),E.push(x.specularColorMapUv),E.push(x.specularIntensityMapUv),E.push(x.transmissionMapUv),E.push(x.thicknessMapUv),E.push(x.combine),E.push(x.fogExp2),E.push(x.sizeAttenuation),E.push(x.morphTargetsCount),E.push(x.morphAttributeCount),E.push(x.numDirLights),E.push(x.numPointLights),E.push(x.numSpotLights),E.push(x.numSpotLightMaps),E.push(x.numHemiLights),E.push(x.numRectAreaLights),E.push(x.numDirLightShadows),E.push(x.numPointLightShadows),E.push(x.numSpotLightShadows),E.push(x.numSpotLightShadowsWithMaps),E.push(x.numLightProbes),E.push(x.shadowMapType),E.push(x.toneMapping),E.push(x.numClippingPlanes),E.push(x.numClipIntersection),E.push(x.depthPacking)}function S(E,x){o.disableAll(),x.supportsVertexTextures&&o.enable(0),x.instancing&&o.enable(1),x.instancingColor&&o.enable(2),x.instancingMorph&&o.enable(3),x.matcap&&o.enable(4),x.envMap&&o.enable(5),x.normalMapObjectSpace&&o.enable(6),x.normalMapTangentSpace&&o.enable(7),x.clearcoat&&o.enable(8),x.iridescence&&o.enable(9),x.alphaTest&&o.enable(10),x.vertexColors&&o.enable(11),x.vertexAlphas&&o.enable(12),x.vertexUv1s&&o.enable(13),x.vertexUv2s&&o.enable(14),x.vertexUv3s&&o.enable(15),x.vertexTangents&&o.enable(16),x.anisotropy&&o.enable(17),x.alphaHash&&o.enable(18),x.batching&&o.enable(19),x.dispersion&&o.enable(20),x.batchingColor&&o.enable(21),E.push(o.mask),o.disableAll(),x.fog&&o.enable(0),x.useFog&&o.enable(1),x.flatShading&&o.enable(2),x.logarithmicDepthBuffer&&o.enable(3),x.reverseDepthBuffer&&o.enable(4),x.skinning&&o.enable(5),x.morphTargets&&o.enable(6),x.morphNormals&&o.enable(7),x.morphColors&&o.enable(8),x.premultipliedAlpha&&o.enable(9),x.shadowMapEnabled&&o.enable(10),x.doubleSided&&o.enable(11),x.flipSided&&o.enable(12),x.useDepthPacking&&o.enable(13),x.dithering&&o.enable(14),x.transmission&&o.enable(15),x.sheen&&o.enable(16),x.opaque&&o.enable(17),x.pointsUvs&&o.enable(18),x.decodeVideoTexture&&o.enable(19),x.decodeVideoTextureEmissive&&o.enable(20),x.alphaToCoverage&&o.enable(21),E.push(o.mask)}function M(E){const x=g[E.type];let C;if(x){const V=nn[x];C=Yu.clone(V.uniforms)}else C=E.uniforms;return C}function P(E,x){let C;for(let V=0,F=u.length;V<F;V++){const W=u[V];if(W.cacheKey===x){C=W,++C.usedTimes;break}}return C===void 0&&(C=new om(n,x,E,r),u.push(C)),C}function b(E){if(--E.usedTimes===0){const x=u.indexOf(E);u[x]=u[u.length-1],u.pop(),E.destroy()}}function w(E){l.remove(E)}function L(){l.dispose()}return{getParameters:p,getProgramCacheKey:h,getUniforms:M,acquireProgram:P,releaseProgram:b,releaseShaderCache:w,programs:u,dispose:L}}function fm(){let n=new WeakMap;function e(a){return n.has(a)}function t(a){let o=n.get(a);return o===void 0&&(o={},n.set(a,o)),o}function i(a){n.delete(a)}function s(a,o,l){n.get(a)[o]=l}function r(){n=new WeakMap}return{has:e,get:t,remove:i,update:s,dispose:r}}function dm(n,e){return n.groupOrder!==e.groupOrder?n.groupOrder-e.groupOrder:n.renderOrder!==e.renderOrder?n.renderOrder-e.renderOrder:n.material.id!==e.material.id?n.material.id-e.material.id:n.z!==e.z?n.z-e.z:n.id-e.id}function cl(n,e){return n.groupOrder!==e.groupOrder?n.groupOrder-e.groupOrder:n.renderOrder!==e.renderOrder?n.renderOrder-e.renderOrder:n.z!==e.z?e.z-n.z:n.id-e.id}function ul(){const n=[];let e=0;const t=[],i=[],s=[];function r(){e=0,t.length=0,i.length=0,s.length=0}function a(d,f,m,g,_,p){let h=n[e];return h===void 0?(h={id:d.id,object:d,geometry:f,material:m,groupOrder:g,renderOrder:d.renderOrder,z:_,group:p},n[e]=h):(h.id=d.id,h.object=d,h.geometry=f,h.material=m,h.groupOrder=g,h.renderOrder=d.renderOrder,h.z=_,h.group=p),e++,h}function o(d,f,m,g,_,p){const h=a(d,f,m,g,_,p);m.transmission>0?i.push(h):m.transparent===!0?s.push(h):t.push(h)}function l(d,f,m,g,_,p){const h=a(d,f,m,g,_,p);m.transmission>0?i.unshift(h):m.transparent===!0?s.unshift(h):t.unshift(h)}function c(d,f){t.length>1&&t.sort(d||dm),i.length>1&&i.sort(f||cl),s.length>1&&s.sort(f||cl)}function u(){for(let d=e,f=n.length;d<f;d++){const m=n[d];if(m.id===null)break;m.id=null,m.object=null,m.geometry=null,m.material=null,m.group=null}}return{opaque:t,transmissive:i,transparent:s,init:r,push:o,unshift:l,finish:u,sort:c}}function pm(){let n=new WeakMap;function e(i,s){const r=n.get(i);let a;return r===void 0?(a=new ul,n.set(i,[a])):s>=r.length?(a=new ul,r.push(a)):a=r[s],a}function t(){n=new WeakMap}return{get:e,dispose:t}}function mm(){const n={};return{get:function(e){if(n[e.id]!==void 0)return n[e.id];let t;switch(e.type){case"DirectionalLight":t={direction:new N,color:new je};break;case"SpotLight":t={position:new N,direction:new N,color:new je,distance:0,coneCos:0,penumbraCos:0,decay:0};break;case"PointLight":t={position:new N,color:new je,distance:0,decay:0};break;case"HemisphereLight":t={direction:new N,skyColor:new je,groundColor:new je};break;case"RectAreaLight":t={color:new je,position:new N,halfWidth:new N,halfHeight:new N};break}return n[e.id]=t,t}}}function gm(){const n={};return{get:function(e){if(n[e.id]!==void 0)return n[e.id];let t;switch(e.type){case"DirectionalLight":t={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new Ve};break;case"SpotLight":t={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new Ve};break;case"PointLight":t={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new Ve,shadowCameraNear:1,shadowCameraFar:1e3};break}return n[e.id]=t,t}}}let _m=0;function vm(n,e){return(e.castShadow?2:0)-(n.castShadow?2:0)+(e.map?1:0)-(n.map?1:0)}function xm(n){const e=new mm,t=gm(),i={version:0,hash:{directionalLength:-1,pointLength:-1,spotLength:-1,rectAreaLength:-1,hemiLength:-1,numDirectionalShadows:-1,numPointShadows:-1,numSpotShadows:-1,numSpotMaps:-1,numLightProbes:-1},ambient:[0,0,0],probe:[],directional:[],directionalShadow:[],directionalShadowMap:[],directionalShadowMatrix:[],spot:[],spotLightMap:[],spotShadow:[],spotShadowMap:[],spotLightMatrix:[],rectArea:[],rectAreaLTC1:null,rectAreaLTC2:null,point:[],pointShadow:[],pointShadowMap:[],pointShadowMatrix:[],hemi:[],numSpotLightShadowsWithMaps:0,numLightProbes:0};for(let c=0;c<9;c++)i.probe.push(new N);const s=new N,r=new rt,a=new rt;function o(c){let u=0,d=0,f=0;for(let E=0;E<9;E++)i.probe[E].set(0,0,0);let m=0,g=0,_=0,p=0,h=0,A=0,S=0,M=0,P=0,b=0,w=0;c.sort(vm);for(let E=0,x=c.length;E<x;E++){const C=c[E],V=C.color,F=C.intensity,W=C.distance,K=C.shadow&&C.shadow.map?C.shadow.map.texture:null;if(C.isAmbientLight)u+=V.r*F,d+=V.g*F,f+=V.b*F;else if(C.isLightProbe){for(let G=0;G<9;G++)i.probe[G].addScaledVector(C.sh.coefficients[G],F);w++}else if(C.isDirectionalLight){const G=e.get(C);if(G.color.copy(C.color).multiplyScalar(C.intensity),C.castShadow){const Z=C.shadow,H=t.get(C);H.shadowIntensity=Z.intensity,H.shadowBias=Z.bias,H.shadowNormalBias=Z.normalBias,H.shadowRadius=Z.radius,H.shadowMapSize=Z.mapSize,i.directionalShadow[m]=H,i.directionalShadowMap[m]=K,i.directionalShadowMatrix[m]=C.shadow.matrix,A++}i.directional[m]=G,m++}else if(C.isSpotLight){const G=e.get(C);G.position.setFromMatrixPosition(C.matrixWorld),G.color.copy(V).multiplyScalar(F),G.distance=W,G.coneCos=Math.cos(C.angle),G.penumbraCos=Math.cos(C.angle*(1-C.penumbra)),G.decay=C.decay,i.spot[_]=G;const Z=C.shadow;if(C.map&&(i.spotLightMap[P]=C.map,P++,Z.updateMatrices(C),C.castShadow&&b++),i.spotLightMatrix[_]=Z.matrix,C.castShadow){const H=t.get(C);H.shadowIntensity=Z.intensity,H.shadowBias=Z.bias,H.shadowNormalBias=Z.normalBias,H.shadowRadius=Z.radius,H.shadowMapSize=Z.mapSize,i.spotShadow[_]=H,i.spotShadowMap[_]=K,M++}_++}else if(C.isRectAreaLight){const G=e.get(C);G.color.copy(V).multiplyScalar(F),G.halfWidth.set(C.width*.5,0,0),G.halfHeight.set(0,C.height*.5,0),i.rectArea[p]=G,p++}else if(C.isPointLight){const G=e.get(C);if(G.color.copy(C.color).multiplyScalar(C.intensity),G.distance=C.distance,G.decay=C.decay,C.castShadow){const Z=C.shadow,H=t.get(C);H.shadowIntensity=Z.intensity,H.shadowBias=Z.bias,H.shadowNormalBias=Z.normalBias,H.shadowRadius=Z.radius,H.shadowMapSize=Z.mapSize,H.shadowCameraNear=Z.camera.near,H.shadowCameraFar=Z.camera.far,i.pointShadow[g]=H,i.pointShadowMap[g]=K,i.pointShadowMatrix[g]=C.shadow.matrix,S++}i.point[g]=G,g++}else if(C.isHemisphereLight){const G=e.get(C);G.skyColor.copy(C.color).multiplyScalar(F),G.groundColor.copy(C.groundColor).multiplyScalar(F),i.hemi[h]=G,h++}}p>0&&(n.has("OES_texture_float_linear")===!0?(i.rectAreaLTC1=oe.LTC_FLOAT_1,i.rectAreaLTC2=oe.LTC_FLOAT_2):(i.rectAreaLTC1=oe.LTC_HALF_1,i.rectAreaLTC2=oe.LTC_HALF_2)),i.ambient[0]=u,i.ambient[1]=d,i.ambient[2]=f;const L=i.hash;(L.directionalLength!==m||L.pointLength!==g||L.spotLength!==_||L.rectAreaLength!==p||L.hemiLength!==h||L.numDirectionalShadows!==A||L.numPointShadows!==S||L.numSpotShadows!==M||L.numSpotMaps!==P||L.numLightProbes!==w)&&(i.directional.length=m,i.spot.length=_,i.rectArea.length=p,i.point.length=g,i.hemi.length=h,i.directionalShadow.length=A,i.directionalShadowMap.length=A,i.pointShadow.length=S,i.pointShadowMap.length=S,i.spotShadow.length=M,i.spotShadowMap.length=M,i.directionalShadowMatrix.length=A,i.pointShadowMatrix.length=S,i.spotLightMatrix.length=M+P-b,i.spotLightMap.length=P,i.numSpotLightShadowsWithMaps=b,i.numLightProbes=w,L.directionalLength=m,L.pointLength=g,L.spotLength=_,L.rectAreaLength=p,L.hemiLength=h,L.numDirectionalShadows=A,L.numPointShadows=S,L.numSpotShadows=M,L.numSpotMaps=P,L.numLightProbes=w,i.version=_m++)}function l(c,u){let d=0,f=0,m=0,g=0,_=0;const p=u.matrixWorldInverse;for(let h=0,A=c.length;h<A;h++){const S=c[h];if(S.isDirectionalLight){const M=i.directional[d];M.direction.setFromMatrixPosition(S.matrixWorld),s.setFromMatrixPosition(S.target.matrixWorld),M.direction.sub(s),M.direction.transformDirection(p),d++}else if(S.isSpotLight){const M=i.spot[m];M.position.setFromMatrixPosition(S.matrixWorld),M.position.applyMatrix4(p),M.direction.setFromMatrixPosition(S.matrixWorld),s.setFromMatrixPosition(S.target.matrixWorld),M.direction.sub(s),M.direction.transformDirection(p),m++}else if(S.isRectAreaLight){const M=i.rectArea[g];M.position.setFromMatrixPosition(S.matrixWorld),M.position.applyMatrix4(p),a.identity(),r.copy(S.matrixWorld),r.premultiply(p),a.extractRotation(r),M.halfWidth.set(S.width*.5,0,0),M.halfHeight.set(0,S.height*.5,0),M.halfWidth.applyMatrix4(a),M.halfHeight.applyMatrix4(a),g++}else if(S.isPointLight){const M=i.point[f];M.position.setFromMatrixPosition(S.matrixWorld),M.position.applyMatrix4(p),f++}else if(S.isHemisphereLight){const M=i.hemi[_];M.direction.setFromMatrixPosition(S.matrixWorld),M.direction.transformDirection(p),_++}}}return{setup:o,setupView:l,state:i}}function hl(n){const e=new xm(n),t=[],i=[];function s(u){c.camera=u,t.length=0,i.length=0}function r(u){t.push(u)}function a(u){i.push(u)}function o(){e.setup(t)}function l(u){e.setupView(t,u)}const c={lightsArray:t,shadowsArray:i,camera:null,lights:e,transmissionRenderTarget:{}};return{init:s,state:c,setupLights:o,setupLightsView:l,pushLight:r,pushShadow:a}}function Mm(n){let e=new WeakMap;function t(s,r=0){const a=e.get(s);let o;return a===void 0?(o=new hl(n),e.set(s,[o])):r>=a.length?(o=new hl(n),a.push(o)):o=a[r],o}function i(){e=new WeakMap}return{get:t,dispose:i}}class Sm extends xs{static get type(){return"MeshDepthMaterial"}constructor(e){super(),this.isMeshDepthMaterial=!0,this.depthPacking=mu,this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.wireframe=!1,this.wireframeLinewidth=1,this.setValues(e)}copy(e){return super.copy(e),this.depthPacking=e.depthPacking,this.map=e.map,this.alphaMap=e.alphaMap,this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this}}class ym extends xs{static get type(){return"MeshDistanceMaterial"}constructor(e){super(),this.isMeshDistanceMaterial=!0,this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.setValues(e)}copy(e){return super.copy(e),this.map=e.map,this.alphaMap=e.alphaMap,this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this}}const Em=`void main() {
	gl_Position = vec4( position, 1.0 );
}`,Tm=`uniform sampler2D shadow_pass;
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
}`;function Am(n,e,t){let i=new Jl;const s=new Ve,r=new Ve,a=new tt,o=new Sm({depthPacking:gu}),l=new ym,c={},u=t.maxTextureSize,d={[Vn]:Rt,[Rt]:Vn,[sn]:sn},f=new wt({defines:{VSM_SAMPLES:8},uniforms:{shadow_pass:{value:null},resolution:{value:new Ve},radius:{value:4}},vertexShader:Em,fragmentShader:Tm}),m=f.clone();m.defines.HORIZONTAL_PASS=1;const g=new Qt;g.setAttribute("position",new ut(new Float32Array([-1,-1,.5,3,-1,.5,-1,3,.5]),3));const _=new Gt(g,f),p=this;this.enabled=!1,this.autoUpdate=!0,this.needsUpdate=!1,this.type=bl;let h=this.type;this.render=function(b,w,L){if(p.enabled===!1||p.autoUpdate===!1&&p.needsUpdate===!1||b.length===0)return;const E=n.getRenderTarget(),x=n.getActiveCubeFace(),C=n.getActiveMipmapLevel(),V=n.state;V.setBlending(kn),V.buffers.color.setClear(1,1,1,1),V.buffers.depth.setTest(!0),V.setScissorTest(!1);const F=h!==mn&&this.type===mn,W=h===mn&&this.type!==mn;for(let K=0,G=b.length;K<G;K++){const Z=b[K],H=Z.shadow;if(H===void 0){console.warn("THREE.WebGLShadowMap:",Z,"has no shadow.");continue}if(H.autoUpdate===!1&&H.needsUpdate===!1)continue;s.copy(H.mapSize);const ne=H.getFrameExtents();if(s.multiply(ne),r.copy(H.mapSize),(s.x>u||s.y>u)&&(s.x>u&&(r.x=Math.floor(u/ne.x),s.x=r.x*ne.x,H.mapSize.x=r.x),s.y>u&&(r.y=Math.floor(u/ne.y),s.y=r.y*ne.y,H.mapSize.y=r.y)),H.map===null||F===!0||W===!0){const re=this.type!==mn?{minFilter:ft,magFilter:ft}:{};H.map!==null&&H.map.dispose(),H.map=new Sn(s.x,s.y,re),H.map.texture.name=Z.name+".shadowMap",H.camera.updateProjectionMatrix()}n.setRenderTarget(H.map),n.clear();const J=H.getViewportCount();for(let re=0;re<J;re++){const we=H.getViewport(re);a.set(r.x*we.x,r.y*we.y,r.x*we.z,r.y*we.w),V.viewport(a),H.updateMatrices(Z,re),i=H.getFrustum(),M(w,L,H.camera,Z,this.type)}H.isPointLightShadow!==!0&&this.type===mn&&A(H,L),H.needsUpdate=!1}h=this.type,p.needsUpdate=!1,n.setRenderTarget(E,x,C)};function A(b,w){const L=e.update(_);f.defines.VSM_SAMPLES!==b.blurSamples&&(f.defines.VSM_SAMPLES=b.blurSamples,m.defines.VSM_SAMPLES=b.blurSamples,f.needsUpdate=!0,m.needsUpdate=!0),b.mapPass===null&&(b.mapPass=new Sn(s.x,s.y)),f.uniforms.shadow_pass.value=b.map.texture,f.uniforms.resolution.value=b.mapSize,f.uniforms.radius.value=b.radius,n.setRenderTarget(b.mapPass),n.clear(),n.renderBufferDirect(w,null,L,f,_,null),m.uniforms.shadow_pass.value=b.mapPass.texture,m.uniforms.resolution.value=b.mapSize,m.uniforms.radius.value=b.radius,n.setRenderTarget(b.map),n.clear(),n.renderBufferDirect(w,null,L,m,_,null)}function S(b,w,L,E){let x=null;const C=L.isPointLight===!0?b.customDistanceMaterial:b.customDepthMaterial;if(C!==void 0)x=C;else if(x=L.isPointLight===!0?l:o,n.localClippingEnabled&&w.clipShadows===!0&&Array.isArray(w.clippingPlanes)&&w.clippingPlanes.length!==0||w.displacementMap&&w.displacementScale!==0||w.alphaMap&&w.alphaTest>0||w.map&&w.alphaTest>0){const V=x.uuid,F=w.uuid;let W=c[V];W===void 0&&(W={},c[V]=W);let K=W[F];K===void 0&&(K=x.clone(),W[F]=K,w.addEventListener("dispose",P)),x=K}if(x.visible=w.visible,x.wireframe=w.wireframe,E===mn?x.side=w.shadowSide!==null?w.shadowSide:w.side:x.side=w.shadowSide!==null?w.shadowSide:d[w.side],x.alphaMap=w.alphaMap,x.alphaTest=w.alphaTest,x.map=w.map,x.clipShadows=w.clipShadows,x.clippingPlanes=w.clippingPlanes,x.clipIntersection=w.clipIntersection,x.displacementMap=w.displacementMap,x.displacementScale=w.displacementScale,x.displacementBias=w.displacementBias,x.wireframeLinewidth=w.wireframeLinewidth,x.linewidth=w.linewidth,L.isPointLight===!0&&x.isMeshDistanceMaterial===!0){const V=n.properties.get(x);V.light=L}return x}function M(b,w,L,E,x){if(b.visible===!1)return;if(b.layers.test(w.layers)&&(b.isMesh||b.isLine||b.isPoints)&&(b.castShadow||b.receiveShadow&&x===mn)&&(!b.frustumCulled||i.intersectsObject(b))){b.modelViewMatrix.multiplyMatrices(L.matrixWorldInverse,b.matrixWorld);const F=e.update(b),W=b.material;if(Array.isArray(W)){const K=F.groups;for(let G=0,Z=K.length;G<Z;G++){const H=K[G],ne=W[H.materialIndex];if(ne&&ne.visible){const J=S(b,ne,E,x);b.onBeforeShadow(n,b,w,L,F,J,H),n.renderBufferDirect(L,null,F,J,b,H),b.onAfterShadow(n,b,w,L,F,J,H)}}}else if(W.visible){const K=S(b,W,E,x);b.onBeforeShadow(n,b,w,L,F,K,null),n.renderBufferDirect(L,null,F,K,b,null),b.onAfterShadow(n,b,w,L,F,K,null)}}const V=b.children;for(let F=0,W=V.length;F<W;F++)M(V[F],w,L,E,x)}function P(b){b.target.removeEventListener("dispose",P);for(const L in c){const E=c[L],x=b.target.uuid;x in E&&(E[x].dispose(),delete E[x])}}}const bm={[na]:ia,[sa]:oa,[ra]:la,[Ui]:aa,[ia]:na,[oa]:sa,[la]:ra,[aa]:Ui};function wm(n,e){function t(){let D=!1;const ce=new tt;let X=null;const j=new tt(0,0,0,0);return{setMask:function(me){X!==me&&!D&&(n.colorMask(me,me,me,me),X=me)},setLocked:function(me){D=me},setClear:function(me,fe,Fe,at,_t){_t===!0&&(me*=at,fe*=at,Fe*=at),ce.set(me,fe,Fe,at),j.equals(ce)===!1&&(n.clearColor(me,fe,Fe,at),j.copy(ce))},reset:function(){D=!1,X=null,j.set(-1,0,0,0)}}}function i(){let D=!1,ce=!1,X=null,j=null,me=null;return{setReversed:function(fe){if(ce!==fe){const Fe=e.get("EXT_clip_control");ce?Fe.clipControlEXT(Fe.LOWER_LEFT_EXT,Fe.ZERO_TO_ONE_EXT):Fe.clipControlEXT(Fe.LOWER_LEFT_EXT,Fe.NEGATIVE_ONE_TO_ONE_EXT);const at=me;me=null,this.setClear(at)}ce=fe},getReversed:function(){return ce},setTest:function(fe){fe?ie(n.DEPTH_TEST):Ae(n.DEPTH_TEST)},setMask:function(fe){X!==fe&&!D&&(n.depthMask(fe),X=fe)},setFunc:function(fe){if(ce&&(fe=bm[fe]),j!==fe){switch(fe){case na:n.depthFunc(n.NEVER);break;case ia:n.depthFunc(n.ALWAYS);break;case sa:n.depthFunc(n.LESS);break;case Ui:n.depthFunc(n.LEQUAL);break;case ra:n.depthFunc(n.EQUAL);break;case aa:n.depthFunc(n.GEQUAL);break;case oa:n.depthFunc(n.GREATER);break;case la:n.depthFunc(n.NOTEQUAL);break;default:n.depthFunc(n.LEQUAL)}j=fe}},setLocked:function(fe){D=fe},setClear:function(fe){me!==fe&&(ce&&(fe=1-fe),n.clearDepth(fe),me=fe)},reset:function(){D=!1,X=null,j=null,me=null,ce=!1}}}function s(){let D=!1,ce=null,X=null,j=null,me=null,fe=null,Fe=null,at=null,_t=null;return{setTest:function(Ze){D||(Ze?ie(n.STENCIL_TEST):Ae(n.STENCIL_TEST))},setMask:function(Ze){ce!==Ze&&!D&&(n.stencilMask(Ze),ce=Ze)},setFunc:function(Ze,Vt,ln){(X!==Ze||j!==Vt||me!==ln)&&(n.stencilFunc(Ze,Vt,ln),X=Ze,j=Vt,me=ln)},setOp:function(Ze,Vt,ln){(fe!==Ze||Fe!==Vt||at!==ln)&&(n.stencilOp(Ze,Vt,ln),fe=Ze,Fe=Vt,at=ln)},setLocked:function(Ze){D=Ze},setClear:function(Ze){_t!==Ze&&(n.clearStencil(Ze),_t=Ze)},reset:function(){D=!1,ce=null,X=null,j=null,me=null,fe=null,Fe=null,at=null,_t=null}}}const r=new t,a=new i,o=new s,l=new WeakMap,c=new WeakMap;let u={},d={},f=new WeakMap,m=[],g=null,_=!1,p=null,h=null,A=null,S=null,M=null,P=null,b=null,w=new je(0,0,0),L=0,E=!1,x=null,C=null,V=null,F=null,W=null;const K=n.getParameter(n.MAX_COMBINED_TEXTURE_IMAGE_UNITS);let G=!1,Z=0;const H=n.getParameter(n.VERSION);H.indexOf("WebGL")!==-1?(Z=parseFloat(/^WebGL (\d)/.exec(H)[1]),G=Z>=1):H.indexOf("OpenGL ES")!==-1&&(Z=parseFloat(/^OpenGL ES (\d)/.exec(H)[1]),G=Z>=2);let ne=null,J={};const re=n.getParameter(n.SCISSOR_BOX),we=n.getParameter(n.VIEWPORT),Be=new tt().fromArray(re),B=new tt().fromArray(we);function Q(D,ce,X,j){const me=new Uint8Array(4),fe=n.createTexture();n.bindTexture(D,fe),n.texParameteri(D,n.TEXTURE_MIN_FILTER,n.NEAREST),n.texParameteri(D,n.TEXTURE_MAG_FILTER,n.NEAREST);for(let Fe=0;Fe<X;Fe++)D===n.TEXTURE_3D||D===n.TEXTURE_2D_ARRAY?n.texImage3D(ce,0,n.RGBA,1,1,j,0,n.RGBA,n.UNSIGNED_BYTE,me):n.texImage2D(ce+Fe,0,n.RGBA,1,1,0,n.RGBA,n.UNSIGNED_BYTE,me);return fe}const ue={};ue[n.TEXTURE_2D]=Q(n.TEXTURE_2D,n.TEXTURE_2D,1),ue[n.TEXTURE_CUBE_MAP]=Q(n.TEXTURE_CUBE_MAP,n.TEXTURE_CUBE_MAP_POSITIVE_X,6),ue[n.TEXTURE_2D_ARRAY]=Q(n.TEXTURE_2D_ARRAY,n.TEXTURE_2D_ARRAY,1,1),ue[n.TEXTURE_3D]=Q(n.TEXTURE_3D,n.TEXTURE_3D,1,1),r.setClear(0,0,0,1),a.setClear(1),o.setClear(0),ie(n.DEPTH_TEST),a.setFunc(Ui),Me(!1),Re(go),ie(n.CULL_FACE),R(kn);function ie(D){u[D]!==!0&&(n.enable(D),u[D]=!0)}function Ae(D){u[D]!==!1&&(n.disable(D),u[D]=!1)}function Pe(D,ce){return d[D]!==ce?(n.bindFramebuffer(D,ce),d[D]=ce,D===n.DRAW_FRAMEBUFFER&&(d[n.FRAMEBUFFER]=ce),D===n.FRAMEBUFFER&&(d[n.DRAW_FRAMEBUFFER]=ce),!0):!1}function ee(D,ce){let X=m,j=!1;if(D){X=f.get(ce),X===void 0&&(X=[],f.set(ce,X));const me=D.textures;if(X.length!==me.length||X[0]!==n.COLOR_ATTACHMENT0){for(let fe=0,Fe=me.length;fe<Fe;fe++)X[fe]=n.COLOR_ATTACHMENT0+fe;X.length=me.length,j=!0}}else X[0]!==n.BACK&&(X[0]=n.BACK,j=!0);j&&n.drawBuffers(X)}function le(D){return g!==D?(n.useProgram(D),g=D,!0):!1}const xe={[ei]:n.FUNC_ADD,[Vc]:n.FUNC_SUBTRACT,[Wc]:n.FUNC_REVERSE_SUBTRACT};xe[Xc]=n.MIN,xe[qc]=n.MAX;const Le={[Yc]:n.ZERO,[us]:n.ONE,[Kc]:n.SRC_COLOR,[ta]:n.SRC_ALPHA,[eu]:n.SRC_ALPHA_SATURATE,[Jc]:n.DST_COLOR,[Zc]:n.DST_ALPHA,[$c]:n.ONE_MINUS_SRC_COLOR,[li]:n.ONE_MINUS_SRC_ALPHA,[Qc]:n.ONE_MINUS_DST_COLOR,[jc]:n.ONE_MINUS_DST_ALPHA,[tu]:n.CONSTANT_COLOR,[nu]:n.ONE_MINUS_CONSTANT_COLOR,[iu]:n.CONSTANT_ALPHA,[su]:n.ONE_MINUS_CONSTANT_ALPHA};function R(D,ce,X,j,me,fe,Fe,at,_t,Ze){if(D===kn){_===!0&&(Ae(n.BLEND),_=!1);return}if(_===!1&&(ie(n.BLEND),_=!0),D!==cs){if(D!==p||Ze!==E){if((h!==ei||M!==ei)&&(n.blendEquation(n.FUNC_ADD),h=ei,M=ei),Ze)switch(D){case Pi:n.blendFuncSeparate(n.ONE,n.ONE_MINUS_SRC_ALPHA,n.ONE,n.ONE_MINUS_SRC_ALPHA);break;case _o:n.blendFunc(n.ONE,n.ONE);break;case vo:n.blendFuncSeparate(n.ZERO,n.ONE_MINUS_SRC_COLOR,n.ZERO,n.ONE);break;case xo:n.blendFuncSeparate(n.ZERO,n.SRC_COLOR,n.ZERO,n.SRC_ALPHA);break;default:console.error("THREE.WebGLState: Invalid blending: ",D);break}else switch(D){case Pi:n.blendFuncSeparate(n.SRC_ALPHA,n.ONE_MINUS_SRC_ALPHA,n.ONE,n.ONE_MINUS_SRC_ALPHA);break;case _o:n.blendFunc(n.SRC_ALPHA,n.ONE);break;case vo:n.blendFuncSeparate(n.ZERO,n.ONE_MINUS_SRC_COLOR,n.ZERO,n.ONE);break;case xo:n.blendFunc(n.ZERO,n.SRC_COLOR);break;default:console.error("THREE.WebGLState: Invalid blending: ",D);break}A=null,S=null,P=null,b=null,w.set(0,0,0),L=0,p=D,E=Ze}return}me=me||ce,fe=fe||X,Fe=Fe||j,(ce!==h||me!==M)&&(n.blendEquationSeparate(xe[ce],xe[me]),h=ce,M=me),(X!==A||j!==S||fe!==P||Fe!==b)&&(n.blendFuncSeparate(Le[X],Le[j],Le[fe],Le[Fe]),A=X,S=j,P=fe,b=Fe),(at.equals(w)===!1||_t!==L)&&(n.blendColor(at.r,at.g,at.b,_t),w.copy(at),L=_t),p=D,E=!1}function ze(D,ce){D.side===sn?Ae(n.CULL_FACE):ie(n.CULL_FACE);let X=D.side===Rt;ce&&(X=!X),Me(X),D.blending===Pi&&D.transparent===!1?R(kn):R(D.blending,D.blendEquation,D.blendSrc,D.blendDst,D.blendEquationAlpha,D.blendSrcAlpha,D.blendDstAlpha,D.blendColor,D.blendAlpha,D.premultipliedAlpha),a.setFunc(D.depthFunc),a.setTest(D.depthTest),a.setMask(D.depthWrite),r.setMask(D.colorWrite);const j=D.stencilWrite;o.setTest(j),j&&(o.setMask(D.stencilWriteMask),o.setFunc(D.stencilFunc,D.stencilRef,D.stencilFuncMask),o.setOp(D.stencilFail,D.stencilZFail,D.stencilZPass)),Ne(D.polygonOffset,D.polygonOffsetFactor,D.polygonOffsetUnits),D.alphaToCoverage===!0?ie(n.SAMPLE_ALPHA_TO_COVERAGE):Ae(n.SAMPLE_ALPHA_TO_COVERAGE)}function Me(D){x!==D&&(D?n.frontFace(n.CW):n.frontFace(n.CCW),x=D)}function Re(D){D!==kc?(ie(n.CULL_FACE),D!==C&&(D===go?n.cullFace(n.BACK):D===Gc?n.cullFace(n.FRONT):n.cullFace(n.FRONT_AND_BACK))):Ae(n.CULL_FACE),C=D}function ge(D){D!==V&&(G&&n.lineWidth(D),V=D)}function Ne(D,ce,X){D?(ie(n.POLYGON_OFFSET_FILL),(F!==ce||W!==X)&&(n.polygonOffset(ce,X),F=ce,W=X)):Ae(n.POLYGON_OFFSET_FILL)}function Se(D){D?ie(n.SCISSOR_TEST):Ae(n.SCISSOR_TEST)}function T(D){D===void 0&&(D=n.TEXTURE0+K-1),ne!==D&&(n.activeTexture(D),ne=D)}function v(D,ce,X){X===void 0&&(ne===null?X=n.TEXTURE0+K-1:X=ne);let j=J[X];j===void 0&&(j={type:void 0,texture:void 0},J[X]=j),(j.type!==D||j.texture!==ce)&&(ne!==X&&(n.activeTexture(X),ne=X),n.bindTexture(D,ce||ue[D]),j.type=D,j.texture=ce)}function O(){const D=J[ne];D!==void 0&&D.type!==void 0&&(n.bindTexture(D.type,null),D.type=void 0,D.texture=void 0)}function $(){try{n.compressedTexImage2D.apply(n,arguments)}catch(D){console.error("THREE.WebGLState:",D)}}function Y(){try{n.compressedTexImage3D.apply(n,arguments)}catch(D){console.error("THREE.WebGLState:",D)}}function q(){try{n.texSubImage2D.apply(n,arguments)}catch(D){console.error("THREE.WebGLState:",D)}}function he(){try{n.texSubImage3D.apply(n,arguments)}catch(D){console.error("THREE.WebGLState:",D)}}function ae(){try{n.compressedTexSubImage2D.apply(n,arguments)}catch(D){console.error("THREE.WebGLState:",D)}}function _e(){try{n.compressedTexSubImage3D.apply(n,arguments)}catch(D){console.error("THREE.WebGLState:",D)}}function He(){try{n.texStorage2D.apply(n,arguments)}catch(D){console.error("THREE.WebGLState:",D)}}function te(){try{n.texStorage3D.apply(n,arguments)}catch(D){console.error("THREE.WebGLState:",D)}}function pe(){try{n.texImage2D.apply(n,arguments)}catch(D){console.error("THREE.WebGLState:",D)}}function De(){try{n.texImage3D.apply(n,arguments)}catch(D){console.error("THREE.WebGLState:",D)}}function Ce(D){Be.equals(D)===!1&&(n.scissor(D.x,D.y,D.z,D.w),Be.copy(D))}function ve(D){B.equals(D)===!1&&(n.viewport(D.x,D.y,D.z,D.w),B.copy(D))}function We(D,ce){let X=c.get(ce);X===void 0&&(X=new WeakMap,c.set(ce,X));let j=X.get(D);j===void 0&&(j=n.getUniformBlockIndex(ce,D.name),X.set(D,j))}function ke(D,ce){const j=c.get(ce).get(D);l.get(ce)!==j&&(n.uniformBlockBinding(ce,j,D.__bindingPointIndex),l.set(ce,j))}function Qe(){n.disable(n.BLEND),n.disable(n.CULL_FACE),n.disable(n.DEPTH_TEST),n.disable(n.POLYGON_OFFSET_FILL),n.disable(n.SCISSOR_TEST),n.disable(n.STENCIL_TEST),n.disable(n.SAMPLE_ALPHA_TO_COVERAGE),n.blendEquation(n.FUNC_ADD),n.blendFunc(n.ONE,n.ZERO),n.blendFuncSeparate(n.ONE,n.ZERO,n.ONE,n.ZERO),n.blendColor(0,0,0,0),n.colorMask(!0,!0,!0,!0),n.clearColor(0,0,0,0),n.depthMask(!0),n.depthFunc(n.LESS),a.setReversed(!1),n.clearDepth(1),n.stencilMask(4294967295),n.stencilFunc(n.ALWAYS,0,4294967295),n.stencilOp(n.KEEP,n.KEEP,n.KEEP),n.clearStencil(0),n.cullFace(n.BACK),n.frontFace(n.CCW),n.polygonOffset(0,0),n.activeTexture(n.TEXTURE0),n.bindFramebuffer(n.FRAMEBUFFER,null),n.bindFramebuffer(n.DRAW_FRAMEBUFFER,null),n.bindFramebuffer(n.READ_FRAMEBUFFER,null),n.useProgram(null),n.lineWidth(1),n.scissor(0,0,n.canvas.width,n.canvas.height),n.viewport(0,0,n.canvas.width,n.canvas.height),u={},ne=null,J={},d={},f=new WeakMap,m=[],g=null,_=!1,p=null,h=null,A=null,S=null,M=null,P=null,b=null,w=new je(0,0,0),L=0,E=!1,x=null,C=null,V=null,F=null,W=null,Be.set(0,0,n.canvas.width,n.canvas.height),B.set(0,0,n.canvas.width,n.canvas.height),r.reset(),a.reset(),o.reset()}return{buffers:{color:r,depth:a,stencil:o},enable:ie,disable:Ae,bindFramebuffer:Pe,drawBuffers:ee,useProgram:le,setBlending:R,setMaterial:ze,setFlipSided:Me,setCullFace:Re,setLineWidth:ge,setPolygonOffset:Ne,setScissorTest:Se,activeTexture:T,bindTexture:v,unbindTexture:O,compressedTexImage2D:$,compressedTexImage3D:Y,texImage2D:pe,texImage3D:De,updateUBOMapping:We,uniformBlockBinding:ke,texStorage2D:He,texStorage3D:te,texSubImage2D:q,texSubImage3D:he,compressedTexSubImage2D:ae,compressedTexSubImage3D:_e,scissor:Ce,viewport:ve,reset:Qe}}function fl(n,e,t,i){const s=Rm(i);switch(t){case Ll:return n*e;case Ul:return n*e;case Nl:return n*e*2;case Fl:return n*e/s.components*s.byteLength;case ja:return n*e/s.components*s.byteLength;case Ol:return n*e*2/s.components*s.byteLength;case Ja:return n*e*2/s.components*s.byteLength;case Il:return n*e*3/s.components*s.byteLength;case kt:return n*e*4/s.components*s.byteLength;case Qa:return n*e*4/s.components*s.byteLength;case $s:case Zs:return Math.floor((n+3)/4)*Math.floor((e+3)/4)*8;case js:case Js:return Math.floor((n+3)/4)*Math.floor((e+3)/4)*16;case pa:case ga:return Math.max(n,16)*Math.max(e,8)/4;case da:case ma:return Math.max(n,8)*Math.max(e,8)/2;case _a:case va:return Math.floor((n+3)/4)*Math.floor((e+3)/4)*8;case xa:return Math.floor((n+3)/4)*Math.floor((e+3)/4)*16;case Ma:return Math.floor((n+3)/4)*Math.floor((e+3)/4)*16;case Sa:return Math.floor((n+4)/5)*Math.floor((e+3)/4)*16;case ya:return Math.floor((n+4)/5)*Math.floor((e+4)/5)*16;case Ea:return Math.floor((n+5)/6)*Math.floor((e+4)/5)*16;case Ta:return Math.floor((n+5)/6)*Math.floor((e+5)/6)*16;case Aa:return Math.floor((n+7)/8)*Math.floor((e+4)/5)*16;case ba:return Math.floor((n+7)/8)*Math.floor((e+5)/6)*16;case wa:return Math.floor((n+7)/8)*Math.floor((e+7)/8)*16;case Ra:return Math.floor((n+9)/10)*Math.floor((e+4)/5)*16;case Ca:return Math.floor((n+9)/10)*Math.floor((e+5)/6)*16;case Pa:return Math.floor((n+9)/10)*Math.floor((e+7)/8)*16;case Da:return Math.floor((n+9)/10)*Math.floor((e+9)/10)*16;case La:return Math.floor((n+11)/12)*Math.floor((e+9)/10)*16;case Ia:return Math.floor((n+11)/12)*Math.floor((e+11)/12)*16;case Qs:case Ua:case Na:return Math.ceil(n/4)*Math.ceil(e/4)*16;case Bl:case Fa:return Math.ceil(n/4)*Math.ceil(e/4)*8;case Oa:case Ba:return Math.ceil(n/4)*Math.ceil(e/4)*16}throw new Error(`Unable to determine texture byte length for ${t} format.`)}function Rm(n){switch(n){case Jt:case Cl:return{byteLength:1,components:1};case hs:case Pl:case gs:return{byteLength:2,components:1};case $a:case Za:return{byteLength:2,components:4};case ci:case Ka:case an:return{byteLength:4,components:1};case Dl:return{byteLength:4,components:3}}throw new Error(`Unknown texture type ${n}.`)}function Cm(n,e,t,i,s,r,a){const o=e.has("WEBGL_multisampled_render_to_texture")?e.get("WEBGL_multisampled_render_to_texture"):null,l=typeof navigator>"u"?!1:/OculusBrowser/g.test(navigator.userAgent),c=new Ve,u=new WeakMap;let d;const f=new WeakMap;let m=!1;try{m=typeof OffscreenCanvas<"u"&&new OffscreenCanvas(1,1).getContext("2d")!==null}catch{}function g(T,v){return m?new OffscreenCanvas(T,v):rr("canvas")}function _(T,v,O){let $=1;const Y=Se(T);if((Y.width>O||Y.height>O)&&($=O/Math.max(Y.width,Y.height)),$<1)if(typeof HTMLImageElement<"u"&&T instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&T instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&T instanceof ImageBitmap||typeof VideoFrame<"u"&&T instanceof VideoFrame){const q=Math.floor($*Y.width),he=Math.floor($*Y.height);d===void 0&&(d=g(q,he));const ae=v?g(q,he):d;return ae.width=q,ae.height=he,ae.getContext("2d").drawImage(T,0,0,q,he),console.warn("THREE.WebGLRenderer: Texture has been resized from ("+Y.width+"x"+Y.height+") to ("+q+"x"+he+")."),ae}else return"data"in T&&console.warn("THREE.WebGLRenderer: Image in DataTexture is too big ("+Y.width+"x"+Y.height+")."),T;return T}function p(T){return T.generateMipmaps}function h(T){n.generateMipmap(T)}function A(T){return T.isWebGLCubeRenderTarget?n.TEXTURE_CUBE_MAP:T.isWebGL3DRenderTarget?n.TEXTURE_3D:T.isWebGLArrayRenderTarget||T.isCompressedArrayTexture?n.TEXTURE_2D_ARRAY:n.TEXTURE_2D}function S(T,v,O,$,Y=!1){if(T!==null){if(n[T]!==void 0)return n[T];console.warn("THREE.WebGLRenderer: Attempt to use non-existing WebGL internal format '"+T+"'")}let q=v;if(v===n.RED&&(O===n.FLOAT&&(q=n.R32F),O===n.HALF_FLOAT&&(q=n.R16F),O===n.UNSIGNED_BYTE&&(q=n.R8)),v===n.RED_INTEGER&&(O===n.UNSIGNED_BYTE&&(q=n.R8UI),O===n.UNSIGNED_SHORT&&(q=n.R16UI),O===n.UNSIGNED_INT&&(q=n.R32UI),O===n.BYTE&&(q=n.R8I),O===n.SHORT&&(q=n.R16I),O===n.INT&&(q=n.R32I)),v===n.RG&&(O===n.FLOAT&&(q=n.RG32F),O===n.HALF_FLOAT&&(q=n.RG16F),O===n.UNSIGNED_BYTE&&(q=n.RG8)),v===n.RG_INTEGER&&(O===n.UNSIGNED_BYTE&&(q=n.RG8UI),O===n.UNSIGNED_SHORT&&(q=n.RG16UI),O===n.UNSIGNED_INT&&(q=n.RG32UI),O===n.BYTE&&(q=n.RG8I),O===n.SHORT&&(q=n.RG16I),O===n.INT&&(q=n.RG32I)),v===n.RGB_INTEGER&&(O===n.UNSIGNED_BYTE&&(q=n.RGB8UI),O===n.UNSIGNED_SHORT&&(q=n.RGB16UI),O===n.UNSIGNED_INT&&(q=n.RGB32UI),O===n.BYTE&&(q=n.RGB8I),O===n.SHORT&&(q=n.RGB16I),O===n.INT&&(q=n.RGB32I)),v===n.RGBA_INTEGER&&(O===n.UNSIGNED_BYTE&&(q=n.RGBA8UI),O===n.UNSIGNED_SHORT&&(q=n.RGBA16UI),O===n.UNSIGNED_INT&&(q=n.RGBA32UI),O===n.BYTE&&(q=n.RGBA8I),O===n.SHORT&&(q=n.RGBA16I),O===n.INT&&(q=n.RGBA32I)),v===n.RGB&&O===n.UNSIGNED_INT_5_9_9_9_REV&&(q=n.RGB9_E5),v===n.RGBA){const he=Y?fr:qe.getTransfer($);O===n.FLOAT&&(q=n.RGBA32F),O===n.HALF_FLOAT&&(q=n.RGBA16F),O===n.UNSIGNED_BYTE&&(q=he===Je?n.SRGB8_ALPHA8:n.RGBA8),O===n.UNSIGNED_SHORT_4_4_4_4&&(q=n.RGBA4),O===n.UNSIGNED_SHORT_5_5_5_1&&(q=n.RGB5_A1)}return(q===n.R16F||q===n.R32F||q===n.RG16F||q===n.RG32F||q===n.RGBA16F||q===n.RGBA32F)&&e.get("EXT_color_buffer_float"),q}function M(T,v){let O;return T?v===null||v===ci||v===Oi?O=n.DEPTH24_STENCIL8:v===an?O=n.DEPTH32F_STENCIL8:v===hs&&(O=n.DEPTH24_STENCIL8,console.warn("DepthTexture: 16 bit depth attachment is not supported with stencil. Using 24-bit attachment.")):v===null||v===ci||v===Oi?O=n.DEPTH_COMPONENT24:v===an?O=n.DEPTH_COMPONENT32F:v===hs&&(O=n.DEPTH_COMPONENT16),O}function P(T,v){return p(T)===!0||T.isFramebufferTexture&&T.minFilter!==ft&&T.minFilter!==zt?Math.log2(Math.max(v.width,v.height))+1:T.mipmaps!==void 0&&T.mipmaps.length>0?T.mipmaps.length:T.isCompressedTexture&&Array.isArray(T.image)?v.mipmaps.length:1}function b(T){const v=T.target;v.removeEventListener("dispose",b),L(v),v.isVideoTexture&&u.delete(v)}function w(T){const v=T.target;v.removeEventListener("dispose",w),x(v)}function L(T){const v=i.get(T);if(v.__webglInit===void 0)return;const O=T.source,$=f.get(O);if($){const Y=$[v.__cacheKey];Y.usedTimes--,Y.usedTimes===0&&E(T),Object.keys($).length===0&&f.delete(O)}i.remove(T)}function E(T){const v=i.get(T);n.deleteTexture(v.__webglTexture);const O=T.source,$=f.get(O);delete $[v.__cacheKey],a.memory.textures--}function x(T){const v=i.get(T);if(T.depthTexture&&(T.depthTexture.dispose(),i.remove(T.depthTexture)),T.isWebGLCubeRenderTarget)for(let $=0;$<6;$++){if(Array.isArray(v.__webglFramebuffer[$]))for(let Y=0;Y<v.__webglFramebuffer[$].length;Y++)n.deleteFramebuffer(v.__webglFramebuffer[$][Y]);else n.deleteFramebuffer(v.__webglFramebuffer[$]);v.__webglDepthbuffer&&n.deleteRenderbuffer(v.__webglDepthbuffer[$])}else{if(Array.isArray(v.__webglFramebuffer))for(let $=0;$<v.__webglFramebuffer.length;$++)n.deleteFramebuffer(v.__webglFramebuffer[$]);else n.deleteFramebuffer(v.__webglFramebuffer);if(v.__webglDepthbuffer&&n.deleteRenderbuffer(v.__webglDepthbuffer),v.__webglMultisampledFramebuffer&&n.deleteFramebuffer(v.__webglMultisampledFramebuffer),v.__webglColorRenderbuffer)for(let $=0;$<v.__webglColorRenderbuffer.length;$++)v.__webglColorRenderbuffer[$]&&n.deleteRenderbuffer(v.__webglColorRenderbuffer[$]);v.__webglDepthRenderbuffer&&n.deleteRenderbuffer(v.__webglDepthRenderbuffer)}const O=T.textures;for(let $=0,Y=O.length;$<Y;$++){const q=i.get(O[$]);q.__webglTexture&&(n.deleteTexture(q.__webglTexture),a.memory.textures--),i.remove(O[$])}i.remove(T)}let C=0;function V(){C=0}function F(){const T=C;return T>=s.maxTextures&&console.warn("THREE.WebGLTextures: Trying to use "+T+" texture units while this GPU supports only "+s.maxTextures),C+=1,T}function W(T){const v=[];return v.push(T.wrapS),v.push(T.wrapT),v.push(T.wrapR||0),v.push(T.magFilter),v.push(T.minFilter),v.push(T.anisotropy),v.push(T.internalFormat),v.push(T.format),v.push(T.type),v.push(T.generateMipmaps),v.push(T.premultiplyAlpha),v.push(T.flipY),v.push(T.unpackAlignment),v.push(T.colorSpace),v.join()}function K(T,v){const O=i.get(T);if(T.isVideoTexture&&ge(T),T.isRenderTargetTexture===!1&&T.version>0&&O.__version!==T.version){const $=T.image;if($===null)console.warn("THREE.WebGLRenderer: Texture marked for update but no image data found.");else if($.complete===!1)console.warn("THREE.WebGLRenderer: Texture marked for update but image is incomplete");else{B(O,T,v);return}}t.bindTexture(n.TEXTURE_2D,O.__webglTexture,n.TEXTURE0+v)}function G(T,v){const O=i.get(T);if(T.version>0&&O.__version!==T.version){B(O,T,v);return}t.bindTexture(n.TEXTURE_2D_ARRAY,O.__webglTexture,n.TEXTURE0+v)}function Z(T,v){const O=i.get(T);if(T.version>0&&O.__version!==T.version){B(O,T,v);return}t.bindTexture(n.TEXTURE_3D,O.__webglTexture,n.TEXTURE0+v)}function H(T,v){const O=i.get(T);if(T.version>0&&O.__version!==T.version){Q(O,T,v);return}t.bindTexture(n.TEXTURE_CUBE_MAP,O.__webglTexture,n.TEXTURE0+v)}const ne={[ha]:n.REPEAT,[ii]:n.CLAMP_TO_EDGE,[fa]:n.MIRRORED_REPEAT},J={[ft]:n.NEAREST,[pu]:n.NEAREST_MIPMAP_NEAREST,[Es]:n.NEAREST_MIPMAP_LINEAR,[zt]:n.LINEAR,[vr]:n.LINEAR_MIPMAP_NEAREST,[si]:n.LINEAR_MIPMAP_LINEAR},re={[xu]:n.NEVER,[Au]:n.ALWAYS,[Mu]:n.LESS,[zl]:n.LEQUAL,[Su]:n.EQUAL,[Tu]:n.GEQUAL,[yu]:n.GREATER,[Eu]:n.NOTEQUAL};function we(T,v){if(v.type===an&&e.has("OES_texture_float_linear")===!1&&(v.magFilter===zt||v.magFilter===vr||v.magFilter===Es||v.magFilter===si||v.minFilter===zt||v.minFilter===vr||v.minFilter===Es||v.minFilter===si)&&console.warn("THREE.WebGLRenderer: Unable to use linear filtering with floating point textures. OES_texture_float_linear not supported on this device."),n.texParameteri(T,n.TEXTURE_WRAP_S,ne[v.wrapS]),n.texParameteri(T,n.TEXTURE_WRAP_T,ne[v.wrapT]),(T===n.TEXTURE_3D||T===n.TEXTURE_2D_ARRAY)&&n.texParameteri(T,n.TEXTURE_WRAP_R,ne[v.wrapR]),n.texParameteri(T,n.TEXTURE_MAG_FILTER,J[v.magFilter]),n.texParameteri(T,n.TEXTURE_MIN_FILTER,J[v.minFilter]),v.compareFunction&&(n.texParameteri(T,n.TEXTURE_COMPARE_MODE,n.COMPARE_REF_TO_TEXTURE),n.texParameteri(T,n.TEXTURE_COMPARE_FUNC,re[v.compareFunction])),e.has("EXT_texture_filter_anisotropic")===!0){if(v.magFilter===ft||v.minFilter!==Es&&v.minFilter!==si||v.type===an&&e.has("OES_texture_float_linear")===!1)return;if(v.anisotropy>1||i.get(v).__currentAnisotropy){const O=e.get("EXT_texture_filter_anisotropic");n.texParameterf(T,O.TEXTURE_MAX_ANISOTROPY_EXT,Math.min(v.anisotropy,s.getMaxAnisotropy())),i.get(v).__currentAnisotropy=v.anisotropy}}}function Be(T,v){let O=!1;T.__webglInit===void 0&&(T.__webglInit=!0,v.addEventListener("dispose",b));const $=v.source;let Y=f.get($);Y===void 0&&(Y={},f.set($,Y));const q=W(v);if(q!==T.__cacheKey){Y[q]===void 0&&(Y[q]={texture:n.createTexture(),usedTimes:0},a.memory.textures++,O=!0),Y[q].usedTimes++;const he=Y[T.__cacheKey];he!==void 0&&(Y[T.__cacheKey].usedTimes--,he.usedTimes===0&&E(v)),T.__cacheKey=q,T.__webglTexture=Y[q].texture}return O}function B(T,v,O){let $=n.TEXTURE_2D;(v.isDataArrayTexture||v.isCompressedArrayTexture)&&($=n.TEXTURE_2D_ARRAY),v.isData3DTexture&&($=n.TEXTURE_3D);const Y=Be(T,v),q=v.source;t.bindTexture($,T.__webglTexture,n.TEXTURE0+O);const he=i.get(q);if(q.version!==he.__version||Y===!0){t.activeTexture(n.TEXTURE0+O);const ae=qe.getPrimaries(qe.workingColorSpace),_e=v.colorSpace===On?null:qe.getPrimaries(v.colorSpace),He=v.colorSpace===On||ae===_e?n.NONE:n.BROWSER_DEFAULT_WEBGL;n.pixelStorei(n.UNPACK_FLIP_Y_WEBGL,v.flipY),n.pixelStorei(n.UNPACK_PREMULTIPLY_ALPHA_WEBGL,v.premultiplyAlpha),n.pixelStorei(n.UNPACK_ALIGNMENT,v.unpackAlignment),n.pixelStorei(n.UNPACK_COLORSPACE_CONVERSION_WEBGL,He);let te=_(v.image,!1,s.maxTextureSize);te=Ne(v,te);const pe=r.convert(v.format,v.colorSpace),De=r.convert(v.type);let Ce=S(v.internalFormat,pe,De,v.colorSpace,v.isVideoTexture);we($,v);let ve;const We=v.mipmaps,ke=v.isVideoTexture!==!0,Qe=he.__version===void 0||Y===!0,D=q.dataReady,ce=P(v,te);if(v.isDepthTexture)Ce=M(v.format===Bi,v.type),Qe&&(ke?t.texStorage2D(n.TEXTURE_2D,1,Ce,te.width,te.height):t.texImage2D(n.TEXTURE_2D,0,Ce,te.width,te.height,0,pe,De,null));else if(v.isDataTexture)if(We.length>0){ke&&Qe&&t.texStorage2D(n.TEXTURE_2D,ce,Ce,We[0].width,We[0].height);for(let X=0,j=We.length;X<j;X++)ve=We[X],ke?D&&t.texSubImage2D(n.TEXTURE_2D,X,0,0,ve.width,ve.height,pe,De,ve.data):t.texImage2D(n.TEXTURE_2D,X,Ce,ve.width,ve.height,0,pe,De,ve.data);v.generateMipmaps=!1}else ke?(Qe&&t.texStorage2D(n.TEXTURE_2D,ce,Ce,te.width,te.height),D&&t.texSubImage2D(n.TEXTURE_2D,0,0,0,te.width,te.height,pe,De,te.data)):t.texImage2D(n.TEXTURE_2D,0,Ce,te.width,te.height,0,pe,De,te.data);else if(v.isCompressedTexture)if(v.isCompressedArrayTexture){ke&&Qe&&t.texStorage3D(n.TEXTURE_2D_ARRAY,ce,Ce,We[0].width,We[0].height,te.depth);for(let X=0,j=We.length;X<j;X++)if(ve=We[X],v.format!==kt)if(pe!==null)if(ke){if(D)if(v.layerUpdates.size>0){const me=fl(ve.width,ve.height,v.format,v.type);for(const fe of v.layerUpdates){const Fe=ve.data.subarray(fe*me/ve.data.BYTES_PER_ELEMENT,(fe+1)*me/ve.data.BYTES_PER_ELEMENT);t.compressedTexSubImage3D(n.TEXTURE_2D_ARRAY,X,0,0,fe,ve.width,ve.height,1,pe,Fe)}v.clearLayerUpdates()}else t.compressedTexSubImage3D(n.TEXTURE_2D_ARRAY,X,0,0,0,ve.width,ve.height,te.depth,pe,ve.data)}else t.compressedTexImage3D(n.TEXTURE_2D_ARRAY,X,Ce,ve.width,ve.height,te.depth,0,ve.data,0,0);else console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()");else ke?D&&t.texSubImage3D(n.TEXTURE_2D_ARRAY,X,0,0,0,ve.width,ve.height,te.depth,pe,De,ve.data):t.texImage3D(n.TEXTURE_2D_ARRAY,X,Ce,ve.width,ve.height,te.depth,0,pe,De,ve.data)}else{ke&&Qe&&t.texStorage2D(n.TEXTURE_2D,ce,Ce,We[0].width,We[0].height);for(let X=0,j=We.length;X<j;X++)ve=We[X],v.format!==kt?pe!==null?ke?D&&t.compressedTexSubImage2D(n.TEXTURE_2D,X,0,0,ve.width,ve.height,pe,ve.data):t.compressedTexImage2D(n.TEXTURE_2D,X,Ce,ve.width,ve.height,0,ve.data):console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()"):ke?D&&t.texSubImage2D(n.TEXTURE_2D,X,0,0,ve.width,ve.height,pe,De,ve.data):t.texImage2D(n.TEXTURE_2D,X,Ce,ve.width,ve.height,0,pe,De,ve.data)}else if(v.isDataArrayTexture)if(ke){if(Qe&&t.texStorage3D(n.TEXTURE_2D_ARRAY,ce,Ce,te.width,te.height,te.depth),D)if(v.layerUpdates.size>0){const X=fl(te.width,te.height,v.format,v.type);for(const j of v.layerUpdates){const me=te.data.subarray(j*X/te.data.BYTES_PER_ELEMENT,(j+1)*X/te.data.BYTES_PER_ELEMENT);t.texSubImage3D(n.TEXTURE_2D_ARRAY,0,0,0,j,te.width,te.height,1,pe,De,me)}v.clearLayerUpdates()}else t.texSubImage3D(n.TEXTURE_2D_ARRAY,0,0,0,0,te.width,te.height,te.depth,pe,De,te.data)}else t.texImage3D(n.TEXTURE_2D_ARRAY,0,Ce,te.width,te.height,te.depth,0,pe,De,te.data);else if(v.isData3DTexture)ke?(Qe&&t.texStorage3D(n.TEXTURE_3D,ce,Ce,te.width,te.height,te.depth),D&&t.texSubImage3D(n.TEXTURE_3D,0,0,0,0,te.width,te.height,te.depth,pe,De,te.data)):t.texImage3D(n.TEXTURE_3D,0,Ce,te.width,te.height,te.depth,0,pe,De,te.data);else if(v.isFramebufferTexture){if(Qe)if(ke)t.texStorage2D(n.TEXTURE_2D,ce,Ce,te.width,te.height);else{let X=te.width,j=te.height;for(let me=0;me<ce;me++)t.texImage2D(n.TEXTURE_2D,me,Ce,X,j,0,pe,De,null),X>>=1,j>>=1}}else if(We.length>0){if(ke&&Qe){const X=Se(We[0]);t.texStorage2D(n.TEXTURE_2D,ce,Ce,X.width,X.height)}for(let X=0,j=We.length;X<j;X++)ve=We[X],ke?D&&t.texSubImage2D(n.TEXTURE_2D,X,0,0,pe,De,ve):t.texImage2D(n.TEXTURE_2D,X,Ce,pe,De,ve);v.generateMipmaps=!1}else if(ke){if(Qe){const X=Se(te);t.texStorage2D(n.TEXTURE_2D,ce,Ce,X.width,X.height)}D&&t.texSubImage2D(n.TEXTURE_2D,0,0,0,pe,De,te)}else t.texImage2D(n.TEXTURE_2D,0,Ce,pe,De,te);p(v)&&h($),he.__version=q.version,v.onUpdate&&v.onUpdate(v)}T.__version=v.version}function Q(T,v,O){if(v.image.length!==6)return;const $=Be(T,v),Y=v.source;t.bindTexture(n.TEXTURE_CUBE_MAP,T.__webglTexture,n.TEXTURE0+O);const q=i.get(Y);if(Y.version!==q.__version||$===!0){t.activeTexture(n.TEXTURE0+O);const he=qe.getPrimaries(qe.workingColorSpace),ae=v.colorSpace===On?null:qe.getPrimaries(v.colorSpace),_e=v.colorSpace===On||he===ae?n.NONE:n.BROWSER_DEFAULT_WEBGL;n.pixelStorei(n.UNPACK_FLIP_Y_WEBGL,v.flipY),n.pixelStorei(n.UNPACK_PREMULTIPLY_ALPHA_WEBGL,v.premultiplyAlpha),n.pixelStorei(n.UNPACK_ALIGNMENT,v.unpackAlignment),n.pixelStorei(n.UNPACK_COLORSPACE_CONVERSION_WEBGL,_e);const He=v.isCompressedTexture||v.image[0].isCompressedTexture,te=v.image[0]&&v.image[0].isDataTexture,pe=[];for(let j=0;j<6;j++)!He&&!te?pe[j]=_(v.image[j],!0,s.maxCubemapSize):pe[j]=te?v.image[j].image:v.image[j],pe[j]=Ne(v,pe[j]);const De=pe[0],Ce=r.convert(v.format,v.colorSpace),ve=r.convert(v.type),We=S(v.internalFormat,Ce,ve,v.colorSpace),ke=v.isVideoTexture!==!0,Qe=q.__version===void 0||$===!0,D=Y.dataReady;let ce=P(v,De);we(n.TEXTURE_CUBE_MAP,v);let X;if(He){ke&&Qe&&t.texStorage2D(n.TEXTURE_CUBE_MAP,ce,We,De.width,De.height);for(let j=0;j<6;j++){X=pe[j].mipmaps;for(let me=0;me<X.length;me++){const fe=X[me];v.format!==kt?Ce!==null?ke?D&&t.compressedTexSubImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+j,me,0,0,fe.width,fe.height,Ce,fe.data):t.compressedTexImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+j,me,We,fe.width,fe.height,0,fe.data):console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .setTextureCube()"):ke?D&&t.texSubImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+j,me,0,0,fe.width,fe.height,Ce,ve,fe.data):t.texImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+j,me,We,fe.width,fe.height,0,Ce,ve,fe.data)}}}else{if(X=v.mipmaps,ke&&Qe){X.length>0&&ce++;const j=Se(pe[0]);t.texStorage2D(n.TEXTURE_CUBE_MAP,ce,We,j.width,j.height)}for(let j=0;j<6;j++)if(te){ke?D&&t.texSubImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+j,0,0,0,pe[j].width,pe[j].height,Ce,ve,pe[j].data):t.texImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+j,0,We,pe[j].width,pe[j].height,0,Ce,ve,pe[j].data);for(let me=0;me<X.length;me++){const Fe=X[me].image[j].image;ke?D&&t.texSubImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+j,me+1,0,0,Fe.width,Fe.height,Ce,ve,Fe.data):t.texImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+j,me+1,We,Fe.width,Fe.height,0,Ce,ve,Fe.data)}}else{ke?D&&t.texSubImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+j,0,0,0,Ce,ve,pe[j]):t.texImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+j,0,We,Ce,ve,pe[j]);for(let me=0;me<X.length;me++){const fe=X[me];ke?D&&t.texSubImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+j,me+1,0,0,Ce,ve,fe.image[j]):t.texImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+j,me+1,We,Ce,ve,fe.image[j])}}}p(v)&&h(n.TEXTURE_CUBE_MAP),q.__version=Y.version,v.onUpdate&&v.onUpdate(v)}T.__version=v.version}function ue(T,v,O,$,Y,q){const he=r.convert(O.format,O.colorSpace),ae=r.convert(O.type),_e=S(O.internalFormat,he,ae,O.colorSpace),He=i.get(v),te=i.get(O);if(te.__renderTarget=v,!He.__hasExternalTextures){const pe=Math.max(1,v.width>>q),De=Math.max(1,v.height>>q);Y===n.TEXTURE_3D||Y===n.TEXTURE_2D_ARRAY?t.texImage3D(Y,q,_e,pe,De,v.depth,0,he,ae,null):t.texImage2D(Y,q,_e,pe,De,0,he,ae,null)}t.bindFramebuffer(n.FRAMEBUFFER,T),Re(v)?o.framebufferTexture2DMultisampleEXT(n.FRAMEBUFFER,$,Y,te.__webglTexture,0,Me(v)):(Y===n.TEXTURE_2D||Y>=n.TEXTURE_CUBE_MAP_POSITIVE_X&&Y<=n.TEXTURE_CUBE_MAP_NEGATIVE_Z)&&n.framebufferTexture2D(n.FRAMEBUFFER,$,Y,te.__webglTexture,q),t.bindFramebuffer(n.FRAMEBUFFER,null)}function ie(T,v,O){if(n.bindRenderbuffer(n.RENDERBUFFER,T),v.depthBuffer){const $=v.depthTexture,Y=$&&$.isDepthTexture?$.type:null,q=M(v.stencilBuffer,Y),he=v.stencilBuffer?n.DEPTH_STENCIL_ATTACHMENT:n.DEPTH_ATTACHMENT,ae=Me(v);Re(v)?o.renderbufferStorageMultisampleEXT(n.RENDERBUFFER,ae,q,v.width,v.height):O?n.renderbufferStorageMultisample(n.RENDERBUFFER,ae,q,v.width,v.height):n.renderbufferStorage(n.RENDERBUFFER,q,v.width,v.height),n.framebufferRenderbuffer(n.FRAMEBUFFER,he,n.RENDERBUFFER,T)}else{const $=v.textures;for(let Y=0;Y<$.length;Y++){const q=$[Y],he=r.convert(q.format,q.colorSpace),ae=r.convert(q.type),_e=S(q.internalFormat,he,ae,q.colorSpace),He=Me(v);O&&Re(v)===!1?n.renderbufferStorageMultisample(n.RENDERBUFFER,He,_e,v.width,v.height):Re(v)?o.renderbufferStorageMultisampleEXT(n.RENDERBUFFER,He,_e,v.width,v.height):n.renderbufferStorage(n.RENDERBUFFER,_e,v.width,v.height)}}n.bindRenderbuffer(n.RENDERBUFFER,null)}function Ae(T,v){if(v&&v.isWebGLCubeRenderTarget)throw new Error("Depth Texture with cube render targets is not supported");if(t.bindFramebuffer(n.FRAMEBUFFER,T),!(v.depthTexture&&v.depthTexture.isDepthTexture))throw new Error("renderTarget.depthTexture must be an instance of THREE.DepthTexture");const $=i.get(v.depthTexture);$.__renderTarget=v,(!$.__webglTexture||v.depthTexture.image.width!==v.width||v.depthTexture.image.height!==v.height)&&(v.depthTexture.image.width=v.width,v.depthTexture.image.height=v.height,v.depthTexture.needsUpdate=!0),K(v.depthTexture,0);const Y=$.__webglTexture,q=Me(v);if(v.depthTexture.format===Di)Re(v)?o.framebufferTexture2DMultisampleEXT(n.FRAMEBUFFER,n.DEPTH_ATTACHMENT,n.TEXTURE_2D,Y,0,q):n.framebufferTexture2D(n.FRAMEBUFFER,n.DEPTH_ATTACHMENT,n.TEXTURE_2D,Y,0);else if(v.depthTexture.format===Bi)Re(v)?o.framebufferTexture2DMultisampleEXT(n.FRAMEBUFFER,n.DEPTH_STENCIL_ATTACHMENT,n.TEXTURE_2D,Y,0,q):n.framebufferTexture2D(n.FRAMEBUFFER,n.DEPTH_STENCIL_ATTACHMENT,n.TEXTURE_2D,Y,0);else throw new Error("Unknown depthTexture format")}function Pe(T){const v=i.get(T),O=T.isWebGLCubeRenderTarget===!0;if(v.__boundDepthTexture!==T.depthTexture){const $=T.depthTexture;if(v.__depthDisposeCallback&&v.__depthDisposeCallback(),$){const Y=()=>{delete v.__boundDepthTexture,delete v.__depthDisposeCallback,$.removeEventListener("dispose",Y)};$.addEventListener("dispose",Y),v.__depthDisposeCallback=Y}v.__boundDepthTexture=$}if(T.depthTexture&&!v.__autoAllocateDepthBuffer){if(O)throw new Error("target.depthTexture not supported in Cube render targets");Ae(v.__webglFramebuffer,T)}else if(O){v.__webglDepthbuffer=[];for(let $=0;$<6;$++)if(t.bindFramebuffer(n.FRAMEBUFFER,v.__webglFramebuffer[$]),v.__webglDepthbuffer[$]===void 0)v.__webglDepthbuffer[$]=n.createRenderbuffer(),ie(v.__webglDepthbuffer[$],T,!1);else{const Y=T.stencilBuffer?n.DEPTH_STENCIL_ATTACHMENT:n.DEPTH_ATTACHMENT,q=v.__webglDepthbuffer[$];n.bindRenderbuffer(n.RENDERBUFFER,q),n.framebufferRenderbuffer(n.FRAMEBUFFER,Y,n.RENDERBUFFER,q)}}else if(t.bindFramebuffer(n.FRAMEBUFFER,v.__webglFramebuffer),v.__webglDepthbuffer===void 0)v.__webglDepthbuffer=n.createRenderbuffer(),ie(v.__webglDepthbuffer,T,!1);else{const $=T.stencilBuffer?n.DEPTH_STENCIL_ATTACHMENT:n.DEPTH_ATTACHMENT,Y=v.__webglDepthbuffer;n.bindRenderbuffer(n.RENDERBUFFER,Y),n.framebufferRenderbuffer(n.FRAMEBUFFER,$,n.RENDERBUFFER,Y)}t.bindFramebuffer(n.FRAMEBUFFER,null)}function ee(T,v,O){const $=i.get(T);v!==void 0&&ue($.__webglFramebuffer,T,T.texture,n.COLOR_ATTACHMENT0,n.TEXTURE_2D,0),O!==void 0&&Pe(T)}function le(T){const v=T.texture,O=i.get(T),$=i.get(v);T.addEventListener("dispose",w);const Y=T.textures,q=T.isWebGLCubeRenderTarget===!0,he=Y.length>1;if(he||($.__webglTexture===void 0&&($.__webglTexture=n.createTexture()),$.__version=v.version,a.memory.textures++),q){O.__webglFramebuffer=[];for(let ae=0;ae<6;ae++)if(v.mipmaps&&v.mipmaps.length>0){O.__webglFramebuffer[ae]=[];for(let _e=0;_e<v.mipmaps.length;_e++)O.__webglFramebuffer[ae][_e]=n.createFramebuffer()}else O.__webglFramebuffer[ae]=n.createFramebuffer()}else{if(v.mipmaps&&v.mipmaps.length>0){O.__webglFramebuffer=[];for(let ae=0;ae<v.mipmaps.length;ae++)O.__webglFramebuffer[ae]=n.createFramebuffer()}else O.__webglFramebuffer=n.createFramebuffer();if(he)for(let ae=0,_e=Y.length;ae<_e;ae++){const He=i.get(Y[ae]);He.__webglTexture===void 0&&(He.__webglTexture=n.createTexture(),a.memory.textures++)}if(T.samples>0&&Re(T)===!1){O.__webglMultisampledFramebuffer=n.createFramebuffer(),O.__webglColorRenderbuffer=[],t.bindFramebuffer(n.FRAMEBUFFER,O.__webglMultisampledFramebuffer);for(let ae=0;ae<Y.length;ae++){const _e=Y[ae];O.__webglColorRenderbuffer[ae]=n.createRenderbuffer(),n.bindRenderbuffer(n.RENDERBUFFER,O.__webglColorRenderbuffer[ae]);const He=r.convert(_e.format,_e.colorSpace),te=r.convert(_e.type),pe=S(_e.internalFormat,He,te,_e.colorSpace,T.isXRRenderTarget===!0),De=Me(T);n.renderbufferStorageMultisample(n.RENDERBUFFER,De,pe,T.width,T.height),n.framebufferRenderbuffer(n.FRAMEBUFFER,n.COLOR_ATTACHMENT0+ae,n.RENDERBUFFER,O.__webglColorRenderbuffer[ae])}n.bindRenderbuffer(n.RENDERBUFFER,null),T.depthBuffer&&(O.__webglDepthRenderbuffer=n.createRenderbuffer(),ie(O.__webglDepthRenderbuffer,T,!0)),t.bindFramebuffer(n.FRAMEBUFFER,null)}}if(q){t.bindTexture(n.TEXTURE_CUBE_MAP,$.__webglTexture),we(n.TEXTURE_CUBE_MAP,v);for(let ae=0;ae<6;ae++)if(v.mipmaps&&v.mipmaps.length>0)for(let _e=0;_e<v.mipmaps.length;_e++)ue(O.__webglFramebuffer[ae][_e],T,v,n.COLOR_ATTACHMENT0,n.TEXTURE_CUBE_MAP_POSITIVE_X+ae,_e);else ue(O.__webglFramebuffer[ae],T,v,n.COLOR_ATTACHMENT0,n.TEXTURE_CUBE_MAP_POSITIVE_X+ae,0);p(v)&&h(n.TEXTURE_CUBE_MAP),t.unbindTexture()}else if(he){for(let ae=0,_e=Y.length;ae<_e;ae++){const He=Y[ae],te=i.get(He);t.bindTexture(n.TEXTURE_2D,te.__webglTexture),we(n.TEXTURE_2D,He),ue(O.__webglFramebuffer,T,He,n.COLOR_ATTACHMENT0+ae,n.TEXTURE_2D,0),p(He)&&h(n.TEXTURE_2D)}t.unbindTexture()}else{let ae=n.TEXTURE_2D;if((T.isWebGL3DRenderTarget||T.isWebGLArrayRenderTarget)&&(ae=T.isWebGL3DRenderTarget?n.TEXTURE_3D:n.TEXTURE_2D_ARRAY),t.bindTexture(ae,$.__webglTexture),we(ae,v),v.mipmaps&&v.mipmaps.length>0)for(let _e=0;_e<v.mipmaps.length;_e++)ue(O.__webglFramebuffer[_e],T,v,n.COLOR_ATTACHMENT0,ae,_e);else ue(O.__webglFramebuffer,T,v,n.COLOR_ATTACHMENT0,ae,0);p(v)&&h(ae),t.unbindTexture()}T.depthBuffer&&Pe(T)}function xe(T){const v=T.textures;for(let O=0,$=v.length;O<$;O++){const Y=v[O];if(p(Y)){const q=A(T),he=i.get(Y).__webglTexture;t.bindTexture(q,he),h(q),t.unbindTexture()}}}const Le=[],R=[];function ze(T){if(T.samples>0){if(Re(T)===!1){const v=T.textures,O=T.width,$=T.height;let Y=n.COLOR_BUFFER_BIT;const q=T.stencilBuffer?n.DEPTH_STENCIL_ATTACHMENT:n.DEPTH_ATTACHMENT,he=i.get(T),ae=v.length>1;if(ae)for(let _e=0;_e<v.length;_e++)t.bindFramebuffer(n.FRAMEBUFFER,he.__webglMultisampledFramebuffer),n.framebufferRenderbuffer(n.FRAMEBUFFER,n.COLOR_ATTACHMENT0+_e,n.RENDERBUFFER,null),t.bindFramebuffer(n.FRAMEBUFFER,he.__webglFramebuffer),n.framebufferTexture2D(n.DRAW_FRAMEBUFFER,n.COLOR_ATTACHMENT0+_e,n.TEXTURE_2D,null,0);t.bindFramebuffer(n.READ_FRAMEBUFFER,he.__webglMultisampledFramebuffer),t.bindFramebuffer(n.DRAW_FRAMEBUFFER,he.__webglFramebuffer);for(let _e=0;_e<v.length;_e++){if(T.resolveDepthBuffer&&(T.depthBuffer&&(Y|=n.DEPTH_BUFFER_BIT),T.stencilBuffer&&T.resolveStencilBuffer&&(Y|=n.STENCIL_BUFFER_BIT)),ae){n.framebufferRenderbuffer(n.READ_FRAMEBUFFER,n.COLOR_ATTACHMENT0,n.RENDERBUFFER,he.__webglColorRenderbuffer[_e]);const He=i.get(v[_e]).__webglTexture;n.framebufferTexture2D(n.DRAW_FRAMEBUFFER,n.COLOR_ATTACHMENT0,n.TEXTURE_2D,He,0)}n.blitFramebuffer(0,0,O,$,0,0,O,$,Y,n.NEAREST),l===!0&&(Le.length=0,R.length=0,Le.push(n.COLOR_ATTACHMENT0+_e),T.depthBuffer&&T.resolveDepthBuffer===!1&&(Le.push(q),R.push(q),n.invalidateFramebuffer(n.DRAW_FRAMEBUFFER,R)),n.invalidateFramebuffer(n.READ_FRAMEBUFFER,Le))}if(t.bindFramebuffer(n.READ_FRAMEBUFFER,null),t.bindFramebuffer(n.DRAW_FRAMEBUFFER,null),ae)for(let _e=0;_e<v.length;_e++){t.bindFramebuffer(n.FRAMEBUFFER,he.__webglMultisampledFramebuffer),n.framebufferRenderbuffer(n.FRAMEBUFFER,n.COLOR_ATTACHMENT0+_e,n.RENDERBUFFER,he.__webglColorRenderbuffer[_e]);const He=i.get(v[_e]).__webglTexture;t.bindFramebuffer(n.FRAMEBUFFER,he.__webglFramebuffer),n.framebufferTexture2D(n.DRAW_FRAMEBUFFER,n.COLOR_ATTACHMENT0+_e,n.TEXTURE_2D,He,0)}t.bindFramebuffer(n.DRAW_FRAMEBUFFER,he.__webglMultisampledFramebuffer)}else if(T.depthBuffer&&T.resolveDepthBuffer===!1&&l){const v=T.stencilBuffer?n.DEPTH_STENCIL_ATTACHMENT:n.DEPTH_ATTACHMENT;n.invalidateFramebuffer(n.DRAW_FRAMEBUFFER,[v])}}}function Me(T){return Math.min(s.maxSamples,T.samples)}function Re(T){const v=i.get(T);return T.samples>0&&e.has("WEBGL_multisampled_render_to_texture")===!0&&v.__useRenderToTexture!==!1}function ge(T){const v=a.render.frame;u.get(T)!==v&&(u.set(T,v),T.update())}function Ne(T,v){const O=T.colorSpace,$=T.format,Y=T.type;return T.isCompressedTexture===!0||T.isVideoTexture===!0||O!==Wi&&O!==On&&(qe.getTransfer(O)===Je?($!==kt||Y!==Jt)&&console.warn("THREE.WebGLTextures: sRGB encoded textures have to use RGBAFormat and UnsignedByteType."):console.error("THREE.WebGLTextures: Unsupported texture color space:",O)),v}function Se(T){return typeof HTMLImageElement<"u"&&T instanceof HTMLImageElement?(c.width=T.naturalWidth||T.width,c.height=T.naturalHeight||T.height):typeof VideoFrame<"u"&&T instanceof VideoFrame?(c.width=T.displayWidth,c.height=T.displayHeight):(c.width=T.width,c.height=T.height),c}this.allocateTextureUnit=F,this.resetTextureUnits=V,this.setTexture2D=K,this.setTexture2DArray=G,this.setTexture3D=Z,this.setTextureCube=H,this.rebindTextures=ee,this.setupRenderTarget=le,this.updateRenderTargetMipmap=xe,this.updateMultisampleRenderTarget=ze,this.setupDepthRenderbuffer=Pe,this.setupFrameBufferTexture=ue,this.useMultisampledRTT=Re}function Pm(n,e){function t(i,s=On){let r;const a=qe.getTransfer(s);if(i===Jt)return n.UNSIGNED_BYTE;if(i===$a)return n.UNSIGNED_SHORT_4_4_4_4;if(i===Za)return n.UNSIGNED_SHORT_5_5_5_1;if(i===Dl)return n.UNSIGNED_INT_5_9_9_9_REV;if(i===Cl)return n.BYTE;if(i===Pl)return n.SHORT;if(i===hs)return n.UNSIGNED_SHORT;if(i===Ka)return n.INT;if(i===ci)return n.UNSIGNED_INT;if(i===an)return n.FLOAT;if(i===gs)return n.HALF_FLOAT;if(i===Ll)return n.ALPHA;if(i===Il)return n.RGB;if(i===kt)return n.RGBA;if(i===Ul)return n.LUMINANCE;if(i===Nl)return n.LUMINANCE_ALPHA;if(i===Di)return n.DEPTH_COMPONENT;if(i===Bi)return n.DEPTH_STENCIL;if(i===Fl)return n.RED;if(i===ja)return n.RED_INTEGER;if(i===Ol)return n.RG;if(i===Ja)return n.RG_INTEGER;if(i===Qa)return n.RGBA_INTEGER;if(i===$s||i===Zs||i===js||i===Js)if(a===Je)if(r=e.get("WEBGL_compressed_texture_s3tc_srgb"),r!==null){if(i===$s)return r.COMPRESSED_SRGB_S3TC_DXT1_EXT;if(i===Zs)return r.COMPRESSED_SRGB_ALPHA_S3TC_DXT1_EXT;if(i===js)return r.COMPRESSED_SRGB_ALPHA_S3TC_DXT3_EXT;if(i===Js)return r.COMPRESSED_SRGB_ALPHA_S3TC_DXT5_EXT}else return null;else if(r=e.get("WEBGL_compressed_texture_s3tc"),r!==null){if(i===$s)return r.COMPRESSED_RGB_S3TC_DXT1_EXT;if(i===Zs)return r.COMPRESSED_RGBA_S3TC_DXT1_EXT;if(i===js)return r.COMPRESSED_RGBA_S3TC_DXT3_EXT;if(i===Js)return r.COMPRESSED_RGBA_S3TC_DXT5_EXT}else return null;if(i===da||i===pa||i===ma||i===ga)if(r=e.get("WEBGL_compressed_texture_pvrtc"),r!==null){if(i===da)return r.COMPRESSED_RGB_PVRTC_4BPPV1_IMG;if(i===pa)return r.COMPRESSED_RGB_PVRTC_2BPPV1_IMG;if(i===ma)return r.COMPRESSED_RGBA_PVRTC_4BPPV1_IMG;if(i===ga)return r.COMPRESSED_RGBA_PVRTC_2BPPV1_IMG}else return null;if(i===_a||i===va||i===xa)if(r=e.get("WEBGL_compressed_texture_etc"),r!==null){if(i===_a||i===va)return a===Je?r.COMPRESSED_SRGB8_ETC2:r.COMPRESSED_RGB8_ETC2;if(i===xa)return a===Je?r.COMPRESSED_SRGB8_ALPHA8_ETC2_EAC:r.COMPRESSED_RGBA8_ETC2_EAC}else return null;if(i===Ma||i===Sa||i===ya||i===Ea||i===Ta||i===Aa||i===ba||i===wa||i===Ra||i===Ca||i===Pa||i===Da||i===La||i===Ia)if(r=e.get("WEBGL_compressed_texture_astc"),r!==null){if(i===Ma)return a===Je?r.COMPRESSED_SRGB8_ALPHA8_ASTC_4x4_KHR:r.COMPRESSED_RGBA_ASTC_4x4_KHR;if(i===Sa)return a===Je?r.COMPRESSED_SRGB8_ALPHA8_ASTC_5x4_KHR:r.COMPRESSED_RGBA_ASTC_5x4_KHR;if(i===ya)return a===Je?r.COMPRESSED_SRGB8_ALPHA8_ASTC_5x5_KHR:r.COMPRESSED_RGBA_ASTC_5x5_KHR;if(i===Ea)return a===Je?r.COMPRESSED_SRGB8_ALPHA8_ASTC_6x5_KHR:r.COMPRESSED_RGBA_ASTC_6x5_KHR;if(i===Ta)return a===Je?r.COMPRESSED_SRGB8_ALPHA8_ASTC_6x6_KHR:r.COMPRESSED_RGBA_ASTC_6x6_KHR;if(i===Aa)return a===Je?r.COMPRESSED_SRGB8_ALPHA8_ASTC_8x5_KHR:r.COMPRESSED_RGBA_ASTC_8x5_KHR;if(i===ba)return a===Je?r.COMPRESSED_SRGB8_ALPHA8_ASTC_8x6_KHR:r.COMPRESSED_RGBA_ASTC_8x6_KHR;if(i===wa)return a===Je?r.COMPRESSED_SRGB8_ALPHA8_ASTC_8x8_KHR:r.COMPRESSED_RGBA_ASTC_8x8_KHR;if(i===Ra)return a===Je?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x5_KHR:r.COMPRESSED_RGBA_ASTC_10x5_KHR;if(i===Ca)return a===Je?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x6_KHR:r.COMPRESSED_RGBA_ASTC_10x6_KHR;if(i===Pa)return a===Je?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x8_KHR:r.COMPRESSED_RGBA_ASTC_10x8_KHR;if(i===Da)return a===Je?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x10_KHR:r.COMPRESSED_RGBA_ASTC_10x10_KHR;if(i===La)return a===Je?r.COMPRESSED_SRGB8_ALPHA8_ASTC_12x10_KHR:r.COMPRESSED_RGBA_ASTC_12x10_KHR;if(i===Ia)return a===Je?r.COMPRESSED_SRGB8_ALPHA8_ASTC_12x12_KHR:r.COMPRESSED_RGBA_ASTC_12x12_KHR}else return null;if(i===Qs||i===Ua||i===Na)if(r=e.get("EXT_texture_compression_bptc"),r!==null){if(i===Qs)return a===Je?r.COMPRESSED_SRGB_ALPHA_BPTC_UNORM_EXT:r.COMPRESSED_RGBA_BPTC_UNORM_EXT;if(i===Ua)return r.COMPRESSED_RGB_BPTC_SIGNED_FLOAT_EXT;if(i===Na)return r.COMPRESSED_RGB_BPTC_UNSIGNED_FLOAT_EXT}else return null;if(i===Bl||i===Fa||i===Oa||i===Ba)if(r=e.get("EXT_texture_compression_rgtc"),r!==null){if(i===Qs)return r.COMPRESSED_RED_RGTC1_EXT;if(i===Fa)return r.COMPRESSED_SIGNED_RED_RGTC1_EXT;if(i===Oa)return r.COMPRESSED_RED_GREEN_RGTC2_EXT;if(i===Ba)return r.COMPRESSED_SIGNED_RED_GREEN_RGTC2_EXT}else return null;return i===Oi?n.UNSIGNED_INT_24_8:n[i]!==void 0?n[i]:null}return{convert:t}}class Dm extends Ut{constructor(e=[]){super(),this.isArrayCamera=!0,this.cameras=e}}class Ws extends Ct{constructor(){super(),this.isGroup=!0,this.type="Group"}}const Lm={type:"move"};class Yr{constructor(){this._targetRay=null,this._grip=null,this._hand=null}getHandSpace(){return this._hand===null&&(this._hand=new Ws,this._hand.matrixAutoUpdate=!1,this._hand.visible=!1,this._hand.joints={},this._hand.inputState={pinching:!1}),this._hand}getTargetRaySpace(){return this._targetRay===null&&(this._targetRay=new Ws,this._targetRay.matrixAutoUpdate=!1,this._targetRay.visible=!1,this._targetRay.hasLinearVelocity=!1,this._targetRay.linearVelocity=new N,this._targetRay.hasAngularVelocity=!1,this._targetRay.angularVelocity=new N),this._targetRay}getGripSpace(){return this._grip===null&&(this._grip=new Ws,this._grip.matrixAutoUpdate=!1,this._grip.visible=!1,this._grip.hasLinearVelocity=!1,this._grip.linearVelocity=new N,this._grip.hasAngularVelocity=!1,this._grip.angularVelocity=new N),this._grip}dispatchEvent(e){return this._targetRay!==null&&this._targetRay.dispatchEvent(e),this._grip!==null&&this._grip.dispatchEvent(e),this._hand!==null&&this._hand.dispatchEvent(e),this}connect(e){if(e&&e.hand){const t=this._hand;if(t)for(const i of e.hand.values())this._getHandJoint(t,i)}return this.dispatchEvent({type:"connected",data:e}),this}disconnect(e){return this.dispatchEvent({type:"disconnected",data:e}),this._targetRay!==null&&(this._targetRay.visible=!1),this._grip!==null&&(this._grip.visible=!1),this._hand!==null&&(this._hand.visible=!1),this}update(e,t,i){let s=null,r=null,a=null;const o=this._targetRay,l=this._grip,c=this._hand;if(e&&t.session.visibilityState!=="visible-blurred"){if(c&&e.hand){a=!0;for(const _ of e.hand.values()){const p=t.getJointPose(_,i),h=this._getHandJoint(c,_);p!==null&&(h.matrix.fromArray(p.transform.matrix),h.matrix.decompose(h.position,h.rotation,h.scale),h.matrixWorldNeedsUpdate=!0,h.jointRadius=p.radius),h.visible=p!==null}const u=c.joints["index-finger-tip"],d=c.joints["thumb-tip"],f=u.position.distanceTo(d.position),m=.02,g=.005;c.inputState.pinching&&f>m+g?(c.inputState.pinching=!1,this.dispatchEvent({type:"pinchend",handedness:e.handedness,target:this})):!c.inputState.pinching&&f<=m-g&&(c.inputState.pinching=!0,this.dispatchEvent({type:"pinchstart",handedness:e.handedness,target:this}))}else l!==null&&e.gripSpace&&(r=t.getPose(e.gripSpace,i),r!==null&&(l.matrix.fromArray(r.transform.matrix),l.matrix.decompose(l.position,l.rotation,l.scale),l.matrixWorldNeedsUpdate=!0,r.linearVelocity?(l.hasLinearVelocity=!0,l.linearVelocity.copy(r.linearVelocity)):l.hasLinearVelocity=!1,r.angularVelocity?(l.hasAngularVelocity=!0,l.angularVelocity.copy(r.angularVelocity)):l.hasAngularVelocity=!1));o!==null&&(s=t.getPose(e.targetRaySpace,i),s===null&&r!==null&&(s=r),s!==null&&(o.matrix.fromArray(s.transform.matrix),o.matrix.decompose(o.position,o.rotation,o.scale),o.matrixWorldNeedsUpdate=!0,s.linearVelocity?(o.hasLinearVelocity=!0,o.linearVelocity.copy(s.linearVelocity)):o.hasLinearVelocity=!1,s.angularVelocity?(o.hasAngularVelocity=!0,o.angularVelocity.copy(s.angularVelocity)):o.hasAngularVelocity=!1,this.dispatchEvent(Lm)))}return o!==null&&(o.visible=s!==null),l!==null&&(l.visible=r!==null),c!==null&&(c.visible=a!==null),this}_getHandJoint(e,t){if(e.joints[t.jointName]===void 0){const i=new Ws;i.matrixAutoUpdate=!1,i.visible=!1,e.joints[t.jointName]=i,e.add(i)}return e.joints[t.jointName]}}const Im=`
void main() {

	gl_Position = vec4( position, 1.0 );

}`,Um=`
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

}`;class Nm{constructor(){this.texture=null,this.mesh=null,this.depthNear=0,this.depthFar=0}init(e,t,i){if(this.texture===null){const s=new Mt,r=e.properties.get(s);r.__webglTexture=t.texture,(t.depthNear!=i.depthNear||t.depthFar!=i.depthFar)&&(this.depthNear=t.depthNear,this.depthFar=t.depthFar),this.texture=s}}getMesh(e){if(this.texture!==null&&this.mesh===null){const t=e.cameras[0].viewport,i=new wt({vertexShader:Im,fragmentShader:Um,uniforms:{depthColor:{value:this.texture},depthWidth:{value:t.z},depthHeight:{value:t.w}}});this.mesh=new Gt(new Yi(20,20),i)}return this.mesh}reset(){this.texture=null,this.mesh=null}getDepthTexture(){return this.texture}}class Fm extends Xi{constructor(e,t){super();const i=this;let s=null,r=1,a=null,o="local-floor",l=1,c=null,u=null,d=null,f=null,m=null,g=null;const _=new Nm,p=t.getContextAttributes();let h=null,A=null;const S=[],M=[],P=new Ve;let b=null;const w=new Ut;w.viewport=new tt;const L=new Ut;L.viewport=new tt;const E=[w,L],x=new Dm;let C=null,V=null;this.cameraAutoUpdate=!0,this.enabled=!1,this.isPresenting=!1,this.getController=function(B){let Q=S[B];return Q===void 0&&(Q=new Yr,S[B]=Q),Q.getTargetRaySpace()},this.getControllerGrip=function(B){let Q=S[B];return Q===void 0&&(Q=new Yr,S[B]=Q),Q.getGripSpace()},this.getHand=function(B){let Q=S[B];return Q===void 0&&(Q=new Yr,S[B]=Q),Q.getHandSpace()};function F(B){const Q=M.indexOf(B.inputSource);if(Q===-1)return;const ue=S[Q];ue!==void 0&&(ue.update(B.inputSource,B.frame,c||a),ue.dispatchEvent({type:B.type,data:B.inputSource}))}function W(){s.removeEventListener("select",F),s.removeEventListener("selectstart",F),s.removeEventListener("selectend",F),s.removeEventListener("squeeze",F),s.removeEventListener("squeezestart",F),s.removeEventListener("squeezeend",F),s.removeEventListener("end",W),s.removeEventListener("inputsourceschange",K);for(let B=0;B<S.length;B++){const Q=M[B];Q!==null&&(M[B]=null,S[B].disconnect(Q))}C=null,V=null,_.reset(),e.setRenderTarget(h),m=null,f=null,d=null,s=null,A=null,Be.stop(),i.isPresenting=!1,e.setPixelRatio(b),e.setSize(P.width,P.height,!1),i.dispatchEvent({type:"sessionend"})}this.setFramebufferScaleFactor=function(B){r=B,i.isPresenting===!0&&console.warn("THREE.WebXRManager: Cannot change framebuffer scale while presenting.")},this.setReferenceSpaceType=function(B){o=B,i.isPresenting===!0&&console.warn("THREE.WebXRManager: Cannot change reference space type while presenting.")},this.getReferenceSpace=function(){return c||a},this.setReferenceSpace=function(B){c=B},this.getBaseLayer=function(){return f!==null?f:m},this.getBinding=function(){return d},this.getFrame=function(){return g},this.getSession=function(){return s},this.setSession=async function(B){if(s=B,s!==null){if(h=e.getRenderTarget(),s.addEventListener("select",F),s.addEventListener("selectstart",F),s.addEventListener("selectend",F),s.addEventListener("squeeze",F),s.addEventListener("squeezestart",F),s.addEventListener("squeezeend",F),s.addEventListener("end",W),s.addEventListener("inputsourceschange",K),p.xrCompatible!==!0&&await t.makeXRCompatible(),b=e.getPixelRatio(),e.getSize(P),s.renderState.layers===void 0){const Q={antialias:p.antialias,alpha:!0,depth:p.depth,stencil:p.stencil,framebufferScaleFactor:r};m=new XRWebGLLayer(s,t,Q),s.updateRenderState({baseLayer:m}),e.setPixelRatio(1),e.setSize(m.framebufferWidth,m.framebufferHeight,!1),A=new Sn(m.framebufferWidth,m.framebufferHeight,{format:kt,type:Jt,colorSpace:e.outputColorSpace,stencilBuffer:p.stencil})}else{let Q=null,ue=null,ie=null;p.depth&&(ie=p.stencil?t.DEPTH24_STENCIL8:t.DEPTH_COMPONENT24,Q=p.stencil?Bi:Di,ue=p.stencil?Oi:ci);const Ae={colorFormat:t.RGBA8,depthFormat:ie,scaleFactor:r};d=new XRWebGLBinding(s,t),f=d.createProjectionLayer(Ae),s.updateRenderState({layers:[f]}),e.setPixelRatio(1),e.setSize(f.textureWidth,f.textureHeight,!1),A=new Sn(f.textureWidth,f.textureHeight,{format:kt,type:Jt,depthTexture:new tc(f.textureWidth,f.textureHeight,ue,void 0,void 0,void 0,void 0,void 0,void 0,Q),stencilBuffer:p.stencil,colorSpace:e.outputColorSpace,samples:p.antialias?4:0,resolveDepthBuffer:f.ignoreDepthValues===!1})}A.isXRRenderTarget=!0,this.setFoveation(l),c=null,a=await s.requestReferenceSpace(o),Be.setContext(s),Be.start(),i.isPresenting=!0,i.dispatchEvent({type:"sessionstart"})}},this.getEnvironmentBlendMode=function(){if(s!==null)return s.environmentBlendMode},this.getDepthTexture=function(){return _.getDepthTexture()};function K(B){for(let Q=0;Q<B.removed.length;Q++){const ue=B.removed[Q],ie=M.indexOf(ue);ie>=0&&(M[ie]=null,S[ie].disconnect(ue))}for(let Q=0;Q<B.added.length;Q++){const ue=B.added[Q];let ie=M.indexOf(ue);if(ie===-1){for(let Pe=0;Pe<S.length;Pe++)if(Pe>=M.length){M.push(ue),ie=Pe;break}else if(M[Pe]===null){M[Pe]=ue,ie=Pe;break}if(ie===-1)break}const Ae=S[ie];Ae&&Ae.connect(ue)}}const G=new N,Z=new N;function H(B,Q,ue){G.setFromMatrixPosition(Q.matrixWorld),Z.setFromMatrixPosition(ue.matrixWorld);const ie=G.distanceTo(Z),Ae=Q.projectionMatrix.elements,Pe=ue.projectionMatrix.elements,ee=Ae[14]/(Ae[10]-1),le=Ae[14]/(Ae[10]+1),xe=(Ae[9]+1)/Ae[5],Le=(Ae[9]-1)/Ae[5],R=(Ae[8]-1)/Ae[0],ze=(Pe[8]+1)/Pe[0],Me=ee*R,Re=ee*ze,ge=ie/(-R+ze),Ne=ge*-R;if(Q.matrixWorld.decompose(B.position,B.quaternion,B.scale),B.translateX(Ne),B.translateZ(ge),B.matrixWorld.compose(B.position,B.quaternion,B.scale),B.matrixWorldInverse.copy(B.matrixWorld).invert(),Ae[10]===-1)B.projectionMatrix.copy(Q.projectionMatrix),B.projectionMatrixInverse.copy(Q.projectionMatrixInverse);else{const Se=ee+ge,T=le+ge,v=Me-Ne,O=Re+(ie-Ne),$=xe*le/T*Se,Y=Le*le/T*Se;B.projectionMatrix.makePerspective(v,O,$,Y,Se,T),B.projectionMatrixInverse.copy(B.projectionMatrix).invert()}}function ne(B,Q){Q===null?B.matrixWorld.copy(B.matrix):B.matrixWorld.multiplyMatrices(Q.matrixWorld,B.matrix),B.matrixWorldInverse.copy(B.matrixWorld).invert()}this.updateCamera=function(B){if(s===null)return;let Q=B.near,ue=B.far;_.texture!==null&&(_.depthNear>0&&(Q=_.depthNear),_.depthFar>0&&(ue=_.depthFar)),x.near=L.near=w.near=Q,x.far=L.far=w.far=ue,(C!==x.near||V!==x.far)&&(s.updateRenderState({depthNear:x.near,depthFar:x.far}),C=x.near,V=x.far),w.layers.mask=B.layers.mask|2,L.layers.mask=B.layers.mask|4,x.layers.mask=w.layers.mask|L.layers.mask;const ie=B.parent,Ae=x.cameras;ne(x,ie);for(let Pe=0;Pe<Ae.length;Pe++)ne(Ae[Pe],ie);Ae.length===2?H(x,w,L):x.projectionMatrix.copy(w.projectionMatrix),J(B,x,ie)};function J(B,Q,ue){ue===null?B.matrix.copy(Q.matrixWorld):(B.matrix.copy(ue.matrixWorld),B.matrix.invert(),B.matrix.multiply(Q.matrixWorld)),B.matrix.decompose(B.position,B.quaternion,B.scale),B.updateMatrixWorld(!0),B.projectionMatrix.copy(Q.projectionMatrix),B.projectionMatrixInverse.copy(Q.projectionMatrixInverse),B.isPerspectiveCamera&&(B.fov=za*2*Math.atan(1/B.projectionMatrix.elements[5]),B.zoom=1)}this.getCamera=function(){return x},this.getFoveation=function(){if(!(f===null&&m===null))return l},this.setFoveation=function(B){l=B,f!==null&&(f.fixedFoveation=B),m!==null&&m.fixedFoveation!==void 0&&(m.fixedFoveation=B)},this.hasDepthSensing=function(){return _.texture!==null},this.getDepthSensingMesh=function(){return _.getMesh(x)};let re=null;function we(B,Q){if(u=Q.getViewerPose(c||a),g=Q,u!==null){const ue=u.views;m!==null&&(e.setRenderTargetFramebuffer(A,m.framebuffer),e.setRenderTarget(A));let ie=!1;ue.length!==x.cameras.length&&(x.cameras.length=0,ie=!0);for(let Pe=0;Pe<ue.length;Pe++){const ee=ue[Pe];let le=null;if(m!==null)le=m.getViewport(ee);else{const Le=d.getViewSubImage(f,ee);le=Le.viewport,Pe===0&&(e.setRenderTargetTextures(A,Le.colorTexture,f.ignoreDepthValues?void 0:Le.depthStencilTexture),e.setRenderTarget(A))}let xe=E[Pe];xe===void 0&&(xe=new Ut,xe.layers.enable(Pe),xe.viewport=new tt,E[Pe]=xe),xe.matrix.fromArray(ee.transform.matrix),xe.matrix.decompose(xe.position,xe.quaternion,xe.scale),xe.projectionMatrix.fromArray(ee.projectionMatrix),xe.projectionMatrixInverse.copy(xe.projectionMatrix).invert(),xe.viewport.set(le.x,le.y,le.width,le.height),Pe===0&&(x.matrix.copy(xe.matrix),x.matrix.decompose(x.position,x.quaternion,x.scale)),ie===!0&&x.cameras.push(xe)}const Ae=s.enabledFeatures;if(Ae&&Ae.includes("depth-sensing")){const Pe=d.getDepthInformation(ue[0]);Pe&&Pe.isValid&&Pe.texture&&_.init(e,Pe,s.renderState)}}for(let ue=0;ue<S.length;ue++){const ie=M[ue],Ae=S[ue];ie!==null&&Ae!==void 0&&Ae.update(ie,Q,c||a)}re&&re(B,Q),Q.detectedPlanes&&i.dispatchEvent({type:"planesdetected",data:Q}),g=null}const Be=new Ql;Be.setAnimationLoop(we),this.setAnimationLoop=function(B){re=B},this.dispose=function(){}}}const jn=new yn,Om=new rt;function Bm(n,e){function t(p,h){p.matrixAutoUpdate===!0&&p.updateMatrix(),h.value.copy(p.matrix)}function i(p,h){h.color.getRGB(p.fogColor.value,$l(n)),h.isFog?(p.fogNear.value=h.near,p.fogFar.value=h.far):h.isFogExp2&&(p.fogDensity.value=h.density)}function s(p,h,A,S,M){h.isMeshBasicMaterial||h.isMeshLambertMaterial?r(p,h):h.isMeshToonMaterial?(r(p,h),d(p,h)):h.isMeshPhongMaterial?(r(p,h),u(p,h)):h.isMeshStandardMaterial?(r(p,h),f(p,h),h.isMeshPhysicalMaterial&&m(p,h,M)):h.isMeshMatcapMaterial?(r(p,h),g(p,h)):h.isMeshDepthMaterial?r(p,h):h.isMeshDistanceMaterial?(r(p,h),_(p,h)):h.isMeshNormalMaterial?r(p,h):h.isLineBasicMaterial?(a(p,h),h.isLineDashedMaterial&&o(p,h)):h.isPointsMaterial?l(p,h,A,S):h.isSpriteMaterial?c(p,h):h.isShadowMaterial?(p.color.value.copy(h.color),p.opacity.value=h.opacity):h.isShaderMaterial&&(h.uniformsNeedUpdate=!1)}function r(p,h){p.opacity.value=h.opacity,h.color&&p.diffuse.value.copy(h.color),h.emissive&&p.emissive.value.copy(h.emissive).multiplyScalar(h.emissiveIntensity),h.map&&(p.map.value=h.map,t(h.map,p.mapTransform)),h.alphaMap&&(p.alphaMap.value=h.alphaMap,t(h.alphaMap,p.alphaMapTransform)),h.bumpMap&&(p.bumpMap.value=h.bumpMap,t(h.bumpMap,p.bumpMapTransform),p.bumpScale.value=h.bumpScale,h.side===Rt&&(p.bumpScale.value*=-1)),h.normalMap&&(p.normalMap.value=h.normalMap,t(h.normalMap,p.normalMapTransform),p.normalScale.value.copy(h.normalScale),h.side===Rt&&p.normalScale.value.negate()),h.displacementMap&&(p.displacementMap.value=h.displacementMap,t(h.displacementMap,p.displacementMapTransform),p.displacementScale.value=h.displacementScale,p.displacementBias.value=h.displacementBias),h.emissiveMap&&(p.emissiveMap.value=h.emissiveMap,t(h.emissiveMap,p.emissiveMapTransform)),h.specularMap&&(p.specularMap.value=h.specularMap,t(h.specularMap,p.specularMapTransform)),h.alphaTest>0&&(p.alphaTest.value=h.alphaTest);const A=e.get(h),S=A.envMap,M=A.envMapRotation;S&&(p.envMap.value=S,jn.copy(M),jn.x*=-1,jn.y*=-1,jn.z*=-1,S.isCubeTexture&&S.isRenderTargetTexture===!1&&(jn.y*=-1,jn.z*=-1),p.envMapRotation.value.setFromMatrix4(Om.makeRotationFromEuler(jn)),p.flipEnvMap.value=S.isCubeTexture&&S.isRenderTargetTexture===!1?-1:1,p.reflectivity.value=h.reflectivity,p.ior.value=h.ior,p.refractionRatio.value=h.refractionRatio),h.lightMap&&(p.lightMap.value=h.lightMap,p.lightMapIntensity.value=h.lightMapIntensity,t(h.lightMap,p.lightMapTransform)),h.aoMap&&(p.aoMap.value=h.aoMap,p.aoMapIntensity.value=h.aoMapIntensity,t(h.aoMap,p.aoMapTransform))}function a(p,h){p.diffuse.value.copy(h.color),p.opacity.value=h.opacity,h.map&&(p.map.value=h.map,t(h.map,p.mapTransform))}function o(p,h){p.dashSize.value=h.dashSize,p.totalSize.value=h.dashSize+h.gapSize,p.scale.value=h.scale}function l(p,h,A,S){p.diffuse.value.copy(h.color),p.opacity.value=h.opacity,p.size.value=h.size*A,p.scale.value=S*.5,h.map&&(p.map.value=h.map,t(h.map,p.uvTransform)),h.alphaMap&&(p.alphaMap.value=h.alphaMap,t(h.alphaMap,p.alphaMapTransform)),h.alphaTest>0&&(p.alphaTest.value=h.alphaTest)}function c(p,h){p.diffuse.value.copy(h.color),p.opacity.value=h.opacity,p.rotation.value=h.rotation,h.map&&(p.map.value=h.map,t(h.map,p.mapTransform)),h.alphaMap&&(p.alphaMap.value=h.alphaMap,t(h.alphaMap,p.alphaMapTransform)),h.alphaTest>0&&(p.alphaTest.value=h.alphaTest)}function u(p,h){p.specular.value.copy(h.specular),p.shininess.value=Math.max(h.shininess,1e-4)}function d(p,h){h.gradientMap&&(p.gradientMap.value=h.gradientMap)}function f(p,h){p.metalness.value=h.metalness,h.metalnessMap&&(p.metalnessMap.value=h.metalnessMap,t(h.metalnessMap,p.metalnessMapTransform)),p.roughness.value=h.roughness,h.roughnessMap&&(p.roughnessMap.value=h.roughnessMap,t(h.roughnessMap,p.roughnessMapTransform)),h.envMap&&(p.envMapIntensity.value=h.envMapIntensity)}function m(p,h,A){p.ior.value=h.ior,h.sheen>0&&(p.sheenColor.value.copy(h.sheenColor).multiplyScalar(h.sheen),p.sheenRoughness.value=h.sheenRoughness,h.sheenColorMap&&(p.sheenColorMap.value=h.sheenColorMap,t(h.sheenColorMap,p.sheenColorMapTransform)),h.sheenRoughnessMap&&(p.sheenRoughnessMap.value=h.sheenRoughnessMap,t(h.sheenRoughnessMap,p.sheenRoughnessMapTransform))),h.clearcoat>0&&(p.clearcoat.value=h.clearcoat,p.clearcoatRoughness.value=h.clearcoatRoughness,h.clearcoatMap&&(p.clearcoatMap.value=h.clearcoatMap,t(h.clearcoatMap,p.clearcoatMapTransform)),h.clearcoatRoughnessMap&&(p.clearcoatRoughnessMap.value=h.clearcoatRoughnessMap,t(h.clearcoatRoughnessMap,p.clearcoatRoughnessMapTransform)),h.clearcoatNormalMap&&(p.clearcoatNormalMap.value=h.clearcoatNormalMap,t(h.clearcoatNormalMap,p.clearcoatNormalMapTransform),p.clearcoatNormalScale.value.copy(h.clearcoatNormalScale),h.side===Rt&&p.clearcoatNormalScale.value.negate())),h.dispersion>0&&(p.dispersion.value=h.dispersion),h.iridescence>0&&(p.iridescence.value=h.iridescence,p.iridescenceIOR.value=h.iridescenceIOR,p.iridescenceThicknessMinimum.value=h.iridescenceThicknessRange[0],p.iridescenceThicknessMaximum.value=h.iridescenceThicknessRange[1],h.iridescenceMap&&(p.iridescenceMap.value=h.iridescenceMap,t(h.iridescenceMap,p.iridescenceMapTransform)),h.iridescenceThicknessMap&&(p.iridescenceThicknessMap.value=h.iridescenceThicknessMap,t(h.iridescenceThicknessMap,p.iridescenceThicknessMapTransform))),h.transmission>0&&(p.transmission.value=h.transmission,p.transmissionSamplerMap.value=A.texture,p.transmissionSamplerSize.value.set(A.width,A.height),h.transmissionMap&&(p.transmissionMap.value=h.transmissionMap,t(h.transmissionMap,p.transmissionMapTransform)),p.thickness.value=h.thickness,h.thicknessMap&&(p.thicknessMap.value=h.thicknessMap,t(h.thicknessMap,p.thicknessMapTransform)),p.attenuationDistance.value=h.attenuationDistance,p.attenuationColor.value.copy(h.attenuationColor)),h.anisotropy>0&&(p.anisotropyVector.value.set(h.anisotropy*Math.cos(h.anisotropyRotation),h.anisotropy*Math.sin(h.anisotropyRotation)),h.anisotropyMap&&(p.anisotropyMap.value=h.anisotropyMap,t(h.anisotropyMap,p.anisotropyMapTransform))),p.specularIntensity.value=h.specularIntensity,p.specularColor.value.copy(h.specularColor),h.specularColorMap&&(p.specularColorMap.value=h.specularColorMap,t(h.specularColorMap,p.specularColorMapTransform)),h.specularIntensityMap&&(p.specularIntensityMap.value=h.specularIntensityMap,t(h.specularIntensityMap,p.specularIntensityMapTransform))}function g(p,h){h.matcap&&(p.matcap.value=h.matcap)}function _(p,h){const A=e.get(h).light;p.referencePosition.value.setFromMatrixPosition(A.matrixWorld),p.nearDistance.value=A.shadow.camera.near,p.farDistance.value=A.shadow.camera.far}return{refreshFogUniforms:i,refreshMaterialUniforms:s}}function zm(n,e,t,i){let s={},r={},a=[];const o=n.getParameter(n.MAX_UNIFORM_BUFFER_BINDINGS);function l(A,S){const M=S.program;i.uniformBlockBinding(A,M)}function c(A,S){let M=s[A.id];M===void 0&&(g(A),M=u(A),s[A.id]=M,A.addEventListener("dispose",p));const P=S.program;i.updateUBOMapping(A,P);const b=e.render.frame;r[A.id]!==b&&(f(A),r[A.id]=b)}function u(A){const S=d();A.__bindingPointIndex=S;const M=n.createBuffer(),P=A.__size,b=A.usage;return n.bindBuffer(n.UNIFORM_BUFFER,M),n.bufferData(n.UNIFORM_BUFFER,P,b),n.bindBuffer(n.UNIFORM_BUFFER,null),n.bindBufferBase(n.UNIFORM_BUFFER,S,M),M}function d(){for(let A=0;A<o;A++)if(a.indexOf(A)===-1)return a.push(A),A;return console.error("THREE.WebGLRenderer: Maximum number of simultaneously usable uniforms groups reached."),0}function f(A){const S=s[A.id],M=A.uniforms,P=A.__cache;n.bindBuffer(n.UNIFORM_BUFFER,S);for(let b=0,w=M.length;b<w;b++){const L=Array.isArray(M[b])?M[b]:[M[b]];for(let E=0,x=L.length;E<x;E++){const C=L[E];if(m(C,b,E,P)===!0){const V=C.__offset,F=Array.isArray(C.value)?C.value:[C.value];let W=0;for(let K=0;K<F.length;K++){const G=F[K],Z=_(G);typeof G=="number"||typeof G=="boolean"?(C.__data[0]=G,n.bufferSubData(n.UNIFORM_BUFFER,V+W,C.__data)):G.isMatrix3?(C.__data[0]=G.elements[0],C.__data[1]=G.elements[1],C.__data[2]=G.elements[2],C.__data[3]=0,C.__data[4]=G.elements[3],C.__data[5]=G.elements[4],C.__data[6]=G.elements[5],C.__data[7]=0,C.__data[8]=G.elements[6],C.__data[9]=G.elements[7],C.__data[10]=G.elements[8],C.__data[11]=0):(G.toArray(C.__data,W),W+=Z.storage/Float32Array.BYTES_PER_ELEMENT)}n.bufferSubData(n.UNIFORM_BUFFER,V,C.__data)}}}n.bindBuffer(n.UNIFORM_BUFFER,null)}function m(A,S,M,P){const b=A.value,w=S+"_"+M;if(P[w]===void 0)return typeof b=="number"||typeof b=="boolean"?P[w]=b:P[w]=b.clone(),!0;{const L=P[w];if(typeof b=="number"||typeof b=="boolean"){if(L!==b)return P[w]=b,!0}else if(L.equals(b)===!1)return L.copy(b),!0}return!1}function g(A){const S=A.uniforms;let M=0;const P=16;for(let w=0,L=S.length;w<L;w++){const E=Array.isArray(S[w])?S[w]:[S[w]];for(let x=0,C=E.length;x<C;x++){const V=E[x],F=Array.isArray(V.value)?V.value:[V.value];for(let W=0,K=F.length;W<K;W++){const G=F[W],Z=_(G),H=M%P,ne=H%Z.boundary,J=H+ne;M+=ne,J!==0&&P-J<Z.storage&&(M+=P-J),V.__data=new Float32Array(Z.storage/Float32Array.BYTES_PER_ELEMENT),V.__offset=M,M+=Z.storage}}}const b=M%P;return b>0&&(M+=P-b),A.__size=M,A.__cache={},this}function _(A){const S={boundary:0,storage:0};return typeof A=="number"||typeof A=="boolean"?(S.boundary=4,S.storage=4):A.isVector2?(S.boundary=8,S.storage=8):A.isVector3||A.isColor?(S.boundary=16,S.storage=12):A.isVector4?(S.boundary=16,S.storage=16):A.isMatrix3?(S.boundary=48,S.storage=48):A.isMatrix4?(S.boundary=64,S.storage=64):A.isTexture?console.warn("THREE.WebGLRenderer: Texture samplers can not be part of an uniforms group."):console.warn("THREE.WebGLRenderer: Unsupported uniform value type.",A),S}function p(A){const S=A.target;S.removeEventListener("dispose",p);const M=a.indexOf(S.__bindingPointIndex);a.splice(M,1),n.deleteBuffer(s[S.id]),delete s[S.id],delete r[S.id]}function h(){for(const A in s)n.deleteBuffer(s[A]);a=[],s={},r={}}return{bind:l,update:c,dispose:h}}class km{constructor(e={}){const{canvas:t=wu(),context:i=null,depth:s=!0,stencil:r=!1,alpha:a=!1,antialias:o=!1,premultipliedAlpha:l=!0,preserveDrawingBuffer:c=!1,powerPreference:u="default",failIfMajorPerformanceCaveat:d=!1,reverseDepthBuffer:f=!1}=e;this.isWebGLRenderer=!0;let m;if(i!==null){if(typeof WebGLRenderingContext<"u"&&i instanceof WebGLRenderingContext)throw new Error("THREE.WebGLRenderer: WebGL 1 is not supported since r163.");m=i.getContextAttributes().alpha}else m=a;const g=new Uint32Array(4),_=new Int32Array(4);let p=null,h=null;const A=[],S=[];this.domElement=t,this.debug={checkShaderErrors:!0,onShaderError:null},this.autoClear=!0,this.autoClearColor=!0,this.autoClearDepth=!0,this.autoClearStencil=!0,this.sortObjects=!0,this.clippingPlanes=[],this.localClippingEnabled=!1,this._outputColorSpace=Bt,this.toneMapping=Gn,this.toneMappingExposure=1;const M=this;let P=!1,b=0,w=0,L=null,E=-1,x=null;const C=new tt,V=new tt;let F=null;const W=new je(0);let K=0,G=t.width,Z=t.height,H=1,ne=null,J=null;const re=new tt(0,0,G,Z),we=new tt(0,0,G,Z);let Be=!1;const B=new Jl;let Q=!1,ue=!1;const ie=new rt,Ae=new rt,Pe=new N,ee=new tt,le={background:null,fog:null,environment:null,overrideMaterial:null,isScene:!0};let xe=!1;function Le(){return L===null?H:1}let R=i;function ze(y,I){return t.getContext(y,I)}try{const y={alpha:!0,depth:s,stencil:r,antialias:o,premultipliedAlpha:l,preserveDrawingBuffer:c,powerPreference:u,failIfMajorPerformanceCaveat:d};if("setAttribute"in t&&t.setAttribute("data-engine",`three.js r${Ya}`),t.addEventListener("webglcontextlost",j,!1),t.addEventListener("webglcontextrestored",me,!1),t.addEventListener("webglcontextcreationerror",fe,!1),R===null){const I="webgl2";if(R=ze(I,y),R===null)throw ze(I)?new Error("Error creating WebGL context with your selected attributes."):new Error("Error creating WebGL context.")}}catch(y){throw console.error("THREE.WebGLRenderer: "+y.message),y}let Me,Re,ge,Ne,Se,T,v,O,$,Y,q,he,ae,_e,He,te,pe,De,Ce,ve,We,ke,Qe,D;function ce(){Me=new Xd(R),Me.init(),ke=new Pm(R,Me),Re=new zd(R,Me,e,ke),ge=new wm(R,Me),Re.reverseDepthBuffer&&f&&ge.buffers.depth.setReversed(!0),Ne=new Kd(R),Se=new fm,T=new Cm(R,Me,ge,Se,Re,ke,Ne),v=new Gd(M),O=new Wd(M),$=new eh(R),Qe=new Od(R,$),Y=new qd(R,$,Ne,Qe),q=new Zd(R,Y,$,Ne),Ce=new $d(R,Re,T),te=new kd(Se),he=new hm(M,v,O,Me,Re,Qe,te),ae=new Bm(M,Se),_e=new pm,He=new Mm(Me),De=new Fd(M,v,O,ge,q,m,l),pe=new Am(M,q,Re),D=new zm(R,Ne,Re,ge),ve=new Bd(R,Me,Ne),We=new Yd(R,Me,Ne),Ne.programs=he.programs,M.capabilities=Re,M.extensions=Me,M.properties=Se,M.renderLists=_e,M.shadowMap=pe,M.state=ge,M.info=Ne}ce();const X=new Fm(M,R);this.xr=X,this.getContext=function(){return R},this.getContextAttributes=function(){return R.getContextAttributes()},this.forceContextLoss=function(){const y=Me.get("WEBGL_lose_context");y&&y.loseContext()},this.forceContextRestore=function(){const y=Me.get("WEBGL_lose_context");y&&y.restoreContext()},this.getPixelRatio=function(){return H},this.setPixelRatio=function(y){y!==void 0&&(H=y,this.setSize(G,Z,!1))},this.getSize=function(y){return y.set(G,Z)},this.setSize=function(y,I,z=!0){if(X.isPresenting){console.warn("THREE.WebGLRenderer: Can't change size while VR device is presenting.");return}G=y,Z=I,t.width=Math.floor(y*H),t.height=Math.floor(I*H),z===!0&&(t.style.width=y+"px",t.style.height=I+"px"),this.setViewport(0,0,y,I)},this.getDrawingBufferSize=function(y){return y.set(G*H,Z*H).floor()},this.setDrawingBufferSize=function(y,I,z){G=y,Z=I,H=z,t.width=Math.floor(y*z),t.height=Math.floor(I*z),this.setViewport(0,0,y,I)},this.getCurrentViewport=function(y){return y.copy(C)},this.getViewport=function(y){return y.copy(re)},this.setViewport=function(y,I,z,k){y.isVector4?re.set(y.x,y.y,y.z,y.w):re.set(y,I,z,k),ge.viewport(C.copy(re).multiplyScalar(H).round())},this.getScissor=function(y){return y.copy(we)},this.setScissor=function(y,I,z,k){y.isVector4?we.set(y.x,y.y,y.z,y.w):we.set(y,I,z,k),ge.scissor(V.copy(we).multiplyScalar(H).round())},this.getScissorTest=function(){return Be},this.setScissorTest=function(y){ge.setScissorTest(Be=y)},this.setOpaqueSort=function(y){ne=y},this.setTransparentSort=function(y){J=y},this.getClearColor=function(y){return y.copy(De.getClearColor())},this.setClearColor=function(){De.setClearColor.apply(De,arguments)},this.getClearAlpha=function(){return De.getClearAlpha()},this.setClearAlpha=function(){De.setClearAlpha.apply(De,arguments)},this.clear=function(y=!0,I=!0,z=!0){let k=0;if(y){let U=!1;if(L!==null){const se=L.texture.format;U=se===Qa||se===Ja||se===ja}if(U){const se=L.texture.type,de=se===Jt||se===ci||se===hs||se===Oi||se===$a||se===Za,ye=De.getClearColor(),Ee=De.getClearAlpha(),Ie=ye.r,Oe=ye.g,Te=ye.b;de?(g[0]=Ie,g[1]=Oe,g[2]=Te,g[3]=Ee,R.clearBufferuiv(R.COLOR,0,g)):(_[0]=Ie,_[1]=Oe,_[2]=Te,_[3]=Ee,R.clearBufferiv(R.COLOR,0,_))}else k|=R.COLOR_BUFFER_BIT}I&&(k|=R.DEPTH_BUFFER_BIT),z&&(k|=R.STENCIL_BUFFER_BIT,this.state.buffers.stencil.setMask(4294967295)),R.clear(k)},this.clearColor=function(){this.clear(!0,!1,!1)},this.clearDepth=function(){this.clear(!1,!0,!1)},this.clearStencil=function(){this.clear(!1,!1,!0)},this.dispose=function(){t.removeEventListener("webglcontextlost",j,!1),t.removeEventListener("webglcontextrestored",me,!1),t.removeEventListener("webglcontextcreationerror",fe,!1),_e.dispose(),He.dispose(),Se.dispose(),v.dispose(),O.dispose(),q.dispose(),Qe.dispose(),D.dispose(),he.dispose(),X.dispose(),X.removeEventListener("sessionstart",ao),X.removeEventListener("sessionend",oo),Xn.stop()};function j(y){y.preventDefault(),console.log("THREE.WebGLRenderer: Context Lost."),P=!0}function me(){console.log("THREE.WebGLRenderer: Context Restored."),P=!1;const y=Ne.autoReset,I=pe.enabled,z=pe.autoUpdate,k=pe.needsUpdate,U=pe.type;ce(),Ne.autoReset=y,pe.enabled=I,pe.autoUpdate=z,pe.needsUpdate=k,pe.type=U}function fe(y){console.error("THREE.WebGLRenderer: A WebGL context could not be created. Reason: ",y.statusMessage)}function Fe(y){const I=y.target;I.removeEventListener("dispose",Fe),at(I)}function at(y){_t(y),Se.remove(y)}function _t(y){const I=Se.get(y).programs;I!==void 0&&(I.forEach(function(z){he.releaseProgram(z)}),y.isShaderMaterial&&he.releaseShaderCache(y))}this.renderBufferDirect=function(y,I,z,k,U,se){I===null&&(I=le);const de=U.isMesh&&U.matrixWorld.determinant()<0,ye=bc(y,I,z,k,U);ge.setMaterial(k,de);let Ee=z.index,Ie=1;if(k.wireframe===!0){if(Ee=Y.getWireframeAttribute(z),Ee===void 0)return;Ie=2}const Oe=z.drawRange,Te=z.attributes.position;let Ye=Oe.start*Ie,et=(Oe.start+Oe.count)*Ie;se!==null&&(Ye=Math.max(Ye,se.start*Ie),et=Math.min(et,(se.start+se.count)*Ie)),Ee!==null?(Ye=Math.max(Ye,0),et=Math.min(et,Ee.count)):Te!=null&&(Ye=Math.max(Ye,0),et=Math.min(et,Te.count));const nt=et-Ye;if(nt<0||nt===1/0)return;Qe.setup(U,k,ye,z,Ee);let Et,Ke=ve;if(Ee!==null&&(Et=$.get(Ee),Ke=We,Ke.setIndex(Et)),U.isMesh)k.wireframe===!0?(ge.setLineWidth(k.wireframeLinewidth*Le()),Ke.setMode(R.LINES)):Ke.setMode(R.TRIANGLES);else if(U.isLine){let be=k.linewidth;be===void 0&&(be=1),ge.setLineWidth(be*Le()),U.isLineSegments?Ke.setMode(R.LINES):U.isLineLoop?Ke.setMode(R.LINE_LOOP):Ke.setMode(R.LINE_STRIP)}else U.isPoints?Ke.setMode(R.POINTS):U.isSprite&&Ke.setMode(R.TRIANGLES);if(U.isBatchedMesh)if(U._multiDrawInstances!==null)Ke.renderMultiDrawInstances(U._multiDrawStarts,U._multiDrawCounts,U._multiDrawCount,U._multiDrawInstances);else if(Me.get("WEBGL_multi_draw"))Ke.renderMultiDraw(U._multiDrawStarts,U._multiDrawCounts,U._multiDrawCount);else{const be=U._multiDrawStarts,cn=U._multiDrawCounts,$e=U._multiDrawCount,Wt=Ee?$.get(Ee).bytesPerElement:1,ui=Se.get(k).currentProgram.getUniforms();for(let Dt=0;Dt<$e;Dt++)ui.setValue(R,"_gl_DrawID",Dt),Ke.render(be[Dt]/Wt,cn[Dt])}else if(U.isInstancedMesh)Ke.renderInstances(Ye,nt,U.count);else if(z.isInstancedBufferGeometry){const be=z._maxInstanceCount!==void 0?z._maxInstanceCount:1/0,cn=Math.min(z.instanceCount,be);Ke.renderInstances(Ye,nt,cn)}else Ke.render(Ye,nt)};function Ze(y,I,z){y.transparent===!0&&y.side===sn&&y.forceSinglePass===!1?(y.side=Rt,y.needsUpdate=!0,ys(y,I,z),y.side=Vn,y.needsUpdate=!0,ys(y,I,z),y.side=sn):ys(y,I,z)}this.compile=function(y,I,z=null){z===null&&(z=y),h=He.get(z),h.init(I),S.push(h),z.traverseVisible(function(U){U.isLight&&U.layers.test(I.layers)&&(h.pushLight(U),U.castShadow&&h.pushShadow(U))}),y!==z&&y.traverseVisible(function(U){U.isLight&&U.layers.test(I.layers)&&(h.pushLight(U),U.castShadow&&h.pushShadow(U))}),h.setupLights();const k=new Set;return y.traverse(function(U){if(!(U.isMesh||U.isPoints||U.isLine||U.isSprite))return;const se=U.material;if(se)if(Array.isArray(se))for(let de=0;de<se.length;de++){const ye=se[de];Ze(ye,z,U),k.add(ye)}else Ze(se,z,U),k.add(se)}),S.pop(),h=null,k},this.compileAsync=function(y,I,z=null){const k=this.compile(y,I,z);return new Promise(U=>{function se(){if(k.forEach(function(de){Se.get(de).currentProgram.isReady()&&k.delete(de)}),k.size===0){U(y);return}setTimeout(se,10)}Me.get("KHR_parallel_shader_compile")!==null?se():setTimeout(se,10)})};let Vt=null;function ln(y){Vt&&Vt(y)}function ao(){Xn.stop()}function oo(){Xn.start()}const Xn=new Ql;Xn.setAnimationLoop(ln),typeof self<"u"&&Xn.setContext(self),this.setAnimationLoop=function(y){Vt=y,X.setAnimationLoop(y),y===null?Xn.stop():Xn.start()},X.addEventListener("sessionstart",ao),X.addEventListener("sessionend",oo),this.render=function(y,I){if(I!==void 0&&I.isCamera!==!0){console.error("THREE.WebGLRenderer.render: camera is not an instance of THREE.Camera.");return}if(P===!0)return;if(y.matrixWorldAutoUpdate===!0&&y.updateMatrixWorld(),I.parent===null&&I.matrixWorldAutoUpdate===!0&&I.updateMatrixWorld(),X.enabled===!0&&X.isPresenting===!0&&(X.cameraAutoUpdate===!0&&X.updateCamera(I),I=X.getCamera()),y.isScene===!0&&y.onBeforeRender(M,y,I,L),h=He.get(y,S.length),h.init(I),S.push(h),Ae.multiplyMatrices(I.projectionMatrix,I.matrixWorldInverse),B.setFromProjectionMatrix(Ae),ue=this.localClippingEnabled,Q=te.init(this.clippingPlanes,ue),p=_e.get(y,A.length),p.init(),A.push(p),X.enabled===!0&&X.isPresenting===!0){const se=M.xr.getDepthSensingMesh();se!==null&&_r(se,I,-1/0,M.sortObjects)}_r(y,I,0,M.sortObjects),p.finish(),M.sortObjects===!0&&p.sort(ne,J),xe=X.enabled===!1||X.isPresenting===!1||X.hasDepthSensing()===!1,xe&&De.addToRenderList(p,y),this.info.render.frame++,Q===!0&&te.beginShadows();const z=h.state.shadowsArray;pe.render(z,y,I),Q===!0&&te.endShadows(),this.info.autoReset===!0&&this.info.reset();const k=p.opaque,U=p.transmissive;if(h.setupLights(),I.isArrayCamera){const se=I.cameras;if(U.length>0)for(let de=0,ye=se.length;de<ye;de++){const Ee=se[de];co(k,U,y,Ee)}xe&&De.render(y);for(let de=0,ye=se.length;de<ye;de++){const Ee=se[de];lo(p,y,Ee,Ee.viewport)}}else U.length>0&&co(k,U,y,I),xe&&De.render(y),lo(p,y,I);L!==null&&(T.updateMultisampleRenderTarget(L),T.updateRenderTargetMipmap(L)),y.isScene===!0&&y.onAfterRender(M,y,I),Qe.resetDefaultState(),E=-1,x=null,S.pop(),S.length>0?(h=S[S.length-1],Q===!0&&te.setGlobalState(M.clippingPlanes,h.state.camera)):h=null,A.pop(),A.length>0?p=A[A.length-1]:p=null};function _r(y,I,z,k){if(y.visible===!1)return;if(y.layers.test(I.layers)){if(y.isGroup)z=y.renderOrder;else if(y.isLOD)y.autoUpdate===!0&&y.update(I);else if(y.isLight)h.pushLight(y),y.castShadow&&h.pushShadow(y);else if(y.isSprite){if(!y.frustumCulled||B.intersectsSprite(y)){k&&ee.setFromMatrixPosition(y.matrixWorld).applyMatrix4(Ae);const de=q.update(y),ye=y.material;ye.visible&&p.push(y,de,ye,z,ee.z,null)}}else if((y.isMesh||y.isLine||y.isPoints)&&(!y.frustumCulled||B.intersectsObject(y))){const de=q.update(y),ye=y.material;if(k&&(y.boundingSphere!==void 0?(y.boundingSphere===null&&y.computeBoundingSphere(),ee.copy(y.boundingSphere.center)):(de.boundingSphere===null&&de.computeBoundingSphere(),ee.copy(de.boundingSphere.center)),ee.applyMatrix4(y.matrixWorld).applyMatrix4(Ae)),Array.isArray(ye)){const Ee=de.groups;for(let Ie=0,Oe=Ee.length;Ie<Oe;Ie++){const Te=Ee[Ie],Ye=ye[Te.materialIndex];Ye&&Ye.visible&&p.push(y,de,Ye,z,ee.z,Te)}}else ye.visible&&p.push(y,de,ye,z,ee.z,null)}}const se=y.children;for(let de=0,ye=se.length;de<ye;de++)_r(se[de],I,z,k)}function lo(y,I,z,k){const U=y.opaque,se=y.transmissive,de=y.transparent;h.setupLightsView(z),Q===!0&&te.setGlobalState(M.clippingPlanes,z),k&&ge.viewport(C.copy(k)),U.length>0&&Ss(U,I,z),se.length>0&&Ss(se,I,z),de.length>0&&Ss(de,I,z),ge.buffers.depth.setTest(!0),ge.buffers.depth.setMask(!0),ge.buffers.color.setMask(!0),ge.setPolygonOffset(!1)}function co(y,I,z,k){if((z.isScene===!0?z.overrideMaterial:null)!==null)return;h.state.transmissionRenderTarget[k.id]===void 0&&(h.state.transmissionRenderTarget[k.id]=new Sn(1,1,{generateMipmaps:!0,type:Me.has("EXT_color_buffer_half_float")||Me.has("EXT_color_buffer_float")?gs:Jt,minFilter:si,samples:4,stencilBuffer:r,resolveDepthBuffer:!1,resolveStencilBuffer:!1,colorSpace:qe.workingColorSpace}));const se=h.state.transmissionRenderTarget[k.id],de=k.viewport||C;se.setSize(de.z,de.w);const ye=M.getRenderTarget();M.setRenderTarget(se),M.getClearColor(W),K=M.getClearAlpha(),K<1&&M.setClearColor(16777215,.5),M.clear(),xe&&De.render(z);const Ee=M.toneMapping;M.toneMapping=Gn;const Ie=k.viewport;if(k.viewport!==void 0&&(k.viewport=void 0),h.setupLightsView(k),Q===!0&&te.setGlobalState(M.clippingPlanes,k),Ss(y,z,k),T.updateMultisampleRenderTarget(se),T.updateRenderTargetMipmap(se),Me.has("WEBGL_multisampled_render_to_texture")===!1){let Oe=!1;for(let Te=0,Ye=I.length;Te<Ye;Te++){const et=I[Te],nt=et.object,Et=et.geometry,Ke=et.material,be=et.group;if(Ke.side===sn&&nt.layers.test(k.layers)){const cn=Ke.side;Ke.side=Rt,Ke.needsUpdate=!0,uo(nt,z,k,Et,Ke,be),Ke.side=cn,Ke.needsUpdate=!0,Oe=!0}}Oe===!0&&(T.updateMultisampleRenderTarget(se),T.updateRenderTargetMipmap(se))}M.setRenderTarget(ye),M.setClearColor(W,K),Ie!==void 0&&(k.viewport=Ie),M.toneMapping=Ee}function Ss(y,I,z){const k=I.isScene===!0?I.overrideMaterial:null;for(let U=0,se=y.length;U<se;U++){const de=y[U],ye=de.object,Ee=de.geometry,Ie=k===null?de.material:k,Oe=de.group;ye.layers.test(z.layers)&&uo(ye,I,z,Ee,Ie,Oe)}}function uo(y,I,z,k,U,se){y.onBeforeRender(M,I,z,k,U,se),y.modelViewMatrix.multiplyMatrices(z.matrixWorldInverse,y.matrixWorld),y.normalMatrix.getNormalMatrix(y.modelViewMatrix),U.onBeforeRender(M,I,z,k,y,se),U.transparent===!0&&U.side===sn&&U.forceSinglePass===!1?(U.side=Rt,U.needsUpdate=!0,M.renderBufferDirect(z,I,k,U,y,se),U.side=Vn,U.needsUpdate=!0,M.renderBufferDirect(z,I,k,U,y,se),U.side=sn):M.renderBufferDirect(z,I,k,U,y,se),y.onAfterRender(M,I,z,k,U,se)}function ys(y,I,z){I.isScene!==!0&&(I=le);const k=Se.get(y),U=h.state.lights,se=h.state.shadowsArray,de=U.state.version,ye=he.getParameters(y,U.state,se,I,z),Ee=he.getProgramCacheKey(ye);let Ie=k.programs;k.environment=y.isMeshStandardMaterial?I.environment:null,k.fog=I.fog,k.envMap=(y.isMeshStandardMaterial?O:v).get(y.envMap||k.environment),k.envMapRotation=k.environment!==null&&y.envMap===null?I.environmentRotation:y.envMapRotation,Ie===void 0&&(y.addEventListener("dispose",Fe),Ie=new Map,k.programs=Ie);let Oe=Ie.get(Ee);if(Oe!==void 0){if(k.currentProgram===Oe&&k.lightsStateVersion===de)return fo(y,ye),Oe}else ye.uniforms=he.getUniforms(y),y.onBeforeCompile(ye,M),Oe=he.acquireProgram(ye,Ee),Ie.set(Ee,Oe),k.uniforms=ye.uniforms;const Te=k.uniforms;return(!y.isShaderMaterial&&!y.isRawShaderMaterial||y.clipping===!0)&&(Te.clippingPlanes=te.uniform),fo(y,ye),k.needsLights=Rc(y),k.lightsStateVersion=de,k.needsLights&&(Te.ambientLightColor.value=U.state.ambient,Te.lightProbe.value=U.state.probe,Te.directionalLights.value=U.state.directional,Te.directionalLightShadows.value=U.state.directionalShadow,Te.spotLights.value=U.state.spot,Te.spotLightShadows.value=U.state.spotShadow,Te.rectAreaLights.value=U.state.rectArea,Te.ltc_1.value=U.state.rectAreaLTC1,Te.ltc_2.value=U.state.rectAreaLTC2,Te.pointLights.value=U.state.point,Te.pointLightShadows.value=U.state.pointShadow,Te.hemisphereLights.value=U.state.hemi,Te.directionalShadowMap.value=U.state.directionalShadowMap,Te.directionalShadowMatrix.value=U.state.directionalShadowMatrix,Te.spotShadowMap.value=U.state.spotShadowMap,Te.spotLightMatrix.value=U.state.spotLightMatrix,Te.spotLightMap.value=U.state.spotLightMap,Te.pointShadowMap.value=U.state.pointShadowMap,Te.pointShadowMatrix.value=U.state.pointShadowMatrix),k.currentProgram=Oe,k.uniformsList=null,Oe}function ho(y){if(y.uniformsList===null){const I=y.currentProgram.getUniforms();y.uniformsList=er.seqWithValue(I.seq,y.uniforms)}return y.uniformsList}function fo(y,I){const z=Se.get(y);z.outputColorSpace=I.outputColorSpace,z.batching=I.batching,z.batchingColor=I.batchingColor,z.instancing=I.instancing,z.instancingColor=I.instancingColor,z.instancingMorph=I.instancingMorph,z.skinning=I.skinning,z.morphTargets=I.morphTargets,z.morphNormals=I.morphNormals,z.morphColors=I.morphColors,z.morphTargetsCount=I.morphTargetsCount,z.numClippingPlanes=I.numClippingPlanes,z.numIntersection=I.numClipIntersection,z.vertexAlphas=I.vertexAlphas,z.vertexTangents=I.vertexTangents,z.toneMapping=I.toneMapping}function bc(y,I,z,k,U){I.isScene!==!0&&(I=le),T.resetTextureUnits();const se=I.fog,de=k.isMeshStandardMaterial?I.environment:null,ye=L===null?M.outputColorSpace:L.isXRRenderTarget===!0?L.texture.colorSpace:Wi,Ee=(k.isMeshStandardMaterial?O:v).get(k.envMap||de),Ie=k.vertexColors===!0&&!!z.attributes.color&&z.attributes.color.itemSize===4,Oe=!!z.attributes.tangent&&(!!k.normalMap||k.anisotropy>0),Te=!!z.morphAttributes.position,Ye=!!z.morphAttributes.normal,et=!!z.morphAttributes.color;let nt=Gn;k.toneMapped&&(L===null||L.isXRRenderTarget===!0)&&(nt=M.toneMapping);const Et=z.morphAttributes.position||z.morphAttributes.normal||z.morphAttributes.color,Ke=Et!==void 0?Et.length:0,be=Se.get(k),cn=h.state.lights;if(Q===!0&&(ue===!0||y!==x)){const Nt=y===x&&k.id===E;te.setState(k,y,Nt)}let $e=!1;k.version===be.__version?(be.needsLights&&be.lightsStateVersion!==cn.state.version||be.outputColorSpace!==ye||U.isBatchedMesh&&be.batching===!1||!U.isBatchedMesh&&be.batching===!0||U.isBatchedMesh&&be.batchingColor===!0&&U.colorTexture===null||U.isBatchedMesh&&be.batchingColor===!1&&U.colorTexture!==null||U.isInstancedMesh&&be.instancing===!1||!U.isInstancedMesh&&be.instancing===!0||U.isSkinnedMesh&&be.skinning===!1||!U.isSkinnedMesh&&be.skinning===!0||U.isInstancedMesh&&be.instancingColor===!0&&U.instanceColor===null||U.isInstancedMesh&&be.instancingColor===!1&&U.instanceColor!==null||U.isInstancedMesh&&be.instancingMorph===!0&&U.morphTexture===null||U.isInstancedMesh&&be.instancingMorph===!1&&U.morphTexture!==null||be.envMap!==Ee||k.fog===!0&&be.fog!==se||be.numClippingPlanes!==void 0&&(be.numClippingPlanes!==te.numPlanes||be.numIntersection!==te.numIntersection)||be.vertexAlphas!==Ie||be.vertexTangents!==Oe||be.morphTargets!==Te||be.morphNormals!==Ye||be.morphColors!==et||be.toneMapping!==nt||be.morphTargetsCount!==Ke)&&($e=!0):($e=!0,be.__version=k.version);let Wt=be.currentProgram;$e===!0&&(Wt=ys(k,I,U));let ui=!1,Dt=!1,$i=!1;const it=Wt.getUniforms(),tn=be.uniforms;if(ge.useProgram(Wt.program)&&(ui=!0,Dt=!0,$i=!0),k.id!==E&&(E=k.id,Dt=!0),ui||x!==y){ge.buffers.depth.getReversed()?(ie.copy(y.projectionMatrix),Cu(ie),Pu(ie),it.setValue(R,"projectionMatrix",ie)):it.setValue(R,"projectionMatrix",y.projectionMatrix),it.setValue(R,"viewMatrix",y.matrixWorldInverse);const An=it.map.cameraPosition;An!==void 0&&An.setValue(R,Pe.setFromMatrixPosition(y.matrixWorld)),Re.logarithmicDepthBuffer&&it.setValue(R,"logDepthBufFC",2/(Math.log(y.far+1)/Math.LN2)),(k.isMeshPhongMaterial||k.isMeshToonMaterial||k.isMeshLambertMaterial||k.isMeshBasicMaterial||k.isMeshStandardMaterial||k.isShaderMaterial)&&it.setValue(R,"isOrthographic",y.isOrthographicCamera===!0),x!==y&&(x=y,Dt=!0,$i=!0)}if(U.isSkinnedMesh){it.setOptional(R,U,"bindMatrix"),it.setOptional(R,U,"bindMatrixInverse");const Nt=U.skeleton;Nt&&(Nt.boneTexture===null&&Nt.computeBoneTexture(),it.setValue(R,"boneTexture",Nt.boneTexture,T))}U.isBatchedMesh&&(it.setOptional(R,U,"batchingTexture"),it.setValue(R,"batchingTexture",U._matricesTexture,T),it.setOptional(R,U,"batchingIdTexture"),it.setValue(R,"batchingIdTexture",U._indirectTexture,T),it.setOptional(R,U,"batchingColorTexture"),U._colorsTexture!==null&&it.setValue(R,"batchingColorTexture",U._colorsTexture,T));const Zi=z.morphAttributes;if((Zi.position!==void 0||Zi.normal!==void 0||Zi.color!==void 0)&&Ce.update(U,z,Wt),(Dt||be.receiveShadow!==U.receiveShadow)&&(be.receiveShadow=U.receiveShadow,it.setValue(R,"receiveShadow",U.receiveShadow)),k.isMeshGouraudMaterial&&k.envMap!==null&&(tn.envMap.value=Ee,tn.flipEnvMap.value=Ee.isCubeTexture&&Ee.isRenderTargetTexture===!1?-1:1),k.isMeshStandardMaterial&&k.envMap===null&&I.environment!==null&&(tn.envMapIntensity.value=I.environmentIntensity),Dt&&(it.setValue(R,"toneMappingExposure",M.toneMappingExposure),be.needsLights&&wc(tn,$i),se&&k.fog===!0&&ae.refreshFogUniforms(tn,se),ae.refreshMaterialUniforms(tn,k,H,Z,h.state.transmissionRenderTarget[y.id]),er.upload(R,ho(be),tn,T)),k.isShaderMaterial&&k.uniformsNeedUpdate===!0&&(er.upload(R,ho(be),tn,T),k.uniformsNeedUpdate=!1),k.isSpriteMaterial&&it.setValue(R,"center",U.center),it.setValue(R,"modelViewMatrix",U.modelViewMatrix),it.setValue(R,"normalMatrix",U.normalMatrix),it.setValue(R,"modelMatrix",U.matrixWorld),k.isShaderMaterial||k.isRawShaderMaterial){const Nt=k.uniformsGroups;for(let An=0,bn=Nt.length;An<bn;An++){const po=Nt[An];D.update(po,Wt),D.bind(po,Wt)}}return Wt}function wc(y,I){y.ambientLightColor.needsUpdate=I,y.lightProbe.needsUpdate=I,y.directionalLights.needsUpdate=I,y.directionalLightShadows.needsUpdate=I,y.pointLights.needsUpdate=I,y.pointLightShadows.needsUpdate=I,y.spotLights.needsUpdate=I,y.spotLightShadows.needsUpdate=I,y.rectAreaLights.needsUpdate=I,y.hemisphereLights.needsUpdate=I}function Rc(y){return y.isMeshLambertMaterial||y.isMeshToonMaterial||y.isMeshPhongMaterial||y.isMeshStandardMaterial||y.isShadowMaterial||y.isShaderMaterial&&y.lights===!0}this.getActiveCubeFace=function(){return b},this.getActiveMipmapLevel=function(){return w},this.getRenderTarget=function(){return L},this.setRenderTargetTextures=function(y,I,z){Se.get(y.texture).__webglTexture=I,Se.get(y.depthTexture).__webglTexture=z;const k=Se.get(y);k.__hasExternalTextures=!0,k.__autoAllocateDepthBuffer=z===void 0,k.__autoAllocateDepthBuffer||Me.has("WEBGL_multisampled_render_to_texture")===!0&&(console.warn("THREE.WebGLRenderer: Render-to-texture extension was disabled because an external texture was provided"),k.__useRenderToTexture=!1)},this.setRenderTargetFramebuffer=function(y,I){const z=Se.get(y);z.__webglFramebuffer=I,z.__useDefaultFramebuffer=I===void 0},this.setRenderTarget=function(y,I=0,z=0){L=y,b=I,w=z;let k=!0,U=null,se=!1,de=!1;if(y){const Ee=Se.get(y);if(Ee.__useDefaultFramebuffer!==void 0)ge.bindFramebuffer(R.FRAMEBUFFER,null),k=!1;else if(Ee.__webglFramebuffer===void 0)T.setupRenderTarget(y);else if(Ee.__hasExternalTextures)T.rebindTextures(y,Se.get(y.texture).__webglTexture,Se.get(y.depthTexture).__webglTexture);else if(y.depthBuffer){const Te=y.depthTexture;if(Ee.__boundDepthTexture!==Te){if(Te!==null&&Se.has(Te)&&(y.width!==Te.image.width||y.height!==Te.image.height))throw new Error("WebGLRenderTarget: Attached DepthTexture is initialized to the incorrect size.");T.setupDepthRenderbuffer(y)}}const Ie=y.texture;(Ie.isData3DTexture||Ie.isDataArrayTexture||Ie.isCompressedArrayTexture)&&(de=!0);const Oe=Se.get(y).__webglFramebuffer;y.isWebGLCubeRenderTarget?(Array.isArray(Oe[I])?U=Oe[I][z]:U=Oe[I],se=!0):y.samples>0&&T.useMultisampledRTT(y)===!1?U=Se.get(y).__webglMultisampledFramebuffer:Array.isArray(Oe)?U=Oe[z]:U=Oe,C.copy(y.viewport),V.copy(y.scissor),F=y.scissorTest}else C.copy(re).multiplyScalar(H).floor(),V.copy(we).multiplyScalar(H).floor(),F=Be;if(ge.bindFramebuffer(R.FRAMEBUFFER,U)&&k&&ge.drawBuffers(y,U),ge.viewport(C),ge.scissor(V),ge.setScissorTest(F),se){const Ee=Se.get(y.texture);R.framebufferTexture2D(R.FRAMEBUFFER,R.COLOR_ATTACHMENT0,R.TEXTURE_CUBE_MAP_POSITIVE_X+I,Ee.__webglTexture,z)}else if(de){const Ee=Se.get(y.texture),Ie=I||0;R.framebufferTextureLayer(R.FRAMEBUFFER,R.COLOR_ATTACHMENT0,Ee.__webglTexture,z||0,Ie)}E=-1},this.readRenderTargetPixels=function(y,I,z,k,U,se,de){if(!(y&&y.isWebGLRenderTarget)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");return}let ye=Se.get(y).__webglFramebuffer;if(y.isWebGLCubeRenderTarget&&de!==void 0&&(ye=ye[de]),ye){ge.bindFramebuffer(R.FRAMEBUFFER,ye);try{const Ee=y.texture,Ie=Ee.format,Oe=Ee.type;if(!Re.textureFormatReadable(Ie)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not in RGBA or implementation defined format.");return}if(!Re.textureTypeReadable(Oe)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not in UnsignedByteType or implementation defined type.");return}I>=0&&I<=y.width-k&&z>=0&&z<=y.height-U&&R.readPixels(I,z,k,U,ke.convert(Ie),ke.convert(Oe),se)}finally{const Ee=L!==null?Se.get(L).__webglFramebuffer:null;ge.bindFramebuffer(R.FRAMEBUFFER,Ee)}}},this.readRenderTargetPixelsAsync=async function(y,I,z,k,U,se,de){if(!(y&&y.isWebGLRenderTarget))throw new Error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");let ye=Se.get(y).__webglFramebuffer;if(y.isWebGLCubeRenderTarget&&de!==void 0&&(ye=ye[de]),ye){const Ee=y.texture,Ie=Ee.format,Oe=Ee.type;if(!Re.textureFormatReadable(Ie))throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in RGBA or implementation defined format.");if(!Re.textureTypeReadable(Oe))throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in UnsignedByteType or implementation defined type.");if(I>=0&&I<=y.width-k&&z>=0&&z<=y.height-U){ge.bindFramebuffer(R.FRAMEBUFFER,ye);const Te=R.createBuffer();R.bindBuffer(R.PIXEL_PACK_BUFFER,Te),R.bufferData(R.PIXEL_PACK_BUFFER,se.byteLength,R.STREAM_READ),R.readPixels(I,z,k,U,ke.convert(Ie),ke.convert(Oe),0);const Ye=L!==null?Se.get(L).__webglFramebuffer:null;ge.bindFramebuffer(R.FRAMEBUFFER,Ye);const et=R.fenceSync(R.SYNC_GPU_COMMANDS_COMPLETE,0);return R.flush(),await Ru(R,et,4),R.bindBuffer(R.PIXEL_PACK_BUFFER,Te),R.getBufferSubData(R.PIXEL_PACK_BUFFER,0,se),R.deleteBuffer(Te),R.deleteSync(et),se}else throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: requested read bounds are out of range.")}},this.copyFramebufferToTexture=function(y,I=null,z=0){y.isTexture!==!0&&(ss("WebGLRenderer: copyFramebufferToTexture function signature has changed."),I=arguments[0]||null,y=arguments[1]);const k=Math.pow(2,-z),U=Math.floor(y.image.width*k),se=Math.floor(y.image.height*k),de=I!==null?I.x:0,ye=I!==null?I.y:0;T.setTexture2D(y,0),R.copyTexSubImage2D(R.TEXTURE_2D,z,0,0,de,ye,U,se),ge.unbindTexture()},this.copyTextureToTexture=function(y,I,z=null,k=null,U=0){y.isTexture!==!0&&(ss("WebGLRenderer: copyTextureToTexture function signature has changed."),k=arguments[0]||null,y=arguments[1],I=arguments[2],U=arguments[3]||0,z=null);let se,de,ye,Ee,Ie,Oe,Te,Ye,et;const nt=y.isCompressedTexture?y.mipmaps[U]:y.image;z!==null?(se=z.max.x-z.min.x,de=z.max.y-z.min.y,ye=z.isBox3?z.max.z-z.min.z:1,Ee=z.min.x,Ie=z.min.y,Oe=z.isBox3?z.min.z:0):(se=nt.width,de=nt.height,ye=nt.depth||1,Ee=0,Ie=0,Oe=0),k!==null?(Te=k.x,Ye=k.y,et=k.z):(Te=0,Ye=0,et=0);const Et=ke.convert(I.format),Ke=ke.convert(I.type);let be;I.isData3DTexture?(T.setTexture3D(I,0),be=R.TEXTURE_3D):I.isDataArrayTexture||I.isCompressedArrayTexture?(T.setTexture2DArray(I,0),be=R.TEXTURE_2D_ARRAY):(T.setTexture2D(I,0),be=R.TEXTURE_2D),R.pixelStorei(R.UNPACK_FLIP_Y_WEBGL,I.flipY),R.pixelStorei(R.UNPACK_PREMULTIPLY_ALPHA_WEBGL,I.premultiplyAlpha),R.pixelStorei(R.UNPACK_ALIGNMENT,I.unpackAlignment);const cn=R.getParameter(R.UNPACK_ROW_LENGTH),$e=R.getParameter(R.UNPACK_IMAGE_HEIGHT),Wt=R.getParameter(R.UNPACK_SKIP_PIXELS),ui=R.getParameter(R.UNPACK_SKIP_ROWS),Dt=R.getParameter(R.UNPACK_SKIP_IMAGES);R.pixelStorei(R.UNPACK_ROW_LENGTH,nt.width),R.pixelStorei(R.UNPACK_IMAGE_HEIGHT,nt.height),R.pixelStorei(R.UNPACK_SKIP_PIXELS,Ee),R.pixelStorei(R.UNPACK_SKIP_ROWS,Ie),R.pixelStorei(R.UNPACK_SKIP_IMAGES,Oe);const $i=y.isDataArrayTexture||y.isData3DTexture,it=I.isDataArrayTexture||I.isData3DTexture;if(y.isRenderTargetTexture||y.isDepthTexture){const tn=Se.get(y),Zi=Se.get(I),Nt=Se.get(tn.__renderTarget),An=Se.get(Zi.__renderTarget);ge.bindFramebuffer(R.READ_FRAMEBUFFER,Nt.__webglFramebuffer),ge.bindFramebuffer(R.DRAW_FRAMEBUFFER,An.__webglFramebuffer);for(let bn=0;bn<ye;bn++)$i&&R.framebufferTextureLayer(R.READ_FRAMEBUFFER,R.COLOR_ATTACHMENT0,Se.get(y).__webglTexture,U,Oe+bn),y.isDepthTexture?(it&&R.framebufferTextureLayer(R.DRAW_FRAMEBUFFER,R.COLOR_ATTACHMENT0,Se.get(I).__webglTexture,U,et+bn),R.blitFramebuffer(Ee,Ie,se,de,Te,Ye,se,de,R.DEPTH_BUFFER_BIT,R.NEAREST)):it?R.copyTexSubImage3D(be,U,Te,Ye,et+bn,Ee,Ie,se,de):R.copyTexSubImage2D(be,U,Te,Ye,et+bn,Ee,Ie,se,de);ge.bindFramebuffer(R.READ_FRAMEBUFFER,null),ge.bindFramebuffer(R.DRAW_FRAMEBUFFER,null)}else it?y.isDataTexture||y.isData3DTexture?R.texSubImage3D(be,U,Te,Ye,et,se,de,ye,Et,Ke,nt.data):I.isCompressedArrayTexture?R.compressedTexSubImage3D(be,U,Te,Ye,et,se,de,ye,Et,nt.data):R.texSubImage3D(be,U,Te,Ye,et,se,de,ye,Et,Ke,nt):y.isDataTexture?R.texSubImage2D(R.TEXTURE_2D,U,Te,Ye,se,de,Et,Ke,nt.data):y.isCompressedTexture?R.compressedTexSubImage2D(R.TEXTURE_2D,U,Te,Ye,nt.width,nt.height,Et,nt.data):R.texSubImage2D(R.TEXTURE_2D,U,Te,Ye,se,de,Et,Ke,nt);R.pixelStorei(R.UNPACK_ROW_LENGTH,cn),R.pixelStorei(R.UNPACK_IMAGE_HEIGHT,$e),R.pixelStorei(R.UNPACK_SKIP_PIXELS,Wt),R.pixelStorei(R.UNPACK_SKIP_ROWS,ui),R.pixelStorei(R.UNPACK_SKIP_IMAGES,Dt),U===0&&I.generateMipmaps&&R.generateMipmap(be),ge.unbindTexture()},this.copyTextureToTexture3D=function(y,I,z=null,k=null,U=0){return y.isTexture!==!0&&(ss("WebGLRenderer: copyTextureToTexture3D function signature has changed."),z=arguments[0]||null,k=arguments[1]||null,y=arguments[2],I=arguments[3],U=arguments[4]||0),ss('WebGLRenderer: copyTextureToTexture3D function has been deprecated. Use "copyTextureToTexture" instead.'),this.copyTextureToTexture(y,I,z,k,U)},this.initRenderTarget=function(y){Se.get(y).__webglFramebuffer===void 0&&T.setupRenderTarget(y)},this.initTexture=function(y){y.isCubeTexture?T.setTextureCube(y,0):y.isData3DTexture?T.setTexture3D(y,0):y.isDataArrayTexture||y.isCompressedArrayTexture?T.setTexture2DArray(y,0):T.setTexture2D(y,0),ge.unbindTexture()},this.resetState=function(){b=0,w=0,L=null,ge.reset(),Qe.reset()},typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}get coordinateSystem(){return gn}get outputColorSpace(){return this._outputColorSpace}set outputColorSpace(e){this._outputColorSpace=e;const t=this.getContext();t.drawingBufferColorspace=qe._getDrawingBufferColorSpace(e),t.unpackColorSpace=qe._getUnpackColorSpace()}}class Xs extends Ct{constructor(){super(),this.isScene=!0,this.type="Scene",this.background=null,this.environment=null,this.fog=null,this.backgroundBlurriness=0,this.backgroundIntensity=1,this.backgroundRotation=new yn,this.environmentIntensity=1,this.environmentRotation=new yn,this.overrideMaterial=null,typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}copy(e,t){return super.copy(e,t),e.background!==null&&(this.background=e.background.clone()),e.environment!==null&&(this.environment=e.environment.clone()),e.fog!==null&&(this.fog=e.fog.clone()),this.backgroundBlurriness=e.backgroundBlurriness,this.backgroundIntensity=e.backgroundIntensity,this.backgroundRotation.copy(e.backgroundRotation),this.environmentIntensity=e.environmentIntensity,this.environmentRotation.copy(e.environmentRotation),e.overrideMaterial!==null&&(this.overrideMaterial=e.overrideMaterial.clone()),this.matrixAutoUpdate=e.matrixAutoUpdate,this}toJSON(e){const t=super.toJSON(e);return this.fog!==null&&(t.object.fog=this.fog.toJSON()),this.backgroundBlurriness>0&&(t.object.backgroundBlurriness=this.backgroundBlurriness),this.backgroundIntensity!==1&&(t.object.backgroundIntensity=this.backgroundIntensity),t.object.backgroundRotation=this.backgroundRotation.toArray(),this.environmentIntensity!==1&&(t.object.environmentIntensity=this.environmentIntensity),t.object.environmentRotation=this.environmentRotation.toArray(),t}}class Gm extends Mt{constructor(e=null,t=1,i=1,s,r,a,o,l,c=ft,u=ft,d,f){super(null,a,o,l,c,u,s,r,d,f),this.isDataTexture=!0,this.image={data:e,width:t,height:i},this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}}class Hm extends xs{static get type(){return"PointsMaterial"}constructor(e){super(),this.isPointsMaterial=!0,this.color=new je(16777215),this.map=null,this.alphaMap=null,this.size=1,this.sizeAttenuation=!0,this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.alphaMap=e.alphaMap,this.size=e.size,this.sizeAttenuation=e.sizeAttenuation,this.fog=e.fog,this}}const dl=new rt,Ga=new Vl,qs=new dr,Ys=new N;class Vm extends Ct{constructor(e=new Qt,t=new Hm){super(),this.isPoints=!0,this.type="Points",this.geometry=e,this.material=t,this.updateMorphTargets()}copy(e,t){return super.copy(e,t),this.material=Array.isArray(e.material)?e.material.slice():e.material,this.geometry=e.geometry,this}raycast(e,t){const i=this.geometry,s=this.matrixWorld,r=e.params.Points.threshold,a=i.drawRange;if(i.boundingSphere===null&&i.computeBoundingSphere(),qs.copy(i.boundingSphere),qs.applyMatrix4(s),qs.radius+=r,e.ray.intersectsSphere(qs)===!1)return;dl.copy(s).invert(),Ga.copy(e.ray).applyMatrix4(dl);const o=r/((this.scale.x+this.scale.y+this.scale.z)/3),l=o*o,c=i.index,d=i.attributes.position;if(c!==null){const f=Math.max(0,a.start),m=Math.min(c.count,a.start+a.count);for(let g=f,_=m;g<_;g++){const p=c.getX(g);Ys.fromBufferAttribute(d,p),pl(Ys,p,l,s,e,t,this)}}else{const f=Math.max(0,a.start),m=Math.min(d.count,a.start+a.count);for(let g=f,_=m;g<_;g++)Ys.fromBufferAttribute(d,g),pl(Ys,g,l,s,e,t,this)}}updateMorphTargets(){const t=this.geometry.morphAttributes,i=Object.keys(t);if(i.length>0){const s=t[i[0]];if(s!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let r=0,a=s.length;r<a;r++){const o=s[r].name||String(r);this.morphTargetInfluences.push(0),this.morphTargetDictionary[o]=r}}}}}function pl(n,e,t,i,s,r,a){const o=Ga.distanceSqToPoint(n);if(o<t){const l=new N;Ga.closestPointToPoint(n,l),l.applyMatrix4(i);const c=s.ray.origin.distanceTo(l);if(c<s.near||c>s.far)return;r.push({distance:c,distanceToRay:Math.sqrt(o),point:l,index:e,face:null,faceIndex:null,barycoord:null,object:a})}}class Wm extends Mt{constructor(e,t,i,s,r,a,o,l,c){super(e,t,i,s,r,a,o,l,c),this.isCanvasTexture=!0,this.needsUpdate=!0}}typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("register",{detail:{revision:Ya}}));typeof window<"u"&&(window.__THREE__?console.warn("WARNING: Multiple instances of Three.js being imported."):window.__THREE__=Ya);const En=48,ni=.965,wi=.305,as=.925,tr=0,Xm=1,ml=2,os=3,Ha=4,Zt=0,qm=1,Ym=2,Km=3,$m=4;function to(n){const e=n.length,t=n.map(a=>a[0]),i=n.map(a=>a[1]),s=[];for(let a=0;a<e-1;a++)s.push((i[a+1]-i[a])/(t[a+1]-t[a]));const r=[s[0]];for(let a=1;a<e-1;a++)r.push(s[a-1]*s[a]<=0?0:(s[a-1]+s[a])/2);r.push(s[e-2]);for(let a=0;a<e-1;a++){if(s[a]===0){r[a]=0,r[a+1]=0;continue}const o=r[a]/s[a],l=r[a+1]/s[a],c=o*o+l*l;if(c>9){const u=3/Math.sqrt(c);r[a]=u*o*s[a],r[a+1]=u*l*s[a]}}return a=>{if(a<=t[0])return i[0];if(a>=t[e-1])return i[e-1];let o=0;for(;o<e-2&&a>t[o+1];)o++;const l=t[o+1]-t[o],c=(a-t[o])/l,u=c*c,d=u*c;return(2*d-3*u+1)*i[o]+(d-2*u+c)*l*r[o]+(-2*d+3*u)*i[o+1]+(d-u)*l*r[o+1]}}const Zm=[[0,0,0,0,-.012],[.01,.024,.013,.025,-.012],[.035,.046,.025,.049,-.012],[.08,.066,.038,.071,-.011],[.15,.087,.055,.097,-.01],[.23,.107,.074,.118,-.008],[.31,.123,.094,.13,-.005],[.39,.129,.109,.126,-.001],[.47,.125,.114,.109,.004],[.55,.111,.112,.089,.009],[.62,.091,.104,.073,.012],[.69,.065,.086,.058,.013],[.77,.042,.064,.046,.011],[.84,.025,.044,.033,.008],[.9,.015,.028,.022,.005],[.94,.009,.015,.013,.002],[ni,0,0,0,.001]],mr=n=>to(Zm.map(e=>[e[0],e[n]])),ac=mr(1),Va=mr(2),no=mr(3),vn=mr(4),jm=to([[0,2.7],[.2,2.6],[.45,2.1],[.65,2],[.8,1.65],[.95,1.45]]),Jm=to([[0,2.3],[.3,2.2],[.5,2],[.75,1.8],[.95,1.55]]),nr=.285,oc=n=>{const e=Math.min(1,n/nr);return vn(n)-no(n)*(.08+.34*e**1.5)},lc=.292,Qm=()=>oc(lc)+.017,Ii=(n,e,t)=>{const i=Math.max(0,Math.min(1,(t-n)/(e-n)));return i*i*(3-2*i)},gl=(n,e)=>Math.sign(n)*Math.abs(n)**e,Wa=n=>.016*Math.exp(-(((n-.61)/.065)**2)),e0=(()=>{const n=[];for(let e=.03;e<.235;e+=.026)n.push([e,0]);for(let e=.045;e<.215;e+=.03)n.push([e,.45],[e,-.45]);for(let e=.02;e<.12;e+=.028)n.push([e,.82],[e,-.82]);return n})();function t0(n,e){let t=0;for(const[i,s]of e0){const r=Math.hypot((n-i)/.0085,(e-s)/.16);r<1&&(t=Math.max(t,(1-r*r)**2))}return t}const Ai=()=>({pos:[],info:[],spine:[],idx:[]}),xn=n=>Math.max(0,Math.min(1,n))*(En-1);function gr(n,e,t,i){for(let s=0;s<t-1;s++)for(let r=0;r<i;r++){const a=(r+1)%i,o=e+s*i+r,l=e+s*i+a,c=e+(s+1)*i+r,u=e+(s+1)*i+a;n.idx.push(o,c,l,l,c,u)}}function ki(n,e,t,i,s){for(let r=0;r<t;r++){const a=e+r,o=e+(r+1)%t;s?n.idx.push(a,o,i):n.idx.push(o,a,i)}}function n0(n){for(let r=0;r<116;r++){const a=(r+1)/117,o=ni*(.3*a+.7*(.5-.5*Math.cos(Math.PI*a))),l=ac(o),c=Va(o)+Wa(o),u=no(o),d=vn(o),f=jm(o),m=Jm(o),g=oc(o);for(let _=0;_<56;_++){const p=2*Math.PI*_/56,h=Math.cos(p),A=Math.sin(p),S=A>=0?f:m;let M=l*gl(h,2/S),P=d+(A>=0?c:u)*gl(A,2/S),b=Zt;if(o<nr+.01&&Math.abs(h)>.25){const E=Math.exp(-(((P-g)/.0058)**2))*Ii(.004,.03,o)*(1-Ii(nr-.02,nr+.01,o)),x=Math.abs(h);M-=Math.sign(M)*.0075*E*x,P-=.0024*E,E>.38&&(b=qm)}if(o<.25){const E=l>1e-4?M/l:0,x=A>-.1?t0(o,E):0;if(x>0){const C=Math.hypot(M,P-d)||1;M+=M/C*.0042*x,P+=(P-d)/C*.0042*x,x>.3&&b===Zt&&(b=$m)}}Math.abs(h)>.35&&Math.hypot((o-lc)*.9,P-Qm())<.0062&&(b=Ym),P<d-u*.42&&o>.025&&o<.5&&(b=Km);const w=A*(A>=0?c:u)/Math.max(1e-4,Math.hypot(h*l,A*(A>=0?c:u))),L=.12+.88*Ii(-.62,.05,w);n.pos.push(M,P,o-.5),n.info.push(tr,b,L,o/ni),n.spine.push(xn(o))}}gr(n,0,116,56);const i=n.pos.length/3;n.pos.push(0,vn(0),-.5),n.info.push(tr,Zt,.75,0),n.spine.push(0);const s=n.pos.length/3;n.pos.push(0,vn(ni),ni-.5),n.info.push(tr,Zt,.9,1),n.spine.push(xn(ni)),ki(n,0,56,i,!0),ki(n,6440,56,s,!1)}const io=n=>1.32*Math.sqrt(Math.max(0,n))*(1-n)**.85/.6;function i0(){const i=[];for(let s=0;s<30;s++){const a=-.05+1.05*(1-(1-s/29)**1.35),o=Math.max(0,a);let l=.066*(1-.5*o**1.2);o>.8&&(l*=Math.sqrt(Math.max(0,1-((o-.8)/.2)**2))),l=Math.max(l,.0015);const c=.0042*Math.max(0,Math.sin(o*Math.PI*11))**2*Ii(.18,.32,o)*(1-Ii(.82,.95,o)),u=-.42*l+.05*o**1.6-c,d=.19*l+.0015,f=-.022*o**2;for(let m=0;m<14;m++){const g=2*Math.PI*m/14,_=.5-.5*Math.cos(g),p=Math.sin(g)>=0?1:-1,h=.06*d*Math.sin(Math.PI*_);i.push(a*.33,f+h+p*.5*d*io(_),u+(l+c)*_)}}return{pos:i,rings:30,around:14}}function _l(n,e,t,i){const s=n.pos.length/3,{pos:r,rings:a,around:o}=i;for(let u=0;u<r.length;u+=3){const d=r[u]/.33;n.pos.push(t?-r[u]:r[u],r[u+1],r[u+2]);const f=r[u+1]<0?0:1;n.info.push(e,Zt,.3+.22*f,.42+.3*Math.max(0,d)),n.spine.push(xn(wi))}const l=Ai();gr(l,0,a,o);const c=n.pos.length/3;n.pos.push(t?-.33:.33,-.022,.05+.002),n.info.push(e,Zt,.4,.72),n.spine.push(xn(wi)),ki(l,(a-1)*o,o,c-s,!1);for(let u=0;u<l.idx.length;u+=3){const d=l.idx[u]+s,f=l.idx[u+1]+s,m=l.idx[u+2]+s;t?n.idx.push(d,m,f):n.idx.push(d,f,m)}}function s0(n){for(let a=0;a<49;a++){const o=a/48*2-1,l=Math.sign(o)*Math.abs(o)**.85,c=Math.abs(l),u=-.012+.098*c**1.35;let d=.074*Math.max(0,1-c**2.5)**.55+.0012;d-=.024*Math.max(0,1-c/.085)**1.3,d+=.0022*Math.sin(c*46)*Ii(.25,.4,c)*(1-c);const f=.017*(1-c)**1.25+.0014;for(let m=0;m<12;m++){const g=2*Math.PI*m/12,_=.5-.5*Math.cos(g),p=Math.sin(g)>=0?1:-1;n.pos.push(l*.168,p*.5*f*io(_),u+d*_),n.info.push(os,Zt,p>0?.92:.46,.97+.03*c),n.spine.push(xn(as))}}gr(n,0,49,12);const s=n.pos.length/3;n.pos.push(-.168-.001,0,.087),n.info.push(os,Zt,.8,1),n.spine.push(xn(as));const r=n.pos.length/3;n.pos.push(.168+.001,0,.087),n.info.push(os,Zt,.8,1),n.spine.push(xn(as)),ki(n,0,12,s,!1),ki(n,576,12,r,!0)}function r0(n){for(let r=0;r<10;r++){const a=r/9,o=.072*(1-a)**.75+.006,l=.615-.5+.048*a**1.2,c=.011*(1-a)+.0018;for(let u=0;u<10;u++){const d=2*Math.PI*u/10,f=.5-.5*Math.cos(d),m=Math.sin(d)>=0?1:-1,g=l+o*f,_=g+.5,h=vn(_)+Va(_)+Wa(_)-.008+a*.043*(1-.35*f)+a*a*.005;n.pos.push(m*.5*c*io(f),h,g),n.info.push(Ha,Zt,.95,Math.min(1,_/ni)),n.spine.push(xn(_))}}gr(n,0,10,10);const i=n.pos.length/3,s=.615+.048+.003;n.pos.push(0,vn(s)+Va(s)+Wa(s)-.008+.0485,s-.5),n.info.push(Ha,Zt,.95,s),n.spine.push(xn(s)),ki(n,90,10,i,!1)}function cc(n,e,t){const i=new Float32Array(t*3);for(let s=0;s<e.length;s+=3){const r=e[s]*3,a=e[s+1]*3,o=e[s+2]*3,l=n[a]-n[r],c=n[a+1]-n[r+1],u=n[a+2]-n[r+2],d=n[o]-n[r],f=n[o+1]-n[r+1],m=n[o+2]-n[r+2],g=c*m-u*f,_=u*d-l*m,p=l*f-c*d;for(const h of[r,a,o])i[h]+=g,i[h+1]+=_,i[h+2]+=p}for(let s=0;s<i.length;s+=3){const r=Math.hypot(i[s],i[s+1],i[s+2])||1;i[s]/=r,i[s+1]/=r,i[s+2]/=r}return i}function ns(n,e){const t=n.pos.length/3,i=cc(n.pos,n.idx,t);let s=0;for(let r=0;r<t;r++){const[a,o,l]=e(n.pos[r*3],n.pos[r*3+1],n.pos[r*3+2]);s+=i[r*3]*(n.pos[r*3]-a)+i[r*3+1]*(n.pos[r*3+1]-o)+i[r*3+2]*(n.pos[r*3+2]-l)}if(s<0)for(let r=0;r<n.idx.length;r+=3){const a=n.idx[r+1];n.idx[r+1]=n.idx[r+2],n.idx[r+2]=a}}const is=[ac(wi)*.74,vn(wi)-no(wi)*.5,wi-.5],vl=[0,vn(as),as-.5];let Ks=null;function uc(){if(Ks)return Ks;const n=Ai();n0(n),ns(n,(S,M,P)=>[0,vn(P+.5),P]);const e=Ai();r0(e),ns(e,(S,M,P)=>[0,M,P]);const t=i0(),i=Ai();_l(i,ml,!1,t),ns(i,(S,M,P)=>[S,-.022*(S/.33)**2,P]);const s=Ai();_l(s,Xm,!0,t),ns(s,(S,M,P)=>[S,-.022*(S/.33)**2,P]);const r=Ai();s0(r),ns(r,(S,M,P)=>[S,0,P]);const a=[n,e,s,i,r],o=a.reduce((S,M)=>S+M.pos.length/3,0),l=a.reduce((S,M)=>S+M.idx.length/3,0),c=new Float32Array(o*3),u=new Float32Array(o*3),d=new Float32Array(o),f=new Float32Array(o*4),m=new Float32Array(o*3),g=new Uint32Array(l*3),_=[],p=[-is[0],is[1],is[2]];let h=0,A=0;for(const S of a){const M=S.pos.length/3,P=cc(S.pos,S.idx,M);for(let b=0;b<M;b++){const w=(h+b)*3,L=S.info[b*4],E=S.pos[b*3],x=S.pos[b*3+1],C=S.pos[b*3+2];if(u.set([P[b*3],P[b*3+1],P[b*3+2]],w),d[h+b]=S.spine[b],f.set(S.info.slice(b*4,b*4+4),(h+b)*4),L===tr||L===Ha){const V=S.spine[b]/(En-1)-.5;c.set([E,x,C-V],w),m.set([E,x,C],w)}else{c.set([E,x,C],w);const V=L===os?vl:L===ml?is:p;m.set([V[0]+E,V[1]+x,V[2]+C],w)}}_.push({part:S.info[0],start:A/3,count:S.idx.length/3});for(let b=0;b<S.idx.length;b++)g[A+b]=S.idx[b]+h;h+=M,A+=S.idx.length}return Ks={offset:c,normal:u,spine:d,info:f,rest:m,index:g,vertexCount:o,pivots:{flipperL:p,flipperR:is,fluke:vl},parts:_},Ks}function hc(n){let e=n>>>0;return()=>{e=e+1831565813>>>0;let t=e;return t=Math.imul(t^t>>>15,t|1),t^=t+Math.imul(t^t>>>7,t|61),((t^t>>>14)>>>0)/4294967296}}function xl(n,e,t){const i=uc(),s=hc(e),r=[],a=[];let o=0;for(let c=0;c<i.index.length;c+=3){const u=i.index[c];if(t&&!t(i.info,u))continue;const d=i.index[c+1],f=i.index[c+2],m=i.rest,g=[m[d*3]-m[u*3],m[d*3+1]-m[u*3+1],m[d*3+2]-m[u*3+2]],_=[m[f*3]-m[u*3],m[f*3+1]-m[u*3+1],m[f*3+2]-m[u*3+2]],p=.5*Math.hypot(g[1]*_[2]-g[2]*_[1],g[2]*_[0]-g[0]*_[2],g[0]*_[1]-g[1]*_[0]);o+=p,r.push(c),a.push(o)}const l={count:n,offset:new Float32Array(n*3),normal:new Float32Array(n*3),spine:new Float32Array(n),info:new Float32Array(n*4)};for(let c=0;c<n;c++){const u=s()*o;let d=0,f=a.length-1;for(;d<f;){const S=d+f>>1;a[S]<u?d=S+1:f=S}const m=r[d];let g=s(),_=s();g+_>1&&(g=1-g,_=1-_);const p=1-g-_,h=[i.index[m],i.index[m+1],i.index[m+2]],A=[p,g,_];for(let S=0;S<3;S++)l.offset[c*3+S]=A[0]*i.offset[h[0]*3+S]+A[1]*i.offset[h[1]*3+S]+A[2]*i.offset[h[2]*3+S],l.normal[c*3+S]=A[0]*i.normal[h[0]*3+S]+A[1]*i.normal[h[1]*3+S]+A[2]*i.normal[h[2]*3+S];l.spine[c]=A[0]*i.spine[h[0]]+A[1]*i.spine[h[1]]+A[2]*i.spine[h[2]];for(let S=0;S<4;S++)l.info[c*4+S]=i.info[h[0]*4+S];l.info[c*4+3]=A[0]*i.info[h[0]*4+3]+A[1]*i.info[h[1]*4+3]+A[2]*i.info[h[2]*4+3]}return l}const ai=(n,e)=>[n[0]+e[0],n[1]+e[1],n[2]+e[2]],Ht=(n,e)=>[n[0]-e[0],n[1]-e[1],n[2]-e[2]],ot=(n,e)=>[n[0]*e,n[1]*e,n[2]*e],Pt=(n,e)=>n[0]*e[0]+n[1]*e[1]+n[2]*e[2],zn=(n,e)=>[n[1]*e[2]-n[2]*e[1],n[2]*e[0]-n[0]*e[2],n[0]*e[1]-n[1]*e[0]],on=n=>Math.hypot(n[0],n[1],n[2]),en=n=>{const e=on(n)||1;return[n[0]/e,n[1]/e,n[2]/e]},a0=(n,e,t)=>[n[0]+(e[0]-n[0])*t,n[1]+(e[1]-n[1])*t,n[2]+(e[2]-n[2])*t],Hn=(n,e)=>{const t=en(n),i=Math.sin(e/2);return[t[0]*i,t[1]*i,t[2]*i,Math.cos(e/2)]},Gi=(n,e)=>[n[3]*e[0]+n[0]*e[3]+n[1]*e[2]-n[2]*e[1],n[3]*e[1]-n[0]*e[2]+n[1]*e[3]+n[2]*e[0],n[3]*e[2]+n[0]*e[1]-n[1]*e[0]+n[2]*e[3],n[3]*e[3]-n[0]*e[0]-n[1]*e[1]-n[2]*e[2]],Ri=n=>{const e=Math.hypot(n[0],n[1],n[2],n[3])||1;return[n[0]/e,n[1]/e,n[2]/e,n[3]/e]},o0=n=>[-n[0],-n[1],-n[2],n[3]],Tn=(n,e)=>{const[t,i,s,r]=n,a=2*(i*e[2]-s*e[1]),o=2*(s*e[0]-t*e[2]),l=2*(t*e[1]-i*e[0]);return[e[0]+r*a+(i*l-s*o),e[1]+r*o+(s*a-t*l),e[2]+r*l+(t*o-i*a)]},l0=(n,e,t)=>{let i=n[0]*e[0]+n[1]*e[1]+n[2]*e[2]+n[3]*e[3],s=e;if(i<0&&(i=-i,s=[-e[0],-e[1],-e[2],-e[3]]),i>.9995)return Ri([n[0]+(s[0]-n[0])*t,n[1]+(s[1]-n[1])*t,n[2]+(s[2]-n[2])*t,n[3]+(s[3]-n[3])*t]);const r=Math.acos(i),a=Math.sin(r),o=Math.sin((1-t)*r)/a,l=Math.sin(t*r)/a;return[n[0]*o+s[0]*l,n[1]*o+s[1]*l,n[2]*o+s[2]*l,n[3]*o+s[3]*l]},c0=(n,e,t)=>{const i=n[0],s=n[1],r=n[2],a=e[0],o=e[1],l=e[2],c=t[0],u=t[1],d=t[2],f=i+o+d;if(f>0){const g=Math.sqrt(f+1)*2;return Ri([(l-u)/g,(c-r)/g,(s-a)/g,.25*g])}if(i>o&&i>d){const g=Math.sqrt(1+i-o-d)*2;return Ri([.25*g,(a+s)/g,(c+r)/g,(l-u)/g])}if(o>d){const g=Math.sqrt(1+o-i-d)*2;return Ri([(a+s)/g,.25*g,(u+l)/g,(c-r)/g])}const m=Math.sqrt(1+d-i-o)*2;return Ri([(c+r)/m,(u+l)/m,.25*m,(s-a)/m])},Wn=[1,0,0],jt=[0,1,0],fs=[0,0,1];function ar(n,e,t=0){const i=en(n);let s=Ht(e,ot(i,Pt(e,i)));on(s)<1e-5&&(s=Ht(fs,ot(i,Pt(fs,i))),on(s)<1e-5&&(s=Ht(Wn,ot(i,Pt(Wn,i))))),s=en(s);const r=zn(i,s),a=c0(r,s,ot(i,-1));return t===0?a:Gi(Hn(i,t),a)}function fc(n){const e=Math.max(0,Math.min(1.6,n.effort)),t=n.stride??.95,i=n.distance/t*Math.PI*2+(n.phase??0),s=.16+.84*e,r=n.turn??0,a=n.climb??0,o=n.bank??0,l=Math.sin(i+.9),c=Math.cos(i+.9),u=Math.max(-.5,Math.min(.5,r*.35+o*.25)),d=1-Math.min(1,e),f={sweep:.05-.12*d,dihedral:.1*d-.04*a,twist:-.06*a},m=.13*s*l,g=.06*s*c,_=.09*s*c;return{stroke:i,amplitude:s,bendYaw:r,bendPitch:a,flipperL:{sweep:f.sweep-u*.4+g,dihedral:f.dihedral+u+m,twist:f.twist+_},flipperR:{sweep:f.sweep+u*.4+g,dihedral:f.dihedral-u+m,twist:f.twist+_},fluke:.5*s*Math.cos(i-2*Math.PI*.9-.98),flukeFlex:.09*s*Math.sin(i-2*Math.PI*.95-.98)}}const Kr=.38,Ml=2*Math.PI/1.25,u0=n=>.8*(.012-.06*n+.09*n*n+.075*n*n*n),h0=n=>.8*(-.06+.18*n+.225*n*n);function f0(n,e){const t=n.stroke-Ml*e;return n.amplitude*Math.atan(h0(e)*Math.sin(t)-Ml*u0(e)*Math.cos(t))}function dc(n,e,t,i=0){const s=En,r=1/(s-1),a=Math.round(Kr*(s-1)),o=[];for(let c=0;c<s;c++){const u=c*r,d=n.bendYaw*(u-Kr),f=-n.bendPitch*(u-Kr)+f0(n,u),m=Gi(Hn(jt,d),Hn(Wn,f));t.set(m,i+c*4),o.push(Tn(m,fs))}const l=new Array(s);l[a]=[0,0,a*r-.5];for(let c=a+1;c<s;c++)l[c]=ai(l[c-1],ot(ai(o[c-1],o[c]),r/2));for(let c=a-1;c>=0;c--)l[c]=Ht(l[c+1],ot(ai(o[c+1],o[c]),r/2));for(let c=0;c<s;c++)e.set([l[c][0],l[c][1],l[c][2],c*r],i+c*4)}const $r={sweep:.74,dihedral:.3,twist:.12};function or(n,e){const t=$r.sweep+n.sweep,i=$r.dihedral-n.dihedral,s=$r.twist+n.twist,r=Gi(Gi(Hn(jt,-t),Hn(fs,-i)),Hn(Wn,-s));return e?[r[0],-r[1],-r[2],r[3]]:r}const pc=n=>Hn(Wn,n.fluke),ls=3;function d0(n,e,t,i=0){const s=En*4,r=t*ls*s,a=e.subarray(r,r+s),o=e.subarray(r+s,r+2*s);dc(n,a,o,0);const l=e.subarray(r+2*s,r+3*s);l.set(or(n.flipperL,!0),0),l.set(or(n.flipperR,!1),4),l.set(pc(n),8),l.set([n.flukeFlex,i,0,0],12)}function p0(n){const e=new Float32Array(En*4),t=new Float32Array(En*4);return dc(n,e,t),{p:e,q:t,flipL:or(n.flipperL,!0),flipR:or(n.flipperR,!1),fluke:pc(n),flukeFlex:n.flukeFlex}}const m0=64;function g0(n,e){let t=0,i=n.path(0);const s=Math.max(1,Math.ceil(m0*Math.abs(e)));for(let r=1;r<=s;r++){const a=n.path(e*r/s);t+=on(Ht(a,i)),i=a}return t/n.length}function _0(n,e){const t=n,i=.001,s=e.path(t-i),r=e.path(t),a=e.path(t+i),o=ot(Ht(a,s),1/(2*i)),l=ot(ai(Ht(a,ot(r,2)),s),1/(i*i)),c=Math.max(1e-6,on(o)),u=ot(o,1/c),d=e.up?e.up(t):jt,f=ar(u,d,0),m=Tn(f,Wn),g=Tn(f,jt),_=Ht(l,ot(u,Pt(l,u))),p=ot(_,1/(c*c)),h=Pt(p,m)*e.length,A=Pt(p,g)*e.length,S=e.maxBank??.55,M=Math.max(-S,Math.min(S,h*(e.bankGain??.55))),P=ar(u,d,M),b=fc({distance:g0(e,t),effort:e.effort?e.effort(t):1,turn:h,climb:A,bank:M,phase:e.phase,stride:e.stride});return{position:r,quaternion:P,scale:e.length,articulation:b,bank:M}}const yt={ink:[24,60,89],inkFar:[44,84,116],contrast:1.45,farFade:.12,gamma:1.3,tone:.18},v0={mode:"shape",split:0,cellW:7,cellH:12,ink:yt.ink,inkFar:yt.inkFar,opacity:1,contrast:yt.contrast,farFade:yt.farFade,invert:!1,gamma:yt.gamma,tone:yt.tone},ir=[" ",".","·",":","-","=","+","*","x","#","%","@","_","/","\\","|","(",")","o","~",",","'","`",";",'"',"^","°","•"],x0=[".","·",":",";","+","*","x","#"],ht=n=>ir.indexOf(n),Fn=8;function M0(n,e,t='"JetBrains Mono", monospace'){const i=Math.ceil(ir.length/Fn),s=document.createElement("canvas");s.width=n*Fn,s.height=e*i;const r=s.getContext("2d",{willReadFrequently:!0}),a=Math.max(6,Math.min(n/.6,e*.92));r.font=`500 ${a.toFixed(2)}px ${t}`,r.textAlign="center",r.textBaseline="middle",r.fillStyle="#fff",ir.forEach((f,m)=>{const g=m%Fn*n+n/2,_=Math.floor(m/Fn)*e+e/2+a*.04;r.fillText(f,g,_)});const o=r.getImageData(0,0,s.width,s.height).data,l=ir.map((f,m)=>{const g=m%Fn*n,_=Math.floor(m/Fn)*e;let p=0;for(let h=0;h<e;h++)for(let A=0;A<n;A++)p+=o[((_+h)*s.width+g+A)*4+3];return p/(255*n*e)}),c=x0.map(f=>({i:ht(f),c:l[ht(f)]})).sort((f,m)=>f.c-m.c),u=[];let d=-1;for(const f of c)f.c-d<.012||(u.push(f.i),d=f.c);return{canvas:s,tileW:n,tileH:e,ramp:u,coverage:l}}const mc=`
uniform highp sampler2D uSkin;
uniform vec3 uPivotL;
uniform vec3 uPivotR;
uniform vec3 uPivotF;
const int SPINE_N = ${En};
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
`,S0=`
${mc}
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
`,y0=`
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
`,Zr=`
void main() { gl_Position = vec4(position.xy, 0.0, 1.0); }
`,E0=`
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
`,T0=`
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
`,A0=`
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
`,jr=(n,e)=>n.set(e[0]/255,e[1]/255,e[2]/255);class gc{constructor(e,t={}){Xe(this,"renderer");Xe(this,"camera",new Ut(30,1,.1,200));Xe(this,"underlay",new Xs);Xe(this,"overlay",new Xs);Xe(this,"style",{...v0});Xe(this,"skinData");Xe(this,"skinTexture");Xe(this,"pivotUniforms");Xe(this,"lost",!1);Xe(this,"onContextLost",null);Xe(this,"scene",new Xs);Xe(this,"quadCamera",new ec(-1,1,1,-1,0,1));Xe(this,"whales",[]);Xe(this,"gbuffer");Xe(this,"cells");Xe(this,"cellMaterial");Xe(this,"compositeMaterial");Xe(this,"rawMaterial");Xe(this,"quad");Xe(this,"quadScene",new Xs);Xe(this,"atlas",null);Xe(this,"atlasTexture",null);Xe(this,"atlasKey","");Xe(this,"cssW",1);Xe(this,"cssH",1);Xe(this,"dpr",1);Xe(this,"gscale");Xe(this,"occluder",{center:new N,radius:0,amount:0});Xe(this,"light",new N(-.42,.8,.42).normalize());Xe(this,"tmp",new N);Xe(this,"onLost",e=>{var t;e.preventDefault(),this.lost=!0,(t=this.onContextLost)==null||t.call(this)});Xe(this,"onRestored",()=>{this.lost=!1,this.atlasKey="",this.skinTexture.needsUpdate=!0});Xe(this,"canvas");this.canvas=e;const i=t.maxWhales??2;this.gscale=t.gbufferScale??.75,this.renderer=new km({canvas:e,alpha:!0,premultipliedAlpha:!0,antialias:!1,powerPreference:"high-performance"}),this.renderer.setClearColor(0,0),this.renderer.autoClear=!1,e.addEventListener("webglcontextlost",this.onLost),e.addEventListener("webglcontextrestored",this.onRestored),this.skinData=new Float32Array(En*4*ls*i),this.skinTexture=new Gm(this.skinData,En,ls*i,kt,an),this.skinTexture.minFilter=ft,this.skinTexture.magFilter=ft,this.skinTexture.needsUpdate=!0;const s=uc(),r=new Qt;r.setAttribute("position",new ut(s.offset,3)),r.setAttribute("normal",new ut(s.normal,3)),r.setAttribute("aSpine",new ut(s.spine,1)),r.setAttribute("aInfo",new ut(s.info,4)),r.setIndex(new ut(s.index,1)),this.pivotUniforms={uPivotL:{value:new N(...s.pivots.flipperL)},uPivotR:{value:new N(...s.pivots.flipperR)},uPivotF:{value:new N(...s.pivots.fluke)}};for(let a=0;a<i;a++){const o=new wt({glslVersion:Bn,vertexShader:S0,fragmentShader:y0,side:sn,uniforms:{uSkin:{value:this.skinTexture},...this.pivotUniforms,uSkinRow:{value:a*ls},uLight:{value:new N},uDepthRange:{value:new Ve(0,1)},uDissolve:{value:0},uOccluder:{value:new tt},uOcclusion:{value:0},uInvert:{value:0}}}),l=new Gt(r,o);l.frustumCulled=!1,l.visible=!1,this.scene.add(l),this.whales.push({mesh:l,material:o,state:null})}this.gbuffer=new Sn(1,1,{count:3,depthBuffer:!0,type:Jt});for(const a of this.gbuffer.textures)a.minFilter=zt,a.magFilter=zt,a.generateMipmaps=!1;this.cells=new Sn(1,1,{depthBuffer:!1,type:Jt}),this.cells.texture.minFilter=ft,this.cells.texture.magFilter=ft,this.cells.texture.generateMipmaps=!1,this.cellMaterial=new wt({glslVersion:Bn,vertexShader:Zr,fragmentShader:E0,depthTest:!1,depthWrite:!1,uniforms:{uInk:{value:null},uMask:{value:null},uCanvas:{value:new Ve},uCell:{value:new Ve},uTexel:{value:new Ve},uSplit:{value:0},uShape:{value:1},uRamp:{value:new Array(12).fill(0)},uRampN:{value:1},uGamma:{value:1},uTone:{value:0},uEdgeA:{value:new tt(ht("-"),ht("_"),ht("/"),ht("\\"))},uEdgeB:{value:new tt(ht("|"),ht("("),ht(")"),ht("o"))},uMarkG:{value:new tt(ht("="),ht("°"),ht("•"),ht(":"))},uToneG:{value:new tt(ht("·"),ht("+"),ht("x"),ht("#"))},uMarks:{value:null}}}),this.compositeMaterial=new wt({glslVersion:Bn,vertexShader:Zr,fragmentShader:T0,transparent:!0,premultipliedAlpha:!0,blending:cs,blendSrc:us,blendDst:li,depthTest:!1,depthWrite:!1,uniforms:{uCells:{value:this.cells.texture},uAtlas:{value:null},uCell:{value:new Ve},uTile:{value:new Ve},uAtlasCols:{value:Fn},uCanvasH:{value:1},uInk:{value:new N},uInkFar:{value:new N},uOpacity:{value:1},uContrast:{value:yt.contrast},uFarFade:{value:yt.farFade},uInvert:{value:0}}}),this.rawMaterial=new wt({glslVersion:Bn,vertexShader:Zr,fragmentShader:A0,transparent:!0,blending:cs,blendSrc:us,blendDst:li,depthTest:!1,depthWrite:!1,uniforms:{uInk:{value:null},uMask:{value:null},uCanvas:{value:new Ve},uInk3:{value:new N}}}),this.quad=new Gt(new Yi(2,2),this.cellMaterial),this.quad.frustumCulled=!1,this.quadScene.add(this.quad)}resize(e,t,i){this.cssW=Math.max(1,e),this.cssH=Math.max(1,t),this.dpr=i,this.renderer.setPixelRatio(i),this.renderer.setSize(this.cssW,this.cssH,!1),this.camera.aspect=this.cssW/this.cssH,this.camera.updateProjectionMatrix(),this.gbuffer.setSize(Math.max(1,Math.round(this.cssW*this.gscale)),Math.max(1,Math.round(this.cssH*this.gscale))),this.atlasKey=""}get size(){return{width:this.cssW,height:this.cssH,dpr:this.dpr}}setStyle(e){Object.assign(this.style,e)}setResolution(e){this.gscale=Math.max(.35,Math.min(.75,e)),this.gbuffer.setSize(Math.max(1,Math.round(this.cssW*this.gscale)),Math.max(1,Math.round(this.cssH*this.gscale)))}setWhale(e,t){const i=this.whales[e];i&&(i.state=t,i.mesh.visible=!!t&&t.visible,!(!t||!t.visible)&&(i.mesh.position.set(...t.position),i.mesh.quaternion.set(...t.quaternion),i.mesh.scale.setScalar(t.scale),d0(t.articulation,this.skinData,e,t.dissolve),i.material.uniforms.uDissolve.value=t.dissolve))}setOccluder(e,t,i){this.occluder.center.set(...e),this.occluder.radius=t,this.occluder.amount=i}ensureCells(){var c;const e=Math.max(2,Math.round(this.style.cellW*this.dpr)),t=Math.max(3,Math.round(this.style.cellH*this.dpr)),i=Math.round(this.cssW*this.dpr),s=Math.round(this.cssH*this.dpr),r=`${e}x${t}:${i}x${s}`;if(r===this.atlasKey)return{cw:e,ch:t,W:i,H:s};this.atlasKey=r,this.atlas=M0(e,t),(c=this.atlasTexture)==null||c.dispose(),this.atlasTexture=new Wm(this.atlas.canvas),this.atlasTexture.flipY=!1,this.atlasTexture.minFilter=ft,this.atlasTexture.magFilter=ft,this.atlasTexture.generateMipmaps=!1,this.cells.setSize(Math.ceil(i/e),Math.ceil(s/t));const a=this.atlas.ramp,o=this.cellMaterial.uniforms,l=new Array(12).fill(a[a.length-1]);return a.forEach((u,d)=>l[d]=u),o.uRamp.value=l,o.uRampN.value=Math.min(12,a.length),{cw:e,ch:t,W:i,H:s}}get glyphs(){var e,t;return this.ensureCells(),{texture:this.atlasTexture,tileW:((e=this.atlas)==null?void 0:e.tileW)??1,tileH:((t=this.atlas)==null?void 0:t.tileH)??1,cols:Fn}}invalidateAtlas(){this.atlasKey=""}render(e=!0){if(this.lost)return;const t=this.renderer,{cw:i,ch:s,W:r,H:a}=this.ensureCells();this.skinTexture.needsUpdate=!0,this.camera.updateMatrixWorld();const o=this.camera.matrixWorldInverse;let l=1/0,c=-1/0;for(const p of this.whales){if(!p.mesh.visible||!p.state)continue;const h=-this.tmp.set(...p.state.position).applyMatrix4(o).z;l=Math.min(l,h-p.state.scale*.7),c=Math.max(c,h+p.state.scale*.7)}const u=this.light,d=this.tmp.copy(this.occluder.center).applyMatrix4(o);for(const p of this.whales){const h=p.material.uniforms;h.uLight.value.copy(u),h.uDepthRange.value.set(Number.isFinite(l)?l:0,Number.isFinite(c)?c:1),h.uOccluder.value.set(d.x,d.y,d.z,this.occluder.radius),h.uOcclusion.value=this.occluder.amount,h.uInvert.value=this.style.invert?1:0}const f=this.whales.some(p=>p.mesh.visible);t.setRenderTarget(this.gbuffer),t.setClearColor(0,0),t.clear(!0,!0,!0),t.render(this.scene,this.camera);const[m,g,_]=this.gbuffer.textures;if(t.setRenderTarget(null),t.setClearColor(0,0),t.clear(!0,!0,!0),e&&this.underlay.children.length&&t.render(this.underlay,this.camera),f)if(this.style.mode==="raw"){const p=this.rawMaterial.uniforms;p.uInk.value=m,p.uMask.value=g,p.uCanvas.value.set(r,a),jr(p.uInk3.value,this.style.ink),this.quad.material=this.rawMaterial,t.render(this.quadScene,this.quadCamera)}else{const p=this.cellMaterial.uniforms;p.uInk.value=m,p.uMask.value=g,p.uMarks.value=_,p.uCanvas.value.set(r,a),p.uCell.value.set(i,s),p.uTexel.value.set(1/this.gbuffer.width,1/this.gbuffer.height),p.uShape.value=this.style.mode==="shape"?1:0,p.uSplit.value=this.style.split,p.uGamma.value=this.style.gamma,p.uTone.value=this.style.tone,this.quad.material=this.cellMaterial,t.setRenderTarget(this.cells),t.clear(!0,!1,!1),t.render(this.quadScene,this.quadCamera),t.setRenderTarget(null);const h=this.compositeMaterial.uniforms;h.uAtlas.value=this.atlasTexture,h.uCell.value.set(i,s),h.uTile.value.set(i,s),h.uCanvasH.value=a,h.uInvert.value=this.style.invert?1:0,jr(h.uInk.value,this.style.ink),jr(h.uInkFar.value,this.style.inkFar),h.uOpacity.value=this.style.opacity,h.uContrast.value=this.style.contrast,h.uFarFade.value=this.style.farFade,this.quad.material=this.compositeMaterial,t.render(this.quadScene,this.quadCamera)}e&&this.overlay.children.length&&t.render(this.overlay,this.camera)}clear(){this.lost||(this.renderer.setRenderTarget(null),this.renderer.clear(!0,!0,!0))}dispose(){var e,t;this.canvas.removeEventListener("webglcontextlost",this.onLost),this.canvas.removeEventListener("webglcontextrestored",this.onRestored),this.gbuffer.dispose(),this.cells.dispose(),(e=this.atlasTexture)==null||e.dispose(),this.skinTexture.dispose(),(t=this.whales[0])==null||t.mesh.geometry.dispose();for(const i of this.whales)i.material.dispose();this.cellMaterial.dispose(),this.compositeMaterial.dispose(),this.rawMaterial.dispose(),this.quad.geometry.dispose(),this.renderer.dispose()}}const _c=1.55,st={orbit:.15,sphere:.45,dissolve:.64,dissolveSpan:.19,earth:.84,handoff:.955,handoffEnd:.99},Hi=n=>Math.max(0,Math.min(1,n)),lt=(n,e,t)=>{const i=Hi((t-n)/(e-n));return i*i*(3-2*i)},rn=(n,e,t)=>n+(e-n)*t;function Vi(n){return n<st.orbit?rn(3.5,1.82,lt(0,st.orbit,n)**.85):n<st.sphere?rn(1.82,1.74,(n-st.orbit)/(st.sphere-st.orbit)):rn(1.74,1.22,lt(st.sphere,st.earth,n))}const lr=n=>rn(58,34,lt(.58,.84,n)),oi=4e3,Ci=new Float64Array(oi+1);for(let n=1;n<=oi;n++){const e=(n-.5)/oi;Ci[n]=Ci[n-1]+lr(e)/Vi(e)/oi}function b0(n){const e=Hi(n)*oi,t=Math.min(oi-1,Math.floor(e)),i=Ci[t]+(Ci[t+1]-Ci[t])*(e-t);return n<0?n*(lr(0)/Vi(0)):n>1?Ci[oi]+(n-1)*(lr(1)/Vi(1)):i}const w0=n=>lr(Hi(n))/Vi(Hi(n)),R0=n=>.66*lt(st.sphere-.03,.66,n),vc=n=>.35+1.1*lt(st.sphere,st.earth,n);function ds(n,e){const t=(n===0?1:-1)*R0(e),i=vc(e);return[-Math.sin(i)*Math.sin(t),Math.cos(t),Math.cos(i)*Math.sin(t)]}function xc(n,e){const t=Vi(e),i=b0(e)+(n===0?0:Math.PI),s=vc(e),r=ds(n,e),a=[Math.cos(s),0,Math.sin(s)],o=en(zn(r,a)),l=(n===0?.16:-.16)*(1-lt(.55,.8,e))+.07*Math.sin(i*.5+n*1.7);return[t*(Math.cos(i)*a[0]+Math.sin(i)*o[0])+l*r[0],t*(Math.cos(i)*a[1]+Math.sin(i)*o[1])+l*r[1],t*(Math.cos(i)*a[2]+Math.sin(i)*o[2])+l*r[2]]}const C0=(n,e)=>rn(1.25,.7,lt(.05,st.orbit+.05,e))+.18*Math.sin(e*37+n*2.4)*(1-lt(.6,.8,e))-.3*lt(.66,.84,e);function P0(n,e=1){return{path:t=>xc(n,t),up:t=>ds(n,t),length:_c*e*(n===0?1:.94),effort:t=>C0(n,t),phase:n===0?0:2.3,stride:n===0?.95:.88,bankGain:.5,maxBank:.5}}const Mc=n=>-1.9*(1-lt(.6,.955,n))**2,Sl=30,yl=16;function D0(n,e,t){const i=Math.tan(t/2*Math.PI/180),s=2*n/e;return Math.sqrt(1+1/(s*i)**2)}function Sc(n,e){const t=Hi(n),i=e.width/Math.max(1,e.height),s=i<.9,r=s?1.3:1,a=[0,1].map(b=>{const w=_0(t,P0(b,r)),L=Hi((t-st.dissolve)/st.dissolveSpan)*1.06;return{...w,dissolve:L,visible:L<1.05}}),o=lt(.6,.9,t),l=rn(Sl,yl,o),c=Math.tan(Sl/2*Math.PI/180),d=Vi(t)+_c*r*(s?.3:.36),f=d/(c*i*(s?1:.94)),m=d*.62/(c*.86),g=Math.max(f,m),_=D0(e.globeR,e.height,yl),p=rn(g,_,o),h=rn(10,s?40:26,lt(0,.3,t))*(1-lt(.5,.9,t))*Math.PI/180,A=-34*lt(.05,.42,t)*(1-lt(.5,.88,t))*Math.PI/180,S=[p*Math.cos(h)*Math.sin(A),p*Math.sin(h),p*Math.cos(h)*Math.cos(A)],M=lt(.55,.88,t),P={position:S,up:[0,1,0],fov:l,centerX:rn(e.width/2,e.globeX,M),centerY:rn(e.height*(s?.46:.5),e.globeY,M)};return{p:t,whales:a,camera:P,spin:Mc(t),ortho:lt(.86,.955,t),occlusion:.92*lt(.6,.76,t),disc:lt(.78,.95,t),globeReveal:lt(st.handoff,st.handoffEnd-.005,t),layer:1-lt(st.handoffEnd-.004,1,t),orbitNormals:[ds(0,t),ds(1,t)],omega:w0(t)}}const L0=`
${mc}
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
  skinWhale(aSkin.y, aOff, vec3(0.0, 1.0, 0.0), aSkin.z, w * ${ls}, p, n, tg);
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
`,I0=`
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
`,U0=`
void main() { gl_Position = vec4(position.xy, 0.0, 1.0); }
`,N0=`
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
`,F0=["·",".",":","·","+","'","-","."],O0=[[86,99,109],[60,72,82],[38,49,58]],Jr=n=>new N(n[0]/255,n[1]/255,n[2]/255);function B0(n,e){const t=Al(n,e),{east:i,north:s}=Lc(t);return new Ue().set(i[0],i[1],i[2],s[0],s[1],s[2],t[0],t[1],t[2])}function z0(n,e,t){const i=t??new gc(n,{maxWhales:2,gbufferScale:.75});let s={width:1,height:1,globeX:0,globeY:0,globeR:1},r=1;const a=B0(e.lon,e.lat),o=new Ue,l=new Ue,c=new N,u=new qi,d=new N,f=new wt({glslVersion:Bn,vertexShader:U0,fragmentShader:N0,transparent:!0,blending:cs,blendSrc:us,blendDst:li,depthTest:!1,depthWrite:!1,uniforms:{uCanvasDev:{value:new Ve},uDpr:{value:1},uDisc:{value:new N},uAlpha:{value:0}}}),m=new Gt(new Yi(2,2),f);m.frustumCulled=!1,i.underlay.add(m);const g=new wt({glslVersion:Bn,vertexShader:L0,fragmentShader:I0,transparent:!0,blending:cs,blendSrc:us,blendDst:li,depthTest:!1,depthWrite:!1,uniforms:{uSkin:{value:i.skinTexture},...i.pivotUniforms,uModel:{value:[new rt,new rt]},uAxis:{value:[new N(0,1,0),new N(0,1,0)]},uP:{value:0},uOmega:{value:0},uEarth:{value:l},uCamPos:{value:new N},uCanvas:{value:new Ve},uGlobe:{value:new N},uOrtho:{value:0},uOcc:{value:0},uDpr:{value:1},uCellPx:{value:new Ve(6,10)},uFlight:{value:F0.map(ht)},uInk:{value:Jr([31,59,87])},uBand:{value:O0.map(Jr)},uGrat:{value:Jr([31,59,87])},uDotScale:{value:1},uAtlas:{value:null},uTile:{value:new Ve(1,1)},uAtlasCols:{value:8},uLayer:{value:1}}}),_=new Vm(new Qt,g);_.frustumCulled=!1,i.overlay.add(_);const p=(S,M)=>{const P=hc(7),b=[],w=[],L=(J,re)=>{const we=Al(J,re);b.push(we[0],we[1],we[2]),w.push(3)};for(let J=-180;J<180;J+=30)for(let re=-78;re<=78;re+=3)L(J,re);for(let J=-60;J<=60;J+=30)for(let re=-180;re<180;re+=3)L(re,J);const E=w.length;if(S&&M)for(let J=0;J<3;J++)for(let re=M[J];re<M[J+1];re++)b.push(S[re*3],S[re*3+1],S[re*3+2]),w.push(J);const x=w.length,C=xl(4096,11),V=xl(1024,12,(J,re)=>J[re*4]===os),F=new Float32Array(b),W=new Float32Array(x*4),K=new Float32Array(x*3),G=new Float32Array(x*4),Z=a.elements,H=(J,re,we,Be)=>{const B=ds(J,re),Q=Math.abs(B[2])<.9?[B[1],-B[0],0]:[0,B[2],-B[1]],ue=Math.hypot(Q[0],Q[1],Q[2]),ie=[Q[0]/ue,Q[1]/ue,Q[2]/ue],Ae=[B[1]*ie[2]-B[2]*ie[1],B[2]*ie[0]-B[0]*ie[2],B[0]*ie[1]-B[1]*ie[0]],Pe=ge=>Math.atan2(ge[0]*Ae[0]+ge[1]*Ae[1]+ge[2]*Ae[2],ge[0]*ie[0]+ge[1]*ie[1]+ge[2]*ie[2]),ee=Mc(Be),le=F[we*3],xe=F[we*3+1],Le=F[we*3+2],R=Math.cos(ee)*le-Math.sin(ee)*xe,ze=Math.sin(ee)*le+Math.cos(ee)*xe,Me=[Z[0]*R+Z[3]*ze+Z[6]*Le,Z[1]*R+Z[4]*ze+Z[7]*Le,Z[2]*R+Z[5]*ze+Z[8]*Le];return((Pe(Me)-Pe(xc(J,re)))%(2*Math.PI)+2*Math.PI)%(2*Math.PI)};for(let J=0;J<x;J++){const re=P(),we=J<E,Be=we?V:C,B=Math.floor(P()*Be.count),Q=Be.info[B*4+3],ue=we?st.sphere+.02+P()*(st.dissolve-st.sphere+.02):st.dissolve+(1-Math.min(1,Q))*st.dissolveSpan*.97+(re-.5)*.012,ie=ue+.08,Ae=H(0,ue,J,ie),Pe=H(1,ue,J,ie),ee=Ae<=Pe?0:1,le=Math.min(Ae,Pe),xe=we?.1+le/52+.03*P():Math.min(.955-.012-ue,.032+le/44+.012*P());W.set([ee,Be.spine[B],Be.info[B*4],Q],J*4),K.set([Be.offset[B*3],Be.offset[B*3+1],Be.offset[B*3+2]],J*3),G.set([w[J],re,ue,Math.max(.02,xe)],J*4)}const ne=new Qt;ne.setAttribute("position",new ut(F,3)),ne.setAttribute("aGeo",new ut(F,3)),ne.setAttribute("aSkin",new ut(W,4)),ne.setAttribute("aOff",new ut(K,3)),ne.setAttribute("aMeta",new ut(G,4)),_.geometry.dispose(),_.geometry=ne};p(null,null);let h=!1;Dc().then(S=>{h||p(S.xyz,S.bands)}).catch(()=>{});const A={setView(S,M){s=S,r=M,i.resize(S.width,S.height,M),i.setStyle({mode:"shape",cellW:6,cellH:10})},render(S){i.setStyle({...yt,invert:!1});const M=Sc(S,s);M.whales.forEach((G,Z)=>i.setWhale(Z,{visible:G.visible,position:G.position,quaternion:G.quaternion,scale:G.scale,articulation:G.articulation,dissolve:G.dissolve}));const P=i.camera;P.fov=M.camera.fov,P.position.set(...M.camera.position),P.up.set(...M.camera.up),P.lookAt(0,0,0);const b=s.width,w=s.height;P.setViewOffset(b,w,b/2-M.camera.centerX,w/2-M.camera.centerY,b,w),P.updateProjectionMatrix(),i.setOccluder([0,0,0],1,M.occlusion),i.setStyle({opacity:M.layer});const L=Math.cos(M.spin),E=Math.sin(M.spin);o.set(L,-E,0,E,L,0,0,0,1),l.multiplyMatrices(a,o);const x=g.uniforms,C=i.glyphs;x.uP.value=M.p,x.uOmega.value=M.omega,x.uCamPos.value.copy(P.position),x.uCanvas.value.set(b,w),x.uGlobe.value.set(s.globeX,s.globeY,s.globeR),x.uOrtho.value=M.ortho,x.uOcc.value=M.occlusion,x.uDpr.value=r,x.uCellPx.value.set(i.style.cellW,i.style.cellH),x.uDotScale.value=Math.max(.75,Math.min(1.6,s.globeR/300)),x.uAtlas.value=C.texture,x.uTile.value.set(C.tileW,C.tileH),x.uAtlasCols.value=C.cols,x.uLayer.value=M.layer;for(let G=0;G<2;G++){const Z=M.whales[G];x.uModel.value[G].compose(c.set(...Z.position),u.set(...Z.quaternion),d.setScalar(Z.scale)),x.uAxis.value[G].set(...M.orbitNormals[G])}_.visible=M.p>st.sphere;const V=f.uniforms,F=Math.tan(P.fov/2*(Math.PI/180)),W=P.position.length(),K=w/2/F/Math.sqrt(Math.max(.001,W*W-1));return V.uCanvasDev.value.set(Math.round(b*r),Math.round(w*r)),V.uDpr.value=r,V.uDisc.value.set(M.camera.centerX,M.camera.centerY,K+(s.globeR-K)*M.ortho),V.uAlpha.value=M.disc*M.layer,m.visible=M.disc>.001,i.render(),{globeReveal:M.globeReveal,layer:M.layer}},clear(){i.clear()},finish(){const S=i.renderer.getContext(),M=new Uint8Array(4);S.readPixels(0,0,1,1,S.RGBA,S.UNSIGNED_BYTE,M)},get lost(){return i.lost},onContextLost:null,destroy(){h=!0,_.geometry.dispose(),g.dispose(),m.geometry.dispose(),f.dispose(),i.overlay.remove(_),i.underlay.remove(m),t||i.dispose()}};return t||(i.onContextLost=()=>{var S;return(S=A.onContextLost)==null?void 0:S.call(A)}),A}const El=2.4,Xa=Math.PI*2,ps=(n,e)=>(n%e+e)%e,bt=(n,e,t)=>Math.max(e,Math.min(t,n));function ms(n,e){const t=Math.max(1,n),i=Math.max(1,e),s=Math.min(1.45*t,1.7*i,Math.max(1.12*t,.95*i)),r=i/(2*s);return{z:El,fov:2*Math.atan(r/El)*180/Math.PI,halfW:t/(2*s),halfH:r,px:s}}const k0=(n,e)=>n.halfH*(n.z-e)/n.z,qa=n=>{const e=bt(n,0,1);return e*e*e*(e*(e*6-15)+10)},cr=(n,e,t,i)=>qa((n-e)/i)*(1-qa((n-t)/i)),G0=n=>cr(ps(n,263),115,166,18),H0=n=>cr(ps(n,211),60,96,16),V0=[290,230],W0=[200,150],X0=(n,e)=>Xa*qa((ps(e+n*79,V0[n])-W0[n])/20),so=[1,.9],q0=[.62,.55],Y0=[.065,.028],yc=(n,e)=>n===0?cr(ps(e,71),28,52,8):cr(ps(e+23,53),30,41,6),K0=[1.6,1.9],$0=[1.4,1.6],Z0=n=>.7+1.45*Math.min(1,Math.abs(n)),j0=[.7,.95],J0=[.9,1.25],Q0=1.6,eg=[.42,-.5],tg=[.42,.5],Ec=2.2,ur=.8,Tl=65*Math.PI/180;function Qr(n,e,t){const i=ms(t.width,t.height),s=t.lanes[n]??{x:.5,y:.5},r=bt(t.weight,0,1)*.68,a=(s.x-.5)*2*i.halfW*r,o=((.5-(n===0?.6:.38))*(1-r)+(.5-s.y)*r)*2*i.halfH,l=(i.halfW*.78+.1)*(1-.45*r);let c,u,d;if(n===0){const f=e*Xa/70+.55,m=H0(e);c=a+l*Math.sin(f)+.04*Math.sin(e*.021),u=o+.22*i.halfH*Math.sin(f*.61+.4)-.5*m,d=-.05+.4*Math.cos(f)-.3*m}else{const f=e*Xa/50+3.1;c=a+.85*l*Math.sin(f)+.18*Math.sin(f*2.2+.7),u=o+.34*i.halfH*Math.sin(f*.73+1.7)+.06*Math.sin(f*2.9),d=-.45+.32*Math.cos(f)+.12*Math.sin(f*1.6+.3)}if(Number.isFinite(t.surfaceY)){const f=(.5-t.surfaceY/Math.max(1,t.height))*2*i.halfH-.16;u=f-Math.log1p(Math.exp((f-u)*12))/12}return[c,u,d]}function Mn(n,e,t){const i=Qr(n,e,t);if(n===0)return i;const s=ms(t.width,t.height),r=Qr(0,e,t),a=Qr(0,e-9,t),o=G0(e);i[0]+=(a[0]+.2*s.halfW*Math.sin(e*.12)-i[0])*o,i[1]+=(a[1]+.24-i[1])*o,i[2]+=(a[2]-.6-i[2])*o;const l=Ht(i,r),c=on(l),u=Math.log1p(Math.exp((.95-c)*4))/4,d=en([l[0],l[1],l[2]-.1]);return[i[0]+d[0]*u,i[1]+d[1]*u,i[2]+d[2]*u]}const ng=(n=0)=>({s:0,sv:0,drift:[0,0],dv:[0,0],da:[0,0],roll:[n,n],swim:[0,0],fwd:[null,null],spin:[[0,0,0],[0,0,0]],up:[[0,1,0],[0,1,0]],bend:[[0,0],[0,0]],att:[[0,0,0,0],[0,0,0,0]],bank:[[0,0],[0,0]],ahead:0,surge:0}),Tc=n=>1+Q0*Math.min(1,Math.abs(n)),ig=(n,e,t)=>bt(-Pt(n,e)*Ec*(1+.35*Math.max(0,t)-.15*Math.max(0,-t)),-ur,ur),ea=(n,e,t=fs)=>{let i=Ht(n,ot(e,Pt(n,e)));return on(i)<1e-5&&(i=Ht(t,ot(e,Pt(t,e)))),en(i)};function ro(n,e,t,i,s){const a=Mn(n,e-1.2,t),o=Mn(n,e+1.2,t),l=ot(Ht(o,a),Tc(s)/(2*1.2));l[2]*=1-.55*Math.min(1,Math.abs(s)),l[1]+=i;const c=Math.hypot(l[0],l[2]),u=Z0(s);return Math.abs(l[1])>u*c&&(l[1]=Math.sign(l[1])*u*c),l}function sg(n,e,t,i,s){const r=Math.atan2(t[0],-t[2]),a=Math.asin(bt(t[1],-1,1)),o=n.att[e];if(!n.fwd[e]){o[0]=r,o[1]=a,o[2]=0,o[3]=0,n.fwd[e]=t,n.spin[e]=[0,0,0],n.up[e]=ea(jt,t);return}n.fwd[e];const l=Math.min(1,Math.abs(s)),c=2.2*(1+.4*l),u=j0[e]*(1+.2*l),d=J0[e]*(1+.5*l),f=Math.atan2(Math.sin(r-o[0]),Math.cos(r-o[0])),m=a-o[1],g=Math.cos(o[1]);let _=c*c*f-2*c*o[2],p=c*c*m-2*c*o[3];const h=Math.hypot(_*g,p);h>d&&(_*=d/h,p*=d/h);const A=2*(Math.hypot(o[2]*g,o[3])/u)**2;_-=A*o[2],p-=A*o[3];let S=o[2]+_*i,M=o[3]+p*i;const P=Math.hypot(S*g,M);P>u&&(S*=u/P,M*=u/P),o[0]+=S*i,o[1]=bt(o[1]+M*i,-Tl,Tl),o[2]=S,o[3]=M;const b=Math.cos(o[1]),w=Math.sin(o[1]),L=Math.cos(o[0]),E=Math.sin(o[0]),x=[b*E,w,-b*L],C=[b*L*S-w*E*M,b*M,b*E*S+w*L*M],V=zn(x,C);let F=n.up[e];const W=on(V)*i;if(W>0){const J=en(V),re=Math.cos(W),we=Math.sin(W);F=ai(ai(ot(F,re),ot(zn(J,F),we)),ot(J,Pt(J,F)*(1-re)))}n.fwd[e]=x,n.spin[e]=V,F=ea(F,x,jt);const K=ea(jt,x,F),G=Math.atan2(Pt(zn(F,K),x),Pt(F,K)),Z=bt(G,-1,1)*.6*b*i,H=Math.cos(Z),ne=Math.sin(Z);n.up[e]=en(ai(ot(F,H),ot(zn(x,F),ne)))}function rg(n,e,t,i,s){var m;if(!(t>0))return;const r=ms(s.width,s.height),a=bt(e,-1,1),l=a*n.s>=0&&Math.abs(a)<Math.abs(n.s)?1.3:3.4;n.sv+=(l*l*(a-n.s)-2*l*n.sv)*t,n.s+=n.sv*t;const c=n.s,u=bt(Math.tanh(c/.15)*n.sv,-1,1);n.surge+=(u-n.surge)*(1-Math.exp(-t/.35));const d=Tc(c);n.ahead+=(d-1)*t;const f=i+n.ahead;for(let g=0;g<2;g++){const _=Mn(g,f-.6,s),p=Mn(g,f+.6,s),h=Mn(g,f,s),A=Math.hypot(p[0]-_[0],p[2]-_[2])/1.2*d,S=(p[1]-_[1])/1.2*d,M=c>=0?K0[g]:$0[g];let P=-c*M*Math.max(A,.05)*(1+.5*Math.abs(c))-S*Math.min(1,1.8*Math.abs(c));const b=k0(r,h[2])+.75,w=2*b,L=n.drift[g]-w*Math.round(n.drift[g]/w),E=1-Math.min(1,Math.abs(c)/.2);P-=bt(L*.1,-.03,.03)*E,P+=bt(((m=s.avoid)==null?void 0:m[g])??0,-.07,.07)*E;const x=(P-n.dv[g])/.45;n.dv[g]+=x*t,n.da[g]=x,n.drift[g]+=n.dv[g]*t;const C=h[1]+n.drift[g];C<-b?n.drift[g]+=w:C>b&&(n.drift[g]-=w),n.roll[g]+=t*(1+1.4*Math.max(0,c)-.45*Math.max(0,-c)),n.swim[g]+=t*(Y0[g]*(1-.65*yc(g,f))+Math.hypot(A,S+n.dv[g]))/so[g],sg(n,g,en(ro(g,f,s,n.dv[g],c)),t,c);const[V,F]=Ac(g,f,s,n),W=1-Math.exp(-t/.45);n.bend[g]=[n.bend[g][0]+(V-n.bend[g][0])*W,n.bend[g][1]+(F-n.bend[g][1])*W];const K=n.bank[g],G=n.fwd[g],Z=bt(zn(G,n.up[g])[2]*3,-1,1),H=ig(n.spin[g],n.up[g],c)+eg[g]*n.att[g][3]+tg[g]*c*Z,ne=1.5,J=.75;K[1]+=(ne*ne*(H-K[0])-2*J*ne*K[1])*t,K[0]+=K[1]*t}}function Ac(n,e,t,i){const r=Mn(n,e,t),a=Mn(n,e-1.2,t),o=Mn(n,e+1.2,t),l=ro(n,e,t,(i==null?void 0:i.dv[n])??0,(i==null?void 0:i.s)??0),c=ot([o[0]+a[0]-r[0]*2,o[1]+a[1]-r[1]*2,o[2]+a[2]-r[2]*2],1/(1.2*1.2));c[1]+=(i==null?void 0:i.da[n])??0;const u=Math.max(.005,on(l)),d=(i==null?void 0:i.fwd[n])??en(l),f=ar(d,i?i.up[n]:jt),m=so[n],g=u*u+(.08*m)**2,_=i==null?void 0:i.spin[n],p=_?ot(zn(_,d),Math.sqrt(g)):c;return[bt(Pt(p,Tn(f,Wn))*m/g,-.65,.65),bt(Pt(p,Tn(f,jt))*m/g,-.42,.42)]}function ag(n,e,t,i){const s=e+((i==null?void 0:i.ahead)??0),r=Mn(n,s,t),a=(i==null?void 0:i.s)??0,o=ro(n,s,t,(i==null?void 0:i.dv[n])??0,a),l=Math.max(.005,on(o)),c=(i==null?void 0:i.fwd[n])??en(o),u=i?i.up[n]:jt,d=so[n],[f,m]=i?i.bend[n]:Ac(n,s,t),g=i?i.bank[n][0]:bt(f*(l/d)*Ec,-ur,ur),_=g+X0(n,(i==null?void 0:i.roll[n])??e),p=yc(n,s),h=i?i.surge:0,A=((.45+Math.min(.45,l/d*2.8))*(1-.92*p)+.4*Math.abs(a))*(1+.45*Math.min(0,h))+.55*Math.max(0,h),S=fc({distance:i?i.swim[n]:e*(n===0?.115:.135),effort:A,turn:f,climb:m,bank:g,phase:n*2.3,stride:q0[n]}),M=ar(c,u,_),P=S.stroke,b=.013*d*S.amplitude*Math.sin(P-2.4),w=.028*S.amplitude*Math.sin(P-1.2),L=Tn(M,jt);return{position:[r[0]+L[0]*b,r[1]+((i==null?void 0:i.drift[n])??0)+L[1]*b,r[2]+L[2]*b],quaternion:Ri(Gi(Hn(Tn(M,Wn),w),M)),scale:d,bank:_,articulation:S}}const gt=(n,e,t)=>n+(e-n)*t,Nn=(n,e)=>Number.isFinite(n)?n:e;function og(n,e,t){const i=(r,a)=>({sweep:gt(r.sweep,a.sweep,t),dihedral:gt(r.dihedral,a.dihedral,t),twist:gt(r.twist,a.twist,t)}),s=Math.atan2(Math.sin(e.stroke-n.stroke),Math.cos(e.stroke-n.stroke));return{stroke:n.stroke+s*t,amplitude:gt(n.amplitude,e.amplitude,t),bendYaw:gt(n.bendYaw,e.bendYaw,t),bendPitch:gt(n.bendPitch,e.bendPitch,t),flipperL:i(n.flipperL,e.flipperL),flipperR:i(n.flipperR,e.flipperR),fluke:gt(n.fluke,e.fluke,t),flukeFlex:gt(n.flukeFlex,e.flukeFlex,t)}}function ug(n){var Pe;const e=document.createElement("canvas");e.className="absolute inset-0 w-full h-full block pointer-events-none",e.dataset.whaleRenderer="shared-3d",n.appendChild(e);let t;try{t=new gc(e,{gbufferScale:innerWidth<768?.5:.65})}catch{return e.remove(),()=>{}}let i=null,s="",r=!1,a=0,o=performance.now(),l=0,c=0,u=!0,d=0,f=0,m=innerWidth<768?.5:.65,g="",_=null,p=[],h=0,A=null,S=!1;const M=matchMedia("(prefers-reduced-motion: reduce)"),P=()=>M.matches||S,b=()=>Math.max(1,innerWidth||1),w=()=>Math.max(1,innerHeight||1),L=[0,0],E={width:b(),height:w(),weight:Nn(wn.weight,0),lanes:wn.lanes.map(ee=>({...ee})),surfaceY:wn.surfaceY,avoid:L},x=(ee,le,xe,Le,R)=>{let ze=0;for(const Me of ee){const Re=Math.min(Le,Me.left+Me.width)-Math.max(le,Me.left),ge=Math.min(R,Me.top+Me.height)-Math.max(xe,Me.top);Re>0&&ge>0&&(ze+=Re*ge)}return Math.min(1,ze/Math.max(1,(Le-le)*(R-xe)))},C=ee=>{const le=Uc.read();for(let xe=0;xe<2;xe++){const Le=Rn.spines[xe];let R=1/0,ze=1/0,Me=-1/0,Re=-1/0;for(let Ne=10;Ne<=30;Ne++){const Se=Le[Ne*2],T=Le[Ne*2+1];!Number.isFinite(Se)||!Number.isFinite(T)||(R=Math.min(R,Se),Me=Math.max(Me,Se),ze=Math.min(ze,T),Re=Math.max(Re,T))}let ge=0;if(Me>R&&le.length){const Ne=.08*ms(b(),w()).px;if(R=Math.max(0,R-Ne),Me=Math.min(b(),Me+Ne),ze-=Ne,Re+=Ne,Me>R&&Re>0&&ze<w()){const Se=w()*.3,T=x(le,R,ze,Me,Re),v=x(le,R,ze-Se,Me,Re-Se),O=x(le,R,ze+Se,Me,Re+Se);ge=Math.max(-1,Math.min(1,(O-v)*4))*.07*Math.min(1,T/.12)}}L[xe]=Nn(L[xe]+(ge-L[xe])*(1-Math.exp(-ee/1.2)),0)}},V=ng(0);let F=scrollY,W=0;const K=()=>Ft.listeners.forEach(ee=>ee()),G=()=>{const ee=!!i&&!!Xt.host&&!t.lost&&!P();Ft.ready!==ee&&(Ft.ready=ee,K())},Z=()=>{const ee=Xt.host.getBoundingClientRect(),{cx:le,cy:xe,baseR:Le}=Fc(ee.width,ee.height);return{r:ee,view:{width:ee.width,height:ee.height,globeX:le,globeY:xe,globeR:Le*1.08}}},H=()=>{const ee=Xt.firstCity;ee&&Xt.host&&s!==`${ee.lon}:${ee.lat}`&&(i==null||i.destroy(),i=z0(e,ee,t),s=`${ee.lon}:${ee.lat}`),G()},ne=(ee,le,xe)=>{const Le=Math.min(devicePixelRatio||1,ee<768?1:1.25),R=`${ee}:${le}:${Le}:${xe}`;return R===g?!1:(g=R,t.resize(ee,le,Le),t.setStyle({mode:"shape",cellW:6,cellH:10}),!0)},J=()=>{t.camera.updateMatrixWorld();const ee=new N;p.forEach((le,xe)=>{const Le=p0(le.articulation);for(let R=0;R<48;R++){const ze=Tn(le.quaternion,[Le.p[R*4]*le.scale,Le.p[R*4+1]*le.scale,Le.p[R*4+2]*le.scale]);ee.set(ze[0]+le.position[0],ze[1]+le.position[1],ze[2]+le.position[2]).project(t.camera),Rn.spines[xe][R*2]=(ee.x+1)*innerWidth/2,Rn.spines[xe][R*2+1]=(1-ee.y)*innerHeight/2}})},re=ee=>{const le=scrollY,xe=Math.max(-w()*.25,Math.min(w()*.25,Nn(le-F,0)));F=le;const Le=ee>0?xe/ee:0;W=Nn(W+(Le-W)*(1-Math.exp(-ee/.12)),0),C(ee),rg(V,Math.tanh(W/(w()*.6)),ee,c,E)},we=(ee,le)=>{e.parentElement!==n&&n.appendChild(e),ne(b(),w(),!1);const xe=P()?1:1-Math.exp(-ee*1.3);E.width=b(),E.height=w(),E.weight=Nn(E.weight+(Nn(wn.weight,0)-E.weight)*xe,0),E.lanes.forEach((Y,q)=>{const he=wn.lanes[q]??Y;Y.x=Nn(Y.x+(he.x-Y.x)*xe,.5),Y.y=Nn(Y.y+(he.y-Y.y)*xe,.5)}),E.surfaceY=wn.surfaceY;const Le=P()?void 0:V,R=[0,1].map(Y=>({...ag(Y,c,E,Le),dissolve:0,visible:!0}));(le<=0||!_)&&(_=R),p=le>0?_.map(Y=>({...Y})):R;const ze=ms(b(),w()),Me=t.camera,Re=P()?0:1-le,ge=.05*Math.sin(c*Math.PI*2/97)*Re,Ne=.035*Math.sin(c*Math.PI*2/131+1)*Re;if(Me.position.set(ge,Ne,ze.z),Me.up.set(0,1,0),Me.lookAt(ge*.35,Ne*.35,0),Me.fov=ze.fov,Me.clearViewOffset(),le>0&&Xt.host){const{r:Y,view:q}=Z(),he=Sc(0,q),ae=new Ut(he.camera.fov,q.width/q.height);ae.position.set(...he.camera.position),ae.up.set(...he.camera.up),ae.lookAt(0,0,0);const _e=o0(ae.quaternion.toArray()),He=ze.z/ae.position.length();p=p.map((pe,De)=>{const Ce=he.whales[De],ve=Tn(_e,[Ce.position[0]-he.camera.position[0],Ce.position[1]-he.camera.position[1],Ce.position[2]-he.camera.position[2]]);return{...pe,position:a0(pe.position,[ve[0]*He,ve[1]*He,ve[2]*He+ze.z],le),quaternion:l0(pe.quaternion,Gi(_e,Ce.quaternion),le),scale:gt(pe.scale,Ce.scale*He,le),articulation:og(pe.articulation,Ce.articulation,le)}});const te=Math.atan(Math.tan(he.camera.fov*Math.PI/360)*w()/q.height)*360/Math.PI;Me.fov=gt(ze.fov,te,le),Me.setViewOffset(b(),w(),(b()/2-Y.left-he.camera.centerX)*le,(w()/2-Y.top-he.camera.centerY)*le,b(),w())}Me.updateProjectionMatrix(),t.setOccluder([0,0,0],0,0);const Se=1-Oc(scrollY,mo.start,mo.travel)/255,T=Nc(Se),v=P()?Ic.rects.length?.5:1:le>0?1:wn.presence,O=yt.ink,$=yt.inkFar;t.setStyle({opacity:v*gt(1-.06*E.weight,1,le),gamma:yt.gamma,tone:yt.tone,contrast:yt.contrast,farFade:yt.farFade,invert:T>.5,ink:[gt(O[0],196,T),gt(O[1],218,T),gt(O[2],228,T)],inkFar:[gt($[0],132,T),gt($[1],168,T),gt($[2],182,T)]}),p.forEach((Y,q)=>t.setWhale(q,Y)),Rn.presence=v,t.render(!1),J()},Be=ee=>{if(a=0,r||document.hidden||t.lost)return;const le=Math.min(.05,Math.max(0,(ee-o)/1e3));o=ee,H();const xe=Bc(scrollY),Le=Ft.ready&&!!Xt.host&&Ft.length>0;h=Le?zc(scrollY,Ft.start-innerHeight*.95,Ft.start):0;const R=Le&&scrollY>=Ft.start&&xe<1,ze=Le&&scrollY<Ft.start&&h>0,Me=Le&&xe>=1&&wn.presence<.002,Re=!P()&&!R&&!ze&&!Me&&A===null;if(Re?(c+=le,re(le)):F=scrollY,(u||Re)&&(u||ee-l>=1e3/30)){const ge=performance.now();if(R){e.parentElement!==Xt.host&&Xt.host.appendChild(e);const{view:Ne}=Z();ne(Ne.width,Ne.height,!0)&&i.setView(Ne,Math.min(devicePixelRatio||1,Ne.width<768?1:1.25)),i.render(xe),Rn.presence=0}else Me?(t.clear(),Rn.presence=0):we(le,ze?h:0);u=!1,l=ee,d++,f+=(performance.now()-ge-f)*.06,d%90===0&&f>19&&m>.36&&(m=Math.max(.35,m-.1),t.setResolution(m))}Re&&(a=requestAnimationFrame(Be))},B=()=>{u=!0,!a&&!document.hidden&&!r&&(o=performance.now(),a=requestAnimationFrame(Be))},Q=()=>{cancelAnimationFrame(a),a=0,o=performance.now(),document.hidden||B()},ue=()=>{_=null,G(),B()};t.onContextLost=()=>{e.style.visibility="hidden",G(),cancelAnimationFrame(a),a=0,Rn.presence=0};const ie=()=>{e.style.visibility="",G(),g="",B()};e.addEventListener("webglcontextrestored",ie),window.addEventListener("scroll",B,{passive:!0}),window.addEventListener("resize",B),document.addEventListener("visibilitychange",Q),M.addEventListener("change",ue),Ft.listeners.add(B),Xt.refresh=B;const Ae=new ResizeObserver(B);return Ae.observe(document.body),(Pe=document.fonts)==null||Pe.ready.then(()=>{r||(t.invalidateAtlas(),B())}),B(),()=>{r=!0,cancelAnimationFrame(a),Ae.disconnect(),window.removeEventListener("scroll",B),window.removeEventListener("resize",B),document.removeEventListener("visibilitychange",Q),M.removeEventListener("change",ue),e.removeEventListener("webglcontextrestored",ie),Ft.listeners.delete(B),Xt.refresh===B&&(Xt.refresh=null),i==null||i.destroy(),t.dispose(),e.remove(),Ft.ready=!1,Rn.presence=0,K()}}export{ug as mountAmbientWhales};
