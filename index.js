#!/usr/bin/env node

const chalk = require('chalk');
const clear = require('clear');
const figlet = require('figlet');

const files = require('./lib/file');
const inquirer = require('./lib/inquirer');
const github = require('./lib/github');
const repo = require('./lib/repo');

clear();

console.log(
  chalk.yellow(
    figlet.textSync('Ginit', { horizontalLayout: 'full' })
  )
);

if(files.directoryExists('.git')) {
  console.log(chalk.red("Already a git repository !"));
  process.exit();
}

const getGithubToken = async () => {
  // get token from config store
  let token = github.getStoredGitHubToken();
  if(token) {
    github.loginTip();
    return token;
  }
  // if no token login and then get the token
  await github.setGithubCredentials();
  token = await github.registerNewToken()
    .then(() => github.loginTip());

  return token
};

const run = async () => {
  try {
    const token = await getGithubToken();
    github.githubAuth(token);

    const url = await repo.createRemoteRepo();
    // create .gitignore file
    await repo.createGitIgnore();

    // several operations : git init, git push etc.
    const done = await repo.setupRepo(url);
    if(done) {
      console.log('All done !')
    }
  } catch (e) {
    if (e) {
      switch (e.code) {
        case 401:
          console.log(chalk.red('Couldn\'t log you in. Please provide correct credentials/token.'));
          break;
        case 422:
          console.log(chalk.red('There already exists a remote repository with the same name'));
          break;
        default:
          console.log(e);
      }
    }
  }
};

run();
