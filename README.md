# 铭（wordkit）

你是否有一些让自己刻骨铭心的话，想提醒自己时刻不要忘记，把它记录在'铭'上吧, '铭'会把这些显示在桌面上时刻提醒你.

# 安装

[下载地址](https://github.com/assmdx/wordkit/releases)

# 目录结构

```
./
├── icon.ico          //图标
├── index.html        //程序主界面
├── index.js          //控制显示word的js
├── dashboard.html    //仪表盘界面
├── config.js         //进程间传递消息的配置文件
├── util.js           //工具函数
├── LICENSE           // 发布协议
├── main.js           // electron控制程序界面显示的js
├── package.json      //依赖信息
├── README.md         //描述文档
└── word.json         //存word的文件
```

# 运行

## 克隆代码,安装依赖

    git clone https://github.com/assmdx/wordkit
    npm i --no-package-lock

## 开发，调试

    npm run start

## 打包

    npm i -g electron-builder@20.27.1
    npm run build

## 反馈

[反馈地址](https://github.com/assmdx/wordkit/issues)

## TODO

- [x] 加上发通知
- [x] 去掉桌面显示 word
- [x] 去掉快捷键添加词
- [ ] 代码重构优化
- [ ] 仪表盘页面美化
- [ ] 添加 linux，mac 支持
- [ ] 发版
- [ ] 官网
