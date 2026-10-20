(() => {
 'use strict';
 let promptEvent=null,ready=false;
 const installed=()=>matchMedia('(display-mode: standalone)').matches||navigator.standalone===true;
 const ios=/iPad|iPhone|iPod/.test(navigator.userAgent)||(navigator.platform==='MacIntel'&&navigator.maxTouchPoints>1);
 const bar=document.createElement('section');bar.className='app-toolbar';bar.setAttribute('aria-label','Apariencia e instalación');
 bar.innerHTML='<div class="theme-control"><label for="screen-theme">Color de pantalla</label><select id="screen-theme"><option value="green">Verde original</option><option value="blue">Azul</option><option value="lavender">Lavanda</option><option value="sepia">Sepia</option><option value="contrast">Alto contraste</option></select></div><p class="app-state" role="status"></p><button type="button" class="primary install-app">Instalar app</button>';
 document.querySelector('header')?.insertAdjacentElement('afterend',bar);
 const select=bar.querySelector('select'),button=bar.querySelector('button'),status=bar.querySelector('p');
 const colors={green:'#275d4d',blue:'#245480',lavender:'#65447f',sepia:'#6c4b28',contrast:'#000000'};
 select.value=document.documentElement.dataset.theme||'green';
 function theme(value){document.documentElement.dataset.theme=value;try{localStorage.setItem('sopa-viva-theme',value);}catch{}document.querySelector('meta[name="theme-color"]')?.setAttribute('content',colors[value]);}
 theme(select.value);select.addEventListener('change',()=>theme(select.value));
 const dialog=document.createElement('dialog');dialog.className='install-help';dialog.setAttribute('aria-labelledby','install-title');
 dialog.innerHTML='<button type="button" class="close" aria-label="Cerrar">×</button><p class="eyebrow">EN TU PANTALLA DE INICIO</p><h2 id="install-title">Instalar Sopa Viva</h2><div class="install-instructions"></div><p class="hint">Si abriste el enlace dentro de WhatsApp o una red social, ábrelo en Chrome o Safari. La instalación necesita tu confirmación.</p><button type="button" class="primary">Entendido</button>';
 document.body.append(dialog);dialog.querySelectorAll('button').forEach(b=>b.addEventListener('click',()=>dialog.close()));
 function help(){dialog.querySelector('.install-instructions').innerHTML=!window.isSecureContext?'<p>Abre el sitio con <strong>HTTPS</strong>. El administrador debe activar SSL para poder instalar la app.</p>':ios?'<ol><li>Abre esta página en <strong>Safari</strong>.</li><li>Toca <strong>Compartir</strong>.</li><li>Selecciona <strong>Agregar a pantalla de inicio</strong>.</li><li>Activa <strong>Abrir como app web</strong> si aparece y pulsa <strong>Agregar</strong>.</li></ol>':'<ol><li>Abre el sitio en <strong>Chrome</strong> en Android o un navegador compatible.</li><li>En el menú <strong>⋮</strong> busca <strong>Instalar aplicación</strong> o <strong>Agregar a pantalla de inicio</strong>.</li><li>Confirma. Si aún no aparece, espera a que termine de cargar y vuelve a intentarlo. En computadora puedes usar el icono de instalación de la barra de direcciones.</li></ol>';dialog.showModal();}
 function refresh(){button.hidden=installed();status.textContent=!navigator.onLine?(ready?'Sin conexión: usa los temas o tus palabras.':'Sin conexión. Conéctate para preparar la app.'):ready?'Temas y palabras propias disponibles sin conexión.':'Elige tus colores o instala Sopa Viva.';}
 window.addEventListener('beforeinstallprompt',event=>{event.preventDefault();promptEvent=event;refresh();});
 window.addEventListener('appinstalled',()=>{promptEvent=null;button.hidden=true;});
 matchMedia('(display-mode: standalone)').addEventListener('change',refresh);
 window.addEventListener('online',refresh);window.addEventListener('offline',refresh);
 button.addEventListener('click',async()=>{if(!promptEvent){help();return;}const event=promptEvent;promptEvent=null;button.disabled=true;try{await event.prompt();const choice=await event.userChoice;if(choice.outcome==='accepted')button.hidden=true;}catch{help();}finally{button.disabled=false;}});
 refresh();
 if('serviceWorker' in navigator&&window.isSecureContext){navigator.serviceWorker.register('./sw.js',{scope:'./',updateViaCache:'none'}).then(()=>navigator.serviceWorker.ready).then(()=>{ready=true;refresh();}).catch(()=>{status.textContent='No se pudo preparar el uso sin conexión. Recarga con internet.';});}
})();
