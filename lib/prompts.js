const inquirer = require('inquirer');
const touch = require('touch');

const files = require('./files');

module.exports = {
    askGithubCredentials: () => {
        const questions = [
            {
                name: 'username',
                type: 'input',
                message: 'Enter your GitHub username or e-mail address:',
                validate: (value) => {
                    if (value.length) {
                        return true;
                    } else {
                        return 'Please enter your username or e-mail address.'
                    }
                }
            },
            {
                name: 'password',
                type: 'password',
                message: 'Enter your password:',
                validate: (value) => {
                    if (value.length) {
                        return true;
                    } else {
                        return 'Please enter your password.'
                    }
                }
            }
        ]
        return inquirer.prompt(questions);
    },
    askRepoDetails: () => {
        const argv = require('minimist')(process.argv.slice(2));

        const questions = [
            {
                type: 'input',
                name: 'name',
                message: 'Enter a name for the repository:',
                default: argv._[0] || files.getCurrentDirectoryBase(),
                validate: (value) => {
                    if (value.length) {
                        return true;
                    } else {
                        return 'Please enter a name for the reponsitory.'
                    }
                }
            },
            {
                type: 'input',
                name: 'description',
                default: argv._[1] || null,
                message: 'Optional -- Enter a description for the reponsitory:'
            },
            {
                type: 'list',
                name: 'visibility',
                message: 'Public or Private Repo?',
                choices: ['public', 'private'],
                default: 'public'
            }
        ]
        return inquirer.prompt(questions);
    },
    askIgnoreFiles: (filelist) => {
        const questions = [
            {
                type: 'checkbox',
                name: 'ignore',
                message: 'Select the files and/or folders you wish to ignore',
                choices: filelist,
                default: ['node_modules', 'bower_components', '.env']
            }
        ]
        return inquirer.prompt(questions);
    },
}