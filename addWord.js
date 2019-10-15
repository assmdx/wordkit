const {remote, ipcRenderer} = require('electron');

function addWord(event){
    if(event.keyCode === 13){
        try{
            if(event.target.value && event.target.value){
                ipcRenderer.send('add word', event.target.value)
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

