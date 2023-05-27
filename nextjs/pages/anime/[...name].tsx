import style from '../../styles/Anime.module.css'
import { GetServerSideProps } from 'next';
import { getAnim } from '../api/anime';
import ReactPlayer from 'react-player';
import { useRouter } from 'next/router';

import DropDown from '../../components/DropDown/DropDown';

export const getServerSideProps: GetServerSideProps = async (context) => {
  const id = context.query.name[0];
  const source = parseInt(context.query.name[1]);
  const episode = context.query.name[2];

  const data = await getAnim(id, source, episode).catch(err => console.log(err));
  console.log(data.title);
  
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
        <DropDown options={Array.from({length: sources}, (_, i)=>"playlist"+(i+1))} initSelected={"playlist" + source} onChange={(k) => {
          router.replace("/anime/" + id + "/" + (k+1) + "/" + episode);
        }} />
        <DropDown options={Array.from({length: episodes}, (_, i)=>"第"+(i+1)+"集")} initSelected={"第" + episode + "集"} onChange={(k) => {
          router.replace("/anime/" + id + "/" + source + "/" + (k+1));
        }} />
      </div>
      <div className={style.videoContainer}>
        <ReactPlayer url={src} width={"100%"} height={"80%"} style={{ maxHeight: '55vw' }} controls />
      </div>
    </div>
  )
}
