import {chromium} from 'playwright';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {simulate,parseRewards,defaults} from '../gold-zombies/model.mjs';
const base=(process.env.BASE_URL||'http://127.0.0.1:8000').replace(/\/$/,'');
const datasets={55:parseRewards(readFileSync(new URL('../sources/gold-zombie-rewards.csv',import.meta.url),'utf8')),70:parseRewards(readFileSync(new URL('../sources/gold-zombie-level-70.csv',import.meta.url),'utf8'))};
const browser=await chromium.launch({headless:true,...(process.env.CHROMIUM_PATH?{executablePath:process.env.CHROMIUM_PATH}:{})});
let checks=0;
try{
 for(const width of [375,768,1280]){
  const page=await browser.newPage({viewport:{width,height:900},isMobile:width===375,hasTouch:width===375});
  const errors=[];page.on('pageerror',e=>errors.push(e.message));
  await page.goto(`${base}/gold-zombies/`);await page.locator('#chart [data-strategy]').first().waitFor();
  assert.equal(await page.locator('#n').inputValue(),'20');assert.equal(await page.locator('#budget').inputValue(),'220');
  for(const level of ['55','70']){
   await page.selectOption('#level',level);
   for(const n of [5,10,20,25])for(const stamina of [10,120,220]){
    await page.locator('#n').fill(String(n));await page.locator('#n').dispatchEvent('input');await page.locator('#budget').fill(String(stamina));
    const expected=simulate(n,stamina,defaults,datasets[level]);
    const actual=await page.locator('#chart [data-reward]').evaluateAll(nodes=>nodes.map(group=>[...group.querySelectorAll('[data-strategy]')].map(e=>({value:+e.dataset.value,width:+e.dataset.width,scale:+e.dataset.scale}))));
    assert.equal(actual.length,6);
    actual.forEach((bars,m)=>bars.forEach((b,i)=>{assert.equal(b.value,expected[i].rewards[m]);assert.ok(Math.abs(b.width-b.value/b.scale*100)<1e-7);}));
    const cells=await page.locator('#results tbody tr').evaluateAll(nodes=>nodes.map(r=>[...r.querySelectorAll('td')].map(c=>+c.dataset.value)));
    assert.deepEqual(cells,datasets[level].map((_,m)=>expected.map(s=>s.rewards[m])));checks++;
   }
  }
  await page.selectOption('#level','55');await page.locator('#n').fill('20');await page.locator('#n').dispatchEvent('input');await page.locator('#budget').fill('210');
  await page.getByRole('tab',{name:'Data table',exact:true}).click();
  assert.equal(await page.locator('#summary [data-field="unresolved"]').first().textContent(),'1');
  assert.equal(await page.locator('#summary [data-field="returned"]').first().textContent(),'0');checks++;
  await page.locator('#budget').fill('220');
  assert.equal(await page.locator('#ledger tbody tr').count(),24);
  assert.equal(await page.locator('#ledger tbody tr').last().locator('[data-balance]').textContent(),'0');checks++;
  await page.locator('#budget').fill('2000');
  assert.equal(await page.locator('#ledger tbody tr').count(),50);await page.locator('#ledger-next').click();assert.match(await page.locator('#ledger-status').textContent(),/Actions 51/);checks++;
  await page.selectOption('#ledger-strategy','2');assert.match(await page.locator('#ledger-status').textContent(),/Actions 1/);checks++;
  await page.locator('#budget').fill('0');assert.equal(await page.locator('#error').isHidden(),true);assert.equal(await page.locator('#ledger tbody tr').count(),0);checks++;
  for(const invalid of ['','-1','10.5']){await page.locator('#budget').fill(invalid);assert.equal(await page.locator('#error').isVisible(),true);assert.equal(await page.locator('#chart [data-strategy]').count(),0);checks++;}
  await page.locator('#budget').fill('120');await page.locator('#n').fill('10');await page.locator('#n').dispatchEvent('input');
  await page.getByRole('button',{name:'Edit values',exact:true}).click();await page.locator('#source-table input[data-row="0"][data-key="discovery"]').fill('400');
  assert.equal(+(await page.locator('#chart [data-reward="0"] [data-strategy="1"]').getAttribute('data-value')),540);checks++;
  await page.getByRole('button',{name:'Reset values',exact:true}).click();
  assert.equal(+(await page.locator('#chart [data-reward="0"] [data-strategy="1"]').getAttribute('data-value')),440);checks++;
  assert.equal(await page.locator('#budget').inputValue(),'120');assert.equal(await page.locator('#n').inputValue(),'10');
  await page.getByRole('tab',{name:'Data table',exact:true}).focus();await page.keyboard.press('ArrowLeft');assert.equal(await page.locator('#graph-panel').isVisible(),true);checks++;
  assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));assert.deepEqual(errors,[]);checks++;
  await page.screenshot({path:`/tmp/klzn-simulation-${width}.png`,fullPage:true});
  if(width===375){await page.getByRole('tab',{name:'Data table',exact:true}).click();assert.equal(await page.locator('.rotate-hint').isVisible(),true);await page.setViewportSize({width:900,height:375});assert.equal(await page.locator('.rotate-hint').isHidden(),true);checks++;}
  await page.close();
 }
 const extraPage=await browser.newPage();
 const manifest=JSON.parse(readFileSync(new URL('../sources/gold-zombie-levels.json',import.meta.url),'utf8'));
 manifest.levels.push({id:'99',label:'99',csv:'test-level-99.csv'},{id:'100',csv:'missing-test-level.csv'});
 const extraCSV=readFileSync(new URL('../sources/gold-zombie-rewards.csv',import.meta.url),'utf8').replace('level_55_boss_rally','level_99_boss_rally').replace('Courage medals,10,80,300','Courage medals,10,80,333');
 await extraPage.route('**/gold-zombie-levels.json',route=>route.fulfill({json:manifest}));
 await extraPage.route('**/test-level-99.csv',route=>route.fulfill({body:extraCSV,contentType:'text/csv'}));
 await extraPage.route('**/missing-test-level.csv',route=>route.fulfill({status:404,body:'not found'}));
 await extraPage.goto(`${base}/gold-zombies/`);await extraPage.locator('#chart [data-strategy]').first().waitFor();
 assert.equal(await extraPage.locator('#level option').count(),3);assert.equal(await extraPage.locator('#level-warning').isVisible(),true);checks++;
 await extraPage.selectOption('#level','99');await extraPage.locator('#n').fill('10');await extraPage.locator('#n').dispatchEvent('input');await extraPage.locator('#budget').fill('120');
 assert.equal(+(await extraPage.locator('#chart [data-reward="0"] [data-strategy="0"]').getAttribute('data-value')),533);
 assert.match(await extraPage.locator('#csv').getAttribute('href'),/test-level-99/);checks++;
 await extraPage.selectOption('#level','55');assert.equal(+(await extraPage.locator('#chart [data-reward="0"] [data-strategy="0"]').getAttribute('data-value')),500);checks++;
 await extraPage.close();
 console.log(`PASS: ${checks} browser checks; whole-action totals, 55/70, 5–25 discovery, balances, ledger pagination, edits, tabs and mobile layout.`);
}finally{await browser.close();}
