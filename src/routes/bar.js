const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
  if (req.session.userId) {
    res.render('bar', {page_title: 'Club ReRem - Virtual Bar', page_head: 'Virtual Bar', loggedIn: true, username: req.session.userId});
  } else {
    res.redirect('/login');
  }
});

module.exports = router;