const express = require('express');
const router = express.Router();
const { hashPassword, isPasswordCorrect, hashDivider } = require('../scripts/password');
const db = require('../models/index');

router.get('/', (req, res) => {
    if (!req.session.userId) {
        res.render('login', {page_title: 'Club ReRem - Login', page_head: 'Login'});
    } else {
        res.redirect('/');
    }
});

router.post('/', (req, res) => {
    const username  = req.body.username;
    const password  = req.body.password;

    if (username != null && password != null) {
        if (!req.session.userId) {
            const user = (async() => {return await db.User.findOne({
                where: {
                username: username
                }
            });})().then(user => {
                const hashSplit = user.dataValues.password_hash.split(hashDivider);
                const salt = hashSplit[1];

                if (isPasswordCorrect(password, hashSplit[0], salt)) {
                    req.session.userId = username;
                    req.session.save();
                    console.log("Session User ID: ", req.session.userId);

                    res.status(201);
                    res.redirect('/');
                } else {
                    res.status(500);
                    res.redirect('/error');
                }
            }).catch((err) => {
                console.log(err);
                res.status(500);
                res.redirect('/error');
            });
        } else {
            res.status(201);
            res.redirect('/');
        }
    } else {
        res.status(500);
        res.redirect('/error');
    }
});

module.exports = router;