import React from 'react';
import { InputNumber ,Tag  } from 'antd';
import  "./dashboard.css";

const {Fragment} = React;




export default class Dashboard extends React.Component {
    constructor(props) {
        super(props)
        this.state={
            test:"Right"
        }
    }
    onChange = (number) =>{
        try {
            console.log(window)
            const {ipcRenderer} = window.require('electron');
            console.log(ipcRenderer)
        } catch (e) {
            console.log(e)
            this.setState({test:"error"})
        }

        //ipcRenderer.send('change word size', number)
    }

    render() {
        return (
            <div className="container">
                <Fragment>
                    <div>
                        <Tag>{`字体${this.state.test || 1}`}</Tag>

                        <InputNumber min={1} max={50} defaultValue={14} onChange={this.onChange} />
                    </div>
                </Fragment>

            </div>

        )
    }

}


