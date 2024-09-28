import { GetServerSideProps } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useEffect, useRef, useState } from 'react';

import { searchAnim } from './api/anime';
import style from '../styles/Anime.module.css'

import { isValid } from './api/login';

export const getServerSideProps: GetServerSideProps = async (context) => {
  const verified = await isValid(context.req.cookies['token']);
  if (!verified) {
    return {
      redirect: {
        destination: '/login',
        permanent: false,
      },
    }
  }

  const results = await searchAnim(context.query.q).catch(err => console.log(err));
  return {
    props: {
      q: context.query.q || '',
      results: results ? results : []
    }
  };
}

export default function Anime({ q, results }) {
  const [loading, setLoading] = useState(false);
  const input = useRef(null);
  const router = useRouter();

  const search = (name: string) => {
    setLoading(true);
    router.push("/anime?q=" + name);
  }

  const enterInput = (e) => {
    if (e.keyCode == 13) {
      search(input.current.value);
    }
  }

  useEffect(() => {
    input.current.value = q;
    setLoading(false);
  }, [q]);

  return (
    <div className={style.main}>
      <div className={style.searchBox}>
        <input className={style.searchInput} ref={input} placeholder="" onKeyDown={enterInput} />
        <a className={style.searchIcon} onClick={() => search(input.current.value)}></a>
      </div>
      <div className={style.resultArea}>
        {!loading && results.length > 0 ?
          results.map((item) => (
            <Link className={style.row} href={"/anime/" + item.id + "/1/1"} key={item.id}>
              <div className={style.cover} >
                <Image src={item.cover} layout='fill' objectFit='cover' alt='404' />
              </div>
              <div className={style.detail}>
                <h3>{item.title}</h3>
                <p>导演：{item.director}</p>
                <p>主演：{item.star}</p>
                <p>年份：{item.year}</p>
                <p>简介：{item.intro}</p>
              </div>
            </Link>
          )) :
          <div className={style.empty}>{loading ? "搜索中..." : "无内容"}</div>
        }
      </div>
    </div>
  )
}
