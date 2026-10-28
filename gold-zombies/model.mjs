// Pure model: no DOM, rounding, network, or mutable global state.
export const defaults = Object.freeze({hunt:10, own:20, join:20, credit:20});
export const strategies = ['Hunt + own rally','Hunt + others rally','Rally others only'];
export function parseRewards(csv) {
  return csv.trim().split(/\r?\n/).slice(1).map(line=>{
    const [name,hunt,boss,discovery]=line.split(',');
    return {name,hunt:Number(hunt),boss:Number(boss),discovery:Number(discovery),join:Number(boss)};
  });
}
export function calculate(n,costs,rows) {
  const valid=v=>Number.isFinite(v)&&v>=0&&v<=1e12;
  if(!Number.isFinite(n)||n<5||n>10||!['hunt','own','join','credit'].every(k=>valid(costs[k]))||
     !rows.every(r=>['hunt','boss','discovery','join'].every(k=>valid(r[k])))) throw new RangeError('Enter finite, nonnegative assumptions (maximum 1 trillion); discovery rate must be 5–10.');
  return strategies.map((name,id)=>{
    const stamina=id===0?n*costs.hunt+costs.own-costs.credit:id===1?n*costs.hunt-costs.credit:costs.join;
    const totals=rows.map(r=>id===0?n*r.hunt+r.boss+r.discovery:id===1?n*r.hunt+r.discovery:r.join);
    return {id,name,stamina,totals,per10:totals.map(v=>stamina>0&&Number.isFinite(v*10/stamina)?v*10/stamina:null)};
  });
}
export function percent(value,baseline) {
  if(value===null||baseline===null) return null;
  if(baseline===0) return value===0?0:null;
  const difference=(value/baseline-1)*100;
  return Number.isFinite(difference)?difference:null;
}
export function range(costs,rows) {
  return Array.from({length:51},(_,i)=>{const n=(50+i)/10;return {n,strategies:calculate(n,costs,rows)};});
}

// Convert normalized efficiencies into expected rewards for a chosen net stamina amount.
export function forStamina(strategies,stamina) {
  if(!Number.isFinite(stamina)||stamina<=0||stamina>1e12)throw new RangeError('Enter a stamina amount greater than 0 and no more than 1 trillion.');
  return strategies.map(s=>({...s,rewards:s.per10.map(v=>{
    const value=v===null?null:v*(stamina/10);
    return value!==null&&Number.isFinite(value)?value:null;
  })}));
}

// Whole-action forecast. Repeated completed cycles are batched; ledger rows are
// reconstructed on demand, so even a large starting balance needs bounded memory.
export function simulate(n,start,costs,rows) {
 const integer=v=>Number.isSafeInteger(v)&&v>=0&&v<=1e12;
 if(!Number.isInteger(n)||n<5||n>25)throw new RangeError('Choose 5–25 whole hunts per discovery.');
 if(!integer(start))throw new RangeError('Enter whole starting stamina from 0 to 1 trillion.');
 if(!['hunt','own','join','credit'].every(k=>integer(costs[k]))||!['hunt','own','join'].every(k=>costs[k]>0))throw new RangeError('Action costs must be positive whole numbers; refunds must be nonnegative whole numbers.');
 if(!rows.length||!rows.every(r=>['hunt','boss','discovery','join'].every(k=>integer(r[k]))))throw new RangeError('Reward values must be nonnegative whole numbers.');
 const c={...costs},r=rows.map(row=>({...row}));
 if(n*c.hunt<=c.credit)throw new RangeError('Refund must be less than a discovery’s hunting cost; otherwise stamina can recycle without limit.');
 const gain=(hunts,rallies,resolved,id)=>r.map(row=>hunts*row.hunt+rallies*(id===2?row.join:row.boss)+resolved*row.discovery);
 return strategies.map((name,id)=>{
  const upfront=id===2?c.join:n*c.hunt+(id===0?c.own:0),net=upfront-(id===2?0:c.credit);
  const cycles=start<upfront?0:1+Math.floor((start-upfront)/net);
  const tail=id===2?0:Math.floor((start-cycles*net)/c.hunt);
  const hunts=id===2?0:cycles*n+tail,rallies=id===1?0:cycles,resolved=id===2?0:cycles;
  const discoveries=id===2?0:cycles+Math.floor(tail/n);
  const spent=hunts*c.hunt+rallies*(id===2?c.join:c.own),returned=resolved*c.credit;
  const rewards=gain(hunts,rallies,resolved,id),remaining=start+returned-spent;
  const length=id===2?1:n+(id===0?2:1),eventCount=cycles*length+tail;
  if(![hunts,rallies,discoveries,spent,returned,remaining,eventCount,...rewards].every(Number.isSafeInteger))throw new RangeError('These inputs exceed exact numeric limits. Reduce stamina or edited values.');
  function event(index){
   const cycle=Math.floor(index/length),position=index%length;
   let h=0,b=0,d=0,paid=0,refund=0,action='';
   if(id===2){b=index+1;paid=c.join;action='Lead another player’s boss';}
   else if(index>=cycles*length){const t=index-cycles*length+1;h=cycles*n+t;b=id===0?cycles:0;d=cycles;paid=c.hunt;action=t%n===0?'Hunt · boss discovered (unresolved)':'Hunt Gold Zombie';}
   else {
    h=cycle*n;b=id===0?cycle:0;d=cycle;
    if(position<n){h+=position+1;paid=c.hunt;action=position===n-1?'Hunt · boss discovered':'Hunt Gold Zombie';}
    else if(id===0&&position===n){h+=n;b++;paid=c.own;action='Lead your discovered boss';}
    else{h+=n;if(id===0)b++;d++;refund=c.credit;action=id===0?'Claim discovery rewards':'Someone else defeats boss · claim intel';}
   }
   return {step:index+1,action,spent:paid,returned:refund,balance:start-h*c.hunt-b*(id===2?c.join:c.own)+d*c.credit,rewards:gain(h,b,d,id)};
  }
  return {id,name,hunts,rallies,discoveries,resolved,unresolved:discoveries-resolved,spent,returned,remaining,rewards,eventCount,
   ledger(page=0){if(!Number.isInteger(page)||page<0)return [];const first=page*50;return Array.from({length:Math.max(0,Math.min(50,eventCount-first))},(_,i)=>event(first+i));}};
 });
}
