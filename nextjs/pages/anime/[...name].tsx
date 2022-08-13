import style from '../../styles/Anime.module.css'
import { GetServerSideProps } from 'next';
import { getAnim } from '../api/anime';
import ReactPlayer from 'react-player';
import Link from 'next/link';

export const getServerSideProps: GetServerSideProps = async (context) => {
  const path = require('path');
  const id = context.query.name[0];
  const episode = context.query.name[1];

  const data = await getAnim(id, episode);
  
  if (id && episode && data.src && data.allEpisodes) {
    return {
      props: {
        ...data,
        id: id,
        episode: episode
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

export default function Anime({src, allEpisodes, id, episode}) {
  return (
    <div className={style.main}>
      <ReactPlayer url={src} width={"100%"} height={"80%"} controls />
      <div className={style.episodeArea}>
        {Array.from({length: allEpisodes}).map((_, k) => (
          <Link href={"/anime/" + id + "/" + k} key={k}>
            <a className={episode === k.toString() ? style.episodeChosen : style.episodeBut}>{k+1}</a>
          </Link>
        ))}
      </div>
    </div>
  )
}
