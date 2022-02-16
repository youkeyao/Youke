import style from './UnsupportedViewer.module.css'

export default function UnsupportedViewer(props) {
  return (
    <div className={style.container}>
      <p><b>{`.${props.fileType}`}</b> is not supported.</p>
    </div>
  )
}