'use strict';

import { app, Menu, BrowserWindow, screen, Tray, ipcMain, Notification } from 'electron';
import path from 'path';
const { resolve } = path;
import electronIsDev from 'electron-is-dev';
import { format as formatUrl } from 'url';

import { eventList } from '../config';
import { ployfill } from './ployfill.mac';
import { get, flush } from '../datastore/db';
import { DashboardState } from '../types/dashboard';

const LOGO = resolve(__dirname, '../icon/logo_2.png');
const macLOGO = resolve(__dirname, '../icon/icon.mac.top.18x18.png');
const devURL = 'http://localhost:2333';

let mainWindow: BrowserWindow;
let dashboardWindow: BrowserWindow;
let tray: Tray;
const isDebug = process.env.NODE_ENV !== 'production';
const isMac = process.platform === 'darwin';
const isWindows = process.platform === 'win32';
let wordkit: DashboardState = { words: [], timer: 3000 };
let notifyTimer: NodeJS.Timeout;

// 创建仪表盘函数
function createDashboardWindow() {
    if (dashboardWindow && !dashboardWindow.isDestroyed()) {
        dashboardWindow.close();
    }
    dashboardWindow = new BrowserWindow({
        webPreferences: {
            nodeIntegration: true,
        },
        icon: LOGO,
        x: screen.getPrimaryDisplay().workAreaSize.width - 350,
        y: 50,
        width: 300,
        height: 800,
        alwaysOnTop: false,
        frame: true,
        transparent: false,
        resizable: false,
        movable: true,
        closable: false,
        show: false,
        minimizable: true,
        maximizable: false,
        autoHideMenuBar: true,
    });
    dashboardWindow.once('ready-to-show', () => {
        dashboardWindow.show();
    });
    isDebug && dashboardWindow.webContents && dashboardWindow.webContents.openDevTools();
    dashboardWindow.setIgnoreMouseEvents(false);
    if (isDebug) {
        dashboardWindow.loadURL(devURL);
    } else {
        dashboardWindow.loadURL(
            formatUrl({
                pathname: path.join(__dirname, './index.html'),
                protocol: 'file',
                slashes: true,
            }),
        );
    }
    // dashboardWindow.loadFile(resolve(__dirname, "../renderer/dashboard/dashboard.html"));
    // dashboardWindow.addListener("closeThisWindow", dashboardWindow.close);
    mainWindow = dashboardWindow;
    if (isMac) {
        ployfill();
    }
}

function initWordkitDb() {
    wordkit = get() as DashboardState;
}

//发送桌面通知
function sendNotifyMsg() {
    if (Notification.isSupported()) {
        const index = Math.floor(Math.random() * wordkit.words.length);
        if (wordkit.words.length === 0) {
            return;
        }
        const msg = wordkit.words[index];
        const notification = new Notification({
            title: '铭', // 通知的标题, 将在通知窗口的顶部显示
            body: msg, // 通知的正文文本, 将显示在标题或副标题下面
            icon: LOGO, // 用于在该通知上显示的图标
            silent: true, // 在显示通知时是否发出系统提示音
        });
        notification.show();
    } else {
        console.log('dont support this sytem ');
    }
}

function startNotify() {
    clearInterval(notifyTimer);
    notifyTimer = setInterval(sendNotifyMsg, wordkit.timer * 1000);
}

app.on('ready', function() {
    if (isWindows) {
        app.setAppUserModelId(app.getName());
    }

    // read wordkit data
    initWordkitDb();

    createDashboardWindow();

    startNotify();

    // 右下角菜单
    const trayLogo = isMac ? macLOGO : LOGO;
    tray = new Tray(trayLogo);
    const contextMenu = Menu.buildFromTemplate([
        {
            label: '仪表盘',
            click: createDashboardWindow,
        },
        {
            label: '退出',
            click: function() {
                flush(wordkit);
                setTimeout(app.exit, 50);
            },
        },
    ]);
    tray.setToolTip('wordkit');
    tray.setContextMenu(contextMenu);
    tray.on('double-click', createDashboardWindow);
});

//开机自动启动
app.setLoginItemSettings({
    openAtLogin: true,
    path: app.getPath('exe'),
});

// 负责接收渲染进程传给主进程的数据
ipcMain.on(eventList.UPDATE_WORDKIT, (event, newWordkit) => {
    wordkit = { ...newWordkit };
    startNotify();
});

// 负责传给渲染进程wordkit数据
ipcMain.on(eventList.GET_WORDKIT, event => {
    event.returnValue = wordkit;
});
