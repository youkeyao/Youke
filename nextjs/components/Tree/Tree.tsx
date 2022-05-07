import Link from "next/link";
import { useState } from "react";

import style from "./Tree.module.css"

export default function Tree(props) {
  const [isShowDict, SetShowDict] = useState({});

  const clickFold = (k) => {
    if (isShowDict[k]) {
      SetShowDict({...isShowDict, [k]: false});
    }
    else {
      SetShowDict({...isShowDict, [k]: true});
    }
  };

  const item = (data: Array<any>, parent: string) => {
    return data.map(v => {
      if (!v.children) {
        const url = parent + '/' + encodeURIComponent(v.name);
        return <Link href={url} key={v.name}><a className={style.item}>{v.title}</a></Link>;
      }
      else {
        return (
          <div key={v.name}>
            <a className={style.item} onClick={() => clickFold(v.name)}>
              <span className={`${style.arrow} ${isShowDict[v.name] ? style.arrow_down : ''}`}></span>
              {v.name}
            </a>
            <div className={`${style.child} ${isShowDict[v.name] ? '' : style.child_fold}`}>
              <div className={style.blank}></div>
              <div className={style.wrap}>{item(v.children, parent + '/' + v.name)}</div>
            </div>
          </div>
        )
      }
    });
  }

  return (
    <div className={style.container}>
      {item(props.data, props.root)}
		</div>
  )
}