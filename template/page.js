
// 设置当前时间
const currentDate = new Date()
document.getElementById('current-date').innerText = `${currentDate.getFullYear()}-${currentDate.getMonth() + 1}-${currentDate.getDate()}`

/**
 * 获取数据
 */
fetch('./data.json')
.then(async function (response) {
  const res = await response.json();

  // 上次更新时间
  const updatedAt = document.getElementById('update_at')
  updatedAt.innerText = res.update_at

  // 当天阅读列表
  const items = res.today;

  const list = document.querySelector('.list');
  const fragment = document.createDocumentFragment();

  items.forEach(i => {
    const li = document.createElement('li');
    const a = document.createElement('a');
    a.href = i.html_url
    a.innerText = i.title
    a.target = '_blank'
    li.appendChild(a);
    fragment.appendChild(li);
  });

  list.appendChild(fragment);

  // 近期阅读列表
  const recentList = document.querySelector('.recent-list');
  const recentListFragment = document.createDocumentFragment();

  const recentItems = res.recent;
  
  recentItems.forEach(i => {
    const li = document.createElement('li');
    const a = document.createElement('a');
    a.href = i.html_url
    a.innerText = i.title
    a.target = '_blank'
    li.appendChild(a);
    recentListFragment.appendChild(li);
  });

  recentList.appendChild(recentListFragment);
})


/**
 * 处理分享按钮点击
 * 
 * @param {点击事件} evt 
 */
function handleShare(evt) {
  console.log(navigator.share)
  evt.preventDefault();
  if (!navigator.share) {
    console.warn('当前浏览器不支持 Web Share！');
    return;
  }

  navigator.share({
    text: document.querySelector('meta[name=description]').getAttribute('content'),
    title: document.head.title,
    url: window.location.href
  }).then(() => {})
  .catch(err => {console.error(err)})
}