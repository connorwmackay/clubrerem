const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
  if (req.session.userId) {
    res.redirect('/room/create');
  } else {
    res.redirect('/login');
  }
});

router.get('/create', (req, res) => {
  if (req.session.userId) {
    res.render('room_create', {page_title: 'Club ReRem - Create a Room', page_head: 'Create a Room', loggedIn: true, username: req.session.userId});
  } else {
    res.redirect('/login');
  }
});

router.post('/create', (req, res) => {
  res.redirect('/room/create');
});

router.get('/:roomId', (req, res) => {
    if (req.session.userId) {
      res.render('room', {page_title: 'Club ReRem - Room ' + req.params.roomId, page_head: 'Private Room ' + req.params.roomId, loggedIn: true, username: req.session.userId});
    } else {
      res.redirect('/login');
    }
});

router.get('/:roomId/settings', (req, res) => {
  if (req.session.userId) {
    res.render('room_settings', {page_title: 'Club ReRem - Room ' + req.params.roomId, page_head: 'Private Room ' + req.params.roomId, loggedIn: true, username: req.session.userId});
  } else {
    res.redirect('/login');
  }
});

module.exports = router;