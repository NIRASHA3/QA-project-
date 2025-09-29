const { Builder } = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');
async function testBrowser() {
    console.log('Testing ChromeDriver startup...');
    try {
        let options = new chrome.Options();
        options.addArguments('--no-sandbox');
        options.addArguments('--disable-dev-shm-usage');
        options.addArguments('--disable-gpu');
        options.addArguments('--window-size=1024,768');
        console.log('Creating driver...');
        let driver = await new Builder()
            .forBrowser('chrome')
            .setChromeOptions(options)
            .build();
        console.log('? ChromeDriver started successfully!');
        console.log('Navigating to Google...');
        await driver.get('https://www.google.com');
        await driver.sleep(3000);
        const title = await driver.getTitle();
        console.log('Page title:', title);
        await driver.quit();
        console.log('? Test completed successfully!');
        return true;
    } catch (error) {
        console.error('? Error:', error.message);
        return false;
    }
}
// Run the test
testBrowser().then(success => {
    if (success) {
        console.log('?? Browser test PASSED!');
        process.exit(0);
    } else {
        console.log('?? Browser test FAILED!');
        process.exit(1);
    }
});
