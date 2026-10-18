const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const http = require('node:http');
let playwright;
try { playwright = require('playwright'); }
catch { playwright = require('C:/Users/dalop/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright'); }
const server = http.createServer((request, response) => {
  const name = decodeURIComponent(request.url.split('?')[0]);
  if (name === '/favicon.ico') { response.writeHead(204); return response.end(); }
  const file = path.resolve(process.cwd(), '.' + (name === '/' ? '/index.html' : name));
  if (!file.startsWith(process.cwd() + path.sep)) { response.writeHead(403); return response.end(); }
  try {
    response.setHeader('Content-Type', file.endsWith('.js') ? 'text/javascript' : file.endsWith('.css') ? 'text/css' : 'text/html');
    response.end(fs.readFileSync(file));
  } catch { response.writeHead(404); response.end(); }
});
(async () => {
  await new Promise(resolve => server.listen(4173, '127.0.0.1', resolve));
  const chrome = 'C:/Program Files/Google/Chrome/Application/chrome.exe';
  const browser = await playwright.chromium.launch({
    ...(fs.existsSync(chrome) ? {executablePath:chrome} : {}), headless:true,
    args:['--enable-webgl','--use-angle=swiftshader','--enable-unsafe-swiftshader']
  });
  fs.mkdirSync('test-results', {recursive:true});
  try {
    for (const width of [1440,390]) {
      const page = await browser.newPage({viewport:{width,height:900}});
      const errors = [];
      page.on('pageerror', error => {errors.push(error.message);console.error(error.message)});
      for (const file of ['index.html','radiology.html','ct-viewer.html']) {
        await page.goto('http://127.0.0.1:4173/' + file);
        const status = page.locator('[role=status]').first();
        await page.waitForFunction(text => document.querySelector('[role=status]')?.textContent.includes(text), file === 'index.html' ? 'listos' : file === 'radiology.html' ? 'Encuadre' : 'Fantoma sintético cargado', {timeout:60000});
        if (file === 'index.html') {
          assert.ok(await page.evaluate(async () => {
            const THREE = await import('https://esm.sh/three@0.170.0');
            const {synchronizeProjection} = await import('./src/cameras.js');
            const camera = new THREE.PerspectiveCamera();
            const projection = new THREE.OrthographicCamera();
            const target = new THREE.Vector3(2,-1,3);
            camera.position.set(7,4,10); camera.lookAt(target);
            synchronizeProjection(camera,projection,target);
            return projection.quaternion.angleTo(camera.quaternion)<1e-6 &&
              projection.getWorldDirection(new THREE.Vector3()).angleTo(target.clone().sub(projection.position))<1e-6;
          }), 'Projection follows camera rotation and a panned target');
          await page.locator('[data-pose=side]').click();
          await page.locator('[data-anat=epiglottis]').click();
          assert.equal(await page.locator('#title').textContent(), 'Epiglotis');
          await page.locator('#trach').selectOption('cuff');
          assert.match(await page.locator('#trach-note').textContent(), /Nunca utilizar/);
        } else if (file === 'radiology.html') {
          for (const view of ['axial','coronal','sagittal','render','multiplanar']) {
            await page.locator(`[data-view=${view}]`).first().click();
          }
          const before = await page.locator('#image').boundingBox();
          await page.waitForTimeout(1500);
          const after = await page.locator('#image').boundingBox();
          assert.ok(after.height < 1000 && Math.abs(before.height-after.height)<2, 'Canvas must not grow on resize');
          await page.locator('#clear').click();
          const header = 'NRRD0005\ntype: uchar\ndimension: 3\nsizes: 4 4 4\nencoding: raw\nspace directions: (1,0,0) (0,1,0) (0,0,1)\nspace origin: (0,0,0)\n\n';
          await page.locator('#file').setInputFiles({name:'test.nrrd',mimeType:'application/octet-stream',buffer:Buffer.concat([Buffer.from(header),Buffer.alloc(64,100)])});
          await page.waitForFunction(() => document.querySelector('#status').textContent.includes('Archivo local cargado'));
        } else {
          await page.locator('#preset').selectOption('bone');
          await page.locator('#reset').click();
        }
        assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), 'No horizontal overflow');
        assert.ok(await page.locator('canvas').count(), 'Rendered canvas exists');
        await page.screenshot({path:`test-results/${width}-${file}.png`,fullPage:true});
        console.log('PASS',width,file);
      }
      assert.deepEqual(errors, [], 'No uncaught JavaScript errors');
      await page.close();
    }
  } finally { await browser.close(); server.close(); }
})().catch(error => { console.error(error); server.close(); process.exitCode=1; });


