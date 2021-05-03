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
const issue_number = process.env.EVENT_ISSUE_NUMBER

async function generateDetailPage(data) {
  ejs.renderFile(
    `template/detail.ejs`,
    data,
    (err, str) => {
      fs.writeFileSync(`template/index.html`, str)
    }
  )
}

async function generateDetailPage(issue) {
  ejs.renderFile(
    `template/detail.ejs`,
    issue,
    (err, str) => {
      fs.writeFileSync(`template/detail/${issue.number}.html`, str)
    }
  )
}

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

  data.recent = rest

  const the_issue = resp.data.filter(i => i.number == issue_number)

  console.log(`event issue = ${JSON.stringify(the_issue)}`)

  const issues = resp.data
  console.log(`${issues.length} issues got from GitHub`)

  await generateIndexPage(data)

  if (the_issue) {
    await generateDetailPage()
  }

  console.log("Detail page generated!")
}

main()
  .catch(err => {
    console.log(err)
    process.exit(-1)
  })
