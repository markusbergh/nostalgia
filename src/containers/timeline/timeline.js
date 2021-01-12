import React, { useEffect, useRef, useState } from 'react'
import { useQuery } from '@apollo/client'

import Year from '../../components/year'
import List from '../../components/list'
import Loader from '../../components/loader'
import Error from '../../components/error'

import GlobalStateContext from '../../context/global'

import GET_COLLECTION from '../../api/queries/getCollection'
import Spinner from '../../components/spinner'

// Needed to keep track of current `page`
const step = { current: 0 }

const Timeline = () => {
  const [year, updateYear] = useState('')
  const [spinning, setSpinning] = useState(false)
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

  useEffect(() => {
    if (data && data.blogPosts && data.blogPosts.items.length > 0) {
      const firstDate = data.blogPosts.items[0].date

      if (year.length <= 0) {
        // Always set initial date to first in list
        updateYear(new Date(firstDate).getFullYear())
      }
    }
  }, [data])

  useEffect(() => {
    if (!spinning) {
      return
    }

    const hideSpinner = () => {
      setSpinning(false)
    }

    // Wait a tiny bit before hiding
    const spinnerTimeout = setTimeout(hideSpinner, 500)

    return () => {
      clearTimeout(spinnerTimeout)
    }
  }, [spinning])

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

          // Show spinner
          setSpinning(true)
        }}
        onHideSpinner={() => setSpinning(false)}
      />
      <Year />
      {spinning && <Spinner />}
    </GlobalStateContext.Provider>
  )
}

export default Timeline
