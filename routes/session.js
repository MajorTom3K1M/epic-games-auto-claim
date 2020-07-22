const express = require('express');
const router = express.Router();

router.get("/api/session", async (req, res) => {
    var session = req.session;
    res.send({ session });
});

module.exports = router;