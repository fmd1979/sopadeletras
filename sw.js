const PREFIX = 'sopa-viva:' + self.registration.scope + ':';
const CACHE = PREFIX + '1.2.1';
const FILES = ['./','index.html','generador.html','como-usar.html','style.css','pages.css','i18n-data.js','i18n.js','banks.mjs','app.mjs','puzzle.mjs','pwa.js','themes.css','theme-init.js','manifest.webmanifest','icons/icon-192.png','icons/icon-512.png','icons/apple-touch-icon.png'];
const URLS = FILES.map(path => new URL(path, self.registration.scope).href);
self.addEventListener('install', event => event.waitUntil(caches.open(CACHE).then(cache => cache.addAll(URLS)).then(() => self.skipWaiting())));
self.addEventListener('activate', event => event.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(key => key.startsWith(PREFIX) && key !== CACHE).map(key => caches.delete(key)))).then(() => self.clients.claim())));
self.addEventListener('fetch', event => {
  if (event.request.method !== 'GET') return;
  const url = new URL(event.request.url);
  const canonical = url.origin + url.pathname;
  if (!URLS.includes(canonical)) return;
  event.respondWith((async () => {
    try {
      const response = await fetch(event.request);
      if(response.ok && response.type !== 'opaque') await (await caches.open(CACHE)).put(canonical,response.clone());
      return response;
    } catch {
      return await caches.match(canonical,{cacheName:CACHE}) || new Response('Conéctate a internet para cargar este recurso de Sopa Viva.',{status:503,headers:{'Content-Type':'text/plain; charset=utf-8'}});
    }
  })());
});
