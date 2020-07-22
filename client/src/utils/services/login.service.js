// import cookieParser from 'set-cookie-parser'
import Axios from 'axios';
import {
    LOGIN_ENDPOINT,
    LOGIN_MFA_ENDPOINT,
    USER_INFO
} from '../constants';

export const loginService = {
    login,
    loginMfa,
    getProfile
}

function login(email, password, captcha = "") {
    const requestOption = {
        method: 'POST',
        url: LOGIN_ENDPOINT,
        data: {
            email,
            password,
            captcha
        }
    };
    return Axios(requestOption)
        .then(handleLoginResponse)
        .catch(handleError);
}

function loginMfa(email, code, method) {
    const requestOption = {
        method: 'POST',
        url: LOGIN_MFA_ENDPOINT,
        data: {
            email,
            code,
            method
        }
    }
    return Axios(requestOption)
        .then(handleLoginResponse)
        .catch(handleError);
}

function getProfile(email) {
    const requestOption = {
        method: 'POST',
        url: USER_INFO,
        data: {
            email
        }
    };
    return Axios(requestOption)
        .then(handleDataResponse)
        .catch(handleError);
}

function handleLoginResponse(response) {
    return response;
}

function handleDataResponse(response) {
    const { data } = response;
    return data;
}

function handleError(error) {
    // const { data } = error.response;
    // const err = (data && data.message) || error.response.statusText;
    throw error;
}