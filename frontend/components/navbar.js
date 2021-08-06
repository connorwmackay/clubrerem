const React = require("react");
import { useState, useEffect } from 'react';
import Link from 'next/link';
import styles from './navbar.module.css';
import cookieCutter from 'cookie-cutter';

export default function Navbar() {
    const [username, setUsername] = useState('username');
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [rightNavItems, setRightNavItems] = useState([
        {link: "/login", name: "Log In"},
        {link: "/signup", name: "Sign Up"}
    ]);

    function isAuthenticated() {
        const auth = {
            authKey: cookieCutter.get('authKey'),
            salt: cookieCutter.get('authSalt')
        };

        if (auth.authKey != '' || auth.authKey != undefined &&
            auth.salt != '' || auth.authKey != undefined) {
            fetch('http://localhost:3001/user/me', {
                method: 'POST',
                mode: 'cors',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(auth)
            })
            .then(response => response.json())
            .then(data => {
                if (data) {
                    if (data.isAuthenticated == true) {
                        setIsLoggedIn(true);
                        setUsername(data.username);

                        setRightNavItems([
                            {link: '#', name: username},
                            {link: '/logout', name: 'Log Out'}
                        ]);
                    } else{
                        setIsLoggedIn(false);
                        setUsername('');

                        setRightNavItems([
                            {link: '/login', name: 'Log In'},
                            {link: '/signup', name: 'Sign Up'}
                        ]);
                    }
                }
            }).catch(err => {
                console.error(err);

                setRightNavItems([
                    {link: '/login', name: 'Log In'},
                    {link: '/signup', name: 'Sign Up'}
                ]);
            });
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

                <li className={styles.navbarItemRight}>
                    <Link href={rightNavItems[1].link} className={styles.navbarLink}>{rightNavItems[1].name}</Link>
                </li>
                <li className={styles.navbarItemRight}>
                    <Link href={rightNavItems[0].link} className={styles.navbarLink}>{rightNavItems[0].name}</Link>
                </li>
            </ul>
        </nav>
    );
}