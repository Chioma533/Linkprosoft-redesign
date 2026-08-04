const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');

/**
 * Screenshots both buyer (/home) and professional (/professional/home) screens.
 * Note: both routes are behind PrivateRoutes (employer/professional), so we skip auth
 * by navigating to the dev server which should allow access in dev mode.
 * Alternatively the script visits the pages directly - auth check may redirect to /login.
 * For visual dev testing we pass ?bypass=1 or use a direct component preview.
 * In practice, the Vite dev server serves the SPA and React-Router handles the navigation client-side.
 */
(async () => {
  const browser = await chromium.launch({ headless: true });

  const outDir = path.join(__dirname, '..', 'public', 'screenshots');
  fs.mkdirSync(outDir, { recursive: true });

  /* ──────────────────────────────────────────────────────
     Helper: screenshot a page at a given URL
  ────────────────────────────────────────────────────── */
  async function screenshotPage(url, prefix) {
    const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
    const page = await context.newPage();

    const errors = [];
    page.on('console', msg => { if (msg.type() === 'error') errors.push(msg.text()); });
    page.on('pageerror', err => errors.push(err.message));

    await page.goto(url, { waitUntil: 'networkidle', timeout: 30000 });
    await page.waitForTimeout(1500);

    // Inject white bg so transparent PNGs render cleanly (not checkerboard)
    await page.evaluate(() => {
      document.documentElement.style.background = '#ffffff';
      document.body.style.background = '#ffffff';
    });
    await page.waitForTimeout(300);

    // Full page
    await page.screenshot({ path: path.join(outDir, `${prefix}-full.png`), fullPage: true });

    // Above-fold viewport
    await page.screenshot({ path: path.join(outDir, `${prefix}-viewport.png`), fullPage: false });

    // Hero section
    const hero = await page.$('#professional-hero-section') || await page.$('#hero-section');
    if (hero) await hero.screenshot({ path: path.join(outDir, `${prefix}-hero.png`) });

    // Search section
    const search = await page.$('#job-search-filter-section') || await page.$('#search-filter-section');
    if (search) await search.screenshot({ path: path.join(outDir, `${prefix}-search.png`) });

    // Grid section
    const grid = await page.$('#jobs-results-section') || await page.$('#professionals-results-section');
    if (grid) await grid.screenshot({ path: path.join(outDir, `${prefix}-grid.png`) });

    if (errors.length > 0) {
      console.error(`[${prefix}] Console errors:`);
      errors.forEach(e => console.error(' -', e));
    } else {
      console.log(`[${prefix}] Screenshots saved. No console errors.`);
    }

    await context.close();
  }

  // ── Buyer default screen (/home) ─────────────────────────────
  await screenshotPage('http://localhost:5175/home', 'buyer-screen');

  // ── Professional default screen (/professional/home) ─────────
  await screenshotPage('http://localhost:5175/professional/home', 'professional-screen');

  await browser.close();
  console.log('All screenshots saved to public/screenshots/');
})();
