import Axios from 'axios';
import { SESSION_ENDPOINT } from '../utils/constants';

export const checkSessionInfo = async () => {
    const response = await Axios.get(SESSION_ENDPOINT, { withCredentials: true });
    const isLoggedIn = response.data.session.userPresent;

    // login to ensure third party session
    // const { statusText } = await loginService.login(email, '', '');
    // if (isLoggedIn && statusText === "OK") {

    let preloadedState = {};
    if (isLoggedIn) {
        const {
            email, userPresent
        } = response.data.session;
        preloadedState = {
            user: {
                userPresent,
                email
            }
        }
    }
    
    return preloadedState;
}