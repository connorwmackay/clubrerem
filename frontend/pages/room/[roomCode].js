import Head from 'next/head';
import Image from 'next/image';
import styles from '../../styles/Room.module.css';
import formStyles from '../../components/form.module.css';
import { useRouter } from 'next/router';

import Navbar from '../../components/navbar';
import Footer from '../../components/footer';
import React, {useEffect, useState} from "react";
import axios from "axios";
import cookieCutter from "cookie-cutter";

export default function Room() {
    const router = useRouter();
    const { roomCode } = router.query;

    const [ roomName, setRoomName ] = useState("");
    const [ roomCoverUrl, setRoomCoverUrl ] = useState("");
    const [ isValidRoom, setIsValidRoom ] = useState(false);
    const [ isValidMember, setIsValidMember ] = useState(false);
    const [ roomMenuItems, setRoomMenuItems] = useState({
        'bulletin': React.createRef(),
        'comments': React.createRef(),
        'members': React.createRef(),
        'settings': React.createRef()
    });
    const [ selectedRoomMenuItem, setSelectedRoomMenuItem] = useState('bulletin');
    const [ isAdmin, setIsAdmin ] = useState(false);
    const [ isInviteOnly, setIsInviteOnly] = useState(true);

    const [ roomNameSettings, setRoomNameSettings ] = useState(roomName);
    const [ roomIsInviteOnlySettings, setRoomIsInviteOnlySettings ] = useState(roomName);

    const [ inviteeUsername, setInviteeUsername ] = useState('');
    const [ inviteeStatus, setInviteeStatus ] = useState('');

    function checkIfValidRoom() {
        let data = {
            authKey: cookieCutter.get('authKey'),
            salt: cookieCutter.get('authSalt'),
            roomCode: roomCode
        };

        console.log(data);

        if (!isValidRoom) {
            axios({
                method: 'post',
                url: `http://localhost:3001/room/${roomCode}`,
                headers: {'content-type': 'application/json'},
                data: JSON.stringify(data)
            }).then(response => {
                console.log(response);
                if (response.data.isValidRoom) {
                    setIsValidRoom(true);
                    setRoomName(response.data.roomName);
                    setRoomCoverUrl(response.data.coverUrl);
                    if (response.data.isInviteOnly) {
                        setIsInviteOnly(true);
                    } else {
                        setIsInviteOnly(false);
                    }

                    if (response.data.isMember) {
                        setIsValidMember(true);

                        if (response.data.isAdmin) {
                            setIsAdmin(true);
                        } else {
                            setIsAdmin(false);
                        }
                    } else {
                        setIsValidMember(false);
                    }
                } else {
                    setIsValidRoom(false);
                }
            }).catch(err => {
                console.error(err);
            });
        }
    }

    useEffect(() => {
        checkIfValidRoom();
    });

    function handleRoomIsInviteOnlyChange(event) {
        if (event.target.value == "inviteOnly") {
            setRoomIsInviteOnlySettings(true);
        } else {
            setRoomIsInviteOnlySettings(false);
        }
    }

    function handleRoomNameSettings(e) {
        setRoomNameSettings(e.target.value);
    }

    function handleSettingsSubmit(e) {
        const data = {
            authKey: cookieCutter.get('authKey'),
            salt: cookieCutter.get('authSalt'),
            roomName: roomNameSettings,
            isInviteOnly: roomIsInviteOnlySettings
        };

        axios({
            method:'POST',
            url: `http://localhost:3001/room/${roomCode}/settings`,
            headers: {'content-type': 'application/json'},
            data: JSON.stringify(data)
        }).then(response => {
            console.log(response.data);
        })

        e.preventDefault();
    }

    function handleMemberInvite(e) {
        const data = {
            authKey: cookieCutter.get('authKey'),
            salt: cookieCutter.get('authSalt'),
            inviteeUsername: inviteeUsername
        };

        axios({
            method:'POST',
            url: `http://localhost:3001/room/${roomCode}/members/invite`,
            headers: {'content-type': 'application/json'},
            data: JSON.stringify(data)
        }).then(response => {
            console.log(response.data);

            if (response.data.isInvited) {
                setInviteeStatus("Invited user ", inviteeUsername);
            }
        })
        
        e.preventDefault();
    }

    function handleInviteeUsername(e) {
        setInviteeUsername(e.target.value);
    }

    function switchSelectedMenuItem(e) {
        if (e.target.id == 'menuItemBulletin') {
            setSelectedRoomMenuItem('bulletin')
            roomMenuItems['comments'].current.className = styles.roomMenuItem;
            roomMenuItems['members'].current.className = styles.roomMenuItem;
            if (isAdmin) {
                roomMenuItems['settings'].current.className = styles.roomMenuItem;
            }
        } else if (e.target.id == 'menuItemComments') {
            setSelectedRoomMenuItem('comments')
            roomMenuItems['bulletin'].current.className = styles.roomMenuItem;
            roomMenuItems['members'].current.className = styles.roomMenuItem;
            if (isAdmin) {
                roomMenuItems['settings'].current.className = styles.roomMenuItem;
            }
        } else if (e.target.id == 'menuItemMembers') {
            setSelectedRoomMenuItem('members')
            roomMenuItems['comments'].current.className = styles.roomMenuItem;
            roomMenuItems['bulletin'].current.className = styles.roomMenuItem;
            if (isAdmin) {
                roomMenuItems['settings'].current.className = styles.roomMenuItem;
            }
        }
        
        if ((isAdmin) && (e.target.id == 'menuItemSettings')) {
            setSelectedRoomMenuItem('settings')
            roomMenuItems['comments'].current.className = styles.roomMenuItem;
            roomMenuItems['bulletin'].current.className = styles.roomMenuItem;
            roomMenuItems['members'].current.className = styles.roomMenuItem;
        }

        e.target.className = styles.roomMenuItemSelected;
    }

    function getTab() {
        if (selectedRoomMenuItem == 'bulletin') {
            return (
                <div>
                    <h1 className={styles.pageTitle}>Bulletin</h1>
                </div>
            );
        } else if (selectedRoomMenuItem == 'comments') {
            return (
                <div>
                    <h1 className={styles.pageTitle}>Chat</h1>
                </div>
            );
        } else if (selectedRoomMenuItem == 'members') {
            if (isAdmin) {
                return (
                    <div>
                        <h1 className={styles.pageTitle}>Members</h1>
                        <form className={formStyles.compForm} method="POST" autoComplete="off" onSubmit={handleMemberInvite}>
                            <input type="text" id="usernameInvite" placeholder="Username" className={formStyles.formInput} onChange={handleInviteeUsername} />
                            <button type="submit" className={formStyles.formButton}>Invite</button>

                            <p className={formStyles.formLabel}>{inviteeStatus}</p>
                        </form>
                    </div>
                );
            } else {
                return (
                    <div>
                        <h1 className={styles.pageTitle}>Members</h1>
                    </div>
                );
            }
        } else if (selectedRoomMenuItem == 'settings') {
            return (
                <div>
                    <h1 className={styles.pageTitle}>Settings</h1>
                    <form method="POST" className={formStyles.compForm} onSubmit={handleSettingsSubmit}>
                        <label htmlFor="roomNameSetting" className={formStyles.formLabel}>Room Name</label>
                        <input type="text" id="roomNameSetting" placeholder={roomName} className={formStyles.formInput} onChange={handleRoomNameSettings} />
                        <label htmlFor="roomNameSetting" className={formStyles.formLabel}>Room Description</label>
                        <input type="text" id="roomNameSetting" placeholder="Welcome to our room!" className={formStyles.formInput}/>

                        <label htmlFor="roomIsInviteOnly" className={styles.formLabel}>Room Status</label>
                        <select className={formStyles.formInput} onChange={handleRoomIsInviteOnlyChange} value="inviteOnly">
                            <option value="anyone">Anyone can Join</option>
                            <option value="inviteOnly">Invite Only</option>
                        </select>

                        <button type="submit" className={formStyles.formButton}>Update</button>
                    </form>
                </div>
            );
        }
    }

    function ShowRoom() {
        if (isValidRoom) {
            if (isValidMember) {
                if (isAdmin) {
                    return (
                        <div>
                            <h1 className={styles.pageTitle}>{roomName}</h1>
                            <p className={styles.pageDescription}>Welcome to our room!</p>
                            <div className={styles.roomMenu}>
                                <button id="menuItemBulletin" ref={roomMenuItems['bulletin']} className={styles.roomMenuItemSelected} onClick={switchSelectedMenuItem}>Bulletin</button>
                                <button id="menuItemComments" ref={roomMenuItems['comments']} className={styles.roomMenuItem} onClick={switchSelectedMenuItem}>Chat</button>
                                <button id="menuItemMembers" ref={roomMenuItems['members']} className={styles.roomMenuItem} onClick={switchSelectedMenuItem}>Members</button>
                                <button id="menuItemSettings" ref={roomMenuItems['settings']} className={styles.roomMenuItem} onClick={switchSelectedMenuItem}>Settings</button>
                            </div>
                            {getTab()}
                        </div>
                    );
                } else {
                    return (
                        <div>
                            <h1 className={styles.pageTitle}>{roomName}</h1>
                            <p className={styles.pageDescription}>Welcome to our room!</p>
                            <div className={styles.roomMenu}>
                                <button id="menuItemBulletin" ref={roomMenuItems['bulletin']} className={styles.roomMenuItemSelected} onClick={switchSelectedMenuItem}>Bulletin</button>
                                <button id="menuItemComments" ref={roomMenuItems['comments']} className={styles.roomMenuItem} onClick={switchSelectedMenuItem}>Chat</button>
                                <button id="menuItemMembers" ref={roomMenuItems['members']} className={styles.roomMenuItem} onClick={switchSelectedMenuItem}>Members</button>
                            </div>
                            {getTab()}
                        </div>
                    );
                }
            } else { // Not a member
                // TODO: Add a join button if room is public.
                if (!isInviteOnly) {
                    return (
                        <div>
                            <h1 className={styles.pageTitle}>{roomName}</h1>
                            <p className={styles.pageDescription}>You are not a member of this room</p>
                            <form method="POST" className={formStyles.compForm}>
                                <button type="submit" className={formStyles.formButton}>Join</button>
                            </form>
                        </div>
                    );
                } else {
                    return (
                        <div>
                            <h1 className={styles.pageTitle}>{roomName}</h1>
                            <p className={styles.pageDescription}>You are not a member of this room</p>
                            <form method="POST" className={formStyles.compForm}>
                                <button type="submit" className={formStyles.formButton}>Request to Join</button>
                            </form>
                        </div>
                    );
                }
            }
        } else {
            return (
                <div>
                    <h1 className={styles.pageTitle}>Invalid Room</h1>
                    <p className={styles.pageDescription}>There was no room with that code.</p>
                </div>
            );
        }
    }

    return (
        <div>
            <Navbar />
            {ShowRoom()}
            <Footer />
        </div>
    );
}
