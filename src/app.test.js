import puppeteer from 'puppeteer';

test('renders without crashing', async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  page.emulate({
    viewport: {
      width: 1920,
      height: 1080
    },
    userAgent: ''
  });
  await page.goto('http://localhost:3000');
  const root = await page.waitForSelector('#root');
  expect(root).not.toEqual(null);
  const children = await page.evaluate(
    () => document.querySelectorAll('#root > *').length
  );
  expect(children).toBeGreaterThan(0);
  browser.close();
}, 20000);
