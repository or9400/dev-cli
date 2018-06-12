// import cli from "/logic.js";

const cli = require('./logic');

cli.addCmd("mvn clean install", 'authenticator');
cli.addCmd("mvn clean install", 'pingid');

console.log(cli.readFile());
