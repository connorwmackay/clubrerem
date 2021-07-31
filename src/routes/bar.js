const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
  if (req.session.userId) {
    res.render('bar', {page_title: 'lub ReRem - Virtual Ba', page_head: 'Virtual Bar', loggedIn: true, username: req.session.userId});
  } else {
    res.render('bar', {page_title: 'lub ReRem - Virtual Ba', page_head: 'Virtual Bar', loggedIn: false});
  }
});

module.exports = router;