import React from 'react';
import ReactDOM from 'react-dom';
import { history } from './helpers';
import { Provider } from 'react-redux';
import { ProtectedRoute, AuthRoute, OnlyNotAuthRoute } from './utils/route';
import { checkSessionInfo } from './utils/session';
import App from './components/app';
import Captcha from './components/captcha';
import Profile from './components/profile';
import TwoFactor from './components/twofactor';
import configureStore from './redux/store';
import * as serviceWorker from './serviceWorker';
import {
  Router,
  // Switch,
  Route
} from "react-router-dom";

import './index.css';
import 'bootstrap/dist/css/bootstrap.min.css';

const renderApp = preloadedState => {
  const store = configureStore(preloadedState);
  ReactDOM.render(
    <Provider store={store}>
      <Router history={history}>
        <OnlyNotAuthRoute path='/' component={App} />
        <ProtectedRoute path='/captcha' component={Captcha} />
        <ProtectedRoute path='/twofactor' component={TwoFactor} />
        <AuthRoute path='/profile' component={Profile} />
      </Router>
    </Provider>,
    document.getElementById('root')
  );
}
{/* <Route exact path='/test'>
    <Captcha />
  </Route> */}

(async () => renderApp(await checkSessionInfo()))();

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
