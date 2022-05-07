import Head from 'next/head'

import '../styles/globals.css'
import '../styles/fontawesome.css'

import SideBar from "../components/SideBar/SideBar";
import { MusicProvider } from '../components/MusicProvider/MusicProvider';

function MyApp({ Component, pageProps }) {
  return (
    <>
      <Head>
        <title>Youke</title>
      </Head>
      <MusicProvider>
        <SideBar />
        <Component {...pageProps} />
      </MusicProvider>
    </>
  )
}

export default MyApp