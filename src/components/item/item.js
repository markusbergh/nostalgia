import React, { useState, useEffect, useContext } from 'react'
import PropTypes from 'prop-types'

import useIntersect from '../../hooks/useIntersect'
import GlobalStateContext from '../../context/global'

import styles from './item.css'

const Item = ({
  title,
  date,
  lowRes,
  highRes,
  gridSpan,
  onImageInitialLoad,
}) => {
  // Used to update year
  const globalContext = useContext(GlobalStateContext)

  // Used in image transition from lower to higher resolution
  const [imageLoaded, setImageLoaded] = useState(false)

  // Set when the initial low resolution image has loaded
  const [initialImageLoaded, setInitialImageLoaded] = useState(false)

  // Always start with the lower resolution image
  const [imageUrl, setImageUrl] = useState(lowRes)

  // Use custom hook to lazy load images
  const [ref, entry] = useIntersect({
    threshold: 0.25,
  })

  // We can now do the image transition
  const handleOnLoad = () => {
    setImageLoaded(true)

    if (!initialImageLoaded) {
      setInitialImageLoaded(true)

      // Used ultimately in list component to set scroll height
      onImageInitialLoad()
    }
  }

  // Set new date in global context
  const updateYear = () => {
    const newYear = new Date(date).getFullYear()

    globalContext.onUpdateYear(newYear)
  }

  // Whenever entry is updated, check if it is intersecting
  useEffect(() => {
    if (entry.isIntersecting) {
      // Update image with higher resolution
      setImageUrl(highRes)

      // Update date
      updateYear()
    }
  }, [entry])

  // Custom styles set on rules
  let wrapperStyles = {
    gridColumn: `${gridSpan.start}/${gridSpan.end}`,
  }

  // Custom styles set on state
  const imageStyles = {
    filter: `${imageLoaded ? 'none' : 'blur(4px)'}`,
  }

  return (
    <li className={styles.item__wrapper} style={wrapperStyles}>
      <img
        className={styles.item__image}
        ref={ref}
        style={imageStyles}
        src={imageUrl}
        alt={title}
        onLoad={handleOnLoad}
      />
    </li>
  )
}

Item.propTypes = {
  title: PropTypes.string,
  date: PropTypes.string,
  lowRes: PropTypes.string,
  highRes: PropTypes.string,
  gridSpan: PropTypes.object,
}

export default Item
