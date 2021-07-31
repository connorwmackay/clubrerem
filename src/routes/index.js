const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
  if (req.session.userId) {
    res.render('index', {page_title: 'Club ReRem', page_head: 'Club ReRem', loggedIn: true, username: req.session.userId});
  } else {
    res.render('index', {page_title: 'Club ReRem', page_head: 'Club ReRem', loggedIn: false});
  }
});

module.exports = router;