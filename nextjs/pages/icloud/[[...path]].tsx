import { useEffect, useRef, useState } from 'react';
import type { GetServerSideProps } from 'next';
import Link from 'next/link'

import style from '../../styles/iCloud.module.css'

import ProgressBar from "../../components/ProgressBar/ProgressBar"
import Dialog from "../../components/Dialog/Dialog"
import FileViewer from '../../components/FileViewer/FileViewer';

import { readDir, handlePath } from "../api/auth/getFiles"
import { isValid } from '../api/login';

export const getServerSideProps: GetServerSideProps = async (context) => {
  // 判断是否登陆
  /*if (!isValid(context.req.cookies.token)) {
    return {
      redirect: {
        destination: '/login',
        permanent: false,
      },
    }
  }*/
  
  const path = require('path');
  const p = context.query.path ? '/' + (context.query.path as string[]).join('/') : '/';
  // 处理路径
  const result = handlePath(p);

  // 若为文件，则预览，若为目录，显示所有文件信息
  if (result.type) {
    return {
      // 文件预览
      props: {
        path: p,
        filename: path.basename(decodeURI(p)),
        ext: path.extname(p).substring(1)
      },
    }
  }
  else if (result.path == p) {
    return {
      props: {
        path: path.join(p, '/'),
        // 获得目录下所有文件信息
        files: readDir(p)
      },
    }
  }
  else {
    return {
      redirect: {
        destination: '/icloud' + result.path,
        permanent: false,
      },
    }
  }
}

export default function ICloud(props) {
  const [files, SetFiles] = useState(props.files);
  const [percentage, SetPer]: [number, Function] = useState(0);
  const [isShowDialog, SetDialog]: [boolean, Function] = useState(false);
  const [isShowInput, SetInput]: [boolean, Function] = useState(false);
  const [dialogTitle, SetTitle]: [string, Function] = useState('');
  const inputRef = useRef(null);

  useEffect(() => {
    // 显示目录
    if (props.files) {
      SetFiles([...props.files]);
    }
  }, [props.files]);

  // 失败弹窗
  const failDialog = (msg) => {
    SetInput(false);
    SetTitle(msg);
    SetDialog(true);
  };

  // 上传文件
  const uploadFile = (e) => {
    if (e.target.files.length == 0) return;
    try {
      const form = new FormData();
      form.append("path", props.path);
      for (let i = 0; i < e.target.files.length; i ++) {
        form.append("files" + i, e.target.files[i]);
      }
      let obj = new XMLHttpRequest();
      // 完成
      obj.onreadystatechange = () => { 
        if (obj.status != 200 && obj.readyState == 4) {
          failDialog('Upload Fail');
        }
        SetPer(0);
        // 更新文件目录
        fetch("/api/auth/getFiles", {body: props.path, method: 'POST', credentials: 'include'}).then((res) => {
          return res.json();
        }).then((data) => {
          SetFiles([...data]);
        });
      }
      // 加载进度条
      obj.upload.onprogress = (evt) => {
        let per = (evt.loaded / evt.total) * 100;
        SetPer(per);
      }
      obj.open("post", "/api/auth/uploadFiles"); 
      obj.send(form);
    }
    catch (err) {
      failDialog('Upload Fail');
    }
    inputRef.current.value = null;
  };

  // 新建文件夹
  const newFolder = (str) => {
    if (str.search('/') != -1) {
      failDialog('Invalid Folder Name');
      return;
    }
    fetch("/api/auth/newFolder", {body: props.path + str, method: 'POST', credentials: 'include'}).then((res) => {
      if (res.status != 200) {
        throw new Error('New Folder Fail');
      }
      // 更新文件目录
      fetch("/api/auth/getFiles", {body: props.path, method: 'POST', credentials: 'include'}).then((res) => {
        return res.json();
      }).then((data) => {
        SetFiles([...data]);
      });
    }).catch((err) => {
      failDialog('New Folder Fail');
    });
  };

  // 删除文件或文件夹
  const deleteFile = (str) => {
    fetch("/api/auth/deleteFile", {body: props.path + str, method: 'POST', credentials: 'include'}).then((res) => {
      if (res.status != 200) {
        throw new Error('Delete Fail');
      }
      // 更新文件目录
      fetch("/api/auth/getFiles", {body: props.path, method: 'POST', credentials: 'include'}).then((res) => {
        return res.json();
      }).then((data) => {
        SetFiles([...data]);
      });
    }).catch((err) => {
      failDialog('Delete Fail');
    });
  }

  // 下载文件
  const downloadFile = (str) => {
    try {
      const tmpNode = document.createElement('a');
      tmpNode.download = str;
      tmpNode.style.display = 'none';
      tmpNode.href = "/api/auth/downloadFile?path="+props.path+str;
      document.body.appendChild(tmpNode);
      tmpNode.click();
      document.body.removeChild(tmpNode);
    }
    catch {
      failDialog('Download Fail');
    }
  }

  return (
    props.filename || !files ?
    // Preview
    <div className={style.preview}>
      <p className={style.title}>
        <Link href={'/icloud'+props.path.split('/').slice(0, -1).join('/')}>
          <a className={`${style.itemBtn} ${style.back}`}></a>
        </Link>
        {props.filename}
      </p>
      <FileViewer fileType={props.ext} src={props.path} />
    </div> :
    // iCloud
    <div className={style.main}>
      <div className={style.topArea}>
        <p className={style.title}>
          {props.path}
          <Link href={'/icloud'+props.path.split('/').slice(0, -2).join('/')}>
            <a className={`${style.itemBtn} ${style.up}`}></a>
          </Link>
        </p>
        <ProgressBar per={percentage} />
        <div>
          <input className={style.none} type='file' ref={inputRef} onChange={uploadFile} multiple></input>
          <a className={`${style.itemBtn} ${style.upload}`} onClick={() => inputRef.current.click()}></a>
          <a className={`${style.itemBtn} ${style.newFolder}`} onClick={() => {SetInput(true);SetTitle('New Folder');SetDialog(true);}}></a>
        </div>
      </div>
      <div className={style.row}>
        <p className={`${style.item} ${style.itemName} ${style.title}`}>Name</p>
        <div className={style.btnArea}></div>
        <p className={`${style.item} ${style.title}`}>Size</p>
        <p className={`${style.item} ${style.title}`}>Time</p>
      </div>
      <div className={style.fileArea}>
        {files.map((item) => (
          <div className={`${style.row} ${style.file}`} key={item.key}>
            <div className={`${style.item} ${style.itemName}`}>
              <Link href={'/icloud' + props.path + item.name}>
                <a target={"_self"}>{item.name}</a>
              </Link>
            </div>
            <div className={style.btnArea}>
              <a className={`${style.itemBtn} ${item.type ? style.download : style.none}`} onClick={() => downloadFile(item.name)}></a>
              <a className={`${style.itemBtn} ${style.delete}`} onClick={() => deleteFile(item.name)}></a>
            </div>
            <p className={style.item}>{item.size}</p>
            <p className={style.item}>{item.time}</p>
          </div>
        ))}
      </div>
      <Dialog isShowDialog={isShowDialog} SetDialog={SetDialog} isShowInput={isShowInput} title={dialogTitle} Func={newFolder} />
    </div>
  )
}
