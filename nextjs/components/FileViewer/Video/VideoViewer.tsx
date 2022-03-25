import style from './VideoViewer.module.css'

export default function VideoViewer(props) {
  return (
    <video className={style.video} controls src={"/api/auth/downloadFile?path="+props.src}>
      Video playback is not supported by your browser.
    </video>
  )
}