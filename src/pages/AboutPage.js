import React from 'react'
import { useQuery } from '@apollo/client'

import Description from '../components/description'
import Loader from '../components/loader'
import Error from '../components/error'

import GET_ABOUT_PAGE from '../api/queries/getAboutPage'

const AboutPage = () => {
  const { loading, error, data } = useQuery(GET_ABOUT_PAGE, {
    variables: {
      id: '212hBqHyA5Hyt7otVJiRsx',
    },
  })

  if (loading) return <Loader />
  if (error) return <Error />

  return <Description body={data.page.body.json} />
}

export default AboutPage
