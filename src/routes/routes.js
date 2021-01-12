import IndexPage from '../pages/IndexPage'
import AboutPage from '../pages/AboutPage'

const routes = [
  {
    path: '/',
    exact: true,
    name: 'Index',
    component: IndexPage,
  },
  {
    path: '/about',
    name: 'About',
    component: AboutPage,
  },
]

export default routes
