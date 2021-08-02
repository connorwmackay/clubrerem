import {useState} from "react";

const React = require("react");
import styles from './form.module.css';

export default function LoginForm() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [status, setStatus] = useState('');

    function handleUsernameChange(event) {
        setUsername(event.target.value);
    }

    function handlePasswordChange(event) {
        setPassword(event.target.value);
    }

    function handleSubmit(e) {
        let theData = {
            username: username,
            password: password
        };

        fetch('http://localhost:3001/user/validate', {
            method: 'POST',
            mode: 'cors',
            headers: {
                'Content-Type': "application/json"
            },
            body: JSON.stringify(theData)
        })
            .then(response => response.json())
            .then(data => {
                setStatus(data.status);
                console.log("Success: ", data);
            }).catch((err) => {
            console.error("Error: ", err);
        });

        e.preventDefault();
    }

    return (
        <form method="POST" onSubmit={handleSubmit} className={styles.compForm} autoComplete="off">
            <h2 className={styles.formHeader}>Log In</h2>

            <label htmlFor="username" className={styles.formLabel}>Username</label>
            <input type="text" name="username" id="username" value={username} className={styles.formInput} onChange={handleUsernameChange} required/>

            <label htmlFor="password" className={styles.formLabel}>Password</label>
            <input type="password" name="password" id="password" value={password} className={styles.formInput} onChange={handlePasswordChange} required />

            <button type="submit" className={styles.formButton}>Log In</button>

            <p>{status}</p>
        </form>
    );
}
