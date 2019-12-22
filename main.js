const {app, Menu, BrowserWindow, Tray, globalShortcut, dialog, ipcMain } = require('electron')
const path = require('path')
const {eventList} = require("./config")

// 主窗口进程
var mainWindow = null
var screen = null
const isDebug = process.argv.length > 2 && process.argv.slice(2)[0].split("=")[1] === "true"

function createWindow() {
    let win = new BrowserWindow({
        icon:"./logo_2.png",
        width: 800,
        height: 200,
        frame: false,
        transparent: isDebug ? false : true,
        alwaysOnTop: false,
        movable: false,
    })
    //win.setIgnoreMouseEvents(isDebug ? false : true)
    !isDebug && win.setIgnoreMouseEvents(true)
    win.loadFile('index.html')
    isDebug && win.openDevTools()
    win.isVisible() ? win.setSkipTaskbar(true) : win.setSkipTaskbar(false);
    mainWindow = win

    // 阻止被最小化
    // const {DisableElectronWindowHiddenByWindowsD} = require('./disableWindowMinisize')
    // DisableElectronWindowHiddenByWindowsD(win)
}


let tray
app.on('ready', function () {
    screen = (require('electron')).screen
    createWindow();
    tray = new Tray(path.join(__dirname, 'logo_2.png'))
    const contextMenu = Menu.buildFromTemplate([
        {
            label: '导入字体',
            click: function () {
                dialog.showOpenDialog(mainWindow,{
                    icon:'./logo_2.png',
                    title: '导入字体',
                    filters: [{name: 'Custom File Type', extensions: ['ttf']}]
                }, function (files) {
                    if (files && files.length > 0) {
                        mainWindow.webContents.send('change font',  files[0])
                    }
                })
            }
        },
        {
            label:'仪表盘',
            click:() => {
                const {resolve} = path;
                let dashboard = new BrowserWindow({
                    icon:'./logo_2.png',
                    x:screen.getPrimaryDisplay().workAreaSize.width -350,
                    y:50,
                    width: 300,
                    height: 700,
                    alwaysOnTop: false,
                    frame: false,
                    transparent: false,
                    resizable: true,
                    movable: true,
                    show: false,
                })
                dashboard.once('ready-to-show', () => {
                    dashboard.show()
                })
                isDebug && dashboard.openDevTools()
                dashboard.setIgnoreMouseEvents(false)
                dashboard.loadFile( resolve(__dirname, './dashboard.html'))
                dashboard.addListener('closeThisWindow', () => {
                    dashboard.close()
                })
            }
        },
        {
            label: '退出',
            click: function () {
                mainWindow.webContents.send(eventList.SAVE_WORD_BEFORE_EXIT,  '')
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

//word列表保存成功，关闭程序
ipcMain.on(eventList.SAVE_WORD_DONE, (event, msg) => {
    app.quit();
})

//负责不同子进程之间的通信中转
ipcMain.on('msgBetweenRender',(event, msg) => {
    const {EVENT_TYPE,MSG} = msg
    mainWindow.webContents.send(EVENT_TYPE, MSG)
})
