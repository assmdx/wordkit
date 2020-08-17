const {ipcRenderer} = require('electron');

const {eventList} = require("../../config");
const {getConfig, setConfig, flushConfig} = require('../../utils');

// dashboard全局变量
let words = [];
let freshTimer = null;
let timer = 3;
let lastchild = null;
let targetToDel = null;
let lastUpdateTime = +new Date();
let wordInputTimer = null;

// 初始化
initDashboard();


function initDashboard() {
  window.onload = function () { 
    collect('wordkit_open_dashboard');
    collect('wordkit_startup'); 
  };
  window.onbeforeunload = function () { collect('wordkit_close_dashboard'); };  
  const db = getConfig();
  timer = db.timer ? db.timer : 3;
  words = db.word || [];
  // 初始化UI
  $("#timer").val(timer);
  words.forEach(v => {
    $("#wordsList").append(`<li class="list-group-item fs3" contenteditable="true">${v}</li>`)
  });
  // 设置时钟让word切换展示
  freshTimer = setTimer(timer);
  // 挂载事件处理函数
  $("#timer").blur(timerBlur);
  // 监听word列表的点击，右键，修改，删除
  $("#wordsList").on('mousedown', 'li', wordClick);
  $('body').click(function () {$("#delWordButton").css({ 'display': 'none'})});
  $("#addWordInput").keyup(wordInputEnter);
  $('body').on('focus', '[contenteditable]', function() {
      const $this = $(this);
      $this.data('before', $this.html());
    }).on('input paste keypress', '[contenteditable]', function(e) {
      if (e && e.keyCode !== undefined && e.keyCode === 13) {
        return false;
      }
      const $this = $(this);
      if ($this.data('before') !== $this.html()) {
        $this.data('before', $this.html());
      }
      if (wordInputTimer) {
        clearTimeout(wordInputTimer);
      }
      const nowTime = +new Date();
      let remaining = nowTime - lastUpdateTime;
      if (remaining >= 1000) {
        lastUpdateTime = nowTime;
        updateWordsByListContent();
      } else {
        wordInputTimer = setTimeout(updateWordsByListContent, 1000 - remaining);
      }
    });
  // App退出前保存数据
  ipcRenderer.on(eventList.SAVE_WORD_BEFORE_EXIT, saveWordsBeforeExit);
}

function timerBlur(e) {
  let val = parseInt($("#timer").val());
  const ans = getConfig('timer');
  if (val && val !== ans) {
    val = val < 1 ? 1 : val;
    setConfig('timer', val);
    changeTimer(val);
    collect('wordkit_change_timer')
  }
}

function changeTimer(newTimer) {
  if (timer !== newTimer) {
    flushConfig({word: words, timer});
  }
  clearInterval(freshTimer);
  timer = newTimer;
  freshTimer = setTimer(timer);
}

function wordClick(e) {
  if (e.button == 0) {
    //左键点击
    if (this && this === lastchild) {
      $(this).removeClass('active');
      lastchild = null;
    } else {
      $(this).addClass('active');
      if (lastchild) {
        $(lastchild).removeClass('active');
      }
      lastchild = this;
    }
  } else {
    //右键点击
    targetToDel = this;
    const x = e.pageX;
    const y = e.pageY;
    $("#delWordButton").css({
      'display': "block",
      'left': `${x}px`,
      'top': `${Math.floor(y - window.scrollY - 20)}px`
    });
  }
}

function showDelWordModal() {
  $("#delWordButton").css({'display': 'none'});
  $('#delWordModal').modal('toggle');
}

function delWord() {
  const w = $(targetToDel).text();
  $(targetToDel).remove();
  let words = getConfig('word');
  words = words.filter(v => v !== w);
  setConfig('word', words);
  flushConfig({word: words, timer});
  collect('wordkit_delete_word');
  $('#delWordModal').modal('hide');
}

function wordInputEnter(e) {
  if (e.keyCode == 13 && e.target.value) {
    addwordInDashboard(e.target.value);
    $("#addWordInput").val("");
  }
}

function addwordInDashboard(word) {
  if (words.findIndex(v => v === word) === -1) {
    words.unshift(word);
    setConfig('word', words);
    flushConfig({word: words, timer});
    $("#wordsList").prepend(`<li class="list-group-item fs3">${word}</li>`);
    collect('wordkit_add_word');
  }
}

//监听列表字体的编辑变化
function updateWordsByListContent() {
  let newWordArr = [];
  $(".list-group-item").map((index, v) => {
    newWordArr.push(v.innerHTML);
  });
  words = newWordArr;
  setConfig("word", newWordArr);
  flushConfig({word: words, timer});
  collect('wordkit_change_word');
}

function setTimer(t) {
  return setInterval(function () {
    let lenOfWords = words.length;
    let randomIndex = Math.floor(Math.random() * lenOfWords);
    ipcRenderer.send(eventList.SEND_NOTIFICATION, words[randomIndex]);
  }, t * 1000);
}

function saveWordsBeforeExit(event, msg) {
  flushConfig({ word: words, timer});
  ipcRenderer.send(eventList.SAVE_WORD_DONE, '');
}