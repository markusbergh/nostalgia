import React from 'react'
import PropTypes from 'prop-types'

import Item from '../item'

import styles from './list.css'

const List = ({ items }) => {
  const posts = items.map(item => {
    const {
      sys,
      date,
      title,
      lowRes,
      highRes,
      gridSpanStart,
      gridSpanEnd,
    } = item

    const gridSpan = {
      start: parseInt(gridSpanStart),
      end: parseInt(gridSpanEnd) + 1,
    }

    return (
      <Item
        key={sys.id}
        title={title}
        date={date}
        gridSpan={gridSpan}
        lowRes={lowRes.url}
        highRes={highRes.url}
      />
    )
  })

  return <ul className={styles.list}>{posts}</ul>
}

List.propTypes = {
  items: PropTypes.arrayOf(PropTypes.object).isRequired,
}

export default List
