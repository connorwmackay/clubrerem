const React = require("react");
import { useState, useEffect } from 'react';
import Link from 'next/link';
import styles from './form.module.css';

export default function SignUpForm() {

    const [status, setStatus] = useState('');
    const [email, setEmail] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    function handleSubmit() {

    }

    function handleUsernameChange(e) {
        setUsername(e.target.value);
    }

    function handlePasswordChange(e) {
        setPassword(e.target.value);
    }

    function handleEmailChange(e) {
        setEmail(e.target.value);
    }

    return (
        <form onSubmit={handleSubmit} className={styles.compForm} autoComplete="off">

            <label htmlFor="email" className={styles.formLabel}>Email</label>
            <input type="email" name="email" id="email" value={email} className={styles.formInput} onChange={handleEmailChange} required/>

            <label htmlFor="username" className={styles.formLabel}>Username</label>
            <input type="text" name="username" id="username" value={username} className={styles.formInput} onChange={handleUsernameChange} required/>

            <label htmlFor="password" className={styles.formLabel}>Password</label>
            <input type="password" name="password" id="password" value={password} className={styles.formInput} onChange={handlePasswordChange} required />

            <button type="submit" className={styles.formButton}>Sign Up</button>

            <p>{status}</p>
        </form>
    )
}