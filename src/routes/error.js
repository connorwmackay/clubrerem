const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
    res.render('error', {page_title: 'Club ReRem - Server Error', page_head: 'Server Error'});
});

module.exports = router;