import { useContext, useEffect, useRef, useState } from "react";
import style from "./MusicPlayerControl.module.css";

import { MusicContext } from "../MusicProvider/MusicProvider";

export default function MusicPlayerControl(props) {
  const musicProvider = useContext(MusicContext);

  const [dragging, setDrag] = useState(0);
  const [musicProgress, SetMusicProgress]: [number, Function] = useState(musicProvider.audioRef.current?.currentTime);
  const [musicVoice, SetMusicVoice]: [number, Function] = useState(musicProvider.audioRef.current?musicProvider.audioRef.current.volume:1);
  const progressRef = useRef(null);
  const voiceRef = useRef(null);

  const clickPlay = () => {
    if (musicProvider.isPause) {
      musicProvider.audioRef.current.play();
    }
    else {
      musicProvider.audioRef.current.pause();
    }
  }

  const clickProgress = (e) => {
    let ratio = (e.clientX - progressRef.current.getBoundingClientRect().left) / progressRef.current.offsetWidth;
    if (ratio < 0) {
      ratio = 0;
    }
    else if (ratio > 1) {
      ratio = 1;
    }
    if (musicProvider.musicPos >= 0) musicProvider.audioRef.current.currentTime = musicProvider.audioRef.current.duration * ratio;
  };

  const clickVoice = (e) => {
    let ratio = (e.clientX - voiceRef.current.getBoundingClientRect().left) / voiceRef.current.offsetWidth;
    if (ratio < 0) {
      ratio = 0;
    }
    else if (ratio > 1) {
      ratio = 1;
    }
    musicProvider.audioRef.current.volume = ratio;
  };

  const dragProgress = () => {
    musicProvider.audioRef.current.pause();
    setDrag(1);
  };

  useEffect(() => {
    document.onmouseup = () => {
      if (dragging) {
        setDrag(0);
      }
    };
    document.onmousemove = (e) => {
      if (dragging == 1) {
        // window.getSelection ? window.getSelection().removeAllRanges() : document.selection.empty();
        let toMove = (e.clientX - progressRef.current.getBoundingClientRect().left) / progressRef.current.offsetWidth;
        if (toMove < 0) {
          toMove = 0;
        }
        else if (toMove > 1) {
          toMove = 1;
        }
        if (musicProvider.musicPos >= 0) musicProvider.audioRef.current.currentTime = musicProvider.audioRef.current.duration * toMove;
      }
      else if (dragging == 2) {
        // window.getSelection ? window.getSelection().removeAllRanges() : document.selection.empty();
        let toMove = (e.clientX - voiceRef.current.getBoundingClientRect().left) / voiceRef.current.offsetWidth;
        if (toMove < 0) {
          toMove = 0;
        }
        else if (toMove > 1) {
          toMove = 1;
        }
        musicProvider.audioRef.current.volume = toMove;
      }
    }
  }, [dragging]);

  useEffect(() => {
    musicProvider.audioRef.current.ontimeupdate = () => {
      if (musicProvider.audioRef.current.duration) {
        SetMusicProgress(musicProvider.audioRef.current.currentTime/musicProvider.audioRef.current.duration);
      }
      else {
        SetMusicProgress(0);
      }
    }
    musicProvider.audioRef.current.onvolumechange = () => SetMusicVoice(musicProvider.audioRef.current.volume);
    return () => {
      musicProvider.audioRef.current.ontimeupdate = null;
      musicProvider.audioRef.current.onvolumechange = null;
    }
  }, []);

  return (
    <div className={style.container}>
      <div className={style.controlBtn}>
        <a className={style.prev} onClick={musicProvider.prevMusic}></a>
        <a className={musicProvider.isPause ? style.play : style.pause} onClick={clickPlay}></a>
        <a className={style.next} onClick={musicProvider.nextMusic}></a>
        <a className={musicProvider.curOrder ? style.inOrder : style.randomOrder} onClick={musicProvider.changeOrder}></a>
      </div>
      <div className={style.progressBar} ref={progressRef} onClick={clickProgress}>
        <div className={style.allBar}></div>
        <div className={style.currentBar} style={{width: 100 * musicProgress + "%"}}></div>
        <div className={style.dot} onMouseDown={dragProgress} style={progressRef.current?{transform: "translateX(" + musicProgress*progressRef.current.offsetWidth + "px)"}:{}}></div>
      </div>
      <div className={style.voiceBar}>
        <a className={style.voice}></a>
        <div className={style.progressBar} ref={voiceRef} onClick={clickVoice}>
          <div className={style.allBar}></div>
          <div className={style.currentBar} style={{width: 100 * musicVoice + "%"}}></div>
          <div className={style.dot} onMouseDown={() => setDrag(2)} style={voiceRef.current?{transform: "translateX(-" + (1-musicVoice)*voiceRef.current.offsetWidth + "px)"}:{}}></div>
        </div>
      </div>
    </div>
  )
}