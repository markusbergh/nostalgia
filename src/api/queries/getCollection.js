import { gql } from '@apollo/client'

const lowResWidth = 250
const highResWidth = 1500

const GET_COLLECTION = gql`
  query GetCollection($order: [BlogPostOrder], $skip: Int, $limit: Int!) {
    blogPosts: blogPostCollection(order: $order, skip: $skip, limit: $limit) {
      items {
        sys {
          id
        }
        ...LowResImage
        ...ContentFields
      }
    }
  }

  fragment ContentFields on BlogPost {
    title
    date
    highRes: image {
      url(transform: {
        width: ${highResWidth}
      })
    }
    gridSpanStart
    gridSpanEnd
  }

  fragment LowResImage on BlogPost {
    lowRes: image {
      url(transform: {
        width: ${lowResWidth}
      })
    }
  }
`

export default GET_COLLECTION
