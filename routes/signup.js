const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
  res.render('room', {page_title: 'Club ReRem - Sign Up', page_head: 'Sign Up'});
});

module.exports = router;