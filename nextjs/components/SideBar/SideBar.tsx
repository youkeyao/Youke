import { useContext, useState } from "react";
import { useRouter } from "next/router";
import Link from 'next/link';

import style from "./SideBar.module.css";
import { MusicContext } from "../MusicProvider/MusicProvider";

export default function SideBar({ navigation }) {
  const musicProvider = useContext(MusicContext);

  const [isFold, setFold] = useState(true);
  const router = useRouter();

  const isArea = (item) => {
    if (item.name == "Blog") {
      return router.route.substring(0, 5) == item.href;
    }
    else if (item.name == "Anime") {
      return router.route.substring(0, 6) == item.href;
    }
    else if (item.name == "iCloud") {
      return router.route === '/login' || router.route.substring(0, 7) == item.href;
    }
    else {
      return router.route === item.href;
    }
  }

  const clickPlay = () => {
    if (musicProvider.isPause) {
      musicProvider.audioRef.current.play();
    }
    else {
      musicProvider.audioRef.current.pause();
    }
  }

  return (
    <div className={`${style.container} ${isFold ? '' : style.containerUnfold}`}>
			<a className={`${style.menuBtn} ${isFold ? '' : style.menuBtnUnfold}`} onClick={() => setFold(!isFold)}>
				<div className={`${style.line} ${isFold ? style.line1 : style.line1Cross}`}></div>
				<div className={`${style.line} ${isFold ? style.line2 : style.line2None}`}></div>
				<div className={`${style.line} ${isFold ? style.line3 : style.line3Cross}`}></div>
			</a>

			<div className={`${style.category} ${isFold ? '' : style.categoryFadein}`}>
        <div className={style.audioBtn}>
          <a className={style.prev} onClick={musicProvider.prevMusic}></a>
          <a className={musicProvider.isPause ? style.play : style.pause} onClick={clickPlay}></a>
          <a className={style.next} onClick={musicProvider.nextMusic}></a>
        </div>
        {navigation.map((item) => (
          <Link className={`${style.link} ${item.re.test(router.route) ? style.linkSelect : ''}`} href={item.href} key={item.name}>
            {item.name}
          </Link>
         ))}
			</div>
		</div>
  )
}