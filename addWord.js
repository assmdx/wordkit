const io = require('socket.io-client');
const socket = io('http://localhost:3000');
const remote = require('electron').remote;

function addWord(event){
    console.log(event.target.value)
    if(event.keyCode === 13){
        console.log('I want to add ', event.target.value);
        try{
            socket.emit('add word', event.target.value);
            remote.getCurrentWindow().close();
        }
        catch(e){
            console.error(e);
        }
    }
    if(event.keyCode === 27) {
        remote.getCurrentWindow().close();
    }
}

