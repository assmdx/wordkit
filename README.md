# 铭

你是否有一些让自己刻骨铭心或者有趣的话，想提醒自己时刻不要忘记，把它记录在'铭'上吧, '铭'会提醒你不要忘记.

# 安装

[下载地址](https://github.com/assmdx/wordkit/releases)

# 目录结构

```
├── src
│   ├── assets
│   │   ├── css
│   │   │   ├── **/*.css
│   │   ├── js
│   │   │   ├── **/*.js
│   │   ├── img
│   │   │   └── **/*.png
│   ├── config
│   │   └── index.js
│   ├── datastore
│   │   └── word.json
│   ├── main
│   │   └── main.js
│   ├── renderer
│   │   ├── dashboard
│   │   │   ├── dashboard.html
│   │   │   └── dashboard.js
│   │   ├── index
│   │   │   ├── index.html
│   │   │   └── index.js
│   ├── utils
│   │   └── index.js
├── dist
├── resources
├── policy
│   └── index.html
├── .gitconfig
├── .gitignore
├── README.md
├── package.json
└── LICENSE
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
- [x] 代码重构优化
- [x] 加埋点(采用阿里云 mpaas)
- [x] 添加 mac 支持
- [x] 添加 linux 支持
- [x] 发版
- [x] 官网
- [ ] words view
  - [ ] 重构成react
  - [ ] 是否开启通知的按钮
  - [ ] 界面美化
  - [ ] 删除交互
  - [ ] 数据存储转为本地数据
- [ ] word mind
  - [ ] 应用内模型搭建
  - [ ] behavior data 的设计
- [ ] community data
  - [ ] 数据交换与分发
- [ ] community view 搭建
