/*
This file is used to ensure that all dependencies are installed for the usage/development of discordjs/voice modules.
*/
const {generateDependencyReport} = require('@discordjs/voice');

console.log(generateDependencyReport());
