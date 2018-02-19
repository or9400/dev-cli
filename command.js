#!/usr/bin/env node

const program = require('commander');
const {prompt} = require('inquirer');
const {addCmd, runCmdStepOne, runCmdStepTwo, readFile, checkForFile} = require('./logic');

const {_} = require('underscore');

const addingCommandQuestions = [
    {
        type: 'input',
        name: 'project_name',
        message: 'Enter project name ...'
    },
    {
        type: 'input',
        name: 'running_command',
        message: 'Enter running command ...'
    },
    {
        type: 'input',
        name: 'project_path',
        message: 'Enter project path ...'
    }
];

const runningCommandQuestions = {
    v1: [
        {
            type: 'list',
            name: 'project_name',
            message: 'Select project',
            choices: readFile(true)

        }
    ],
    v2: [
        {
            type: 'input',
            name: 'cmd',
            message: 'Select a command'
        }
    ]
};

program
    .version('0.0.1')
    .description('Cli tool for devs');


program
    .command('config') // No need of specifying arguments here
    .alias('c')
    .description('Config data')
    .action(() => {
        checkForFile(function () {
        });
    });

program
    .command('addCommand') // No need of specifying arguments here
    .alias('a')
    .description('Add a running command usage()')
    .action(() => {
        prompt(addingCommandQuestions).then(answers => addCmd(answers));
    });


program
    .command('runCommand') // No need of specifying arguments here
    .alias('r')
    .description('run a command ')
    .action(() => {

        prompt(runningCommandQuestions.v1).then(answers => {
            var options = runCmdStepOne(answers);
            var project_name = answers.project_name;

            let nestedOptions = [];
            console.log(options);
            _.each(options.commands, function (option) {
                nestedOptions.push(option.cmd);
            });

            let questions = [
                {
                    type: 'list',
                    name: 'runCmd',
                    message: 'Select a command:',
                    choices: nestedOptions,
                }
            ];
            prompt(questions).then(answers => runCmdStepTwo(project_name, answers));

        });

    });


program.parse(process.argv);

