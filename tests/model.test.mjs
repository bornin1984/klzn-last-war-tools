import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
const model = await import('../gold-zombies/model.mjs').catch(()=>null);
test('independent calculation module exists',()=>assert.ok(model));
if(model){
 const {calculate,parseRewards,defaults,percent,range}=model;
 const originalRows=parseRewards(readFileSync(new URL('../sources/gold-zombie-spreadsheet.csv',import.meta.url),'utf8'));
 const rows=parseRewards(readFileSync(new URL('../sources/gold-zombie-rewards.csv',import.meta.url),'utf8'));
 const close=(a,b)=>assert.ok(Math.abs(a-b)<1e-7,`${a} != ${b}`);
 test('corrected hunt iron is 268,000; original transcription remains 168,000',()=>{assert.equal(rows[3].hunt,268000);assert.equal(originalRows[3].hunt,168000);});
 test('20 stamina returned, as confirmed by user',()=>assert.equal(defaults.credit,20));
 // Independent screenshot fixtures, ordered medals, data, XP, iron, bread, gold.
 const hunt=[10,1300,263000,268000,268000,268000];
 const boss=[80,1600,2700000,825000,825000,1000000];
 const discovery=[300,1600,2700000,825000,825000,1000000];
 for(const n of [5,6,7,8,9,10]) for(const credit of [0,20]) test(`all rewards and strategies N=${n}, refund=${credit}`,()=>{
   const result=calculate(n,{...defaults,credit},rows);
   assert.deepEqual(result.map(s=>s.stamina),[10*n+20-credit,10*n-credit,20]);
   for(let m=0;m<6;m++){
     close(result[0].totals[m],n*hunt[m]+boss[m]+discovery[m]);
     close(result[1].totals[m],n*hunt[m]+discovery[m]);
     close(result[2].totals[m],boss[m]);
     close(result[0].per10[m],(n*hunt[m]+boss[m]+discovery[m])*10/(10*n+20-credit));
     close(result[1].per10[m],(n*hunt[m]+discovery[m])*10/(10*n-credit));
     close(result[2].per10[m],boss[m]/2);
   }
 });
 test('screenshot exact totals reproduced',()=>{
   const r=calculate(5,defaults,originalRows);
   assert.deepEqual(r[0].totals,[400,9500,5715000,2310000,2810000,3212000]);
   assert.deepEqual(r[1].totals,[320,8000,3515000,1575000,2075000,2276000]);
 });
 test('editable join rewards and cost independent of own rally',()=>{
   const r=calculate(10,{...defaults,join:10},rows.map(r=>({...r,join:100})));
   assert.deepEqual(r[2].per10,[100,100,100,100,100,100]);
 });
 test('nonpositive denominators are unavailable',()=>{
   assert.ok(calculate(5,{...defaults,credit:70,join:0},rows).every(s=>s.per10.every(v=>v===null)));
 });
 test('invalid inputs rejected instead of clamped or silently zeroed',()=>{
   for(const n of [NaN,Infinity,4,11]) assert.throws(()=>calculate(n,defaults,rows));
   for(const v of [-1,NaN,Infinity]) assert.throws(()=>calculate(5,{...defaults,hunt:v},rows));
   assert.throws(()=>calculate(5,defaults,rows.map(r=>({...r,hunt:-1}))));
 });
 test('percentages handle zero, ties and unavailable results',()=>{
   close(percent(80,40),100); close(percent(20,40),-50); assert.equal(percent(0,0),0);
   assert.equal(percent(10,0),null);assert.equal(percent(null,40),null);
 });
 test('chart range agrees with direct results including fractional discovery rates',()=>{
   const series=range(defaults,rows);
   assert.equal(series.length,51);
   for(const point of series) assert.deepEqual(point.strategies,calculate(point.n,defaults,rows));
   assert.equal(series[0].n,5);assert.equal(series.at(-1).n,10);
 });
 test('level 55 direct evidence includes 300 medals and 20 returned stamina',()=>{const r=calculate(10,defaults,rows);assert.equal(r[1].totals[0],400);assert.equal(r[1].stamina,80);assert.equal(r[1].per10[0],50);});
 test('level 40 preset retains corrected hunt iron and original boss values',()=>{const r=parseRewards(readFileSync(new URL('../sources/gold-zombie-level-40.csv',import.meta.url),'utf8'));assert.equal(r[3].hunt,268000);assert.equal(r[0].discovery,270);for(const n of [5,6,7,8,9,10]){const v=calculate(n,defaults,r);const b=[80,1500,2200000,735000,735000,936000],d=[270,1500,2200000,735000,735000,936000];for(let m=0;m<6;m++){close(v[0].per10[m],(n*hunt[m]+b[m]+d[m])/n);close(v[1].per10[m],(n*hunt[m]+d[m])/(n-2));close(v[2].per10[m],b[m]/2);}}});
 test('subnormal stamina cannot leak Infinity into charts',()=>{assert.equal(calculate(5,{...defaults,join:1e-320},rows)[2].per10[0],null);});
 test('all zero rewards remain finite and tied',()=>{
   assert.ok(calculate(5,defaults,rows.map(r=>({...r,hunt:0,boss:0,discovery:0,join:0}))).every(s=>s.per10.every(v=>v===0)));
 });
}
