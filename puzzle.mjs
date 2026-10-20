export const banks = {
'Naturaleza':['ARBOL','FLOR','BOSQUE','RIO','MONTAÑA','LAGO','MAR','HOJA','SEMILLA','TIERRA','SOL','LUNA','NUBE','LLUVIA','VIENTO','SELVA','PLAYA','VALLE','PLANTA','RAIZ','RAMA','FRUTO','JARDIN','PIEDRA','ARENA','PRADO','CASCADA','ISLA','CIELO','OCEANO'],
'Animales':['PERRO','GATO','LEON','TIGRE','CEBRA','JIRAFA','ELEFANTE','MONO','OSO','LOBO','ZORRO','CONEJO','CABALLO','VACA','OVEJA','CABRA','PATO','GALLINA','AGUILA','LORO','DELFIN','BALLENA','TIBURON','TORTUGA','RANA','SAPO','ABEJA','MARIPOSA','HORMIGA','ARDILLA'],
'Frutas y verduras':['MANZANA','PERA','UVA','MANGO','SANDIA','MELON','PAPAYA','PIÑA','BANANO','NARANJA','LIMON','MANDARINA','FRESA','MORA','DURAZNO','CEREZA','KIWI','COCO','GUAYABA','TOMATE','ZANAHORIA','LECHUGA','PEPINO','CEBOLLA','PIMIENTO','BROCOLI','ESPINACA','REMOLACHA','PAPA','ZAPALLO'],
'Ecuador':['ECUADOR','QUITO','GUAYAQUIL','CUENCA','LOJA','MANABI','GUAYAS','AZUAY','ELORO','ESMERALDAS','IBARRA','AMBATO','RIOBAMBA','TULCAN','OTAVALO','MACHALA','MANTA','PORTOVIEJO','QUEVEDO','BABAHOYO','GALAPAGOS','COTOPAXI','CHIMBORAZO','PICHINCHA','PASTAZA','NAPO','GUARANDA','SALINAS','DAULE','DURAN'],
'La cocina':['OLLA','SARTEN','PLATO','VASO','TAZA','CUCHARA','TENEDOR','CUCHILLO','HORNO','COCINA','MESA','MANTEL','RECETA','ARROZ','SOPA','PAN','QUESO','LECHE','HUEVO','SAL','AZUCAR','ACEITE','HARINA','CAFE','CACAO','CANELA','COMINO','PIMIENTA','ENSALADA','POSTRE'],
'Música':['PIANO','GUITARRA','VIOLIN','FLAUTA','TAMBOR','ARPA','TROMPETA','SAXOFON','MARACAS','BONGO','ACORDEON','BAJO','BATERIA','ORGANO','CANTO','VOZ','MELODIA','RITMO','COMPAS','NOTA','CORO','ORQUESTA','CONCIERTO','CANCION','SALSA','CUMBIA','PASILLO','BOLERO','VALS','MERENGUE'],
'Tecnología':['TECLADO','RATON','PANTALLA','MONITOR','MEMORIA','DISCO','ARCHIVO','CARPETA','INTERNET','RED','DATOS','CODIGO','PROGRAMA','SISTEMA','SERVIDOR','CORREO','TABLETA','MOVIL','CAMARA','IMPRESORA','ROBOT','DRON','SENSOR','CABLE','BATERIA','CHIP','MODEM','PUERTO','NUBE','CONSOLA'],
'Oficios':['MEDICO','DOCENTE','PANADERO','COCINERO','BOMBERO','POLICIA','ENFERMERO','CARPINTERO','ALBAÑIL','PINTOR','MECANICO','SASTRE','ZAPATERO','JARDINERO','AGRICULTOR','PESCADOR','PILOTO','CONDUCTOR','ABOGADO','ARQUITECTO','INGENIERO','DENTISTA','VETERINARIO','CANTANTE','ACTOR','ESCRITOR','ARTESANO','FOTOGRAFO','CONTADOR','ELECTRICISTA']
};
export function normalize(w){return w.toUpperCase().replace(/Ñ/g,'\u0001').normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/\u0001/g,'Ñ').replace(/[^A-ZÑ]/g,'');}
export function parseWords(text,size=30){return [...new Set(text.split(/[,;\n]+/).map(w=>normalize(w.trim())))].filter(w=>w.length>=2&&w.length<=size);}
export const shuffle=a=>a.map(v=>({v,r:Math.random()})).sort((a,b)=>a.r-b.r).map(x=>x.v);
export function generate(words,size,level='medium'){
 if(!Number.isInteger(size)||size<8||size>24)throw new Error('El tamaño debe estar entre 8 y 24.');
 if(!words.length||words.some(w=>w.length>size))throw new Error('Hay palabras que no caben en la cuadrícula.');
 const dirs=level==='easy'?[[0,1],[1,0]]:level==='medium'?[[0,1],[1,0],[1,1],[-1,1]]:[[0,1],[1,0],[1,1],[-1,1],[0,-1],[-1,0],[-1,-1],[1,-1]];
 for(let retry=0;retry<100;retry++){
 const grid=Array.from({length:size},()=>Array(size).fill(''));let placed=[];
 for(const word of [...words].sort((a,b)=>b.length-a.length)){
 let candidates=[];
 for(let r=0;r<size;r++)for(let c=0;c<size;c++)for(const [dr,dc]of dirs){
 const er=r+dr*(word.length-1),ec=c+dc*(word.length-1);if(er<0||er>=size||ec<0||ec>=size)continue;
 const cells=Array.from(word,(_,i)=>[r+dr*i,c+dc*i]);
 if(cells.every(([rr,cc],i)=>!grid[rr][cc]||grid[rr][cc]===word[i]))candidates.push(cells);
 }
 if(!candidates.length)break;
 const cells=candidates[Math.floor(Math.random()*candidates.length)];cells.forEach(([r,c],i)=>grid[r][c]=word[i]);placed.push({word,cells});
 }
 if(placed.length===words.length){const alphabet='ABCDEFGHIJKLMNÑOPQRSTUVWXYZ';grid.forEach(row=>row.forEach((v,i)=>{if(!v)row[i]=alphabet[Math.floor(Math.random()*alphabet.length)];}));return {grid,placed,size,level};}
 }
 throw new Error('Estas palabras necesitan más espacio. Aumenta el tamaño o reduce la cantidad.');
}
export function lineBetween(a,b){const dr=b[0]-a[0],dc=b[1]-a[1];if(dr&&dc&&Math.abs(dr)!==Math.abs(dc))return [];return Array.from({length:Math.max(Math.abs(dr),Math.abs(dc))+1},(_,i)=>[a[0]+Math.sign(dr)*i,a[1]+Math.sign(dc)*i]);}
