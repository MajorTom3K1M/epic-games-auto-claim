const express = require('express');
const FreeGames = require('../lib/free-games');
const Login = require('../lib/login');
const Purchase = require('../lib/purchase');
const { newCookieJar } = require('../common/request');
const router = express.Router();

router.post('/api/purchase', async (req, res) => {
    const { email } = req.body;

    const requestClient = newCookieJar(req);
    const login = new Login(requestClient);
    const freegames = new FreeGames(requestClient, email);
    const purchase = new Purchase(requestClient, email);
    try {
        await login.fullLogin(email, "", "", "");
        const offers = await freegames.getAllFreeGames();
        await purchase.purchaseGames(offers);
        res.status(200).json({ message: "Purchase Successfully" });
    } catch(e) {
        console.log(e);
        res.status(400).json({ message: "Purchase Failed" });
    }
});

router.get('/api/purchase/all', async (req, res) => {
    console.log('/api/purchase/all was called')
});

module.exports = router;