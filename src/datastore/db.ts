import fs from 'fs';
import path from 'path';
import { ipcRenderer } from 'electron';

import { eventList, ERROR_TYPE } from '../config';
import { DashboardState } from '../types/dashboard';
import electronIsDev from 'electron-is-dev';

let wordkitFilePath: string;
if (electronIsDev) {
    wordkitFilePath = path.join(__dirname, '../datastore/word.json');
} else {
    wordkitFilePath = path.join(__dirname, '../datastore/word.json');
}

function sendMsgBetweenRender(EVENT_TYPE: string, MSG: any) {
    ipcRenderer.send('msgBetweenRender', {
        EVENT_TYPE,
        MSG,
    });
}

export const get = (key: 'words' | 'timer' | void): Array<string> | DashboardState | number | null => {
    let wordkit: DashboardState;
    if (fs.existsSync(wordkitFilePath)) {
        try {
            const wordkitStr = fs.readFileSync(wordkitFilePath);
            wordkit = JSON.parse(wordkitStr.toString());
        } catch (err) {
            // 读取文件失败，报错，程序退出
            sendMsgBetweenRender(eventList.RUNTIME_ERROR, {
                type: ERROR_TYPE.READFILE,
                err,
            });
            // 这里直接return undefined
            return null;
        }
    } else {
        console.log('file not exists');
        // 没有数据的话，就初始化一个
        wordkit = { words: [], timer: 30 };
    }

    if (key) {
        return wordkit[key];
    } else {
        return wordkit;
    }
};

// export const set = (key: 'words' | 'timer', value: string[]| number): void => {
//   const wordkitStr:string = store.getItem('wordkit') || '';
//   let wordkit = store.getItem('wordkit') ? JSON.parse(wordkitStr) : {words: [], timer: 30};
//   if (key) {
//     wordkit[key] = value;
//   } else {
//     wordkit = value
//   }
//   store.setItem('wordkit', JSON.stringify(wordkit))
// }

// 将wordkit刷到磁盘上
export const flush = (wordkit: DashboardState): void => {
    const d = wordkit || get();

    console.log('d', d);
    if (d) {
        fs.writeFileSync(wordkitFilePath, JSON.stringify(d));
    }
};
