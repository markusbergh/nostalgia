import {
  ApolloClient,
  InMemoryCache,
  createHttpLink,
} from '@apollo/client'

const spaceId = process.env.CONTENTFUL_SPACE_ID
const uri = process.env.GRAPHQL_URI.replace('{SPACE}', spaceId)
const accessToken = process.env.CONTENTFUL_DELIVERY_ACCESS_TOKEN

const client = new ApolloClient({
  link: createHttpLink({
    uri: uri,
    headers: {
      authorization: `Bearer ${accessToken}`,
    },
  }),
  cache: new InMemoryCache().restore(window.__APOLLO_STATE__ || {}),
  ssrForceFetchDelay: 300,
})

export default client
