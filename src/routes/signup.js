const express = require('express');
const router = express.Router();

const { hashPassword, isPasswordCorrect, hashDivider } = require('../scripts/password');
const db = require('../models/index');
const session = require('express-session');

router.get('/', (req, res) => {
    if (!req.session.userId) {
        res.render('signup', {page_title: 'Club ReRem - Sign Up', page_head: 'Sign Up'});
    } else {
        res.redirect('/');
    }  
});

router.post('/', (req, res) => {
  if (!req.session.userId) {  
        const username  = req.body.username;
        const email = req.body.email_addr;
        const password = req.body.password;

        if (username != null && email != null && password != null) {
            const hashArray = hashPassword(password);
            const passwordSalt = hashArray[0] + hashDivider + hashArray[1];

            const newUser = (async() => { 
                try {
                    await db.User.create({username: username, email: email, password_hash: passwordSalt});
                } catch(err) {
                    console.log("Could not create user: ", err);
                    res.status(500);
                    res.redirect('/error');
                }
            })().then((user) => {
                req.session.userId = username;
                req.session.save();
                console.log("Session User ID: ", req.session.userId);
                res.status(201);
                res.redirect('/');
            });
        } else {
            res.status(500);
            res.redirect('/error');
        }
  } else {
    res.status(201);
    res.redirect('/');
  }
});

module.exports = router;
