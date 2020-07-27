const express = require('express');
const crypto = require('../lib/encrypt');
const Login = require('../lib/login');
const { Db } = require('mongodb');
const router = express.Router();
const { newCookieJar, deleteCookies } = require('../common/request');

router.post('/api/login', async (req, res) => {
    const { email, password, captcha } = req.body;

    /** @type {Db} */
    const db = req.app.db;
    var captchaValue = captcha;
    if (!req.body.captcha) {
        captchaValue = "";
    }

    const requestClient = newCookieJar(req);
    const login = new Login(requestClient, res);
    try {
        const { statusText, status } = await login.fullLogin(email, password, captchaValue);

        req.session.email = email;
        req.session.userPresent = true;

        const user = await db.collection('users').findOne({ email: email });
        if (!user) {
            try {
                await db.collection('users').insertOne({ email: email, password: crypto.encrypt(password) });

                req.session.email = email;
                req.session.userPresent = true;

                res.status(200).json({});
                return;
            } catch (e) {
                console.log(e);
                res.status(400).json({
                    errorCode: "errors.com.epicgames.account.invalid_account_credentials",
                    message: "Sorry the credentials you are using are invalid."
                });
                return;
            }
        } else {
            if (crypto.decrypt(user.password) === password) {
                req.session.email = email;
                req.session.userPresent = true;

                res.status(200).json({ statusText, status, message: 'Successfully logged in' });
                return;
            } else {
                console.log(e);
                res.status(400).json({
                    errorCode: "errors.com.epicgames.account.invalid_account_credentials",
                    message: 'Access denied. Check password and try again.'
                });
                return;
            }
        }
        // res.status(200).json({ statusText, status, message: 'Successfully logged in' });
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
                deleteCookies(req);
            }
        } else {
            deleteCookies(req);
        }
        res.status(400).json(e);
    }
});

router.post('/api/login/mfa', async (req, res) => {
    const { code, method, email } = req.body;
    const db = req.app.db;

    const requestClient = newCookieJar(req);
    const login = new Login(requestClient, res);

    try {
        const { statusText, status } = await login.loginMFA(code, method, email);
        
        req.session.email = email;
        req.session.userPresent = true;

        res.status(200).json({ statusText, status });
    } catch (e) {
        deleteCookies(req);
        res.status(400).json(e);
    }
});


router.post('/api/profile', async (req, res) => {
    const { email } = req.body;
    const db = req.app.db;
    const requestClient = newCookieJar(req);
    const profile = new Login(requestClient);
    try {
        const { body } = await profile.getProfile();
        res.status(200).json(body);
    } catch (e) {
        res.status(400).json(e);
    }
});

module.exports = router;