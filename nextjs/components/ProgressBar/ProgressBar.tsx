import style from "./ProgressBar.module.css"

export default function ProgressBar(props) {
  return (
    props.per == 0 ? <div></div> :
    <div className={style.progressBar}>
      <div className={style.barContent} style={{width: props.per + '%'}}></div>
    </div>
  )
}