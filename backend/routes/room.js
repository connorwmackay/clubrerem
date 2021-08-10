const express = require('express');
const router = express.Router();
const { hashPassword, isPasswordCorrect, hashDivider, getRandomAuthKey, hashPasswordWithSalt } = require('../scripts/password');
const db = require('../models/index');

router.post('/create', (req, res) => {
    const authKey = req.body.authKey;
    const salt = req.body.salt;
    const hash = hashPasswordWithSalt(authKey, salt);
    const hashArr = hash + hashDivider + salt;

    db.Auth.findOne({
        where: {
            key_hash: hashArr
        }
    }).then(auth => {
        if (auth) {
            let userId = auth.dataValues.user_id;
            const dbHash = auth.dataValues.key_hash.split(hashDivider);

            if (isPasswordCorrect(authKey, dbHash[0], salt)) {
                db.User.findOne({
                    where: {
                        id: userId
                    }
                }).then((user) => {
                    if (user) {
                        /* Get the Room Code */
                        let roomCode = getRandomAuthKey();

                        db.Room.findOne({
                            where: {
                                code: roomCode
                            }
                        }).then(room => {
                            if (room) {
                                res.json({isAuthenticated: true, isRoomCreated: true, isAdminAdded: false});
                            }
                        }).catch(err => {
                            console.error(err);
                            res.json({isAuthenticated: true, isRoomCreated: true, isAdminAdded: false});
                        });

                        db.Room.create({
                            name: req.body.roomName,
                            is_invite_only: req.body.roomIsInviteOnly,
                            code: roomCode
                        }).then(room => {
                            if (room) {
                                db.RoomMember.create({
                                    user_id: userId,
                                    room_id: room.dataValues.id,
                                    is_admin: true,
                                    is_moderator: false
                                }).then(member => {
                                    if (member) {
                                        res.json({isAuthenticated: true, isRoomCreated: true, isAdminAdded: true, roomCode: room.dataValues.code});
                                    } else {
                                        res.json({isAuthenticated: true, isRoomCreated: true, isAdminAdded: false, roomCode: room.dataValues.code});
                                    }
                                }).catch(err => {
                                    res.json({isAuthenticated: true, isRoomCreated: true, isAdminAdded: false, roomCode: room.dataValues.code});
                                });
                            } else {
                                res.json({isAuthenticated: true, isRoomCreated: true, isAdminAdded: false});
                            }
                        }).catch(err => {
                            console.error(err);
                            res.json({isAuthenticated: true, isRoomCreated: false, isAdminAdded: false});
                        });


                    } else {
                        res.json({isAuthenticated: false, isRoomCreated: false, isAdminAdded: false});
                    }
                });
            } else {
                res.json({isAuthenticated: false, isRoomCreated: false, isAdminAdded: false});
            }
        } else {
            res.json({isAuthenticated: false, isRoomCreated: false, isAdminAdded: false});
        }
    }).catch(err => {
        console.error(err);
        res.json({isAuthenticated: false, isRoomCreated: false, isAdminAdded: false});
    });
});

router.post('/:roomCode', (req, res) => {
    const authKey = req.body.authKey;
    const salt = req.body.salt;
    const hash = hashPasswordWithSalt(authKey, salt);
    const hashArr = hash + hashDivider + salt;

    db.Auth.findOne({
        where: {
            key_hash: hashArr
        }
    }).then(auth => {
        if (auth) {
            const dbHash = auth.dataValues.key_hash.split(hashDivider);

            if (isPasswordCorrect(authKey, dbHash[0], salt)) {
                db.Room.findOne({
                    where: {
                        code: req.params.roomCode
                    }
                }).then((room) => {
                    if (room) {
                        db.RoomMember.findOne({
                            where: {
                                room_id: room.dataValues.id,
                                user_id: auth.dataValues.user_id
                            }
                        }).then(member => {
                            if (member) {
                                res.json({
                                    isAuthenticated: true,
                                    isValidRoom: true,
                                    isMember: true,
                                    isAdmin: member.dataValues.is_admin,
                                    isInviteOnly: room.dataValues.is_invite_only,
                                    roomName: room.dataValues.name,
                                    coverUrl: room.dataValues.cover_photo_url
                                });
                            } else {
                                res.json({
                                    isAuthenticated: true,
                                    isValidRoom: true,
                                    roomName: room.dataValues.name,
                                    isInviteOnly: room.dataValues.is_invite_only,
                                    isMember: false,
                                });
                            }
                        }).catch(err => {
                            console.error(err);

                            res.json({
                                isAuthenticated: true,
                                isValidRoom: true,
                                isMember: false,
                            });
                        });
                    } else {
                        res.json({
                            isAuthenticated: true,
                            isValidRoom: false,
                            isMember: false,
                        });
                    }
                }).catch(err => {
                    console.error(err);
                    res.json({
                        isAuthenticated: true,
                        isValidRoom: false,
                        isMember: false,
                    });
                });
            } else {
                res.json({
                    isAuthenticated: false,
                    isValidRoom: false,
                    isMember: false,
                });
            }
        } else {
            res.json({
                isAuthenticated: false,
                isValidRoom: false,
                isMember: false,
            });
        }
    })
    .catch(err => {
        console.error(err);
        res.json({
            isAuthenticated: false,
            isValidRoom: false,
            isMember: false,
        });
    })
});

router.post('/:roomCode/settings', (req, res) => {
    const authKey = req.body.authKey;
    const salt = req.body.salt;
    const hash = hashPasswordWithSalt(authKey, salt);
    const hashArr = hash + hashDivider + salt;

    db.Auth.findOne({
        where: {
            key_hash: hashArr
        }
    }).then(auth => {
        if (auth) {
            let userId = auth.dataValues.user_id;
            const dbHash = auth.dataValues.key_hash.split(hashDivider);

            if (isPasswordCorrect(authKey, dbHash[0], salt)) {
                db.User.findOne({
                    where: {
                        id: userId
                    }
                }).then((user) => {
                    if (user) {
                        db.Room.findOne({
                            where: {
                                code: req.params.roomCode
                            }
                        }).then(room => {
                            if (room) {
                                db.RoomMember.findOne({
                                    where: {
                                        user_id: user.dataValues.id,
                                        room_id: room.dataValues.id
                                    }
                                }).then(member => {
                                    if (member) {
                                        if (member.dataValues.is_admin) {
                                            if (req.body.roomName != undefined || req.body.roomName != '' &&
                                                req.body.isInviteOnly != undefined) {
                                                db.Room.update({name: req.body.roomName, is_invite_only: req.body.isInviteOnly}, {
                                                    where: {
                                                        id: room.dataValues.id
                                                    }
                                                }).then(updatedRoom => {
                                                    if (updatedRoom) {
                                                        res.status(201);
                                                        res.json({
                                                            isAuthenticated: true,
                                                            isValidRoom: true,
                                                            isAdmin: true,
                                                            isSettingsUpdated: true,
                                                            roomName: updatedRoom.dataValues.name,
                                                            roomIsInviteOnly: updatedRoom.dataValues.is_invite_only
                                                        });
                                                    } else {
                                                        res.status(201);
                                                        res.json({
                                                            isAuthenticated: true,
                                                            isValidRoom: true,
                                                            isAdmin: true,
                                                            isSettingsUpdated: false
                                                        });
                                                    }
                                                    
                                                }).catch(err => {
                                                    console.log(err);
                                                    res.status(500);
                                                    res.json({
                                                        isAuthenticated: true,
                                                        isValidRoom: true,
                                                        isAdmin: true,
                                                        isSettingsUpdated: false
                                                    });
                                                })
                                            }
                                        } else {
                                            res.status(201);
                                            res.json({
                                                isAuthenticated: true,
                                                isValidRoom: false,
                                                isAdmin: false
                                            });
                                        }
                                    } else {
                                        res.status(201);
                                        res.json({
                                            isAuthenticated: false,
                                            isValidRoom: false,
                                            isAdmin: false
                                        });
                                    }
                                }).catch(err => {
                                    console.error(err);
                                });
                            } else {
                                res.status(201);
                                res.json({
                                    isAuthenticated: true,
                                    isValidRoom: false
                                });
                            }
                        }).catch(err => {
                            console.error(err);
                            res.status(500);
                            res.json({
                                isAuthenticated: true,
                                isValidRoom: false
                            });
                        });
                    } else {
                        res.status(201);
                        res.json({
                            isAuthenticated: false
                        });
                    }
                });
            }
        }
    });
});

router.post('/:roomCode/bulletins', (req, res) => {
    // TODO: Write this route
});

router.post('/:roomCode/bulletins/create', (req, res) => {

});

router.post('/:roomCode/comments', (req, res) => {
    // TODO: Write this route
});

router.post('/:roomCode/members', (req, res) => {
    // TODO: Write this route
});

module.exports = router;