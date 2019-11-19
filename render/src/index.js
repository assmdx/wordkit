import React from 'react'
import ReactDom from 'react-dom'
import {createStore,applyMiddleware,compose} from 'redux'
import thunk from 'redux-thunk'
import {Provider} from 'react-redux'
import {BrowserRouter,Route,Switch} from 'react-router-dom'
import 'antd/dist/antd.css';

import reducers from './redux/reducer'
import Home from "./container/home/home";
import Dashboard from "./container/dashboard/dashboard"


const store = createStore(reducers,compose(applyMiddleware(thunk),
    window.devToolsExtension?window.devToolsExtension() : f => f
))

ReactDom.render(
    (
        <Provider store={store}>
            <BrowserRouter>
                <div>
                    <Switch>
                        <Route path="/home" component={Home}></Route>
                        <Route path="/dashboard" component={Dashboard}></Route>
                    </Switch>
                </div>
            </BrowserRouter>
        </Provider>
    ),
    document.getElementById('root')
)
