import React from 'react';
import ReactDOM from 'react-dom';
import { history } from './helpers';
import { Provider } from 'react-redux';
import { ProtectedRoute, AuthRoute, OnlyNotAuthRoute } from './utils/route';
import App from './components/app';
import Captcha from './components/captcha';
import Profile from './components/profile';
import TwoFactor from './components/twofactor';
import configureStore from './redux/store';
import * as serviceWorker from './serviceWorker';
import {
  Router,
  Route
} from "react-router-dom";

import './index.css';
import 'bootstrap/dist/css/bootstrap.min.css';

ReactDOM.render(
  <Provider store={configureStore({})}>
    <Router history={history}>
      {/* <Switch> */}
        <OnlyNotAuthRoute path='/' component={App} />
          {/* <App />
        </OnlyNotAuthRoute> */}
        <ProtectedRoute path='/captcha' component={Captcha} />
          {/* <Captcha />
        </ProtectedRoute> */}
        <AuthRoute path='/profile' component={Profile} />
          {/* <Profile />
        </ProtectedRoute> */}
        <ProtectedRoute path='/twofactor' component={TwoFactor} />
          {/* <TwoFactor />
        </AuthRoute> */}
      {/* </Switch> */}
      <Route exact path='/test'>
        <Captcha />
      </Route>
    </Router>
  </Provider>,
  document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
