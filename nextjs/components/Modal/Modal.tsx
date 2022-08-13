import { useRef } from "react"
import style from "./Modal.module.css"

interface ModalProps {
  isVisible: boolean;
  title: string;
  isShowInput?: boolean;
  onConfirm?: (v: string) => void;
  onCancel?: () => void;
}

export default function Modal(props: ModalProps) {
  const { isVisible, title, isShowInput, onCancel, onConfirm } = props;
  const inputRef = useRef(null);

  const clickCancel = () => {
    inputRef.current.value = "";
    onCancel && onCancel();
  }

  const clickConfirm = () => {
    const tmp = inputRef.current.value;
    onConfirm && onConfirm(tmp);
  }

  return (
    <div className={isVisible ? style.background : style.none}>
      <div className={style.container}>
        <p className={style.title}>{title}</p>
        <input className={isShowInput ? style.input : style.none} ref={inputRef}></input>
        {isShowInput ?
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