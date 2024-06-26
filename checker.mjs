import axios from 'axios';
import { promises as fs } from 'fs';
import chalk from 'chalk';

const domainTemplate = 'https://child-{i}.vercel.app/proxy';
const blacklistFile = 'blacklist.txt';
const batchSize = 50;

// Function to check if a domain is already in the blacklist
const isDomainBlacklisted = async (domain) => {
    try {
        const data = await fs.readFile(blacklistFile, 'utf8');
        return data.split('\n').includes(domain);
    } catch (error) {
        if (error.code === 'ENOENT') {
            return false; // File doesn't exist, so domain is not blacklisted
        }
        throw error;
    }
};

// Function to check the domain and return a promise
const checkDomain = async (i) => {
    const url = domainTemplate.replace('{i}', i);
    console.log(chalk.blue(`Checking ${url}...`));

    try {
        await axios.get(url);
        console.log(chalk.green(`Domain ${url} is registered.`));
        return null;
    } catch (error) {
        if (error.response) {
            if (error.response.status === 404) {
                console.log(chalk.red(`Domain ${url} is not registered.`));
                return url;
            } else if (error.response.status === 400) {
                console.log(chalk.green(`Domain ${url} is registered.`));
                return null;
            }
        }
        console.log(chalk.yellow(`Failed to check ${url}, status: ${error.response ? error.response.status : 'unknown'}`));
        return null;
    }
};

// Function to add a domain to the blacklist file
const addToBlacklist = async (domain) => {
    await fs.appendFile(blacklistFile, domain + '\n');
    console.log(chalk.yellow(`Added ${domain} to blacklist.txt`));
};

// Function to process a batch of domains
const processBatch = async (start, end) => {
    const promises = [];
    for (let i = start; i <= end; i++) {
        promises.push(checkDomain(i));
    }
    const results = await Promise.all(promises);

    for (const result of results) {
        if (result) {
            const isBlacklisted = await isDomainBlacklisted(result);
            if (!isBlacklisted) {
                await addToBlacklist(result);
            } else {
                console.log(chalk.gray(`Domain ${result} is already in blacklist.txt, skipping...`));
            }
        }
    }
};

// Main function to iterate over the domains in batches
const main = async () => {
    for (let i = 1700; i <= 1902; i += batchSize) {
        const end = Math.min(i + batchSize - 1, 1902);
        await processBatch(i, end);
    }
    console.log(chalk.blue('Finished checking domains.'));
};

main().catch(error => console.error(chalk.red('Error:', error)))