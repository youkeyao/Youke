import { useRef, useState } from 'react';
import { useRouter } from 'next/router';
import style from '../styles/Login.module.css'

import Modal from "../components/Modal/Modal"

export default function Login(props) {
  const [isModalVisible, setModalVisible] = useState(false);
  const userRef = useRef(null);
  const pswRef = useRef(null);
  const router = useRouter();

  const login = (e) => {
    e.preventDefault();
    fetch("/api/login", {
      body: JSON.stringify({username: userRef.current.value, password: pswRef.current.value}),
      method: 'POST'
    }).then((res) => {
      console.log(res);
      if (res.status != 200) {
        userRef.current.value = '';
        pswRef.current.value = '';
        setModalVisible(true);
        return;
      }
      router.replace("/icloud");
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
      <Modal
        isVisible={isModalVisible}
        title='Login Fail'
        onCancel={() => setModalVisible(false)}
        onConfirm={(e) => setModalVisible(false)}
      />
    </div>
  )
}
