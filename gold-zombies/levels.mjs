const metrics=['Courage medals','Drone data','Hero XP','Iron','Bread','Gold'];
const filename=v=>typeof v==='string'&&/^[a-zA-Z0-9_-][a-zA-Z0-9_.-]*$/.test(v);
function parse(csv){
 const lines=csv.replace(/^\uFEFF/,'').trim().split(/\r?\n/).map(line=>line.split(',').map(v=>v.trim()));
 const [header,...data]=lines;
 if(header.length!==4||header[0]!=='reward'||header[1]!=='gold_zombie_per_kill'||!(/^(level_\d+_)?boss_rally$/.test(header[2]))||header[3]!=='discovery_reward')throw new Error('Invalid reward columns');
 if(data.length!==metrics.length)throw new Error('Expected six reward rows');
 const seen=new Map();
 for(const row of data){
  if(row.length!==4||!metrics.includes(row[0])||seen.has(row[0]))throw new Error('Unknown, missing or duplicate reward');
  const numbers=row.slice(1).map(value=>{
   if(!/^\d+$/.test(value)||!Number.isSafeInteger(Number(value))||Number(value)>1e12)throw new Error('Reward must be a nonnegative whole number');
   return Number(value);
  });
  seen.set(row[0],{name:row[0],hunt:numbers[0],boss:numbers[1],discovery:numbers[2],join:numbers[1]});
 }
 return metrics.map(name=>seen.get(name));
}
// A malformed optional level is isolated rather than breaking the full calculator.
export async function loadLevels(fetcher=fetch){
 const response=await fetcher('../sources/gold-zombie-levels.json');
 if(!response.ok)throw new Error('Could not load the level catalog. Please reload.');
 const manifest=await response.json();
 if(!manifest||!Array.isArray(manifest.levels))throw new Error('Invalid level catalog.');
 const errors=[],seen=new Set(),entries=[];
 for(const entry of manifest.levels){
  if(!entry||typeof entry.id!=='string'||!/^\d+$/.test(entry.id)||seen.has(entry.id)||!filename(entry.csv)||!entry.csv.endsWith('.csv')||(entry.label!==undefined&&(typeof entry.label!=='string'||!entry.label.trim()))){errors.push('Invalid or duplicate level entry');continue;}
  seen.add(entry.id);entries.push(entry);
 }
 const loaded=await Promise.allSettled(entries.map(async entry=>{
  const response=await fetcher('../sources/'+entry.csv);if(!response.ok)throw new Error('Missing reward CSV');
  return {...entry,label:entry.label||entry.id,rows:parse(await response.text()),evidence:Array.isArray(entry.evidence)?entry.evidence.filter(e=>e&&typeof e.label==='string'&&filename(e.file)):[]};
 }));
 const levels=[];
 loaded.forEach((result,i)=>{if(result.status==='fulfilled')levels.push(result.value);else errors.push(`Level ${entries[i].id}: ${result.reason.message}`);});
 if(!levels.length)throw new Error('No valid level data could be loaded.');
 return {levels,errors,defaultLevel:levels.some(l=>l.id===manifest.defaultLevel)?manifest.defaultLevel:levels[0].id};
}
