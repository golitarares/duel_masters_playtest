// Duel Playtest service worker: network-first for code/data (updates arrive), cache-first for card art.
const V='dm-v1',ART='dm-art-v1';
self.addEventListener('install',e=>{self.skipWaiting()});
self.addEventListener('activate',e=>{e.waitUntil((async()=>{for(const k of await caches.keys())if(k!==V&&k!==ART)await caches.delete(k);await clients.claim()})())});
self.addEventListener('fetch',e=>{
 const r=e.request;if(r.method!=='GET')return;const u=new URL(r.url);if(u.origin!==location.origin)return;
 if(u.pathname.includes('/atl/')){e.respondWith((async()=>{const c=await caches.open(ART);const m=await c.match(r);if(m)return m;const n=await fetch(r);if(n.ok)c.put(r,n.clone());return n})());return}
 e.respondWith((async()=>{const c=await caches.open(V);try{const n=await fetch(r);if(n.ok)c.put(r,n.clone());return n}catch(err){const m=await c.match(r)||await c.match('index.html');if(m)return m;throw err}})())});
