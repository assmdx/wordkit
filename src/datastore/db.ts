import { DashboardState } from '../types/dashboard';
import Store from 'electron-store';
const store = new Store();

export const get = (key: 'words' | 'timer' | void): Array<string> | DashboardState | number | null => {
    let wordkit: DashboardState;
    if (store.has('wordkit')) {
        wordkit = JSON.parse(store.get('wordkit') as string);
    } else {
        wordkit = { words: [], timer: 3000 };
        store.set('wordkit', JSON.stringify(wordkit));
    }
    return wordkit;
};

// 将wordkit刷到磁盘上
export const flush = (wordkit: DashboardState): void => {
    let d = wordkit;
    if (!wordkit) {
        d = get();
    }
    store.set('wordkit', JSON.stringify(d));
};
