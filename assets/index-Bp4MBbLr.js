(function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const s of document.querySelectorAll('link[rel="modulepreload"]'))i(s);new MutationObserver(s=>{for(const r of s)if(r.type==="childList")for(const o of r.addedNodes)o.tagName==="LINK"&&o.rel==="modulepreload"&&i(o)}).observe(document,{childList:!0,subtree:!0});function t(s){const r={};return s.integrity&&(r.integrity=s.integrity),s.referrerPolicy&&(r.referrerPolicy=s.referrerPolicy),s.crossOrigin==="use-credentials"?r.credentials="include":s.crossOrigin==="anonymous"?r.credentials="omit":r.credentials="same-origin",r}function i(s){if(s.ep)return;s.ep=!0;const r=t(s);fetch(s.href,r)}})();class Gm{constructor(e=0){this.seed=e,this.p=[];for(let t=0;t<256;t++)this.p[t]=Math.floor(Math.random()*256);for(let t=0;t<256;t++)this.p[256+t]=this.p[t]}fade(e){return e*e*e*(e*(e*6-15)+10)}lerp(e,t,i){return e+i*(t-e)}grad(e,t,i,s){const r=e&15,o=r<8?t:i,a=r<4?i:r===12||r===14?t:s;return((r&1)===0?o:-o)+((r&2)===0?a:-a)}noise(e,t,i){const s=Math.floor(e)&255,r=Math.floor(t)&255,o=Math.floor(i)&255;e-=Math.floor(e),t-=Math.floor(t),i-=Math.floor(i);const a=this.fade(e),l=this.fade(t),c=this.fade(i),u=this.p[s]+r,d=this.p[u]+o,h=this.p[u+1]+o,p=this.p[s+1]+r,g=this.p[p]+o,v=this.p[p+1]+o;return this.lerp(this.lerp(this.lerp(this.grad(this.p[d],e,t,i),this.grad(this.p[g],e-1,t,i),a),this.lerp(this.grad(this.p[h],e,t-1,i),this.grad(this.p[v],e-1,t-1,i),a),l),this.lerp(this.lerp(this.grad(this.p[d+1],e,t,i-1),this.grad(this.p[g+1],e-1,t,i-1),a),this.lerp(this.grad(this.p[h+1],e,t-1,i-1),this.grad(this.p[v+1],e-1,t-1,i-1),a),l),c)}}function Nc(n,e=.3,t=null){return(i,s)=>{const r=Math.floor(s/2),a=Math.floor((t||s)/2),l=Math.max(0,r-a),c=Math.min(s-1,r+a),u=Math.max(0,r-a),d=Math.min(s-1,r+a),h=Math.max(0,r-a),p=Math.min(s-1,r+a),g=new Gm(Date.now()%1e4),v=Math.max(.01,Math.min(.5,n/100)),m=1-2*e;for(let f=l;f<=c;f++)for(let T=u;T<=d;T++)for(let y=h;y<=p;y++)g.noise((f-r)*v,(T-r)*v,(y-r)*v)>m&&i.set(f,T,y,1)}}function Hm(n=5,e=1){return(t,i)=>{const s=Math.floor(i/2);for(let r=s-n;r<=s+n-1;r++)for(let o=s-n;o<=s+n-1;o++)for(let a=s-n;a<=s+n-1;a++)Math.random()<e&&t.set(r,o,a,1)}}function pf(n,e=1){return(t,i)=>{const s=Math.floor(i/2)-Math.floor(n/2);for(let r=s;r<s+n;r++)for(let o=s;o<s+n;o++)for(let a=s;a<s+n;a++)Math.random()<e&&t.set(r,o,a,1)}}function Uc(n=7,e=1){return(t,i)=>{const s=Math.floor(i/2);for(let r=0;r<n;r++)for(let o=0;o<=r;o++)for(let a=0;a<=r-o;a++){const l=s-Math.floor(n/2)+o,c=s-Math.floor(n/2)+r,u=s-Math.floor(n/2)+a;Math.random()<e&&t.set(l,c,u,1)}}}function Fc(n=8,e=1){return(t,i)=>{const s=Math.floor(i/2);for(let r=s-n;r<=s+n;r++)for(let o=s-n;o<=s+n;o++)for(let a=s-n;a<=s+n;a++){const l=Math.abs(r-s),c=Math.abs(o-s),u=Math.abs(a-s);l+c+u<=n&&r>=0&&r<i&&o>=0&&o<i&&a>=0&&a<i&&Math.random()<e&&t.set(r,o,a,1)}}}function Oc(n=8,e=.5,t=null){return(i,s)=>{const r=(s-1)/2,o=t||s,a=o/2,l=Math.max(0,Math.floor(r-a)),c=Math.min(s-1,Math.floor(r+a)),u=Math.max(0,Math.floor(r-a)),d=Math.min(s-1,Math.floor(r+a)),h=Math.max(0,Math.floor(r-a)),p=Math.min(s-1,Math.floor(r+a)),g=Date.now()%1e4,v=(E,A,R)=>{const w=(E*73856093^A*19349663^R*83492791)+g;return(w*(w*w*15731+789221)+1376312589&2147483647)/2147483648},m=Math.max(2,Math.floor(Math.cbrt(n))),f=o/m,T=r-a,y=r-a,M=r-a,P=[];for(let E=0;E<m;E++)for(let A=0;A<m;A++)for(let R=0;R<m;R++){const w=v(E,A,R)*f,S=v(E+1,A,R)*f,D=v(E,A+1,R)*f;P.push({x:T+E*f+w,y:y+A*f+S,z:M+R*f+D})}for(let E=l;E<=c;E++)for(let A=u;A<=d;A++)for(let R=h;R<=p;R++){let w=1/0;for(const D of P){const $=Math.sqrt((E-D.x)**2+(A-D.y)**2+(R-D.z)**2);w=Math.min(w,$)}Math.min(1,w/f)<e&&i.set(E,A,R,1)}}}function Vm(){return(n,e)=>{const t=Math.floor(e/2)-1,i=Math.floor(e/2)-1;n.set(t,0,i,1)}}function $m(n,e,t,i){switch(n){case"perlin":return Nc(e,t,i);case"worley":return Oc(e,t,i);case"tetrahedron":return Uc(e,t);case"octahedron":return Fc(e,t);default:return pf(Math.max(1,e),t)}}const gr=26;class Hi extends Error{constructor(e){super(e),this.name="RuleError"}}function Si(n){if(!n||typeof n!="object")throw new Hi("Rules must be an object with birth and survival lists.");const e=Ju(n.birth,"birth"),t=Ju(n.survival,"survival");if(e.includes(0))throw new Hi("Birth with 0 live neighbours (B0) is not allowed: every empty cell of an unbounded world would come to life at once. Remove 0 from the birth counts.");return{birth:e,survival:t}}function Ju(n,e){if(!Array.isArray(n))throw new Hi(`The ${e} counts must be a list of numbers.`);for(const t of n)if(!Number.isInteger(t)||t<0||t>gr)throw new Hi(`The ${e} counts must be whole numbers from 0 to ${gr}; ${JSON.stringify(t)} is not.`);return[...new Set(n)].sort((t,i)=>t-i)}const Wm=(n,e)=>Array.from({length:e-n+1},(t,i)=>n+i);function Xm(){const n=new Int32Array(3e3);let e=0;for(let t=-5;t<5;t++)for(let i=-5;i<5;i++)for(let s=-5;s<5;s++)n[e++]=s,n[e++]=i,n[e++]=t;return n}const Ym=Int32Array.from([-2,-5,-5,3,-5,-5,-2,-4,-5,1,-4,-5,-3,-3,-5,-4,-2,-5,-2,-2,-5,4,-2,-5,-4,-1,-5,1,0,-5,-5,1,-5,-4,1,-5,-3,1,-5,-2,1,-5,-5,3,-5,-3,3,-5,-1,3,-5,-5,4,-5,-3,4,-5,-2,4,-5,0,-5,-4,3,-5,-4,4,-5,-4,-5,-4,-4,-2,-4,-4,-1,-4,-4,-2,-3,-4,2,-3,-4,3,-3,-4,-4,-2,-4,-2,-2,-4,2,-2,-4,-4,-1,-4,3,-1,-4,-5,0,-4,-3,0,-4,-1,0,-4,1,0,-4,3,0,-4,4,0,-4,3,1,-4,4,1,-4,-5,2,-4,-3,3,-4,-2,4,-4,1,4,-4,2,4,-4,-1,-5,-3,1,-5,-3,1,-4,-3,-1,-3,-3,0,-3,-3,-1,-1,-3,2,-1,-3,3,-1,-3,4,-1,-3,-5,0,-3,-3,0,-3,-2,0,-3,2,0,-3,-3,1,-3,0,1,-3,-3,2,-3,2,2,-3,-1,3,-3,3,4,-3,-2,-5,-2,-2,-4,-2,4,-4,-2,-2,-2,-2,1,-2,-2,-5,-1,-2,-2,-1,-2,2,-1,-2,1,0,-2,3,0,-2,-2,1,-2,-1,1,-2,0,1,-2,1,1,-2,-4,2,-2,-3,2,-2,0,2,-2,1,2,-2,2,2,-2,2,3,-2,-3,4,-2,0,4,-2,1,4,-2,3,4,-2,4,-5,-1,-3,-4,-1,0,-4,-1,-2,-3,-1,-4,-2,-1,0,-2,-1,4,-2,-1,-1,-1,-1,0,-1,-1,1,-1,-1,-2,0,-1,2,0,-1,0,2,-1,1,2,-1,-4,4,-1,2,4,-1,-5,-5,0,-1,-3,0,0,-3,0,-5,-2,0,-3,-2,0,2,-2,0,3,-2,0,4,-2,0,-4,-1,0,1,-1,0,-2,0,0,4,0,0,-5,1,0,-4,1,0,-3,1,0,1,1,0,3,1,0,-4,2,0,1,2,0,-3,3,0,-2,3,0,-1,3,0,1,3,0,-2,4,0,1,4,0,2,4,0,-5,-5,1,-4,-5,1,-2,-5,1,-4,-4,1,-3,-4,1,4,-4,1,-3,-3,1,-1,-3,1,1,-3,1,-1,-2,1,2,-2,1,0,0,1,-2,1,1,2,1,1,-3,2,1,1,2,1,2,2,1,3,2,1,1,3,1,3,3,1,-3,4,1,2,4,1,4,4,1,-2,-5,2,1,-5,2,-5,-4,2,0,-4,2,0,-3,2,2,-3,2,0,-1,2,1,0,2,4,0,2,1,1,2,2,1,2,3,2,2,-2,3,2,-3,4,2,-2,4,2,0,4,2,4,4,2,-5,-5,3,-1,-5,3,-5,-4,3,-3,-4,3,-2,-4,3,-3,-3,3,-2,-3,3,-1,-3,3,4,-3,3,-1,-2,3,-4,-1,3,-3,-1,3,-1,-1,3,1,-1,3,-4,0,3,-3,0,3,1,0,3,2,0,3,-5,1,3,-1,1,3,0,3,3,1,3,3,2,3,3,3,3,3,0,4,3,2,-5,4,-2,-4,4,-4,-3,4,3,-3,4,-3,-2,4,0,-2,4,2,-2,4,-5,-1,4,2,-1,4,3,-1,4,4,-1,4,-3,0,4,0,0,4,2,0,4,0,1,4,2,1,4,-2,3,4,0,3,4,2,3,4,-5,4,4,-4,4,4,-3,4,4,-2,4,4,-1,4,4,0,4,4,2,4,4,3,4,4]),qm=n=>Int32Array.from(n.flatMap(([e,t,i])=>[e-1,t-1,i-1])),jm=[{id:"ship-p1",name:"Ship: period 1, c",description:"17 cells that shed to an 8-cell ship by generation 24, then fly along +x one cell a generation, the fastest any pattern can go.",rules:{birth:[4],survival:[6]},seed:[[1,0,0],[0,1,0],[2,1,0],[0,0,1],[2,0,1],[0,1,1],[2,1,1],[0,2,1],[1,2,1],[0,0,2],[2,0,2],[0,1,2],[1,1,2],[2,1,2],[0,2,2],[1,2,2],[2,2,2]],ship:{from:24,period:1,shift:[1,0,0]}},{id:"ship-p2-c",name:"Ship: period 2, c",description:"A ship by generation 10: 2 cells along +x every 2 generations, wobbling up and down in z as it goes.",rules:{birth:[4],survival:[7]},seed:[[0,0,0],[1,0,0],[2,0,0],[0,1,0],[1,1,0],[0,0,1],[2,0,1],[1,1,1],[0,2,1],[2,2,1],[0,0,2],[2,0,2],[1,1,2]],ship:{from:10,period:2,shift:[2,0,0]}},{id:"ship-p2-c2",name:"Ship: period 2, c/2",description:"A ship by generation 3: one cell along -y every 2 generations, wobbling in x and z.",rules:{birth:[5,6],survival:[1,4,9]},seed:[[1,0,0],[2,0,0],[1,1,0],[2,1,0],[0,2,0],[1,2,0],[2,2,0],[0,0,1],[2,0,1],[0,1,1],[1,2,1],[0,0,2],[1,0,2],[2,0,2],[0,1,2],[2,1,2],[1,2,2],[2,2,2]],ship:{from:3,period:2,shift:[0,-1,0]}},{id:"ship-p3",name:"Ship: period 3, c",description:"A ship by generation 19: 3 cells along +y every 3 generations.",rules:{birth:[4],survival:[7,8,11]},seed:[[2,0,0],[1,1,0],[2,1,0],[0,2,0],[2,2,0],[0,1,1],[1,1,1],[0,2,1],[2,2,1],[0,0,2],[2,0,2],[2,1,2],[1,2,2]],ship:{from:19,period:3,shift:[0,3,0]}},{id:"ship-p4",name:"Ship: period 4, c",description:"A ship by generation 22: 4 cells down, along -z, every 4 generations, 17 and 13 cells by turns.",rules:{birth:[4],survival:[]},seed:[[1,0,0],[2,0,0],[1,1,0],[2,1,0],[0,0,1],[2,0,1],[2,1,1],[0,2,1],[2,2,1],[0,0,2],[0,1,2],[1,1,2],[2,1,2],[1,2,2],[2,2,2]],ship:{from:22,period:4,shift:[0,0,-4]}},{id:"ship-p6",name:"Ship: period 6, c",description:"A ship by generation 3: 6 cells along +x every 6 generations, between 8 and 11 cells on the way.",rules:{birth:[4],survival:[]},seed:[[1,0,0],[0,1,0],[1,1,0],[2,1,0],[2,2,0],[0,0,1],[2,1,1],[0,2,1],[1,2,1],[2,2,1],[1,0,2],[0,1,2],[1,1,2]],ship:{from:3,period:6,shift:[6,0,0]}},{id:"ship-p12",name:"Ship: period 12, c/6",description:"A ship by generation 6: only 2 cells along +y every 12 generations, wobbling in x and z on the way.",rules:{birth:[4],survival:[1,5]},seed:[[0,0,0],[1,0,0],[2,0,0],[1,2,0],[1,0,1],[1,1,1],[2,1,1],[2,2,1],[0,0,2],[1,0,2],[2,0,2],[1,1,2],[1,2,2]],ship:{from:6,period:12,shift:[0,2,0]}},{id:"diagonal-p4",name:"Diagonal ship: period 4, c/4",description:"A ship by generation 36: one cell along +x and one along -y every 4 generations.",rules:{birth:[6,7],survival:[2,4,5,7,10]},seed:[[0,0,0],[2,0,0],[0,1,0],[1,1,0],[0,2,0],[1,2,0],[2,2,0],[0,0,1],[1,0,1],[0,1,1],[2,1,1],[0,2,1],[1,2,1],[0,0,2],[2,0,2],[0,1,2],[2,1,2],[0,2,2],[1,2,2],[2,2,2]],ship:{from:36,period:4,shift:[1,-1,0]}},{id:"diagonal-p6",name:"Diagonal ship: period 6, c/6",description:"A ship by generation 2: one cell along -x and one along -y every 6 generations.",rules:{birth:[5,6],survival:[5,7,10,12]},seed:[[2,0,0],[0,2,0],[1,2,0],[2,0,1],[2,1,1],[0,2,1],[1,2,1],[2,2,1],[0,2,2],[2,2,2]],ship:{from:2,period:6,shift:[-1,-1,0]}}].map(({seed:n,rules:e,...t})=>({...t,rules:Si(e),cells:qm(n),group:"ships"})),br=[{id:"cube10",name:"Cube10",description:"The 10³ cube the lab opens on, under its default rules: a dense mass that keeps swelling outward.",rules:Si({birth:[9,10],survival:Wm(5,15)}),cells:Xm()},{id:"spreading-noise",name:"Spreading noise",description:"224 cells that look like chaotic noise, yet keep spreading outward.",rules:Si({birth:[7,13,14],survival:[0,2,3,4,5,6,9,13,19,23,24]}),cells:Ym},...jm],Km=[{id:"ships",label:"Ships"}];function In(n){return br.find(e=>e.id===n)}class Qt{constructor(e,t=0){this.size=e,this.data=new Uint8Array(e*e*e).fill(t),this.active=[]}_idx(e,t,i){return e+t*this.size+i*this.size*this.size}_wrap(e){return(e+this.size)%this.size}get(e,t,i){return this.data[this._idx(e,t,i)]}set(e,t,i,s){const r=this._idx(e,t,i),o=this.data[r];this.data[r]=s,s===1&&o===0?this.active.push([e,t,i]):s===0&&o===1&&(this.active=this.active.filter(([a,l,c])=>a!==e||l!==t||c!==i))}cloneEmpty(){return new Qt(this.size,0)}}const Aa={face:17,edge:11,corner:7},pi=2**19,Qu=[8,16,32],Zm=["cell-limit","extent-limit","coordinate-limit","memory-limit","out-of-memory","arena-edge"];(()=>{const n=[[-1,0],[0],[0,1]],e=new Int32Array(27);for(let t=0;t<27;t++){const[i,s,r]=[t%3,Math.floor(t/3)%3,Math.floor(t/9)];for(const o of n[r])for(const a of n[s])for(const l of n[i])(l||a||o)&&(e[t]|=1<<(o+1)*9+(a+1)*3+(l+1))}return e})();const Jm=[...Zm,"stopped","deadline","generation-limit","died","repeat","emits","error"],Qm=1,Bo="morpheus-tech-lab/result",yl=1,An=128*1024*1024,ur=1e3,ko=Jm.filter(n=>n!=="error"),eg=/^[a-z0-9][a-z0-9-]{0,63}$/,ed=/^sha256:[0-9a-f]{64}$/,Sl=100,tg=/^[a-z][A-Za-z]{0,31}$/,td=8,ng=["generation","elapsedMs","generationMs","rate","live","livePeak","chunks","chunksPeak","chunksCreated","memoryBytes","usedBytes"];class Le extends Error{constructor(e){super(e),this.name="ResultError"}}function Ls(n){if(n===null||typeof n=="boolean"||typeof n=="string")return JSON.stringify(n);if(typeof n=="number"){if(!Number.isSafeInteger(n))throw new Le(`${n} is not a whole number.`);return String(n)}if(Array.isArray(n))return`[${n.map(Ls).join(",")}]`;if(typeof n=="object")return`{${Object.keys(n).sort().map(t=>`${JSON.stringify(t)}:${Ls(n[t])}`).join(",")}}`;throw new Le(`A ${typeof n} can't be written as canonical JSON.`)}function Bc(n){const e=n.length/3;if(e===0)return new Int32Array(0);const t=[1/0,1/0,1/0],i=[-1/0,-1/0,-1/0];for(let l=0;l<n.length;l+=3)for(let c=0;c<3;c++){const u=n[l+c];u<t[c]&&(t[c]=u),u>i[c]&&(i[c]=u)}const[s,r,o]=i.map((l,c)=>l-t[c]+1),a=new Int32Array(n.length);if(s*r*o<=Number.MAX_SAFE_INTEGER){const l=new Float64Array(e);for(let u=0,d=0;d<e;u+=3,d++)l[d]=((n[u+2]-t[2])*r+(n[u+1]-t[1]))*s+(n[u]-t[0]);l.sort();const c=s*r;for(let u=0;u<e;u++){const d=l[u],h=Math.floor(d/c),p=d-h*c,g=Math.floor(p/s);a[3*u]=p-g*s+t[0],a[3*u+1]=g+t[1],a[3*u+2]=h+t[2]}}else{const l=new BigUint64Array(e);for(let u=0,d=0;d<e;u+=3,d++)l[d]=BigInt(n[u+2]-t[2])<<40n|BigInt(n[u+1]-t[1])<<20n|BigInt(n[u]-t[0]);l.sort();const c=(1n<<20n)-1n;for(let u=0;u<e;u++){const d=l[u];a[3*u]=Number(d&c)+t[0],a[3*u+1]=Number(d>>20n&c)+t[1],a[3*u+2]=Number(d>>40n)+t[2]}}return a}const ns=n=>n>=0?2*n:-2*n-1;function Br(n){let e=1;for(;n>=128;)n=Math.floor(n/128),e++;return e}function kr(n,e,t){for(;t>=128;)n[e++]=t%128|128,t=Math.floor(t/128);return n[e++]=t,e}function ig(n){const e=n.length/3;let t=Br(e),i=0,s=0,r=0;for(let l=0;l<n.length;l+=3){const[c,u,d]=[n[l],n[l+1],n[l+2]];t+=Br(ns(d-r))+Br(ns(u-s))+Br(ns(c-i)),i=c,s=u,r=d}const o=new Uint8Array(t);let a=kr(o,0,e);i=0,s=0,r=0;for(let l=0;l<n.length;l+=3){const[c,u,d]=[n[l],n[l+1],n[l+2]];a=kr(o,a,ns(d-r)),a=kr(o,a,ns(u-s)),a=kr(o,a,ns(c-i)),i=c,s=u,r=d}return o}function sg(n,e,t){return kc(n,e,Bc(t))}function kc(n,e,t){const i=new TextEncoder().encode(`${Ls({format:Qm,generation:e,run:n})}
`),s=ig(t),r=new Uint8Array(i.length+s.length);return r.set(i,0),r.set(s,i.length),r}async function zc(n){const e=new Uint8Array(await crypto.subtle.digest("SHA-256",n));return`sha256:${Array.from(e,t=>t.toString(16).padStart(2,"0")).join("")}`}function mf(n,e,t){return zc(sg(n,e,t))}function Gc(n,e="run"){jn(n,e,["contest","rules","seed","arena","limits"]);const{contest:t}=n;if(t!==null&&!(typeof t=="string"&&eg.test(t)))throw new Le(`${e}.contest must be null or a contest id (lower-case letters, digits and dashes).`);jn(n.rules,`${e}.rules`,["birth","survival"]);let i;try{i=Si(n.rules)}catch(c){throw c instanceof Hi?new Le(`${e}.rules: ${c.message}`):c}let s=null;if(n.arena!==null){jn(n.arena,`${e}.arena`,["min","max"]);const c=Gi(n.arena.min,`${e}.arena.min`),u=Gi(n.arena.max,`${e}.arena.max`);if(!c.every((d,h)=>d<=u[h]))throw new Le(`${e}.arena.min must not be past ${e}.arena.max.`);s={min:c,max:u}}jn(n.limits,`${e}.limits`,["cells","extent","generations"]);const r={};for(const c of["cells","extent","generations"]){const u=n.limits[c];if(u!==null&&!(Number.isSafeInteger(u)&&u>=0))throw new Le(`${e}.limits.${c} must be null or a whole number.`);r[c]=u}if(!Array.isArray(n.seed))throw new Le(`${e}.seed must be a list of [x, y, z] cells.`);const o=new Int32Array(3*n.seed.length);n.seed.forEach((c,u)=>{const[d,h,p]=Gi(c,`${e}.seed[${u}]`);if(s&&!(d>=s.min[0]&&d<=s.max[0]&&h>=s.min[1]&&h<=s.max[1]&&p>=s.min[2]&&p<=s.max[2]))throw new Le(`${e}.seed[${u}], [${d}, ${h}, ${p}], is outside the arena.`);o.set([d,h,p],3*u)});const a=[],l=Bc(o);for(let c=0;c<l.length;c+=3){const[u,d,h]=[l[c],l[c+1],l[c+2]],p=a[a.length-1];(!p||p[0]!==u||p[1]!==d||p[2]!==h)&&a.push([u,d,h])}if(r.cells!==null&&a.length>r.cells)throw new Le(`${e}.seed has more cells than ${e}.limits.cells.`);if(r.extent!==null&&a.length){const c=[...a[0]],u=[...a[0]];for(const h of a)for(let p=0;p<3;p++)h[p]<c[p]&&(c[p]=h[p]),h[p]>u[p]&&(u[p]=h[p]);if(Math.max(...u.map((h,p)=>h-c[p]+1))>r.extent)throw new Le(`${e}.seed is wider than ${e}.limits.extent.`)}return{contest:t,rules:i,seed:a,arena:s,limits:r}}function gf(n,{chunkSize:e,slabBytes:t,memory:i}={}){const s={rules:n.rules,arena:n.arena,limits:{cells:n.limits.cells??void 0,extent:n.limits.extent??void 0,memory:i}};return e!==void 0&&(s.chunkSize=e),t!==void 0&&(s.slabBytes=t),s}async function rg({run:n,generation:e,cells:t,ending:i,details:s={},withCells:r=!1,score:o,departures:a}){const l=Gc(n);if(!ko.includes(i))throw new Le(`A run that ended with ${JSON.stringify(i)} can't be a result.`);if(!(Number.isSafeInteger(e)&&e>=0))throw new Le("generation must be a whole number.");const c=Bc(t),u={format:Bo,version:yl,run:l,generation:e,ending:i};if(o!==void 0&&(u.score=xf(o)),a!==void 0&&(u.departures=_f(a)),Object.assign(u,{hash:await zc(kc(l,e,c)),seedHash:await mf(l,0,Int32Array.from(l.seed.flat())),details:{chunkSize:s.chunkSize??null,elapsedMs:s.elapsedMs??null,stats:s.stats??null,browser:s.browser??null}}),s.timeline!==void 0&&(u.details.timeline=s.timeline.map(([d,h])=>[d,h])),yf(u.details),r){const d=new Array(c.length/3);for(let h=0;h<d.length;h++)d[h]=[c[3*h],c[3*h+1],c[3*h+2]];u.cells=d}return u}async function og(n){const{run:e,generation:t}=n;return n.seedHash!==void 0&&await mf(e,0,Int32Array.from(e.seed.flat()))!==n.seedHash?"The file's seedHash isn't the hash of its seed.":n.cells!==void 0&&await zc(kc(e,t,Int32Array.from(n.cells.flat())))!==n.hash?`The file's cells aren't the ones its hash names for generation ${t}.`:null}function Hc(n){return`${JSON.stringify(n,null,2).replace(/\[\s+([-\d.eE+,\s]+?)\s+\]/g,(e,t)=>`[${t.split(/,\s*/).join(", ")}]`)}
`}function ta(n){if(typeof n!="string")throw new Le("A result file is text.");if(n.length>An||new TextEncoder().encode(n).length>An)throw new Le(`The file is larger than ${An/1024/1024} MB, so it isn't a result file.`);let e;try{e=JSON.parse(n)}catch{throw new Le("The file isn't JSON.")}if(jn(e,"The file",["format","version","run","generation","ending","hash","details"],["score","departures","seedHash","cells"]),e.format!==Bo)throw new Le(`The file isn't a result file (its format isn't "${Bo}").`);if(e.version!==yl)throw new Le(`The file's version is ${JSON.stringify(e.version)}; this lab reads version ${yl}.`);const t=Gc(e.run);if(!(Number.isSafeInteger(e.generation)&&e.generation>=0))throw new Le("generation must be a whole number.");if(!ko.includes(e.ending))throw new Le(`ending must be one of ${ko.join(", ")}.`);if(typeof e.hash!="string"||!ed.test(e.hash))throw new Le('hash must be "sha256:" and 64 lower-case hex digits.');if(e.seedHash!==void 0&&(typeof e.seedHash!="string"||!ed.test(e.seedHash)))throw new Le('seedHash must be "sha256:" and 64 lower-case hex digits.');yf(e.details);const i={format:e.format,version:e.version,run:t,generation:e.generation,ending:e.ending};return e.score!==void 0&&(i.score=xf(e.score)),e.departures!==void 0&&(i.departures=_f(e.departures)),i.hash=e.hash,e.seedHash!==void 0&&(i.seedHash=e.seedHash),i.details=e.details,e.cells!==void 0&&(i.cells=vf(e.cells)),i}function _f(n){if(!Array.isArray(n))throw new Le("departures must be a list.");return n.map((e,t)=>{const i=`departures[${t}]`;jn(e,i,["generation","period","shift","cells"]);const{generation:s,period:r}=e;if(!(Number.isSafeInteger(s)&&s>=0))throw new Le(`${i}.generation must be a whole number.`);if(!(Number.isSafeInteger(r)&&r>=1))throw new Le(`${i}.period must be a whole number of at least 1.`);const o=Gi(e.shift,`${i}.shift`);if(o.every(l=>l===0))throw new Le(`${i}.shift must move the ship: it can't be [0, 0, 0].`);const a=vf(e.cells,`${i}.cells`);if(!a.length)throw new Le(`${i}.cells must have a cell.`);if(t>0){const l=n[t-1],[c,u,d]=a[0],[h,p,g]=l.cells[0];if(!(s>l.generation||s===l.generation&&(d>g||d===g&&(u>p||u===p&&c>h))))throw new Le(`${i} is out of order: departures are listed by generation, then by their first cell.`)}return{generation:s,period:r,shift:o,cells:a}})}function vf(n,e="cells"){if(!Array.isArray(n))throw new Le(`${e} must be a list of [x, y, z] cells.`);return n.map((t,i)=>{const[s,r,o]=Gi(t,`${e}[${i}]`);if(i>0){const[a,l,c]=n[i-1];if(!(o>c||o===c&&(r>l||r===l&&s>a)))throw new Le(`${e}[${i}] is out of order or listed twice: cells are sorted by z, then y, then x.`)}return[s,r,o]})}function xf(n){if(!Vc(n))throw new Le("score must be an object.");const e=Object.keys(n);if(e.length>td)throw new Le(`score has more than ${td} fields.`);const t={};for(const i of e){if(!tg.test(i))throw new Le(`score has a field with a name that isn't a word, ${JSON.stringify(i.slice(0,Sl))}.`);const s=n[i];if(s!==null&&!(Number.isSafeInteger(s)&&s>=0))throw new Le(`score.${i} must be null or a whole number.`);t[i]=s}return t}function yf(n){if(jn(n,"details",["chunkSize","elapsedMs","stats","browser"],["timeline"]),n.timeline!==void 0&&ag(n.timeline),n.chunkSize!==null&&!Qu.includes(n.chunkSize))throw new Le(`details.chunkSize must be null or one of ${Qu.join(", ")}.`);if(n.elapsedMs!==null&&!nd(n.elapsedMs))throw new Le("details.elapsedMs must be null or a number of milliseconds.");if(n.stats!==null){const{stats:e}=n;if(!Vc(e))throw new Le("details.stats must be null or an object.");for(const t of Object.keys(e))if(t==="extent"){if(e.extent===null)continue;jn(e.extent,"details.stats.extent",["min","max"]),Gi(e.extent.min,"details.stats.extent.min"),Gi(e.extent.max,"details.stats.extent.max")}else if(ng.includes(t)){if(!nd(e[t]))throw new Le(`details.stats.${t} must be a number.`)}else throw new Le(`details.stats has an unknown field, ${JSON.stringify(t)}.`)}if(n.browser!==null){jn(n.browser,"details.browser",["name","version"]);for(const e of["name","version"]){const t=n.browser[e];if(typeof t!="string"||t.length>Sl)throw new Le(`details.browser.${e} must be text of at most ${Sl} characters.`)}}}function ag(n){if(!Array.isArray(n)||n.length<1||n.length>ur)throw new Le(`details.timeline must be a list of 1 to ${ur} points.`);let e=null;for(const[t,i]of n.entries()){const s=r=>Number.isSafeInteger(r)&&r>=0;if(!Array.isArray(i)||i.length!==2||!s(i[0])||!s(i[1]))throw new Le(`details.timeline[${t}] must be [ms, generation], two whole numbers.`);if(t===0&&(i[0]!==0||i[1]!==0))throw new Le("details.timeline must start at [0, 0].");if(e&&(i[0]<e[0]||i[1]<e[1]))throw new Le(`details.timeline[${t}] goes back: neither its time nor its generation may fall.`);e=i}}function Vc(n){return typeof n=="object"&&n!==null&&!Array.isArray(n)}function nd(n){return typeof n=="number"&&Number.isFinite(n)&&n>=0}function jn(n,e,t,i=[]){if(!Vc(n))throw new Le(`${e} must be an object.`);for(const s of t)if(!Object.hasOwn(n,s))throw new Le(`${e} is missing ${JSON.stringify(s)}.`);for(const s of Object.keys(n))if(!t.includes(s)&&!i.includes(s))throw new Le(`${e} has an unknown field, ${JSON.stringify(s)}.`)}function Gi(n,e){if(!Array.isArray(n)||n.length!==3||!n.every(t=>Number.isInteger(t)&&t>=-pi&&t<pi))throw new Le(`${e} must be [x, y, z], whole numbers from ${-pi} to ${pi-1}.`);return[n[0],n[1],n[2]]}const $t=Object.freeze({min:Object.freeze([-5,-5,-5]),max:Object.freeze([4,4,4])}),Sf=Object.freeze({min:Object.freeze([-32,-32,-32]),max:Object.freeze([31,31,31])});function lg({min:n,max:e}){const t=[];for(let i=n[2];i<=e[2];i++)for(let s=n[1];s<=e[1];s++)for(let r=n[0];r<=e[0];r++)t.push([r,s,i]);return t}const Mf=n=>(n&&typeof n=="object"&&(Object.values(n).forEach(Mf),Object.freeze(n)),n),Er="Season 0",$c="2026-12-31T23:59:00-06:00",cg={id:"speed-1",kind:"speed",title:"Speed",summary:"How many generations your browser computes in 6 seconds",fixes:{rules:Si({birth:[9,10],survival:[5,6,7,8,9,10,11,12,13,14,15]}),seed:lg($t),arena:null,limits:{cells:null,extent:null,generations:1e3}},chunkSize:16,closes:$c,seconds:6,ceiling:1e3},ug={id:"methuselah-1",kind:"methuselah",title:"Methuselah",summary:"The longest-lived pattern that settles inside the arena",fixes:{seedBox:$t,arena:Sf,limits:{cells:null,extent:null,generations:1e4}},chunkSize:16,closes:$c,budget:1e4},dg={id:"classic-methuselah-1",kind:"methuselah",title:"Classic Methuselah",summary:"The longest-lived pattern that settles once its ships have left the arena",fixes:{seedBox:$t,arena:Sf,limits:{cells:null,extent:null,generations:1e4}},chunkSize:16,closes:$c,budget:1e4,departures:{period:32}},zo=Mf([cg,ug,dg]);function Ds(n){return zo.find(e=>e.id===n)}function wf(n){const e=n.contest===null?void 0:Ds(n.contest)?.departures;return e?{period:e.period}:null}function Wc(n,e={}){const{fixes:t}=n;if(!t.rules&&!e.rules)throw new Le("The entry needs its rules.");if(!t.seed&&!Array.isArray(e.seed))throw new Le("The entry needs its seed, a list of [x, y, z] cells.");const i=Gc({contest:n.id,rules:t.rules??e.rules,seed:t.seed??e.seed,arena:t.arena,limits:t.limits});if(!t.seed){if(!i.seed.length)throw new Le("The seed is empty: it needs at least one live cell.");const s=t.seedBox,r=i.seed.find(o=>o.some((a,l)=>a<s.min[l]||a>s.max[l]));if(r)throw new Le(`The seed's cell [${r.join(", ")}] is outside the seed box, cells ${s.min[0]} to ${s.max[0]} on each axis.`)}return i}function hg(n,e,t){return{generations:e,ms:e===n.ceiling?Math.max(1,Math.round(t)):null}}function fg(n,e){return n.generations!==e.generations?e.generations-n.generations:n.ms===e.ms?0:(n.ms??1/0)-(e.ms??1/0)}function pg(n,{ending:e,generation:t,period:i}){if(e!=="died"&&e!=="repeat")return null;const s=e==="died"?1:i;return!(Number.isSafeInteger(s)&&s>=1)||t+s>n.budget?null:{generations:t,period:s}}function mg(n,e){return n.score.generations!==e.score.generations?e.score.generations-n.score.generations:n.seedCells-e.seedCells}function gg(n){return n.birth.includes(1)?["With birth on 1 neighbour (B1), a pattern grows by at least a cell a generation on every side, so it always reaches the edge of the arena, by generation 37, and can't score."]:[]}const Oi=100,Nn=1e6,bf="morpheus-tech-lab/explore-seed",Ml=1;class Xe extends Error{constructor(e){super(e),this.name="SeedError"}}function _g(n,e,t=0){if(!Number.isInteger(e)||e<1||e>Oi)throw new Xe(`The seed's size must be a whole number from 1 to ${Oi}.`);const i=Math.max(2*e+3,(t||0)+1),s=new Qt(i,0);n(s,i);const r=Math.floor(i/2),o=new Int32Array(3*s.active.length);return s.active.forEach(([a,l,c],u)=>{o[3*u]=a-r,o[3*u+1]=l-r,o[3*u+2]=c-r}),o}function Mi(n,e){const t=new Set;for(const i of String(n??"").split(",").map(s=>s.trim()).filter(Boolean)){const s=/^(\d+)\s*-\s*(\d+)$/.exec(i),r=/^\d+$/.test(i);if(!s&&!r)throw new Xe(`The ${e} counts can't include "${i}": use numbers and ranges, such as 9,10 or 5-15.`);const[o,a]=s?[Number(s[1]),Number(s[2])].sort((l,c)=>l-c):[Number(i),Number(i)];if(a>gr)throw new Xe(`The ${e} counts go up to ${gr}, the number of neighbours a cell has; ${a} is too many.`);for(let l=o;l<=a;l++)t.add(l)}return[...t].sort((i,s)=>i-s)}function vg(n,e){const t=Mi(n,"birth");if(!t.length)throw new Xe("Give at least one birth count, or no cell can ever be born.");return Si({birth:t,survival:Mi(e,"survival")})}function Tr(n){if(!n)return null;const e=-Math.floor(n/2);return{min:[e,e,e],max:[e+n-1,e+n-1,e+n-1]}}function Xc({rules:n,cells:e}){const t=e.length/3;if(t>Nn)throw new Xe(`That's ${t.toLocaleString("en")} live cells; a seed file holds at most ${Nn.toLocaleString("en")}.`);const i=new Array(t);for(let r=0;r<t;r++)i[r]=`    [${e[3*r]}, ${e[3*r+1]}, ${e[3*r+2]}]`;return`${JSON.stringify({format:bf,version:Ml,...n&&{rules:n}},null,2).slice(0,-2)},
  "cells": [
${i.join(`,
`)}
  ]
}
`}function Ef(n){let e;try{e=JSON.parse(n)}catch{throw new Xe("This isn't a seed or simulation file: it isn't JSON.")}if(e?.format!==bf)throw new Xe("This isn't a seed or simulation file for Game of Life 3D (unbounded).");if(e.version!==Ml)throw new Xe(`This file is version ${e.version}; this page reads version ${Ml}.`);const t=e.rules===void 0?null:Si(e.rules);if(!Array.isArray(e.cells))throw new Xe("The file's cells must be a list.");if(e.cells.length>Nn)throw new Xe(`The file has ${e.cells.length.toLocaleString("en")} cells; the most it can have is ${Nn.toLocaleString("en")}.`);const i=new Int32Array(3*e.cells.length),s=new Set;return e.cells.forEach((r,o)=>{if(!(Array.isArray(r)&&r.length===3&&r.every(c=>Number.isInteger(c)&&c>=-pi&&c<pi)))throw new Xe(`Cell ${o+1} of the file isn't [x, y, z] in whole numbers from ${-pi} to ${pi-1}.`);const l=r.join(",");if(s.has(l))throw new Xe(`Cell ${o+1} of the file, [${l}], is listed twice.`);s.add(l),i.set(r,3*o)}),{rules:t,cells:i}}const _n=$t.max[0]-$t.min[0]+1,Wn=_n*_n*_n,xg=100,yg=.3,Tf=["cell","line","plane","box","all"],_r=["x","y","z"],Af=Object.freeze({ArrowRight:["right",1],ArrowLeft:["right",-1],ArrowUp:["up",1],ArrowDown:["up",-1],PageUp:["forward",1],PageDown:["forward",-1]}),{min:Vt,max:Xn}=$t;function Go(n,e,t){return Sg(n,e,t)?n-Vt[0]+_n*(e-Vt[1]+_n*(t-Vt[2])):-1}function rr(n){return[Vt[0]+n%_n,Vt[1]+Math.floor(n/_n)%_n,Vt[2]+Math.floor(n/(_n*_n))]}function Sg(n,e,t){return n>=Vt[0]&&n<=Xn[0]&&e>=Vt[1]&&e<=Xn[1]&&t>=Vt[2]&&t<=Xn[2]}function Rf(n){const e=new Uint8Array(Wn);let t=0;for(let i=0;i<n.length;i+=3){const s=Go(n[i],n[i+1],n[i+2]);s<0?t++:e[s]=1}if(t){const i=t.toLocaleString("en");throw new Xe(t===1?`1 cell of this seed lies outside the ${_n}³ box.`:`${i} cells of this seed lie outside the ${_n}³ box.`)}return e}function Mg(n){const e=[];for(let t=0;t<n.length;t++)n[t]&&e.push(...rr(t));return Int32Array.from(e)}class wg{constructor(e=null){this.places=e?Uint8Array.from(e):new Uint8Array(Wn),this.cursor=[0,0,0],this.kind="plane",this.axis=0,this.anchor=null,this.past=[],this.future=[]}get count(){let e=0;for(let t=0;t<Wn;t++)e+=this.places[t];return e}isAlive(e,t,i){const s=Go(e,t,i);return s>=0&&this.places[s]===1}toCells(){return Mg(this.places)}setCursor(e){this.cursor=e.map((t,i)=>Math.min(Xn[i],Math.max(Vt[i],Math.round(t))))}moveCursor(e,t){const i=[...this.cursor];i[e]+=t,this.setCursor(i)}setKind(e){if(!Tf.includes(e))throw new Error(`No selection kind ${e}`);this.kind=e,this.anchor=e==="box"?[...this.cursor]:null}setAxis(e){if(![0,1,2].includes(e))throw new Error(`No axis ${e}`);this.axis=e}setAnchor(e){this.kind="box",this.anchor=e.map((t,i)=>Math.min(Xn[i],Math.max(Vt[i],Math.round(t))))}selection(){const e=this.cursor,t=this.axis;switch(this.kind){case"line":return{min:e.map((i,s)=>s===t?Vt[s]:i),max:e.map((i,s)=>s===t?Xn[s]:i)};case"plane":return{min:e.map((i,s)=>s===t?i:Vt[s]),max:e.map((i,s)=>s===t?i:Xn[s])};case"box":{const i=this.anchor??e;return{min:e.map((s,r)=>Math.min(s,i[r])),max:e.map((s,r)=>Math.max(s,i[r]))}}case"all":return{min:[...Vt],max:[...Xn]};default:return{min:[...e],max:[...e]}}}focus(){if(this.kind==="box"||this.kind==="all")return this.selection();const e=this.cursor,t=this.axis;return{min:e.map((i,s)=>s===t?i:Vt[s]),max:e.map((i,s)=>s===t?i:Xn[s])}}isSelected(e,t,i){const{min:s,max:r}=this.selection();return e>=s[0]&&e<=r[0]&&t>=s[1]&&t<=r[1]&&i>=s[2]&&i<=r[2]}selectedPlaces(){const{min:e,max:t}=this.selection(),i=[];for(let s=e[2];s<=t[2];s++)for(let r=e[1];r<=t[1];r++)for(let o=e[0];o<=t[0];o++)i.push(Go(o,r,s));return i}selectionCount(){const e=this.selectedPlaces();let t=0;for(const i of e)t+=this.places[i];return{cells:e.length,alive:t}}switchSelection(){const e=this.selectedPlaces(),t=e.every(i=>this.places[i]===1);return this.change(i=>{for(const s of e)i[s]=t?0:1}),t?"cleared":"filled"}randomFill(e,t){if(!(e>=0&&e<=1))throw new Xe("The density must be from 0 to 1.");const i=this.selectedPlaces();this.change(s=>{for(const r of i)s[r]=t()<e?1:0})}replace(e){this.change(t=>t.set(e))}change(e){const t=Uint8Array.from(this.places);return e(t),t.every((i,s)=>i===this.places[s])?!1:(this.past.push(this.places),this.past.length>xg&&this.past.shift(),this.future=[],this.places=t,!0)}get canUndo(){return this.past.length>0}get canRedo(){return this.future.length>0}undo(){return this.past.length?(this.future.push(this.places),this.places=this.past.pop(),!0):!1}redo(){return this.future.length?(this.past.push(this.places),this.places=this.future.pop(),!0):!1}}function wl(n){return n<0?`−${-n}`:`${n}`}function Ro(n){return n.map((e,t)=>`${_r[t]} ${wl(e)}`).join(", ")}function bg(n){const{cells:e,alive:t}=n.selectionCount(),i=l=>l.toLocaleString("en"),s=_r[n.axis],r=n.cursor,o=[0,1,2].filter(l=>l!==n.axis).map(l=>`${_r[l]} ${wl(r[l])}`).join(", "),a=`${i(e)} cells, ${i(t)} alive.`;switch(n.kind){case"cell":return`Cell at ${Ro(r)}: ${t?"alive":"empty"}.`;case"line":return`Line along ${s}, at ${o}: ${a}`;case"plane":return`Plane across ${s}, at ${s} ${wl(r[n.axis])}: ${a}`;case"box":{const{min:l,max:c}=n.selection();return`Box ${c.map((d,h)=>d-l[h]+1).join("×")}, from ${Ro(l)} to ${Ro(c)}: ${a}`}default:return`All ${i(e)} cells: ${i(t)} alive.`}}const id=[[0,1,2],[0,2,1],[1,0,2],[1,2,0],[2,0,1],[2,1,0]];function Eg({right:n,up:e,forward:t}){const i=[n,e,t];let s=id[0],r=-1;for(const a of id){const l=Math.abs(i[0][a[0]])+Math.abs(i[1][a[1]])+Math.abs(i[2][a[2]]);l>r+1e-9&&(s=a,r=l)}const o=(a,l)=>({axis:l,sign:a[l]<0?-1:1});return{right:o(n,s[0]),up:o(e,s[1]),forward:o(t,s[2])}}function Tg(n,e){const t=Af[n];if(!t)return null;const[i,s]=t,{axis:r,sign:o}=Eg(e)[i];return{axis:r,delta:o*s}}const Ag=1024,Rg=64,zr={min:64,max:16384},Gr={min:8,max:1024},Cf=Ds("classic-methuselah-1").departures.period,sd=["end","ships","wrap","walls"],Yc=[{key:"corner",name:"Corner",neighbours:Aa.corner},{key:"edge",name:"Edge",neighbours:Aa.edge},{key:"face",name:"Face",neighbours:Aa.face}],Cg=Object.freeze({corner:Object.freeze({birth:[2,3],survival:[2,3,4]}),edge:Object.freeze({birth:[4],survival:[2,3,4,5,6]}),face:Object.freeze({birth:[6],survival:[3,4,5,6,7,8,9]})}),Pg=Object.freeze({birth:[9,10],survival:Array.from({length:11},(n,e)=>5+e)}),Pf="preset:",Lf=[{key:"cube",name:"Cube"},{key:"tetrahedron",name:"Tetrahedron"},{key:"octahedron",name:"Octahedron"},{key:"perlin",name:"Perlin noise",short:"Perlin",noise:!0},{key:"worley",name:"Worley noise",short:"Worley",noise:!0},...br.map(n=>({key:`${Pf}${n.id}`,name:`${n.name}'s cells`,preset:n.id,...n.group&&{group:n.group}}))],Lg={cube:({size:n,density:e})=>pf(n,e),tetrahedron:({size:n,density:e})=>Uc(n,e),octahedron:({size:n,density:e})=>Fc(n,e),perlin:({size:n,density:e,regionSize:t})=>Nc(n,e,t||null),worley:({size:n,density:e,regionSize:t})=>Oc(n,e,t||null)};function na(n){return Lf.find(e=>e.key===n)}function Dg(n){return{seed:qc("cube",n),rules:Pg,arena:null,arenaSize:Rg,edge:"end",walls:Cg,memoryMB:Ag}}function qc(n,e={},t=null){const i=na(n);if(!i)throw new Xe("Pick a shape for the seed.");if(i.preset)return{kind:"shape",key:n,cells:In(i.preset).cells};const s=c=>c===""||c===null||c===void 0?NaN:Number(c),r=s(e.size),o=s(e.density),a=i.noise&&Number(e.regionSize)||0;if(!Number.isInteger(r)||r<1||r>Oi)throw new Xe(`In Game of Life 3D (unbounded), the seed's size must be a whole number from 1 to ${Oi}.`);if(!(o>=0&&o<=1))throw new Xe("The seed's density must be from 0 to 1.");if(!Number.isInteger(a)||a<0||a>2*Oi)throw new Xe(`In Game of Life 3D (unbounded), the region size must be a whole number up to ${2*Oi}.`);const l=i.noise?{size:r,density:o,regionSize:a}:{size:r,density:o};return t?.kind==="shape"&&t.key===n&&Ig(t.params,l)?t:{kind:"shape",key:n,params:l,cells:_g(Lg[n](l),r,a)}}function Ig(n,e){if(!n)return!1;const t=Object.keys(e);return t.length===Object.keys(n).length&&t.every(i=>n[i]===e[i])}function Ng(n){const e=In(n);if(!e)throw new Xe("Pick a preset.");return{kind:"preset",id:n,cells:e.cells}}function Ug(n,e){if(e.kind==="generation"){const{cells:t,seed:i,from:s,rules:r,arena:o}=e;return{kind:"saved",name:n,cells:t,seed:i,from:s,rules:r,arena:o}}if(!e.rules)throw new Xe(`${n} is a seed file: it holds cells, but no rules, so it isn't a simulation. Load it from the Seed box, under File, to run it under the rules in the Rules box.`);return{kind:"file",name:n,cells:e.cells,rules:e.rules}}function Fg(n,e){if(e.kind==="generation")throw new Xe(`${n} is a saved generation: a simulation carried on from generation ${e.from.toLocaleString("en")}, not a seed. Load it from the Simulation box, with Load simulation….`);return{kind:"file",name:n,cells:e.cells}}function Og(n){return{kind:"design",cells:n}}const Df="A saved generation carries on under its own rules and arena, so it can't open as a design.";function If(n){const e=Ar(n);if(n.seed.kind==="saved")return{places:null,rules:e,reason:Df};try{return{places:Rf(n.seed.cells),rules:e,reason:null}}catch(t){if(!(t instanceof Xe))throw t;return{places:null,rules:e,reason:t.message}}}function Bg(n,e){if(e.kind==="generation")throw new Xe(`${n} is a saved generation. ${Df} Load simulation… in the Simulation box carries it on.`);try{return{places:Rf(e.cells),rules:e.rules}}catch(t){throw t instanceof Xe?new Xe(`${n} can't open here: ${t.message} Load seed… in the Seed box still runs it.`):t}}function kg(n,e,t){return vi({...n,seed:Og(e),rules:t})}function Ar(n){const{seed:e}=n;return e.kind==="preset"?In(e.id).rules:e.kind==="saved"?e.rules:n.rules}function vr(n){return n.seed.kind==="saved"?n.seed.arena:n.arena}function Hs(n){return n.seed.kind!=="saved"&&n.arena!==null?n.edge:"end"}function zg(n){return Hs(n)==="ships"}function bl(n){return Hs(n)==="wrap"}function jc(n){return Hs(n)==="walls"?n.walls:null}function qi(n){const{seed:e}=n;if(e.kind==="preset"){const{name:t}=In(e.id);return{by:"preset",name:t,text:`with ${t}`}}return e.kind==="saved"?{by:"saved",name:e.name,text:"with the saved generation"}:null}function Nf(n){return n.seed.kind==="saved"?n.seed.from:0}function xr(n){return`Applying restarts the run from generation ${n.toLocaleString("en")}.`}function ia(n){const e=t=>t.toLocaleString("en");switch(n.kind){case"preset":return In(n.id).name;case"file":return n.label??n.name;case"saved":return`Gen ${e(n.from)}: ${n.name}`;case"design":return"Design";default:{const t=na(n.key);if(t.preset)return In(t.preset).name;if(!n.params)return t.name;const{size:i,density:s}=n.params,r=s===1?"":`, ${Math.round(s*100)}%`;return`${t.short??t.name} ${i}${r}`}}}function Kc(n){const{seed:e}=n;if(e.kind==="preset")return{name:In(e.id).name,from:"preset",id:e.id};if(e.kind==="saved")return{name:`Generation ${e.from.toLocaleString("en")} of ${e.name}`,from:"saved"};if(e.kind==="file"&&e.rules&&Uf(e.rules,n.rules))return{name:e.name,from:"file"};const t=Gg(e.cells,n.rules);return t?{name:t.name,from:"preset",id:t.id}:{name:"Custom",from:null}}function Gg(n,e){return br.find(t=>t.cells.length===n.length&&Uf(t.rules,e)&&od(t.cells)===od(n))}const rd=new WeakMap;function od(n){let e=rd.get(n);if(e===void 0){const t=[];for(let i=0;i<n.length;i+=3)t.push(`${n[i]},${n[i+1]},${n[i+2]}`);e=t.sort().join(";"),rd.set(n,e)}return e}function Uf(n,e){const t=(i,s)=>i.length===s.length&&i.every((r,o)=>r===s[o]);return t(n.birth,e.birth)&&t(n.survival,e.survival)}function Hg(n){const e=qi(n);return{seed:ia(n.seed),cells:n.seed.cells.length/3,rules:Ar(n),lock:e?.text??null,arena:vr(n),arenaLocked:e?.by==="saved",edge:Hs(n),walls:jc(n),memoryMB:n.memoryMB}}function Vg(n){const e=Array.from({length:gr+1},(r,o)=>o);if(!n.length)return{isolation:e,overcrowding:[],gaps:[]};const t=n[0],i=n[n.length-1],s=new Set(n);return{isolation:e.filter(r=>r<t),overcrowding:e.filter(r=>r>i),gaps:e.filter(r=>r>t&&r<i&&!s.has(r))}}function Ff(n){const{seed:e,memoryMB:t}=n,i=Ar(n),s=vr(n),r=zg(n),o=bl(n),a=jc(n),{cells:l}=e;if(!l.length){const d={saved:"This saved generation has no live cells, so there is nothing to carry on.",design:"The design has no live cells: switch some on first."};throw new Xe(d[e.kind]??"The seed has no live cells: raise its density or its size.")}const c=Tr(s);if(c)for(let d=0;d<l.length;d++){const h=d%3;if(l[d]<c.min[h]||l[d]>c.max[h])throw new Xe(`The seed doesn't fit inside a ${s}³ arena: make the arena bigger or the seed smaller.`)}const u=ia(e);return e.kind==="saved"?{rules:i,cells:l,memoryMB:t,arena:s,ships:r,wrap:o,walls:a,label:u,seed:e.seed,from:e.from}:{rules:i,cells:l,memoryMB:t,arena:s,ships:r,wrap:o,walls:a,label:u}}function $g(n){const e={rules:n.rules,limits:{memory:n.memoryMB*1048576}},t=Tr(n.arena);return t&&(e.arena=t),t&&n.ships?e.departures={period:Cf}:t&&n.wrap?e.wrap=!0:t&&n.walls&&(e.walls=n.walls),e}function vi(n){return Ff(n),n}function Ho(n,e){return e.kind==="file"&&e.rules?vi({...n,seed:e,rules:e.rules}):e.kind==="preset"||e.kind==="saved"?vi({...n,seed:e}):vi({...Zc(n),seed:e})}function Zc(n){const{seed:e}=n;if(e.kind==="preset")return{...n,seed:qc(`${Pf}${e.id}`),rules:Ar(n)};if(e.kind==="saved"){const t=`Gen ${e.from.toLocaleString("en")}: ${e.name}`;return{...n,seed:{kind:"file",name:e.name,cells:e.cells,label:t},rules:e.rules,arena:e.arena,arenaSize:e.arena??n.arenaSize}}return n}function Wg(n,e,t,{own:i=!1}={}){const s=qi(n);if(s&&!i)throw new Xe(zf(s,"rules"));const r=i?Zc(n):n;return vi({...r,rules:vg(e,t)})}function Of(n){const e={};for(const{key:t,name:i,neighbours:s}of Yc){const r=`${i.toLowerCase()} cells'`,o=Mi(n[t]?.birth,`${r} birth`),a=Mi(n[t]?.survival,`${r} survival`);try{e[t]=Si({birth:o,survival:a})}catch(c){throw c instanceof Hi?new Hi(`On the walls' ${i.toLowerCase()} cells: ${c.message}`):c}const l=[...o,...a].find(c=>c>s);if(l!==void 0){const c=t==="edge"?"An":"A";throw new Xe(`${c} ${i.toLowerCase()} cell has ${s} neighbours inside the walls, so its counts go from 0 to ${s}; ${l} is past them.`)}}return e}function Bf(n,e,t,{own:i=!1,edge:s,walls:r}={}){const o=qi(n);if(o?.by==="saved"&&!i)throw new Xe(zf(o,"arena"));const a=i?Zc(n):n,l=Number(t),c=Number.isInteger(l)&&l>=Gr.min&&l<=Gr.max;if(e&&!c)throw new Xe(`The arena size must be a whole number of cells, from ${Gr.min} to ${Gr.max}.`);if(s!==void 0&&!sd.includes(s))throw new Xe(`What happens at the edge must be one of ${sd.join(", ")}.`);const u=r===void 0?a.walls:Of(r);return vi({...a,arena:e?l:null,arenaSize:c?l:a.arenaSize,edge:s??a.edge,walls:u})}function kf(n,e,t,i=!1){const s=`a run here settles, or reaches the edge, where ${t}'s would, though Game of Life 3D (unbounded) doesn't stop at its budget.`,r=i?", with ships leaving at its edge":"",o=i?"ships":"end";if(vr(n)===e&&Hs(n)===o)return{setup:n,note:`The arena in Game of Life 3D (unbounded) is ${e}³${r}, as ${t}'s: ${s}`};try{const a=Bf(n,!0,e,{edge:o});let l;if(vr(n)!==e)l=`The arena in Game of Life 3D (unbounded) is now on, at ${e}³${r}, as ${t}'s: ${s} The Limits box turns it off.`;else if(bl(n)||jc(n)){const c=bl(n)?"no longer wraps around":"no longer has walls";l=`The ${e}³ arena in Game of Life 3D (unbounded) ${c}${i?", and ships leave at its edge":""}, as in ${t}: ${s} The Limits box changes it.`}else l=`Ships ${i?"now leave":"no longer leave"} at the edge of the ${e}³ arena in Game of Life 3D (unbounded), as in ${t}: ${s} The Limits box changes it.`;return{setup:a,note:l}}catch(a){if(!(a instanceof Xe))throw a;return{setup:n,note:`The arena in Game of Life 3D (unbounded) stays the saved generation's, so a run of it here may not end as ${t}'s would.`}}}function Xg(n,e,t,i,s=!1){const r={kind:"file",name:e.name,cells:e.cells,rules:e.rules},o=kf({...n,seed:r,rules:e.rules},t,i,s);return{setup:vi(o.setup),note:o.note}}function Yg(n,e){const t=Number(e);if(!Number.isInteger(t)||t<zr.min||t>zr.max)throw new Xe(`The memory limit must be a whole number of MB, from ${zr.min} to ${zr.max}.`);return vi({...n,memoryMB:t})}function zf(n,e){return`${n.by==="preset"?`${n.name} brings its own rules`:"The saved generation carries on under its own rules and arena"}: press Use your own rules to change the ${e}.`}function sa(n,e){if(!n||n.length===0)return{isolation:[],overcrowding:[]};const t=Math.min(...n),i=Math.max(...n),s=[];for(let o=0;o<t;o++)s.push(o);const r=[];for(let o=i+1;o<=e;o++)r.push(o);return{isolation:s,overcrowding:r}}const Gf=Array.from({length:11},(n,e)=>e+5),ad=sa(Gf,26),Hf=[2,3,4],ld=sa(Hf,7),Vf=[2,3,4,5,6],cd=sa(Vf,11),$f=[3,4,5,6,7,8,9],ud=sa($f,17),_={sim_size:50,sim_generations:100,viewMode:null,sliceAxis:null,sliceIndex:null,currentGen:0,isPlaying:!1,isReversing:!1,gridWrapping:!0,showWireframeGrid:!1,showCellWireframe:!1,showHUD:!0,cellSize:1.2,scene:null,renderer:null,camera:null,controls:null,autoRotateActive:!1,userHasInteracted:!1,autoRotateStartTime:null,autoRotateInitialPosition:null,autoRotateInitialRadius:null,autoRotateInitialAngle:null,simulationData:null,simulationModel:null,controlsInitialized:!1,shapeKey:"cube",lifeShapeKey:"cube",simulationMode:"explore",useRule30:!1,useRule30_2D:!1,useSineWave:!1,useSandpile:!1,flipOrientation:!1,gpuCompute:!0,explore:null,sandpileParams:{initialSand:0,threshold:4},modeValues:{gameOfLife:{size:50,generations:100},sineWave:{size:50,generations:100},rule30:{size:null,generations:100},sandpile:{size:50,generations:1e3},monteCarlo:{size:50,generations:100}},shapes:{perlin:Nc(10,.3,30),cube:Hm(5,1),tetrahedron:Uc(13),octahedron:Fc(8,1),worley:Oc(8,.5,20),rule30:Vm()},rules:{birth:[9,10],survival:Gf,isolation:ad.isolation,overcrowding:ad.overcrowding},boundaryRules:{corner:{birth:[2,3],survival:Hf,isolation:ld.isolation,overcrowding:ld.overcrowding},edgeTwoFaces:{birth:[4],survival:Vf,isolation:cd.isolation,overcrowding:cd.overcrowding},face:{birth:[6],survival:$f,isolation:ud.isolation,overcrowding:ud.overcrowding}},shapeParams:{perlin:{size:10,density:.3,regionSize:25},cube:{size:10,density:1},tetrahedron:{size:13,density:1},octahedron:{size:8,density:1},worley:{size:8,density:.3,regionSize:25}},get shapeFn(){return this.shapes[this.shapeKey]},reset(){this.viewMode=null,this.sliceAxis=null,this.sliceIndex=null,this.currentGen=0,this.isPlaying=!1,this.isReversing=!1,this.simulationData=null,this.simulationModel=null}};_.explore=Dg(_.shapeParams.cube);/**
 * @license
 * Copyright 2010-2025 Three.js Authors
 * SPDX-License-Identifier: MIT
 */const Jc="178",Es={ROTATE:0,DOLLY:1,PAN:2},Ms={ROTATE:0,PAN:1,DOLLY_PAN:2,DOLLY_ROTATE:3},qg=0,dd=1,jg=2,Wf=1,Kg=2,$n=3,wi=0,Jt=1,Yn=2,xi=0,Ts=1,hd=2,fd=3,pd=4,Zg=5,Ui=100,Jg=101,Qg=102,e_=103,t_=104,n_=200,i_=201,s_=202,r_=203,El=204,Tl=205,o_=206,a_=207,l_=208,c_=209,u_=210,d_=211,h_=212,f_=213,p_=214,Al=0,Rl=1,Cl=2,Is=3,Pl=4,Ll=5,Dl=6,Il=7,Qc=0,m_=1,g_=2,yi=0,__=1,v_=2,x_=3,y_=4,S_=5,M_=6,w_=7,Xf=300,Ns=301,Us=302,Nl=303,Ul=304,ra=306,Fl=1e3,Bi=1001,Ol=1002,ln=1003,b_=1004,Hr=1005,Pn=1006,Ra=1007,ki=1008,Un=1009,Yf=1010,qf=1011,yr=1012,eu=1013,Vi=1014,Ln=1015,Rr=1016,tu=1017,nu=1018,Sr=1020,jf=35902,Kf=1021,Zf=1022,Tn=1023,Mr=1026,wr=1027,iu=1028,su=1029,Jf=1030,ru=1031,ou=1033,Co=33776,Po=33777,Lo=33778,Do=33779,Bl=35840,kl=35841,zl=35842,Gl=35843,Hl=36196,Vl=37492,$l=37496,Wl=37808,Xl=37809,Yl=37810,ql=37811,jl=37812,Kl=37813,Zl=37814,Jl=37815,Ql=37816,ec=37817,tc=37818,nc=37819,ic=37820,sc=37821,Io=36492,rc=36494,oc=36495,Qf=36283,ac=36284,lc=36285,cc=36286,E_=3200,T_=3201,ep=0,A_=1,ui="",gn="srgb",Fs="srgb-linear",Vo="linear",ut="srgb",is=7680,md=519,R_=512,C_=513,P_=514,tp=515,L_=516,D_=517,I_=518,N_=519,gd=35044,_d="300 es",Kn=2e3,$o=2001;class ji{addEventListener(e,t){this._listeners===void 0&&(this._listeners={});const i=this._listeners;i[e]===void 0&&(i[e]=[]),i[e].indexOf(t)===-1&&i[e].push(t)}hasEventListener(e,t){const i=this._listeners;return i===void 0?!1:i[e]!==void 0&&i[e].indexOf(t)!==-1}removeEventListener(e,t){const i=this._listeners;if(i===void 0)return;const s=i[e];if(s!==void 0){const r=s.indexOf(t);r!==-1&&s.splice(r,1)}}dispatchEvent(e){const t=this._listeners;if(t===void 0)return;const i=t[e.type];if(i!==void 0){e.target=this;const s=i.slice(0);for(let r=0,o=s.length;r<o;r++)s[r].call(this,e);e.target=null}}}const Bt=["00","01","02","03","04","05","06","07","08","09","0a","0b","0c","0d","0e","0f","10","11","12","13","14","15","16","17","18","19","1a","1b","1c","1d","1e","1f","20","21","22","23","24","25","26","27","28","29","2a","2b","2c","2d","2e","2f","30","31","32","33","34","35","36","37","38","39","3a","3b","3c","3d","3e","3f","40","41","42","43","44","45","46","47","48","49","4a","4b","4c","4d","4e","4f","50","51","52","53","54","55","56","57","58","59","5a","5b","5c","5d","5e","5f","60","61","62","63","64","65","66","67","68","69","6a","6b","6c","6d","6e","6f","70","71","72","73","74","75","76","77","78","79","7a","7b","7c","7d","7e","7f","80","81","82","83","84","85","86","87","88","89","8a","8b","8c","8d","8e","8f","90","91","92","93","94","95","96","97","98","99","9a","9b","9c","9d","9e","9f","a0","a1","a2","a3","a4","a5","a6","a7","a8","a9","aa","ab","ac","ad","ae","af","b0","b1","b2","b3","b4","b5","b6","b7","b8","b9","ba","bb","bc","bd","be","bf","c0","c1","c2","c3","c4","c5","c6","c7","c8","c9","ca","cb","cc","cd","ce","cf","d0","d1","d2","d3","d4","d5","d6","d7","d8","d9","da","db","dc","dd","de","df","e0","e1","e2","e3","e4","e5","e6","e7","e8","e9","ea","eb","ec","ed","ee","ef","f0","f1","f2","f3","f4","f5","f6","f7","f8","f9","fa","fb","fc","fd","fe","ff"],dr=Math.PI/180,uc=180/Math.PI;function Cr(){const n=Math.random()*4294967295|0,e=Math.random()*4294967295|0,t=Math.random()*4294967295|0,i=Math.random()*4294967295|0;return(Bt[n&255]+Bt[n>>8&255]+Bt[n>>16&255]+Bt[n>>24&255]+"-"+Bt[e&255]+Bt[e>>8&255]+"-"+Bt[e>>16&15|64]+Bt[e>>24&255]+"-"+Bt[t&63|128]+Bt[t>>8&255]+"-"+Bt[t>>16&255]+Bt[t>>24&255]+Bt[i&255]+Bt[i>>8&255]+Bt[i>>16&255]+Bt[i>>24&255]).toLowerCase()}function Je(n,e,t){return Math.max(e,Math.min(t,n))}function U_(n,e){return(n%e+e)%e}function Ca(n,e,t){return(1-t)*n+t*e}function qs(n,e){switch(e.constructor){case Float32Array:return n;case Uint32Array:return n/4294967295;case Uint16Array:return n/65535;case Uint8Array:return n/255;case Int32Array:return Math.max(n/2147483647,-1);case Int16Array:return Math.max(n/32767,-1);case Int8Array:return Math.max(n/127,-1);default:throw new Error("Invalid component type.")}}function qt(n,e){switch(e.constructor){case Float32Array:return n;case Uint32Array:return Math.round(n*4294967295);case Uint16Array:return Math.round(n*65535);case Uint8Array:return Math.round(n*255);case Int32Array:return Math.round(n*2147483647);case Int16Array:return Math.round(n*32767);case Int8Array:return Math.round(n*127);default:throw new Error("Invalid component type.")}}const F_={DEG2RAD:dr};class Ve{constructor(e=0,t=0){Ve.prototype.isVector2=!0,this.x=e,this.y=t}get width(){return this.x}set width(e){this.x=e}get height(){return this.y}set height(e){this.y=e}set(e,t){return this.x=e,this.y=t,this}setScalar(e){return this.x=e,this.y=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;default:throw new Error("index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;default:throw new Error("index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y)}copy(e){return this.x=e.x,this.y=e.y,this}add(e){return this.x+=e.x,this.y+=e.y,this}addScalar(e){return this.x+=e,this.y+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this}subScalar(e){return this.x-=e,this.y-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this}multiply(e){return this.x*=e.x,this.y*=e.y,this}multiplyScalar(e){return this.x*=e,this.y*=e,this}divide(e){return this.x/=e.x,this.y/=e.y,this}divideScalar(e){return this.multiplyScalar(1/e)}applyMatrix3(e){const t=this.x,i=this.y,s=e.elements;return this.x=s[0]*t+s[3]*i+s[6],this.y=s[1]*t+s[4]*i+s[7],this}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this}clamp(e,t){return this.x=Je(this.x,e.x,t.x),this.y=Je(this.y,e.y,t.y),this}clampScalar(e,t){return this.x=Je(this.x,e,t),this.y=Je(this.y,e,t),this}clampLength(e,t){const i=this.length();return this.divideScalar(i||1).multiplyScalar(Je(i,e,t))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this}negate(){return this.x=-this.x,this.y=-this.y,this}dot(e){return this.x*e.x+this.y*e.y}cross(e){return this.x*e.y-this.y*e.x}lengthSq(){return this.x*this.x+this.y*this.y}length(){return Math.sqrt(this.x*this.x+this.y*this.y)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)}normalize(){return this.divideScalar(this.length()||1)}angle(){return Math.atan2(-this.y,-this.x)+Math.PI}angleTo(e){const t=Math.sqrt(this.lengthSq()*e.lengthSq());if(t===0)return Math.PI/2;const i=this.dot(e)/t;return Math.acos(Je(i,-1,1))}distanceTo(e){return Math.sqrt(this.distanceToSquared(e))}distanceToSquared(e){const t=this.x-e.x,i=this.y-e.y;return t*t+i*i}manhattanDistanceTo(e){return Math.abs(this.x-e.x)+Math.abs(this.y-e.y)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this}lerpVectors(e,t,i){return this.x=e.x+(t.x-e.x)*i,this.y=e.y+(t.y-e.y)*i,this}equals(e){return e.x===this.x&&e.y===this.y}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this}rotateAround(e,t){const i=Math.cos(t),s=Math.sin(t),r=this.x-e.x,o=this.y-e.y;return this.x=r*i-o*s+e.x,this.y=r*s+o*i+e.y,this}random(){return this.x=Math.random(),this.y=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y}}class $i{constructor(e=0,t=0,i=0,s=1){this.isQuaternion=!0,this._x=e,this._y=t,this._z=i,this._w=s}static slerpFlat(e,t,i,s,r,o,a){let l=i[s+0],c=i[s+1],u=i[s+2],d=i[s+3];const h=r[o+0],p=r[o+1],g=r[o+2],v=r[o+3];if(a===0){e[t+0]=l,e[t+1]=c,e[t+2]=u,e[t+3]=d;return}if(a===1){e[t+0]=h,e[t+1]=p,e[t+2]=g,e[t+3]=v;return}if(d!==v||l!==h||c!==p||u!==g){let m=1-a;const f=l*h+c*p+u*g+d*v,T=f>=0?1:-1,y=1-f*f;if(y>Number.EPSILON){const P=Math.sqrt(y),E=Math.atan2(P,f*T);m=Math.sin(m*E)/P,a=Math.sin(a*E)/P}const M=a*T;if(l=l*m+h*M,c=c*m+p*M,u=u*m+g*M,d=d*m+v*M,m===1-a){const P=1/Math.sqrt(l*l+c*c+u*u+d*d);l*=P,c*=P,u*=P,d*=P}}e[t]=l,e[t+1]=c,e[t+2]=u,e[t+3]=d}static multiplyQuaternionsFlat(e,t,i,s,r,o){const a=i[s],l=i[s+1],c=i[s+2],u=i[s+3],d=r[o],h=r[o+1],p=r[o+2],g=r[o+3];return e[t]=a*g+u*d+l*p-c*h,e[t+1]=l*g+u*h+c*d-a*p,e[t+2]=c*g+u*p+a*h-l*d,e[t+3]=u*g-a*d-l*h-c*p,e}get x(){return this._x}set x(e){this._x=e,this._onChangeCallback()}get y(){return this._y}set y(e){this._y=e,this._onChangeCallback()}get z(){return this._z}set z(e){this._z=e,this._onChangeCallback()}get w(){return this._w}set w(e){this._w=e,this._onChangeCallback()}set(e,t,i,s){return this._x=e,this._y=t,this._z=i,this._w=s,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._w)}copy(e){return this._x=e.x,this._y=e.y,this._z=e.z,this._w=e.w,this._onChangeCallback(),this}setFromEuler(e,t=!0){const i=e._x,s=e._y,r=e._z,o=e._order,a=Math.cos,l=Math.sin,c=a(i/2),u=a(s/2),d=a(r/2),h=l(i/2),p=l(s/2),g=l(r/2);switch(o){case"XYZ":this._x=h*u*d+c*p*g,this._y=c*p*d-h*u*g,this._z=c*u*g+h*p*d,this._w=c*u*d-h*p*g;break;case"YXZ":this._x=h*u*d+c*p*g,this._y=c*p*d-h*u*g,this._z=c*u*g-h*p*d,this._w=c*u*d+h*p*g;break;case"ZXY":this._x=h*u*d-c*p*g,this._y=c*p*d+h*u*g,this._z=c*u*g+h*p*d,this._w=c*u*d-h*p*g;break;case"ZYX":this._x=h*u*d-c*p*g,this._y=c*p*d+h*u*g,this._z=c*u*g-h*p*d,this._w=c*u*d+h*p*g;break;case"YZX":this._x=h*u*d+c*p*g,this._y=c*p*d+h*u*g,this._z=c*u*g-h*p*d,this._w=c*u*d-h*p*g;break;case"XZY":this._x=h*u*d-c*p*g,this._y=c*p*d-h*u*g,this._z=c*u*g+h*p*d,this._w=c*u*d+h*p*g;break;default:console.warn("THREE.Quaternion: .setFromEuler() encountered an unknown order: "+o)}return t===!0&&this._onChangeCallback(),this}setFromAxisAngle(e,t){const i=t/2,s=Math.sin(i);return this._x=e.x*s,this._y=e.y*s,this._z=e.z*s,this._w=Math.cos(i),this._onChangeCallback(),this}setFromRotationMatrix(e){const t=e.elements,i=t[0],s=t[4],r=t[8],o=t[1],a=t[5],l=t[9],c=t[2],u=t[6],d=t[10],h=i+a+d;if(h>0){const p=.5/Math.sqrt(h+1);this._w=.25/p,this._x=(u-l)*p,this._y=(r-c)*p,this._z=(o-s)*p}else if(i>a&&i>d){const p=2*Math.sqrt(1+i-a-d);this._w=(u-l)/p,this._x=.25*p,this._y=(s+o)/p,this._z=(r+c)/p}else if(a>d){const p=2*Math.sqrt(1+a-i-d);this._w=(r-c)/p,this._x=(s+o)/p,this._y=.25*p,this._z=(l+u)/p}else{const p=2*Math.sqrt(1+d-i-a);this._w=(o-s)/p,this._x=(r+c)/p,this._y=(l+u)/p,this._z=.25*p}return this._onChangeCallback(),this}setFromUnitVectors(e,t){let i=e.dot(t)+1;return i<1e-8?(i=0,Math.abs(e.x)>Math.abs(e.z)?(this._x=-e.y,this._y=e.x,this._z=0,this._w=i):(this._x=0,this._y=-e.z,this._z=e.y,this._w=i)):(this._x=e.y*t.z-e.z*t.y,this._y=e.z*t.x-e.x*t.z,this._z=e.x*t.y-e.y*t.x,this._w=i),this.normalize()}angleTo(e){return 2*Math.acos(Math.abs(Je(this.dot(e),-1,1)))}rotateTowards(e,t){const i=this.angleTo(e);if(i===0)return this;const s=Math.min(1,t/i);return this.slerp(e,s),this}identity(){return this.set(0,0,0,1)}invert(){return this.conjugate()}conjugate(){return this._x*=-1,this._y*=-1,this._z*=-1,this._onChangeCallback(),this}dot(e){return this._x*e._x+this._y*e._y+this._z*e._z+this._w*e._w}lengthSq(){return this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w}length(){return Math.sqrt(this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w)}normalize(){let e=this.length();return e===0?(this._x=0,this._y=0,this._z=0,this._w=1):(e=1/e,this._x=this._x*e,this._y=this._y*e,this._z=this._z*e,this._w=this._w*e),this._onChangeCallback(),this}multiply(e){return this.multiplyQuaternions(this,e)}premultiply(e){return this.multiplyQuaternions(e,this)}multiplyQuaternions(e,t){const i=e._x,s=e._y,r=e._z,o=e._w,a=t._x,l=t._y,c=t._z,u=t._w;return this._x=i*u+o*a+s*c-r*l,this._y=s*u+o*l+r*a-i*c,this._z=r*u+o*c+i*l-s*a,this._w=o*u-i*a-s*l-r*c,this._onChangeCallback(),this}slerp(e,t){if(t===0)return this;if(t===1)return this.copy(e);const i=this._x,s=this._y,r=this._z,o=this._w;let a=o*e._w+i*e._x+s*e._y+r*e._z;if(a<0?(this._w=-e._w,this._x=-e._x,this._y=-e._y,this._z=-e._z,a=-a):this.copy(e),a>=1)return this._w=o,this._x=i,this._y=s,this._z=r,this;const l=1-a*a;if(l<=Number.EPSILON){const p=1-t;return this._w=p*o+t*this._w,this._x=p*i+t*this._x,this._y=p*s+t*this._y,this._z=p*r+t*this._z,this.normalize(),this}const c=Math.sqrt(l),u=Math.atan2(c,a),d=Math.sin((1-t)*u)/c,h=Math.sin(t*u)/c;return this._w=o*d+this._w*h,this._x=i*d+this._x*h,this._y=s*d+this._y*h,this._z=r*d+this._z*h,this._onChangeCallback(),this}slerpQuaternions(e,t,i){return this.copy(e).slerp(t,i)}random(){const e=2*Math.PI*Math.random(),t=2*Math.PI*Math.random(),i=Math.random(),s=Math.sqrt(1-i),r=Math.sqrt(i);return this.set(s*Math.sin(e),s*Math.cos(e),r*Math.sin(t),r*Math.cos(t))}equals(e){return e._x===this._x&&e._y===this._y&&e._z===this._z&&e._w===this._w}fromArray(e,t=0){return this._x=e[t],this._y=e[t+1],this._z=e[t+2],this._w=e[t+3],this._onChangeCallback(),this}toArray(e=[],t=0){return e[t]=this._x,e[t+1]=this._y,e[t+2]=this._z,e[t+3]=this._w,e}fromBufferAttribute(e,t){return this._x=e.getX(t),this._y=e.getY(t),this._z=e.getZ(t),this._w=e.getW(t),this._onChangeCallback(),this}toJSON(){return this.toArray()}_onChange(e){return this._onChangeCallback=e,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._w}}class O{constructor(e=0,t=0,i=0){O.prototype.isVector3=!0,this.x=e,this.y=t,this.z=i}set(e,t,i){return i===void 0&&(i=this.z),this.x=e,this.y=t,this.z=i,this}setScalar(e){return this.x=e,this.y=e,this.z=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setZ(e){return this.z=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;case 2:this.z=t;break;default:throw new Error("index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;case 2:return this.z;default:throw new Error("index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y,this.z)}copy(e){return this.x=e.x,this.y=e.y,this.z=e.z,this}add(e){return this.x+=e.x,this.y+=e.y,this.z+=e.z,this}addScalar(e){return this.x+=e,this.y+=e,this.z+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this.z=e.z+t.z,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this.z+=e.z*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this.z-=e.z,this}subScalar(e){return this.x-=e,this.y-=e,this.z-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this.z=e.z-t.z,this}multiply(e){return this.x*=e.x,this.y*=e.y,this.z*=e.z,this}multiplyScalar(e){return this.x*=e,this.y*=e,this.z*=e,this}multiplyVectors(e,t){return this.x=e.x*t.x,this.y=e.y*t.y,this.z=e.z*t.z,this}applyEuler(e){return this.applyQuaternion(vd.setFromEuler(e))}applyAxisAngle(e,t){return this.applyQuaternion(vd.setFromAxisAngle(e,t))}applyMatrix3(e){const t=this.x,i=this.y,s=this.z,r=e.elements;return this.x=r[0]*t+r[3]*i+r[6]*s,this.y=r[1]*t+r[4]*i+r[7]*s,this.z=r[2]*t+r[5]*i+r[8]*s,this}applyNormalMatrix(e){return this.applyMatrix3(e).normalize()}applyMatrix4(e){const t=this.x,i=this.y,s=this.z,r=e.elements,o=1/(r[3]*t+r[7]*i+r[11]*s+r[15]);return this.x=(r[0]*t+r[4]*i+r[8]*s+r[12])*o,this.y=(r[1]*t+r[5]*i+r[9]*s+r[13])*o,this.z=(r[2]*t+r[6]*i+r[10]*s+r[14])*o,this}applyQuaternion(e){const t=this.x,i=this.y,s=this.z,r=e.x,o=e.y,a=e.z,l=e.w,c=2*(o*s-a*i),u=2*(a*t-r*s),d=2*(r*i-o*t);return this.x=t+l*c+o*d-a*u,this.y=i+l*u+a*c-r*d,this.z=s+l*d+r*u-o*c,this}project(e){return this.applyMatrix4(e.matrixWorldInverse).applyMatrix4(e.projectionMatrix)}unproject(e){return this.applyMatrix4(e.projectionMatrixInverse).applyMatrix4(e.matrixWorld)}transformDirection(e){const t=this.x,i=this.y,s=this.z,r=e.elements;return this.x=r[0]*t+r[4]*i+r[8]*s,this.y=r[1]*t+r[5]*i+r[9]*s,this.z=r[2]*t+r[6]*i+r[10]*s,this.normalize()}divide(e){return this.x/=e.x,this.y/=e.y,this.z/=e.z,this}divideScalar(e){return this.multiplyScalar(1/e)}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this.z=Math.min(this.z,e.z),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this.z=Math.max(this.z,e.z),this}clamp(e,t){return this.x=Je(this.x,e.x,t.x),this.y=Je(this.y,e.y,t.y),this.z=Je(this.z,e.z,t.z),this}clampScalar(e,t){return this.x=Je(this.x,e,t),this.y=Je(this.y,e,t),this.z=Je(this.z,e,t),this}clampLength(e,t){const i=this.length();return this.divideScalar(i||1).multiplyScalar(Je(i,e,t))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this}dot(e){return this.x*e.x+this.y*e.y+this.z*e.z}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)}normalize(){return this.divideScalar(this.length()||1)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this.z+=(e.z-this.z)*t,this}lerpVectors(e,t,i){return this.x=e.x+(t.x-e.x)*i,this.y=e.y+(t.y-e.y)*i,this.z=e.z+(t.z-e.z)*i,this}cross(e){return this.crossVectors(this,e)}crossVectors(e,t){const i=e.x,s=e.y,r=e.z,o=t.x,a=t.y,l=t.z;return this.x=s*l-r*a,this.y=r*o-i*l,this.z=i*a-s*o,this}projectOnVector(e){const t=e.lengthSq();if(t===0)return this.set(0,0,0);const i=e.dot(this)/t;return this.copy(e).multiplyScalar(i)}projectOnPlane(e){return Pa.copy(this).projectOnVector(e),this.sub(Pa)}reflect(e){return this.sub(Pa.copy(e).multiplyScalar(2*this.dot(e)))}angleTo(e){const t=Math.sqrt(this.lengthSq()*e.lengthSq());if(t===0)return Math.PI/2;const i=this.dot(e)/t;return Math.acos(Je(i,-1,1))}distanceTo(e){return Math.sqrt(this.distanceToSquared(e))}distanceToSquared(e){const t=this.x-e.x,i=this.y-e.y,s=this.z-e.z;return t*t+i*i+s*s}manhattanDistanceTo(e){return Math.abs(this.x-e.x)+Math.abs(this.y-e.y)+Math.abs(this.z-e.z)}setFromSpherical(e){return this.setFromSphericalCoords(e.radius,e.phi,e.theta)}setFromSphericalCoords(e,t,i){const s=Math.sin(t)*e;return this.x=s*Math.sin(i),this.y=Math.cos(t)*e,this.z=s*Math.cos(i),this}setFromCylindrical(e){return this.setFromCylindricalCoords(e.radius,e.theta,e.y)}setFromCylindricalCoords(e,t,i){return this.x=e*Math.sin(t),this.y=i,this.z=e*Math.cos(t),this}setFromMatrixPosition(e){const t=e.elements;return this.x=t[12],this.y=t[13],this.z=t[14],this}setFromMatrixScale(e){const t=this.setFromMatrixColumn(e,0).length(),i=this.setFromMatrixColumn(e,1).length(),s=this.setFromMatrixColumn(e,2).length();return this.x=t,this.y=i,this.z=s,this}setFromMatrixColumn(e,t){return this.fromArray(e.elements,t*4)}setFromMatrix3Column(e,t){return this.fromArray(e.elements,t*3)}setFromEuler(e){return this.x=e._x,this.y=e._y,this.z=e._z,this}setFromColor(e){return this.x=e.r,this.y=e.g,this.z=e.b,this}equals(e){return e.x===this.x&&e.y===this.y&&e.z===this.z}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this.z=e[t+2],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e[t+2]=this.z,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this.z=e.getZ(t),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this}randomDirection(){const e=Math.random()*Math.PI*2,t=Math.random()*2-1,i=Math.sqrt(1-t*t);return this.x=i*Math.cos(e),this.y=t,this.z=i*Math.sin(e),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z}}const Pa=new O,vd=new $i;class qe{constructor(e,t,i,s,r,o,a,l,c){qe.prototype.isMatrix3=!0,this.elements=[1,0,0,0,1,0,0,0,1],e!==void 0&&this.set(e,t,i,s,r,o,a,l,c)}set(e,t,i,s,r,o,a,l,c){const u=this.elements;return u[0]=e,u[1]=s,u[2]=a,u[3]=t,u[4]=r,u[5]=l,u[6]=i,u[7]=o,u[8]=c,this}identity(){return this.set(1,0,0,0,1,0,0,0,1),this}copy(e){const t=this.elements,i=e.elements;return t[0]=i[0],t[1]=i[1],t[2]=i[2],t[3]=i[3],t[4]=i[4],t[5]=i[5],t[6]=i[6],t[7]=i[7],t[8]=i[8],this}extractBasis(e,t,i){return e.setFromMatrix3Column(this,0),t.setFromMatrix3Column(this,1),i.setFromMatrix3Column(this,2),this}setFromMatrix4(e){const t=e.elements;return this.set(t[0],t[4],t[8],t[1],t[5],t[9],t[2],t[6],t[10]),this}multiply(e){return this.multiplyMatrices(this,e)}premultiply(e){return this.multiplyMatrices(e,this)}multiplyMatrices(e,t){const i=e.elements,s=t.elements,r=this.elements,o=i[0],a=i[3],l=i[6],c=i[1],u=i[4],d=i[7],h=i[2],p=i[5],g=i[8],v=s[0],m=s[3],f=s[6],T=s[1],y=s[4],M=s[7],P=s[2],E=s[5],A=s[8];return r[0]=o*v+a*T+l*P,r[3]=o*m+a*y+l*E,r[6]=o*f+a*M+l*A,r[1]=c*v+u*T+d*P,r[4]=c*m+u*y+d*E,r[7]=c*f+u*M+d*A,r[2]=h*v+p*T+g*P,r[5]=h*m+p*y+g*E,r[8]=h*f+p*M+g*A,this}multiplyScalar(e){const t=this.elements;return t[0]*=e,t[3]*=e,t[6]*=e,t[1]*=e,t[4]*=e,t[7]*=e,t[2]*=e,t[5]*=e,t[8]*=e,this}determinant(){const e=this.elements,t=e[0],i=e[1],s=e[2],r=e[3],o=e[4],a=e[5],l=e[6],c=e[7],u=e[8];return t*o*u-t*a*c-i*r*u+i*a*l+s*r*c-s*o*l}invert(){const e=this.elements,t=e[0],i=e[1],s=e[2],r=e[3],o=e[4],a=e[5],l=e[6],c=e[7],u=e[8],d=u*o-a*c,h=a*l-u*r,p=c*r-o*l,g=t*d+i*h+s*p;if(g===0)return this.set(0,0,0,0,0,0,0,0,0);const v=1/g;return e[0]=d*v,e[1]=(s*c-u*i)*v,e[2]=(a*i-s*o)*v,e[3]=h*v,e[4]=(u*t-s*l)*v,e[5]=(s*r-a*t)*v,e[6]=p*v,e[7]=(i*l-c*t)*v,e[8]=(o*t-i*r)*v,this}transpose(){let e;const t=this.elements;return e=t[1],t[1]=t[3],t[3]=e,e=t[2],t[2]=t[6],t[6]=e,e=t[5],t[5]=t[7],t[7]=e,this}getNormalMatrix(e){return this.setFromMatrix4(e).invert().transpose()}transposeIntoArray(e){const t=this.elements;return e[0]=t[0],e[1]=t[3],e[2]=t[6],e[3]=t[1],e[4]=t[4],e[5]=t[7],e[6]=t[2],e[7]=t[5],e[8]=t[8],this}setUvTransform(e,t,i,s,r,o,a){const l=Math.cos(r),c=Math.sin(r);return this.set(i*l,i*c,-i*(l*o+c*a)+o+e,-s*c,s*l,-s*(-c*o+l*a)+a+t,0,0,1),this}scale(e,t){return this.premultiply(La.makeScale(e,t)),this}rotate(e){return this.premultiply(La.makeRotation(-e)),this}translate(e,t){return this.premultiply(La.makeTranslation(e,t)),this}makeTranslation(e,t){return e.isVector2?this.set(1,0,e.x,0,1,e.y,0,0,1):this.set(1,0,e,0,1,t,0,0,1),this}makeRotation(e){const t=Math.cos(e),i=Math.sin(e);return this.set(t,-i,0,i,t,0,0,0,1),this}makeScale(e,t){return this.set(e,0,0,0,t,0,0,0,1),this}equals(e){const t=this.elements,i=e.elements;for(let s=0;s<9;s++)if(t[s]!==i[s])return!1;return!0}fromArray(e,t=0){for(let i=0;i<9;i++)this.elements[i]=e[i+t];return this}toArray(e=[],t=0){const i=this.elements;return e[t]=i[0],e[t+1]=i[1],e[t+2]=i[2],e[t+3]=i[3],e[t+4]=i[4],e[t+5]=i[5],e[t+6]=i[6],e[t+7]=i[7],e[t+8]=i[8],e}clone(){return new this.constructor().fromArray(this.elements)}}const La=new qe;function np(n){for(let e=n.length-1;e>=0;--e)if(n[e]>=65535)return!0;return!1}function Wo(n){return document.createElementNS("http://www.w3.org/1999/xhtml",n)}function O_(){const n=Wo("canvas");return n.style.display="block",n}const xd={};function As(n){n in xd||(xd[n]=!0,console.warn(n))}function B_(n,e,t){return new Promise(function(i,s){function r(){switch(n.clientWaitSync(e,n.SYNC_FLUSH_COMMANDS_BIT,0)){case n.WAIT_FAILED:s();break;case n.TIMEOUT_EXPIRED:setTimeout(r,t);break;default:i()}}setTimeout(r,t)})}function k_(n){const e=n.elements;e[2]=.5*e[2]+.5*e[3],e[6]=.5*e[6]+.5*e[7],e[10]=.5*e[10]+.5*e[11],e[14]=.5*e[14]+.5*e[15]}function z_(n){const e=n.elements;e[11]===-1?(e[10]=-e[10]-1,e[14]=-e[14]):(e[10]=-e[10],e[14]=-e[14]+1)}const yd=new qe().set(.4123908,.3575843,.1804808,.212639,.7151687,.0721923,.0193308,.1191948,.9505322),Sd=new qe().set(3.2409699,-1.5373832,-.4986108,-.9692436,1.8759675,.0415551,.0556301,-.203977,1.0569715);function G_(){const n={enabled:!0,workingColorSpace:Fs,spaces:{},convert:function(s,r,o){return this.enabled===!1||r===o||!r||!o||(this.spaces[r].transfer===ut&&(s.r=Zn(s.r),s.g=Zn(s.g),s.b=Zn(s.b)),this.spaces[r].primaries!==this.spaces[o].primaries&&(s.applyMatrix3(this.spaces[r].toXYZ),s.applyMatrix3(this.spaces[o].fromXYZ)),this.spaces[o].transfer===ut&&(s.r=Rs(s.r),s.g=Rs(s.g),s.b=Rs(s.b))),s},workingToColorSpace:function(s,r){return this.convert(s,this.workingColorSpace,r)},colorSpaceToWorking:function(s,r){return this.convert(s,r,this.workingColorSpace)},getPrimaries:function(s){return this.spaces[s].primaries},getTransfer:function(s){return s===ui?Vo:this.spaces[s].transfer},getLuminanceCoefficients:function(s,r=this.workingColorSpace){return s.fromArray(this.spaces[r].luminanceCoefficients)},define:function(s){Object.assign(this.spaces,s)},_getMatrix:function(s,r,o){return s.copy(this.spaces[r].toXYZ).multiply(this.spaces[o].fromXYZ)},_getDrawingBufferColorSpace:function(s){return this.spaces[s].outputColorSpaceConfig.drawingBufferColorSpace},_getUnpackColorSpace:function(s=this.workingColorSpace){return this.spaces[s].workingColorSpaceConfig.unpackColorSpace},fromWorkingColorSpace:function(s,r){return As("THREE.ColorManagement: .fromWorkingColorSpace() has been renamed to .workingToColorSpace()."),n.workingToColorSpace(s,r)},toWorkingColorSpace:function(s,r){return As("THREE.ColorManagement: .toWorkingColorSpace() has been renamed to .colorSpaceToWorking()."),n.colorSpaceToWorking(s,r)}},e=[.64,.33,.3,.6,.15,.06],t=[.2126,.7152,.0722],i=[.3127,.329];return n.define({[Fs]:{primaries:e,whitePoint:i,transfer:Vo,toXYZ:yd,fromXYZ:Sd,luminanceCoefficients:t,workingColorSpaceConfig:{unpackColorSpace:gn},outputColorSpaceConfig:{drawingBufferColorSpace:gn}},[gn]:{primaries:e,whitePoint:i,transfer:ut,toXYZ:yd,fromXYZ:Sd,luminanceCoefficients:t,outputColorSpaceConfig:{drawingBufferColorSpace:gn}}}),n}const it=G_();function Zn(n){return n<.04045?n*.0773993808:Math.pow(n*.9478672986+.0521327014,2.4)}function Rs(n){return n<.0031308?n*12.92:1.055*Math.pow(n,.41666)-.055}let ss;class H_{static getDataURL(e,t="image/png"){if(/^data:/i.test(e.src)||typeof HTMLCanvasElement>"u")return e.src;let i;if(e instanceof HTMLCanvasElement)i=e;else{ss===void 0&&(ss=Wo("canvas")),ss.width=e.width,ss.height=e.height;const s=ss.getContext("2d");e instanceof ImageData?s.putImageData(e,0,0):s.drawImage(e,0,0,e.width,e.height),i=ss}return i.toDataURL(t)}static sRGBToLinear(e){if(typeof HTMLImageElement<"u"&&e instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&e instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&e instanceof ImageBitmap){const t=Wo("canvas");t.width=e.width,t.height=e.height;const i=t.getContext("2d");i.drawImage(e,0,0,e.width,e.height);const s=i.getImageData(0,0,e.width,e.height),r=s.data;for(let o=0;o<r.length;o++)r[o]=Zn(r[o]/255)*255;return i.putImageData(s,0,0),t}else if(e.data){const t=e.data.slice(0);for(let i=0;i<t.length;i++)t instanceof Uint8Array||t instanceof Uint8ClampedArray?t[i]=Math.floor(Zn(t[i]/255)*255):t[i]=Zn(t[i]);return{data:t,width:e.width,height:e.height}}else return console.warn("THREE.ImageUtils.sRGBToLinear(): Unsupported image type. No color space conversion applied."),e}}let V_=0;class au{constructor(e=null){this.isSource=!0,Object.defineProperty(this,"id",{value:V_++}),this.uuid=Cr(),this.data=e,this.dataReady=!0,this.version=0}getSize(e){const t=this.data;return t instanceof HTMLVideoElement?e.set(t.videoWidth,t.videoHeight):t!==null?e.set(t.width,t.height,t.depth||0):e.set(0,0,0),e}set needsUpdate(e){e===!0&&this.version++}toJSON(e){const t=e===void 0||typeof e=="string";if(!t&&e.images[this.uuid]!==void 0)return e.images[this.uuid];const i={uuid:this.uuid,url:""},s=this.data;if(s!==null){let r;if(Array.isArray(s)){r=[];for(let o=0,a=s.length;o<a;o++)s[o].isDataTexture?r.push(Da(s[o].image)):r.push(Da(s[o]))}else r=Da(s);i.url=r}return t||(e.images[this.uuid]=i),i}}function Da(n){return typeof HTMLImageElement<"u"&&n instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&n instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&n instanceof ImageBitmap?H_.getDataURL(n):n.data?{data:Array.from(n.data),width:n.width,height:n.height,type:n.data.constructor.name}:(console.warn("THREE.Texture: Unable to serialize Texture."),{})}let $_=0;const Ia=new O;class Wt extends ji{constructor(e=Wt.DEFAULT_IMAGE,t=Wt.DEFAULT_MAPPING,i=Bi,s=Bi,r=Pn,o=ki,a=Tn,l=Un,c=Wt.DEFAULT_ANISOTROPY,u=ui){super(),this.isTexture=!0,Object.defineProperty(this,"id",{value:$_++}),this.uuid=Cr(),this.name="",this.source=new au(e),this.mipmaps=[],this.mapping=t,this.channel=0,this.wrapS=i,this.wrapT=s,this.magFilter=r,this.minFilter=o,this.anisotropy=c,this.format=a,this.internalFormat=null,this.type=l,this.offset=new Ve(0,0),this.repeat=new Ve(1,1),this.center=new Ve(0,0),this.rotation=0,this.matrixAutoUpdate=!0,this.matrix=new qe,this.generateMipmaps=!0,this.premultiplyAlpha=!1,this.flipY=!0,this.unpackAlignment=4,this.colorSpace=u,this.userData={},this.updateRanges=[],this.version=0,this.onUpdate=null,this.renderTarget=null,this.isRenderTargetTexture=!1,this.isArrayTexture=!!(e&&e.depth&&e.depth>1),this.pmremVersion=0}get width(){return this.source.getSize(Ia).x}get height(){return this.source.getSize(Ia).y}get depth(){return this.source.getSize(Ia).z}get image(){return this.source.data}set image(e=null){this.source.data=e}updateMatrix(){this.matrix.setUvTransform(this.offset.x,this.offset.y,this.repeat.x,this.repeat.y,this.rotation,this.center.x,this.center.y)}addUpdateRange(e,t){this.updateRanges.push({start:e,count:t})}clearUpdateRanges(){this.updateRanges.length=0}clone(){return new this.constructor().copy(this)}copy(e){return this.name=e.name,this.source=e.source,this.mipmaps=e.mipmaps.slice(0),this.mapping=e.mapping,this.channel=e.channel,this.wrapS=e.wrapS,this.wrapT=e.wrapT,this.magFilter=e.magFilter,this.minFilter=e.minFilter,this.anisotropy=e.anisotropy,this.format=e.format,this.internalFormat=e.internalFormat,this.type=e.type,this.offset.copy(e.offset),this.repeat.copy(e.repeat),this.center.copy(e.center),this.rotation=e.rotation,this.matrixAutoUpdate=e.matrixAutoUpdate,this.matrix.copy(e.matrix),this.generateMipmaps=e.generateMipmaps,this.premultiplyAlpha=e.premultiplyAlpha,this.flipY=e.flipY,this.unpackAlignment=e.unpackAlignment,this.colorSpace=e.colorSpace,this.renderTarget=e.renderTarget,this.isRenderTargetTexture=e.isRenderTargetTexture,this.isArrayTexture=e.isArrayTexture,this.userData=JSON.parse(JSON.stringify(e.userData)),this.needsUpdate=!0,this}setValues(e){for(const t in e){const i=e[t];if(i===void 0){console.warn(`THREE.Texture.setValues(): parameter '${t}' has value of undefined.`);continue}const s=this[t];if(s===void 0){console.warn(`THREE.Texture.setValues(): property '${t}' does not exist.`);continue}s&&i&&s.isVector2&&i.isVector2||s&&i&&s.isVector3&&i.isVector3||s&&i&&s.isMatrix3&&i.isMatrix3?s.copy(i):this[t]=i}}toJSON(e){const t=e===void 0||typeof e=="string";if(!t&&e.textures[this.uuid]!==void 0)return e.textures[this.uuid];const i={metadata:{version:4.7,type:"Texture",generator:"Texture.toJSON"},uuid:this.uuid,name:this.name,image:this.source.toJSON(e).uuid,mapping:this.mapping,channel:this.channel,repeat:[this.repeat.x,this.repeat.y],offset:[this.offset.x,this.offset.y],center:[this.center.x,this.center.y],rotation:this.rotation,wrap:[this.wrapS,this.wrapT],format:this.format,internalFormat:this.internalFormat,type:this.type,colorSpace:this.colorSpace,minFilter:this.minFilter,magFilter:this.magFilter,anisotropy:this.anisotropy,flipY:this.flipY,generateMipmaps:this.generateMipmaps,premultiplyAlpha:this.premultiplyAlpha,unpackAlignment:this.unpackAlignment};return Object.keys(this.userData).length>0&&(i.userData=this.userData),t||(e.textures[this.uuid]=i),i}dispose(){this.dispatchEvent({type:"dispose"})}transformUv(e){if(this.mapping!==Xf)return e;if(e.applyMatrix3(this.matrix),e.x<0||e.x>1)switch(this.wrapS){case Fl:e.x=e.x-Math.floor(e.x);break;case Bi:e.x=e.x<0?0:1;break;case Ol:Math.abs(Math.floor(e.x)%2)===1?e.x=Math.ceil(e.x)-e.x:e.x=e.x-Math.floor(e.x);break}if(e.y<0||e.y>1)switch(this.wrapT){case Fl:e.y=e.y-Math.floor(e.y);break;case Bi:e.y=e.y<0?0:1;break;case Ol:Math.abs(Math.floor(e.y)%2)===1?e.y=Math.ceil(e.y)-e.y:e.y=e.y-Math.floor(e.y);break}return this.flipY&&(e.y=1-e.y),e}set needsUpdate(e){e===!0&&(this.version++,this.source.needsUpdate=!0)}set needsPMREMUpdate(e){e===!0&&this.pmremVersion++}}Wt.DEFAULT_IMAGE=null;Wt.DEFAULT_MAPPING=Xf;Wt.DEFAULT_ANISOTROPY=1;class Mt{constructor(e=0,t=0,i=0,s=1){Mt.prototype.isVector4=!0,this.x=e,this.y=t,this.z=i,this.w=s}get width(){return this.z}set width(e){this.z=e}get height(){return this.w}set height(e){this.w=e}set(e,t,i,s){return this.x=e,this.y=t,this.z=i,this.w=s,this}setScalar(e){return this.x=e,this.y=e,this.z=e,this.w=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setZ(e){return this.z=e,this}setW(e){return this.w=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;case 2:this.z=t;break;case 3:this.w=t;break;default:throw new Error("index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;case 2:return this.z;case 3:return this.w;default:throw new Error("index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y,this.z,this.w)}copy(e){return this.x=e.x,this.y=e.y,this.z=e.z,this.w=e.w!==void 0?e.w:1,this}add(e){return this.x+=e.x,this.y+=e.y,this.z+=e.z,this.w+=e.w,this}addScalar(e){return this.x+=e,this.y+=e,this.z+=e,this.w+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this.z=e.z+t.z,this.w=e.w+t.w,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this.z+=e.z*t,this.w+=e.w*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this.z-=e.z,this.w-=e.w,this}subScalar(e){return this.x-=e,this.y-=e,this.z-=e,this.w-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this.z=e.z-t.z,this.w=e.w-t.w,this}multiply(e){return this.x*=e.x,this.y*=e.y,this.z*=e.z,this.w*=e.w,this}multiplyScalar(e){return this.x*=e,this.y*=e,this.z*=e,this.w*=e,this}applyMatrix4(e){const t=this.x,i=this.y,s=this.z,r=this.w,o=e.elements;return this.x=o[0]*t+o[4]*i+o[8]*s+o[12]*r,this.y=o[1]*t+o[5]*i+o[9]*s+o[13]*r,this.z=o[2]*t+o[6]*i+o[10]*s+o[14]*r,this.w=o[3]*t+o[7]*i+o[11]*s+o[15]*r,this}divide(e){return this.x/=e.x,this.y/=e.y,this.z/=e.z,this.w/=e.w,this}divideScalar(e){return this.multiplyScalar(1/e)}setAxisAngleFromQuaternion(e){this.w=2*Math.acos(e.w);const t=Math.sqrt(1-e.w*e.w);return t<1e-4?(this.x=1,this.y=0,this.z=0):(this.x=e.x/t,this.y=e.y/t,this.z=e.z/t),this}setAxisAngleFromRotationMatrix(e){let t,i,s,r;const l=e.elements,c=l[0],u=l[4],d=l[8],h=l[1],p=l[5],g=l[9],v=l[2],m=l[6],f=l[10];if(Math.abs(u-h)<.01&&Math.abs(d-v)<.01&&Math.abs(g-m)<.01){if(Math.abs(u+h)<.1&&Math.abs(d+v)<.1&&Math.abs(g+m)<.1&&Math.abs(c+p+f-3)<.1)return this.set(1,0,0,0),this;t=Math.PI;const y=(c+1)/2,M=(p+1)/2,P=(f+1)/2,E=(u+h)/4,A=(d+v)/4,R=(g+m)/4;return y>M&&y>P?y<.01?(i=0,s=.707106781,r=.707106781):(i=Math.sqrt(y),s=E/i,r=A/i):M>P?M<.01?(i=.707106781,s=0,r=.707106781):(s=Math.sqrt(M),i=E/s,r=R/s):P<.01?(i=.707106781,s=.707106781,r=0):(r=Math.sqrt(P),i=A/r,s=R/r),this.set(i,s,r,t),this}let T=Math.sqrt((m-g)*(m-g)+(d-v)*(d-v)+(h-u)*(h-u));return Math.abs(T)<.001&&(T=1),this.x=(m-g)/T,this.y=(d-v)/T,this.z=(h-u)/T,this.w=Math.acos((c+p+f-1)/2),this}setFromMatrixPosition(e){const t=e.elements;return this.x=t[12],this.y=t[13],this.z=t[14],this.w=t[15],this}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this.z=Math.min(this.z,e.z),this.w=Math.min(this.w,e.w),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this.z=Math.max(this.z,e.z),this.w=Math.max(this.w,e.w),this}clamp(e,t){return this.x=Je(this.x,e.x,t.x),this.y=Je(this.y,e.y,t.y),this.z=Je(this.z,e.z,t.z),this.w=Je(this.w,e.w,t.w),this}clampScalar(e,t){return this.x=Je(this.x,e,t),this.y=Je(this.y,e,t),this.z=Je(this.z,e,t),this.w=Je(this.w,e,t),this}clampLength(e,t){const i=this.length();return this.divideScalar(i||1).multiplyScalar(Je(i,e,t))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this.w=Math.floor(this.w),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this.w=Math.ceil(this.w),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this.w=Math.round(this.w),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this.w=Math.trunc(this.w),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this.w=-this.w,this}dot(e){return this.x*e.x+this.y*e.y+this.z*e.z+this.w*e.w}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)+Math.abs(this.w)}normalize(){return this.divideScalar(this.length()||1)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this.z+=(e.z-this.z)*t,this.w+=(e.w-this.w)*t,this}lerpVectors(e,t,i){return this.x=e.x+(t.x-e.x)*i,this.y=e.y+(t.y-e.y)*i,this.z=e.z+(t.z-e.z)*i,this.w=e.w+(t.w-e.w)*i,this}equals(e){return e.x===this.x&&e.y===this.y&&e.z===this.z&&e.w===this.w}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this.z=e[t+2],this.w=e[t+3],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e[t+2]=this.z,e[t+3]=this.w,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this.z=e.getZ(t),this.w=e.getW(t),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this.w=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z,yield this.w}}class W_ extends ji{constructor(e=1,t=1,i={}){super(),i=Object.assign({generateMipmaps:!1,internalFormat:null,minFilter:Pn,depthBuffer:!0,stencilBuffer:!1,resolveDepthBuffer:!0,resolveStencilBuffer:!0,depthTexture:null,samples:0,count:1,depth:1,multiview:!1},i),this.isRenderTarget=!0,this.width=e,this.height=t,this.depth=i.depth,this.scissor=new Mt(0,0,e,t),this.scissorTest=!1,this.viewport=new Mt(0,0,e,t);const s={width:e,height:t,depth:i.depth},r=new Wt(s);this.textures=[];const o=i.count;for(let a=0;a<o;a++)this.textures[a]=r.clone(),this.textures[a].isRenderTargetTexture=!0,this.textures[a].renderTarget=this;this._setTextureOptions(i),this.depthBuffer=i.depthBuffer,this.stencilBuffer=i.stencilBuffer,this.resolveDepthBuffer=i.resolveDepthBuffer,this.resolveStencilBuffer=i.resolveStencilBuffer,this._depthTexture=null,this.depthTexture=i.depthTexture,this.samples=i.samples,this.multiview=i.multiview}_setTextureOptions(e={}){const t={minFilter:Pn,generateMipmaps:!1,flipY:!1,internalFormat:null};e.mapping!==void 0&&(t.mapping=e.mapping),e.wrapS!==void 0&&(t.wrapS=e.wrapS),e.wrapT!==void 0&&(t.wrapT=e.wrapT),e.wrapR!==void 0&&(t.wrapR=e.wrapR),e.magFilter!==void 0&&(t.magFilter=e.magFilter),e.minFilter!==void 0&&(t.minFilter=e.minFilter),e.format!==void 0&&(t.format=e.format),e.type!==void 0&&(t.type=e.type),e.anisotropy!==void 0&&(t.anisotropy=e.anisotropy),e.colorSpace!==void 0&&(t.colorSpace=e.colorSpace),e.flipY!==void 0&&(t.flipY=e.flipY),e.generateMipmaps!==void 0&&(t.generateMipmaps=e.generateMipmaps),e.internalFormat!==void 0&&(t.internalFormat=e.internalFormat);for(let i=0;i<this.textures.length;i++)this.textures[i].setValues(t)}get texture(){return this.textures[0]}set texture(e){this.textures[0]=e}set depthTexture(e){this._depthTexture!==null&&(this._depthTexture.renderTarget=null),e!==null&&(e.renderTarget=this),this._depthTexture=e}get depthTexture(){return this._depthTexture}setSize(e,t,i=1){if(this.width!==e||this.height!==t||this.depth!==i){this.width=e,this.height=t,this.depth=i;for(let s=0,r=this.textures.length;s<r;s++)this.textures[s].image.width=e,this.textures[s].image.height=t,this.textures[s].image.depth=i,this.textures[s].isArrayTexture=this.textures[s].image.depth>1;this.dispose()}this.viewport.set(0,0,e,t),this.scissor.set(0,0,e,t)}clone(){return new this.constructor().copy(this)}copy(e){this.width=e.width,this.height=e.height,this.depth=e.depth,this.scissor.copy(e.scissor),this.scissorTest=e.scissorTest,this.viewport.copy(e.viewport),this.textures.length=0;for(let t=0,i=e.textures.length;t<i;t++){this.textures[t]=e.textures[t].clone(),this.textures[t].isRenderTargetTexture=!0,this.textures[t].renderTarget=this;const s=Object.assign({},e.textures[t].image);this.textures[t].source=new au(s)}return this.depthBuffer=e.depthBuffer,this.stencilBuffer=e.stencilBuffer,this.resolveDepthBuffer=e.resolveDepthBuffer,this.resolveStencilBuffer=e.resolveStencilBuffer,e.depthTexture!==null&&(this.depthTexture=e.depthTexture.clone()),this.samples=e.samples,this}dispose(){this.dispatchEvent({type:"dispose"})}}class Wi extends W_{constructor(e=1,t=1,i={}){super(e,t,i),this.isWebGLRenderTarget=!0}}class ip extends Wt{constructor(e=null,t=1,i=1,s=1){super(null),this.isDataArrayTexture=!0,this.image={data:e,width:t,height:i,depth:s},this.magFilter=ln,this.minFilter=ln,this.wrapR=Bi,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1,this.layerUpdates=new Set}addLayerUpdate(e){this.layerUpdates.add(e)}clearLayerUpdates(){this.layerUpdates.clear()}}class X_ extends Wt{constructor(e=null,t=1,i=1,s=1){super(null),this.isData3DTexture=!0,this.image={data:e,width:t,height:i,depth:s},this.magFilter=ln,this.minFilter=ln,this.wrapR=Bi,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}}class Ki{constructor(e=new O(1/0,1/0,1/0),t=new O(-1/0,-1/0,-1/0)){this.isBox3=!0,this.min=e,this.max=t}set(e,t){return this.min.copy(e),this.max.copy(t),this}setFromArray(e){this.makeEmpty();for(let t=0,i=e.length;t<i;t+=3)this.expandByPoint(wn.fromArray(e,t));return this}setFromBufferAttribute(e){this.makeEmpty();for(let t=0,i=e.count;t<i;t++)this.expandByPoint(wn.fromBufferAttribute(e,t));return this}setFromPoints(e){this.makeEmpty();for(let t=0,i=e.length;t<i;t++)this.expandByPoint(e[t]);return this}setFromCenterAndSize(e,t){const i=wn.copy(t).multiplyScalar(.5);return this.min.copy(e).sub(i),this.max.copy(e).add(i),this}setFromObject(e,t=!1){return this.makeEmpty(),this.expandByObject(e,t)}clone(){return new this.constructor().copy(this)}copy(e){return this.min.copy(e.min),this.max.copy(e.max),this}makeEmpty(){return this.min.x=this.min.y=this.min.z=1/0,this.max.x=this.max.y=this.max.z=-1/0,this}isEmpty(){return this.max.x<this.min.x||this.max.y<this.min.y||this.max.z<this.min.z}getCenter(e){return this.isEmpty()?e.set(0,0,0):e.addVectors(this.min,this.max).multiplyScalar(.5)}getSize(e){return this.isEmpty()?e.set(0,0,0):e.subVectors(this.max,this.min)}expandByPoint(e){return this.min.min(e),this.max.max(e),this}expandByVector(e){return this.min.sub(e),this.max.add(e),this}expandByScalar(e){return this.min.addScalar(-e),this.max.addScalar(e),this}expandByObject(e,t=!1){e.updateWorldMatrix(!1,!1);const i=e.geometry;if(i!==void 0){const r=i.getAttribute("position");if(t===!0&&r!==void 0&&e.isInstancedMesh!==!0)for(let o=0,a=r.count;o<a;o++)e.isMesh===!0?e.getVertexPosition(o,wn):wn.fromBufferAttribute(r,o),wn.applyMatrix4(e.matrixWorld),this.expandByPoint(wn);else e.boundingBox!==void 0?(e.boundingBox===null&&e.computeBoundingBox(),Vr.copy(e.boundingBox)):(i.boundingBox===null&&i.computeBoundingBox(),Vr.copy(i.boundingBox)),Vr.applyMatrix4(e.matrixWorld),this.union(Vr)}const s=e.children;for(let r=0,o=s.length;r<o;r++)this.expandByObject(s[r],t);return this}containsPoint(e){return e.x>=this.min.x&&e.x<=this.max.x&&e.y>=this.min.y&&e.y<=this.max.y&&e.z>=this.min.z&&e.z<=this.max.z}containsBox(e){return this.min.x<=e.min.x&&e.max.x<=this.max.x&&this.min.y<=e.min.y&&e.max.y<=this.max.y&&this.min.z<=e.min.z&&e.max.z<=this.max.z}getParameter(e,t){return t.set((e.x-this.min.x)/(this.max.x-this.min.x),(e.y-this.min.y)/(this.max.y-this.min.y),(e.z-this.min.z)/(this.max.z-this.min.z))}intersectsBox(e){return e.max.x>=this.min.x&&e.min.x<=this.max.x&&e.max.y>=this.min.y&&e.min.y<=this.max.y&&e.max.z>=this.min.z&&e.min.z<=this.max.z}intersectsSphere(e){return this.clampPoint(e.center,wn),wn.distanceToSquared(e.center)<=e.radius*e.radius}intersectsPlane(e){let t,i;return e.normal.x>0?(t=e.normal.x*this.min.x,i=e.normal.x*this.max.x):(t=e.normal.x*this.max.x,i=e.normal.x*this.min.x),e.normal.y>0?(t+=e.normal.y*this.min.y,i+=e.normal.y*this.max.y):(t+=e.normal.y*this.max.y,i+=e.normal.y*this.min.y),e.normal.z>0?(t+=e.normal.z*this.min.z,i+=e.normal.z*this.max.z):(t+=e.normal.z*this.max.z,i+=e.normal.z*this.min.z),t<=-e.constant&&i>=-e.constant}intersectsTriangle(e){if(this.isEmpty())return!1;this.getCenter(js),$r.subVectors(this.max,js),rs.subVectors(e.a,js),os.subVectors(e.b,js),as.subVectors(e.c,js),ei.subVectors(os,rs),ti.subVectors(as,os),Ri.subVectors(rs,as);let t=[0,-ei.z,ei.y,0,-ti.z,ti.y,0,-Ri.z,Ri.y,ei.z,0,-ei.x,ti.z,0,-ti.x,Ri.z,0,-Ri.x,-ei.y,ei.x,0,-ti.y,ti.x,0,-Ri.y,Ri.x,0];return!Na(t,rs,os,as,$r)||(t=[1,0,0,0,1,0,0,0,1],!Na(t,rs,os,as,$r))?!1:(Wr.crossVectors(ei,ti),t=[Wr.x,Wr.y,Wr.z],Na(t,rs,os,as,$r))}clampPoint(e,t){return t.copy(e).clamp(this.min,this.max)}distanceToPoint(e){return this.clampPoint(e,wn).distanceTo(e)}getBoundingSphere(e){return this.isEmpty()?e.makeEmpty():(this.getCenter(e.center),e.radius=this.getSize(wn).length()*.5),e}intersect(e){return this.min.max(e.min),this.max.min(e.max),this.isEmpty()&&this.makeEmpty(),this}union(e){return this.min.min(e.min),this.max.max(e.max),this}applyMatrix4(e){return this.isEmpty()?this:(kn[0].set(this.min.x,this.min.y,this.min.z).applyMatrix4(e),kn[1].set(this.min.x,this.min.y,this.max.z).applyMatrix4(e),kn[2].set(this.min.x,this.max.y,this.min.z).applyMatrix4(e),kn[3].set(this.min.x,this.max.y,this.max.z).applyMatrix4(e),kn[4].set(this.max.x,this.min.y,this.min.z).applyMatrix4(e),kn[5].set(this.max.x,this.min.y,this.max.z).applyMatrix4(e),kn[6].set(this.max.x,this.max.y,this.min.z).applyMatrix4(e),kn[7].set(this.max.x,this.max.y,this.max.z).applyMatrix4(e),this.setFromPoints(kn),this)}translate(e){return this.min.add(e),this.max.add(e),this}equals(e){return e.min.equals(this.min)&&e.max.equals(this.max)}toJSON(){return{min:this.min.toArray(),max:this.max.toArray()}}fromJSON(e){return this.min.fromArray(e.min),this.max.fromArray(e.max),this}}const kn=[new O,new O,new O,new O,new O,new O,new O,new O],wn=new O,Vr=new Ki,rs=new O,os=new O,as=new O,ei=new O,ti=new O,Ri=new O,js=new O,$r=new O,Wr=new O,Ci=new O;function Na(n,e,t,i,s){for(let r=0,o=n.length-3;r<=o;r+=3){Ci.fromArray(n,r);const a=s.x*Math.abs(Ci.x)+s.y*Math.abs(Ci.y)+s.z*Math.abs(Ci.z),l=e.dot(Ci),c=t.dot(Ci),u=i.dot(Ci);if(Math.max(-Math.max(l,c,u),Math.min(l,c,u))>a)return!1}return!0}const Y_=new Ki,Ks=new O,Ua=new O;class Zi{constructor(e=new O,t=-1){this.isSphere=!0,this.center=e,this.radius=t}set(e,t){return this.center.copy(e),this.radius=t,this}setFromPoints(e,t){const i=this.center;t!==void 0?i.copy(t):Y_.setFromPoints(e).getCenter(i);let s=0;for(let r=0,o=e.length;r<o;r++)s=Math.max(s,i.distanceToSquared(e[r]));return this.radius=Math.sqrt(s),this}copy(e){return this.center.copy(e.center),this.radius=e.radius,this}isEmpty(){return this.radius<0}makeEmpty(){return this.center.set(0,0,0),this.radius=-1,this}containsPoint(e){return e.distanceToSquared(this.center)<=this.radius*this.radius}distanceToPoint(e){return e.distanceTo(this.center)-this.radius}intersectsSphere(e){const t=this.radius+e.radius;return e.center.distanceToSquared(this.center)<=t*t}intersectsBox(e){return e.intersectsSphere(this)}intersectsPlane(e){return Math.abs(e.distanceToPoint(this.center))<=this.radius}clampPoint(e,t){const i=this.center.distanceToSquared(e);return t.copy(e),i>this.radius*this.radius&&(t.sub(this.center).normalize(),t.multiplyScalar(this.radius).add(this.center)),t}getBoundingBox(e){return this.isEmpty()?(e.makeEmpty(),e):(e.set(this.center,this.center),e.expandByScalar(this.radius),e)}applyMatrix4(e){return this.center.applyMatrix4(e),this.radius=this.radius*e.getMaxScaleOnAxis(),this}translate(e){return this.center.add(e),this}expandByPoint(e){if(this.isEmpty())return this.center.copy(e),this.radius=0,this;Ks.subVectors(e,this.center);const t=Ks.lengthSq();if(t>this.radius*this.radius){const i=Math.sqrt(t),s=(i-this.radius)*.5;this.center.addScaledVector(Ks,s/i),this.radius+=s}return this}union(e){return e.isEmpty()?this:this.isEmpty()?(this.copy(e),this):(this.center.equals(e.center)===!0?this.radius=Math.max(this.radius,e.radius):(Ua.subVectors(e.center,this.center).setLength(e.radius),this.expandByPoint(Ks.copy(e.center).add(Ua)),this.expandByPoint(Ks.copy(e.center).sub(Ua))),this)}equals(e){return e.center.equals(this.center)&&e.radius===this.radius}clone(){return new this.constructor().copy(this)}toJSON(){return{radius:this.radius,center:this.center.toArray()}}fromJSON(e){return this.radius=e.radius,this.center.fromArray(e.center),this}}const zn=new O,Fa=new O,Xr=new O,ni=new O,Oa=new O,Yr=new O,Ba=new O;class Pr{constructor(e=new O,t=new O(0,0,-1)){this.origin=e,this.direction=t}set(e,t){return this.origin.copy(e),this.direction.copy(t),this}copy(e){return this.origin.copy(e.origin),this.direction.copy(e.direction),this}at(e,t){return t.copy(this.origin).addScaledVector(this.direction,e)}lookAt(e){return this.direction.copy(e).sub(this.origin).normalize(),this}recast(e){return this.origin.copy(this.at(e,zn)),this}closestPointToPoint(e,t){t.subVectors(e,this.origin);const i=t.dot(this.direction);return i<0?t.copy(this.origin):t.copy(this.origin).addScaledVector(this.direction,i)}distanceToPoint(e){return Math.sqrt(this.distanceSqToPoint(e))}distanceSqToPoint(e){const t=zn.subVectors(e,this.origin).dot(this.direction);return t<0?this.origin.distanceToSquared(e):(zn.copy(this.origin).addScaledVector(this.direction,t),zn.distanceToSquared(e))}distanceSqToSegment(e,t,i,s){Fa.copy(e).add(t).multiplyScalar(.5),Xr.copy(t).sub(e).normalize(),ni.copy(this.origin).sub(Fa);const r=e.distanceTo(t)*.5,o=-this.direction.dot(Xr),a=ni.dot(this.direction),l=-ni.dot(Xr),c=ni.lengthSq(),u=Math.abs(1-o*o);let d,h,p,g;if(u>0)if(d=o*l-a,h=o*a-l,g=r*u,d>=0)if(h>=-g)if(h<=g){const v=1/u;d*=v,h*=v,p=d*(d+o*h+2*a)+h*(o*d+h+2*l)+c}else h=r,d=Math.max(0,-(o*h+a)),p=-d*d+h*(h+2*l)+c;else h=-r,d=Math.max(0,-(o*h+a)),p=-d*d+h*(h+2*l)+c;else h<=-g?(d=Math.max(0,-(-o*r+a)),h=d>0?-r:Math.min(Math.max(-r,-l),r),p=-d*d+h*(h+2*l)+c):h<=g?(d=0,h=Math.min(Math.max(-r,-l),r),p=h*(h+2*l)+c):(d=Math.max(0,-(o*r+a)),h=d>0?r:Math.min(Math.max(-r,-l),r),p=-d*d+h*(h+2*l)+c);else h=o>0?-r:r,d=Math.max(0,-(o*h+a)),p=-d*d+h*(h+2*l)+c;return i&&i.copy(this.origin).addScaledVector(this.direction,d),s&&s.copy(Fa).addScaledVector(Xr,h),p}intersectSphere(e,t){zn.subVectors(e.center,this.origin);const i=zn.dot(this.direction),s=zn.dot(zn)-i*i,r=e.radius*e.radius;if(s>r)return null;const o=Math.sqrt(r-s),a=i-o,l=i+o;return l<0?null:a<0?this.at(l,t):this.at(a,t)}intersectsSphere(e){return e.radius<0?!1:this.distanceSqToPoint(e.center)<=e.radius*e.radius}distanceToPlane(e){const t=e.normal.dot(this.direction);if(t===0)return e.distanceToPoint(this.origin)===0?0:null;const i=-(this.origin.dot(e.normal)+e.constant)/t;return i>=0?i:null}intersectPlane(e,t){const i=this.distanceToPlane(e);return i===null?null:this.at(i,t)}intersectsPlane(e){const t=e.distanceToPoint(this.origin);return t===0||e.normal.dot(this.direction)*t<0}intersectBox(e,t){let i,s,r,o,a,l;const c=1/this.direction.x,u=1/this.direction.y,d=1/this.direction.z,h=this.origin;return c>=0?(i=(e.min.x-h.x)*c,s=(e.max.x-h.x)*c):(i=(e.max.x-h.x)*c,s=(e.min.x-h.x)*c),u>=0?(r=(e.min.y-h.y)*u,o=(e.max.y-h.y)*u):(r=(e.max.y-h.y)*u,o=(e.min.y-h.y)*u),i>o||r>s||((r>i||isNaN(i))&&(i=r),(o<s||isNaN(s))&&(s=o),d>=0?(a=(e.min.z-h.z)*d,l=(e.max.z-h.z)*d):(a=(e.max.z-h.z)*d,l=(e.min.z-h.z)*d),i>l||a>s)||((a>i||i!==i)&&(i=a),(l<s||s!==s)&&(s=l),s<0)?null:this.at(i>=0?i:s,t)}intersectsBox(e){return this.intersectBox(e,zn)!==null}intersectTriangle(e,t,i,s,r){Oa.subVectors(t,e),Yr.subVectors(i,e),Ba.crossVectors(Oa,Yr);let o=this.direction.dot(Ba),a;if(o>0){if(s)return null;a=1}else if(o<0)a=-1,o=-o;else return null;ni.subVectors(this.origin,e);const l=a*this.direction.dot(Yr.crossVectors(ni,Yr));if(l<0)return null;const c=a*this.direction.dot(Oa.cross(ni));if(c<0||l+c>o)return null;const u=-a*ni.dot(Ba);return u<0?null:this.at(u/o,r)}applyMatrix4(e){return this.origin.applyMatrix4(e),this.direction.transformDirection(e),this}equals(e){return e.origin.equals(this.origin)&&e.direction.equals(this.direction)}clone(){return new this.constructor().copy(this)}}class rt{constructor(e,t,i,s,r,o,a,l,c,u,d,h,p,g,v,m){rt.prototype.isMatrix4=!0,this.elements=[1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1],e!==void 0&&this.set(e,t,i,s,r,o,a,l,c,u,d,h,p,g,v,m)}set(e,t,i,s,r,o,a,l,c,u,d,h,p,g,v,m){const f=this.elements;return f[0]=e,f[4]=t,f[8]=i,f[12]=s,f[1]=r,f[5]=o,f[9]=a,f[13]=l,f[2]=c,f[6]=u,f[10]=d,f[14]=h,f[3]=p,f[7]=g,f[11]=v,f[15]=m,this}identity(){return this.set(1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1),this}clone(){return new rt().fromArray(this.elements)}copy(e){const t=this.elements,i=e.elements;return t[0]=i[0],t[1]=i[1],t[2]=i[2],t[3]=i[3],t[4]=i[4],t[5]=i[5],t[6]=i[6],t[7]=i[7],t[8]=i[8],t[9]=i[9],t[10]=i[10],t[11]=i[11],t[12]=i[12],t[13]=i[13],t[14]=i[14],t[15]=i[15],this}copyPosition(e){const t=this.elements,i=e.elements;return t[12]=i[12],t[13]=i[13],t[14]=i[14],this}setFromMatrix3(e){const t=e.elements;return this.set(t[0],t[3],t[6],0,t[1],t[4],t[7],0,t[2],t[5],t[8],0,0,0,0,1),this}extractBasis(e,t,i){return e.setFromMatrixColumn(this,0),t.setFromMatrixColumn(this,1),i.setFromMatrixColumn(this,2),this}makeBasis(e,t,i){return this.set(e.x,t.x,i.x,0,e.y,t.y,i.y,0,e.z,t.z,i.z,0,0,0,0,1),this}extractRotation(e){const t=this.elements,i=e.elements,s=1/ls.setFromMatrixColumn(e,0).length(),r=1/ls.setFromMatrixColumn(e,1).length(),o=1/ls.setFromMatrixColumn(e,2).length();return t[0]=i[0]*s,t[1]=i[1]*s,t[2]=i[2]*s,t[3]=0,t[4]=i[4]*r,t[5]=i[5]*r,t[6]=i[6]*r,t[7]=0,t[8]=i[8]*o,t[9]=i[9]*o,t[10]=i[10]*o,t[11]=0,t[12]=0,t[13]=0,t[14]=0,t[15]=1,this}makeRotationFromEuler(e){const t=this.elements,i=e.x,s=e.y,r=e.z,o=Math.cos(i),a=Math.sin(i),l=Math.cos(s),c=Math.sin(s),u=Math.cos(r),d=Math.sin(r);if(e.order==="XYZ"){const h=o*u,p=o*d,g=a*u,v=a*d;t[0]=l*u,t[4]=-l*d,t[8]=c,t[1]=p+g*c,t[5]=h-v*c,t[9]=-a*l,t[2]=v-h*c,t[6]=g+p*c,t[10]=o*l}else if(e.order==="YXZ"){const h=l*u,p=l*d,g=c*u,v=c*d;t[0]=h+v*a,t[4]=g*a-p,t[8]=o*c,t[1]=o*d,t[5]=o*u,t[9]=-a,t[2]=p*a-g,t[6]=v+h*a,t[10]=o*l}else if(e.order==="ZXY"){const h=l*u,p=l*d,g=c*u,v=c*d;t[0]=h-v*a,t[4]=-o*d,t[8]=g+p*a,t[1]=p+g*a,t[5]=o*u,t[9]=v-h*a,t[2]=-o*c,t[6]=a,t[10]=o*l}else if(e.order==="ZYX"){const h=o*u,p=o*d,g=a*u,v=a*d;t[0]=l*u,t[4]=g*c-p,t[8]=h*c+v,t[1]=l*d,t[5]=v*c+h,t[9]=p*c-g,t[2]=-c,t[6]=a*l,t[10]=o*l}else if(e.order==="YZX"){const h=o*l,p=o*c,g=a*l,v=a*c;t[0]=l*u,t[4]=v-h*d,t[8]=g*d+p,t[1]=d,t[5]=o*u,t[9]=-a*u,t[2]=-c*u,t[6]=p*d+g,t[10]=h-v*d}else if(e.order==="XZY"){const h=o*l,p=o*c,g=a*l,v=a*c;t[0]=l*u,t[4]=-d,t[8]=c*u,t[1]=h*d+v,t[5]=o*u,t[9]=p*d-g,t[2]=g*d-p,t[6]=a*u,t[10]=v*d+h}return t[3]=0,t[7]=0,t[11]=0,t[12]=0,t[13]=0,t[14]=0,t[15]=1,this}makeRotationFromQuaternion(e){return this.compose(q_,e,j_)}lookAt(e,t,i){const s=this.elements;return sn.subVectors(e,t),sn.lengthSq()===0&&(sn.z=1),sn.normalize(),ii.crossVectors(i,sn),ii.lengthSq()===0&&(Math.abs(i.z)===1?sn.x+=1e-4:sn.z+=1e-4,sn.normalize(),ii.crossVectors(i,sn)),ii.normalize(),qr.crossVectors(sn,ii),s[0]=ii.x,s[4]=qr.x,s[8]=sn.x,s[1]=ii.y,s[5]=qr.y,s[9]=sn.y,s[2]=ii.z,s[6]=qr.z,s[10]=sn.z,this}multiply(e){return this.multiplyMatrices(this,e)}premultiply(e){return this.multiplyMatrices(e,this)}multiplyMatrices(e,t){const i=e.elements,s=t.elements,r=this.elements,o=i[0],a=i[4],l=i[8],c=i[12],u=i[1],d=i[5],h=i[9],p=i[13],g=i[2],v=i[6],m=i[10],f=i[14],T=i[3],y=i[7],M=i[11],P=i[15],E=s[0],A=s[4],R=s[8],w=s[12],S=s[1],D=s[5],$=s[9],k=s[13],q=s[2],Z=s[6],V=s[10],se=s[14],H=s[3],ae=s[7],ge=s[11],Te=s[15];return r[0]=o*E+a*S+l*q+c*H,r[4]=o*A+a*D+l*Z+c*ae,r[8]=o*R+a*$+l*V+c*ge,r[12]=o*w+a*k+l*se+c*Te,r[1]=u*E+d*S+h*q+p*H,r[5]=u*A+d*D+h*Z+p*ae,r[9]=u*R+d*$+h*V+p*ge,r[13]=u*w+d*k+h*se+p*Te,r[2]=g*E+v*S+m*q+f*H,r[6]=g*A+v*D+m*Z+f*ae,r[10]=g*R+v*$+m*V+f*ge,r[14]=g*w+v*k+m*se+f*Te,r[3]=T*E+y*S+M*q+P*H,r[7]=T*A+y*D+M*Z+P*ae,r[11]=T*R+y*$+M*V+P*ge,r[15]=T*w+y*k+M*se+P*Te,this}multiplyScalar(e){const t=this.elements;return t[0]*=e,t[4]*=e,t[8]*=e,t[12]*=e,t[1]*=e,t[5]*=e,t[9]*=e,t[13]*=e,t[2]*=e,t[6]*=e,t[10]*=e,t[14]*=e,t[3]*=e,t[7]*=e,t[11]*=e,t[15]*=e,this}determinant(){const e=this.elements,t=e[0],i=e[4],s=e[8],r=e[12],o=e[1],a=e[5],l=e[9],c=e[13],u=e[2],d=e[6],h=e[10],p=e[14],g=e[3],v=e[7],m=e[11],f=e[15];return g*(+r*l*d-s*c*d-r*a*h+i*c*h+s*a*p-i*l*p)+v*(+t*l*p-t*c*h+r*o*h-s*o*p+s*c*u-r*l*u)+m*(+t*c*d-t*a*p-r*o*d+i*o*p+r*a*u-i*c*u)+f*(-s*a*u-t*l*d+t*a*h+s*o*d-i*o*h+i*l*u)}transpose(){const e=this.elements;let t;return t=e[1],e[1]=e[4],e[4]=t,t=e[2],e[2]=e[8],e[8]=t,t=e[6],e[6]=e[9],e[9]=t,t=e[3],e[3]=e[12],e[12]=t,t=e[7],e[7]=e[13],e[13]=t,t=e[11],e[11]=e[14],e[14]=t,this}setPosition(e,t,i){const s=this.elements;return e.isVector3?(s[12]=e.x,s[13]=e.y,s[14]=e.z):(s[12]=e,s[13]=t,s[14]=i),this}invert(){const e=this.elements,t=e[0],i=e[1],s=e[2],r=e[3],o=e[4],a=e[5],l=e[6],c=e[7],u=e[8],d=e[9],h=e[10],p=e[11],g=e[12],v=e[13],m=e[14],f=e[15],T=d*m*c-v*h*c+v*l*p-a*m*p-d*l*f+a*h*f,y=g*h*c-u*m*c-g*l*p+o*m*p+u*l*f-o*h*f,M=u*v*c-g*d*c+g*a*p-o*v*p-u*a*f+o*d*f,P=g*d*l-u*v*l-g*a*h+o*v*h+u*a*m-o*d*m,E=t*T+i*y+s*M+r*P;if(E===0)return this.set(0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0);const A=1/E;return e[0]=T*A,e[1]=(v*h*r-d*m*r-v*s*p+i*m*p+d*s*f-i*h*f)*A,e[2]=(a*m*r-v*l*r+v*s*c-i*m*c-a*s*f+i*l*f)*A,e[3]=(d*l*r-a*h*r-d*s*c+i*h*c+a*s*p-i*l*p)*A,e[4]=y*A,e[5]=(u*m*r-g*h*r+g*s*p-t*m*p-u*s*f+t*h*f)*A,e[6]=(g*l*r-o*m*r-g*s*c+t*m*c+o*s*f-t*l*f)*A,e[7]=(o*h*r-u*l*r+u*s*c-t*h*c-o*s*p+t*l*p)*A,e[8]=M*A,e[9]=(g*d*r-u*v*r-g*i*p+t*v*p+u*i*f-t*d*f)*A,e[10]=(o*v*r-g*a*r+g*i*c-t*v*c-o*i*f+t*a*f)*A,e[11]=(u*a*r-o*d*r-u*i*c+t*d*c+o*i*p-t*a*p)*A,e[12]=P*A,e[13]=(u*v*s-g*d*s+g*i*h-t*v*h-u*i*m+t*d*m)*A,e[14]=(g*a*s-o*v*s-g*i*l+t*v*l+o*i*m-t*a*m)*A,e[15]=(o*d*s-u*a*s+u*i*l-t*d*l-o*i*h+t*a*h)*A,this}scale(e){const t=this.elements,i=e.x,s=e.y,r=e.z;return t[0]*=i,t[4]*=s,t[8]*=r,t[1]*=i,t[5]*=s,t[9]*=r,t[2]*=i,t[6]*=s,t[10]*=r,t[3]*=i,t[7]*=s,t[11]*=r,this}getMaxScaleOnAxis(){const e=this.elements,t=e[0]*e[0]+e[1]*e[1]+e[2]*e[2],i=e[4]*e[4]+e[5]*e[5]+e[6]*e[6],s=e[8]*e[8]+e[9]*e[9]+e[10]*e[10];return Math.sqrt(Math.max(t,i,s))}makeTranslation(e,t,i){return e.isVector3?this.set(1,0,0,e.x,0,1,0,e.y,0,0,1,e.z,0,0,0,1):this.set(1,0,0,e,0,1,0,t,0,0,1,i,0,0,0,1),this}makeRotationX(e){const t=Math.cos(e),i=Math.sin(e);return this.set(1,0,0,0,0,t,-i,0,0,i,t,0,0,0,0,1),this}makeRotationY(e){const t=Math.cos(e),i=Math.sin(e);return this.set(t,0,i,0,0,1,0,0,-i,0,t,0,0,0,0,1),this}makeRotationZ(e){const t=Math.cos(e),i=Math.sin(e);return this.set(t,-i,0,0,i,t,0,0,0,0,1,0,0,0,0,1),this}makeRotationAxis(e,t){const i=Math.cos(t),s=Math.sin(t),r=1-i,o=e.x,a=e.y,l=e.z,c=r*o,u=r*a;return this.set(c*o+i,c*a-s*l,c*l+s*a,0,c*a+s*l,u*a+i,u*l-s*o,0,c*l-s*a,u*l+s*o,r*l*l+i,0,0,0,0,1),this}makeScale(e,t,i){return this.set(e,0,0,0,0,t,0,0,0,0,i,0,0,0,0,1),this}makeShear(e,t,i,s,r,o){return this.set(1,i,r,0,e,1,o,0,t,s,1,0,0,0,0,1),this}compose(e,t,i){const s=this.elements,r=t._x,o=t._y,a=t._z,l=t._w,c=r+r,u=o+o,d=a+a,h=r*c,p=r*u,g=r*d,v=o*u,m=o*d,f=a*d,T=l*c,y=l*u,M=l*d,P=i.x,E=i.y,A=i.z;return s[0]=(1-(v+f))*P,s[1]=(p+M)*P,s[2]=(g-y)*P,s[3]=0,s[4]=(p-M)*E,s[5]=(1-(h+f))*E,s[6]=(m+T)*E,s[7]=0,s[8]=(g+y)*A,s[9]=(m-T)*A,s[10]=(1-(h+v))*A,s[11]=0,s[12]=e.x,s[13]=e.y,s[14]=e.z,s[15]=1,this}decompose(e,t,i){const s=this.elements;let r=ls.set(s[0],s[1],s[2]).length();const o=ls.set(s[4],s[5],s[6]).length(),a=ls.set(s[8],s[9],s[10]).length();this.determinant()<0&&(r=-r),e.x=s[12],e.y=s[13],e.z=s[14],bn.copy(this);const c=1/r,u=1/o,d=1/a;return bn.elements[0]*=c,bn.elements[1]*=c,bn.elements[2]*=c,bn.elements[4]*=u,bn.elements[5]*=u,bn.elements[6]*=u,bn.elements[8]*=d,bn.elements[9]*=d,bn.elements[10]*=d,t.setFromRotationMatrix(bn),i.x=r,i.y=o,i.z=a,this}makePerspective(e,t,i,s,r,o,a=Kn){const l=this.elements,c=2*r/(t-e),u=2*r/(i-s),d=(t+e)/(t-e),h=(i+s)/(i-s);let p,g;if(a===Kn)p=-(o+r)/(o-r),g=-2*o*r/(o-r);else if(a===$o)p=-o/(o-r),g=-o*r/(o-r);else throw new Error("THREE.Matrix4.makePerspective(): Invalid coordinate system: "+a);return l[0]=c,l[4]=0,l[8]=d,l[12]=0,l[1]=0,l[5]=u,l[9]=h,l[13]=0,l[2]=0,l[6]=0,l[10]=p,l[14]=g,l[3]=0,l[7]=0,l[11]=-1,l[15]=0,this}makeOrthographic(e,t,i,s,r,o,a=Kn){const l=this.elements,c=1/(t-e),u=1/(i-s),d=1/(o-r),h=(t+e)*c,p=(i+s)*u;let g,v;if(a===Kn)g=(o+r)*d,v=-2*d;else if(a===$o)g=r*d,v=-1*d;else throw new Error("THREE.Matrix4.makeOrthographic(): Invalid coordinate system: "+a);return l[0]=2*c,l[4]=0,l[8]=0,l[12]=-h,l[1]=0,l[5]=2*u,l[9]=0,l[13]=-p,l[2]=0,l[6]=0,l[10]=v,l[14]=-g,l[3]=0,l[7]=0,l[11]=0,l[15]=1,this}equals(e){const t=this.elements,i=e.elements;for(let s=0;s<16;s++)if(t[s]!==i[s])return!1;return!0}fromArray(e,t=0){for(let i=0;i<16;i++)this.elements[i]=e[i+t];return this}toArray(e=[],t=0){const i=this.elements;return e[t]=i[0],e[t+1]=i[1],e[t+2]=i[2],e[t+3]=i[3],e[t+4]=i[4],e[t+5]=i[5],e[t+6]=i[6],e[t+7]=i[7],e[t+8]=i[8],e[t+9]=i[9],e[t+10]=i[10],e[t+11]=i[11],e[t+12]=i[12],e[t+13]=i[13],e[t+14]=i[14],e[t+15]=i[15],e}}const ls=new O,bn=new rt,q_=new O(0,0,0),j_=new O(1,1,1),ii=new O,qr=new O,sn=new O,Md=new rt,wd=new $i;class Fn{constructor(e=0,t=0,i=0,s=Fn.DEFAULT_ORDER){this.isEuler=!0,this._x=e,this._y=t,this._z=i,this._order=s}get x(){return this._x}set x(e){this._x=e,this._onChangeCallback()}get y(){return this._y}set y(e){this._y=e,this._onChangeCallback()}get z(){return this._z}set z(e){this._z=e,this._onChangeCallback()}get order(){return this._order}set order(e){this._order=e,this._onChangeCallback()}set(e,t,i,s=this._order){return this._x=e,this._y=t,this._z=i,this._order=s,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._order)}copy(e){return this._x=e._x,this._y=e._y,this._z=e._z,this._order=e._order,this._onChangeCallback(),this}setFromRotationMatrix(e,t=this._order,i=!0){const s=e.elements,r=s[0],o=s[4],a=s[8],l=s[1],c=s[5],u=s[9],d=s[2],h=s[6],p=s[10];switch(t){case"XYZ":this._y=Math.asin(Je(a,-1,1)),Math.abs(a)<.9999999?(this._x=Math.atan2(-u,p),this._z=Math.atan2(-o,r)):(this._x=Math.atan2(h,c),this._z=0);break;case"YXZ":this._x=Math.asin(-Je(u,-1,1)),Math.abs(u)<.9999999?(this._y=Math.atan2(a,p),this._z=Math.atan2(l,c)):(this._y=Math.atan2(-d,r),this._z=0);break;case"ZXY":this._x=Math.asin(Je(h,-1,1)),Math.abs(h)<.9999999?(this._y=Math.atan2(-d,p),this._z=Math.atan2(-o,c)):(this._y=0,this._z=Math.atan2(l,r));break;case"ZYX":this._y=Math.asin(-Je(d,-1,1)),Math.abs(d)<.9999999?(this._x=Math.atan2(h,p),this._z=Math.atan2(l,r)):(this._x=0,this._z=Math.atan2(-o,c));break;case"YZX":this._z=Math.asin(Je(l,-1,1)),Math.abs(l)<.9999999?(this._x=Math.atan2(-u,c),this._y=Math.atan2(-d,r)):(this._x=0,this._y=Math.atan2(a,p));break;case"XZY":this._z=Math.asin(-Je(o,-1,1)),Math.abs(o)<.9999999?(this._x=Math.atan2(h,c),this._y=Math.atan2(a,r)):(this._x=Math.atan2(-u,p),this._y=0);break;default:console.warn("THREE.Euler: .setFromRotationMatrix() encountered an unknown order: "+t)}return this._order=t,i===!0&&this._onChangeCallback(),this}setFromQuaternion(e,t,i){return Md.makeRotationFromQuaternion(e),this.setFromRotationMatrix(Md,t,i)}setFromVector3(e,t=this._order){return this.set(e.x,e.y,e.z,t)}reorder(e){return wd.setFromEuler(this),this.setFromQuaternion(wd,e)}equals(e){return e._x===this._x&&e._y===this._y&&e._z===this._z&&e._order===this._order}fromArray(e){return this._x=e[0],this._y=e[1],this._z=e[2],e[3]!==void 0&&(this._order=e[3]),this._onChangeCallback(),this}toArray(e=[],t=0){return e[t]=this._x,e[t+1]=this._y,e[t+2]=this._z,e[t+3]=this._order,e}_onChange(e){return this._onChangeCallback=e,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._order}}Fn.DEFAULT_ORDER="XYZ";class lu{constructor(){this.mask=1}set(e){this.mask=(1<<e|0)>>>0}enable(e){this.mask|=1<<e|0}enableAll(){this.mask=-1}toggle(e){this.mask^=1<<e|0}disable(e){this.mask&=~(1<<e|0)}disableAll(){this.mask=0}test(e){return(this.mask&e.mask)!==0}isEnabled(e){return(this.mask&(1<<e|0))!==0}}let K_=0;const bd=new O,cs=new $i,Gn=new rt,jr=new O,Zs=new O,Z_=new O,J_=new $i,Ed=new O(1,0,0),Td=new O(0,1,0),Ad=new O(0,0,1),Rd={type:"added"},Q_={type:"removed"},us={type:"childadded",child:null},ka={type:"childremoved",child:null};class Nt extends ji{constructor(){super(),this.isObject3D=!0,Object.defineProperty(this,"id",{value:K_++}),this.uuid=Cr(),this.name="",this.type="Object3D",this.parent=null,this.children=[],this.up=Nt.DEFAULT_UP.clone();const e=new O,t=new Fn,i=new $i,s=new O(1,1,1);function r(){i.setFromEuler(t,!1)}function o(){t.setFromQuaternion(i,void 0,!1)}t._onChange(r),i._onChange(o),Object.defineProperties(this,{position:{configurable:!0,enumerable:!0,value:e},rotation:{configurable:!0,enumerable:!0,value:t},quaternion:{configurable:!0,enumerable:!0,value:i},scale:{configurable:!0,enumerable:!0,value:s},modelViewMatrix:{value:new rt},normalMatrix:{value:new qe}}),this.matrix=new rt,this.matrixWorld=new rt,this.matrixAutoUpdate=Nt.DEFAULT_MATRIX_AUTO_UPDATE,this.matrixWorldAutoUpdate=Nt.DEFAULT_MATRIX_WORLD_AUTO_UPDATE,this.matrixWorldNeedsUpdate=!1,this.layers=new lu,this.visible=!0,this.castShadow=!1,this.receiveShadow=!1,this.frustumCulled=!0,this.renderOrder=0,this.animations=[],this.customDepthMaterial=void 0,this.customDistanceMaterial=void 0,this.userData={}}onBeforeShadow(){}onAfterShadow(){}onBeforeRender(){}onAfterRender(){}applyMatrix4(e){this.matrixAutoUpdate&&this.updateMatrix(),this.matrix.premultiply(e),this.matrix.decompose(this.position,this.quaternion,this.scale)}applyQuaternion(e){return this.quaternion.premultiply(e),this}setRotationFromAxisAngle(e,t){this.quaternion.setFromAxisAngle(e,t)}setRotationFromEuler(e){this.quaternion.setFromEuler(e,!0)}setRotationFromMatrix(e){this.quaternion.setFromRotationMatrix(e)}setRotationFromQuaternion(e){this.quaternion.copy(e)}rotateOnAxis(e,t){return cs.setFromAxisAngle(e,t),this.quaternion.multiply(cs),this}rotateOnWorldAxis(e,t){return cs.setFromAxisAngle(e,t),this.quaternion.premultiply(cs),this}rotateX(e){return this.rotateOnAxis(Ed,e)}rotateY(e){return this.rotateOnAxis(Td,e)}rotateZ(e){return this.rotateOnAxis(Ad,e)}translateOnAxis(e,t){return bd.copy(e).applyQuaternion(this.quaternion),this.position.add(bd.multiplyScalar(t)),this}translateX(e){return this.translateOnAxis(Ed,e)}translateY(e){return this.translateOnAxis(Td,e)}translateZ(e){return this.translateOnAxis(Ad,e)}localToWorld(e){return this.updateWorldMatrix(!0,!1),e.applyMatrix4(this.matrixWorld)}worldToLocal(e){return this.updateWorldMatrix(!0,!1),e.applyMatrix4(Gn.copy(this.matrixWorld).invert())}lookAt(e,t,i){e.isVector3?jr.copy(e):jr.set(e,t,i);const s=this.parent;this.updateWorldMatrix(!0,!1),Zs.setFromMatrixPosition(this.matrixWorld),this.isCamera||this.isLight?Gn.lookAt(Zs,jr,this.up):Gn.lookAt(jr,Zs,this.up),this.quaternion.setFromRotationMatrix(Gn),s&&(Gn.extractRotation(s.matrixWorld),cs.setFromRotationMatrix(Gn),this.quaternion.premultiply(cs.invert()))}add(e){if(arguments.length>1){for(let t=0;t<arguments.length;t++)this.add(arguments[t]);return this}return e===this?(console.error("THREE.Object3D.add: object can't be added as a child of itself.",e),this):(e&&e.isObject3D?(e.removeFromParent(),e.parent=this,this.children.push(e),e.dispatchEvent(Rd),us.child=e,this.dispatchEvent(us),us.child=null):console.error("THREE.Object3D.add: object not an instance of THREE.Object3D.",e),this)}remove(e){if(arguments.length>1){for(let i=0;i<arguments.length;i++)this.remove(arguments[i]);return this}const t=this.children.indexOf(e);return t!==-1&&(e.parent=null,this.children.splice(t,1),e.dispatchEvent(Q_),ka.child=e,this.dispatchEvent(ka),ka.child=null),this}removeFromParent(){const e=this.parent;return e!==null&&e.remove(this),this}clear(){return this.remove(...this.children)}attach(e){return this.updateWorldMatrix(!0,!1),Gn.copy(this.matrixWorld).invert(),e.parent!==null&&(e.parent.updateWorldMatrix(!0,!1),Gn.multiply(e.parent.matrixWorld)),e.applyMatrix4(Gn),e.removeFromParent(),e.parent=this,this.children.push(e),e.updateWorldMatrix(!1,!0),e.dispatchEvent(Rd),us.child=e,this.dispatchEvent(us),us.child=null,this}getObjectById(e){return this.getObjectByProperty("id",e)}getObjectByName(e){return this.getObjectByProperty("name",e)}getObjectByProperty(e,t){if(this[e]===t)return this;for(let i=0,s=this.children.length;i<s;i++){const o=this.children[i].getObjectByProperty(e,t);if(o!==void 0)return o}}getObjectsByProperty(e,t,i=[]){this[e]===t&&i.push(this);const s=this.children;for(let r=0,o=s.length;r<o;r++)s[r].getObjectsByProperty(e,t,i);return i}getWorldPosition(e){return this.updateWorldMatrix(!0,!1),e.setFromMatrixPosition(this.matrixWorld)}getWorldQuaternion(e){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(Zs,e,Z_),e}getWorldScale(e){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(Zs,J_,e),e}getWorldDirection(e){this.updateWorldMatrix(!0,!1);const t=this.matrixWorld.elements;return e.set(t[8],t[9],t[10]).normalize()}raycast(){}traverse(e){e(this);const t=this.children;for(let i=0,s=t.length;i<s;i++)t[i].traverse(e)}traverseVisible(e){if(this.visible===!1)return;e(this);const t=this.children;for(let i=0,s=t.length;i<s;i++)t[i].traverseVisible(e)}traverseAncestors(e){const t=this.parent;t!==null&&(e(t),t.traverseAncestors(e))}updateMatrix(){this.matrix.compose(this.position,this.quaternion,this.scale),this.matrixWorldNeedsUpdate=!0}updateMatrixWorld(e){this.matrixAutoUpdate&&this.updateMatrix(),(this.matrixWorldNeedsUpdate||e)&&(this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),this.matrixWorldNeedsUpdate=!1,e=!0);const t=this.children;for(let i=0,s=t.length;i<s;i++)t[i].updateMatrixWorld(e)}updateWorldMatrix(e,t){const i=this.parent;if(e===!0&&i!==null&&i.updateWorldMatrix(!0,!1),this.matrixAutoUpdate&&this.updateMatrix(),this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),t===!0){const s=this.children;for(let r=0,o=s.length;r<o;r++)s[r].updateWorldMatrix(!1,!0)}}toJSON(e){const t=e===void 0||typeof e=="string",i={};t&&(e={geometries:{},materials:{},textures:{},images:{},shapes:{},skeletons:{},animations:{},nodes:{}},i.metadata={version:4.7,type:"Object",generator:"Object3D.toJSON"});const s={};s.uuid=this.uuid,s.type=this.type,this.name!==""&&(s.name=this.name),this.castShadow===!0&&(s.castShadow=!0),this.receiveShadow===!0&&(s.receiveShadow=!0),this.visible===!1&&(s.visible=!1),this.frustumCulled===!1&&(s.frustumCulled=!1),this.renderOrder!==0&&(s.renderOrder=this.renderOrder),Object.keys(this.userData).length>0&&(s.userData=this.userData),s.layers=this.layers.mask,s.matrix=this.matrix.toArray(),s.up=this.up.toArray(),this.matrixAutoUpdate===!1&&(s.matrixAutoUpdate=!1),this.isInstancedMesh&&(s.type="InstancedMesh",s.count=this.count,s.instanceMatrix=this.instanceMatrix.toJSON(),this.instanceColor!==null&&(s.instanceColor=this.instanceColor.toJSON())),this.isBatchedMesh&&(s.type="BatchedMesh",s.perObjectFrustumCulled=this.perObjectFrustumCulled,s.sortObjects=this.sortObjects,s.drawRanges=this._drawRanges,s.reservedRanges=this._reservedRanges,s.geometryInfo=this._geometryInfo.map(a=>({...a,boundingBox:a.boundingBox?a.boundingBox.toJSON():void 0,boundingSphere:a.boundingSphere?a.boundingSphere.toJSON():void 0})),s.instanceInfo=this._instanceInfo.map(a=>({...a})),s.availableInstanceIds=this._availableInstanceIds.slice(),s.availableGeometryIds=this._availableGeometryIds.slice(),s.nextIndexStart=this._nextIndexStart,s.nextVertexStart=this._nextVertexStart,s.geometryCount=this._geometryCount,s.maxInstanceCount=this._maxInstanceCount,s.maxVertexCount=this._maxVertexCount,s.maxIndexCount=this._maxIndexCount,s.geometryInitialized=this._geometryInitialized,s.matricesTexture=this._matricesTexture.toJSON(e),s.indirectTexture=this._indirectTexture.toJSON(e),this._colorsTexture!==null&&(s.colorsTexture=this._colorsTexture.toJSON(e)),this.boundingSphere!==null&&(s.boundingSphere=this.boundingSphere.toJSON()),this.boundingBox!==null&&(s.boundingBox=this.boundingBox.toJSON()));function r(a,l){return a[l.uuid]===void 0&&(a[l.uuid]=l.toJSON(e)),l.uuid}if(this.isScene)this.background&&(this.background.isColor?s.background=this.background.toJSON():this.background.isTexture&&(s.background=this.background.toJSON(e).uuid)),this.environment&&this.environment.isTexture&&this.environment.isRenderTargetTexture!==!0&&(s.environment=this.environment.toJSON(e).uuid);else if(this.isMesh||this.isLine||this.isPoints){s.geometry=r(e.geometries,this.geometry);const a=this.geometry.parameters;if(a!==void 0&&a.shapes!==void 0){const l=a.shapes;if(Array.isArray(l))for(let c=0,u=l.length;c<u;c++){const d=l[c];r(e.shapes,d)}else r(e.shapes,l)}}if(this.isSkinnedMesh&&(s.bindMode=this.bindMode,s.bindMatrix=this.bindMatrix.toArray(),this.skeleton!==void 0&&(r(e.skeletons,this.skeleton),s.skeleton=this.skeleton.uuid)),this.material!==void 0)if(Array.isArray(this.material)){const a=[];for(let l=0,c=this.material.length;l<c;l++)a.push(r(e.materials,this.material[l]));s.material=a}else s.material=r(e.materials,this.material);if(this.children.length>0){s.children=[];for(let a=0;a<this.children.length;a++)s.children.push(this.children[a].toJSON(e).object)}if(this.animations.length>0){s.animations=[];for(let a=0;a<this.animations.length;a++){const l=this.animations[a];s.animations.push(r(e.animations,l))}}if(t){const a=o(e.geometries),l=o(e.materials),c=o(e.textures),u=o(e.images),d=o(e.shapes),h=o(e.skeletons),p=o(e.animations),g=o(e.nodes);a.length>0&&(i.geometries=a),l.length>0&&(i.materials=l),c.length>0&&(i.textures=c),u.length>0&&(i.images=u),d.length>0&&(i.shapes=d),h.length>0&&(i.skeletons=h),p.length>0&&(i.animations=p),g.length>0&&(i.nodes=g)}return i.object=s,i;function o(a){const l=[];for(const c in a){const u=a[c];delete u.metadata,l.push(u)}return l}}clone(e){return new this.constructor().copy(this,e)}copy(e,t=!0){if(this.name=e.name,this.up.copy(e.up),this.position.copy(e.position),this.rotation.order=e.rotation.order,this.quaternion.copy(e.quaternion),this.scale.copy(e.scale),this.matrix.copy(e.matrix),this.matrixWorld.copy(e.matrixWorld),this.matrixAutoUpdate=e.matrixAutoUpdate,this.matrixWorldAutoUpdate=e.matrixWorldAutoUpdate,this.matrixWorldNeedsUpdate=e.matrixWorldNeedsUpdate,this.layers.mask=e.layers.mask,this.visible=e.visible,this.castShadow=e.castShadow,this.receiveShadow=e.receiveShadow,this.frustumCulled=e.frustumCulled,this.renderOrder=e.renderOrder,this.animations=e.animations.slice(),this.userData=JSON.parse(JSON.stringify(e.userData)),t===!0)for(let i=0;i<e.children.length;i++){const s=e.children[i];this.add(s.clone())}return this}}Nt.DEFAULT_UP=new O(0,1,0);Nt.DEFAULT_MATRIX_AUTO_UPDATE=!0;Nt.DEFAULT_MATRIX_WORLD_AUTO_UPDATE=!0;const En=new O,Hn=new O,za=new O,Vn=new O,ds=new O,hs=new O,Cd=new O,Ga=new O,Ha=new O,Va=new O,$a=new Mt,Wa=new Mt,Xa=new Mt;class vn{constructor(e=new O,t=new O,i=new O){this.a=e,this.b=t,this.c=i}static getNormal(e,t,i,s){s.subVectors(i,t),En.subVectors(e,t),s.cross(En);const r=s.lengthSq();return r>0?s.multiplyScalar(1/Math.sqrt(r)):s.set(0,0,0)}static getBarycoord(e,t,i,s,r){En.subVectors(s,t),Hn.subVectors(i,t),za.subVectors(e,t);const o=En.dot(En),a=En.dot(Hn),l=En.dot(za),c=Hn.dot(Hn),u=Hn.dot(za),d=o*c-a*a;if(d===0)return r.set(0,0,0),null;const h=1/d,p=(c*l-a*u)*h,g=(o*u-a*l)*h;return r.set(1-p-g,g,p)}static containsPoint(e,t,i,s){return this.getBarycoord(e,t,i,s,Vn)===null?!1:Vn.x>=0&&Vn.y>=0&&Vn.x+Vn.y<=1}static getInterpolation(e,t,i,s,r,o,a,l){return this.getBarycoord(e,t,i,s,Vn)===null?(l.x=0,l.y=0,"z"in l&&(l.z=0),"w"in l&&(l.w=0),null):(l.setScalar(0),l.addScaledVector(r,Vn.x),l.addScaledVector(o,Vn.y),l.addScaledVector(a,Vn.z),l)}static getInterpolatedAttribute(e,t,i,s,r,o){return $a.setScalar(0),Wa.setScalar(0),Xa.setScalar(0),$a.fromBufferAttribute(e,t),Wa.fromBufferAttribute(e,i),Xa.fromBufferAttribute(e,s),o.setScalar(0),o.addScaledVector($a,r.x),o.addScaledVector(Wa,r.y),o.addScaledVector(Xa,r.z),o}static isFrontFacing(e,t,i,s){return En.subVectors(i,t),Hn.subVectors(e,t),En.cross(Hn).dot(s)<0}set(e,t,i){return this.a.copy(e),this.b.copy(t),this.c.copy(i),this}setFromPointsAndIndices(e,t,i,s){return this.a.copy(e[t]),this.b.copy(e[i]),this.c.copy(e[s]),this}setFromAttributeAndIndices(e,t,i,s){return this.a.fromBufferAttribute(e,t),this.b.fromBufferAttribute(e,i),this.c.fromBufferAttribute(e,s),this}clone(){return new this.constructor().copy(this)}copy(e){return this.a.copy(e.a),this.b.copy(e.b),this.c.copy(e.c),this}getArea(){return En.subVectors(this.c,this.b),Hn.subVectors(this.a,this.b),En.cross(Hn).length()*.5}getMidpoint(e){return e.addVectors(this.a,this.b).add(this.c).multiplyScalar(1/3)}getNormal(e){return vn.getNormal(this.a,this.b,this.c,e)}getPlane(e){return e.setFromCoplanarPoints(this.a,this.b,this.c)}getBarycoord(e,t){return vn.getBarycoord(e,this.a,this.b,this.c,t)}getInterpolation(e,t,i,s,r){return vn.getInterpolation(e,this.a,this.b,this.c,t,i,s,r)}containsPoint(e){return vn.containsPoint(e,this.a,this.b,this.c)}isFrontFacing(e){return vn.isFrontFacing(this.a,this.b,this.c,e)}intersectsBox(e){return e.intersectsTriangle(this)}closestPointToPoint(e,t){const i=this.a,s=this.b,r=this.c;let o,a;ds.subVectors(s,i),hs.subVectors(r,i),Ga.subVectors(e,i);const l=ds.dot(Ga),c=hs.dot(Ga);if(l<=0&&c<=0)return t.copy(i);Ha.subVectors(e,s);const u=ds.dot(Ha),d=hs.dot(Ha);if(u>=0&&d<=u)return t.copy(s);const h=l*d-u*c;if(h<=0&&l>=0&&u<=0)return o=l/(l-u),t.copy(i).addScaledVector(ds,o);Va.subVectors(e,r);const p=ds.dot(Va),g=hs.dot(Va);if(g>=0&&p<=g)return t.copy(r);const v=p*c-l*g;if(v<=0&&c>=0&&g<=0)return a=c/(c-g),t.copy(i).addScaledVector(hs,a);const m=u*g-p*d;if(m<=0&&d-u>=0&&p-g>=0)return Cd.subVectors(r,s),a=(d-u)/(d-u+(p-g)),t.copy(s).addScaledVector(Cd,a);const f=1/(m+v+h);return o=v*f,a=h*f,t.copy(i).addScaledVector(ds,o).addScaledVector(hs,a)}equals(e){return e.a.equals(this.a)&&e.b.equals(this.b)&&e.c.equals(this.c)}}const sp={aliceblue:15792383,antiquewhite:16444375,aqua:65535,aquamarine:8388564,azure:15794175,beige:16119260,bisque:16770244,black:0,blanchedalmond:16772045,blue:255,blueviolet:9055202,brown:10824234,burlywood:14596231,cadetblue:6266528,chartreuse:8388352,chocolate:13789470,coral:16744272,cornflowerblue:6591981,cornsilk:16775388,crimson:14423100,cyan:65535,darkblue:139,darkcyan:35723,darkgoldenrod:12092939,darkgray:11119017,darkgreen:25600,darkgrey:11119017,darkkhaki:12433259,darkmagenta:9109643,darkolivegreen:5597999,darkorange:16747520,darkorchid:10040012,darkred:9109504,darksalmon:15308410,darkseagreen:9419919,darkslateblue:4734347,darkslategray:3100495,darkslategrey:3100495,darkturquoise:52945,darkviolet:9699539,deeppink:16716947,deepskyblue:49151,dimgray:6908265,dimgrey:6908265,dodgerblue:2003199,firebrick:11674146,floralwhite:16775920,forestgreen:2263842,fuchsia:16711935,gainsboro:14474460,ghostwhite:16316671,gold:16766720,goldenrod:14329120,gray:8421504,green:32768,greenyellow:11403055,grey:8421504,honeydew:15794160,hotpink:16738740,indianred:13458524,indigo:4915330,ivory:16777200,khaki:15787660,lavender:15132410,lavenderblush:16773365,lawngreen:8190976,lemonchiffon:16775885,lightblue:11393254,lightcoral:15761536,lightcyan:14745599,lightgoldenrodyellow:16448210,lightgray:13882323,lightgreen:9498256,lightgrey:13882323,lightpink:16758465,lightsalmon:16752762,lightseagreen:2142890,lightskyblue:8900346,lightslategray:7833753,lightslategrey:7833753,lightsteelblue:11584734,lightyellow:16777184,lime:65280,limegreen:3329330,linen:16445670,magenta:16711935,maroon:8388608,mediumaquamarine:6737322,mediumblue:205,mediumorchid:12211667,mediumpurple:9662683,mediumseagreen:3978097,mediumslateblue:8087790,mediumspringgreen:64154,mediumturquoise:4772300,mediumvioletred:13047173,midnightblue:1644912,mintcream:16121850,mistyrose:16770273,moccasin:16770229,navajowhite:16768685,navy:128,oldlace:16643558,olive:8421376,olivedrab:7048739,orange:16753920,orangered:16729344,orchid:14315734,palegoldenrod:15657130,palegreen:10025880,paleturquoise:11529966,palevioletred:14381203,papayawhip:16773077,peachpuff:16767673,peru:13468991,pink:16761035,plum:14524637,powderblue:11591910,purple:8388736,rebeccapurple:6697881,red:16711680,rosybrown:12357519,royalblue:4286945,saddlebrown:9127187,salmon:16416882,sandybrown:16032864,seagreen:3050327,seashell:16774638,sienna:10506797,silver:12632256,skyblue:8900331,slateblue:6970061,slategray:7372944,slategrey:7372944,snow:16775930,springgreen:65407,steelblue:4620980,tan:13808780,teal:32896,thistle:14204888,tomato:16737095,turquoise:4251856,violet:15631086,wheat:16113331,white:16777215,whitesmoke:16119285,yellow:16776960,yellowgreen:10145074},si={h:0,s:0,l:0},Kr={h:0,s:0,l:0};function Ya(n,e,t){return t<0&&(t+=1),t>1&&(t-=1),t<1/6?n+(e-n)*6*t:t<1/2?e:t<2/3?n+(e-n)*6*(2/3-t):n}class Pe{constructor(e,t,i){return this.isColor=!0,this.r=1,this.g=1,this.b=1,this.set(e,t,i)}set(e,t,i){if(t===void 0&&i===void 0){const s=e;s&&s.isColor?this.copy(s):typeof s=="number"?this.setHex(s):typeof s=="string"&&this.setStyle(s)}else this.setRGB(e,t,i);return this}setScalar(e){return this.r=e,this.g=e,this.b=e,this}setHex(e,t=gn){return e=Math.floor(e),this.r=(e>>16&255)/255,this.g=(e>>8&255)/255,this.b=(e&255)/255,it.colorSpaceToWorking(this,t),this}setRGB(e,t,i,s=it.workingColorSpace){return this.r=e,this.g=t,this.b=i,it.colorSpaceToWorking(this,s),this}setHSL(e,t,i,s=it.workingColorSpace){if(e=U_(e,1),t=Je(t,0,1),i=Je(i,0,1),t===0)this.r=this.g=this.b=i;else{const r=i<=.5?i*(1+t):i+t-i*t,o=2*i-r;this.r=Ya(o,r,e+1/3),this.g=Ya(o,r,e),this.b=Ya(o,r,e-1/3)}return it.colorSpaceToWorking(this,s),this}setStyle(e,t=gn){function i(r){r!==void 0&&parseFloat(r)<1&&console.warn("THREE.Color: Alpha component of "+e+" will be ignored.")}let s;if(s=/^(\w+)\(([^\)]*)\)/.exec(e)){let r;const o=s[1],a=s[2];switch(o){case"rgb":case"rgba":if(r=/^\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(a))return i(r[4]),this.setRGB(Math.min(255,parseInt(r[1],10))/255,Math.min(255,parseInt(r[2],10))/255,Math.min(255,parseInt(r[3],10))/255,t);if(r=/^\s*(\d+)\%\s*,\s*(\d+)\%\s*,\s*(\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(a))return i(r[4]),this.setRGB(Math.min(100,parseInt(r[1],10))/100,Math.min(100,parseInt(r[2],10))/100,Math.min(100,parseInt(r[3],10))/100,t);break;case"hsl":case"hsla":if(r=/^\s*(\d*\.?\d+)\s*,\s*(\d*\.?\d+)\%\s*,\s*(\d*\.?\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(a))return i(r[4]),this.setHSL(parseFloat(r[1])/360,parseFloat(r[2])/100,parseFloat(r[3])/100,t);break;default:console.warn("THREE.Color: Unknown color model "+e)}}else if(s=/^\#([A-Fa-f\d]+)$/.exec(e)){const r=s[1],o=r.length;if(o===3)return this.setRGB(parseInt(r.charAt(0),16)/15,parseInt(r.charAt(1),16)/15,parseInt(r.charAt(2),16)/15,t);if(o===6)return this.setHex(parseInt(r,16),t);console.warn("THREE.Color: Invalid hex color "+e)}else if(e&&e.length>0)return this.setColorName(e,t);return this}setColorName(e,t=gn){const i=sp[e.toLowerCase()];return i!==void 0?this.setHex(i,t):console.warn("THREE.Color: Unknown color "+e),this}clone(){return new this.constructor(this.r,this.g,this.b)}copy(e){return this.r=e.r,this.g=e.g,this.b=e.b,this}copySRGBToLinear(e){return this.r=Zn(e.r),this.g=Zn(e.g),this.b=Zn(e.b),this}copyLinearToSRGB(e){return this.r=Rs(e.r),this.g=Rs(e.g),this.b=Rs(e.b),this}convertSRGBToLinear(){return this.copySRGBToLinear(this),this}convertLinearToSRGB(){return this.copyLinearToSRGB(this),this}getHex(e=gn){return it.workingToColorSpace(kt.copy(this),e),Math.round(Je(kt.r*255,0,255))*65536+Math.round(Je(kt.g*255,0,255))*256+Math.round(Je(kt.b*255,0,255))}getHexString(e=gn){return("000000"+this.getHex(e).toString(16)).slice(-6)}getHSL(e,t=it.workingColorSpace){it.workingToColorSpace(kt.copy(this),t);const i=kt.r,s=kt.g,r=kt.b,o=Math.max(i,s,r),a=Math.min(i,s,r);let l,c;const u=(a+o)/2;if(a===o)l=0,c=0;else{const d=o-a;switch(c=u<=.5?d/(o+a):d/(2-o-a),o){case i:l=(s-r)/d+(s<r?6:0);break;case s:l=(r-i)/d+2;break;case r:l=(i-s)/d+4;break}l/=6}return e.h=l,e.s=c,e.l=u,e}getRGB(e,t=it.workingColorSpace){return it.workingToColorSpace(kt.copy(this),t),e.r=kt.r,e.g=kt.g,e.b=kt.b,e}getStyle(e=gn){it.workingToColorSpace(kt.copy(this),e);const t=kt.r,i=kt.g,s=kt.b;return e!==gn?`color(${e} ${t.toFixed(3)} ${i.toFixed(3)} ${s.toFixed(3)})`:`rgb(${Math.round(t*255)},${Math.round(i*255)},${Math.round(s*255)})`}offsetHSL(e,t,i){return this.getHSL(si),this.setHSL(si.h+e,si.s+t,si.l+i)}add(e){return this.r+=e.r,this.g+=e.g,this.b+=e.b,this}addColors(e,t){return this.r=e.r+t.r,this.g=e.g+t.g,this.b=e.b+t.b,this}addScalar(e){return this.r+=e,this.g+=e,this.b+=e,this}sub(e){return this.r=Math.max(0,this.r-e.r),this.g=Math.max(0,this.g-e.g),this.b=Math.max(0,this.b-e.b),this}multiply(e){return this.r*=e.r,this.g*=e.g,this.b*=e.b,this}multiplyScalar(e){return this.r*=e,this.g*=e,this.b*=e,this}lerp(e,t){return this.r+=(e.r-this.r)*t,this.g+=(e.g-this.g)*t,this.b+=(e.b-this.b)*t,this}lerpColors(e,t,i){return this.r=e.r+(t.r-e.r)*i,this.g=e.g+(t.g-e.g)*i,this.b=e.b+(t.b-e.b)*i,this}lerpHSL(e,t){this.getHSL(si),e.getHSL(Kr);const i=Ca(si.h,Kr.h,t),s=Ca(si.s,Kr.s,t),r=Ca(si.l,Kr.l,t);return this.setHSL(i,s,r),this}setFromVector3(e){return this.r=e.x,this.g=e.y,this.b=e.z,this}applyMatrix3(e){const t=this.r,i=this.g,s=this.b,r=e.elements;return this.r=r[0]*t+r[3]*i+r[6]*s,this.g=r[1]*t+r[4]*i+r[7]*s,this.b=r[2]*t+r[5]*i+r[8]*s,this}equals(e){return e.r===this.r&&e.g===this.g&&e.b===this.b}fromArray(e,t=0){return this.r=e[t],this.g=e[t+1],this.b=e[t+2],this}toArray(e=[],t=0){return e[t]=this.r,e[t+1]=this.g,e[t+2]=this.b,e}fromBufferAttribute(e,t){return this.r=e.getX(t),this.g=e.getY(t),this.b=e.getZ(t),this}toJSON(){return this.getHex()}*[Symbol.iterator](){yield this.r,yield this.g,yield this.b}}const kt=new Pe;Pe.NAMES=sp;let e0=0;class Ji extends ji{constructor(){super(),this.isMaterial=!0,Object.defineProperty(this,"id",{value:e0++}),this.uuid=Cr(),this.name="",this.type="Material",this.blending=Ts,this.side=wi,this.vertexColors=!1,this.opacity=1,this.transparent=!1,this.alphaHash=!1,this.blendSrc=El,this.blendDst=Tl,this.blendEquation=Ui,this.blendSrcAlpha=null,this.blendDstAlpha=null,this.blendEquationAlpha=null,this.blendColor=new Pe(0,0,0),this.blendAlpha=0,this.depthFunc=Is,this.depthTest=!0,this.depthWrite=!0,this.stencilWriteMask=255,this.stencilFunc=md,this.stencilRef=0,this.stencilFuncMask=255,this.stencilFail=is,this.stencilZFail=is,this.stencilZPass=is,this.stencilWrite=!1,this.clippingPlanes=null,this.clipIntersection=!1,this.clipShadows=!1,this.shadowSide=null,this.colorWrite=!0,this.precision=null,this.polygonOffset=!1,this.polygonOffsetFactor=0,this.polygonOffsetUnits=0,this.dithering=!1,this.alphaToCoverage=!1,this.premultipliedAlpha=!1,this.forceSinglePass=!1,this.allowOverride=!0,this.visible=!0,this.toneMapped=!0,this.userData={},this.version=0,this._alphaTest=0}get alphaTest(){return this._alphaTest}set alphaTest(e){this._alphaTest>0!=e>0&&this.version++,this._alphaTest=e}onBeforeRender(){}onBeforeCompile(){}customProgramCacheKey(){return this.onBeforeCompile.toString()}setValues(e){if(e!==void 0)for(const t in e){const i=e[t];if(i===void 0){console.warn(`THREE.Material: parameter '${t}' has value of undefined.`);continue}const s=this[t];if(s===void 0){console.warn(`THREE.Material: '${t}' is not a property of THREE.${this.type}.`);continue}s&&s.isColor?s.set(i):s&&s.isVector3&&i&&i.isVector3?s.copy(i):this[t]=i}}toJSON(e){const t=e===void 0||typeof e=="string";t&&(e={textures:{},images:{}});const i={metadata:{version:4.7,type:"Material",generator:"Material.toJSON"}};i.uuid=this.uuid,i.type=this.type,this.name!==""&&(i.name=this.name),this.color&&this.color.isColor&&(i.color=this.color.getHex()),this.roughness!==void 0&&(i.roughness=this.roughness),this.metalness!==void 0&&(i.metalness=this.metalness),this.sheen!==void 0&&(i.sheen=this.sheen),this.sheenColor&&this.sheenColor.isColor&&(i.sheenColor=this.sheenColor.getHex()),this.sheenRoughness!==void 0&&(i.sheenRoughness=this.sheenRoughness),this.emissive&&this.emissive.isColor&&(i.emissive=this.emissive.getHex()),this.emissiveIntensity!==void 0&&this.emissiveIntensity!==1&&(i.emissiveIntensity=this.emissiveIntensity),this.specular&&this.specular.isColor&&(i.specular=this.specular.getHex()),this.specularIntensity!==void 0&&(i.specularIntensity=this.specularIntensity),this.specularColor&&this.specularColor.isColor&&(i.specularColor=this.specularColor.getHex()),this.shininess!==void 0&&(i.shininess=this.shininess),this.clearcoat!==void 0&&(i.clearcoat=this.clearcoat),this.clearcoatRoughness!==void 0&&(i.clearcoatRoughness=this.clearcoatRoughness),this.clearcoatMap&&this.clearcoatMap.isTexture&&(i.clearcoatMap=this.clearcoatMap.toJSON(e).uuid),this.clearcoatRoughnessMap&&this.clearcoatRoughnessMap.isTexture&&(i.clearcoatRoughnessMap=this.clearcoatRoughnessMap.toJSON(e).uuid),this.clearcoatNormalMap&&this.clearcoatNormalMap.isTexture&&(i.clearcoatNormalMap=this.clearcoatNormalMap.toJSON(e).uuid,i.clearcoatNormalScale=this.clearcoatNormalScale.toArray()),this.dispersion!==void 0&&(i.dispersion=this.dispersion),this.iridescence!==void 0&&(i.iridescence=this.iridescence),this.iridescenceIOR!==void 0&&(i.iridescenceIOR=this.iridescenceIOR),this.iridescenceThicknessRange!==void 0&&(i.iridescenceThicknessRange=this.iridescenceThicknessRange),this.iridescenceMap&&this.iridescenceMap.isTexture&&(i.iridescenceMap=this.iridescenceMap.toJSON(e).uuid),this.iridescenceThicknessMap&&this.iridescenceThicknessMap.isTexture&&(i.iridescenceThicknessMap=this.iridescenceThicknessMap.toJSON(e).uuid),this.anisotropy!==void 0&&(i.anisotropy=this.anisotropy),this.anisotropyRotation!==void 0&&(i.anisotropyRotation=this.anisotropyRotation),this.anisotropyMap&&this.anisotropyMap.isTexture&&(i.anisotropyMap=this.anisotropyMap.toJSON(e).uuid),this.map&&this.map.isTexture&&(i.map=this.map.toJSON(e).uuid),this.matcap&&this.matcap.isTexture&&(i.matcap=this.matcap.toJSON(e).uuid),this.alphaMap&&this.alphaMap.isTexture&&(i.alphaMap=this.alphaMap.toJSON(e).uuid),this.lightMap&&this.lightMap.isTexture&&(i.lightMap=this.lightMap.toJSON(e).uuid,i.lightMapIntensity=this.lightMapIntensity),this.aoMap&&this.aoMap.isTexture&&(i.aoMap=this.aoMap.toJSON(e).uuid,i.aoMapIntensity=this.aoMapIntensity),this.bumpMap&&this.bumpMap.isTexture&&(i.bumpMap=this.bumpMap.toJSON(e).uuid,i.bumpScale=this.bumpScale),this.normalMap&&this.normalMap.isTexture&&(i.normalMap=this.normalMap.toJSON(e).uuid,i.normalMapType=this.normalMapType,i.normalScale=this.normalScale.toArray()),this.displacementMap&&this.displacementMap.isTexture&&(i.displacementMap=this.displacementMap.toJSON(e).uuid,i.displacementScale=this.displacementScale,i.displacementBias=this.displacementBias),this.roughnessMap&&this.roughnessMap.isTexture&&(i.roughnessMap=this.roughnessMap.toJSON(e).uuid),this.metalnessMap&&this.metalnessMap.isTexture&&(i.metalnessMap=this.metalnessMap.toJSON(e).uuid),this.emissiveMap&&this.emissiveMap.isTexture&&(i.emissiveMap=this.emissiveMap.toJSON(e).uuid),this.specularMap&&this.specularMap.isTexture&&(i.specularMap=this.specularMap.toJSON(e).uuid),this.specularIntensityMap&&this.specularIntensityMap.isTexture&&(i.specularIntensityMap=this.specularIntensityMap.toJSON(e).uuid),this.specularColorMap&&this.specularColorMap.isTexture&&(i.specularColorMap=this.specularColorMap.toJSON(e).uuid),this.envMap&&this.envMap.isTexture&&(i.envMap=this.envMap.toJSON(e).uuid,this.combine!==void 0&&(i.combine=this.combine)),this.envMapRotation!==void 0&&(i.envMapRotation=this.envMapRotation.toArray()),this.envMapIntensity!==void 0&&(i.envMapIntensity=this.envMapIntensity),this.reflectivity!==void 0&&(i.reflectivity=this.reflectivity),this.refractionRatio!==void 0&&(i.refractionRatio=this.refractionRatio),this.gradientMap&&this.gradientMap.isTexture&&(i.gradientMap=this.gradientMap.toJSON(e).uuid),this.transmission!==void 0&&(i.transmission=this.transmission),this.transmissionMap&&this.transmissionMap.isTexture&&(i.transmissionMap=this.transmissionMap.toJSON(e).uuid),this.thickness!==void 0&&(i.thickness=this.thickness),this.thicknessMap&&this.thicknessMap.isTexture&&(i.thicknessMap=this.thicknessMap.toJSON(e).uuid),this.attenuationDistance!==void 0&&this.attenuationDistance!==1/0&&(i.attenuationDistance=this.attenuationDistance),this.attenuationColor!==void 0&&(i.attenuationColor=this.attenuationColor.getHex()),this.size!==void 0&&(i.size=this.size),this.shadowSide!==null&&(i.shadowSide=this.shadowSide),this.sizeAttenuation!==void 0&&(i.sizeAttenuation=this.sizeAttenuation),this.blending!==Ts&&(i.blending=this.blending),this.side!==wi&&(i.side=this.side),this.vertexColors===!0&&(i.vertexColors=!0),this.opacity<1&&(i.opacity=this.opacity),this.transparent===!0&&(i.transparent=!0),this.blendSrc!==El&&(i.blendSrc=this.blendSrc),this.blendDst!==Tl&&(i.blendDst=this.blendDst),this.blendEquation!==Ui&&(i.blendEquation=this.blendEquation),this.blendSrcAlpha!==null&&(i.blendSrcAlpha=this.blendSrcAlpha),this.blendDstAlpha!==null&&(i.blendDstAlpha=this.blendDstAlpha),this.blendEquationAlpha!==null&&(i.blendEquationAlpha=this.blendEquationAlpha),this.blendColor&&this.blendColor.isColor&&(i.blendColor=this.blendColor.getHex()),this.blendAlpha!==0&&(i.blendAlpha=this.blendAlpha),this.depthFunc!==Is&&(i.depthFunc=this.depthFunc),this.depthTest===!1&&(i.depthTest=this.depthTest),this.depthWrite===!1&&(i.depthWrite=this.depthWrite),this.colorWrite===!1&&(i.colorWrite=this.colorWrite),this.stencilWriteMask!==255&&(i.stencilWriteMask=this.stencilWriteMask),this.stencilFunc!==md&&(i.stencilFunc=this.stencilFunc),this.stencilRef!==0&&(i.stencilRef=this.stencilRef),this.stencilFuncMask!==255&&(i.stencilFuncMask=this.stencilFuncMask),this.stencilFail!==is&&(i.stencilFail=this.stencilFail),this.stencilZFail!==is&&(i.stencilZFail=this.stencilZFail),this.stencilZPass!==is&&(i.stencilZPass=this.stencilZPass),this.stencilWrite===!0&&(i.stencilWrite=this.stencilWrite),this.rotation!==void 0&&this.rotation!==0&&(i.rotation=this.rotation),this.polygonOffset===!0&&(i.polygonOffset=!0),this.polygonOffsetFactor!==0&&(i.polygonOffsetFactor=this.polygonOffsetFactor),this.polygonOffsetUnits!==0&&(i.polygonOffsetUnits=this.polygonOffsetUnits),this.linewidth!==void 0&&this.linewidth!==1&&(i.linewidth=this.linewidth),this.dashSize!==void 0&&(i.dashSize=this.dashSize),this.gapSize!==void 0&&(i.gapSize=this.gapSize),this.scale!==void 0&&(i.scale=this.scale),this.dithering===!0&&(i.dithering=!0),this.alphaTest>0&&(i.alphaTest=this.alphaTest),this.alphaHash===!0&&(i.alphaHash=!0),this.alphaToCoverage===!0&&(i.alphaToCoverage=!0),this.premultipliedAlpha===!0&&(i.premultipliedAlpha=!0),this.forceSinglePass===!0&&(i.forceSinglePass=!0),this.wireframe===!0&&(i.wireframe=!0),this.wireframeLinewidth>1&&(i.wireframeLinewidth=this.wireframeLinewidth),this.wireframeLinecap!=="round"&&(i.wireframeLinecap=this.wireframeLinecap),this.wireframeLinejoin!=="round"&&(i.wireframeLinejoin=this.wireframeLinejoin),this.flatShading===!0&&(i.flatShading=!0),this.visible===!1&&(i.visible=!1),this.toneMapped===!1&&(i.toneMapped=!1),this.fog===!1&&(i.fog=!1),Object.keys(this.userData).length>0&&(i.userData=this.userData);function s(r){const o=[];for(const a in r){const l=r[a];delete l.metadata,o.push(l)}return o}if(t){const r=s(e.textures),o=s(e.images);r.length>0&&(i.textures=r),o.length>0&&(i.images=o)}return i}clone(){return new this.constructor().copy(this)}copy(e){this.name=e.name,this.blending=e.blending,this.side=e.side,this.vertexColors=e.vertexColors,this.opacity=e.opacity,this.transparent=e.transparent,this.blendSrc=e.blendSrc,this.blendDst=e.blendDst,this.blendEquation=e.blendEquation,this.blendSrcAlpha=e.blendSrcAlpha,this.blendDstAlpha=e.blendDstAlpha,this.blendEquationAlpha=e.blendEquationAlpha,this.blendColor.copy(e.blendColor),this.blendAlpha=e.blendAlpha,this.depthFunc=e.depthFunc,this.depthTest=e.depthTest,this.depthWrite=e.depthWrite,this.stencilWriteMask=e.stencilWriteMask,this.stencilFunc=e.stencilFunc,this.stencilRef=e.stencilRef,this.stencilFuncMask=e.stencilFuncMask,this.stencilFail=e.stencilFail,this.stencilZFail=e.stencilZFail,this.stencilZPass=e.stencilZPass,this.stencilWrite=e.stencilWrite;const t=e.clippingPlanes;let i=null;if(t!==null){const s=t.length;i=new Array(s);for(let r=0;r!==s;++r)i[r]=t[r].clone()}return this.clippingPlanes=i,this.clipIntersection=e.clipIntersection,this.clipShadows=e.clipShadows,this.shadowSide=e.shadowSide,this.colorWrite=e.colorWrite,this.precision=e.precision,this.polygonOffset=e.polygonOffset,this.polygonOffsetFactor=e.polygonOffsetFactor,this.polygonOffsetUnits=e.polygonOffsetUnits,this.dithering=e.dithering,this.alphaTest=e.alphaTest,this.alphaHash=e.alphaHash,this.alphaToCoverage=e.alphaToCoverage,this.premultipliedAlpha=e.premultipliedAlpha,this.forceSinglePass=e.forceSinglePass,this.visible=e.visible,this.toneMapped=e.toneMapped,this.userData=JSON.parse(JSON.stringify(e.userData)),this}dispose(){this.dispatchEvent({type:"dispose"})}set needsUpdate(e){e===!0&&this.version++}}class oa extends Ji{constructor(e){super(),this.isMeshBasicMaterial=!0,this.type="MeshBasicMaterial",this.color=new Pe(16777215),this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.specularMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new Fn,this.combine=Qc,this.reflectivity=1,this.refractionRatio=.98,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.lightMap=e.lightMap,this.lightMapIntensity=e.lightMapIntensity,this.aoMap=e.aoMap,this.aoMapIntensity=e.aoMapIntensity,this.specularMap=e.specularMap,this.alphaMap=e.alphaMap,this.envMap=e.envMap,this.envMapRotation.copy(e.envMapRotation),this.combine=e.combine,this.reflectivity=e.reflectivity,this.refractionRatio=e.refractionRatio,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.wireframeLinecap=e.wireframeLinecap,this.wireframeLinejoin=e.wireframeLinejoin,this.fog=e.fog,this}}const bt=new O,Zr=new Ve;let t0=0;class Ut{constructor(e,t,i=!1){if(Array.isArray(e))throw new TypeError("THREE.BufferAttribute: array should be a Typed Array.");this.isBufferAttribute=!0,Object.defineProperty(this,"id",{value:t0++}),this.name="",this.array=e,this.itemSize=t,this.count=e!==void 0?e.length/t:0,this.normalized=i,this.usage=gd,this.updateRanges=[],this.gpuType=Ln,this.version=0}onUploadCallback(){}set needsUpdate(e){e===!0&&this.version++}setUsage(e){return this.usage=e,this}addUpdateRange(e,t){this.updateRanges.push({start:e,count:t})}clearUpdateRanges(){this.updateRanges.length=0}copy(e){return this.name=e.name,this.array=new e.array.constructor(e.array),this.itemSize=e.itemSize,this.count=e.count,this.normalized=e.normalized,this.usage=e.usage,this.gpuType=e.gpuType,this}copyAt(e,t,i){e*=this.itemSize,i*=t.itemSize;for(let s=0,r=this.itemSize;s<r;s++)this.array[e+s]=t.array[i+s];return this}copyArray(e){return this.array.set(e),this}applyMatrix3(e){if(this.itemSize===2)for(let t=0,i=this.count;t<i;t++)Zr.fromBufferAttribute(this,t),Zr.applyMatrix3(e),this.setXY(t,Zr.x,Zr.y);else if(this.itemSize===3)for(let t=0,i=this.count;t<i;t++)bt.fromBufferAttribute(this,t),bt.applyMatrix3(e),this.setXYZ(t,bt.x,bt.y,bt.z);return this}applyMatrix4(e){for(let t=0,i=this.count;t<i;t++)bt.fromBufferAttribute(this,t),bt.applyMatrix4(e),this.setXYZ(t,bt.x,bt.y,bt.z);return this}applyNormalMatrix(e){for(let t=0,i=this.count;t<i;t++)bt.fromBufferAttribute(this,t),bt.applyNormalMatrix(e),this.setXYZ(t,bt.x,bt.y,bt.z);return this}transformDirection(e){for(let t=0,i=this.count;t<i;t++)bt.fromBufferAttribute(this,t),bt.transformDirection(e),this.setXYZ(t,bt.x,bt.y,bt.z);return this}set(e,t=0){return this.array.set(e,t),this}getComponent(e,t){let i=this.array[e*this.itemSize+t];return this.normalized&&(i=qs(i,this.array)),i}setComponent(e,t,i){return this.normalized&&(i=qt(i,this.array)),this.array[e*this.itemSize+t]=i,this}getX(e){let t=this.array[e*this.itemSize];return this.normalized&&(t=qs(t,this.array)),t}setX(e,t){return this.normalized&&(t=qt(t,this.array)),this.array[e*this.itemSize]=t,this}getY(e){let t=this.array[e*this.itemSize+1];return this.normalized&&(t=qs(t,this.array)),t}setY(e,t){return this.normalized&&(t=qt(t,this.array)),this.array[e*this.itemSize+1]=t,this}getZ(e){let t=this.array[e*this.itemSize+2];return this.normalized&&(t=qs(t,this.array)),t}setZ(e,t){return this.normalized&&(t=qt(t,this.array)),this.array[e*this.itemSize+2]=t,this}getW(e){let t=this.array[e*this.itemSize+3];return this.normalized&&(t=qs(t,this.array)),t}setW(e,t){return this.normalized&&(t=qt(t,this.array)),this.array[e*this.itemSize+3]=t,this}setXY(e,t,i){return e*=this.itemSize,this.normalized&&(t=qt(t,this.array),i=qt(i,this.array)),this.array[e+0]=t,this.array[e+1]=i,this}setXYZ(e,t,i,s){return e*=this.itemSize,this.normalized&&(t=qt(t,this.array),i=qt(i,this.array),s=qt(s,this.array)),this.array[e+0]=t,this.array[e+1]=i,this.array[e+2]=s,this}setXYZW(e,t,i,s,r){return e*=this.itemSize,this.normalized&&(t=qt(t,this.array),i=qt(i,this.array),s=qt(s,this.array),r=qt(r,this.array)),this.array[e+0]=t,this.array[e+1]=i,this.array[e+2]=s,this.array[e+3]=r,this}onUpload(e){return this.onUploadCallback=e,this}clone(){return new this.constructor(this.array,this.itemSize).copy(this)}toJSON(){const e={itemSize:this.itemSize,type:this.array.constructor.name,array:Array.from(this.array),normalized:this.normalized};return this.name!==""&&(e.name=this.name),this.usage!==gd&&(e.usage=this.usage),e}}class rp extends Ut{constructor(e,t,i){super(new Uint16Array(e),t,i)}}class op extends Ut{constructor(e,t,i){super(new Uint32Array(e),t,i)}}class cn extends Ut{constructor(e,t,i){super(new Float32Array(e),t,i)}}let n0=0;const pn=new rt,qa=new Nt,fs=new O,rn=new Ki,Js=new Ki,It=new O;class Ot extends ji{constructor(){super(),this.isBufferGeometry=!0,Object.defineProperty(this,"id",{value:n0++}),this.uuid=Cr(),this.name="",this.type="BufferGeometry",this.index=null,this.indirect=null,this.attributes={},this.morphAttributes={},this.morphTargetsRelative=!1,this.groups=[],this.boundingBox=null,this.boundingSphere=null,this.drawRange={start:0,count:1/0},this.userData={}}getIndex(){return this.index}setIndex(e){return Array.isArray(e)?this.index=new(np(e)?op:rp)(e,1):this.index=e,this}setIndirect(e){return this.indirect=e,this}getIndirect(){return this.indirect}getAttribute(e){return this.attributes[e]}setAttribute(e,t){return this.attributes[e]=t,this}deleteAttribute(e){return delete this.attributes[e],this}hasAttribute(e){return this.attributes[e]!==void 0}addGroup(e,t,i=0){this.groups.push({start:e,count:t,materialIndex:i})}clearGroups(){this.groups=[]}setDrawRange(e,t){this.drawRange.start=e,this.drawRange.count=t}applyMatrix4(e){const t=this.attributes.position;t!==void 0&&(t.applyMatrix4(e),t.needsUpdate=!0);const i=this.attributes.normal;if(i!==void 0){const r=new qe().getNormalMatrix(e);i.applyNormalMatrix(r),i.needsUpdate=!0}const s=this.attributes.tangent;return s!==void 0&&(s.transformDirection(e),s.needsUpdate=!0),this.boundingBox!==null&&this.computeBoundingBox(),this.boundingSphere!==null&&this.computeBoundingSphere(),this}applyQuaternion(e){return pn.makeRotationFromQuaternion(e),this.applyMatrix4(pn),this}rotateX(e){return pn.makeRotationX(e),this.applyMatrix4(pn),this}rotateY(e){return pn.makeRotationY(e),this.applyMatrix4(pn),this}rotateZ(e){return pn.makeRotationZ(e),this.applyMatrix4(pn),this}translate(e,t,i){return pn.makeTranslation(e,t,i),this.applyMatrix4(pn),this}scale(e,t,i){return pn.makeScale(e,t,i),this.applyMatrix4(pn),this}lookAt(e){return qa.lookAt(e),qa.updateMatrix(),this.applyMatrix4(qa.matrix),this}center(){return this.computeBoundingBox(),this.boundingBox.getCenter(fs).negate(),this.translate(fs.x,fs.y,fs.z),this}setFromPoints(e){const t=this.getAttribute("position");if(t===void 0){const i=[];for(let s=0,r=e.length;s<r;s++){const o=e[s];i.push(o.x,o.y,o.z||0)}this.setAttribute("position",new cn(i,3))}else{const i=Math.min(e.length,t.count);for(let s=0;s<i;s++){const r=e[s];t.setXYZ(s,r.x,r.y,r.z||0)}e.length>t.count&&console.warn("THREE.BufferGeometry: Buffer size too small for points data. Use .dispose() and create a new geometry."),t.needsUpdate=!0}return this}computeBoundingBox(){this.boundingBox===null&&(this.boundingBox=new Ki);const e=this.attributes.position,t=this.morphAttributes.position;if(e&&e.isGLBufferAttribute){console.error("THREE.BufferGeometry.computeBoundingBox(): GLBufferAttribute requires a manual bounding box.",this),this.boundingBox.set(new O(-1/0,-1/0,-1/0),new O(1/0,1/0,1/0));return}if(e!==void 0){if(this.boundingBox.setFromBufferAttribute(e),t)for(let i=0,s=t.length;i<s;i++){const r=t[i];rn.setFromBufferAttribute(r),this.morphTargetsRelative?(It.addVectors(this.boundingBox.min,rn.min),this.boundingBox.expandByPoint(It),It.addVectors(this.boundingBox.max,rn.max),this.boundingBox.expandByPoint(It)):(this.boundingBox.expandByPoint(rn.min),this.boundingBox.expandByPoint(rn.max))}}else this.boundingBox.makeEmpty();(isNaN(this.boundingBox.min.x)||isNaN(this.boundingBox.min.y)||isNaN(this.boundingBox.min.z))&&console.error('THREE.BufferGeometry.computeBoundingBox(): Computed min/max have NaN values. The "position" attribute is likely to have NaN values.',this)}computeBoundingSphere(){this.boundingSphere===null&&(this.boundingSphere=new Zi);const e=this.attributes.position,t=this.morphAttributes.position;if(e&&e.isGLBufferAttribute){console.error("THREE.BufferGeometry.computeBoundingSphere(): GLBufferAttribute requires a manual bounding sphere.",this),this.boundingSphere.set(new O,1/0);return}if(e){const i=this.boundingSphere.center;if(rn.setFromBufferAttribute(e),t)for(let r=0,o=t.length;r<o;r++){const a=t[r];Js.setFromBufferAttribute(a),this.morphTargetsRelative?(It.addVectors(rn.min,Js.min),rn.expandByPoint(It),It.addVectors(rn.max,Js.max),rn.expandByPoint(It)):(rn.expandByPoint(Js.min),rn.expandByPoint(Js.max))}rn.getCenter(i);let s=0;for(let r=0,o=e.count;r<o;r++)It.fromBufferAttribute(e,r),s=Math.max(s,i.distanceToSquared(It));if(t)for(let r=0,o=t.length;r<o;r++){const a=t[r],l=this.morphTargetsRelative;for(let c=0,u=a.count;c<u;c++)It.fromBufferAttribute(a,c),l&&(fs.fromBufferAttribute(e,c),It.add(fs)),s=Math.max(s,i.distanceToSquared(It))}this.boundingSphere.radius=Math.sqrt(s),isNaN(this.boundingSphere.radius)&&console.error('THREE.BufferGeometry.computeBoundingSphere(): Computed radius is NaN. The "position" attribute is likely to have NaN values.',this)}}computeTangents(){const e=this.index,t=this.attributes;if(e===null||t.position===void 0||t.normal===void 0||t.uv===void 0){console.error("THREE.BufferGeometry: .computeTangents() failed. Missing required attributes (index, position, normal or uv)");return}const i=t.position,s=t.normal,r=t.uv;this.hasAttribute("tangent")===!1&&this.setAttribute("tangent",new Ut(new Float32Array(4*i.count),4));const o=this.getAttribute("tangent"),a=[],l=[];for(let R=0;R<i.count;R++)a[R]=new O,l[R]=new O;const c=new O,u=new O,d=new O,h=new Ve,p=new Ve,g=new Ve,v=new O,m=new O;function f(R,w,S){c.fromBufferAttribute(i,R),u.fromBufferAttribute(i,w),d.fromBufferAttribute(i,S),h.fromBufferAttribute(r,R),p.fromBufferAttribute(r,w),g.fromBufferAttribute(r,S),u.sub(c),d.sub(c),p.sub(h),g.sub(h);const D=1/(p.x*g.y-g.x*p.y);isFinite(D)&&(v.copy(u).multiplyScalar(g.y).addScaledVector(d,-p.y).multiplyScalar(D),m.copy(d).multiplyScalar(p.x).addScaledVector(u,-g.x).multiplyScalar(D),a[R].add(v),a[w].add(v),a[S].add(v),l[R].add(m),l[w].add(m),l[S].add(m))}let T=this.groups;T.length===0&&(T=[{start:0,count:e.count}]);for(let R=0,w=T.length;R<w;++R){const S=T[R],D=S.start,$=S.count;for(let k=D,q=D+$;k<q;k+=3)f(e.getX(k+0),e.getX(k+1),e.getX(k+2))}const y=new O,M=new O,P=new O,E=new O;function A(R){P.fromBufferAttribute(s,R),E.copy(P);const w=a[R];y.copy(w),y.sub(P.multiplyScalar(P.dot(w))).normalize(),M.crossVectors(E,w);const D=M.dot(l[R])<0?-1:1;o.setXYZW(R,y.x,y.y,y.z,D)}for(let R=0,w=T.length;R<w;++R){const S=T[R],D=S.start,$=S.count;for(let k=D,q=D+$;k<q;k+=3)A(e.getX(k+0)),A(e.getX(k+1)),A(e.getX(k+2))}}computeVertexNormals(){const e=this.index,t=this.getAttribute("position");if(t!==void 0){let i=this.getAttribute("normal");if(i===void 0)i=new Ut(new Float32Array(t.count*3),3),this.setAttribute("normal",i);else for(let h=0,p=i.count;h<p;h++)i.setXYZ(h,0,0,0);const s=new O,r=new O,o=new O,a=new O,l=new O,c=new O,u=new O,d=new O;if(e)for(let h=0,p=e.count;h<p;h+=3){const g=e.getX(h+0),v=e.getX(h+1),m=e.getX(h+2);s.fromBufferAttribute(t,g),r.fromBufferAttribute(t,v),o.fromBufferAttribute(t,m),u.subVectors(o,r),d.subVectors(s,r),u.cross(d),a.fromBufferAttribute(i,g),l.fromBufferAttribute(i,v),c.fromBufferAttribute(i,m),a.add(u),l.add(u),c.add(u),i.setXYZ(g,a.x,a.y,a.z),i.setXYZ(v,l.x,l.y,l.z),i.setXYZ(m,c.x,c.y,c.z)}else for(let h=0,p=t.count;h<p;h+=3)s.fromBufferAttribute(t,h+0),r.fromBufferAttribute(t,h+1),o.fromBufferAttribute(t,h+2),u.subVectors(o,r),d.subVectors(s,r),u.cross(d),i.setXYZ(h+0,u.x,u.y,u.z),i.setXYZ(h+1,u.x,u.y,u.z),i.setXYZ(h+2,u.x,u.y,u.z);this.normalizeNormals(),i.needsUpdate=!0}}normalizeNormals(){const e=this.attributes.normal;for(let t=0,i=e.count;t<i;t++)It.fromBufferAttribute(e,t),It.normalize(),e.setXYZ(t,It.x,It.y,It.z)}toNonIndexed(){function e(a,l){const c=a.array,u=a.itemSize,d=a.normalized,h=new c.constructor(l.length*u);let p=0,g=0;for(let v=0,m=l.length;v<m;v++){a.isInterleavedBufferAttribute?p=l[v]*a.data.stride+a.offset:p=l[v]*u;for(let f=0;f<u;f++)h[g++]=c[p++]}return new Ut(h,u,d)}if(this.index===null)return console.warn("THREE.BufferGeometry.toNonIndexed(): BufferGeometry is already non-indexed."),this;const t=new Ot,i=this.index.array,s=this.attributes;for(const a in s){const l=s[a],c=e(l,i);t.setAttribute(a,c)}const r=this.morphAttributes;for(const a in r){const l=[],c=r[a];for(let u=0,d=c.length;u<d;u++){const h=c[u],p=e(h,i);l.push(p)}t.morphAttributes[a]=l}t.morphTargetsRelative=this.morphTargetsRelative;const o=this.groups;for(let a=0,l=o.length;a<l;a++){const c=o[a];t.addGroup(c.start,c.count,c.materialIndex)}return t}toJSON(){const e={metadata:{version:4.7,type:"BufferGeometry",generator:"BufferGeometry.toJSON"}};if(e.uuid=this.uuid,e.type=this.type,this.name!==""&&(e.name=this.name),Object.keys(this.userData).length>0&&(e.userData=this.userData),this.parameters!==void 0){const l=this.parameters;for(const c in l)l[c]!==void 0&&(e[c]=l[c]);return e}e.data={attributes:{}};const t=this.index;t!==null&&(e.data.index={type:t.array.constructor.name,array:Array.prototype.slice.call(t.array)});const i=this.attributes;for(const l in i){const c=i[l];e.data.attributes[l]=c.toJSON(e.data)}const s={};let r=!1;for(const l in this.morphAttributes){const c=this.morphAttributes[l],u=[];for(let d=0,h=c.length;d<h;d++){const p=c[d];u.push(p.toJSON(e.data))}u.length>0&&(s[l]=u,r=!0)}r&&(e.data.morphAttributes=s,e.data.morphTargetsRelative=this.morphTargetsRelative);const o=this.groups;o.length>0&&(e.data.groups=JSON.parse(JSON.stringify(o)));const a=this.boundingSphere;return a!==null&&(e.data.boundingSphere=a.toJSON()),e}clone(){return new this.constructor().copy(this)}copy(e){this.index=null,this.attributes={},this.morphAttributes={},this.groups=[],this.boundingBox=null,this.boundingSphere=null;const t={};this.name=e.name;const i=e.index;i!==null&&this.setIndex(i.clone());const s=e.attributes;for(const c in s){const u=s[c];this.setAttribute(c,u.clone(t))}const r=e.morphAttributes;for(const c in r){const u=[],d=r[c];for(let h=0,p=d.length;h<p;h++)u.push(d[h].clone(t));this.morphAttributes[c]=u}this.morphTargetsRelative=e.morphTargetsRelative;const o=e.groups;for(let c=0,u=o.length;c<u;c++){const d=o[c];this.addGroup(d.start,d.count,d.materialIndex)}const a=e.boundingBox;a!==null&&(this.boundingBox=a.clone());const l=e.boundingSphere;return l!==null&&(this.boundingSphere=l.clone()),this.drawRange.start=e.drawRange.start,this.drawRange.count=e.drawRange.count,this.userData=e.userData,this}dispose(){this.dispatchEvent({type:"dispose"})}}const Pd=new rt,Pi=new Pr,Jr=new Zi,Ld=new O,Qr=new O,eo=new O,to=new O,ja=new O,no=new O,Dd=new O,io=new O;class xn extends Nt{constructor(e=new Ot,t=new oa){super(),this.isMesh=!0,this.type="Mesh",this.geometry=e,this.material=t,this.morphTargetDictionary=void 0,this.morphTargetInfluences=void 0,this.count=1,this.updateMorphTargets()}copy(e,t){return super.copy(e,t),e.morphTargetInfluences!==void 0&&(this.morphTargetInfluences=e.morphTargetInfluences.slice()),e.morphTargetDictionary!==void 0&&(this.morphTargetDictionary=Object.assign({},e.morphTargetDictionary)),this.material=Array.isArray(e.material)?e.material.slice():e.material,this.geometry=e.geometry,this}updateMorphTargets(){const t=this.geometry.morphAttributes,i=Object.keys(t);if(i.length>0){const s=t[i[0]];if(s!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let r=0,o=s.length;r<o;r++){const a=s[r].name||String(r);this.morphTargetInfluences.push(0),this.morphTargetDictionary[a]=r}}}}getVertexPosition(e,t){const i=this.geometry,s=i.attributes.position,r=i.morphAttributes.position,o=i.morphTargetsRelative;t.fromBufferAttribute(s,e);const a=this.morphTargetInfluences;if(r&&a){no.set(0,0,0);for(let l=0,c=r.length;l<c;l++){const u=a[l],d=r[l];u!==0&&(ja.fromBufferAttribute(d,e),o?no.addScaledVector(ja,u):no.addScaledVector(ja.sub(t),u))}t.add(no)}return t}raycast(e,t){const i=this.geometry,s=this.material,r=this.matrixWorld;s!==void 0&&(i.boundingSphere===null&&i.computeBoundingSphere(),Jr.copy(i.boundingSphere),Jr.applyMatrix4(r),Pi.copy(e.ray).recast(e.near),!(Jr.containsPoint(Pi.origin)===!1&&(Pi.intersectSphere(Jr,Ld)===null||Pi.origin.distanceToSquared(Ld)>(e.far-e.near)**2))&&(Pd.copy(r).invert(),Pi.copy(e.ray).applyMatrix4(Pd),!(i.boundingBox!==null&&Pi.intersectsBox(i.boundingBox)===!1)&&this._computeIntersections(e,t,Pi)))}_computeIntersections(e,t,i){let s;const r=this.geometry,o=this.material,a=r.index,l=r.attributes.position,c=r.attributes.uv,u=r.attributes.uv1,d=r.attributes.normal,h=r.groups,p=r.drawRange;if(a!==null)if(Array.isArray(o))for(let g=0,v=h.length;g<v;g++){const m=h[g],f=o[m.materialIndex],T=Math.max(m.start,p.start),y=Math.min(a.count,Math.min(m.start+m.count,p.start+p.count));for(let M=T,P=y;M<P;M+=3){const E=a.getX(M),A=a.getX(M+1),R=a.getX(M+2);s=so(this,f,e,i,c,u,d,E,A,R),s&&(s.faceIndex=Math.floor(M/3),s.face.materialIndex=m.materialIndex,t.push(s))}}else{const g=Math.max(0,p.start),v=Math.min(a.count,p.start+p.count);for(let m=g,f=v;m<f;m+=3){const T=a.getX(m),y=a.getX(m+1),M=a.getX(m+2);s=so(this,o,e,i,c,u,d,T,y,M),s&&(s.faceIndex=Math.floor(m/3),t.push(s))}}else if(l!==void 0)if(Array.isArray(o))for(let g=0,v=h.length;g<v;g++){const m=h[g],f=o[m.materialIndex],T=Math.max(m.start,p.start),y=Math.min(l.count,Math.min(m.start+m.count,p.start+p.count));for(let M=T,P=y;M<P;M+=3){const E=M,A=M+1,R=M+2;s=so(this,f,e,i,c,u,d,E,A,R),s&&(s.faceIndex=Math.floor(M/3),s.face.materialIndex=m.materialIndex,t.push(s))}}else{const g=Math.max(0,p.start),v=Math.min(l.count,p.start+p.count);for(let m=g,f=v;m<f;m+=3){const T=m,y=m+1,M=m+2;s=so(this,o,e,i,c,u,d,T,y,M),s&&(s.faceIndex=Math.floor(m/3),t.push(s))}}}}function i0(n,e,t,i,s,r,o,a){let l;if(e.side===Jt?l=i.intersectTriangle(o,r,s,!0,a):l=i.intersectTriangle(s,r,o,e.side===wi,a),l===null)return null;io.copy(a),io.applyMatrix4(n.matrixWorld);const c=t.ray.origin.distanceTo(io);return c<t.near||c>t.far?null:{distance:c,point:io.clone(),object:n}}function so(n,e,t,i,s,r,o,a,l,c){n.getVertexPosition(a,Qr),n.getVertexPosition(l,eo),n.getVertexPosition(c,to);const u=i0(n,e,t,i,Qr,eo,to,Dd);if(u){const d=new O;vn.getBarycoord(Dd,Qr,eo,to,d),s&&(u.uv=vn.getInterpolatedAttribute(s,a,l,c,d,new Ve)),r&&(u.uv1=vn.getInterpolatedAttribute(r,a,l,c,d,new Ve)),o&&(u.normal=vn.getInterpolatedAttribute(o,a,l,c,d,new O),u.normal.dot(i.direction)>0&&u.normal.multiplyScalar(-1));const h={a,b:l,c,normal:new O,materialIndex:0};vn.getNormal(Qr,eo,to,h.normal),u.face=h,u.barycoord=d}return u}class an extends Ot{constructor(e=1,t=1,i=1,s=1,r=1,o=1){super(),this.type="BoxGeometry",this.parameters={width:e,height:t,depth:i,widthSegments:s,heightSegments:r,depthSegments:o};const a=this;s=Math.floor(s),r=Math.floor(r),o=Math.floor(o);const l=[],c=[],u=[],d=[];let h=0,p=0;g("z","y","x",-1,-1,i,t,e,o,r,0),g("z","y","x",1,-1,i,t,-e,o,r,1),g("x","z","y",1,1,e,i,t,s,o,2),g("x","z","y",1,-1,e,i,-t,s,o,3),g("x","y","z",1,-1,e,t,i,s,r,4),g("x","y","z",-1,-1,e,t,-i,s,r,5),this.setIndex(l),this.setAttribute("position",new cn(c,3)),this.setAttribute("normal",new cn(u,3)),this.setAttribute("uv",new cn(d,2));function g(v,m,f,T,y,M,P,E,A,R,w){const S=M/A,D=P/R,$=M/2,k=P/2,q=E/2,Z=A+1,V=R+1;let se=0,H=0;const ae=new O;for(let ge=0;ge<V;ge++){const Te=ge*D-k;for(let $e=0;$e<Z;$e++){const je=$e*S-$;ae[v]=je*T,ae[m]=Te*y,ae[f]=q,c.push(ae.x,ae.y,ae.z),ae[v]=0,ae[m]=0,ae[f]=E>0?1:-1,u.push(ae.x,ae.y,ae.z),d.push($e/A),d.push(1-ge/R),se+=1}}for(let ge=0;ge<R;ge++)for(let Te=0;Te<A;Te++){const $e=h+Te+Z*ge,je=h+Te+Z*(ge+1),X=h+(Te+1)+Z*(ge+1),le=h+(Te+1)+Z*ge;l.push($e,je,le),l.push(je,X,le),H+=6}a.addGroup(p,H,w),p+=H,h+=se}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new an(e.width,e.height,e.depth,e.widthSegments,e.heightSegments,e.depthSegments)}}function Os(n){const e={};for(const t in n){e[t]={};for(const i in n[t]){const s=n[t][i];s&&(s.isColor||s.isMatrix3||s.isMatrix4||s.isVector2||s.isVector3||s.isVector4||s.isTexture||s.isQuaternion)?s.isRenderTargetTexture?(console.warn("UniformsUtils: Textures of render targets cannot be cloned via cloneUniforms() or mergeUniforms()."),e[t][i]=null):e[t][i]=s.clone():Array.isArray(s)?e[t][i]=s.slice():e[t][i]=s}}return e}function Ht(n){const e={};for(let t=0;t<n.length;t++){const i=Os(n[t]);for(const s in i)e[s]=i[s]}return e}function s0(n){const e=[];for(let t=0;t<n.length;t++)e.push(n[t].clone());return e}function ap(n){const e=n.getRenderTarget();return e===null?n.outputColorSpace:e.isXRRenderTarget===!0?e.texture.colorSpace:it.workingColorSpace}const r0={clone:Os,merge:Ht};var o0=`void main() {
	gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
}`,a0=`void main() {
	gl_FragColor = vec4( 1.0, 0.0, 0.0, 1.0 );
}`;class bi extends Ji{constructor(e){super(),this.isShaderMaterial=!0,this.type="ShaderMaterial",this.defines={},this.uniforms={},this.uniformsGroups=[],this.vertexShader=o0,this.fragmentShader=a0,this.linewidth=1,this.wireframe=!1,this.wireframeLinewidth=1,this.fog=!1,this.lights=!1,this.clipping=!1,this.forceSinglePass=!0,this.extensions={clipCullDistance:!1,multiDraw:!1},this.defaultAttributeValues={color:[1,1,1],uv:[0,0],uv1:[0,0]},this.index0AttributeName=void 0,this.uniformsNeedUpdate=!1,this.glslVersion=null,e!==void 0&&this.setValues(e)}copy(e){return super.copy(e),this.fragmentShader=e.fragmentShader,this.vertexShader=e.vertexShader,this.uniforms=Os(e.uniforms),this.uniformsGroups=s0(e.uniformsGroups),this.defines=Object.assign({},e.defines),this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.fog=e.fog,this.lights=e.lights,this.clipping=e.clipping,this.extensions=Object.assign({},e.extensions),this.glslVersion=e.glslVersion,this}toJSON(e){const t=super.toJSON(e);t.glslVersion=this.glslVersion,t.uniforms={};for(const s in this.uniforms){const o=this.uniforms[s].value;o&&o.isTexture?t.uniforms[s]={type:"t",value:o.toJSON(e).uuid}:o&&o.isColor?t.uniforms[s]={type:"c",value:o.getHex()}:o&&o.isVector2?t.uniforms[s]={type:"v2",value:o.toArray()}:o&&o.isVector3?t.uniforms[s]={type:"v3",value:o.toArray()}:o&&o.isVector4?t.uniforms[s]={type:"v4",value:o.toArray()}:o&&o.isMatrix3?t.uniforms[s]={type:"m3",value:o.toArray()}:o&&o.isMatrix4?t.uniforms[s]={type:"m4",value:o.toArray()}:t.uniforms[s]={value:o}}Object.keys(this.defines).length>0&&(t.defines=this.defines),t.vertexShader=this.vertexShader,t.fragmentShader=this.fragmentShader,t.lights=this.lights,t.clipping=this.clipping;const i={};for(const s in this.extensions)this.extensions[s]===!0&&(i[s]=!0);return Object.keys(i).length>0&&(t.extensions=i),t}}class lp extends Nt{constructor(){super(),this.isCamera=!0,this.type="Camera",this.matrixWorldInverse=new rt,this.projectionMatrix=new rt,this.projectionMatrixInverse=new rt,this.coordinateSystem=Kn}copy(e,t){return super.copy(e,t),this.matrixWorldInverse.copy(e.matrixWorldInverse),this.projectionMatrix.copy(e.projectionMatrix),this.projectionMatrixInverse.copy(e.projectionMatrixInverse),this.coordinateSystem=e.coordinateSystem,this}getWorldDirection(e){return super.getWorldDirection(e).negate()}updateMatrixWorld(e){super.updateMatrixWorld(e),this.matrixWorldInverse.copy(this.matrixWorld).invert()}updateWorldMatrix(e,t){super.updateWorldMatrix(e,t),this.matrixWorldInverse.copy(this.matrixWorld).invert()}clone(){return new this.constructor().copy(this)}}const ri=new O,Id=new Ve,Nd=new Ve;class on extends lp{constructor(e=50,t=1,i=.1,s=2e3){super(),this.isPerspectiveCamera=!0,this.type="PerspectiveCamera",this.fov=e,this.zoom=1,this.near=i,this.far=s,this.focus=10,this.aspect=t,this.view=null,this.filmGauge=35,this.filmOffset=0,this.updateProjectionMatrix()}copy(e,t){return super.copy(e,t),this.fov=e.fov,this.zoom=e.zoom,this.near=e.near,this.far=e.far,this.focus=e.focus,this.aspect=e.aspect,this.view=e.view===null?null:Object.assign({},e.view),this.filmGauge=e.filmGauge,this.filmOffset=e.filmOffset,this}setFocalLength(e){const t=.5*this.getFilmHeight()/e;this.fov=uc*2*Math.atan(t),this.updateProjectionMatrix()}getFocalLength(){const e=Math.tan(dr*.5*this.fov);return .5*this.getFilmHeight()/e}getEffectiveFOV(){return uc*2*Math.atan(Math.tan(dr*.5*this.fov)/this.zoom)}getFilmWidth(){return this.filmGauge*Math.min(this.aspect,1)}getFilmHeight(){return this.filmGauge/Math.max(this.aspect,1)}getViewBounds(e,t,i){ri.set(-1,-1,.5).applyMatrix4(this.projectionMatrixInverse),t.set(ri.x,ri.y).multiplyScalar(-e/ri.z),ri.set(1,1,.5).applyMatrix4(this.projectionMatrixInverse),i.set(ri.x,ri.y).multiplyScalar(-e/ri.z)}getViewSize(e,t){return this.getViewBounds(e,Id,Nd),t.subVectors(Nd,Id)}setViewOffset(e,t,i,s,r,o){this.aspect=e/t,this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=e,this.view.fullHeight=t,this.view.offsetX=i,this.view.offsetY=s,this.view.width=r,this.view.height=o,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){const e=this.near;let t=e*Math.tan(dr*.5*this.fov)/this.zoom,i=2*t,s=this.aspect*i,r=-.5*s;const o=this.view;if(this.view!==null&&this.view.enabled){const l=o.fullWidth,c=o.fullHeight;r+=o.offsetX*s/l,t-=o.offsetY*i/c,s*=o.width/l,i*=o.height/c}const a=this.filmOffset;a!==0&&(r+=e*a/this.getFilmWidth()),this.projectionMatrix.makePerspective(r,r+s,t,t-i,e,this.far,this.coordinateSystem),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(e){const t=super.toJSON(e);return t.object.fov=this.fov,t.object.zoom=this.zoom,t.object.near=this.near,t.object.far=this.far,t.object.focus=this.focus,t.object.aspect=this.aspect,this.view!==null&&(t.object.view=Object.assign({},this.view)),t.object.filmGauge=this.filmGauge,t.object.filmOffset=this.filmOffset,t}}const ps=-90,ms=1;class l0 extends Nt{constructor(e,t,i){super(),this.type="CubeCamera",this.renderTarget=i,this.coordinateSystem=null,this.activeMipmapLevel=0;const s=new on(ps,ms,e,t);s.layers=this.layers,this.add(s);const r=new on(ps,ms,e,t);r.layers=this.layers,this.add(r);const o=new on(ps,ms,e,t);o.layers=this.layers,this.add(o);const a=new on(ps,ms,e,t);a.layers=this.layers,this.add(a);const l=new on(ps,ms,e,t);l.layers=this.layers,this.add(l);const c=new on(ps,ms,e,t);c.layers=this.layers,this.add(c)}updateCoordinateSystem(){const e=this.coordinateSystem,t=this.children.concat(),[i,s,r,o,a,l]=t;for(const c of t)this.remove(c);if(e===Kn)i.up.set(0,1,0),i.lookAt(1,0,0),s.up.set(0,1,0),s.lookAt(-1,0,0),r.up.set(0,0,-1),r.lookAt(0,1,0),o.up.set(0,0,1),o.lookAt(0,-1,0),a.up.set(0,1,0),a.lookAt(0,0,1),l.up.set(0,1,0),l.lookAt(0,0,-1);else if(e===$o)i.up.set(0,-1,0),i.lookAt(-1,0,0),s.up.set(0,-1,0),s.lookAt(1,0,0),r.up.set(0,0,1),r.lookAt(0,1,0),o.up.set(0,0,-1),o.lookAt(0,-1,0),a.up.set(0,-1,0),a.lookAt(0,0,1),l.up.set(0,-1,0),l.lookAt(0,0,-1);else throw new Error("THREE.CubeCamera.updateCoordinateSystem(): Invalid coordinate system: "+e);for(const c of t)this.add(c),c.updateMatrixWorld()}update(e,t){this.parent===null&&this.updateMatrixWorld();const{renderTarget:i,activeMipmapLevel:s}=this;this.coordinateSystem!==e.coordinateSystem&&(this.coordinateSystem=e.coordinateSystem,this.updateCoordinateSystem());const[r,o,a,l,c,u]=this.children,d=e.getRenderTarget(),h=e.getActiveCubeFace(),p=e.getActiveMipmapLevel(),g=e.xr.enabled;e.xr.enabled=!1;const v=i.texture.generateMipmaps;i.texture.generateMipmaps=!1,e.setRenderTarget(i,0,s),e.render(t,r),e.setRenderTarget(i,1,s),e.render(t,o),e.setRenderTarget(i,2,s),e.render(t,a),e.setRenderTarget(i,3,s),e.render(t,l),e.setRenderTarget(i,4,s),e.render(t,c),i.texture.generateMipmaps=v,e.setRenderTarget(i,5,s),e.render(t,u),e.setRenderTarget(d,h,p),e.xr.enabled=g,i.texture.needsPMREMUpdate=!0}}class cp extends Wt{constructor(e=[],t=Ns,i,s,r,o,a,l,c,u){super(e,t,i,s,r,o,a,l,c,u),this.isCubeTexture=!0,this.flipY=!1}get images(){return this.image}set images(e){this.image=e}}class c0 extends Wi{constructor(e=1,t={}){super(e,e,t),this.isWebGLCubeRenderTarget=!0;const i={width:e,height:e,depth:1},s=[i,i,i,i,i,i];this.texture=new cp(s),this._setTextureOptions(t),this.texture.isRenderTargetTexture=!0}fromEquirectangularTexture(e,t){this.texture.type=t.type,this.texture.colorSpace=t.colorSpace,this.texture.generateMipmaps=t.generateMipmaps,this.texture.minFilter=t.minFilter,this.texture.magFilter=t.magFilter;const i={uniforms:{tEquirect:{value:null}},vertexShader:`

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
			`},s=new an(5,5,5),r=new bi({name:"CubemapFromEquirect",uniforms:Os(i.uniforms),vertexShader:i.vertexShader,fragmentShader:i.fragmentShader,side:Jt,blending:xi});r.uniforms.tEquirect.value=t;const o=new xn(s,r),a=t.minFilter;return t.minFilter===ki&&(t.minFilter=Pn),new l0(1,10,this).update(e,o),t.minFilter=a,o.geometry.dispose(),o.material.dispose(),this}clear(e,t=!0,i=!0,s=!0){const r=e.getRenderTarget();for(let o=0;o<6;o++)e.setRenderTarget(this,o),e.clear(t,i,s);e.setRenderTarget(r)}}class mi extends Nt{constructor(){super(),this.isGroup=!0,this.type="Group"}}const u0={type:"move"};class Ka{constructor(){this._targetRay=null,this._grip=null,this._hand=null}getHandSpace(){return this._hand===null&&(this._hand=new mi,this._hand.matrixAutoUpdate=!1,this._hand.visible=!1,this._hand.joints={},this._hand.inputState={pinching:!1}),this._hand}getTargetRaySpace(){return this._targetRay===null&&(this._targetRay=new mi,this._targetRay.matrixAutoUpdate=!1,this._targetRay.visible=!1,this._targetRay.hasLinearVelocity=!1,this._targetRay.linearVelocity=new O,this._targetRay.hasAngularVelocity=!1,this._targetRay.angularVelocity=new O),this._targetRay}getGripSpace(){return this._grip===null&&(this._grip=new mi,this._grip.matrixAutoUpdate=!1,this._grip.visible=!1,this._grip.hasLinearVelocity=!1,this._grip.linearVelocity=new O,this._grip.hasAngularVelocity=!1,this._grip.angularVelocity=new O),this._grip}dispatchEvent(e){return this._targetRay!==null&&this._targetRay.dispatchEvent(e),this._grip!==null&&this._grip.dispatchEvent(e),this._hand!==null&&this._hand.dispatchEvent(e),this}connect(e){if(e&&e.hand){const t=this._hand;if(t)for(const i of e.hand.values())this._getHandJoint(t,i)}return this.dispatchEvent({type:"connected",data:e}),this}disconnect(e){return this.dispatchEvent({type:"disconnected",data:e}),this._targetRay!==null&&(this._targetRay.visible=!1),this._grip!==null&&(this._grip.visible=!1),this._hand!==null&&(this._hand.visible=!1),this}update(e,t,i){let s=null,r=null,o=null;const a=this._targetRay,l=this._grip,c=this._hand;if(e&&t.session.visibilityState!=="visible-blurred"){if(c&&e.hand){o=!0;for(const v of e.hand.values()){const m=t.getJointPose(v,i),f=this._getHandJoint(c,v);m!==null&&(f.matrix.fromArray(m.transform.matrix),f.matrix.decompose(f.position,f.rotation,f.scale),f.matrixWorldNeedsUpdate=!0,f.jointRadius=m.radius),f.visible=m!==null}const u=c.joints["index-finger-tip"],d=c.joints["thumb-tip"],h=u.position.distanceTo(d.position),p=.02,g=.005;c.inputState.pinching&&h>p+g?(c.inputState.pinching=!1,this.dispatchEvent({type:"pinchend",handedness:e.handedness,target:this})):!c.inputState.pinching&&h<=p-g&&(c.inputState.pinching=!0,this.dispatchEvent({type:"pinchstart",handedness:e.handedness,target:this}))}else l!==null&&e.gripSpace&&(r=t.getPose(e.gripSpace,i),r!==null&&(l.matrix.fromArray(r.transform.matrix),l.matrix.decompose(l.position,l.rotation,l.scale),l.matrixWorldNeedsUpdate=!0,r.linearVelocity?(l.hasLinearVelocity=!0,l.linearVelocity.copy(r.linearVelocity)):l.hasLinearVelocity=!1,r.angularVelocity?(l.hasAngularVelocity=!0,l.angularVelocity.copy(r.angularVelocity)):l.hasAngularVelocity=!1));a!==null&&(s=t.getPose(e.targetRaySpace,i),s===null&&r!==null&&(s=r),s!==null&&(a.matrix.fromArray(s.transform.matrix),a.matrix.decompose(a.position,a.rotation,a.scale),a.matrixWorldNeedsUpdate=!0,s.linearVelocity?(a.hasLinearVelocity=!0,a.linearVelocity.copy(s.linearVelocity)):a.hasLinearVelocity=!1,s.angularVelocity?(a.hasAngularVelocity=!0,a.angularVelocity.copy(s.angularVelocity)):a.hasAngularVelocity=!1,this.dispatchEvent(u0)))}return a!==null&&(a.visible=s!==null),l!==null&&(l.visible=r!==null),c!==null&&(c.visible=o!==null),this}_getHandJoint(e,t){if(e.joints[t.jointName]===void 0){const i=new mi;i.matrixAutoUpdate=!1,i.visible=!1,e.joints[t.jointName]=i,e.add(i)}return e.joints[t.jointName]}}class up extends Nt{constructor(){super(),this.isScene=!0,this.type="Scene",this.background=null,this.environment=null,this.fog=null,this.backgroundBlurriness=0,this.backgroundIntensity=1,this.backgroundRotation=new Fn,this.environmentIntensity=1,this.environmentRotation=new Fn,this.overrideMaterial=null,typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}copy(e,t){return super.copy(e,t),e.background!==null&&(this.background=e.background.clone()),e.environment!==null&&(this.environment=e.environment.clone()),e.fog!==null&&(this.fog=e.fog.clone()),this.backgroundBlurriness=e.backgroundBlurriness,this.backgroundIntensity=e.backgroundIntensity,this.backgroundRotation.copy(e.backgroundRotation),this.environmentIntensity=e.environmentIntensity,this.environmentRotation.copy(e.environmentRotation),e.overrideMaterial!==null&&(this.overrideMaterial=e.overrideMaterial.clone()),this.matrixAutoUpdate=e.matrixAutoUpdate,this}toJSON(e){const t=super.toJSON(e);return this.fog!==null&&(t.object.fog=this.fog.toJSON()),this.backgroundBlurriness>0&&(t.object.backgroundBlurriness=this.backgroundBlurriness),this.backgroundIntensity!==1&&(t.object.backgroundIntensity=this.backgroundIntensity),t.object.backgroundRotation=this.backgroundRotation.toArray(),this.environmentIntensity!==1&&(t.object.environmentIntensity=this.environmentIntensity),t.object.environmentRotation=this.environmentRotation.toArray(),t}}class d0 extends Wt{constructor(e=null,t=1,i=1,s,r,o,a,l,c=ln,u=ln,d,h){super(null,o,a,l,c,u,s,r,d,h),this.isDataTexture=!0,this.image={data:e,width:t,height:i},this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}}class Ud extends Ut{constructor(e,t,i,s=1){super(e,t,i),this.isInstancedBufferAttribute=!0,this.meshPerAttribute=s}copy(e){return super.copy(e),this.meshPerAttribute=e.meshPerAttribute,this}toJSON(){const e=super.toJSON();return e.meshPerAttribute=this.meshPerAttribute,e.isInstancedBufferAttribute=!0,e}}const gs=new rt,Fd=new rt,ro=[],Od=new Ki,h0=new rt,Qs=new xn,er=new Zi;class dp extends xn{constructor(e,t,i){super(e,t),this.isInstancedMesh=!0,this.instanceMatrix=new Ud(new Float32Array(i*16),16),this.instanceColor=null,this.morphTexture=null,this.count=i,this.boundingBox=null,this.boundingSphere=null;for(let s=0;s<i;s++)this.setMatrixAt(s,h0)}computeBoundingBox(){const e=this.geometry,t=this.count;this.boundingBox===null&&(this.boundingBox=new Ki),e.boundingBox===null&&e.computeBoundingBox(),this.boundingBox.makeEmpty();for(let i=0;i<t;i++)this.getMatrixAt(i,gs),Od.copy(e.boundingBox).applyMatrix4(gs),this.boundingBox.union(Od)}computeBoundingSphere(){const e=this.geometry,t=this.count;this.boundingSphere===null&&(this.boundingSphere=new Zi),e.boundingSphere===null&&e.computeBoundingSphere(),this.boundingSphere.makeEmpty();for(let i=0;i<t;i++)this.getMatrixAt(i,gs),er.copy(e.boundingSphere).applyMatrix4(gs),this.boundingSphere.union(er)}copy(e,t){return super.copy(e,t),this.instanceMatrix.copy(e.instanceMatrix),e.morphTexture!==null&&(this.morphTexture=e.morphTexture.clone()),e.instanceColor!==null&&(this.instanceColor=e.instanceColor.clone()),this.count=e.count,e.boundingBox!==null&&(this.boundingBox=e.boundingBox.clone()),e.boundingSphere!==null&&(this.boundingSphere=e.boundingSphere.clone()),this}getColorAt(e,t){t.fromArray(this.instanceColor.array,e*3)}getMatrixAt(e,t){t.fromArray(this.instanceMatrix.array,e*16)}getMorphAt(e,t){const i=t.morphTargetInfluences,s=this.morphTexture.source.data.data,r=i.length+1,o=e*r+1;for(let a=0;a<i.length;a++)i[a]=s[o+a]}raycast(e,t){const i=this.matrixWorld,s=this.count;if(Qs.geometry=this.geometry,Qs.material=this.material,Qs.material!==void 0&&(this.boundingSphere===null&&this.computeBoundingSphere(),er.copy(this.boundingSphere),er.applyMatrix4(i),e.ray.intersectsSphere(er)!==!1))for(let r=0;r<s;r++){this.getMatrixAt(r,gs),Fd.multiplyMatrices(i,gs),Qs.matrixWorld=Fd,Qs.raycast(e,ro);for(let o=0,a=ro.length;o<a;o++){const l=ro[o];l.instanceId=r,l.object=this,t.push(l)}ro.length=0}}setColorAt(e,t){this.instanceColor===null&&(this.instanceColor=new Ud(new Float32Array(this.instanceMatrix.count*3).fill(1),3)),t.toArray(this.instanceColor.array,e*3)}setMatrixAt(e,t){t.toArray(this.instanceMatrix.array,e*16)}setMorphAt(e,t){const i=t.morphTargetInfluences,s=i.length+1;this.morphTexture===null&&(this.morphTexture=new d0(new Float32Array(s*this.count),s,this.count,iu,Ln));const r=this.morphTexture.source.data.data;let o=0;for(let c=0;c<i.length;c++)o+=i[c];const a=this.geometry.morphTargetsRelative?1:1-o,l=s*e;r[l]=a,r.set(i,l+1)}updateMorphTargets(){}dispose(){this.dispatchEvent({type:"dispose"}),this.morphTexture!==null&&(this.morphTexture.dispose(),this.morphTexture=null)}}const Za=new O,f0=new O,p0=new qe;class ai{constructor(e=new O(1,0,0),t=0){this.isPlane=!0,this.normal=e,this.constant=t}set(e,t){return this.normal.copy(e),this.constant=t,this}setComponents(e,t,i,s){return this.normal.set(e,t,i),this.constant=s,this}setFromNormalAndCoplanarPoint(e,t){return this.normal.copy(e),this.constant=-t.dot(this.normal),this}setFromCoplanarPoints(e,t,i){const s=Za.subVectors(i,t).cross(f0.subVectors(e,t)).normalize();return this.setFromNormalAndCoplanarPoint(s,e),this}copy(e){return this.normal.copy(e.normal),this.constant=e.constant,this}normalize(){const e=1/this.normal.length();return this.normal.multiplyScalar(e),this.constant*=e,this}negate(){return this.constant*=-1,this.normal.negate(),this}distanceToPoint(e){return this.normal.dot(e)+this.constant}distanceToSphere(e){return this.distanceToPoint(e.center)-e.radius}projectPoint(e,t){return t.copy(e).addScaledVector(this.normal,-this.distanceToPoint(e))}intersectLine(e,t){const i=e.delta(Za),s=this.normal.dot(i);if(s===0)return this.distanceToPoint(e.start)===0?t.copy(e.start):null;const r=-(e.start.dot(this.normal)+this.constant)/s;return r<0||r>1?null:t.copy(e.start).addScaledVector(i,r)}intersectsLine(e){const t=this.distanceToPoint(e.start),i=this.distanceToPoint(e.end);return t<0&&i>0||i<0&&t>0}intersectsBox(e){return e.intersectsPlane(this)}intersectsSphere(e){return e.intersectsPlane(this)}coplanarPoint(e){return e.copy(this.normal).multiplyScalar(-this.constant)}applyMatrix4(e,t){const i=t||p0.getNormalMatrix(e),s=this.coplanarPoint(Za).applyMatrix4(e),r=this.normal.applyMatrix3(i).normalize();return this.constant=-s.dot(r),this}translate(e){return this.constant-=e.dot(this.normal),this}equals(e){return e.normal.equals(this.normal)&&e.constant===this.constant}clone(){return new this.constructor().copy(this)}}const Li=new Zi,m0=new Ve(.5,.5),oo=new O;class cu{constructor(e=new ai,t=new ai,i=new ai,s=new ai,r=new ai,o=new ai){this.planes=[e,t,i,s,r,o]}set(e,t,i,s,r,o){const a=this.planes;return a[0].copy(e),a[1].copy(t),a[2].copy(i),a[3].copy(s),a[4].copy(r),a[5].copy(o),this}copy(e){const t=this.planes;for(let i=0;i<6;i++)t[i].copy(e.planes[i]);return this}setFromProjectionMatrix(e,t=Kn){const i=this.planes,s=e.elements,r=s[0],o=s[1],a=s[2],l=s[3],c=s[4],u=s[5],d=s[6],h=s[7],p=s[8],g=s[9],v=s[10],m=s[11],f=s[12],T=s[13],y=s[14],M=s[15];if(i[0].setComponents(l-r,h-c,m-p,M-f).normalize(),i[1].setComponents(l+r,h+c,m+p,M+f).normalize(),i[2].setComponents(l+o,h+u,m+g,M+T).normalize(),i[3].setComponents(l-o,h-u,m-g,M-T).normalize(),i[4].setComponents(l-a,h-d,m-v,M-y).normalize(),t===Kn)i[5].setComponents(l+a,h+d,m+v,M+y).normalize();else if(t===$o)i[5].setComponents(a,d,v,y).normalize();else throw new Error("THREE.Frustum.setFromProjectionMatrix(): Invalid coordinate system: "+t);return this}intersectsObject(e){if(e.boundingSphere!==void 0)e.boundingSphere===null&&e.computeBoundingSphere(),Li.copy(e.boundingSphere).applyMatrix4(e.matrixWorld);else{const t=e.geometry;t.boundingSphere===null&&t.computeBoundingSphere(),Li.copy(t.boundingSphere).applyMatrix4(e.matrixWorld)}return this.intersectsSphere(Li)}intersectsSprite(e){Li.center.set(0,0,0);const t=m0.distanceTo(e.center);return Li.radius=.7071067811865476+t,Li.applyMatrix4(e.matrixWorld),this.intersectsSphere(Li)}intersectsSphere(e){const t=this.planes,i=e.center,s=-e.radius;for(let r=0;r<6;r++)if(t[r].distanceToPoint(i)<s)return!1;return!0}intersectsBox(e){const t=this.planes;for(let i=0;i<6;i++){const s=t[i];if(oo.x=s.normal.x>0?e.max.x:e.min.x,oo.y=s.normal.y>0?e.max.y:e.min.y,oo.z=s.normal.z>0?e.max.z:e.min.z,s.distanceToPoint(oo)<0)return!1}return!0}containsPoint(e){const t=this.planes;for(let i=0;i<6;i++)if(t[i].distanceToPoint(e)<0)return!1;return!0}clone(){return new this.constructor().copy(this)}}class Qn extends Ji{constructor(e){super(),this.isLineBasicMaterial=!0,this.type="LineBasicMaterial",this.color=new Pe(16777215),this.map=null,this.linewidth=1,this.linecap="round",this.linejoin="round",this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.linewidth=e.linewidth,this.linecap=e.linecap,this.linejoin=e.linejoin,this.fog=e.fog,this}}const Xo=new O,Yo=new O,Bd=new rt,tr=new Pr,ao=new Zi,Ja=new O,kd=new O;class g0 extends Nt{constructor(e=new Ot,t=new Qn){super(),this.isLine=!0,this.type="Line",this.geometry=e,this.material=t,this.morphTargetDictionary=void 0,this.morphTargetInfluences=void 0,this.updateMorphTargets()}copy(e,t){return super.copy(e,t),this.material=Array.isArray(e.material)?e.material.slice():e.material,this.geometry=e.geometry,this}computeLineDistances(){const e=this.geometry;if(e.index===null){const t=e.attributes.position,i=[0];for(let s=1,r=t.count;s<r;s++)Xo.fromBufferAttribute(t,s-1),Yo.fromBufferAttribute(t,s),i[s]=i[s-1],i[s]+=Xo.distanceTo(Yo);e.setAttribute("lineDistance",new cn(i,1))}else console.warn("THREE.Line.computeLineDistances(): Computation only possible with non-indexed BufferGeometry.");return this}raycast(e,t){const i=this.geometry,s=this.matrixWorld,r=e.params.Line.threshold,o=i.drawRange;if(i.boundingSphere===null&&i.computeBoundingSphere(),ao.copy(i.boundingSphere),ao.applyMatrix4(s),ao.radius+=r,e.ray.intersectsSphere(ao)===!1)return;Bd.copy(s).invert(),tr.copy(e.ray).applyMatrix4(Bd);const a=r/((this.scale.x+this.scale.y+this.scale.z)/3),l=a*a,c=this.isLineSegments?2:1,u=i.index,h=i.attributes.position;if(u!==null){const p=Math.max(0,o.start),g=Math.min(u.count,o.start+o.count);for(let v=p,m=g-1;v<m;v+=c){const f=u.getX(v),T=u.getX(v+1),y=lo(this,e,tr,l,f,T,v);y&&t.push(y)}if(this.isLineLoop){const v=u.getX(g-1),m=u.getX(p),f=lo(this,e,tr,l,v,m,g-1);f&&t.push(f)}}else{const p=Math.max(0,o.start),g=Math.min(h.count,o.start+o.count);for(let v=p,m=g-1;v<m;v+=c){const f=lo(this,e,tr,l,v,v+1,v);f&&t.push(f)}if(this.isLineLoop){const v=lo(this,e,tr,l,g-1,p,g-1);v&&t.push(v)}}}updateMorphTargets(){const t=this.geometry.morphAttributes,i=Object.keys(t);if(i.length>0){const s=t[i[0]];if(s!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let r=0,o=s.length;r<o;r++){const a=s[r].name||String(r);this.morphTargetInfluences.push(0),this.morphTargetDictionary[a]=r}}}}}function lo(n,e,t,i,s,r,o){const a=n.geometry.attributes.position;if(Xo.fromBufferAttribute(a,s),Yo.fromBufferAttribute(a,r),t.distanceSqToSegment(Xo,Yo,Ja,kd)>i)return;Ja.applyMatrix4(n.matrixWorld);const c=e.ray.origin.distanceTo(Ja);if(!(c<e.near||c>e.far))return{distance:c,point:kd.clone().applyMatrix4(n.matrixWorld),index:o,face:null,faceIndex:null,barycoord:null,object:n}}const zd=new O,Gd=new O;class Xi extends g0{constructor(e,t){super(e,t),this.isLineSegments=!0,this.type="LineSegments"}computeLineDistances(){const e=this.geometry;if(e.index===null){const t=e.attributes.position,i=[];for(let s=0,r=t.count;s<r;s+=2)zd.fromBufferAttribute(t,s),Gd.fromBufferAttribute(t,s+1),i[s]=s===0?0:i[s-1],i[s+1]=i[s]+zd.distanceTo(Gd);e.setAttribute("lineDistance",new cn(i,1))}else console.warn("THREE.LineSegments.computeLineDistances(): Computation only possible with non-indexed BufferGeometry.");return this}}class Lr extends Ji{constructor(e){super(),this.isPointsMaterial=!0,this.type="PointsMaterial",this.color=new Pe(16777215),this.map=null,this.alphaMap=null,this.size=1,this.sizeAttenuation=!0,this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.alphaMap=e.alphaMap,this.size=e.size,this.sizeAttenuation=e.sizeAttenuation,this.fog=e.fog,this}}const Hd=new rt,dc=new Pr,co=new Zi,uo=new O;class uu extends Nt{constructor(e=new Ot,t=new Lr){super(),this.isPoints=!0,this.type="Points",this.geometry=e,this.material=t,this.morphTargetDictionary=void 0,this.morphTargetInfluences=void 0,this.updateMorphTargets()}copy(e,t){return super.copy(e,t),this.material=Array.isArray(e.material)?e.material.slice():e.material,this.geometry=e.geometry,this}raycast(e,t){const i=this.geometry,s=this.matrixWorld,r=e.params.Points.threshold,o=i.drawRange;if(i.boundingSphere===null&&i.computeBoundingSphere(),co.copy(i.boundingSphere),co.applyMatrix4(s),co.radius+=r,e.ray.intersectsSphere(co)===!1)return;Hd.copy(s).invert(),dc.copy(e.ray).applyMatrix4(Hd);const a=r/((this.scale.x+this.scale.y+this.scale.z)/3),l=a*a,c=i.index,d=i.attributes.position;if(c!==null){const h=Math.max(0,o.start),p=Math.min(c.count,o.start+o.count);for(let g=h,v=p;g<v;g++){const m=c.getX(g);uo.fromBufferAttribute(d,m),Vd(uo,m,l,s,e,t,this)}}else{const h=Math.max(0,o.start),p=Math.min(d.count,o.start+o.count);for(let g=h,v=p;g<v;g++)uo.fromBufferAttribute(d,g),Vd(uo,g,l,s,e,t,this)}}updateMorphTargets(){const t=this.geometry.morphAttributes,i=Object.keys(t);if(i.length>0){const s=t[i[0]];if(s!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let r=0,o=s.length;r<o;r++){const a=s[r].name||String(r);this.morphTargetInfluences.push(0),this.morphTargetDictionary[a]=r}}}}}function Vd(n,e,t,i,s,r,o){const a=dc.distanceSqToPoint(n);if(a<t){const l=new O;dc.closestPointToPoint(n,l),l.applyMatrix4(i);const c=s.ray.origin.distanceTo(l);if(c<s.near||c>s.far)return;r.push({distance:c,distanceToRay:Math.sqrt(a),point:l,index:e,face:null,faceIndex:null,barycoord:null,object:o})}}class hp extends Wt{constructor(e,t,i=Vi,s,r,o,a=ln,l=ln,c,u=Mr,d=1){if(u!==Mr&&u!==wr)throw new Error("DepthTexture format must be either THREE.DepthFormat or THREE.DepthStencilFormat");const h={width:e,height:t,depth:d};super(h,s,r,o,a,l,u,i,c),this.isDepthTexture=!0,this.flipY=!1,this.generateMipmaps=!1,this.compareFunction=null}copy(e){return super.copy(e),this.source=new au(Object.assign({},e.image)),this.compareFunction=e.compareFunction,this}toJSON(e){const t=super.toJSON(e);return this.compareFunction!==null&&(t.compareFunction=this.compareFunction),t}}const ho=new O,fo=new O,Qa=new O,po=new vn;class aa extends Ot{constructor(e=null,t=1){if(super(),this.type="EdgesGeometry",this.parameters={geometry:e,thresholdAngle:t},e!==null){const s=Math.pow(10,4),r=Math.cos(dr*t),o=e.getIndex(),a=e.getAttribute("position"),l=o?o.count:a.count,c=[0,0,0],u=["a","b","c"],d=new Array(3),h={},p=[];for(let g=0;g<l;g+=3){o?(c[0]=o.getX(g),c[1]=o.getX(g+1),c[2]=o.getX(g+2)):(c[0]=g,c[1]=g+1,c[2]=g+2);const{a:v,b:m,c:f}=po;if(v.fromBufferAttribute(a,c[0]),m.fromBufferAttribute(a,c[1]),f.fromBufferAttribute(a,c[2]),po.getNormal(Qa),d[0]=`${Math.round(v.x*s)},${Math.round(v.y*s)},${Math.round(v.z*s)}`,d[1]=`${Math.round(m.x*s)},${Math.round(m.y*s)},${Math.round(m.z*s)}`,d[2]=`${Math.round(f.x*s)},${Math.round(f.y*s)},${Math.round(f.z*s)}`,!(d[0]===d[1]||d[1]===d[2]||d[2]===d[0]))for(let T=0;T<3;T++){const y=(T+1)%3,M=d[T],P=d[y],E=po[u[T]],A=po[u[y]],R=`${M}_${P}`,w=`${P}_${M}`;w in h&&h[w]?(Qa.dot(h[w].normal)<=r&&(p.push(E.x,E.y,E.z),p.push(A.x,A.y,A.z)),h[w]=null):R in h||(h[R]={index0:c[T],index1:c[y],normal:Qa.clone()})}}for(const g in h)if(h[g]){const{index0:v,index1:m}=h[g];ho.fromBufferAttribute(a,v),fo.fromBufferAttribute(a,m),p.push(ho.x,ho.y,ho.z),p.push(fo.x,fo.y,fo.z)}this.setAttribute("position",new cn(p,3))}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}}class la extends Ot{constructor(e=1,t=1,i=1,s=1){super(),this.type="PlaneGeometry",this.parameters={width:e,height:t,widthSegments:i,heightSegments:s};const r=e/2,o=t/2,a=Math.floor(i),l=Math.floor(s),c=a+1,u=l+1,d=e/a,h=t/l,p=[],g=[],v=[],m=[];for(let f=0;f<u;f++){const T=f*h-o;for(let y=0;y<c;y++){const M=y*d-r;g.push(M,-T,0),v.push(0,0,1),m.push(y/a),m.push(1-f/l)}}for(let f=0;f<l;f++)for(let T=0;T<a;T++){const y=T+c*f,M=T+c*(f+1),P=T+1+c*(f+1),E=T+1+c*f;p.push(y,M,E),p.push(M,P,E)}this.setIndex(p),this.setAttribute("position",new cn(g,3)),this.setAttribute("normal",new cn(v,3)),this.setAttribute("uv",new cn(m,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new la(e.width,e.height,e.widthSegments,e.heightSegments)}}class $d extends Ji{constructor(e){super(),this.isMeshLambertMaterial=!0,this.type="MeshLambertMaterial",this.color=new Pe(16777215),this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.emissive=new Pe(0),this.emissiveIntensity=1,this.emissiveMap=null,this.bumpMap=null,this.bumpScale=1,this.normalMap=null,this.normalMapType=ep,this.normalScale=new Ve(1,1),this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.specularMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new Fn,this.combine=Qc,this.reflectivity=1,this.refractionRatio=.98,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.flatShading=!1,this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.lightMap=e.lightMap,this.lightMapIntensity=e.lightMapIntensity,this.aoMap=e.aoMap,this.aoMapIntensity=e.aoMapIntensity,this.emissive.copy(e.emissive),this.emissiveMap=e.emissiveMap,this.emissiveIntensity=e.emissiveIntensity,this.bumpMap=e.bumpMap,this.bumpScale=e.bumpScale,this.normalMap=e.normalMap,this.normalMapType=e.normalMapType,this.normalScale.copy(e.normalScale),this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this.specularMap=e.specularMap,this.alphaMap=e.alphaMap,this.envMap=e.envMap,this.envMapRotation.copy(e.envMapRotation),this.combine=e.combine,this.reflectivity=e.reflectivity,this.refractionRatio=e.refractionRatio,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.wireframeLinecap=e.wireframeLinecap,this.wireframeLinejoin=e.wireframeLinejoin,this.flatShading=e.flatShading,this.fog=e.fog,this}}class _0 extends Ji{constructor(e){super(),this.isMeshDepthMaterial=!0,this.type="MeshDepthMaterial",this.depthPacking=E_,this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.wireframe=!1,this.wireframeLinewidth=1,this.setValues(e)}copy(e){return super.copy(e),this.depthPacking=e.depthPacking,this.map=e.map,this.alphaMap=e.alphaMap,this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this}}class v0 extends Ji{constructor(e){super(),this.isMeshDistanceMaterial=!0,this.type="MeshDistanceMaterial",this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.setValues(e)}copy(e){return super.copy(e),this.map=e.map,this.alphaMap=e.alphaMap,this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this}}class x0 extends Qn{constructor(e){super(),this.isLineDashedMaterial=!0,this.type="LineDashedMaterial",this.scale=1,this.dashSize=3,this.gapSize=1,this.setValues(e)}copy(e){return super.copy(e),this.scale=e.scale,this.dashSize=e.dashSize,this.gapSize=e.gapSize,this}}class fp extends Nt{constructor(e,t=1){super(),this.isLight=!0,this.type="Light",this.color=new Pe(e),this.intensity=t}dispose(){}copy(e,t){return super.copy(e,t),this.color.copy(e.color),this.intensity=e.intensity,this}toJSON(e){const t=super.toJSON(e);return t.object.color=this.color.getHex(),t.object.intensity=this.intensity,this.groundColor!==void 0&&(t.object.groundColor=this.groundColor.getHex()),this.distance!==void 0&&(t.object.distance=this.distance),this.angle!==void 0&&(t.object.angle=this.angle),this.decay!==void 0&&(t.object.decay=this.decay),this.penumbra!==void 0&&(t.object.penumbra=this.penumbra),this.shadow!==void 0&&(t.object.shadow=this.shadow.toJSON()),this.target!==void 0&&(t.object.target=this.target.uuid),t}}const el=new rt,Wd=new O,Xd=new O;class y0{constructor(e){this.camera=e,this.intensity=1,this.bias=0,this.normalBias=0,this.radius=1,this.blurSamples=8,this.mapSize=new Ve(512,512),this.mapType=Un,this.map=null,this.mapPass=null,this.matrix=new rt,this.autoUpdate=!0,this.needsUpdate=!1,this._frustum=new cu,this._frameExtents=new Ve(1,1),this._viewportCount=1,this._viewports=[new Mt(0,0,1,1)]}getViewportCount(){return this._viewportCount}getFrustum(){return this._frustum}updateMatrices(e){const t=this.camera,i=this.matrix;Wd.setFromMatrixPosition(e.matrixWorld),t.position.copy(Wd),Xd.setFromMatrixPosition(e.target.matrixWorld),t.lookAt(Xd),t.updateMatrixWorld(),el.multiplyMatrices(t.projectionMatrix,t.matrixWorldInverse),this._frustum.setFromProjectionMatrix(el),i.set(.5,0,0,.5,0,.5,0,.5,0,0,.5,.5,0,0,0,1),i.multiply(el)}getViewport(e){return this._viewports[e]}getFrameExtents(){return this._frameExtents}dispose(){this.map&&this.map.dispose(),this.mapPass&&this.mapPass.dispose()}copy(e){return this.camera=e.camera.clone(),this.intensity=e.intensity,this.bias=e.bias,this.radius=e.radius,this.autoUpdate=e.autoUpdate,this.needsUpdate=e.needsUpdate,this.normalBias=e.normalBias,this.blurSamples=e.blurSamples,this.mapSize.copy(e.mapSize),this}clone(){return new this.constructor().copy(this)}toJSON(){const e={};return this.intensity!==1&&(e.intensity=this.intensity),this.bias!==0&&(e.bias=this.bias),this.normalBias!==0&&(e.normalBias=this.normalBias),this.radius!==1&&(e.radius=this.radius),(this.mapSize.x!==512||this.mapSize.y!==512)&&(e.mapSize=this.mapSize.toArray()),e.camera=this.camera.toJSON(!1).object,delete e.camera.matrix,e}}class pp extends lp{constructor(e=-1,t=1,i=1,s=-1,r=.1,o=2e3){super(),this.isOrthographicCamera=!0,this.type="OrthographicCamera",this.zoom=1,this.view=null,this.left=e,this.right=t,this.top=i,this.bottom=s,this.near=r,this.far=o,this.updateProjectionMatrix()}copy(e,t){return super.copy(e,t),this.left=e.left,this.right=e.right,this.top=e.top,this.bottom=e.bottom,this.near=e.near,this.far=e.far,this.zoom=e.zoom,this.view=e.view===null?null:Object.assign({},e.view),this}setViewOffset(e,t,i,s,r,o){this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=e,this.view.fullHeight=t,this.view.offsetX=i,this.view.offsetY=s,this.view.width=r,this.view.height=o,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){const e=(this.right-this.left)/(2*this.zoom),t=(this.top-this.bottom)/(2*this.zoom),i=(this.right+this.left)/2,s=(this.top+this.bottom)/2;let r=i-e,o=i+e,a=s+t,l=s-t;if(this.view!==null&&this.view.enabled){const c=(this.right-this.left)/this.view.fullWidth/this.zoom,u=(this.top-this.bottom)/this.view.fullHeight/this.zoom;r+=c*this.view.offsetX,o=r+c*this.view.width,a-=u*this.view.offsetY,l=a-u*this.view.height}this.projectionMatrix.makeOrthographic(r,o,a,l,this.near,this.far,this.coordinateSystem),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(e){const t=super.toJSON(e);return t.object.zoom=this.zoom,t.object.left=this.left,t.object.right=this.right,t.object.top=this.top,t.object.bottom=this.bottom,t.object.near=this.near,t.object.far=this.far,this.view!==null&&(t.object.view=Object.assign({},this.view)),t}}class S0 extends y0{constructor(){super(new pp(-5,5,5,-5,.5,500)),this.isDirectionalLightShadow=!0}}class mp extends fp{constructor(e,t){super(e,t),this.isDirectionalLight=!0,this.type="DirectionalLight",this.position.copy(Nt.DEFAULT_UP),this.updateMatrix(),this.target=new Nt,this.shadow=new S0}dispose(){this.shadow.dispose()}copy(e){return super.copy(e),this.target=e.target.clone(),this.shadow=e.shadow.clone(),this}}class gp extends fp{constructor(e,t){super(e,t),this.isAmbientLight=!0,this.type="AmbientLight"}}class M0 extends on{constructor(e=[]){super(),this.isArrayCamera=!0,this.isMultiViewCamera=!1,this.cameras=e}}const Yd=new rt;class w0{constructor(e,t,i=0,s=1/0){this.ray=new Pr(e,t),this.near=i,this.far=s,this.camera=null,this.layers=new lu,this.params={Mesh:{},Line:{threshold:1},LOD:{},Points:{threshold:1},Sprite:{}}}set(e,t){this.ray.set(e,t)}setFromCamera(e,t){t.isPerspectiveCamera?(this.ray.origin.setFromMatrixPosition(t.matrixWorld),this.ray.direction.set(e.x,e.y,.5).unproject(t).sub(this.ray.origin).normalize(),this.camera=t):t.isOrthographicCamera?(this.ray.origin.set(e.x,e.y,(t.near+t.far)/(t.near-t.far)).unproject(t),this.ray.direction.set(0,0,-1).transformDirection(t.matrixWorld),this.camera=t):console.error("THREE.Raycaster: Unsupported camera type: "+t.type)}setFromXRController(e){return Yd.identity().extractRotation(e.matrixWorld),this.ray.origin.setFromMatrixPosition(e.matrixWorld),this.ray.direction.set(0,0,-1).applyMatrix4(Yd),this}intersectObject(e,t=!0,i=[]){return hc(e,this,i,t),i.sort(qd),i}intersectObjects(e,t=!0,i=[]){for(let s=0,r=e.length;s<r;s++)hc(e[s],this,i,t);return i.sort(qd),i}}function qd(n,e){return n.distance-e.distance}function hc(n,e,t,i){let s=!0;if(n.layers.test(e.layers)&&n.raycast(e,t)===!1&&(s=!1),s===!0&&i===!0){const r=n.children;for(let o=0,a=r.length;o<a;o++)hc(r[o],e,t,!0)}}class jd{constructor(e=1,t=0,i=0){this.radius=e,this.phi=t,this.theta=i}set(e,t,i){return this.radius=e,this.phi=t,this.theta=i,this}copy(e){return this.radius=e.radius,this.phi=e.phi,this.theta=e.theta,this}makeSafe(){return this.phi=Je(this.phi,1e-6,Math.PI-1e-6),this}setFromVector3(e){return this.setFromCartesianCoords(e.x,e.y,e.z)}setFromCartesianCoords(e,t,i){return this.radius=Math.sqrt(e*e+t*t+i*i),this.radius===0?(this.theta=0,this.phi=0):(this.theta=Math.atan2(e,i),this.phi=Math.acos(Je(t/this.radius,-1,1))),this}clone(){return new this.constructor().copy(this)}}class tl extends Xi{constructor(e=10,t=10,i=4473924,s=8947848){i=new Pe(i),s=new Pe(s);const r=t/2,o=e/t,a=e/2,l=[],c=[];for(let h=0,p=0,g=-a;h<=t;h++,g+=o){l.push(-a,0,g,a,0,g),l.push(g,0,-a,g,0,a);const v=h===r?i:s;v.toArray(c,p),p+=3,v.toArray(c,p),p+=3,v.toArray(c,p),p+=3,v.toArray(c,p),p+=3}const u=new Ot;u.setAttribute("position",new cn(l,3)),u.setAttribute("color",new cn(c,3));const d=new Qn({vertexColors:!0,toneMapped:!1});super(u,d),this.type="GridHelper"}dispose(){this.geometry.dispose(),this.material.dispose()}}class b0 extends ji{constructor(e,t=null){super(),this.object=e,this.domElement=t,this.enabled=!0,this.state=-1,this.keys={},this.mouseButtons={LEFT:null,MIDDLE:null,RIGHT:null},this.touches={ONE:null,TWO:null}}connect(e){if(e===void 0){console.warn("THREE.Controls: connect() now requires an element.");return}this.domElement!==null&&this.disconnect(),this.domElement=e}disconnect(){}dispose(){}update(){}}function Kd(n,e,t,i){const s=E0(i);switch(t){case Kf:return n*e;case iu:return n*e/s.components*s.byteLength;case su:return n*e/s.components*s.byteLength;case Jf:return n*e*2/s.components*s.byteLength;case ru:return n*e*2/s.components*s.byteLength;case Zf:return n*e*3/s.components*s.byteLength;case Tn:return n*e*4/s.components*s.byteLength;case ou:return n*e*4/s.components*s.byteLength;case Co:case Po:return Math.floor((n+3)/4)*Math.floor((e+3)/4)*8;case Lo:case Do:return Math.floor((n+3)/4)*Math.floor((e+3)/4)*16;case kl:case Gl:return Math.max(n,16)*Math.max(e,8)/4;case Bl:case zl:return Math.max(n,8)*Math.max(e,8)/2;case Hl:case Vl:return Math.floor((n+3)/4)*Math.floor((e+3)/4)*8;case $l:return Math.floor((n+3)/4)*Math.floor((e+3)/4)*16;case Wl:return Math.floor((n+3)/4)*Math.floor((e+3)/4)*16;case Xl:return Math.floor((n+4)/5)*Math.floor((e+3)/4)*16;case Yl:return Math.floor((n+4)/5)*Math.floor((e+4)/5)*16;case ql:return Math.floor((n+5)/6)*Math.floor((e+4)/5)*16;case jl:return Math.floor((n+5)/6)*Math.floor((e+5)/6)*16;case Kl:return Math.floor((n+7)/8)*Math.floor((e+4)/5)*16;case Zl:return Math.floor((n+7)/8)*Math.floor((e+5)/6)*16;case Jl:return Math.floor((n+7)/8)*Math.floor((e+7)/8)*16;case Ql:return Math.floor((n+9)/10)*Math.floor((e+4)/5)*16;case ec:return Math.floor((n+9)/10)*Math.floor((e+5)/6)*16;case tc:return Math.floor((n+9)/10)*Math.floor((e+7)/8)*16;case nc:return Math.floor((n+9)/10)*Math.floor((e+9)/10)*16;case ic:return Math.floor((n+11)/12)*Math.floor((e+9)/10)*16;case sc:return Math.floor((n+11)/12)*Math.floor((e+11)/12)*16;case Io:case rc:case oc:return Math.ceil(n/4)*Math.ceil(e/4)*16;case Qf:case ac:return Math.ceil(n/4)*Math.ceil(e/4)*8;case lc:case cc:return Math.ceil(n/4)*Math.ceil(e/4)*16}throw new Error(`Unable to determine texture byte length for ${t} format.`)}function E0(n){switch(n){case Un:case Yf:return{byteLength:1,components:1};case yr:case qf:case Rr:return{byteLength:2,components:1};case tu:case nu:return{byteLength:2,components:4};case Vi:case eu:case Ln:return{byteLength:4,components:1};case jf:return{byteLength:4,components:3}}throw new Error(`Unknown texture type ${n}.`)}typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("register",{detail:{revision:Jc}}));typeof window<"u"&&(window.__THREE__?console.warn("WARNING: Multiple instances of Three.js being imported."):window.__THREE__=Jc);/**
 * @license
 * Copyright 2010-2025 Three.js Authors
 * SPDX-License-Identifier: MIT
 */function _p(){let n=null,e=!1,t=null,i=null;function s(r,o){t(r,o),i=n.requestAnimationFrame(s)}return{start:function(){e!==!0&&t!==null&&(i=n.requestAnimationFrame(s),e=!0)},stop:function(){n.cancelAnimationFrame(i),e=!1},setAnimationLoop:function(r){t=r},setContext:function(r){n=r}}}function T0(n){const e=new WeakMap;function t(a,l){const c=a.array,u=a.usage,d=c.byteLength,h=n.createBuffer();n.bindBuffer(l,h),n.bufferData(l,c,u),a.onUploadCallback();let p;if(c instanceof Float32Array)p=n.FLOAT;else if(typeof Float16Array<"u"&&c instanceof Float16Array)p=n.HALF_FLOAT;else if(c instanceof Uint16Array)a.isFloat16BufferAttribute?p=n.HALF_FLOAT:p=n.UNSIGNED_SHORT;else if(c instanceof Int16Array)p=n.SHORT;else if(c instanceof Uint32Array)p=n.UNSIGNED_INT;else if(c instanceof Int32Array)p=n.INT;else if(c instanceof Int8Array)p=n.BYTE;else if(c instanceof Uint8Array)p=n.UNSIGNED_BYTE;else if(c instanceof Uint8ClampedArray)p=n.UNSIGNED_BYTE;else throw new Error("THREE.WebGLAttributes: Unsupported buffer data format: "+c);return{buffer:h,type:p,bytesPerElement:c.BYTES_PER_ELEMENT,version:a.version,size:d}}function i(a,l,c){const u=l.array,d=l.updateRanges;if(n.bindBuffer(c,a),d.length===0)n.bufferSubData(c,0,u);else{d.sort((p,g)=>p.start-g.start);let h=0;for(let p=1;p<d.length;p++){const g=d[h],v=d[p];v.start<=g.start+g.count+1?g.count=Math.max(g.count,v.start+v.count-g.start):(++h,d[h]=v)}d.length=h+1;for(let p=0,g=d.length;p<g;p++){const v=d[p];n.bufferSubData(c,v.start*u.BYTES_PER_ELEMENT,u,v.start,v.count)}l.clearUpdateRanges()}l.onUploadCallback()}function s(a){return a.isInterleavedBufferAttribute&&(a=a.data),e.get(a)}function r(a){a.isInterleavedBufferAttribute&&(a=a.data);const l=e.get(a);l&&(n.deleteBuffer(l.buffer),e.delete(a))}function o(a,l){if(a.isInterleavedBufferAttribute&&(a=a.data),a.isGLBufferAttribute){const u=e.get(a);(!u||u.version<a.version)&&e.set(a,{buffer:a.buffer,type:a.type,bytesPerElement:a.elementSize,version:a.version});return}const c=e.get(a);if(c===void 0)e.set(a,t(a,l));else if(c.version<a.version){if(c.size!==a.array.byteLength)throw new Error("THREE.WebGLAttributes: The size of the buffer attribute's array buffer does not match the original size. Resizing buffer attributes is not supported.");i(c.buffer,a,l),c.version=a.version}}return{get:s,remove:r,update:o}}var A0=`#ifdef USE_ALPHAHASH
	if ( diffuseColor.a < getAlphaHashThreshold( vPosition ) ) discard;
#endif`,R0=`#ifdef USE_ALPHAHASH
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
#endif`,C0=`#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, vAlphaMapUv ).g;
#endif`,P0=`#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,L0=`#ifdef USE_ALPHATEST
	#ifdef ALPHA_TO_COVERAGE
	diffuseColor.a = smoothstep( alphaTest, alphaTest + fwidth( diffuseColor.a ), diffuseColor.a );
	if ( diffuseColor.a == 0.0 ) discard;
	#else
	if ( diffuseColor.a < alphaTest ) discard;
	#endif
#endif`,D0=`#ifdef USE_ALPHATEST
	uniform float alphaTest;
#endif`,I0=`#ifdef USE_AOMAP
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
#endif`,N0=`#ifdef USE_AOMAP
	uniform sampler2D aoMap;
	uniform float aoMapIntensity;
#endif`,U0=`#ifdef USE_BATCHING
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
#endif`,F0=`#ifdef USE_BATCHING
	mat4 batchingMatrix = getBatchingMatrix( getIndirectIndex( gl_DrawID ) );
#endif`,O0=`vec3 transformed = vec3( position );
#ifdef USE_ALPHAHASH
	vPosition = vec3( position );
#endif`,B0=`vec3 objectNormal = vec3( normal );
#ifdef USE_TANGENT
	vec3 objectTangent = vec3( tangent.xyz );
#endif`,k0=`float G_BlinnPhong_Implicit( ) {
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
} // validated`,z0=`#ifdef USE_IRIDESCENCE
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
#endif`,G0=`#ifdef USE_BUMPMAP
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
#endif`,H0=`#if NUM_CLIPPING_PLANES > 0
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
#endif`,V0=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
	uniform vec4 clippingPlanes[ NUM_CLIPPING_PLANES ];
#endif`,$0=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
#endif`,W0=`#if NUM_CLIPPING_PLANES > 0
	vClipPosition = - mvPosition.xyz;
#endif`,X0=`#if defined( USE_COLOR_ALPHA )
	diffuseColor *= vColor;
#elif defined( USE_COLOR )
	diffuseColor.rgb *= vColor;
#endif`,Y0=`#if defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#elif defined( USE_COLOR )
	varying vec3 vColor;
#endif`,q0=`#if defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#elif defined( USE_COLOR ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
	varying vec3 vColor;
#endif`,j0=`#if defined( USE_COLOR_ALPHA )
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
#endif`,K0=`#define PI 3.141592653589793
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
} // validated`,Z0=`#ifdef ENVMAP_TYPE_CUBE_UV
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
#endif`,J0=`vec3 transformedNormal = objectNormal;
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
#endif`,Q0=`#ifdef USE_DISPLACEMENTMAP
	uniform sampler2D displacementMap;
	uniform float displacementScale;
	uniform float displacementBias;
#endif`,ev=`#ifdef USE_DISPLACEMENTMAP
	transformed += normalize( objectNormal ) * ( texture2D( displacementMap, vDisplacementMapUv ).x * displacementScale + displacementBias );
#endif`,tv=`#ifdef USE_EMISSIVEMAP
	vec4 emissiveColor = texture2D( emissiveMap, vEmissiveMapUv );
	#ifdef DECODE_VIDEO_TEXTURE_EMISSIVE
		emissiveColor = sRGBTransferEOTF( emissiveColor );
	#endif
	totalEmissiveRadiance *= emissiveColor.rgb;
#endif`,nv=`#ifdef USE_EMISSIVEMAP
	uniform sampler2D emissiveMap;
#endif`,iv="gl_FragColor = linearToOutputTexel( gl_FragColor );",sv=`vec4 LinearTransferOETF( in vec4 value ) {
	return value;
}
vec4 sRGBTransferEOTF( in vec4 value ) {
	return vec4( mix( pow( value.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), value.rgb * 0.0773993808, vec3( lessThanEqual( value.rgb, vec3( 0.04045 ) ) ) ), value.a );
}
vec4 sRGBTransferOETF( in vec4 value ) {
	return vec4( mix( pow( value.rgb, vec3( 0.41666 ) ) * 1.055 - vec3( 0.055 ), value.rgb * 12.92, vec3( lessThanEqual( value.rgb, vec3( 0.0031308 ) ) ) ), value.a );
}`,rv=`#ifdef USE_ENVMAP
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
#endif`,ov=`#ifdef USE_ENVMAP
	uniform float envMapIntensity;
	uniform float flipEnvMap;
	uniform mat3 envMapRotation;
	#ifdef ENVMAP_TYPE_CUBE
		uniform samplerCube envMap;
	#else
		uniform sampler2D envMap;
	#endif
	
#endif`,av=`#ifdef USE_ENVMAP
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
#endif`,lv=`#ifdef USE_ENVMAP
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		
		varying vec3 vWorldPosition;
	#else
		varying vec3 vReflect;
		uniform float refractionRatio;
	#endif
#endif`,cv=`#ifdef USE_ENVMAP
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
#endif`,uv=`#ifdef USE_FOG
	vFogDepth = - mvPosition.z;
#endif`,dv=`#ifdef USE_FOG
	varying float vFogDepth;
#endif`,hv=`#ifdef USE_FOG
	#ifdef FOG_EXP2
		float fogFactor = 1.0 - exp( - fogDensity * fogDensity * vFogDepth * vFogDepth );
	#else
		float fogFactor = smoothstep( fogNear, fogFar, vFogDepth );
	#endif
	gl_FragColor.rgb = mix( gl_FragColor.rgb, fogColor, fogFactor );
#endif`,fv=`#ifdef USE_FOG
	uniform vec3 fogColor;
	varying float vFogDepth;
	#ifdef FOG_EXP2
		uniform float fogDensity;
	#else
		uniform float fogNear;
		uniform float fogFar;
	#endif
#endif`,pv=`#ifdef USE_GRADIENTMAP
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
}`,mv=`#ifdef USE_LIGHTMAP
	uniform sampler2D lightMap;
	uniform float lightMapIntensity;
#endif`,gv=`LambertMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularStrength = specularStrength;`,_v=`varying vec3 vViewPosition;
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
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Lambert`,vv=`uniform bool receiveShadow;
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
#endif`,xv=`#ifdef USE_ENVMAP
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
#endif`,yv=`ToonMaterial material;
material.diffuseColor = diffuseColor.rgb;`,Sv=`varying vec3 vViewPosition;
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
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Toon`,Mv=`BlinnPhongMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularColor = specular;
material.specularShininess = shininess;
material.specularStrength = specularStrength;`,wv=`varying vec3 vViewPosition;
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
#define RE_IndirectDiffuse		RE_IndirectDiffuse_BlinnPhong`,bv=`PhysicalMaterial material;
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
#endif`,Ev=`struct PhysicalMaterial {
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
}`,Tv=`
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
#endif`,Av=`#if defined( RE_IndirectDiffuse )
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
#endif`,Rv=`#if defined( RE_IndirectDiffuse )
	RE_IndirectDiffuse( irradiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif
#if defined( RE_IndirectSpecular )
	RE_IndirectSpecular( radiance, iblIrradiance, clearcoatRadiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif`,Cv=`#if defined( USE_LOGDEPTHBUF )
	gl_FragDepth = vIsPerspective == 0.0 ? gl_FragCoord.z : log2( vFragDepth ) * logDepthBufFC * 0.5;
#endif`,Pv=`#if defined( USE_LOGDEPTHBUF )
	uniform float logDepthBufFC;
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,Lv=`#ifdef USE_LOGDEPTHBUF
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,Dv=`#ifdef USE_LOGDEPTHBUF
	vFragDepth = 1.0 + gl_Position.w;
	vIsPerspective = float( isPerspectiveMatrix( projectionMatrix ) );
#endif`,Iv=`#ifdef USE_MAP
	vec4 sampledDiffuseColor = texture2D( map, vMapUv );
	#ifdef DECODE_VIDEO_TEXTURE
		sampledDiffuseColor = sRGBTransferEOTF( sampledDiffuseColor );
	#endif
	diffuseColor *= sampledDiffuseColor;
#endif`,Nv=`#ifdef USE_MAP
	uniform sampler2D map;
#endif`,Uv=`#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
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
#endif`,Fv=`#if defined( USE_POINTS_UV )
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
#endif`,Ov=`float metalnessFactor = metalness;
#ifdef USE_METALNESSMAP
	vec4 texelMetalness = texture2D( metalnessMap, vMetalnessMapUv );
	metalnessFactor *= texelMetalness.b;
#endif`,Bv=`#ifdef USE_METALNESSMAP
	uniform sampler2D metalnessMap;
#endif`,kv=`#ifdef USE_INSTANCING_MORPH
	float morphTargetInfluences[ MORPHTARGETS_COUNT ];
	float morphTargetBaseInfluence = texelFetch( morphTexture, ivec2( 0, gl_InstanceID ), 0 ).r;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		morphTargetInfluences[i] =  texelFetch( morphTexture, ivec2( i + 1, gl_InstanceID ), 0 ).r;
	}
#endif`,zv=`#if defined( USE_MORPHCOLORS )
	vColor *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		#if defined( USE_COLOR_ALPHA )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ) * morphTargetInfluences[ i ];
		#elif defined( USE_COLOR )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ).rgb * morphTargetInfluences[ i ];
		#endif
	}
#endif`,Gv=`#ifdef USE_MORPHNORMALS
	objectNormal *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) objectNormal += getMorph( gl_VertexID, i, 1 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,Hv=`#ifdef USE_MORPHTARGETS
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
#endif`,Vv=`#ifdef USE_MORPHTARGETS
	transformed *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) transformed += getMorph( gl_VertexID, i, 0 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,$v=`float faceDirection = gl_FrontFacing ? 1.0 : - 1.0;
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
vec3 nonPerturbedNormal = normal;`,Wv=`#ifdef USE_NORMALMAP_OBJECTSPACE
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
#endif`,Xv=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,Yv=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,qv=`#ifndef FLAT_SHADED
	vNormal = normalize( transformedNormal );
	#ifdef USE_TANGENT
		vTangent = normalize( transformedTangent );
		vBitangent = normalize( cross( vNormal, vTangent ) * tangent.w );
	#endif
#endif`,jv=`#ifdef USE_NORMALMAP
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
#endif`,Kv=`#ifdef USE_CLEARCOAT
	vec3 clearcoatNormal = nonPerturbedNormal;
#endif`,Zv=`#ifdef USE_CLEARCOAT_NORMALMAP
	vec3 clearcoatMapN = texture2D( clearcoatNormalMap, vClearcoatNormalMapUv ).xyz * 2.0 - 1.0;
	clearcoatMapN.xy *= clearcoatNormalScale;
	clearcoatNormal = normalize( tbn2 * clearcoatMapN );
#endif`,Jv=`#ifdef USE_CLEARCOATMAP
	uniform sampler2D clearcoatMap;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform sampler2D clearcoatNormalMap;
	uniform vec2 clearcoatNormalScale;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform sampler2D clearcoatRoughnessMap;
#endif`,Qv=`#ifdef USE_IRIDESCENCEMAP
	uniform sampler2D iridescenceMap;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform sampler2D iridescenceThicknessMap;
#endif`,ex=`#ifdef OPAQUE
diffuseColor.a = 1.0;
#endif
#ifdef USE_TRANSMISSION
diffuseColor.a *= material.transmissionAlpha;
#endif
gl_FragColor = vec4( outgoingLight, diffuseColor.a );`,tx=`vec3 packNormalToRGB( const in vec3 normal ) {
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
}`,nx=`#ifdef PREMULTIPLIED_ALPHA
	gl_FragColor.rgb *= gl_FragColor.a;
#endif`,ix=`vec4 mvPosition = vec4( transformed, 1.0 );
#ifdef USE_BATCHING
	mvPosition = batchingMatrix * mvPosition;
#endif
#ifdef USE_INSTANCING
	mvPosition = instanceMatrix * mvPosition;
#endif
mvPosition = modelViewMatrix * mvPosition;
gl_Position = projectionMatrix * mvPosition;`,sx=`#ifdef DITHERING
	gl_FragColor.rgb = dithering( gl_FragColor.rgb );
#endif`,rx=`#ifdef DITHERING
	vec3 dithering( vec3 color ) {
		float grid_position = rand( gl_FragCoord.xy );
		vec3 dither_shift_RGB = vec3( 0.25 / 255.0, -0.25 / 255.0, 0.25 / 255.0 );
		dither_shift_RGB = mix( 2.0 * dither_shift_RGB, -2.0 * dither_shift_RGB, grid_position );
		return color + dither_shift_RGB;
	}
#endif`,ox=`float roughnessFactor = roughness;
#ifdef USE_ROUGHNESSMAP
	vec4 texelRoughness = texture2D( roughnessMap, vRoughnessMapUv );
	roughnessFactor *= texelRoughness.g;
#endif`,ax=`#ifdef USE_ROUGHNESSMAP
	uniform sampler2D roughnessMap;
#endif`,lx=`#if NUM_SPOT_LIGHT_COORDS > 0
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
#endif`,cx=`#if NUM_SPOT_LIGHT_COORDS > 0
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
#endif`,ux=`#if ( defined( USE_SHADOWMAP ) && ( NUM_DIR_LIGHT_SHADOWS > 0 || NUM_POINT_LIGHT_SHADOWS > 0 ) ) || ( NUM_SPOT_LIGHT_COORDS > 0 )
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
#endif`,dx=`float getShadowMask() {
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
}`,hx=`#ifdef USE_SKINNING
	mat4 boneMatX = getBoneMatrix( skinIndex.x );
	mat4 boneMatY = getBoneMatrix( skinIndex.y );
	mat4 boneMatZ = getBoneMatrix( skinIndex.z );
	mat4 boneMatW = getBoneMatrix( skinIndex.w );
#endif`,fx=`#ifdef USE_SKINNING
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
#endif`,px=`#ifdef USE_SKINNING
	vec4 skinVertex = bindMatrix * vec4( transformed, 1.0 );
	vec4 skinned = vec4( 0.0 );
	skinned += boneMatX * skinVertex * skinWeight.x;
	skinned += boneMatY * skinVertex * skinWeight.y;
	skinned += boneMatZ * skinVertex * skinWeight.z;
	skinned += boneMatW * skinVertex * skinWeight.w;
	transformed = ( bindMatrixInverse * skinned ).xyz;
#endif`,mx=`#ifdef USE_SKINNING
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
#endif`,gx=`float specularStrength;
#ifdef USE_SPECULARMAP
	vec4 texelSpecular = texture2D( specularMap, vSpecularMapUv );
	specularStrength = texelSpecular.r;
#else
	specularStrength = 1.0;
#endif`,_x=`#ifdef USE_SPECULARMAP
	uniform sampler2D specularMap;
#endif`,vx=`#if defined( TONE_MAPPING )
	gl_FragColor.rgb = toneMapping( gl_FragColor.rgb );
#endif`,xx=`#ifndef saturate
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
vec3 CustomToneMapping( vec3 color ) { return color; }`,yx=`#ifdef USE_TRANSMISSION
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
#endif`,Sx=`#ifdef USE_TRANSMISSION
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
#endif`,Mx=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
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
#endif`,wx=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
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
#endif`,bx=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
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
#endif`,Ex=`#if defined( USE_ENVMAP ) || defined( DISTANCE ) || defined ( USE_SHADOWMAP ) || defined ( USE_TRANSMISSION ) || NUM_SPOT_LIGHT_COORDS > 0
	vec4 worldPosition = vec4( transformed, 1.0 );
	#ifdef USE_BATCHING
		worldPosition = batchingMatrix * worldPosition;
	#endif
	#ifdef USE_INSTANCING
		worldPosition = instanceMatrix * worldPosition;
	#endif
	worldPosition = modelMatrix * worldPosition;
#endif`;const Tx=`varying vec2 vUv;
uniform mat3 uvTransform;
void main() {
	vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	gl_Position = vec4( position.xy, 1.0, 1.0 );
}`,Ax=`uniform sampler2D t2D;
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
}`,Rx=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,Cx=`#ifdef ENVMAP_TYPE_CUBE
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
}`,Px=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,Lx=`uniform samplerCube tCube;
uniform float tFlip;
uniform float opacity;
varying vec3 vWorldDirection;
void main() {
	vec4 texColor = textureCube( tCube, vec3( tFlip * vWorldDirection.x, vWorldDirection.yz ) );
	gl_FragColor = texColor;
	gl_FragColor.a *= opacity;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,Dx=`#include <common>
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
}`,Ix=`#if DEPTH_PACKING == 3200
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
}`,Nx=`#define DISTANCE
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
}`,Ux=`#define DISTANCE
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
}`,Fx=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
}`,Ox=`uniform sampler2D tEquirect;
varying vec3 vWorldDirection;
#include <common>
void main() {
	vec3 direction = normalize( vWorldDirection );
	vec2 sampleUV = equirectUv( direction );
	gl_FragColor = texture2D( tEquirect, sampleUV );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,Bx=`uniform float scale;
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
}`,kx=`uniform vec3 diffuse;
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
}`,zx=`#include <common>
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
}`,Gx=`uniform vec3 diffuse;
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
}`,Hx=`#define LAMBERT
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
}`,Vx=`#define LAMBERT
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
}`,$x=`#define MATCAP
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
}`,Wx=`#define MATCAP
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
}`,Xx=`#define NORMAL
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
}`,Yx=`#define NORMAL
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
}`,qx=`#define PHONG
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
}`,jx=`#define PHONG
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
}`,Kx=`#define STANDARD
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
}`,Zx=`#define STANDARD
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
}`,Jx=`#define TOON
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
}`,Qx=`#define TOON
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
}`,ey=`uniform float size;
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
}`,ty=`uniform vec3 diffuse;
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
}`,ny=`#include <common>
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
}`,iy=`uniform vec3 color;
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
}`,sy=`uniform float rotation;
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
}`,ry=`uniform vec3 diffuse;
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
}`,Ze={alphahash_fragment:A0,alphahash_pars_fragment:R0,alphamap_fragment:C0,alphamap_pars_fragment:P0,alphatest_fragment:L0,alphatest_pars_fragment:D0,aomap_fragment:I0,aomap_pars_fragment:N0,batching_pars_vertex:U0,batching_vertex:F0,begin_vertex:O0,beginnormal_vertex:B0,bsdfs:k0,iridescence_fragment:z0,bumpmap_pars_fragment:G0,clipping_planes_fragment:H0,clipping_planes_pars_fragment:V0,clipping_planes_pars_vertex:$0,clipping_planes_vertex:W0,color_fragment:X0,color_pars_fragment:Y0,color_pars_vertex:q0,color_vertex:j0,common:K0,cube_uv_reflection_fragment:Z0,defaultnormal_vertex:J0,displacementmap_pars_vertex:Q0,displacementmap_vertex:ev,emissivemap_fragment:tv,emissivemap_pars_fragment:nv,colorspace_fragment:iv,colorspace_pars_fragment:sv,envmap_fragment:rv,envmap_common_pars_fragment:ov,envmap_pars_fragment:av,envmap_pars_vertex:lv,envmap_physical_pars_fragment:xv,envmap_vertex:cv,fog_vertex:uv,fog_pars_vertex:dv,fog_fragment:hv,fog_pars_fragment:fv,gradientmap_pars_fragment:pv,lightmap_pars_fragment:mv,lights_lambert_fragment:gv,lights_lambert_pars_fragment:_v,lights_pars_begin:vv,lights_toon_fragment:yv,lights_toon_pars_fragment:Sv,lights_phong_fragment:Mv,lights_phong_pars_fragment:wv,lights_physical_fragment:bv,lights_physical_pars_fragment:Ev,lights_fragment_begin:Tv,lights_fragment_maps:Av,lights_fragment_end:Rv,logdepthbuf_fragment:Cv,logdepthbuf_pars_fragment:Pv,logdepthbuf_pars_vertex:Lv,logdepthbuf_vertex:Dv,map_fragment:Iv,map_pars_fragment:Nv,map_particle_fragment:Uv,map_particle_pars_fragment:Fv,metalnessmap_fragment:Ov,metalnessmap_pars_fragment:Bv,morphinstance_vertex:kv,morphcolor_vertex:zv,morphnormal_vertex:Gv,morphtarget_pars_vertex:Hv,morphtarget_vertex:Vv,normal_fragment_begin:$v,normal_fragment_maps:Wv,normal_pars_fragment:Xv,normal_pars_vertex:Yv,normal_vertex:qv,normalmap_pars_fragment:jv,clearcoat_normal_fragment_begin:Kv,clearcoat_normal_fragment_maps:Zv,clearcoat_pars_fragment:Jv,iridescence_pars_fragment:Qv,opaque_fragment:ex,packing:tx,premultiplied_alpha_fragment:nx,project_vertex:ix,dithering_fragment:sx,dithering_pars_fragment:rx,roughnessmap_fragment:ox,roughnessmap_pars_fragment:ax,shadowmap_pars_fragment:lx,shadowmap_pars_vertex:cx,shadowmap_vertex:ux,shadowmask_pars_fragment:dx,skinbase_vertex:hx,skinning_pars_vertex:fx,skinning_vertex:px,skinnormal_vertex:mx,specularmap_fragment:gx,specularmap_pars_fragment:_x,tonemapping_fragment:vx,tonemapping_pars_fragment:xx,transmission_fragment:yx,transmission_pars_fragment:Sx,uv_pars_fragment:Mx,uv_pars_vertex:wx,uv_vertex:bx,worldpos_vertex:Ex,background_vert:Tx,background_frag:Ax,backgroundCube_vert:Rx,backgroundCube_frag:Cx,cube_vert:Px,cube_frag:Lx,depth_vert:Dx,depth_frag:Ix,distanceRGBA_vert:Nx,distanceRGBA_frag:Ux,equirect_vert:Fx,equirect_frag:Ox,linedashed_vert:Bx,linedashed_frag:kx,meshbasic_vert:zx,meshbasic_frag:Gx,meshlambert_vert:Hx,meshlambert_frag:Vx,meshmatcap_vert:$x,meshmatcap_frag:Wx,meshnormal_vert:Xx,meshnormal_frag:Yx,meshphong_vert:qx,meshphong_frag:jx,meshphysical_vert:Kx,meshphysical_frag:Zx,meshtoon_vert:Jx,meshtoon_frag:Qx,points_vert:ey,points_frag:ty,shadow_vert:ny,shadow_frag:iy,sprite_vert:sy,sprite_frag:ry},ue={common:{diffuse:{value:new Pe(16777215)},opacity:{value:1},map:{value:null},mapTransform:{value:new qe},alphaMap:{value:null},alphaMapTransform:{value:new qe},alphaTest:{value:0}},specularmap:{specularMap:{value:null},specularMapTransform:{value:new qe}},envmap:{envMap:{value:null},envMapRotation:{value:new qe},flipEnvMap:{value:-1},reflectivity:{value:1},ior:{value:1.5},refractionRatio:{value:.98}},aomap:{aoMap:{value:null},aoMapIntensity:{value:1},aoMapTransform:{value:new qe}},lightmap:{lightMap:{value:null},lightMapIntensity:{value:1},lightMapTransform:{value:new qe}},bumpmap:{bumpMap:{value:null},bumpMapTransform:{value:new qe},bumpScale:{value:1}},normalmap:{normalMap:{value:null},normalMapTransform:{value:new qe},normalScale:{value:new Ve(1,1)}},displacementmap:{displacementMap:{value:null},displacementMapTransform:{value:new qe},displacementScale:{value:1},displacementBias:{value:0}},emissivemap:{emissiveMap:{value:null},emissiveMapTransform:{value:new qe}},metalnessmap:{metalnessMap:{value:null},metalnessMapTransform:{value:new qe}},roughnessmap:{roughnessMap:{value:null},roughnessMapTransform:{value:new qe}},gradientmap:{gradientMap:{value:null}},fog:{fogDensity:{value:25e-5},fogNear:{value:1},fogFar:{value:2e3},fogColor:{value:new Pe(16777215)}},lights:{ambientLightColor:{value:[]},lightProbe:{value:[]},directionalLights:{value:[],properties:{direction:{},color:{}}},directionalLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},directionalShadowMap:{value:[]},directionalShadowMatrix:{value:[]},spotLights:{value:[],properties:{color:{},position:{},direction:{},distance:{},coneCos:{},penumbraCos:{},decay:{}}},spotLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},spotLightMap:{value:[]},spotShadowMap:{value:[]},spotLightMatrix:{value:[]},pointLights:{value:[],properties:{color:{},position:{},decay:{},distance:{}}},pointLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{},shadowCameraNear:{},shadowCameraFar:{}}},pointShadowMap:{value:[]},pointShadowMatrix:{value:[]},hemisphereLights:{value:[],properties:{direction:{},skyColor:{},groundColor:{}}},rectAreaLights:{value:[],properties:{color:{},position:{},width:{},height:{}}},ltc_1:{value:null},ltc_2:{value:null}},points:{diffuse:{value:new Pe(16777215)},opacity:{value:1},size:{value:1},scale:{value:1},map:{value:null},alphaMap:{value:null},alphaMapTransform:{value:new qe},alphaTest:{value:0},uvTransform:{value:new qe}},sprite:{diffuse:{value:new Pe(16777215)},opacity:{value:1},center:{value:new Ve(.5,.5)},rotation:{value:0},map:{value:null},mapTransform:{value:new qe},alphaMap:{value:null},alphaMapTransform:{value:new qe},alphaTest:{value:0}}},Cn={basic:{uniforms:Ht([ue.common,ue.specularmap,ue.envmap,ue.aomap,ue.lightmap,ue.fog]),vertexShader:Ze.meshbasic_vert,fragmentShader:Ze.meshbasic_frag},lambert:{uniforms:Ht([ue.common,ue.specularmap,ue.envmap,ue.aomap,ue.lightmap,ue.emissivemap,ue.bumpmap,ue.normalmap,ue.displacementmap,ue.fog,ue.lights,{emissive:{value:new Pe(0)}}]),vertexShader:Ze.meshlambert_vert,fragmentShader:Ze.meshlambert_frag},phong:{uniforms:Ht([ue.common,ue.specularmap,ue.envmap,ue.aomap,ue.lightmap,ue.emissivemap,ue.bumpmap,ue.normalmap,ue.displacementmap,ue.fog,ue.lights,{emissive:{value:new Pe(0)},specular:{value:new Pe(1118481)},shininess:{value:30}}]),vertexShader:Ze.meshphong_vert,fragmentShader:Ze.meshphong_frag},standard:{uniforms:Ht([ue.common,ue.envmap,ue.aomap,ue.lightmap,ue.emissivemap,ue.bumpmap,ue.normalmap,ue.displacementmap,ue.roughnessmap,ue.metalnessmap,ue.fog,ue.lights,{emissive:{value:new Pe(0)},roughness:{value:1},metalness:{value:0},envMapIntensity:{value:1}}]),vertexShader:Ze.meshphysical_vert,fragmentShader:Ze.meshphysical_frag},toon:{uniforms:Ht([ue.common,ue.aomap,ue.lightmap,ue.emissivemap,ue.bumpmap,ue.normalmap,ue.displacementmap,ue.gradientmap,ue.fog,ue.lights,{emissive:{value:new Pe(0)}}]),vertexShader:Ze.meshtoon_vert,fragmentShader:Ze.meshtoon_frag},matcap:{uniforms:Ht([ue.common,ue.bumpmap,ue.normalmap,ue.displacementmap,ue.fog,{matcap:{value:null}}]),vertexShader:Ze.meshmatcap_vert,fragmentShader:Ze.meshmatcap_frag},points:{uniforms:Ht([ue.points,ue.fog]),vertexShader:Ze.points_vert,fragmentShader:Ze.points_frag},dashed:{uniforms:Ht([ue.common,ue.fog,{scale:{value:1},dashSize:{value:1},totalSize:{value:2}}]),vertexShader:Ze.linedashed_vert,fragmentShader:Ze.linedashed_frag},depth:{uniforms:Ht([ue.common,ue.displacementmap]),vertexShader:Ze.depth_vert,fragmentShader:Ze.depth_frag},normal:{uniforms:Ht([ue.common,ue.bumpmap,ue.normalmap,ue.displacementmap,{opacity:{value:1}}]),vertexShader:Ze.meshnormal_vert,fragmentShader:Ze.meshnormal_frag},sprite:{uniforms:Ht([ue.sprite,ue.fog]),vertexShader:Ze.sprite_vert,fragmentShader:Ze.sprite_frag},background:{uniforms:{uvTransform:{value:new qe},t2D:{value:null},backgroundIntensity:{value:1}},vertexShader:Ze.background_vert,fragmentShader:Ze.background_frag},backgroundCube:{uniforms:{envMap:{value:null},flipEnvMap:{value:-1},backgroundBlurriness:{value:0},backgroundIntensity:{value:1},backgroundRotation:{value:new qe}},vertexShader:Ze.backgroundCube_vert,fragmentShader:Ze.backgroundCube_frag},cube:{uniforms:{tCube:{value:null},tFlip:{value:-1},opacity:{value:1}},vertexShader:Ze.cube_vert,fragmentShader:Ze.cube_frag},equirect:{uniforms:{tEquirect:{value:null}},vertexShader:Ze.equirect_vert,fragmentShader:Ze.equirect_frag},distanceRGBA:{uniforms:Ht([ue.common,ue.displacementmap,{referencePosition:{value:new O},nearDistance:{value:1},farDistance:{value:1e3}}]),vertexShader:Ze.distanceRGBA_vert,fragmentShader:Ze.distanceRGBA_frag},shadow:{uniforms:Ht([ue.lights,ue.fog,{color:{value:new Pe(0)},opacity:{value:1}}]),vertexShader:Ze.shadow_vert,fragmentShader:Ze.shadow_frag}};Cn.physical={uniforms:Ht([Cn.standard.uniforms,{clearcoat:{value:0},clearcoatMap:{value:null},clearcoatMapTransform:{value:new qe},clearcoatNormalMap:{value:null},clearcoatNormalMapTransform:{value:new qe},clearcoatNormalScale:{value:new Ve(1,1)},clearcoatRoughness:{value:0},clearcoatRoughnessMap:{value:null},clearcoatRoughnessMapTransform:{value:new qe},dispersion:{value:0},iridescence:{value:0},iridescenceMap:{value:null},iridescenceMapTransform:{value:new qe},iridescenceIOR:{value:1.3},iridescenceThicknessMinimum:{value:100},iridescenceThicknessMaximum:{value:400},iridescenceThicknessMap:{value:null},iridescenceThicknessMapTransform:{value:new qe},sheen:{value:0},sheenColor:{value:new Pe(0)},sheenColorMap:{value:null},sheenColorMapTransform:{value:new qe},sheenRoughness:{value:1},sheenRoughnessMap:{value:null},sheenRoughnessMapTransform:{value:new qe},transmission:{value:0},transmissionMap:{value:null},transmissionMapTransform:{value:new qe},transmissionSamplerSize:{value:new Ve},transmissionSamplerMap:{value:null},thickness:{value:0},thicknessMap:{value:null},thicknessMapTransform:{value:new qe},attenuationDistance:{value:0},attenuationColor:{value:new Pe(0)},specularColor:{value:new Pe(1,1,1)},specularColorMap:{value:null},specularColorMapTransform:{value:new qe},specularIntensity:{value:1},specularIntensityMap:{value:null},specularIntensityMapTransform:{value:new qe},anisotropyVector:{value:new Ve},anisotropyMap:{value:null},anisotropyMapTransform:{value:new qe}}]),vertexShader:Ze.meshphysical_vert,fragmentShader:Ze.meshphysical_frag};const mo={r:0,b:0,g:0},Di=new Fn,oy=new rt;function ay(n,e,t,i,s,r,o){const a=new Pe(0);let l=r===!0?0:1,c,u,d=null,h=0,p=null;function g(y){let M=y.isScene===!0?y.background:null;return M&&M.isTexture&&(M=(y.backgroundBlurriness>0?t:e).get(M)),M}function v(y){let M=!1;const P=g(y);P===null?f(a,l):P&&P.isColor&&(f(P,1),M=!0);const E=n.xr.getEnvironmentBlendMode();E==="additive"?i.buffers.color.setClear(0,0,0,1,o):E==="alpha-blend"&&i.buffers.color.setClear(0,0,0,0,o),(n.autoClear||M)&&(i.buffers.depth.setTest(!0),i.buffers.depth.setMask(!0),i.buffers.color.setMask(!0),n.clear(n.autoClearColor,n.autoClearDepth,n.autoClearStencil))}function m(y,M){const P=g(M);P&&(P.isCubeTexture||P.mapping===ra)?(u===void 0&&(u=new xn(new an(1,1,1),new bi({name:"BackgroundCubeMaterial",uniforms:Os(Cn.backgroundCube.uniforms),vertexShader:Cn.backgroundCube.vertexShader,fragmentShader:Cn.backgroundCube.fragmentShader,side:Jt,depthTest:!1,depthWrite:!1,fog:!1,allowOverride:!1})),u.geometry.deleteAttribute("normal"),u.geometry.deleteAttribute("uv"),u.onBeforeRender=function(E,A,R){this.matrixWorld.copyPosition(R.matrixWorld)},Object.defineProperty(u.material,"envMap",{get:function(){return this.uniforms.envMap.value}}),s.update(u)),Di.copy(M.backgroundRotation),Di.x*=-1,Di.y*=-1,Di.z*=-1,P.isCubeTexture&&P.isRenderTargetTexture===!1&&(Di.y*=-1,Di.z*=-1),u.material.uniforms.envMap.value=P,u.material.uniforms.flipEnvMap.value=P.isCubeTexture&&P.isRenderTargetTexture===!1?-1:1,u.material.uniforms.backgroundBlurriness.value=M.backgroundBlurriness,u.material.uniforms.backgroundIntensity.value=M.backgroundIntensity,u.material.uniforms.backgroundRotation.value.setFromMatrix4(oy.makeRotationFromEuler(Di)),u.material.toneMapped=it.getTransfer(P.colorSpace)!==ut,(d!==P||h!==P.version||p!==n.toneMapping)&&(u.material.needsUpdate=!0,d=P,h=P.version,p=n.toneMapping),u.layers.enableAll(),y.unshift(u,u.geometry,u.material,0,0,null)):P&&P.isTexture&&(c===void 0&&(c=new xn(new la(2,2),new bi({name:"BackgroundMaterial",uniforms:Os(Cn.background.uniforms),vertexShader:Cn.background.vertexShader,fragmentShader:Cn.background.fragmentShader,side:wi,depthTest:!1,depthWrite:!1,fog:!1,allowOverride:!1})),c.geometry.deleteAttribute("normal"),Object.defineProperty(c.material,"map",{get:function(){return this.uniforms.t2D.value}}),s.update(c)),c.material.uniforms.t2D.value=P,c.material.uniforms.backgroundIntensity.value=M.backgroundIntensity,c.material.toneMapped=it.getTransfer(P.colorSpace)!==ut,P.matrixAutoUpdate===!0&&P.updateMatrix(),c.material.uniforms.uvTransform.value.copy(P.matrix),(d!==P||h!==P.version||p!==n.toneMapping)&&(c.material.needsUpdate=!0,d=P,h=P.version,p=n.toneMapping),c.layers.enableAll(),y.unshift(c,c.geometry,c.material,0,0,null))}function f(y,M){y.getRGB(mo,ap(n)),i.buffers.color.setClear(mo.r,mo.g,mo.b,M,o)}function T(){u!==void 0&&(u.geometry.dispose(),u.material.dispose(),u=void 0),c!==void 0&&(c.geometry.dispose(),c.material.dispose(),c=void 0)}return{getClearColor:function(){return a},setClearColor:function(y,M=1){a.set(y),l=M,f(a,l)},getClearAlpha:function(){return l},setClearAlpha:function(y){l=y,f(a,l)},render:v,addToRenderList:m,dispose:T}}function ly(n,e){const t=n.getParameter(n.MAX_VERTEX_ATTRIBS),i={},s=h(null);let r=s,o=!1;function a(S,D,$,k,q){let Z=!1;const V=d(k,$,D);r!==V&&(r=V,c(r.object)),Z=p(S,k,$,q),Z&&g(S,k,$,q),q!==null&&e.update(q,n.ELEMENT_ARRAY_BUFFER),(Z||o)&&(o=!1,M(S,D,$,k),q!==null&&n.bindBuffer(n.ELEMENT_ARRAY_BUFFER,e.get(q).buffer))}function l(){return n.createVertexArray()}function c(S){return n.bindVertexArray(S)}function u(S){return n.deleteVertexArray(S)}function d(S,D,$){const k=$.wireframe===!0;let q=i[S.id];q===void 0&&(q={},i[S.id]=q);let Z=q[D.id];Z===void 0&&(Z={},q[D.id]=Z);let V=Z[k];return V===void 0&&(V=h(l()),Z[k]=V),V}function h(S){const D=[],$=[],k=[];for(let q=0;q<t;q++)D[q]=0,$[q]=0,k[q]=0;return{geometry:null,program:null,wireframe:!1,newAttributes:D,enabledAttributes:$,attributeDivisors:k,object:S,attributes:{},index:null}}function p(S,D,$,k){const q=r.attributes,Z=D.attributes;let V=0;const se=$.getAttributes();for(const H in se)if(se[H].location>=0){const ge=q[H];let Te=Z[H];if(Te===void 0&&(H==="instanceMatrix"&&S.instanceMatrix&&(Te=S.instanceMatrix),H==="instanceColor"&&S.instanceColor&&(Te=S.instanceColor)),ge===void 0||ge.attribute!==Te||Te&&ge.data!==Te.data)return!0;V++}return r.attributesNum!==V||r.index!==k}function g(S,D,$,k){const q={},Z=D.attributes;let V=0;const se=$.getAttributes();for(const H in se)if(se[H].location>=0){let ge=Z[H];ge===void 0&&(H==="instanceMatrix"&&S.instanceMatrix&&(ge=S.instanceMatrix),H==="instanceColor"&&S.instanceColor&&(ge=S.instanceColor));const Te={};Te.attribute=ge,ge&&ge.data&&(Te.data=ge.data),q[H]=Te,V++}r.attributes=q,r.attributesNum=V,r.index=k}function v(){const S=r.newAttributes;for(let D=0,$=S.length;D<$;D++)S[D]=0}function m(S){f(S,0)}function f(S,D){const $=r.newAttributes,k=r.enabledAttributes,q=r.attributeDivisors;$[S]=1,k[S]===0&&(n.enableVertexAttribArray(S),k[S]=1),q[S]!==D&&(n.vertexAttribDivisor(S,D),q[S]=D)}function T(){const S=r.newAttributes,D=r.enabledAttributes;for(let $=0,k=D.length;$<k;$++)D[$]!==S[$]&&(n.disableVertexAttribArray($),D[$]=0)}function y(S,D,$,k,q,Z,V){V===!0?n.vertexAttribIPointer(S,D,$,q,Z):n.vertexAttribPointer(S,D,$,k,q,Z)}function M(S,D,$,k){v();const q=k.attributes,Z=$.getAttributes(),V=D.defaultAttributeValues;for(const se in Z){const H=Z[se];if(H.location>=0){let ae=q[se];if(ae===void 0&&(se==="instanceMatrix"&&S.instanceMatrix&&(ae=S.instanceMatrix),se==="instanceColor"&&S.instanceColor&&(ae=S.instanceColor)),ae!==void 0){const ge=ae.normalized,Te=ae.itemSize,$e=e.get(ae);if($e===void 0)continue;const je=$e.buffer,X=$e.type,le=$e.bytesPerElement,Ee=X===n.INT||X===n.UNSIGNED_INT||ae.gpuType===eu;if(ae.isInterleavedBufferAttribute){const fe=ae.data,we=fe.stride,Qe=ae.offset;if(fe.isInstancedInterleavedBuffer){for(let Y=0;Y<H.locationSize;Y++)f(H.location+Y,fe.meshPerAttribute);S.isInstancedMesh!==!0&&k._maxInstanceCount===void 0&&(k._maxInstanceCount=fe.meshPerAttribute*fe.count)}else for(let Y=0;Y<H.locationSize;Y++)m(H.location+Y);n.bindBuffer(n.ARRAY_BUFFER,je);for(let Y=0;Y<H.locationSize;Y++)y(H.location+Y,Te/H.locationSize,X,ge,we*le,(Qe+Te/H.locationSize*Y)*le,Ee)}else{if(ae.isInstancedBufferAttribute){for(let fe=0;fe<H.locationSize;fe++)f(H.location+fe,ae.meshPerAttribute);S.isInstancedMesh!==!0&&k._maxInstanceCount===void 0&&(k._maxInstanceCount=ae.meshPerAttribute*ae.count)}else for(let fe=0;fe<H.locationSize;fe++)m(H.location+fe);n.bindBuffer(n.ARRAY_BUFFER,je);for(let fe=0;fe<H.locationSize;fe++)y(H.location+fe,Te/H.locationSize,X,ge,Te*le,Te/H.locationSize*fe*le,Ee)}}else if(V!==void 0){const ge=V[se];if(ge!==void 0)switch(ge.length){case 2:n.vertexAttrib2fv(H.location,ge);break;case 3:n.vertexAttrib3fv(H.location,ge);break;case 4:n.vertexAttrib4fv(H.location,ge);break;default:n.vertexAttrib1fv(H.location,ge)}}}}T()}function P(){R();for(const S in i){const D=i[S];for(const $ in D){const k=D[$];for(const q in k)u(k[q].object),delete k[q];delete D[$]}delete i[S]}}function E(S){if(i[S.id]===void 0)return;const D=i[S.id];for(const $ in D){const k=D[$];for(const q in k)u(k[q].object),delete k[q];delete D[$]}delete i[S.id]}function A(S){for(const D in i){const $=i[D];if($[S.id]===void 0)continue;const k=$[S.id];for(const q in k)u(k[q].object),delete k[q];delete $[S.id]}}function R(){w(),o=!0,r!==s&&(r=s,c(r.object))}function w(){s.geometry=null,s.program=null,s.wireframe=!1}return{setup:a,reset:R,resetDefaultState:w,dispose:P,releaseStatesOfGeometry:E,releaseStatesOfProgram:A,initAttributes:v,enableAttribute:m,disableUnusedAttributes:T}}function cy(n,e,t){let i;function s(c){i=c}function r(c,u){n.drawArrays(i,c,u),t.update(u,i,1)}function o(c,u,d){d!==0&&(n.drawArraysInstanced(i,c,u,d),t.update(u,i,d))}function a(c,u,d){if(d===0)return;e.get("WEBGL_multi_draw").multiDrawArraysWEBGL(i,c,0,u,0,d);let p=0;for(let g=0;g<d;g++)p+=u[g];t.update(p,i,1)}function l(c,u,d,h){if(d===0)return;const p=e.get("WEBGL_multi_draw");if(p===null)for(let g=0;g<c.length;g++)o(c[g],u[g],h[g]);else{p.multiDrawArraysInstancedWEBGL(i,c,0,u,0,h,0,d);let g=0;for(let v=0;v<d;v++)g+=u[v]*h[v];t.update(g,i,1)}}this.setMode=s,this.render=r,this.renderInstances=o,this.renderMultiDraw=a,this.renderMultiDrawInstances=l}function uy(n,e,t,i){let s;function r(){if(s!==void 0)return s;if(e.has("EXT_texture_filter_anisotropic")===!0){const A=e.get("EXT_texture_filter_anisotropic");s=n.getParameter(A.MAX_TEXTURE_MAX_ANISOTROPY_EXT)}else s=0;return s}function o(A){return!(A!==Tn&&i.convert(A)!==n.getParameter(n.IMPLEMENTATION_COLOR_READ_FORMAT))}function a(A){const R=A===Rr&&(e.has("EXT_color_buffer_half_float")||e.has("EXT_color_buffer_float"));return!(A!==Un&&i.convert(A)!==n.getParameter(n.IMPLEMENTATION_COLOR_READ_TYPE)&&A!==Ln&&!R)}function l(A){if(A==="highp"){if(n.getShaderPrecisionFormat(n.VERTEX_SHADER,n.HIGH_FLOAT).precision>0&&n.getShaderPrecisionFormat(n.FRAGMENT_SHADER,n.HIGH_FLOAT).precision>0)return"highp";A="mediump"}return A==="mediump"&&n.getShaderPrecisionFormat(n.VERTEX_SHADER,n.MEDIUM_FLOAT).precision>0&&n.getShaderPrecisionFormat(n.FRAGMENT_SHADER,n.MEDIUM_FLOAT).precision>0?"mediump":"lowp"}let c=t.precision!==void 0?t.precision:"highp";const u=l(c);u!==c&&(console.warn("THREE.WebGLRenderer:",c,"not supported, using",u,"instead."),c=u);const d=t.logarithmicDepthBuffer===!0,h=t.reverseDepthBuffer===!0&&e.has("EXT_clip_control"),p=n.getParameter(n.MAX_TEXTURE_IMAGE_UNITS),g=n.getParameter(n.MAX_VERTEX_TEXTURE_IMAGE_UNITS),v=n.getParameter(n.MAX_TEXTURE_SIZE),m=n.getParameter(n.MAX_CUBE_MAP_TEXTURE_SIZE),f=n.getParameter(n.MAX_VERTEX_ATTRIBS),T=n.getParameter(n.MAX_VERTEX_UNIFORM_VECTORS),y=n.getParameter(n.MAX_VARYING_VECTORS),M=n.getParameter(n.MAX_FRAGMENT_UNIFORM_VECTORS),P=g>0,E=n.getParameter(n.MAX_SAMPLES);return{isWebGL2:!0,getMaxAnisotropy:r,getMaxPrecision:l,textureFormatReadable:o,textureTypeReadable:a,precision:c,logarithmicDepthBuffer:d,reverseDepthBuffer:h,maxTextures:p,maxVertexTextures:g,maxTextureSize:v,maxCubemapSize:m,maxAttributes:f,maxVertexUniforms:T,maxVaryings:y,maxFragmentUniforms:M,vertexTextures:P,maxSamples:E}}function dy(n){const e=this;let t=null,i=0,s=!1,r=!1;const o=new ai,a=new qe,l={value:null,needsUpdate:!1};this.uniform=l,this.numPlanes=0,this.numIntersection=0,this.init=function(d,h){const p=d.length!==0||h||i!==0||s;return s=h,i=d.length,p},this.beginShadows=function(){r=!0,u(null)},this.endShadows=function(){r=!1},this.setGlobalState=function(d,h){t=u(d,h,0)},this.setState=function(d,h,p){const g=d.clippingPlanes,v=d.clipIntersection,m=d.clipShadows,f=n.get(d);if(!s||g===null||g.length===0||r&&!m)r?u(null):c();else{const T=r?0:i,y=T*4;let M=f.clippingState||null;l.value=M,M=u(g,h,y,p);for(let P=0;P!==y;++P)M[P]=t[P];f.clippingState=M,this.numIntersection=v?this.numPlanes:0,this.numPlanes+=T}};function c(){l.value!==t&&(l.value=t,l.needsUpdate=i>0),e.numPlanes=i,e.numIntersection=0}function u(d,h,p,g){const v=d!==null?d.length:0;let m=null;if(v!==0){if(m=l.value,g!==!0||m===null){const f=p+v*4,T=h.matrixWorldInverse;a.getNormalMatrix(T),(m===null||m.length<f)&&(m=new Float32Array(f));for(let y=0,M=p;y!==v;++y,M+=4)o.copy(d[y]).applyMatrix4(T,a),o.normal.toArray(m,M),m[M+3]=o.constant}l.value=m,l.needsUpdate=!0}return e.numPlanes=v,e.numIntersection=0,m}}function hy(n){let e=new WeakMap;function t(o,a){return a===Nl?o.mapping=Ns:a===Ul&&(o.mapping=Us),o}function i(o){if(o&&o.isTexture){const a=o.mapping;if(a===Nl||a===Ul)if(e.has(o)){const l=e.get(o).texture;return t(l,o.mapping)}else{const l=o.image;if(l&&l.height>0){const c=new c0(l.height);return c.fromEquirectangularTexture(n,o),e.set(o,c),o.addEventListener("dispose",s),t(c.texture,o.mapping)}else return null}}return o}function s(o){const a=o.target;a.removeEventListener("dispose",s);const l=e.get(a);l!==void 0&&(e.delete(a),l.dispose())}function r(){e=new WeakMap}return{get:i,dispose:r}}const ws=4,Zd=[.125,.215,.35,.446,.526,.582],Fi=20,nl=new pp,Jd=new Pe;let il=null,sl=0,rl=0,ol=!1;const Ni=(1+Math.sqrt(5))/2,_s=1/Ni,Qd=[new O(-Ni,_s,0),new O(Ni,_s,0),new O(-_s,0,Ni),new O(_s,0,Ni),new O(0,Ni,-_s),new O(0,Ni,_s),new O(-1,1,-1),new O(1,1,-1),new O(-1,1,1),new O(1,1,1)],fy=new O;class eh{constructor(e){this._renderer=e,this._pingPongRenderTarget=null,this._lodMax=0,this._cubeSize=0,this._lodPlanes=[],this._sizeLods=[],this._sigmas=[],this._blurMaterial=null,this._cubemapMaterial=null,this._equirectMaterial=null,this._compileMaterial(this._blurMaterial)}fromScene(e,t=0,i=.1,s=100,r={}){const{size:o=256,position:a=fy}=r;il=this._renderer.getRenderTarget(),sl=this._renderer.getActiveCubeFace(),rl=this._renderer.getActiveMipmapLevel(),ol=this._renderer.xr.enabled,this._renderer.xr.enabled=!1,this._setSize(o);const l=this._allocateTargets();return l.depthBuffer=!0,this._sceneToCubeUV(e,i,s,l,a),t>0&&this._blur(l,0,0,t),this._applyPMREM(l),this._cleanup(l),l}fromEquirectangular(e,t=null){return this._fromTexture(e,t)}fromCubemap(e,t=null){return this._fromTexture(e,t)}compileCubemapShader(){this._cubemapMaterial===null&&(this._cubemapMaterial=ih(),this._compileMaterial(this._cubemapMaterial))}compileEquirectangularShader(){this._equirectMaterial===null&&(this._equirectMaterial=nh(),this._compileMaterial(this._equirectMaterial))}dispose(){this._dispose(),this._cubemapMaterial!==null&&this._cubemapMaterial.dispose(),this._equirectMaterial!==null&&this._equirectMaterial.dispose()}_setSize(e){this._lodMax=Math.floor(Math.log2(e)),this._cubeSize=Math.pow(2,this._lodMax)}_dispose(){this._blurMaterial!==null&&this._blurMaterial.dispose(),this._pingPongRenderTarget!==null&&this._pingPongRenderTarget.dispose();for(let e=0;e<this._lodPlanes.length;e++)this._lodPlanes[e].dispose()}_cleanup(e){this._renderer.setRenderTarget(il,sl,rl),this._renderer.xr.enabled=ol,e.scissorTest=!1,go(e,0,0,e.width,e.height)}_fromTexture(e,t){e.mapping===Ns||e.mapping===Us?this._setSize(e.image.length===0?16:e.image[0].width||e.image[0].image.width):this._setSize(e.image.width/4),il=this._renderer.getRenderTarget(),sl=this._renderer.getActiveCubeFace(),rl=this._renderer.getActiveMipmapLevel(),ol=this._renderer.xr.enabled,this._renderer.xr.enabled=!1;const i=t||this._allocateTargets();return this._textureToCubeUV(e,i),this._applyPMREM(i),this._cleanup(i),i}_allocateTargets(){const e=3*Math.max(this._cubeSize,112),t=4*this._cubeSize,i={magFilter:Pn,minFilter:Pn,generateMipmaps:!1,type:Rr,format:Tn,colorSpace:Fs,depthBuffer:!1},s=th(e,t,i);if(this._pingPongRenderTarget===null||this._pingPongRenderTarget.width!==e||this._pingPongRenderTarget.height!==t){this._pingPongRenderTarget!==null&&this._dispose(),this._pingPongRenderTarget=th(e,t,i);const{_lodMax:r}=this;({sizeLods:this._sizeLods,lodPlanes:this._lodPlanes,sigmas:this._sigmas}=py(r)),this._blurMaterial=my(r,e,t)}return s}_compileMaterial(e){const t=new xn(this._lodPlanes[0],e);this._renderer.compile(t,nl)}_sceneToCubeUV(e,t,i,s,r){const l=new on(90,1,t,i),c=[1,-1,1,1,1,1],u=[1,1,1,-1,-1,-1],d=this._renderer,h=d.autoClear,p=d.toneMapping;d.getClearColor(Jd),d.toneMapping=yi,d.autoClear=!1;const g=new oa({name:"PMREM.Background",side:Jt,depthWrite:!1,depthTest:!1}),v=new xn(new an,g);let m=!1;const f=e.background;f?f.isColor&&(g.color.copy(f),e.background=null,m=!0):(g.color.copy(Jd),m=!0);for(let T=0;T<6;T++){const y=T%3;y===0?(l.up.set(0,c[T],0),l.position.set(r.x,r.y,r.z),l.lookAt(r.x+u[T],r.y,r.z)):y===1?(l.up.set(0,0,c[T]),l.position.set(r.x,r.y,r.z),l.lookAt(r.x,r.y+u[T],r.z)):(l.up.set(0,c[T],0),l.position.set(r.x,r.y,r.z),l.lookAt(r.x,r.y,r.z+u[T]));const M=this._cubeSize;go(s,y*M,T>2?M:0,M,M),d.setRenderTarget(s),m&&d.render(v,l),d.render(e,l)}v.geometry.dispose(),v.material.dispose(),d.toneMapping=p,d.autoClear=h,e.background=f}_textureToCubeUV(e,t){const i=this._renderer,s=e.mapping===Ns||e.mapping===Us;s?(this._cubemapMaterial===null&&(this._cubemapMaterial=ih()),this._cubemapMaterial.uniforms.flipEnvMap.value=e.isRenderTargetTexture===!1?-1:1):this._equirectMaterial===null&&(this._equirectMaterial=nh());const r=s?this._cubemapMaterial:this._equirectMaterial,o=new xn(this._lodPlanes[0],r),a=r.uniforms;a.envMap.value=e;const l=this._cubeSize;go(t,0,0,3*l,2*l),i.setRenderTarget(t),i.render(o,nl)}_applyPMREM(e){const t=this._renderer,i=t.autoClear;t.autoClear=!1;const s=this._lodPlanes.length;for(let r=1;r<s;r++){const o=Math.sqrt(this._sigmas[r]*this._sigmas[r]-this._sigmas[r-1]*this._sigmas[r-1]),a=Qd[(s-r-1)%Qd.length];this._blur(e,r-1,r,o,a)}t.autoClear=i}_blur(e,t,i,s,r){const o=this._pingPongRenderTarget;this._halfBlur(e,o,t,i,s,"latitudinal",r),this._halfBlur(o,e,i,i,s,"longitudinal",r)}_halfBlur(e,t,i,s,r,o,a){const l=this._renderer,c=this._blurMaterial;o!=="latitudinal"&&o!=="longitudinal"&&console.error("blur direction must be either latitudinal or longitudinal!");const u=3,d=new xn(this._lodPlanes[s],c),h=c.uniforms,p=this._sizeLods[i]-1,g=isFinite(r)?Math.PI/(2*p):2*Math.PI/(2*Fi-1),v=r/g,m=isFinite(r)?1+Math.floor(u*v):Fi;m>Fi&&console.warn(`sigmaRadians, ${r}, is too large and will clip, as it requested ${m} samples when the maximum is set to ${Fi}`);const f=[];let T=0;for(let A=0;A<Fi;++A){const R=A/v,w=Math.exp(-R*R/2);f.push(w),A===0?T+=w:A<m&&(T+=2*w)}for(let A=0;A<f.length;A++)f[A]=f[A]/T;h.envMap.value=e.texture,h.samples.value=m,h.weights.value=f,h.latitudinal.value=o==="latitudinal",a&&(h.poleAxis.value=a);const{_lodMax:y}=this;h.dTheta.value=g,h.mipInt.value=y-i;const M=this._sizeLods[s],P=3*M*(s>y-ws?s-y+ws:0),E=4*(this._cubeSize-M);go(t,P,E,3*M,2*M),l.setRenderTarget(t),l.render(d,nl)}}function py(n){const e=[],t=[],i=[];let s=n;const r=n-ws+1+Zd.length;for(let o=0;o<r;o++){const a=Math.pow(2,s);t.push(a);let l=1/a;o>n-ws?l=Zd[o-n+ws-1]:o===0&&(l=0),i.push(l);const c=1/(a-2),u=-c,d=1+c,h=[u,u,d,u,d,d,u,u,d,d,u,d],p=6,g=6,v=3,m=2,f=1,T=new Float32Array(v*g*p),y=new Float32Array(m*g*p),M=new Float32Array(f*g*p);for(let E=0;E<p;E++){const A=E%3*2/3-1,R=E>2?0:-1,w=[A,R,0,A+2/3,R,0,A+2/3,R+1,0,A,R,0,A+2/3,R+1,0,A,R+1,0];T.set(w,v*g*E),y.set(h,m*g*E);const S=[E,E,E,E,E,E];M.set(S,f*g*E)}const P=new Ot;P.setAttribute("position",new Ut(T,v)),P.setAttribute("uv",new Ut(y,m)),P.setAttribute("faceIndex",new Ut(M,f)),e.push(P),s>ws&&s--}return{lodPlanes:e,sizeLods:t,sigmas:i}}function th(n,e,t){const i=new Wi(n,e,t);return i.texture.mapping=ra,i.texture.name="PMREM.cubeUv",i.scissorTest=!0,i}function go(n,e,t,i,s){n.viewport.set(e,t,i,s),n.scissor.set(e,t,i,s)}function my(n,e,t){const i=new Float32Array(Fi),s=new O(0,1,0);return new bi({name:"SphericalGaussianBlur",defines:{n:Fi,CUBEUV_TEXEL_WIDTH:1/e,CUBEUV_TEXEL_HEIGHT:1/t,CUBEUV_MAX_MIP:`${n}.0`},uniforms:{envMap:{value:null},samples:{value:1},weights:{value:i},latitudinal:{value:!1},dTheta:{value:0},mipInt:{value:0},poleAxis:{value:s}},vertexShader:du(),fragmentShader:`

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
		`,blending:xi,depthTest:!1,depthWrite:!1})}function nh(){return new bi({name:"EquirectangularToCubeUV",uniforms:{envMap:{value:null}},vertexShader:du(),fragmentShader:`

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
		`,blending:xi,depthTest:!1,depthWrite:!1})}function ih(){return new bi({name:"CubemapToCubeUV",uniforms:{envMap:{value:null},flipEnvMap:{value:-1}},vertexShader:du(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			uniform float flipEnvMap;

			varying vec3 vOutputDirection;

			uniform samplerCube envMap;

			void main() {

				gl_FragColor = textureCube( envMap, vec3( flipEnvMap * vOutputDirection.x, vOutputDirection.yz ) );

			}
		`,blending:xi,depthTest:!1,depthWrite:!1})}function du(){return`

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
	`}function gy(n){let e=new WeakMap,t=null;function i(a){if(a&&a.isTexture){const l=a.mapping,c=l===Nl||l===Ul,u=l===Ns||l===Us;if(c||u){let d=e.get(a);const h=d!==void 0?d.texture.pmremVersion:0;if(a.isRenderTargetTexture&&a.pmremVersion!==h)return t===null&&(t=new eh(n)),d=c?t.fromEquirectangular(a,d):t.fromCubemap(a,d),d.texture.pmremVersion=a.pmremVersion,e.set(a,d),d.texture;if(d!==void 0)return d.texture;{const p=a.image;return c&&p&&p.height>0||u&&p&&s(p)?(t===null&&(t=new eh(n)),d=c?t.fromEquirectangular(a):t.fromCubemap(a),d.texture.pmremVersion=a.pmremVersion,e.set(a,d),a.addEventListener("dispose",r),d.texture):null}}}return a}function s(a){let l=0;const c=6;for(let u=0;u<c;u++)a[u]!==void 0&&l++;return l===c}function r(a){const l=a.target;l.removeEventListener("dispose",r);const c=e.get(l);c!==void 0&&(e.delete(l),c.dispose())}function o(){e=new WeakMap,t!==null&&(t.dispose(),t=null)}return{get:i,dispose:o}}function _y(n){const e={};function t(i){if(e[i]!==void 0)return e[i];let s;switch(i){case"WEBGL_depth_texture":s=n.getExtension("WEBGL_depth_texture")||n.getExtension("MOZ_WEBGL_depth_texture")||n.getExtension("WEBKIT_WEBGL_depth_texture");break;case"EXT_texture_filter_anisotropic":s=n.getExtension("EXT_texture_filter_anisotropic")||n.getExtension("MOZ_EXT_texture_filter_anisotropic")||n.getExtension("WEBKIT_EXT_texture_filter_anisotropic");break;case"WEBGL_compressed_texture_s3tc":s=n.getExtension("WEBGL_compressed_texture_s3tc")||n.getExtension("MOZ_WEBGL_compressed_texture_s3tc")||n.getExtension("WEBKIT_WEBGL_compressed_texture_s3tc");break;case"WEBGL_compressed_texture_pvrtc":s=n.getExtension("WEBGL_compressed_texture_pvrtc")||n.getExtension("WEBKIT_WEBGL_compressed_texture_pvrtc");break;default:s=n.getExtension(i)}return e[i]=s,s}return{has:function(i){return t(i)!==null},init:function(){t("EXT_color_buffer_float"),t("WEBGL_clip_cull_distance"),t("OES_texture_float_linear"),t("EXT_color_buffer_half_float"),t("WEBGL_multisampled_render_to_texture"),t("WEBGL_render_shared_exponent")},get:function(i){const s=t(i);return s===null&&As("THREE.WebGLRenderer: "+i+" extension not supported."),s}}}function vy(n,e,t,i){const s={},r=new WeakMap;function o(d){const h=d.target;h.index!==null&&e.remove(h.index);for(const g in h.attributes)e.remove(h.attributes[g]);h.removeEventListener("dispose",o),delete s[h.id];const p=r.get(h);p&&(e.remove(p),r.delete(h)),i.releaseStatesOfGeometry(h),h.isInstancedBufferGeometry===!0&&delete h._maxInstanceCount,t.memory.geometries--}function a(d,h){return s[h.id]===!0||(h.addEventListener("dispose",o),s[h.id]=!0,t.memory.geometries++),h}function l(d){const h=d.attributes;for(const p in h)e.update(h[p],n.ARRAY_BUFFER)}function c(d){const h=[],p=d.index,g=d.attributes.position;let v=0;if(p!==null){const T=p.array;v=p.version;for(let y=0,M=T.length;y<M;y+=3){const P=T[y+0],E=T[y+1],A=T[y+2];h.push(P,E,E,A,A,P)}}else if(g!==void 0){const T=g.array;v=g.version;for(let y=0,M=T.length/3-1;y<M;y+=3){const P=y+0,E=y+1,A=y+2;h.push(P,E,E,A,A,P)}}else return;const m=new(np(h)?op:rp)(h,1);m.version=v;const f=r.get(d);f&&e.remove(f),r.set(d,m)}function u(d){const h=r.get(d);if(h){const p=d.index;p!==null&&h.version<p.version&&c(d)}else c(d);return r.get(d)}return{get:a,update:l,getWireframeAttribute:u}}function xy(n,e,t){let i;function s(h){i=h}let r,o;function a(h){r=h.type,o=h.bytesPerElement}function l(h,p){n.drawElements(i,p,r,h*o),t.update(p,i,1)}function c(h,p,g){g!==0&&(n.drawElementsInstanced(i,p,r,h*o,g),t.update(p,i,g))}function u(h,p,g){if(g===0)return;e.get("WEBGL_multi_draw").multiDrawElementsWEBGL(i,p,0,r,h,0,g);let m=0;for(let f=0;f<g;f++)m+=p[f];t.update(m,i,1)}function d(h,p,g,v){if(g===0)return;const m=e.get("WEBGL_multi_draw");if(m===null)for(let f=0;f<h.length;f++)c(h[f]/o,p[f],v[f]);else{m.multiDrawElementsInstancedWEBGL(i,p,0,r,h,0,v,0,g);let f=0;for(let T=0;T<g;T++)f+=p[T]*v[T];t.update(f,i,1)}}this.setMode=s,this.setIndex=a,this.render=l,this.renderInstances=c,this.renderMultiDraw=u,this.renderMultiDrawInstances=d}function yy(n){const e={geometries:0,textures:0},t={frame:0,calls:0,triangles:0,points:0,lines:0};function i(r,o,a){switch(t.calls++,o){case n.TRIANGLES:t.triangles+=a*(r/3);break;case n.LINES:t.lines+=a*(r/2);break;case n.LINE_STRIP:t.lines+=a*(r-1);break;case n.LINE_LOOP:t.lines+=a*r;break;case n.POINTS:t.points+=a*r;break;default:console.error("THREE.WebGLInfo: Unknown draw mode:",o);break}}function s(){t.calls=0,t.triangles=0,t.points=0,t.lines=0}return{memory:e,render:t,programs:null,autoReset:!0,reset:s,update:i}}function Sy(n,e,t){const i=new WeakMap,s=new Mt;function r(o,a,l){const c=o.morphTargetInfluences,u=a.morphAttributes.position||a.morphAttributes.normal||a.morphAttributes.color,d=u!==void 0?u.length:0;let h=i.get(a);if(h===void 0||h.count!==d){let w=function(){A.dispose(),i.delete(a),a.removeEventListener("dispose",w)};h!==void 0&&h.texture.dispose();const p=a.morphAttributes.position!==void 0,g=a.morphAttributes.normal!==void 0,v=a.morphAttributes.color!==void 0,m=a.morphAttributes.position||[],f=a.morphAttributes.normal||[],T=a.morphAttributes.color||[];let y=0;p===!0&&(y=1),g===!0&&(y=2),v===!0&&(y=3);let M=a.attributes.position.count*y,P=1;M>e.maxTextureSize&&(P=Math.ceil(M/e.maxTextureSize),M=e.maxTextureSize);const E=new Float32Array(M*P*4*d),A=new ip(E,M,P,d);A.type=Ln,A.needsUpdate=!0;const R=y*4;for(let S=0;S<d;S++){const D=m[S],$=f[S],k=T[S],q=M*P*4*S;for(let Z=0;Z<D.count;Z++){const V=Z*R;p===!0&&(s.fromBufferAttribute(D,Z),E[q+V+0]=s.x,E[q+V+1]=s.y,E[q+V+2]=s.z,E[q+V+3]=0),g===!0&&(s.fromBufferAttribute($,Z),E[q+V+4]=s.x,E[q+V+5]=s.y,E[q+V+6]=s.z,E[q+V+7]=0),v===!0&&(s.fromBufferAttribute(k,Z),E[q+V+8]=s.x,E[q+V+9]=s.y,E[q+V+10]=s.z,E[q+V+11]=k.itemSize===4?s.w:1)}}h={count:d,texture:A,size:new Ve(M,P)},i.set(a,h),a.addEventListener("dispose",w)}if(o.isInstancedMesh===!0&&o.morphTexture!==null)l.getUniforms().setValue(n,"morphTexture",o.morphTexture,t);else{let p=0;for(let v=0;v<c.length;v++)p+=c[v];const g=a.morphTargetsRelative?1:1-p;l.getUniforms().setValue(n,"morphTargetBaseInfluence",g),l.getUniforms().setValue(n,"morphTargetInfluences",c)}l.getUniforms().setValue(n,"morphTargetsTexture",h.texture,t),l.getUniforms().setValue(n,"morphTargetsTextureSize",h.size)}return{update:r}}function My(n,e,t,i){let s=new WeakMap;function r(l){const c=i.render.frame,u=l.geometry,d=e.get(l,u);if(s.get(d)!==c&&(e.update(d),s.set(d,c)),l.isInstancedMesh&&(l.hasEventListener("dispose",a)===!1&&l.addEventListener("dispose",a),s.get(l)!==c&&(t.update(l.instanceMatrix,n.ARRAY_BUFFER),l.instanceColor!==null&&t.update(l.instanceColor,n.ARRAY_BUFFER),s.set(l,c))),l.isSkinnedMesh){const h=l.skeleton;s.get(h)!==c&&(h.update(),s.set(h,c))}return d}function o(){s=new WeakMap}function a(l){const c=l.target;c.removeEventListener("dispose",a),t.remove(c.instanceMatrix),c.instanceColor!==null&&t.remove(c.instanceColor)}return{update:r,dispose:o}}const vp=new Wt,sh=new hp(1,1),xp=new ip,yp=new X_,Sp=new cp,rh=[],oh=[],ah=new Float32Array(16),lh=new Float32Array(9),ch=new Float32Array(4);function Vs(n,e,t){const i=n[0];if(i<=0||i>0)return n;const s=e*t;let r=rh[s];if(r===void 0&&(r=new Float32Array(s),rh[s]=r),e!==0){i.toArray(r,0);for(let o=1,a=0;o!==e;++o)a+=t,n[o].toArray(r,a)}return r}function Lt(n,e){if(n.length!==e.length)return!1;for(let t=0,i=n.length;t<i;t++)if(n[t]!==e[t])return!1;return!0}function Dt(n,e){for(let t=0,i=e.length;t<i;t++)n[t]=e[t]}function ca(n,e){let t=oh[e];t===void 0&&(t=new Int32Array(e),oh[e]=t);for(let i=0;i!==e;++i)t[i]=n.allocateTextureUnit();return t}function wy(n,e){const t=this.cache;t[0]!==e&&(n.uniform1f(this.addr,e),t[0]=e)}function by(n,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y)&&(n.uniform2f(this.addr,e.x,e.y),t[0]=e.x,t[1]=e.y);else{if(Lt(t,e))return;n.uniform2fv(this.addr,e),Dt(t,e)}}function Ey(n,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z)&&(n.uniform3f(this.addr,e.x,e.y,e.z),t[0]=e.x,t[1]=e.y,t[2]=e.z);else if(e.r!==void 0)(t[0]!==e.r||t[1]!==e.g||t[2]!==e.b)&&(n.uniform3f(this.addr,e.r,e.g,e.b),t[0]=e.r,t[1]=e.g,t[2]=e.b);else{if(Lt(t,e))return;n.uniform3fv(this.addr,e),Dt(t,e)}}function Ty(n,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z||t[3]!==e.w)&&(n.uniform4f(this.addr,e.x,e.y,e.z,e.w),t[0]=e.x,t[1]=e.y,t[2]=e.z,t[3]=e.w);else{if(Lt(t,e))return;n.uniform4fv(this.addr,e),Dt(t,e)}}function Ay(n,e){const t=this.cache,i=e.elements;if(i===void 0){if(Lt(t,e))return;n.uniformMatrix2fv(this.addr,!1,e),Dt(t,e)}else{if(Lt(t,i))return;ch.set(i),n.uniformMatrix2fv(this.addr,!1,ch),Dt(t,i)}}function Ry(n,e){const t=this.cache,i=e.elements;if(i===void 0){if(Lt(t,e))return;n.uniformMatrix3fv(this.addr,!1,e),Dt(t,e)}else{if(Lt(t,i))return;lh.set(i),n.uniformMatrix3fv(this.addr,!1,lh),Dt(t,i)}}function Cy(n,e){const t=this.cache,i=e.elements;if(i===void 0){if(Lt(t,e))return;n.uniformMatrix4fv(this.addr,!1,e),Dt(t,e)}else{if(Lt(t,i))return;ah.set(i),n.uniformMatrix4fv(this.addr,!1,ah),Dt(t,i)}}function Py(n,e){const t=this.cache;t[0]!==e&&(n.uniform1i(this.addr,e),t[0]=e)}function Ly(n,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y)&&(n.uniform2i(this.addr,e.x,e.y),t[0]=e.x,t[1]=e.y);else{if(Lt(t,e))return;n.uniform2iv(this.addr,e),Dt(t,e)}}function Dy(n,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z)&&(n.uniform3i(this.addr,e.x,e.y,e.z),t[0]=e.x,t[1]=e.y,t[2]=e.z);else{if(Lt(t,e))return;n.uniform3iv(this.addr,e),Dt(t,e)}}function Iy(n,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z||t[3]!==e.w)&&(n.uniform4i(this.addr,e.x,e.y,e.z,e.w),t[0]=e.x,t[1]=e.y,t[2]=e.z,t[3]=e.w);else{if(Lt(t,e))return;n.uniform4iv(this.addr,e),Dt(t,e)}}function Ny(n,e){const t=this.cache;t[0]!==e&&(n.uniform1ui(this.addr,e),t[0]=e)}function Uy(n,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y)&&(n.uniform2ui(this.addr,e.x,e.y),t[0]=e.x,t[1]=e.y);else{if(Lt(t,e))return;n.uniform2uiv(this.addr,e),Dt(t,e)}}function Fy(n,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z)&&(n.uniform3ui(this.addr,e.x,e.y,e.z),t[0]=e.x,t[1]=e.y,t[2]=e.z);else{if(Lt(t,e))return;n.uniform3uiv(this.addr,e),Dt(t,e)}}function Oy(n,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z||t[3]!==e.w)&&(n.uniform4ui(this.addr,e.x,e.y,e.z,e.w),t[0]=e.x,t[1]=e.y,t[2]=e.z,t[3]=e.w);else{if(Lt(t,e))return;n.uniform4uiv(this.addr,e),Dt(t,e)}}function By(n,e,t){const i=this.cache,s=t.allocateTextureUnit();i[0]!==s&&(n.uniform1i(this.addr,s),i[0]=s);let r;this.type===n.SAMPLER_2D_SHADOW?(sh.compareFunction=tp,r=sh):r=vp,t.setTexture2D(e||r,s)}function ky(n,e,t){const i=this.cache,s=t.allocateTextureUnit();i[0]!==s&&(n.uniform1i(this.addr,s),i[0]=s),t.setTexture3D(e||yp,s)}function zy(n,e,t){const i=this.cache,s=t.allocateTextureUnit();i[0]!==s&&(n.uniform1i(this.addr,s),i[0]=s),t.setTextureCube(e||Sp,s)}function Gy(n,e,t){const i=this.cache,s=t.allocateTextureUnit();i[0]!==s&&(n.uniform1i(this.addr,s),i[0]=s),t.setTexture2DArray(e||xp,s)}function Hy(n){switch(n){case 5126:return wy;case 35664:return by;case 35665:return Ey;case 35666:return Ty;case 35674:return Ay;case 35675:return Ry;case 35676:return Cy;case 5124:case 35670:return Py;case 35667:case 35671:return Ly;case 35668:case 35672:return Dy;case 35669:case 35673:return Iy;case 5125:return Ny;case 36294:return Uy;case 36295:return Fy;case 36296:return Oy;case 35678:case 36198:case 36298:case 36306:case 35682:return By;case 35679:case 36299:case 36307:return ky;case 35680:case 36300:case 36308:case 36293:return zy;case 36289:case 36303:case 36311:case 36292:return Gy}}function Vy(n,e){n.uniform1fv(this.addr,e)}function $y(n,e){const t=Vs(e,this.size,2);n.uniform2fv(this.addr,t)}function Wy(n,e){const t=Vs(e,this.size,3);n.uniform3fv(this.addr,t)}function Xy(n,e){const t=Vs(e,this.size,4);n.uniform4fv(this.addr,t)}function Yy(n,e){const t=Vs(e,this.size,4);n.uniformMatrix2fv(this.addr,!1,t)}function qy(n,e){const t=Vs(e,this.size,9);n.uniformMatrix3fv(this.addr,!1,t)}function jy(n,e){const t=Vs(e,this.size,16);n.uniformMatrix4fv(this.addr,!1,t)}function Ky(n,e){n.uniform1iv(this.addr,e)}function Zy(n,e){n.uniform2iv(this.addr,e)}function Jy(n,e){n.uniform3iv(this.addr,e)}function Qy(n,e){n.uniform4iv(this.addr,e)}function eS(n,e){n.uniform1uiv(this.addr,e)}function tS(n,e){n.uniform2uiv(this.addr,e)}function nS(n,e){n.uniform3uiv(this.addr,e)}function iS(n,e){n.uniform4uiv(this.addr,e)}function sS(n,e,t){const i=this.cache,s=e.length,r=ca(t,s);Lt(i,r)||(n.uniform1iv(this.addr,r),Dt(i,r));for(let o=0;o!==s;++o)t.setTexture2D(e[o]||vp,r[o])}function rS(n,e,t){const i=this.cache,s=e.length,r=ca(t,s);Lt(i,r)||(n.uniform1iv(this.addr,r),Dt(i,r));for(let o=0;o!==s;++o)t.setTexture3D(e[o]||yp,r[o])}function oS(n,e,t){const i=this.cache,s=e.length,r=ca(t,s);Lt(i,r)||(n.uniform1iv(this.addr,r),Dt(i,r));for(let o=0;o!==s;++o)t.setTextureCube(e[o]||Sp,r[o])}function aS(n,e,t){const i=this.cache,s=e.length,r=ca(t,s);Lt(i,r)||(n.uniform1iv(this.addr,r),Dt(i,r));for(let o=0;o!==s;++o)t.setTexture2DArray(e[o]||xp,r[o])}function lS(n){switch(n){case 5126:return Vy;case 35664:return $y;case 35665:return Wy;case 35666:return Xy;case 35674:return Yy;case 35675:return qy;case 35676:return jy;case 5124:case 35670:return Ky;case 35667:case 35671:return Zy;case 35668:case 35672:return Jy;case 35669:case 35673:return Qy;case 5125:return eS;case 36294:return tS;case 36295:return nS;case 36296:return iS;case 35678:case 36198:case 36298:case 36306:case 35682:return sS;case 35679:case 36299:case 36307:return rS;case 35680:case 36300:case 36308:case 36293:return oS;case 36289:case 36303:case 36311:case 36292:return aS}}class cS{constructor(e,t,i){this.id=e,this.addr=i,this.cache=[],this.type=t.type,this.setValue=Hy(t.type)}}class uS{constructor(e,t,i){this.id=e,this.addr=i,this.cache=[],this.type=t.type,this.size=t.size,this.setValue=lS(t.type)}}class dS{constructor(e){this.id=e,this.seq=[],this.map={}}setValue(e,t,i){const s=this.seq;for(let r=0,o=s.length;r!==o;++r){const a=s[r];a.setValue(e,t[a.id],i)}}}const al=/(\w+)(\])?(\[|\.)?/g;function uh(n,e){n.seq.push(e),n.map[e.id]=e}function hS(n,e,t){const i=n.name,s=i.length;for(al.lastIndex=0;;){const r=al.exec(i),o=al.lastIndex;let a=r[1];const l=r[2]==="]",c=r[3];if(l&&(a=a|0),c===void 0||c==="["&&o+2===s){uh(t,c===void 0?new cS(a,n,e):new uS(a,n,e));break}else{let d=t.map[a];d===void 0&&(d=new dS(a),uh(t,d)),t=d}}}class No{constructor(e,t){this.seq=[],this.map={};const i=e.getProgramParameter(t,e.ACTIVE_UNIFORMS);for(let s=0;s<i;++s){const r=e.getActiveUniform(t,s),o=e.getUniformLocation(t,r.name);hS(r,o,this)}}setValue(e,t,i,s){const r=this.map[t];r!==void 0&&r.setValue(e,i,s)}setOptional(e,t,i){const s=t[i];s!==void 0&&this.setValue(e,i,s)}static upload(e,t,i,s){for(let r=0,o=t.length;r!==o;++r){const a=t[r],l=i[a.id];l.needsUpdate!==!1&&a.setValue(e,l.value,s)}}static seqWithValue(e,t){const i=[];for(let s=0,r=e.length;s!==r;++s){const o=e[s];o.id in t&&i.push(o)}return i}}function dh(n,e,t){const i=n.createShader(e);return n.shaderSource(i,t),n.compileShader(i),i}const fS=37297;let pS=0;function mS(n,e){const t=n.split(`
`),i=[],s=Math.max(e-6,0),r=Math.min(e+6,t.length);for(let o=s;o<r;o++){const a=o+1;i.push(`${a===e?">":" "} ${a}: ${t[o]}`)}return i.join(`
`)}const hh=new qe;function gS(n){it._getMatrix(hh,it.workingColorSpace,n);const e=`mat3( ${hh.elements.map(t=>t.toFixed(4))} )`;switch(it.getTransfer(n)){case Vo:return[e,"LinearTransferOETF"];case ut:return[e,"sRGBTransferOETF"];default:return console.warn("THREE.WebGLProgram: Unsupported color space: ",n),[e,"LinearTransferOETF"]}}function fh(n,e,t){const i=n.getShaderParameter(e,n.COMPILE_STATUS),s=n.getShaderInfoLog(e).trim();if(i&&s==="")return"";const r=/ERROR: 0:(\d+)/.exec(s);if(r){const o=parseInt(r[1]);return t.toUpperCase()+`

`+s+`

`+mS(n.getShaderSource(e),o)}else return s}function _S(n,e){const t=gS(e);return[`vec4 ${n}( vec4 value ) {`,`	return ${t[1]}( vec4( value.rgb * ${t[0]}, value.a ) );`,"}"].join(`
`)}function vS(n,e){let t;switch(e){case __:t="Linear";break;case v_:t="Reinhard";break;case x_:t="Cineon";break;case y_:t="ACESFilmic";break;case M_:t="AgX";break;case w_:t="Neutral";break;case S_:t="Custom";break;default:console.warn("THREE.WebGLProgram: Unsupported toneMapping:",e),t="Linear"}return"vec3 "+n+"( vec3 color ) { return "+t+"ToneMapping( color ); }"}const _o=new O;function xS(){it.getLuminanceCoefficients(_o);const n=_o.x.toFixed(4),e=_o.y.toFixed(4),t=_o.z.toFixed(4);return["float luminance( const in vec3 rgb ) {",`	const vec3 weights = vec3( ${n}, ${e}, ${t} );`,"	return dot( weights, rgb );","}"].join(`
`)}function yS(n){return[n.extensionClipCullDistance?"#extension GL_ANGLE_clip_cull_distance : require":"",n.extensionMultiDraw?"#extension GL_ANGLE_multi_draw : require":""].filter(or).join(`
`)}function SS(n){const e=[];for(const t in n){const i=n[t];i!==!1&&e.push("#define "+t+" "+i)}return e.join(`
`)}function MS(n,e){const t={},i=n.getProgramParameter(e,n.ACTIVE_ATTRIBUTES);for(let s=0;s<i;s++){const r=n.getActiveAttrib(e,s),o=r.name;let a=1;r.type===n.FLOAT_MAT2&&(a=2),r.type===n.FLOAT_MAT3&&(a=3),r.type===n.FLOAT_MAT4&&(a=4),t[o]={type:r.type,location:n.getAttribLocation(e,o),locationSize:a}}return t}function or(n){return n!==""}function ph(n,e){const t=e.numSpotLightShadows+e.numSpotLightMaps-e.numSpotLightShadowsWithMaps;return n.replace(/NUM_DIR_LIGHTS/g,e.numDirLights).replace(/NUM_SPOT_LIGHTS/g,e.numSpotLights).replace(/NUM_SPOT_LIGHT_MAPS/g,e.numSpotLightMaps).replace(/NUM_SPOT_LIGHT_COORDS/g,t).replace(/NUM_RECT_AREA_LIGHTS/g,e.numRectAreaLights).replace(/NUM_POINT_LIGHTS/g,e.numPointLights).replace(/NUM_HEMI_LIGHTS/g,e.numHemiLights).replace(/NUM_DIR_LIGHT_SHADOWS/g,e.numDirLightShadows).replace(/NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS/g,e.numSpotLightShadowsWithMaps).replace(/NUM_SPOT_LIGHT_SHADOWS/g,e.numSpotLightShadows).replace(/NUM_POINT_LIGHT_SHADOWS/g,e.numPointLightShadows)}function mh(n,e){return n.replace(/NUM_CLIPPING_PLANES/g,e.numClippingPlanes).replace(/UNION_CLIPPING_PLANES/g,e.numClippingPlanes-e.numClipIntersection)}const wS=/^[ \t]*#include +<([\w\d./]+)>/gm;function fc(n){return n.replace(wS,ES)}const bS=new Map;function ES(n,e){let t=Ze[e];if(t===void 0){const i=bS.get(e);if(i!==void 0)t=Ze[i],console.warn('THREE.WebGLRenderer: Shader chunk "%s" has been deprecated. Use "%s" instead.',e,i);else throw new Error("Can not resolve #include <"+e+">")}return fc(t)}const TS=/#pragma unroll_loop_start\s+for\s*\(\s*int\s+i\s*=\s*(\d+)\s*;\s*i\s*<\s*(\d+)\s*;\s*i\s*\+\+\s*\)\s*{([\s\S]+?)}\s+#pragma unroll_loop_end/g;function gh(n){return n.replace(TS,AS)}function AS(n,e,t,i){let s="";for(let r=parseInt(e);r<parseInt(t);r++)s+=i.replace(/\[\s*i\s*\]/g,"[ "+r+" ]").replace(/UNROLLED_LOOP_INDEX/g,r);return s}function _h(n){let e=`precision ${n.precision} float;
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
#define LOW_PRECISION`),e}function RS(n){let e="SHADOWMAP_TYPE_BASIC";return n.shadowMapType===Wf?e="SHADOWMAP_TYPE_PCF":n.shadowMapType===Kg?e="SHADOWMAP_TYPE_PCF_SOFT":n.shadowMapType===$n&&(e="SHADOWMAP_TYPE_VSM"),e}function CS(n){let e="ENVMAP_TYPE_CUBE";if(n.envMap)switch(n.envMapMode){case Ns:case Us:e="ENVMAP_TYPE_CUBE";break;case ra:e="ENVMAP_TYPE_CUBE_UV";break}return e}function PS(n){let e="ENVMAP_MODE_REFLECTION";return n.envMap&&n.envMapMode===Us&&(e="ENVMAP_MODE_REFRACTION"),e}function LS(n){let e="ENVMAP_BLENDING_NONE";if(n.envMap)switch(n.combine){case Qc:e="ENVMAP_BLENDING_MULTIPLY";break;case m_:e="ENVMAP_BLENDING_MIX";break;case g_:e="ENVMAP_BLENDING_ADD";break}return e}function DS(n){const e=n.envMapCubeUVHeight;if(e===null)return null;const t=Math.log2(e)-2,i=1/e;return{texelWidth:1/(3*Math.max(Math.pow(2,t),112)),texelHeight:i,maxMip:t}}function IS(n,e,t,i){const s=n.getContext(),r=t.defines;let o=t.vertexShader,a=t.fragmentShader;const l=RS(t),c=CS(t),u=PS(t),d=LS(t),h=DS(t),p=yS(t),g=SS(r),v=s.createProgram();let m,f,T=t.glslVersion?"#version "+t.glslVersion+`
`:"";t.isRawShaderMaterial?(m=["#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,g].filter(or).join(`
`),m.length>0&&(m+=`
`),f=["#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,g].filter(or).join(`
`),f.length>0&&(f+=`
`)):(m=[_h(t),"#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,g,t.extensionClipCullDistance?"#define USE_CLIP_DISTANCE":"",t.batching?"#define USE_BATCHING":"",t.batchingColor?"#define USE_BATCHING_COLOR":"",t.instancing?"#define USE_INSTANCING":"",t.instancingColor?"#define USE_INSTANCING_COLOR":"",t.instancingMorph?"#define USE_INSTANCING_MORPH":"",t.useFog&&t.fog?"#define USE_FOG":"",t.useFog&&t.fogExp2?"#define FOG_EXP2":"",t.map?"#define USE_MAP":"",t.envMap?"#define USE_ENVMAP":"",t.envMap?"#define "+u:"",t.lightMap?"#define USE_LIGHTMAP":"",t.aoMap?"#define USE_AOMAP":"",t.bumpMap?"#define USE_BUMPMAP":"",t.normalMap?"#define USE_NORMALMAP":"",t.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",t.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",t.displacementMap?"#define USE_DISPLACEMENTMAP":"",t.emissiveMap?"#define USE_EMISSIVEMAP":"",t.anisotropy?"#define USE_ANISOTROPY":"",t.anisotropyMap?"#define USE_ANISOTROPYMAP":"",t.clearcoatMap?"#define USE_CLEARCOATMAP":"",t.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",t.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",t.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",t.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",t.specularMap?"#define USE_SPECULARMAP":"",t.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",t.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",t.roughnessMap?"#define USE_ROUGHNESSMAP":"",t.metalnessMap?"#define USE_METALNESSMAP":"",t.alphaMap?"#define USE_ALPHAMAP":"",t.alphaHash?"#define USE_ALPHAHASH":"",t.transmission?"#define USE_TRANSMISSION":"",t.transmissionMap?"#define USE_TRANSMISSIONMAP":"",t.thicknessMap?"#define USE_THICKNESSMAP":"",t.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",t.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",t.mapUv?"#define MAP_UV "+t.mapUv:"",t.alphaMapUv?"#define ALPHAMAP_UV "+t.alphaMapUv:"",t.lightMapUv?"#define LIGHTMAP_UV "+t.lightMapUv:"",t.aoMapUv?"#define AOMAP_UV "+t.aoMapUv:"",t.emissiveMapUv?"#define EMISSIVEMAP_UV "+t.emissiveMapUv:"",t.bumpMapUv?"#define BUMPMAP_UV "+t.bumpMapUv:"",t.normalMapUv?"#define NORMALMAP_UV "+t.normalMapUv:"",t.displacementMapUv?"#define DISPLACEMENTMAP_UV "+t.displacementMapUv:"",t.metalnessMapUv?"#define METALNESSMAP_UV "+t.metalnessMapUv:"",t.roughnessMapUv?"#define ROUGHNESSMAP_UV "+t.roughnessMapUv:"",t.anisotropyMapUv?"#define ANISOTROPYMAP_UV "+t.anisotropyMapUv:"",t.clearcoatMapUv?"#define CLEARCOATMAP_UV "+t.clearcoatMapUv:"",t.clearcoatNormalMapUv?"#define CLEARCOAT_NORMALMAP_UV "+t.clearcoatNormalMapUv:"",t.clearcoatRoughnessMapUv?"#define CLEARCOAT_ROUGHNESSMAP_UV "+t.clearcoatRoughnessMapUv:"",t.iridescenceMapUv?"#define IRIDESCENCEMAP_UV "+t.iridescenceMapUv:"",t.iridescenceThicknessMapUv?"#define IRIDESCENCE_THICKNESSMAP_UV "+t.iridescenceThicknessMapUv:"",t.sheenColorMapUv?"#define SHEEN_COLORMAP_UV "+t.sheenColorMapUv:"",t.sheenRoughnessMapUv?"#define SHEEN_ROUGHNESSMAP_UV "+t.sheenRoughnessMapUv:"",t.specularMapUv?"#define SPECULARMAP_UV "+t.specularMapUv:"",t.specularColorMapUv?"#define SPECULAR_COLORMAP_UV "+t.specularColorMapUv:"",t.specularIntensityMapUv?"#define SPECULAR_INTENSITYMAP_UV "+t.specularIntensityMapUv:"",t.transmissionMapUv?"#define TRANSMISSIONMAP_UV "+t.transmissionMapUv:"",t.thicknessMapUv?"#define THICKNESSMAP_UV "+t.thicknessMapUv:"",t.vertexTangents&&t.flatShading===!1?"#define USE_TANGENT":"",t.vertexColors?"#define USE_COLOR":"",t.vertexAlphas?"#define USE_COLOR_ALPHA":"",t.vertexUv1s?"#define USE_UV1":"",t.vertexUv2s?"#define USE_UV2":"",t.vertexUv3s?"#define USE_UV3":"",t.pointsUvs?"#define USE_POINTS_UV":"",t.flatShading?"#define FLAT_SHADED":"",t.skinning?"#define USE_SKINNING":"",t.morphTargets?"#define USE_MORPHTARGETS":"",t.morphNormals&&t.flatShading===!1?"#define USE_MORPHNORMALS":"",t.morphColors?"#define USE_MORPHCOLORS":"",t.morphTargetsCount>0?"#define MORPHTARGETS_TEXTURE_STRIDE "+t.morphTextureStride:"",t.morphTargetsCount>0?"#define MORPHTARGETS_COUNT "+t.morphTargetsCount:"",t.doubleSided?"#define DOUBLE_SIDED":"",t.flipSided?"#define FLIP_SIDED":"",t.shadowMapEnabled?"#define USE_SHADOWMAP":"",t.shadowMapEnabled?"#define "+l:"",t.sizeAttenuation?"#define USE_SIZEATTENUATION":"",t.numLightProbes>0?"#define USE_LIGHT_PROBES":"",t.logarithmicDepthBuffer?"#define USE_LOGDEPTHBUF":"",t.reverseDepthBuffer?"#define USE_REVERSEDEPTHBUF":"","uniform mat4 modelMatrix;","uniform mat4 modelViewMatrix;","uniform mat4 projectionMatrix;","uniform mat4 viewMatrix;","uniform mat3 normalMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;","#ifdef USE_INSTANCING","	attribute mat4 instanceMatrix;","#endif","#ifdef USE_INSTANCING_COLOR","	attribute vec3 instanceColor;","#endif","#ifdef USE_INSTANCING_MORPH","	uniform sampler2D morphTexture;","#endif","attribute vec3 position;","attribute vec3 normal;","attribute vec2 uv;","#ifdef USE_UV1","	attribute vec2 uv1;","#endif","#ifdef USE_UV2","	attribute vec2 uv2;","#endif","#ifdef USE_UV3","	attribute vec2 uv3;","#endif","#ifdef USE_TANGENT","	attribute vec4 tangent;","#endif","#if defined( USE_COLOR_ALPHA )","	attribute vec4 color;","#elif defined( USE_COLOR )","	attribute vec3 color;","#endif","#ifdef USE_SKINNING","	attribute vec4 skinIndex;","	attribute vec4 skinWeight;","#endif",`
`].filter(or).join(`
`),f=[_h(t),"#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,g,t.useFog&&t.fog?"#define USE_FOG":"",t.useFog&&t.fogExp2?"#define FOG_EXP2":"",t.alphaToCoverage?"#define ALPHA_TO_COVERAGE":"",t.map?"#define USE_MAP":"",t.matcap?"#define USE_MATCAP":"",t.envMap?"#define USE_ENVMAP":"",t.envMap?"#define "+c:"",t.envMap?"#define "+u:"",t.envMap?"#define "+d:"",h?"#define CUBEUV_TEXEL_WIDTH "+h.texelWidth:"",h?"#define CUBEUV_TEXEL_HEIGHT "+h.texelHeight:"",h?"#define CUBEUV_MAX_MIP "+h.maxMip+".0":"",t.lightMap?"#define USE_LIGHTMAP":"",t.aoMap?"#define USE_AOMAP":"",t.bumpMap?"#define USE_BUMPMAP":"",t.normalMap?"#define USE_NORMALMAP":"",t.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",t.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",t.emissiveMap?"#define USE_EMISSIVEMAP":"",t.anisotropy?"#define USE_ANISOTROPY":"",t.anisotropyMap?"#define USE_ANISOTROPYMAP":"",t.clearcoat?"#define USE_CLEARCOAT":"",t.clearcoatMap?"#define USE_CLEARCOATMAP":"",t.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",t.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",t.dispersion?"#define USE_DISPERSION":"",t.iridescence?"#define USE_IRIDESCENCE":"",t.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",t.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",t.specularMap?"#define USE_SPECULARMAP":"",t.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",t.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",t.roughnessMap?"#define USE_ROUGHNESSMAP":"",t.metalnessMap?"#define USE_METALNESSMAP":"",t.alphaMap?"#define USE_ALPHAMAP":"",t.alphaTest?"#define USE_ALPHATEST":"",t.alphaHash?"#define USE_ALPHAHASH":"",t.sheen?"#define USE_SHEEN":"",t.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",t.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",t.transmission?"#define USE_TRANSMISSION":"",t.transmissionMap?"#define USE_TRANSMISSIONMAP":"",t.thicknessMap?"#define USE_THICKNESSMAP":"",t.vertexTangents&&t.flatShading===!1?"#define USE_TANGENT":"",t.vertexColors||t.instancingColor||t.batchingColor?"#define USE_COLOR":"",t.vertexAlphas?"#define USE_COLOR_ALPHA":"",t.vertexUv1s?"#define USE_UV1":"",t.vertexUv2s?"#define USE_UV2":"",t.vertexUv3s?"#define USE_UV3":"",t.pointsUvs?"#define USE_POINTS_UV":"",t.gradientMap?"#define USE_GRADIENTMAP":"",t.flatShading?"#define FLAT_SHADED":"",t.doubleSided?"#define DOUBLE_SIDED":"",t.flipSided?"#define FLIP_SIDED":"",t.shadowMapEnabled?"#define USE_SHADOWMAP":"",t.shadowMapEnabled?"#define "+l:"",t.premultipliedAlpha?"#define PREMULTIPLIED_ALPHA":"",t.numLightProbes>0?"#define USE_LIGHT_PROBES":"",t.decodeVideoTexture?"#define DECODE_VIDEO_TEXTURE":"",t.decodeVideoTextureEmissive?"#define DECODE_VIDEO_TEXTURE_EMISSIVE":"",t.logarithmicDepthBuffer?"#define USE_LOGDEPTHBUF":"",t.reverseDepthBuffer?"#define USE_REVERSEDEPTHBUF":"","uniform mat4 viewMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;",t.toneMapping!==yi?"#define TONE_MAPPING":"",t.toneMapping!==yi?Ze.tonemapping_pars_fragment:"",t.toneMapping!==yi?vS("toneMapping",t.toneMapping):"",t.dithering?"#define DITHERING":"",t.opaque?"#define OPAQUE":"",Ze.colorspace_pars_fragment,_S("linearToOutputTexel",t.outputColorSpace),xS(),t.useDepthPacking?"#define DEPTH_PACKING "+t.depthPacking:"",`
`].filter(or).join(`
`)),o=fc(o),o=ph(o,t),o=mh(o,t),a=fc(a),a=ph(a,t),a=mh(a,t),o=gh(o),a=gh(a),t.isRawShaderMaterial!==!0&&(T=`#version 300 es
`,m=[p,"#define attribute in","#define varying out","#define texture2D texture"].join(`
`)+`
`+m,f=["#define varying in",t.glslVersion===_d?"":"layout(location = 0) out highp vec4 pc_fragColor;",t.glslVersion===_d?"":"#define gl_FragColor pc_fragColor","#define gl_FragDepthEXT gl_FragDepth","#define texture2D texture","#define textureCube texture","#define texture2DProj textureProj","#define texture2DLodEXT textureLod","#define texture2DProjLodEXT textureProjLod","#define textureCubeLodEXT textureLod","#define texture2DGradEXT textureGrad","#define texture2DProjGradEXT textureProjGrad","#define textureCubeGradEXT textureGrad"].join(`
`)+`
`+f);const y=T+m+o,M=T+f+a,P=dh(s,s.VERTEX_SHADER,y),E=dh(s,s.FRAGMENT_SHADER,M);s.attachShader(v,P),s.attachShader(v,E),t.index0AttributeName!==void 0?s.bindAttribLocation(v,0,t.index0AttributeName):t.morphTargets===!0&&s.bindAttribLocation(v,0,"position"),s.linkProgram(v);function A(D){if(n.debug.checkShaderErrors){const $=s.getProgramInfoLog(v).trim(),k=s.getShaderInfoLog(P).trim(),q=s.getShaderInfoLog(E).trim();let Z=!0,V=!0;if(s.getProgramParameter(v,s.LINK_STATUS)===!1)if(Z=!1,typeof n.debug.onShaderError=="function")n.debug.onShaderError(s,v,P,E);else{const se=fh(s,P,"vertex"),H=fh(s,E,"fragment");console.error("THREE.WebGLProgram: Shader Error "+s.getError()+" - VALIDATE_STATUS "+s.getProgramParameter(v,s.VALIDATE_STATUS)+`

Material Name: `+D.name+`
Material Type: `+D.type+`

Program Info Log: `+$+`
`+se+`
`+H)}else $!==""?console.warn("THREE.WebGLProgram: Program Info Log:",$):(k===""||q==="")&&(V=!1);V&&(D.diagnostics={runnable:Z,programLog:$,vertexShader:{log:k,prefix:m},fragmentShader:{log:q,prefix:f}})}s.deleteShader(P),s.deleteShader(E),R=new No(s,v),w=MS(s,v)}let R;this.getUniforms=function(){return R===void 0&&A(this),R};let w;this.getAttributes=function(){return w===void 0&&A(this),w};let S=t.rendererExtensionParallelShaderCompile===!1;return this.isReady=function(){return S===!1&&(S=s.getProgramParameter(v,fS)),S},this.destroy=function(){i.releaseStatesOfProgram(this),s.deleteProgram(v),this.program=void 0},this.type=t.shaderType,this.name=t.shaderName,this.id=pS++,this.cacheKey=e,this.usedTimes=1,this.program=v,this.vertexShader=P,this.fragmentShader=E,this}let NS=0;class US{constructor(){this.shaderCache=new Map,this.materialCache=new Map}update(e){const t=e.vertexShader,i=e.fragmentShader,s=this._getShaderStage(t),r=this._getShaderStage(i),o=this._getShaderCacheForMaterial(e);return o.has(s)===!1&&(o.add(s),s.usedTimes++),o.has(r)===!1&&(o.add(r),r.usedTimes++),this}remove(e){const t=this.materialCache.get(e);for(const i of t)i.usedTimes--,i.usedTimes===0&&this.shaderCache.delete(i.code);return this.materialCache.delete(e),this}getVertexShaderID(e){return this._getShaderStage(e.vertexShader).id}getFragmentShaderID(e){return this._getShaderStage(e.fragmentShader).id}dispose(){this.shaderCache.clear(),this.materialCache.clear()}_getShaderCacheForMaterial(e){const t=this.materialCache;let i=t.get(e);return i===void 0&&(i=new Set,t.set(e,i)),i}_getShaderStage(e){const t=this.shaderCache;let i=t.get(e);return i===void 0&&(i=new FS(e),t.set(e,i)),i}}class FS{constructor(e){this.id=NS++,this.code=e,this.usedTimes=0}}function OS(n,e,t,i,s,r,o){const a=new lu,l=new US,c=new Set,u=[],d=s.logarithmicDepthBuffer,h=s.vertexTextures;let p=s.precision;const g={MeshDepthMaterial:"depth",MeshDistanceMaterial:"distanceRGBA",MeshNormalMaterial:"normal",MeshBasicMaterial:"basic",MeshLambertMaterial:"lambert",MeshPhongMaterial:"phong",MeshToonMaterial:"toon",MeshStandardMaterial:"physical",MeshPhysicalMaterial:"physical",MeshMatcapMaterial:"matcap",LineBasicMaterial:"basic",LineDashedMaterial:"dashed",PointsMaterial:"points",ShadowMaterial:"shadow",SpriteMaterial:"sprite"};function v(w){return c.add(w),w===0?"uv":`uv${w}`}function m(w,S,D,$,k){const q=$.fog,Z=k.geometry,V=w.isMeshStandardMaterial?$.environment:null,se=(w.isMeshStandardMaterial?t:e).get(w.envMap||V),H=se&&se.mapping===ra?se.image.height:null,ae=g[w.type];w.precision!==null&&(p=s.getMaxPrecision(w.precision),p!==w.precision&&console.warn("THREE.WebGLProgram.getParameters:",w.precision,"not supported, using",p,"instead."));const ge=Z.morphAttributes.position||Z.morphAttributes.normal||Z.morphAttributes.color,Te=ge!==void 0?ge.length:0;let $e=0;Z.morphAttributes.position!==void 0&&($e=1),Z.morphAttributes.normal!==void 0&&($e=2),Z.morphAttributes.color!==void 0&&($e=3);let je,X,le,Ee;if(ae){const ot=Cn[ae];je=ot.vertexShader,X=ot.fragmentShader}else je=w.vertexShader,X=w.fragmentShader,l.update(w),le=l.getVertexShaderID(w),Ee=l.getFragmentShaderID(w);const fe=n.getRenderTarget(),we=n.state.buffers.depth.getReversed(),Qe=k.isInstancedMesh===!0,Y=k.isBatchedMesh===!0,_e=!!w.map,Ye=!!w.matcap,Oe=!!se,L=!!w.aoMap,Tt=!!w.lightMap,st=!!w.bumpMap,ft=!!w.normalMap,Ae=!!w.displacementMap,tt=!!w.emissiveMap,Ie=!!w.metalnessMap,Ke=!!w.roughnessMap,At=w.anisotropy>0,C=w.clearcoat>0,x=w.dispersion>0,B=w.iridescence>0,j=w.sheen>0,J=w.transmission>0,W=At&&!!w.anisotropyMap,Re=C&&!!w.clearcoatMap,he=C&&!!w.clearcoatNormalMap,be=C&&!!w.clearcoatRoughnessMap,Ce=B&&!!w.iridescenceMap,ee=B&&!!w.iridescenceThicknessMap,ve=j&&!!w.sheenColorMap,Fe=j&&!!w.sheenRoughnessMap,Ue=!!w.specularMap,ce=!!w.specularColorMap,Ge=!!w.specularIntensityMap,I=J&&!!w.transmissionMap,pe=J&&!!w.thicknessMap,te=!!w.gradientMap,ye=!!w.alphaMap,ie=w.alphaTest>0,K=!!w.alphaHash,Se=!!w.extensions;let He=yi;w.toneMapped&&(fe===null||fe.isXRRenderTarget===!0)&&(He=n.toneMapping);const mt={shaderID:ae,shaderType:w.type,shaderName:w.name,vertexShader:je,fragmentShader:X,defines:w.defines,customVertexShaderID:le,customFragmentShaderID:Ee,isRawShaderMaterial:w.isRawShaderMaterial===!0,glslVersion:w.glslVersion,precision:p,batching:Y,batchingColor:Y&&k._colorsTexture!==null,instancing:Qe,instancingColor:Qe&&k.instanceColor!==null,instancingMorph:Qe&&k.morphTexture!==null,supportsVertexTextures:h,outputColorSpace:fe===null?n.outputColorSpace:fe.isXRRenderTarget===!0?fe.texture.colorSpace:Fs,alphaToCoverage:!!w.alphaToCoverage,map:_e,matcap:Ye,envMap:Oe,envMapMode:Oe&&se.mapping,envMapCubeUVHeight:H,aoMap:L,lightMap:Tt,bumpMap:st,normalMap:ft,displacementMap:h&&Ae,emissiveMap:tt,normalMapObjectSpace:ft&&w.normalMapType===A_,normalMapTangentSpace:ft&&w.normalMapType===ep,metalnessMap:Ie,roughnessMap:Ke,anisotropy:At,anisotropyMap:W,clearcoat:C,clearcoatMap:Re,clearcoatNormalMap:he,clearcoatRoughnessMap:be,dispersion:x,iridescence:B,iridescenceMap:Ce,iridescenceThicknessMap:ee,sheen:j,sheenColorMap:ve,sheenRoughnessMap:Fe,specularMap:Ue,specularColorMap:ce,specularIntensityMap:Ge,transmission:J,transmissionMap:I,thicknessMap:pe,gradientMap:te,opaque:w.transparent===!1&&w.blending===Ts&&w.alphaToCoverage===!1,alphaMap:ye,alphaTest:ie,alphaHash:K,combine:w.combine,mapUv:_e&&v(w.map.channel),aoMapUv:L&&v(w.aoMap.channel),lightMapUv:Tt&&v(w.lightMap.channel),bumpMapUv:st&&v(w.bumpMap.channel),normalMapUv:ft&&v(w.normalMap.channel),displacementMapUv:Ae&&v(w.displacementMap.channel),emissiveMapUv:tt&&v(w.emissiveMap.channel),metalnessMapUv:Ie&&v(w.metalnessMap.channel),roughnessMapUv:Ke&&v(w.roughnessMap.channel),anisotropyMapUv:W&&v(w.anisotropyMap.channel),clearcoatMapUv:Re&&v(w.clearcoatMap.channel),clearcoatNormalMapUv:he&&v(w.clearcoatNormalMap.channel),clearcoatRoughnessMapUv:be&&v(w.clearcoatRoughnessMap.channel),iridescenceMapUv:Ce&&v(w.iridescenceMap.channel),iridescenceThicknessMapUv:ee&&v(w.iridescenceThicknessMap.channel),sheenColorMapUv:ve&&v(w.sheenColorMap.channel),sheenRoughnessMapUv:Fe&&v(w.sheenRoughnessMap.channel),specularMapUv:Ue&&v(w.specularMap.channel),specularColorMapUv:ce&&v(w.specularColorMap.channel),specularIntensityMapUv:Ge&&v(w.specularIntensityMap.channel),transmissionMapUv:I&&v(w.transmissionMap.channel),thicknessMapUv:pe&&v(w.thicknessMap.channel),alphaMapUv:ye&&v(w.alphaMap.channel),vertexTangents:!!Z.attributes.tangent&&(ft||At),vertexColors:w.vertexColors,vertexAlphas:w.vertexColors===!0&&!!Z.attributes.color&&Z.attributes.color.itemSize===4,pointsUvs:k.isPoints===!0&&!!Z.attributes.uv&&(_e||ye),fog:!!q,useFog:w.fog===!0,fogExp2:!!q&&q.isFogExp2,flatShading:w.flatShading===!0&&w.wireframe===!1,sizeAttenuation:w.sizeAttenuation===!0,logarithmicDepthBuffer:d,reverseDepthBuffer:we,skinning:k.isSkinnedMesh===!0,morphTargets:Z.morphAttributes.position!==void 0,morphNormals:Z.morphAttributes.normal!==void 0,morphColors:Z.morphAttributes.color!==void 0,morphTargetsCount:Te,morphTextureStride:$e,numDirLights:S.directional.length,numPointLights:S.point.length,numSpotLights:S.spot.length,numSpotLightMaps:S.spotLightMap.length,numRectAreaLights:S.rectArea.length,numHemiLights:S.hemi.length,numDirLightShadows:S.directionalShadowMap.length,numPointLightShadows:S.pointShadowMap.length,numSpotLightShadows:S.spotShadowMap.length,numSpotLightShadowsWithMaps:S.numSpotLightShadowsWithMaps,numLightProbes:S.numLightProbes,numClippingPlanes:o.numPlanes,numClipIntersection:o.numIntersection,dithering:w.dithering,shadowMapEnabled:n.shadowMap.enabled&&D.length>0,shadowMapType:n.shadowMap.type,toneMapping:He,decodeVideoTexture:_e&&w.map.isVideoTexture===!0&&it.getTransfer(w.map.colorSpace)===ut,decodeVideoTextureEmissive:tt&&w.emissiveMap.isVideoTexture===!0&&it.getTransfer(w.emissiveMap.colorSpace)===ut,premultipliedAlpha:w.premultipliedAlpha,doubleSided:w.side===Yn,flipSided:w.side===Jt,useDepthPacking:w.depthPacking>=0,depthPacking:w.depthPacking||0,index0AttributeName:w.index0AttributeName,extensionClipCullDistance:Se&&w.extensions.clipCullDistance===!0&&i.has("WEBGL_clip_cull_distance"),extensionMultiDraw:(Se&&w.extensions.multiDraw===!0||Y)&&i.has("WEBGL_multi_draw"),rendererExtensionParallelShaderCompile:i.has("KHR_parallel_shader_compile"),customProgramCacheKey:w.customProgramCacheKey()};return mt.vertexUv1s=c.has(1),mt.vertexUv2s=c.has(2),mt.vertexUv3s=c.has(3),c.clear(),mt}function f(w){const S=[];if(w.shaderID?S.push(w.shaderID):(S.push(w.customVertexShaderID),S.push(w.customFragmentShaderID)),w.defines!==void 0)for(const D in w.defines)S.push(D),S.push(w.defines[D]);return w.isRawShaderMaterial===!1&&(T(S,w),y(S,w),S.push(n.outputColorSpace)),S.push(w.customProgramCacheKey),S.join()}function T(w,S){w.push(S.precision),w.push(S.outputColorSpace),w.push(S.envMapMode),w.push(S.envMapCubeUVHeight),w.push(S.mapUv),w.push(S.alphaMapUv),w.push(S.lightMapUv),w.push(S.aoMapUv),w.push(S.bumpMapUv),w.push(S.normalMapUv),w.push(S.displacementMapUv),w.push(S.emissiveMapUv),w.push(S.metalnessMapUv),w.push(S.roughnessMapUv),w.push(S.anisotropyMapUv),w.push(S.clearcoatMapUv),w.push(S.clearcoatNormalMapUv),w.push(S.clearcoatRoughnessMapUv),w.push(S.iridescenceMapUv),w.push(S.iridescenceThicknessMapUv),w.push(S.sheenColorMapUv),w.push(S.sheenRoughnessMapUv),w.push(S.specularMapUv),w.push(S.specularColorMapUv),w.push(S.specularIntensityMapUv),w.push(S.transmissionMapUv),w.push(S.thicknessMapUv),w.push(S.combine),w.push(S.fogExp2),w.push(S.sizeAttenuation),w.push(S.morphTargetsCount),w.push(S.morphAttributeCount),w.push(S.numDirLights),w.push(S.numPointLights),w.push(S.numSpotLights),w.push(S.numSpotLightMaps),w.push(S.numHemiLights),w.push(S.numRectAreaLights),w.push(S.numDirLightShadows),w.push(S.numPointLightShadows),w.push(S.numSpotLightShadows),w.push(S.numSpotLightShadowsWithMaps),w.push(S.numLightProbes),w.push(S.shadowMapType),w.push(S.toneMapping),w.push(S.numClippingPlanes),w.push(S.numClipIntersection),w.push(S.depthPacking)}function y(w,S){a.disableAll(),S.supportsVertexTextures&&a.enable(0),S.instancing&&a.enable(1),S.instancingColor&&a.enable(2),S.instancingMorph&&a.enable(3),S.matcap&&a.enable(4),S.envMap&&a.enable(5),S.normalMapObjectSpace&&a.enable(6),S.normalMapTangentSpace&&a.enable(7),S.clearcoat&&a.enable(8),S.iridescence&&a.enable(9),S.alphaTest&&a.enable(10),S.vertexColors&&a.enable(11),S.vertexAlphas&&a.enable(12),S.vertexUv1s&&a.enable(13),S.vertexUv2s&&a.enable(14),S.vertexUv3s&&a.enable(15),S.vertexTangents&&a.enable(16),S.anisotropy&&a.enable(17),S.alphaHash&&a.enable(18),S.batching&&a.enable(19),S.dispersion&&a.enable(20),S.batchingColor&&a.enable(21),S.gradientMap&&a.enable(22),w.push(a.mask),a.disableAll(),S.fog&&a.enable(0),S.useFog&&a.enable(1),S.flatShading&&a.enable(2),S.logarithmicDepthBuffer&&a.enable(3),S.reverseDepthBuffer&&a.enable(4),S.skinning&&a.enable(5),S.morphTargets&&a.enable(6),S.morphNormals&&a.enable(7),S.morphColors&&a.enable(8),S.premultipliedAlpha&&a.enable(9),S.shadowMapEnabled&&a.enable(10),S.doubleSided&&a.enable(11),S.flipSided&&a.enable(12),S.useDepthPacking&&a.enable(13),S.dithering&&a.enable(14),S.transmission&&a.enable(15),S.sheen&&a.enable(16),S.opaque&&a.enable(17),S.pointsUvs&&a.enable(18),S.decodeVideoTexture&&a.enable(19),S.decodeVideoTextureEmissive&&a.enable(20),S.alphaToCoverage&&a.enable(21),w.push(a.mask)}function M(w){const S=g[w.type];let D;if(S){const $=Cn[S];D=r0.clone($.uniforms)}else D=w.uniforms;return D}function P(w,S){let D;for(let $=0,k=u.length;$<k;$++){const q=u[$];if(q.cacheKey===S){D=q,++D.usedTimes;break}}return D===void 0&&(D=new IS(n,S,w,r),u.push(D)),D}function E(w){if(--w.usedTimes===0){const S=u.indexOf(w);u[S]=u[u.length-1],u.pop(),w.destroy()}}function A(w){l.remove(w)}function R(){l.dispose()}return{getParameters:m,getProgramCacheKey:f,getUniforms:M,acquireProgram:P,releaseProgram:E,releaseShaderCache:A,programs:u,dispose:R}}function BS(){let n=new WeakMap;function e(o){return n.has(o)}function t(o){let a=n.get(o);return a===void 0&&(a={},n.set(o,a)),a}function i(o){n.delete(o)}function s(o,a,l){n.get(o)[a]=l}function r(){n=new WeakMap}return{has:e,get:t,remove:i,update:s,dispose:r}}function kS(n,e){return n.groupOrder!==e.groupOrder?n.groupOrder-e.groupOrder:n.renderOrder!==e.renderOrder?n.renderOrder-e.renderOrder:n.material.id!==e.material.id?n.material.id-e.material.id:n.z!==e.z?n.z-e.z:n.id-e.id}function vh(n,e){return n.groupOrder!==e.groupOrder?n.groupOrder-e.groupOrder:n.renderOrder!==e.renderOrder?n.renderOrder-e.renderOrder:n.z!==e.z?e.z-n.z:n.id-e.id}function xh(){const n=[];let e=0;const t=[],i=[],s=[];function r(){e=0,t.length=0,i.length=0,s.length=0}function o(d,h,p,g,v,m){let f=n[e];return f===void 0?(f={id:d.id,object:d,geometry:h,material:p,groupOrder:g,renderOrder:d.renderOrder,z:v,group:m},n[e]=f):(f.id=d.id,f.object=d,f.geometry=h,f.material=p,f.groupOrder=g,f.renderOrder=d.renderOrder,f.z=v,f.group=m),e++,f}function a(d,h,p,g,v,m){const f=o(d,h,p,g,v,m);p.transmission>0?i.push(f):p.transparent===!0?s.push(f):t.push(f)}function l(d,h,p,g,v,m){const f=o(d,h,p,g,v,m);p.transmission>0?i.unshift(f):p.transparent===!0?s.unshift(f):t.unshift(f)}function c(d,h){t.length>1&&t.sort(d||kS),i.length>1&&i.sort(h||vh),s.length>1&&s.sort(h||vh)}function u(){for(let d=e,h=n.length;d<h;d++){const p=n[d];if(p.id===null)break;p.id=null,p.object=null,p.geometry=null,p.material=null,p.group=null}}return{opaque:t,transmissive:i,transparent:s,init:r,push:a,unshift:l,finish:u,sort:c}}function zS(){let n=new WeakMap;function e(i,s){const r=n.get(i);let o;return r===void 0?(o=new xh,n.set(i,[o])):s>=r.length?(o=new xh,r.push(o)):o=r[s],o}function t(){n=new WeakMap}return{get:e,dispose:t}}function GS(){const n={};return{get:function(e){if(n[e.id]!==void 0)return n[e.id];let t;switch(e.type){case"DirectionalLight":t={direction:new O,color:new Pe};break;case"SpotLight":t={position:new O,direction:new O,color:new Pe,distance:0,coneCos:0,penumbraCos:0,decay:0};break;case"PointLight":t={position:new O,color:new Pe,distance:0,decay:0};break;case"HemisphereLight":t={direction:new O,skyColor:new Pe,groundColor:new Pe};break;case"RectAreaLight":t={color:new Pe,position:new O,halfWidth:new O,halfHeight:new O};break}return n[e.id]=t,t}}}function HS(){const n={};return{get:function(e){if(n[e.id]!==void 0)return n[e.id];let t;switch(e.type){case"DirectionalLight":t={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new Ve};break;case"SpotLight":t={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new Ve};break;case"PointLight":t={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new Ve,shadowCameraNear:1,shadowCameraFar:1e3};break}return n[e.id]=t,t}}}let VS=0;function $S(n,e){return(e.castShadow?2:0)-(n.castShadow?2:0)+(e.map?1:0)-(n.map?1:0)}function WS(n){const e=new GS,t=HS(),i={version:0,hash:{directionalLength:-1,pointLength:-1,spotLength:-1,rectAreaLength:-1,hemiLength:-1,numDirectionalShadows:-1,numPointShadows:-1,numSpotShadows:-1,numSpotMaps:-1,numLightProbes:-1},ambient:[0,0,0],probe:[],directional:[],directionalShadow:[],directionalShadowMap:[],directionalShadowMatrix:[],spot:[],spotLightMap:[],spotShadow:[],spotShadowMap:[],spotLightMatrix:[],rectArea:[],rectAreaLTC1:null,rectAreaLTC2:null,point:[],pointShadow:[],pointShadowMap:[],pointShadowMatrix:[],hemi:[],numSpotLightShadowsWithMaps:0,numLightProbes:0};for(let c=0;c<9;c++)i.probe.push(new O);const s=new O,r=new rt,o=new rt;function a(c){let u=0,d=0,h=0;for(let w=0;w<9;w++)i.probe[w].set(0,0,0);let p=0,g=0,v=0,m=0,f=0,T=0,y=0,M=0,P=0,E=0,A=0;c.sort($S);for(let w=0,S=c.length;w<S;w++){const D=c[w],$=D.color,k=D.intensity,q=D.distance,Z=D.shadow&&D.shadow.map?D.shadow.map.texture:null;if(D.isAmbientLight)u+=$.r*k,d+=$.g*k,h+=$.b*k;else if(D.isLightProbe){for(let V=0;V<9;V++)i.probe[V].addScaledVector(D.sh.coefficients[V],k);A++}else if(D.isDirectionalLight){const V=e.get(D);if(V.color.copy(D.color).multiplyScalar(D.intensity),D.castShadow){const se=D.shadow,H=t.get(D);H.shadowIntensity=se.intensity,H.shadowBias=se.bias,H.shadowNormalBias=se.normalBias,H.shadowRadius=se.radius,H.shadowMapSize=se.mapSize,i.directionalShadow[p]=H,i.directionalShadowMap[p]=Z,i.directionalShadowMatrix[p]=D.shadow.matrix,T++}i.directional[p]=V,p++}else if(D.isSpotLight){const V=e.get(D);V.position.setFromMatrixPosition(D.matrixWorld),V.color.copy($).multiplyScalar(k),V.distance=q,V.coneCos=Math.cos(D.angle),V.penumbraCos=Math.cos(D.angle*(1-D.penumbra)),V.decay=D.decay,i.spot[v]=V;const se=D.shadow;if(D.map&&(i.spotLightMap[P]=D.map,P++,se.updateMatrices(D),D.castShadow&&E++),i.spotLightMatrix[v]=se.matrix,D.castShadow){const H=t.get(D);H.shadowIntensity=se.intensity,H.shadowBias=se.bias,H.shadowNormalBias=se.normalBias,H.shadowRadius=se.radius,H.shadowMapSize=se.mapSize,i.spotShadow[v]=H,i.spotShadowMap[v]=Z,M++}v++}else if(D.isRectAreaLight){const V=e.get(D);V.color.copy($).multiplyScalar(k),V.halfWidth.set(D.width*.5,0,0),V.halfHeight.set(0,D.height*.5,0),i.rectArea[m]=V,m++}else if(D.isPointLight){const V=e.get(D);if(V.color.copy(D.color).multiplyScalar(D.intensity),V.distance=D.distance,V.decay=D.decay,D.castShadow){const se=D.shadow,H=t.get(D);H.shadowIntensity=se.intensity,H.shadowBias=se.bias,H.shadowNormalBias=se.normalBias,H.shadowRadius=se.radius,H.shadowMapSize=se.mapSize,H.shadowCameraNear=se.camera.near,H.shadowCameraFar=se.camera.far,i.pointShadow[g]=H,i.pointShadowMap[g]=Z,i.pointShadowMatrix[g]=D.shadow.matrix,y++}i.point[g]=V,g++}else if(D.isHemisphereLight){const V=e.get(D);V.skyColor.copy(D.color).multiplyScalar(k),V.groundColor.copy(D.groundColor).multiplyScalar(k),i.hemi[f]=V,f++}}m>0&&(n.has("OES_texture_float_linear")===!0?(i.rectAreaLTC1=ue.LTC_FLOAT_1,i.rectAreaLTC2=ue.LTC_FLOAT_2):(i.rectAreaLTC1=ue.LTC_HALF_1,i.rectAreaLTC2=ue.LTC_HALF_2)),i.ambient[0]=u,i.ambient[1]=d,i.ambient[2]=h;const R=i.hash;(R.directionalLength!==p||R.pointLength!==g||R.spotLength!==v||R.rectAreaLength!==m||R.hemiLength!==f||R.numDirectionalShadows!==T||R.numPointShadows!==y||R.numSpotShadows!==M||R.numSpotMaps!==P||R.numLightProbes!==A)&&(i.directional.length=p,i.spot.length=v,i.rectArea.length=m,i.point.length=g,i.hemi.length=f,i.directionalShadow.length=T,i.directionalShadowMap.length=T,i.pointShadow.length=y,i.pointShadowMap.length=y,i.spotShadow.length=M,i.spotShadowMap.length=M,i.directionalShadowMatrix.length=T,i.pointShadowMatrix.length=y,i.spotLightMatrix.length=M+P-E,i.spotLightMap.length=P,i.numSpotLightShadowsWithMaps=E,i.numLightProbes=A,R.directionalLength=p,R.pointLength=g,R.spotLength=v,R.rectAreaLength=m,R.hemiLength=f,R.numDirectionalShadows=T,R.numPointShadows=y,R.numSpotShadows=M,R.numSpotMaps=P,R.numLightProbes=A,i.version=VS++)}function l(c,u){let d=0,h=0,p=0,g=0,v=0;const m=u.matrixWorldInverse;for(let f=0,T=c.length;f<T;f++){const y=c[f];if(y.isDirectionalLight){const M=i.directional[d];M.direction.setFromMatrixPosition(y.matrixWorld),s.setFromMatrixPosition(y.target.matrixWorld),M.direction.sub(s),M.direction.transformDirection(m),d++}else if(y.isSpotLight){const M=i.spot[p];M.position.setFromMatrixPosition(y.matrixWorld),M.position.applyMatrix4(m),M.direction.setFromMatrixPosition(y.matrixWorld),s.setFromMatrixPosition(y.target.matrixWorld),M.direction.sub(s),M.direction.transformDirection(m),p++}else if(y.isRectAreaLight){const M=i.rectArea[g];M.position.setFromMatrixPosition(y.matrixWorld),M.position.applyMatrix4(m),o.identity(),r.copy(y.matrixWorld),r.premultiply(m),o.extractRotation(r),M.halfWidth.set(y.width*.5,0,0),M.halfHeight.set(0,y.height*.5,0),M.halfWidth.applyMatrix4(o),M.halfHeight.applyMatrix4(o),g++}else if(y.isPointLight){const M=i.point[h];M.position.setFromMatrixPosition(y.matrixWorld),M.position.applyMatrix4(m),h++}else if(y.isHemisphereLight){const M=i.hemi[v];M.direction.setFromMatrixPosition(y.matrixWorld),M.direction.transformDirection(m),v++}}}return{setup:a,setupView:l,state:i}}function yh(n){const e=new WS(n),t=[],i=[];function s(u){c.camera=u,t.length=0,i.length=0}function r(u){t.push(u)}function o(u){i.push(u)}function a(){e.setup(t)}function l(u){e.setupView(t,u)}const c={lightsArray:t,shadowsArray:i,camera:null,lights:e,transmissionRenderTarget:{}};return{init:s,state:c,setupLights:a,setupLightsView:l,pushLight:r,pushShadow:o}}function XS(n){let e=new WeakMap;function t(s,r=0){const o=e.get(s);let a;return o===void 0?(a=new yh(n),e.set(s,[a])):r>=o.length?(a=new yh(n),o.push(a)):a=o[r],a}function i(){e=new WeakMap}return{get:t,dispose:i}}const YS=`void main() {
	gl_Position = vec4( position, 1.0 );
}`,qS=`uniform sampler2D shadow_pass;
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
}`;function jS(n,e,t){let i=new cu;const s=new Ve,r=new Ve,o=new Mt,a=new _0({depthPacking:T_}),l=new v0,c={},u=t.maxTextureSize,d={[wi]:Jt,[Jt]:wi,[Yn]:Yn},h=new bi({defines:{VSM_SAMPLES:8},uniforms:{shadow_pass:{value:null},resolution:{value:new Ve},radius:{value:4}},vertexShader:YS,fragmentShader:qS}),p=h.clone();p.defines.HORIZONTAL_PASS=1;const g=new Ot;g.setAttribute("position",new Ut(new Float32Array([-1,-1,.5,3,-1,.5,-1,3,.5]),3));const v=new xn(g,h),m=this;this.enabled=!1,this.autoUpdate=!0,this.needsUpdate=!1,this.type=Wf;let f=this.type;this.render=function(E,A,R){if(m.enabled===!1||m.autoUpdate===!1&&m.needsUpdate===!1||E.length===0)return;const w=n.getRenderTarget(),S=n.getActiveCubeFace(),D=n.getActiveMipmapLevel(),$=n.state;$.setBlending(xi),$.buffers.color.setClear(1,1,1,1),$.buffers.depth.setTest(!0),$.setScissorTest(!1);const k=f!==$n&&this.type===$n,q=f===$n&&this.type!==$n;for(let Z=0,V=E.length;Z<V;Z++){const se=E[Z],H=se.shadow;if(H===void 0){console.warn("THREE.WebGLShadowMap:",se,"has no shadow.");continue}if(H.autoUpdate===!1&&H.needsUpdate===!1)continue;s.copy(H.mapSize);const ae=H.getFrameExtents();if(s.multiply(ae),r.copy(H.mapSize),(s.x>u||s.y>u)&&(s.x>u&&(r.x=Math.floor(u/ae.x),s.x=r.x*ae.x,H.mapSize.x=r.x),s.y>u&&(r.y=Math.floor(u/ae.y),s.y=r.y*ae.y,H.mapSize.y=r.y)),H.map===null||k===!0||q===!0){const Te=this.type!==$n?{minFilter:ln,magFilter:ln}:{};H.map!==null&&H.map.dispose(),H.map=new Wi(s.x,s.y,Te),H.map.texture.name=se.name+".shadowMap",H.camera.updateProjectionMatrix()}n.setRenderTarget(H.map),n.clear();const ge=H.getViewportCount();for(let Te=0;Te<ge;Te++){const $e=H.getViewport(Te);o.set(r.x*$e.x,r.y*$e.y,r.x*$e.z,r.y*$e.w),$.viewport(o),H.updateMatrices(se,Te),i=H.getFrustum(),M(A,R,H.camera,se,this.type)}H.isPointLightShadow!==!0&&this.type===$n&&T(H,R),H.needsUpdate=!1}f=this.type,m.needsUpdate=!1,n.setRenderTarget(w,S,D)};function T(E,A){const R=e.update(v);h.defines.VSM_SAMPLES!==E.blurSamples&&(h.defines.VSM_SAMPLES=E.blurSamples,p.defines.VSM_SAMPLES=E.blurSamples,h.needsUpdate=!0,p.needsUpdate=!0),E.mapPass===null&&(E.mapPass=new Wi(s.x,s.y)),h.uniforms.shadow_pass.value=E.map.texture,h.uniforms.resolution.value=E.mapSize,h.uniforms.radius.value=E.radius,n.setRenderTarget(E.mapPass),n.clear(),n.renderBufferDirect(A,null,R,h,v,null),p.uniforms.shadow_pass.value=E.mapPass.texture,p.uniforms.resolution.value=E.mapSize,p.uniforms.radius.value=E.radius,n.setRenderTarget(E.map),n.clear(),n.renderBufferDirect(A,null,R,p,v,null)}function y(E,A,R,w){let S=null;const D=R.isPointLight===!0?E.customDistanceMaterial:E.customDepthMaterial;if(D!==void 0)S=D;else if(S=R.isPointLight===!0?l:a,n.localClippingEnabled&&A.clipShadows===!0&&Array.isArray(A.clippingPlanes)&&A.clippingPlanes.length!==0||A.displacementMap&&A.displacementScale!==0||A.alphaMap&&A.alphaTest>0||A.map&&A.alphaTest>0||A.alphaToCoverage===!0){const $=S.uuid,k=A.uuid;let q=c[$];q===void 0&&(q={},c[$]=q);let Z=q[k];Z===void 0&&(Z=S.clone(),q[k]=Z,A.addEventListener("dispose",P)),S=Z}if(S.visible=A.visible,S.wireframe=A.wireframe,w===$n?S.side=A.shadowSide!==null?A.shadowSide:A.side:S.side=A.shadowSide!==null?A.shadowSide:d[A.side],S.alphaMap=A.alphaMap,S.alphaTest=A.alphaToCoverage===!0?.5:A.alphaTest,S.map=A.map,S.clipShadows=A.clipShadows,S.clippingPlanes=A.clippingPlanes,S.clipIntersection=A.clipIntersection,S.displacementMap=A.displacementMap,S.displacementScale=A.displacementScale,S.displacementBias=A.displacementBias,S.wireframeLinewidth=A.wireframeLinewidth,S.linewidth=A.linewidth,R.isPointLight===!0&&S.isMeshDistanceMaterial===!0){const $=n.properties.get(S);$.light=R}return S}function M(E,A,R,w,S){if(E.visible===!1)return;if(E.layers.test(A.layers)&&(E.isMesh||E.isLine||E.isPoints)&&(E.castShadow||E.receiveShadow&&S===$n)&&(!E.frustumCulled||i.intersectsObject(E))){E.modelViewMatrix.multiplyMatrices(R.matrixWorldInverse,E.matrixWorld);const k=e.update(E),q=E.material;if(Array.isArray(q)){const Z=k.groups;for(let V=0,se=Z.length;V<se;V++){const H=Z[V],ae=q[H.materialIndex];if(ae&&ae.visible){const ge=y(E,ae,w,S);E.onBeforeShadow(n,E,A,R,k,ge,H),n.renderBufferDirect(R,null,k,ge,E,H),E.onAfterShadow(n,E,A,R,k,ge,H)}}}else if(q.visible){const Z=y(E,q,w,S);E.onBeforeShadow(n,E,A,R,k,Z,null),n.renderBufferDirect(R,null,k,Z,E,null),E.onAfterShadow(n,E,A,R,k,Z,null)}}const $=E.children;for(let k=0,q=$.length;k<q;k++)M($[k],A,R,w,S)}function P(E){E.target.removeEventListener("dispose",P);for(const R in c){const w=c[R],S=E.target.uuid;S in w&&(w[S].dispose(),delete w[S])}}}const KS={[Al]:Rl,[Cl]:Dl,[Pl]:Il,[Is]:Ll,[Rl]:Al,[Dl]:Cl,[Il]:Pl,[Ll]:Is};function ZS(n,e){function t(){let I=!1;const pe=new Mt;let te=null;const ye=new Mt(0,0,0,0);return{setMask:function(ie){te!==ie&&!I&&(n.colorMask(ie,ie,ie,ie),te=ie)},setLocked:function(ie){I=ie},setClear:function(ie,K,Se,He,mt){mt===!0&&(ie*=He,K*=He,Se*=He),pe.set(ie,K,Se,He),ye.equals(pe)===!1&&(n.clearColor(ie,K,Se,He),ye.copy(pe))},reset:function(){I=!1,te=null,ye.set(-1,0,0,0)}}}function i(){let I=!1,pe=!1,te=null,ye=null,ie=null;return{setReversed:function(K){if(pe!==K){const Se=e.get("EXT_clip_control");K?Se.clipControlEXT(Se.LOWER_LEFT_EXT,Se.ZERO_TO_ONE_EXT):Se.clipControlEXT(Se.LOWER_LEFT_EXT,Se.NEGATIVE_ONE_TO_ONE_EXT),pe=K;const He=ie;ie=null,this.setClear(He)}},getReversed:function(){return pe},setTest:function(K){K?fe(n.DEPTH_TEST):we(n.DEPTH_TEST)},setMask:function(K){te!==K&&!I&&(n.depthMask(K),te=K)},setFunc:function(K){if(pe&&(K=KS[K]),ye!==K){switch(K){case Al:n.depthFunc(n.NEVER);break;case Rl:n.depthFunc(n.ALWAYS);break;case Cl:n.depthFunc(n.LESS);break;case Is:n.depthFunc(n.LEQUAL);break;case Pl:n.depthFunc(n.EQUAL);break;case Ll:n.depthFunc(n.GEQUAL);break;case Dl:n.depthFunc(n.GREATER);break;case Il:n.depthFunc(n.NOTEQUAL);break;default:n.depthFunc(n.LEQUAL)}ye=K}},setLocked:function(K){I=K},setClear:function(K){ie!==K&&(pe&&(K=1-K),n.clearDepth(K),ie=K)},reset:function(){I=!1,te=null,ye=null,ie=null,pe=!1}}}function s(){let I=!1,pe=null,te=null,ye=null,ie=null,K=null,Se=null,He=null,mt=null;return{setTest:function(ot){I||(ot?fe(n.STENCIL_TEST):we(n.STENCIL_TEST))},setMask:function(ot){pe!==ot&&!I&&(n.stencilMask(ot),pe=ot)},setFunc:function(ot,Mn,Bn){(te!==ot||ye!==Mn||ie!==Bn)&&(n.stencilFunc(ot,Mn,Bn),te=ot,ye=Mn,ie=Bn)},setOp:function(ot,Mn,Bn){(K!==ot||Se!==Mn||He!==Bn)&&(n.stencilOp(ot,Mn,Bn),K=ot,Se=Mn,He=Bn)},setLocked:function(ot){I=ot},setClear:function(ot){mt!==ot&&(n.clearStencil(ot),mt=ot)},reset:function(){I=!1,pe=null,te=null,ye=null,ie=null,K=null,Se=null,He=null,mt=null}}}const r=new t,o=new i,a=new s,l=new WeakMap,c=new WeakMap;let u={},d={},h=new WeakMap,p=[],g=null,v=!1,m=null,f=null,T=null,y=null,M=null,P=null,E=null,A=new Pe(0,0,0),R=0,w=!1,S=null,D=null,$=null,k=null,q=null;const Z=n.getParameter(n.MAX_COMBINED_TEXTURE_IMAGE_UNITS);let V=!1,se=0;const H=n.getParameter(n.VERSION);H.indexOf("WebGL")!==-1?(se=parseFloat(/^WebGL (\d)/.exec(H)[1]),V=se>=1):H.indexOf("OpenGL ES")!==-1&&(se=parseFloat(/^OpenGL ES (\d)/.exec(H)[1]),V=se>=2);let ae=null,ge={};const Te=n.getParameter(n.SCISSOR_BOX),$e=n.getParameter(n.VIEWPORT),je=new Mt().fromArray(Te),X=new Mt().fromArray($e);function le(I,pe,te,ye){const ie=new Uint8Array(4),K=n.createTexture();n.bindTexture(I,K),n.texParameteri(I,n.TEXTURE_MIN_FILTER,n.NEAREST),n.texParameteri(I,n.TEXTURE_MAG_FILTER,n.NEAREST);for(let Se=0;Se<te;Se++)I===n.TEXTURE_3D||I===n.TEXTURE_2D_ARRAY?n.texImage3D(pe,0,n.RGBA,1,1,ye,0,n.RGBA,n.UNSIGNED_BYTE,ie):n.texImage2D(pe+Se,0,n.RGBA,1,1,0,n.RGBA,n.UNSIGNED_BYTE,ie);return K}const Ee={};Ee[n.TEXTURE_2D]=le(n.TEXTURE_2D,n.TEXTURE_2D,1),Ee[n.TEXTURE_CUBE_MAP]=le(n.TEXTURE_CUBE_MAP,n.TEXTURE_CUBE_MAP_POSITIVE_X,6),Ee[n.TEXTURE_2D_ARRAY]=le(n.TEXTURE_2D_ARRAY,n.TEXTURE_2D_ARRAY,1,1),Ee[n.TEXTURE_3D]=le(n.TEXTURE_3D,n.TEXTURE_3D,1,1),r.setClear(0,0,0,1),o.setClear(1),a.setClear(0),fe(n.DEPTH_TEST),o.setFunc(Is),st(!1),ft(dd),fe(n.CULL_FACE),L(xi);function fe(I){u[I]!==!0&&(n.enable(I),u[I]=!0)}function we(I){u[I]!==!1&&(n.disable(I),u[I]=!1)}function Qe(I,pe){return d[I]!==pe?(n.bindFramebuffer(I,pe),d[I]=pe,I===n.DRAW_FRAMEBUFFER&&(d[n.FRAMEBUFFER]=pe),I===n.FRAMEBUFFER&&(d[n.DRAW_FRAMEBUFFER]=pe),!0):!1}function Y(I,pe){let te=p,ye=!1;if(I){te=h.get(pe),te===void 0&&(te=[],h.set(pe,te));const ie=I.textures;if(te.length!==ie.length||te[0]!==n.COLOR_ATTACHMENT0){for(let K=0,Se=ie.length;K<Se;K++)te[K]=n.COLOR_ATTACHMENT0+K;te.length=ie.length,ye=!0}}else te[0]!==n.BACK&&(te[0]=n.BACK,ye=!0);ye&&n.drawBuffers(te)}function _e(I){return g!==I?(n.useProgram(I),g=I,!0):!1}const Ye={[Ui]:n.FUNC_ADD,[Jg]:n.FUNC_SUBTRACT,[Qg]:n.FUNC_REVERSE_SUBTRACT};Ye[e_]=n.MIN,Ye[t_]=n.MAX;const Oe={[n_]:n.ZERO,[i_]:n.ONE,[s_]:n.SRC_COLOR,[El]:n.SRC_ALPHA,[u_]:n.SRC_ALPHA_SATURATE,[l_]:n.DST_COLOR,[o_]:n.DST_ALPHA,[r_]:n.ONE_MINUS_SRC_COLOR,[Tl]:n.ONE_MINUS_SRC_ALPHA,[c_]:n.ONE_MINUS_DST_COLOR,[a_]:n.ONE_MINUS_DST_ALPHA,[d_]:n.CONSTANT_COLOR,[h_]:n.ONE_MINUS_CONSTANT_COLOR,[f_]:n.CONSTANT_ALPHA,[p_]:n.ONE_MINUS_CONSTANT_ALPHA};function L(I,pe,te,ye,ie,K,Se,He,mt,ot){if(I===xi){v===!0&&(we(n.BLEND),v=!1);return}if(v===!1&&(fe(n.BLEND),v=!0),I!==Zg){if(I!==m||ot!==w){if((f!==Ui||M!==Ui)&&(n.blendEquation(n.FUNC_ADD),f=Ui,M=Ui),ot)switch(I){case Ts:n.blendFuncSeparate(n.ONE,n.ONE_MINUS_SRC_ALPHA,n.ONE,n.ONE_MINUS_SRC_ALPHA);break;case hd:n.blendFunc(n.ONE,n.ONE);break;case fd:n.blendFuncSeparate(n.ZERO,n.ONE_MINUS_SRC_COLOR,n.ZERO,n.ONE);break;case pd:n.blendFuncSeparate(n.DST_COLOR,n.ONE_MINUS_SRC_ALPHA,n.ZERO,n.ONE);break;default:console.error("THREE.WebGLState: Invalid blending: ",I);break}else switch(I){case Ts:n.blendFuncSeparate(n.SRC_ALPHA,n.ONE_MINUS_SRC_ALPHA,n.ONE,n.ONE_MINUS_SRC_ALPHA);break;case hd:n.blendFuncSeparate(n.SRC_ALPHA,n.ONE,n.ONE,n.ONE);break;case fd:console.error("THREE.WebGLState: SubtractiveBlending requires material.premultipliedAlpha = true");break;case pd:console.error("THREE.WebGLState: MultiplyBlending requires material.premultipliedAlpha = true");break;default:console.error("THREE.WebGLState: Invalid blending: ",I);break}T=null,y=null,P=null,E=null,A.set(0,0,0),R=0,m=I,w=ot}return}ie=ie||pe,K=K||te,Se=Se||ye,(pe!==f||ie!==M)&&(n.blendEquationSeparate(Ye[pe],Ye[ie]),f=pe,M=ie),(te!==T||ye!==y||K!==P||Se!==E)&&(n.blendFuncSeparate(Oe[te],Oe[ye],Oe[K],Oe[Se]),T=te,y=ye,P=K,E=Se),(He.equals(A)===!1||mt!==R)&&(n.blendColor(He.r,He.g,He.b,mt),A.copy(He),R=mt),m=I,w=!1}function Tt(I,pe){I.side===Yn?we(n.CULL_FACE):fe(n.CULL_FACE);let te=I.side===Jt;pe&&(te=!te),st(te),I.blending===Ts&&I.transparent===!1?L(xi):L(I.blending,I.blendEquation,I.blendSrc,I.blendDst,I.blendEquationAlpha,I.blendSrcAlpha,I.blendDstAlpha,I.blendColor,I.blendAlpha,I.premultipliedAlpha),o.setFunc(I.depthFunc),o.setTest(I.depthTest),o.setMask(I.depthWrite),r.setMask(I.colorWrite);const ye=I.stencilWrite;a.setTest(ye),ye&&(a.setMask(I.stencilWriteMask),a.setFunc(I.stencilFunc,I.stencilRef,I.stencilFuncMask),a.setOp(I.stencilFail,I.stencilZFail,I.stencilZPass)),tt(I.polygonOffset,I.polygonOffsetFactor,I.polygonOffsetUnits),I.alphaToCoverage===!0?fe(n.SAMPLE_ALPHA_TO_COVERAGE):we(n.SAMPLE_ALPHA_TO_COVERAGE)}function st(I){S!==I&&(I?n.frontFace(n.CW):n.frontFace(n.CCW),S=I)}function ft(I){I!==qg?(fe(n.CULL_FACE),I!==D&&(I===dd?n.cullFace(n.BACK):I===jg?n.cullFace(n.FRONT):n.cullFace(n.FRONT_AND_BACK))):we(n.CULL_FACE),D=I}function Ae(I){I!==$&&(V&&n.lineWidth(I),$=I)}function tt(I,pe,te){I?(fe(n.POLYGON_OFFSET_FILL),(k!==pe||q!==te)&&(n.polygonOffset(pe,te),k=pe,q=te)):we(n.POLYGON_OFFSET_FILL)}function Ie(I){I?fe(n.SCISSOR_TEST):we(n.SCISSOR_TEST)}function Ke(I){I===void 0&&(I=n.TEXTURE0+Z-1),ae!==I&&(n.activeTexture(I),ae=I)}function At(I,pe,te){te===void 0&&(ae===null?te=n.TEXTURE0+Z-1:te=ae);let ye=ge[te];ye===void 0&&(ye={type:void 0,texture:void 0},ge[te]=ye),(ye.type!==I||ye.texture!==pe)&&(ae!==te&&(n.activeTexture(te),ae=te),n.bindTexture(I,pe||Ee[I]),ye.type=I,ye.texture=pe)}function C(){const I=ge[ae];I!==void 0&&I.type!==void 0&&(n.bindTexture(I.type,null),I.type=void 0,I.texture=void 0)}function x(){try{n.compressedTexImage2D(...arguments)}catch(I){console.error("THREE.WebGLState:",I)}}function B(){try{n.compressedTexImage3D(...arguments)}catch(I){console.error("THREE.WebGLState:",I)}}function j(){try{n.texSubImage2D(...arguments)}catch(I){console.error("THREE.WebGLState:",I)}}function J(){try{n.texSubImage3D(...arguments)}catch(I){console.error("THREE.WebGLState:",I)}}function W(){try{n.compressedTexSubImage2D(...arguments)}catch(I){console.error("THREE.WebGLState:",I)}}function Re(){try{n.compressedTexSubImage3D(...arguments)}catch(I){console.error("THREE.WebGLState:",I)}}function he(){try{n.texStorage2D(...arguments)}catch(I){console.error("THREE.WebGLState:",I)}}function be(){try{n.texStorage3D(...arguments)}catch(I){console.error("THREE.WebGLState:",I)}}function Ce(){try{n.texImage2D(...arguments)}catch(I){console.error("THREE.WebGLState:",I)}}function ee(){try{n.texImage3D(...arguments)}catch(I){console.error("THREE.WebGLState:",I)}}function ve(I){je.equals(I)===!1&&(n.scissor(I.x,I.y,I.z,I.w),je.copy(I))}function Fe(I){X.equals(I)===!1&&(n.viewport(I.x,I.y,I.z,I.w),X.copy(I))}function Ue(I,pe){let te=c.get(pe);te===void 0&&(te=new WeakMap,c.set(pe,te));let ye=te.get(I);ye===void 0&&(ye=n.getUniformBlockIndex(pe,I.name),te.set(I,ye))}function ce(I,pe){const ye=c.get(pe).get(I);l.get(pe)!==ye&&(n.uniformBlockBinding(pe,ye,I.__bindingPointIndex),l.set(pe,ye))}function Ge(){n.disable(n.BLEND),n.disable(n.CULL_FACE),n.disable(n.DEPTH_TEST),n.disable(n.POLYGON_OFFSET_FILL),n.disable(n.SCISSOR_TEST),n.disable(n.STENCIL_TEST),n.disable(n.SAMPLE_ALPHA_TO_COVERAGE),n.blendEquation(n.FUNC_ADD),n.blendFunc(n.ONE,n.ZERO),n.blendFuncSeparate(n.ONE,n.ZERO,n.ONE,n.ZERO),n.blendColor(0,0,0,0),n.colorMask(!0,!0,!0,!0),n.clearColor(0,0,0,0),n.depthMask(!0),n.depthFunc(n.LESS),o.setReversed(!1),n.clearDepth(1),n.stencilMask(4294967295),n.stencilFunc(n.ALWAYS,0,4294967295),n.stencilOp(n.KEEP,n.KEEP,n.KEEP),n.clearStencil(0),n.cullFace(n.BACK),n.frontFace(n.CCW),n.polygonOffset(0,0),n.activeTexture(n.TEXTURE0),n.bindFramebuffer(n.FRAMEBUFFER,null),n.bindFramebuffer(n.DRAW_FRAMEBUFFER,null),n.bindFramebuffer(n.READ_FRAMEBUFFER,null),n.useProgram(null),n.lineWidth(1),n.scissor(0,0,n.canvas.width,n.canvas.height),n.viewport(0,0,n.canvas.width,n.canvas.height),u={},ae=null,ge={},d={},h=new WeakMap,p=[],g=null,v=!1,m=null,f=null,T=null,y=null,M=null,P=null,E=null,A=new Pe(0,0,0),R=0,w=!1,S=null,D=null,$=null,k=null,q=null,je.set(0,0,n.canvas.width,n.canvas.height),X.set(0,0,n.canvas.width,n.canvas.height),r.reset(),o.reset(),a.reset()}return{buffers:{color:r,depth:o,stencil:a},enable:fe,disable:we,bindFramebuffer:Qe,drawBuffers:Y,useProgram:_e,setBlending:L,setMaterial:Tt,setFlipSided:st,setCullFace:ft,setLineWidth:Ae,setPolygonOffset:tt,setScissorTest:Ie,activeTexture:Ke,bindTexture:At,unbindTexture:C,compressedTexImage2D:x,compressedTexImage3D:B,texImage2D:Ce,texImage3D:ee,updateUBOMapping:Ue,uniformBlockBinding:ce,texStorage2D:he,texStorage3D:be,texSubImage2D:j,texSubImage3D:J,compressedTexSubImage2D:W,compressedTexSubImage3D:Re,scissor:ve,viewport:Fe,reset:Ge}}function JS(n,e,t,i,s,r,o){const a=e.has("WEBGL_multisampled_render_to_texture")?e.get("WEBGL_multisampled_render_to_texture"):null,l=typeof navigator>"u"?!1:/OculusBrowser/g.test(navigator.userAgent),c=new Ve,u=new WeakMap;let d;const h=new WeakMap;let p=!1;try{p=typeof OffscreenCanvas<"u"&&new OffscreenCanvas(1,1).getContext("2d")!==null}catch{}function g(C,x){return p?new OffscreenCanvas(C,x):Wo("canvas")}function v(C,x,B){let j=1;const J=At(C);if((J.width>B||J.height>B)&&(j=B/Math.max(J.width,J.height)),j<1)if(typeof HTMLImageElement<"u"&&C instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&C instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&C instanceof ImageBitmap||typeof VideoFrame<"u"&&C instanceof VideoFrame){const W=Math.floor(j*J.width),Re=Math.floor(j*J.height);d===void 0&&(d=g(W,Re));const he=x?g(W,Re):d;return he.width=W,he.height=Re,he.getContext("2d").drawImage(C,0,0,W,Re),console.warn("THREE.WebGLRenderer: Texture has been resized from ("+J.width+"x"+J.height+") to ("+W+"x"+Re+")."),he}else return"data"in C&&console.warn("THREE.WebGLRenderer: Image in DataTexture is too big ("+J.width+"x"+J.height+")."),C;return C}function m(C){return C.generateMipmaps}function f(C){n.generateMipmap(C)}function T(C){return C.isWebGLCubeRenderTarget?n.TEXTURE_CUBE_MAP:C.isWebGL3DRenderTarget?n.TEXTURE_3D:C.isWebGLArrayRenderTarget||C.isCompressedArrayTexture?n.TEXTURE_2D_ARRAY:n.TEXTURE_2D}function y(C,x,B,j,J=!1){if(C!==null){if(n[C]!==void 0)return n[C];console.warn("THREE.WebGLRenderer: Attempt to use non-existing WebGL internal format '"+C+"'")}let W=x;if(x===n.RED&&(B===n.FLOAT&&(W=n.R32F),B===n.HALF_FLOAT&&(W=n.R16F),B===n.UNSIGNED_BYTE&&(W=n.R8)),x===n.RED_INTEGER&&(B===n.UNSIGNED_BYTE&&(W=n.R8UI),B===n.UNSIGNED_SHORT&&(W=n.R16UI),B===n.UNSIGNED_INT&&(W=n.R32UI),B===n.BYTE&&(W=n.R8I),B===n.SHORT&&(W=n.R16I),B===n.INT&&(W=n.R32I)),x===n.RG&&(B===n.FLOAT&&(W=n.RG32F),B===n.HALF_FLOAT&&(W=n.RG16F),B===n.UNSIGNED_BYTE&&(W=n.RG8)),x===n.RG_INTEGER&&(B===n.UNSIGNED_BYTE&&(W=n.RG8UI),B===n.UNSIGNED_SHORT&&(W=n.RG16UI),B===n.UNSIGNED_INT&&(W=n.RG32UI),B===n.BYTE&&(W=n.RG8I),B===n.SHORT&&(W=n.RG16I),B===n.INT&&(W=n.RG32I)),x===n.RGB_INTEGER&&(B===n.UNSIGNED_BYTE&&(W=n.RGB8UI),B===n.UNSIGNED_SHORT&&(W=n.RGB16UI),B===n.UNSIGNED_INT&&(W=n.RGB32UI),B===n.BYTE&&(W=n.RGB8I),B===n.SHORT&&(W=n.RGB16I),B===n.INT&&(W=n.RGB32I)),x===n.RGBA_INTEGER&&(B===n.UNSIGNED_BYTE&&(W=n.RGBA8UI),B===n.UNSIGNED_SHORT&&(W=n.RGBA16UI),B===n.UNSIGNED_INT&&(W=n.RGBA32UI),B===n.BYTE&&(W=n.RGBA8I),B===n.SHORT&&(W=n.RGBA16I),B===n.INT&&(W=n.RGBA32I)),x===n.RGB&&B===n.UNSIGNED_INT_5_9_9_9_REV&&(W=n.RGB9_E5),x===n.RGBA){const Re=J?Vo:it.getTransfer(j);B===n.FLOAT&&(W=n.RGBA32F),B===n.HALF_FLOAT&&(W=n.RGBA16F),B===n.UNSIGNED_BYTE&&(W=Re===ut?n.SRGB8_ALPHA8:n.RGBA8),B===n.UNSIGNED_SHORT_4_4_4_4&&(W=n.RGBA4),B===n.UNSIGNED_SHORT_5_5_5_1&&(W=n.RGB5_A1)}return(W===n.R16F||W===n.R32F||W===n.RG16F||W===n.RG32F||W===n.RGBA16F||W===n.RGBA32F)&&e.get("EXT_color_buffer_float"),W}function M(C,x){let B;return C?x===null||x===Vi||x===Sr?B=n.DEPTH24_STENCIL8:x===Ln?B=n.DEPTH32F_STENCIL8:x===yr&&(B=n.DEPTH24_STENCIL8,console.warn("DepthTexture: 16 bit depth attachment is not supported with stencil. Using 24-bit attachment.")):x===null||x===Vi||x===Sr?B=n.DEPTH_COMPONENT24:x===Ln?B=n.DEPTH_COMPONENT32F:x===yr&&(B=n.DEPTH_COMPONENT16),B}function P(C,x){return m(C)===!0||C.isFramebufferTexture&&C.minFilter!==ln&&C.minFilter!==Pn?Math.log2(Math.max(x.width,x.height))+1:C.mipmaps!==void 0&&C.mipmaps.length>0?C.mipmaps.length:C.isCompressedTexture&&Array.isArray(C.image)?x.mipmaps.length:1}function E(C){const x=C.target;x.removeEventListener("dispose",E),R(x),x.isVideoTexture&&u.delete(x)}function A(C){const x=C.target;x.removeEventListener("dispose",A),S(x)}function R(C){const x=i.get(C);if(x.__webglInit===void 0)return;const B=C.source,j=h.get(B);if(j){const J=j[x.__cacheKey];J.usedTimes--,J.usedTimes===0&&w(C),Object.keys(j).length===0&&h.delete(B)}i.remove(C)}function w(C){const x=i.get(C);n.deleteTexture(x.__webglTexture);const B=C.source,j=h.get(B);delete j[x.__cacheKey],o.memory.textures--}function S(C){const x=i.get(C);if(C.depthTexture&&(C.depthTexture.dispose(),i.remove(C.depthTexture)),C.isWebGLCubeRenderTarget)for(let j=0;j<6;j++){if(Array.isArray(x.__webglFramebuffer[j]))for(let J=0;J<x.__webglFramebuffer[j].length;J++)n.deleteFramebuffer(x.__webglFramebuffer[j][J]);else n.deleteFramebuffer(x.__webglFramebuffer[j]);x.__webglDepthbuffer&&n.deleteRenderbuffer(x.__webglDepthbuffer[j])}else{if(Array.isArray(x.__webglFramebuffer))for(let j=0;j<x.__webglFramebuffer.length;j++)n.deleteFramebuffer(x.__webglFramebuffer[j]);else n.deleteFramebuffer(x.__webglFramebuffer);if(x.__webglDepthbuffer&&n.deleteRenderbuffer(x.__webglDepthbuffer),x.__webglMultisampledFramebuffer&&n.deleteFramebuffer(x.__webglMultisampledFramebuffer),x.__webglColorRenderbuffer)for(let j=0;j<x.__webglColorRenderbuffer.length;j++)x.__webglColorRenderbuffer[j]&&n.deleteRenderbuffer(x.__webglColorRenderbuffer[j]);x.__webglDepthRenderbuffer&&n.deleteRenderbuffer(x.__webglDepthRenderbuffer)}const B=C.textures;for(let j=0,J=B.length;j<J;j++){const W=i.get(B[j]);W.__webglTexture&&(n.deleteTexture(W.__webglTexture),o.memory.textures--),i.remove(B[j])}i.remove(C)}let D=0;function $(){D=0}function k(){const C=D;return C>=s.maxTextures&&console.warn("THREE.WebGLTextures: Trying to use "+C+" texture units while this GPU supports only "+s.maxTextures),D+=1,C}function q(C){const x=[];return x.push(C.wrapS),x.push(C.wrapT),x.push(C.wrapR||0),x.push(C.magFilter),x.push(C.minFilter),x.push(C.anisotropy),x.push(C.internalFormat),x.push(C.format),x.push(C.type),x.push(C.generateMipmaps),x.push(C.premultiplyAlpha),x.push(C.flipY),x.push(C.unpackAlignment),x.push(C.colorSpace),x.join()}function Z(C,x){const B=i.get(C);if(C.isVideoTexture&&Ie(C),C.isRenderTargetTexture===!1&&C.version>0&&B.__version!==C.version){const j=C.image;if(j===null)console.warn("THREE.WebGLRenderer: Texture marked for update but no image data found.");else if(j.complete===!1)console.warn("THREE.WebGLRenderer: Texture marked for update but image is incomplete");else{Ee(B,C,x);return}}t.bindTexture(n.TEXTURE_2D,B.__webglTexture,n.TEXTURE0+x)}function V(C,x){const B=i.get(C);if(C.version>0&&B.__version!==C.version){Ee(B,C,x);return}t.bindTexture(n.TEXTURE_2D_ARRAY,B.__webglTexture,n.TEXTURE0+x)}function se(C,x){const B=i.get(C);if(C.version>0&&B.__version!==C.version){Ee(B,C,x);return}t.bindTexture(n.TEXTURE_3D,B.__webglTexture,n.TEXTURE0+x)}function H(C,x){const B=i.get(C);if(C.version>0&&B.__version!==C.version){fe(B,C,x);return}t.bindTexture(n.TEXTURE_CUBE_MAP,B.__webglTexture,n.TEXTURE0+x)}const ae={[Fl]:n.REPEAT,[Bi]:n.CLAMP_TO_EDGE,[Ol]:n.MIRRORED_REPEAT},ge={[ln]:n.NEAREST,[b_]:n.NEAREST_MIPMAP_NEAREST,[Hr]:n.NEAREST_MIPMAP_LINEAR,[Pn]:n.LINEAR,[Ra]:n.LINEAR_MIPMAP_NEAREST,[ki]:n.LINEAR_MIPMAP_LINEAR},Te={[R_]:n.NEVER,[N_]:n.ALWAYS,[C_]:n.LESS,[tp]:n.LEQUAL,[P_]:n.EQUAL,[I_]:n.GEQUAL,[L_]:n.GREATER,[D_]:n.NOTEQUAL};function $e(C,x){if(x.type===Ln&&e.has("OES_texture_float_linear")===!1&&(x.magFilter===Pn||x.magFilter===Ra||x.magFilter===Hr||x.magFilter===ki||x.minFilter===Pn||x.minFilter===Ra||x.minFilter===Hr||x.minFilter===ki)&&console.warn("THREE.WebGLRenderer: Unable to use linear filtering with floating point textures. OES_texture_float_linear not supported on this device."),n.texParameteri(C,n.TEXTURE_WRAP_S,ae[x.wrapS]),n.texParameteri(C,n.TEXTURE_WRAP_T,ae[x.wrapT]),(C===n.TEXTURE_3D||C===n.TEXTURE_2D_ARRAY)&&n.texParameteri(C,n.TEXTURE_WRAP_R,ae[x.wrapR]),n.texParameteri(C,n.TEXTURE_MAG_FILTER,ge[x.magFilter]),n.texParameteri(C,n.TEXTURE_MIN_FILTER,ge[x.minFilter]),x.compareFunction&&(n.texParameteri(C,n.TEXTURE_COMPARE_MODE,n.COMPARE_REF_TO_TEXTURE),n.texParameteri(C,n.TEXTURE_COMPARE_FUNC,Te[x.compareFunction])),e.has("EXT_texture_filter_anisotropic")===!0){if(x.magFilter===ln||x.minFilter!==Hr&&x.minFilter!==ki||x.type===Ln&&e.has("OES_texture_float_linear")===!1)return;if(x.anisotropy>1||i.get(x).__currentAnisotropy){const B=e.get("EXT_texture_filter_anisotropic");n.texParameterf(C,B.TEXTURE_MAX_ANISOTROPY_EXT,Math.min(x.anisotropy,s.getMaxAnisotropy())),i.get(x).__currentAnisotropy=x.anisotropy}}}function je(C,x){let B=!1;C.__webglInit===void 0&&(C.__webglInit=!0,x.addEventListener("dispose",E));const j=x.source;let J=h.get(j);J===void 0&&(J={},h.set(j,J));const W=q(x);if(W!==C.__cacheKey){J[W]===void 0&&(J[W]={texture:n.createTexture(),usedTimes:0},o.memory.textures++,B=!0),J[W].usedTimes++;const Re=J[C.__cacheKey];Re!==void 0&&(J[C.__cacheKey].usedTimes--,Re.usedTimes===0&&w(x)),C.__cacheKey=W,C.__webglTexture=J[W].texture}return B}function X(C,x,B){return Math.floor(Math.floor(C/B)/x)}function le(C,x,B,j){const W=C.updateRanges;if(W.length===0)t.texSubImage2D(n.TEXTURE_2D,0,0,0,x.width,x.height,B,j,x.data);else{W.sort((ee,ve)=>ee.start-ve.start);let Re=0;for(let ee=1;ee<W.length;ee++){const ve=W[Re],Fe=W[ee],Ue=ve.start+ve.count,ce=X(Fe.start,x.width,4),Ge=X(ve.start,x.width,4);Fe.start<=Ue+1&&ce===Ge&&X(Fe.start+Fe.count-1,x.width,4)===ce?ve.count=Math.max(ve.count,Fe.start+Fe.count-ve.start):(++Re,W[Re]=Fe)}W.length=Re+1;const he=n.getParameter(n.UNPACK_ROW_LENGTH),be=n.getParameter(n.UNPACK_SKIP_PIXELS),Ce=n.getParameter(n.UNPACK_SKIP_ROWS);n.pixelStorei(n.UNPACK_ROW_LENGTH,x.width);for(let ee=0,ve=W.length;ee<ve;ee++){const Fe=W[ee],Ue=Math.floor(Fe.start/4),ce=Math.ceil(Fe.count/4),Ge=Ue%x.width,I=Math.floor(Ue/x.width),pe=ce,te=1;n.pixelStorei(n.UNPACK_SKIP_PIXELS,Ge),n.pixelStorei(n.UNPACK_SKIP_ROWS,I),t.texSubImage2D(n.TEXTURE_2D,0,Ge,I,pe,te,B,j,x.data)}C.clearUpdateRanges(),n.pixelStorei(n.UNPACK_ROW_LENGTH,he),n.pixelStorei(n.UNPACK_SKIP_PIXELS,be),n.pixelStorei(n.UNPACK_SKIP_ROWS,Ce)}}function Ee(C,x,B){let j=n.TEXTURE_2D;(x.isDataArrayTexture||x.isCompressedArrayTexture)&&(j=n.TEXTURE_2D_ARRAY),x.isData3DTexture&&(j=n.TEXTURE_3D);const J=je(C,x),W=x.source;t.bindTexture(j,C.__webglTexture,n.TEXTURE0+B);const Re=i.get(W);if(W.version!==Re.__version||J===!0){t.activeTexture(n.TEXTURE0+B);const he=it.getPrimaries(it.workingColorSpace),be=x.colorSpace===ui?null:it.getPrimaries(x.colorSpace),Ce=x.colorSpace===ui||he===be?n.NONE:n.BROWSER_DEFAULT_WEBGL;n.pixelStorei(n.UNPACK_FLIP_Y_WEBGL,x.flipY),n.pixelStorei(n.UNPACK_PREMULTIPLY_ALPHA_WEBGL,x.premultiplyAlpha),n.pixelStorei(n.UNPACK_ALIGNMENT,x.unpackAlignment),n.pixelStorei(n.UNPACK_COLORSPACE_CONVERSION_WEBGL,Ce);let ee=v(x.image,!1,s.maxTextureSize);ee=Ke(x,ee);const ve=r.convert(x.format,x.colorSpace),Fe=r.convert(x.type);let Ue=y(x.internalFormat,ve,Fe,x.colorSpace,x.isVideoTexture);$e(j,x);let ce;const Ge=x.mipmaps,I=x.isVideoTexture!==!0,pe=Re.__version===void 0||J===!0,te=W.dataReady,ye=P(x,ee);if(x.isDepthTexture)Ue=M(x.format===wr,x.type),pe&&(I?t.texStorage2D(n.TEXTURE_2D,1,Ue,ee.width,ee.height):t.texImage2D(n.TEXTURE_2D,0,Ue,ee.width,ee.height,0,ve,Fe,null));else if(x.isDataTexture)if(Ge.length>0){I&&pe&&t.texStorage2D(n.TEXTURE_2D,ye,Ue,Ge[0].width,Ge[0].height);for(let ie=0,K=Ge.length;ie<K;ie++)ce=Ge[ie],I?te&&t.texSubImage2D(n.TEXTURE_2D,ie,0,0,ce.width,ce.height,ve,Fe,ce.data):t.texImage2D(n.TEXTURE_2D,ie,Ue,ce.width,ce.height,0,ve,Fe,ce.data);x.generateMipmaps=!1}else I?(pe&&t.texStorage2D(n.TEXTURE_2D,ye,Ue,ee.width,ee.height),te&&le(x,ee,ve,Fe)):t.texImage2D(n.TEXTURE_2D,0,Ue,ee.width,ee.height,0,ve,Fe,ee.data);else if(x.isCompressedTexture)if(x.isCompressedArrayTexture){I&&pe&&t.texStorage3D(n.TEXTURE_2D_ARRAY,ye,Ue,Ge[0].width,Ge[0].height,ee.depth);for(let ie=0,K=Ge.length;ie<K;ie++)if(ce=Ge[ie],x.format!==Tn)if(ve!==null)if(I){if(te)if(x.layerUpdates.size>0){const Se=Kd(ce.width,ce.height,x.format,x.type);for(const He of x.layerUpdates){const mt=ce.data.subarray(He*Se/ce.data.BYTES_PER_ELEMENT,(He+1)*Se/ce.data.BYTES_PER_ELEMENT);t.compressedTexSubImage3D(n.TEXTURE_2D_ARRAY,ie,0,0,He,ce.width,ce.height,1,ve,mt)}x.clearLayerUpdates()}else t.compressedTexSubImage3D(n.TEXTURE_2D_ARRAY,ie,0,0,0,ce.width,ce.height,ee.depth,ve,ce.data)}else t.compressedTexImage3D(n.TEXTURE_2D_ARRAY,ie,Ue,ce.width,ce.height,ee.depth,0,ce.data,0,0);else console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()");else I?te&&t.texSubImage3D(n.TEXTURE_2D_ARRAY,ie,0,0,0,ce.width,ce.height,ee.depth,ve,Fe,ce.data):t.texImage3D(n.TEXTURE_2D_ARRAY,ie,Ue,ce.width,ce.height,ee.depth,0,ve,Fe,ce.data)}else{I&&pe&&t.texStorage2D(n.TEXTURE_2D,ye,Ue,Ge[0].width,Ge[0].height);for(let ie=0,K=Ge.length;ie<K;ie++)ce=Ge[ie],x.format!==Tn?ve!==null?I?te&&t.compressedTexSubImage2D(n.TEXTURE_2D,ie,0,0,ce.width,ce.height,ve,ce.data):t.compressedTexImage2D(n.TEXTURE_2D,ie,Ue,ce.width,ce.height,0,ce.data):console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()"):I?te&&t.texSubImage2D(n.TEXTURE_2D,ie,0,0,ce.width,ce.height,ve,Fe,ce.data):t.texImage2D(n.TEXTURE_2D,ie,Ue,ce.width,ce.height,0,ve,Fe,ce.data)}else if(x.isDataArrayTexture)if(I){if(pe&&t.texStorage3D(n.TEXTURE_2D_ARRAY,ye,Ue,ee.width,ee.height,ee.depth),te)if(x.layerUpdates.size>0){const ie=Kd(ee.width,ee.height,x.format,x.type);for(const K of x.layerUpdates){const Se=ee.data.subarray(K*ie/ee.data.BYTES_PER_ELEMENT,(K+1)*ie/ee.data.BYTES_PER_ELEMENT);t.texSubImage3D(n.TEXTURE_2D_ARRAY,0,0,0,K,ee.width,ee.height,1,ve,Fe,Se)}x.clearLayerUpdates()}else t.texSubImage3D(n.TEXTURE_2D_ARRAY,0,0,0,0,ee.width,ee.height,ee.depth,ve,Fe,ee.data)}else t.texImage3D(n.TEXTURE_2D_ARRAY,0,Ue,ee.width,ee.height,ee.depth,0,ve,Fe,ee.data);else if(x.isData3DTexture)I?(pe&&t.texStorage3D(n.TEXTURE_3D,ye,Ue,ee.width,ee.height,ee.depth),te&&t.texSubImage3D(n.TEXTURE_3D,0,0,0,0,ee.width,ee.height,ee.depth,ve,Fe,ee.data)):t.texImage3D(n.TEXTURE_3D,0,Ue,ee.width,ee.height,ee.depth,0,ve,Fe,ee.data);else if(x.isFramebufferTexture){if(pe)if(I)t.texStorage2D(n.TEXTURE_2D,ye,Ue,ee.width,ee.height);else{let ie=ee.width,K=ee.height;for(let Se=0;Se<ye;Se++)t.texImage2D(n.TEXTURE_2D,Se,Ue,ie,K,0,ve,Fe,null),ie>>=1,K>>=1}}else if(Ge.length>0){if(I&&pe){const ie=At(Ge[0]);t.texStorage2D(n.TEXTURE_2D,ye,Ue,ie.width,ie.height)}for(let ie=0,K=Ge.length;ie<K;ie++)ce=Ge[ie],I?te&&t.texSubImage2D(n.TEXTURE_2D,ie,0,0,ve,Fe,ce):t.texImage2D(n.TEXTURE_2D,ie,Ue,ve,Fe,ce);x.generateMipmaps=!1}else if(I){if(pe){const ie=At(ee);t.texStorage2D(n.TEXTURE_2D,ye,Ue,ie.width,ie.height)}te&&t.texSubImage2D(n.TEXTURE_2D,0,0,0,ve,Fe,ee)}else t.texImage2D(n.TEXTURE_2D,0,Ue,ve,Fe,ee);m(x)&&f(j),Re.__version=W.version,x.onUpdate&&x.onUpdate(x)}C.__version=x.version}function fe(C,x,B){if(x.image.length!==6)return;const j=je(C,x),J=x.source;t.bindTexture(n.TEXTURE_CUBE_MAP,C.__webglTexture,n.TEXTURE0+B);const W=i.get(J);if(J.version!==W.__version||j===!0){t.activeTexture(n.TEXTURE0+B);const Re=it.getPrimaries(it.workingColorSpace),he=x.colorSpace===ui?null:it.getPrimaries(x.colorSpace),be=x.colorSpace===ui||Re===he?n.NONE:n.BROWSER_DEFAULT_WEBGL;n.pixelStorei(n.UNPACK_FLIP_Y_WEBGL,x.flipY),n.pixelStorei(n.UNPACK_PREMULTIPLY_ALPHA_WEBGL,x.premultiplyAlpha),n.pixelStorei(n.UNPACK_ALIGNMENT,x.unpackAlignment),n.pixelStorei(n.UNPACK_COLORSPACE_CONVERSION_WEBGL,be);const Ce=x.isCompressedTexture||x.image[0].isCompressedTexture,ee=x.image[0]&&x.image[0].isDataTexture,ve=[];for(let K=0;K<6;K++)!Ce&&!ee?ve[K]=v(x.image[K],!0,s.maxCubemapSize):ve[K]=ee?x.image[K].image:x.image[K],ve[K]=Ke(x,ve[K]);const Fe=ve[0],Ue=r.convert(x.format,x.colorSpace),ce=r.convert(x.type),Ge=y(x.internalFormat,Ue,ce,x.colorSpace),I=x.isVideoTexture!==!0,pe=W.__version===void 0||j===!0,te=J.dataReady;let ye=P(x,Fe);$e(n.TEXTURE_CUBE_MAP,x);let ie;if(Ce){I&&pe&&t.texStorage2D(n.TEXTURE_CUBE_MAP,ye,Ge,Fe.width,Fe.height);for(let K=0;K<6;K++){ie=ve[K].mipmaps;for(let Se=0;Se<ie.length;Se++){const He=ie[Se];x.format!==Tn?Ue!==null?I?te&&t.compressedTexSubImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+K,Se,0,0,He.width,He.height,Ue,He.data):t.compressedTexImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+K,Se,Ge,He.width,He.height,0,He.data):console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .setTextureCube()"):I?te&&t.texSubImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+K,Se,0,0,He.width,He.height,Ue,ce,He.data):t.texImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+K,Se,Ge,He.width,He.height,0,Ue,ce,He.data)}}}else{if(ie=x.mipmaps,I&&pe){ie.length>0&&ye++;const K=At(ve[0]);t.texStorage2D(n.TEXTURE_CUBE_MAP,ye,Ge,K.width,K.height)}for(let K=0;K<6;K++)if(ee){I?te&&t.texSubImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+K,0,0,0,ve[K].width,ve[K].height,Ue,ce,ve[K].data):t.texImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+K,0,Ge,ve[K].width,ve[K].height,0,Ue,ce,ve[K].data);for(let Se=0;Se<ie.length;Se++){const mt=ie[Se].image[K].image;I?te&&t.texSubImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+K,Se+1,0,0,mt.width,mt.height,Ue,ce,mt.data):t.texImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+K,Se+1,Ge,mt.width,mt.height,0,Ue,ce,mt.data)}}else{I?te&&t.texSubImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+K,0,0,0,Ue,ce,ve[K]):t.texImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+K,0,Ge,Ue,ce,ve[K]);for(let Se=0;Se<ie.length;Se++){const He=ie[Se];I?te&&t.texSubImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+K,Se+1,0,0,Ue,ce,He.image[K]):t.texImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+K,Se+1,Ge,Ue,ce,He.image[K])}}}m(x)&&f(n.TEXTURE_CUBE_MAP),W.__version=J.version,x.onUpdate&&x.onUpdate(x)}C.__version=x.version}function we(C,x,B,j,J,W){const Re=r.convert(B.format,B.colorSpace),he=r.convert(B.type),be=y(B.internalFormat,Re,he,B.colorSpace),Ce=i.get(x),ee=i.get(B);if(ee.__renderTarget=x,!Ce.__hasExternalTextures){const ve=Math.max(1,x.width>>W),Fe=Math.max(1,x.height>>W);J===n.TEXTURE_3D||J===n.TEXTURE_2D_ARRAY?t.texImage3D(J,W,be,ve,Fe,x.depth,0,Re,he,null):t.texImage2D(J,W,be,ve,Fe,0,Re,he,null)}t.bindFramebuffer(n.FRAMEBUFFER,C),tt(x)?a.framebufferTexture2DMultisampleEXT(n.FRAMEBUFFER,j,J,ee.__webglTexture,0,Ae(x)):(J===n.TEXTURE_2D||J>=n.TEXTURE_CUBE_MAP_POSITIVE_X&&J<=n.TEXTURE_CUBE_MAP_NEGATIVE_Z)&&n.framebufferTexture2D(n.FRAMEBUFFER,j,J,ee.__webglTexture,W),t.bindFramebuffer(n.FRAMEBUFFER,null)}function Qe(C,x,B){if(n.bindRenderbuffer(n.RENDERBUFFER,C),x.depthBuffer){const j=x.depthTexture,J=j&&j.isDepthTexture?j.type:null,W=M(x.stencilBuffer,J),Re=x.stencilBuffer?n.DEPTH_STENCIL_ATTACHMENT:n.DEPTH_ATTACHMENT,he=Ae(x);tt(x)?a.renderbufferStorageMultisampleEXT(n.RENDERBUFFER,he,W,x.width,x.height):B?n.renderbufferStorageMultisample(n.RENDERBUFFER,he,W,x.width,x.height):n.renderbufferStorage(n.RENDERBUFFER,W,x.width,x.height),n.framebufferRenderbuffer(n.FRAMEBUFFER,Re,n.RENDERBUFFER,C)}else{const j=x.textures;for(let J=0;J<j.length;J++){const W=j[J],Re=r.convert(W.format,W.colorSpace),he=r.convert(W.type),be=y(W.internalFormat,Re,he,W.colorSpace),Ce=Ae(x);B&&tt(x)===!1?n.renderbufferStorageMultisample(n.RENDERBUFFER,Ce,be,x.width,x.height):tt(x)?a.renderbufferStorageMultisampleEXT(n.RENDERBUFFER,Ce,be,x.width,x.height):n.renderbufferStorage(n.RENDERBUFFER,be,x.width,x.height)}}n.bindRenderbuffer(n.RENDERBUFFER,null)}function Y(C,x){if(x&&x.isWebGLCubeRenderTarget)throw new Error("Depth Texture with cube render targets is not supported");if(t.bindFramebuffer(n.FRAMEBUFFER,C),!(x.depthTexture&&x.depthTexture.isDepthTexture))throw new Error("renderTarget.depthTexture must be an instance of THREE.DepthTexture");const j=i.get(x.depthTexture);j.__renderTarget=x,(!j.__webglTexture||x.depthTexture.image.width!==x.width||x.depthTexture.image.height!==x.height)&&(x.depthTexture.image.width=x.width,x.depthTexture.image.height=x.height,x.depthTexture.needsUpdate=!0),Z(x.depthTexture,0);const J=j.__webglTexture,W=Ae(x);if(x.depthTexture.format===Mr)tt(x)?a.framebufferTexture2DMultisampleEXT(n.FRAMEBUFFER,n.DEPTH_ATTACHMENT,n.TEXTURE_2D,J,0,W):n.framebufferTexture2D(n.FRAMEBUFFER,n.DEPTH_ATTACHMENT,n.TEXTURE_2D,J,0);else if(x.depthTexture.format===wr)tt(x)?a.framebufferTexture2DMultisampleEXT(n.FRAMEBUFFER,n.DEPTH_STENCIL_ATTACHMENT,n.TEXTURE_2D,J,0,W):n.framebufferTexture2D(n.FRAMEBUFFER,n.DEPTH_STENCIL_ATTACHMENT,n.TEXTURE_2D,J,0);else throw new Error("Unknown depthTexture format")}function _e(C){const x=i.get(C),B=C.isWebGLCubeRenderTarget===!0;if(x.__boundDepthTexture!==C.depthTexture){const j=C.depthTexture;if(x.__depthDisposeCallback&&x.__depthDisposeCallback(),j){const J=()=>{delete x.__boundDepthTexture,delete x.__depthDisposeCallback,j.removeEventListener("dispose",J)};j.addEventListener("dispose",J),x.__depthDisposeCallback=J}x.__boundDepthTexture=j}if(C.depthTexture&&!x.__autoAllocateDepthBuffer){if(B)throw new Error("target.depthTexture not supported in Cube render targets");const j=C.texture.mipmaps;j&&j.length>0?Y(x.__webglFramebuffer[0],C):Y(x.__webglFramebuffer,C)}else if(B){x.__webglDepthbuffer=[];for(let j=0;j<6;j++)if(t.bindFramebuffer(n.FRAMEBUFFER,x.__webglFramebuffer[j]),x.__webglDepthbuffer[j]===void 0)x.__webglDepthbuffer[j]=n.createRenderbuffer(),Qe(x.__webglDepthbuffer[j],C,!1);else{const J=C.stencilBuffer?n.DEPTH_STENCIL_ATTACHMENT:n.DEPTH_ATTACHMENT,W=x.__webglDepthbuffer[j];n.bindRenderbuffer(n.RENDERBUFFER,W),n.framebufferRenderbuffer(n.FRAMEBUFFER,J,n.RENDERBUFFER,W)}}else{const j=C.texture.mipmaps;if(j&&j.length>0?t.bindFramebuffer(n.FRAMEBUFFER,x.__webglFramebuffer[0]):t.bindFramebuffer(n.FRAMEBUFFER,x.__webglFramebuffer),x.__webglDepthbuffer===void 0)x.__webglDepthbuffer=n.createRenderbuffer(),Qe(x.__webglDepthbuffer,C,!1);else{const J=C.stencilBuffer?n.DEPTH_STENCIL_ATTACHMENT:n.DEPTH_ATTACHMENT,W=x.__webglDepthbuffer;n.bindRenderbuffer(n.RENDERBUFFER,W),n.framebufferRenderbuffer(n.FRAMEBUFFER,J,n.RENDERBUFFER,W)}}t.bindFramebuffer(n.FRAMEBUFFER,null)}function Ye(C,x,B){const j=i.get(C);x!==void 0&&we(j.__webglFramebuffer,C,C.texture,n.COLOR_ATTACHMENT0,n.TEXTURE_2D,0),B!==void 0&&_e(C)}function Oe(C){const x=C.texture,B=i.get(C),j=i.get(x);C.addEventListener("dispose",A);const J=C.textures,W=C.isWebGLCubeRenderTarget===!0,Re=J.length>1;if(Re||(j.__webglTexture===void 0&&(j.__webglTexture=n.createTexture()),j.__version=x.version,o.memory.textures++),W){B.__webglFramebuffer=[];for(let he=0;he<6;he++)if(x.mipmaps&&x.mipmaps.length>0){B.__webglFramebuffer[he]=[];for(let be=0;be<x.mipmaps.length;be++)B.__webglFramebuffer[he][be]=n.createFramebuffer()}else B.__webglFramebuffer[he]=n.createFramebuffer()}else{if(x.mipmaps&&x.mipmaps.length>0){B.__webglFramebuffer=[];for(let he=0;he<x.mipmaps.length;he++)B.__webglFramebuffer[he]=n.createFramebuffer()}else B.__webglFramebuffer=n.createFramebuffer();if(Re)for(let he=0,be=J.length;he<be;he++){const Ce=i.get(J[he]);Ce.__webglTexture===void 0&&(Ce.__webglTexture=n.createTexture(),o.memory.textures++)}if(C.samples>0&&tt(C)===!1){B.__webglMultisampledFramebuffer=n.createFramebuffer(),B.__webglColorRenderbuffer=[],t.bindFramebuffer(n.FRAMEBUFFER,B.__webglMultisampledFramebuffer);for(let he=0;he<J.length;he++){const be=J[he];B.__webglColorRenderbuffer[he]=n.createRenderbuffer(),n.bindRenderbuffer(n.RENDERBUFFER,B.__webglColorRenderbuffer[he]);const Ce=r.convert(be.format,be.colorSpace),ee=r.convert(be.type),ve=y(be.internalFormat,Ce,ee,be.colorSpace,C.isXRRenderTarget===!0),Fe=Ae(C);n.renderbufferStorageMultisample(n.RENDERBUFFER,Fe,ve,C.width,C.height),n.framebufferRenderbuffer(n.FRAMEBUFFER,n.COLOR_ATTACHMENT0+he,n.RENDERBUFFER,B.__webglColorRenderbuffer[he])}n.bindRenderbuffer(n.RENDERBUFFER,null),C.depthBuffer&&(B.__webglDepthRenderbuffer=n.createRenderbuffer(),Qe(B.__webglDepthRenderbuffer,C,!0)),t.bindFramebuffer(n.FRAMEBUFFER,null)}}if(W){t.bindTexture(n.TEXTURE_CUBE_MAP,j.__webglTexture),$e(n.TEXTURE_CUBE_MAP,x);for(let he=0;he<6;he++)if(x.mipmaps&&x.mipmaps.length>0)for(let be=0;be<x.mipmaps.length;be++)we(B.__webglFramebuffer[he][be],C,x,n.COLOR_ATTACHMENT0,n.TEXTURE_CUBE_MAP_POSITIVE_X+he,be);else we(B.__webglFramebuffer[he],C,x,n.COLOR_ATTACHMENT0,n.TEXTURE_CUBE_MAP_POSITIVE_X+he,0);m(x)&&f(n.TEXTURE_CUBE_MAP),t.unbindTexture()}else if(Re){for(let he=0,be=J.length;he<be;he++){const Ce=J[he],ee=i.get(Ce);t.bindTexture(n.TEXTURE_2D,ee.__webglTexture),$e(n.TEXTURE_2D,Ce),we(B.__webglFramebuffer,C,Ce,n.COLOR_ATTACHMENT0+he,n.TEXTURE_2D,0),m(Ce)&&f(n.TEXTURE_2D)}t.unbindTexture()}else{let he=n.TEXTURE_2D;if((C.isWebGL3DRenderTarget||C.isWebGLArrayRenderTarget)&&(he=C.isWebGL3DRenderTarget?n.TEXTURE_3D:n.TEXTURE_2D_ARRAY),t.bindTexture(he,j.__webglTexture),$e(he,x),x.mipmaps&&x.mipmaps.length>0)for(let be=0;be<x.mipmaps.length;be++)we(B.__webglFramebuffer[be],C,x,n.COLOR_ATTACHMENT0,he,be);else we(B.__webglFramebuffer,C,x,n.COLOR_ATTACHMENT0,he,0);m(x)&&f(he),t.unbindTexture()}C.depthBuffer&&_e(C)}function L(C){const x=C.textures;for(let B=0,j=x.length;B<j;B++){const J=x[B];if(m(J)){const W=T(C),Re=i.get(J).__webglTexture;t.bindTexture(W,Re),f(W),t.unbindTexture()}}}const Tt=[],st=[];function ft(C){if(C.samples>0){if(tt(C)===!1){const x=C.textures,B=C.width,j=C.height;let J=n.COLOR_BUFFER_BIT;const W=C.stencilBuffer?n.DEPTH_STENCIL_ATTACHMENT:n.DEPTH_ATTACHMENT,Re=i.get(C),he=x.length>1;if(he)for(let Ce=0;Ce<x.length;Ce++)t.bindFramebuffer(n.FRAMEBUFFER,Re.__webglMultisampledFramebuffer),n.framebufferRenderbuffer(n.FRAMEBUFFER,n.COLOR_ATTACHMENT0+Ce,n.RENDERBUFFER,null),t.bindFramebuffer(n.FRAMEBUFFER,Re.__webglFramebuffer),n.framebufferTexture2D(n.DRAW_FRAMEBUFFER,n.COLOR_ATTACHMENT0+Ce,n.TEXTURE_2D,null,0);t.bindFramebuffer(n.READ_FRAMEBUFFER,Re.__webglMultisampledFramebuffer);const be=C.texture.mipmaps;be&&be.length>0?t.bindFramebuffer(n.DRAW_FRAMEBUFFER,Re.__webglFramebuffer[0]):t.bindFramebuffer(n.DRAW_FRAMEBUFFER,Re.__webglFramebuffer);for(let Ce=0;Ce<x.length;Ce++){if(C.resolveDepthBuffer&&(C.depthBuffer&&(J|=n.DEPTH_BUFFER_BIT),C.stencilBuffer&&C.resolveStencilBuffer&&(J|=n.STENCIL_BUFFER_BIT)),he){n.framebufferRenderbuffer(n.READ_FRAMEBUFFER,n.COLOR_ATTACHMENT0,n.RENDERBUFFER,Re.__webglColorRenderbuffer[Ce]);const ee=i.get(x[Ce]).__webglTexture;n.framebufferTexture2D(n.DRAW_FRAMEBUFFER,n.COLOR_ATTACHMENT0,n.TEXTURE_2D,ee,0)}n.blitFramebuffer(0,0,B,j,0,0,B,j,J,n.NEAREST),l===!0&&(Tt.length=0,st.length=0,Tt.push(n.COLOR_ATTACHMENT0+Ce),C.depthBuffer&&C.resolveDepthBuffer===!1&&(Tt.push(W),st.push(W),n.invalidateFramebuffer(n.DRAW_FRAMEBUFFER,st)),n.invalidateFramebuffer(n.READ_FRAMEBUFFER,Tt))}if(t.bindFramebuffer(n.READ_FRAMEBUFFER,null),t.bindFramebuffer(n.DRAW_FRAMEBUFFER,null),he)for(let Ce=0;Ce<x.length;Ce++){t.bindFramebuffer(n.FRAMEBUFFER,Re.__webglMultisampledFramebuffer),n.framebufferRenderbuffer(n.FRAMEBUFFER,n.COLOR_ATTACHMENT0+Ce,n.RENDERBUFFER,Re.__webglColorRenderbuffer[Ce]);const ee=i.get(x[Ce]).__webglTexture;t.bindFramebuffer(n.FRAMEBUFFER,Re.__webglFramebuffer),n.framebufferTexture2D(n.DRAW_FRAMEBUFFER,n.COLOR_ATTACHMENT0+Ce,n.TEXTURE_2D,ee,0)}t.bindFramebuffer(n.DRAW_FRAMEBUFFER,Re.__webglMultisampledFramebuffer)}else if(C.depthBuffer&&C.resolveDepthBuffer===!1&&l){const x=C.stencilBuffer?n.DEPTH_STENCIL_ATTACHMENT:n.DEPTH_ATTACHMENT;n.invalidateFramebuffer(n.DRAW_FRAMEBUFFER,[x])}}}function Ae(C){return Math.min(s.maxSamples,C.samples)}function tt(C){const x=i.get(C);return C.samples>0&&e.has("WEBGL_multisampled_render_to_texture")===!0&&x.__useRenderToTexture!==!1}function Ie(C){const x=o.render.frame;u.get(C)!==x&&(u.set(C,x),C.update())}function Ke(C,x){const B=C.colorSpace,j=C.format,J=C.type;return C.isCompressedTexture===!0||C.isVideoTexture===!0||B!==Fs&&B!==ui&&(it.getTransfer(B)===ut?(j!==Tn||J!==Un)&&console.warn("THREE.WebGLTextures: sRGB encoded textures have to use RGBAFormat and UnsignedByteType."):console.error("THREE.WebGLTextures: Unsupported texture color space:",B)),x}function At(C){return typeof HTMLImageElement<"u"&&C instanceof HTMLImageElement?(c.width=C.naturalWidth||C.width,c.height=C.naturalHeight||C.height):typeof VideoFrame<"u"&&C instanceof VideoFrame?(c.width=C.displayWidth,c.height=C.displayHeight):(c.width=C.width,c.height=C.height),c}this.allocateTextureUnit=k,this.resetTextureUnits=$,this.setTexture2D=Z,this.setTexture2DArray=V,this.setTexture3D=se,this.setTextureCube=H,this.rebindTextures=Ye,this.setupRenderTarget=Oe,this.updateRenderTargetMipmap=L,this.updateMultisampleRenderTarget=ft,this.setupDepthRenderbuffer=_e,this.setupFrameBufferTexture=we,this.useMultisampledRTT=tt}function QS(n,e){function t(i,s=ui){let r;const o=it.getTransfer(s);if(i===Un)return n.UNSIGNED_BYTE;if(i===tu)return n.UNSIGNED_SHORT_4_4_4_4;if(i===nu)return n.UNSIGNED_SHORT_5_5_5_1;if(i===jf)return n.UNSIGNED_INT_5_9_9_9_REV;if(i===Yf)return n.BYTE;if(i===qf)return n.SHORT;if(i===yr)return n.UNSIGNED_SHORT;if(i===eu)return n.INT;if(i===Vi)return n.UNSIGNED_INT;if(i===Ln)return n.FLOAT;if(i===Rr)return n.HALF_FLOAT;if(i===Kf)return n.ALPHA;if(i===Zf)return n.RGB;if(i===Tn)return n.RGBA;if(i===Mr)return n.DEPTH_COMPONENT;if(i===wr)return n.DEPTH_STENCIL;if(i===iu)return n.RED;if(i===su)return n.RED_INTEGER;if(i===Jf)return n.RG;if(i===ru)return n.RG_INTEGER;if(i===ou)return n.RGBA_INTEGER;if(i===Co||i===Po||i===Lo||i===Do)if(o===ut)if(r=e.get("WEBGL_compressed_texture_s3tc_srgb"),r!==null){if(i===Co)return r.COMPRESSED_SRGB_S3TC_DXT1_EXT;if(i===Po)return r.COMPRESSED_SRGB_ALPHA_S3TC_DXT1_EXT;if(i===Lo)return r.COMPRESSED_SRGB_ALPHA_S3TC_DXT3_EXT;if(i===Do)return r.COMPRESSED_SRGB_ALPHA_S3TC_DXT5_EXT}else return null;else if(r=e.get("WEBGL_compressed_texture_s3tc"),r!==null){if(i===Co)return r.COMPRESSED_RGB_S3TC_DXT1_EXT;if(i===Po)return r.COMPRESSED_RGBA_S3TC_DXT1_EXT;if(i===Lo)return r.COMPRESSED_RGBA_S3TC_DXT3_EXT;if(i===Do)return r.COMPRESSED_RGBA_S3TC_DXT5_EXT}else return null;if(i===Bl||i===kl||i===zl||i===Gl)if(r=e.get("WEBGL_compressed_texture_pvrtc"),r!==null){if(i===Bl)return r.COMPRESSED_RGB_PVRTC_4BPPV1_IMG;if(i===kl)return r.COMPRESSED_RGB_PVRTC_2BPPV1_IMG;if(i===zl)return r.COMPRESSED_RGBA_PVRTC_4BPPV1_IMG;if(i===Gl)return r.COMPRESSED_RGBA_PVRTC_2BPPV1_IMG}else return null;if(i===Hl||i===Vl||i===$l)if(r=e.get("WEBGL_compressed_texture_etc"),r!==null){if(i===Hl||i===Vl)return o===ut?r.COMPRESSED_SRGB8_ETC2:r.COMPRESSED_RGB8_ETC2;if(i===$l)return o===ut?r.COMPRESSED_SRGB8_ALPHA8_ETC2_EAC:r.COMPRESSED_RGBA8_ETC2_EAC}else return null;if(i===Wl||i===Xl||i===Yl||i===ql||i===jl||i===Kl||i===Zl||i===Jl||i===Ql||i===ec||i===tc||i===nc||i===ic||i===sc)if(r=e.get("WEBGL_compressed_texture_astc"),r!==null){if(i===Wl)return o===ut?r.COMPRESSED_SRGB8_ALPHA8_ASTC_4x4_KHR:r.COMPRESSED_RGBA_ASTC_4x4_KHR;if(i===Xl)return o===ut?r.COMPRESSED_SRGB8_ALPHA8_ASTC_5x4_KHR:r.COMPRESSED_RGBA_ASTC_5x4_KHR;if(i===Yl)return o===ut?r.COMPRESSED_SRGB8_ALPHA8_ASTC_5x5_KHR:r.COMPRESSED_RGBA_ASTC_5x5_KHR;if(i===ql)return o===ut?r.COMPRESSED_SRGB8_ALPHA8_ASTC_6x5_KHR:r.COMPRESSED_RGBA_ASTC_6x5_KHR;if(i===jl)return o===ut?r.COMPRESSED_SRGB8_ALPHA8_ASTC_6x6_KHR:r.COMPRESSED_RGBA_ASTC_6x6_KHR;if(i===Kl)return o===ut?r.COMPRESSED_SRGB8_ALPHA8_ASTC_8x5_KHR:r.COMPRESSED_RGBA_ASTC_8x5_KHR;if(i===Zl)return o===ut?r.COMPRESSED_SRGB8_ALPHA8_ASTC_8x6_KHR:r.COMPRESSED_RGBA_ASTC_8x6_KHR;if(i===Jl)return o===ut?r.COMPRESSED_SRGB8_ALPHA8_ASTC_8x8_KHR:r.COMPRESSED_RGBA_ASTC_8x8_KHR;if(i===Ql)return o===ut?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x5_KHR:r.COMPRESSED_RGBA_ASTC_10x5_KHR;if(i===ec)return o===ut?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x6_KHR:r.COMPRESSED_RGBA_ASTC_10x6_KHR;if(i===tc)return o===ut?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x8_KHR:r.COMPRESSED_RGBA_ASTC_10x8_KHR;if(i===nc)return o===ut?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x10_KHR:r.COMPRESSED_RGBA_ASTC_10x10_KHR;if(i===ic)return o===ut?r.COMPRESSED_SRGB8_ALPHA8_ASTC_12x10_KHR:r.COMPRESSED_RGBA_ASTC_12x10_KHR;if(i===sc)return o===ut?r.COMPRESSED_SRGB8_ALPHA8_ASTC_12x12_KHR:r.COMPRESSED_RGBA_ASTC_12x12_KHR}else return null;if(i===Io||i===rc||i===oc)if(r=e.get("EXT_texture_compression_bptc"),r!==null){if(i===Io)return o===ut?r.COMPRESSED_SRGB_ALPHA_BPTC_UNORM_EXT:r.COMPRESSED_RGBA_BPTC_UNORM_EXT;if(i===rc)return r.COMPRESSED_RGB_BPTC_SIGNED_FLOAT_EXT;if(i===oc)return r.COMPRESSED_RGB_BPTC_UNSIGNED_FLOAT_EXT}else return null;if(i===Qf||i===ac||i===lc||i===cc)if(r=e.get("EXT_texture_compression_rgtc"),r!==null){if(i===Io)return r.COMPRESSED_RED_RGTC1_EXT;if(i===ac)return r.COMPRESSED_SIGNED_RED_RGTC1_EXT;if(i===lc)return r.COMPRESSED_RED_GREEN_RGTC2_EXT;if(i===cc)return r.COMPRESSED_SIGNED_RED_GREEN_RGTC2_EXT}else return null;return i===Sr?n.UNSIGNED_INT_24_8:n[i]!==void 0?n[i]:null}return{convert:t}}const eM=`
void main() {

	gl_Position = vec4( position, 1.0 );

}`,tM=`
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

}`;class nM{constructor(){this.texture=null,this.mesh=null,this.depthNear=0,this.depthFar=0}init(e,t,i){if(this.texture===null){const s=new Wt,r=e.properties.get(s);r.__webglTexture=t.texture,(t.depthNear!==i.depthNear||t.depthFar!==i.depthFar)&&(this.depthNear=t.depthNear,this.depthFar=t.depthFar),this.texture=s}}getMesh(e){if(this.texture!==null&&this.mesh===null){const t=e.cameras[0].viewport,i=new bi({vertexShader:eM,fragmentShader:tM,uniforms:{depthColor:{value:this.texture},depthWidth:{value:t.z},depthHeight:{value:t.w}}});this.mesh=new xn(new la(20,20),i)}return this.mesh}reset(){this.texture=null,this.mesh=null}getDepthTexture(){return this.texture}}class iM extends ji{constructor(e,t){super();const i=this;let s=null,r=1,o=null,a="local-floor",l=1,c=null,u=null,d=null,h=null,p=null,g=null;const v=new nM,m=t.getContextAttributes();let f=null,T=null;const y=[],M=[],P=new Ve;let E=null;const A=new on;A.viewport=new Mt;const R=new on;R.viewport=new Mt;const w=[A,R],S=new M0;let D=null,$=null;this.cameraAutoUpdate=!0,this.enabled=!1,this.isPresenting=!1,this.getController=function(X){let le=y[X];return le===void 0&&(le=new Ka,y[X]=le),le.getTargetRaySpace()},this.getControllerGrip=function(X){let le=y[X];return le===void 0&&(le=new Ka,y[X]=le),le.getGripSpace()},this.getHand=function(X){let le=y[X];return le===void 0&&(le=new Ka,y[X]=le),le.getHandSpace()};function k(X){const le=M.indexOf(X.inputSource);if(le===-1)return;const Ee=y[le];Ee!==void 0&&(Ee.update(X.inputSource,X.frame,c||o),Ee.dispatchEvent({type:X.type,data:X.inputSource}))}function q(){s.removeEventListener("select",k),s.removeEventListener("selectstart",k),s.removeEventListener("selectend",k),s.removeEventListener("squeeze",k),s.removeEventListener("squeezestart",k),s.removeEventListener("squeezeend",k),s.removeEventListener("end",q),s.removeEventListener("inputsourceschange",Z);for(let X=0;X<y.length;X++){const le=M[X];le!==null&&(M[X]=null,y[X].disconnect(le))}D=null,$=null,v.reset(),e.setRenderTarget(f),p=null,h=null,d=null,s=null,T=null,je.stop(),i.isPresenting=!1,e.setPixelRatio(E),e.setSize(P.width,P.height,!1),i.dispatchEvent({type:"sessionend"})}this.setFramebufferScaleFactor=function(X){r=X,i.isPresenting===!0&&console.warn("THREE.WebXRManager: Cannot change framebuffer scale while presenting.")},this.setReferenceSpaceType=function(X){a=X,i.isPresenting===!0&&console.warn("THREE.WebXRManager: Cannot change reference space type while presenting.")},this.getReferenceSpace=function(){return c||o},this.setReferenceSpace=function(X){c=X},this.getBaseLayer=function(){return h!==null?h:p},this.getBinding=function(){return d},this.getFrame=function(){return g},this.getSession=function(){return s},this.setSession=async function(X){if(s=X,s!==null){if(f=e.getRenderTarget(),s.addEventListener("select",k),s.addEventListener("selectstart",k),s.addEventListener("selectend",k),s.addEventListener("squeeze",k),s.addEventListener("squeezestart",k),s.addEventListener("squeezeend",k),s.addEventListener("end",q),s.addEventListener("inputsourceschange",Z),m.xrCompatible!==!0&&await t.makeXRCompatible(),E=e.getPixelRatio(),e.getSize(P),typeof XRWebGLBinding<"u"&&"createProjectionLayer"in XRWebGLBinding.prototype){let Ee=null,fe=null,we=null;m.depth&&(we=m.stencil?t.DEPTH24_STENCIL8:t.DEPTH_COMPONENT24,Ee=m.stencil?wr:Mr,fe=m.stencil?Sr:Vi);const Qe={colorFormat:t.RGBA8,depthFormat:we,scaleFactor:r};d=new XRWebGLBinding(s,t),h=d.createProjectionLayer(Qe),s.updateRenderState({layers:[h]}),e.setPixelRatio(1),e.setSize(h.textureWidth,h.textureHeight,!1),T=new Wi(h.textureWidth,h.textureHeight,{format:Tn,type:Un,depthTexture:new hp(h.textureWidth,h.textureHeight,fe,void 0,void 0,void 0,void 0,void 0,void 0,Ee),stencilBuffer:m.stencil,colorSpace:e.outputColorSpace,samples:m.antialias?4:0,resolveDepthBuffer:h.ignoreDepthValues===!1,resolveStencilBuffer:h.ignoreDepthValues===!1})}else{const Ee={antialias:m.antialias,alpha:!0,depth:m.depth,stencil:m.stencil,framebufferScaleFactor:r};p=new XRWebGLLayer(s,t,Ee),s.updateRenderState({baseLayer:p}),e.setPixelRatio(1),e.setSize(p.framebufferWidth,p.framebufferHeight,!1),T=new Wi(p.framebufferWidth,p.framebufferHeight,{format:Tn,type:Un,colorSpace:e.outputColorSpace,stencilBuffer:m.stencil,resolveDepthBuffer:p.ignoreDepthValues===!1,resolveStencilBuffer:p.ignoreDepthValues===!1})}T.isXRRenderTarget=!0,this.setFoveation(l),c=null,o=await s.requestReferenceSpace(a),je.setContext(s),je.start(),i.isPresenting=!0,i.dispatchEvent({type:"sessionstart"})}},this.getEnvironmentBlendMode=function(){if(s!==null)return s.environmentBlendMode},this.getDepthTexture=function(){return v.getDepthTexture()};function Z(X){for(let le=0;le<X.removed.length;le++){const Ee=X.removed[le],fe=M.indexOf(Ee);fe>=0&&(M[fe]=null,y[fe].disconnect(Ee))}for(let le=0;le<X.added.length;le++){const Ee=X.added[le];let fe=M.indexOf(Ee);if(fe===-1){for(let Qe=0;Qe<y.length;Qe++)if(Qe>=M.length){M.push(Ee),fe=Qe;break}else if(M[Qe]===null){M[Qe]=Ee,fe=Qe;break}if(fe===-1)break}const we=y[fe];we&&we.connect(Ee)}}const V=new O,se=new O;function H(X,le,Ee){V.setFromMatrixPosition(le.matrixWorld),se.setFromMatrixPosition(Ee.matrixWorld);const fe=V.distanceTo(se),we=le.projectionMatrix.elements,Qe=Ee.projectionMatrix.elements,Y=we[14]/(we[10]-1),_e=we[14]/(we[10]+1),Ye=(we[9]+1)/we[5],Oe=(we[9]-1)/we[5],L=(we[8]-1)/we[0],Tt=(Qe[8]+1)/Qe[0],st=Y*L,ft=Y*Tt,Ae=fe/(-L+Tt),tt=Ae*-L;if(le.matrixWorld.decompose(X.position,X.quaternion,X.scale),X.translateX(tt),X.translateZ(Ae),X.matrixWorld.compose(X.position,X.quaternion,X.scale),X.matrixWorldInverse.copy(X.matrixWorld).invert(),we[10]===-1)X.projectionMatrix.copy(le.projectionMatrix),X.projectionMatrixInverse.copy(le.projectionMatrixInverse);else{const Ie=Y+Ae,Ke=_e+Ae,At=st-tt,C=ft+(fe-tt),x=Ye*_e/Ke*Ie,B=Oe*_e/Ke*Ie;X.projectionMatrix.makePerspective(At,C,x,B,Ie,Ke),X.projectionMatrixInverse.copy(X.projectionMatrix).invert()}}function ae(X,le){le===null?X.matrixWorld.copy(X.matrix):X.matrixWorld.multiplyMatrices(le.matrixWorld,X.matrix),X.matrixWorldInverse.copy(X.matrixWorld).invert()}this.updateCamera=function(X){if(s===null)return;let le=X.near,Ee=X.far;v.texture!==null&&(v.depthNear>0&&(le=v.depthNear),v.depthFar>0&&(Ee=v.depthFar)),S.near=R.near=A.near=le,S.far=R.far=A.far=Ee,(D!==S.near||$!==S.far)&&(s.updateRenderState({depthNear:S.near,depthFar:S.far}),D=S.near,$=S.far),A.layers.mask=X.layers.mask|2,R.layers.mask=X.layers.mask|4,S.layers.mask=A.layers.mask|R.layers.mask;const fe=X.parent,we=S.cameras;ae(S,fe);for(let Qe=0;Qe<we.length;Qe++)ae(we[Qe],fe);we.length===2?H(S,A,R):S.projectionMatrix.copy(A.projectionMatrix),ge(X,S,fe)};function ge(X,le,Ee){Ee===null?X.matrix.copy(le.matrixWorld):(X.matrix.copy(Ee.matrixWorld),X.matrix.invert(),X.matrix.multiply(le.matrixWorld)),X.matrix.decompose(X.position,X.quaternion,X.scale),X.updateMatrixWorld(!0),X.projectionMatrix.copy(le.projectionMatrix),X.projectionMatrixInverse.copy(le.projectionMatrixInverse),X.isPerspectiveCamera&&(X.fov=uc*2*Math.atan(1/X.projectionMatrix.elements[5]),X.zoom=1)}this.getCamera=function(){return S},this.getFoveation=function(){if(!(h===null&&p===null))return l},this.setFoveation=function(X){l=X,h!==null&&(h.fixedFoveation=X),p!==null&&p.fixedFoveation!==void 0&&(p.fixedFoveation=X)},this.hasDepthSensing=function(){return v.texture!==null},this.getDepthSensingMesh=function(){return v.getMesh(S)};let Te=null;function $e(X,le){if(u=le.getViewerPose(c||o),g=le,u!==null){const Ee=u.views;p!==null&&(e.setRenderTargetFramebuffer(T,p.framebuffer),e.setRenderTarget(T));let fe=!1;Ee.length!==S.cameras.length&&(S.cameras.length=0,fe=!0);for(let Y=0;Y<Ee.length;Y++){const _e=Ee[Y];let Ye=null;if(p!==null)Ye=p.getViewport(_e);else{const L=d.getViewSubImage(h,_e);Ye=L.viewport,Y===0&&(e.setRenderTargetTextures(T,L.colorTexture,L.depthStencilTexture),e.setRenderTarget(T))}let Oe=w[Y];Oe===void 0&&(Oe=new on,Oe.layers.enable(Y),Oe.viewport=new Mt,w[Y]=Oe),Oe.matrix.fromArray(_e.transform.matrix),Oe.matrix.decompose(Oe.position,Oe.quaternion,Oe.scale),Oe.projectionMatrix.fromArray(_e.projectionMatrix),Oe.projectionMatrixInverse.copy(Oe.projectionMatrix).invert(),Oe.viewport.set(Ye.x,Ye.y,Ye.width,Ye.height),Y===0&&(S.matrix.copy(Oe.matrix),S.matrix.decompose(S.position,S.quaternion,S.scale)),fe===!0&&S.cameras.push(Oe)}const we=s.enabledFeatures;if(we&&we.includes("depth-sensing")&&s.depthUsage=="gpu-optimized"&&d){const Y=d.getDepthInformation(Ee[0]);Y&&Y.isValid&&Y.texture&&v.init(e,Y,s.renderState)}}for(let Ee=0;Ee<y.length;Ee++){const fe=M[Ee],we=y[Ee];fe!==null&&we!==void 0&&we.update(fe,le,c||o)}Te&&Te(X,le),le.detectedPlanes&&i.dispatchEvent({type:"planesdetected",data:le}),g=null}const je=new _p;je.setAnimationLoop($e),this.setAnimationLoop=function(X){Te=X},this.dispose=function(){}}}const Ii=new Fn,sM=new rt;function rM(n,e){function t(m,f){m.matrixAutoUpdate===!0&&m.updateMatrix(),f.value.copy(m.matrix)}function i(m,f){f.color.getRGB(m.fogColor.value,ap(n)),f.isFog?(m.fogNear.value=f.near,m.fogFar.value=f.far):f.isFogExp2&&(m.fogDensity.value=f.density)}function s(m,f,T,y,M){f.isMeshBasicMaterial||f.isMeshLambertMaterial?r(m,f):f.isMeshToonMaterial?(r(m,f),d(m,f)):f.isMeshPhongMaterial?(r(m,f),u(m,f)):f.isMeshStandardMaterial?(r(m,f),h(m,f),f.isMeshPhysicalMaterial&&p(m,f,M)):f.isMeshMatcapMaterial?(r(m,f),g(m,f)):f.isMeshDepthMaterial?r(m,f):f.isMeshDistanceMaterial?(r(m,f),v(m,f)):f.isMeshNormalMaterial?r(m,f):f.isLineBasicMaterial?(o(m,f),f.isLineDashedMaterial&&a(m,f)):f.isPointsMaterial?l(m,f,T,y):f.isSpriteMaterial?c(m,f):f.isShadowMaterial?(m.color.value.copy(f.color),m.opacity.value=f.opacity):f.isShaderMaterial&&(f.uniformsNeedUpdate=!1)}function r(m,f){m.opacity.value=f.opacity,f.color&&m.diffuse.value.copy(f.color),f.emissive&&m.emissive.value.copy(f.emissive).multiplyScalar(f.emissiveIntensity),f.map&&(m.map.value=f.map,t(f.map,m.mapTransform)),f.alphaMap&&(m.alphaMap.value=f.alphaMap,t(f.alphaMap,m.alphaMapTransform)),f.bumpMap&&(m.bumpMap.value=f.bumpMap,t(f.bumpMap,m.bumpMapTransform),m.bumpScale.value=f.bumpScale,f.side===Jt&&(m.bumpScale.value*=-1)),f.normalMap&&(m.normalMap.value=f.normalMap,t(f.normalMap,m.normalMapTransform),m.normalScale.value.copy(f.normalScale),f.side===Jt&&m.normalScale.value.negate()),f.displacementMap&&(m.displacementMap.value=f.displacementMap,t(f.displacementMap,m.displacementMapTransform),m.displacementScale.value=f.displacementScale,m.displacementBias.value=f.displacementBias),f.emissiveMap&&(m.emissiveMap.value=f.emissiveMap,t(f.emissiveMap,m.emissiveMapTransform)),f.specularMap&&(m.specularMap.value=f.specularMap,t(f.specularMap,m.specularMapTransform)),f.alphaTest>0&&(m.alphaTest.value=f.alphaTest);const T=e.get(f),y=T.envMap,M=T.envMapRotation;y&&(m.envMap.value=y,Ii.copy(M),Ii.x*=-1,Ii.y*=-1,Ii.z*=-1,y.isCubeTexture&&y.isRenderTargetTexture===!1&&(Ii.y*=-1,Ii.z*=-1),m.envMapRotation.value.setFromMatrix4(sM.makeRotationFromEuler(Ii)),m.flipEnvMap.value=y.isCubeTexture&&y.isRenderTargetTexture===!1?-1:1,m.reflectivity.value=f.reflectivity,m.ior.value=f.ior,m.refractionRatio.value=f.refractionRatio),f.lightMap&&(m.lightMap.value=f.lightMap,m.lightMapIntensity.value=f.lightMapIntensity,t(f.lightMap,m.lightMapTransform)),f.aoMap&&(m.aoMap.value=f.aoMap,m.aoMapIntensity.value=f.aoMapIntensity,t(f.aoMap,m.aoMapTransform))}function o(m,f){m.diffuse.value.copy(f.color),m.opacity.value=f.opacity,f.map&&(m.map.value=f.map,t(f.map,m.mapTransform))}function a(m,f){m.dashSize.value=f.dashSize,m.totalSize.value=f.dashSize+f.gapSize,m.scale.value=f.scale}function l(m,f,T,y){m.diffuse.value.copy(f.color),m.opacity.value=f.opacity,m.size.value=f.size*T,m.scale.value=y*.5,f.map&&(m.map.value=f.map,t(f.map,m.uvTransform)),f.alphaMap&&(m.alphaMap.value=f.alphaMap,t(f.alphaMap,m.alphaMapTransform)),f.alphaTest>0&&(m.alphaTest.value=f.alphaTest)}function c(m,f){m.diffuse.value.copy(f.color),m.opacity.value=f.opacity,m.rotation.value=f.rotation,f.map&&(m.map.value=f.map,t(f.map,m.mapTransform)),f.alphaMap&&(m.alphaMap.value=f.alphaMap,t(f.alphaMap,m.alphaMapTransform)),f.alphaTest>0&&(m.alphaTest.value=f.alphaTest)}function u(m,f){m.specular.value.copy(f.specular),m.shininess.value=Math.max(f.shininess,1e-4)}function d(m,f){f.gradientMap&&(m.gradientMap.value=f.gradientMap)}function h(m,f){m.metalness.value=f.metalness,f.metalnessMap&&(m.metalnessMap.value=f.metalnessMap,t(f.metalnessMap,m.metalnessMapTransform)),m.roughness.value=f.roughness,f.roughnessMap&&(m.roughnessMap.value=f.roughnessMap,t(f.roughnessMap,m.roughnessMapTransform)),f.envMap&&(m.envMapIntensity.value=f.envMapIntensity)}function p(m,f,T){m.ior.value=f.ior,f.sheen>0&&(m.sheenColor.value.copy(f.sheenColor).multiplyScalar(f.sheen),m.sheenRoughness.value=f.sheenRoughness,f.sheenColorMap&&(m.sheenColorMap.value=f.sheenColorMap,t(f.sheenColorMap,m.sheenColorMapTransform)),f.sheenRoughnessMap&&(m.sheenRoughnessMap.value=f.sheenRoughnessMap,t(f.sheenRoughnessMap,m.sheenRoughnessMapTransform))),f.clearcoat>0&&(m.clearcoat.value=f.clearcoat,m.clearcoatRoughness.value=f.clearcoatRoughness,f.clearcoatMap&&(m.clearcoatMap.value=f.clearcoatMap,t(f.clearcoatMap,m.clearcoatMapTransform)),f.clearcoatRoughnessMap&&(m.clearcoatRoughnessMap.value=f.clearcoatRoughnessMap,t(f.clearcoatRoughnessMap,m.clearcoatRoughnessMapTransform)),f.clearcoatNormalMap&&(m.clearcoatNormalMap.value=f.clearcoatNormalMap,t(f.clearcoatNormalMap,m.clearcoatNormalMapTransform),m.clearcoatNormalScale.value.copy(f.clearcoatNormalScale),f.side===Jt&&m.clearcoatNormalScale.value.negate())),f.dispersion>0&&(m.dispersion.value=f.dispersion),f.iridescence>0&&(m.iridescence.value=f.iridescence,m.iridescenceIOR.value=f.iridescenceIOR,m.iridescenceThicknessMinimum.value=f.iridescenceThicknessRange[0],m.iridescenceThicknessMaximum.value=f.iridescenceThicknessRange[1],f.iridescenceMap&&(m.iridescenceMap.value=f.iridescenceMap,t(f.iridescenceMap,m.iridescenceMapTransform)),f.iridescenceThicknessMap&&(m.iridescenceThicknessMap.value=f.iridescenceThicknessMap,t(f.iridescenceThicknessMap,m.iridescenceThicknessMapTransform))),f.transmission>0&&(m.transmission.value=f.transmission,m.transmissionSamplerMap.value=T.texture,m.transmissionSamplerSize.value.set(T.width,T.height),f.transmissionMap&&(m.transmissionMap.value=f.transmissionMap,t(f.transmissionMap,m.transmissionMapTransform)),m.thickness.value=f.thickness,f.thicknessMap&&(m.thicknessMap.value=f.thicknessMap,t(f.thicknessMap,m.thicknessMapTransform)),m.attenuationDistance.value=f.attenuationDistance,m.attenuationColor.value.copy(f.attenuationColor)),f.anisotropy>0&&(m.anisotropyVector.value.set(f.anisotropy*Math.cos(f.anisotropyRotation),f.anisotropy*Math.sin(f.anisotropyRotation)),f.anisotropyMap&&(m.anisotropyMap.value=f.anisotropyMap,t(f.anisotropyMap,m.anisotropyMapTransform))),m.specularIntensity.value=f.specularIntensity,m.specularColor.value.copy(f.specularColor),f.specularColorMap&&(m.specularColorMap.value=f.specularColorMap,t(f.specularColorMap,m.specularColorMapTransform)),f.specularIntensityMap&&(m.specularIntensityMap.value=f.specularIntensityMap,t(f.specularIntensityMap,m.specularIntensityMapTransform))}function g(m,f){f.matcap&&(m.matcap.value=f.matcap)}function v(m,f){const T=e.get(f).light;m.referencePosition.value.setFromMatrixPosition(T.matrixWorld),m.nearDistance.value=T.shadow.camera.near,m.farDistance.value=T.shadow.camera.far}return{refreshFogUniforms:i,refreshMaterialUniforms:s}}function oM(n,e,t,i){let s={},r={},o=[];const a=n.getParameter(n.MAX_UNIFORM_BUFFER_BINDINGS);function l(T,y){const M=y.program;i.uniformBlockBinding(T,M)}function c(T,y){let M=s[T.id];M===void 0&&(g(T),M=u(T),s[T.id]=M,T.addEventListener("dispose",m));const P=y.program;i.updateUBOMapping(T,P);const E=e.render.frame;r[T.id]!==E&&(h(T),r[T.id]=E)}function u(T){const y=d();T.__bindingPointIndex=y;const M=n.createBuffer(),P=T.__size,E=T.usage;return n.bindBuffer(n.UNIFORM_BUFFER,M),n.bufferData(n.UNIFORM_BUFFER,P,E),n.bindBuffer(n.UNIFORM_BUFFER,null),n.bindBufferBase(n.UNIFORM_BUFFER,y,M),M}function d(){for(let T=0;T<a;T++)if(o.indexOf(T)===-1)return o.push(T),T;return console.error("THREE.WebGLRenderer: Maximum number of simultaneously usable uniforms groups reached."),0}function h(T){const y=s[T.id],M=T.uniforms,P=T.__cache;n.bindBuffer(n.UNIFORM_BUFFER,y);for(let E=0,A=M.length;E<A;E++){const R=Array.isArray(M[E])?M[E]:[M[E]];for(let w=0,S=R.length;w<S;w++){const D=R[w];if(p(D,E,w,P)===!0){const $=D.__offset,k=Array.isArray(D.value)?D.value:[D.value];let q=0;for(let Z=0;Z<k.length;Z++){const V=k[Z],se=v(V);typeof V=="number"||typeof V=="boolean"?(D.__data[0]=V,n.bufferSubData(n.UNIFORM_BUFFER,$+q,D.__data)):V.isMatrix3?(D.__data[0]=V.elements[0],D.__data[1]=V.elements[1],D.__data[2]=V.elements[2],D.__data[3]=0,D.__data[4]=V.elements[3],D.__data[5]=V.elements[4],D.__data[6]=V.elements[5],D.__data[7]=0,D.__data[8]=V.elements[6],D.__data[9]=V.elements[7],D.__data[10]=V.elements[8],D.__data[11]=0):(V.toArray(D.__data,q),q+=se.storage/Float32Array.BYTES_PER_ELEMENT)}n.bufferSubData(n.UNIFORM_BUFFER,$,D.__data)}}}n.bindBuffer(n.UNIFORM_BUFFER,null)}function p(T,y,M,P){const E=T.value,A=y+"_"+M;if(P[A]===void 0)return typeof E=="number"||typeof E=="boolean"?P[A]=E:P[A]=E.clone(),!0;{const R=P[A];if(typeof E=="number"||typeof E=="boolean"){if(R!==E)return P[A]=E,!0}else if(R.equals(E)===!1)return R.copy(E),!0}return!1}function g(T){const y=T.uniforms;let M=0;const P=16;for(let A=0,R=y.length;A<R;A++){const w=Array.isArray(y[A])?y[A]:[y[A]];for(let S=0,D=w.length;S<D;S++){const $=w[S],k=Array.isArray($.value)?$.value:[$.value];for(let q=0,Z=k.length;q<Z;q++){const V=k[q],se=v(V),H=M%P,ae=H%se.boundary,ge=H+ae;M+=ae,ge!==0&&P-ge<se.storage&&(M+=P-ge),$.__data=new Float32Array(se.storage/Float32Array.BYTES_PER_ELEMENT),$.__offset=M,M+=se.storage}}}const E=M%P;return E>0&&(M+=P-E),T.__size=M,T.__cache={},this}function v(T){const y={boundary:0,storage:0};return typeof T=="number"||typeof T=="boolean"?(y.boundary=4,y.storage=4):T.isVector2?(y.boundary=8,y.storage=8):T.isVector3||T.isColor?(y.boundary=16,y.storage=12):T.isVector4?(y.boundary=16,y.storage=16):T.isMatrix3?(y.boundary=48,y.storage=48):T.isMatrix4?(y.boundary=64,y.storage=64):T.isTexture?console.warn("THREE.WebGLRenderer: Texture samplers can not be part of an uniforms group."):console.warn("THREE.WebGLRenderer: Unsupported uniform value type.",T),y}function m(T){const y=T.target;y.removeEventListener("dispose",m);const M=o.indexOf(y.__bindingPointIndex);o.splice(M,1),n.deleteBuffer(s[y.id]),delete s[y.id],delete r[y.id]}function f(){for(const T in s)n.deleteBuffer(s[T]);o=[],s={},r={}}return{bind:l,update:c,dispose:f}}class aM{constructor(e={}){const{canvas:t=O_(),context:i=null,depth:s=!0,stencil:r=!1,alpha:o=!1,antialias:a=!1,premultipliedAlpha:l=!0,preserveDrawingBuffer:c=!1,powerPreference:u="default",failIfMajorPerformanceCaveat:d=!1,reverseDepthBuffer:h=!1}=e;this.isWebGLRenderer=!0;let p;if(i!==null){if(typeof WebGLRenderingContext<"u"&&i instanceof WebGLRenderingContext)throw new Error("THREE.WebGLRenderer: WebGL 1 is not supported since r163.");p=i.getContextAttributes().alpha}else p=o;const g=new Uint32Array(4),v=new Int32Array(4);let m=null,f=null;const T=[],y=[];this.domElement=t,this.debug={checkShaderErrors:!0,onShaderError:null},this.autoClear=!0,this.autoClearColor=!0,this.autoClearDepth=!0,this.autoClearStencil=!0,this.sortObjects=!0,this.clippingPlanes=[],this.localClippingEnabled=!1,this.toneMapping=yi,this.toneMappingExposure=1,this.transmissionResolutionScale=1;const M=this;let P=!1;this._outputColorSpace=gn;let E=0,A=0,R=null,w=-1,S=null;const D=new Mt,$=new Mt;let k=null;const q=new Pe(0);let Z=0,V=t.width,se=t.height,H=1,ae=null,ge=null;const Te=new Mt(0,0,V,se),$e=new Mt(0,0,V,se);let je=!1;const X=new cu;let le=!1,Ee=!1;const fe=new rt,we=new rt,Qe=new O,Y=new Mt,_e={background:null,fog:null,environment:null,overrideMaterial:null,isScene:!0};let Ye=!1;function Oe(){return R===null?H:1}let L=i;function Tt(b,N){return t.getContext(b,N)}try{const b={alpha:!0,depth:s,stencil:r,antialias:a,premultipliedAlpha:l,preserveDrawingBuffer:c,powerPreference:u,failIfMajorPerformanceCaveat:d};if("setAttribute"in t&&t.setAttribute("data-engine",`three.js r${Jc}`),t.addEventListener("webglcontextlost",ye,!1),t.addEventListener("webglcontextrestored",ie,!1),t.addEventListener("webglcontextcreationerror",K,!1),L===null){const N="webgl2";if(L=Tt(N,b),L===null)throw Tt(N)?new Error("Error creating WebGL context with your selected attributes."):new Error("Error creating WebGL context.")}}catch(b){throw console.error("THREE.WebGLRenderer: "+b.message),b}let st,ft,Ae,tt,Ie,Ke,At,C,x,B,j,J,W,Re,he,be,Ce,ee,ve,Fe,Ue,ce,Ge,I;function pe(){st=new _y(L),st.init(),ce=new QS(L,st),ft=new uy(L,st,e,ce),Ae=new ZS(L,st),ft.reverseDepthBuffer&&h&&Ae.buffers.depth.setReversed(!0),tt=new yy(L),Ie=new BS,Ke=new JS(L,st,Ae,Ie,ft,ce,tt),At=new hy(M),C=new gy(M),x=new T0(L),Ge=new ly(L,x),B=new vy(L,x,tt,Ge),j=new My(L,B,x,tt),ve=new Sy(L,ft,Ke),be=new dy(Ie),J=new OS(M,At,C,st,ft,Ge,be),W=new rM(M,Ie),Re=new zS,he=new XS(st),ee=new ay(M,At,C,Ae,j,p,l),Ce=new jS(M,j,ft),I=new oM(L,tt,ft,Ae),Fe=new cy(L,st,tt),Ue=new xy(L,st,tt),tt.programs=J.programs,M.capabilities=ft,M.extensions=st,M.properties=Ie,M.renderLists=Re,M.shadowMap=Ce,M.state=Ae,M.info=tt}pe();const te=new iM(M,L);this.xr=te,this.getContext=function(){return L},this.getContextAttributes=function(){return L.getContextAttributes()},this.forceContextLoss=function(){const b=st.get("WEBGL_lose_context");b&&b.loseContext()},this.forceContextRestore=function(){const b=st.get("WEBGL_lose_context");b&&b.restoreContext()},this.getPixelRatio=function(){return H},this.setPixelRatio=function(b){b!==void 0&&(H=b,this.setSize(V,se,!1))},this.getSize=function(b){return b.set(V,se)},this.setSize=function(b,N,z=!0){if(te.isPresenting){console.warn("THREE.WebGLRenderer: Can't change size while VR device is presenting.");return}V=b,se=N,t.width=Math.floor(b*H),t.height=Math.floor(N*H),z===!0&&(t.style.width=b+"px",t.style.height=N+"px"),this.setViewport(0,0,b,N)},this.getDrawingBufferSize=function(b){return b.set(V*H,se*H).floor()},this.setDrawingBufferSize=function(b,N,z){V=b,se=N,H=z,t.width=Math.floor(b*z),t.height=Math.floor(N*z),this.setViewport(0,0,b,N)},this.getCurrentViewport=function(b){return b.copy(D)},this.getViewport=function(b){return b.copy(Te)},this.setViewport=function(b,N,z,G){b.isVector4?Te.set(b.x,b.y,b.z,b.w):Te.set(b,N,z,G),Ae.viewport(D.copy(Te).multiplyScalar(H).round())},this.getScissor=function(b){return b.copy($e)},this.setScissor=function(b,N,z,G){b.isVector4?$e.set(b.x,b.y,b.z,b.w):$e.set(b,N,z,G),Ae.scissor($.copy($e).multiplyScalar(H).round())},this.getScissorTest=function(){return je},this.setScissorTest=function(b){Ae.setScissorTest(je=b)},this.setOpaqueSort=function(b){ae=b},this.setTransparentSort=function(b){ge=b},this.getClearColor=function(b){return b.copy(ee.getClearColor())},this.setClearColor=function(){ee.setClearColor(...arguments)},this.getClearAlpha=function(){return ee.getClearAlpha()},this.setClearAlpha=function(){ee.setClearAlpha(...arguments)},this.clear=function(b=!0,N=!0,z=!0){let G=0;if(b){let U=!1;if(R!==null){const re=R.texture.format;U=re===ou||re===ru||re===su}if(U){const re=R.texture.type,me=re===Un||re===Vi||re===yr||re===Sr||re===tu||re===nu,Me=ee.getClearColor(),xe=ee.getClearAlpha(),Be=Me.r,ze=Me.g,De=Me.b;me?(g[0]=Be,g[1]=ze,g[2]=De,g[3]=xe,L.clearBufferuiv(L.COLOR,0,g)):(v[0]=Be,v[1]=ze,v[2]=De,v[3]=xe,L.clearBufferiv(L.COLOR,0,v))}else G|=L.COLOR_BUFFER_BIT}N&&(G|=L.DEPTH_BUFFER_BIT),z&&(G|=L.STENCIL_BUFFER_BIT,this.state.buffers.stencil.setMask(4294967295)),L.clear(G)},this.clearColor=function(){this.clear(!0,!1,!1)},this.clearDepth=function(){this.clear(!1,!0,!1)},this.clearStencil=function(){this.clear(!1,!1,!0)},this.dispose=function(){t.removeEventListener("webglcontextlost",ye,!1),t.removeEventListener("webglcontextrestored",ie,!1),t.removeEventListener("webglcontextcreationerror",K,!1),ee.dispose(),Re.dispose(),he.dispose(),Ie.dispose(),At.dispose(),C.dispose(),j.dispose(),Ge.dispose(),I.dispose(),J.dispose(),te.dispose(),te.removeEventListener("sessionstart",Wu),te.removeEventListener("sessionend",Xu),Ti.stop()};function ye(b){b.preventDefault(),console.log("THREE.WebGLRenderer: Context Lost."),P=!0}function ie(){console.log("THREE.WebGLRenderer: Context Restored."),P=!1;const b=tt.autoReset,N=Ce.enabled,z=Ce.autoUpdate,G=Ce.needsUpdate,U=Ce.type;pe(),tt.autoReset=b,Ce.enabled=N,Ce.autoUpdate=z,Ce.needsUpdate=G,Ce.type=U}function K(b){console.error("THREE.WebGLRenderer: A WebGL context could not be created. Reason: ",b.statusMessage)}function Se(b){const N=b.target;N.removeEventListener("dispose",Se),He(N)}function He(b){mt(b),Ie.remove(b)}function mt(b){const N=Ie.get(b).programs;N!==void 0&&(N.forEach(function(z){J.releaseProgram(z)}),b.isShaderMaterial&&J.releaseShaderCache(b))}this.renderBufferDirect=function(b,N,z,G,U,re){N===null&&(N=_e);const me=U.isMesh&&U.matrixWorld.determinant()<0,Me=Um(b,N,z,G,U);Ae.setMaterial(G,me);let xe=z.index,Be=1;if(G.wireframe===!0){if(xe=B.getWireframeAttribute(z),xe===void 0)return;Be=2}const ze=z.drawRange,De=z.attributes.position;let et=ze.start*Be,ct=(ze.start+ze.count)*Be;re!==null&&(et=Math.max(et,re.start*Be),ct=Math.min(ct,(re.start+re.count)*Be)),xe!==null?(et=Math.max(et,0),ct=Math.min(ct,xe.count)):De!=null&&(et=Math.max(et,0),ct=Math.min(ct,De.count));const yt=ct-et;if(yt<0||yt===1/0)return;Ge.setup(U,G,Me,z,xe);let gt,ht=Fe;if(xe!==null&&(gt=x.get(xe),ht=Ue,ht.setIndex(gt)),U.isMesh)G.wireframe===!0?(Ae.setLineWidth(G.wireframeLinewidth*Oe()),ht.setMode(L.LINES)):ht.setMode(L.TRIANGLES);else if(U.isLine){let Ne=G.linewidth;Ne===void 0&&(Ne=1),Ae.setLineWidth(Ne*Oe()),U.isLineSegments?ht.setMode(L.LINES):U.isLineLoop?ht.setMode(L.LINE_LOOP):ht.setMode(L.LINE_STRIP)}else U.isPoints?ht.setMode(L.POINTS):U.isSprite&&ht.setMode(L.TRIANGLES);if(U.isBatchedMesh)if(U._multiDrawInstances!==null)As("THREE.WebGLRenderer: renderMultiDrawInstances has been deprecated and will be removed in r184. Append to renderMultiDraw arguments and use indirection."),ht.renderMultiDrawInstances(U._multiDrawStarts,U._multiDrawCounts,U._multiDrawCount,U._multiDrawInstances);else if(st.get("WEBGL_multi_draw"))ht.renderMultiDraw(U._multiDrawStarts,U._multiDrawCounts,U._multiDrawCount);else{const Ne=U._multiDrawStarts,xt=U._multiDrawCounts,nt=U._multiDrawCount,tn=xe?x.get(xe).bytesPerElement:1,ts=Ie.get(G).currentProgram.getUniforms();for(let nn=0;nn<nt;nn++)ts.setValue(L,"_gl_DrawID",nn),ht.render(Ne[nn]/tn,xt[nn])}else if(U.isInstancedMesh)ht.renderInstances(et,yt,U.count);else if(z.isInstancedBufferGeometry){const Ne=z._maxInstanceCount!==void 0?z._maxInstanceCount:1/0,xt=Math.min(z.instanceCount,Ne);ht.renderInstances(et,yt,xt)}else ht.render(et,yt)};function ot(b,N,z){b.transparent===!0&&b.side===Yn&&b.forceSinglePass===!1?(b.side=Jt,b.needsUpdate=!0,Or(b,N,z),b.side=wi,b.needsUpdate=!0,Or(b,N,z),b.side=Yn):Or(b,N,z)}this.compile=function(b,N,z=null){z===null&&(z=b),f=he.get(z),f.init(N),y.push(f),z.traverseVisible(function(U){U.isLight&&U.layers.test(N.layers)&&(f.pushLight(U),U.castShadow&&f.pushShadow(U))}),b!==z&&b.traverseVisible(function(U){U.isLight&&U.layers.test(N.layers)&&(f.pushLight(U),U.castShadow&&f.pushShadow(U))}),f.setupLights();const G=new Set;return b.traverse(function(U){if(!(U.isMesh||U.isPoints||U.isLine||U.isSprite))return;const re=U.material;if(re)if(Array.isArray(re))for(let me=0;me<re.length;me++){const Me=re[me];ot(Me,z,U),G.add(Me)}else ot(re,z,U),G.add(re)}),f=y.pop(),G},this.compileAsync=function(b,N,z=null){const G=this.compile(b,N,z);return new Promise(U=>{function re(){if(G.forEach(function(me){Ie.get(me).currentProgram.isReady()&&G.delete(me)}),G.size===0){U(b);return}setTimeout(re,10)}st.get("KHR_parallel_shader_compile")!==null?re():setTimeout(re,10)})};let Mn=null;function Bn(b){Mn&&Mn(b)}function Wu(){Ti.stop()}function Xu(){Ti.start()}const Ti=new _p;Ti.setAnimationLoop(Bn),typeof self<"u"&&Ti.setContext(self),this.setAnimationLoop=function(b){Mn=b,te.setAnimationLoop(b),b===null?Ti.stop():Ti.start()},te.addEventListener("sessionstart",Wu),te.addEventListener("sessionend",Xu),this.render=function(b,N){if(N!==void 0&&N.isCamera!==!0){console.error("THREE.WebGLRenderer.render: camera is not an instance of THREE.Camera.");return}if(P===!0)return;if(b.matrixWorldAutoUpdate===!0&&b.updateMatrixWorld(),N.parent===null&&N.matrixWorldAutoUpdate===!0&&N.updateMatrixWorld(),te.enabled===!0&&te.isPresenting===!0&&(te.cameraAutoUpdate===!0&&te.updateCamera(N),N=te.getCamera()),b.isScene===!0&&b.onBeforeRender(M,b,N,R),f=he.get(b,y.length),f.init(N),y.push(f),we.multiplyMatrices(N.projectionMatrix,N.matrixWorldInverse),X.setFromProjectionMatrix(we),Ee=this.localClippingEnabled,le=be.init(this.clippingPlanes,Ee),m=Re.get(b,T.length),m.init(),T.push(m),te.enabled===!0&&te.isPresenting===!0){const re=M.xr.getDepthSensingMesh();re!==null&&Ea(re,N,-1/0,M.sortObjects)}Ea(b,N,0,M.sortObjects),m.finish(),M.sortObjects===!0&&m.sort(ae,ge),Ye=te.enabled===!1||te.isPresenting===!1||te.hasDepthSensing()===!1,Ye&&ee.addToRenderList(m,b),this.info.render.frame++,le===!0&&be.beginShadows();const z=f.state.shadowsArray;Ce.render(z,b,N),le===!0&&be.endShadows(),this.info.autoReset===!0&&this.info.reset();const G=m.opaque,U=m.transmissive;if(f.setupLights(),N.isArrayCamera){const re=N.cameras;if(U.length>0)for(let me=0,Me=re.length;me<Me;me++){const xe=re[me];qu(G,U,b,xe)}Ye&&ee.render(b);for(let me=0,Me=re.length;me<Me;me++){const xe=re[me];Yu(m,b,xe,xe.viewport)}}else U.length>0&&qu(G,U,b,N),Ye&&ee.render(b),Yu(m,b,N);R!==null&&A===0&&(Ke.updateMultisampleRenderTarget(R),Ke.updateRenderTargetMipmap(R)),b.isScene===!0&&b.onAfterRender(M,b,N),Ge.resetDefaultState(),w=-1,S=null,y.pop(),y.length>0?(f=y[y.length-1],le===!0&&be.setGlobalState(M.clippingPlanes,f.state.camera)):f=null,T.pop(),T.length>0?m=T[T.length-1]:m=null};function Ea(b,N,z,G){if(b.visible===!1)return;if(b.layers.test(N.layers)){if(b.isGroup)z=b.renderOrder;else if(b.isLOD)b.autoUpdate===!0&&b.update(N);else if(b.isLight)f.pushLight(b),b.castShadow&&f.pushShadow(b);else if(b.isSprite){if(!b.frustumCulled||X.intersectsSprite(b)){G&&Y.setFromMatrixPosition(b.matrixWorld).applyMatrix4(we);const me=j.update(b),Me=b.material;Me.visible&&m.push(b,me,Me,z,Y.z,null)}}else if((b.isMesh||b.isLine||b.isPoints)&&(!b.frustumCulled||X.intersectsObject(b))){const me=j.update(b),Me=b.material;if(G&&(b.boundingSphere!==void 0?(b.boundingSphere===null&&b.computeBoundingSphere(),Y.copy(b.boundingSphere.center)):(me.boundingSphere===null&&me.computeBoundingSphere(),Y.copy(me.boundingSphere.center)),Y.applyMatrix4(b.matrixWorld).applyMatrix4(we)),Array.isArray(Me)){const xe=me.groups;for(let Be=0,ze=xe.length;Be<ze;Be++){const De=xe[Be],et=Me[De.materialIndex];et&&et.visible&&m.push(b,me,et,z,Y.z,De)}}else Me.visible&&m.push(b,me,Me,z,Y.z,null)}}const re=b.children;for(let me=0,Me=re.length;me<Me;me++)Ea(re[me],N,z,G)}function Yu(b,N,z,G){const U=b.opaque,re=b.transmissive,me=b.transparent;f.setupLightsView(z),le===!0&&be.setGlobalState(M.clippingPlanes,z),G&&Ae.viewport(D.copy(G)),U.length>0&&Fr(U,N,z),re.length>0&&Fr(re,N,z),me.length>0&&Fr(me,N,z),Ae.buffers.depth.setTest(!0),Ae.buffers.depth.setMask(!0),Ae.buffers.color.setMask(!0),Ae.setPolygonOffset(!1)}function qu(b,N,z,G){if((z.isScene===!0?z.overrideMaterial:null)!==null)return;f.state.transmissionRenderTarget[G.id]===void 0&&(f.state.transmissionRenderTarget[G.id]=new Wi(1,1,{generateMipmaps:!0,type:st.has("EXT_color_buffer_half_float")||st.has("EXT_color_buffer_float")?Rr:Un,minFilter:ki,samples:4,stencilBuffer:r,resolveDepthBuffer:!1,resolveStencilBuffer:!1,colorSpace:it.workingColorSpace}));const re=f.state.transmissionRenderTarget[G.id],me=G.viewport||D;re.setSize(me.z*M.transmissionResolutionScale,me.w*M.transmissionResolutionScale);const Me=M.getRenderTarget(),xe=M.getActiveCubeFace(),Be=M.getActiveMipmapLevel();M.setRenderTarget(re),M.getClearColor(q),Z=M.getClearAlpha(),Z<1&&M.setClearColor(16777215,.5),M.clear(),Ye&&ee.render(z);const ze=M.toneMapping;M.toneMapping=yi;const De=G.viewport;if(G.viewport!==void 0&&(G.viewport=void 0),f.setupLightsView(G),le===!0&&be.setGlobalState(M.clippingPlanes,G),Fr(b,z,G),Ke.updateMultisampleRenderTarget(re),Ke.updateRenderTargetMipmap(re),st.has("WEBGL_multisampled_render_to_texture")===!1){let et=!1;for(let ct=0,yt=N.length;ct<yt;ct++){const gt=N[ct],ht=gt.object,Ne=gt.geometry,xt=gt.material,nt=gt.group;if(xt.side===Yn&&ht.layers.test(G.layers)){const tn=xt.side;xt.side=Jt,xt.needsUpdate=!0,ju(ht,z,G,Ne,xt,nt),xt.side=tn,xt.needsUpdate=!0,et=!0}}et===!0&&(Ke.updateMultisampleRenderTarget(re),Ke.updateRenderTargetMipmap(re))}M.setRenderTarget(Me,xe,Be),M.setClearColor(q,Z),De!==void 0&&(G.viewport=De),M.toneMapping=ze}function Fr(b,N,z){const G=N.isScene===!0?N.overrideMaterial:null;for(let U=0,re=b.length;U<re;U++){const me=b[U],Me=me.object,xe=me.geometry,Be=me.group;let ze=me.material;ze.allowOverride===!0&&G!==null&&(ze=G),Me.layers.test(z.layers)&&ju(Me,N,z,xe,ze,Be)}}function ju(b,N,z,G,U,re){b.onBeforeRender(M,N,z,G,U,re),b.modelViewMatrix.multiplyMatrices(z.matrixWorldInverse,b.matrixWorld),b.normalMatrix.getNormalMatrix(b.modelViewMatrix),U.onBeforeRender(M,N,z,G,b,re),U.transparent===!0&&U.side===Yn&&U.forceSinglePass===!1?(U.side=Jt,U.needsUpdate=!0,M.renderBufferDirect(z,N,G,U,b,re),U.side=wi,U.needsUpdate=!0,M.renderBufferDirect(z,N,G,U,b,re),U.side=Yn):M.renderBufferDirect(z,N,G,U,b,re),b.onAfterRender(M,N,z,G,U,re)}function Or(b,N,z){N.isScene!==!0&&(N=_e);const G=Ie.get(b),U=f.state.lights,re=f.state.shadowsArray,me=U.state.version,Me=J.getParameters(b,U.state,re,N,z),xe=J.getProgramCacheKey(Me);let Be=G.programs;G.environment=b.isMeshStandardMaterial?N.environment:null,G.fog=N.fog,G.envMap=(b.isMeshStandardMaterial?C:At).get(b.envMap||G.environment),G.envMapRotation=G.environment!==null&&b.envMap===null?N.environmentRotation:b.envMapRotation,Be===void 0&&(b.addEventListener("dispose",Se),Be=new Map,G.programs=Be);let ze=Be.get(xe);if(ze!==void 0){if(G.currentProgram===ze&&G.lightsStateVersion===me)return Zu(b,Me),ze}else Me.uniforms=J.getUniforms(b),b.onBeforeCompile(Me,M),ze=J.acquireProgram(Me,xe),Be.set(xe,ze),G.uniforms=Me.uniforms;const De=G.uniforms;return(!b.isShaderMaterial&&!b.isRawShaderMaterial||b.clipping===!0)&&(De.clippingPlanes=be.uniform),Zu(b,Me),G.needsLights=Om(b),G.lightsStateVersion=me,G.needsLights&&(De.ambientLightColor.value=U.state.ambient,De.lightProbe.value=U.state.probe,De.directionalLights.value=U.state.directional,De.directionalLightShadows.value=U.state.directionalShadow,De.spotLights.value=U.state.spot,De.spotLightShadows.value=U.state.spotShadow,De.rectAreaLights.value=U.state.rectArea,De.ltc_1.value=U.state.rectAreaLTC1,De.ltc_2.value=U.state.rectAreaLTC2,De.pointLights.value=U.state.point,De.pointLightShadows.value=U.state.pointShadow,De.hemisphereLights.value=U.state.hemi,De.directionalShadowMap.value=U.state.directionalShadowMap,De.directionalShadowMatrix.value=U.state.directionalShadowMatrix,De.spotShadowMap.value=U.state.spotShadowMap,De.spotLightMatrix.value=U.state.spotLightMatrix,De.spotLightMap.value=U.state.spotLightMap,De.pointShadowMap.value=U.state.pointShadowMap,De.pointShadowMatrix.value=U.state.pointShadowMatrix),G.currentProgram=ze,G.uniformsList=null,ze}function Ku(b){if(b.uniformsList===null){const N=b.currentProgram.getUniforms();b.uniformsList=No.seqWithValue(N.seq,b.uniforms)}return b.uniformsList}function Zu(b,N){const z=Ie.get(b);z.outputColorSpace=N.outputColorSpace,z.batching=N.batching,z.batchingColor=N.batchingColor,z.instancing=N.instancing,z.instancingColor=N.instancingColor,z.instancingMorph=N.instancingMorph,z.skinning=N.skinning,z.morphTargets=N.morphTargets,z.morphNormals=N.morphNormals,z.morphColors=N.morphColors,z.morphTargetsCount=N.morphTargetsCount,z.numClippingPlanes=N.numClippingPlanes,z.numIntersection=N.numClipIntersection,z.vertexAlphas=N.vertexAlphas,z.vertexTangents=N.vertexTangents,z.toneMapping=N.toneMapping}function Um(b,N,z,G,U){N.isScene!==!0&&(N=_e),Ke.resetTextureUnits();const re=N.fog,me=G.isMeshStandardMaterial?N.environment:null,Me=R===null?M.outputColorSpace:R.isXRRenderTarget===!0?R.texture.colorSpace:Fs,xe=(G.isMeshStandardMaterial?C:At).get(G.envMap||me),Be=G.vertexColors===!0&&!!z.attributes.color&&z.attributes.color.itemSize===4,ze=!!z.attributes.tangent&&(!!G.normalMap||G.anisotropy>0),De=!!z.morphAttributes.position,et=!!z.morphAttributes.normal,ct=!!z.morphAttributes.color;let yt=yi;G.toneMapped&&(R===null||R.isXRRenderTarget===!0)&&(yt=M.toneMapping);const gt=z.morphAttributes.position||z.morphAttributes.normal||z.morphAttributes.color,ht=gt!==void 0?gt.length:0,Ne=Ie.get(G),xt=f.state.lights;if(le===!0&&(Ee===!0||b!==S)){const Gt=b===S&&G.id===w;be.setState(G,b,Gt)}let nt=!1;G.version===Ne.__version?(Ne.needsLights&&Ne.lightsStateVersion!==xt.state.version||Ne.outputColorSpace!==Me||U.isBatchedMesh&&Ne.batching===!1||!U.isBatchedMesh&&Ne.batching===!0||U.isBatchedMesh&&Ne.batchingColor===!0&&U.colorTexture===null||U.isBatchedMesh&&Ne.batchingColor===!1&&U.colorTexture!==null||U.isInstancedMesh&&Ne.instancing===!1||!U.isInstancedMesh&&Ne.instancing===!0||U.isSkinnedMesh&&Ne.skinning===!1||!U.isSkinnedMesh&&Ne.skinning===!0||U.isInstancedMesh&&Ne.instancingColor===!0&&U.instanceColor===null||U.isInstancedMesh&&Ne.instancingColor===!1&&U.instanceColor!==null||U.isInstancedMesh&&Ne.instancingMorph===!0&&U.morphTexture===null||U.isInstancedMesh&&Ne.instancingMorph===!1&&U.morphTexture!==null||Ne.envMap!==xe||G.fog===!0&&Ne.fog!==re||Ne.numClippingPlanes!==void 0&&(Ne.numClippingPlanes!==be.numPlanes||Ne.numIntersection!==be.numIntersection)||Ne.vertexAlphas!==Be||Ne.vertexTangents!==ze||Ne.morphTargets!==De||Ne.morphNormals!==et||Ne.morphColors!==ct||Ne.toneMapping!==yt||Ne.morphTargetsCount!==ht)&&(nt=!0):(nt=!0,Ne.__version=G.version);let tn=Ne.currentProgram;nt===!0&&(tn=Or(G,N,U));let ts=!1,nn=!1,Ys=!1;const vt=tn.getUniforms(),hn=Ne.uniforms;if(Ae.useProgram(tn.program)&&(ts=!0,nn=!0,Ys=!0),G.id!==w&&(w=G.id,nn=!0),ts||S!==b){Ae.buffers.depth.getReversed()?(fe.copy(b.projectionMatrix),k_(fe),z_(fe),vt.setValue(L,"projectionMatrix",fe)):vt.setValue(L,"projectionMatrix",b.projectionMatrix),vt.setValue(L,"viewMatrix",b.matrixWorldInverse);const Yt=vt.map.cameraPosition;Yt!==void 0&&Yt.setValue(L,Qe.setFromMatrixPosition(b.matrixWorld)),ft.logarithmicDepthBuffer&&vt.setValue(L,"logDepthBufFC",2/(Math.log(b.far+1)/Math.LN2)),(G.isMeshPhongMaterial||G.isMeshToonMaterial||G.isMeshLambertMaterial||G.isMeshBasicMaterial||G.isMeshStandardMaterial||G.isShaderMaterial)&&vt.setValue(L,"isOrthographic",b.isOrthographicCamera===!0),S!==b&&(S=b,nn=!0,Ys=!0)}if(U.isSkinnedMesh){vt.setOptional(L,U,"bindMatrix"),vt.setOptional(L,U,"bindMatrixInverse");const Gt=U.skeleton;Gt&&(Gt.boneTexture===null&&Gt.computeBoneTexture(),vt.setValue(L,"boneTexture",Gt.boneTexture,Ke))}U.isBatchedMesh&&(vt.setOptional(L,U,"batchingTexture"),vt.setValue(L,"batchingTexture",U._matricesTexture,Ke),vt.setOptional(L,U,"batchingIdTexture"),vt.setValue(L,"batchingIdTexture",U._indirectTexture,Ke),vt.setOptional(L,U,"batchingColorTexture"),U._colorsTexture!==null&&vt.setValue(L,"batchingColorTexture",U._colorsTexture,Ke));const fn=z.morphAttributes;if((fn.position!==void 0||fn.normal!==void 0||fn.color!==void 0)&&ve.update(U,z,tn),(nn||Ne.receiveShadow!==U.receiveShadow)&&(Ne.receiveShadow=U.receiveShadow,vt.setValue(L,"receiveShadow",U.receiveShadow)),G.isMeshGouraudMaterial&&G.envMap!==null&&(hn.envMap.value=xe,hn.flipEnvMap.value=xe.isCubeTexture&&xe.isRenderTargetTexture===!1?-1:1),G.isMeshStandardMaterial&&G.envMap===null&&N.environment!==null&&(hn.envMapIntensity.value=N.environmentIntensity),nn&&(vt.setValue(L,"toneMappingExposure",M.toneMappingExposure),Ne.needsLights&&Fm(hn,Ys),re&&G.fog===!0&&W.refreshFogUniforms(hn,re),W.refreshMaterialUniforms(hn,G,H,se,f.state.transmissionRenderTarget[b.id]),No.upload(L,Ku(Ne),hn,Ke)),G.isShaderMaterial&&G.uniformsNeedUpdate===!0&&(No.upload(L,Ku(Ne),hn,Ke),G.uniformsNeedUpdate=!1),G.isSpriteMaterial&&vt.setValue(L,"center",U.center),vt.setValue(L,"modelViewMatrix",U.modelViewMatrix),vt.setValue(L,"normalMatrix",U.normalMatrix),vt.setValue(L,"modelMatrix",U.matrixWorld),G.isShaderMaterial||G.isRawShaderMaterial){const Gt=G.uniformsGroups;for(let Yt=0,Ta=Gt.length;Yt<Ta;Yt++){const Ai=Gt[Yt];I.update(Ai,tn),I.bind(Ai,tn)}}return tn}function Fm(b,N){b.ambientLightColor.needsUpdate=N,b.lightProbe.needsUpdate=N,b.directionalLights.needsUpdate=N,b.directionalLightShadows.needsUpdate=N,b.pointLights.needsUpdate=N,b.pointLightShadows.needsUpdate=N,b.spotLights.needsUpdate=N,b.spotLightShadows.needsUpdate=N,b.rectAreaLights.needsUpdate=N,b.hemisphereLights.needsUpdate=N}function Om(b){return b.isMeshLambertMaterial||b.isMeshToonMaterial||b.isMeshPhongMaterial||b.isMeshStandardMaterial||b.isShadowMaterial||b.isShaderMaterial&&b.lights===!0}this.getActiveCubeFace=function(){return E},this.getActiveMipmapLevel=function(){return A},this.getRenderTarget=function(){return R},this.setRenderTargetTextures=function(b,N,z){const G=Ie.get(b);G.__autoAllocateDepthBuffer=b.resolveDepthBuffer===!1,G.__autoAllocateDepthBuffer===!1&&(G.__useRenderToTexture=!1),Ie.get(b.texture).__webglTexture=N,Ie.get(b.depthTexture).__webglTexture=G.__autoAllocateDepthBuffer?void 0:z,G.__hasExternalTextures=!0},this.setRenderTargetFramebuffer=function(b,N){const z=Ie.get(b);z.__webglFramebuffer=N,z.__useDefaultFramebuffer=N===void 0};const Bm=L.createFramebuffer();this.setRenderTarget=function(b,N=0,z=0){R=b,E=N,A=z;let G=!0,U=null,re=!1,me=!1;if(b){const xe=Ie.get(b);if(xe.__useDefaultFramebuffer!==void 0)Ae.bindFramebuffer(L.FRAMEBUFFER,null),G=!1;else if(xe.__webglFramebuffer===void 0)Ke.setupRenderTarget(b);else if(xe.__hasExternalTextures)Ke.rebindTextures(b,Ie.get(b.texture).__webglTexture,Ie.get(b.depthTexture).__webglTexture);else if(b.depthBuffer){const De=b.depthTexture;if(xe.__boundDepthTexture!==De){if(De!==null&&Ie.has(De)&&(b.width!==De.image.width||b.height!==De.image.height))throw new Error("WebGLRenderTarget: Attached DepthTexture is initialized to the incorrect size.");Ke.setupDepthRenderbuffer(b)}}const Be=b.texture;(Be.isData3DTexture||Be.isDataArrayTexture||Be.isCompressedArrayTexture)&&(me=!0);const ze=Ie.get(b).__webglFramebuffer;b.isWebGLCubeRenderTarget?(Array.isArray(ze[N])?U=ze[N][z]:U=ze[N],re=!0):b.samples>0&&Ke.useMultisampledRTT(b)===!1?U=Ie.get(b).__webglMultisampledFramebuffer:Array.isArray(ze)?U=ze[z]:U=ze,D.copy(b.viewport),$.copy(b.scissor),k=b.scissorTest}else D.copy(Te).multiplyScalar(H).floor(),$.copy($e).multiplyScalar(H).floor(),k=je;if(z!==0&&(U=Bm),Ae.bindFramebuffer(L.FRAMEBUFFER,U)&&G&&Ae.drawBuffers(b,U),Ae.viewport(D),Ae.scissor($),Ae.setScissorTest(k),re){const xe=Ie.get(b.texture);L.framebufferTexture2D(L.FRAMEBUFFER,L.COLOR_ATTACHMENT0,L.TEXTURE_CUBE_MAP_POSITIVE_X+N,xe.__webglTexture,z)}else if(me){const xe=Ie.get(b.texture),Be=N;L.framebufferTextureLayer(L.FRAMEBUFFER,L.COLOR_ATTACHMENT0,xe.__webglTexture,z,Be)}else if(b!==null&&z!==0){const xe=Ie.get(b.texture);L.framebufferTexture2D(L.FRAMEBUFFER,L.COLOR_ATTACHMENT0,L.TEXTURE_2D,xe.__webglTexture,z)}w=-1},this.readRenderTargetPixels=function(b,N,z,G,U,re,me,Me=0){if(!(b&&b.isWebGLRenderTarget)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");return}let xe=Ie.get(b).__webglFramebuffer;if(b.isWebGLCubeRenderTarget&&me!==void 0&&(xe=xe[me]),xe){Ae.bindFramebuffer(L.FRAMEBUFFER,xe);try{const Be=b.textures[Me],ze=Be.format,De=Be.type;if(!ft.textureFormatReadable(ze)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not in RGBA or implementation defined format.");return}if(!ft.textureTypeReadable(De)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not in UnsignedByteType or implementation defined type.");return}N>=0&&N<=b.width-G&&z>=0&&z<=b.height-U&&(b.textures.length>1&&L.readBuffer(L.COLOR_ATTACHMENT0+Me),L.readPixels(N,z,G,U,ce.convert(ze),ce.convert(De),re))}finally{const Be=R!==null?Ie.get(R).__webglFramebuffer:null;Ae.bindFramebuffer(L.FRAMEBUFFER,Be)}}},this.readRenderTargetPixelsAsync=async function(b,N,z,G,U,re,me,Me=0){if(!(b&&b.isWebGLRenderTarget))throw new Error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");let xe=Ie.get(b).__webglFramebuffer;if(b.isWebGLCubeRenderTarget&&me!==void 0&&(xe=xe[me]),xe)if(N>=0&&N<=b.width-G&&z>=0&&z<=b.height-U){Ae.bindFramebuffer(L.FRAMEBUFFER,xe);const Be=b.textures[Me],ze=Be.format,De=Be.type;if(!ft.textureFormatReadable(ze))throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in RGBA or implementation defined format.");if(!ft.textureTypeReadable(De))throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in UnsignedByteType or implementation defined type.");const et=L.createBuffer();L.bindBuffer(L.PIXEL_PACK_BUFFER,et),L.bufferData(L.PIXEL_PACK_BUFFER,re.byteLength,L.STREAM_READ),b.textures.length>1&&L.readBuffer(L.COLOR_ATTACHMENT0+Me),L.readPixels(N,z,G,U,ce.convert(ze),ce.convert(De),0);const ct=R!==null?Ie.get(R).__webglFramebuffer:null;Ae.bindFramebuffer(L.FRAMEBUFFER,ct);const yt=L.fenceSync(L.SYNC_GPU_COMMANDS_COMPLETE,0);return L.flush(),await B_(L,yt,4),L.bindBuffer(L.PIXEL_PACK_BUFFER,et),L.getBufferSubData(L.PIXEL_PACK_BUFFER,0,re),L.deleteBuffer(et),L.deleteSync(yt),re}else throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: requested read bounds are out of range.")},this.copyFramebufferToTexture=function(b,N=null,z=0){const G=Math.pow(2,-z),U=Math.floor(b.image.width*G),re=Math.floor(b.image.height*G),me=N!==null?N.x:0,Me=N!==null?N.y:0;Ke.setTexture2D(b,0),L.copyTexSubImage2D(L.TEXTURE_2D,z,0,0,me,Me,U,re),Ae.unbindTexture()};const km=L.createFramebuffer(),zm=L.createFramebuffer();this.copyTextureToTexture=function(b,N,z=null,G=null,U=0,re=null){re===null&&(U!==0?(As("WebGLRenderer: copyTextureToTexture function signature has changed to support src and dst mipmap levels."),re=U,U=0):re=0);let me,Me,xe,Be,ze,De,et,ct,yt;const gt=b.isCompressedTexture?b.mipmaps[re]:b.image;if(z!==null)me=z.max.x-z.min.x,Me=z.max.y-z.min.y,xe=z.isBox3?z.max.z-z.min.z:1,Be=z.min.x,ze=z.min.y,De=z.isBox3?z.min.z:0;else{const fn=Math.pow(2,-U);me=Math.floor(gt.width*fn),Me=Math.floor(gt.height*fn),b.isDataArrayTexture?xe=gt.depth:b.isData3DTexture?xe=Math.floor(gt.depth*fn):xe=1,Be=0,ze=0,De=0}G!==null?(et=G.x,ct=G.y,yt=G.z):(et=0,ct=0,yt=0);const ht=ce.convert(N.format),Ne=ce.convert(N.type);let xt;N.isData3DTexture?(Ke.setTexture3D(N,0),xt=L.TEXTURE_3D):N.isDataArrayTexture||N.isCompressedArrayTexture?(Ke.setTexture2DArray(N,0),xt=L.TEXTURE_2D_ARRAY):(Ke.setTexture2D(N,0),xt=L.TEXTURE_2D),L.pixelStorei(L.UNPACK_FLIP_Y_WEBGL,N.flipY),L.pixelStorei(L.UNPACK_PREMULTIPLY_ALPHA_WEBGL,N.premultiplyAlpha),L.pixelStorei(L.UNPACK_ALIGNMENT,N.unpackAlignment);const nt=L.getParameter(L.UNPACK_ROW_LENGTH),tn=L.getParameter(L.UNPACK_IMAGE_HEIGHT),ts=L.getParameter(L.UNPACK_SKIP_PIXELS),nn=L.getParameter(L.UNPACK_SKIP_ROWS),Ys=L.getParameter(L.UNPACK_SKIP_IMAGES);L.pixelStorei(L.UNPACK_ROW_LENGTH,gt.width),L.pixelStorei(L.UNPACK_IMAGE_HEIGHT,gt.height),L.pixelStorei(L.UNPACK_SKIP_PIXELS,Be),L.pixelStorei(L.UNPACK_SKIP_ROWS,ze),L.pixelStorei(L.UNPACK_SKIP_IMAGES,De);const vt=b.isDataArrayTexture||b.isData3DTexture,hn=N.isDataArrayTexture||N.isData3DTexture;if(b.isDepthTexture){const fn=Ie.get(b),Gt=Ie.get(N),Yt=Ie.get(fn.__renderTarget),Ta=Ie.get(Gt.__renderTarget);Ae.bindFramebuffer(L.READ_FRAMEBUFFER,Yt.__webglFramebuffer),Ae.bindFramebuffer(L.DRAW_FRAMEBUFFER,Ta.__webglFramebuffer);for(let Ai=0;Ai<xe;Ai++)vt&&(L.framebufferTextureLayer(L.READ_FRAMEBUFFER,L.COLOR_ATTACHMENT0,Ie.get(b).__webglTexture,U,De+Ai),L.framebufferTextureLayer(L.DRAW_FRAMEBUFFER,L.COLOR_ATTACHMENT0,Ie.get(N).__webglTexture,re,yt+Ai)),L.blitFramebuffer(Be,ze,me,Me,et,ct,me,Me,L.DEPTH_BUFFER_BIT,L.NEAREST);Ae.bindFramebuffer(L.READ_FRAMEBUFFER,null),Ae.bindFramebuffer(L.DRAW_FRAMEBUFFER,null)}else if(U!==0||b.isRenderTargetTexture||Ie.has(b)){const fn=Ie.get(b),Gt=Ie.get(N);Ae.bindFramebuffer(L.READ_FRAMEBUFFER,km),Ae.bindFramebuffer(L.DRAW_FRAMEBUFFER,zm);for(let Yt=0;Yt<xe;Yt++)vt?L.framebufferTextureLayer(L.READ_FRAMEBUFFER,L.COLOR_ATTACHMENT0,fn.__webglTexture,U,De+Yt):L.framebufferTexture2D(L.READ_FRAMEBUFFER,L.COLOR_ATTACHMENT0,L.TEXTURE_2D,fn.__webglTexture,U),hn?L.framebufferTextureLayer(L.DRAW_FRAMEBUFFER,L.COLOR_ATTACHMENT0,Gt.__webglTexture,re,yt+Yt):L.framebufferTexture2D(L.DRAW_FRAMEBUFFER,L.COLOR_ATTACHMENT0,L.TEXTURE_2D,Gt.__webglTexture,re),U!==0?L.blitFramebuffer(Be,ze,me,Me,et,ct,me,Me,L.COLOR_BUFFER_BIT,L.NEAREST):hn?L.copyTexSubImage3D(xt,re,et,ct,yt+Yt,Be,ze,me,Me):L.copyTexSubImage2D(xt,re,et,ct,Be,ze,me,Me);Ae.bindFramebuffer(L.READ_FRAMEBUFFER,null),Ae.bindFramebuffer(L.DRAW_FRAMEBUFFER,null)}else hn?b.isDataTexture||b.isData3DTexture?L.texSubImage3D(xt,re,et,ct,yt,me,Me,xe,ht,Ne,gt.data):N.isCompressedArrayTexture?L.compressedTexSubImage3D(xt,re,et,ct,yt,me,Me,xe,ht,gt.data):L.texSubImage3D(xt,re,et,ct,yt,me,Me,xe,ht,Ne,gt):b.isDataTexture?L.texSubImage2D(L.TEXTURE_2D,re,et,ct,me,Me,ht,Ne,gt.data):b.isCompressedTexture?L.compressedTexSubImage2D(L.TEXTURE_2D,re,et,ct,gt.width,gt.height,ht,gt.data):L.texSubImage2D(L.TEXTURE_2D,re,et,ct,me,Me,ht,Ne,gt);L.pixelStorei(L.UNPACK_ROW_LENGTH,nt),L.pixelStorei(L.UNPACK_IMAGE_HEIGHT,tn),L.pixelStorei(L.UNPACK_SKIP_PIXELS,ts),L.pixelStorei(L.UNPACK_SKIP_ROWS,nn),L.pixelStorei(L.UNPACK_SKIP_IMAGES,Ys),re===0&&N.generateMipmaps&&L.generateMipmap(xt),Ae.unbindTexture()},this.copyTextureToTexture3D=function(b,N,z=null,G=null,U=0){return As('WebGLRenderer: copyTextureToTexture3D function has been deprecated. Use "copyTextureToTexture" instead.'),this.copyTextureToTexture(b,N,z,G,U)},this.initRenderTarget=function(b){Ie.get(b).__webglFramebuffer===void 0&&Ke.setupRenderTarget(b)},this.initTexture=function(b){b.isCubeTexture?Ke.setTextureCube(b,0):b.isData3DTexture?Ke.setTexture3D(b,0):b.isDataArrayTexture||b.isCompressedArrayTexture?Ke.setTexture2DArray(b,0):Ke.setTexture2D(b,0),Ae.unbindTexture()},this.resetState=function(){E=0,A=0,R=null,Ae.reset(),Ge.reset()},typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}get coordinateSystem(){return Kn}get outputColorSpace(){return this._outputColorSpace}set outputColorSpace(e){this._outputColorSpace=e;const t=this.getContext();t.drawingBufferColorSpace=it._getDrawingBufferColorSpace(e),t.unpackColorSpace=it._getUnpackColorSpace()}}const lM=3;let Uo="checking",bs=null,vo=null,Sh=0;const Mp=new Set;function wp(){return Uo}function cM(n){Mp.add(n)}function hu(){return bs?Promise.resolve(bs):(vo||(vo=uM().finally(()=>{vo=null})),vo)}function vs(n){if(n!==Uo){Uo=n;for(const e of Mp)e(Uo)}}async function uM(){vs("checking");const n=globalThis.navigator?.gpu;if(!n)return vs("no-webgpu"),null;let e=null;try{e=await n.requestAdapter()}catch{e=null}if(!e||e.info?.isFallbackAdapter||e.isFallbackAdapter)return vs("no-adapter"),null;let t=null;try{t=await e.requestDevice()}catch{t=null}return t?(t.lost.then(()=>{bs===t&&(bs=null,Sh<lM?(Sh+=1,hu()):vs("device-failed"))}),bs=t,vs("ready"),bs):(vs("device-failed"),null)}const dM=`// SPDX-License-Identifier: Apache-2.0
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
`,hM=`// SPDX-License-Identifier: Apache-2.0
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
`,Mh=64,fM=64*1024*1024,pM=[5,6,7,8,9,10,11,12,13,14,15];function bp({useRule30:n,useRule30_2D:e,useSineWave:t,useSandpile:i}){return t||i?null:e?"rule30_2D":n?"rule30":"gameOfLife3D"}function mM(n){const{size:e,data:t,active:i}=n;let s=0;for(let o=0;o<t.length;o++)if(t[o]===1)s++;else if(t[o]!==0)return!1;if(s!==i.length)return!1;const r=new Uint8Array(t.length);for(const[o,a,l]of i){if(![o,a,l].every(d=>Number.isInteger(d)&&d>=0&&d<e))return!1;const u=n._idx(o,a,l);if(t[u]!==1||r[u])return!1;r[u]=1}return!0}async function*gM(n,{mode:e,seed:t,generations:i,wrapping:s,rules:r,boundaryRules:o}){const a=e==="gameOfLife3D"?_M(t,r,o):vM(t,e==="rule30_2D"),{cellCount:l}=a,c=Math.ceil(l/4),u=c*4;if(u>n.limits.maxStorageBufferBindingSize)throw new Error(`A ${t.size}³ grid is larger than this GPU's storage buffer limit`);let d=!1;const h=n.lost.then(()=>{throw d=!0,new Error("The GPU device was lost")});h.catch(()=>{});const p=Math.max(1,Math.min(i,Math.floor(fM/u))),g=Math.ceil(c/Mh),v=Math.min(g,n.limits.maxComputeWorkgroupsPerDimension),m=Math.ceil(g/v),f=[],T=y=>{const M=n.createBuffer(y);return f.push(M),M};try{n.pushErrorScope("out-of-memory"),n.pushErrorScope("validation");const{layout:y,pipeline:M}=SM(n)[a.kernel],P=new Uint32Array(16);P.set([t.size,l,c,s?1:0,v*Mh]),P.set(a.params,5);const E=T({size:P.byteLength,usage:GPUBufferUsage.UNIFORM|GPUBufferUsage.COPY_DST});n.queue.writeBuffer(E,0,P);const A=[0,1].map(()=>T({size:u,usage:GPUBufferUsage.STORAGE|GPUBufferUsage.COPY_SRC|GPUBufferUsage.COPY_DST})),R=new Uint8Array(u);R.set(a.initial),n.queue.writeBuffer(A[0],0,R);const w=[0,1].map(Z=>n.createBindGroup({layout:y,entries:[{binding:0,resource:{buffer:E}},{binding:1,resource:{buffer:A[Z]}},{binding:2,resource:{buffer:A[1-Z]}}]})),S=T({size:p*u,usage:GPUBufferUsage.MAP_READ|GPUBufferUsage.COPY_DST}),D=[n.popErrorScope(),n.popErrorScope()],$=(await Promise.all(D)).find(Boolean);if($)throw new Error(`GPU setup failed: ${$.message}`);let k=0,q=t;for(let Z=0;Z<i;){const V=Math.min(p,i-Z);n.pushErrorScope("out-of-memory"),n.pushErrorScope("validation");const se=n.createCommandEncoder();for(let je=0;je<V;je++){const X=se.beginComputePass();X.setPipeline(M),X.setBindGroup(0,w[k]),X.dispatchWorkgroups(v,m),X.end(),k=1-k,se.copyBufferToBuffer(A[k],0,S,je*u,u)}n.queue.submit([se.finish()]);const H=[n.popErrorScope(),n.popErrorScope()],ae=S.mapAsync(GPUMapMode.READ,0,V*u);ae.catch(()=>{}),await Promise.race([ae,h]);const ge=(await Promise.all(H)).find(Boolean);if(d||ge)throw new Error(ge?`GPU step failed: ${ge.message}`:"The GPU device was lost");const Te=new Uint8Array(S.getMappedRange(0,V*u)),$e=[];for(let je=0;je<V;je++)q=a.toGrid(Te.subarray(je*u,je*u+l),q),$e.push(q);S.unmap();for(const je of $e)yield je;Z+=V}}finally{for(const y of f)y.destroy()}}function _M(n,e,t){const i=yM(e,t);return{kernel:"gameOfLife",cellCount:n.data.length,initial:n.data,params:[0,0,0,...i.birth,...i.survival],toGrid(s){const r=new Qt(n.size,0);return r.data.set(s),xM(r),r}}}function vM(n,e){const{size:t}=n;let i=-1;for(const[,r]of n.active)i=Math.max(i,r);const s=new Uint8Array(t*t);if(i>=0)for(let r=0;r<t;r++)for(let o=0;o<t;o++)s[o+r*t]=n.get(o,i,r);return{kernel:"rule30",cellCount:t*t,initial:s,params:[e?1:0],toGrid(r,o){const a=new Qt(t,0);if(i<0||(a.data.set(o.data),a.active=o.active.slice(),i>=t-1))return a;const l=i+1;for(let c=0;c<t;c++)for(let u=0;u<t;u++)r[u+c*t]===1&&(a.data[a._idx(u,l,c)]=1,a.active.push([u,l,c]),i=l);return a}}}function xM(n){const{size:e,data:t}=n,i=e*e,s=[],r=a=>s.push([a%e,Math.floor(a/e)%e,Math.floor(a/i)]),o=new Uint32Array(t.buffer,t.byteOffset,t.length>>2);for(let a=0;a<o.length;a++)if(o[a]!==0)for(let l=a*4;l<a*4+4;l++)t[l]===1&&r(l);for(let a=o.length*4;a<t.length;a++)t[a]===1&&r(a);n.active=s}function xo(n){let e=0;for(const t of n??[])Number.isInteger(t)&&t>=0&&t<32&&(e|=1<<t);return e>>>0}function yM(n,e){const t=n?.survival??[],i={birth:xo(n?.birth??[9,10]),survival:xo(new Set(t).size>0?t:pM)},s=e??{},r=[null,"face","edgeTwoFaces","corner"].map(o=>{const a=o&&s[o];return a?{birth:xo(a.birth),survival:xo(a.survival)}:i});return{birth:r.map(o=>o.birth),survival:r.map(o=>o.survival)}}const wh=new WeakMap;function SM(n){let e=wh.get(n);if(e)return e;const t=(o,a)=>({binding:o,visibility:GPUShaderStage.COMPUTE,buffer:{type:a}}),i=n.createBindGroupLayout({entries:[t(0,"uniform"),t(1,"read-only-storage"),t(2,"storage")]}),s=n.createPipelineLayout({bindGroupLayouts:[i]}),r=(o,a)=>n.createComputePipeline({layout:s,compute:{module:n.createShaderModule({label:o,code:a}),entryPoint:"stepGeneration"}});return e={gameOfLife:{layout:i,pipeline:r("gameOfLife3D.wgsl",dM)},rule30:{layout:i,pipeline:r("rule30.wgsl",hM)}},wh.set(n,e),e}function MM(n,e,t,i){const s=c=>c===0||c===i-1,r=s(n),o=s(e),a=s(t),l=(r?1:0)+(o?1:0)+(a?1:0);return l===0?null:l===3?"corner":l===2?"edgeTwoFaces":l===1?"face":null}function wM(n,{wrapping:e=!0,rules:t=null,boundaryRules:i={}}={}){const s=n.size,r=new Qt(s,0),o=(d,h)=>{const p=d+h;return e?n._wrap(p):Math.max(0,Math.min(s-1,p))},a=new Map;for(const[d,h,p]of n.active){const g=`${d},${h},${p}`;a.set(g,[d,h,p]);for(let v=-1;v<=1;v++)for(let m=-1;m<=1;m++)for(let f=-1;f<=1;f++){const T=o(d,v),y=o(h,m),M=o(p,f);a.set(`${T},${y},${M}`,[T,y,M])}}const l=new Set(t?.birth??[9,10]),c=new Set(t?.survival??[]);i=i??{};const u={};i.corner&&(u.corner={birth:new Set(i.corner.birth),survival:new Set(i.corner.survival)}),i.edgeTwoFaces&&(u.edgeTwoFaces={birth:new Set(i.edgeTwoFaces.birth),survival:new Set(i.edgeTwoFaces.survival)}),i.face&&(u.face={birth:new Set(i.face.birth),survival:new Set(i.face.survival)});for(const[d,h,p]of a.values()){let g=0;for(let y=-1;y<=1;y++)for(let M=-1;M<=1;M++)for(let P=-1;P<=1;P++){if(y===0&&M===0&&P===0)continue;const E=o(d,y),A=o(h,M),R=o(p,P);g+=n.get(E,A,R)}const v=n.get(d,h,p)===1;let m,f=!1,T=null;if(e||(T=MM(d,h,p,s),f=T!==null&&u[T]),f){const y=u[T];v?m=y.survival.has(g)?1:0:m=y.birth.has(g)?1:0}else v?m=c.size>0?c.has(g)?1:0:g>=5&&g<=15?1:0:m=l.has(g)?1:0;m===1&&r.set(d,h,p,1)}return r}async function bM(n,e,t,i=!1,s=!1,r=!1,o=!1,a=null){const l=[];if(r)for(let c=0;c<=e;c++){const u=CM(n,c,e);l.push(u)}else if(o){const c=a?{...a,threshold:4}:{initialSand:0,threshold:4};let u=PM(n,c);l.push(u);const d=Math.floor(n/2);for(let h=0;h<e;h++){const p=h+1,g=u.get(d,d,0);u.data[u._idx(d,d,0)]=Math.min(255,g+1),hr(u);const v=new Qt(n,0);v.data.set(u.data),hr(v),v.generation=p,l.push(v);let m=!0,f=0;const T=n*n*20;let y=!1;for(;m&&f<T;){let M=!1;for(let E=0;E<n;E++){for(let A=0;A<n;A++)if(u.get(E,A,0)===c.threshold){M=!0;break}if(M)break}if(M&&!y){const E=new Qt(n,0);E.data.set(u.data),hr(E),E.generation=p,l.push(E),y=!0}const P=LM(u,c.threshold);m=!1;for(let E=0;E<n;E++){for(let A=0;A<n;A++)if(P.get(E,A,0)!==u.get(E,A,0)){m=!0;break}if(m)break}u=P,f++}f>=T&&console.warn(`Sandpile generation ${h+1} hit max iterations limit`),u.generation=p,l.push(u)}}else{let c=EM(n,t);l.push(c);const u=_.gpuCompute?bp({useRule30:i,useRule30_2D:s,useSineWave:r,useSandpile:o}):null;if(u&&e>0){const d=await hu();if(d&&mM(c)){try{const h={mode:u,seed:c,generations:e,wrapping:_.gridWrapping??!0,rules:_.rules,boundaryRules:_.boundaryRules};for await(const p of gM(d,h))l.push(p)}catch(h){console.warn(`GPU compute stopped after ${l.length-1} generations; continuing on the CPU.`,h)}c=l[l.length-1]}}for(let d=l.length-1;d<e;d++)s?c=RM(c):i?c=AM(c):c=TM(c),l.push(c)}return l}function EM(n,e){const t=new Qt(n,0);return typeof e=="function"&&e(t,n),t}function TM(n){return wM(n,{wrapping:_.gridWrapping??!0,rules:_.rules,boundaryRules:_.boundaryRules})}function AM(n){const e=n.size,t=new Qt(e,0),i=_.gridWrapping??!0,s={111:0,110:0,101:0,100:1,"011":1,"010":1,"001":1,"000":0};let r=-1;for(const[c,u,d]of n.active)r=Math.max(r,u);if(r===-1)return t;for(const[c,u,d]of n.active)t.set(c,u,d,1);if(r>=e-1)return t;const o=r+1,a=r,l=(c,u,d,h)=>{const p=c+h;if(i)return n.get(n._wrap(p),u,d);{const g=Math.max(0,Math.min(e-1,p));return n.get(g,u,d)}};for(let c=0;c<e;c++)for(let u=0;u<e;u++){const d=l(u,a,c,-1),h=n.get(u,a,c),p=l(u,a,c,1),g=`${d}${h}${p}`;(s[g]!==void 0?s[g]:0)===1&&t.set(u,o,c,1)}return t}function RM(n){const e=n.size,t=new Qt(e,0),i=_.gridWrapping??!0,s={111:0,110:0,101:0,100:1,"011":1,"010":1,"001":1,"000":0};let r=-1;for(const[c,u,d]of n.active)r=Math.max(r,u);if(r===-1)return t;for(const[c,u,d]of n.active)t.set(c,u,d,1);if(r>=e-1)return t;const o=r+1,a=r,l=(c,u,d,h,p)=>{const g=c+h,v=d+p;if(i)return n.get(n._wrap(g),u,n._wrap(v));{const m=Math.max(0,Math.min(e-1,g)),f=Math.max(0,Math.min(e-1,v));return n.get(m,u,f)}};for(let c=0;c<e;c++)for(let u=0;u<e;u++){const d=l(u,a,c,-1,-1),h=l(u,a,c,0,-1),p=l(u,a,c,1,-1),g=l(u,a,c,-1,0),v=n.get(u,a,c),m=l(u,a,c,1,0),f=l(u,a,c,-1,1),T=l(u,a,c,0,1),y=l(u,a,c,1,1),M=`${d}${h}${p}`,P=`${g}${v}${m}`,E=`${f}${T}${y}`,A=s[M]??0,R=s[P]??0,w=s[E]??0;((A+w)%2===0?R:R^1)===1&&t.set(u,o,c,1)}return t}function CM(n,e,t){const i=new Qt(n,0),s=2*Math.PI/n,r=(n-1)/2,o=(n-1)/2,a=e/t*2*Math.PI;for(let l=0;l<n;l++){const c=Math.sin(s*l+a),u=Math.round(o+c*r),d=Math.max(0,Math.min(n-1,u));for(let h=0;h<n;h++)i.set(l,d,h,1)}return i}function PM(n,e){const t=new Qt(n,0),{initialSand:i}=e,s=Math.floor(n/2),r=Math.min(255,Math.max(0,i||0));return r>0&&(t.data[t._idx(s,s,0)]=r),hr(t),t}function LM(n,e){const t=n.size,i=new Qt(t,0);for(let l=0;l<t;l++)for(let c=0;c<t;c++){const u=n.get(l,c,0);i.data[i._idx(l,c,0)]=u}const s=[];for(let l=0;l<t;l++)for(let c=0;c<t;c++)i.get(l,c,0)>=e&&s.push([l,c]);const r=_.gridWrapping??!0,o=(l,c)=>{const u=l+c;return r?n._wrap(u):Math.max(0,Math.min(t-1,u))},a=[[0,-1],[0,1],[-1,0],[1,0]];for(const[l,c]of s){const u=i.get(l,c,0);if(u<e)continue;const d=Math.floor(u/e),h=u%e;i.data[i._idx(l,c,0)]=h;for(const[p,g]of a){const v=o(l,p),m=o(c,g),f=i._idx(v,m,0),T=Math.min(255,i.data[f]+d);i.data[f]=T}}return hr(i),i}function hr(n){n.active=[];const e=n.size;for(let t=0;t<e;t++)for(let i=0;i<e;i++){const s=n.get(t,i,0);for(let r=0;r<s;r++)n.active.push([t,i,r])}}const Ep="morpheus-tech-lab.gpuCompute",DM={"no-webgpu":"This browser doesn't have WebGPU, so simulations run on the CPU. Recent Chrome, Edge, Safari and Firefox have it, on a secure page (HTTPS or localhost).","no-adapter":"No GPU adapter was found, so simulations run on the CPU. The browser may have blocklisted the GPU, or hardware acceleration may be turned off.","device-failed":"The GPU failed to start, so simulations run on the CPU. Reloading the page may help."},IM={sineWave:"Sine Wave",sandpile:"Abelian Sandpile"};let Jn=null;function NM(){if(Jn)return;const n=document.getElementById("gpuComputeToggle");n&&(Jn={root:document.getElementById("gpu-compute-control"),button:n,icon:document.getElementById("gpuComputeIcon"),badge:document.getElementById("gpu-compute-badge"),status:document.getElementById("gpu-compute-status"),popover:document.getElementById("gpu-compute-popover")},_.gpuCompute=UM(),n.addEventListener("click",()=>{if(fu()){ll();return}_.gpuCompute=!_.gpuCompute,FM(_.gpuCompute),Fo()}),n.addEventListener("mouseenter",ll),n.addEventListener("mouseleave",ar),n.addEventListener("focus",ll),n.addEventListener("blur",ar),n.addEventListener("keydown",e=>{e.key==="Escape"&&ar()}),document.addEventListener("pointerdown",e=>{Jn.root.contains(e.target)||ar()}),cM(Fo),hu(),Fo())}function Fo(){if(!Jn)return;const{root:n,button:e,icon:t,badge:i,status:s,popover:r}=Jn,o=wp()==="checking",a=fu(),l=!o&&!a&&_.gpuCompute;e.setAttribute("aria-pressed",String(!a&&_.gpuCompute)),e.setAttribute("aria-disabled",String(!!a)),n.classList.toggle("is-unavailable",!!a),t&&(t.style.stroke=l?"#4da3ff":"currentColor"),i.textContent=o?"…":l?"GPU":"CPU",s.textContent=o?"Checking for a GPU.":`The next run computes on the ${l?"GPU":"CPU"}.`,r.textContent=a??"",a||ar()}function fu(){if(_.simulationMode==="contests")return"The contests run on the CPU, in a background thread (a Web Worker), so every entrant runs the same engine: Season 0 is CPU-only. GPU compute covers Game of Life 3D (bounded) and Rule 30.";if(_.simulationMode==="explore")return"Game of Life 3D (unbounded) runs on the CPU, in a background thread (a Web Worker), so the page stays responsive however hard it works. A GPU needs a world of fixed size, and this one grows with the pattern, so it has no GPU path yet. For Game of Life 3D on the GPU, choose Game of Life 3D (bounded).";const n=DM[wp()];return n||(bp(_)?null:`${IM[_.simulationMode]??"This mode"} runs on the CPU only. GPU compute covers Game of Life 3D (bounded) and Rule 30.`)}function ll(){Jn&&fu()&&Jn.root.classList.add("is-open")}function ar(){Jn&&Jn.root.classList.remove("is-open")}function UM(){try{return window.localStorage.getItem(Ep)!=="off"}catch{return!0}}function FM(n){try{window.localStorage.setItem(Ep,n?"on":"off")}catch{}}const bh={type:"change"},pu={type:"start"},Tp={type:"end"},yo=new Pr,Eh=new ai,OM=Math.cos(70*F_.DEG2RAD),Rt=new O,jt=2*Math.PI,dt={NONE:-1,ROTATE:0,DOLLY:1,PAN:2,TOUCH_ROTATE:3,TOUCH_PAN:4,TOUCH_DOLLY_PAN:5,TOUCH_DOLLY_ROTATE:6},cl=1e-6;class Ap extends b0{constructor(e,t=null){super(e,t),this.state=dt.NONE,this.target=new O,this.cursor=new O,this.minDistance=0,this.maxDistance=1/0,this.minZoom=0,this.maxZoom=1/0,this.minTargetRadius=0,this.maxTargetRadius=1/0,this.minPolarAngle=0,this.maxPolarAngle=Math.PI,this.minAzimuthAngle=-1/0,this.maxAzimuthAngle=1/0,this.enableDamping=!1,this.dampingFactor=.05,this.enableZoom=!0,this.zoomSpeed=1,this.enableRotate=!0,this.rotateSpeed=1,this.keyRotateSpeed=1,this.enablePan=!0,this.panSpeed=1,this.screenSpacePanning=!0,this.keyPanSpeed=7,this.zoomToCursor=!1,this.autoRotate=!1,this.autoRotateSpeed=2,this.keys={LEFT:"ArrowLeft",UP:"ArrowUp",RIGHT:"ArrowRight",BOTTOM:"ArrowDown"},this.mouseButtons={LEFT:Es.ROTATE,MIDDLE:Es.DOLLY,RIGHT:Es.PAN},this.touches={ONE:Ms.ROTATE,TWO:Ms.DOLLY_PAN},this.target0=this.target.clone(),this.position0=this.object.position.clone(),this.zoom0=this.object.zoom,this._domElementKeyEvents=null,this._lastPosition=new O,this._lastQuaternion=new $i,this._lastTargetPosition=new O,this._quat=new $i().setFromUnitVectors(e.up,new O(0,1,0)),this._quatInverse=this._quat.clone().invert(),this._spherical=new jd,this._sphericalDelta=new jd,this._scale=1,this._panOffset=new O,this._rotateStart=new Ve,this._rotateEnd=new Ve,this._rotateDelta=new Ve,this._panStart=new Ve,this._panEnd=new Ve,this._panDelta=new Ve,this._dollyStart=new Ve,this._dollyEnd=new Ve,this._dollyDelta=new Ve,this._dollyDirection=new O,this._mouse=new Ve,this._performCursorZoom=!1,this._pointers=[],this._pointerPositions={},this._controlActive=!1,this._onPointerMove=kM.bind(this),this._onPointerDown=BM.bind(this),this._onPointerUp=zM.bind(this),this._onContextMenu=YM.bind(this),this._onMouseWheel=VM.bind(this),this._onKeyDown=$M.bind(this),this._onTouchStart=WM.bind(this),this._onTouchMove=XM.bind(this),this._onMouseDown=GM.bind(this),this._onMouseMove=HM.bind(this),this._interceptControlDown=qM.bind(this),this._interceptControlUp=jM.bind(this),this.domElement!==null&&this.connect(this.domElement),this.update()}connect(e){super.connect(e),this.domElement.addEventListener("pointerdown",this._onPointerDown),this.domElement.addEventListener("pointercancel",this._onPointerUp),this.domElement.addEventListener("contextmenu",this._onContextMenu),this.domElement.addEventListener("wheel",this._onMouseWheel,{passive:!1}),this.domElement.getRootNode().addEventListener("keydown",this._interceptControlDown,{passive:!0,capture:!0}),this.domElement.style.touchAction="none"}disconnect(){this.domElement.removeEventListener("pointerdown",this._onPointerDown),this.domElement.removeEventListener("pointermove",this._onPointerMove),this.domElement.removeEventListener("pointerup",this._onPointerUp),this.domElement.removeEventListener("pointercancel",this._onPointerUp),this.domElement.removeEventListener("wheel",this._onMouseWheel),this.domElement.removeEventListener("contextmenu",this._onContextMenu),this.stopListenToKeyEvents(),this.domElement.getRootNode().removeEventListener("keydown",this._interceptControlDown,{capture:!0}),this.domElement.style.touchAction="auto"}dispose(){this.disconnect()}getPolarAngle(){return this._spherical.phi}getAzimuthalAngle(){return this._spherical.theta}getDistance(){return this.object.position.distanceTo(this.target)}listenToKeyEvents(e){e.addEventListener("keydown",this._onKeyDown),this._domElementKeyEvents=e}stopListenToKeyEvents(){this._domElementKeyEvents!==null&&(this._domElementKeyEvents.removeEventListener("keydown",this._onKeyDown),this._domElementKeyEvents=null)}saveState(){this.target0.copy(this.target),this.position0.copy(this.object.position),this.zoom0=this.object.zoom}reset(){this.target.copy(this.target0),this.object.position.copy(this.position0),this.object.zoom=this.zoom0,this.object.updateProjectionMatrix(),this.dispatchEvent(bh),this.update(),this.state=dt.NONE}update(e=null){const t=this.object.position;Rt.copy(t).sub(this.target),Rt.applyQuaternion(this._quat),this._spherical.setFromVector3(Rt),this.autoRotate&&this.state===dt.NONE&&this._rotateLeft(this._getAutoRotationAngle(e)),this.enableDamping?(this._spherical.theta+=this._sphericalDelta.theta*this.dampingFactor,this._spherical.phi+=this._sphericalDelta.phi*this.dampingFactor):(this._spherical.theta+=this._sphericalDelta.theta,this._spherical.phi+=this._sphericalDelta.phi);let i=this.minAzimuthAngle,s=this.maxAzimuthAngle;isFinite(i)&&isFinite(s)&&(i<-Math.PI?i+=jt:i>Math.PI&&(i-=jt),s<-Math.PI?s+=jt:s>Math.PI&&(s-=jt),i<=s?this._spherical.theta=Math.max(i,Math.min(s,this._spherical.theta)):this._spherical.theta=this._spherical.theta>(i+s)/2?Math.max(i,this._spherical.theta):Math.min(s,this._spherical.theta)),this._spherical.phi=Math.max(this.minPolarAngle,Math.min(this.maxPolarAngle,this._spherical.phi)),this._spherical.makeSafe(),this.enableDamping===!0?this.target.addScaledVector(this._panOffset,this.dampingFactor):this.target.add(this._panOffset),this.target.sub(this.cursor),this.target.clampLength(this.minTargetRadius,this.maxTargetRadius),this.target.add(this.cursor);let r=!1;if(this.zoomToCursor&&this._performCursorZoom||this.object.isOrthographicCamera)this._spherical.radius=this._clampDistance(this._spherical.radius);else{const o=this._spherical.radius;this._spherical.radius=this._clampDistance(this._spherical.radius*this._scale),r=o!=this._spherical.radius}if(Rt.setFromSpherical(this._spherical),Rt.applyQuaternion(this._quatInverse),t.copy(this.target).add(Rt),this.object.lookAt(this.target),this.enableDamping===!0?(this._sphericalDelta.theta*=1-this.dampingFactor,this._sphericalDelta.phi*=1-this.dampingFactor,this._panOffset.multiplyScalar(1-this.dampingFactor)):(this._sphericalDelta.set(0,0,0),this._panOffset.set(0,0,0)),this.zoomToCursor&&this._performCursorZoom){let o=null;if(this.object.isPerspectiveCamera){const a=Rt.length();o=this._clampDistance(a*this._scale);const l=a-o;this.object.position.addScaledVector(this._dollyDirection,l),this.object.updateMatrixWorld(),r=!!l}else if(this.object.isOrthographicCamera){const a=new O(this._mouse.x,this._mouse.y,0);a.unproject(this.object);const l=this.object.zoom;this.object.zoom=Math.max(this.minZoom,Math.min(this.maxZoom,this.object.zoom/this._scale)),this.object.updateProjectionMatrix(),r=l!==this.object.zoom;const c=new O(this._mouse.x,this._mouse.y,0);c.unproject(this.object),this.object.position.sub(c).add(a),this.object.updateMatrixWorld(),o=Rt.length()}else console.warn("WARNING: OrbitControls.js encountered an unknown camera type - zoom to cursor disabled."),this.zoomToCursor=!1;o!==null&&(this.screenSpacePanning?this.target.set(0,0,-1).transformDirection(this.object.matrix).multiplyScalar(o).add(this.object.position):(yo.origin.copy(this.object.position),yo.direction.set(0,0,-1).transformDirection(this.object.matrix),Math.abs(this.object.up.dot(yo.direction))<OM?this.object.lookAt(this.target):(Eh.setFromNormalAndCoplanarPoint(this.object.up,this.target),yo.intersectPlane(Eh,this.target))))}else if(this.object.isOrthographicCamera){const o=this.object.zoom;this.object.zoom=Math.max(this.minZoom,Math.min(this.maxZoom,this.object.zoom/this._scale)),o!==this.object.zoom&&(this.object.updateProjectionMatrix(),r=!0)}return this._scale=1,this._performCursorZoom=!1,r||this._lastPosition.distanceToSquared(this.object.position)>cl||8*(1-this._lastQuaternion.dot(this.object.quaternion))>cl||this._lastTargetPosition.distanceToSquared(this.target)>cl?(this.dispatchEvent(bh),this._lastPosition.copy(this.object.position),this._lastQuaternion.copy(this.object.quaternion),this._lastTargetPosition.copy(this.target),!0):!1}_getAutoRotationAngle(e){return e!==null?jt/60*this.autoRotateSpeed*e:jt/60/60*this.autoRotateSpeed}_getZoomScale(e){const t=Math.abs(e*.01);return Math.pow(.95,this.zoomSpeed*t)}_rotateLeft(e){this._sphericalDelta.theta-=e}_rotateUp(e){this._sphericalDelta.phi-=e}_panLeft(e,t){Rt.setFromMatrixColumn(t,0),Rt.multiplyScalar(-e),this._panOffset.add(Rt)}_panUp(e,t){this.screenSpacePanning===!0?Rt.setFromMatrixColumn(t,1):(Rt.setFromMatrixColumn(t,0),Rt.crossVectors(this.object.up,Rt)),Rt.multiplyScalar(e),this._panOffset.add(Rt)}_pan(e,t){const i=this.domElement;if(this.object.isPerspectiveCamera){const s=this.object.position;Rt.copy(s).sub(this.target);let r=Rt.length();r*=Math.tan(this.object.fov/2*Math.PI/180),this._panLeft(2*e*r/i.clientHeight,this.object.matrix),this._panUp(2*t*r/i.clientHeight,this.object.matrix)}else this.object.isOrthographicCamera?(this._panLeft(e*(this.object.right-this.object.left)/this.object.zoom/i.clientWidth,this.object.matrix),this._panUp(t*(this.object.top-this.object.bottom)/this.object.zoom/i.clientHeight,this.object.matrix)):(console.warn("WARNING: OrbitControls.js encountered an unknown camera type - pan disabled."),this.enablePan=!1)}_dollyOut(e){this.object.isPerspectiveCamera||this.object.isOrthographicCamera?this._scale/=e:(console.warn("WARNING: OrbitControls.js encountered an unknown camera type - dolly/zoom disabled."),this.enableZoom=!1)}_dollyIn(e){this.object.isPerspectiveCamera||this.object.isOrthographicCamera?this._scale*=e:(console.warn("WARNING: OrbitControls.js encountered an unknown camera type - dolly/zoom disabled."),this.enableZoom=!1)}_updateZoomParameters(e,t){if(!this.zoomToCursor)return;this._performCursorZoom=!0;const i=this.domElement.getBoundingClientRect(),s=e-i.left,r=t-i.top,o=i.width,a=i.height;this._mouse.x=s/o*2-1,this._mouse.y=-(r/a)*2+1,this._dollyDirection.set(this._mouse.x,this._mouse.y,1).unproject(this.object).sub(this.object.position).normalize()}_clampDistance(e){return Math.max(this.minDistance,Math.min(this.maxDistance,e))}_handleMouseDownRotate(e){this._rotateStart.set(e.clientX,e.clientY)}_handleMouseDownDolly(e){this._updateZoomParameters(e.clientX,e.clientX),this._dollyStart.set(e.clientX,e.clientY)}_handleMouseDownPan(e){this._panStart.set(e.clientX,e.clientY)}_handleMouseMoveRotate(e){this._rotateEnd.set(e.clientX,e.clientY),this._rotateDelta.subVectors(this._rotateEnd,this._rotateStart).multiplyScalar(this.rotateSpeed);const t=this.domElement;this._rotateLeft(jt*this._rotateDelta.x/t.clientHeight),this._rotateUp(jt*this._rotateDelta.y/t.clientHeight),this._rotateStart.copy(this._rotateEnd),this.update()}_handleMouseMoveDolly(e){this._dollyEnd.set(e.clientX,e.clientY),this._dollyDelta.subVectors(this._dollyEnd,this._dollyStart),this._dollyDelta.y>0?this._dollyOut(this._getZoomScale(this._dollyDelta.y)):this._dollyDelta.y<0&&this._dollyIn(this._getZoomScale(this._dollyDelta.y)),this._dollyStart.copy(this._dollyEnd),this.update()}_handleMouseMovePan(e){this._panEnd.set(e.clientX,e.clientY),this._panDelta.subVectors(this._panEnd,this._panStart).multiplyScalar(this.panSpeed),this._pan(this._panDelta.x,this._panDelta.y),this._panStart.copy(this._panEnd),this.update()}_handleMouseWheel(e){this._updateZoomParameters(e.clientX,e.clientY),e.deltaY<0?this._dollyIn(this._getZoomScale(e.deltaY)):e.deltaY>0&&this._dollyOut(this._getZoomScale(e.deltaY)),this.update()}_handleKeyDown(e){let t=!1;switch(e.code){case this.keys.UP:e.ctrlKey||e.metaKey||e.shiftKey?this.enableRotate&&this._rotateUp(jt*this.keyRotateSpeed/this.domElement.clientHeight):this.enablePan&&this._pan(0,this.keyPanSpeed),t=!0;break;case this.keys.BOTTOM:e.ctrlKey||e.metaKey||e.shiftKey?this.enableRotate&&this._rotateUp(-jt*this.keyRotateSpeed/this.domElement.clientHeight):this.enablePan&&this._pan(0,-this.keyPanSpeed),t=!0;break;case this.keys.LEFT:e.ctrlKey||e.metaKey||e.shiftKey?this.enableRotate&&this._rotateLeft(jt*this.keyRotateSpeed/this.domElement.clientHeight):this.enablePan&&this._pan(this.keyPanSpeed,0),t=!0;break;case this.keys.RIGHT:e.ctrlKey||e.metaKey||e.shiftKey?this.enableRotate&&this._rotateLeft(-jt*this.keyRotateSpeed/this.domElement.clientHeight):this.enablePan&&this._pan(-this.keyPanSpeed,0),t=!0;break}t&&(e.preventDefault(),this.update())}_handleTouchStartRotate(e){if(this._pointers.length===1)this._rotateStart.set(e.pageX,e.pageY);else{const t=this._getSecondPointerPosition(e),i=.5*(e.pageX+t.x),s=.5*(e.pageY+t.y);this._rotateStart.set(i,s)}}_handleTouchStartPan(e){if(this._pointers.length===1)this._panStart.set(e.pageX,e.pageY);else{const t=this._getSecondPointerPosition(e),i=.5*(e.pageX+t.x),s=.5*(e.pageY+t.y);this._panStart.set(i,s)}}_handleTouchStartDolly(e){const t=this._getSecondPointerPosition(e),i=e.pageX-t.x,s=e.pageY-t.y,r=Math.sqrt(i*i+s*s);this._dollyStart.set(0,r)}_handleTouchStartDollyPan(e){this.enableZoom&&this._handleTouchStartDolly(e),this.enablePan&&this._handleTouchStartPan(e)}_handleTouchStartDollyRotate(e){this.enableZoom&&this._handleTouchStartDolly(e),this.enableRotate&&this._handleTouchStartRotate(e)}_handleTouchMoveRotate(e){if(this._pointers.length==1)this._rotateEnd.set(e.pageX,e.pageY);else{const i=this._getSecondPointerPosition(e),s=.5*(e.pageX+i.x),r=.5*(e.pageY+i.y);this._rotateEnd.set(s,r)}this._rotateDelta.subVectors(this._rotateEnd,this._rotateStart).multiplyScalar(this.rotateSpeed);const t=this.domElement;this._rotateLeft(jt*this._rotateDelta.x/t.clientHeight),this._rotateUp(jt*this._rotateDelta.y/t.clientHeight),this._rotateStart.copy(this._rotateEnd)}_handleTouchMovePan(e){if(this._pointers.length===1)this._panEnd.set(e.pageX,e.pageY);else{const t=this._getSecondPointerPosition(e),i=.5*(e.pageX+t.x),s=.5*(e.pageY+t.y);this._panEnd.set(i,s)}this._panDelta.subVectors(this._panEnd,this._panStart).multiplyScalar(this.panSpeed),this._pan(this._panDelta.x,this._panDelta.y),this._panStart.copy(this._panEnd)}_handleTouchMoveDolly(e){const t=this._getSecondPointerPosition(e),i=e.pageX-t.x,s=e.pageY-t.y,r=Math.sqrt(i*i+s*s);this._dollyEnd.set(0,r),this._dollyDelta.set(0,Math.pow(this._dollyEnd.y/this._dollyStart.y,this.zoomSpeed)),this._dollyOut(this._dollyDelta.y),this._dollyStart.copy(this._dollyEnd);const o=(e.pageX+t.x)*.5,a=(e.pageY+t.y)*.5;this._updateZoomParameters(o,a)}_handleTouchMoveDollyPan(e){this.enableZoom&&this._handleTouchMoveDolly(e),this.enablePan&&this._handleTouchMovePan(e)}_handleTouchMoveDollyRotate(e){this.enableZoom&&this._handleTouchMoveDolly(e),this.enableRotate&&this._handleTouchMoveRotate(e)}_addPointer(e){this._pointers.push(e.pointerId)}_removePointer(e){delete this._pointerPositions[e.pointerId];for(let t=0;t<this._pointers.length;t++)if(this._pointers[t]==e.pointerId){this._pointers.splice(t,1);return}}_isTrackingPointer(e){for(let t=0;t<this._pointers.length;t++)if(this._pointers[t]==e.pointerId)return!0;return!1}_trackPointer(e){let t=this._pointerPositions[e.pointerId];t===void 0&&(t=new Ve,this._pointerPositions[e.pointerId]=t),t.set(e.pageX,e.pageY)}_getSecondPointerPosition(e){const t=e.pointerId===this._pointers[0]?this._pointers[1]:this._pointers[0];return this._pointerPositions[t]}_customWheelEvent(e){const t=e.deltaMode,i={clientX:e.clientX,clientY:e.clientY,deltaY:e.deltaY};switch(t){case 1:i.deltaY*=16;break;case 2:i.deltaY*=100;break}return e.ctrlKey&&!this._controlActive&&(i.deltaY*=10),i}}function BM(n){this.enabled!==!1&&(this._pointers.length===0&&(this.domElement.setPointerCapture(n.pointerId),this.domElement.addEventListener("pointermove",this._onPointerMove),this.domElement.addEventListener("pointerup",this._onPointerUp)),!this._isTrackingPointer(n)&&(this._addPointer(n),n.pointerType==="touch"?this._onTouchStart(n):this._onMouseDown(n)))}function kM(n){this.enabled!==!1&&(n.pointerType==="touch"?this._onTouchMove(n):this._onMouseMove(n))}function zM(n){switch(this._removePointer(n),this._pointers.length){case 0:this.domElement.releasePointerCapture(n.pointerId),this.domElement.removeEventListener("pointermove",this._onPointerMove),this.domElement.removeEventListener("pointerup",this._onPointerUp),this.dispatchEvent(Tp),this.state=dt.NONE;break;case 1:const e=this._pointers[0],t=this._pointerPositions[e];this._onTouchStart({pointerId:e,pageX:t.x,pageY:t.y});break}}function GM(n){let e;switch(n.button){case 0:e=this.mouseButtons.LEFT;break;case 1:e=this.mouseButtons.MIDDLE;break;case 2:e=this.mouseButtons.RIGHT;break;default:e=-1}switch(e){case Es.DOLLY:if(this.enableZoom===!1)return;this._handleMouseDownDolly(n),this.state=dt.DOLLY;break;case Es.ROTATE:if(n.ctrlKey||n.metaKey||n.shiftKey){if(this.enablePan===!1)return;this._handleMouseDownPan(n),this.state=dt.PAN}else{if(this.enableRotate===!1)return;this._handleMouseDownRotate(n),this.state=dt.ROTATE}break;case Es.PAN:if(n.ctrlKey||n.metaKey||n.shiftKey){if(this.enableRotate===!1)return;this._handleMouseDownRotate(n),this.state=dt.ROTATE}else{if(this.enablePan===!1)return;this._handleMouseDownPan(n),this.state=dt.PAN}break;default:this.state=dt.NONE}this.state!==dt.NONE&&this.dispatchEvent(pu)}function HM(n){switch(this.state){case dt.ROTATE:if(this.enableRotate===!1)return;this._handleMouseMoveRotate(n);break;case dt.DOLLY:if(this.enableZoom===!1)return;this._handleMouseMoveDolly(n);break;case dt.PAN:if(this.enablePan===!1)return;this._handleMouseMovePan(n);break}}function VM(n){this.enabled===!1||this.enableZoom===!1||this.state!==dt.NONE||(n.preventDefault(),this.dispatchEvent(pu),this._handleMouseWheel(this._customWheelEvent(n)),this.dispatchEvent(Tp))}function $M(n){this.enabled!==!1&&this._handleKeyDown(n)}function WM(n){switch(this._trackPointer(n),this._pointers.length){case 1:switch(this.touches.ONE){case Ms.ROTATE:if(this.enableRotate===!1)return;this._handleTouchStartRotate(n),this.state=dt.TOUCH_ROTATE;break;case Ms.PAN:if(this.enablePan===!1)return;this._handleTouchStartPan(n),this.state=dt.TOUCH_PAN;break;default:this.state=dt.NONE}break;case 2:switch(this.touches.TWO){case Ms.DOLLY_PAN:if(this.enableZoom===!1&&this.enablePan===!1)return;this._handleTouchStartDollyPan(n),this.state=dt.TOUCH_DOLLY_PAN;break;case Ms.DOLLY_ROTATE:if(this.enableZoom===!1&&this.enableRotate===!1)return;this._handleTouchStartDollyRotate(n),this.state=dt.TOUCH_DOLLY_ROTATE;break;default:this.state=dt.NONE}break;default:this.state=dt.NONE}this.state!==dt.NONE&&this.dispatchEvent(pu)}function XM(n){switch(this._trackPointer(n),this.state){case dt.TOUCH_ROTATE:if(this.enableRotate===!1)return;this._handleTouchMoveRotate(n),this.update();break;case dt.TOUCH_PAN:if(this.enablePan===!1)return;this._handleTouchMovePan(n),this.update();break;case dt.TOUCH_DOLLY_PAN:if(this.enableZoom===!1&&this.enablePan===!1)return;this._handleTouchMoveDollyPan(n),this.update();break;case dt.TOUCH_DOLLY_ROTATE:if(this.enableZoom===!1&&this.enableRotate===!1)return;this._handleTouchMoveDollyRotate(n),this.update();break;default:this.state=dt.NONE}}function YM(n){this.enabled!==!1&&n.preventDefault()}function qM(n){n.key==="Control"&&(this._controlActive=!0,this.domElement.getRootNode().addEventListener("keyup",this._interceptControlUp,{passive:!0,capture:!0}))}function jM(n){n.key==="Control"&&(this._controlActive=!1,this.domElement.getRootNode().removeEventListener("keyup",this._interceptControlUp,{passive:!0,capture:!0}))}function mu(){const n=_.sim_size,e=new up;e.background=new Pe(1315860);const t=new mp(16777215,.7);t.position.set(1,1,2),e.add(t),e.add(new gp(16777215,.4)),_.scene=e;let i=_.renderer;i||(i=new aM({antialias:!0}),document.body.appendChild(i.domElement),_.renderer=i,window.addEventListener("resize",()=>{r.aspect=window.innerWidth/window.innerHeight,r.updateProjectionMatrix(),i.setSize(window.innerWidth,window.innerHeight)})),i.setSize(window.innerWidth,window.innerHeight);const s=i.domElement;s.style.position="absolute",s.style.top="0px",s.style.left="0px",s.style.zIndex="0";const r=new on(75,window.innerWidth/window.innerHeight,.1,1e3);r.position.set(n*1.2,n*1.2,n*1.2);const o=new Ap(r,i.domElement);_.camera=r,_.controls=o}function KM(){return new Worker(new URL("/assets/run.worker-Cf1k0G9n.js",import.meta.url),{type:"module"})}class ua{constructor({onStats:e,onState:t,onReplayed:i,onError:s,createWorker:r=KM}={}){this.onStats=e??(()=>{}),this.onState=t??(()=>{}),this.onReplayed=i??(()=>{}),this.onError=s??(()=>{}),this.createWorker=r,this.worker=null,this.pending=new Map,this.nextId=1}start({world:e,seed:t,run:i,generations:s,from:r}){this.close();const o=this.createWorker();o.onmessage=l=>this.receive(l.data),o.onerror=l=>this.onError(l?.message??"The engine Worker failed."),this.worker=o;const a={type:"start",world:e,seed:t,run:i};s!==void 0&&(a.generations=s),r!==void 0&&(a.from=r),o.postMessage(a,t?.buffer?[t.buffer]:[])}pause(){this.send({type:"pause"})}resume(){this.send({type:"resume"})}step(){this.send({type:"step"})}setRate(e){this.send({type:"rate",rate:e})}stop(){this.send({type:"stop"})}seek(e){if(!this.worker)return Promise.reject(new Error("There is no run."));const t=this.nextId++;return new Promise((i,s)=>{this.pending.set(t,{resolve:i,reject:s}),this.send({type:"seek",id:t,generation:e})})}snapshot({budget:e,slice:t,stats:i}={}){if(!this.worker)return Promise.reject(new Error("There is no run to snapshot."));const s=this.nextId++;return new Promise((r,o)=>{this.pending.set(s,{resolve:r,reject:o});const a={type:"snapshot",id:s};e!==void 0&&(a.budget=e),t&&(a.slice=t),i&&(a.stats=!0),this.send(a)})}cycle({budget:e}={}){if(!this.worker)return Promise.reject(new Error("There is no run."));const t=this.nextId++;return new Promise((i,s)=>{this.pending.set(t,{resolve:i,reject:s}),this.send({type:"cycle",id:t,budget:e})})}history(){if(!this.worker)return Promise.reject(new Error("There is no run."));const e=this.nextId++;return new Promise((t,i)=>{this.pending.set(e,{resolve:t,reject:i}),this.send({type:"history",id:e})})}result({run:e,score:t,details:i}){if(!this.worker)return Promise.reject(new Error("There is no run."));const s=this.nextId++;return new Promise((r,o)=>{this.pending.set(s,{resolve:r,reject:o});const a={type:"result",id:s,run:e};t!==void 0&&(a.score=t),i!==void 0&&(a.details=i),this.send(a)})}close(){if(this.worker){this.worker.terminate(),this.worker=null;for(const{reject:e}of this.pending.values())e(new Error("The run was closed."));this.pending.clear()}}send(e){if(!this.worker){this.onError("There is no run.");return}this.worker.postMessage(e)}receive(e){switch(e.type){case"stats":return this.onStats(e.stats);case"state":return this.onState(e.state,e.stats,e.reason,e.cycle,e.departures);case"result":return this.settle(e.id,t=>t.resolve(e.result));case"seeked":return this.settle(e.id,t=>t.resolve(e.superseded?{generation:e.generation,superseded:!0}:{generation:e.generation}));case"replayed":{const{type:t,...i}=e;return this.onReplayed(i)}case"cycle":case"history":case"snapshot":return this.settle(e.id,t=>{const{type:i,id:s,...r}=e;t.resolve(r)});case"error":return e.id!==void 0&&this.pending.has(e.id)?this.settle(e.id,t=>t.reject(new Error(e.message))):this.onError(e.message)}}settle(e,t){const i=this.pending.get(e);i&&(this.pending.delete(e),t(i))}}const ZM=1.25,Th=30;function JM(n,e,t){if(!n)return{centre:[0,0,0],radius:0,distance:Th};const i=[0,1,2].map(u=>(n.min[u]+n.max[u])/2),s=[0,1,2].map(u=>(n.max[u]-n.min[u])/2+.5),r=Math.hypot(...s),o=e*Math.PI/360,a=Math.atan(Math.tan(o)*t),l=Math.min(o,a),c=Math.max(Th,ZM*r/Math.sin(l));return{centre:i,radius:r,distance:c}}function So(n,e,t,i=250){return e+(n-e)*.5**(t/i)}const Bs=3e5,oi=[0,180/255,200/255],Mo=[200/255,20/255,0];class Rp{constructor(e){this.group=new mi,e.add(this.group),this.material=new Lr({size:1.2,vertexColors:!0,sizeAttenuation:!0}),this.points=new uu(new Ot,this.material),this.points.frustumCulled=!1,this.capacity=0,this.grow(0),this.group.add(this.points),this.boxGeometry=new an(1,1,1),this.boxMaterial=new oa({transparent:!0,opacity:.45,depthWrite:!1}),this.boxes=null,this.arena=null,this.grid=null,this.gridKey=null,this.box=null,this.drawing="cells"}show(e){e.cells?this.drawCells(e.cells):this.drawChunks(e.chunks,e.chunkSize)}drawCells(e){const t=e.length/3;this.drawing="cells",this.box=Ah(e,3),t>this.capacity&&this.grow(t);const i=this.points.geometry,s=i.attributes.position.array,r=i.attributes.color.array,{min:o,max:a}=this.box??{min:[0,0,0],max:[0,0,0]},l=Math.max(1,a[0]-o[0]),c=Math.max(1,a[2]-o[2]);for(let u=0;u<e.length;u+=3){const d=e[u],h=e[u+1],p=e[u+2];s[u]=d,s[u+1]=h,s[u+2]=p;const g=(d-o[0])/l,v=.45*((p-o[2])/c);for(let m=0;m<3;m++){const f=oi[m]+(Mo[m]-oi[m])*g;r[u+m]=f+(1-f)*v}}i.setDrawRange(0,t),i.attributes.position.needsUpdate=!0,i.attributes.color.needsUpdate=!0,this.points.visible=!0,this.boxes&&(this.boxes.visible=!1)}drawChunks(e,t){const i=e.length/4;this.drawing="chunks";const s=Ah(e,4);this.box=s&&{min:s.min,max:s.max.map(d=>d+t-1)},(!this.boxes||this.boxes.instanceMatrix.count<i)&&this.growBoxes(i);const r=new rt,o=new Pe,a=t*t*t,{min:l,max:c}=this.box??{min:[0,0,0],max:[0,0,0]},u=Math.max(1,c[0]-l[0]);for(let d=0,h=0;d<e.length;d+=4,h++){const p=e[d],g=e[d+1],v=e[d+2];r.makeScale(t,t,t).setPosition(p+(t-1)/2,g+(t-1)/2,v+(t-1)/2),this.boxes.setMatrixAt(h,r);const m=(p-l[0])/u,f=Math.min(1,e[d+3]/a),T=.35+.65*Math.sqrt(f);o.setRGB((oi[0]+(Mo[0]-oi[0])*m)*T,(oi[1]+(Mo[1]-oi[1])*m)*T,(oi[2]+(Mo[2]-oi[2])*m)*T),this.boxes.setColorAt(h,o)}this.boxes.count=i,this.boxes.instanceMatrix.needsUpdate=!0,this.boxes.instanceColor&&(this.boxes.instanceColor.needsUpdate=!0),this.boxes.visible=!0,this.points.visible=!1}showArena(e,{wrap:t=!1,walls:i=!1}={}){if(this.arena&&(this.group.remove(this.arena),this.arena.geometry.dispose(),this.arena.material.dispose(),this.arena=null),!e)return;const s=[0,1,2].map(l=>e.max[l]-e.min[l]+1),r=new aa(new an(...s)),o=Math.max(...s)/32,a=t?new x0({color:16777215,transparent:!0,opacity:.45,dashSize:o,gapSize:o}):new Qn({color:16777215,transparent:!0,opacity:i?.8:.35});this.arena=new Xi(r,a),t&&this.arena.computeLineDistances(),this.arena.position.set(...[0,1,2].map(l=>(e.min[l]+e.max[l])/2)),this.group.add(this.arena)}showGrid(e,t,i){const s=t&&t.min.map(h=>Math.floor(h/i)*i-.5),r=t&&t.max.map(h=>(Math.floor(h/i)+1)*i-.5),o=e&&t?`${s},${r}`:null;if(o===this.gridKey||(this.gridKey=o,this.grid&&(this.group.remove(this.grid),this.grid.geometry.dispose(),this.grid.material.dispose(),this.grid=null),!o))return;const a=[],l=(h,p)=>a.push(...h,...p);for(const h of[s[1],r[1]]){for(const p of[s[2],r[2]])l([s[0],h,p],[r[0],h,p]);for(const p of[s[0],r[0]])l([p,h,s[2]],[p,h,r[2]])}for(const h of[s[0],r[0]])for(const p of[s[2],r[2]])l([h,s[1],p],[h,r[1],p]);let c=i;for(;(r[0]-s[0])/c>200||(r[2]-s[2])/c>200;)c*=2;for(let h=s[0]+c;h<r[0];h+=c)l([h,s[1],s[2]],[h,s[1],r[2]]);for(let h=s[2]+c;h<r[2];h+=c)l([s[0],s[1],h],[r[0],s[1],h]);const u=new Ot;u.setAttribute("position",new cn(a,3));const d=new Qn({color:16777215,transparent:!0,opacity:.25});this.grid=new Xi(u,d),this.grid.frustumCulled=!1,this.group.add(this.grid)}frame({camera:e,controls:t,elapsedMs:i,follow:s,cellSize:r,flip:o}){if(this.material.size=r,this.group.scale.y=o?-1:1,!s||!e||!t)return;const{centre:a,radius:l,distance:c}=JM(this.box,e.fov,e.aspect);o&&(a[1]=-a[1]);const u=t.target,d=e.position.clone().sub(u),h=d.length()||1;u.set(So(u.x,a[0],i),So(u.y,a[1],i),So(u.z,a[2],i));const p=So(h,c,i);e.position.copy(u).add(d.multiplyScalar(p/h)),e.lookAt(u);const g=Math.max(1e3,4*(p+l));Math.abs(e.far-g)>.1*g&&(e.far=g,e.updateProjectionMatrix())}dispose(){this.points.geometry.dispose(),this.material.dispose(),this.boxGeometry.dispose(),this.boxMaterial.dispose(),this.boxes?.dispose(),this.showArena(null),this.showGrid(!1,null,1),this.group.removeFromParent()}grow(e){this.capacity=Math.max(e,2*this.capacity,4096);const t=new Ot;t.setAttribute("position",new Ut(new Float32Array(3*this.capacity),3)),t.setAttribute("color",new Ut(new Float32Array(3*this.capacity),3)),this.points.geometry.dispose(),this.points.geometry=t}growBoxes(e){const t=Math.max(e,2*(this.boxes?.instanceMatrix.count??0),256);this.boxes&&(this.group.remove(this.boxes),this.boxes.dispose()),this.boxes=new dp(this.boxGeometry,this.boxMaterial,t),this.boxes.frustumCulled=!1,this.group.add(this.boxes)}}function Ah(n,e){if(!n.length)return null;const t=[1/0,1/0,1/0],i=[-1/0,-1/0,-1/0];for(let s=0;s<n.length;s+=e)for(let r=0;r<3;r++){const o=n[s+r];o<t[r]&&(t[r]=o),o>i[r]&&(i[r]=o)}return{min:t,max:i}}const Cp="game-of-life-3d-seed.json",QM="game-of-life-3d-simulation.json";function ew(n){return`game-of-life-3d-generation-${n}.json`}function tw(n){const e=n.seed??n.cells,t=new Array(e.length/3);for(let i=0;i<t.length;i++)t[i]=[e[3*i],e[3*i+1],e[3*i+2]];return{contest:null,rules:n.rules,seed:t,arena:Tr(n.arena),limits:{cells:null,extent:null,generations:null}}}function nw(n,e){return n==="ended"&&ko.includes(e)?e:"stopped"}function iw(n){return n?`${n===1?"A ship has":`${n.toLocaleString("en")} ships have`} left the arena by this generation, and a saved generation can't record that ships leave at the edge, so its replay wouldn't reach it. Restart and save before the first one leaves; Save simulation still saves the seed and its rules.`:null}const sw="This run's arena wraps around, and a saved generation can't record that, so its replay wouldn't reach this generation: no contest wraps. Save simulation still saves the seed and its rules.",rw="This run's arena has walls, with their own corner, edge and face rules, and a saved generation can't record them, so its replay wouldn't reach this generation: no contest has walls. Save simulation still saves the seed and its rules.";async function ow({config:n,generation:e,cells:t,ending:i,stats:s=null,chunkSize:r=null,browser:o=null}){const a=t.length/3;if(a>Nn)throw new Xe(`Generation ${e.toLocaleString("en")} has ${a.toLocaleString("en")} live cells; a saved generation holds at most ${Nn.toLocaleString("en")}.`);const l=await rg({run:tw(n),generation:e,cells:t,ending:i,details:{chunkSize:r,elapsedMs:s?.elapsedMs??null,stats:uw(s),browser:o},withCells:!0});return{result:l,text:Hc(l)}}function aw(n){return Xc({cells:n.seed??n.cells})}function lw(n){return Xc({rules:n.rules,cells:n.seed??n.cells})}async function cw(n){let e;try{e=ta(n)}catch(r){throw r instanceof Le?new Xe(r.message):r}if(!e.cells)throw new Xe("This result file doesn't hold its generation's cells, so Game of Life 3D (unbounded) can't start from it. Files from Save this generation do.");const t=await og(e);if(t)throw new Xe(t);const{run:i}=e;if(i.limits.cells!==null||i.limits.extent!==null||i.limits.generations!==null)throw new Xe("This run has cell, extent or generation limits, which Game of Life 3D (unbounded) doesn't keep, so it can't carry on here.");let s=null;if(i.arena){s=i.arena.max[0]-i.arena.min[0]+1;const r=Tr(s);if(![0,1,2].every(a=>i.arena.min[a]===r.min[a]&&i.arena.max[a]===r.max[a]))throw new Xe("This run's arena isn't a cube centred on the origin, the only arena Game of Life 3D (unbounded) has.")}if(e.cells.length/3>Nn)throw new Xe(`This generation has more than ${Nn.toLocaleString("en")} live cells, the most Game of Life 3D (unbounded) loads.`);return{rules:i.rules,cells:Int32Array.from(e.cells.flat()),seed:Int32Array.from(i.seed.flat()),from:e.generation,arena:s,hash:e.hash}}async function Pp(n){return/"format"\s*:\s*"([^"]*)"/.exec(n.slice(0,4096))?.[1]===Bo?{kind:"generation",...await cw(n)}:{kind:"seed",...Ef(n)}}function uw(n){if(!n)return n;const{departed:e,lastDeparture:t,...i}=n;return i}const ne=n=>Math.round(n).toLocaleString("en");function $s({birth:n,survival:e}){return`B${Rh(n)||"–"}/S${Rh(e)||"–"}`}function Rh(n){const e=[];for(let t=0;t<n.length;){let i=t;for(;i+1<n.length&&n[i+1]===n[i]+1;)i++;e.push(i>t?`${n[t]}-${n[i]}`:String(n[t])),t=i+1}return e.join(",")}function Lp(n,e){const t=Math.min(n,Math.max(0,n-e/1e3));return(Math.floor(t*10)/10).toFixed(1)}function Ch(n){if(!(n>0))return{top:5,step:1};const e=n/5,t=10**Math.floor(Math.log10(e));let i=t;for(const s of[1,2,5,10])if(i=s*t,i*5>=n)break;return i=Math.max(1,i),{top:Math.ceil(n/i)*i,step:i}}const dw=Object.freeze({top:14,right:48,bottom:42,left:60});function hw(n,{seconds:e,width:t,height:i,floor:s=0}){const r=dw,o={left:r.left,top:r.top,right:t-r.right,bottom:i-r.bottom},a=o.right-o.left,l=o.bottom-o.top,{top:c,step:u}=Ch(Math.max(0,s,...n.map(([,y])=>y))),d=e!==void 0?{top:e,step:1}:Ch(Math.max(0,...n.map(([y])=>y))),h=y=>o.left+Math.min(Math.max(y,0),d.top)/d.top*a,p=y=>o.bottom-y/c*l,g=y=>+y.toFixed(1),v=[];for(let y=0;y<=d.top;y+=d.step)v.push({value:y,label:ne(y),at:g(h(y))});const m=[];for(let y=0;y<=c;y+=u)m.push({value:y,label:ne(y),at:g(p(y))});const f=n.map(([y,M])=>[g(h(y)),g(p(M))]),T=f[f.length-1];return{plot:o,xTicks:v,yTicks:m,place:([y,M])=>[g(h(y)),g(p(M))],line:f.map(([y,M])=>`${y},${M}`).join(" "),area:f.length?`M${f[0][0]},${o.bottom} ${f.map(([y,M])=>`L${y},${M}`).join(" ")} L${T[0]},${o.bottom} Z`:"",end:T?{x:T[0],y:T[1],label:ne(n[n.length-1][1])}:null,nearest(y){let M=-1,P=1/0;return f.forEach(([E],A)=>{const R=Math.abs(E-y);R<=P&&(M=A,P=R)}),M<0?null:{index:M,x:f[M][0],y:f[M][1],at:n[M][0],value:n[M][1]}}}}function fw(n){const e=n%100,t=e>=11&&e<=13?"th":{1:"st",2:"nd",3:"rd"}[n%10]??"th";return`${ne(n)}${t}`}function pw(n,e){return e===1?"You'd be the first in the Hall of Fame":`You'd place ${fw(n)} of ${ne(e)}`}const nr=Object.freeze({left:16,right:16,top:22,bottom:20});function mw(n,e,{width:t,height:i}){const s=[...n,e];let r=Math.min(...s),o=Math.max(...s);r===o&&(r-=1,o+=1);const a=nr.left,l=t-nr.right,c=u=>+(a+(u-r)/(o-r)*(l-a)).toFixed(1);return{y:nr.top+(i-nr.top-nr.bottom)/2,left:a,right:l,low:{x:a,label:ne(Math.min(...s))},high:{x:l,label:ne(Math.max(...s))},dots:n.map(c),mine:c(e)}}function gw(n,e){const t=n.details?.timeline;if(t)return{points:t.map(([r,o])=>[r/1e3,o])};const{generations:i,ms:s}=n.score;return{mark:[s===null?e.seconds:s/1e3,i]}}function Dp(n){return n.points?n.points[n.points.length-1][1]:n.mark[1]}function _w(n,e){const{points:t}=n;if(e<=t[0][0])return t[0][1];for(let i=1;i<t.length;i++){const[s,r]=t[i];if(e<=s){const[o,a]=t[i-1];return s===o?r:a+(r-a)*(e-o)/(s-o)}}return t[t.length-1][1]}const ul=n=>`${ne(n)} generation${n===1?"":"s"}`;function Ip(n,[e,t]){if(n.points){const a=Math.round(t-_w(n,e));return a===0?{gap:a,text:"Level with #1"}:{gap:a,text:`${a>0?"Ahead of":"Behind"} #1 by ${ul(Math.abs(a))}`}}const[i,s]=n.mark;if(e<=0)return{gap:0,text:`#1 reached ${ul(s)}`};const o=(e>=i?t:Math.round(t*i/e))-s;return o===0?{gap:o,text:"On pace to match #1's mark"}:{gap:o,text:`On pace to finish ${ul(Math.abs(o))} ${o>0?"ahead of":"behind"} #1`}}function vw(n,e){if(n.points){const s=n.points.map(e.place),r=s[s.length-1];return{line:s.map(([o,a])=>`${o},${a}`).join(" "),end:{x:r[0],y:r[1],label:ne(Dp(n))}}}const[t,i]=e.place(n.mark);return{line:null,end:{x:t,y:i,label:ne(n.mark[1])}}}function Np(n){return`${(n/1e3).toFixed(3)} s`}function gu(n){const e=`${ne(n.generations)} generation${n.generations===1?"":"s"}`;return n.ms===null?e:`${e} in ${Np(n.ms)}`}function xw(n,e){const t=`generation ${ne(n.generations)}`;return e==="died"?`died at ${t}`:n.period!==1?`settled at ${t}: period ${ne(n.period)}`:e==="repeat"?`settled at ${t}: a still life`:`settled at ${t}`}function da(n,e,t){return n.kind==="speed"?gu(e):n.kind==="methuselah"?xw(e,t):JSON.stringify(e)}const yw=n=>`${n[0].toUpperCase()}${n.slice(1)}`;function Sw(n,e){const t=n.generations===1?"generation":"generations";if(e==="died")return{value:ne(n.generations),unit:`${t}, until every cell had died`};const i=n.period===1?"a still life":`a cycle of period ${ne(n.period)}`;return{value:ne(n.generations),unit:`${t}, until it settled into ${i}`}}function Mw(n,e){const t=n.generations===1?"generation":"generations";return n.ms===null?{value:ne(n.generations),unit:`${t} in ${e.seconds} seconds`}:{value:(n.ms/1e3).toFixed(3),unit:`seconds to reach the ceiling of ${ne(n.generations)} ${t}`}}function _u(n,e,t={}){if(n.kind==="methuselah"){const i=[e.period===1?null:`period ${ne(e.period)}`,t.rules?$s(t.rules):null,t.seedCells?`${ne(t.seedCells)} seed cell${t.seedCells===1?"":"s"}`:null].filter(Boolean).join(" · ");return{main:`${ne(e.generations)} generation${e.generations===1?"":"s"}`,detail:i}}return n.kind!=="speed"?{main:JSON.stringify(e),detail:""}:e.ms===null?{main:gu(e),detail:`in ${n.seconds} seconds`}:{main:Np(e.ms),detail:`${ne(e.generations)} generations, the ceiling`}}function Up(n){switch(n){case"stopped":return"Stopped by hand, so it has no score.";case"memory-limit":return"Stopped at the engine's memory limit, so it has no score.";case"out-of-memory":return"Stopped: the browser refused the engine more memory, so it has no score.";case"error":return"Stopped by an error in the engine, so it has no score.";default:return`Ended (${n}), so it has no score.`}}function ww(n,e){switch(n){case"deadline":return`The ${e.seconds} seconds ran out.`;case"generation-limit":return`It reached the ceiling, generation ${ne(e.ceiling)}, before the ${e.seconds} seconds ran out, so its time counts too.`;default:return Up(n)}}function pc(n){const e=n.max.map((t,i)=>t-n.min[i]+1);return e.every(t=>t===e[0])?`${ne(e[0])}³`:e.map(ne).join(" × ")}function bw(n,e,{stats:t,cycle:i}){const s=`generation ${ne(t.generation)}`,r=ne(e.budget);switch(n){case"died":return`Died at ${s}: no live cells remain. The empty world is a still life, so a death scores the generation the last cell died.`;case"repeat":return i?.period>1?`Settled at ${s}: period ${ne(i.period)}. From there its cells repeat every ${ne(i.period)} generations, in place, so it scores where the cycle began.`:`Settled at ${s}: a still life. From there its cells stay the same, in place.`;case"emits":return`Emits from ${s}: its cells repeat every ${ne(i?.period??1)} generation${i?.period===1?"":"s"}, but ships leave the arena during each cycle, so it never settles and has no score. A pattern scores once its last ship has left and the rest has settled.`;case"arena-edge":return e.departures?`Reached the edge at ${s}: the next generation would bring a cell to life outside the ${pc(e.fixes.arena)} arena from something that isn't a ship of period ${ne(e.departures.period)} or less heading out, so it has no score. Only ships leave: a pattern that keeps growing, or a ship sliding along a wall, ends here.`:`Reached the edge at ${s}: the next generation would bring a cell to life outside the ${pc(e.fixes.arena)} arena, so it has no score. Only a pattern that settles in place inside the arena scores, and one that keeps growing, or sends something flying off, ends here.`;case"generation-limit":return t.live===0?`It died at generation ${r}, the budget's last, so it has no score: a death is a cycle of period 1, which closes a generation later, past the budget.`:`Still unsettled at generation ${r}, the budget, so it has no score.`;default:return Up(n)}}function Fp(n){if(!n.length)return"No ship left the arena";const e=`${ne(n.length)} ship${n.length===1?"":"s"} left`,t=[...new Set(n.map(s=>s.generation))];if(t.length===1)return`${e}, at generation ${ne(t[0])}`;if(t.length>5)return`${e}, from generation ${ne(t[0])} to generation ${ne(t.at(-1))}`;const i=t.map(ne);return`${e}, at generations ${i.slice(0,-1).join(", ")} and ${i.at(-1)}`}function vu(n,{short:e=!1}={}){const t=n.map(c=>c.closes).filter(Boolean).sort((c,u)=>dl(c)-dl(u));if(!t.length)return e?"Closes TBD":"Closing date to be announced";const i=t[0],s=i.includes("T"),r=s?"America/Chicago":"UTC",o=dl(i),a=o.toLocaleDateString("en-GB",{day:"numeric",month:e?"short":"long",year:"numeric",timeZone:r});if(e||!s)return e?`Closes ${a}`:`Entries close ${a}`;const l=o.toLocaleTimeString("en-US",{hour:"numeric",minute:"2-digit",timeZone:r});return`Entries close ${a}, ${l} Central Time`}function dl(n){if(n.includes("T"))return new Date(n);const[e,t,i]=n.split("-").map(Number);return new Date(Date.UTC(e,t-1,i))}function Op(n,e){return e.ms===null||e.ms===void 0?`${n.id}-${e.generations}.json`:`${n.id}-${e.generations}-${e.ms}ms.json`}function Ew(n){return n>=1024*1024?`${ne(n/(1024*1024))} MB`:`${ne(n/1024)} KB`}function Tw(n){return n?n.max.map((e,t)=>ne(e-n.min[t]+1)).join(" × "):"–"}function Aw(n,e){return`${ne(n)} / ${ne(e)}`}function ks(n){return[["Generation",ne(n.generation)],["Generations/s",ne(n.rate)],["Live cells",ne(n.live)],["Peak live cells",ne(n.livePeak)],["Chunks",ne(n.chunks)],["Memory",Ew(n.memoryBytes)],["Extent",Tw(n.extent)],...n.departed===void 0?[]:[["Ships left",ne(n.departed)]]]}function Rw(n){return{verified:"Verified",mismatch:"Doesn't match",refused:"Not a result file","not-checked":"Not checked",error:"The check failed"}[n]??n}function Cw(n,e){return`${ne(n)} / ${ne(e)}`}function mc(n){return n.map((e,t)=>e>0?`+${"xyz"[t]}`:e<0?`−${"xyz"[t]}`:null).filter(Boolean).join(" ")}function Pw(n,e){const t=n.length;if(!t)return"No ship leaves in this run.";const i=`${ne(t)} ship${t===1?"":"s"}`,s=n.filter(a=>a.generation<e);if(!s.length)return`${i} leave${t===1?"s":""} in this run, the first at generation ${ne(n[0].generation)}.`;const r=s.at(-1),o=`generation ${ne(r.generation)}, heading ${mc(r.shift)}`;return s.length===t?t===1?`The ship has left, at ${o}.`:`All ${i} have left, the last at ${o}.`:`${ne(s.length)} of ${i} ${s.length===1?"has":"have"} left, the last at ${o}.`}const Lw={"cell-limit":"it passed the run's cell limit","extent-limit":"it grew wider than the run's extent limit","coordinate-limit":"it reached the edge of the space the engine can hold","arena-edge":"it reached the edge of the run's arena","memory-limit":"it reached Watch's memory limit","out-of-memory":"the browser refused it more memory",error:"an error in the engine stopped it"};function Dw(n,e){const t=`generation ${ne(e)}`;if(n.matches===!0)return{verdict:"verified",text:`Self-verified: the replay's hash at ${t} matches the run's.`};if(n.hash)return{verdict:"mismatch",text:`Not verified: the replay's hash at ${t} doesn't match the run's.`};const i=Lw[n.reason]??`it ended (${n.reason})`,s=`The replay stopped at generation ${ne(n.generation)}, before ${t}: ${i}`;return n.matches===!1?{verdict:"mismatch",text:`Not verified. ${s}, so this isn't the run's result.`}:{verdict:"not-checked",text:`Not checked. ${s}.`}}const Iw=Math.sqrt(3)/2;function Nw(n,e,{unit:t=9,pad:i=4}={}){const s=(R,w)=>(R-w)*Iw*t,r=(R,w,S)=>((R+S)/2-w)*t,o=e.min,a=e.max.map(R=>R+1),l=[];for(const R of[o[0],a[0]])for(const w of[o[1],a[1]])for(const S of[o[2],a[2]])l.push([R,w,S]);const c=l.map(([R,,w])=>s(R,w)),u=l.map(([R,w,S])=>r(R,w,S)),d=Math.min(...c)-i,h=Math.min(...u)-i,p=(R,w,S)=>`${+(s(R,S)-d).toFixed(1)},${+(r(R,w,S)-h).toFixed(1)}`,g=R=>R.map(w=>p(...w)).join(" "),v=new Set(n.map(R=>R.join(","))),m=([R,w,S])=>v.has(`${R+1},${w},${S}`)&&v.has(`${R},${w+1},${S}`)&&v.has(`${R},${w},${S+1}`),f=n.filter(R=>!m(R)).sort((R,w)=>R[0]+R[1]+R[2]-(w[0]+w[1]+w[2])||R[1]-w[1]||R[0]-w[0]).map(([R,w,S])=>({top:g([[R,w+1,S],[R+1,w+1,S],[R+1,w+1,S+1],[R,w+1,S+1]]),right:g([[R+1,w,S],[R+1,w+1,S],[R+1,w+1,S+1],[R+1,w,S+1]]),left:g([[R,w,S+1],[R+1,w,S+1],[R+1,w+1,S+1],[R,w+1,S+1]])})),[T,y,M]=o,[P,E,A]=a;return{width:Math.ceil(Math.max(...c)-d+i),height:Math.ceil(Math.max(...u)-h+i),cubes:f,outline:g([[T,E,M],[P,E,M],[P,y,M],[P,y,A],[T,y,A],[T,E,A]]),edges:`M${p(P,E,A)} L${p(T,E,A)} M${p(P,E,A)} L${p(P,E,M)} M${p(P,E,A)} L${p(P,y,A)}`}}const xu=100,Uw=[["Microsoft Edge","Edge"],["Opera GX","Opera GX"],["Opera","Opera"],["Brave","Brave"],["Samsung Internet","Samsung Internet"],["Google Chrome","Chrome"],["Chromium","Chromium"]];async function Bp(n=globalThis.navigator){if(!n)return null;const e=n.userAgentData;if(e&&Array.isArray(e.brands)){let t=e.brands;try{const s=await e.getHighEntropyValues?.(["fullVersionList"]);Array.isArray(s?.fullVersionList)&&s.fullVersionList.length&&(t=s.fullVersionList)}catch{}const i=Fw(t);if(i)return i}return Ow(n.userAgent)}function Fw(n){if(!Array.isArray(n))return null;for(const[e,t]of Uw){const i=n.find(s=>s?.brand===e);if(i&&typeof i.version=="string"&&i.version)return{name:t,version:i.version.slice(0,xu)}}return null}function Ow(n){const e=[["Edge",/Edg(?:e|A|iOS)?\/([\d.]+)/],["Opera",/OPR\/([\d.]+)/],["Samsung Internet",/SamsungBrowser\/([\d.]+)/],["Firefox",/(?:Firefox|FxiOS)\/([\d.]+)/],["Chrome",/(?:Chrome|CriOS)\/([\d.]+)/],["Safari",/Version\/([\d.]+).*Safari\//]];for(const[t,i]of e){const s=i.exec(String(n??""));if(s)return{name:t,version:s[1].slice(0,xu)}}return null}const Bw='input:not([disabled]):not([type="hidden"]), select:not([disabled]), textarea:not([disabled]), button:not([disabled])',Ph=8;let yn=null,Lh=!1;function yu(n,e,{onClose:t,focus:i}={}){kw(),un({restoreFocus:!1});const s=n.closest(".glass-display");s&&e.parentElement!==s&&s.append(e),yn={button:n,popover:e,onClose:t},e.classList.add("is-open"),s?.classList.add("has-popover"),n.setAttribute("aria-expanded","true"),n.classList.add("is-active"),kp(e),((i===void 0?[...e.querySelectorAll(Bw)].find(o=>o.getClientRects().length>0):i)??e).focus({preventScroll:!0})}function un({popover:n,restoreFocus:e=!0}={}){if(!yn||n&&yn.popover!==n)return;const{button:t,popover:i,onClose:s}=yn;yn=null,i.classList.remove("is-open"),i.style.top="",i.closest(".glass-display")?.classList.remove("has-popover"),t.setAttribute("aria-expanded","false"),t.classList.remove("is-active"),s?.(),e&&!t.disabled&&t.focus({preventScroll:!0})}function ha(n){return yn?.popover===n}function Xt(){yn&&kp(yn.popover)}function kp(n){n.style.top="";const e=n.getBoundingClientRect(),t=e.bottom-(window.innerHeight-Ph);if(t<=0)return;const i=Math.min(t,Math.max(0,e.top-Ph));i>0&&(n.style.top=`${n.offsetTop-i}px`)}function kw(){if(Lh)return;Lh=!0,document.addEventListener("keydown",e=>{e.key==="Escape"&&yn&&(e.preventDefault(),un())});const n=e=>yn&&!yn.popover.contains(e)&&!yn.button.contains(e);document.addEventListener("pointerdown",e=>{n(e.target)&&un({restoreFocus:!1})}),document.addEventListener("focusin",e=>{e.target!==document.body&&n(e.target)&&un({restoreFocus:!1})}),window.addEventListener("resize",Xt)}const zw=3e3,Su=10,Gw=30,Hw=10,Vw={died:(n,e)=>`Every cell died at generation ${e.generation.toLocaleString("en")}.`,repeat:(n,e,t)=>t.period===1?`Settled at generation ${t.from.toLocaleString("en")}: a still life, which stays as it is from then on.`:`Settled at generation ${t.from.toLocaleString("en")}: from then on, the pattern repeats every ${t.period.toLocaleString("en")} generations. Its cycle keeps playing.`,"memory-limit":n=>`Stopped at the memory limit (${n.memoryMB.toLocaleString("en")} MB): the next block of memory would pass it. A higher limit, from the gear in the Limits box, lets it go further.`,"out-of-memory":()=>"Stopped: the browser refused more memory.",emits:(n,e,t)=>`Emits from generation ${t.from.toLocaleString("en")}: the pattern repeats every ${t.period.toLocaleString("en")} generations, but ships leave the arena during each cycle, so it never settles. Its cycle keeps playing.`,"arena-edge":n=>n.ships?`Stopped: the pattern reached the edge of the arena with something that isn't a ship of period ${Cf} or less heading out.`:"Stopped: the pattern reached the edge of the arena.","coordinate-limit":()=>"Stopped: the pattern reached the edge of the space the engine can hold, half a million cells from the centre.",error:()=>"Stopped by an error in the engine."},Q={driver:null,view:null,config:null,departed:0,status:"idle",wantSnapshot:!1,snapshotPending:!1,lastFrame:0,followFrom:0,extent:null,chunkSize:16,cycle:null,endReason:null,save:null},Mu=["x","y","z"];function li(){return _.simulationMode==="explore"}function $w(n){wu(),_.reset(),_.autoRotateActive=!1,_.viewMode="full",_.sliceAxis="x",_.sliceIndex=null,mu();const{camera:e,controls:t}=_;e.position.set(45,35,55),t.target.set(0,0,0),t.addEventListener("start",()=>{Q.followFrom=1/0}),t.addEventListener("end",()=>{Q.followFrom=performance.now()+zw}),Q.view=new Rp(_.scene),Q.config=n,Q.view.showArena(Tr(n.arena),{wrap:!!n.wrap,walls:!!n.walls}),document.body.classList.add("mode-explore"),tb(n),Gp(),document.getElementById("loading-overlay")?.classList.add("hidden")}function wu(){const n=!!Q.view;Q.driver?.close(),Q.driver=null,Q.view?.dispose(),Q.view=null,Q.status="idle",Q.wantSnapshot=!1,Q.snapshotPending=!1,document.body.classList.remove("mode-explore"),dn("explore-view-note",null),dn("explore-end-note",null),fa(),Wp(),n&&Ww()}function Ww(){const n=document.getElementById("speed-control");n&&lt("bottom-speed-value",`${Math.round(10*Number(n.value))}`),lt("bottom-state-value","pause");const e=document.getElementById("playPauseIcon");e&&(e.className="play"),document.getElementById("stepButton")?.classList.remove("disabled"),lt("rules-birth",gi(_.rules.birth)),lt("rules-survival",gi(_.rules.survival)),lt("rules-isolation",gi(_.rules.isolation)),lt("rules-overcrowd",gi(_.rules.overcrowding))}function Oo(){Q.view&&(Vp(),Q.wantSnapshot=!0,Q.cycle&&(Q.cycle.redraw=!0))}async function hl(n){const e=Q.save;if(fa(),e?.kind===n)return;const{driver:t,config:i}=Q;if(!t||!i)return;const s={kind:n,driver:t,name:null,text:null,saved:!1};Q.save=s,Xp(n);const r=E=>E.toLocaleString("en"),o=`B${gi(i.rules.birth)} / S${gi(i.rules.survival)}`,a=(i.seed??i.cells).length/3,l=E=>zp()?`Save asks where to put it, as ${E}.`:`Save downloads it as ${E}, to your browser's downloads folder, or wherever your browser asks.`;if(n==="seed"||n==="simulation"){const E=i.from?`, generation 0 of the run generation ${r(i.from)} was saved from`:"",A=n==="simulation";s.name=A?QM:Cp,s.text=A?lw(i):aw(i),mn({title:A?"Save simulation":"Save seed",what:A?`A simulation file: the seed, the ${r(a)} cells this run started from${E}, and its rules, ${o}. Load it from the Simulation box, with Load simulation…, to run it from generation 0, or bring it to a contest with Load simulation… there.`:`A seed file: the ${r(a)} cells this run started from${E}, without its rules. Load it from the Seed box, under File, to run it under the rules in the Rules box. To keep the rules with it, use Save simulation.`,hashes:[],where:l(s.name),ready:!0});return}if(i.wrap||i.walls){mn({title:"Save this generation",what:i.wrap?sw:rw,hashes:[],where:"",ready:!1});return}mn({title:"Save this generation",what:"Taking the generation on screen…",hashes:[],where:"",ready:!1});let c,u,d,h=null,p=Q.chunkSize,g=0;try{const E=Q.cycle;if(E?.frames)c=E.from+E.index,u=E.frames[E.index],d=u.length/3,g=Q.departed;else{const A=await t.snapshot({budget:Nn,stats:!0});({generation:c,live:d,chunkSize:p}=A),u=A.cells??null,h=A.stats??null,g=h?.departed??0}}catch(E){Q.save===s&&mn({what:`The generation couldn't be taken: ${E.message}`});return}if(Q.save!==s)return;const v=`Save generation ${r(c)}`,m=iw(g);if(m){mn({title:v,what:m});return}if(!u){mn({title:v,what:`This generation has ${r(d)} live cells, and a saved generation holds at most ${r(Nn)}, so it can't be saved. An earlier one can: Restart, and save before it grows this far. Save simulation still saves the seed and its rules.`});return}if(mn({title:v,what:`Hashing generation ${r(c)}'s ${r(d)} live cells…`}),await new Promise(E=>setTimeout(E)),Q.save!==s)return;const f=nw(Q.status,Q.endReason);let T;try{const E=await Bp();T=await ow({config:i,generation:c,cells:u,ending:f,stats:h,chunkSize:p,browser:E})}catch(E){Q.save===s&&mn({what:`The file couldn't be made: ${E.message}`});return}if(Q.save!==s)return;s.name=ew(c),s.text=T.text;const y=i.arena?`, its ${r(i.arena)}³ arena`:"",M=f==="stopped"?"stopped here":`ended (${f})`,P=Q.status==="running"?" The run keeps going; the file holds the generation as it was when you opened this.":"";mn({title:v,what:`A result file, as a contest entry is one: the run's seed (${r(a)} cells), its rules (${o})${y}, generation ${r(c)} with the position of each of its ${r(d)} live cells, how the run stands (${M}), and its statistics, chunk size and browser. Load it from the Simulation box, with Load simulation…, to carry on from generation ${r(c)}.${P}`,hashes:[[`Generation ${r(c)}`,T.result.hash],["Seed",T.result.seedHash]],where:l(s.name),ready:!0})}async function Xw(){const n=Q.save;if(!(!n?.text||n.saved))try{const e={seed:"Game of Life 3D seed file",simulation:"Game of Life 3D simulation file",generation:"Game of Life 3D saved generation"},t=await bu(n.name,n.text,e[n.kind]);if(Q.save!==n)return;n.saved=!0,mn({status:t,ready:!1})}catch(e){if(e?.name==="AbortError")return;Q.save===n&&mn({status:`Not saved: ${e.message}`,ready:!0})}}function fa(){Q.save=null,Xp(null)}async function bu(n,e,t){if(zp()){const i=await window.showSaveFilePicker({suggestedName:n,types:[{description:t,accept:{"application/json":[".json"]}}]}),s=await i.createWritable();return await s.write(e),await s.close(),`Saved as ${i.name}, in the folder you chose.`}return sb(n,e),`Downloaded as ${n}: your browser's downloads list shows where it went.`}function zp(){return typeof window<"u"&&typeof window.showSaveFilePicker=="function"}function Yw(){Q.status==="running"?Q.driver.pause():Q.status==="paused"&&Q.driver.resume()}function qw(){Q.status==="paused"&&Q.driver.step()}function jw(){Q.config&&Gp()}function Dr(n){return Number(n)>=Su?null:Number(n)*10}function Kw(n){const e=Dr(n);Q.driver?.setRate(e),Hp(e)}function Zw(n){const{view:e,driver:t}=Q;if(!e)return;const i=Jw(n);if(t&&Q.wantSnapshot&&!Q.snapshotPending&&!i){Q.wantSnapshot=!1,Q.snapshotPending=!0;const r={budget:Bs};_.viewMode==="slice"&&_.sliceIndex!==null&&(r.slice={axis:Mu.indexOf(_.sliceAxis),index:_.sliceIndex}),t.snapshot(r).then(o=>{Q.view!==e||Q.cycle?.frames||(Q.chunkSize=o.chunkSize,e.show(o),ib(o),Q.status==="running"&&(Q.wantSnapshot=!0))}).catch(()=>{}).finally(()=>{Q.view===e&&(Q.snapshotPending=!1)})}const s=Q.lastFrame?Math.min(n-Q.lastFrame,100):16;Q.lastFrame=n,e.showGrid(!!_.showWireframeGrid,Q.extent,Q.chunkSize),e.frame({camera:_.camera,controls:_.controls,elapsedMs:s,follow:n>=Q.followFrom,cellSize:_.cellSize??1.2,flip:_.flipOrientation})}function Jw(n){const e=Q.cycle;if(!e?.frames)return!1;const t=document.getElementById("speed-control"),i=Math.min(Gw,Dr(t?t.value:Su)??Hw);if(n>=e.nextAt&&(e.index=(e.index+1)%e.period,e.nextAt=n+1e3/i,e.redraw=!0),e.redraw){e.redraw=!1;let s=e.frames[e.index];_.viewMode==="slice"&&_.sliceIndex!==null&&(s=Qw(s,Mu.indexOf(_.sliceAxis),_.sliceIndex)),Q.view.show({cells:s})}return!0}function Qw(n,e,t){const i=[];for(let s=0;s<n.length;s+=3)n[s+e]===t&&i.push(n[s],n[s+1],n[s+2]);return Int32Array.from(i)}function Gp(){const{config:n}=Q;Q.driver?.close(),Q.status="idle",Q.wantSnapshot=!1,Q.snapshotPending=!1,Q.followFrom=0,Q.extent=null,Q.cycle=null,Q.endReason=null,Q.departed=0,lt("explore-settled","no");const e=document.getElementById("explore-departed-line");e&&(e.hidden=!n.ships),lt("explore-departed","0"),dn("explore-end-note",null),fa(),Dh(!1);const t=document.getElementById("speed-control"),i=Dr(t?t.value:Su);Hp(i);const s=new ua({onStats:o=>{Q.driver===s&&Ih(o)},onState:(o,a,l,c)=>{Q.driver===s&&(Q.status=o,Q.endReason=o==="ended"?l:null,Dh(o==="running"),Ih(a),Q.wantSnapshot=!0,o==="ended"&&eb(s,l,a,c))},onError:o=>{Q.driver===s&&dn("explore-end-note",o)}});Q.driver=s,Wp();const r=$g(n);s.start({world:r,seed:n.cells.slice(),from:n.from??0,run:{kind:"open",paused:!0,rate:i,settle:!0}})}function eb(n,e,t,i){const{config:s}=Q,r=Vw[e]?.(s,t,i)??`Stopped (${e}).`,o=e==="died"||e==="repeat";if(lt("bottom-state-value",e==="died"?"died":e==="repeat"?i.period===1?"still":"cycle":e==="emits"?"emits":"ended"),lt("explore-settled",e==="died"?"died":e==="repeat"?i.period===1?"still life":`every ${i.period.toLocaleString("en")}`:e==="emits"?`no, emits every ${i.period.toLocaleString("en")}`:"no"),e==="repeat"&&i.period>1||e==="emits"){dn("explore-end-note",r),Q.cycle={...i,frames:null,index:0,nextAt:0,redraw:!0},n.cycle({budget:4*Bs}).then(c=>{if(Q.driver!==n)return;c.frames?.every(d=>d.length/3<=Bs)?Q.cycle.frames=c.frames:dn("explore-end-note",`${r} The cycle is too large to play back, so its first generation stays on screen.`)}).catch(()=>{});return}const a=s.from?`Restart goes back to generation ${s.from.toLocaleString("en")}.`:"Restart runs the seed again.",l=o?a:`Generation ${t.generation.toLocaleString("en")} stays on screen; ${a}`;dn("explore-end-note",`${r} ${l}`)}function Dh(n){_.isPlaying=n;const e=document.getElementById("playPauseIcon");e&&(e.className=n?"pause":"play");const t=document.getElementById("bottom-state-value");t&&(t.textContent=Q.status==="ended"?"ended":n?"play":"pause"),document.getElementById("stepButton")?.classList.toggle("disabled",Q.status!=="paused")}function Hp(n){const e=document.getElementById("bottom-speed-value");e&&(e.textContent=n===null?"max":`${Math.round(n)}`)}function tb(n){lt("rules-birth",gi(n.rules.birth)),lt("rules-survival",gi(n.rules.survival)),lt("rules-isolation","–"),lt("rules-overcrowd","–"),lt("bottom-direction-value","fwd")}function Ih(n){const e=i=>i.toLocaleString("en");lt("explore-generation",e(n.generation)),lt("explore-live",e(n.live)),lt("explore-live-peak",e(n.livePeak)),lt("explore-chunks",e(n.chunks)),(Q.status==="running"||n.rate)&&lt("explore-rate",e(Math.round(n.rate))),lt("explore-extent",n.extent?n.extent.max.map((i,s)=>i-n.extent.min[s]+1).join("×"):"–"),lt("explore-memory-live",rb(n.usedBytes));const t=Q.config?` / ${e(Q.config.memoryMB)}`:"";lt("explore-memory-used",`${e(Math.round(n.memoryBytes/2**20))}${t} MB`),lt("bottom-gen",e(n.generation)),n.departed!==void 0&&nb(n),Q.extent=n.extent,Vp()}function nb({departed:n,lastDeparture:e}){const t=e?`, last at ${e.generation.toLocaleString("en")}, ${mc(e.shift)}`:"";if(lt("explore-departed",`${n.toLocaleString("en")}${t}`),n>Q.departed&&e){const i=n-Q.departed===1?"A ship":`${(n-Q.departed).toLocaleString("en")} ships`;dn("explore-end-note",`${i} left the arena at generation ${e.generation.toLocaleString("en")}, heading ${mc(e.shift)}: ${n.toLocaleString("en")} so far.`)}Q.departed=n}function Vp(){Eu(Q.extent)&&(Q.wantSnapshot=!0)}function Eu(n){const e=document.getElementById("slice-index"),t=Math.max(0,Mu.indexOf(_.sliceAxis)),i=n?n.min[t]:0,s=n?n.max[t]:0,r=_.sliceIndex??Math.round((i+s)/2),o=Math.min(s,Math.max(i,r)),a=o!==_.sliceIndex;return a&&(_.sliceIndex=o),e&&(e.min=`${i}`,e.max=`${s}`,e.value=`${o}`),_.viewMode==="slice"&&lt("view-controls-display-text",`${o-i} / ${s-i}`),a}function ib(n){n.chunks&&n.slice?dn("explore-view-note",`This slice holds more than ${Bs.toLocaleString("en")} live cells, so the view shows the chunks it crosses (${n.chunkSize}³ cells each), brighter where fuller.`):n.chunks?dn("explore-view-note",`${n.live.toLocaleString("en")} live cells: more than ${Bs.toLocaleString("en")}, so the view shows the chunks that hold them (${n.chunkSize}³ cells each), brighter where fuller.`):dn("explore-view-note",null)}const $p={generation:"explore-save-generation",simulation:"explore-save-simulation",seed:"explore-save-seed"};function Wp(){for(const n of Object.values($p)){const e=document.getElementById(n);e&&(e.disabled=!Q.driver)}}function Xp(n){const e=document.getElementById("explore-save-popover");if(!e)return;if(!n){un({popover:e});return}const t=document.getElementById($p[n]);t&&yu(t,e,{onClose:()=>{Q.save=null,mn({title:"",what:"",hashes:[],where:"",status:"",ready:!1})},focus:e})}function mn({title:n,what:e,hashes:t,where:i,status:s,ready:r}){if(n!==void 0&&lt("explore-save-title",n),e!==void 0&&lt("explore-save-what",e),t!==void 0){const a=document.getElementById("explore-save-hashes");a&&(a.replaceChildren(...t.map(([l,c])=>{const u=document.createElement("div"),d=document.createElement("span");d.className="explore-save-hash-label",d.textContent=l;const h=document.createElement("code");return h.textContent=c,u.append(d,h),u})),a.hidden=!t.length)}i!==void 0&&dn("explore-save-where",i),(s!==void 0||e!==void 0)&&dn("explore-save-status",s??null);const o=document.getElementById("explore-save-confirm");o&&(r!==void 0||e!==void 0)&&(o.hidden=!r),lt("explore-save-cancel",Q.save?.saved?"Close":"Cancel"),Xt()}function sb(n,e){const t=URL.createObjectURL(new Blob([e],{type:"application/json"})),i=document.createElement("a");i.href=t,i.download=n,document.body.append(i),i.click(),i.remove(),setTimeout(()=>URL.revokeObjectURL(t),6e4)}function rb(n){return n<2**20?`${Math.round(n/1024).toLocaleString("en")} KB`:`${(n/2**20).toLocaleString("en",{minimumFractionDigits:1,maximumFractionDigits:1})} MB`}function dn(n,e){const t=document.getElementById(n);t&&(t.hidden=!e,t.textContent=e??"")}function lt(n,e){const t=document.getElementById(n);t&&(t.textContent=e)}function gi(n){const e=[];for(let t=0;t<n.length;t++){let i=t;for(;i+1<n.length&&n[i+1]===n[i]+1;)i++;e.push(i>t?`${n[t]}-${n[i]}`:`${n[t]}`),t=i}return e.join(",")||"–"}const ir=new O(...$t.min.map((n,e)=>(n+$t.max[e])/2)),ob=($t.max[0]-$t.min[0]+1)/2,ab=26,lb={front:[0,0,1],top:[0,1,1e-4],side:[1,0,0],angled:[.55,.45,.7]},cb=[0,180/255,200/255],ub=[200/255,20/255,0],db=new Pe(1,.92,.45),hb=new Pe(.32,.36,.42),fb=new Pe(.14,.15,.17),pb=new Pe(.65,.92,1),mb=[16734810,5963642,5938431];class gb{constructor(e,{flip:t=!1}={}){this.renderer=e,this.dirty=!0,this.inset={right:0,bottom:0},this.scene=new up,this.scene.background=new Pe(1315860);const i=new mp(16777215,1.6);i.position.set(1,2,3),this.scene.add(i,new gp(16777215,.9)),this.camera=new on(50,1,.1,500),this.controls=new Ap(this.camera,e.domElement),this.controls.target.copy(ir),this.controls.enableDamping=!1,this.controls.minDistance=4,this.controls.maxDistance=120,this.onChange=()=>{this.dirty=!0},this.controls.addEventListener("change",this.onChange),this.group=new mi,this.group.scale.y=t?-1:1,this.scene.add(this.group);const s=new an(.84,.84,.84);this.cubeGeometry=s,this.solidMaterial=new $d,this.fadedMaterial=new $d({transparent:!0,opacity:.1,depthWrite:!1}),this.solid=this.instanced(this.solidMaterial),this.faded=this.instanced(this.fadedMaterial),this.solidPlaces=new Int32Array(Wn);const r=new Ot,o=new Float32Array(3*Wn);for(let c=0;c<Wn;c++)o.set(rr(c),3*c);r.setAttribute("position",new Ut(o,3)),r.setAttribute("color",new Ut(new Float32Array(3*Wn),3)),this.dotMaterial=new Lr({size:.16,vertexColors:!0,sizeAttenuation:!0}),this.dots=new uu(r,this.dotMaterial),this.group.add(this.dots);const a=2*ob;this.outline=this.edges(new an(a,a,a),16777215,.3),this.outline.position.copy(ir);const l=new an(1,1,1);this.selectionFill=new xn(l,new oa({color:16769126,transparent:!0,opacity:.1,depthWrite:!1})),this.group.add(this.selectionFill),this.selectionEdges=this.edges(l,16769126,.95),this.cursor=this.edges(new an(1.12,1.12,1.12),16777215,1),this.guides=mb.map(c=>{const u=new Ot;u.setAttribute("position",new Ut(new Float32Array(6),3));const d=new Xi(u,new Qn({color:c,transparent:!0,opacity:.85}));return d.frustumCulled=!1,this.group.add(d),d}),this.raycaster=new w0,this.raycaster.params.Points.threshold=.4,this.fitScale=1,this.resize(),this.setView("angled")}update(e,{fade:t=!1}={}){const i=e.selection(),s=e.focus(),r=(g,[v,m,f])=>v>=g.min[0]&&v<=g.max[0]&&m>=g.min[1]&&m<=g.max[1]&&f>=g.min[2]&&f<=g.max[2],o=new rt,a=new Pe,l=this.dots.geometry.attributes.color.array;let c=0,u=0;for(let g=0;g<Wn;g++){const v=rr(g),m=r(i,v),f=t&&!r(s,v);if(e.places[g]){const T=(v[0]-$t.min[0])/($t.max[0]-$t.min[0]);a.setRGB(...cb.map((P,E)=>P+(ub[E]-P)*T)),m&&a.lerp(db,.55),o.makeTranslation(...v);const y=f?this.faded:this.solid,M=f?u++:c++;y.setMatrixAt(M,o),y.setColorAt(M,a),f||(this.solidPlaces[M]=g),l.set([0,0,0],3*g)}else{const T=m?pb:f?fb:hb;l.set([T.r,T.g,T.b],3*g)}}for(const[g,v]of[[this.solid,c],[this.faded,u]])g.count=v,g.instanceMatrix.needsUpdate=!0,g.instanceColor&&(g.instanceColor.needsUpdate=!0);this.dots.geometry.attributes.color.needsUpdate=!0,this.fading=t,this.focusBox=s;const d=i.max.map((g,v)=>g-i.min[v]+1),h=i.min.map((g,v)=>(g+i.max[v])/2);for(const g of[this.selectionFill,this.selectionEdges])g.scale.set(d[0]+.06,d[1]+.06,d[2]+.06),g.position.set(...h);const p=e.cursor;this.cursor.position.set(...p),this.guides.forEach((g,v)=>{const m=[...p],f=[...p];m[v]=$t.min[v]-.5,f[v]=$t.max[v]+.5,g.geometry.attributes.position.array.set([...m,...f]),g.geometry.attributes.position.needsUpdate=!0}),this.dirty=!0}setView(e){const t=new O(...lb[e]).normalize();this.camera.up.set(0,1,0),this.camera.position.copy(ir).addScaledVector(t,ab*this.fitScale),this.controls.target.copy(ir),this.camera.lookAt(ir),this.controls.update(),this.dirty=!0}screenView(){this.camera.updateMatrixWorld();const e=this.camera.matrixWorld.elements,t=this.group.scale.y,i=(s,r,o)=>[s,t*r,o];return{right:i(e[0],e[1],e[2]),up:i(e[4],e[5],e[6]),forward:i(-e[8],-e[9],-e[10])}}pick(e,t){const i=this.renderer.domElement.getBoundingClientRect(),s=new Ve((e-i.left)/i.width*2-1,-((t-i.top)/i.height)*2+1);this.scene.updateMatrixWorld(),this.raycaster.setFromCamera(s,this.camera);const r=this.raycaster.intersectObject(this.solid,!1)[0];if(r&&r.instanceId!==void 0)return rr(this.solidPlaces[r.instanceId]);for(const o of this.raycaster.intersectObject(this.dots,!1)){const a=rr(o.index);if(!this.fading||_b(this.focusBox,a))return a}return null}setInset({right:e=0,bottom:t=0}={}){this.inset={right:e,bottom:t},this.resize()}resize(){const e=this.renderer.domElement,t=e.clientWidth||window.innerWidth,i=e.clientHeight||window.innerHeight;this.camera.aspect=t/i;const{right:s,bottom:r}=this.inset;this.camera.setViewOffset(t,i,s/2,r/2,t,i);const o=(t-s)/i,a=(i-r)/i;this.fitScale=Math.max(1,1/Math.max(.3,Math.min(o,a))),this.camera.updateProjectionMatrix(),this.dirty=!0}render(){return this.dirty?(this.dirty=!1,this.renderer.render(this.scene,this.camera),!0):!1}dispose(){this.controls.removeEventListener("change",this.onChange),this.controls.dispose(),this.scene.traverse(e=>{(e===this.solid||e===this.faded)&&e.dispose(),e.geometry?.dispose();const t=Array.isArray(e.material)?e.material:[e.material];for(const i of t)i?.dispose()}),this.cubeGeometry.dispose()}instanced(e){const t=new dp(this.cubeGeometry,e,Wn);return t.count=0,t.frustumCulled=!1,t.setColorAt(0,new Pe),this.group.add(t),t}edges(e,t,i){const s=new Xi(new aa(e),new Qn({color:t,transparent:i<1,opacity:i}));return this.group.add(s),s}}function _b(n,[e,t,i]){return Go(e,t,i)>=0&&e>=n.min[0]&&e<=n.max[0]&&t>=n.min[1]&&t<=n.max[1]&&i>=n.min[2]&&i<=n.max[2]}const vb=5;let We=null,Nh=!1;function xb(){return We!==null}function yb(){We?.view.render()}function Sb({places:n,rules:e,rulesFrom:t,note:i=null,onUse:s,returnFocus:r=null}){We&&pa(),Eb();const o=_.renderer.domElement;_.controls&&(_.controls.enabled=!1);const a=new gb(_.renderer,{flip:!!_.flipOrientation});We={model:new wg(n),view:a,rules:e,rulesFrom:t,onUse:s,returnFocus:r,fade:!1,help:!1,down:null},document.body.classList.add("seed-editor-open");const l=Ft("seed-editor");l.hidden=!1,Sn("seed-editor-note",i),Sn("seed-editor-status",null),Sn("seed-editor-error",null),Ft("seed-editor-density").value=`${yg}`,Tu(!1),Kp(),a.setView("angled"),o.tabIndex=0,o.setAttribute("aria-label","The seed box. Arrow keys and Page Up / Page Down move the cursor; Space switches the selection; ? lists every key."),Qi(),o.focus({preventScroll:!0})}function pa(){if(!We)return;const{view:n,returnFocus:e}=We;We=null,n.dispose();const t=_.renderer?.domElement;t&&(t.removeAttribute("tabindex"),t.removeAttribute("aria-label")),_.controls&&(_.controls.enabled=!0),document.body.classList.remove("seed-editor-open"),Ft("seed-editor").hidden=!0,Oo(),e?.isConnected&&!e.disabled&&e.focus({preventScroll:!0})}function ys(n){if(!We)return;const{model:e}=We;switch(Sn("seed-editor-error",null),n){case"switch":e.switchSelection();break;case"random":{const t=Number(Ft("seed-editor-density").value);if(!(t>=0&&t<=1)||Ft("seed-editor-density").value===""){Sn("seed-editor-error","The density must be from 0 to 1.");return}e.randomFill(t,Math.random);break}case"undo":e.undo();break;case"redo":e.redo();break;case"fade":We.fade=!We.fade;break;case"help":Tu(!We.help);return;case"use":Mb();return;case"cancel":pa();return;case"load":Ft("seed-editor-file").click();return;case"export":wb();return;default:return}Qi()}function Mb(){const{model:n,rules:e,onUse:t}=We;try{t(n.toCells(),e)}catch(i){Sn("seed-editor-error",i.message)}}async function wb(){const{model:n,rules:e}=We;if(!n.count){Sn("seed-editor-error","The design has no live cells to export: switch some on first.");return}const t=Xc({cells:n.toCells()});try{const i=await bu(Cp,t,"Game of Life 3D seed file");Sn("seed-editor-status",`${i} A seed file, cells only. Load it in the Seed box, under File, or in this editor with Load…, to open it again. To keep the rules with it, Use the design, then Save simulation in the Simulation box.`)}catch(i){i?.name!=="AbortError"&&Sn("seed-editor-error",`Not exported: ${i.message}`)}}async function bb(n){if(!We||!n)return;const e=We;try{if(n.size>An)throw new Error(`${n.name} is larger than ${An/2**20} MB.`);const t=Bg(n.name,await Pp(await n.text()));if(We!==e)return;e.model.replace(t.places),t.rules&&(e.rules=t.rules,e.rulesFrom=n.name),Sn("seed-editor-status",`Loaded ${n.name}: ${e.model.count.toLocaleString("en")} cells. Undo goes back to the design before it.`),Sn("seed-editor-error",null)}catch(t){if(We!==e)return;const i=t.message.startsWith(n.name)?t.message:`${n.name} can't be used: ${t.message}`;Sn("seed-editor-error",i)}Qi()}function Yp(n){const e=Tg(n,We.view.screenView());e&&(We.model.moveCursor(e.axis,e.delta),Qi())}function qp(n){We.model.setKind(n),Qi()}function jp(n){We.model.setAxis(n),Qi()}function Qi(){if(!We)return;const{model:n,view:e,fade:t,rules:i,rulesFrom:s}=We;e.update(n,{fade:t}),wo("seed-editor-count",(a=>a.toLocaleString("en"))(n.count)),wo("seed-editor-cursor",Ro(n.cursor)),wo("seed-editor-selection",bg(n));for(const a of document.querySelectorAll("#seed-editor [data-kind]"))a.setAttribute("aria-pressed",String(a.dataset.kind===n.kind));const o=n.kind==="line"||n.kind==="plane"||n.kind==="cell";for(const a of document.querySelectorAll("#seed-editor [data-axis]"))a.setAttribute("aria-pressed",String(Number(a.dataset.axis)===n.axis));Ft("seed-editor-axes").classList.toggle("is-quiet",!o),Ft("seed-editor-undo").disabled=!n.canUndo,Ft("seed-editor-redo").disabled=!n.canRedo,Ft("seed-editor-fade").setAttribute("aria-pressed",String(t)),wo("seed-editor-rules",`Use runs it with ${Ab(i)}, from ${s}. Export saves the seed alone, without rules.`)}function Kp(){if(!We)return;const e=Ft("seed-editor").getBoundingClientRect(),t=e.top>window.innerHeight/3;We.view.setInset(t?{bottom:window.innerHeight-e.top}:{right:window.innerWidth-e.left})}function Tu(n){We&&(We.help=n),Ft("seed-editor-help").hidden=!n,Ft("seed-editor-help-button").setAttribute("aria-expanded",String(n))}function Eb(){if(Nh)return;Nh=!0;const n=Ft("seed-editor"),e=_.renderer.domElement;n.addEventListener("click",t=>{const i=t.target.closest("button");!i||!We||(i.dataset.action?ys(i.dataset.action):i.dataset.kind?qp(i.dataset.kind):i.dataset.axis?jp(Number(i.dataset.axis)):i.dataset.move?Yp(i.dataset.move):i.dataset.view&&We.view.setView(i.dataset.view),We&&t.detail>0&&e.focus({preventScroll:!0}))}),Ft("seed-editor-file").addEventListener("change",t=>{const i=t.target.files?.[0];t.target.value="",bb(i)}),e.addEventListener("pointerdown",t=>{We&&t.button===0&&(We.down={x:t.clientX,y:t.clientY})}),e.addEventListener("pointerup",t=>{if(!We?.down)return;const{x:i,y:s}=We.down;if(We.down=null,Math.hypot(t.clientX-i,t.clientY-s)>vb)return;const r=We.view.pick(t.clientX,t.clientY);r&&(t.shiftKey?We.model.setAnchor(r):We.model.setCursor(r),Qi())}),document.addEventListener("keydown",Tb),window.addEventListener("resize",()=>{We&&Kp()})}function Tb(n){if(!We)return;const e=n.target,t=e instanceof HTMLElement&&e.closest("input, select, textarea");if(n.key==="Escape"){n.preventDefault(),n.stopPropagation(),We.help?Tu(!1):pa();return}if(t)return;const i=e instanceof HTMLElement&&e.closest("button, a"),s=n.ctrlKey||n.metaKey,r=n.key.length===1?n.key.toLowerCase():n.key;if(s&&(r==="z"||r==="y")){n.preventDefault(),ys(r==="y"||n.shiftKey?"redo":"undo");return}if(s||n.altKey)return;if(Af[n.key]){n.preventDefault(),Yp(n.key);return}if(r===" "||r==="Enter"){if(i)return;n.preventDefault(),ys("switch");return}const o=Tf[Number(r)-1];o?(n.preventDefault(),qp(o)):_r.includes(r)?(n.preventDefault(),jp(_r.indexOf(r))):r==="r"?(n.preventDefault(),ys("random")):r==="f"?(n.preventDefault(),ys("fade")):r==="?"&&(n.preventDefault(),ys("help"))}function Ft(n){return document.getElementById(n)}function wo(n,e){const t=Ft(n);t&&(t.textContent=e)}function Sn(n,e){const t=Ft(n);t&&(t.hidden=!e,t.textContent=e??"")}function Ab(n){const e=t=>{const i=[];for(let s=0;s<t.length;s++){let r=s;for(;r+1<t.length&&t[r+1]===t[r]+1;)r++;i.push(r>s?`${t[s]}-${t[r]}`:`${t[s]}`),s=r}return i.join(",")||"none"};return`B${e(n.birth)} / S${e(n.survival)}`}const Uh=An,Zp={perlin:{size:"Noise detail",sizeMax:100,density:"Fill amount",about:"Noise detail sets how fine the pattern is; fill amount how many cells live; the region how wide it spreads (0 for as wide as the detail)."},worley:{size:"Feature points",sizeMax:50,density:"Activation distance",about:"Feature points are the centres of its cells; activation distance how far from them cells live; the region how wide it spreads (0 for as wide as the points)."}},Jp={size:"Size",sizeMax:Oi,density:"Density",about:"Density is the chance that each cell of the shape is alive."};let Fh=!1,Au=Ru;function Rb({restart:n}={}){n&&(Au=n),!Fh&&(Fh=!0,Pb(),Lb(),Fb(),Hb(),Vb())}function Ru(){$w(Ff(_.explore)),Cb()}function Cb(){const n=Hg(_.explore),e=s=>s.toLocaleString("en"),t=Kc(_.explore);Ct("hud-simulation-name",t.name),Ct("explore-seed-label",n.seed);const i={end:"",ships:", ships leave",wrap:", wraps",walls:", walls"}[n.edge];Ct("explore-arena",n.arena?`${e(n.arena)}³${n.arenaLocked?", saved":""}${i}`:"off"),Ct("explore-memory-limit",`${e(n.memoryMB)} MB`)}function Pb(){for(const n of document.querySelectorAll(".hud-collapse")){const e=n.closest(".glass-display"),t=n.closest(".box-title");t.onclick=i=>{if(i.target.closest?.(".hud-gear"))return;const s=t.querySelector(".box-title-text")?.textContent??"this",r=e.classList.toggle("is-collapsed");if(n.setAttribute("aria-expanded",String(!r)),n.setAttribute("aria-label",`${r?"Expand":"Collapse"} the ${s} box`),r){const o=e.querySelector(".explore-popover.is-open");o&&un({popover:o,restoreFocus:!1})}}}}function ma(n,e,t,i){const s=document.getElementById(n),r=document.getElementById(e);if(!s||!r)return;const o=r.querySelector(".explore-error");s.onclick=()=>{if(ha(r)){un();return}qo(o,null),t(),yu(s,r)},r.querySelector("[data-cancel]").onclick=()=>un(),r.onsubmit=a=>{a.preventDefault();let l;try{l=i()}catch(c){qo(o,c.message),Xt();return}_.explore=l,un(),Au()}}function qo(n,e){n&&(n.hidden=!e,n.textContent=e??"")}const St={source:"current",presetId:br[0].id,file:null,fileError:null},gc="";function Qp(n,e,t){const i=r=>new Option(r[t],r[e]),s=Km.map(({id:r,label:o})=>{const a=document.createElement("optgroup");return a.label=o,a.append(...n.filter(l=>l.group===r).map(i)),a});return[...n.filter(r=>!r.group).map(i),...s.filter(r=>r.children.length)]}function em(n,e,t,i){n.onchange=async()=>{const s=n.files?.[0];if(n.value="",!!s){try{if(s.size>Uh)throw new Error(`it is larger than ${Uh/2**20} MB.`);e.file=t(s.name,await Pp(await s.text())),e.fileError=null}catch(r){e.file=null,e.fileError=r.message.startsWith(s.name)?r.message:`${s.name} can't be used: ${r.message}`}i()}}}function Lb(){const n=document.getElementById("explore-simulation-popover"),e=document.getElementById("explore-preset");if(!n||!e)return;e.replaceChildren(new Option("",gc),...Qp(br,"id","name"));const t=s=>document.getElementById(s);e.onchange=()=>{St.source=e.value===gc?St.file||St.fileError?"file":"current":"preset",St.source==="preset"&&(St.presetId=e.value),_c()};const i=t("explore-simulation-file");t("explore-load-simulation").onclick=()=>i.click(),em(i,St,Ug,()=>{St.source="file",_c()}),Ub(n,t("explore-simulation-help"),tm),ma("explore-change-simulation","explore-simulation-popover",Db,()=>{const s=_.explore;if(St.source==="preset")return Ho(s,Ng(St.presetId));if(St.source==="current")return s;if(!St.file)throw new Error(St.fileError??"Load a simulation file or a saved generation first, with Load simulation….");return St.file===s.seed?s:Ho(s,St.file)})}function Db(){const{id:n}=Kc(_.explore);St.source=n?"preset":"current",n&&(St.presetId=n),St.file=null,St.fileError=null,_c()}function _c(){const n=p=>document.getElementById(p),e=p=>p.toLocaleString("en"),{source:t,file:i,fileError:s}=St,r=Kc(_.explore),o=n("explore-preset"),a=o.options[0],l=t==="file"&&i;a.textContent=l?`${i.name} (loaded, not yet applied)`:r.from==="preset"?"":`${r.name} (in use)`,a.hidden=!a.textContent,o.value=t==="preset"?St.presetId:gc;const c=(p,g)=>{n(p).dataset.help=g},u=In(St.presetId);c("explore-preset",t==="preset"&&u?`${u.description} Seed: ${e(u.cells.length/3)} cells. Rules: ${Cs(u.rules)}.`:r.from===null&&!l?Nb:"A preset is a ready-made simulation: a seed with its own rules. Applying one replaces both."),c("explore-load-simulation",Ib);let d="";t==="file"&&s?d=s:l&&i.kind==="saved"?d=`${i.name}: generation ${e(i.from)} of a saved run, ${e(i.cells.length/3)} cells, with its own rules, ${Cs(i.rules)}, and ${i.arena?`a ${e(i.arena)}³ arena`:"no arena"}. They stay locked while it runs.`:l&&(d=`${i.name}: a seed of ${e(i.cells.length/3)} cells, and its rules, ${Cs(i.rules)}, which go into the Rules box, where you can change them.`),Ct("explore-simulation-status",d);const h=l&&i.kind==="saved"?i.from:0;c("explore-simulation-apply",t==="current"?`Nothing chosen yet: Applying runs the simulation in use again. ${xr(0)}`:`Applying replaces the seed and the rules. ${xr(h)}`),qo(n("explore-simulation-error"),null),Ct("explore-simulation-help",tm()),Xt()}const Ib="Load simulation… takes a simulation file, from the Simulation box's save icon, whose seed and rules both come in, or a saved generation, from Save this generation, which carries on from its generation under its own rules and arena. A seed file has no rules: load it in the Seed box.",Nb="Custom: a seed and rules of your own. To make one, change the seed in the Seed box, or the rules in the Rules box: the simulation becomes Custom. Save it with the save icon, and load it again here; or pick a preset to start from.";function tm(){const n=St.source==="file"?"explore-load-simulation":"explore-preset";return document.getElementById(n)?.dataset.help??""}function Ub(n,e,t){if(!n||!e)return;const i=s=>{const r=s?.closest?.("[data-help]")?.dataset.help??t();e.textContent!==r&&(e.textContent=r,Xt())};n.addEventListener("pointerover",s=>i(s.target)),n.addEventListener("pointerleave",()=>i(n.contains(document.activeElement)?document.activeElement:null)),n.addEventListener("focusin",s=>i(s.target))}const zt={source:"shape",file:null,fileError:null};function Fb(){const n=document.getElementById("explore-seed-popover"),e=document.getElementById("explore-shape");if(!n||!e)return;e.replaceChildren(...Qp(Lf,"key","name"));const t=s=>document.getElementById(s);t("explore-source-shape").onclick=()=>{zt.source="shape",Ss()},t("explore-source-file").onclick=()=>{zt.source="file",Ss()},t("explore-source-design").onclick=()=>{zt.source="design",Ss()},t("explore-design").onclick=im,e.onchange=()=>{nm(e.value),Ss()};const i=t("explore-seed-file");t("explore-load-seed").onclick=()=>i.click(),em(i,zt,Fg,Ss),ma("explore-change-seed","explore-seed-popover",Ob,()=>{const s=_.explore;if(zt.source==="file"){if(!zt.file)throw new Error(zt.fileError??"Load a seed file first, with Load seed….");return zt.file===s.seed?s:Ho(s,zt.file)}if(zt.source==="design"){if(s.seed.kind==="design")return s;throw new Error("Design a seed first: Design… opens the seed editor, and its Use makes the design the seed.")}const r=e.value,o={size:t("explore-shape-size").value,density:t("explore-shape-density").value,regionSize:t("explore-shape-region").value},a=Ho(s,qc(r,o,s.seed));return a.seed.params&&(_.shapeParams[r]={...a.seed.params}),a})}function Ob(){const{seed:n}=_.explore;zt.source=n.kind==="file"&&!n.rules?"file":n.kind==="design"?"design":"shape",zt.file=zt.source==="file"?n:null,zt.fileError=null;const e=n.kind==="shape"?n.key:n.kind==="preset"?`preset:${n.id}`:"cube";document.getElementById("explore-shape").value=e,nm(e,n.kind==="shape"?n.params:null),Ss()}function nm(n,e=null){const t=na(n),i=Zp[n]??Jp,s=e??_.shapeParams?.[n]??{},r=document.getElementById("explore-shape-size");r.max=`${i.sizeMax}`,r.value=`${s.size??10}`,document.getElementById("explore-shape-density").value=`${s.density??(t?.noise?.3:1)}`,document.getElementById("explore-shape-region").value=`${s.regionSize??25}`}function Ss(){const n=c=>document.getElementById(c),{source:e}=zt;n("explore-source-shape").setAttribute("aria-pressed",String(e==="shape")),n("explore-source-file").setAttribute("aria-pressed",String(e==="file")),n("explore-source-design").setAttribute("aria-pressed",String(e==="design")),n("explore-seed-shape-part").hidden=e!=="shape",n("explore-seed-file-part").hidden=e!=="file",n("explore-seed-design-part").hidden=e!=="design",Ct("explore-design-status",Bb());const t=n("explore-shape").value,i=na(t),s=Zp[t]??Jp;n("explore-shape-params").hidden=!!i?.preset,n("explore-shape-region-row").hidden=!i?.noise,Ct("explore-shape-size-label",s.size),Ct("explore-shape-size-hint",`1 - ${s.sizeMax}`),Ct("explore-shape-density-label",s.density),Ct("explore-shape-about",i?.preset?`${In(i.preset).name}'s ${(In(i.preset).cells.length/3).toLocaleString("en")} cells, without its rules: they run under the rules in the Rules box. For the preset with its rules, use Preset in the Simulation box.`:s.about);const{file:r,fileError:o}=zt,a=c=>c.toLocaleString("en");let l;o?l=o:r?r===_.explore.seed?l=`${ia(r)}: ${a(r.cells.length/3)} cells, in use now.`:l=`${r.name}: ${a(r.cells.length/3)} cells, to run under the rules in the Rules box.`:l="Load seed… takes the cells of a seed file, from Save seed, or of a simulation file, leaving its rules out: the seed runs under the rules in the Rules box.",Ct("explore-seed-status",l),Ct("explore-seed-note",`Applying changes only the seed: the rules stay. ${xr(0)}`),qo(n("explore-seed-error"),null),Xt()}function Bb(){const n=_.explore,e=i=>i.toLocaleString("en");if(n.seed.kind==="design")return`The design in use, ${e(n.seed.cells.length/3)} cells. Design… opens it in the seed editor, to change it; Apply runs it again.`;const t=If(n);return t.reason?`Design… opens the seed editor on an empty 10³ box: ${zb(t.reason)} The seed in use still runs.`:`Design… opens the seed editor on the seed in use (${ia(n.seed)}, ${e(n.seed.cells.length/3)} cells), in the 10³ seed box, to place cells one by one.`}function im({note:n=null}={}){const e=If(_.explore),t=qi(_.explore);Gb({places:e.places,rules:e.rules,rulesFrom:t?`${t.name}, as the Rules box shows them`:"the Rules box",note:[e.reason&&`${e.reason} The editor opens on an empty box; the seed in use is unchanged.`,n].filter(Boolean).join(" ")||null})}function kb({note:n=null}={}){im({note:n})}function zb(n){return/^[A-Z][a-z]/.test(n)?n[0].toLowerCase()+n.slice(1):n}function Gb(n,e="explore-change-seed"){const t=document.getElementById(e);un({restoreFocus:!1}),Sb({...n,returnFocus:t,onUse:(i,s)=>{const r=kg(_.explore,i,s);pa(),_.explore=r,Au()}})}let fr=!1;function Hb(){const n=document.getElementById("explore-rule-birth"),e=document.getElementById("explore-rule-survival");!n||!e||(document.getElementById("explore-rules-own").onclick=()=>{fr=!0,Bh(),n.focus()},e.oninput=Oh,ma("explore-change-rules","explore-rules-popover",()=>{fr=!1;const t=Ar(_.explore);n.value=Cs(t.birth),e.value=Cs(t.survival),Bh(),Oh()},()=>Wg(_.explore,n.value,e.value,{own:fr})))}function Oh(){let n=null;try{n=Vg(Mi(document.getElementById("explore-rule-survival").value,"survival"))}catch{}const e=t=>n?n[t].length?t==="isolation"&&!n.overcrowding.length&&n.isolation.length===27?"every count":Cs(n[t]):"none":"–";Ct("explore-rules-isolation",e("isolation")),Ct("explore-rules-overcrowding",e("overcrowding")),Ct("explore-rules-gaps",e("gaps")),document.getElementById("explore-rules-gaps-line").hidden=!n?.gaps.length,Xt()}function Bh(){const n=fr?null:qi(_.explore),e=document.getElementById("explore-rules-locked");e.hidden=!n,n&&Ct("explore-rules-locked-text",n.by==="preset"?`These rules come with ${n.name}, a simulation whose seed and rules go together, so it is always the same run. Use your own rules keeps its cells and these rules, as a Custom simulation, for you to change.`:"These rules come with the saved generation, which carries on under them. Use your own rules starts its cells again from generation 0, with these rules for you to change.");for(const i of["explore-rule-birth","explore-rule-survival"]){const s=document.getElementById(i);s.readOnly=!!n}Wb("explore-rules-popover").hidden=!!n;const t=fr?0:Nf(_.explore);Ct("explore-rules-note",xr(t)),Xt()}let pr=!1;function Vb(){const n=document.getElementById("explore-arena-on"),e=document.getElementById("explore-arena-side"),t=document.getElementById("explore-edge"),i=document.getElementById("explore-memory-input");!n||!e||!t||!i||(n.onchange=()=>{e.disabled=!n.checked||xc(),t.disabled=e.disabled},t.onchange=kh,document.getElementById("explore-arena-own").onclick=()=>{pr=!0,zh(),n.focus()},ma("explore-change-limits","explore-limits-popover",()=>{pr=!1;const s=vr(_.explore);n.checked=s!==null,e.value=`${s??_.explore.arenaSize}`;const r=qi(_.explore)?.by==="saved"?Hs(_.explore):_.explore.edge;for(const o of t.querySelectorAll('input[name="explore-edge"]'))o.checked=o.value===r;for(const{key:o}of Yc)document.getElementById(`explore-wall-${o}-birth`).value=mr(_.explore.walls[o].birth),document.getElementById(`explore-wall-${o}-survival`).value=mr(_.explore.walls[o].survival);kh(),i.value=`${_.explore.memoryMB}`,zh()},()=>{const s=xc()?_.explore:Bf(_.explore,n.checked,e.value,{own:pr,edge:vc(),walls:vc()==="walls"?$b():void 0});return Yg(s,i.value)}))}function vc(){return document.querySelector('#explore-edge input[name="explore-edge"]:checked')?.value}function $b(){const n={};for(const{key:e}of Yc)n[e]={birth:document.getElementById(`explore-wall-${e}-birth`).value,survival:document.getElementById(`explore-wall-${e}-survival`).value};return n}function kh(){const n=document.getElementById("explore-walls-rules");n&&(n.hidden=vc()!=="walls",Xt())}function xc(){return!pr&&qi(_.explore)?.by==="saved"}function zh(){const n=xc();document.getElementById("explore-arena-locked").hidden=!n;const e=document.getElementById("explore-arena-on");e.disabled=n,document.getElementById("explore-arena-side").disabled=n||!e.checked,document.getElementById("explore-edge").disabled=n||!e.checked,Ct("explore-limits-note",xr(pr?0:Nf(_.explore))),Xt()}function Wb(n){return document.getElementById(n).querySelector('[type="submit"]')}function Ct(n,e){const t=document.getElementById(n);t&&(t.textContent=e)}function Cs(n){return Array.isArray(n)?mr(n):`B${mr(n.birth)} / S${mr(n.survival)}`}function mr(n){const e=[];for(let t=0;t<n.length;t++){let i=t;for(;i+1<n.length&&n[i+1]===n[i]+1;)i++;e.push(i>t?`${n[t]}-${n[i]}`:`${n[t]}`),t=i}return e.join(",")}const Gh=1024**2,zi=1024**3,yc=1.5*zi,Hh=4*zi,Cu=2*zi,Xb=40,Yb=24,sm=2.25,Vh=.4,$h=.3,Sc=255,Pu={size:1e5,generations:1e7};function ga(n,e){const t=Math.ceil(n*(e?.15:.1));return Math.max(2*n+1+t,n+1+t)}function qb(n){return Math.max(20,Math.ceil(Math.sqrt(n)*2.5))}function jb(n,e){const t=Math.max(1,n?.size||1),i=Math.min(1,Math.max(0,Number.isFinite(n?.density)?n.density:1));let s,r;switch(n?.shape){case"cube":s=t,r=s**3;break;case"tetrahedron":s=t,r=t*(t+1)*(t+2)/6;break;case"octahedron":s=2*t+1,r=(2*t+1)*(2*t*t+2*t+3)/3;break;default:s=Math.min(e,Math.max(1,n?.regionSize||e)),r=s**3}return s=Math.min(s,e),{side:s,cells:Math.min(r,s**3)*i}}function Kb({mode:n,size:e,generations:t,seed:i,initialSand:s=0}){switch(n){case"sineWave":return e*e*(t+1);case"rule30":return t**3/5.5+t+1;case"rule30_2D":return .4*t**3.55+t+1;case"sandpile":{const r=Math.min(Sc,Math.max(0,s));return r+sm*(t*r+t*(t+1)/2)}default:{const{side:r,cells:o}=jb(i,e),a=$h*e**3,l=Math.ceil((e-r)/Vh);let c=o;const u=Math.min(t,l);for(let d=1;d<=u;d++)c+=$h*Math.min(e,r+Vh*d)**3;return t>u&&(c+=(t-u)*a),c}}}function Ir(n){const{mode:e,size:t,generations:i}=n,s=e==="sandpile"?1+Math.ceil(sm*i):i+1,r=t**3*s,o=Kb(n),a=o*Xb,l=e==="rule30"?1:t,c=t*t*l*Yb;return{frames:s,grids:r,cells:o,cellBytes:a,view:c,total:r+a+c}}function Zb(n){return Ir(n).total>Cu}function rm(n,e,t){const i=o=>Ir(Jb(n,e,o)).total<=t;if(!i(1))return 0;let s=1,r=Pu[e];if(i(r))return r;for(;r-s>1;){const o=Math.floor((s+r)/2);i(o)?s=o:r=o}return s}function Jb(n,e,t){const i={...n,[e]:t};return e==="generations"&&(n.mode==="rule30"||n.mode==="rule30_2D")&&(i.size=ga(t,n.mode==="rule30_2D")),i}function Rn(n){return n<Gh?"under 1 MB":n<zi?`${Math.round(n/Gh).toLocaleString("en")} MB`:n<10*zi?`${(n/zi).toFixed(1)} GB`:`${Math.round(n/zi).toLocaleString("en")} GB`}function Qb(n){return n<1e5?Math.round(n).toLocaleString("en"):n<1e9?`${(n/1e6).toFixed(1)} million`:`${(n/1e9).toFixed(1)} billion`}const di=n=>Math.round(n).toLocaleString("en");function om({size:n,generations:e}){return`a ${di(n)}³ grid over ${di(e)} generation${e===1?"":"s"}`}function eE(n,e){const t=rm(n,e,yc);return t<1?"advice":`1 - ${di(t)}${t>=Pu[e]?"+":""}`}function tE(n,e){const t=Ir(n),i=e==="size"?`at ${di(n.generations)} generations`:n.mode==="rule30"||n.mode==="rule30_2D"?"(the size follows)":`at size ${di(n.size)}`,s=r=>{const o=rm(n,e,r);if(o<1)return e==="generations"?"none at this size: lower the size first":"none at these generations";const a=e==="generations"?" generations":"";return`up to ${di(o)}${o>=Pu[e]?" or more":""}${a} ${i}`};return{estimate:`About ${Rn(t.total)} for this run, by estimate.`,parts:`Grids: ${di(n.size)}³ × ${di(t.frames)} = ${Rn(t.grids)}. Live cells: about ${Qb(t.cells)} in all generations, ${Rn(t.cellBytes)}. View: ${Rn(t.view)}.`,cellsNote:n.mode==="gameOfLife"?"Live cells are a guess before the run: under the default rules a pattern widens by about 0.4 cells a generation, with about 30% of it alive. Other rules can hold far fewer, or more.":null,suggestions:[{label:`Typical laptop (${Rn(yc)})`,text:s(yc)},{label:`Strong desktop (${Rn(Hh)})`,text:s(Hh)}],past:`Past them, the run takes longer to compute, the view stutters as it draws more cells, and at last the browser refuses the memory, which stops the run with a message, or closes the tab, which no page can catch. Above ${Rn(Cu)}, Apply asks first.`}}const nE="Initial Sand stays between 0 and 255: each cell keeps its grains in one byte, and 255 is the most one byte holds. Size and generations have no such limit.";function iE(n){const{total:e}=Ir(n);return`This run, ${om(n)}, needs about ${Rn(e)} by estimate, more than ${Rn(Cu)}. On a typical laptop it may slow the page to a crawl, or the browser may close the tab. Run it anyway?`}function sE(n){const{total:e}=Ir(n);return`The browser refused the memory for ${om(n)} (about ${Rn(e)} by estimate), so the run stopped. Open the settings to choose a smaller size or fewer generations.`}function rE(n){return n instanceof RangeError}const jo=[{field:"size",button:"sim-size-range",text:"sim-size-range-text",popover:"sim-size-advice"},{field:"generations",button:"sim-generations-range",text:"sim-generations-range-text",popover:"sim-generations-advice"}],Mc={button:"sandpile-initial-sand-range",popover:"sandpile-sand-advice"},sr=16,Wh=6,Lu=typeof HTMLElement<"u"&&"popover"in HTMLElement.prototype;let Du=null,Xh=!1;function oE(n){if(Du=n,Xh)return;Xh=!0;for(const{field:t,button:i,popover:s}of[...jo,{...Mc,field:"sand"}]){const r=document.getElementById(i),o=document.getElementById(s);if(!r||!o)continue;const a=()=>am(t,o);Lu?(o.addEventListener("beforetoggle",l=>{l.newState==="open"&&a()}),o.addEventListener("toggle",l=>{l.newState==="open"&&fl(o,r)})):(o.hidden=!0,r.addEventListener("click",()=>{const l=o.hidden;Iu(),l&&(a(),o.hidden=!1,fl(o,r))}))}const e=()=>{for(const{button:t,popover:i}of[...jo,Mc]){const s=document.getElementById(i);s&&Nu(s)&&fl(s,document.getElementById(t))}};window.addEventListener("resize",e),document.addEventListener("scroll",e,!0)}function Yh(){const n=Du?.();if(n)for(const{field:e,text:t,popover:i}of jo){const s=document.getElementById(t);s&&(s.textContent=eE(n,e));const r=document.getElementById(i);r&&Nu(r)&&am(e,r,n)}}function Iu(){for(const{popover:n}of[...jo,Mc]){const e=document.getElementById(n);!e||!Nu(e)||(Lu?e.hidePopover():e.hidden=!0)}}function Nu(n){return Lu?n.matches(":popover-open"):!n.hidden}function am(n,e,t=Du?.()){if(n==="sand"){e.replaceChildren(xs(nE));return}if(!t){e.replaceChildren();return}const i=tE(t,n),s=document.createElement("dl");for(const{label:r,text:o}of i.suggestions){const a=document.createElement("dt");a.textContent=r;const l=document.createElement("dd");l.textContent=o,s.append(a,l)}e.replaceChildren(xs(i.estimate,"advice-estimate"),xs(i.parts,"advice-detail"),...i.cellsNote?[xs(i.cellsNote,"advice-detail")]:[],xs("Suggested:"),s,xs(i.past))}function xs(n,e){const t=document.createElement("p");return t.textContent=n,e&&(t.className=e),t}function fl(n,e){if(!e)return;const t=e.getBoundingClientRect(),{offsetWidth:i,offsetHeight:s}=n,r=Math.min(Math.max(sr,t.right-i),window.innerWidth-i-sr);let o=t.bottom+Wh;o+s>window.innerHeight-sr&&(o=Math.max(sr,t.top-Wh-s)),n.style.left=`${Math.max(sr,r)}px`,n.style.top=`${o}px`}const Uu=[{id:"explore",name:"Game of Life 3D",kind:"Unbounded",about:"Conway's Game of Life in three dimensions, where each cell has 26 neighbours, in a world without walls: the pattern grows as far as it likes, for as long as you let it run. It computes on the CPU, in a background thread, keeping only the current generation, so its memory follows the live cells. Pause, step and restart it, try a preset simulation, a seed file or a seed of your own design, other rules, and an arena that ends the run, lets ships leave, wraps around or has walls."},{id:"gameOfLife",name:"Game of Life 3D",kind:"Bounded",about:"Conway's Game of Life in three dimensions, where each cell has 26 neighbours, in a fixed grid that wraps around, or has walls with their own corner, edge and face rules. The whole run is computed before it plays, so you can scrub it and play it backwards. It computes on your GPU with WebGPU where your browser has it, and on the CPU otherwise, with the same cells either way. It holds every generation in memory, so the grid's size and the run's length are what limit it."},{id:"rule30",name:"Rule 30",kind:"Cellular",about:"A one-dimensional cellular automaton that generates complex, seemingly random patterns from simple rules. Each cell's state depends on its left, centre and right neighbours, producing fractal-like structures."},{id:"sineWave",name:"Sine Wave",kind:"Continuous",about:"A continuous mathematical function visualised in discrete 3D space. It shows periodic oscillations and wave patterns, and how a continuous phenomenon can be sampled and displayed on a grid."},{id:"sandpile",name:"Sandpile",kind:"Abelian",about:"The Abelian sandpile model, a self-organised critical system. Sand grains pile up and topple when they reach a threshold, setting off cascading avalanches with power-law sizes and fractal patterns."}],lm=["gameOfLife","rule30","sineWave","sandpile"],wc=[{key:"cube",name:"Cube"},{key:"tetrahedron",name:"Tetrahedron"},{key:"octahedron",name:"Octahedron"},{key:"perlin",name:"Perlin noise",noise:!0,size:"Noise detail",sizeMax:100,density:"Fill amount",about:"Noise detail sets how fine the pattern is; fill amount how many cells live; the region how wide it spreads."},{key:"worley",name:"Worley noise",noise:!0,size:"Feature points",sizeMax:50,density:"Activation distance",about:"Feature points are the centres of its cells; activation distance how far from them cells live; the region how wide it spreads."}],Ws=n=>wc.find(e=>e.key===n)??wc[0],Nr=[{key:"corner",state:"corner",name:"Corner",neighbours:7},{key:"edge",state:"edgeTwoFaces",name:"Edge",neighbours:11},{key:"face",state:"face",name:"Face",neighbours:17}];let qh=!1,Ps={beforeRun:()=>{},afterRun:()=>{},enterExplore:()=>{},showMode:()=>{}};function aE(n){Ps={...Ps,...n},!qh&&(qh=!0,hE(),fE(),_E(),vE(),oE(()=>ha(ke("grid-popover"))?bc(um()):bc(Ei(_.simulationMode))))}function lE(){const n=ke("hud-change-mode");n&&!ha(ke("mode-popover"))&&n.click()}function Ei(n){const e=_.modeValues[n]??{},t=e.generations??100,i=!!e.is3D,s=_.lifeShapeKey??"cube";return{mode:n,generations:t,size:n==="rule30"?ga(t,i):e.size??50,is3D:i,initialSand:_.sandpileParams?.initialSand??0,wrap:_.gridWrapping??!0,walls:Object.fromEntries(Nr.map(r=>[r.key,{birth:_.boundaryRules[r.state].birth,survival:_.boundaryRules[r.state].survival}])),shape:{key:s,...cm(s),..._.shapeParams[s]},rules:{birth:_.rules.birth,survival:_.rules.survival}}}function cm(n){return Ws(n).noise?{size:10,density:.3,regionSize:25}:{size:10,density:1}}function bc(n){if(!n||!lm.includes(n.mode))return null;const{generations:e,size:t}=n;if(n.mode==="rule30")return{mode:n.is3D?"rule30_2D":"rule30",size:t,generations:e};if(n.mode==="sineWave")return{mode:"sineWave",size:t,generations:e};if(n.mode==="sandpile")return{mode:"sandpile",size:t,generations:e,initialSand:n.initialSand};const{key:i,size:s,density:r,regionSize:o}=n.shape;return{mode:"gameOfLife",size:t,generations:e,seed:{shape:i,size:s,density:r,regionSize:Ws(i).noise?o:null}}}async function cE(n){const{mode:e}=n;if(Iu(),_.simulationMode=e,_.useRule30=e==="rule30"&&!n.is3D,_.useRule30_2D=e==="rule30"&&n.is3D,_.useSineWave=e==="sineWave",_.useSandpile=e==="sandpile",_.modeValues[e]={..._.modeValues[e],size:n.size,generations:n.generations,is3D:n.is3D},_.sim_size=n.size,_.sim_generations=n.generations,e==="sandpile"&&(_.sandpileParams.initialSand=n.initialSand),e==="rule30"&&(_.shapeKey="rule30"),e==="gameOfLife"){const{key:t,size:i,density:s,regionSize:r}=n.shape,o=Ws(t).noise,a=o?Math.min(n.size,r):null;_.shapes[t]=$m(t,i,s,a),_.shapeKey=t,_.lifeShapeKey=t,_.shapeParams[t]=o?{size:i,density:s,regionSize:a}:{size:i,density:s},_.gridWrapping=n.wrap,_.rules={...n.rules,...Ec(n.rules.survival,26)};for(const l of Nr){const c=n.walls[l.key];_.boundaryRules[l.state]={...c,...Ec(c.survival,l.neighbours)}}}Ps.beforeRun(),Ps.showMode(),await $u(),Ps.afterRun(),uE()}function Ec(n,e){if(!n.length)return{isolation:[],overcrowding:[]};const t=Array.from({length:e+1},(i,s)=>s);return{isolation:t.filter(i=>i<n[0]),overcrowding:t.filter(i=>i>n[n.length-1])}}function uE(){const n=_.simulationMode;if(!lm.includes(n))return;const e=Ei(n);pt("sim-size-value",pl(_.sim_size)),pt("sim-generations-value",pl(_.sim_generations)),pt("grid-edge-value",e.wrap?"wraps around":"walls"),pt("grid-3d-value",e.is3D?"on":"off"),pt("grid-sand-value",pl(e.initialSand));const t=Ws(e.shape.key);pt("shape-name-value",t.name),pt("shape-size-value",String(e.shape.size)),pt("shape-density-value",Number(e.shape.density).toFixed(2)),pt("rules-birth",Dn(_.rules.birth)),pt("rules-survival",Dn(_.rules.survival)),pt("rules-isolation",Dn(_.rules.isolation??[])),pt("rules-overcrowd",Dn(_.rules.overcrowding??[]))}function _a(n,e,t,i){const s=ke(n),r=ke(e);if(!s||!r)return;const o=r.querySelector(".explore-error"),a=dE(r);s.onclick=()=>{if(ha(r)){un();return}Jh(o,null),a.hidden=!0,t(),yu(s,r,{onClose:Iu}),Yh()},r.querySelector("[data-cancel]").onclick=()=>un(),r.addEventListener("input",()=>{a.hidden=!0,Yh()});const l=c=>{let u;try{u=i()}catch(h){Jh(o,h.message),Xt();return}const d=bc(u);if(!c&&d&&Zb(d)){a.querySelector("p").textContent=iE(d),a.hidden=!1,a.querySelector("[data-run]").onclick=()=>l(!0),a.querySelector("[data-back]").focus(),Xt();return}un(),u.mode==="explore"?Ps.enterExplore():u.mode!=="none"&&cE(u)};r.onsubmit=c=>{c.preventDefault(),l(!1)}}function dE(n){const e=document.createElement("div");e.className="memory-confirm hud-confirm",e.setAttribute("role","alertdialog"),e.hidden=!0;const t=document.createElement("p"),i=Object.assign(document.createElement("button"),{type:"button",className:"glass-button explore-small-button",textContent:"Change settings"});i.dataset.back="",i.onclick=()=>{e.hidden=!0,n.querySelector("input, select")?.focus()};const s=Object.assign(document.createElement("button"),{type:"button",className:"glass-button explore-small-button",textContent:"Run anyway"});s.dataset.run="";const r=document.createElement("div");return r.className="explore-save-actions",r.append(i,s),e.append(t,r),n.append(e),e}let hi="explore";function hE(){const n=ke("mode-popover-list");n&&(n.replaceChildren(...Uu.map(e=>{const t=document.createElement("button");t.type="button",t.className="mode-option",t.dataset.mode=e.id,t.setAttribute("aria-pressed","false");const i=document.createElement("span");i.className="mode-option-name",i.textContent=e.name;const s=document.createElement("span");return s.className="mode-option-kind",s.textContent=e.kind,t.append(i,s),t.onclick=()=>{hi=e.id,jh()},t})),_a("hud-change-mode","mode-popover",()=>{hi=_.simulationMode,jh()},()=>hi===_.simulationMode?{mode:"none"}:hi==="explore"?{mode:"explore"}:Ei(hi)))}function jh(){for(const t of ke("mode-popover-list").children)t.setAttribute("aria-pressed",String(t.dataset.mode===hi));const n=Uu.find(t=>t.id===hi);pt("mode-popover-about",n?.about??"");let e=`Applying switches to ${n?.name} (${n?.kind.toLowerCase()}), with the settings it had last. Change them from its boxes.`;n?hi===_.simulationMode&&(e="This mode is running now."):e="Choose a mode to leave the contests for it.",pt("mode-popover-note",e),Xt()}function fE(){const n=ke("sim-generations"),e=ke("sim-size");if(!(!n||!e)){n.addEventListener("input",()=>{const t=_.simulationMode,i=Math.max(1,parseInt(n.value,10)||1);t==="rule30"?e.value=String(ga(i,ke("rule30-3d").checked)):t==="sandpile"&&(e.value=String(qb(i)))}),ke("rule30-3d").addEventListener("change",()=>n.dispatchEvent(new Event("input",{bubbles:!0})));for(const t of["grid-edge-wrap","grid-edge-walls"])ke(t).addEventListener("change",dm);_a("grid-change","grid-popover",pE,()=>{const t=um();if(!Number.isInteger(t.generations)||t.generations<1)throw new Error("Generations must be a whole number, 1 or more.");if(!Number.isInteger(t.size)||t.size<1)throw new Error("Size must be a whole number, 1 or more.");if(!Number.isInteger(t.initialSand)||t.initialSand<0||t.initialSand>Sc)throw new Error(`Initial sand must be a whole number from 0 to ${Sc}.`);return t.mode==="gameOfLife"&&!t.wrap&&(t.walls=gE(Of(mE()))),t})}}function pE(){const n=Ei(_.simulationMode),e=n.mode;ke("sim-size").value=String(n.size),ke("sim-generations").value=String(n.generations),ke("rule30-3d").checked=n.is3D,ke("sandpile-initial-sand").value=String(n.initialSand),ke("grid-edge-wrap").checked=n.wrap,ke("grid-edge-walls").checked=!n.wrap;for(const t of Nr)ke(`wall-${t.key}-birth`).value=Dn(n.walls[t.key].birth),ke(`wall-${t.key}-survival`).value=Dn(n.walls[t.key].survival);ke("grid-size-row").hidden=e==="rule30",ke("grid-rule30-row").hidden=e!=="rule30",ke("grid-sand-row").hidden=e!=="sandpile",ke("grid-edge-row").hidden=e!=="gameOfLife",pt("grid-size-about",e==="sandpile"?"The sandpile spreads as its grains pile up, so its size follows the generations as you change them; you can still set it yourself.":""),ke("grid-size-about").hidden=e!=="sandpile",pt("grid-rule30-about","Rule 30's size follows its generations, so it has only those to set."),pt("grid-note","Applying computes the run again, from generation 0."),dm()}function um(){const n=Ei(_.simulationMode),e=t=>ke(t).value.trim()===""?NaN:Number(ke(t).value);return n.generations=e("sim-generations"),n.is3D=ke("rule30-3d").checked,n.size=n.mode==="rule30"?ga(Math.max(1,n.generations||1),n.is3D):e("sim-size"),n.initialSand=e("sandpile-initial-sand"),n.wrap=ke("grid-edge-wrap").checked,n}function dm(){ke("grid-walls").hidden=ke("grid-edge-wrap").checked,Xt()}function mE(){return Object.fromEntries(Nr.map(n=>[n.key,{birth:ke(`wall-${n.key}-birth`).value,survival:ke(`wall-${n.key}-survival`).value}]))}const gE=n=>Object.fromEntries(Nr.map(e=>[e.key,n[e.key]]));function _E(){const n=ke("life-shape");n&&(n.replaceChildren(...wc.map(e=>new Option(e.name,e.key))),n.onchange=()=>Kh(n.value),_a("life-change-seed","life-seed-popover",()=>{const e=_.lifeShapeKey??"cube";n.value=e,Kh(e)},()=>{const e=Ei("gameOfLife"),t=n.value,i=Ws(t),s=i.sizeMax??e.size,r=Number(ke("life-shape-size").value),o=Number(ke("life-shape-density").value),a=Number(ke("life-shape-region").value);if(!Number.isInteger(r)||r<1||r>s)throw new Error(`${i.size??"Size"} must be a whole number from 1 to ${s}${i.sizeMax?"":", the grid's size"}.`);if(!(o>=0&&o<=1)||ke("life-shape-density").value.trim()==="")throw new Error(`${i.density??"Density"} must be from 0 to 1.`);if(i.noise&&(!Number.isInteger(a)||a<1||a>e.size))throw new Error(`The region size must be a whole number from 1 to ${e.size}, the grid's size.`);return e.shape=i.noise?{key:t,size:r,density:o,regionSize:a}:{key:t,size:r,density:o},e}))}function Kh(n){const e=Ws(n),t={...cm(n),..._.shapeParams[n]},i=Ei("gameOfLife").size;pt("life-shape-size-label",e.size??"Size"),pt("life-shape-size-hint",`1 - ${e.sizeMax??i}`),pt("life-shape-density-label",e.density??"Density"),pt("life-shape-region-hint",`1 - ${i}`),ke("life-shape-size").value=String(t.size),ke("life-shape-density").value=String(t.density),ke("life-shape-region").value=String(t.regionSize??25),ke("life-shape-region-row").hidden=!e.noise,pt("life-shape-about",e.about??"Density is the chance that each cell of the shape is alive."),pt("life-seed-note","Applying changes only the seed: the rules stay. It computes the run again, from generation 0."),Xt()}function vE(){const n=ke("life-rule-birth"),e=ke("life-rule-survival");!n||!e||(e.addEventListener("input",Zh),_a("life-change-rules","life-rules-popover",()=>{n.value=Dn(_.rules.birth),e.value=Dn(_.rules.survival),pt("life-rules-note","Applying changes only the rules: the seed stays. It computes the run again, from generation 0."),Zh()},()=>{const t=Ei("gameOfLife");return t.rules={birth:Mi(n.value,"birth"),survival:Mi(e.value,"survival")},t}))}function Zh(){let n="–",e="–";try{const{isolation:t,overcrowding:i}=Ec(Mi(ke("life-rule-survival").value,"survival"),26);n=t.length?Dn(t):"none",e=i.length?Dn(i):"none"}catch{}pt("life-rules-isolation",n),pt("life-rules-overcrowding",e)}function ke(n){return document.getElementById(n)}function pt(n,e){const t=ke(n);t&&(t.textContent=e)}function Jh(n,e){n&&(n.hidden=!e,n.textContent=e??"")}const pl=n=>Number(n).toLocaleString("en");function Dn(n){const e=[];for(let t=0;t<n.length;t++){let i=t;for(;i+1<n.length&&n[i+1]===n[i]+1;)i++;i>t?e.push(`${n[t]}-${n[i]}`):e.push(String(n[t])),t=i}return e.join(",")}const xE=[{contest:"speed-1",name:"Morpheus Lab Agent",picture:null,score:{generations:449,ms:null},browser:{name:"Chromium",version:"155.0.8059.84"},date:"2026-11-23",result:"hall-of-fame/results/speed-1-morpheus-lab-agent.json"},{contest:"classic-methuselah-1",name:"Morpheus Lab Agent",picture:"hall-of-fame/classic-methuselah-1-morpheus-lab-agent.png",score:{generations:223,period:1},browser:{name:"Chromium",version:"155.0.8059.84"},date:"2026-11-23",rules:{birth:[4],survival:[1,5]},seedCells:23,result:"hall-of-fame/results/classic-methuselah-1-morpheus-lab-agent.json"},{contest:"methuselah-1",name:"Morpheus Lab Agent",picture:"hall-of-fame/methuselah-1-morpheus-lab-agent.png",score:{generations:109,period:1},browser:{name:"Chromium",version:"155.0.8059.84"},date:"2026-11-23",rules:{birth:[5],survival:[3,4,5]},seedCells:15,result:"hall-of-fame/results/methuselah-1-morpheus-lab-agent.json"}],va={entries:xE},Qh="/assets/morpheus-tech-4UhQpwQO.png",hm=2048,yE=["deadline","generation-limit"];class fm{constructor(e,{onStats:t,onStart:i,onEnd:s,onError:r,createWorker:o,seconds:a=e.seconds}={}){this.contest=e,this.run=Wc(e),this.seconds=a,this.status="idle",this.points=[[0,0]],this.end=null;const l={onStats:t,onStart:i,onEnd:s,onError:r};this.driver=new ua({createWorker:o,onStats:c=>{this.status==="running"&&(this.points.push([c.generationMs/1e3,c.generation]),l.onStats?.(c))},onState:(c,u,d)=>{if(c==="running"&&this.status==="idle")this.status="running",l.onStart?.(u);else if(c==="ended"&&this.status!=="ended"){this.status="ended";const h=yE.includes(d)?hg(this.contest,u.generation,u.generationMs):null;this.points.push([u.generationMs/1e3,u.generation]),this.end={stats:u,reason:d,score:h},l.onEnd?.(this.end)}},onError:c=>l.onError?.(c)})}start(){if(this.status!=="idle")throw new Error("This Speed run has already started.");const{run:e,contest:t}=this;this.driver.start({world:{rules:e.rules,chunkSize:t.chunkSize,limits:{memory:hm*1024*1024}},seed:Int32Array.from(e.seed.flat()),run:{kind:"timed",seconds:this.seconds},generations:e.limits.generations})}stop(){this.status!=="ended"&&this.driver.worker&&this.driver.stop()}async makeResult(e=null){if(!this.end?.score)throw new Error("Only a run that scored has a result to enter.");const{stats:t,score:i}=this.end,s=await this.driver.result({run:this.run,score:i,details:{elapsedMs:t.elapsedMs,stats:t,browser:e,timeline:this.timeline()}});return{result:s,text:Hc(s)}}timeline(){let e=this.points.map(([t,i])=>[Math.round(t*1e3),i]);if(e.length>ur){const t=e.length-1;e=Array.from({length:ur},(i,s)=>e[Math.round(s*t/(ur-1))])}return e}close(){this.driver.close()}}function SE(n,{createWorker:e=ME}={}){const t=e();let i;const s=new Promise(o=>{i=o}),r=o=>{t.terminate(),i(o)};return t.onmessage=o=>r(o.data),t.onerror=o=>r({verdict:"error",message:o?.message??"The verifier failed."}),t.postMessage({text:n}),{promise:s,cancel:()=>r({verdict:"cancelled",message:"Cancelled."})}}function ME(){return new Worker(new URL("/assets/verify.worker-DgHZPlJG.js",import.meta.url),{type:"module"})}const wE=512,ef={methuselah:(n,{reason:e,stats:t,cycle:i})=>pg(n,{ending:e,generation:t.generation,period:i?.period})};class bE{constructor(e,t,{onStats:i,onStart:s,onEnd:r,onError:o,createWorker:a}={}){if(!ef[e.kind])throw new Error(`${e.title} isn't a Discovery contest this page can run.`);this.contest=e,this.run=Wc(e,t),this.status="idle",this.points=[[0,this.run.seed.length]],this.end=null;const l={onStats:i,onStart:s,onEnd:r,onError:o};this.driver=new ua({createWorker:a,onStats:c=>{this.status==="running"&&(this.addPoint(c),l.onStats?.(c))},onState:(c,u,d,h,p)=>{if(c==="running"&&this.status==="idle")this.status="running",l.onStart?.(u);else if(c==="ended"&&this.status!=="ended"){this.status="ended";const g={stats:u,reason:d,cycle:h??null,departures:p??null};g.score=ef[this.contest.kind](this.contest,g),this.end=g,l.onEnd?.(g)}},onError:c=>l.onError?.(c)})}addPoint(e){const t=this.points[this.points.length-1];e.generation>t[0]&&this.points.push([e.generation,e.live])}get budget(){return this.run.limits.generations}start(){if(this.status!=="idle")throw new Error("This run has already started.");const{run:e,contest:t}=this;this.driver.start({world:{...gf(e,{chunkSize:t.chunkSize,memory:wE*1024*1024}),departures:wf(e)},seed:Int32Array.from(e.seed.flat()),run:{kind:"open",settle:!0,history:!0},generations:e.limits.generations})}stop(){this.status!=="ended"&&this.driver.worker&&this.driver.stop()}async loadHistory(){if(this.status!=="ended")throw new Error("The history is read once the run has ended.");const{live:e}=await this.driver.history();return this.points=Array.from(e,(t,i)=>[i,t]),this.points}async makeResult(e=null){if(!this.end?.score)throw new Error("Only a run that scored has a result to enter.");const{score:t,stats:{departed:i,lastDeparture:s,...r}}=this.end,o=await this.driver.result({run:this.run,score:t,details:{elapsedMs:r.elapsedMs,stats:r,browser:e}});return{result:o,text:Hc(o)}}close(){this.driver.close()}}const EE=3e3,TE=10,AE=["x","y","z"],oe={driver:null,view:null,result:null,status:"idle",generation:0,wantSnapshot:!1,snapshotPending:!1,lastFrame:0,followFrom:0,dragging:!1,seekTo:null,replayed:null,extent:null,chunkSize:16,onClose:null,onReplayed:null},Et=n=>document.getElementById(n),tf=new WeakSet;function lr(){return!!oe.view}function RE(n,{title:e="Watch",onReplayed:t,onClose:i}={}){Ko({quietly:!0});const s=Ds(n.run.contest);oe.result=n,oe.onClose=i??null,oe.onReplayed=t??null,oe.replayed=null,oe.status="idle",oe.generation=0,oe.seekTo=null,oe.dragging=!1,oe.wantSnapshot=!0,oe.snapshotPending=!1,oe.lastFrame=0,oe.followFrom=0,oe.extent=null,oe.chunkSize=s?.chunkSize??16,_.viewMode!=="slice"&&(_.viewMode="full"),_.sliceAxis??="x",_.sliceIndex=null;const{camera:r,controls:o}=_;r.position.set(45,35,55),o.target.set(0,0,0),tf.has(o)||(tf.add(o),o.addEventListener("start",()=>{oe.followFrom=1/0}),o.addEventListener("end",()=>{oe.followFrom=performance.now()+EE})),oe.view=new Rp(_.scene),oe.view.showArena(n.run.arena),document.body.classList.add("contests-watching"),Et("contests-panel").hidden=!0,Et("contests-watch").hidden=!1,Et("contests-watch-title").textContent=e,gl("Not checked yet: the replay is checked against the result's hash when it reaches the last generation.","pending");const a=Et("contests-watch-scrub");a.min="0",a.max=String(n.generation),a.value="0",a.oninput=()=>pm(Number(a.value)),a.onpointerdown=()=>{oe.dragging=!0},a.onpointerup=()=>{oe.dragging=!1},a.onblur=()=>{oe.dragging=!1},Et("contests-watch-close").onclick=()=>Ko();const l=n.departures??null;Et("contests-watch-ticks").replaceChildren(...[...new Set((l??[]).map(h=>h.generation))].map(h=>{const p=document.createElement("option");return p.value=String(h),p})),Et("contests-watch-departures").hidden=!l,Fu(0);const c=Et("speed-control"),u=Dr(c?c.value:TE);mm(u);const d=new ua({onStats:h=>{oe.driver===d&&(Zo(h.generation),nf(h.extent))},onState:(h,p)=>{oe.driver===d&&(oe.status=h,Zo(p.generation),nf(p.extent),IE(),oe.wantSnapshot=!0)},onReplayed:h=>{if(oe.driver!==d)return;const p=Dw(h,n.generation);oe.replayed=p,gl(p.text,p.verdict),oe.onReplayed?.(p)},onError:h=>oe.driver===d&&gl(`The engine says: ${h}`,"not-checked")});oe.driver=d,d.start({world:{...gf(n.run,{chunkSize:s?.chunkSize,memory:hm*1024*1024}),departures:wf(n.run)},seed:Int32Array.from(n.run.seed.flat()),run:{kind:"replay",rate:u,check:{run:n.run,hash:n.hash}},generations:n.generation}),Et("contests-watch-close").focus({preventScroll:!0})}function Ko({quietly:n=!1}={}){if(!oe.view)return;oe.driver?.close(),oe.driver=null,oe.view.dispose(),oe.view=null,oe.result=null,document.body.classList.remove("contests-watching"),Et("contests-watch").hidden=!0,Et("contests-watch-scrub").oninput=null,Et("contests-watch-ticks").replaceChildren(),Et("contests-watch-departures").hidden=!0;const e=Et("playPauseIcon");e&&(e.className="play"),_i("bottom-state-value","pause"),_.renderer.render(_.scene,_.camera);const t=oe.onClose;oe.onClose=null,oe.onReplayed=null,!n&&(Et("contests-panel").hidden=!1,t?.())}function CE(){const{driver:n}=oe;n&&(oe.status==="running"?n.pause():oe.status==="paused"?n.resume():oe.status==="ended"&&pm(0).then(e=>{oe.driver===n&&e&&!e.superseded&&n.resume()}))}function ml(){oe.view&&(Eu(oe.extent),oe.wantSnapshot=!0)}function PE(){oe.status==="paused"&&oe.driver.step()}function LE(n){if(!oe.driver)return;const e=Dr(n);oe.driver.setRate(e),mm(e)}function DE(n){const{view:e,driver:t}=oe;if(!e)return;if(t&&oe.wantSnapshot&&!oe.snapshotPending&&oe.status!=="seeking"){oe.wantSnapshot=!1,oe.snapshotPending=!0;const s={budget:Bs};_.viewMode==="slice"&&_.sliceIndex!==null&&(s.slice={axis:AE.indexOf(_.sliceAxis),index:_.sliceIndex}),t.snapshot(s).then(r=>{oe.view===e&&(oe.chunkSize=r.chunkSize,e.show(r),Zo(r.generation),oe.status==="running"&&(oe.wantSnapshot=!0))}).catch(()=>{}).finally(()=>{oe.view===e&&(oe.snapshotPending=!1)})}const i=oe.lastFrame?Math.min(n-oe.lastFrame,100):16;oe.lastFrame=n,e.showGrid(!!_.showWireframeGrid,oe.extent,oe.chunkSize),e.frame({camera:_.camera,controls:_.controls,elapsedMs:i,follow:n>=oe.followFrom,cellSize:_.cellSize??1.2,flip:_.flipOrientation}),_.controls?.enabled&&_.controls.update(),_.renderer.render(_.scene,_.camera)}function pm(n){const{driver:e}=oe;return e?(oe.seekTo=n,Fu(n),e.seek(n).then(t=>(oe.driver!==e||t.superseded||(oe.seekTo=null,Zo(t.generation),oe.wantSnapshot=!0),t)).catch(()=>null)):Promise.resolve(null)}function Zo(n){oe.generation=n,oe.seekTo===null&&(Fu(n),oe.dragging||(Et("contests-watch-scrub").value=String(n)))}function nf(n){oe.extent=n,Eu(n)&&(oe.wantSnapshot=!0)}function Fu(n){const e=oe.result?.generation??0,t=Cw(n,e);_i("contests-watch-generation",t),_i("bottom-gen",t),_i("contest-hud-generation",t);const i=oe.result?.departures;i&&_i("contests-watch-departures",Pw(i,n))}function IE(){const n=Et("playPauseIcon");n&&(n.className=oe.status==="running"?"pause":"play"),Et("stepButton")?.classList.toggle("disabled",oe.status!=="paused"),_i("bottom-state-value",{running:"play",paused:"pause",seeking:"seek",ended:"end"}[oe.status]??oe.status),_i("contest-hud-status",oe.status==="ended"?"Watched":"Watching")}function mm(n){_i("bottom-speed-value",n===null?"max":`${Math.round(n)}`)}function gl(n,e){const t=Et("contests-watch-verified");t.textContent=n,t.dataset.verdict=e}function _i(n,e){const t=Et(n);t&&(t.textContent=e)}const Tc="lab@morpheustech.net",NE="Hall of Fame: yes, show my name, picture, score, browser and date.";function UE(n){return`BEFORE SENDING: attach your result file, ${n}. Without it, this entry can't be verified.`}function FE(n,e,t){return`[${n.title}] ${da(n,e,t)}`}const OE="-".repeat(40);function BE({contest:n,browser:e,fileName:t}){const i=[UE(t),"","Name to show: ","Picture (optional): attach a square PNG or JPEG, at most 1 MB."];return e||i.push("Browser and version: "),n.kind==="speed"&&i.push("Operating system (optional): ","Hardware (optional): "),i.push("","Delete the next line to opt out of the Hall of Fame (the entry is still verified, but not listed):",NE,"",OE,"",`An entry for ${n.title} (${n.id}). The result file holds its score${n.kind==="methuselah"?", rules and seed":""}, the browser and the hash; the lab verifies it by replaying the run.`),n.kind==="methuselah"&&i.push("",`${n.title}'s Hall of Fame also shows the entry's rules and its seed's cell count, from the result file.`),i.push("","The picture must be yours to use, show no other people, and break nothing in the code of conduct. The lab resizes it to 128 x 128 and strips its metadata, and may decline a picture or a name.","","The lab's repo is public: once committed, your name and picture are in its history and in every copy of it. Removal on request takes them off the site and out of the current files, but can't erase every copy.","","Your email address is used only to reply about this entry. It is never published, committed or put in a result file."),n.kind==="speed"&&i.push("","Speed's timing is self-reported: a replay proves the generation, not how long it took. Top entries may be asked for a screen recording of a run on lab.morpheustech.net."),`${i.join(`
`)}
`}function kE(n,e){return`mailto:${Tc}?subject=${encodeURIComponent(n)}&body=${encodeURIComponent(e)}`}const zE=10,sf=40,GE=/^hall-of-fame\/[a-z0-9][a-z0-9-]*\.(png|jpg)$/,HE=/^hall-of-fame\/results\/[a-z0-9][a-z0-9-]*\.json$/,VE=["contest","name","picture","score","browser","date","result"],$E={methuselah:["rules","seedCells"]},gm={speed:(n,e)=>fg(n.score,e.score),methuselah:mg};class Kt extends Error{constructor(e){super(e),this.name="HallOfFameError"}}const cr=n=>n!==null&&typeof n=="object"&&!Array.isArray(n)&&Object.getPrototypeOf(n)===Object.prototype;function WE(n){if(typeof n!="string"||!/^\d{4}-\d{2}-\d{2}$/.test(n))return!1;const[e,t,i]=n.split("-").map(Number),s=new Date(Date.UTC(e,t-1,i));return s.getUTCFullYear()===e&&s.getUTCMonth()===t-1&&s.getUTCDate()===i}function XE(n,e){if(!cr(n))throw new Kt(`${e} must be an object.`);const t=typeof n.contest=="string"?Ds(n.contest)?.kind:void 0,i=[...VE,...$E[t]??[]],s=Object.keys(n),r=i.filter(g=>!s.includes(g)),o=s.filter(g=>!i.includes(g));if(r.length)throw new Kt(`${e} has no ${r[0]}.`);if(o.length)throw new Kt(`${e} has an unknown field, ${JSON.stringify(o[0])}.`);const{contest:a,name:l,picture:c,score:u,browser:d,date:h,result:p}=n;if(typeof a!="string"||!Ds(a))throw new Kt(`${e}.contest must be one of this lab's contests.`);if(typeof l!="string"||l.trim()!==l||!l||l.length>sf||/[\u0000-\u001f\u007f]/.test(l))throw new Kt(`${e}.name must be text of 1 to ${sf} characters, with no spaces at either end.`);if(c!==null&&(typeof c!="string"||!GE.test(c)))throw new Kt(`${e}.picture must be null or a .png or .jpg under hall-of-fame/.`);if(!cr(u)||!Object.values(u).every(g=>g===null||Number.isSafeInteger(g)&&g>=0))throw new Kt(`${e}.score must be an object of whole numbers or nulls, as in its result file.`);if(d!==null&&!(cr(d)&&Ls(Object.keys(d).sort())==='["name","version"]'&&["name","version"].every(v=>typeof d[v]=="string"&&d[v].length<=xu)))throw new Kt(`${e}.browser must be null or {name, version}, as in its result file.`);if(!WE(h))throw new Kt(`${e}.date must be the day the entry arrived, as YYYY-MM-DD.`);if("rules"in n){const{rules:g}=n,v=f=>Array.isArray(f)&&f.every((T,y)=>Number.isSafeInteger(T)&&T>=0&&T<=26&&(y===0||T>f[y-1]));if(!(cr(g)&&Ls(Object.keys(g).sort())==='["birth","survival"]'&&v(g.birth)&&v(g.survival)))throw new Kt(`${e}.rules must be {birth, survival}, as in its result file.`)}if("seedCells"in n&&!(Number.isSafeInteger(n.seedCells)&&n.seedCells>=1))throw new Kt(`${e}.seedCells must be the number of cells in its seed, as in its result file.`);if(typeof p!="string"||!HE.test(p))throw new Kt(`${e}.result must be a .json under hall-of-fame/results/.`)}function xa(n){if(!cr(n)||Ls(Object.keys(n))!=='["entries"]'||!Array.isArray(n.entries))throw new Kt('The Hall of Fame must be {"entries": [...]}.');const e=new Set;return n.entries.forEach((t,i)=>{if(XE(t,`entries[${i}]`),e.has(t.result))throw new Kt(`entries[${i}].result is another entry's too.`);e.add(t.result)}),n.entries}function ya(n,e){const t=gm[e.kind]??(()=>0);return n.map((i,s)=>({entry:i,order:s})).filter(({entry:i})=>i.contest===e.id).sort((i,s)=>t(i.entry,s.entry)||(i.entry.date<s.entry.date?-1:i.entry.date>s.entry.date?1:0)||i.order-s.order).map(({entry:i})=>i)}function YE(n,e,t){const i=ya(n,e),s=gm[e.kind]??(()=>0);let r=0;for(;r<i.length&&s(i[r],t)<=0;)r++;return{place:r+1,of:i.length+1,above:i[r-1]??null,below:i[r]??null,ranked:i}}function qE(n){const[e,t,i]=n.split("-").map(Number);return new Date(Date.UTC(e,t-1,i)).toLocaleDateString("en-GB",{day:"numeric",month:"short",year:"numeric",timeZone:"UTC"})}const rf="http://www.w3.org/2000/svg",Sa=Object.freeze({speed:Object.freeze({color:"#f2c14e",name:"Speed"}),methuselah:Object.freeze({color:"#b39cff",name:"Methuselah"}),"classic-methuselah":Object.freeze({color:"#e29cf5",name:"Classic Methuselah"}),"contained-chaos":Object.freeze({color:"#4fd1c5",name:"Contained chaos"})}),jE={speed:[["circle",{cx:14,cy:13.5,r:7.5}],["path",{d:"M14 13.5 L17.2 10.3"}],["path",{d:"M12 3.5 H16 M14 3.5 V6"}],["path",{d:"M19.6 6.4 L21 5"}],["path",{d:"M1.5 10.5 H4.5 M0.8 13.5 H4 M1.5 16.5 H4.5"}]],methuselah:[["path",{d:"M6 2.5 H18 M6 21.5 H18"}],["path",{d:"M7.5 2.5 C7.5 8 11 9.5 12 12 C13 9.5 16.5 8 16.5 2.5"}],["path",{d:"M7.5 21.5 C7.5 16 11 14.5 12 12 C13 14.5 16.5 16 16.5 21.5"}],["path",{d:"M9.3 20.3 C10 18.2 11.3 17.4 12 17.2 C12.7 17.4 14 18.2 14.7 20.3 Z",fill:"currentColor",stroke:"none"}]],"classic-methuselah":[["path",{d:"M2 2.5 H13 M2 21.5 H13"}],["path",{d:"M3.3 2.5 C3.3 8 6.6 9.5 7.5 12 C8.4 9.5 11.7 8 11.7 2.5"}],["path",{d:"M3.3 21.5 C3.3 16 6.6 14.5 7.5 12 C8.4 14.5 11.7 16 11.7 21.5"}],["path",{d:"M5 20.3 C5.7 18.2 6.9 17.4 7.5 17.2 C8.1 17.4 9.3 18.2 10 20.3 Z",fill:"currentColor",stroke:"none"}],["path",{d:"M14.5 9.5 H16.5 M14 12 H16 M14.5 14.5 H16.5"}],["rect",{x:18,y:8.6,width:2.4,height:2.4,rx:.4,fill:"currentColor",stroke:"none"}],["rect",{x:20.6,y:10.8,width:2.4,height:2.4,rx:.4,fill:"currentColor",stroke:"none"}],["rect",{x:18,y:13,width:2.4,height:2.4,rx:.4,fill:"currentColor",stroke:"none"}]],verify:[["circle",{cx:12,cy:3.6,r:1.1}],["path",{d:"M12 4.7 V20 M8 20.5 H16 M4.5 7 H19.5"}],["path",{d:"M4.5 7 L2.2 13.2 M4.5 7 L6.8 13.2 M19.5 7 L17.2 13.2 M19.5 7 L21.8 13.2"}],["path",{d:"M1.8 13.2 H7.2 C6.8 15.6 2.2 15.6 1.8 13.2 Z M16.8 13.2 H22.2 C21.8 15.6 17.2 15.6 16.8 13.2 Z"}]],"contained-chaos":[["rect",{x:2.5,y:2.5,width:19,height:19,rx:3}],["path",{d:"M6 15 C7 8 10 17.5 11.5 10 C12.5 5.5 15.5 7.5 13.5 12 C11.8 15.8 16.5 18 18 9.5"}],["circle",{cx:7.5,cy:7,r:.9,fill:"currentColor",stroke:"none"}],["circle",{cx:17.5,cy:17.5,r:.9,fill:"currentColor",stroke:"none"}],["circle",{cx:9,cy:18.5,r:.9,fill:"currentColor",stroke:"none"}]]};function zs(n){return n.kind==="methuselah"&&n.departures?"classic-methuselah":n.kind}function Ou(n,e=48,t="contests-logo"){return vm(n,e,t,Sa[n]?.color)}function _m(n=22,e="contests-verify-glyph"){return vm("verify",n,e)}function vm(n,e,t,i){const s=document.createElementNS(rf,"svg"),r={class:t,viewBox:"0 0 24 24",width:e,height:e,fill:"none",stroke:"currentColor","stroke-width":1.6,"stroke-linecap":"round","stroke-linejoin":"round","aria-hidden":"true"};for(const[o,a]of Object.entries(r))s.setAttribute(o,String(a));i&&(s.style.color=i);for(const[o,a]of jE[n]??[]){const l=document.createElementNS(rf,o);for(const[c,u]of Object.entries(a))l.setAttribute(c,String(u));s.append(l)}return s}const KE=["speed","methuselah"],ZE=n=>KE.includes(n.kind),xm="The time is measured by your own browser, on your own machine. Replaying a result proves that its generation is right, but not how long it took, so the Speed board is self-reported.",ym="Your score depends only on the seed and the rules, never on time or the machine: anyone replaying the result file, in the lab or with scripts/verify.mjs, gets the same ending and the same score.",JE="This is a stricter methuselah than classic Life's: the whole pattern must settle inside the arena, and anything that flies off ends the run unscored. Classic Methuselah lets ships leave.",QE="Opens this entry's seed and rules in Game of Life 3D (unbounded), in the seed editor",e1=n=>`Unlike Methuselah, a ship may leave the arena here: an island that reaches a wall and is a ship heading out, of period up to ${n.departures.period}, the longest recognised, is deleted and listed as a departure, and the rest of the pattern must still settle.`,de={open:!1,contest:null,run:null,startedAt:0,verify:null,view:null,entries:new Map,refused:null,designInExplore:null,resume:null},_t=n=>document.getElementById(n);function F(n,e={},...t){const i=document.createElement(n);e.className&&(i.className=e.className),e.text!==void 0&&(i.textContent=e.text),e.onclick&&(i.onclick=e.onclick);for(const[s,r]of Object.entries(e.attrs??{}))i.setAttribute(s,r);return i.append(...t.filter(Boolean)),i}function wt(n,e,{main:t=!1,id:i,title:s}={}){const r={type:"button"};return i&&(r.id=i),s&&(r.title=s),F("button",{className:`glass-button contests-button${t?" contests-button--main":""}`,text:n,onclick:e,attrs:r})}function Ma(n="Verify a result",{wide:e=!1}={}){return F("button",{className:`contests-verify-button${e?" contests-verify-button--wide":""}`,onclick:R1,attrs:{type:"button",id:"contests-verify"}},_m(e?28:20),F("span",{className:"contests-verify-text"},F("span",{className:"contests-verify-label",text:n}),e?F("span",{className:"contests-verify-sub",text:"Replay a result file from any contest to check it, in your browser"}):null))}function Bu(n,e){const t=F("dl",{className:"contests-facts"});return n.forEach(([i,s],r)=>{const o=F("dd",{},typeof s=="string"?document.createTextNode(s):s);e&&(o.id=`${e}-${r}`),t.append(F("dt",{text:i}),o)}),t}function On(n,e,t){de.view=n,_t("contests-panel-title").textContent=e,_t("contests-panel-body").replaceChildren(...t.filter(Boolean)),Pt("");const i=_t("contests-panel-body");(i.querySelector(".contests-button--main:not([disabled])")??i.querySelector("button:not([disabled])"))?.focus({preventScroll:!0})}function Pt(n){_t("contests-panel-status").textContent=n}function en(n,e,t){n!==void 0&&(_t("contest-hud-name").textContent=n),e!==void 0&&(_t("contest-hud-status").textContent=e),t!==void 0&&(_t("contest-hud-generation").textContent=t)}function t1({designInExplore:n=null}={}){de.open=!0,de.designInExplore=n,_t("contests-panel").hidden=!1;const e=_t("contests-verify-file");e.onchange=()=>{const s=e.files?.[0];e.value="",s&&C1(s)};const t=_t("contests-seed-file");t.onchange=()=>{const s=t.files?.[0];t.value="",s&&de.contest&&f1(de.contest,s)};const i=de.resume;if(de.resume=null,!i){Ur();return}i.board?bm(i.contest):Yi(i.contest),i.place&&_t(`contests-hof-open-${i.place}`)?.focus()}function n1(){de.open=!1,Ko({quietly:!0}),es(),ku(),_t("contests-panel").hidden=!0,_t("contests-panel-body").replaceChildren(),de.view=null}function i1(n){if(de.view!=="running"||!de.startedAt||!(de.run instanceof fm))return;const e=n-de.startedAt,t=_t("contests-countdown");t&&(t.textContent=Lp(de.run.seconds,e));const i=_t("contests-clock-arc");i&&(i.style.strokeDashoffset=String(Math.min(100,e/(de.run.seconds*1e3)*100)))}function es(){de.run?.close(),de.run=null,de.startedAt=0}function ku(){de.verify?.cancel(),de.verify=null}function s1(n){const e=F("button",{className:"contests-tile",onclick:()=>Yi(n),attrs:{type:"button",id:`contests-open-${n.id}`}},Ou(zs(n),56,"contests-tile-logo"),F("span",{className:"contests-tile-name",text:n.title}),F("span",{className:"contests-tile-about",text:n.summary}),F("span",{className:"contests-tile-foot",text:"Open"}));return e.style.setProperty("--contest-color",Sa[zs(n)].color),e}function Ur(){es(),ku(),de.contest=null,en("–","Choosing","–");const n=F("div",{className:"contests-tiles"},...zo.filter(ZE).map(s1));On("list",Er,[F("p",{text:"Three contests on the engine of Game of Life 3D (unbounded). Each fixes its own rules, and all run on the CPU, so every entrant runs the same thing. Anyone can check any result by replaying it.",attrs:{id:"contests-list-about"}}),F("p",{className:"contests-closes",text:vu(zo),attrs:{id:"contests-closes"}}),n,F("div",{className:"contests-judge"},F("span",{className:"contests-judge-title",text:"For every contest"}),Ma("Verify a result",{wide:!0}))])}function Zt(n,...e){return F("section",{className:"contests-section"},F("h3",{className:"contests-section-title",text:n}),...e)}function qn(n,e,t){return F("div",{className:"contests-fact"},F("span",{className:"contests-fact-label",text:n}),F("span",{className:"contests-fact-value",text:e}),F("span",{className:"contests-fact-about",text:t}))}function Sm(n,e,{disabled:t=!1}={}){const i=F("button",{className:"contests-run-button",onclick:()=>S1(n),attrs:{type:"button",id:"contests-run"}},F("span",{className:"contests-run-icon",attrs:{"aria-hidden":"true"}}),F("span",{className:"contests-run-text"},F("span",{className:"contests-run-label",text:`Run ${n.title}`}),F("span",{className:"contests-run-sub",text:e})));return i.disabled=t,i}function Mm(n){const e=F("div",{className:"contests-page-head"},Ou(zs(n),64,"contests-page-logo"),F("div",{},F("p",{className:"contests-page-kicker",text:`A ${Er} contest`}),F("p",{className:"contests-page-summary",text:`${n.summary}.`}),F("p",{className:"contests-closes",text:vu([n])})));return e.style.setProperty("--contest-color",Sa[zs(n)].color),e}function Yi(n){if(es(),de.contest=n,en(n.title,"Ready","–"),n.kind==="methuselah"){r1(n);return}const{fixes:e}=n,{birth:t,survival:i}=e.rules,s=o=>o.length>1?`${o[0]}–${o[o.length-1]}`:String(o[0]),r=Sm(n,`${n.seconds} seconds, on your machine`);On("contest",n.title,[Mm(n),r,Zt("What everyone runs",F("div",{className:"contests-facts-grid"},qn("Seed","Cube10",`All ${ne(e.seed.length)} cells of the 10³ seed box, cells −5 to 4 on each axis`),qn("Rules",$s(e.rules),`A cell is born with ${s(t)} live neighbours, and survives with ${s(i)}`),qn("Time",`${n.seconds} seconds`,"Timed by your own browser"),qn("Ceiling",`${ne(n.ceiling)} generations`,"A run that reaches it sooner also scores its time"))),wm(n),Zt("How it runs",F("p",{text:`On the CPU, in a background thread (a Web Worker), with chunks of ${n.chunkSize}³ cells, so every entrant runs the same engine. Nothing is drawn while it runs, so the run has your machine to itself. Your score is the generations completed in the ${n.seconds} seconds. Runs that reach the ceiling of ${ne(n.ceiling)} all have the same generations, so they rank by the time they took, to the millisecond.`})),Zt("Fair play",F("p",{className:"contests-note",text:xm})),F("div",{className:"contests-actions"},Ma(),wt("Back",Ur,{id:"contests-back"}))]),r.focus({preventScroll:!0})}function r1(n){const e=de.entries.get(n.id)??null,{fixes:t}=n,i=r=>r.max[0]-r.min[0]+1,s=Sm(n,e?`Up to ${ne(n.budget)} generations, on your machine: it can take a few minutes`:"Load a seed first",{disabled:!e});On("contest",n.title,[Mm(n),a1(n,e),s,Zt("What the contest fixes",F("div",{className:"contests-facts-grid"},qn("Arena",pc(t.arena),`Cells ${t.arena.min[0]} to ${t.arena.max[0]} on each axis. The cells never see its walls: it only decides when a run is over`),qn("Seed box",`${i(t.seedBox)}³`,`Your seed: 1 to ${ne(i(t.seedBox)**3)} cells, all within cells ${t.seedBox.min[0]} to ${t.seedBox.max[0]} on each axis, never shifted`),qn("Budget",`${ne(n.budget)} generations`,`A pattern still unsettled at generation ${ne(n.budget)} scores nothing`),qn("Top score",ne(n.budget-1),`A run scores once its final state or cycle closes, by generation ${ne(n.budget)}`),n.departures?qn("Ships leave",`Period ≤ ${n.departures.period}`,"A ship heading out through a wall is deleted and listed; anything else at the edge ends the run"):null)),Zt("How a run ends",o1(n),n.departures?F("p",{className:"contests-note",text:e1(n),attrs:{id:"contests-differs"}}):F("p",{className:"contests-note",text:JE,attrs:{id:"contests-strict"}})),wm(n),Zt("How it runs",F("p",{text:`On the CPU, in a background thread (a Web Worker), with chunks of ${n.chunkSize}³ cells, and nothing drawn while it runs. A run can take a few minutes. A repeat is confirmed cell for cell before it ends a run.${n.departures?` A ship needs no catalogue: under your rules, an island at a wall is a ship if, run alone, it returns to its own shape, moved, within ${n.departures.period} generations.`:""} Equal scores rank by fewer seed cells, then the earlier submission.`})),Zt("Fair play",F("p",{className:"contests-note",text:ym})),F("div",{className:"contests-actions"},Ma(),wt("Back",Ur,{id:"contests-back"}))]),(e?s:_t("contests-load-seed"))?.focus({preventScroll:!0})}function o1(n){const e=ne(n.budget),t=n.departures,i=[["Death","No live cells remain, by generation "+ne(n.budget-1),"The generation the last cell died"],["Repeat",`The cells equal, in place, those of an earlier generation h, by generation ${e}${t?", with no ship leaving in the cycle":""}`,"h, where the final cycle began"],t?["Emits","The cells repeat, but ships leave the arena during the cycle","None: it never settles"]:null,t?["Edge",`A step would bring a cell to life outside the arena, from something that isn't a ship of period up to ${ne(t.period)} heading out`,"None"]:["Edge","A step would bring a cell to life outside the arena","None"],["Budget",`Generation ${e} is reached unsettled`,"None"]].filter(Boolean);return F("table",{className:"contests-endings",attrs:{id:"contests-endings"}},F("thead",{},F("tr",{},F("th",{text:"Ending"}),F("th",{text:"When"}),F("th",{text:"Score"}))),F("tbody",{},...i.map(([s,r,o])=>F("tr",{},F("th",{text:s,attrs:{scope:"row"}}),F("td",{text:r}),F("td",{text:o})))))}function a1(n,e){const t=wt(e?"Load another simulation…":"Load simulation…",()=>_t("contests-seed-file").click(),{main:!e,id:"contests-load-seed"}),i=de.designInExplore?wt("Design a seed…",()=>l1(n),{id:"contests-design-seed",title:"Opens the seed editor in Game of Life 3D (unbounded), in this contest's arena"}):null,s=de.refused?.contest===n.id?F("p",{className:"contests-refused",text:de.refused.message,attrs:{id:"contests-entry-refused",role:"alert"}}):null;if(!e)return Zt("Your entry",F("p",{text:"A simulation file: a seed and its rules.",attrs:{id:"contests-entry-none"}}),s,F("div",{className:"contests-actions"},t,i));const r=e.seed.length,o=gg(e.rules);return Zt("Your entry",F("div",{className:"contests-entry"},u1(e.seed,n.fixes.seedBox),F("div",{className:"contests-entry-facts"},Bu([["Seed",`${ne(r)} cell${r===1?"":"s"}`],["Rules",$s(e.rules)],["File",e.source]],"contests-entry"))),...o.map(a=>F("p",{className:"contests-warning",text:a,attrs:{id:"contests-entry-warning",role:"note"}})),s,F("div",{className:"contests-actions"},t,i))}function l1(n){const e=de.designInExplore;if(!e)return;de.resume={contest:n};const{arena:t}=n.fixes;e({note:`For ${n.title}: keep the seed in this 10³ box, Use it, and save the simulation with the Simulation box's save icon. The Contests banner brings you back.`,arena:t.max[0]-t.min[0]+1,title:n.title,ships:!!n.departures})}const c1="http://www.w3.org/2000/svg";function u1(n,e){const t=Nw(n,e),i=(r,o)=>{const a=document.createElementNS(c1,r);for(const[l,c]of Object.entries(o))a.setAttribute(l,String(c));return a},s=i("svg",{class:"contests-seed-picture",viewBox:`0 0 ${t.width} ${t.height}`,width:t.width,height:t.height,role:"img","aria-label":`The seed: ${ne(n.length)} live cells in the seed box`,id:"contests-seed-picture"});s.append(i("polygon",{class:"contests-seed-box",points:t.outline}));for(const r of t.cubes)s.append(i("polygon",{class:"contests-seed-top",points:r.top}),i("polygon",{class:"contests-seed-right",points:r.right}),i("polygon",{class:"contests-seed-left",points:r.left}));return s.append(i("path",{class:"contests-seed-edges",d:t.edges})),s}function d1(n,{rules:e,cells:t},i){const s=[];for(let o=0;o<t.length;o+=3)s.push([t[o],t[o+1],t[o+2]]);let r;try{r=Wc(n,{rules:e,seed:s})}catch(o){if(!(o instanceof Le))throw o;const a=h1(s,n.fixes.seedBox);return a>1?`${o.message} ${ne(a)} of its ${ne(s.length)} cells are outside it.`:o.message}return de.entries.set(n.id,{rules:r.rules,seed:r.seed,source:i}),null}function h1(n,e){return n.filter(t=>t.some((i,s)=>i<e.min[s]||i>e.max[s])).length}async function f1(n,e){const t=de.view;let i=null;if(e.size>64*1024*1024)i="The file is larger than 64 MB, so it isn't a simulation file. It wasn't read.";else try{const s=await e.text(),r=Ef(s);i=r.rules?d1(n,r,e.name):"This is a seed file: it holds cells, but no rules, so it isn't a simulation, and an entry is one. In Game of Life 3D (unbounded), load it in the Seed box, set the rules, and save both with the Simulation box's save icon, as a simulation file."}catch(s){i=/"format"\s*:\s*"morpheus-tech-lab\/result"/.test(await e.slice(0,4096).text().catch(()=>""))?"This is a result file, not a simulation file. Check one with Verify a result; load a simulation saved with Save simulation.":s?.message??String(s)}de.contest!==n||de.view!==t||!de.open||(de.refused=i?{contest:n.id,message:`Not loaded: ${i}`}:null,Yi(n),i||Pt(`Loaded ${e.name}.`))}const zu=n=>`/${n}`;function wm(n){let e;try{e=ya(xa(va),n)}catch(i){return Zt("Hall of Fame",F("p",{className:"contests-note",text:`The Hall of Fame couldn't be read: ${i.message}`}))}if(!e.length)return Zt("Hall of Fame",F("p",{className:"contests-hof-empty",text:`No entries yet. Run ${n.title}, then Submit by email from your results card: once verified, entries are listed here.`,attrs:{id:"contests-hof-empty"}}));const t=e.slice(0,zE);return Zt("Hall of Fame",F("ol",{className:"contests-hof",attrs:{id:"contests-hof"}},...t.map((i,s)=>Em(i,s+1,n))),e.length>t.length?F("div",{className:"contests-actions"},wt(`Show all ${ne(e.length)} entries`,()=>bm(n),{id:"contests-hof-all"})):null)}function bm(n){es(),de.contest=n,en(n.title,"Ready","–");let e=[];try{e=ya(xa(va),n)}catch{Yi(n);return}On("board",`${n.title}: Hall of Fame`,[F("p",{className:"contests-note",text:`All ${ne(e.length)} entries, best first.`,attrs:{id:"contests-board-about"}}),F("ol",{className:"contests-hof",attrs:{id:"contests-hof"}},...e.map((t,i)=>Em(t,i+1,n))),F("div",{className:"contests-actions"},wt(`Back to ${n.title}`,()=>Yi(n),{id:"contests-back",main:!0}))])}function Em(n,e,t){const i=Tm(n),s=da(t,n.score),r=wt("Watch",null,{id:`contests-hof-watch-${e}`});r.onclick=()=>m1(n,`Hall of Fame: ${n.name}, ${s}`,r),r.setAttribute("aria-label",`Watch ${n.name}'s run`);let o=null;t.kind==="methuselah"&&de.designInExplore&&(o=wt("Open seed",null,{id:`contests-hof-open-${e}`,title:QE}),o.onclick=()=>g1(n,t,e),o.setAttribute("aria-label",`Open ${n.name}'s seed and rules in Game of Life 3D (unbounded)`));const a=n.browser?`${n.browser.name} ${n.browser.version}`:"Browser not given";return F("li",{className:"contests-hof-entry"},F("span",{className:"contests-hof-place",text:String(e)}),i,F("span",{className:"contests-hof-who"},F("span",{className:"contests-hof-name",text:n.name}),F("span",{className:"contests-hof-meta",text:`${a} · ${qE(n.date)}`})),p1(t,n),F("span",{className:"contests-hof-actions"},r,o))}function Tm(n,{lazy:e=!0}={}){const t=F("img",{className:"contests-hof-picture",attrs:{src:n.picture?zu(n.picture):Qh,alt:"",width:"40",height:"40",loading:e?"lazy":"eager",decoding:"async"}});return t.onerror=()=>{t.onerror=null,t.src=Qh},n.picture||t.classList.add("contests-hof-picture--logo"),t}function p1(n,e){const{main:t,detail:i}=_u(n,e.score,e);return F("span",{className:"contests-hof-score"},F("span",{className:"contests-hof-score-main",text:t}),i?F("span",{className:"contests-hof-score-detail",text:i}):null)}async function Am(n,e){const t=de.view;Pt("Loading the entry's result file…");let i;try{const s=await fetch(zu(n.result));if(!s.ok)throw new Error(`the site answered ${s.status}.`);const r=await s.text();if(r.length>An)throw new Error(`it is larger than ${An/1024/1024} MB.`);i=ta(r)}catch(s){return de.view===t&&Pt(`It can't be ${e}: ${s?.message??s}`),null}return de.view!==t||!de.open?null:(Pt(""),i)}async function m1(n,e,t){const i=await Am(n,"watched");i&&Vu(i,e,t)}async function g1(n,e,t){const i=de.designInExplore;if(!i)return;const s=de.view==="board",r=await Am(n,"opened");if(!r)return;const{arena:o}=e.fixes;de.resume={contest:e,board:s,place:t};const a=i({note:`${n.name}'s ${e.title} entry: its seed and rules. Change it if you like, Use it, and save the simulation with the Simulation box's save icon; Load simulation… on ${e.title}'s page then enters it as your own. The Contests banner brings you back.`,arena:o.max[0]-o.min[0]+1,title:e.title,ships:!!e.departures,entry:{name:`${e.title}: ${n.name}`,cells:Int32Array.from(r.run.seed.flat()),rules:r.run.rules}});a&&(de.resume=null,Pt(`It can't be opened: ${a}`))}const _1="http://www.w3.org/2000/svg";function at(n,e={},t){const i=document.createElementNS(_1,n);for(const[s,r]of Object.entries(e))i.setAttribute(s,String(r));return t!==void 0&&(i.textContent=t),i}function Gu(n){return n.kind==="speed"?{seconds:n.seconds,label:"Generations completed over the run",title:"Generations completed",subtitle:`over the ${n.seconds} seconds: the steeper the line, the faster the machine`,xTitle:"Time (seconds)",yTitle:"Generations",readout:e=>`${e.at.toFixed(2)} s · ${ne(e.value)} generations`,columns:["Time (s)","Generations"],row:([e,t])=>[e.toFixed(2),ne(t)]}:{label:"Live cells by generation",title:"Live cells",subtitle:"by generation: how the pattern grew, and where it settled",xTitle:"Generation",yTitle:"Live cells",readout:e=>`generation ${ne(e.at)} · ${ne(e.value)} live cells`,columns:["Generation","Live cells"],row:([e,t])=>[ne(e),ne(t)]}}function Hu(n,{table:e=!1,pace:t=null}={}){const{seconds:i}=n,s=at("svg",{class:"contests-chart-svg",role:"img","aria-label":t?`${n.label}, against the Hall of Fame's #1`:n.label});let r=null,o=[];function a(y,M,P){const E=`${M}x${P}:${y.yTicks[y.yTicks.length-1].value}`;if(E===r)return o;r=E;const A=vw(t,y);return o=[A.line?at("polyline",{class:"contests-chart-pace",points:A.line,id:"contests-chart-pace"}):null,at("circle",{class:`contests-chart-pace-dot${A.line?"":" contests-chart-pace-dot--mark"}`,cx:A.end.x,cy:A.end.y,r:A.line?3:5,id:"contests-chart-pace-end"}),at("text",{class:"contests-chart-pace-label",x:A.end.x-6,y:A.end.y-10,"text-anchor":"end"},`#1 · ${A.end.label}`)].filter(Boolean),o}const l=F("div",{className:"contests-chart-readout",attrs:{"aria-hidden":"true"}});l.hidden=!0;const c=e?F("details",{className:"contests-chart-table"},F("summary",{text:"Show the data as a table"})):null,u=F("figure",{className:"contests-chart"},F("figcaption",{className:"contests-chart-caption"},F("span",{className:"contests-chart-title",text:n.title}),F("span",{className:"contests-chart-subtitle",text:n.subtitle})),F("div",{className:"contests-chart-plot"},s,l),c);let d=null,h=[];function p(){const y=Math.max(280,Math.round(s.parentElement?.clientWidth||520));m=Math.round(u.clientWidth);const M=Math.round(Math.min(260,Math.max(200,y*.42)));s.setAttribute("viewBox",`0 0 ${y} ${M}`),s.setAttribute("width",y),s.setAttribute("height",M),d=hw(h,{seconds:i,width:y,height:M,floor:t?Dp(t):0});const{plot:P}=d,E=[];for(const A of d.yTicks)E.push(at("line",{class:"contests-chart-grid",x1:P.left,x2:P.right,y1:A.at,y2:A.at})),E.push(at("text",{class:"contests-chart-tick",x:P.left-8,y:A.at,"text-anchor":"end","dominant-baseline":"middle"},A.label));for(const A of d.xTicks)E.push(at("text",{class:"contests-chart-tick",x:A.at,y:P.bottom+16,"text-anchor":"middle"},A.label));E.push(at("line",{class:"contests-chart-axis",x1:P.left,x2:P.right,y1:P.bottom,y2:P.bottom})),E.push(at("text",{class:"contests-chart-axis-title",x:(P.left+P.right)/2,y:M-4,"text-anchor":"middle"},n.xTitle)),E.push(at("text",{class:"contests-chart-axis-title",x:0,y:0,"text-anchor":"middle",transform:`translate(14 ${(P.top+P.bottom)/2}) rotate(-90)`},n.yTitle)),t&&E.push(...a(d,y,M)),d.end&&(E.push(at("path",{class:"contests-chart-area",d:d.area})),E.push(at("polyline",{class:"contests-chart-line",points:d.line})),E.push(at("circle",{class:"contests-chart-dot",cx:d.end.x,cy:d.end.y,r:4})),E.push(at("text",{class:"contests-chart-end",x:d.end.x+8,y:d.end.y,"dominant-baseline":"middle"},d.end.label))),E.push(at("line",{class:"contests-chart-crosshair",y1:P.top,y2:P.bottom,x1:0,x2:0,visibility:"hidden"})),E.push(at("circle",{class:"contests-chart-dot contests-chart-hover",r:4,cx:0,cy:0,visibility:"hidden"})),s.replaceChildren(...E)}function g(y){if(!d?.end)return;const M=s.getBoundingClientRect(),P=(y.clientX-M.left)/M.width*s.viewBox.baseVal.width,E=d.nearest(P);if(!E)return;const[A,R]=[s.querySelector(".contests-chart-crosshair"),s.querySelector(".contests-chart-hover")];A.setAttribute("x1",E.x),A.setAttribute("x2",E.x),A.setAttribute("visibility","visible"),R.setAttribute("cx",E.x),R.setAttribute("cy",E.y),R.setAttribute("visibility","visible"),l.textContent=n.readout(E),l.hidden=!1;const w=M.width/s.viewBox.baseVal.width;l.style.left=`${Math.min(E.x*w+10,M.width-l.offsetWidth-4)}px`,l.style.top=`${Math.max(0,E.y*w-34)}px`}function v(){s.querySelector(".contests-chart-crosshair")?.setAttribute("visibility","hidden"),s.querySelector(".contests-chart-hover")?.setAttribute("visibility","hidden"),l.hidden=!0}s.addEventListener("pointermove",g),s.addEventListener("pointerleave",v);let m=0;typeof ResizeObserver=="function"&&new ResizeObserver(([y])=>{const M=Math.round(y.contentRect.width);M&&M!==m&&d&&p()}).observe(u);let f=null;function T(){if(!c?.open||f===h)return;f=h,c.querySelector("table")?.remove();const y=h.map(M=>F("tr",{},...n.row(M).map(P=>F("td",{text:P}))));c.append(F("table",{},F("thead",{},F("tr",{},...n.columns.map(M=>F("th",{text:M})))),F("tbody",{},...y)))}return c?.addEventListener("toggle",T),{node:u,update(y){h=y.slice(),p(),T()}}}function Jo(n,e){return F("div",{className:"contests-stats"},...n.map(([t,i],s)=>F("div",{className:"contests-stat"},F("span",{className:"contests-stat-label",text:t}),F("span",{className:"contests-stat-value",text:i,attrs:e?{id:`${e}-${s}`}:{}}))))}function v1(n){try{return ya(xa(va),n)[0]??null}catch{return null}}async function x1(n,e){try{const t=await fetch(zu(n.result));if(!t.ok)throw new Error(`the site answered ${t.status}`);const i=await t.text();if(i.length>An)throw new Error("its result file is too large");return{entry:n,pace:gw(ta(i),e)}}catch(t){return{failed:t?.message??String(t)}}}function y1(n,{entry:e,pace:t}){const{main:i}=_u(n,e.score,e);return F("div",{className:"contests-race",attrs:{id:"contests-race"}},Tm(e,{lazy:!1}),F("span",{className:"contests-race-who"},F("span",{className:"contests-race-kicker"},F("span",{className:"contests-race-swatch",attrs:{"aria-hidden":"true"}}),document.createTextNode(t.points?"Racing the Hall of Fame's #1":"Racing the Hall of Fame's #1, by its final mark")),F("span",{className:"contests-race-name",text:e.name,attrs:{id:"contests-race-name"}}),F("span",{className:"contests-race-score",text:i})),F("span",{className:"contests-race-gap",text:Ip(t,[0,0]).text,attrs:{id:"contests-race-gap","data-gap":"0"}}))}async function S1(n){if(n.kind==="methuselah"){M1(n);return}es();const e=v1(n);let t=null;if(e){const a=_t("contests-run");if(a&&(a.disabled=!0),Pt("Loading the Hall of Fame's #1…"),t=await x1(e,n),de.view!=="contest"||de.contest!==n||!de.open)return}const i=t&&!t.failed?t:null,s=Hu(Gu(n),{pace:i?.pace??null}),r=new fm(n,{onStart:()=>{de.run===r&&(de.startedAt=performance.now(),en(void 0,"Running"))},onStats:a=>de.run===r&&b1(a,s,i),onEnd:a=>de.run===r&&Cm(r,a,i),onError:a=>de.run===r&&Pt(`The engine says: ${a}`)});de.run=r;const o=at("svg",{class:"contests-clock-ring",viewBox:"0 0 160 160","aria-hidden":"true"});o.append(at("circle",{class:"contests-clock-track",cx:80,cy:80,r:72}),at("circle",{class:"contests-clock-arc",cx:80,cy:80,r:72,pathLength:100,id:"contests-clock-arc"})),On("running",`${n.title}: running`,[F("div",{className:"contests-run-top"},F("div",{className:"contests-clock"},o,F("div",{className:"contests-clock-face"},F("span",{className:"contests-countdown-value",text:Lp(n.seconds,0),attrs:{id:"contests-countdown"}}),F("span",{className:"contests-clock-unit",text:"seconds left"}))),Jo(ks(Rm(n)),"contests-stat")),i?y1(n,i):null,s.node,F("div",{className:"contests-actions"},wt("Stop",()=>r.stop(),{id:"contests-stop"}))]),t?.failed&&Pt(`The Hall of Fame's #1 couldn't be loaded (${t.failed}), so this run races no one.`),s.update(r.points),en(n.title,"Starting","0"),r.start()}function M1(n){const e=de.entries.get(n.id);if(!e)return;es();const t=Hu(Gu(n));let i;try{i=new bE(n,{rules:e.rules,seed:e.seed},{onStart:()=>de.run===i&&en(void 0,"Running"),onStats:r=>de.run===i&&w1(i,r,t),onEnd:r=>de.run===i&&Cm(i,r),onError:r=>de.run===i&&Pt(`The engine says: ${r}`)})}catch(r){Pt(`It can't run: ${r.message}`);return}de.run=i;const s=at("svg",{class:"contests-clock-ring",viewBox:"0 0 160 160","aria-hidden":"true"});s.append(at("circle",{class:"contests-clock-track",cx:80,cy:80,r:72}),at("circle",{class:"contests-clock-arc",cx:80,cy:80,r:72,pathLength:100,id:"contests-clock-arc",style:"stroke-dashoffset: 100"})),s.style.setProperty("--contest-color",Sa[zs(n)].color),On("running",`${n.title}: running`,[F("div",{className:"contests-run-top"},F("div",{className:"contests-clock contests-clock--budget",attrs:{role:"group","aria-label":"Generation, out of the budget"}},s,F("div",{className:"contests-clock-face"},F("span",{className:"contests-countdown-value contests-countdown-value--small",text:"0",attrs:{id:"contests-countdown"}}),F("span",{className:"contests-clock-unit",text:`of ${ne(i.budget)} generations`,attrs:{id:"contests-budget"}}))),Jo(ks(Rm(n)),"contests-stat")),t.node,F("p",{className:"contests-note",text:`Running ${$s(e.rules)} from ${ne(e.seed.length)} seed cells until the pattern settles, reaches the edge of the arena, or reaches generation ${ne(i.budget)}.${n.departures?` Ships of period up to ${ne(n.departures.period)} leave at the edge, and are counted.`:""} Stop ends it without a score.`}),F("div",{className:"contests-actions"},wt("Stop",()=>i.stop(),{id:"contests-stop"}))]),t.update(i.points),en(n.title,"Starting","0"),i.start()}function w1(n,e,t){ks(e).forEach(([,r],o)=>{const a=_t(`contests-stat-${o}`);a&&(a.textContent=r)});const i=_t("contests-countdown");i&&(i.textContent=ne(e.generation));const s=_t("contests-clock-arc");s&&(s.style.strokeDashoffset=String(100-Math.min(100,e.generation/n.budget*100))),t.update(n.points),en(void 0,void 0,Aw(e.generation,n.budget))}function Rm(n){const e={generation:0,rate:0,live:0,livePeak:0,chunks:0,memoryBytes:0,extent:null};return n?.departures&&(e.departed=0),e}function b1(n,e,t){if(ks(n).forEach(([,i],s)=>{const r=_t(`contests-stat-${s}`);r&&(r.textContent=i)}),e.update(de.run.points),t){const i=_t("contests-race-gap"),s=Ip(t.pace,de.run.points[de.run.points.length-1]);i&&(i.textContent=s.text,i.dataset.gap=String(Math.sign(s.gap)))}en(void 0,void 0,ne(n.generation))}async function Cm(n,e,t=null){const{stats:i,reason:s,score:r}=e,{contest:o}=n,a=o.kind==="speed";de.startedAt=0,en(o.title,r?"Finished":s==="stopped"||a?"Stopped":"No score",ne(i.generation));const l=wt("Run again",()=>Yi(o),{main:!r,id:"contests-again"}),c=wt(`Back to ${Er}`,Ur,{id:"contests-back"}),u=Hu(Gu(o),{table:!0,pace:a&&r?t?.pace??null:null}),d=a?ww(s,o):bw(s,o,e),h=a?null:Bu([["Seed",`${ne(n.run.seed.length)} cell${n.run.seed.length===1?"":"s"}`],["Rules",$s(n.run.rules)]],"contests-result-entry"),p=e.departures?F("p",{className:"contests-departures",text:`${Fp(e.departures)}.`,attrs:{id:"contests-departures"}}):null,g=a?Promise.resolve():n.loadHistory().then(()=>{de.run===n&&u.update(n.points)}).catch(()=>{});if(!r){if(await g,n.close(),de.run!==n)return;On("results",`${o.title}: no score`,[F("p",{className:"contests-ending",text:d,attrs:{id:"contests-ending"}}),p,u.node,h,Jo(ks(i)),F("div",{className:"contests-actions"},l,c)]),u.update(n.points);return}const v=wt("Export result",null,{main:!0,id:"contests-export"});v.disabled=!0;const m=wt("Watch",null,{id:"contests-watch-run"});m.disabled=!0;const f=F("p",{className:"contests-self-verified",text:`Watch plays the run back in 3D, replayed from its seed, and checks the replay's hash at generation ${ne(i.generation)} against this one.`,attrs:{id:"contests-self-verified","data-verdict":"pending"}}),T=a?Mw(r,o):Sw(r,s),y=da(o,r,s),M=F("span",{className:"contests-hero-meta",text:"Detecting the browser…",attrs:{id:"contests-hero-meta"}}),P=F("span",{className:"contests-hash",text:`Hashing generation ${ne(i.generation)}…`,attrs:{id:"contests-hash"}}),E=wt("Copy",null,{id:"contests-copy-hash"});E.disabled=!0;const A=F("section",{className:"contests-section contests-submit",attrs:{id:"contests-submit","aria-labelledby":"contests-submit-title"}},F("h3",{className:"contests-section-title",text:"Submit by email",attrs:{id:"contests-submit-title"}}),F("p",{className:"contests-note",text:"Ready once the result file is made."}));On("results",`${o.title}: your result`,[F("div",{className:"contests-hero",attrs:{role:"group","aria-label":`Your score: ${y}`}},F("span",{className:"contests-hero-kicker"},Ou(zs(o),22,"contests-hero-logo"),document.createTextNode(`${o.title} · your score`)),F("span",{className:"contests-hero-value",text:T.value,attrs:{id:"contests-score"}}),F("span",{className:"contests-hero-unit",text:T.unit,attrs:{id:"contests-score-unit"}}),M),u.node,F("p",{className:"contests-ending",text:d,attrs:{id:"contests-ending"}}),p,E1(o,r,a?void 0:n.run.seed.length),h,Jo(ks(i)),F("div",{className:"contests-hash-box"},F("span",{className:"contests-hash-label",text:"The result's hash"}),F("div",{className:"contests-hash-row"},P,E)),f,F("p",{className:"contests-note",text:a?xm:ym}),F("div",{className:"contests-actions"},v,m,l,c),A]),u.update(n.points);let R;try{await g;const S=await Bp();if(de.run!==n)return;const D=new Date().toLocaleDateString("en-GB",{day:"numeric",month:"short",year:"numeric"});M.textContent=`${S?`${S.name} ${S.version}`:"Browser not detected"} · ${D}`,R=await n.makeResult(S)}catch(S){de.run===n&&Pt(`The result file couldn't be made: ${S.message}`);return}finally{de.run===n&&n.close()}if(de.run!==n)return;P.textContent=R.result.hash,E.disabled=!1,E.onclick=()=>Ac(R.result.hash,"hash");const w=A1({contest:o,score:r,browser:R.result.details.browser,text:R.text,ending:s});A.replaceChildren(A.firstChild,...w.parts),v.disabled=!1,v.onclick=async()=>{const S=await Pm(o,r,R.text);S&&w.saved(S)},m.disabled=!1,m.onclick=()=>Vu(R.result,`${o.title}: ${y}`,m,f),(!_t("contests-panel").contains(document.activeElement)||document.activeElement===l)&&v.focus({preventScroll:!0})}function E1(n,e,t){let i;try{i=xa(va)}catch{return null}const s=YE(i,n,{score:e,seedCells:t}),r=F("p",{className:"contests-standing-place",text:`${pw(s.place,s.of)}.`,attrs:{id:"contests-standing-place"}}),o=F("p",{className:"contests-note",text:n.kind==="speed"?"As if entered today, after any entry with the same score, since it came first. Speed's times are self-reported, so the placing is too.":"As if entered today, after any entry with the same score, since it came first. The score is the same on any machine, so the placing is exact."});if(s.of===1)return Zt("Where you'd stand",r,o);const a=(c,u,d=!1)=>F("li",{className:`contests-standing-row${d?" contests-standing-row--you":""}`},F("span",{className:"contests-hof-place",text:String(u)}),F("span",{className:"contests-standing-name",text:d?"You":c.name}),F("span",{className:"contests-standing-score",text:_u(n,d?e:c.score,d?{seedCells:t}:c).main})),l=F("ol",{className:"contests-standing-near",attrs:{id:"contests-standing-near"}},s.above?a(s.above,s.place-1):null,a(null,s.place,!0),s.below?a(s.below,s.place+1):null);return Zt("Where you'd stand",r,l,T1(s.ranked.map(c=>c.score.generations),e.generations),o)}function T1(n,e){const[t,i]=[520,64],s=mw(n,e,{width:t,height:i}),r=at("svg",{class:"contests-strip",viewBox:`0 0 ${t} ${i}`,role:"img",id:"contests-strip","aria-label":`Every entry's score, from ${s.low.label} to ${s.high.label} generations, with yours, ${ne(e)}, marked`});return r.append(at("line",{class:"contests-strip-line",x1:s.left,x2:s.right,y1:s.y,y2:s.y}),...s.dots.map(o=>at("circle",{class:"contests-strip-dot",cx:o,cy:s.y,r:4})),at("circle",{class:"contests-strip-mine",cx:s.mine,cy:s.y,r:6,id:"contests-strip-mine"}),at("text",{class:"contests-strip-you",x:s.mine,y:s.y-12,"text-anchor":"middle"},"You"),at("text",{class:"contests-strip-end",x:s.low.x,y:i-4,"text-anchor":"start"},s.low.label),at("text",{class:"contests-strip-end",x:s.high.x,y:i-4,"text-anchor":"end"},s.high.label)),r}async function Pm(n,e,t){try{const i=await bu(Op(n,e),t,`Contest result, ${n.title}`);return Pt(i),i}catch(i){return i?.name!=="AbortError"&&Pt(`Not saved: ${i.message}`),null}}async function Ac(n,e){try{await navigator.clipboard.writeText(n),Pt("Copied.")}catch{Pt(`The browser didn't allow copying; select the ${e} and copy it by hand.`)}}function A1({contest:n,score:e,browser:t,text:i,ending:s}){const r=Op(n,e),o=FE(n,e,s),a=BE({contest:n,browser:t,fileName:r}),l=()=>F("strong",{className:"contests-submit-file",text:r}),c=F("p",{className:"contests-submit-done",attrs:{id:"contests-submit-saved"}});c.hidden=!0;const u=wt("Save result file",null,{id:"contests-submit-save"}),d=F("a",{className:"glass-button contests-button contests-submit-button",text:"Open the email",attrs:{id:"contests-submit-email",target:"_blank",rel:"noopener","aria-disabled":"true","aria-describedby":"contests-submit-wait"}}),h=F("p",{className:"contests-submit-wait",text:"Save the result file first.",attrs:{id:"contests-submit-wait"}}),p=(...y)=>F("li",{className:"contests-submit-step"},...y),g=p(F("p",{},document.createTextNode("Save your result file, "),l(),document.createTextNode(".")),u,c),v=p(F("p",{text:`Open the email to ${Tc}, with its text filled in.`}),d,h),m=y=>{c.textContent=y,c.hidden=!1,g.dataset.done="true",d.href=kE(o,a),d.removeAttribute("aria-disabled"),d.removeAttribute("aria-describedby"),h.hidden=!0,Pt(`${y} Now open the email, and attach ${r} to it.`)};u.onclick=async()=>{const y=await Pm(n,e,i);y&&(m(y),d.focus({preventScroll:!0}))},d.onclick=y=>{if(d.hasAttribute("href")){v.dataset.done="true";return}y.preventDefault(),Pt("Save the result file first: the email needs it attached."),u.focus({preventScroll:!0})};const f=(y,M,P,E)=>F("div",{className:"contests-submit-row"},F("span",{className:"contests-submit-label",text:y}),F("span",{className:"contests-submit-value",text:M,attrs:{id:P}}),wt("Copy",()=>Ac(M,E),{id:`${P}-copy`})),T=F("textarea",{className:"contests-submit-text",attrs:{id:"contests-submit-body",readonly:"",rows:"8",spellcheck:"false","aria-label":"The email's text"}});return T.value=a,{saved:m,parts:[F("p",{className:"contests-submit-lead",text:"Your entry is an email with your result file attached. Without the file, it can't be verified or listed."}),F("ol",{className:"contests-submit-steps"},g,v,p(F("p",{attrs:{id:"contests-submit-attach"}},F("strong",{text:"Attach "}),l(),F("strong",{text:" to the email"}),document.createTextNode(" by hand: an email link can't attach it for you. Add a picture if you like, fill in the name to show, keep or delete the Hall of Fame line, and send it.")))),F("details",{className:"contests-submit-webmail",attrs:{id:"contests-submit-webmail"}},F("summary",{text:"No mail app? Copy the address, subject and text into webmail"}),F("div",{className:"contests-submit-copy"},f("To",Tc,"contests-submit-to","address"),f("Subject",o,"contests-submit-subject","subject"),F("div",{className:"contests-submit-row contests-submit-row--text"},F("span",{className:"contests-submit-label",text:"Text"}),T,wt("Copy",()=>Ac(a,"text"),{id:"contests-submit-body-copy"}))))]}}function Vu(n,e,t,i=null){const s=de.view;en(void 0,"Watching"),RE(n,{title:e,onReplayed:r=>{i&&(i.textContent=r.text,i.dataset.verdict=r.verdict)},onClose:()=>{de.view===s&&(en(void 0,{results:"Finished",contest:"Ready",board:"Ready"}[s]??"Checked"),t.focus({preventScroll:!0}))}})}function R1(){_t("contests-verify-file").click()}async function C1(n){es(),ku();const e=de.contest;if(n.size>An){_l(n.name,{verdict:"refused",message:`The file is larger than ${An/1024/1024} MB, so it isn't a result file. It wasn't read.`},e);return}let t;try{t=await n.text()}catch(r){_l(n.name,{verdict:"error",message:`The file couldn't be read: ${r.message}`},e);return}const i=SE(t);de.verify=i,en(void 0,"Verifying"),On("verifying","Verify a result",[F("p",{text:`Checking ${n.name}: replaying its run from the seed, in a background thread. A long run takes a while.`}),F("div",{className:"contests-actions"},wt("Cancel",()=>i.cancel(),{id:"contests-cancel"}))]);const s=await i.promise;de.verify===i&&(de.verify=null,_l(n.name,s,e,t))}function _l(n,e,t,i){en(void 0,e.verdict==="verified"?"Verified":"Checked");const s=[["File",n]];if(e.contest!==void 0&&s.push(["Contest",e.contest??"none"]),e.generation!==null&&e.generation!==void 0&&s.push(["Generation",ne(e.generation)]),e.ending&&s.push(["Ended",e.ending]),e.score){const l=e.contest?Ds(e.contest):void 0,c=l&&(l.kind==="speed"?"generations"in e.score&&"ms"in e.score:"generations"in e.score&&"period"in e.score);s.push(["Score",c?l.kind==="speed"?`${gu(e.score)} (the time is self-reported)`:yw(da(l,e.score,e.ending)):JSON.stringify(e.score)])}e.rules&&s.push(["Rules",$s(e.rules)]),e.seedCells&&s.push(["Seed",`${ne(e.seedCells)} cell${e.seedCells===1?"":"s"}`]),e.departures&&s.push(["Ships left",`${Fp(e.departures)}${e.verdict==="verified"?", as the replay found":""}`]);const r=i!==void 0&&["verified","mismatch","not-checked"].includes(e.verdict),o=r?F("p",{className:"contests-self-verified",text:"Watch plays the run back in 3D, replayed from its seed, and checks the replay's hash at the file's generation.",attrs:{id:"contests-self-verified","data-verdict":"pending"}}):null;let a=null;r&&(a=wt("Watch",()=>{let l;try{l=ta(i)}catch(c){Pt(c instanceof Le?`It can't be watched: ${c.message}`:`It can't be watched: ${c?.message??c}`);return}Vu(l,`Watch: ${n}`,a,o)},{id:"contests-watch-run"})),On("verdict","Verify a result",[F("div",{className:"contests-verdict-head"},_m(30),F("p",{className:`contests-verdict contests-verdict--${e.verdict}`,text:Rw(e.verdict),attrs:{id:"contests-verdict"}})),F("p",{text:e.message,attrs:{id:"contests-verdict-message"}}),Bu(s),o,F("div",{className:"contests-actions"},a,Ma("Verify another"),t?wt(`Back to ${t.title}`,()=>Yi(t),{id:"contests-back"}):null,wt(`Back to ${Er}`,Ur,{id:"contests-list"}))])}let Rc=!1;function fi(){return _.simulationMode==="contests"}function P1({designInExplore:n}={}){wa(),_.reset(),_.autoRotateActive=!1,mu(),_.renderer.render(_.scene,_.camera),Rc=!0,document.body.classList.add("mode-contests"),Lm(!0),t1({designInExplore:n}),document.getElementById("loading-overlay")?.classList.add("hidden")}function wa(){Rc&&(Rc=!1,n1(),document.body.classList.remove("mode-contests"),Lm(!1))}function Lm(n){const e=document.getElementById("contests-banner");e&&(e.setAttribute("aria-pressed",String(n)),e.title=n?"Leave the contests (Esc)":"Open the contests")}function L1(n){lr()?DE(n):i1(n)}function Cc(){const n=document.getElementById("bottom-direction-value");n&&(n.textContent=_.isReversing?"rev":"fwd")}function Pc(){const n=document.getElementById("bottom-state-value");n&&(n.textContent=_.isPlaying?"play":"pause")}const of={...Object.fromEntries(Uu.map(({id:n,name:e,kind:t})=>[n,[e,t]])),contests:["Contests",Er]};function bo(){document.body.dataset.mode=_.simulationMode;const[n,e]=of[_.simulationMode]??of.gameOfLife,t=document.getElementById("hud-mode-name");t&&(t.textContent=n);const i=document.getElementById("hud-mode-kind");i&&(i.textContent=e)}function Xs(){if(_.controlsInitialized){const Y=document.getElementById("slice-index");Y&&(Y.max=_.sim_size-1);const _e=document.getElementById("sim-size-value"),Ye=document.getElementById("sim-generations-value");_e&&(_e.textContent=String(_.sim_size)),Ye&&(Ye.textContent=String(_.sim_generations)),bo(),Fo();return}bo();const n=document.getElementById("contests-banner");n&&(n.onclick=()=>fi()?af():D1());const e=document.getElementById("contests-banner-closes");e&&(e.textContent=vu(zo,{short:!0})),document.addEventListener("keydown",Y=>{if(!(Y.key!=="Escape"||Y.defaultPrevented||!fi())&&!document.querySelector(".explore-popover.is-open")&&document.getElementById("company-modal")?.classList.contains("hidden")){if(lr()){Ko();return}af()}}),NM();const t=document.getElementById("sim-size-value"),i=document.getElementById("sim-generations-value");t&&(t.textContent=String(_.sim_size)),i&&(i.textContent=String(_.sim_generations)),aE({beforeRun:()=>{wu(),wa(),Gs=null,ba()},afterRun:()=>Xs(),enterExplore:()=>{_.simulationMode="explore";for(const Y of Dm)_[Y]=!1;Gs=null,Qo()},showMode:bo});const s=document.getElementById("seedConfigButton");s&&s.addEventListener("click",()=>{_.showHUD===!1&&document.getElementById("hudToggleButton")?.click(),lE()});const r=document.getElementById("triStateButton");r.addEventListener("click",()=>{const Y=Array.from(r.querySelectorAll(".state-section")),_e=Y.findIndex(Tt=>Tt.classList.contains("active"));Y[_e].classList.remove("active"),r.classList.remove(`state-active-${Y[_e].dataset.value}`);const Ye=(_e+1)%Y.length,Oe=Y[Ye];r.classList.add(`state-active-${Oe.dataset.value}`),Oe.classList.add("active");const L=Oe.dataset.value;_.sliceAxis=L,o(),ci(),li()&&Oo(),lr()&&ml()}),o();function o(){const Y=document.getElementById("view-controls-display-text"),_e=document.getElementById("slice-index");if(Y)if(_.viewMode==="slice"){const Ye=_.sliceIndex!==null?_.sliceIndex:0,Oe=_e&&parseInt(_e.max)||_.sim_size-1;Y.textContent=`${Ye} / ${Oe}`}else Y.textContent="-"}const a=document.getElementById("dualStateButton");a.addEventListener("click",()=>{const Y=Array.from(a.querySelectorAll(".state-section")),_e=Y.findIndex(Tt=>Tt.classList.contains("active"));Y[_e].classList.remove("active"),a.classList.remove(`state-active-${Y[_e].dataset.id}`);const Ye=(_e+1)%Y.length,Oe=Y[Ye];a.classList.add(`state-active-${Oe.dataset.id}`),Oe.classList.add("active");const L=Oe.dataset.value;_.viewMode=L,o(),ci(),Dc(),li()&&Oo(),lr()&&ml()});const l=document.getElementById("slice-index");if(l.addEventListener("input",()=>{const Y=parseInt(l.value);_.sliceIndex=Y,o(),_.viewMode==="slice"&&ci(),li()&&Oo(),lr()&&ml()}),l){const Y=_.sim_size-1;l.max=Y,parseInt(l.value)>Y&&(l.value=Y,_.sliceIndex=Y)}const c=document.getElementById("reverseButton"),u=document.getElementById("leftArrow"),d=document.getElementById("rightArrow");d.classList.add("active");let h=!1;document.getElementById("leftStepCircle");const p=document.getElementById("rightStepCircle");p&&p.classList.add("active"),c.addEventListener("click",()=>{li()||fi()||(h=!h,_.isReversing=h,g())});function g(){h?(u.classList.add("active"),d.classList.remove("active")):(u.classList.remove("active"),d.classList.add("active")),v(),Cc()}function v(){const Y=document.getElementById("leftStepCircle"),_e=document.getElementById("rightStepCircle");Y&&_e&&(_.isReversing?(Y.classList.add("active"),_e.classList.remove("active")):(Y.classList.remove("active"),_e.classList.add("active")))}const m=document.getElementById("playPauseButton"),f=document.getElementById("playPauseIcon");m.onclick=()=>{if(fi()){CE();return}if(li()){Yw();return}const Y=!_.isPlaying;_.isPlaying=Y,f.className=Y?"pause":"play",Lc(),Pc()},document.getElementById("stepButton").addEventListener("click",()=>{if(fi()){PE();return}if(li()){qw();return}if(!_.simulationData?.length)return;_.isReversing?_.currentGen=(_.currentGen-1+_.simulationData.length)%_.simulationData.length:_.currentGen=(_.currentGen+1)%_.simulationData.length;const Y=document.getElementById("bottom-gen");if(Y){const _e=_.simulationData&&_.simulationData.length>0?_.simulationData.length-1:0;Y.textContent=`${_.currentGen} / ${_e}`}});const y=document.getElementById("restartButton");y&&(y.onclick=jw);const M=document.getElementById("explore-save-generation");M&&(M.onclick=()=>hl("generation"));const P=document.getElementById("explore-save-seed");P&&(P.onclick=()=>hl("seed"));const E=document.getElementById("explore-save-simulation");E&&(E.onclick=()=>hl("simulation"));const A=document.getElementById("explore-save-confirm");A&&(A.onclick=Xw);const R=document.getElementById("explore-save-cancel");R&&(R.onclick=fa),Rb({restart:Qo}),Lc(),document.getElementById("directionButton"),Dc(),w(),Cc(),Pc();function w(){const Y=document.getElementById("additional-grid-status"),_e=document.getElementById("additional-orientation-status"),Ye=document.getElementById("additional-cell-size-value");Y&&(Y.textContent=_.showWireframeGrid?"on":"off"),_e&&(_e.textContent=_.flipOrientation?"down":"up"),Ye&&(Ye.textContent=(_.cellSize??1.2).toFixed(2))}const S=document.getElementById("wireframeGridToggle"),D=document.getElementById("wireframeGridIcon");S&&(S.addEventListener("click",()=>{_.showWireframeGrid=!_.showWireframeGrid,D&&(D.style.fill=_.showWireframeGrid?"#4da3ff":"currentColor"),_.simulationModel&&_.simulationModel.wireframeGridHelper&&(_.simulationModel.wireframeGridHelper.visible=_.showWireframeGrid),w()}),D&&(D.style.fill=_.showWireframeGrid?"#4da3ff":"currentColor"));const $=document.getElementById("wireframeCellsToggle"),k=document.getElementById("wireframeCellsIcon");$&&($.addEventListener("click",()=>{if(_.showCellWireframe=!_.showCellWireframe,k&&(k.style.fill=_.showCellWireframe?"#4da3ff":"currentColor"),_.simulationModel){const Y=_.simulationModel.points,_e=_.simulationModel.wireframeCellsGroup;Y&&(Y.visible=!_.showCellWireframe),_e&&(_e.visible=_.showCellWireframe),_.simulationData&&ci()}}),k&&(k.style.fill=_.showCellWireframe?"#4da3ff":"currentColor"));const q=document.getElementById("flipOrientationToggle"),Z=document.getElementById("flipOrientationUp"),V=document.getElementById("flipOrientationDown");q&&(q.addEventListener("click",()=>{_.flipOrientation=!_.flipOrientation,se(),w(),_.simulationData&&ci()}),se());function se(){Z&&V&&(_.flipOrientation?(Z.classList.remove("active"),V.classList.add("active")):(Z.classList.add("active"),V.classList.remove("active")))}const H=document.getElementById("cellSizeSlider");H&&(H.value=_.cellSize??1.2,H.addEventListener("input",()=>{const Y=parseFloat(H.value);if(_.cellSize=Y,_.simulationModel&&_.simulationModel.material){const _e=_.simulationModel.material;_e instanceof Lr?(_e.size=Y,_e.needsUpdate=!0):_e.uniforms&&_e.uniforms.uPointSize&&(_e.uniforms.uPointSize.value=Y)}_.simulationData&&_.showCellWireframe&&ci(),w()}));const ae=document.getElementById("company-modal"),ge=document.getElementById("company-modal-close"),Te=[document.getElementById("company-logo-button-top")];function $e(){const Y=document.getElementById("glass-display-container"),_e=document.getElementById("bottom-controls-display"),Ye=document.getElementById("additional-controls-display"),Oe=document.getElementById("controls-wrapper"),L=document.getElementById("footer-icons");document.body.classList.add("company-modal-open"),document.getElementById("company-logo-button-top")?.setAttribute("aria-expanded","true"),L&&(L.style.display="none"),Y&&(Y.style.display="none"),_e&&(_e.style.display="none"),Ye&&(Ye.style.display="none"),Oe&&(Oe.style.display="none")}function je(){const Y=document.getElementById("glass-display-container"),_e=document.getElementById("bottom-controls-display"),Ye=document.getElementById("additional-controls-display"),Oe=document.getElementById("controls-wrapper"),L=document.getElementById("footer-icons");document.body.classList.remove("company-modal-open"),document.getElementById("company-logo-button-top")?.setAttribute("aria-expanded","false"),L&&(L.style.display=""),Y&&_.showHUD&&(Y.style.display="flex"),_e&&_.showHUD&&(_e.style.display="grid"),Ye&&_.showHUD&&(Ye.style.display="grid"),Oe&&(Oe.style.display="")}const X=()=>!!(ae&&!ae.classList.contains("hidden"));function le(){if(!X())return;ae.classList.add("hidden"),je();const Y=document.activeElement;Y&&(Y.closest("#company-brand")||ae.contains(Y))&&Y.blur()}Te.forEach(Y=>{Y&&ae&&Y.addEventListener("click",_e=>{if(_e.preventDefault(),_e.stopPropagation(),X()){le();return}ae.classList.remove("hidden"),$e()})}),ge&&ae&&(ge.addEventListener("click",le),ae.addEventListener("click",Y=>{Y.target===ae&&le()}),document.addEventListener("keydown",Y=>{Y.key==="Escape"&&X()&&(Y.preventDefault(),le())}));const Ee=document.getElementById("hudToggleButton"),fe=document.getElementById("glass-display-container"),we=document.getElementById("bottom-controls-display"),Qe=document.getElementById("additional-controls-display");if(Ee&&fe){Ee.addEventListener("click",()=>{_.showHUD=!_.showHUD,fe.style.display=_.showHUD?"flex":"none",we&&(we.style.display=_.showHUD?"grid":"none"),Qe&&(Qe.style.display=_.showHUD?"grid":"none");const _e=document.getElementById("hudToggleIcon");_e&&(_e.style.stroke=_.showHUD?"#4da3ff":"currentColor")});const Y=document.getElementById("hudToggleIcon");Y&&(Y.style.stroke="#4da3ff"),we&&(we.style.display=_.showHUD?"grid":"none"),Qe&&(Qe.style.display=_.showHUD?"grid":"none")}bo(),_.controlsInitialized=!0}function Lc(){const n=document.getElementById("stepButton");n&&(_.isPlaying?n.classList.add("disabled"):n.classList.remove("disabled"))}function Dc(){const e=document.getElementById("dualStateButton")?.querySelector(".state-section.active"),t=document.getElementById("triStateButton"),i=document.getElementById("slider"),s=document.getElementById("sliceViewer"),r=e&&e.dataset.value==="slice";t&&(t.style.display=r?"block":"none"),i&&(i.style.display=r?"block":"none"),s&&(s.style.display=r?"flex":"none")}let Gs=null;const Dm=["useRule30","useRule30_2D","useSineWave","useSandpile"];function D1(){_.simulationMode!=="contests"&&(Gs={mode:_.simulationMode,flags:Object.fromEntries(Dm.map(n=>[n,_[n]]))}),_.simulationMode="contests",_.useRule30=!1,_.useRule30_2D=!1,_.useSineWave=!1,_.useSandpile=!1,Ic(null),wu(),ba(),Xs(),P1({designInExplore:I1})}function I1({note:n,arena:e,title:t,ships:i=!1,entry:s=null}){let r;if(s)try{r=Xg(_.explore,s,e,t,i)}catch(o){if(o instanceof Xe)return o.message;throw o}else r=kf(_.explore,e,t,i);return Gs=null,_.explore=r.setup,_.simulationMode="explore",Qo(),kb({note:`${n} ${r.note}`}),null}async function af(){if(!fi())return;const n=Gs??{mode:"explore",flags:{}};if(Gs=null,n.mode==="explore"){_.simulationMode="explore",Qo();return}wa(),_.simulationMode=n.mode,Object.assign(_,n.flags),ba(),Xs(),await $u()}function Qo(){wa(),ba(),Xs(),Ru()}function ba(){_.viewMode="full",_.sliceAxis="x",_.sliceIndex=Math.floor((_.sim_size-1)/2),_.currentGen=0,_.isPlaying=!1,_.isReversing=!1;const n=document.getElementById("dualStateButton");if(n){const d=Array.from(n.querySelectorAll(".state-section"));d.forEach(p=>p.classList.remove("active")),n.classList.remove("state-active-y"),n.classList.add("state-active-x");const h=d[0];h&&h.classList.add("active")}const e=document.getElementById("triStateButton");if(e){const d=Array.from(e.querySelectorAll(".state-section"));d.forEach(p=>p.classList.remove("active")),e.classList.remove("state-active-y","state-active-z"),e.classList.add("state-active-x");const h=d.find(p=>p.dataset.value==="x")||d[0];h&&h.classList.add("active")}const t=document.getElementById("slider"),i=document.getElementById("sliceViewer");t&&(t.style.display="none"),i&&(i.style.display="none");const s=document.getElementById("slice-index");if(s){s.max=_.sim_size-1;const d=Math.floor((_.sim_size-1)/2);s.value=`${d}`}const r=document.getElementById("playPauseIcon");r&&(r.className="play"),Lc(),Pc();const o=document.getElementById("leftArrow"),a=document.getElementById("rightArrow");o&&o.classList.remove("active"),a&&a.classList.add("active"),Cc();const l=document.getElementById("leftStepCircle"),c=document.getElementById("rightStepCircle");l&&l.classList.remove("active"),c&&c.classList.add("active");const u=document.getElementById("bottom-gen");if(u){const d=_.simulationData&&_.simulationData.length>0?_.simulationData.length-1:0;u.textContent=`0 / ${d}`}Dc()}let Eo=0;async function $u(){const n=++Eo,e=document.getElementById("loading-overlay");e&&e.classList.remove("hidden"),Ic(null);const t={mode:_.useSandpile?"sandpile":_.useSineWave?"sineWave":_.useRule30_2D?"rule30_2D":_.useRule30?"rule30":"gameOfLife",size:_.sim_size,generations:_.sim_generations,initialSand:_.sandpileParams?.initialSand};try{await new Promise(v=>requestAnimationFrame(v)),await new Promise(v=>setTimeout(v,0)),_.reset(),Xs(),mu();const i=_.scene,s=_.sim_size,r=_.sim_generations,o=_.shapeFn;_.viewMode="full",_.sliceAxis="x",_.sliceIndex=Math.floor((s-1)/2);const a=await bM(s,r,o,_.useRule30,_.useRule30_2D,_.useSineWave,_.useSandpile,_.useSandpile?_.sandpileParams:null);if(n!==Eo)return;_.simulationData=a;const l=_.useRule30?1:s;_.simulationModel=await N1(s,l);const c=_.simulationModel.geometry,u=_.simulationModel.material,d=new uu(c,u);_.simulationModel.points=d,_.simulationModel.wireframeGridHelper&&(i.remove(_.simulationModel.wireframeGridHelper),_.simulationModel.wireframeGridHelper.traverse(v=>{v.geometry&&v.geometry.dispose(),v.material&&v.material.dispose()}));const h=F1(s,l);_.simulationModel.wireframeGridHelper=h,h.visible=_.showWireframeGrid??!1,i.add(h),_.simulationModel.wireframeCellsGroup&&(i.remove(_.simulationModel.wireframeCellsGroup),_.simulationModel.wireframeCellsGroup.traverse(v=>{v.geometry&&v.geometry.dispose(),v.material&&v.material.dispose()}));const p=new mi;_.simulationModel.wireframeCellsGroup=p,p.visible=_.showCellWireframe??!1,i.add(p),d.visible=!_.showCellWireframe,ci(),i.add(d),!_.userHasInteracted&&!_.autoRotateActive&&(_.autoRotateActive=!0,_.autoRotateStartTime=performance.now());const g=document.getElementById("loading-overlay");g&&requestAnimationFrame(()=>g.classList.add("hidden"))}catch(i){console.error("Failed to initialize simulation:",i),rE(i)&&n===Eo&&(_.simulationData=null,_.simulationModel=null,_.isPlaying=!1,Ic(sE(t)))}finally{e&&n===Eo&&e.classList.add("hidden")}}function Ic(n){const e=document.getElementById("sim-memory-note");e&&(e.hidden=!n,e.textContent=n??"")}async function N1(n,e){const t=n,i=e,s=_.cellSize??1.2,r=new Ot,o=t*t*i,a=new Float32Array(o*3),l=new Float32Array(o*3);r.setAttribute("position",new Ut(a,3)),r.setAttribute("color",new Ut(l,3)),r.setDrawRange(0,0);const c=new Lr({size:s,vertexColors:!0,sizeAttenuation:!0});return{geometry:r,material:c,positions:a,colors:l,matrixSize:t,matrixDepth:i}}function ci(){if(!_.simulationModel||!_.simulationModel.geometry)return;const n=new Pe("rgba(0, 180, 200, 1)"),e=new Pe("rgb(200,20,0)"),t=_.simulationModel.geometry,i=_.simulationModel.matrixSize,s=_.simulationModel.matrixDepth??i,r=_.simulationData,o=_.currentGen,a=r[o];let l=0;const c=[],u=(i-1)/2,d=s>1?s-1:0,h=d/2,p=_.useSandpile;for(const[m,f,T]of a.active){let y,M,P,E,A,R;if(p){const w=T,S=1;if(_.viewMode==="slice"&&(_.sliceAxis==="x"&&m!==_.sliceIndex||_.sliceAxis==="y"&&f!==_.sliceIndex||_.sliceAxis==="z"&&w!==_.sliceIndex))continue;if(y=m-u,M=_.flipOrientation?u-f:f-u,P=w*S,E=m/(i-1),R=new Pe,w===0)R.setHex(1713022);else if(w===1)R.setHex(5025616);else if(w===2)R.setHex(10233776);else if(w===3)R.setHex(16766720);else if(w===4)R.setHex(16777215);else{const D=w-4,k=Math.min(1,D/10);R.lerpColors(new Pe(16777215),new Pe(14737632),k)}}else{if(_.viewMode==="slice"&&(_.sliceAxis==="x"&&m!==_.sliceIndex||_.sliceAxis==="y"&&f!==_.sliceIndex||_.sliceAxis==="z"&&T!==_.sliceIndex))continue;y=m-u,M=_.flipOrientation?u-f:f-u,s<=1?P=0:P=T/(i-1)*d-h,E=m/(i-1),A=T/(i-1),R=n.clone().lerp(e,E),R.offsetHSL(0,0,A*.5)}new O(y,M,P),c.push([m,f,T]),_.simulationModel.positions[3*l]=y,_.simulationModel.positions[3*l+1]=M,_.simulationModel.positions[3*l+2]=P,_.simulationModel.colors[3*l]=R.r,_.simulationModel.colors[3*l+1]=R.g,_.simulationModel.colors[3*l+2]=R.b,l++}t.setDrawRange(0,l),t.attributes.position.needsUpdate=!0,t.attributes.color.needsUpdate=!0,U1(c,i,s);const g=a.generation!==void 0?a.generation:o,v=document.getElementById("bottom-gen");if(v){const m=_.simulationData&&_.simulationData.length>0?_.simulationData.length-1:0;v.textContent=`${g} / ${m}`}}function U1(n,e,t){const i=_.simulationModel.wireframeCellsGroup;if(!i)return;for(;i.children.length>0;){const d=i.children[0];d.geometry.dispose(),d.material.dispose(),i.remove(d)}if(!_.showCellWireframe)return;const s=_.cellSize??1,r=new Pe("rgba(0, 180, 200, 1)"),o=new Pe("rgb(200,20,0)"),a=(e-1)/2,l=t>1?t-1:0,c=l/2,u=_.useSandpile;for(const[d,h,p]of n){let g,v,m,f,T,y;if(u){const R=p,w=1;if(g=d-a,v=_.flipOrientation?a-h:h-a,m=R*w,f=d/(e-1),y=new Pe,R===0)y.setHex(1713022);else if(R===1)y.setHex(5025616);else if(R===2)y.setHex(10233776);else if(R===3)y.setHex(16766720);else if(R===4)y.setHex(16777215);else{const S=R-4,$=Math.min(1,S/10);y.lerpColors(new Pe(16777215),new Pe(14737632),$)}}else g=d-a,v=_.flipOrientation?a-h:h-a,t<=1?m=0:m=p/(e-1)*l-c,f=d/(e-1),T=p/(e-1),y=r.clone().lerp(o,f),y.offsetHSL(0,0,T*.5);const M=new an(s,s,s),P=new aa(M),E=new Qn({color:y}),A=new Xi(P,E);A.position.set(g,v,m),i.add(A),M.dispose()}}function F1(n,e){const t=new mi,i=Math.max(n,1),s=e>1?Math.max(e-1,1):1,r=new Pe(16777215),o=.3,a=new an(i,i,s),l=new aa(a),c=new Qn({color:r,transparent:!0,opacity:o}),u=new Xi(l,c);u.position.set(0,0,0),t.add(u);const d=Math.max(n,1),h=new tl(i,d,r,r);h.position.z=0,h.material.transparent=!0,h.material.opacity=o*.5;const p=new tl(i,d,r,r);p.rotation.x=Math.PI/2,p.position.y=0,p.material.transparent=!0,p.material.opacity=o*.5;const g=new tl(s,Math.max(e,1),r,r);return g.rotation.z=Math.PI/2,g.position.x=0,g.material.transparent=!0,g.material.opacity=o*.5,t.add(h),t.add(p),t.add(g),a.dispose(),t}let To=0,Ao=0,O1=60,lf=1e3/O1,vl=0,cf=0,uf=0,ea=2.6;const Im=100,df=1e4;function B1(){const n=()=>{_.autoRotateActive&&(_.autoRotateActive=!1,_.userHasInteracted=!0,_.autoRotateInitialPosition=null,_.autoRotateInitialRadius=null,_.autoRotateInitialAngle=null,_.controls&&(_.controls.enabled=!0))};document.addEventListener("mousedown",n,{once:!0}),document.addEventListener("mousemove",n,{once:!0}),document.addEventListener("wheel",n,{once:!0}),document.addEventListener("touchstart",n,{once:!0}),document.addEventListener("touchmove",n,{once:!0}),document.addEventListener("keydown",n,{once:!0}),document.addEventListener("keyup",n,{once:!0}),document.querySelectorAll('button, input, select, [role="button"]').forEach(t=>{t.addEventListener("click",n,{once:!0}),t.addEventListener("input",n,{once:!0}),t.addEventListener("change",n,{once:!0})})}B1();const hf=document.getElementById("fps-value"),xl=document.getElementById("speed-control");function ff(){const n=(1e3/(Im/ea)).toFixed(0),e=document.getElementById("bottom-speed-value");e&&(e.textContent=`${n}`)}xl&&(xl.value=ea,xl.addEventListener("input",n=>{ea=parseFloat(n.target.value),li()?Kw(n.target.value):fi()?LE(n.target.value):ff()}),ff());function Nm(n){requestAnimationFrame(Nm),To||(To=n);const e=n-To;if(e>=lf){if(To=n-e%lf,_.autoRotateActive&&_.camera&&_.controls){if(!_.autoRotateInitialPosition){const o=_.camera.position;_.autoRotateInitialPosition=o.clone(),_.autoRotateInitialRadius=Math.sqrt(o.x*o.x+o.z*o.z),_.autoRotateInitialAngle=Math.atan2(o.z,o.x)}const r=n-_.autoRotateStartTime;if(r<df){_.controls.enabled=!1;const o=r/df*Math.PI*2,a=_.autoRotateInitialAngle+o,l=_.autoRotateInitialRadius*Math.cos(a),c=_.autoRotateInitialRadius*Math.sin(a),u=_.autoRotateInitialPosition.y;_.camera.position.set(l,u,c),_.camera.lookAt(0,0,0)}else _.autoRotateActive=!1,_.userHasInteracted=!0,_.autoRotateInitialPosition=null,_.autoRotateInitialRadius=null,_.autoRotateInitialAngle=null,_.controls.enabled=!0}vl++;const t=performance.now();if(t-cf>=1e3&&(uf=vl,vl=0,cf=t,hf&&(hf.textContent=uf.toFixed(0))),xb()){yb();return}if(fi()){L1(n);return}Ao||(Ao=n);const i=n-Ao;if(li())Zw(n);else if(i>=Im/ea){if(Ao=n,_.isPlaying&&_.simulationData?.length){const r=_.simulationData.length;_.currentGen=_.isReversing?(_.currentGen-1+r)%r:(_.currentGen+1)%r}ci()}_.controls&&_.controls.enabled&&_.controls.update(),_.renderer.render(_.scene,_.camera);const s=document.getElementById("loading-overlay");s&&!s.classList.contains("hidden")&&_.simulationData&&_.simulationModel&&s.classList.add("hidden")}}(async()=>(_.simulationMode==="explore"?(Xs(),Ru()):await $u(),Nm()))();
