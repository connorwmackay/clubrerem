import Head from 'next/head'
import Image from 'next/image'
import styles from '../styles/Home.module.css'
import SignUpForm from '../components/signupForm'
import Navbar from '../components/navbar'
import Footer from '../components/footer'

export default function Login() {
    return (
        <div>
            <Navbar />
            <SignUpForm />
            <Footer />
        </div>
    )
}
