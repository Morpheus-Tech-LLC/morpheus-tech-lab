(function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const s of document.querySelectorAll('link[rel="modulepreload"]'))i(s);new MutationObserver(s=>{for(const r of s)if(r.type==="childList")for(const o of r.addedNodes)o.tagName==="LINK"&&o.rel==="modulepreload"&&i(o)}).observe(document,{childList:!0,subtree:!0});function t(s){const r={};return s.integrity&&(r.integrity=s.integrity),s.referrerPolicy&&(r.referrerPolicy=s.referrerPolicy),s.crossOrigin==="use-credentials"?r.credentials="include":s.crossOrigin==="anonymous"?r.credentials="omit":r.credentials="same-origin",r}function i(s){if(s.ep)return;s.ep=!0;const r=t(s);fetch(s.href,r)}})();class Tm{constructor(e=0){this.seed=e,this.p=[];for(let t=0;t<256;t++)this.p[t]=Math.floor(Math.random()*256);for(let t=0;t<256;t++)this.p[256+t]=this.p[t]}fade(e){return e*e*e*(e*(e*6-15)+10)}lerp(e,t,i){return e+i*(t-e)}grad(e,t,i,s){const r=e&15,o=r<8?t:i,a=r<4?i:r===12||r===14?t:s;return((r&1)===0?o:-o)+((r&2)===0?a:-a)}noise(e,t,i){const s=Math.floor(e)&255,r=Math.floor(t)&255,o=Math.floor(i)&255;e-=Math.floor(e),t-=Math.floor(t),i-=Math.floor(i);const a=this.fade(e),l=this.fade(t),c=this.fade(i),u=this.p[s]+r,d=this.p[u]+o,h=this.p[u+1]+o,p=this.p[s+1]+r,g=this.p[p]+o,_=this.p[p+1]+o;return this.lerp(this.lerp(this.lerp(this.grad(this.p[d],e,t,i),this.grad(this.p[g],e-1,t,i),a),this.lerp(this.grad(this.p[h],e,t-1,i),this.grad(this.p[_],e-1,t-1,i),a),l),this.lerp(this.lerp(this.grad(this.p[d+1],e,t,i-1),this.grad(this.p[g+1],e-1,t,i-1),a),this.lerp(this.grad(this.p[h+1],e,t-1,i-1),this.grad(this.p[_+1],e-1,t-1,i-1),a),l),c)}}function Ac(n,e=.3,t=null){return(i,s)=>{const r=Math.floor(s/2),a=Math.floor((t||s)/2),l=Math.max(0,r-a),c=Math.min(s-1,r+a),u=Math.max(0,r-a),d=Math.min(s-1,r+a),h=Math.max(0,r-a),p=Math.min(s-1,r+a),g=new Tm(Date.now()%1e4),_=Math.max(.01,Math.min(.5,n/100)),m=1-2*e;for(let f=l;f<=c;f++)for(let M=u;M<=d;M++)for(let b=h;b<=p;b++)g.noise((f-r)*_,(M-r)*_,(b-r)*_)>m&&i.set(f,M,b,1)}}function Am(n=5,e=1){return(t,i)=>{const s=Math.floor(i/2);for(let r=s-n;r<=s+n-1;r++)for(let o=s-n;o<=s+n-1;o++)for(let a=s-n;a<=s+n-1;a++)Math.random()<e&&t.set(r,o,a,1)}}function af(n,e=1){return(t,i)=>{const s=Math.floor(i/2)-Math.floor(n/2);for(let r=s;r<s+n;r++)for(let o=s;o<s+n;o++)for(let a=s;a<s+n;a++)Math.random()<e&&t.set(r,o,a,1)}}function Rc(n=7,e=1){return(t,i)=>{const s=Math.floor(i/2);for(let r=0;r<n;r++)for(let o=0;o<=r;o++)for(let a=0;a<=r-o;a++){const l=s-Math.floor(n/2)+o,c=s-Math.floor(n/2)+r,u=s-Math.floor(n/2)+a;Math.random()<e&&t.set(l,c,u,1)}}}function Cc(n=8,e=1){return(t,i)=>{const s=Math.floor(i/2);for(let r=s-n;r<=s+n;r++)for(let o=s-n;o<=s+n;o++)for(let a=s-n;a<=s+n;a++){const l=Math.abs(r-s),c=Math.abs(o-s),u=Math.abs(a-s);l+c+u<=n&&r>=0&&r<i&&o>=0&&o<i&&a>=0&&a<i&&Math.random()<e&&t.set(r,o,a,1)}}}function Pc(n=8,e=.5,t=null){return(i,s)=>{const r=(s-1)/2,o=t||s,a=o/2,l=Math.max(0,Math.floor(r-a)),c=Math.min(s-1,Math.floor(r+a)),u=Math.max(0,Math.floor(r-a)),d=Math.min(s-1,Math.floor(r+a)),h=Math.max(0,Math.floor(r-a)),p=Math.min(s-1,Math.floor(r+a)),g=Date.now()%1e4,_=(T,A,R)=>{const S=(T*73856093^A*19349663^R*83492791)+g;return(S*(S*S*15731+789221)+1376312589&2147483647)/2147483648},m=Math.max(2,Math.floor(Math.cbrt(n))),f=o/m,M=r-a,b=r-a,E=r-a,L=[];for(let T=0;T<m;T++)for(let A=0;A<m;A++)for(let R=0;R<m;R++){const S=_(T,A,R)*f,y=_(T+1,A,R)*f,D=_(T,A+1,R)*f;L.push({x:M+T*f+S,y:b+A*f+y,z:E+R*f+D})}for(let T=l;T<=c;T++)for(let A=u;A<=d;A++)for(let R=h;R<=p;R++){let S=1/0;for(const D of L){const $=Math.sqrt((T-D.x)**2+(A-D.y)**2+(R-D.z)**2);S=Math.min(S,$)}Math.min(1,S/f)<e&&i.set(T,A,R,1)}}}function Rm(){return(n,e)=>{const t=Math.floor(e/2)-1,i=Math.floor(e/2)-1;n.set(t,0,i,1)}}function Cm(n,e,t,i){switch(n){case"perlin":return Ac(e,t,i);case"worley":return Pc(e,t,i);case"tetrahedron":return Rc(e,t);case"octahedron":return Cc(e,t);default:return af(Math.max(1,e),t)}}const fr=26;class Hi extends Error{constructor(e){super(e),this.name="RuleError"}}function yi(n){if(!n||typeof n!="object")throw new Hi("Rules must be an object with birth and survival lists.");const e=Wu(n.birth,"birth"),t=Wu(n.survival,"survival");if(e.includes(0))throw new Hi("Birth with 0 live neighbours (B0) is not allowed: every empty cell of an unbounded world would come to life at once. Remove 0 from the birth counts.");return{birth:e,survival:t}}function Wu(n,e){if(!Array.isArray(n))throw new Hi(`The ${e} counts must be a list of numbers.`);for(const t of n)if(!Number.isInteger(t)||t<0||t>fr)throw new Hi(`The ${e} counts must be whole numbers from 0 to ${fr}; ${JSON.stringify(t)} is not.`);return[...new Set(n)].sort((t,i)=>t-i)}const Pm=(n,e)=>Array.from({length:e-n+1},(t,i)=>n+i);function Lm(){const n=new Int32Array(3e3);let e=0;for(let t=-5;t<5;t++)for(let i=-5;i<5;i++)for(let s=-5;s<5;s++)n[e++]=s,n[e++]=i,n[e++]=t;return n}const Dm=Int32Array.from([-2,-5,-5,3,-5,-5,-2,-4,-5,1,-4,-5,-3,-3,-5,-4,-2,-5,-2,-2,-5,4,-2,-5,-4,-1,-5,1,0,-5,-5,1,-5,-4,1,-5,-3,1,-5,-2,1,-5,-5,3,-5,-3,3,-5,-1,3,-5,-5,4,-5,-3,4,-5,-2,4,-5,0,-5,-4,3,-5,-4,4,-5,-4,-5,-4,-4,-2,-4,-4,-1,-4,-4,-2,-3,-4,2,-3,-4,3,-3,-4,-4,-2,-4,-2,-2,-4,2,-2,-4,-4,-1,-4,3,-1,-4,-5,0,-4,-3,0,-4,-1,0,-4,1,0,-4,3,0,-4,4,0,-4,3,1,-4,4,1,-4,-5,2,-4,-3,3,-4,-2,4,-4,1,4,-4,2,4,-4,-1,-5,-3,1,-5,-3,1,-4,-3,-1,-3,-3,0,-3,-3,-1,-1,-3,2,-1,-3,3,-1,-3,4,-1,-3,-5,0,-3,-3,0,-3,-2,0,-3,2,0,-3,-3,1,-3,0,1,-3,-3,2,-3,2,2,-3,-1,3,-3,3,4,-3,-2,-5,-2,-2,-4,-2,4,-4,-2,-2,-2,-2,1,-2,-2,-5,-1,-2,-2,-1,-2,2,-1,-2,1,0,-2,3,0,-2,-2,1,-2,-1,1,-2,0,1,-2,1,1,-2,-4,2,-2,-3,2,-2,0,2,-2,1,2,-2,2,2,-2,2,3,-2,-3,4,-2,0,4,-2,1,4,-2,3,4,-2,4,-5,-1,-3,-4,-1,0,-4,-1,-2,-3,-1,-4,-2,-1,0,-2,-1,4,-2,-1,-1,-1,-1,0,-1,-1,1,-1,-1,-2,0,-1,2,0,-1,0,2,-1,1,2,-1,-4,4,-1,2,4,-1,-5,-5,0,-1,-3,0,0,-3,0,-5,-2,0,-3,-2,0,2,-2,0,3,-2,0,4,-2,0,-4,-1,0,1,-1,0,-2,0,0,4,0,0,-5,1,0,-4,1,0,-3,1,0,1,1,0,3,1,0,-4,2,0,1,2,0,-3,3,0,-2,3,0,-1,3,0,1,3,0,-2,4,0,1,4,0,2,4,0,-5,-5,1,-4,-5,1,-2,-5,1,-4,-4,1,-3,-4,1,4,-4,1,-3,-3,1,-1,-3,1,1,-3,1,-1,-2,1,2,-2,1,0,0,1,-2,1,1,2,1,1,-3,2,1,1,2,1,2,2,1,3,2,1,1,3,1,3,3,1,-3,4,1,2,4,1,4,4,1,-2,-5,2,1,-5,2,-5,-4,2,0,-4,2,0,-3,2,2,-3,2,0,-1,2,1,0,2,4,0,2,1,1,2,2,1,2,3,2,2,-2,3,2,-3,4,2,-2,4,2,0,4,2,4,4,2,-5,-5,3,-1,-5,3,-5,-4,3,-3,-4,3,-2,-4,3,-3,-3,3,-2,-3,3,-1,-3,3,4,-3,3,-1,-2,3,-4,-1,3,-3,-1,3,-1,-1,3,1,-1,3,-4,0,3,-3,0,3,1,0,3,2,0,3,-5,1,3,-1,1,3,0,3,3,1,3,3,2,3,3,3,3,3,0,4,3,2,-5,4,-2,-4,4,-4,-3,4,3,-3,4,-3,-2,4,0,-2,4,2,-2,4,-5,-1,4,2,-1,4,3,-1,4,4,-1,4,-3,0,4,0,0,4,2,0,4,0,1,4,2,1,4,-2,3,4,0,3,4,2,3,4,-5,4,4,-4,4,4,-3,4,4,-2,4,4,-1,4,4,0,4,4,2,4,4,3,4,4]),Im=n=>Int32Array.from(n.flatMap(([e,t,i])=>[e-1,t-1,i-1])),Um=[{id:"ship-p1",name:"Ship: period 1, c",description:"17 cells that shed to an 8-cell ship by generation 24, then fly along +x one cell a generation, the fastest any pattern can go.",rules:{birth:[4],survival:[6]},seed:[[1,0,0],[0,1,0],[2,1,0],[0,0,1],[2,0,1],[0,1,1],[2,1,1],[0,2,1],[1,2,1],[0,0,2],[2,0,2],[0,1,2],[1,1,2],[2,1,2],[0,2,2],[1,2,2],[2,2,2]],ship:{from:24,period:1,shift:[1,0,0]}},{id:"ship-p2-c",name:"Ship: period 2, c",description:"A ship by generation 10: 2 cells along +x every 2 generations, wobbling up and down in z as it goes.",rules:{birth:[4],survival:[7]},seed:[[0,0,0],[1,0,0],[2,0,0],[0,1,0],[1,1,0],[0,0,1],[2,0,1],[1,1,1],[0,2,1],[2,2,1],[0,0,2],[2,0,2],[1,1,2]],ship:{from:10,period:2,shift:[2,0,0]}},{id:"ship-p2-c2",name:"Ship: period 2, c/2",description:"A ship by generation 3: one cell along -y every 2 generations, wobbling in x and z.",rules:{birth:[5,6],survival:[1,4,9]},seed:[[1,0,0],[2,0,0],[1,1,0],[2,1,0],[0,2,0],[1,2,0],[2,2,0],[0,0,1],[2,0,1],[0,1,1],[1,2,1],[0,0,2],[1,0,2],[2,0,2],[0,1,2],[2,1,2],[1,2,2],[2,2,2]],ship:{from:3,period:2,shift:[0,-1,0]}},{id:"ship-p3",name:"Ship: period 3, c",description:"A ship by generation 19: 3 cells along +y every 3 generations.",rules:{birth:[4],survival:[7,8,11]},seed:[[2,0,0],[1,1,0],[2,1,0],[0,2,0],[2,2,0],[0,1,1],[1,1,1],[0,2,1],[2,2,1],[0,0,2],[2,0,2],[2,1,2],[1,2,2]],ship:{from:19,period:3,shift:[0,3,0]}},{id:"ship-p4",name:"Ship: period 4, c",description:"A ship by generation 22: 4 cells down, along -z, every 4 generations, 17 and 13 cells by turns.",rules:{birth:[4],survival:[]},seed:[[1,0,0],[2,0,0],[1,1,0],[2,1,0],[0,0,1],[2,0,1],[2,1,1],[0,2,1],[2,2,1],[0,0,2],[0,1,2],[1,1,2],[2,1,2],[1,2,2],[2,2,2]],ship:{from:22,period:4,shift:[0,0,-4]}},{id:"ship-p6",name:"Ship: period 6, c",description:"A ship by generation 3: 6 cells along +x every 6 generations, between 8 and 11 cells on the way.",rules:{birth:[4],survival:[]},seed:[[1,0,0],[0,1,0],[1,1,0],[2,1,0],[2,2,0],[0,0,1],[2,1,1],[0,2,1],[1,2,1],[2,2,1],[1,0,2],[0,1,2],[1,1,2]],ship:{from:3,period:6,shift:[6,0,0]}},{id:"ship-p12",name:"Ship: period 12, c/6",description:"A ship by generation 6: only 2 cells along +y every 12 generations, wobbling in x and z on the way.",rules:{birth:[4],survival:[1,5]},seed:[[0,0,0],[1,0,0],[2,0,0],[1,2,0],[1,0,1],[1,1,1],[2,1,1],[2,2,1],[0,0,2],[1,0,2],[2,0,2],[1,1,2],[1,2,2]],ship:{from:6,period:12,shift:[0,2,0]}},{id:"diagonal-p4",name:"Diagonal ship: period 4, c/4",description:"A ship by generation 36: one cell along +x and one along -y every 4 generations.",rules:{birth:[6,7],survival:[2,4,5,7,10]},seed:[[0,0,0],[2,0,0],[0,1,0],[1,1,0],[0,2,0],[1,2,0],[2,2,0],[0,0,1],[1,0,1],[0,1,1],[2,1,1],[0,2,1],[1,2,1],[0,0,2],[2,0,2],[0,1,2],[2,1,2],[0,2,2],[1,2,2],[2,2,2]],ship:{from:36,period:4,shift:[1,-1,0]}},{id:"diagonal-p6",name:"Diagonal ship: period 6, c/6",description:"A ship by generation 2: one cell along -x and one along -y every 6 generations.",rules:{birth:[5,6],survival:[5,7,10,12]},seed:[[2,0,0],[0,2,0],[1,2,0],[2,0,1],[2,1,1],[0,2,1],[1,2,1],[2,2,1],[0,2,2],[2,2,2]],ship:{from:2,period:6,shift:[-1,-1,0]}}].map(({seed:n,rules:e,...t})=>({...t,rules:yi(e),cells:Im(n),group:"ships"})),Sr=[{id:"cube10",name:"Cube10",description:"The 10³ cube the lab opens on, under its default rules: a dense mass that keeps swelling outward.",rules:yi({birth:[9,10],survival:Pm(5,15)}),cells:Lm()},{id:"spreading-noise",name:"Spreading noise",description:"224 cells that look like chaotic noise, yet keep spreading outward.",rules:yi({birth:[7,13,14],survival:[0,2,3,4,5,6,9,13,19,23,24]}),cells:Dm},...Um],Nm=[{id:"ships",label:"Ships"}];function In(n){return Sr.find(e=>e.id===n)}class Jt{constructor(e,t=0){this.size=e,this.data=new Uint8Array(e*e*e).fill(t),this.active=[]}_idx(e,t,i){return e+t*this.size+i*this.size*this.size}_wrap(e){return(e+this.size)%this.size}get(e,t,i){return this.data[this._idx(e,t,i)]}set(e,t,i,s){const r=this._idx(e,t,i),o=this.data[r];this.data[r]=s,s===1&&o===0?this.active.push([e,t,i]):s===0&&o===1&&(this.active=this.active.filter(([a,l,c])=>a!==e||l!==t||c!==i))}cloneEmpty(){return new Jt(this.size,0)}}const Sa={face:17,edge:11,corner:7},pi=2**19,Xu=[8,16,32],Fm=["cell-limit","extent-limit","coordinate-limit","memory-limit","out-of-memory","arena-edge"];(()=>{const n=[[-1,0],[0],[0,1]],e=new Int32Array(27);for(let t=0;t<27;t++){const[i,s,r]=[t%3,Math.floor(t/3)%3,Math.floor(t/9)];for(const o of n[r])for(const a of n[s])for(const l of n[i])(l||a||o)&&(e[t]|=1<<(o+1)*9+(a+1)*3+(l+1))}return e})();const Om=[...Fm,"stopped","deadline","generation-limit","died","repeat","emits","error"],Bm=1,Oo="morpheus-tech-lab/result",fl=1,Dn=128*1024*1024,Bo=Om.filter(n=>n!=="error"),km=/^[a-z0-9][a-z0-9-]{0,63}$/,Yu=/^sha256:[0-9a-f]{64}$/,pl=100,zm=/^[a-z][A-Za-z]{0,31}$/,qu=8,Gm=["generation","elapsedMs","generationMs","rate","live","livePeak","chunks","chunksPeak","chunksCreated","memoryBytes","usedBytes"];class Ne extends Error{constructor(e){super(e),this.name="ResultError"}}function Ps(n){if(n===null||typeof n=="boolean"||typeof n=="string")return JSON.stringify(n);if(typeof n=="number"){if(!Number.isSafeInteger(n))throw new Ne(`${n} is not a whole number.`);return String(n)}if(Array.isArray(n))return`[${n.map(Ps).join(",")}]`;if(typeof n=="object")return`{${Object.keys(n).sort().map(t=>`${JSON.stringify(t)}:${Ps(n[t])}`).join(",")}}`;throw new Ne(`A ${typeof n} can't be written as canonical JSON.`)}function Lc(n){const e=n.length/3;if(e===0)return new Int32Array(0);const t=[1/0,1/0,1/0],i=[-1/0,-1/0,-1/0];for(let l=0;l<n.length;l+=3)for(let c=0;c<3;c++){const u=n[l+c];u<t[c]&&(t[c]=u),u>i[c]&&(i[c]=u)}const[s,r,o]=i.map((l,c)=>l-t[c]+1),a=new Int32Array(n.length);if(s*r*o<=Number.MAX_SAFE_INTEGER){const l=new Float64Array(e);for(let u=0,d=0;d<e;u+=3,d++)l[d]=((n[u+2]-t[2])*r+(n[u+1]-t[1]))*s+(n[u]-t[0]);l.sort();const c=s*r;for(let u=0;u<e;u++){const d=l[u],h=Math.floor(d/c),p=d-h*c,g=Math.floor(p/s);a[3*u]=p-g*s+t[0],a[3*u+1]=g+t[1],a[3*u+2]=h+t[2]}}else{const l=new BigUint64Array(e);for(let u=0,d=0;d<e;u+=3,d++)l[d]=BigInt(n[u+2]-t[2])<<40n|BigInt(n[u+1]-t[1])<<20n|BigInt(n[u]-t[0]);l.sort();const c=(1n<<20n)-1n;for(let u=0;u<e;u++){const d=l[u];a[3*u]=Number(d&c)+t[0],a[3*u+1]=Number(d>>20n&c)+t[1],a[3*u+2]=Number(d>>40n)+t[2]}}return a}const ts=n=>n>=0?2*n:-2*n-1;function Or(n){let e=1;for(;n>=128;)n=Math.floor(n/128),e++;return e}function Br(n,e,t){for(;t>=128;)n[e++]=t%128|128,t=Math.floor(t/128);return n[e++]=t,e}function Hm(n){const e=n.length/3;let t=Or(e),i=0,s=0,r=0;for(let l=0;l<n.length;l+=3){const[c,u,d]=[n[l],n[l+1],n[l+2]];t+=Or(ts(d-r))+Or(ts(u-s))+Or(ts(c-i)),i=c,s=u,r=d}const o=new Uint8Array(t);let a=Br(o,0,e);i=0,s=0,r=0;for(let l=0;l<n.length;l+=3){const[c,u,d]=[n[l],n[l+1],n[l+2]];a=Br(o,a,ts(d-r)),a=Br(o,a,ts(u-s)),a=Br(o,a,ts(c-i)),i=c,s=u,r=d}return o}function Vm(n,e,t){return Dc(n,e,Lc(t))}function Dc(n,e,t){const i=new TextEncoder().encode(`${Ps({format:Bm,generation:e,run:n})}
`),s=Hm(t),r=new Uint8Array(i.length+s.length);return r.set(i,0),r.set(s,i.length),r}async function Ic(n){const e=new Uint8Array(await crypto.subtle.digest("SHA-256",n));return`sha256:${Array.from(e,t=>t.toString(16).padStart(2,"0")).join("")}`}function lf(n,e,t){return Ic(Vm(n,e,t))}function Uc(n,e="run"){qn(n,e,["contest","rules","seed","arena","limits"]);const{contest:t}=n;if(t!==null&&!(typeof t=="string"&&km.test(t)))throw new Ne(`${e}.contest must be null or a contest id (lower-case letters, digits and dashes).`);qn(n.rules,`${e}.rules`,["birth","survival"]);let i;try{i=yi(n.rules)}catch(c){throw c instanceof Hi?new Ne(`${e}.rules: ${c.message}`):c}let s=null;if(n.arena!==null){qn(n.arena,`${e}.arena`,["min","max"]);const c=zi(n.arena.min,`${e}.arena.min`),u=zi(n.arena.max,`${e}.arena.max`);if(!c.every((d,h)=>d<=u[h]))throw new Ne(`${e}.arena.min must not be past ${e}.arena.max.`);s={min:c,max:u}}qn(n.limits,`${e}.limits`,["cells","extent","generations"]);const r={};for(const c of["cells","extent","generations"]){const u=n.limits[c];if(u!==null&&!(Number.isSafeInteger(u)&&u>=0))throw new Ne(`${e}.limits.${c} must be null or a whole number.`);r[c]=u}if(!Array.isArray(n.seed))throw new Ne(`${e}.seed must be a list of [x, y, z] cells.`);const o=new Int32Array(3*n.seed.length);n.seed.forEach((c,u)=>{const[d,h,p]=zi(c,`${e}.seed[${u}]`);if(s&&!(d>=s.min[0]&&d<=s.max[0]&&h>=s.min[1]&&h<=s.max[1]&&p>=s.min[2]&&p<=s.max[2]))throw new Ne(`${e}.seed[${u}], [${d}, ${h}, ${p}], is outside the arena.`);o.set([d,h,p],3*u)});const a=[],l=Lc(o);for(let c=0;c<l.length;c+=3){const[u,d,h]=[l[c],l[c+1],l[c+2]],p=a[a.length-1];(!p||p[0]!==u||p[1]!==d||p[2]!==h)&&a.push([u,d,h])}if(r.cells!==null&&a.length>r.cells)throw new Ne(`${e}.seed has more cells than ${e}.limits.cells.`);if(r.extent!==null&&a.length){const c=[...a[0]],u=[...a[0]];for(const h of a)for(let p=0;p<3;p++)h[p]<c[p]&&(c[p]=h[p]),h[p]>u[p]&&(u[p]=h[p]);if(Math.max(...u.map((h,p)=>h-c[p]+1))>r.extent)throw new Ne(`${e}.seed is wider than ${e}.limits.extent.`)}return{contest:t,rules:i,seed:a,arena:s,limits:r}}function cf(n,{chunkSize:e,slabBytes:t,memory:i}={}){const s={rules:n.rules,arena:n.arena,limits:{cells:n.limits.cells??void 0,extent:n.limits.extent??void 0,memory:i}};return e!==void 0&&(s.chunkSize=e),t!==void 0&&(s.slabBytes=t),s}async function $m({run:n,generation:e,cells:t,ending:i,details:s={},withCells:r=!1,score:o,departures:a}){const l=Uc(n);if(!Bo.includes(i))throw new Ne(`A run that ended with ${JSON.stringify(i)} can't be a result.`);if(!(Number.isSafeInteger(e)&&e>=0))throw new Ne("generation must be a whole number.");const c=Lc(t),u={format:Oo,version:fl,run:l,generation:e,ending:i};if(o!==void 0&&(u.score=hf(o)),a!==void 0&&(u.departures=uf(a)),Object.assign(u,{hash:await Ic(Dc(l,e,c)),seedHash:await lf(l,0,Int32Array.from(l.seed.flat())),details:{chunkSize:s.chunkSize??null,elapsedMs:s.elapsedMs??null,stats:s.stats??null,browser:s.browser??null}}),ff(u.details),r){const d=new Array(c.length/3);for(let h=0;h<d.length;h++)d[h]=[c[3*h],c[3*h+1],c[3*h+2]];u.cells=d}return u}async function Wm(n){const{run:e,generation:t}=n;return n.seedHash!==void 0&&await lf(e,0,Int32Array.from(e.seed.flat()))!==n.seedHash?"The file's seedHash isn't the hash of its seed.":n.cells!==void 0&&await Ic(Dc(e,t,Int32Array.from(n.cells.flat())))!==n.hash?`The file's cells aren't the ones its hash names for generation ${t}.`:null}function Nc(n){return`${JSON.stringify(n,null,2).replace(/\[\s+([-\d.eE+,\s]+?)\s+\]/g,(e,t)=>`[${t.split(/,\s*/).join(", ")}]`)}
`}function Fc(n){if(typeof n!="string")throw new Ne("A result file is text.");if(n.length>Dn||new TextEncoder().encode(n).length>Dn)throw new Ne(`The file is larger than ${Dn/1024/1024} MB, so it isn't a result file.`);let e;try{e=JSON.parse(n)}catch{throw new Ne("The file isn't JSON.")}if(qn(e,"The file",["format","version","run","generation","ending","hash","details"],["score","departures","seedHash","cells"]),e.format!==Oo)throw new Ne(`The file isn't a result file (its format isn't "${Oo}").`);if(e.version!==fl)throw new Ne(`The file's version is ${JSON.stringify(e.version)}; this lab reads version ${fl}.`);const t=Uc(e.run);if(!(Number.isSafeInteger(e.generation)&&e.generation>=0))throw new Ne("generation must be a whole number.");if(!Bo.includes(e.ending))throw new Ne(`ending must be one of ${Bo.join(", ")}.`);if(typeof e.hash!="string"||!Yu.test(e.hash))throw new Ne('hash must be "sha256:" and 64 lower-case hex digits.');if(e.seedHash!==void 0&&(typeof e.seedHash!="string"||!Yu.test(e.seedHash)))throw new Ne('seedHash must be "sha256:" and 64 lower-case hex digits.');ff(e.details);const i={format:e.format,version:e.version,run:t,generation:e.generation,ending:e.ending};return e.score!==void 0&&(i.score=hf(e.score)),e.departures!==void 0&&(i.departures=uf(e.departures)),i.hash=e.hash,e.seedHash!==void 0&&(i.seedHash=e.seedHash),i.details=e.details,e.cells!==void 0&&(i.cells=df(e.cells)),i}function uf(n){if(!Array.isArray(n))throw new Ne("departures must be a list.");return n.map((e,t)=>{const i=`departures[${t}]`;qn(e,i,["generation","period","shift","cells"]);const{generation:s,period:r}=e;if(!(Number.isSafeInteger(s)&&s>=0))throw new Ne(`${i}.generation must be a whole number.`);if(!(Number.isSafeInteger(r)&&r>=1))throw new Ne(`${i}.period must be a whole number of at least 1.`);const o=zi(e.shift,`${i}.shift`);if(o.every(l=>l===0))throw new Ne(`${i}.shift must move the ship: it can't be [0, 0, 0].`);const a=df(e.cells,`${i}.cells`);if(!a.length)throw new Ne(`${i}.cells must have a cell.`);if(t>0){const l=n[t-1],[c,u,d]=a[0],[h,p,g]=l.cells[0];if(!(s>l.generation||s===l.generation&&(d>g||d===g&&(u>p||u===p&&c>h))))throw new Ne(`${i} is out of order: departures are listed by generation, then by their first cell.`)}return{generation:s,period:r,shift:o,cells:a}})}function df(n,e="cells"){if(!Array.isArray(n))throw new Ne(`${e} must be a list of [x, y, z] cells.`);return n.map((t,i)=>{const[s,r,o]=zi(t,`${e}[${i}]`);if(i>0){const[a,l,c]=n[i-1];if(!(o>c||o===c&&(r>l||r===l&&s>a)))throw new Ne(`${e}[${i}] is out of order or listed twice: cells are sorted by z, then y, then x.`)}return[s,r,o]})}function hf(n){if(!Oc(n))throw new Ne("score must be an object.");const e=Object.keys(n);if(e.length>qu)throw new Ne(`score has more than ${qu} fields.`);const t={};for(const i of e){if(!zm.test(i))throw new Ne(`score has a field with a name that isn't a word, ${JSON.stringify(i.slice(0,pl))}.`);const s=n[i];if(s!==null&&!(Number.isSafeInteger(s)&&s>=0))throw new Ne(`score.${i} must be null or a whole number.`);t[i]=s}return t}function ff(n){if(qn(n,"details",["chunkSize","elapsedMs","stats","browser"]),n.chunkSize!==null&&!Xu.includes(n.chunkSize))throw new Ne(`details.chunkSize must be null or one of ${Xu.join(", ")}.`);if(n.elapsedMs!==null&&!ju(n.elapsedMs))throw new Ne("details.elapsedMs must be null or a number of milliseconds.");if(n.stats!==null){const{stats:e}=n;if(!Oc(e))throw new Ne("details.stats must be null or an object.");for(const t of Object.keys(e))if(t==="extent"){if(e.extent===null)continue;qn(e.extent,"details.stats.extent",["min","max"]),zi(e.extent.min,"details.stats.extent.min"),zi(e.extent.max,"details.stats.extent.max")}else if(Gm.includes(t)){if(!ju(e[t]))throw new Ne(`details.stats.${t} must be a number.`)}else throw new Ne(`details.stats has an unknown field, ${JSON.stringify(t)}.`)}if(n.browser!==null){qn(n.browser,"details.browser",["name","version"]);for(const e of["name","version"]){const t=n.browser[e];if(typeof t!="string"||t.length>pl)throw new Ne(`details.browser.${e} must be text of at most ${pl} characters.`)}}}function Oc(n){return typeof n=="object"&&n!==null&&!Array.isArray(n)}function ju(n){return typeof n=="number"&&Number.isFinite(n)&&n>=0}function qn(n,e,t,i=[]){if(!Oc(n))throw new Ne(`${e} must be an object.`);for(const s of t)if(!Object.hasOwn(n,s))throw new Ne(`${e} is missing ${JSON.stringify(s)}.`);for(const s of Object.keys(n))if(!t.includes(s)&&!i.includes(s))throw new Ne(`${e} has an unknown field, ${JSON.stringify(s)}.`)}function zi(n,e){if(!Array.isArray(n)||n.length!==3||!n.every(t=>Number.isInteger(t)&&t>=-pi&&t<pi))throw new Ne(`${e} must be [x, y, z], whole numbers from ${-pi} to ${pi-1}.`);return[n[0],n[1],n[2]]}const Vt=Object.freeze({min:Object.freeze([-5,-5,-5]),max:Object.freeze([4,4,4])}),pf=Object.freeze({min:Object.freeze([-32,-32,-32]),max:Object.freeze([31,31,31])});function Xm({min:n,max:e}){const t=[];for(let i=n[2];i<=e[2];i++)for(let s=n[1];s<=e[1];s++)for(let r=n[0];r<=e[0];r++)t.push([r,s,i]);return t}const mf=n=>(n&&typeof n=="object"&&(Object.values(n).forEach(mf),Object.freeze(n)),n),Mr="Season 0",Bc="2026-12-31T23:59:00-06:00",Ym={id:"speed-1",kind:"speed",title:"Speed",summary:"How many generations your browser computes in 6 seconds",fixes:{rules:yi({birth:[9,10],survival:[5,6,7,8,9,10,11,12,13,14,15]}),seed:Xm(Vt),arena:null,limits:{cells:null,extent:null,generations:1e3}},chunkSize:16,closes:Bc,seconds:6,ceiling:1e3},qm={id:"methuselah-1",kind:"methuselah",title:"Methuselah",summary:"The longest-lived pattern that settles inside the arena",fixes:{seedBox:Vt,arena:pf,limits:{cells:null,extent:null,generations:1e4}},chunkSize:16,closes:Bc,budget:1e4},jm={id:"classic-methuselah-1",kind:"methuselah",title:"Classic Methuselah",summary:"The longest-lived pattern that settles once its ships have left the arena",fixes:{seedBox:Vt,arena:pf,limits:{cells:null,extent:null,generations:1e4}},chunkSize:16,closes:Bc,budget:1e4,departures:{period:32}},ko=mf([Ym,qm,jm]);function Ls(n){return ko.find(e=>e.id===n)}function gf(n){const e=n.contest===null?void 0:Ls(n.contest)?.departures;return e?{period:e.period}:null}function kc(n,e={}){const{fixes:t}=n;if(!t.rules&&!e.rules)throw new Ne("The entry needs its rules.");if(!t.seed&&!Array.isArray(e.seed))throw new Ne("The entry needs its seed, a list of [x, y, z] cells.");const i=Uc({contest:n.id,rules:t.rules??e.rules,seed:t.seed??e.seed,arena:t.arena,limits:t.limits});if(!t.seed){if(!i.seed.length)throw new Ne("The seed is empty: it needs at least one live cell.");const s=t.seedBox,r=i.seed.find(o=>o.some((a,l)=>a<s.min[l]||a>s.max[l]));if(r)throw new Ne(`The seed's cell [${r.join(", ")}] is outside the seed box, cells ${s.min[0]} to ${s.max[0]} on each axis.`)}return i}function Km(n,e,t){return{generations:e,ms:e===n.ceiling?Math.max(1,Math.round(t)):null}}function Zm(n,e){return n.generations!==e.generations?e.generations-n.generations:(n.ms??1/0)-(e.ms??1/0)}function Jm(n,{ending:e,generation:t,period:i}){if(e!=="died"&&e!=="repeat")return null;const s=e==="died"?1:i;return!(Number.isSafeInteger(s)&&s>=1)||t+s>n.budget?null:{generations:t,period:s}}function Qm(n,e){return n.score.generations!==e.score.generations?e.score.generations-n.score.generations:n.seedCells-e.seedCells}function eg(n){return n.birth.includes(1)?["With birth on 1 neighbour (B1), a pattern grows by at least a cell a generation on every side, so it always reaches the edge of the arena, by generation 37, and can't score."]:[]}const Fi=100,Un=1e6,_f="morpheus-tech-lab/explore-seed",ml=1;class qe extends Error{constructor(e){super(e),this.name="SeedError"}}function tg(n,e,t=0){if(!Number.isInteger(e)||e<1||e>Fi)throw new qe(`The seed's size must be a whole number from 1 to ${Fi}.`);const i=Math.max(2*e+3,(t||0)+1),s=new Jt(i,0);n(s,i);const r=Math.floor(i/2),o=new Int32Array(3*s.active.length);return s.active.forEach(([a,l,c],u)=>{o[3*u]=a-r,o[3*u+1]=l-r,o[3*u+2]=c-r}),o}function Si(n,e){const t=new Set;for(const i of String(n??"").split(",").map(s=>s.trim()).filter(Boolean)){const s=/^(\d+)\s*-\s*(\d+)$/.exec(i),r=/^\d+$/.test(i);if(!s&&!r)throw new qe(`The ${e} counts can't include "${i}": use numbers and ranges, such as 9,10 or 5-15.`);const[o,a]=s?[Number(s[1]),Number(s[2])].sort((l,c)=>l-c):[Number(i),Number(i)];if(a>fr)throw new qe(`The ${e} counts go up to ${fr}, the number of neighbours a cell has; ${a} is too many.`);for(let l=o;l<=a;l++)t.add(l)}return[...t].sort((i,s)=>i-s)}function ng(n,e){const t=Si(n,"birth");if(!t.length)throw new qe("Give at least one birth count, or no cell can ever be born.");return yi({birth:t,survival:Si(e,"survival")})}function wr(n){if(!n)return null;const e=-Math.floor(n/2);return{min:[e,e,e],max:[e+n-1,e+n-1,e+n-1]}}function zc({rules:n,cells:e}){const t=e.length/3;if(t>Un)throw new qe(`That's ${t.toLocaleString("en")} live cells; a seed file holds at most ${Un.toLocaleString("en")}.`);const i=new Array(t);for(let r=0;r<t;r++)i[r]=`    [${e[3*r]}, ${e[3*r+1]}, ${e[3*r+2]}]`;return`${JSON.stringify({format:_f,version:ml,...n&&{rules:n}},null,2).slice(0,-2)},
  "cells": [
${i.join(`,
`)}
  ]
}
`}function vf(n){let e;try{e=JSON.parse(n)}catch{throw new qe("This isn't a seed or simulation file: it isn't JSON.")}if(e?.format!==_f)throw new qe("This isn't a seed or simulation file for Game of Life 3D (unbounded).");if(e.version!==ml)throw new qe(`This file is version ${e.version}; this page reads version ${ml}.`);const t=e.rules===void 0?null:yi(e.rules);if(!Array.isArray(e.cells))throw new qe("The file's cells must be a list.");if(e.cells.length>Un)throw new qe(`The file has ${e.cells.length.toLocaleString("en")} cells; the most it can have is ${Un.toLocaleString("en")}.`);const i=new Int32Array(3*e.cells.length),s=new Set;return e.cells.forEach((r,o)=>{if(!(Array.isArray(r)&&r.length===3&&r.every(c=>Number.isInteger(c)&&c>=-pi&&c<pi)))throw new qe(`Cell ${o+1} of the file isn't [x, y, z] in whole numbers from ${-pi} to ${pi-1}.`);const l=r.join(",");if(s.has(l))throw new qe(`Cell ${o+1} of the file, [${l}], is listed twice.`);s.add(l),i.set(r,3*o)}),{rules:t,cells:i}}const gn=Vt.max[0]-Vt.min[0]+1,$n=gn*gn*gn,ig=100,sg=.3,xf=["cell","line","plane","box","all"],pr=["x","y","z"],yf=Object.freeze({ArrowRight:["right",1],ArrowLeft:["right",-1],ArrowUp:["up",1],ArrowDown:["up",-1],PageUp:["forward",1],PageDown:["forward",-1]}),{min:Ht,max:Wn}=Vt;function zo(n,e,t){return rg(n,e,t)?n-Ht[0]+gn*(e-Ht[1]+gn*(t-Ht[2])):-1}function ir(n){return[Ht[0]+n%gn,Ht[1]+Math.floor(n/gn)%gn,Ht[2]+Math.floor(n/(gn*gn))]}function rg(n,e,t){return n>=Ht[0]&&n<=Wn[0]&&e>=Ht[1]&&e<=Wn[1]&&t>=Ht[2]&&t<=Wn[2]}function Sf(n){const e=new Uint8Array($n);let t=0;for(let i=0;i<n.length;i+=3){const s=zo(n[i],n[i+1],n[i+2]);s<0?t++:e[s]=1}if(t){const i=t.toLocaleString("en");throw new qe(t===1?`1 cell of this seed lies outside the ${gn}³ box.`:`${i} cells of this seed lie outside the ${gn}³ box.`)}return e}function og(n){const e=[];for(let t=0;t<n.length;t++)n[t]&&e.push(...ir(t));return Int32Array.from(e)}class ag{constructor(e=null){this.places=e?Uint8Array.from(e):new Uint8Array($n),this.cursor=[0,0,0],this.kind="plane",this.axis=0,this.anchor=null,this.past=[],this.future=[]}get count(){let e=0;for(let t=0;t<$n;t++)e+=this.places[t];return e}isAlive(e,t,i){const s=zo(e,t,i);return s>=0&&this.places[s]===1}toCells(){return og(this.places)}setCursor(e){this.cursor=e.map((t,i)=>Math.min(Wn[i],Math.max(Ht[i],Math.round(t))))}moveCursor(e,t){const i=[...this.cursor];i[e]+=t,this.setCursor(i)}setKind(e){if(!xf.includes(e))throw new Error(`No selection kind ${e}`);this.kind=e,this.anchor=e==="box"?[...this.cursor]:null}setAxis(e){if(![0,1,2].includes(e))throw new Error(`No axis ${e}`);this.axis=e}setAnchor(e){this.kind="box",this.anchor=e.map((t,i)=>Math.min(Wn[i],Math.max(Ht[i],Math.round(t))))}selection(){const e=this.cursor,t=this.axis;switch(this.kind){case"line":return{min:e.map((i,s)=>s===t?Ht[s]:i),max:e.map((i,s)=>s===t?Wn[s]:i)};case"plane":return{min:e.map((i,s)=>s===t?i:Ht[s]),max:e.map((i,s)=>s===t?i:Wn[s])};case"box":{const i=this.anchor??e;return{min:e.map((s,r)=>Math.min(s,i[r])),max:e.map((s,r)=>Math.max(s,i[r]))}}case"all":return{min:[...Ht],max:[...Wn]};default:return{min:[...e],max:[...e]}}}focus(){if(this.kind==="box"||this.kind==="all")return this.selection();const e=this.cursor,t=this.axis;return{min:e.map((i,s)=>s===t?i:Ht[s]),max:e.map((i,s)=>s===t?i:Wn[s])}}isSelected(e,t,i){const{min:s,max:r}=this.selection();return e>=s[0]&&e<=r[0]&&t>=s[1]&&t<=r[1]&&i>=s[2]&&i<=r[2]}selectedPlaces(){const{min:e,max:t}=this.selection(),i=[];for(let s=e[2];s<=t[2];s++)for(let r=e[1];r<=t[1];r++)for(let o=e[0];o<=t[0];o++)i.push(zo(o,r,s));return i}selectionCount(){const e=this.selectedPlaces();let t=0;for(const i of e)t+=this.places[i];return{cells:e.length,alive:t}}switchSelection(){const e=this.selectedPlaces(),t=e.every(i=>this.places[i]===1);return this.change(i=>{for(const s of e)i[s]=t?0:1}),t?"cleared":"filled"}randomFill(e,t){if(!(e>=0&&e<=1))throw new qe("The density must be from 0 to 1.");const i=this.selectedPlaces();this.change(s=>{for(const r of i)s[r]=t()<e?1:0})}replace(e){this.change(t=>t.set(e))}change(e){const t=Uint8Array.from(this.places);return e(t),t.every((i,s)=>i===this.places[s])?!1:(this.past.push(this.places),this.past.length>ig&&this.past.shift(),this.future=[],this.places=t,!0)}get canUndo(){return this.past.length>0}get canRedo(){return this.future.length>0}undo(){return this.past.length?(this.future.push(this.places),this.places=this.past.pop(),!0):!1}redo(){return this.future.length?(this.past.push(this.places),this.places=this.future.pop(),!0):!1}}function gl(n){return n<0?`−${-n}`:`${n}`}function Ao(n){return n.map((e,t)=>`${pr[t]} ${gl(e)}`).join(", ")}function lg(n){const{cells:e,alive:t}=n.selectionCount(),i=l=>l.toLocaleString("en"),s=pr[n.axis],r=n.cursor,o=[0,1,2].filter(l=>l!==n.axis).map(l=>`${pr[l]} ${gl(r[l])}`).join(", "),a=`${i(e)} cells, ${i(t)} alive.`;switch(n.kind){case"cell":return`Cell at ${Ao(r)}: ${t?"alive":"empty"}.`;case"line":return`Line along ${s}, at ${o}: ${a}`;case"plane":return`Plane across ${s}, at ${s} ${gl(r[n.axis])}: ${a}`;case"box":{const{min:l,max:c}=n.selection();return`Box ${c.map((d,h)=>d-l[h]+1).join("×")}, from ${Ao(l)} to ${Ao(c)}: ${a}`}default:return`All ${i(e)} cells: ${i(t)} alive.`}}const Ku=[[0,1,2],[0,2,1],[1,0,2],[1,2,0],[2,0,1],[2,1,0]];function cg({right:n,up:e,forward:t}){const i=[n,e,t];let s=Ku[0],r=-1;for(const a of Ku){const l=Math.abs(i[0][a[0]])+Math.abs(i[1][a[1]])+Math.abs(i[2][a[2]]);l>r+1e-9&&(s=a,r=l)}const o=(a,l)=>({axis:l,sign:a[l]<0?-1:1});return{right:o(n,s[0]),up:o(e,s[1]),forward:o(t,s[2])}}function ug(n,e){const t=yf[n];if(!t)return null;const[i,s]=t,{axis:r,sign:o}=cg(e)[i];return{axis:r,delta:o*s}}const dg=1024,hg=64,kr={min:64,max:16384},zr={min:8,max:1024},Mf=Ls("classic-methuselah-1").departures.period,Zu=["end","ships","wrap","walls"],Gc=[{key:"corner",name:"Corner",neighbours:Sa.corner},{key:"edge",name:"Edge",neighbours:Sa.edge},{key:"face",name:"Face",neighbours:Sa.face}],fg=Object.freeze({corner:Object.freeze({birth:[2,3],survival:[2,3,4]}),edge:Object.freeze({birth:[4],survival:[2,3,4,5,6]}),face:Object.freeze({birth:[6],survival:[3,4,5,6,7,8,9]})}),pg=Object.freeze({birth:[9,10],survival:Array.from({length:11},(n,e)=>5+e)}),wf="preset:",bf=[{key:"cube",name:"Cube"},{key:"tetrahedron",name:"Tetrahedron"},{key:"octahedron",name:"Octahedron"},{key:"perlin",name:"Perlin noise",short:"Perlin",noise:!0},{key:"worley",name:"Worley noise",short:"Worley",noise:!0},...Sr.map(n=>({key:`${wf}${n.id}`,name:`${n.name}'s cells`,preset:n.id,...n.group&&{group:n.group}}))],mg={cube:({size:n,density:e})=>af(n,e),tetrahedron:({size:n,density:e})=>Rc(n,e),octahedron:({size:n,density:e})=>Cc(n,e),perlin:({size:n,density:e,regionSize:t})=>Ac(n,e,t||null),worley:({size:n,density:e,regionSize:t})=>Pc(n,e,t||null)};function ea(n){return bf.find(e=>e.key===n)}function gg(n){return{seed:Hc("cube",n),rules:pg,arena:null,arenaSize:hg,edge:"end",walls:fg,memoryMB:dg}}function Hc(n,e={},t=null){const i=ea(n);if(!i)throw new qe("Pick a shape for the seed.");if(i.preset)return{kind:"shape",key:n,cells:In(i.preset).cells};const s=c=>c===""||c===null||c===void 0?NaN:Number(c),r=s(e.size),o=s(e.density),a=i.noise&&Number(e.regionSize)||0;if(!Number.isInteger(r)||r<1||r>Fi)throw new qe(`In Game of Life 3D (unbounded), the seed's size must be a whole number from 1 to ${Fi}.`);if(!(o>=0&&o<=1))throw new qe("The seed's density must be from 0 to 1.");if(!Number.isInteger(a)||a<0||a>2*Fi)throw new qe(`In Game of Life 3D (unbounded), the region size must be a whole number up to ${2*Fi}.`);const l=i.noise?{size:r,density:o,regionSize:a}:{size:r,density:o};return t?.kind==="shape"&&t.key===n&&_g(t.params,l)?t:{kind:"shape",key:n,params:l,cells:tg(mg[n](l),r,a)}}function _g(n,e){if(!n)return!1;const t=Object.keys(e);return t.length===Object.keys(n).length&&t.every(i=>n[i]===e[i])}function vg(n){const e=In(n);if(!e)throw new qe("Pick a preset.");return{kind:"preset",id:n,cells:e.cells}}function xg(n,e){if(e.kind==="generation"){const{cells:t,seed:i,from:s,rules:r,arena:o}=e;return{kind:"saved",name:n,cells:t,seed:i,from:s,rules:r,arena:o}}if(!e.rules)throw new qe(`${n} is a seed file: it holds cells, but no rules, so it isn't a simulation. Load it from the Seed box, under File, to run it under the rules in the Rules box.`);return{kind:"file",name:n,cells:e.cells,rules:e.rules}}function yg(n,e){if(e.kind==="generation")throw new qe(`${n} is a saved generation: a simulation carried on from generation ${e.from.toLocaleString("en")}, not a seed. Load it from the Simulation box, with Load simulation….`);return{kind:"file",name:n,cells:e.cells}}function Sg(n){return{kind:"design",cells:n}}const Ef="A saved generation carries on under its own rules and arena, so it can't open as a design.";function Tf(n){const e=br(n);if(n.seed.kind==="saved")return{places:null,rules:e,reason:Ef};try{return{places:Sf(n.seed.cells),rules:e,reason:null}}catch(t){if(!(t instanceof qe))throw t;return{places:null,rules:e,reason:t.message}}}function Mg(n,e){if(e.kind==="generation")throw new qe(`${n} is a saved generation. ${Ef} Load simulation… in the Simulation box carries it on.`);try{return{places:Sf(e.cells),rules:e.rules}}catch(t){throw t instanceof qe?new qe(`${n} can't open here: ${t.message} Load seed… in the Seed box still runs it.`):t}}function wg(n,e,t){return Gi({...n,seed:Sg(e),rules:t})}function br(n){const{seed:e}=n;return e.kind==="preset"?In(e.id).rules:e.kind==="saved"?e.rules:n.rules}function mr(n){return n.seed.kind==="saved"?n.seed.arena:n.arena}function Gs(n){return n.seed.kind!=="saved"&&n.arena!==null?n.edge:"end"}function bg(n){return Gs(n)==="ships"}function _l(n){return Gs(n)==="wrap"}function Vc(n){return Gs(n)==="walls"?n.walls:null}function Yi(n){const{seed:e}=n;if(e.kind==="preset"){const{name:t}=In(e.id);return{by:"preset",name:t,text:`with ${t}`}}return e.kind==="saved"?{by:"saved",name:e.name,text:"with the saved generation"}:null}function Af(n){return n.seed.kind==="saved"?n.seed.from:0}function gr(n){return`Applying restarts the run from generation ${n.toLocaleString("en")}.`}function ta(n){const e=t=>t.toLocaleString("en");switch(n.kind){case"preset":return In(n.id).name;case"file":return n.label??n.name;case"saved":return`Gen ${e(n.from)}: ${n.name}`;case"design":return"Design";default:{const t=ea(n.key);if(t.preset)return In(t.preset).name;if(!n.params)return t.name;const{size:i,density:s}=n.params,r=s===1?"":`, ${Math.round(s*100)}%`;return`${t.short??t.name} ${i}${r}`}}}function $c(n){const{seed:e}=n;if(e.kind==="preset")return{name:In(e.id).name,from:"preset",id:e.id};if(e.kind==="saved")return{name:`Generation ${e.from.toLocaleString("en")} of ${e.name}`,from:"saved"};if(e.kind==="file"&&e.rules&&Rf(e.rules,n.rules))return{name:e.name,from:"file"};const t=Eg(e.cells,n.rules);return t?{name:t.name,from:"preset",id:t.id}:{name:"Custom",from:null}}function Eg(n,e){return Sr.find(t=>t.cells.length===n.length&&Rf(t.rules,e)&&Qu(t.cells)===Qu(n))}const Ju=new WeakMap;function Qu(n){let e=Ju.get(n);if(e===void 0){const t=[];for(let i=0;i<n.length;i+=3)t.push(`${n[i]},${n[i+1]},${n[i+2]}`);e=t.sort().join(";"),Ju.set(n,e)}return e}function Rf(n,e){const t=(i,s)=>i.length===s.length&&i.every((r,o)=>r===s[o]);return t(n.birth,e.birth)&&t(n.survival,e.survival)}function Tg(n){const e=Yi(n);return{seed:ta(n.seed),cells:n.seed.cells.length/3,rules:br(n),lock:e?.text??null,arena:mr(n),arenaLocked:e?.by==="saved",edge:Gs(n),walls:Vc(n),memoryMB:n.memoryMB}}function Ag(n){const e=Array.from({length:fr+1},(r,o)=>o);if(!n.length)return{isolation:e,overcrowding:[],gaps:[]};const t=n[0],i=n[n.length-1],s=new Set(n);return{isolation:e.filter(r=>r<t),overcrowding:e.filter(r=>r>i),gaps:e.filter(r=>r>t&&r<i&&!s.has(r))}}function Cf(n){const{seed:e,memoryMB:t}=n,i=br(n),s=mr(n),r=bg(n),o=_l(n),a=Vc(n),{cells:l}=e;if(!l.length){const d={saved:"This saved generation has no live cells, so there is nothing to carry on.",design:"The design has no live cells: switch some on first."};throw new qe(d[e.kind]??"The seed has no live cells: raise its density or its size.")}const c=wr(s);if(c)for(let d=0;d<l.length;d++){const h=d%3;if(l[d]<c.min[h]||l[d]>c.max[h])throw new qe(`The seed doesn't fit inside a ${s}³ arena: make the arena bigger or the seed smaller.`)}const u=ta(e);return e.kind==="saved"?{rules:i,cells:l,memoryMB:t,arena:s,ships:r,wrap:o,walls:a,label:u,seed:e.seed,from:e.from}:{rules:i,cells:l,memoryMB:t,arena:s,ships:r,wrap:o,walls:a,label:u}}function Rg(n){const e={rules:n.rules,limits:{memory:n.memoryMB*1048576}},t=wr(n.arena);return t&&(e.arena=t),t&&n.ships?e.departures={period:Mf}:t&&n.wrap?e.wrap=!0:t&&n.walls&&(e.walls=n.walls),e}function Gi(n){return Cf(n),n}function Go(n,e){return e.kind==="file"&&e.rules?Gi({...n,seed:e,rules:e.rules}):e.kind==="preset"||e.kind==="saved"?Gi({...n,seed:e}):Gi({...Wc(n),seed:e})}function Wc(n){const{seed:e}=n;if(e.kind==="preset")return{...n,seed:Hc(`${wf}${e.id}`),rules:br(n)};if(e.kind==="saved"){const t=`Gen ${e.from.toLocaleString("en")}: ${e.name}`;return{...n,seed:{kind:"file",name:e.name,cells:e.cells,label:t},rules:e.rules,arena:e.arena,arenaSize:e.arena??n.arenaSize}}return n}function Cg(n,e,t,{own:i=!1}={}){const s=Yi(n);if(s&&!i)throw new qe(Df(s,"rules"));const r=i?Wc(n):n;return Gi({...r,rules:ng(e,t)})}function Pf(n){const e={};for(const{key:t,name:i,neighbours:s}of Gc){const r=`${i.toLowerCase()} cells'`,o=Si(n[t]?.birth,`${r} birth`),a=Si(n[t]?.survival,`${r} survival`);try{e[t]=yi({birth:o,survival:a})}catch(c){throw c instanceof Hi?new Hi(`On the walls' ${i.toLowerCase()} cells: ${c.message}`):c}const l=[...o,...a].find(c=>c>s);if(l!==void 0){const c=t==="edge"?"An":"A";throw new qe(`${c} ${i.toLowerCase()} cell has ${s} neighbours inside the walls, so its counts go from 0 to ${s}; ${l} is past them.`)}}return e}function Lf(n,e,t,{own:i=!1,edge:s,walls:r}={}){const o=Yi(n);if(o?.by==="saved"&&!i)throw new qe(Df(o,"arena"));const a=i?Wc(n):n,l=Number(t),c=Number.isInteger(l)&&l>=zr.min&&l<=zr.max;if(e&&!c)throw new qe(`The arena size must be a whole number of cells, from ${zr.min} to ${zr.max}.`);if(s!==void 0&&!Zu.includes(s))throw new qe(`What happens at the edge must be one of ${Zu.join(", ")}.`);const u=r===void 0?a.walls:Pf(r);return Gi({...a,arena:e?l:null,arenaSize:c?l:a.arenaSize,edge:s??a.edge,walls:u})}function Pg(n,e,t,i=!1){const s=`a run here settles, or reaches the edge, where ${t}'s would, though Game of Life 3D (unbounded) doesn't stop at its budget.`,r=i?", with ships leaving at its edge":"",o=i?"ships":"end";if(mr(n)===e&&Gs(n)===o)return{setup:n,note:`The arena in Game of Life 3D (unbounded) is ${e}³${r}, as ${t}'s: ${s}`};try{const a=Lf(n,!0,e,{edge:o});let l;if(mr(n)!==e)l=`The arena in Game of Life 3D (unbounded) is now on, at ${e}³${r}, as ${t}'s: ${s} The Limits box turns it off.`;else if(_l(n)||Vc(n)){const c=_l(n)?"no longer wraps around":"no longer has walls";l=`The ${e}³ arena in Game of Life 3D (unbounded) ${c}${i?", and ships leave at its edge":""}, as in ${t}: ${s} The Limits box changes it.`}else l=`Ships ${i?"now leave":"no longer leave"} at the edge of the ${e}³ arena in Game of Life 3D (unbounded), as in ${t}: ${s} The Limits box changes it.`;return{setup:a,note:l}}catch(a){if(!(a instanceof qe))throw a;return{setup:n,note:`The arena in Game of Life 3D (unbounded) stays the saved generation's, so a run of it here may not end as ${t}'s would.`}}}function Lg(n,e){const t=Number(e);if(!Number.isInteger(t)||t<kr.min||t>kr.max)throw new qe(`The memory limit must be a whole number of MB, from ${kr.min} to ${kr.max}.`);return Gi({...n,memoryMB:t})}function Df(n,e){return`${n.by==="preset"?`${n.name} brings its own rules`:"The saved generation carries on under its own rules and arena"}: press Use your own rules to change the ${e}.`}function na(n,e){if(!n||n.length===0)return{isolation:[],overcrowding:[]};const t=Math.min(...n),i=Math.max(...n),s=[];for(let o=0;o<t;o++)s.push(o);const r=[];for(let o=i+1;o<=e;o++)r.push(o);return{isolation:s,overcrowding:r}}const If=Array.from({length:11},(n,e)=>e+5),ed=na(If,26),Uf=[2,3,4],td=na(Uf,7),Nf=[2,3,4,5,6],nd=na(Nf,11),Ff=[3,4,5,6,7,8,9],id=na(Ff,17),v={sim_size:50,sim_generations:100,viewMode:null,sliceAxis:null,sliceIndex:null,currentGen:0,isPlaying:!1,isReversing:!1,gridWrapping:!0,showWireframeGrid:!1,showCellWireframe:!1,showHUD:!0,cellSize:1.2,scene:null,renderer:null,camera:null,controls:null,autoRotateActive:!1,userHasInteracted:!1,autoRotateStartTime:null,autoRotateInitialPosition:null,autoRotateInitialRadius:null,autoRotateInitialAngle:null,simulationData:null,simulationModel:null,controlsInitialized:!1,shapeKey:"cube",lifeShapeKey:"cube",simulationMode:"explore",useRule30:!1,useRule30_2D:!1,useSineWave:!1,useSandpile:!1,flipOrientation:!1,gpuCompute:!0,explore:null,sandpileParams:{initialSand:0,threshold:4},modeValues:{gameOfLife:{size:50,generations:100},sineWave:{size:50,generations:100},rule30:{size:null,generations:100},sandpile:{size:50,generations:1e3},monteCarlo:{size:50,generations:100}},shapes:{perlin:Ac(10,.3,30),cube:Am(5,1),tetrahedron:Rc(13),octahedron:Cc(8,1),worley:Pc(8,.5,20),rule30:Rm()},rules:{birth:[9,10],survival:If,isolation:ed.isolation,overcrowding:ed.overcrowding},boundaryRules:{corner:{birth:[2,3],survival:Uf,isolation:td.isolation,overcrowding:td.overcrowding},edgeTwoFaces:{birth:[4],survival:Nf,isolation:nd.isolation,overcrowding:nd.overcrowding},face:{birth:[6],survival:Ff,isolation:id.isolation,overcrowding:id.overcrowding}},shapeParams:{perlin:{size:10,density:.3,regionSize:25},cube:{size:10,density:1},tetrahedron:{size:13,density:1},octahedron:{size:8,density:1},worley:{size:8,density:.3,regionSize:25}},get shapeFn(){return this.shapes[this.shapeKey]},reset(){this.viewMode=null,this.sliceAxis=null,this.sliceIndex=null,this.currentGen=0,this.isPlaying=!1,this.isReversing=!1,this.simulationData=null,this.simulationModel=null}};v.explore=gg(v.shapeParams.cube);/**
 * @license
 * Copyright 2010-2025 Three.js Authors
 * SPDX-License-Identifier: MIT
 */const Xc="178",bs={ROTATE:0,DOLLY:1,PAN:2},Ss={ROTATE:0,PAN:1,DOLLY_PAN:2,DOLLY_ROTATE:3},Dg=0,sd=1,Ig=2,Of=1,Ug=2,Vn=3,Mi=0,Zt=1,Xn=2,vi=0,Es=1,rd=2,od=3,ad=4,Ng=5,Ui=100,Fg=101,Og=102,Bg=103,kg=104,zg=200,Gg=201,Hg=202,Vg=203,vl=204,xl=205,$g=206,Wg=207,Xg=208,Yg=209,qg=210,jg=211,Kg=212,Zg=213,Jg=214,yl=0,Sl=1,Ml=2,Ds=3,wl=4,bl=5,El=6,Tl=7,Yc=0,Qg=1,e_=2,xi=0,t_=1,n_=2,i_=3,s_=4,r_=5,o_=6,a_=7,Bf=300,Is=301,Us=302,Al=303,Rl=304,ia=306,Cl=1e3,Oi=1001,Pl=1002,on=1003,l_=1004,Gr=1005,Cn=1006,Ma=1007,Bi=1008,Nn=1009,kf=1010,zf=1011,_r=1012,qc=1013,Vi=1014,Pn=1015,Er=1016,jc=1017,Kc=1018,vr=1020,Gf=35902,Hf=1021,Vf=1022,Tn=1023,xr=1026,yr=1027,Zc=1028,Jc=1029,$f=1030,Qc=1031,eu=1033,Ro=33776,Co=33777,Po=33778,Lo=33779,Ll=35840,Dl=35841,Il=35842,Ul=35843,Nl=36196,Fl=37492,Ol=37496,Bl=37808,kl=37809,zl=37810,Gl=37811,Hl=37812,Vl=37813,$l=37814,Wl=37815,Xl=37816,Yl=37817,ql=37818,jl=37819,Kl=37820,Zl=37821,Do=36492,Jl=36494,Ql=36495,Wf=36283,ec=36284,tc=36285,nc=36286,c_=3200,u_=3201,Xf=0,d_=1,ui="",mn="srgb",Ns="srgb-linear",Ho="linear",ct="srgb",ns=7680,ld=519,h_=512,f_=513,p_=514,Yf=515,m_=516,g_=517,__=518,v_=519,cd=35044,ud="300 es",jn=2e3,Vo=2001;class qi{addEventListener(e,t){this._listeners===void 0&&(this._listeners={});const i=this._listeners;i[e]===void 0&&(i[e]=[]),i[e].indexOf(t)===-1&&i[e].push(t)}hasEventListener(e,t){const i=this._listeners;return i===void 0?!1:i[e]!==void 0&&i[e].indexOf(t)!==-1}removeEventListener(e,t){const i=this._listeners;if(i===void 0)return;const s=i[e];if(s!==void 0){const r=s.indexOf(t);r!==-1&&s.splice(r,1)}}dispatchEvent(e){const t=this._listeners;if(t===void 0)return;const i=t[e.type];if(i!==void 0){e.target=this;const s=i.slice(0);for(let r=0,o=s.length;r<o;r++)s[r].call(this,e);e.target=null}}}const Ot=["00","01","02","03","04","05","06","07","08","09","0a","0b","0c","0d","0e","0f","10","11","12","13","14","15","16","17","18","19","1a","1b","1c","1d","1e","1f","20","21","22","23","24","25","26","27","28","29","2a","2b","2c","2d","2e","2f","30","31","32","33","34","35","36","37","38","39","3a","3b","3c","3d","3e","3f","40","41","42","43","44","45","46","47","48","49","4a","4b","4c","4d","4e","4f","50","51","52","53","54","55","56","57","58","59","5a","5b","5c","5d","5e","5f","60","61","62","63","64","65","66","67","68","69","6a","6b","6c","6d","6e","6f","70","71","72","73","74","75","76","77","78","79","7a","7b","7c","7d","7e","7f","80","81","82","83","84","85","86","87","88","89","8a","8b","8c","8d","8e","8f","90","91","92","93","94","95","96","97","98","99","9a","9b","9c","9d","9e","9f","a0","a1","a2","a3","a4","a5","a6","a7","a8","a9","aa","ab","ac","ad","ae","af","b0","b1","b2","b3","b4","b5","b6","b7","b8","b9","ba","bb","bc","bd","be","bf","c0","c1","c2","c3","c4","c5","c6","c7","c8","c9","ca","cb","cc","cd","ce","cf","d0","d1","d2","d3","d4","d5","d6","d7","d8","d9","da","db","dc","dd","de","df","e0","e1","e2","e3","e4","e5","e6","e7","e8","e9","ea","eb","ec","ed","ee","ef","f0","f1","f2","f3","f4","f5","f6","f7","f8","f9","fa","fb","fc","fd","fe","ff"],lr=Math.PI/180,ic=180/Math.PI;function Tr(){const n=Math.random()*4294967295|0,e=Math.random()*4294967295|0,t=Math.random()*4294967295|0,i=Math.random()*4294967295|0;return(Ot[n&255]+Ot[n>>8&255]+Ot[n>>16&255]+Ot[n>>24&255]+"-"+Ot[e&255]+Ot[e>>8&255]+"-"+Ot[e>>16&15|64]+Ot[e>>24&255]+"-"+Ot[t&63|128]+Ot[t>>8&255]+"-"+Ot[t>>16&255]+Ot[t>>24&255]+Ot[i&255]+Ot[i>>8&255]+Ot[i>>16&255]+Ot[i>>24&255]).toLowerCase()}function Je(n,e,t){return Math.max(e,Math.min(t,n))}function x_(n,e){return(n%e+e)%e}function wa(n,e,t){return(1-t)*n+t*e}function Ys(n,e){switch(e.constructor){case Float32Array:return n;case Uint32Array:return n/4294967295;case Uint16Array:return n/65535;case Uint8Array:return n/255;case Int32Array:return Math.max(n/2147483647,-1);case Int16Array:return Math.max(n/32767,-1);case Int8Array:return Math.max(n/127,-1);default:throw new Error("Invalid component type.")}}function qt(n,e){switch(e.constructor){case Float32Array:return n;case Uint32Array:return Math.round(n*4294967295);case Uint16Array:return Math.round(n*65535);case Uint8Array:return Math.round(n*255);case Int32Array:return Math.round(n*2147483647);case Int16Array:return Math.round(n*32767);case Int8Array:return Math.round(n*127);default:throw new Error("Invalid component type.")}}const y_={DEG2RAD:lr};class Ve{constructor(e=0,t=0){Ve.prototype.isVector2=!0,this.x=e,this.y=t}get width(){return this.x}set width(e){this.x=e}get height(){return this.y}set height(e){this.y=e}set(e,t){return this.x=e,this.y=t,this}setScalar(e){return this.x=e,this.y=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;default:throw new Error("index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;default:throw new Error("index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y)}copy(e){return this.x=e.x,this.y=e.y,this}add(e){return this.x+=e.x,this.y+=e.y,this}addScalar(e){return this.x+=e,this.y+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this}subScalar(e){return this.x-=e,this.y-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this}multiply(e){return this.x*=e.x,this.y*=e.y,this}multiplyScalar(e){return this.x*=e,this.y*=e,this}divide(e){return this.x/=e.x,this.y/=e.y,this}divideScalar(e){return this.multiplyScalar(1/e)}applyMatrix3(e){const t=this.x,i=this.y,s=e.elements;return this.x=s[0]*t+s[3]*i+s[6],this.y=s[1]*t+s[4]*i+s[7],this}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this}clamp(e,t){return this.x=Je(this.x,e.x,t.x),this.y=Je(this.y,e.y,t.y),this}clampScalar(e,t){return this.x=Je(this.x,e,t),this.y=Je(this.y,e,t),this}clampLength(e,t){const i=this.length();return this.divideScalar(i||1).multiplyScalar(Je(i,e,t))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this}negate(){return this.x=-this.x,this.y=-this.y,this}dot(e){return this.x*e.x+this.y*e.y}cross(e){return this.x*e.y-this.y*e.x}lengthSq(){return this.x*this.x+this.y*this.y}length(){return Math.sqrt(this.x*this.x+this.y*this.y)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)}normalize(){return this.divideScalar(this.length()||1)}angle(){return Math.atan2(-this.y,-this.x)+Math.PI}angleTo(e){const t=Math.sqrt(this.lengthSq()*e.lengthSq());if(t===0)return Math.PI/2;const i=this.dot(e)/t;return Math.acos(Je(i,-1,1))}distanceTo(e){return Math.sqrt(this.distanceToSquared(e))}distanceToSquared(e){const t=this.x-e.x,i=this.y-e.y;return t*t+i*i}manhattanDistanceTo(e){return Math.abs(this.x-e.x)+Math.abs(this.y-e.y)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this}lerpVectors(e,t,i){return this.x=e.x+(t.x-e.x)*i,this.y=e.y+(t.y-e.y)*i,this}equals(e){return e.x===this.x&&e.y===this.y}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this}rotateAround(e,t){const i=Math.cos(t),s=Math.sin(t),r=this.x-e.x,o=this.y-e.y;return this.x=r*i-o*s+e.x,this.y=r*s+o*i+e.y,this}random(){return this.x=Math.random(),this.y=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y}}class $i{constructor(e=0,t=0,i=0,s=1){this.isQuaternion=!0,this._x=e,this._y=t,this._z=i,this._w=s}static slerpFlat(e,t,i,s,r,o,a){let l=i[s+0],c=i[s+1],u=i[s+2],d=i[s+3];const h=r[o+0],p=r[o+1],g=r[o+2],_=r[o+3];if(a===0){e[t+0]=l,e[t+1]=c,e[t+2]=u,e[t+3]=d;return}if(a===1){e[t+0]=h,e[t+1]=p,e[t+2]=g,e[t+3]=_;return}if(d!==_||l!==h||c!==p||u!==g){let m=1-a;const f=l*h+c*p+u*g+d*_,M=f>=0?1:-1,b=1-f*f;if(b>Number.EPSILON){const L=Math.sqrt(b),T=Math.atan2(L,f*M);m=Math.sin(m*T)/L,a=Math.sin(a*T)/L}const E=a*M;if(l=l*m+h*E,c=c*m+p*E,u=u*m+g*E,d=d*m+_*E,m===1-a){const L=1/Math.sqrt(l*l+c*c+u*u+d*d);l*=L,c*=L,u*=L,d*=L}}e[t]=l,e[t+1]=c,e[t+2]=u,e[t+3]=d}static multiplyQuaternionsFlat(e,t,i,s,r,o){const a=i[s],l=i[s+1],c=i[s+2],u=i[s+3],d=r[o],h=r[o+1],p=r[o+2],g=r[o+3];return e[t]=a*g+u*d+l*p-c*h,e[t+1]=l*g+u*h+c*d-a*p,e[t+2]=c*g+u*p+a*h-l*d,e[t+3]=u*g-a*d-l*h-c*p,e}get x(){return this._x}set x(e){this._x=e,this._onChangeCallback()}get y(){return this._y}set y(e){this._y=e,this._onChangeCallback()}get z(){return this._z}set z(e){this._z=e,this._onChangeCallback()}get w(){return this._w}set w(e){this._w=e,this._onChangeCallback()}set(e,t,i,s){return this._x=e,this._y=t,this._z=i,this._w=s,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._w)}copy(e){return this._x=e.x,this._y=e.y,this._z=e.z,this._w=e.w,this._onChangeCallback(),this}setFromEuler(e,t=!0){const i=e._x,s=e._y,r=e._z,o=e._order,a=Math.cos,l=Math.sin,c=a(i/2),u=a(s/2),d=a(r/2),h=l(i/2),p=l(s/2),g=l(r/2);switch(o){case"XYZ":this._x=h*u*d+c*p*g,this._y=c*p*d-h*u*g,this._z=c*u*g+h*p*d,this._w=c*u*d-h*p*g;break;case"YXZ":this._x=h*u*d+c*p*g,this._y=c*p*d-h*u*g,this._z=c*u*g-h*p*d,this._w=c*u*d+h*p*g;break;case"ZXY":this._x=h*u*d-c*p*g,this._y=c*p*d+h*u*g,this._z=c*u*g+h*p*d,this._w=c*u*d-h*p*g;break;case"ZYX":this._x=h*u*d-c*p*g,this._y=c*p*d+h*u*g,this._z=c*u*g-h*p*d,this._w=c*u*d+h*p*g;break;case"YZX":this._x=h*u*d+c*p*g,this._y=c*p*d+h*u*g,this._z=c*u*g-h*p*d,this._w=c*u*d-h*p*g;break;case"XZY":this._x=h*u*d-c*p*g,this._y=c*p*d-h*u*g,this._z=c*u*g+h*p*d,this._w=c*u*d+h*p*g;break;default:console.warn("THREE.Quaternion: .setFromEuler() encountered an unknown order: "+o)}return t===!0&&this._onChangeCallback(),this}setFromAxisAngle(e,t){const i=t/2,s=Math.sin(i);return this._x=e.x*s,this._y=e.y*s,this._z=e.z*s,this._w=Math.cos(i),this._onChangeCallback(),this}setFromRotationMatrix(e){const t=e.elements,i=t[0],s=t[4],r=t[8],o=t[1],a=t[5],l=t[9],c=t[2],u=t[6],d=t[10],h=i+a+d;if(h>0){const p=.5/Math.sqrt(h+1);this._w=.25/p,this._x=(u-l)*p,this._y=(r-c)*p,this._z=(o-s)*p}else if(i>a&&i>d){const p=2*Math.sqrt(1+i-a-d);this._w=(u-l)/p,this._x=.25*p,this._y=(s+o)/p,this._z=(r+c)/p}else if(a>d){const p=2*Math.sqrt(1+a-i-d);this._w=(r-c)/p,this._x=(s+o)/p,this._y=.25*p,this._z=(l+u)/p}else{const p=2*Math.sqrt(1+d-i-a);this._w=(o-s)/p,this._x=(r+c)/p,this._y=(l+u)/p,this._z=.25*p}return this._onChangeCallback(),this}setFromUnitVectors(e,t){let i=e.dot(t)+1;return i<1e-8?(i=0,Math.abs(e.x)>Math.abs(e.z)?(this._x=-e.y,this._y=e.x,this._z=0,this._w=i):(this._x=0,this._y=-e.z,this._z=e.y,this._w=i)):(this._x=e.y*t.z-e.z*t.y,this._y=e.z*t.x-e.x*t.z,this._z=e.x*t.y-e.y*t.x,this._w=i),this.normalize()}angleTo(e){return 2*Math.acos(Math.abs(Je(this.dot(e),-1,1)))}rotateTowards(e,t){const i=this.angleTo(e);if(i===0)return this;const s=Math.min(1,t/i);return this.slerp(e,s),this}identity(){return this.set(0,0,0,1)}invert(){return this.conjugate()}conjugate(){return this._x*=-1,this._y*=-1,this._z*=-1,this._onChangeCallback(),this}dot(e){return this._x*e._x+this._y*e._y+this._z*e._z+this._w*e._w}lengthSq(){return this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w}length(){return Math.sqrt(this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w)}normalize(){let e=this.length();return e===0?(this._x=0,this._y=0,this._z=0,this._w=1):(e=1/e,this._x=this._x*e,this._y=this._y*e,this._z=this._z*e,this._w=this._w*e),this._onChangeCallback(),this}multiply(e){return this.multiplyQuaternions(this,e)}premultiply(e){return this.multiplyQuaternions(e,this)}multiplyQuaternions(e,t){const i=e._x,s=e._y,r=e._z,o=e._w,a=t._x,l=t._y,c=t._z,u=t._w;return this._x=i*u+o*a+s*c-r*l,this._y=s*u+o*l+r*a-i*c,this._z=r*u+o*c+i*l-s*a,this._w=o*u-i*a-s*l-r*c,this._onChangeCallback(),this}slerp(e,t){if(t===0)return this;if(t===1)return this.copy(e);const i=this._x,s=this._y,r=this._z,o=this._w;let a=o*e._w+i*e._x+s*e._y+r*e._z;if(a<0?(this._w=-e._w,this._x=-e._x,this._y=-e._y,this._z=-e._z,a=-a):this.copy(e),a>=1)return this._w=o,this._x=i,this._y=s,this._z=r,this;const l=1-a*a;if(l<=Number.EPSILON){const p=1-t;return this._w=p*o+t*this._w,this._x=p*i+t*this._x,this._y=p*s+t*this._y,this._z=p*r+t*this._z,this.normalize(),this}const c=Math.sqrt(l),u=Math.atan2(c,a),d=Math.sin((1-t)*u)/c,h=Math.sin(t*u)/c;return this._w=o*d+this._w*h,this._x=i*d+this._x*h,this._y=s*d+this._y*h,this._z=r*d+this._z*h,this._onChangeCallback(),this}slerpQuaternions(e,t,i){return this.copy(e).slerp(t,i)}random(){const e=2*Math.PI*Math.random(),t=2*Math.PI*Math.random(),i=Math.random(),s=Math.sqrt(1-i),r=Math.sqrt(i);return this.set(s*Math.sin(e),s*Math.cos(e),r*Math.sin(t),r*Math.cos(t))}equals(e){return e._x===this._x&&e._y===this._y&&e._z===this._z&&e._w===this._w}fromArray(e,t=0){return this._x=e[t],this._y=e[t+1],this._z=e[t+2],this._w=e[t+3],this._onChangeCallback(),this}toArray(e=[],t=0){return e[t]=this._x,e[t+1]=this._y,e[t+2]=this._z,e[t+3]=this._w,e}fromBufferAttribute(e,t){return this._x=e.getX(t),this._y=e.getY(t),this._z=e.getZ(t),this._w=e.getW(t),this._onChangeCallback(),this}toJSON(){return this.toArray()}_onChange(e){return this._onChangeCallback=e,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._w}}class F{constructor(e=0,t=0,i=0){F.prototype.isVector3=!0,this.x=e,this.y=t,this.z=i}set(e,t,i){return i===void 0&&(i=this.z),this.x=e,this.y=t,this.z=i,this}setScalar(e){return this.x=e,this.y=e,this.z=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setZ(e){return this.z=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;case 2:this.z=t;break;default:throw new Error("index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;case 2:return this.z;default:throw new Error("index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y,this.z)}copy(e){return this.x=e.x,this.y=e.y,this.z=e.z,this}add(e){return this.x+=e.x,this.y+=e.y,this.z+=e.z,this}addScalar(e){return this.x+=e,this.y+=e,this.z+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this.z=e.z+t.z,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this.z+=e.z*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this.z-=e.z,this}subScalar(e){return this.x-=e,this.y-=e,this.z-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this.z=e.z-t.z,this}multiply(e){return this.x*=e.x,this.y*=e.y,this.z*=e.z,this}multiplyScalar(e){return this.x*=e,this.y*=e,this.z*=e,this}multiplyVectors(e,t){return this.x=e.x*t.x,this.y=e.y*t.y,this.z=e.z*t.z,this}applyEuler(e){return this.applyQuaternion(dd.setFromEuler(e))}applyAxisAngle(e,t){return this.applyQuaternion(dd.setFromAxisAngle(e,t))}applyMatrix3(e){const t=this.x,i=this.y,s=this.z,r=e.elements;return this.x=r[0]*t+r[3]*i+r[6]*s,this.y=r[1]*t+r[4]*i+r[7]*s,this.z=r[2]*t+r[5]*i+r[8]*s,this}applyNormalMatrix(e){return this.applyMatrix3(e).normalize()}applyMatrix4(e){const t=this.x,i=this.y,s=this.z,r=e.elements,o=1/(r[3]*t+r[7]*i+r[11]*s+r[15]);return this.x=(r[0]*t+r[4]*i+r[8]*s+r[12])*o,this.y=(r[1]*t+r[5]*i+r[9]*s+r[13])*o,this.z=(r[2]*t+r[6]*i+r[10]*s+r[14])*o,this}applyQuaternion(e){const t=this.x,i=this.y,s=this.z,r=e.x,o=e.y,a=e.z,l=e.w,c=2*(o*s-a*i),u=2*(a*t-r*s),d=2*(r*i-o*t);return this.x=t+l*c+o*d-a*u,this.y=i+l*u+a*c-r*d,this.z=s+l*d+r*u-o*c,this}project(e){return this.applyMatrix4(e.matrixWorldInverse).applyMatrix4(e.projectionMatrix)}unproject(e){return this.applyMatrix4(e.projectionMatrixInverse).applyMatrix4(e.matrixWorld)}transformDirection(e){const t=this.x,i=this.y,s=this.z,r=e.elements;return this.x=r[0]*t+r[4]*i+r[8]*s,this.y=r[1]*t+r[5]*i+r[9]*s,this.z=r[2]*t+r[6]*i+r[10]*s,this.normalize()}divide(e){return this.x/=e.x,this.y/=e.y,this.z/=e.z,this}divideScalar(e){return this.multiplyScalar(1/e)}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this.z=Math.min(this.z,e.z),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this.z=Math.max(this.z,e.z),this}clamp(e,t){return this.x=Je(this.x,e.x,t.x),this.y=Je(this.y,e.y,t.y),this.z=Je(this.z,e.z,t.z),this}clampScalar(e,t){return this.x=Je(this.x,e,t),this.y=Je(this.y,e,t),this.z=Je(this.z,e,t),this}clampLength(e,t){const i=this.length();return this.divideScalar(i||1).multiplyScalar(Je(i,e,t))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this}dot(e){return this.x*e.x+this.y*e.y+this.z*e.z}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)}normalize(){return this.divideScalar(this.length()||1)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this.z+=(e.z-this.z)*t,this}lerpVectors(e,t,i){return this.x=e.x+(t.x-e.x)*i,this.y=e.y+(t.y-e.y)*i,this.z=e.z+(t.z-e.z)*i,this}cross(e){return this.crossVectors(this,e)}crossVectors(e,t){const i=e.x,s=e.y,r=e.z,o=t.x,a=t.y,l=t.z;return this.x=s*l-r*a,this.y=r*o-i*l,this.z=i*a-s*o,this}projectOnVector(e){const t=e.lengthSq();if(t===0)return this.set(0,0,0);const i=e.dot(this)/t;return this.copy(e).multiplyScalar(i)}projectOnPlane(e){return ba.copy(this).projectOnVector(e),this.sub(ba)}reflect(e){return this.sub(ba.copy(e).multiplyScalar(2*this.dot(e)))}angleTo(e){const t=Math.sqrt(this.lengthSq()*e.lengthSq());if(t===0)return Math.PI/2;const i=this.dot(e)/t;return Math.acos(Je(i,-1,1))}distanceTo(e){return Math.sqrt(this.distanceToSquared(e))}distanceToSquared(e){const t=this.x-e.x,i=this.y-e.y,s=this.z-e.z;return t*t+i*i+s*s}manhattanDistanceTo(e){return Math.abs(this.x-e.x)+Math.abs(this.y-e.y)+Math.abs(this.z-e.z)}setFromSpherical(e){return this.setFromSphericalCoords(e.radius,e.phi,e.theta)}setFromSphericalCoords(e,t,i){const s=Math.sin(t)*e;return this.x=s*Math.sin(i),this.y=Math.cos(t)*e,this.z=s*Math.cos(i),this}setFromCylindrical(e){return this.setFromCylindricalCoords(e.radius,e.theta,e.y)}setFromCylindricalCoords(e,t,i){return this.x=e*Math.sin(t),this.y=i,this.z=e*Math.cos(t),this}setFromMatrixPosition(e){const t=e.elements;return this.x=t[12],this.y=t[13],this.z=t[14],this}setFromMatrixScale(e){const t=this.setFromMatrixColumn(e,0).length(),i=this.setFromMatrixColumn(e,1).length(),s=this.setFromMatrixColumn(e,2).length();return this.x=t,this.y=i,this.z=s,this}setFromMatrixColumn(e,t){return this.fromArray(e.elements,t*4)}setFromMatrix3Column(e,t){return this.fromArray(e.elements,t*3)}setFromEuler(e){return this.x=e._x,this.y=e._y,this.z=e._z,this}setFromColor(e){return this.x=e.r,this.y=e.g,this.z=e.b,this}equals(e){return e.x===this.x&&e.y===this.y&&e.z===this.z}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this.z=e[t+2],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e[t+2]=this.z,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this.z=e.getZ(t),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this}randomDirection(){const e=Math.random()*Math.PI*2,t=Math.random()*2-1,i=Math.sqrt(1-t*t);return this.x=i*Math.cos(e),this.y=t,this.z=i*Math.sin(e),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z}}const ba=new F,dd=new $i;class Ye{constructor(e,t,i,s,r,o,a,l,c){Ye.prototype.isMatrix3=!0,this.elements=[1,0,0,0,1,0,0,0,1],e!==void 0&&this.set(e,t,i,s,r,o,a,l,c)}set(e,t,i,s,r,o,a,l,c){const u=this.elements;return u[0]=e,u[1]=s,u[2]=a,u[3]=t,u[4]=r,u[5]=l,u[6]=i,u[7]=o,u[8]=c,this}identity(){return this.set(1,0,0,0,1,0,0,0,1),this}copy(e){const t=this.elements,i=e.elements;return t[0]=i[0],t[1]=i[1],t[2]=i[2],t[3]=i[3],t[4]=i[4],t[5]=i[5],t[6]=i[6],t[7]=i[7],t[8]=i[8],this}extractBasis(e,t,i){return e.setFromMatrix3Column(this,0),t.setFromMatrix3Column(this,1),i.setFromMatrix3Column(this,2),this}setFromMatrix4(e){const t=e.elements;return this.set(t[0],t[4],t[8],t[1],t[5],t[9],t[2],t[6],t[10]),this}multiply(e){return this.multiplyMatrices(this,e)}premultiply(e){return this.multiplyMatrices(e,this)}multiplyMatrices(e,t){const i=e.elements,s=t.elements,r=this.elements,o=i[0],a=i[3],l=i[6],c=i[1],u=i[4],d=i[7],h=i[2],p=i[5],g=i[8],_=s[0],m=s[3],f=s[6],M=s[1],b=s[4],E=s[7],L=s[2],T=s[5],A=s[8];return r[0]=o*_+a*M+l*L,r[3]=o*m+a*b+l*T,r[6]=o*f+a*E+l*A,r[1]=c*_+u*M+d*L,r[4]=c*m+u*b+d*T,r[7]=c*f+u*E+d*A,r[2]=h*_+p*M+g*L,r[5]=h*m+p*b+g*T,r[8]=h*f+p*E+g*A,this}multiplyScalar(e){const t=this.elements;return t[0]*=e,t[3]*=e,t[6]*=e,t[1]*=e,t[4]*=e,t[7]*=e,t[2]*=e,t[5]*=e,t[8]*=e,this}determinant(){const e=this.elements,t=e[0],i=e[1],s=e[2],r=e[3],o=e[4],a=e[5],l=e[6],c=e[7],u=e[8];return t*o*u-t*a*c-i*r*u+i*a*l+s*r*c-s*o*l}invert(){const e=this.elements,t=e[0],i=e[1],s=e[2],r=e[3],o=e[4],a=e[5],l=e[6],c=e[7],u=e[8],d=u*o-a*c,h=a*l-u*r,p=c*r-o*l,g=t*d+i*h+s*p;if(g===0)return this.set(0,0,0,0,0,0,0,0,0);const _=1/g;return e[0]=d*_,e[1]=(s*c-u*i)*_,e[2]=(a*i-s*o)*_,e[3]=h*_,e[4]=(u*t-s*l)*_,e[5]=(s*r-a*t)*_,e[6]=p*_,e[7]=(i*l-c*t)*_,e[8]=(o*t-i*r)*_,this}transpose(){let e;const t=this.elements;return e=t[1],t[1]=t[3],t[3]=e,e=t[2],t[2]=t[6],t[6]=e,e=t[5],t[5]=t[7],t[7]=e,this}getNormalMatrix(e){return this.setFromMatrix4(e).invert().transpose()}transposeIntoArray(e){const t=this.elements;return e[0]=t[0],e[1]=t[3],e[2]=t[6],e[3]=t[1],e[4]=t[4],e[5]=t[7],e[6]=t[2],e[7]=t[5],e[8]=t[8],this}setUvTransform(e,t,i,s,r,o,a){const l=Math.cos(r),c=Math.sin(r);return this.set(i*l,i*c,-i*(l*o+c*a)+o+e,-s*c,s*l,-s*(-c*o+l*a)+a+t,0,0,1),this}scale(e,t){return this.premultiply(Ea.makeScale(e,t)),this}rotate(e){return this.premultiply(Ea.makeRotation(-e)),this}translate(e,t){return this.premultiply(Ea.makeTranslation(e,t)),this}makeTranslation(e,t){return e.isVector2?this.set(1,0,e.x,0,1,e.y,0,0,1):this.set(1,0,e,0,1,t,0,0,1),this}makeRotation(e){const t=Math.cos(e),i=Math.sin(e);return this.set(t,-i,0,i,t,0,0,0,1),this}makeScale(e,t){return this.set(e,0,0,0,t,0,0,0,1),this}equals(e){const t=this.elements,i=e.elements;for(let s=0;s<9;s++)if(t[s]!==i[s])return!1;return!0}fromArray(e,t=0){for(let i=0;i<9;i++)this.elements[i]=e[i+t];return this}toArray(e=[],t=0){const i=this.elements;return e[t]=i[0],e[t+1]=i[1],e[t+2]=i[2],e[t+3]=i[3],e[t+4]=i[4],e[t+5]=i[5],e[t+6]=i[6],e[t+7]=i[7],e[t+8]=i[8],e}clone(){return new this.constructor().fromArray(this.elements)}}const Ea=new Ye;function qf(n){for(let e=n.length-1;e>=0;--e)if(n[e]>=65535)return!0;return!1}function $o(n){return document.createElementNS("http://www.w3.org/1999/xhtml",n)}function S_(){const n=$o("canvas");return n.style.display="block",n}const hd={};function Ts(n){n in hd||(hd[n]=!0,console.warn(n))}function M_(n,e,t){return new Promise(function(i,s){function r(){switch(n.clientWaitSync(e,n.SYNC_FLUSH_COMMANDS_BIT,0)){case n.WAIT_FAILED:s();break;case n.TIMEOUT_EXPIRED:setTimeout(r,t);break;default:i()}}setTimeout(r,t)})}function w_(n){const e=n.elements;e[2]=.5*e[2]+.5*e[3],e[6]=.5*e[6]+.5*e[7],e[10]=.5*e[10]+.5*e[11],e[14]=.5*e[14]+.5*e[15]}function b_(n){const e=n.elements;e[11]===-1?(e[10]=-e[10]-1,e[14]=-e[14]):(e[10]=-e[10],e[14]=-e[14]+1)}const fd=new Ye().set(.4123908,.3575843,.1804808,.212639,.7151687,.0721923,.0193308,.1191948,.9505322),pd=new Ye().set(3.2409699,-1.5373832,-.4986108,-.9692436,1.8759675,.0415551,.0556301,-.203977,1.0569715);function E_(){const n={enabled:!0,workingColorSpace:Ns,spaces:{},convert:function(s,r,o){return this.enabled===!1||r===o||!r||!o||(this.spaces[r].transfer===ct&&(s.r=Kn(s.r),s.g=Kn(s.g),s.b=Kn(s.b)),this.spaces[r].primaries!==this.spaces[o].primaries&&(s.applyMatrix3(this.spaces[r].toXYZ),s.applyMatrix3(this.spaces[o].fromXYZ)),this.spaces[o].transfer===ct&&(s.r=As(s.r),s.g=As(s.g),s.b=As(s.b))),s},workingToColorSpace:function(s,r){return this.convert(s,this.workingColorSpace,r)},colorSpaceToWorking:function(s,r){return this.convert(s,r,this.workingColorSpace)},getPrimaries:function(s){return this.spaces[s].primaries},getTransfer:function(s){return s===ui?Ho:this.spaces[s].transfer},getLuminanceCoefficients:function(s,r=this.workingColorSpace){return s.fromArray(this.spaces[r].luminanceCoefficients)},define:function(s){Object.assign(this.spaces,s)},_getMatrix:function(s,r,o){return s.copy(this.spaces[r].toXYZ).multiply(this.spaces[o].fromXYZ)},_getDrawingBufferColorSpace:function(s){return this.spaces[s].outputColorSpaceConfig.drawingBufferColorSpace},_getUnpackColorSpace:function(s=this.workingColorSpace){return this.spaces[s].workingColorSpaceConfig.unpackColorSpace},fromWorkingColorSpace:function(s,r){return Ts("THREE.ColorManagement: .fromWorkingColorSpace() has been renamed to .workingToColorSpace()."),n.workingToColorSpace(s,r)},toWorkingColorSpace:function(s,r){return Ts("THREE.ColorManagement: .toWorkingColorSpace() has been renamed to .colorSpaceToWorking()."),n.colorSpaceToWorking(s,r)}},e=[.64,.33,.3,.6,.15,.06],t=[.2126,.7152,.0722],i=[.3127,.329];return n.define({[Ns]:{primaries:e,whitePoint:i,transfer:Ho,toXYZ:fd,fromXYZ:pd,luminanceCoefficients:t,workingColorSpaceConfig:{unpackColorSpace:mn},outputColorSpaceConfig:{drawingBufferColorSpace:mn}},[mn]:{primaries:e,whitePoint:i,transfer:ct,toXYZ:fd,fromXYZ:pd,luminanceCoefficients:t,outputColorSpaceConfig:{drawingBufferColorSpace:mn}}}),n}const it=E_();function Kn(n){return n<.04045?n*.0773993808:Math.pow(n*.9478672986+.0521327014,2.4)}function As(n){return n<.0031308?n*12.92:1.055*Math.pow(n,.41666)-.055}let is;class T_{static getDataURL(e,t="image/png"){if(/^data:/i.test(e.src)||typeof HTMLCanvasElement>"u")return e.src;let i;if(e instanceof HTMLCanvasElement)i=e;else{is===void 0&&(is=$o("canvas")),is.width=e.width,is.height=e.height;const s=is.getContext("2d");e instanceof ImageData?s.putImageData(e,0,0):s.drawImage(e,0,0,e.width,e.height),i=is}return i.toDataURL(t)}static sRGBToLinear(e){if(typeof HTMLImageElement<"u"&&e instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&e instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&e instanceof ImageBitmap){const t=$o("canvas");t.width=e.width,t.height=e.height;const i=t.getContext("2d");i.drawImage(e,0,0,e.width,e.height);const s=i.getImageData(0,0,e.width,e.height),r=s.data;for(let o=0;o<r.length;o++)r[o]=Kn(r[o]/255)*255;return i.putImageData(s,0,0),t}else if(e.data){const t=e.data.slice(0);for(let i=0;i<t.length;i++)t instanceof Uint8Array||t instanceof Uint8ClampedArray?t[i]=Math.floor(Kn(t[i]/255)*255):t[i]=Kn(t[i]);return{data:t,width:e.width,height:e.height}}else return console.warn("THREE.ImageUtils.sRGBToLinear(): Unsupported image type. No color space conversion applied."),e}}let A_=0;class tu{constructor(e=null){this.isSource=!0,Object.defineProperty(this,"id",{value:A_++}),this.uuid=Tr(),this.data=e,this.dataReady=!0,this.version=0}getSize(e){const t=this.data;return t instanceof HTMLVideoElement?e.set(t.videoWidth,t.videoHeight):t!==null?e.set(t.width,t.height,t.depth||0):e.set(0,0,0),e}set needsUpdate(e){e===!0&&this.version++}toJSON(e){const t=e===void 0||typeof e=="string";if(!t&&e.images[this.uuid]!==void 0)return e.images[this.uuid];const i={uuid:this.uuid,url:""},s=this.data;if(s!==null){let r;if(Array.isArray(s)){r=[];for(let o=0,a=s.length;o<a;o++)s[o].isDataTexture?r.push(Ta(s[o].image)):r.push(Ta(s[o]))}else r=Ta(s);i.url=r}return t||(e.images[this.uuid]=i),i}}function Ta(n){return typeof HTMLImageElement<"u"&&n instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&n instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&n instanceof ImageBitmap?T_.getDataURL(n):n.data?{data:Array.from(n.data),width:n.width,height:n.height,type:n.data.constructor.name}:(console.warn("THREE.Texture: Unable to serialize Texture."),{})}let R_=0;const Aa=new F;class $t extends qi{constructor(e=$t.DEFAULT_IMAGE,t=$t.DEFAULT_MAPPING,i=Oi,s=Oi,r=Cn,o=Bi,a=Tn,l=Nn,c=$t.DEFAULT_ANISOTROPY,u=ui){super(),this.isTexture=!0,Object.defineProperty(this,"id",{value:R_++}),this.uuid=Tr(),this.name="",this.source=new tu(e),this.mipmaps=[],this.mapping=t,this.channel=0,this.wrapS=i,this.wrapT=s,this.magFilter=r,this.minFilter=o,this.anisotropy=c,this.format=a,this.internalFormat=null,this.type=l,this.offset=new Ve(0,0),this.repeat=new Ve(1,1),this.center=new Ve(0,0),this.rotation=0,this.matrixAutoUpdate=!0,this.matrix=new Ye,this.generateMipmaps=!0,this.premultiplyAlpha=!1,this.flipY=!0,this.unpackAlignment=4,this.colorSpace=u,this.userData={},this.updateRanges=[],this.version=0,this.onUpdate=null,this.renderTarget=null,this.isRenderTargetTexture=!1,this.isArrayTexture=!!(e&&e.depth&&e.depth>1),this.pmremVersion=0}get width(){return this.source.getSize(Aa).x}get height(){return this.source.getSize(Aa).y}get depth(){return this.source.getSize(Aa).z}get image(){return this.source.data}set image(e=null){this.source.data=e}updateMatrix(){this.matrix.setUvTransform(this.offset.x,this.offset.y,this.repeat.x,this.repeat.y,this.rotation,this.center.x,this.center.y)}addUpdateRange(e,t){this.updateRanges.push({start:e,count:t})}clearUpdateRanges(){this.updateRanges.length=0}clone(){return new this.constructor().copy(this)}copy(e){return this.name=e.name,this.source=e.source,this.mipmaps=e.mipmaps.slice(0),this.mapping=e.mapping,this.channel=e.channel,this.wrapS=e.wrapS,this.wrapT=e.wrapT,this.magFilter=e.magFilter,this.minFilter=e.minFilter,this.anisotropy=e.anisotropy,this.format=e.format,this.internalFormat=e.internalFormat,this.type=e.type,this.offset.copy(e.offset),this.repeat.copy(e.repeat),this.center.copy(e.center),this.rotation=e.rotation,this.matrixAutoUpdate=e.matrixAutoUpdate,this.matrix.copy(e.matrix),this.generateMipmaps=e.generateMipmaps,this.premultiplyAlpha=e.premultiplyAlpha,this.flipY=e.flipY,this.unpackAlignment=e.unpackAlignment,this.colorSpace=e.colorSpace,this.renderTarget=e.renderTarget,this.isRenderTargetTexture=e.isRenderTargetTexture,this.isArrayTexture=e.isArrayTexture,this.userData=JSON.parse(JSON.stringify(e.userData)),this.needsUpdate=!0,this}setValues(e){for(const t in e){const i=e[t];if(i===void 0){console.warn(`THREE.Texture.setValues(): parameter '${t}' has value of undefined.`);continue}const s=this[t];if(s===void 0){console.warn(`THREE.Texture.setValues(): property '${t}' does not exist.`);continue}s&&i&&s.isVector2&&i.isVector2||s&&i&&s.isVector3&&i.isVector3||s&&i&&s.isMatrix3&&i.isMatrix3?s.copy(i):this[t]=i}}toJSON(e){const t=e===void 0||typeof e=="string";if(!t&&e.textures[this.uuid]!==void 0)return e.textures[this.uuid];const i={metadata:{version:4.7,type:"Texture",generator:"Texture.toJSON"},uuid:this.uuid,name:this.name,image:this.source.toJSON(e).uuid,mapping:this.mapping,channel:this.channel,repeat:[this.repeat.x,this.repeat.y],offset:[this.offset.x,this.offset.y],center:[this.center.x,this.center.y],rotation:this.rotation,wrap:[this.wrapS,this.wrapT],format:this.format,internalFormat:this.internalFormat,type:this.type,colorSpace:this.colorSpace,minFilter:this.minFilter,magFilter:this.magFilter,anisotropy:this.anisotropy,flipY:this.flipY,generateMipmaps:this.generateMipmaps,premultiplyAlpha:this.premultiplyAlpha,unpackAlignment:this.unpackAlignment};return Object.keys(this.userData).length>0&&(i.userData=this.userData),t||(e.textures[this.uuid]=i),i}dispose(){this.dispatchEvent({type:"dispose"})}transformUv(e){if(this.mapping!==Bf)return e;if(e.applyMatrix3(this.matrix),e.x<0||e.x>1)switch(this.wrapS){case Cl:e.x=e.x-Math.floor(e.x);break;case Oi:e.x=e.x<0?0:1;break;case Pl:Math.abs(Math.floor(e.x)%2)===1?e.x=Math.ceil(e.x)-e.x:e.x=e.x-Math.floor(e.x);break}if(e.y<0||e.y>1)switch(this.wrapT){case Cl:e.y=e.y-Math.floor(e.y);break;case Oi:e.y=e.y<0?0:1;break;case Pl:Math.abs(Math.floor(e.y)%2)===1?e.y=Math.ceil(e.y)-e.y:e.y=e.y-Math.floor(e.y);break}return this.flipY&&(e.y=1-e.y),e}set needsUpdate(e){e===!0&&(this.version++,this.source.needsUpdate=!0)}set needsPMREMUpdate(e){e===!0&&this.pmremVersion++}}$t.DEFAULT_IMAGE=null;$t.DEFAULT_MAPPING=Bf;$t.DEFAULT_ANISOTROPY=1;class yt{constructor(e=0,t=0,i=0,s=1){yt.prototype.isVector4=!0,this.x=e,this.y=t,this.z=i,this.w=s}get width(){return this.z}set width(e){this.z=e}get height(){return this.w}set height(e){this.w=e}set(e,t,i,s){return this.x=e,this.y=t,this.z=i,this.w=s,this}setScalar(e){return this.x=e,this.y=e,this.z=e,this.w=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setZ(e){return this.z=e,this}setW(e){return this.w=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;case 2:this.z=t;break;case 3:this.w=t;break;default:throw new Error("index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;case 2:return this.z;case 3:return this.w;default:throw new Error("index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y,this.z,this.w)}copy(e){return this.x=e.x,this.y=e.y,this.z=e.z,this.w=e.w!==void 0?e.w:1,this}add(e){return this.x+=e.x,this.y+=e.y,this.z+=e.z,this.w+=e.w,this}addScalar(e){return this.x+=e,this.y+=e,this.z+=e,this.w+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this.z=e.z+t.z,this.w=e.w+t.w,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this.z+=e.z*t,this.w+=e.w*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this.z-=e.z,this.w-=e.w,this}subScalar(e){return this.x-=e,this.y-=e,this.z-=e,this.w-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this.z=e.z-t.z,this.w=e.w-t.w,this}multiply(e){return this.x*=e.x,this.y*=e.y,this.z*=e.z,this.w*=e.w,this}multiplyScalar(e){return this.x*=e,this.y*=e,this.z*=e,this.w*=e,this}applyMatrix4(e){const t=this.x,i=this.y,s=this.z,r=this.w,o=e.elements;return this.x=o[0]*t+o[4]*i+o[8]*s+o[12]*r,this.y=o[1]*t+o[5]*i+o[9]*s+o[13]*r,this.z=o[2]*t+o[6]*i+o[10]*s+o[14]*r,this.w=o[3]*t+o[7]*i+o[11]*s+o[15]*r,this}divide(e){return this.x/=e.x,this.y/=e.y,this.z/=e.z,this.w/=e.w,this}divideScalar(e){return this.multiplyScalar(1/e)}setAxisAngleFromQuaternion(e){this.w=2*Math.acos(e.w);const t=Math.sqrt(1-e.w*e.w);return t<1e-4?(this.x=1,this.y=0,this.z=0):(this.x=e.x/t,this.y=e.y/t,this.z=e.z/t),this}setAxisAngleFromRotationMatrix(e){let t,i,s,r;const l=e.elements,c=l[0],u=l[4],d=l[8],h=l[1],p=l[5],g=l[9],_=l[2],m=l[6],f=l[10];if(Math.abs(u-h)<.01&&Math.abs(d-_)<.01&&Math.abs(g-m)<.01){if(Math.abs(u+h)<.1&&Math.abs(d+_)<.1&&Math.abs(g+m)<.1&&Math.abs(c+p+f-3)<.1)return this.set(1,0,0,0),this;t=Math.PI;const b=(c+1)/2,E=(p+1)/2,L=(f+1)/2,T=(u+h)/4,A=(d+_)/4,R=(g+m)/4;return b>E&&b>L?b<.01?(i=0,s=.707106781,r=.707106781):(i=Math.sqrt(b),s=T/i,r=A/i):E>L?E<.01?(i=.707106781,s=0,r=.707106781):(s=Math.sqrt(E),i=T/s,r=R/s):L<.01?(i=.707106781,s=.707106781,r=0):(r=Math.sqrt(L),i=A/r,s=R/r),this.set(i,s,r,t),this}let M=Math.sqrt((m-g)*(m-g)+(d-_)*(d-_)+(h-u)*(h-u));return Math.abs(M)<.001&&(M=1),this.x=(m-g)/M,this.y=(d-_)/M,this.z=(h-u)/M,this.w=Math.acos((c+p+f-1)/2),this}setFromMatrixPosition(e){const t=e.elements;return this.x=t[12],this.y=t[13],this.z=t[14],this.w=t[15],this}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this.z=Math.min(this.z,e.z),this.w=Math.min(this.w,e.w),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this.z=Math.max(this.z,e.z),this.w=Math.max(this.w,e.w),this}clamp(e,t){return this.x=Je(this.x,e.x,t.x),this.y=Je(this.y,e.y,t.y),this.z=Je(this.z,e.z,t.z),this.w=Je(this.w,e.w,t.w),this}clampScalar(e,t){return this.x=Je(this.x,e,t),this.y=Je(this.y,e,t),this.z=Je(this.z,e,t),this.w=Je(this.w,e,t),this}clampLength(e,t){const i=this.length();return this.divideScalar(i||1).multiplyScalar(Je(i,e,t))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this.w=Math.floor(this.w),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this.w=Math.ceil(this.w),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this.w=Math.round(this.w),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this.w=Math.trunc(this.w),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this.w=-this.w,this}dot(e){return this.x*e.x+this.y*e.y+this.z*e.z+this.w*e.w}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)+Math.abs(this.w)}normalize(){return this.divideScalar(this.length()||1)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this.z+=(e.z-this.z)*t,this.w+=(e.w-this.w)*t,this}lerpVectors(e,t,i){return this.x=e.x+(t.x-e.x)*i,this.y=e.y+(t.y-e.y)*i,this.z=e.z+(t.z-e.z)*i,this.w=e.w+(t.w-e.w)*i,this}equals(e){return e.x===this.x&&e.y===this.y&&e.z===this.z&&e.w===this.w}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this.z=e[t+2],this.w=e[t+3],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e[t+2]=this.z,e[t+3]=this.w,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this.z=e.getZ(t),this.w=e.getW(t),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this.w=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z,yield this.w}}class C_ extends qi{constructor(e=1,t=1,i={}){super(),i=Object.assign({generateMipmaps:!1,internalFormat:null,minFilter:Cn,depthBuffer:!0,stencilBuffer:!1,resolveDepthBuffer:!0,resolveStencilBuffer:!0,depthTexture:null,samples:0,count:1,depth:1,multiview:!1},i),this.isRenderTarget=!0,this.width=e,this.height=t,this.depth=i.depth,this.scissor=new yt(0,0,e,t),this.scissorTest=!1,this.viewport=new yt(0,0,e,t);const s={width:e,height:t,depth:i.depth},r=new $t(s);this.textures=[];const o=i.count;for(let a=0;a<o;a++)this.textures[a]=r.clone(),this.textures[a].isRenderTargetTexture=!0,this.textures[a].renderTarget=this;this._setTextureOptions(i),this.depthBuffer=i.depthBuffer,this.stencilBuffer=i.stencilBuffer,this.resolveDepthBuffer=i.resolveDepthBuffer,this.resolveStencilBuffer=i.resolveStencilBuffer,this._depthTexture=null,this.depthTexture=i.depthTexture,this.samples=i.samples,this.multiview=i.multiview}_setTextureOptions(e={}){const t={minFilter:Cn,generateMipmaps:!1,flipY:!1,internalFormat:null};e.mapping!==void 0&&(t.mapping=e.mapping),e.wrapS!==void 0&&(t.wrapS=e.wrapS),e.wrapT!==void 0&&(t.wrapT=e.wrapT),e.wrapR!==void 0&&(t.wrapR=e.wrapR),e.magFilter!==void 0&&(t.magFilter=e.magFilter),e.minFilter!==void 0&&(t.minFilter=e.minFilter),e.format!==void 0&&(t.format=e.format),e.type!==void 0&&(t.type=e.type),e.anisotropy!==void 0&&(t.anisotropy=e.anisotropy),e.colorSpace!==void 0&&(t.colorSpace=e.colorSpace),e.flipY!==void 0&&(t.flipY=e.flipY),e.generateMipmaps!==void 0&&(t.generateMipmaps=e.generateMipmaps),e.internalFormat!==void 0&&(t.internalFormat=e.internalFormat);for(let i=0;i<this.textures.length;i++)this.textures[i].setValues(t)}get texture(){return this.textures[0]}set texture(e){this.textures[0]=e}set depthTexture(e){this._depthTexture!==null&&(this._depthTexture.renderTarget=null),e!==null&&(e.renderTarget=this),this._depthTexture=e}get depthTexture(){return this._depthTexture}setSize(e,t,i=1){if(this.width!==e||this.height!==t||this.depth!==i){this.width=e,this.height=t,this.depth=i;for(let s=0,r=this.textures.length;s<r;s++)this.textures[s].image.width=e,this.textures[s].image.height=t,this.textures[s].image.depth=i,this.textures[s].isArrayTexture=this.textures[s].image.depth>1;this.dispose()}this.viewport.set(0,0,e,t),this.scissor.set(0,0,e,t)}clone(){return new this.constructor().copy(this)}copy(e){this.width=e.width,this.height=e.height,this.depth=e.depth,this.scissor.copy(e.scissor),this.scissorTest=e.scissorTest,this.viewport.copy(e.viewport),this.textures.length=0;for(let t=0,i=e.textures.length;t<i;t++){this.textures[t]=e.textures[t].clone(),this.textures[t].isRenderTargetTexture=!0,this.textures[t].renderTarget=this;const s=Object.assign({},e.textures[t].image);this.textures[t].source=new tu(s)}return this.depthBuffer=e.depthBuffer,this.stencilBuffer=e.stencilBuffer,this.resolveDepthBuffer=e.resolveDepthBuffer,this.resolveStencilBuffer=e.resolveStencilBuffer,e.depthTexture!==null&&(this.depthTexture=e.depthTexture.clone()),this.samples=e.samples,this}dispose(){this.dispatchEvent({type:"dispose"})}}class Wi extends C_{constructor(e=1,t=1,i={}){super(e,t,i),this.isWebGLRenderTarget=!0}}class jf extends $t{constructor(e=null,t=1,i=1,s=1){super(null),this.isDataArrayTexture=!0,this.image={data:e,width:t,height:i,depth:s},this.magFilter=on,this.minFilter=on,this.wrapR=Oi,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1,this.layerUpdates=new Set}addLayerUpdate(e){this.layerUpdates.add(e)}clearLayerUpdates(){this.layerUpdates.clear()}}class P_ extends $t{constructor(e=null,t=1,i=1,s=1){super(null),this.isData3DTexture=!0,this.image={data:e,width:t,height:i,depth:s},this.magFilter=on,this.minFilter=on,this.wrapR=Oi,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}}class ji{constructor(e=new F(1/0,1/0,1/0),t=new F(-1/0,-1/0,-1/0)){this.isBox3=!0,this.min=e,this.max=t}set(e,t){return this.min.copy(e),this.max.copy(t),this}setFromArray(e){this.makeEmpty();for(let t=0,i=e.length;t<i;t+=3)this.expandByPoint(wn.fromArray(e,t));return this}setFromBufferAttribute(e){this.makeEmpty();for(let t=0,i=e.count;t<i;t++)this.expandByPoint(wn.fromBufferAttribute(e,t));return this}setFromPoints(e){this.makeEmpty();for(let t=0,i=e.length;t<i;t++)this.expandByPoint(e[t]);return this}setFromCenterAndSize(e,t){const i=wn.copy(t).multiplyScalar(.5);return this.min.copy(e).sub(i),this.max.copy(e).add(i),this}setFromObject(e,t=!1){return this.makeEmpty(),this.expandByObject(e,t)}clone(){return new this.constructor().copy(this)}copy(e){return this.min.copy(e.min),this.max.copy(e.max),this}makeEmpty(){return this.min.x=this.min.y=this.min.z=1/0,this.max.x=this.max.y=this.max.z=-1/0,this}isEmpty(){return this.max.x<this.min.x||this.max.y<this.min.y||this.max.z<this.min.z}getCenter(e){return this.isEmpty()?e.set(0,0,0):e.addVectors(this.min,this.max).multiplyScalar(.5)}getSize(e){return this.isEmpty()?e.set(0,0,0):e.subVectors(this.max,this.min)}expandByPoint(e){return this.min.min(e),this.max.max(e),this}expandByVector(e){return this.min.sub(e),this.max.add(e),this}expandByScalar(e){return this.min.addScalar(-e),this.max.addScalar(e),this}expandByObject(e,t=!1){e.updateWorldMatrix(!1,!1);const i=e.geometry;if(i!==void 0){const r=i.getAttribute("position");if(t===!0&&r!==void 0&&e.isInstancedMesh!==!0)for(let o=0,a=r.count;o<a;o++)e.isMesh===!0?e.getVertexPosition(o,wn):wn.fromBufferAttribute(r,o),wn.applyMatrix4(e.matrixWorld),this.expandByPoint(wn);else e.boundingBox!==void 0?(e.boundingBox===null&&e.computeBoundingBox(),Hr.copy(e.boundingBox)):(i.boundingBox===null&&i.computeBoundingBox(),Hr.copy(i.boundingBox)),Hr.applyMatrix4(e.matrixWorld),this.union(Hr)}const s=e.children;for(let r=0,o=s.length;r<o;r++)this.expandByObject(s[r],t);return this}containsPoint(e){return e.x>=this.min.x&&e.x<=this.max.x&&e.y>=this.min.y&&e.y<=this.max.y&&e.z>=this.min.z&&e.z<=this.max.z}containsBox(e){return this.min.x<=e.min.x&&e.max.x<=this.max.x&&this.min.y<=e.min.y&&e.max.y<=this.max.y&&this.min.z<=e.min.z&&e.max.z<=this.max.z}getParameter(e,t){return t.set((e.x-this.min.x)/(this.max.x-this.min.x),(e.y-this.min.y)/(this.max.y-this.min.y),(e.z-this.min.z)/(this.max.z-this.min.z))}intersectsBox(e){return e.max.x>=this.min.x&&e.min.x<=this.max.x&&e.max.y>=this.min.y&&e.min.y<=this.max.y&&e.max.z>=this.min.z&&e.min.z<=this.max.z}intersectsSphere(e){return this.clampPoint(e.center,wn),wn.distanceToSquared(e.center)<=e.radius*e.radius}intersectsPlane(e){let t,i;return e.normal.x>0?(t=e.normal.x*this.min.x,i=e.normal.x*this.max.x):(t=e.normal.x*this.max.x,i=e.normal.x*this.min.x),e.normal.y>0?(t+=e.normal.y*this.min.y,i+=e.normal.y*this.max.y):(t+=e.normal.y*this.max.y,i+=e.normal.y*this.min.y),e.normal.z>0?(t+=e.normal.z*this.min.z,i+=e.normal.z*this.max.z):(t+=e.normal.z*this.max.z,i+=e.normal.z*this.min.z),t<=-e.constant&&i>=-e.constant}intersectsTriangle(e){if(this.isEmpty())return!1;this.getCenter(qs),Vr.subVectors(this.max,qs),ss.subVectors(e.a,qs),rs.subVectors(e.b,qs),os.subVectors(e.c,qs),ei.subVectors(rs,ss),ti.subVectors(os,rs),Ai.subVectors(ss,os);let t=[0,-ei.z,ei.y,0,-ti.z,ti.y,0,-Ai.z,Ai.y,ei.z,0,-ei.x,ti.z,0,-ti.x,Ai.z,0,-Ai.x,-ei.y,ei.x,0,-ti.y,ti.x,0,-Ai.y,Ai.x,0];return!Ra(t,ss,rs,os,Vr)||(t=[1,0,0,0,1,0,0,0,1],!Ra(t,ss,rs,os,Vr))?!1:($r.crossVectors(ei,ti),t=[$r.x,$r.y,$r.z],Ra(t,ss,rs,os,Vr))}clampPoint(e,t){return t.copy(e).clamp(this.min,this.max)}distanceToPoint(e){return this.clampPoint(e,wn).distanceTo(e)}getBoundingSphere(e){return this.isEmpty()?e.makeEmpty():(this.getCenter(e.center),e.radius=this.getSize(wn).length()*.5),e}intersect(e){return this.min.max(e.min),this.max.min(e.max),this.isEmpty()&&this.makeEmpty(),this}union(e){return this.min.min(e.min),this.max.max(e.max),this}applyMatrix4(e){return this.isEmpty()?this:(Bn[0].set(this.min.x,this.min.y,this.min.z).applyMatrix4(e),Bn[1].set(this.min.x,this.min.y,this.max.z).applyMatrix4(e),Bn[2].set(this.min.x,this.max.y,this.min.z).applyMatrix4(e),Bn[3].set(this.min.x,this.max.y,this.max.z).applyMatrix4(e),Bn[4].set(this.max.x,this.min.y,this.min.z).applyMatrix4(e),Bn[5].set(this.max.x,this.min.y,this.max.z).applyMatrix4(e),Bn[6].set(this.max.x,this.max.y,this.min.z).applyMatrix4(e),Bn[7].set(this.max.x,this.max.y,this.max.z).applyMatrix4(e),this.setFromPoints(Bn),this)}translate(e){return this.min.add(e),this.max.add(e),this}equals(e){return e.min.equals(this.min)&&e.max.equals(this.max)}toJSON(){return{min:this.min.toArray(),max:this.max.toArray()}}fromJSON(e){return this.min.fromArray(e.min),this.max.fromArray(e.max),this}}const Bn=[new F,new F,new F,new F,new F,new F,new F,new F],wn=new F,Hr=new ji,ss=new F,rs=new F,os=new F,ei=new F,ti=new F,Ai=new F,qs=new F,Vr=new F,$r=new F,Ri=new F;function Ra(n,e,t,i,s){for(let r=0,o=n.length-3;r<=o;r+=3){Ri.fromArray(n,r);const a=s.x*Math.abs(Ri.x)+s.y*Math.abs(Ri.y)+s.z*Math.abs(Ri.z),l=e.dot(Ri),c=t.dot(Ri),u=i.dot(Ri);if(Math.max(-Math.max(l,c,u),Math.min(l,c,u))>a)return!1}return!0}const L_=new ji,js=new F,Ca=new F;class Ki{constructor(e=new F,t=-1){this.isSphere=!0,this.center=e,this.radius=t}set(e,t){return this.center.copy(e),this.radius=t,this}setFromPoints(e,t){const i=this.center;t!==void 0?i.copy(t):L_.setFromPoints(e).getCenter(i);let s=0;for(let r=0,o=e.length;r<o;r++)s=Math.max(s,i.distanceToSquared(e[r]));return this.radius=Math.sqrt(s),this}copy(e){return this.center.copy(e.center),this.radius=e.radius,this}isEmpty(){return this.radius<0}makeEmpty(){return this.center.set(0,0,0),this.radius=-1,this}containsPoint(e){return e.distanceToSquared(this.center)<=this.radius*this.radius}distanceToPoint(e){return e.distanceTo(this.center)-this.radius}intersectsSphere(e){const t=this.radius+e.radius;return e.center.distanceToSquared(this.center)<=t*t}intersectsBox(e){return e.intersectsSphere(this)}intersectsPlane(e){return Math.abs(e.distanceToPoint(this.center))<=this.radius}clampPoint(e,t){const i=this.center.distanceToSquared(e);return t.copy(e),i>this.radius*this.radius&&(t.sub(this.center).normalize(),t.multiplyScalar(this.radius).add(this.center)),t}getBoundingBox(e){return this.isEmpty()?(e.makeEmpty(),e):(e.set(this.center,this.center),e.expandByScalar(this.radius),e)}applyMatrix4(e){return this.center.applyMatrix4(e),this.radius=this.radius*e.getMaxScaleOnAxis(),this}translate(e){return this.center.add(e),this}expandByPoint(e){if(this.isEmpty())return this.center.copy(e),this.radius=0,this;js.subVectors(e,this.center);const t=js.lengthSq();if(t>this.radius*this.radius){const i=Math.sqrt(t),s=(i-this.radius)*.5;this.center.addScaledVector(js,s/i),this.radius+=s}return this}union(e){return e.isEmpty()?this:this.isEmpty()?(this.copy(e),this):(this.center.equals(e.center)===!0?this.radius=Math.max(this.radius,e.radius):(Ca.subVectors(e.center,this.center).setLength(e.radius),this.expandByPoint(js.copy(e.center).add(Ca)),this.expandByPoint(js.copy(e.center).sub(Ca))),this)}equals(e){return e.center.equals(this.center)&&e.radius===this.radius}clone(){return new this.constructor().copy(this)}toJSON(){return{radius:this.radius,center:this.center.toArray()}}fromJSON(e){return this.radius=e.radius,this.center.fromArray(e.center),this}}const kn=new F,Pa=new F,Wr=new F,ni=new F,La=new F,Xr=new F,Da=new F;class Ar{constructor(e=new F,t=new F(0,0,-1)){this.origin=e,this.direction=t}set(e,t){return this.origin.copy(e),this.direction.copy(t),this}copy(e){return this.origin.copy(e.origin),this.direction.copy(e.direction),this}at(e,t){return t.copy(this.origin).addScaledVector(this.direction,e)}lookAt(e){return this.direction.copy(e).sub(this.origin).normalize(),this}recast(e){return this.origin.copy(this.at(e,kn)),this}closestPointToPoint(e,t){t.subVectors(e,this.origin);const i=t.dot(this.direction);return i<0?t.copy(this.origin):t.copy(this.origin).addScaledVector(this.direction,i)}distanceToPoint(e){return Math.sqrt(this.distanceSqToPoint(e))}distanceSqToPoint(e){const t=kn.subVectors(e,this.origin).dot(this.direction);return t<0?this.origin.distanceToSquared(e):(kn.copy(this.origin).addScaledVector(this.direction,t),kn.distanceToSquared(e))}distanceSqToSegment(e,t,i,s){Pa.copy(e).add(t).multiplyScalar(.5),Wr.copy(t).sub(e).normalize(),ni.copy(this.origin).sub(Pa);const r=e.distanceTo(t)*.5,o=-this.direction.dot(Wr),a=ni.dot(this.direction),l=-ni.dot(Wr),c=ni.lengthSq(),u=Math.abs(1-o*o);let d,h,p,g;if(u>0)if(d=o*l-a,h=o*a-l,g=r*u,d>=0)if(h>=-g)if(h<=g){const _=1/u;d*=_,h*=_,p=d*(d+o*h+2*a)+h*(o*d+h+2*l)+c}else h=r,d=Math.max(0,-(o*h+a)),p=-d*d+h*(h+2*l)+c;else h=-r,d=Math.max(0,-(o*h+a)),p=-d*d+h*(h+2*l)+c;else h<=-g?(d=Math.max(0,-(-o*r+a)),h=d>0?-r:Math.min(Math.max(-r,-l),r),p=-d*d+h*(h+2*l)+c):h<=g?(d=0,h=Math.min(Math.max(-r,-l),r),p=h*(h+2*l)+c):(d=Math.max(0,-(o*r+a)),h=d>0?r:Math.min(Math.max(-r,-l),r),p=-d*d+h*(h+2*l)+c);else h=o>0?-r:r,d=Math.max(0,-(o*h+a)),p=-d*d+h*(h+2*l)+c;return i&&i.copy(this.origin).addScaledVector(this.direction,d),s&&s.copy(Pa).addScaledVector(Wr,h),p}intersectSphere(e,t){kn.subVectors(e.center,this.origin);const i=kn.dot(this.direction),s=kn.dot(kn)-i*i,r=e.radius*e.radius;if(s>r)return null;const o=Math.sqrt(r-s),a=i-o,l=i+o;return l<0?null:a<0?this.at(l,t):this.at(a,t)}intersectsSphere(e){return e.radius<0?!1:this.distanceSqToPoint(e.center)<=e.radius*e.radius}distanceToPlane(e){const t=e.normal.dot(this.direction);if(t===0)return e.distanceToPoint(this.origin)===0?0:null;const i=-(this.origin.dot(e.normal)+e.constant)/t;return i>=0?i:null}intersectPlane(e,t){const i=this.distanceToPlane(e);return i===null?null:this.at(i,t)}intersectsPlane(e){const t=e.distanceToPoint(this.origin);return t===0||e.normal.dot(this.direction)*t<0}intersectBox(e,t){let i,s,r,o,a,l;const c=1/this.direction.x,u=1/this.direction.y,d=1/this.direction.z,h=this.origin;return c>=0?(i=(e.min.x-h.x)*c,s=(e.max.x-h.x)*c):(i=(e.max.x-h.x)*c,s=(e.min.x-h.x)*c),u>=0?(r=(e.min.y-h.y)*u,o=(e.max.y-h.y)*u):(r=(e.max.y-h.y)*u,o=(e.min.y-h.y)*u),i>o||r>s||((r>i||isNaN(i))&&(i=r),(o<s||isNaN(s))&&(s=o),d>=0?(a=(e.min.z-h.z)*d,l=(e.max.z-h.z)*d):(a=(e.max.z-h.z)*d,l=(e.min.z-h.z)*d),i>l||a>s)||((a>i||i!==i)&&(i=a),(l<s||s!==s)&&(s=l),s<0)?null:this.at(i>=0?i:s,t)}intersectsBox(e){return this.intersectBox(e,kn)!==null}intersectTriangle(e,t,i,s,r){La.subVectors(t,e),Xr.subVectors(i,e),Da.crossVectors(La,Xr);let o=this.direction.dot(Da),a;if(o>0){if(s)return null;a=1}else if(o<0)a=-1,o=-o;else return null;ni.subVectors(this.origin,e);const l=a*this.direction.dot(Xr.crossVectors(ni,Xr));if(l<0)return null;const c=a*this.direction.dot(La.cross(ni));if(c<0||l+c>o)return null;const u=-a*ni.dot(Da);return u<0?null:this.at(u/o,r)}applyMatrix4(e){return this.origin.applyMatrix4(e),this.direction.transformDirection(e),this}equals(e){return e.origin.equals(this.origin)&&e.direction.equals(this.direction)}clone(){return new this.constructor().copy(this)}}class rt{constructor(e,t,i,s,r,o,a,l,c,u,d,h,p,g,_,m){rt.prototype.isMatrix4=!0,this.elements=[1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1],e!==void 0&&this.set(e,t,i,s,r,o,a,l,c,u,d,h,p,g,_,m)}set(e,t,i,s,r,o,a,l,c,u,d,h,p,g,_,m){const f=this.elements;return f[0]=e,f[4]=t,f[8]=i,f[12]=s,f[1]=r,f[5]=o,f[9]=a,f[13]=l,f[2]=c,f[6]=u,f[10]=d,f[14]=h,f[3]=p,f[7]=g,f[11]=_,f[15]=m,this}identity(){return this.set(1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1),this}clone(){return new rt().fromArray(this.elements)}copy(e){const t=this.elements,i=e.elements;return t[0]=i[0],t[1]=i[1],t[2]=i[2],t[3]=i[3],t[4]=i[4],t[5]=i[5],t[6]=i[6],t[7]=i[7],t[8]=i[8],t[9]=i[9],t[10]=i[10],t[11]=i[11],t[12]=i[12],t[13]=i[13],t[14]=i[14],t[15]=i[15],this}copyPosition(e){const t=this.elements,i=e.elements;return t[12]=i[12],t[13]=i[13],t[14]=i[14],this}setFromMatrix3(e){const t=e.elements;return this.set(t[0],t[3],t[6],0,t[1],t[4],t[7],0,t[2],t[5],t[8],0,0,0,0,1),this}extractBasis(e,t,i){return e.setFromMatrixColumn(this,0),t.setFromMatrixColumn(this,1),i.setFromMatrixColumn(this,2),this}makeBasis(e,t,i){return this.set(e.x,t.x,i.x,0,e.y,t.y,i.y,0,e.z,t.z,i.z,0,0,0,0,1),this}extractRotation(e){const t=this.elements,i=e.elements,s=1/as.setFromMatrixColumn(e,0).length(),r=1/as.setFromMatrixColumn(e,1).length(),o=1/as.setFromMatrixColumn(e,2).length();return t[0]=i[0]*s,t[1]=i[1]*s,t[2]=i[2]*s,t[3]=0,t[4]=i[4]*r,t[5]=i[5]*r,t[6]=i[6]*r,t[7]=0,t[8]=i[8]*o,t[9]=i[9]*o,t[10]=i[10]*o,t[11]=0,t[12]=0,t[13]=0,t[14]=0,t[15]=1,this}makeRotationFromEuler(e){const t=this.elements,i=e.x,s=e.y,r=e.z,o=Math.cos(i),a=Math.sin(i),l=Math.cos(s),c=Math.sin(s),u=Math.cos(r),d=Math.sin(r);if(e.order==="XYZ"){const h=o*u,p=o*d,g=a*u,_=a*d;t[0]=l*u,t[4]=-l*d,t[8]=c,t[1]=p+g*c,t[5]=h-_*c,t[9]=-a*l,t[2]=_-h*c,t[6]=g+p*c,t[10]=o*l}else if(e.order==="YXZ"){const h=l*u,p=l*d,g=c*u,_=c*d;t[0]=h+_*a,t[4]=g*a-p,t[8]=o*c,t[1]=o*d,t[5]=o*u,t[9]=-a,t[2]=p*a-g,t[6]=_+h*a,t[10]=o*l}else if(e.order==="ZXY"){const h=l*u,p=l*d,g=c*u,_=c*d;t[0]=h-_*a,t[4]=-o*d,t[8]=g+p*a,t[1]=p+g*a,t[5]=o*u,t[9]=_-h*a,t[2]=-o*c,t[6]=a,t[10]=o*l}else if(e.order==="ZYX"){const h=o*u,p=o*d,g=a*u,_=a*d;t[0]=l*u,t[4]=g*c-p,t[8]=h*c+_,t[1]=l*d,t[5]=_*c+h,t[9]=p*c-g,t[2]=-c,t[6]=a*l,t[10]=o*l}else if(e.order==="YZX"){const h=o*l,p=o*c,g=a*l,_=a*c;t[0]=l*u,t[4]=_-h*d,t[8]=g*d+p,t[1]=d,t[5]=o*u,t[9]=-a*u,t[2]=-c*u,t[6]=p*d+g,t[10]=h-_*d}else if(e.order==="XZY"){const h=o*l,p=o*c,g=a*l,_=a*c;t[0]=l*u,t[4]=-d,t[8]=c*u,t[1]=h*d+_,t[5]=o*u,t[9]=p*d-g,t[2]=g*d-p,t[6]=a*u,t[10]=_*d+h}return t[3]=0,t[7]=0,t[11]=0,t[12]=0,t[13]=0,t[14]=0,t[15]=1,this}makeRotationFromQuaternion(e){return this.compose(D_,e,I_)}lookAt(e,t,i){const s=this.elements;return tn.subVectors(e,t),tn.lengthSq()===0&&(tn.z=1),tn.normalize(),ii.crossVectors(i,tn),ii.lengthSq()===0&&(Math.abs(i.z)===1?tn.x+=1e-4:tn.z+=1e-4,tn.normalize(),ii.crossVectors(i,tn)),ii.normalize(),Yr.crossVectors(tn,ii),s[0]=ii.x,s[4]=Yr.x,s[8]=tn.x,s[1]=ii.y,s[5]=Yr.y,s[9]=tn.y,s[2]=ii.z,s[6]=Yr.z,s[10]=tn.z,this}multiply(e){return this.multiplyMatrices(this,e)}premultiply(e){return this.multiplyMatrices(e,this)}multiplyMatrices(e,t){const i=e.elements,s=t.elements,r=this.elements,o=i[0],a=i[4],l=i[8],c=i[12],u=i[1],d=i[5],h=i[9],p=i[13],g=i[2],_=i[6],m=i[10],f=i[14],M=i[3],b=i[7],E=i[11],L=i[15],T=s[0],A=s[4],R=s[8],S=s[12],y=s[1],D=s[5],$=s[9],k=s[13],q=s[2],Z=s[6],V=s[10],ie=s[14],H=s[3],oe=s[7],me=s[11],Te=s[15];return r[0]=o*T+a*y+l*q+c*H,r[4]=o*A+a*D+l*Z+c*oe,r[8]=o*R+a*$+l*V+c*me,r[12]=o*S+a*k+l*ie+c*Te,r[1]=u*T+d*y+h*q+p*H,r[5]=u*A+d*D+h*Z+p*oe,r[9]=u*R+d*$+h*V+p*me,r[13]=u*S+d*k+h*ie+p*Te,r[2]=g*T+_*y+m*q+f*H,r[6]=g*A+_*D+m*Z+f*oe,r[10]=g*R+_*$+m*V+f*me,r[14]=g*S+_*k+m*ie+f*Te,r[3]=M*T+b*y+E*q+L*H,r[7]=M*A+b*D+E*Z+L*oe,r[11]=M*R+b*$+E*V+L*me,r[15]=M*S+b*k+E*ie+L*Te,this}multiplyScalar(e){const t=this.elements;return t[0]*=e,t[4]*=e,t[8]*=e,t[12]*=e,t[1]*=e,t[5]*=e,t[9]*=e,t[13]*=e,t[2]*=e,t[6]*=e,t[10]*=e,t[14]*=e,t[3]*=e,t[7]*=e,t[11]*=e,t[15]*=e,this}determinant(){const e=this.elements,t=e[0],i=e[4],s=e[8],r=e[12],o=e[1],a=e[5],l=e[9],c=e[13],u=e[2],d=e[6],h=e[10],p=e[14],g=e[3],_=e[7],m=e[11],f=e[15];return g*(+r*l*d-s*c*d-r*a*h+i*c*h+s*a*p-i*l*p)+_*(+t*l*p-t*c*h+r*o*h-s*o*p+s*c*u-r*l*u)+m*(+t*c*d-t*a*p-r*o*d+i*o*p+r*a*u-i*c*u)+f*(-s*a*u-t*l*d+t*a*h+s*o*d-i*o*h+i*l*u)}transpose(){const e=this.elements;let t;return t=e[1],e[1]=e[4],e[4]=t,t=e[2],e[2]=e[8],e[8]=t,t=e[6],e[6]=e[9],e[9]=t,t=e[3],e[3]=e[12],e[12]=t,t=e[7],e[7]=e[13],e[13]=t,t=e[11],e[11]=e[14],e[14]=t,this}setPosition(e,t,i){const s=this.elements;return e.isVector3?(s[12]=e.x,s[13]=e.y,s[14]=e.z):(s[12]=e,s[13]=t,s[14]=i),this}invert(){const e=this.elements,t=e[0],i=e[1],s=e[2],r=e[3],o=e[4],a=e[5],l=e[6],c=e[7],u=e[8],d=e[9],h=e[10],p=e[11],g=e[12],_=e[13],m=e[14],f=e[15],M=d*m*c-_*h*c+_*l*p-a*m*p-d*l*f+a*h*f,b=g*h*c-u*m*c-g*l*p+o*m*p+u*l*f-o*h*f,E=u*_*c-g*d*c+g*a*p-o*_*p-u*a*f+o*d*f,L=g*d*l-u*_*l-g*a*h+o*_*h+u*a*m-o*d*m,T=t*M+i*b+s*E+r*L;if(T===0)return this.set(0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0);const A=1/T;return e[0]=M*A,e[1]=(_*h*r-d*m*r-_*s*p+i*m*p+d*s*f-i*h*f)*A,e[2]=(a*m*r-_*l*r+_*s*c-i*m*c-a*s*f+i*l*f)*A,e[3]=(d*l*r-a*h*r-d*s*c+i*h*c+a*s*p-i*l*p)*A,e[4]=b*A,e[5]=(u*m*r-g*h*r+g*s*p-t*m*p-u*s*f+t*h*f)*A,e[6]=(g*l*r-o*m*r-g*s*c+t*m*c+o*s*f-t*l*f)*A,e[7]=(o*h*r-u*l*r+u*s*c-t*h*c-o*s*p+t*l*p)*A,e[8]=E*A,e[9]=(g*d*r-u*_*r-g*i*p+t*_*p+u*i*f-t*d*f)*A,e[10]=(o*_*r-g*a*r+g*i*c-t*_*c-o*i*f+t*a*f)*A,e[11]=(u*a*r-o*d*r-u*i*c+t*d*c+o*i*p-t*a*p)*A,e[12]=L*A,e[13]=(u*_*s-g*d*s+g*i*h-t*_*h-u*i*m+t*d*m)*A,e[14]=(g*a*s-o*_*s-g*i*l+t*_*l+o*i*m-t*a*m)*A,e[15]=(o*d*s-u*a*s+u*i*l-t*d*l-o*i*h+t*a*h)*A,this}scale(e){const t=this.elements,i=e.x,s=e.y,r=e.z;return t[0]*=i,t[4]*=s,t[8]*=r,t[1]*=i,t[5]*=s,t[9]*=r,t[2]*=i,t[6]*=s,t[10]*=r,t[3]*=i,t[7]*=s,t[11]*=r,this}getMaxScaleOnAxis(){const e=this.elements,t=e[0]*e[0]+e[1]*e[1]+e[2]*e[2],i=e[4]*e[4]+e[5]*e[5]+e[6]*e[6],s=e[8]*e[8]+e[9]*e[9]+e[10]*e[10];return Math.sqrt(Math.max(t,i,s))}makeTranslation(e,t,i){return e.isVector3?this.set(1,0,0,e.x,0,1,0,e.y,0,0,1,e.z,0,0,0,1):this.set(1,0,0,e,0,1,0,t,0,0,1,i,0,0,0,1),this}makeRotationX(e){const t=Math.cos(e),i=Math.sin(e);return this.set(1,0,0,0,0,t,-i,0,0,i,t,0,0,0,0,1),this}makeRotationY(e){const t=Math.cos(e),i=Math.sin(e);return this.set(t,0,i,0,0,1,0,0,-i,0,t,0,0,0,0,1),this}makeRotationZ(e){const t=Math.cos(e),i=Math.sin(e);return this.set(t,-i,0,0,i,t,0,0,0,0,1,0,0,0,0,1),this}makeRotationAxis(e,t){const i=Math.cos(t),s=Math.sin(t),r=1-i,o=e.x,a=e.y,l=e.z,c=r*o,u=r*a;return this.set(c*o+i,c*a-s*l,c*l+s*a,0,c*a+s*l,u*a+i,u*l-s*o,0,c*l-s*a,u*l+s*o,r*l*l+i,0,0,0,0,1),this}makeScale(e,t,i){return this.set(e,0,0,0,0,t,0,0,0,0,i,0,0,0,0,1),this}makeShear(e,t,i,s,r,o){return this.set(1,i,r,0,e,1,o,0,t,s,1,0,0,0,0,1),this}compose(e,t,i){const s=this.elements,r=t._x,o=t._y,a=t._z,l=t._w,c=r+r,u=o+o,d=a+a,h=r*c,p=r*u,g=r*d,_=o*u,m=o*d,f=a*d,M=l*c,b=l*u,E=l*d,L=i.x,T=i.y,A=i.z;return s[0]=(1-(_+f))*L,s[1]=(p+E)*L,s[2]=(g-b)*L,s[3]=0,s[4]=(p-E)*T,s[5]=(1-(h+f))*T,s[6]=(m+M)*T,s[7]=0,s[8]=(g+b)*A,s[9]=(m-M)*A,s[10]=(1-(h+_))*A,s[11]=0,s[12]=e.x,s[13]=e.y,s[14]=e.z,s[15]=1,this}decompose(e,t,i){const s=this.elements;let r=as.set(s[0],s[1],s[2]).length();const o=as.set(s[4],s[5],s[6]).length(),a=as.set(s[8],s[9],s[10]).length();this.determinant()<0&&(r=-r),e.x=s[12],e.y=s[13],e.z=s[14],bn.copy(this);const c=1/r,u=1/o,d=1/a;return bn.elements[0]*=c,bn.elements[1]*=c,bn.elements[2]*=c,bn.elements[4]*=u,bn.elements[5]*=u,bn.elements[6]*=u,bn.elements[8]*=d,bn.elements[9]*=d,bn.elements[10]*=d,t.setFromRotationMatrix(bn),i.x=r,i.y=o,i.z=a,this}makePerspective(e,t,i,s,r,o,a=jn){const l=this.elements,c=2*r/(t-e),u=2*r/(i-s),d=(t+e)/(t-e),h=(i+s)/(i-s);let p,g;if(a===jn)p=-(o+r)/(o-r),g=-2*o*r/(o-r);else if(a===Vo)p=-o/(o-r),g=-o*r/(o-r);else throw new Error("THREE.Matrix4.makePerspective(): Invalid coordinate system: "+a);return l[0]=c,l[4]=0,l[8]=d,l[12]=0,l[1]=0,l[5]=u,l[9]=h,l[13]=0,l[2]=0,l[6]=0,l[10]=p,l[14]=g,l[3]=0,l[7]=0,l[11]=-1,l[15]=0,this}makeOrthographic(e,t,i,s,r,o,a=jn){const l=this.elements,c=1/(t-e),u=1/(i-s),d=1/(o-r),h=(t+e)*c,p=(i+s)*u;let g,_;if(a===jn)g=(o+r)*d,_=-2*d;else if(a===Vo)g=r*d,_=-1*d;else throw new Error("THREE.Matrix4.makeOrthographic(): Invalid coordinate system: "+a);return l[0]=2*c,l[4]=0,l[8]=0,l[12]=-h,l[1]=0,l[5]=2*u,l[9]=0,l[13]=-p,l[2]=0,l[6]=0,l[10]=_,l[14]=-g,l[3]=0,l[7]=0,l[11]=0,l[15]=1,this}equals(e){const t=this.elements,i=e.elements;for(let s=0;s<16;s++)if(t[s]!==i[s])return!1;return!0}fromArray(e,t=0){for(let i=0;i<16;i++)this.elements[i]=e[i+t];return this}toArray(e=[],t=0){const i=this.elements;return e[t]=i[0],e[t+1]=i[1],e[t+2]=i[2],e[t+3]=i[3],e[t+4]=i[4],e[t+5]=i[5],e[t+6]=i[6],e[t+7]=i[7],e[t+8]=i[8],e[t+9]=i[9],e[t+10]=i[10],e[t+11]=i[11],e[t+12]=i[12],e[t+13]=i[13],e[t+14]=i[14],e[t+15]=i[15],e}}const as=new F,bn=new rt,D_=new F(0,0,0),I_=new F(1,1,1),ii=new F,Yr=new F,tn=new F,md=new rt,gd=new $i;class Fn{constructor(e=0,t=0,i=0,s=Fn.DEFAULT_ORDER){this.isEuler=!0,this._x=e,this._y=t,this._z=i,this._order=s}get x(){return this._x}set x(e){this._x=e,this._onChangeCallback()}get y(){return this._y}set y(e){this._y=e,this._onChangeCallback()}get z(){return this._z}set z(e){this._z=e,this._onChangeCallback()}get order(){return this._order}set order(e){this._order=e,this._onChangeCallback()}set(e,t,i,s=this._order){return this._x=e,this._y=t,this._z=i,this._order=s,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._order)}copy(e){return this._x=e._x,this._y=e._y,this._z=e._z,this._order=e._order,this._onChangeCallback(),this}setFromRotationMatrix(e,t=this._order,i=!0){const s=e.elements,r=s[0],o=s[4],a=s[8],l=s[1],c=s[5],u=s[9],d=s[2],h=s[6],p=s[10];switch(t){case"XYZ":this._y=Math.asin(Je(a,-1,1)),Math.abs(a)<.9999999?(this._x=Math.atan2(-u,p),this._z=Math.atan2(-o,r)):(this._x=Math.atan2(h,c),this._z=0);break;case"YXZ":this._x=Math.asin(-Je(u,-1,1)),Math.abs(u)<.9999999?(this._y=Math.atan2(a,p),this._z=Math.atan2(l,c)):(this._y=Math.atan2(-d,r),this._z=0);break;case"ZXY":this._x=Math.asin(Je(h,-1,1)),Math.abs(h)<.9999999?(this._y=Math.atan2(-d,p),this._z=Math.atan2(-o,c)):(this._y=0,this._z=Math.atan2(l,r));break;case"ZYX":this._y=Math.asin(-Je(d,-1,1)),Math.abs(d)<.9999999?(this._x=Math.atan2(h,p),this._z=Math.atan2(l,r)):(this._x=0,this._z=Math.atan2(-o,c));break;case"YZX":this._z=Math.asin(Je(l,-1,1)),Math.abs(l)<.9999999?(this._x=Math.atan2(-u,c),this._y=Math.atan2(-d,r)):(this._x=0,this._y=Math.atan2(a,p));break;case"XZY":this._z=Math.asin(-Je(o,-1,1)),Math.abs(o)<.9999999?(this._x=Math.atan2(h,c),this._y=Math.atan2(a,r)):(this._x=Math.atan2(-u,p),this._y=0);break;default:console.warn("THREE.Euler: .setFromRotationMatrix() encountered an unknown order: "+t)}return this._order=t,i===!0&&this._onChangeCallback(),this}setFromQuaternion(e,t,i){return md.makeRotationFromQuaternion(e),this.setFromRotationMatrix(md,t,i)}setFromVector3(e,t=this._order){return this.set(e.x,e.y,e.z,t)}reorder(e){return gd.setFromEuler(this),this.setFromQuaternion(gd,e)}equals(e){return e._x===this._x&&e._y===this._y&&e._z===this._z&&e._order===this._order}fromArray(e){return this._x=e[0],this._y=e[1],this._z=e[2],e[3]!==void 0&&(this._order=e[3]),this._onChangeCallback(),this}toArray(e=[],t=0){return e[t]=this._x,e[t+1]=this._y,e[t+2]=this._z,e[t+3]=this._order,e}_onChange(e){return this._onChangeCallback=e,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._order}}Fn.DEFAULT_ORDER="XYZ";class nu{constructor(){this.mask=1}set(e){this.mask=(1<<e|0)>>>0}enable(e){this.mask|=1<<e|0}enableAll(){this.mask=-1}toggle(e){this.mask^=1<<e|0}disable(e){this.mask&=~(1<<e|0)}disableAll(){this.mask=0}test(e){return(this.mask&e.mask)!==0}isEnabled(e){return(this.mask&(1<<e|0))!==0}}let U_=0;const _d=new F,ls=new $i,zn=new rt,qr=new F,Ks=new F,N_=new F,F_=new $i,vd=new F(1,0,0),xd=new F(0,1,0),yd=new F(0,0,1),Sd={type:"added"},O_={type:"removed"},cs={type:"childadded",child:null},Ia={type:"childremoved",child:null};class It extends qi{constructor(){super(),this.isObject3D=!0,Object.defineProperty(this,"id",{value:U_++}),this.uuid=Tr(),this.name="",this.type="Object3D",this.parent=null,this.children=[],this.up=It.DEFAULT_UP.clone();const e=new F,t=new Fn,i=new $i,s=new F(1,1,1);function r(){i.setFromEuler(t,!1)}function o(){t.setFromQuaternion(i,void 0,!1)}t._onChange(r),i._onChange(o),Object.defineProperties(this,{position:{configurable:!0,enumerable:!0,value:e},rotation:{configurable:!0,enumerable:!0,value:t},quaternion:{configurable:!0,enumerable:!0,value:i},scale:{configurable:!0,enumerable:!0,value:s},modelViewMatrix:{value:new rt},normalMatrix:{value:new Ye}}),this.matrix=new rt,this.matrixWorld=new rt,this.matrixAutoUpdate=It.DEFAULT_MATRIX_AUTO_UPDATE,this.matrixWorldAutoUpdate=It.DEFAULT_MATRIX_WORLD_AUTO_UPDATE,this.matrixWorldNeedsUpdate=!1,this.layers=new nu,this.visible=!0,this.castShadow=!1,this.receiveShadow=!1,this.frustumCulled=!0,this.renderOrder=0,this.animations=[],this.customDepthMaterial=void 0,this.customDistanceMaterial=void 0,this.userData={}}onBeforeShadow(){}onAfterShadow(){}onBeforeRender(){}onAfterRender(){}applyMatrix4(e){this.matrixAutoUpdate&&this.updateMatrix(),this.matrix.premultiply(e),this.matrix.decompose(this.position,this.quaternion,this.scale)}applyQuaternion(e){return this.quaternion.premultiply(e),this}setRotationFromAxisAngle(e,t){this.quaternion.setFromAxisAngle(e,t)}setRotationFromEuler(e){this.quaternion.setFromEuler(e,!0)}setRotationFromMatrix(e){this.quaternion.setFromRotationMatrix(e)}setRotationFromQuaternion(e){this.quaternion.copy(e)}rotateOnAxis(e,t){return ls.setFromAxisAngle(e,t),this.quaternion.multiply(ls),this}rotateOnWorldAxis(e,t){return ls.setFromAxisAngle(e,t),this.quaternion.premultiply(ls),this}rotateX(e){return this.rotateOnAxis(vd,e)}rotateY(e){return this.rotateOnAxis(xd,e)}rotateZ(e){return this.rotateOnAxis(yd,e)}translateOnAxis(e,t){return _d.copy(e).applyQuaternion(this.quaternion),this.position.add(_d.multiplyScalar(t)),this}translateX(e){return this.translateOnAxis(vd,e)}translateY(e){return this.translateOnAxis(xd,e)}translateZ(e){return this.translateOnAxis(yd,e)}localToWorld(e){return this.updateWorldMatrix(!0,!1),e.applyMatrix4(this.matrixWorld)}worldToLocal(e){return this.updateWorldMatrix(!0,!1),e.applyMatrix4(zn.copy(this.matrixWorld).invert())}lookAt(e,t,i){e.isVector3?qr.copy(e):qr.set(e,t,i);const s=this.parent;this.updateWorldMatrix(!0,!1),Ks.setFromMatrixPosition(this.matrixWorld),this.isCamera||this.isLight?zn.lookAt(Ks,qr,this.up):zn.lookAt(qr,Ks,this.up),this.quaternion.setFromRotationMatrix(zn),s&&(zn.extractRotation(s.matrixWorld),ls.setFromRotationMatrix(zn),this.quaternion.premultiply(ls.invert()))}add(e){if(arguments.length>1){for(let t=0;t<arguments.length;t++)this.add(arguments[t]);return this}return e===this?(console.error("THREE.Object3D.add: object can't be added as a child of itself.",e),this):(e&&e.isObject3D?(e.removeFromParent(),e.parent=this,this.children.push(e),e.dispatchEvent(Sd),cs.child=e,this.dispatchEvent(cs),cs.child=null):console.error("THREE.Object3D.add: object not an instance of THREE.Object3D.",e),this)}remove(e){if(arguments.length>1){for(let i=0;i<arguments.length;i++)this.remove(arguments[i]);return this}const t=this.children.indexOf(e);return t!==-1&&(e.parent=null,this.children.splice(t,1),e.dispatchEvent(O_),Ia.child=e,this.dispatchEvent(Ia),Ia.child=null),this}removeFromParent(){const e=this.parent;return e!==null&&e.remove(this),this}clear(){return this.remove(...this.children)}attach(e){return this.updateWorldMatrix(!0,!1),zn.copy(this.matrixWorld).invert(),e.parent!==null&&(e.parent.updateWorldMatrix(!0,!1),zn.multiply(e.parent.matrixWorld)),e.applyMatrix4(zn),e.removeFromParent(),e.parent=this,this.children.push(e),e.updateWorldMatrix(!1,!0),e.dispatchEvent(Sd),cs.child=e,this.dispatchEvent(cs),cs.child=null,this}getObjectById(e){return this.getObjectByProperty("id",e)}getObjectByName(e){return this.getObjectByProperty("name",e)}getObjectByProperty(e,t){if(this[e]===t)return this;for(let i=0,s=this.children.length;i<s;i++){const o=this.children[i].getObjectByProperty(e,t);if(o!==void 0)return o}}getObjectsByProperty(e,t,i=[]){this[e]===t&&i.push(this);const s=this.children;for(let r=0,o=s.length;r<o;r++)s[r].getObjectsByProperty(e,t,i);return i}getWorldPosition(e){return this.updateWorldMatrix(!0,!1),e.setFromMatrixPosition(this.matrixWorld)}getWorldQuaternion(e){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(Ks,e,N_),e}getWorldScale(e){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(Ks,F_,e),e}getWorldDirection(e){this.updateWorldMatrix(!0,!1);const t=this.matrixWorld.elements;return e.set(t[8],t[9],t[10]).normalize()}raycast(){}traverse(e){e(this);const t=this.children;for(let i=0,s=t.length;i<s;i++)t[i].traverse(e)}traverseVisible(e){if(this.visible===!1)return;e(this);const t=this.children;for(let i=0,s=t.length;i<s;i++)t[i].traverseVisible(e)}traverseAncestors(e){const t=this.parent;t!==null&&(e(t),t.traverseAncestors(e))}updateMatrix(){this.matrix.compose(this.position,this.quaternion,this.scale),this.matrixWorldNeedsUpdate=!0}updateMatrixWorld(e){this.matrixAutoUpdate&&this.updateMatrix(),(this.matrixWorldNeedsUpdate||e)&&(this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),this.matrixWorldNeedsUpdate=!1,e=!0);const t=this.children;for(let i=0,s=t.length;i<s;i++)t[i].updateMatrixWorld(e)}updateWorldMatrix(e,t){const i=this.parent;if(e===!0&&i!==null&&i.updateWorldMatrix(!0,!1),this.matrixAutoUpdate&&this.updateMatrix(),this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),t===!0){const s=this.children;for(let r=0,o=s.length;r<o;r++)s[r].updateWorldMatrix(!1,!0)}}toJSON(e){const t=e===void 0||typeof e=="string",i={};t&&(e={geometries:{},materials:{},textures:{},images:{},shapes:{},skeletons:{},animations:{},nodes:{}},i.metadata={version:4.7,type:"Object",generator:"Object3D.toJSON"});const s={};s.uuid=this.uuid,s.type=this.type,this.name!==""&&(s.name=this.name),this.castShadow===!0&&(s.castShadow=!0),this.receiveShadow===!0&&(s.receiveShadow=!0),this.visible===!1&&(s.visible=!1),this.frustumCulled===!1&&(s.frustumCulled=!1),this.renderOrder!==0&&(s.renderOrder=this.renderOrder),Object.keys(this.userData).length>0&&(s.userData=this.userData),s.layers=this.layers.mask,s.matrix=this.matrix.toArray(),s.up=this.up.toArray(),this.matrixAutoUpdate===!1&&(s.matrixAutoUpdate=!1),this.isInstancedMesh&&(s.type="InstancedMesh",s.count=this.count,s.instanceMatrix=this.instanceMatrix.toJSON(),this.instanceColor!==null&&(s.instanceColor=this.instanceColor.toJSON())),this.isBatchedMesh&&(s.type="BatchedMesh",s.perObjectFrustumCulled=this.perObjectFrustumCulled,s.sortObjects=this.sortObjects,s.drawRanges=this._drawRanges,s.reservedRanges=this._reservedRanges,s.geometryInfo=this._geometryInfo.map(a=>({...a,boundingBox:a.boundingBox?a.boundingBox.toJSON():void 0,boundingSphere:a.boundingSphere?a.boundingSphere.toJSON():void 0})),s.instanceInfo=this._instanceInfo.map(a=>({...a})),s.availableInstanceIds=this._availableInstanceIds.slice(),s.availableGeometryIds=this._availableGeometryIds.slice(),s.nextIndexStart=this._nextIndexStart,s.nextVertexStart=this._nextVertexStart,s.geometryCount=this._geometryCount,s.maxInstanceCount=this._maxInstanceCount,s.maxVertexCount=this._maxVertexCount,s.maxIndexCount=this._maxIndexCount,s.geometryInitialized=this._geometryInitialized,s.matricesTexture=this._matricesTexture.toJSON(e),s.indirectTexture=this._indirectTexture.toJSON(e),this._colorsTexture!==null&&(s.colorsTexture=this._colorsTexture.toJSON(e)),this.boundingSphere!==null&&(s.boundingSphere=this.boundingSphere.toJSON()),this.boundingBox!==null&&(s.boundingBox=this.boundingBox.toJSON()));function r(a,l){return a[l.uuid]===void 0&&(a[l.uuid]=l.toJSON(e)),l.uuid}if(this.isScene)this.background&&(this.background.isColor?s.background=this.background.toJSON():this.background.isTexture&&(s.background=this.background.toJSON(e).uuid)),this.environment&&this.environment.isTexture&&this.environment.isRenderTargetTexture!==!0&&(s.environment=this.environment.toJSON(e).uuid);else if(this.isMesh||this.isLine||this.isPoints){s.geometry=r(e.geometries,this.geometry);const a=this.geometry.parameters;if(a!==void 0&&a.shapes!==void 0){const l=a.shapes;if(Array.isArray(l))for(let c=0,u=l.length;c<u;c++){const d=l[c];r(e.shapes,d)}else r(e.shapes,l)}}if(this.isSkinnedMesh&&(s.bindMode=this.bindMode,s.bindMatrix=this.bindMatrix.toArray(),this.skeleton!==void 0&&(r(e.skeletons,this.skeleton),s.skeleton=this.skeleton.uuid)),this.material!==void 0)if(Array.isArray(this.material)){const a=[];for(let l=0,c=this.material.length;l<c;l++)a.push(r(e.materials,this.material[l]));s.material=a}else s.material=r(e.materials,this.material);if(this.children.length>0){s.children=[];for(let a=0;a<this.children.length;a++)s.children.push(this.children[a].toJSON(e).object)}if(this.animations.length>0){s.animations=[];for(let a=0;a<this.animations.length;a++){const l=this.animations[a];s.animations.push(r(e.animations,l))}}if(t){const a=o(e.geometries),l=o(e.materials),c=o(e.textures),u=o(e.images),d=o(e.shapes),h=o(e.skeletons),p=o(e.animations),g=o(e.nodes);a.length>0&&(i.geometries=a),l.length>0&&(i.materials=l),c.length>0&&(i.textures=c),u.length>0&&(i.images=u),d.length>0&&(i.shapes=d),h.length>0&&(i.skeletons=h),p.length>0&&(i.animations=p),g.length>0&&(i.nodes=g)}return i.object=s,i;function o(a){const l=[];for(const c in a){const u=a[c];delete u.metadata,l.push(u)}return l}}clone(e){return new this.constructor().copy(this,e)}copy(e,t=!0){if(this.name=e.name,this.up.copy(e.up),this.position.copy(e.position),this.rotation.order=e.rotation.order,this.quaternion.copy(e.quaternion),this.scale.copy(e.scale),this.matrix.copy(e.matrix),this.matrixWorld.copy(e.matrixWorld),this.matrixAutoUpdate=e.matrixAutoUpdate,this.matrixWorldAutoUpdate=e.matrixWorldAutoUpdate,this.matrixWorldNeedsUpdate=e.matrixWorldNeedsUpdate,this.layers.mask=e.layers.mask,this.visible=e.visible,this.castShadow=e.castShadow,this.receiveShadow=e.receiveShadow,this.frustumCulled=e.frustumCulled,this.renderOrder=e.renderOrder,this.animations=e.animations.slice(),this.userData=JSON.parse(JSON.stringify(e.userData)),t===!0)for(let i=0;i<e.children.length;i++){const s=e.children[i];this.add(s.clone())}return this}}It.DEFAULT_UP=new F(0,1,0);It.DEFAULT_MATRIX_AUTO_UPDATE=!0;It.DEFAULT_MATRIX_WORLD_AUTO_UPDATE=!0;const En=new F,Gn=new F,Ua=new F,Hn=new F,us=new F,ds=new F,Md=new F,Na=new F,Fa=new F,Oa=new F,Ba=new yt,ka=new yt,za=new yt;class _n{constructor(e=new F,t=new F,i=new F){this.a=e,this.b=t,this.c=i}static getNormal(e,t,i,s){s.subVectors(i,t),En.subVectors(e,t),s.cross(En);const r=s.lengthSq();return r>0?s.multiplyScalar(1/Math.sqrt(r)):s.set(0,0,0)}static getBarycoord(e,t,i,s,r){En.subVectors(s,t),Gn.subVectors(i,t),Ua.subVectors(e,t);const o=En.dot(En),a=En.dot(Gn),l=En.dot(Ua),c=Gn.dot(Gn),u=Gn.dot(Ua),d=o*c-a*a;if(d===0)return r.set(0,0,0),null;const h=1/d,p=(c*l-a*u)*h,g=(o*u-a*l)*h;return r.set(1-p-g,g,p)}static containsPoint(e,t,i,s){return this.getBarycoord(e,t,i,s,Hn)===null?!1:Hn.x>=0&&Hn.y>=0&&Hn.x+Hn.y<=1}static getInterpolation(e,t,i,s,r,o,a,l){return this.getBarycoord(e,t,i,s,Hn)===null?(l.x=0,l.y=0,"z"in l&&(l.z=0),"w"in l&&(l.w=0),null):(l.setScalar(0),l.addScaledVector(r,Hn.x),l.addScaledVector(o,Hn.y),l.addScaledVector(a,Hn.z),l)}static getInterpolatedAttribute(e,t,i,s,r,o){return Ba.setScalar(0),ka.setScalar(0),za.setScalar(0),Ba.fromBufferAttribute(e,t),ka.fromBufferAttribute(e,i),za.fromBufferAttribute(e,s),o.setScalar(0),o.addScaledVector(Ba,r.x),o.addScaledVector(ka,r.y),o.addScaledVector(za,r.z),o}static isFrontFacing(e,t,i,s){return En.subVectors(i,t),Gn.subVectors(e,t),En.cross(Gn).dot(s)<0}set(e,t,i){return this.a.copy(e),this.b.copy(t),this.c.copy(i),this}setFromPointsAndIndices(e,t,i,s){return this.a.copy(e[t]),this.b.copy(e[i]),this.c.copy(e[s]),this}setFromAttributeAndIndices(e,t,i,s){return this.a.fromBufferAttribute(e,t),this.b.fromBufferAttribute(e,i),this.c.fromBufferAttribute(e,s),this}clone(){return new this.constructor().copy(this)}copy(e){return this.a.copy(e.a),this.b.copy(e.b),this.c.copy(e.c),this}getArea(){return En.subVectors(this.c,this.b),Gn.subVectors(this.a,this.b),En.cross(Gn).length()*.5}getMidpoint(e){return e.addVectors(this.a,this.b).add(this.c).multiplyScalar(1/3)}getNormal(e){return _n.getNormal(this.a,this.b,this.c,e)}getPlane(e){return e.setFromCoplanarPoints(this.a,this.b,this.c)}getBarycoord(e,t){return _n.getBarycoord(e,this.a,this.b,this.c,t)}getInterpolation(e,t,i,s,r){return _n.getInterpolation(e,this.a,this.b,this.c,t,i,s,r)}containsPoint(e){return _n.containsPoint(e,this.a,this.b,this.c)}isFrontFacing(e){return _n.isFrontFacing(this.a,this.b,this.c,e)}intersectsBox(e){return e.intersectsTriangle(this)}closestPointToPoint(e,t){const i=this.a,s=this.b,r=this.c;let o,a;us.subVectors(s,i),ds.subVectors(r,i),Na.subVectors(e,i);const l=us.dot(Na),c=ds.dot(Na);if(l<=0&&c<=0)return t.copy(i);Fa.subVectors(e,s);const u=us.dot(Fa),d=ds.dot(Fa);if(u>=0&&d<=u)return t.copy(s);const h=l*d-u*c;if(h<=0&&l>=0&&u<=0)return o=l/(l-u),t.copy(i).addScaledVector(us,o);Oa.subVectors(e,r);const p=us.dot(Oa),g=ds.dot(Oa);if(g>=0&&p<=g)return t.copy(r);const _=p*c-l*g;if(_<=0&&c>=0&&g<=0)return a=c/(c-g),t.copy(i).addScaledVector(ds,a);const m=u*g-p*d;if(m<=0&&d-u>=0&&p-g>=0)return Md.subVectors(r,s),a=(d-u)/(d-u+(p-g)),t.copy(s).addScaledVector(Md,a);const f=1/(m+_+h);return o=_*f,a=h*f,t.copy(i).addScaledVector(us,o).addScaledVector(ds,a)}equals(e){return e.a.equals(this.a)&&e.b.equals(this.b)&&e.c.equals(this.c)}}const Kf={aliceblue:15792383,antiquewhite:16444375,aqua:65535,aquamarine:8388564,azure:15794175,beige:16119260,bisque:16770244,black:0,blanchedalmond:16772045,blue:255,blueviolet:9055202,brown:10824234,burlywood:14596231,cadetblue:6266528,chartreuse:8388352,chocolate:13789470,coral:16744272,cornflowerblue:6591981,cornsilk:16775388,crimson:14423100,cyan:65535,darkblue:139,darkcyan:35723,darkgoldenrod:12092939,darkgray:11119017,darkgreen:25600,darkgrey:11119017,darkkhaki:12433259,darkmagenta:9109643,darkolivegreen:5597999,darkorange:16747520,darkorchid:10040012,darkred:9109504,darksalmon:15308410,darkseagreen:9419919,darkslateblue:4734347,darkslategray:3100495,darkslategrey:3100495,darkturquoise:52945,darkviolet:9699539,deeppink:16716947,deepskyblue:49151,dimgray:6908265,dimgrey:6908265,dodgerblue:2003199,firebrick:11674146,floralwhite:16775920,forestgreen:2263842,fuchsia:16711935,gainsboro:14474460,ghostwhite:16316671,gold:16766720,goldenrod:14329120,gray:8421504,green:32768,greenyellow:11403055,grey:8421504,honeydew:15794160,hotpink:16738740,indianred:13458524,indigo:4915330,ivory:16777200,khaki:15787660,lavender:15132410,lavenderblush:16773365,lawngreen:8190976,lemonchiffon:16775885,lightblue:11393254,lightcoral:15761536,lightcyan:14745599,lightgoldenrodyellow:16448210,lightgray:13882323,lightgreen:9498256,lightgrey:13882323,lightpink:16758465,lightsalmon:16752762,lightseagreen:2142890,lightskyblue:8900346,lightslategray:7833753,lightslategrey:7833753,lightsteelblue:11584734,lightyellow:16777184,lime:65280,limegreen:3329330,linen:16445670,magenta:16711935,maroon:8388608,mediumaquamarine:6737322,mediumblue:205,mediumorchid:12211667,mediumpurple:9662683,mediumseagreen:3978097,mediumslateblue:8087790,mediumspringgreen:64154,mediumturquoise:4772300,mediumvioletred:13047173,midnightblue:1644912,mintcream:16121850,mistyrose:16770273,moccasin:16770229,navajowhite:16768685,navy:128,oldlace:16643558,olive:8421376,olivedrab:7048739,orange:16753920,orangered:16729344,orchid:14315734,palegoldenrod:15657130,palegreen:10025880,paleturquoise:11529966,palevioletred:14381203,papayawhip:16773077,peachpuff:16767673,peru:13468991,pink:16761035,plum:14524637,powderblue:11591910,purple:8388736,rebeccapurple:6697881,red:16711680,rosybrown:12357519,royalblue:4286945,saddlebrown:9127187,salmon:16416882,sandybrown:16032864,seagreen:3050327,seashell:16774638,sienna:10506797,silver:12632256,skyblue:8900331,slateblue:6970061,slategray:7372944,slategrey:7372944,snow:16775930,springgreen:65407,steelblue:4620980,tan:13808780,teal:32896,thistle:14204888,tomato:16737095,turquoise:4251856,violet:15631086,wheat:16113331,white:16777215,whitesmoke:16119285,yellow:16776960,yellowgreen:10145074},si={h:0,s:0,l:0},jr={h:0,s:0,l:0};function Ga(n,e,t){return t<0&&(t+=1),t>1&&(t-=1),t<1/6?n+(e-n)*6*t:t<1/2?e:t<2/3?n+(e-n)*6*(2/3-t):n}class Pe{constructor(e,t,i){return this.isColor=!0,this.r=1,this.g=1,this.b=1,this.set(e,t,i)}set(e,t,i){if(t===void 0&&i===void 0){const s=e;s&&s.isColor?this.copy(s):typeof s=="number"?this.setHex(s):typeof s=="string"&&this.setStyle(s)}else this.setRGB(e,t,i);return this}setScalar(e){return this.r=e,this.g=e,this.b=e,this}setHex(e,t=mn){return e=Math.floor(e),this.r=(e>>16&255)/255,this.g=(e>>8&255)/255,this.b=(e&255)/255,it.colorSpaceToWorking(this,t),this}setRGB(e,t,i,s=it.workingColorSpace){return this.r=e,this.g=t,this.b=i,it.colorSpaceToWorking(this,s),this}setHSL(e,t,i,s=it.workingColorSpace){if(e=x_(e,1),t=Je(t,0,1),i=Je(i,0,1),t===0)this.r=this.g=this.b=i;else{const r=i<=.5?i*(1+t):i+t-i*t,o=2*i-r;this.r=Ga(o,r,e+1/3),this.g=Ga(o,r,e),this.b=Ga(o,r,e-1/3)}return it.colorSpaceToWorking(this,s),this}setStyle(e,t=mn){function i(r){r!==void 0&&parseFloat(r)<1&&console.warn("THREE.Color: Alpha component of "+e+" will be ignored.")}let s;if(s=/^(\w+)\(([^\)]*)\)/.exec(e)){let r;const o=s[1],a=s[2];switch(o){case"rgb":case"rgba":if(r=/^\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(a))return i(r[4]),this.setRGB(Math.min(255,parseInt(r[1],10))/255,Math.min(255,parseInt(r[2],10))/255,Math.min(255,parseInt(r[3],10))/255,t);if(r=/^\s*(\d+)\%\s*,\s*(\d+)\%\s*,\s*(\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(a))return i(r[4]),this.setRGB(Math.min(100,parseInt(r[1],10))/100,Math.min(100,parseInt(r[2],10))/100,Math.min(100,parseInt(r[3],10))/100,t);break;case"hsl":case"hsla":if(r=/^\s*(\d*\.?\d+)\s*,\s*(\d*\.?\d+)\%\s*,\s*(\d*\.?\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(a))return i(r[4]),this.setHSL(parseFloat(r[1])/360,parseFloat(r[2])/100,parseFloat(r[3])/100,t);break;default:console.warn("THREE.Color: Unknown color model "+e)}}else if(s=/^\#([A-Fa-f\d]+)$/.exec(e)){const r=s[1],o=r.length;if(o===3)return this.setRGB(parseInt(r.charAt(0),16)/15,parseInt(r.charAt(1),16)/15,parseInt(r.charAt(2),16)/15,t);if(o===6)return this.setHex(parseInt(r,16),t);console.warn("THREE.Color: Invalid hex color "+e)}else if(e&&e.length>0)return this.setColorName(e,t);return this}setColorName(e,t=mn){const i=Kf[e.toLowerCase()];return i!==void 0?this.setHex(i,t):console.warn("THREE.Color: Unknown color "+e),this}clone(){return new this.constructor(this.r,this.g,this.b)}copy(e){return this.r=e.r,this.g=e.g,this.b=e.b,this}copySRGBToLinear(e){return this.r=Kn(e.r),this.g=Kn(e.g),this.b=Kn(e.b),this}copyLinearToSRGB(e){return this.r=As(e.r),this.g=As(e.g),this.b=As(e.b),this}convertSRGBToLinear(){return this.copySRGBToLinear(this),this}convertLinearToSRGB(){return this.copyLinearToSRGB(this),this}getHex(e=mn){return it.workingToColorSpace(Bt.copy(this),e),Math.round(Je(Bt.r*255,0,255))*65536+Math.round(Je(Bt.g*255,0,255))*256+Math.round(Je(Bt.b*255,0,255))}getHexString(e=mn){return("000000"+this.getHex(e).toString(16)).slice(-6)}getHSL(e,t=it.workingColorSpace){it.workingToColorSpace(Bt.copy(this),t);const i=Bt.r,s=Bt.g,r=Bt.b,o=Math.max(i,s,r),a=Math.min(i,s,r);let l,c;const u=(a+o)/2;if(a===o)l=0,c=0;else{const d=o-a;switch(c=u<=.5?d/(o+a):d/(2-o-a),o){case i:l=(s-r)/d+(s<r?6:0);break;case s:l=(r-i)/d+2;break;case r:l=(i-s)/d+4;break}l/=6}return e.h=l,e.s=c,e.l=u,e}getRGB(e,t=it.workingColorSpace){return it.workingToColorSpace(Bt.copy(this),t),e.r=Bt.r,e.g=Bt.g,e.b=Bt.b,e}getStyle(e=mn){it.workingToColorSpace(Bt.copy(this),e);const t=Bt.r,i=Bt.g,s=Bt.b;return e!==mn?`color(${e} ${t.toFixed(3)} ${i.toFixed(3)} ${s.toFixed(3)})`:`rgb(${Math.round(t*255)},${Math.round(i*255)},${Math.round(s*255)})`}offsetHSL(e,t,i){return this.getHSL(si),this.setHSL(si.h+e,si.s+t,si.l+i)}add(e){return this.r+=e.r,this.g+=e.g,this.b+=e.b,this}addColors(e,t){return this.r=e.r+t.r,this.g=e.g+t.g,this.b=e.b+t.b,this}addScalar(e){return this.r+=e,this.g+=e,this.b+=e,this}sub(e){return this.r=Math.max(0,this.r-e.r),this.g=Math.max(0,this.g-e.g),this.b=Math.max(0,this.b-e.b),this}multiply(e){return this.r*=e.r,this.g*=e.g,this.b*=e.b,this}multiplyScalar(e){return this.r*=e,this.g*=e,this.b*=e,this}lerp(e,t){return this.r+=(e.r-this.r)*t,this.g+=(e.g-this.g)*t,this.b+=(e.b-this.b)*t,this}lerpColors(e,t,i){return this.r=e.r+(t.r-e.r)*i,this.g=e.g+(t.g-e.g)*i,this.b=e.b+(t.b-e.b)*i,this}lerpHSL(e,t){this.getHSL(si),e.getHSL(jr);const i=wa(si.h,jr.h,t),s=wa(si.s,jr.s,t),r=wa(si.l,jr.l,t);return this.setHSL(i,s,r),this}setFromVector3(e){return this.r=e.x,this.g=e.y,this.b=e.z,this}applyMatrix3(e){const t=this.r,i=this.g,s=this.b,r=e.elements;return this.r=r[0]*t+r[3]*i+r[6]*s,this.g=r[1]*t+r[4]*i+r[7]*s,this.b=r[2]*t+r[5]*i+r[8]*s,this}equals(e){return e.r===this.r&&e.g===this.g&&e.b===this.b}fromArray(e,t=0){return this.r=e[t],this.g=e[t+1],this.b=e[t+2],this}toArray(e=[],t=0){return e[t]=this.r,e[t+1]=this.g,e[t+2]=this.b,e}fromBufferAttribute(e,t){return this.r=e.getX(t),this.g=e.getY(t),this.b=e.getZ(t),this}toJSON(){return this.getHex()}*[Symbol.iterator](){yield this.r,yield this.g,yield this.b}}const Bt=new Pe;Pe.NAMES=Kf;let B_=0;class Zi extends qi{constructor(){super(),this.isMaterial=!0,Object.defineProperty(this,"id",{value:B_++}),this.uuid=Tr(),this.name="",this.type="Material",this.blending=Es,this.side=Mi,this.vertexColors=!1,this.opacity=1,this.transparent=!1,this.alphaHash=!1,this.blendSrc=vl,this.blendDst=xl,this.blendEquation=Ui,this.blendSrcAlpha=null,this.blendDstAlpha=null,this.blendEquationAlpha=null,this.blendColor=new Pe(0,0,0),this.blendAlpha=0,this.depthFunc=Ds,this.depthTest=!0,this.depthWrite=!0,this.stencilWriteMask=255,this.stencilFunc=ld,this.stencilRef=0,this.stencilFuncMask=255,this.stencilFail=ns,this.stencilZFail=ns,this.stencilZPass=ns,this.stencilWrite=!1,this.clippingPlanes=null,this.clipIntersection=!1,this.clipShadows=!1,this.shadowSide=null,this.colorWrite=!0,this.precision=null,this.polygonOffset=!1,this.polygonOffsetFactor=0,this.polygonOffsetUnits=0,this.dithering=!1,this.alphaToCoverage=!1,this.premultipliedAlpha=!1,this.forceSinglePass=!1,this.allowOverride=!0,this.visible=!0,this.toneMapped=!0,this.userData={},this.version=0,this._alphaTest=0}get alphaTest(){return this._alphaTest}set alphaTest(e){this._alphaTest>0!=e>0&&this.version++,this._alphaTest=e}onBeforeRender(){}onBeforeCompile(){}customProgramCacheKey(){return this.onBeforeCompile.toString()}setValues(e){if(e!==void 0)for(const t in e){const i=e[t];if(i===void 0){console.warn(`THREE.Material: parameter '${t}' has value of undefined.`);continue}const s=this[t];if(s===void 0){console.warn(`THREE.Material: '${t}' is not a property of THREE.${this.type}.`);continue}s&&s.isColor?s.set(i):s&&s.isVector3&&i&&i.isVector3?s.copy(i):this[t]=i}}toJSON(e){const t=e===void 0||typeof e=="string";t&&(e={textures:{},images:{}});const i={metadata:{version:4.7,type:"Material",generator:"Material.toJSON"}};i.uuid=this.uuid,i.type=this.type,this.name!==""&&(i.name=this.name),this.color&&this.color.isColor&&(i.color=this.color.getHex()),this.roughness!==void 0&&(i.roughness=this.roughness),this.metalness!==void 0&&(i.metalness=this.metalness),this.sheen!==void 0&&(i.sheen=this.sheen),this.sheenColor&&this.sheenColor.isColor&&(i.sheenColor=this.sheenColor.getHex()),this.sheenRoughness!==void 0&&(i.sheenRoughness=this.sheenRoughness),this.emissive&&this.emissive.isColor&&(i.emissive=this.emissive.getHex()),this.emissiveIntensity!==void 0&&this.emissiveIntensity!==1&&(i.emissiveIntensity=this.emissiveIntensity),this.specular&&this.specular.isColor&&(i.specular=this.specular.getHex()),this.specularIntensity!==void 0&&(i.specularIntensity=this.specularIntensity),this.specularColor&&this.specularColor.isColor&&(i.specularColor=this.specularColor.getHex()),this.shininess!==void 0&&(i.shininess=this.shininess),this.clearcoat!==void 0&&(i.clearcoat=this.clearcoat),this.clearcoatRoughness!==void 0&&(i.clearcoatRoughness=this.clearcoatRoughness),this.clearcoatMap&&this.clearcoatMap.isTexture&&(i.clearcoatMap=this.clearcoatMap.toJSON(e).uuid),this.clearcoatRoughnessMap&&this.clearcoatRoughnessMap.isTexture&&(i.clearcoatRoughnessMap=this.clearcoatRoughnessMap.toJSON(e).uuid),this.clearcoatNormalMap&&this.clearcoatNormalMap.isTexture&&(i.clearcoatNormalMap=this.clearcoatNormalMap.toJSON(e).uuid,i.clearcoatNormalScale=this.clearcoatNormalScale.toArray()),this.dispersion!==void 0&&(i.dispersion=this.dispersion),this.iridescence!==void 0&&(i.iridescence=this.iridescence),this.iridescenceIOR!==void 0&&(i.iridescenceIOR=this.iridescenceIOR),this.iridescenceThicknessRange!==void 0&&(i.iridescenceThicknessRange=this.iridescenceThicknessRange),this.iridescenceMap&&this.iridescenceMap.isTexture&&(i.iridescenceMap=this.iridescenceMap.toJSON(e).uuid),this.iridescenceThicknessMap&&this.iridescenceThicknessMap.isTexture&&(i.iridescenceThicknessMap=this.iridescenceThicknessMap.toJSON(e).uuid),this.anisotropy!==void 0&&(i.anisotropy=this.anisotropy),this.anisotropyRotation!==void 0&&(i.anisotropyRotation=this.anisotropyRotation),this.anisotropyMap&&this.anisotropyMap.isTexture&&(i.anisotropyMap=this.anisotropyMap.toJSON(e).uuid),this.map&&this.map.isTexture&&(i.map=this.map.toJSON(e).uuid),this.matcap&&this.matcap.isTexture&&(i.matcap=this.matcap.toJSON(e).uuid),this.alphaMap&&this.alphaMap.isTexture&&(i.alphaMap=this.alphaMap.toJSON(e).uuid),this.lightMap&&this.lightMap.isTexture&&(i.lightMap=this.lightMap.toJSON(e).uuid,i.lightMapIntensity=this.lightMapIntensity),this.aoMap&&this.aoMap.isTexture&&(i.aoMap=this.aoMap.toJSON(e).uuid,i.aoMapIntensity=this.aoMapIntensity),this.bumpMap&&this.bumpMap.isTexture&&(i.bumpMap=this.bumpMap.toJSON(e).uuid,i.bumpScale=this.bumpScale),this.normalMap&&this.normalMap.isTexture&&(i.normalMap=this.normalMap.toJSON(e).uuid,i.normalMapType=this.normalMapType,i.normalScale=this.normalScale.toArray()),this.displacementMap&&this.displacementMap.isTexture&&(i.displacementMap=this.displacementMap.toJSON(e).uuid,i.displacementScale=this.displacementScale,i.displacementBias=this.displacementBias),this.roughnessMap&&this.roughnessMap.isTexture&&(i.roughnessMap=this.roughnessMap.toJSON(e).uuid),this.metalnessMap&&this.metalnessMap.isTexture&&(i.metalnessMap=this.metalnessMap.toJSON(e).uuid),this.emissiveMap&&this.emissiveMap.isTexture&&(i.emissiveMap=this.emissiveMap.toJSON(e).uuid),this.specularMap&&this.specularMap.isTexture&&(i.specularMap=this.specularMap.toJSON(e).uuid),this.specularIntensityMap&&this.specularIntensityMap.isTexture&&(i.specularIntensityMap=this.specularIntensityMap.toJSON(e).uuid),this.specularColorMap&&this.specularColorMap.isTexture&&(i.specularColorMap=this.specularColorMap.toJSON(e).uuid),this.envMap&&this.envMap.isTexture&&(i.envMap=this.envMap.toJSON(e).uuid,this.combine!==void 0&&(i.combine=this.combine)),this.envMapRotation!==void 0&&(i.envMapRotation=this.envMapRotation.toArray()),this.envMapIntensity!==void 0&&(i.envMapIntensity=this.envMapIntensity),this.reflectivity!==void 0&&(i.reflectivity=this.reflectivity),this.refractionRatio!==void 0&&(i.refractionRatio=this.refractionRatio),this.gradientMap&&this.gradientMap.isTexture&&(i.gradientMap=this.gradientMap.toJSON(e).uuid),this.transmission!==void 0&&(i.transmission=this.transmission),this.transmissionMap&&this.transmissionMap.isTexture&&(i.transmissionMap=this.transmissionMap.toJSON(e).uuid),this.thickness!==void 0&&(i.thickness=this.thickness),this.thicknessMap&&this.thicknessMap.isTexture&&(i.thicknessMap=this.thicknessMap.toJSON(e).uuid),this.attenuationDistance!==void 0&&this.attenuationDistance!==1/0&&(i.attenuationDistance=this.attenuationDistance),this.attenuationColor!==void 0&&(i.attenuationColor=this.attenuationColor.getHex()),this.size!==void 0&&(i.size=this.size),this.shadowSide!==null&&(i.shadowSide=this.shadowSide),this.sizeAttenuation!==void 0&&(i.sizeAttenuation=this.sizeAttenuation),this.blending!==Es&&(i.blending=this.blending),this.side!==Mi&&(i.side=this.side),this.vertexColors===!0&&(i.vertexColors=!0),this.opacity<1&&(i.opacity=this.opacity),this.transparent===!0&&(i.transparent=!0),this.blendSrc!==vl&&(i.blendSrc=this.blendSrc),this.blendDst!==xl&&(i.blendDst=this.blendDst),this.blendEquation!==Ui&&(i.blendEquation=this.blendEquation),this.blendSrcAlpha!==null&&(i.blendSrcAlpha=this.blendSrcAlpha),this.blendDstAlpha!==null&&(i.blendDstAlpha=this.blendDstAlpha),this.blendEquationAlpha!==null&&(i.blendEquationAlpha=this.blendEquationAlpha),this.blendColor&&this.blendColor.isColor&&(i.blendColor=this.blendColor.getHex()),this.blendAlpha!==0&&(i.blendAlpha=this.blendAlpha),this.depthFunc!==Ds&&(i.depthFunc=this.depthFunc),this.depthTest===!1&&(i.depthTest=this.depthTest),this.depthWrite===!1&&(i.depthWrite=this.depthWrite),this.colorWrite===!1&&(i.colorWrite=this.colorWrite),this.stencilWriteMask!==255&&(i.stencilWriteMask=this.stencilWriteMask),this.stencilFunc!==ld&&(i.stencilFunc=this.stencilFunc),this.stencilRef!==0&&(i.stencilRef=this.stencilRef),this.stencilFuncMask!==255&&(i.stencilFuncMask=this.stencilFuncMask),this.stencilFail!==ns&&(i.stencilFail=this.stencilFail),this.stencilZFail!==ns&&(i.stencilZFail=this.stencilZFail),this.stencilZPass!==ns&&(i.stencilZPass=this.stencilZPass),this.stencilWrite===!0&&(i.stencilWrite=this.stencilWrite),this.rotation!==void 0&&this.rotation!==0&&(i.rotation=this.rotation),this.polygonOffset===!0&&(i.polygonOffset=!0),this.polygonOffsetFactor!==0&&(i.polygonOffsetFactor=this.polygonOffsetFactor),this.polygonOffsetUnits!==0&&(i.polygonOffsetUnits=this.polygonOffsetUnits),this.linewidth!==void 0&&this.linewidth!==1&&(i.linewidth=this.linewidth),this.dashSize!==void 0&&(i.dashSize=this.dashSize),this.gapSize!==void 0&&(i.gapSize=this.gapSize),this.scale!==void 0&&(i.scale=this.scale),this.dithering===!0&&(i.dithering=!0),this.alphaTest>0&&(i.alphaTest=this.alphaTest),this.alphaHash===!0&&(i.alphaHash=!0),this.alphaToCoverage===!0&&(i.alphaToCoverage=!0),this.premultipliedAlpha===!0&&(i.premultipliedAlpha=!0),this.forceSinglePass===!0&&(i.forceSinglePass=!0),this.wireframe===!0&&(i.wireframe=!0),this.wireframeLinewidth>1&&(i.wireframeLinewidth=this.wireframeLinewidth),this.wireframeLinecap!=="round"&&(i.wireframeLinecap=this.wireframeLinecap),this.wireframeLinejoin!=="round"&&(i.wireframeLinejoin=this.wireframeLinejoin),this.flatShading===!0&&(i.flatShading=!0),this.visible===!1&&(i.visible=!1),this.toneMapped===!1&&(i.toneMapped=!1),this.fog===!1&&(i.fog=!1),Object.keys(this.userData).length>0&&(i.userData=this.userData);function s(r){const o=[];for(const a in r){const l=r[a];delete l.metadata,o.push(l)}return o}if(t){const r=s(e.textures),o=s(e.images);r.length>0&&(i.textures=r),o.length>0&&(i.images=o)}return i}clone(){return new this.constructor().copy(this)}copy(e){this.name=e.name,this.blending=e.blending,this.side=e.side,this.vertexColors=e.vertexColors,this.opacity=e.opacity,this.transparent=e.transparent,this.blendSrc=e.blendSrc,this.blendDst=e.blendDst,this.blendEquation=e.blendEquation,this.blendSrcAlpha=e.blendSrcAlpha,this.blendDstAlpha=e.blendDstAlpha,this.blendEquationAlpha=e.blendEquationAlpha,this.blendColor.copy(e.blendColor),this.blendAlpha=e.blendAlpha,this.depthFunc=e.depthFunc,this.depthTest=e.depthTest,this.depthWrite=e.depthWrite,this.stencilWriteMask=e.stencilWriteMask,this.stencilFunc=e.stencilFunc,this.stencilRef=e.stencilRef,this.stencilFuncMask=e.stencilFuncMask,this.stencilFail=e.stencilFail,this.stencilZFail=e.stencilZFail,this.stencilZPass=e.stencilZPass,this.stencilWrite=e.stencilWrite;const t=e.clippingPlanes;let i=null;if(t!==null){const s=t.length;i=new Array(s);for(let r=0;r!==s;++r)i[r]=t[r].clone()}return this.clippingPlanes=i,this.clipIntersection=e.clipIntersection,this.clipShadows=e.clipShadows,this.shadowSide=e.shadowSide,this.colorWrite=e.colorWrite,this.precision=e.precision,this.polygonOffset=e.polygonOffset,this.polygonOffsetFactor=e.polygonOffsetFactor,this.polygonOffsetUnits=e.polygonOffsetUnits,this.dithering=e.dithering,this.alphaTest=e.alphaTest,this.alphaHash=e.alphaHash,this.alphaToCoverage=e.alphaToCoverage,this.premultipliedAlpha=e.premultipliedAlpha,this.forceSinglePass=e.forceSinglePass,this.visible=e.visible,this.toneMapped=e.toneMapped,this.userData=JSON.parse(JSON.stringify(e.userData)),this}dispose(){this.dispatchEvent({type:"dispose"})}set needsUpdate(e){e===!0&&this.version++}}class sa extends Zi{constructor(e){super(),this.isMeshBasicMaterial=!0,this.type="MeshBasicMaterial",this.color=new Pe(16777215),this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.specularMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new Fn,this.combine=Yc,this.reflectivity=1,this.refractionRatio=.98,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.lightMap=e.lightMap,this.lightMapIntensity=e.lightMapIntensity,this.aoMap=e.aoMap,this.aoMapIntensity=e.aoMapIntensity,this.specularMap=e.specularMap,this.alphaMap=e.alphaMap,this.envMap=e.envMap,this.envMapRotation.copy(e.envMapRotation),this.combine=e.combine,this.reflectivity=e.reflectivity,this.refractionRatio=e.refractionRatio,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.wireframeLinecap=e.wireframeLinecap,this.wireframeLinejoin=e.wireframeLinejoin,this.fog=e.fog,this}}const Mt=new F,Kr=new Ve;let k_=0;class Ut{constructor(e,t,i=!1){if(Array.isArray(e))throw new TypeError("THREE.BufferAttribute: array should be a Typed Array.");this.isBufferAttribute=!0,Object.defineProperty(this,"id",{value:k_++}),this.name="",this.array=e,this.itemSize=t,this.count=e!==void 0?e.length/t:0,this.normalized=i,this.usage=cd,this.updateRanges=[],this.gpuType=Pn,this.version=0}onUploadCallback(){}set needsUpdate(e){e===!0&&this.version++}setUsage(e){return this.usage=e,this}addUpdateRange(e,t){this.updateRanges.push({start:e,count:t})}clearUpdateRanges(){this.updateRanges.length=0}copy(e){return this.name=e.name,this.array=new e.array.constructor(e.array),this.itemSize=e.itemSize,this.count=e.count,this.normalized=e.normalized,this.usage=e.usage,this.gpuType=e.gpuType,this}copyAt(e,t,i){e*=this.itemSize,i*=t.itemSize;for(let s=0,r=this.itemSize;s<r;s++)this.array[e+s]=t.array[i+s];return this}copyArray(e){return this.array.set(e),this}applyMatrix3(e){if(this.itemSize===2)for(let t=0,i=this.count;t<i;t++)Kr.fromBufferAttribute(this,t),Kr.applyMatrix3(e),this.setXY(t,Kr.x,Kr.y);else if(this.itemSize===3)for(let t=0,i=this.count;t<i;t++)Mt.fromBufferAttribute(this,t),Mt.applyMatrix3(e),this.setXYZ(t,Mt.x,Mt.y,Mt.z);return this}applyMatrix4(e){for(let t=0,i=this.count;t<i;t++)Mt.fromBufferAttribute(this,t),Mt.applyMatrix4(e),this.setXYZ(t,Mt.x,Mt.y,Mt.z);return this}applyNormalMatrix(e){for(let t=0,i=this.count;t<i;t++)Mt.fromBufferAttribute(this,t),Mt.applyNormalMatrix(e),this.setXYZ(t,Mt.x,Mt.y,Mt.z);return this}transformDirection(e){for(let t=0,i=this.count;t<i;t++)Mt.fromBufferAttribute(this,t),Mt.transformDirection(e),this.setXYZ(t,Mt.x,Mt.y,Mt.z);return this}set(e,t=0){return this.array.set(e,t),this}getComponent(e,t){let i=this.array[e*this.itemSize+t];return this.normalized&&(i=Ys(i,this.array)),i}setComponent(e,t,i){return this.normalized&&(i=qt(i,this.array)),this.array[e*this.itemSize+t]=i,this}getX(e){let t=this.array[e*this.itemSize];return this.normalized&&(t=Ys(t,this.array)),t}setX(e,t){return this.normalized&&(t=qt(t,this.array)),this.array[e*this.itemSize]=t,this}getY(e){let t=this.array[e*this.itemSize+1];return this.normalized&&(t=Ys(t,this.array)),t}setY(e,t){return this.normalized&&(t=qt(t,this.array)),this.array[e*this.itemSize+1]=t,this}getZ(e){let t=this.array[e*this.itemSize+2];return this.normalized&&(t=Ys(t,this.array)),t}setZ(e,t){return this.normalized&&(t=qt(t,this.array)),this.array[e*this.itemSize+2]=t,this}getW(e){let t=this.array[e*this.itemSize+3];return this.normalized&&(t=Ys(t,this.array)),t}setW(e,t){return this.normalized&&(t=qt(t,this.array)),this.array[e*this.itemSize+3]=t,this}setXY(e,t,i){return e*=this.itemSize,this.normalized&&(t=qt(t,this.array),i=qt(i,this.array)),this.array[e+0]=t,this.array[e+1]=i,this}setXYZ(e,t,i,s){return e*=this.itemSize,this.normalized&&(t=qt(t,this.array),i=qt(i,this.array),s=qt(s,this.array)),this.array[e+0]=t,this.array[e+1]=i,this.array[e+2]=s,this}setXYZW(e,t,i,s,r){return e*=this.itemSize,this.normalized&&(t=qt(t,this.array),i=qt(i,this.array),s=qt(s,this.array),r=qt(r,this.array)),this.array[e+0]=t,this.array[e+1]=i,this.array[e+2]=s,this.array[e+3]=r,this}onUpload(e){return this.onUploadCallback=e,this}clone(){return new this.constructor(this.array,this.itemSize).copy(this)}toJSON(){const e={itemSize:this.itemSize,type:this.array.constructor.name,array:Array.from(this.array),normalized:this.normalized};return this.name!==""&&(e.name=this.name),this.usage!==cd&&(e.usage=this.usage),e}}class Zf extends Ut{constructor(e,t,i){super(new Uint16Array(e),t,i)}}class Jf extends Ut{constructor(e,t,i){super(new Uint32Array(e),t,i)}}class an extends Ut{constructor(e,t,i){super(new Float32Array(e),t,i)}}let z_=0;const fn=new rt,Ha=new It,hs=new F,nn=new ji,Zs=new ji,Lt=new F;class Ft extends qi{constructor(){super(),this.isBufferGeometry=!0,Object.defineProperty(this,"id",{value:z_++}),this.uuid=Tr(),this.name="",this.type="BufferGeometry",this.index=null,this.indirect=null,this.attributes={},this.morphAttributes={},this.morphTargetsRelative=!1,this.groups=[],this.boundingBox=null,this.boundingSphere=null,this.drawRange={start:0,count:1/0},this.userData={}}getIndex(){return this.index}setIndex(e){return Array.isArray(e)?this.index=new(qf(e)?Jf:Zf)(e,1):this.index=e,this}setIndirect(e){return this.indirect=e,this}getIndirect(){return this.indirect}getAttribute(e){return this.attributes[e]}setAttribute(e,t){return this.attributes[e]=t,this}deleteAttribute(e){return delete this.attributes[e],this}hasAttribute(e){return this.attributes[e]!==void 0}addGroup(e,t,i=0){this.groups.push({start:e,count:t,materialIndex:i})}clearGroups(){this.groups=[]}setDrawRange(e,t){this.drawRange.start=e,this.drawRange.count=t}applyMatrix4(e){const t=this.attributes.position;t!==void 0&&(t.applyMatrix4(e),t.needsUpdate=!0);const i=this.attributes.normal;if(i!==void 0){const r=new Ye().getNormalMatrix(e);i.applyNormalMatrix(r),i.needsUpdate=!0}const s=this.attributes.tangent;return s!==void 0&&(s.transformDirection(e),s.needsUpdate=!0),this.boundingBox!==null&&this.computeBoundingBox(),this.boundingSphere!==null&&this.computeBoundingSphere(),this}applyQuaternion(e){return fn.makeRotationFromQuaternion(e),this.applyMatrix4(fn),this}rotateX(e){return fn.makeRotationX(e),this.applyMatrix4(fn),this}rotateY(e){return fn.makeRotationY(e),this.applyMatrix4(fn),this}rotateZ(e){return fn.makeRotationZ(e),this.applyMatrix4(fn),this}translate(e,t,i){return fn.makeTranslation(e,t,i),this.applyMatrix4(fn),this}scale(e,t,i){return fn.makeScale(e,t,i),this.applyMatrix4(fn),this}lookAt(e){return Ha.lookAt(e),Ha.updateMatrix(),this.applyMatrix4(Ha.matrix),this}center(){return this.computeBoundingBox(),this.boundingBox.getCenter(hs).negate(),this.translate(hs.x,hs.y,hs.z),this}setFromPoints(e){const t=this.getAttribute("position");if(t===void 0){const i=[];for(let s=0,r=e.length;s<r;s++){const o=e[s];i.push(o.x,o.y,o.z||0)}this.setAttribute("position",new an(i,3))}else{const i=Math.min(e.length,t.count);for(let s=0;s<i;s++){const r=e[s];t.setXYZ(s,r.x,r.y,r.z||0)}e.length>t.count&&console.warn("THREE.BufferGeometry: Buffer size too small for points data. Use .dispose() and create a new geometry."),t.needsUpdate=!0}return this}computeBoundingBox(){this.boundingBox===null&&(this.boundingBox=new ji);const e=this.attributes.position,t=this.morphAttributes.position;if(e&&e.isGLBufferAttribute){console.error("THREE.BufferGeometry.computeBoundingBox(): GLBufferAttribute requires a manual bounding box.",this),this.boundingBox.set(new F(-1/0,-1/0,-1/0),new F(1/0,1/0,1/0));return}if(e!==void 0){if(this.boundingBox.setFromBufferAttribute(e),t)for(let i=0,s=t.length;i<s;i++){const r=t[i];nn.setFromBufferAttribute(r),this.morphTargetsRelative?(Lt.addVectors(this.boundingBox.min,nn.min),this.boundingBox.expandByPoint(Lt),Lt.addVectors(this.boundingBox.max,nn.max),this.boundingBox.expandByPoint(Lt)):(this.boundingBox.expandByPoint(nn.min),this.boundingBox.expandByPoint(nn.max))}}else this.boundingBox.makeEmpty();(isNaN(this.boundingBox.min.x)||isNaN(this.boundingBox.min.y)||isNaN(this.boundingBox.min.z))&&console.error('THREE.BufferGeometry.computeBoundingBox(): Computed min/max have NaN values. The "position" attribute is likely to have NaN values.',this)}computeBoundingSphere(){this.boundingSphere===null&&(this.boundingSphere=new Ki);const e=this.attributes.position,t=this.morphAttributes.position;if(e&&e.isGLBufferAttribute){console.error("THREE.BufferGeometry.computeBoundingSphere(): GLBufferAttribute requires a manual bounding sphere.",this),this.boundingSphere.set(new F,1/0);return}if(e){const i=this.boundingSphere.center;if(nn.setFromBufferAttribute(e),t)for(let r=0,o=t.length;r<o;r++){const a=t[r];Zs.setFromBufferAttribute(a),this.morphTargetsRelative?(Lt.addVectors(nn.min,Zs.min),nn.expandByPoint(Lt),Lt.addVectors(nn.max,Zs.max),nn.expandByPoint(Lt)):(nn.expandByPoint(Zs.min),nn.expandByPoint(Zs.max))}nn.getCenter(i);let s=0;for(let r=0,o=e.count;r<o;r++)Lt.fromBufferAttribute(e,r),s=Math.max(s,i.distanceToSquared(Lt));if(t)for(let r=0,o=t.length;r<o;r++){const a=t[r],l=this.morphTargetsRelative;for(let c=0,u=a.count;c<u;c++)Lt.fromBufferAttribute(a,c),l&&(hs.fromBufferAttribute(e,c),Lt.add(hs)),s=Math.max(s,i.distanceToSquared(Lt))}this.boundingSphere.radius=Math.sqrt(s),isNaN(this.boundingSphere.radius)&&console.error('THREE.BufferGeometry.computeBoundingSphere(): Computed radius is NaN. The "position" attribute is likely to have NaN values.',this)}}computeTangents(){const e=this.index,t=this.attributes;if(e===null||t.position===void 0||t.normal===void 0||t.uv===void 0){console.error("THREE.BufferGeometry: .computeTangents() failed. Missing required attributes (index, position, normal or uv)");return}const i=t.position,s=t.normal,r=t.uv;this.hasAttribute("tangent")===!1&&this.setAttribute("tangent",new Ut(new Float32Array(4*i.count),4));const o=this.getAttribute("tangent"),a=[],l=[];for(let R=0;R<i.count;R++)a[R]=new F,l[R]=new F;const c=new F,u=new F,d=new F,h=new Ve,p=new Ve,g=new Ve,_=new F,m=new F;function f(R,S,y){c.fromBufferAttribute(i,R),u.fromBufferAttribute(i,S),d.fromBufferAttribute(i,y),h.fromBufferAttribute(r,R),p.fromBufferAttribute(r,S),g.fromBufferAttribute(r,y),u.sub(c),d.sub(c),p.sub(h),g.sub(h);const D=1/(p.x*g.y-g.x*p.y);isFinite(D)&&(_.copy(u).multiplyScalar(g.y).addScaledVector(d,-p.y).multiplyScalar(D),m.copy(d).multiplyScalar(p.x).addScaledVector(u,-g.x).multiplyScalar(D),a[R].add(_),a[S].add(_),a[y].add(_),l[R].add(m),l[S].add(m),l[y].add(m))}let M=this.groups;M.length===0&&(M=[{start:0,count:e.count}]);for(let R=0,S=M.length;R<S;++R){const y=M[R],D=y.start,$=y.count;for(let k=D,q=D+$;k<q;k+=3)f(e.getX(k+0),e.getX(k+1),e.getX(k+2))}const b=new F,E=new F,L=new F,T=new F;function A(R){L.fromBufferAttribute(s,R),T.copy(L);const S=a[R];b.copy(S),b.sub(L.multiplyScalar(L.dot(S))).normalize(),E.crossVectors(T,S);const D=E.dot(l[R])<0?-1:1;o.setXYZW(R,b.x,b.y,b.z,D)}for(let R=0,S=M.length;R<S;++R){const y=M[R],D=y.start,$=y.count;for(let k=D,q=D+$;k<q;k+=3)A(e.getX(k+0)),A(e.getX(k+1)),A(e.getX(k+2))}}computeVertexNormals(){const e=this.index,t=this.getAttribute("position");if(t!==void 0){let i=this.getAttribute("normal");if(i===void 0)i=new Ut(new Float32Array(t.count*3),3),this.setAttribute("normal",i);else for(let h=0,p=i.count;h<p;h++)i.setXYZ(h,0,0,0);const s=new F,r=new F,o=new F,a=new F,l=new F,c=new F,u=new F,d=new F;if(e)for(let h=0,p=e.count;h<p;h+=3){const g=e.getX(h+0),_=e.getX(h+1),m=e.getX(h+2);s.fromBufferAttribute(t,g),r.fromBufferAttribute(t,_),o.fromBufferAttribute(t,m),u.subVectors(o,r),d.subVectors(s,r),u.cross(d),a.fromBufferAttribute(i,g),l.fromBufferAttribute(i,_),c.fromBufferAttribute(i,m),a.add(u),l.add(u),c.add(u),i.setXYZ(g,a.x,a.y,a.z),i.setXYZ(_,l.x,l.y,l.z),i.setXYZ(m,c.x,c.y,c.z)}else for(let h=0,p=t.count;h<p;h+=3)s.fromBufferAttribute(t,h+0),r.fromBufferAttribute(t,h+1),o.fromBufferAttribute(t,h+2),u.subVectors(o,r),d.subVectors(s,r),u.cross(d),i.setXYZ(h+0,u.x,u.y,u.z),i.setXYZ(h+1,u.x,u.y,u.z),i.setXYZ(h+2,u.x,u.y,u.z);this.normalizeNormals(),i.needsUpdate=!0}}normalizeNormals(){const e=this.attributes.normal;for(let t=0,i=e.count;t<i;t++)Lt.fromBufferAttribute(e,t),Lt.normalize(),e.setXYZ(t,Lt.x,Lt.y,Lt.z)}toNonIndexed(){function e(a,l){const c=a.array,u=a.itemSize,d=a.normalized,h=new c.constructor(l.length*u);let p=0,g=0;for(let _=0,m=l.length;_<m;_++){a.isInterleavedBufferAttribute?p=l[_]*a.data.stride+a.offset:p=l[_]*u;for(let f=0;f<u;f++)h[g++]=c[p++]}return new Ut(h,u,d)}if(this.index===null)return console.warn("THREE.BufferGeometry.toNonIndexed(): BufferGeometry is already non-indexed."),this;const t=new Ft,i=this.index.array,s=this.attributes;for(const a in s){const l=s[a],c=e(l,i);t.setAttribute(a,c)}const r=this.morphAttributes;for(const a in r){const l=[],c=r[a];for(let u=0,d=c.length;u<d;u++){const h=c[u],p=e(h,i);l.push(p)}t.morphAttributes[a]=l}t.morphTargetsRelative=this.morphTargetsRelative;const o=this.groups;for(let a=0,l=o.length;a<l;a++){const c=o[a];t.addGroup(c.start,c.count,c.materialIndex)}return t}toJSON(){const e={metadata:{version:4.7,type:"BufferGeometry",generator:"BufferGeometry.toJSON"}};if(e.uuid=this.uuid,e.type=this.type,this.name!==""&&(e.name=this.name),Object.keys(this.userData).length>0&&(e.userData=this.userData),this.parameters!==void 0){const l=this.parameters;for(const c in l)l[c]!==void 0&&(e[c]=l[c]);return e}e.data={attributes:{}};const t=this.index;t!==null&&(e.data.index={type:t.array.constructor.name,array:Array.prototype.slice.call(t.array)});const i=this.attributes;for(const l in i){const c=i[l];e.data.attributes[l]=c.toJSON(e.data)}const s={};let r=!1;for(const l in this.morphAttributes){const c=this.morphAttributes[l],u=[];for(let d=0,h=c.length;d<h;d++){const p=c[d];u.push(p.toJSON(e.data))}u.length>0&&(s[l]=u,r=!0)}r&&(e.data.morphAttributes=s,e.data.morphTargetsRelative=this.morphTargetsRelative);const o=this.groups;o.length>0&&(e.data.groups=JSON.parse(JSON.stringify(o)));const a=this.boundingSphere;return a!==null&&(e.data.boundingSphere=a.toJSON()),e}clone(){return new this.constructor().copy(this)}copy(e){this.index=null,this.attributes={},this.morphAttributes={},this.groups=[],this.boundingBox=null,this.boundingSphere=null;const t={};this.name=e.name;const i=e.index;i!==null&&this.setIndex(i.clone());const s=e.attributes;for(const c in s){const u=s[c];this.setAttribute(c,u.clone(t))}const r=e.morphAttributes;for(const c in r){const u=[],d=r[c];for(let h=0,p=d.length;h<p;h++)u.push(d[h].clone(t));this.morphAttributes[c]=u}this.morphTargetsRelative=e.morphTargetsRelative;const o=e.groups;for(let c=0,u=o.length;c<u;c++){const d=o[c];this.addGroup(d.start,d.count,d.materialIndex)}const a=e.boundingBox;a!==null&&(this.boundingBox=a.clone());const l=e.boundingSphere;return l!==null&&(this.boundingSphere=l.clone()),this.drawRange.start=e.drawRange.start,this.drawRange.count=e.drawRange.count,this.userData=e.userData,this}dispose(){this.dispatchEvent({type:"dispose"})}}const wd=new rt,Ci=new Ar,Zr=new Ki,bd=new F,Jr=new F,Qr=new F,eo=new F,Va=new F,to=new F,Ed=new F,no=new F;class vn extends It{constructor(e=new Ft,t=new sa){super(),this.isMesh=!0,this.type="Mesh",this.geometry=e,this.material=t,this.morphTargetDictionary=void 0,this.morphTargetInfluences=void 0,this.count=1,this.updateMorphTargets()}copy(e,t){return super.copy(e,t),e.morphTargetInfluences!==void 0&&(this.morphTargetInfluences=e.morphTargetInfluences.slice()),e.morphTargetDictionary!==void 0&&(this.morphTargetDictionary=Object.assign({},e.morphTargetDictionary)),this.material=Array.isArray(e.material)?e.material.slice():e.material,this.geometry=e.geometry,this}updateMorphTargets(){const t=this.geometry.morphAttributes,i=Object.keys(t);if(i.length>0){const s=t[i[0]];if(s!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let r=0,o=s.length;r<o;r++){const a=s[r].name||String(r);this.morphTargetInfluences.push(0),this.morphTargetDictionary[a]=r}}}}getVertexPosition(e,t){const i=this.geometry,s=i.attributes.position,r=i.morphAttributes.position,o=i.morphTargetsRelative;t.fromBufferAttribute(s,e);const a=this.morphTargetInfluences;if(r&&a){to.set(0,0,0);for(let l=0,c=r.length;l<c;l++){const u=a[l],d=r[l];u!==0&&(Va.fromBufferAttribute(d,e),o?to.addScaledVector(Va,u):to.addScaledVector(Va.sub(t),u))}t.add(to)}return t}raycast(e,t){const i=this.geometry,s=this.material,r=this.matrixWorld;s!==void 0&&(i.boundingSphere===null&&i.computeBoundingSphere(),Zr.copy(i.boundingSphere),Zr.applyMatrix4(r),Ci.copy(e.ray).recast(e.near),!(Zr.containsPoint(Ci.origin)===!1&&(Ci.intersectSphere(Zr,bd)===null||Ci.origin.distanceToSquared(bd)>(e.far-e.near)**2))&&(wd.copy(r).invert(),Ci.copy(e.ray).applyMatrix4(wd),!(i.boundingBox!==null&&Ci.intersectsBox(i.boundingBox)===!1)&&this._computeIntersections(e,t,Ci)))}_computeIntersections(e,t,i){let s;const r=this.geometry,o=this.material,a=r.index,l=r.attributes.position,c=r.attributes.uv,u=r.attributes.uv1,d=r.attributes.normal,h=r.groups,p=r.drawRange;if(a!==null)if(Array.isArray(o))for(let g=0,_=h.length;g<_;g++){const m=h[g],f=o[m.materialIndex],M=Math.max(m.start,p.start),b=Math.min(a.count,Math.min(m.start+m.count,p.start+p.count));for(let E=M,L=b;E<L;E+=3){const T=a.getX(E),A=a.getX(E+1),R=a.getX(E+2);s=io(this,f,e,i,c,u,d,T,A,R),s&&(s.faceIndex=Math.floor(E/3),s.face.materialIndex=m.materialIndex,t.push(s))}}else{const g=Math.max(0,p.start),_=Math.min(a.count,p.start+p.count);for(let m=g,f=_;m<f;m+=3){const M=a.getX(m),b=a.getX(m+1),E=a.getX(m+2);s=io(this,o,e,i,c,u,d,M,b,E),s&&(s.faceIndex=Math.floor(m/3),t.push(s))}}else if(l!==void 0)if(Array.isArray(o))for(let g=0,_=h.length;g<_;g++){const m=h[g],f=o[m.materialIndex],M=Math.max(m.start,p.start),b=Math.min(l.count,Math.min(m.start+m.count,p.start+p.count));for(let E=M,L=b;E<L;E+=3){const T=E,A=E+1,R=E+2;s=io(this,f,e,i,c,u,d,T,A,R),s&&(s.faceIndex=Math.floor(E/3),s.face.materialIndex=m.materialIndex,t.push(s))}}else{const g=Math.max(0,p.start),_=Math.min(l.count,p.start+p.count);for(let m=g,f=_;m<f;m+=3){const M=m,b=m+1,E=m+2;s=io(this,o,e,i,c,u,d,M,b,E),s&&(s.faceIndex=Math.floor(m/3),t.push(s))}}}}function G_(n,e,t,i,s,r,o,a){let l;if(e.side===Zt?l=i.intersectTriangle(o,r,s,!0,a):l=i.intersectTriangle(s,r,o,e.side===Mi,a),l===null)return null;no.copy(a),no.applyMatrix4(n.matrixWorld);const c=t.ray.origin.distanceTo(no);return c<t.near||c>t.far?null:{distance:c,point:no.clone(),object:n}}function io(n,e,t,i,s,r,o,a,l,c){n.getVertexPosition(a,Jr),n.getVertexPosition(l,Qr),n.getVertexPosition(c,eo);const u=G_(n,e,t,i,Jr,Qr,eo,Ed);if(u){const d=new F;_n.getBarycoord(Ed,Jr,Qr,eo,d),s&&(u.uv=_n.getInterpolatedAttribute(s,a,l,c,d,new Ve)),r&&(u.uv1=_n.getInterpolatedAttribute(r,a,l,c,d,new Ve)),o&&(u.normal=_n.getInterpolatedAttribute(o,a,l,c,d,new F),u.normal.dot(i.direction)>0&&u.normal.multiplyScalar(-1));const h={a,b:l,c,normal:new F,materialIndex:0};_n.getNormal(Jr,Qr,eo,h.normal),u.face=h,u.barycoord=d}return u}class rn extends Ft{constructor(e=1,t=1,i=1,s=1,r=1,o=1){super(),this.type="BoxGeometry",this.parameters={width:e,height:t,depth:i,widthSegments:s,heightSegments:r,depthSegments:o};const a=this;s=Math.floor(s),r=Math.floor(r),o=Math.floor(o);const l=[],c=[],u=[],d=[];let h=0,p=0;g("z","y","x",-1,-1,i,t,e,o,r,0),g("z","y","x",1,-1,i,t,-e,o,r,1),g("x","z","y",1,1,e,i,t,s,o,2),g("x","z","y",1,-1,e,i,-t,s,o,3),g("x","y","z",1,-1,e,t,i,s,r,4),g("x","y","z",-1,-1,e,t,-i,s,r,5),this.setIndex(l),this.setAttribute("position",new an(c,3)),this.setAttribute("normal",new an(u,3)),this.setAttribute("uv",new an(d,2));function g(_,m,f,M,b,E,L,T,A,R,S){const y=E/A,D=L/R,$=E/2,k=L/2,q=T/2,Z=A+1,V=R+1;let ie=0,H=0;const oe=new F;for(let me=0;me<V;me++){const Te=me*D-k;for(let $e=0;$e<Z;$e++){const je=$e*y-$;oe[_]=je*M,oe[m]=Te*b,oe[f]=q,c.push(oe.x,oe.y,oe.z),oe[_]=0,oe[m]=0,oe[f]=T>0?1:-1,u.push(oe.x,oe.y,oe.z),d.push($e/A),d.push(1-me/R),ie+=1}}for(let me=0;me<R;me++)for(let Te=0;Te<A;Te++){const $e=h+Te+Z*me,je=h+Te+Z*(me+1),X=h+(Te+1)+Z*(me+1),ae=h+(Te+1)+Z*me;l.push($e,je,ae),l.push(je,X,ae),H+=6}a.addGroup(p,H,S),p+=H,h+=ie}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new rn(e.width,e.height,e.depth,e.widthSegments,e.heightSegments,e.depthSegments)}}function Fs(n){const e={};for(const t in n){e[t]={};for(const i in n[t]){const s=n[t][i];s&&(s.isColor||s.isMatrix3||s.isMatrix4||s.isVector2||s.isVector3||s.isVector4||s.isTexture||s.isQuaternion)?s.isRenderTargetTexture?(console.warn("UniformsUtils: Textures of render targets cannot be cloned via cloneUniforms() or mergeUniforms()."),e[t][i]=null):e[t][i]=s.clone():Array.isArray(s)?e[t][i]=s.slice():e[t][i]=s}}return e}function Gt(n){const e={};for(let t=0;t<n.length;t++){const i=Fs(n[t]);for(const s in i)e[s]=i[s]}return e}function H_(n){const e=[];for(let t=0;t<n.length;t++)e.push(n[t].clone());return e}function Qf(n){const e=n.getRenderTarget();return e===null?n.outputColorSpace:e.isXRRenderTarget===!0?e.texture.colorSpace:it.workingColorSpace}const V_={clone:Fs,merge:Gt};var $_=`void main() {
	gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
}`,W_=`void main() {
	gl_FragColor = vec4( 1.0, 0.0, 0.0, 1.0 );
}`;class wi extends Zi{constructor(e){super(),this.isShaderMaterial=!0,this.type="ShaderMaterial",this.defines={},this.uniforms={},this.uniformsGroups=[],this.vertexShader=$_,this.fragmentShader=W_,this.linewidth=1,this.wireframe=!1,this.wireframeLinewidth=1,this.fog=!1,this.lights=!1,this.clipping=!1,this.forceSinglePass=!0,this.extensions={clipCullDistance:!1,multiDraw:!1},this.defaultAttributeValues={color:[1,1,1],uv:[0,0],uv1:[0,0]},this.index0AttributeName=void 0,this.uniformsNeedUpdate=!1,this.glslVersion=null,e!==void 0&&this.setValues(e)}copy(e){return super.copy(e),this.fragmentShader=e.fragmentShader,this.vertexShader=e.vertexShader,this.uniforms=Fs(e.uniforms),this.uniformsGroups=H_(e.uniformsGroups),this.defines=Object.assign({},e.defines),this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.fog=e.fog,this.lights=e.lights,this.clipping=e.clipping,this.extensions=Object.assign({},e.extensions),this.glslVersion=e.glslVersion,this}toJSON(e){const t=super.toJSON(e);t.glslVersion=this.glslVersion,t.uniforms={};for(const s in this.uniforms){const o=this.uniforms[s].value;o&&o.isTexture?t.uniforms[s]={type:"t",value:o.toJSON(e).uuid}:o&&o.isColor?t.uniforms[s]={type:"c",value:o.getHex()}:o&&o.isVector2?t.uniforms[s]={type:"v2",value:o.toArray()}:o&&o.isVector3?t.uniforms[s]={type:"v3",value:o.toArray()}:o&&o.isVector4?t.uniforms[s]={type:"v4",value:o.toArray()}:o&&o.isMatrix3?t.uniforms[s]={type:"m3",value:o.toArray()}:o&&o.isMatrix4?t.uniforms[s]={type:"m4",value:o.toArray()}:t.uniforms[s]={value:o}}Object.keys(this.defines).length>0&&(t.defines=this.defines),t.vertexShader=this.vertexShader,t.fragmentShader=this.fragmentShader,t.lights=this.lights,t.clipping=this.clipping;const i={};for(const s in this.extensions)this.extensions[s]===!0&&(i[s]=!0);return Object.keys(i).length>0&&(t.extensions=i),t}}class ep extends It{constructor(){super(),this.isCamera=!0,this.type="Camera",this.matrixWorldInverse=new rt,this.projectionMatrix=new rt,this.projectionMatrixInverse=new rt,this.coordinateSystem=jn}copy(e,t){return super.copy(e,t),this.matrixWorldInverse.copy(e.matrixWorldInverse),this.projectionMatrix.copy(e.projectionMatrix),this.projectionMatrixInverse.copy(e.projectionMatrixInverse),this.coordinateSystem=e.coordinateSystem,this}getWorldDirection(e){return super.getWorldDirection(e).negate()}updateMatrixWorld(e){super.updateMatrixWorld(e),this.matrixWorldInverse.copy(this.matrixWorld).invert()}updateWorldMatrix(e,t){super.updateWorldMatrix(e,t),this.matrixWorldInverse.copy(this.matrixWorld).invert()}clone(){return new this.constructor().copy(this)}}const ri=new F,Td=new Ve,Ad=new Ve;class sn extends ep{constructor(e=50,t=1,i=.1,s=2e3){super(),this.isPerspectiveCamera=!0,this.type="PerspectiveCamera",this.fov=e,this.zoom=1,this.near=i,this.far=s,this.focus=10,this.aspect=t,this.view=null,this.filmGauge=35,this.filmOffset=0,this.updateProjectionMatrix()}copy(e,t){return super.copy(e,t),this.fov=e.fov,this.zoom=e.zoom,this.near=e.near,this.far=e.far,this.focus=e.focus,this.aspect=e.aspect,this.view=e.view===null?null:Object.assign({},e.view),this.filmGauge=e.filmGauge,this.filmOffset=e.filmOffset,this}setFocalLength(e){const t=.5*this.getFilmHeight()/e;this.fov=ic*2*Math.atan(t),this.updateProjectionMatrix()}getFocalLength(){const e=Math.tan(lr*.5*this.fov);return .5*this.getFilmHeight()/e}getEffectiveFOV(){return ic*2*Math.atan(Math.tan(lr*.5*this.fov)/this.zoom)}getFilmWidth(){return this.filmGauge*Math.min(this.aspect,1)}getFilmHeight(){return this.filmGauge/Math.max(this.aspect,1)}getViewBounds(e,t,i){ri.set(-1,-1,.5).applyMatrix4(this.projectionMatrixInverse),t.set(ri.x,ri.y).multiplyScalar(-e/ri.z),ri.set(1,1,.5).applyMatrix4(this.projectionMatrixInverse),i.set(ri.x,ri.y).multiplyScalar(-e/ri.z)}getViewSize(e,t){return this.getViewBounds(e,Td,Ad),t.subVectors(Ad,Td)}setViewOffset(e,t,i,s,r,o){this.aspect=e/t,this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=e,this.view.fullHeight=t,this.view.offsetX=i,this.view.offsetY=s,this.view.width=r,this.view.height=o,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){const e=this.near;let t=e*Math.tan(lr*.5*this.fov)/this.zoom,i=2*t,s=this.aspect*i,r=-.5*s;const o=this.view;if(this.view!==null&&this.view.enabled){const l=o.fullWidth,c=o.fullHeight;r+=o.offsetX*s/l,t-=o.offsetY*i/c,s*=o.width/l,i*=o.height/c}const a=this.filmOffset;a!==0&&(r+=e*a/this.getFilmWidth()),this.projectionMatrix.makePerspective(r,r+s,t,t-i,e,this.far,this.coordinateSystem),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(e){const t=super.toJSON(e);return t.object.fov=this.fov,t.object.zoom=this.zoom,t.object.near=this.near,t.object.far=this.far,t.object.focus=this.focus,t.object.aspect=this.aspect,this.view!==null&&(t.object.view=Object.assign({},this.view)),t.object.filmGauge=this.filmGauge,t.object.filmOffset=this.filmOffset,t}}const fs=-90,ps=1;class X_ extends It{constructor(e,t,i){super(),this.type="CubeCamera",this.renderTarget=i,this.coordinateSystem=null,this.activeMipmapLevel=0;const s=new sn(fs,ps,e,t);s.layers=this.layers,this.add(s);const r=new sn(fs,ps,e,t);r.layers=this.layers,this.add(r);const o=new sn(fs,ps,e,t);o.layers=this.layers,this.add(o);const a=new sn(fs,ps,e,t);a.layers=this.layers,this.add(a);const l=new sn(fs,ps,e,t);l.layers=this.layers,this.add(l);const c=new sn(fs,ps,e,t);c.layers=this.layers,this.add(c)}updateCoordinateSystem(){const e=this.coordinateSystem,t=this.children.concat(),[i,s,r,o,a,l]=t;for(const c of t)this.remove(c);if(e===jn)i.up.set(0,1,0),i.lookAt(1,0,0),s.up.set(0,1,0),s.lookAt(-1,0,0),r.up.set(0,0,-1),r.lookAt(0,1,0),o.up.set(0,0,1),o.lookAt(0,-1,0),a.up.set(0,1,0),a.lookAt(0,0,1),l.up.set(0,1,0),l.lookAt(0,0,-1);else if(e===Vo)i.up.set(0,-1,0),i.lookAt(-1,0,0),s.up.set(0,-1,0),s.lookAt(1,0,0),r.up.set(0,0,1),r.lookAt(0,1,0),o.up.set(0,0,-1),o.lookAt(0,-1,0),a.up.set(0,-1,0),a.lookAt(0,0,1),l.up.set(0,-1,0),l.lookAt(0,0,-1);else throw new Error("THREE.CubeCamera.updateCoordinateSystem(): Invalid coordinate system: "+e);for(const c of t)this.add(c),c.updateMatrixWorld()}update(e,t){this.parent===null&&this.updateMatrixWorld();const{renderTarget:i,activeMipmapLevel:s}=this;this.coordinateSystem!==e.coordinateSystem&&(this.coordinateSystem=e.coordinateSystem,this.updateCoordinateSystem());const[r,o,a,l,c,u]=this.children,d=e.getRenderTarget(),h=e.getActiveCubeFace(),p=e.getActiveMipmapLevel(),g=e.xr.enabled;e.xr.enabled=!1;const _=i.texture.generateMipmaps;i.texture.generateMipmaps=!1,e.setRenderTarget(i,0,s),e.render(t,r),e.setRenderTarget(i,1,s),e.render(t,o),e.setRenderTarget(i,2,s),e.render(t,a),e.setRenderTarget(i,3,s),e.render(t,l),e.setRenderTarget(i,4,s),e.render(t,c),i.texture.generateMipmaps=_,e.setRenderTarget(i,5,s),e.render(t,u),e.setRenderTarget(d,h,p),e.xr.enabled=g,i.texture.needsPMREMUpdate=!0}}class tp extends $t{constructor(e=[],t=Is,i,s,r,o,a,l,c,u){super(e,t,i,s,r,o,a,l,c,u),this.isCubeTexture=!0,this.flipY=!1}get images(){return this.image}set images(e){this.image=e}}class Y_ extends Wi{constructor(e=1,t={}){super(e,e,t),this.isWebGLCubeRenderTarget=!0;const i={width:e,height:e,depth:1},s=[i,i,i,i,i,i];this.texture=new tp(s),this._setTextureOptions(t),this.texture.isRenderTargetTexture=!0}fromEquirectangularTexture(e,t){this.texture.type=t.type,this.texture.colorSpace=t.colorSpace,this.texture.generateMipmaps=t.generateMipmaps,this.texture.minFilter=t.minFilter,this.texture.magFilter=t.magFilter;const i={uniforms:{tEquirect:{value:null}},vertexShader:`

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
			`},s=new rn(5,5,5),r=new wi({name:"CubemapFromEquirect",uniforms:Fs(i.uniforms),vertexShader:i.vertexShader,fragmentShader:i.fragmentShader,side:Zt,blending:vi});r.uniforms.tEquirect.value=t;const o=new vn(s,r),a=t.minFilter;return t.minFilter===Bi&&(t.minFilter=Cn),new X_(1,10,this).update(e,o),t.minFilter=a,o.geometry.dispose(),o.material.dispose(),this}clear(e,t=!0,i=!0,s=!0){const r=e.getRenderTarget();for(let o=0;o<6;o++)e.setRenderTarget(this,o),e.clear(t,i,s);e.setRenderTarget(r)}}class mi extends It{constructor(){super(),this.isGroup=!0,this.type="Group"}}const q_={type:"move"};class $a{constructor(){this._targetRay=null,this._grip=null,this._hand=null}getHandSpace(){return this._hand===null&&(this._hand=new mi,this._hand.matrixAutoUpdate=!1,this._hand.visible=!1,this._hand.joints={},this._hand.inputState={pinching:!1}),this._hand}getTargetRaySpace(){return this._targetRay===null&&(this._targetRay=new mi,this._targetRay.matrixAutoUpdate=!1,this._targetRay.visible=!1,this._targetRay.hasLinearVelocity=!1,this._targetRay.linearVelocity=new F,this._targetRay.hasAngularVelocity=!1,this._targetRay.angularVelocity=new F),this._targetRay}getGripSpace(){return this._grip===null&&(this._grip=new mi,this._grip.matrixAutoUpdate=!1,this._grip.visible=!1,this._grip.hasLinearVelocity=!1,this._grip.linearVelocity=new F,this._grip.hasAngularVelocity=!1,this._grip.angularVelocity=new F),this._grip}dispatchEvent(e){return this._targetRay!==null&&this._targetRay.dispatchEvent(e),this._grip!==null&&this._grip.dispatchEvent(e),this._hand!==null&&this._hand.dispatchEvent(e),this}connect(e){if(e&&e.hand){const t=this._hand;if(t)for(const i of e.hand.values())this._getHandJoint(t,i)}return this.dispatchEvent({type:"connected",data:e}),this}disconnect(e){return this.dispatchEvent({type:"disconnected",data:e}),this._targetRay!==null&&(this._targetRay.visible=!1),this._grip!==null&&(this._grip.visible=!1),this._hand!==null&&(this._hand.visible=!1),this}update(e,t,i){let s=null,r=null,o=null;const a=this._targetRay,l=this._grip,c=this._hand;if(e&&t.session.visibilityState!=="visible-blurred"){if(c&&e.hand){o=!0;for(const _ of e.hand.values()){const m=t.getJointPose(_,i),f=this._getHandJoint(c,_);m!==null&&(f.matrix.fromArray(m.transform.matrix),f.matrix.decompose(f.position,f.rotation,f.scale),f.matrixWorldNeedsUpdate=!0,f.jointRadius=m.radius),f.visible=m!==null}const u=c.joints["index-finger-tip"],d=c.joints["thumb-tip"],h=u.position.distanceTo(d.position),p=.02,g=.005;c.inputState.pinching&&h>p+g?(c.inputState.pinching=!1,this.dispatchEvent({type:"pinchend",handedness:e.handedness,target:this})):!c.inputState.pinching&&h<=p-g&&(c.inputState.pinching=!0,this.dispatchEvent({type:"pinchstart",handedness:e.handedness,target:this}))}else l!==null&&e.gripSpace&&(r=t.getPose(e.gripSpace,i),r!==null&&(l.matrix.fromArray(r.transform.matrix),l.matrix.decompose(l.position,l.rotation,l.scale),l.matrixWorldNeedsUpdate=!0,r.linearVelocity?(l.hasLinearVelocity=!0,l.linearVelocity.copy(r.linearVelocity)):l.hasLinearVelocity=!1,r.angularVelocity?(l.hasAngularVelocity=!0,l.angularVelocity.copy(r.angularVelocity)):l.hasAngularVelocity=!1));a!==null&&(s=t.getPose(e.targetRaySpace,i),s===null&&r!==null&&(s=r),s!==null&&(a.matrix.fromArray(s.transform.matrix),a.matrix.decompose(a.position,a.rotation,a.scale),a.matrixWorldNeedsUpdate=!0,s.linearVelocity?(a.hasLinearVelocity=!0,a.linearVelocity.copy(s.linearVelocity)):a.hasLinearVelocity=!1,s.angularVelocity?(a.hasAngularVelocity=!0,a.angularVelocity.copy(s.angularVelocity)):a.hasAngularVelocity=!1,this.dispatchEvent(q_)))}return a!==null&&(a.visible=s!==null),l!==null&&(l.visible=r!==null),c!==null&&(c.visible=o!==null),this}_getHandJoint(e,t){if(e.joints[t.jointName]===void 0){const i=new mi;i.matrixAutoUpdate=!1,i.visible=!1,e.joints[t.jointName]=i,e.add(i)}return e.joints[t.jointName]}}class np extends It{constructor(){super(),this.isScene=!0,this.type="Scene",this.background=null,this.environment=null,this.fog=null,this.backgroundBlurriness=0,this.backgroundIntensity=1,this.backgroundRotation=new Fn,this.environmentIntensity=1,this.environmentRotation=new Fn,this.overrideMaterial=null,typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}copy(e,t){return super.copy(e,t),e.background!==null&&(this.background=e.background.clone()),e.environment!==null&&(this.environment=e.environment.clone()),e.fog!==null&&(this.fog=e.fog.clone()),this.backgroundBlurriness=e.backgroundBlurriness,this.backgroundIntensity=e.backgroundIntensity,this.backgroundRotation.copy(e.backgroundRotation),this.environmentIntensity=e.environmentIntensity,this.environmentRotation.copy(e.environmentRotation),e.overrideMaterial!==null&&(this.overrideMaterial=e.overrideMaterial.clone()),this.matrixAutoUpdate=e.matrixAutoUpdate,this}toJSON(e){const t=super.toJSON(e);return this.fog!==null&&(t.object.fog=this.fog.toJSON()),this.backgroundBlurriness>0&&(t.object.backgroundBlurriness=this.backgroundBlurriness),this.backgroundIntensity!==1&&(t.object.backgroundIntensity=this.backgroundIntensity),t.object.backgroundRotation=this.backgroundRotation.toArray(),this.environmentIntensity!==1&&(t.object.environmentIntensity=this.environmentIntensity),t.object.environmentRotation=this.environmentRotation.toArray(),t}}class j_ extends $t{constructor(e=null,t=1,i=1,s,r,o,a,l,c=on,u=on,d,h){super(null,o,a,l,c,u,s,r,d,h),this.isDataTexture=!0,this.image={data:e,width:t,height:i},this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}}class Rd extends Ut{constructor(e,t,i,s=1){super(e,t,i),this.isInstancedBufferAttribute=!0,this.meshPerAttribute=s}copy(e){return super.copy(e),this.meshPerAttribute=e.meshPerAttribute,this}toJSON(){const e=super.toJSON();return e.meshPerAttribute=this.meshPerAttribute,e.isInstancedBufferAttribute=!0,e}}const ms=new rt,Cd=new rt,so=[],Pd=new ji,K_=new rt,Js=new vn,Qs=new Ki;class ip extends vn{constructor(e,t,i){super(e,t),this.isInstancedMesh=!0,this.instanceMatrix=new Rd(new Float32Array(i*16),16),this.instanceColor=null,this.morphTexture=null,this.count=i,this.boundingBox=null,this.boundingSphere=null;for(let s=0;s<i;s++)this.setMatrixAt(s,K_)}computeBoundingBox(){const e=this.geometry,t=this.count;this.boundingBox===null&&(this.boundingBox=new ji),e.boundingBox===null&&e.computeBoundingBox(),this.boundingBox.makeEmpty();for(let i=0;i<t;i++)this.getMatrixAt(i,ms),Pd.copy(e.boundingBox).applyMatrix4(ms),this.boundingBox.union(Pd)}computeBoundingSphere(){const e=this.geometry,t=this.count;this.boundingSphere===null&&(this.boundingSphere=new Ki),e.boundingSphere===null&&e.computeBoundingSphere(),this.boundingSphere.makeEmpty();for(let i=0;i<t;i++)this.getMatrixAt(i,ms),Qs.copy(e.boundingSphere).applyMatrix4(ms),this.boundingSphere.union(Qs)}copy(e,t){return super.copy(e,t),this.instanceMatrix.copy(e.instanceMatrix),e.morphTexture!==null&&(this.morphTexture=e.morphTexture.clone()),e.instanceColor!==null&&(this.instanceColor=e.instanceColor.clone()),this.count=e.count,e.boundingBox!==null&&(this.boundingBox=e.boundingBox.clone()),e.boundingSphere!==null&&(this.boundingSphere=e.boundingSphere.clone()),this}getColorAt(e,t){t.fromArray(this.instanceColor.array,e*3)}getMatrixAt(e,t){t.fromArray(this.instanceMatrix.array,e*16)}getMorphAt(e,t){const i=t.morphTargetInfluences,s=this.morphTexture.source.data.data,r=i.length+1,o=e*r+1;for(let a=0;a<i.length;a++)i[a]=s[o+a]}raycast(e,t){const i=this.matrixWorld,s=this.count;if(Js.geometry=this.geometry,Js.material=this.material,Js.material!==void 0&&(this.boundingSphere===null&&this.computeBoundingSphere(),Qs.copy(this.boundingSphere),Qs.applyMatrix4(i),e.ray.intersectsSphere(Qs)!==!1))for(let r=0;r<s;r++){this.getMatrixAt(r,ms),Cd.multiplyMatrices(i,ms),Js.matrixWorld=Cd,Js.raycast(e,so);for(let o=0,a=so.length;o<a;o++){const l=so[o];l.instanceId=r,l.object=this,t.push(l)}so.length=0}}setColorAt(e,t){this.instanceColor===null&&(this.instanceColor=new Rd(new Float32Array(this.instanceMatrix.count*3).fill(1),3)),t.toArray(this.instanceColor.array,e*3)}setMatrixAt(e,t){t.toArray(this.instanceMatrix.array,e*16)}setMorphAt(e,t){const i=t.morphTargetInfluences,s=i.length+1;this.morphTexture===null&&(this.morphTexture=new j_(new Float32Array(s*this.count),s,this.count,Zc,Pn));const r=this.morphTexture.source.data.data;let o=0;for(let c=0;c<i.length;c++)o+=i[c];const a=this.geometry.morphTargetsRelative?1:1-o,l=s*e;r[l]=a,r.set(i,l+1)}updateMorphTargets(){}dispose(){this.dispatchEvent({type:"dispose"}),this.morphTexture!==null&&(this.morphTexture.dispose(),this.morphTexture=null)}}const Wa=new F,Z_=new F,J_=new Ye;class ai{constructor(e=new F(1,0,0),t=0){this.isPlane=!0,this.normal=e,this.constant=t}set(e,t){return this.normal.copy(e),this.constant=t,this}setComponents(e,t,i,s){return this.normal.set(e,t,i),this.constant=s,this}setFromNormalAndCoplanarPoint(e,t){return this.normal.copy(e),this.constant=-t.dot(this.normal),this}setFromCoplanarPoints(e,t,i){const s=Wa.subVectors(i,t).cross(Z_.subVectors(e,t)).normalize();return this.setFromNormalAndCoplanarPoint(s,e),this}copy(e){return this.normal.copy(e.normal),this.constant=e.constant,this}normalize(){const e=1/this.normal.length();return this.normal.multiplyScalar(e),this.constant*=e,this}negate(){return this.constant*=-1,this.normal.negate(),this}distanceToPoint(e){return this.normal.dot(e)+this.constant}distanceToSphere(e){return this.distanceToPoint(e.center)-e.radius}projectPoint(e,t){return t.copy(e).addScaledVector(this.normal,-this.distanceToPoint(e))}intersectLine(e,t){const i=e.delta(Wa),s=this.normal.dot(i);if(s===0)return this.distanceToPoint(e.start)===0?t.copy(e.start):null;const r=-(e.start.dot(this.normal)+this.constant)/s;return r<0||r>1?null:t.copy(e.start).addScaledVector(i,r)}intersectsLine(e){const t=this.distanceToPoint(e.start),i=this.distanceToPoint(e.end);return t<0&&i>0||i<0&&t>0}intersectsBox(e){return e.intersectsPlane(this)}intersectsSphere(e){return e.intersectsPlane(this)}coplanarPoint(e){return e.copy(this.normal).multiplyScalar(-this.constant)}applyMatrix4(e,t){const i=t||J_.getNormalMatrix(e),s=this.coplanarPoint(Wa).applyMatrix4(e),r=this.normal.applyMatrix3(i).normalize();return this.constant=-s.dot(r),this}translate(e){return this.constant-=e.dot(this.normal),this}equals(e){return e.normal.equals(this.normal)&&e.constant===this.constant}clone(){return new this.constructor().copy(this)}}const Pi=new Ki,Q_=new Ve(.5,.5),ro=new F;class iu{constructor(e=new ai,t=new ai,i=new ai,s=new ai,r=new ai,o=new ai){this.planes=[e,t,i,s,r,o]}set(e,t,i,s,r,o){const a=this.planes;return a[0].copy(e),a[1].copy(t),a[2].copy(i),a[3].copy(s),a[4].copy(r),a[5].copy(o),this}copy(e){const t=this.planes;for(let i=0;i<6;i++)t[i].copy(e.planes[i]);return this}setFromProjectionMatrix(e,t=jn){const i=this.planes,s=e.elements,r=s[0],o=s[1],a=s[2],l=s[3],c=s[4],u=s[5],d=s[6],h=s[7],p=s[8],g=s[9],_=s[10],m=s[11],f=s[12],M=s[13],b=s[14],E=s[15];if(i[0].setComponents(l-r,h-c,m-p,E-f).normalize(),i[1].setComponents(l+r,h+c,m+p,E+f).normalize(),i[2].setComponents(l+o,h+u,m+g,E+M).normalize(),i[3].setComponents(l-o,h-u,m-g,E-M).normalize(),i[4].setComponents(l-a,h-d,m-_,E-b).normalize(),t===jn)i[5].setComponents(l+a,h+d,m+_,E+b).normalize();else if(t===Vo)i[5].setComponents(a,d,_,b).normalize();else throw new Error("THREE.Frustum.setFromProjectionMatrix(): Invalid coordinate system: "+t);return this}intersectsObject(e){if(e.boundingSphere!==void 0)e.boundingSphere===null&&e.computeBoundingSphere(),Pi.copy(e.boundingSphere).applyMatrix4(e.matrixWorld);else{const t=e.geometry;t.boundingSphere===null&&t.computeBoundingSphere(),Pi.copy(t.boundingSphere).applyMatrix4(e.matrixWorld)}return this.intersectsSphere(Pi)}intersectsSprite(e){Pi.center.set(0,0,0);const t=Q_.distanceTo(e.center);return Pi.radius=.7071067811865476+t,Pi.applyMatrix4(e.matrixWorld),this.intersectsSphere(Pi)}intersectsSphere(e){const t=this.planes,i=e.center,s=-e.radius;for(let r=0;r<6;r++)if(t[r].distanceToPoint(i)<s)return!1;return!0}intersectsBox(e){const t=this.planes;for(let i=0;i<6;i++){const s=t[i];if(ro.x=s.normal.x>0?e.max.x:e.min.x,ro.y=s.normal.y>0?e.max.y:e.min.y,ro.z=s.normal.z>0?e.max.z:e.min.z,s.distanceToPoint(ro)<0)return!1}return!0}containsPoint(e){const t=this.planes;for(let i=0;i<6;i++)if(t[i].distanceToPoint(e)<0)return!1;return!0}clone(){return new this.constructor().copy(this)}}class Jn extends Zi{constructor(e){super(),this.isLineBasicMaterial=!0,this.type="LineBasicMaterial",this.color=new Pe(16777215),this.map=null,this.linewidth=1,this.linecap="round",this.linejoin="round",this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.linewidth=e.linewidth,this.linecap=e.linecap,this.linejoin=e.linejoin,this.fog=e.fog,this}}const Wo=new F,Xo=new F,Ld=new rt,er=new Ar,oo=new Ki,Xa=new F,Dd=new F;class e0 extends It{constructor(e=new Ft,t=new Jn){super(),this.isLine=!0,this.type="Line",this.geometry=e,this.material=t,this.morphTargetDictionary=void 0,this.morphTargetInfluences=void 0,this.updateMorphTargets()}copy(e,t){return super.copy(e,t),this.material=Array.isArray(e.material)?e.material.slice():e.material,this.geometry=e.geometry,this}computeLineDistances(){const e=this.geometry;if(e.index===null){const t=e.attributes.position,i=[0];for(let s=1,r=t.count;s<r;s++)Wo.fromBufferAttribute(t,s-1),Xo.fromBufferAttribute(t,s),i[s]=i[s-1],i[s]+=Wo.distanceTo(Xo);e.setAttribute("lineDistance",new an(i,1))}else console.warn("THREE.Line.computeLineDistances(): Computation only possible with non-indexed BufferGeometry.");return this}raycast(e,t){const i=this.geometry,s=this.matrixWorld,r=e.params.Line.threshold,o=i.drawRange;if(i.boundingSphere===null&&i.computeBoundingSphere(),oo.copy(i.boundingSphere),oo.applyMatrix4(s),oo.radius+=r,e.ray.intersectsSphere(oo)===!1)return;Ld.copy(s).invert(),er.copy(e.ray).applyMatrix4(Ld);const a=r/((this.scale.x+this.scale.y+this.scale.z)/3),l=a*a,c=this.isLineSegments?2:1,u=i.index,h=i.attributes.position;if(u!==null){const p=Math.max(0,o.start),g=Math.min(u.count,o.start+o.count);for(let _=p,m=g-1;_<m;_+=c){const f=u.getX(_),M=u.getX(_+1),b=ao(this,e,er,l,f,M,_);b&&t.push(b)}if(this.isLineLoop){const _=u.getX(g-1),m=u.getX(p),f=ao(this,e,er,l,_,m,g-1);f&&t.push(f)}}else{const p=Math.max(0,o.start),g=Math.min(h.count,o.start+o.count);for(let _=p,m=g-1;_<m;_+=c){const f=ao(this,e,er,l,_,_+1,_);f&&t.push(f)}if(this.isLineLoop){const _=ao(this,e,er,l,g-1,p,g-1);_&&t.push(_)}}}updateMorphTargets(){const t=this.geometry.morphAttributes,i=Object.keys(t);if(i.length>0){const s=t[i[0]];if(s!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let r=0,o=s.length;r<o;r++){const a=s[r].name||String(r);this.morphTargetInfluences.push(0),this.morphTargetDictionary[a]=r}}}}}function ao(n,e,t,i,s,r,o){const a=n.geometry.attributes.position;if(Wo.fromBufferAttribute(a,s),Xo.fromBufferAttribute(a,r),t.distanceSqToSegment(Wo,Xo,Xa,Dd)>i)return;Xa.applyMatrix4(n.matrixWorld);const c=e.ray.origin.distanceTo(Xa);if(!(c<e.near||c>e.far))return{distance:c,point:Dd.clone().applyMatrix4(n.matrixWorld),index:o,face:null,faceIndex:null,barycoord:null,object:n}}const Id=new F,Ud=new F;class Xi extends e0{constructor(e,t){super(e,t),this.isLineSegments=!0,this.type="LineSegments"}computeLineDistances(){const e=this.geometry;if(e.index===null){const t=e.attributes.position,i=[];for(let s=0,r=t.count;s<r;s+=2)Id.fromBufferAttribute(t,s),Ud.fromBufferAttribute(t,s+1),i[s]=s===0?0:i[s-1],i[s+1]=i[s]+Id.distanceTo(Ud);e.setAttribute("lineDistance",new an(i,1))}else console.warn("THREE.LineSegments.computeLineDistances(): Computation only possible with non-indexed BufferGeometry.");return this}}class Rr extends Zi{constructor(e){super(),this.isPointsMaterial=!0,this.type="PointsMaterial",this.color=new Pe(16777215),this.map=null,this.alphaMap=null,this.size=1,this.sizeAttenuation=!0,this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.alphaMap=e.alphaMap,this.size=e.size,this.sizeAttenuation=e.sizeAttenuation,this.fog=e.fog,this}}const Nd=new rt,sc=new Ar,lo=new Ki,co=new F;class su extends It{constructor(e=new Ft,t=new Rr){super(),this.isPoints=!0,this.type="Points",this.geometry=e,this.material=t,this.morphTargetDictionary=void 0,this.morphTargetInfluences=void 0,this.updateMorphTargets()}copy(e,t){return super.copy(e,t),this.material=Array.isArray(e.material)?e.material.slice():e.material,this.geometry=e.geometry,this}raycast(e,t){const i=this.geometry,s=this.matrixWorld,r=e.params.Points.threshold,o=i.drawRange;if(i.boundingSphere===null&&i.computeBoundingSphere(),lo.copy(i.boundingSphere),lo.applyMatrix4(s),lo.radius+=r,e.ray.intersectsSphere(lo)===!1)return;Nd.copy(s).invert(),sc.copy(e.ray).applyMatrix4(Nd);const a=r/((this.scale.x+this.scale.y+this.scale.z)/3),l=a*a,c=i.index,d=i.attributes.position;if(c!==null){const h=Math.max(0,o.start),p=Math.min(c.count,o.start+o.count);for(let g=h,_=p;g<_;g++){const m=c.getX(g);co.fromBufferAttribute(d,m),Fd(co,m,l,s,e,t,this)}}else{const h=Math.max(0,o.start),p=Math.min(d.count,o.start+o.count);for(let g=h,_=p;g<_;g++)co.fromBufferAttribute(d,g),Fd(co,g,l,s,e,t,this)}}updateMorphTargets(){const t=this.geometry.morphAttributes,i=Object.keys(t);if(i.length>0){const s=t[i[0]];if(s!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let r=0,o=s.length;r<o;r++){const a=s[r].name||String(r);this.morphTargetInfluences.push(0),this.morphTargetDictionary[a]=r}}}}}function Fd(n,e,t,i,s,r,o){const a=sc.distanceSqToPoint(n);if(a<t){const l=new F;sc.closestPointToPoint(n,l),l.applyMatrix4(i);const c=s.ray.origin.distanceTo(l);if(c<s.near||c>s.far)return;r.push({distance:c,distanceToRay:Math.sqrt(a),point:l,index:e,face:null,faceIndex:null,barycoord:null,object:o})}}class sp extends $t{constructor(e,t,i=Vi,s,r,o,a=on,l=on,c,u=xr,d=1){if(u!==xr&&u!==yr)throw new Error("DepthTexture format must be either THREE.DepthFormat or THREE.DepthStencilFormat");const h={width:e,height:t,depth:d};super(h,s,r,o,a,l,u,i,c),this.isDepthTexture=!0,this.flipY=!1,this.generateMipmaps=!1,this.compareFunction=null}copy(e){return super.copy(e),this.source=new tu(Object.assign({},e.image)),this.compareFunction=e.compareFunction,this}toJSON(e){const t=super.toJSON(e);return this.compareFunction!==null&&(t.compareFunction=this.compareFunction),t}}const uo=new F,ho=new F,Ya=new F,fo=new _n;class ra extends Ft{constructor(e=null,t=1){if(super(),this.type="EdgesGeometry",this.parameters={geometry:e,thresholdAngle:t},e!==null){const s=Math.pow(10,4),r=Math.cos(lr*t),o=e.getIndex(),a=e.getAttribute("position"),l=o?o.count:a.count,c=[0,0,0],u=["a","b","c"],d=new Array(3),h={},p=[];for(let g=0;g<l;g+=3){o?(c[0]=o.getX(g),c[1]=o.getX(g+1),c[2]=o.getX(g+2)):(c[0]=g,c[1]=g+1,c[2]=g+2);const{a:_,b:m,c:f}=fo;if(_.fromBufferAttribute(a,c[0]),m.fromBufferAttribute(a,c[1]),f.fromBufferAttribute(a,c[2]),fo.getNormal(Ya),d[0]=`${Math.round(_.x*s)},${Math.round(_.y*s)},${Math.round(_.z*s)}`,d[1]=`${Math.round(m.x*s)},${Math.round(m.y*s)},${Math.round(m.z*s)}`,d[2]=`${Math.round(f.x*s)},${Math.round(f.y*s)},${Math.round(f.z*s)}`,!(d[0]===d[1]||d[1]===d[2]||d[2]===d[0]))for(let M=0;M<3;M++){const b=(M+1)%3,E=d[M],L=d[b],T=fo[u[M]],A=fo[u[b]],R=`${E}_${L}`,S=`${L}_${E}`;S in h&&h[S]?(Ya.dot(h[S].normal)<=r&&(p.push(T.x,T.y,T.z),p.push(A.x,A.y,A.z)),h[S]=null):R in h||(h[R]={index0:c[M],index1:c[b],normal:Ya.clone()})}}for(const g in h)if(h[g]){const{index0:_,index1:m}=h[g];uo.fromBufferAttribute(a,_),ho.fromBufferAttribute(a,m),p.push(uo.x,uo.y,uo.z),p.push(ho.x,ho.y,ho.z)}this.setAttribute("position",new an(p,3))}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}}class oa extends Ft{constructor(e=1,t=1,i=1,s=1){super(),this.type="PlaneGeometry",this.parameters={width:e,height:t,widthSegments:i,heightSegments:s};const r=e/2,o=t/2,a=Math.floor(i),l=Math.floor(s),c=a+1,u=l+1,d=e/a,h=t/l,p=[],g=[],_=[],m=[];for(let f=0;f<u;f++){const M=f*h-o;for(let b=0;b<c;b++){const E=b*d-r;g.push(E,-M,0),_.push(0,0,1),m.push(b/a),m.push(1-f/l)}}for(let f=0;f<l;f++)for(let M=0;M<a;M++){const b=M+c*f,E=M+c*(f+1),L=M+1+c*(f+1),T=M+1+c*f;p.push(b,E,T),p.push(E,L,T)}this.setIndex(p),this.setAttribute("position",new an(g,3)),this.setAttribute("normal",new an(_,3)),this.setAttribute("uv",new an(m,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new oa(e.width,e.height,e.widthSegments,e.heightSegments)}}class Od extends Zi{constructor(e){super(),this.isMeshLambertMaterial=!0,this.type="MeshLambertMaterial",this.color=new Pe(16777215),this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.emissive=new Pe(0),this.emissiveIntensity=1,this.emissiveMap=null,this.bumpMap=null,this.bumpScale=1,this.normalMap=null,this.normalMapType=Xf,this.normalScale=new Ve(1,1),this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.specularMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new Fn,this.combine=Yc,this.reflectivity=1,this.refractionRatio=.98,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.flatShading=!1,this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.lightMap=e.lightMap,this.lightMapIntensity=e.lightMapIntensity,this.aoMap=e.aoMap,this.aoMapIntensity=e.aoMapIntensity,this.emissive.copy(e.emissive),this.emissiveMap=e.emissiveMap,this.emissiveIntensity=e.emissiveIntensity,this.bumpMap=e.bumpMap,this.bumpScale=e.bumpScale,this.normalMap=e.normalMap,this.normalMapType=e.normalMapType,this.normalScale.copy(e.normalScale),this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this.specularMap=e.specularMap,this.alphaMap=e.alphaMap,this.envMap=e.envMap,this.envMapRotation.copy(e.envMapRotation),this.combine=e.combine,this.reflectivity=e.reflectivity,this.refractionRatio=e.refractionRatio,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.wireframeLinecap=e.wireframeLinecap,this.wireframeLinejoin=e.wireframeLinejoin,this.flatShading=e.flatShading,this.fog=e.fog,this}}class t0 extends Zi{constructor(e){super(),this.isMeshDepthMaterial=!0,this.type="MeshDepthMaterial",this.depthPacking=c_,this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.wireframe=!1,this.wireframeLinewidth=1,this.setValues(e)}copy(e){return super.copy(e),this.depthPacking=e.depthPacking,this.map=e.map,this.alphaMap=e.alphaMap,this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this}}class n0 extends Zi{constructor(e){super(),this.isMeshDistanceMaterial=!0,this.type="MeshDistanceMaterial",this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.setValues(e)}copy(e){return super.copy(e),this.map=e.map,this.alphaMap=e.alphaMap,this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this}}class i0 extends Jn{constructor(e){super(),this.isLineDashedMaterial=!0,this.type="LineDashedMaterial",this.scale=1,this.dashSize=3,this.gapSize=1,this.setValues(e)}copy(e){return super.copy(e),this.scale=e.scale,this.dashSize=e.dashSize,this.gapSize=e.gapSize,this}}class rp extends It{constructor(e,t=1){super(),this.isLight=!0,this.type="Light",this.color=new Pe(e),this.intensity=t}dispose(){}copy(e,t){return super.copy(e,t),this.color.copy(e.color),this.intensity=e.intensity,this}toJSON(e){const t=super.toJSON(e);return t.object.color=this.color.getHex(),t.object.intensity=this.intensity,this.groundColor!==void 0&&(t.object.groundColor=this.groundColor.getHex()),this.distance!==void 0&&(t.object.distance=this.distance),this.angle!==void 0&&(t.object.angle=this.angle),this.decay!==void 0&&(t.object.decay=this.decay),this.penumbra!==void 0&&(t.object.penumbra=this.penumbra),this.shadow!==void 0&&(t.object.shadow=this.shadow.toJSON()),this.target!==void 0&&(t.object.target=this.target.uuid),t}}const qa=new rt,Bd=new F,kd=new F;class s0{constructor(e){this.camera=e,this.intensity=1,this.bias=0,this.normalBias=0,this.radius=1,this.blurSamples=8,this.mapSize=new Ve(512,512),this.mapType=Nn,this.map=null,this.mapPass=null,this.matrix=new rt,this.autoUpdate=!0,this.needsUpdate=!1,this._frustum=new iu,this._frameExtents=new Ve(1,1),this._viewportCount=1,this._viewports=[new yt(0,0,1,1)]}getViewportCount(){return this._viewportCount}getFrustum(){return this._frustum}updateMatrices(e){const t=this.camera,i=this.matrix;Bd.setFromMatrixPosition(e.matrixWorld),t.position.copy(Bd),kd.setFromMatrixPosition(e.target.matrixWorld),t.lookAt(kd),t.updateMatrixWorld(),qa.multiplyMatrices(t.projectionMatrix,t.matrixWorldInverse),this._frustum.setFromProjectionMatrix(qa),i.set(.5,0,0,.5,0,.5,0,.5,0,0,.5,.5,0,0,0,1),i.multiply(qa)}getViewport(e){return this._viewports[e]}getFrameExtents(){return this._frameExtents}dispose(){this.map&&this.map.dispose(),this.mapPass&&this.mapPass.dispose()}copy(e){return this.camera=e.camera.clone(),this.intensity=e.intensity,this.bias=e.bias,this.radius=e.radius,this.autoUpdate=e.autoUpdate,this.needsUpdate=e.needsUpdate,this.normalBias=e.normalBias,this.blurSamples=e.blurSamples,this.mapSize.copy(e.mapSize),this}clone(){return new this.constructor().copy(this)}toJSON(){const e={};return this.intensity!==1&&(e.intensity=this.intensity),this.bias!==0&&(e.bias=this.bias),this.normalBias!==0&&(e.normalBias=this.normalBias),this.radius!==1&&(e.radius=this.radius),(this.mapSize.x!==512||this.mapSize.y!==512)&&(e.mapSize=this.mapSize.toArray()),e.camera=this.camera.toJSON(!1).object,delete e.camera.matrix,e}}class op extends ep{constructor(e=-1,t=1,i=1,s=-1,r=.1,o=2e3){super(),this.isOrthographicCamera=!0,this.type="OrthographicCamera",this.zoom=1,this.view=null,this.left=e,this.right=t,this.top=i,this.bottom=s,this.near=r,this.far=o,this.updateProjectionMatrix()}copy(e,t){return super.copy(e,t),this.left=e.left,this.right=e.right,this.top=e.top,this.bottom=e.bottom,this.near=e.near,this.far=e.far,this.zoom=e.zoom,this.view=e.view===null?null:Object.assign({},e.view),this}setViewOffset(e,t,i,s,r,o){this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=e,this.view.fullHeight=t,this.view.offsetX=i,this.view.offsetY=s,this.view.width=r,this.view.height=o,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){const e=(this.right-this.left)/(2*this.zoom),t=(this.top-this.bottom)/(2*this.zoom),i=(this.right+this.left)/2,s=(this.top+this.bottom)/2;let r=i-e,o=i+e,a=s+t,l=s-t;if(this.view!==null&&this.view.enabled){const c=(this.right-this.left)/this.view.fullWidth/this.zoom,u=(this.top-this.bottom)/this.view.fullHeight/this.zoom;r+=c*this.view.offsetX,o=r+c*this.view.width,a-=u*this.view.offsetY,l=a-u*this.view.height}this.projectionMatrix.makeOrthographic(r,o,a,l,this.near,this.far,this.coordinateSystem),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(e){const t=super.toJSON(e);return t.object.zoom=this.zoom,t.object.left=this.left,t.object.right=this.right,t.object.top=this.top,t.object.bottom=this.bottom,t.object.near=this.near,t.object.far=this.far,this.view!==null&&(t.object.view=Object.assign({},this.view)),t}}class r0 extends s0{constructor(){super(new op(-5,5,5,-5,.5,500)),this.isDirectionalLightShadow=!0}}class ap extends rp{constructor(e,t){super(e,t),this.isDirectionalLight=!0,this.type="DirectionalLight",this.position.copy(It.DEFAULT_UP),this.updateMatrix(),this.target=new It,this.shadow=new r0}dispose(){this.shadow.dispose()}copy(e){return super.copy(e),this.target=e.target.clone(),this.shadow=e.shadow.clone(),this}}class lp extends rp{constructor(e,t){super(e,t),this.isAmbientLight=!0,this.type="AmbientLight"}}class o0 extends sn{constructor(e=[]){super(),this.isArrayCamera=!0,this.isMultiViewCamera=!1,this.cameras=e}}const zd=new rt;class a0{constructor(e,t,i=0,s=1/0){this.ray=new Ar(e,t),this.near=i,this.far=s,this.camera=null,this.layers=new nu,this.params={Mesh:{},Line:{threshold:1},LOD:{},Points:{threshold:1},Sprite:{}}}set(e,t){this.ray.set(e,t)}setFromCamera(e,t){t.isPerspectiveCamera?(this.ray.origin.setFromMatrixPosition(t.matrixWorld),this.ray.direction.set(e.x,e.y,.5).unproject(t).sub(this.ray.origin).normalize(),this.camera=t):t.isOrthographicCamera?(this.ray.origin.set(e.x,e.y,(t.near+t.far)/(t.near-t.far)).unproject(t),this.ray.direction.set(0,0,-1).transformDirection(t.matrixWorld),this.camera=t):console.error("THREE.Raycaster: Unsupported camera type: "+t.type)}setFromXRController(e){return zd.identity().extractRotation(e.matrixWorld),this.ray.origin.setFromMatrixPosition(e.matrixWorld),this.ray.direction.set(0,0,-1).applyMatrix4(zd),this}intersectObject(e,t=!0,i=[]){return rc(e,this,i,t),i.sort(Gd),i}intersectObjects(e,t=!0,i=[]){for(let s=0,r=e.length;s<r;s++)rc(e[s],this,i,t);return i.sort(Gd),i}}function Gd(n,e){return n.distance-e.distance}function rc(n,e,t,i){let s=!0;if(n.layers.test(e.layers)&&n.raycast(e,t)===!1&&(s=!1),s===!0&&i===!0){const r=n.children;for(let o=0,a=r.length;o<a;o++)rc(r[o],e,t,!0)}}class Hd{constructor(e=1,t=0,i=0){this.radius=e,this.phi=t,this.theta=i}set(e,t,i){return this.radius=e,this.phi=t,this.theta=i,this}copy(e){return this.radius=e.radius,this.phi=e.phi,this.theta=e.theta,this}makeSafe(){return this.phi=Je(this.phi,1e-6,Math.PI-1e-6),this}setFromVector3(e){return this.setFromCartesianCoords(e.x,e.y,e.z)}setFromCartesianCoords(e,t,i){return this.radius=Math.sqrt(e*e+t*t+i*i),this.radius===0?(this.theta=0,this.phi=0):(this.theta=Math.atan2(e,i),this.phi=Math.acos(Je(t/this.radius,-1,1))),this}clone(){return new this.constructor().copy(this)}}class ja extends Xi{constructor(e=10,t=10,i=4473924,s=8947848){i=new Pe(i),s=new Pe(s);const r=t/2,o=e/t,a=e/2,l=[],c=[];for(let h=0,p=0,g=-a;h<=t;h++,g+=o){l.push(-a,0,g,a,0,g),l.push(g,0,-a,g,0,a);const _=h===r?i:s;_.toArray(c,p),p+=3,_.toArray(c,p),p+=3,_.toArray(c,p),p+=3,_.toArray(c,p),p+=3}const u=new Ft;u.setAttribute("position",new an(l,3)),u.setAttribute("color",new an(c,3));const d=new Jn({vertexColors:!0,toneMapped:!1});super(u,d),this.type="GridHelper"}dispose(){this.geometry.dispose(),this.material.dispose()}}class l0 extends qi{constructor(e,t=null){super(),this.object=e,this.domElement=t,this.enabled=!0,this.state=-1,this.keys={},this.mouseButtons={LEFT:null,MIDDLE:null,RIGHT:null},this.touches={ONE:null,TWO:null}}connect(e){if(e===void 0){console.warn("THREE.Controls: connect() now requires an element.");return}this.domElement!==null&&this.disconnect(),this.domElement=e}disconnect(){}dispose(){}update(){}}function Vd(n,e,t,i){const s=c0(i);switch(t){case Hf:return n*e;case Zc:return n*e/s.components*s.byteLength;case Jc:return n*e/s.components*s.byteLength;case $f:return n*e*2/s.components*s.byteLength;case Qc:return n*e*2/s.components*s.byteLength;case Vf:return n*e*3/s.components*s.byteLength;case Tn:return n*e*4/s.components*s.byteLength;case eu:return n*e*4/s.components*s.byteLength;case Ro:case Co:return Math.floor((n+3)/4)*Math.floor((e+3)/4)*8;case Po:case Lo:return Math.floor((n+3)/4)*Math.floor((e+3)/4)*16;case Dl:case Ul:return Math.max(n,16)*Math.max(e,8)/4;case Ll:case Il:return Math.max(n,8)*Math.max(e,8)/2;case Nl:case Fl:return Math.floor((n+3)/4)*Math.floor((e+3)/4)*8;case Ol:return Math.floor((n+3)/4)*Math.floor((e+3)/4)*16;case Bl:return Math.floor((n+3)/4)*Math.floor((e+3)/4)*16;case kl:return Math.floor((n+4)/5)*Math.floor((e+3)/4)*16;case zl:return Math.floor((n+4)/5)*Math.floor((e+4)/5)*16;case Gl:return Math.floor((n+5)/6)*Math.floor((e+4)/5)*16;case Hl:return Math.floor((n+5)/6)*Math.floor((e+5)/6)*16;case Vl:return Math.floor((n+7)/8)*Math.floor((e+4)/5)*16;case $l:return Math.floor((n+7)/8)*Math.floor((e+5)/6)*16;case Wl:return Math.floor((n+7)/8)*Math.floor((e+7)/8)*16;case Xl:return Math.floor((n+9)/10)*Math.floor((e+4)/5)*16;case Yl:return Math.floor((n+9)/10)*Math.floor((e+5)/6)*16;case ql:return Math.floor((n+9)/10)*Math.floor((e+7)/8)*16;case jl:return Math.floor((n+9)/10)*Math.floor((e+9)/10)*16;case Kl:return Math.floor((n+11)/12)*Math.floor((e+9)/10)*16;case Zl:return Math.floor((n+11)/12)*Math.floor((e+11)/12)*16;case Do:case Jl:case Ql:return Math.ceil(n/4)*Math.ceil(e/4)*16;case Wf:case ec:return Math.ceil(n/4)*Math.ceil(e/4)*8;case tc:case nc:return Math.ceil(n/4)*Math.ceil(e/4)*16}throw new Error(`Unable to determine texture byte length for ${t} format.`)}function c0(n){switch(n){case Nn:case kf:return{byteLength:1,components:1};case _r:case zf:case Er:return{byteLength:2,components:1};case jc:case Kc:return{byteLength:2,components:4};case Vi:case qc:case Pn:return{byteLength:4,components:1};case Gf:return{byteLength:4,components:3}}throw new Error(`Unknown texture type ${n}.`)}typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("register",{detail:{revision:Xc}}));typeof window<"u"&&(window.__THREE__?console.warn("WARNING: Multiple instances of Three.js being imported."):window.__THREE__=Xc);/**
 * @license
 * Copyright 2010-2025 Three.js Authors
 * SPDX-License-Identifier: MIT
 */function cp(){let n=null,e=!1,t=null,i=null;function s(r,o){t(r,o),i=n.requestAnimationFrame(s)}return{start:function(){e!==!0&&t!==null&&(i=n.requestAnimationFrame(s),e=!0)},stop:function(){n.cancelAnimationFrame(i),e=!1},setAnimationLoop:function(r){t=r},setContext:function(r){n=r}}}function u0(n){const e=new WeakMap;function t(a,l){const c=a.array,u=a.usage,d=c.byteLength,h=n.createBuffer();n.bindBuffer(l,h),n.bufferData(l,c,u),a.onUploadCallback();let p;if(c instanceof Float32Array)p=n.FLOAT;else if(typeof Float16Array<"u"&&c instanceof Float16Array)p=n.HALF_FLOAT;else if(c instanceof Uint16Array)a.isFloat16BufferAttribute?p=n.HALF_FLOAT:p=n.UNSIGNED_SHORT;else if(c instanceof Int16Array)p=n.SHORT;else if(c instanceof Uint32Array)p=n.UNSIGNED_INT;else if(c instanceof Int32Array)p=n.INT;else if(c instanceof Int8Array)p=n.BYTE;else if(c instanceof Uint8Array)p=n.UNSIGNED_BYTE;else if(c instanceof Uint8ClampedArray)p=n.UNSIGNED_BYTE;else throw new Error("THREE.WebGLAttributes: Unsupported buffer data format: "+c);return{buffer:h,type:p,bytesPerElement:c.BYTES_PER_ELEMENT,version:a.version,size:d}}function i(a,l,c){const u=l.array,d=l.updateRanges;if(n.bindBuffer(c,a),d.length===0)n.bufferSubData(c,0,u);else{d.sort((p,g)=>p.start-g.start);let h=0;for(let p=1;p<d.length;p++){const g=d[h],_=d[p];_.start<=g.start+g.count+1?g.count=Math.max(g.count,_.start+_.count-g.start):(++h,d[h]=_)}d.length=h+1;for(let p=0,g=d.length;p<g;p++){const _=d[p];n.bufferSubData(c,_.start*u.BYTES_PER_ELEMENT,u,_.start,_.count)}l.clearUpdateRanges()}l.onUploadCallback()}function s(a){return a.isInterleavedBufferAttribute&&(a=a.data),e.get(a)}function r(a){a.isInterleavedBufferAttribute&&(a=a.data);const l=e.get(a);l&&(n.deleteBuffer(l.buffer),e.delete(a))}function o(a,l){if(a.isInterleavedBufferAttribute&&(a=a.data),a.isGLBufferAttribute){const u=e.get(a);(!u||u.version<a.version)&&e.set(a,{buffer:a.buffer,type:a.type,bytesPerElement:a.elementSize,version:a.version});return}const c=e.get(a);if(c===void 0)e.set(a,t(a,l));else if(c.version<a.version){if(c.size!==a.array.byteLength)throw new Error("THREE.WebGLAttributes: The size of the buffer attribute's array buffer does not match the original size. Resizing buffer attributes is not supported.");i(c.buffer,a,l),c.version=a.version}}return{get:s,remove:r,update:o}}var d0=`#ifdef USE_ALPHAHASH
	if ( diffuseColor.a < getAlphaHashThreshold( vPosition ) ) discard;
#endif`,h0=`#ifdef USE_ALPHAHASH
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
#endif`,f0=`#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, vAlphaMapUv ).g;
#endif`,p0=`#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,m0=`#ifdef USE_ALPHATEST
	#ifdef ALPHA_TO_COVERAGE
	diffuseColor.a = smoothstep( alphaTest, alphaTest + fwidth( diffuseColor.a ), diffuseColor.a );
	if ( diffuseColor.a == 0.0 ) discard;
	#else
	if ( diffuseColor.a < alphaTest ) discard;
	#endif
#endif`,g0=`#ifdef USE_ALPHATEST
	uniform float alphaTest;
#endif`,_0=`#ifdef USE_AOMAP
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
#endif`,v0=`#ifdef USE_AOMAP
	uniform sampler2D aoMap;
	uniform float aoMapIntensity;
#endif`,x0=`#ifdef USE_BATCHING
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
#endif`,y0=`#ifdef USE_BATCHING
	mat4 batchingMatrix = getBatchingMatrix( getIndirectIndex( gl_DrawID ) );
#endif`,S0=`vec3 transformed = vec3( position );
#ifdef USE_ALPHAHASH
	vPosition = vec3( position );
#endif`,M0=`vec3 objectNormal = vec3( normal );
#ifdef USE_TANGENT
	vec3 objectTangent = vec3( tangent.xyz );
#endif`,w0=`float G_BlinnPhong_Implicit( ) {
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
} // validated`,b0=`#ifdef USE_IRIDESCENCE
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
#endif`,E0=`#ifdef USE_BUMPMAP
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
#endif`,T0=`#if NUM_CLIPPING_PLANES > 0
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
#endif`,A0=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
	uniform vec4 clippingPlanes[ NUM_CLIPPING_PLANES ];
#endif`,R0=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
#endif`,C0=`#if NUM_CLIPPING_PLANES > 0
	vClipPosition = - mvPosition.xyz;
#endif`,P0=`#if defined( USE_COLOR_ALPHA )
	diffuseColor *= vColor;
#elif defined( USE_COLOR )
	diffuseColor.rgb *= vColor;
#endif`,L0=`#if defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#elif defined( USE_COLOR )
	varying vec3 vColor;
#endif`,D0=`#if defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#elif defined( USE_COLOR ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
	varying vec3 vColor;
#endif`,I0=`#if defined( USE_COLOR_ALPHA )
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
#endif`,U0=`#define PI 3.141592653589793
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
} // validated`,N0=`#ifdef ENVMAP_TYPE_CUBE_UV
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
#endif`,F0=`vec3 transformedNormal = objectNormal;
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
#endif`,O0=`#ifdef USE_DISPLACEMENTMAP
	uniform sampler2D displacementMap;
	uniform float displacementScale;
	uniform float displacementBias;
#endif`,B0=`#ifdef USE_DISPLACEMENTMAP
	transformed += normalize( objectNormal ) * ( texture2D( displacementMap, vDisplacementMapUv ).x * displacementScale + displacementBias );
#endif`,k0=`#ifdef USE_EMISSIVEMAP
	vec4 emissiveColor = texture2D( emissiveMap, vEmissiveMapUv );
	#ifdef DECODE_VIDEO_TEXTURE_EMISSIVE
		emissiveColor = sRGBTransferEOTF( emissiveColor );
	#endif
	totalEmissiveRadiance *= emissiveColor.rgb;
#endif`,z0=`#ifdef USE_EMISSIVEMAP
	uniform sampler2D emissiveMap;
#endif`,G0="gl_FragColor = linearToOutputTexel( gl_FragColor );",H0=`vec4 LinearTransferOETF( in vec4 value ) {
	return value;
}
vec4 sRGBTransferEOTF( in vec4 value ) {
	return vec4( mix( pow( value.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), value.rgb * 0.0773993808, vec3( lessThanEqual( value.rgb, vec3( 0.04045 ) ) ) ), value.a );
}
vec4 sRGBTransferOETF( in vec4 value ) {
	return vec4( mix( pow( value.rgb, vec3( 0.41666 ) ) * 1.055 - vec3( 0.055 ), value.rgb * 12.92, vec3( lessThanEqual( value.rgb, vec3( 0.0031308 ) ) ) ), value.a );
}`,V0=`#ifdef USE_ENVMAP
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
#endif`,$0=`#ifdef USE_ENVMAP
	uniform float envMapIntensity;
	uniform float flipEnvMap;
	uniform mat3 envMapRotation;
	#ifdef ENVMAP_TYPE_CUBE
		uniform samplerCube envMap;
	#else
		uniform sampler2D envMap;
	#endif
	
#endif`,W0=`#ifdef USE_ENVMAP
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
#endif`,X0=`#ifdef USE_ENVMAP
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		
		varying vec3 vWorldPosition;
	#else
		varying vec3 vReflect;
		uniform float refractionRatio;
	#endif
#endif`,Y0=`#ifdef USE_ENVMAP
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
#endif`,q0=`#ifdef USE_FOG
	vFogDepth = - mvPosition.z;
#endif`,j0=`#ifdef USE_FOG
	varying float vFogDepth;
#endif`,K0=`#ifdef USE_FOG
	#ifdef FOG_EXP2
		float fogFactor = 1.0 - exp( - fogDensity * fogDensity * vFogDepth * vFogDepth );
	#else
		float fogFactor = smoothstep( fogNear, fogFar, vFogDepth );
	#endif
	gl_FragColor.rgb = mix( gl_FragColor.rgb, fogColor, fogFactor );
#endif`,Z0=`#ifdef USE_FOG
	uniform vec3 fogColor;
	varying float vFogDepth;
	#ifdef FOG_EXP2
		uniform float fogDensity;
	#else
		uniform float fogNear;
		uniform float fogFar;
	#endif
#endif`,J0=`#ifdef USE_GRADIENTMAP
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
}`,Q0=`#ifdef USE_LIGHTMAP
	uniform sampler2D lightMap;
	uniform float lightMapIntensity;
#endif`,ev=`LambertMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularStrength = specularStrength;`,tv=`varying vec3 vViewPosition;
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
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Lambert`,nv=`uniform bool receiveShadow;
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
#endif`,iv=`#ifdef USE_ENVMAP
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
#endif`,sv=`ToonMaterial material;
material.diffuseColor = diffuseColor.rgb;`,rv=`varying vec3 vViewPosition;
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
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Toon`,ov=`BlinnPhongMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularColor = specular;
material.specularShininess = shininess;
material.specularStrength = specularStrength;`,av=`varying vec3 vViewPosition;
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
#define RE_IndirectDiffuse		RE_IndirectDiffuse_BlinnPhong`,lv=`PhysicalMaterial material;
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
#endif`,cv=`struct PhysicalMaterial {
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
}`,uv=`
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
#endif`,dv=`#if defined( RE_IndirectDiffuse )
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
#endif`,hv=`#if defined( RE_IndirectDiffuse )
	RE_IndirectDiffuse( irradiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif
#if defined( RE_IndirectSpecular )
	RE_IndirectSpecular( radiance, iblIrradiance, clearcoatRadiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif`,fv=`#if defined( USE_LOGDEPTHBUF )
	gl_FragDepth = vIsPerspective == 0.0 ? gl_FragCoord.z : log2( vFragDepth ) * logDepthBufFC * 0.5;
#endif`,pv=`#if defined( USE_LOGDEPTHBUF )
	uniform float logDepthBufFC;
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,mv=`#ifdef USE_LOGDEPTHBUF
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,gv=`#ifdef USE_LOGDEPTHBUF
	vFragDepth = 1.0 + gl_Position.w;
	vIsPerspective = float( isPerspectiveMatrix( projectionMatrix ) );
#endif`,_v=`#ifdef USE_MAP
	vec4 sampledDiffuseColor = texture2D( map, vMapUv );
	#ifdef DECODE_VIDEO_TEXTURE
		sampledDiffuseColor = sRGBTransferEOTF( sampledDiffuseColor );
	#endif
	diffuseColor *= sampledDiffuseColor;
#endif`,vv=`#ifdef USE_MAP
	uniform sampler2D map;
#endif`,xv=`#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
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
#endif`,yv=`#if defined( USE_POINTS_UV )
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
#endif`,Sv=`float metalnessFactor = metalness;
#ifdef USE_METALNESSMAP
	vec4 texelMetalness = texture2D( metalnessMap, vMetalnessMapUv );
	metalnessFactor *= texelMetalness.b;
#endif`,Mv=`#ifdef USE_METALNESSMAP
	uniform sampler2D metalnessMap;
#endif`,wv=`#ifdef USE_INSTANCING_MORPH
	float morphTargetInfluences[ MORPHTARGETS_COUNT ];
	float morphTargetBaseInfluence = texelFetch( morphTexture, ivec2( 0, gl_InstanceID ), 0 ).r;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		morphTargetInfluences[i] =  texelFetch( morphTexture, ivec2( i + 1, gl_InstanceID ), 0 ).r;
	}
#endif`,bv=`#if defined( USE_MORPHCOLORS )
	vColor *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		#if defined( USE_COLOR_ALPHA )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ) * morphTargetInfluences[ i ];
		#elif defined( USE_COLOR )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ).rgb * morphTargetInfluences[ i ];
		#endif
	}
#endif`,Ev=`#ifdef USE_MORPHNORMALS
	objectNormal *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) objectNormal += getMorph( gl_VertexID, i, 1 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,Tv=`#ifdef USE_MORPHTARGETS
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
#endif`,Av=`#ifdef USE_MORPHTARGETS
	transformed *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) transformed += getMorph( gl_VertexID, i, 0 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,Rv=`float faceDirection = gl_FrontFacing ? 1.0 : - 1.0;
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
vec3 nonPerturbedNormal = normal;`,Cv=`#ifdef USE_NORMALMAP_OBJECTSPACE
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
#endif`,Pv=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,Lv=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,Dv=`#ifndef FLAT_SHADED
	vNormal = normalize( transformedNormal );
	#ifdef USE_TANGENT
		vTangent = normalize( transformedTangent );
		vBitangent = normalize( cross( vNormal, vTangent ) * tangent.w );
	#endif
#endif`,Iv=`#ifdef USE_NORMALMAP
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
#endif`,Uv=`#ifdef USE_CLEARCOAT
	vec3 clearcoatNormal = nonPerturbedNormal;
#endif`,Nv=`#ifdef USE_CLEARCOAT_NORMALMAP
	vec3 clearcoatMapN = texture2D( clearcoatNormalMap, vClearcoatNormalMapUv ).xyz * 2.0 - 1.0;
	clearcoatMapN.xy *= clearcoatNormalScale;
	clearcoatNormal = normalize( tbn2 * clearcoatMapN );
#endif`,Fv=`#ifdef USE_CLEARCOATMAP
	uniform sampler2D clearcoatMap;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform sampler2D clearcoatNormalMap;
	uniform vec2 clearcoatNormalScale;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform sampler2D clearcoatRoughnessMap;
#endif`,Ov=`#ifdef USE_IRIDESCENCEMAP
	uniform sampler2D iridescenceMap;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform sampler2D iridescenceThicknessMap;
#endif`,Bv=`#ifdef OPAQUE
diffuseColor.a = 1.0;
#endif
#ifdef USE_TRANSMISSION
diffuseColor.a *= material.transmissionAlpha;
#endif
gl_FragColor = vec4( outgoingLight, diffuseColor.a );`,kv=`vec3 packNormalToRGB( const in vec3 normal ) {
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
}`,zv=`#ifdef PREMULTIPLIED_ALPHA
	gl_FragColor.rgb *= gl_FragColor.a;
#endif`,Gv=`vec4 mvPosition = vec4( transformed, 1.0 );
#ifdef USE_BATCHING
	mvPosition = batchingMatrix * mvPosition;
#endif
#ifdef USE_INSTANCING
	mvPosition = instanceMatrix * mvPosition;
#endif
mvPosition = modelViewMatrix * mvPosition;
gl_Position = projectionMatrix * mvPosition;`,Hv=`#ifdef DITHERING
	gl_FragColor.rgb = dithering( gl_FragColor.rgb );
#endif`,Vv=`#ifdef DITHERING
	vec3 dithering( vec3 color ) {
		float grid_position = rand( gl_FragCoord.xy );
		vec3 dither_shift_RGB = vec3( 0.25 / 255.0, -0.25 / 255.0, 0.25 / 255.0 );
		dither_shift_RGB = mix( 2.0 * dither_shift_RGB, -2.0 * dither_shift_RGB, grid_position );
		return color + dither_shift_RGB;
	}
#endif`,$v=`float roughnessFactor = roughness;
#ifdef USE_ROUGHNESSMAP
	vec4 texelRoughness = texture2D( roughnessMap, vRoughnessMapUv );
	roughnessFactor *= texelRoughness.g;
#endif`,Wv=`#ifdef USE_ROUGHNESSMAP
	uniform sampler2D roughnessMap;
#endif`,Xv=`#if NUM_SPOT_LIGHT_COORDS > 0
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
#endif`,Yv=`#if NUM_SPOT_LIGHT_COORDS > 0
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
#endif`,qv=`#if ( defined( USE_SHADOWMAP ) && ( NUM_DIR_LIGHT_SHADOWS > 0 || NUM_POINT_LIGHT_SHADOWS > 0 ) ) || ( NUM_SPOT_LIGHT_COORDS > 0 )
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
#endif`,jv=`float getShadowMask() {
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
}`,Kv=`#ifdef USE_SKINNING
	mat4 boneMatX = getBoneMatrix( skinIndex.x );
	mat4 boneMatY = getBoneMatrix( skinIndex.y );
	mat4 boneMatZ = getBoneMatrix( skinIndex.z );
	mat4 boneMatW = getBoneMatrix( skinIndex.w );
#endif`,Zv=`#ifdef USE_SKINNING
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
#endif`,Jv=`#ifdef USE_SKINNING
	vec4 skinVertex = bindMatrix * vec4( transformed, 1.0 );
	vec4 skinned = vec4( 0.0 );
	skinned += boneMatX * skinVertex * skinWeight.x;
	skinned += boneMatY * skinVertex * skinWeight.y;
	skinned += boneMatZ * skinVertex * skinWeight.z;
	skinned += boneMatW * skinVertex * skinWeight.w;
	transformed = ( bindMatrixInverse * skinned ).xyz;
#endif`,Qv=`#ifdef USE_SKINNING
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
#endif`,ex=`float specularStrength;
#ifdef USE_SPECULARMAP
	vec4 texelSpecular = texture2D( specularMap, vSpecularMapUv );
	specularStrength = texelSpecular.r;
#else
	specularStrength = 1.0;
#endif`,tx=`#ifdef USE_SPECULARMAP
	uniform sampler2D specularMap;
#endif`,nx=`#if defined( TONE_MAPPING )
	gl_FragColor.rgb = toneMapping( gl_FragColor.rgb );
#endif`,ix=`#ifndef saturate
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
vec3 CustomToneMapping( vec3 color ) { return color; }`,sx=`#ifdef USE_TRANSMISSION
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
#endif`,rx=`#ifdef USE_TRANSMISSION
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
#endif`,ox=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
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
#endif`,ax=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
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
#endif`,lx=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
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
#endif`,cx=`#if defined( USE_ENVMAP ) || defined( DISTANCE ) || defined ( USE_SHADOWMAP ) || defined ( USE_TRANSMISSION ) || NUM_SPOT_LIGHT_COORDS > 0
	vec4 worldPosition = vec4( transformed, 1.0 );
	#ifdef USE_BATCHING
		worldPosition = batchingMatrix * worldPosition;
	#endif
	#ifdef USE_INSTANCING
		worldPosition = instanceMatrix * worldPosition;
	#endif
	worldPosition = modelMatrix * worldPosition;
#endif`;const ux=`varying vec2 vUv;
uniform mat3 uvTransform;
void main() {
	vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	gl_Position = vec4( position.xy, 1.0, 1.0 );
}`,dx=`uniform sampler2D t2D;
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
}`,hx=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,fx=`#ifdef ENVMAP_TYPE_CUBE
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
}`,px=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,mx=`uniform samplerCube tCube;
uniform float tFlip;
uniform float opacity;
varying vec3 vWorldDirection;
void main() {
	vec4 texColor = textureCube( tCube, vec3( tFlip * vWorldDirection.x, vWorldDirection.yz ) );
	gl_FragColor = texColor;
	gl_FragColor.a *= opacity;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,gx=`#include <common>
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
}`,_x=`#if DEPTH_PACKING == 3200
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
}`,vx=`#define DISTANCE
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
}`,xx=`#define DISTANCE
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
}`,yx=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
}`,Sx=`uniform sampler2D tEquirect;
varying vec3 vWorldDirection;
#include <common>
void main() {
	vec3 direction = normalize( vWorldDirection );
	vec2 sampleUV = equirectUv( direction );
	gl_FragColor = texture2D( tEquirect, sampleUV );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,Mx=`uniform float scale;
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
}`,wx=`uniform vec3 diffuse;
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
}`,bx=`#include <common>
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
}`,Ex=`uniform vec3 diffuse;
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
}`,Tx=`#define LAMBERT
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
}`,Ax=`#define LAMBERT
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
}`,Rx=`#define MATCAP
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
}`,Cx=`#define MATCAP
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
}`,Px=`#define NORMAL
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
}`,Lx=`#define NORMAL
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
}`,Dx=`#define PHONG
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
}`,Ix=`#define PHONG
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
}`,Ux=`#define STANDARD
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
}`,Nx=`#define STANDARD
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
}`,Fx=`#define TOON
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
}`,Ox=`#define TOON
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
}`,Bx=`uniform float size;
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
}`,kx=`uniform vec3 diffuse;
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
}`,zx=`#include <common>
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
}`,Gx=`uniform vec3 color;
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
}`,Hx=`uniform float rotation;
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
}`,Vx=`uniform vec3 diffuse;
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
}`,Ze={alphahash_fragment:d0,alphahash_pars_fragment:h0,alphamap_fragment:f0,alphamap_pars_fragment:p0,alphatest_fragment:m0,alphatest_pars_fragment:g0,aomap_fragment:_0,aomap_pars_fragment:v0,batching_pars_vertex:x0,batching_vertex:y0,begin_vertex:S0,beginnormal_vertex:M0,bsdfs:w0,iridescence_fragment:b0,bumpmap_pars_fragment:E0,clipping_planes_fragment:T0,clipping_planes_pars_fragment:A0,clipping_planes_pars_vertex:R0,clipping_planes_vertex:C0,color_fragment:P0,color_pars_fragment:L0,color_pars_vertex:D0,color_vertex:I0,common:U0,cube_uv_reflection_fragment:N0,defaultnormal_vertex:F0,displacementmap_pars_vertex:O0,displacementmap_vertex:B0,emissivemap_fragment:k0,emissivemap_pars_fragment:z0,colorspace_fragment:G0,colorspace_pars_fragment:H0,envmap_fragment:V0,envmap_common_pars_fragment:$0,envmap_pars_fragment:W0,envmap_pars_vertex:X0,envmap_physical_pars_fragment:iv,envmap_vertex:Y0,fog_vertex:q0,fog_pars_vertex:j0,fog_fragment:K0,fog_pars_fragment:Z0,gradientmap_pars_fragment:J0,lightmap_pars_fragment:Q0,lights_lambert_fragment:ev,lights_lambert_pars_fragment:tv,lights_pars_begin:nv,lights_toon_fragment:sv,lights_toon_pars_fragment:rv,lights_phong_fragment:ov,lights_phong_pars_fragment:av,lights_physical_fragment:lv,lights_physical_pars_fragment:cv,lights_fragment_begin:uv,lights_fragment_maps:dv,lights_fragment_end:hv,logdepthbuf_fragment:fv,logdepthbuf_pars_fragment:pv,logdepthbuf_pars_vertex:mv,logdepthbuf_vertex:gv,map_fragment:_v,map_pars_fragment:vv,map_particle_fragment:xv,map_particle_pars_fragment:yv,metalnessmap_fragment:Sv,metalnessmap_pars_fragment:Mv,morphinstance_vertex:wv,morphcolor_vertex:bv,morphnormal_vertex:Ev,morphtarget_pars_vertex:Tv,morphtarget_vertex:Av,normal_fragment_begin:Rv,normal_fragment_maps:Cv,normal_pars_fragment:Pv,normal_pars_vertex:Lv,normal_vertex:Dv,normalmap_pars_fragment:Iv,clearcoat_normal_fragment_begin:Uv,clearcoat_normal_fragment_maps:Nv,clearcoat_pars_fragment:Fv,iridescence_pars_fragment:Ov,opaque_fragment:Bv,packing:kv,premultiplied_alpha_fragment:zv,project_vertex:Gv,dithering_fragment:Hv,dithering_pars_fragment:Vv,roughnessmap_fragment:$v,roughnessmap_pars_fragment:Wv,shadowmap_pars_fragment:Xv,shadowmap_pars_vertex:Yv,shadowmap_vertex:qv,shadowmask_pars_fragment:jv,skinbase_vertex:Kv,skinning_pars_vertex:Zv,skinning_vertex:Jv,skinnormal_vertex:Qv,specularmap_fragment:ex,specularmap_pars_fragment:tx,tonemapping_fragment:nx,tonemapping_pars_fragment:ix,transmission_fragment:sx,transmission_pars_fragment:rx,uv_pars_fragment:ox,uv_pars_vertex:ax,uv_vertex:lx,worldpos_vertex:cx,background_vert:ux,background_frag:dx,backgroundCube_vert:hx,backgroundCube_frag:fx,cube_vert:px,cube_frag:mx,depth_vert:gx,depth_frag:_x,distanceRGBA_vert:vx,distanceRGBA_frag:xx,equirect_vert:yx,equirect_frag:Sx,linedashed_vert:Mx,linedashed_frag:wx,meshbasic_vert:bx,meshbasic_frag:Ex,meshlambert_vert:Tx,meshlambert_frag:Ax,meshmatcap_vert:Rx,meshmatcap_frag:Cx,meshnormal_vert:Px,meshnormal_frag:Lx,meshphong_vert:Dx,meshphong_frag:Ix,meshphysical_vert:Ux,meshphysical_frag:Nx,meshtoon_vert:Fx,meshtoon_frag:Ox,points_vert:Bx,points_frag:kx,shadow_vert:zx,shadow_frag:Gx,sprite_vert:Hx,sprite_frag:Vx},ue={common:{diffuse:{value:new Pe(16777215)},opacity:{value:1},map:{value:null},mapTransform:{value:new Ye},alphaMap:{value:null},alphaMapTransform:{value:new Ye},alphaTest:{value:0}},specularmap:{specularMap:{value:null},specularMapTransform:{value:new Ye}},envmap:{envMap:{value:null},envMapRotation:{value:new Ye},flipEnvMap:{value:-1},reflectivity:{value:1},ior:{value:1.5},refractionRatio:{value:.98}},aomap:{aoMap:{value:null},aoMapIntensity:{value:1},aoMapTransform:{value:new Ye}},lightmap:{lightMap:{value:null},lightMapIntensity:{value:1},lightMapTransform:{value:new Ye}},bumpmap:{bumpMap:{value:null},bumpMapTransform:{value:new Ye},bumpScale:{value:1}},normalmap:{normalMap:{value:null},normalMapTransform:{value:new Ye},normalScale:{value:new Ve(1,1)}},displacementmap:{displacementMap:{value:null},displacementMapTransform:{value:new Ye},displacementScale:{value:1},displacementBias:{value:0}},emissivemap:{emissiveMap:{value:null},emissiveMapTransform:{value:new Ye}},metalnessmap:{metalnessMap:{value:null},metalnessMapTransform:{value:new Ye}},roughnessmap:{roughnessMap:{value:null},roughnessMapTransform:{value:new Ye}},gradientmap:{gradientMap:{value:null}},fog:{fogDensity:{value:25e-5},fogNear:{value:1},fogFar:{value:2e3},fogColor:{value:new Pe(16777215)}},lights:{ambientLightColor:{value:[]},lightProbe:{value:[]},directionalLights:{value:[],properties:{direction:{},color:{}}},directionalLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},directionalShadowMap:{value:[]},directionalShadowMatrix:{value:[]},spotLights:{value:[],properties:{color:{},position:{},direction:{},distance:{},coneCos:{},penumbraCos:{},decay:{}}},spotLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},spotLightMap:{value:[]},spotShadowMap:{value:[]},spotLightMatrix:{value:[]},pointLights:{value:[],properties:{color:{},position:{},decay:{},distance:{}}},pointLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{},shadowCameraNear:{},shadowCameraFar:{}}},pointShadowMap:{value:[]},pointShadowMatrix:{value:[]},hemisphereLights:{value:[],properties:{direction:{},skyColor:{},groundColor:{}}},rectAreaLights:{value:[],properties:{color:{},position:{},width:{},height:{}}},ltc_1:{value:null},ltc_2:{value:null}},points:{diffuse:{value:new Pe(16777215)},opacity:{value:1},size:{value:1},scale:{value:1},map:{value:null},alphaMap:{value:null},alphaMapTransform:{value:new Ye},alphaTest:{value:0},uvTransform:{value:new Ye}},sprite:{diffuse:{value:new Pe(16777215)},opacity:{value:1},center:{value:new Ve(.5,.5)},rotation:{value:0},map:{value:null},mapTransform:{value:new Ye},alphaMap:{value:null},alphaMapTransform:{value:new Ye},alphaTest:{value:0}}},Rn={basic:{uniforms:Gt([ue.common,ue.specularmap,ue.envmap,ue.aomap,ue.lightmap,ue.fog]),vertexShader:Ze.meshbasic_vert,fragmentShader:Ze.meshbasic_frag},lambert:{uniforms:Gt([ue.common,ue.specularmap,ue.envmap,ue.aomap,ue.lightmap,ue.emissivemap,ue.bumpmap,ue.normalmap,ue.displacementmap,ue.fog,ue.lights,{emissive:{value:new Pe(0)}}]),vertexShader:Ze.meshlambert_vert,fragmentShader:Ze.meshlambert_frag},phong:{uniforms:Gt([ue.common,ue.specularmap,ue.envmap,ue.aomap,ue.lightmap,ue.emissivemap,ue.bumpmap,ue.normalmap,ue.displacementmap,ue.fog,ue.lights,{emissive:{value:new Pe(0)},specular:{value:new Pe(1118481)},shininess:{value:30}}]),vertexShader:Ze.meshphong_vert,fragmentShader:Ze.meshphong_frag},standard:{uniforms:Gt([ue.common,ue.envmap,ue.aomap,ue.lightmap,ue.emissivemap,ue.bumpmap,ue.normalmap,ue.displacementmap,ue.roughnessmap,ue.metalnessmap,ue.fog,ue.lights,{emissive:{value:new Pe(0)},roughness:{value:1},metalness:{value:0},envMapIntensity:{value:1}}]),vertexShader:Ze.meshphysical_vert,fragmentShader:Ze.meshphysical_frag},toon:{uniforms:Gt([ue.common,ue.aomap,ue.lightmap,ue.emissivemap,ue.bumpmap,ue.normalmap,ue.displacementmap,ue.gradientmap,ue.fog,ue.lights,{emissive:{value:new Pe(0)}}]),vertexShader:Ze.meshtoon_vert,fragmentShader:Ze.meshtoon_frag},matcap:{uniforms:Gt([ue.common,ue.bumpmap,ue.normalmap,ue.displacementmap,ue.fog,{matcap:{value:null}}]),vertexShader:Ze.meshmatcap_vert,fragmentShader:Ze.meshmatcap_frag},points:{uniforms:Gt([ue.points,ue.fog]),vertexShader:Ze.points_vert,fragmentShader:Ze.points_frag},dashed:{uniforms:Gt([ue.common,ue.fog,{scale:{value:1},dashSize:{value:1},totalSize:{value:2}}]),vertexShader:Ze.linedashed_vert,fragmentShader:Ze.linedashed_frag},depth:{uniforms:Gt([ue.common,ue.displacementmap]),vertexShader:Ze.depth_vert,fragmentShader:Ze.depth_frag},normal:{uniforms:Gt([ue.common,ue.bumpmap,ue.normalmap,ue.displacementmap,{opacity:{value:1}}]),vertexShader:Ze.meshnormal_vert,fragmentShader:Ze.meshnormal_frag},sprite:{uniforms:Gt([ue.sprite,ue.fog]),vertexShader:Ze.sprite_vert,fragmentShader:Ze.sprite_frag},background:{uniforms:{uvTransform:{value:new Ye},t2D:{value:null},backgroundIntensity:{value:1}},vertexShader:Ze.background_vert,fragmentShader:Ze.background_frag},backgroundCube:{uniforms:{envMap:{value:null},flipEnvMap:{value:-1},backgroundBlurriness:{value:0},backgroundIntensity:{value:1},backgroundRotation:{value:new Ye}},vertexShader:Ze.backgroundCube_vert,fragmentShader:Ze.backgroundCube_frag},cube:{uniforms:{tCube:{value:null},tFlip:{value:-1},opacity:{value:1}},vertexShader:Ze.cube_vert,fragmentShader:Ze.cube_frag},equirect:{uniforms:{tEquirect:{value:null}},vertexShader:Ze.equirect_vert,fragmentShader:Ze.equirect_frag},distanceRGBA:{uniforms:Gt([ue.common,ue.displacementmap,{referencePosition:{value:new F},nearDistance:{value:1},farDistance:{value:1e3}}]),vertexShader:Ze.distanceRGBA_vert,fragmentShader:Ze.distanceRGBA_frag},shadow:{uniforms:Gt([ue.lights,ue.fog,{color:{value:new Pe(0)},opacity:{value:1}}]),vertexShader:Ze.shadow_vert,fragmentShader:Ze.shadow_frag}};Rn.physical={uniforms:Gt([Rn.standard.uniforms,{clearcoat:{value:0},clearcoatMap:{value:null},clearcoatMapTransform:{value:new Ye},clearcoatNormalMap:{value:null},clearcoatNormalMapTransform:{value:new Ye},clearcoatNormalScale:{value:new Ve(1,1)},clearcoatRoughness:{value:0},clearcoatRoughnessMap:{value:null},clearcoatRoughnessMapTransform:{value:new Ye},dispersion:{value:0},iridescence:{value:0},iridescenceMap:{value:null},iridescenceMapTransform:{value:new Ye},iridescenceIOR:{value:1.3},iridescenceThicknessMinimum:{value:100},iridescenceThicknessMaximum:{value:400},iridescenceThicknessMap:{value:null},iridescenceThicknessMapTransform:{value:new Ye},sheen:{value:0},sheenColor:{value:new Pe(0)},sheenColorMap:{value:null},sheenColorMapTransform:{value:new Ye},sheenRoughness:{value:1},sheenRoughnessMap:{value:null},sheenRoughnessMapTransform:{value:new Ye},transmission:{value:0},transmissionMap:{value:null},transmissionMapTransform:{value:new Ye},transmissionSamplerSize:{value:new Ve},transmissionSamplerMap:{value:null},thickness:{value:0},thicknessMap:{value:null},thicknessMapTransform:{value:new Ye},attenuationDistance:{value:0},attenuationColor:{value:new Pe(0)},specularColor:{value:new Pe(1,1,1)},specularColorMap:{value:null},specularColorMapTransform:{value:new Ye},specularIntensity:{value:1},specularIntensityMap:{value:null},specularIntensityMapTransform:{value:new Ye},anisotropyVector:{value:new Ve},anisotropyMap:{value:null},anisotropyMapTransform:{value:new Ye}}]),vertexShader:Ze.meshphysical_vert,fragmentShader:Ze.meshphysical_frag};const po={r:0,b:0,g:0},Li=new Fn,$x=new rt;function Wx(n,e,t,i,s,r,o){const a=new Pe(0);let l=r===!0?0:1,c,u,d=null,h=0,p=null;function g(b){let E=b.isScene===!0?b.background:null;return E&&E.isTexture&&(E=(b.backgroundBlurriness>0?t:e).get(E)),E}function _(b){let E=!1;const L=g(b);L===null?f(a,l):L&&L.isColor&&(f(L,1),E=!0);const T=n.xr.getEnvironmentBlendMode();T==="additive"?i.buffers.color.setClear(0,0,0,1,o):T==="alpha-blend"&&i.buffers.color.setClear(0,0,0,0,o),(n.autoClear||E)&&(i.buffers.depth.setTest(!0),i.buffers.depth.setMask(!0),i.buffers.color.setMask(!0),n.clear(n.autoClearColor,n.autoClearDepth,n.autoClearStencil))}function m(b,E){const L=g(E);L&&(L.isCubeTexture||L.mapping===ia)?(u===void 0&&(u=new vn(new rn(1,1,1),new wi({name:"BackgroundCubeMaterial",uniforms:Fs(Rn.backgroundCube.uniforms),vertexShader:Rn.backgroundCube.vertexShader,fragmentShader:Rn.backgroundCube.fragmentShader,side:Zt,depthTest:!1,depthWrite:!1,fog:!1,allowOverride:!1})),u.geometry.deleteAttribute("normal"),u.geometry.deleteAttribute("uv"),u.onBeforeRender=function(T,A,R){this.matrixWorld.copyPosition(R.matrixWorld)},Object.defineProperty(u.material,"envMap",{get:function(){return this.uniforms.envMap.value}}),s.update(u)),Li.copy(E.backgroundRotation),Li.x*=-1,Li.y*=-1,Li.z*=-1,L.isCubeTexture&&L.isRenderTargetTexture===!1&&(Li.y*=-1,Li.z*=-1),u.material.uniforms.envMap.value=L,u.material.uniforms.flipEnvMap.value=L.isCubeTexture&&L.isRenderTargetTexture===!1?-1:1,u.material.uniforms.backgroundBlurriness.value=E.backgroundBlurriness,u.material.uniforms.backgroundIntensity.value=E.backgroundIntensity,u.material.uniforms.backgroundRotation.value.setFromMatrix4($x.makeRotationFromEuler(Li)),u.material.toneMapped=it.getTransfer(L.colorSpace)!==ct,(d!==L||h!==L.version||p!==n.toneMapping)&&(u.material.needsUpdate=!0,d=L,h=L.version,p=n.toneMapping),u.layers.enableAll(),b.unshift(u,u.geometry,u.material,0,0,null)):L&&L.isTexture&&(c===void 0&&(c=new vn(new oa(2,2),new wi({name:"BackgroundMaterial",uniforms:Fs(Rn.background.uniforms),vertexShader:Rn.background.vertexShader,fragmentShader:Rn.background.fragmentShader,side:Mi,depthTest:!1,depthWrite:!1,fog:!1,allowOverride:!1})),c.geometry.deleteAttribute("normal"),Object.defineProperty(c.material,"map",{get:function(){return this.uniforms.t2D.value}}),s.update(c)),c.material.uniforms.t2D.value=L,c.material.uniforms.backgroundIntensity.value=E.backgroundIntensity,c.material.toneMapped=it.getTransfer(L.colorSpace)!==ct,L.matrixAutoUpdate===!0&&L.updateMatrix(),c.material.uniforms.uvTransform.value.copy(L.matrix),(d!==L||h!==L.version||p!==n.toneMapping)&&(c.material.needsUpdate=!0,d=L,h=L.version,p=n.toneMapping),c.layers.enableAll(),b.unshift(c,c.geometry,c.material,0,0,null))}function f(b,E){b.getRGB(po,Qf(n)),i.buffers.color.setClear(po.r,po.g,po.b,E,o)}function M(){u!==void 0&&(u.geometry.dispose(),u.material.dispose(),u=void 0),c!==void 0&&(c.geometry.dispose(),c.material.dispose(),c=void 0)}return{getClearColor:function(){return a},setClearColor:function(b,E=1){a.set(b),l=E,f(a,l)},getClearAlpha:function(){return l},setClearAlpha:function(b){l=b,f(a,l)},render:_,addToRenderList:m,dispose:M}}function Xx(n,e){const t=n.getParameter(n.MAX_VERTEX_ATTRIBS),i={},s=h(null);let r=s,o=!1;function a(y,D,$,k,q){let Z=!1;const V=d(k,$,D);r!==V&&(r=V,c(r.object)),Z=p(y,k,$,q),Z&&g(y,k,$,q),q!==null&&e.update(q,n.ELEMENT_ARRAY_BUFFER),(Z||o)&&(o=!1,E(y,D,$,k),q!==null&&n.bindBuffer(n.ELEMENT_ARRAY_BUFFER,e.get(q).buffer))}function l(){return n.createVertexArray()}function c(y){return n.bindVertexArray(y)}function u(y){return n.deleteVertexArray(y)}function d(y,D,$){const k=$.wireframe===!0;let q=i[y.id];q===void 0&&(q={},i[y.id]=q);let Z=q[D.id];Z===void 0&&(Z={},q[D.id]=Z);let V=Z[k];return V===void 0&&(V=h(l()),Z[k]=V),V}function h(y){const D=[],$=[],k=[];for(let q=0;q<t;q++)D[q]=0,$[q]=0,k[q]=0;return{geometry:null,program:null,wireframe:!1,newAttributes:D,enabledAttributes:$,attributeDivisors:k,object:y,attributes:{},index:null}}function p(y,D,$,k){const q=r.attributes,Z=D.attributes;let V=0;const ie=$.getAttributes();for(const H in ie)if(ie[H].location>=0){const me=q[H];let Te=Z[H];if(Te===void 0&&(H==="instanceMatrix"&&y.instanceMatrix&&(Te=y.instanceMatrix),H==="instanceColor"&&y.instanceColor&&(Te=y.instanceColor)),me===void 0||me.attribute!==Te||Te&&me.data!==Te.data)return!0;V++}return r.attributesNum!==V||r.index!==k}function g(y,D,$,k){const q={},Z=D.attributes;let V=0;const ie=$.getAttributes();for(const H in ie)if(ie[H].location>=0){let me=Z[H];me===void 0&&(H==="instanceMatrix"&&y.instanceMatrix&&(me=y.instanceMatrix),H==="instanceColor"&&y.instanceColor&&(me=y.instanceColor));const Te={};Te.attribute=me,me&&me.data&&(Te.data=me.data),q[H]=Te,V++}r.attributes=q,r.attributesNum=V,r.index=k}function _(){const y=r.newAttributes;for(let D=0,$=y.length;D<$;D++)y[D]=0}function m(y){f(y,0)}function f(y,D){const $=r.newAttributes,k=r.enabledAttributes,q=r.attributeDivisors;$[y]=1,k[y]===0&&(n.enableVertexAttribArray(y),k[y]=1),q[y]!==D&&(n.vertexAttribDivisor(y,D),q[y]=D)}function M(){const y=r.newAttributes,D=r.enabledAttributes;for(let $=0,k=D.length;$<k;$++)D[$]!==y[$]&&(n.disableVertexAttribArray($),D[$]=0)}function b(y,D,$,k,q,Z,V){V===!0?n.vertexAttribIPointer(y,D,$,q,Z):n.vertexAttribPointer(y,D,$,k,q,Z)}function E(y,D,$,k){_();const q=k.attributes,Z=$.getAttributes(),V=D.defaultAttributeValues;for(const ie in Z){const H=Z[ie];if(H.location>=0){let oe=q[ie];if(oe===void 0&&(ie==="instanceMatrix"&&y.instanceMatrix&&(oe=y.instanceMatrix),ie==="instanceColor"&&y.instanceColor&&(oe=y.instanceColor)),oe!==void 0){const me=oe.normalized,Te=oe.itemSize,$e=e.get(oe);if($e===void 0)continue;const je=$e.buffer,X=$e.type,ae=$e.bytesPerElement,Ee=X===n.INT||X===n.UNSIGNED_INT||oe.gpuType===qc;if(oe.isInterleavedBufferAttribute){const he=oe.data,we=he.stride,Qe=oe.offset;if(he.isInstancedInterleavedBuffer){for(let Y=0;Y<H.locationSize;Y++)f(H.location+Y,he.meshPerAttribute);y.isInstancedMesh!==!0&&k._maxInstanceCount===void 0&&(k._maxInstanceCount=he.meshPerAttribute*he.count)}else for(let Y=0;Y<H.locationSize;Y++)m(H.location+Y);n.bindBuffer(n.ARRAY_BUFFER,je);for(let Y=0;Y<H.locationSize;Y++)b(H.location+Y,Te/H.locationSize,X,me,we*ae,(Qe+Te/H.locationSize*Y)*ae,Ee)}else{if(oe.isInstancedBufferAttribute){for(let he=0;he<H.locationSize;he++)f(H.location+he,oe.meshPerAttribute);y.isInstancedMesh!==!0&&k._maxInstanceCount===void 0&&(k._maxInstanceCount=oe.meshPerAttribute*oe.count)}else for(let he=0;he<H.locationSize;he++)m(H.location+he);n.bindBuffer(n.ARRAY_BUFFER,je);for(let he=0;he<H.locationSize;he++)b(H.location+he,Te/H.locationSize,X,me,Te*ae,Te/H.locationSize*he*ae,Ee)}}else if(V!==void 0){const me=V[ie];if(me!==void 0)switch(me.length){case 2:n.vertexAttrib2fv(H.location,me);break;case 3:n.vertexAttrib3fv(H.location,me);break;case 4:n.vertexAttrib4fv(H.location,me);break;default:n.vertexAttrib1fv(H.location,me)}}}}M()}function L(){R();for(const y in i){const D=i[y];for(const $ in D){const k=D[$];for(const q in k)u(k[q].object),delete k[q];delete D[$]}delete i[y]}}function T(y){if(i[y.id]===void 0)return;const D=i[y.id];for(const $ in D){const k=D[$];for(const q in k)u(k[q].object),delete k[q];delete D[$]}delete i[y.id]}function A(y){for(const D in i){const $=i[D];if($[y.id]===void 0)continue;const k=$[y.id];for(const q in k)u(k[q].object),delete k[q];delete $[y.id]}}function R(){S(),o=!0,r!==s&&(r=s,c(r.object))}function S(){s.geometry=null,s.program=null,s.wireframe=!1}return{setup:a,reset:R,resetDefaultState:S,dispose:L,releaseStatesOfGeometry:T,releaseStatesOfProgram:A,initAttributes:_,enableAttribute:m,disableUnusedAttributes:M}}function Yx(n,e,t){let i;function s(c){i=c}function r(c,u){n.drawArrays(i,c,u),t.update(u,i,1)}function o(c,u,d){d!==0&&(n.drawArraysInstanced(i,c,u,d),t.update(u,i,d))}function a(c,u,d){if(d===0)return;e.get("WEBGL_multi_draw").multiDrawArraysWEBGL(i,c,0,u,0,d);let p=0;for(let g=0;g<d;g++)p+=u[g];t.update(p,i,1)}function l(c,u,d,h){if(d===0)return;const p=e.get("WEBGL_multi_draw");if(p===null)for(let g=0;g<c.length;g++)o(c[g],u[g],h[g]);else{p.multiDrawArraysInstancedWEBGL(i,c,0,u,0,h,0,d);let g=0;for(let _=0;_<d;_++)g+=u[_]*h[_];t.update(g,i,1)}}this.setMode=s,this.render=r,this.renderInstances=o,this.renderMultiDraw=a,this.renderMultiDrawInstances=l}function qx(n,e,t,i){let s;function r(){if(s!==void 0)return s;if(e.has("EXT_texture_filter_anisotropic")===!0){const A=e.get("EXT_texture_filter_anisotropic");s=n.getParameter(A.MAX_TEXTURE_MAX_ANISOTROPY_EXT)}else s=0;return s}function o(A){return!(A!==Tn&&i.convert(A)!==n.getParameter(n.IMPLEMENTATION_COLOR_READ_FORMAT))}function a(A){const R=A===Er&&(e.has("EXT_color_buffer_half_float")||e.has("EXT_color_buffer_float"));return!(A!==Nn&&i.convert(A)!==n.getParameter(n.IMPLEMENTATION_COLOR_READ_TYPE)&&A!==Pn&&!R)}function l(A){if(A==="highp"){if(n.getShaderPrecisionFormat(n.VERTEX_SHADER,n.HIGH_FLOAT).precision>0&&n.getShaderPrecisionFormat(n.FRAGMENT_SHADER,n.HIGH_FLOAT).precision>0)return"highp";A="mediump"}return A==="mediump"&&n.getShaderPrecisionFormat(n.VERTEX_SHADER,n.MEDIUM_FLOAT).precision>0&&n.getShaderPrecisionFormat(n.FRAGMENT_SHADER,n.MEDIUM_FLOAT).precision>0?"mediump":"lowp"}let c=t.precision!==void 0?t.precision:"highp";const u=l(c);u!==c&&(console.warn("THREE.WebGLRenderer:",c,"not supported, using",u,"instead."),c=u);const d=t.logarithmicDepthBuffer===!0,h=t.reverseDepthBuffer===!0&&e.has("EXT_clip_control"),p=n.getParameter(n.MAX_TEXTURE_IMAGE_UNITS),g=n.getParameter(n.MAX_VERTEX_TEXTURE_IMAGE_UNITS),_=n.getParameter(n.MAX_TEXTURE_SIZE),m=n.getParameter(n.MAX_CUBE_MAP_TEXTURE_SIZE),f=n.getParameter(n.MAX_VERTEX_ATTRIBS),M=n.getParameter(n.MAX_VERTEX_UNIFORM_VECTORS),b=n.getParameter(n.MAX_VARYING_VECTORS),E=n.getParameter(n.MAX_FRAGMENT_UNIFORM_VECTORS),L=g>0,T=n.getParameter(n.MAX_SAMPLES);return{isWebGL2:!0,getMaxAnisotropy:r,getMaxPrecision:l,textureFormatReadable:o,textureTypeReadable:a,precision:c,logarithmicDepthBuffer:d,reverseDepthBuffer:h,maxTextures:p,maxVertexTextures:g,maxTextureSize:_,maxCubemapSize:m,maxAttributes:f,maxVertexUniforms:M,maxVaryings:b,maxFragmentUniforms:E,vertexTextures:L,maxSamples:T}}function jx(n){const e=this;let t=null,i=0,s=!1,r=!1;const o=new ai,a=new Ye,l={value:null,needsUpdate:!1};this.uniform=l,this.numPlanes=0,this.numIntersection=0,this.init=function(d,h){const p=d.length!==0||h||i!==0||s;return s=h,i=d.length,p},this.beginShadows=function(){r=!0,u(null)},this.endShadows=function(){r=!1},this.setGlobalState=function(d,h){t=u(d,h,0)},this.setState=function(d,h,p){const g=d.clippingPlanes,_=d.clipIntersection,m=d.clipShadows,f=n.get(d);if(!s||g===null||g.length===0||r&&!m)r?u(null):c();else{const M=r?0:i,b=M*4;let E=f.clippingState||null;l.value=E,E=u(g,h,b,p);for(let L=0;L!==b;++L)E[L]=t[L];f.clippingState=E,this.numIntersection=_?this.numPlanes:0,this.numPlanes+=M}};function c(){l.value!==t&&(l.value=t,l.needsUpdate=i>0),e.numPlanes=i,e.numIntersection=0}function u(d,h,p,g){const _=d!==null?d.length:0;let m=null;if(_!==0){if(m=l.value,g!==!0||m===null){const f=p+_*4,M=h.matrixWorldInverse;a.getNormalMatrix(M),(m===null||m.length<f)&&(m=new Float32Array(f));for(let b=0,E=p;b!==_;++b,E+=4)o.copy(d[b]).applyMatrix4(M,a),o.normal.toArray(m,E),m[E+3]=o.constant}l.value=m,l.needsUpdate=!0}return e.numPlanes=_,e.numIntersection=0,m}}function Kx(n){let e=new WeakMap;function t(o,a){return a===Al?o.mapping=Is:a===Rl&&(o.mapping=Us),o}function i(o){if(o&&o.isTexture){const a=o.mapping;if(a===Al||a===Rl)if(e.has(o)){const l=e.get(o).texture;return t(l,o.mapping)}else{const l=o.image;if(l&&l.height>0){const c=new Y_(l.height);return c.fromEquirectangularTexture(n,o),e.set(o,c),o.addEventListener("dispose",s),t(c.texture,o.mapping)}else return null}}return o}function s(o){const a=o.target;a.removeEventListener("dispose",s);const l=e.get(a);l!==void 0&&(e.delete(a),l.dispose())}function r(){e=new WeakMap}return{get:i,dispose:r}}const Ms=4,$d=[.125,.215,.35,.446,.526,.582],Ni=20,Ka=new op,Wd=new Pe;let Za=null,Ja=0,Qa=0,el=!1;const Ii=(1+Math.sqrt(5))/2,gs=1/Ii,Xd=[new F(-Ii,gs,0),new F(Ii,gs,0),new F(-gs,0,Ii),new F(gs,0,Ii),new F(0,Ii,-gs),new F(0,Ii,gs),new F(-1,1,-1),new F(1,1,-1),new F(-1,1,1),new F(1,1,1)],Zx=new F;class Yd{constructor(e){this._renderer=e,this._pingPongRenderTarget=null,this._lodMax=0,this._cubeSize=0,this._lodPlanes=[],this._sizeLods=[],this._sigmas=[],this._blurMaterial=null,this._cubemapMaterial=null,this._equirectMaterial=null,this._compileMaterial(this._blurMaterial)}fromScene(e,t=0,i=.1,s=100,r={}){const{size:o=256,position:a=Zx}=r;Za=this._renderer.getRenderTarget(),Ja=this._renderer.getActiveCubeFace(),Qa=this._renderer.getActiveMipmapLevel(),el=this._renderer.xr.enabled,this._renderer.xr.enabled=!1,this._setSize(o);const l=this._allocateTargets();return l.depthBuffer=!0,this._sceneToCubeUV(e,i,s,l,a),t>0&&this._blur(l,0,0,t),this._applyPMREM(l),this._cleanup(l),l}fromEquirectangular(e,t=null){return this._fromTexture(e,t)}fromCubemap(e,t=null){return this._fromTexture(e,t)}compileCubemapShader(){this._cubemapMaterial===null&&(this._cubemapMaterial=Kd(),this._compileMaterial(this._cubemapMaterial))}compileEquirectangularShader(){this._equirectMaterial===null&&(this._equirectMaterial=jd(),this._compileMaterial(this._equirectMaterial))}dispose(){this._dispose(),this._cubemapMaterial!==null&&this._cubemapMaterial.dispose(),this._equirectMaterial!==null&&this._equirectMaterial.dispose()}_setSize(e){this._lodMax=Math.floor(Math.log2(e)),this._cubeSize=Math.pow(2,this._lodMax)}_dispose(){this._blurMaterial!==null&&this._blurMaterial.dispose(),this._pingPongRenderTarget!==null&&this._pingPongRenderTarget.dispose();for(let e=0;e<this._lodPlanes.length;e++)this._lodPlanes[e].dispose()}_cleanup(e){this._renderer.setRenderTarget(Za,Ja,Qa),this._renderer.xr.enabled=el,e.scissorTest=!1,mo(e,0,0,e.width,e.height)}_fromTexture(e,t){e.mapping===Is||e.mapping===Us?this._setSize(e.image.length===0?16:e.image[0].width||e.image[0].image.width):this._setSize(e.image.width/4),Za=this._renderer.getRenderTarget(),Ja=this._renderer.getActiveCubeFace(),Qa=this._renderer.getActiveMipmapLevel(),el=this._renderer.xr.enabled,this._renderer.xr.enabled=!1;const i=t||this._allocateTargets();return this._textureToCubeUV(e,i),this._applyPMREM(i),this._cleanup(i),i}_allocateTargets(){const e=3*Math.max(this._cubeSize,112),t=4*this._cubeSize,i={magFilter:Cn,minFilter:Cn,generateMipmaps:!1,type:Er,format:Tn,colorSpace:Ns,depthBuffer:!1},s=qd(e,t,i);if(this._pingPongRenderTarget===null||this._pingPongRenderTarget.width!==e||this._pingPongRenderTarget.height!==t){this._pingPongRenderTarget!==null&&this._dispose(),this._pingPongRenderTarget=qd(e,t,i);const{_lodMax:r}=this;({sizeLods:this._sizeLods,lodPlanes:this._lodPlanes,sigmas:this._sigmas}=Jx(r)),this._blurMaterial=Qx(r,e,t)}return s}_compileMaterial(e){const t=new vn(this._lodPlanes[0],e);this._renderer.compile(t,Ka)}_sceneToCubeUV(e,t,i,s,r){const l=new sn(90,1,t,i),c=[1,-1,1,1,1,1],u=[1,1,1,-1,-1,-1],d=this._renderer,h=d.autoClear,p=d.toneMapping;d.getClearColor(Wd),d.toneMapping=xi,d.autoClear=!1;const g=new sa({name:"PMREM.Background",side:Zt,depthWrite:!1,depthTest:!1}),_=new vn(new rn,g);let m=!1;const f=e.background;f?f.isColor&&(g.color.copy(f),e.background=null,m=!0):(g.color.copy(Wd),m=!0);for(let M=0;M<6;M++){const b=M%3;b===0?(l.up.set(0,c[M],0),l.position.set(r.x,r.y,r.z),l.lookAt(r.x+u[M],r.y,r.z)):b===1?(l.up.set(0,0,c[M]),l.position.set(r.x,r.y,r.z),l.lookAt(r.x,r.y+u[M],r.z)):(l.up.set(0,c[M],0),l.position.set(r.x,r.y,r.z),l.lookAt(r.x,r.y,r.z+u[M]));const E=this._cubeSize;mo(s,b*E,M>2?E:0,E,E),d.setRenderTarget(s),m&&d.render(_,l),d.render(e,l)}_.geometry.dispose(),_.material.dispose(),d.toneMapping=p,d.autoClear=h,e.background=f}_textureToCubeUV(e,t){const i=this._renderer,s=e.mapping===Is||e.mapping===Us;s?(this._cubemapMaterial===null&&(this._cubemapMaterial=Kd()),this._cubemapMaterial.uniforms.flipEnvMap.value=e.isRenderTargetTexture===!1?-1:1):this._equirectMaterial===null&&(this._equirectMaterial=jd());const r=s?this._cubemapMaterial:this._equirectMaterial,o=new vn(this._lodPlanes[0],r),a=r.uniforms;a.envMap.value=e;const l=this._cubeSize;mo(t,0,0,3*l,2*l),i.setRenderTarget(t),i.render(o,Ka)}_applyPMREM(e){const t=this._renderer,i=t.autoClear;t.autoClear=!1;const s=this._lodPlanes.length;for(let r=1;r<s;r++){const o=Math.sqrt(this._sigmas[r]*this._sigmas[r]-this._sigmas[r-1]*this._sigmas[r-1]),a=Xd[(s-r-1)%Xd.length];this._blur(e,r-1,r,o,a)}t.autoClear=i}_blur(e,t,i,s,r){const o=this._pingPongRenderTarget;this._halfBlur(e,o,t,i,s,"latitudinal",r),this._halfBlur(o,e,i,i,s,"longitudinal",r)}_halfBlur(e,t,i,s,r,o,a){const l=this._renderer,c=this._blurMaterial;o!=="latitudinal"&&o!=="longitudinal"&&console.error("blur direction must be either latitudinal or longitudinal!");const u=3,d=new vn(this._lodPlanes[s],c),h=c.uniforms,p=this._sizeLods[i]-1,g=isFinite(r)?Math.PI/(2*p):2*Math.PI/(2*Ni-1),_=r/g,m=isFinite(r)?1+Math.floor(u*_):Ni;m>Ni&&console.warn(`sigmaRadians, ${r}, is too large and will clip, as it requested ${m} samples when the maximum is set to ${Ni}`);const f=[];let M=0;for(let A=0;A<Ni;++A){const R=A/_,S=Math.exp(-R*R/2);f.push(S),A===0?M+=S:A<m&&(M+=2*S)}for(let A=0;A<f.length;A++)f[A]=f[A]/M;h.envMap.value=e.texture,h.samples.value=m,h.weights.value=f,h.latitudinal.value=o==="latitudinal",a&&(h.poleAxis.value=a);const{_lodMax:b}=this;h.dTheta.value=g,h.mipInt.value=b-i;const E=this._sizeLods[s],L=3*E*(s>b-Ms?s-b+Ms:0),T=4*(this._cubeSize-E);mo(t,L,T,3*E,2*E),l.setRenderTarget(t),l.render(d,Ka)}}function Jx(n){const e=[],t=[],i=[];let s=n;const r=n-Ms+1+$d.length;for(let o=0;o<r;o++){const a=Math.pow(2,s);t.push(a);let l=1/a;o>n-Ms?l=$d[o-n+Ms-1]:o===0&&(l=0),i.push(l);const c=1/(a-2),u=-c,d=1+c,h=[u,u,d,u,d,d,u,u,d,d,u,d],p=6,g=6,_=3,m=2,f=1,M=new Float32Array(_*g*p),b=new Float32Array(m*g*p),E=new Float32Array(f*g*p);for(let T=0;T<p;T++){const A=T%3*2/3-1,R=T>2?0:-1,S=[A,R,0,A+2/3,R,0,A+2/3,R+1,0,A,R,0,A+2/3,R+1,0,A,R+1,0];M.set(S,_*g*T),b.set(h,m*g*T);const y=[T,T,T,T,T,T];E.set(y,f*g*T)}const L=new Ft;L.setAttribute("position",new Ut(M,_)),L.setAttribute("uv",new Ut(b,m)),L.setAttribute("faceIndex",new Ut(E,f)),e.push(L),s>Ms&&s--}return{lodPlanes:e,sizeLods:t,sigmas:i}}function qd(n,e,t){const i=new Wi(n,e,t);return i.texture.mapping=ia,i.texture.name="PMREM.cubeUv",i.scissorTest=!0,i}function mo(n,e,t,i,s){n.viewport.set(e,t,i,s),n.scissor.set(e,t,i,s)}function Qx(n,e,t){const i=new Float32Array(Ni),s=new F(0,1,0);return new wi({name:"SphericalGaussianBlur",defines:{n:Ni,CUBEUV_TEXEL_WIDTH:1/e,CUBEUV_TEXEL_HEIGHT:1/t,CUBEUV_MAX_MIP:`${n}.0`},uniforms:{envMap:{value:null},samples:{value:1},weights:{value:i},latitudinal:{value:!1},dTheta:{value:0},mipInt:{value:0},poleAxis:{value:s}},vertexShader:ru(),fragmentShader:`

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
		`,blending:vi,depthTest:!1,depthWrite:!1})}function jd(){return new wi({name:"EquirectangularToCubeUV",uniforms:{envMap:{value:null}},vertexShader:ru(),fragmentShader:`

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
		`,blending:vi,depthTest:!1,depthWrite:!1})}function Kd(){return new wi({name:"CubemapToCubeUV",uniforms:{envMap:{value:null},flipEnvMap:{value:-1}},vertexShader:ru(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			uniform float flipEnvMap;

			varying vec3 vOutputDirection;

			uniform samplerCube envMap;

			void main() {

				gl_FragColor = textureCube( envMap, vec3( flipEnvMap * vOutputDirection.x, vOutputDirection.yz ) );

			}
		`,blending:vi,depthTest:!1,depthWrite:!1})}function ru(){return`

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
	`}function ey(n){let e=new WeakMap,t=null;function i(a){if(a&&a.isTexture){const l=a.mapping,c=l===Al||l===Rl,u=l===Is||l===Us;if(c||u){let d=e.get(a);const h=d!==void 0?d.texture.pmremVersion:0;if(a.isRenderTargetTexture&&a.pmremVersion!==h)return t===null&&(t=new Yd(n)),d=c?t.fromEquirectangular(a,d):t.fromCubemap(a,d),d.texture.pmremVersion=a.pmremVersion,e.set(a,d),d.texture;if(d!==void 0)return d.texture;{const p=a.image;return c&&p&&p.height>0||u&&p&&s(p)?(t===null&&(t=new Yd(n)),d=c?t.fromEquirectangular(a):t.fromCubemap(a),d.texture.pmremVersion=a.pmremVersion,e.set(a,d),a.addEventListener("dispose",r),d.texture):null}}}return a}function s(a){let l=0;const c=6;for(let u=0;u<c;u++)a[u]!==void 0&&l++;return l===c}function r(a){const l=a.target;l.removeEventListener("dispose",r);const c=e.get(l);c!==void 0&&(e.delete(l),c.dispose())}function o(){e=new WeakMap,t!==null&&(t.dispose(),t=null)}return{get:i,dispose:o}}function ty(n){const e={};function t(i){if(e[i]!==void 0)return e[i];let s;switch(i){case"WEBGL_depth_texture":s=n.getExtension("WEBGL_depth_texture")||n.getExtension("MOZ_WEBGL_depth_texture")||n.getExtension("WEBKIT_WEBGL_depth_texture");break;case"EXT_texture_filter_anisotropic":s=n.getExtension("EXT_texture_filter_anisotropic")||n.getExtension("MOZ_EXT_texture_filter_anisotropic")||n.getExtension("WEBKIT_EXT_texture_filter_anisotropic");break;case"WEBGL_compressed_texture_s3tc":s=n.getExtension("WEBGL_compressed_texture_s3tc")||n.getExtension("MOZ_WEBGL_compressed_texture_s3tc")||n.getExtension("WEBKIT_WEBGL_compressed_texture_s3tc");break;case"WEBGL_compressed_texture_pvrtc":s=n.getExtension("WEBGL_compressed_texture_pvrtc")||n.getExtension("WEBKIT_WEBGL_compressed_texture_pvrtc");break;default:s=n.getExtension(i)}return e[i]=s,s}return{has:function(i){return t(i)!==null},init:function(){t("EXT_color_buffer_float"),t("WEBGL_clip_cull_distance"),t("OES_texture_float_linear"),t("EXT_color_buffer_half_float"),t("WEBGL_multisampled_render_to_texture"),t("WEBGL_render_shared_exponent")},get:function(i){const s=t(i);return s===null&&Ts("THREE.WebGLRenderer: "+i+" extension not supported."),s}}}function ny(n,e,t,i){const s={},r=new WeakMap;function o(d){const h=d.target;h.index!==null&&e.remove(h.index);for(const g in h.attributes)e.remove(h.attributes[g]);h.removeEventListener("dispose",o),delete s[h.id];const p=r.get(h);p&&(e.remove(p),r.delete(h)),i.releaseStatesOfGeometry(h),h.isInstancedBufferGeometry===!0&&delete h._maxInstanceCount,t.memory.geometries--}function a(d,h){return s[h.id]===!0||(h.addEventListener("dispose",o),s[h.id]=!0,t.memory.geometries++),h}function l(d){const h=d.attributes;for(const p in h)e.update(h[p],n.ARRAY_BUFFER)}function c(d){const h=[],p=d.index,g=d.attributes.position;let _=0;if(p!==null){const M=p.array;_=p.version;for(let b=0,E=M.length;b<E;b+=3){const L=M[b+0],T=M[b+1],A=M[b+2];h.push(L,T,T,A,A,L)}}else if(g!==void 0){const M=g.array;_=g.version;for(let b=0,E=M.length/3-1;b<E;b+=3){const L=b+0,T=b+1,A=b+2;h.push(L,T,T,A,A,L)}}else return;const m=new(qf(h)?Jf:Zf)(h,1);m.version=_;const f=r.get(d);f&&e.remove(f),r.set(d,m)}function u(d){const h=r.get(d);if(h){const p=d.index;p!==null&&h.version<p.version&&c(d)}else c(d);return r.get(d)}return{get:a,update:l,getWireframeAttribute:u}}function iy(n,e,t){let i;function s(h){i=h}let r,o;function a(h){r=h.type,o=h.bytesPerElement}function l(h,p){n.drawElements(i,p,r,h*o),t.update(p,i,1)}function c(h,p,g){g!==0&&(n.drawElementsInstanced(i,p,r,h*o,g),t.update(p,i,g))}function u(h,p,g){if(g===0)return;e.get("WEBGL_multi_draw").multiDrawElementsWEBGL(i,p,0,r,h,0,g);let m=0;for(let f=0;f<g;f++)m+=p[f];t.update(m,i,1)}function d(h,p,g,_){if(g===0)return;const m=e.get("WEBGL_multi_draw");if(m===null)for(let f=0;f<h.length;f++)c(h[f]/o,p[f],_[f]);else{m.multiDrawElementsInstancedWEBGL(i,p,0,r,h,0,_,0,g);let f=0;for(let M=0;M<g;M++)f+=p[M]*_[M];t.update(f,i,1)}}this.setMode=s,this.setIndex=a,this.render=l,this.renderInstances=c,this.renderMultiDraw=u,this.renderMultiDrawInstances=d}function sy(n){const e={geometries:0,textures:0},t={frame:0,calls:0,triangles:0,points:0,lines:0};function i(r,o,a){switch(t.calls++,o){case n.TRIANGLES:t.triangles+=a*(r/3);break;case n.LINES:t.lines+=a*(r/2);break;case n.LINE_STRIP:t.lines+=a*(r-1);break;case n.LINE_LOOP:t.lines+=a*r;break;case n.POINTS:t.points+=a*r;break;default:console.error("THREE.WebGLInfo: Unknown draw mode:",o);break}}function s(){t.calls=0,t.triangles=0,t.points=0,t.lines=0}return{memory:e,render:t,programs:null,autoReset:!0,reset:s,update:i}}function ry(n,e,t){const i=new WeakMap,s=new yt;function r(o,a,l){const c=o.morphTargetInfluences,u=a.morphAttributes.position||a.morphAttributes.normal||a.morphAttributes.color,d=u!==void 0?u.length:0;let h=i.get(a);if(h===void 0||h.count!==d){let S=function(){A.dispose(),i.delete(a),a.removeEventListener("dispose",S)};h!==void 0&&h.texture.dispose();const p=a.morphAttributes.position!==void 0,g=a.morphAttributes.normal!==void 0,_=a.morphAttributes.color!==void 0,m=a.morphAttributes.position||[],f=a.morphAttributes.normal||[],M=a.morphAttributes.color||[];let b=0;p===!0&&(b=1),g===!0&&(b=2),_===!0&&(b=3);let E=a.attributes.position.count*b,L=1;E>e.maxTextureSize&&(L=Math.ceil(E/e.maxTextureSize),E=e.maxTextureSize);const T=new Float32Array(E*L*4*d),A=new jf(T,E,L,d);A.type=Pn,A.needsUpdate=!0;const R=b*4;for(let y=0;y<d;y++){const D=m[y],$=f[y],k=M[y],q=E*L*4*y;for(let Z=0;Z<D.count;Z++){const V=Z*R;p===!0&&(s.fromBufferAttribute(D,Z),T[q+V+0]=s.x,T[q+V+1]=s.y,T[q+V+2]=s.z,T[q+V+3]=0),g===!0&&(s.fromBufferAttribute($,Z),T[q+V+4]=s.x,T[q+V+5]=s.y,T[q+V+6]=s.z,T[q+V+7]=0),_===!0&&(s.fromBufferAttribute(k,Z),T[q+V+8]=s.x,T[q+V+9]=s.y,T[q+V+10]=s.z,T[q+V+11]=k.itemSize===4?s.w:1)}}h={count:d,texture:A,size:new Ve(E,L)},i.set(a,h),a.addEventListener("dispose",S)}if(o.isInstancedMesh===!0&&o.morphTexture!==null)l.getUniforms().setValue(n,"morphTexture",o.morphTexture,t);else{let p=0;for(let _=0;_<c.length;_++)p+=c[_];const g=a.morphTargetsRelative?1:1-p;l.getUniforms().setValue(n,"morphTargetBaseInfluence",g),l.getUniforms().setValue(n,"morphTargetInfluences",c)}l.getUniforms().setValue(n,"morphTargetsTexture",h.texture,t),l.getUniforms().setValue(n,"morphTargetsTextureSize",h.size)}return{update:r}}function oy(n,e,t,i){let s=new WeakMap;function r(l){const c=i.render.frame,u=l.geometry,d=e.get(l,u);if(s.get(d)!==c&&(e.update(d),s.set(d,c)),l.isInstancedMesh&&(l.hasEventListener("dispose",a)===!1&&l.addEventListener("dispose",a),s.get(l)!==c&&(t.update(l.instanceMatrix,n.ARRAY_BUFFER),l.instanceColor!==null&&t.update(l.instanceColor,n.ARRAY_BUFFER),s.set(l,c))),l.isSkinnedMesh){const h=l.skeleton;s.get(h)!==c&&(h.update(),s.set(h,c))}return d}function o(){s=new WeakMap}function a(l){const c=l.target;c.removeEventListener("dispose",a),t.remove(c.instanceMatrix),c.instanceColor!==null&&t.remove(c.instanceColor)}return{update:r,dispose:o}}const up=new $t,Zd=new sp(1,1),dp=new jf,hp=new P_,fp=new tp,Jd=[],Qd=[],eh=new Float32Array(16),th=new Float32Array(9),nh=new Float32Array(4);function Hs(n,e,t){const i=n[0];if(i<=0||i>0)return n;const s=e*t;let r=Jd[s];if(r===void 0&&(r=new Float32Array(s),Jd[s]=r),e!==0){i.toArray(r,0);for(let o=1,a=0;o!==e;++o)a+=t,n[o].toArray(r,a)}return r}function Ct(n,e){if(n.length!==e.length)return!1;for(let t=0,i=n.length;t<i;t++)if(n[t]!==e[t])return!1;return!0}function Pt(n,e){for(let t=0,i=e.length;t<i;t++)n[t]=e[t]}function aa(n,e){let t=Qd[e];t===void 0&&(t=new Int32Array(e),Qd[e]=t);for(let i=0;i!==e;++i)t[i]=n.allocateTextureUnit();return t}function ay(n,e){const t=this.cache;t[0]!==e&&(n.uniform1f(this.addr,e),t[0]=e)}function ly(n,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y)&&(n.uniform2f(this.addr,e.x,e.y),t[0]=e.x,t[1]=e.y);else{if(Ct(t,e))return;n.uniform2fv(this.addr,e),Pt(t,e)}}function cy(n,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z)&&(n.uniform3f(this.addr,e.x,e.y,e.z),t[0]=e.x,t[1]=e.y,t[2]=e.z);else if(e.r!==void 0)(t[0]!==e.r||t[1]!==e.g||t[2]!==e.b)&&(n.uniform3f(this.addr,e.r,e.g,e.b),t[0]=e.r,t[1]=e.g,t[2]=e.b);else{if(Ct(t,e))return;n.uniform3fv(this.addr,e),Pt(t,e)}}function uy(n,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z||t[3]!==e.w)&&(n.uniform4f(this.addr,e.x,e.y,e.z,e.w),t[0]=e.x,t[1]=e.y,t[2]=e.z,t[3]=e.w);else{if(Ct(t,e))return;n.uniform4fv(this.addr,e),Pt(t,e)}}function dy(n,e){const t=this.cache,i=e.elements;if(i===void 0){if(Ct(t,e))return;n.uniformMatrix2fv(this.addr,!1,e),Pt(t,e)}else{if(Ct(t,i))return;nh.set(i),n.uniformMatrix2fv(this.addr,!1,nh),Pt(t,i)}}function hy(n,e){const t=this.cache,i=e.elements;if(i===void 0){if(Ct(t,e))return;n.uniformMatrix3fv(this.addr,!1,e),Pt(t,e)}else{if(Ct(t,i))return;th.set(i),n.uniformMatrix3fv(this.addr,!1,th),Pt(t,i)}}function fy(n,e){const t=this.cache,i=e.elements;if(i===void 0){if(Ct(t,e))return;n.uniformMatrix4fv(this.addr,!1,e),Pt(t,e)}else{if(Ct(t,i))return;eh.set(i),n.uniformMatrix4fv(this.addr,!1,eh),Pt(t,i)}}function py(n,e){const t=this.cache;t[0]!==e&&(n.uniform1i(this.addr,e),t[0]=e)}function my(n,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y)&&(n.uniform2i(this.addr,e.x,e.y),t[0]=e.x,t[1]=e.y);else{if(Ct(t,e))return;n.uniform2iv(this.addr,e),Pt(t,e)}}function gy(n,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z)&&(n.uniform3i(this.addr,e.x,e.y,e.z),t[0]=e.x,t[1]=e.y,t[2]=e.z);else{if(Ct(t,e))return;n.uniform3iv(this.addr,e),Pt(t,e)}}function _y(n,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z||t[3]!==e.w)&&(n.uniform4i(this.addr,e.x,e.y,e.z,e.w),t[0]=e.x,t[1]=e.y,t[2]=e.z,t[3]=e.w);else{if(Ct(t,e))return;n.uniform4iv(this.addr,e),Pt(t,e)}}function vy(n,e){const t=this.cache;t[0]!==e&&(n.uniform1ui(this.addr,e),t[0]=e)}function xy(n,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y)&&(n.uniform2ui(this.addr,e.x,e.y),t[0]=e.x,t[1]=e.y);else{if(Ct(t,e))return;n.uniform2uiv(this.addr,e),Pt(t,e)}}function yy(n,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z)&&(n.uniform3ui(this.addr,e.x,e.y,e.z),t[0]=e.x,t[1]=e.y,t[2]=e.z);else{if(Ct(t,e))return;n.uniform3uiv(this.addr,e),Pt(t,e)}}function Sy(n,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z||t[3]!==e.w)&&(n.uniform4ui(this.addr,e.x,e.y,e.z,e.w),t[0]=e.x,t[1]=e.y,t[2]=e.z,t[3]=e.w);else{if(Ct(t,e))return;n.uniform4uiv(this.addr,e),Pt(t,e)}}function My(n,e,t){const i=this.cache,s=t.allocateTextureUnit();i[0]!==s&&(n.uniform1i(this.addr,s),i[0]=s);let r;this.type===n.SAMPLER_2D_SHADOW?(Zd.compareFunction=Yf,r=Zd):r=up,t.setTexture2D(e||r,s)}function wy(n,e,t){const i=this.cache,s=t.allocateTextureUnit();i[0]!==s&&(n.uniform1i(this.addr,s),i[0]=s),t.setTexture3D(e||hp,s)}function by(n,e,t){const i=this.cache,s=t.allocateTextureUnit();i[0]!==s&&(n.uniform1i(this.addr,s),i[0]=s),t.setTextureCube(e||fp,s)}function Ey(n,e,t){const i=this.cache,s=t.allocateTextureUnit();i[0]!==s&&(n.uniform1i(this.addr,s),i[0]=s),t.setTexture2DArray(e||dp,s)}function Ty(n){switch(n){case 5126:return ay;case 35664:return ly;case 35665:return cy;case 35666:return uy;case 35674:return dy;case 35675:return hy;case 35676:return fy;case 5124:case 35670:return py;case 35667:case 35671:return my;case 35668:case 35672:return gy;case 35669:case 35673:return _y;case 5125:return vy;case 36294:return xy;case 36295:return yy;case 36296:return Sy;case 35678:case 36198:case 36298:case 36306:case 35682:return My;case 35679:case 36299:case 36307:return wy;case 35680:case 36300:case 36308:case 36293:return by;case 36289:case 36303:case 36311:case 36292:return Ey}}function Ay(n,e){n.uniform1fv(this.addr,e)}function Ry(n,e){const t=Hs(e,this.size,2);n.uniform2fv(this.addr,t)}function Cy(n,e){const t=Hs(e,this.size,3);n.uniform3fv(this.addr,t)}function Py(n,e){const t=Hs(e,this.size,4);n.uniform4fv(this.addr,t)}function Ly(n,e){const t=Hs(e,this.size,4);n.uniformMatrix2fv(this.addr,!1,t)}function Dy(n,e){const t=Hs(e,this.size,9);n.uniformMatrix3fv(this.addr,!1,t)}function Iy(n,e){const t=Hs(e,this.size,16);n.uniformMatrix4fv(this.addr,!1,t)}function Uy(n,e){n.uniform1iv(this.addr,e)}function Ny(n,e){n.uniform2iv(this.addr,e)}function Fy(n,e){n.uniform3iv(this.addr,e)}function Oy(n,e){n.uniform4iv(this.addr,e)}function By(n,e){n.uniform1uiv(this.addr,e)}function ky(n,e){n.uniform2uiv(this.addr,e)}function zy(n,e){n.uniform3uiv(this.addr,e)}function Gy(n,e){n.uniform4uiv(this.addr,e)}function Hy(n,e,t){const i=this.cache,s=e.length,r=aa(t,s);Ct(i,r)||(n.uniform1iv(this.addr,r),Pt(i,r));for(let o=0;o!==s;++o)t.setTexture2D(e[o]||up,r[o])}function Vy(n,e,t){const i=this.cache,s=e.length,r=aa(t,s);Ct(i,r)||(n.uniform1iv(this.addr,r),Pt(i,r));for(let o=0;o!==s;++o)t.setTexture3D(e[o]||hp,r[o])}function $y(n,e,t){const i=this.cache,s=e.length,r=aa(t,s);Ct(i,r)||(n.uniform1iv(this.addr,r),Pt(i,r));for(let o=0;o!==s;++o)t.setTextureCube(e[o]||fp,r[o])}function Wy(n,e,t){const i=this.cache,s=e.length,r=aa(t,s);Ct(i,r)||(n.uniform1iv(this.addr,r),Pt(i,r));for(let o=0;o!==s;++o)t.setTexture2DArray(e[o]||dp,r[o])}function Xy(n){switch(n){case 5126:return Ay;case 35664:return Ry;case 35665:return Cy;case 35666:return Py;case 35674:return Ly;case 35675:return Dy;case 35676:return Iy;case 5124:case 35670:return Uy;case 35667:case 35671:return Ny;case 35668:case 35672:return Fy;case 35669:case 35673:return Oy;case 5125:return By;case 36294:return ky;case 36295:return zy;case 36296:return Gy;case 35678:case 36198:case 36298:case 36306:case 35682:return Hy;case 35679:case 36299:case 36307:return Vy;case 35680:case 36300:case 36308:case 36293:return $y;case 36289:case 36303:case 36311:case 36292:return Wy}}class Yy{constructor(e,t,i){this.id=e,this.addr=i,this.cache=[],this.type=t.type,this.setValue=Ty(t.type)}}class qy{constructor(e,t,i){this.id=e,this.addr=i,this.cache=[],this.type=t.type,this.size=t.size,this.setValue=Xy(t.type)}}class jy{constructor(e){this.id=e,this.seq=[],this.map={}}setValue(e,t,i){const s=this.seq;for(let r=0,o=s.length;r!==o;++r){const a=s[r];a.setValue(e,t[a.id],i)}}}const tl=/(\w+)(\])?(\[|\.)?/g;function ih(n,e){n.seq.push(e),n.map[e.id]=e}function Ky(n,e,t){const i=n.name,s=i.length;for(tl.lastIndex=0;;){const r=tl.exec(i),o=tl.lastIndex;let a=r[1];const l=r[2]==="]",c=r[3];if(l&&(a=a|0),c===void 0||c==="["&&o+2===s){ih(t,c===void 0?new Yy(a,n,e):new qy(a,n,e));break}else{let d=t.map[a];d===void 0&&(d=new jy(a),ih(t,d)),t=d}}}class Io{constructor(e,t){this.seq=[],this.map={};const i=e.getProgramParameter(t,e.ACTIVE_UNIFORMS);for(let s=0;s<i;++s){const r=e.getActiveUniform(t,s),o=e.getUniformLocation(t,r.name);Ky(r,o,this)}}setValue(e,t,i,s){const r=this.map[t];r!==void 0&&r.setValue(e,i,s)}setOptional(e,t,i){const s=t[i];s!==void 0&&this.setValue(e,i,s)}static upload(e,t,i,s){for(let r=0,o=t.length;r!==o;++r){const a=t[r],l=i[a.id];l.needsUpdate!==!1&&a.setValue(e,l.value,s)}}static seqWithValue(e,t){const i=[];for(let s=0,r=e.length;s!==r;++s){const o=e[s];o.id in t&&i.push(o)}return i}}function sh(n,e,t){const i=n.createShader(e);return n.shaderSource(i,t),n.compileShader(i),i}const Zy=37297;let Jy=0;function Qy(n,e){const t=n.split(`
`),i=[],s=Math.max(e-6,0),r=Math.min(e+6,t.length);for(let o=s;o<r;o++){const a=o+1;i.push(`${a===e?">":" "} ${a}: ${t[o]}`)}return i.join(`
`)}const rh=new Ye;function eS(n){it._getMatrix(rh,it.workingColorSpace,n);const e=`mat3( ${rh.elements.map(t=>t.toFixed(4))} )`;switch(it.getTransfer(n)){case Ho:return[e,"LinearTransferOETF"];case ct:return[e,"sRGBTransferOETF"];default:return console.warn("THREE.WebGLProgram: Unsupported color space: ",n),[e,"LinearTransferOETF"]}}function oh(n,e,t){const i=n.getShaderParameter(e,n.COMPILE_STATUS),s=n.getShaderInfoLog(e).trim();if(i&&s==="")return"";const r=/ERROR: 0:(\d+)/.exec(s);if(r){const o=parseInt(r[1]);return t.toUpperCase()+`

`+s+`

`+Qy(n.getShaderSource(e),o)}else return s}function tS(n,e){const t=eS(e);return[`vec4 ${n}( vec4 value ) {`,`	return ${t[1]}( vec4( value.rgb * ${t[0]}, value.a ) );`,"}"].join(`
`)}function nS(n,e){let t;switch(e){case t_:t="Linear";break;case n_:t="Reinhard";break;case i_:t="Cineon";break;case s_:t="ACESFilmic";break;case o_:t="AgX";break;case a_:t="Neutral";break;case r_:t="Custom";break;default:console.warn("THREE.WebGLProgram: Unsupported toneMapping:",e),t="Linear"}return"vec3 "+n+"( vec3 color ) { return "+t+"ToneMapping( color ); }"}const go=new F;function iS(){it.getLuminanceCoefficients(go);const n=go.x.toFixed(4),e=go.y.toFixed(4),t=go.z.toFixed(4);return["float luminance( const in vec3 rgb ) {",`	const vec3 weights = vec3( ${n}, ${e}, ${t} );`,"	return dot( weights, rgb );","}"].join(`
`)}function sS(n){return[n.extensionClipCullDistance?"#extension GL_ANGLE_clip_cull_distance : require":"",n.extensionMultiDraw?"#extension GL_ANGLE_multi_draw : require":""].filter(sr).join(`
`)}function rS(n){const e=[];for(const t in n){const i=n[t];i!==!1&&e.push("#define "+t+" "+i)}return e.join(`
`)}function oS(n,e){const t={},i=n.getProgramParameter(e,n.ACTIVE_ATTRIBUTES);for(let s=0;s<i;s++){const r=n.getActiveAttrib(e,s),o=r.name;let a=1;r.type===n.FLOAT_MAT2&&(a=2),r.type===n.FLOAT_MAT3&&(a=3),r.type===n.FLOAT_MAT4&&(a=4),t[o]={type:r.type,location:n.getAttribLocation(e,o),locationSize:a}}return t}function sr(n){return n!==""}function ah(n,e){const t=e.numSpotLightShadows+e.numSpotLightMaps-e.numSpotLightShadowsWithMaps;return n.replace(/NUM_DIR_LIGHTS/g,e.numDirLights).replace(/NUM_SPOT_LIGHTS/g,e.numSpotLights).replace(/NUM_SPOT_LIGHT_MAPS/g,e.numSpotLightMaps).replace(/NUM_SPOT_LIGHT_COORDS/g,t).replace(/NUM_RECT_AREA_LIGHTS/g,e.numRectAreaLights).replace(/NUM_POINT_LIGHTS/g,e.numPointLights).replace(/NUM_HEMI_LIGHTS/g,e.numHemiLights).replace(/NUM_DIR_LIGHT_SHADOWS/g,e.numDirLightShadows).replace(/NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS/g,e.numSpotLightShadowsWithMaps).replace(/NUM_SPOT_LIGHT_SHADOWS/g,e.numSpotLightShadows).replace(/NUM_POINT_LIGHT_SHADOWS/g,e.numPointLightShadows)}function lh(n,e){return n.replace(/NUM_CLIPPING_PLANES/g,e.numClippingPlanes).replace(/UNION_CLIPPING_PLANES/g,e.numClippingPlanes-e.numClipIntersection)}const aS=/^[ \t]*#include +<([\w\d./]+)>/gm;function oc(n){return n.replace(aS,cS)}const lS=new Map;function cS(n,e){let t=Ze[e];if(t===void 0){const i=lS.get(e);if(i!==void 0)t=Ze[i],console.warn('THREE.WebGLRenderer: Shader chunk "%s" has been deprecated. Use "%s" instead.',e,i);else throw new Error("Can not resolve #include <"+e+">")}return oc(t)}const uS=/#pragma unroll_loop_start\s+for\s*\(\s*int\s+i\s*=\s*(\d+)\s*;\s*i\s*<\s*(\d+)\s*;\s*i\s*\+\+\s*\)\s*{([\s\S]+?)}\s+#pragma unroll_loop_end/g;function ch(n){return n.replace(uS,dS)}function dS(n,e,t,i){let s="";for(let r=parseInt(e);r<parseInt(t);r++)s+=i.replace(/\[\s*i\s*\]/g,"[ "+r+" ]").replace(/UNROLLED_LOOP_INDEX/g,r);return s}function uh(n){let e=`precision ${n.precision} float;
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
#define LOW_PRECISION`),e}function hS(n){let e="SHADOWMAP_TYPE_BASIC";return n.shadowMapType===Of?e="SHADOWMAP_TYPE_PCF":n.shadowMapType===Ug?e="SHADOWMAP_TYPE_PCF_SOFT":n.shadowMapType===Vn&&(e="SHADOWMAP_TYPE_VSM"),e}function fS(n){let e="ENVMAP_TYPE_CUBE";if(n.envMap)switch(n.envMapMode){case Is:case Us:e="ENVMAP_TYPE_CUBE";break;case ia:e="ENVMAP_TYPE_CUBE_UV";break}return e}function pS(n){let e="ENVMAP_MODE_REFLECTION";return n.envMap&&n.envMapMode===Us&&(e="ENVMAP_MODE_REFRACTION"),e}function mS(n){let e="ENVMAP_BLENDING_NONE";if(n.envMap)switch(n.combine){case Yc:e="ENVMAP_BLENDING_MULTIPLY";break;case Qg:e="ENVMAP_BLENDING_MIX";break;case e_:e="ENVMAP_BLENDING_ADD";break}return e}function gS(n){const e=n.envMapCubeUVHeight;if(e===null)return null;const t=Math.log2(e)-2,i=1/e;return{texelWidth:1/(3*Math.max(Math.pow(2,t),112)),texelHeight:i,maxMip:t}}function _S(n,e,t,i){const s=n.getContext(),r=t.defines;let o=t.vertexShader,a=t.fragmentShader;const l=hS(t),c=fS(t),u=pS(t),d=mS(t),h=gS(t),p=sS(t),g=rS(r),_=s.createProgram();let m,f,M=t.glslVersion?"#version "+t.glslVersion+`
`:"";t.isRawShaderMaterial?(m=["#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,g].filter(sr).join(`
`),m.length>0&&(m+=`
`),f=["#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,g].filter(sr).join(`
`),f.length>0&&(f+=`
`)):(m=[uh(t),"#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,g,t.extensionClipCullDistance?"#define USE_CLIP_DISTANCE":"",t.batching?"#define USE_BATCHING":"",t.batchingColor?"#define USE_BATCHING_COLOR":"",t.instancing?"#define USE_INSTANCING":"",t.instancingColor?"#define USE_INSTANCING_COLOR":"",t.instancingMorph?"#define USE_INSTANCING_MORPH":"",t.useFog&&t.fog?"#define USE_FOG":"",t.useFog&&t.fogExp2?"#define FOG_EXP2":"",t.map?"#define USE_MAP":"",t.envMap?"#define USE_ENVMAP":"",t.envMap?"#define "+u:"",t.lightMap?"#define USE_LIGHTMAP":"",t.aoMap?"#define USE_AOMAP":"",t.bumpMap?"#define USE_BUMPMAP":"",t.normalMap?"#define USE_NORMALMAP":"",t.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",t.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",t.displacementMap?"#define USE_DISPLACEMENTMAP":"",t.emissiveMap?"#define USE_EMISSIVEMAP":"",t.anisotropy?"#define USE_ANISOTROPY":"",t.anisotropyMap?"#define USE_ANISOTROPYMAP":"",t.clearcoatMap?"#define USE_CLEARCOATMAP":"",t.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",t.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",t.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",t.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",t.specularMap?"#define USE_SPECULARMAP":"",t.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",t.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",t.roughnessMap?"#define USE_ROUGHNESSMAP":"",t.metalnessMap?"#define USE_METALNESSMAP":"",t.alphaMap?"#define USE_ALPHAMAP":"",t.alphaHash?"#define USE_ALPHAHASH":"",t.transmission?"#define USE_TRANSMISSION":"",t.transmissionMap?"#define USE_TRANSMISSIONMAP":"",t.thicknessMap?"#define USE_THICKNESSMAP":"",t.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",t.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",t.mapUv?"#define MAP_UV "+t.mapUv:"",t.alphaMapUv?"#define ALPHAMAP_UV "+t.alphaMapUv:"",t.lightMapUv?"#define LIGHTMAP_UV "+t.lightMapUv:"",t.aoMapUv?"#define AOMAP_UV "+t.aoMapUv:"",t.emissiveMapUv?"#define EMISSIVEMAP_UV "+t.emissiveMapUv:"",t.bumpMapUv?"#define BUMPMAP_UV "+t.bumpMapUv:"",t.normalMapUv?"#define NORMALMAP_UV "+t.normalMapUv:"",t.displacementMapUv?"#define DISPLACEMENTMAP_UV "+t.displacementMapUv:"",t.metalnessMapUv?"#define METALNESSMAP_UV "+t.metalnessMapUv:"",t.roughnessMapUv?"#define ROUGHNESSMAP_UV "+t.roughnessMapUv:"",t.anisotropyMapUv?"#define ANISOTROPYMAP_UV "+t.anisotropyMapUv:"",t.clearcoatMapUv?"#define CLEARCOATMAP_UV "+t.clearcoatMapUv:"",t.clearcoatNormalMapUv?"#define CLEARCOAT_NORMALMAP_UV "+t.clearcoatNormalMapUv:"",t.clearcoatRoughnessMapUv?"#define CLEARCOAT_ROUGHNESSMAP_UV "+t.clearcoatRoughnessMapUv:"",t.iridescenceMapUv?"#define IRIDESCENCEMAP_UV "+t.iridescenceMapUv:"",t.iridescenceThicknessMapUv?"#define IRIDESCENCE_THICKNESSMAP_UV "+t.iridescenceThicknessMapUv:"",t.sheenColorMapUv?"#define SHEEN_COLORMAP_UV "+t.sheenColorMapUv:"",t.sheenRoughnessMapUv?"#define SHEEN_ROUGHNESSMAP_UV "+t.sheenRoughnessMapUv:"",t.specularMapUv?"#define SPECULARMAP_UV "+t.specularMapUv:"",t.specularColorMapUv?"#define SPECULAR_COLORMAP_UV "+t.specularColorMapUv:"",t.specularIntensityMapUv?"#define SPECULAR_INTENSITYMAP_UV "+t.specularIntensityMapUv:"",t.transmissionMapUv?"#define TRANSMISSIONMAP_UV "+t.transmissionMapUv:"",t.thicknessMapUv?"#define THICKNESSMAP_UV "+t.thicknessMapUv:"",t.vertexTangents&&t.flatShading===!1?"#define USE_TANGENT":"",t.vertexColors?"#define USE_COLOR":"",t.vertexAlphas?"#define USE_COLOR_ALPHA":"",t.vertexUv1s?"#define USE_UV1":"",t.vertexUv2s?"#define USE_UV2":"",t.vertexUv3s?"#define USE_UV3":"",t.pointsUvs?"#define USE_POINTS_UV":"",t.flatShading?"#define FLAT_SHADED":"",t.skinning?"#define USE_SKINNING":"",t.morphTargets?"#define USE_MORPHTARGETS":"",t.morphNormals&&t.flatShading===!1?"#define USE_MORPHNORMALS":"",t.morphColors?"#define USE_MORPHCOLORS":"",t.morphTargetsCount>0?"#define MORPHTARGETS_TEXTURE_STRIDE "+t.morphTextureStride:"",t.morphTargetsCount>0?"#define MORPHTARGETS_COUNT "+t.morphTargetsCount:"",t.doubleSided?"#define DOUBLE_SIDED":"",t.flipSided?"#define FLIP_SIDED":"",t.shadowMapEnabled?"#define USE_SHADOWMAP":"",t.shadowMapEnabled?"#define "+l:"",t.sizeAttenuation?"#define USE_SIZEATTENUATION":"",t.numLightProbes>0?"#define USE_LIGHT_PROBES":"",t.logarithmicDepthBuffer?"#define USE_LOGDEPTHBUF":"",t.reverseDepthBuffer?"#define USE_REVERSEDEPTHBUF":"","uniform mat4 modelMatrix;","uniform mat4 modelViewMatrix;","uniform mat4 projectionMatrix;","uniform mat4 viewMatrix;","uniform mat3 normalMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;","#ifdef USE_INSTANCING","	attribute mat4 instanceMatrix;","#endif","#ifdef USE_INSTANCING_COLOR","	attribute vec3 instanceColor;","#endif","#ifdef USE_INSTANCING_MORPH","	uniform sampler2D morphTexture;","#endif","attribute vec3 position;","attribute vec3 normal;","attribute vec2 uv;","#ifdef USE_UV1","	attribute vec2 uv1;","#endif","#ifdef USE_UV2","	attribute vec2 uv2;","#endif","#ifdef USE_UV3","	attribute vec2 uv3;","#endif","#ifdef USE_TANGENT","	attribute vec4 tangent;","#endif","#if defined( USE_COLOR_ALPHA )","	attribute vec4 color;","#elif defined( USE_COLOR )","	attribute vec3 color;","#endif","#ifdef USE_SKINNING","	attribute vec4 skinIndex;","	attribute vec4 skinWeight;","#endif",`
`].filter(sr).join(`
`),f=[uh(t),"#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,g,t.useFog&&t.fog?"#define USE_FOG":"",t.useFog&&t.fogExp2?"#define FOG_EXP2":"",t.alphaToCoverage?"#define ALPHA_TO_COVERAGE":"",t.map?"#define USE_MAP":"",t.matcap?"#define USE_MATCAP":"",t.envMap?"#define USE_ENVMAP":"",t.envMap?"#define "+c:"",t.envMap?"#define "+u:"",t.envMap?"#define "+d:"",h?"#define CUBEUV_TEXEL_WIDTH "+h.texelWidth:"",h?"#define CUBEUV_TEXEL_HEIGHT "+h.texelHeight:"",h?"#define CUBEUV_MAX_MIP "+h.maxMip+".0":"",t.lightMap?"#define USE_LIGHTMAP":"",t.aoMap?"#define USE_AOMAP":"",t.bumpMap?"#define USE_BUMPMAP":"",t.normalMap?"#define USE_NORMALMAP":"",t.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",t.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",t.emissiveMap?"#define USE_EMISSIVEMAP":"",t.anisotropy?"#define USE_ANISOTROPY":"",t.anisotropyMap?"#define USE_ANISOTROPYMAP":"",t.clearcoat?"#define USE_CLEARCOAT":"",t.clearcoatMap?"#define USE_CLEARCOATMAP":"",t.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",t.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",t.dispersion?"#define USE_DISPERSION":"",t.iridescence?"#define USE_IRIDESCENCE":"",t.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",t.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",t.specularMap?"#define USE_SPECULARMAP":"",t.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",t.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",t.roughnessMap?"#define USE_ROUGHNESSMAP":"",t.metalnessMap?"#define USE_METALNESSMAP":"",t.alphaMap?"#define USE_ALPHAMAP":"",t.alphaTest?"#define USE_ALPHATEST":"",t.alphaHash?"#define USE_ALPHAHASH":"",t.sheen?"#define USE_SHEEN":"",t.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",t.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",t.transmission?"#define USE_TRANSMISSION":"",t.transmissionMap?"#define USE_TRANSMISSIONMAP":"",t.thicknessMap?"#define USE_THICKNESSMAP":"",t.vertexTangents&&t.flatShading===!1?"#define USE_TANGENT":"",t.vertexColors||t.instancingColor||t.batchingColor?"#define USE_COLOR":"",t.vertexAlphas?"#define USE_COLOR_ALPHA":"",t.vertexUv1s?"#define USE_UV1":"",t.vertexUv2s?"#define USE_UV2":"",t.vertexUv3s?"#define USE_UV3":"",t.pointsUvs?"#define USE_POINTS_UV":"",t.gradientMap?"#define USE_GRADIENTMAP":"",t.flatShading?"#define FLAT_SHADED":"",t.doubleSided?"#define DOUBLE_SIDED":"",t.flipSided?"#define FLIP_SIDED":"",t.shadowMapEnabled?"#define USE_SHADOWMAP":"",t.shadowMapEnabled?"#define "+l:"",t.premultipliedAlpha?"#define PREMULTIPLIED_ALPHA":"",t.numLightProbes>0?"#define USE_LIGHT_PROBES":"",t.decodeVideoTexture?"#define DECODE_VIDEO_TEXTURE":"",t.decodeVideoTextureEmissive?"#define DECODE_VIDEO_TEXTURE_EMISSIVE":"",t.logarithmicDepthBuffer?"#define USE_LOGDEPTHBUF":"",t.reverseDepthBuffer?"#define USE_REVERSEDEPTHBUF":"","uniform mat4 viewMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;",t.toneMapping!==xi?"#define TONE_MAPPING":"",t.toneMapping!==xi?Ze.tonemapping_pars_fragment:"",t.toneMapping!==xi?nS("toneMapping",t.toneMapping):"",t.dithering?"#define DITHERING":"",t.opaque?"#define OPAQUE":"",Ze.colorspace_pars_fragment,tS("linearToOutputTexel",t.outputColorSpace),iS(),t.useDepthPacking?"#define DEPTH_PACKING "+t.depthPacking:"",`
`].filter(sr).join(`
`)),o=oc(o),o=ah(o,t),o=lh(o,t),a=oc(a),a=ah(a,t),a=lh(a,t),o=ch(o),a=ch(a),t.isRawShaderMaterial!==!0&&(M=`#version 300 es
`,m=[p,"#define attribute in","#define varying out","#define texture2D texture"].join(`
`)+`
`+m,f=["#define varying in",t.glslVersion===ud?"":"layout(location = 0) out highp vec4 pc_fragColor;",t.glslVersion===ud?"":"#define gl_FragColor pc_fragColor","#define gl_FragDepthEXT gl_FragDepth","#define texture2D texture","#define textureCube texture","#define texture2DProj textureProj","#define texture2DLodEXT textureLod","#define texture2DProjLodEXT textureProjLod","#define textureCubeLodEXT textureLod","#define texture2DGradEXT textureGrad","#define texture2DProjGradEXT textureProjGrad","#define textureCubeGradEXT textureGrad"].join(`
`)+`
`+f);const b=M+m+o,E=M+f+a,L=sh(s,s.VERTEX_SHADER,b),T=sh(s,s.FRAGMENT_SHADER,E);s.attachShader(_,L),s.attachShader(_,T),t.index0AttributeName!==void 0?s.bindAttribLocation(_,0,t.index0AttributeName):t.morphTargets===!0&&s.bindAttribLocation(_,0,"position"),s.linkProgram(_);function A(D){if(n.debug.checkShaderErrors){const $=s.getProgramInfoLog(_).trim(),k=s.getShaderInfoLog(L).trim(),q=s.getShaderInfoLog(T).trim();let Z=!0,V=!0;if(s.getProgramParameter(_,s.LINK_STATUS)===!1)if(Z=!1,typeof n.debug.onShaderError=="function")n.debug.onShaderError(s,_,L,T);else{const ie=oh(s,L,"vertex"),H=oh(s,T,"fragment");console.error("THREE.WebGLProgram: Shader Error "+s.getError()+" - VALIDATE_STATUS "+s.getProgramParameter(_,s.VALIDATE_STATUS)+`

Material Name: `+D.name+`
Material Type: `+D.type+`

Program Info Log: `+$+`
`+ie+`
`+H)}else $!==""?console.warn("THREE.WebGLProgram: Program Info Log:",$):(k===""||q==="")&&(V=!1);V&&(D.diagnostics={runnable:Z,programLog:$,vertexShader:{log:k,prefix:m},fragmentShader:{log:q,prefix:f}})}s.deleteShader(L),s.deleteShader(T),R=new Io(s,_),S=oS(s,_)}let R;this.getUniforms=function(){return R===void 0&&A(this),R};let S;this.getAttributes=function(){return S===void 0&&A(this),S};let y=t.rendererExtensionParallelShaderCompile===!1;return this.isReady=function(){return y===!1&&(y=s.getProgramParameter(_,Zy)),y},this.destroy=function(){i.releaseStatesOfProgram(this),s.deleteProgram(_),this.program=void 0},this.type=t.shaderType,this.name=t.shaderName,this.id=Jy++,this.cacheKey=e,this.usedTimes=1,this.program=_,this.vertexShader=L,this.fragmentShader=T,this}let vS=0;class xS{constructor(){this.shaderCache=new Map,this.materialCache=new Map}update(e){const t=e.vertexShader,i=e.fragmentShader,s=this._getShaderStage(t),r=this._getShaderStage(i),o=this._getShaderCacheForMaterial(e);return o.has(s)===!1&&(o.add(s),s.usedTimes++),o.has(r)===!1&&(o.add(r),r.usedTimes++),this}remove(e){const t=this.materialCache.get(e);for(const i of t)i.usedTimes--,i.usedTimes===0&&this.shaderCache.delete(i.code);return this.materialCache.delete(e),this}getVertexShaderID(e){return this._getShaderStage(e.vertexShader).id}getFragmentShaderID(e){return this._getShaderStage(e.fragmentShader).id}dispose(){this.shaderCache.clear(),this.materialCache.clear()}_getShaderCacheForMaterial(e){const t=this.materialCache;let i=t.get(e);return i===void 0&&(i=new Set,t.set(e,i)),i}_getShaderStage(e){const t=this.shaderCache;let i=t.get(e);return i===void 0&&(i=new yS(e),t.set(e,i)),i}}class yS{constructor(e){this.id=vS++,this.code=e,this.usedTimes=0}}function SS(n,e,t,i,s,r,o){const a=new nu,l=new xS,c=new Set,u=[],d=s.logarithmicDepthBuffer,h=s.vertexTextures;let p=s.precision;const g={MeshDepthMaterial:"depth",MeshDistanceMaterial:"distanceRGBA",MeshNormalMaterial:"normal",MeshBasicMaterial:"basic",MeshLambertMaterial:"lambert",MeshPhongMaterial:"phong",MeshToonMaterial:"toon",MeshStandardMaterial:"physical",MeshPhysicalMaterial:"physical",MeshMatcapMaterial:"matcap",LineBasicMaterial:"basic",LineDashedMaterial:"dashed",PointsMaterial:"points",ShadowMaterial:"shadow",SpriteMaterial:"sprite"};function _(S){return c.add(S),S===0?"uv":`uv${S}`}function m(S,y,D,$,k){const q=$.fog,Z=k.geometry,V=S.isMeshStandardMaterial?$.environment:null,ie=(S.isMeshStandardMaterial?t:e).get(S.envMap||V),H=ie&&ie.mapping===ia?ie.image.height:null,oe=g[S.type];S.precision!==null&&(p=s.getMaxPrecision(S.precision),p!==S.precision&&console.warn("THREE.WebGLProgram.getParameters:",S.precision,"not supported, using",p,"instead."));const me=Z.morphAttributes.position||Z.morphAttributes.normal||Z.morphAttributes.color,Te=me!==void 0?me.length:0;let $e=0;Z.morphAttributes.position!==void 0&&($e=1),Z.morphAttributes.normal!==void 0&&($e=2),Z.morphAttributes.color!==void 0&&($e=3);let je,X,ae,Ee;if(oe){const ot=Rn[oe];je=ot.vertexShader,X=ot.fragmentShader}else je=S.vertexShader,X=S.fragmentShader,l.update(S),ae=l.getVertexShaderID(S),Ee=l.getFragmentShaderID(S);const he=n.getRenderTarget(),we=n.state.buffers.depth.getReversed(),Qe=k.isInstancedMesh===!0,Y=k.isBatchedMesh===!0,ge=!!S.map,Xe=!!S.matcap,Oe=!!ie,P=!!S.aoMap,bt=!!S.lightMap,st=!!S.bumpMap,ht=!!S.normalMap,Ae=!!S.displacementMap,tt=!!S.emissiveMap,De=!!S.metalnessMap,Ke=!!S.roughnessMap,Et=S.anisotropy>0,C=S.clearcoat>0,x=S.dispersion>0,O=S.iridescence>0,j=S.sheen>0,J=S.transmission>0,W=Et&&!!S.anisotropyMap,Re=C&&!!S.clearcoatMap,de=C&&!!S.clearcoatNormalMap,be=C&&!!S.clearcoatRoughnessMap,Ce=O&&!!S.iridescenceMap,ee=O&&!!S.iridescenceThicknessMap,_e=j&&!!S.sheenColorMap,Fe=j&&!!S.sheenRoughnessMap,Ue=!!S.specularMap,ce=!!S.specularColorMap,Ge=!!S.specularIntensityMap,I=J&&!!S.transmissionMap,fe=J&&!!S.thicknessMap,te=!!S.gradientMap,ye=!!S.alphaMap,ne=S.alphaTest>0,K=!!S.alphaHash,Se=!!S.extensions;let He=xi;S.toneMapped&&(he===null||he.isXRRenderTarget===!0)&&(He=n.toneMapping);const pt={shaderID:oe,shaderType:S.type,shaderName:S.name,vertexShader:je,fragmentShader:X,defines:S.defines,customVertexShaderID:ae,customFragmentShaderID:Ee,isRawShaderMaterial:S.isRawShaderMaterial===!0,glslVersion:S.glslVersion,precision:p,batching:Y,batchingColor:Y&&k._colorsTexture!==null,instancing:Qe,instancingColor:Qe&&k.instanceColor!==null,instancingMorph:Qe&&k.morphTexture!==null,supportsVertexTextures:h,outputColorSpace:he===null?n.outputColorSpace:he.isXRRenderTarget===!0?he.texture.colorSpace:Ns,alphaToCoverage:!!S.alphaToCoverage,map:ge,matcap:Xe,envMap:Oe,envMapMode:Oe&&ie.mapping,envMapCubeUVHeight:H,aoMap:P,lightMap:bt,bumpMap:st,normalMap:ht,displacementMap:h&&Ae,emissiveMap:tt,normalMapObjectSpace:ht&&S.normalMapType===d_,normalMapTangentSpace:ht&&S.normalMapType===Xf,metalnessMap:De,roughnessMap:Ke,anisotropy:Et,anisotropyMap:W,clearcoat:C,clearcoatMap:Re,clearcoatNormalMap:de,clearcoatRoughnessMap:be,dispersion:x,iridescence:O,iridescenceMap:Ce,iridescenceThicknessMap:ee,sheen:j,sheenColorMap:_e,sheenRoughnessMap:Fe,specularMap:Ue,specularColorMap:ce,specularIntensityMap:Ge,transmission:J,transmissionMap:I,thicknessMap:fe,gradientMap:te,opaque:S.transparent===!1&&S.blending===Es&&S.alphaToCoverage===!1,alphaMap:ye,alphaTest:ne,alphaHash:K,combine:S.combine,mapUv:ge&&_(S.map.channel),aoMapUv:P&&_(S.aoMap.channel),lightMapUv:bt&&_(S.lightMap.channel),bumpMapUv:st&&_(S.bumpMap.channel),normalMapUv:ht&&_(S.normalMap.channel),displacementMapUv:Ae&&_(S.displacementMap.channel),emissiveMapUv:tt&&_(S.emissiveMap.channel),metalnessMapUv:De&&_(S.metalnessMap.channel),roughnessMapUv:Ke&&_(S.roughnessMap.channel),anisotropyMapUv:W&&_(S.anisotropyMap.channel),clearcoatMapUv:Re&&_(S.clearcoatMap.channel),clearcoatNormalMapUv:de&&_(S.clearcoatNormalMap.channel),clearcoatRoughnessMapUv:be&&_(S.clearcoatRoughnessMap.channel),iridescenceMapUv:Ce&&_(S.iridescenceMap.channel),iridescenceThicknessMapUv:ee&&_(S.iridescenceThicknessMap.channel),sheenColorMapUv:_e&&_(S.sheenColorMap.channel),sheenRoughnessMapUv:Fe&&_(S.sheenRoughnessMap.channel),specularMapUv:Ue&&_(S.specularMap.channel),specularColorMapUv:ce&&_(S.specularColorMap.channel),specularIntensityMapUv:Ge&&_(S.specularIntensityMap.channel),transmissionMapUv:I&&_(S.transmissionMap.channel),thicknessMapUv:fe&&_(S.thicknessMap.channel),alphaMapUv:ye&&_(S.alphaMap.channel),vertexTangents:!!Z.attributes.tangent&&(ht||Et),vertexColors:S.vertexColors,vertexAlphas:S.vertexColors===!0&&!!Z.attributes.color&&Z.attributes.color.itemSize===4,pointsUvs:k.isPoints===!0&&!!Z.attributes.uv&&(ge||ye),fog:!!q,useFog:S.fog===!0,fogExp2:!!q&&q.isFogExp2,flatShading:S.flatShading===!0&&S.wireframe===!1,sizeAttenuation:S.sizeAttenuation===!0,logarithmicDepthBuffer:d,reverseDepthBuffer:we,skinning:k.isSkinnedMesh===!0,morphTargets:Z.morphAttributes.position!==void 0,morphNormals:Z.morphAttributes.normal!==void 0,morphColors:Z.morphAttributes.color!==void 0,morphTargetsCount:Te,morphTextureStride:$e,numDirLights:y.directional.length,numPointLights:y.point.length,numSpotLights:y.spot.length,numSpotLightMaps:y.spotLightMap.length,numRectAreaLights:y.rectArea.length,numHemiLights:y.hemi.length,numDirLightShadows:y.directionalShadowMap.length,numPointLightShadows:y.pointShadowMap.length,numSpotLightShadows:y.spotShadowMap.length,numSpotLightShadowsWithMaps:y.numSpotLightShadowsWithMaps,numLightProbes:y.numLightProbes,numClippingPlanes:o.numPlanes,numClipIntersection:o.numIntersection,dithering:S.dithering,shadowMapEnabled:n.shadowMap.enabled&&D.length>0,shadowMapType:n.shadowMap.type,toneMapping:He,decodeVideoTexture:ge&&S.map.isVideoTexture===!0&&it.getTransfer(S.map.colorSpace)===ct,decodeVideoTextureEmissive:tt&&S.emissiveMap.isVideoTexture===!0&&it.getTransfer(S.emissiveMap.colorSpace)===ct,premultipliedAlpha:S.premultipliedAlpha,doubleSided:S.side===Xn,flipSided:S.side===Zt,useDepthPacking:S.depthPacking>=0,depthPacking:S.depthPacking||0,index0AttributeName:S.index0AttributeName,extensionClipCullDistance:Se&&S.extensions.clipCullDistance===!0&&i.has("WEBGL_clip_cull_distance"),extensionMultiDraw:(Se&&S.extensions.multiDraw===!0||Y)&&i.has("WEBGL_multi_draw"),rendererExtensionParallelShaderCompile:i.has("KHR_parallel_shader_compile"),customProgramCacheKey:S.customProgramCacheKey()};return pt.vertexUv1s=c.has(1),pt.vertexUv2s=c.has(2),pt.vertexUv3s=c.has(3),c.clear(),pt}function f(S){const y=[];if(S.shaderID?y.push(S.shaderID):(y.push(S.customVertexShaderID),y.push(S.customFragmentShaderID)),S.defines!==void 0)for(const D in S.defines)y.push(D),y.push(S.defines[D]);return S.isRawShaderMaterial===!1&&(M(y,S),b(y,S),y.push(n.outputColorSpace)),y.push(S.customProgramCacheKey),y.join()}function M(S,y){S.push(y.precision),S.push(y.outputColorSpace),S.push(y.envMapMode),S.push(y.envMapCubeUVHeight),S.push(y.mapUv),S.push(y.alphaMapUv),S.push(y.lightMapUv),S.push(y.aoMapUv),S.push(y.bumpMapUv),S.push(y.normalMapUv),S.push(y.displacementMapUv),S.push(y.emissiveMapUv),S.push(y.metalnessMapUv),S.push(y.roughnessMapUv),S.push(y.anisotropyMapUv),S.push(y.clearcoatMapUv),S.push(y.clearcoatNormalMapUv),S.push(y.clearcoatRoughnessMapUv),S.push(y.iridescenceMapUv),S.push(y.iridescenceThicknessMapUv),S.push(y.sheenColorMapUv),S.push(y.sheenRoughnessMapUv),S.push(y.specularMapUv),S.push(y.specularColorMapUv),S.push(y.specularIntensityMapUv),S.push(y.transmissionMapUv),S.push(y.thicknessMapUv),S.push(y.combine),S.push(y.fogExp2),S.push(y.sizeAttenuation),S.push(y.morphTargetsCount),S.push(y.morphAttributeCount),S.push(y.numDirLights),S.push(y.numPointLights),S.push(y.numSpotLights),S.push(y.numSpotLightMaps),S.push(y.numHemiLights),S.push(y.numRectAreaLights),S.push(y.numDirLightShadows),S.push(y.numPointLightShadows),S.push(y.numSpotLightShadows),S.push(y.numSpotLightShadowsWithMaps),S.push(y.numLightProbes),S.push(y.shadowMapType),S.push(y.toneMapping),S.push(y.numClippingPlanes),S.push(y.numClipIntersection),S.push(y.depthPacking)}function b(S,y){a.disableAll(),y.supportsVertexTextures&&a.enable(0),y.instancing&&a.enable(1),y.instancingColor&&a.enable(2),y.instancingMorph&&a.enable(3),y.matcap&&a.enable(4),y.envMap&&a.enable(5),y.normalMapObjectSpace&&a.enable(6),y.normalMapTangentSpace&&a.enable(7),y.clearcoat&&a.enable(8),y.iridescence&&a.enable(9),y.alphaTest&&a.enable(10),y.vertexColors&&a.enable(11),y.vertexAlphas&&a.enable(12),y.vertexUv1s&&a.enable(13),y.vertexUv2s&&a.enable(14),y.vertexUv3s&&a.enable(15),y.vertexTangents&&a.enable(16),y.anisotropy&&a.enable(17),y.alphaHash&&a.enable(18),y.batching&&a.enable(19),y.dispersion&&a.enable(20),y.batchingColor&&a.enable(21),y.gradientMap&&a.enable(22),S.push(a.mask),a.disableAll(),y.fog&&a.enable(0),y.useFog&&a.enable(1),y.flatShading&&a.enable(2),y.logarithmicDepthBuffer&&a.enable(3),y.reverseDepthBuffer&&a.enable(4),y.skinning&&a.enable(5),y.morphTargets&&a.enable(6),y.morphNormals&&a.enable(7),y.morphColors&&a.enable(8),y.premultipliedAlpha&&a.enable(9),y.shadowMapEnabled&&a.enable(10),y.doubleSided&&a.enable(11),y.flipSided&&a.enable(12),y.useDepthPacking&&a.enable(13),y.dithering&&a.enable(14),y.transmission&&a.enable(15),y.sheen&&a.enable(16),y.opaque&&a.enable(17),y.pointsUvs&&a.enable(18),y.decodeVideoTexture&&a.enable(19),y.decodeVideoTextureEmissive&&a.enable(20),y.alphaToCoverage&&a.enable(21),S.push(a.mask)}function E(S){const y=g[S.type];let D;if(y){const $=Rn[y];D=V_.clone($.uniforms)}else D=S.uniforms;return D}function L(S,y){let D;for(let $=0,k=u.length;$<k;$++){const q=u[$];if(q.cacheKey===y){D=q,++D.usedTimes;break}}return D===void 0&&(D=new _S(n,y,S,r),u.push(D)),D}function T(S){if(--S.usedTimes===0){const y=u.indexOf(S);u[y]=u[u.length-1],u.pop(),S.destroy()}}function A(S){l.remove(S)}function R(){l.dispose()}return{getParameters:m,getProgramCacheKey:f,getUniforms:E,acquireProgram:L,releaseProgram:T,releaseShaderCache:A,programs:u,dispose:R}}function MS(){let n=new WeakMap;function e(o){return n.has(o)}function t(o){let a=n.get(o);return a===void 0&&(a={},n.set(o,a)),a}function i(o){n.delete(o)}function s(o,a,l){n.get(o)[a]=l}function r(){n=new WeakMap}return{has:e,get:t,remove:i,update:s,dispose:r}}function wS(n,e){return n.groupOrder!==e.groupOrder?n.groupOrder-e.groupOrder:n.renderOrder!==e.renderOrder?n.renderOrder-e.renderOrder:n.material.id!==e.material.id?n.material.id-e.material.id:n.z!==e.z?n.z-e.z:n.id-e.id}function dh(n,e){return n.groupOrder!==e.groupOrder?n.groupOrder-e.groupOrder:n.renderOrder!==e.renderOrder?n.renderOrder-e.renderOrder:n.z!==e.z?e.z-n.z:n.id-e.id}function hh(){const n=[];let e=0;const t=[],i=[],s=[];function r(){e=0,t.length=0,i.length=0,s.length=0}function o(d,h,p,g,_,m){let f=n[e];return f===void 0?(f={id:d.id,object:d,geometry:h,material:p,groupOrder:g,renderOrder:d.renderOrder,z:_,group:m},n[e]=f):(f.id=d.id,f.object=d,f.geometry=h,f.material=p,f.groupOrder=g,f.renderOrder=d.renderOrder,f.z=_,f.group=m),e++,f}function a(d,h,p,g,_,m){const f=o(d,h,p,g,_,m);p.transmission>0?i.push(f):p.transparent===!0?s.push(f):t.push(f)}function l(d,h,p,g,_,m){const f=o(d,h,p,g,_,m);p.transmission>0?i.unshift(f):p.transparent===!0?s.unshift(f):t.unshift(f)}function c(d,h){t.length>1&&t.sort(d||wS),i.length>1&&i.sort(h||dh),s.length>1&&s.sort(h||dh)}function u(){for(let d=e,h=n.length;d<h;d++){const p=n[d];if(p.id===null)break;p.id=null,p.object=null,p.geometry=null,p.material=null,p.group=null}}return{opaque:t,transmissive:i,transparent:s,init:r,push:a,unshift:l,finish:u,sort:c}}function bS(){let n=new WeakMap;function e(i,s){const r=n.get(i);let o;return r===void 0?(o=new hh,n.set(i,[o])):s>=r.length?(o=new hh,r.push(o)):o=r[s],o}function t(){n=new WeakMap}return{get:e,dispose:t}}function ES(){const n={};return{get:function(e){if(n[e.id]!==void 0)return n[e.id];let t;switch(e.type){case"DirectionalLight":t={direction:new F,color:new Pe};break;case"SpotLight":t={position:new F,direction:new F,color:new Pe,distance:0,coneCos:0,penumbraCos:0,decay:0};break;case"PointLight":t={position:new F,color:new Pe,distance:0,decay:0};break;case"HemisphereLight":t={direction:new F,skyColor:new Pe,groundColor:new Pe};break;case"RectAreaLight":t={color:new Pe,position:new F,halfWidth:new F,halfHeight:new F};break}return n[e.id]=t,t}}}function TS(){const n={};return{get:function(e){if(n[e.id]!==void 0)return n[e.id];let t;switch(e.type){case"DirectionalLight":t={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new Ve};break;case"SpotLight":t={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new Ve};break;case"PointLight":t={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new Ve,shadowCameraNear:1,shadowCameraFar:1e3};break}return n[e.id]=t,t}}}let AS=0;function RS(n,e){return(e.castShadow?2:0)-(n.castShadow?2:0)+(e.map?1:0)-(n.map?1:0)}function CS(n){const e=new ES,t=TS(),i={version:0,hash:{directionalLength:-1,pointLength:-1,spotLength:-1,rectAreaLength:-1,hemiLength:-1,numDirectionalShadows:-1,numPointShadows:-1,numSpotShadows:-1,numSpotMaps:-1,numLightProbes:-1},ambient:[0,0,0],probe:[],directional:[],directionalShadow:[],directionalShadowMap:[],directionalShadowMatrix:[],spot:[],spotLightMap:[],spotShadow:[],spotShadowMap:[],spotLightMatrix:[],rectArea:[],rectAreaLTC1:null,rectAreaLTC2:null,point:[],pointShadow:[],pointShadowMap:[],pointShadowMatrix:[],hemi:[],numSpotLightShadowsWithMaps:0,numLightProbes:0};for(let c=0;c<9;c++)i.probe.push(new F);const s=new F,r=new rt,o=new rt;function a(c){let u=0,d=0,h=0;for(let S=0;S<9;S++)i.probe[S].set(0,0,0);let p=0,g=0,_=0,m=0,f=0,M=0,b=0,E=0,L=0,T=0,A=0;c.sort(RS);for(let S=0,y=c.length;S<y;S++){const D=c[S],$=D.color,k=D.intensity,q=D.distance,Z=D.shadow&&D.shadow.map?D.shadow.map.texture:null;if(D.isAmbientLight)u+=$.r*k,d+=$.g*k,h+=$.b*k;else if(D.isLightProbe){for(let V=0;V<9;V++)i.probe[V].addScaledVector(D.sh.coefficients[V],k);A++}else if(D.isDirectionalLight){const V=e.get(D);if(V.color.copy(D.color).multiplyScalar(D.intensity),D.castShadow){const ie=D.shadow,H=t.get(D);H.shadowIntensity=ie.intensity,H.shadowBias=ie.bias,H.shadowNormalBias=ie.normalBias,H.shadowRadius=ie.radius,H.shadowMapSize=ie.mapSize,i.directionalShadow[p]=H,i.directionalShadowMap[p]=Z,i.directionalShadowMatrix[p]=D.shadow.matrix,M++}i.directional[p]=V,p++}else if(D.isSpotLight){const V=e.get(D);V.position.setFromMatrixPosition(D.matrixWorld),V.color.copy($).multiplyScalar(k),V.distance=q,V.coneCos=Math.cos(D.angle),V.penumbraCos=Math.cos(D.angle*(1-D.penumbra)),V.decay=D.decay,i.spot[_]=V;const ie=D.shadow;if(D.map&&(i.spotLightMap[L]=D.map,L++,ie.updateMatrices(D),D.castShadow&&T++),i.spotLightMatrix[_]=ie.matrix,D.castShadow){const H=t.get(D);H.shadowIntensity=ie.intensity,H.shadowBias=ie.bias,H.shadowNormalBias=ie.normalBias,H.shadowRadius=ie.radius,H.shadowMapSize=ie.mapSize,i.spotShadow[_]=H,i.spotShadowMap[_]=Z,E++}_++}else if(D.isRectAreaLight){const V=e.get(D);V.color.copy($).multiplyScalar(k),V.halfWidth.set(D.width*.5,0,0),V.halfHeight.set(0,D.height*.5,0),i.rectArea[m]=V,m++}else if(D.isPointLight){const V=e.get(D);if(V.color.copy(D.color).multiplyScalar(D.intensity),V.distance=D.distance,V.decay=D.decay,D.castShadow){const ie=D.shadow,H=t.get(D);H.shadowIntensity=ie.intensity,H.shadowBias=ie.bias,H.shadowNormalBias=ie.normalBias,H.shadowRadius=ie.radius,H.shadowMapSize=ie.mapSize,H.shadowCameraNear=ie.camera.near,H.shadowCameraFar=ie.camera.far,i.pointShadow[g]=H,i.pointShadowMap[g]=Z,i.pointShadowMatrix[g]=D.shadow.matrix,b++}i.point[g]=V,g++}else if(D.isHemisphereLight){const V=e.get(D);V.skyColor.copy(D.color).multiplyScalar(k),V.groundColor.copy(D.groundColor).multiplyScalar(k),i.hemi[f]=V,f++}}m>0&&(n.has("OES_texture_float_linear")===!0?(i.rectAreaLTC1=ue.LTC_FLOAT_1,i.rectAreaLTC2=ue.LTC_FLOAT_2):(i.rectAreaLTC1=ue.LTC_HALF_1,i.rectAreaLTC2=ue.LTC_HALF_2)),i.ambient[0]=u,i.ambient[1]=d,i.ambient[2]=h;const R=i.hash;(R.directionalLength!==p||R.pointLength!==g||R.spotLength!==_||R.rectAreaLength!==m||R.hemiLength!==f||R.numDirectionalShadows!==M||R.numPointShadows!==b||R.numSpotShadows!==E||R.numSpotMaps!==L||R.numLightProbes!==A)&&(i.directional.length=p,i.spot.length=_,i.rectArea.length=m,i.point.length=g,i.hemi.length=f,i.directionalShadow.length=M,i.directionalShadowMap.length=M,i.pointShadow.length=b,i.pointShadowMap.length=b,i.spotShadow.length=E,i.spotShadowMap.length=E,i.directionalShadowMatrix.length=M,i.pointShadowMatrix.length=b,i.spotLightMatrix.length=E+L-T,i.spotLightMap.length=L,i.numSpotLightShadowsWithMaps=T,i.numLightProbes=A,R.directionalLength=p,R.pointLength=g,R.spotLength=_,R.rectAreaLength=m,R.hemiLength=f,R.numDirectionalShadows=M,R.numPointShadows=b,R.numSpotShadows=E,R.numSpotMaps=L,R.numLightProbes=A,i.version=AS++)}function l(c,u){let d=0,h=0,p=0,g=0,_=0;const m=u.matrixWorldInverse;for(let f=0,M=c.length;f<M;f++){const b=c[f];if(b.isDirectionalLight){const E=i.directional[d];E.direction.setFromMatrixPosition(b.matrixWorld),s.setFromMatrixPosition(b.target.matrixWorld),E.direction.sub(s),E.direction.transformDirection(m),d++}else if(b.isSpotLight){const E=i.spot[p];E.position.setFromMatrixPosition(b.matrixWorld),E.position.applyMatrix4(m),E.direction.setFromMatrixPosition(b.matrixWorld),s.setFromMatrixPosition(b.target.matrixWorld),E.direction.sub(s),E.direction.transformDirection(m),p++}else if(b.isRectAreaLight){const E=i.rectArea[g];E.position.setFromMatrixPosition(b.matrixWorld),E.position.applyMatrix4(m),o.identity(),r.copy(b.matrixWorld),r.premultiply(m),o.extractRotation(r),E.halfWidth.set(b.width*.5,0,0),E.halfHeight.set(0,b.height*.5,0),E.halfWidth.applyMatrix4(o),E.halfHeight.applyMatrix4(o),g++}else if(b.isPointLight){const E=i.point[h];E.position.setFromMatrixPosition(b.matrixWorld),E.position.applyMatrix4(m),h++}else if(b.isHemisphereLight){const E=i.hemi[_];E.direction.setFromMatrixPosition(b.matrixWorld),E.direction.transformDirection(m),_++}}}return{setup:a,setupView:l,state:i}}function fh(n){const e=new CS(n),t=[],i=[];function s(u){c.camera=u,t.length=0,i.length=0}function r(u){t.push(u)}function o(u){i.push(u)}function a(){e.setup(t)}function l(u){e.setupView(t,u)}const c={lightsArray:t,shadowsArray:i,camera:null,lights:e,transmissionRenderTarget:{}};return{init:s,state:c,setupLights:a,setupLightsView:l,pushLight:r,pushShadow:o}}function PS(n){let e=new WeakMap;function t(s,r=0){const o=e.get(s);let a;return o===void 0?(a=new fh(n),e.set(s,[a])):r>=o.length?(a=new fh(n),o.push(a)):a=o[r],a}function i(){e=new WeakMap}return{get:t,dispose:i}}const LS=`void main() {
	gl_Position = vec4( position, 1.0 );
}`,DS=`uniform sampler2D shadow_pass;
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
}`;function IS(n,e,t){let i=new iu;const s=new Ve,r=new Ve,o=new yt,a=new t0({depthPacking:u_}),l=new n0,c={},u=t.maxTextureSize,d={[Mi]:Zt,[Zt]:Mi,[Xn]:Xn},h=new wi({defines:{VSM_SAMPLES:8},uniforms:{shadow_pass:{value:null},resolution:{value:new Ve},radius:{value:4}},vertexShader:LS,fragmentShader:DS}),p=h.clone();p.defines.HORIZONTAL_PASS=1;const g=new Ft;g.setAttribute("position",new Ut(new Float32Array([-1,-1,.5,3,-1,.5,-1,3,.5]),3));const _=new vn(g,h),m=this;this.enabled=!1,this.autoUpdate=!0,this.needsUpdate=!1,this.type=Of;let f=this.type;this.render=function(T,A,R){if(m.enabled===!1||m.autoUpdate===!1&&m.needsUpdate===!1||T.length===0)return;const S=n.getRenderTarget(),y=n.getActiveCubeFace(),D=n.getActiveMipmapLevel(),$=n.state;$.setBlending(vi),$.buffers.color.setClear(1,1,1,1),$.buffers.depth.setTest(!0),$.setScissorTest(!1);const k=f!==Vn&&this.type===Vn,q=f===Vn&&this.type!==Vn;for(let Z=0,V=T.length;Z<V;Z++){const ie=T[Z],H=ie.shadow;if(H===void 0){console.warn("THREE.WebGLShadowMap:",ie,"has no shadow.");continue}if(H.autoUpdate===!1&&H.needsUpdate===!1)continue;s.copy(H.mapSize);const oe=H.getFrameExtents();if(s.multiply(oe),r.copy(H.mapSize),(s.x>u||s.y>u)&&(s.x>u&&(r.x=Math.floor(u/oe.x),s.x=r.x*oe.x,H.mapSize.x=r.x),s.y>u&&(r.y=Math.floor(u/oe.y),s.y=r.y*oe.y,H.mapSize.y=r.y)),H.map===null||k===!0||q===!0){const Te=this.type!==Vn?{minFilter:on,magFilter:on}:{};H.map!==null&&H.map.dispose(),H.map=new Wi(s.x,s.y,Te),H.map.texture.name=ie.name+".shadowMap",H.camera.updateProjectionMatrix()}n.setRenderTarget(H.map),n.clear();const me=H.getViewportCount();for(let Te=0;Te<me;Te++){const $e=H.getViewport(Te);o.set(r.x*$e.x,r.y*$e.y,r.x*$e.z,r.y*$e.w),$.viewport(o),H.updateMatrices(ie,Te),i=H.getFrustum(),E(A,R,H.camera,ie,this.type)}H.isPointLightShadow!==!0&&this.type===Vn&&M(H,R),H.needsUpdate=!1}f=this.type,m.needsUpdate=!1,n.setRenderTarget(S,y,D)};function M(T,A){const R=e.update(_);h.defines.VSM_SAMPLES!==T.blurSamples&&(h.defines.VSM_SAMPLES=T.blurSamples,p.defines.VSM_SAMPLES=T.blurSamples,h.needsUpdate=!0,p.needsUpdate=!0),T.mapPass===null&&(T.mapPass=new Wi(s.x,s.y)),h.uniforms.shadow_pass.value=T.map.texture,h.uniforms.resolution.value=T.mapSize,h.uniforms.radius.value=T.radius,n.setRenderTarget(T.mapPass),n.clear(),n.renderBufferDirect(A,null,R,h,_,null),p.uniforms.shadow_pass.value=T.mapPass.texture,p.uniforms.resolution.value=T.mapSize,p.uniforms.radius.value=T.radius,n.setRenderTarget(T.map),n.clear(),n.renderBufferDirect(A,null,R,p,_,null)}function b(T,A,R,S){let y=null;const D=R.isPointLight===!0?T.customDistanceMaterial:T.customDepthMaterial;if(D!==void 0)y=D;else if(y=R.isPointLight===!0?l:a,n.localClippingEnabled&&A.clipShadows===!0&&Array.isArray(A.clippingPlanes)&&A.clippingPlanes.length!==0||A.displacementMap&&A.displacementScale!==0||A.alphaMap&&A.alphaTest>0||A.map&&A.alphaTest>0||A.alphaToCoverage===!0){const $=y.uuid,k=A.uuid;let q=c[$];q===void 0&&(q={},c[$]=q);let Z=q[k];Z===void 0&&(Z=y.clone(),q[k]=Z,A.addEventListener("dispose",L)),y=Z}if(y.visible=A.visible,y.wireframe=A.wireframe,S===Vn?y.side=A.shadowSide!==null?A.shadowSide:A.side:y.side=A.shadowSide!==null?A.shadowSide:d[A.side],y.alphaMap=A.alphaMap,y.alphaTest=A.alphaToCoverage===!0?.5:A.alphaTest,y.map=A.map,y.clipShadows=A.clipShadows,y.clippingPlanes=A.clippingPlanes,y.clipIntersection=A.clipIntersection,y.displacementMap=A.displacementMap,y.displacementScale=A.displacementScale,y.displacementBias=A.displacementBias,y.wireframeLinewidth=A.wireframeLinewidth,y.linewidth=A.linewidth,R.isPointLight===!0&&y.isMeshDistanceMaterial===!0){const $=n.properties.get(y);$.light=R}return y}function E(T,A,R,S,y){if(T.visible===!1)return;if(T.layers.test(A.layers)&&(T.isMesh||T.isLine||T.isPoints)&&(T.castShadow||T.receiveShadow&&y===Vn)&&(!T.frustumCulled||i.intersectsObject(T))){T.modelViewMatrix.multiplyMatrices(R.matrixWorldInverse,T.matrixWorld);const k=e.update(T),q=T.material;if(Array.isArray(q)){const Z=k.groups;for(let V=0,ie=Z.length;V<ie;V++){const H=Z[V],oe=q[H.materialIndex];if(oe&&oe.visible){const me=b(T,oe,S,y);T.onBeforeShadow(n,T,A,R,k,me,H),n.renderBufferDirect(R,null,k,me,T,H),T.onAfterShadow(n,T,A,R,k,me,H)}}}else if(q.visible){const Z=b(T,q,S,y);T.onBeforeShadow(n,T,A,R,k,Z,null),n.renderBufferDirect(R,null,k,Z,T,null),T.onAfterShadow(n,T,A,R,k,Z,null)}}const $=T.children;for(let k=0,q=$.length;k<q;k++)E($[k],A,R,S,y)}function L(T){T.target.removeEventListener("dispose",L);for(const R in c){const S=c[R],y=T.target.uuid;y in S&&(S[y].dispose(),delete S[y])}}}const US={[yl]:Sl,[Ml]:El,[wl]:Tl,[Ds]:bl,[Sl]:yl,[El]:Ml,[Tl]:wl,[bl]:Ds};function NS(n,e){function t(){let I=!1;const fe=new yt;let te=null;const ye=new yt(0,0,0,0);return{setMask:function(ne){te!==ne&&!I&&(n.colorMask(ne,ne,ne,ne),te=ne)},setLocked:function(ne){I=ne},setClear:function(ne,K,Se,He,pt){pt===!0&&(ne*=He,K*=He,Se*=He),fe.set(ne,K,Se,He),ye.equals(fe)===!1&&(n.clearColor(ne,K,Se,He),ye.copy(fe))},reset:function(){I=!1,te=null,ye.set(-1,0,0,0)}}}function i(){let I=!1,fe=!1,te=null,ye=null,ne=null;return{setReversed:function(K){if(fe!==K){const Se=e.get("EXT_clip_control");K?Se.clipControlEXT(Se.LOWER_LEFT_EXT,Se.ZERO_TO_ONE_EXT):Se.clipControlEXT(Se.LOWER_LEFT_EXT,Se.NEGATIVE_ONE_TO_ONE_EXT),fe=K;const He=ne;ne=null,this.setClear(He)}},getReversed:function(){return fe},setTest:function(K){K?he(n.DEPTH_TEST):we(n.DEPTH_TEST)},setMask:function(K){te!==K&&!I&&(n.depthMask(K),te=K)},setFunc:function(K){if(fe&&(K=US[K]),ye!==K){switch(K){case yl:n.depthFunc(n.NEVER);break;case Sl:n.depthFunc(n.ALWAYS);break;case Ml:n.depthFunc(n.LESS);break;case Ds:n.depthFunc(n.LEQUAL);break;case wl:n.depthFunc(n.EQUAL);break;case bl:n.depthFunc(n.GEQUAL);break;case El:n.depthFunc(n.GREATER);break;case Tl:n.depthFunc(n.NOTEQUAL);break;default:n.depthFunc(n.LEQUAL)}ye=K}},setLocked:function(K){I=K},setClear:function(K){ne!==K&&(fe&&(K=1-K),n.clearDepth(K),ne=K)},reset:function(){I=!1,te=null,ye=null,ne=null,fe=!1}}}function s(){let I=!1,fe=null,te=null,ye=null,ne=null,K=null,Se=null,He=null,pt=null;return{setTest:function(ot){I||(ot?he(n.STENCIL_TEST):we(n.STENCIL_TEST))},setMask:function(ot){fe!==ot&&!I&&(n.stencilMask(ot),fe=ot)},setFunc:function(ot,Mn,On){(te!==ot||ye!==Mn||ne!==On)&&(n.stencilFunc(ot,Mn,On),te=ot,ye=Mn,ne=On)},setOp:function(ot,Mn,On){(K!==ot||Se!==Mn||He!==On)&&(n.stencilOp(ot,Mn,On),K=ot,Se=Mn,He=On)},setLocked:function(ot){I=ot},setClear:function(ot){pt!==ot&&(n.clearStencil(ot),pt=ot)},reset:function(){I=!1,fe=null,te=null,ye=null,ne=null,K=null,Se=null,He=null,pt=null}}}const r=new t,o=new i,a=new s,l=new WeakMap,c=new WeakMap;let u={},d={},h=new WeakMap,p=[],g=null,_=!1,m=null,f=null,M=null,b=null,E=null,L=null,T=null,A=new Pe(0,0,0),R=0,S=!1,y=null,D=null,$=null,k=null,q=null;const Z=n.getParameter(n.MAX_COMBINED_TEXTURE_IMAGE_UNITS);let V=!1,ie=0;const H=n.getParameter(n.VERSION);H.indexOf("WebGL")!==-1?(ie=parseFloat(/^WebGL (\d)/.exec(H)[1]),V=ie>=1):H.indexOf("OpenGL ES")!==-1&&(ie=parseFloat(/^OpenGL ES (\d)/.exec(H)[1]),V=ie>=2);let oe=null,me={};const Te=n.getParameter(n.SCISSOR_BOX),$e=n.getParameter(n.VIEWPORT),je=new yt().fromArray(Te),X=new yt().fromArray($e);function ae(I,fe,te,ye){const ne=new Uint8Array(4),K=n.createTexture();n.bindTexture(I,K),n.texParameteri(I,n.TEXTURE_MIN_FILTER,n.NEAREST),n.texParameteri(I,n.TEXTURE_MAG_FILTER,n.NEAREST);for(let Se=0;Se<te;Se++)I===n.TEXTURE_3D||I===n.TEXTURE_2D_ARRAY?n.texImage3D(fe,0,n.RGBA,1,1,ye,0,n.RGBA,n.UNSIGNED_BYTE,ne):n.texImage2D(fe+Se,0,n.RGBA,1,1,0,n.RGBA,n.UNSIGNED_BYTE,ne);return K}const Ee={};Ee[n.TEXTURE_2D]=ae(n.TEXTURE_2D,n.TEXTURE_2D,1),Ee[n.TEXTURE_CUBE_MAP]=ae(n.TEXTURE_CUBE_MAP,n.TEXTURE_CUBE_MAP_POSITIVE_X,6),Ee[n.TEXTURE_2D_ARRAY]=ae(n.TEXTURE_2D_ARRAY,n.TEXTURE_2D_ARRAY,1,1),Ee[n.TEXTURE_3D]=ae(n.TEXTURE_3D,n.TEXTURE_3D,1,1),r.setClear(0,0,0,1),o.setClear(1),a.setClear(0),he(n.DEPTH_TEST),o.setFunc(Ds),st(!1),ht(sd),he(n.CULL_FACE),P(vi);function he(I){u[I]!==!0&&(n.enable(I),u[I]=!0)}function we(I){u[I]!==!1&&(n.disable(I),u[I]=!1)}function Qe(I,fe){return d[I]!==fe?(n.bindFramebuffer(I,fe),d[I]=fe,I===n.DRAW_FRAMEBUFFER&&(d[n.FRAMEBUFFER]=fe),I===n.FRAMEBUFFER&&(d[n.DRAW_FRAMEBUFFER]=fe),!0):!1}function Y(I,fe){let te=p,ye=!1;if(I){te=h.get(fe),te===void 0&&(te=[],h.set(fe,te));const ne=I.textures;if(te.length!==ne.length||te[0]!==n.COLOR_ATTACHMENT0){for(let K=0,Se=ne.length;K<Se;K++)te[K]=n.COLOR_ATTACHMENT0+K;te.length=ne.length,ye=!0}}else te[0]!==n.BACK&&(te[0]=n.BACK,ye=!0);ye&&n.drawBuffers(te)}function ge(I){return g!==I?(n.useProgram(I),g=I,!0):!1}const Xe={[Ui]:n.FUNC_ADD,[Fg]:n.FUNC_SUBTRACT,[Og]:n.FUNC_REVERSE_SUBTRACT};Xe[Bg]=n.MIN,Xe[kg]=n.MAX;const Oe={[zg]:n.ZERO,[Gg]:n.ONE,[Hg]:n.SRC_COLOR,[vl]:n.SRC_ALPHA,[qg]:n.SRC_ALPHA_SATURATE,[Xg]:n.DST_COLOR,[$g]:n.DST_ALPHA,[Vg]:n.ONE_MINUS_SRC_COLOR,[xl]:n.ONE_MINUS_SRC_ALPHA,[Yg]:n.ONE_MINUS_DST_COLOR,[Wg]:n.ONE_MINUS_DST_ALPHA,[jg]:n.CONSTANT_COLOR,[Kg]:n.ONE_MINUS_CONSTANT_COLOR,[Zg]:n.CONSTANT_ALPHA,[Jg]:n.ONE_MINUS_CONSTANT_ALPHA};function P(I,fe,te,ye,ne,K,Se,He,pt,ot){if(I===vi){_===!0&&(we(n.BLEND),_=!1);return}if(_===!1&&(he(n.BLEND),_=!0),I!==Ng){if(I!==m||ot!==S){if((f!==Ui||E!==Ui)&&(n.blendEquation(n.FUNC_ADD),f=Ui,E=Ui),ot)switch(I){case Es:n.blendFuncSeparate(n.ONE,n.ONE_MINUS_SRC_ALPHA,n.ONE,n.ONE_MINUS_SRC_ALPHA);break;case rd:n.blendFunc(n.ONE,n.ONE);break;case od:n.blendFuncSeparate(n.ZERO,n.ONE_MINUS_SRC_COLOR,n.ZERO,n.ONE);break;case ad:n.blendFuncSeparate(n.DST_COLOR,n.ONE_MINUS_SRC_ALPHA,n.ZERO,n.ONE);break;default:console.error("THREE.WebGLState: Invalid blending: ",I);break}else switch(I){case Es:n.blendFuncSeparate(n.SRC_ALPHA,n.ONE_MINUS_SRC_ALPHA,n.ONE,n.ONE_MINUS_SRC_ALPHA);break;case rd:n.blendFuncSeparate(n.SRC_ALPHA,n.ONE,n.ONE,n.ONE);break;case od:console.error("THREE.WebGLState: SubtractiveBlending requires material.premultipliedAlpha = true");break;case ad:console.error("THREE.WebGLState: MultiplyBlending requires material.premultipliedAlpha = true");break;default:console.error("THREE.WebGLState: Invalid blending: ",I);break}M=null,b=null,L=null,T=null,A.set(0,0,0),R=0,m=I,S=ot}return}ne=ne||fe,K=K||te,Se=Se||ye,(fe!==f||ne!==E)&&(n.blendEquationSeparate(Xe[fe],Xe[ne]),f=fe,E=ne),(te!==M||ye!==b||K!==L||Se!==T)&&(n.blendFuncSeparate(Oe[te],Oe[ye],Oe[K],Oe[Se]),M=te,b=ye,L=K,T=Se),(He.equals(A)===!1||pt!==R)&&(n.blendColor(He.r,He.g,He.b,pt),A.copy(He),R=pt),m=I,S=!1}function bt(I,fe){I.side===Xn?we(n.CULL_FACE):he(n.CULL_FACE);let te=I.side===Zt;fe&&(te=!te),st(te),I.blending===Es&&I.transparent===!1?P(vi):P(I.blending,I.blendEquation,I.blendSrc,I.blendDst,I.blendEquationAlpha,I.blendSrcAlpha,I.blendDstAlpha,I.blendColor,I.blendAlpha,I.premultipliedAlpha),o.setFunc(I.depthFunc),o.setTest(I.depthTest),o.setMask(I.depthWrite),r.setMask(I.colorWrite);const ye=I.stencilWrite;a.setTest(ye),ye&&(a.setMask(I.stencilWriteMask),a.setFunc(I.stencilFunc,I.stencilRef,I.stencilFuncMask),a.setOp(I.stencilFail,I.stencilZFail,I.stencilZPass)),tt(I.polygonOffset,I.polygonOffsetFactor,I.polygonOffsetUnits),I.alphaToCoverage===!0?he(n.SAMPLE_ALPHA_TO_COVERAGE):we(n.SAMPLE_ALPHA_TO_COVERAGE)}function st(I){y!==I&&(I?n.frontFace(n.CW):n.frontFace(n.CCW),y=I)}function ht(I){I!==Dg?(he(n.CULL_FACE),I!==D&&(I===sd?n.cullFace(n.BACK):I===Ig?n.cullFace(n.FRONT):n.cullFace(n.FRONT_AND_BACK))):we(n.CULL_FACE),D=I}function Ae(I){I!==$&&(V&&n.lineWidth(I),$=I)}function tt(I,fe,te){I?(he(n.POLYGON_OFFSET_FILL),(k!==fe||q!==te)&&(n.polygonOffset(fe,te),k=fe,q=te)):we(n.POLYGON_OFFSET_FILL)}function De(I){I?he(n.SCISSOR_TEST):we(n.SCISSOR_TEST)}function Ke(I){I===void 0&&(I=n.TEXTURE0+Z-1),oe!==I&&(n.activeTexture(I),oe=I)}function Et(I,fe,te){te===void 0&&(oe===null?te=n.TEXTURE0+Z-1:te=oe);let ye=me[te];ye===void 0&&(ye={type:void 0,texture:void 0},me[te]=ye),(ye.type!==I||ye.texture!==fe)&&(oe!==te&&(n.activeTexture(te),oe=te),n.bindTexture(I,fe||Ee[I]),ye.type=I,ye.texture=fe)}function C(){const I=me[oe];I!==void 0&&I.type!==void 0&&(n.bindTexture(I.type,null),I.type=void 0,I.texture=void 0)}function x(){try{n.compressedTexImage2D(...arguments)}catch(I){console.error("THREE.WebGLState:",I)}}function O(){try{n.compressedTexImage3D(...arguments)}catch(I){console.error("THREE.WebGLState:",I)}}function j(){try{n.texSubImage2D(...arguments)}catch(I){console.error("THREE.WebGLState:",I)}}function J(){try{n.texSubImage3D(...arguments)}catch(I){console.error("THREE.WebGLState:",I)}}function W(){try{n.compressedTexSubImage2D(...arguments)}catch(I){console.error("THREE.WebGLState:",I)}}function Re(){try{n.compressedTexSubImage3D(...arguments)}catch(I){console.error("THREE.WebGLState:",I)}}function de(){try{n.texStorage2D(...arguments)}catch(I){console.error("THREE.WebGLState:",I)}}function be(){try{n.texStorage3D(...arguments)}catch(I){console.error("THREE.WebGLState:",I)}}function Ce(){try{n.texImage2D(...arguments)}catch(I){console.error("THREE.WebGLState:",I)}}function ee(){try{n.texImage3D(...arguments)}catch(I){console.error("THREE.WebGLState:",I)}}function _e(I){je.equals(I)===!1&&(n.scissor(I.x,I.y,I.z,I.w),je.copy(I))}function Fe(I){X.equals(I)===!1&&(n.viewport(I.x,I.y,I.z,I.w),X.copy(I))}function Ue(I,fe){let te=c.get(fe);te===void 0&&(te=new WeakMap,c.set(fe,te));let ye=te.get(I);ye===void 0&&(ye=n.getUniformBlockIndex(fe,I.name),te.set(I,ye))}function ce(I,fe){const ye=c.get(fe).get(I);l.get(fe)!==ye&&(n.uniformBlockBinding(fe,ye,I.__bindingPointIndex),l.set(fe,ye))}function Ge(){n.disable(n.BLEND),n.disable(n.CULL_FACE),n.disable(n.DEPTH_TEST),n.disable(n.POLYGON_OFFSET_FILL),n.disable(n.SCISSOR_TEST),n.disable(n.STENCIL_TEST),n.disable(n.SAMPLE_ALPHA_TO_COVERAGE),n.blendEquation(n.FUNC_ADD),n.blendFunc(n.ONE,n.ZERO),n.blendFuncSeparate(n.ONE,n.ZERO,n.ONE,n.ZERO),n.blendColor(0,0,0,0),n.colorMask(!0,!0,!0,!0),n.clearColor(0,0,0,0),n.depthMask(!0),n.depthFunc(n.LESS),o.setReversed(!1),n.clearDepth(1),n.stencilMask(4294967295),n.stencilFunc(n.ALWAYS,0,4294967295),n.stencilOp(n.KEEP,n.KEEP,n.KEEP),n.clearStencil(0),n.cullFace(n.BACK),n.frontFace(n.CCW),n.polygonOffset(0,0),n.activeTexture(n.TEXTURE0),n.bindFramebuffer(n.FRAMEBUFFER,null),n.bindFramebuffer(n.DRAW_FRAMEBUFFER,null),n.bindFramebuffer(n.READ_FRAMEBUFFER,null),n.useProgram(null),n.lineWidth(1),n.scissor(0,0,n.canvas.width,n.canvas.height),n.viewport(0,0,n.canvas.width,n.canvas.height),u={},oe=null,me={},d={},h=new WeakMap,p=[],g=null,_=!1,m=null,f=null,M=null,b=null,E=null,L=null,T=null,A=new Pe(0,0,0),R=0,S=!1,y=null,D=null,$=null,k=null,q=null,je.set(0,0,n.canvas.width,n.canvas.height),X.set(0,0,n.canvas.width,n.canvas.height),r.reset(),o.reset(),a.reset()}return{buffers:{color:r,depth:o,stencil:a},enable:he,disable:we,bindFramebuffer:Qe,drawBuffers:Y,useProgram:ge,setBlending:P,setMaterial:bt,setFlipSided:st,setCullFace:ht,setLineWidth:Ae,setPolygonOffset:tt,setScissorTest:De,activeTexture:Ke,bindTexture:Et,unbindTexture:C,compressedTexImage2D:x,compressedTexImage3D:O,texImage2D:Ce,texImage3D:ee,updateUBOMapping:Ue,uniformBlockBinding:ce,texStorage2D:de,texStorage3D:be,texSubImage2D:j,texSubImage3D:J,compressedTexSubImage2D:W,compressedTexSubImage3D:Re,scissor:_e,viewport:Fe,reset:Ge}}function FS(n,e,t,i,s,r,o){const a=e.has("WEBGL_multisampled_render_to_texture")?e.get("WEBGL_multisampled_render_to_texture"):null,l=typeof navigator>"u"?!1:/OculusBrowser/g.test(navigator.userAgent),c=new Ve,u=new WeakMap;let d;const h=new WeakMap;let p=!1;try{p=typeof OffscreenCanvas<"u"&&new OffscreenCanvas(1,1).getContext("2d")!==null}catch{}function g(C,x){return p?new OffscreenCanvas(C,x):$o("canvas")}function _(C,x,O){let j=1;const J=Et(C);if((J.width>O||J.height>O)&&(j=O/Math.max(J.width,J.height)),j<1)if(typeof HTMLImageElement<"u"&&C instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&C instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&C instanceof ImageBitmap||typeof VideoFrame<"u"&&C instanceof VideoFrame){const W=Math.floor(j*J.width),Re=Math.floor(j*J.height);d===void 0&&(d=g(W,Re));const de=x?g(W,Re):d;return de.width=W,de.height=Re,de.getContext("2d").drawImage(C,0,0,W,Re),console.warn("THREE.WebGLRenderer: Texture has been resized from ("+J.width+"x"+J.height+") to ("+W+"x"+Re+")."),de}else return"data"in C&&console.warn("THREE.WebGLRenderer: Image in DataTexture is too big ("+J.width+"x"+J.height+")."),C;return C}function m(C){return C.generateMipmaps}function f(C){n.generateMipmap(C)}function M(C){return C.isWebGLCubeRenderTarget?n.TEXTURE_CUBE_MAP:C.isWebGL3DRenderTarget?n.TEXTURE_3D:C.isWebGLArrayRenderTarget||C.isCompressedArrayTexture?n.TEXTURE_2D_ARRAY:n.TEXTURE_2D}function b(C,x,O,j,J=!1){if(C!==null){if(n[C]!==void 0)return n[C];console.warn("THREE.WebGLRenderer: Attempt to use non-existing WebGL internal format '"+C+"'")}let W=x;if(x===n.RED&&(O===n.FLOAT&&(W=n.R32F),O===n.HALF_FLOAT&&(W=n.R16F),O===n.UNSIGNED_BYTE&&(W=n.R8)),x===n.RED_INTEGER&&(O===n.UNSIGNED_BYTE&&(W=n.R8UI),O===n.UNSIGNED_SHORT&&(W=n.R16UI),O===n.UNSIGNED_INT&&(W=n.R32UI),O===n.BYTE&&(W=n.R8I),O===n.SHORT&&(W=n.R16I),O===n.INT&&(W=n.R32I)),x===n.RG&&(O===n.FLOAT&&(W=n.RG32F),O===n.HALF_FLOAT&&(W=n.RG16F),O===n.UNSIGNED_BYTE&&(W=n.RG8)),x===n.RG_INTEGER&&(O===n.UNSIGNED_BYTE&&(W=n.RG8UI),O===n.UNSIGNED_SHORT&&(W=n.RG16UI),O===n.UNSIGNED_INT&&(W=n.RG32UI),O===n.BYTE&&(W=n.RG8I),O===n.SHORT&&(W=n.RG16I),O===n.INT&&(W=n.RG32I)),x===n.RGB_INTEGER&&(O===n.UNSIGNED_BYTE&&(W=n.RGB8UI),O===n.UNSIGNED_SHORT&&(W=n.RGB16UI),O===n.UNSIGNED_INT&&(W=n.RGB32UI),O===n.BYTE&&(W=n.RGB8I),O===n.SHORT&&(W=n.RGB16I),O===n.INT&&(W=n.RGB32I)),x===n.RGBA_INTEGER&&(O===n.UNSIGNED_BYTE&&(W=n.RGBA8UI),O===n.UNSIGNED_SHORT&&(W=n.RGBA16UI),O===n.UNSIGNED_INT&&(W=n.RGBA32UI),O===n.BYTE&&(W=n.RGBA8I),O===n.SHORT&&(W=n.RGBA16I),O===n.INT&&(W=n.RGBA32I)),x===n.RGB&&O===n.UNSIGNED_INT_5_9_9_9_REV&&(W=n.RGB9_E5),x===n.RGBA){const Re=J?Ho:it.getTransfer(j);O===n.FLOAT&&(W=n.RGBA32F),O===n.HALF_FLOAT&&(W=n.RGBA16F),O===n.UNSIGNED_BYTE&&(W=Re===ct?n.SRGB8_ALPHA8:n.RGBA8),O===n.UNSIGNED_SHORT_4_4_4_4&&(W=n.RGBA4),O===n.UNSIGNED_SHORT_5_5_5_1&&(W=n.RGB5_A1)}return(W===n.R16F||W===n.R32F||W===n.RG16F||W===n.RG32F||W===n.RGBA16F||W===n.RGBA32F)&&e.get("EXT_color_buffer_float"),W}function E(C,x){let O;return C?x===null||x===Vi||x===vr?O=n.DEPTH24_STENCIL8:x===Pn?O=n.DEPTH32F_STENCIL8:x===_r&&(O=n.DEPTH24_STENCIL8,console.warn("DepthTexture: 16 bit depth attachment is not supported with stencil. Using 24-bit attachment.")):x===null||x===Vi||x===vr?O=n.DEPTH_COMPONENT24:x===Pn?O=n.DEPTH_COMPONENT32F:x===_r&&(O=n.DEPTH_COMPONENT16),O}function L(C,x){return m(C)===!0||C.isFramebufferTexture&&C.minFilter!==on&&C.minFilter!==Cn?Math.log2(Math.max(x.width,x.height))+1:C.mipmaps!==void 0&&C.mipmaps.length>0?C.mipmaps.length:C.isCompressedTexture&&Array.isArray(C.image)?x.mipmaps.length:1}function T(C){const x=C.target;x.removeEventListener("dispose",T),R(x),x.isVideoTexture&&u.delete(x)}function A(C){const x=C.target;x.removeEventListener("dispose",A),y(x)}function R(C){const x=i.get(C);if(x.__webglInit===void 0)return;const O=C.source,j=h.get(O);if(j){const J=j[x.__cacheKey];J.usedTimes--,J.usedTimes===0&&S(C),Object.keys(j).length===0&&h.delete(O)}i.remove(C)}function S(C){const x=i.get(C);n.deleteTexture(x.__webglTexture);const O=C.source,j=h.get(O);delete j[x.__cacheKey],o.memory.textures--}function y(C){const x=i.get(C);if(C.depthTexture&&(C.depthTexture.dispose(),i.remove(C.depthTexture)),C.isWebGLCubeRenderTarget)for(let j=0;j<6;j++){if(Array.isArray(x.__webglFramebuffer[j]))for(let J=0;J<x.__webglFramebuffer[j].length;J++)n.deleteFramebuffer(x.__webglFramebuffer[j][J]);else n.deleteFramebuffer(x.__webglFramebuffer[j]);x.__webglDepthbuffer&&n.deleteRenderbuffer(x.__webglDepthbuffer[j])}else{if(Array.isArray(x.__webglFramebuffer))for(let j=0;j<x.__webglFramebuffer.length;j++)n.deleteFramebuffer(x.__webglFramebuffer[j]);else n.deleteFramebuffer(x.__webglFramebuffer);if(x.__webglDepthbuffer&&n.deleteRenderbuffer(x.__webglDepthbuffer),x.__webglMultisampledFramebuffer&&n.deleteFramebuffer(x.__webglMultisampledFramebuffer),x.__webglColorRenderbuffer)for(let j=0;j<x.__webglColorRenderbuffer.length;j++)x.__webglColorRenderbuffer[j]&&n.deleteRenderbuffer(x.__webglColorRenderbuffer[j]);x.__webglDepthRenderbuffer&&n.deleteRenderbuffer(x.__webglDepthRenderbuffer)}const O=C.textures;for(let j=0,J=O.length;j<J;j++){const W=i.get(O[j]);W.__webglTexture&&(n.deleteTexture(W.__webglTexture),o.memory.textures--),i.remove(O[j])}i.remove(C)}let D=0;function $(){D=0}function k(){const C=D;return C>=s.maxTextures&&console.warn("THREE.WebGLTextures: Trying to use "+C+" texture units while this GPU supports only "+s.maxTextures),D+=1,C}function q(C){const x=[];return x.push(C.wrapS),x.push(C.wrapT),x.push(C.wrapR||0),x.push(C.magFilter),x.push(C.minFilter),x.push(C.anisotropy),x.push(C.internalFormat),x.push(C.format),x.push(C.type),x.push(C.generateMipmaps),x.push(C.premultiplyAlpha),x.push(C.flipY),x.push(C.unpackAlignment),x.push(C.colorSpace),x.join()}function Z(C,x){const O=i.get(C);if(C.isVideoTexture&&De(C),C.isRenderTargetTexture===!1&&C.version>0&&O.__version!==C.version){const j=C.image;if(j===null)console.warn("THREE.WebGLRenderer: Texture marked for update but no image data found.");else if(j.complete===!1)console.warn("THREE.WebGLRenderer: Texture marked for update but image is incomplete");else{Ee(O,C,x);return}}t.bindTexture(n.TEXTURE_2D,O.__webglTexture,n.TEXTURE0+x)}function V(C,x){const O=i.get(C);if(C.version>0&&O.__version!==C.version){Ee(O,C,x);return}t.bindTexture(n.TEXTURE_2D_ARRAY,O.__webglTexture,n.TEXTURE0+x)}function ie(C,x){const O=i.get(C);if(C.version>0&&O.__version!==C.version){Ee(O,C,x);return}t.bindTexture(n.TEXTURE_3D,O.__webglTexture,n.TEXTURE0+x)}function H(C,x){const O=i.get(C);if(C.version>0&&O.__version!==C.version){he(O,C,x);return}t.bindTexture(n.TEXTURE_CUBE_MAP,O.__webglTexture,n.TEXTURE0+x)}const oe={[Cl]:n.REPEAT,[Oi]:n.CLAMP_TO_EDGE,[Pl]:n.MIRRORED_REPEAT},me={[on]:n.NEAREST,[l_]:n.NEAREST_MIPMAP_NEAREST,[Gr]:n.NEAREST_MIPMAP_LINEAR,[Cn]:n.LINEAR,[Ma]:n.LINEAR_MIPMAP_NEAREST,[Bi]:n.LINEAR_MIPMAP_LINEAR},Te={[h_]:n.NEVER,[v_]:n.ALWAYS,[f_]:n.LESS,[Yf]:n.LEQUAL,[p_]:n.EQUAL,[__]:n.GEQUAL,[m_]:n.GREATER,[g_]:n.NOTEQUAL};function $e(C,x){if(x.type===Pn&&e.has("OES_texture_float_linear")===!1&&(x.magFilter===Cn||x.magFilter===Ma||x.magFilter===Gr||x.magFilter===Bi||x.minFilter===Cn||x.minFilter===Ma||x.minFilter===Gr||x.minFilter===Bi)&&console.warn("THREE.WebGLRenderer: Unable to use linear filtering with floating point textures. OES_texture_float_linear not supported on this device."),n.texParameteri(C,n.TEXTURE_WRAP_S,oe[x.wrapS]),n.texParameteri(C,n.TEXTURE_WRAP_T,oe[x.wrapT]),(C===n.TEXTURE_3D||C===n.TEXTURE_2D_ARRAY)&&n.texParameteri(C,n.TEXTURE_WRAP_R,oe[x.wrapR]),n.texParameteri(C,n.TEXTURE_MAG_FILTER,me[x.magFilter]),n.texParameteri(C,n.TEXTURE_MIN_FILTER,me[x.minFilter]),x.compareFunction&&(n.texParameteri(C,n.TEXTURE_COMPARE_MODE,n.COMPARE_REF_TO_TEXTURE),n.texParameteri(C,n.TEXTURE_COMPARE_FUNC,Te[x.compareFunction])),e.has("EXT_texture_filter_anisotropic")===!0){if(x.magFilter===on||x.minFilter!==Gr&&x.minFilter!==Bi||x.type===Pn&&e.has("OES_texture_float_linear")===!1)return;if(x.anisotropy>1||i.get(x).__currentAnisotropy){const O=e.get("EXT_texture_filter_anisotropic");n.texParameterf(C,O.TEXTURE_MAX_ANISOTROPY_EXT,Math.min(x.anisotropy,s.getMaxAnisotropy())),i.get(x).__currentAnisotropy=x.anisotropy}}}function je(C,x){let O=!1;C.__webglInit===void 0&&(C.__webglInit=!0,x.addEventListener("dispose",T));const j=x.source;let J=h.get(j);J===void 0&&(J={},h.set(j,J));const W=q(x);if(W!==C.__cacheKey){J[W]===void 0&&(J[W]={texture:n.createTexture(),usedTimes:0},o.memory.textures++,O=!0),J[W].usedTimes++;const Re=J[C.__cacheKey];Re!==void 0&&(J[C.__cacheKey].usedTimes--,Re.usedTimes===0&&S(x)),C.__cacheKey=W,C.__webglTexture=J[W].texture}return O}function X(C,x,O){return Math.floor(Math.floor(C/O)/x)}function ae(C,x,O,j){const W=C.updateRanges;if(W.length===0)t.texSubImage2D(n.TEXTURE_2D,0,0,0,x.width,x.height,O,j,x.data);else{W.sort((ee,_e)=>ee.start-_e.start);let Re=0;for(let ee=1;ee<W.length;ee++){const _e=W[Re],Fe=W[ee],Ue=_e.start+_e.count,ce=X(Fe.start,x.width,4),Ge=X(_e.start,x.width,4);Fe.start<=Ue+1&&ce===Ge&&X(Fe.start+Fe.count-1,x.width,4)===ce?_e.count=Math.max(_e.count,Fe.start+Fe.count-_e.start):(++Re,W[Re]=Fe)}W.length=Re+1;const de=n.getParameter(n.UNPACK_ROW_LENGTH),be=n.getParameter(n.UNPACK_SKIP_PIXELS),Ce=n.getParameter(n.UNPACK_SKIP_ROWS);n.pixelStorei(n.UNPACK_ROW_LENGTH,x.width);for(let ee=0,_e=W.length;ee<_e;ee++){const Fe=W[ee],Ue=Math.floor(Fe.start/4),ce=Math.ceil(Fe.count/4),Ge=Ue%x.width,I=Math.floor(Ue/x.width),fe=ce,te=1;n.pixelStorei(n.UNPACK_SKIP_PIXELS,Ge),n.pixelStorei(n.UNPACK_SKIP_ROWS,I),t.texSubImage2D(n.TEXTURE_2D,0,Ge,I,fe,te,O,j,x.data)}C.clearUpdateRanges(),n.pixelStorei(n.UNPACK_ROW_LENGTH,de),n.pixelStorei(n.UNPACK_SKIP_PIXELS,be),n.pixelStorei(n.UNPACK_SKIP_ROWS,Ce)}}function Ee(C,x,O){let j=n.TEXTURE_2D;(x.isDataArrayTexture||x.isCompressedArrayTexture)&&(j=n.TEXTURE_2D_ARRAY),x.isData3DTexture&&(j=n.TEXTURE_3D);const J=je(C,x),W=x.source;t.bindTexture(j,C.__webglTexture,n.TEXTURE0+O);const Re=i.get(W);if(W.version!==Re.__version||J===!0){t.activeTexture(n.TEXTURE0+O);const de=it.getPrimaries(it.workingColorSpace),be=x.colorSpace===ui?null:it.getPrimaries(x.colorSpace),Ce=x.colorSpace===ui||de===be?n.NONE:n.BROWSER_DEFAULT_WEBGL;n.pixelStorei(n.UNPACK_FLIP_Y_WEBGL,x.flipY),n.pixelStorei(n.UNPACK_PREMULTIPLY_ALPHA_WEBGL,x.premultiplyAlpha),n.pixelStorei(n.UNPACK_ALIGNMENT,x.unpackAlignment),n.pixelStorei(n.UNPACK_COLORSPACE_CONVERSION_WEBGL,Ce);let ee=_(x.image,!1,s.maxTextureSize);ee=Ke(x,ee);const _e=r.convert(x.format,x.colorSpace),Fe=r.convert(x.type);let Ue=b(x.internalFormat,_e,Fe,x.colorSpace,x.isVideoTexture);$e(j,x);let ce;const Ge=x.mipmaps,I=x.isVideoTexture!==!0,fe=Re.__version===void 0||J===!0,te=W.dataReady,ye=L(x,ee);if(x.isDepthTexture)Ue=E(x.format===yr,x.type),fe&&(I?t.texStorage2D(n.TEXTURE_2D,1,Ue,ee.width,ee.height):t.texImage2D(n.TEXTURE_2D,0,Ue,ee.width,ee.height,0,_e,Fe,null));else if(x.isDataTexture)if(Ge.length>0){I&&fe&&t.texStorage2D(n.TEXTURE_2D,ye,Ue,Ge[0].width,Ge[0].height);for(let ne=0,K=Ge.length;ne<K;ne++)ce=Ge[ne],I?te&&t.texSubImage2D(n.TEXTURE_2D,ne,0,0,ce.width,ce.height,_e,Fe,ce.data):t.texImage2D(n.TEXTURE_2D,ne,Ue,ce.width,ce.height,0,_e,Fe,ce.data);x.generateMipmaps=!1}else I?(fe&&t.texStorage2D(n.TEXTURE_2D,ye,Ue,ee.width,ee.height),te&&ae(x,ee,_e,Fe)):t.texImage2D(n.TEXTURE_2D,0,Ue,ee.width,ee.height,0,_e,Fe,ee.data);else if(x.isCompressedTexture)if(x.isCompressedArrayTexture){I&&fe&&t.texStorage3D(n.TEXTURE_2D_ARRAY,ye,Ue,Ge[0].width,Ge[0].height,ee.depth);for(let ne=0,K=Ge.length;ne<K;ne++)if(ce=Ge[ne],x.format!==Tn)if(_e!==null)if(I){if(te)if(x.layerUpdates.size>0){const Se=Vd(ce.width,ce.height,x.format,x.type);for(const He of x.layerUpdates){const pt=ce.data.subarray(He*Se/ce.data.BYTES_PER_ELEMENT,(He+1)*Se/ce.data.BYTES_PER_ELEMENT);t.compressedTexSubImage3D(n.TEXTURE_2D_ARRAY,ne,0,0,He,ce.width,ce.height,1,_e,pt)}x.clearLayerUpdates()}else t.compressedTexSubImage3D(n.TEXTURE_2D_ARRAY,ne,0,0,0,ce.width,ce.height,ee.depth,_e,ce.data)}else t.compressedTexImage3D(n.TEXTURE_2D_ARRAY,ne,Ue,ce.width,ce.height,ee.depth,0,ce.data,0,0);else console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()");else I?te&&t.texSubImage3D(n.TEXTURE_2D_ARRAY,ne,0,0,0,ce.width,ce.height,ee.depth,_e,Fe,ce.data):t.texImage3D(n.TEXTURE_2D_ARRAY,ne,Ue,ce.width,ce.height,ee.depth,0,_e,Fe,ce.data)}else{I&&fe&&t.texStorage2D(n.TEXTURE_2D,ye,Ue,Ge[0].width,Ge[0].height);for(let ne=0,K=Ge.length;ne<K;ne++)ce=Ge[ne],x.format!==Tn?_e!==null?I?te&&t.compressedTexSubImage2D(n.TEXTURE_2D,ne,0,0,ce.width,ce.height,_e,ce.data):t.compressedTexImage2D(n.TEXTURE_2D,ne,Ue,ce.width,ce.height,0,ce.data):console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()"):I?te&&t.texSubImage2D(n.TEXTURE_2D,ne,0,0,ce.width,ce.height,_e,Fe,ce.data):t.texImage2D(n.TEXTURE_2D,ne,Ue,ce.width,ce.height,0,_e,Fe,ce.data)}else if(x.isDataArrayTexture)if(I){if(fe&&t.texStorage3D(n.TEXTURE_2D_ARRAY,ye,Ue,ee.width,ee.height,ee.depth),te)if(x.layerUpdates.size>0){const ne=Vd(ee.width,ee.height,x.format,x.type);for(const K of x.layerUpdates){const Se=ee.data.subarray(K*ne/ee.data.BYTES_PER_ELEMENT,(K+1)*ne/ee.data.BYTES_PER_ELEMENT);t.texSubImage3D(n.TEXTURE_2D_ARRAY,0,0,0,K,ee.width,ee.height,1,_e,Fe,Se)}x.clearLayerUpdates()}else t.texSubImage3D(n.TEXTURE_2D_ARRAY,0,0,0,0,ee.width,ee.height,ee.depth,_e,Fe,ee.data)}else t.texImage3D(n.TEXTURE_2D_ARRAY,0,Ue,ee.width,ee.height,ee.depth,0,_e,Fe,ee.data);else if(x.isData3DTexture)I?(fe&&t.texStorage3D(n.TEXTURE_3D,ye,Ue,ee.width,ee.height,ee.depth),te&&t.texSubImage3D(n.TEXTURE_3D,0,0,0,0,ee.width,ee.height,ee.depth,_e,Fe,ee.data)):t.texImage3D(n.TEXTURE_3D,0,Ue,ee.width,ee.height,ee.depth,0,_e,Fe,ee.data);else if(x.isFramebufferTexture){if(fe)if(I)t.texStorage2D(n.TEXTURE_2D,ye,Ue,ee.width,ee.height);else{let ne=ee.width,K=ee.height;for(let Se=0;Se<ye;Se++)t.texImage2D(n.TEXTURE_2D,Se,Ue,ne,K,0,_e,Fe,null),ne>>=1,K>>=1}}else if(Ge.length>0){if(I&&fe){const ne=Et(Ge[0]);t.texStorage2D(n.TEXTURE_2D,ye,Ue,ne.width,ne.height)}for(let ne=0,K=Ge.length;ne<K;ne++)ce=Ge[ne],I?te&&t.texSubImage2D(n.TEXTURE_2D,ne,0,0,_e,Fe,ce):t.texImage2D(n.TEXTURE_2D,ne,Ue,_e,Fe,ce);x.generateMipmaps=!1}else if(I){if(fe){const ne=Et(ee);t.texStorage2D(n.TEXTURE_2D,ye,Ue,ne.width,ne.height)}te&&t.texSubImage2D(n.TEXTURE_2D,0,0,0,_e,Fe,ee)}else t.texImage2D(n.TEXTURE_2D,0,Ue,_e,Fe,ee);m(x)&&f(j),Re.__version=W.version,x.onUpdate&&x.onUpdate(x)}C.__version=x.version}function he(C,x,O){if(x.image.length!==6)return;const j=je(C,x),J=x.source;t.bindTexture(n.TEXTURE_CUBE_MAP,C.__webglTexture,n.TEXTURE0+O);const W=i.get(J);if(J.version!==W.__version||j===!0){t.activeTexture(n.TEXTURE0+O);const Re=it.getPrimaries(it.workingColorSpace),de=x.colorSpace===ui?null:it.getPrimaries(x.colorSpace),be=x.colorSpace===ui||Re===de?n.NONE:n.BROWSER_DEFAULT_WEBGL;n.pixelStorei(n.UNPACK_FLIP_Y_WEBGL,x.flipY),n.pixelStorei(n.UNPACK_PREMULTIPLY_ALPHA_WEBGL,x.premultiplyAlpha),n.pixelStorei(n.UNPACK_ALIGNMENT,x.unpackAlignment),n.pixelStorei(n.UNPACK_COLORSPACE_CONVERSION_WEBGL,be);const Ce=x.isCompressedTexture||x.image[0].isCompressedTexture,ee=x.image[0]&&x.image[0].isDataTexture,_e=[];for(let K=0;K<6;K++)!Ce&&!ee?_e[K]=_(x.image[K],!0,s.maxCubemapSize):_e[K]=ee?x.image[K].image:x.image[K],_e[K]=Ke(x,_e[K]);const Fe=_e[0],Ue=r.convert(x.format,x.colorSpace),ce=r.convert(x.type),Ge=b(x.internalFormat,Ue,ce,x.colorSpace),I=x.isVideoTexture!==!0,fe=W.__version===void 0||j===!0,te=J.dataReady;let ye=L(x,Fe);$e(n.TEXTURE_CUBE_MAP,x);let ne;if(Ce){I&&fe&&t.texStorage2D(n.TEXTURE_CUBE_MAP,ye,Ge,Fe.width,Fe.height);for(let K=0;K<6;K++){ne=_e[K].mipmaps;for(let Se=0;Se<ne.length;Se++){const He=ne[Se];x.format!==Tn?Ue!==null?I?te&&t.compressedTexSubImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+K,Se,0,0,He.width,He.height,Ue,He.data):t.compressedTexImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+K,Se,Ge,He.width,He.height,0,He.data):console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .setTextureCube()"):I?te&&t.texSubImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+K,Se,0,0,He.width,He.height,Ue,ce,He.data):t.texImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+K,Se,Ge,He.width,He.height,0,Ue,ce,He.data)}}}else{if(ne=x.mipmaps,I&&fe){ne.length>0&&ye++;const K=Et(_e[0]);t.texStorage2D(n.TEXTURE_CUBE_MAP,ye,Ge,K.width,K.height)}for(let K=0;K<6;K++)if(ee){I?te&&t.texSubImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+K,0,0,0,_e[K].width,_e[K].height,Ue,ce,_e[K].data):t.texImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+K,0,Ge,_e[K].width,_e[K].height,0,Ue,ce,_e[K].data);for(let Se=0;Se<ne.length;Se++){const pt=ne[Se].image[K].image;I?te&&t.texSubImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+K,Se+1,0,0,pt.width,pt.height,Ue,ce,pt.data):t.texImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+K,Se+1,Ge,pt.width,pt.height,0,Ue,ce,pt.data)}}else{I?te&&t.texSubImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+K,0,0,0,Ue,ce,_e[K]):t.texImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+K,0,Ge,Ue,ce,_e[K]);for(let Se=0;Se<ne.length;Se++){const He=ne[Se];I?te&&t.texSubImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+K,Se+1,0,0,Ue,ce,He.image[K]):t.texImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+K,Se+1,Ge,Ue,ce,He.image[K])}}}m(x)&&f(n.TEXTURE_CUBE_MAP),W.__version=J.version,x.onUpdate&&x.onUpdate(x)}C.__version=x.version}function we(C,x,O,j,J,W){const Re=r.convert(O.format,O.colorSpace),de=r.convert(O.type),be=b(O.internalFormat,Re,de,O.colorSpace),Ce=i.get(x),ee=i.get(O);if(ee.__renderTarget=x,!Ce.__hasExternalTextures){const _e=Math.max(1,x.width>>W),Fe=Math.max(1,x.height>>W);J===n.TEXTURE_3D||J===n.TEXTURE_2D_ARRAY?t.texImage3D(J,W,be,_e,Fe,x.depth,0,Re,de,null):t.texImage2D(J,W,be,_e,Fe,0,Re,de,null)}t.bindFramebuffer(n.FRAMEBUFFER,C),tt(x)?a.framebufferTexture2DMultisampleEXT(n.FRAMEBUFFER,j,J,ee.__webglTexture,0,Ae(x)):(J===n.TEXTURE_2D||J>=n.TEXTURE_CUBE_MAP_POSITIVE_X&&J<=n.TEXTURE_CUBE_MAP_NEGATIVE_Z)&&n.framebufferTexture2D(n.FRAMEBUFFER,j,J,ee.__webglTexture,W),t.bindFramebuffer(n.FRAMEBUFFER,null)}function Qe(C,x,O){if(n.bindRenderbuffer(n.RENDERBUFFER,C),x.depthBuffer){const j=x.depthTexture,J=j&&j.isDepthTexture?j.type:null,W=E(x.stencilBuffer,J),Re=x.stencilBuffer?n.DEPTH_STENCIL_ATTACHMENT:n.DEPTH_ATTACHMENT,de=Ae(x);tt(x)?a.renderbufferStorageMultisampleEXT(n.RENDERBUFFER,de,W,x.width,x.height):O?n.renderbufferStorageMultisample(n.RENDERBUFFER,de,W,x.width,x.height):n.renderbufferStorage(n.RENDERBUFFER,W,x.width,x.height),n.framebufferRenderbuffer(n.FRAMEBUFFER,Re,n.RENDERBUFFER,C)}else{const j=x.textures;for(let J=0;J<j.length;J++){const W=j[J],Re=r.convert(W.format,W.colorSpace),de=r.convert(W.type),be=b(W.internalFormat,Re,de,W.colorSpace),Ce=Ae(x);O&&tt(x)===!1?n.renderbufferStorageMultisample(n.RENDERBUFFER,Ce,be,x.width,x.height):tt(x)?a.renderbufferStorageMultisampleEXT(n.RENDERBUFFER,Ce,be,x.width,x.height):n.renderbufferStorage(n.RENDERBUFFER,be,x.width,x.height)}}n.bindRenderbuffer(n.RENDERBUFFER,null)}function Y(C,x){if(x&&x.isWebGLCubeRenderTarget)throw new Error("Depth Texture with cube render targets is not supported");if(t.bindFramebuffer(n.FRAMEBUFFER,C),!(x.depthTexture&&x.depthTexture.isDepthTexture))throw new Error("renderTarget.depthTexture must be an instance of THREE.DepthTexture");const j=i.get(x.depthTexture);j.__renderTarget=x,(!j.__webglTexture||x.depthTexture.image.width!==x.width||x.depthTexture.image.height!==x.height)&&(x.depthTexture.image.width=x.width,x.depthTexture.image.height=x.height,x.depthTexture.needsUpdate=!0),Z(x.depthTexture,0);const J=j.__webglTexture,W=Ae(x);if(x.depthTexture.format===xr)tt(x)?a.framebufferTexture2DMultisampleEXT(n.FRAMEBUFFER,n.DEPTH_ATTACHMENT,n.TEXTURE_2D,J,0,W):n.framebufferTexture2D(n.FRAMEBUFFER,n.DEPTH_ATTACHMENT,n.TEXTURE_2D,J,0);else if(x.depthTexture.format===yr)tt(x)?a.framebufferTexture2DMultisampleEXT(n.FRAMEBUFFER,n.DEPTH_STENCIL_ATTACHMENT,n.TEXTURE_2D,J,0,W):n.framebufferTexture2D(n.FRAMEBUFFER,n.DEPTH_STENCIL_ATTACHMENT,n.TEXTURE_2D,J,0);else throw new Error("Unknown depthTexture format")}function ge(C){const x=i.get(C),O=C.isWebGLCubeRenderTarget===!0;if(x.__boundDepthTexture!==C.depthTexture){const j=C.depthTexture;if(x.__depthDisposeCallback&&x.__depthDisposeCallback(),j){const J=()=>{delete x.__boundDepthTexture,delete x.__depthDisposeCallback,j.removeEventListener("dispose",J)};j.addEventListener("dispose",J),x.__depthDisposeCallback=J}x.__boundDepthTexture=j}if(C.depthTexture&&!x.__autoAllocateDepthBuffer){if(O)throw new Error("target.depthTexture not supported in Cube render targets");const j=C.texture.mipmaps;j&&j.length>0?Y(x.__webglFramebuffer[0],C):Y(x.__webglFramebuffer,C)}else if(O){x.__webglDepthbuffer=[];for(let j=0;j<6;j++)if(t.bindFramebuffer(n.FRAMEBUFFER,x.__webglFramebuffer[j]),x.__webglDepthbuffer[j]===void 0)x.__webglDepthbuffer[j]=n.createRenderbuffer(),Qe(x.__webglDepthbuffer[j],C,!1);else{const J=C.stencilBuffer?n.DEPTH_STENCIL_ATTACHMENT:n.DEPTH_ATTACHMENT,W=x.__webglDepthbuffer[j];n.bindRenderbuffer(n.RENDERBUFFER,W),n.framebufferRenderbuffer(n.FRAMEBUFFER,J,n.RENDERBUFFER,W)}}else{const j=C.texture.mipmaps;if(j&&j.length>0?t.bindFramebuffer(n.FRAMEBUFFER,x.__webglFramebuffer[0]):t.bindFramebuffer(n.FRAMEBUFFER,x.__webglFramebuffer),x.__webglDepthbuffer===void 0)x.__webglDepthbuffer=n.createRenderbuffer(),Qe(x.__webglDepthbuffer,C,!1);else{const J=C.stencilBuffer?n.DEPTH_STENCIL_ATTACHMENT:n.DEPTH_ATTACHMENT,W=x.__webglDepthbuffer;n.bindRenderbuffer(n.RENDERBUFFER,W),n.framebufferRenderbuffer(n.FRAMEBUFFER,J,n.RENDERBUFFER,W)}}t.bindFramebuffer(n.FRAMEBUFFER,null)}function Xe(C,x,O){const j=i.get(C);x!==void 0&&we(j.__webglFramebuffer,C,C.texture,n.COLOR_ATTACHMENT0,n.TEXTURE_2D,0),O!==void 0&&ge(C)}function Oe(C){const x=C.texture,O=i.get(C),j=i.get(x);C.addEventListener("dispose",A);const J=C.textures,W=C.isWebGLCubeRenderTarget===!0,Re=J.length>1;if(Re||(j.__webglTexture===void 0&&(j.__webglTexture=n.createTexture()),j.__version=x.version,o.memory.textures++),W){O.__webglFramebuffer=[];for(let de=0;de<6;de++)if(x.mipmaps&&x.mipmaps.length>0){O.__webglFramebuffer[de]=[];for(let be=0;be<x.mipmaps.length;be++)O.__webglFramebuffer[de][be]=n.createFramebuffer()}else O.__webglFramebuffer[de]=n.createFramebuffer()}else{if(x.mipmaps&&x.mipmaps.length>0){O.__webglFramebuffer=[];for(let de=0;de<x.mipmaps.length;de++)O.__webglFramebuffer[de]=n.createFramebuffer()}else O.__webglFramebuffer=n.createFramebuffer();if(Re)for(let de=0,be=J.length;de<be;de++){const Ce=i.get(J[de]);Ce.__webglTexture===void 0&&(Ce.__webglTexture=n.createTexture(),o.memory.textures++)}if(C.samples>0&&tt(C)===!1){O.__webglMultisampledFramebuffer=n.createFramebuffer(),O.__webglColorRenderbuffer=[],t.bindFramebuffer(n.FRAMEBUFFER,O.__webglMultisampledFramebuffer);for(let de=0;de<J.length;de++){const be=J[de];O.__webglColorRenderbuffer[de]=n.createRenderbuffer(),n.bindRenderbuffer(n.RENDERBUFFER,O.__webglColorRenderbuffer[de]);const Ce=r.convert(be.format,be.colorSpace),ee=r.convert(be.type),_e=b(be.internalFormat,Ce,ee,be.colorSpace,C.isXRRenderTarget===!0),Fe=Ae(C);n.renderbufferStorageMultisample(n.RENDERBUFFER,Fe,_e,C.width,C.height),n.framebufferRenderbuffer(n.FRAMEBUFFER,n.COLOR_ATTACHMENT0+de,n.RENDERBUFFER,O.__webglColorRenderbuffer[de])}n.bindRenderbuffer(n.RENDERBUFFER,null),C.depthBuffer&&(O.__webglDepthRenderbuffer=n.createRenderbuffer(),Qe(O.__webglDepthRenderbuffer,C,!0)),t.bindFramebuffer(n.FRAMEBUFFER,null)}}if(W){t.bindTexture(n.TEXTURE_CUBE_MAP,j.__webglTexture),$e(n.TEXTURE_CUBE_MAP,x);for(let de=0;de<6;de++)if(x.mipmaps&&x.mipmaps.length>0)for(let be=0;be<x.mipmaps.length;be++)we(O.__webglFramebuffer[de][be],C,x,n.COLOR_ATTACHMENT0,n.TEXTURE_CUBE_MAP_POSITIVE_X+de,be);else we(O.__webglFramebuffer[de],C,x,n.COLOR_ATTACHMENT0,n.TEXTURE_CUBE_MAP_POSITIVE_X+de,0);m(x)&&f(n.TEXTURE_CUBE_MAP),t.unbindTexture()}else if(Re){for(let de=0,be=J.length;de<be;de++){const Ce=J[de],ee=i.get(Ce);t.bindTexture(n.TEXTURE_2D,ee.__webglTexture),$e(n.TEXTURE_2D,Ce),we(O.__webglFramebuffer,C,Ce,n.COLOR_ATTACHMENT0+de,n.TEXTURE_2D,0),m(Ce)&&f(n.TEXTURE_2D)}t.unbindTexture()}else{let de=n.TEXTURE_2D;if((C.isWebGL3DRenderTarget||C.isWebGLArrayRenderTarget)&&(de=C.isWebGL3DRenderTarget?n.TEXTURE_3D:n.TEXTURE_2D_ARRAY),t.bindTexture(de,j.__webglTexture),$e(de,x),x.mipmaps&&x.mipmaps.length>0)for(let be=0;be<x.mipmaps.length;be++)we(O.__webglFramebuffer[be],C,x,n.COLOR_ATTACHMENT0,de,be);else we(O.__webglFramebuffer,C,x,n.COLOR_ATTACHMENT0,de,0);m(x)&&f(de),t.unbindTexture()}C.depthBuffer&&ge(C)}function P(C){const x=C.textures;for(let O=0,j=x.length;O<j;O++){const J=x[O];if(m(J)){const W=M(C),Re=i.get(J).__webglTexture;t.bindTexture(W,Re),f(W),t.unbindTexture()}}}const bt=[],st=[];function ht(C){if(C.samples>0){if(tt(C)===!1){const x=C.textures,O=C.width,j=C.height;let J=n.COLOR_BUFFER_BIT;const W=C.stencilBuffer?n.DEPTH_STENCIL_ATTACHMENT:n.DEPTH_ATTACHMENT,Re=i.get(C),de=x.length>1;if(de)for(let Ce=0;Ce<x.length;Ce++)t.bindFramebuffer(n.FRAMEBUFFER,Re.__webglMultisampledFramebuffer),n.framebufferRenderbuffer(n.FRAMEBUFFER,n.COLOR_ATTACHMENT0+Ce,n.RENDERBUFFER,null),t.bindFramebuffer(n.FRAMEBUFFER,Re.__webglFramebuffer),n.framebufferTexture2D(n.DRAW_FRAMEBUFFER,n.COLOR_ATTACHMENT0+Ce,n.TEXTURE_2D,null,0);t.bindFramebuffer(n.READ_FRAMEBUFFER,Re.__webglMultisampledFramebuffer);const be=C.texture.mipmaps;be&&be.length>0?t.bindFramebuffer(n.DRAW_FRAMEBUFFER,Re.__webglFramebuffer[0]):t.bindFramebuffer(n.DRAW_FRAMEBUFFER,Re.__webglFramebuffer);for(let Ce=0;Ce<x.length;Ce++){if(C.resolveDepthBuffer&&(C.depthBuffer&&(J|=n.DEPTH_BUFFER_BIT),C.stencilBuffer&&C.resolveStencilBuffer&&(J|=n.STENCIL_BUFFER_BIT)),de){n.framebufferRenderbuffer(n.READ_FRAMEBUFFER,n.COLOR_ATTACHMENT0,n.RENDERBUFFER,Re.__webglColorRenderbuffer[Ce]);const ee=i.get(x[Ce]).__webglTexture;n.framebufferTexture2D(n.DRAW_FRAMEBUFFER,n.COLOR_ATTACHMENT0,n.TEXTURE_2D,ee,0)}n.blitFramebuffer(0,0,O,j,0,0,O,j,J,n.NEAREST),l===!0&&(bt.length=0,st.length=0,bt.push(n.COLOR_ATTACHMENT0+Ce),C.depthBuffer&&C.resolveDepthBuffer===!1&&(bt.push(W),st.push(W),n.invalidateFramebuffer(n.DRAW_FRAMEBUFFER,st)),n.invalidateFramebuffer(n.READ_FRAMEBUFFER,bt))}if(t.bindFramebuffer(n.READ_FRAMEBUFFER,null),t.bindFramebuffer(n.DRAW_FRAMEBUFFER,null),de)for(let Ce=0;Ce<x.length;Ce++){t.bindFramebuffer(n.FRAMEBUFFER,Re.__webglMultisampledFramebuffer),n.framebufferRenderbuffer(n.FRAMEBUFFER,n.COLOR_ATTACHMENT0+Ce,n.RENDERBUFFER,Re.__webglColorRenderbuffer[Ce]);const ee=i.get(x[Ce]).__webglTexture;t.bindFramebuffer(n.FRAMEBUFFER,Re.__webglFramebuffer),n.framebufferTexture2D(n.DRAW_FRAMEBUFFER,n.COLOR_ATTACHMENT0+Ce,n.TEXTURE_2D,ee,0)}t.bindFramebuffer(n.DRAW_FRAMEBUFFER,Re.__webglMultisampledFramebuffer)}else if(C.depthBuffer&&C.resolveDepthBuffer===!1&&l){const x=C.stencilBuffer?n.DEPTH_STENCIL_ATTACHMENT:n.DEPTH_ATTACHMENT;n.invalidateFramebuffer(n.DRAW_FRAMEBUFFER,[x])}}}function Ae(C){return Math.min(s.maxSamples,C.samples)}function tt(C){const x=i.get(C);return C.samples>0&&e.has("WEBGL_multisampled_render_to_texture")===!0&&x.__useRenderToTexture!==!1}function De(C){const x=o.render.frame;u.get(C)!==x&&(u.set(C,x),C.update())}function Ke(C,x){const O=C.colorSpace,j=C.format,J=C.type;return C.isCompressedTexture===!0||C.isVideoTexture===!0||O!==Ns&&O!==ui&&(it.getTransfer(O)===ct?(j!==Tn||J!==Nn)&&console.warn("THREE.WebGLTextures: sRGB encoded textures have to use RGBAFormat and UnsignedByteType."):console.error("THREE.WebGLTextures: Unsupported texture color space:",O)),x}function Et(C){return typeof HTMLImageElement<"u"&&C instanceof HTMLImageElement?(c.width=C.naturalWidth||C.width,c.height=C.naturalHeight||C.height):typeof VideoFrame<"u"&&C instanceof VideoFrame?(c.width=C.displayWidth,c.height=C.displayHeight):(c.width=C.width,c.height=C.height),c}this.allocateTextureUnit=k,this.resetTextureUnits=$,this.setTexture2D=Z,this.setTexture2DArray=V,this.setTexture3D=ie,this.setTextureCube=H,this.rebindTextures=Xe,this.setupRenderTarget=Oe,this.updateRenderTargetMipmap=P,this.updateMultisampleRenderTarget=ht,this.setupDepthRenderbuffer=ge,this.setupFrameBufferTexture=we,this.useMultisampledRTT=tt}function OS(n,e){function t(i,s=ui){let r;const o=it.getTransfer(s);if(i===Nn)return n.UNSIGNED_BYTE;if(i===jc)return n.UNSIGNED_SHORT_4_4_4_4;if(i===Kc)return n.UNSIGNED_SHORT_5_5_5_1;if(i===Gf)return n.UNSIGNED_INT_5_9_9_9_REV;if(i===kf)return n.BYTE;if(i===zf)return n.SHORT;if(i===_r)return n.UNSIGNED_SHORT;if(i===qc)return n.INT;if(i===Vi)return n.UNSIGNED_INT;if(i===Pn)return n.FLOAT;if(i===Er)return n.HALF_FLOAT;if(i===Hf)return n.ALPHA;if(i===Vf)return n.RGB;if(i===Tn)return n.RGBA;if(i===xr)return n.DEPTH_COMPONENT;if(i===yr)return n.DEPTH_STENCIL;if(i===Zc)return n.RED;if(i===Jc)return n.RED_INTEGER;if(i===$f)return n.RG;if(i===Qc)return n.RG_INTEGER;if(i===eu)return n.RGBA_INTEGER;if(i===Ro||i===Co||i===Po||i===Lo)if(o===ct)if(r=e.get("WEBGL_compressed_texture_s3tc_srgb"),r!==null){if(i===Ro)return r.COMPRESSED_SRGB_S3TC_DXT1_EXT;if(i===Co)return r.COMPRESSED_SRGB_ALPHA_S3TC_DXT1_EXT;if(i===Po)return r.COMPRESSED_SRGB_ALPHA_S3TC_DXT3_EXT;if(i===Lo)return r.COMPRESSED_SRGB_ALPHA_S3TC_DXT5_EXT}else return null;else if(r=e.get("WEBGL_compressed_texture_s3tc"),r!==null){if(i===Ro)return r.COMPRESSED_RGB_S3TC_DXT1_EXT;if(i===Co)return r.COMPRESSED_RGBA_S3TC_DXT1_EXT;if(i===Po)return r.COMPRESSED_RGBA_S3TC_DXT3_EXT;if(i===Lo)return r.COMPRESSED_RGBA_S3TC_DXT5_EXT}else return null;if(i===Ll||i===Dl||i===Il||i===Ul)if(r=e.get("WEBGL_compressed_texture_pvrtc"),r!==null){if(i===Ll)return r.COMPRESSED_RGB_PVRTC_4BPPV1_IMG;if(i===Dl)return r.COMPRESSED_RGB_PVRTC_2BPPV1_IMG;if(i===Il)return r.COMPRESSED_RGBA_PVRTC_4BPPV1_IMG;if(i===Ul)return r.COMPRESSED_RGBA_PVRTC_2BPPV1_IMG}else return null;if(i===Nl||i===Fl||i===Ol)if(r=e.get("WEBGL_compressed_texture_etc"),r!==null){if(i===Nl||i===Fl)return o===ct?r.COMPRESSED_SRGB8_ETC2:r.COMPRESSED_RGB8_ETC2;if(i===Ol)return o===ct?r.COMPRESSED_SRGB8_ALPHA8_ETC2_EAC:r.COMPRESSED_RGBA8_ETC2_EAC}else return null;if(i===Bl||i===kl||i===zl||i===Gl||i===Hl||i===Vl||i===$l||i===Wl||i===Xl||i===Yl||i===ql||i===jl||i===Kl||i===Zl)if(r=e.get("WEBGL_compressed_texture_astc"),r!==null){if(i===Bl)return o===ct?r.COMPRESSED_SRGB8_ALPHA8_ASTC_4x4_KHR:r.COMPRESSED_RGBA_ASTC_4x4_KHR;if(i===kl)return o===ct?r.COMPRESSED_SRGB8_ALPHA8_ASTC_5x4_KHR:r.COMPRESSED_RGBA_ASTC_5x4_KHR;if(i===zl)return o===ct?r.COMPRESSED_SRGB8_ALPHA8_ASTC_5x5_KHR:r.COMPRESSED_RGBA_ASTC_5x5_KHR;if(i===Gl)return o===ct?r.COMPRESSED_SRGB8_ALPHA8_ASTC_6x5_KHR:r.COMPRESSED_RGBA_ASTC_6x5_KHR;if(i===Hl)return o===ct?r.COMPRESSED_SRGB8_ALPHA8_ASTC_6x6_KHR:r.COMPRESSED_RGBA_ASTC_6x6_KHR;if(i===Vl)return o===ct?r.COMPRESSED_SRGB8_ALPHA8_ASTC_8x5_KHR:r.COMPRESSED_RGBA_ASTC_8x5_KHR;if(i===$l)return o===ct?r.COMPRESSED_SRGB8_ALPHA8_ASTC_8x6_KHR:r.COMPRESSED_RGBA_ASTC_8x6_KHR;if(i===Wl)return o===ct?r.COMPRESSED_SRGB8_ALPHA8_ASTC_8x8_KHR:r.COMPRESSED_RGBA_ASTC_8x8_KHR;if(i===Xl)return o===ct?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x5_KHR:r.COMPRESSED_RGBA_ASTC_10x5_KHR;if(i===Yl)return o===ct?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x6_KHR:r.COMPRESSED_RGBA_ASTC_10x6_KHR;if(i===ql)return o===ct?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x8_KHR:r.COMPRESSED_RGBA_ASTC_10x8_KHR;if(i===jl)return o===ct?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x10_KHR:r.COMPRESSED_RGBA_ASTC_10x10_KHR;if(i===Kl)return o===ct?r.COMPRESSED_SRGB8_ALPHA8_ASTC_12x10_KHR:r.COMPRESSED_RGBA_ASTC_12x10_KHR;if(i===Zl)return o===ct?r.COMPRESSED_SRGB8_ALPHA8_ASTC_12x12_KHR:r.COMPRESSED_RGBA_ASTC_12x12_KHR}else return null;if(i===Do||i===Jl||i===Ql)if(r=e.get("EXT_texture_compression_bptc"),r!==null){if(i===Do)return o===ct?r.COMPRESSED_SRGB_ALPHA_BPTC_UNORM_EXT:r.COMPRESSED_RGBA_BPTC_UNORM_EXT;if(i===Jl)return r.COMPRESSED_RGB_BPTC_SIGNED_FLOAT_EXT;if(i===Ql)return r.COMPRESSED_RGB_BPTC_UNSIGNED_FLOAT_EXT}else return null;if(i===Wf||i===ec||i===tc||i===nc)if(r=e.get("EXT_texture_compression_rgtc"),r!==null){if(i===Do)return r.COMPRESSED_RED_RGTC1_EXT;if(i===ec)return r.COMPRESSED_SIGNED_RED_RGTC1_EXT;if(i===tc)return r.COMPRESSED_RED_GREEN_RGTC2_EXT;if(i===nc)return r.COMPRESSED_SIGNED_RED_GREEN_RGTC2_EXT}else return null;return i===vr?n.UNSIGNED_INT_24_8:n[i]!==void 0?n[i]:null}return{convert:t}}const BS=`
void main() {

	gl_Position = vec4( position, 1.0 );

}`,kS=`
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

}`;class zS{constructor(){this.texture=null,this.mesh=null,this.depthNear=0,this.depthFar=0}init(e,t,i){if(this.texture===null){const s=new $t,r=e.properties.get(s);r.__webglTexture=t.texture,(t.depthNear!==i.depthNear||t.depthFar!==i.depthFar)&&(this.depthNear=t.depthNear,this.depthFar=t.depthFar),this.texture=s}}getMesh(e){if(this.texture!==null&&this.mesh===null){const t=e.cameras[0].viewport,i=new wi({vertexShader:BS,fragmentShader:kS,uniforms:{depthColor:{value:this.texture},depthWidth:{value:t.z},depthHeight:{value:t.w}}});this.mesh=new vn(new oa(20,20),i)}return this.mesh}reset(){this.texture=null,this.mesh=null}getDepthTexture(){return this.texture}}class GS extends qi{constructor(e,t){super();const i=this;let s=null,r=1,o=null,a="local-floor",l=1,c=null,u=null,d=null,h=null,p=null,g=null;const _=new zS,m=t.getContextAttributes();let f=null,M=null;const b=[],E=[],L=new Ve;let T=null;const A=new sn;A.viewport=new yt;const R=new sn;R.viewport=new yt;const S=[A,R],y=new o0;let D=null,$=null;this.cameraAutoUpdate=!0,this.enabled=!1,this.isPresenting=!1,this.getController=function(X){let ae=b[X];return ae===void 0&&(ae=new $a,b[X]=ae),ae.getTargetRaySpace()},this.getControllerGrip=function(X){let ae=b[X];return ae===void 0&&(ae=new $a,b[X]=ae),ae.getGripSpace()},this.getHand=function(X){let ae=b[X];return ae===void 0&&(ae=new $a,b[X]=ae),ae.getHandSpace()};function k(X){const ae=E.indexOf(X.inputSource);if(ae===-1)return;const Ee=b[ae];Ee!==void 0&&(Ee.update(X.inputSource,X.frame,c||o),Ee.dispatchEvent({type:X.type,data:X.inputSource}))}function q(){s.removeEventListener("select",k),s.removeEventListener("selectstart",k),s.removeEventListener("selectend",k),s.removeEventListener("squeeze",k),s.removeEventListener("squeezestart",k),s.removeEventListener("squeezeend",k),s.removeEventListener("end",q),s.removeEventListener("inputsourceschange",Z);for(let X=0;X<b.length;X++){const ae=E[X];ae!==null&&(E[X]=null,b[X].disconnect(ae))}D=null,$=null,_.reset(),e.setRenderTarget(f),p=null,h=null,d=null,s=null,M=null,je.stop(),i.isPresenting=!1,e.setPixelRatio(T),e.setSize(L.width,L.height,!1),i.dispatchEvent({type:"sessionend"})}this.setFramebufferScaleFactor=function(X){r=X,i.isPresenting===!0&&console.warn("THREE.WebXRManager: Cannot change framebuffer scale while presenting.")},this.setReferenceSpaceType=function(X){a=X,i.isPresenting===!0&&console.warn("THREE.WebXRManager: Cannot change reference space type while presenting.")},this.getReferenceSpace=function(){return c||o},this.setReferenceSpace=function(X){c=X},this.getBaseLayer=function(){return h!==null?h:p},this.getBinding=function(){return d},this.getFrame=function(){return g},this.getSession=function(){return s},this.setSession=async function(X){if(s=X,s!==null){if(f=e.getRenderTarget(),s.addEventListener("select",k),s.addEventListener("selectstart",k),s.addEventListener("selectend",k),s.addEventListener("squeeze",k),s.addEventListener("squeezestart",k),s.addEventListener("squeezeend",k),s.addEventListener("end",q),s.addEventListener("inputsourceschange",Z),m.xrCompatible!==!0&&await t.makeXRCompatible(),T=e.getPixelRatio(),e.getSize(L),typeof XRWebGLBinding<"u"&&"createProjectionLayer"in XRWebGLBinding.prototype){let Ee=null,he=null,we=null;m.depth&&(we=m.stencil?t.DEPTH24_STENCIL8:t.DEPTH_COMPONENT24,Ee=m.stencil?yr:xr,he=m.stencil?vr:Vi);const Qe={colorFormat:t.RGBA8,depthFormat:we,scaleFactor:r};d=new XRWebGLBinding(s,t),h=d.createProjectionLayer(Qe),s.updateRenderState({layers:[h]}),e.setPixelRatio(1),e.setSize(h.textureWidth,h.textureHeight,!1),M=new Wi(h.textureWidth,h.textureHeight,{format:Tn,type:Nn,depthTexture:new sp(h.textureWidth,h.textureHeight,he,void 0,void 0,void 0,void 0,void 0,void 0,Ee),stencilBuffer:m.stencil,colorSpace:e.outputColorSpace,samples:m.antialias?4:0,resolveDepthBuffer:h.ignoreDepthValues===!1,resolveStencilBuffer:h.ignoreDepthValues===!1})}else{const Ee={antialias:m.antialias,alpha:!0,depth:m.depth,stencil:m.stencil,framebufferScaleFactor:r};p=new XRWebGLLayer(s,t,Ee),s.updateRenderState({baseLayer:p}),e.setPixelRatio(1),e.setSize(p.framebufferWidth,p.framebufferHeight,!1),M=new Wi(p.framebufferWidth,p.framebufferHeight,{format:Tn,type:Nn,colorSpace:e.outputColorSpace,stencilBuffer:m.stencil,resolveDepthBuffer:p.ignoreDepthValues===!1,resolveStencilBuffer:p.ignoreDepthValues===!1})}M.isXRRenderTarget=!0,this.setFoveation(l),c=null,o=await s.requestReferenceSpace(a),je.setContext(s),je.start(),i.isPresenting=!0,i.dispatchEvent({type:"sessionstart"})}},this.getEnvironmentBlendMode=function(){if(s!==null)return s.environmentBlendMode},this.getDepthTexture=function(){return _.getDepthTexture()};function Z(X){for(let ae=0;ae<X.removed.length;ae++){const Ee=X.removed[ae],he=E.indexOf(Ee);he>=0&&(E[he]=null,b[he].disconnect(Ee))}for(let ae=0;ae<X.added.length;ae++){const Ee=X.added[ae];let he=E.indexOf(Ee);if(he===-1){for(let Qe=0;Qe<b.length;Qe++)if(Qe>=E.length){E.push(Ee),he=Qe;break}else if(E[Qe]===null){E[Qe]=Ee,he=Qe;break}if(he===-1)break}const we=b[he];we&&we.connect(Ee)}}const V=new F,ie=new F;function H(X,ae,Ee){V.setFromMatrixPosition(ae.matrixWorld),ie.setFromMatrixPosition(Ee.matrixWorld);const he=V.distanceTo(ie),we=ae.projectionMatrix.elements,Qe=Ee.projectionMatrix.elements,Y=we[14]/(we[10]-1),ge=we[14]/(we[10]+1),Xe=(we[9]+1)/we[5],Oe=(we[9]-1)/we[5],P=(we[8]-1)/we[0],bt=(Qe[8]+1)/Qe[0],st=Y*P,ht=Y*bt,Ae=he/(-P+bt),tt=Ae*-P;if(ae.matrixWorld.decompose(X.position,X.quaternion,X.scale),X.translateX(tt),X.translateZ(Ae),X.matrixWorld.compose(X.position,X.quaternion,X.scale),X.matrixWorldInverse.copy(X.matrixWorld).invert(),we[10]===-1)X.projectionMatrix.copy(ae.projectionMatrix),X.projectionMatrixInverse.copy(ae.projectionMatrixInverse);else{const De=Y+Ae,Ke=ge+Ae,Et=st-tt,C=ht+(he-tt),x=Xe*ge/Ke*De,O=Oe*ge/Ke*De;X.projectionMatrix.makePerspective(Et,C,x,O,De,Ke),X.projectionMatrixInverse.copy(X.projectionMatrix).invert()}}function oe(X,ae){ae===null?X.matrixWorld.copy(X.matrix):X.matrixWorld.multiplyMatrices(ae.matrixWorld,X.matrix),X.matrixWorldInverse.copy(X.matrixWorld).invert()}this.updateCamera=function(X){if(s===null)return;let ae=X.near,Ee=X.far;_.texture!==null&&(_.depthNear>0&&(ae=_.depthNear),_.depthFar>0&&(Ee=_.depthFar)),y.near=R.near=A.near=ae,y.far=R.far=A.far=Ee,(D!==y.near||$!==y.far)&&(s.updateRenderState({depthNear:y.near,depthFar:y.far}),D=y.near,$=y.far),A.layers.mask=X.layers.mask|2,R.layers.mask=X.layers.mask|4,y.layers.mask=A.layers.mask|R.layers.mask;const he=X.parent,we=y.cameras;oe(y,he);for(let Qe=0;Qe<we.length;Qe++)oe(we[Qe],he);we.length===2?H(y,A,R):y.projectionMatrix.copy(A.projectionMatrix),me(X,y,he)};function me(X,ae,Ee){Ee===null?X.matrix.copy(ae.matrixWorld):(X.matrix.copy(Ee.matrixWorld),X.matrix.invert(),X.matrix.multiply(ae.matrixWorld)),X.matrix.decompose(X.position,X.quaternion,X.scale),X.updateMatrixWorld(!0),X.projectionMatrix.copy(ae.projectionMatrix),X.projectionMatrixInverse.copy(ae.projectionMatrixInverse),X.isPerspectiveCamera&&(X.fov=ic*2*Math.atan(1/X.projectionMatrix.elements[5]),X.zoom=1)}this.getCamera=function(){return y},this.getFoveation=function(){if(!(h===null&&p===null))return l},this.setFoveation=function(X){l=X,h!==null&&(h.fixedFoveation=X),p!==null&&p.fixedFoveation!==void 0&&(p.fixedFoveation=X)},this.hasDepthSensing=function(){return _.texture!==null},this.getDepthSensingMesh=function(){return _.getMesh(y)};let Te=null;function $e(X,ae){if(u=ae.getViewerPose(c||o),g=ae,u!==null){const Ee=u.views;p!==null&&(e.setRenderTargetFramebuffer(M,p.framebuffer),e.setRenderTarget(M));let he=!1;Ee.length!==y.cameras.length&&(y.cameras.length=0,he=!0);for(let Y=0;Y<Ee.length;Y++){const ge=Ee[Y];let Xe=null;if(p!==null)Xe=p.getViewport(ge);else{const P=d.getViewSubImage(h,ge);Xe=P.viewport,Y===0&&(e.setRenderTargetTextures(M,P.colorTexture,P.depthStencilTexture),e.setRenderTarget(M))}let Oe=S[Y];Oe===void 0&&(Oe=new sn,Oe.layers.enable(Y),Oe.viewport=new yt,S[Y]=Oe),Oe.matrix.fromArray(ge.transform.matrix),Oe.matrix.decompose(Oe.position,Oe.quaternion,Oe.scale),Oe.projectionMatrix.fromArray(ge.projectionMatrix),Oe.projectionMatrixInverse.copy(Oe.projectionMatrix).invert(),Oe.viewport.set(Xe.x,Xe.y,Xe.width,Xe.height),Y===0&&(y.matrix.copy(Oe.matrix),y.matrix.decompose(y.position,y.quaternion,y.scale)),he===!0&&y.cameras.push(Oe)}const we=s.enabledFeatures;if(we&&we.includes("depth-sensing")&&s.depthUsage=="gpu-optimized"&&d){const Y=d.getDepthInformation(Ee[0]);Y&&Y.isValid&&Y.texture&&_.init(e,Y,s.renderState)}}for(let Ee=0;Ee<b.length;Ee++){const he=E[Ee],we=b[Ee];he!==null&&we!==void 0&&we.update(he,ae,c||o)}Te&&Te(X,ae),ae.detectedPlanes&&i.dispatchEvent({type:"planesdetected",data:ae}),g=null}const je=new cp;je.setAnimationLoop($e),this.setAnimationLoop=function(X){Te=X},this.dispose=function(){}}}const Di=new Fn,HS=new rt;function VS(n,e){function t(m,f){m.matrixAutoUpdate===!0&&m.updateMatrix(),f.value.copy(m.matrix)}function i(m,f){f.color.getRGB(m.fogColor.value,Qf(n)),f.isFog?(m.fogNear.value=f.near,m.fogFar.value=f.far):f.isFogExp2&&(m.fogDensity.value=f.density)}function s(m,f,M,b,E){f.isMeshBasicMaterial||f.isMeshLambertMaterial?r(m,f):f.isMeshToonMaterial?(r(m,f),d(m,f)):f.isMeshPhongMaterial?(r(m,f),u(m,f)):f.isMeshStandardMaterial?(r(m,f),h(m,f),f.isMeshPhysicalMaterial&&p(m,f,E)):f.isMeshMatcapMaterial?(r(m,f),g(m,f)):f.isMeshDepthMaterial?r(m,f):f.isMeshDistanceMaterial?(r(m,f),_(m,f)):f.isMeshNormalMaterial?r(m,f):f.isLineBasicMaterial?(o(m,f),f.isLineDashedMaterial&&a(m,f)):f.isPointsMaterial?l(m,f,M,b):f.isSpriteMaterial?c(m,f):f.isShadowMaterial?(m.color.value.copy(f.color),m.opacity.value=f.opacity):f.isShaderMaterial&&(f.uniformsNeedUpdate=!1)}function r(m,f){m.opacity.value=f.opacity,f.color&&m.diffuse.value.copy(f.color),f.emissive&&m.emissive.value.copy(f.emissive).multiplyScalar(f.emissiveIntensity),f.map&&(m.map.value=f.map,t(f.map,m.mapTransform)),f.alphaMap&&(m.alphaMap.value=f.alphaMap,t(f.alphaMap,m.alphaMapTransform)),f.bumpMap&&(m.bumpMap.value=f.bumpMap,t(f.bumpMap,m.bumpMapTransform),m.bumpScale.value=f.bumpScale,f.side===Zt&&(m.bumpScale.value*=-1)),f.normalMap&&(m.normalMap.value=f.normalMap,t(f.normalMap,m.normalMapTransform),m.normalScale.value.copy(f.normalScale),f.side===Zt&&m.normalScale.value.negate()),f.displacementMap&&(m.displacementMap.value=f.displacementMap,t(f.displacementMap,m.displacementMapTransform),m.displacementScale.value=f.displacementScale,m.displacementBias.value=f.displacementBias),f.emissiveMap&&(m.emissiveMap.value=f.emissiveMap,t(f.emissiveMap,m.emissiveMapTransform)),f.specularMap&&(m.specularMap.value=f.specularMap,t(f.specularMap,m.specularMapTransform)),f.alphaTest>0&&(m.alphaTest.value=f.alphaTest);const M=e.get(f),b=M.envMap,E=M.envMapRotation;b&&(m.envMap.value=b,Di.copy(E),Di.x*=-1,Di.y*=-1,Di.z*=-1,b.isCubeTexture&&b.isRenderTargetTexture===!1&&(Di.y*=-1,Di.z*=-1),m.envMapRotation.value.setFromMatrix4(HS.makeRotationFromEuler(Di)),m.flipEnvMap.value=b.isCubeTexture&&b.isRenderTargetTexture===!1?-1:1,m.reflectivity.value=f.reflectivity,m.ior.value=f.ior,m.refractionRatio.value=f.refractionRatio),f.lightMap&&(m.lightMap.value=f.lightMap,m.lightMapIntensity.value=f.lightMapIntensity,t(f.lightMap,m.lightMapTransform)),f.aoMap&&(m.aoMap.value=f.aoMap,m.aoMapIntensity.value=f.aoMapIntensity,t(f.aoMap,m.aoMapTransform))}function o(m,f){m.diffuse.value.copy(f.color),m.opacity.value=f.opacity,f.map&&(m.map.value=f.map,t(f.map,m.mapTransform))}function a(m,f){m.dashSize.value=f.dashSize,m.totalSize.value=f.dashSize+f.gapSize,m.scale.value=f.scale}function l(m,f,M,b){m.diffuse.value.copy(f.color),m.opacity.value=f.opacity,m.size.value=f.size*M,m.scale.value=b*.5,f.map&&(m.map.value=f.map,t(f.map,m.uvTransform)),f.alphaMap&&(m.alphaMap.value=f.alphaMap,t(f.alphaMap,m.alphaMapTransform)),f.alphaTest>0&&(m.alphaTest.value=f.alphaTest)}function c(m,f){m.diffuse.value.copy(f.color),m.opacity.value=f.opacity,m.rotation.value=f.rotation,f.map&&(m.map.value=f.map,t(f.map,m.mapTransform)),f.alphaMap&&(m.alphaMap.value=f.alphaMap,t(f.alphaMap,m.alphaMapTransform)),f.alphaTest>0&&(m.alphaTest.value=f.alphaTest)}function u(m,f){m.specular.value.copy(f.specular),m.shininess.value=Math.max(f.shininess,1e-4)}function d(m,f){f.gradientMap&&(m.gradientMap.value=f.gradientMap)}function h(m,f){m.metalness.value=f.metalness,f.metalnessMap&&(m.metalnessMap.value=f.metalnessMap,t(f.metalnessMap,m.metalnessMapTransform)),m.roughness.value=f.roughness,f.roughnessMap&&(m.roughnessMap.value=f.roughnessMap,t(f.roughnessMap,m.roughnessMapTransform)),f.envMap&&(m.envMapIntensity.value=f.envMapIntensity)}function p(m,f,M){m.ior.value=f.ior,f.sheen>0&&(m.sheenColor.value.copy(f.sheenColor).multiplyScalar(f.sheen),m.sheenRoughness.value=f.sheenRoughness,f.sheenColorMap&&(m.sheenColorMap.value=f.sheenColorMap,t(f.sheenColorMap,m.sheenColorMapTransform)),f.sheenRoughnessMap&&(m.sheenRoughnessMap.value=f.sheenRoughnessMap,t(f.sheenRoughnessMap,m.sheenRoughnessMapTransform))),f.clearcoat>0&&(m.clearcoat.value=f.clearcoat,m.clearcoatRoughness.value=f.clearcoatRoughness,f.clearcoatMap&&(m.clearcoatMap.value=f.clearcoatMap,t(f.clearcoatMap,m.clearcoatMapTransform)),f.clearcoatRoughnessMap&&(m.clearcoatRoughnessMap.value=f.clearcoatRoughnessMap,t(f.clearcoatRoughnessMap,m.clearcoatRoughnessMapTransform)),f.clearcoatNormalMap&&(m.clearcoatNormalMap.value=f.clearcoatNormalMap,t(f.clearcoatNormalMap,m.clearcoatNormalMapTransform),m.clearcoatNormalScale.value.copy(f.clearcoatNormalScale),f.side===Zt&&m.clearcoatNormalScale.value.negate())),f.dispersion>0&&(m.dispersion.value=f.dispersion),f.iridescence>0&&(m.iridescence.value=f.iridescence,m.iridescenceIOR.value=f.iridescenceIOR,m.iridescenceThicknessMinimum.value=f.iridescenceThicknessRange[0],m.iridescenceThicknessMaximum.value=f.iridescenceThicknessRange[1],f.iridescenceMap&&(m.iridescenceMap.value=f.iridescenceMap,t(f.iridescenceMap,m.iridescenceMapTransform)),f.iridescenceThicknessMap&&(m.iridescenceThicknessMap.value=f.iridescenceThicknessMap,t(f.iridescenceThicknessMap,m.iridescenceThicknessMapTransform))),f.transmission>0&&(m.transmission.value=f.transmission,m.transmissionSamplerMap.value=M.texture,m.transmissionSamplerSize.value.set(M.width,M.height),f.transmissionMap&&(m.transmissionMap.value=f.transmissionMap,t(f.transmissionMap,m.transmissionMapTransform)),m.thickness.value=f.thickness,f.thicknessMap&&(m.thicknessMap.value=f.thicknessMap,t(f.thicknessMap,m.thicknessMapTransform)),m.attenuationDistance.value=f.attenuationDistance,m.attenuationColor.value.copy(f.attenuationColor)),f.anisotropy>0&&(m.anisotropyVector.value.set(f.anisotropy*Math.cos(f.anisotropyRotation),f.anisotropy*Math.sin(f.anisotropyRotation)),f.anisotropyMap&&(m.anisotropyMap.value=f.anisotropyMap,t(f.anisotropyMap,m.anisotropyMapTransform))),m.specularIntensity.value=f.specularIntensity,m.specularColor.value.copy(f.specularColor),f.specularColorMap&&(m.specularColorMap.value=f.specularColorMap,t(f.specularColorMap,m.specularColorMapTransform)),f.specularIntensityMap&&(m.specularIntensityMap.value=f.specularIntensityMap,t(f.specularIntensityMap,m.specularIntensityMapTransform))}function g(m,f){f.matcap&&(m.matcap.value=f.matcap)}function _(m,f){const M=e.get(f).light;m.referencePosition.value.setFromMatrixPosition(M.matrixWorld),m.nearDistance.value=M.shadow.camera.near,m.farDistance.value=M.shadow.camera.far}return{refreshFogUniforms:i,refreshMaterialUniforms:s}}function $S(n,e,t,i){let s={},r={},o=[];const a=n.getParameter(n.MAX_UNIFORM_BUFFER_BINDINGS);function l(M,b){const E=b.program;i.uniformBlockBinding(M,E)}function c(M,b){let E=s[M.id];E===void 0&&(g(M),E=u(M),s[M.id]=E,M.addEventListener("dispose",m));const L=b.program;i.updateUBOMapping(M,L);const T=e.render.frame;r[M.id]!==T&&(h(M),r[M.id]=T)}function u(M){const b=d();M.__bindingPointIndex=b;const E=n.createBuffer(),L=M.__size,T=M.usage;return n.bindBuffer(n.UNIFORM_BUFFER,E),n.bufferData(n.UNIFORM_BUFFER,L,T),n.bindBuffer(n.UNIFORM_BUFFER,null),n.bindBufferBase(n.UNIFORM_BUFFER,b,E),E}function d(){for(let M=0;M<a;M++)if(o.indexOf(M)===-1)return o.push(M),M;return console.error("THREE.WebGLRenderer: Maximum number of simultaneously usable uniforms groups reached."),0}function h(M){const b=s[M.id],E=M.uniforms,L=M.__cache;n.bindBuffer(n.UNIFORM_BUFFER,b);for(let T=0,A=E.length;T<A;T++){const R=Array.isArray(E[T])?E[T]:[E[T]];for(let S=0,y=R.length;S<y;S++){const D=R[S];if(p(D,T,S,L)===!0){const $=D.__offset,k=Array.isArray(D.value)?D.value:[D.value];let q=0;for(let Z=0;Z<k.length;Z++){const V=k[Z],ie=_(V);typeof V=="number"||typeof V=="boolean"?(D.__data[0]=V,n.bufferSubData(n.UNIFORM_BUFFER,$+q,D.__data)):V.isMatrix3?(D.__data[0]=V.elements[0],D.__data[1]=V.elements[1],D.__data[2]=V.elements[2],D.__data[3]=0,D.__data[4]=V.elements[3],D.__data[5]=V.elements[4],D.__data[6]=V.elements[5],D.__data[7]=0,D.__data[8]=V.elements[6],D.__data[9]=V.elements[7],D.__data[10]=V.elements[8],D.__data[11]=0):(V.toArray(D.__data,q),q+=ie.storage/Float32Array.BYTES_PER_ELEMENT)}n.bufferSubData(n.UNIFORM_BUFFER,$,D.__data)}}}n.bindBuffer(n.UNIFORM_BUFFER,null)}function p(M,b,E,L){const T=M.value,A=b+"_"+E;if(L[A]===void 0)return typeof T=="number"||typeof T=="boolean"?L[A]=T:L[A]=T.clone(),!0;{const R=L[A];if(typeof T=="number"||typeof T=="boolean"){if(R!==T)return L[A]=T,!0}else if(R.equals(T)===!1)return R.copy(T),!0}return!1}function g(M){const b=M.uniforms;let E=0;const L=16;for(let A=0,R=b.length;A<R;A++){const S=Array.isArray(b[A])?b[A]:[b[A]];for(let y=0,D=S.length;y<D;y++){const $=S[y],k=Array.isArray($.value)?$.value:[$.value];for(let q=0,Z=k.length;q<Z;q++){const V=k[q],ie=_(V),H=E%L,oe=H%ie.boundary,me=H+oe;E+=oe,me!==0&&L-me<ie.storage&&(E+=L-me),$.__data=new Float32Array(ie.storage/Float32Array.BYTES_PER_ELEMENT),$.__offset=E,E+=ie.storage}}}const T=E%L;return T>0&&(E+=L-T),M.__size=E,M.__cache={},this}function _(M){const b={boundary:0,storage:0};return typeof M=="number"||typeof M=="boolean"?(b.boundary=4,b.storage=4):M.isVector2?(b.boundary=8,b.storage=8):M.isVector3||M.isColor?(b.boundary=16,b.storage=12):M.isVector4?(b.boundary=16,b.storage=16):M.isMatrix3?(b.boundary=48,b.storage=48):M.isMatrix4?(b.boundary=64,b.storage=64):M.isTexture?console.warn("THREE.WebGLRenderer: Texture samplers can not be part of an uniforms group."):console.warn("THREE.WebGLRenderer: Unsupported uniform value type.",M),b}function m(M){const b=M.target;b.removeEventListener("dispose",m);const E=o.indexOf(b.__bindingPointIndex);o.splice(E,1),n.deleteBuffer(s[b.id]),delete s[b.id],delete r[b.id]}function f(){for(const M in s)n.deleteBuffer(s[M]);o=[],s={},r={}}return{bind:l,update:c,dispose:f}}class WS{constructor(e={}){const{canvas:t=S_(),context:i=null,depth:s=!0,stencil:r=!1,alpha:o=!1,antialias:a=!1,premultipliedAlpha:l=!0,preserveDrawingBuffer:c=!1,powerPreference:u="default",failIfMajorPerformanceCaveat:d=!1,reverseDepthBuffer:h=!1}=e;this.isWebGLRenderer=!0;let p;if(i!==null){if(typeof WebGLRenderingContext<"u"&&i instanceof WebGLRenderingContext)throw new Error("THREE.WebGLRenderer: WebGL 1 is not supported since r163.");p=i.getContextAttributes().alpha}else p=o;const g=new Uint32Array(4),_=new Int32Array(4);let m=null,f=null;const M=[],b=[];this.domElement=t,this.debug={checkShaderErrors:!0,onShaderError:null},this.autoClear=!0,this.autoClearColor=!0,this.autoClearDepth=!0,this.autoClearStencil=!0,this.sortObjects=!0,this.clippingPlanes=[],this.localClippingEnabled=!1,this.toneMapping=xi,this.toneMappingExposure=1,this.transmissionResolutionScale=1;const E=this;let L=!1;this._outputColorSpace=mn;let T=0,A=0,R=null,S=-1,y=null;const D=new yt,$=new yt;let k=null;const q=new Pe(0);let Z=0,V=t.width,ie=t.height,H=1,oe=null,me=null;const Te=new yt(0,0,V,ie),$e=new yt(0,0,V,ie);let je=!1;const X=new iu;let ae=!1,Ee=!1;const he=new rt,we=new rt,Qe=new F,Y=new yt,ge={background:null,fog:null,environment:null,overrideMaterial:null,isScene:!0};let Xe=!1;function Oe(){return R===null?H:1}let P=i;function bt(w,U){return t.getContext(w,U)}try{const w={alpha:!0,depth:s,stencil:r,antialias:a,premultipliedAlpha:l,preserveDrawingBuffer:c,powerPreference:u,failIfMajorPerformanceCaveat:d};if("setAttribute"in t&&t.setAttribute("data-engine",`three.js r${Xc}`),t.addEventListener("webglcontextlost",ye,!1),t.addEventListener("webglcontextrestored",ne,!1),t.addEventListener("webglcontextcreationerror",K,!1),P===null){const U="webgl2";if(P=bt(U,w),P===null)throw bt(U)?new Error("Error creating WebGL context with your selected attributes."):new Error("Error creating WebGL context.")}}catch(w){throw console.error("THREE.WebGLRenderer: "+w.message),w}let st,ht,Ae,tt,De,Ke,Et,C,x,O,j,J,W,Re,de,be,Ce,ee,_e,Fe,Ue,ce,Ge,I;function fe(){st=new ty(P),st.init(),ce=new OS(P,st),ht=new qx(P,st,e,ce),Ae=new NS(P,st),ht.reverseDepthBuffer&&h&&Ae.buffers.depth.setReversed(!0),tt=new sy(P),De=new MS,Ke=new FS(P,st,Ae,De,ht,ce,tt),Et=new Kx(E),C=new ey(E),x=new u0(P),Ge=new Xx(P,x),O=new ny(P,x,tt,Ge),j=new oy(P,O,x,tt),_e=new ry(P,ht,Ke),be=new jx(De),J=new SS(E,Et,C,st,ht,Ge,be),W=new VS(E,De),Re=new bS,de=new PS(st),ee=new Wx(E,Et,C,Ae,j,p,l),Ce=new IS(E,j,ht),I=new $S(P,tt,ht,Ae),Fe=new Yx(P,st,tt),Ue=new iy(P,st,tt),tt.programs=J.programs,E.capabilities=ht,E.extensions=st,E.properties=De,E.renderLists=Re,E.shadowMap=Ce,E.state=Ae,E.info=tt}fe();const te=new GS(E,P);this.xr=te,this.getContext=function(){return P},this.getContextAttributes=function(){return P.getContextAttributes()},this.forceContextLoss=function(){const w=st.get("WEBGL_lose_context");w&&w.loseContext()},this.forceContextRestore=function(){const w=st.get("WEBGL_lose_context");w&&w.restoreContext()},this.getPixelRatio=function(){return H},this.setPixelRatio=function(w){w!==void 0&&(H=w,this.setSize(V,ie,!1))},this.getSize=function(w){return w.set(V,ie)},this.setSize=function(w,U,z=!0){if(te.isPresenting){console.warn("THREE.WebGLRenderer: Can't change size while VR device is presenting.");return}V=w,ie=U,t.width=Math.floor(w*H),t.height=Math.floor(U*H),z===!0&&(t.style.width=w+"px",t.style.height=U+"px"),this.setViewport(0,0,w,U)},this.getDrawingBufferSize=function(w){return w.set(V*H,ie*H).floor()},this.setDrawingBufferSize=function(w,U,z){V=w,ie=U,H=z,t.width=Math.floor(w*z),t.height=Math.floor(U*z),this.setViewport(0,0,w,U)},this.getCurrentViewport=function(w){return w.copy(D)},this.getViewport=function(w){return w.copy(Te)},this.setViewport=function(w,U,z,G){w.isVector4?Te.set(w.x,w.y,w.z,w.w):Te.set(w,U,z,G),Ae.viewport(D.copy(Te).multiplyScalar(H).round())},this.getScissor=function(w){return w.copy($e)},this.setScissor=function(w,U,z,G){w.isVector4?$e.set(w.x,w.y,w.z,w.w):$e.set(w,U,z,G),Ae.scissor($.copy($e).multiplyScalar(H).round())},this.getScissorTest=function(){return je},this.setScissorTest=function(w){Ae.setScissorTest(je=w)},this.setOpaqueSort=function(w){oe=w},this.setTransparentSort=function(w){me=w},this.getClearColor=function(w){return w.copy(ee.getClearColor())},this.setClearColor=function(){ee.setClearColor(...arguments)},this.getClearAlpha=function(){return ee.getClearAlpha()},this.setClearAlpha=function(){ee.setClearAlpha(...arguments)},this.clear=function(w=!0,U=!0,z=!0){let G=0;if(w){let N=!1;if(R!==null){const se=R.texture.format;N=se===eu||se===Qc||se===Jc}if(N){const se=R.texture.type,pe=se===Nn||se===Vi||se===_r||se===vr||se===jc||se===Kc,Me=ee.getClearColor(),ve=ee.getClearAlpha(),Be=Me.r,ze=Me.g,Le=Me.b;pe?(g[0]=Be,g[1]=ze,g[2]=Le,g[3]=ve,P.clearBufferuiv(P.COLOR,0,g)):(_[0]=Be,_[1]=ze,_[2]=Le,_[3]=ve,P.clearBufferiv(P.COLOR,0,_))}else G|=P.COLOR_BUFFER_BIT}U&&(G|=P.DEPTH_BUFFER_BIT),z&&(G|=P.STENCIL_BUFFER_BIT,this.state.buffers.stencil.setMask(4294967295)),P.clear(G)},this.clearColor=function(){this.clear(!0,!1,!1)},this.clearDepth=function(){this.clear(!1,!0,!1)},this.clearStencil=function(){this.clear(!1,!1,!0)},this.dispose=function(){t.removeEventListener("webglcontextlost",ye,!1),t.removeEventListener("webglcontextrestored",ne,!1),t.removeEventListener("webglcontextcreationerror",K,!1),ee.dispose(),Re.dispose(),de.dispose(),De.dispose(),Et.dispose(),C.dispose(),j.dispose(),Ge.dispose(),I.dispose(),J.dispose(),te.dispose(),te.removeEventListener("sessionstart",Bu),te.removeEventListener("sessionend",ku),Ei.stop()};function ye(w){w.preventDefault(),console.log("THREE.WebGLRenderer: Context Lost."),L=!0}function ne(){console.log("THREE.WebGLRenderer: Context Restored."),L=!1;const w=tt.autoReset,U=Ce.enabled,z=Ce.autoUpdate,G=Ce.needsUpdate,N=Ce.type;fe(),tt.autoReset=w,Ce.enabled=U,Ce.autoUpdate=z,Ce.needsUpdate=G,Ce.type=N}function K(w){console.error("THREE.WebGLRenderer: A WebGL context could not be created. Reason: ",w.statusMessage)}function Se(w){const U=w.target;U.removeEventListener("dispose",Se),He(U)}function He(w){pt(w),De.remove(w)}function pt(w){const U=De.get(w).programs;U!==void 0&&(U.forEach(function(z){J.releaseProgram(z)}),w.isShaderMaterial&&J.releaseShaderCache(w))}this.renderBufferDirect=function(w,U,z,G,N,se){U===null&&(U=ge);const pe=N.isMesh&&N.matrixWorld.determinant()<0,Me=ym(w,U,z,G,N);Ae.setMaterial(G,pe);let ve=z.index,Be=1;if(G.wireframe===!0){if(ve=O.getWireframeAttribute(z),ve===void 0)return;Be=2}const ze=z.drawRange,Le=z.attributes.position;let et=ze.start*Be,lt=(ze.start+ze.count)*Be;se!==null&&(et=Math.max(et,se.start*Be),lt=Math.min(lt,(se.start+se.count)*Be)),ve!==null?(et=Math.max(et,0),lt=Math.min(lt,ve.count)):Le!=null&&(et=Math.max(et,0),lt=Math.min(lt,Le.count));const vt=lt-et;if(vt<0||vt===1/0)return;Ge.setup(N,G,Me,z,ve);let mt,dt=Fe;if(ve!==null&&(mt=x.get(ve),dt=Ue,dt.setIndex(mt)),N.isMesh)G.wireframe===!0?(Ae.setLineWidth(G.wireframeLinewidth*Oe()),dt.setMode(P.LINES)):dt.setMode(P.TRIANGLES);else if(N.isLine){let Ie=G.linewidth;Ie===void 0&&(Ie=1),Ae.setLineWidth(Ie*Oe()),N.isLineSegments?dt.setMode(P.LINES):N.isLineLoop?dt.setMode(P.LINE_LOOP):dt.setMode(P.LINE_STRIP)}else N.isPoints?dt.setMode(P.POINTS):N.isSprite&&dt.setMode(P.TRIANGLES);if(N.isBatchedMesh)if(N._multiDrawInstances!==null)Ts("THREE.WebGLRenderer: renderMultiDrawInstances has been deprecated and will be removed in r184. Append to renderMultiDraw arguments and use indirection."),dt.renderMultiDrawInstances(N._multiDrawStarts,N._multiDrawCounts,N._multiDrawCount,N._multiDrawInstances);else if(st.get("WEBGL_multi_draw"))dt.renderMultiDraw(N._multiDrawStarts,N._multiDrawCounts,N._multiDrawCount);else{const Ie=N._multiDrawStarts,_t=N._multiDrawCounts,nt=N._multiDrawCount,Qt=ve?x.get(ve).bytesPerElement:1,es=De.get(G).currentProgram.getUniforms();for(let en=0;en<nt;en++)es.setValue(P,"_gl_DrawID",en),dt.render(Ie[en]/Qt,_t[en])}else if(N.isInstancedMesh)dt.renderInstances(et,vt,N.count);else if(z.isInstancedBufferGeometry){const Ie=z._maxInstanceCount!==void 0?z._maxInstanceCount:1/0,_t=Math.min(z.instanceCount,Ie);dt.renderInstances(et,vt,_t)}else dt.render(et,vt)};function ot(w,U,z){w.transparent===!0&&w.side===Xn&&w.forceSinglePass===!1?(w.side=Zt,w.needsUpdate=!0,Fr(w,U,z),w.side=Mi,w.needsUpdate=!0,Fr(w,U,z),w.side=Xn):Fr(w,U,z)}this.compile=function(w,U,z=null){z===null&&(z=w),f=de.get(z),f.init(U),b.push(f),z.traverseVisible(function(N){N.isLight&&N.layers.test(U.layers)&&(f.pushLight(N),N.castShadow&&f.pushShadow(N))}),w!==z&&w.traverseVisible(function(N){N.isLight&&N.layers.test(U.layers)&&(f.pushLight(N),N.castShadow&&f.pushShadow(N))}),f.setupLights();const G=new Set;return w.traverse(function(N){if(!(N.isMesh||N.isPoints||N.isLine||N.isSprite))return;const se=N.material;if(se)if(Array.isArray(se))for(let pe=0;pe<se.length;pe++){const Me=se[pe];ot(Me,z,N),G.add(Me)}else ot(se,z,N),G.add(se)}),f=b.pop(),G},this.compileAsync=function(w,U,z=null){const G=this.compile(w,U,z);return new Promise(N=>{function se(){if(G.forEach(function(pe){De.get(pe).currentProgram.isReady()&&G.delete(pe)}),G.size===0){N(w);return}setTimeout(se,10)}st.get("KHR_parallel_shader_compile")!==null?se():setTimeout(se,10)})};let Mn=null;function On(w){Mn&&Mn(w)}function Bu(){Ei.stop()}function ku(){Ei.start()}const Ei=new cp;Ei.setAnimationLoop(On),typeof self<"u"&&Ei.setContext(self),this.setAnimationLoop=function(w){Mn=w,te.setAnimationLoop(w),w===null?Ei.stop():Ei.start()},te.addEventListener("sessionstart",Bu),te.addEventListener("sessionend",ku),this.render=function(w,U){if(U!==void 0&&U.isCamera!==!0){console.error("THREE.WebGLRenderer.render: camera is not an instance of THREE.Camera.");return}if(L===!0)return;if(w.matrixWorldAutoUpdate===!0&&w.updateMatrixWorld(),U.parent===null&&U.matrixWorldAutoUpdate===!0&&U.updateMatrixWorld(),te.enabled===!0&&te.isPresenting===!0&&(te.cameraAutoUpdate===!0&&te.updateCamera(U),U=te.getCamera()),w.isScene===!0&&w.onBeforeRender(E,w,U,R),f=de.get(w,b.length),f.init(U),b.push(f),we.multiplyMatrices(U.projectionMatrix,U.matrixWorldInverse),X.setFromProjectionMatrix(we),Ee=this.localClippingEnabled,ae=be.init(this.clippingPlanes,Ee),m=Re.get(w,M.length),m.init(),M.push(m),te.enabled===!0&&te.isPresenting===!0){const se=E.xr.getDepthSensingMesh();se!==null&&xa(se,U,-1/0,E.sortObjects)}xa(w,U,0,E.sortObjects),m.finish(),E.sortObjects===!0&&m.sort(oe,me),Xe=te.enabled===!1||te.isPresenting===!1||te.hasDepthSensing()===!1,Xe&&ee.addToRenderList(m,w),this.info.render.frame++,ae===!0&&be.beginShadows();const z=f.state.shadowsArray;Ce.render(z,w,U),ae===!0&&be.endShadows(),this.info.autoReset===!0&&this.info.reset();const G=m.opaque,N=m.transmissive;if(f.setupLights(),U.isArrayCamera){const se=U.cameras;if(N.length>0)for(let pe=0,Me=se.length;pe<Me;pe++){const ve=se[pe];Gu(G,N,w,ve)}Xe&&ee.render(w);for(let pe=0,Me=se.length;pe<Me;pe++){const ve=se[pe];zu(m,w,ve,ve.viewport)}}else N.length>0&&Gu(G,N,w,U),Xe&&ee.render(w),zu(m,w,U);R!==null&&A===0&&(Ke.updateMultisampleRenderTarget(R),Ke.updateRenderTargetMipmap(R)),w.isScene===!0&&w.onAfterRender(E,w,U),Ge.resetDefaultState(),S=-1,y=null,b.pop(),b.length>0?(f=b[b.length-1],ae===!0&&be.setGlobalState(E.clippingPlanes,f.state.camera)):f=null,M.pop(),M.length>0?m=M[M.length-1]:m=null};function xa(w,U,z,G){if(w.visible===!1)return;if(w.layers.test(U.layers)){if(w.isGroup)z=w.renderOrder;else if(w.isLOD)w.autoUpdate===!0&&w.update(U);else if(w.isLight)f.pushLight(w),w.castShadow&&f.pushShadow(w);else if(w.isSprite){if(!w.frustumCulled||X.intersectsSprite(w)){G&&Y.setFromMatrixPosition(w.matrixWorld).applyMatrix4(we);const pe=j.update(w),Me=w.material;Me.visible&&m.push(w,pe,Me,z,Y.z,null)}}else if((w.isMesh||w.isLine||w.isPoints)&&(!w.frustumCulled||X.intersectsObject(w))){const pe=j.update(w),Me=w.material;if(G&&(w.boundingSphere!==void 0?(w.boundingSphere===null&&w.computeBoundingSphere(),Y.copy(w.boundingSphere.center)):(pe.boundingSphere===null&&pe.computeBoundingSphere(),Y.copy(pe.boundingSphere.center)),Y.applyMatrix4(w.matrixWorld).applyMatrix4(we)),Array.isArray(Me)){const ve=pe.groups;for(let Be=0,ze=ve.length;Be<ze;Be++){const Le=ve[Be],et=Me[Le.materialIndex];et&&et.visible&&m.push(w,pe,et,z,Y.z,Le)}}else Me.visible&&m.push(w,pe,Me,z,Y.z,null)}}const se=w.children;for(let pe=0,Me=se.length;pe<Me;pe++)xa(se[pe],U,z,G)}function zu(w,U,z,G){const N=w.opaque,se=w.transmissive,pe=w.transparent;f.setupLightsView(z),ae===!0&&be.setGlobalState(E.clippingPlanes,z),G&&Ae.viewport(D.copy(G)),N.length>0&&Nr(N,U,z),se.length>0&&Nr(se,U,z),pe.length>0&&Nr(pe,U,z),Ae.buffers.depth.setTest(!0),Ae.buffers.depth.setMask(!0),Ae.buffers.color.setMask(!0),Ae.setPolygonOffset(!1)}function Gu(w,U,z,G){if((z.isScene===!0?z.overrideMaterial:null)!==null)return;f.state.transmissionRenderTarget[G.id]===void 0&&(f.state.transmissionRenderTarget[G.id]=new Wi(1,1,{generateMipmaps:!0,type:st.has("EXT_color_buffer_half_float")||st.has("EXT_color_buffer_float")?Er:Nn,minFilter:Bi,samples:4,stencilBuffer:r,resolveDepthBuffer:!1,resolveStencilBuffer:!1,colorSpace:it.workingColorSpace}));const se=f.state.transmissionRenderTarget[G.id],pe=G.viewport||D;se.setSize(pe.z*E.transmissionResolutionScale,pe.w*E.transmissionResolutionScale);const Me=E.getRenderTarget(),ve=E.getActiveCubeFace(),Be=E.getActiveMipmapLevel();E.setRenderTarget(se),E.getClearColor(q),Z=E.getClearAlpha(),Z<1&&E.setClearColor(16777215,.5),E.clear(),Xe&&ee.render(z);const ze=E.toneMapping;E.toneMapping=xi;const Le=G.viewport;if(G.viewport!==void 0&&(G.viewport=void 0),f.setupLightsView(G),ae===!0&&be.setGlobalState(E.clippingPlanes,G),Nr(w,z,G),Ke.updateMultisampleRenderTarget(se),Ke.updateRenderTargetMipmap(se),st.has("WEBGL_multisampled_render_to_texture")===!1){let et=!1;for(let lt=0,vt=U.length;lt<vt;lt++){const mt=U[lt],dt=mt.object,Ie=mt.geometry,_t=mt.material,nt=mt.group;if(_t.side===Xn&&dt.layers.test(G.layers)){const Qt=_t.side;_t.side=Zt,_t.needsUpdate=!0,Hu(dt,z,G,Ie,_t,nt),_t.side=Qt,_t.needsUpdate=!0,et=!0}}et===!0&&(Ke.updateMultisampleRenderTarget(se),Ke.updateRenderTargetMipmap(se))}E.setRenderTarget(Me,ve,Be),E.setClearColor(q,Z),Le!==void 0&&(G.viewport=Le),E.toneMapping=ze}function Nr(w,U,z){const G=U.isScene===!0?U.overrideMaterial:null;for(let N=0,se=w.length;N<se;N++){const pe=w[N],Me=pe.object,ve=pe.geometry,Be=pe.group;let ze=pe.material;ze.allowOverride===!0&&G!==null&&(ze=G),Me.layers.test(z.layers)&&Hu(Me,U,z,ve,ze,Be)}}function Hu(w,U,z,G,N,se){w.onBeforeRender(E,U,z,G,N,se),w.modelViewMatrix.multiplyMatrices(z.matrixWorldInverse,w.matrixWorld),w.normalMatrix.getNormalMatrix(w.modelViewMatrix),N.onBeforeRender(E,U,z,G,w,se),N.transparent===!0&&N.side===Xn&&N.forceSinglePass===!1?(N.side=Zt,N.needsUpdate=!0,E.renderBufferDirect(z,U,G,N,w,se),N.side=Mi,N.needsUpdate=!0,E.renderBufferDirect(z,U,G,N,w,se),N.side=Xn):E.renderBufferDirect(z,U,G,N,w,se),w.onAfterRender(E,U,z,G,N,se)}function Fr(w,U,z){U.isScene!==!0&&(U=ge);const G=De.get(w),N=f.state.lights,se=f.state.shadowsArray,pe=N.state.version,Me=J.getParameters(w,N.state,se,U,z),ve=J.getProgramCacheKey(Me);let Be=G.programs;G.environment=w.isMeshStandardMaterial?U.environment:null,G.fog=U.fog,G.envMap=(w.isMeshStandardMaterial?C:Et).get(w.envMap||G.environment),G.envMapRotation=G.environment!==null&&w.envMap===null?U.environmentRotation:w.envMapRotation,Be===void 0&&(w.addEventListener("dispose",Se),Be=new Map,G.programs=Be);let ze=Be.get(ve);if(ze!==void 0){if(G.currentProgram===ze&&G.lightsStateVersion===pe)return $u(w,Me),ze}else Me.uniforms=J.getUniforms(w),w.onBeforeCompile(Me,E),ze=J.acquireProgram(Me,ve),Be.set(ve,ze),G.uniforms=Me.uniforms;const Le=G.uniforms;return(!w.isShaderMaterial&&!w.isRawShaderMaterial||w.clipping===!0)&&(Le.clippingPlanes=be.uniform),$u(w,Me),G.needsLights=Mm(w),G.lightsStateVersion=pe,G.needsLights&&(Le.ambientLightColor.value=N.state.ambient,Le.lightProbe.value=N.state.probe,Le.directionalLights.value=N.state.directional,Le.directionalLightShadows.value=N.state.directionalShadow,Le.spotLights.value=N.state.spot,Le.spotLightShadows.value=N.state.spotShadow,Le.rectAreaLights.value=N.state.rectArea,Le.ltc_1.value=N.state.rectAreaLTC1,Le.ltc_2.value=N.state.rectAreaLTC2,Le.pointLights.value=N.state.point,Le.pointLightShadows.value=N.state.pointShadow,Le.hemisphereLights.value=N.state.hemi,Le.directionalShadowMap.value=N.state.directionalShadowMap,Le.directionalShadowMatrix.value=N.state.directionalShadowMatrix,Le.spotShadowMap.value=N.state.spotShadowMap,Le.spotLightMatrix.value=N.state.spotLightMatrix,Le.spotLightMap.value=N.state.spotLightMap,Le.pointShadowMap.value=N.state.pointShadowMap,Le.pointShadowMatrix.value=N.state.pointShadowMatrix),G.currentProgram=ze,G.uniformsList=null,ze}function Vu(w){if(w.uniformsList===null){const U=w.currentProgram.getUniforms();w.uniformsList=Io.seqWithValue(U.seq,w.uniforms)}return w.uniformsList}function $u(w,U){const z=De.get(w);z.outputColorSpace=U.outputColorSpace,z.batching=U.batching,z.batchingColor=U.batchingColor,z.instancing=U.instancing,z.instancingColor=U.instancingColor,z.instancingMorph=U.instancingMorph,z.skinning=U.skinning,z.morphTargets=U.morphTargets,z.morphNormals=U.morphNormals,z.morphColors=U.morphColors,z.morphTargetsCount=U.morphTargetsCount,z.numClippingPlanes=U.numClippingPlanes,z.numIntersection=U.numClipIntersection,z.vertexAlphas=U.vertexAlphas,z.vertexTangents=U.vertexTangents,z.toneMapping=U.toneMapping}function ym(w,U,z,G,N){U.isScene!==!0&&(U=ge),Ke.resetTextureUnits();const se=U.fog,pe=G.isMeshStandardMaterial?U.environment:null,Me=R===null?E.outputColorSpace:R.isXRRenderTarget===!0?R.texture.colorSpace:Ns,ve=(G.isMeshStandardMaterial?C:Et).get(G.envMap||pe),Be=G.vertexColors===!0&&!!z.attributes.color&&z.attributes.color.itemSize===4,ze=!!z.attributes.tangent&&(!!G.normalMap||G.anisotropy>0),Le=!!z.morphAttributes.position,et=!!z.morphAttributes.normal,lt=!!z.morphAttributes.color;let vt=xi;G.toneMapped&&(R===null||R.isXRRenderTarget===!0)&&(vt=E.toneMapping);const mt=z.morphAttributes.position||z.morphAttributes.normal||z.morphAttributes.color,dt=mt!==void 0?mt.length:0,Ie=De.get(G),_t=f.state.lights;if(ae===!0&&(Ee===!0||w!==y)){const zt=w===y&&G.id===S;be.setState(G,w,zt)}let nt=!1;G.version===Ie.__version?(Ie.needsLights&&Ie.lightsStateVersion!==_t.state.version||Ie.outputColorSpace!==Me||N.isBatchedMesh&&Ie.batching===!1||!N.isBatchedMesh&&Ie.batching===!0||N.isBatchedMesh&&Ie.batchingColor===!0&&N.colorTexture===null||N.isBatchedMesh&&Ie.batchingColor===!1&&N.colorTexture!==null||N.isInstancedMesh&&Ie.instancing===!1||!N.isInstancedMesh&&Ie.instancing===!0||N.isSkinnedMesh&&Ie.skinning===!1||!N.isSkinnedMesh&&Ie.skinning===!0||N.isInstancedMesh&&Ie.instancingColor===!0&&N.instanceColor===null||N.isInstancedMesh&&Ie.instancingColor===!1&&N.instanceColor!==null||N.isInstancedMesh&&Ie.instancingMorph===!0&&N.morphTexture===null||N.isInstancedMesh&&Ie.instancingMorph===!1&&N.morphTexture!==null||Ie.envMap!==ve||G.fog===!0&&Ie.fog!==se||Ie.numClippingPlanes!==void 0&&(Ie.numClippingPlanes!==be.numPlanes||Ie.numIntersection!==be.numIntersection)||Ie.vertexAlphas!==Be||Ie.vertexTangents!==ze||Ie.morphTargets!==Le||Ie.morphNormals!==et||Ie.morphColors!==lt||Ie.toneMapping!==vt||Ie.morphTargetsCount!==dt)&&(nt=!0):(nt=!0,Ie.__version=G.version);let Qt=Ie.currentProgram;nt===!0&&(Qt=Fr(G,U,N));let es=!1,en=!1,Xs=!1;const gt=Qt.getUniforms(),dn=Ie.uniforms;if(Ae.useProgram(Qt.program)&&(es=!0,en=!0,Xs=!0),G.id!==S&&(S=G.id,en=!0),es||y!==w){Ae.buffers.depth.getReversed()?(he.copy(w.projectionMatrix),w_(he),b_(he),gt.setValue(P,"projectionMatrix",he)):gt.setValue(P,"projectionMatrix",w.projectionMatrix),gt.setValue(P,"viewMatrix",w.matrixWorldInverse);const Yt=gt.map.cameraPosition;Yt!==void 0&&Yt.setValue(P,Qe.setFromMatrixPosition(w.matrixWorld)),ht.logarithmicDepthBuffer&&gt.setValue(P,"logDepthBufFC",2/(Math.log(w.far+1)/Math.LN2)),(G.isMeshPhongMaterial||G.isMeshToonMaterial||G.isMeshLambertMaterial||G.isMeshBasicMaterial||G.isMeshStandardMaterial||G.isShaderMaterial)&&gt.setValue(P,"isOrthographic",w.isOrthographicCamera===!0),y!==w&&(y=w,en=!0,Xs=!0)}if(N.isSkinnedMesh){gt.setOptional(P,N,"bindMatrix"),gt.setOptional(P,N,"bindMatrixInverse");const zt=N.skeleton;zt&&(zt.boneTexture===null&&zt.computeBoneTexture(),gt.setValue(P,"boneTexture",zt.boneTexture,Ke))}N.isBatchedMesh&&(gt.setOptional(P,N,"batchingTexture"),gt.setValue(P,"batchingTexture",N._matricesTexture,Ke),gt.setOptional(P,N,"batchingIdTexture"),gt.setValue(P,"batchingIdTexture",N._indirectTexture,Ke),gt.setOptional(P,N,"batchingColorTexture"),N._colorsTexture!==null&&gt.setValue(P,"batchingColorTexture",N._colorsTexture,Ke));const hn=z.morphAttributes;if((hn.position!==void 0||hn.normal!==void 0||hn.color!==void 0)&&_e.update(N,z,Qt),(en||Ie.receiveShadow!==N.receiveShadow)&&(Ie.receiveShadow=N.receiveShadow,gt.setValue(P,"receiveShadow",N.receiveShadow)),G.isMeshGouraudMaterial&&G.envMap!==null&&(dn.envMap.value=ve,dn.flipEnvMap.value=ve.isCubeTexture&&ve.isRenderTargetTexture===!1?-1:1),G.isMeshStandardMaterial&&G.envMap===null&&U.environment!==null&&(dn.envMapIntensity.value=U.environmentIntensity),en&&(gt.setValue(P,"toneMappingExposure",E.toneMappingExposure),Ie.needsLights&&Sm(dn,Xs),se&&G.fog===!0&&W.refreshFogUniforms(dn,se),W.refreshMaterialUniforms(dn,G,H,ie,f.state.transmissionRenderTarget[w.id]),Io.upload(P,Vu(Ie),dn,Ke)),G.isShaderMaterial&&G.uniformsNeedUpdate===!0&&(Io.upload(P,Vu(Ie),dn,Ke),G.uniformsNeedUpdate=!1),G.isSpriteMaterial&&gt.setValue(P,"center",N.center),gt.setValue(P,"modelViewMatrix",N.modelViewMatrix),gt.setValue(P,"normalMatrix",N.normalMatrix),gt.setValue(P,"modelMatrix",N.matrixWorld),G.isShaderMaterial||G.isRawShaderMaterial){const zt=G.uniformsGroups;for(let Yt=0,ya=zt.length;Yt<ya;Yt++){const Ti=zt[Yt];I.update(Ti,Qt),I.bind(Ti,Qt)}}return Qt}function Sm(w,U){w.ambientLightColor.needsUpdate=U,w.lightProbe.needsUpdate=U,w.directionalLights.needsUpdate=U,w.directionalLightShadows.needsUpdate=U,w.pointLights.needsUpdate=U,w.pointLightShadows.needsUpdate=U,w.spotLights.needsUpdate=U,w.spotLightShadows.needsUpdate=U,w.rectAreaLights.needsUpdate=U,w.hemisphereLights.needsUpdate=U}function Mm(w){return w.isMeshLambertMaterial||w.isMeshToonMaterial||w.isMeshPhongMaterial||w.isMeshStandardMaterial||w.isShadowMaterial||w.isShaderMaterial&&w.lights===!0}this.getActiveCubeFace=function(){return T},this.getActiveMipmapLevel=function(){return A},this.getRenderTarget=function(){return R},this.setRenderTargetTextures=function(w,U,z){const G=De.get(w);G.__autoAllocateDepthBuffer=w.resolveDepthBuffer===!1,G.__autoAllocateDepthBuffer===!1&&(G.__useRenderToTexture=!1),De.get(w.texture).__webglTexture=U,De.get(w.depthTexture).__webglTexture=G.__autoAllocateDepthBuffer?void 0:z,G.__hasExternalTextures=!0},this.setRenderTargetFramebuffer=function(w,U){const z=De.get(w);z.__webglFramebuffer=U,z.__useDefaultFramebuffer=U===void 0};const wm=P.createFramebuffer();this.setRenderTarget=function(w,U=0,z=0){R=w,T=U,A=z;let G=!0,N=null,se=!1,pe=!1;if(w){const ve=De.get(w);if(ve.__useDefaultFramebuffer!==void 0)Ae.bindFramebuffer(P.FRAMEBUFFER,null),G=!1;else if(ve.__webglFramebuffer===void 0)Ke.setupRenderTarget(w);else if(ve.__hasExternalTextures)Ke.rebindTextures(w,De.get(w.texture).__webglTexture,De.get(w.depthTexture).__webglTexture);else if(w.depthBuffer){const Le=w.depthTexture;if(ve.__boundDepthTexture!==Le){if(Le!==null&&De.has(Le)&&(w.width!==Le.image.width||w.height!==Le.image.height))throw new Error("WebGLRenderTarget: Attached DepthTexture is initialized to the incorrect size.");Ke.setupDepthRenderbuffer(w)}}const Be=w.texture;(Be.isData3DTexture||Be.isDataArrayTexture||Be.isCompressedArrayTexture)&&(pe=!0);const ze=De.get(w).__webglFramebuffer;w.isWebGLCubeRenderTarget?(Array.isArray(ze[U])?N=ze[U][z]:N=ze[U],se=!0):w.samples>0&&Ke.useMultisampledRTT(w)===!1?N=De.get(w).__webglMultisampledFramebuffer:Array.isArray(ze)?N=ze[z]:N=ze,D.copy(w.viewport),$.copy(w.scissor),k=w.scissorTest}else D.copy(Te).multiplyScalar(H).floor(),$.copy($e).multiplyScalar(H).floor(),k=je;if(z!==0&&(N=wm),Ae.bindFramebuffer(P.FRAMEBUFFER,N)&&G&&Ae.drawBuffers(w,N),Ae.viewport(D),Ae.scissor($),Ae.setScissorTest(k),se){const ve=De.get(w.texture);P.framebufferTexture2D(P.FRAMEBUFFER,P.COLOR_ATTACHMENT0,P.TEXTURE_CUBE_MAP_POSITIVE_X+U,ve.__webglTexture,z)}else if(pe){const ve=De.get(w.texture),Be=U;P.framebufferTextureLayer(P.FRAMEBUFFER,P.COLOR_ATTACHMENT0,ve.__webglTexture,z,Be)}else if(w!==null&&z!==0){const ve=De.get(w.texture);P.framebufferTexture2D(P.FRAMEBUFFER,P.COLOR_ATTACHMENT0,P.TEXTURE_2D,ve.__webglTexture,z)}S=-1},this.readRenderTargetPixels=function(w,U,z,G,N,se,pe,Me=0){if(!(w&&w.isWebGLRenderTarget)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");return}let ve=De.get(w).__webglFramebuffer;if(w.isWebGLCubeRenderTarget&&pe!==void 0&&(ve=ve[pe]),ve){Ae.bindFramebuffer(P.FRAMEBUFFER,ve);try{const Be=w.textures[Me],ze=Be.format,Le=Be.type;if(!ht.textureFormatReadable(ze)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not in RGBA or implementation defined format.");return}if(!ht.textureTypeReadable(Le)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not in UnsignedByteType or implementation defined type.");return}U>=0&&U<=w.width-G&&z>=0&&z<=w.height-N&&(w.textures.length>1&&P.readBuffer(P.COLOR_ATTACHMENT0+Me),P.readPixels(U,z,G,N,ce.convert(ze),ce.convert(Le),se))}finally{const Be=R!==null?De.get(R).__webglFramebuffer:null;Ae.bindFramebuffer(P.FRAMEBUFFER,Be)}}},this.readRenderTargetPixelsAsync=async function(w,U,z,G,N,se,pe,Me=0){if(!(w&&w.isWebGLRenderTarget))throw new Error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");let ve=De.get(w).__webglFramebuffer;if(w.isWebGLCubeRenderTarget&&pe!==void 0&&(ve=ve[pe]),ve)if(U>=0&&U<=w.width-G&&z>=0&&z<=w.height-N){Ae.bindFramebuffer(P.FRAMEBUFFER,ve);const Be=w.textures[Me],ze=Be.format,Le=Be.type;if(!ht.textureFormatReadable(ze))throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in RGBA or implementation defined format.");if(!ht.textureTypeReadable(Le))throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in UnsignedByteType or implementation defined type.");const et=P.createBuffer();P.bindBuffer(P.PIXEL_PACK_BUFFER,et),P.bufferData(P.PIXEL_PACK_BUFFER,se.byteLength,P.STREAM_READ),w.textures.length>1&&P.readBuffer(P.COLOR_ATTACHMENT0+Me),P.readPixels(U,z,G,N,ce.convert(ze),ce.convert(Le),0);const lt=R!==null?De.get(R).__webglFramebuffer:null;Ae.bindFramebuffer(P.FRAMEBUFFER,lt);const vt=P.fenceSync(P.SYNC_GPU_COMMANDS_COMPLETE,0);return P.flush(),await M_(P,vt,4),P.bindBuffer(P.PIXEL_PACK_BUFFER,et),P.getBufferSubData(P.PIXEL_PACK_BUFFER,0,se),P.deleteBuffer(et),P.deleteSync(vt),se}else throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: requested read bounds are out of range.")},this.copyFramebufferToTexture=function(w,U=null,z=0){const G=Math.pow(2,-z),N=Math.floor(w.image.width*G),se=Math.floor(w.image.height*G),pe=U!==null?U.x:0,Me=U!==null?U.y:0;Ke.setTexture2D(w,0),P.copyTexSubImage2D(P.TEXTURE_2D,z,0,0,pe,Me,N,se),Ae.unbindTexture()};const bm=P.createFramebuffer(),Em=P.createFramebuffer();this.copyTextureToTexture=function(w,U,z=null,G=null,N=0,se=null){se===null&&(N!==0?(Ts("WebGLRenderer: copyTextureToTexture function signature has changed to support src and dst mipmap levels."),se=N,N=0):se=0);let pe,Me,ve,Be,ze,Le,et,lt,vt;const mt=w.isCompressedTexture?w.mipmaps[se]:w.image;if(z!==null)pe=z.max.x-z.min.x,Me=z.max.y-z.min.y,ve=z.isBox3?z.max.z-z.min.z:1,Be=z.min.x,ze=z.min.y,Le=z.isBox3?z.min.z:0;else{const hn=Math.pow(2,-N);pe=Math.floor(mt.width*hn),Me=Math.floor(mt.height*hn),w.isDataArrayTexture?ve=mt.depth:w.isData3DTexture?ve=Math.floor(mt.depth*hn):ve=1,Be=0,ze=0,Le=0}G!==null?(et=G.x,lt=G.y,vt=G.z):(et=0,lt=0,vt=0);const dt=ce.convert(U.format),Ie=ce.convert(U.type);let _t;U.isData3DTexture?(Ke.setTexture3D(U,0),_t=P.TEXTURE_3D):U.isDataArrayTexture||U.isCompressedArrayTexture?(Ke.setTexture2DArray(U,0),_t=P.TEXTURE_2D_ARRAY):(Ke.setTexture2D(U,0),_t=P.TEXTURE_2D),P.pixelStorei(P.UNPACK_FLIP_Y_WEBGL,U.flipY),P.pixelStorei(P.UNPACK_PREMULTIPLY_ALPHA_WEBGL,U.premultiplyAlpha),P.pixelStorei(P.UNPACK_ALIGNMENT,U.unpackAlignment);const nt=P.getParameter(P.UNPACK_ROW_LENGTH),Qt=P.getParameter(P.UNPACK_IMAGE_HEIGHT),es=P.getParameter(P.UNPACK_SKIP_PIXELS),en=P.getParameter(P.UNPACK_SKIP_ROWS),Xs=P.getParameter(P.UNPACK_SKIP_IMAGES);P.pixelStorei(P.UNPACK_ROW_LENGTH,mt.width),P.pixelStorei(P.UNPACK_IMAGE_HEIGHT,mt.height),P.pixelStorei(P.UNPACK_SKIP_PIXELS,Be),P.pixelStorei(P.UNPACK_SKIP_ROWS,ze),P.pixelStorei(P.UNPACK_SKIP_IMAGES,Le);const gt=w.isDataArrayTexture||w.isData3DTexture,dn=U.isDataArrayTexture||U.isData3DTexture;if(w.isDepthTexture){const hn=De.get(w),zt=De.get(U),Yt=De.get(hn.__renderTarget),ya=De.get(zt.__renderTarget);Ae.bindFramebuffer(P.READ_FRAMEBUFFER,Yt.__webglFramebuffer),Ae.bindFramebuffer(P.DRAW_FRAMEBUFFER,ya.__webglFramebuffer);for(let Ti=0;Ti<ve;Ti++)gt&&(P.framebufferTextureLayer(P.READ_FRAMEBUFFER,P.COLOR_ATTACHMENT0,De.get(w).__webglTexture,N,Le+Ti),P.framebufferTextureLayer(P.DRAW_FRAMEBUFFER,P.COLOR_ATTACHMENT0,De.get(U).__webglTexture,se,vt+Ti)),P.blitFramebuffer(Be,ze,pe,Me,et,lt,pe,Me,P.DEPTH_BUFFER_BIT,P.NEAREST);Ae.bindFramebuffer(P.READ_FRAMEBUFFER,null),Ae.bindFramebuffer(P.DRAW_FRAMEBUFFER,null)}else if(N!==0||w.isRenderTargetTexture||De.has(w)){const hn=De.get(w),zt=De.get(U);Ae.bindFramebuffer(P.READ_FRAMEBUFFER,bm),Ae.bindFramebuffer(P.DRAW_FRAMEBUFFER,Em);for(let Yt=0;Yt<ve;Yt++)gt?P.framebufferTextureLayer(P.READ_FRAMEBUFFER,P.COLOR_ATTACHMENT0,hn.__webglTexture,N,Le+Yt):P.framebufferTexture2D(P.READ_FRAMEBUFFER,P.COLOR_ATTACHMENT0,P.TEXTURE_2D,hn.__webglTexture,N),dn?P.framebufferTextureLayer(P.DRAW_FRAMEBUFFER,P.COLOR_ATTACHMENT0,zt.__webglTexture,se,vt+Yt):P.framebufferTexture2D(P.DRAW_FRAMEBUFFER,P.COLOR_ATTACHMENT0,P.TEXTURE_2D,zt.__webglTexture,se),N!==0?P.blitFramebuffer(Be,ze,pe,Me,et,lt,pe,Me,P.COLOR_BUFFER_BIT,P.NEAREST):dn?P.copyTexSubImage3D(_t,se,et,lt,vt+Yt,Be,ze,pe,Me):P.copyTexSubImage2D(_t,se,et,lt,Be,ze,pe,Me);Ae.bindFramebuffer(P.READ_FRAMEBUFFER,null),Ae.bindFramebuffer(P.DRAW_FRAMEBUFFER,null)}else dn?w.isDataTexture||w.isData3DTexture?P.texSubImage3D(_t,se,et,lt,vt,pe,Me,ve,dt,Ie,mt.data):U.isCompressedArrayTexture?P.compressedTexSubImage3D(_t,se,et,lt,vt,pe,Me,ve,dt,mt.data):P.texSubImage3D(_t,se,et,lt,vt,pe,Me,ve,dt,Ie,mt):w.isDataTexture?P.texSubImage2D(P.TEXTURE_2D,se,et,lt,pe,Me,dt,Ie,mt.data):w.isCompressedTexture?P.compressedTexSubImage2D(P.TEXTURE_2D,se,et,lt,mt.width,mt.height,dt,mt.data):P.texSubImage2D(P.TEXTURE_2D,se,et,lt,pe,Me,dt,Ie,mt);P.pixelStorei(P.UNPACK_ROW_LENGTH,nt),P.pixelStorei(P.UNPACK_IMAGE_HEIGHT,Qt),P.pixelStorei(P.UNPACK_SKIP_PIXELS,es),P.pixelStorei(P.UNPACK_SKIP_ROWS,en),P.pixelStorei(P.UNPACK_SKIP_IMAGES,Xs),se===0&&U.generateMipmaps&&P.generateMipmap(_t),Ae.unbindTexture()},this.copyTextureToTexture3D=function(w,U,z=null,G=null,N=0){return Ts('WebGLRenderer: copyTextureToTexture3D function has been deprecated. Use "copyTextureToTexture" instead.'),this.copyTextureToTexture(w,U,z,G,N)},this.initRenderTarget=function(w){De.get(w).__webglFramebuffer===void 0&&Ke.setupRenderTarget(w)},this.initTexture=function(w){w.isCubeTexture?Ke.setTextureCube(w,0):w.isData3DTexture?Ke.setTexture3D(w,0):w.isDataArrayTexture||w.isCompressedArrayTexture?Ke.setTexture2DArray(w,0):Ke.setTexture2D(w,0),Ae.unbindTexture()},this.resetState=function(){T=0,A=0,R=null,Ae.reset(),Ge.reset()},typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}get coordinateSystem(){return jn}get outputColorSpace(){return this._outputColorSpace}set outputColorSpace(e){this._outputColorSpace=e;const t=this.getContext();t.drawingBufferColorSpace=it._getDrawingBufferColorSpace(e),t.unpackColorSpace=it._getUnpackColorSpace()}}const XS=3;let Uo="checking",ws=null,_o=null,ph=0;const pp=new Set;function mp(){return Uo}function YS(n){pp.add(n)}function ou(){return ws?Promise.resolve(ws):(_o||(_o=qS().finally(()=>{_o=null})),_o)}function _s(n){if(n!==Uo){Uo=n;for(const e of pp)e(Uo)}}async function qS(){_s("checking");const n=globalThis.navigator?.gpu;if(!n)return _s("no-webgpu"),null;let e=null;try{e=await n.requestAdapter()}catch{e=null}if(!e||e.info?.isFallbackAdapter||e.isFallbackAdapter)return _s("no-adapter"),null;let t=null;try{t=await e.requestDevice()}catch{t=null}return t?(t.lost.then(()=>{ws===t&&(ws=null,ph<XS?(ph+=1,ou()):_s("device-failed"))}),ws=t,_s("ready"),ws):(_s("device-failed"),null)}const jS=`// SPDX-License-Identifier: Apache-2.0
//
// Game of Life 3D: one generation per dispatch.
//
// The reference is convolve3D() in src/denseStep.js: this must give exactly its grids,
// cell for cell. Cells are bytes packed four to a u32 word (byte k of word w is cell 4w + k),
// the same layout as Grid3D.data, so a buffer copies straight into a Uint8Array. Cell i is at
// x + y*size + z*size². Each invocation writes one whole word, so no two write the same memory.

struct Params {
  size: u32,       // grid edge length
  cellCount: u32,  // size³
  wordCount: u32,  // ceil(cellCount / 4)
  wrap: u32,       // 1: the edges wrap around; 0: neighbours clamp to the grid, as on the CPU
  rowWords: u32,   // words per row of the dispatch (workgroups along x × 64)
  _pad0: u32,
  _pad1: u32,
  _pad2: u32,
  // Bit n set: n live neighbours give birth (or let a live cell survive).
  // Index 0 is the interior; with wrapping off, 1 is a face, 2 an edge and 3 a corner.
  birth: vec4<u32>,
  survival: vec4<u32>,
}

@group(0) @binding(0) var<uniform> params: Params;
@group(0) @binding(1) var<storage, read> current: array<u32>;
@group(0) @binding(2) var<storage, read_write> next: array<u32>;

fn cell(i: u32) -> u32 {
  return (current[i >> 2u] >> ((i & 3u) * 8u)) & 0xffu;
}

// A neighbour's coordinate along one axis. With wrapping off it clamps to the grid, so a cell
// on the boundary counts the cells beside it (and itself) more than once, as the CPU does.
fn neighbour(c: u32, d: i32) -> u32 {
  let n = i32(params.size);
  let v = i32(c) + d;
  if (params.wrap == 1u) {
    return u32((v + n) % n);
  }
  return u32(clamp(v, 0, n - 1));
}

fn onBoundary(c: u32) -> u32 {
  return select(0u, 1u, c == 0u || c == params.size - 1u);
}

fn nextCell(i: u32) -> u32 {
  let s = params.size;
  let x = i % s;
  let y = (i / s) % s;
  let z = i / (s * s);

  var count = 0u;
  for (var dz = -1; dz <= 1; dz++) {
    let nz = neighbour(z, dz);
    for (var dy = -1; dy <= 1; dy++) {
      let ny = neighbour(y, dy);
      for (var dx = -1; dx <= 1; dx++) {
        if (dx == 0 && dy == 0 && dz == 0) {
          continue;
        }
        count += cell(neighbour(x, dx) + ny * s + nz * s * s);
      }
    }
  }

  // Which rules apply: the boundary count picks face, edge or corner when wrapping is off
  var kind = 0u;
  if (params.wrap == 0u) {
    kind = onBoundary(x) + onBoundary(y) + onBoundary(z);
  }
  let bit = select(0u, 1u << count, count < 32u);

  if (cell(i) == 1u) {
    return select(0u, 1u, (params.survival[kind] & bit) != 0u);
  }
  // The CPU only looks at live cells and their neighbours, so a dead cell with no live
  // neighbour stays dead, even if a birth rule lists 0
  if (count == 0u) {
    return 0u;
  }
  return select(0u, 1u, (params.birth[kind] & bit) != 0u);
}

@compute @workgroup_size(64)
fn stepGeneration(@builtin(global_invocation_id) id: vec3<u32>) {
  let w = id.x + id.y * params.rowWords;
  if (w >= params.wordCount) {
    return;
  }
  var word = 0u;
  for (var k = 0u; k < 4u; k++) {
    let i = w * 4u + k;
    if (i < params.cellCount) {
      word |= nextCell(i) << (k * 8u);
    }
  }
  next[w] = word;
}
`,KS=`// SPDX-License-Identifier: Apache-2.0
//
// Rule 30, 1D and 2D: one layer per dispatch.
//
// The references are evolveRule30() and evolveRule30_2D() in src/matrixFunctions.js. Each of
// their generations keeps every layer it has and adds one new layer (y) below the lowest one,
// computed from that lowest layer alone. So the GPU only steps that layer: \`current\` is the
// lowest layer, \`next\` the one below it. src/gpu/engine.js puts each new layer into the grid,
// where the CPU would. A layer of size × size cells is packed four to a u32 word, cell x + z*size;
// each invocation writes one whole word.

struct Params {
  size: u32,       // grid edge length
  cellCount: u32,  // cells in a layer: size²
  wordCount: u32,  // ceil(cellCount / 4)
  wrap: u32,       // 1: the edges wrap around; 0: neighbours clamp to the grid, as on the CPU
  rowWords: u32,   // words per row of the dispatch (workgroups along x × 64)
  twoD: u32,       // 1: Rule 30 2D; 0: Rule 30 (1D)
  _pad0: u32,
  _pad1: u32,
}

@group(0) @binding(0) var<uniform> params: Params;
@group(0) @binding(1) var<storage, read> current: array<u32>;
@group(0) @binding(2) var<storage, read_write> next: array<u32>;

fn cellAt(x: u32, z: u32) -> u32 {
  let i = x + z * params.size;
  return (current[i >> 2u] >> ((i & 3u) * 8u)) & 0xffu;
}

fn neighbour(c: u32, d: i32) -> u32 {
  let n = i32(params.size);
  let v = i32(c) + d;
  if (params.wrap == 1u) {
    return u32((v + n) % n);
  }
  return u32(clamp(v, 0, n - 1));
}

// Rule 30 on a row of three: 100, 011, 010 and 001 give 1, the rest 0
fn rule30(left: u32, centre: u32, right: u32) -> u32 {
  return left ^ (centre | right);
}

fn rowResult(x: u32, z: u32) -> u32 {
  return rule30(cellAt(neighbour(x, -1), z), cellAt(x, z), cellAt(neighbour(x, 1), z));
}

fn nextCell(i: u32) -> u32 {
  let x = i % params.size;
  let z = i / params.size;
  var v = rowResult(x, z);
  if (params.twoD == 1u) {
    // 2D: the rows either side (along z) flip the middle row's result by their parity
    v = v ^ rowResult(x, neighbour(z, -1)) ^ rowResult(x, neighbour(z, 1));
  }
  return v;
}

@compute @workgroup_size(64)
fn stepGeneration(@builtin(global_invocation_id) id: vec3<u32>) {
  let w = id.x + id.y * params.rowWords;
  if (w >= params.wordCount) {
    return;
  }
  var word = 0u;
  for (var k = 0u; k < 4u; k++) {
    let i = w * 4u + k;
    if (i < params.cellCount) {
      word |= nextCell(i) << (k * 8u);
    }
  }
  next[w] = word;
}
`,mh=64,ZS=64*1024*1024,JS=[5,6,7,8,9,10,11,12,13,14,15];function gp({useRule30:n,useRule30_2D:e,useSineWave:t,useSandpile:i}){return t||i?null:e?"rule30_2D":n?"rule30":"gameOfLife3D"}function QS(n){const{size:e,data:t,active:i}=n;let s=0;for(let o=0;o<t.length;o++)if(t[o]===1)s++;else if(t[o]!==0)return!1;if(s!==i.length)return!1;const r=new Uint8Array(t.length);for(const[o,a,l]of i){if(![o,a,l].every(d=>Number.isInteger(d)&&d>=0&&d<e))return!1;const u=n._idx(o,a,l);if(t[u]!==1||r[u])return!1;r[u]=1}return!0}async function*eM(n,{mode:e,seed:t,generations:i,wrapping:s,rules:r,boundaryRules:o}){const a=e==="gameOfLife3D"?tM(t,r,o):nM(t,e==="rule30_2D"),{cellCount:l}=a,c=Math.ceil(l/4),u=c*4;if(u>n.limits.maxStorageBufferBindingSize)throw new Error(`A ${t.size}³ grid is larger than this GPU's storage buffer limit`);let d=!1;const h=n.lost.then(()=>{throw d=!0,new Error("The GPU device was lost")});h.catch(()=>{});const p=Math.max(1,Math.min(i,Math.floor(ZS/u))),g=Math.ceil(c/mh),_=Math.min(g,n.limits.maxComputeWorkgroupsPerDimension),m=Math.ceil(g/_),f=[],M=b=>{const E=n.createBuffer(b);return f.push(E),E};try{n.pushErrorScope("out-of-memory"),n.pushErrorScope("validation");const{layout:b,pipeline:E}=rM(n)[a.kernel],L=new Uint32Array(16);L.set([t.size,l,c,s?1:0,_*mh]),L.set(a.params,5);const T=M({size:L.byteLength,usage:GPUBufferUsage.UNIFORM|GPUBufferUsage.COPY_DST});n.queue.writeBuffer(T,0,L);const A=[0,1].map(()=>M({size:u,usage:GPUBufferUsage.STORAGE|GPUBufferUsage.COPY_SRC|GPUBufferUsage.COPY_DST})),R=new Uint8Array(u);R.set(a.initial),n.queue.writeBuffer(A[0],0,R);const S=[0,1].map(Z=>n.createBindGroup({layout:b,entries:[{binding:0,resource:{buffer:T}},{binding:1,resource:{buffer:A[Z]}},{binding:2,resource:{buffer:A[1-Z]}}]})),y=M({size:p*u,usage:GPUBufferUsage.MAP_READ|GPUBufferUsage.COPY_DST}),D=[n.popErrorScope(),n.popErrorScope()],$=(await Promise.all(D)).find(Boolean);if($)throw new Error(`GPU setup failed: ${$.message}`);let k=0,q=t;for(let Z=0;Z<i;){const V=Math.min(p,i-Z);n.pushErrorScope("out-of-memory"),n.pushErrorScope("validation");const ie=n.createCommandEncoder();for(let je=0;je<V;je++){const X=ie.beginComputePass();X.setPipeline(E),X.setBindGroup(0,S[k]),X.dispatchWorkgroups(_,m),X.end(),k=1-k,ie.copyBufferToBuffer(A[k],0,y,je*u,u)}n.queue.submit([ie.finish()]);const H=[n.popErrorScope(),n.popErrorScope()],oe=y.mapAsync(GPUMapMode.READ,0,V*u);oe.catch(()=>{}),await Promise.race([oe,h]);const me=(await Promise.all(H)).find(Boolean);if(d||me)throw new Error(me?`GPU step failed: ${me.message}`:"The GPU device was lost");const Te=new Uint8Array(y.getMappedRange(0,V*u)),$e=[];for(let je=0;je<V;je++)q=a.toGrid(Te.subarray(je*u,je*u+l),q),$e.push(q);y.unmap();for(const je of $e)yield je;Z+=V}}finally{for(const b of f)b.destroy()}}function tM(n,e,t){const i=sM(e,t);return{kernel:"gameOfLife",cellCount:n.data.length,initial:n.data,params:[0,0,0,...i.birth,...i.survival],toGrid(s){const r=new Jt(n.size,0);return r.data.set(s),iM(r),r}}}function nM(n,e){const{size:t}=n;let i=-1;for(const[,r]of n.active)i=Math.max(i,r);const s=new Uint8Array(t*t);if(i>=0)for(let r=0;r<t;r++)for(let o=0;o<t;o++)s[o+r*t]=n.get(o,i,r);return{kernel:"rule30",cellCount:t*t,initial:s,params:[e?1:0],toGrid(r,o){const a=new Jt(t,0);if(i<0||(a.data.set(o.data),a.active=o.active.slice(),i>=t-1))return a;const l=i+1;for(let c=0;c<t;c++)for(let u=0;u<t;u++)r[u+c*t]===1&&(a.data[a._idx(u,l,c)]=1,a.active.push([u,l,c]),i=l);return a}}}function iM(n){const{size:e,data:t}=n,i=e*e,s=[],r=a=>s.push([a%e,Math.floor(a/e)%e,Math.floor(a/i)]),o=new Uint32Array(t.buffer,t.byteOffset,t.length>>2);for(let a=0;a<o.length;a++)if(o[a]!==0)for(let l=a*4;l<a*4+4;l++)t[l]===1&&r(l);for(let a=o.length*4;a<t.length;a++)t[a]===1&&r(a);n.active=s}function vo(n){let e=0;for(const t of n??[])Number.isInteger(t)&&t>=0&&t<32&&(e|=1<<t);return e>>>0}function sM(n,e){const t=n?.survival??[],i={birth:vo(n?.birth??[9,10]),survival:vo(new Set(t).size>0?t:JS)},s=e??{},r=[null,"face","edgeTwoFaces","corner"].map(o=>{const a=o&&s[o];return a?{birth:vo(a.birth),survival:vo(a.survival)}:i});return{birth:r.map(o=>o.birth),survival:r.map(o=>o.survival)}}const gh=new WeakMap;function rM(n){let e=gh.get(n);if(e)return e;const t=(o,a)=>({binding:o,visibility:GPUShaderStage.COMPUTE,buffer:{type:a}}),i=n.createBindGroupLayout({entries:[t(0,"uniform"),t(1,"read-only-storage"),t(2,"storage")]}),s=n.createPipelineLayout({bindGroupLayouts:[i]}),r=(o,a)=>n.createComputePipeline({layout:s,compute:{module:n.createShaderModule({label:o,code:a}),entryPoint:"stepGeneration"}});return e={gameOfLife:{layout:i,pipeline:r("gameOfLife3D.wgsl",jS)},rule30:{layout:i,pipeline:r("rule30.wgsl",KS)}},gh.set(n,e),e}function oM(n,e,t,i){const s=c=>c===0||c===i-1,r=s(n),o=s(e),a=s(t),l=(r?1:0)+(o?1:0)+(a?1:0);return l===0?null:l===3?"corner":l===2?"edgeTwoFaces":l===1?"face":null}function aM(n,{wrapping:e=!0,rules:t=null,boundaryRules:i={}}={}){const s=n.size,r=new Jt(s,0),o=(d,h)=>{const p=d+h;return e?n._wrap(p):Math.max(0,Math.min(s-1,p))},a=new Map;for(const[d,h,p]of n.active){const g=`${d},${h},${p}`;a.set(g,[d,h,p]);for(let _=-1;_<=1;_++)for(let m=-1;m<=1;m++)for(let f=-1;f<=1;f++){const M=o(d,_),b=o(h,m),E=o(p,f);a.set(`${M},${b},${E}`,[M,b,E])}}const l=new Set(t?.birth??[9,10]),c=new Set(t?.survival??[]);i=i??{};const u={};i.corner&&(u.corner={birth:new Set(i.corner.birth),survival:new Set(i.corner.survival)}),i.edgeTwoFaces&&(u.edgeTwoFaces={birth:new Set(i.edgeTwoFaces.birth),survival:new Set(i.edgeTwoFaces.survival)}),i.face&&(u.face={birth:new Set(i.face.birth),survival:new Set(i.face.survival)});for(const[d,h,p]of a.values()){let g=0;for(let b=-1;b<=1;b++)for(let E=-1;E<=1;E++)for(let L=-1;L<=1;L++){if(b===0&&E===0&&L===0)continue;const T=o(d,b),A=o(h,E),R=o(p,L);g+=n.get(T,A,R)}const _=n.get(d,h,p)===1;let m,f=!1,M=null;if(e||(M=oM(d,h,p,s),f=M!==null&&u[M]),f){const b=u[M];_?m=b.survival.has(g)?1:0:m=b.birth.has(g)?1:0}else _?m=c.size>0?c.has(g)?1:0:g>=5&&g<=15?1:0:m=l.has(g)?1:0;m===1&&r.set(d,h,p,1)}return r}async function lM(n,e,t,i=!1,s=!1,r=!1,o=!1,a=null){const l=[];if(r)for(let c=0;c<=e;c++){const u=fM(n,c,e);l.push(u)}else if(o){const c=a?{...a,threshold:4}:{initialSand:0,threshold:4};let u=pM(n,c);l.push(u);const d=Math.floor(n/2);for(let h=0;h<e;h++){const p=h+1,g=u.get(d,d,0);u.data[u._idx(d,d,0)]=Math.min(255,g+1),cr(u);const _=new Jt(n,0);_.data.set(u.data),cr(_),_.generation=p,l.push(_);let m=!0,f=0;const M=n*n*20;let b=!1;for(;m&&f<M;){let E=!1;for(let T=0;T<n;T++){for(let A=0;A<n;A++)if(u.get(T,A,0)===c.threshold){E=!0;break}if(E)break}if(E&&!b){const T=new Jt(n,0);T.data.set(u.data),cr(T),T.generation=p,l.push(T),b=!0}const L=mM(u,c.threshold);m=!1;for(let T=0;T<n;T++){for(let A=0;A<n;A++)if(L.get(T,A,0)!==u.get(T,A,0)){m=!0;break}if(m)break}u=L,f++}f>=M&&console.warn(`Sandpile generation ${h+1} hit max iterations limit`),u.generation=p,l.push(u)}}else{let c=cM(n,t);l.push(c);const u=v.gpuCompute?gp({useRule30:i,useRule30_2D:s,useSineWave:r,useSandpile:o}):null;if(u&&e>0){const d=await ou();if(d&&QS(c)){try{const h={mode:u,seed:c,generations:e,wrapping:v.gridWrapping??!0,rules:v.rules,boundaryRules:v.boundaryRules};for await(const p of eM(d,h))l.push(p)}catch(h){console.warn(`GPU compute stopped after ${l.length-1} generations; continuing on the CPU.`,h)}c=l[l.length-1]}}for(let d=l.length-1;d<e;d++)s?c=hM(c):i?c=dM(c):c=uM(c),l.push(c)}return l}function cM(n,e){const t=new Jt(n,0);return typeof e=="function"&&e(t,n),t}function uM(n){return aM(n,{wrapping:v.gridWrapping??!0,rules:v.rules,boundaryRules:v.boundaryRules})}function dM(n){const e=n.size,t=new Jt(e,0),i=v.gridWrapping??!0,s={111:0,110:0,101:0,100:1,"011":1,"010":1,"001":1,"000":0};let r=-1;for(const[c,u,d]of n.active)r=Math.max(r,u);if(r===-1)return t;for(const[c,u,d]of n.active)t.set(c,u,d,1);if(r>=e-1)return t;const o=r+1,a=r,l=(c,u,d,h)=>{const p=c+h;if(i)return n.get(n._wrap(p),u,d);{const g=Math.max(0,Math.min(e-1,p));return n.get(g,u,d)}};for(let c=0;c<e;c++)for(let u=0;u<e;u++){const d=l(u,a,c,-1),h=n.get(u,a,c),p=l(u,a,c,1),g=`${d}${h}${p}`;(s[g]!==void 0?s[g]:0)===1&&t.set(u,o,c,1)}return t}function hM(n){const e=n.size,t=new Jt(e,0),i=v.gridWrapping??!0,s={111:0,110:0,101:0,100:1,"011":1,"010":1,"001":1,"000":0};let r=-1;for(const[c,u,d]of n.active)r=Math.max(r,u);if(r===-1)return t;for(const[c,u,d]of n.active)t.set(c,u,d,1);if(r>=e-1)return t;const o=r+1,a=r,l=(c,u,d,h,p)=>{const g=c+h,_=d+p;if(i)return n.get(n._wrap(g),u,n._wrap(_));{const m=Math.max(0,Math.min(e-1,g)),f=Math.max(0,Math.min(e-1,_));return n.get(m,u,f)}};for(let c=0;c<e;c++)for(let u=0;u<e;u++){const d=l(u,a,c,-1,-1),h=l(u,a,c,0,-1),p=l(u,a,c,1,-1),g=l(u,a,c,-1,0),_=n.get(u,a,c),m=l(u,a,c,1,0),f=l(u,a,c,-1,1),M=l(u,a,c,0,1),b=l(u,a,c,1,1),E=`${d}${h}${p}`,L=`${g}${_}${m}`,T=`${f}${M}${b}`,A=s[E]??0,R=s[L]??0,S=s[T]??0;((A+S)%2===0?R:R^1)===1&&t.set(u,o,c,1)}return t}function fM(n,e,t){const i=new Jt(n,0),s=2*Math.PI/n,r=(n-1)/2,o=(n-1)/2,a=e/t*2*Math.PI;for(let l=0;l<n;l++){const c=Math.sin(s*l+a),u=Math.round(o+c*r),d=Math.max(0,Math.min(n-1,u));for(let h=0;h<n;h++)i.set(l,d,h,1)}return i}function pM(n,e){const t=new Jt(n,0),{initialSand:i}=e,s=Math.floor(n/2),r=Math.min(255,Math.max(0,i||0));return r>0&&(t.data[t._idx(s,s,0)]=r),cr(t),t}function mM(n,e){const t=n.size,i=new Jt(t,0);for(let l=0;l<t;l++)for(let c=0;c<t;c++){const u=n.get(l,c,0);i.data[i._idx(l,c,0)]=u}const s=[];for(let l=0;l<t;l++)for(let c=0;c<t;c++)i.get(l,c,0)>=e&&s.push([l,c]);const r=v.gridWrapping??!0,o=(l,c)=>{const u=l+c;return r?n._wrap(u):Math.max(0,Math.min(t-1,u))},a=[[0,-1],[0,1],[-1,0],[1,0]];for(const[l,c]of s){const u=i.get(l,c,0);if(u<e)continue;const d=Math.floor(u/e),h=u%e;i.data[i._idx(l,c,0)]=h;for(const[p,g]of a){const _=o(l,p),m=o(c,g),f=i._idx(_,m,0),M=Math.min(255,i.data[f]+d);i.data[f]=M}}return cr(i),i}function cr(n){n.active=[];const e=n.size;for(let t=0;t<e;t++)for(let i=0;i<e;i++){const s=n.get(t,i,0);for(let r=0;r<s;r++)n.active.push([t,i,r])}}const _p="morpheus-tech-lab.gpuCompute",gM={"no-webgpu":"This browser doesn't have WebGPU, so simulations run on the CPU. Recent Chrome, Edge, Safari and Firefox have it, on a secure page (HTTPS or localhost).","no-adapter":"No GPU adapter was found, so simulations run on the CPU. The browser may have blocklisted the GPU, or hardware acceleration may be turned off.","device-failed":"The GPU failed to start, so simulations run on the CPU. Reloading the page may help."},_M={sineWave:"Sine Wave",sandpile:"Abelian Sandpile"};let Zn=null;function vM(){if(Zn)return;const n=document.getElementById("gpuComputeToggle");n&&(Zn={root:document.getElementById("gpu-compute-control"),button:n,icon:document.getElementById("gpuComputeIcon"),badge:document.getElementById("gpu-compute-badge"),status:document.getElementById("gpu-compute-status"),popover:document.getElementById("gpu-compute-popover")},v.gpuCompute=xM(),n.addEventListener("click",()=>{if(au()){nl();return}v.gpuCompute=!v.gpuCompute,yM(v.gpuCompute),No()}),n.addEventListener("mouseenter",nl),n.addEventListener("mouseleave",rr),n.addEventListener("focus",nl),n.addEventListener("blur",rr),n.addEventListener("keydown",e=>{e.key==="Escape"&&rr()}),document.addEventListener("pointerdown",e=>{Zn.root.contains(e.target)||rr()}),YS(No),ou(),No())}function No(){if(!Zn)return;const{root:n,button:e,icon:t,badge:i,status:s,popover:r}=Zn,o=mp()==="checking",a=au(),l=!o&&!a&&v.gpuCompute;e.setAttribute("aria-pressed",String(!a&&v.gpuCompute)),e.setAttribute("aria-disabled",String(!!a)),n.classList.toggle("is-unavailable",!!a),t&&(t.style.stroke=l?"#4da3ff":"currentColor"),i.textContent=o?"…":l?"GPU":"CPU",s.textContent=o?"Checking for a GPU.":`The next run computes on the ${l?"GPU":"CPU"}.`,r.textContent=a??"",a||rr()}function au(){if(v.simulationMode==="contests")return"The contests run on the CPU, in a background thread (a Web Worker), so every entrant runs the same engine: Season 0 is CPU-only. GPU compute covers Game of Life 3D (bounded) and Rule 30.";if(v.simulationMode==="explore")return"Game of Life 3D (unbounded) runs on the CPU, in a background thread (a Web Worker), so the page stays responsive however hard it works. A GPU needs a world of fixed size, and this one grows with the pattern, so it has no GPU path yet. For Game of Life 3D on the GPU, choose Game of Life 3D (bounded).";const n=gM[mp()];return n||(gp(v)?null:`${_M[v.simulationMode]??"This mode"} runs on the CPU only. GPU compute covers Game of Life 3D (bounded) and Rule 30.`)}function nl(){Zn&&au()&&Zn.root.classList.add("is-open")}function rr(){Zn&&Zn.root.classList.remove("is-open")}function xM(){try{return window.localStorage.getItem(_p)!=="off"}catch{return!0}}function yM(n){try{window.localStorage.setItem(_p,n?"on":"off")}catch{}}const _h={type:"change"},lu={type:"start"},vp={type:"end"},xo=new Ar,vh=new ai,SM=Math.cos(70*y_.DEG2RAD),Tt=new F,jt=2*Math.PI,ut={NONE:-1,ROTATE:0,DOLLY:1,PAN:2,TOUCH_ROTATE:3,TOUCH_PAN:4,TOUCH_DOLLY_PAN:5,TOUCH_DOLLY_ROTATE:6},il=1e-6;class xp extends l0{constructor(e,t=null){super(e,t),this.state=ut.NONE,this.target=new F,this.cursor=new F,this.minDistance=0,this.maxDistance=1/0,this.minZoom=0,this.maxZoom=1/0,this.minTargetRadius=0,this.maxTargetRadius=1/0,this.minPolarAngle=0,this.maxPolarAngle=Math.PI,this.minAzimuthAngle=-1/0,this.maxAzimuthAngle=1/0,this.enableDamping=!1,this.dampingFactor=.05,this.enableZoom=!0,this.zoomSpeed=1,this.enableRotate=!0,this.rotateSpeed=1,this.keyRotateSpeed=1,this.enablePan=!0,this.panSpeed=1,this.screenSpacePanning=!0,this.keyPanSpeed=7,this.zoomToCursor=!1,this.autoRotate=!1,this.autoRotateSpeed=2,this.keys={LEFT:"ArrowLeft",UP:"ArrowUp",RIGHT:"ArrowRight",BOTTOM:"ArrowDown"},this.mouseButtons={LEFT:bs.ROTATE,MIDDLE:bs.DOLLY,RIGHT:bs.PAN},this.touches={ONE:Ss.ROTATE,TWO:Ss.DOLLY_PAN},this.target0=this.target.clone(),this.position0=this.object.position.clone(),this.zoom0=this.object.zoom,this._domElementKeyEvents=null,this._lastPosition=new F,this._lastQuaternion=new $i,this._lastTargetPosition=new F,this._quat=new $i().setFromUnitVectors(e.up,new F(0,1,0)),this._quatInverse=this._quat.clone().invert(),this._spherical=new Hd,this._sphericalDelta=new Hd,this._scale=1,this._panOffset=new F,this._rotateStart=new Ve,this._rotateEnd=new Ve,this._rotateDelta=new Ve,this._panStart=new Ve,this._panEnd=new Ve,this._panDelta=new Ve,this._dollyStart=new Ve,this._dollyEnd=new Ve,this._dollyDelta=new Ve,this._dollyDirection=new F,this._mouse=new Ve,this._performCursorZoom=!1,this._pointers=[],this._pointerPositions={},this._controlActive=!1,this._onPointerMove=wM.bind(this),this._onPointerDown=MM.bind(this),this._onPointerUp=bM.bind(this),this._onContextMenu=LM.bind(this),this._onMouseWheel=AM.bind(this),this._onKeyDown=RM.bind(this),this._onTouchStart=CM.bind(this),this._onTouchMove=PM.bind(this),this._onMouseDown=EM.bind(this),this._onMouseMove=TM.bind(this),this._interceptControlDown=DM.bind(this),this._interceptControlUp=IM.bind(this),this.domElement!==null&&this.connect(this.domElement),this.update()}connect(e){super.connect(e),this.domElement.addEventListener("pointerdown",this._onPointerDown),this.domElement.addEventListener("pointercancel",this._onPointerUp),this.domElement.addEventListener("contextmenu",this._onContextMenu),this.domElement.addEventListener("wheel",this._onMouseWheel,{passive:!1}),this.domElement.getRootNode().addEventListener("keydown",this._interceptControlDown,{passive:!0,capture:!0}),this.domElement.style.touchAction="none"}disconnect(){this.domElement.removeEventListener("pointerdown",this._onPointerDown),this.domElement.removeEventListener("pointermove",this._onPointerMove),this.domElement.removeEventListener("pointerup",this._onPointerUp),this.domElement.removeEventListener("pointercancel",this._onPointerUp),this.domElement.removeEventListener("wheel",this._onMouseWheel),this.domElement.removeEventListener("contextmenu",this._onContextMenu),this.stopListenToKeyEvents(),this.domElement.getRootNode().removeEventListener("keydown",this._interceptControlDown,{capture:!0}),this.domElement.style.touchAction="auto"}dispose(){this.disconnect()}getPolarAngle(){return this._spherical.phi}getAzimuthalAngle(){return this._spherical.theta}getDistance(){return this.object.position.distanceTo(this.target)}listenToKeyEvents(e){e.addEventListener("keydown",this._onKeyDown),this._domElementKeyEvents=e}stopListenToKeyEvents(){this._domElementKeyEvents!==null&&(this._domElementKeyEvents.removeEventListener("keydown",this._onKeyDown),this._domElementKeyEvents=null)}saveState(){this.target0.copy(this.target),this.position0.copy(this.object.position),this.zoom0=this.object.zoom}reset(){this.target.copy(this.target0),this.object.position.copy(this.position0),this.object.zoom=this.zoom0,this.object.updateProjectionMatrix(),this.dispatchEvent(_h),this.update(),this.state=ut.NONE}update(e=null){const t=this.object.position;Tt.copy(t).sub(this.target),Tt.applyQuaternion(this._quat),this._spherical.setFromVector3(Tt),this.autoRotate&&this.state===ut.NONE&&this._rotateLeft(this._getAutoRotationAngle(e)),this.enableDamping?(this._spherical.theta+=this._sphericalDelta.theta*this.dampingFactor,this._spherical.phi+=this._sphericalDelta.phi*this.dampingFactor):(this._spherical.theta+=this._sphericalDelta.theta,this._spherical.phi+=this._sphericalDelta.phi);let i=this.minAzimuthAngle,s=this.maxAzimuthAngle;isFinite(i)&&isFinite(s)&&(i<-Math.PI?i+=jt:i>Math.PI&&(i-=jt),s<-Math.PI?s+=jt:s>Math.PI&&(s-=jt),i<=s?this._spherical.theta=Math.max(i,Math.min(s,this._spherical.theta)):this._spherical.theta=this._spherical.theta>(i+s)/2?Math.max(i,this._spherical.theta):Math.min(s,this._spherical.theta)),this._spherical.phi=Math.max(this.minPolarAngle,Math.min(this.maxPolarAngle,this._spherical.phi)),this._spherical.makeSafe(),this.enableDamping===!0?this.target.addScaledVector(this._panOffset,this.dampingFactor):this.target.add(this._panOffset),this.target.sub(this.cursor),this.target.clampLength(this.minTargetRadius,this.maxTargetRadius),this.target.add(this.cursor);let r=!1;if(this.zoomToCursor&&this._performCursorZoom||this.object.isOrthographicCamera)this._spherical.radius=this._clampDistance(this._spherical.radius);else{const o=this._spherical.radius;this._spherical.radius=this._clampDistance(this._spherical.radius*this._scale),r=o!=this._spherical.radius}if(Tt.setFromSpherical(this._spherical),Tt.applyQuaternion(this._quatInverse),t.copy(this.target).add(Tt),this.object.lookAt(this.target),this.enableDamping===!0?(this._sphericalDelta.theta*=1-this.dampingFactor,this._sphericalDelta.phi*=1-this.dampingFactor,this._panOffset.multiplyScalar(1-this.dampingFactor)):(this._sphericalDelta.set(0,0,0),this._panOffset.set(0,0,0)),this.zoomToCursor&&this._performCursorZoom){let o=null;if(this.object.isPerspectiveCamera){const a=Tt.length();o=this._clampDistance(a*this._scale);const l=a-o;this.object.position.addScaledVector(this._dollyDirection,l),this.object.updateMatrixWorld(),r=!!l}else if(this.object.isOrthographicCamera){const a=new F(this._mouse.x,this._mouse.y,0);a.unproject(this.object);const l=this.object.zoom;this.object.zoom=Math.max(this.minZoom,Math.min(this.maxZoom,this.object.zoom/this._scale)),this.object.updateProjectionMatrix(),r=l!==this.object.zoom;const c=new F(this._mouse.x,this._mouse.y,0);c.unproject(this.object),this.object.position.sub(c).add(a),this.object.updateMatrixWorld(),o=Tt.length()}else console.warn("WARNING: OrbitControls.js encountered an unknown camera type - zoom to cursor disabled."),this.zoomToCursor=!1;o!==null&&(this.screenSpacePanning?this.target.set(0,0,-1).transformDirection(this.object.matrix).multiplyScalar(o).add(this.object.position):(xo.origin.copy(this.object.position),xo.direction.set(0,0,-1).transformDirection(this.object.matrix),Math.abs(this.object.up.dot(xo.direction))<SM?this.object.lookAt(this.target):(vh.setFromNormalAndCoplanarPoint(this.object.up,this.target),xo.intersectPlane(vh,this.target))))}else if(this.object.isOrthographicCamera){const o=this.object.zoom;this.object.zoom=Math.max(this.minZoom,Math.min(this.maxZoom,this.object.zoom/this._scale)),o!==this.object.zoom&&(this.object.updateProjectionMatrix(),r=!0)}return this._scale=1,this._performCursorZoom=!1,r||this._lastPosition.distanceToSquared(this.object.position)>il||8*(1-this._lastQuaternion.dot(this.object.quaternion))>il||this._lastTargetPosition.distanceToSquared(this.target)>il?(this.dispatchEvent(_h),this._lastPosition.copy(this.object.position),this._lastQuaternion.copy(this.object.quaternion),this._lastTargetPosition.copy(this.target),!0):!1}_getAutoRotationAngle(e){return e!==null?jt/60*this.autoRotateSpeed*e:jt/60/60*this.autoRotateSpeed}_getZoomScale(e){const t=Math.abs(e*.01);return Math.pow(.95,this.zoomSpeed*t)}_rotateLeft(e){this._sphericalDelta.theta-=e}_rotateUp(e){this._sphericalDelta.phi-=e}_panLeft(e,t){Tt.setFromMatrixColumn(t,0),Tt.multiplyScalar(-e),this._panOffset.add(Tt)}_panUp(e,t){this.screenSpacePanning===!0?Tt.setFromMatrixColumn(t,1):(Tt.setFromMatrixColumn(t,0),Tt.crossVectors(this.object.up,Tt)),Tt.multiplyScalar(e),this._panOffset.add(Tt)}_pan(e,t){const i=this.domElement;if(this.object.isPerspectiveCamera){const s=this.object.position;Tt.copy(s).sub(this.target);let r=Tt.length();r*=Math.tan(this.object.fov/2*Math.PI/180),this._panLeft(2*e*r/i.clientHeight,this.object.matrix),this._panUp(2*t*r/i.clientHeight,this.object.matrix)}else this.object.isOrthographicCamera?(this._panLeft(e*(this.object.right-this.object.left)/this.object.zoom/i.clientWidth,this.object.matrix),this._panUp(t*(this.object.top-this.object.bottom)/this.object.zoom/i.clientHeight,this.object.matrix)):(console.warn("WARNING: OrbitControls.js encountered an unknown camera type - pan disabled."),this.enablePan=!1)}_dollyOut(e){this.object.isPerspectiveCamera||this.object.isOrthographicCamera?this._scale/=e:(console.warn("WARNING: OrbitControls.js encountered an unknown camera type - dolly/zoom disabled."),this.enableZoom=!1)}_dollyIn(e){this.object.isPerspectiveCamera||this.object.isOrthographicCamera?this._scale*=e:(console.warn("WARNING: OrbitControls.js encountered an unknown camera type - dolly/zoom disabled."),this.enableZoom=!1)}_updateZoomParameters(e,t){if(!this.zoomToCursor)return;this._performCursorZoom=!0;const i=this.domElement.getBoundingClientRect(),s=e-i.left,r=t-i.top,o=i.width,a=i.height;this._mouse.x=s/o*2-1,this._mouse.y=-(r/a)*2+1,this._dollyDirection.set(this._mouse.x,this._mouse.y,1).unproject(this.object).sub(this.object.position).normalize()}_clampDistance(e){return Math.max(this.minDistance,Math.min(this.maxDistance,e))}_handleMouseDownRotate(e){this._rotateStart.set(e.clientX,e.clientY)}_handleMouseDownDolly(e){this._updateZoomParameters(e.clientX,e.clientX),this._dollyStart.set(e.clientX,e.clientY)}_handleMouseDownPan(e){this._panStart.set(e.clientX,e.clientY)}_handleMouseMoveRotate(e){this._rotateEnd.set(e.clientX,e.clientY),this._rotateDelta.subVectors(this._rotateEnd,this._rotateStart).multiplyScalar(this.rotateSpeed);const t=this.domElement;this._rotateLeft(jt*this._rotateDelta.x/t.clientHeight),this._rotateUp(jt*this._rotateDelta.y/t.clientHeight),this._rotateStart.copy(this._rotateEnd),this.update()}_handleMouseMoveDolly(e){this._dollyEnd.set(e.clientX,e.clientY),this._dollyDelta.subVectors(this._dollyEnd,this._dollyStart),this._dollyDelta.y>0?this._dollyOut(this._getZoomScale(this._dollyDelta.y)):this._dollyDelta.y<0&&this._dollyIn(this._getZoomScale(this._dollyDelta.y)),this._dollyStart.copy(this._dollyEnd),this.update()}_handleMouseMovePan(e){this._panEnd.set(e.clientX,e.clientY),this._panDelta.subVectors(this._panEnd,this._panStart).multiplyScalar(this.panSpeed),this._pan(this._panDelta.x,this._panDelta.y),this._panStart.copy(this._panEnd),this.update()}_handleMouseWheel(e){this._updateZoomParameters(e.clientX,e.clientY),e.deltaY<0?this._dollyIn(this._getZoomScale(e.deltaY)):e.deltaY>0&&this._dollyOut(this._getZoomScale(e.deltaY)),this.update()}_handleKeyDown(e){let t=!1;switch(e.code){case this.keys.UP:e.ctrlKey||e.metaKey||e.shiftKey?this.enableRotate&&this._rotateUp(jt*this.keyRotateSpeed/this.domElement.clientHeight):this.enablePan&&this._pan(0,this.keyPanSpeed),t=!0;break;case this.keys.BOTTOM:e.ctrlKey||e.metaKey||e.shiftKey?this.enableRotate&&this._rotateUp(-jt*this.keyRotateSpeed/this.domElement.clientHeight):this.enablePan&&this._pan(0,-this.keyPanSpeed),t=!0;break;case this.keys.LEFT:e.ctrlKey||e.metaKey||e.shiftKey?this.enableRotate&&this._rotateLeft(jt*this.keyRotateSpeed/this.domElement.clientHeight):this.enablePan&&this._pan(this.keyPanSpeed,0),t=!0;break;case this.keys.RIGHT:e.ctrlKey||e.metaKey||e.shiftKey?this.enableRotate&&this._rotateLeft(-jt*this.keyRotateSpeed/this.domElement.clientHeight):this.enablePan&&this._pan(-this.keyPanSpeed,0),t=!0;break}t&&(e.preventDefault(),this.update())}_handleTouchStartRotate(e){if(this._pointers.length===1)this._rotateStart.set(e.pageX,e.pageY);else{const t=this._getSecondPointerPosition(e),i=.5*(e.pageX+t.x),s=.5*(e.pageY+t.y);this._rotateStart.set(i,s)}}_handleTouchStartPan(e){if(this._pointers.length===1)this._panStart.set(e.pageX,e.pageY);else{const t=this._getSecondPointerPosition(e),i=.5*(e.pageX+t.x),s=.5*(e.pageY+t.y);this._panStart.set(i,s)}}_handleTouchStartDolly(e){const t=this._getSecondPointerPosition(e),i=e.pageX-t.x,s=e.pageY-t.y,r=Math.sqrt(i*i+s*s);this._dollyStart.set(0,r)}_handleTouchStartDollyPan(e){this.enableZoom&&this._handleTouchStartDolly(e),this.enablePan&&this._handleTouchStartPan(e)}_handleTouchStartDollyRotate(e){this.enableZoom&&this._handleTouchStartDolly(e),this.enableRotate&&this._handleTouchStartRotate(e)}_handleTouchMoveRotate(e){if(this._pointers.length==1)this._rotateEnd.set(e.pageX,e.pageY);else{const i=this._getSecondPointerPosition(e),s=.5*(e.pageX+i.x),r=.5*(e.pageY+i.y);this._rotateEnd.set(s,r)}this._rotateDelta.subVectors(this._rotateEnd,this._rotateStart).multiplyScalar(this.rotateSpeed);const t=this.domElement;this._rotateLeft(jt*this._rotateDelta.x/t.clientHeight),this._rotateUp(jt*this._rotateDelta.y/t.clientHeight),this._rotateStart.copy(this._rotateEnd)}_handleTouchMovePan(e){if(this._pointers.length===1)this._panEnd.set(e.pageX,e.pageY);else{const t=this._getSecondPointerPosition(e),i=.5*(e.pageX+t.x),s=.5*(e.pageY+t.y);this._panEnd.set(i,s)}this._panDelta.subVectors(this._panEnd,this._panStart).multiplyScalar(this.panSpeed),this._pan(this._panDelta.x,this._panDelta.y),this._panStart.copy(this._panEnd)}_handleTouchMoveDolly(e){const t=this._getSecondPointerPosition(e),i=e.pageX-t.x,s=e.pageY-t.y,r=Math.sqrt(i*i+s*s);this._dollyEnd.set(0,r),this._dollyDelta.set(0,Math.pow(this._dollyEnd.y/this._dollyStart.y,this.zoomSpeed)),this._dollyOut(this._dollyDelta.y),this._dollyStart.copy(this._dollyEnd);const o=(e.pageX+t.x)*.5,a=(e.pageY+t.y)*.5;this._updateZoomParameters(o,a)}_handleTouchMoveDollyPan(e){this.enableZoom&&this._handleTouchMoveDolly(e),this.enablePan&&this._handleTouchMovePan(e)}_handleTouchMoveDollyRotate(e){this.enableZoom&&this._handleTouchMoveDolly(e),this.enableRotate&&this._handleTouchMoveRotate(e)}_addPointer(e){this._pointers.push(e.pointerId)}_removePointer(e){delete this._pointerPositions[e.pointerId];for(let t=0;t<this._pointers.length;t++)if(this._pointers[t]==e.pointerId){this._pointers.splice(t,1);return}}_isTrackingPointer(e){for(let t=0;t<this._pointers.length;t++)if(this._pointers[t]==e.pointerId)return!0;return!1}_trackPointer(e){let t=this._pointerPositions[e.pointerId];t===void 0&&(t=new Ve,this._pointerPositions[e.pointerId]=t),t.set(e.pageX,e.pageY)}_getSecondPointerPosition(e){const t=e.pointerId===this._pointers[0]?this._pointers[1]:this._pointers[0];return this._pointerPositions[t]}_customWheelEvent(e){const t=e.deltaMode,i={clientX:e.clientX,clientY:e.clientY,deltaY:e.deltaY};switch(t){case 1:i.deltaY*=16;break;case 2:i.deltaY*=100;break}return e.ctrlKey&&!this._controlActive&&(i.deltaY*=10),i}}function MM(n){this.enabled!==!1&&(this._pointers.length===0&&(this.domElement.setPointerCapture(n.pointerId),this.domElement.addEventListener("pointermove",this._onPointerMove),this.domElement.addEventListener("pointerup",this._onPointerUp)),!this._isTrackingPointer(n)&&(this._addPointer(n),n.pointerType==="touch"?this._onTouchStart(n):this._onMouseDown(n)))}function wM(n){this.enabled!==!1&&(n.pointerType==="touch"?this._onTouchMove(n):this._onMouseMove(n))}function bM(n){switch(this._removePointer(n),this._pointers.length){case 0:this.domElement.releasePointerCapture(n.pointerId),this.domElement.removeEventListener("pointermove",this._onPointerMove),this.domElement.removeEventListener("pointerup",this._onPointerUp),this.dispatchEvent(vp),this.state=ut.NONE;break;case 1:const e=this._pointers[0],t=this._pointerPositions[e];this._onTouchStart({pointerId:e,pageX:t.x,pageY:t.y});break}}function EM(n){let e;switch(n.button){case 0:e=this.mouseButtons.LEFT;break;case 1:e=this.mouseButtons.MIDDLE;break;case 2:e=this.mouseButtons.RIGHT;break;default:e=-1}switch(e){case bs.DOLLY:if(this.enableZoom===!1)return;this._handleMouseDownDolly(n),this.state=ut.DOLLY;break;case bs.ROTATE:if(n.ctrlKey||n.metaKey||n.shiftKey){if(this.enablePan===!1)return;this._handleMouseDownPan(n),this.state=ut.PAN}else{if(this.enableRotate===!1)return;this._handleMouseDownRotate(n),this.state=ut.ROTATE}break;case bs.PAN:if(n.ctrlKey||n.metaKey||n.shiftKey){if(this.enableRotate===!1)return;this._handleMouseDownRotate(n),this.state=ut.ROTATE}else{if(this.enablePan===!1)return;this._handleMouseDownPan(n),this.state=ut.PAN}break;default:this.state=ut.NONE}this.state!==ut.NONE&&this.dispatchEvent(lu)}function TM(n){switch(this.state){case ut.ROTATE:if(this.enableRotate===!1)return;this._handleMouseMoveRotate(n);break;case ut.DOLLY:if(this.enableZoom===!1)return;this._handleMouseMoveDolly(n);break;case ut.PAN:if(this.enablePan===!1)return;this._handleMouseMovePan(n);break}}function AM(n){this.enabled===!1||this.enableZoom===!1||this.state!==ut.NONE||(n.preventDefault(),this.dispatchEvent(lu),this._handleMouseWheel(this._customWheelEvent(n)),this.dispatchEvent(vp))}function RM(n){this.enabled!==!1&&this._handleKeyDown(n)}function CM(n){switch(this._trackPointer(n),this._pointers.length){case 1:switch(this.touches.ONE){case Ss.ROTATE:if(this.enableRotate===!1)return;this._handleTouchStartRotate(n),this.state=ut.TOUCH_ROTATE;break;case Ss.PAN:if(this.enablePan===!1)return;this._handleTouchStartPan(n),this.state=ut.TOUCH_PAN;break;default:this.state=ut.NONE}break;case 2:switch(this.touches.TWO){case Ss.DOLLY_PAN:if(this.enableZoom===!1&&this.enablePan===!1)return;this._handleTouchStartDollyPan(n),this.state=ut.TOUCH_DOLLY_PAN;break;case Ss.DOLLY_ROTATE:if(this.enableZoom===!1&&this.enableRotate===!1)return;this._handleTouchStartDollyRotate(n),this.state=ut.TOUCH_DOLLY_ROTATE;break;default:this.state=ut.NONE}break;default:this.state=ut.NONE}this.state!==ut.NONE&&this.dispatchEvent(lu)}function PM(n){switch(this._trackPointer(n),this.state){case ut.TOUCH_ROTATE:if(this.enableRotate===!1)return;this._handleTouchMoveRotate(n),this.update();break;case ut.TOUCH_PAN:if(this.enablePan===!1)return;this._handleTouchMovePan(n),this.update();break;case ut.TOUCH_DOLLY_PAN:if(this.enableZoom===!1&&this.enablePan===!1)return;this._handleTouchMoveDollyPan(n),this.update();break;case ut.TOUCH_DOLLY_ROTATE:if(this.enableZoom===!1&&this.enableRotate===!1)return;this._handleTouchMoveDollyRotate(n),this.update();break;default:this.state=ut.NONE}}function LM(n){this.enabled!==!1&&n.preventDefault()}function DM(n){n.key==="Control"&&(this._controlActive=!0,this.domElement.getRootNode().addEventListener("keyup",this._interceptControlUp,{passive:!0,capture:!0}))}function IM(n){n.key==="Control"&&(this._controlActive=!1,this.domElement.getRootNode().removeEventListener("keyup",this._interceptControlUp,{passive:!0,capture:!0}))}function cu(){const n=v.sim_size,e=new np;e.background=new Pe(1315860);const t=new ap(16777215,.7);t.position.set(1,1,2),e.add(t),e.add(new lp(16777215,.4)),v.scene=e;let i=v.renderer;i||(i=new WS({antialias:!0}),document.body.appendChild(i.domElement),v.renderer=i,window.addEventListener("resize",()=>{r.aspect=window.innerWidth/window.innerHeight,r.updateProjectionMatrix(),i.setSize(window.innerWidth,window.innerHeight)})),i.setSize(window.innerWidth,window.innerHeight);const s=i.domElement;s.style.position="absolute",s.style.top="0px",s.style.left="0px",s.style.zIndex="0";const r=new sn(75,window.innerWidth/window.innerHeight,.1,1e3);r.position.set(n*1.2,n*1.2,n*1.2);const o=new xp(r,i.domElement);v.camera=r,v.controls=o}function UM(){return new Worker(new URL("/assets/run.worker-CrG8UKfX.js",import.meta.url),{type:"module"})}class la{constructor({onStats:e,onState:t,onReplayed:i,onError:s,createWorker:r=UM}={}){this.onStats=e??(()=>{}),this.onState=t??(()=>{}),this.onReplayed=i??(()=>{}),this.onError=s??(()=>{}),this.createWorker=r,this.worker=null,this.pending=new Map,this.nextId=1}start({world:e,seed:t,run:i,generations:s,from:r}){this.close();const o=this.createWorker();o.onmessage=l=>this.receive(l.data),o.onerror=l=>this.onError(l?.message??"The engine Worker failed."),this.worker=o;const a={type:"start",world:e,seed:t,run:i};s!==void 0&&(a.generations=s),r!==void 0&&(a.from=r),o.postMessage(a,t?.buffer?[t.buffer]:[])}pause(){this.send({type:"pause"})}resume(){this.send({type:"resume"})}step(){this.send({type:"step"})}setRate(e){this.send({type:"rate",rate:e})}stop(){this.send({type:"stop"})}seek(e){if(!this.worker)return Promise.reject(new Error("There is no run."));const t=this.nextId++;return new Promise((i,s)=>{this.pending.set(t,{resolve:i,reject:s}),this.send({type:"seek",id:t,generation:e})})}snapshot({budget:e,slice:t,stats:i}={}){if(!this.worker)return Promise.reject(new Error("There is no run to snapshot."));const s=this.nextId++;return new Promise((r,o)=>{this.pending.set(s,{resolve:r,reject:o});const a={type:"snapshot",id:s};e!==void 0&&(a.budget=e),t&&(a.slice=t),i&&(a.stats=!0),this.send(a)})}cycle({budget:e}={}){if(!this.worker)return Promise.reject(new Error("There is no run."));const t=this.nextId++;return new Promise((i,s)=>{this.pending.set(t,{resolve:i,reject:s}),this.send({type:"cycle",id:t,budget:e})})}history(){if(!this.worker)return Promise.reject(new Error("There is no run."));const e=this.nextId++;return new Promise((t,i)=>{this.pending.set(e,{resolve:t,reject:i}),this.send({type:"history",id:e})})}result({run:e,score:t,details:i}){if(!this.worker)return Promise.reject(new Error("There is no run."));const s=this.nextId++;return new Promise((r,o)=>{this.pending.set(s,{resolve:r,reject:o});const a={type:"result",id:s,run:e};t!==void 0&&(a.score=t),i!==void 0&&(a.details=i),this.send(a)})}close(){if(this.worker){this.worker.terminate(),this.worker=null;for(const{reject:e}of this.pending.values())e(new Error("The run was closed."));this.pending.clear()}}send(e){if(!this.worker){this.onError("There is no run.");return}this.worker.postMessage(e)}receive(e){switch(e.type){case"stats":return this.onStats(e.stats);case"state":return this.onState(e.state,e.stats,e.reason,e.cycle,e.departures);case"result":return this.settle(e.id,t=>t.resolve(e.result));case"seeked":return this.settle(e.id,t=>t.resolve(e.superseded?{generation:e.generation,superseded:!0}:{generation:e.generation}));case"replayed":{const{type:t,...i}=e;return this.onReplayed(i)}case"cycle":case"history":case"snapshot":return this.settle(e.id,t=>{const{type:i,id:s,...r}=e;t.resolve(r)});case"error":return e.id!==void 0&&this.pending.has(e.id)?this.settle(e.id,t=>t.reject(new Error(e.message))):this.onError(e.message)}}settle(e,t){const i=this.pending.get(e);i&&(this.pending.delete(e),t(i))}}const NM=1.25,xh=30;function FM(n,e,t){if(!n)return{centre:[0,0,0],radius:0,distance:xh};const i=[0,1,2].map(u=>(n.min[u]+n.max[u])/2),s=[0,1,2].map(u=>(n.max[u]-n.min[u])/2+.5),r=Math.hypot(...s),o=e*Math.PI/360,a=Math.atan(Math.tan(o)*t),l=Math.min(o,a),c=Math.max(xh,NM*r/Math.sin(l));return{centre:i,radius:r,distance:c}}function yo(n,e,t,i=250){return e+(n-e)*.5**(t/i)}const Os=3e5,oi=[0,180/255,200/255],So=[200/255,20/255,0];class yp{constructor(e){this.group=new mi,e.add(this.group),this.material=new Rr({size:1.2,vertexColors:!0,sizeAttenuation:!0}),this.points=new su(new Ft,this.material),this.points.frustumCulled=!1,this.capacity=0,this.grow(0),this.group.add(this.points),this.boxGeometry=new rn(1,1,1),this.boxMaterial=new sa({transparent:!0,opacity:.45,depthWrite:!1}),this.boxes=null,this.arena=null,this.grid=null,this.gridKey=null,this.box=null,this.drawing="cells"}show(e){e.cells?this.drawCells(e.cells):this.drawChunks(e.chunks,e.chunkSize)}drawCells(e){const t=e.length/3;this.drawing="cells",this.box=yh(e,3),t>this.capacity&&this.grow(t);const i=this.points.geometry,s=i.attributes.position.array,r=i.attributes.color.array,{min:o,max:a}=this.box??{min:[0,0,0],max:[0,0,0]},l=Math.max(1,a[0]-o[0]),c=Math.max(1,a[2]-o[2]);for(let u=0;u<e.length;u+=3){const d=e[u],h=e[u+1],p=e[u+2];s[u]=d,s[u+1]=h,s[u+2]=p;const g=(d-o[0])/l,_=.45*((p-o[2])/c);for(let m=0;m<3;m++){const f=oi[m]+(So[m]-oi[m])*g;r[u+m]=f+(1-f)*_}}i.setDrawRange(0,t),i.attributes.position.needsUpdate=!0,i.attributes.color.needsUpdate=!0,this.points.visible=!0,this.boxes&&(this.boxes.visible=!1)}drawChunks(e,t){const i=e.length/4;this.drawing="chunks";const s=yh(e,4);this.box=s&&{min:s.min,max:s.max.map(d=>d+t-1)},(!this.boxes||this.boxes.instanceMatrix.count<i)&&this.growBoxes(i);const r=new rt,o=new Pe,a=t*t*t,{min:l,max:c}=this.box??{min:[0,0,0],max:[0,0,0]},u=Math.max(1,c[0]-l[0]);for(let d=0,h=0;d<e.length;d+=4,h++){const p=e[d],g=e[d+1],_=e[d+2];r.makeScale(t,t,t).setPosition(p+(t-1)/2,g+(t-1)/2,_+(t-1)/2),this.boxes.setMatrixAt(h,r);const m=(p-l[0])/u,f=Math.min(1,e[d+3]/a),M=.35+.65*Math.sqrt(f);o.setRGB((oi[0]+(So[0]-oi[0])*m)*M,(oi[1]+(So[1]-oi[1])*m)*M,(oi[2]+(So[2]-oi[2])*m)*M),this.boxes.setColorAt(h,o)}this.boxes.count=i,this.boxes.instanceMatrix.needsUpdate=!0,this.boxes.instanceColor&&(this.boxes.instanceColor.needsUpdate=!0),this.boxes.visible=!0,this.points.visible=!1}showArena(e,{wrap:t=!1,walls:i=!1}={}){if(this.arena&&(this.group.remove(this.arena),this.arena.geometry.dispose(),this.arena.material.dispose(),this.arena=null),!e)return;const s=[0,1,2].map(l=>e.max[l]-e.min[l]+1),r=new ra(new rn(...s)),o=Math.max(...s)/32,a=t?new i0({color:16777215,transparent:!0,opacity:.45,dashSize:o,gapSize:o}):new Jn({color:16777215,transparent:!0,opacity:i?.8:.35});this.arena=new Xi(r,a),t&&this.arena.computeLineDistances(),this.arena.position.set(...[0,1,2].map(l=>(e.min[l]+e.max[l])/2)),this.group.add(this.arena)}showGrid(e,t,i){const s=t&&t.min.map(h=>Math.floor(h/i)*i-.5),r=t&&t.max.map(h=>(Math.floor(h/i)+1)*i-.5),o=e&&t?`${s},${r}`:null;if(o===this.gridKey||(this.gridKey=o,this.grid&&(this.group.remove(this.grid),this.grid.geometry.dispose(),this.grid.material.dispose(),this.grid=null),!o))return;const a=[],l=(h,p)=>a.push(...h,...p);for(const h of[s[1],r[1]]){for(const p of[s[2],r[2]])l([s[0],h,p],[r[0],h,p]);for(const p of[s[0],r[0]])l([p,h,s[2]],[p,h,r[2]])}for(const h of[s[0],r[0]])for(const p of[s[2],r[2]])l([h,s[1],p],[h,r[1],p]);let c=i;for(;(r[0]-s[0])/c>200||(r[2]-s[2])/c>200;)c*=2;for(let h=s[0]+c;h<r[0];h+=c)l([h,s[1],s[2]],[h,s[1],r[2]]);for(let h=s[2]+c;h<r[2];h+=c)l([s[0],s[1],h],[r[0],s[1],h]);const u=new Ft;u.setAttribute("position",new an(a,3));const d=new Jn({color:16777215,transparent:!0,opacity:.25});this.grid=new Xi(u,d),this.grid.frustumCulled=!1,this.group.add(this.grid)}frame({camera:e,controls:t,elapsedMs:i,follow:s,cellSize:r,flip:o}){if(this.material.size=r,this.group.scale.y=o?-1:1,!s||!e||!t)return;const{centre:a,radius:l,distance:c}=FM(this.box,e.fov,e.aspect);o&&(a[1]=-a[1]);const u=t.target,d=e.position.clone().sub(u),h=d.length()||1;u.set(yo(u.x,a[0],i),yo(u.y,a[1],i),yo(u.z,a[2],i));const p=yo(h,c,i);e.position.copy(u).add(d.multiplyScalar(p/h)),e.lookAt(u);const g=Math.max(1e3,4*(p+l));Math.abs(e.far-g)>.1*g&&(e.far=g,e.updateProjectionMatrix())}dispose(){this.points.geometry.dispose(),this.material.dispose(),this.boxGeometry.dispose(),this.boxMaterial.dispose(),this.boxes?.dispose(),this.showArena(null),this.showGrid(!1,null,1),this.group.removeFromParent()}grow(e){this.capacity=Math.max(e,2*this.capacity,4096);const t=new Ft;t.setAttribute("position",new Ut(new Float32Array(3*this.capacity),3)),t.setAttribute("color",new Ut(new Float32Array(3*this.capacity),3)),this.points.geometry.dispose(),this.points.geometry=t}growBoxes(e){const t=Math.max(e,2*(this.boxes?.instanceMatrix.count??0),256);this.boxes&&(this.group.remove(this.boxes),this.boxes.dispose()),this.boxes=new ip(this.boxGeometry,this.boxMaterial,t),this.boxes.frustumCulled=!1,this.group.add(this.boxes)}}function yh(n,e){if(!n.length)return null;const t=[1/0,1/0,1/0],i=[-1/0,-1/0,-1/0];for(let s=0;s<n.length;s+=e)for(let r=0;r<3;r++){const o=n[s+r];o<t[r]&&(t[r]=o),o>i[r]&&(i[r]=o)}return{min:t,max:i}}const Sp="game-of-life-3d-seed.json",OM="game-of-life-3d-simulation.json";function BM(n){return`game-of-life-3d-generation-${n}.json`}function kM(n){const e=n.seed??n.cells,t=new Array(e.length/3);for(let i=0;i<t.length;i++)t[i]=[e[3*i],e[3*i+1],e[3*i+2]];return{contest:null,rules:n.rules,seed:t,arena:wr(n.arena),limits:{cells:null,extent:null,generations:null}}}function zM(n,e){return n==="ended"&&Bo.includes(e)?e:"stopped"}function GM(n){return n?`${n===1?"A ship has":`${n.toLocaleString("en")} ships have`} left the arena by this generation, and a saved generation can't record that ships leave at the edge, so its replay wouldn't reach it. Restart and save before the first one leaves; Save simulation still saves the seed and its rules.`:null}const HM="This run's arena wraps around, and a saved generation can't record that, so its replay wouldn't reach this generation: no contest wraps. Save simulation still saves the seed and its rules.",VM="This run's arena has walls, with their own corner, edge and face rules, and a saved generation can't record them, so its replay wouldn't reach this generation: no contest has walls. Save simulation still saves the seed and its rules.";async function $M({config:n,generation:e,cells:t,ending:i,stats:s=null,chunkSize:r=null,browser:o=null}){const a=t.length/3;if(a>Un)throw new qe(`Generation ${e.toLocaleString("en")} has ${a.toLocaleString("en")} live cells; a saved generation holds at most ${Un.toLocaleString("en")}.`);const l=await $m({run:kM(n),generation:e,cells:t,ending:i,details:{chunkSize:r,elapsedMs:s?.elapsedMs??null,stats:qM(s),browser:o},withCells:!0});return{result:l,text:Nc(l)}}function WM(n){return zc({cells:n.seed??n.cells})}function XM(n){return zc({rules:n.rules,cells:n.seed??n.cells})}async function YM(n){let e;try{e=Fc(n)}catch(r){throw r instanceof Ne?new qe(r.message):r}if(!e.cells)throw new qe("This result file doesn't hold its generation's cells, so Game of Life 3D (unbounded) can't start from it. Files from Save this generation do.");const t=await Wm(e);if(t)throw new qe(t);const{run:i}=e;if(i.limits.cells!==null||i.limits.extent!==null||i.limits.generations!==null)throw new qe("This run has cell, extent or generation limits, which Game of Life 3D (unbounded) doesn't keep, so it can't carry on here.");let s=null;if(i.arena){s=i.arena.max[0]-i.arena.min[0]+1;const r=wr(s);if(![0,1,2].every(a=>i.arena.min[a]===r.min[a]&&i.arena.max[a]===r.max[a]))throw new qe("This run's arena isn't a cube centred on the origin, the only arena Game of Life 3D (unbounded) has.")}if(e.cells.length/3>Un)throw new qe(`This generation has more than ${Un.toLocaleString("en")} live cells, the most Game of Life 3D (unbounded) loads.`);return{rules:i.rules,cells:Int32Array.from(e.cells.flat()),seed:Int32Array.from(i.seed.flat()),from:e.generation,arena:s,hash:e.hash}}async function Mp(n){return/"format"\s*:\s*"([^"]*)"/.exec(n.slice(0,4096))?.[1]===Oo?{kind:"generation",...await YM(n)}:{kind:"seed",...vf(n)}}function qM(n){if(!n)return n;const{departed:e,lastDeparture:t,...i}=n;return i}const le=n=>Math.round(n).toLocaleString("en");function Ji({birth:n,survival:e}){return`B${Sh(n)||"–"}/S${Sh(e)||"–"}`}function Sh(n){const e=[];for(let t=0;t<n.length;){let i=t;for(;i+1<n.length&&n[i+1]===n[i]+1;)i++;e.push(i>t?`${n[t]}-${n[i]}`:String(n[t])),t=i+1}return e.join(",")}function wp(n,e){const t=Math.min(n,Math.max(0,n-e/1e3));return(Math.floor(t*10)/10).toFixed(1)}function Mh(n){if(!(n>0))return{top:5,step:1};const e=n/5,t=10**Math.floor(Math.log10(e));let i=t;for(const s of[1,2,5,10])if(i=s*t,i*5>=n)break;return i=Math.max(1,i),{top:Math.ceil(n/i)*i,step:i}}const jM=Object.freeze({top:14,right:48,bottom:42,left:60});function KM(n,{seconds:e,width:t,height:i}){const s=jM,r={left:s.left,top:s.top,right:t-s.right,bottom:i-s.bottom},o=r.right-r.left,a=r.bottom-r.top,{top:l,step:c}=Mh(Math.max(0,...n.map(([,M])=>M))),u=e!==void 0?{top:e,step:1}:Mh(Math.max(0,...n.map(([M])=>M))),d=M=>r.left+Math.min(Math.max(M,0),u.top)/u.top*o,h=M=>r.bottom-M/l*a,p=M=>+M.toFixed(1),g=[];for(let M=0;M<=u.top;M+=u.step)g.push({value:M,label:le(M),at:p(d(M))});const _=[];for(let M=0;M<=l;M+=c)_.push({value:M,label:le(M),at:p(h(M))});const m=n.map(([M,b])=>[p(d(M)),p(h(b))]),f=m[m.length-1];return{plot:r,xTicks:g,yTicks:_,line:m.map(([M,b])=>`${M},${b}`).join(" "),area:m.length?`M${m[0][0]},${r.bottom} ${m.map(([M,b])=>`L${M},${b}`).join(" ")} L${f[0]},${r.bottom} Z`:"",end:f?{x:f[0],y:f[1],label:le(n[n.length-1][1])}:null,nearest(M){let b=-1,E=1/0;return m.forEach(([L],T)=>{const A=Math.abs(L-M);A<=E&&(b=T,E=A)}),b<0?null:{index:b,x:m[b][0],y:m[b][1],at:n[b][0],value:n[b][1]}}}}function bp(n){return`${(n/1e3).toFixed(3)} s`}function uu(n){const e=`${le(n.generations)} generation${n.generations===1?"":"s"}`;return n.ms===null?e:`${e} in ${bp(n.ms)}`}function ZM(n,e){const t=`generation ${le(n.generations)}`;return e==="died"?`died at ${t}`:n.period!==1?`settled at ${t}: period ${le(n.period)}`:e==="repeat"?`settled at ${t}: a still life`:`settled at ${t}`}function Cr(n,e,t){return n.kind==="speed"?uu(e):n.kind==="methuselah"?ZM(e,t):JSON.stringify(e)}const JM=n=>`${n[0].toUpperCase()}${n.slice(1)}`;function QM(n,e){const t=n.generations===1?"generation":"generations";if(e==="died")return{value:le(n.generations),unit:`${t}, until every cell had died`};const i=n.period===1?"a still life":`a cycle of period ${le(n.period)}`;return{value:le(n.generations),unit:`${t}, until it settled into ${i}`}}function ew(n,e){const t=n.generations===1?"generation":"generations";return n.ms===null?{value:le(n.generations),unit:`${t} in ${e.seconds} seconds`}:{value:(n.ms/1e3).toFixed(3),unit:`seconds to reach the ceiling of ${le(n.generations)} ${t}`}}function tw(n,e,t={}){if(n.kind==="methuselah"){const i=[e.period===1?null:`period ${le(e.period)}`,t.rules?Ji(t.rules):null,t.seedCells?`${le(t.seedCells)} seed cell${t.seedCells===1?"":"s"}`:null].filter(Boolean).join(" · ");return{main:`${le(e.generations)} generation${e.generations===1?"":"s"}`,detail:i}}return n.kind!=="speed"?{main:JSON.stringify(e),detail:""}:e.ms===null?{main:uu(e),detail:`in ${n.seconds} seconds`}:{main:bp(e.ms),detail:`${le(e.generations)} generations, the ceiling`}}function Ep(n){switch(n){case"stopped":return"Stopped by hand, so it has no score.";case"memory-limit":return"Stopped at the engine's memory limit, so it has no score.";case"out-of-memory":return"Stopped: the browser refused the engine more memory, so it has no score.";case"error":return"Stopped by an error in the engine, so it has no score.";default:return`Ended (${n}), so it has no score.`}}function nw(n,e){switch(n){case"deadline":return`The ${e.seconds} seconds ran out.`;case"generation-limit":return`It reached the ceiling, generation ${le(e.ceiling)}, before the ${e.seconds} seconds ran out, so its time counts too.`;default:return Ep(n)}}function ac(n){const e=n.max.map((t,i)=>t-n.min[i]+1);return e.every(t=>t===e[0])?`${le(e[0])}³`:e.map(le).join(" × ")}function iw(n,e,{stats:t,cycle:i}){const s=`generation ${le(t.generation)}`,r=le(e.budget);switch(n){case"died":return`Died at ${s}: no live cells remain. The empty world is a still life, so a death scores the generation the last cell died.`;case"repeat":return i?.period>1?`Settled at ${s}: period ${le(i.period)}. From there its cells repeat every ${le(i.period)} generations, in place, so it scores where the cycle began.`:`Settled at ${s}: a still life. From there its cells stay the same, in place.`;case"emits":return`Emits from ${s}: its cells repeat every ${le(i?.period??1)} generation${i?.period===1?"":"s"}, but ships leave the arena during each cycle, so it never settles and has no score. A pattern scores once its last ship has left and the rest has settled.`;case"arena-edge":return e.departures?`Reached the edge at ${s}: the next generation would bring a cell to life outside the ${ac(e.fixes.arena)} arena from something that isn't a ship of period ${le(e.departures.period)} or less heading out, so it has no score. Only ships leave: a pattern that keeps growing, or a ship sliding along a wall, ends here.`:`Reached the edge at ${s}: the next generation would bring a cell to life outside the ${ac(e.fixes.arena)} arena, so it has no score. Only a pattern that settles in place inside the arena scores, and one that keeps growing, or sends something flying off, ends here.`;case"generation-limit":return t.live===0?`It died at generation ${r}, the budget's last, so it has no score: a death is a cycle of period 1, which closes a generation later, past the budget.`:`Still unsettled at generation ${r}, the budget, so it has no score.`;default:return Ep(n)}}function du(n){if(!n.length)return"No ship left the arena";const e=`${le(n.length)} ship${n.length===1?"":"s"} left`,t=[...new Set(n.map(s=>s.generation))];if(t.length===1)return`${e}, at generation ${le(t[0])}`;if(t.length>5)return`${e}, from generation ${le(t[0])} to generation ${le(t.at(-1))}`;const i=t.map(le);return`${e}, at generations ${i.slice(0,-1).join(", ")} and ${i.at(-1)}`}function hu(n,{short:e=!1}={}){const t=n.map(c=>c.closes).filter(Boolean).sort((c,u)=>sl(c)-sl(u));if(!t.length)return e?"Closes TBD":"Closing date to be announced";const i=t[0],s=i.includes("T"),r=s?"America/Chicago":"UTC",o=sl(i),a=o.toLocaleDateString("en-GB",{day:"numeric",month:e?"short":"long",year:"numeric",timeZone:r});if(e||!s)return e?`Closes ${a}`:`Entries close ${a}`;const l=o.toLocaleTimeString("en-US",{hour:"numeric",minute:"2-digit",timeZone:r});return`Entries close ${a}, ${l} Central Time`}function sl(n){if(n.includes("T"))return new Date(n);const[e,t,i]=n.split("-").map(Number);return new Date(Date.UTC(e,t-1,i))}function Tp(n,e){return e.ms===null||e.ms===void 0?`${n.id}-${e.generations}.json`:`${n.id}-${e.generations}-${e.ms}ms.json`}function sw(n){return n>=1024*1024?`${le(n/(1024*1024))} MB`:`${le(n/1024)} KB`}function rw(n){return n?n.max.map((e,t)=>le(e-n.min[t]+1)).join(" × "):"–"}function ow(n,e){return`${le(n)} / ${le(e)}`}function Bs(n){return[["Generation",le(n.generation)],["Generations/s",le(n.rate)],["Live cells",le(n.live)],["Peak live cells",le(n.livePeak)],["Chunks",le(n.chunks)],["Memory",sw(n.memoryBytes)],["Extent",rw(n.extent)],...n.departed===void 0?[]:[["Ships left",le(n.departed)]]]}function aw(n){return{verified:"Verified",mismatch:"Doesn't match",refused:"Not a result file","not-checked":"Not checked",error:"The check failed"}[n]??n}function lw(n,e){return`${le(n)} / ${le(e)}`}function lc(n){return n.map((e,t)=>e>0?`+${"xyz"[t]}`:e<0?`−${"xyz"[t]}`:null).filter(Boolean).join(" ")}function cw(n,e){const t=n.length;if(!t)return"No ship leaves in this run.";const i=`${le(t)} ship${t===1?"":"s"}`,s=n.filter(a=>a.generation<e);if(!s.length)return`${i} leave${t===1?"s":""} in this run, the first at generation ${le(n[0].generation)}.`;const r=s.at(-1),o=`generation ${le(r.generation)}, heading ${lc(r.shift)}`;return s.length===t?t===1?`The ship has left, at ${o}.`:`All ${i} have left, the last at ${o}.`:`${le(s.length)} of ${i} ${s.length===1?"has":"have"} left, the last at ${o}.`}const uw={"cell-limit":"it passed the run's cell limit","extent-limit":"it grew wider than the run's extent limit","coordinate-limit":"it reached the edge of the space the engine can hold","arena-edge":"it reached the edge of the run's arena","memory-limit":"it reached Watch's memory limit","out-of-memory":"the browser refused it more memory",error:"an error in the engine stopped it"};function dw(n,e){const t=`generation ${le(e)}`;if(n.matches===!0)return{verdict:"verified",text:`Self-verified: the replay's hash at ${t} matches the run's.`};if(n.hash)return{verdict:"mismatch",text:`Not verified: the replay's hash at ${t} doesn't match the run's.`};const i=uw[n.reason]??`it ended (${n.reason})`,s=`The replay stopped at generation ${le(n.generation)}, before ${t}: ${i}`;return n.matches===!1?{verdict:"mismatch",text:`Not verified. ${s}, so this isn't the run's result.`}:{verdict:"not-checked",text:`Not checked. ${s}.`}}const hw=Math.sqrt(3)/2;function fw(n,e,{unit:t=9,pad:i=4}={}){const s=(R,S)=>(R-S)*hw*t,r=(R,S,y)=>((R+y)/2-S)*t,o=e.min,a=e.max.map(R=>R+1),l=[];for(const R of[o[0],a[0]])for(const S of[o[1],a[1]])for(const y of[o[2],a[2]])l.push([R,S,y]);const c=l.map(([R,,S])=>s(R,S)),u=l.map(([R,S,y])=>r(R,S,y)),d=Math.min(...c)-i,h=Math.min(...u)-i,p=(R,S,y)=>`${+(s(R,y)-d).toFixed(1)},${+(r(R,S,y)-h).toFixed(1)}`,g=R=>R.map(S=>p(...S)).join(" "),_=new Set(n.map(R=>R.join(","))),m=([R,S,y])=>_.has(`${R+1},${S},${y}`)&&_.has(`${R},${S+1},${y}`)&&_.has(`${R},${S},${y+1}`),f=n.filter(R=>!m(R)).sort((R,S)=>R[0]+R[1]+R[2]-(S[0]+S[1]+S[2])||R[1]-S[1]||R[0]-S[0]).map(([R,S,y])=>({top:g([[R,S+1,y],[R+1,S+1,y],[R+1,S+1,y+1],[R,S+1,y+1]]),right:g([[R+1,S,y],[R+1,S+1,y],[R+1,S+1,y+1],[R+1,S,y+1]]),left:g([[R,S,y+1],[R+1,S,y+1],[R+1,S+1,y+1],[R,S+1,y+1]])})),[M,b,E]=o,[L,T,A]=a;return{width:Math.ceil(Math.max(...c)-d+i),height:Math.ceil(Math.max(...u)-h+i),cubes:f,outline:g([[M,T,E],[L,T,E],[L,b,E],[L,b,A],[M,b,A],[M,T,A]]),edges:`M${p(L,T,A)} L${p(M,T,A)} M${p(L,T,A)} L${p(L,T,E)} M${p(L,T,A)} L${p(L,b,A)}`}}const fu=100,pw=[["Microsoft Edge","Edge"],["Opera GX","Opera GX"],["Opera","Opera"],["Brave","Brave"],["Samsung Internet","Samsung Internet"],["Google Chrome","Chrome"],["Chromium","Chromium"]];async function Ap(n=globalThis.navigator){if(!n)return null;const e=n.userAgentData;if(e&&Array.isArray(e.brands)){let t=e.brands;try{const s=await e.getHighEntropyValues?.(["fullVersionList"]);Array.isArray(s?.fullVersionList)&&s.fullVersionList.length&&(t=s.fullVersionList)}catch{}const i=mw(t);if(i)return i}return gw(n.userAgent)}function mw(n){if(!Array.isArray(n))return null;for(const[e,t]of pw){const i=n.find(s=>s?.brand===e);if(i&&typeof i.version=="string"&&i.version)return{name:t,version:i.version.slice(0,fu)}}return null}function gw(n){const e=[["Edge",/Edg(?:e|A|iOS)?\/([\d.]+)/],["Opera",/OPR\/([\d.]+)/],["Samsung Internet",/SamsungBrowser\/([\d.]+)/],["Firefox",/(?:Firefox|FxiOS)\/([\d.]+)/],["Chrome",/(?:Chrome|CriOS)\/([\d.]+)/],["Safari",/Version\/([\d.]+).*Safari\//]];for(const[t,i]of e){const s=i.exec(String(n??""));if(s)return{name:t,version:s[1].slice(0,fu)}}return null}const _w='input:not([disabled]):not([type="hidden"]), select:not([disabled]), textarea:not([disabled]), button:not([disabled])',wh=8;let xn=null,bh=!1;function pu(n,e,{onClose:t,focus:i}={}){vw(),ln({restoreFocus:!1});const s=n.closest(".glass-display");s&&e.parentElement!==s&&s.append(e),xn={button:n,popover:e,onClose:t},e.classList.add("is-open"),s?.classList.add("has-popover"),n.setAttribute("aria-expanded","true"),n.classList.add("is-active"),Rp(e),((i===void 0?[...e.querySelectorAll(_w)].find(o=>o.getClientRects().length>0):i)??e).focus({preventScroll:!0})}function ln({popover:n,restoreFocus:e=!0}={}){if(!xn||n&&xn.popover!==n)return;const{button:t,popover:i,onClose:s}=xn;xn=null,i.classList.remove("is-open"),i.style.top="",i.closest(".glass-display")?.classList.remove("has-popover"),t.setAttribute("aria-expanded","false"),t.classList.remove("is-active"),s?.(),e&&!t.disabled&&t.focus({preventScroll:!0})}function ca(n){return xn?.popover===n}function Xt(){xn&&Rp(xn.popover)}function Rp(n){n.style.top="";const e=n.getBoundingClientRect(),t=e.bottom-(window.innerHeight-wh);if(t<=0)return;const i=Math.min(t,Math.max(0,e.top-wh));i>0&&(n.style.top=`${n.offsetTop-i}px`)}function vw(){if(bh)return;bh=!0,document.addEventListener("keydown",e=>{e.key==="Escape"&&xn&&(e.preventDefault(),ln())});const n=e=>xn&&!xn.popover.contains(e)&&!xn.button.contains(e);document.addEventListener("pointerdown",e=>{n(e.target)&&ln({restoreFocus:!1})}),document.addEventListener("focusin",e=>{e.target!==document.body&&n(e.target)&&ln({restoreFocus:!1})}),window.addEventListener("resize",Xt)}const xw=3e3,mu=10,yw=30,Sw=10,Mw={died:(n,e)=>`Every cell died at generation ${e.generation.toLocaleString("en")}.`,repeat:(n,e,t)=>t.period===1?`Settled at generation ${t.from.toLocaleString("en")}: a still life, which stays as it is from then on.`:`Settled at generation ${t.from.toLocaleString("en")}: from then on, the pattern repeats every ${t.period.toLocaleString("en")} generations. Its cycle keeps playing.`,"memory-limit":n=>`Stopped at the memory limit (${n.memoryMB.toLocaleString("en")} MB): the next block of memory would pass it. A higher limit, from the gear in the Limits box, lets it go further.`,"out-of-memory":()=>"Stopped: the browser refused more memory.",emits:(n,e,t)=>`Emits from generation ${t.from.toLocaleString("en")}: the pattern repeats every ${t.period.toLocaleString("en")} generations, but ships leave the arena during each cycle, so it never settles. Its cycle keeps playing.`,"arena-edge":n=>n.ships?`Stopped: the pattern reached the edge of the arena with something that isn't a ship of period ${Mf} or less heading out.`:"Stopped: the pattern reached the edge of the arena.","coordinate-limit":()=>"Stopped: the pattern reached the edge of the space the engine can hold, half a million cells from the centre.",error:()=>"Stopped by an error in the engine."},Q={driver:null,view:null,config:null,departed:0,status:"idle",wantSnapshot:!1,snapshotPending:!1,lastFrame:0,followFrom:0,extent:null,chunkSize:16,cycle:null,endReason:null,save:null},gu=["x","y","z"];function li(){return v.simulationMode==="explore"}function ww(n){_u(),v.reset(),v.autoRotateActive=!1,v.viewMode="full",v.sliceAxis="x",v.sliceIndex=null,cu();const{camera:e,controls:t}=v;e.position.set(45,35,55),t.target.set(0,0,0),t.addEventListener("start",()=>{Q.followFrom=1/0}),t.addEventListener("end",()=>{Q.followFrom=performance.now()+xw}),Q.view=new yp(v.scene),Q.config=n,Q.view.showArena(wr(n.arena),{wrap:!!n.wrap,walls:!!n.walls}),document.body.classList.add("mode-explore"),Uw(n),Pp(),document.getElementById("loading-overlay")?.classList.add("hidden")}function _u(){const n=!!Q.view;Q.driver?.close(),Q.driver=null,Q.view?.dispose(),Q.view=null,Q.status="idle",Q.wantSnapshot=!1,Q.snapshotPending=!1,document.body.classList.remove("mode-explore"),cn("explore-view-note",null),cn("explore-end-note",null),ua(),Up(),n&&bw()}function bw(){const n=document.getElementById("speed-control");n&&at("bottom-speed-value",`${Math.round(10*Number(n.value))}`),at("bottom-state-value","pause");const e=document.getElementById("playPauseIcon");e&&(e.className="play"),document.getElementById("stepButton")?.classList.remove("disabled"),at("rules-birth",gi(v.rules.birth)),at("rules-survival",gi(v.rules.survival)),at("rules-isolation",gi(v.rules.isolation)),at("rules-overcrowd",gi(v.rules.overcrowding))}function Fo(){Q.view&&(Dp(),Q.wantSnapshot=!0,Q.cycle&&(Q.cycle.redraw=!0))}async function rl(n){const e=Q.save;if(ua(),e?.kind===n)return;const{driver:t,config:i}=Q;if(!t||!i)return;const s={kind:n,driver:t,name:null,text:null,saved:!1};Q.save=s,Np(n);const r=T=>T.toLocaleString("en"),o=`B${gi(i.rules.birth)} / S${gi(i.rules.survival)}`,a=(i.seed??i.cells).length/3,l=T=>Cp()?`Save asks where to put it, as ${T}.`:`Save downloads it as ${T}, to your browser's downloads folder, or wherever your browser asks.`;if(n==="seed"||n==="simulation"){const T=i.from?`, generation 0 of the run generation ${r(i.from)} was saved from`:"",A=n==="simulation";s.name=A?OM:Sp,s.text=A?XM(i):WM(i),pn({title:A?"Save simulation":"Save seed",what:A?`A simulation file: the seed, the ${r(a)} cells this run started from${T}, and its rules, ${o}. Load it from the Simulation box, with Load simulation…, to run it from generation 0, or bring it to a contest with Load simulation… there.`:`A seed file: the ${r(a)} cells this run started from${T}, without its rules. Load it from the Seed box, under File, to run it under the rules in the Rules box. To keep the rules with it, use Save simulation.`,hashes:[],where:l(s.name),ready:!0});return}if(i.wrap||i.walls){pn({title:"Save this generation",what:i.wrap?HM:VM,hashes:[],where:"",ready:!1});return}pn({title:"Save this generation",what:"Taking the generation on screen…",hashes:[],where:"",ready:!1});let c,u,d,h=null,p=Q.chunkSize,g=0;try{const T=Q.cycle;if(T?.frames)c=T.from+T.index,u=T.frames[T.index],d=u.length/3,g=Q.departed;else{const A=await t.snapshot({budget:Un,stats:!0});({generation:c,live:d,chunkSize:p}=A),u=A.cells??null,h=A.stats??null,g=h?.departed??0}}catch(T){Q.save===s&&pn({what:`The generation couldn't be taken: ${T.message}`});return}if(Q.save!==s)return;const _=`Save generation ${r(c)}`,m=GM(g);if(m){pn({title:_,what:m});return}if(!u){pn({title:_,what:`This generation has ${r(d)} live cells, and a saved generation holds at most ${r(Un)}, so it can't be saved. An earlier one can: Restart, and save before it grows this far. Save simulation still saves the seed and its rules.`});return}if(pn({title:_,what:`Hashing generation ${r(c)}'s ${r(d)} live cells…`}),await new Promise(T=>setTimeout(T)),Q.save!==s)return;const f=zM(Q.status,Q.endReason);let M;try{const T=await Ap();M=await $M({config:i,generation:c,cells:u,ending:f,stats:h,chunkSize:p,browser:T})}catch(T){Q.save===s&&pn({what:`The file couldn't be made: ${T.message}`});return}if(Q.save!==s)return;s.name=BM(c),s.text=M.text;const b=i.arena?`, its ${r(i.arena)}³ arena`:"",E=f==="stopped"?"stopped here":`ended (${f})`,L=Q.status==="running"?" The run keeps going; the file holds the generation as it was when you opened this.":"";pn({title:_,what:`A result file, as a contest entry is one: the run's seed (${r(a)} cells), its rules (${o})${b}, generation ${r(c)} with the position of each of its ${r(d)} live cells, how the run stands (${E}), and its statistics, chunk size and browser. Load it from the Simulation box, with Load simulation…, to carry on from generation ${r(c)}.${L}`,hashes:[[`Generation ${r(c)}`,M.result.hash],["Seed",M.result.seedHash]],where:l(s.name),ready:!0})}async function Ew(){const n=Q.save;if(!(!n?.text||n.saved))try{const e={seed:"Game of Life 3D seed file",simulation:"Game of Life 3D simulation file",generation:"Game of Life 3D saved generation"},t=await vu(n.name,n.text,e[n.kind]);if(Q.save!==n)return;n.saved=!0,pn({status:t,ready:!1})}catch(e){if(e?.name==="AbortError")return;Q.save===n&&pn({status:`Not saved: ${e.message}`,ready:!0})}}function ua(){Q.save=null,Np(null)}async function vu(n,e,t){if(Cp()){const i=await window.showSaveFilePicker({suggestedName:n,types:[{description:t,accept:{"application/json":[".json"]}}]}),s=await i.createWritable();return await s.write(e),await s.close(),`Saved as ${i.name}, in the folder you chose.`}return Fp(n,e),`Downloaded as ${n}: your browser's downloads list shows where it went.`}function Cp(){return typeof window<"u"&&typeof window.showSaveFilePicker=="function"}function Tw(){Q.status==="running"?Q.driver.pause():Q.status==="paused"&&Q.driver.resume()}function Aw(){Q.status==="paused"&&Q.driver.step()}function Rw(){Q.config&&Pp()}function Pr(n){return Number(n)>=mu?null:Number(n)*10}function Cw(n){const e=Pr(n);Q.driver?.setRate(e),Lp(e)}function Pw(n){const{view:e,driver:t}=Q;if(!e)return;const i=Lw(n);if(t&&Q.wantSnapshot&&!Q.snapshotPending&&!i){Q.wantSnapshot=!1,Q.snapshotPending=!0;const r={budget:Os};v.viewMode==="slice"&&v.sliceIndex!==null&&(r.slice={axis:gu.indexOf(v.sliceAxis),index:v.sliceIndex}),t.snapshot(r).then(o=>{Q.view!==e||Q.cycle?.frames||(Q.chunkSize=o.chunkSize,e.show(o),Fw(o),Q.status==="running"&&(Q.wantSnapshot=!0))}).catch(()=>{}).finally(()=>{Q.view===e&&(Q.snapshotPending=!1)})}const s=Q.lastFrame?Math.min(n-Q.lastFrame,100):16;Q.lastFrame=n,e.showGrid(!!v.showWireframeGrid,Q.extent,Q.chunkSize),e.frame({camera:v.camera,controls:v.controls,elapsedMs:s,follow:n>=Q.followFrom,cellSize:v.cellSize??1.2,flip:v.flipOrientation})}function Lw(n){const e=Q.cycle;if(!e?.frames)return!1;const t=document.getElementById("speed-control"),i=Math.min(yw,Pr(t?t.value:mu)??Sw);if(n>=e.nextAt&&(e.index=(e.index+1)%e.period,e.nextAt=n+1e3/i,e.redraw=!0),e.redraw){e.redraw=!1;let s=e.frames[e.index];v.viewMode==="slice"&&v.sliceIndex!==null&&(s=Dw(s,gu.indexOf(v.sliceAxis),v.sliceIndex)),Q.view.show({cells:s})}return!0}function Dw(n,e,t){const i=[];for(let s=0;s<n.length;s+=3)n[s+e]===t&&i.push(n[s],n[s+1],n[s+2]);return Int32Array.from(i)}function Pp(){const{config:n}=Q;Q.driver?.close(),Q.status="idle",Q.wantSnapshot=!1,Q.snapshotPending=!1,Q.followFrom=0,Q.extent=null,Q.cycle=null,Q.endReason=null,Q.departed=0,at("explore-settled","no");const e=document.getElementById("explore-departed-line");e&&(e.hidden=!n.ships),at("explore-departed","0"),cn("explore-end-note",null),ua(),Eh(!1);const t=document.getElementById("speed-control"),i=Pr(t?t.value:mu);Lp(i);const s=new la({onStats:o=>{Q.driver===s&&Th(o)},onState:(o,a,l,c)=>{Q.driver===s&&(Q.status=o,Q.endReason=o==="ended"?l:null,Eh(o==="running"),Th(a),Q.wantSnapshot=!0,o==="ended"&&Iw(s,l,a,c))},onError:o=>{Q.driver===s&&cn("explore-end-note",o)}});Q.driver=s,Up();const r=Rg(n);s.start({world:r,seed:n.cells.slice(),from:n.from??0,run:{kind:"open",paused:!0,rate:i,settle:!0}})}function Iw(n,e,t,i){const{config:s}=Q,r=Mw[e]?.(s,t,i)??`Stopped (${e}).`,o=e==="died"||e==="repeat";if(at("bottom-state-value",e==="died"?"died":e==="repeat"?i.period===1?"still":"cycle":e==="emits"?"emits":"ended"),at("explore-settled",e==="died"?"died":e==="repeat"?i.period===1?"still life":`every ${i.period.toLocaleString("en")}`:e==="emits"?`no, emits every ${i.period.toLocaleString("en")}`:"no"),e==="repeat"&&i.period>1||e==="emits"){cn("explore-end-note",r),Q.cycle={...i,frames:null,index:0,nextAt:0,redraw:!0},n.cycle({budget:4*Os}).then(c=>{if(Q.driver!==n)return;c.frames?.every(d=>d.length/3<=Os)?Q.cycle.frames=c.frames:cn("explore-end-note",`${r} The cycle is too large to play back, so its first generation stays on screen.`)}).catch(()=>{});return}const a=s.from?`Restart goes back to generation ${s.from.toLocaleString("en")}.`:"Restart runs the seed again.",l=o?a:`Generation ${t.generation.toLocaleString("en")} stays on screen; ${a}`;cn("explore-end-note",`${r} ${l}`)}function Eh(n){v.isPlaying=n;const e=document.getElementById("playPauseIcon");e&&(e.className=n?"pause":"play");const t=document.getElementById("bottom-state-value");t&&(t.textContent=Q.status==="ended"?"ended":n?"play":"pause"),document.getElementById("stepButton")?.classList.toggle("disabled",Q.status!=="paused")}function Lp(n){const e=document.getElementById("bottom-speed-value");e&&(e.textContent=n===null?"max":`${Math.round(n)}`)}function Uw(n){at("rules-birth",gi(n.rules.birth)),at("rules-survival",gi(n.rules.survival)),at("rules-isolation","–"),at("rules-overcrowd","–"),at("bottom-direction-value","fwd")}function Th(n){const e=i=>i.toLocaleString("en");at("explore-generation",e(n.generation)),at("explore-live",e(n.live)),at("explore-live-peak",e(n.livePeak)),at("explore-chunks",e(n.chunks)),(Q.status==="running"||n.rate)&&at("explore-rate",e(Math.round(n.rate))),at("explore-extent",n.extent?n.extent.max.map((i,s)=>i-n.extent.min[s]+1).join("×"):"–"),at("explore-memory-live",Ow(n.usedBytes));const t=Q.config?` / ${e(Q.config.memoryMB)}`:"";at("explore-memory-used",`${e(Math.round(n.memoryBytes/2**20))}${t} MB`),at("bottom-gen",e(n.generation)),n.departed!==void 0&&Nw(n),Q.extent=n.extent,Dp()}function Nw({departed:n,lastDeparture:e}){const t=e?`, last at ${e.generation.toLocaleString("en")}, ${lc(e.shift)}`:"";if(at("explore-departed",`${n.toLocaleString("en")}${t}`),n>Q.departed&&e){const i=n-Q.departed===1?"A ship":`${(n-Q.departed).toLocaleString("en")} ships`;cn("explore-end-note",`${i} left the arena at generation ${e.generation.toLocaleString("en")}, heading ${lc(e.shift)}: ${n.toLocaleString("en")} so far.`)}Q.departed=n}function Dp(){xu(Q.extent)&&(Q.wantSnapshot=!0)}function xu(n){const e=document.getElementById("slice-index"),t=Math.max(0,gu.indexOf(v.sliceAxis)),i=n?n.min[t]:0,s=n?n.max[t]:0,r=v.sliceIndex??Math.round((i+s)/2),o=Math.min(s,Math.max(i,r)),a=o!==v.sliceIndex;return a&&(v.sliceIndex=o),e&&(e.min=`${i}`,e.max=`${s}`,e.value=`${o}`),v.viewMode==="slice"&&at("view-controls-display-text",`${o-i} / ${s-i}`),a}function Fw(n){n.chunks&&n.slice?cn("explore-view-note",`This slice holds more than ${Os.toLocaleString("en")} live cells, so the view shows the chunks it crosses (${n.chunkSize}³ cells each), brighter where fuller.`):n.chunks?cn("explore-view-note",`${n.live.toLocaleString("en")} live cells: more than ${Os.toLocaleString("en")}, so the view shows the chunks that hold them (${n.chunkSize}³ cells each), brighter where fuller.`):cn("explore-view-note",null)}const Ip={generation:"explore-save-generation",simulation:"explore-save-simulation",seed:"explore-save-seed"};function Up(){for(const n of Object.values(Ip)){const e=document.getElementById(n);e&&(e.disabled=!Q.driver)}}function Np(n){const e=document.getElementById("explore-save-popover");if(!e)return;if(!n){ln({popover:e});return}const t=document.getElementById(Ip[n]);t&&pu(t,e,{onClose:()=>{Q.save=null,pn({title:"",what:"",hashes:[],where:"",status:"",ready:!1})},focus:e})}function pn({title:n,what:e,hashes:t,where:i,status:s,ready:r}){if(n!==void 0&&at("explore-save-title",n),e!==void 0&&at("explore-save-what",e),t!==void 0){const a=document.getElementById("explore-save-hashes");a&&(a.replaceChildren(...t.map(([l,c])=>{const u=document.createElement("div"),d=document.createElement("span");d.className="explore-save-hash-label",d.textContent=l;const h=document.createElement("code");return h.textContent=c,u.append(d,h),u})),a.hidden=!t.length)}i!==void 0&&cn("explore-save-where",i),(s!==void 0||e!==void 0)&&cn("explore-save-status",s??null);const o=document.getElementById("explore-save-confirm");o&&(r!==void 0||e!==void 0)&&(o.hidden=!r),at("explore-save-cancel",Q.save?.saved?"Close":"Cancel"),Xt()}function Fp(n,e){const t=URL.createObjectURL(new Blob([e],{type:"application/json"})),i=document.createElement("a");i.href=t,i.download=n,document.body.append(i),i.click(),i.remove(),setTimeout(()=>URL.revokeObjectURL(t),6e4)}function Ow(n){return n<2**20?`${Math.round(n/1024).toLocaleString("en")} KB`:`${(n/2**20).toLocaleString("en",{minimumFractionDigits:1,maximumFractionDigits:1})} MB`}function cn(n,e){const t=document.getElementById(n);t&&(t.hidden=!e,t.textContent=e??"")}function at(n,e){const t=document.getElementById(n);t&&(t.textContent=e)}function gi(n){const e=[];for(let t=0;t<n.length;t++){let i=t;for(;i+1<n.length&&n[i+1]===n[i]+1;)i++;e.push(i>t?`${n[t]}-${n[i]}`:`${n[t]}`),t=i}return e.join(",")||"–"}const tr=new F(...Vt.min.map((n,e)=>(n+Vt.max[e])/2)),Bw=(Vt.max[0]-Vt.min[0]+1)/2,kw=26,zw={front:[0,0,1],top:[0,1,1e-4],side:[1,0,0],angled:[.55,.45,.7]},Gw=[0,180/255,200/255],Hw=[200/255,20/255,0],Vw=new Pe(1,.92,.45),$w=new Pe(.32,.36,.42),Ww=new Pe(.14,.15,.17),Xw=new Pe(.65,.92,1),Yw=[16734810,5963642,5938431];class qw{constructor(e,{flip:t=!1}={}){this.renderer=e,this.dirty=!0,this.inset={right:0,bottom:0},this.scene=new np,this.scene.background=new Pe(1315860);const i=new ap(16777215,1.6);i.position.set(1,2,3),this.scene.add(i,new lp(16777215,.9)),this.camera=new sn(50,1,.1,500),this.controls=new xp(this.camera,e.domElement),this.controls.target.copy(tr),this.controls.enableDamping=!1,this.controls.minDistance=4,this.controls.maxDistance=120,this.onChange=()=>{this.dirty=!0},this.controls.addEventListener("change",this.onChange),this.group=new mi,this.group.scale.y=t?-1:1,this.scene.add(this.group);const s=new rn(.84,.84,.84);this.cubeGeometry=s,this.solidMaterial=new Od,this.fadedMaterial=new Od({transparent:!0,opacity:.1,depthWrite:!1}),this.solid=this.instanced(this.solidMaterial),this.faded=this.instanced(this.fadedMaterial),this.solidPlaces=new Int32Array($n);const r=new Ft,o=new Float32Array(3*$n);for(let c=0;c<$n;c++)o.set(ir(c),3*c);r.setAttribute("position",new Ut(o,3)),r.setAttribute("color",new Ut(new Float32Array(3*$n),3)),this.dotMaterial=new Rr({size:.16,vertexColors:!0,sizeAttenuation:!0}),this.dots=new su(r,this.dotMaterial),this.group.add(this.dots);const a=2*Bw;this.outline=this.edges(new rn(a,a,a),16777215,.3),this.outline.position.copy(tr);const l=new rn(1,1,1);this.selectionFill=new vn(l,new sa({color:16769126,transparent:!0,opacity:.1,depthWrite:!1})),this.group.add(this.selectionFill),this.selectionEdges=this.edges(l,16769126,.95),this.cursor=this.edges(new rn(1.12,1.12,1.12),16777215,1),this.guides=Yw.map(c=>{const u=new Ft;u.setAttribute("position",new Ut(new Float32Array(6),3));const d=new Xi(u,new Jn({color:c,transparent:!0,opacity:.85}));return d.frustumCulled=!1,this.group.add(d),d}),this.raycaster=new a0,this.raycaster.params.Points.threshold=.4,this.fitScale=1,this.resize(),this.setView("angled")}update(e,{fade:t=!1}={}){const i=e.selection(),s=e.focus(),r=(g,[_,m,f])=>_>=g.min[0]&&_<=g.max[0]&&m>=g.min[1]&&m<=g.max[1]&&f>=g.min[2]&&f<=g.max[2],o=new rt,a=new Pe,l=this.dots.geometry.attributes.color.array;let c=0,u=0;for(let g=0;g<$n;g++){const _=ir(g),m=r(i,_),f=t&&!r(s,_);if(e.places[g]){const M=(_[0]-Vt.min[0])/(Vt.max[0]-Vt.min[0]);a.setRGB(...Gw.map((L,T)=>L+(Hw[T]-L)*M)),m&&a.lerp(Vw,.55),o.makeTranslation(..._);const b=f?this.faded:this.solid,E=f?u++:c++;b.setMatrixAt(E,o),b.setColorAt(E,a),f||(this.solidPlaces[E]=g),l.set([0,0,0],3*g)}else{const M=m?Xw:f?Ww:$w;l.set([M.r,M.g,M.b],3*g)}}for(const[g,_]of[[this.solid,c],[this.faded,u]])g.count=_,g.instanceMatrix.needsUpdate=!0,g.instanceColor&&(g.instanceColor.needsUpdate=!0);this.dots.geometry.attributes.color.needsUpdate=!0,this.fading=t,this.focusBox=s;const d=i.max.map((g,_)=>g-i.min[_]+1),h=i.min.map((g,_)=>(g+i.max[_])/2);for(const g of[this.selectionFill,this.selectionEdges])g.scale.set(d[0]+.06,d[1]+.06,d[2]+.06),g.position.set(...h);const p=e.cursor;this.cursor.position.set(...p),this.guides.forEach((g,_)=>{const m=[...p],f=[...p];m[_]=Vt.min[_]-.5,f[_]=Vt.max[_]+.5,g.geometry.attributes.position.array.set([...m,...f]),g.geometry.attributes.position.needsUpdate=!0}),this.dirty=!0}setView(e){const t=new F(...zw[e]).normalize();this.camera.up.set(0,1,0),this.camera.position.copy(tr).addScaledVector(t,kw*this.fitScale),this.controls.target.copy(tr),this.camera.lookAt(tr),this.controls.update(),this.dirty=!0}screenView(){this.camera.updateMatrixWorld();const e=this.camera.matrixWorld.elements,t=this.group.scale.y,i=(s,r,o)=>[s,t*r,o];return{right:i(e[0],e[1],e[2]),up:i(e[4],e[5],e[6]),forward:i(-e[8],-e[9],-e[10])}}pick(e,t){const i=this.renderer.domElement.getBoundingClientRect(),s=new Ve((e-i.left)/i.width*2-1,-((t-i.top)/i.height)*2+1);this.scene.updateMatrixWorld(),this.raycaster.setFromCamera(s,this.camera);const r=this.raycaster.intersectObject(this.solid,!1)[0];if(r&&r.instanceId!==void 0)return ir(this.solidPlaces[r.instanceId]);for(const o of this.raycaster.intersectObject(this.dots,!1)){const a=ir(o.index);if(!this.fading||jw(this.focusBox,a))return a}return null}setInset({right:e=0,bottom:t=0}={}){this.inset={right:e,bottom:t},this.resize()}resize(){const e=this.renderer.domElement,t=e.clientWidth||window.innerWidth,i=e.clientHeight||window.innerHeight;this.camera.aspect=t/i;const{right:s,bottom:r}=this.inset;this.camera.setViewOffset(t,i,s/2,r/2,t,i);const o=(t-s)/i,a=(i-r)/i;this.fitScale=Math.max(1,1/Math.max(.3,Math.min(o,a))),this.camera.updateProjectionMatrix(),this.dirty=!0}render(){return this.dirty?(this.dirty=!1,this.renderer.render(this.scene,this.camera),!0):!1}dispose(){this.controls.removeEventListener("change",this.onChange),this.controls.dispose(),this.scene.traverse(e=>{(e===this.solid||e===this.faded)&&e.dispose(),e.geometry?.dispose();const t=Array.isArray(e.material)?e.material:[e.material];for(const i of t)i?.dispose()}),this.cubeGeometry.dispose()}instanced(e){const t=new ip(this.cubeGeometry,e,$n);return t.count=0,t.frustumCulled=!1,t.setColorAt(0,new Pe),this.group.add(t),t}edges(e,t,i){const s=new Xi(new ra(e),new Jn({color:t,transparent:i<1,opacity:i}));return this.group.add(s),s}}function jw(n,[e,t,i]){return zo(e,t,i)>=0&&e>=n.min[0]&&e<=n.max[0]&&t>=n.min[1]&&t<=n.max[1]&&i>=n.min[2]&&i<=n.max[2]}const Kw=5;let We=null,Ah=!1;function Zw(){return We!==null}function Jw(){We?.view.render()}function Qw({places:n,rules:e,rulesFrom:t,note:i=null,onUse:s,returnFocus:r=null}){We&&da(),ib();const o=v.renderer.domElement;v.controls&&(v.controls.enabled=!1);const a=new qw(v.renderer,{flip:!!v.flipOrientation});We={model:new ag(n),view:a,rules:e,rulesFrom:t,onUse:s,returnFocus:r,fade:!1,help:!1,down:null},document.body.classList.add("seed-editor-open");const l=Nt("seed-editor");l.hidden=!1,Sn("seed-editor-note",i),Sn("seed-editor-status",null),Sn("seed-editor-error",null),Nt("seed-editor-density").value=`${sg}`,yu(!1),zp(),a.setView("angled"),o.tabIndex=0,o.setAttribute("aria-label","The seed box. Arrow keys and Page Up / Page Down move the cursor; Space switches the selection; ? lists every key."),Qi(),o.focus({preventScroll:!0})}function da(){if(!We)return;const{view:n,returnFocus:e}=We;We=null,n.dispose();const t=v.renderer?.domElement;t&&(t.removeAttribute("tabindex"),t.removeAttribute("aria-label")),v.controls&&(v.controls.enabled=!0),document.body.classList.remove("seed-editor-open"),Nt("seed-editor").hidden=!0,Fo(),e?.isConnected&&!e.disabled&&e.focus({preventScroll:!0})}function xs(n){if(!We)return;const{model:e}=We;switch(Sn("seed-editor-error",null),n){case"switch":e.switchSelection();break;case"random":{const t=Number(Nt("seed-editor-density").value);if(!(t>=0&&t<=1)||Nt("seed-editor-density").value===""){Sn("seed-editor-error","The density must be from 0 to 1.");return}e.randomFill(t,Math.random);break}case"undo":e.undo();break;case"redo":e.redo();break;case"fade":We.fade=!We.fade;break;case"help":yu(!We.help);return;case"use":eb();return;case"cancel":da();return;case"load":Nt("seed-editor-file").click();return;case"export":tb();return;default:return}Qi()}function eb(){const{model:n,rules:e,onUse:t}=We;try{t(n.toCells(),e)}catch(i){Sn("seed-editor-error",i.message)}}async function tb(){const{model:n,rules:e}=We;if(!n.count){Sn("seed-editor-error","The design has no live cells to export: switch some on first.");return}const t=zc({cells:n.toCells()});try{const i=await vu(Sp,t,"Game of Life 3D seed file");Sn("seed-editor-status",`${i} A seed file, cells only. Load it in the Seed box, under File, or in this editor with Load…, to open it again. To keep the rules with it, Use the design, then Save simulation in the Simulation box.`)}catch(i){i?.name!=="AbortError"&&Sn("seed-editor-error",`Not exported: ${i.message}`)}}async function nb(n){if(!We||!n)return;const e=We;try{if(n.size>Dn)throw new Error(`${n.name} is larger than ${Dn/2**20} MB.`);const t=Mg(n.name,await Mp(await n.text()));if(We!==e)return;e.model.replace(t.places),t.rules&&(e.rules=t.rules,e.rulesFrom=n.name),Sn("seed-editor-status",`Loaded ${n.name}: ${e.model.count.toLocaleString("en")} cells. Undo goes back to the design before it.`),Sn("seed-editor-error",null)}catch(t){if(We!==e)return;const i=t.message.startsWith(n.name)?t.message:`${n.name} can't be used: ${t.message}`;Sn("seed-editor-error",i)}Qi()}function Op(n){const e=ug(n,We.view.screenView());e&&(We.model.moveCursor(e.axis,e.delta),Qi())}function Bp(n){We.model.setKind(n),Qi()}function kp(n){We.model.setAxis(n),Qi()}function Qi(){if(!We)return;const{model:n,view:e,fade:t,rules:i,rulesFrom:s}=We;e.update(n,{fade:t}),Mo("seed-editor-count",(a=>a.toLocaleString("en"))(n.count)),Mo("seed-editor-cursor",Ao(n.cursor)),Mo("seed-editor-selection",lg(n));for(const a of document.querySelectorAll("#seed-editor [data-kind]"))a.setAttribute("aria-pressed",String(a.dataset.kind===n.kind));const o=n.kind==="line"||n.kind==="plane"||n.kind==="cell";for(const a of document.querySelectorAll("#seed-editor [data-axis]"))a.setAttribute("aria-pressed",String(Number(a.dataset.axis)===n.axis));Nt("seed-editor-axes").classList.toggle("is-quiet",!o),Nt("seed-editor-undo").disabled=!n.canUndo,Nt("seed-editor-redo").disabled=!n.canRedo,Nt("seed-editor-fade").setAttribute("aria-pressed",String(t)),Mo("seed-editor-rules",`Use runs it with ${rb(i)}, from ${s}. Export saves the seed alone, without rules.`)}function zp(){if(!We)return;const e=Nt("seed-editor").getBoundingClientRect(),t=e.top>window.innerHeight/3;We.view.setInset(t?{bottom:window.innerHeight-e.top}:{right:window.innerWidth-e.left})}function yu(n){We&&(We.help=n),Nt("seed-editor-help").hidden=!n,Nt("seed-editor-help-button").setAttribute("aria-expanded",String(n))}function ib(){if(Ah)return;Ah=!0;const n=Nt("seed-editor"),e=v.renderer.domElement;n.addEventListener("click",t=>{const i=t.target.closest("button");!i||!We||(i.dataset.action?xs(i.dataset.action):i.dataset.kind?Bp(i.dataset.kind):i.dataset.axis?kp(Number(i.dataset.axis)):i.dataset.move?Op(i.dataset.move):i.dataset.view&&We.view.setView(i.dataset.view),We&&t.detail>0&&e.focus({preventScroll:!0}))}),Nt("seed-editor-file").addEventListener("change",t=>{const i=t.target.files?.[0];t.target.value="",nb(i)}),e.addEventListener("pointerdown",t=>{We&&t.button===0&&(We.down={x:t.clientX,y:t.clientY})}),e.addEventListener("pointerup",t=>{if(!We?.down)return;const{x:i,y:s}=We.down;if(We.down=null,Math.hypot(t.clientX-i,t.clientY-s)>Kw)return;const r=We.view.pick(t.clientX,t.clientY);r&&(t.shiftKey?We.model.setAnchor(r):We.model.setCursor(r),Qi())}),document.addEventListener("keydown",sb),window.addEventListener("resize",()=>{We&&zp()})}function sb(n){if(!We)return;const e=n.target,t=e instanceof HTMLElement&&e.closest("input, select, textarea");if(n.key==="Escape"){n.preventDefault(),n.stopPropagation(),We.help?yu(!1):da();return}if(t)return;const i=e instanceof HTMLElement&&e.closest("button, a"),s=n.ctrlKey||n.metaKey,r=n.key.length===1?n.key.toLowerCase():n.key;if(s&&(r==="z"||r==="y")){n.preventDefault(),xs(r==="y"||n.shiftKey?"redo":"undo");return}if(s||n.altKey)return;if(yf[n.key]){n.preventDefault(),Op(n.key);return}if(r===" "||r==="Enter"){if(i)return;n.preventDefault(),xs("switch");return}const o=xf[Number(r)-1];o?(n.preventDefault(),Bp(o)):pr.includes(r)?(n.preventDefault(),kp(pr.indexOf(r))):r==="r"?(n.preventDefault(),xs("random")):r==="f"?(n.preventDefault(),xs("fade")):r==="?"&&(n.preventDefault(),xs("help"))}function Nt(n){return document.getElementById(n)}function Mo(n,e){const t=Nt(n);t&&(t.textContent=e)}function Sn(n,e){const t=Nt(n);t&&(t.hidden=!e,t.textContent=e??"")}function rb(n){const e=t=>{const i=[];for(let s=0;s<t.length;s++){let r=s;for(;r+1<t.length&&t[r+1]===t[r]+1;)r++;i.push(r>s?`${t[s]}-${t[r]}`:`${t[s]}`),s=r}return i.join(",")||"none"};return`B${e(n.birth)} / S${e(n.survival)}`}const Rh=Dn,Gp={perlin:{size:"Noise detail",sizeMax:100,density:"Fill amount",about:"Noise detail sets how fine the pattern is; fill amount how many cells live; the region how wide it spreads (0 for as wide as the detail)."},worley:{size:"Feature points",sizeMax:50,density:"Activation distance",about:"Feature points are the centres of its cells; activation distance how far from them cells live; the region how wide it spreads (0 for as wide as the points)."}},Hp={size:"Size",sizeMax:Fi,density:"Density",about:"Density is the chance that each cell of the shape is alive."};let Ch=!1,Su=Mu;function ob({restart:n}={}){n&&(Su=n),!Ch&&(Ch=!0,lb(),cb(),pb(),yb(),Sb())}function Mu(){ww(Cf(v.explore)),ab()}function ab(){const n=Tg(v.explore),e=s=>s.toLocaleString("en"),t=$c(v.explore);Rt("hud-simulation-name",t.name),Rt("explore-seed-label",n.seed);const i={end:"",ships:", ships leave",wrap:", wraps",walls:", walls"}[n.edge];Rt("explore-arena",n.arena?`${e(n.arena)}³${n.arenaLocked?", saved":""}${i}`:"off"),Rt("explore-memory-limit",`${e(n.memoryMB)} MB`)}function lb(){for(const n of document.querySelectorAll(".hud-collapse")){const e=n.closest(".glass-display"),t=n.closest(".box-title");t.onclick=i=>{if(i.target.closest?.(".hud-gear"))return;const s=t.querySelector(".box-title-text")?.textContent??"this",r=e.classList.toggle("is-collapsed");if(n.setAttribute("aria-expanded",String(!r)),n.setAttribute("aria-label",`${r?"Expand":"Collapse"} the ${s} box`),r){const o=e.querySelector(".explore-popover.is-open");o&&ln({popover:o,restoreFocus:!1})}}}}function ha(n,e,t,i){const s=document.getElementById(n),r=document.getElementById(e);if(!s||!r)return;const o=r.querySelector(".explore-error");s.onclick=()=>{if(ca(r)){ln();return}Yo(o,null),t(),pu(s,r)},r.querySelector("[data-cancel]").onclick=()=>ln(),r.onsubmit=a=>{a.preventDefault();let l;try{l=i()}catch(c){Yo(o,c.message),Xt();return}v.explore=l,ln(),Su()}}function Yo(n,e){n&&(n.hidden=!e,n.textContent=e??"")}const xt={source:"current",presetId:Sr[0].id,file:null,fileError:null},cc="";function Vp(n,e,t){const i=r=>new Option(r[t],r[e]),s=Nm.map(({id:r,label:o})=>{const a=document.createElement("optgroup");return a.label=o,a.append(...n.filter(l=>l.group===r).map(i)),a});return[...n.filter(r=>!r.group).map(i),...s.filter(r=>r.children.length)]}function $p(n,e,t,i){n.onchange=async()=>{const s=n.files?.[0];if(n.value="",!!s){try{if(s.size>Rh)throw new Error(`it is larger than ${Rh/2**20} MB.`);e.file=t(s.name,await Mp(await s.text())),e.fileError=null}catch(r){e.file=null,e.fileError=r.message.startsWith(s.name)?r.message:`${s.name} can't be used: ${r.message}`}i()}}}function cb(){const n=document.getElementById("explore-simulation-popover"),e=document.getElementById("explore-preset");if(!n||!e)return;e.replaceChildren(new Option("",cc),...Vp(Sr,"id","name"));const t=s=>document.getElementById(s);e.onchange=()=>{xt.source=e.value===cc?xt.file||xt.fileError?"file":"current":"preset",xt.source==="preset"&&(xt.presetId=e.value),uc()};const i=t("explore-simulation-file");t("explore-load-simulation").onclick=()=>i.click(),$p(i,xt,xg,()=>{xt.source="file",uc()}),fb(n,t("explore-simulation-help"),Wp),ha("explore-change-simulation","explore-simulation-popover",ub,()=>{const s=v.explore;if(xt.source==="preset")return Go(s,vg(xt.presetId));if(xt.source==="current")return s;if(!xt.file)throw new Error(xt.fileError??"Load a simulation file or a saved generation first, with Load simulation….");return xt.file===s.seed?s:Go(s,xt.file)})}function ub(){const{id:n}=$c(v.explore);xt.source=n?"preset":"current",n&&(xt.presetId=n),xt.file=null,xt.fileError=null,uc()}function uc(){const n=p=>document.getElementById(p),e=p=>p.toLocaleString("en"),{source:t,file:i,fileError:s}=xt,r=$c(v.explore),o=n("explore-preset"),a=o.options[0],l=t==="file"&&i;a.textContent=l?`${i.name} (loaded, not yet applied)`:r.from==="preset"?"":`${r.name} (in use)`,a.hidden=!a.textContent,o.value=t==="preset"?xt.presetId:cc;const c=(p,g)=>{n(p).dataset.help=g},u=In(xt.presetId);c("explore-preset",t==="preset"&&u?`${u.description} Seed: ${e(u.cells.length/3)} cells. Rules: ${Rs(u.rules)}.`:r.from===null&&!l?hb:"A preset is a ready-made simulation: a seed with its own rules. Applying one replaces both."),c("explore-load-simulation",db);let d="";t==="file"&&s?d=s:l&&i.kind==="saved"?d=`${i.name}: generation ${e(i.from)} of a saved run, ${e(i.cells.length/3)} cells, with its own rules, ${Rs(i.rules)}, and ${i.arena?`a ${e(i.arena)}³ arena`:"no arena"}. They stay locked while it runs.`:l&&(d=`${i.name}: a seed of ${e(i.cells.length/3)} cells, and its rules, ${Rs(i.rules)}, which go into the Rules box, where you can change them.`),Rt("explore-simulation-status",d);const h=l&&i.kind==="saved"?i.from:0;c("explore-simulation-apply",t==="current"?`Nothing chosen yet: Applying runs the simulation in use again. ${gr(0)}`:`Applying replaces the seed and the rules. ${gr(h)}`),Yo(n("explore-simulation-error"),null),Rt("explore-simulation-help",Wp()),Xt()}const db="Load simulation… takes a simulation file, from the Simulation box's save icon, whose seed and rules both come in, or a saved generation, from Save this generation, which carries on from its generation under its own rules and arena. A seed file has no rules: load it in the Seed box.",hb="Custom: a seed and rules of your own. To make one, change the seed in the Seed box, or the rules in the Rules box: the simulation becomes Custom. Save it with the save icon, and load it again here; or pick a preset to start from.";function Wp(){const n=xt.source==="file"?"explore-load-simulation":"explore-preset";return document.getElementById(n)?.dataset.help??""}function fb(n,e,t){if(!n||!e)return;const i=s=>{const r=s?.closest?.("[data-help]")?.dataset.help??t();e.textContent!==r&&(e.textContent=r,Xt())};n.addEventListener("pointerover",s=>i(s.target)),n.addEventListener("pointerleave",()=>i(n.contains(document.activeElement)?document.activeElement:null)),n.addEventListener("focusin",s=>i(s.target))}const kt={source:"shape",file:null,fileError:null};function pb(){const n=document.getElementById("explore-seed-popover"),e=document.getElementById("explore-shape");if(!n||!e)return;e.replaceChildren(...Vp(bf,"key","name"));const t=s=>document.getElementById(s);t("explore-source-shape").onclick=()=>{kt.source="shape",ys()},t("explore-source-file").onclick=()=>{kt.source="file",ys()},t("explore-source-design").onclick=()=>{kt.source="design",ys()},t("explore-design").onclick=Yp,e.onchange=()=>{Xp(e.value),ys()};const i=t("explore-seed-file");t("explore-load-seed").onclick=()=>i.click(),$p(i,kt,yg,ys),ha("explore-change-seed","explore-seed-popover",mb,()=>{const s=v.explore;if(kt.source==="file"){if(!kt.file)throw new Error(kt.fileError??"Load a seed file first, with Load seed….");return kt.file===s.seed?s:Go(s,kt.file)}if(kt.source==="design"){if(s.seed.kind==="design")return s;throw new Error("Design a seed first: Design… opens the seed editor, and its Use makes the design the seed.")}const r=e.value,o={size:t("explore-shape-size").value,density:t("explore-shape-density").value,regionSize:t("explore-shape-region").value},a=Go(s,Hc(r,o,s.seed));return a.seed.params&&(v.shapeParams[r]={...a.seed.params}),a})}function mb(){const{seed:n}=v.explore;kt.source=n.kind==="file"&&!n.rules?"file":n.kind==="design"?"design":"shape",kt.file=kt.source==="file"?n:null,kt.fileError=null;const e=n.kind==="shape"?n.key:n.kind==="preset"?`preset:${n.id}`:"cube";document.getElementById("explore-shape").value=e,Xp(e,n.kind==="shape"?n.params:null),ys()}function Xp(n,e=null){const t=ea(n),i=Gp[n]??Hp,s=e??v.shapeParams?.[n]??{},r=document.getElementById("explore-shape-size");r.max=`${i.sizeMax}`,r.value=`${s.size??10}`,document.getElementById("explore-shape-density").value=`${s.density??(t?.noise?.3:1)}`,document.getElementById("explore-shape-region").value=`${s.regionSize??25}`}function ys(){const n=c=>document.getElementById(c),{source:e}=kt;n("explore-source-shape").setAttribute("aria-pressed",String(e==="shape")),n("explore-source-file").setAttribute("aria-pressed",String(e==="file")),n("explore-source-design").setAttribute("aria-pressed",String(e==="design")),n("explore-seed-shape-part").hidden=e!=="shape",n("explore-seed-file-part").hidden=e!=="file",n("explore-seed-design-part").hidden=e!=="design",Rt("explore-design-status",gb());const t=n("explore-shape").value,i=ea(t),s=Gp[t]??Hp;n("explore-shape-params").hidden=!!i?.preset,n("explore-shape-region-row").hidden=!i?.noise,Rt("explore-shape-size-label",s.size),Rt("explore-shape-size-hint",`1 - ${s.sizeMax}`),Rt("explore-shape-density-label",s.density),Rt("explore-shape-about",i?.preset?`${In(i.preset).name}'s ${(In(i.preset).cells.length/3).toLocaleString("en")} cells, without its rules: they run under the rules in the Rules box. For the preset with its rules, use Preset in the Simulation box.`:s.about);const{file:r,fileError:o}=kt,a=c=>c.toLocaleString("en");let l;o?l=o:r?r===v.explore.seed?l=`${ta(r)}: ${a(r.cells.length/3)} cells, in use now.`:l=`${r.name}: ${a(r.cells.length/3)} cells, to run under the rules in the Rules box.`:l="Load seed… takes the cells of a seed file, from Save seed, or of a simulation file, leaving its rules out: the seed runs under the rules in the Rules box.",Rt("explore-seed-status",l),Rt("explore-seed-note",`Applying changes only the seed: the rules stay. ${gr(0)}`),Yo(n("explore-seed-error"),null),Xt()}function gb(){const n=v.explore,e=i=>i.toLocaleString("en");if(n.seed.kind==="design")return`The design in use, ${e(n.seed.cells.length/3)} cells. Design… opens it in the seed editor, to change it; Apply runs it again.`;const t=Tf(n);return t.reason?`Design… opens the seed editor on an empty 10³ box: ${vb(t.reason)} The seed in use still runs.`:`Design… opens the seed editor on the seed in use (${ta(n.seed)}, ${e(n.seed.cells.length/3)} cells), in the 10³ seed box, to place cells one by one.`}function Yp({note:n=null}={}){const e=Tf(v.explore),t=Yi(v.explore);xb({places:e.places,rules:e.rules,rulesFrom:t?`${t.name}, as the Rules box shows them`:"the Rules box",note:[e.reason&&`${e.reason} The editor opens on an empty box; the seed in use is unchanged.`,n].filter(Boolean).join(" ")||null})}function _b({note:n=null}={}){Yp({note:n})}function vb(n){return/^[A-Z][a-z]/.test(n)?n[0].toLowerCase()+n.slice(1):n}function xb(n,e="explore-change-seed"){const t=document.getElementById(e);ln({restoreFocus:!1}),Qw({...n,returnFocus:t,onUse:(i,s)=>{const r=wg(v.explore,i,s);da(),v.explore=r,Su()}})}let ur=!1;function yb(){const n=document.getElementById("explore-rule-birth"),e=document.getElementById("explore-rule-survival");!n||!e||(document.getElementById("explore-rules-own").onclick=()=>{ur=!0,Lh(),n.focus()},e.oninput=Ph,ha("explore-change-rules","explore-rules-popover",()=>{ur=!1;const t=br(v.explore);n.value=Rs(t.birth),e.value=Rs(t.survival),Lh(),Ph()},()=>Cg(v.explore,n.value,e.value,{own:ur})))}function Ph(){let n=null;try{n=Ag(Si(document.getElementById("explore-rule-survival").value,"survival"))}catch{}const e=t=>n?n[t].length?t==="isolation"&&!n.overcrowding.length&&n.isolation.length===27?"every count":Rs(n[t]):"none":"–";Rt("explore-rules-isolation",e("isolation")),Rt("explore-rules-overcrowding",e("overcrowding")),Rt("explore-rules-gaps",e("gaps")),document.getElementById("explore-rules-gaps-line").hidden=!n?.gaps.length,Xt()}function Lh(){const n=ur?null:Yi(v.explore),e=document.getElementById("explore-rules-locked");e.hidden=!n,n&&Rt("explore-rules-locked-text",n.by==="preset"?`These rules come with ${n.name}, a simulation whose seed and rules go together, so it is always the same run. Use your own rules keeps its cells and these rules, as a Custom simulation, for you to change.`:"These rules come with the saved generation, which carries on under them. Use your own rules starts its cells again from generation 0, with these rules for you to change.");for(const i of["explore-rule-birth","explore-rule-survival"]){const s=document.getElementById(i);s.readOnly=!!n}wb("explore-rules-popover").hidden=!!n;const t=ur?0:Af(v.explore);Rt("explore-rules-note",gr(t)),Xt()}let dr=!1;function Sb(){const n=document.getElementById("explore-arena-on"),e=document.getElementById("explore-arena-side"),t=document.getElementById("explore-edge"),i=document.getElementById("explore-memory-input");!n||!e||!t||!i||(n.onchange=()=>{e.disabled=!n.checked||hc(),t.disabled=e.disabled},t.onchange=Dh,document.getElementById("explore-arena-own").onclick=()=>{dr=!0,Ih(),n.focus()},ha("explore-change-limits","explore-limits-popover",()=>{dr=!1;const s=mr(v.explore);n.checked=s!==null,e.value=`${s??v.explore.arenaSize}`;const r=Yi(v.explore)?.by==="saved"?Gs(v.explore):v.explore.edge;for(const o of t.querySelectorAll('input[name="explore-edge"]'))o.checked=o.value===r;for(const{key:o}of Gc)document.getElementById(`explore-wall-${o}-birth`).value=hr(v.explore.walls[o].birth),document.getElementById(`explore-wall-${o}-survival`).value=hr(v.explore.walls[o].survival);Dh(),i.value=`${v.explore.memoryMB}`,Ih()},()=>{const s=hc()?v.explore:Lf(v.explore,n.checked,e.value,{own:dr,edge:dc(),walls:dc()==="walls"?Mb():void 0});return Lg(s,i.value)}))}function dc(){return document.querySelector('#explore-edge input[name="explore-edge"]:checked')?.value}function Mb(){const n={};for(const{key:e}of Gc)n[e]={birth:document.getElementById(`explore-wall-${e}-birth`).value,survival:document.getElementById(`explore-wall-${e}-survival`).value};return n}function Dh(){const n=document.getElementById("explore-walls-rules");n&&(n.hidden=dc()!=="walls",Xt())}function hc(){return!dr&&Yi(v.explore)?.by==="saved"}function Ih(){const n=hc();document.getElementById("explore-arena-locked").hidden=!n;const e=document.getElementById("explore-arena-on");e.disabled=n,document.getElementById("explore-arena-side").disabled=n||!e.checked,document.getElementById("explore-edge").disabled=n||!e.checked,Rt("explore-limits-note",gr(dr?0:Af(v.explore))),Xt()}function wb(n){return document.getElementById(n).querySelector('[type="submit"]')}function Rt(n,e){const t=document.getElementById(n);t&&(t.textContent=e)}function Rs(n){return Array.isArray(n)?hr(n):`B${hr(n.birth)} / S${hr(n.survival)}`}function hr(n){const e=[];for(let t=0;t<n.length;t++){let i=t;for(;i+1<n.length&&n[i+1]===n[i]+1;)i++;e.push(i>t?`${n[t]}-${n[i]}`:`${n[t]}`),t=i}return e.join(",")}const Uh=1024**2,ki=1024**3,fc=1.5*ki,Nh=4*ki,wu=2*ki,bb=40,Eb=24,qp=2.25,Fh=.4,Oh=.3,pc=255,bu={size:1e5,generations:1e7};function fa(n,e){const t=Math.ceil(n*(e?.15:.1));return Math.max(2*n+1+t,n+1+t)}function Tb(n){return Math.max(20,Math.ceil(Math.sqrt(n)*2.5))}function Ab(n,e){const t=Math.max(1,n?.size||1),i=Math.min(1,Math.max(0,Number.isFinite(n?.density)?n.density:1));let s,r;switch(n?.shape){case"cube":s=t,r=s**3;break;case"tetrahedron":s=t,r=t*(t+1)*(t+2)/6;break;case"octahedron":s=2*t+1,r=(2*t+1)*(2*t*t+2*t+3)/3;break;default:s=Math.min(e,Math.max(1,n?.regionSize||e)),r=s**3}return s=Math.min(s,e),{side:s,cells:Math.min(r,s**3)*i}}function Rb({mode:n,size:e,generations:t,seed:i,initialSand:s=0}){switch(n){case"sineWave":return e*e*(t+1);case"rule30":return t**3/5.5+t+1;case"rule30_2D":return .4*t**3.55+t+1;case"sandpile":{const r=Math.min(pc,Math.max(0,s));return r+qp*(t*r+t*(t+1)/2)}default:{const{side:r,cells:o}=Ab(i,e),a=Oh*e**3,l=Math.ceil((e-r)/Fh);let c=o;const u=Math.min(t,l);for(let d=1;d<=u;d++)c+=Oh*Math.min(e,r+Fh*d)**3;return t>u&&(c+=(t-u)*a),c}}}function Lr(n){const{mode:e,size:t,generations:i}=n,s=e==="sandpile"?1+Math.ceil(qp*i):i+1,r=t**3*s,o=Rb(n),a=o*bb,l=e==="rule30"?1:t,c=t*t*l*Eb;return{frames:s,grids:r,cells:o,cellBytes:a,view:c,total:r+a+c}}function Cb(n){return Lr(n).total>wu}function jp(n,e,t){const i=o=>Lr(Pb(n,e,o)).total<=t;if(!i(1))return 0;let s=1,r=bu[e];if(i(r))return r;for(;r-s>1;){const o=Math.floor((s+r)/2);i(o)?s=o:r=o}return s}function Pb(n,e,t){const i={...n,[e]:t};return e==="generations"&&(n.mode==="rule30"||n.mode==="rule30_2D")&&(i.size=fa(t,n.mode==="rule30_2D")),i}function An(n){return n<Uh?"under 1 MB":n<ki?`${Math.round(n/Uh).toLocaleString("en")} MB`:n<10*ki?`${(n/ki).toFixed(1)} GB`:`${Math.round(n/ki).toLocaleString("en")} GB`}function Lb(n){return n<1e5?Math.round(n).toLocaleString("en"):n<1e9?`${(n/1e6).toFixed(1)} million`:`${(n/1e9).toFixed(1)} billion`}const di=n=>Math.round(n).toLocaleString("en");function Kp({size:n,generations:e}){return`a ${di(n)}³ grid over ${di(e)} generation${e===1?"":"s"}`}function Db(n,e){const t=jp(n,e,fc);return t<1?"advice":`1 - ${di(t)}${t>=bu[e]?"+":""}`}function Ib(n,e){const t=Lr(n),i=e==="size"?`at ${di(n.generations)} generations`:n.mode==="rule30"||n.mode==="rule30_2D"?"(the size follows)":`at size ${di(n.size)}`,s=r=>{const o=jp(n,e,r);if(o<1)return e==="generations"?"none at this size: lower the size first":"none at these generations";const a=e==="generations"?" generations":"";return`up to ${di(o)}${o>=bu[e]?" or more":""}${a} ${i}`};return{estimate:`About ${An(t.total)} for this run, by estimate.`,parts:`Grids: ${di(n.size)}³ × ${di(t.frames)} = ${An(t.grids)}. Live cells: about ${Lb(t.cells)} in all generations, ${An(t.cellBytes)}. View: ${An(t.view)}.`,cellsNote:n.mode==="gameOfLife"?"Live cells are a guess before the run: under the default rules a pattern widens by about 0.4 cells a generation, with about 30% of it alive. Other rules can hold far fewer, or more.":null,suggestions:[{label:`Typical laptop (${An(fc)})`,text:s(fc)},{label:`Strong desktop (${An(Nh)})`,text:s(Nh)}],past:`Past them, the run takes longer to compute, the view stutters as it draws more cells, and at last the browser refuses the memory, which stops the run with a message, or closes the tab, which no page can catch. Above ${An(wu)}, Apply asks first.`}}const Ub="Initial Sand stays between 0 and 255: each cell keeps its grains in one byte, and 255 is the most one byte holds. Size and generations have no such limit.";function Nb(n){const{total:e}=Lr(n);return`This run, ${Kp(n)}, needs about ${An(e)} by estimate, more than ${An(wu)}. On a typical laptop it may slow the page to a crawl, or the browser may close the tab. Run it anyway?`}function Fb(n){const{total:e}=Lr(n);return`The browser refused the memory for ${Kp(n)} (about ${An(e)} by estimate), so the run stopped. Open the settings to choose a smaller size or fewer generations.`}function Ob(n){return n instanceof RangeError}const qo=[{field:"size",button:"sim-size-range",text:"sim-size-range-text",popover:"sim-size-advice"},{field:"generations",button:"sim-generations-range",text:"sim-generations-range-text",popover:"sim-generations-advice"}],mc={button:"sandpile-initial-sand-range",popover:"sandpile-sand-advice"},nr=16,Bh=6,Eu=typeof HTMLElement<"u"&&"popover"in HTMLElement.prototype;let Tu=null,kh=!1;function Bb(n){if(Tu=n,kh)return;kh=!0;for(const{field:t,button:i,popover:s}of[...qo,{...mc,field:"sand"}]){const r=document.getElementById(i),o=document.getElementById(s);if(!r||!o)continue;const a=()=>Zp(t,o);Eu?(o.addEventListener("beforetoggle",l=>{l.newState==="open"&&a()}),o.addEventListener("toggle",l=>{l.newState==="open"&&ol(o,r)})):(o.hidden=!0,r.addEventListener("click",()=>{const l=o.hidden;Au(),l&&(a(),o.hidden=!1,ol(o,r))}))}const e=()=>{for(const{button:t,popover:i}of[...qo,mc]){const s=document.getElementById(i);s&&Ru(s)&&ol(s,document.getElementById(t))}};window.addEventListener("resize",e),document.addEventListener("scroll",e,!0)}function zh(){const n=Tu?.();if(n)for(const{field:e,text:t,popover:i}of qo){const s=document.getElementById(t);s&&(s.textContent=Db(n,e));const r=document.getElementById(i);r&&Ru(r)&&Zp(e,r,n)}}function Au(){for(const{popover:n}of[...qo,mc]){const e=document.getElementById(n);!e||!Ru(e)||(Eu?e.hidePopover():e.hidden=!0)}}function Ru(n){return Eu?n.matches(":popover-open"):!n.hidden}function Zp(n,e,t=Tu?.()){if(n==="sand"){e.replaceChildren(vs(Ub));return}if(!t){e.replaceChildren();return}const i=Ib(t,n),s=document.createElement("dl");for(const{label:r,text:o}of i.suggestions){const a=document.createElement("dt");a.textContent=r;const l=document.createElement("dd");l.textContent=o,s.append(a,l)}e.replaceChildren(vs(i.estimate,"advice-estimate"),vs(i.parts,"advice-detail"),...i.cellsNote?[vs(i.cellsNote,"advice-detail")]:[],vs("Suggested:"),s,vs(i.past))}function vs(n,e){const t=document.createElement("p");return t.textContent=n,e&&(t.className=e),t}function ol(n,e){if(!e)return;const t=e.getBoundingClientRect(),{offsetWidth:i,offsetHeight:s}=n,r=Math.min(Math.max(nr,t.right-i),window.innerWidth-i-nr);let o=t.bottom+Bh;o+s>window.innerHeight-nr&&(o=Math.max(nr,t.top-Bh-s)),n.style.left=`${Math.max(nr,r)}px`,n.style.top=`${o}px`}const Cu=[{id:"explore",name:"Game of Life 3D",kind:"Unbounded",about:"Conway's Game of Life in three dimensions, where each cell has 26 neighbours, in a world without walls: the pattern grows as far as it likes, for as long as you let it run. It computes on the CPU, in a background thread, keeping only the current generation, so its memory follows the live cells. Pause, step and restart it, try a preset simulation, a seed file or a seed of your own design, other rules, and an arena that ends the run, lets ships leave, wraps around or has walls."},{id:"gameOfLife",name:"Game of Life 3D",kind:"Bounded",about:"Conway's Game of Life in three dimensions, where each cell has 26 neighbours, in a fixed grid that wraps around, or has walls with their own corner, edge and face rules. The whole run is computed before it plays, so you can scrub it and play it backwards. It computes on your GPU with WebGPU where your browser has it, and on the CPU otherwise, with the same cells either way. It holds every generation in memory, so the grid's size and the run's length are what limit it."},{id:"rule30",name:"Rule 30",kind:"Cellular",about:"A one-dimensional cellular automaton that generates complex, seemingly random patterns from simple rules. Each cell's state depends on its left, centre and right neighbours, producing fractal-like structures."},{id:"sineWave",name:"Sine Wave",kind:"Continuous",about:"A continuous mathematical function visualised in discrete 3D space. It shows periodic oscillations and wave patterns, and how a continuous phenomenon can be sampled and displayed on a grid."},{id:"sandpile",name:"Sandpile",kind:"Abelian",about:"The Abelian sandpile model, a self-organised critical system. Sand grains pile up and topple when they reach a threshold, setting off cascading avalanches with power-law sizes and fractal patterns."}],Jp=["gameOfLife","rule30","sineWave","sandpile"],gc=[{key:"cube",name:"Cube"},{key:"tetrahedron",name:"Tetrahedron"},{key:"octahedron",name:"Octahedron"},{key:"perlin",name:"Perlin noise",noise:!0,size:"Noise detail",sizeMax:100,density:"Fill amount",about:"Noise detail sets how fine the pattern is; fill amount how many cells live; the region how wide it spreads."},{key:"worley",name:"Worley noise",noise:!0,size:"Feature points",sizeMax:50,density:"Activation distance",about:"Feature points are the centres of its cells; activation distance how far from them cells live; the region how wide it spreads."}],Vs=n=>gc.find(e=>e.key===n)??gc[0],Dr=[{key:"corner",state:"corner",name:"Corner",neighbours:7},{key:"edge",state:"edgeTwoFaces",name:"Edge",neighbours:11},{key:"face",state:"face",name:"Face",neighbours:17}];let Gh=!1,Cs={beforeRun:()=>{},afterRun:()=>{},enterExplore:()=>{},showMode:()=>{}};function kb(n){Cs={...Cs,...n},!Gh&&(Gh=!0,$b(),Wb(),jb(),Kb(),Bb(()=>ca(ke("grid-popover"))?_c(em()):_c(bi(v.simulationMode))))}function zb(){const n=ke("hud-change-mode");n&&!ca(ke("mode-popover"))&&n.click()}function bi(n){const e=v.modeValues[n]??{},t=e.generations??100,i=!!e.is3D,s=v.lifeShapeKey??"cube";return{mode:n,generations:t,size:n==="rule30"?fa(t,i):e.size??50,is3D:i,initialSand:v.sandpileParams?.initialSand??0,wrap:v.gridWrapping??!0,walls:Object.fromEntries(Dr.map(r=>[r.key,{birth:v.boundaryRules[r.state].birth,survival:v.boundaryRules[r.state].survival}])),shape:{key:s,...Qp(s),...v.shapeParams[s]},rules:{birth:v.rules.birth,survival:v.rules.survival}}}function Qp(n){return Vs(n).noise?{size:10,density:.3,regionSize:25}:{size:10,density:1}}function _c(n){if(!n||!Jp.includes(n.mode))return null;const{generations:e,size:t}=n;if(n.mode==="rule30")return{mode:n.is3D?"rule30_2D":"rule30",size:t,generations:e};if(n.mode==="sineWave")return{mode:"sineWave",size:t,generations:e};if(n.mode==="sandpile")return{mode:"sandpile",size:t,generations:e,initialSand:n.initialSand};const{key:i,size:s,density:r,regionSize:o}=n.shape;return{mode:"gameOfLife",size:t,generations:e,seed:{shape:i,size:s,density:r,regionSize:Vs(i).noise?o:null}}}async function Gb(n){const{mode:e}=n;if(Au(),v.simulationMode=e,v.useRule30=e==="rule30"&&!n.is3D,v.useRule30_2D=e==="rule30"&&n.is3D,v.useSineWave=e==="sineWave",v.useSandpile=e==="sandpile",v.modeValues[e]={...v.modeValues[e],size:n.size,generations:n.generations,is3D:n.is3D},v.sim_size=n.size,v.sim_generations=n.generations,e==="sandpile"&&(v.sandpileParams.initialSand=n.initialSand),e==="rule30"&&(v.shapeKey="rule30"),e==="gameOfLife"){const{key:t,size:i,density:s,regionSize:r}=n.shape,o=Vs(t).noise,a=o?Math.min(n.size,r):null;v.shapes[t]=Cm(t,i,s,a),v.shapeKey=t,v.lifeShapeKey=t,v.shapeParams[t]=o?{size:i,density:s,regionSize:a}:{size:i,density:s},v.gridWrapping=n.wrap,v.rules={...n.rules,...vc(n.rules.survival,26)};for(const l of Dr){const c=n.walls[l.key];v.boundaryRules[l.state]={...c,...vc(c.survival,l.neighbours)}}}Cs.beforeRun(),Cs.showMode(),await Ou(),Cs.afterRun(),Hb()}function vc(n,e){if(!n.length)return{isolation:[],overcrowding:[]};const t=Array.from({length:e+1},(i,s)=>s);return{isolation:t.filter(i=>i<n[0]),overcrowding:t.filter(i=>i>n[n.length-1])}}function Hb(){const n=v.simulationMode;if(!Jp.includes(n))return;const e=bi(n);ft("sim-size-value",al(v.sim_size)),ft("sim-generations-value",al(v.sim_generations)),ft("grid-edge-value",e.wrap?"wraps around":"walls"),ft("grid-3d-value",e.is3D?"on":"off"),ft("grid-sand-value",al(e.initialSand));const t=Vs(e.shape.key);ft("shape-name-value",t.name),ft("shape-size-value",String(e.shape.size)),ft("shape-density-value",Number(e.shape.density).toFixed(2)),ft("rules-birth",Ln(v.rules.birth)),ft("rules-survival",Ln(v.rules.survival)),ft("rules-isolation",Ln(v.rules.isolation??[])),ft("rules-overcrowd",Ln(v.rules.overcrowding??[]))}function pa(n,e,t,i){const s=ke(n),r=ke(e);if(!s||!r)return;const o=r.querySelector(".explore-error"),a=Vb(r);s.onclick=()=>{if(ca(r)){ln();return}Wh(o,null),a.hidden=!0,t(),pu(s,r,{onClose:Au}),zh()},r.querySelector("[data-cancel]").onclick=()=>ln(),r.addEventListener("input",()=>{a.hidden=!0,zh()});const l=c=>{let u;try{u=i()}catch(h){Wh(o,h.message),Xt();return}const d=_c(u);if(!c&&d&&Cb(d)){a.querySelector("p").textContent=Nb(d),a.hidden=!1,a.querySelector("[data-run]").onclick=()=>l(!0),a.querySelector("[data-back]").focus(),Xt();return}ln(),u.mode==="explore"?Cs.enterExplore():u.mode!=="none"&&Gb(u)};r.onsubmit=c=>{c.preventDefault(),l(!1)}}function Vb(n){const e=document.createElement("div");e.className="memory-confirm hud-confirm",e.setAttribute("role","alertdialog"),e.hidden=!0;const t=document.createElement("p"),i=Object.assign(document.createElement("button"),{type:"button",className:"glass-button explore-small-button",textContent:"Change settings"});i.dataset.back="",i.onclick=()=>{e.hidden=!0,n.querySelector("input, select")?.focus()};const s=Object.assign(document.createElement("button"),{type:"button",className:"glass-button explore-small-button",textContent:"Run anyway"});s.dataset.run="";const r=document.createElement("div");return r.className="explore-save-actions",r.append(i,s),e.append(t,r),n.append(e),e}let hi="explore";function $b(){const n=ke("mode-popover-list");n&&(n.replaceChildren(...Cu.map(e=>{const t=document.createElement("button");t.type="button",t.className="mode-option",t.dataset.mode=e.id,t.setAttribute("aria-pressed","false");const i=document.createElement("span");i.className="mode-option-name",i.textContent=e.name;const s=document.createElement("span");return s.className="mode-option-kind",s.textContent=e.kind,t.append(i,s),t.onclick=()=>{hi=e.id,Hh()},t})),pa("hud-change-mode","mode-popover",()=>{hi=v.simulationMode,Hh()},()=>hi===v.simulationMode?{mode:"none"}:hi==="explore"?{mode:"explore"}:bi(hi)))}function Hh(){for(const t of ke("mode-popover-list").children)t.setAttribute("aria-pressed",String(t.dataset.mode===hi));const n=Cu.find(t=>t.id===hi);ft("mode-popover-about",n?.about??"");let e=`Applying switches to ${n?.name} (${n?.kind.toLowerCase()}), with the settings it had last. Change them from its boxes.`;n?hi===v.simulationMode&&(e="This mode is running now."):e="Choose a mode to leave the contests for it.",ft("mode-popover-note",e),Xt()}function Wb(){const n=ke("sim-generations"),e=ke("sim-size");if(!(!n||!e)){n.addEventListener("input",()=>{const t=v.simulationMode,i=Math.max(1,parseInt(n.value,10)||1);t==="rule30"?e.value=String(fa(i,ke("rule30-3d").checked)):t==="sandpile"&&(e.value=String(Tb(i)))}),ke("rule30-3d").addEventListener("change",()=>n.dispatchEvent(new Event("input",{bubbles:!0})));for(const t of["grid-edge-wrap","grid-edge-walls"])ke(t).addEventListener("change",tm);pa("grid-change","grid-popover",Xb,()=>{const t=em();if(!Number.isInteger(t.generations)||t.generations<1)throw new Error("Generations must be a whole number, 1 or more.");if(!Number.isInteger(t.size)||t.size<1)throw new Error("Size must be a whole number, 1 or more.");if(!Number.isInteger(t.initialSand)||t.initialSand<0||t.initialSand>pc)throw new Error(`Initial sand must be a whole number from 0 to ${pc}.`);return t.mode==="gameOfLife"&&!t.wrap&&(t.walls=qb(Pf(Yb()))),t})}}function Xb(){const n=bi(v.simulationMode),e=n.mode;ke("sim-size").value=String(n.size),ke("sim-generations").value=String(n.generations),ke("rule30-3d").checked=n.is3D,ke("sandpile-initial-sand").value=String(n.initialSand),ke("grid-edge-wrap").checked=n.wrap,ke("grid-edge-walls").checked=!n.wrap;for(const t of Dr)ke(`wall-${t.key}-birth`).value=Ln(n.walls[t.key].birth),ke(`wall-${t.key}-survival`).value=Ln(n.walls[t.key].survival);ke("grid-size-row").hidden=e==="rule30",ke("grid-rule30-row").hidden=e!=="rule30",ke("grid-sand-row").hidden=e!=="sandpile",ke("grid-edge-row").hidden=e!=="gameOfLife",ft("grid-size-about",e==="sandpile"?"The sandpile spreads as its grains pile up, so its size follows the generations as you change them; you can still set it yourself.":""),ke("grid-size-about").hidden=e!=="sandpile",ft("grid-rule30-about","Rule 30's size follows its generations, so it has only those to set."),ft("grid-note","Applying computes the run again, from generation 0."),tm()}function em(){const n=bi(v.simulationMode),e=t=>ke(t).value.trim()===""?NaN:Number(ke(t).value);return n.generations=e("sim-generations"),n.is3D=ke("rule30-3d").checked,n.size=n.mode==="rule30"?fa(Math.max(1,n.generations||1),n.is3D):e("sim-size"),n.initialSand=e("sandpile-initial-sand"),n.wrap=ke("grid-edge-wrap").checked,n}function tm(){ke("grid-walls").hidden=ke("grid-edge-wrap").checked,Xt()}function Yb(){return Object.fromEntries(Dr.map(n=>[n.key,{birth:ke(`wall-${n.key}-birth`).value,survival:ke(`wall-${n.key}-survival`).value}]))}const qb=n=>Object.fromEntries(Dr.map(e=>[e.key,n[e.key]]));function jb(){const n=ke("life-shape");n&&(n.replaceChildren(...gc.map(e=>new Option(e.name,e.key))),n.onchange=()=>Vh(n.value),pa("life-change-seed","life-seed-popover",()=>{const e=v.lifeShapeKey??"cube";n.value=e,Vh(e)},()=>{const e=bi("gameOfLife"),t=n.value,i=Vs(t),s=i.sizeMax??e.size,r=Number(ke("life-shape-size").value),o=Number(ke("life-shape-density").value),a=Number(ke("life-shape-region").value);if(!Number.isInteger(r)||r<1||r>s)throw new Error(`${i.size??"Size"} must be a whole number from 1 to ${s}${i.sizeMax?"":", the grid's size"}.`);if(!(o>=0&&o<=1)||ke("life-shape-density").value.trim()==="")throw new Error(`${i.density??"Density"} must be from 0 to 1.`);if(i.noise&&(!Number.isInteger(a)||a<1||a>e.size))throw new Error(`The region size must be a whole number from 1 to ${e.size}, the grid's size.`);return e.shape=i.noise?{key:t,size:r,density:o,regionSize:a}:{key:t,size:r,density:o},e}))}function Vh(n){const e=Vs(n),t={...Qp(n),...v.shapeParams[n]},i=bi("gameOfLife").size;ft("life-shape-size-label",e.size??"Size"),ft("life-shape-size-hint",`1 - ${e.sizeMax??i}`),ft("life-shape-density-label",e.density??"Density"),ft("life-shape-region-hint",`1 - ${i}`),ke("life-shape-size").value=String(t.size),ke("life-shape-density").value=String(t.density),ke("life-shape-region").value=String(t.regionSize??25),ke("life-shape-region-row").hidden=!e.noise,ft("life-shape-about",e.about??"Density is the chance that each cell of the shape is alive."),ft("life-seed-note","Applying changes only the seed: the rules stay. It computes the run again, from generation 0."),Xt()}function Kb(){const n=ke("life-rule-birth"),e=ke("life-rule-survival");!n||!e||(e.addEventListener("input",$h),pa("life-change-rules","life-rules-popover",()=>{n.value=Ln(v.rules.birth),e.value=Ln(v.rules.survival),ft("life-rules-note","Applying changes only the rules: the seed stays. It computes the run again, from generation 0."),$h()},()=>{const t=bi("gameOfLife");return t.rules={birth:Si(n.value,"birth"),survival:Si(e.value,"survival")},t}))}function $h(){let n="–",e="–";try{const{isolation:t,overcrowding:i}=vc(Si(ke("life-rule-survival").value,"survival"),26);n=t.length?Ln(t):"none",e=i.length?Ln(i):"none"}catch{}ft("life-rules-isolation",n),ft("life-rules-overcrowding",e)}function ke(n){return document.getElementById(n)}function ft(n,e){const t=ke(n);t&&(t.textContent=e)}function Wh(n,e){n&&(n.hidden=!e,n.textContent=e??"")}const al=n=>Number(n).toLocaleString("en");function Ln(n){const e=[];for(let t=0;t<n.length;t++){let i=t;for(;i+1<n.length&&n[i+1]===n[i]+1;)i++;i>t?e.push(`${n[t]}-${n[i]}`):e.push(String(n[t])),t=i}return e.join(",")}const Zb=[],Jb={entries:Zb},Xh="/assets/morpheus-tech-4UhQpwQO.png",nm=2048,Qb=["deadline","generation-limit"];class im{constructor(e,{onStats:t,onStart:i,onEnd:s,onError:r,createWorker:o,seconds:a=e.seconds}={}){this.contest=e,this.run=kc(e),this.seconds=a,this.status="idle",this.points=[[0,0]],this.end=null;const l={onStats:t,onStart:i,onEnd:s,onError:r};this.driver=new la({createWorker:o,onStats:c=>{this.status==="running"&&(this.points.push([c.generationMs/1e3,c.generation]),l.onStats?.(c))},onState:(c,u,d)=>{if(c==="running"&&this.status==="idle")this.status="running",l.onStart?.(u);else if(c==="ended"&&this.status!=="ended"){this.status="ended";const h=Qb.includes(d)?Km(this.contest,u.generation,u.generationMs):null;this.points.push([u.generationMs/1e3,u.generation]),this.end={stats:u,reason:d,score:h},l.onEnd?.(this.end)}},onError:c=>l.onError?.(c)})}start(){if(this.status!=="idle")throw new Error("This Speed run has already started.");const{run:e,contest:t}=this;this.driver.start({world:{rules:e.rules,chunkSize:t.chunkSize,limits:{memory:nm*1024*1024}},seed:Int32Array.from(e.seed.flat()),run:{kind:"timed",seconds:this.seconds},generations:e.limits.generations})}stop(){this.status!=="ended"&&this.driver.worker&&this.driver.stop()}async makeResult(e=null){if(!this.end?.score)throw new Error("Only a run that scored has a result to enter.");const{stats:t,score:i}=this.end,s=await this.driver.result({run:this.run,score:i,details:{elapsedMs:t.elapsedMs,stats:t,browser:e}});return{result:s,text:Nc(s)}}close(){this.driver.close()}}function eE(n,{createWorker:e=tE}={}){const t=e();let i;const s=new Promise(o=>{i=o}),r=o=>{t.terminate(),i(o)};return t.onmessage=o=>r(o.data),t.onerror=o=>r({verdict:"error",message:o?.message??"The verifier failed."}),t.postMessage({text:n}),{promise:s,cancel:()=>r({verdict:"cancelled",message:"Cancelled."})}}function tE(){return new Worker(new URL("/assets/verify.worker-CoDvxotq.js",import.meta.url),{type:"module"})}const nE=512,Yh={methuselah:(n,{reason:e,stats:t,cycle:i})=>Jm(n,{ending:e,generation:t.generation,period:i?.period})};class iE{constructor(e,t,{onStats:i,onStart:s,onEnd:r,onError:o,createWorker:a}={}){if(!Yh[e.kind])throw new Error(`${e.title} isn't a Discovery contest this page can run.`);this.contest=e,this.run=kc(e,t),this.status="idle",this.points=[[0,this.run.seed.length]],this.end=null;const l={onStats:i,onStart:s,onEnd:r,onError:o};this.driver=new la({createWorker:a,onStats:c=>{this.status==="running"&&(this.addPoint(c),l.onStats?.(c))},onState:(c,u,d,h,p)=>{if(c==="running"&&this.status==="idle")this.status="running",l.onStart?.(u);else if(c==="ended"&&this.status!=="ended"){this.status="ended";const g={stats:u,reason:d,cycle:h??null,departures:p??null};g.score=Yh[this.contest.kind](this.contest,g),this.end=g,l.onEnd?.(g)}},onError:c=>l.onError?.(c)})}addPoint(e){const t=this.points[this.points.length-1];e.generation>t[0]&&this.points.push([e.generation,e.live])}get budget(){return this.run.limits.generations}start(){if(this.status!=="idle")throw new Error("This run has already started.");const{run:e,contest:t}=this;this.driver.start({world:{...cf(e,{chunkSize:t.chunkSize,memory:nE*1024*1024}),departures:gf(e)},seed:Int32Array.from(e.seed.flat()),run:{kind:"open",settle:!0,history:!0},generations:e.limits.generations})}stop(){this.status!=="ended"&&this.driver.worker&&this.driver.stop()}async loadHistory(){if(this.status!=="ended")throw new Error("The history is read once the run has ended.");const{live:e}=await this.driver.history();return this.points=Array.from(e,(t,i)=>[i,t]),this.points}async makeResult(e=null){if(!this.end?.score)throw new Error("Only a run that scored has a result to enter.");const{score:t,stats:{departed:i,lastDeparture:s,...r}}=this.end,o=await this.driver.result({run:this.run,score:t,details:{elapsedMs:r.elapsedMs,stats:r,browser:e}});return{result:o,text:Nc(o)}}close(){this.driver.close()}}const sE=3e3,rE=10,oE=["x","y","z"],re={driver:null,view:null,result:null,status:"idle",generation:0,wantSnapshot:!1,snapshotPending:!1,lastFrame:0,followFrom:0,dragging:!1,seekTo:null,replayed:null,extent:null,chunkSize:16,onClose:null,onReplayed:null},wt=n=>document.getElementById(n),qh=new WeakSet;function or(){return!!re.view}function aE(n,{title:e="Watch",onReplayed:t,onClose:i}={}){jo({quietly:!0});const s=Ls(n.run.contest);re.result=n,re.onClose=i??null,re.onReplayed=t??null,re.replayed=null,re.status="idle",re.generation=0,re.seekTo=null,re.dragging=!1,re.wantSnapshot=!0,re.snapshotPending=!1,re.lastFrame=0,re.followFrom=0,re.extent=null,re.chunkSize=s?.chunkSize??16,v.viewMode!=="slice"&&(v.viewMode="full"),v.sliceAxis??="x",v.sliceIndex=null;const{camera:r,controls:o}=v;r.position.set(45,35,55),o.target.set(0,0,0),qh.has(o)||(qh.add(o),o.addEventListener("start",()=>{re.followFrom=1/0}),o.addEventListener("end",()=>{re.followFrom=performance.now()+sE})),re.view=new yp(v.scene),re.view.showArena(n.run.arena),document.body.classList.add("contests-watching"),wt("contests-panel").hidden=!0,wt("contests-watch").hidden=!1,wt("contests-watch-title").textContent=e,cl("Not checked yet: the replay is checked against the result's hash when it reaches the last generation.","pending");const a=wt("contests-watch-scrub");a.min="0",a.max=String(n.generation),a.value="0",a.oninput=()=>sm(Number(a.value)),a.onpointerdown=()=>{re.dragging=!0},a.onpointerup=()=>{re.dragging=!1},a.onblur=()=>{re.dragging=!1},wt("contests-watch-close").onclick=()=>jo();const l=n.departures??null;wt("contests-watch-ticks").replaceChildren(...[...new Set((l??[]).map(h=>h.generation))].map(h=>{const p=document.createElement("option");return p.value=String(h),p})),wt("contests-watch-departures").hidden=!l,Pu(0);const c=wt("speed-control"),u=Pr(c?c.value:rE);rm(u);const d=new la({onStats:h=>{re.driver===d&&(Ko(h.generation),jh(h.extent))},onState:(h,p)=>{re.driver===d&&(re.status=h,Ko(p.generation),jh(p.extent),hE(),re.wantSnapshot=!0)},onReplayed:h=>{if(re.driver!==d)return;const p=dw(h,n.generation);re.replayed=p,cl(p.text,p.verdict),re.onReplayed?.(p)},onError:h=>re.driver===d&&cl(`The engine says: ${h}`,"not-checked")});re.driver=d,d.start({world:{...cf(n.run,{chunkSize:s?.chunkSize,memory:nm*1024*1024}),departures:gf(n.run)},seed:Int32Array.from(n.run.seed.flat()),run:{kind:"replay",rate:u,check:{run:n.run,hash:n.hash}},generations:n.generation}),wt("contests-watch-close").focus({preventScroll:!0})}function jo({quietly:n=!1}={}){if(!re.view)return;re.driver?.close(),re.driver=null,re.view.dispose(),re.view=null,re.result=null,document.body.classList.remove("contests-watching"),wt("contests-watch").hidden=!0,wt("contests-watch-scrub").oninput=null,wt("contests-watch-ticks").replaceChildren(),wt("contests-watch-departures").hidden=!0;const e=wt("playPauseIcon");e&&(e.className="play"),_i("bottom-state-value","pause"),v.renderer.render(v.scene,v.camera);const t=re.onClose;re.onClose=null,re.onReplayed=null,!n&&(wt("contests-panel").hidden=!1,t?.())}function lE(){const{driver:n}=re;n&&(re.status==="running"?n.pause():re.status==="paused"?n.resume():re.status==="ended"&&sm(0).then(e=>{re.driver===n&&e&&!e.superseded&&n.resume()}))}function ll(){re.view&&(xu(re.extent),re.wantSnapshot=!0)}function cE(){re.status==="paused"&&re.driver.step()}function uE(n){if(!re.driver)return;const e=Pr(n);re.driver.setRate(e),rm(e)}function dE(n){const{view:e,driver:t}=re;if(!e)return;if(t&&re.wantSnapshot&&!re.snapshotPending&&re.status!=="seeking"){re.wantSnapshot=!1,re.snapshotPending=!0;const s={budget:Os};v.viewMode==="slice"&&v.sliceIndex!==null&&(s.slice={axis:oE.indexOf(v.sliceAxis),index:v.sliceIndex}),t.snapshot(s).then(r=>{re.view===e&&(re.chunkSize=r.chunkSize,e.show(r),Ko(r.generation),re.status==="running"&&(re.wantSnapshot=!0))}).catch(()=>{}).finally(()=>{re.view===e&&(re.snapshotPending=!1)})}const i=re.lastFrame?Math.min(n-re.lastFrame,100):16;re.lastFrame=n,e.showGrid(!!v.showWireframeGrid,re.extent,re.chunkSize),e.frame({camera:v.camera,controls:v.controls,elapsedMs:i,follow:n>=re.followFrom,cellSize:v.cellSize??1.2,flip:v.flipOrientation}),v.controls?.enabled&&v.controls.update(),v.renderer.render(v.scene,v.camera)}function sm(n){const{driver:e}=re;return e?(re.seekTo=n,Pu(n),e.seek(n).then(t=>(re.driver!==e||t.superseded||(re.seekTo=null,Ko(t.generation),re.wantSnapshot=!0),t)).catch(()=>null)):Promise.resolve(null)}function Ko(n){re.generation=n,re.seekTo===null&&(Pu(n),re.dragging||(wt("contests-watch-scrub").value=String(n)))}function jh(n){re.extent=n,xu(n)&&(re.wantSnapshot=!0)}function Pu(n){const e=re.result?.generation??0,t=lw(n,e);_i("contests-watch-generation",t),_i("bottom-gen",t),_i("contest-hud-generation",t);const i=re.result?.departures;i&&_i("contests-watch-departures",cw(i,n))}function hE(){const n=wt("playPauseIcon");n&&(n.className=re.status==="running"?"pause":"play"),wt("stepButton")?.classList.toggle("disabled",re.status!=="paused"),_i("bottom-state-value",{running:"play",paused:"pause",seeking:"seek",ended:"end"}[re.status]??re.status),_i("contest-hud-status",re.status==="ended"?"Watched":"Watching")}function rm(n){_i("bottom-speed-value",n===null?"max":`${Math.round(n)}`)}function cl(n,e){const t=wt("contests-watch-verified");t.textContent=n,t.dataset.verdict=e}function _i(n,e){const t=wt(n);t&&(t.textContent=e)}const xc="lab@morpheustech.net",fE="Hall of Fame: yes, show my name, picture, score, browser and date.";function pE(n,e,t){return`[${n.title}] ${Cr(n,e,t)}`}function mE({contest:n,score:e,browser:t,hash:i,fileName:s,ending:r,run:o,departures:a}){const l=[`My entry for ${n.title} (${n.id}).`,"",`Score: ${Cr(n,e,r)}${n.kind==="speed"&&e.ms!==null?" (the ceiling, so the time ranks it)":""}`];return n.kind==="methuselah"&&o&&l.push(`Rules: ${Ji(o.rules)}`,`Seed: ${le(o.seed.length)} cell${o.seed.length===1?"":"s"}`),n.departures&&a&&l.push(`Ships: ${du(a)}`),l.push(`Result file: ${s} (attached)`,`Hash: ${i}`,"","Name to show: ",`Browser and version: ${t?`${t.name} ${t.version}`:""}`),n.kind==="speed"&&l.push("Hardware (optional): "),l.push("","Keep the next line to appear in the Hall of Fame, or delete it to opt out: the entry is still verified, but not listed.",fE),n.kind==="methuselah"&&l.push(`${n.title}'s Hall of Fame also shows the entry's rules and its seed's cell count, from the result file.`),l.push("","Picture (optional): attach a PNG or JPEG, square, at most 1 MB. It must be yours to use, show no other people, and break nothing in the code of conduct. The lab resizes it to 128 x 128 and strips its metadata, and may decline a picture or a name.","","The lab's repo is public: once committed, your name and picture are in its history and in every copy of it. Removal on request takes them off the site and out of the current files, but can't erase every copy.","","Your email address is used only to reply about this entry. It is never published, committed or put in a result file."),n.kind==="speed"&&l.push("","Speed's timing is self-reported: a replay proves the generation, not how long it took. Top entries may be asked for a screen recording of a run on lab.morpheustech.net."),`${l.join(`
`)}
`}function gE(n,e){return`mailto:${xc}?subject=${encodeURIComponent(n)}&body=${encodeURIComponent(e)}`}const _E=10,Kh=40,vE=/^hall-of-fame\/[a-z0-9][a-z0-9-]*\.(png|jpg)$/,xE=/^hall-of-fame\/results\/[a-z0-9][a-z0-9-]*\.json$/,yE=["contest","name","picture","score","browser","date","result"],SE={methuselah:["rules","seedCells"]},ME={speed:(n,e)=>Zm(n.score,e.score),methuselah:Qm};class Kt extends Error{constructor(e){super(e),this.name="HallOfFameError"}}const ar=n=>n!==null&&typeof n=="object"&&!Array.isArray(n)&&Object.getPrototypeOf(n)===Object.prototype;function wE(n){if(typeof n!="string"||!/^\d{4}-\d{2}-\d{2}$/.test(n))return!1;const[e,t,i]=n.split("-").map(Number),s=new Date(Date.UTC(e,t-1,i));return s.getUTCFullYear()===e&&s.getUTCMonth()===t-1&&s.getUTCDate()===i}function bE(n,e){if(!ar(n))throw new Kt(`${e} must be an object.`);const t=typeof n.contest=="string"?Ls(n.contest)?.kind:void 0,i=[...yE,...SE[t]??[]],s=Object.keys(n),r=i.filter(g=>!s.includes(g)),o=s.filter(g=>!i.includes(g));if(r.length)throw new Kt(`${e} has no ${r[0]}.`);if(o.length)throw new Kt(`${e} has an unknown field, ${JSON.stringify(o[0])}.`);const{contest:a,name:l,picture:c,score:u,browser:d,date:h,result:p}=n;if(typeof a!="string"||!Ls(a))throw new Kt(`${e}.contest must be one of this lab's contests.`);if(typeof l!="string"||l.trim()!==l||!l||l.length>Kh||/[\u0000-\u001f\u007f]/.test(l))throw new Kt(`${e}.name must be text of 1 to ${Kh} characters, with no spaces at either end.`);if(c!==null&&(typeof c!="string"||!vE.test(c)))throw new Kt(`${e}.picture must be null or a .png or .jpg under hall-of-fame/.`);if(!ar(u)||!Object.values(u).every(g=>g===null||Number.isSafeInteger(g)&&g>=0))throw new Kt(`${e}.score must be an object of whole numbers or nulls, as in its result file.`);if(d!==null&&!(ar(d)&&Ps(Object.keys(d).sort())==='["name","version"]'&&["name","version"].every(_=>typeof d[_]=="string"&&d[_].length<=fu)))throw new Kt(`${e}.browser must be null or {name, version}, as in its result file.`);if(!wE(h))throw new Kt(`${e}.date must be the day the entry arrived, as YYYY-MM-DD.`);if("rules"in n){const{rules:g}=n,_=f=>Array.isArray(f)&&f.every((M,b)=>Number.isSafeInteger(M)&&M>=0&&M<=26&&(b===0||M>f[b-1]));if(!(ar(g)&&Ps(Object.keys(g).sort())==='["birth","survival"]'&&_(g.birth)&&_(g.survival)))throw new Kt(`${e}.rules must be {birth, survival}, as in its result file.`)}if("seedCells"in n&&!(Number.isSafeInteger(n.seedCells)&&n.seedCells>=1))throw new Kt(`${e}.seedCells must be the number of cells in its seed, as in its result file.`);if(typeof p!="string"||!xE.test(p))throw new Kt(`${e}.result must be a .json under hall-of-fame/results/.`)}function EE(n){if(!ar(n)||Ps(Object.keys(n))!=='["entries"]'||!Array.isArray(n.entries))throw new Kt('The Hall of Fame must be {"entries": [...]}.');const e=new Set;return n.entries.forEach((t,i)=>{if(bE(t,`entries[${i}]`),e.has(t.result))throw new Kt(`entries[${i}].result is another entry's too.`);e.add(t.result)}),n.entries}function TE(n,e){const t=ME[e.kind]??(()=>0);return n.map((i,s)=>({entry:i,order:s})).filter(({entry:i})=>i.contest===e.id).sort((i,s)=>t(i.entry,s.entry)||(i.entry.date<s.entry.date?-1:i.entry.date>s.entry.date?1:0)||i.order-s.order).map(({entry:i})=>i)}function AE(n){const[e,t,i]=n.split("-").map(Number);return new Date(Date.UTC(e,t-1,i)).toLocaleDateString("en-GB",{day:"numeric",month:"short",year:"numeric",timeZone:"UTC"})}const Zh="http://www.w3.org/2000/svg",ma=Object.freeze({speed:Object.freeze({color:"#f2c14e",name:"Speed"}),methuselah:Object.freeze({color:"#b39cff",name:"Methuselah"}),"classic-methuselah":Object.freeze({color:"#e29cf5",name:"Classic Methuselah"}),"contained-chaos":Object.freeze({color:"#4fd1c5",name:"Contained chaos"})}),RE={speed:[["circle",{cx:14,cy:13.5,r:7.5}],["path",{d:"M14 13.5 L17.2 10.3"}],["path",{d:"M12 3.5 H16 M14 3.5 V6"}],["path",{d:"M19.6 6.4 L21 5"}],["path",{d:"M1.5 10.5 H4.5 M0.8 13.5 H4 M1.5 16.5 H4.5"}]],methuselah:[["path",{d:"M6 2.5 H18 M6 21.5 H18"}],["path",{d:"M7.5 2.5 C7.5 8 11 9.5 12 12 C13 9.5 16.5 8 16.5 2.5"}],["path",{d:"M7.5 21.5 C7.5 16 11 14.5 12 12 C13 14.5 16.5 16 16.5 21.5"}],["path",{d:"M9.3 20.3 C10 18.2 11.3 17.4 12 17.2 C12.7 17.4 14 18.2 14.7 20.3 Z",fill:"currentColor",stroke:"none"}]],"classic-methuselah":[["path",{d:"M2 2.5 H13 M2 21.5 H13"}],["path",{d:"M3.3 2.5 C3.3 8 6.6 9.5 7.5 12 C8.4 9.5 11.7 8 11.7 2.5"}],["path",{d:"M3.3 21.5 C3.3 16 6.6 14.5 7.5 12 C8.4 14.5 11.7 16 11.7 21.5"}],["path",{d:"M5 20.3 C5.7 18.2 6.9 17.4 7.5 17.2 C8.1 17.4 9.3 18.2 10 20.3 Z",fill:"currentColor",stroke:"none"}],["path",{d:"M14.5 9.5 H16.5 M14 12 H16 M14.5 14.5 H16.5"}],["rect",{x:18,y:8.6,width:2.4,height:2.4,rx:.4,fill:"currentColor",stroke:"none"}],["rect",{x:20.6,y:10.8,width:2.4,height:2.4,rx:.4,fill:"currentColor",stroke:"none"}],["rect",{x:18,y:13,width:2.4,height:2.4,rx:.4,fill:"currentColor",stroke:"none"}]],verify:[["circle",{cx:12,cy:3.6,r:1.1}],["path",{d:"M12 4.7 V20 M8 20.5 H16 M4.5 7 H19.5"}],["path",{d:"M4.5 7 L2.2 13.2 M4.5 7 L6.8 13.2 M19.5 7 L17.2 13.2 M19.5 7 L21.8 13.2"}],["path",{d:"M1.8 13.2 H7.2 C6.8 15.6 2.2 15.6 1.8 13.2 Z M16.8 13.2 H22.2 C21.8 15.6 17.2 15.6 16.8 13.2 Z"}]],"contained-chaos":[["rect",{x:2.5,y:2.5,width:19,height:19,rx:3}],["path",{d:"M6 15 C7 8 10 17.5 11.5 10 C12.5 5.5 15.5 7.5 13.5 12 C11.8 15.8 16.5 18 18 9.5"}],["circle",{cx:7.5,cy:7,r:.9,fill:"currentColor",stroke:"none"}],["circle",{cx:17.5,cy:17.5,r:.9,fill:"currentColor",stroke:"none"}],["circle",{cx:9,cy:18.5,r:.9,fill:"currentColor",stroke:"none"}]]};function ks(n){return n.kind==="methuselah"&&n.departures?"classic-methuselah":n.kind}function Lu(n,e=48,t="contests-logo"){return am(n,e,t,ma[n]?.color)}function om(n=22,e="contests-verify-glyph"){return am("verify",n,e)}function am(n,e,t,i){const s=document.createElementNS(Zh,"svg"),r={class:t,viewBox:"0 0 24 24",width:e,height:e,fill:"none",stroke:"currentColor","stroke-width":1.6,"stroke-linecap":"round","stroke-linejoin":"round","aria-hidden":"true"};for(const[o,a]of Object.entries(r))s.setAttribute(o,String(a));i&&(s.style.color=i);for(const[o,a]of RE[n]??[]){const l=document.createElementNS(Zh,o);for(const[c,u]of Object.entries(a))l.setAttribute(c,String(u));s.append(l)}return s}const CE=["speed","methuselah"],PE=n=>CE.includes(n.kind),lm="The time is measured by your own browser, on your own machine. Replaying a result proves that its generation is right, but not how long it took, so the Speed board is self-reported.",cm="Your score depends only on the seed and the rules, never on time or the machine: anyone replaying the result file, in the lab or with scripts/verify.mjs, gets the same ending and the same score.",LE="This is a stricter methuselah than classic Life's: the whole pattern must settle inside the arena, and anything that flies off ends the run unscored. Classic Methuselah lets ships leave.",DE=n=>`Unlike Methuselah, a ship may leave the arena here: an island that reaches a wall and is a ship heading out, of period up to ${n.departures.period}, the longest recognised, is deleted and listed as a departure, and the rest of the pattern must still settle.`,xe={open:!1,contest:null,run:null,startedAt:0,verify:null,view:null,entries:new Map,refused:null,designInExplore:null,resume:null},St=n=>document.getElementById(n);function B(n,e={},...t){const i=document.createElement(n);e.className&&(i.className=e.className),e.text!==void 0&&(i.textContent=e.text),e.onclick&&(i.onclick=e.onclick);for(const[s,r]of Object.entries(e.attrs??{}))i.setAttribute(s,r);return i.append(...t.filter(Boolean)),i}function Dt(n,e,{main:t=!1,id:i,title:s}={}){const r={type:"button"};return i&&(r.id=i),s&&(r.title=s),B("button",{className:`glass-button contests-button${t?" contests-button--main":""}`,text:n,onclick:e,attrs:r})}function ga(n="Verify a result",{wide:e=!1}={}){return B("button",{className:`contests-verify-button${e?" contests-verify-button--wide":""}`,onclick:n1,attrs:{type:"button",id:"contests-verify"}},om(e?28:20),B("span",{className:"contests-verify-text"},B("span",{className:"contests-verify-label",text:n}),e?B("span",{className:"contests-verify-sub",text:"Replay a result file from any contest to check it, in your browser"}):null))}function Du(n,e){const t=B("dl",{className:"contests-facts"});return n.forEach(([i,s],r)=>{const o=B("dd",{},typeof s=="string"?document.createTextNode(s):s);e&&(o.id=`${e}-${r}`),t.append(B("dt",{text:i}),o)}),t}function Qn(n,e,t){xe.view=n,St("contests-panel-title").textContent=e,St("contests-panel-body").replaceChildren(...t.filter(Boolean)),Wt("");const i=St("contests-panel-body");(i.querySelector(".contests-button--main:not([disabled])")??i.querySelector("button:not([disabled])"))?.focus({preventScroll:!0})}function Wt(n){St("contests-panel-status").textContent=n}function un(n,e,t){n!==void 0&&(St("contest-hud-name").textContent=n),e!==void 0&&(St("contest-hud-status").textContent=e),t!==void 0&&(St("contest-hud-generation").textContent=t)}function IE({designInExplore:n=null}={}){xe.open=!0,xe.designInExplore=n,St("contests-panel").hidden=!1;const e=St("contests-verify-file");e.onchange=()=>{const s=e.files?.[0];e.value="",s&&i1(s)};const t=St("contests-seed-file");t.onchange=()=>{const s=t.files?.[0];t.value="",s&&xe.contest&&WE(xe.contest,s)};const i=xe.resume;xe.resume=null,i?Ur(i):Ir()}function UE(){xe.open=!1,jo({quietly:!0}),$s(),Iu(),St("contests-panel").hidden=!0,St("contests-panel-body").replaceChildren(),xe.view=null}function NE(n){if(xe.view!=="running"||!xe.startedAt||!(xe.run instanceof im))return;const e=n-xe.startedAt,t=St("contests-countdown");t&&(t.textContent=wp(xe.run.seconds,e));const i=St("contests-clock-arc");i&&(i.style.strokeDashoffset=String(Math.min(100,e/(xe.run.seconds*1e3)*100)))}function $s(){xe.run?.close(),xe.run=null,xe.startedAt=0}function Iu(){xe.verify?.cancel(),xe.verify=null}function FE(n){const e=B("button",{className:"contests-tile",onclick:()=>Ur(n),attrs:{type:"button",id:`contests-open-${n.id}`}},Lu(ks(n),56,"contests-tile-logo"),B("span",{className:"contests-tile-name",text:n.title}),B("span",{className:"contests-tile-about",text:n.summary}),B("span",{className:"contests-tile-foot",text:"Open"}));return e.style.setProperty("--contest-color",ma[ks(n)].color),e}function Ir(){$s(),Iu(),xe.contest=null,un("–","Choosing","–");const n=B("div",{className:"contests-tiles"},...ko.filter(PE).map(FE));Qn("list",Mr,[B("p",{text:"Three contests on the engine of Game of Life 3D (unbounded). Each fixes its own rules, and all run on the CPU, so every entrant runs the same thing. Anyone can check any result by replaying it.",attrs:{id:"contests-list-about"}}),B("p",{className:"contests-closes",text:hu(ko),attrs:{id:"contests-closes"}}),n,B("div",{className:"contests-judge"},B("span",{className:"contests-judge-title",text:"For every contest"}),ga("Verify a result",{wide:!0}))])}function yn(n,...e){return B("section",{className:"contests-section"},B("h3",{className:"contests-section-title",text:n}),...e)}function Yn(n,e,t){return B("div",{className:"contests-fact"},B("span",{className:"contests-fact-label",text:n}),B("span",{className:"contests-fact-value",text:e}),B("span",{className:"contests-fact-about",text:t}))}function um(n,e,{disabled:t=!1}={}){const i=B("button",{className:"contests-run-button",onclick:()=>KE(n),attrs:{type:"button",id:"contests-run"}},B("span",{className:"contests-run-icon",attrs:{"aria-hidden":"true"}}),B("span",{className:"contests-run-text"},B("span",{className:"contests-run-label",text:`Run ${n.title}`}),B("span",{className:"contests-run-sub",text:e})));return i.disabled=t,i}function dm(n){const e=B("div",{className:"contests-page-head"},Lu(ks(n),64,"contests-page-logo"),B("div",{},B("p",{className:"contests-page-kicker",text:`A ${Mr} contest`}),B("p",{className:"contests-page-summary",text:`${n.summary}.`}),B("p",{className:"contests-closes",text:hu([n])})));return e.style.setProperty("--contest-color",ma[ks(n)].color),e}function Ur(n){if($s(),xe.contest=n,un(n.title,"Ready","–"),n.kind==="methuselah"){OE(n);return}const{fixes:e}=n,{birth:t,survival:i}=e.rules,s=o=>o.length>1?`${o[0]}–${o[o.length-1]}`:String(o[0]),r=um(n,`${n.seconds} seconds, on your machine`);Qn("contest",n.title,[dm(n),r,yn("What everyone runs",B("div",{className:"contests-facts-grid"},Yn("Seed","Cube10",`All ${le(e.seed.length)} cells of the 10³ seed box, cells −5 to 4 on each axis`),Yn("Rules",Ji(e.rules),`A cell is born with ${s(t)} live neighbours, and survives with ${s(i)}`),Yn("Time",`${n.seconds} seconds`,"Timed by your own browser"),Yn("Ceiling",`${le(n.ceiling)} generations`,"A run that reaches it sooner also scores its time"))),fm(n),yn("How it runs",B("p",{text:`On the CPU, in a background thread (a Web Worker), with chunks of ${n.chunkSize}³ cells, so every entrant runs the same engine. Nothing is drawn while it runs, so the run has your machine to itself. Your score is the generations completed in the ${n.seconds} seconds. Runs that reach the ceiling of ${le(n.ceiling)} all have the same generations, so they rank by the time they took, to the millisecond.`})),yn("Fair play",B("p",{className:"contests-note",text:lm})),B("div",{className:"contests-actions"},ga(),Dt("Back",Ir,{id:"contests-back"}))]),r.focus({preventScroll:!0})}function OE(n){const e=xe.entries.get(n.id)??null,{fixes:t}=n,i=r=>r.max[0]-r.min[0]+1,s=um(n,e?`Up to ${le(n.budget)} generations, on your machine: it can take a few minutes`:"Load a seed first",{disabled:!e});Qn("contest",n.title,[dm(n),kE(n,e),s,yn("What the contest fixes",B("div",{className:"contests-facts-grid"},Yn("Arena",ac(t.arena),`Cells ${t.arena.min[0]} to ${t.arena.max[0]} on each axis. The cells never see its walls: it only decides when a run is over`),Yn("Seed box",`${i(t.seedBox)}³`,`Your seed: 1 to ${le(i(t.seedBox)**3)} cells, all within cells ${t.seedBox.min[0]} to ${t.seedBox.max[0]} on each axis, never shifted`),Yn("Budget",`${le(n.budget)} generations`,`A pattern still unsettled at generation ${le(n.budget)} scores nothing`),Yn("Top score",le(n.budget-1),`A run scores once its final state or cycle closes, by generation ${le(n.budget)}`),n.departures?Yn("Ships leave",`Period ≤ ${n.departures.period}`,"A ship heading out through a wall is deleted and listed; anything else at the edge ends the run"):null)),yn("How a run ends",BE(n),n.departures?B("p",{className:"contests-note",text:DE(n),attrs:{id:"contests-differs"}}):B("p",{className:"contests-note",text:LE,attrs:{id:"contests-strict"}})),fm(n),yn("How it runs",B("p",{text:`On the CPU, in a background thread (a Web Worker), with chunks of ${n.chunkSize}³ cells, and nothing drawn while it runs. A run can take a few minutes. A repeat is confirmed cell for cell before it ends a run.${n.departures?` A ship needs no catalogue: under your rules, an island at a wall is a ship if, run alone, it returns to its own shape, moved, within ${n.departures.period} generations.`:""} Equal scores rank by fewer seed cells, then the earlier submission.`})),yn("Fair play",B("p",{className:"contests-note",text:cm})),B("div",{className:"contests-actions"},ga(),Dt("Back",Ir,{id:"contests-back"}))]),(e?s:St("contests-load-seed"))?.focus({preventScroll:!0})}function BE(n){const e=le(n.budget),t=n.departures,i=[["Death","No live cells remain, by generation "+le(n.budget-1),"The generation the last cell died"],["Repeat",`The cells equal, in place, those of an earlier generation h, by generation ${e}${t?", with no ship leaving in the cycle":""}`,"h, where the final cycle began"],t?["Emits","The cells repeat, but ships leave the arena during the cycle","None: it never settles"]:null,t?["Edge",`A step would bring a cell to life outside the arena, from something that isn't a ship of period up to ${le(t.period)} heading out`,"None"]:["Edge","A step would bring a cell to life outside the arena","None"],["Budget",`Generation ${e} is reached unsettled`,"None"]].filter(Boolean);return B("table",{className:"contests-endings",attrs:{id:"contests-endings"}},B("thead",{},B("tr",{},B("th",{text:"Ending"}),B("th",{text:"When"}),B("th",{text:"Score"}))),B("tbody",{},...i.map(([s,r,o])=>B("tr",{},B("th",{text:s,attrs:{scope:"row"}}),B("td",{text:r}),B("td",{text:o})))))}function kE(n,e){const t=Dt(e?"Load another simulation…":"Load simulation…",()=>St("contests-seed-file").click(),{main:!e,id:"contests-load-seed"}),i=xe.designInExplore?Dt("Design a seed…",()=>zE(n),{id:"contests-design-seed",title:"Opens the seed editor in Game of Life 3D (unbounded), in this contest's arena"}):null,s=xe.refused?.contest===n.id?B("p",{className:"contests-refused",text:xe.refused.message,attrs:{id:"contests-entry-refused",role:"alert"}}):null;if(!e)return yn("Your entry",B("p",{text:"A simulation file: a seed and its rules.",attrs:{id:"contests-entry-none"}}),s,B("div",{className:"contests-actions"},t,i));const r=e.seed.length,o=eg(e.rules);return yn("Your entry",B("div",{className:"contests-entry"},HE(e.seed,n.fixes.seedBox),B("div",{className:"contests-entry-facts"},Du([["Seed",`${le(r)} cell${r===1?"":"s"}`],["Rules",Ji(e.rules)],["File",e.source]],"contests-entry"))),...o.map(a=>B("p",{className:"contests-warning",text:a,attrs:{id:"contests-entry-warning",role:"note"}})),s,B("div",{className:"contests-actions"},t,i))}function zE(n){const e=xe.designInExplore;if(!e)return;xe.resume=n;const{arena:t}=n.fixes;e({note:`For ${n.title}: keep the seed in this 10³ box, Use it, and save the simulation with the Simulation box's save icon. The Contests banner brings you back.`,arena:t.max[0]-t.min[0]+1,title:n.title,ships:!!n.departures})}const GE="http://www.w3.org/2000/svg";function HE(n,e){const t=fw(n,e),i=(r,o)=>{const a=document.createElementNS(GE,r);for(const[l,c]of Object.entries(o))a.setAttribute(l,String(c));return a},s=i("svg",{class:"contests-seed-picture",viewBox:`0 0 ${t.width} ${t.height}`,width:t.width,height:t.height,role:"img","aria-label":`The seed: ${le(n.length)} live cells in the seed box`,id:"contests-seed-picture"});s.append(i("polygon",{class:"contests-seed-box",points:t.outline}));for(const r of t.cubes)s.append(i("polygon",{class:"contests-seed-top",points:r.top}),i("polygon",{class:"contests-seed-right",points:r.right}),i("polygon",{class:"contests-seed-left",points:r.left}));return s.append(i("path",{class:"contests-seed-edges",d:t.edges})),s}function VE(n,{rules:e,cells:t},i){const s=[];for(let o=0;o<t.length;o+=3)s.push([t[o],t[o+1],t[o+2]]);let r;try{r=kc(n,{rules:e,seed:s})}catch(o){if(!(o instanceof Ne))throw o;const a=$E(s,n.fixes.seedBox);return a>1?`${o.message} ${le(a)} of its ${le(s.length)} cells are outside it.`:o.message}return xe.entries.set(n.id,{rules:r.rules,seed:r.seed,source:i}),null}function $E(n,e){return n.filter(t=>t.some((i,s)=>i<e.min[s]||i>e.max[s])).length}async function WE(n,e){const t=xe.view;let i=null;if(e.size>64*1024*1024)i="The file is larger than 64 MB, so it isn't a simulation file. It wasn't read.";else try{const s=await e.text(),r=vf(s);i=r.rules?VE(n,r,e.name):"This is a seed file: it holds cells, but no rules, so it isn't a simulation, and an entry is one. In Game of Life 3D (unbounded), load it in the Seed box, set the rules, and save both with the Simulation box's save icon, as a simulation file."}catch(s){i=/"format"\s*:\s*"morpheus-tech-lab\/result"/.test(await e.slice(0,4096).text().catch(()=>""))?"This is a result file, not a simulation file. Check one with Verify a result; load a simulation saved with Save simulation.":s?.message??String(s)}xe.contest!==n||xe.view!==t||!xe.open||(xe.refused=i?{contest:n.id,message:`Not loaded: ${i}`}:null,Ur(n),i||Wt(`Loaded ${e.name}.`))}const hm=n=>`/${n}`;function fm(n){let e;try{e=TE(EE(Jb),n)}catch(i){return yn("Hall of Fame",B("p",{className:"contests-note",text:`The Hall of Fame couldn't be read: ${i.message}`}))}if(!e.length)return yn("Hall of Fame",B("p",{className:"contests-hof-empty",text:`No entries yet. Run ${n.title}, then Submit by email from your results card: once verified, entries are listed here.`,attrs:{id:"contests-hof-empty"}}));const t=e.slice(0,_E);return yn("Hall of Fame",B("ol",{className:"contests-hof",attrs:{id:"contests-hof"}},...t.map((i,s)=>XE(i,s+1,n))),e.length>t.length?B("p",{className:"contests-note",text:`The top ${t.length} of ${le(e.length)} entries.`}):null)}function XE(n,e,t){const i=B("img",{className:"contests-hof-picture",attrs:{src:n.picture?hm(n.picture):Xh,alt:"",width:"40",height:"40",loading:"lazy",decoding:"async"}});i.onerror=()=>{i.onerror=null,i.src=Xh},n.picture||i.classList.add("contests-hof-picture--logo");const s=Cr(t,n.score),r=Dt("Watch",null,{id:`contests-hof-watch-${e}`});r.onclick=()=>qE(n,`Hall of Fame: ${n.name}, ${s}`,r),r.setAttribute("aria-label",`Watch ${n.name}'s run`);const o=n.browser?`${n.browser.name} ${n.browser.version}`:"Browser not given";return B("li",{className:"contests-hof-entry"},B("span",{className:"contests-hof-place",text:String(e)}),i,B("span",{className:"contests-hof-who"},B("span",{className:"contests-hof-name",text:n.name}),B("span",{className:"contests-hof-meta",text:`${o} · ${AE(n.date)}`})),YE(t,n),r)}function YE(n,e){const{main:t,detail:i}=tw(n,e.score,e);return B("span",{className:"contests-hof-score"},B("span",{className:"contests-hof-score-main",text:t}),i?B("span",{className:"contests-hof-score-detail",text:i}):null)}async function qE(n,e,t){const i=xe.view;Wt("Loading the entry's result file…");let s;try{const r=await fetch(hm(n.result));if(!r.ok)throw new Error(`the site answered ${r.status}.`);const o=await r.text();if(o.length>Dn)throw new Error(`it is larger than ${Dn/1024/1024} MB.`);s=Fc(o)}catch(r){xe.view===i&&Wt(`It can't be watched: ${r?.message??r}`);return}xe.view!==i||!xe.open||(Wt(""),Fu(s,e,t))}const jE="http://www.w3.org/2000/svg";function At(n,e={},t){const i=document.createElementNS(jE,n);for(const[s,r]of Object.entries(e))i.setAttribute(s,String(r));return t!==void 0&&(i.textContent=t),i}function Uu(n){return n.kind==="speed"?{seconds:n.seconds,label:"Generations completed over the run",title:"Generations completed",subtitle:`over the ${n.seconds} seconds: the steeper the line, the faster the machine`,xTitle:"Time (seconds)",yTitle:"Generations",readout:e=>`${e.at.toFixed(2)} s · ${le(e.value)} generations`,columns:["Time (s)","Generations"],row:([e,t])=>[e.toFixed(2),le(t)]}:{label:"Live cells by generation",title:"Live cells",subtitle:"by generation: how the pattern grew, and where it settled",xTitle:"Generation",yTitle:"Live cells",readout:e=>`generation ${le(e.at)} · ${le(e.value)} live cells`,columns:["Generation","Live cells"],row:([e,t])=>[le(e),le(t)]}}function Nu(n,{table:e=!1}={}){const{seconds:t}=n,i=At("svg",{class:"contests-chart-svg",role:"img","aria-label":n.label}),s=B("div",{className:"contests-chart-readout",attrs:{"aria-hidden":"true"}});s.hidden=!0;const r=e?B("details",{className:"contests-chart-table"},B("summary",{text:"Show the data as a table"})):null,o=B("figure",{className:"contests-chart"},B("figcaption",{className:"contests-chart-caption"},B("span",{className:"contests-chart-title",text:n.title}),B("span",{className:"contests-chart-subtitle",text:n.subtitle})),B("div",{className:"contests-chart-plot"},i,s),r);let a=null,l=[];function c(){const _=Math.max(280,Math.round(i.parentElement?.clientWidth||520));h=Math.round(o.clientWidth);const m=Math.round(Math.min(260,Math.max(200,_*.42)));i.setAttribute("viewBox",`0 0 ${_} ${m}`),i.setAttribute("width",_),i.setAttribute("height",m),a=KM(l,{seconds:t,width:_,height:m});const{plot:f}=a,M=[];for(const b of a.yTicks)M.push(At("line",{class:"contests-chart-grid",x1:f.left,x2:f.right,y1:b.at,y2:b.at})),M.push(At("text",{class:"contests-chart-tick",x:f.left-8,y:b.at,"text-anchor":"end","dominant-baseline":"middle"},b.label));for(const b of a.xTicks)M.push(At("text",{class:"contests-chart-tick",x:b.at,y:f.bottom+16,"text-anchor":"middle"},b.label));M.push(At("line",{class:"contests-chart-axis",x1:f.left,x2:f.right,y1:f.bottom,y2:f.bottom})),M.push(At("text",{class:"contests-chart-axis-title",x:(f.left+f.right)/2,y:m-4,"text-anchor":"middle"},n.xTitle)),M.push(At("text",{class:"contests-chart-axis-title",x:0,y:0,"text-anchor":"middle",transform:`translate(14 ${(f.top+f.bottom)/2}) rotate(-90)`},n.yTitle)),a.end&&(M.push(At("path",{class:"contests-chart-area",d:a.area})),M.push(At("polyline",{class:"contests-chart-line",points:a.line})),M.push(At("circle",{class:"contests-chart-dot",cx:a.end.x,cy:a.end.y,r:4})),M.push(At("text",{class:"contests-chart-end",x:a.end.x+8,y:a.end.y,"dominant-baseline":"middle"},a.end.label))),M.push(At("line",{class:"contests-chart-crosshair",y1:f.top,y2:f.bottom,x1:0,x2:0,visibility:"hidden"})),M.push(At("circle",{class:"contests-chart-dot contests-chart-hover",r:4,cx:0,cy:0,visibility:"hidden"})),i.replaceChildren(...M)}function u(_){if(!a?.end)return;const m=i.getBoundingClientRect(),f=(_.clientX-m.left)/m.width*i.viewBox.baseVal.width,M=a.nearest(f);if(!M)return;const[b,E]=[i.querySelector(".contests-chart-crosshair"),i.querySelector(".contests-chart-hover")];b.setAttribute("x1",M.x),b.setAttribute("x2",M.x),b.setAttribute("visibility","visible"),E.setAttribute("cx",M.x),E.setAttribute("cy",M.y),E.setAttribute("visibility","visible"),s.textContent=n.readout(M),s.hidden=!1;const L=m.width/i.viewBox.baseVal.width;s.style.left=`${Math.min(M.x*L+10,m.width-s.offsetWidth-4)}px`,s.style.top=`${Math.max(0,M.y*L-34)}px`}function d(){i.querySelector(".contests-chart-crosshair")?.setAttribute("visibility","hidden"),i.querySelector(".contests-chart-hover")?.setAttribute("visibility","hidden"),s.hidden=!0}i.addEventListener("pointermove",u),i.addEventListener("pointerleave",d);let h=0;typeof ResizeObserver=="function"&&new ResizeObserver(([_])=>{const m=Math.round(_.contentRect.width);m&&m!==h&&a&&c()}).observe(o);let p=null;function g(){if(!r?.open||p===l)return;p=l,r.querySelector("table")?.remove();const _=l.map(m=>B("tr",{},...n.row(m).map(f=>B("td",{text:f}))));r.append(B("table",{},B("thead",{},B("tr",{},...n.columns.map(m=>B("th",{text:m})))),B("tbody",{},..._)))}return r?.addEventListener("toggle",g),{node:o,update(_){l=_.slice(),c(),g()}}}function Zo(n,e){return B("div",{className:"contests-stats"},...n.map(([t,i],s)=>B("div",{className:"contests-stat"},B("span",{className:"contests-stat-label",text:t}),B("span",{className:"contests-stat-value",text:i,attrs:e?{id:`${e}-${s}`}:{}}))))}function KE(n){if(n.kind==="methuselah"){ZE(n);return}$s();const e=Nu(Uu(n)),t=new im(n,{onStart:()=>{xe.run===t&&(xe.startedAt=performance.now(),un(void 0,"Running"))},onStats:s=>xe.run===t&&QE(s,e),onEnd:s=>xe.run===t&&mm(t,s),onError:s=>xe.run===t&&Wt(`The engine says: ${s}`)});xe.run=t;const i=At("svg",{class:"contests-clock-ring",viewBox:"0 0 160 160","aria-hidden":"true"});i.append(At("circle",{class:"contests-clock-track",cx:80,cy:80,r:72}),At("circle",{class:"contests-clock-arc",cx:80,cy:80,r:72,pathLength:100,id:"contests-clock-arc"})),Qn("running",`${n.title}: running`,[B("div",{className:"contests-run-top"},B("div",{className:"contests-clock"},i,B("div",{className:"contests-clock-face"},B("span",{className:"contests-countdown-value",text:wp(n.seconds,0),attrs:{id:"contests-countdown"}}),B("span",{className:"contests-clock-unit",text:"seconds left"}))),Zo(Bs(pm(n)),"contests-stat")),e.node,B("div",{className:"contests-actions"},Dt("Stop",()=>t.stop(),{id:"contests-stop"}))]),e.update(t.points),un(n.title,"Starting","0"),t.start()}function ZE(n){const e=xe.entries.get(n.id);if(!e)return;$s();const t=Nu(Uu(n));let i;try{i=new iE(n,{rules:e.rules,seed:e.seed},{onStart:()=>xe.run===i&&un(void 0,"Running"),onStats:r=>xe.run===i&&JE(i,r,t),onEnd:r=>xe.run===i&&mm(i,r),onError:r=>xe.run===i&&Wt(`The engine says: ${r}`)})}catch(r){Wt(`It can't run: ${r.message}`);return}xe.run=i;const s=At("svg",{class:"contests-clock-ring",viewBox:"0 0 160 160","aria-hidden":"true"});s.append(At("circle",{class:"contests-clock-track",cx:80,cy:80,r:72}),At("circle",{class:"contests-clock-arc",cx:80,cy:80,r:72,pathLength:100,id:"contests-clock-arc",style:"stroke-dashoffset: 100"})),s.style.setProperty("--contest-color",ma[ks(n)].color),Qn("running",`${n.title}: running`,[B("div",{className:"contests-run-top"},B("div",{className:"contests-clock contests-clock--budget",attrs:{role:"group","aria-label":"Generation, out of the budget"}},s,B("div",{className:"contests-clock-face"},B("span",{className:"contests-countdown-value contests-countdown-value--small",text:"0",attrs:{id:"contests-countdown"}}),B("span",{className:"contests-clock-unit",text:`of ${le(i.budget)} generations`,attrs:{id:"contests-budget"}}))),Zo(Bs(pm(n)),"contests-stat")),t.node,B("p",{className:"contests-note",text:`Running ${Ji(e.rules)} from ${le(e.seed.length)} seed cells until the pattern settles, reaches the edge of the arena, or reaches generation ${le(i.budget)}.${n.departures?` Ships of period up to ${le(n.departures.period)} leave at the edge, and are counted.`:""} Stop ends it without a score.`}),B("div",{className:"contests-actions"},Dt("Stop",()=>i.stop(),{id:"contests-stop"}))]),t.update(i.points),un(n.title,"Starting","0"),i.start()}function JE(n,e,t){Bs(e).forEach(([,r],o)=>{const a=St(`contests-stat-${o}`);a&&(a.textContent=r)});const i=St("contests-countdown");i&&(i.textContent=le(e.generation));const s=St("contests-clock-arc");s&&(s.style.strokeDashoffset=String(100-Math.min(100,e.generation/n.budget*100))),t.update(n.points),un(void 0,void 0,ow(e.generation,n.budget))}function pm(n){const e={generation:0,rate:0,live:0,livePeak:0,chunks:0,memoryBytes:0,extent:null};return n?.departures&&(e.departed=0),e}function QE(n,e){Bs(n).forEach(([,t],i)=>{const s=St(`contests-stat-${i}`);s&&(s.textContent=t)}),e.update(xe.run.points),un(void 0,void 0,le(n.generation))}async function mm(n,e){const{stats:t,reason:i,score:s}=e,{contest:r}=n,o=r.kind==="speed";xe.startedAt=0,un(r.title,s?"Finished":i==="stopped"||o?"Stopped":"No score",le(t.generation));const a=Dt("Run again",()=>Ur(r),{main:!s,id:"contests-again"}),l=Dt(`Back to ${Mr}`,Ir,{id:"contests-back"}),c=Nu(Uu(r),{table:!0}),u=o?nw(i,r):iw(i,r,e),d=o?null:Du([["Seed",`${le(n.run.seed.length)} cell${n.run.seed.length===1?"":"s"}`],["Rules",Ji(n.run.rules)]],"contests-result-entry"),h=e.departures?B("p",{className:"contests-departures",text:`${du(e.departures)}.`,attrs:{id:"contests-departures"}}):null,p=o?Promise.resolve():n.loadHistory().then(()=>{xe.run===n&&c.update(n.points)}).catch(()=>{});if(!s){if(await p,n.close(),xe.run!==n)return;Qn("results",`${r.title}: no score`,[B("p",{className:"contests-ending",text:u,attrs:{id:"contests-ending"}}),h,c.node,d,Zo(Bs(t)),B("div",{className:"contests-actions"},a,l)]),c.update(n.points);return}const g=Dt("Export result",null,{main:!0,id:"contests-export"});g.disabled=!0;const _=Dt("Watch",null,{id:"contests-watch-run"});_.disabled=!0;const m=B("p",{className:"contests-self-verified",text:`Watch plays the run back in 3D, replayed from its seed, and checks the replay's hash at generation ${le(t.generation)} against this one.`,attrs:{id:"contests-self-verified","data-verdict":"pending"}}),f=o?ew(s,r):QM(s,i),M=Cr(r,s,i),b=B("span",{className:"contests-hero-meta",text:"Detecting the browser…",attrs:{id:"contests-hero-meta"}}),E=B("span",{className:"contests-hash",text:`Hashing generation ${le(t.generation)}…`,attrs:{id:"contests-hash"}}),L=Dt("Copy",null,{id:"contests-copy-hash"});L.disabled=!0;const T=B("section",{className:"contests-section contests-submit",attrs:{id:"contests-submit","aria-labelledby":"contests-submit-title"}},B("h3",{className:"contests-section-title",text:"Enter it",attrs:{id:"contests-submit-title"}}),B("p",{className:"contests-note",text:"Submit by email is ready once the result file is made."}));Qn("results",`${r.title}: your result`,[B("div",{className:"contests-hero",attrs:{role:"group","aria-label":`Your score: ${M}`}},B("span",{className:"contests-hero-kicker"},Lu(ks(r),22,"contests-hero-logo"),document.createTextNode(`${r.title} · your score`)),B("span",{className:"contests-hero-value",text:f.value,attrs:{id:"contests-score"}}),B("span",{className:"contests-hero-unit",text:f.unit,attrs:{id:"contests-score-unit"}}),b),c.node,B("p",{className:"contests-ending",text:u,attrs:{id:"contests-ending"}}),h,d,Zo(Bs(t)),B("div",{className:"contests-hash-box"},B("span",{className:"contests-hash-label",text:"The result's hash"}),B("div",{className:"contests-hash-row"},E,L)),m,B("p",{className:"contests-note",text:o?lm:cm}),B("div",{className:"contests-actions"},g,_,a,l),T]),c.update(n.points);let A;try{await p;const R=await Ap();if(xe.run!==n)return;const S=new Date().toLocaleDateString("en-GB",{day:"numeric",month:"short",year:"numeric"});b.textContent=`${R?`${R.name} ${R.version}`:"Browser not detected"} · ${S}`,A=await n.makeResult(R)}catch(R){xe.run===n&&Wt(`The result file couldn't be made: ${R.message}`);return}finally{xe.run===n&&n.close()}xe.run===n&&(E.textContent=A.result.hash,L.disabled=!1,L.onclick=()=>yc(A.result.hash,"hash"),T.replaceChildren(T.firstChild,...t1({contest:r,score:s,browser:A.result.details.browser,hash:A.result.hash,text:A.text,ending:i,run:A.result.run,departures:A.result.departures})),g.disabled=!1,g.onclick=()=>e1(r,s,A.text),_.disabled=!1,_.onclick=()=>Fu(A.result,`${r.title}: ${M}`,_,m),(!St("contests-panel").contains(document.activeElement)||document.activeElement===a)&&g.focus({preventScroll:!0}))}async function e1(n,e,t){try{Wt(await vu(Tp(n,e),t,`Contest result, ${n.title}`))}catch(i){if(i?.name==="AbortError")return;Wt(`Not saved: ${i.message}`)}}async function yc(n,e){try{await navigator.clipboard.writeText(n),Wt("Copied.")}catch{Wt(`The browser didn't allow copying; select the ${e} and copy it by hand.`)}}function t1({contest:n,score:e,browser:t,hash:i,text:s,ending:r,run:o,departures:a}){const l=Tp(n,e),c=pE(n,e,r),u=mE({contest:n,score:e,browser:t,hash:i,fileName:l,ending:r,run:o,departures:a}),d=B("a",{className:"glass-button contests-button contests-submit-button",text:"Submit by email",attrs:{href:gE(c,u),id:"contests-submit-email"}});d.onclick=()=>{Fp(l,s),Wt(`Downloaded ${l}. Attach it to the email, and a picture if you like.`)};const h=(g,_,m,f)=>B("div",{className:"contests-submit-row"},B("span",{className:"contests-submit-label",text:g}),B("span",{className:"contests-submit-value",text:_,attrs:{id:m}}),Dt("Copy",()=>yc(_,f),{id:`${m}-copy`})),p=B("textarea",{className:"contests-submit-text",attrs:{id:"contests-submit-body",readonly:"",rows:"8",spellcheck:"false","aria-label":"The email's text"}});return p.value=u,[B("p",{text:`Submit by email downloads your result file, ${l}, and opens an email to ${xc} with its text filled in: add the name to show, and keep or delete the Hall of Fame line.`}),B("div",{className:"contests-submit-go"},d,B("p",{className:"contests-submit-attach",text:`An email link can't attach files: attach ${l}, and a picture if you like, by hand.`,attrs:{id:"contests-submit-attach"}})),B("p",{className:"contests-note",text:"No mail app? Send it from webmail, with these:"}),B("div",{className:"contests-submit-copy"},h("To",xc,"contests-submit-to","address"),h("Subject",c,"contests-submit-subject","subject"),B("div",{className:"contests-submit-row contests-submit-row--text"},B("span",{className:"contests-submit-label",text:"Text"}),p,Dt("Copy",()=>yc(u,"text"),{id:"contests-submit-body-copy"})))]}function Fu(n,e,t,i=null){const s=xe.view;un(void 0,"Watching"),aE(n,{title:e,onReplayed:r=>{i&&(i.textContent=r.text,i.dataset.verdict=r.verdict)},onClose:()=>{xe.view===s&&(un(void 0,{results:"Finished",contest:"Ready"}[s]??"Checked"),t.focus({preventScroll:!0}))}})}function n1(){St("contests-verify-file").click()}async function i1(n){$s(),Iu();const e=xe.contest;if(n.size>Dn){ul(n.name,{verdict:"refused",message:`The file is larger than ${Dn/1024/1024} MB, so it isn't a result file. It wasn't read.`},e);return}let t;try{t=await n.text()}catch(r){ul(n.name,{verdict:"error",message:`The file couldn't be read: ${r.message}`},e);return}const i=eE(t);xe.verify=i,un(void 0,"Verifying"),Qn("verifying","Verify a result",[B("p",{text:`Checking ${n.name}: replaying its run from the seed, in a background thread. A long run takes a while.`}),B("div",{className:"contests-actions"},Dt("Cancel",()=>i.cancel(),{id:"contests-cancel"}))]);const s=await i.promise;xe.verify===i&&(xe.verify=null,ul(n.name,s,e,t))}function ul(n,e,t,i){un(void 0,e.verdict==="verified"?"Verified":"Checked");const s=[["File",n]];if(e.contest!==void 0&&s.push(["Contest",e.contest??"none"]),e.generation!==null&&e.generation!==void 0&&s.push(["Generation",le(e.generation)]),e.ending&&s.push(["Ended",e.ending]),e.score){const l=e.contest?Ls(e.contest):void 0,c=l&&(l.kind==="speed"?"generations"in e.score&&"ms"in e.score:"generations"in e.score&&"period"in e.score);s.push(["Score",c?l.kind==="speed"?`${uu(e.score)} (the time is self-reported)`:JM(Cr(l,e.score,e.ending)):JSON.stringify(e.score)])}e.rules&&s.push(["Rules",Ji(e.rules)]),e.seedCells&&s.push(["Seed",`${le(e.seedCells)} cell${e.seedCells===1?"":"s"}`]),e.departures&&s.push(["Ships left",`${du(e.departures)}${e.verdict==="verified"?", as the replay found":""}`]);const r=i!==void 0&&["verified","mismatch","not-checked"].includes(e.verdict),o=r?B("p",{className:"contests-self-verified",text:"Watch plays the run back in 3D, replayed from its seed, and checks the replay's hash at the file's generation.",attrs:{id:"contests-self-verified","data-verdict":"pending"}}):null;let a=null;r&&(a=Dt("Watch",()=>{let l;try{l=Fc(i)}catch(c){Wt(c instanceof Ne?`It can't be watched: ${c.message}`:`It can't be watched: ${c?.message??c}`);return}Fu(l,`Watch: ${n}`,a,o)},{id:"contests-watch-run"})),Qn("verdict","Verify a result",[B("div",{className:"contests-verdict-head"},om(30),B("p",{className:`contests-verdict contests-verdict--${e.verdict}`,text:aw(e.verdict),attrs:{id:"contests-verdict"}})),B("p",{text:e.message,attrs:{id:"contests-verdict-message"}}),Du(s),o,B("div",{className:"contests-actions"},a,ga("Verify another"),t?Dt(`Back to ${t.title}`,()=>Ur(t),{id:"contests-back"}):null,Dt(`Back to ${Mr}`,Ir,{id:"contests-list"}))])}let Sc=!1;function fi(){return v.simulationMode==="contests"}function s1({designInExplore:n}={}){_a(),v.reset(),v.autoRotateActive=!1,cu(),v.renderer.render(v.scene,v.camera),Sc=!0,document.body.classList.add("mode-contests"),gm(!0),IE({designInExplore:n}),document.getElementById("loading-overlay")?.classList.add("hidden")}function _a(){Sc&&(Sc=!1,UE(),document.body.classList.remove("mode-contests"),gm(!1))}function gm(n){const e=document.getElementById("contests-banner");e&&(e.setAttribute("aria-pressed",String(n)),e.title=n?"Leave the contests (Esc)":"Open the contests")}function r1(n){or()?dE(n):NE(n)}function Mc(){const n=document.getElementById("bottom-direction-value");n&&(n.textContent=v.isReversing?"rev":"fwd")}function wc(){const n=document.getElementById("bottom-state-value");n&&(n.textContent=v.isPlaying?"play":"pause")}const Jh={...Object.fromEntries(Cu.map(({id:n,name:e,kind:t})=>[n,[e,t]])),contests:["Contests",Mr]};function wo(){document.body.dataset.mode=v.simulationMode;const[n,e]=Jh[v.simulationMode]??Jh.gameOfLife,t=document.getElementById("hud-mode-name");t&&(t.textContent=n);const i=document.getElementById("hud-mode-kind");i&&(i.textContent=e)}function Ws(){if(v.controlsInitialized){const Y=document.getElementById("slice-index");Y&&(Y.max=v.sim_size-1);const ge=document.getElementById("sim-size-value"),Xe=document.getElementById("sim-generations-value");ge&&(ge.textContent=String(v.sim_size)),Xe&&(Xe.textContent=String(v.sim_generations)),wo(),No();return}wo();const n=document.getElementById("contests-banner");n&&(n.onclick=()=>fi()?Qh():o1());const e=document.getElementById("contests-banner-closes");e&&(e.textContent=hu(ko,{short:!0})),document.addEventListener("keydown",Y=>{if(!(Y.key!=="Escape"||Y.defaultPrevented||!fi())&&!document.querySelector(".explore-popover.is-open")&&document.getElementById("company-modal")?.classList.contains("hidden")){if(or()){jo();return}Qh()}}),vM();const t=document.getElementById("sim-size-value"),i=document.getElementById("sim-generations-value");t&&(t.textContent=String(v.sim_size)),i&&(i.textContent=String(v.sim_generations)),kb({beforeRun:()=>{_u(),_a(),zs=null,va()},afterRun:()=>Ws(),enterExplore:()=>{v.simulationMode="explore";for(const Y of _m)v[Y]=!1;zs=null,Jo()},showMode:wo});const s=document.getElementById("seedConfigButton");s&&s.addEventListener("click",()=>{v.showHUD===!1&&document.getElementById("hudToggleButton")?.click(),zb()});const r=document.getElementById("triStateButton");r.addEventListener("click",()=>{const Y=Array.from(r.querySelectorAll(".state-section")),ge=Y.findIndex(bt=>bt.classList.contains("active"));Y[ge].classList.remove("active"),r.classList.remove(`state-active-${Y[ge].dataset.value}`);const Xe=(ge+1)%Y.length,Oe=Y[Xe];r.classList.add(`state-active-${Oe.dataset.value}`),Oe.classList.add("active");const P=Oe.dataset.value;v.sliceAxis=P,o(),ci(),li()&&Fo(),or()&&ll()}),o();function o(){const Y=document.getElementById("view-controls-display-text"),ge=document.getElementById("slice-index");if(Y)if(v.viewMode==="slice"){const Xe=v.sliceIndex!==null?v.sliceIndex:0,Oe=ge&&parseInt(ge.max)||v.sim_size-1;Y.textContent=`${Xe} / ${Oe}`}else Y.textContent="-"}const a=document.getElementById("dualStateButton");a.addEventListener("click",()=>{const Y=Array.from(a.querySelectorAll(".state-section")),ge=Y.findIndex(bt=>bt.classList.contains("active"));Y[ge].classList.remove("active"),a.classList.remove(`state-active-${Y[ge].dataset.id}`);const Xe=(ge+1)%Y.length,Oe=Y[Xe];a.classList.add(`state-active-${Oe.dataset.id}`),Oe.classList.add("active");const P=Oe.dataset.value;v.viewMode=P,o(),ci(),Ec(),li()&&Fo(),or()&&ll()});const l=document.getElementById("slice-index");if(l.addEventListener("input",()=>{const Y=parseInt(l.value);v.sliceIndex=Y,o(),v.viewMode==="slice"&&ci(),li()&&Fo(),or()&&ll()}),l){const Y=v.sim_size-1;l.max=Y,parseInt(l.value)>Y&&(l.value=Y,v.sliceIndex=Y)}const c=document.getElementById("reverseButton"),u=document.getElementById("leftArrow"),d=document.getElementById("rightArrow");d.classList.add("active");let h=!1;document.getElementById("leftStepCircle");const p=document.getElementById("rightStepCircle");p&&p.classList.add("active"),c.addEventListener("click",()=>{li()||fi()||(h=!h,v.isReversing=h,g())});function g(){h?(u.classList.add("active"),d.classList.remove("active")):(u.classList.remove("active"),d.classList.add("active")),_(),Mc()}function _(){const Y=document.getElementById("leftStepCircle"),ge=document.getElementById("rightStepCircle");Y&&ge&&(v.isReversing?(Y.classList.add("active"),ge.classList.remove("active")):(Y.classList.remove("active"),ge.classList.add("active")))}const m=document.getElementById("playPauseButton"),f=document.getElementById("playPauseIcon");m.onclick=()=>{if(fi()){lE();return}if(li()){Tw();return}const Y=!v.isPlaying;v.isPlaying=Y,f.className=Y?"pause":"play",bc(),wc()},document.getElementById("stepButton").addEventListener("click",()=>{if(fi()){cE();return}if(li()){Aw();return}if(!v.simulationData?.length)return;v.isReversing?v.currentGen=(v.currentGen-1+v.simulationData.length)%v.simulationData.length:v.currentGen=(v.currentGen+1)%v.simulationData.length;const Y=document.getElementById("bottom-gen");if(Y){const ge=v.simulationData&&v.simulationData.length>0?v.simulationData.length-1:0;Y.textContent=`${v.currentGen} / ${ge}`}});const b=document.getElementById("restartButton");b&&(b.onclick=Rw);const E=document.getElementById("explore-save-generation");E&&(E.onclick=()=>rl("generation"));const L=document.getElementById("explore-save-seed");L&&(L.onclick=()=>rl("seed"));const T=document.getElementById("explore-save-simulation");T&&(T.onclick=()=>rl("simulation"));const A=document.getElementById("explore-save-confirm");A&&(A.onclick=Ew);const R=document.getElementById("explore-save-cancel");R&&(R.onclick=ua),ob({restart:Jo}),bc(),document.getElementById("directionButton"),Ec(),S(),Mc(),wc();function S(){const Y=document.getElementById("additional-grid-status"),ge=document.getElementById("additional-orientation-status"),Xe=document.getElementById("additional-cell-size-value");Y&&(Y.textContent=v.showWireframeGrid?"on":"off"),ge&&(ge.textContent=v.flipOrientation?"down":"up"),Xe&&(Xe.textContent=(v.cellSize??1.2).toFixed(2))}const y=document.getElementById("wireframeGridToggle"),D=document.getElementById("wireframeGridIcon");y&&(y.addEventListener("click",()=>{v.showWireframeGrid=!v.showWireframeGrid,D&&(D.style.fill=v.showWireframeGrid?"#4da3ff":"currentColor"),v.simulationModel&&v.simulationModel.wireframeGridHelper&&(v.simulationModel.wireframeGridHelper.visible=v.showWireframeGrid),S()}),D&&(D.style.fill=v.showWireframeGrid?"#4da3ff":"currentColor"));const $=document.getElementById("wireframeCellsToggle"),k=document.getElementById("wireframeCellsIcon");$&&($.addEventListener("click",()=>{if(v.showCellWireframe=!v.showCellWireframe,k&&(k.style.fill=v.showCellWireframe?"#4da3ff":"currentColor"),v.simulationModel){const Y=v.simulationModel.points,ge=v.simulationModel.wireframeCellsGroup;Y&&(Y.visible=!v.showCellWireframe),ge&&(ge.visible=v.showCellWireframe),v.simulationData&&ci()}}),k&&(k.style.fill=v.showCellWireframe?"#4da3ff":"currentColor"));const q=document.getElementById("flipOrientationToggle"),Z=document.getElementById("flipOrientationUp"),V=document.getElementById("flipOrientationDown");q&&(q.addEventListener("click",()=>{v.flipOrientation=!v.flipOrientation,ie(),S(),v.simulationData&&ci()}),ie());function ie(){Z&&V&&(v.flipOrientation?(Z.classList.remove("active"),V.classList.add("active")):(Z.classList.add("active"),V.classList.remove("active")))}const H=document.getElementById("cellSizeSlider");H&&(H.value=v.cellSize??1.2,H.addEventListener("input",()=>{const Y=parseFloat(H.value);if(v.cellSize=Y,v.simulationModel&&v.simulationModel.material){const ge=v.simulationModel.material;ge instanceof Rr?(ge.size=Y,ge.needsUpdate=!0):ge.uniforms&&ge.uniforms.uPointSize&&(ge.uniforms.uPointSize.value=Y)}v.simulationData&&v.showCellWireframe&&ci(),S()}));const oe=document.getElementById("company-modal"),me=document.getElementById("company-modal-close"),Te=[document.getElementById("company-logo-button-top")];function $e(){const Y=document.getElementById("glass-display-container"),ge=document.getElementById("bottom-controls-display"),Xe=document.getElementById("additional-controls-display"),Oe=document.getElementById("controls-wrapper"),P=document.getElementById("footer-icons");document.body.classList.add("company-modal-open"),document.getElementById("company-logo-button-top")?.setAttribute("aria-expanded","true"),P&&(P.style.display="none"),Y&&(Y.style.display="none"),ge&&(ge.style.display="none"),Xe&&(Xe.style.display="none"),Oe&&(Oe.style.display="none")}function je(){const Y=document.getElementById("glass-display-container"),ge=document.getElementById("bottom-controls-display"),Xe=document.getElementById("additional-controls-display"),Oe=document.getElementById("controls-wrapper"),P=document.getElementById("footer-icons");document.body.classList.remove("company-modal-open"),document.getElementById("company-logo-button-top")?.setAttribute("aria-expanded","false"),P&&(P.style.display=""),Y&&v.showHUD&&(Y.style.display="flex"),ge&&v.showHUD&&(ge.style.display="grid"),Xe&&v.showHUD&&(Xe.style.display="grid"),Oe&&(Oe.style.display="")}const X=()=>!!(oe&&!oe.classList.contains("hidden"));function ae(){if(!X())return;oe.classList.add("hidden"),je();const Y=document.activeElement;Y&&(Y.closest("#company-brand")||oe.contains(Y))&&Y.blur()}Te.forEach(Y=>{Y&&oe&&Y.addEventListener("click",ge=>{if(ge.preventDefault(),ge.stopPropagation(),X()){ae();return}oe.classList.remove("hidden"),$e()})}),me&&oe&&(me.addEventListener("click",ae),oe.addEventListener("click",Y=>{Y.target===oe&&ae()}),document.addEventListener("keydown",Y=>{Y.key==="Escape"&&X()&&(Y.preventDefault(),ae())}));const Ee=document.getElementById("hudToggleButton"),he=document.getElementById("glass-display-container"),we=document.getElementById("bottom-controls-display"),Qe=document.getElementById("additional-controls-display");if(Ee&&he){Ee.addEventListener("click",()=>{v.showHUD=!v.showHUD,he.style.display=v.showHUD?"flex":"none",we&&(we.style.display=v.showHUD?"grid":"none"),Qe&&(Qe.style.display=v.showHUD?"grid":"none");const ge=document.getElementById("hudToggleIcon");ge&&(ge.style.stroke=v.showHUD?"#4da3ff":"currentColor")});const Y=document.getElementById("hudToggleIcon");Y&&(Y.style.stroke="#4da3ff"),we&&(we.style.display=v.showHUD?"grid":"none"),Qe&&(Qe.style.display=v.showHUD?"grid":"none")}wo(),v.controlsInitialized=!0}function bc(){const n=document.getElementById("stepButton");n&&(v.isPlaying?n.classList.add("disabled"):n.classList.remove("disabled"))}function Ec(){const e=document.getElementById("dualStateButton")?.querySelector(".state-section.active"),t=document.getElementById("triStateButton"),i=document.getElementById("slider"),s=document.getElementById("sliceViewer"),r=e&&e.dataset.value==="slice";t&&(t.style.display=r?"block":"none"),i&&(i.style.display=r?"block":"none"),s&&(s.style.display=r?"flex":"none")}let zs=null;const _m=["useRule30","useRule30_2D","useSineWave","useSandpile"];function o1(){v.simulationMode!=="contests"&&(zs={mode:v.simulationMode,flags:Object.fromEntries(_m.map(n=>[n,v[n]]))}),v.simulationMode="contests",v.useRule30=!1,v.useRule30_2D=!1,v.useSineWave=!1,v.useSandpile=!1,Tc(null),_u(),va(),Ws(),s1({designInExplore:a1})}function a1({note:n,arena:e,title:t,ships:i=!1}){zs=null;const s=Pg(v.explore,e,t,i);v.explore=s.setup,v.simulationMode="explore",Jo(),_b({note:`${n} ${s.note}`})}async function Qh(){if(!fi())return;const n=zs??{mode:"explore",flags:{}};if(zs=null,n.mode==="explore"){v.simulationMode="explore",Jo();return}_a(),v.simulationMode=n.mode,Object.assign(v,n.flags),va(),Ws(),await Ou()}function Jo(){_a(),va(),Ws(),Mu()}function va(){v.viewMode="full",v.sliceAxis="x",v.sliceIndex=Math.floor((v.sim_size-1)/2),v.currentGen=0,v.isPlaying=!1,v.isReversing=!1;const n=document.getElementById("dualStateButton");if(n){const d=Array.from(n.querySelectorAll(".state-section"));d.forEach(p=>p.classList.remove("active")),n.classList.remove("state-active-y"),n.classList.add("state-active-x");const h=d[0];h&&h.classList.add("active")}const e=document.getElementById("triStateButton");if(e){const d=Array.from(e.querySelectorAll(".state-section"));d.forEach(p=>p.classList.remove("active")),e.classList.remove("state-active-y","state-active-z"),e.classList.add("state-active-x");const h=d.find(p=>p.dataset.value==="x")||d[0];h&&h.classList.add("active")}const t=document.getElementById("slider"),i=document.getElementById("sliceViewer");t&&(t.style.display="none"),i&&(i.style.display="none");const s=document.getElementById("slice-index");if(s){s.max=v.sim_size-1;const d=Math.floor((v.sim_size-1)/2);s.value=`${d}`}const r=document.getElementById("playPauseIcon");r&&(r.className="play"),bc(),wc();const o=document.getElementById("leftArrow"),a=document.getElementById("rightArrow");o&&o.classList.remove("active"),a&&a.classList.add("active"),Mc();const l=document.getElementById("leftStepCircle"),c=document.getElementById("rightStepCircle");l&&l.classList.remove("active"),c&&c.classList.add("active");const u=document.getElementById("bottom-gen");if(u){const d=v.simulationData&&v.simulationData.length>0?v.simulationData.length-1:0;u.textContent=`0 / ${d}`}Ec()}let bo=0;async function Ou(){const n=++bo,e=document.getElementById("loading-overlay");e&&e.classList.remove("hidden"),Tc(null);const t={mode:v.useSandpile?"sandpile":v.useSineWave?"sineWave":v.useRule30_2D?"rule30_2D":v.useRule30?"rule30":"gameOfLife",size:v.sim_size,generations:v.sim_generations,initialSand:v.sandpileParams?.initialSand};try{await new Promise(_=>requestAnimationFrame(_)),await new Promise(_=>setTimeout(_,0)),v.reset(),Ws(),cu();const i=v.scene,s=v.sim_size,r=v.sim_generations,o=v.shapeFn;v.viewMode="full",v.sliceAxis="x",v.sliceIndex=Math.floor((s-1)/2);const a=await lM(s,r,o,v.useRule30,v.useRule30_2D,v.useSineWave,v.useSandpile,v.useSandpile?v.sandpileParams:null);if(n!==bo)return;v.simulationData=a;const l=v.useRule30?1:s;v.simulationModel=await l1(s,l);const c=v.simulationModel.geometry,u=v.simulationModel.material,d=new su(c,u);v.simulationModel.points=d,v.simulationModel.wireframeGridHelper&&(i.remove(v.simulationModel.wireframeGridHelper),v.simulationModel.wireframeGridHelper.traverse(_=>{_.geometry&&_.geometry.dispose(),_.material&&_.material.dispose()}));const h=u1(s,l);v.simulationModel.wireframeGridHelper=h,h.visible=v.showWireframeGrid??!1,i.add(h),v.simulationModel.wireframeCellsGroup&&(i.remove(v.simulationModel.wireframeCellsGroup),v.simulationModel.wireframeCellsGroup.traverse(_=>{_.geometry&&_.geometry.dispose(),_.material&&_.material.dispose()}));const p=new mi;v.simulationModel.wireframeCellsGroup=p,p.visible=v.showCellWireframe??!1,i.add(p),d.visible=!v.showCellWireframe,ci(),i.add(d),!v.userHasInteracted&&!v.autoRotateActive&&(v.autoRotateActive=!0,v.autoRotateStartTime=performance.now());const g=document.getElementById("loading-overlay");g&&requestAnimationFrame(()=>g.classList.add("hidden"))}catch(i){console.error("Failed to initialize simulation:",i),Ob(i)&&n===bo&&(v.simulationData=null,v.simulationModel=null,v.isPlaying=!1,Tc(Fb(t)))}finally{e&&n===bo&&e.classList.add("hidden")}}function Tc(n){const e=document.getElementById("sim-memory-note");e&&(e.hidden=!n,e.textContent=n??"")}async function l1(n,e){const t=n,i=e,s=v.cellSize??1.2,r=new Ft,o=t*t*i,a=new Float32Array(o*3),l=new Float32Array(o*3);r.setAttribute("position",new Ut(a,3)),r.setAttribute("color",new Ut(l,3)),r.setDrawRange(0,0);const c=new Rr({size:s,vertexColors:!0,sizeAttenuation:!0});return{geometry:r,material:c,positions:a,colors:l,matrixSize:t,matrixDepth:i}}function ci(){if(!v.simulationModel||!v.simulationModel.geometry)return;const n=new Pe("rgba(0, 180, 200, 1)"),e=new Pe("rgb(200,20,0)"),t=v.simulationModel.geometry,i=v.simulationModel.matrixSize,s=v.simulationModel.matrixDepth??i,r=v.simulationData,o=v.currentGen,a=r[o];let l=0;const c=[],u=(i-1)/2,d=s>1?s-1:0,h=d/2,p=v.useSandpile;for(const[m,f,M]of a.active){let b,E,L,T,A,R;if(p){const S=M,y=1;if(v.viewMode==="slice"&&(v.sliceAxis==="x"&&m!==v.sliceIndex||v.sliceAxis==="y"&&f!==v.sliceIndex||v.sliceAxis==="z"&&S!==v.sliceIndex))continue;if(b=m-u,E=v.flipOrientation?u-f:f-u,L=S*y,T=m/(i-1),R=new Pe,S===0)R.setHex(1713022);else if(S===1)R.setHex(5025616);else if(S===2)R.setHex(10233776);else if(S===3)R.setHex(16766720);else if(S===4)R.setHex(16777215);else{const D=S-4,k=Math.min(1,D/10);R.lerpColors(new Pe(16777215),new Pe(14737632),k)}}else{if(v.viewMode==="slice"&&(v.sliceAxis==="x"&&m!==v.sliceIndex||v.sliceAxis==="y"&&f!==v.sliceIndex||v.sliceAxis==="z"&&M!==v.sliceIndex))continue;b=m-u,E=v.flipOrientation?u-f:f-u,s<=1?L=0:L=M/(i-1)*d-h,T=m/(i-1),A=M/(i-1),R=n.clone().lerp(e,T),R.offsetHSL(0,0,A*.5)}new F(b,E,L),c.push([m,f,M]),v.simulationModel.positions[3*l]=b,v.simulationModel.positions[3*l+1]=E,v.simulationModel.positions[3*l+2]=L,v.simulationModel.colors[3*l]=R.r,v.simulationModel.colors[3*l+1]=R.g,v.simulationModel.colors[3*l+2]=R.b,l++}t.setDrawRange(0,l),t.attributes.position.needsUpdate=!0,t.attributes.color.needsUpdate=!0,c1(c,i,s);const g=a.generation!==void 0?a.generation:o,_=document.getElementById("bottom-gen");if(_){const m=v.simulationData&&v.simulationData.length>0?v.simulationData.length-1:0;_.textContent=`${g} / ${m}`}}function c1(n,e,t){const i=v.simulationModel.wireframeCellsGroup;if(!i)return;for(;i.children.length>0;){const d=i.children[0];d.geometry.dispose(),d.material.dispose(),i.remove(d)}if(!v.showCellWireframe)return;const s=v.cellSize??1,r=new Pe("rgba(0, 180, 200, 1)"),o=new Pe("rgb(200,20,0)"),a=(e-1)/2,l=t>1?t-1:0,c=l/2,u=v.useSandpile;for(const[d,h,p]of n){let g,_,m,f,M,b;if(u){const R=p,S=1;if(g=d-a,_=v.flipOrientation?a-h:h-a,m=R*S,f=d/(e-1),b=new Pe,R===0)b.setHex(1713022);else if(R===1)b.setHex(5025616);else if(R===2)b.setHex(10233776);else if(R===3)b.setHex(16766720);else if(R===4)b.setHex(16777215);else{const y=R-4,$=Math.min(1,y/10);b.lerpColors(new Pe(16777215),new Pe(14737632),$)}}else g=d-a,_=v.flipOrientation?a-h:h-a,t<=1?m=0:m=p/(e-1)*l-c,f=d/(e-1),M=p/(e-1),b=r.clone().lerp(o,f),b.offsetHSL(0,0,M*.5);const E=new rn(s,s,s),L=new ra(E),T=new Jn({color:b}),A=new Xi(L,T);A.position.set(g,_,m),i.add(A),E.dispose()}}function u1(n,e){const t=new mi,i=Math.max(n,1),s=e>1?Math.max(e-1,1):1,r=new Pe(16777215),o=.3,a=new rn(i,i,s),l=new ra(a),c=new Jn({color:r,transparent:!0,opacity:o}),u=new Xi(l,c);u.position.set(0,0,0),t.add(u);const d=Math.max(n,1),h=new ja(i,d,r,r);h.position.z=0,h.material.transparent=!0,h.material.opacity=o*.5;const p=new ja(i,d,r,r);p.rotation.x=Math.PI/2,p.position.y=0,p.material.transparent=!0,p.material.opacity=o*.5;const g=new ja(s,Math.max(e,1),r,r);return g.rotation.z=Math.PI/2,g.position.x=0,g.material.transparent=!0,g.material.opacity=o*.5,t.add(h),t.add(p),t.add(g),a.dispose(),t}let Eo=0,To=0,d1=60,ef=1e3/d1,dl=0,tf=0,nf=0,Qo=2.6;const vm=100,sf=1e4;function h1(){const n=()=>{v.autoRotateActive&&(v.autoRotateActive=!1,v.userHasInteracted=!0,v.autoRotateInitialPosition=null,v.autoRotateInitialRadius=null,v.autoRotateInitialAngle=null,v.controls&&(v.controls.enabled=!0))};document.addEventListener("mousedown",n,{once:!0}),document.addEventListener("mousemove",n,{once:!0}),document.addEventListener("wheel",n,{once:!0}),document.addEventListener("touchstart",n,{once:!0}),document.addEventListener("touchmove",n,{once:!0}),document.addEventListener("keydown",n,{once:!0}),document.addEventListener("keyup",n,{once:!0}),document.querySelectorAll('button, input, select, [role="button"]').forEach(t=>{t.addEventListener("click",n,{once:!0}),t.addEventListener("input",n,{once:!0}),t.addEventListener("change",n,{once:!0})})}h1();const rf=document.getElementById("fps-value"),hl=document.getElementById("speed-control");function of(){const n=(1e3/(vm/Qo)).toFixed(0),e=document.getElementById("bottom-speed-value");e&&(e.textContent=`${n}`)}hl&&(hl.value=Qo,hl.addEventListener("input",n=>{Qo=parseFloat(n.target.value),li()?Cw(n.target.value):fi()?uE(n.target.value):of()}),of());function xm(n){requestAnimationFrame(xm),Eo||(Eo=n);const e=n-Eo;if(e>=ef){if(Eo=n-e%ef,v.autoRotateActive&&v.camera&&v.controls){if(!v.autoRotateInitialPosition){const o=v.camera.position;v.autoRotateInitialPosition=o.clone(),v.autoRotateInitialRadius=Math.sqrt(o.x*o.x+o.z*o.z),v.autoRotateInitialAngle=Math.atan2(o.z,o.x)}const r=n-v.autoRotateStartTime;if(r<sf){v.controls.enabled=!1;const o=r/sf*Math.PI*2,a=v.autoRotateInitialAngle+o,l=v.autoRotateInitialRadius*Math.cos(a),c=v.autoRotateInitialRadius*Math.sin(a),u=v.autoRotateInitialPosition.y;v.camera.position.set(l,u,c),v.camera.lookAt(0,0,0)}else v.autoRotateActive=!1,v.userHasInteracted=!0,v.autoRotateInitialPosition=null,v.autoRotateInitialRadius=null,v.autoRotateInitialAngle=null,v.controls.enabled=!0}dl++;const t=performance.now();if(t-tf>=1e3&&(nf=dl,dl=0,tf=t,rf&&(rf.textContent=nf.toFixed(0))),Zw()){Jw();return}if(fi()){r1(n);return}To||(To=n);const i=n-To;if(li())Pw(n);else if(i>=vm/Qo){if(To=n,v.isPlaying&&v.simulationData?.length){const r=v.simulationData.length;v.currentGen=v.isReversing?(v.currentGen-1+r)%r:(v.currentGen+1)%r}ci()}v.controls&&v.controls.enabled&&v.controls.update(),v.renderer.render(v.scene,v.camera);const s=document.getElementById("loading-overlay");s&&!s.classList.contains("hidden")&&v.simulationData&&v.simulationModel&&s.classList.add("hidden")}}(async()=>(v.simulationMode==="explore"?(Ws(),Mu()):await Ou(),xm()))();
