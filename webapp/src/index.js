import React from 'react';
import ReactDOM from 'react-dom';
import { createBrowserHistory } from 'history';
import { Router, Route, Switch } from 'react-router-dom';
import './index.css';
// import App from './App';
import registerServiceWorker from './registerServiceWorker';

// ReactDOM.render(<App />, document.getElementById('root'));
// import 'assets/css/material-dashboard-react.css?v=1.3.0';
import './resources/assets/css/material-dashboard-react.css';

import indexRoutes from './resources/routes';

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
