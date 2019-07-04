const Octokit = require('@octokit/rest');
const Configstore = require('configstore');
const pkg = require('../package.json');
const _ = require('lodash');
const CLI = require('clui');
const Spinner = CLI.Spinner;
const chalk = require('chalk');

const prompts = require('./prompts');

const conf = new Configstore(pkg.name);

module.exports = {
    getStoredGithubToken: () => {
        return conf.get('github.token');
    },
    initializeOctoKitWithToken: (token) => {
        return Octokit({
            auth: token
        })
    },
    initializeOctoKitWithCredentials: async () => {
        const credentials = await prompts.askGithubCredentials();
        const auth = _.extend(
            {
                type: 'basic',
            },
            credentials
        )
        return Octokit({
            auth
        }); 
    },
    registerNewToken: async (initializedOctokit) => {
        const status = new Spinner('Authenticating, Please Wait.');
        status.start();
        try {
            const response = await initializedOctokit.oauthAuthorizations.createAuthorization({
                scopes: ['user', 'public_repo', 'repo', 'repo:status'],
                note: 'ginits, the command-line tool for initializing Git Repositories'
            });
            const token = response.data.token;
            if (token) {
                conf.set('github.token', token);
                return token;
            } else {
                throw new Error("Missing Token", "GitHub token was not found")
            }
        } catch(err) {
            throw err;
        } finally {
            status.stop();
        }
    }
};