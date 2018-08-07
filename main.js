const {app,Menu,BrowserWindow,Tray} = require('electron')
const path = require('path')

function createWindow() {
    let win = new BrowserWindow({width:1300,height:100,frame: false,transparent: true, alwaysOnTop: true})
    //let win = new BrowserWindow({width:800,height:500})
    win.setIgnoreMouseEvents(true)
    win.loadFile('index.html')
    //win.openDevTools()
    win.isVisible() ?win.setSkipTaskbar(true):win.setSkipTaskbar(false);
}
let tray
app.on('ready',function(){
    createWindow();
    tray = new Tray(path.join(__dirname,'icon.ico'))
    const contextMenu = Menu.buildFromTemplate([
        {
            label: '退出',
            click: function () {
                app.quit();
            }
        }
    ])
    tray.setToolTip('wordkit')
    tray.setContextMenu(contextMenu)
})

app.setLoginItemSettings({
    openAtLogin: true,
    path:app.getPath('exe')
})

