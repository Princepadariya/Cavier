import { chromium } from 'playwright';

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage({ 
    viewport: { width: 1440, height: 900 } 
  });
  
  await page.goto('http://localhost:5173');
  // wait for react elements to render
  await page.waitForTimeout(2000);
  
  await page.screenshot({ path: 'screenshot_hero_start.png' });
  
  // scroll 50vh
  await page.evaluate(() => window.scrollBy(0, window.innerHeight * 0.5));
  await page.waitForTimeout(500);
  await page.screenshot({ path: 'screenshot_hero_mid.png' });
  
  // scroll 100vh
  await page.evaluate(() => window.scrollBy(0, window.innerHeight * 0.5));
  await page.waitForTimeout(500);
  await page.screenshot({ path: 'screenshot_hero_end.png' });
  
  await browser.close();
})();
