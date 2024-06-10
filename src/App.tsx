import { useState } from 'react'
import './App.less'
import styles from './App.module.less'
import sty from './style.module.css'

export function App() {
  const [counter, setCounter] = useState(0)
  return (
    <>
      <div className="box">box</div>
      <div className={styles.box}>box</div>
      <div className={sty.hello}></div>
      <p>{counter}</p>
      <button type="button" onClick={() => setCounter(p => p + 1)}>加1</button>
    </>
  )
}
