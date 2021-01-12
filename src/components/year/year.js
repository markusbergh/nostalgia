import React from 'react'

import GlobalStateContext from '../../context/global'

import styles from './year.css'

const Year = () => (
  <GlobalStateContext.Consumer>
    {({ year }) => <p className={styles.year}>{year}</p>}
  </GlobalStateContext.Consumer>
)

export default Year
