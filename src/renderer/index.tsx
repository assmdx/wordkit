// Initial welcome page. Delete the following line to remove it.
import React from 'react';
import ReactDOM from 'react-dom';
import { AppContainer } from 'react-hot-loader';
import 'reset-css';

import Dashboard from './dashboard';

ReactDOM.render(
    <AppContainer>
        <Dashboard></Dashboard>
    </AppContainer>,
    document.getElementById('app'),
);
