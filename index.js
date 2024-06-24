const base = require('./base.js');

const token = 'BPQqmWnahZAvIrzKnOSXYtZJ';
const repo = 'https://github.com/ziad-gg/child';

let childs = 1103;

async function main() {
    console.time('total');

    for (let i = 0; i < 100; i++) {
        console.time(`child-${childs}`);
        await createProject(`child-${childs}`, repo, token);
        console.timeEnd(`child-${childs}`);
        childs = childs + 1;
    };

    console.timeEnd('total');
};

async function createProject(name, repo, token) {
    const isValidName = await base.isValidName(name, token);
    if (!isValidName) throw new Error('Invalid name');

    const user = await base.getUser(token);
    const teamId = user.defaultTeamId;

    const githubLogin = await base.githubLogin(token);
    if (!githubLogin) throw new Error('Invalid github login');

    const namespace = githubLogin.login;
    const gitRepository = `${namespace}/${name}`;

    const gitRepoInfo = await base.createGithubRepo(name, namespace, token);

    await base.createProject(name, teamId, gitRepository, token);
    await base.pushToRepo(gitRepository, repo, teamId, token);

    await base.startDeployment(name, teamId, gitRepoInfo.id, token)
}

main().catch(console.error);