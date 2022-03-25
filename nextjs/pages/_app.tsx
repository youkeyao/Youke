import Head from 'next/head'

import '../styles/globals.css'

import SideBar from "../components/SideBar/SideBar"

function MyApp({ Component, pageProps }) {
  return (
    <>
      <Head>
        <title>Youke</title>
        <link
          rel="stylesheet"
          type="text/css"
          href="https://use.fontawesome.com/releases/v5.11.1/css/all.css"
        />
      </Head>
      <SideBar />
      <Component {...pageProps} />
    </>
  )
}

export default MyApp