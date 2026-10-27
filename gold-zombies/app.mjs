import {defaults,strategies,parseRewards,calculate,percent,range} from './model.mjs';
const $=id=>document.getElementById(id);
const fmt=v=>v===null?'N/A':v.toLocaleString('en-US',{maximumFractionDigits:1});
const pct=v=>v===null?'N/A':`${v>0?'+':''}${fmt(v)}%`;
const colors=['#f1c56d','#83c9ff','#87e2bc'];
let rows,source;
const head=names=>'<thead><tr>'+names.map(v=>`<th scope="col">${v}</th>`).join('')+'</tr></thead>';
const table=(caption,names,body)=>`<caption>${caption}</caption>${head(names)}<tbody>${body}</tbody>`;
const best=values=>{const valid=values.filter(v=>v!==null);const max=valid.length?Math.max(...valid):null;return values.map(v=>v!==null&&Math.abs(v-max)<=Math.abs(max)*1e-10);};
function readCosts(){return Object.fromEntries(Object.keys(defaults).map(k=>[k,$(k).valueAsNumber]));}
function render(){
 try{
  const n=$('n').valueAsNumber,costs=readCosts();
  const rewardFields=[...$('inputs').querySelectorAll('input')];
  for(const input of rewardFields) rows[+input.dataset.row][input.dataset.key]=input.valueAsNumber;
  const current=calculate(n,costs,rows),series=range(costs,rows),m=+$('metric').value;
  $('error').hidden=true;$('calculated').hidden=false;$('nLabel').value=fmt(n);
  const values=current.map(s=>s.per10[m]),winners=best(values);
  $('cards').innerHTML=current.map((s,i)=>`<article class="card"><h3>${i+1}. ${s.name}</h3><div class="big">${fmt(values[i])}</div><div class="small">${rows[m].name} / 10 stamina ${winners[i]?'<span class="badge">BEST</span>':''}</div><p class="small">${pct(percent(values[i],values[2]))} vs rally only<br>${fmt(s.stamina)} net stamina per cycle</p></article>`).join('');
  const winningNames=strategies.filter((_,i)=>winners[i]);
  $('verdict').textContent=winningNames.length?`${winningNames.join(' and ')} ${winningNames.length===1?'wins':'tie'} for ${rows[m].name.toLowerCase()} at ${fmt(n)} hunts per discovery. This ranks stamina efficiency, not rewards per hour.`:'No strategy has a positive net stamina cost. Adjust the assumptions to compare efficiency.';
  $('results').innerHTML=table('All rewards per 10 net stamina',['Reward',...strategies],rows.map((r,j)=>{const win=best(current.map(s=>s.per10[j]));return `<tr><th scope="row">${r.name}</th>${current.map((s,i)=>`<td class="${win[i]?'best':''}">${fmt(s.per10[j])}${win[i]?' <span class="badge">BEST</span>':''}</td>`).join('')}</tr>`;}).join(''));
  $('percentages').innerHTML=table(`${rows[m].name}: row compared with column`,['Strategy',...strategies],current.map((s,i)=>`<tr><th scope="row">${s.name}</th>${current.map((_,j)=>`<td>${pct(percent(values[i],values[j]))}</td>`).join('')}</tr>`).join(''));
  const integers=series.filter(p=>Number.isInteger(p.n));
  $('range').innerHTML=table(`${rows[m].name} / 10 stamina; select a rate`,['Hunts / boss',...strategies],integers.map(p=>`<tr><th scope="row"><button type="button" data-rate="${p.n}" aria-label="Select ${p.n} hunts per discovery">${p.n}</button></th>${p.strategies.map(s=>`<td>${fmt(s.per10[m])}</td>`).join('')}</tr>`).join(''));
  $('calculations').innerHTML=table(`Cycle details at ${fmt(n)} hunts; focus reward: ${rows[m].name}`,['Strategy','Hunts','Hunt stamina','Rally stamina','Refund','Net stamina','Total reward','Per 10 stamina'],current.map((s,i)=>`<tr><th scope="row">${s.name}</th><td>${i===2?0:fmt(n)}</td><td>${i===2?0:fmt(n*costs.hunt)}</td><td>${fmt(i===0?costs.own:i===2?costs.join:0)}</td><td>${i===2?0:fmt(costs.credit)}</td><td>${fmt(s.stamina)}</td><td>${fmt(s.totals[m])}</td><td>${fmt(s.per10[m])}</td></tr>`).join(''));
  chart(series,m,n);
  $('range-summary').textContent=integers.map(p=>{const win=best(p.strategies.map(s=>s.per10[m]));return `${p.n} hunts: ${strategies.filter((_,i)=>win[i]).join(' / ')||'N/A'}`;}).join(' · ');
 }catch(error){$('calculated').hidden=true;$('error').textContent=error.message;$('error').hidden=false;}
}
function chart(series,m,n){
 const all=series.flatMap(p=>p.strategies.map(s=>s.per10[m])).filter(v=>v!==null);
 const peak=Math.max(...all,1),ymax=peak<=Number.MAX_VALUE/1.08?peak*1.08:peak;
 const width=Math.min(640,Math.max(280,$('chart').clientWidth)),left=65,right=width-16;
 const x=v=>left+(v-5)*(right-left)/5,y=v=>264-v/ymax*224;
 let svg=`<svg viewBox="0 0 ${width} 320" role="group" aria-label="${rows[m].name} per 10 net stamina by hunts per discovered boss"><title>${rows[m].name} efficiency across discovery rates</title>`;
 for(let i=0;i<=4;i++){const value=ymax*(i/4);svg+=`<line x1="${left}" x2="${right}" y1="${y(value)}" y2="${y(value)}" stroke="#324157"/><text x="57" y="${y(value)+4}" text-anchor="end">${Intl.NumberFormat('en',{notation:'compact',maximumFractionDigits:1}).format(value)}</text>`;}
 for(let k=0;k<3;k++){
  let path='',gap=true;
  for(const p of series){const v=p.strategies[k].per10[m];if(v===null){gap=true;continue;}path+=`${gap?'M':'L'}${x(p.n)},${y(v)} `;gap=false;}
  svg+=`<path d="${path}" fill="none" stroke="${colors[k]}" stroke-width="2.5" ${k===1?'stroke-dasharray="7 4"':k===2?'stroke-dasharray="2 4"':''}/>`;
 }
 svg+=`<line x1="${x(n)}" x2="${x(n)}" y1="35" y2="264" stroke="#b1bfd2" stroke-dasharray="3 5"/>`;
 for(const p of series.filter(p=>Number.isInteger(p.n))){
  svg+=`<text x="${x(p.n)}" y="285" text-anchor="middle">${p.n}</text>`;
  p.strategies.forEach((s,k)=>{const v=s.per10[m];if(v!==null)svg+=`<circle class="pick" cx="${x(p.n)}" cy="${y(v)}" r="4" fill="${colors[k]}" tabindex="0" role="button" data-rate="${p.n}" data-strategy="${k}" data-value="${v}" aria-label="${p.n} hunts, ${s.name}: ${fmt(v)}; select rate"><title>${s.name}: ${fmt(v)} at ${p.n} hunts</title></circle>`;});
 }
 svg+=`<text x="${(left+right)/2}" y="313" text-anchor="middle">Gold Zombies per discovered boss</text></svg>`;
 $('chart').innerHTML=svg;
}
function reset(){rows=structuredClone(source);for(const k of Object.keys(defaults))$(k).value=defaults[k];$('n').value=10;buildInputs();render();}
function buildInputs(){
 $('inputs').innerHTML=table('Rewards per successful event',['Reward','Gold Zombie','Own boss rally','Discovery','Other boss rally¹'],rows.map((r,i)=>`<tr><th scope="row">${r.name}</th>${['hunt','boss','discovery','join'].map(k=>`<td><input type="number" min="0" max="1000000000000" step="any" required value="${r[k]}" data-row="${i}" data-key="${k}" aria-label="${r.name}: ${k==='join'?'other boss rally':k}"></td>`).join('')}</tr>`).join(''));
}
for(const id of ['n','hunt','own','join','credit','metric','inputs'])$(id).addEventListener('input',render);
$('reset').addEventListener('click',reset);
window.addEventListener('resize',()=>{if(rows)render();});
function selectRate(e){const target=e.target.closest('[data-rate]');if(target){$('n').value=target.dataset.rate;render();$('n').focus();}}
for(const id of ['chart','range'])$(id).addEventListener('click',selectRate);
$('chart').addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();selectRate(e);}});
try{
 const response=await fetch('../sources/gold-zombie-rewards.csv');if(!response.ok)throw new Error(`Source data failed to load (${response.status}). Please reload.`);
 source=parseRewards(await response.text());if(source.length!==6)throw new Error('Source data is incomplete. Please check the CSV.');
 $('metric').innerHTML=source.map((r,i)=>`<option value="${i}">${r.name}</option>`).join('');reset();
}catch(e){$('error').textContent=e.message;$('error').hidden=false;}
