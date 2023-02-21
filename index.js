const { isUpper, strToUpper, removePrefix } = require('./src/String');
const core = require('@actions/core');
const fs = require('fs');
const path = require('path');


const examplefile = core.getInput('examplefile');
const targetfile = core.getInput('targetfile');
const prefix = strToUpper(core.getInput('prefix'));

const workspace = process.env.GITHUB_WORKSPACE;
const targetfilePath = path.join(workspace, targetfile);
const examplefilePath = path.join(workspace, examplefile);

const env = Object.keys(process.env)
    .filter(key => key.startsWith(prefix) && isUpper(key))
    .map(key => `${removePrefix(key, prefix)}="${process.env[key]}"`);
   // .join('\n');

 let FileEnv = ''
let textcontent=''
const data = fs.readFileSync(examplefilePath, {encoding:'utf8', flag:'r'});
FileEnv = data.split(/\r?\n/)

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
fs.writeFile(targetfilePath, textcontent, err => {
    if (err) {
        core.setFailed(err.message);
    } else {
        core.setOutput('created: ', targetfilePath);
    }
});
console.log("======= ENV Created =======")
