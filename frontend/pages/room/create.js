import Head from 'next/head'
import Image from 'next/image'
import { useRouter } from 'next/router'

import Navbar from '../../components/navbar'
import Footer from '../../components/footer'
import CreateRoomForm from "../../components/createRoom";

export default function CreateRoom() {
    const router = useRouter();
    const { roomCode } = router.query;

    return (
        <div>
            <Navbar />
            <CreateRoomForm />
            <Footer />
        </div>
    )
}