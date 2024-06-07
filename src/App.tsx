import React from 'react'
import './App.less'
import styles from './App.module.less'
import sty from './style.module.css'

export function App() {
  return (
    <>
      <div className="box">box</div>
      <div className={styles.box}>box</div>
      <div className={sty.hello}></div>
    </>
  )
}
