const _ = require('lodash');
const fs = require('fs');
const simpleGit = require('simple-git/promise')();
const CLI = require('clui');
const chalk = require('chalk');
const Spinner = CLI.Spinner;

const inquirer = require('./inquirer');
const github = require('./github');
const { touchSync, ftouch } = require('touch');

// const simpleGit = new SimpleGit();

module.exports = {
  // create remote repository
  createRemoteRepo: async () => {
    const gitInstance = github.getInstance();
    const answers = await inquirer.askRepoDetails(); // get repository name

    const data = {
      name: answers.name,
      description: answers.description,
      private: answers.visibility === 'private',
    };

    const spinning = new Spinner('Creating remote repository...');
    spinning.start();

    try {
      const response = await gitInstance.repos.create(data);
      console.log(chalk.blueBright('create remote repository successful'));
      return response.data.ssh_url;
    } catch (e) {
      throw e;
    } finally {
      spinning.stop();
    }
  },

  // insert file into .gitignore
  createGitIgnore: async () => {
    const fileList = _.without(fs.readdirSync('.'), '.git', '.gitignore');

    if (fileList.length) {
      const answers = await inquirer.askIgnoreFile(fileList);
      if (answers.ignore.length) {
        fs.writeFileSync('.gitignore', answers.ignore.join('\n'));
        fs.writeFileSync('README.md', '');
      } else {
        // touch
        touchSync('.gitignore');
      }
    } else {
      touchSync('.gitignore');
    }
  },

  // git init
  setupRepo: async (url) => {
    const spinning = new Spinner(
      'Initializing local repository and pushing to remote...'
    );
    spinning.start();

    try {
      await simpleGit.init();
      await simpleGit.status();
      await simpleGit.add('.gitignore');
      // await simpleGit.add('README.md');
      await simpleGit.add('./*');
      await simpleGit.commit('first commit');
      await simpleGit.addRemote('origin', url);
      await simpleGit.push('origin', 'master');
    } catch (e) {
      throw e;
    } finally {
      spinning.stop();
    }
  },
};
