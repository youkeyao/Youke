import style from '../../styles/Anime.module.css'
import { GetServerSideProps } from 'next';
import { getAnim } from '../api/anime';
import ReactPlayer from 'react-player';
import { useRouter } from 'next/router';

import DropDown from '../../components/DropDown/DropDown';

export const getServerSideProps: GetServerSideProps = async (context) => {
  console.log(context.query.name);
  const id = context.query.name[0];
  const source = parseInt(context.query.name[1]);
  const episode = context.query.name[2];

  const data = await getAnim(id, source, episode).catch(err => console.log(err));
  
  if (id && episode && data && data.title && data.src && data.sources && data.episodes) {
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
      <div className={style.videoContainer}>
        <ReactPlayer url={src} width={"100%"} height={"80%"} style={{ maxHeight: '55vw' }} controls />
      </div>
    </div>
  )
}
