const {eventList} = require("../../config")
const {getConfig, flushConfig} = require('../../utils')
const {ipcRenderer} = require('electron')

let words = null
let timer = null
let freshTimer = null

ipcRenderer.on(eventList.ADD_WORD_FROM_MAIN, (event, msg) => {
  words.unshift(msg)
})

ipcRenderer.on(eventList.WORD_HAS_UPDATE, (event, newWords) => {
  const str = JSON.stringify(newWords)
  words = JSON.parse(str)
})

ipcRenderer.on(eventList.SAVE_WORD_BEFORE_EXIT, (event, msg) => {
  let wordkit = getConfig()
  flushConfig({ word: words, timer: wordkit.timer})
  ipcRenderer.send(eventList.SAVE_WORD_DONE, '')
})

ipcRenderer.on(eventList.CHANGE_TIMER, (event, newTimer) => {
  clearInterval(freshTimer)
  timer = newTimer
  freshTimer = setTimer(timer)
})

ipcRenderer.on(eventList.DEL_WORD, (event, msg) => {
  words = getConfig('word')
  clearInterval(freshTimer)
  freshTimer = setTimer(timer)
})

function setTimer(t) {
  return setInterval(function () {
    let lenOfWords = words.length
    let randomIndex = Math.floor(Math.random() * lenOfWords)
    ipcRenderer.send(eventList.SEND_NOTIFICATION, words[randomIndex])
  }, t * 60 * 1000)
}

function init() {
  const settings = getConfig()
  words = settings.word
  timer = settings["timer"] ? settings["timer"] : 3

  //设置时钟让word切换展示
  freshTimer = setTimer(timer)

  //初始化本地数据缓存
  flushConfig(settings)

  window.onload = function () {
    collect('wordkit_startup');
  }
}

init()