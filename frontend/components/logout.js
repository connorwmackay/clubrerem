import {useEffect, useState} from "react";

const React = require("react");
import styles from './form.module.css';
import cookieCutter from 'cookie-cutter';

export default function Logout() {
    useEffect(() => {
        cookieCutter.set('authKey');
        cookieCutter.set('authSalt');
    });

    return (
            <p>
                You have been logged out.
            </p>
    );
}