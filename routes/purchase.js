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
    } catch (e) {
        console.log(e);
        res.status(400).json({ message: "Purchase Failed" });
    }
});

router.get('/api/purchase/all', async (req, res) => {
    console.log('/api/purchase/all was called');
    const db = req.app.db;
    const sessionsList = await db.collection('sessions').find({}).toArray();
    if (sessionsList.length && sessionsList.length > 0) {
        for (let sessionItem of sessionsList) {
            if (sessionItem.session.cookieJar && sessionItem.session.email) {
                const { email } = sessionItem.session;
                const { _id } = sessionItem;
                const cookie = new tough.CookieJar(new MongoSessionCookieStore(db, _id));

                const requestClient = got.extend({
                    cookieJar: cookie,
                    responseType: 'json',
                });

                const login = new Login(requestClient);
                const freegames = new FreeGames(requestClient, email);
                const purchase = new Purchase(requestClient, email);
                try {
                    console.log('purchase for', email);
                    await login.fullLogin(email, "", "", "");
                    const offers = await freegames.getAllFreeGames();
                    await purchase.purchaseGames(offers);
                } catch (e) {
                    console.log(colors.red('purchase failed'));
                    console.log(e);
                }
            }
        }
    }
});

module.exports = router;