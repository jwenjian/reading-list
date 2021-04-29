
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
    const title = document.querySelector('.title>p').innerText
    navigator.share({
      title: 'TIR.cool: ' + title,
      text: 'TIR.cool: ' + title,
      url: location.href,
    })
      .then(() => console.log('Successful share'))
      .catch((error) => console.log('Error sharing', error));
  }
}
