import { ApolloClient, InMemoryCache, HttpLink } from '@apollo/client'

const link = new HttpLink({
  uri: '/graphql',
})

const client = new ApolloClient({
  link,
  cache: new InMemoryCache(),
  defaultOptions: {
    watchQuery: {
      fetchPolicy: 'cache-and-network',
      nextFetchPolicy: 'cache-first',
    },
    query: {
      fetchPolicy: 'network-only',
    },
  },
})

export default client
