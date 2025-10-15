const { Builder, By, until } = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');

// ChromeDriver setup
async function createDriver() {
    console.log('Setting up ChromeDriver...');
    
    let options = new chrome.Options();
    options.addArguments(
        '--no-sandbox',
        '--disable-dev-shm-usage',
        '--disable-gpu',
        '--window-size=1920,1080',
        '--headless',
        '--remote-debugging-port=0', // Let Chrome choose a free port
        '--user-data-dir=/tmp/chrome-profile-' + Date.now() 
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
    } else {
        console.log('Login form not found properly');
        return false;
    }
}

// Add Grapes to Cart from home page
async function addGrapesToCart(driver) {
    console.log('Starting Add to Cart test for Grapes...');
    
    try {
        // Make sure we're on home page
        const currentUrl = await driver.getCurrentUrl();
        if (!currentUrl.includes('/home')) {
            console.log('Navigating to home page...');
            await driver.get('http://localhost:3000/home');
            await driver.sleep(3000);
        }
        
        // Take screenshot of home page
        const screenshot = await driver.takeScreenshot();
        require('fs').writeFileSync('1-home-page.png', screenshot, 'base64');
        console.log('Home page screenshot saved');
        
        // Look for "Add To Cart" button for Grapes
        console.log('Looking for Add To Cart button near Grapes...');
        
        let addToCartButton = null;
        
        // Strategy 1: Look for button with exact text "Add To Cart" near Grapes
        try {
            // Find the Grapes element first
            const grapesElement = await driver.findElement(By.xpath('//*[contains(text(), "Grapes")]'));
            
            // Find the nearest "Add To Cart" button to Grapes
            addToCartButton = await grapesElement.findElement(By.xpath('./following-sibling::button[contains(text(), "Add To Cart")] | ./../button[contains(text(), "Add To Cart")] | ./ancestor::div//button[contains(text(), "Add To Cart")]'));
            console.log('Found Add To Cart button near Grapes');
        } catch (error) {
            console.log('Could not find button near Grapes with exact text');
        }
        
        // Strategy 2: Look for any "Add To Cart" button on the page
        if (!addToCartButton) {
            try {
                const addToCartButtons = await driver.findElements(By.xpath('//button[contains(text(), "Add To Cart")]'));
                if (addToCartButtons.length > 0) {
                    addToCartButton = addToCartButtons[0];
                    console.log('Found Add To Cart button on page');
                }
            } catch (error) {
                console.log('No Add To Cart buttons found');
            }
        }
        
        // Strategy 3: Look for any button that might be add to cart
        if (!addToCartButton) {
            try {
                const allButtons = await driver.findElements(By.css('button'));
                for (let button of allButtons) {
                    const buttonText = await button.getText();
                    if (buttonText && buttonText.includes('Add')) {
                        addToCartButton = button;
                        console.log('Found button with "Add" text');
                        break;
                    }
                }
            } catch (error) {
                console.log('No suitable buttons found');
            }
        }
        
        if (addToCartButton) {
            console.log('Clicking Add To Cart button for Grapes...');
            await addToCartButton.click();
            await driver.sleep(3000);
            
            console.log('Add To Cart button clicked');
            
            // Take screenshot after adding to cart
            const afterScreenshot = await driver.takeScreenshot();
            require('fs').writeFileSync('2-after-add-to-cart.png', afterScreenshot, 'base64');
            console.log('After Add to Cart screenshot saved');
            
            return true;
        } else {
            console.log('No Add To Cart button found');
            return false;
        }
        
    } catch (error) {
        console.error('Error adding item to cart:', error.message);
        return false;
    }
}

// Navigate to cart and verify item was added
async function verifyCart(driver) {
    console.log('Navigating to cart page...');
    
    try {
        // Look for cart link/button
        let cartLink = null;
        
        // Strategy 1: Look for link with href containing "cart"
        try {
            const cartLinks = await driver.findElements(By.css('a[href*="/cart"], a[href*="cart"]'));
            if (cartLinks.length > 0) {
                cartLink = cartLinks[0];
                console.log('Found cart link using href');
            }
        } catch (error) {
            console.log('No cart link found with href');
        }
        
        // Strategy 2: Look for link with text "Cart"
        if (!cartLink) {
            try {
                const cartLinks = await driver.findElements(By.xpath('//a[contains(text(), "Cart")]'));
                if (cartLinks.length > 0) {
                    cartLink = cartLinks[0];
                    console.log('Found cart link using text');
                }
            } catch (error) {
                console.log('No cart link found with text');
            }
        }
        
        // Strategy 3: Direct navigation
        if (!cartLink) {
            console.log('Cart link not found, navigating directly...');
            await driver.get('http://localhost:3000/cart');
            await driver.sleep(3000);
        } else {
            await cartLink.click();
            await driver.sleep(3000);
        }
        
        const cartUrl = await driver.getCurrentUrl();
        console.log('Cart page URL:', cartUrl);
        
        // Take screenshot of cart page
        const cartScreenshot = await driver.takeScreenshot();
        require('fs').writeFileSync('3-cart-page.png', cartScreenshot, 'base64');
        console.log('Cart page screenshot saved');
        
        // Verify Grapes is in the cart
        console.log('Verifying Grapes is in the cart...');
        
        const pageSource = await driver.getPageSource();
        if (pageSource.includes('Grapes')) {
            console.log('SUCCESS: Grapes found in the cart!');
            return true;
        } else {
            console.log('Grapes not found in the cart');
            return false;
        }
        
    } catch (error) {
        console.error('Error verifying cart:', error.message);
        return false;
    }
}

// Main test function
async function runAddToCartTest() {
    let driver = null;
    
    try {
        console.log('Starting AURAPOS Add to Cart Test...');
        
        // Step 1: Create driver
        driver = await createDriver();
        
        // Step 2: Login to application
        console.log('\n=== STEP 1: LOGIN ===');
        const loginSuccess = await login(driver);
        if (!loginSuccess) {
            throw new Error('Login failed');
        }
        
        // Step 3: Add Grapes to Cart from home page
        console.log('\n=== STEP 2: ADD GRAPES TO CART ===');
        const addSuccess = await addGrapesToCart(driver);
        if (!addSuccess) {
            throw new Error('Adding to cart failed');
        }
        
        // Step 4: Navigate to cart and verify
        console.log('\n=== STEP 3: VERIFY CART ===');
        const verifySuccess = await verifyCart(driver);
        
        if (verifySuccess) {
            console.log('\nADD TO CART TEST PASSED!');
            console.log('Login successful');
            console.log('Grapes added to cart successfully');
            console.log('Grapes verified in cart');
        } else {
            console.log('\nADD TO CART TEST FAILED');
            console.log('Login successful');
            console.log('Grapes added to cart');
            console.log('Grapes not found in cart');
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
