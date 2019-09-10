'use strict';
const chromium = require('chrome-aws-lambda');

module.exports.hello = async (event, context, callback) => {
  const queryStringParameters = event.queryStringParameters || {}
  const {
    url = 'https://www.google.com',
  } = queryStringParameters;

  let buffer = null;
  let browser = null;

  try {
    browser = await chromium.puppeteer.launch({
      args: chromium.args,
      defaultViewport: chromium.defaultViewport,
      executablePath: await chromium.executablePath,
      headless: chromium.headless,
    });

    let page = await browser.newPage();

    await page.goto(url);

    buffer = await page.pdf();

  } catch (error) {
    return context.fail(error);
  } finally {
    if (browser !== null) {
      await browser.close();
    }
  }

  return callback(null, {
    statusCode: 200,
    body: buffer.toString('base64'),
    isBase64Encoded: true,
    headers: {
      'Content-Type': 'application/pdf',
    },
  })
};
