const { isUpper, strToUpper, removePrefix } = require('./src/String');
const core = require('@actions/core');
const fs = require('fs');
const path = require('path');
const readline = require('readline');


const file = core.getInput('file');
const prefix = strToUpper(core.getInput('prefix'));

const workspace = process.env.GITHUB_WORKSPACE;
const filePath = path.join(workspace, file);


const env = Object.keys(process.env)
    .filter(key => key.startsWith(prefix) && isUpper(key))
    .map(key => `${removePrefix(key, prefix)}="${process.env[key]}"`);
   // .join('\n');

core.setOutput('ENVArray: ', env);
let FileEnv = ''
let textcontent=''
const data = fs.readFileSync('./.env', {encoding:'utf8', flag:'r'});
FileEnv = data.split("\n\r")


env.forEach((value,index) => {
    for (var i = 0; i < FileEnv.length; i++)
    {
        let thisline = FileEnv[i]
        let varname = value.split('=')[0]
        let startstring = varname + "="
        if(thisline.startsWith(startstring)){
            textcontent += startstring + "\n";
        }
        else{
            console.log(startstring,thisline)
        }
        // Do something with arr
    }
});

console.log("New Env ", textcontent)
//fs.writeFile(filePath, env, err => {
fs.writeFile(filePath, 'Test', err => {
    if (err) {
        core.setFailed(err.message);
    } else {
        core.setOutput('created: ', file);
    }
});
