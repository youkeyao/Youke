import { useRef } from "react"
import style from "./Modal.module.css"

interface ModalProps {
  isVisible: boolean;
  title: string;
  type: 'input' | 'info' | 'None'
  onConfirm?: (v: string) => void;
  onClose?: () => void;
}

export default function Modal(props: ModalProps) {
  const { isVisible, title, type, onClose, onConfirm } = props;
  const inputRef = useRef(null);

  const clickCancel = () => {
    inputRef.current.value = "";
    onClose && onClose();
  }

  const clickConfirm = () => {
    const tmp = inputRef.current.value;
    onConfirm && onConfirm(tmp);
  }

  return (
    <div className={isVisible ? style.background : style.none}>
      <div className={style.container}>
        <p className={style.title}>{title}</p>
        <input className={type == 'input' ? style.input : style.none} ref={inputRef}></input>
        {type == 'input' ?
          <div className={style.row}>
            <a className={style.button} onClick={clickCancel}>cancel</a>
            <a className={style.button} onClick={clickConfirm}>confirm</a>
          </div> :
        type == 'info' ?
          <div className={style.row}>
            <a className={style.button} onClick={clickCancel}>ok</a>
          </div> : 
        null
        }
      </div>
    </div>
  )
}