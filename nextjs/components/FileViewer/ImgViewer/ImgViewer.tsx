import Image from "next/image"
import style from './ImgViewer.module.css'

export default function ImgViewer(props) {
  return (
    <Image className={style.image} src={"/api/auth/downloadFile?path="+props.src} alt="loading..." width={100} height={100} layout="responsive" />
  )
}