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
  let data = {
    update_at: now,
    today: [],
    recent: []
  }
  const resp = await octokit.issues.listForRepo({
    owner: 'jwenjian',
    repo: 'reading-list',
    state: 'open',
    per_page: 50
  })

  if (!resp || resp.status != 200) {
    console.error('Cannot get response from GitHub')
    return
  }
 
  data.today = resp.data.filter(item => {
    return Date.parse(item.created_at) > startOfTheDay.getTime()
  })

  let rest = resp.data.slice(resp.data.indexOf(data.today[data.today.length - 1]) + 1)

  if (rest.length > 20) {
    data.recent = rest.slice(0, 20)
  } else {
    data.recent = rest
  }

  const issues = resp.data
  console.log(`${issues.length} issues got from GitHub`)

  fs.writeFileSync('template/data.json', JSON.stringify(data))
  console.log('Issues write to data.json')

}

main()
.catch(err => {
  console.log(err)
  process.exit(-1)
})
