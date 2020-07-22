import { combineReducers } from 'redux';
import userReducer from './login/reducer';

export default combineReducers({
    user: userReducer
});