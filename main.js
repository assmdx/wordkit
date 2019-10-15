const {app, Menu, BrowserWindow, Tray, globalShortcut, dialog, ipcMain} = require('electron')
const path = require('path')

// 主窗口进程
var mainWindow = null

const isDebug = process.argv.slice(2)[0].split("=")[1] === "true"

function createWindow() {
    let win = new BrowserWindow({
        width: 800,
        height: 200,
        frame: false,
        transparent: isDebug ? false : true,
        alwaysOnTop: false,
        movable: false
    })
    win.setIgnoreMouseEvents(isDebug ? false : true)
    win.loadFile('index.html')
    isDebug && win.openDevTools()
    win.isVisible() ? win.setSkipTaskbar(true) : win.setSkipTaskbar(false);
    mainWindow = win
}

//添加键盘快捷键
function addKeyBind() {
    globalShortcut.register('ctrl+k+0', function () {
        let addWordWin = new BrowserWindow({
            width: 1200,
            height: 120,
            alwaysOnTop: true,
            frame: false,
            transparent: true,
            resizable: false,
            movable: false
        })
        addWordWin.setIgnoreMouseEvents(false)
        addWordWin.loadFile('addWord.html')
        //addWordWin.openDevTools()
        addWordWin.addListener('closeThisWindow', () => {
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
                mainWindow.webContents.send('save word',  '')
            }
        },
        {
            label: '导入字体',
            click: function () {
                dialog.showOpenDialog({
                    title: '导入字体',
                    filters: [{name: 'Custom File Type', extensions: ['ttf']}]
                }, function (files) {
                    if (files && files.length > 0) {
                        mainWindow.webContents.send('change font',  files[0])
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

//添加新的词中转消息
ipcMain.on('add word', (event, msg) => {
    mainWindow.webContents.send('add word from main',  msg)
})

//word列表保存成功，关闭程序
ipcMain.on('save word done', (event, msg) => {
    app.quit();
})
