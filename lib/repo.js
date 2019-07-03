const _ = require('lodash');
const fs = require('fs');
const git = require('simple-git')();
const CLI = require('clui');
const Spinner = CLI.Spinner;

const prompts = require('./prompts');
const gh = require('./github');

module.exports = {
    createRemoteRepo: async () => {
        const octocat = await gh.initializeOctoKit();
        const answers = await prompts.askRepoDetails();

        const data = {
            name: answers.name,
            description: answers.description,
            private: (answers.visibility === 'private')
        };

        const status = new Spinner('Creating remote repository...');

        status.start();

        try {
            console.log(octocat);
            const response = await octocat.repos.createForAuthenticatedUser(data);
            console.log(response.data);
        } catch(err) {
            throw err;
        } finally {
            status.stop();
        }
    },
    askGitignoreDetails: async () => {
        // Get all directories, ignoring '.git' and '.gitignore'
        const filelist = _.without(fs.readdirSync('.', '.git', '.gitignore'));
        if (filelist.length) {
            const answers = await inquirer.askIgnoreFiles(filelist);
            if (answers.ignore.length) {
                fs.writeFileSync('.gitignore', answers.ignore.join('\n'));
            } else {
                touch('.gitignore');
            }
        } else {
            touch('.gitignore');
        }
    },
    setupRepo: async (url) => {
        const status = new Spinner('Initializing local repository and pushing to remote');
        status.start();
        try {
            await git
                .init()
                .add('.gitignore')
                .add('./*')
                .commit('Initial Commit.')
                .addRemote('origin', url)
                .push('origin', 'master');
            return true;
        } catch(err) {
            throw err;
        } finally {
            status.stop();
        }
    }
}