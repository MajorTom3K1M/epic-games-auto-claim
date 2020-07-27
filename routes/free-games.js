const express = require("express");
const FreeGames = require('../lib/free-games');
const router = express.Router();
const { newCookieJar } = require('../common/request');

router.post('/api/freegames', async (req, res) => {
    const db = req.app.db;
    const { email } = req.body;

    const requestClient = newCookieJar(req);
    const freegames = new FreeGames(requestClient);
    try {
        const response = await freegames.getAllFreeGames();
        res.status(200).json(response);
    } catch(e) {
        console.log(e);
        res.status(400).json(e);
    }
});

module.exports = router;