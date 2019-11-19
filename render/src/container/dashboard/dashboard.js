import { InputNumber ,Tag  } from 'antd';
import React from 'react';
import { connect} from 'react-redux'

import {changeFontSize} from "../../redux/hint.reducer";

/*
        *
        try {
            console.log(window)
            const {ipcRenderer} = window.require('electron');
            console.log(ipcRenderer)
        } catch (e) {
            console.log(e)
            this.setState({test:"error"})
        }

        //ipcRenderer.send('change word size', number)

        *
        * */
@connect(
    state=>state.hint,
    {changeFontSize}
)
class Dashboard extends React.Component {
    onChange = (number) =>{
        this.props.changeFontSize(number)

    }

    render() {
        return (
            <div className="container">
                <div>
                    <Tag>{"字体"}</Tag>
                    <InputNumber min={1} max={50} defaultValue={14} onChange={this.onChange} />
                </div>
            </div>

        )
    }

}

export default Dashboard
