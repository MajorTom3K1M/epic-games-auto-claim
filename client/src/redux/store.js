import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import rootReducer from './reducer';

export default initialState => (
    createStore(
        rootReducer,
        initialState,
        applyMiddleware(thunk)
    )
);