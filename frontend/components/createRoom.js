import {useState} from "react";

const React = require("react");
const axios = require("axios");
import styles from './form.module.css';
import cookieCutter from 'cookie-cutter';

export default function CreateRoomForm() {
    const [roomName, setRoomName] = useState('');
    const [roomIsInviteOnly, setRoomIsInviteOnly] = useState(false);
    const [status, setStatus] = useState('');

    function handleRoomNameChange(event) {
        setRoomName(event.target.value);
    }

    function handleRoomIsInviteOnlyChange(event) {
        if (event.target.value == "inviteOnly") {
            setRoomIsInviteOnly(true);
        } else {
            setRoomIsInviteOnly(false);
        }
    }

    function handleSubmit(e) {
        const auth = {
            authKey: cookieCutter.get('authKey'),
            salt: cookieCutter.get('authSalt'),
            roomName: roomName,
            roomIsInviteOnly: roomIsInviteOnly
        };

        axios({
            method: 'post',
            url: 'http://localhost:3001/room/create',
            headers: {'content-type': 'application/json'},
            data: JSON.stringify(auth)
        }).then(response => {
            console.log(response.data);
            setStatus("Created new room at /room/" + response.data.roomCode);
        }).catch(err => {
            console.error(err);
        })



        e.preventDefault();
    }

    return (
        <form method="POST" onSubmit={handleSubmit} className={styles.compForm} autoComplete="off">
            <h2 className={styles.formHeader}>Create a Room</h2>

            <label htmlFor="roomName" className={styles.formLabel}>Room Name</label>
            <input type="text" name="roomName" id="roomName" value={roomName} className={styles.formInput} onChange={handleRoomNameChange} required/>

            <label htmlFor="roomIsInviteOnly" className={styles.formLabel}>Room Status</label>
            <select className={styles.formInput} onChange={handleRoomIsInviteOnlyChange}>
                <option value="anyone">Anyone can Join</option>
                <option value="inviteOnly">Invite Only</option>
            </select>

            <button type="submit" className={styles.formButton}>Create</button>

            <p>{status}</p>
        </form>
    );
}
