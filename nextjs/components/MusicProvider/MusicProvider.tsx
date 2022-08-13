import { createContext, useEffect, useRef, useState } from 'react'

export const MusicContext = createContext(null);

export function MusicProvider({ children }) {
  let [musicInfos, setInfos] = useState([]);
  const [musicPos, setPos] = useState(-1);
  const [musicURL, setURL] = useState('');
  const [isPause, setPause] = useState(true);
  const [curOrder, setOrder] = useState(true);
  const audioRef = useRef(null);

  const storeMusic = () => {
    if (musicInfos.length == 0) {
      window.localStorage.removeItem('musicInfos');
    }
    else {
      window.localStorage.setItem('musicInfos', JSON.stringify(musicInfos));
    }
  };

  const getPos = (id: number) => {
    for (let i = 0; i < musicInfos.length; i ++) {
      if (musicInfos[i].id === id) return i;
    }
    return -1;
  };

  const addMusic = (id: number, info: any) => {
    if (getPos(id) < 0) {
      musicInfos.push({
        id: id,
        name: info.name,
        singer: info.singer
      })
      setInfos([...musicInfos]);
      storeMusic();
    }
    setMusic(id);
  };

  const removeMusic = (key: number) => {
    if (key >= musicInfos.length) return;
    musicInfos.splice(key, 1);
    setInfos([...musicInfos]);
    if (key == musicPos) {
      setPause(true);
      audioRef.current.currentTime = 0;
      setURL('');
      nextMusic();
    }
    else if (key < musicPos) {
      setPos(musicPos - 1);
    }
    storeMusic();
  }

  const setMusic = (id: number) => {
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
      if (data.data[0].url) {
        setPos(getPos(id));
        setURL(data.data[0].url);
        audioRef.current.play();
        setPause(audioRef.current.paused);
      }
      else {
        removeMusic(getPos(id));
      }
    });
  };

  const prevMusic = () => {
    if (musicInfos.length == 0) {
      setPos(-1);
      return;
    }
    if (curOrder) {
      setMusic(musicInfos[(musicPos + musicInfos.length - 1) % musicInfos.length]?.id);
    }
    else {
      setMusic(musicInfos[(musicPos + Math.floor((musicInfos.length - 1) * Math.random()) + 1) % musicInfos.length]?.id);
    }
  };

  const nextMusic = () => {
    if (musicInfos.length == 0) {
      setPos(-1);
      return;
    }
    if (curOrder) {
      setMusic(musicInfos[(musicPos + 1) % musicInfos.length]?.id);
    }
    else {
      setMusic(musicInfos[(musicPos + Math.floor((musicInfos.length - 1) * Math.random()) + 1) % musicInfos.length]?.id);
    }
  };

  useEffect(() => {
    audioRef.current.onplay = () => setPause(false);
    audioRef.current.onpause = () => setPause(true);

    if (window.localStorage.getItem('musicInfos')) {
      musicInfos = JSON.parse(window.localStorage.getItem('musicInfos'))
      setInfos(musicInfos);
      setMusic(musicInfos[0].id);
    }
    return () => {
      audioRef.current.onplay = null;
      audioRef.current.onpause = null;
    };
  }, []);

  const value = {
    audioRef: audioRef,
    isPause: isPause,
    musicInfos: musicInfos,
    musicPos: musicPos,
    curOrder: curOrder,
    addMusic: addMusic,
    removeMusic: removeMusic,
    setMusic: setMusic,
    prevMusic: prevMusic,
    nextMusic: nextMusic,
    changeOrder: () => setOrder((order: boolean) => !order)
  }

  return (
    <MusicContext.Provider value={value}>
      <audio src={musicURL} ref={audioRef} onEnded={nextMusic}></audio>
      { children }
    </MusicContext.Provider>
  )
}