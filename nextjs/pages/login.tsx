import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/router';
import style from '../styles/Login.module.css'

import Modal from "../components/Modal/Modal"

export default function Login(props) {
  const [isModalVisible, setModalVisible] = useState(false);
  const [modalTitle, setModalTitle] = useState('Loading...');
  const [modalType, setModalType] = useState<'None' | 'info'>('None');
  const userRef = useRef(null);
  const pswRef = useRef(null);
  const router = useRouter();

  const login = (e) => {
    e.preventDefault();
    router.push("/icloud?username=" + userRef.current.value + "&password=" + pswRef.current.value, "/icloud");
    setModalType('None');
    setModalTitle('Loading...');
    setModalVisible(true);
  }

  useEffect(() => {
    userRef.current.value = "";
    pswRef.current.value = "";
    setModalType('info');
    setModalTitle('Login Fail');
  }, [router])

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
        title={modalTitle}
        type={modalType}
        onClose={() => setModalVisible(false)}
      />
    </div>
  )
}
