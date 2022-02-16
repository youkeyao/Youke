import Head from 'next/head'

import '../styles/globals.css'

import SideBar from "../components/SideBar/SideBar"

function MyApp({ Component, pageProps }) {
  return (
    <>
      <Head>
        <title>Youke</title>
      </Head>
      <SideBar />
      <Component {...pageProps} />
    </>
  )
}

export default MyApp