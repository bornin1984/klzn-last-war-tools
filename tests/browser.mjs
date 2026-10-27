import {chromium} from 'playwright';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {calculate,parseRewards,defaults} from '../gold-zombies/model.mjs';
const base=(process.env.BASE_URL||'http://127.0.0.1:8000').replace(/\/$/,'');
const datasets={55:parseRewards(readFileSync(new URL('../sources/gold-zombie-rewards.csv',import.meta.url),'utf8')),40:parseRewards(readFileSync(new URL('../sources/gold-zombie-level-40.csv',import.meta.url),'utf8'))};
const browser=await chromium.launch({headless:true,...(process.env.CHROMIUM_PATH?{executablePath:process.env.CHROMIUM_PATH}:{})});
let checks=0;
try{
 for(const width of [375,768,1280]){
  const page=await browser.newPage({viewport:{width,height:900},isMobile:width===375,hasTouch:width===375});
  const errors=[];page.on('pageerror',e=>errors.push(e.message));
  await page.goto(`${base}/gold-zombies/`);
  await page.getByRole('tab',{name:'Graph',exact:true}).waitFor({timeout:5000});
  await page.locator('#chart [data-strategy]').first().waitFor();
  assert.equal(await page.locator('#n').inputValue(),'10');
  assert.equal(await page.getByRole('tab',{name:'Graph',exact:true}).getAttribute('aria-selected'),'true');
  assert.equal(await page.locator('#source-panel').isHidden(),true);checks++;
  assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));
  assert.ok(await page.locator('#n').evaluate(e=>e.getBoundingClientRect().bottom<=innerHeight));checks++;
  for(const preset of ['55','40']){
   await page.selectOption('#preset',preset);
   for(let m=0;m<6;m++){
    await page.selectOption('#metric',String(m));
    for(const n of [5,6,7,8,9,10]){
     await page.locator('#n').fill(String(n));await page.locator('#n').dispatchEvent('input');
     const expected=calculate(n,defaults,datasets[preset]).map(s=>s.per10[m]);
     const bars=await page.locator('#chart [data-strategy]').evaluateAll(nodes=>nodes.map(e=>({value:+e.dataset.value,width:+e.dataset.width,scale:+e.dataset.scale})));
     assert.equal(bars.length,3);
     bars.forEach((bar,i)=>{assert.ok(Math.abs(bar.value-expected[i])<1e-7);assert.ok(Math.abs(bar.width-bar.value/bar.scale*100)<1e-7);});checks++;
    }
   }
   await page.getByRole('tab',{name:'Data table',exact:true}).click();
   assert.equal(await page.locator('#graph-panel').isHidden(),true);
   const source=await page.locator('#source-table tbody tr[data-row]').evaluateAll(nodes=>nodes.map(r=>[...r.querySelectorAll('td')].map(c=>+c.dataset.value)));
   assert.deepEqual(source,datasets[preset].map(r=>[r.hunt,r.boss,r.discovery,r.join]));checks++;
   const cells=await page.locator('#results tbody tr').evaluateAll(nodes=>nodes.map(r=>[...r.querySelectorAll('td')].map(c=>+c.dataset.value)));
   const expected=calculate(10,defaults,datasets[preset]);
   assert.deepEqual(cells,datasets[preset].map((_,m)=>expected.map(s=>s.per10[m])));checks++;
   await page.locator('#n').fill('5');await page.locator('#n').dispatchEvent('input');
   const first=+(await page.locator('#results tbody tr').first().locator('td').first().getAttribute('data-value'));
   assert.equal(first,calculate(5,defaults,datasets[preset])[0].per10[0]);checks++;
   assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));checks++;
   await page.getByRole('tab',{name:'Data table',exact:true}).focus();await page.keyboard.press('ArrowLeft');
   assert.equal(await page.getByRole('tab',{name:'Graph',exact:true}).getAttribute('aria-selected'),'true');checks++;
  }
  await page.selectOption('#preset','55');await page.selectOption('#metric','0');
  await page.getByRole('tab',{name:'Data table',exact:true}).click();await page.getByRole('button',{name:'Edit values',exact:true}).click();
  await page.locator('#source-table input[data-row="0"][data-key="discovery"]').fill('400');
  await page.getByRole('tab',{name:'Graph',exact:true}).click();
  assert.equal(+(await page.locator('#chart [data-strategy="1"]').getAttribute('data-value')),62.5);checks++;
  await page.getByRole('tab',{name:'Data table',exact:true}).click();
  await page.locator('#source-table input[data-row="0"][data-key="discovery"]').fill('');
  assert.equal(await page.locator('#error').isVisible(),true);checks++;
  await page.getByRole('button',{name:'Reset values',exact:true}).click();assert.equal(await page.locator('#error').isHidden(),true);checks++;
  await page.getByRole('tab',{name:'Graph',exact:true}).click();
  assert.equal(+(await page.locator('#chart [data-strategy="1"]').getAttribute('data-value')),50);checks++;
  assert.deepEqual(errors,[]);checks++;
  if(width===375||width===1280){await page.screenshot({path:`/tmp/klzn-graph-${width}.png`,fullPage:true});await page.getByRole('tab',{name:'Data table',exact:true}).click();await page.screenshot({path:`/tmp/klzn-source-${width}.png`,fullPage:true});}
  await page.close();
 }
 console.log(`PASS: ${checks} checks — two tabs, proportional bars, both presets, six rewards, rates 5–10, source data, edits and mobile layout.`);
}finally{await browser.close();}
