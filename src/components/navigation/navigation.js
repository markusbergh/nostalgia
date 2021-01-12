import React from 'react'
import PropTypes from 'prop-types'
import { NavLink } from 'react-router-dom'

import routes from '../../routes/routes'

import styles from './navigation.css'

const NavigationItem = ({ route }) => (
  <li key={route.name} className={styles.navigation__list_item}>
    <NavLink to={route.path}>
      <p>{route.name}</p>
    </NavLink>
  </li>
)

NavigationItem.propTypes = {
  route: PropTypes.object,
}

const Navigation = () => (
  <nav className={styles.navigation}>
    <ul className={styles.navigation__list}>
      {routes.map(route => (
        <NavigationItem key={route.name} route={route} />
      ))}
    </ul>
  </nav>
)

export default Navigation
