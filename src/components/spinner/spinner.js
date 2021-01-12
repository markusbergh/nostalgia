import React, { useEffect, useState } from 'react'
import SVGSpinner from 'react-svg-spinner'

import styles from './spinner.css'

const Spinner = () => {
  const [size, setSize] = useState({ width: 35, height: 35 })

  useEffect(() => {
    const matchMedia = window.matchMedia('(max-width: 1024px)')

    // Bump up size a bit
    if (matchMedia.matches) {
      setSize({
        width: 60,
        height: 60,
      })
    }
  }, [])

  return (
    <div className={styles.spinner}>
      <SVGSpinner
        width={size.width}
        height={size.height}
        color="#000"
      />
    </div>
  )
}

export default Spinner
