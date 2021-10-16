const fs = require('fs')
const now = new Date()
// 如果不能使用 es6 import，可用 const Vika = require('@vikadata/vika').default; 代替
const Vika = require('@vikadata/vika').default;

const vikaClient = new Vika({ token: process.env.VIKA_KEY, fieldKey: "name" });
// 通过 datasheetId 来指定要从哪张维格表操作数据。
const datasheet = vikaClient.datasheet("dstWxz5xDhi69QnmbV");

const RSS_TEMPLATE_HEADER = `<?xml version="1.0" encoding="UTF-8"?>
<?xml-stylesheet href="/rss.xsl" type="text/xsl"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
<channel>
  <title>
    Today I Read
</title>
 <link>
https://todayiread.vercel.app
</link>
 <description>Today I Read, 一个社区共建的高质量阅读列表</description>
`
const RSS_TEMPLATE_FOOTER = `</channel></rss>`


async function main() {

  await generateFeed();
}

/**
 * Generate Feed XML
 */
async function generateFeed() {

  const resp = await datasheet.records.query({ viewId: "viwLTjftwvAah", fieldKey: "name", maxRecords: 50 })

  if (!resp.success) {
    process.exit(-1)
    return
  }

  const data = resp.data

  let items = data.records
  let output = '';
  for (let i = 0; i < items.length; i++) {
    let content = items[i]
    output += `
    <item>
      <title>${ encodeHtmlChars(content.fields.title) }</title>
      <pubDate>${new Date(content.fields.created_at)}</pubDate>
      <link>${content.fields.url}</link>
      <description><![CDATA[${content.fields.description}<br/><br/><br/><hr/><br/>欢迎将此 RSS 分享给你的朋友]]></description>
    </item>`
  }

  let rss = buildRssXml(output);

  console.log(rss)

  fs.writeFileSync('feed.xml.new', rss)
  fs.renameSync("feed.xml.new", "feed.xml")
}


function buildRssXml(output) {
  return RSS_TEMPLATE_HEADER + output + RSS_TEMPLATE_FOOTER;
}

function encodeHtmlChars(input) {
  let s = "";
  if (input.length == 0) return "";
  s = input.replace(/&/g, "&amp;");
  s = s.replace(/</g, "&lt;");
  s = s.replace(/>/g, "&gt;");
  s = s.replace(/ /g, "&nbsp;");
  s = s.replace(/\'/g, "&#39;");
  s = s.replace(/\"/g, "&quot;");
  return s;
}

main()
  .catch(err => {
    console.log(err)
    process.exit(-1)
  })
