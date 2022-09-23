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
        <SideBar
          navigation={[
            { name: "Home", href: "/", re: /\/$/ },
            { name: "Profile", href: "/profile", re: /\/profile$/ },
            { name: "Blog", href: "/blog", re: /\/blog(\/.*)?$/ },
            { name: "iCloud", href: "/icloud", re: /\/(icloud|login)(\/.*)?$/ },
            { name: "Music", href: "/music", re: /\/music$/ },
            { name: "Anime", href: "/anime", re: /\/anime(\/.*)?$/ },
            { name: "Gobang", href: "/gobang", re: /\/gobang$/ },
          ]}
        />
        <Component {...pageProps} />
      </MusicProvider>
    </>
  )
}

export default MyApp