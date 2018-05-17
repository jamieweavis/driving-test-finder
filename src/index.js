#!/usr/bin/env node

const dayjs = require('dayjs');
const sendmail = require('sendmail')({ silent: true });
const notifier = require('node-notifier');
const puppeteer = require('puppeteer');

const output = require('./output');
const helper = require('./helper');
const config = require('../config');

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  const login = async () => {
    await page.goto('https://driverpracticaltest.direct.gov.uk/login');
    await page.type('#driving-licence-number', config.licenseNumber);
    await page.type('#application-reference-number', config.referenceNumber);
    await helper.clickAndWaitForNavigation('#booking-login', page);
    await helper.clickAndWaitForNavigation('#date-time-change', page);
    await page.click('#test-choice-earliest');
    await helper.clickAndWaitForNavigation('#driving-licence-submit', page);
    await update();
  };

  const update = async () => {
    await page.reload();
    const earliestDate = await page.evaluate(() => {
      const dataDateEl = document.querySelector(
        '.BookingCalendar-date--bookable a'
      );
      return dataDateEl ? dataDateEl.getAttribute('data-date') : null;
    });

    const ts = dayjs().format('HH:mm:ss');

    if (!earliestDate) {
      helper.yellow(`[${ts}] Session expired, relogging`);
      return await login();
    }

    if (dayjs(earliestDate).isBefore(dayjs(config.maxDate))) {
      helper.green(`[${ts}] Available driving test! (${earliestDate})`);
      notifier.notify(output.notification(earliestDate));
      if (config.emailTo && config.emailFrom) {
        sendmail(output.email(earliestDate, config.emailTo, config.emailFrom));
      }
    } else {
      helper.red(`[${ts}] No available driving tests`);
    }
    setTimeout(await update, 60 * 1000);
  };
  await login();
})();
