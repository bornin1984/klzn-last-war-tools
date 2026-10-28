import {defaults,parseRewards,simulate} from './model.mjs?v=whole-actions-1';
const $=id=>document.getElementById(id);
const labels=['Hunt, then rally your own','Hunt, then someone else rallies','Leading rallies only'];
const colors=['#e98b70','#31ad9a','#7b7ce0'];
const fmt=v=>v===null?'N/A':v.toLocaleString('en-US',{maximumFractionDigits:1});
const short=v=>Intl.NumberFormat('en',{notation:'compact',maximumFractionDigits:1}).format(v);
let currentResults=[],ledgerPage=0;
let datasets,source,rows,costs={...defaults},editing=false,activeTab='graph';
const best=values=>{const valid=values.filter(v=>v!==null),max=valid.length?Math.max(...valid):null;return values.map(v=>v!==null&&Math.abs(v-max)<=Math.abs(max)*1e-10);};
function showTab(tab,focus=false){
 activeTab=tab;
 for(const id of ['graph','source']){
  const selected=id===tab;
  $(id+'-tab').setAttribute('aria-selected',String(selected));
  $(id+'-tab').tabIndex=selected?0:-1;
  $(id+'-panel').hidden=!selected;
 }
 if(focus)$(tab+'-tab').focus();
}
for(const tab of ['graph','source']){
 $(tab+'-tab').addEventListener('click',()=>showTab(tab));
 $(tab+'-tab').addEventListener('keydown',e=>{
  if(['ArrowLeft','ArrowRight','Home','End'].includes(e.key)){
   e.preventDefault();showTab(e.key==='Home'?'graph':e.key==='End'?'source':activeTab==='graph'?'source':'graph',true);
  }
 });
}
function scaleMax(peak){
 if(peak<=0)return 1;
 const rough=peak/4,power=10**Math.floor(Math.log10(rough));
 const step=[1,2,2.5,5,10].find(v=>v*power>=rough)*power;
 const max=Math.ceil(peak/step)*step;
 return Number.isFinite(max)&&max>0?max:peak;
}
function render(){
 if(!rows)return;
 try{
  const n=$('n').valueAsNumber,budget=$('budget').valueAsNumber;
  const result=simulate(n,budget,costs,rows);
  currentResults=result;ledgerPage=0;
  document.querySelectorAll('[data-budget-label]').forEach(el=>el.textContent=fmt(budget));
  $('nLabel').value=fmt(n);$('error').hidden=true;
  $('chart').innerHTML=rows.map((reward,m)=>{
   const values=result.map(s=>s.rewards[m]);
   const scale=scaleMax(Math.max(0,...values.filter(v=>v!==null)));
   const bars=values.map((value,i)=>{
    const width=value===null?0:value/scale*100;
    return `<div class="group-bar" data-strategy="${i}" data-value="${value===null?'':value}" data-width="${width}" data-scale="${scale}" style="--color:${colors[i]};--width:${width}%" role="img" aria-label="${labels[i]}: ${fmt(value)} ${reward.name} from ${fmt(budget)} starting stamina"><div class="group-track"><div class="bar-fill"></div></div><span class="group-value">${fmt(value)}</span></div>`;
   }).join('');
   return `<section class="reward-group" data-reward="${m}" aria-labelledby="reward-${m}"><h3 id="reward-${m}">${reward.name}</h3>${bars}<div class="group-axis" aria-hidden="true">${[0,.25,.5,.75,1].map(f=>`<span>${short(scale*f)}</span>`).join('')}</div></section>`;
  }).join('');
  const headers=labels.map((label,i)=>`<th scope="col"><span class="col-dot" style="--color:${colors[i]}"></span>${label.replace(', then ','<br>')}</th>`).join('');
  $('results').innerHTML=`<thead><tr><th scope="col">Reward</th>${headers}</tr></thead><tbody>${rows.map((r,m)=>{
   const win=best(result.map(s=>s.rewards[m]));
   return `<tr><th scope="row">${r.name}</th>${result.map((s,i)=>`<td data-value="${s.rewards[m]===null?'':s.rewards[m]}" class="${win[i]?'best':''}">${fmt(s.rewards[m])}</td>`).join('')}</tr>`;
  }).join('')}</tbody>`;
  const stats=[['Hunts','hunts'],['Rallies you lead','rallies'],['Discoveries','discoveries'],['Discovered bosses defeated','resolved'],['Unresolved bosses','unresolved'],['Gross stamina spent','spent'],['Stamina returned','returned'],['Stamina remaining','remaining']];
  $('summary').innerHTML=`<thead><tr><th scope="col">Calculation</th>${headers}</tr></thead><tbody>${stats.map(([title,key])=>`<tr><th scope="row">${title}</th>${result.map(s=>`<td data-field="${key}">${fmt(s[key])}</td>`).join('')}</tr>`).join('')}</tbody>`;
  renderLedger();
 }catch(e){$('error').textContent=e.message;$('error').hidden=false;currentResults=[];for(const id of ['chart','results','summary','ledger'])$(id).innerHTML='';$('ledger-status').textContent='';$('ledger-prev').disabled=true;$('ledger-next').disabled=true;}

}
function renderLedger(){
 const s=currentResults[+$('ledger-strategy').value];if(!s)return;
 const entries=s.ledger(ledgerPage);
 $('ledger').innerHTML=`<thead><tr>${['Step','Action','Spent','Returned','Balance',...rows.map(r=>r.name+' total')].map(t=>`<th scope="col">${t}</th>`).join('')}</tr></thead><tbody>${entries.map(e=>`<tr><th scope="row">${e.step}</th><td>${e.action}</td><td>${fmt(e.spent)}</td><td>${fmt(e.returned)}</td><td data-balance="${e.balance}">${fmt(e.balance)}</td>${e.rewards.map(v=>`<td>${fmt(v)}</td>`).join('')}</tr>`).join('')}</tbody>`;
 $('ledger-status').textContent=s.eventCount?`Actions ${ledgerPage*50+1}–${ledgerPage*50+entries.length} of ${fmt(s.eventCount)}`:'No affordable actions';
 $('ledger-prev').disabled=ledgerPage===0;$('ledger-next').disabled=(ledgerPage+1)*50>=s.eventCount;
}
$('ledger-strategy').addEventListener('change',()=>{ledgerPage=0;renderLedger();});
$('ledger-prev').addEventListener('click',()=>{if(ledgerPage>0){ledgerPage--;renderLedger();}});
$('ledger-next').addEventListener('click',()=>{const s=currentResults[+$('ledger-strategy').value];if(s&&(ledgerPage+1)*50<s.eventCount){ledgerPage++;renderLedger();}});
function buildSource(){
 const keys=['hunt','boss','discovery','join'];
 function cell(value,{row,key,cost}={}){
  const field=editing&&(key||cost)?`<input type="number" min="0" max="1000000000000" step="1" required value="${value}" ${cost?`data-cost="${cost}"`:`data-row="${row}" data-key="${key}"`} aria-label="${cost?{hunt:'Stamina per hunt',own:'Stamina per own rally',join:'Stamina per other rally',credit:'Discovery stamina returned'}[cost]:rows[row].name+' '+{hunt:'per hunt',boss:'per own rally',discovery:'per discovery',join:'per other rally'}[key]}">`:fmt(value);
  return `<td data-value="${value}">${field}</td>`;
 }
 $('source-table').innerHTML=`<thead><tr><th scope="col">Reward</th><th scope="col">Each hunt</th><th scope="col">Own rally</th><th scope="col">Discovery</th><th scope="col">Others’ rally</th></tr></thead><tbody>${rows.map((r,i)=>`<tr data-row="${i}"><th scope="row">${r.name}</th>${keys.map(key=>cell(r[key],{row:i,key})).join('')}</tr>`).join('')}<tr class="source-table-costs"><th scope="row">Stamina spent</th>${cell(costs.hunt,{cost:'hunt'})}${cell(costs.own,{cost:'own'})}${cell(0)}${cell(costs.join,{cost:'join'})}</tr><tr class="source-table-costs"><th scope="row">Stamina returned</th>${cell(0)}${cell(0)}${cell(costs.credit,{cost:'credit'})}${cell(0)}</tr></tbody>`;
 $('edit').textContent=editing?'Done editing':'Edit values';$('edit').setAttribute('aria-pressed',String(editing));
}
function reset(){rows=structuredClone(source);costs={...defaults};editing=false;buildSource();render();}
$('source-table').addEventListener('input',e=>{
 const t=e.target;if(t.tagName!=='INPUT')return;
 if(t.dataset.cost)costs[t.dataset.cost]=t.valueAsNumber;
 else rows[+t.dataset.row][t.dataset.key]=t.valueAsNumber;
 t.closest('td').dataset.value=t.valueAsNumber;render();
});
$('edit').addEventListener('click',()=>{editing=!editing;buildSource();});
$('reset').addEventListener('click',reset);
$('n').addEventListener('input',render);
$('budget').addEventListener('input',render);
$('level').addEventListener('change',()=>{
 source=datasets[$('level').value];
 $('csv').href=$('level').value==='55'?'../sources/gold-zombie-rewards.csv':'../sources/gold-zombie-level-70.csv';
 reset();
});
try{
 const paths=['../sources/gold-zombie-rewards.csv','../sources/gold-zombie-level-70.csv'];
 const data=await Promise.all(paths.map(async path=>{
  const response=await fetch(path);if(!response.ok)throw new Error('Could not load source data. Please reload.');
  const rows=parseRewards(await response.text());if(rows.length!==6)throw new Error('Source data is incomplete.');return rows;
 }));
 datasets={'55':data[0],'70':data[1]};source=datasets['55'];
 for(const id of ['n','budget','level','edit','reset'])$(id).disabled=false;
 reset();
}catch(e){$('error').textContent=e.message;$('error').hidden=false;$('chart').innerHTML='';}
