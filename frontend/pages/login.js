import Head from 'next/head'
import Image from 'next/image'
import formStyles from '../components/form.module.css'
import Navbar from '../components/navbar'
import Footer from '../components/footer'
import cookieCutter from "cookie-cutter";
import React, {useState} from "react";

export default function Login() {

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
                console.log("Login Data: ", data);
                setStatus(data.status);

                if (data.isValidLogin) {
                    cookieCutter.set('authKey', data.authKey);
                    cookieCutter.set('authSalt', data.salt);
                }
            }).catch((err) => {
            console.error("Error: ", err);
        });

        e.preventDefault();
    }

  return (
    <div>
        <Navbar />

        <form method="POST" onSubmit={handleSubmit} className={formStyles.compForm} autoComplete="off">
            <h2 className={formStyles.formHeader}>Log In</h2>

            <label htmlFor="username" className={formStyles.formLabel}>Username</label>
            <input type="text" name="username" id="username" value={username} className={formStyles.formInput} onChange={handleUsernameChange} required/>

            <label htmlFor="password" className={formStyles.formLabel}>Password</label>
            <input type="password" name="password" id="password" value={password} className={formStyles.formInput} onChange={handlePasswordChange} required />

            <button type="submit" className={formStyles.formButton}>Log In</button>

            <p>{status}</p>
        </form>

        <Footer />
    </div>
  )
}
