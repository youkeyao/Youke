import ReactPlayer from 'react-player';
import style from './VideoViewer.module.css'

export default function VideoViewer(props) {
  return (
    <ReactPlayer
      className={style.video}
      controls
      url={"/api/auth/downloadFile?path="+props.src}
      width={"80vw"}
      height={"60vw"}
    >
      Video playback is not supported by your browser.
    </ReactPlayer>
  )
}
