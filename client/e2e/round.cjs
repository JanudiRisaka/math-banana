const assert = require('node:assert/strict');
const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch();
  try {
    for (const ending of ['timer', 'lives']) {
      const page = await browser.newPage();
      const scores = [];
      const pageErrors = [];
      page.on('pageerror', error => pageErrors.push(error.message));
      await page.route('**/api/**', async route => {
        const path = new URL(route.request().url()).pathname;
        if (path === '/api/game/scores') {
          scores.push(route.request().postDataJSON().score);
          await new Promise(resolve => setTimeout(resolve, 1200));
          return route.fulfill({ json: { success: true, data: { highScore: 0, dailyStreak: 1 } } });
        }
        const data = path === '/api/user/data'
          ? { success: true, userData: { username: 'Test Player', isAccountVerified: true } }
          : { success: true, status: 'ok', data: path.endsWith('leaderboard') ? [] : {} };
        await route.fulfill({ json: data });
      });
      let failPuzzle = ending === 'lives';
      await page.route('https://marcconrad.com/uob/banana/api.php', route => {
        if (failPuzzle) {
          failPuzzle = false;
          return route.fulfill({ status: 503, json: { error: 'Unavailable' } });
        }
        return route.fulfill({ json: { question: '/favicon.svg', solution: 0 } });
      });
      await page.goto('http://localhost:5173/game');
      await page.getByText('Expert', {exact:true}).click({ timeout: 10000 });
      if (ending === 'lives') {
        const retry = page.getByRole('button', { name: 'Try Again' });
        await retry.waitFor();
        await page.getByRole('spinbutton').fill('1');
        assert.ok(await page.getByRole('button', { name: 'Submit Answer' }).isDisabled());
        await new Promise(resolve => setTimeout(resolve, 1200));
        assert.ok(await page.getByText('30s', { exact: true }).isVisible());
        await retry.click();
      }
      await page.getByAltText('Math Question').waitFor();
      if (ending === 'lives') {
        await page.getByText('29s', { exact: true }).waitFor({ timeout: 5000 });
        console.log('Puzzle retry paused the timer and resumed play');
      }
      if (ending === 'lives') {
        for (let i = 0; i < 3; i++) {
          await page.getByRole('spinbutton').fill('1');
          await page.getByRole('button', { name: 'Submit Answer' }).click();
        }
      }
      try {
        await page.getByRole('heading', { name: 'Game Over', exact: true }).waitFor({ timeout: 45000 });
      } catch (error) {
        console.error({ ending, scores, pageErrors, screen: await page.locator('main').innerText({ timeout: 2000 }).catch(() => '') });
        throw error;
      }
      assert.deepEqual(scores, [0]);
      assert.deepEqual(pageErrors, []);
      console.log(ending + ': one score request and Game Over shown');
      await page.close();
    }
  } finally {
    await browser.close();
  }
})().catch(error => { console.error(error); process.exitCode = 1; });
