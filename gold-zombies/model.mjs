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
