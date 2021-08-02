const React = require("react");
import { useState, useEffect } from 'react';
import Link from 'next/link';
import styles from './form.module.css';

export default function SignUpForm() {

    const [status, setStatus] = useState('');
    const [email, setEmail] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [passwordCheck, setPasswordCheck] = useState('');

    function handleSubmit(e) {
        if (password != passwordCheck) {
            setStatus("Passwords do not match");
        } else if (username == "username") {
            setStatus("Username is already taken");
        } else if (password.length < 8) {
            setStatus("Password too short.");
        } else {
            const data = {
                email_addr: email,
                username: username,
                password: password
            };

            fetch('http://localhost:3001/user/create', {
                method: 'POST',
                mode: 'cors',
                headers: {
                    'Content-Type': "application/json"
                },
                body: JSON.stringify(data)
            })
            .then(response => response.json())
            .then(data => {
                setStatus(data.status);
            });
        }



        e.preventDefault();
    }

    function handleUsernameChange(e) {
        setUsername(e.target.value);
    }

    function handlePasswordChange(e) {
        setPassword(e.target.value);
    }
    function handlePasswordCheckChange(e) {
        setPasswordCheck(e.target.value);
    }


    function handleEmailChange(e) {
        setEmail(e.target.value);
    }

    return (
        <form onSubmit={handleSubmit} className={styles.compForm} autoComplete="off">

            <h2 className={styles.formHeader}>Sign Up</h2>

            <label htmlFor="email" className={styles.formLabel}>Email</label>
            <input type="email" name="email" id="email" value={email} className={styles.formInput} onChange={handleEmailChange} required/>

            <label htmlFor="username" className={styles.formLabel}>Username</label>
            <input type="text" name="username" id="username" value={username} className={styles.formInput} onChange={handleUsernameChange} required/>

            <label htmlFor="password" className={styles.formLabel}>Password</label>
            <input type="password" name="password" id="password" value={password} className={styles.formInput} onChange={handlePasswordChange} required />

            <label htmlFor="passwordCheck" className={styles.formLabel}>Password Check</label>
            <input type="password" name="passwordCheck" id="passwordCheck" value={passwordCheck} className={styles.formInput} onChange={handlePasswordCheckChange} required />

            <button type="submit" className={styles.formButton}>Sign Up</button>

            <p>{status}</p>
        </form>
    )
}