import { chromium, FullConfig } from '@playwright/test';

async function globalSetup(config: FullConfig) {
  const { baseURL } = config.projects[0].use;
  const browser = await chromium.launch();
  const page = await browser.newPage();

  // Navigate to the login page and perform login
  await page.goto(`${baseURL}`);
  await page.fill('#user-name', 'standard_user');
  await page.fill('#password', 'secret_sauce');
  await page.click('#login-button');

  // Ensure login was successful
  await page.waitForURL(`${baseURL}/inventory.html`);

  // Save authentication state to a file
  await page.context().storageState({ path: 'auth.json' });
  await browser.close();
}

export default globalSetup;