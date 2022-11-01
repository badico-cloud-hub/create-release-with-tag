const core = require('@actions/core');
const github = require('@actions/github');
const command = require('@actions/exec');

async function verifyInputs(core,branch, tag, ghToken){
  console.log('Verify inputs')
  if(!branch.length) {
      core.setFailed('Branch invalid')
  }
  if(!tag.length) {
      core.setFailed('Tag invalid')
  }
  if(!ghToken.length) {
      core.setFailed('Token is required')
  }
  return
}

async function run(){
    try {
        const branch = core.getInput('branch');
        const tag = core.getInput('tag');
        const ghToken = core.getInput('gh-token');
        const appendTag = core.getInput('append-tag');
        const upper = core.getBooleanInput('upper');
        const octokit = github.getOctokit(ghToken);

        // console.log('branch: ',branch);
        // console.log('tag: ',tag);
        // console.log('gh-token: ',ghToken);
        // console.log('append-tag: ',appendTag);
        await verifyInputs(core,branch,tag,ghToken);
        console.log('Get Commit hash')
        const headCommit = await octokit.request(`GET /repos/{owner}/{repo}/commits/${branch}`, {
          owner: github.context.repo.owner,
          repo: github.context.repo.repo
        })
        const commit = headCommit.data.sha
        // console.log('commit actual: ',commit)
        console.log('Create Release')
        const release = await command.exec('gh',['release','create',`${tag}`,`--title=${tag}`,`--target=${commit}`,'--generate-notes'])
        // console.log('release result: ', release)
        if(appendTag.length){
          console.log('Append Tag to commit')
          const stageTag = upper ? appendTag.toUpperCase() : appendTag

          const messageTag = `add tag - ${stageTag} to commit - ${commit}`
          const userName = await command.exec('git',['config','user.name',`${github.context.actor}`]);
          console.log('userName: ',userName)
          const userEmail = await command.exec('git',['config','user.email',`${github.context.actor}@users.noreply.github.com`]);
          console.log('userEmail: ',userEmail)
          await command.exec('git',['tag','-a',`${stageTag}`,`${commit}`,`-m=${messageTag}`,'-f']);
          const setOrigin = await command.exec('git',['remote','set-url','origin',`https://${github.context.actor}:${ghToken}@github.com/${github.context.repo.owner}/${github.context.repo.repo}.git`]);
          console.log('setOrigin: ',setOrigin)
          const forcePush = await command.exec('git',['push','--force','origin',`${stageTag}`]);
          console.log('forcePush: ',forcePush)
        }
    } catch (error) {
      core.setFailed(error.message);
    }
}

run()