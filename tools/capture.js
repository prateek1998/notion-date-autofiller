const puppeteer = require('puppeteer-core');
const path = require('path');

const CHROME = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const SOURCES = path.resolve(__dirname, 'sources');
const OUT     = path.resolve(__dirname, '..', 'store-assets', 'screenshots');

const files = [
  { file: 'screenshot-1.html', out: 'screenshot-1.png', w: 1280, h: 800 },
  { file: 'screenshot-2.html', out: 'screenshot-2.png', w: 1280, h: 800 },
  { file: 'screenshot-3.html', out: 'screenshot-3.png', w: 1280, h: 800 },
  { file: 'screenshot-4.html', out: 'screenshot-4.png', w: 1280, h: 800 },
  { file: 'screenshot-5.html', out: 'screenshot-5.png', w: 1280, h: 800 },
  { file: 'promo-small.html',  out: 'promo-small.png',  w: 440,  h: 280 },
  { file: 'promo-marquee.html',out: 'promo-marquee.png',w: 1400, h: 560 },
];

(async () => {
  const browser = await puppeteer.launch({
    executablePath: CHROME,
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });

  for (const { file, out, w, h } of files) {
    const page = await browser.newPage();
    await page.setViewport({ width: w, height: h, deviceScaleFactor: 1 });
    const url = 'file:///' + path.join(SOURCES, file).replace(/\\/g, '/');
    await page.goto(url, { waitUntil: 'networkidle0' });
    await new Promise(r => setTimeout(r, 1500));
    await page.screenshot({ path: path.join(OUT, out), type: 'png', clip: { x: 0, y: 0, width: w, height: h } });
    console.log(`✓ ${out} (${w}x${h})`);
    await page.close();
  }

  await browser.close();
  console.log('\nAll images saved to store-assets/screenshots/');
})();
