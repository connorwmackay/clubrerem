import Head from 'next/head';
import Image from 'next/image';
import formStyles from '../components/form.module.css';
import Navbar from '../components/navbar'
import Footer from '../components/footer'
import {useState} from "react";

export default function SignUp() {
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
        <div>
            <Navbar />

            <form onSubmit={handleSubmit} className={formStyles.compForm} autoComplete="off">

                <h2 className={formStyles.formHeader}>Sign Up</h2>

                <label htmlFor="email" className={formStyles.formLabel}>Email</label>
                <input type="email" name="email" id="email" value={email} className={formStyles.formInput} onChange={handleEmailChange} required/>

                <label htmlFor="username" className={formStyles.formLabel}>Username</label>
                <input type="text" name="username" id="username" value={username} className={formStyles.formInput} onChange={handleUsernameChange} maxLength="255" required/>

                <label htmlFor="password" className={formStyles.formLabel}>Password</label>
                <input type="password" name="password" id="password" value={password} className={formStyles.formInput} onChange={handlePasswordChange} minLength="8" maxLength="255" required />

                <label htmlFor="passwordCheck" className={formStyles.formLabel}>Password Check</label>
                <input type="password" name="passwordCheck" id="passwordCheck" value={passwordCheck} className={formStyles.formInput} onChange={handlePasswordCheckChange} required />

                <button type="submit" className={formStyles.formButton}>Sign Up</button>

                <p>{status}</p>
            </form>

            <Footer />
        </div>
    )
}
