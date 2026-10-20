import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile,access} from 'node:fs/promises';
import vm from 'node:vm';
const manifest=JSON.parse(await readFile(new URL('./manifest.webmanifest',import.meta.url),'utf8'));
test('manifest y recursos instalables bajo una subcarpeta',async()=>{
 const base='https://example.test/sopadeletras/';
 assert.equal(new URL(manifest.start_url,base).pathname,'/sopadeletras/generador.html');assert.equal(manifest.display,'standalone');
 for(const icon of manifest.icons){await access(new URL(icon.src,import.meta.url));assert.ok(['192x192','512x512'].includes(icon.sizes));}
 for(const page of ['index.html','generador.html','como-usar.html']){const html=await readFile(new URL(page,import.meta.url),'utf8');assert.ok(html.includes('href="manifest.webmanifest"'));assert.ok(html.includes('src="pwa.js"'));assert.ok(html.includes('src="theme-init.js"'));}
});
function worker(){const events={},store=new Map(),deleted=[];const scope='https://example.test/sopadeletras/';let network=true;const cache={addAll:async urls=>{for(const url of urls){await access(new URL(url.replace(scope,'./')==='./'?'./index.html':url.replace(scope,'./'),import.meta.url));store.set(url,new Response('offline:'+url));}},put:async(url,response)=>store.set(url,response)};
const context={URL,Response,self:{registration:{scope},addEventListener:(name,fn)=>events[name]=fn,skipWaiting:async()=>{},clients:{claim:async()=>{}}},caches:{open:async()=>cache,keys:async()=>['unrelated','sopa-viva:https://example.test/other/:old','sopa-viva:'+scope+':old'],delete:async key=>deleted.push(key),match:async url=>store.get(url)?.clone()},fetch:async()=>{if(!network)throw Error('offline');return new Response('online');}};
return {events,context,store,deleted,scope,offline:()=>network=false};}
test('precache complet, repli hors ligne et isolation des requêtes',async()=>{
const w=worker();vm.runInNewContext(await readFile(new URL('./sw.js',import.meta.url),'utf8'),w.context);
let task;w.events.install({waitUntil:p=>task=p});await task;
w.events.activate({waitUntil:p=>task=p});await task;
assert.deepEqual(w.deleted,['sopa-viva:'+w.scope+':old']);
let intercepted=false;w.events.fetch({request:{method:'GET',url:'https://external.test/model'},respondWith:()=>intercepted=true});assert.equal(intercepted,false);
w.events.fetch({request:{method:'POST',url:w.scope+'generador.html'},respondWith:()=>intercepted=true});assert.equal(intercepted,false);
w.events.fetch({request:{method:'GET',url:w.scope+'api/generate.php'},respondWith:()=>intercepted=true});assert.equal(intercepted,false);
w.offline();let response;w.events.fetch({request:{method:'GET',url:w.scope+'generador.html?source=app'},respondWith:p=>response=p});assert.match(await (await response).text(),/offline:/);
});
test('preferencia de color guardada, recuperada y tolerante a almacenamiento bloqueado',async()=>{
const code=await readFile(new URL('./theme-init.js',import.meta.url),'utf8');
for(const saved of ['blue','lavender','sepia','contrast','green','invalid']){const root={dataset:{}};vm.runInNewContext(code,{localStorage:{getItem:()=>saved},document:{documentElement:root}});assert.equal(root.dataset.theme,saved==='invalid'?undefined:saved);}
assert.doesNotThrow(()=>vm.runInNewContext(code,{localStorage:{getItem:()=>{throw Error('blocked');}},document:{documentElement:{dataset:{}}}}));
});
