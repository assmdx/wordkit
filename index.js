const fs = require('fs')
const path =require('path')
if(fs.existsSync(path.join(__dirname,'word.json'))){
    fs.readFile(path.join(__dirname,'word.json'),(err,data) => {
        let words = JSON.parse(data).word
        let lenOfWords = words.length
        console.log(words)
        document.getElementById("showWord").innerText = words[0]
        setInterval(function() {
            let randomIndex = Math.floor(Math.random()*lenOfWords)
            document.getElementById("showWord").innerText = words[randomIndex]
        }, 60000)
    })
}
