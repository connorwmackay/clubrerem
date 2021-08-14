const express = require('express');
const router = express.Router();
const { hashPassword, isPasswordCorrect, hashDivider, getRandomAuthKey, hashPasswordWithSalt } = require('../scripts/password');
const  { findOneUser, createUser, findOneAuth, createAuth, findOneRoom, findAllRooms, createRoom, updateRoom, findOneRoomMember, findAllRoomMembers, createRoomMember } = require('../orm');
const { Op } = require("sequelize");

async function authenticate(authKey, salt) {
    let authentication = {
        isAuthenticated: false,
        userId: -1
    };

    const hash = hashPasswordWithSalt(authKey, salt);
    const hashArr = hash + hashDivider + salt;

    let authRecord;
    await findOneAuth({key_hash: hashArr})
    .then(auth => authRecord = auth.dataValues)
    .catch(err => {
        console.error(err);
        authRecord = {};
    });

    if (authRecord != {}) {
        let userId = authRecord.user_id;
        const dbHash = authRecord.key_hash.split(hashDivider);

        if (isPasswordCorrect(authKey, dbHash[0], salt)) {
            let userRecord;
            await findOneUser({id: userId})
            .then(user => userRecord = user.dataValues)
            .catch(err => {
                console.error(err);
                userRecord = {};
            });

            if (userRecord != {}) {
                authentication.isAuthenticated = true;
                authentication.userId = userRecord.id;
            }
        }
    }

    return await new Promise((resolve, reject) => {
        resolve(authentication);
    });
}

router.post('/create', async(req, res) => {
    const authKey = req.body.authKey;
    const salt = req.body.salt;

    let authentication;
    await authenticate(authKey, salt)
    .then(auth => authentication = auth)
    .catch(err => {
        console.error(err);
        authentication = {
            isAuthenticated: false,
            userId: -1
        };
    });

    let response = {
        isAuthenticated: false,
        isRoomCreated: false,
        isAdminAdded: false,
        roomCode: ''
    };

    if (authentication.isAuthenticated) {
        response.isAuthenticated = true;
        let roomCode = getRandomAuthKey();
        
        let roomRecord;
        await createRoom({
            name: req.body.roomName,
            is_invite_only: req.body.roomIsInviteOnly,
            code: roomCode
        })
        .then(room => roomRecord = room.dataValues)
        .catch(err => {
            console.error(err);
            roomRecord = {};
        });

        if (roomRecord != {}) {
            response.isRoomCreated = true;
            response.roomCode = roomCode;

            let roomMemberRecord;
            await createRoomMember({
                user_id: authentication.userId,
                room_id: roomRecord.id,
                is_admin: true,
                is_moderator: false
            })
            .then(roomMember => roomMemberRecord = roomMember.dataValues)
            .catch(err => {
                console.error(err);
                roomMemberRecord = {};
            });

            if (roomMemberRecord != {}) {
                response.isAdminAdded = true;
            }
        }
    }

    res.json({
        isAuthenticated: response.isAuthenticated,
        isRoomCreated: response.isRoomCreated,
        isAdminAdded: response.isAdminAdded,
        roomCode: response.roomCode
    });
});

router.post('/list-my', async(req, res) => {

    const authKey = req.body.authKey;
    const salt = req.body.salt;

    let authentication;
    await authenticate(authKey, salt)
    .then(auth => authentication = auth)
    .catch(err => {
        console.error(err);
        authentication = {
            isAuthenticated: false,
            userId: -1
        };
    });

    let response = {
        isAuthenticated: false,
        rooms: [],
    };

    if (authentication.isAuthenticated) {
        response.isAuthenticated = true;
    
        let roomMemberRecords;
        await findAllRoomMembers({user_id: authentication.userId})
        .then(roomMembers => roomMemberRecords = roomMembers)
        .catch(err => {
            console.error(err);
            roomMemberRecords = {};
        });

        for (i=0; i < roomMemberRecords.length; i++) {
            let member = roomMemberRecords[i];

            let roomRecord;
            await findOneRoom({id: member.dataValues.room_id})
            .then(room => roomRecord = room.dataValues)
            .catch(err => {
                console.error(err);
                roomRecord = {};
            });

            let isDuplicate = false;
            if (roomRecord != {}) {
                response.rooms.forEach(room => {
                    if (roomRecord.id == room.id) {
                        isDuplicate = true;
                    }
                });

                if (!isDuplicate) {
                    response.rooms.push(roomRecord);
                }
            }
        }
    }

    res.json({
        isAuthenticated: response.isAuthenticated,
        rooms: response.rooms,
    });
});

router.post('/:roomCode', async(req, res) => {
    const authKey = req.body.authKey;
    const salt = req.body.salt;

    let authentication;
    await authenticate(authKey, salt)
    .then(auth => authentication = auth)
    .catch(err => {
        console.error(err);
        authentication = {
            isAuthenticated: false,
            userId: -1
        };
    });

    let response = {
        isAuthenticated: false,
        isValidRoom: false,
        isMember: false,
        isAdmin: '',
        isInviteOnly: '',
        roomName: '',
        coverUrl: ''
    };

    if (authentication.isAuthenticated) {
        response.isAuthenticated = true;

        let roomRecord;
        await findOneRoom({code: req.params.roomCode})
        .then(room => roomRecord = room.dataValues)
        .catch(err => {
            console.error(err);
            roomRecord = {};
        });

        if (roomRecord != {}) {
            response.isValidRoom = true;
            response.isInviteOnly = roomRecord.is_invite_only;
            response.roomName = roomRecord.name;
            response.coverUrl = roomRecord.cover_photo_url;

            let roomMemberRecord;
            await findOneRoomMember({
                user_id: authentication.userId,
                room_id: roomRecord.id,
            })
            .then(roomMember => roomMemberRecord = roomMember.dataValues)
            .catch(err => {
                console.error(err);
                roomMemberRecord = {};
            });

            if (roomMemberRecord != {}) {
                response.isMember = true;
                response.isAdmin = roomMemberRecord.is_admin;
            }
        }
    }

    res.json({
        isAuthenticated: response.isAuthenticated,
        isValidRoom: response.isValidRoom,
        isMember: response.isMember,
        isAdmin: response.isAdmin,
        isInviteOnly: response.isInviteOnly,
        roomName: response.roomName,
        coverUrl: response.coverUrl
    });
});

router.post('/:roomCode/settings', async(req, res) => {
    const authKey = req.body.authKey;
    const salt = req.body.salt;

    let authentication;
    await authenticate(authKey, salt)
    .then(auth => authentication = auth)
    .catch(err => {
        console.error(err);
        authentication = {
            isAuthenticated: false,
            userId: -1
        };
    });

    let response = {
        isAuthenticated: false,
        isValidRoom: false,
        isAdmin: false,
        isSettingsUpdated: false,
        roomName: '',
        roomIsInviteOnly: ''
    };

    if (authentication.isAuthenticated) {
        response.isAuthenticated = true;
        
        let roomRecord;
        await findOneRoom({code: req.params.roomCode})
        .then(room => roomRecord = room.dataValues)
        .catch(err => {
            console.error(err);
            roomRecord = {};
        });

        if (roomRecord != {}) {
            response.isValidRoom = true;

            let roomMemberRecord;
            await findOneRoomMember({user_id: authentication.userId, room_id: roomRecord.id})
            .then(roomMember => roomMemberRecord = roomMember.dataValues)
            .catch(err => {
                console.error(err);
                roomMemberRecord = {};
            });

            if (roomMemberRecord != {}) {
                if (roomMemberRecord.is_admin) {
                    response.isAdmin = roomMemberRecord.is_admin;

                    let updatedRoomRecord;
                    await updateRoom({
                        name: req.body.roomName,
                        is_invite_only: req.body.isInviteOnly
                    }, {
                        id: roomRecord.id
                    })
                    .then(room => updatedRoomRecord = room.dataValues)
                    .catch(err => {
                        console.error(err);
                        updatedRoomRecord = {};
                    })

                    if (updatedRoomRecord != {}) {
                        response.isSettingsUpdated = true;
                        response.roomName = updatedRoomRecord.name;
                        response.roomIsInviteOnly = updatedRoomRecord.isInviteOnly;
                    }
                }
            }
        }
    }

    res.json({
        isAuthenticated: response.isAuthenticated,
        isValidRoom: response.isValidRoom,
        isAdmin: response.isAdmin,
        isSettingsUpdated: response.isSettingsUpdate,
        roomName: response.roomName,
        roomIsInviteOnly: response.roomIsInviteOnly
    });
});

router.post('/:roomCode/bulletins', async(req, res) => {
    // TODO: Write this route
});

router.post('/:roomCode/bulletins/create', async(req, res) => {

});

router.post('/:roomCode/comments', async(req, res) => {
    // TODO: Write this route
});

router.post('/:roomCode/members/list', async(req, res) => {
    const authKey = req.body.authKey;
    const salt = req.body.salt;

    let authentication;
    await authenticate(authKey, salt)
    .then(auth => authentication = auth)
    .catch(err => {
        console.error(err);
        authentication = {
            isAuthenticated: false,
            userId: -1
        };
    });

    let response = {
        isAuthenticated: false,
        isValidRoom: false,
        isMember: false,
        members: [],
        isEndOfList: false
    };

    if (authentication.isAuthenticated) {
        response.isAuthenticated = true;

        let roomRecord;
        await findOneRoom({code: req.params.roomCode})
        .then(room => roomRecord = room.dataValues)
        .catch(err => {
            console.error(err);
            roomRecord = {};
        });

        if (roomRecord != {}) {
            response.isValidRoom = true;

            let memberRecord;
            await findOneRoomMember({room_id: roomRecord.id, user_id: authentication.userId})
                .then(member => memberRecord = member.dataValues)
                .catch(err => {
                    console.error(err);
                    memberRecord = {};
                });

            if (memberRecord != {}) {
                response.isMember = true;

                let memberRecords;
                let min = req.body.minMemberIndex; // BODY
                let max = req.body.minMemberIndex + 24;
                await findAllRoomMembers({
                    room_id: roomRecord.id
                })
                .then(members => memberRecords = members)
                .catch(err => {
                    console.error(err);
                    memberRecords = {};
                });

                if (memberRecords != []) {
                    if (memberRecords.length < max) {
                        max = memberRecords.length-1;
                        response.isEndOfList = true;
                    }

                    for (i=min; i <= max; i++) {
                        let userRecord;
                        await findOneUser({id: memberRecords[i].dataValues.user_id})
                        .then(user => userRecord = user.dataValues)
                        .catch(err => {
                            console.error(err);
                            userRecord = {};
                        });

                        let isDuplicateUser = false;
                        response.members.forEach(member => {
                            if (member != null) {
                                if (member.id == memberRecords[i].dataValues.user_id) {
                                    isDuplicateUser = true;
                                }
                            }
                        });

                        if (userRecord != {} && !isDuplicateUser) {
                            response.members.push(userRecord);
                        }
                    }
                }

            }
        }
    }

    console.log(response);

    res.json({
        isAuthenticated: response.isAuthenticated,
        isValidRoom: response.isValidRoom,
        isMember: response.isMember,
        members: response.members,
        isEndOfList: response.isEndOfList
    });
});

router.post('/:roomCode/members/invite', async(req, res) => {
    const authKey = req.body.authKey;
    const salt = req.body.salt;

    let authentication;
    await authenticate(authKey, salt)
    .then(auth => authentication = auth)
    .catch(err => {
        console.error(err);
        authentication = {
            isAuthenticated: false,
            userId: -1
        };
    });

    let response = {
        isAuthenticated: false,
        isValidRoom: false,
        isAdmin: false,
        isInvited: false,
        inviteeUsername: ''
    };

    if (authentication.isAuthenticated) {
        response.isAuthenticated = true;
        
        let roomRecord;
        await findOneRoom({code: req.params.roomCode})
        .then(room => roomRecord = room.dataValues)
        .catch(err => {
            console.error(err);
            roomRecord = {};
        });

        if (roomRecord != {}) {
            response.isValidRoom = true;

            let roomMemberRecord;
            await findOneRoomMember({user_id: authentication.userId, room_id: roomRecord.id})
            .then(roomMember => roomMemberRecord = roomMember.dataValues)
            .catch(err => {
                console.error(err);
                roomMemberRecord = {};
            });

            if (roomMemberRecord != {}) {
                if (roomMemberRecord.is_admin) {
                    response.isAdmin = true;

                    let userRecord;
                    await findOneUser({username: req.body.inviteeUsername})
                    .then(user => userRecord = user.dataValues)
                    .catch(err => {
                        console.error(err);
                        userRecord = {};
                    });

                    if (userRecord != {}) {
                        let roomInviteeMemberRecord;
                        await createRoomMember({
                            user_id: userRecord.id, 
                            room_id: roomRecord.id,
                            is_admin: false,
                            is_moderator: false
                        })
                        .then(roomMember => roomInviteeMemberRecord = roomMember.dataValues)
                        .catch(err => {
                            console.error(err);
                            roomInviteeMemberRecord = {};
                        });

                        if (roomInviteeMemberRecord != {}) {
                            response.isInvited = true,
                            response.inviteeUsername = userRecord.username
                        }
                    }
                }
            }
        }
    }

    res.json({
        isAuthenticated: response.isAuthenticated,
        isValidRoom: response.isValidRoom,
        isAdmin: response.isAdmin,
        isInvited: response.isInvited,
        inviteeUsername: response.inviteeUsername
    });
});

module.exports = router;