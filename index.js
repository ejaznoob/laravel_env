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
const data = fs.readFileSync('./.env.example', {encoding:'utf8', flag:'r'});
FileEnv = data.split(/\r?\n/)

console.log("Total Lines", FileEnv.length)

for (var i = 0; i < FileEnv.length; i++)
{
    let thisline = FileEnv[i]
    let matched = false

    env.forEach((value,index) => {
        let varname = value.split('=')[0]
        let startstring = varname + "="
        if(thisline.startsWith(startstring)){
            textcontent += value + "\n";
            matched =true
        }
    });
    if(!matched){
        textcontent += thisline + "\n";
    }

 }

 //fs.writeFile(filePath, env, err => {
fs.writeFile(filePath, textcontent, err => {
    if (err) {
        core.setFailed(err.message);
    } else {
        core.setOutput('created: ', file);
    }
});
console.log("======= ENV Created =======")
