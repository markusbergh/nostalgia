import React from 'react'
import { Route, Switch } from 'react-router'

// Entry-point for routes shared between client and server
import routes from './routes/routes'

import Navigation from './components/navigation'

import './app.css'

const App = () => (
  <>
    <Navigation />

    <main>
      <Switch>
        {routes.map(route => (
          <Route key={route.name} {...route} />
        ))}
      </Switch>
    </main>
  </>
)

export default App
