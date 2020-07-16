const fs = require('fs')
const path = require('path')
const store = window.localStorage || {}
const {ipcRenderer} = require('electron')
const configPath = path.join(__dirname, '../config')
const globalConfig = require(configPath)

//子进程之间通信的消息体的编码和解码函数
function sendMsgBetweenRender(EVENT_TYPE, MSG) {
  ipcRenderer.send('msgBetweenRender', {
    EVENT_TYPE,
    MSG
  })
}

function getConfig(key) {
  const cache = store.getItem('wordkit')
  let wordkit = null
  const wordkitFilePath = path.join(__dirname, '../datastore/word.json')

  console.log(cache, key)

  if (cache) {
    wordkit = JSON.parse(cache)
  } else {
    console.log(wordkitFilePath)
    if (fs.existsSync(wordkitFilePath)) {
      try {
        const wordkitStr = fs.readFileSync(wordkitFilePath)
        console.log(wordkitStr)
        wordkit = JSON.parse(wordkitStr)
        console.log(wordkit)
      } catch (err) {
        console.error(err)
        // 读取文件失败，报错，程序退出
        sendMsgBetweenRender(globalConfig.eventList.RUNTIME_ERROR, {
          type: globalConfig.ERROR_TYPE.READFILE,
          err,
        })
        // 这里直接return undefined
        return;
      }
    } else {
      // 没有数据的话，就初始化一个
      wordkit = {word: [], timer: 3}
    }
  }

  console.log(wordkit)
  if (key) {
    return wordkit[key]
  } else {
    return wordkit;
  }
}

function setConfig(key, value) {
  let wordkit = store.getItem('wordkit') ? JSON.parse(store.getItem('wordkit')) : {};
  if (key) {
    wordkit[key] = value;
  } else {
    wordkit = value
  }


  store.setItem('wordkit', JSON.stringify(wordkit))
}

// 将wordkit刷到磁盘上
function flushConfig(wordkit) {
  const wordkitFilePath = path.join(__dirname, '../datastore/word.json')
  const d = wordkit || getConfig()
  if (d) {
    fs.writeFileSync(wordkitFilePath, JSON.stringify(d))
  }
}


module.exports = {
  sendMsgBetweenRender,
  getConfig,
  setConfig,
  flushConfig
}

