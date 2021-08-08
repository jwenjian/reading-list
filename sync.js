const { Octokit } = require("@octokit/rest")
const fs = require('fs')
const now = new Date()
const startOfTheDay = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0, 0)
const ejs = require('ejs')

const octokit = new Octokit(
  {
    auth: process.env.GITHUB_TOKEN
  }
);

async function main() {
  let data = {
    update_at: now,
    today: [],
    recent: []
  }
  const resp = await octokit.issues.listForRepo({
    owner: 'jwenjian',
    repo: 'reading-list',
    state: 'open',
    per_page: 100
  })

  if (!resp || resp.status != 200) {
    console.error('Cannot get response from GitHub')
    return
  }
  
  console.log(resp.data)
}

main()
  .catch(err => {
    console.log(err)
    process.exit(-1)
  })
