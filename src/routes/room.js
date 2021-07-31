const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
    if (req.session.userId) {
      res.render('room', {page_title: 'Club ReRem - Room #XYZ', page_head: 'Private Room #XYZ', loggedIn: true, username: req.session.userId});
    } else {
      res.render('room', {page_title: 'Club ReRem - Room #XYZ', page_head: 'Private Room #XYZ', loggedIn: false});
    }
});

module.exports = router;