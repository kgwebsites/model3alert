const puppeteer = require('puppeteer');
const twilio = require('twilio');
require('dotenv').config();

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto('https://3.tesla.com/model3/design#battery', {waitUntil: 'networkidle2'});
  const bodyHandle = await page.$('.finance-container--footer-tabControl');
  const html = await page.evaluate(body => body.innerHTML, bodyHandle);
  await bodyHandle.dispose();
  const leaseAvailable = html.toLowerCase().includes("lease");
  if (leaseAvailable) {
    const accountSid = process.env.ACCOUNTSID;
    const authToken = process.env.AUTHTOKEN;
    const client = new twilio(accountSid, authToken);
    try {
      const message = await client.messages.create({
          body: 'Model 3 Leasing is now available!',
          to: process.env.PHONETO,
          from: process.env.PHONEFROM
      });
    } catch (e) {
      console.log(e);
    }
  }
  await browser.close();
})();