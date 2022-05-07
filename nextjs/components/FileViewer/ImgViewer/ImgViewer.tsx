import style from './ImgViewer.module.css'

export default function ImgViewer(props) {
  return (
    <img className={style.image} src={"/api/auth/downloadFile?path="+props.src} alt="loading..." />
  )
}