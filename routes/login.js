const express = require('express');
const Login = require('../lib/login');
const router = express.Router();
const { newCookieJar, deleteCookies } = require('../common/request');

router.post('/api/login', async (req, res) => {
    const { email, password, captcha } = req.body;
    // console.log(req.app.db.users)

    const db = req.app.db
    var captchaValue = captcha;
    if (!req.body.captcha) {
        captchaValue = "";
    }


    const requestClient = newCookieJar(email);
    const login = new Login(requestClient, res);
    try {
        const { statusText, status } = await login.fullLogin(email, password, captchaValue);

        req.session.email = email;
        req.session.userPresent = true;

        res.status(200).json({ statusText, status });
    } catch (e) {
        if (e.errorCode) {
            if (e.errorCode.includes('session_invalidated')) {

            } else if (
                e.errorCode === 'errors.com.epicgames.accountportal.captcha_invalid'
            ) {

            } else if (
                e.errorCode ===
                'errors.com.epicgames.common.two_factor_authentication.required'
            ) {

            } else {
                // deleteCookies(email);
            }
        } else {
            // deleteCookies(email);
        }
        res.status(400).json(e);
    }
});

router.post('/api/login/mfa', async (req, res) => {
    const { code, method, email } = req.body;

    const requestClient = newCookieJar(email);
    const login = new Login(requestClient, res);

    try {
        const { statusText, status } = await login.loginMFA(code, method, email);
        // await login.login(email, "", "");
        req.session.email = email;
        req.session.userPresent = true;

        res.status(200).json({ statusText, status });
    } catch (e) {
        deleteCookies(email);
        res.status(400).json(e);
    }
});


router.post('/api/profile', async (req, res) => {
    const { email } = req.body;
    const requestClient = newCookieJar(email);
    const profile = new Login(requestClient, res);
    try {
        const { body } = await profile.getProfile();
        console.log(body);
        res.status(200).json(body);
    } catch (e) {
        res.status(400).json(e);
    }
});

module.exports = router;