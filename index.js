const core = require('@actions/core');
const github = require('@actions/github');
const command = require('@actions/exec');


async function run(){
    try {
        const sha = core.getInput('sha');
        const tag = core.getInput('tag');
        const ghToken = core.getInput('gh-token');
        const appendTag = core.getInput('append-tag');

        console.log('sha: ',sha);
        console.log('tag: ',tag);
        console.log('gh-token: ',ghToken);
        console.log('append-tag: ',appendTag);
        
    } catch (error) {
      core.setFailed(error.message);
    }
}

run()