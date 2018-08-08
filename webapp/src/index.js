import React from 'react';
import ReactDOM from 'react-dom';
import { createBrowserHistory } from 'history';
import { Router, Route, Switch } from 'react-router-dom';
import registerServiceWorker from './registerServiceWorker';

// import './assets/css/material-dashboard-react.css';
import './assets/scss/material-dashboard-pro-react.css';

import indexRoutes from './routes';

const hist = createBrowserHistory();

ReactDOM.render(
  <Router history={hist}>
    <Switch>
      {indexRoutes.map(prop => (<Route
        path={prop.path}
        component={prop.component}
        key={prop.path}
      />))}
    </Switch>
  </Router>,
  document.getElementById('root'),
);
registerServiceWorker();
