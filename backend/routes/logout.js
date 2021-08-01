const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
    if (req.session.userId) {
        req.session.regenerate();

        res.status(201);
        res.send({"isLogoutSuccessful": true});
    }

    res.status(500);
    res.send({"isLogoutSuccessful": false});
});

module.exports = router;