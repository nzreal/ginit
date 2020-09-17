const Octokit = require('@octokit/rest'); // github official API
const ConfigStore = require('configstore'); // store the config smartly and automatically
const pkg = require('../package');
const _ = require('lodash');
const CLI = require('clui'); //
const Spinner = CLI.Spinner;
const chalk = require('chalk');

const inquirer = require('./inquirer');

const conf = new ConfigStore(pkg.name);
const gitInstance = new Octokit();

module.exports = {

  getInstance: () => {
    return gitInstance;
  },

  // get local token auth
  getStoredGitHubToken: () => {
    return conf.get('github.token');
  },

  githubAuth: (token) => {
    gitInstance.authenticate({
      type: 'oauth',
      token: token
    });
  },

  loginTip: () => console.log(chalk.blue('login successfully !')),

  setGithubCredentials: async () => {
    const credentials = await inquirer.askGithubCredentials();

    gitInstance.authenticate(
      _.extend(
        {
          type: 'basic',
        },
        credentials
      )
    );
  },

  registerNewToken: async () => {
    const spin = new Spinner('Authenticating, please waiting...');
    spin.start();

    try {
      const response = await gitInstance.authorization.create({
        scopes: ['user', 'public_repo', 'repo', 'repo:status'],
        note: 'ginits, the command-line tool for initializing Git repos'
      });

      const token = response.data.token;
      if(token) {
        conf.set('github.token', token);
        return token;
      } else {
        throw new Error("Missing Token","GitHub token was not found in the response")
      }
    } catch (e) {
      throw e;
    } finally {
      spin.stop();
    }
  },

};