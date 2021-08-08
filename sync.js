const { Octokit } = require("@octokit/rest")
const fs = require('fs')
const now = new Date()
const startOfTheDay = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0, 0)
const ejs = require('ejs')
const axios = require('axios').default;

const octokit = new Octokit(
  {
    auth: process.env.GITHUB_TOKEN
  }
);

async function main() {
  for (let n = 1; n <= 6; n++) {
    const resp = await octokit.issues.listForRepo({
      owner: 'jwenjian',
      repo: 'reading-list',
      state: 'open',
      per_page: 100,
      page: n
    })

    if (!resp || resp.status != 200) {
      console.error('Cannot get response from GitHub')
      return
    }

    let data = resp.data
    for (let i = 0; i < data.length; i ++) {
      let issue = data[i]
      axios.post('https://tir.jwenjian.workers.dev/api/publish', {
        API_KEY: 'changeit',
        data: {
          title: issue.title,
          description: issue.body,
          url: issue.html_url,
          timestamp: `${Date.parse(issue.created_at)}`
        }
      }).then(resp => {
        console.log(resp.status)
        console.log(`${issue.number} synced`)
      }).catch(err => {
        console.error(err)
      })
    }
  }
  
}

main()
  .catch(err => {
    console.log(err)
    process.exit(-1)
  })
