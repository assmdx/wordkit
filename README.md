# wordkit

随机在屏幕上打一行字的程序

[![Depfu](https://img.shields.io/badge/npm-v8.11.2-green.svg)](https://github.com/assmdx/wordkit)

# 目录结构

```
./
├── icon.ico          //图标
├── index.html        //程序主界面
├── index.js          //控制显示word的js
├── addWord.html      //添加句子界面
├── addWord.js        //控制添加句子的js
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
    npm i

## 开发，调试

    npm start

## 打包

    npm build

