const { default: axios } = require('axios');
const fs = require('fs');

const domain = 'https://child-{i}.vercel.app/proxy'

async function main() {
    const reqests = [];

    for (let i = 600; i <= 1000; i++) {
        reqests.push(axios.get(domain.replace('{i}', i), {
            timeout: 15000,
        }).catch(e => e));
    };

    const responses = await Promise.all(reqests);
    const failed = responses.filter(r => r?.response?.status !== 400);

    failed.forEach(f => {
        console.log(f.request._currentUrl);
        // add()
    })
};

function add(url) {
    const content = fs.readFileSync('blacklist.txt', 'utf-8');
    content += url + '\n';
    fs.writeFileSync('blacklist.txt', content);
}

main().catch(console.error);