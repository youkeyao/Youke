import React, { useState } from 'react';

import style from './DropDown.module.css';

interface DropDownProps {
  options: string[];
  initSelected: string;
  onChange: (k: number) => void;
}

export default function DropDown({ options, initSelected, onChange }: DropDownProps) {
  const [isShow, setShow] = useState(true);
  const [selected, setSelected] = useState(initSelected);

  return(
    <div className={style.container}>
      <button className={style.button} onClick={() => setShow((shown) => !shown)}>
        {selected}
        <span className={isShow ? style.down : style.up} />
      </button>
      <div className={style.menu} style={{ display: isShow ? "none" : "block" }}>
        {
          options.map((value, index) => {
            return <a key={index} className={style.menuItem} onClick={() => {
              setShow(shown => !shown);
              setSelected(value);
              onChange(index);
            }}>{value}</a>
          })
        }
      </div>
    </div>
  )
}