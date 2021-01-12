import React, { useRef, useState } from 'react'
import { useQuery } from '@apollo/client'

import Year from '../../components/year'
import List from '../../components/list'
import Loader from '../../components/loader'
import Error from '../../components/error'

import GlobalStateContext from '../../context/global'

import GET_COLLECTION from '../../api/queries/getCollection'

// Needed to keep track of current `page`
const step = { current: 0 }

const Timeline = () => {
  const [year, updateYear] = useState(new Date().getFullYear())
  const page = useRef(step.current)

  const { data, loading, error, fetchMore } = useQuery(
    GET_COLLECTION,
    {
      variables: {
        order: 'date_DESC',
        // Only show five at a time
        limit: 5,
      },
    }
  )

  if (loading) return <Loader />
  if (error) return <Error />

  return (
    <GlobalStateContext.Provider
      value={{
        year: year,
        onUpdateYear: updateYear,
      }}
    >
      <List
        items={data.blogPosts.items}
        onLoadMore={() => {
          const newPage = page.current + 5

          // Update ref
          page.current = newPage

          // Update holder of current page, maybe this should be set in props?
          step.current = newPage

          fetchMore({
            variables: { skip: newPage },
          })
        }}
      />
      <Year />
    </GlobalStateContext.Provider>
  )
}

export default Timeline
