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
        const justTag = core.getBooleanInput('just-tag');
        const octokit = github.getOctokit(ghToken);

        console.log('Get Commit hash')
        const headCommit = await octokit.request(`GET /repos/{owner}/{repo}/commits/${branch}`, {
          owner: github.context.repo.owner,
          repo: github.context.repo.repo
        })
        const commit = headCommit.data.sha
        if(justTag){
          const releases = await octokit.request('GET /repos/{owner}/{repo}/releases',{
            owner: github.context.repo.owner,
            repo: github.context.repo.repo
          });
          const ref_name = github.context.ref
          console.log('ref_name: ',ref_name);
          const containRelease = releases.data.find((r)=> r.tag_name == branch)
          console.log('containRelease', containRelease)
          if(containRelease) {
            await command.exec('gh',['release','delete',`${containRelease.tag_name}`,'--cleanup-tag','-y']);
            await command.exec('gh',['release','create',`${containRelease.tag_name}`,`--title=${containRelease.tag_name}`,`--target=${commit}`,'--generate-notes'])
          }
        }
        if(!justTag){
          await verifyInputs(core,branch,tag,ghToken);
          console.log('Create Release')
          await command.exec('gh',['release','create',`${tag}`,`--title=${tag}`,`--target=${commit}`,'--generate-notes'])

        }

        if(appendTag.length){
          console.log('Append Tag to commit')
          const stageTag = upper ? appendTag.toUpperCase() : appendTag

          const messageTag = `add tag - ${stageTag} to commit - ${commit}`
          await command.exec('git',['config','user.name',`${github.context.actor}`]);
          await command.exec('git',['config','user.email',`${github.context.actor}@users.noreply.github.com`]);
          await command.exec('git',['config','user.password',`${ghToken}`]);
          await command.exec('git',['remote','set-url','origin',`https://${github.context.actor}:${ghToken}@github.com/${github.context.repo.owner}/${github.context.repo.repo}.git`]);
          await command.exec('git',['tag','-a',`${stageTag}`,`${commit}`,`-m=${messageTag}`,'-f']);
          await command.exec('git',['push','--force','origin',`${stageTag}`]);
          await octokit.request(``)
        }
    } catch (error) {
      core.setFailed(error.message);
    }
}

run()