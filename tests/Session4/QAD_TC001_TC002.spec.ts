import { test, expect } from '@playwright/test';

test.beforeEach(async ({ page }) => {
    console.log('beforeEach: Start the page');
    await page.goto('https://www.saucedemo.com/inventory.html/');
})

test('TC001 - Verify sort by price', async ({ page }) => {
  //await page.goto('https://www.saucedemo.com/');
  await page.fill('#user-name', 'standard_user');
  await page.fill('#password', 'secret_sauce');
  await page.click('#login-button');
  await page.waitForSelector('.inventory_list');

  const header = await page.locator('.title').innerText();
  expect(header).toBe('Products');

  await page.selectOption('.product_sort_container', 'lohi');
  
  await page.waitForSelector('.inventory_item');

  const prices = await page.$$eval('.inventory_item_price', elements =>
    elements.map(el => parseFloat(el.textContent?.replace('$', '') || '0'))
);

for (let i = 0; i < prices.length - 1; i++) {
    expect(prices[i]).toBeLessThanOrEqual(prices[i + 1]);
}
});

test('TC002 - Verify user can order product', async ({ page }) => {
    //await page.goto('https://www.saucedemo.com/');
    await page.fill('#user-name', 'standard_user');
    await page.fill('#password', 'secret_sauce');
    await page.click('#login-button');
    await page.waitForSelector('.inventory_list');
  
    const header = await page.locator('.title').innerText();
    expect(header).toBe('Products');
  
    const firstItemButton = page.locator('.inventory_item:first-child button');
    await firstItemButton.click();
  
    await expect(firstItemButton).toHaveText('Remove');
    await expect(page.locator('.shopping_cart_badge')).toHaveText('1');
  
    await page.click('.shopping_cart_link');
    
    await expect(page.locator('.cart_item')).toHaveCount(1);
  
    await page.click('#checkout');
  
    await page.fill('#first-name', 'QA');
    await page.fill('#last-name', 'Do');
    await page.fill('#postal-code', '12345');
  
    await expect(page.locator('#first-name')).toHaveValue('QA');
    await expect(page.locator('#last-name')).toHaveValue('Do');
    await expect(page.locator('#postal-code')).toHaveValue('12345');
  
    await page.click('#continue');
  
    await expect(page.locator('.cart_item')).toHaveCount(1);
  
    await page.click('#finish');
  
    await expect(page.locator('.complete-header')).toHaveText('Thank you for your order!');
    await expect(page.locator('.complete-text')).toHaveText('Your order has been dispatched, and will arrive just as fast as the pony can get there!');
  });