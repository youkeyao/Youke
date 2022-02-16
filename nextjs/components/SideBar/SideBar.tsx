import { useState } from "react"
import { useRouter } from "next/router";
import Link from 'next/link'

import style from "./SideBar.module.css"

const navigation = [
  { name: "Home", href: "/" },
  { name: "Profile", href: "/profile" },
  { name: "iCloud", href: "/icloud" },
];

export default function SideBar(props) {
  const [isFold, setFold] = useState(true);
  const router = useRouter();
  
  const menuClick = () => {
    setFold(!isFold);
  };

  const isArea = (item) => {
    if (item.name == "Home" || item.name == "Profile") {
      return router.route === item.href;
    }
    else {
      return router.route === '/login' || router.route.substring(0, 7) == item.href;
    }
  }

  return (
    <div className={`${style.container} ${isFold ? '' : style.containerUnfold}`}>
			<a className={`${style.menuBtn} ${isFold ? '' : style.menuBtnUnfold}`} onClick={menuClick}>
				<div className={`${style.line} ${isFold ? style.line1 : style.line1Cross}`}></div>
				<div className={`${style.line} ${isFold ? style.line2 : style.line2None}`}></div>
				<div className={`${style.line} ${isFold ? style.line3 : style.line3Cross}`}></div>
			</a>

			<div className={`${style.category} ${isFold ? '' : style.categoryFadein}`}>
        {navigation.map((item) => (
          <Link href={item.href} key={item.name}>
            <a className={`${style.link} ${isArea(item) ? style.linkSelect : ''}`}>{item.name}</a>
          </Link>
         ))}
			</div>
		</div>
  )
}