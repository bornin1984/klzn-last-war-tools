import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {defaults,parseRewards,simulate} from '../gold-zombies/model.mjs';
const data=file=>parseRewards(readFileSync(new URL('../sources/'+file,import.meta.url),'utf8'));
const levels=[data('gold-zombie-rewards.csv'),data('gold-zombie-level-70.csv')];
// Independent, deliberately slow reference: spend and award one action at a time.
function reference(n,start,c,rows,id){
 let balance=start,hunts=0,rallies=0,discoveries=0,resolved=0,spent=0,returned=0;
 const rewards=rows.map(()=>0),add=k=>rows.forEach((r,m)=>rewards[m]+=r[k]);
 while(true){
  if(id===2){if(balance<c.join)break;balance-=c.join;spent+=c.join;rallies++;add('join');continue;}
  if(id===0&&discoveries>resolved&&balance>=c.own){balance-=c.own;spent+=c.own;rallies++;add('boss');resolved++;balance+=c.credit;returned+=c.credit;add('discovery');continue;}
  if(balance<c.hunt)break;
  balance-=c.hunt;spent+=c.hunt;hunts++;add('hunt');
  if(hunts%n===0){discoveries++;if(id===1){resolved++;balance+=c.credit;returned+=c.credit;add('discovery');}}
 }
 return {hunts,rallies,discoveries,resolved,unresolved:discoveries-resolved,spent,returned,remaining:balance,rewards};
}
const fields=['hunts','rallies','discoveries','resolved','unresolved','spent','returned','remaining','rewards'];
function check(n,start,c,rows){
 simulate(n,start,c,rows).forEach((s,id)=>{
  const expected=reference(n,start,c,rows,id);
  for(const field of fields)assert.deepEqual(s[field],expected[field],`${id},N=${n},S=${start},${field}`);
  assert.equal(start+s.returned-s.spent,s.remaining);
  if(s.eventCount<1000){let previous=rows.map(()=>0),paid=0,refunded=0;for(let p=0;p<Math.ceil(s.eventCount/50);p++)for(const e of s.ledger(p)){paid+=e.spent;refunded+=e.returned;assert.equal(start+refunded-paid,e.balance);e.rewards.forEach((r,m)=>assert.ok(r>=previous[m]));previous=e.rewards;}assert.equal(paid,s.spent);assert.equal(refunded,s.returned);assert.deepEqual(previous,s.rewards);}
 });
}
test('all discovery rates, both levels, affordability boundaries match reference ledger',()=>{for(const rows of levels)for(let n=5;n<=25;n++)for(const s of [0,9,10,19,20,99,100,110,120,210,220,501])check(n,s,defaults,rows);});
test('hand-worked medal examples',()=>{
 assert.deepEqual(simulate(10,120,defaults,levels[0]).map(s=>s.rewards[0]),[500,440,480]);
 const s=simulate(20,220,defaults,levels[0])[0];assert.equal(s.hunts,22);assert.equal(s.rallies,1);assert.equal(s.rewards[0],600);
 const pending=simulate(20,210,defaults,levels[0])[0];assert.equal(pending.hunts,21);assert.equal(pending.unresolved,1);assert.equal(pending.returned,0);
});
test('edited costs and refunds match independent reference',()=>{for(const hunt of [1,7,10])for(const own of [13,20,30])for(const credit of [0,2,4])check(5,130,{hunt,own,join:17,credit},levels[0]);});
test('invalid/free/self-funding assumptions are rejected',()=>{for(const n of [4,26,10.5,NaN])assert.throws(()=>simulate(n,120,defaults,levels[0]));for(const s of [-1,1.5,Infinity,NaN])assert.throws(()=>simulate(10,s,defaults,levels[0]));for(const field of ['hunt','own','join'])assert.throws(()=>simulate(10,120,{...defaults,[field]:0},levels[0]));assert.throws(()=>simulate(5,120,{...defaults,credit:50},levels[0]));});
test('large amounts use bounded pages rather than allocating a full ledger',()=>{const s=simulate(5,1e9,defaults,levels[0])[1];assert.ok(s.eventCount>1e7);assert.equal(s.ledger(0).length,50);const last=s.ledger(Math.floor((s.eventCount-1)/50)).at(-1);assert.equal(last.balance,s.remaining);assert.deepEqual(last.rewards,s.rewards);});
