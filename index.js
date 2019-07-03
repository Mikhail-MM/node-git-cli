const chalk = require('chalk');
const clear = require('clear');
const figlet = require('figlet');

const files = require('./lib/files');
const prompts = require('./lib/prompts');
const repo = require('./lib/repo');
const github = require('./lib/github');

clear();
console.log(
    chalk.yellow(
        figlet.textSync('Ginit', { horizontalLayout: 'full' })
    )
);

/* 
if (files.directoryExists('.git')) {
    console.log(
        chalk.red(
            'Already a git repo!'
        )
    );
    process.exit();
}
*/

const run = async () => {
    let token = github.getStoredGithubToken();
    console.log(token);
    if (!token) {
        const octokit = await github.initializeOctoKit();
        token = await github.registerNewToken(octokit);
    }
    const thing = await repo.createRemoteRepo();

}

run();



