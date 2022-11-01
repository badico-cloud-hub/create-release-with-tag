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

        // const stageTag = await octokit.request('POST /repos/{owner}/{repo}/git/tags', {
        //   owner: github.context.repo.owner,
        //   repo: github.context.repo.repo,
        //   tag: appendTag.toUpperCase(),
        //   message: 'Tag for actual commit the stage',
        //   object: commit,
        //   type: 'commit',
        //   tagger: {
        //     name: 'wellington gadelha',
        //     email: 'contato.informeai@gmail.com'
        //   }
        // })
        const userName = await command.exec('git',['config','user.name',`${github.context.actor}`]);
        const userEmail = await command.exec('git',['config','user.email',`${github.context.actor}@users.noreply.github.com`]);
        const stageTag = await command.exec('git',['tag','-f','-a',`${appendTag.toUpperCase()}`,`${commit}`,`add tag - ${appendTag.toUpperCase()} to commit - ${commit}`]);
        const setOrigin = await command.exec('git',['remote','set-url','origin',`https://${github.context.actor}:${ghToken}@github.com/${github.context.repo.repo}.git`]);
        const forcePush = await command.exec('git',['push','--force','origin',`${appendTag.toUpperCase()}`]);
        console.log('userName: ',userName)
        console.log('userEmail: ',userEmail)
        console.log('stageTag: ',stageTag)
        console.log('setOrigin: ',setOrigin)
        console.log('forcePush: ',forcePush)
    } catch (error) {
      core.setFailed(error.message);
    }
}

run()