const React = require("react");
import { useState, useEffect } from 'react';
import Link from 'next/link';
import styles from './navbar.module.css';

export default function Footer() {
    return (
        <nav className={`${styles.navbar} ${styles.footer}`}>
            <ul className={styles.navbarNav}>
                <li className={styles.navbarItem}>
                    &copy; 2021 - Club ReRem
                </li>

                <li className={styles.navbarItemRight}>
                    <Link href="/terms-and-conditions" className={styles.navbarLink}>Terms & Conditions</Link>
                </li>
                <li className={styles.navbarItemRight}>
                    <Link href="/privacy-policy" className={styles.navbarLink}>Privacy Policy</Link>
                </li>
            </ul>
        </nav>
    );
}