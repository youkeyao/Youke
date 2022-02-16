import { useRef, useState } from 'react';
import Router from 'next/router';
import style from '../styles/Login.module.css'

import Dialog from "../components/Dialog/Dialog"

export default function Login(props) {
  const [isShowDialog, SetDialog]: [boolean, Function] = useState(false);
  const userRef = useRef(null);
  const pswRef = useRef(null);

  const login = (e) => {
    e.preventDefault();
    fetch("/api/login", {body: JSON.stringify({username: userRef.current.value, password: pswRef.current.value}), method: 'POST'}).then((res) => {
      if (res.status != 200) {
        userRef.current.value = '';
        pswRef.current.value = '';
        SetDialog(true);
        return;
      }
      Router.push({pathname: "/icloud"})
    });
  }

  return (
    <div className={style.main}>
      <div className={style.container}>
        <h1 className={style.title}>LOGIN</h1>
        <form className={style.form} onSubmit={login}>
          <input className={style.input} type="text" required={true} placeholder="Username" ref={userRef}></input>
          <input className={style.input} type="password" required={true} placeholder="Password" ref={pswRef}></input>
          <button className={style.button} type="submit">login</button>
        </form>
      </div>
      <Dialog isShowDialog={isShowDialog} SetDialog={SetDialog} isShowInput={false} title='Login Fail'></Dialog>
    </div>
  )
}
