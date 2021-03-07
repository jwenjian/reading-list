const { Octokit } = require("@octokit/rest")
const fs = require('fs')
const now = new Date()
const startOfTheDay = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0, 0)

const octokit = new Octokit(
  {
    auth: process.env.GITHUB_TOKEN
  }
);

async function main() {
  const resp = await octokit.issues.listForRepo({
    owner: 'jwenjian',
    repo: 'reading-list',
    since: startOfTheDay.toISOString()
  })

  console.log(startOfTheDay.toISOString())

  if (!resp || resp.status != 200) {
    console.error('Cannot get response from GitHub')
    return
  }
 
  const issues = resp.data
  console.log(`${issues.length} issues got from GitHub`)

  fs.writeFileSync('template/data.json', JSON.stringify(issues))
  console.log('Issues write to data.json')

}

main()
.catch(err => {
  console.log(err)
  process.exit(-1)
})
