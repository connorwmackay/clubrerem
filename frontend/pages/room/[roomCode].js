import Head from 'next/head'
import Image from 'next/image'
import styles from '../../styles/Home.module.css'
import { useRouter } from 'next/router'

import Navbar from '../../components/navbar'
import Footer from '../../components/footer'

export default function Room() {
    const router = useRouter();
    const { roomCode } = router.query;

    return (
        <div>
            <Navbar />
            <p>{roomCode}</p>
            <Footer />
        </div>
    )
}
