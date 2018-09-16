const {app, Menu, BrowserWindow, Tray, globalShortcut,ipcMain,dialog  } = require('electron')
const path = require('path')
const io = require('socket.io-client');
const socket = io('http://localhost:3000');

function createWindow() {
    let win = new BrowserWindow({width: 800, height: 500, frame: false,transparent: true, alwaysOnTop: false,movable:true})
    // win.setIgnoreMouseEvents(true)
    win.loadFile('index.html')
    win.openDevTools()
    win.isVisible() ? win.setSkipTaskbar(true) : win.setSkipTaskbar(false);
}

//添加键盘快捷键
function addKeyBind() {
    globalShortcut.register('ctrl+k+0', function () {
        let addWordWin = new BrowserWindow({width: 1200, height: 120, alwaysOnTop: true,frame: false,transparent:true,resizable:false,movable:false})
        addWordWin.setIgnoreMouseEvents(false)
        addWordWin.loadFile('addWord.html')
        //addWordWin.openDevTools()
        addWordWin.addListener('closeThisWindow',()=>{
            addWordWin.close()
        })
    })
}

let tray
app.on('ready', function () {
    createWindow();
    addKeyBind();
    tray = new Tray(path.join(__dirname, 'icon.ico'))
    const contextMenu = Menu.buildFromTemplate([
        {
            label: '退出',
            click: function () {
                saveWord();
            }
        },
        {
            label:'导入字体',
            click:function () {
                dialog.showOpenDialog({
                    title:'导入字体',
                    filters:[{name:'Custom File Type',extensions:['ttf']}]
                },function (files) {
                    console.log(files)
                    if(files.length > 0 ){
                        socket.emit('change font',files[0]);
                    }
                })
            }
        }
    ])
    tray.setToolTip('wordkit')
    tray.setContextMenu(contextMenu)


})

//设置开机自动启动


app.setLoginItemSettings({
    openAtLogin: true,
    path: app.getPath('exe')
})

function saveWord(){
    socket.emit('save word','');
}

socket.on('save file success',(msg)=>{
    app.quit();
})
