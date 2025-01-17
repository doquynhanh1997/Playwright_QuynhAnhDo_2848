import { test, expect } from '@playwright/test'
import { execPath } from 'process';

test.beforeEach(async ({ page }) => {
    console.log('beforeEach: Start the page');
    await page.goto('https://the-internet.herokuapp.com/');
})

//TC1
test.skip('TC001 - Verify Checkboxes', { tag: '@smkoke' }, async ({ page }) => 
{
    //await page.goto('https://the-internet.herokuapp.com/');
    await page.getByRole("link",{name:'Checkboxes'}).click();
    await expect(page.getByRole("heading",{name:'Checkboxes'})).toBeVisible();

    const checkbox1 = (await page.$$('input[type="checkbox"]'))[0];
    await checkbox1.check();
    let isChecked = await checkbox1.isChecked();
    console.log('Checkbox 1 checked:', isChecked); 

    const checkbox2 = (await page.$$('input[type="checkbox"]'))[1];
    await checkbox2.uncheck();
    isChecked = await checkbox2.isChecked();
    console.log('Checkbox 2 checked:', isChecked); 
})

//TC2
test('TC002 - Verify Drag and Drop', { tag: '@smkoke' }, async ({ page }) => 
{
    //await page.goto('https://the-internet.herokuapp.com/');
    await page.getByRole("link",{name:'Drag and Drop'}).click();
    await expect(page.getByRole("heading",{name:'Drag and Drop'})).toBeVisible();
    
    const source = page.locator('#column-a');
    const target = page.locator('#column-b');

    await source.dragTo(target);

    const newcolumnAheader = await source.textContent();
    const newcolumnBheader = await target.textContent();

    expect(newcolumnAheader).toBe('B');
    expect(newcolumnBheader).toBe('A');
})

//TC3
test.fail('TC003 - Verify Dropdown', { tag: '@smkoke' }, async ({ page }) => 
{
    //await page.goto('https://the-internet.herokuapp.com/');
    await page.getByRole("link",{name:'Dropdown'}).click();
    await expect(page.getByRole("heading",{name:'Dropdown List'})).toBeVisible();
        
    await page.selectOption('#dropdown','Option 2');
    await expect(page.locator('#dropdown')).toHaveValue('2');
})


//TC4
test('TC004 - Verify Frames (alternative)', { tag: '@regression' }, async ({ page }) => 
{
    await page.goto('https://www.globalsqa.com/demo-site/frames-and-windows/');
    await expect(page.getByRole("heading",{name:'Frames And Windows'})).toBeVisible();

    await page.getByRole('tab', { name: 'iFrame' }).click();
    await expect(page.getByRole('tab', { name: 'iFrame' })).toBeVisible();

    const iframeLocator = page.frameLocator('iframe.lazyloaded');
    await iframeLocator.locator('input[name="s"]').fill('Playwright');

    await iframeLocator.locator('.button_search').click();

    await expect(iframeLocator.locator('ol')).toContainText('Sorry, no posts matched your criteria.');
})

//TC5
test('TC005 - Verify Upload file', { tag: '@smkoke' }, async ({ page }) => 
{
    //await page.goto('https://the-internet.herokuapp.com/');
    await page.getByRole("link",{name:'File Upload'}).click();
    await expect(page.getByRole("heading",{name:'File Uploader'})).toBeVisible();

    await page.locator('#file-upload').setInputFiles('./tests/bear.pdf');
    await page.getByRole('button', { name: 'Upload' }).click();
    await expect(page.locator('#uploaded-files')).toContainText('bear.pdf');
})

//TC6
test('TC006 - Verify Dynamically Loaded Page Elements', { tag: '@smkoke' }, async ({ page }) => 
{
    //await page.goto('https://the-internet.herokuapp.com/');
    await page.getByRole("link",{name:'Dynamic Loading'}).click();
    await expect(page.getByRole("heading",{name:'Dynamically Loaded Page Elements'})).toBeVisible();

    await page.getByRole("link",{name:'Example 1: Element on page that is hidden'}).click();
    await expect(page.getByRole("heading",{name:'Dynamically Loaded Page Elements'})).toBeVisible();

    await page.getByRole("button", {name: "Start"}).click();

    await page.waitForSelector('#loading'); 
    await page.waitForSelector('#loading', { state: 'hidden' });
    await page.waitForSelector('#finish:has-text("Hello World!")');
})

//TC7
test('TC007 - Verify input', { tag: '@regression' }, async ({ page }) => 
{
    await page.goto('https://testautomationpractice.blogspot.com/');
    await expect(page.getByRole("heading",{name:' Automation Testing Practice'})).toBeVisible();

    const nameInput = await page.$('input[name="name"]');
    if (nameInput) {
        await nameInput.fill('Quynh Anh Do');
    }

    const addressInput = await page.$('textarea[name="message"]');
    if (addressInput) {
        await addressInput.fill('District 1, TPHCM');
    }

    await page.locator('#name').clear();
    await page.getByLabel('Address:').clear();
})

//TC8
test('TC008 - Verify prompt dialog', { tag: '@regression' }, async ({ page }) => 
{
    await page.goto('https://testautomationpractice.blogspot.com/');
    await expect(page.getByRole("heading",{name:' Automation Testing Practice'})).toBeVisible();
    
    page.on('dialog', async dialog=> {
        expect(dialog.type()).toContain('prompt');
        expect(dialog.message()).toContain('Please enter your nam');
        expect(dialog.defaultValue()).toContain('Harry Potter');
        await dialog.accept('Anh Quynh Do');
    })
    await page.click('//button[normalize-space()="Prompt"]');
    await expect(page.locator('#demo')).toContainText('Hello Anh Quynh Do! How are you today?');
})