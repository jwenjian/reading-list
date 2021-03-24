
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
