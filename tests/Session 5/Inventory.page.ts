import { Page, Locator } from '@playwright/test';

export class InventoryPage {
  readonly page: Page;
  readonly addToCartButton: Locator;
  readonly productsTitle: Locator;
  readonly cartIcon: Locator;

  constructor(page: Page) {
    this.page = page;
    this.addToCartButton = page.locator('.inventory_item:first-child button');
    this.productsTitle = page.locator('.title');
    this.cartIcon = page.locator('.shopping_cart_link');
  }

  async validateProductsVisible() {
    await this.productsTitle.waitFor();
  }

  async addItemToCart() {
    await this.addToCartButton.click();
  }

  async goToCart() {
    await this.cartIcon.click();
  }
}
