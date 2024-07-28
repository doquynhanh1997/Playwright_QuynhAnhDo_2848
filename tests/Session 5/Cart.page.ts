import { Page, Locator } from '@playwright/test';

export class CartPage {
  readonly page: Page;
  readonly cartItem: Locator;
  readonly checkoutButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.cartItem = page.locator('.cart_item');
    this.checkoutButton = page.locator('#checkout');
  }

  async validateCartItemVisible() {
    await this.cartItem.waitFor();
  }

  async checkout() {
    await this.checkoutButton.click();
  }
}
