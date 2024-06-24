const { default: axios } = require('axios');

// Authorization: Bearer <TOKEN>

class Base {
    /**
     * Get Vercel Account Info
     * @param {String} token 
     * @returns {Promise<User | null>}
     */
    static async getUser(token) {
        if (!token) throw new Error('Invalid token');

        const response = await axios.get('https://api.vercel.com/v2/user', {
            headers: {
                Authorization: `Bearer ${token}`
            }
        }).catch(e => e);

        if (response.response) return null;
        else return response.data.user;
    };

    /**
     * Check if this project name is valid or not
     * @param {String} name 
     * @param {String} token 
     * @returns {Promise<Boolean>}
     */
    static async isValidName(name, token) {
        if (!name) throw new Error('Invalid name');
        if (!token) throw new Error('Invalid token');

        const response = await axios.get(`https://vercel.com/api/v2/projects/${name}`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        }).catch(e => e);

        if (response.response) return true;
        else return false;
    };

    /**
     * Get Github Login Info
     * @param {string} token 
     * @returns {Promise<GithubLogin | null>}
     */
    static async githubLogin(token) {
        if (!token) throw new Error('Invalid token');

        const response = await axios.get('https://vercel.com/api/v2/registration/github-token', {
            headers: {
                Authorization: `Bearer ${token}`
            }
        }).catch(e => e);

        if (response.response) return null;
        else return response.data;
    };

    /**
     * 
     * @param {string} name 
     * @param {string} namespace 
     * @param {string} token 
     * @returns {Promise<GitRepo | null>}
     */
    static async createGithubRepo(name, namespace, token) {
        if (!name) throw new Error('Invalid name');
        if (!namespace) throw new Error('Invalid namespace');
        if (!token) throw new Error('Invalid token');

        const response = await axios.post('https://vercel.com/api/v1/integrations/git-repo', {
            "provider": "github",
            "namespace": namespace,
            "name": name,
            "private": true
        }, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        }).catch(e => e);

        if (response.response) {
            console.log(response.response.data)
            return null
        }
        else return response.data;
    };

    static async createProject(name, teamId, repo, token) {
        if (!name) throw new Error('Invalid name');
        if (!teamId) throw new Error('Invalid teamId');
        if (!repo) throw new Error('Invalid repo');
        if (!token) throw new Error('Invalid token');

        const response = await axios.post(`https://vercel.com/api/v10/projects?teamId=${teamId}&withUserCredentials=1`, {
            "name": name,
            "environmentVariables": [],
            "gitRepository": { "type": "github", "repo": repo },
            "framework": null,
            "live": false
        }, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        }).catch(e => e);

        if (response.response) return null;
        else return response.data.project;
    };

    /**
     * 
     * @param {string} gitRepository 
     * @param {string} source 
     * @param {string} teamId 
     * @param {string} token 
     * @returns {Promise<Object | null>}
     */
    static async pushToRepo(gitRepository, source, teamId, token) {
        if (!gitRepository) throw new Error('Invalid repo');
        if (!source) throw new Error('Invalid source');
        if (!token) throw new Error('Invalid token');
        if (!teamId) throw new Error('Invalid teamId');

        const response = await axios.post(`https://vercel.com/api/v1/integrations/push-to-repo?teamId=${teamId}`, {
            "type": "github",
            "source": source,
            "repo": gitRepository,
            "branch": "main"
        }, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        }).catch(e => e);

        if (response.response) return null;
        else return response.data;
    };

    /**
     * Start a deployment
     * @param {string} name 
     * @param {string} teamId 
     * @param {string} repoId 
     * @param {string} token 
     * @returns {Promise<Object | null>}
     */
    static async startDeployment(name, teamId, repoId, token) {
        if (!name) throw new Error('Invalid name');
        if (!teamId) throw new Error('Invalid teamId');
        if (!token) throw new Error('Invalid token');

        const response = await axios.post(`https://vercel.com/api/v13/deployments?skipAutoDetectionConfirmation=1&teamId=${teamId}`, {
            "gitSource": { "type": "github", "ref": "main", "repoId": repoId },
            "name": name,
            "target": "production",
            "source": "import"
        }, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        }).catch(e => e);

        if (response.response) return null;
        else return response.data;
    }
};

module.exports = Base;