var Uc=Object.defineProperty;var Nc=(n,e,t)=>e in n?Uc(n,e,{enumerable:!0,configurable:!0,writable:!0,value:t}):n[e]=t;var Ve=(n,e,t)=>Nc(n,typeof e!="symbol"?e+"":e,t);import{l as Fc,c as Oc,a as Pl,w as wn,b as Nt,g as yr,r as Bc,h as Ss,i as zc,d as Vn,e as kc,f as Xt,j as xo,k as Gc,m as Hc,s as Vc}from"./index-CMVLFM5N.js";/**
 * @license
 * Copyright 2010-2024 Three.js Authors
 * SPDX-License-Identifier: MIT
 */const ja="170",Wc=0,Mo=1,Xc=2,Dl=1,qc=2,mn=3,kn=0,wt=1,rn=2,On=0,Pi=1,So=2,yo=3,Eo=4,cr=5,Qn=100,Yc=101,Kc=102,$c=103,Zc=104,jc=200,ur=201,Jc=202,Qc=203,sa=204,li=205,eu=206,tu=207,nu=208,iu=209,ru=210,su=211,au=212,ou=213,lu=214,aa=0,oa=1,la=2,Ui=3,ca=4,ua=5,ha=6,fa=7,Ll=0,cu=1,uu=2,Bn=0,hu=1,fu=2,du=3,pu=4,mu=5,gu=6,_u=7,Il=300,Ni=301,Fi=302,da=303,pa=304,ds=306,ma=1e3,ni=1001,ga=1002,ft=1003,vu=1004,Er=1005,Bt=1006,ys=1007,ii=1008,Jt=1009,Ul=1010,Nl=1011,hr=1012,Ja=1013,ci=1014,an=1015,mr=1016,Qa=1017,eo=1018,Oi=1020,Fl=35902,Ol=1021,Bl=1022,zt=1023,zl=1024,kl=1025,Di=1026,Bi=1027,Gl=1028,to=1029,Hl=1030,no=1031,io=1033,jr=33776,Jr=33777,Qr=33778,es=33779,_a=35840,va=35841,xa=35842,Ma=35843,Sa=36196,ya=37492,Ea=37496,Ta=37808,Aa=37809,ba=37810,wa=37811,Ra=37812,Ca=37813,Pa=37814,Da=37815,La=37816,Ia=37817,Ua=37818,Na=37819,Fa=37820,Oa=37821,ts=36492,Ba=36494,za=36495,Vl=36283,ka=36284,Ga=36285,Ha=36286,xu=3200,Mu=3201,Su=0,yu=1,Nn="",Ot="srgb",Wi="srgb-linear",ps="linear",Qe="srgb",hi=7680,To=519,Eu=512,Tu=513,Au=514,Wl=515,bu=516,wu=517,Ru=518,Cu=519,Ao=35044,Fn="300 es",gn=2e3,as=2001;class Xi{addEventListener(e,t){this._listeners===void 0&&(this._listeners={});const i=this._listeners;i[e]===void 0&&(i[e]=[]),i[e].indexOf(t)===-1&&i[e].push(t)}hasEventListener(e,t){if(this._listeners===void 0)return!1;const i=this._listeners;return i[e]!==void 0&&i[e].indexOf(t)!==-1}removeEventListener(e,t){if(this._listeners===void 0)return;const r=this._listeners[e];if(r!==void 0){const s=r.indexOf(t);s!==-1&&r.splice(s,1)}}dispatchEvent(e){if(this._listeners===void 0)return;const i=this._listeners[e.type];if(i!==void 0){e.target=this;const r=i.slice(0);for(let s=0,a=r.length;s<a;s++)r[s].call(this,e);e.target=null}}}const vt=["00","01","02","03","04","05","06","07","08","09","0a","0b","0c","0d","0e","0f","10","11","12","13","14","15","16","17","18","19","1a","1b","1c","1d","1e","1f","20","21","22","23","24","25","26","27","28","29","2a","2b","2c","2d","2e","2f","30","31","32","33","34","35","36","37","38","39","3a","3b","3c","3d","3e","3f","40","41","42","43","44","45","46","47","48","49","4a","4b","4c","4d","4e","4f","50","51","52","53","54","55","56","57","58","59","5a","5b","5c","5d","5e","5f","60","61","62","63","64","65","66","67","68","69","6a","6b","6c","6d","6e","6f","70","71","72","73","74","75","76","77","78","79","7a","7b","7c","7d","7e","7f","80","81","82","83","84","85","86","87","88","89","8a","8b","8c","8d","8e","8f","90","91","92","93","94","95","96","97","98","99","9a","9b","9c","9d","9e","9f","a0","a1","a2","a3","a4","a5","a6","a7","a8","a9","aa","ab","ac","ad","ae","af","b0","b1","b2","b3","b4","b5","b6","b7","b8","b9","ba","bb","bc","bd","be","bf","c0","c1","c2","c3","c4","c5","c6","c7","c8","c9","ca","cb","cc","cd","ce","cf","d0","d1","d2","d3","d4","d5","d6","d7","d8","d9","da","db","dc","dd","de","df","e0","e1","e2","e3","e4","e5","e6","e7","e8","e9","ea","eb","ec","ed","ee","ef","f0","f1","f2","f3","f4","f5","f6","f7","f8","f9","fa","fb","fc","fd","fe","ff"],Es=Math.PI/180,Va=180/Math.PI;function gr(){const n=Math.random()*4294967295|0,e=Math.random()*4294967295|0,t=Math.random()*4294967295|0,i=Math.random()*4294967295|0;return(vt[n&255]+vt[n>>8&255]+vt[n>>16&255]+vt[n>>24&255]+"-"+vt[e&255]+vt[e>>8&255]+"-"+vt[e>>16&15|64]+vt[e>>24&255]+"-"+vt[t&63|128]+vt[t>>8&255]+"-"+vt[t>>16&255]+vt[t>>24&255]+vt[i&255]+vt[i>>8&255]+vt[i>>16&255]+vt[i>>24&255]).toLowerCase()}function At(n,e,t){return Math.max(e,Math.min(t,n))}function Pu(n,e){return(n%e+e)%e}function Ts(n,e,t){return(1-t)*n+t*e}function ji(n,e){switch(e.constructor){case Float32Array:return n;case Uint32Array:return n/4294967295;case Uint16Array:return n/65535;case Uint8Array:return n/255;case Int32Array:return Math.max(n/2147483647,-1);case Int16Array:return Math.max(n/32767,-1);case Int8Array:return Math.max(n/127,-1);default:throw new Error("Invalid component type.")}}function Tt(n,e){switch(e.constructor){case Float32Array:return n;case Uint32Array:return Math.round(n*4294967295);case Uint16Array:return Math.round(n*65535);case Uint8Array:return Math.round(n*255);case Int32Array:return Math.round(n*2147483647);case Int16Array:return Math.round(n*32767);case Int8Array:return Math.round(n*127);default:throw new Error("Invalid component type.")}}class Ge{constructor(e=0,t=0){Ge.prototype.isVector2=!0,this.x=e,this.y=t}get width(){return this.x}set width(e){this.x=e}get height(){return this.y}set height(e){this.y=e}set(e,t){return this.x=e,this.y=t,this}setScalar(e){return this.x=e,this.y=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;default:throw new Error("index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;default:throw new Error("index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y)}copy(e){return this.x=e.x,this.y=e.y,this}add(e){return this.x+=e.x,this.y+=e.y,this}addScalar(e){return this.x+=e,this.y+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this}subScalar(e){return this.x-=e,this.y-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this}multiply(e){return this.x*=e.x,this.y*=e.y,this}multiplyScalar(e){return this.x*=e,this.y*=e,this}divide(e){return this.x/=e.x,this.y/=e.y,this}divideScalar(e){return this.multiplyScalar(1/e)}applyMatrix3(e){const t=this.x,i=this.y,r=e.elements;return this.x=r[0]*t+r[3]*i+r[6],this.y=r[1]*t+r[4]*i+r[7],this}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this}clamp(e,t){return this.x=Math.max(e.x,Math.min(t.x,this.x)),this.y=Math.max(e.y,Math.min(t.y,this.y)),this}clampScalar(e,t){return this.x=Math.max(e,Math.min(t,this.x)),this.y=Math.max(e,Math.min(t,this.y)),this}clampLength(e,t){const i=this.length();return this.divideScalar(i||1).multiplyScalar(Math.max(e,Math.min(t,i)))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this}negate(){return this.x=-this.x,this.y=-this.y,this}dot(e){return this.x*e.x+this.y*e.y}cross(e){return this.x*e.y-this.y*e.x}lengthSq(){return this.x*this.x+this.y*this.y}length(){return Math.sqrt(this.x*this.x+this.y*this.y)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)}normalize(){return this.divideScalar(this.length()||1)}angle(){return Math.atan2(-this.y,-this.x)+Math.PI}angleTo(e){const t=Math.sqrt(this.lengthSq()*e.lengthSq());if(t===0)return Math.PI/2;const i=this.dot(e)/t;return Math.acos(At(i,-1,1))}distanceTo(e){return Math.sqrt(this.distanceToSquared(e))}distanceToSquared(e){const t=this.x-e.x,i=this.y-e.y;return t*t+i*i}manhattanDistanceTo(e){return Math.abs(this.x-e.x)+Math.abs(this.y-e.y)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this}lerpVectors(e,t,i){return this.x=e.x+(t.x-e.x)*i,this.y=e.y+(t.y-e.y)*i,this}equals(e){return e.x===this.x&&e.y===this.y}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this}rotateAround(e,t){const i=Math.cos(t),r=Math.sin(t),s=this.x-e.x,a=this.y-e.y;return this.x=s*i-a*r+e.x,this.y=s*r+a*i+e.y,this}random(){return this.x=Math.random(),this.y=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y}}class Ne{constructor(e,t,i,r,s,a,o,l,c){Ne.prototype.isMatrix3=!0,this.elements=[1,0,0,0,1,0,0,0,1],e!==void 0&&this.set(e,t,i,r,s,a,o,l,c)}set(e,t,i,r,s,a,o,l,c){const u=this.elements;return u[0]=e,u[1]=r,u[2]=o,u[3]=t,u[4]=s,u[5]=l,u[6]=i,u[7]=a,u[8]=c,this}identity(){return this.set(1,0,0,0,1,0,0,0,1),this}copy(e){const t=this.elements,i=e.elements;return t[0]=i[0],t[1]=i[1],t[2]=i[2],t[3]=i[3],t[4]=i[4],t[5]=i[5],t[6]=i[6],t[7]=i[7],t[8]=i[8],this}extractBasis(e,t,i){return e.setFromMatrix3Column(this,0),t.setFromMatrix3Column(this,1),i.setFromMatrix3Column(this,2),this}setFromMatrix4(e){const t=e.elements;return this.set(t[0],t[4],t[8],t[1],t[5],t[9],t[2],t[6],t[10]),this}multiply(e){return this.multiplyMatrices(this,e)}premultiply(e){return this.multiplyMatrices(e,this)}multiplyMatrices(e,t){const i=e.elements,r=t.elements,s=this.elements,a=i[0],o=i[3],l=i[6],c=i[1],u=i[4],f=i[7],d=i[2],m=i[5],g=i[8],_=r[0],p=r[3],h=r[6],T=r[1],S=r[4],M=r[7],P=r[2],b=r[5],R=r[8];return s[0]=a*_+o*T+l*P,s[3]=a*p+o*S+l*b,s[6]=a*h+o*M+l*R,s[1]=c*_+u*T+f*P,s[4]=c*p+u*S+f*b,s[7]=c*h+u*M+f*R,s[2]=d*_+m*T+g*P,s[5]=d*p+m*S+g*b,s[8]=d*h+m*M+g*R,this}multiplyScalar(e){const t=this.elements;return t[0]*=e,t[3]*=e,t[6]*=e,t[1]*=e,t[4]*=e,t[7]*=e,t[2]*=e,t[5]*=e,t[8]*=e,this}determinant(){const e=this.elements,t=e[0],i=e[1],r=e[2],s=e[3],a=e[4],o=e[5],l=e[6],c=e[7],u=e[8];return t*a*u-t*o*c-i*s*u+i*o*l+r*s*c-r*a*l}invert(){const e=this.elements,t=e[0],i=e[1],r=e[2],s=e[3],a=e[4],o=e[5],l=e[6],c=e[7],u=e[8],f=u*a-o*c,d=o*l-u*s,m=c*s-a*l,g=t*f+i*d+r*m;if(g===0)return this.set(0,0,0,0,0,0,0,0,0);const _=1/g;return e[0]=f*_,e[1]=(r*c-u*i)*_,e[2]=(o*i-r*a)*_,e[3]=d*_,e[4]=(u*t-r*l)*_,e[5]=(r*s-o*t)*_,e[6]=m*_,e[7]=(i*l-c*t)*_,e[8]=(a*t-i*s)*_,this}transpose(){let e;const t=this.elements;return e=t[1],t[1]=t[3],t[3]=e,e=t[2],t[2]=t[6],t[6]=e,e=t[5],t[5]=t[7],t[7]=e,this}getNormalMatrix(e){return this.setFromMatrix4(e).invert().transpose()}transposeIntoArray(e){const t=this.elements;return e[0]=t[0],e[1]=t[3],e[2]=t[6],e[3]=t[1],e[4]=t[4],e[5]=t[7],e[6]=t[2],e[7]=t[5],e[8]=t[8],this}setUvTransform(e,t,i,r,s,a,o){const l=Math.cos(s),c=Math.sin(s);return this.set(i*l,i*c,-i*(l*a+c*o)+a+e,-r*c,r*l,-r*(-c*a+l*o)+o+t,0,0,1),this}scale(e,t){return this.premultiply(As.makeScale(e,t)),this}rotate(e){return this.premultiply(As.makeRotation(-e)),this}translate(e,t){return this.premultiply(As.makeTranslation(e,t)),this}makeTranslation(e,t){return e.isVector2?this.set(1,0,e.x,0,1,e.y,0,0,1):this.set(1,0,e,0,1,t,0,0,1),this}makeRotation(e){const t=Math.cos(e),i=Math.sin(e);return this.set(t,-i,0,i,t,0,0,0,1),this}makeScale(e,t){return this.set(e,0,0,0,t,0,0,0,1),this}equals(e){const t=this.elements,i=e.elements;for(let r=0;r<9;r++)if(t[r]!==i[r])return!1;return!0}fromArray(e,t=0){for(let i=0;i<9;i++)this.elements[i]=e[i+t];return this}toArray(e=[],t=0){const i=this.elements;return e[t]=i[0],e[t+1]=i[1],e[t+2]=i[2],e[t+3]=i[3],e[t+4]=i[4],e[t+5]=i[5],e[t+6]=i[6],e[t+7]=i[7],e[t+8]=i[8],e}clone(){return new this.constructor().fromArray(this.elements)}}const As=new Ne;function Xl(n){for(let e=n.length-1;e>=0;--e)if(n[e]>=65535)return!0;return!1}function os(n){return document.createElementNS("http://www.w3.org/1999/xhtml",n)}function Du(){const n=os("canvas");return n.style.display="block",n}const bo={};function rr(n){n in bo||(bo[n]=!0,console.warn(n))}function Lu(n,e,t){return new Promise(function(i,r){function s(){switch(n.clientWaitSync(e,n.SYNC_FLUSH_COMMANDS_BIT,0)){case n.WAIT_FAILED:r();break;case n.TIMEOUT_EXPIRED:setTimeout(s,t);break;default:i()}}setTimeout(s,t)})}function Iu(n){const e=n.elements;e[2]=.5*e[2]+.5*e[3],e[6]=.5*e[6]+.5*e[7],e[10]=.5*e[10]+.5*e[11],e[14]=.5*e[14]+.5*e[15]}function Uu(n){const e=n.elements;e[11]===-1?(e[10]=-e[10]-1,e[14]=-e[14]):(e[10]=-e[10],e[14]=-e[14]+1)}const Xe={enabled:!0,workingColorSpace:Wi,spaces:{},convert:function(n,e,t){return this.enabled===!1||e===t||!e||!t||(this.spaces[e].transfer===Qe&&(n.r=_n(n.r),n.g=_n(n.g),n.b=_n(n.b)),this.spaces[e].primaries!==this.spaces[t].primaries&&(n.applyMatrix3(this.spaces[e].toXYZ),n.applyMatrix3(this.spaces[t].fromXYZ)),this.spaces[t].transfer===Qe&&(n.r=Li(n.r),n.g=Li(n.g),n.b=Li(n.b))),n},fromWorkingColorSpace:function(n,e){return this.convert(n,this.workingColorSpace,e)},toWorkingColorSpace:function(n,e){return this.convert(n,e,this.workingColorSpace)},getPrimaries:function(n){return this.spaces[n].primaries},getTransfer:function(n){return n===Nn?ps:this.spaces[n].transfer},getLuminanceCoefficients:function(n,e=this.workingColorSpace){return n.fromArray(this.spaces[e].luminanceCoefficients)},define:function(n){Object.assign(this.spaces,n)},_getMatrix:function(n,e,t){return n.copy(this.spaces[e].toXYZ).multiply(this.spaces[t].fromXYZ)},_getDrawingBufferColorSpace:function(n){return this.spaces[n].outputColorSpaceConfig.drawingBufferColorSpace},_getUnpackColorSpace:function(n=this.workingColorSpace){return this.spaces[n].workingColorSpaceConfig.unpackColorSpace}};function _n(n){return n<.04045?n*.0773993808:Math.pow(n*.9478672986+.0521327014,2.4)}function Li(n){return n<.0031308?n*12.92:1.055*Math.pow(n,.41666)-.055}const wo=[.64,.33,.3,.6,.15,.06],Ro=[.2126,.7152,.0722],Co=[.3127,.329],Po=new Ne().set(.4123908,.3575843,.1804808,.212639,.7151687,.0721923,.0193308,.1191948,.9505322),Do=new Ne().set(3.2409699,-1.5373832,-.4986108,-.9692436,1.8759675,.0415551,.0556301,-.203977,1.0569715);Xe.define({[Wi]:{primaries:wo,whitePoint:Co,transfer:ps,toXYZ:Po,fromXYZ:Do,luminanceCoefficients:Ro,workingColorSpaceConfig:{unpackColorSpace:Ot},outputColorSpaceConfig:{drawingBufferColorSpace:Ot}},[Ot]:{primaries:wo,whitePoint:Co,transfer:Qe,toXYZ:Po,fromXYZ:Do,luminanceCoefficients:Ro,outputColorSpaceConfig:{drawingBufferColorSpace:Ot}}});let fi;class Nu{static getDataURL(e){if(/^data:/i.test(e.src)||typeof HTMLCanvasElement>"u")return e.src;let t;if(e instanceof HTMLCanvasElement)t=e;else{fi===void 0&&(fi=os("canvas")),fi.width=e.width,fi.height=e.height;const i=fi.getContext("2d");e instanceof ImageData?i.putImageData(e,0,0):i.drawImage(e,0,0,e.width,e.height),t=fi}return t.width>2048||t.height>2048?(console.warn("THREE.ImageUtils.getDataURL: Image converted to jpg for performance reasons",e),t.toDataURL("image/jpeg",.6)):t.toDataURL("image/png")}static sRGBToLinear(e){if(typeof HTMLImageElement<"u"&&e instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&e instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&e instanceof ImageBitmap){const t=os("canvas");t.width=e.width,t.height=e.height;const i=t.getContext("2d");i.drawImage(e,0,0,e.width,e.height);const r=i.getImageData(0,0,e.width,e.height),s=r.data;for(let a=0;a<s.length;a++)s[a]=_n(s[a]/255)*255;return i.putImageData(r,0,0),t}else if(e.data){const t=e.data.slice(0);for(let i=0;i<t.length;i++)t instanceof Uint8Array||t instanceof Uint8ClampedArray?t[i]=Math.floor(_n(t[i]/255)*255):t[i]=_n(t[i]);return{data:t,width:e.width,height:e.height}}else return console.warn("THREE.ImageUtils.sRGBToLinear(): Unsupported image type. No color space conversion applied."),e}}let Fu=0;class ql{constructor(e=null){this.isSource=!0,Object.defineProperty(this,"id",{value:Fu++}),this.uuid=gr(),this.data=e,this.dataReady=!0,this.version=0}set needsUpdate(e){e===!0&&this.version++}toJSON(e){const t=e===void 0||typeof e=="string";if(!t&&e.images[this.uuid]!==void 0)return e.images[this.uuid];const i={uuid:this.uuid,url:""},r=this.data;if(r!==null){let s;if(Array.isArray(r)){s=[];for(let a=0,o=r.length;a<o;a++)r[a].isDataTexture?s.push(bs(r[a].image)):s.push(bs(r[a]))}else s=bs(r);i.url=s}return t||(e.images[this.uuid]=i),i}}function bs(n){return typeof HTMLImageElement<"u"&&n instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&n instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&n instanceof ImageBitmap?Nu.getDataURL(n):n.data?{data:Array.from(n.data),width:n.width,height:n.height,type:n.data.constructor.name}:(console.warn("THREE.Texture: Unable to serialize Texture."),{})}let Ou=0;class Mt extends Xi{constructor(e=Mt.DEFAULT_IMAGE,t=Mt.DEFAULT_MAPPING,i=ni,r=ni,s=Bt,a=ii,o=zt,l=Jt,c=Mt.DEFAULT_ANISOTROPY,u=Nn){super(),this.isTexture=!0,Object.defineProperty(this,"id",{value:Ou++}),this.uuid=gr(),this.name="",this.source=new ql(e),this.mipmaps=[],this.mapping=t,this.channel=0,this.wrapS=i,this.wrapT=r,this.magFilter=s,this.minFilter=a,this.anisotropy=c,this.format=o,this.internalFormat=null,this.type=l,this.offset=new Ge(0,0),this.repeat=new Ge(1,1),this.center=new Ge(0,0),this.rotation=0,this.matrixAutoUpdate=!0,this.matrix=new Ne,this.generateMipmaps=!0,this.premultiplyAlpha=!1,this.flipY=!0,this.unpackAlignment=4,this.colorSpace=u,this.userData={},this.version=0,this.onUpdate=null,this.isRenderTargetTexture=!1,this.pmremVersion=0}get image(){return this.source.data}set image(e=null){this.source.data=e}updateMatrix(){this.matrix.setUvTransform(this.offset.x,this.offset.y,this.repeat.x,this.repeat.y,this.rotation,this.center.x,this.center.y)}clone(){return new this.constructor().copy(this)}copy(e){return this.name=e.name,this.source=e.source,this.mipmaps=e.mipmaps.slice(0),this.mapping=e.mapping,this.channel=e.channel,this.wrapS=e.wrapS,this.wrapT=e.wrapT,this.magFilter=e.magFilter,this.minFilter=e.minFilter,this.anisotropy=e.anisotropy,this.format=e.format,this.internalFormat=e.internalFormat,this.type=e.type,this.offset.copy(e.offset),this.repeat.copy(e.repeat),this.center.copy(e.center),this.rotation=e.rotation,this.matrixAutoUpdate=e.matrixAutoUpdate,this.matrix.copy(e.matrix),this.generateMipmaps=e.generateMipmaps,this.premultiplyAlpha=e.premultiplyAlpha,this.flipY=e.flipY,this.unpackAlignment=e.unpackAlignment,this.colorSpace=e.colorSpace,this.userData=JSON.parse(JSON.stringify(e.userData)),this.needsUpdate=!0,this}toJSON(e){const t=e===void 0||typeof e=="string";if(!t&&e.textures[this.uuid]!==void 0)return e.textures[this.uuid];const i={metadata:{version:4.6,type:"Texture",generator:"Texture.toJSON"},uuid:this.uuid,name:this.name,image:this.source.toJSON(e).uuid,mapping:this.mapping,channel:this.channel,repeat:[this.repeat.x,this.repeat.y],offset:[this.offset.x,this.offset.y],center:[this.center.x,this.center.y],rotation:this.rotation,wrap:[this.wrapS,this.wrapT],format:this.format,internalFormat:this.internalFormat,type:this.type,colorSpace:this.colorSpace,minFilter:this.minFilter,magFilter:this.magFilter,anisotropy:this.anisotropy,flipY:this.flipY,generateMipmaps:this.generateMipmaps,premultiplyAlpha:this.premultiplyAlpha,unpackAlignment:this.unpackAlignment};return Object.keys(this.userData).length>0&&(i.userData=this.userData),t||(e.textures[this.uuid]=i),i}dispose(){this.dispatchEvent({type:"dispose"})}transformUv(e){if(this.mapping!==Il)return e;if(e.applyMatrix3(this.matrix),e.x<0||e.x>1)switch(this.wrapS){case ma:e.x=e.x-Math.floor(e.x);break;case ni:e.x=e.x<0?0:1;break;case ga:Math.abs(Math.floor(e.x)%2)===1?e.x=Math.ceil(e.x)-e.x:e.x=e.x-Math.floor(e.x);break}if(e.y<0||e.y>1)switch(this.wrapT){case ma:e.y=e.y-Math.floor(e.y);break;case ni:e.y=e.y<0?0:1;break;case ga:Math.abs(Math.floor(e.y)%2)===1?e.y=Math.ceil(e.y)-e.y:e.y=e.y-Math.floor(e.y);break}return this.flipY&&(e.y=1-e.y),e}set needsUpdate(e){e===!0&&(this.version++,this.source.needsUpdate=!0)}set needsPMREMUpdate(e){e===!0&&this.pmremVersion++}}Mt.DEFAULT_IMAGE=null;Mt.DEFAULT_MAPPING=Il;Mt.DEFAULT_ANISOTROPY=1;class tt{constructor(e=0,t=0,i=0,r=1){tt.prototype.isVector4=!0,this.x=e,this.y=t,this.z=i,this.w=r}get width(){return this.z}set width(e){this.z=e}get height(){return this.w}set height(e){this.w=e}set(e,t,i,r){return this.x=e,this.y=t,this.z=i,this.w=r,this}setScalar(e){return this.x=e,this.y=e,this.z=e,this.w=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setZ(e){return this.z=e,this}setW(e){return this.w=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;case 2:this.z=t;break;case 3:this.w=t;break;default:throw new Error("index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;case 2:return this.z;case 3:return this.w;default:throw new Error("index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y,this.z,this.w)}copy(e){return this.x=e.x,this.y=e.y,this.z=e.z,this.w=e.w!==void 0?e.w:1,this}add(e){return this.x+=e.x,this.y+=e.y,this.z+=e.z,this.w+=e.w,this}addScalar(e){return this.x+=e,this.y+=e,this.z+=e,this.w+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this.z=e.z+t.z,this.w=e.w+t.w,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this.z+=e.z*t,this.w+=e.w*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this.z-=e.z,this.w-=e.w,this}subScalar(e){return this.x-=e,this.y-=e,this.z-=e,this.w-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this.z=e.z-t.z,this.w=e.w-t.w,this}multiply(e){return this.x*=e.x,this.y*=e.y,this.z*=e.z,this.w*=e.w,this}multiplyScalar(e){return this.x*=e,this.y*=e,this.z*=e,this.w*=e,this}applyMatrix4(e){const t=this.x,i=this.y,r=this.z,s=this.w,a=e.elements;return this.x=a[0]*t+a[4]*i+a[8]*r+a[12]*s,this.y=a[1]*t+a[5]*i+a[9]*r+a[13]*s,this.z=a[2]*t+a[6]*i+a[10]*r+a[14]*s,this.w=a[3]*t+a[7]*i+a[11]*r+a[15]*s,this}divide(e){return this.x/=e.x,this.y/=e.y,this.z/=e.z,this.w/=e.w,this}divideScalar(e){return this.multiplyScalar(1/e)}setAxisAngleFromQuaternion(e){this.w=2*Math.acos(e.w);const t=Math.sqrt(1-e.w*e.w);return t<1e-4?(this.x=1,this.y=0,this.z=0):(this.x=e.x/t,this.y=e.y/t,this.z=e.z/t),this}setAxisAngleFromRotationMatrix(e){let t,i,r,s;const l=e.elements,c=l[0],u=l[4],f=l[8],d=l[1],m=l[5],g=l[9],_=l[2],p=l[6],h=l[10];if(Math.abs(u-d)<.01&&Math.abs(f-_)<.01&&Math.abs(g-p)<.01){if(Math.abs(u+d)<.1&&Math.abs(f+_)<.1&&Math.abs(g+p)<.1&&Math.abs(c+m+h-3)<.1)return this.set(1,0,0,0),this;t=Math.PI;const S=(c+1)/2,M=(m+1)/2,P=(h+1)/2,b=(u+d)/4,R=(f+_)/4,L=(g+p)/4;return S>M&&S>P?S<.01?(i=0,r=.707106781,s=.707106781):(i=Math.sqrt(S),r=b/i,s=R/i):M>P?M<.01?(i=.707106781,r=0,s=.707106781):(r=Math.sqrt(M),i=b/r,s=L/r):P<.01?(i=.707106781,r=.707106781,s=0):(s=Math.sqrt(P),i=R/s,r=L/s),this.set(i,r,s,t),this}let T=Math.sqrt((p-g)*(p-g)+(f-_)*(f-_)+(d-u)*(d-u));return Math.abs(T)<.001&&(T=1),this.x=(p-g)/T,this.y=(f-_)/T,this.z=(d-u)/T,this.w=Math.acos((c+m+h-1)/2),this}setFromMatrixPosition(e){const t=e.elements;return this.x=t[12],this.y=t[13],this.z=t[14],this.w=t[15],this}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this.z=Math.min(this.z,e.z),this.w=Math.min(this.w,e.w),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this.z=Math.max(this.z,e.z),this.w=Math.max(this.w,e.w),this}clamp(e,t){return this.x=Math.max(e.x,Math.min(t.x,this.x)),this.y=Math.max(e.y,Math.min(t.y,this.y)),this.z=Math.max(e.z,Math.min(t.z,this.z)),this.w=Math.max(e.w,Math.min(t.w,this.w)),this}clampScalar(e,t){return this.x=Math.max(e,Math.min(t,this.x)),this.y=Math.max(e,Math.min(t,this.y)),this.z=Math.max(e,Math.min(t,this.z)),this.w=Math.max(e,Math.min(t,this.w)),this}clampLength(e,t){const i=this.length();return this.divideScalar(i||1).multiplyScalar(Math.max(e,Math.min(t,i)))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this.w=Math.floor(this.w),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this.w=Math.ceil(this.w),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this.w=Math.round(this.w),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this.w=Math.trunc(this.w),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this.w=-this.w,this}dot(e){return this.x*e.x+this.y*e.y+this.z*e.z+this.w*e.w}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)+Math.abs(this.w)}normalize(){return this.divideScalar(this.length()||1)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this.z+=(e.z-this.z)*t,this.w+=(e.w-this.w)*t,this}lerpVectors(e,t,i){return this.x=e.x+(t.x-e.x)*i,this.y=e.y+(t.y-e.y)*i,this.z=e.z+(t.z-e.z)*i,this.w=e.w+(t.w-e.w)*i,this}equals(e){return e.x===this.x&&e.y===this.y&&e.z===this.z&&e.w===this.w}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this.z=e[t+2],this.w=e[t+3],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e[t+2]=this.z,e[t+3]=this.w,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this.z=e.getZ(t),this.w=e.getW(t),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this.w=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z,yield this.w}}class Bu extends Xi{constructor(e=1,t=1,i={}){super(),this.isRenderTarget=!0,this.width=e,this.height=t,this.depth=1,this.scissor=new tt(0,0,e,t),this.scissorTest=!1,this.viewport=new tt(0,0,e,t);const r={width:e,height:t,depth:1};i=Object.assign({generateMipmaps:!1,internalFormat:null,minFilter:Bt,depthBuffer:!0,stencilBuffer:!1,resolveDepthBuffer:!0,resolveStencilBuffer:!0,depthTexture:null,samples:0,count:1},i);const s=new Mt(r,i.mapping,i.wrapS,i.wrapT,i.magFilter,i.minFilter,i.format,i.type,i.anisotropy,i.colorSpace);s.flipY=!1,s.generateMipmaps=i.generateMipmaps,s.internalFormat=i.internalFormat,this.textures=[];const a=i.count;for(let o=0;o<a;o++)this.textures[o]=s.clone(),this.textures[o].isRenderTargetTexture=!0;this.depthBuffer=i.depthBuffer,this.stencilBuffer=i.stencilBuffer,this.resolveDepthBuffer=i.resolveDepthBuffer,this.resolveStencilBuffer=i.resolveStencilBuffer,this.depthTexture=i.depthTexture,this.samples=i.samples}get texture(){return this.textures[0]}set texture(e){this.textures[0]=e}setSize(e,t,i=1){if(this.width!==e||this.height!==t||this.depth!==i){this.width=e,this.height=t,this.depth=i;for(let r=0,s=this.textures.length;r<s;r++)this.textures[r].image.width=e,this.textures[r].image.height=t,this.textures[r].image.depth=i;this.dispose()}this.viewport.set(0,0,e,t),this.scissor.set(0,0,e,t)}clone(){return new this.constructor().copy(this)}copy(e){this.width=e.width,this.height=e.height,this.depth=e.depth,this.scissor.copy(e.scissor),this.scissorTest=e.scissorTest,this.viewport.copy(e.viewport),this.textures.length=0;for(let i=0,r=e.textures.length;i<r;i++)this.textures[i]=e.textures[i].clone(),this.textures[i].isRenderTargetTexture=!0;const t=Object.assign({},e.texture.image);return this.texture.source=new ql(t),this.depthBuffer=e.depthBuffer,this.stencilBuffer=e.stencilBuffer,this.resolveDepthBuffer=e.resolveDepthBuffer,this.resolveStencilBuffer=e.resolveStencilBuffer,e.depthTexture!==null&&(this.depthTexture=e.depthTexture.clone()),this.samples=e.samples,this}dispose(){this.dispatchEvent({type:"dispose"})}}class Sn extends Bu{constructor(e=1,t=1,i={}){super(e,t,i),this.isWebGLRenderTarget=!0}}class Yl extends Mt{constructor(e=null,t=1,i=1,r=1){super(null),this.isDataArrayTexture=!0,this.image={data:e,width:t,height:i,depth:r},this.magFilter=ft,this.minFilter=ft,this.wrapR=ni,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1,this.layerUpdates=new Set}addLayerUpdate(e){this.layerUpdates.add(e)}clearLayerUpdates(){this.layerUpdates.clear()}}class zu extends Mt{constructor(e=null,t=1,i=1,r=1){super(null),this.isData3DTexture=!0,this.image={data:e,width:t,height:i,depth:r},this.magFilter=ft,this.minFilter=ft,this.wrapR=ni,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}}class qi{constructor(e=0,t=0,i=0,r=1){this.isQuaternion=!0,this._x=e,this._y=t,this._z=i,this._w=r}static slerpFlat(e,t,i,r,s,a,o){let l=i[r+0],c=i[r+1],u=i[r+2],f=i[r+3];const d=s[a+0],m=s[a+1],g=s[a+2],_=s[a+3];if(o===0){e[t+0]=l,e[t+1]=c,e[t+2]=u,e[t+3]=f;return}if(o===1){e[t+0]=d,e[t+1]=m,e[t+2]=g,e[t+3]=_;return}if(f!==_||l!==d||c!==m||u!==g){let p=1-o;const h=l*d+c*m+u*g+f*_,T=h>=0?1:-1,S=1-h*h;if(S>Number.EPSILON){const P=Math.sqrt(S),b=Math.atan2(P,h*T);p=Math.sin(p*b)/P,o=Math.sin(o*b)/P}const M=o*T;if(l=l*p+d*M,c=c*p+m*M,u=u*p+g*M,f=f*p+_*M,p===1-o){const P=1/Math.sqrt(l*l+c*c+u*u+f*f);l*=P,c*=P,u*=P,f*=P}}e[t]=l,e[t+1]=c,e[t+2]=u,e[t+3]=f}static multiplyQuaternionsFlat(e,t,i,r,s,a){const o=i[r],l=i[r+1],c=i[r+2],u=i[r+3],f=s[a],d=s[a+1],m=s[a+2],g=s[a+3];return e[t]=o*g+u*f+l*m-c*d,e[t+1]=l*g+u*d+c*f-o*m,e[t+2]=c*g+u*m+o*d-l*f,e[t+3]=u*g-o*f-l*d-c*m,e}get x(){return this._x}set x(e){this._x=e,this._onChangeCallback()}get y(){return this._y}set y(e){this._y=e,this._onChangeCallback()}get z(){return this._z}set z(e){this._z=e,this._onChangeCallback()}get w(){return this._w}set w(e){this._w=e,this._onChangeCallback()}set(e,t,i,r){return this._x=e,this._y=t,this._z=i,this._w=r,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._w)}copy(e){return this._x=e.x,this._y=e.y,this._z=e.z,this._w=e.w,this._onChangeCallback(),this}setFromEuler(e,t=!0){const i=e._x,r=e._y,s=e._z,a=e._order,o=Math.cos,l=Math.sin,c=o(i/2),u=o(r/2),f=o(s/2),d=l(i/2),m=l(r/2),g=l(s/2);switch(a){case"XYZ":this._x=d*u*f+c*m*g,this._y=c*m*f-d*u*g,this._z=c*u*g+d*m*f,this._w=c*u*f-d*m*g;break;case"YXZ":this._x=d*u*f+c*m*g,this._y=c*m*f-d*u*g,this._z=c*u*g-d*m*f,this._w=c*u*f+d*m*g;break;case"ZXY":this._x=d*u*f-c*m*g,this._y=c*m*f+d*u*g,this._z=c*u*g+d*m*f,this._w=c*u*f-d*m*g;break;case"ZYX":this._x=d*u*f-c*m*g,this._y=c*m*f+d*u*g,this._z=c*u*g-d*m*f,this._w=c*u*f+d*m*g;break;case"YZX":this._x=d*u*f+c*m*g,this._y=c*m*f+d*u*g,this._z=c*u*g-d*m*f,this._w=c*u*f-d*m*g;break;case"XZY":this._x=d*u*f-c*m*g,this._y=c*m*f-d*u*g,this._z=c*u*g+d*m*f,this._w=c*u*f+d*m*g;break;default:console.warn("THREE.Quaternion: .setFromEuler() encountered an unknown order: "+a)}return t===!0&&this._onChangeCallback(),this}setFromAxisAngle(e,t){const i=t/2,r=Math.sin(i);return this._x=e.x*r,this._y=e.y*r,this._z=e.z*r,this._w=Math.cos(i),this._onChangeCallback(),this}setFromRotationMatrix(e){const t=e.elements,i=t[0],r=t[4],s=t[8],a=t[1],o=t[5],l=t[9],c=t[2],u=t[6],f=t[10],d=i+o+f;if(d>0){const m=.5/Math.sqrt(d+1);this._w=.25/m,this._x=(u-l)*m,this._y=(s-c)*m,this._z=(a-r)*m}else if(i>o&&i>f){const m=2*Math.sqrt(1+i-o-f);this._w=(u-l)/m,this._x=.25*m,this._y=(r+a)/m,this._z=(s+c)/m}else if(o>f){const m=2*Math.sqrt(1+o-i-f);this._w=(s-c)/m,this._x=(r+a)/m,this._y=.25*m,this._z=(l+u)/m}else{const m=2*Math.sqrt(1+f-i-o);this._w=(a-r)/m,this._x=(s+c)/m,this._y=(l+u)/m,this._z=.25*m}return this._onChangeCallback(),this}setFromUnitVectors(e,t){let i=e.dot(t)+1;return i<Number.EPSILON?(i=0,Math.abs(e.x)>Math.abs(e.z)?(this._x=-e.y,this._y=e.x,this._z=0,this._w=i):(this._x=0,this._y=-e.z,this._z=e.y,this._w=i)):(this._x=e.y*t.z-e.z*t.y,this._y=e.z*t.x-e.x*t.z,this._z=e.x*t.y-e.y*t.x,this._w=i),this.normalize()}angleTo(e){return 2*Math.acos(Math.abs(At(this.dot(e),-1,1)))}rotateTowards(e,t){const i=this.angleTo(e);if(i===0)return this;const r=Math.min(1,t/i);return this.slerp(e,r),this}identity(){return this.set(0,0,0,1)}invert(){return this.conjugate()}conjugate(){return this._x*=-1,this._y*=-1,this._z*=-1,this._onChangeCallback(),this}dot(e){return this._x*e._x+this._y*e._y+this._z*e._z+this._w*e._w}lengthSq(){return this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w}length(){return Math.sqrt(this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w)}normalize(){let e=this.length();return e===0?(this._x=0,this._y=0,this._z=0,this._w=1):(e=1/e,this._x=this._x*e,this._y=this._y*e,this._z=this._z*e,this._w=this._w*e),this._onChangeCallback(),this}multiply(e){return this.multiplyQuaternions(this,e)}premultiply(e){return this.multiplyQuaternions(e,this)}multiplyQuaternions(e,t){const i=e._x,r=e._y,s=e._z,a=e._w,o=t._x,l=t._y,c=t._z,u=t._w;return this._x=i*u+a*o+r*c-s*l,this._y=r*u+a*l+s*o-i*c,this._z=s*u+a*c+i*l-r*o,this._w=a*u-i*o-r*l-s*c,this._onChangeCallback(),this}slerp(e,t){if(t===0)return this;if(t===1)return this.copy(e);const i=this._x,r=this._y,s=this._z,a=this._w;let o=a*e._w+i*e._x+r*e._y+s*e._z;if(o<0?(this._w=-e._w,this._x=-e._x,this._y=-e._y,this._z=-e._z,o=-o):this.copy(e),o>=1)return this._w=a,this._x=i,this._y=r,this._z=s,this;const l=1-o*o;if(l<=Number.EPSILON){const m=1-t;return this._w=m*a+t*this._w,this._x=m*i+t*this._x,this._y=m*r+t*this._y,this._z=m*s+t*this._z,this.normalize(),this}const c=Math.sqrt(l),u=Math.atan2(c,o),f=Math.sin((1-t)*u)/c,d=Math.sin(t*u)/c;return this._w=a*f+this._w*d,this._x=i*f+this._x*d,this._y=r*f+this._y*d,this._z=s*f+this._z*d,this._onChangeCallback(),this}slerpQuaternions(e,t,i){return this.copy(e).slerp(t,i)}random(){const e=2*Math.PI*Math.random(),t=2*Math.PI*Math.random(),i=Math.random(),r=Math.sqrt(1-i),s=Math.sqrt(i);return this.set(r*Math.sin(e),r*Math.cos(e),s*Math.sin(t),s*Math.cos(t))}equals(e){return e._x===this._x&&e._y===this._y&&e._z===this._z&&e._w===this._w}fromArray(e,t=0){return this._x=e[t],this._y=e[t+1],this._z=e[t+2],this._w=e[t+3],this._onChangeCallback(),this}toArray(e=[],t=0){return e[t]=this._x,e[t+1]=this._y,e[t+2]=this._z,e[t+3]=this._w,e}fromBufferAttribute(e,t){return this._x=e.getX(t),this._y=e.getY(t),this._z=e.getZ(t),this._w=e.getW(t),this._onChangeCallback(),this}toJSON(){return this.toArray()}_onChange(e){return this._onChangeCallback=e,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._w}}class N{constructor(e=0,t=0,i=0){N.prototype.isVector3=!0,this.x=e,this.y=t,this.z=i}set(e,t,i){return i===void 0&&(i=this.z),this.x=e,this.y=t,this.z=i,this}setScalar(e){return this.x=e,this.y=e,this.z=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setZ(e){return this.z=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;case 2:this.z=t;break;default:throw new Error("index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;case 2:return this.z;default:throw new Error("index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y,this.z)}copy(e){return this.x=e.x,this.y=e.y,this.z=e.z,this}add(e){return this.x+=e.x,this.y+=e.y,this.z+=e.z,this}addScalar(e){return this.x+=e,this.y+=e,this.z+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this.z=e.z+t.z,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this.z+=e.z*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this.z-=e.z,this}subScalar(e){return this.x-=e,this.y-=e,this.z-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this.z=e.z-t.z,this}multiply(e){return this.x*=e.x,this.y*=e.y,this.z*=e.z,this}multiplyScalar(e){return this.x*=e,this.y*=e,this.z*=e,this}multiplyVectors(e,t){return this.x=e.x*t.x,this.y=e.y*t.y,this.z=e.z*t.z,this}applyEuler(e){return this.applyQuaternion(Lo.setFromEuler(e))}applyAxisAngle(e,t){return this.applyQuaternion(Lo.setFromAxisAngle(e,t))}applyMatrix3(e){const t=this.x,i=this.y,r=this.z,s=e.elements;return this.x=s[0]*t+s[3]*i+s[6]*r,this.y=s[1]*t+s[4]*i+s[7]*r,this.z=s[2]*t+s[5]*i+s[8]*r,this}applyNormalMatrix(e){return this.applyMatrix3(e).normalize()}applyMatrix4(e){const t=this.x,i=this.y,r=this.z,s=e.elements,a=1/(s[3]*t+s[7]*i+s[11]*r+s[15]);return this.x=(s[0]*t+s[4]*i+s[8]*r+s[12])*a,this.y=(s[1]*t+s[5]*i+s[9]*r+s[13])*a,this.z=(s[2]*t+s[6]*i+s[10]*r+s[14])*a,this}applyQuaternion(e){const t=this.x,i=this.y,r=this.z,s=e.x,a=e.y,o=e.z,l=e.w,c=2*(a*r-o*i),u=2*(o*t-s*r),f=2*(s*i-a*t);return this.x=t+l*c+a*f-o*u,this.y=i+l*u+o*c-s*f,this.z=r+l*f+s*u-a*c,this}project(e){return this.applyMatrix4(e.matrixWorldInverse).applyMatrix4(e.projectionMatrix)}unproject(e){return this.applyMatrix4(e.projectionMatrixInverse).applyMatrix4(e.matrixWorld)}transformDirection(e){const t=this.x,i=this.y,r=this.z,s=e.elements;return this.x=s[0]*t+s[4]*i+s[8]*r,this.y=s[1]*t+s[5]*i+s[9]*r,this.z=s[2]*t+s[6]*i+s[10]*r,this.normalize()}divide(e){return this.x/=e.x,this.y/=e.y,this.z/=e.z,this}divideScalar(e){return this.multiplyScalar(1/e)}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this.z=Math.min(this.z,e.z),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this.z=Math.max(this.z,e.z),this}clamp(e,t){return this.x=Math.max(e.x,Math.min(t.x,this.x)),this.y=Math.max(e.y,Math.min(t.y,this.y)),this.z=Math.max(e.z,Math.min(t.z,this.z)),this}clampScalar(e,t){return this.x=Math.max(e,Math.min(t,this.x)),this.y=Math.max(e,Math.min(t,this.y)),this.z=Math.max(e,Math.min(t,this.z)),this}clampLength(e,t){const i=this.length();return this.divideScalar(i||1).multiplyScalar(Math.max(e,Math.min(t,i)))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this}dot(e){return this.x*e.x+this.y*e.y+this.z*e.z}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)}normalize(){return this.divideScalar(this.length()||1)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this.z+=(e.z-this.z)*t,this}lerpVectors(e,t,i){return this.x=e.x+(t.x-e.x)*i,this.y=e.y+(t.y-e.y)*i,this.z=e.z+(t.z-e.z)*i,this}cross(e){return this.crossVectors(this,e)}crossVectors(e,t){const i=e.x,r=e.y,s=e.z,a=t.x,o=t.y,l=t.z;return this.x=r*l-s*o,this.y=s*a-i*l,this.z=i*o-r*a,this}projectOnVector(e){const t=e.lengthSq();if(t===0)return this.set(0,0,0);const i=e.dot(this)/t;return this.copy(e).multiplyScalar(i)}projectOnPlane(e){return ws.copy(this).projectOnVector(e),this.sub(ws)}reflect(e){return this.sub(ws.copy(e).multiplyScalar(2*this.dot(e)))}angleTo(e){const t=Math.sqrt(this.lengthSq()*e.lengthSq());if(t===0)return Math.PI/2;const i=this.dot(e)/t;return Math.acos(At(i,-1,1))}distanceTo(e){return Math.sqrt(this.distanceToSquared(e))}distanceToSquared(e){const t=this.x-e.x,i=this.y-e.y,r=this.z-e.z;return t*t+i*i+r*r}manhattanDistanceTo(e){return Math.abs(this.x-e.x)+Math.abs(this.y-e.y)+Math.abs(this.z-e.z)}setFromSpherical(e){return this.setFromSphericalCoords(e.radius,e.phi,e.theta)}setFromSphericalCoords(e,t,i){const r=Math.sin(t)*e;return this.x=r*Math.sin(i),this.y=Math.cos(t)*e,this.z=r*Math.cos(i),this}setFromCylindrical(e){return this.setFromCylindricalCoords(e.radius,e.theta,e.y)}setFromCylindricalCoords(e,t,i){return this.x=e*Math.sin(t),this.y=i,this.z=e*Math.cos(t),this}setFromMatrixPosition(e){const t=e.elements;return this.x=t[12],this.y=t[13],this.z=t[14],this}setFromMatrixScale(e){const t=this.setFromMatrixColumn(e,0).length(),i=this.setFromMatrixColumn(e,1).length(),r=this.setFromMatrixColumn(e,2).length();return this.x=t,this.y=i,this.z=r,this}setFromMatrixColumn(e,t){return this.fromArray(e.elements,t*4)}setFromMatrix3Column(e,t){return this.fromArray(e.elements,t*3)}setFromEuler(e){return this.x=e._x,this.y=e._y,this.z=e._z,this}setFromColor(e){return this.x=e.r,this.y=e.g,this.z=e.b,this}equals(e){return e.x===this.x&&e.y===this.y&&e.z===this.z}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this.z=e[t+2],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e[t+2]=this.z,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this.z=e.getZ(t),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this}randomDirection(){const e=Math.random()*Math.PI*2,t=Math.random()*2-1,i=Math.sqrt(1-t*t);return this.x=i*Math.cos(e),this.y=t,this.z=i*Math.sin(e),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z}}const ws=new N,Lo=new qi;class _r{constructor(e=new N(1/0,1/0,1/0),t=new N(-1/0,-1/0,-1/0)){this.isBox3=!0,this.min=e,this.max=t}set(e,t){return this.min.copy(e),this.max.copy(t),this}setFromArray(e){this.makeEmpty();for(let t=0,i=e.length;t<i;t+=3)this.expandByPoint(qt.fromArray(e,t));return this}setFromBufferAttribute(e){this.makeEmpty();for(let t=0,i=e.count;t<i;t++)this.expandByPoint(qt.fromBufferAttribute(e,t));return this}setFromPoints(e){this.makeEmpty();for(let t=0,i=e.length;t<i;t++)this.expandByPoint(e[t]);return this}setFromCenterAndSize(e,t){const i=qt.copy(t).multiplyScalar(.5);return this.min.copy(e).sub(i),this.max.copy(e).add(i),this}setFromObject(e,t=!1){return this.makeEmpty(),this.expandByObject(e,t)}clone(){return new this.constructor().copy(this)}copy(e){return this.min.copy(e.min),this.max.copy(e.max),this}makeEmpty(){return this.min.x=this.min.y=this.min.z=1/0,this.max.x=this.max.y=this.max.z=-1/0,this}isEmpty(){return this.max.x<this.min.x||this.max.y<this.min.y||this.max.z<this.min.z}getCenter(e){return this.isEmpty()?e.set(0,0,0):e.addVectors(this.min,this.max).multiplyScalar(.5)}getSize(e){return this.isEmpty()?e.set(0,0,0):e.subVectors(this.max,this.min)}expandByPoint(e){return this.min.min(e),this.max.max(e),this}expandByVector(e){return this.min.sub(e),this.max.add(e),this}expandByScalar(e){return this.min.addScalar(-e),this.max.addScalar(e),this}expandByObject(e,t=!1){e.updateWorldMatrix(!1,!1);const i=e.geometry;if(i!==void 0){const s=i.getAttribute("position");if(t===!0&&s!==void 0&&e.isInstancedMesh!==!0)for(let a=0,o=s.count;a<o;a++)e.isMesh===!0?e.getVertexPosition(a,qt):qt.fromBufferAttribute(s,a),qt.applyMatrix4(e.matrixWorld),this.expandByPoint(qt);else e.boundingBox!==void 0?(e.boundingBox===null&&e.computeBoundingBox(),Tr.copy(e.boundingBox)):(i.boundingBox===null&&i.computeBoundingBox(),Tr.copy(i.boundingBox)),Tr.applyMatrix4(e.matrixWorld),this.union(Tr)}const r=e.children;for(let s=0,a=r.length;s<a;s++)this.expandByObject(r[s],t);return this}containsPoint(e){return e.x>=this.min.x&&e.x<=this.max.x&&e.y>=this.min.y&&e.y<=this.max.y&&e.z>=this.min.z&&e.z<=this.max.z}containsBox(e){return this.min.x<=e.min.x&&e.max.x<=this.max.x&&this.min.y<=e.min.y&&e.max.y<=this.max.y&&this.min.z<=e.min.z&&e.max.z<=this.max.z}getParameter(e,t){return t.set((e.x-this.min.x)/(this.max.x-this.min.x),(e.y-this.min.y)/(this.max.y-this.min.y),(e.z-this.min.z)/(this.max.z-this.min.z))}intersectsBox(e){return e.max.x>=this.min.x&&e.min.x<=this.max.x&&e.max.y>=this.min.y&&e.min.y<=this.max.y&&e.max.z>=this.min.z&&e.min.z<=this.max.z}intersectsSphere(e){return this.clampPoint(e.center,qt),qt.distanceToSquared(e.center)<=e.radius*e.radius}intersectsPlane(e){let t,i;return e.normal.x>0?(t=e.normal.x*this.min.x,i=e.normal.x*this.max.x):(t=e.normal.x*this.max.x,i=e.normal.x*this.min.x),e.normal.y>0?(t+=e.normal.y*this.min.y,i+=e.normal.y*this.max.y):(t+=e.normal.y*this.max.y,i+=e.normal.y*this.min.y),e.normal.z>0?(t+=e.normal.z*this.min.z,i+=e.normal.z*this.max.z):(t+=e.normal.z*this.max.z,i+=e.normal.z*this.min.z),t<=-e.constant&&i>=-e.constant}intersectsTriangle(e){if(this.isEmpty())return!1;this.getCenter(Ji),Ar.subVectors(this.max,Ji),di.subVectors(e.a,Ji),pi.subVectors(e.b,Ji),mi.subVectors(e.c,Ji),Rn.subVectors(pi,di),Cn.subVectors(mi,pi),Wn.subVectors(di,mi);let t=[0,-Rn.z,Rn.y,0,-Cn.z,Cn.y,0,-Wn.z,Wn.y,Rn.z,0,-Rn.x,Cn.z,0,-Cn.x,Wn.z,0,-Wn.x,-Rn.y,Rn.x,0,-Cn.y,Cn.x,0,-Wn.y,Wn.x,0];return!Rs(t,di,pi,mi,Ar)||(t=[1,0,0,0,1,0,0,0,1],!Rs(t,di,pi,mi,Ar))?!1:(br.crossVectors(Rn,Cn),t=[br.x,br.y,br.z],Rs(t,di,pi,mi,Ar))}clampPoint(e,t){return t.copy(e).clamp(this.min,this.max)}distanceToPoint(e){return this.clampPoint(e,qt).distanceTo(e)}getBoundingSphere(e){return this.isEmpty()?e.makeEmpty():(this.getCenter(e.center),e.radius=this.getSize(qt).length()*.5),e}intersect(e){return this.min.max(e.min),this.max.min(e.max),this.isEmpty()&&this.makeEmpty(),this}union(e){return this.min.min(e.min),this.max.max(e.max),this}applyMatrix4(e){return this.isEmpty()?this:(un[0].set(this.min.x,this.min.y,this.min.z).applyMatrix4(e),un[1].set(this.min.x,this.min.y,this.max.z).applyMatrix4(e),un[2].set(this.min.x,this.max.y,this.min.z).applyMatrix4(e),un[3].set(this.min.x,this.max.y,this.max.z).applyMatrix4(e),un[4].set(this.max.x,this.min.y,this.min.z).applyMatrix4(e),un[5].set(this.max.x,this.min.y,this.max.z).applyMatrix4(e),un[6].set(this.max.x,this.max.y,this.min.z).applyMatrix4(e),un[7].set(this.max.x,this.max.y,this.max.z).applyMatrix4(e),this.setFromPoints(un),this)}translate(e){return this.min.add(e),this.max.add(e),this}equals(e){return e.min.equals(this.min)&&e.max.equals(this.max)}}const un=[new N,new N,new N,new N,new N,new N,new N,new N],qt=new N,Tr=new _r,di=new N,pi=new N,mi=new N,Rn=new N,Cn=new N,Wn=new N,Ji=new N,Ar=new N,br=new N,Xn=new N;function Rs(n,e,t,i,r){for(let s=0,a=n.length-3;s<=a;s+=3){Xn.fromArray(n,s);const o=r.x*Math.abs(Xn.x)+r.y*Math.abs(Xn.y)+r.z*Math.abs(Xn.z),l=e.dot(Xn),c=t.dot(Xn),u=i.dot(Xn);if(Math.max(-Math.max(l,c,u),Math.min(l,c,u))>o)return!1}return!0}const ku=new _r,Qi=new N,Cs=new N;class ms{constructor(e=new N,t=-1){this.isSphere=!0,this.center=e,this.radius=t}set(e,t){return this.center.copy(e),this.radius=t,this}setFromPoints(e,t){const i=this.center;t!==void 0?i.copy(t):ku.setFromPoints(e).getCenter(i);let r=0;for(let s=0,a=e.length;s<a;s++)r=Math.max(r,i.distanceToSquared(e[s]));return this.radius=Math.sqrt(r),this}copy(e){return this.center.copy(e.center),this.radius=e.radius,this}isEmpty(){return this.radius<0}makeEmpty(){return this.center.set(0,0,0),this.radius=-1,this}containsPoint(e){return e.distanceToSquared(this.center)<=this.radius*this.radius}distanceToPoint(e){return e.distanceTo(this.center)-this.radius}intersectsSphere(e){const t=this.radius+e.radius;return e.center.distanceToSquared(this.center)<=t*t}intersectsBox(e){return e.intersectsSphere(this)}intersectsPlane(e){return Math.abs(e.distanceToPoint(this.center))<=this.radius}clampPoint(e,t){const i=this.center.distanceToSquared(e);return t.copy(e),i>this.radius*this.radius&&(t.sub(this.center).normalize(),t.multiplyScalar(this.radius).add(this.center)),t}getBoundingBox(e){return this.isEmpty()?(e.makeEmpty(),e):(e.set(this.center,this.center),e.expandByScalar(this.radius),e)}applyMatrix4(e){return this.center.applyMatrix4(e),this.radius=this.radius*e.getMaxScaleOnAxis(),this}translate(e){return this.center.add(e),this}expandByPoint(e){if(this.isEmpty())return this.center.copy(e),this.radius=0,this;Qi.subVectors(e,this.center);const t=Qi.lengthSq();if(t>this.radius*this.radius){const i=Math.sqrt(t),r=(i-this.radius)*.5;this.center.addScaledVector(Qi,r/i),this.radius+=r}return this}union(e){return e.isEmpty()?this:this.isEmpty()?(this.copy(e),this):(this.center.equals(e.center)===!0?this.radius=Math.max(this.radius,e.radius):(Cs.subVectors(e.center,this.center).setLength(e.radius),this.expandByPoint(Qi.copy(e.center).add(Cs)),this.expandByPoint(Qi.copy(e.center).sub(Cs))),this)}equals(e){return e.center.equals(this.center)&&e.radius===this.radius}clone(){return new this.constructor().copy(this)}}const hn=new N,Ps=new N,wr=new N,Pn=new N,Ds=new N,Rr=new N,Ls=new N;class Kl{constructor(e=new N,t=new N(0,0,-1)){this.origin=e,this.direction=t}set(e,t){return this.origin.copy(e),this.direction.copy(t),this}copy(e){return this.origin.copy(e.origin),this.direction.copy(e.direction),this}at(e,t){return t.copy(this.origin).addScaledVector(this.direction,e)}lookAt(e){return this.direction.copy(e).sub(this.origin).normalize(),this}recast(e){return this.origin.copy(this.at(e,hn)),this}closestPointToPoint(e,t){t.subVectors(e,this.origin);const i=t.dot(this.direction);return i<0?t.copy(this.origin):t.copy(this.origin).addScaledVector(this.direction,i)}distanceToPoint(e){return Math.sqrt(this.distanceSqToPoint(e))}distanceSqToPoint(e){const t=hn.subVectors(e,this.origin).dot(this.direction);return t<0?this.origin.distanceToSquared(e):(hn.copy(this.origin).addScaledVector(this.direction,t),hn.distanceToSquared(e))}distanceSqToSegment(e,t,i,r){Ps.copy(e).add(t).multiplyScalar(.5),wr.copy(t).sub(e).normalize(),Pn.copy(this.origin).sub(Ps);const s=e.distanceTo(t)*.5,a=-this.direction.dot(wr),o=Pn.dot(this.direction),l=-Pn.dot(wr),c=Pn.lengthSq(),u=Math.abs(1-a*a);let f,d,m,g;if(u>0)if(f=a*l-o,d=a*o-l,g=s*u,f>=0)if(d>=-g)if(d<=g){const _=1/u;f*=_,d*=_,m=f*(f+a*d+2*o)+d*(a*f+d+2*l)+c}else d=s,f=Math.max(0,-(a*d+o)),m=-f*f+d*(d+2*l)+c;else d=-s,f=Math.max(0,-(a*d+o)),m=-f*f+d*(d+2*l)+c;else d<=-g?(f=Math.max(0,-(-a*s+o)),d=f>0?-s:Math.min(Math.max(-s,-l),s),m=-f*f+d*(d+2*l)+c):d<=g?(f=0,d=Math.min(Math.max(-s,-l),s),m=d*(d+2*l)+c):(f=Math.max(0,-(a*s+o)),d=f>0?s:Math.min(Math.max(-s,-l),s),m=-f*f+d*(d+2*l)+c);else d=a>0?-s:s,f=Math.max(0,-(a*d+o)),m=-f*f+d*(d+2*l)+c;return i&&i.copy(this.origin).addScaledVector(this.direction,f),r&&r.copy(Ps).addScaledVector(wr,d),m}intersectSphere(e,t){hn.subVectors(e.center,this.origin);const i=hn.dot(this.direction),r=hn.dot(hn)-i*i,s=e.radius*e.radius;if(r>s)return null;const a=Math.sqrt(s-r),o=i-a,l=i+a;return l<0?null:o<0?this.at(l,t):this.at(o,t)}intersectsSphere(e){return this.distanceSqToPoint(e.center)<=e.radius*e.radius}distanceToPlane(e){const t=e.normal.dot(this.direction);if(t===0)return e.distanceToPoint(this.origin)===0?0:null;const i=-(this.origin.dot(e.normal)+e.constant)/t;return i>=0?i:null}intersectPlane(e,t){const i=this.distanceToPlane(e);return i===null?null:this.at(i,t)}intersectsPlane(e){const t=e.distanceToPoint(this.origin);return t===0||e.normal.dot(this.direction)*t<0}intersectBox(e,t){let i,r,s,a,o,l;const c=1/this.direction.x,u=1/this.direction.y,f=1/this.direction.z,d=this.origin;return c>=0?(i=(e.min.x-d.x)*c,r=(e.max.x-d.x)*c):(i=(e.max.x-d.x)*c,r=(e.min.x-d.x)*c),u>=0?(s=(e.min.y-d.y)*u,a=(e.max.y-d.y)*u):(s=(e.max.y-d.y)*u,a=(e.min.y-d.y)*u),i>a||s>r||((s>i||isNaN(i))&&(i=s),(a<r||isNaN(r))&&(r=a),f>=0?(o=(e.min.z-d.z)*f,l=(e.max.z-d.z)*f):(o=(e.max.z-d.z)*f,l=(e.min.z-d.z)*f),i>l||o>r)||((o>i||i!==i)&&(i=o),(l<r||r!==r)&&(r=l),r<0)?null:this.at(i>=0?i:r,t)}intersectsBox(e){return this.intersectBox(e,hn)!==null}intersectTriangle(e,t,i,r,s){Ds.subVectors(t,e),Rr.subVectors(i,e),Ls.crossVectors(Ds,Rr);let a=this.direction.dot(Ls),o;if(a>0){if(r)return null;o=1}else if(a<0)o=-1,a=-a;else return null;Pn.subVectors(this.origin,e);const l=o*this.direction.dot(Rr.crossVectors(Pn,Rr));if(l<0)return null;const c=o*this.direction.dot(Ds.cross(Pn));if(c<0||l+c>a)return null;const u=-o*Pn.dot(Ls);return u<0?null:this.at(u/a,s)}applyMatrix4(e){return this.origin.applyMatrix4(e),this.direction.transformDirection(e),this}equals(e){return e.origin.equals(this.origin)&&e.direction.equals(this.direction)}clone(){return new this.constructor().copy(this)}}class st{constructor(e,t,i,r,s,a,o,l,c,u,f,d,m,g,_,p){st.prototype.isMatrix4=!0,this.elements=[1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1],e!==void 0&&this.set(e,t,i,r,s,a,o,l,c,u,f,d,m,g,_,p)}set(e,t,i,r,s,a,o,l,c,u,f,d,m,g,_,p){const h=this.elements;return h[0]=e,h[4]=t,h[8]=i,h[12]=r,h[1]=s,h[5]=a,h[9]=o,h[13]=l,h[2]=c,h[6]=u,h[10]=f,h[14]=d,h[3]=m,h[7]=g,h[11]=_,h[15]=p,this}identity(){return this.set(1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1),this}clone(){return new st().fromArray(this.elements)}copy(e){const t=this.elements,i=e.elements;return t[0]=i[0],t[1]=i[1],t[2]=i[2],t[3]=i[3],t[4]=i[4],t[5]=i[5],t[6]=i[6],t[7]=i[7],t[8]=i[8],t[9]=i[9],t[10]=i[10],t[11]=i[11],t[12]=i[12],t[13]=i[13],t[14]=i[14],t[15]=i[15],this}copyPosition(e){const t=this.elements,i=e.elements;return t[12]=i[12],t[13]=i[13],t[14]=i[14],this}setFromMatrix3(e){const t=e.elements;return this.set(t[0],t[3],t[6],0,t[1],t[4],t[7],0,t[2],t[5],t[8],0,0,0,0,1),this}extractBasis(e,t,i){return e.setFromMatrixColumn(this,0),t.setFromMatrixColumn(this,1),i.setFromMatrixColumn(this,2),this}makeBasis(e,t,i){return this.set(e.x,t.x,i.x,0,e.y,t.y,i.y,0,e.z,t.z,i.z,0,0,0,0,1),this}extractRotation(e){const t=this.elements,i=e.elements,r=1/gi.setFromMatrixColumn(e,0).length(),s=1/gi.setFromMatrixColumn(e,1).length(),a=1/gi.setFromMatrixColumn(e,2).length();return t[0]=i[0]*r,t[1]=i[1]*r,t[2]=i[2]*r,t[3]=0,t[4]=i[4]*s,t[5]=i[5]*s,t[6]=i[6]*s,t[7]=0,t[8]=i[8]*a,t[9]=i[9]*a,t[10]=i[10]*a,t[11]=0,t[12]=0,t[13]=0,t[14]=0,t[15]=1,this}makeRotationFromEuler(e){const t=this.elements,i=e.x,r=e.y,s=e.z,a=Math.cos(i),o=Math.sin(i),l=Math.cos(r),c=Math.sin(r),u=Math.cos(s),f=Math.sin(s);if(e.order==="XYZ"){const d=a*u,m=a*f,g=o*u,_=o*f;t[0]=l*u,t[4]=-l*f,t[8]=c,t[1]=m+g*c,t[5]=d-_*c,t[9]=-o*l,t[2]=_-d*c,t[6]=g+m*c,t[10]=a*l}else if(e.order==="YXZ"){const d=l*u,m=l*f,g=c*u,_=c*f;t[0]=d+_*o,t[4]=g*o-m,t[8]=a*c,t[1]=a*f,t[5]=a*u,t[9]=-o,t[2]=m*o-g,t[6]=_+d*o,t[10]=a*l}else if(e.order==="ZXY"){const d=l*u,m=l*f,g=c*u,_=c*f;t[0]=d-_*o,t[4]=-a*f,t[8]=g+m*o,t[1]=m+g*o,t[5]=a*u,t[9]=_-d*o,t[2]=-a*c,t[6]=o,t[10]=a*l}else if(e.order==="ZYX"){const d=a*u,m=a*f,g=o*u,_=o*f;t[0]=l*u,t[4]=g*c-m,t[8]=d*c+_,t[1]=l*f,t[5]=_*c+d,t[9]=m*c-g,t[2]=-c,t[6]=o*l,t[10]=a*l}else if(e.order==="YZX"){const d=a*l,m=a*c,g=o*l,_=o*c;t[0]=l*u,t[4]=_-d*f,t[8]=g*f+m,t[1]=f,t[5]=a*u,t[9]=-o*u,t[2]=-c*u,t[6]=m*f+g,t[10]=d-_*f}else if(e.order==="XZY"){const d=a*l,m=a*c,g=o*l,_=o*c;t[0]=l*u,t[4]=-f,t[8]=c*u,t[1]=d*f+_,t[5]=a*u,t[9]=m*f-g,t[2]=g*f-m,t[6]=o*u,t[10]=_*f+d}return t[3]=0,t[7]=0,t[11]=0,t[12]=0,t[13]=0,t[14]=0,t[15]=1,this}makeRotationFromQuaternion(e){return this.compose(Gu,e,Hu)}lookAt(e,t,i){const r=this.elements;return Dt.subVectors(e,t),Dt.lengthSq()===0&&(Dt.z=1),Dt.normalize(),Dn.crossVectors(i,Dt),Dn.lengthSq()===0&&(Math.abs(i.z)===1?Dt.x+=1e-4:Dt.z+=1e-4,Dt.normalize(),Dn.crossVectors(i,Dt)),Dn.normalize(),Cr.crossVectors(Dt,Dn),r[0]=Dn.x,r[4]=Cr.x,r[8]=Dt.x,r[1]=Dn.y,r[5]=Cr.y,r[9]=Dt.y,r[2]=Dn.z,r[6]=Cr.z,r[10]=Dt.z,this}multiply(e){return this.multiplyMatrices(this,e)}premultiply(e){return this.multiplyMatrices(e,this)}multiplyMatrices(e,t){const i=e.elements,r=t.elements,s=this.elements,a=i[0],o=i[4],l=i[8],c=i[12],u=i[1],f=i[5],d=i[9],m=i[13],g=i[2],_=i[6],p=i[10],h=i[14],T=i[3],S=i[7],M=i[11],P=i[15],b=r[0],R=r[4],L=r[8],E=r[12],x=r[1],w=r[5],k=r[9],O=r[13],X=r[2],Z=r[6],G=r[10],$=r[14],V=r[3],re=r[7],Q=r[11],se=r[15];return s[0]=a*b+o*x+l*X+c*V,s[4]=a*R+o*w+l*Z+c*re,s[8]=a*L+o*k+l*G+c*Q,s[12]=a*E+o*O+l*$+c*se,s[1]=u*b+f*x+d*X+m*V,s[5]=u*R+f*w+d*Z+m*re,s[9]=u*L+f*k+d*G+m*Q,s[13]=u*E+f*O+d*$+m*se,s[2]=g*b+_*x+p*X+h*V,s[6]=g*R+_*w+p*Z+h*re,s[10]=g*L+_*k+p*G+h*Q,s[14]=g*E+_*O+p*$+h*se,s[3]=T*b+S*x+M*X+P*V,s[7]=T*R+S*w+M*Z+P*re,s[11]=T*L+S*k+M*G+P*Q,s[15]=T*E+S*O+M*$+P*se,this}multiplyScalar(e){const t=this.elements;return t[0]*=e,t[4]*=e,t[8]*=e,t[12]*=e,t[1]*=e,t[5]*=e,t[9]*=e,t[13]*=e,t[2]*=e,t[6]*=e,t[10]*=e,t[14]*=e,t[3]*=e,t[7]*=e,t[11]*=e,t[15]*=e,this}determinant(){const e=this.elements,t=e[0],i=e[4],r=e[8],s=e[12],a=e[1],o=e[5],l=e[9],c=e[13],u=e[2],f=e[6],d=e[10],m=e[14],g=e[3],_=e[7],p=e[11],h=e[15];return g*(+s*l*f-r*c*f-s*o*d+i*c*d+r*o*m-i*l*m)+_*(+t*l*m-t*c*d+s*a*d-r*a*m+r*c*u-s*l*u)+p*(+t*c*f-t*o*m-s*a*f+i*a*m+s*o*u-i*c*u)+h*(-r*o*u-t*l*f+t*o*d+r*a*f-i*a*d+i*l*u)}transpose(){const e=this.elements;let t;return t=e[1],e[1]=e[4],e[4]=t,t=e[2],e[2]=e[8],e[8]=t,t=e[6],e[6]=e[9],e[9]=t,t=e[3],e[3]=e[12],e[12]=t,t=e[7],e[7]=e[13],e[13]=t,t=e[11],e[11]=e[14],e[14]=t,this}setPosition(e,t,i){const r=this.elements;return e.isVector3?(r[12]=e.x,r[13]=e.y,r[14]=e.z):(r[12]=e,r[13]=t,r[14]=i),this}invert(){const e=this.elements,t=e[0],i=e[1],r=e[2],s=e[3],a=e[4],o=e[5],l=e[6],c=e[7],u=e[8],f=e[9],d=e[10],m=e[11],g=e[12],_=e[13],p=e[14],h=e[15],T=f*p*c-_*d*c+_*l*m-o*p*m-f*l*h+o*d*h,S=g*d*c-u*p*c-g*l*m+a*p*m+u*l*h-a*d*h,M=u*_*c-g*f*c+g*o*m-a*_*m-u*o*h+a*f*h,P=g*f*l-u*_*l-g*o*d+a*_*d+u*o*p-a*f*p,b=t*T+i*S+r*M+s*P;if(b===0)return this.set(0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0);const R=1/b;return e[0]=T*R,e[1]=(_*d*s-f*p*s-_*r*m+i*p*m+f*r*h-i*d*h)*R,e[2]=(o*p*s-_*l*s+_*r*c-i*p*c-o*r*h+i*l*h)*R,e[3]=(f*l*s-o*d*s-f*r*c+i*d*c+o*r*m-i*l*m)*R,e[4]=S*R,e[5]=(u*p*s-g*d*s+g*r*m-t*p*m-u*r*h+t*d*h)*R,e[6]=(g*l*s-a*p*s-g*r*c+t*p*c+a*r*h-t*l*h)*R,e[7]=(a*d*s-u*l*s+u*r*c-t*d*c-a*r*m+t*l*m)*R,e[8]=M*R,e[9]=(g*f*s-u*_*s-g*i*m+t*_*m+u*i*h-t*f*h)*R,e[10]=(a*_*s-g*o*s+g*i*c-t*_*c-a*i*h+t*o*h)*R,e[11]=(u*o*s-a*f*s-u*i*c+t*f*c+a*i*m-t*o*m)*R,e[12]=P*R,e[13]=(u*_*r-g*f*r+g*i*d-t*_*d-u*i*p+t*f*p)*R,e[14]=(g*o*r-a*_*r-g*i*l+t*_*l+a*i*p-t*o*p)*R,e[15]=(a*f*r-u*o*r+u*i*l-t*f*l-a*i*d+t*o*d)*R,this}scale(e){const t=this.elements,i=e.x,r=e.y,s=e.z;return t[0]*=i,t[4]*=r,t[8]*=s,t[1]*=i,t[5]*=r,t[9]*=s,t[2]*=i,t[6]*=r,t[10]*=s,t[3]*=i,t[7]*=r,t[11]*=s,this}getMaxScaleOnAxis(){const e=this.elements,t=e[0]*e[0]+e[1]*e[1]+e[2]*e[2],i=e[4]*e[4]+e[5]*e[5]+e[6]*e[6],r=e[8]*e[8]+e[9]*e[9]+e[10]*e[10];return Math.sqrt(Math.max(t,i,r))}makeTranslation(e,t,i){return e.isVector3?this.set(1,0,0,e.x,0,1,0,e.y,0,0,1,e.z,0,0,0,1):this.set(1,0,0,e,0,1,0,t,0,0,1,i,0,0,0,1),this}makeRotationX(e){const t=Math.cos(e),i=Math.sin(e);return this.set(1,0,0,0,0,t,-i,0,0,i,t,0,0,0,0,1),this}makeRotationY(e){const t=Math.cos(e),i=Math.sin(e);return this.set(t,0,i,0,0,1,0,0,-i,0,t,0,0,0,0,1),this}makeRotationZ(e){const t=Math.cos(e),i=Math.sin(e);return this.set(t,-i,0,0,i,t,0,0,0,0,1,0,0,0,0,1),this}makeRotationAxis(e,t){const i=Math.cos(t),r=Math.sin(t),s=1-i,a=e.x,o=e.y,l=e.z,c=s*a,u=s*o;return this.set(c*a+i,c*o-r*l,c*l+r*o,0,c*o+r*l,u*o+i,u*l-r*a,0,c*l-r*o,u*l+r*a,s*l*l+i,0,0,0,0,1),this}makeScale(e,t,i){return this.set(e,0,0,0,0,t,0,0,0,0,i,0,0,0,0,1),this}makeShear(e,t,i,r,s,a){return this.set(1,i,s,0,e,1,a,0,t,r,1,0,0,0,0,1),this}compose(e,t,i){const r=this.elements,s=t._x,a=t._y,o=t._z,l=t._w,c=s+s,u=a+a,f=o+o,d=s*c,m=s*u,g=s*f,_=a*u,p=a*f,h=o*f,T=l*c,S=l*u,M=l*f,P=i.x,b=i.y,R=i.z;return r[0]=(1-(_+h))*P,r[1]=(m+M)*P,r[2]=(g-S)*P,r[3]=0,r[4]=(m-M)*b,r[5]=(1-(d+h))*b,r[6]=(p+T)*b,r[7]=0,r[8]=(g+S)*R,r[9]=(p-T)*R,r[10]=(1-(d+_))*R,r[11]=0,r[12]=e.x,r[13]=e.y,r[14]=e.z,r[15]=1,this}decompose(e,t,i){const r=this.elements;let s=gi.set(r[0],r[1],r[2]).length();const a=gi.set(r[4],r[5],r[6]).length(),o=gi.set(r[8],r[9],r[10]).length();this.determinant()<0&&(s=-s),e.x=r[12],e.y=r[13],e.z=r[14],Yt.copy(this);const c=1/s,u=1/a,f=1/o;return Yt.elements[0]*=c,Yt.elements[1]*=c,Yt.elements[2]*=c,Yt.elements[4]*=u,Yt.elements[5]*=u,Yt.elements[6]*=u,Yt.elements[8]*=f,Yt.elements[9]*=f,Yt.elements[10]*=f,t.setFromRotationMatrix(Yt),i.x=s,i.y=a,i.z=o,this}makePerspective(e,t,i,r,s,a,o=gn){const l=this.elements,c=2*s/(t-e),u=2*s/(i-r),f=(t+e)/(t-e),d=(i+r)/(i-r);let m,g;if(o===gn)m=-(a+s)/(a-s),g=-2*a*s/(a-s);else if(o===as)m=-a/(a-s),g=-a*s/(a-s);else throw new Error("THREE.Matrix4.makePerspective(): Invalid coordinate system: "+o);return l[0]=c,l[4]=0,l[8]=f,l[12]=0,l[1]=0,l[5]=u,l[9]=d,l[13]=0,l[2]=0,l[6]=0,l[10]=m,l[14]=g,l[3]=0,l[7]=0,l[11]=-1,l[15]=0,this}makeOrthographic(e,t,i,r,s,a,o=gn){const l=this.elements,c=1/(t-e),u=1/(i-r),f=1/(a-s),d=(t+e)*c,m=(i+r)*u;let g,_;if(o===gn)g=(a+s)*f,_=-2*f;else if(o===as)g=s*f,_=-1*f;else throw new Error("THREE.Matrix4.makeOrthographic(): Invalid coordinate system: "+o);return l[0]=2*c,l[4]=0,l[8]=0,l[12]=-d,l[1]=0,l[5]=2*u,l[9]=0,l[13]=-m,l[2]=0,l[6]=0,l[10]=_,l[14]=-g,l[3]=0,l[7]=0,l[11]=0,l[15]=1,this}equals(e){const t=this.elements,i=e.elements;for(let r=0;r<16;r++)if(t[r]!==i[r])return!1;return!0}fromArray(e,t=0){for(let i=0;i<16;i++)this.elements[i]=e[i+t];return this}toArray(e=[],t=0){const i=this.elements;return e[t]=i[0],e[t+1]=i[1],e[t+2]=i[2],e[t+3]=i[3],e[t+4]=i[4],e[t+5]=i[5],e[t+6]=i[6],e[t+7]=i[7],e[t+8]=i[8],e[t+9]=i[9],e[t+10]=i[10],e[t+11]=i[11],e[t+12]=i[12],e[t+13]=i[13],e[t+14]=i[14],e[t+15]=i[15],e}}const gi=new N,Yt=new st,Gu=new N(0,0,0),Hu=new N(1,1,1),Dn=new N,Cr=new N,Dt=new N,Io=new st,Uo=new qi;class yn{constructor(e=0,t=0,i=0,r=yn.DEFAULT_ORDER){this.isEuler=!0,this._x=e,this._y=t,this._z=i,this._order=r}get x(){return this._x}set x(e){this._x=e,this._onChangeCallback()}get y(){return this._y}set y(e){this._y=e,this._onChangeCallback()}get z(){return this._z}set z(e){this._z=e,this._onChangeCallback()}get order(){return this._order}set order(e){this._order=e,this._onChangeCallback()}set(e,t,i,r=this._order){return this._x=e,this._y=t,this._z=i,this._order=r,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._order)}copy(e){return this._x=e._x,this._y=e._y,this._z=e._z,this._order=e._order,this._onChangeCallback(),this}setFromRotationMatrix(e,t=this._order,i=!0){const r=e.elements,s=r[0],a=r[4],o=r[8],l=r[1],c=r[5],u=r[9],f=r[2],d=r[6],m=r[10];switch(t){case"XYZ":this._y=Math.asin(At(o,-1,1)),Math.abs(o)<.9999999?(this._x=Math.atan2(-u,m),this._z=Math.atan2(-a,s)):(this._x=Math.atan2(d,c),this._z=0);break;case"YXZ":this._x=Math.asin(-At(u,-1,1)),Math.abs(u)<.9999999?(this._y=Math.atan2(o,m),this._z=Math.atan2(l,c)):(this._y=Math.atan2(-f,s),this._z=0);break;case"ZXY":this._x=Math.asin(At(d,-1,1)),Math.abs(d)<.9999999?(this._y=Math.atan2(-f,m),this._z=Math.atan2(-a,c)):(this._y=0,this._z=Math.atan2(l,s));break;case"ZYX":this._y=Math.asin(-At(f,-1,1)),Math.abs(f)<.9999999?(this._x=Math.atan2(d,m),this._z=Math.atan2(l,s)):(this._x=0,this._z=Math.atan2(-a,c));break;case"YZX":this._z=Math.asin(At(l,-1,1)),Math.abs(l)<.9999999?(this._x=Math.atan2(-u,c),this._y=Math.atan2(-f,s)):(this._x=0,this._y=Math.atan2(o,m));break;case"XZY":this._z=Math.asin(-At(a,-1,1)),Math.abs(a)<.9999999?(this._x=Math.atan2(d,c),this._y=Math.atan2(o,s)):(this._x=Math.atan2(-u,m),this._y=0);break;default:console.warn("THREE.Euler: .setFromRotationMatrix() encountered an unknown order: "+t)}return this._order=t,i===!0&&this._onChangeCallback(),this}setFromQuaternion(e,t,i){return Io.makeRotationFromQuaternion(e),this.setFromRotationMatrix(Io,t,i)}setFromVector3(e,t=this._order){return this.set(e.x,e.y,e.z,t)}reorder(e){return Uo.setFromEuler(this),this.setFromQuaternion(Uo,e)}equals(e){return e._x===this._x&&e._y===this._y&&e._z===this._z&&e._order===this._order}fromArray(e){return this._x=e[0],this._y=e[1],this._z=e[2],e[3]!==void 0&&(this._order=e[3]),this._onChangeCallback(),this}toArray(e=[],t=0){return e[t]=this._x,e[t+1]=this._y,e[t+2]=this._z,e[t+3]=this._order,e}_onChange(e){return this._onChangeCallback=e,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._order}}yn.DEFAULT_ORDER="XYZ";class $l{constructor(){this.mask=1}set(e){this.mask=(1<<e|0)>>>0}enable(e){this.mask|=1<<e|0}enableAll(){this.mask=-1}toggle(e){this.mask^=1<<e|0}disable(e){this.mask&=~(1<<e|0)}disableAll(){this.mask=0}test(e){return(this.mask&e.mask)!==0}isEnabled(e){return(this.mask&(1<<e|0))!==0}}let Vu=0;const No=new N,_i=new qi,fn=new st,Pr=new N,er=new N,Wu=new N,Xu=new qi,Fo=new N(1,0,0),Oo=new N(0,1,0),Bo=new N(0,0,1),zo={type:"added"},qu={type:"removed"},vi={type:"childadded",child:null},Is={type:"childremoved",child:null};class Rt extends Xi{constructor(){super(),this.isObject3D=!0,Object.defineProperty(this,"id",{value:Vu++}),this.uuid=gr(),this.name="",this.type="Object3D",this.parent=null,this.children=[],this.up=Rt.DEFAULT_UP.clone();const e=new N,t=new yn,i=new qi,r=new N(1,1,1);function s(){i.setFromEuler(t,!1)}function a(){t.setFromQuaternion(i,void 0,!1)}t._onChange(s),i._onChange(a),Object.defineProperties(this,{position:{configurable:!0,enumerable:!0,value:e},rotation:{configurable:!0,enumerable:!0,value:t},quaternion:{configurable:!0,enumerable:!0,value:i},scale:{configurable:!0,enumerable:!0,value:r},modelViewMatrix:{value:new st},normalMatrix:{value:new Ne}}),this.matrix=new st,this.matrixWorld=new st,this.matrixAutoUpdate=Rt.DEFAULT_MATRIX_AUTO_UPDATE,this.matrixWorldAutoUpdate=Rt.DEFAULT_MATRIX_WORLD_AUTO_UPDATE,this.matrixWorldNeedsUpdate=!1,this.layers=new $l,this.visible=!0,this.castShadow=!1,this.receiveShadow=!1,this.frustumCulled=!0,this.renderOrder=0,this.animations=[],this.userData={}}onBeforeShadow(){}onAfterShadow(){}onBeforeRender(){}onAfterRender(){}applyMatrix4(e){this.matrixAutoUpdate&&this.updateMatrix(),this.matrix.premultiply(e),this.matrix.decompose(this.position,this.quaternion,this.scale)}applyQuaternion(e){return this.quaternion.premultiply(e),this}setRotationFromAxisAngle(e,t){this.quaternion.setFromAxisAngle(e,t)}setRotationFromEuler(e){this.quaternion.setFromEuler(e,!0)}setRotationFromMatrix(e){this.quaternion.setFromRotationMatrix(e)}setRotationFromQuaternion(e){this.quaternion.copy(e)}rotateOnAxis(e,t){return _i.setFromAxisAngle(e,t),this.quaternion.multiply(_i),this}rotateOnWorldAxis(e,t){return _i.setFromAxisAngle(e,t),this.quaternion.premultiply(_i),this}rotateX(e){return this.rotateOnAxis(Fo,e)}rotateY(e){return this.rotateOnAxis(Oo,e)}rotateZ(e){return this.rotateOnAxis(Bo,e)}translateOnAxis(e,t){return No.copy(e).applyQuaternion(this.quaternion),this.position.add(No.multiplyScalar(t)),this}translateX(e){return this.translateOnAxis(Fo,e)}translateY(e){return this.translateOnAxis(Oo,e)}translateZ(e){return this.translateOnAxis(Bo,e)}localToWorld(e){return this.updateWorldMatrix(!0,!1),e.applyMatrix4(this.matrixWorld)}worldToLocal(e){return this.updateWorldMatrix(!0,!1),e.applyMatrix4(fn.copy(this.matrixWorld).invert())}lookAt(e,t,i){e.isVector3?Pr.copy(e):Pr.set(e,t,i);const r=this.parent;this.updateWorldMatrix(!0,!1),er.setFromMatrixPosition(this.matrixWorld),this.isCamera||this.isLight?fn.lookAt(er,Pr,this.up):fn.lookAt(Pr,er,this.up),this.quaternion.setFromRotationMatrix(fn),r&&(fn.extractRotation(r.matrixWorld),_i.setFromRotationMatrix(fn),this.quaternion.premultiply(_i.invert()))}add(e){if(arguments.length>1){for(let t=0;t<arguments.length;t++)this.add(arguments[t]);return this}return e===this?(console.error("THREE.Object3D.add: object can't be added as a child of itself.",e),this):(e&&e.isObject3D?(e.removeFromParent(),e.parent=this,this.children.push(e),e.dispatchEvent(zo),vi.child=e,this.dispatchEvent(vi),vi.child=null):console.error("THREE.Object3D.add: object not an instance of THREE.Object3D.",e),this)}remove(e){if(arguments.length>1){for(let i=0;i<arguments.length;i++)this.remove(arguments[i]);return this}const t=this.children.indexOf(e);return t!==-1&&(e.parent=null,this.children.splice(t,1),e.dispatchEvent(qu),Is.child=e,this.dispatchEvent(Is),Is.child=null),this}removeFromParent(){const e=this.parent;return e!==null&&e.remove(this),this}clear(){return this.remove(...this.children)}attach(e){return this.updateWorldMatrix(!0,!1),fn.copy(this.matrixWorld).invert(),e.parent!==null&&(e.parent.updateWorldMatrix(!0,!1),fn.multiply(e.parent.matrixWorld)),e.applyMatrix4(fn),e.removeFromParent(),e.parent=this,this.children.push(e),e.updateWorldMatrix(!1,!0),e.dispatchEvent(zo),vi.child=e,this.dispatchEvent(vi),vi.child=null,this}getObjectById(e){return this.getObjectByProperty("id",e)}getObjectByName(e){return this.getObjectByProperty("name",e)}getObjectByProperty(e,t){if(this[e]===t)return this;for(let i=0,r=this.children.length;i<r;i++){const a=this.children[i].getObjectByProperty(e,t);if(a!==void 0)return a}}getObjectsByProperty(e,t,i=[]){this[e]===t&&i.push(this);const r=this.children;for(let s=0,a=r.length;s<a;s++)r[s].getObjectsByProperty(e,t,i);return i}getWorldPosition(e){return this.updateWorldMatrix(!0,!1),e.setFromMatrixPosition(this.matrixWorld)}getWorldQuaternion(e){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(er,e,Wu),e}getWorldScale(e){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(er,Xu,e),e}getWorldDirection(e){this.updateWorldMatrix(!0,!1);const t=this.matrixWorld.elements;return e.set(t[8],t[9],t[10]).normalize()}raycast(){}traverse(e){e(this);const t=this.children;for(let i=0,r=t.length;i<r;i++)t[i].traverse(e)}traverseVisible(e){if(this.visible===!1)return;e(this);const t=this.children;for(let i=0,r=t.length;i<r;i++)t[i].traverseVisible(e)}traverseAncestors(e){const t=this.parent;t!==null&&(e(t),t.traverseAncestors(e))}updateMatrix(){this.matrix.compose(this.position,this.quaternion,this.scale),this.matrixWorldNeedsUpdate=!0}updateMatrixWorld(e){this.matrixAutoUpdate&&this.updateMatrix(),(this.matrixWorldNeedsUpdate||e)&&(this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),this.matrixWorldNeedsUpdate=!1,e=!0);const t=this.children;for(let i=0,r=t.length;i<r;i++)t[i].updateMatrixWorld(e)}updateWorldMatrix(e,t){const i=this.parent;if(e===!0&&i!==null&&i.updateWorldMatrix(!0,!1),this.matrixAutoUpdate&&this.updateMatrix(),this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),t===!0){const r=this.children;for(let s=0,a=r.length;s<a;s++)r[s].updateWorldMatrix(!1,!0)}}toJSON(e){const t=e===void 0||typeof e=="string",i={};t&&(e={geometries:{},materials:{},textures:{},images:{},shapes:{},skeletons:{},animations:{},nodes:{}},i.metadata={version:4.6,type:"Object",generator:"Object3D.toJSON"});const r={};r.uuid=this.uuid,r.type=this.type,this.name!==""&&(r.name=this.name),this.castShadow===!0&&(r.castShadow=!0),this.receiveShadow===!0&&(r.receiveShadow=!0),this.visible===!1&&(r.visible=!1),this.frustumCulled===!1&&(r.frustumCulled=!1),this.renderOrder!==0&&(r.renderOrder=this.renderOrder),Object.keys(this.userData).length>0&&(r.userData=this.userData),r.layers=this.layers.mask,r.matrix=this.matrix.toArray(),r.up=this.up.toArray(),this.matrixAutoUpdate===!1&&(r.matrixAutoUpdate=!1),this.isInstancedMesh&&(r.type="InstancedMesh",r.count=this.count,r.instanceMatrix=this.instanceMatrix.toJSON(),this.instanceColor!==null&&(r.instanceColor=this.instanceColor.toJSON())),this.isBatchedMesh&&(r.type="BatchedMesh",r.perObjectFrustumCulled=this.perObjectFrustumCulled,r.sortObjects=this.sortObjects,r.drawRanges=this._drawRanges,r.reservedRanges=this._reservedRanges,r.visibility=this._visibility,r.active=this._active,r.bounds=this._bounds.map(o=>({boxInitialized:o.boxInitialized,boxMin:o.box.min.toArray(),boxMax:o.box.max.toArray(),sphereInitialized:o.sphereInitialized,sphereRadius:o.sphere.radius,sphereCenter:o.sphere.center.toArray()})),r.maxInstanceCount=this._maxInstanceCount,r.maxVertexCount=this._maxVertexCount,r.maxIndexCount=this._maxIndexCount,r.geometryInitialized=this._geometryInitialized,r.geometryCount=this._geometryCount,r.matricesTexture=this._matricesTexture.toJSON(e),this._colorsTexture!==null&&(r.colorsTexture=this._colorsTexture.toJSON(e)),this.boundingSphere!==null&&(r.boundingSphere={center:r.boundingSphere.center.toArray(),radius:r.boundingSphere.radius}),this.boundingBox!==null&&(r.boundingBox={min:r.boundingBox.min.toArray(),max:r.boundingBox.max.toArray()}));function s(o,l){return o[l.uuid]===void 0&&(o[l.uuid]=l.toJSON(e)),l.uuid}if(this.isScene)this.background&&(this.background.isColor?r.background=this.background.toJSON():this.background.isTexture&&(r.background=this.background.toJSON(e).uuid)),this.environment&&this.environment.isTexture&&this.environment.isRenderTargetTexture!==!0&&(r.environment=this.environment.toJSON(e).uuid);else if(this.isMesh||this.isLine||this.isPoints){r.geometry=s(e.geometries,this.geometry);const o=this.geometry.parameters;if(o!==void 0&&o.shapes!==void 0){const l=o.shapes;if(Array.isArray(l))for(let c=0,u=l.length;c<u;c++){const f=l[c];s(e.shapes,f)}else s(e.shapes,l)}}if(this.isSkinnedMesh&&(r.bindMode=this.bindMode,r.bindMatrix=this.bindMatrix.toArray(),this.skeleton!==void 0&&(s(e.skeletons,this.skeleton),r.skeleton=this.skeleton.uuid)),this.material!==void 0)if(Array.isArray(this.material)){const o=[];for(let l=0,c=this.material.length;l<c;l++)o.push(s(e.materials,this.material[l]));r.material=o}else r.material=s(e.materials,this.material);if(this.children.length>0){r.children=[];for(let o=0;o<this.children.length;o++)r.children.push(this.children[o].toJSON(e).object)}if(this.animations.length>0){r.animations=[];for(let o=0;o<this.animations.length;o++){const l=this.animations[o];r.animations.push(s(e.animations,l))}}if(t){const o=a(e.geometries),l=a(e.materials),c=a(e.textures),u=a(e.images),f=a(e.shapes),d=a(e.skeletons),m=a(e.animations),g=a(e.nodes);o.length>0&&(i.geometries=o),l.length>0&&(i.materials=l),c.length>0&&(i.textures=c),u.length>0&&(i.images=u),f.length>0&&(i.shapes=f),d.length>0&&(i.skeletons=d),m.length>0&&(i.animations=m),g.length>0&&(i.nodes=g)}return i.object=r,i;function a(o){const l=[];for(const c in o){const u=o[c];delete u.metadata,l.push(u)}return l}}clone(e){return new this.constructor().copy(this,e)}copy(e,t=!0){if(this.name=e.name,this.up.copy(e.up),this.position.copy(e.position),this.rotation.order=e.rotation.order,this.quaternion.copy(e.quaternion),this.scale.copy(e.scale),this.matrix.copy(e.matrix),this.matrixWorld.copy(e.matrixWorld),this.matrixAutoUpdate=e.matrixAutoUpdate,this.matrixWorldAutoUpdate=e.matrixWorldAutoUpdate,this.matrixWorldNeedsUpdate=e.matrixWorldNeedsUpdate,this.layers.mask=e.layers.mask,this.visible=e.visible,this.castShadow=e.castShadow,this.receiveShadow=e.receiveShadow,this.frustumCulled=e.frustumCulled,this.renderOrder=e.renderOrder,this.animations=e.animations.slice(),this.userData=JSON.parse(JSON.stringify(e.userData)),t===!0)for(let i=0;i<e.children.length;i++){const r=e.children[i];this.add(r.clone())}return this}}Rt.DEFAULT_UP=new N(0,1,0);Rt.DEFAULT_MATRIX_AUTO_UPDATE=!0;Rt.DEFAULT_MATRIX_WORLD_AUTO_UPDATE=!0;const Kt=new N,dn=new N,Us=new N,pn=new N,xi=new N,Mi=new N,ko=new N,Ns=new N,Fs=new N,Os=new N,Bs=new tt,zs=new tt,ks=new tt;class $t{constructor(e=new N,t=new N,i=new N){this.a=e,this.b=t,this.c=i}static getNormal(e,t,i,r){r.subVectors(i,t),Kt.subVectors(e,t),r.cross(Kt);const s=r.lengthSq();return s>0?r.multiplyScalar(1/Math.sqrt(s)):r.set(0,0,0)}static getBarycoord(e,t,i,r,s){Kt.subVectors(r,t),dn.subVectors(i,t),Us.subVectors(e,t);const a=Kt.dot(Kt),o=Kt.dot(dn),l=Kt.dot(Us),c=dn.dot(dn),u=dn.dot(Us),f=a*c-o*o;if(f===0)return s.set(0,0,0),null;const d=1/f,m=(c*l-o*u)*d,g=(a*u-o*l)*d;return s.set(1-m-g,g,m)}static containsPoint(e,t,i,r){return this.getBarycoord(e,t,i,r,pn)===null?!1:pn.x>=0&&pn.y>=0&&pn.x+pn.y<=1}static getInterpolation(e,t,i,r,s,a,o,l){return this.getBarycoord(e,t,i,r,pn)===null?(l.x=0,l.y=0,"z"in l&&(l.z=0),"w"in l&&(l.w=0),null):(l.setScalar(0),l.addScaledVector(s,pn.x),l.addScaledVector(a,pn.y),l.addScaledVector(o,pn.z),l)}static getInterpolatedAttribute(e,t,i,r,s,a){return Bs.setScalar(0),zs.setScalar(0),ks.setScalar(0),Bs.fromBufferAttribute(e,t),zs.fromBufferAttribute(e,i),ks.fromBufferAttribute(e,r),a.setScalar(0),a.addScaledVector(Bs,s.x),a.addScaledVector(zs,s.y),a.addScaledVector(ks,s.z),a}static isFrontFacing(e,t,i,r){return Kt.subVectors(i,t),dn.subVectors(e,t),Kt.cross(dn).dot(r)<0}set(e,t,i){return this.a.copy(e),this.b.copy(t),this.c.copy(i),this}setFromPointsAndIndices(e,t,i,r){return this.a.copy(e[t]),this.b.copy(e[i]),this.c.copy(e[r]),this}setFromAttributeAndIndices(e,t,i,r){return this.a.fromBufferAttribute(e,t),this.b.fromBufferAttribute(e,i),this.c.fromBufferAttribute(e,r),this}clone(){return new this.constructor().copy(this)}copy(e){return this.a.copy(e.a),this.b.copy(e.b),this.c.copy(e.c),this}getArea(){return Kt.subVectors(this.c,this.b),dn.subVectors(this.a,this.b),Kt.cross(dn).length()*.5}getMidpoint(e){return e.addVectors(this.a,this.b).add(this.c).multiplyScalar(1/3)}getNormal(e){return $t.getNormal(this.a,this.b,this.c,e)}getPlane(e){return e.setFromCoplanarPoints(this.a,this.b,this.c)}getBarycoord(e,t){return $t.getBarycoord(e,this.a,this.b,this.c,t)}getInterpolation(e,t,i,r,s){return $t.getInterpolation(e,this.a,this.b,this.c,t,i,r,s)}containsPoint(e){return $t.containsPoint(e,this.a,this.b,this.c)}isFrontFacing(e){return $t.isFrontFacing(this.a,this.b,this.c,e)}intersectsBox(e){return e.intersectsTriangle(this)}closestPointToPoint(e,t){const i=this.a,r=this.b,s=this.c;let a,o;xi.subVectors(r,i),Mi.subVectors(s,i),Ns.subVectors(e,i);const l=xi.dot(Ns),c=Mi.dot(Ns);if(l<=0&&c<=0)return t.copy(i);Fs.subVectors(e,r);const u=xi.dot(Fs),f=Mi.dot(Fs);if(u>=0&&f<=u)return t.copy(r);const d=l*f-u*c;if(d<=0&&l>=0&&u<=0)return a=l/(l-u),t.copy(i).addScaledVector(xi,a);Os.subVectors(e,s);const m=xi.dot(Os),g=Mi.dot(Os);if(g>=0&&m<=g)return t.copy(s);const _=m*c-l*g;if(_<=0&&c>=0&&g<=0)return o=c/(c-g),t.copy(i).addScaledVector(Mi,o);const p=u*g-m*f;if(p<=0&&f-u>=0&&m-g>=0)return ko.subVectors(s,r),o=(f-u)/(f-u+(m-g)),t.copy(r).addScaledVector(ko,o);const h=1/(p+_+d);return a=_*h,o=d*h,t.copy(i).addScaledVector(xi,a).addScaledVector(Mi,o)}equals(e){return e.a.equals(this.a)&&e.b.equals(this.b)&&e.c.equals(this.c)}}const Zl={aliceblue:15792383,antiquewhite:16444375,aqua:65535,aquamarine:8388564,azure:15794175,beige:16119260,bisque:16770244,black:0,blanchedalmond:16772045,blue:255,blueviolet:9055202,brown:10824234,burlywood:14596231,cadetblue:6266528,chartreuse:8388352,chocolate:13789470,coral:16744272,cornflowerblue:6591981,cornsilk:16775388,crimson:14423100,cyan:65535,darkblue:139,darkcyan:35723,darkgoldenrod:12092939,darkgray:11119017,darkgreen:25600,darkgrey:11119017,darkkhaki:12433259,darkmagenta:9109643,darkolivegreen:5597999,darkorange:16747520,darkorchid:10040012,darkred:9109504,darksalmon:15308410,darkseagreen:9419919,darkslateblue:4734347,darkslategray:3100495,darkslategrey:3100495,darkturquoise:52945,darkviolet:9699539,deeppink:16716947,deepskyblue:49151,dimgray:6908265,dimgrey:6908265,dodgerblue:2003199,firebrick:11674146,floralwhite:16775920,forestgreen:2263842,fuchsia:16711935,gainsboro:14474460,ghostwhite:16316671,gold:16766720,goldenrod:14329120,gray:8421504,green:32768,greenyellow:11403055,grey:8421504,honeydew:15794160,hotpink:16738740,indianred:13458524,indigo:4915330,ivory:16777200,khaki:15787660,lavender:15132410,lavenderblush:16773365,lawngreen:8190976,lemonchiffon:16775885,lightblue:11393254,lightcoral:15761536,lightcyan:14745599,lightgoldenrodyellow:16448210,lightgray:13882323,lightgreen:9498256,lightgrey:13882323,lightpink:16758465,lightsalmon:16752762,lightseagreen:2142890,lightskyblue:8900346,lightslategray:7833753,lightslategrey:7833753,lightsteelblue:11584734,lightyellow:16777184,lime:65280,limegreen:3329330,linen:16445670,magenta:16711935,maroon:8388608,mediumaquamarine:6737322,mediumblue:205,mediumorchid:12211667,mediumpurple:9662683,mediumseagreen:3978097,mediumslateblue:8087790,mediumspringgreen:64154,mediumturquoise:4772300,mediumvioletred:13047173,midnightblue:1644912,mintcream:16121850,mistyrose:16770273,moccasin:16770229,navajowhite:16768685,navy:128,oldlace:16643558,olive:8421376,olivedrab:7048739,orange:16753920,orangered:16729344,orchid:14315734,palegoldenrod:15657130,palegreen:10025880,paleturquoise:11529966,palevioletred:14381203,papayawhip:16773077,peachpuff:16767673,peru:13468991,pink:16761035,plum:14524637,powderblue:11591910,purple:8388736,rebeccapurple:6697881,red:16711680,rosybrown:12357519,royalblue:4286945,saddlebrown:9127187,salmon:16416882,sandybrown:16032864,seagreen:3050327,seashell:16774638,sienna:10506797,silver:12632256,skyblue:8900331,slateblue:6970061,slategray:7372944,slategrey:7372944,snow:16775930,springgreen:65407,steelblue:4620980,tan:13808780,teal:32896,thistle:14204888,tomato:16737095,turquoise:4251856,violet:15631086,wheat:16113331,white:16777215,whitesmoke:16119285,yellow:16776960,yellowgreen:10145074},Ln={h:0,s:0,l:0},Dr={h:0,s:0,l:0};function Gs(n,e,t){return t<0&&(t+=1),t>1&&(t-=1),t<1/6?n+(e-n)*6*t:t<1/2?e:t<2/3?n+(e-n)*6*(2/3-t):n}class Je{constructor(e,t,i){return this.isColor=!0,this.r=1,this.g=1,this.b=1,this.set(e,t,i)}set(e,t,i){if(t===void 0&&i===void 0){const r=e;r&&r.isColor?this.copy(r):typeof r=="number"?this.setHex(r):typeof r=="string"&&this.setStyle(r)}else this.setRGB(e,t,i);return this}setScalar(e){return this.r=e,this.g=e,this.b=e,this}setHex(e,t=Ot){return e=Math.floor(e),this.r=(e>>16&255)/255,this.g=(e>>8&255)/255,this.b=(e&255)/255,Xe.toWorkingColorSpace(this,t),this}setRGB(e,t,i,r=Xe.workingColorSpace){return this.r=e,this.g=t,this.b=i,Xe.toWorkingColorSpace(this,r),this}setHSL(e,t,i,r=Xe.workingColorSpace){if(e=Pu(e,1),t=At(t,0,1),i=At(i,0,1),t===0)this.r=this.g=this.b=i;else{const s=i<=.5?i*(1+t):i+t-i*t,a=2*i-s;this.r=Gs(a,s,e+1/3),this.g=Gs(a,s,e),this.b=Gs(a,s,e-1/3)}return Xe.toWorkingColorSpace(this,r),this}setStyle(e,t=Ot){function i(s){s!==void 0&&parseFloat(s)<1&&console.warn("THREE.Color: Alpha component of "+e+" will be ignored.")}let r;if(r=/^(\w+)\(([^\)]*)\)/.exec(e)){let s;const a=r[1],o=r[2];switch(a){case"rgb":case"rgba":if(s=/^\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(o))return i(s[4]),this.setRGB(Math.min(255,parseInt(s[1],10))/255,Math.min(255,parseInt(s[2],10))/255,Math.min(255,parseInt(s[3],10))/255,t);if(s=/^\s*(\d+)\%\s*,\s*(\d+)\%\s*,\s*(\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(o))return i(s[4]),this.setRGB(Math.min(100,parseInt(s[1],10))/100,Math.min(100,parseInt(s[2],10))/100,Math.min(100,parseInt(s[3],10))/100,t);break;case"hsl":case"hsla":if(s=/^\s*(\d*\.?\d+)\s*,\s*(\d*\.?\d+)\%\s*,\s*(\d*\.?\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(o))return i(s[4]),this.setHSL(parseFloat(s[1])/360,parseFloat(s[2])/100,parseFloat(s[3])/100,t);break;default:console.warn("THREE.Color: Unknown color model "+e)}}else if(r=/^\#([A-Fa-f\d]+)$/.exec(e)){const s=r[1],a=s.length;if(a===3)return this.setRGB(parseInt(s.charAt(0),16)/15,parseInt(s.charAt(1),16)/15,parseInt(s.charAt(2),16)/15,t);if(a===6)return this.setHex(parseInt(s,16),t);console.warn("THREE.Color: Invalid hex color "+e)}else if(e&&e.length>0)return this.setColorName(e,t);return this}setColorName(e,t=Ot){const i=Zl[e.toLowerCase()];return i!==void 0?this.setHex(i,t):console.warn("THREE.Color: Unknown color "+e),this}clone(){return new this.constructor(this.r,this.g,this.b)}copy(e){return this.r=e.r,this.g=e.g,this.b=e.b,this}copySRGBToLinear(e){return this.r=_n(e.r),this.g=_n(e.g),this.b=_n(e.b),this}copyLinearToSRGB(e){return this.r=Li(e.r),this.g=Li(e.g),this.b=Li(e.b),this}convertSRGBToLinear(){return this.copySRGBToLinear(this),this}convertLinearToSRGB(){return this.copyLinearToSRGB(this),this}getHex(e=Ot){return Xe.fromWorkingColorSpace(xt.copy(this),e),Math.round(At(xt.r*255,0,255))*65536+Math.round(At(xt.g*255,0,255))*256+Math.round(At(xt.b*255,0,255))}getHexString(e=Ot){return("000000"+this.getHex(e).toString(16)).slice(-6)}getHSL(e,t=Xe.workingColorSpace){Xe.fromWorkingColorSpace(xt.copy(this),t);const i=xt.r,r=xt.g,s=xt.b,a=Math.max(i,r,s),o=Math.min(i,r,s);let l,c;const u=(o+a)/2;if(o===a)l=0,c=0;else{const f=a-o;switch(c=u<=.5?f/(a+o):f/(2-a-o),a){case i:l=(r-s)/f+(r<s?6:0);break;case r:l=(s-i)/f+2;break;case s:l=(i-r)/f+4;break}l/=6}return e.h=l,e.s=c,e.l=u,e}getRGB(e,t=Xe.workingColorSpace){return Xe.fromWorkingColorSpace(xt.copy(this),t),e.r=xt.r,e.g=xt.g,e.b=xt.b,e}getStyle(e=Ot){Xe.fromWorkingColorSpace(xt.copy(this),e);const t=xt.r,i=xt.g,r=xt.b;return e!==Ot?`color(${e} ${t.toFixed(3)} ${i.toFixed(3)} ${r.toFixed(3)})`:`rgb(${Math.round(t*255)},${Math.round(i*255)},${Math.round(r*255)})`}offsetHSL(e,t,i){return this.getHSL(Ln),this.setHSL(Ln.h+e,Ln.s+t,Ln.l+i)}add(e){return this.r+=e.r,this.g+=e.g,this.b+=e.b,this}addColors(e,t){return this.r=e.r+t.r,this.g=e.g+t.g,this.b=e.b+t.b,this}addScalar(e){return this.r+=e,this.g+=e,this.b+=e,this}sub(e){return this.r=Math.max(0,this.r-e.r),this.g=Math.max(0,this.g-e.g),this.b=Math.max(0,this.b-e.b),this}multiply(e){return this.r*=e.r,this.g*=e.g,this.b*=e.b,this}multiplyScalar(e){return this.r*=e,this.g*=e,this.b*=e,this}lerp(e,t){return this.r+=(e.r-this.r)*t,this.g+=(e.g-this.g)*t,this.b+=(e.b-this.b)*t,this}lerpColors(e,t,i){return this.r=e.r+(t.r-e.r)*i,this.g=e.g+(t.g-e.g)*i,this.b=e.b+(t.b-e.b)*i,this}lerpHSL(e,t){this.getHSL(Ln),e.getHSL(Dr);const i=Ts(Ln.h,Dr.h,t),r=Ts(Ln.s,Dr.s,t),s=Ts(Ln.l,Dr.l,t);return this.setHSL(i,r,s),this}setFromVector3(e){return this.r=e.x,this.g=e.y,this.b=e.z,this}applyMatrix3(e){const t=this.r,i=this.g,r=this.b,s=e.elements;return this.r=s[0]*t+s[3]*i+s[6]*r,this.g=s[1]*t+s[4]*i+s[7]*r,this.b=s[2]*t+s[5]*i+s[8]*r,this}equals(e){return e.r===this.r&&e.g===this.g&&e.b===this.b}fromArray(e,t=0){return this.r=e[t],this.g=e[t+1],this.b=e[t+2],this}toArray(e=[],t=0){return e[t]=this.r,e[t+1]=this.g,e[t+2]=this.b,e}fromBufferAttribute(e,t){return this.r=e.getX(t),this.g=e.getY(t),this.b=e.getZ(t),this}toJSON(){return this.getHex()}*[Symbol.iterator](){yield this.r,yield this.g,yield this.b}}const xt=new Je;Je.NAMES=Zl;let Yu=0;class vr extends Xi{static get type(){return"Material"}get type(){return this.constructor.type}set type(e){}constructor(){super(),this.isMaterial=!0,Object.defineProperty(this,"id",{value:Yu++}),this.uuid=gr(),this.name="",this.blending=Pi,this.side=kn,this.vertexColors=!1,this.opacity=1,this.transparent=!1,this.alphaHash=!1,this.blendSrc=sa,this.blendDst=li,this.blendEquation=Qn,this.blendSrcAlpha=null,this.blendDstAlpha=null,this.blendEquationAlpha=null,this.blendColor=new Je(0,0,0),this.blendAlpha=0,this.depthFunc=Ui,this.depthTest=!0,this.depthWrite=!0,this.stencilWriteMask=255,this.stencilFunc=To,this.stencilRef=0,this.stencilFuncMask=255,this.stencilFail=hi,this.stencilZFail=hi,this.stencilZPass=hi,this.stencilWrite=!1,this.clippingPlanes=null,this.clipIntersection=!1,this.clipShadows=!1,this.shadowSide=null,this.colorWrite=!0,this.precision=null,this.polygonOffset=!1,this.polygonOffsetFactor=0,this.polygonOffsetUnits=0,this.dithering=!1,this.alphaToCoverage=!1,this.premultipliedAlpha=!1,this.forceSinglePass=!1,this.visible=!0,this.toneMapped=!0,this.userData={},this.version=0,this._alphaTest=0}get alphaTest(){return this._alphaTest}set alphaTest(e){this._alphaTest>0!=e>0&&this.version++,this._alphaTest=e}onBeforeRender(){}onBeforeCompile(){}customProgramCacheKey(){return this.onBeforeCompile.toString()}setValues(e){if(e!==void 0)for(const t in e){const i=e[t];if(i===void 0){console.warn(`THREE.Material: parameter '${t}' has value of undefined.`);continue}const r=this[t];if(r===void 0){console.warn(`THREE.Material: '${t}' is not a property of THREE.${this.type}.`);continue}r&&r.isColor?r.set(i):r&&r.isVector3&&i&&i.isVector3?r.copy(i):this[t]=i}}toJSON(e){const t=e===void 0||typeof e=="string";t&&(e={textures:{},images:{}});const i={metadata:{version:4.6,type:"Material",generator:"Material.toJSON"}};i.uuid=this.uuid,i.type=this.type,this.name!==""&&(i.name=this.name),this.color&&this.color.isColor&&(i.color=this.color.getHex()),this.roughness!==void 0&&(i.roughness=this.roughness),this.metalness!==void 0&&(i.metalness=this.metalness),this.sheen!==void 0&&(i.sheen=this.sheen),this.sheenColor&&this.sheenColor.isColor&&(i.sheenColor=this.sheenColor.getHex()),this.sheenRoughness!==void 0&&(i.sheenRoughness=this.sheenRoughness),this.emissive&&this.emissive.isColor&&(i.emissive=this.emissive.getHex()),this.emissiveIntensity!==void 0&&this.emissiveIntensity!==1&&(i.emissiveIntensity=this.emissiveIntensity),this.specular&&this.specular.isColor&&(i.specular=this.specular.getHex()),this.specularIntensity!==void 0&&(i.specularIntensity=this.specularIntensity),this.specularColor&&this.specularColor.isColor&&(i.specularColor=this.specularColor.getHex()),this.shininess!==void 0&&(i.shininess=this.shininess),this.clearcoat!==void 0&&(i.clearcoat=this.clearcoat),this.clearcoatRoughness!==void 0&&(i.clearcoatRoughness=this.clearcoatRoughness),this.clearcoatMap&&this.clearcoatMap.isTexture&&(i.clearcoatMap=this.clearcoatMap.toJSON(e).uuid),this.clearcoatRoughnessMap&&this.clearcoatRoughnessMap.isTexture&&(i.clearcoatRoughnessMap=this.clearcoatRoughnessMap.toJSON(e).uuid),this.clearcoatNormalMap&&this.clearcoatNormalMap.isTexture&&(i.clearcoatNormalMap=this.clearcoatNormalMap.toJSON(e).uuid,i.clearcoatNormalScale=this.clearcoatNormalScale.toArray()),this.dispersion!==void 0&&(i.dispersion=this.dispersion),this.iridescence!==void 0&&(i.iridescence=this.iridescence),this.iridescenceIOR!==void 0&&(i.iridescenceIOR=this.iridescenceIOR),this.iridescenceThicknessRange!==void 0&&(i.iridescenceThicknessRange=this.iridescenceThicknessRange),this.iridescenceMap&&this.iridescenceMap.isTexture&&(i.iridescenceMap=this.iridescenceMap.toJSON(e).uuid),this.iridescenceThicknessMap&&this.iridescenceThicknessMap.isTexture&&(i.iridescenceThicknessMap=this.iridescenceThicknessMap.toJSON(e).uuid),this.anisotropy!==void 0&&(i.anisotropy=this.anisotropy),this.anisotropyRotation!==void 0&&(i.anisotropyRotation=this.anisotropyRotation),this.anisotropyMap&&this.anisotropyMap.isTexture&&(i.anisotropyMap=this.anisotropyMap.toJSON(e).uuid),this.map&&this.map.isTexture&&(i.map=this.map.toJSON(e).uuid),this.matcap&&this.matcap.isTexture&&(i.matcap=this.matcap.toJSON(e).uuid),this.alphaMap&&this.alphaMap.isTexture&&(i.alphaMap=this.alphaMap.toJSON(e).uuid),this.lightMap&&this.lightMap.isTexture&&(i.lightMap=this.lightMap.toJSON(e).uuid,i.lightMapIntensity=this.lightMapIntensity),this.aoMap&&this.aoMap.isTexture&&(i.aoMap=this.aoMap.toJSON(e).uuid,i.aoMapIntensity=this.aoMapIntensity),this.bumpMap&&this.bumpMap.isTexture&&(i.bumpMap=this.bumpMap.toJSON(e).uuid,i.bumpScale=this.bumpScale),this.normalMap&&this.normalMap.isTexture&&(i.normalMap=this.normalMap.toJSON(e).uuid,i.normalMapType=this.normalMapType,i.normalScale=this.normalScale.toArray()),this.displacementMap&&this.displacementMap.isTexture&&(i.displacementMap=this.displacementMap.toJSON(e).uuid,i.displacementScale=this.displacementScale,i.displacementBias=this.displacementBias),this.roughnessMap&&this.roughnessMap.isTexture&&(i.roughnessMap=this.roughnessMap.toJSON(e).uuid),this.metalnessMap&&this.metalnessMap.isTexture&&(i.metalnessMap=this.metalnessMap.toJSON(e).uuid),this.emissiveMap&&this.emissiveMap.isTexture&&(i.emissiveMap=this.emissiveMap.toJSON(e).uuid),this.specularMap&&this.specularMap.isTexture&&(i.specularMap=this.specularMap.toJSON(e).uuid),this.specularIntensityMap&&this.specularIntensityMap.isTexture&&(i.specularIntensityMap=this.specularIntensityMap.toJSON(e).uuid),this.specularColorMap&&this.specularColorMap.isTexture&&(i.specularColorMap=this.specularColorMap.toJSON(e).uuid),this.envMap&&this.envMap.isTexture&&(i.envMap=this.envMap.toJSON(e).uuid,this.combine!==void 0&&(i.combine=this.combine)),this.envMapRotation!==void 0&&(i.envMapRotation=this.envMapRotation.toArray()),this.envMapIntensity!==void 0&&(i.envMapIntensity=this.envMapIntensity),this.reflectivity!==void 0&&(i.reflectivity=this.reflectivity),this.refractionRatio!==void 0&&(i.refractionRatio=this.refractionRatio),this.gradientMap&&this.gradientMap.isTexture&&(i.gradientMap=this.gradientMap.toJSON(e).uuid),this.transmission!==void 0&&(i.transmission=this.transmission),this.transmissionMap&&this.transmissionMap.isTexture&&(i.transmissionMap=this.transmissionMap.toJSON(e).uuid),this.thickness!==void 0&&(i.thickness=this.thickness),this.thicknessMap&&this.thicknessMap.isTexture&&(i.thicknessMap=this.thicknessMap.toJSON(e).uuid),this.attenuationDistance!==void 0&&this.attenuationDistance!==1/0&&(i.attenuationDistance=this.attenuationDistance),this.attenuationColor!==void 0&&(i.attenuationColor=this.attenuationColor.getHex()),this.size!==void 0&&(i.size=this.size),this.shadowSide!==null&&(i.shadowSide=this.shadowSide),this.sizeAttenuation!==void 0&&(i.sizeAttenuation=this.sizeAttenuation),this.blending!==Pi&&(i.blending=this.blending),this.side!==kn&&(i.side=this.side),this.vertexColors===!0&&(i.vertexColors=!0),this.opacity<1&&(i.opacity=this.opacity),this.transparent===!0&&(i.transparent=!0),this.blendSrc!==sa&&(i.blendSrc=this.blendSrc),this.blendDst!==li&&(i.blendDst=this.blendDst),this.blendEquation!==Qn&&(i.blendEquation=this.blendEquation),this.blendSrcAlpha!==null&&(i.blendSrcAlpha=this.blendSrcAlpha),this.blendDstAlpha!==null&&(i.blendDstAlpha=this.blendDstAlpha),this.blendEquationAlpha!==null&&(i.blendEquationAlpha=this.blendEquationAlpha),this.blendColor&&this.blendColor.isColor&&(i.blendColor=this.blendColor.getHex()),this.blendAlpha!==0&&(i.blendAlpha=this.blendAlpha),this.depthFunc!==Ui&&(i.depthFunc=this.depthFunc),this.depthTest===!1&&(i.depthTest=this.depthTest),this.depthWrite===!1&&(i.depthWrite=this.depthWrite),this.colorWrite===!1&&(i.colorWrite=this.colorWrite),this.stencilWriteMask!==255&&(i.stencilWriteMask=this.stencilWriteMask),this.stencilFunc!==To&&(i.stencilFunc=this.stencilFunc),this.stencilRef!==0&&(i.stencilRef=this.stencilRef),this.stencilFuncMask!==255&&(i.stencilFuncMask=this.stencilFuncMask),this.stencilFail!==hi&&(i.stencilFail=this.stencilFail),this.stencilZFail!==hi&&(i.stencilZFail=this.stencilZFail),this.stencilZPass!==hi&&(i.stencilZPass=this.stencilZPass),this.stencilWrite===!0&&(i.stencilWrite=this.stencilWrite),this.rotation!==void 0&&this.rotation!==0&&(i.rotation=this.rotation),this.polygonOffset===!0&&(i.polygonOffset=!0),this.polygonOffsetFactor!==0&&(i.polygonOffsetFactor=this.polygonOffsetFactor),this.polygonOffsetUnits!==0&&(i.polygonOffsetUnits=this.polygonOffsetUnits),this.linewidth!==void 0&&this.linewidth!==1&&(i.linewidth=this.linewidth),this.dashSize!==void 0&&(i.dashSize=this.dashSize),this.gapSize!==void 0&&(i.gapSize=this.gapSize),this.scale!==void 0&&(i.scale=this.scale),this.dithering===!0&&(i.dithering=!0),this.alphaTest>0&&(i.alphaTest=this.alphaTest),this.alphaHash===!0&&(i.alphaHash=!0),this.alphaToCoverage===!0&&(i.alphaToCoverage=!0),this.premultipliedAlpha===!0&&(i.premultipliedAlpha=!0),this.forceSinglePass===!0&&(i.forceSinglePass=!0),this.wireframe===!0&&(i.wireframe=!0),this.wireframeLinewidth>1&&(i.wireframeLinewidth=this.wireframeLinewidth),this.wireframeLinecap!=="round"&&(i.wireframeLinecap=this.wireframeLinecap),this.wireframeLinejoin!=="round"&&(i.wireframeLinejoin=this.wireframeLinejoin),this.flatShading===!0&&(i.flatShading=!0),this.visible===!1&&(i.visible=!1),this.toneMapped===!1&&(i.toneMapped=!1),this.fog===!1&&(i.fog=!1),Object.keys(this.userData).length>0&&(i.userData=this.userData);function r(s){const a=[];for(const o in s){const l=s[o];delete l.metadata,a.push(l)}return a}if(t){const s=r(e.textures),a=r(e.images);s.length>0&&(i.textures=s),a.length>0&&(i.images=a)}return i}clone(){return new this.constructor().copy(this)}copy(e){this.name=e.name,this.blending=e.blending,this.side=e.side,this.vertexColors=e.vertexColors,this.opacity=e.opacity,this.transparent=e.transparent,this.blendSrc=e.blendSrc,this.blendDst=e.blendDst,this.blendEquation=e.blendEquation,this.blendSrcAlpha=e.blendSrcAlpha,this.blendDstAlpha=e.blendDstAlpha,this.blendEquationAlpha=e.blendEquationAlpha,this.blendColor.copy(e.blendColor),this.blendAlpha=e.blendAlpha,this.depthFunc=e.depthFunc,this.depthTest=e.depthTest,this.depthWrite=e.depthWrite,this.stencilWriteMask=e.stencilWriteMask,this.stencilFunc=e.stencilFunc,this.stencilRef=e.stencilRef,this.stencilFuncMask=e.stencilFuncMask,this.stencilFail=e.stencilFail,this.stencilZFail=e.stencilZFail,this.stencilZPass=e.stencilZPass,this.stencilWrite=e.stencilWrite;const t=e.clippingPlanes;let i=null;if(t!==null){const r=t.length;i=new Array(r);for(let s=0;s!==r;++s)i[s]=t[s].clone()}return this.clippingPlanes=i,this.clipIntersection=e.clipIntersection,this.clipShadows=e.clipShadows,this.shadowSide=e.shadowSide,this.colorWrite=e.colorWrite,this.precision=e.precision,this.polygonOffset=e.polygonOffset,this.polygonOffsetFactor=e.polygonOffsetFactor,this.polygonOffsetUnits=e.polygonOffsetUnits,this.dithering=e.dithering,this.alphaTest=e.alphaTest,this.alphaHash=e.alphaHash,this.alphaToCoverage=e.alphaToCoverage,this.premultipliedAlpha=e.premultipliedAlpha,this.forceSinglePass=e.forceSinglePass,this.visible=e.visible,this.toneMapped=e.toneMapped,this.userData=JSON.parse(JSON.stringify(e.userData)),this}dispose(){this.dispatchEvent({type:"dispose"})}set needsUpdate(e){e===!0&&this.version++}onBuild(){console.warn("Material: onBuild() has been removed.")}}class jl extends vr{static get type(){return"MeshBasicMaterial"}constructor(e){super(),this.isMeshBasicMaterial=!0,this.color=new Je(16777215),this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.specularMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new yn,this.combine=Ll,this.reflectivity=1,this.refractionRatio=.98,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.lightMap=e.lightMap,this.lightMapIntensity=e.lightMapIntensity,this.aoMap=e.aoMap,this.aoMapIntensity=e.aoMapIntensity,this.specularMap=e.specularMap,this.alphaMap=e.alphaMap,this.envMap=e.envMap,this.envMapRotation.copy(e.envMapRotation),this.combine=e.combine,this.reflectivity=e.reflectivity,this.refractionRatio=e.refractionRatio,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.wireframeLinecap=e.wireframeLinecap,this.wireframeLinejoin=e.wireframeLinejoin,this.fog=e.fog,this}}const ct=new N,Lr=new Ge;class ut{constructor(e,t,i=!1){if(Array.isArray(e))throw new TypeError("THREE.BufferAttribute: array should be a Typed Array.");this.isBufferAttribute=!0,this.name="",this.array=e,this.itemSize=t,this.count=e!==void 0?e.length/t:0,this.normalized=i,this.usage=Ao,this.updateRanges=[],this.gpuType=an,this.version=0}onUploadCallback(){}set needsUpdate(e){e===!0&&this.version++}setUsage(e){return this.usage=e,this}addUpdateRange(e,t){this.updateRanges.push({start:e,count:t})}clearUpdateRanges(){this.updateRanges.length=0}copy(e){return this.name=e.name,this.array=new e.array.constructor(e.array),this.itemSize=e.itemSize,this.count=e.count,this.normalized=e.normalized,this.usage=e.usage,this.gpuType=e.gpuType,this}copyAt(e,t,i){e*=this.itemSize,i*=t.itemSize;for(let r=0,s=this.itemSize;r<s;r++)this.array[e+r]=t.array[i+r];return this}copyArray(e){return this.array.set(e),this}applyMatrix3(e){if(this.itemSize===2)for(let t=0,i=this.count;t<i;t++)Lr.fromBufferAttribute(this,t),Lr.applyMatrix3(e),this.setXY(t,Lr.x,Lr.y);else if(this.itemSize===3)for(let t=0,i=this.count;t<i;t++)ct.fromBufferAttribute(this,t),ct.applyMatrix3(e),this.setXYZ(t,ct.x,ct.y,ct.z);return this}applyMatrix4(e){for(let t=0,i=this.count;t<i;t++)ct.fromBufferAttribute(this,t),ct.applyMatrix4(e),this.setXYZ(t,ct.x,ct.y,ct.z);return this}applyNormalMatrix(e){for(let t=0,i=this.count;t<i;t++)ct.fromBufferAttribute(this,t),ct.applyNormalMatrix(e),this.setXYZ(t,ct.x,ct.y,ct.z);return this}transformDirection(e){for(let t=0,i=this.count;t<i;t++)ct.fromBufferAttribute(this,t),ct.transformDirection(e),this.setXYZ(t,ct.x,ct.y,ct.z);return this}set(e,t=0){return this.array.set(e,t),this}getComponent(e,t){let i=this.array[e*this.itemSize+t];return this.normalized&&(i=ji(i,this.array)),i}setComponent(e,t,i){return this.normalized&&(i=Tt(i,this.array)),this.array[e*this.itemSize+t]=i,this}getX(e){let t=this.array[e*this.itemSize];return this.normalized&&(t=ji(t,this.array)),t}setX(e,t){return this.normalized&&(t=Tt(t,this.array)),this.array[e*this.itemSize]=t,this}getY(e){let t=this.array[e*this.itemSize+1];return this.normalized&&(t=ji(t,this.array)),t}setY(e,t){return this.normalized&&(t=Tt(t,this.array)),this.array[e*this.itemSize+1]=t,this}getZ(e){let t=this.array[e*this.itemSize+2];return this.normalized&&(t=ji(t,this.array)),t}setZ(e,t){return this.normalized&&(t=Tt(t,this.array)),this.array[e*this.itemSize+2]=t,this}getW(e){let t=this.array[e*this.itemSize+3];return this.normalized&&(t=ji(t,this.array)),t}setW(e,t){return this.normalized&&(t=Tt(t,this.array)),this.array[e*this.itemSize+3]=t,this}setXY(e,t,i){return e*=this.itemSize,this.normalized&&(t=Tt(t,this.array),i=Tt(i,this.array)),this.array[e+0]=t,this.array[e+1]=i,this}setXYZ(e,t,i,r){return e*=this.itemSize,this.normalized&&(t=Tt(t,this.array),i=Tt(i,this.array),r=Tt(r,this.array)),this.array[e+0]=t,this.array[e+1]=i,this.array[e+2]=r,this}setXYZW(e,t,i,r,s){return e*=this.itemSize,this.normalized&&(t=Tt(t,this.array),i=Tt(i,this.array),r=Tt(r,this.array),s=Tt(s,this.array)),this.array[e+0]=t,this.array[e+1]=i,this.array[e+2]=r,this.array[e+3]=s,this}onUpload(e){return this.onUploadCallback=e,this}clone(){return new this.constructor(this.array,this.itemSize).copy(this)}toJSON(){const e={itemSize:this.itemSize,type:this.array.constructor.name,array:Array.from(this.array),normalized:this.normalized};return this.name!==""&&(e.name=this.name),this.usage!==Ao&&(e.usage=this.usage),e}}class Jl extends ut{constructor(e,t,i){super(new Uint16Array(e),t,i)}}class Ql extends ut{constructor(e,t,i){super(new Uint32Array(e),t,i)}}class si extends ut{constructor(e,t,i){super(new Float32Array(e),t,i)}}let Ku=0;const Ft=new st,Hs=new Rt,Si=new N,Lt=new _r,tr=new _r,mt=new N;class Qt extends Xi{constructor(){super(),this.isBufferGeometry=!0,Object.defineProperty(this,"id",{value:Ku++}),this.uuid=gr(),this.name="",this.type="BufferGeometry",this.index=null,this.indirect=null,this.attributes={},this.morphAttributes={},this.morphTargetsRelative=!1,this.groups=[],this.boundingBox=null,this.boundingSphere=null,this.drawRange={start:0,count:1/0},this.userData={}}getIndex(){return this.index}setIndex(e){return Array.isArray(e)?this.index=new(Xl(e)?Ql:Jl)(e,1):this.index=e,this}setIndirect(e){return this.indirect=e,this}getIndirect(){return this.indirect}getAttribute(e){return this.attributes[e]}setAttribute(e,t){return this.attributes[e]=t,this}deleteAttribute(e){return delete this.attributes[e],this}hasAttribute(e){return this.attributes[e]!==void 0}addGroup(e,t,i=0){this.groups.push({start:e,count:t,materialIndex:i})}clearGroups(){this.groups=[]}setDrawRange(e,t){this.drawRange.start=e,this.drawRange.count=t}applyMatrix4(e){const t=this.attributes.position;t!==void 0&&(t.applyMatrix4(e),t.needsUpdate=!0);const i=this.attributes.normal;if(i!==void 0){const s=new Ne().getNormalMatrix(e);i.applyNormalMatrix(s),i.needsUpdate=!0}const r=this.attributes.tangent;return r!==void 0&&(r.transformDirection(e),r.needsUpdate=!0),this.boundingBox!==null&&this.computeBoundingBox(),this.boundingSphere!==null&&this.computeBoundingSphere(),this}applyQuaternion(e){return Ft.makeRotationFromQuaternion(e),this.applyMatrix4(Ft),this}rotateX(e){return Ft.makeRotationX(e),this.applyMatrix4(Ft),this}rotateY(e){return Ft.makeRotationY(e),this.applyMatrix4(Ft),this}rotateZ(e){return Ft.makeRotationZ(e),this.applyMatrix4(Ft),this}translate(e,t,i){return Ft.makeTranslation(e,t,i),this.applyMatrix4(Ft),this}scale(e,t,i){return Ft.makeScale(e,t,i),this.applyMatrix4(Ft),this}lookAt(e){return Hs.lookAt(e),Hs.updateMatrix(),this.applyMatrix4(Hs.matrix),this}center(){return this.computeBoundingBox(),this.boundingBox.getCenter(Si).negate(),this.translate(Si.x,Si.y,Si.z),this}setFromPoints(e){const t=this.getAttribute("position");if(t===void 0){const i=[];for(let r=0,s=e.length;r<s;r++){const a=e[r];i.push(a.x,a.y,a.z||0)}this.setAttribute("position",new si(i,3))}else{for(let i=0,r=t.count;i<r;i++){const s=e[i];t.setXYZ(i,s.x,s.y,s.z||0)}e.length>t.count&&console.warn("THREE.BufferGeometry: Buffer size too small for points data. Use .dispose() and create a new geometry."),t.needsUpdate=!0}return this}computeBoundingBox(){this.boundingBox===null&&(this.boundingBox=new _r);const e=this.attributes.position,t=this.morphAttributes.position;if(e&&e.isGLBufferAttribute){console.error("THREE.BufferGeometry.computeBoundingBox(): GLBufferAttribute requires a manual bounding box.",this),this.boundingBox.set(new N(-1/0,-1/0,-1/0),new N(1/0,1/0,1/0));return}if(e!==void 0){if(this.boundingBox.setFromBufferAttribute(e),t)for(let i=0,r=t.length;i<r;i++){const s=t[i];Lt.setFromBufferAttribute(s),this.morphTargetsRelative?(mt.addVectors(this.boundingBox.min,Lt.min),this.boundingBox.expandByPoint(mt),mt.addVectors(this.boundingBox.max,Lt.max),this.boundingBox.expandByPoint(mt)):(this.boundingBox.expandByPoint(Lt.min),this.boundingBox.expandByPoint(Lt.max))}}else this.boundingBox.makeEmpty();(isNaN(this.boundingBox.min.x)||isNaN(this.boundingBox.min.y)||isNaN(this.boundingBox.min.z))&&console.error('THREE.BufferGeometry.computeBoundingBox(): Computed min/max have NaN values. The "position" attribute is likely to have NaN values.',this)}computeBoundingSphere(){this.boundingSphere===null&&(this.boundingSphere=new ms);const e=this.attributes.position,t=this.morphAttributes.position;if(e&&e.isGLBufferAttribute){console.error("THREE.BufferGeometry.computeBoundingSphere(): GLBufferAttribute requires a manual bounding sphere.",this),this.boundingSphere.set(new N,1/0);return}if(e){const i=this.boundingSphere.center;if(Lt.setFromBufferAttribute(e),t)for(let s=0,a=t.length;s<a;s++){const o=t[s];tr.setFromBufferAttribute(o),this.morphTargetsRelative?(mt.addVectors(Lt.min,tr.min),Lt.expandByPoint(mt),mt.addVectors(Lt.max,tr.max),Lt.expandByPoint(mt)):(Lt.expandByPoint(tr.min),Lt.expandByPoint(tr.max))}Lt.getCenter(i);let r=0;for(let s=0,a=e.count;s<a;s++)mt.fromBufferAttribute(e,s),r=Math.max(r,i.distanceToSquared(mt));if(t)for(let s=0,a=t.length;s<a;s++){const o=t[s],l=this.morphTargetsRelative;for(let c=0,u=o.count;c<u;c++)mt.fromBufferAttribute(o,c),l&&(Si.fromBufferAttribute(e,c),mt.add(Si)),r=Math.max(r,i.distanceToSquared(mt))}this.boundingSphere.radius=Math.sqrt(r),isNaN(this.boundingSphere.radius)&&console.error('THREE.BufferGeometry.computeBoundingSphere(): Computed radius is NaN. The "position" attribute is likely to have NaN values.',this)}}computeTangents(){const e=this.index,t=this.attributes;if(e===null||t.position===void 0||t.normal===void 0||t.uv===void 0){console.error("THREE.BufferGeometry: .computeTangents() failed. Missing required attributes (index, position, normal or uv)");return}const i=t.position,r=t.normal,s=t.uv;this.hasAttribute("tangent")===!1&&this.setAttribute("tangent",new ut(new Float32Array(4*i.count),4));const a=this.getAttribute("tangent"),o=[],l=[];for(let L=0;L<i.count;L++)o[L]=new N,l[L]=new N;const c=new N,u=new N,f=new N,d=new Ge,m=new Ge,g=new Ge,_=new N,p=new N;function h(L,E,x){c.fromBufferAttribute(i,L),u.fromBufferAttribute(i,E),f.fromBufferAttribute(i,x),d.fromBufferAttribute(s,L),m.fromBufferAttribute(s,E),g.fromBufferAttribute(s,x),u.sub(c),f.sub(c),m.sub(d),g.sub(d);const w=1/(m.x*g.y-g.x*m.y);isFinite(w)&&(_.copy(u).multiplyScalar(g.y).addScaledVector(f,-m.y).multiplyScalar(w),p.copy(f).multiplyScalar(m.x).addScaledVector(u,-g.x).multiplyScalar(w),o[L].add(_),o[E].add(_),o[x].add(_),l[L].add(p),l[E].add(p),l[x].add(p))}let T=this.groups;T.length===0&&(T=[{start:0,count:e.count}]);for(let L=0,E=T.length;L<E;++L){const x=T[L],w=x.start,k=x.count;for(let O=w,X=w+k;O<X;O+=3)h(e.getX(O+0),e.getX(O+1),e.getX(O+2))}const S=new N,M=new N,P=new N,b=new N;function R(L){P.fromBufferAttribute(r,L),b.copy(P);const E=o[L];S.copy(E),S.sub(P.multiplyScalar(P.dot(E))).normalize(),M.crossVectors(b,E);const w=M.dot(l[L])<0?-1:1;a.setXYZW(L,S.x,S.y,S.z,w)}for(let L=0,E=T.length;L<E;++L){const x=T[L],w=x.start,k=x.count;for(let O=w,X=w+k;O<X;O+=3)R(e.getX(O+0)),R(e.getX(O+1)),R(e.getX(O+2))}}computeVertexNormals(){const e=this.index,t=this.getAttribute("position");if(t!==void 0){let i=this.getAttribute("normal");if(i===void 0)i=new ut(new Float32Array(t.count*3),3),this.setAttribute("normal",i);else for(let d=0,m=i.count;d<m;d++)i.setXYZ(d,0,0,0);const r=new N,s=new N,a=new N,o=new N,l=new N,c=new N,u=new N,f=new N;if(e)for(let d=0,m=e.count;d<m;d+=3){const g=e.getX(d+0),_=e.getX(d+1),p=e.getX(d+2);r.fromBufferAttribute(t,g),s.fromBufferAttribute(t,_),a.fromBufferAttribute(t,p),u.subVectors(a,s),f.subVectors(r,s),u.cross(f),o.fromBufferAttribute(i,g),l.fromBufferAttribute(i,_),c.fromBufferAttribute(i,p),o.add(u),l.add(u),c.add(u),i.setXYZ(g,o.x,o.y,o.z),i.setXYZ(_,l.x,l.y,l.z),i.setXYZ(p,c.x,c.y,c.z)}else for(let d=0,m=t.count;d<m;d+=3)r.fromBufferAttribute(t,d+0),s.fromBufferAttribute(t,d+1),a.fromBufferAttribute(t,d+2),u.subVectors(a,s),f.subVectors(r,s),u.cross(f),i.setXYZ(d+0,u.x,u.y,u.z),i.setXYZ(d+1,u.x,u.y,u.z),i.setXYZ(d+2,u.x,u.y,u.z);this.normalizeNormals(),i.needsUpdate=!0}}normalizeNormals(){const e=this.attributes.normal;for(let t=0,i=e.count;t<i;t++)mt.fromBufferAttribute(e,t),mt.normalize(),e.setXYZ(t,mt.x,mt.y,mt.z)}toNonIndexed(){function e(o,l){const c=o.array,u=o.itemSize,f=o.normalized,d=new c.constructor(l.length*u);let m=0,g=0;for(let _=0,p=l.length;_<p;_++){o.isInterleavedBufferAttribute?m=l[_]*o.data.stride+o.offset:m=l[_]*u;for(let h=0;h<u;h++)d[g++]=c[m++]}return new ut(d,u,f)}if(this.index===null)return console.warn("THREE.BufferGeometry.toNonIndexed(): BufferGeometry is already non-indexed."),this;const t=new Qt,i=this.index.array,r=this.attributes;for(const o in r){const l=r[o],c=e(l,i);t.setAttribute(o,c)}const s=this.morphAttributes;for(const o in s){const l=[],c=s[o];for(let u=0,f=c.length;u<f;u++){const d=c[u],m=e(d,i);l.push(m)}t.morphAttributes[o]=l}t.morphTargetsRelative=this.morphTargetsRelative;const a=this.groups;for(let o=0,l=a.length;o<l;o++){const c=a[o];t.addGroup(c.start,c.count,c.materialIndex)}return t}toJSON(){const e={metadata:{version:4.6,type:"BufferGeometry",generator:"BufferGeometry.toJSON"}};if(e.uuid=this.uuid,e.type=this.type,this.name!==""&&(e.name=this.name),Object.keys(this.userData).length>0&&(e.userData=this.userData),this.parameters!==void 0){const l=this.parameters;for(const c in l)l[c]!==void 0&&(e[c]=l[c]);return e}e.data={attributes:{}};const t=this.index;t!==null&&(e.data.index={type:t.array.constructor.name,array:Array.prototype.slice.call(t.array)});const i=this.attributes;for(const l in i){const c=i[l];e.data.attributes[l]=c.toJSON(e.data)}const r={};let s=!1;for(const l in this.morphAttributes){const c=this.morphAttributes[l],u=[];for(let f=0,d=c.length;f<d;f++){const m=c[f];u.push(m.toJSON(e.data))}u.length>0&&(r[l]=u,s=!0)}s&&(e.data.morphAttributes=r,e.data.morphTargetsRelative=this.morphTargetsRelative);const a=this.groups;a.length>0&&(e.data.groups=JSON.parse(JSON.stringify(a)));const o=this.boundingSphere;return o!==null&&(e.data.boundingSphere={center:o.center.toArray(),radius:o.radius}),e}clone(){return new this.constructor().copy(this)}copy(e){this.index=null,this.attributes={},this.morphAttributes={},this.groups=[],this.boundingBox=null,this.boundingSphere=null;const t={};this.name=e.name;const i=e.index;i!==null&&this.setIndex(i.clone(t));const r=e.attributes;for(const c in r){const u=r[c];this.setAttribute(c,u.clone(t))}const s=e.morphAttributes;for(const c in s){const u=[],f=s[c];for(let d=0,m=f.length;d<m;d++)u.push(f[d].clone(t));this.morphAttributes[c]=u}this.morphTargetsRelative=e.morphTargetsRelative;const a=e.groups;for(let c=0,u=a.length;c<u;c++){const f=a[c];this.addGroup(f.start,f.count,f.materialIndex)}const o=e.boundingBox;o!==null&&(this.boundingBox=o.clone());const l=e.boundingSphere;return l!==null&&(this.boundingSphere=l.clone()),this.drawRange.start=e.drawRange.start,this.drawRange.count=e.drawRange.count,this.userData=e.userData,this}dispose(){this.dispatchEvent({type:"dispose"})}}const Go=new st,qn=new Kl,Ir=new ms,Ho=new N,Ur=new N,Nr=new N,Fr=new N,Vs=new N,Or=new N,Vo=new N,Br=new N;class kt extends Rt{constructor(e=new Qt,t=new jl){super(),this.isMesh=!0,this.type="Mesh",this.geometry=e,this.material=t,this.updateMorphTargets()}copy(e,t){return super.copy(e,t),e.morphTargetInfluences!==void 0&&(this.morphTargetInfluences=e.morphTargetInfluences.slice()),e.morphTargetDictionary!==void 0&&(this.morphTargetDictionary=Object.assign({},e.morphTargetDictionary)),this.material=Array.isArray(e.material)?e.material.slice():e.material,this.geometry=e.geometry,this}updateMorphTargets(){const t=this.geometry.morphAttributes,i=Object.keys(t);if(i.length>0){const r=t[i[0]];if(r!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let s=0,a=r.length;s<a;s++){const o=r[s].name||String(s);this.morphTargetInfluences.push(0),this.morphTargetDictionary[o]=s}}}}getVertexPosition(e,t){const i=this.geometry,r=i.attributes.position,s=i.morphAttributes.position,a=i.morphTargetsRelative;t.fromBufferAttribute(r,e);const o=this.morphTargetInfluences;if(s&&o){Or.set(0,0,0);for(let l=0,c=s.length;l<c;l++){const u=o[l],f=s[l];u!==0&&(Vs.fromBufferAttribute(f,e),a?Or.addScaledVector(Vs,u):Or.addScaledVector(Vs.sub(t),u))}t.add(Or)}return t}raycast(e,t){const i=this.geometry,r=this.material,s=this.matrixWorld;r!==void 0&&(i.boundingSphere===null&&i.computeBoundingSphere(),Ir.copy(i.boundingSphere),Ir.applyMatrix4(s),qn.copy(e.ray).recast(e.near),!(Ir.containsPoint(qn.origin)===!1&&(qn.intersectSphere(Ir,Ho)===null||qn.origin.distanceToSquared(Ho)>(e.far-e.near)**2))&&(Go.copy(s).invert(),qn.copy(e.ray).applyMatrix4(Go),!(i.boundingBox!==null&&qn.intersectsBox(i.boundingBox)===!1)&&this._computeIntersections(e,t,qn)))}_computeIntersections(e,t,i){let r;const s=this.geometry,a=this.material,o=s.index,l=s.attributes.position,c=s.attributes.uv,u=s.attributes.uv1,f=s.attributes.normal,d=s.groups,m=s.drawRange;if(o!==null)if(Array.isArray(a))for(let g=0,_=d.length;g<_;g++){const p=d[g],h=a[p.materialIndex],T=Math.max(p.start,m.start),S=Math.min(o.count,Math.min(p.start+p.count,m.start+m.count));for(let M=T,P=S;M<P;M+=3){const b=o.getX(M),R=o.getX(M+1),L=o.getX(M+2);r=zr(this,h,e,i,c,u,f,b,R,L),r&&(r.faceIndex=Math.floor(M/3),r.face.materialIndex=p.materialIndex,t.push(r))}}else{const g=Math.max(0,m.start),_=Math.min(o.count,m.start+m.count);for(let p=g,h=_;p<h;p+=3){const T=o.getX(p),S=o.getX(p+1),M=o.getX(p+2);r=zr(this,a,e,i,c,u,f,T,S,M),r&&(r.faceIndex=Math.floor(p/3),t.push(r))}}else if(l!==void 0)if(Array.isArray(a))for(let g=0,_=d.length;g<_;g++){const p=d[g],h=a[p.materialIndex],T=Math.max(p.start,m.start),S=Math.min(l.count,Math.min(p.start+p.count,m.start+m.count));for(let M=T,P=S;M<P;M+=3){const b=M,R=M+1,L=M+2;r=zr(this,h,e,i,c,u,f,b,R,L),r&&(r.faceIndex=Math.floor(M/3),r.face.materialIndex=p.materialIndex,t.push(r))}}else{const g=Math.max(0,m.start),_=Math.min(l.count,m.start+m.count);for(let p=g,h=_;p<h;p+=3){const T=p,S=p+1,M=p+2;r=zr(this,a,e,i,c,u,f,T,S,M),r&&(r.faceIndex=Math.floor(p/3),t.push(r))}}}}function $u(n,e,t,i,r,s,a,o){let l;if(e.side===wt?l=i.intersectTriangle(a,s,r,!0,o):l=i.intersectTriangle(r,s,a,e.side===kn,o),l===null)return null;Br.copy(o),Br.applyMatrix4(n.matrixWorld);const c=t.ray.origin.distanceTo(Br);return c<t.near||c>t.far?null:{distance:c,point:Br.clone(),object:n}}function zr(n,e,t,i,r,s,a,o,l,c){n.getVertexPosition(o,Ur),n.getVertexPosition(l,Nr),n.getVertexPosition(c,Fr);const u=$u(n,e,t,i,Ur,Nr,Fr,Vo);if(u){const f=new N;$t.getBarycoord(Vo,Ur,Nr,Fr,f),r&&(u.uv=$t.getInterpolatedAttribute(r,o,l,c,f,new Ge)),s&&(u.uv1=$t.getInterpolatedAttribute(s,o,l,c,f,new Ge)),a&&(u.normal=$t.getInterpolatedAttribute(a,o,l,c,f,new N),u.normal.dot(i.direction)>0&&u.normal.multiplyScalar(-1));const d={a:o,b:l,c,normal:new N,materialIndex:0};$t.getNormal(Ur,Nr,Fr,d.normal),u.face=d,u.barycoord=f}return u}class xr extends Qt{constructor(e=1,t=1,i=1,r=1,s=1,a=1){super(),this.type="BoxGeometry",this.parameters={width:e,height:t,depth:i,widthSegments:r,heightSegments:s,depthSegments:a};const o=this;r=Math.floor(r),s=Math.floor(s),a=Math.floor(a);const l=[],c=[],u=[],f=[];let d=0,m=0;g("z","y","x",-1,-1,i,t,e,a,s,0),g("z","y","x",1,-1,i,t,-e,a,s,1),g("x","z","y",1,1,e,i,t,r,a,2),g("x","z","y",1,-1,e,i,-t,r,a,3),g("x","y","z",1,-1,e,t,i,r,s,4),g("x","y","z",-1,-1,e,t,-i,r,s,5),this.setIndex(l),this.setAttribute("position",new si(c,3)),this.setAttribute("normal",new si(u,3)),this.setAttribute("uv",new si(f,2));function g(_,p,h,T,S,M,P,b,R,L,E){const x=M/R,w=P/L,k=M/2,O=P/2,X=b/2,Z=R+1,G=L+1;let $=0,V=0;const re=new N;for(let Q=0;Q<G;Q++){const se=Q*w-O;for(let be=0;be<Z;be++){const ke=be*x-k;re[_]=ke*T,re[p]=se*S,re[h]=X,c.push(re.x,re.y,re.z),re[_]=0,re[p]=0,re[h]=b>0?1:-1,u.push(re.x,re.y,re.z),f.push(be/R),f.push(1-Q/L),$+=1}}for(let Q=0;Q<L;Q++)for(let se=0;se<R;se++){const be=d+se+Z*Q,ke=d+se+Z*(Q+1),H=d+(se+1)+Z*(Q+1),K=d+(se+1)+Z*Q;l.push(be,ke,K),l.push(ke,H,K),V+=6}o.addGroup(m,V,E),m+=V,d+=$}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new xr(e.width,e.height,e.depth,e.widthSegments,e.heightSegments,e.depthSegments)}}function zi(n){const e={};for(const t in n){e[t]={};for(const i in n[t]){const r=n[t][i];r&&(r.isColor||r.isMatrix3||r.isMatrix4||r.isVector2||r.isVector3||r.isVector4||r.isTexture||r.isQuaternion)?r.isRenderTargetTexture?(console.warn("UniformsUtils: Textures of render targets cannot be cloned via cloneUniforms() or mergeUniforms()."),e[t][i]=null):e[t][i]=r.clone():Array.isArray(r)?e[t][i]=r.slice():e[t][i]=r}}return e}function St(n){const e={};for(let t=0;t<n.length;t++){const i=zi(n[t]);for(const r in i)e[r]=i[r]}return e}function Zu(n){const e=[];for(let t=0;t<n.length;t++)e.push(n[t].clone());return e}function ec(n){const e=n.getRenderTarget();return e===null?n.outputColorSpace:e.isXRRenderTarget===!0?e.texture.colorSpace:Xe.workingColorSpace}const ju={clone:zi,merge:St};var Ju=`void main() {
	gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
}`,Qu=`void main() {
	gl_FragColor = vec4( 1.0, 0.0, 0.0, 1.0 );
}`;class bt extends vr{static get type(){return"ShaderMaterial"}constructor(e){super(),this.isShaderMaterial=!0,this.defines={},this.uniforms={},this.uniformsGroups=[],this.vertexShader=Ju,this.fragmentShader=Qu,this.linewidth=1,this.wireframe=!1,this.wireframeLinewidth=1,this.fog=!1,this.lights=!1,this.clipping=!1,this.forceSinglePass=!0,this.extensions={clipCullDistance:!1,multiDraw:!1},this.defaultAttributeValues={color:[1,1,1],uv:[0,0],uv1:[0,0]},this.index0AttributeName=void 0,this.uniformsNeedUpdate=!1,this.glslVersion=null,e!==void 0&&this.setValues(e)}copy(e){return super.copy(e),this.fragmentShader=e.fragmentShader,this.vertexShader=e.vertexShader,this.uniforms=zi(e.uniforms),this.uniformsGroups=Zu(e.uniformsGroups),this.defines=Object.assign({},e.defines),this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.fog=e.fog,this.lights=e.lights,this.clipping=e.clipping,this.extensions=Object.assign({},e.extensions),this.glslVersion=e.glslVersion,this}toJSON(e){const t=super.toJSON(e);t.glslVersion=this.glslVersion,t.uniforms={};for(const r in this.uniforms){const a=this.uniforms[r].value;a&&a.isTexture?t.uniforms[r]={type:"t",value:a.toJSON(e).uuid}:a&&a.isColor?t.uniforms[r]={type:"c",value:a.getHex()}:a&&a.isVector2?t.uniforms[r]={type:"v2",value:a.toArray()}:a&&a.isVector3?t.uniforms[r]={type:"v3",value:a.toArray()}:a&&a.isVector4?t.uniforms[r]={type:"v4",value:a.toArray()}:a&&a.isMatrix3?t.uniforms[r]={type:"m3",value:a.toArray()}:a&&a.isMatrix4?t.uniforms[r]={type:"m4",value:a.toArray()}:t.uniforms[r]={value:a}}Object.keys(this.defines).length>0&&(t.defines=this.defines),t.vertexShader=this.vertexShader,t.fragmentShader=this.fragmentShader,t.lights=this.lights,t.clipping=this.clipping;const i={};for(const r in this.extensions)this.extensions[r]===!0&&(i[r]=!0);return Object.keys(i).length>0&&(t.extensions=i),t}}class tc extends Rt{constructor(){super(),this.isCamera=!0,this.type="Camera",this.matrixWorldInverse=new st,this.projectionMatrix=new st,this.projectionMatrixInverse=new st,this.coordinateSystem=gn}copy(e,t){return super.copy(e,t),this.matrixWorldInverse.copy(e.matrixWorldInverse),this.projectionMatrix.copy(e.projectionMatrix),this.projectionMatrixInverse.copy(e.projectionMatrixInverse),this.coordinateSystem=e.coordinateSystem,this}getWorldDirection(e){return super.getWorldDirection(e).negate()}updateMatrixWorld(e){super.updateMatrixWorld(e),this.matrixWorldInverse.copy(this.matrixWorld).invert()}updateWorldMatrix(e,t){super.updateWorldMatrix(e,t),this.matrixWorldInverse.copy(this.matrixWorld).invert()}clone(){return new this.constructor().copy(this)}}const In=new N,Wo=new Ge,Xo=new Ge;class It extends tc{constructor(e=50,t=1,i=.1,r=2e3){super(),this.isPerspectiveCamera=!0,this.type="PerspectiveCamera",this.fov=e,this.zoom=1,this.near=i,this.far=r,this.focus=10,this.aspect=t,this.view=null,this.filmGauge=35,this.filmOffset=0,this.updateProjectionMatrix()}copy(e,t){return super.copy(e,t),this.fov=e.fov,this.zoom=e.zoom,this.near=e.near,this.far=e.far,this.focus=e.focus,this.aspect=e.aspect,this.view=e.view===null?null:Object.assign({},e.view),this.filmGauge=e.filmGauge,this.filmOffset=e.filmOffset,this}setFocalLength(e){const t=.5*this.getFilmHeight()/e;this.fov=Va*2*Math.atan(t),this.updateProjectionMatrix()}getFocalLength(){const e=Math.tan(Es*.5*this.fov);return .5*this.getFilmHeight()/e}getEffectiveFOV(){return Va*2*Math.atan(Math.tan(Es*.5*this.fov)/this.zoom)}getFilmWidth(){return this.filmGauge*Math.min(this.aspect,1)}getFilmHeight(){return this.filmGauge/Math.max(this.aspect,1)}getViewBounds(e,t,i){In.set(-1,-1,.5).applyMatrix4(this.projectionMatrixInverse),t.set(In.x,In.y).multiplyScalar(-e/In.z),In.set(1,1,.5).applyMatrix4(this.projectionMatrixInverse),i.set(In.x,In.y).multiplyScalar(-e/In.z)}getViewSize(e,t){return this.getViewBounds(e,Wo,Xo),t.subVectors(Xo,Wo)}setViewOffset(e,t,i,r,s,a){this.aspect=e/t,this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=e,this.view.fullHeight=t,this.view.offsetX=i,this.view.offsetY=r,this.view.width=s,this.view.height=a,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){const e=this.near;let t=e*Math.tan(Es*.5*this.fov)/this.zoom,i=2*t,r=this.aspect*i,s=-.5*r;const a=this.view;if(this.view!==null&&this.view.enabled){const l=a.fullWidth,c=a.fullHeight;s+=a.offsetX*r/l,t-=a.offsetY*i/c,r*=a.width/l,i*=a.height/c}const o=this.filmOffset;o!==0&&(s+=e*o/this.getFilmWidth()),this.projectionMatrix.makePerspective(s,s+r,t,t-i,e,this.far,this.coordinateSystem),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(e){const t=super.toJSON(e);return t.object.fov=this.fov,t.object.zoom=this.zoom,t.object.near=this.near,t.object.far=this.far,t.object.focus=this.focus,t.object.aspect=this.aspect,this.view!==null&&(t.object.view=Object.assign({},this.view)),t.object.filmGauge=this.filmGauge,t.object.filmOffset=this.filmOffset,t}}const yi=-90,Ei=1;class eh extends Rt{constructor(e,t,i){super(),this.type="CubeCamera",this.renderTarget=i,this.coordinateSystem=null,this.activeMipmapLevel=0;const r=new It(yi,Ei,e,t);r.layers=this.layers,this.add(r);const s=new It(yi,Ei,e,t);s.layers=this.layers,this.add(s);const a=new It(yi,Ei,e,t);a.layers=this.layers,this.add(a);const o=new It(yi,Ei,e,t);o.layers=this.layers,this.add(o);const l=new It(yi,Ei,e,t);l.layers=this.layers,this.add(l);const c=new It(yi,Ei,e,t);c.layers=this.layers,this.add(c)}updateCoordinateSystem(){const e=this.coordinateSystem,t=this.children.concat(),[i,r,s,a,o,l]=t;for(const c of t)this.remove(c);if(e===gn)i.up.set(0,1,0),i.lookAt(1,0,0),r.up.set(0,1,0),r.lookAt(-1,0,0),s.up.set(0,0,-1),s.lookAt(0,1,0),a.up.set(0,0,1),a.lookAt(0,-1,0),o.up.set(0,1,0),o.lookAt(0,0,1),l.up.set(0,1,0),l.lookAt(0,0,-1);else if(e===as)i.up.set(0,-1,0),i.lookAt(-1,0,0),r.up.set(0,-1,0),r.lookAt(1,0,0),s.up.set(0,0,1),s.lookAt(0,1,0),a.up.set(0,0,-1),a.lookAt(0,-1,0),o.up.set(0,-1,0),o.lookAt(0,0,1),l.up.set(0,-1,0),l.lookAt(0,0,-1);else throw new Error("THREE.CubeCamera.updateCoordinateSystem(): Invalid coordinate system: "+e);for(const c of t)this.add(c),c.updateMatrixWorld()}update(e,t){this.parent===null&&this.updateMatrixWorld();const{renderTarget:i,activeMipmapLevel:r}=this;this.coordinateSystem!==e.coordinateSystem&&(this.coordinateSystem=e.coordinateSystem,this.updateCoordinateSystem());const[s,a,o,l,c,u]=this.children,f=e.getRenderTarget(),d=e.getActiveCubeFace(),m=e.getActiveMipmapLevel(),g=e.xr.enabled;e.xr.enabled=!1;const _=i.texture.generateMipmaps;i.texture.generateMipmaps=!1,e.setRenderTarget(i,0,r),e.render(t,s),e.setRenderTarget(i,1,r),e.render(t,a),e.setRenderTarget(i,2,r),e.render(t,o),e.setRenderTarget(i,3,r),e.render(t,l),e.setRenderTarget(i,4,r),e.render(t,c),i.texture.generateMipmaps=_,e.setRenderTarget(i,5,r),e.render(t,u),e.setRenderTarget(f,d,m),e.xr.enabled=g,i.texture.needsPMREMUpdate=!0}}class nc extends Mt{constructor(e,t,i,r,s,a,o,l,c,u){e=e!==void 0?e:[],t=t!==void 0?t:Ni,super(e,t,i,r,s,a,o,l,c,u),this.isCubeTexture=!0,this.flipY=!1}get images(){return this.image}set images(e){this.image=e}}class th extends Sn{constructor(e=1,t={}){super(e,e,t),this.isWebGLCubeRenderTarget=!0;const i={width:e,height:e,depth:1},r=[i,i,i,i,i,i];this.texture=new nc(r,t.mapping,t.wrapS,t.wrapT,t.magFilter,t.minFilter,t.format,t.type,t.anisotropy,t.colorSpace),this.texture.isRenderTargetTexture=!0,this.texture.generateMipmaps=t.generateMipmaps!==void 0?t.generateMipmaps:!1,this.texture.minFilter=t.minFilter!==void 0?t.minFilter:Bt}fromEquirectangularTexture(e,t){this.texture.type=t.type,this.texture.colorSpace=t.colorSpace,this.texture.generateMipmaps=t.generateMipmaps,this.texture.minFilter=t.minFilter,this.texture.magFilter=t.magFilter;const i={uniforms:{tEquirect:{value:null}},vertexShader:`

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
			`},r=new xr(5,5,5),s=new bt({name:"CubemapFromEquirect",uniforms:zi(i.uniforms),vertexShader:i.vertexShader,fragmentShader:i.fragmentShader,side:wt,blending:On});s.uniforms.tEquirect.value=t;const a=new kt(r,s),o=t.minFilter;return t.minFilter===ii&&(t.minFilter=Bt),new eh(1,10,this).update(e,a),t.minFilter=o,a.geometry.dispose(),a.material.dispose(),this}clear(e,t,i,r){const s=e.getRenderTarget();for(let a=0;a<6;a++)e.setRenderTarget(this,a),e.clear(t,i,r);e.setRenderTarget(s)}}const Ws=new N,nh=new N,ih=new Ne;class jn{constructor(e=new N(1,0,0),t=0){this.isPlane=!0,this.normal=e,this.constant=t}set(e,t){return this.normal.copy(e),this.constant=t,this}setComponents(e,t,i,r){return this.normal.set(e,t,i),this.constant=r,this}setFromNormalAndCoplanarPoint(e,t){return this.normal.copy(e),this.constant=-t.dot(this.normal),this}setFromCoplanarPoints(e,t,i){const r=Ws.subVectors(i,t).cross(nh.subVectors(e,t)).normalize();return this.setFromNormalAndCoplanarPoint(r,e),this}copy(e){return this.normal.copy(e.normal),this.constant=e.constant,this}normalize(){const e=1/this.normal.length();return this.normal.multiplyScalar(e),this.constant*=e,this}negate(){return this.constant*=-1,this.normal.negate(),this}distanceToPoint(e){return this.normal.dot(e)+this.constant}distanceToSphere(e){return this.distanceToPoint(e.center)-e.radius}projectPoint(e,t){return t.copy(e).addScaledVector(this.normal,-this.distanceToPoint(e))}intersectLine(e,t){const i=e.delta(Ws),r=this.normal.dot(i);if(r===0)return this.distanceToPoint(e.start)===0?t.copy(e.start):null;const s=-(e.start.dot(this.normal)+this.constant)/r;return s<0||s>1?null:t.copy(e.start).addScaledVector(i,s)}intersectsLine(e){const t=this.distanceToPoint(e.start),i=this.distanceToPoint(e.end);return t<0&&i>0||i<0&&t>0}intersectsBox(e){return e.intersectsPlane(this)}intersectsSphere(e){return e.intersectsPlane(this)}coplanarPoint(e){return e.copy(this.normal).multiplyScalar(-this.constant)}applyMatrix4(e,t){const i=t||ih.getNormalMatrix(e),r=this.coplanarPoint(Ws).applyMatrix4(e),s=this.normal.applyMatrix3(i).normalize();return this.constant=-r.dot(s),this}translate(e){return this.constant-=e.dot(this.normal),this}equals(e){return e.normal.equals(this.normal)&&e.constant===this.constant}clone(){return new this.constructor().copy(this)}}const Yn=new ms,kr=new N;class ic{constructor(e=new jn,t=new jn,i=new jn,r=new jn,s=new jn,a=new jn){this.planes=[e,t,i,r,s,a]}set(e,t,i,r,s,a){const o=this.planes;return o[0].copy(e),o[1].copy(t),o[2].copy(i),o[3].copy(r),o[4].copy(s),o[5].copy(a),this}copy(e){const t=this.planes;for(let i=0;i<6;i++)t[i].copy(e.planes[i]);return this}setFromProjectionMatrix(e,t=gn){const i=this.planes,r=e.elements,s=r[0],a=r[1],o=r[2],l=r[3],c=r[4],u=r[5],f=r[6],d=r[7],m=r[8],g=r[9],_=r[10],p=r[11],h=r[12],T=r[13],S=r[14],M=r[15];if(i[0].setComponents(l-s,d-c,p-m,M-h).normalize(),i[1].setComponents(l+s,d+c,p+m,M+h).normalize(),i[2].setComponents(l+a,d+u,p+g,M+T).normalize(),i[3].setComponents(l-a,d-u,p-g,M-T).normalize(),i[4].setComponents(l-o,d-f,p-_,M-S).normalize(),t===gn)i[5].setComponents(l+o,d+f,p+_,M+S).normalize();else if(t===as)i[5].setComponents(o,f,_,S).normalize();else throw new Error("THREE.Frustum.setFromProjectionMatrix(): Invalid coordinate system: "+t);return this}intersectsObject(e){if(e.boundingSphere!==void 0)e.boundingSphere===null&&e.computeBoundingSphere(),Yn.copy(e.boundingSphere).applyMatrix4(e.matrixWorld);else{const t=e.geometry;t.boundingSphere===null&&t.computeBoundingSphere(),Yn.copy(t.boundingSphere).applyMatrix4(e.matrixWorld)}return this.intersectsSphere(Yn)}intersectsSprite(e){return Yn.center.set(0,0,0),Yn.radius=.7071067811865476,Yn.applyMatrix4(e.matrixWorld),this.intersectsSphere(Yn)}intersectsSphere(e){const t=this.planes,i=e.center,r=-e.radius;for(let s=0;s<6;s++)if(t[s].distanceToPoint(i)<r)return!1;return!0}intersectsBox(e){const t=this.planes;for(let i=0;i<6;i++){const r=t[i];if(kr.x=r.normal.x>0?e.max.x:e.min.x,kr.y=r.normal.y>0?e.max.y:e.min.y,kr.z=r.normal.z>0?e.max.z:e.min.z,r.distanceToPoint(kr)<0)return!1}return!0}containsPoint(e){const t=this.planes;for(let i=0;i<6;i++)if(t[i].distanceToPoint(e)<0)return!1;return!0}clone(){return new this.constructor().copy(this)}}function rc(){let n=null,e=!1,t=null,i=null;function r(s,a){t(s,a),i=n.requestAnimationFrame(r)}return{start:function(){e!==!0&&t!==null&&(i=n.requestAnimationFrame(r),e=!0)},stop:function(){n.cancelAnimationFrame(i),e=!1},setAnimationLoop:function(s){t=s},setContext:function(s){n=s}}}function rh(n){const e=new WeakMap;function t(o,l){const c=o.array,u=o.usage,f=c.byteLength,d=n.createBuffer();n.bindBuffer(l,d),n.bufferData(l,c,u),o.onUploadCallback();let m;if(c instanceof Float32Array)m=n.FLOAT;else if(c instanceof Uint16Array)o.isFloat16BufferAttribute?m=n.HALF_FLOAT:m=n.UNSIGNED_SHORT;else if(c instanceof Int16Array)m=n.SHORT;else if(c instanceof Uint32Array)m=n.UNSIGNED_INT;else if(c instanceof Int32Array)m=n.INT;else if(c instanceof Int8Array)m=n.BYTE;else if(c instanceof Uint8Array)m=n.UNSIGNED_BYTE;else if(c instanceof Uint8ClampedArray)m=n.UNSIGNED_BYTE;else throw new Error("THREE.WebGLAttributes: Unsupported buffer data format: "+c);return{buffer:d,type:m,bytesPerElement:c.BYTES_PER_ELEMENT,version:o.version,size:f}}function i(o,l,c){const u=l.array,f=l.updateRanges;if(n.bindBuffer(c,o),f.length===0)n.bufferSubData(c,0,u);else{f.sort((m,g)=>m.start-g.start);let d=0;for(let m=1;m<f.length;m++){const g=f[d],_=f[m];_.start<=g.start+g.count+1?g.count=Math.max(g.count,_.start+_.count-g.start):(++d,f[d]=_)}f.length=d+1;for(let m=0,g=f.length;m<g;m++){const _=f[m];n.bufferSubData(c,_.start*u.BYTES_PER_ELEMENT,u,_.start,_.count)}l.clearUpdateRanges()}l.onUploadCallback()}function r(o){return o.isInterleavedBufferAttribute&&(o=o.data),e.get(o)}function s(o){o.isInterleavedBufferAttribute&&(o=o.data);const l=e.get(o);l&&(n.deleteBuffer(l.buffer),e.delete(o))}function a(o,l){if(o.isInterleavedBufferAttribute&&(o=o.data),o.isGLBufferAttribute){const u=e.get(o);(!u||u.version<o.version)&&e.set(o,{buffer:o.buffer,type:o.type,bytesPerElement:o.elementSize,version:o.version});return}const c=e.get(o);if(c===void 0)e.set(o,t(o,l));else if(c.version<o.version){if(c.size!==o.array.byteLength)throw new Error("THREE.WebGLAttributes: The size of the buffer attribute's array buffer does not match the original size. Resizing buffer attributes is not supported.");i(c.buffer,o,l),c.version=o.version}}return{get:r,remove:s,update:a}}class Yi extends Qt{constructor(e=1,t=1,i=1,r=1){super(),this.type="PlaneGeometry",this.parameters={width:e,height:t,widthSegments:i,heightSegments:r};const s=e/2,a=t/2,o=Math.floor(i),l=Math.floor(r),c=o+1,u=l+1,f=e/o,d=t/l,m=[],g=[],_=[],p=[];for(let h=0;h<u;h++){const T=h*d-a;for(let S=0;S<c;S++){const M=S*f-s;g.push(M,-T,0),_.push(0,0,1),p.push(S/o),p.push(1-h/l)}}for(let h=0;h<l;h++)for(let T=0;T<o;T++){const S=T+c*h,M=T+c*(h+1),P=T+1+c*(h+1),b=T+1+c*h;m.push(S,M,b),m.push(M,P,b)}this.setIndex(m),this.setAttribute("position",new si(g,3)),this.setAttribute("normal",new si(_,3)),this.setAttribute("uv",new si(p,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new Yi(e.width,e.height,e.widthSegments,e.heightSegments)}}var sh=`#ifdef USE_ALPHAHASH
	if ( diffuseColor.a < getAlphaHashThreshold( vPosition ) ) discard;
#endif`,ah=`#ifdef USE_ALPHAHASH
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
#endif`,oh=`#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, vAlphaMapUv ).g;
#endif`,lh=`#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,ch=`#ifdef USE_ALPHATEST
	#ifdef ALPHA_TO_COVERAGE
	diffuseColor.a = smoothstep( alphaTest, alphaTest + fwidth( diffuseColor.a ), diffuseColor.a );
	if ( diffuseColor.a == 0.0 ) discard;
	#else
	if ( diffuseColor.a < alphaTest ) discard;
	#endif
#endif`,uh=`#ifdef USE_ALPHATEST
	uniform float alphaTest;
#endif`,hh=`#ifdef USE_AOMAP
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
#endif`,fh=`#ifdef USE_AOMAP
	uniform sampler2D aoMap;
	uniform float aoMapIntensity;
#endif`,dh=`#ifdef USE_BATCHING
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
#endif`,ph=`#ifdef USE_BATCHING
	mat4 batchingMatrix = getBatchingMatrix( getIndirectIndex( gl_DrawID ) );
#endif`,mh=`vec3 transformed = vec3( position );
#ifdef USE_ALPHAHASH
	vPosition = vec3( position );
#endif`,gh=`vec3 objectNormal = vec3( normal );
#ifdef USE_TANGENT
	vec3 objectTangent = vec3( tangent.xyz );
#endif`,_h=`float G_BlinnPhong_Implicit( ) {
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
} // validated`,vh=`#ifdef USE_IRIDESCENCE
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
#endif`,xh=`#ifdef USE_BUMPMAP
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
#endif`,Mh=`#if NUM_CLIPPING_PLANES > 0
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
#endif`,Sh=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
	uniform vec4 clippingPlanes[ NUM_CLIPPING_PLANES ];
#endif`,yh=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
#endif`,Eh=`#if NUM_CLIPPING_PLANES > 0
	vClipPosition = - mvPosition.xyz;
#endif`,Th=`#if defined( USE_COLOR_ALPHA )
	diffuseColor *= vColor;
#elif defined( USE_COLOR )
	diffuseColor.rgb *= vColor;
#endif`,Ah=`#if defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#elif defined( USE_COLOR )
	varying vec3 vColor;
#endif`,bh=`#if defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#elif defined( USE_COLOR ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
	varying vec3 vColor;
#endif`,wh=`#if defined( USE_COLOR_ALPHA )
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
#endif`,Rh=`#define PI 3.141592653589793
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
} // validated`,Ch=`#ifdef ENVMAP_TYPE_CUBE_UV
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
#endif`,Ph=`vec3 transformedNormal = objectNormal;
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
#endif`,Dh=`#ifdef USE_DISPLACEMENTMAP
	uniform sampler2D displacementMap;
	uniform float displacementScale;
	uniform float displacementBias;
#endif`,Lh=`#ifdef USE_DISPLACEMENTMAP
	transformed += normalize( objectNormal ) * ( texture2D( displacementMap, vDisplacementMapUv ).x * displacementScale + displacementBias );
#endif`,Ih=`#ifdef USE_EMISSIVEMAP
	vec4 emissiveColor = texture2D( emissiveMap, vEmissiveMapUv );
	#ifdef DECODE_VIDEO_TEXTURE_EMISSIVE
		emissiveColor = sRGBTransferEOTF( emissiveColor );
	#endif
	totalEmissiveRadiance *= emissiveColor.rgb;
#endif`,Uh=`#ifdef USE_EMISSIVEMAP
	uniform sampler2D emissiveMap;
#endif`,Nh="gl_FragColor = linearToOutputTexel( gl_FragColor );",Fh=`vec4 LinearTransferOETF( in vec4 value ) {
	return value;
}
vec4 sRGBTransferEOTF( in vec4 value ) {
	return vec4( mix( pow( value.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), value.rgb * 0.0773993808, vec3( lessThanEqual( value.rgb, vec3( 0.04045 ) ) ) ), value.a );
}
vec4 sRGBTransferOETF( in vec4 value ) {
	return vec4( mix( pow( value.rgb, vec3( 0.41666 ) ) * 1.055 - vec3( 0.055 ), value.rgb * 12.92, vec3( lessThanEqual( value.rgb, vec3( 0.0031308 ) ) ) ), value.a );
}`,Oh=`#ifdef USE_ENVMAP
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
#endif`,Bh=`#ifdef USE_ENVMAP
	uniform float envMapIntensity;
	uniform float flipEnvMap;
	uniform mat3 envMapRotation;
	#ifdef ENVMAP_TYPE_CUBE
		uniform samplerCube envMap;
	#else
		uniform sampler2D envMap;
	#endif
	
#endif`,zh=`#ifdef USE_ENVMAP
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
#endif`,kh=`#ifdef USE_ENVMAP
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		
		varying vec3 vWorldPosition;
	#else
		varying vec3 vReflect;
		uniform float refractionRatio;
	#endif
#endif`,Gh=`#ifdef USE_ENVMAP
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
#endif`,Hh=`#ifdef USE_FOG
	vFogDepth = - mvPosition.z;
#endif`,Vh=`#ifdef USE_FOG
	varying float vFogDepth;
#endif`,Wh=`#ifdef USE_FOG
	#ifdef FOG_EXP2
		float fogFactor = 1.0 - exp( - fogDensity * fogDensity * vFogDepth * vFogDepth );
	#else
		float fogFactor = smoothstep( fogNear, fogFar, vFogDepth );
	#endif
	gl_FragColor.rgb = mix( gl_FragColor.rgb, fogColor, fogFactor );
#endif`,Xh=`#ifdef USE_FOG
	uniform vec3 fogColor;
	varying float vFogDepth;
	#ifdef FOG_EXP2
		uniform float fogDensity;
	#else
		uniform float fogNear;
		uniform float fogFar;
	#endif
#endif`,qh=`#ifdef USE_GRADIENTMAP
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
}`,Yh=`#ifdef USE_LIGHTMAP
	uniform sampler2D lightMap;
	uniform float lightMapIntensity;
#endif`,Kh=`LambertMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularStrength = specularStrength;`,$h=`varying vec3 vViewPosition;
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
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Lambert`,Zh=`uniform bool receiveShadow;
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
#endif`,jh=`#ifdef USE_ENVMAP
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
#endif`,Jh=`ToonMaterial material;
material.diffuseColor = diffuseColor.rgb;`,Qh=`varying vec3 vViewPosition;
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
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Toon`,ef=`BlinnPhongMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularColor = specular;
material.specularShininess = shininess;
material.specularStrength = specularStrength;`,tf=`varying vec3 vViewPosition;
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
#define RE_IndirectDiffuse		RE_IndirectDiffuse_BlinnPhong`,nf=`PhysicalMaterial material;
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
#endif`,rf=`struct PhysicalMaterial {
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
}`,sf=`
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
#endif`,af=`#if defined( RE_IndirectDiffuse )
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
#endif`,of=`#if defined( RE_IndirectDiffuse )
	RE_IndirectDiffuse( irradiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif
#if defined( RE_IndirectSpecular )
	RE_IndirectSpecular( radiance, iblIrradiance, clearcoatRadiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif`,lf=`#if defined( USE_LOGDEPTHBUF )
	gl_FragDepth = vIsPerspective == 0.0 ? gl_FragCoord.z : log2( vFragDepth ) * logDepthBufFC * 0.5;
#endif`,cf=`#if defined( USE_LOGDEPTHBUF )
	uniform float logDepthBufFC;
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,uf=`#ifdef USE_LOGDEPTHBUF
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,hf=`#ifdef USE_LOGDEPTHBUF
	vFragDepth = 1.0 + gl_Position.w;
	vIsPerspective = float( isPerspectiveMatrix( projectionMatrix ) );
#endif`,ff=`#ifdef USE_MAP
	vec4 sampledDiffuseColor = texture2D( map, vMapUv );
	#ifdef DECODE_VIDEO_TEXTURE
		sampledDiffuseColor = sRGBTransferEOTF( sampledDiffuseColor );
	#endif
	diffuseColor *= sampledDiffuseColor;
#endif`,df=`#ifdef USE_MAP
	uniform sampler2D map;
#endif`,pf=`#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
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
#endif`,mf=`#if defined( USE_POINTS_UV )
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
#endif`,gf=`float metalnessFactor = metalness;
#ifdef USE_METALNESSMAP
	vec4 texelMetalness = texture2D( metalnessMap, vMetalnessMapUv );
	metalnessFactor *= texelMetalness.b;
#endif`,_f=`#ifdef USE_METALNESSMAP
	uniform sampler2D metalnessMap;
#endif`,vf=`#ifdef USE_INSTANCING_MORPH
	float morphTargetInfluences[ MORPHTARGETS_COUNT ];
	float morphTargetBaseInfluence = texelFetch( morphTexture, ivec2( 0, gl_InstanceID ), 0 ).r;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		morphTargetInfluences[i] =  texelFetch( morphTexture, ivec2( i + 1, gl_InstanceID ), 0 ).r;
	}
#endif`,xf=`#if defined( USE_MORPHCOLORS )
	vColor *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		#if defined( USE_COLOR_ALPHA )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ) * morphTargetInfluences[ i ];
		#elif defined( USE_COLOR )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ).rgb * morphTargetInfluences[ i ];
		#endif
	}
#endif`,Mf=`#ifdef USE_MORPHNORMALS
	objectNormal *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) objectNormal += getMorph( gl_VertexID, i, 1 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,Sf=`#ifdef USE_MORPHTARGETS
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
#endif`,yf=`#ifdef USE_MORPHTARGETS
	transformed *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) transformed += getMorph( gl_VertexID, i, 0 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,Ef=`float faceDirection = gl_FrontFacing ? 1.0 : - 1.0;
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
vec3 nonPerturbedNormal = normal;`,Tf=`#ifdef USE_NORMALMAP_OBJECTSPACE
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
#endif`,Af=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,bf=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,wf=`#ifndef FLAT_SHADED
	vNormal = normalize( transformedNormal );
	#ifdef USE_TANGENT
		vTangent = normalize( transformedTangent );
		vBitangent = normalize( cross( vNormal, vTangent ) * tangent.w );
	#endif
#endif`,Rf=`#ifdef USE_NORMALMAP
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
#endif`,Cf=`#ifdef USE_CLEARCOAT
	vec3 clearcoatNormal = nonPerturbedNormal;
#endif`,Pf=`#ifdef USE_CLEARCOAT_NORMALMAP
	vec3 clearcoatMapN = texture2D( clearcoatNormalMap, vClearcoatNormalMapUv ).xyz * 2.0 - 1.0;
	clearcoatMapN.xy *= clearcoatNormalScale;
	clearcoatNormal = normalize( tbn2 * clearcoatMapN );
#endif`,Df=`#ifdef USE_CLEARCOATMAP
	uniform sampler2D clearcoatMap;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform sampler2D clearcoatNormalMap;
	uniform vec2 clearcoatNormalScale;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform sampler2D clearcoatRoughnessMap;
#endif`,Lf=`#ifdef USE_IRIDESCENCEMAP
	uniform sampler2D iridescenceMap;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform sampler2D iridescenceThicknessMap;
#endif`,If=`#ifdef OPAQUE
diffuseColor.a = 1.0;
#endif
#ifdef USE_TRANSMISSION
diffuseColor.a *= material.transmissionAlpha;
#endif
gl_FragColor = vec4( outgoingLight, diffuseColor.a );`,Uf=`vec3 packNormalToRGB( const in vec3 normal ) {
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
}`,Nf=`#ifdef PREMULTIPLIED_ALPHA
	gl_FragColor.rgb *= gl_FragColor.a;
#endif`,Ff=`vec4 mvPosition = vec4( transformed, 1.0 );
#ifdef USE_BATCHING
	mvPosition = batchingMatrix * mvPosition;
#endif
#ifdef USE_INSTANCING
	mvPosition = instanceMatrix * mvPosition;
#endif
mvPosition = modelViewMatrix * mvPosition;
gl_Position = projectionMatrix * mvPosition;`,Of=`#ifdef DITHERING
	gl_FragColor.rgb = dithering( gl_FragColor.rgb );
#endif`,Bf=`#ifdef DITHERING
	vec3 dithering( vec3 color ) {
		float grid_position = rand( gl_FragCoord.xy );
		vec3 dither_shift_RGB = vec3( 0.25 / 255.0, -0.25 / 255.0, 0.25 / 255.0 );
		dither_shift_RGB = mix( 2.0 * dither_shift_RGB, -2.0 * dither_shift_RGB, grid_position );
		return color + dither_shift_RGB;
	}
#endif`,zf=`float roughnessFactor = roughness;
#ifdef USE_ROUGHNESSMAP
	vec4 texelRoughness = texture2D( roughnessMap, vRoughnessMapUv );
	roughnessFactor *= texelRoughness.g;
#endif`,kf=`#ifdef USE_ROUGHNESSMAP
	uniform sampler2D roughnessMap;
#endif`,Gf=`#if NUM_SPOT_LIGHT_COORDS > 0
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
#endif`,Hf=`#if NUM_SPOT_LIGHT_COORDS > 0
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
#endif`,Vf=`#if ( defined( USE_SHADOWMAP ) && ( NUM_DIR_LIGHT_SHADOWS > 0 || NUM_POINT_LIGHT_SHADOWS > 0 ) ) || ( NUM_SPOT_LIGHT_COORDS > 0 )
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
#endif`,Wf=`float getShadowMask() {
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
}`,Xf=`#ifdef USE_SKINNING
	mat4 boneMatX = getBoneMatrix( skinIndex.x );
	mat4 boneMatY = getBoneMatrix( skinIndex.y );
	mat4 boneMatZ = getBoneMatrix( skinIndex.z );
	mat4 boneMatW = getBoneMatrix( skinIndex.w );
#endif`,qf=`#ifdef USE_SKINNING
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
#endif`,Yf=`#ifdef USE_SKINNING
	vec4 skinVertex = bindMatrix * vec4( transformed, 1.0 );
	vec4 skinned = vec4( 0.0 );
	skinned += boneMatX * skinVertex * skinWeight.x;
	skinned += boneMatY * skinVertex * skinWeight.y;
	skinned += boneMatZ * skinVertex * skinWeight.z;
	skinned += boneMatW * skinVertex * skinWeight.w;
	transformed = ( bindMatrixInverse * skinned ).xyz;
#endif`,Kf=`#ifdef USE_SKINNING
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
#endif`,$f=`float specularStrength;
#ifdef USE_SPECULARMAP
	vec4 texelSpecular = texture2D( specularMap, vSpecularMapUv );
	specularStrength = texelSpecular.r;
#else
	specularStrength = 1.0;
#endif`,Zf=`#ifdef USE_SPECULARMAP
	uniform sampler2D specularMap;
#endif`,jf=`#if defined( TONE_MAPPING )
	gl_FragColor.rgb = toneMapping( gl_FragColor.rgb );
#endif`,Jf=`#ifndef saturate
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
vec3 CustomToneMapping( vec3 color ) { return color; }`,Qf=`#ifdef USE_TRANSMISSION
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
#endif`,ed=`#ifdef USE_TRANSMISSION
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
#endif`,td=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
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
#endif`,nd=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
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
#endif`,id=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
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
#endif`,rd=`#if defined( USE_ENVMAP ) || defined( DISTANCE ) || defined ( USE_SHADOWMAP ) || defined ( USE_TRANSMISSION ) || NUM_SPOT_LIGHT_COORDS > 0
	vec4 worldPosition = vec4( transformed, 1.0 );
	#ifdef USE_BATCHING
		worldPosition = batchingMatrix * worldPosition;
	#endif
	#ifdef USE_INSTANCING
		worldPosition = instanceMatrix * worldPosition;
	#endif
	worldPosition = modelMatrix * worldPosition;
#endif`;const sd=`varying vec2 vUv;
uniform mat3 uvTransform;
void main() {
	vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	gl_Position = vec4( position.xy, 1.0, 1.0 );
}`,ad=`uniform sampler2D t2D;
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
}`,od=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,ld=`#ifdef ENVMAP_TYPE_CUBE
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
}`,cd=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,ud=`uniform samplerCube tCube;
uniform float tFlip;
uniform float opacity;
varying vec3 vWorldDirection;
void main() {
	vec4 texColor = textureCube( tCube, vec3( tFlip * vWorldDirection.x, vWorldDirection.yz ) );
	gl_FragColor = texColor;
	gl_FragColor.a *= opacity;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,hd=`#include <common>
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
}`,fd=`#if DEPTH_PACKING == 3200
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
}`,dd=`#define DISTANCE
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
}`,pd=`#define DISTANCE
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
}`,md=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
}`,gd=`uniform sampler2D tEquirect;
varying vec3 vWorldDirection;
#include <common>
void main() {
	vec3 direction = normalize( vWorldDirection );
	vec2 sampleUV = equirectUv( direction );
	gl_FragColor = texture2D( tEquirect, sampleUV );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,_d=`uniform float scale;
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
}`,vd=`uniform vec3 diffuse;
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
}`,xd=`#include <common>
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
}`,Md=`uniform vec3 diffuse;
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
}`,Sd=`#define LAMBERT
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
}`,yd=`#define LAMBERT
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
}`,Ed=`#define MATCAP
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
}`,Td=`#define MATCAP
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
}`,Ad=`#define NORMAL
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
}`,bd=`#define NORMAL
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
}`,wd=`#define PHONG
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
}`,Rd=`#define PHONG
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
}`,Cd=`#define STANDARD
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
}`,Pd=`#define STANDARD
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
}`,Dd=`#define TOON
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
}`,Ld=`#define TOON
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
}`,Id=`uniform float size;
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
}`,Ud=`uniform vec3 diffuse;
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
}`,Nd=`#include <common>
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
}`,Fd=`uniform vec3 color;
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
}`,Od=`uniform float rotation;
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
}`,Bd=`uniform vec3 diffuse;
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
}`,ze={alphahash_fragment:sh,alphahash_pars_fragment:ah,alphamap_fragment:oh,alphamap_pars_fragment:lh,alphatest_fragment:ch,alphatest_pars_fragment:uh,aomap_fragment:hh,aomap_pars_fragment:fh,batching_pars_vertex:dh,batching_vertex:ph,begin_vertex:mh,beginnormal_vertex:gh,bsdfs:_h,iridescence_fragment:vh,bumpmap_pars_fragment:xh,clipping_planes_fragment:Mh,clipping_planes_pars_fragment:Sh,clipping_planes_pars_vertex:yh,clipping_planes_vertex:Eh,color_fragment:Th,color_pars_fragment:Ah,color_pars_vertex:bh,color_vertex:wh,common:Rh,cube_uv_reflection_fragment:Ch,defaultnormal_vertex:Ph,displacementmap_pars_vertex:Dh,displacementmap_vertex:Lh,emissivemap_fragment:Ih,emissivemap_pars_fragment:Uh,colorspace_fragment:Nh,colorspace_pars_fragment:Fh,envmap_fragment:Oh,envmap_common_pars_fragment:Bh,envmap_pars_fragment:zh,envmap_pars_vertex:kh,envmap_physical_pars_fragment:jh,envmap_vertex:Gh,fog_vertex:Hh,fog_pars_vertex:Vh,fog_fragment:Wh,fog_pars_fragment:Xh,gradientmap_pars_fragment:qh,lightmap_pars_fragment:Yh,lights_lambert_fragment:Kh,lights_lambert_pars_fragment:$h,lights_pars_begin:Zh,lights_toon_fragment:Jh,lights_toon_pars_fragment:Qh,lights_phong_fragment:ef,lights_phong_pars_fragment:tf,lights_physical_fragment:nf,lights_physical_pars_fragment:rf,lights_fragment_begin:sf,lights_fragment_maps:af,lights_fragment_end:of,logdepthbuf_fragment:lf,logdepthbuf_pars_fragment:cf,logdepthbuf_pars_vertex:uf,logdepthbuf_vertex:hf,map_fragment:ff,map_pars_fragment:df,map_particle_fragment:pf,map_particle_pars_fragment:mf,metalnessmap_fragment:gf,metalnessmap_pars_fragment:_f,morphinstance_vertex:vf,morphcolor_vertex:xf,morphnormal_vertex:Mf,morphtarget_pars_vertex:Sf,morphtarget_vertex:yf,normal_fragment_begin:Ef,normal_fragment_maps:Tf,normal_pars_fragment:Af,normal_pars_vertex:bf,normal_vertex:wf,normalmap_pars_fragment:Rf,clearcoat_normal_fragment_begin:Cf,clearcoat_normal_fragment_maps:Pf,clearcoat_pars_fragment:Df,iridescence_pars_fragment:Lf,opaque_fragment:If,packing:Uf,premultiplied_alpha_fragment:Nf,project_vertex:Ff,dithering_fragment:Of,dithering_pars_fragment:Bf,roughnessmap_fragment:zf,roughnessmap_pars_fragment:kf,shadowmap_pars_fragment:Gf,shadowmap_pars_vertex:Hf,shadowmap_vertex:Vf,shadowmask_pars_fragment:Wf,skinbase_vertex:Xf,skinning_pars_vertex:qf,skinning_vertex:Yf,skinnormal_vertex:Kf,specularmap_fragment:$f,specularmap_pars_fragment:Zf,tonemapping_fragment:jf,tonemapping_pars_fragment:Jf,transmission_fragment:Qf,transmission_pars_fragment:ed,uv_pars_fragment:td,uv_pars_vertex:nd,uv_vertex:id,worldpos_vertex:rd,background_vert:sd,background_frag:ad,backgroundCube_vert:od,backgroundCube_frag:ld,cube_vert:cd,cube_frag:ud,depth_vert:hd,depth_frag:fd,distanceRGBA_vert:dd,distanceRGBA_frag:pd,equirect_vert:md,equirect_frag:gd,linedashed_vert:_d,linedashed_frag:vd,meshbasic_vert:xd,meshbasic_frag:Md,meshlambert_vert:Sd,meshlambert_frag:yd,meshmatcap_vert:Ed,meshmatcap_frag:Td,meshnormal_vert:Ad,meshnormal_frag:bd,meshphong_vert:wd,meshphong_frag:Rd,meshphysical_vert:Cd,meshphysical_frag:Pd,meshtoon_vert:Dd,meshtoon_frag:Ld,points_vert:Id,points_frag:Ud,shadow_vert:Nd,shadow_frag:Fd,sprite_vert:Od,sprite_frag:Bd},oe={common:{diffuse:{value:new Je(16777215)},opacity:{value:1},map:{value:null},mapTransform:{value:new Ne},alphaMap:{value:null},alphaMapTransform:{value:new Ne},alphaTest:{value:0}},specularmap:{specularMap:{value:null},specularMapTransform:{value:new Ne}},envmap:{envMap:{value:null},envMapRotation:{value:new Ne},flipEnvMap:{value:-1},reflectivity:{value:1},ior:{value:1.5},refractionRatio:{value:.98}},aomap:{aoMap:{value:null},aoMapIntensity:{value:1},aoMapTransform:{value:new Ne}},lightmap:{lightMap:{value:null},lightMapIntensity:{value:1},lightMapTransform:{value:new Ne}},bumpmap:{bumpMap:{value:null},bumpMapTransform:{value:new Ne},bumpScale:{value:1}},normalmap:{normalMap:{value:null},normalMapTransform:{value:new Ne},normalScale:{value:new Ge(1,1)}},displacementmap:{displacementMap:{value:null},displacementMapTransform:{value:new Ne},displacementScale:{value:1},displacementBias:{value:0}},emissivemap:{emissiveMap:{value:null},emissiveMapTransform:{value:new Ne}},metalnessmap:{metalnessMap:{value:null},metalnessMapTransform:{value:new Ne}},roughnessmap:{roughnessMap:{value:null},roughnessMapTransform:{value:new Ne}},gradientmap:{gradientMap:{value:null}},fog:{fogDensity:{value:25e-5},fogNear:{value:1},fogFar:{value:2e3},fogColor:{value:new Je(16777215)}},lights:{ambientLightColor:{value:[]},lightProbe:{value:[]},directionalLights:{value:[],properties:{direction:{},color:{}}},directionalLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},directionalShadowMap:{value:[]},directionalShadowMatrix:{value:[]},spotLights:{value:[],properties:{color:{},position:{},direction:{},distance:{},coneCos:{},penumbraCos:{},decay:{}}},spotLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},spotLightMap:{value:[]},spotShadowMap:{value:[]},spotLightMatrix:{value:[]},pointLights:{value:[],properties:{color:{},position:{},decay:{},distance:{}}},pointLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{},shadowCameraNear:{},shadowCameraFar:{}}},pointShadowMap:{value:[]},pointShadowMatrix:{value:[]},hemisphereLights:{value:[],properties:{direction:{},skyColor:{},groundColor:{}}},rectAreaLights:{value:[],properties:{color:{},position:{},width:{},height:{}}},ltc_1:{value:null},ltc_2:{value:null}},points:{diffuse:{value:new Je(16777215)},opacity:{value:1},size:{value:1},scale:{value:1},map:{value:null},alphaMap:{value:null},alphaMapTransform:{value:new Ne},alphaTest:{value:0},uvTransform:{value:new Ne}},sprite:{diffuse:{value:new Je(16777215)},opacity:{value:1},center:{value:new Ge(.5,.5)},rotation:{value:0},map:{value:null},mapTransform:{value:new Ne},alphaMap:{value:null},alphaMapTransform:{value:new Ne},alphaTest:{value:0}}},nn={basic:{uniforms:St([oe.common,oe.specularmap,oe.envmap,oe.aomap,oe.lightmap,oe.fog]),vertexShader:ze.meshbasic_vert,fragmentShader:ze.meshbasic_frag},lambert:{uniforms:St([oe.common,oe.specularmap,oe.envmap,oe.aomap,oe.lightmap,oe.emissivemap,oe.bumpmap,oe.normalmap,oe.displacementmap,oe.fog,oe.lights,{emissive:{value:new Je(0)}}]),vertexShader:ze.meshlambert_vert,fragmentShader:ze.meshlambert_frag},phong:{uniforms:St([oe.common,oe.specularmap,oe.envmap,oe.aomap,oe.lightmap,oe.emissivemap,oe.bumpmap,oe.normalmap,oe.displacementmap,oe.fog,oe.lights,{emissive:{value:new Je(0)},specular:{value:new Je(1118481)},shininess:{value:30}}]),vertexShader:ze.meshphong_vert,fragmentShader:ze.meshphong_frag},standard:{uniforms:St([oe.common,oe.envmap,oe.aomap,oe.lightmap,oe.emissivemap,oe.bumpmap,oe.normalmap,oe.displacementmap,oe.roughnessmap,oe.metalnessmap,oe.fog,oe.lights,{emissive:{value:new Je(0)},roughness:{value:1},metalness:{value:0},envMapIntensity:{value:1}}]),vertexShader:ze.meshphysical_vert,fragmentShader:ze.meshphysical_frag},toon:{uniforms:St([oe.common,oe.aomap,oe.lightmap,oe.emissivemap,oe.bumpmap,oe.normalmap,oe.displacementmap,oe.gradientmap,oe.fog,oe.lights,{emissive:{value:new Je(0)}}]),vertexShader:ze.meshtoon_vert,fragmentShader:ze.meshtoon_frag},matcap:{uniforms:St([oe.common,oe.bumpmap,oe.normalmap,oe.displacementmap,oe.fog,{matcap:{value:null}}]),vertexShader:ze.meshmatcap_vert,fragmentShader:ze.meshmatcap_frag},points:{uniforms:St([oe.points,oe.fog]),vertexShader:ze.points_vert,fragmentShader:ze.points_frag},dashed:{uniforms:St([oe.common,oe.fog,{scale:{value:1},dashSize:{value:1},totalSize:{value:2}}]),vertexShader:ze.linedashed_vert,fragmentShader:ze.linedashed_frag},depth:{uniforms:St([oe.common,oe.displacementmap]),vertexShader:ze.depth_vert,fragmentShader:ze.depth_frag},normal:{uniforms:St([oe.common,oe.bumpmap,oe.normalmap,oe.displacementmap,{opacity:{value:1}}]),vertexShader:ze.meshnormal_vert,fragmentShader:ze.meshnormal_frag},sprite:{uniforms:St([oe.sprite,oe.fog]),vertexShader:ze.sprite_vert,fragmentShader:ze.sprite_frag},background:{uniforms:{uvTransform:{value:new Ne},t2D:{value:null},backgroundIntensity:{value:1}},vertexShader:ze.background_vert,fragmentShader:ze.background_frag},backgroundCube:{uniforms:{envMap:{value:null},flipEnvMap:{value:-1},backgroundBlurriness:{value:0},backgroundIntensity:{value:1},backgroundRotation:{value:new Ne}},vertexShader:ze.backgroundCube_vert,fragmentShader:ze.backgroundCube_frag},cube:{uniforms:{tCube:{value:null},tFlip:{value:-1},opacity:{value:1}},vertexShader:ze.cube_vert,fragmentShader:ze.cube_frag},equirect:{uniforms:{tEquirect:{value:null}},vertexShader:ze.equirect_vert,fragmentShader:ze.equirect_frag},distanceRGBA:{uniforms:St([oe.common,oe.displacementmap,{referencePosition:{value:new N},nearDistance:{value:1},farDistance:{value:1e3}}]),vertexShader:ze.distanceRGBA_vert,fragmentShader:ze.distanceRGBA_frag},shadow:{uniforms:St([oe.lights,oe.fog,{color:{value:new Je(0)},opacity:{value:1}}]),vertexShader:ze.shadow_vert,fragmentShader:ze.shadow_frag}};nn.physical={uniforms:St([nn.standard.uniforms,{clearcoat:{value:0},clearcoatMap:{value:null},clearcoatMapTransform:{value:new Ne},clearcoatNormalMap:{value:null},clearcoatNormalMapTransform:{value:new Ne},clearcoatNormalScale:{value:new Ge(1,1)},clearcoatRoughness:{value:0},clearcoatRoughnessMap:{value:null},clearcoatRoughnessMapTransform:{value:new Ne},dispersion:{value:0},iridescence:{value:0},iridescenceMap:{value:null},iridescenceMapTransform:{value:new Ne},iridescenceIOR:{value:1.3},iridescenceThicknessMinimum:{value:100},iridescenceThicknessMaximum:{value:400},iridescenceThicknessMap:{value:null},iridescenceThicknessMapTransform:{value:new Ne},sheen:{value:0},sheenColor:{value:new Je(0)},sheenColorMap:{value:null},sheenColorMapTransform:{value:new Ne},sheenRoughness:{value:1},sheenRoughnessMap:{value:null},sheenRoughnessMapTransform:{value:new Ne},transmission:{value:0},transmissionMap:{value:null},transmissionMapTransform:{value:new Ne},transmissionSamplerSize:{value:new Ge},transmissionSamplerMap:{value:null},thickness:{value:0},thicknessMap:{value:null},thicknessMapTransform:{value:new Ne},attenuationDistance:{value:0},attenuationColor:{value:new Je(0)},specularColor:{value:new Je(1,1,1)},specularColorMap:{value:null},specularColorMapTransform:{value:new Ne},specularIntensity:{value:1},specularIntensityMap:{value:null},specularIntensityMapTransform:{value:new Ne},anisotropyVector:{value:new Ge},anisotropyMap:{value:null},anisotropyMapTransform:{value:new Ne}}]),vertexShader:ze.meshphysical_vert,fragmentShader:ze.meshphysical_frag};const Gr={r:0,b:0,g:0},Kn=new yn,zd=new st;function kd(n,e,t,i,r,s,a){const o=new Je(0);let l=s===!0?0:1,c,u,f=null,d=0,m=null;function g(T){let S=T.isScene===!0?T.background:null;return S&&S.isTexture&&(S=(T.backgroundBlurriness>0?t:e).get(S)),S}function _(T){let S=!1;const M=g(T);M===null?h(o,l):M&&M.isColor&&(h(M,1),S=!0);const P=n.xr.getEnvironmentBlendMode();P==="additive"?i.buffers.color.setClear(0,0,0,1,a):P==="alpha-blend"&&i.buffers.color.setClear(0,0,0,0,a),(n.autoClear||S)&&(i.buffers.depth.setTest(!0),i.buffers.depth.setMask(!0),i.buffers.color.setMask(!0),n.clear(n.autoClearColor,n.autoClearDepth,n.autoClearStencil))}function p(T,S){const M=g(S);M&&(M.isCubeTexture||M.mapping===ds)?(u===void 0&&(u=new kt(new xr(1,1,1),new bt({name:"BackgroundCubeMaterial",uniforms:zi(nn.backgroundCube.uniforms),vertexShader:nn.backgroundCube.vertexShader,fragmentShader:nn.backgroundCube.fragmentShader,side:wt,depthTest:!1,depthWrite:!1,fog:!1})),u.geometry.deleteAttribute("normal"),u.geometry.deleteAttribute("uv"),u.onBeforeRender=function(P,b,R){this.matrixWorld.copyPosition(R.matrixWorld)},Object.defineProperty(u.material,"envMap",{get:function(){return this.uniforms.envMap.value}}),r.update(u)),Kn.copy(S.backgroundRotation),Kn.x*=-1,Kn.y*=-1,Kn.z*=-1,M.isCubeTexture&&M.isRenderTargetTexture===!1&&(Kn.y*=-1,Kn.z*=-1),u.material.uniforms.envMap.value=M,u.material.uniforms.flipEnvMap.value=M.isCubeTexture&&M.isRenderTargetTexture===!1?-1:1,u.material.uniforms.backgroundBlurriness.value=S.backgroundBlurriness,u.material.uniforms.backgroundIntensity.value=S.backgroundIntensity,u.material.uniforms.backgroundRotation.value.setFromMatrix4(zd.makeRotationFromEuler(Kn)),u.material.toneMapped=Xe.getTransfer(M.colorSpace)!==Qe,(f!==M||d!==M.version||m!==n.toneMapping)&&(u.material.needsUpdate=!0,f=M,d=M.version,m=n.toneMapping),u.layers.enableAll(),T.unshift(u,u.geometry,u.material,0,0,null)):M&&M.isTexture&&(c===void 0&&(c=new kt(new Yi(2,2),new bt({name:"BackgroundMaterial",uniforms:zi(nn.background.uniforms),vertexShader:nn.background.vertexShader,fragmentShader:nn.background.fragmentShader,side:kn,depthTest:!1,depthWrite:!1,fog:!1})),c.geometry.deleteAttribute("normal"),Object.defineProperty(c.material,"map",{get:function(){return this.uniforms.t2D.value}}),r.update(c)),c.material.uniforms.t2D.value=M,c.material.uniforms.backgroundIntensity.value=S.backgroundIntensity,c.material.toneMapped=Xe.getTransfer(M.colorSpace)!==Qe,M.matrixAutoUpdate===!0&&M.updateMatrix(),c.material.uniforms.uvTransform.value.copy(M.matrix),(f!==M||d!==M.version||m!==n.toneMapping)&&(c.material.needsUpdate=!0,f=M,d=M.version,m=n.toneMapping),c.layers.enableAll(),T.unshift(c,c.geometry,c.material,0,0,null))}function h(T,S){T.getRGB(Gr,ec(n)),i.buffers.color.setClear(Gr.r,Gr.g,Gr.b,S,a)}return{getClearColor:function(){return o},setClearColor:function(T,S=1){o.set(T),l=S,h(o,l)},getClearAlpha:function(){return l},setClearAlpha:function(T){l=T,h(o,l)},render:_,addToRenderList:p}}function Gd(n,e){const t=n.getParameter(n.MAX_VERTEX_ATTRIBS),i={},r=d(null);let s=r,a=!1;function o(x,w,k,O,X){let Z=!1;const G=f(O,k,w);s!==G&&(s=G,c(s.object)),Z=m(x,O,k,X),Z&&g(x,O,k,X),X!==null&&e.update(X,n.ELEMENT_ARRAY_BUFFER),(Z||a)&&(a=!1,M(x,w,k,O),X!==null&&n.bindBuffer(n.ELEMENT_ARRAY_BUFFER,e.get(X).buffer))}function l(){return n.createVertexArray()}function c(x){return n.bindVertexArray(x)}function u(x){return n.deleteVertexArray(x)}function f(x,w,k){const O=k.wireframe===!0;let X=i[x.id];X===void 0&&(X={},i[x.id]=X);let Z=X[w.id];Z===void 0&&(Z={},X[w.id]=Z);let G=Z[O];return G===void 0&&(G=d(l()),Z[O]=G),G}function d(x){const w=[],k=[],O=[];for(let X=0;X<t;X++)w[X]=0,k[X]=0,O[X]=0;return{geometry:null,program:null,wireframe:!1,newAttributes:w,enabledAttributes:k,attributeDivisors:O,object:x,attributes:{},index:null}}function m(x,w,k,O){const X=s.attributes,Z=w.attributes;let G=0;const $=k.getAttributes();for(const V in $)if($[V].location>=0){const Q=X[V];let se=Z[V];if(se===void 0&&(V==="instanceMatrix"&&x.instanceMatrix&&(se=x.instanceMatrix),V==="instanceColor"&&x.instanceColor&&(se=x.instanceColor)),Q===void 0||Q.attribute!==se||se&&Q.data!==se.data)return!0;G++}return s.attributesNum!==G||s.index!==O}function g(x,w,k,O){const X={},Z=w.attributes;let G=0;const $=k.getAttributes();for(const V in $)if($[V].location>=0){let Q=Z[V];Q===void 0&&(V==="instanceMatrix"&&x.instanceMatrix&&(Q=x.instanceMatrix),V==="instanceColor"&&x.instanceColor&&(Q=x.instanceColor));const se={};se.attribute=Q,Q&&Q.data&&(se.data=Q.data),X[V]=se,G++}s.attributes=X,s.attributesNum=G,s.index=O}function _(){const x=s.newAttributes;for(let w=0,k=x.length;w<k;w++)x[w]=0}function p(x){h(x,0)}function h(x,w){const k=s.newAttributes,O=s.enabledAttributes,X=s.attributeDivisors;k[x]=1,O[x]===0&&(n.enableVertexAttribArray(x),O[x]=1),X[x]!==w&&(n.vertexAttribDivisor(x,w),X[x]=w)}function T(){const x=s.newAttributes,w=s.enabledAttributes;for(let k=0,O=w.length;k<O;k++)w[k]!==x[k]&&(n.disableVertexAttribArray(k),w[k]=0)}function S(x,w,k,O,X,Z,G){G===!0?n.vertexAttribIPointer(x,w,k,X,Z):n.vertexAttribPointer(x,w,k,O,X,Z)}function M(x,w,k,O){_();const X=O.attributes,Z=k.getAttributes(),G=w.defaultAttributeValues;for(const $ in Z){const V=Z[$];if(V.location>=0){let re=X[$];if(re===void 0&&($==="instanceMatrix"&&x.instanceMatrix&&(re=x.instanceMatrix),$==="instanceColor"&&x.instanceColor&&(re=x.instanceColor)),re!==void 0){const Q=re.normalized,se=re.itemSize,be=e.get(re);if(be===void 0)continue;const ke=be.buffer,H=be.type,K=be.bytesPerElement,ue=H===n.INT||H===n.UNSIGNED_INT||re.gpuType===Ja;if(re.isInterleavedBufferAttribute){const ne=re.data,Ee=ne.stride,we=re.offset;if(ne.isInstancedInterleavedBuffer){for(let Ce=0;Ce<V.locationSize;Ce++)h(V.location+Ce,ne.meshPerAttribute);x.isInstancedMesh!==!0&&O._maxInstanceCount===void 0&&(O._maxInstanceCount=ne.meshPerAttribute*ne.count)}else for(let Ce=0;Ce<V.locationSize;Ce++)p(V.location+Ce);n.bindBuffer(n.ARRAY_BUFFER,ke);for(let Ce=0;Ce<V.locationSize;Ce++)S(V.location+Ce,se/V.locationSize,H,Q,Ee*K,(we+se/V.locationSize*Ce)*K,ue)}else{if(re.isInstancedBufferAttribute){for(let ne=0;ne<V.locationSize;ne++)h(V.location+ne,re.meshPerAttribute);x.isInstancedMesh!==!0&&O._maxInstanceCount===void 0&&(O._maxInstanceCount=re.meshPerAttribute*re.count)}else for(let ne=0;ne<V.locationSize;ne++)p(V.location+ne);n.bindBuffer(n.ARRAY_BUFFER,ke);for(let ne=0;ne<V.locationSize;ne++)S(V.location+ne,se/V.locationSize,H,Q,se*K,se/V.locationSize*ne*K,ue)}}else if(G!==void 0){const Q=G[$];if(Q!==void 0)switch(Q.length){case 2:n.vertexAttrib2fv(V.location,Q);break;case 3:n.vertexAttrib3fv(V.location,Q);break;case 4:n.vertexAttrib4fv(V.location,Q);break;default:n.vertexAttrib1fv(V.location,Q)}}}}T()}function P(){L();for(const x in i){const w=i[x];for(const k in w){const O=w[k];for(const X in O)u(O[X].object),delete O[X];delete w[k]}delete i[x]}}function b(x){if(i[x.id]===void 0)return;const w=i[x.id];for(const k in w){const O=w[k];for(const X in O)u(O[X].object),delete O[X];delete w[k]}delete i[x.id]}function R(x){for(const w in i){const k=i[w];if(k[x.id]===void 0)continue;const O=k[x.id];for(const X in O)u(O[X].object),delete O[X];delete k[x.id]}}function L(){E(),a=!0,s!==r&&(s=r,c(s.object))}function E(){r.geometry=null,r.program=null,r.wireframe=!1}return{setup:o,reset:L,resetDefaultState:E,dispose:P,releaseStatesOfGeometry:b,releaseStatesOfProgram:R,initAttributes:_,enableAttribute:p,disableUnusedAttributes:T}}function Hd(n,e,t){let i;function r(c){i=c}function s(c,u){n.drawArrays(i,c,u),t.update(u,i,1)}function a(c,u,f){f!==0&&(n.drawArraysInstanced(i,c,u,f),t.update(u,i,f))}function o(c,u,f){if(f===0)return;e.get("WEBGL_multi_draw").multiDrawArraysWEBGL(i,c,0,u,0,f);let m=0;for(let g=0;g<f;g++)m+=u[g];t.update(m,i,1)}function l(c,u,f,d){if(f===0)return;const m=e.get("WEBGL_multi_draw");if(m===null)for(let g=0;g<c.length;g++)a(c[g],u[g],d[g]);else{m.multiDrawArraysInstancedWEBGL(i,c,0,u,0,d,0,f);let g=0;for(let _=0;_<f;_++)g+=u[_]*d[_];t.update(g,i,1)}}this.setMode=r,this.render=s,this.renderInstances=a,this.renderMultiDraw=o,this.renderMultiDrawInstances=l}function Vd(n,e,t,i){let r;function s(){if(r!==void 0)return r;if(e.has("EXT_texture_filter_anisotropic")===!0){const R=e.get("EXT_texture_filter_anisotropic");r=n.getParameter(R.MAX_TEXTURE_MAX_ANISOTROPY_EXT)}else r=0;return r}function a(R){return!(R!==zt&&i.convert(R)!==n.getParameter(n.IMPLEMENTATION_COLOR_READ_FORMAT))}function o(R){const L=R===mr&&(e.has("EXT_color_buffer_half_float")||e.has("EXT_color_buffer_float"));return!(R!==Jt&&i.convert(R)!==n.getParameter(n.IMPLEMENTATION_COLOR_READ_TYPE)&&R!==an&&!L)}function l(R){if(R==="highp"){if(n.getShaderPrecisionFormat(n.VERTEX_SHADER,n.HIGH_FLOAT).precision>0&&n.getShaderPrecisionFormat(n.FRAGMENT_SHADER,n.HIGH_FLOAT).precision>0)return"highp";R="mediump"}return R==="mediump"&&n.getShaderPrecisionFormat(n.VERTEX_SHADER,n.MEDIUM_FLOAT).precision>0&&n.getShaderPrecisionFormat(n.FRAGMENT_SHADER,n.MEDIUM_FLOAT).precision>0?"mediump":"lowp"}let c=t.precision!==void 0?t.precision:"highp";const u=l(c);u!==c&&(console.warn("THREE.WebGLRenderer:",c,"not supported, using",u,"instead."),c=u);const f=t.logarithmicDepthBuffer===!0,d=t.reverseDepthBuffer===!0&&e.has("EXT_clip_control"),m=n.getParameter(n.MAX_TEXTURE_IMAGE_UNITS),g=n.getParameter(n.MAX_VERTEX_TEXTURE_IMAGE_UNITS),_=n.getParameter(n.MAX_TEXTURE_SIZE),p=n.getParameter(n.MAX_CUBE_MAP_TEXTURE_SIZE),h=n.getParameter(n.MAX_VERTEX_ATTRIBS),T=n.getParameter(n.MAX_VERTEX_UNIFORM_VECTORS),S=n.getParameter(n.MAX_VARYING_VECTORS),M=n.getParameter(n.MAX_FRAGMENT_UNIFORM_VECTORS),P=g>0,b=n.getParameter(n.MAX_SAMPLES);return{isWebGL2:!0,getMaxAnisotropy:s,getMaxPrecision:l,textureFormatReadable:a,textureTypeReadable:o,precision:c,logarithmicDepthBuffer:f,reverseDepthBuffer:d,maxTextures:m,maxVertexTextures:g,maxTextureSize:_,maxCubemapSize:p,maxAttributes:h,maxVertexUniforms:T,maxVaryings:S,maxFragmentUniforms:M,vertexTextures:P,maxSamples:b}}function Wd(n){const e=this;let t=null,i=0,r=!1,s=!1;const a=new jn,o=new Ne,l={value:null,needsUpdate:!1};this.uniform=l,this.numPlanes=0,this.numIntersection=0,this.init=function(f,d){const m=f.length!==0||d||i!==0||r;return r=d,i=f.length,m},this.beginShadows=function(){s=!0,u(null)},this.endShadows=function(){s=!1},this.setGlobalState=function(f,d){t=u(f,d,0)},this.setState=function(f,d,m){const g=f.clippingPlanes,_=f.clipIntersection,p=f.clipShadows,h=n.get(f);if(!r||g===null||g.length===0||s&&!p)s?u(null):c();else{const T=s?0:i,S=T*4;let M=h.clippingState||null;l.value=M,M=u(g,d,S,m);for(let P=0;P!==S;++P)M[P]=t[P];h.clippingState=M,this.numIntersection=_?this.numPlanes:0,this.numPlanes+=T}};function c(){l.value!==t&&(l.value=t,l.needsUpdate=i>0),e.numPlanes=i,e.numIntersection=0}function u(f,d,m,g){const _=f!==null?f.length:0;let p=null;if(_!==0){if(p=l.value,g!==!0||p===null){const h=m+_*4,T=d.matrixWorldInverse;o.getNormalMatrix(T),(p===null||p.length<h)&&(p=new Float32Array(h));for(let S=0,M=m;S!==_;++S,M+=4)a.copy(f[S]).applyMatrix4(T,o),a.normal.toArray(p,M),p[M+3]=a.constant}l.value=p,l.needsUpdate=!0}return e.numPlanes=_,e.numIntersection=0,p}}function Xd(n){let e=new WeakMap;function t(a,o){return o===da?a.mapping=Ni:o===pa&&(a.mapping=Fi),a}function i(a){if(a&&a.isTexture){const o=a.mapping;if(o===da||o===pa)if(e.has(a)){const l=e.get(a).texture;return t(l,a.mapping)}else{const l=a.image;if(l&&l.height>0){const c=new th(l.height);return c.fromEquirectangularTexture(n,a),e.set(a,c),a.addEventListener("dispose",r),t(c.texture,a.mapping)}else return null}}return a}function r(a){const o=a.target;o.removeEventListener("dispose",r);const l=e.get(o);l!==void 0&&(e.delete(o),l.dispose())}function s(){e=new WeakMap}return{get:i,dispose:s}}class sc extends tc{constructor(e=-1,t=1,i=1,r=-1,s=.1,a=2e3){super(),this.isOrthographicCamera=!0,this.type="OrthographicCamera",this.zoom=1,this.view=null,this.left=e,this.right=t,this.top=i,this.bottom=r,this.near=s,this.far=a,this.updateProjectionMatrix()}copy(e,t){return super.copy(e,t),this.left=e.left,this.right=e.right,this.top=e.top,this.bottom=e.bottom,this.near=e.near,this.far=e.far,this.zoom=e.zoom,this.view=e.view===null?null:Object.assign({},e.view),this}setViewOffset(e,t,i,r,s,a){this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=e,this.view.fullHeight=t,this.view.offsetX=i,this.view.offsetY=r,this.view.width=s,this.view.height=a,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){const e=(this.right-this.left)/(2*this.zoom),t=(this.top-this.bottom)/(2*this.zoom),i=(this.right+this.left)/2,r=(this.top+this.bottom)/2;let s=i-e,a=i+e,o=r+t,l=r-t;if(this.view!==null&&this.view.enabled){const c=(this.right-this.left)/this.view.fullWidth/this.zoom,u=(this.top-this.bottom)/this.view.fullHeight/this.zoom;s+=c*this.view.offsetX,a=s+c*this.view.width,o-=u*this.view.offsetY,l=o-u*this.view.height}this.projectionMatrix.makeOrthographic(s,a,o,l,this.near,this.far,this.coordinateSystem),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(e){const t=super.toJSON(e);return t.object.zoom=this.zoom,t.object.left=this.left,t.object.right=this.right,t.object.top=this.top,t.object.bottom=this.bottom,t.object.near=this.near,t.object.far=this.far,this.view!==null&&(t.object.view=Object.assign({},this.view)),t}}const bi=4,qo=[.125,.215,.35,.446,.526,.582],ei=20,Xs=new sc,Yo=new Je;let qs=null,Ys=0,Ks=0,$s=!1;const Jn=(1+Math.sqrt(5))/2,Ti=1/Jn,Ko=[new N(-Jn,Ti,0),new N(Jn,Ti,0),new N(-Ti,0,Jn),new N(Ti,0,Jn),new N(0,Jn,-Ti),new N(0,Jn,Ti),new N(-1,1,-1),new N(1,1,-1),new N(-1,1,1),new N(1,1,1)];class $o{constructor(e){this._renderer=e,this._pingPongRenderTarget=null,this._lodMax=0,this._cubeSize=0,this._lodPlanes=[],this._sizeLods=[],this._sigmas=[],this._blurMaterial=null,this._cubemapMaterial=null,this._equirectMaterial=null,this._compileMaterial(this._blurMaterial)}fromScene(e,t=0,i=.1,r=100){qs=this._renderer.getRenderTarget(),Ys=this._renderer.getActiveCubeFace(),Ks=this._renderer.getActiveMipmapLevel(),$s=this._renderer.xr.enabled,this._renderer.xr.enabled=!1,this._setSize(256);const s=this._allocateTargets();return s.depthBuffer=!0,this._sceneToCubeUV(e,i,r,s),t>0&&this._blur(s,0,0,t),this._applyPMREM(s),this._cleanup(s),s}fromEquirectangular(e,t=null){return this._fromTexture(e,t)}fromCubemap(e,t=null){return this._fromTexture(e,t)}compileCubemapShader(){this._cubemapMaterial===null&&(this._cubemapMaterial=Jo(),this._compileMaterial(this._cubemapMaterial))}compileEquirectangularShader(){this._equirectMaterial===null&&(this._equirectMaterial=jo(),this._compileMaterial(this._equirectMaterial))}dispose(){this._dispose(),this._cubemapMaterial!==null&&this._cubemapMaterial.dispose(),this._equirectMaterial!==null&&this._equirectMaterial.dispose()}_setSize(e){this._lodMax=Math.floor(Math.log2(e)),this._cubeSize=Math.pow(2,this._lodMax)}_dispose(){this._blurMaterial!==null&&this._blurMaterial.dispose(),this._pingPongRenderTarget!==null&&this._pingPongRenderTarget.dispose();for(let e=0;e<this._lodPlanes.length;e++)this._lodPlanes[e].dispose()}_cleanup(e){this._renderer.setRenderTarget(qs,Ys,Ks),this._renderer.xr.enabled=$s,e.scissorTest=!1,Hr(e,0,0,e.width,e.height)}_fromTexture(e,t){e.mapping===Ni||e.mapping===Fi?this._setSize(e.image.length===0?16:e.image[0].width||e.image[0].image.width):this._setSize(e.image.width/4),qs=this._renderer.getRenderTarget(),Ys=this._renderer.getActiveCubeFace(),Ks=this._renderer.getActiveMipmapLevel(),$s=this._renderer.xr.enabled,this._renderer.xr.enabled=!1;const i=t||this._allocateTargets();return this._textureToCubeUV(e,i),this._applyPMREM(i),this._cleanup(i),i}_allocateTargets(){const e=3*Math.max(this._cubeSize,112),t=4*this._cubeSize,i={magFilter:Bt,minFilter:Bt,generateMipmaps:!1,type:mr,format:zt,colorSpace:Wi,depthBuffer:!1},r=Zo(e,t,i);if(this._pingPongRenderTarget===null||this._pingPongRenderTarget.width!==e||this._pingPongRenderTarget.height!==t){this._pingPongRenderTarget!==null&&this._dispose(),this._pingPongRenderTarget=Zo(e,t,i);const{_lodMax:s}=this;({sizeLods:this._sizeLods,lodPlanes:this._lodPlanes,sigmas:this._sigmas}=qd(s)),this._blurMaterial=Yd(s,e,t)}return r}_compileMaterial(e){const t=new kt(this._lodPlanes[0],e);this._renderer.compile(t,Xs)}_sceneToCubeUV(e,t,i,r){const o=new It(90,1,t,i),l=[1,-1,1,1,1,1],c=[1,1,1,-1,-1,-1],u=this._renderer,f=u.autoClear,d=u.toneMapping;u.getClearColor(Yo),u.toneMapping=Bn,u.autoClear=!1;const m=new jl({name:"PMREM.Background",side:wt,depthWrite:!1,depthTest:!1}),g=new kt(new xr,m);let _=!1;const p=e.background;p?p.isColor&&(m.color.copy(p),e.background=null,_=!0):(m.color.copy(Yo),_=!0);for(let h=0;h<6;h++){const T=h%3;T===0?(o.up.set(0,l[h],0),o.lookAt(c[h],0,0)):T===1?(o.up.set(0,0,l[h]),o.lookAt(0,c[h],0)):(o.up.set(0,l[h],0),o.lookAt(0,0,c[h]));const S=this._cubeSize;Hr(r,T*S,h>2?S:0,S,S),u.setRenderTarget(r),_&&u.render(g,o),u.render(e,o)}g.geometry.dispose(),g.material.dispose(),u.toneMapping=d,u.autoClear=f,e.background=p}_textureToCubeUV(e,t){const i=this._renderer,r=e.mapping===Ni||e.mapping===Fi;r?(this._cubemapMaterial===null&&(this._cubemapMaterial=Jo()),this._cubemapMaterial.uniforms.flipEnvMap.value=e.isRenderTargetTexture===!1?-1:1):this._equirectMaterial===null&&(this._equirectMaterial=jo());const s=r?this._cubemapMaterial:this._equirectMaterial,a=new kt(this._lodPlanes[0],s),o=s.uniforms;o.envMap.value=e;const l=this._cubeSize;Hr(t,0,0,3*l,2*l),i.setRenderTarget(t),i.render(a,Xs)}_applyPMREM(e){const t=this._renderer,i=t.autoClear;t.autoClear=!1;const r=this._lodPlanes.length;for(let s=1;s<r;s++){const a=Math.sqrt(this._sigmas[s]*this._sigmas[s]-this._sigmas[s-1]*this._sigmas[s-1]),o=Ko[(r-s-1)%Ko.length];this._blur(e,s-1,s,a,o)}t.autoClear=i}_blur(e,t,i,r,s){const a=this._pingPongRenderTarget;this._halfBlur(e,a,t,i,r,"latitudinal",s),this._halfBlur(a,e,i,i,r,"longitudinal",s)}_halfBlur(e,t,i,r,s,a,o){const l=this._renderer,c=this._blurMaterial;a!=="latitudinal"&&a!=="longitudinal"&&console.error("blur direction must be either latitudinal or longitudinal!");const u=3,f=new kt(this._lodPlanes[r],c),d=c.uniforms,m=this._sizeLods[i]-1,g=isFinite(s)?Math.PI/(2*m):2*Math.PI/(2*ei-1),_=s/g,p=isFinite(s)?1+Math.floor(u*_):ei;p>ei&&console.warn(`sigmaRadians, ${s}, is too large and will clip, as it requested ${p} samples when the maximum is set to ${ei}`);const h=[];let T=0;for(let R=0;R<ei;++R){const L=R/_,E=Math.exp(-L*L/2);h.push(E),R===0?T+=E:R<p&&(T+=2*E)}for(let R=0;R<h.length;R++)h[R]=h[R]/T;d.envMap.value=e.texture,d.samples.value=p,d.weights.value=h,d.latitudinal.value=a==="latitudinal",o&&(d.poleAxis.value=o);const{_lodMax:S}=this;d.dTheta.value=g,d.mipInt.value=S-i;const M=this._sizeLods[r],P=3*M*(r>S-bi?r-S+bi:0),b=4*(this._cubeSize-M);Hr(t,P,b,3*M,2*M),l.setRenderTarget(t),l.render(f,Xs)}}function qd(n){const e=[],t=[],i=[];let r=n;const s=n-bi+1+qo.length;for(let a=0;a<s;a++){const o=Math.pow(2,r);t.push(o);let l=1/o;a>n-bi?l=qo[a-n+bi-1]:a===0&&(l=0),i.push(l);const c=1/(o-2),u=-c,f=1+c,d=[u,u,f,u,f,f,u,u,f,f,u,f],m=6,g=6,_=3,p=2,h=1,T=new Float32Array(_*g*m),S=new Float32Array(p*g*m),M=new Float32Array(h*g*m);for(let b=0;b<m;b++){const R=b%3*2/3-1,L=b>2?0:-1,E=[R,L,0,R+2/3,L,0,R+2/3,L+1,0,R,L,0,R+2/3,L+1,0,R,L+1,0];T.set(E,_*g*b),S.set(d,p*g*b);const x=[b,b,b,b,b,b];M.set(x,h*g*b)}const P=new Qt;P.setAttribute("position",new ut(T,_)),P.setAttribute("uv",new ut(S,p)),P.setAttribute("faceIndex",new ut(M,h)),e.push(P),r>bi&&r--}return{lodPlanes:e,sizeLods:t,sigmas:i}}function Zo(n,e,t){const i=new Sn(n,e,t);return i.texture.mapping=ds,i.texture.name="PMREM.cubeUv",i.scissorTest=!0,i}function Hr(n,e,t,i,r){n.viewport.set(e,t,i,r),n.scissor.set(e,t,i,r)}function Yd(n,e,t){const i=new Float32Array(ei),r=new N(0,1,0);return new bt({name:"SphericalGaussianBlur",defines:{n:ei,CUBEUV_TEXEL_WIDTH:1/e,CUBEUV_TEXEL_HEIGHT:1/t,CUBEUV_MAX_MIP:`${n}.0`},uniforms:{envMap:{value:null},samples:{value:1},weights:{value:i},latitudinal:{value:!1},dTheta:{value:0},mipInt:{value:0},poleAxis:{value:r}},vertexShader:ro(),fragmentShader:`

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
		`,blending:On,depthTest:!1,depthWrite:!1})}function jo(){return new bt({name:"EquirectangularToCubeUV",uniforms:{envMap:{value:null}},vertexShader:ro(),fragmentShader:`

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
		`,blending:On,depthTest:!1,depthWrite:!1})}function Jo(){return new bt({name:"CubemapToCubeUV",uniforms:{envMap:{value:null},flipEnvMap:{value:-1}},vertexShader:ro(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			uniform float flipEnvMap;

			varying vec3 vOutputDirection;

			uniform samplerCube envMap;

			void main() {

				gl_FragColor = textureCube( envMap, vec3( flipEnvMap * vOutputDirection.x, vOutputDirection.yz ) );

			}
		`,blending:On,depthTest:!1,depthWrite:!1})}function ro(){return`

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
	`}function Kd(n){let e=new WeakMap,t=null;function i(o){if(o&&o.isTexture){const l=o.mapping,c=l===da||l===pa,u=l===Ni||l===Fi;if(c||u){let f=e.get(o);const d=f!==void 0?f.texture.pmremVersion:0;if(o.isRenderTargetTexture&&o.pmremVersion!==d)return t===null&&(t=new $o(n)),f=c?t.fromEquirectangular(o,f):t.fromCubemap(o,f),f.texture.pmremVersion=o.pmremVersion,e.set(o,f),f.texture;if(f!==void 0)return f.texture;{const m=o.image;return c&&m&&m.height>0||u&&m&&r(m)?(t===null&&(t=new $o(n)),f=c?t.fromEquirectangular(o):t.fromCubemap(o),f.texture.pmremVersion=o.pmremVersion,e.set(o,f),o.addEventListener("dispose",s),f.texture):null}}}return o}function r(o){let l=0;const c=6;for(let u=0;u<c;u++)o[u]!==void 0&&l++;return l===c}function s(o){const l=o.target;l.removeEventListener("dispose",s);const c=e.get(l);c!==void 0&&(e.delete(l),c.dispose())}function a(){e=new WeakMap,t!==null&&(t.dispose(),t=null)}return{get:i,dispose:a}}function $d(n){const e={};function t(i){if(e[i]!==void 0)return e[i];let r;switch(i){case"WEBGL_depth_texture":r=n.getExtension("WEBGL_depth_texture")||n.getExtension("MOZ_WEBGL_depth_texture")||n.getExtension("WEBKIT_WEBGL_depth_texture");break;case"EXT_texture_filter_anisotropic":r=n.getExtension("EXT_texture_filter_anisotropic")||n.getExtension("MOZ_EXT_texture_filter_anisotropic")||n.getExtension("WEBKIT_EXT_texture_filter_anisotropic");break;case"WEBGL_compressed_texture_s3tc":r=n.getExtension("WEBGL_compressed_texture_s3tc")||n.getExtension("MOZ_WEBGL_compressed_texture_s3tc")||n.getExtension("WEBKIT_WEBGL_compressed_texture_s3tc");break;case"WEBGL_compressed_texture_pvrtc":r=n.getExtension("WEBGL_compressed_texture_pvrtc")||n.getExtension("WEBKIT_WEBGL_compressed_texture_pvrtc");break;default:r=n.getExtension(i)}return e[i]=r,r}return{has:function(i){return t(i)!==null},init:function(){t("EXT_color_buffer_float"),t("WEBGL_clip_cull_distance"),t("OES_texture_float_linear"),t("EXT_color_buffer_half_float"),t("WEBGL_multisampled_render_to_texture"),t("WEBGL_render_shared_exponent")},get:function(i){const r=t(i);return r===null&&rr("THREE.WebGLRenderer: "+i+" extension not supported."),r}}}function Zd(n,e,t,i){const r={},s=new WeakMap;function a(f){const d=f.target;d.index!==null&&e.remove(d.index);for(const g in d.attributes)e.remove(d.attributes[g]);for(const g in d.morphAttributes){const _=d.morphAttributes[g];for(let p=0,h=_.length;p<h;p++)e.remove(_[p])}d.removeEventListener("dispose",a),delete r[d.id];const m=s.get(d);m&&(e.remove(m),s.delete(d)),i.releaseStatesOfGeometry(d),d.isInstancedBufferGeometry===!0&&delete d._maxInstanceCount,t.memory.geometries--}function o(f,d){return r[d.id]===!0||(d.addEventListener("dispose",a),r[d.id]=!0,t.memory.geometries++),d}function l(f){const d=f.attributes;for(const g in d)e.update(d[g],n.ARRAY_BUFFER);const m=f.morphAttributes;for(const g in m){const _=m[g];for(let p=0,h=_.length;p<h;p++)e.update(_[p],n.ARRAY_BUFFER)}}function c(f){const d=[],m=f.index,g=f.attributes.position;let _=0;if(m!==null){const T=m.array;_=m.version;for(let S=0,M=T.length;S<M;S+=3){const P=T[S+0],b=T[S+1],R=T[S+2];d.push(P,b,b,R,R,P)}}else if(g!==void 0){const T=g.array;_=g.version;for(let S=0,M=T.length/3-1;S<M;S+=3){const P=S+0,b=S+1,R=S+2;d.push(P,b,b,R,R,P)}}else return;const p=new(Xl(d)?Ql:Jl)(d,1);p.version=_;const h=s.get(f);h&&e.remove(h),s.set(f,p)}function u(f){const d=s.get(f);if(d){const m=f.index;m!==null&&d.version<m.version&&c(f)}else c(f);return s.get(f)}return{get:o,update:l,getWireframeAttribute:u}}function jd(n,e,t){let i;function r(d){i=d}let s,a;function o(d){s=d.type,a=d.bytesPerElement}function l(d,m){n.drawElements(i,m,s,d*a),t.update(m,i,1)}function c(d,m,g){g!==0&&(n.drawElementsInstanced(i,m,s,d*a,g),t.update(m,i,g))}function u(d,m,g){if(g===0)return;e.get("WEBGL_multi_draw").multiDrawElementsWEBGL(i,m,0,s,d,0,g);let p=0;for(let h=0;h<g;h++)p+=m[h];t.update(p,i,1)}function f(d,m,g,_){if(g===0)return;const p=e.get("WEBGL_multi_draw");if(p===null)for(let h=0;h<d.length;h++)c(d[h]/a,m[h],_[h]);else{p.multiDrawElementsInstancedWEBGL(i,m,0,s,d,0,_,0,g);let h=0;for(let T=0;T<g;T++)h+=m[T]*_[T];t.update(h,i,1)}}this.setMode=r,this.setIndex=o,this.render=l,this.renderInstances=c,this.renderMultiDraw=u,this.renderMultiDrawInstances=f}function Jd(n){const e={geometries:0,textures:0},t={frame:0,calls:0,triangles:0,points:0,lines:0};function i(s,a,o){switch(t.calls++,a){case n.TRIANGLES:t.triangles+=o*(s/3);break;case n.LINES:t.lines+=o*(s/2);break;case n.LINE_STRIP:t.lines+=o*(s-1);break;case n.LINE_LOOP:t.lines+=o*s;break;case n.POINTS:t.points+=o*s;break;default:console.error("THREE.WebGLInfo: Unknown draw mode:",a);break}}function r(){t.calls=0,t.triangles=0,t.points=0,t.lines=0}return{memory:e,render:t,programs:null,autoReset:!0,reset:r,update:i}}function Qd(n,e,t){const i=new WeakMap,r=new tt;function s(a,o,l){const c=a.morphTargetInfluences,u=o.morphAttributes.position||o.morphAttributes.normal||o.morphAttributes.color,f=u!==void 0?u.length:0;let d=i.get(o);if(d===void 0||d.count!==f){let E=function(){R.dispose(),i.delete(o),o.removeEventListener("dispose",E)};d!==void 0&&d.texture.dispose();const m=o.morphAttributes.position!==void 0,g=o.morphAttributes.normal!==void 0,_=o.morphAttributes.color!==void 0,p=o.morphAttributes.position||[],h=o.morphAttributes.normal||[],T=o.morphAttributes.color||[];let S=0;m===!0&&(S=1),g===!0&&(S=2),_===!0&&(S=3);let M=o.attributes.position.count*S,P=1;M>e.maxTextureSize&&(P=Math.ceil(M/e.maxTextureSize),M=e.maxTextureSize);const b=new Float32Array(M*P*4*f),R=new Yl(b,M,P,f);R.type=an,R.needsUpdate=!0;const L=S*4;for(let x=0;x<f;x++){const w=p[x],k=h[x],O=T[x],X=M*P*4*x;for(let Z=0;Z<w.count;Z++){const G=Z*L;m===!0&&(r.fromBufferAttribute(w,Z),b[X+G+0]=r.x,b[X+G+1]=r.y,b[X+G+2]=r.z,b[X+G+3]=0),g===!0&&(r.fromBufferAttribute(k,Z),b[X+G+4]=r.x,b[X+G+5]=r.y,b[X+G+6]=r.z,b[X+G+7]=0),_===!0&&(r.fromBufferAttribute(O,Z),b[X+G+8]=r.x,b[X+G+9]=r.y,b[X+G+10]=r.z,b[X+G+11]=O.itemSize===4?r.w:1)}}d={count:f,texture:R,size:new Ge(M,P)},i.set(o,d),o.addEventListener("dispose",E)}if(a.isInstancedMesh===!0&&a.morphTexture!==null)l.getUniforms().setValue(n,"morphTexture",a.morphTexture,t);else{let m=0;for(let _=0;_<c.length;_++)m+=c[_];const g=o.morphTargetsRelative?1:1-m;l.getUniforms().setValue(n,"morphTargetBaseInfluence",g),l.getUniforms().setValue(n,"morphTargetInfluences",c)}l.getUniforms().setValue(n,"morphTargetsTexture",d.texture,t),l.getUniforms().setValue(n,"morphTargetsTextureSize",d.size)}return{update:s}}function ep(n,e,t,i){let r=new WeakMap;function s(l){const c=i.render.frame,u=l.geometry,f=e.get(l,u);if(r.get(f)!==c&&(e.update(f),r.set(f,c)),l.isInstancedMesh&&(l.hasEventListener("dispose",o)===!1&&l.addEventListener("dispose",o),r.get(l)!==c&&(t.update(l.instanceMatrix,n.ARRAY_BUFFER),l.instanceColor!==null&&t.update(l.instanceColor,n.ARRAY_BUFFER),r.set(l,c))),l.isSkinnedMesh){const d=l.skeleton;r.get(d)!==c&&(d.update(),r.set(d,c))}return f}function a(){r=new WeakMap}function o(l){const c=l.target;c.removeEventListener("dispose",o),t.remove(c.instanceMatrix),c.instanceColor!==null&&t.remove(c.instanceColor)}return{update:s,dispose:a}}class ac extends Mt{constructor(e,t,i,r,s,a,o,l,c,u=Di){if(u!==Di&&u!==Bi)throw new Error("DepthTexture format must be either THREE.DepthFormat or THREE.DepthStencilFormat");i===void 0&&u===Di&&(i=ci),i===void 0&&u===Bi&&(i=Oi),super(null,r,s,a,o,l,u,i,c),this.isDepthTexture=!0,this.image={width:e,height:t},this.magFilter=o!==void 0?o:ft,this.minFilter=l!==void 0?l:ft,this.flipY=!1,this.generateMipmaps=!1,this.compareFunction=null}copy(e){return super.copy(e),this.compareFunction=e.compareFunction,this}toJSON(e){const t=super.toJSON(e);return this.compareFunction!==null&&(t.compareFunction=this.compareFunction),t}}const oc=new Mt,Qo=new ac(1,1),lc=new Yl,cc=new zu,uc=new nc,el=[],tl=[],nl=new Float32Array(16),il=new Float32Array(9),rl=new Float32Array(4);function Ki(n,e,t){const i=n[0];if(i<=0||i>0)return n;const r=e*t;let s=el[r];if(s===void 0&&(s=new Float32Array(r),el[r]=s),e!==0){i.toArray(s,0);for(let a=1,o=0;a!==e;++a)o+=t,n[a].toArray(s,o)}return s}function dt(n,e){if(n.length!==e.length)return!1;for(let t=0,i=n.length;t<i;t++)if(n[t]!==e[t])return!1;return!0}function pt(n,e){for(let t=0,i=e.length;t<i;t++)n[t]=e[t]}function gs(n,e){let t=tl[e];t===void 0&&(t=new Int32Array(e),tl[e]=t);for(let i=0;i!==e;++i)t[i]=n.allocateTextureUnit();return t}function tp(n,e){const t=this.cache;t[0]!==e&&(n.uniform1f(this.addr,e),t[0]=e)}function np(n,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y)&&(n.uniform2f(this.addr,e.x,e.y),t[0]=e.x,t[1]=e.y);else{if(dt(t,e))return;n.uniform2fv(this.addr,e),pt(t,e)}}function ip(n,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z)&&(n.uniform3f(this.addr,e.x,e.y,e.z),t[0]=e.x,t[1]=e.y,t[2]=e.z);else if(e.r!==void 0)(t[0]!==e.r||t[1]!==e.g||t[2]!==e.b)&&(n.uniform3f(this.addr,e.r,e.g,e.b),t[0]=e.r,t[1]=e.g,t[2]=e.b);else{if(dt(t,e))return;n.uniform3fv(this.addr,e),pt(t,e)}}function rp(n,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z||t[3]!==e.w)&&(n.uniform4f(this.addr,e.x,e.y,e.z,e.w),t[0]=e.x,t[1]=e.y,t[2]=e.z,t[3]=e.w);else{if(dt(t,e))return;n.uniform4fv(this.addr,e),pt(t,e)}}function sp(n,e){const t=this.cache,i=e.elements;if(i===void 0){if(dt(t,e))return;n.uniformMatrix2fv(this.addr,!1,e),pt(t,e)}else{if(dt(t,i))return;rl.set(i),n.uniformMatrix2fv(this.addr,!1,rl),pt(t,i)}}function ap(n,e){const t=this.cache,i=e.elements;if(i===void 0){if(dt(t,e))return;n.uniformMatrix3fv(this.addr,!1,e),pt(t,e)}else{if(dt(t,i))return;il.set(i),n.uniformMatrix3fv(this.addr,!1,il),pt(t,i)}}function op(n,e){const t=this.cache,i=e.elements;if(i===void 0){if(dt(t,e))return;n.uniformMatrix4fv(this.addr,!1,e),pt(t,e)}else{if(dt(t,i))return;nl.set(i),n.uniformMatrix4fv(this.addr,!1,nl),pt(t,i)}}function lp(n,e){const t=this.cache;t[0]!==e&&(n.uniform1i(this.addr,e),t[0]=e)}function cp(n,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y)&&(n.uniform2i(this.addr,e.x,e.y),t[0]=e.x,t[1]=e.y);else{if(dt(t,e))return;n.uniform2iv(this.addr,e),pt(t,e)}}function up(n,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z)&&(n.uniform3i(this.addr,e.x,e.y,e.z),t[0]=e.x,t[1]=e.y,t[2]=e.z);else{if(dt(t,e))return;n.uniform3iv(this.addr,e),pt(t,e)}}function hp(n,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z||t[3]!==e.w)&&(n.uniform4i(this.addr,e.x,e.y,e.z,e.w),t[0]=e.x,t[1]=e.y,t[2]=e.z,t[3]=e.w);else{if(dt(t,e))return;n.uniform4iv(this.addr,e),pt(t,e)}}function fp(n,e){const t=this.cache;t[0]!==e&&(n.uniform1ui(this.addr,e),t[0]=e)}function dp(n,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y)&&(n.uniform2ui(this.addr,e.x,e.y),t[0]=e.x,t[1]=e.y);else{if(dt(t,e))return;n.uniform2uiv(this.addr,e),pt(t,e)}}function pp(n,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z)&&(n.uniform3ui(this.addr,e.x,e.y,e.z),t[0]=e.x,t[1]=e.y,t[2]=e.z);else{if(dt(t,e))return;n.uniform3uiv(this.addr,e),pt(t,e)}}function mp(n,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z||t[3]!==e.w)&&(n.uniform4ui(this.addr,e.x,e.y,e.z,e.w),t[0]=e.x,t[1]=e.y,t[2]=e.z,t[3]=e.w);else{if(dt(t,e))return;n.uniform4uiv(this.addr,e),pt(t,e)}}function gp(n,e,t){const i=this.cache,r=t.allocateTextureUnit();i[0]!==r&&(n.uniform1i(this.addr,r),i[0]=r);let s;this.type===n.SAMPLER_2D_SHADOW?(Qo.compareFunction=Wl,s=Qo):s=oc,t.setTexture2D(e||s,r)}function _p(n,e,t){const i=this.cache,r=t.allocateTextureUnit();i[0]!==r&&(n.uniform1i(this.addr,r),i[0]=r),t.setTexture3D(e||cc,r)}function vp(n,e,t){const i=this.cache,r=t.allocateTextureUnit();i[0]!==r&&(n.uniform1i(this.addr,r),i[0]=r),t.setTextureCube(e||uc,r)}function xp(n,e,t){const i=this.cache,r=t.allocateTextureUnit();i[0]!==r&&(n.uniform1i(this.addr,r),i[0]=r),t.setTexture2DArray(e||lc,r)}function Mp(n){switch(n){case 5126:return tp;case 35664:return np;case 35665:return ip;case 35666:return rp;case 35674:return sp;case 35675:return ap;case 35676:return op;case 5124:case 35670:return lp;case 35667:case 35671:return cp;case 35668:case 35672:return up;case 35669:case 35673:return hp;case 5125:return fp;case 36294:return dp;case 36295:return pp;case 36296:return mp;case 35678:case 36198:case 36298:case 36306:case 35682:return gp;case 35679:case 36299:case 36307:return _p;case 35680:case 36300:case 36308:case 36293:return vp;case 36289:case 36303:case 36311:case 36292:return xp}}function Sp(n,e){n.uniform1fv(this.addr,e)}function yp(n,e){const t=Ki(e,this.size,2);n.uniform2fv(this.addr,t)}function Ep(n,e){const t=Ki(e,this.size,3);n.uniform3fv(this.addr,t)}function Tp(n,e){const t=Ki(e,this.size,4);n.uniform4fv(this.addr,t)}function Ap(n,e){const t=Ki(e,this.size,4);n.uniformMatrix2fv(this.addr,!1,t)}function bp(n,e){const t=Ki(e,this.size,9);n.uniformMatrix3fv(this.addr,!1,t)}function wp(n,e){const t=Ki(e,this.size,16);n.uniformMatrix4fv(this.addr,!1,t)}function Rp(n,e){n.uniform1iv(this.addr,e)}function Cp(n,e){n.uniform2iv(this.addr,e)}function Pp(n,e){n.uniform3iv(this.addr,e)}function Dp(n,e){n.uniform4iv(this.addr,e)}function Lp(n,e){n.uniform1uiv(this.addr,e)}function Ip(n,e){n.uniform2uiv(this.addr,e)}function Up(n,e){n.uniform3uiv(this.addr,e)}function Np(n,e){n.uniform4uiv(this.addr,e)}function Fp(n,e,t){const i=this.cache,r=e.length,s=gs(t,r);dt(i,s)||(n.uniform1iv(this.addr,s),pt(i,s));for(let a=0;a!==r;++a)t.setTexture2D(e[a]||oc,s[a])}function Op(n,e,t){const i=this.cache,r=e.length,s=gs(t,r);dt(i,s)||(n.uniform1iv(this.addr,s),pt(i,s));for(let a=0;a!==r;++a)t.setTexture3D(e[a]||cc,s[a])}function Bp(n,e,t){const i=this.cache,r=e.length,s=gs(t,r);dt(i,s)||(n.uniform1iv(this.addr,s),pt(i,s));for(let a=0;a!==r;++a)t.setTextureCube(e[a]||uc,s[a])}function zp(n,e,t){const i=this.cache,r=e.length,s=gs(t,r);dt(i,s)||(n.uniform1iv(this.addr,s),pt(i,s));for(let a=0;a!==r;++a)t.setTexture2DArray(e[a]||lc,s[a])}function kp(n){switch(n){case 5126:return Sp;case 35664:return yp;case 35665:return Ep;case 35666:return Tp;case 35674:return Ap;case 35675:return bp;case 35676:return wp;case 5124:case 35670:return Rp;case 35667:case 35671:return Cp;case 35668:case 35672:return Pp;case 35669:case 35673:return Dp;case 5125:return Lp;case 36294:return Ip;case 36295:return Up;case 36296:return Np;case 35678:case 36198:case 36298:case 36306:case 35682:return Fp;case 35679:case 36299:case 36307:return Op;case 35680:case 36300:case 36308:case 36293:return Bp;case 36289:case 36303:case 36311:case 36292:return zp}}class Gp{constructor(e,t,i){this.id=e,this.addr=i,this.cache=[],this.type=t.type,this.setValue=Mp(t.type)}}class Hp{constructor(e,t,i){this.id=e,this.addr=i,this.cache=[],this.type=t.type,this.size=t.size,this.setValue=kp(t.type)}}class Vp{constructor(e){this.id=e,this.seq=[],this.map={}}setValue(e,t,i){const r=this.seq;for(let s=0,a=r.length;s!==a;++s){const o=r[s];o.setValue(e,t[o.id],i)}}}const Zs=/(\w+)(\])?(\[|\.)?/g;function sl(n,e){n.seq.push(e),n.map[e.id]=e}function Wp(n,e,t){const i=n.name,r=i.length;for(Zs.lastIndex=0;;){const s=Zs.exec(i),a=Zs.lastIndex;let o=s[1];const l=s[2]==="]",c=s[3];if(l&&(o=o|0),c===void 0||c==="["&&a+2===r){sl(t,c===void 0?new Gp(o,n,e):new Hp(o,n,e));break}else{let f=t.map[o];f===void 0&&(f=new Vp(o),sl(t,f)),t=f}}}class ns{constructor(e,t){this.seq=[],this.map={};const i=e.getProgramParameter(t,e.ACTIVE_UNIFORMS);for(let r=0;r<i;++r){const s=e.getActiveUniform(t,r),a=e.getUniformLocation(t,s.name);Wp(s,a,this)}}setValue(e,t,i,r){const s=this.map[t];s!==void 0&&s.setValue(e,i,r)}setOptional(e,t,i){const r=t[i];r!==void 0&&this.setValue(e,i,r)}static upload(e,t,i,r){for(let s=0,a=t.length;s!==a;++s){const o=t[s],l=i[o.id];l.needsUpdate!==!1&&o.setValue(e,l.value,r)}}static seqWithValue(e,t){const i=[];for(let r=0,s=e.length;r!==s;++r){const a=e[r];a.id in t&&i.push(a)}return i}}function al(n,e,t){const i=n.createShader(e);return n.shaderSource(i,t),n.compileShader(i),i}const Xp=37297;let qp=0;function Yp(n,e){const t=n.split(`
`),i=[],r=Math.max(e-6,0),s=Math.min(e+6,t.length);for(let a=r;a<s;a++){const o=a+1;i.push(`${o===e?">":" "} ${o}: ${t[a]}`)}return i.join(`
`)}const ol=new Ne;function Kp(n){Xe._getMatrix(ol,Xe.workingColorSpace,n);const e=`mat3( ${ol.elements.map(t=>t.toFixed(4))} )`;switch(Xe.getTransfer(n)){case ps:return[e,"LinearTransferOETF"];case Qe:return[e,"sRGBTransferOETF"];default:return console.warn("THREE.WebGLProgram: Unsupported color space: ",n),[e,"LinearTransferOETF"]}}function ll(n,e,t){const i=n.getShaderParameter(e,n.COMPILE_STATUS),r=n.getShaderInfoLog(e).trim();if(i&&r==="")return"";const s=/ERROR: 0:(\d+)/.exec(r);if(s){const a=parseInt(s[1]);return t.toUpperCase()+`

`+r+`

`+Yp(n.getShaderSource(e),a)}else return r}function $p(n,e){const t=Kp(e);return[`vec4 ${n}( vec4 value ) {`,`	return ${t[1]}( vec4( value.rgb * ${t[0]}, value.a ) );`,"}"].join(`
`)}function Zp(n,e){let t;switch(e){case hu:t="Linear";break;case fu:t="Reinhard";break;case du:t="Cineon";break;case pu:t="ACESFilmic";break;case gu:t="AgX";break;case _u:t="Neutral";break;case mu:t="Custom";break;default:console.warn("THREE.WebGLProgram: Unsupported toneMapping:",e),t="Linear"}return"vec3 "+n+"( vec3 color ) { return "+t+"ToneMapping( color ); }"}const Vr=new N;function jp(){Xe.getLuminanceCoefficients(Vr);const n=Vr.x.toFixed(4),e=Vr.y.toFixed(4),t=Vr.z.toFixed(4);return["float luminance( const in vec3 rgb ) {",`	const vec3 weights = vec3( ${n}, ${e}, ${t} );`,"	return dot( weights, rgb );","}"].join(`
`)}function Jp(n){return[n.extensionClipCullDistance?"#extension GL_ANGLE_clip_cull_distance : require":"",n.extensionMultiDraw?"#extension GL_ANGLE_multi_draw : require":""].filter(sr).join(`
`)}function Qp(n){const e=[];for(const t in n){const i=n[t];i!==!1&&e.push("#define "+t+" "+i)}return e.join(`
`)}function em(n,e){const t={},i=n.getProgramParameter(e,n.ACTIVE_ATTRIBUTES);for(let r=0;r<i;r++){const s=n.getActiveAttrib(e,r),a=s.name;let o=1;s.type===n.FLOAT_MAT2&&(o=2),s.type===n.FLOAT_MAT3&&(o=3),s.type===n.FLOAT_MAT4&&(o=4),t[a]={type:s.type,location:n.getAttribLocation(e,a),locationSize:o}}return t}function sr(n){return n!==""}function cl(n,e){const t=e.numSpotLightShadows+e.numSpotLightMaps-e.numSpotLightShadowsWithMaps;return n.replace(/NUM_DIR_LIGHTS/g,e.numDirLights).replace(/NUM_SPOT_LIGHTS/g,e.numSpotLights).replace(/NUM_SPOT_LIGHT_MAPS/g,e.numSpotLightMaps).replace(/NUM_SPOT_LIGHT_COORDS/g,t).replace(/NUM_RECT_AREA_LIGHTS/g,e.numRectAreaLights).replace(/NUM_POINT_LIGHTS/g,e.numPointLights).replace(/NUM_HEMI_LIGHTS/g,e.numHemiLights).replace(/NUM_DIR_LIGHT_SHADOWS/g,e.numDirLightShadows).replace(/NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS/g,e.numSpotLightShadowsWithMaps).replace(/NUM_SPOT_LIGHT_SHADOWS/g,e.numSpotLightShadows).replace(/NUM_POINT_LIGHT_SHADOWS/g,e.numPointLightShadows)}function ul(n,e){return n.replace(/NUM_CLIPPING_PLANES/g,e.numClippingPlanes).replace(/UNION_CLIPPING_PLANES/g,e.numClippingPlanes-e.numClipIntersection)}const tm=/^[ \t]*#include +<([\w\d./]+)>/gm;function Wa(n){return n.replace(tm,im)}const nm=new Map;function im(n,e){let t=ze[e];if(t===void 0){const i=nm.get(e);if(i!==void 0)t=ze[i],console.warn('THREE.WebGLRenderer: Shader chunk "%s" has been deprecated. Use "%s" instead.',e,i);else throw new Error("Can not resolve #include <"+e+">")}return Wa(t)}const rm=/#pragma unroll_loop_start\s+for\s*\(\s*int\s+i\s*=\s*(\d+)\s*;\s*i\s*<\s*(\d+)\s*;\s*i\s*\+\+\s*\)\s*{([\s\S]+?)}\s+#pragma unroll_loop_end/g;function hl(n){return n.replace(rm,sm)}function sm(n,e,t,i){let r="";for(let s=parseInt(e);s<parseInt(t);s++)r+=i.replace(/\[\s*i\s*\]/g,"[ "+s+" ]").replace(/UNROLLED_LOOP_INDEX/g,s);return r}function fl(n){let e=`precision ${n.precision} float;
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
#define LOW_PRECISION`),e}function am(n){let e="SHADOWMAP_TYPE_BASIC";return n.shadowMapType===Dl?e="SHADOWMAP_TYPE_PCF":n.shadowMapType===qc?e="SHADOWMAP_TYPE_PCF_SOFT":n.shadowMapType===mn&&(e="SHADOWMAP_TYPE_VSM"),e}function om(n){let e="ENVMAP_TYPE_CUBE";if(n.envMap)switch(n.envMapMode){case Ni:case Fi:e="ENVMAP_TYPE_CUBE";break;case ds:e="ENVMAP_TYPE_CUBE_UV";break}return e}function lm(n){let e="ENVMAP_MODE_REFLECTION";if(n.envMap)switch(n.envMapMode){case Fi:e="ENVMAP_MODE_REFRACTION";break}return e}function cm(n){let e="ENVMAP_BLENDING_NONE";if(n.envMap)switch(n.combine){case Ll:e="ENVMAP_BLENDING_MULTIPLY";break;case cu:e="ENVMAP_BLENDING_MIX";break;case uu:e="ENVMAP_BLENDING_ADD";break}return e}function um(n){const e=n.envMapCubeUVHeight;if(e===null)return null;const t=Math.log2(e)-2,i=1/e;return{texelWidth:1/(3*Math.max(Math.pow(2,t),112)),texelHeight:i,maxMip:t}}function hm(n,e,t,i){const r=n.getContext(),s=t.defines;let a=t.vertexShader,o=t.fragmentShader;const l=am(t),c=om(t),u=lm(t),f=cm(t),d=um(t),m=Jp(t),g=Qp(s),_=r.createProgram();let p,h,T=t.glslVersion?"#version "+t.glslVersion+`
`:"";t.isRawShaderMaterial?(p=["#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,g].filter(sr).join(`
`),p.length>0&&(p+=`
`),h=["#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,g].filter(sr).join(`
`),h.length>0&&(h+=`
`)):(p=[fl(t),"#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,g,t.extensionClipCullDistance?"#define USE_CLIP_DISTANCE":"",t.batching?"#define USE_BATCHING":"",t.batchingColor?"#define USE_BATCHING_COLOR":"",t.instancing?"#define USE_INSTANCING":"",t.instancingColor?"#define USE_INSTANCING_COLOR":"",t.instancingMorph?"#define USE_INSTANCING_MORPH":"",t.useFog&&t.fog?"#define USE_FOG":"",t.useFog&&t.fogExp2?"#define FOG_EXP2":"",t.map?"#define USE_MAP":"",t.envMap?"#define USE_ENVMAP":"",t.envMap?"#define "+u:"",t.lightMap?"#define USE_LIGHTMAP":"",t.aoMap?"#define USE_AOMAP":"",t.bumpMap?"#define USE_BUMPMAP":"",t.normalMap?"#define USE_NORMALMAP":"",t.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",t.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",t.displacementMap?"#define USE_DISPLACEMENTMAP":"",t.emissiveMap?"#define USE_EMISSIVEMAP":"",t.anisotropy?"#define USE_ANISOTROPY":"",t.anisotropyMap?"#define USE_ANISOTROPYMAP":"",t.clearcoatMap?"#define USE_CLEARCOATMAP":"",t.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",t.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",t.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",t.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",t.specularMap?"#define USE_SPECULARMAP":"",t.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",t.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",t.roughnessMap?"#define USE_ROUGHNESSMAP":"",t.metalnessMap?"#define USE_METALNESSMAP":"",t.alphaMap?"#define USE_ALPHAMAP":"",t.alphaHash?"#define USE_ALPHAHASH":"",t.transmission?"#define USE_TRANSMISSION":"",t.transmissionMap?"#define USE_TRANSMISSIONMAP":"",t.thicknessMap?"#define USE_THICKNESSMAP":"",t.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",t.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",t.mapUv?"#define MAP_UV "+t.mapUv:"",t.alphaMapUv?"#define ALPHAMAP_UV "+t.alphaMapUv:"",t.lightMapUv?"#define LIGHTMAP_UV "+t.lightMapUv:"",t.aoMapUv?"#define AOMAP_UV "+t.aoMapUv:"",t.emissiveMapUv?"#define EMISSIVEMAP_UV "+t.emissiveMapUv:"",t.bumpMapUv?"#define BUMPMAP_UV "+t.bumpMapUv:"",t.normalMapUv?"#define NORMALMAP_UV "+t.normalMapUv:"",t.displacementMapUv?"#define DISPLACEMENTMAP_UV "+t.displacementMapUv:"",t.metalnessMapUv?"#define METALNESSMAP_UV "+t.metalnessMapUv:"",t.roughnessMapUv?"#define ROUGHNESSMAP_UV "+t.roughnessMapUv:"",t.anisotropyMapUv?"#define ANISOTROPYMAP_UV "+t.anisotropyMapUv:"",t.clearcoatMapUv?"#define CLEARCOATMAP_UV "+t.clearcoatMapUv:"",t.clearcoatNormalMapUv?"#define CLEARCOAT_NORMALMAP_UV "+t.clearcoatNormalMapUv:"",t.clearcoatRoughnessMapUv?"#define CLEARCOAT_ROUGHNESSMAP_UV "+t.clearcoatRoughnessMapUv:"",t.iridescenceMapUv?"#define IRIDESCENCEMAP_UV "+t.iridescenceMapUv:"",t.iridescenceThicknessMapUv?"#define IRIDESCENCE_THICKNESSMAP_UV "+t.iridescenceThicknessMapUv:"",t.sheenColorMapUv?"#define SHEEN_COLORMAP_UV "+t.sheenColorMapUv:"",t.sheenRoughnessMapUv?"#define SHEEN_ROUGHNESSMAP_UV "+t.sheenRoughnessMapUv:"",t.specularMapUv?"#define SPECULARMAP_UV "+t.specularMapUv:"",t.specularColorMapUv?"#define SPECULAR_COLORMAP_UV "+t.specularColorMapUv:"",t.specularIntensityMapUv?"#define SPECULAR_INTENSITYMAP_UV "+t.specularIntensityMapUv:"",t.transmissionMapUv?"#define TRANSMISSIONMAP_UV "+t.transmissionMapUv:"",t.thicknessMapUv?"#define THICKNESSMAP_UV "+t.thicknessMapUv:"",t.vertexTangents&&t.flatShading===!1?"#define USE_TANGENT":"",t.vertexColors?"#define USE_COLOR":"",t.vertexAlphas?"#define USE_COLOR_ALPHA":"",t.vertexUv1s?"#define USE_UV1":"",t.vertexUv2s?"#define USE_UV2":"",t.vertexUv3s?"#define USE_UV3":"",t.pointsUvs?"#define USE_POINTS_UV":"",t.flatShading?"#define FLAT_SHADED":"",t.skinning?"#define USE_SKINNING":"",t.morphTargets?"#define USE_MORPHTARGETS":"",t.morphNormals&&t.flatShading===!1?"#define USE_MORPHNORMALS":"",t.morphColors?"#define USE_MORPHCOLORS":"",t.morphTargetsCount>0?"#define MORPHTARGETS_TEXTURE_STRIDE "+t.morphTextureStride:"",t.morphTargetsCount>0?"#define MORPHTARGETS_COUNT "+t.morphTargetsCount:"",t.doubleSided?"#define DOUBLE_SIDED":"",t.flipSided?"#define FLIP_SIDED":"",t.shadowMapEnabled?"#define USE_SHADOWMAP":"",t.shadowMapEnabled?"#define "+l:"",t.sizeAttenuation?"#define USE_SIZEATTENUATION":"",t.numLightProbes>0?"#define USE_LIGHT_PROBES":"",t.logarithmicDepthBuffer?"#define USE_LOGDEPTHBUF":"",t.reverseDepthBuffer?"#define USE_REVERSEDEPTHBUF":"","uniform mat4 modelMatrix;","uniform mat4 modelViewMatrix;","uniform mat4 projectionMatrix;","uniform mat4 viewMatrix;","uniform mat3 normalMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;","#ifdef USE_INSTANCING","	attribute mat4 instanceMatrix;","#endif","#ifdef USE_INSTANCING_COLOR","	attribute vec3 instanceColor;","#endif","#ifdef USE_INSTANCING_MORPH","	uniform sampler2D morphTexture;","#endif","attribute vec3 position;","attribute vec3 normal;","attribute vec2 uv;","#ifdef USE_UV1","	attribute vec2 uv1;","#endif","#ifdef USE_UV2","	attribute vec2 uv2;","#endif","#ifdef USE_UV3","	attribute vec2 uv3;","#endif","#ifdef USE_TANGENT","	attribute vec4 tangent;","#endif","#if defined( USE_COLOR_ALPHA )","	attribute vec4 color;","#elif defined( USE_COLOR )","	attribute vec3 color;","#endif","#ifdef USE_SKINNING","	attribute vec4 skinIndex;","	attribute vec4 skinWeight;","#endif",`
`].filter(sr).join(`
`),h=[fl(t),"#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,g,t.useFog&&t.fog?"#define USE_FOG":"",t.useFog&&t.fogExp2?"#define FOG_EXP2":"",t.alphaToCoverage?"#define ALPHA_TO_COVERAGE":"",t.map?"#define USE_MAP":"",t.matcap?"#define USE_MATCAP":"",t.envMap?"#define USE_ENVMAP":"",t.envMap?"#define "+c:"",t.envMap?"#define "+u:"",t.envMap?"#define "+f:"",d?"#define CUBEUV_TEXEL_WIDTH "+d.texelWidth:"",d?"#define CUBEUV_TEXEL_HEIGHT "+d.texelHeight:"",d?"#define CUBEUV_MAX_MIP "+d.maxMip+".0":"",t.lightMap?"#define USE_LIGHTMAP":"",t.aoMap?"#define USE_AOMAP":"",t.bumpMap?"#define USE_BUMPMAP":"",t.normalMap?"#define USE_NORMALMAP":"",t.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",t.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",t.emissiveMap?"#define USE_EMISSIVEMAP":"",t.anisotropy?"#define USE_ANISOTROPY":"",t.anisotropyMap?"#define USE_ANISOTROPYMAP":"",t.clearcoat?"#define USE_CLEARCOAT":"",t.clearcoatMap?"#define USE_CLEARCOATMAP":"",t.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",t.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",t.dispersion?"#define USE_DISPERSION":"",t.iridescence?"#define USE_IRIDESCENCE":"",t.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",t.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",t.specularMap?"#define USE_SPECULARMAP":"",t.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",t.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",t.roughnessMap?"#define USE_ROUGHNESSMAP":"",t.metalnessMap?"#define USE_METALNESSMAP":"",t.alphaMap?"#define USE_ALPHAMAP":"",t.alphaTest?"#define USE_ALPHATEST":"",t.alphaHash?"#define USE_ALPHAHASH":"",t.sheen?"#define USE_SHEEN":"",t.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",t.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",t.transmission?"#define USE_TRANSMISSION":"",t.transmissionMap?"#define USE_TRANSMISSIONMAP":"",t.thicknessMap?"#define USE_THICKNESSMAP":"",t.vertexTangents&&t.flatShading===!1?"#define USE_TANGENT":"",t.vertexColors||t.instancingColor||t.batchingColor?"#define USE_COLOR":"",t.vertexAlphas?"#define USE_COLOR_ALPHA":"",t.vertexUv1s?"#define USE_UV1":"",t.vertexUv2s?"#define USE_UV2":"",t.vertexUv3s?"#define USE_UV3":"",t.pointsUvs?"#define USE_POINTS_UV":"",t.gradientMap?"#define USE_GRADIENTMAP":"",t.flatShading?"#define FLAT_SHADED":"",t.doubleSided?"#define DOUBLE_SIDED":"",t.flipSided?"#define FLIP_SIDED":"",t.shadowMapEnabled?"#define USE_SHADOWMAP":"",t.shadowMapEnabled?"#define "+l:"",t.premultipliedAlpha?"#define PREMULTIPLIED_ALPHA":"",t.numLightProbes>0?"#define USE_LIGHT_PROBES":"",t.decodeVideoTexture?"#define DECODE_VIDEO_TEXTURE":"",t.decodeVideoTextureEmissive?"#define DECODE_VIDEO_TEXTURE_EMISSIVE":"",t.logarithmicDepthBuffer?"#define USE_LOGDEPTHBUF":"",t.reverseDepthBuffer?"#define USE_REVERSEDEPTHBUF":"","uniform mat4 viewMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;",t.toneMapping!==Bn?"#define TONE_MAPPING":"",t.toneMapping!==Bn?ze.tonemapping_pars_fragment:"",t.toneMapping!==Bn?Zp("toneMapping",t.toneMapping):"",t.dithering?"#define DITHERING":"",t.opaque?"#define OPAQUE":"",ze.colorspace_pars_fragment,$p("linearToOutputTexel",t.outputColorSpace),jp(),t.useDepthPacking?"#define DEPTH_PACKING "+t.depthPacking:"",`
`].filter(sr).join(`
`)),a=Wa(a),a=cl(a,t),a=ul(a,t),o=Wa(o),o=cl(o,t),o=ul(o,t),a=hl(a),o=hl(o),t.isRawShaderMaterial!==!0&&(T=`#version 300 es
`,p=[m,"#define attribute in","#define varying out","#define texture2D texture"].join(`
`)+`
`+p,h=["#define varying in",t.glslVersion===Fn?"":"layout(location = 0) out highp vec4 pc_fragColor;",t.glslVersion===Fn?"":"#define gl_FragColor pc_fragColor","#define gl_FragDepthEXT gl_FragDepth","#define texture2D texture","#define textureCube texture","#define texture2DProj textureProj","#define texture2DLodEXT textureLod","#define texture2DProjLodEXT textureProjLod","#define textureCubeLodEXT textureLod","#define texture2DGradEXT textureGrad","#define texture2DProjGradEXT textureProjGrad","#define textureCubeGradEXT textureGrad"].join(`
`)+`
`+h);const S=T+p+a,M=T+h+o,P=al(r,r.VERTEX_SHADER,S),b=al(r,r.FRAGMENT_SHADER,M);r.attachShader(_,P),r.attachShader(_,b),t.index0AttributeName!==void 0?r.bindAttribLocation(_,0,t.index0AttributeName):t.morphTargets===!0&&r.bindAttribLocation(_,0,"position"),r.linkProgram(_);function R(w){if(n.debug.checkShaderErrors){const k=r.getProgramInfoLog(_).trim(),O=r.getShaderInfoLog(P).trim(),X=r.getShaderInfoLog(b).trim();let Z=!0,G=!0;if(r.getProgramParameter(_,r.LINK_STATUS)===!1)if(Z=!1,typeof n.debug.onShaderError=="function")n.debug.onShaderError(r,_,P,b);else{const $=ll(r,P,"vertex"),V=ll(r,b,"fragment");console.error("THREE.WebGLProgram: Shader Error "+r.getError()+" - VALIDATE_STATUS "+r.getProgramParameter(_,r.VALIDATE_STATUS)+`

Material Name: `+w.name+`
Material Type: `+w.type+`

Program Info Log: `+k+`
`+$+`
`+V)}else k!==""?console.warn("THREE.WebGLProgram: Program Info Log:",k):(O===""||X==="")&&(G=!1);G&&(w.diagnostics={runnable:Z,programLog:k,vertexShader:{log:O,prefix:p},fragmentShader:{log:X,prefix:h}})}r.deleteShader(P),r.deleteShader(b),L=new ns(r,_),E=em(r,_)}let L;this.getUniforms=function(){return L===void 0&&R(this),L};let E;this.getAttributes=function(){return E===void 0&&R(this),E};let x=t.rendererExtensionParallelShaderCompile===!1;return this.isReady=function(){return x===!1&&(x=r.getProgramParameter(_,Xp)),x},this.destroy=function(){i.releaseStatesOfProgram(this),r.deleteProgram(_),this.program=void 0},this.type=t.shaderType,this.name=t.shaderName,this.id=qp++,this.cacheKey=e,this.usedTimes=1,this.program=_,this.vertexShader=P,this.fragmentShader=b,this}let fm=0;class dm{constructor(){this.shaderCache=new Map,this.materialCache=new Map}update(e){const t=e.vertexShader,i=e.fragmentShader,r=this._getShaderStage(t),s=this._getShaderStage(i),a=this._getShaderCacheForMaterial(e);return a.has(r)===!1&&(a.add(r),r.usedTimes++),a.has(s)===!1&&(a.add(s),s.usedTimes++),this}remove(e){const t=this.materialCache.get(e);for(const i of t)i.usedTimes--,i.usedTimes===0&&this.shaderCache.delete(i.code);return this.materialCache.delete(e),this}getVertexShaderID(e){return this._getShaderStage(e.vertexShader).id}getFragmentShaderID(e){return this._getShaderStage(e.fragmentShader).id}dispose(){this.shaderCache.clear(),this.materialCache.clear()}_getShaderCacheForMaterial(e){const t=this.materialCache;let i=t.get(e);return i===void 0&&(i=new Set,t.set(e,i)),i}_getShaderStage(e){const t=this.shaderCache;let i=t.get(e);return i===void 0&&(i=new pm(e),t.set(e,i)),i}}class pm{constructor(e){this.id=fm++,this.code=e,this.usedTimes=0}}function mm(n,e,t,i,r,s,a){const o=new $l,l=new dm,c=new Set,u=[],f=r.logarithmicDepthBuffer,d=r.vertexTextures;let m=r.precision;const g={MeshDepthMaterial:"depth",MeshDistanceMaterial:"distanceRGBA",MeshNormalMaterial:"normal",MeshBasicMaterial:"basic",MeshLambertMaterial:"lambert",MeshPhongMaterial:"phong",MeshToonMaterial:"toon",MeshStandardMaterial:"physical",MeshPhysicalMaterial:"physical",MeshMatcapMaterial:"matcap",LineBasicMaterial:"basic",LineDashedMaterial:"dashed",PointsMaterial:"points",ShadowMaterial:"shadow",SpriteMaterial:"sprite"};function _(E){return c.add(E),E===0?"uv":`uv${E}`}function p(E,x,w,k,O){const X=k.fog,Z=O.geometry,G=E.isMeshStandardMaterial?k.environment:null,$=(E.isMeshStandardMaterial?t:e).get(E.envMap||G),V=$&&$.mapping===ds?$.image.height:null,re=g[E.type];E.precision!==null&&(m=r.getMaxPrecision(E.precision),m!==E.precision&&console.warn("THREE.WebGLProgram.getParameters:",E.precision,"not supported, using",m,"instead."));const Q=Z.morphAttributes.position||Z.morphAttributes.normal||Z.morphAttributes.color,se=Q!==void 0?Q.length:0;let be=0;Z.morphAttributes.position!==void 0&&(be=1),Z.morphAttributes.normal!==void 0&&(be=2),Z.morphAttributes.color!==void 0&&(be=3);let ke,H,K,ue;if(re){const je=nn[re];ke=je.vertexShader,H=je.fragmentShader}else ke=E.vertexShader,H=E.fragmentShader,l.update(E),K=l.getVertexShaderID(E),ue=l.getFragmentShaderID(E);const ne=n.getRenderTarget(),Ee=n.state.buffers.depth.getReversed(),we=O.isInstancedMesh===!0,Ce=O.isBatchedMesh===!0,de=!!E.map,ae=!!E.matcap,Fe=!!$,C=!!E.aoMap,We=!!E.lightMap,Re=!!E.bumpMap,Pe=!!E.normalMap,_e=!!E.displacementMap,Ye=!!E.emissiveMap,xe=!!E.metalnessMap,A=!!E.roughnessMap,v=E.anisotropy>0,F=E.clearcoat>0,Y=E.dispersion>0,J=E.iridescence>0,q=E.sheen>0,ve=E.transmission>0,te=v&&!!E.anisotropyMap,le=F&&!!E.clearcoatMap,De=F&&!!E.clearcoatNormalMap,ee=F&&!!E.clearcoatRoughnessMap,ge=J&&!!E.iridescenceMap,Ae=J&&!!E.iridescenceThicknessMap,Le=q&&!!E.sheenColorMap,pe=q&&!!E.sheenRoughnessMap,He=!!E.specularMap,Ie=!!E.specularColorMap,Ke=!!E.specularIntensityMap,D=ve&&!!E.transmissionMap,ce=ve&&!!E.thicknessMap,W=!!E.gradientMap,j=!!E.alphaMap,me=E.alphaTest>0,he=!!E.alphaHash,Oe=!!E.extensions;let at=Bn;E.toneMapped&&(ne===null||ne.isXRRenderTarget===!0)&&(at=n.toneMapping);const _t={shaderID:re,shaderType:E.type,shaderName:E.name,vertexShader:ke,fragmentShader:H,defines:E.defines,customVertexShaderID:K,customFragmentShaderID:ue,isRawShaderMaterial:E.isRawShaderMaterial===!0,glslVersion:E.glslVersion,precision:m,batching:Ce,batchingColor:Ce&&O._colorsTexture!==null,instancing:we,instancingColor:we&&O.instanceColor!==null,instancingMorph:we&&O.morphTexture!==null,supportsVertexTextures:d,outputColorSpace:ne===null?n.outputColorSpace:ne.isXRRenderTarget===!0?ne.texture.colorSpace:Wi,alphaToCoverage:!!E.alphaToCoverage,map:de,matcap:ae,envMap:Fe,envMapMode:Fe&&$.mapping,envMapCubeUVHeight:V,aoMap:C,lightMap:We,bumpMap:Re,normalMap:Pe,displacementMap:d&&_e,emissiveMap:Ye,normalMapObjectSpace:Pe&&E.normalMapType===yu,normalMapTangentSpace:Pe&&E.normalMapType===Su,metalnessMap:xe,roughnessMap:A,anisotropy:v,anisotropyMap:te,clearcoat:F,clearcoatMap:le,clearcoatNormalMap:De,clearcoatRoughnessMap:ee,dispersion:Y,iridescence:J,iridescenceMap:ge,iridescenceThicknessMap:Ae,sheen:q,sheenColorMap:Le,sheenRoughnessMap:pe,specularMap:He,specularColorMap:Ie,specularIntensityMap:Ke,transmission:ve,transmissionMap:D,thicknessMap:ce,gradientMap:W,opaque:E.transparent===!1&&E.blending===Pi&&E.alphaToCoverage===!1,alphaMap:j,alphaTest:me,alphaHash:he,combine:E.combine,mapUv:de&&_(E.map.channel),aoMapUv:C&&_(E.aoMap.channel),lightMapUv:We&&_(E.lightMap.channel),bumpMapUv:Re&&_(E.bumpMap.channel),normalMapUv:Pe&&_(E.normalMap.channel),displacementMapUv:_e&&_(E.displacementMap.channel),emissiveMapUv:Ye&&_(E.emissiveMap.channel),metalnessMapUv:xe&&_(E.metalnessMap.channel),roughnessMapUv:A&&_(E.roughnessMap.channel),anisotropyMapUv:te&&_(E.anisotropyMap.channel),clearcoatMapUv:le&&_(E.clearcoatMap.channel),clearcoatNormalMapUv:De&&_(E.clearcoatNormalMap.channel),clearcoatRoughnessMapUv:ee&&_(E.clearcoatRoughnessMap.channel),iridescenceMapUv:ge&&_(E.iridescenceMap.channel),iridescenceThicknessMapUv:Ae&&_(E.iridescenceThicknessMap.channel),sheenColorMapUv:Le&&_(E.sheenColorMap.channel),sheenRoughnessMapUv:pe&&_(E.sheenRoughnessMap.channel),specularMapUv:He&&_(E.specularMap.channel),specularColorMapUv:Ie&&_(E.specularColorMap.channel),specularIntensityMapUv:Ke&&_(E.specularIntensityMap.channel),transmissionMapUv:D&&_(E.transmissionMap.channel),thicknessMapUv:ce&&_(E.thicknessMap.channel),alphaMapUv:j&&_(E.alphaMap.channel),vertexTangents:!!Z.attributes.tangent&&(Pe||v),vertexColors:E.vertexColors,vertexAlphas:E.vertexColors===!0&&!!Z.attributes.color&&Z.attributes.color.itemSize===4,pointsUvs:O.isPoints===!0&&!!Z.attributes.uv&&(de||j),fog:!!X,useFog:E.fog===!0,fogExp2:!!X&&X.isFogExp2,flatShading:E.flatShading===!0,sizeAttenuation:E.sizeAttenuation===!0,logarithmicDepthBuffer:f,reverseDepthBuffer:Ee,skinning:O.isSkinnedMesh===!0,morphTargets:Z.morphAttributes.position!==void 0,morphNormals:Z.morphAttributes.normal!==void 0,morphColors:Z.morphAttributes.color!==void 0,morphTargetsCount:se,morphTextureStride:be,numDirLights:x.directional.length,numPointLights:x.point.length,numSpotLights:x.spot.length,numSpotLightMaps:x.spotLightMap.length,numRectAreaLights:x.rectArea.length,numHemiLights:x.hemi.length,numDirLightShadows:x.directionalShadowMap.length,numPointLightShadows:x.pointShadowMap.length,numSpotLightShadows:x.spotShadowMap.length,numSpotLightShadowsWithMaps:x.numSpotLightShadowsWithMaps,numLightProbes:x.numLightProbes,numClippingPlanes:a.numPlanes,numClipIntersection:a.numIntersection,dithering:E.dithering,shadowMapEnabled:n.shadowMap.enabled&&w.length>0,shadowMapType:n.shadowMap.type,toneMapping:at,decodeVideoTexture:de&&E.map.isVideoTexture===!0&&Xe.getTransfer(E.map.colorSpace)===Qe,decodeVideoTextureEmissive:Ye&&E.emissiveMap.isVideoTexture===!0&&Xe.getTransfer(E.emissiveMap.colorSpace)===Qe,premultipliedAlpha:E.premultipliedAlpha,doubleSided:E.side===rn,flipSided:E.side===wt,useDepthPacking:E.depthPacking>=0,depthPacking:E.depthPacking||0,index0AttributeName:E.index0AttributeName,extensionClipCullDistance:Oe&&E.extensions.clipCullDistance===!0&&i.has("WEBGL_clip_cull_distance"),extensionMultiDraw:(Oe&&E.extensions.multiDraw===!0||Ce)&&i.has("WEBGL_multi_draw"),rendererExtensionParallelShaderCompile:i.has("KHR_parallel_shader_compile"),customProgramCacheKey:E.customProgramCacheKey()};return _t.vertexUv1s=c.has(1),_t.vertexUv2s=c.has(2),_t.vertexUv3s=c.has(3),c.clear(),_t}function h(E){const x=[];if(E.shaderID?x.push(E.shaderID):(x.push(E.customVertexShaderID),x.push(E.customFragmentShaderID)),E.defines!==void 0)for(const w in E.defines)x.push(w),x.push(E.defines[w]);return E.isRawShaderMaterial===!1&&(T(x,E),S(x,E),x.push(n.outputColorSpace)),x.push(E.customProgramCacheKey),x.join()}function T(E,x){E.push(x.precision),E.push(x.outputColorSpace),E.push(x.envMapMode),E.push(x.envMapCubeUVHeight),E.push(x.mapUv),E.push(x.alphaMapUv),E.push(x.lightMapUv),E.push(x.aoMapUv),E.push(x.bumpMapUv),E.push(x.normalMapUv),E.push(x.displacementMapUv),E.push(x.emissiveMapUv),E.push(x.metalnessMapUv),E.push(x.roughnessMapUv),E.push(x.anisotropyMapUv),E.push(x.clearcoatMapUv),E.push(x.clearcoatNormalMapUv),E.push(x.clearcoatRoughnessMapUv),E.push(x.iridescenceMapUv),E.push(x.iridescenceThicknessMapUv),E.push(x.sheenColorMapUv),E.push(x.sheenRoughnessMapUv),E.push(x.specularMapUv),E.push(x.specularColorMapUv),E.push(x.specularIntensityMapUv),E.push(x.transmissionMapUv),E.push(x.thicknessMapUv),E.push(x.combine),E.push(x.fogExp2),E.push(x.sizeAttenuation),E.push(x.morphTargetsCount),E.push(x.morphAttributeCount),E.push(x.numDirLights),E.push(x.numPointLights),E.push(x.numSpotLights),E.push(x.numSpotLightMaps),E.push(x.numHemiLights),E.push(x.numRectAreaLights),E.push(x.numDirLightShadows),E.push(x.numPointLightShadows),E.push(x.numSpotLightShadows),E.push(x.numSpotLightShadowsWithMaps),E.push(x.numLightProbes),E.push(x.shadowMapType),E.push(x.toneMapping),E.push(x.numClippingPlanes),E.push(x.numClipIntersection),E.push(x.depthPacking)}function S(E,x){o.disableAll(),x.supportsVertexTextures&&o.enable(0),x.instancing&&o.enable(1),x.instancingColor&&o.enable(2),x.instancingMorph&&o.enable(3),x.matcap&&o.enable(4),x.envMap&&o.enable(5),x.normalMapObjectSpace&&o.enable(6),x.normalMapTangentSpace&&o.enable(7),x.clearcoat&&o.enable(8),x.iridescence&&o.enable(9),x.alphaTest&&o.enable(10),x.vertexColors&&o.enable(11),x.vertexAlphas&&o.enable(12),x.vertexUv1s&&o.enable(13),x.vertexUv2s&&o.enable(14),x.vertexUv3s&&o.enable(15),x.vertexTangents&&o.enable(16),x.anisotropy&&o.enable(17),x.alphaHash&&o.enable(18),x.batching&&o.enable(19),x.dispersion&&o.enable(20),x.batchingColor&&o.enable(21),E.push(o.mask),o.disableAll(),x.fog&&o.enable(0),x.useFog&&o.enable(1),x.flatShading&&o.enable(2),x.logarithmicDepthBuffer&&o.enable(3),x.reverseDepthBuffer&&o.enable(4),x.skinning&&o.enable(5),x.morphTargets&&o.enable(6),x.morphNormals&&o.enable(7),x.morphColors&&o.enable(8),x.premultipliedAlpha&&o.enable(9),x.shadowMapEnabled&&o.enable(10),x.doubleSided&&o.enable(11),x.flipSided&&o.enable(12),x.useDepthPacking&&o.enable(13),x.dithering&&o.enable(14),x.transmission&&o.enable(15),x.sheen&&o.enable(16),x.opaque&&o.enable(17),x.pointsUvs&&o.enable(18),x.decodeVideoTexture&&o.enable(19),x.decodeVideoTextureEmissive&&o.enable(20),x.alphaToCoverage&&o.enable(21),E.push(o.mask)}function M(E){const x=g[E.type];let w;if(x){const k=nn[x];w=ju.clone(k.uniforms)}else w=E.uniforms;return w}function P(E,x){let w;for(let k=0,O=u.length;k<O;k++){const X=u[k];if(X.cacheKey===x){w=X,++w.usedTimes;break}}return w===void 0&&(w=new hm(n,x,E,s),u.push(w)),w}function b(E){if(--E.usedTimes===0){const x=u.indexOf(E);u[x]=u[u.length-1],u.pop(),E.destroy()}}function R(E){l.remove(E)}function L(){l.dispose()}return{getParameters:p,getProgramCacheKey:h,getUniforms:M,acquireProgram:P,releaseProgram:b,releaseShaderCache:R,programs:u,dispose:L}}function gm(){let n=new WeakMap;function e(a){return n.has(a)}function t(a){let o=n.get(a);return o===void 0&&(o={},n.set(a,o)),o}function i(a){n.delete(a)}function r(a,o,l){n.get(a)[o]=l}function s(){n=new WeakMap}return{has:e,get:t,remove:i,update:r,dispose:s}}function _m(n,e){return n.groupOrder!==e.groupOrder?n.groupOrder-e.groupOrder:n.renderOrder!==e.renderOrder?n.renderOrder-e.renderOrder:n.material.id!==e.material.id?n.material.id-e.material.id:n.z!==e.z?n.z-e.z:n.id-e.id}function dl(n,e){return n.groupOrder!==e.groupOrder?n.groupOrder-e.groupOrder:n.renderOrder!==e.renderOrder?n.renderOrder-e.renderOrder:n.z!==e.z?e.z-n.z:n.id-e.id}function pl(){const n=[];let e=0;const t=[],i=[],r=[];function s(){e=0,t.length=0,i.length=0,r.length=0}function a(f,d,m,g,_,p){let h=n[e];return h===void 0?(h={id:f.id,object:f,geometry:d,material:m,groupOrder:g,renderOrder:f.renderOrder,z:_,group:p},n[e]=h):(h.id=f.id,h.object=f,h.geometry=d,h.material=m,h.groupOrder=g,h.renderOrder=f.renderOrder,h.z=_,h.group=p),e++,h}function o(f,d,m,g,_,p){const h=a(f,d,m,g,_,p);m.transmission>0?i.push(h):m.transparent===!0?r.push(h):t.push(h)}function l(f,d,m,g,_,p){const h=a(f,d,m,g,_,p);m.transmission>0?i.unshift(h):m.transparent===!0?r.unshift(h):t.unshift(h)}function c(f,d){t.length>1&&t.sort(f||_m),i.length>1&&i.sort(d||dl),r.length>1&&r.sort(d||dl)}function u(){for(let f=e,d=n.length;f<d;f++){const m=n[f];if(m.id===null)break;m.id=null,m.object=null,m.geometry=null,m.material=null,m.group=null}}return{opaque:t,transmissive:i,transparent:r,init:s,push:o,unshift:l,finish:u,sort:c}}function vm(){let n=new WeakMap;function e(i,r){const s=n.get(i);let a;return s===void 0?(a=new pl,n.set(i,[a])):r>=s.length?(a=new pl,s.push(a)):a=s[r],a}function t(){n=new WeakMap}return{get:e,dispose:t}}function xm(){const n={};return{get:function(e){if(n[e.id]!==void 0)return n[e.id];let t;switch(e.type){case"DirectionalLight":t={direction:new N,color:new Je};break;case"SpotLight":t={position:new N,direction:new N,color:new Je,distance:0,coneCos:0,penumbraCos:0,decay:0};break;case"PointLight":t={position:new N,color:new Je,distance:0,decay:0};break;case"HemisphereLight":t={direction:new N,skyColor:new Je,groundColor:new Je};break;case"RectAreaLight":t={color:new Je,position:new N,halfWidth:new N,halfHeight:new N};break}return n[e.id]=t,t}}}function Mm(){const n={};return{get:function(e){if(n[e.id]!==void 0)return n[e.id];let t;switch(e.type){case"DirectionalLight":t={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new Ge};break;case"SpotLight":t={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new Ge};break;case"PointLight":t={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new Ge,shadowCameraNear:1,shadowCameraFar:1e3};break}return n[e.id]=t,t}}}let Sm=0;function ym(n,e){return(e.castShadow?2:0)-(n.castShadow?2:0)+(e.map?1:0)-(n.map?1:0)}function Em(n){const e=new xm,t=Mm(),i={version:0,hash:{directionalLength:-1,pointLength:-1,spotLength:-1,rectAreaLength:-1,hemiLength:-1,numDirectionalShadows:-1,numPointShadows:-1,numSpotShadows:-1,numSpotMaps:-1,numLightProbes:-1},ambient:[0,0,0],probe:[],directional:[],directionalShadow:[],directionalShadowMap:[],directionalShadowMatrix:[],spot:[],spotLightMap:[],spotShadow:[],spotShadowMap:[],spotLightMatrix:[],rectArea:[],rectAreaLTC1:null,rectAreaLTC2:null,point:[],pointShadow:[],pointShadowMap:[],pointShadowMatrix:[],hemi:[],numSpotLightShadowsWithMaps:0,numLightProbes:0};for(let c=0;c<9;c++)i.probe.push(new N);const r=new N,s=new st,a=new st;function o(c){let u=0,f=0,d=0;for(let E=0;E<9;E++)i.probe[E].set(0,0,0);let m=0,g=0,_=0,p=0,h=0,T=0,S=0,M=0,P=0,b=0,R=0;c.sort(ym);for(let E=0,x=c.length;E<x;E++){const w=c[E],k=w.color,O=w.intensity,X=w.distance,Z=w.shadow&&w.shadow.map?w.shadow.map.texture:null;if(w.isAmbientLight)u+=k.r*O,f+=k.g*O,d+=k.b*O;else if(w.isLightProbe){for(let G=0;G<9;G++)i.probe[G].addScaledVector(w.sh.coefficients[G],O);R++}else if(w.isDirectionalLight){const G=e.get(w);if(G.color.copy(w.color).multiplyScalar(w.intensity),w.castShadow){const $=w.shadow,V=t.get(w);V.shadowIntensity=$.intensity,V.shadowBias=$.bias,V.shadowNormalBias=$.normalBias,V.shadowRadius=$.radius,V.shadowMapSize=$.mapSize,i.directionalShadow[m]=V,i.directionalShadowMap[m]=Z,i.directionalShadowMatrix[m]=w.shadow.matrix,T++}i.directional[m]=G,m++}else if(w.isSpotLight){const G=e.get(w);G.position.setFromMatrixPosition(w.matrixWorld),G.color.copy(k).multiplyScalar(O),G.distance=X,G.coneCos=Math.cos(w.angle),G.penumbraCos=Math.cos(w.angle*(1-w.penumbra)),G.decay=w.decay,i.spot[_]=G;const $=w.shadow;if(w.map&&(i.spotLightMap[P]=w.map,P++,$.updateMatrices(w),w.castShadow&&b++),i.spotLightMatrix[_]=$.matrix,w.castShadow){const V=t.get(w);V.shadowIntensity=$.intensity,V.shadowBias=$.bias,V.shadowNormalBias=$.normalBias,V.shadowRadius=$.radius,V.shadowMapSize=$.mapSize,i.spotShadow[_]=V,i.spotShadowMap[_]=Z,M++}_++}else if(w.isRectAreaLight){const G=e.get(w);G.color.copy(k).multiplyScalar(O),G.halfWidth.set(w.width*.5,0,0),G.halfHeight.set(0,w.height*.5,0),i.rectArea[p]=G,p++}else if(w.isPointLight){const G=e.get(w);if(G.color.copy(w.color).multiplyScalar(w.intensity),G.distance=w.distance,G.decay=w.decay,w.castShadow){const $=w.shadow,V=t.get(w);V.shadowIntensity=$.intensity,V.shadowBias=$.bias,V.shadowNormalBias=$.normalBias,V.shadowRadius=$.radius,V.shadowMapSize=$.mapSize,V.shadowCameraNear=$.camera.near,V.shadowCameraFar=$.camera.far,i.pointShadow[g]=V,i.pointShadowMap[g]=Z,i.pointShadowMatrix[g]=w.shadow.matrix,S++}i.point[g]=G,g++}else if(w.isHemisphereLight){const G=e.get(w);G.skyColor.copy(w.color).multiplyScalar(O),G.groundColor.copy(w.groundColor).multiplyScalar(O),i.hemi[h]=G,h++}}p>0&&(n.has("OES_texture_float_linear")===!0?(i.rectAreaLTC1=oe.LTC_FLOAT_1,i.rectAreaLTC2=oe.LTC_FLOAT_2):(i.rectAreaLTC1=oe.LTC_HALF_1,i.rectAreaLTC2=oe.LTC_HALF_2)),i.ambient[0]=u,i.ambient[1]=f,i.ambient[2]=d;const L=i.hash;(L.directionalLength!==m||L.pointLength!==g||L.spotLength!==_||L.rectAreaLength!==p||L.hemiLength!==h||L.numDirectionalShadows!==T||L.numPointShadows!==S||L.numSpotShadows!==M||L.numSpotMaps!==P||L.numLightProbes!==R)&&(i.directional.length=m,i.spot.length=_,i.rectArea.length=p,i.point.length=g,i.hemi.length=h,i.directionalShadow.length=T,i.directionalShadowMap.length=T,i.pointShadow.length=S,i.pointShadowMap.length=S,i.spotShadow.length=M,i.spotShadowMap.length=M,i.directionalShadowMatrix.length=T,i.pointShadowMatrix.length=S,i.spotLightMatrix.length=M+P-b,i.spotLightMap.length=P,i.numSpotLightShadowsWithMaps=b,i.numLightProbes=R,L.directionalLength=m,L.pointLength=g,L.spotLength=_,L.rectAreaLength=p,L.hemiLength=h,L.numDirectionalShadows=T,L.numPointShadows=S,L.numSpotShadows=M,L.numSpotMaps=P,L.numLightProbes=R,i.version=Sm++)}function l(c,u){let f=0,d=0,m=0,g=0,_=0;const p=u.matrixWorldInverse;for(let h=0,T=c.length;h<T;h++){const S=c[h];if(S.isDirectionalLight){const M=i.directional[f];M.direction.setFromMatrixPosition(S.matrixWorld),r.setFromMatrixPosition(S.target.matrixWorld),M.direction.sub(r),M.direction.transformDirection(p),f++}else if(S.isSpotLight){const M=i.spot[m];M.position.setFromMatrixPosition(S.matrixWorld),M.position.applyMatrix4(p),M.direction.setFromMatrixPosition(S.matrixWorld),r.setFromMatrixPosition(S.target.matrixWorld),M.direction.sub(r),M.direction.transformDirection(p),m++}else if(S.isRectAreaLight){const M=i.rectArea[g];M.position.setFromMatrixPosition(S.matrixWorld),M.position.applyMatrix4(p),a.identity(),s.copy(S.matrixWorld),s.premultiply(p),a.extractRotation(s),M.halfWidth.set(S.width*.5,0,0),M.halfHeight.set(0,S.height*.5,0),M.halfWidth.applyMatrix4(a),M.halfHeight.applyMatrix4(a),g++}else if(S.isPointLight){const M=i.point[d];M.position.setFromMatrixPosition(S.matrixWorld),M.position.applyMatrix4(p),d++}else if(S.isHemisphereLight){const M=i.hemi[_];M.direction.setFromMatrixPosition(S.matrixWorld),M.direction.transformDirection(p),_++}}}return{setup:o,setupView:l,state:i}}function ml(n){const e=new Em(n),t=[],i=[];function r(u){c.camera=u,t.length=0,i.length=0}function s(u){t.push(u)}function a(u){i.push(u)}function o(){e.setup(t)}function l(u){e.setupView(t,u)}const c={lightsArray:t,shadowsArray:i,camera:null,lights:e,transmissionRenderTarget:{}};return{init:r,state:c,setupLights:o,setupLightsView:l,pushLight:s,pushShadow:a}}function Tm(n){let e=new WeakMap;function t(r,s=0){const a=e.get(r);let o;return a===void 0?(o=new ml(n),e.set(r,[o])):s>=a.length?(o=new ml(n),a.push(o)):o=a[s],o}function i(){e=new WeakMap}return{get:t,dispose:i}}class Am extends vr{static get type(){return"MeshDepthMaterial"}constructor(e){super(),this.isMeshDepthMaterial=!0,this.depthPacking=xu,this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.wireframe=!1,this.wireframeLinewidth=1,this.setValues(e)}copy(e){return super.copy(e),this.depthPacking=e.depthPacking,this.map=e.map,this.alphaMap=e.alphaMap,this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this}}class bm extends vr{static get type(){return"MeshDistanceMaterial"}constructor(e){super(),this.isMeshDistanceMaterial=!0,this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.setValues(e)}copy(e){return super.copy(e),this.map=e.map,this.alphaMap=e.alphaMap,this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this}}const wm=`void main() {
	gl_Position = vec4( position, 1.0 );
}`,Rm=`uniform sampler2D shadow_pass;
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
}`;function Cm(n,e,t){let i=new ic;const r=new Ge,s=new Ge,a=new tt,o=new Am({depthPacking:Mu}),l=new bm,c={},u=t.maxTextureSize,f={[kn]:wt,[wt]:kn,[rn]:rn},d=new bt({defines:{VSM_SAMPLES:8},uniforms:{shadow_pass:{value:null},resolution:{value:new Ge},radius:{value:4}},vertexShader:wm,fragmentShader:Rm}),m=d.clone();m.defines.HORIZONTAL_PASS=1;const g=new Qt;g.setAttribute("position",new ut(new Float32Array([-1,-1,.5,3,-1,.5,-1,3,.5]),3));const _=new kt(g,d),p=this;this.enabled=!1,this.autoUpdate=!0,this.needsUpdate=!1,this.type=Dl;let h=this.type;this.render=function(b,R,L){if(p.enabled===!1||p.autoUpdate===!1&&p.needsUpdate===!1||b.length===0)return;const E=n.getRenderTarget(),x=n.getActiveCubeFace(),w=n.getActiveMipmapLevel(),k=n.state;k.setBlending(On),k.buffers.color.setClear(1,1,1,1),k.buffers.depth.setTest(!0),k.setScissorTest(!1);const O=h!==mn&&this.type===mn,X=h===mn&&this.type!==mn;for(let Z=0,G=b.length;Z<G;Z++){const $=b[Z],V=$.shadow;if(V===void 0){console.warn("THREE.WebGLShadowMap:",$,"has no shadow.");continue}if(V.autoUpdate===!1&&V.needsUpdate===!1)continue;r.copy(V.mapSize);const re=V.getFrameExtents();if(r.multiply(re),s.copy(V.mapSize),(r.x>u||r.y>u)&&(r.x>u&&(s.x=Math.floor(u/re.x),r.x=s.x*re.x,V.mapSize.x=s.x),r.y>u&&(s.y=Math.floor(u/re.y),r.y=s.y*re.y,V.mapSize.y=s.y)),V.map===null||O===!0||X===!0){const se=this.type!==mn?{minFilter:ft,magFilter:ft}:{};V.map!==null&&V.map.dispose(),V.map=new Sn(r.x,r.y,se),V.map.texture.name=$.name+".shadowMap",V.camera.updateProjectionMatrix()}n.setRenderTarget(V.map),n.clear();const Q=V.getViewportCount();for(let se=0;se<Q;se++){const be=V.getViewport(se);a.set(s.x*be.x,s.y*be.y,s.x*be.z,s.y*be.w),k.viewport(a),V.updateMatrices($,se),i=V.getFrustum(),M(R,L,V.camera,$,this.type)}V.isPointLightShadow!==!0&&this.type===mn&&T(V,L),V.needsUpdate=!1}h=this.type,p.needsUpdate=!1,n.setRenderTarget(E,x,w)};function T(b,R){const L=e.update(_);d.defines.VSM_SAMPLES!==b.blurSamples&&(d.defines.VSM_SAMPLES=b.blurSamples,m.defines.VSM_SAMPLES=b.blurSamples,d.needsUpdate=!0,m.needsUpdate=!0),b.mapPass===null&&(b.mapPass=new Sn(r.x,r.y)),d.uniforms.shadow_pass.value=b.map.texture,d.uniforms.resolution.value=b.mapSize,d.uniforms.radius.value=b.radius,n.setRenderTarget(b.mapPass),n.clear(),n.renderBufferDirect(R,null,L,d,_,null),m.uniforms.shadow_pass.value=b.mapPass.texture,m.uniforms.resolution.value=b.mapSize,m.uniforms.radius.value=b.radius,n.setRenderTarget(b.map),n.clear(),n.renderBufferDirect(R,null,L,m,_,null)}function S(b,R,L,E){let x=null;const w=L.isPointLight===!0?b.customDistanceMaterial:b.customDepthMaterial;if(w!==void 0)x=w;else if(x=L.isPointLight===!0?l:o,n.localClippingEnabled&&R.clipShadows===!0&&Array.isArray(R.clippingPlanes)&&R.clippingPlanes.length!==0||R.displacementMap&&R.displacementScale!==0||R.alphaMap&&R.alphaTest>0||R.map&&R.alphaTest>0){const k=x.uuid,O=R.uuid;let X=c[k];X===void 0&&(X={},c[k]=X);let Z=X[O];Z===void 0&&(Z=x.clone(),X[O]=Z,R.addEventListener("dispose",P)),x=Z}if(x.visible=R.visible,x.wireframe=R.wireframe,E===mn?x.side=R.shadowSide!==null?R.shadowSide:R.side:x.side=R.shadowSide!==null?R.shadowSide:f[R.side],x.alphaMap=R.alphaMap,x.alphaTest=R.alphaTest,x.map=R.map,x.clipShadows=R.clipShadows,x.clippingPlanes=R.clippingPlanes,x.clipIntersection=R.clipIntersection,x.displacementMap=R.displacementMap,x.displacementScale=R.displacementScale,x.displacementBias=R.displacementBias,x.wireframeLinewidth=R.wireframeLinewidth,x.linewidth=R.linewidth,L.isPointLight===!0&&x.isMeshDistanceMaterial===!0){const k=n.properties.get(x);k.light=L}return x}function M(b,R,L,E,x){if(b.visible===!1)return;if(b.layers.test(R.layers)&&(b.isMesh||b.isLine||b.isPoints)&&(b.castShadow||b.receiveShadow&&x===mn)&&(!b.frustumCulled||i.intersectsObject(b))){b.modelViewMatrix.multiplyMatrices(L.matrixWorldInverse,b.matrixWorld);const O=e.update(b),X=b.material;if(Array.isArray(X)){const Z=O.groups;for(let G=0,$=Z.length;G<$;G++){const V=Z[G],re=X[V.materialIndex];if(re&&re.visible){const Q=S(b,re,E,x);b.onBeforeShadow(n,b,R,L,O,Q,V),n.renderBufferDirect(L,null,O,Q,b,V),b.onAfterShadow(n,b,R,L,O,Q,V)}}}else if(X.visible){const Z=S(b,X,E,x);b.onBeforeShadow(n,b,R,L,O,Z,null),n.renderBufferDirect(L,null,O,Z,b,null),b.onAfterShadow(n,b,R,L,O,Z,null)}}const k=b.children;for(let O=0,X=k.length;O<X;O++)M(k[O],R,L,E,x)}function P(b){b.target.removeEventListener("dispose",P);for(const L in c){const E=c[L],x=b.target.uuid;x in E&&(E[x].dispose(),delete E[x])}}}const Pm={[aa]:oa,[la]:ha,[ca]:fa,[Ui]:ua,[oa]:aa,[ha]:la,[fa]:ca,[ua]:Ui};function Dm(n,e){function t(){let D=!1;const ce=new tt;let W=null;const j=new tt(0,0,0,0);return{setMask:function(me){W!==me&&!D&&(n.colorMask(me,me,me,me),W=me)},setLocked:function(me){D=me},setClear:function(me,he,Oe,at,_t){_t===!0&&(me*=at,he*=at,Oe*=at),ce.set(me,he,Oe,at),j.equals(ce)===!1&&(n.clearColor(me,he,Oe,at),j.copy(ce))},reset:function(){D=!1,W=null,j.set(-1,0,0,0)}}}function i(){let D=!1,ce=!1,W=null,j=null,me=null;return{setReversed:function(he){if(ce!==he){const Oe=e.get("EXT_clip_control");ce?Oe.clipControlEXT(Oe.LOWER_LEFT_EXT,Oe.ZERO_TO_ONE_EXT):Oe.clipControlEXT(Oe.LOWER_LEFT_EXT,Oe.NEGATIVE_ONE_TO_ONE_EXT);const at=me;me=null,this.setClear(at)}ce=he},getReversed:function(){return ce},setTest:function(he){he?ne(n.DEPTH_TEST):Ee(n.DEPTH_TEST)},setMask:function(he){W!==he&&!D&&(n.depthMask(he),W=he)},setFunc:function(he){if(ce&&(he=Pm[he]),j!==he){switch(he){case aa:n.depthFunc(n.NEVER);break;case oa:n.depthFunc(n.ALWAYS);break;case la:n.depthFunc(n.LESS);break;case Ui:n.depthFunc(n.LEQUAL);break;case ca:n.depthFunc(n.EQUAL);break;case ua:n.depthFunc(n.GEQUAL);break;case ha:n.depthFunc(n.GREATER);break;case fa:n.depthFunc(n.NOTEQUAL);break;default:n.depthFunc(n.LEQUAL)}j=he}},setLocked:function(he){D=he},setClear:function(he){me!==he&&(ce&&(he=1-he),n.clearDepth(he),me=he)},reset:function(){D=!1,W=null,j=null,me=null,ce=!1}}}function r(){let D=!1,ce=null,W=null,j=null,me=null,he=null,Oe=null,at=null,_t=null;return{setTest:function(je){D||(je?ne(n.STENCIL_TEST):Ee(n.STENCIL_TEST))},setMask:function(je){ce!==je&&!D&&(n.stencilMask(je),ce=je)},setFunc:function(je,Vt,ln){(W!==je||j!==Vt||me!==ln)&&(n.stencilFunc(je,Vt,ln),W=je,j=Vt,me=ln)},setOp:function(je,Vt,ln){(he!==je||Oe!==Vt||at!==ln)&&(n.stencilOp(je,Vt,ln),he=je,Oe=Vt,at=ln)},setLocked:function(je){D=je},setClear:function(je){_t!==je&&(n.clearStencil(je),_t=je)},reset:function(){D=!1,ce=null,W=null,j=null,me=null,he=null,Oe=null,at=null,_t=null}}}const s=new t,a=new i,o=new r,l=new WeakMap,c=new WeakMap;let u={},f={},d=new WeakMap,m=[],g=null,_=!1,p=null,h=null,T=null,S=null,M=null,P=null,b=null,R=new Je(0,0,0),L=0,E=!1,x=null,w=null,k=null,O=null,X=null;const Z=n.getParameter(n.MAX_COMBINED_TEXTURE_IMAGE_UNITS);let G=!1,$=0;const V=n.getParameter(n.VERSION);V.indexOf("WebGL")!==-1?($=parseFloat(/^WebGL (\d)/.exec(V)[1]),G=$>=1):V.indexOf("OpenGL ES")!==-1&&($=parseFloat(/^OpenGL ES (\d)/.exec(V)[1]),G=$>=2);let re=null,Q={};const se=n.getParameter(n.SCISSOR_BOX),be=n.getParameter(n.VIEWPORT),ke=new tt().fromArray(se),H=new tt().fromArray(be);function K(D,ce,W,j){const me=new Uint8Array(4),he=n.createTexture();n.bindTexture(D,he),n.texParameteri(D,n.TEXTURE_MIN_FILTER,n.NEAREST),n.texParameteri(D,n.TEXTURE_MAG_FILTER,n.NEAREST);for(let Oe=0;Oe<W;Oe++)D===n.TEXTURE_3D||D===n.TEXTURE_2D_ARRAY?n.texImage3D(ce,0,n.RGBA,1,1,j,0,n.RGBA,n.UNSIGNED_BYTE,me):n.texImage2D(ce+Oe,0,n.RGBA,1,1,0,n.RGBA,n.UNSIGNED_BYTE,me);return he}const ue={};ue[n.TEXTURE_2D]=K(n.TEXTURE_2D,n.TEXTURE_2D,1),ue[n.TEXTURE_CUBE_MAP]=K(n.TEXTURE_CUBE_MAP,n.TEXTURE_CUBE_MAP_POSITIVE_X,6),ue[n.TEXTURE_2D_ARRAY]=K(n.TEXTURE_2D_ARRAY,n.TEXTURE_2D_ARRAY,1,1),ue[n.TEXTURE_3D]=K(n.TEXTURE_3D,n.TEXTURE_3D,1,1),s.setClear(0,0,0,1),a.setClear(1),o.setClear(0),ne(n.DEPTH_TEST),a.setFunc(Ui),Re(!1),Pe(Mo),ne(n.CULL_FACE),C(On);function ne(D){u[D]!==!0&&(n.enable(D),u[D]=!0)}function Ee(D){u[D]!==!1&&(n.disable(D),u[D]=!1)}function we(D,ce){return f[D]!==ce?(n.bindFramebuffer(D,ce),f[D]=ce,D===n.DRAW_FRAMEBUFFER&&(f[n.FRAMEBUFFER]=ce),D===n.FRAMEBUFFER&&(f[n.DRAW_FRAMEBUFFER]=ce),!0):!1}function Ce(D,ce){let W=m,j=!1;if(D){W=d.get(ce),W===void 0&&(W=[],d.set(ce,W));const me=D.textures;if(W.length!==me.length||W[0]!==n.COLOR_ATTACHMENT0){for(let he=0,Oe=me.length;he<Oe;he++)W[he]=n.COLOR_ATTACHMENT0+he;W.length=me.length,j=!0}}else W[0]!==n.BACK&&(W[0]=n.BACK,j=!0);j&&n.drawBuffers(W)}function de(D){return g!==D?(n.useProgram(D),g=D,!0):!1}const ae={[Qn]:n.FUNC_ADD,[Yc]:n.FUNC_SUBTRACT,[Kc]:n.FUNC_REVERSE_SUBTRACT};ae[$c]=n.MIN,ae[Zc]=n.MAX;const Fe={[jc]:n.ZERO,[ur]:n.ONE,[Jc]:n.SRC_COLOR,[sa]:n.SRC_ALPHA,[ru]:n.SRC_ALPHA_SATURATE,[nu]:n.DST_COLOR,[eu]:n.DST_ALPHA,[Qc]:n.ONE_MINUS_SRC_COLOR,[li]:n.ONE_MINUS_SRC_ALPHA,[iu]:n.ONE_MINUS_DST_COLOR,[tu]:n.ONE_MINUS_DST_ALPHA,[su]:n.CONSTANT_COLOR,[au]:n.ONE_MINUS_CONSTANT_COLOR,[ou]:n.CONSTANT_ALPHA,[lu]:n.ONE_MINUS_CONSTANT_ALPHA};function C(D,ce,W,j,me,he,Oe,at,_t,je){if(D===On){_===!0&&(Ee(n.BLEND),_=!1);return}if(_===!1&&(ne(n.BLEND),_=!0),D!==cr){if(D!==p||je!==E){if((h!==Qn||M!==Qn)&&(n.blendEquation(n.FUNC_ADD),h=Qn,M=Qn),je)switch(D){case Pi:n.blendFuncSeparate(n.ONE,n.ONE_MINUS_SRC_ALPHA,n.ONE,n.ONE_MINUS_SRC_ALPHA);break;case So:n.blendFunc(n.ONE,n.ONE);break;case yo:n.blendFuncSeparate(n.ZERO,n.ONE_MINUS_SRC_COLOR,n.ZERO,n.ONE);break;case Eo:n.blendFuncSeparate(n.ZERO,n.SRC_COLOR,n.ZERO,n.SRC_ALPHA);break;default:console.error("THREE.WebGLState: Invalid blending: ",D);break}else switch(D){case Pi:n.blendFuncSeparate(n.SRC_ALPHA,n.ONE_MINUS_SRC_ALPHA,n.ONE,n.ONE_MINUS_SRC_ALPHA);break;case So:n.blendFunc(n.SRC_ALPHA,n.ONE);break;case yo:n.blendFuncSeparate(n.ZERO,n.ONE_MINUS_SRC_COLOR,n.ZERO,n.ONE);break;case Eo:n.blendFunc(n.ZERO,n.SRC_COLOR);break;default:console.error("THREE.WebGLState: Invalid blending: ",D);break}T=null,S=null,P=null,b=null,R.set(0,0,0),L=0,p=D,E=je}return}me=me||ce,he=he||W,Oe=Oe||j,(ce!==h||me!==M)&&(n.blendEquationSeparate(ae[ce],ae[me]),h=ce,M=me),(W!==T||j!==S||he!==P||Oe!==b)&&(n.blendFuncSeparate(Fe[W],Fe[j],Fe[he],Fe[Oe]),T=W,S=j,P=he,b=Oe),(at.equals(R)===!1||_t!==L)&&(n.blendColor(at.r,at.g,at.b,_t),R.copy(at),L=_t),p=D,E=!1}function We(D,ce){D.side===rn?Ee(n.CULL_FACE):ne(n.CULL_FACE);let W=D.side===wt;ce&&(W=!W),Re(W),D.blending===Pi&&D.transparent===!1?C(On):C(D.blending,D.blendEquation,D.blendSrc,D.blendDst,D.blendEquationAlpha,D.blendSrcAlpha,D.blendDstAlpha,D.blendColor,D.blendAlpha,D.premultipliedAlpha),a.setFunc(D.depthFunc),a.setTest(D.depthTest),a.setMask(D.depthWrite),s.setMask(D.colorWrite);const j=D.stencilWrite;o.setTest(j),j&&(o.setMask(D.stencilWriteMask),o.setFunc(D.stencilFunc,D.stencilRef,D.stencilFuncMask),o.setOp(D.stencilFail,D.stencilZFail,D.stencilZPass)),Ye(D.polygonOffset,D.polygonOffsetFactor,D.polygonOffsetUnits),D.alphaToCoverage===!0?ne(n.SAMPLE_ALPHA_TO_COVERAGE):Ee(n.SAMPLE_ALPHA_TO_COVERAGE)}function Re(D){x!==D&&(D?n.frontFace(n.CW):n.frontFace(n.CCW),x=D)}function Pe(D){D!==Wc?(ne(n.CULL_FACE),D!==w&&(D===Mo?n.cullFace(n.BACK):D===Xc?n.cullFace(n.FRONT):n.cullFace(n.FRONT_AND_BACK))):Ee(n.CULL_FACE),w=D}function _e(D){D!==k&&(G&&n.lineWidth(D),k=D)}function Ye(D,ce,W){D?(ne(n.POLYGON_OFFSET_FILL),(O!==ce||X!==W)&&(n.polygonOffset(ce,W),O=ce,X=W)):Ee(n.POLYGON_OFFSET_FILL)}function xe(D){D?ne(n.SCISSOR_TEST):Ee(n.SCISSOR_TEST)}function A(D){D===void 0&&(D=n.TEXTURE0+Z-1),re!==D&&(n.activeTexture(D),re=D)}function v(D,ce,W){W===void 0&&(re===null?W=n.TEXTURE0+Z-1:W=re);let j=Q[W];j===void 0&&(j={type:void 0,texture:void 0},Q[W]=j),(j.type!==D||j.texture!==ce)&&(re!==W&&(n.activeTexture(W),re=W),n.bindTexture(D,ce||ue[D]),j.type=D,j.texture=ce)}function F(){const D=Q[re];D!==void 0&&D.type!==void 0&&(n.bindTexture(D.type,null),D.type=void 0,D.texture=void 0)}function Y(){try{n.compressedTexImage2D.apply(n,arguments)}catch(D){console.error("THREE.WebGLState:",D)}}function J(){try{n.compressedTexImage3D.apply(n,arguments)}catch(D){console.error("THREE.WebGLState:",D)}}function q(){try{n.texSubImage2D.apply(n,arguments)}catch(D){console.error("THREE.WebGLState:",D)}}function ve(){try{n.texSubImage3D.apply(n,arguments)}catch(D){console.error("THREE.WebGLState:",D)}}function te(){try{n.compressedTexSubImage2D.apply(n,arguments)}catch(D){console.error("THREE.WebGLState:",D)}}function le(){try{n.compressedTexSubImage3D.apply(n,arguments)}catch(D){console.error("THREE.WebGLState:",D)}}function De(){try{n.texStorage2D.apply(n,arguments)}catch(D){console.error("THREE.WebGLState:",D)}}function ee(){try{n.texStorage3D.apply(n,arguments)}catch(D){console.error("THREE.WebGLState:",D)}}function ge(){try{n.texImage2D.apply(n,arguments)}catch(D){console.error("THREE.WebGLState:",D)}}function Ae(){try{n.texImage3D.apply(n,arguments)}catch(D){console.error("THREE.WebGLState:",D)}}function Le(D){ke.equals(D)===!1&&(n.scissor(D.x,D.y,D.z,D.w),ke.copy(D))}function pe(D){H.equals(D)===!1&&(n.viewport(D.x,D.y,D.z,D.w),H.copy(D))}function He(D,ce){let W=c.get(ce);W===void 0&&(W=new WeakMap,c.set(ce,W));let j=W.get(D);j===void 0&&(j=n.getUniformBlockIndex(ce,D.name),W.set(D,j))}function Ie(D,ce){const j=c.get(ce).get(D);l.get(ce)!==j&&(n.uniformBlockBinding(ce,j,D.__bindingPointIndex),l.set(ce,j))}function Ke(){n.disable(n.BLEND),n.disable(n.CULL_FACE),n.disable(n.DEPTH_TEST),n.disable(n.POLYGON_OFFSET_FILL),n.disable(n.SCISSOR_TEST),n.disable(n.STENCIL_TEST),n.disable(n.SAMPLE_ALPHA_TO_COVERAGE),n.blendEquation(n.FUNC_ADD),n.blendFunc(n.ONE,n.ZERO),n.blendFuncSeparate(n.ONE,n.ZERO,n.ONE,n.ZERO),n.blendColor(0,0,0,0),n.colorMask(!0,!0,!0,!0),n.clearColor(0,0,0,0),n.depthMask(!0),n.depthFunc(n.LESS),a.setReversed(!1),n.clearDepth(1),n.stencilMask(4294967295),n.stencilFunc(n.ALWAYS,0,4294967295),n.stencilOp(n.KEEP,n.KEEP,n.KEEP),n.clearStencil(0),n.cullFace(n.BACK),n.frontFace(n.CCW),n.polygonOffset(0,0),n.activeTexture(n.TEXTURE0),n.bindFramebuffer(n.FRAMEBUFFER,null),n.bindFramebuffer(n.DRAW_FRAMEBUFFER,null),n.bindFramebuffer(n.READ_FRAMEBUFFER,null),n.useProgram(null),n.lineWidth(1),n.scissor(0,0,n.canvas.width,n.canvas.height),n.viewport(0,0,n.canvas.width,n.canvas.height),u={},re=null,Q={},f={},d=new WeakMap,m=[],g=null,_=!1,p=null,h=null,T=null,S=null,M=null,P=null,b=null,R=new Je(0,0,0),L=0,E=!1,x=null,w=null,k=null,O=null,X=null,ke.set(0,0,n.canvas.width,n.canvas.height),H.set(0,0,n.canvas.width,n.canvas.height),s.reset(),a.reset(),o.reset()}return{buffers:{color:s,depth:a,stencil:o},enable:ne,disable:Ee,bindFramebuffer:we,drawBuffers:Ce,useProgram:de,setBlending:C,setMaterial:We,setFlipSided:Re,setCullFace:Pe,setLineWidth:_e,setPolygonOffset:Ye,setScissorTest:xe,activeTexture:A,bindTexture:v,unbindTexture:F,compressedTexImage2D:Y,compressedTexImage3D:J,texImage2D:ge,texImage3D:Ae,updateUBOMapping:He,uniformBlockBinding:Ie,texStorage2D:De,texStorage3D:ee,texSubImage2D:q,texSubImage3D:ve,compressedTexSubImage2D:te,compressedTexSubImage3D:le,scissor:Le,viewport:pe,reset:Ke}}function gl(n,e,t,i){const r=Lm(i);switch(t){case Ol:return n*e;case zl:return n*e;case kl:return n*e*2;case Gl:return n*e/r.components*r.byteLength;case to:return n*e/r.components*r.byteLength;case Hl:return n*e*2/r.components*r.byteLength;case no:return n*e*2/r.components*r.byteLength;case Bl:return n*e*3/r.components*r.byteLength;case zt:return n*e*4/r.components*r.byteLength;case io:return n*e*4/r.components*r.byteLength;case jr:case Jr:return Math.floor((n+3)/4)*Math.floor((e+3)/4)*8;case Qr:case es:return Math.floor((n+3)/4)*Math.floor((e+3)/4)*16;case va:case Ma:return Math.max(n,16)*Math.max(e,8)/4;case _a:case xa:return Math.max(n,8)*Math.max(e,8)/2;case Sa:case ya:return Math.floor((n+3)/4)*Math.floor((e+3)/4)*8;case Ea:return Math.floor((n+3)/4)*Math.floor((e+3)/4)*16;case Ta:return Math.floor((n+3)/4)*Math.floor((e+3)/4)*16;case Aa:return Math.floor((n+4)/5)*Math.floor((e+3)/4)*16;case ba:return Math.floor((n+4)/5)*Math.floor((e+4)/5)*16;case wa:return Math.floor((n+5)/6)*Math.floor((e+4)/5)*16;case Ra:return Math.floor((n+5)/6)*Math.floor((e+5)/6)*16;case Ca:return Math.floor((n+7)/8)*Math.floor((e+4)/5)*16;case Pa:return Math.floor((n+7)/8)*Math.floor((e+5)/6)*16;case Da:return Math.floor((n+7)/8)*Math.floor((e+7)/8)*16;case La:return Math.floor((n+9)/10)*Math.floor((e+4)/5)*16;case Ia:return Math.floor((n+9)/10)*Math.floor((e+5)/6)*16;case Ua:return Math.floor((n+9)/10)*Math.floor((e+7)/8)*16;case Na:return Math.floor((n+9)/10)*Math.floor((e+9)/10)*16;case Fa:return Math.floor((n+11)/12)*Math.floor((e+9)/10)*16;case Oa:return Math.floor((n+11)/12)*Math.floor((e+11)/12)*16;case ts:case Ba:case za:return Math.ceil(n/4)*Math.ceil(e/4)*16;case Vl:case ka:return Math.ceil(n/4)*Math.ceil(e/4)*8;case Ga:case Ha:return Math.ceil(n/4)*Math.ceil(e/4)*16}throw new Error(`Unable to determine texture byte length for ${t} format.`)}function Lm(n){switch(n){case Jt:case Ul:return{byteLength:1,components:1};case hr:case Nl:case mr:return{byteLength:2,components:1};case Qa:case eo:return{byteLength:2,components:4};case ci:case Ja:case an:return{byteLength:4,components:1};case Fl:return{byteLength:4,components:3}}throw new Error(`Unknown texture type ${n}.`)}function Im(n,e,t,i,r,s,a){const o=e.has("WEBGL_multisampled_render_to_texture")?e.get("WEBGL_multisampled_render_to_texture"):null,l=typeof navigator>"u"?!1:/OculusBrowser/g.test(navigator.userAgent),c=new Ge,u=new WeakMap;let f;const d=new WeakMap;let m=!1;try{m=typeof OffscreenCanvas<"u"&&new OffscreenCanvas(1,1).getContext("2d")!==null}catch{}function g(A,v){return m?new OffscreenCanvas(A,v):os("canvas")}function _(A,v,F){let Y=1;const J=xe(A);if((J.width>F||J.height>F)&&(Y=F/Math.max(J.width,J.height)),Y<1)if(typeof HTMLImageElement<"u"&&A instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&A instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&A instanceof ImageBitmap||typeof VideoFrame<"u"&&A instanceof VideoFrame){const q=Math.floor(Y*J.width),ve=Math.floor(Y*J.height);f===void 0&&(f=g(q,ve));const te=v?g(q,ve):f;return te.width=q,te.height=ve,te.getContext("2d").drawImage(A,0,0,q,ve),console.warn("THREE.WebGLRenderer: Texture has been resized from ("+J.width+"x"+J.height+") to ("+q+"x"+ve+")."),te}else return"data"in A&&console.warn("THREE.WebGLRenderer: Image in DataTexture is too big ("+J.width+"x"+J.height+")."),A;return A}function p(A){return A.generateMipmaps}function h(A){n.generateMipmap(A)}function T(A){return A.isWebGLCubeRenderTarget?n.TEXTURE_CUBE_MAP:A.isWebGL3DRenderTarget?n.TEXTURE_3D:A.isWebGLArrayRenderTarget||A.isCompressedArrayTexture?n.TEXTURE_2D_ARRAY:n.TEXTURE_2D}function S(A,v,F,Y,J=!1){if(A!==null){if(n[A]!==void 0)return n[A];console.warn("THREE.WebGLRenderer: Attempt to use non-existing WebGL internal format '"+A+"'")}let q=v;if(v===n.RED&&(F===n.FLOAT&&(q=n.R32F),F===n.HALF_FLOAT&&(q=n.R16F),F===n.UNSIGNED_BYTE&&(q=n.R8)),v===n.RED_INTEGER&&(F===n.UNSIGNED_BYTE&&(q=n.R8UI),F===n.UNSIGNED_SHORT&&(q=n.R16UI),F===n.UNSIGNED_INT&&(q=n.R32UI),F===n.BYTE&&(q=n.R8I),F===n.SHORT&&(q=n.R16I),F===n.INT&&(q=n.R32I)),v===n.RG&&(F===n.FLOAT&&(q=n.RG32F),F===n.HALF_FLOAT&&(q=n.RG16F),F===n.UNSIGNED_BYTE&&(q=n.RG8)),v===n.RG_INTEGER&&(F===n.UNSIGNED_BYTE&&(q=n.RG8UI),F===n.UNSIGNED_SHORT&&(q=n.RG16UI),F===n.UNSIGNED_INT&&(q=n.RG32UI),F===n.BYTE&&(q=n.RG8I),F===n.SHORT&&(q=n.RG16I),F===n.INT&&(q=n.RG32I)),v===n.RGB_INTEGER&&(F===n.UNSIGNED_BYTE&&(q=n.RGB8UI),F===n.UNSIGNED_SHORT&&(q=n.RGB16UI),F===n.UNSIGNED_INT&&(q=n.RGB32UI),F===n.BYTE&&(q=n.RGB8I),F===n.SHORT&&(q=n.RGB16I),F===n.INT&&(q=n.RGB32I)),v===n.RGBA_INTEGER&&(F===n.UNSIGNED_BYTE&&(q=n.RGBA8UI),F===n.UNSIGNED_SHORT&&(q=n.RGBA16UI),F===n.UNSIGNED_INT&&(q=n.RGBA32UI),F===n.BYTE&&(q=n.RGBA8I),F===n.SHORT&&(q=n.RGBA16I),F===n.INT&&(q=n.RGBA32I)),v===n.RGB&&F===n.UNSIGNED_INT_5_9_9_9_REV&&(q=n.RGB9_E5),v===n.RGBA){const ve=J?ps:Xe.getTransfer(Y);F===n.FLOAT&&(q=n.RGBA32F),F===n.HALF_FLOAT&&(q=n.RGBA16F),F===n.UNSIGNED_BYTE&&(q=ve===Qe?n.SRGB8_ALPHA8:n.RGBA8),F===n.UNSIGNED_SHORT_4_4_4_4&&(q=n.RGBA4),F===n.UNSIGNED_SHORT_5_5_5_1&&(q=n.RGB5_A1)}return(q===n.R16F||q===n.R32F||q===n.RG16F||q===n.RG32F||q===n.RGBA16F||q===n.RGBA32F)&&e.get("EXT_color_buffer_float"),q}function M(A,v){let F;return A?v===null||v===ci||v===Oi?F=n.DEPTH24_STENCIL8:v===an?F=n.DEPTH32F_STENCIL8:v===hr&&(F=n.DEPTH24_STENCIL8,console.warn("DepthTexture: 16 bit depth attachment is not supported with stencil. Using 24-bit attachment.")):v===null||v===ci||v===Oi?F=n.DEPTH_COMPONENT24:v===an?F=n.DEPTH_COMPONENT32F:v===hr&&(F=n.DEPTH_COMPONENT16),F}function P(A,v){return p(A)===!0||A.isFramebufferTexture&&A.minFilter!==ft&&A.minFilter!==Bt?Math.log2(Math.max(v.width,v.height))+1:A.mipmaps!==void 0&&A.mipmaps.length>0?A.mipmaps.length:A.isCompressedTexture&&Array.isArray(A.image)?v.mipmaps.length:1}function b(A){const v=A.target;v.removeEventListener("dispose",b),L(v),v.isVideoTexture&&u.delete(v)}function R(A){const v=A.target;v.removeEventListener("dispose",R),x(v)}function L(A){const v=i.get(A);if(v.__webglInit===void 0)return;const F=A.source,Y=d.get(F);if(Y){const J=Y[v.__cacheKey];J.usedTimes--,J.usedTimes===0&&E(A),Object.keys(Y).length===0&&d.delete(F)}i.remove(A)}function E(A){const v=i.get(A);n.deleteTexture(v.__webglTexture);const F=A.source,Y=d.get(F);delete Y[v.__cacheKey],a.memory.textures--}function x(A){const v=i.get(A);if(A.depthTexture&&(A.depthTexture.dispose(),i.remove(A.depthTexture)),A.isWebGLCubeRenderTarget)for(let Y=0;Y<6;Y++){if(Array.isArray(v.__webglFramebuffer[Y]))for(let J=0;J<v.__webglFramebuffer[Y].length;J++)n.deleteFramebuffer(v.__webglFramebuffer[Y][J]);else n.deleteFramebuffer(v.__webglFramebuffer[Y]);v.__webglDepthbuffer&&n.deleteRenderbuffer(v.__webglDepthbuffer[Y])}else{if(Array.isArray(v.__webglFramebuffer))for(let Y=0;Y<v.__webglFramebuffer.length;Y++)n.deleteFramebuffer(v.__webglFramebuffer[Y]);else n.deleteFramebuffer(v.__webglFramebuffer);if(v.__webglDepthbuffer&&n.deleteRenderbuffer(v.__webglDepthbuffer),v.__webglMultisampledFramebuffer&&n.deleteFramebuffer(v.__webglMultisampledFramebuffer),v.__webglColorRenderbuffer)for(let Y=0;Y<v.__webglColorRenderbuffer.length;Y++)v.__webglColorRenderbuffer[Y]&&n.deleteRenderbuffer(v.__webglColorRenderbuffer[Y]);v.__webglDepthRenderbuffer&&n.deleteRenderbuffer(v.__webglDepthRenderbuffer)}const F=A.textures;for(let Y=0,J=F.length;Y<J;Y++){const q=i.get(F[Y]);q.__webglTexture&&(n.deleteTexture(q.__webglTexture),a.memory.textures--),i.remove(F[Y])}i.remove(A)}let w=0;function k(){w=0}function O(){const A=w;return A>=r.maxTextures&&console.warn("THREE.WebGLTextures: Trying to use "+A+" texture units while this GPU supports only "+r.maxTextures),w+=1,A}function X(A){const v=[];return v.push(A.wrapS),v.push(A.wrapT),v.push(A.wrapR||0),v.push(A.magFilter),v.push(A.minFilter),v.push(A.anisotropy),v.push(A.internalFormat),v.push(A.format),v.push(A.type),v.push(A.generateMipmaps),v.push(A.premultiplyAlpha),v.push(A.flipY),v.push(A.unpackAlignment),v.push(A.colorSpace),v.join()}function Z(A,v){const F=i.get(A);if(A.isVideoTexture&&_e(A),A.isRenderTargetTexture===!1&&A.version>0&&F.__version!==A.version){const Y=A.image;if(Y===null)console.warn("THREE.WebGLRenderer: Texture marked for update but no image data found.");else if(Y.complete===!1)console.warn("THREE.WebGLRenderer: Texture marked for update but image is incomplete");else{H(F,A,v);return}}t.bindTexture(n.TEXTURE_2D,F.__webglTexture,n.TEXTURE0+v)}function G(A,v){const F=i.get(A);if(A.version>0&&F.__version!==A.version){H(F,A,v);return}t.bindTexture(n.TEXTURE_2D_ARRAY,F.__webglTexture,n.TEXTURE0+v)}function $(A,v){const F=i.get(A);if(A.version>0&&F.__version!==A.version){H(F,A,v);return}t.bindTexture(n.TEXTURE_3D,F.__webglTexture,n.TEXTURE0+v)}function V(A,v){const F=i.get(A);if(A.version>0&&F.__version!==A.version){K(F,A,v);return}t.bindTexture(n.TEXTURE_CUBE_MAP,F.__webglTexture,n.TEXTURE0+v)}const re={[ma]:n.REPEAT,[ni]:n.CLAMP_TO_EDGE,[ga]:n.MIRRORED_REPEAT},Q={[ft]:n.NEAREST,[vu]:n.NEAREST_MIPMAP_NEAREST,[Er]:n.NEAREST_MIPMAP_LINEAR,[Bt]:n.LINEAR,[ys]:n.LINEAR_MIPMAP_NEAREST,[ii]:n.LINEAR_MIPMAP_LINEAR},se={[Eu]:n.NEVER,[Cu]:n.ALWAYS,[Tu]:n.LESS,[Wl]:n.LEQUAL,[Au]:n.EQUAL,[Ru]:n.GEQUAL,[bu]:n.GREATER,[wu]:n.NOTEQUAL};function be(A,v){if(v.type===an&&e.has("OES_texture_float_linear")===!1&&(v.magFilter===Bt||v.magFilter===ys||v.magFilter===Er||v.magFilter===ii||v.minFilter===Bt||v.minFilter===ys||v.minFilter===Er||v.minFilter===ii)&&console.warn("THREE.WebGLRenderer: Unable to use linear filtering with floating point textures. OES_texture_float_linear not supported on this device."),n.texParameteri(A,n.TEXTURE_WRAP_S,re[v.wrapS]),n.texParameteri(A,n.TEXTURE_WRAP_T,re[v.wrapT]),(A===n.TEXTURE_3D||A===n.TEXTURE_2D_ARRAY)&&n.texParameteri(A,n.TEXTURE_WRAP_R,re[v.wrapR]),n.texParameteri(A,n.TEXTURE_MAG_FILTER,Q[v.magFilter]),n.texParameteri(A,n.TEXTURE_MIN_FILTER,Q[v.minFilter]),v.compareFunction&&(n.texParameteri(A,n.TEXTURE_COMPARE_MODE,n.COMPARE_REF_TO_TEXTURE),n.texParameteri(A,n.TEXTURE_COMPARE_FUNC,se[v.compareFunction])),e.has("EXT_texture_filter_anisotropic")===!0){if(v.magFilter===ft||v.minFilter!==Er&&v.minFilter!==ii||v.type===an&&e.has("OES_texture_float_linear")===!1)return;if(v.anisotropy>1||i.get(v).__currentAnisotropy){const F=e.get("EXT_texture_filter_anisotropic");n.texParameterf(A,F.TEXTURE_MAX_ANISOTROPY_EXT,Math.min(v.anisotropy,r.getMaxAnisotropy())),i.get(v).__currentAnisotropy=v.anisotropy}}}function ke(A,v){let F=!1;A.__webglInit===void 0&&(A.__webglInit=!0,v.addEventListener("dispose",b));const Y=v.source;let J=d.get(Y);J===void 0&&(J={},d.set(Y,J));const q=X(v);if(q!==A.__cacheKey){J[q]===void 0&&(J[q]={texture:n.createTexture(),usedTimes:0},a.memory.textures++,F=!0),J[q].usedTimes++;const ve=J[A.__cacheKey];ve!==void 0&&(J[A.__cacheKey].usedTimes--,ve.usedTimes===0&&E(v)),A.__cacheKey=q,A.__webglTexture=J[q].texture}return F}function H(A,v,F){let Y=n.TEXTURE_2D;(v.isDataArrayTexture||v.isCompressedArrayTexture)&&(Y=n.TEXTURE_2D_ARRAY),v.isData3DTexture&&(Y=n.TEXTURE_3D);const J=ke(A,v),q=v.source;t.bindTexture(Y,A.__webglTexture,n.TEXTURE0+F);const ve=i.get(q);if(q.version!==ve.__version||J===!0){t.activeTexture(n.TEXTURE0+F);const te=Xe.getPrimaries(Xe.workingColorSpace),le=v.colorSpace===Nn?null:Xe.getPrimaries(v.colorSpace),De=v.colorSpace===Nn||te===le?n.NONE:n.BROWSER_DEFAULT_WEBGL;n.pixelStorei(n.UNPACK_FLIP_Y_WEBGL,v.flipY),n.pixelStorei(n.UNPACK_PREMULTIPLY_ALPHA_WEBGL,v.premultiplyAlpha),n.pixelStorei(n.UNPACK_ALIGNMENT,v.unpackAlignment),n.pixelStorei(n.UNPACK_COLORSPACE_CONVERSION_WEBGL,De);let ee=_(v.image,!1,r.maxTextureSize);ee=Ye(v,ee);const ge=s.convert(v.format,v.colorSpace),Ae=s.convert(v.type);let Le=S(v.internalFormat,ge,Ae,v.colorSpace,v.isVideoTexture);be(Y,v);let pe;const He=v.mipmaps,Ie=v.isVideoTexture!==!0,Ke=ve.__version===void 0||J===!0,D=q.dataReady,ce=P(v,ee);if(v.isDepthTexture)Le=M(v.format===Bi,v.type),Ke&&(Ie?t.texStorage2D(n.TEXTURE_2D,1,Le,ee.width,ee.height):t.texImage2D(n.TEXTURE_2D,0,Le,ee.width,ee.height,0,ge,Ae,null));else if(v.isDataTexture)if(He.length>0){Ie&&Ke&&t.texStorage2D(n.TEXTURE_2D,ce,Le,He[0].width,He[0].height);for(let W=0,j=He.length;W<j;W++)pe=He[W],Ie?D&&t.texSubImage2D(n.TEXTURE_2D,W,0,0,pe.width,pe.height,ge,Ae,pe.data):t.texImage2D(n.TEXTURE_2D,W,Le,pe.width,pe.height,0,ge,Ae,pe.data);v.generateMipmaps=!1}else Ie?(Ke&&t.texStorage2D(n.TEXTURE_2D,ce,Le,ee.width,ee.height),D&&t.texSubImage2D(n.TEXTURE_2D,0,0,0,ee.width,ee.height,ge,Ae,ee.data)):t.texImage2D(n.TEXTURE_2D,0,Le,ee.width,ee.height,0,ge,Ae,ee.data);else if(v.isCompressedTexture)if(v.isCompressedArrayTexture){Ie&&Ke&&t.texStorage3D(n.TEXTURE_2D_ARRAY,ce,Le,He[0].width,He[0].height,ee.depth);for(let W=0,j=He.length;W<j;W++)if(pe=He[W],v.format!==zt)if(ge!==null)if(Ie){if(D)if(v.layerUpdates.size>0){const me=gl(pe.width,pe.height,v.format,v.type);for(const he of v.layerUpdates){const Oe=pe.data.subarray(he*me/pe.data.BYTES_PER_ELEMENT,(he+1)*me/pe.data.BYTES_PER_ELEMENT);t.compressedTexSubImage3D(n.TEXTURE_2D_ARRAY,W,0,0,he,pe.width,pe.height,1,ge,Oe)}v.clearLayerUpdates()}else t.compressedTexSubImage3D(n.TEXTURE_2D_ARRAY,W,0,0,0,pe.width,pe.height,ee.depth,ge,pe.data)}else t.compressedTexImage3D(n.TEXTURE_2D_ARRAY,W,Le,pe.width,pe.height,ee.depth,0,pe.data,0,0);else console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()");else Ie?D&&t.texSubImage3D(n.TEXTURE_2D_ARRAY,W,0,0,0,pe.width,pe.height,ee.depth,ge,Ae,pe.data):t.texImage3D(n.TEXTURE_2D_ARRAY,W,Le,pe.width,pe.height,ee.depth,0,ge,Ae,pe.data)}else{Ie&&Ke&&t.texStorage2D(n.TEXTURE_2D,ce,Le,He[0].width,He[0].height);for(let W=0,j=He.length;W<j;W++)pe=He[W],v.format!==zt?ge!==null?Ie?D&&t.compressedTexSubImage2D(n.TEXTURE_2D,W,0,0,pe.width,pe.height,ge,pe.data):t.compressedTexImage2D(n.TEXTURE_2D,W,Le,pe.width,pe.height,0,pe.data):console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()"):Ie?D&&t.texSubImage2D(n.TEXTURE_2D,W,0,0,pe.width,pe.height,ge,Ae,pe.data):t.texImage2D(n.TEXTURE_2D,W,Le,pe.width,pe.height,0,ge,Ae,pe.data)}else if(v.isDataArrayTexture)if(Ie){if(Ke&&t.texStorage3D(n.TEXTURE_2D_ARRAY,ce,Le,ee.width,ee.height,ee.depth),D)if(v.layerUpdates.size>0){const W=gl(ee.width,ee.height,v.format,v.type);for(const j of v.layerUpdates){const me=ee.data.subarray(j*W/ee.data.BYTES_PER_ELEMENT,(j+1)*W/ee.data.BYTES_PER_ELEMENT);t.texSubImage3D(n.TEXTURE_2D_ARRAY,0,0,0,j,ee.width,ee.height,1,ge,Ae,me)}v.clearLayerUpdates()}else t.texSubImage3D(n.TEXTURE_2D_ARRAY,0,0,0,0,ee.width,ee.height,ee.depth,ge,Ae,ee.data)}else t.texImage3D(n.TEXTURE_2D_ARRAY,0,Le,ee.width,ee.height,ee.depth,0,ge,Ae,ee.data);else if(v.isData3DTexture)Ie?(Ke&&t.texStorage3D(n.TEXTURE_3D,ce,Le,ee.width,ee.height,ee.depth),D&&t.texSubImage3D(n.TEXTURE_3D,0,0,0,0,ee.width,ee.height,ee.depth,ge,Ae,ee.data)):t.texImage3D(n.TEXTURE_3D,0,Le,ee.width,ee.height,ee.depth,0,ge,Ae,ee.data);else if(v.isFramebufferTexture){if(Ke)if(Ie)t.texStorage2D(n.TEXTURE_2D,ce,Le,ee.width,ee.height);else{let W=ee.width,j=ee.height;for(let me=0;me<ce;me++)t.texImage2D(n.TEXTURE_2D,me,Le,W,j,0,ge,Ae,null),W>>=1,j>>=1}}else if(He.length>0){if(Ie&&Ke){const W=xe(He[0]);t.texStorage2D(n.TEXTURE_2D,ce,Le,W.width,W.height)}for(let W=0,j=He.length;W<j;W++)pe=He[W],Ie?D&&t.texSubImage2D(n.TEXTURE_2D,W,0,0,ge,Ae,pe):t.texImage2D(n.TEXTURE_2D,W,Le,ge,Ae,pe);v.generateMipmaps=!1}else if(Ie){if(Ke){const W=xe(ee);t.texStorage2D(n.TEXTURE_2D,ce,Le,W.width,W.height)}D&&t.texSubImage2D(n.TEXTURE_2D,0,0,0,ge,Ae,ee)}else t.texImage2D(n.TEXTURE_2D,0,Le,ge,Ae,ee);p(v)&&h(Y),ve.__version=q.version,v.onUpdate&&v.onUpdate(v)}A.__version=v.version}function K(A,v,F){if(v.image.length!==6)return;const Y=ke(A,v),J=v.source;t.bindTexture(n.TEXTURE_CUBE_MAP,A.__webglTexture,n.TEXTURE0+F);const q=i.get(J);if(J.version!==q.__version||Y===!0){t.activeTexture(n.TEXTURE0+F);const ve=Xe.getPrimaries(Xe.workingColorSpace),te=v.colorSpace===Nn?null:Xe.getPrimaries(v.colorSpace),le=v.colorSpace===Nn||ve===te?n.NONE:n.BROWSER_DEFAULT_WEBGL;n.pixelStorei(n.UNPACK_FLIP_Y_WEBGL,v.flipY),n.pixelStorei(n.UNPACK_PREMULTIPLY_ALPHA_WEBGL,v.premultiplyAlpha),n.pixelStorei(n.UNPACK_ALIGNMENT,v.unpackAlignment),n.pixelStorei(n.UNPACK_COLORSPACE_CONVERSION_WEBGL,le);const De=v.isCompressedTexture||v.image[0].isCompressedTexture,ee=v.image[0]&&v.image[0].isDataTexture,ge=[];for(let j=0;j<6;j++)!De&&!ee?ge[j]=_(v.image[j],!0,r.maxCubemapSize):ge[j]=ee?v.image[j].image:v.image[j],ge[j]=Ye(v,ge[j]);const Ae=ge[0],Le=s.convert(v.format,v.colorSpace),pe=s.convert(v.type),He=S(v.internalFormat,Le,pe,v.colorSpace),Ie=v.isVideoTexture!==!0,Ke=q.__version===void 0||Y===!0,D=J.dataReady;let ce=P(v,Ae);be(n.TEXTURE_CUBE_MAP,v);let W;if(De){Ie&&Ke&&t.texStorage2D(n.TEXTURE_CUBE_MAP,ce,He,Ae.width,Ae.height);for(let j=0;j<6;j++){W=ge[j].mipmaps;for(let me=0;me<W.length;me++){const he=W[me];v.format!==zt?Le!==null?Ie?D&&t.compressedTexSubImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+j,me,0,0,he.width,he.height,Le,he.data):t.compressedTexImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+j,me,He,he.width,he.height,0,he.data):console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .setTextureCube()"):Ie?D&&t.texSubImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+j,me,0,0,he.width,he.height,Le,pe,he.data):t.texImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+j,me,He,he.width,he.height,0,Le,pe,he.data)}}}else{if(W=v.mipmaps,Ie&&Ke){W.length>0&&ce++;const j=xe(ge[0]);t.texStorage2D(n.TEXTURE_CUBE_MAP,ce,He,j.width,j.height)}for(let j=0;j<6;j++)if(ee){Ie?D&&t.texSubImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+j,0,0,0,ge[j].width,ge[j].height,Le,pe,ge[j].data):t.texImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+j,0,He,ge[j].width,ge[j].height,0,Le,pe,ge[j].data);for(let me=0;me<W.length;me++){const Oe=W[me].image[j].image;Ie?D&&t.texSubImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+j,me+1,0,0,Oe.width,Oe.height,Le,pe,Oe.data):t.texImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+j,me+1,He,Oe.width,Oe.height,0,Le,pe,Oe.data)}}else{Ie?D&&t.texSubImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+j,0,0,0,Le,pe,ge[j]):t.texImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+j,0,He,Le,pe,ge[j]);for(let me=0;me<W.length;me++){const he=W[me];Ie?D&&t.texSubImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+j,me+1,0,0,Le,pe,he.image[j]):t.texImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+j,me+1,He,Le,pe,he.image[j])}}}p(v)&&h(n.TEXTURE_CUBE_MAP),q.__version=J.version,v.onUpdate&&v.onUpdate(v)}A.__version=v.version}function ue(A,v,F,Y,J,q){const ve=s.convert(F.format,F.colorSpace),te=s.convert(F.type),le=S(F.internalFormat,ve,te,F.colorSpace),De=i.get(v),ee=i.get(F);if(ee.__renderTarget=v,!De.__hasExternalTextures){const ge=Math.max(1,v.width>>q),Ae=Math.max(1,v.height>>q);J===n.TEXTURE_3D||J===n.TEXTURE_2D_ARRAY?t.texImage3D(J,q,le,ge,Ae,v.depth,0,ve,te,null):t.texImage2D(J,q,le,ge,Ae,0,ve,te,null)}t.bindFramebuffer(n.FRAMEBUFFER,A),Pe(v)?o.framebufferTexture2DMultisampleEXT(n.FRAMEBUFFER,Y,J,ee.__webglTexture,0,Re(v)):(J===n.TEXTURE_2D||J>=n.TEXTURE_CUBE_MAP_POSITIVE_X&&J<=n.TEXTURE_CUBE_MAP_NEGATIVE_Z)&&n.framebufferTexture2D(n.FRAMEBUFFER,Y,J,ee.__webglTexture,q),t.bindFramebuffer(n.FRAMEBUFFER,null)}function ne(A,v,F){if(n.bindRenderbuffer(n.RENDERBUFFER,A),v.depthBuffer){const Y=v.depthTexture,J=Y&&Y.isDepthTexture?Y.type:null,q=M(v.stencilBuffer,J),ve=v.stencilBuffer?n.DEPTH_STENCIL_ATTACHMENT:n.DEPTH_ATTACHMENT,te=Re(v);Pe(v)?o.renderbufferStorageMultisampleEXT(n.RENDERBUFFER,te,q,v.width,v.height):F?n.renderbufferStorageMultisample(n.RENDERBUFFER,te,q,v.width,v.height):n.renderbufferStorage(n.RENDERBUFFER,q,v.width,v.height),n.framebufferRenderbuffer(n.FRAMEBUFFER,ve,n.RENDERBUFFER,A)}else{const Y=v.textures;for(let J=0;J<Y.length;J++){const q=Y[J],ve=s.convert(q.format,q.colorSpace),te=s.convert(q.type),le=S(q.internalFormat,ve,te,q.colorSpace),De=Re(v);F&&Pe(v)===!1?n.renderbufferStorageMultisample(n.RENDERBUFFER,De,le,v.width,v.height):Pe(v)?o.renderbufferStorageMultisampleEXT(n.RENDERBUFFER,De,le,v.width,v.height):n.renderbufferStorage(n.RENDERBUFFER,le,v.width,v.height)}}n.bindRenderbuffer(n.RENDERBUFFER,null)}function Ee(A,v){if(v&&v.isWebGLCubeRenderTarget)throw new Error("Depth Texture with cube render targets is not supported");if(t.bindFramebuffer(n.FRAMEBUFFER,A),!(v.depthTexture&&v.depthTexture.isDepthTexture))throw new Error("renderTarget.depthTexture must be an instance of THREE.DepthTexture");const Y=i.get(v.depthTexture);Y.__renderTarget=v,(!Y.__webglTexture||v.depthTexture.image.width!==v.width||v.depthTexture.image.height!==v.height)&&(v.depthTexture.image.width=v.width,v.depthTexture.image.height=v.height,v.depthTexture.needsUpdate=!0),Z(v.depthTexture,0);const J=Y.__webglTexture,q=Re(v);if(v.depthTexture.format===Di)Pe(v)?o.framebufferTexture2DMultisampleEXT(n.FRAMEBUFFER,n.DEPTH_ATTACHMENT,n.TEXTURE_2D,J,0,q):n.framebufferTexture2D(n.FRAMEBUFFER,n.DEPTH_ATTACHMENT,n.TEXTURE_2D,J,0);else if(v.depthTexture.format===Bi)Pe(v)?o.framebufferTexture2DMultisampleEXT(n.FRAMEBUFFER,n.DEPTH_STENCIL_ATTACHMENT,n.TEXTURE_2D,J,0,q):n.framebufferTexture2D(n.FRAMEBUFFER,n.DEPTH_STENCIL_ATTACHMENT,n.TEXTURE_2D,J,0);else throw new Error("Unknown depthTexture format")}function we(A){const v=i.get(A),F=A.isWebGLCubeRenderTarget===!0;if(v.__boundDepthTexture!==A.depthTexture){const Y=A.depthTexture;if(v.__depthDisposeCallback&&v.__depthDisposeCallback(),Y){const J=()=>{delete v.__boundDepthTexture,delete v.__depthDisposeCallback,Y.removeEventListener("dispose",J)};Y.addEventListener("dispose",J),v.__depthDisposeCallback=J}v.__boundDepthTexture=Y}if(A.depthTexture&&!v.__autoAllocateDepthBuffer){if(F)throw new Error("target.depthTexture not supported in Cube render targets");Ee(v.__webglFramebuffer,A)}else if(F){v.__webglDepthbuffer=[];for(let Y=0;Y<6;Y++)if(t.bindFramebuffer(n.FRAMEBUFFER,v.__webglFramebuffer[Y]),v.__webglDepthbuffer[Y]===void 0)v.__webglDepthbuffer[Y]=n.createRenderbuffer(),ne(v.__webglDepthbuffer[Y],A,!1);else{const J=A.stencilBuffer?n.DEPTH_STENCIL_ATTACHMENT:n.DEPTH_ATTACHMENT,q=v.__webglDepthbuffer[Y];n.bindRenderbuffer(n.RENDERBUFFER,q),n.framebufferRenderbuffer(n.FRAMEBUFFER,J,n.RENDERBUFFER,q)}}else if(t.bindFramebuffer(n.FRAMEBUFFER,v.__webglFramebuffer),v.__webglDepthbuffer===void 0)v.__webglDepthbuffer=n.createRenderbuffer(),ne(v.__webglDepthbuffer,A,!1);else{const Y=A.stencilBuffer?n.DEPTH_STENCIL_ATTACHMENT:n.DEPTH_ATTACHMENT,J=v.__webglDepthbuffer;n.bindRenderbuffer(n.RENDERBUFFER,J),n.framebufferRenderbuffer(n.FRAMEBUFFER,Y,n.RENDERBUFFER,J)}t.bindFramebuffer(n.FRAMEBUFFER,null)}function Ce(A,v,F){const Y=i.get(A);v!==void 0&&ue(Y.__webglFramebuffer,A,A.texture,n.COLOR_ATTACHMENT0,n.TEXTURE_2D,0),F!==void 0&&we(A)}function de(A){const v=A.texture,F=i.get(A),Y=i.get(v);A.addEventListener("dispose",R);const J=A.textures,q=A.isWebGLCubeRenderTarget===!0,ve=J.length>1;if(ve||(Y.__webglTexture===void 0&&(Y.__webglTexture=n.createTexture()),Y.__version=v.version,a.memory.textures++),q){F.__webglFramebuffer=[];for(let te=0;te<6;te++)if(v.mipmaps&&v.mipmaps.length>0){F.__webglFramebuffer[te]=[];for(let le=0;le<v.mipmaps.length;le++)F.__webglFramebuffer[te][le]=n.createFramebuffer()}else F.__webglFramebuffer[te]=n.createFramebuffer()}else{if(v.mipmaps&&v.mipmaps.length>0){F.__webglFramebuffer=[];for(let te=0;te<v.mipmaps.length;te++)F.__webglFramebuffer[te]=n.createFramebuffer()}else F.__webglFramebuffer=n.createFramebuffer();if(ve)for(let te=0,le=J.length;te<le;te++){const De=i.get(J[te]);De.__webglTexture===void 0&&(De.__webglTexture=n.createTexture(),a.memory.textures++)}if(A.samples>0&&Pe(A)===!1){F.__webglMultisampledFramebuffer=n.createFramebuffer(),F.__webglColorRenderbuffer=[],t.bindFramebuffer(n.FRAMEBUFFER,F.__webglMultisampledFramebuffer);for(let te=0;te<J.length;te++){const le=J[te];F.__webglColorRenderbuffer[te]=n.createRenderbuffer(),n.bindRenderbuffer(n.RENDERBUFFER,F.__webglColorRenderbuffer[te]);const De=s.convert(le.format,le.colorSpace),ee=s.convert(le.type),ge=S(le.internalFormat,De,ee,le.colorSpace,A.isXRRenderTarget===!0),Ae=Re(A);n.renderbufferStorageMultisample(n.RENDERBUFFER,Ae,ge,A.width,A.height),n.framebufferRenderbuffer(n.FRAMEBUFFER,n.COLOR_ATTACHMENT0+te,n.RENDERBUFFER,F.__webglColorRenderbuffer[te])}n.bindRenderbuffer(n.RENDERBUFFER,null),A.depthBuffer&&(F.__webglDepthRenderbuffer=n.createRenderbuffer(),ne(F.__webglDepthRenderbuffer,A,!0)),t.bindFramebuffer(n.FRAMEBUFFER,null)}}if(q){t.bindTexture(n.TEXTURE_CUBE_MAP,Y.__webglTexture),be(n.TEXTURE_CUBE_MAP,v);for(let te=0;te<6;te++)if(v.mipmaps&&v.mipmaps.length>0)for(let le=0;le<v.mipmaps.length;le++)ue(F.__webglFramebuffer[te][le],A,v,n.COLOR_ATTACHMENT0,n.TEXTURE_CUBE_MAP_POSITIVE_X+te,le);else ue(F.__webglFramebuffer[te],A,v,n.COLOR_ATTACHMENT0,n.TEXTURE_CUBE_MAP_POSITIVE_X+te,0);p(v)&&h(n.TEXTURE_CUBE_MAP),t.unbindTexture()}else if(ve){for(let te=0,le=J.length;te<le;te++){const De=J[te],ee=i.get(De);t.bindTexture(n.TEXTURE_2D,ee.__webglTexture),be(n.TEXTURE_2D,De),ue(F.__webglFramebuffer,A,De,n.COLOR_ATTACHMENT0+te,n.TEXTURE_2D,0),p(De)&&h(n.TEXTURE_2D)}t.unbindTexture()}else{let te=n.TEXTURE_2D;if((A.isWebGL3DRenderTarget||A.isWebGLArrayRenderTarget)&&(te=A.isWebGL3DRenderTarget?n.TEXTURE_3D:n.TEXTURE_2D_ARRAY),t.bindTexture(te,Y.__webglTexture),be(te,v),v.mipmaps&&v.mipmaps.length>0)for(let le=0;le<v.mipmaps.length;le++)ue(F.__webglFramebuffer[le],A,v,n.COLOR_ATTACHMENT0,te,le);else ue(F.__webglFramebuffer,A,v,n.COLOR_ATTACHMENT0,te,0);p(v)&&h(te),t.unbindTexture()}A.depthBuffer&&we(A)}function ae(A){const v=A.textures;for(let F=0,Y=v.length;F<Y;F++){const J=v[F];if(p(J)){const q=T(A),ve=i.get(J).__webglTexture;t.bindTexture(q,ve),h(q),t.unbindTexture()}}}const Fe=[],C=[];function We(A){if(A.samples>0){if(Pe(A)===!1){const v=A.textures,F=A.width,Y=A.height;let J=n.COLOR_BUFFER_BIT;const q=A.stencilBuffer?n.DEPTH_STENCIL_ATTACHMENT:n.DEPTH_ATTACHMENT,ve=i.get(A),te=v.length>1;if(te)for(let le=0;le<v.length;le++)t.bindFramebuffer(n.FRAMEBUFFER,ve.__webglMultisampledFramebuffer),n.framebufferRenderbuffer(n.FRAMEBUFFER,n.COLOR_ATTACHMENT0+le,n.RENDERBUFFER,null),t.bindFramebuffer(n.FRAMEBUFFER,ve.__webglFramebuffer),n.framebufferTexture2D(n.DRAW_FRAMEBUFFER,n.COLOR_ATTACHMENT0+le,n.TEXTURE_2D,null,0);t.bindFramebuffer(n.READ_FRAMEBUFFER,ve.__webglMultisampledFramebuffer),t.bindFramebuffer(n.DRAW_FRAMEBUFFER,ve.__webglFramebuffer);for(let le=0;le<v.length;le++){if(A.resolveDepthBuffer&&(A.depthBuffer&&(J|=n.DEPTH_BUFFER_BIT),A.stencilBuffer&&A.resolveStencilBuffer&&(J|=n.STENCIL_BUFFER_BIT)),te){n.framebufferRenderbuffer(n.READ_FRAMEBUFFER,n.COLOR_ATTACHMENT0,n.RENDERBUFFER,ve.__webglColorRenderbuffer[le]);const De=i.get(v[le]).__webglTexture;n.framebufferTexture2D(n.DRAW_FRAMEBUFFER,n.COLOR_ATTACHMENT0,n.TEXTURE_2D,De,0)}n.blitFramebuffer(0,0,F,Y,0,0,F,Y,J,n.NEAREST),l===!0&&(Fe.length=0,C.length=0,Fe.push(n.COLOR_ATTACHMENT0+le),A.depthBuffer&&A.resolveDepthBuffer===!1&&(Fe.push(q),C.push(q),n.invalidateFramebuffer(n.DRAW_FRAMEBUFFER,C)),n.invalidateFramebuffer(n.READ_FRAMEBUFFER,Fe))}if(t.bindFramebuffer(n.READ_FRAMEBUFFER,null),t.bindFramebuffer(n.DRAW_FRAMEBUFFER,null),te)for(let le=0;le<v.length;le++){t.bindFramebuffer(n.FRAMEBUFFER,ve.__webglMultisampledFramebuffer),n.framebufferRenderbuffer(n.FRAMEBUFFER,n.COLOR_ATTACHMENT0+le,n.RENDERBUFFER,ve.__webglColorRenderbuffer[le]);const De=i.get(v[le]).__webglTexture;t.bindFramebuffer(n.FRAMEBUFFER,ve.__webglFramebuffer),n.framebufferTexture2D(n.DRAW_FRAMEBUFFER,n.COLOR_ATTACHMENT0+le,n.TEXTURE_2D,De,0)}t.bindFramebuffer(n.DRAW_FRAMEBUFFER,ve.__webglMultisampledFramebuffer)}else if(A.depthBuffer&&A.resolveDepthBuffer===!1&&l){const v=A.stencilBuffer?n.DEPTH_STENCIL_ATTACHMENT:n.DEPTH_ATTACHMENT;n.invalidateFramebuffer(n.DRAW_FRAMEBUFFER,[v])}}}function Re(A){return Math.min(r.maxSamples,A.samples)}function Pe(A){const v=i.get(A);return A.samples>0&&e.has("WEBGL_multisampled_render_to_texture")===!0&&v.__useRenderToTexture!==!1}function _e(A){const v=a.render.frame;u.get(A)!==v&&(u.set(A,v),A.update())}function Ye(A,v){const F=A.colorSpace,Y=A.format,J=A.type;return A.isCompressedTexture===!0||A.isVideoTexture===!0||F!==Wi&&F!==Nn&&(Xe.getTransfer(F)===Qe?(Y!==zt||J!==Jt)&&console.warn("THREE.WebGLTextures: sRGB encoded textures have to use RGBAFormat and UnsignedByteType."):console.error("THREE.WebGLTextures: Unsupported texture color space:",F)),v}function xe(A){return typeof HTMLImageElement<"u"&&A instanceof HTMLImageElement?(c.width=A.naturalWidth||A.width,c.height=A.naturalHeight||A.height):typeof VideoFrame<"u"&&A instanceof VideoFrame?(c.width=A.displayWidth,c.height=A.displayHeight):(c.width=A.width,c.height=A.height),c}this.allocateTextureUnit=O,this.resetTextureUnits=k,this.setTexture2D=Z,this.setTexture2DArray=G,this.setTexture3D=$,this.setTextureCube=V,this.rebindTextures=Ce,this.setupRenderTarget=de,this.updateRenderTargetMipmap=ae,this.updateMultisampleRenderTarget=We,this.setupDepthRenderbuffer=we,this.setupFrameBufferTexture=ue,this.useMultisampledRTT=Pe}function Um(n,e){function t(i,r=Nn){let s;const a=Xe.getTransfer(r);if(i===Jt)return n.UNSIGNED_BYTE;if(i===Qa)return n.UNSIGNED_SHORT_4_4_4_4;if(i===eo)return n.UNSIGNED_SHORT_5_5_5_1;if(i===Fl)return n.UNSIGNED_INT_5_9_9_9_REV;if(i===Ul)return n.BYTE;if(i===Nl)return n.SHORT;if(i===hr)return n.UNSIGNED_SHORT;if(i===Ja)return n.INT;if(i===ci)return n.UNSIGNED_INT;if(i===an)return n.FLOAT;if(i===mr)return n.HALF_FLOAT;if(i===Ol)return n.ALPHA;if(i===Bl)return n.RGB;if(i===zt)return n.RGBA;if(i===zl)return n.LUMINANCE;if(i===kl)return n.LUMINANCE_ALPHA;if(i===Di)return n.DEPTH_COMPONENT;if(i===Bi)return n.DEPTH_STENCIL;if(i===Gl)return n.RED;if(i===to)return n.RED_INTEGER;if(i===Hl)return n.RG;if(i===no)return n.RG_INTEGER;if(i===io)return n.RGBA_INTEGER;if(i===jr||i===Jr||i===Qr||i===es)if(a===Qe)if(s=e.get("WEBGL_compressed_texture_s3tc_srgb"),s!==null){if(i===jr)return s.COMPRESSED_SRGB_S3TC_DXT1_EXT;if(i===Jr)return s.COMPRESSED_SRGB_ALPHA_S3TC_DXT1_EXT;if(i===Qr)return s.COMPRESSED_SRGB_ALPHA_S3TC_DXT3_EXT;if(i===es)return s.COMPRESSED_SRGB_ALPHA_S3TC_DXT5_EXT}else return null;else if(s=e.get("WEBGL_compressed_texture_s3tc"),s!==null){if(i===jr)return s.COMPRESSED_RGB_S3TC_DXT1_EXT;if(i===Jr)return s.COMPRESSED_RGBA_S3TC_DXT1_EXT;if(i===Qr)return s.COMPRESSED_RGBA_S3TC_DXT3_EXT;if(i===es)return s.COMPRESSED_RGBA_S3TC_DXT5_EXT}else return null;if(i===_a||i===va||i===xa||i===Ma)if(s=e.get("WEBGL_compressed_texture_pvrtc"),s!==null){if(i===_a)return s.COMPRESSED_RGB_PVRTC_4BPPV1_IMG;if(i===va)return s.COMPRESSED_RGB_PVRTC_2BPPV1_IMG;if(i===xa)return s.COMPRESSED_RGBA_PVRTC_4BPPV1_IMG;if(i===Ma)return s.COMPRESSED_RGBA_PVRTC_2BPPV1_IMG}else return null;if(i===Sa||i===ya||i===Ea)if(s=e.get("WEBGL_compressed_texture_etc"),s!==null){if(i===Sa||i===ya)return a===Qe?s.COMPRESSED_SRGB8_ETC2:s.COMPRESSED_RGB8_ETC2;if(i===Ea)return a===Qe?s.COMPRESSED_SRGB8_ALPHA8_ETC2_EAC:s.COMPRESSED_RGBA8_ETC2_EAC}else return null;if(i===Ta||i===Aa||i===ba||i===wa||i===Ra||i===Ca||i===Pa||i===Da||i===La||i===Ia||i===Ua||i===Na||i===Fa||i===Oa)if(s=e.get("WEBGL_compressed_texture_astc"),s!==null){if(i===Ta)return a===Qe?s.COMPRESSED_SRGB8_ALPHA8_ASTC_4x4_KHR:s.COMPRESSED_RGBA_ASTC_4x4_KHR;if(i===Aa)return a===Qe?s.COMPRESSED_SRGB8_ALPHA8_ASTC_5x4_KHR:s.COMPRESSED_RGBA_ASTC_5x4_KHR;if(i===ba)return a===Qe?s.COMPRESSED_SRGB8_ALPHA8_ASTC_5x5_KHR:s.COMPRESSED_RGBA_ASTC_5x5_KHR;if(i===wa)return a===Qe?s.COMPRESSED_SRGB8_ALPHA8_ASTC_6x5_KHR:s.COMPRESSED_RGBA_ASTC_6x5_KHR;if(i===Ra)return a===Qe?s.COMPRESSED_SRGB8_ALPHA8_ASTC_6x6_KHR:s.COMPRESSED_RGBA_ASTC_6x6_KHR;if(i===Ca)return a===Qe?s.COMPRESSED_SRGB8_ALPHA8_ASTC_8x5_KHR:s.COMPRESSED_RGBA_ASTC_8x5_KHR;if(i===Pa)return a===Qe?s.COMPRESSED_SRGB8_ALPHA8_ASTC_8x6_KHR:s.COMPRESSED_RGBA_ASTC_8x6_KHR;if(i===Da)return a===Qe?s.COMPRESSED_SRGB8_ALPHA8_ASTC_8x8_KHR:s.COMPRESSED_RGBA_ASTC_8x8_KHR;if(i===La)return a===Qe?s.COMPRESSED_SRGB8_ALPHA8_ASTC_10x5_KHR:s.COMPRESSED_RGBA_ASTC_10x5_KHR;if(i===Ia)return a===Qe?s.COMPRESSED_SRGB8_ALPHA8_ASTC_10x6_KHR:s.COMPRESSED_RGBA_ASTC_10x6_KHR;if(i===Ua)return a===Qe?s.COMPRESSED_SRGB8_ALPHA8_ASTC_10x8_KHR:s.COMPRESSED_RGBA_ASTC_10x8_KHR;if(i===Na)return a===Qe?s.COMPRESSED_SRGB8_ALPHA8_ASTC_10x10_KHR:s.COMPRESSED_RGBA_ASTC_10x10_KHR;if(i===Fa)return a===Qe?s.COMPRESSED_SRGB8_ALPHA8_ASTC_12x10_KHR:s.COMPRESSED_RGBA_ASTC_12x10_KHR;if(i===Oa)return a===Qe?s.COMPRESSED_SRGB8_ALPHA8_ASTC_12x12_KHR:s.COMPRESSED_RGBA_ASTC_12x12_KHR}else return null;if(i===ts||i===Ba||i===za)if(s=e.get("EXT_texture_compression_bptc"),s!==null){if(i===ts)return a===Qe?s.COMPRESSED_SRGB_ALPHA_BPTC_UNORM_EXT:s.COMPRESSED_RGBA_BPTC_UNORM_EXT;if(i===Ba)return s.COMPRESSED_RGB_BPTC_SIGNED_FLOAT_EXT;if(i===za)return s.COMPRESSED_RGB_BPTC_UNSIGNED_FLOAT_EXT}else return null;if(i===Vl||i===ka||i===Ga||i===Ha)if(s=e.get("EXT_texture_compression_rgtc"),s!==null){if(i===ts)return s.COMPRESSED_RED_RGTC1_EXT;if(i===ka)return s.COMPRESSED_SIGNED_RED_RGTC1_EXT;if(i===Ga)return s.COMPRESSED_RED_GREEN_RGTC2_EXT;if(i===Ha)return s.COMPRESSED_SIGNED_RED_GREEN_RGTC2_EXT}else return null;return i===Oi?n.UNSIGNED_INT_24_8:n[i]!==void 0?n[i]:null}return{convert:t}}class Nm extends It{constructor(e=[]){super(),this.isArrayCamera=!0,this.cameras=e}}class Wr extends Rt{constructor(){super(),this.isGroup=!0,this.type="Group"}}const Fm={type:"move"};class js{constructor(){this._targetRay=null,this._grip=null,this._hand=null}getHandSpace(){return this._hand===null&&(this._hand=new Wr,this._hand.matrixAutoUpdate=!1,this._hand.visible=!1,this._hand.joints={},this._hand.inputState={pinching:!1}),this._hand}getTargetRaySpace(){return this._targetRay===null&&(this._targetRay=new Wr,this._targetRay.matrixAutoUpdate=!1,this._targetRay.visible=!1,this._targetRay.hasLinearVelocity=!1,this._targetRay.linearVelocity=new N,this._targetRay.hasAngularVelocity=!1,this._targetRay.angularVelocity=new N),this._targetRay}getGripSpace(){return this._grip===null&&(this._grip=new Wr,this._grip.matrixAutoUpdate=!1,this._grip.visible=!1,this._grip.hasLinearVelocity=!1,this._grip.linearVelocity=new N,this._grip.hasAngularVelocity=!1,this._grip.angularVelocity=new N),this._grip}dispatchEvent(e){return this._targetRay!==null&&this._targetRay.dispatchEvent(e),this._grip!==null&&this._grip.dispatchEvent(e),this._hand!==null&&this._hand.dispatchEvent(e),this}connect(e){if(e&&e.hand){const t=this._hand;if(t)for(const i of e.hand.values())this._getHandJoint(t,i)}return this.dispatchEvent({type:"connected",data:e}),this}disconnect(e){return this.dispatchEvent({type:"disconnected",data:e}),this._targetRay!==null&&(this._targetRay.visible=!1),this._grip!==null&&(this._grip.visible=!1),this._hand!==null&&(this._hand.visible=!1),this}update(e,t,i){let r=null,s=null,a=null;const o=this._targetRay,l=this._grip,c=this._hand;if(e&&t.session.visibilityState!=="visible-blurred"){if(c&&e.hand){a=!0;for(const _ of e.hand.values()){const p=t.getJointPose(_,i),h=this._getHandJoint(c,_);p!==null&&(h.matrix.fromArray(p.transform.matrix),h.matrix.decompose(h.position,h.rotation,h.scale),h.matrixWorldNeedsUpdate=!0,h.jointRadius=p.radius),h.visible=p!==null}const u=c.joints["index-finger-tip"],f=c.joints["thumb-tip"],d=u.position.distanceTo(f.position),m=.02,g=.005;c.inputState.pinching&&d>m+g?(c.inputState.pinching=!1,this.dispatchEvent({type:"pinchend",handedness:e.handedness,target:this})):!c.inputState.pinching&&d<=m-g&&(c.inputState.pinching=!0,this.dispatchEvent({type:"pinchstart",handedness:e.handedness,target:this}))}else l!==null&&e.gripSpace&&(s=t.getPose(e.gripSpace,i),s!==null&&(l.matrix.fromArray(s.transform.matrix),l.matrix.decompose(l.position,l.rotation,l.scale),l.matrixWorldNeedsUpdate=!0,s.linearVelocity?(l.hasLinearVelocity=!0,l.linearVelocity.copy(s.linearVelocity)):l.hasLinearVelocity=!1,s.angularVelocity?(l.hasAngularVelocity=!0,l.angularVelocity.copy(s.angularVelocity)):l.hasAngularVelocity=!1));o!==null&&(r=t.getPose(e.targetRaySpace,i),r===null&&s!==null&&(r=s),r!==null&&(o.matrix.fromArray(r.transform.matrix),o.matrix.decompose(o.position,o.rotation,o.scale),o.matrixWorldNeedsUpdate=!0,r.linearVelocity?(o.hasLinearVelocity=!0,o.linearVelocity.copy(r.linearVelocity)):o.hasLinearVelocity=!1,r.angularVelocity?(o.hasAngularVelocity=!0,o.angularVelocity.copy(r.angularVelocity)):o.hasAngularVelocity=!1,this.dispatchEvent(Fm)))}return o!==null&&(o.visible=r!==null),l!==null&&(l.visible=s!==null),c!==null&&(c.visible=a!==null),this}_getHandJoint(e,t){if(e.joints[t.jointName]===void 0){const i=new Wr;i.matrixAutoUpdate=!1,i.visible=!1,e.joints[t.jointName]=i,e.add(i)}return e.joints[t.jointName]}}const Om=`
void main() {

	gl_Position = vec4( position, 1.0 );

}`,Bm=`
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

}`;class zm{constructor(){this.texture=null,this.mesh=null,this.depthNear=0,this.depthFar=0}init(e,t,i){if(this.texture===null){const r=new Mt,s=e.properties.get(r);s.__webglTexture=t.texture,(t.depthNear!=i.depthNear||t.depthFar!=i.depthFar)&&(this.depthNear=t.depthNear,this.depthFar=t.depthFar),this.texture=r}}getMesh(e){if(this.texture!==null&&this.mesh===null){const t=e.cameras[0].viewport,i=new bt({vertexShader:Om,fragmentShader:Bm,uniforms:{depthColor:{value:this.texture},depthWidth:{value:t.z},depthHeight:{value:t.w}}});this.mesh=new kt(new Yi(20,20),i)}return this.mesh}reset(){this.texture=null,this.mesh=null}getDepthTexture(){return this.texture}}class km extends Xi{constructor(e,t){super();const i=this;let r=null,s=1,a=null,o="local-floor",l=1,c=null,u=null,f=null,d=null,m=null,g=null;const _=new zm,p=t.getContextAttributes();let h=null,T=null;const S=[],M=[],P=new Ge;let b=null;const R=new It;R.viewport=new tt;const L=new It;L.viewport=new tt;const E=[R,L],x=new Nm;let w=null,k=null;this.cameraAutoUpdate=!0,this.enabled=!1,this.isPresenting=!1,this.getController=function(H){let K=S[H];return K===void 0&&(K=new js,S[H]=K),K.getTargetRaySpace()},this.getControllerGrip=function(H){let K=S[H];return K===void 0&&(K=new js,S[H]=K),K.getGripSpace()},this.getHand=function(H){let K=S[H];return K===void 0&&(K=new js,S[H]=K),K.getHandSpace()};function O(H){const K=M.indexOf(H.inputSource);if(K===-1)return;const ue=S[K];ue!==void 0&&(ue.update(H.inputSource,H.frame,c||a),ue.dispatchEvent({type:H.type,data:H.inputSource}))}function X(){r.removeEventListener("select",O),r.removeEventListener("selectstart",O),r.removeEventListener("selectend",O),r.removeEventListener("squeeze",O),r.removeEventListener("squeezestart",O),r.removeEventListener("squeezeend",O),r.removeEventListener("end",X),r.removeEventListener("inputsourceschange",Z);for(let H=0;H<S.length;H++){const K=M[H];K!==null&&(M[H]=null,S[H].disconnect(K))}w=null,k=null,_.reset(),e.setRenderTarget(h),m=null,d=null,f=null,r=null,T=null,ke.stop(),i.isPresenting=!1,e.setPixelRatio(b),e.setSize(P.width,P.height,!1),i.dispatchEvent({type:"sessionend"})}this.setFramebufferScaleFactor=function(H){s=H,i.isPresenting===!0&&console.warn("THREE.WebXRManager: Cannot change framebuffer scale while presenting.")},this.setReferenceSpaceType=function(H){o=H,i.isPresenting===!0&&console.warn("THREE.WebXRManager: Cannot change reference space type while presenting.")},this.getReferenceSpace=function(){return c||a},this.setReferenceSpace=function(H){c=H},this.getBaseLayer=function(){return d!==null?d:m},this.getBinding=function(){return f},this.getFrame=function(){return g},this.getSession=function(){return r},this.setSession=async function(H){if(r=H,r!==null){if(h=e.getRenderTarget(),r.addEventListener("select",O),r.addEventListener("selectstart",O),r.addEventListener("selectend",O),r.addEventListener("squeeze",O),r.addEventListener("squeezestart",O),r.addEventListener("squeezeend",O),r.addEventListener("end",X),r.addEventListener("inputsourceschange",Z),p.xrCompatible!==!0&&await t.makeXRCompatible(),b=e.getPixelRatio(),e.getSize(P),r.renderState.layers===void 0){const K={antialias:p.antialias,alpha:!0,depth:p.depth,stencil:p.stencil,framebufferScaleFactor:s};m=new XRWebGLLayer(r,t,K),r.updateRenderState({baseLayer:m}),e.setPixelRatio(1),e.setSize(m.framebufferWidth,m.framebufferHeight,!1),T=new Sn(m.framebufferWidth,m.framebufferHeight,{format:zt,type:Jt,colorSpace:e.outputColorSpace,stencilBuffer:p.stencil})}else{let K=null,ue=null,ne=null;p.depth&&(ne=p.stencil?t.DEPTH24_STENCIL8:t.DEPTH_COMPONENT24,K=p.stencil?Bi:Di,ue=p.stencil?Oi:ci);const Ee={colorFormat:t.RGBA8,depthFormat:ne,scaleFactor:s};f=new XRWebGLBinding(r,t),d=f.createProjectionLayer(Ee),r.updateRenderState({layers:[d]}),e.setPixelRatio(1),e.setSize(d.textureWidth,d.textureHeight,!1),T=new Sn(d.textureWidth,d.textureHeight,{format:zt,type:Jt,depthTexture:new ac(d.textureWidth,d.textureHeight,ue,void 0,void 0,void 0,void 0,void 0,void 0,K),stencilBuffer:p.stencil,colorSpace:e.outputColorSpace,samples:p.antialias?4:0,resolveDepthBuffer:d.ignoreDepthValues===!1})}T.isXRRenderTarget=!0,this.setFoveation(l),c=null,a=await r.requestReferenceSpace(o),ke.setContext(r),ke.start(),i.isPresenting=!0,i.dispatchEvent({type:"sessionstart"})}},this.getEnvironmentBlendMode=function(){if(r!==null)return r.environmentBlendMode},this.getDepthTexture=function(){return _.getDepthTexture()};function Z(H){for(let K=0;K<H.removed.length;K++){const ue=H.removed[K],ne=M.indexOf(ue);ne>=0&&(M[ne]=null,S[ne].disconnect(ue))}for(let K=0;K<H.added.length;K++){const ue=H.added[K];let ne=M.indexOf(ue);if(ne===-1){for(let we=0;we<S.length;we++)if(we>=M.length){M.push(ue),ne=we;break}else if(M[we]===null){M[we]=ue,ne=we;break}if(ne===-1)break}const Ee=S[ne];Ee&&Ee.connect(ue)}}const G=new N,$=new N;function V(H,K,ue){G.setFromMatrixPosition(K.matrixWorld),$.setFromMatrixPosition(ue.matrixWorld);const ne=G.distanceTo($),Ee=K.projectionMatrix.elements,we=ue.projectionMatrix.elements,Ce=Ee[14]/(Ee[10]-1),de=Ee[14]/(Ee[10]+1),ae=(Ee[9]+1)/Ee[5],Fe=(Ee[9]-1)/Ee[5],C=(Ee[8]-1)/Ee[0],We=(we[8]+1)/we[0],Re=Ce*C,Pe=Ce*We,_e=ne/(-C+We),Ye=_e*-C;if(K.matrixWorld.decompose(H.position,H.quaternion,H.scale),H.translateX(Ye),H.translateZ(_e),H.matrixWorld.compose(H.position,H.quaternion,H.scale),H.matrixWorldInverse.copy(H.matrixWorld).invert(),Ee[10]===-1)H.projectionMatrix.copy(K.projectionMatrix),H.projectionMatrixInverse.copy(K.projectionMatrixInverse);else{const xe=Ce+_e,A=de+_e,v=Re-Ye,F=Pe+(ne-Ye),Y=ae*de/A*xe,J=Fe*de/A*xe;H.projectionMatrix.makePerspective(v,F,Y,J,xe,A),H.projectionMatrixInverse.copy(H.projectionMatrix).invert()}}function re(H,K){K===null?H.matrixWorld.copy(H.matrix):H.matrixWorld.multiplyMatrices(K.matrixWorld,H.matrix),H.matrixWorldInverse.copy(H.matrixWorld).invert()}this.updateCamera=function(H){if(r===null)return;let K=H.near,ue=H.far;_.texture!==null&&(_.depthNear>0&&(K=_.depthNear),_.depthFar>0&&(ue=_.depthFar)),x.near=L.near=R.near=K,x.far=L.far=R.far=ue,(w!==x.near||k!==x.far)&&(r.updateRenderState({depthNear:x.near,depthFar:x.far}),w=x.near,k=x.far),R.layers.mask=H.layers.mask|2,L.layers.mask=H.layers.mask|4,x.layers.mask=R.layers.mask|L.layers.mask;const ne=H.parent,Ee=x.cameras;re(x,ne);for(let we=0;we<Ee.length;we++)re(Ee[we],ne);Ee.length===2?V(x,R,L):x.projectionMatrix.copy(R.projectionMatrix),Q(H,x,ne)};function Q(H,K,ue){ue===null?H.matrix.copy(K.matrixWorld):(H.matrix.copy(ue.matrixWorld),H.matrix.invert(),H.matrix.multiply(K.matrixWorld)),H.matrix.decompose(H.position,H.quaternion,H.scale),H.updateMatrixWorld(!0),H.projectionMatrix.copy(K.projectionMatrix),H.projectionMatrixInverse.copy(K.projectionMatrixInverse),H.isPerspectiveCamera&&(H.fov=Va*2*Math.atan(1/H.projectionMatrix.elements[5]),H.zoom=1)}this.getCamera=function(){return x},this.getFoveation=function(){if(!(d===null&&m===null))return l},this.setFoveation=function(H){l=H,d!==null&&(d.fixedFoveation=H),m!==null&&m.fixedFoveation!==void 0&&(m.fixedFoveation=H)},this.hasDepthSensing=function(){return _.texture!==null},this.getDepthSensingMesh=function(){return _.getMesh(x)};let se=null;function be(H,K){if(u=K.getViewerPose(c||a),g=K,u!==null){const ue=u.views;m!==null&&(e.setRenderTargetFramebuffer(T,m.framebuffer),e.setRenderTarget(T));let ne=!1;ue.length!==x.cameras.length&&(x.cameras.length=0,ne=!0);for(let we=0;we<ue.length;we++){const Ce=ue[we];let de=null;if(m!==null)de=m.getViewport(Ce);else{const Fe=f.getViewSubImage(d,Ce);de=Fe.viewport,we===0&&(e.setRenderTargetTextures(T,Fe.colorTexture,d.ignoreDepthValues?void 0:Fe.depthStencilTexture),e.setRenderTarget(T))}let ae=E[we];ae===void 0&&(ae=new It,ae.layers.enable(we),ae.viewport=new tt,E[we]=ae),ae.matrix.fromArray(Ce.transform.matrix),ae.matrix.decompose(ae.position,ae.quaternion,ae.scale),ae.projectionMatrix.fromArray(Ce.projectionMatrix),ae.projectionMatrixInverse.copy(ae.projectionMatrix).invert(),ae.viewport.set(de.x,de.y,de.width,de.height),we===0&&(x.matrix.copy(ae.matrix),x.matrix.decompose(x.position,x.quaternion,x.scale)),ne===!0&&x.cameras.push(ae)}const Ee=r.enabledFeatures;if(Ee&&Ee.includes("depth-sensing")){const we=f.getDepthInformation(ue[0]);we&&we.isValid&&we.texture&&_.init(e,we,r.renderState)}}for(let ue=0;ue<S.length;ue++){const ne=M[ue],Ee=S[ue];ne!==null&&Ee!==void 0&&Ee.update(ne,K,c||a)}se&&se(H,K),K.detectedPlanes&&i.dispatchEvent({type:"planesdetected",data:K}),g=null}const ke=new rc;ke.setAnimationLoop(be),this.setAnimationLoop=function(H){se=H},this.dispose=function(){}}}const $n=new yn,Gm=new st;function Hm(n,e){function t(p,h){p.matrixAutoUpdate===!0&&p.updateMatrix(),h.value.copy(p.matrix)}function i(p,h){h.color.getRGB(p.fogColor.value,ec(n)),h.isFog?(p.fogNear.value=h.near,p.fogFar.value=h.far):h.isFogExp2&&(p.fogDensity.value=h.density)}function r(p,h,T,S,M){h.isMeshBasicMaterial||h.isMeshLambertMaterial?s(p,h):h.isMeshToonMaterial?(s(p,h),f(p,h)):h.isMeshPhongMaterial?(s(p,h),u(p,h)):h.isMeshStandardMaterial?(s(p,h),d(p,h),h.isMeshPhysicalMaterial&&m(p,h,M)):h.isMeshMatcapMaterial?(s(p,h),g(p,h)):h.isMeshDepthMaterial?s(p,h):h.isMeshDistanceMaterial?(s(p,h),_(p,h)):h.isMeshNormalMaterial?s(p,h):h.isLineBasicMaterial?(a(p,h),h.isLineDashedMaterial&&o(p,h)):h.isPointsMaterial?l(p,h,T,S):h.isSpriteMaterial?c(p,h):h.isShadowMaterial?(p.color.value.copy(h.color),p.opacity.value=h.opacity):h.isShaderMaterial&&(h.uniformsNeedUpdate=!1)}function s(p,h){p.opacity.value=h.opacity,h.color&&p.diffuse.value.copy(h.color),h.emissive&&p.emissive.value.copy(h.emissive).multiplyScalar(h.emissiveIntensity),h.map&&(p.map.value=h.map,t(h.map,p.mapTransform)),h.alphaMap&&(p.alphaMap.value=h.alphaMap,t(h.alphaMap,p.alphaMapTransform)),h.bumpMap&&(p.bumpMap.value=h.bumpMap,t(h.bumpMap,p.bumpMapTransform),p.bumpScale.value=h.bumpScale,h.side===wt&&(p.bumpScale.value*=-1)),h.normalMap&&(p.normalMap.value=h.normalMap,t(h.normalMap,p.normalMapTransform),p.normalScale.value.copy(h.normalScale),h.side===wt&&p.normalScale.value.negate()),h.displacementMap&&(p.displacementMap.value=h.displacementMap,t(h.displacementMap,p.displacementMapTransform),p.displacementScale.value=h.displacementScale,p.displacementBias.value=h.displacementBias),h.emissiveMap&&(p.emissiveMap.value=h.emissiveMap,t(h.emissiveMap,p.emissiveMapTransform)),h.specularMap&&(p.specularMap.value=h.specularMap,t(h.specularMap,p.specularMapTransform)),h.alphaTest>0&&(p.alphaTest.value=h.alphaTest);const T=e.get(h),S=T.envMap,M=T.envMapRotation;S&&(p.envMap.value=S,$n.copy(M),$n.x*=-1,$n.y*=-1,$n.z*=-1,S.isCubeTexture&&S.isRenderTargetTexture===!1&&($n.y*=-1,$n.z*=-1),p.envMapRotation.value.setFromMatrix4(Gm.makeRotationFromEuler($n)),p.flipEnvMap.value=S.isCubeTexture&&S.isRenderTargetTexture===!1?-1:1,p.reflectivity.value=h.reflectivity,p.ior.value=h.ior,p.refractionRatio.value=h.refractionRatio),h.lightMap&&(p.lightMap.value=h.lightMap,p.lightMapIntensity.value=h.lightMapIntensity,t(h.lightMap,p.lightMapTransform)),h.aoMap&&(p.aoMap.value=h.aoMap,p.aoMapIntensity.value=h.aoMapIntensity,t(h.aoMap,p.aoMapTransform))}function a(p,h){p.diffuse.value.copy(h.color),p.opacity.value=h.opacity,h.map&&(p.map.value=h.map,t(h.map,p.mapTransform))}function o(p,h){p.dashSize.value=h.dashSize,p.totalSize.value=h.dashSize+h.gapSize,p.scale.value=h.scale}function l(p,h,T,S){p.diffuse.value.copy(h.color),p.opacity.value=h.opacity,p.size.value=h.size*T,p.scale.value=S*.5,h.map&&(p.map.value=h.map,t(h.map,p.uvTransform)),h.alphaMap&&(p.alphaMap.value=h.alphaMap,t(h.alphaMap,p.alphaMapTransform)),h.alphaTest>0&&(p.alphaTest.value=h.alphaTest)}function c(p,h){p.diffuse.value.copy(h.color),p.opacity.value=h.opacity,p.rotation.value=h.rotation,h.map&&(p.map.value=h.map,t(h.map,p.mapTransform)),h.alphaMap&&(p.alphaMap.value=h.alphaMap,t(h.alphaMap,p.alphaMapTransform)),h.alphaTest>0&&(p.alphaTest.value=h.alphaTest)}function u(p,h){p.specular.value.copy(h.specular),p.shininess.value=Math.max(h.shininess,1e-4)}function f(p,h){h.gradientMap&&(p.gradientMap.value=h.gradientMap)}function d(p,h){p.metalness.value=h.metalness,h.metalnessMap&&(p.metalnessMap.value=h.metalnessMap,t(h.metalnessMap,p.metalnessMapTransform)),p.roughness.value=h.roughness,h.roughnessMap&&(p.roughnessMap.value=h.roughnessMap,t(h.roughnessMap,p.roughnessMapTransform)),h.envMap&&(p.envMapIntensity.value=h.envMapIntensity)}function m(p,h,T){p.ior.value=h.ior,h.sheen>0&&(p.sheenColor.value.copy(h.sheenColor).multiplyScalar(h.sheen),p.sheenRoughness.value=h.sheenRoughness,h.sheenColorMap&&(p.sheenColorMap.value=h.sheenColorMap,t(h.sheenColorMap,p.sheenColorMapTransform)),h.sheenRoughnessMap&&(p.sheenRoughnessMap.value=h.sheenRoughnessMap,t(h.sheenRoughnessMap,p.sheenRoughnessMapTransform))),h.clearcoat>0&&(p.clearcoat.value=h.clearcoat,p.clearcoatRoughness.value=h.clearcoatRoughness,h.clearcoatMap&&(p.clearcoatMap.value=h.clearcoatMap,t(h.clearcoatMap,p.clearcoatMapTransform)),h.clearcoatRoughnessMap&&(p.clearcoatRoughnessMap.value=h.clearcoatRoughnessMap,t(h.clearcoatRoughnessMap,p.clearcoatRoughnessMapTransform)),h.clearcoatNormalMap&&(p.clearcoatNormalMap.value=h.clearcoatNormalMap,t(h.clearcoatNormalMap,p.clearcoatNormalMapTransform),p.clearcoatNormalScale.value.copy(h.clearcoatNormalScale),h.side===wt&&p.clearcoatNormalScale.value.negate())),h.dispersion>0&&(p.dispersion.value=h.dispersion),h.iridescence>0&&(p.iridescence.value=h.iridescence,p.iridescenceIOR.value=h.iridescenceIOR,p.iridescenceThicknessMinimum.value=h.iridescenceThicknessRange[0],p.iridescenceThicknessMaximum.value=h.iridescenceThicknessRange[1],h.iridescenceMap&&(p.iridescenceMap.value=h.iridescenceMap,t(h.iridescenceMap,p.iridescenceMapTransform)),h.iridescenceThicknessMap&&(p.iridescenceThicknessMap.value=h.iridescenceThicknessMap,t(h.iridescenceThicknessMap,p.iridescenceThicknessMapTransform))),h.transmission>0&&(p.transmission.value=h.transmission,p.transmissionSamplerMap.value=T.texture,p.transmissionSamplerSize.value.set(T.width,T.height),h.transmissionMap&&(p.transmissionMap.value=h.transmissionMap,t(h.transmissionMap,p.transmissionMapTransform)),p.thickness.value=h.thickness,h.thicknessMap&&(p.thicknessMap.value=h.thicknessMap,t(h.thicknessMap,p.thicknessMapTransform)),p.attenuationDistance.value=h.attenuationDistance,p.attenuationColor.value.copy(h.attenuationColor)),h.anisotropy>0&&(p.anisotropyVector.value.set(h.anisotropy*Math.cos(h.anisotropyRotation),h.anisotropy*Math.sin(h.anisotropyRotation)),h.anisotropyMap&&(p.anisotropyMap.value=h.anisotropyMap,t(h.anisotropyMap,p.anisotropyMapTransform))),p.specularIntensity.value=h.specularIntensity,p.specularColor.value.copy(h.specularColor),h.specularColorMap&&(p.specularColorMap.value=h.specularColorMap,t(h.specularColorMap,p.specularColorMapTransform)),h.specularIntensityMap&&(p.specularIntensityMap.value=h.specularIntensityMap,t(h.specularIntensityMap,p.specularIntensityMapTransform))}function g(p,h){h.matcap&&(p.matcap.value=h.matcap)}function _(p,h){const T=e.get(h).light;p.referencePosition.value.setFromMatrixPosition(T.matrixWorld),p.nearDistance.value=T.shadow.camera.near,p.farDistance.value=T.shadow.camera.far}return{refreshFogUniforms:i,refreshMaterialUniforms:r}}function Vm(n,e,t,i){let r={},s={},a=[];const o=n.getParameter(n.MAX_UNIFORM_BUFFER_BINDINGS);function l(T,S){const M=S.program;i.uniformBlockBinding(T,M)}function c(T,S){let M=r[T.id];M===void 0&&(g(T),M=u(T),r[T.id]=M,T.addEventListener("dispose",p));const P=S.program;i.updateUBOMapping(T,P);const b=e.render.frame;s[T.id]!==b&&(d(T),s[T.id]=b)}function u(T){const S=f();T.__bindingPointIndex=S;const M=n.createBuffer(),P=T.__size,b=T.usage;return n.bindBuffer(n.UNIFORM_BUFFER,M),n.bufferData(n.UNIFORM_BUFFER,P,b),n.bindBuffer(n.UNIFORM_BUFFER,null),n.bindBufferBase(n.UNIFORM_BUFFER,S,M),M}function f(){for(let T=0;T<o;T++)if(a.indexOf(T)===-1)return a.push(T),T;return console.error("THREE.WebGLRenderer: Maximum number of simultaneously usable uniforms groups reached."),0}function d(T){const S=r[T.id],M=T.uniforms,P=T.__cache;n.bindBuffer(n.UNIFORM_BUFFER,S);for(let b=0,R=M.length;b<R;b++){const L=Array.isArray(M[b])?M[b]:[M[b]];for(let E=0,x=L.length;E<x;E++){const w=L[E];if(m(w,b,E,P)===!0){const k=w.__offset,O=Array.isArray(w.value)?w.value:[w.value];let X=0;for(let Z=0;Z<O.length;Z++){const G=O[Z],$=_(G);typeof G=="number"||typeof G=="boolean"?(w.__data[0]=G,n.bufferSubData(n.UNIFORM_BUFFER,k+X,w.__data)):G.isMatrix3?(w.__data[0]=G.elements[0],w.__data[1]=G.elements[1],w.__data[2]=G.elements[2],w.__data[3]=0,w.__data[4]=G.elements[3],w.__data[5]=G.elements[4],w.__data[6]=G.elements[5],w.__data[7]=0,w.__data[8]=G.elements[6],w.__data[9]=G.elements[7],w.__data[10]=G.elements[8],w.__data[11]=0):(G.toArray(w.__data,X),X+=$.storage/Float32Array.BYTES_PER_ELEMENT)}n.bufferSubData(n.UNIFORM_BUFFER,k,w.__data)}}}n.bindBuffer(n.UNIFORM_BUFFER,null)}function m(T,S,M,P){const b=T.value,R=S+"_"+M;if(P[R]===void 0)return typeof b=="number"||typeof b=="boolean"?P[R]=b:P[R]=b.clone(),!0;{const L=P[R];if(typeof b=="number"||typeof b=="boolean"){if(L!==b)return P[R]=b,!0}else if(L.equals(b)===!1)return L.copy(b),!0}return!1}function g(T){const S=T.uniforms;let M=0;const P=16;for(let R=0,L=S.length;R<L;R++){const E=Array.isArray(S[R])?S[R]:[S[R]];for(let x=0,w=E.length;x<w;x++){const k=E[x],O=Array.isArray(k.value)?k.value:[k.value];for(let X=0,Z=O.length;X<Z;X++){const G=O[X],$=_(G),V=M%P,re=V%$.boundary,Q=V+re;M+=re,Q!==0&&P-Q<$.storage&&(M+=P-Q),k.__data=new Float32Array($.storage/Float32Array.BYTES_PER_ELEMENT),k.__offset=M,M+=$.storage}}}const b=M%P;return b>0&&(M+=P-b),T.__size=M,T.__cache={},this}function _(T){const S={boundary:0,storage:0};return typeof T=="number"||typeof T=="boolean"?(S.boundary=4,S.storage=4):T.isVector2?(S.boundary=8,S.storage=8):T.isVector3||T.isColor?(S.boundary=16,S.storage=12):T.isVector4?(S.boundary=16,S.storage=16):T.isMatrix3?(S.boundary=48,S.storage=48):T.isMatrix4?(S.boundary=64,S.storage=64):T.isTexture?console.warn("THREE.WebGLRenderer: Texture samplers can not be part of an uniforms group."):console.warn("THREE.WebGLRenderer: Unsupported uniform value type.",T),S}function p(T){const S=T.target;S.removeEventListener("dispose",p);const M=a.indexOf(S.__bindingPointIndex);a.splice(M,1),n.deleteBuffer(r[S.id]),delete r[S.id],delete s[S.id]}function h(){for(const T in r)n.deleteBuffer(r[T]);a=[],r={},s={}}return{bind:l,update:c,dispose:h}}class Wm{constructor(e={}){const{canvas:t=Du(),context:i=null,depth:r=!0,stencil:s=!1,alpha:a=!1,antialias:o=!1,premultipliedAlpha:l=!0,preserveDrawingBuffer:c=!1,powerPreference:u="default",failIfMajorPerformanceCaveat:f=!1,reverseDepthBuffer:d=!1}=e;this.isWebGLRenderer=!0;let m;if(i!==null){if(typeof WebGLRenderingContext<"u"&&i instanceof WebGLRenderingContext)throw new Error("THREE.WebGLRenderer: WebGL 1 is not supported since r163.");m=i.getContextAttributes().alpha}else m=a;const g=new Uint32Array(4),_=new Int32Array(4);let p=null,h=null;const T=[],S=[];this.domElement=t,this.debug={checkShaderErrors:!0,onShaderError:null},this.autoClear=!0,this.autoClearColor=!0,this.autoClearDepth=!0,this.autoClearStencil=!0,this.sortObjects=!0,this.clippingPlanes=[],this.localClippingEnabled=!1,this._outputColorSpace=Ot,this.toneMapping=Bn,this.toneMappingExposure=1;const M=this;let P=!1,b=0,R=0,L=null,E=-1,x=null;const w=new tt,k=new tt;let O=null;const X=new Je(0);let Z=0,G=t.width,$=t.height,V=1,re=null,Q=null;const se=new tt(0,0,G,$),be=new tt(0,0,G,$);let ke=!1;const H=new ic;let K=!1,ue=!1;const ne=new st,Ee=new st,we=new N,Ce=new tt,de={background:null,fog:null,environment:null,overrideMaterial:null,isScene:!0};let ae=!1;function Fe(){return L===null?V:1}let C=i;function We(y,I){return t.getContext(y,I)}try{const y={alpha:!0,depth:r,stencil:s,antialias:o,premultipliedAlpha:l,preserveDrawingBuffer:c,powerPreference:u,failIfMajorPerformanceCaveat:f};if("setAttribute"in t&&t.setAttribute("data-engine",`three.js r${ja}`),t.addEventListener("webglcontextlost",j,!1),t.addEventListener("webglcontextrestored",me,!1),t.addEventListener("webglcontextcreationerror",he,!1),C===null){const I="webgl2";if(C=We(I,y),C===null)throw We(I)?new Error("Error creating WebGL context with your selected attributes."):new Error("Error creating WebGL context.")}}catch(y){throw console.error("THREE.WebGLRenderer: "+y.message),y}let Re,Pe,_e,Ye,xe,A,v,F,Y,J,q,ve,te,le,De,ee,ge,Ae,Le,pe,He,Ie,Ke,D;function ce(){Re=new $d(C),Re.init(),Ie=new Um(C,Re),Pe=new Vd(C,Re,e,Ie),_e=new Dm(C,Re),Pe.reverseDepthBuffer&&d&&_e.buffers.depth.setReversed(!0),Ye=new Jd(C),xe=new gm,A=new Im(C,Re,_e,xe,Pe,Ie,Ye),v=new Xd(M),F=new Kd(M),Y=new rh(C),Ke=new Gd(C,Y),J=new Zd(C,Y,Ye,Ke),q=new ep(C,J,Y,Ye),Le=new Qd(C,Pe,A),ee=new Wd(xe),ve=new mm(M,v,F,Re,Pe,Ke,ee),te=new Hm(M,xe),le=new vm,De=new Tm(Re),Ae=new kd(M,v,F,_e,q,m,l),ge=new Cm(M,q,Pe),D=new Vm(C,Ye,Pe,_e),pe=new Hd(C,Re,Ye),He=new jd(C,Re,Ye),Ye.programs=ve.programs,M.capabilities=Pe,M.extensions=Re,M.properties=xe,M.renderLists=le,M.shadowMap=ge,M.state=_e,M.info=Ye}ce();const W=new km(M,C);this.xr=W,this.getContext=function(){return C},this.getContextAttributes=function(){return C.getContextAttributes()},this.forceContextLoss=function(){const y=Re.get("WEBGL_lose_context");y&&y.loseContext()},this.forceContextRestore=function(){const y=Re.get("WEBGL_lose_context");y&&y.restoreContext()},this.getPixelRatio=function(){return V},this.setPixelRatio=function(y){y!==void 0&&(V=y,this.setSize(G,$,!1))},this.getSize=function(y){return y.set(G,$)},this.setSize=function(y,I,B=!0){if(W.isPresenting){console.warn("THREE.WebGLRenderer: Can't change size while VR device is presenting.");return}G=y,$=I,t.width=Math.floor(y*V),t.height=Math.floor(I*V),B===!0&&(t.style.width=y+"px",t.style.height=I+"px"),this.setViewport(0,0,y,I)},this.getDrawingBufferSize=function(y){return y.set(G*V,$*V).floor()},this.setDrawingBufferSize=function(y,I,B){G=y,$=I,V=B,t.width=Math.floor(y*B),t.height=Math.floor(I*B),this.setViewport(0,0,y,I)},this.getCurrentViewport=function(y){return y.copy(w)},this.getViewport=function(y){return y.copy(se)},this.setViewport=function(y,I,B,z){y.isVector4?se.set(y.x,y.y,y.z,y.w):se.set(y,I,B,z),_e.viewport(w.copy(se).multiplyScalar(V).round())},this.getScissor=function(y){return y.copy(be)},this.setScissor=function(y,I,B,z){y.isVector4?be.set(y.x,y.y,y.z,y.w):be.set(y,I,B,z),_e.scissor(k.copy(be).multiplyScalar(V).round())},this.getScissorTest=function(){return ke},this.setScissorTest=function(y){_e.setScissorTest(ke=y)},this.setOpaqueSort=function(y){re=y},this.setTransparentSort=function(y){Q=y},this.getClearColor=function(y){return y.copy(Ae.getClearColor())},this.setClearColor=function(){Ae.setClearColor.apply(Ae,arguments)},this.getClearAlpha=function(){return Ae.getClearAlpha()},this.setClearAlpha=function(){Ae.setClearAlpha.apply(Ae,arguments)},this.clear=function(y=!0,I=!0,B=!0){let z=0;if(y){let U=!1;if(L!==null){const ie=L.texture.format;U=ie===io||ie===no||ie===to}if(U){const ie=L.texture.type,fe=ie===Jt||ie===ci||ie===hr||ie===Oi||ie===Qa||ie===eo,Me=Ae.getClearColor(),Se=Ae.getClearAlpha(),Ue=Me.r,Be=Me.g,ye=Me.b;fe?(g[0]=Ue,g[1]=Be,g[2]=ye,g[3]=Se,C.clearBufferuiv(C.COLOR,0,g)):(_[0]=Ue,_[1]=Be,_[2]=ye,_[3]=Se,C.clearBufferiv(C.COLOR,0,_))}else z|=C.COLOR_BUFFER_BIT}I&&(z|=C.DEPTH_BUFFER_BIT),B&&(z|=C.STENCIL_BUFFER_BIT,this.state.buffers.stencil.setMask(4294967295)),C.clear(z)},this.clearColor=function(){this.clear(!0,!1,!1)},this.clearDepth=function(){this.clear(!1,!0,!1)},this.clearStencil=function(){this.clear(!1,!1,!0)},this.dispose=function(){t.removeEventListener("webglcontextlost",j,!1),t.removeEventListener("webglcontextrestored",me,!1),t.removeEventListener("webglcontextcreationerror",he,!1),le.dispose(),De.dispose(),xe.dispose(),v.dispose(),F.dispose(),q.dispose(),Ke.dispose(),D.dispose(),ve.dispose(),W.dispose(),W.removeEventListener("sessionstart",uo),W.removeEventListener("sessionend",ho),Hn.stop()};function j(y){y.preventDefault(),console.log("THREE.WebGLRenderer: Context Lost."),P=!0}function me(){console.log("THREE.WebGLRenderer: Context Restored."),P=!1;const y=Ye.autoReset,I=ge.enabled,B=ge.autoUpdate,z=ge.needsUpdate,U=ge.type;ce(),Ye.autoReset=y,ge.enabled=I,ge.autoUpdate=B,ge.needsUpdate=z,ge.type=U}function he(y){console.error("THREE.WebGLRenderer: A WebGL context could not be created. Reason: ",y.statusMessage)}function Oe(y){const I=y.target;I.removeEventListener("dispose",Oe),at(I)}function at(y){_t(y),xe.remove(y)}function _t(y){const I=xe.get(y).programs;I!==void 0&&(I.forEach(function(B){ve.releaseProgram(B)}),y.isShaderMaterial&&ve.releaseShaderCache(y))}this.renderBufferDirect=function(y,I,B,z,U,ie){I===null&&(I=de);const fe=U.isMesh&&U.matrixWorld.determinant()<0,Me=Dc(y,I,B,z,U);_e.setMaterial(z,fe);let Se=B.index,Ue=1;if(z.wireframe===!0){if(Se=J.getWireframeAttribute(B),Se===void 0)return;Ue=2}const Be=B.drawRange,ye=B.attributes.position;let qe=Be.start*Ue,et=(Be.start+Be.count)*Ue;ie!==null&&(qe=Math.max(qe,ie.start*Ue),et=Math.min(et,(ie.start+ie.count)*Ue)),Se!==null?(qe=Math.max(qe,0),et=Math.min(et,Se.count)):ye!=null&&(qe=Math.max(qe,0),et=Math.min(et,ye.count));const nt=et-qe;if(nt<0||nt===1/0)return;Ke.setup(U,z,Me,B,Se);let Et,$e=pe;if(Se!==null&&(Et=Y.get(Se),$e=He,$e.setIndex(Et)),U.isMesh)z.wireframe===!0?(_e.setLineWidth(z.wireframeLinewidth*Fe()),$e.setMode(C.LINES)):$e.setMode(C.TRIANGLES);else if(U.isLine){let Te=z.linewidth;Te===void 0&&(Te=1),_e.setLineWidth(Te*Fe()),U.isLineSegments?$e.setMode(C.LINES):U.isLineLoop?$e.setMode(C.LINE_LOOP):$e.setMode(C.LINE_STRIP)}else U.isPoints?$e.setMode(C.POINTS):U.isSprite&&$e.setMode(C.TRIANGLES);if(U.isBatchedMesh)if(U._multiDrawInstances!==null)$e.renderMultiDrawInstances(U._multiDrawStarts,U._multiDrawCounts,U._multiDrawCount,U._multiDrawInstances);else if(Re.get("WEBGL_multi_draw"))$e.renderMultiDraw(U._multiDrawStarts,U._multiDrawCounts,U._multiDrawCount);else{const Te=U._multiDrawStarts,cn=U._multiDrawCounts,Ze=U._multiDrawCount,Wt=Se?Y.get(Se).bytesPerElement:1,ui=xe.get(z).currentProgram.getUniforms();for(let Pt=0;Pt<Ze;Pt++)ui.setValue(C,"_gl_DrawID",Pt),$e.render(Te[Pt]/Wt,cn[Pt])}else if(U.isInstancedMesh)$e.renderInstances(qe,nt,U.count);else if(B.isInstancedBufferGeometry){const Te=B._maxInstanceCount!==void 0?B._maxInstanceCount:1/0,cn=Math.min(B.instanceCount,Te);$e.renderInstances(qe,nt,cn)}else $e.render(qe,nt)};function je(y,I,B){y.transparent===!0&&y.side===rn&&y.forceSinglePass===!1?(y.side=wt,y.needsUpdate=!0,Sr(y,I,B),y.side=kn,y.needsUpdate=!0,Sr(y,I,B),y.side=rn):Sr(y,I,B)}this.compile=function(y,I,B=null){B===null&&(B=y),h=De.get(B),h.init(I),S.push(h),B.traverseVisible(function(U){U.isLight&&U.layers.test(I.layers)&&(h.pushLight(U),U.castShadow&&h.pushShadow(U))}),y!==B&&y.traverseVisible(function(U){U.isLight&&U.layers.test(I.layers)&&(h.pushLight(U),U.castShadow&&h.pushShadow(U))}),h.setupLights();const z=new Set;return y.traverse(function(U){if(!(U.isMesh||U.isPoints||U.isLine||U.isSprite))return;const ie=U.material;if(ie)if(Array.isArray(ie))for(let fe=0;fe<ie.length;fe++){const Me=ie[fe];je(Me,B,U),z.add(Me)}else je(ie,B,U),z.add(ie)}),S.pop(),h=null,z},this.compileAsync=function(y,I,B=null){const z=this.compile(y,I,B);return new Promise(U=>{function ie(){if(z.forEach(function(fe){xe.get(fe).currentProgram.isReady()&&z.delete(fe)}),z.size===0){U(y);return}setTimeout(ie,10)}Re.get("KHR_parallel_shader_compile")!==null?ie():setTimeout(ie,10)})};let Vt=null;function ln(y){Vt&&Vt(y)}function uo(){Hn.stop()}function ho(){Hn.start()}const Hn=new rc;Hn.setAnimationLoop(ln),typeof self<"u"&&Hn.setContext(self),this.setAnimationLoop=function(y){Vt=y,W.setAnimationLoop(y),y===null?Hn.stop():Hn.start()},W.addEventListener("sessionstart",uo),W.addEventListener("sessionend",ho),this.render=function(y,I){if(I!==void 0&&I.isCamera!==!0){console.error("THREE.WebGLRenderer.render: camera is not an instance of THREE.Camera.");return}if(P===!0)return;if(y.matrixWorldAutoUpdate===!0&&y.updateMatrixWorld(),I.parent===null&&I.matrixWorldAutoUpdate===!0&&I.updateMatrixWorld(),W.enabled===!0&&W.isPresenting===!0&&(W.cameraAutoUpdate===!0&&W.updateCamera(I),I=W.getCamera()),y.isScene===!0&&y.onBeforeRender(M,y,I,L),h=De.get(y,S.length),h.init(I),S.push(h),Ee.multiplyMatrices(I.projectionMatrix,I.matrixWorldInverse),H.setFromProjectionMatrix(Ee),ue=this.localClippingEnabled,K=ee.init(this.clippingPlanes,ue),p=le.get(y,T.length),p.init(),T.push(p),W.enabled===!0&&W.isPresenting===!0){const ie=M.xr.getDepthSensingMesh();ie!==null&&Ms(ie,I,-1/0,M.sortObjects)}Ms(y,I,0,M.sortObjects),p.finish(),M.sortObjects===!0&&p.sort(re,Q),ae=W.enabled===!1||W.isPresenting===!1||W.hasDepthSensing()===!1,ae&&Ae.addToRenderList(p,y),this.info.render.frame++,K===!0&&ee.beginShadows();const B=h.state.shadowsArray;ge.render(B,y,I),K===!0&&ee.endShadows(),this.info.autoReset===!0&&this.info.reset();const z=p.opaque,U=p.transmissive;if(h.setupLights(),I.isArrayCamera){const ie=I.cameras;if(U.length>0)for(let fe=0,Me=ie.length;fe<Me;fe++){const Se=ie[fe];po(z,U,y,Se)}ae&&Ae.render(y);for(let fe=0,Me=ie.length;fe<Me;fe++){const Se=ie[fe];fo(p,y,Se,Se.viewport)}}else U.length>0&&po(z,U,y,I),ae&&Ae.render(y),fo(p,y,I);L!==null&&(A.updateMultisampleRenderTarget(L),A.updateRenderTargetMipmap(L)),y.isScene===!0&&y.onAfterRender(M,y,I),Ke.resetDefaultState(),E=-1,x=null,S.pop(),S.length>0?(h=S[S.length-1],K===!0&&ee.setGlobalState(M.clippingPlanes,h.state.camera)):h=null,T.pop(),T.length>0?p=T[T.length-1]:p=null};function Ms(y,I,B,z){if(y.visible===!1)return;if(y.layers.test(I.layers)){if(y.isGroup)B=y.renderOrder;else if(y.isLOD)y.autoUpdate===!0&&y.update(I);else if(y.isLight)h.pushLight(y),y.castShadow&&h.pushShadow(y);else if(y.isSprite){if(!y.frustumCulled||H.intersectsSprite(y)){z&&Ce.setFromMatrixPosition(y.matrixWorld).applyMatrix4(Ee);const fe=q.update(y),Me=y.material;Me.visible&&p.push(y,fe,Me,B,Ce.z,null)}}else if((y.isMesh||y.isLine||y.isPoints)&&(!y.frustumCulled||H.intersectsObject(y))){const fe=q.update(y),Me=y.material;if(z&&(y.boundingSphere!==void 0?(y.boundingSphere===null&&y.computeBoundingSphere(),Ce.copy(y.boundingSphere.center)):(fe.boundingSphere===null&&fe.computeBoundingSphere(),Ce.copy(fe.boundingSphere.center)),Ce.applyMatrix4(y.matrixWorld).applyMatrix4(Ee)),Array.isArray(Me)){const Se=fe.groups;for(let Ue=0,Be=Se.length;Ue<Be;Ue++){const ye=Se[Ue],qe=Me[ye.materialIndex];qe&&qe.visible&&p.push(y,fe,qe,B,Ce.z,ye)}}else Me.visible&&p.push(y,fe,Me,B,Ce.z,null)}}const ie=y.children;for(let fe=0,Me=ie.length;fe<Me;fe++)Ms(ie[fe],I,B,z)}function fo(y,I,B,z){const U=y.opaque,ie=y.transmissive,fe=y.transparent;h.setupLightsView(B),K===!0&&ee.setGlobalState(M.clippingPlanes,B),z&&_e.viewport(w.copy(z)),U.length>0&&Mr(U,I,B),ie.length>0&&Mr(ie,I,B),fe.length>0&&Mr(fe,I,B),_e.buffers.depth.setTest(!0),_e.buffers.depth.setMask(!0),_e.buffers.color.setMask(!0),_e.setPolygonOffset(!1)}function po(y,I,B,z){if((B.isScene===!0?B.overrideMaterial:null)!==null)return;h.state.transmissionRenderTarget[z.id]===void 0&&(h.state.transmissionRenderTarget[z.id]=new Sn(1,1,{generateMipmaps:!0,type:Re.has("EXT_color_buffer_half_float")||Re.has("EXT_color_buffer_float")?mr:Jt,minFilter:ii,samples:4,stencilBuffer:s,resolveDepthBuffer:!1,resolveStencilBuffer:!1,colorSpace:Xe.workingColorSpace}));const ie=h.state.transmissionRenderTarget[z.id],fe=z.viewport||w;ie.setSize(fe.z,fe.w);const Me=M.getRenderTarget();M.setRenderTarget(ie),M.getClearColor(X),Z=M.getClearAlpha(),Z<1&&M.setClearColor(16777215,.5),M.clear(),ae&&Ae.render(B);const Se=M.toneMapping;M.toneMapping=Bn;const Ue=z.viewport;if(z.viewport!==void 0&&(z.viewport=void 0),h.setupLightsView(z),K===!0&&ee.setGlobalState(M.clippingPlanes,z),Mr(y,B,z),A.updateMultisampleRenderTarget(ie),A.updateRenderTargetMipmap(ie),Re.has("WEBGL_multisampled_render_to_texture")===!1){let Be=!1;for(let ye=0,qe=I.length;ye<qe;ye++){const et=I[ye],nt=et.object,Et=et.geometry,$e=et.material,Te=et.group;if($e.side===rn&&nt.layers.test(z.layers)){const cn=$e.side;$e.side=wt,$e.needsUpdate=!0,mo(nt,B,z,Et,$e,Te),$e.side=cn,$e.needsUpdate=!0,Be=!0}}Be===!0&&(A.updateMultisampleRenderTarget(ie),A.updateRenderTargetMipmap(ie))}M.setRenderTarget(Me),M.setClearColor(X,Z),Ue!==void 0&&(z.viewport=Ue),M.toneMapping=Se}function Mr(y,I,B){const z=I.isScene===!0?I.overrideMaterial:null;for(let U=0,ie=y.length;U<ie;U++){const fe=y[U],Me=fe.object,Se=fe.geometry,Ue=z===null?fe.material:z,Be=fe.group;Me.layers.test(B.layers)&&mo(Me,I,B,Se,Ue,Be)}}function mo(y,I,B,z,U,ie){y.onBeforeRender(M,I,B,z,U,ie),y.modelViewMatrix.multiplyMatrices(B.matrixWorldInverse,y.matrixWorld),y.normalMatrix.getNormalMatrix(y.modelViewMatrix),U.onBeforeRender(M,I,B,z,y,ie),U.transparent===!0&&U.side===rn&&U.forceSinglePass===!1?(U.side=wt,U.needsUpdate=!0,M.renderBufferDirect(B,I,z,U,y,ie),U.side=kn,U.needsUpdate=!0,M.renderBufferDirect(B,I,z,U,y,ie),U.side=rn):M.renderBufferDirect(B,I,z,U,y,ie),y.onAfterRender(M,I,B,z,U,ie)}function Sr(y,I,B){I.isScene!==!0&&(I=de);const z=xe.get(y),U=h.state.lights,ie=h.state.shadowsArray,fe=U.state.version,Me=ve.getParameters(y,U.state,ie,I,B),Se=ve.getProgramCacheKey(Me);let Ue=z.programs;z.environment=y.isMeshStandardMaterial?I.environment:null,z.fog=I.fog,z.envMap=(y.isMeshStandardMaterial?F:v).get(y.envMap||z.environment),z.envMapRotation=z.environment!==null&&y.envMap===null?I.environmentRotation:y.envMapRotation,Ue===void 0&&(y.addEventListener("dispose",Oe),Ue=new Map,z.programs=Ue);let Be=Ue.get(Se);if(Be!==void 0){if(z.currentProgram===Be&&z.lightsStateVersion===fe)return _o(y,Me),Be}else Me.uniforms=ve.getUniforms(y),y.onBeforeCompile(Me,M),Be=ve.acquireProgram(Me,Se),Ue.set(Se,Be),z.uniforms=Me.uniforms;const ye=z.uniforms;return(!y.isShaderMaterial&&!y.isRawShaderMaterial||y.clipping===!0)&&(ye.clippingPlanes=ee.uniform),_o(y,Me),z.needsLights=Ic(y),z.lightsStateVersion=fe,z.needsLights&&(ye.ambientLightColor.value=U.state.ambient,ye.lightProbe.value=U.state.probe,ye.directionalLights.value=U.state.directional,ye.directionalLightShadows.value=U.state.directionalShadow,ye.spotLights.value=U.state.spot,ye.spotLightShadows.value=U.state.spotShadow,ye.rectAreaLights.value=U.state.rectArea,ye.ltc_1.value=U.state.rectAreaLTC1,ye.ltc_2.value=U.state.rectAreaLTC2,ye.pointLights.value=U.state.point,ye.pointLightShadows.value=U.state.pointShadow,ye.hemisphereLights.value=U.state.hemi,ye.directionalShadowMap.value=U.state.directionalShadowMap,ye.directionalShadowMatrix.value=U.state.directionalShadowMatrix,ye.spotShadowMap.value=U.state.spotShadowMap,ye.spotLightMatrix.value=U.state.spotLightMatrix,ye.spotLightMap.value=U.state.spotLightMap,ye.pointShadowMap.value=U.state.pointShadowMap,ye.pointShadowMatrix.value=U.state.pointShadowMatrix),z.currentProgram=Be,z.uniformsList=null,Be}function go(y){if(y.uniformsList===null){const I=y.currentProgram.getUniforms();y.uniformsList=ns.seqWithValue(I.seq,y.uniforms)}return y.uniformsList}function _o(y,I){const B=xe.get(y);B.outputColorSpace=I.outputColorSpace,B.batching=I.batching,B.batchingColor=I.batchingColor,B.instancing=I.instancing,B.instancingColor=I.instancingColor,B.instancingMorph=I.instancingMorph,B.skinning=I.skinning,B.morphTargets=I.morphTargets,B.morphNormals=I.morphNormals,B.morphColors=I.morphColors,B.morphTargetsCount=I.morphTargetsCount,B.numClippingPlanes=I.numClippingPlanes,B.numIntersection=I.numClipIntersection,B.vertexAlphas=I.vertexAlphas,B.vertexTangents=I.vertexTangents,B.toneMapping=I.toneMapping}function Dc(y,I,B,z,U){I.isScene!==!0&&(I=de),A.resetTextureUnits();const ie=I.fog,fe=z.isMeshStandardMaterial?I.environment:null,Me=L===null?M.outputColorSpace:L.isXRRenderTarget===!0?L.texture.colorSpace:Wi,Se=(z.isMeshStandardMaterial?F:v).get(z.envMap||fe),Ue=z.vertexColors===!0&&!!B.attributes.color&&B.attributes.color.itemSize===4,Be=!!B.attributes.tangent&&(!!z.normalMap||z.anisotropy>0),ye=!!B.morphAttributes.position,qe=!!B.morphAttributes.normal,et=!!B.morphAttributes.color;let nt=Bn;z.toneMapped&&(L===null||L.isXRRenderTarget===!0)&&(nt=M.toneMapping);const Et=B.morphAttributes.position||B.morphAttributes.normal||B.morphAttributes.color,$e=Et!==void 0?Et.length:0,Te=xe.get(z),cn=h.state.lights;if(K===!0&&(ue===!0||y!==x)){const Ut=y===x&&z.id===E;ee.setState(z,y,Ut)}let Ze=!1;z.version===Te.__version?(Te.needsLights&&Te.lightsStateVersion!==cn.state.version||Te.outputColorSpace!==Me||U.isBatchedMesh&&Te.batching===!1||!U.isBatchedMesh&&Te.batching===!0||U.isBatchedMesh&&Te.batchingColor===!0&&U.colorTexture===null||U.isBatchedMesh&&Te.batchingColor===!1&&U.colorTexture!==null||U.isInstancedMesh&&Te.instancing===!1||!U.isInstancedMesh&&Te.instancing===!0||U.isSkinnedMesh&&Te.skinning===!1||!U.isSkinnedMesh&&Te.skinning===!0||U.isInstancedMesh&&Te.instancingColor===!0&&U.instanceColor===null||U.isInstancedMesh&&Te.instancingColor===!1&&U.instanceColor!==null||U.isInstancedMesh&&Te.instancingMorph===!0&&U.morphTexture===null||U.isInstancedMesh&&Te.instancingMorph===!1&&U.morphTexture!==null||Te.envMap!==Se||z.fog===!0&&Te.fog!==ie||Te.numClippingPlanes!==void 0&&(Te.numClippingPlanes!==ee.numPlanes||Te.numIntersection!==ee.numIntersection)||Te.vertexAlphas!==Ue||Te.vertexTangents!==Be||Te.morphTargets!==ye||Te.morphNormals!==qe||Te.morphColors!==et||Te.toneMapping!==nt||Te.morphTargetsCount!==$e)&&(Ze=!0):(Ze=!0,Te.__version=z.version);let Wt=Te.currentProgram;Ze===!0&&(Wt=Sr(z,I,U));let ui=!1,Pt=!1,$i=!1;const it=Wt.getUniforms(),tn=Te.uniforms;if(_e.useProgram(Wt.program)&&(ui=!0,Pt=!0,$i=!0),z.id!==E&&(E=z.id,Pt=!0),ui||x!==y){_e.buffers.depth.getReversed()?(ne.copy(y.projectionMatrix),Iu(ne),Uu(ne),it.setValue(C,"projectionMatrix",ne)):it.setValue(C,"projectionMatrix",y.projectionMatrix),it.setValue(C,"viewMatrix",y.matrixWorldInverse);const An=it.map.cameraPosition;An!==void 0&&An.setValue(C,we.setFromMatrixPosition(y.matrixWorld)),Pe.logarithmicDepthBuffer&&it.setValue(C,"logDepthBufFC",2/(Math.log(y.far+1)/Math.LN2)),(z.isMeshPhongMaterial||z.isMeshToonMaterial||z.isMeshLambertMaterial||z.isMeshBasicMaterial||z.isMeshStandardMaterial||z.isShaderMaterial)&&it.setValue(C,"isOrthographic",y.isOrthographicCamera===!0),x!==y&&(x=y,Pt=!0,$i=!0)}if(U.isSkinnedMesh){it.setOptional(C,U,"bindMatrix"),it.setOptional(C,U,"bindMatrixInverse");const Ut=U.skeleton;Ut&&(Ut.boneTexture===null&&Ut.computeBoneTexture(),it.setValue(C,"boneTexture",Ut.boneTexture,A))}U.isBatchedMesh&&(it.setOptional(C,U,"batchingTexture"),it.setValue(C,"batchingTexture",U._matricesTexture,A),it.setOptional(C,U,"batchingIdTexture"),it.setValue(C,"batchingIdTexture",U._indirectTexture,A),it.setOptional(C,U,"batchingColorTexture"),U._colorsTexture!==null&&it.setValue(C,"batchingColorTexture",U._colorsTexture,A));const Zi=B.morphAttributes;if((Zi.position!==void 0||Zi.normal!==void 0||Zi.color!==void 0)&&Le.update(U,B,Wt),(Pt||Te.receiveShadow!==U.receiveShadow)&&(Te.receiveShadow=U.receiveShadow,it.setValue(C,"receiveShadow",U.receiveShadow)),z.isMeshGouraudMaterial&&z.envMap!==null&&(tn.envMap.value=Se,tn.flipEnvMap.value=Se.isCubeTexture&&Se.isRenderTargetTexture===!1?-1:1),z.isMeshStandardMaterial&&z.envMap===null&&I.environment!==null&&(tn.envMapIntensity.value=I.environmentIntensity),Pt&&(it.setValue(C,"toneMappingExposure",M.toneMappingExposure),Te.needsLights&&Lc(tn,$i),ie&&z.fog===!0&&te.refreshFogUniforms(tn,ie),te.refreshMaterialUniforms(tn,z,V,$,h.state.transmissionRenderTarget[y.id]),ns.upload(C,go(Te),tn,A)),z.isShaderMaterial&&z.uniformsNeedUpdate===!0&&(ns.upload(C,go(Te),tn,A),z.uniformsNeedUpdate=!1),z.isSpriteMaterial&&it.setValue(C,"center",U.center),it.setValue(C,"modelViewMatrix",U.modelViewMatrix),it.setValue(C,"normalMatrix",U.normalMatrix),it.setValue(C,"modelMatrix",U.matrixWorld),z.isShaderMaterial||z.isRawShaderMaterial){const Ut=z.uniformsGroups;for(let An=0,bn=Ut.length;An<bn;An++){const vo=Ut[An];D.update(vo,Wt),D.bind(vo,Wt)}}return Wt}function Lc(y,I){y.ambientLightColor.needsUpdate=I,y.lightProbe.needsUpdate=I,y.directionalLights.needsUpdate=I,y.directionalLightShadows.needsUpdate=I,y.pointLights.needsUpdate=I,y.pointLightShadows.needsUpdate=I,y.spotLights.needsUpdate=I,y.spotLightShadows.needsUpdate=I,y.rectAreaLights.needsUpdate=I,y.hemisphereLights.needsUpdate=I}function Ic(y){return y.isMeshLambertMaterial||y.isMeshToonMaterial||y.isMeshPhongMaterial||y.isMeshStandardMaterial||y.isShadowMaterial||y.isShaderMaterial&&y.lights===!0}this.getActiveCubeFace=function(){return b},this.getActiveMipmapLevel=function(){return R},this.getRenderTarget=function(){return L},this.setRenderTargetTextures=function(y,I,B){xe.get(y.texture).__webglTexture=I,xe.get(y.depthTexture).__webglTexture=B;const z=xe.get(y);z.__hasExternalTextures=!0,z.__autoAllocateDepthBuffer=B===void 0,z.__autoAllocateDepthBuffer||Re.has("WEBGL_multisampled_render_to_texture")===!0&&(console.warn("THREE.WebGLRenderer: Render-to-texture extension was disabled because an external texture was provided"),z.__useRenderToTexture=!1)},this.setRenderTargetFramebuffer=function(y,I){const B=xe.get(y);B.__webglFramebuffer=I,B.__useDefaultFramebuffer=I===void 0},this.setRenderTarget=function(y,I=0,B=0){L=y,b=I,R=B;let z=!0,U=null,ie=!1,fe=!1;if(y){const Se=xe.get(y);if(Se.__useDefaultFramebuffer!==void 0)_e.bindFramebuffer(C.FRAMEBUFFER,null),z=!1;else if(Se.__webglFramebuffer===void 0)A.setupRenderTarget(y);else if(Se.__hasExternalTextures)A.rebindTextures(y,xe.get(y.texture).__webglTexture,xe.get(y.depthTexture).__webglTexture);else if(y.depthBuffer){const ye=y.depthTexture;if(Se.__boundDepthTexture!==ye){if(ye!==null&&xe.has(ye)&&(y.width!==ye.image.width||y.height!==ye.image.height))throw new Error("WebGLRenderTarget: Attached DepthTexture is initialized to the incorrect size.");A.setupDepthRenderbuffer(y)}}const Ue=y.texture;(Ue.isData3DTexture||Ue.isDataArrayTexture||Ue.isCompressedArrayTexture)&&(fe=!0);const Be=xe.get(y).__webglFramebuffer;y.isWebGLCubeRenderTarget?(Array.isArray(Be[I])?U=Be[I][B]:U=Be[I],ie=!0):y.samples>0&&A.useMultisampledRTT(y)===!1?U=xe.get(y).__webglMultisampledFramebuffer:Array.isArray(Be)?U=Be[B]:U=Be,w.copy(y.viewport),k.copy(y.scissor),O=y.scissorTest}else w.copy(se).multiplyScalar(V).floor(),k.copy(be).multiplyScalar(V).floor(),O=ke;if(_e.bindFramebuffer(C.FRAMEBUFFER,U)&&z&&_e.drawBuffers(y,U),_e.viewport(w),_e.scissor(k),_e.setScissorTest(O),ie){const Se=xe.get(y.texture);C.framebufferTexture2D(C.FRAMEBUFFER,C.COLOR_ATTACHMENT0,C.TEXTURE_CUBE_MAP_POSITIVE_X+I,Se.__webglTexture,B)}else if(fe){const Se=xe.get(y.texture),Ue=I||0;C.framebufferTextureLayer(C.FRAMEBUFFER,C.COLOR_ATTACHMENT0,Se.__webglTexture,B||0,Ue)}E=-1},this.readRenderTargetPixels=function(y,I,B,z,U,ie,fe){if(!(y&&y.isWebGLRenderTarget)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");return}let Me=xe.get(y).__webglFramebuffer;if(y.isWebGLCubeRenderTarget&&fe!==void 0&&(Me=Me[fe]),Me){_e.bindFramebuffer(C.FRAMEBUFFER,Me);try{const Se=y.texture,Ue=Se.format,Be=Se.type;if(!Pe.textureFormatReadable(Ue)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not in RGBA or implementation defined format.");return}if(!Pe.textureTypeReadable(Be)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not in UnsignedByteType or implementation defined type.");return}I>=0&&I<=y.width-z&&B>=0&&B<=y.height-U&&C.readPixels(I,B,z,U,Ie.convert(Ue),Ie.convert(Be),ie)}finally{const Se=L!==null?xe.get(L).__webglFramebuffer:null;_e.bindFramebuffer(C.FRAMEBUFFER,Se)}}},this.readRenderTargetPixelsAsync=async function(y,I,B,z,U,ie,fe){if(!(y&&y.isWebGLRenderTarget))throw new Error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");let Me=xe.get(y).__webglFramebuffer;if(y.isWebGLCubeRenderTarget&&fe!==void 0&&(Me=Me[fe]),Me){const Se=y.texture,Ue=Se.format,Be=Se.type;if(!Pe.textureFormatReadable(Ue))throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in RGBA or implementation defined format.");if(!Pe.textureTypeReadable(Be))throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in UnsignedByteType or implementation defined type.");if(I>=0&&I<=y.width-z&&B>=0&&B<=y.height-U){_e.bindFramebuffer(C.FRAMEBUFFER,Me);const ye=C.createBuffer();C.bindBuffer(C.PIXEL_PACK_BUFFER,ye),C.bufferData(C.PIXEL_PACK_BUFFER,ie.byteLength,C.STREAM_READ),C.readPixels(I,B,z,U,Ie.convert(Ue),Ie.convert(Be),0);const qe=L!==null?xe.get(L).__webglFramebuffer:null;_e.bindFramebuffer(C.FRAMEBUFFER,qe);const et=C.fenceSync(C.SYNC_GPU_COMMANDS_COMPLETE,0);return C.flush(),await Lu(C,et,4),C.bindBuffer(C.PIXEL_PACK_BUFFER,ye),C.getBufferSubData(C.PIXEL_PACK_BUFFER,0,ie),C.deleteBuffer(ye),C.deleteSync(et),ie}else throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: requested read bounds are out of range.")}},this.copyFramebufferToTexture=function(y,I=null,B=0){y.isTexture!==!0&&(rr("WebGLRenderer: copyFramebufferToTexture function signature has changed."),I=arguments[0]||null,y=arguments[1]);const z=Math.pow(2,-B),U=Math.floor(y.image.width*z),ie=Math.floor(y.image.height*z),fe=I!==null?I.x:0,Me=I!==null?I.y:0;A.setTexture2D(y,0),C.copyTexSubImage2D(C.TEXTURE_2D,B,0,0,fe,Me,U,ie),_e.unbindTexture()},this.copyTextureToTexture=function(y,I,B=null,z=null,U=0){y.isTexture!==!0&&(rr("WebGLRenderer: copyTextureToTexture function signature has changed."),z=arguments[0]||null,y=arguments[1],I=arguments[2],U=arguments[3]||0,B=null);let ie,fe,Me,Se,Ue,Be,ye,qe,et;const nt=y.isCompressedTexture?y.mipmaps[U]:y.image;B!==null?(ie=B.max.x-B.min.x,fe=B.max.y-B.min.y,Me=B.isBox3?B.max.z-B.min.z:1,Se=B.min.x,Ue=B.min.y,Be=B.isBox3?B.min.z:0):(ie=nt.width,fe=nt.height,Me=nt.depth||1,Se=0,Ue=0,Be=0),z!==null?(ye=z.x,qe=z.y,et=z.z):(ye=0,qe=0,et=0);const Et=Ie.convert(I.format),$e=Ie.convert(I.type);let Te;I.isData3DTexture?(A.setTexture3D(I,0),Te=C.TEXTURE_3D):I.isDataArrayTexture||I.isCompressedArrayTexture?(A.setTexture2DArray(I,0),Te=C.TEXTURE_2D_ARRAY):(A.setTexture2D(I,0),Te=C.TEXTURE_2D),C.pixelStorei(C.UNPACK_FLIP_Y_WEBGL,I.flipY),C.pixelStorei(C.UNPACK_PREMULTIPLY_ALPHA_WEBGL,I.premultiplyAlpha),C.pixelStorei(C.UNPACK_ALIGNMENT,I.unpackAlignment);const cn=C.getParameter(C.UNPACK_ROW_LENGTH),Ze=C.getParameter(C.UNPACK_IMAGE_HEIGHT),Wt=C.getParameter(C.UNPACK_SKIP_PIXELS),ui=C.getParameter(C.UNPACK_SKIP_ROWS),Pt=C.getParameter(C.UNPACK_SKIP_IMAGES);C.pixelStorei(C.UNPACK_ROW_LENGTH,nt.width),C.pixelStorei(C.UNPACK_IMAGE_HEIGHT,nt.height),C.pixelStorei(C.UNPACK_SKIP_PIXELS,Se),C.pixelStorei(C.UNPACK_SKIP_ROWS,Ue),C.pixelStorei(C.UNPACK_SKIP_IMAGES,Be);const $i=y.isDataArrayTexture||y.isData3DTexture,it=I.isDataArrayTexture||I.isData3DTexture;if(y.isRenderTargetTexture||y.isDepthTexture){const tn=xe.get(y),Zi=xe.get(I),Ut=xe.get(tn.__renderTarget),An=xe.get(Zi.__renderTarget);_e.bindFramebuffer(C.READ_FRAMEBUFFER,Ut.__webglFramebuffer),_e.bindFramebuffer(C.DRAW_FRAMEBUFFER,An.__webglFramebuffer);for(let bn=0;bn<Me;bn++)$i&&C.framebufferTextureLayer(C.READ_FRAMEBUFFER,C.COLOR_ATTACHMENT0,xe.get(y).__webglTexture,U,Be+bn),y.isDepthTexture?(it&&C.framebufferTextureLayer(C.DRAW_FRAMEBUFFER,C.COLOR_ATTACHMENT0,xe.get(I).__webglTexture,U,et+bn),C.blitFramebuffer(Se,Ue,ie,fe,ye,qe,ie,fe,C.DEPTH_BUFFER_BIT,C.NEAREST)):it?C.copyTexSubImage3D(Te,U,ye,qe,et+bn,Se,Ue,ie,fe):C.copyTexSubImage2D(Te,U,ye,qe,et+bn,Se,Ue,ie,fe);_e.bindFramebuffer(C.READ_FRAMEBUFFER,null),_e.bindFramebuffer(C.DRAW_FRAMEBUFFER,null)}else it?y.isDataTexture||y.isData3DTexture?C.texSubImage3D(Te,U,ye,qe,et,ie,fe,Me,Et,$e,nt.data):I.isCompressedArrayTexture?C.compressedTexSubImage3D(Te,U,ye,qe,et,ie,fe,Me,Et,nt.data):C.texSubImage3D(Te,U,ye,qe,et,ie,fe,Me,Et,$e,nt):y.isDataTexture?C.texSubImage2D(C.TEXTURE_2D,U,ye,qe,ie,fe,Et,$e,nt.data):y.isCompressedTexture?C.compressedTexSubImage2D(C.TEXTURE_2D,U,ye,qe,nt.width,nt.height,Et,nt.data):C.texSubImage2D(C.TEXTURE_2D,U,ye,qe,ie,fe,Et,$e,nt);C.pixelStorei(C.UNPACK_ROW_LENGTH,cn),C.pixelStorei(C.UNPACK_IMAGE_HEIGHT,Ze),C.pixelStorei(C.UNPACK_SKIP_PIXELS,Wt),C.pixelStorei(C.UNPACK_SKIP_ROWS,ui),C.pixelStorei(C.UNPACK_SKIP_IMAGES,Pt),U===0&&I.generateMipmaps&&C.generateMipmap(Te),_e.unbindTexture()},this.copyTextureToTexture3D=function(y,I,B=null,z=null,U=0){return y.isTexture!==!0&&(rr("WebGLRenderer: copyTextureToTexture3D function signature has changed."),B=arguments[0]||null,z=arguments[1]||null,y=arguments[2],I=arguments[3],U=arguments[4]||0),rr('WebGLRenderer: copyTextureToTexture3D function has been deprecated. Use "copyTextureToTexture" instead.'),this.copyTextureToTexture(y,I,B,z,U)},this.initRenderTarget=function(y){xe.get(y).__webglFramebuffer===void 0&&A.setupRenderTarget(y)},this.initTexture=function(y){y.isCubeTexture?A.setTextureCube(y,0):y.isData3DTexture?A.setTexture3D(y,0):y.isDataArrayTexture||y.isCompressedArrayTexture?A.setTexture2DArray(y,0):A.setTexture2D(y,0),_e.unbindTexture()},this.resetState=function(){b=0,R=0,L=null,_e.reset(),Ke.reset()},typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}get coordinateSystem(){return gn}get outputColorSpace(){return this._outputColorSpace}set outputColorSpace(e){this._outputColorSpace=e;const t=this.getContext();t.drawingBufferColorspace=Xe._getDrawingBufferColorSpace(e),t.unpackColorSpace=Xe._getUnpackColorSpace()}}class Xr extends Rt{constructor(){super(),this.isScene=!0,this.type="Scene",this.background=null,this.environment=null,this.fog=null,this.backgroundBlurriness=0,this.backgroundIntensity=1,this.backgroundRotation=new yn,this.environmentIntensity=1,this.environmentRotation=new yn,this.overrideMaterial=null,typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}copy(e,t){return super.copy(e,t),e.background!==null&&(this.background=e.background.clone()),e.environment!==null&&(this.environment=e.environment.clone()),e.fog!==null&&(this.fog=e.fog.clone()),this.backgroundBlurriness=e.backgroundBlurriness,this.backgroundIntensity=e.backgroundIntensity,this.backgroundRotation.copy(e.backgroundRotation),this.environmentIntensity=e.environmentIntensity,this.environmentRotation.copy(e.environmentRotation),e.overrideMaterial!==null&&(this.overrideMaterial=e.overrideMaterial.clone()),this.matrixAutoUpdate=e.matrixAutoUpdate,this}toJSON(e){const t=super.toJSON(e);return this.fog!==null&&(t.object.fog=this.fog.toJSON()),this.backgroundBlurriness>0&&(t.object.backgroundBlurriness=this.backgroundBlurriness),this.backgroundIntensity!==1&&(t.object.backgroundIntensity=this.backgroundIntensity),t.object.backgroundRotation=this.backgroundRotation.toArray(),this.environmentIntensity!==1&&(t.object.environmentIntensity=this.environmentIntensity),t.object.environmentRotation=this.environmentRotation.toArray(),t}}class Xm extends Mt{constructor(e=null,t=1,i=1,r,s,a,o,l,c=ft,u=ft,f,d){super(null,a,o,l,c,u,r,s,f,d),this.isDataTexture=!0,this.image={data:e,width:t,height:i},this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}}class qm extends vr{static get type(){return"PointsMaterial"}constructor(e){super(),this.isPointsMaterial=!0,this.color=new Je(16777215),this.map=null,this.alphaMap=null,this.size=1,this.sizeAttenuation=!0,this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.alphaMap=e.alphaMap,this.size=e.size,this.sizeAttenuation=e.sizeAttenuation,this.fog=e.fog,this}}const _l=new st,Xa=new Kl,qr=new ms,Yr=new N;class Ym extends Rt{constructor(e=new Qt,t=new qm){super(),this.isPoints=!0,this.type="Points",this.geometry=e,this.material=t,this.updateMorphTargets()}copy(e,t){return super.copy(e,t),this.material=Array.isArray(e.material)?e.material.slice():e.material,this.geometry=e.geometry,this}raycast(e,t){const i=this.geometry,r=this.matrixWorld,s=e.params.Points.threshold,a=i.drawRange;if(i.boundingSphere===null&&i.computeBoundingSphere(),qr.copy(i.boundingSphere),qr.applyMatrix4(r),qr.radius+=s,e.ray.intersectsSphere(qr)===!1)return;_l.copy(r).invert(),Xa.copy(e.ray).applyMatrix4(_l);const o=s/((this.scale.x+this.scale.y+this.scale.z)/3),l=o*o,c=i.index,f=i.attributes.position;if(c!==null){const d=Math.max(0,a.start),m=Math.min(c.count,a.start+a.count);for(let g=d,_=m;g<_;g++){const p=c.getX(g);Yr.fromBufferAttribute(f,p),vl(Yr,p,l,r,e,t,this)}}else{const d=Math.max(0,a.start),m=Math.min(f.count,a.start+a.count);for(let g=d,_=m;g<_;g++)Yr.fromBufferAttribute(f,g),vl(Yr,g,l,r,e,t,this)}}updateMorphTargets(){const t=this.geometry.morphAttributes,i=Object.keys(t);if(i.length>0){const r=t[i[0]];if(r!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let s=0,a=r.length;s<a;s++){const o=r[s].name||String(s);this.morphTargetInfluences.push(0),this.morphTargetDictionary[o]=s}}}}}function vl(n,e,t,i,r,s,a){const o=Xa.distanceSqToPoint(n);if(o<t){const l=new N;Xa.closestPointToPoint(n,l),l.applyMatrix4(i);const c=r.ray.origin.distanceTo(l);if(c<r.near||c>r.far)return;s.push({distance:c,distanceToRay:Math.sqrt(o),point:l,index:e,face:null,faceIndex:null,barycoord:null,object:a})}}class xl extends Mt{constructor(e,t,i,r,s,a,o,l,c){super(e,t,i,r,s,a,o,l,c),this.isCanvasTexture=!0,this.needsUpdate=!0}}typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("register",{detail:{revision:ja}}));typeof window<"u"&&(window.__THREE__?console.warn("WARNING: Multiple instances of Three.js being imported."):window.__THREE__=ja);const En=48,ti=.965,wi=.305,ar=.925,is=0,Km=1,Ml=2,or=3,qa=4,Zt=0,$m=1,Zm=2,jm=3,Jm=4;function so(n){const e=n.length,t=n.map(a=>a[0]),i=n.map(a=>a[1]),r=[];for(let a=0;a<e-1;a++)r.push((i[a+1]-i[a])/(t[a+1]-t[a]));const s=[r[0]];for(let a=1;a<e-1;a++)s.push(r[a-1]*r[a]<=0?0:(r[a-1]+r[a])/2);s.push(r[e-2]);for(let a=0;a<e-1;a++){if(r[a]===0){s[a]=0,s[a+1]=0;continue}const o=s[a]/r[a],l=s[a+1]/r[a],c=o*o+l*l;if(c>9){const u=3/Math.sqrt(c);s[a]=u*o*r[a],s[a+1]=u*l*r[a]}}return a=>{if(a<=t[0])return i[0];if(a>=t[e-1])return i[e-1];let o=0;for(;o<e-2&&a>t[o+1];)o++;const l=t[o+1]-t[o],c=(a-t[o])/l,u=c*c,f=u*c;return(2*f-3*u+1)*i[o]+(f-2*u+c)*l*s[o]+(-2*f+3*u)*i[o+1]+(f-u)*l*s[o+1]}}const Qm=[[0,0,0,0,-.012],[.01,.022,.013,.024,-.012],[.035,.043,.025,.047,-.012],[.08,.062,.037,.068,-.011],[.15,.081,.053,.092,-.01],[.23,.1,.071,.112,-.008],[.31,.115,.09,.124,-.005],[.39,.12,.104,.12,-.001],[.47,.116,.109,.104,.004],[.55,.104,.108,.085,.009],[.62,.086,.101,.07,.012],[.69,.065,.086,.058,.013],[.77,.042,.064,.046,.011],[.84,.025,.044,.033,.008],[.9,.015,.028,.022,.005],[.94,.009,.015,.013,.002],[ti,0,0,0,.001]],_s=n=>so(Qm.map(e=>[e[0],e[n]])),hc=_s(1),Ya=_s(2),ao=_s(3),vn=_s(4),e0=so([[0,2.7],[.2,2.6],[.45,2.1],[.65,2],[.8,1.65],[.95,1.45]]),t0=so([[0,2.3],[.3,2.2],[.5,2],[.75,1.8],[.95,1.55]]),rs=.285,fc=n=>{const e=Math.min(1,n/rs);return vn(n)-ao(n)*(.08+.34*e**1.5)},dc=.292,n0=()=>fc(dc)+.017,Ii=(n,e,t)=>{const i=Math.max(0,Math.min(1,(t-n)/(e-n)));return i*i*(3-2*i)},Sl=(n,e)=>Math.sign(n)*Math.abs(n)**e,Ka=n=>.011*Math.exp(-(((n-.61)/.055)**2)),i0=(()=>{const n=[];for(let e=.03;e<.235;e+=.026)n.push([e,0]);for(let e=.045;e<.215;e+=.03)n.push([e,.45],[e,-.45]);for(let e=.02;e<.12;e+=.028)n.push([e,.82],[e,-.82]);return n})();function r0(n,e){let t=0;for(const[i,r]of i0){const s=Math.hypot((n-i)/.0085,(e-r)/.16);s<1&&(t=Math.max(t,(1-s*s)**2))}return t}const Ai=()=>({pos:[],info:[],spine:[],idx:[]}),xn=n=>Math.max(0,Math.min(1,n))*(En-1);function vs(n,e,t,i){for(let r=0;r<t-1;r++)for(let s=0;s<i;s++){const a=(s+1)%i,o=e+r*i+s,l=e+r*i+a,c=e+(r+1)*i+s,u=e+(r+1)*i+a;n.idx.push(o,c,l,l,c,u)}}function ki(n,e,t,i,r){for(let s=0;s<t;s++){const a=e+s,o=e+(s+1)%t;r?n.idx.push(a,o,i):n.idx.push(o,a,i)}}function s0(n){for(let s=0;s<116;s++){const a=(s+1)/117,o=ti*(.3*a+.7*(.5-.5*Math.cos(Math.PI*a))),l=hc(o),c=Ya(o)+Ka(o),u=ao(o),f=vn(o),d=e0(o),m=t0(o),g=fc(o);for(let _=0;_<56;_++){const p=2*Math.PI*_/56,h=Math.cos(p),T=Math.sin(p),S=T>=0?d:m;let M=l*Sl(h,2/S),P=f+(T>=0?c:u)*Sl(T,2/S),b=Zt;if(o<rs+.01&&Math.abs(h)>.25){const E=Math.exp(-(((P-g)/.0058)**2))*Ii(.004,.03,o)*(1-Ii(rs-.02,rs+.01,o)),x=Math.abs(h);M-=Math.sign(M)*.0058*E*x,P-=.0018*E,E>.38&&(b=$m)}if(o<.25){const E=l>1e-4?M/l:0,x=T>-.1?r0(o,E):0;if(x>0){const w=Math.hypot(M,P-f)||1;M+=M/w*.0042*x,P+=(P-f)/w*.0042*x,x>.3&&b===Zt&&(b=Jm)}}Math.abs(h)>.35&&Math.hypot((o-dc)*.9,P-n0())<.0062&&(b=Zm),P<f-u*.42&&o>.025&&o<.5&&(b=jm);const R=T*(T>=0?c:u)/Math.max(1e-4,Math.hypot(h*l,T*(T>=0?c:u))),L=.12+.88*Ii(-.62,.05,R);n.pos.push(M,P,o-.5),n.info.push(is,b,L,o/ti),n.spine.push(xn(o))}}vs(n,0,116,56);const i=n.pos.length/3;n.pos.push(0,vn(0),-.5),n.info.push(is,Zt,.75,0),n.spine.push(0);const r=n.pos.length/3;n.pos.push(0,vn(ti),ti-.5),n.info.push(is,Zt,.9,1),n.spine.push(xn(ti)),ki(n,0,56,i,!0),ki(n,6440,56,r,!1)}const oo=n=>1.32*Math.sqrt(Math.max(0,n))*(1-n)**.85/.6;function a0(){const i=[];for(let r=0;r<30;r++){const a=-.05+1.05*(1-(1-r/29)**1.35),o=Math.max(0,a);let l=.066*(1-.5*o**1.2);o>.8&&(l*=Math.sqrt(Math.max(0,1-((o-.8)/.2)**2))),l=Math.max(l,.0015);const c=.0042*Math.max(0,Math.sin(o*Math.PI*11))**2*Ii(.18,.32,o)*(1-Ii(.82,.95,o)),u=-.42*l+.05*o**1.6-c,f=.19*l+.0015,d=-.022*o**2;for(let m=0;m<14;m++){const g=2*Math.PI*m/14,_=.5-.5*Math.cos(g),p=Math.sin(g)>=0?1:-1,h=.06*f*Math.sin(Math.PI*_);i.push(a*.31,d+h+p*.5*f*oo(_),u+(l+c)*_)}}return{pos:i,rings:30,around:14}}function yl(n,e,t,i){const r=n.pos.length/3,{pos:s,rings:a,around:o}=i;for(let u=0;u<s.length;u+=3){const f=s[u]/.31;n.pos.push(t?-s[u]:s[u],s[u+1],s[u+2]);const d=s[u+1]<0?0:1;n.info.push(e,Zt,.3+.22*d,.42+.3*Math.max(0,f)),n.spine.push(xn(wi))}const l=Ai();vs(l,0,a,o);const c=n.pos.length/3;n.pos.push(t?-.31:.31,-.022,.05+.002),n.info.push(e,Zt,.4,.72),n.spine.push(xn(wi)),ki(l,(a-1)*o,o,c-r,!1);for(let u=0;u<l.idx.length;u+=3){const f=l.idx[u]+r,d=l.idx[u+1]+r,m=l.idx[u+2]+r;t?n.idx.push(f,m,d):n.idx.push(f,d,m)}}function o0(n){for(let a=0;a<49;a++){const o=a/48*2-1,l=Math.sign(o)*Math.abs(o)**.85,c=Math.abs(l),u=-.012+.098*c**1.35;let f=.074*Math.max(0,1-c**2.5)**.55+.0012;f-=.024*Math.max(0,1-c/.085)**1.3,f+=.0022*Math.sin(c*46)*Ii(.25,.4,c)*(1-c);const d=.017*(1-c)**1.25+.0014;for(let m=0;m<12;m++){const g=2*Math.PI*m/12,_=.5-.5*Math.cos(g),p=Math.sin(g)>=0?1:-1;n.pos.push(l*.168,p*.5*d*oo(_),u+f*_),n.info.push(or,Zt,p>0?.92:.46,.97+.03*c),n.spine.push(xn(ar))}}vs(n,0,49,12);const r=n.pos.length/3;n.pos.push(-.168-.001,0,.087),n.info.push(or,Zt,.8,1),n.spine.push(xn(ar));const s=n.pos.length/3;n.pos.push(.168+.001,0,.087),n.info.push(or,Zt,.8,1),n.spine.push(xn(ar)),ki(n,0,12,r,!1),ki(n,576,12,s,!0)}function l0(n){for(let s=0;s<10;s++){const a=s/9,o=.072*(1-a)**.75+.006,l=.615-.5+.048*a**1.2,c=.011*(1-a)+.0018;for(let u=0;u<10;u++){const f=2*Math.PI*u/10,d=.5-.5*Math.cos(f),m=Math.sin(f)>=0?1:-1,g=l+o*d,_=g+.5,h=vn(_)+Ya(_)+Ka(_)-.008+a*.036*(1-.35*d)+a*a*.004;n.pos.push(m*.5*c*oo(d),h,g),n.info.push(qa,Zt,.95,Math.min(1,_/ti)),n.spine.push(xn(_))}}vs(n,0,10,10);const i=n.pos.length/3,r=.615+.048+.003;n.pos.push(0,vn(r)+Ya(r)+Ka(r)-.008+.0405,r-.5),n.info.push(qa,Zt,.95,r),n.spine.push(xn(r)),ki(n,90,10,i,!1)}function pc(n,e,t){const i=new Float32Array(t*3);for(let r=0;r<e.length;r+=3){const s=e[r]*3,a=e[r+1]*3,o=e[r+2]*3,l=n[a]-n[s],c=n[a+1]-n[s+1],u=n[a+2]-n[s+2],f=n[o]-n[s],d=n[o+1]-n[s+1],m=n[o+2]-n[s+2],g=c*m-u*d,_=u*f-l*m,p=l*d-c*f;for(const h of[s,a,o])i[h]+=g,i[h+1]+=_,i[h+2]+=p}for(let r=0;r<i.length;r+=3){const s=Math.hypot(i[r],i[r+1],i[r+2])||1;i[r]/=s,i[r+1]/=s,i[r+2]/=s}return i}function nr(n,e){const t=n.pos.length/3,i=pc(n.pos,n.idx,t);let r=0;for(let s=0;s<t;s++){const[a,o,l]=e(n.pos[s*3],n.pos[s*3+1],n.pos[s*3+2]);r+=i[s*3]*(n.pos[s*3]-a)+i[s*3+1]*(n.pos[s*3+1]-o)+i[s*3+2]*(n.pos[s*3+2]-l)}if(r<0)for(let s=0;s<n.idx.length;s+=3){const a=n.idx[s+1];n.idx[s+1]=n.idx[s+2],n.idx[s+2]=a}}const ir=[hc(wi)*.74,vn(wi)-ao(wi)*.5,wi-.5],El=[0,vn(ar),ar-.5];let Kr=null;function mc(){if(Kr)return Kr;const n=Ai();s0(n),nr(n,(S,M,P)=>[0,vn(P+.5),P]);const e=Ai();l0(e),nr(e,(S,M,P)=>[0,M,P]);const t=a0(),i=Ai();yl(i,Ml,!1,t),nr(i,(S,M,P)=>[S,-.022*(S/.31)**2,P]);const r=Ai();yl(r,Km,!0,t),nr(r,(S,M,P)=>[S,-.022*(S/.31)**2,P]);const s=Ai();o0(s),nr(s,(S,M,P)=>[S,0,P]);const a=[n,e,r,i,s],o=a.reduce((S,M)=>S+M.pos.length/3,0),l=a.reduce((S,M)=>S+M.idx.length/3,0),c=new Float32Array(o*3),u=new Float32Array(o*3),f=new Float32Array(o),d=new Float32Array(o*4),m=new Float32Array(o*3),g=new Uint32Array(l*3),_=[],p=[-ir[0],ir[1],ir[2]];let h=0,T=0;for(const S of a){const M=S.pos.length/3,P=pc(S.pos,S.idx,M);for(let b=0;b<M;b++){const R=(h+b)*3,L=S.info[b*4],E=S.pos[b*3],x=S.pos[b*3+1],w=S.pos[b*3+2];if(u.set([P[b*3],P[b*3+1],P[b*3+2]],R),f[h+b]=S.spine[b],d.set(S.info.slice(b*4,b*4+4),(h+b)*4),L===is||L===qa){const k=S.spine[b]/(En-1)-.5;c.set([E,x,w-k],R),m.set([E,x,w],R)}else{c.set([E,x,w],R);const k=L===or?El:L===Ml?ir:p;m.set([k[0]+E,k[1]+x,k[2]+w],R)}}_.push({part:S.info[0],start:T/3,count:S.idx.length/3});for(let b=0;b<S.idx.length;b++)g[T+b]=S.idx[b]+h;h+=M,T+=S.idx.length}return Kr={offset:c,normal:u,spine:f,info:d,rest:m,index:g,vertexCount:o,pivots:{flipperL:p,flipperR:ir,fluke:El},parts:_},Kr}function gc(n){let e=n>>>0;return()=>{e=e+1831565813>>>0;let t=e;return t=Math.imul(t^t>>>15,t|1),t^=t+Math.imul(t^t>>>7,t|61),((t^t>>>14)>>>0)/4294967296}}function Tl(n,e,t){const i=mc(),r=gc(e),s=[],a=[];let o=0;for(let c=0;c<i.index.length;c+=3){const u=i.index[c];if(t&&!t(i.info,u))continue;const f=i.index[c+1],d=i.index[c+2],m=i.rest,g=[m[f*3]-m[u*3],m[f*3+1]-m[u*3+1],m[f*3+2]-m[u*3+2]],_=[m[d*3]-m[u*3],m[d*3+1]-m[u*3+1],m[d*3+2]-m[u*3+2]],p=.5*Math.hypot(g[1]*_[2]-g[2]*_[1],g[2]*_[0]-g[0]*_[2],g[0]*_[1]-g[1]*_[0]);o+=p,s.push(c),a.push(o)}const l={count:n,offset:new Float32Array(n*3),normal:new Float32Array(n*3),spine:new Float32Array(n),info:new Float32Array(n*4)};for(let c=0;c<n;c++){const u=r()*o;let f=0,d=a.length-1;for(;f<d;){const S=f+d>>1;a[S]<u?f=S+1:d=S}const m=s[f];let g=r(),_=r();g+_>1&&(g=1-g,_=1-_);const p=1-g-_,h=[i.index[m],i.index[m+1],i.index[m+2]],T=[p,g,_];for(let S=0;S<3;S++)l.offset[c*3+S]=T[0]*i.offset[h[0]*3+S]+T[1]*i.offset[h[1]*3+S]+T[2]*i.offset[h[2]*3+S],l.normal[c*3+S]=T[0]*i.normal[h[0]*3+S]+T[1]*i.normal[h[1]*3+S]+T[2]*i.normal[h[2]*3+S];l.spine[c]=T[0]*i.spine[h[0]]+T[1]*i.spine[h[1]]+T[2]*i.spine[h[2]];for(let S=0;S<4;S++)l.info[c*4+S]=i.info[h[0]*4+S];l.info[c*4+3]=T[0]*i.info[h[0]*4+3]+T[1]*i.info[h[1]*4+3]+T[2]*i.info[h[2]*4+3]}return l}const ai=(n,e)=>[n[0]+e[0],n[1]+e[1],n[2]+e[2]],Gt=(n,e)=>[n[0]-e[0],n[1]-e[1],n[2]-e[2]],ot=(n,e)=>[n[0]*e,n[1]*e,n[2]*e],Ct=(n,e)=>n[0]*e[0]+n[1]*e[1]+n[2]*e[2],ri=(n,e)=>[n[1]*e[2]-n[2]*e[1],n[2]*e[0]-n[0]*e[2],n[0]*e[1]-n[1]*e[0]],on=n=>Math.hypot(n[0],n[1],n[2]),en=n=>{const e=on(n)||1;return[n[0]/e,n[1]/e,n[2]/e]},c0=(n,e,t)=>[n[0]+(e[0]-n[0])*t,n[1]+(e[1]-n[1])*t,n[2]+(e[2]-n[2])*t],zn=(n,e)=>{const t=en(n),i=Math.sin(e/2);return[t[0]*i,t[1]*i,t[2]*i,Math.cos(e/2)]},Gi=(n,e)=>[n[3]*e[0]+n[0]*e[3]+n[1]*e[2]-n[2]*e[1],n[3]*e[1]-n[0]*e[2]+n[1]*e[3]+n[2]*e[0],n[3]*e[2]+n[0]*e[1]-n[1]*e[0]+n[2]*e[3],n[3]*e[3]-n[0]*e[0]-n[1]*e[1]-n[2]*e[2]],Ri=n=>{const e=Math.hypot(n[0],n[1],n[2],n[3])||1;return[n[0]/e,n[1]/e,n[2]/e,n[3]/e]},u0=n=>[-n[0],-n[1],-n[2],n[3]],Tn=(n,e)=>{const[t,i,r,s]=n,a=2*(i*e[2]-r*e[1]),o=2*(r*e[0]-t*e[2]),l=2*(t*e[1]-i*e[0]);return[e[0]+s*a+(i*l-r*o),e[1]+s*o+(r*a-t*l),e[2]+s*l+(t*o-i*a)]},h0=(n,e,t)=>{let i=n[0]*e[0]+n[1]*e[1]+n[2]*e[2]+n[3]*e[3],r=e;if(i<0&&(i=-i,r=[-e[0],-e[1],-e[2],-e[3]]),i>.9995)return Ri([n[0]+(r[0]-n[0])*t,n[1]+(r[1]-n[1])*t,n[2]+(r[2]-n[2])*t,n[3]+(r[3]-n[3])*t]);const s=Math.acos(i),a=Math.sin(s),o=Math.sin((1-t)*s)/a,l=Math.sin(t*s)/a;return[n[0]*o+r[0]*l,n[1]*o+r[1]*l,n[2]*o+r[2]*l,n[3]*o+r[3]*l]},f0=(n,e,t)=>{const i=n[0],r=n[1],s=n[2],a=e[0],o=e[1],l=e[2],c=t[0],u=t[1],f=t[2],d=i+o+f;if(d>0){const g=Math.sqrt(d+1)*2;return Ri([(l-u)/g,(c-s)/g,(r-a)/g,.25*g])}if(i>o&&i>f){const g=Math.sqrt(1+i-o-f)*2;return Ri([.25*g,(a+r)/g,(c+s)/g,(l-u)/g])}if(o>f){const g=Math.sqrt(1+o-i-f)*2;return Ri([(a+r)/g,.25*g,(u+l)/g,(c-s)/g])}const m=Math.sqrt(1+f-i-o)*2;return Ri([(c+s)/m,(u+l)/m,.25*m,(r-a)/m])},Gn=[1,0,0],jt=[0,1,0],fr=[0,0,1];function ls(n,e,t=0){const i=en(n);let r=Gt(e,ot(i,Ct(e,i)));on(r)<1e-5&&(r=Gt(fr,ot(i,Ct(fr,i))),on(r)<1e-5&&(r=Gt(Gn,ot(i,Ct(Gn,i))))),r=en(r);const s=ri(i,r),a=f0(s,r,ot(i,-1));return t===0?a:Gi(zn(i,t),a)}function _c(n){const e=Math.max(0,Math.min(1.6,n.effort)),t=n.stride??.95,i=n.distance/t*Math.PI*2+(n.phase??0),r=.16+.84*e,s=n.turn??0,a=n.climb??0,o=n.bank??0,l=Math.sin(i+.9),c=Math.cos(i+.9),u=Math.max(-.5,Math.min(.5,s*.35+o*.25)),f=1-Math.min(1,e),d={sweep:.05-.12*f,dihedral:.1*f-.04*a,twist:-.06*a},m=.13*r*l,g=.06*r*c,_=.09*r*c;return{stroke:i,amplitude:r,bendYaw:s,bendPitch:a,flipperL:{sweep:d.sweep-u*.4+g,dihedral:d.dihedral+u+m,twist:d.twist+_},flipperR:{sweep:d.sweep+u*.4+g,dihedral:d.dihedral-u+m,twist:d.twist+_},fluke:.5*r*Math.cos(i-2*Math.PI*.9-.98),flukeFlex:.09*r*Math.sin(i-2*Math.PI*.95-.98)}}const Js=.38,Al=2*Math.PI/1.25,d0=n=>.8*(.012-.06*n+.09*n*n+.075*n*n*n),p0=n=>.8*(-.06+.18*n+.225*n*n);function m0(n,e){const t=n.stroke-Al*e;return n.amplitude*Math.atan(p0(e)*Math.sin(t)-Al*d0(e)*Math.cos(t))}function vc(n,e,t,i=0){const r=En,s=1/(r-1),a=Math.round(Js*(r-1)),o=[];for(let c=0;c<r;c++){const u=c*s,f=n.bendYaw*(u-Js),d=-n.bendPitch*(u-Js)+m0(n,u),m=Gi(zn(jt,f),zn(Gn,d));t.set(m,i+c*4),o.push(Tn(m,fr))}const l=new Array(r);l[a]=[0,0,a*s-.5];for(let c=a+1;c<r;c++)l[c]=ai(l[c-1],ot(ai(o[c-1],o[c]),s/2));for(let c=a-1;c>=0;c--)l[c]=Gt(l[c+1],ot(ai(o[c+1],o[c]),s/2));for(let c=0;c<r;c++)e.set([l[c][0],l[c][1],l[c][2],c*s],i+c*4)}const Qs={sweep:.74,dihedral:.3,twist:.12};function cs(n,e){const t=Qs.sweep+n.sweep,i=Qs.dihedral-n.dihedral,r=Qs.twist+n.twist,s=Gi(Gi(zn(jt,-t),zn(fr,-i)),zn(Gn,-r));return e?[s[0],-s[1],-s[2],s[3]]:s}const xc=n=>zn(Gn,n.fluke),lr=3;function g0(n,e,t,i=0){const r=En*4,s=t*lr*r,a=e.subarray(s,s+r),o=e.subarray(s+r,s+2*r);vc(n,a,o,0);const l=e.subarray(s+2*r,s+3*r);l.set(cs(n.flipperL,!0),0),l.set(cs(n.flipperR,!1),4),l.set(xc(n),8),l.set([n.flukeFlex,i,0,0],12)}function _0(n){const e=new Float32Array(En*4),t=new Float32Array(En*4);return vc(n,e,t),{p:e,q:t,flipL:cs(n.flipperL,!0),flipR:cs(n.flipperR,!1),fluke:xc(n),flukeFlex:n.flukeFlex}}const v0=64;function x0(n,e){let t=0,i=n.path(0);const r=Math.max(1,Math.ceil(v0*Math.abs(e)));for(let s=1;s<=r;s++){const a=n.path(e*s/r);t+=on(Gt(a,i)),i=a}return t/n.length}function M0(n,e){const t=n,i=.001,r=e.path(t-i),s=e.path(t),a=e.path(t+i),o=ot(Gt(a,r),1/(2*i)),l=ot(ai(Gt(a,ot(s,2)),r),1/(i*i)),c=Math.max(1e-6,on(o)),u=ot(o,1/c),f=e.up?e.up(t):jt,d=ls(u,f,0),m=Tn(d,Gn),g=Tn(d,jt),_=Gt(l,ot(u,Ct(l,u))),p=ot(_,1/(c*c)),h=Ct(p,m)*e.length,T=Ct(p,g)*e.length,S=e.maxBank??.55,M=Math.max(-S,Math.min(S,h*(e.bankGain??.55))),P=ls(u,f,M),b=_c({distance:x0(e,t),effort:e.effort?e.effort(t):1,turn:h,climb:T,bank:M,phase:e.phase,stride:e.stride});return{position:s,quaternion:P,scale:e.length,articulation:b,bank:M}}const yt={ink:[9,34,82],inkFar:[40,78,130],contrast:1.3,farFade:.25,gamma:1.3,tone:.14},S0={mode:"shape",split:0,cellW:7,cellH:12,ink:yt.ink,inkFar:yt.inkFar,opacity:1,contrast:yt.contrast,farFade:yt.farFade,invert:!1,gamma:yt.gamma,tone:yt.tone,water:[255,255,255],waterOpacity:0},ss=[" ",".","·",":","-","=","+","*","x","#","%","@","_","/","\\","|","(",")","o","~",",","'","`",";",'"',"^","°","•"],y0=[".","·",":",";","+","*","x","#"],ht=n=>ss.indexOf(n),Un=8;function E0(n,e,t='"JetBrains Mono", monospace'){const i=Math.ceil(ss.length/Un),r=document.createElement("canvas");r.width=n*Un,r.height=e*i;const s=r.getContext("2d",{willReadFrequently:!0}),a=Math.max(6,Math.min(n/.6,e*.92));s.font=`500 ${a.toFixed(2)}px ${t}`,s.textAlign="center",s.textBaseline="middle",s.fillStyle="#fff",ss.forEach((d,m)=>{const g=m%Un*n+n/2,_=Math.floor(m/Un)*e+e/2+a*.04;s.fillText(d,g,_)});const o=s.getImageData(0,0,r.width,r.height).data,l=ss.map((d,m)=>{const g=m%Un*n,_=Math.floor(m/Un)*e;let p=0;for(let h=0;h<e;h++)for(let T=0;T<n;T++)p+=o[((_+h)*r.width+g+T)*4+3];return p/(255*n*e)}),c=y0.map(d=>({i:ht(d),c:l[ht(d)]})).sort((d,m)=>d.c-m.c),u=[];let f=-1;for(const d of c)d.c-f<.012||(u.push(d.i),f=d.c);return{canvas:r,tileW:n,tileH:e,ramp:u,coverage:l}}const Mc=`
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
`,T0=`
${Mc}
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
`,A0=`
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
  float shade = 1.0 - clamp(lambert, 0.0, 1.0);
  float core = smoothstep(-0.05, -0.45, lambert);
  float ink = pigment * (0.28 + 0.62 * pow(shade, 1.15)) + 0.1 * core + 0.3 * rim * rim * rim;
  ink = smoothstep(0.04, 1.0, ink);
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
  float axial = length(tan2) > 0.32 ? fract(atan(tan2.y, tan2.x) / 3.14159265 + 1.0) : 0.0;
  gMask = vec4(mouth, eye, axial, coverage);
  // Engraving marks: pleat pouch, groove line, tubercles, and appendages (kept pale and crisp)
  gMarks = vec4(pleat, groove * pleat, knob, vInfo.x > 0.5 && vInfo.x < 3.5 ? 1.0 : 0.0);
}
`,ea=`
void main() { gl_Position = vec4(position.xy, 0.0, 1.0); }
`,b0=`
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
      if (m.b > 0.0) axis += vec2(cos(m.b * 6.2831853), sin(m.b * 6.2831853)) * c;
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
      jxx += gc.x * gc.x + gd.x * gd.x + 0.35 * (gnx.x * gnx.x + gny.x * gny.x) + 0.6 * gm.x * gm.x;
      jyy += gc.y * gc.y + gd.y * gd.y + 0.35 * (gnx.y * gnx.y + gny.y * gny.y) + 0.6 * gm.y * gm.y;
      jxy += gc.x * gc.y + gd.x * gd.y + 0.35 * (gnx.x * gnx.y + gny.x * gny.y) + 0.6 * gm.x * gm.y;
      silE += dot(gc, gc);
      inE += dot(gd, gd) + 0.35 * (dot(gnx, gnx) + dot(gny, gny)) + 0.6 * dot(gm, gm);
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
  if (lum) {
    // Luminance: mean ink (thinned at the silhouette by coverage) through the density ramp
    float v = pow(clamp(ink * smoothstep(0.15, 0.6, coverage), 0.0, 1.0), uGamma);
    if (coverage > 0.22 && v > 0.04) {
      glyph = rampGlyph(v, cellIx);
      alpha = 1.0;
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
    } else if (coverage > 0.3) {
      // The body's mass as an engraver's tone scale: stipple in the light, hatching that runs
      // along the body through the mid tones, crosshatch in the shadow. No cell inside the body
      // is left empty except in the brightest light, so the form keeps its weight.
      float t = clamp(v * (app > 0.5 ? 0.8 : 1.0) + uTone * (app > 0.5 ? 0.5 : 1.0), 0.0, 1.0);
      float q = clamp(t * 6.0 + (d - 0.5) * 0.9, 0.0, 6.0);
      int L = int(floor(q + 0.5));
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
        // Cross-hatching: strokes along the body, crossed by strokes across it between them
        float crossA = mod(axisA + 1.5707963, 3.14159265);
        glyph = !along ? uToneG.y : (onLine ? strokeGlyph(axisA) : strokeGlyph(crossA));
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
  outCell = vec4(glyph / 255.0, alpha, clamp(depth * 0.6, 0.0, 1.0), 1.0);
}
`,w0=`
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
uniform sampler2D uReadingMask;
uniform vec2 uMaskCanvas;
uniform float uMaskStrength;
uniform sampler2D uGeometryMask;
uniform vec3 uWater;
uniform float uWaterOpacity;
out vec4 outColor;
void main() {
  vec2 fc = vec2(gl_FragCoord.x, uCanvasH - gl_FragCoord.y);
  ivec2 cell = ivec2(floor(fc / uCell));
  vec4 c = texelFetch(uCells, cell, 0);
  float gi = floor(c.r * 255.0 + 0.5);
  float protection = mix(1.0, texture(uReadingMask, fc / uMaskCanvas).r, uMaskStrength);
  float silhouette = texture(uGeometryMask, gl_FragCoord.xy / uMaskCanvas).a;
  float waterAlpha = silhouette * uWaterOpacity * uOpacity * protection;
  if ((c.g <= 0.0 || gi < 0.5) && waterAlpha <= 0.003) discard;
  vec2 local = floor(fc - vec2(cell) * uCell);
  vec2 tile = vec2(mod(gi, uAtlasCols), floor(gi / uAtlasCols));
  float a = texelFetch(uAtlas, ivec2(tile * uTile + min(local, uTile - 1.0)), 0).a * min(1.0, c.g * uContrast) * uOpacity;
  if (gi < 0.5) a = 0.0;
  a *= 1.0 - uFarFade * c.b;
  a *= protection;
  vec3 col = mix(uInk, uInkFar, c.b);
  outColor = vec4(col * a + uWater * waterAlpha * (1.0 - a), a + waterAlpha * (1.0 - a));
}
`,R0=`
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
`,$r=(n,e)=>n.set(e[0]/255,e[1]/255,e[2]/255);class Sc{constructor(e,t={}){Ve(this,"renderer");Ve(this,"camera",new It(30,1,.1,200));Ve(this,"underlay",new Xr);Ve(this,"overlay",new Xr);Ve(this,"style",{...S0});Ve(this,"skinData");Ve(this,"skinTexture");Ve(this,"pivotUniforms");Ve(this,"lost",!1);Ve(this,"onContextLost",null);Ve(this,"scene",new Xr);Ve(this,"quadCamera",new sc(-1,1,1,-1,0,1));Ve(this,"whales",[]);Ve(this,"gbuffer");Ve(this,"cells");Ve(this,"cellMaterial");Ve(this,"compositeMaterial");Ve(this,"rawMaterial");Ve(this,"quad");Ve(this,"quadScene",new Xr);Ve(this,"atlas",null);Ve(this,"atlasTexture",null);Ve(this,"atlasKey","");Ve(this,"cssW",1);Ve(this,"cssH",1);Ve(this,"dpr",1);Ve(this,"gscale");Ve(this,"readingCanvas",document.createElement("canvas"));Ve(this,"readingTexture",new xl(this.readingCanvas));Ve(this,"occluder",{center:new N,radius:0,amount:0});Ve(this,"light",new N(-.5,.62,.6).normalize());Ve(this,"tmp",new N);Ve(this,"onLost",e=>{var t;e.preventDefault(),this.lost=!0,(t=this.onContextLost)==null||t.call(this)});Ve(this,"onRestored",()=>{this.lost=!1,this.atlasKey="",this.skinTexture.needsUpdate=!0});Ve(this,"canvas");this.canvas=e,this.readingCanvas.width=this.readingCanvas.height=1,this.readingCanvas.getContext("2d").fillRect(0,0,1,1),this.readingTexture.flipY=!1,this.readingTexture.generateMipmaps=!1;const i=t.maxWhales??2;this.gscale=t.gbufferScale??.75,this.renderer=new Wm({canvas:e,alpha:!0,premultipliedAlpha:!0,antialias:!1,powerPreference:"high-performance"}),this.renderer.setClearColor(0,0),this.renderer.autoClear=!1,e.addEventListener("webglcontextlost",this.onLost),e.addEventListener("webglcontextrestored",this.onRestored),this.skinData=new Float32Array(En*4*lr*i),this.skinTexture=new Xm(this.skinData,En,lr*i,zt,an),this.skinTexture.minFilter=ft,this.skinTexture.magFilter=ft,this.skinTexture.needsUpdate=!0;const r=mc(),s=new Qt;s.setAttribute("position",new ut(r.offset,3)),s.setAttribute("normal",new ut(r.normal,3)),s.setAttribute("aSpine",new ut(r.spine,1)),s.setAttribute("aInfo",new ut(r.info,4)),s.setIndex(new ut(r.index,1)),this.pivotUniforms={uPivotL:{value:new N(...r.pivots.flipperL)},uPivotR:{value:new N(...r.pivots.flipperR)},uPivotF:{value:new N(...r.pivots.fluke)}};for(let a=0;a<i;a++){const o=new bt({glslVersion:Fn,vertexShader:T0,fragmentShader:A0,side:rn,uniforms:{uSkin:{value:this.skinTexture},...this.pivotUniforms,uSkinRow:{value:a*lr},uLight:{value:new N},uDepthRange:{value:new Ge(0,1)},uDissolve:{value:0},uOccluder:{value:new tt},uOcclusion:{value:0},uInvert:{value:0}}}),l=new kt(s,o);l.frustumCulled=!1,l.visible=!1,this.scene.add(l),this.whales.push({mesh:l,material:o,state:null})}this.gbuffer=new Sn(1,1,{count:3,depthBuffer:!0,type:Jt});for(const a of this.gbuffer.textures)a.minFilter=Bt,a.magFilter=Bt,a.generateMipmaps=!1;this.cells=new Sn(1,1,{depthBuffer:!1,type:Jt}),this.cells.texture.minFilter=ft,this.cells.texture.magFilter=ft,this.cells.texture.generateMipmaps=!1,this.cellMaterial=new bt({glslVersion:Fn,vertexShader:ea,fragmentShader:b0,depthTest:!1,depthWrite:!1,uniforms:{uInk:{value:null},uMask:{value:null},uCanvas:{value:new Ge},uCell:{value:new Ge},uTexel:{value:new Ge},uSplit:{value:0},uShape:{value:1},uRamp:{value:new Array(12).fill(0)},uRampN:{value:1},uGamma:{value:1},uTone:{value:0},uEdgeA:{value:new tt(ht("-"),ht("_"),ht("/"),ht("\\"))},uEdgeB:{value:new tt(ht("|"),ht("("),ht(")"),ht("o"))},uMarkG:{value:new tt(ht("="),ht("°"),ht("•"),ht(":"))},uToneG:{value:new tt(ht("·"),ht("+"),ht("x"),ht("#"))},uMarks:{value:null}}}),this.compositeMaterial=new bt({glslVersion:Fn,vertexShader:ea,fragmentShader:w0,transparent:!0,premultipliedAlpha:!0,blending:cr,blendSrc:ur,blendDst:li,depthTest:!1,depthWrite:!1,uniforms:{uCells:{value:this.cells.texture},uAtlas:{value:null},uCell:{value:new Ge},uTile:{value:new Ge},uAtlasCols:{value:Un},uCanvasH:{value:1},uInk:{value:new N},uInkFar:{value:new N},uOpacity:{value:1},uContrast:{value:yt.contrast},uFarFade:{value:yt.farFade},uReadingMask:{value:this.readingTexture},uMaskCanvas:{value:new Ge(1,1)},uMaskStrength:{value:0},uGeometryMask:{value:null},uWater:{value:new N(1,1,1)},uWaterOpacity:{value:0}}}),this.rawMaterial=new bt({glslVersion:Fn,vertexShader:ea,fragmentShader:R0,transparent:!0,blending:cr,blendSrc:ur,blendDst:li,depthTest:!1,depthWrite:!1,uniforms:{uInk:{value:null},uMask:{value:null},uCanvas:{value:new Ge},uInk3:{value:new N}}}),this.quad=new kt(new Yi(2,2),this.cellMaterial),this.quad.frustumCulled=!1,this.quadScene.add(this.quad)}resize(e,t,i){this.cssW=Math.max(1,e),this.cssH=Math.max(1,t),this.dpr=i,this.renderer.setPixelRatio(i),this.renderer.setSize(this.cssW,this.cssH,!1),this.camera.aspect=this.cssW/this.cssH,this.camera.updateProjectionMatrix(),this.gbuffer.setSize(Math.max(1,Math.round(this.cssW*this.gscale)),Math.max(1,Math.round(this.cssH*this.gscale))),this.atlasKey=""}get size(){return{width:this.cssW,height:this.cssH,dpr:this.dpr}}setStyle(e){Object.assign(this.style,e)}setResolution(e){this.gscale=Math.max(.35,Math.min(.75,e)),this.gbuffer.setSize(Math.max(1,Math.round(this.cssW*this.gscale)),Math.max(1,Math.round(this.cssH*this.gscale)))}setReadingZones(e,t=1){const i=this.compositeMaterial.uniforms;if(i.uMaskStrength.value=t,t<=0)return;const r=Math.ceil(this.cssW/4),s=Math.ceil(this.cssH/4);(this.readingCanvas.width!==r||this.readingCanvas.height!==s)&&(this.readingCanvas.width=r,this.readingCanvas.height=s);const a=this.readingCanvas.getContext("2d");a.fillStyle="#fff",a.fillRect(0,0,r,s),a.fillStyle="rgb(18,18,18)",a.shadowColor="rgb(18,18,18)",a.shadowBlur=10;for(const o of e)o.top>this.cssH||o.top+o.height<0||a.fillRect((o.left-14)/4,(o.top-10)/4,(o.width+28)/4,(o.height+20)/4);a.shadowBlur=0,this.readingTexture.needsUpdate=!0}setWhale(e,t){const i=this.whales[e];i&&(i.state=t,i.mesh.visible=!!t&&t.visible,!(!t||!t.visible)&&(i.mesh.position.set(...t.position),i.mesh.quaternion.set(...t.quaternion),i.mesh.scale.setScalar(t.scale),g0(t.articulation,this.skinData,e,t.dissolve),i.material.uniforms.uDissolve.value=t.dissolve))}setOccluder(e,t,i){this.occluder.center.set(...e),this.occluder.radius=t,this.occluder.amount=i}ensureCells(){var c;const e=Math.max(2,Math.round(this.style.cellW*this.dpr)),t=Math.max(3,Math.round(this.style.cellH*this.dpr)),i=Math.round(this.cssW*this.dpr),r=Math.round(this.cssH*this.dpr),s=`${e}x${t}:${i}x${r}`;if(s===this.atlasKey)return{cw:e,ch:t,W:i,H:r};this.atlasKey=s,this.atlas=E0(e,t),(c=this.atlasTexture)==null||c.dispose(),this.atlasTexture=new xl(this.atlas.canvas),this.atlasTexture.flipY=!1,this.atlasTexture.minFilter=ft,this.atlasTexture.magFilter=ft,this.atlasTexture.generateMipmaps=!1,this.cells.setSize(Math.ceil(i/e),Math.ceil(r/t));const a=this.atlas.ramp,o=this.cellMaterial.uniforms,l=new Array(12).fill(a[a.length-1]);return a.forEach((u,f)=>l[f]=u),o.uRamp.value=l,o.uRampN.value=Math.min(12,a.length),{cw:e,ch:t,W:i,H:r}}get glyphs(){var e,t;return this.ensureCells(),{texture:this.atlasTexture,tileW:((e=this.atlas)==null?void 0:e.tileW)??1,tileH:((t=this.atlas)==null?void 0:t.tileH)??1,cols:Un}}invalidateAtlas(){this.atlasKey=""}render(e=!0){if(this.lost)return;const t=this.renderer,{cw:i,ch:r,W:s,H:a}=this.ensureCells();this.skinTexture.needsUpdate=!0,this.camera.updateMatrixWorld();const o=this.camera.matrixWorldInverse;let l=1/0,c=-1/0;for(const p of this.whales){if(!p.mesh.visible||!p.state)continue;const h=-this.tmp.set(...p.state.position).applyMatrix4(o).z;l=Math.min(l,h-p.state.scale*.7),c=Math.max(c,h+p.state.scale*.7)}const u=this.light,f=this.tmp.copy(this.occluder.center).applyMatrix4(o);for(const p of this.whales){const h=p.material.uniforms;h.uLight.value.copy(u),h.uDepthRange.value.set(Number.isFinite(l)?l:0,Number.isFinite(c)?c:1),h.uOccluder.value.set(f.x,f.y,f.z,this.occluder.radius),h.uOcclusion.value=this.occluder.amount,h.uInvert.value=this.style.invert?1:0}const d=this.whales.some(p=>p.mesh.visible);t.setRenderTarget(this.gbuffer),t.setClearColor(0,0),t.clear(!0,!0,!0),t.render(this.scene,this.camera);const[m,g,_]=this.gbuffer.textures;if(t.setRenderTarget(null),t.setClearColor(0,0),t.clear(!0,!0,!0),e&&this.underlay.children.length&&t.render(this.underlay,this.camera),d)if(this.style.mode==="raw"){const p=this.rawMaterial.uniforms;p.uInk.value=m,p.uMask.value=g,p.uCanvas.value.set(s,a),$r(p.uInk3.value,this.style.ink),this.quad.material=this.rawMaterial,t.render(this.quadScene,this.quadCamera)}else{const p=this.cellMaterial.uniforms;p.uInk.value=m,p.uMask.value=g,p.uMarks.value=_,p.uCanvas.value.set(s,a),p.uCell.value.set(i,r),p.uTexel.value.set(1/this.gbuffer.width,1/this.gbuffer.height),p.uShape.value=this.style.mode==="shape"?1:0,p.uSplit.value=this.style.split,p.uGamma.value=this.style.gamma,p.uTone.value=this.style.tone,this.quad.material=this.cellMaterial,t.setRenderTarget(this.cells),t.clear(!0,!1,!1),t.render(this.quadScene,this.quadCamera),t.setRenderTarget(null);const h=this.compositeMaterial.uniforms;h.uAtlas.value=this.atlasTexture,h.uCell.value.set(i,r),h.uTile.value.set(i,r),h.uCanvasH.value=a,h.uMaskCanvas.value.set(s,a),h.uGeometryMask.value=g,$r(h.uWater.value,this.style.water),h.uWaterOpacity.value=this.style.waterOpacity,$r(h.uInk.value,this.style.ink),$r(h.uInkFar.value,this.style.inkFar),h.uOpacity.value=this.style.opacity,h.uContrast.value=this.style.contrast,h.uFarFade.value=this.style.farFade,this.quad.material=this.compositeMaterial,t.render(this.quadScene,this.quadCamera)}e&&this.overlay.children.length&&t.render(this.overlay,this.camera)}clear(){this.lost||(this.renderer.setRenderTarget(null),this.renderer.clear(!0,!0,!0))}dispose(){var e,t;this.canvas.removeEventListener("webglcontextlost",this.onLost),this.canvas.removeEventListener("webglcontextrestored",this.onRestored),this.gbuffer.dispose(),this.cells.dispose(),(e=this.atlasTexture)==null||e.dispose(),this.skinTexture.dispose(),this.readingTexture.dispose(),(t=this.whales[0])==null||t.mesh.geometry.dispose();for(const i of this.whales)i.material.dispose();this.cellMaterial.dispose(),this.compositeMaterial.dispose(),this.rawMaterial.dispose(),this.quad.geometry.dispose(),this.renderer.dispose()}}const yc=1.55,rt={orbit:.15,sphere:.45,dissolve:.64,dissolveSpan:.19,earth:.84,handoff:.955,handoffEnd:.99},Hi=n=>Math.max(0,Math.min(1,n)),lt=(n,e,t)=>{const i=Hi((t-n)/(e-n));return i*i*(3-2*i)},sn=(n,e,t)=>n+(e-n)*t;function Vi(n){return n<rt.orbit?sn(3.5,1.82,lt(0,rt.orbit,n)**.85):n<rt.sphere?sn(1.82,1.74,(n-rt.orbit)/(rt.sphere-rt.orbit)):sn(1.74,1.22,lt(rt.sphere,rt.earth,n))}const us=n=>sn(58,34,lt(.58,.84,n)),oi=4e3,Ci=new Float64Array(oi+1);for(let n=1;n<=oi;n++){const e=(n-.5)/oi;Ci[n]=Ci[n-1]+us(e)/Vi(e)/oi}function C0(n){const e=Hi(n)*oi,t=Math.min(oi-1,Math.floor(e)),i=Ci[t]+(Ci[t+1]-Ci[t])*(e-t);return n<0?n*(us(0)/Vi(0)):n>1?Ci[oi]+(n-1)*(us(1)/Vi(1)):i}const P0=n=>us(Hi(n))/Vi(Hi(n)),D0=n=>.66*lt(rt.sphere-.03,.66,n),Ec=n=>.35+1.1*lt(rt.sphere,rt.earth,n);function dr(n,e){const t=(n===0?1:-1)*D0(e),i=Ec(e);return[-Math.sin(i)*Math.sin(t),Math.cos(t),Math.cos(i)*Math.sin(t)]}function Tc(n,e){const t=Vi(e),i=C0(e)+(n===0?0:Math.PI),r=Ec(e),s=dr(n,e),a=[Math.cos(r),0,Math.sin(r)],o=en(ri(s,a)),l=(n===0?.16:-.16)*(1-lt(.55,.8,e))+.07*Math.sin(i*.5+n*1.7);return[t*(Math.cos(i)*a[0]+Math.sin(i)*o[0])+l*s[0],t*(Math.cos(i)*a[1]+Math.sin(i)*o[1])+l*s[1],t*(Math.cos(i)*a[2]+Math.sin(i)*o[2])+l*s[2]]}const L0=(n,e)=>sn(1.25,.7,lt(.05,rt.orbit+.05,e))+.18*Math.sin(e*37+n*2.4)*(1-lt(.6,.8,e))-.3*lt(.66,.84,e);function I0(n,e=1){return{path:t=>Tc(n,t),up:t=>dr(n,t),length:yc*e*(n===0?1:.94),effort:t=>L0(n,t),phase:n===0?0:2.3,stride:n===0?.95:.88,bankGain:.5,maxBank:.5}}const Ac=n=>-1.9*(1-lt(.6,.955,n))**2,bl=30,wl=16;function U0(n,e,t){const i=Math.tan(t/2*Math.PI/180),r=2*n/e;return Math.sqrt(1+1/(r*i)**2)}function bc(n,e){const t=Hi(n),i=e.width/Math.max(1,e.height),r=i<.9,s=r?1.3:1,a=[0,1].map(b=>{const R=M0(t,I0(b,s)),L=Hi((t-rt.dissolve)/rt.dissolveSpan)*1.06;return{...R,dissolve:L,visible:L<1.05}}),o=lt(.6,.9,t),l=sn(bl,wl,o),c=Math.tan(bl/2*Math.PI/180),f=Vi(t)+yc*s*(r?.3:.36),d=f/(c*i*(r?1:.94)),m=f*.62/(c*.86),g=Math.max(d,m),_=U0(e.globeR,e.height,wl),p=sn(g,_,o),h=sn(10,r?40:26,lt(0,.3,t))*(1-lt(.5,.9,t))*Math.PI/180,T=-34*lt(.05,.42,t)*(1-lt(.5,.88,t))*Math.PI/180,S=[p*Math.cos(h)*Math.sin(T),p*Math.sin(h),p*Math.cos(h)*Math.cos(T)],M=lt(.55,.88,t),P={position:S,up:[0,1,0],fov:l,centerX:sn(e.width/2,e.globeX,M),centerY:sn(e.height*(r?.46:.5),e.globeY,M)};return{p:t,whales:a,camera:P,spin:Ac(t),ortho:lt(.86,.955,t),occlusion:.92*lt(.6,.76,t),disc:lt(.78,.95,t),globeReveal:lt(rt.handoff,rt.handoffEnd-.005,t),layer:1-lt(rt.handoffEnd-.004,1,t),orbitNormals:[dr(0,t),dr(1,t)],omega:P0(t)}}const N0=`
${Mc}
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
  skinWhale(aSkin.y, aOff, vec3(0.0, 1.0, 0.0), aSkin.z, w * ${lr}, p, n, tg);
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
`,F0=`
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
`,O0=`
void main() { gl_Position = vec4(position.xy, 0.0, 1.0); }
`,B0=`
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
`,z0=["·",".",":","·","+","'","-","."],k0=[[86,99,109],[60,72,82],[38,49,58]],ta=n=>new N(n[0]/255,n[1]/255,n[2]/255);function G0(n,e){const t=Pl(n,e),{east:i,north:r}=Oc(t);return new Ne().set(i[0],i[1],i[2],r[0],r[1],r[2],t[0],t[1],t[2])}function H0(n,e,t){const i=t??new Sc(n,{maxWhales:2,gbufferScale:.75});let r={width:1,height:1,globeX:0,globeY:0,globeR:1},s=1;const a=G0(e.lon,e.lat),o=new Ne,l=new Ne,c=new N,u=new qi,f=new N,d=new bt({glslVersion:Fn,vertexShader:O0,fragmentShader:B0,transparent:!0,blending:cr,blendSrc:ur,blendDst:li,depthTest:!1,depthWrite:!1,uniforms:{uCanvasDev:{value:new Ge},uDpr:{value:1},uDisc:{value:new N},uAlpha:{value:0}}}),m=new kt(new Yi(2,2),d);m.frustumCulled=!1,i.underlay.add(m);const g=new bt({glslVersion:Fn,vertexShader:N0,fragmentShader:F0,transparent:!0,blending:cr,blendSrc:ur,blendDst:li,depthTest:!1,depthWrite:!1,uniforms:{uSkin:{value:i.skinTexture},...i.pivotUniforms,uModel:{value:[new st,new st]},uAxis:{value:[new N(0,1,0),new N(0,1,0)]},uP:{value:0},uOmega:{value:0},uEarth:{value:l},uCamPos:{value:new N},uCanvas:{value:new Ge},uGlobe:{value:new N},uOrtho:{value:0},uOcc:{value:0},uDpr:{value:1},uCellPx:{value:new Ge(6,10)},uFlight:{value:z0.map(ht)},uInk:{value:ta([31,59,87])},uBand:{value:k0.map(ta)},uGrat:{value:ta([31,59,87])},uDotScale:{value:1},uAtlas:{value:null},uTile:{value:new Ge(1,1)},uAtlasCols:{value:8},uLayer:{value:1}}}),_=new Ym(new Qt,g);_.frustumCulled=!1,i.overlay.add(_);const p=(S,M)=>{const P=gc(7),b=[],R=[],L=(Q,se)=>{const be=Pl(Q,se);b.push(be[0],be[1],be[2]),R.push(3)};for(let Q=-180;Q<180;Q+=30)for(let se=-78;se<=78;se+=3)L(Q,se);for(let Q=-60;Q<=60;Q+=30)for(let se=-180;se<180;se+=3)L(se,Q);const E=R.length;if(S&&M)for(let Q=0;Q<3;Q++)for(let se=M[Q];se<M[Q+1];se++)b.push(S[se*3],S[se*3+1],S[se*3+2]),R.push(Q);const x=R.length,w=Tl(4096,11),k=Tl(1024,12,(Q,se)=>Q[se*4]===or),O=new Float32Array(b),X=new Float32Array(x*4),Z=new Float32Array(x*3),G=new Float32Array(x*4),$=a.elements,V=(Q,se,be,ke)=>{const H=dr(Q,se),K=Math.abs(H[2])<.9?[H[1],-H[0],0]:[0,H[2],-H[1]],ue=Math.hypot(K[0],K[1],K[2]),ne=[K[0]/ue,K[1]/ue,K[2]/ue],Ee=[H[1]*ne[2]-H[2]*ne[1],H[2]*ne[0]-H[0]*ne[2],H[0]*ne[1]-H[1]*ne[0]],we=_e=>Math.atan2(_e[0]*Ee[0]+_e[1]*Ee[1]+_e[2]*Ee[2],_e[0]*ne[0]+_e[1]*ne[1]+_e[2]*ne[2]),Ce=Ac(ke),de=O[be*3],ae=O[be*3+1],Fe=O[be*3+2],C=Math.cos(Ce)*de-Math.sin(Ce)*ae,We=Math.sin(Ce)*de+Math.cos(Ce)*ae,Re=[$[0]*C+$[3]*We+$[6]*Fe,$[1]*C+$[4]*We+$[7]*Fe,$[2]*C+$[5]*We+$[8]*Fe];return((we(Re)-we(Tc(Q,se)))%(2*Math.PI)+2*Math.PI)%(2*Math.PI)};for(let Q=0;Q<x;Q++){const se=P(),be=Q<E,ke=be?k:w,H=Math.floor(P()*ke.count),K=ke.info[H*4+3],ue=be?rt.sphere+.02+P()*(rt.dissolve-rt.sphere+.02):rt.dissolve+(1-Math.min(1,K))*rt.dissolveSpan*.97+(se-.5)*.012,ne=ue+.08,Ee=V(0,ue,Q,ne),we=V(1,ue,Q,ne),Ce=Ee<=we?0:1,de=Math.min(Ee,we),ae=be?.1+de/52+.03*P():Math.min(.955-.012-ue,.032+de/44+.012*P());X.set([Ce,ke.spine[H],ke.info[H*4],K],Q*4),Z.set([ke.offset[H*3],ke.offset[H*3+1],ke.offset[H*3+2]],Q*3),G.set([R[Q],se,ue,Math.max(.02,ae)],Q*4)}const re=new Qt;re.setAttribute("position",new ut(O,3)),re.setAttribute("aGeo",new ut(O,3)),re.setAttribute("aSkin",new ut(X,4)),re.setAttribute("aOff",new ut(Z,3)),re.setAttribute("aMeta",new ut(G,4)),_.geometry.dispose(),_.geometry=re};p(null,null);let h=!1;Fc().then(S=>{h||p(S.xyz,S.bands)}).catch(()=>{});const T={setView(S,M){r=S,s=M,i.resize(S.width,S.height,M),i.setStyle({mode:"shape",cellW:6,cellH:10})},render(S){i.setReadingZones([],0),i.setStyle({...yt,invert:!1,waterOpacity:0});const M=bc(S,r);M.whales.forEach((G,$)=>i.setWhale($,{visible:G.visible,position:G.position,quaternion:G.quaternion,scale:G.scale,articulation:G.articulation,dissolve:G.dissolve}));const P=i.camera;P.fov=M.camera.fov,P.position.set(...M.camera.position),P.up.set(...M.camera.up),P.lookAt(0,0,0);const b=r.width,R=r.height;P.setViewOffset(b,R,b/2-M.camera.centerX,R/2-M.camera.centerY,b,R),P.updateProjectionMatrix(),i.setOccluder([0,0,0],1,M.occlusion),i.setStyle({opacity:M.layer});const L=Math.cos(M.spin),E=Math.sin(M.spin);o.set(L,-E,0,E,L,0,0,0,1),l.multiplyMatrices(a,o);const x=g.uniforms,w=i.glyphs;x.uP.value=M.p,x.uOmega.value=M.omega,x.uCamPos.value.copy(P.position),x.uCanvas.value.set(b,R),x.uGlobe.value.set(r.globeX,r.globeY,r.globeR),x.uOrtho.value=M.ortho,x.uOcc.value=M.occlusion,x.uDpr.value=s,x.uCellPx.value.set(i.style.cellW,i.style.cellH),x.uDotScale.value=Math.max(.75,Math.min(1.6,r.globeR/300)),x.uAtlas.value=w.texture,x.uTile.value.set(w.tileW,w.tileH),x.uAtlasCols.value=w.cols,x.uLayer.value=M.layer;for(let G=0;G<2;G++){const $=M.whales[G];x.uModel.value[G].compose(c.set(...$.position),u.set(...$.quaternion),f.setScalar($.scale)),x.uAxis.value[G].set(...M.orbitNormals[G])}_.visible=M.p>rt.sphere;const k=d.uniforms,O=Math.tan(P.fov/2*(Math.PI/180)),X=P.position.length(),Z=R/2/O/Math.sqrt(Math.max(.001,X*X-1));return k.uCanvasDev.value.set(Math.round(b*s),Math.round(R*s)),k.uDpr.value=s,k.uDisc.value.set(M.camera.centerX,M.camera.centerY,Z+(r.globeR-Z)*M.ortho),k.uAlpha.value=M.disc*M.layer,m.visible=M.disc>.001,i.render(),{globeReveal:M.globeReveal,layer:M.layer}},clear(){i.clear()},finish(){const S=i.renderer.getContext(),M=new Uint8Array(4);S.readPixels(0,0,1,1,S.RGBA,S.UNSIGNED_BYTE,M)},get lost(){return i.lost},onContextLost:null,destroy(){h=!0,_.geometry.dispose(),g.dispose(),m.geometry.dispose(),d.dispose(),i.overlay.remove(_),i.underlay.remove(m),t||i.dispose()}};return t||(i.onContextLost=()=>{var S;return(S=T.onContextLost)==null?void 0:S.call(T)}),T}const Rl=2.4,$a=Math.PI*2,pr=(n,e)=>(n%e+e)%e,Ht=(n,e,t)=>Math.max(e,Math.min(t,n));function xs(n,e){const t=Math.max(1,n),i=Math.max(1,e),r=Math.min(1.3*t,1.5*i,Math.max(.92*t,.8*i)),s=i/(2*r);return{z:Rl,fov:2*Math.atan(s/Rl)*180/Math.PI,halfW:t/(2*r),halfH:s,px:r}}const V0=(n,e)=>n.halfH*(n.z-e)/n.z,Za=n=>{const e=Ht(n,0,1);return e*e*e*(e*(e*6-15)+10)},hs=(n,e,t,i)=>Za((n-e)/i)*(1-Za((n-t)/i)),W0=n=>hs(pr(n,263),115,166,18),X0=n=>hs(pr(n,211),60,96,16),q0=[290,230],Y0=[200,150],K0=(n,e)=>$a*Za((pr(e+n*79,q0[n])-Y0[n])/20),lo=[1,.9],$0=[.62,.55],Z0=[.065,.028],wc=(n,e)=>n===0?hs(pr(e,71),28,52,8):hs(pr(e+23,53),30,41,6),j0=[1.05,1.3],J0=[1,1.15],Q0=n=>.7+1.1*Math.min(1,Math.abs(n)),Zr=[.7,.95],na=[.9,1.25],eg=1.6,tg=[.42,-.5],Rc=2.2,fs=.8,Cl=65*Math.PI/180;function ia(n,e,t){const i=xs(t.width,t.height),r=t.lanes[n]??{x:.5,y:.5},s=Ht(t.weight,0,1)*.68,a=(r.x-.5)*2*i.halfW*s,o=((.5-(n===0?.6:.38))*(1-s)+(.5-r.y)*s)*2*i.halfH,l=(i.halfW*.78+.1)*(1-.45*s);let c,u,f;if(n===0){const d=e*$a/70+.55,m=X0(e);c=a+l*Math.sin(d)+.04*Math.sin(e*.021),u=o+.22*i.halfH*Math.sin(d*.61+.4)-.5*m,f=-.05+.4*Math.cos(d)-.3*m}else{const d=e*$a/50+3.1;c=a+.85*l*Math.sin(d)+.18*Math.sin(d*2.2+.7),u=o+.34*i.halfH*Math.sin(d*.73+1.7)+.06*Math.sin(d*2.9),f=-.55+.32*Math.cos(d)+.12*Math.sin(d*1.6+.3)}if(Number.isFinite(t.surfaceY)){const d=(.5-t.surfaceY/Math.max(1,t.height))*2*i.halfH-.16;u=d-Math.log1p(Math.exp((d-u)*12))/12}return[c,u,f]}function Mn(n,e,t){const i=ia(n,e,t);if(n===0)return i;const r=xs(t.width,t.height),s=ia(0,e,t),a=ia(0,e-9,t),o=W0(e);i[0]+=(a[0]+.2*r.halfW*Math.sin(e*.12)-i[0])*o,i[1]+=(a[1]+.24-i[1])*o,i[2]+=(a[2]-.6-i[2])*o;const l=Gt(i,s),c=on(l),u=Math.log1p(Math.exp((.95-c)*4))/4,f=en([l[0],l[1],l[2]-.1]);return[i[0]+f[0]*u,i[1]+f[1]*u,i[2]+f[2]*u]}const ng=(n=0)=>({s:0,sv:0,drift:[0,0],dv:[0,0],da:[0,0],roll:[n,n],swim:[0,0],fwd:[null,null],spin:[[0,0,0],[0,0,0]],up:[[0,1,0],[0,1,0]],bend:[[0,0],[0,0]],att:[[0,0,0,0],[0,0,0,0]],bank:[[0,0],[0,0]],ahead:0}),Cc=n=>1+eg*Math.min(1,Math.abs(n)),ig=(n,e,t)=>Ht(-Ct(n,e)*Rc*(1+.35*Math.max(0,t)-.15*Math.max(0,-t)),-fs,fs),ra=(n,e,t=fr)=>{let i=Gt(n,ot(e,Ct(n,e)));return on(i)<1e-5&&(i=Gt(t,ot(e,Ct(t,e)))),en(i)};function co(n,e,t,i,r){const a=Mn(n,e-1.2,t),o=Mn(n,e+1.2,t),l=ot(Gt(o,a),Cc(r)/(2*1.2));l[2]*=1-.55*Math.min(1,Math.abs(r)),l[1]+=i;const c=Math.hypot(l[0],l[2]),u=Q0(r);return Math.abs(l[1])>u*c&&(l[1]=Math.sign(l[1])*u*c),l}function rg(n,e,t,i){const r=Math.atan2(t[0],-t[2]),s=Math.asin(Ht(t[1],-1,1)),a=n.att[e];if(!n.fwd[e]){a[0]=r,a[1]=s,a[2]=0,a[3]=0,n.fwd[e]=t,n.spin[e]=[0,0,0],n.up[e]=ra(jt,t);return}n.fwd[e];const o=2.2,l=Math.atan2(Math.sin(r-a[0]),Math.cos(r-a[0])),c=s-a[1],u=Math.cos(a[1]);let f=o*o*l-2*o*a[2],d=o*o*c-2*o*a[3];const m=Math.hypot(f*u,d);m>na[e]&&(f*=na[e]/m,d*=na[e]/m);const g=2*(Math.hypot(a[2]*u,a[3])/Zr[e])**2;f-=g*a[2],d-=g*a[3];let _=a[2]+f*i,p=a[3]+d*i;const h=Math.hypot(_*u,p);h>Zr[e]&&(_*=Zr[e]/h,p*=Zr[e]/h),a[0]+=_*i,a[1]=Ht(a[1]+p*i,-Cl,Cl),a[2]=_,a[3]=p;const T=Math.cos(a[1]),S=Math.sin(a[1]),M=Math.cos(a[0]),P=Math.sin(a[0]),b=[T*P,S,-T*M],R=[T*M*_-S*P*p,T*p,T*P*_+S*M*p],L=ri(b,R);let E=n.up[e];const x=on(L)*i;if(x>0){const G=en(L),$=Math.cos(x),V=Math.sin(x);E=ai(ai(ot(E,$),ot(ri(G,E),V)),ot(G,Ct(G,E)*(1-$)))}n.fwd[e]=b,n.spin[e]=L,E=ra(E,b,jt);const w=ra(jt,b,E),k=Math.atan2(Ct(ri(E,w),b),Ct(E,w)),O=Ht(k,-1,1)*.6*T*i,X=Math.cos(O),Z=Math.sin(O);n.up[e]=en(ai(ot(E,X),ot(ri(b,E),Z)))}function sg(n,e,t,i,r){if(!(t>0))return;const s=xs(r.width,r.height),a=1.6;n.sv+=(a*a*(Ht(e,-1,1)-n.s)-2*a*n.sv)*t,n.s+=n.sv*t;const o=n.s,l=Cc(o);n.ahead+=(l-1)*t;const c=i+n.ahead;for(let u=0;u<2;u++){const f=Mn(u,c-.6,r),d=Mn(u,c+.6,r),m=Mn(u,c,r),g=Math.hypot(d[0]-f[0],d[2]-f[2])/1.2*l,_=(d[1]-f[1])/1.2*l,p=o>=0?j0[u]:J0[u];let h=-o*p*Math.max(g,.04)*(1+.5*Math.abs(o));const T=V0(s,m[2])+.75,S=2*T,M=n.drift[u]-S*Math.round(n.drift[u]/S),P=1-Math.min(1,Math.abs(o)/.2);h-=Ht(M*.1,-.03,.03)*P;const b=(h-n.dv[u])/.9;n.dv[u]+=b*t,n.da[u]=b,n.drift[u]+=n.dv[u]*t;const R=m[1]+n.drift[u];R<-T?n.drift[u]+=S:R>T&&(n.drift[u]-=S),n.roll[u]+=t*(1+1.4*Math.max(0,o)-.45*Math.max(0,-o)),n.swim[u]+=t*(Z0[u]*(1-.65*wc(u,c))+Math.hypot(g,_+n.dv[u]))/lo[u],rg(n,u,en(co(u,c,r,n.dv[u],o)),t);const[L,E]=Pc(u,c,r,n),x=1-Math.exp(-t/.55);n.bend[u]=[n.bend[u][0]+(L-n.bend[u][0])*x,n.bend[u][1]+(E-n.bend[u][1])*x];const w=n.bank[u],k=ig(n.spin[u],n.up[u],o)+tg[u]*n.att[u][3],O=1.5,X=.75;w[1]+=(O*O*(k-w[0])-2*X*O*w[1])*t,w[0]+=w[1]*t}}function Pc(n,e,t,i){const s=Mn(n,e,t),a=Mn(n,e-1.2,t),o=Mn(n,e+1.2,t),l=co(n,e,t,(i==null?void 0:i.dv[n])??0,(i==null?void 0:i.s)??0),c=ot([o[0]+a[0]-s[0]*2,o[1]+a[1]-s[1]*2,o[2]+a[2]-s[2]*2],1/(1.2*1.2));c[1]+=(i==null?void 0:i.da[n])??0;const u=Math.max(.005,on(l)),f=(i==null?void 0:i.fwd[n])??en(l),d=ls(f,i?i.up[n]:jt),m=lo[n],g=u*u+(.08*m)**2,_=i==null?void 0:i.spin[n],p=_?ot(ri(_,f),Math.sqrt(g)):c;return[Ht(Ct(p,Tn(d,Gn))*m/g,-.65,.65),Ht(Ct(p,Tn(d,jt))*m/g,-.3,.3)]}function ag(n,e,t,i){const r=e+((i==null?void 0:i.ahead)??0),s=Mn(n,r,t),a=(i==null?void 0:i.s)??0,o=co(n,r,t,(i==null?void 0:i.dv[n])??0,a),l=Math.max(.005,on(o)),c=(i==null?void 0:i.fwd[n])??en(o),u=i?i.up[n]:jt,f=lo[n],[d,m]=i?i.bend[n]:Pc(n,r,t),g=i?i.bank[n][0]:Ht(d*(l/f)*Rc,-fs,fs),_=g+K0(n,(i==null?void 0:i.roll[n])??e),p=wc(n,r),h=i?Ht(Math.tanh(a/.15)*i.sv,-1,1):0,T=((.45+Math.min(.45,l/f*2.8))*(1-.92*p)+.4*Math.abs(a))*(1+.45*Math.min(0,h))+.55*Math.max(0,h),S=_c({distance:i?i.swim[n]:e*(n===0?.115:.135),effort:T,turn:d,climb:m,bank:g,phase:n*2.3,stride:$0[n]}),M=ls(c,u,_),P=S.stroke,b=.013*f*S.amplitude*Math.sin(P-2.4),R=.028*S.amplitude*Math.sin(P-1.2),L=Tn(M,jt);return{position:[s[0]+L[0]*b,s[1]+((i==null?void 0:i.drift[n])??0)+L[1]*b,s[2]+L[2]*b],quaternion:Ri(Gi(zn(Tn(M,Gn),R),M)),scale:f,bank:_,articulation:S}}const gt=(n,e,t)=>n+(e-n)*t,Zn=(n,e)=>Number.isFinite(n)?n:e;function og(n,e,t){const i=(s,a)=>({sweep:gt(s.sweep,a.sweep,t),dihedral:gt(s.dihedral,a.dihedral,t),twist:gt(s.twist,a.twist,t)}),r=Math.atan2(Math.sin(e.stroke-n.stroke),Math.cos(e.stroke-n.stroke));return{stroke:n.stroke+r*t,amplitude:gt(n.amplitude,e.amplitude,t),bendYaw:gt(n.bendYaw,e.bendYaw,t),bendPitch:gt(n.bendPitch,e.bendPitch,t),flipperL:i(n.flipperL,e.flipperL),flipperR:i(n.flipperR,e.flipperR),fluke:gt(n.fluke,e.fluke,t),flukeFlex:gt(n.flukeFlex,e.flukeFlex,t)}}function ug(n){var Ce;const e=document.createElement("canvas");e.className="absolute inset-0 w-full h-full block pointer-events-none",e.dataset.whaleRenderer="shared-3d",n.appendChild(e);let t;try{t=new Sc(e,{gbufferScale:innerWidth<768?.5:.65})}catch{return e.remove(),()=>{}}let i=null,r="",s=!1,a=0,o=performance.now(),l=0,c=0,u=!0,f=!0,d=null,m=-1,g=-1,_=0,p=0,h=innerWidth<768?.5:.65,T="",S=null,M=[],P=0,b=null,R=!1;const L=matchMedia("(prefers-reduced-motion: reduce)"),E=()=>L.matches||R,x=()=>Math.max(1,innerWidth||1),w=()=>Math.max(1,innerHeight||1),k={width:x(),height:w(),weight:Zn(wn.weight,0),lanes:wn.lanes.map(de=>({...de})),surfaceY:wn.surfaceY},O=ng(0);let X=scrollY,Z=0;const G=()=>Nt.listeners.forEach(de=>de()),$=()=>{const de=!!i&&!!Xt.host&&!t.lost&&!E();Nt.ready!==de&&(Nt.ready=de,G())},V=()=>{const de=Xt.host.getBoundingClientRect(),{cx:ae,cy:Fe,baseR:C}=Gc(de.width,de.height);return{r:de,view:{width:de.width,height:de.height,globeX:ae,globeY:Fe,globeR:C*1.08}}},re=()=>{const de=Xt.firstCity;de&&Xt.host&&r!==`${de.lon}:${de.lat}`&&(i==null||i.destroy(),i=H0(e,de,t),r=`${de.lon}:${de.lat}`),$()},Q=(de,ae,Fe)=>{const C=Math.min(devicePixelRatio||1,de<768?1:1.25),We=`${de}:${ae}:${C}:${Fe}`;return We===T?!1:(T=We,t.resize(de,ae,C),t.setStyle({mode:"shape",cellW:6,cellH:10}),f=!0,!0)},se=()=>{t.camera.updateMatrixWorld();const de=new N;M.forEach((ae,Fe)=>{const C=_0(ae.articulation);for(let We=0;We<48;We++){const Re=Tn(ae.quaternion,[C.p[We*4]*ae.scale,C.p[We*4+1]*ae.scale,C.p[We*4+2]*ae.scale]);de.set(Re[0]+ae.position[0],Re[1]+ae.position[1],Re[2]+ae.position[2]).project(t.camera),Vn.spines[Fe][We*2]=(de.x+1)*innerWidth/2,Vn.spines[Fe][We*2+1]=(1-de.y)*innerHeight/2}})},be=de=>{const ae=scrollY,Fe=Math.max(-w()*.25,Math.min(w()*.25,Zn(ae-X,0)));X=ae;const C=de>0?Fe/de:0;Z=Zn(Z+(C-Z)*(1-Math.exp(-de/.18)),0),sg(O,Math.tanh(Z/(w()*.9)),de,c,k)},ke=(de,ae)=>{e.parentElement!==n&&n.appendChild(e),Q(x(),w(),!1);const Fe=E()?1:1-Math.exp(-de*1.3);k.width=x(),k.height=w(),k.weight=Zn(k.weight+(Zn(wn.weight,0)-k.weight)*Fe,0),k.lanes.forEach((te,le)=>{const De=wn.lanes[le]??te;te.x=Zn(te.x+(De.x-te.x)*Fe,.5),te.y=Zn(te.y+(De.y-te.y)*Fe,.5)}),k.surfaceY=wn.surfaceY;const C=E()?void 0:O,We=[0,1].map(te=>({...ag(te,c,k,C),dissolve:0,visible:!0}));(ae<=0||!S)&&(S=We),M=ae>0?S.map(te=>({...te})):We;const Re=xs(x(),w()),Pe=t.camera,_e=E()?0:1-ae,Ye=.05*Math.sin(c*Math.PI*2/97)*_e,xe=.035*Math.sin(c*Math.PI*2/131+1)*_e;if(Pe.position.set(Ye,xe,Re.z),Pe.up.set(0,1,0),Pe.lookAt(Ye*.35,xe*.35,0),Pe.fov=Re.fov,Pe.clearViewOffset(),ae>0&&Xt.host){const{r:te,view:le}=V(),De=bc(0,le),ee=new It(De.camera.fov,le.width/le.height);ee.position.set(...De.camera.position),ee.up.set(...De.camera.up),ee.lookAt(0,0,0);const ge=u0(ee.quaternion.toArray()),Ae=Re.z/ee.position.length();M=M.map((pe,He)=>{const Ie=De.whales[He],Ke=Tn(ge,[Ie.position[0]-De.camera.position[0],Ie.position[1]-De.camera.position[1],Ie.position[2]-De.camera.position[2]]);return{...pe,position:c0(pe.position,[Ke[0]*Ae,Ke[1]*Ae,Ke[2]*Ae+Re.z],ae),quaternion:h0(pe.quaternion,Gi(ge,Ie.quaternion),ae),scale:gt(pe.scale,Ie.scale*Ae,ae),articulation:og(pe.articulation,Ie.articulation,ae)}});const Le=Math.atan(Math.tan(De.camera.fov*Math.PI/360)*w()/le.height)*360/Math.PI;Pe.fov=gt(Re.fov,Le,ae),Pe.setViewOffset(x(),w(),(x()/2-te.left-De.camera.centerX)*ae,(w()/2-te.top-De.camera.centerY)*ae,x(),w())}Pe.updateProjectionMatrix(),t.setOccluder([0,0,0],0,0);const A=1-kc(scrollY,xo.start,xo.travel)/255,v=zc(A),F=(1-A)*255,Y=E()?yr.rects.length?.35:.8:ae>0?1:wn.presence,J=yt.ink,q=yt.inkFar;t.setStyle({opacity:Y*gt(1-.06*k.weight,1,ae),gamma:yt.gamma,tone:yt.tone,contrast:yt.contrast,farFade:yt.farFade,invert:v>.5,water:[F,F,F],waterOpacity:.82*(1-ae),ink:[gt(J[0],178,v),gt(J[1],204,v),gt(J[2],214,v)],inkFar:[gt(q[0],112,v),gt(q[1],151,v),gt(q[2],165,v)]});const ve=Bc.read();(f||ae>0||ve!==d||m!==Ss.version||g!==yr.version)&&(t.setReadingZones([...ve,...Ss.rects,...ae>0?[]:yr.rects],1-ae),d=ve,m=Ss.version,g=yr.version,f=!1),M.forEach((te,le)=>t.setWhale(le,te)),Vn.presence=Y,t.render(!1),se()},H=de=>{if(a=0,s||document.hidden||t.lost)return;const ae=Math.min(.05,Math.max(0,(de-o)/1e3));o=de,re();const Fe=Hc(scrollY),C=Nt.ready&&!!Xt.host&&Nt.length>0;P=C?Vc(scrollY,Nt.start-innerHeight*.95,Nt.start):0;const We=C&&scrollY>=Nt.start&&Fe<1,Re=C&&scrollY<Nt.start&&P>0,Pe=C&&Fe>=1&&wn.presence<.002,_e=!E()&&!We&&!Re&&!Pe&&b===null;if(_e?(c+=ae,be(ae)):X=scrollY,(u||_e)&&(u||de-l>=1e3/30)){const Ye=performance.now();if(We){e.parentElement!==Xt.host&&Xt.host.appendChild(e);const{view:xe}=V();Q(xe.width,xe.height,!0)&&i.setView(xe,Math.min(devicePixelRatio||1,xe.width<768?1:1.25)),i.render(Fe),Vn.presence=0}else Pe?(t.clear(),Vn.presence=0):ke(ae,Re?P:0);u=!1,l=de,_++,p+=(performance.now()-Ye-p)*.06,_%90===0&&p>19&&h>.36&&(h=Math.max(.35,h-.1),t.setResolution(h))}_e&&(a=requestAnimationFrame(H))},K=()=>{u=!0,f=!0,!a&&!document.hidden&&!s&&(o=performance.now(),a=requestAnimationFrame(H))},ue=()=>{cancelAnimationFrame(a),a=0,o=performance.now(),document.hidden||K()},ne=()=>{S=null,$(),K()};t.onContextLost=()=>{e.style.visibility="hidden",$(),cancelAnimationFrame(a),a=0,Vn.presence=0};const Ee=()=>{e.style.visibility="",$(),T="",K()};e.addEventListener("webglcontextrestored",Ee),window.addEventListener("scroll",K,{passive:!0}),window.addEventListener("resize",K),document.addEventListener("visibilitychange",ue),L.addEventListener("change",ne),Nt.listeners.add(K),Xt.refresh=K;const we=new ResizeObserver(K);return we.observe(document.body),(Ce=document.fonts)==null||Ce.ready.then(()=>{s||(t.invalidateAtlas(),K())}),K(),()=>{s=!0,cancelAnimationFrame(a),we.disconnect(),window.removeEventListener("scroll",K),window.removeEventListener("resize",K),document.removeEventListener("visibilitychange",ue),L.removeEventListener("change",ne),e.removeEventListener("webglcontextrestored",Ee),Nt.listeners.delete(K),Xt.refresh===K&&(Xt.refresh=null),i==null||i.destroy(),t.dispose(),e.remove(),Nt.ready=!1,Vn.presence=0,G()}}export{ug as mountAmbientWhales};
