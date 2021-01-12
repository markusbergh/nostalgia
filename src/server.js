require('dotenv').config()

import express from 'express'
import path from 'path'
import fetch from 'cross-fetch'

import React from 'react'
import { renderToString } from 'react-dom/server'
import { StaticRouter } from 'react-router-dom'

import {
  ApolloProvider,
  ApolloClient,
  createHttpLink,
  InMemoryCache,
  HttpLink,
} from '@apollo/client'

import { getDataFromTree } from '@apollo/client/react/ssr'

import App from './app.js'

const isDev = process.env.NODE_ENV === 'development'
const SERVER_PORT = process.env.PORT || 3000

const app = express()

app.use(express.static(path.join(__dirname, 'public')))

app.disable('x-powered-by')

let bundleInfo

if (!isDev) {
  // Needed to extract the hashed names for bundles
  bundleInfo = require('public/stats.json')
}

const getPaths = () => {
  let cssPath = ''
  let jsPath = '<script src="./client.js"></script>'

  if (!isDev) {
    cssPath = `<link rel="stylesheet" href="${bundleInfo.css}" />`
    jsPath = `<script src="${bundleInfo.js}"></script>`
  }

  return { cssPath, jsPath }
}

app.get('/*', (req, res) => {
  const spaceId = process.env.CONTENTFUL_SPACE_ID
  const uri = process.env.GRAPHQL_URI.replace('{SPACE}', spaceId)
  const accessToken = process.env.CONTENTFUL_DELIVERY_ACCESS_TOKEN

  const client = new ApolloClient({
    // Only fetch once since being on the server side
    ssrMode: true,
    link: new createHttpLink({
      uri,
      // Global fetch
      fetch,
      headers: {
        authorization: `Bearer ${accessToken}`,
      },
      fetchOptions: {
        mode: 'no-cors',
      },
    }),
    cache: new InMemoryCache(),
  })

  const context = {}

  const Root = (
    <StaticRouter location={req.url} context={context}>
      <ApolloProvider client={client}>
        <App />
      </ApolloProvider>
    </StaticRouter>
  )

  getDataFromTree(Root).then(() => {
    const initialState = client.extract()
    const parsedState = JSON.stringify(initialState).replace(
      /</g,
      '\\u003c'
    )

    // We are ready to render
    const appDataToRender = renderToString(Root)

    // Get bundle names for static files
    const { cssPath, jsPath } = getPaths()

    const html = `
        <!doctype html>
        <html>
          <head>
            <title>📸 — Markus Bergh</title>
            <link rel="shortcut icon" href="data:image/x-icon;," type="image/x-icon">
            <link rel="preconnect" href="https://fonts.gstatic.com">
            <link href="https://fonts.googleapis.com/css2?family=Arimo&display=swap" rel="stylesheet">
            ${cssPath}
          </head>
          <body>
            <div id="root">${appDataToRender}</div>
            <script>window.__APOLLO_STATE__=${parsedState}</script>
            ${jsPath}
          </body>
        </html>
      `

    if (context.url) {
      res.writeHead(301, {
        Location: context.url,
      })

      res.end()
    } else {
      res.send(html)
    }
  })
})

app.listen(SERVER_PORT, () => {
  console.log(`😎 Listening on port ${SERVER_PORT}`)
})
