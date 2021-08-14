import Head from 'next/head'
import Image from 'next/image'
import styles from '../styles/MyRooms.module.css'

import Navbar from '../components/navbar'
import Footer from '../components/footer'
import axios from 'axios';
import Link from 'next/link';
import cookieCutter from 'cookie-cutter';
import { useState, useEffect } from 'react'

export default function MyRooms() {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [rooms, setRooms] = useState([]);

    function FetchRooms() {
        const data = {
            authKey: cookieCutter.get('authKey'),
            salt: cookieCutter.get('authSalt')
        };

        axios({
            method: 'post',
            url: 'http://localhost:3001/room/list-my',
            headers: {'content-type': 'application/json'},
            data: JSON.stringify(data)
        }).then(response => {
            console.log("Response: ", response.data);
            if (response.data.isAuthenticated) {
                setIsLoggedIn(true);
                setRooms(response.data.rooms);
            }
        }).catch(err => {
            console.error(err);
        })
    }

    useEffect(() => {
        if (!isLoggedIn) {
            FetchRooms();
        }
    }, []);

    function ListRooms() {
        const listRooms = rooms.map((room) =>
            <li className={styles.listItem} key={room.id}>
                <Link href={"http://localhost:3000/room/" + room.code}> 
                    {room.name}
                </Link>
            </li>
        );

        return <ul className={styles.list}>{listRooms}</ul>;
    }

    return (
        <div>
            <Navbar />
            <h1 className={styles.heading}>My Rooms</h1>
            <Link href='/room/create'>
                <button className={styles.createRoom}>Create Room</button>
            </Link>
            {ListRooms()}
            <Footer />
        </div>
    )
}
