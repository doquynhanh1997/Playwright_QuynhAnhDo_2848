import { test, expect } from '@playwright/test';
import { LoginPage } from './Login.page';
import { InventoryPage } from './Inventory.page';
import { CartPage } from './Cart.page';
import { CheckoutPage } from './Checkout.page';

test.describe('TC001 - Verify error message appear when login with invalid user', () => {
  let loginPage: 
  LoginPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    await loginPage.goto();
  });

  test('Verify locked out user error message', async () => {
    await loginPage.login('locked_out_user', 'secret_sauce');
    const errorMessage = await loginPage.getErrorMessage();
    expect(errorMessage).toBe('Epic sadface: Sorry, this user has been locked out.');
  });
});

test.describe('TC002', () => {
    let loginPage: LoginPage;
    let inventoryPage: InventoryPage;
    let cartPage: CartPage;
    let checkoutPage: CheckoutPage;
  
    test.beforeEach(async ({ page }) => {
      loginPage = new LoginPage(page);
      inventoryPage = new InventoryPage(page);
      cartPage = new CartPage(page);
      checkoutPage = new CheckoutPage(page);
  
      await loginPage.goto();
      await loginPage.login('standard_user', 'secret_sauce');
    });
    
test('Verify user can order product successfully', async () => {
        await inventoryPage.validateProductsVisible();
        await inventoryPage.addItemToCart();
        await inventoryPage.goToCart();
    
        await cartPage.validateCartItemVisible();
        await cartPage.checkout();
    
        await checkoutPage.fillCheckoutForm('QA', 'Do', '12345');
        await checkoutPage.continue();
    
        await checkoutPage.finish();
        await checkoutPage.validateThankYouMessage();
    
        expect(await checkoutPage.thankYouMessage.textContent()).toBe('Thank you for your order!');
        expect(await checkoutPage.dispatchMessage.textContent()).toBe('Your order has been dispatched, and will arrive just as fast as the pony can get there!');
    });
});