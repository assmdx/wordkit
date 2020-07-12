const {
  eventList
} = require("./config")

//初始化配仪表盘页面
var words = []
setTimeout(() => {
  const wordkit = getConfig()

  //设置刷新间隔
  var timer = wordkit["timer"] ? wordkit['timer'] : 3000
  $("#timer").val(timer)

  //设置words列表
  let w = wordkit["word"]
  words = w ? w : [""]
  words.forEach(v => {
    $("#wordsList").append(`<li class="list-group-item fs3" contenteditable="true">${v}</li>`)
  })
}, 500)

//监听刷新时间间隔变化
$("#timerAdd").click(() => {
  const val = parseInt($("#timer").val())
  const ans = val + 500
  $("#timer").val(ans)
  setConfig('timer', ans)
  sendMsgBetweenRender(eventList.CHANGE_TIMER, ans)
})
$("#timerDel").click(() => {
  const val = parseInt($("#timer").val())
  const ans = val - 500 >= 1000 ? val - 500 : 1000
  $("#timer").val(ans)
  setConfig('timer', ans)
  sendMsgBetweenRender(eventList.CHANGE_TIMER, ans)
})
$("#timer").keyup(() => {
  let val = parseInt($("#timer").val())
  const ans = getConfig('timer')
  if (val && val !== ans) {
    val = val < 1000 ? 1000 : val;
    setConfig('timer', val)
    sendMsgBetweenRender(eventList.CHANGE_TIMER, val)
  }
})

//监听word列表的点击，右键，修改，删除
var lastchild = null
var targetToDel = null
$("#wordsList").on('mousedown', 'li', function (e) {
  if (e.button == 0) {
    //左键点击
    if (this && this === lastchild) {
      $(this).removeClass('active')
      lastchild = null
    } else {
      $(this).addClass('active')
      if (lastchild) {
        $(lastchild).removeClass('active')
      }
      lastchild = this
    }
  } else {
    //右键点击
    targetToDel = this
    const x = e.pageX
    const y = e.pageY
    console.log(x, y, window.scrollY)
    $("#delWordButton").css({
      'display': "block",
      'left': `${x}px`,
      'top': `${Math.floor(y - window.scrollY - 20)}px`
    })
  }
})

function showDelWordModal() {
  $("#delWordButton").css({
    'display': 'none'
  })
  $('#delWordModal').modal('toggle')
}

function delWord() {
  //删除单词
  const w = $(targetToDel).text()
  $(targetToDel).remove()
  let words = getConfig('word')
  words = words.filter(v => v !== w)
  setConfig('word', words)
  setTimeout(() => {
    sendMsgBetweenRender(eventList.DEL_WORD)

  }, 50)
  $('#delWordModal').modal('hide')
}
$('body').click(function () {
  $("#delWordButton").css({
    'display': 'none'
  })
});

function addwordInDashboard(word) {
  if (words.findIndex(v => v === word) === -1) {
    words.unshift(word)
    setConfig('word', words)
    $("#wordsList").prepend(`<li class="list-group-item fs3">${word}</li>`)
    sendMsgBetweenRender(eventList.ADD_WORD_FROM_MAIN, word)
  }
}
$("#addWordInput").keyup(function (e) {
  if (e.keyCode == 13 && e.target.value) {
    addwordInDashboard(e.target.value)
    $("#addWordInput").val("")
  }
})
//监听列表字体的编辑变化
function updateWordsByListContent() {
  let newWordArr = []
  $(".list-group-item").map((index, v) => {
    newWordArr.push(v.innerHTML)
  })
  setConfig("word", newWordArr)
  sendMsgBetweenRender(eventList.WORD_HAS_UPDATE, newWordArr)
}
var lastUpdateTime = +new Date()
var timer = null
$('body').on('focus', '[contenteditable]', function () {
  const $this = $(this)
  $this.data('before', $this.html())
}).on('input paste keypress', '[contenteditable]', function (e) {

  if (e && e.keyCode !== undefined && e.keyCode === 13) {
    return false
  }

  const $this = $(this);
  if ($this.data('before') !== $this.html()) {
    $this.data('before', $this.html())
  }
  if (timer) {
    clearTimeout(timer)
  }
  let nowTime = +new Date()
  let remaining = nowTime - lastUpdateTime
  if (remaining >= 1000) {
    lastUpdateTime = nowTime
    updateWordsByListContent()
  } else {
    timer = setTimeout(updateWordsByListContent, 1000 - remaining)
  }
});