import Head from 'next/head'
import Image from 'next/image'
import styles from '../../styles/Home.module.css'
import { useRouter } from 'next/router'

import Navbar from '../../components/navbar'
import Footer from '../../components/footer'
import {useEffect, useState} from "react";
import axios from "axios";
import cookieCutter from "cookie-cutter";

export default function Room() {
    const router = useRouter();
    const { roomCode } = router.query;

    const [ roomName, setRoomName ] = useState("");
    const [ roomCoverUrl, setRoomCoverUrl ] = useState("");
    const [ isValidRoom, setIsValidRoom ] = useState(false);
    const [ isValidMember, setIsValidMember ] = useState(false);

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

    function ShowRoom() {
        if (isValidRoom) {
            if (isValidMember) {
                return (
                    <div>
                        <h1>{roomName}</h1>
                        <p>Welcome to our room!</p>
                    </div>
                );
            } else { // Not a member
                // TODO: Add a join button if room is public.
                return (
                    <div>
                        <h1>Not a Member</h1>
                        <p>You are not a member of this room</p>
                    </div>
                );
            }
        } else {
            return (
                <div>
                    <h1>Invalid Room</h1>
                    <p>There was no room with that code.</p>
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
