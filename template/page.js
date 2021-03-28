
function parseTime() {
  const nodes = document.querySelectorAll('.timeago');

  // use render method to render nodes in real time
  timeago.render(nodes, 'zh_CN');
  
  // cancel all real-time render task
  timeago.cancel();
}

setTimeout(() => {
  parseTime()
}, 0);

function handleShare(evt) {
  if (navigator.share) {
    navigator.share({
      title: evt.innerText ? evt.innerText : 'TIR.cool 社区驱动的高质量阅读列表',
      text: evt.innerText  ? evt.innerText : 'TIR.cool 社区驱动的高质量阅读列表',
      url: 'https://tir.cool',
    })
      .then(() => console.log('Successful share'))
      .catch((error) => console.log('Error sharing', error));
  }
}
