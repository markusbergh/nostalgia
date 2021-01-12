import React, { useState } from 'react'
import { useQuery } from '@apollo/client'

import Year from '../../components/year'
import List from '../../components/list'
import Loader from '../../components/loader'
import Error from '../../components/error'

import GlobalStateContext from '../../context/global'

import GET_COLLECTION from '../../api/queries/getCollection'

const Timeline = () => {
  const [year, updateYear] = useState(new Date().getFullYear())

  const { loading, error, data } = useQuery(GET_COLLECTION, {
    variables: {
      order: 'date_DESC',
    },
  })

  if (loading) return <Loader />
  if (error) return <Error />

  return (
    <GlobalStateContext.Provider
      value={{
        year: year,
        onUpdateYear: updateYear,
      }}
    >
      <List items={data.blogPosts.items} />
      <Year />
    </GlobalStateContext.Provider>
  )
}

export default Timeline
