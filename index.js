// TODO: Include packages needed for this application
const inquirer = require('inquirer');
const fs = require('fs');
const util = require('util');

const generateMarkdown = require('./utils/generateMarkdown.js');
const api = require('./utils/api.js');
// TODO: Create an array of questions for user input
// add questions for username and 
const questions = [
    {
            type: 'input',
            name: 'title',
            message: 'What is the name of your project?',
            validate: titleInput => {
                if (titleInput) {
                    return true;
                } else {
                    console.log('Please enter a project title!');
                    return false;
                }
            }
        },
        {
            type: 'input',
            name: 'description',
            message: 'Give a succint description of the project in question.',
            validate: descInput => {
                if (descInput) {
                    return true;
                } else {
                    console.log('Please enter a description!');
                    return false;
                }
            }
        },
        {
            type: 'confirm',
            name: 'confirmContents',
            message: 'Would you like to include a table of contents?',
            default: false
        },
        {
            type: 'checkbox',
            name: 'contents',
            message: 'Which sections would you like to include in your table of contents?',
            choices: ['Description', 'Features', 'Installation', 'Program Usage']
        },
        {
            type: 'confirm',
            name: 'featureConfirm',
            message: "Are there any features you'd like to highlight?",
            default: false
        },
        {
            type: 'input',
            name: 'feature',
            message: 'Which features would you like to include?',
            when: ({featureConfirm}) => {
                if (featureConfirm) {
                    return true;
                } else {
                    return false;
                }
            }
        },
        {
            type: 'confirm',
            name: 'installConfirm',
            message: 'Are there any installation instructions to pass along to the user?',
            default: false
        },
        {
            type: 'input',
            name: 'install',
            message: 'What installation instructions would you like to add?',
        },
        {
            type: "input",
            name: "usage",
            message: "What is this project usage for?"
        },
        {
            type: "list",
            name: "license",
            message: "Chose the appropriate license for this project: ",
            choices: [
                "Apache",
                "Academic",
                "GNU",
                "ISC",
                "MIT",
                "Mozilla",
                "Open"
            ]
        },
        {
            type: 'input',
            name: 'repo',
            message: 'Please include a link to the projects repository'
        },
        {
            type: 'input',
            name: 'link',
            message: 'Please include a link to your deployed project'
        }
    ];

// TODO: Create a function to write README file
function writeToFile(fileName, data) {
    fs.writeFile(fileName, data, err => {
        if (err) {
            return console.log(err);
        }
        console.log("Success! A README.md has been generated!")
        });
}

const writeFileAsync = util.promisify(writeToFile);

// TODO: Create a function to initialize app
async function init() {
    try {

        // Prompt Inquirer questions
        const userResponses = await inquirer.prompt(questions);
        console.log("Your responses: ", userResponses);
        console.log("Thank you for your responses! Fetching your GitHub data next...");
    
        // Call GitHub api for user info
        const userInfo = await api.getUser(userResponses);
        console.log("Your GitHub user info: ", userInfo);
    
        // Pass Inquirer userResponses and GitHub userInfo to generateMarkdown
        console.log("Generating your README next...")
        const markdown = generateMarkdown(userResponses, userInfo);
        console.log(markdown);
    
        // Write markdown to file
        await writeFileAsync('ExampleREADME.md', markdown);

    } catch (error) {
        console.log(error);
    }
};


// Function call to initialize app
init();
