const fs = require('fs')
const path =require('path')
const app = require('express')();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const wordsFilePath = path.join(__dirname,'word.json')

let words

if(fs.existsSync(wordsFilePath)){
    fs.readFile(wordsFilePath,(err,data) => {
        words = JSON.parse(data).word
        console.log(words)
        document.getElementById("showWord").innerText = words[0]
        setInterval(function() {
            let lenOfWords = words.length
            let randomIndex = Math.floor(Math.random()*lenOfWords)
            document.getElementById("showWord").innerText = words[randomIndex]
        }, 60000)
    })
}

//接收添加word的请求
io.on('connection',(socket) =>{
    console.log('a user want to add Word');

    socket.on('disconnect',()=>{
        console.log('a user disconnected');
    });
    //添加句子
    socket.on('add word', function(msg){
        console.log(msg);
        words.push(msg);
        socket.broadcast.emit('add word success~');
    });
    //将句子保存至本地
    socket.on('save word', function(msg){
        console.log('a user want to exit and save word')
        fs.writeFileSync(wordsFilePath,JSON.stringify({
            word:words
        }))
        io.emit('save file success', 'reply');
    });
});

http.listen(3000, function(){
    console.log('listening on *:3000');
});