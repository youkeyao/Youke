import { useRef } from "react"
import style from "./Dialog.module.css"

export default function Dialog(props) {
  const inputRef = useRef(null);

  const clickCancel = () => {
    inputRef.current.value = "";
    props.SetDialog(false);
  }

  const clickConfirm = () => {
    const tmp = inputRef.current.value;
    clickCancel();
    props.Func(tmp);
  }

  return (
    <div className={props.isShowDialog ? style.background : style.none}>
      <div className={style.container}>
        <p className={style.title}>{props.title}</p>
        <input className={props.isShowInput ? style.input : style.none} ref={inputRef}></input>
        {props.isShowInput ?
          <div className={style.row}>
            <a className={style.button} onClick={clickCancel}>cancel</a>
            <a className={style.button} onClick={clickConfirm}>confirm</a>
          </div> :
          <div className={style.row}>
            <a className={style.button} onClick={clickCancel}>ok</a>
          </div>
        }
      </div>
    </div>
  )
}