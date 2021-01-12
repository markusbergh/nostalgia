import { gql } from '@apollo/client'

const GET_ABOUT_PAGE = gql`
  query GetPage($id: String!) {
    page: staticPage(id: $id) {
      body {
        json
      }
    }
  }
`

export default GET_ABOUT_PAGE
