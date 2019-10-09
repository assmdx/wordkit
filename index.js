const fs = require('fs')
const path = require('path')
const wordsFilePath = path.join(__dirname, 'word.json')
const {ipcRenderer} =  require('electron')

let words

if (fs.existsSync(wordsFilePath)) {
    fs.readFile(wordsFilePath, (err, data) => {
        words = JSON.parse(data).word
        document.getElementById("showWord").innerText = words[0]
        setInterval(function () {
            let lenOfWords = words.length
            let randomIndex = Math.floor(Math.random() * lenOfWords)
            document.getElementById("showWord").innerText = words[randomIndex]
        }, 3000)
    })
}


ipcRenderer.on('change font', (event, fontPath) => {
    //alert('change font received'+fontPath) // prints "ping"

    //copy file to asstes/font
    let fontFileName = fontPath.substring(fontPath.lastIndexOf('\\'))
    fs.copyFileSync(fontPath, path.join(__dirname, 'assets/font/' + fontFileName))

    //change font face
    let newStyle = document.createElement('style');
    newStyle.appendChild(document.createTextNode(`
        @font-face {
            font-family: 'wordkit';
            src: url('assets/font/${fontFileName}') format('truetype');
        }`));

    document.head.appendChild(newStyle);

})

ipcRenderer.on('save word', (event, msg) => {
    words.push(msg);

})

ipcRenderer.on('add word from main', (event, msg) => {
    words.push(msg);
})

ipcRenderer.on('save word', (event, msg) => {
    fs.writeFileSync(wordsFilePath, JSON.stringify({
        word: words
    }))
    ipcRenderer.send('save word done','')
})
