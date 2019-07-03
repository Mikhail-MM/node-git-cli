const chalk = require('chalk');
const clear = require('clear');
const figlet = require('figlet');

const files = require('./lib/files');
const prompts = require('./lib/prompts');
clear();
console.log(
    chalk.yellow(
        figlet.textSync('Ginit', { horizontalLayout: 'full' })
    )
);

const run = async () => {
    const credentials = await prompts.askGithubCredentials();
    console.log(credentials);
    return;
}

(async () => await run())();

if (files.directoryExists('.git')) {
    console.log(
        chalk.red(
            'Already a git repo!'
        )
    );
    process.exit();
}




