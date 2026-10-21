# Sopa Viva — Generador de sopas de letras

**Desarrollado por SiteEcuador SAS.** Aplicación web en español para crear sopas temáticas, resolverlas en pantalla e imprimirlas con una hoja de respuestas opcional.

## Funciones

- Página de presentación y guía de uso integrada.
- Ocho colecciones: Naturaleza, Animales, Frutas y verduras, Ecuador, La cocina, Música, Tecnología y Oficios.
- Listas propias y sugerencias de IA local opcional.
- De 3 a 30 palabras, con cuadrículas de 8 × 8 a 24 × 24.
- Tres niveles: Tranquilo, Curioso y Explorador.
- Selección por extremos o arrastre; teclado con flechas y Enter/Espacio.
- Letra grande, progreso, solución y reinicio de la misma cuadrícula.
- Impresión A4 limpia y solución opcional en otra página; PDF desde el diálogo del navegador.

No necesita PHP, base de datos, Composer ni claves de API. Las partidas no se guardan al recargar o salir.

## Publicar en cPanel

1. Crea un subdominio o una carpeta nueva, por ejemplo `public_html/sopas`.
2. Descarga el repositorio desde **Code → Download ZIP**.
3. Sube y extrae el ZIP. Mueve **el contenido** de la carpeta extraída a la raíz documental elegida: `index.html` debe quedar directamente allí.
4. Activa SSL/HTTPS y visita el dominio o la carpeta elegida.
5. Comprueba la portada, la guía, la creación de una sopa, la selección de palabras y la vista previa de impresión.

Usa una carpeta nueva para no sobrescribir otro sitio. `.htaccess` configura el tipo JavaScript para `.mjs` en Apache/LiteSpeed. En el Administrador de archivos puede ser necesario activar la visualización de archivos ocultos. En Nginx, configura `.mjs` con MIME `text/javascript` o `application/javascript`.

Solo hace falta publicar `index.html`, `generador.html`, `como-usar.html`, `style.css`, `pages.css`, `app.mjs`, `puzzle.mjs` y `.htaccess`. README, pruebas e instrucciones son documentación y herramientas de desarrollo.

## Publicar con GitHub Pages

En la configuración del repositorio, abre **Pages** y configura la publicación desde la rama `main`, carpeta raíz `/ (root)`. Guarda y espera el despliegue. GitHub mostrará el enlace publicado y el estado; comprueba ese enlace antes de compartirlo.

No hay proceso de compilación. Los enlaces y recursos son relativos y permiten usar la aplicación dentro de una subcarpeta. `.nojekyll` evita el procesamiento de Jekyll. `.htaccess` solo aplica a Apache/LiteSpeed, no a GitHub Pages.

## Probar en tu computadora

Con Python 3, desde la carpeta del proyecto:

```bash
python3 -m http.server 8080
```

Abre `http://localhost:8080/`. No abras el HTML con doble clic: los módulos JavaScript necesitan un servidor HTTP/HTTPS.

## Cómo se usa

1. Abre **Crear una sopa**.
2. Elige **Temas**, **IA gratis** o **Mis palabras**.
3. Configura cantidad, tamaño y nivel; pulsa **Crear mi sopa**.
4. Marca una palabra tocando la primera y la última letra o arrastrando entre ellas.
5. Usa **Imprimir / PDF** para imprimir o guardar la actividad; puedes añadir las respuestas.

La guía completa está en [como-usar.html](como-usar.html). Las palabras se convierten a mayúsculas, sin tildes ni espacios y conservando la Ñ. Se eliminan duplicados y palabras que no caben; si faltan palabras válidas, el formulario lo indica. En listas propias se toman las primeras palabras válidas hasta completar la cantidad elegida.

## IA local gratuita opcional

Se usa [WebLLM](https://webllm.mlc.ai/) `0.2.80`, cargado desde `https://esm.run/@mlc-ai/web-llm@0.2.80`, con el modelo `Qwen2.5-0.5B-Instruct-q4f32_1-MLC`.

- Solo se descarga al pulsar **Activar IA y sugerir palabras**.
- No requiere una clave ni pago por consulta.
- Necesita HTTPS o localhost, WebGPU, un dispositivo compatible y memoria disponible; el modelo requiere aproximadamente 1 GB de memoria gráfica según configuración.
- La primera carga descarga varios cientos de MB desde las fuentes del modelo y sus bibliotecas. Consume datos, almacenamiento y recursos del equipo; puede tardar varios minutos.
- La inferencia se realiza en el navegador. Los temas preparados y las listas propias no requieren activar la IA.
- La IA puede equivocarse o proponer menos palabras válidas de las solicitadas. La lista se revisa y edita antes de generar la sopa.

La generación con el modelo **no se pudo verificar en el navegador de pruebas por falta de WebGPU**. Sí se comprobó el mensaje de incompatibilidad y la alternativa con listas propias.

## Estructura

| Archivo | Función |
| --- | --- |
| `index.html` | Presentación |
| `como-usar.html` | Guía de uso |
| `generador.html` | Interfaz del generador y juego |
| `puzzle.mjs` | Colecciones, normalización y colocación de palabras |
| `app.mjs` | Juego, impresión e integración con WebLLM |
| `style.css`, `pages.css` | Estilos adaptables e impresión |
| `tests.mjs` | Verificación del motor de generación |

## Validación

Con Node.js:

```bash
node tests.mjs
```

Se verificaron 504 sopas con cantidad completa, letras y direcciones correctas, además de normalización, Ñ y límites. También se comprobó en navegador el reconocimiento de palabras seleccionadas y la creación de listas personalizadas. La impresión final depende del navegador: revisa la vista previa en A4 vertical.

## Colaborar

Abre un issue con los pasos para reproducir un error, navegador y dispositivo, sin datos personales. Para proponer cambios, envía un pull request e indica qué cambia y cómo lo verificaste. Las ampliaciones de vocabulario, accesibilidad y compatibilidad de IA son bienvenidas.

## Versión 1.1.0: app instalable y colores

Publica también `manifest.webmanifest`, `sw.js`, `pwa.js`, `themes.css`, `theme-init.js` y la carpeta `icons`. Requiere HTTPS o localhost. Android: Chrome → Instalar app o menú → Instalar aplicación / Agregar a pantalla de inicio. iPhone/iPad: Safari → Compartir → Agregar a pantalla de inicio → Abrir como app web (si aparece) → Agregar. La instalación requiere confirmación y su disponibilidad depende del navegador.

Selector de cinco temas: verde, azul, lavanda, sepia y alto contraste. Se recuerda localmente; no cambia la impresión. El service worker prepara las páginas y el vocabulario para usarlos sin conexión tras una primera carga completa. No almacena API ni recursos externos de IA. Las partidas no se guardan al cerrar.

Para actualizar cPanel, respalda y reemplaza todos los archivos públicos y copia icons. Solo reemplazar index.html no basta. Incrementa la versión de sw.js en futuras publicaciones. Las rutas son relativas, compatibles con subcarpetas y GitHub Pages.

Verificación PWA: `node --test pwa.test.mjs`. La instalación en Android/iOS debe comprobarse en dispositivos reales.

## Versión 1.2.0 · Multiidioma

Interfaz, portada, historia, guía, accesibilidad e impresión en español, inglés y portugués. El selector de idioma de pantalla detecta el navegador al inicio y guarda la preferencia. El idioma del vocabulario se elige por separado y se guarda en el dispositivo. Los ocho bancos están disponibles en los tres idiomas; los nombres geográficos de Ecuador se conservan. La IA recibe el idioma de vocabulario seleccionado; revisa sus resultados. Las listas propias no se traducen. La cuadrícula elimina acentos y espacios, conserva Ñ y usa relleno A–Z para inglés/portugués. Cambiar el idioma de pantalla conserva la cuadrícula y los aciertos actuales.

Las traducciones se mantienen en `i18n-data.js`; los bancos, en `banks.mjs`. Para actualizar en hosting reemplaza todos los archivos. El caché PWA 1.2.0 incluye los nuevos recursos para uso sin conexión. Cierra y vuelve a abrir la app tras actualizar.

Pruebas: `node tests.mjs`, `node --test pwa.test.mjs i18n.test.mjs`. La ejecución real de WebLLM requiere WebGPU y no forma parte de las pruebas automatizadas.

## Versión 1.2.1 · Alemán

Se añade Deutsch a la interfaz, portada, guía, impresión, accesibilidad y vocabulario independiente. Ocho colecciones en alemán; la IA recibe German como idioma de destino. En alemán se convierten Ä/Ö/Ü a AE/OE/UE y ß/ẞ a SS antes de validar longitud y duplicados; los bancos ya usan estas grafías. Se conservan los nombres geográficos de Ecuador. El caché PWA pasa a 1.2.1. La generación real del modelo y la apariencia en dispositivos requieren revisión manual.
