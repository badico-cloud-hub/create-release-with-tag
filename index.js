const core = require('@actions/core');
const github = require('@actions/github');
const command = require('@actions/exec');


async function run(){
    try {
        
    } catch (error) {
      core.setFailed(error.message);
    }
}

run()