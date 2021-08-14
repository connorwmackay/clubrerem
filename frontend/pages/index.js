import Head from 'next/head'
import Image from 'next/image'

import Navbar from '../components/navbar'
import Footer from '../components/footer'

export default function Home() {

  return (
    <div>
        <Navbar />
        <p>Content</p>
        <Footer />
    </div>
  )
}
