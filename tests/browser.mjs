// Serve locally with python3 -m http.server 8000, or set BASE_URL to a deployment.
import {chromium} from 'playwright';
import assert from 'node:assert/strict';
const base=(process.env.BASE_URL||'http://127.0.0.1:8000').replace(/\/$/,'');
const browser=await chromium.launch({headless:true,...(process.env.CHROMIUM_PATH?{executablePath:process.env.CHROMIUM_PATH}:{})});
let checks=0;
try {
 for(const width of [375,768,1280]) {
  const page=await browser.newPage({viewport:{width,height:900},isMobile:width===375,hasTouch:width===375});
  const errors=[];page.on('pageerror',e=>errors.push(e.message));
  await page.goto(`${base}/`);await page.locator('a.directory').click();
  await page.locator('#calculated').waitFor({state:'visible'});
  assert.equal(await page.locator('#credit').inputValue(),'20');checks++;
  assert.equal(await page.locator('#preset').inputValue(),'55');
  assert.equal(await page.locator('#inputs input[data-row="0"][data-key="discovery"]').inputValue(),'300');
  await page.selectOption('#preset','40');
  assert.equal(await page.locator('#inputs input[data-row="0"][data-key="discovery"]').inputValue(),'270');
  await page.selectOption('#preset','55');checks++;
  assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));checks++;
  for(const preset of ['55','40']){
   await page.selectOption('#preset',preset);
   for(let m=0;m<6;m++){
   await page.selectOption('#metric',String(m));
   for(const n of [5,6,7,8,9,10]){
    await page.locator('#n').fill(String(n));await page.locator('#n').dispatchEvent('input');
    const data=await page.evaluate(({n,m})=>{
     const row=[...document.querySelectorAll('#range tbody tr')].find(r=>r.querySelector('button').textContent===String(n));
     const range=[...row.querySelectorAll('td')].map(c=>c.textContent);
     const current=[...document.querySelectorAll('#results tbody tr')][m];
     const results=[...current.querySelectorAll('td')].map(c=>c.childNodes[0].textContent.trim());
     const points=[...document.querySelectorAll(`#chart [data-rate="${n}"]`)];
     return {range,results,points:points.map(p=>+p.dataset.value),bad:/NaN|Infinity/.test(document.querySelector('#chart').innerHTML)};
    },{n,m});
    assert.deepEqual(data.range,data.results);assert.equal(data.points.length,3);
    for(let k=0;k<3;k++)assert.ok(Math.abs(Number(data.range[k].replaceAll(',',''))-data.points[k])<=.051);
    assert.equal(data.bad,false);checks++;
   }
  }
  }
  await page.selectOption('#preset','55');
  await page.selectOption('#metric','0');await page.locator('#range button[data-rate="5"]').click();
  assert.equal(await page.locator('#n').inputValue(),'5');checks++;
  await page.locator('#chart [data-rate="10"][data-strategy="0"]').focus();await page.keyboard.press('Enter');
  assert.equal(await page.locator('#n').inputValue(),'10');checks++;
  await page.locator('#assumptions summary').click();await page.locator('#credit').fill('100');
  assert.ok(await page.locator('#calculated').isVisible());assert.ok(!(await page.locator('#chart').innerHTML()).includes('NaN'));checks++;
  await page.locator('#hunt').fill('');assert.ok(await page.locator('#error').isVisible());assert.ok(await page.locator('#calculated').isHidden());checks++;
  await page.locator('#reset').click();assert.ok(await page.locator('#calculated').isVisible());checks++;
  await page.locator('#credit').fill('0');await page.locator('#own').fill('0');await page.locator('#join').fill('0');
  for(const input of await page.locator('#inputs input').all())await input.fill('0');
  assert.ok(!(await page.locator('#chart').innerHTML()).includes('NaN'));checks++;
  await page.locator('#reset').click();
  await page.locator('#inputs input[data-row="0"][data-key="hunt"]').fill('0');
  await page.locator('#inputs input[data-row="0"][data-key="boss"]').fill('1e-12');
  await page.locator('#inputs input[data-row="0"][data-key="discovery"]').fill('0');
  await page.locator('#inputs input[data-row="0"][data-key="join"]').fill('2e-12');
  assert.equal(await page.locator('#cards .badge').count(),1);checks++;
  await page.locator('#reset').click();assert.deepEqual(errors,[]);checks++;
  if(width===375){await page.locator('#assumptions summary').click();await page.screenshot({path:process.env.SCREENSHOT||'/tmp/klzn-mobile.png',fullPage:true});}
  await page.close();
 }
 console.log(`PASS: ${checks} browser checks; two presets × six metrics × six rates × three viewports, edits, invalid values, zero rewards, keyboard, chart/table agreement.`);
}finally{await browser.close();}
