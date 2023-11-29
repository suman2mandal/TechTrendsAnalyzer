import axios from 'axios';
// Function to create a commit
import fs from 'fs';
import {exec} from 'child_process';

// Replace with your personal access token
const token = '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';

// Headers for axios
const headers = {
    'Authorization': `token ${token}`,
    'Accept': 'application/vnd.github.v3+json'
};

// Array of repository names
const repoNames = ["TechTrendsAnalyzer"]
    // ,
    // "AsyncTaskScheduler",
    // "ReactiveChatApp",
    // "NodeAuthenticator",
    // "anotherRepo"];

// Function to create a repository
async function createRepo(repoName) {
    const url = 'https://api.github.com/user/repos';
    const data = {
        name: repoName,
        auto_init: true
    };

    try {
        const response = await axios.post(url, data, { headers });
        return response.data;
    } catch (error) {
        console.error(error);
    }
}

async function createCommit(repoName, message, commitNumber) {
    const fileContent = `This is commit number ${commitNumber}`;
    const fileName = `file${commitNumber}.txt`;

    // Set the commit date to January 31, 2023
    const commitDate = new Date('November 30, 2023').toISOString();

    try {
        // Create a file with the specified content
        fs.writeFileSync(fileName, fileContent);

        // Set the environment variables for the Git commands
        process.env.GIT_AUTHOR_DATE = commitDate;
        process.env.GIT_COMMITTER_DATE = commitDate;

        // Execute Git commands using child_process
        exec(`git add ${fileName} && git commit -m "${message}" && git push -f origin main`, async (error, stdout, stderr) => {
            if (error) {
                console.error(`Error executing Git commands: ${error}`);
                return;
            }
            console.log(`Git commands executed successfully:\n${stdout}`);

            // Clean up: remove the temporary file
            fs.unlinkSync(fileName);
        });
    } catch (error) {
        console.error(error);
    }
}

async function repoExists(repoName) {
    const url = `https://api.github.com/repos/suman2mandal/${repoName}`;

    try {
        const response = await axios.get(url, { headers });
        return response.status === 200;
    } catch (error) {
        return false;
    }
}

// Main function
async function main() {
    for (let i = 0; i < repoNames.length; i++) {
        // Check if the repository exists
        const exists = await repoExists(repoNames[i]);

        // If the repository does not exist, create it and make commits
        if (!exists) {
            const repo = await createRepo(repoNames[i]);

            const numCommits = Math.floor(Math.random() * 6) + 3;
            for (let j = 0; j < numCommits; j++) {
                const message = `Commit number ${j + 1}`;
                const commit = await createCommit(repoNames[i], message, j + 1);
            }
        }
    }
}

main();
