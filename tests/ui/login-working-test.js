const { Builder, By, until } = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');
const path = require('path');

// Windows-specific ChromeDriver setup
async function createDriver() {
    console.log('Setting up ChromeDriver for Windows...');
    
    let options = new chrome.Options();
    
    // Essential Windows arguments
    options.addArguments(
        '--no-sandbox',
        '--disable-dev-shm-usage',
        '--disable-gpu',
        '--window-size=1920,1080',
        '--disable-extensions',
        '--disable-blink-features=AutomationControlled',
        '--disable-features=VizDisplayCompositor',
        '--disable-background-timer-throttling',
        '--disable-backgrounding-occluded-windows',
        '--disable-renderer-backgrounding',
        '--no-first-run',
        '--no-default-browser-check',
        '--user-data-dir=/tmp/chrome-${Date.now()}'
    );
    
    // Set explicit Chrome path for Windows
    const chromePaths = [
        "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
        "C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe"
    ];
    
    for (const chromePath of chromePaths) {
        if (require('fs').existsSync(chromePath)) {
            options.setChromeBinaryPath(chromePath);
            console.log('Using Chrome from:', chromePath);
            break;
        }
    }
    
    // Create driver with explicit configuration
    const driver = await new Builder()
        .forBrowser('chrome')
        .setChromeOptions(options)
        .build();
    
    // Set reasonable timeouts
    await driver.manage().setTimeouts({ 
        implicit: 10000,
        pageLoad: 30000,
        script: 30000 
    });
    
    console.log('ChromeDriver started successfully!');
    return driver;
}

// Simple test function (not using Mocha/Jest)
async function runAuraposTest() {
    let driver = null;
    
    try {
        console.log('Starting AURAPOS test...');
        
        // Step 1: Create driver
        driver = await createDriver();
        
        // Step 2: Navigate to login page
        console.log('Navigating to login page...');
        await driver.get('http://localhost:3000/login');
        await driver.sleep(5000);
        
        // Step 3: Check if page loaded
        const currentUrl = await driver.getCurrentUrl();
        console.log('Current URL:', currentUrl);
        
        const pageTitle = await driver.getTitle();
        console.log('Page title:', pageTitle);
        
        // Step 4: Take screenshot
        const screenshot = await driver.takeScreenshot();
        require('fs').writeFileSync('login-page.png', screenshot, 'base64');
        console.log('Screenshot saved as login-page.png');
        
        // Step 5: Check page content
        const pageSource = await driver.getPageSource();
        console.log('Page contains AURAPOS:', pageSource.includes('AURAPOS'));
        console.log('Page contains Login:', pageSource.includes('Login'));
        console.log('Page contains User ID:', pageSource.includes('User ID'));
        console.log('Page contains Password:', pageSource.includes('Password'));
        
        // Step 6: Find form elements
        console.log('Looking for form elements...');
        const inputs = await driver.findElements(By.css('input'));
        const buttons = await driver.findElements(By.css('button'));
        console.log('Found', inputs.length, 'input fields');
        console.log('Found', buttons.length, 'buttons');
        
        // Step 7: Try to login if elements found
        if (inputs.length >= 2 && buttons.length > 0) {
            console.log('Attempting to login...');
            
            // Try to find username field
            let usernameField = inputs[0];
            await usernameField.clear();
            await usernameField.sendKeys('test1');
            console.log('Username entered');
            
            // Try to find password field  
            let passwordField = inputs[1];
            await passwordField.clear();
            await passwordField.sendKeys('12345');
            console.log('Password entered');
            
            // Try to find login button
            let loginButton = buttons[0];
            await loginButton.click();
            console.log('Login button clicked');
            
            // Wait for navigation
            await driver.sleep(10000);
            
            // Check result
            const newUrl = await driver.getCurrentUrl();
            console.log('New URL after login:', newUrl);
            
            if (!newUrl.includes('/login')) {
                console.log('LOGIN SUCCESSFUL!');
            } else {
                console.log('Login may have failed');
            }
        }
        
        console.log('Test completed successfully!');
        
    } catch (error) {
        console.error('Test failed:', error.message);
    } finally {
        // Always quit driver
        if (driver) {
            await driver.quit();
            console.log('Browser closed');
        }
    }
}

// Run the test
console.log('=== AURAPOS UI TEST STARTING ===');
runAuraposTest().then(() => {
    console.log('=== TEST FINISHED ===');
}).catch(error => {
    console.error('=== TEST FAILED ===', error);
});