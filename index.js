const axios = require('axios')

axios.get('https://www.ilovegirl.top/files/word.json').then(res => {
    let words = res.data.word
    let lenOfWords = words.length
    var timer = setInterval(function() {
        let randomIndex = Math.floor(Math.random()*lenOfWords)
        document.getElementById("showWord").innerText = words[randomIndex]
    }, 60000)
})
