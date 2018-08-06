const {app,Menu,BrowserWindow,Tray} = require('electron')
function createWindow() {
    let win = new BrowserWindow({width:800,height:500,frame: false,transparent: true, alwaysOnTop: true})
    win.setIgnoreMouseEvents(true)
    win.loadFile('index.html')
    win.isVisible() ?win.setSkipTaskbar(true):win.setSkipTaskbar(false);
}
let tray
app.on('ready',function(){
    createWindow();
    tray = new Tray('icon.ico')
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

