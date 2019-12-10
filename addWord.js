const {remote, ipcRenderer} = require('electron');
const {eventList} = require("./config")

function addWord(event){
    if(event.keyCode === 13){
        try{
            if(event.target.value && event.target.value){
                ipcRenderer.send(eventList.ADD_WORD, event.target.value)
            }
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

