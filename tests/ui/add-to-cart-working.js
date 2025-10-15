const { Builder, By, until } = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');
const fs = require('node:fs');

// ChromeDriver setup
async function createDriver() {
    console.log('Setting up ChromeDriver...');
    
    const options = new chrome.Options();
    options.addArguments(
        '--no-sandbox',
        '--disable-dev-shm-usage',
        '--disable-gpu',
        '--window-size=1920,1080',
        '--headless',
        '--remote-debugging-port=0',
        `--user-data-dir=/tmp/chrome-profile-${Date.now()}`
    );
    
    const driver = await new Builder()
        .forBrowser('chrome')
        .setChromeOptions(options)
        .build();
    
    await driver.manage().setTimeouts({ 
        implicit: 10000,
        pageLoad: 30000
    });
    
    console.log('ChromeDriver started successfully!');
    return driver;
}

// Helper function to save screenshots
function saveScreenshot(screenshot, filename) {
    try {
        fs.writeFileSync(filename, screenshot, 'base64');
        console.log(`${filename} screenshot saved`);
    } catch (error) {
        console.error(`Failed to save screenshot ${filename}:`, error.message);
    }
}

// Login function
async function login(driver) {
    console.log('Logging into AURAPOS...');
    
    await driver.get('http://localhost:3000/login');
    await driver.sleep(3000);
    
    // Find login form elements
    const inputs = await driver.findElements(By.css('input'));
    const buttons = await driver.findElements(By.css('button'));
    
    console.log(`Found ${inputs.length} input fields and ${buttons.length} buttons`);
    
    if (inputs.length >= 2 && buttons.length > 0) {
        // Enter credentials
        await inputs[0].sendKeys('test1');
        await inputs[1].sendKeys('12345');
        await buttons[0].click();
        
        console.log('Login credentials entered and submitted');
        
        // Wait for navigation to home page
        await driver.sleep(5000);
        
        const currentUrl = await driver.getCurrentUrl();
        console.log('Current URL after login:', currentUrl);
        
        return true;
    }
    
    console.log('Login form not found properly');
    return false;
}

// Helper function to find Add To Cart button
async function findAddToCartButton(driver) {
    console.log('Looking for Add To Cart button...');
    
    // Strategy 1: Look for button near Tomato
    try {
        const tomatoElement = await driver.findElement(By.xpath('//*[contains(text(), "Tomato")]'));
        const button = await tomatoElement.findElement(By.xpath('./following-sibling::button[contains(text(), "Add To Cart")] | ./../button[contains(text(), "Add To Cart")] | ./ancestor::div//button[contains(text(), "Add To Cart")]'));
        console.log('Found Add To Cart button near Tomato');
        return button;
    } catch (error) {
        console.log('Could not find button near Tomato with exact text:', error.message);
    }
    
    // Strategy 2: Look for any "Add To Cart" button on the page
    try {
        const addToCartButtons = await driver.findElements(By.xpath('//button[contains(text(), "Add To Cart")]'));
        if (addToCartButtons.length > 0) {
            console.log('Found Add To Cart button on page');
            return addToCartButtons[0];
        }
    } catch (error) {
        console.log('No Add To Cart buttons found:', error.message);
    }
    
    // Strategy 3: Look for any button that might be add to cart
    try {
        const allButtons = await driver.findElements(By.css('button'));
        for (const button of allButtons) {
            const buttonText = await button.getText();
            if (buttonText?.includes('Add')) {
                console.log('Found button with "Add" text');
                return button;
            }
        }
    } catch (error) {
        console.log('No suitable buttons found:', error.message);
    }
    
    return null;
}

// Add Tomato to Cart from home page
async function addTomatoToCart(driver) {
    console.log('Starting Add to Cart test for Tomato...');
    
    // Make sure we're on home page
    const currentUrl = await driver.getCurrentUrl();
    if (!currentUrl.includes('/home')) {
        console.log('Navigating to home page...');
        await driver.get('http://localhost:3000/home');
        await driver.sleep(3000);
    }
    
    // Take screenshot of home page
    const screenshot = await driver.takeScreenshot();
    saveScreenshot(screenshot, '1-home-page.png');
    
    const addToCartButton = await findAddToCartButton(driver);
    
    if (!addToCartButton) {
        console.log('No Add To Cart button found');
        return false;
    }
    
    console.log('Clicking Add To Cart button for Tomato...');
    await addToCartButton.click();
    await driver.sleep(3000);
    
    console.log('Add To Cart button clicked');
    
    // Take screenshot after adding to cart
    const afterScreenshot = await driver.takeScreenshot();
    saveScreenshot(afterScreenshot, '2-after-add-to-cart.png');
    
    return true;
}

// Helper function to find cart link
async function findCartLink(driver) {
    // Strategy 1: Look for link with href containing "cart"
    try {
        const cartLinks = await driver.findElements(By.css('a[href*="/cart"], a[href*="cart"]'));
        if (cartLinks.length > 0) {
            console.log('Found cart link using href');
            return cartLinks[0];
        }
    } catch (error) {
        console.log('No cart link found with href:', error.message);
    }
    
    // Strategy 2: Look for link with text "Cart"
    try {
        const cartLinks = await driver.findElements(By.xpath('//a[contains(text(), "Cart")]'));
        if (cartLinks.length > 0) {
            console.log('Found cart link using text');
            return cartLinks[0];
        }
    } catch (error) {
        console.log('No cart link found with text:', error.message);
    }
    
    return null;
}

// Navigate to cart and verify item was added
async function verifyCart(driver) {
    console.log('Navigating to cart page...');
    
    const cartLink = await findCartLink(driver);
    
    if (cartLink) {
        await cartLink.click();
    } else {
        console.log('Cart link not found, navigating directly...');
        await driver.get('http://localhost:3000/cart');
    }
    
    await driver.sleep(3000);
    
    const cartUrl = await driver.getCurrentUrl();
    console.log('Cart page URL:', cartUrl);
    
    // Take screenshot of cart page
    const cartScreenshot = await driver.takeScreenshot();
    saveScreenshot(cartScreenshot, '3-cart-page.png');
    
    // Verify Tomato is in the cart
    console.log('Verifying Tomato is in the cart...');
    
    const pageSource = await driver.getPageSource();
    if (pageSource.includes('Tomato')) {
        console.log('SUCCESS: Tomato found in the cart!');
        return true;
    }
    
    console.log('Tomato not found in the cart');
    return false;
}

// Main test function
async function runAddToCartTest() {
    let driver = null;
    
    console.log('Starting AURAPOS Add to Cart Test...');
    
    try {
        // Step 1: Create driver
        driver = await createDriver();
        
        // Step 2: Login to application
        console.log('\n=== STEP 1: LOGIN ===');
        const loginSuccess = await login(driver);
        if (!loginSuccess) {
            throw new Error('Login failed');
        }
        
        // Step 3: Add Tomato to Cart from home page
        console.log('\n=== STEP 2: ADD TOMATO TO CART ===');
        const addSuccess = await addTomatoToCart(driver);
        if (!addSuccess) {
            throw new Error('Adding to cart failed');
        }
        
        // Step 4: Navigate to cart and verify
        console.log('\n=== STEP 3: VERIFY CART ===');
        const verifySuccess = await verifyCart(driver);
        
        if (verifySuccess) {
            console.log('\nADD TO CART TEST PASSED!');
            console.log('Login successful');
            console.log('Tomato added to cart successfully');
            console.log('Tomato verified in cart');
        } else {
            console.log('\nADD TO CART TEST FAILED');
            console.log('Login successful');
            console.log('Tomato added to cart');
            console.log('Tomato not found in cart');
        }
        
    } catch (error) {
        console.error('\nTEST FAILED:', error.message);
    } finally {
        // Always quit driver
        if (driver) {
            await driver.quit();
            console.log('Browser closed');
        }
    }
}

// Run the test
console.log('=== AURAPOS ADD TO CART TEST STARTING ===');
runAddToCartTest().then(() => {
    console.log('=== TEST FINISHED ===');
}).catch(error => {
    console.error('=== TEST FAILED ===', error);
});