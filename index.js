const fs = require('fs')
const path = require('path')
const wordsFilePath = path.join(__dirname, 'word.json')
const {eventList} = require("./config")

let words
var fonttype
var freshTimer
var timer

if (fs.existsSync(wordsFilePath)) {
    fs.readFile(wordsFilePath, (err, data) => {
        //读取默认配置,优先从localStorage中读取，然后再选words.json中的数据
        var cachedSetting = getConfig()
        var settings = cachedSetting ? cachedSetting : JSON.parse(data)
        words = settings.word
        fonttype = fontFileName = settings.font || "邢世新硬笔行书简体.ttf"
        timer = settings["timer"] ? settings["timer"] : 3000
        // 设置初始word
        document.getElementById("showWord").innerText = words[0]

        //设置字体样式
        changefont(fontFileName)

        //设置时钟让word切换展示
        freshTimer = setTimer(timer)
        //初始化本地数据缓存
        setConfig(undefined,settings)
    })
}


ipcRenderer.on(eventList.SELECT_FONT_TYPE, (event, fontFileName) => {
    //change font face
    changefont(fontFileName)
    fonttype = fontFileName
})

ipcRenderer.on(eventList.ADD_WORD_FROM_MAIN, (event, msg) => {
    words.unshift(msg)
})

ipcRenderer.on(eventList.WORD_HAS_UPDATE, (event, newWords) => {
    const str = JSON.stringify(newWords)
    words = JSON.parse(str)
})

ipcRenderer.on(eventList.SAVE_WORD_BEFORE_EXIT, (event, msg) => {
    let wordkit = getConfig()
    fs.writeFileSync(wordsFilePath, JSON.stringify({
        word: words,
        font:fonttype,
        fontSize:wordkit.fontSize,
        timer:wordkit.timer
    }))
    ipcRenderer.send(eventList.SAVE_WORD_DONE,'')
})

ipcRenderer.on(eventList.CHANGE_FONT_SIZE,  (event, msg) => {
    $("#showWord").css("font-size", msg + "px");
})

ipcRenderer.on(eventList.CHANGE_TIMER,  (event, msg) => {
    clearInterval(freshTimer)
    timer = msg
    freshTimer = setTimer(msg)
})

ipcRenderer.on(eventList.DEL_WORD,  (event, msg) => {
    words = getConfig('word')
    clearInterval(freshTimer)
    freshTimer = setTimer(timer)
})


function changefont(fontFileName) {
    setConfig('font',fontFileName)
    let newStyle = document.createElement('style');
    newStyle.setAttribute('type','text/css')
    newStyle.appendChild(document.createTextNode(`
        @font-face {
            font-family: 'wordkit';
            src: url('assets/font/${fontFileName}') format('truetype');
        }`));

    for(let i = 0; i< document.head.children.length ;i++) {
        if(document.head.children[i].innerHTML.indexOf("font-face") > 0) {
            document.head.removeChild(document.head.children[i])
        }
    }

    document.head.appendChild(newStyle)
}

function setTimer(t) {
    return setInterval(function () {
        let lenOfWords = words.length
        let randomIndex = Math.floor(Math.random() * lenOfWords)
        document.getElementById("showWord").innerText = words[randomIndex]
    }, t)
}
