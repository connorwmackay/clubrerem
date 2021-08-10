import Head from 'next/head';
import Image from 'next/image';
import styles from '../../styles/Room.module.css';
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
        'members': React.createRef()
    });
    const [ selectedRoomMenuItem, setSelectedRoomMenuItem] = useState('bulletin');

    function checkIfValidRoom() {
        let data = {
            authKey: cookieCutter.get('authKey'),
            salt: cookieCutter.get('authSalt'),
            roomCode: roomCode
        };

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

                    if (response.data.isMember) {
                        setIsValidMember(true);
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

    function switchSelectedMenuItem(e) {
        if (e.target.id == 'menuItemBulletin') {
            setSelectedRoomMenuItem('bulletin')
            roomMenuItems['comments'].current.className = styles.roomMenuItem;
            roomMenuItems['members'].current.className = styles.roomMenuItem;
        } else if (e.target.id == 'menuItemComments') {
            setSelectedRoomMenuItem('comments')
            roomMenuItems['bulletin'].current.className = styles.roomMenuItem;
            roomMenuItems['members'].current.className = styles.roomMenuItem;
        } else {
            setSelectedRoomMenuItem('members')
            roomMenuItems['comments'].current.className = styles.roomMenuItem;
            roomMenuItems['bulletin'].current.className = styles.roomMenuItem;
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
                    <h1 className={styles.pageTitle}>Comments</h1>
                </div>
            );
        } else {
            return (
                <div>
                    <h1 className={styles.pageTitle}>Members</h1>
                </div>
            );
        }
    }

    function ShowRoom() {
        if (isValidRoom) {
            if (isValidMember) {
                return (
                    <div>
                        <h1 className={styles.pageTitle}>{roomName}</h1>
                        <p className={styles.pageDescription}>Welcome to our room!</p>
                        <div className={styles.roomMenu}>
                            <button id="menuItemBulletin" ref={roomMenuItems['bulletin']} className={styles.roomMenuItemSelected} onClick={switchSelectedMenuItem}>Bulletin</button>
                            <button id="menuItemComments" ref={roomMenuItems['comments']} className={styles.roomMenuItem} onClick={switchSelectedMenuItem}>Comments</button>
                            <button id="menuItemMembers" ref={roomMenuItems['members']} className={styles.roomMenuItem} onClick={switchSelectedMenuItem}>Members</button>
                        </div>
                        {getTab()}
                    </div>
                );
            } else { // Not a member
                // TODO: Add a join button if room is public.
                return (
                    <div>
                        <h1 className={styles.pageTitle}>Not a Member</h1>
                        <p className={styles.pageDescription}>You are not a member of this room</p>
                    </div>
                );
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
