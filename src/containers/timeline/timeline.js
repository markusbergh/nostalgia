import React, { useRef, useState } from 'react'
import { useQuery } from '@apollo/client'

import Year from '../../components/year'
import List from '../../components/list'
import Loader from '../../components/loader'
import Error from '../../components/error'

import GlobalStateContext from '../../context/global'

import GET_COLLECTION from '../../api/queries/getCollection'

const Timeline = () => {
  const [year, updateYear] = useState(new Date().getFullYear())

  // Needed to keep track of current `page`
  const page = useRef(0)

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
          page.current = newPage

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
