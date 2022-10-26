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
        
        const headCommit = await octokit.request(`GET /repos/{owner}/{repo}/commits/${branch}`, {
          owner: github.context.repo.owner,
          repo: github.context.repo.repo
        })
        const commit = headCommit.data.sha
        console.log('commit actual: ',commit)
        
        const release = await command.exec('gh',['release','create',`${tag}`,`--title=${tag}`,`--target=${commit}`,'--generate-notes'])
        console.log('release result: ', release)

        const stageTag = await octokit.request('POST /repos/{owner}/{repo}/git/tags', {
          owner: github.context.repo.owner,
          repo: github.context.repo.repo,
          tag: appendTag.toUpperCase(),
          message: 'Tag for actual commit the stage',
          object: commit,
          type: 'commit',
          tagger: {
            name: 'wellington gadelha',
            email: 'contato.informeai@gmail.com'
          }
        })

        console.log('stageTag: ',stageTag)
    } catch (error) {
      core.setFailed(error.message);
    }
}

run()