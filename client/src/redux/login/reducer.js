import {
    LOGIN
} from './actionType';

const initialState = {
    userPresent: false
}

export default function (state = initialState, action) {
    switch (action.type) {
        case LOGIN:
            return {
                userPresent: true, email: action.email
            }
        default:
            return state;
    }
}