import Link from 'next/link';
import { useRef, useState } from 'react';
import style from '../styles/Anime.module.css'

export default function Anime(props) {
  const [results, setResults] = useState([]);
  const input = useRef(null);

  const search = (name: string) => {
    fetch("/api/anime?q=" + name).then((res) => {
      return res.json();
    }).then((data) => {
      setResults(data);
    });
  }

  const enterInput = (e) => {
    if (e.keyCode == 13) {
      search(input.current.value);
    }
  }

  return (
    <div className={style.main}>
      <div className={style.searchBox}>
        <input className={style.searchInput} ref={input} placeholder="" onKeyDown={enterInput} />
        <a className={style.searchIcon} onClick={() => search(input.current.value)}></a>
      </div>
      <div className={style.resultArea}>
        {results.length > 0 ?
          results.map((item) => (
            <Link href={"/anime/" + item.id + "/0"} key={item.id}>
              <a className={style.row}>
                <img className={style.cover} src={item.cover} />
                <div className={style.detail}>
                  <h3>{item.title}</h3>
                  <p>导演：{item.director}</p>
                  <p>主演：{item.star}</p>
                  <p>年份：{item.year}</p>
                  <p>简介：{item.intro}</p>
                </div>
              </a>
            </Link>
          )) :
          <div className={style.empty}>无内容</div>
        }
      </div>
    </div>
  )
}
