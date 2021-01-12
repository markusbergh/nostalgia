import { InMemoryCache } from '@apollo/client'

export default new InMemoryCache({
  typePolicies: {
    Query: {
      fields: {
        blogPostCollection: {
          keyArgs: false,

          merge(existing = {}, incoming, { args: { skip = 0 } }) {
            const merged = existing.items
              ? existing.items.slice(0)
              : []

            for (let i = 0; i < incoming.items.length; ++i) {
              merged[skip + i] = incoming.items[i]
            }

            return {
              items: merged,
              skip: skip,
            }
          },
        },
      },
    },
  },
})
