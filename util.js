const store = window.localStorage || {};
function getConfig(key) {
    let wordkit = store.getItem('wordkit') ? JSON.parse(store.getItem('wordkit')) : {};
    if(key) {
        return wordkit[key]
    } else {
        return wordkit
    }
}

function setConfig(key, value) {
    let wordkit = store.getItem('wordkit') ? JSON.parse(store.getItem('wordkit')) : {};
    if(key) {
        wordkit[key] = value;
    } else {
        wordkit = value
    }


    store.setItem('wordkit',JSON.stringify(wordkit))
}


//子进程之间通信的消息体的编码和解码函数
const {ipcRenderer} =  require('electron')
function sendMsgBetweenRender(EVENT_TYPE,MSG){
    ipcRenderer.send('msgBetweenRender',{
        EVENT_TYPE,
        MSG
    })
}
