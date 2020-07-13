const {
  app,
  Menu,
  BrowserWindow,
  Tray,
  dialog,
  ipcMain,
  Notification,
} = require("electron");
const path = require("path");
const {
  resolve
} = path;
const {
  eventList
} = require("../config");
const LOGO = "../assets/img/logo_2.png";

// 主窗口进程
var mainWindow = null;
var dashboardWindow = null;
var screen = null;
const isDebug =
  process.argv.length > 2 && process.argv.slice(2)[0].split("=")[1] === "true";

// 打开主窗口
function createWindow() {
  let win = new BrowserWindow({
    icon: LOGO,
    width: 800,
    height: 200,
    frame: false,
    transparent: isDebug ? false : true,
    alwaysOnTop: false,
    movable: false,
  });
  //win.setIgnoreMouseEvents(isDebug ? false : true)
  !isDebug && win.setIgnoreMouseEvents(true);
  win.loadFile(resolve(__dirname, "../../index.html"));
  isDebug && win.openDevTools();
  win.isVisible() ? win.setSkipTaskbar(true) : win.setSkipTaskbar(false);
  mainWindow = win;
}

// 创建仪表盘函数
function createDashboardWindow() {
  if (dashboardWindow && !dashboardWindow.isDestroyed()) {
    dashboardWindow.close();
  }
  dashboardWindow = new BrowserWindow({
    icon: LOGO,
    x: screen.getPrimaryDisplay().workAreaSize.width - 350,
    y: 50,
    width: 300,
    height: 800,
    alwaysOnTop: false,
    frame: true,
    transparent: false,
    resizable: true,
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
  dashboardWindow.loadFile(resolve(__dirname, "../../dashboard.html"));
  dashboardWindow.addListener("closeThisWindow", () => {
    dashboardWindow.close();
  });
}

// 设置右下角的右键菜单
let tray;
app.on("ready", function () {
  screen = require("electron").screen;
  if (process.platform === "win32") {
    app.setAppUserModelId(app.getName());
  }
  createWindow();
  createDashboardWindow();
  tray = new Tray(path.join(__dirname, LOGO));

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
  const {
    EVENT_TYPE,
    MSG
  } = msg;
  mainWindow.webContents.send(EVENT_TYPE, MSG);
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