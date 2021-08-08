const React = require("react");
const axios = require("axios");
import { useState, useEffect } from 'react';
import Link from 'next/link';
import styles from './navbar.module.css';
import cookieCutter from 'cookie-cutter';

export default function Navbar() {
    const [username, setUsername] = useState('username');
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    function isAuthenticated() {

        const auth = {
            authKey: cookieCutter.get('authKey'),
            salt: cookieCutter.get('authSalt')
        };

        axios({
            method: 'post',
            url: 'http://localhost:3001/user/me',
            headers: { 'content-type': 'application/json' },
            data: JSON.stringify(auth)
        })
        .then(response => {
            let data = response.data;

            if (data.isAuthenticated) {
                setIsLoggedIn(true);
                setUsername(data.username);
            } else{
                setIsLoggedIn(false);
                setUsername('');
            }
        }).catch(err => {
            console.error(err);
        });
    }

    function rightNavComponent() {
        if (isLoggedIn) {
            return (
                <span>
                    <li className={styles.navbarItemRight}>
                        <Link href="/logout" className={styles.navbarLink}>Log Out</Link>
                    </li>

                    <li className={styles.navbarItemRight}>
                        <Link href="#" className={styles.navbarLink}><a>{username}</a></Link>
                    </li>
                </span>
            );
        } else {
            return (
                <span>
                    <li className={styles.navbarItemRight}>
                        <Link href="/signup" className={styles.navbarLink}>Sign Up</Link>
                    </li>

                    <li className={styles.navbarItemRight}>
                        <Link href="/login" className={styles.navbarLink}>Log In</Link>
                    </li>
                </span>
            );
        }
    }

    useEffect(() => {
       isAuthenticated();
    });

    return (
        <nav className={styles.navbar}>
            <ul className={styles.navbarNav}>
                <li className={styles.navbarItem}>
                    <Link href="/" className={styles.navbarLink}>Club ReRem</Link>
                </li>
                <li className={styles.navbarItem}>
                    <Link href="/" className={styles.navbarLink}>Home</Link>
                </li>
                <li className={styles.navbarItem}>
                    <Link href="/room/create" className={styles.navbarLink}>Create Room</Link>
                </li>

                {rightNavComponent()}
            </ul>
        </nav>
    );
}