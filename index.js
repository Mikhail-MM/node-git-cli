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
 
if (files.directoryExists('.git')) {
    console.log(
        chalk.red(
            'Already a git repo!'
        )
    );
    process.exit();
}

const getGithubToken = async () => {
    let token = github.getStoredGithubToken();
    if (token) {
        return token;
    } else {
        const octokit = await github.initializeOctoKitWithCredentials();
        token = await github.registerNewToken(octokit);
        return token;
    }
}

const run = async () => {
    try {
        const token = await getGithubToken();
        const authenticatedInstance = github.initializeOctoKitWithToken(token);
        
        // Create a new Repository using the octokit github API library
        const newRepoURL = repo.createRemoteRepo(authenticatedInstance);
    
        await repo.buildGitIgnore();
    
        const finished = await repo.setupRepo(newRepoURL);

        if(finished) {
            console.log(chalk.green('All done!'));
        }

    } catch(err) {
        if (err) {
            switch (err.code) {
              case 401:
                console.log(chalk.red('Couldn\'t log you in. Please provide correct credentials/token.'));
                break;
              case 422:
                console.log(chalk.red('There already exists a remote repository with the same name'));
                break;
              default:
                console.log(err);
            }
        }
    }
}

run();



