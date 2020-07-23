import React from 'react';
import ReactDOM from 'react-dom';
import { history } from './helpers';
import { Provider } from 'react-redux';
import { Protected, Auth, OnlyNotAuth } from './utils/route';
import { checkSessionInfo } from './utils/session';
import App from './components/app';
import Captcha from './components/captcha';
import Profile from './components/profile';
import TwoFactor from './components/twofactor';
import NotFound from './components/notfound';
import configureStore from './redux/store';
import * as serviceWorker from './serviceWorker';
import {
  Router,
  Switch,
  Route,
  Redirect
} from "react-router-dom";

import './index.css';
import 'bootstrap/dist/css/bootstrap.min.css';

const renderApp = preloadedState => {
  const store = configureStore(preloadedState);
  ReactDOM.render(
    <Provider store={store}>
      <Router history={history}>
        <Switch>
          <Route
            exact path='/'
            component={OnlyNotAuth(App)}
          />
          <Route
            path='/captcha'
            component={Protected(Captcha)}
          />
          <Route
            path='/twofactor'
            component={Protected(TwoFactor)}
          />
          <Route
            path='/profile'
            component={Auth(Profile)}
          />
          <Route
            path='/404'
            component={NotFound}
          />
          <Redirect from='*' to='/404' />
        </Switch>
      </Router>
    </Provider>,
    document.getElementById('root')
  );
}

(async () => renderApp(await checkSessionInfo()))();

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
