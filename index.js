const fs = require('fs')
const path = require('path')
const wordsFilePath = path.join(__dirname, 'word.json')
const {ipcRenderer} =  require('electron')

let words
var fonttype

if (fs.existsSync(wordsFilePath)) {
    fs.readFile(wordsFilePath, (err, data) => {
        //读取默认配置
        var settings = JSON.parse(data)
        words = settings.word
        fontFileName = settings.font || "邢世新硬笔行书简体.ttf"

        // 设置初始word
        document.getElementById("showWord").innerText = words[0]

        //设置字体样式
        changefont(fontFileName)

        //设置时钟让word切换展示
        setInterval(function () {
            let lenOfWords = words.length
            let randomIndex = Math.floor(Math.random() * lenOfWords)
            document.getElementById("showWord").innerText = words[randomIndex]
        }, 3000)
    })
}


ipcRenderer.on('change font', (event, fontPath) => {
    //复制字体
    let fontFileName = fontPath.substring(fontPath.lastIndexOf('\\') + 1)

    console.log(fontPath, fontFileName)
    fs.copyFileSync(fontPath, path.join(__dirname, 'assets/font/' + fontFileName))

    //change font face
    changefont(fontFileName)

    fonttype = fontFileName

})

ipcRenderer.on('save word', (event, msg) => {
    words.push(msg);

})

ipcRenderer.on('add word from main', (event, msg) => {
    words.push(msg);
})

ipcRenderer.on('save word', (event, msg) => {
    fs.writeFileSync(wordsFilePath, JSON.stringify({
        word: words,
        font:fonttype
    }))
    ipcRenderer.send('save word done','')
})


function changefont(fontFileName) {
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
