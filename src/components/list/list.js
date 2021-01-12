import React, { useEffect, useRef, useState } from 'react'
import PropTypes from 'prop-types'

import Item from '../item'

import styles from './list.css'

const List = ({ items, onLoadMore }) => {
  const listRef = useRef()
  const scrollHeight = useRef(null)

  const [allImagesLoaded, setAllImagesLoaded] = useState(false)
  const imagesLoadedRef = useRef(0)

  const onImageInitialLoad = () => {
    imagesLoadedRef.current = imagesLoadedRef.current + 1

    if (imagesLoadedRef.current == items.length - 1) {
      setAllImagesLoaded(true)
    }
  }

  useEffect(() => {
    const handleScroll = () => {
      if (!scrollHeight.current) return

      const pageY = window.pageYOffset
      const viewportHeight = window.innerHeight

      if (pageY + viewportHeight >= scrollHeight.current) {
        onLoadMore()

        // Reset
        scrollHeight.current = null
      }
    }

    window.addEventListener('scroll', handleScroll)

    return () => {
      window.removeEventListener('scroll', handleScroll)
    }
  }, [])

  useEffect(() => {
    if (allImagesLoaded) {
      scrollHeight.current = listRef.current.clientHeight

      // Reset
      setAllImagesLoaded(false)
    }
  }, [allImagesLoaded])

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
        onImageInitialLoad={onImageInitialLoad}
      />
    )
  })

  return (
    <ul ref={listRef} className={styles.list}>
      {posts}
    </ul>
  )
}

List.propTypes = {
  items: PropTypes.arrayOf(PropTypes.object).isRequired,
}

export default List
