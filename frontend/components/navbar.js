const React = require("react");
import { useState, useEffect } from 'react';
import Link from 'next/link';
import styles from './navbar.module.css';

export default function Navbar() {
    const [username, setUsername] = useState('username');
    const [isLoggedIn, setIsLoggedIn] = useState(false);

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
                    <Link href="/signup" className={styles.navbarLink}>Sign Up</Link>
                </li>
                <li className={styles.navbarItemRight}>
                    <Link href="/login" className={styles.navbarLink}>Log In</Link>
                </li>
            </ul>
        </nav>
    );
}