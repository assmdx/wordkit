const {app, Menu, BrowserWindow, Tray, dialog, ipcMain, Notification} = require("electron");
const path = require("path");
const {resolve} = path;
const {eventList} = require("../config");
const LOGO = "../assets/img/logo_2.png";
const ployfillMac = require('./ployfill.mac');
const macaddress = require('macaddress');


// 主窗口进程
let mainWindow = null;
let dashboardWindow = null;
let screen = null;
const isDebug = process.argv.length > 2 && process.argv.slice(2)[0].split("=")[1] === "true";
const isMac = process.platform === 'darwin';
global.macaddress = macaddress;

// 创建仪表盘函数
function createDashboardWindow() {
  if (dashboardWindow && !dashboardWindow.isDestroyed()) {
    dashboardWindow.close();
  }
  dashboardWindow = new BrowserWindow({
    webPreferences: {
      nodeIntegration : true,
    },
    icon: resolve(__dirname, LOGO),
    x: screen.getPrimaryDisplay().workAreaSize.width - 350,
    y: 50,
    width: 300,
    height: 800,
    alwaysOnTop: false,
    frame: true,
    transparent: false,
    resizable: false,
    movable: true,
    show: false,
    minimizable: true,
    maximizable: false,
    autoHideMenuBar: true,
  });
  dashboardWindow.once("ready-to-show", () => {
    dashboardWindow.show();
  });
  isDebug && dashboardWindow.openDevTools();
  dashboardWindow.setIgnoreMouseEvents(false);
  dashboardWindow.loadFile(resolve(__dirname, "../renderer/dashboard/dashboard.html"));
  dashboardWindow.addListener("closeThisWindow", dashboardWindow.close);
  mainWindow = dashboardWindow;
  if (isMac) {
    ployfillMac.ployfill();
  }
}

// 设置右下角的右键菜单
let tray;
app.on("ready", function () {
  screen = require("electron").screen;
  if (process.platform === "win32") {
    app.setAppUserModelId(app.getName());
  }
  createDashboardWindow();

  const trayLogo = isMac ? '../../icon.mac.top.18x18.png' : LOGO
  tray = new Tray(path.join(__dirname, trayLogo));

  const contextMenu = Menu.buildFromTemplate([{
      label: "仪表盘",
      click: createDashboardWindow,
    },
    {
      label: "退出",
      click: function () {
        mainWindow.webContents.send(eventList.SAVE_WORD_BEFORE_EXIT, "");
      },
    },
  ]);
  tray.setToolTip("wordkit");
  tray.setContextMenu(contextMenu);
  tray.on("double-click", createDashboardWindow);
});

//开机自动启动
app.setLoginItemSettings({
  openAtLogin: true,
  path: app.getPath("exe"),
});

//word列表保存成功，关闭程序
ipcMain.on(eventList.SAVE_WORD_DONE, (event, msg) => {
  app.quit();
});

//负责不同子进程之间的通信中转
ipcMain.on("msgBetweenRender", (event, msg) => {
  const {EVENT_TYPE, MSG} = msg;
  if (EVENT_TYPE === eventList.RUNTIME_ERROR) {
    console.error(...msg);
    app.exit();
  } else {
    mainWindow.webContents.send(EVENT_TYPE, MSG);
  }
});

//发送桌面通知
ipcMain.on(eventList.SEND_NOTIFICATION, (event, msg) => {
  if (Notification.isSupported) {
    let notification = new Notification({
      title: "铭", // 通知的标题, 将在通知窗口的顶部显示
      body: msg, // 通知的正文文本, 将显示在标题或副标题下面
      icon: LOGO, // 用于在该通知上显示的图标
      silent: true, // 在显示通知时是否发出系统提示音
    });
    notification.show();
  } else {
    console.log("dont support this sytem ");
  }
});