const fs = require('fs');
const _ = require('underscore');
var home = require("os").homedir();


const {execSync, exec} = require('child_process');

const DATA_SOURCE = 'cli-data.json';

// Converts value to lowercase
function toLower(v) {
    return v.toLowerCase();
}

function readDataSource() {
    return JSON.parse(fs.readFileSync(home + '/dev/' + DATA_SOURCE, 'utf8'));
}

function appendToDataSource() {

}

function checkForFile(callback) {
    let path = home + '/dev/' + DATA_SOURCE;
    fs.exists(path, function (exists) {
        console.log(`File exists? ${exists}`);
        if (exists) {
            callback && callback();
        } else {
            fs.writeFile(path, JSON.stringify({}), {flag: 'wx'}, function (err) {
                if (err) throw err;
                console.log(`File was created in ${path}`);
                callback();
            });
        }
    });
}

function writeToDataSource(obj) {
    fs.readFile(home + '/dev/' + DATA_SOURCE, function (err, content) {
        if (err) throw err;

        var parseJson = JSON.parse(content);

        fs.writeFile(home + '/dev/' + DATA_SOURCE, JSON.stringify(obj), function (err) {
            if (err) throw err;
        });
    });
}

const addCmd = (cmd) => {
    var obj = readDataSource();
    if (obj[cmd['project_name']]) {

        var shouldAdd = true;

        _.each(obj[cmd['project_name']], function (savedCmd) {
            if (savedCmd === cmd) {
                shouldAdd = false;
            }
        });

        if (shouldAdd === true) {
            obj[cmd['project_name']].commands.push({
                cmd: cmd.running_command
            });
        } else {
            console.error("Command already exists:", cmd.running_command);
        }
    } else {
        obj[cmd['project_name']] = {
            path: cmd.project_path,
            commands: [{cmd: cmd.running_command}]
        }
    }
    writeToDataSource(obj);
};

const runCmdStepOne = (cmd) => {
    var obj = readDataSource();

    if (obj[cmd['project_name']]) {
        return obj[cmd['project_name']];
    } else {
        return "No options for " + cmd['project_name'];
    }
};

const runCmdStepTwo = (projectName, cmd) => {
    var obj = readDataSource();

    if (obj[projectName]) {
        var cmd =
            `cd ${obj[projectName].path}
                ${cmd.runCmd}`;

        exec(cmd, function (err, stdout, stderr) {
            console.log(stdout);
        })
    } else {
        console.log("No options for " + cmd['project_name']);
    }
};


const readFile = (onlyProjNames) => {
    let obj = readDataSource();
    if (onlyProjNames) {
        return _.keys(obj);
    }

    return obj;
};

module.exports = {addCmd, readFile, runCmdStepOne, runCmdStepTwo, checkForFile};