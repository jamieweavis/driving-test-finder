const chalk = require('chalk');

const clickAndWaitForNavigation = async (selector, page) => {
  return Promise.all([page.waitForNavigation(), page.click(selector)]);
};

const red = message => console.log(chalk.red(message));
const yellow = message => console.log(chalk.yellow(message));
const green = message => console.log(chalk.green(message));

module.exports = { clickAndWaitForNavigation, red, yellow, green };
