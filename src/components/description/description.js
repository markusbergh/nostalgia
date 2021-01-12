import React from 'react'
import PropTypes from 'prop-types'
import { BLOCKS } from '@contentful/rich-text-types'
import { documentToReactComponents } from '@contentful/rich-text-react-renderer'

import styles from './description.css'

// Use custom renderer for heading
const Title = ({ header }) => (
  <h1 className={styles.description__title}>{header}</h1>
)

Title.propTypes = {
  header: PropTypes.string,
}

const options = {
  renderNode: {
    [BLOCKS.HEADING_1]: (node, children) => <Title>{children}</Title>,
  },
}

const Description = ({ body }) => {
  const content = documentToReactComponents(body, options)

  return (
    <div className={styles.description__wrapper}>
      <div className={styles.description__text}>{content}</div>
    </div>
  )
}

Description.propTypes = {
  body: PropTypes.object,
}

export default Description
