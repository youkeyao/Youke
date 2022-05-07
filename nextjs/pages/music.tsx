import { useContext, useRef, useState } from 'react';
import style from '../styles/Music.module.css';

import MusicPlayerControl from "../components/MusicPlayerControl/MusicPlayerControl";
import { MusicContext } from '../components/MusicProvider/MusicProvider';

export default function Music(props) {
  const musicProvider = useContext(MusicContext);

  const [isSearch, SetSearch] = useState(false);
  const [results, SetResults] = useState([]);
  const input = useRef(null);

  const search = (keywords) => {
    const body = {
      api: '/weapi/search/get',
      data: {
        s: keywords,
        type: 1,
        offset: 0,
        total: true,
        limit: 20
      },
    }
    fetch("/api/neteasecloud", {body: JSON.stringify(body), method: 'POST'}).then((res) => {
      return res.json();
    }).then((data) => {
      if (data.result) SetResults([...data.result.songs]);
    });
  };

  const download = (id: number, fileName: string) => {
    const body = {
      api: '/weapi/song/enhance/player/url',
      data: {
        ids: [id],
        id: id,
        br: 999000,
      },
    }
    fetch("/api/neteasecloud", {body: JSON.stringify(body), method: 'POST'}).then((res) => {
      return res.json();
    }).then((data) => {
      fetch(data.data[0].url).then(res => res.blob()).then(blob => {
        const tmpNode = document.createElement('a');
        tmpNode.download = fileName;
        tmpNode.style.display = 'none';
        const url = window.URL.createObjectURL(blob);
        tmpNode.href = url;
        document.body.appendChild(tmpNode);
        tmpNode.click();
        document.body.removeChild(tmpNode);
        window.URL.revokeObjectURL(url);
      });
    });
  };

  const enterInput = (e) => {
    if (e.keyCode == 13) {
      search(input.current.value);
    }
  }

  return (
    <div className={style.main}>
      <div className={style.mainContainer} style={{transform: isSearch ? 'translateX(-50%)' : 'translateX(0)'}}>
        <div className={style.container}>
          <div className={style.titleRow}>
            <p className={`${style.item} ${style.itemName}`}>Name</p>
            <div className={style.btnArea}></div>
            <p className={style.item}>Singer</p>
            <a className={`${style.itemBtn} ${style.search}`} onClick={() => SetSearch(true)}></a>
          </div>
          <div className={style.resultArea}>
            {musicProvider.musicInfos.map((item, key) => (
              <div className={`${style.row} ${musicProvider.musicPos == key ? style.chosenRow : ''}`} key={item.id}>
                <p className={`${style.item} ${style.itemName}`}>{item.name}</p>
                <div className={style.btnArea}>
                  <a className={`${style.itemBtn} ${style.play}`} onClick={() => musicProvider.setMusic(item.id)}></a>
                  <a className={`${style.itemBtn} ${style.download}`} onClick={() => download(item.id, item.name+'-'+item.singer)}></a>
                  <a className={`${style.itemBtn} ${style.remove}`} onClick={() => musicProvider.removeMusic(key)}></a>
                </div>
                <p className={style.item}>{item.singer}</p>
              </div>
            ))}
          </div>
          <MusicPlayerControl />
        </div>
        <div className={style.container}>
          <div className={style.searchBox}>
            <a className={`${style.itemBtn} ${style.back}`} onClick={() => SetSearch(false)}></a>
            <input className={style.searchInput} ref={input} placeholder="" onKeyDown={enterInput} />
            <a className={style.searchIcon} onClick={() => search(input.current.value)}></a>
          </div>
          <div className={style.resultArea}>
            {results.map((item) => (
              <div className={style.row} key={item.id}>
                <p className={`${style.item} ${style.itemName}`}>{item.name}</p>
                <div className={style.btnArea}>
                  <a className={`${style.itemBtn} ${style.add}`} onClick={() => {musicProvider.addMusic(item.id, {name:item.name,singer:item.artists[0].name});SetSearch(false);}}></a>
                  <a className={`${style.itemBtn} ${style.download}`} onClick={() => download(item.id, item.name+'-'+item.artists[0].name)}></a>
                </div>
                <p className={style.item}>{item.artists[0].name}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}