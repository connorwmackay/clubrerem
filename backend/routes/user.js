const express = require('express');
const router = express.Router();
const { hashPassword, isPasswordCorrect, hashDivider } = require('../scripts/password');
const db = require('../models/index');

router.post('/validate', (req, res) => {
    const username  = req.body.username;
    const password  = req.body.password;

    if (username != null && password != null) {
        db.User.findOne({
            where: {
            username: username
            }
        }).then(user => {
            if (user) {
                const hashSplit = user.dataValues.password_hash.split(hashDivider);
                const salt = hashSplit[1];

                if (isPasswordCorrect(password, hashSplit[0], salt)) {
                    res.status(201);
                    res.json({isValidLogin: true, status: "Successfully logged in as " + username});
                } else {
                    res.status(500);
                    res.send({isValidLogin: false, status: "Incorrect login details"});
                }
            } else {
                res.status(500);
                res.json({isValidLogin: false, status: "Incorrect login details"});
            }

        }).catch((err) => {
            console.log(err);
            res.status(500);
            res.json({isValidLogin: false, status: "Incorrect login details"});
        });
    } else {
        res.status(500);
        res.json({isValidLogin: false, status: "Incorrect login details"});
    }
});

router.post('/create', (req, res) => {
    const username  = req.body.username;
    const email = req.body.email_addr;
    const password = req.body.password;

    if (username != null && email != null && password != null) {
        const hashArray = hashPassword(password);
        const passwordSalt = hashArray[0] + hashDivider + hashArray[1];
        db.User.create({username: username, email: email, password_hash: passwordSalt}).then(() => {
            req.session.userId = username;
            req.session.save();

            res.status(201);
            res.json({isSuccessful: true, status: "Created new user '" + username + "'"});
        }).catch((err) =>{
            console.log("Could not create user: ", err);
            res.status(500);
            res.json({isSuccessful: false, status: "Could not create user"});
        });
      } else {
        res.status(500);
        res.json({isSuccessful: false, status: "Details not sufficient to create user"});
      }
});

router.get('/:username', (req, res) => {
    res.json({});
});

module.exports = router;