import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import vm from 'node:vm';
import {localizedBanks,alphabetFor} from './banks.mjs';
import {parseWords,generate} from './puzzle.mjs';
const context={window:{}};
vm.runInNewContext(await readFile(new URL('./i18n-data.js',import.meta.url),'utf8'),context);
const catalog=context.window.SOPA_TRANSLATIONS;
test('English, Portuguese and German translations preserve all template parameters',()=>{
 for(const [key,translations] of Object.entries(catalog)){
  assert.equal(translations.length,3,key);
  const params=s=>[...s.matchAll(/\{(\w+)\}/g)].map(m=>m[1]).sort();
  for(const translation of translations){assert.ok(translation.trim(),key);assert.deepEqual(params(translation),params(key),key);}
 }
});
test('Eight collections in each language generate valid puzzles with the matching alphabet',()=>{
 let count=0;
 for(const language of ['es','en','pt','de']){
  assert.equal(Object.keys(localizedBanks[language]).length,8);
  for(const words of Object.values(localizedBanks[language])){
   assert.equal(new Set(words).size,30);
   assert.deepEqual(parseWords(words.join(','),30,language),words);
   for(const size of [8,12,24])for(const level of ['easy','medium','hard']){
    const selected=words.filter(w=>w.length<=size).slice(0,size===24?30:6);
    const puzzle=generate(selected,size,level,alphabetFor(language));
    assert.equal(puzzle.placed.length,selected.length);
    for(const placed of puzzle.placed)assert.equal(placed.cells.map(([r,c])=>puzzle.grid[r][c]).join(''),placed.word);
    assert.ok(puzzle.grid.flat().every(letter=>alphabetFor(language).includes(letter)));
    count++;
   }
  }
 }
 console.log(`${count} multilingual puzzles verified`);
});
test('All pages load the translation runtime before PWA and the app',async()=>{
 for(const name of ['index.html','generador.html','como-usar.html']){
  const html=await readFile(new URL(name,import.meta.url),'utf8');
  assert.ok(html.indexOf('src="i18n-data.js"')<html.indexOf('src="i18n.js"'));
  assert.ok(html.indexOf('src="i18n.js"')<html.indexOf('src="pwa.js"'));
 }
});

test('German umlauts and sharp S are transliterated before length checks',()=>{
 assert.deepEqual(parseWords('Bär, Käse, Öl, Tür, Fuß, Straße, GRÖẞE, BAER',12,'de'),['BAER','KAESE','OEL','TUER','FUSS','STRASSE','GROESSE']);
 assert.deepEqual(parseWords('Ähre, Öl, Baum',4,'de'),['OEL','BAUM']);
 assert.deepEqual(parseWords('niño, árbol, pingüino',12,'es'),['NIÑO','ARBOL','PINGUINO']);
});
