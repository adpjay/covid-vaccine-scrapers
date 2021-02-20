const sites = require("../data/sites.json");

module.exports = async function GetAvailableAppointments(browser) {
    console.log("BigY starting.");
    const webData = await ScrapeWebsiteData(browser);
    console.log("BigY done.");
    return {
        ...sites.BigY,
        ...webData,
    };
};

async function ScrapeWebsiteData(browser) {
    const page = await browser.newPage();
    await page.goto(sites.BigY.website);
    await page.solveRecaptchas().then(({ solved }) => {
        if (solved.length) {
            return page.waitForNavigation();
        } else {
            return;
        }
    });
    await page.select("#Group", "COVID-facing and non-COVID facing healthcare worker");
    const submitForm = await page.$("[action='/Orchard.DynamicForms/Form/Submit']")
    await Promise.all([
        submitForm.evaluate(f => f.submit()),
        page.waitForNavigation({ waitUntil: 'networkidle0' }),
    ]);    
    // await page.waitForNavigation();

    console.log(page.url());
    const response = await page.webData;
    // const response = await page.waitForResponse();
    console.log(response);
    return response;
}
