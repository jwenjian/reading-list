
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
    // 当天阅读列表直接跳转至原文链接，body只能包含原文链接，否则跳转不成功
    a.href = i.body;
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