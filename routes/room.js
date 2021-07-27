const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
  res.render('room', {page_title: 'Club ReRem - Room #XYZ', page_head: 'Private Room #XYZ'});
});

module.exports = router;