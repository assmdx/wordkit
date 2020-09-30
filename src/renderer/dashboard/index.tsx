import React, { Component } from 'react';
import { ipcRenderer } from 'electron';

import { DashboardState } from '../../types/dashboard';
import { eventList } from '../../config';
import './index.less';

export default class Dashboard extends Component<{}, DashboardState> {
    lastClickForDelWord: number;
    lastClickKeyForDelWord: number;
    inputRef: any = React.createRef();
    constructor(props: any) {
        super(props);
        this.state = {
            words: [],
            timer: 3000,
        };

        this.lastClickForDelWord = -1;
        this.lastClickKeyForDelWord = -1;

        this.timerChange = this.timerChange.bind(this);
        this.changeWord = this.changeWord.bind(this);
        this.delWord = this.delWord.bind(this);
        this.addWord = this.addWord.bind(this);
        this.enterWord = this.enterWord.bind(this);
        this.notifyMainProcess = this.notifyMainProcess.bind(this);
    }

    componentDidMount() {
        // 加载数据
        const wordKitFromMain: DashboardState = ipcRenderer.sendSync(eventList.GET_WORDKIT);
        this.setState({ ...wordKitFromMain });
    }

    timerChange(e: React.ChangeEvent<HTMLInputElement>): void {
        const newTimer = e.target.value;
        this.setState(
            {
                timer: isNaN(+newTimer) ? this.state.timer : parseInt(newTimer),
            },
            this.notifyMainProcess,
        );
    }

    changeWord(e: React.FocusEvent<HTMLTextAreaElement>, i: number): void {
        this.setState(
            {
                words: this.state.words.map((v, j) => {
                    if (j === i) {
                        return e.target.value.split('\n').join('');
                    } else {
                        return v;
                    }
                }),
            },
            this.notifyMainProcess,
        );
    }

    enterWord(e: React.KeyboardEvent<HTMLInputElement>): void {
        const target = e.target as HTMLTextAreaElement;
        const newWord = target.value;
        if (e.keyCode === 13 && this.state.words.every(word => word !== newWord)) {
            this.setState(
                {
                    words: [newWord].concat(this.state.words.filter(v => v !== newWord)),
                },
                () => {
                    this.inputRef.current.value = '';
                    this.notifyMainProcess();
                },
            );
        }
    }

    addWord(e: React.ChangeEvent<HTMLInputElement>): void {
        if (e.target.value) {
            this.setState(
                {
                    words: this.state.words.concat([e.target.value]),
                },
                this.notifyMainProcess,
            );
        }
    }

    delWord(i: number, date: Date): void {
        const lt: number = this.lastClickForDelWord;
        const dt: number = +date;

        if (lt === -1 || this.lastClickKeyForDelWord === -1) {
            this.lastClickForDelWord = +date;
            this.lastClickKeyForDelWord = i;
            return;
        } else if (dt - lt >= 1000 || this.lastClickKeyForDelWord !== i) {
            this.lastClickForDelWord = -1;
            this.lastClickKeyForDelWord = -1;
            return;
        }
        this.setState(
            {
                words: this.state.words.filter((v, j) => j !== i),
            },
            this.notifyMainProcess,
        );
    }

    notifyMainProcess(): void {
        // 通知主进程更新words和timer
        ipcRenderer.send(eventList.UPDATE_WORDKIT, this.state);
    }

    render(): JSX.Element | null | false {
        const words: Array<string> = this.state.words;
        const timer: number = this.state.timer;

        return (
            <div className="dashboard-container">
                <div className="notify-timer-container">
                    <input type="number" value={timer} onChange={this.timerChange} />
                    <input
                        ref={this.inputRef}
                        className="word-add-input"
                        placeholder="添加一句难忘的话"
                        onKeyUp={e => this.enterWord(e)}
                    />
                </div>
                <div className="word-container">
                    <div className="word-list-container">
                        {words.map((word, i) => {
                            const word_ = `\n\n\n\n\n${word}`;
                            return (
                                <div key={`${word}-${i}`} onClick={e => this.delWord(i, new Date())}>
                                    <textarea
                                        className="word"
                                        rows={8}
                                        defaultValue={word_}
                                        onBlur={e => this.changeWord(e, i)}
                                    />
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        );
    }
}
