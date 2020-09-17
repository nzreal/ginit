const inquirer = require('inquirer'); // interactive command line tool
// question inquirer.prompt(question)
const files = require('./file');

module.exports = {

  // github login
  askGithubCredentials: () => {

    const questions = [
      {
        name: 'username',
        type: 'input',
        message: 'Enter your GitHub username or e-mail address: ',

        validate: function (val) {
          if(val.length) {
            return true;
          } else {
            return "Please enter your username or e-mail address !";
          }
        }

      },
      {
        name: 'password',
        type: 'input',
        message: 'Enter your password: ',

        validate: function (val) {
          if(val.length) {
            return true;
          } else {
            return "Please enter your password !";
          }
        }

      }
    ];

    return inquirer.prompt(questions);
  },

  // create new repository
  askRepoDetails: () => {
    // argv: arguments
    // argv 's the first two parameters are exe path and js file's path
    // minimist: a lightweight command-line parameter parsing engine?
    const argv = require('minimist')(process.argv.slice(2));

    const questions = [
      {
        type: 'input',
        name: 'name',
        message: 'Enter a name for the repository: ',
        default: argv._[0] || files.getCurrentDirectoryBase(),
        validate: function (val) {
          if(val.length) {
            return true;
          } else {
            return 'Please enter a name for the repository.';
          }
        }
      },

      {
        type: 'input',
        name: 'description',
        default: argv._[1] || null,
        message: 'Optionally enter a description of the repository:'
      },

      {
        type: 'list',
        name: 'visibility',
        message: 'Public or private:',
        choices: ['public', 'private'],
        default: 'public'
      }
    ];

    return inquirer.prompt(questions);
  },

  // create .gitignore file's options
  askIgnoreFile: (fileList) => {
    const questions = [
      {
        type: 'checkbox',
        name: 'ignore',
        message: 'Select the files and/or folders you wish to ignore:',
        choices: fileList,
        default: ['node_modules', 'bower_components']
      }
    ];

    return inquirer.prompt(questions);
  }
};