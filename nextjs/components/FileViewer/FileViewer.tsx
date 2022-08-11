import style from "./FileViewer.module.css"

import AudioViewer from "./AudioViewer/AudioViewer";
import VideoViewer from "./VideoViewer/VideoViewer";
import ImgViewer from "./ImgViewer/ImgViewer";
import TextViewer from "./TextViewer/TextViewer";
import UnsupportedViewer from "./UnsupportedViewer/UnsupportedViewer";

export default function FileViewer(props) {
  const getDriver = () => {
    switch (props.fileType) {
      case 'mp3': {
        return AudioViewer;
      }
      case 'mp4': {
        return VideoViewer;
      }
      case 'jpg':
      case 'png': {
        return ImgViewer;
      }
      case 'cpp':
      case 'html':
      case 'txt': {
        return TextViewer;
      }
      default: {
        return UnsupportedViewer;
      }
    }
  }
  const Driver = getDriver();

  return (
    <div className={style.container}>
      <Driver fileType={props.fileType} src={props.src} />
    </div>
  )
}
