import style from './AudioViewer.module.css'

export default function AudioViewer(props) {
  return (
    <audio className={style.audio} controls src={props.src}>
      Audio playback is not supported by your browser.
    </audio>
  )
}