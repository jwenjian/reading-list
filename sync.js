const { Octokit } = require("@octokit/rest")
const fs = require('fs')
const now = new Date()
const startOfTheDay = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0, 0)
const ejs = require('ejs')
const axios = require('axios').default;
// 如果不能使用 es6 import，可用 const Vika = require('@vikadata/vika').default; 代替
const Vika = require('@vikadata/vika').default;

const vika = new Vika({ token: process.env.VIKA_KEY, fieldKey: "name" });
// 通过 datasheetId 来指定要从哪张维格表操作数据。
const datasheet = vika.datasheet("dstQT8oKpeXW9q3nc9");


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
      // add 方法接收一个数组值，可以同时创建多条 record，单次请求可最多创建10条 record
      datasheet.records.create([
        {
          "fields": {
            "title": issue.title,
            "url": issue.body,
            "description": issue.body,
            "created_at": Date.parse(issue.created_at)
          }
        }
      ]).then(response => {
        if (response.success) {
          console.log(response.data);
        } else {
          console.error(response);
        }
      })

    }
  }
  
}

main()
  .catch(err => {
    console.log(err)
    process.exit(-1)
  })
