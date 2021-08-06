const express = require('express');
const router = express.Router();
const { hashPassword, isPasswordCorrect, hashDivider, getRandomAuthKey, hashPasswordWithSalt } = require('../scripts/password');
const { isValidMember, isAuthenticatedRetUser} = require('../scripts/auth');
const db = require('../models/index');

router.post('/create', (req, res) => {
    // Check isAuthenticated
    // TODO: Write this route

    // randomly generate unique room code...
});

router.post('/:roomCode/invite', (req, res) => {
    let authKey = req.body.authKey;
    let salt = req.body.salt;
    let username = req.body.username;
    let authRet = isAuthenticatedRetUser(authKey, salt);
    let userId = null;

    let isAdmin = false;
    let isModerator = false;

    if (authRet.isAuth) {
        db.RoomMember.findOne({
            where: {
                id: authRet.userId
            }
        }).then(member => {
            if (member) {
                isAdmin = member.dataValues.is_admin;
                isModerator = member.dataValues.is_moderator;
            }
        });

        if ((isAdmin) && (isModerator)) {
            db.User.findOne({
                where: {
                    username: username
                }
            }).then(user => {
                if (user != null) {
                    userId = user.dataValues.id;
                }
            });

            db.RoomMember.create({
                user_id: userId,
                room_id: req.params.room_id,
                is_admin: false,
                is_moderator: false
            }).then(member => {
                res.json({
                    isInvited: true,
                    username: username
                });
            });

            if (userId != null) {
                res.json({
                    isInvited: false,
                    username: ""
                });
            }
        }
    } else {
        res.json({
            isInvited: false,
            username: ""
        });
    }
});

router.post(':roomCode/settings', (req, res) => {
    // Check isAuthenticated
    // TODO: Write this route
});

router.post('/:roomCode/bulletins', (req, res) => {
    // TODO: Write this route
});

router.post('/:roomCode/comments', (req, res) => {
    // TODO: Write this route
});

router.post('/:roomCode/members', (req, res) => {
    // TODO: Write this route
});

router.post('/:roomCode', (req, res) => {
    const authKey = req.body.authKey;
    const salt = req.body.salt;

    if (isValidMember(authKey, salt, req.params.roomCode)) {
        db.Room.findOne({
            where: {
                id: req.params.roomCode
            }
        }).then(room => {
            if (room) {
                res.json({
                    isAuthenticated: true,
                    isMember: true,
                    roomName: room.dataValues.name,
                    roomCover: room.dataValues.cover_photo_url,
                    isInviteOnly: room.dataValues.is_invite_only
                });
            } else {
                res.json({
                    isAuthenticated: false,
                    isMember: false,
                });
            }
        });
    } else {
        res.json({
            isAuthenticated: false,
            isMember: false,
        });
    }
});

module.exports = router;