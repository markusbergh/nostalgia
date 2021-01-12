import React from 'react'
import { MockedProvider } from '@apollo/client/testing'
import { render, screen, waitFor } from '@testing-library/react'
import { act } from 'react-dom/test-utils'
import 'regenerator-runtime/runtime'

import Timeline from './timeline'
import GET_COLLECTION from '../../api/queries/getCollection'

// Mock Intersection Observer API
window.IntersectionObserver = jest.fn(function () {
  this.observe = jest.fn()
  this.unobserve = jest.fn()
  this.disconnect = jest.fn()
})

describe('[Container] Timeline', () => {
  const timelineMock = {
    request: {
      query: GET_COLLECTION,
      variables: {
        order: 'date_DESC',
      },
    },
    result: {
      data: {
        blogPosts: {
          items: [
            {
              sys: {
                id: '1',
              },
              title: 'Title 1',
              lowRes: {
                url: '//image1-url?w=600',
              },
              date: '2021-01-01T12:00:00.000Z',
              highRes: {
                url: '//image-url?w=1200',
              },
              gridSpanStart: '1',
              gridSpanEnd: '6',
              __typename: 'BlogPost', // Needed when using fragments
            },
            {
              sys: {
                id: '2',
              },
              title: 'Title 2',
              lowRes: {
                url: '//image2-url?w=600',
              },
              date: '2020-12-31T12:00:00.000Z',
              highRes: {
                title: 'Image title',
                contentType: 'image/jpeg',
                url: '//image-url?w=1200',
              },
              gridSpanStart: '6',
              gridSpanEnd: '12',
              __typename: 'BlogPost', // Needed when using fragments
            },
          ],
        },
      },
    },
  }

  beforeEach(() => {
    render(
      <MockedProvider mocks={[timelineMock]} addTypename={false}>
        <Timeline />
      </MockedProvider>
    )
  })

  it('renders without issues', () => {
    expect(screen.getByText(/Loading/)).not.toBeNull()
  })

  it('renders when data has been resolved', async () => {
    await act(() => {
      return new Promise(resolve => setTimeout(resolve, 0))
    })

    expect(screen.getByAltText('Title 1')).toBeInTheDocument()
    expect(screen.getByAltText('Title 2')).toBeInTheDocument()

    const currentYear = new Date().getFullYear()
    expect(screen.getByText(currentYear)).toBeInTheDocument()
  })
})

describe('[Container] Timeline', () => {
  it('renders an error when appropriate', async () => {
    const errorMock = {
      request: {
        query: GET_COLLECTION,
        variables: {
          order: 'date_DESC',
        },
      },
      response: new Error('An error occurred'),
    }

    render(
      <MockedProvider mocks={[errorMock]} addTypename={false}>
        <Timeline />
      </MockedProvider>
    )

    await act(() => {
      return new Promise(resolve => setTimeout(resolve, 0))
    })

    expect(screen.getByText(/Error/)).toBeInTheDocument()
  })
})
