import style from '../../styles/Anime.module.css'
import { GetServerSideProps } from 'next';
import { getAnim } from '../api/anime';
import ReactPlayer from 'react-player';
import { useRouter } from 'next/router';

import DropDown from '../../components/DropDown/DropDown';

export const getServerSideProps: GetServerSideProps = async (context) => {
  const id = context.query.name[0];
  const source = JSON.parse(context.query.name[1]);
  const episode = context.query.name[2];

  const data = await getAnim(id, source, episode);
  
  if (id && episode && data.title && data.src && data.sources && data.episodes) {
    return {
      props: {
        ...data,
        id,
        source,
        episode
      }
    }
  }
  else {
    return {
      redirect: {
        destination: '/anime',
        permanent: false,
      },
    }
  }
}

export default function Anime({title, src, sources, episodes, id, source, episode}) {
  const router = useRouter();
  return (
    <div className={style.main}>
      <h2 className={style.title}>
        <a className={style.back} onClick={() => router.back()}></a>
        {title}
      </h2>
      <div className={style.episodeArea}>
        <DropDown options={sources} initSelected={"playlist" + (source + 1)} onChange={(k) => {
          router.replace("/anime/" + id + "/" + k + "/" + episode);
        }} />
        <DropDown options={episodes} initSelected={episodes[episode]} onChange={(k) => {
          router.replace("/anime/" + id + "/" + source + "/" + k);
        }} />
      </div>
      <ReactPlayer url={src} width={"80vw"} height={"60vw"} controls />
    </div>
  )
}
