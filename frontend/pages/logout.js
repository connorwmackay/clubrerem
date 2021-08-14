import Head from 'next/head';
import Image from 'next/image';
import Navbar from '../components/navbar';
import Footer from '../components/footer';
import cookieCutter from "cookie-cutter";
import {useEffect} from "react";

export default function Login() {

    useEffect(() => {
        cookieCutter.set('authKey');
        cookieCutter.set('authSalt');
    });

    return (
        <div>
            <Navbar />

            <p>
                You have been logged out.
            </p>

            <Footer />
        </div>
    )
}
