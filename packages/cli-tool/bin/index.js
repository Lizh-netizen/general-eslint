#!/usr/bin/env node

const inquirer = require('inquirer');
const { execSync } = require('child_process');

const questions = [
  {
    type: 'list',
    name: 'configType',
    message: 'What type of configuration would you like to set up?',
    choices: ['ESLint', 'Stylelint'],
  },
  {
    type: 'checkbox',
    name: 'features',
    message: 'Select the features you want to enable:',
    choices: (answers) => {
      if (answers.configType === 'ESLint') {
        return ['Vue', 'React', 'TypeScript'];
      } else {
        return ['CSS', 'LESS', 'SASS'];
      }
    },
  },
  {
    type: 'list',
    name: 'language',
    message: 'Which language are you using?',
    choices: ['JavaScript', 'TypeScript'],
    when: (answers) => answers.configType === 'ESLint' && answers.features.includes('TypeScript'),
  },
];

inquirer.prompt(questions).then((answers) => {
  console.log('Setting up configuration...');

  if (answers.configType === 'ESLint') {
    let baseCommand = 'npm install --save-dev eslint @jd/eslint-config-selling';
    let featureCommands = answers.features
      .map((feature) => {
        if (feature === 'TypeScript') {
          return '';
        } else {
          return `@jd/eslint-config-selling/lib/${feature.toLowerCase()}${answers.language === 'TypeScript' ? '-ts' : ''}`;
        }
      })
      .filter(Boolean);

    execSync(`${baseCommand} ${featureCommands.join(' ')}`, { stdio: 'inherit' });

    console.log('ESLint configuration setup complete.');
  } else {
    const baseCommand = 'npm install --save-dev stylelint @jd/stylelint-config-selling';
    const featureCommands = answers.features.map((feature) => `@jd/stylelint-config-selling/lib/${feature.toLowerCase()}`);
    execSync(`${baseCommand} ${featureCommands.join(' ')}`, { stdio: 'inherit' });

    console.log('Stylelint configuration setup complete.');
  }
});
