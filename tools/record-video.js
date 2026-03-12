const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');

const SOURCE  = path.resolve(__dirname, 'sources', 'promo-video.html');
const OUT_DIR = path.resolve(__dirname, '..', 'store-assets', 'video');

(async () => {
  const htmlFile = 'file:///' + SOURCE.replace(/\\/g, '/');

  console.log('🎬 Starting video recording...');

  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 1280, height: 720 },
    recordVideo: {
      dir: OUT_DIR,
      size: { width: 1280, height: 720 },
    },
  });

  const page = await context.newPage();
  await page.goto(htmlFile, { waitUntil: 'networkidle' });

  const totalMs = 32000;
  console.log(`⏳ Recording for ${totalMs / 1000}s...`);
  await page.waitForTimeout(totalMs);

  await context.close();
  await browser.close();

  // Rename generated .webm to promo-video.webm
  const files = fs.readdirSync(OUT_DIR).filter(f => f.endsWith('.webm') && f !== 'promo-video.webm');
  if (files.length > 0) {
    const latest = files.sort((a, b) =>
      fs.statSync(path.join(OUT_DIR, b)).mtimeMs - fs.statSync(path.join(OUT_DIR, a)).mtimeMs
    )[0];
    fs.renameSync(path.join(OUT_DIR, latest), path.join(OUT_DIR, 'promo-video.webm'));
  }

  console.log('✓ Saved: store-assets/video/promo-video.webm');
})();
