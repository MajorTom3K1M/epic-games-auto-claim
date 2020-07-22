const cookieParser = require('set-cookie-parser');
const {
    CSRF_ENDPOINT,
    LOGIN_ENDPOINT,
    EPIC_CLIENT_ID,
    REDIRECT_ENDPOINT,
    REPUTATION_ENDPOINT,
    STORE_HOMEPAGE,
    MFA_LOGIN_ENDPOINT,
    USER_INFO_ENDPOINT,
    SET_SID_ENDPOINT
} = require('../common/constants');

class Login {
    constructor(requestClient) {
        this.request = requestClient;
    }

    getCsrf = async () => {
        const csrfResp = await this.request.get(CSRF_ENDPOINT);
        const cookies = cookieParser(csrfResp.headers['set-cookie'], { map: true });
        return cookies['XSRF-TOKEN'].value;
    }

    getReputation = async () => {
        await this.request.get(REPUTATION_ENDPOINT);
    }

    getStoreToken = async () => {
        const resp = await this.request.get(STORE_HOMEPAGE, { responseType: 'text' });
    }

    refreshAndSid = async (error) => {
        const csrfToken = await this.getCsrf();
        const redirectSearchParams = { clientId: EPIC_CLIENT_ID, redirectUrl: STORE_HOMEPAGE };
        const redirectResp = await this.request.get(REDIRECT_ENDPOINT, {
            headers: {
                'x-xsrf-token': csrfToken,
            },
            searchParams: redirectSearchParams,
        });
        const { sid } = redirectResp.body;
        if (!sid) {
            if (error) throw new Error('Sid returned null');
            return false;
        }
        const sidSearchParams = { sid };
        const sidResp = await this.request.get(SET_SID_ENDPOINT, { searchParams: sidSearchParams });
        await this.getStoreToken();
        return true;
    }

    loginMFA = async (code, method, email) => {
        const csrfToken = await this.getCsrf();
        const mfaRequest = {
            code: code,
            method: method,
            rememberDevice: true
        }
        try {
            const reponseMFA = await this.request.post(MFA_LOGIN_ENDPOINT, {
                json: mfaRequest,
                headers: {
                    'x-xsrf-token': csrfToken,
                },
            });
            return reponseMFA;
        } catch (e) {
            console.log(e.response.body);
            throw e.response.body
        }
    }

    login = async (email, password, captcha, totp = '', attempt = 0) => {
        const csrfToken = await this.getCsrf();
        if (attempt > 5) {
            throw new Error('Too many login attempts');
        }
        console.log("IN LOGIN", captcha);
        const loginBody = {
            password,
            rememberMe: true,
            captcha,
            email,
        };
        try {
            const responseLogin = await this.request.post(LOGIN_ENDPOINT, {
                json: loginBody,
                headers: {
                    'x-xsrf-token': csrfToken,
                },
            });
            // const cookies = cookieParser(responseLogin.headers['set-cookie'], { map: true });
            // console.log(cookies)
            return responseLogin;
        } catch (e) {
            console.log(e);
            if (e.response && e.response.body && e.response.body.errorCode) {
                if (e.response.body.errorCode.includes('session_invalidated')) {
                    console.log("Session Invalidated");
                    return await this.login(email, password, captcha, totp, attempt + 1);
                    // throw e;
                } else if (
                    e.response.body.errorCode === 'errors.com.epicgames.accountportal.captcha_invalid'
                ) {
                    console.log("Captcha");
                    throw e.response.body;
                } else if (
                    e.response.body.errorCode ===
                    'errors.com.epicgames.common.two_factor_authentication.required'
                ) {
                    console.log("Two Factor");
                    throw e.response.body;
                } else {
                    throw e.response.body;
                }
            } else {
                throw e;
            }
        }
    }

    fullLogin = async (email, password, captcha, totp) => {
        if (await this.refreshAndSid(false)) {
            console.log("Successfully refreshed login");
            return { status: 200, statusText: "OK" }
        } else {
            console.log("Could not refresh credentials. Logging in fresh.");
            // console.log("IN",captcha)
            try {
                await this.getReputation();
                const response = await this.login(email, password, captcha, totp);
                await this.refreshAndSid(true);
                console.log('Successfully logged in fresh');
                return response;
            } catch (e) {
                // console.log(e);
                throw e;
            }
        }
    }

    getProfile = async () => {
        const csrfToken = await this.getCsrf();
        const responseUserInfo = await this.request.get(USER_INFO_ENDPOINT, {
            headers: {
                'x-xsrf-token': csrfToken,
            },
        });
        return responseUserInfo;
    }
}

module.exports = Login;