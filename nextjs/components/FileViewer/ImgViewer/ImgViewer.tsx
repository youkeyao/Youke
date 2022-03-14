import style from './ImgViewer.module.css'

export default function ImgViewer(props) {
  return (
    <img className={style.image} src={props.src} alt="loading..." />
  )
}