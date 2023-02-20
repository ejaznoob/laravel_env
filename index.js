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

let textcontent=''
let filecontent = fs.readFileSync(filePath)
core.setOutput('ENVArray: ', filecontent);

var FileEnv = filecontent.split("\r\n");
env.forEach((value,index) => {
    for (var i = 0; i < FileEnv.length; i++)
    {
        let thisline = FileEnv[i]
        let startstring = value + "="
        if(thisline.startsWith(startstring)){
            textcontent += startstring
        }
        // Do something with arr
    }
});


fs.writeFile(filePath, env, err => {
    if (err) {
        core.setFailed(err.message);
    } else {
        core.setOutput('created: ', file);
    }
});
