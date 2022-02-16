import { useEffect, useState } from 'react'
import style from './TextViewer.module.css'

export default function TextViewer(props) {
  const [text, SetText]: [string, Function] = useState('');

  useEffect(() => {
    if (!props.src) return;
    fetch(props.src, {method: 'Get'}).then((res) => {
      return res.text();
    }).then((data) => {
      SetText(data);
    }).catch((error) => {
      console.log(error);
    });
  }, [props.src]);

  return (
    <div className={style.container}>
      <pre className={style.content}>{text}</pre>
    </div>
  )
}