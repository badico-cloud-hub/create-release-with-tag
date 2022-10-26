const core = require('@actions/core');
const github = require('@actions/github');
const command = require('@actions/exec');


async function run(){
    try {
        const branch = core.getInput('branch');
        const tag = core.getInput('tag');
        const ghToken = core.getInput('gh-token');
        const appendTag = core.getInput('append-tag');
        const octokit = github.getOctokit(ghToken);

        console.log('branch: ',branch);
        console.log('tag: ',tag);
        console.log('gh-token: ',ghToken);
        console.log('append-tag: ',appendTag);
        
        const release = command.exec('gh',['release','create',`${tag}`,`--title=${tag}`,`--target=${branch}`,'--generate-notes'])
        console.log('release result: ', release)
    } catch (error) {
      core.setFailed(error.message);
    }
}

run()