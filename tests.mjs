import assert from 'node:assert/strict';
import {banks,normalize,parseWords,shuffle,generate,lineBetween} from './puzzle.mjs';
assert.equal(normalize('niño, árbol pingüino'),'NIÑOARBOLPINGUINO');
assert.deepEqual(parseWords('café, CAFE; niño\nsol\na\nmuy largo',5),['CAFE','NIÑO','SOL']);
assert.deepEqual(lineBetween([0,0],[2,1]),[]);
assert.deepEqual(lineBetween([2,2],[0,0]),[[2,2],[1,1],[0,0]]);
let total=0;
for(const [name,words] of Object.entries(banks))for(const size of [8,10,12,15,18,20,24])for(const level of ['easy','medium','hard'])for(let i=0;i<3;i++){
const selected=shuffle(words.filter(w=>w.length<=size)).slice(0,size<=10?5:size===12?10:size===15?15:30);
const p=generate(selected,size,level);assert.equal(p.placed.length,selected.length,`${name} ${size}`);assert.equal(p.grid.length,size);
for(const {word,cells}of p.placed){assert.equal(cells.map(([r,c])=>p.grid[r][c]).join(''),word);const dr=cells[1][0]-cells[0][0],dc=cells[1][1]-cells[0][1];if(level==='easy')assert.ok((dr===0&&dc===1)||(dr===1&&dc===0));if(level==='medium')assert.ok(dc>=0);}
assert.ok(p.grid.every(row=>row.length===size&&row.every(c=>/^[A-ZÑ]$/.test(c))));total++;
}
assert.throws(()=>generate(['LARGUISIMA'],8));assert.throws(()=>generate(['SOL'],7));
console.log(`${total} sopas verificadas: cantidad exacta, letras y direcciones correctas. Normalización y límites: OK.`);
