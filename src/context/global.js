import { createContext } from 'react'

/**
 * Note to self:
 * Be careful using Context API in a larger application
 * with a state that is updated often since it might trigger
 * many re-renders that could cause performance issues.
 *
 * Especially if value is something other than a primitive.
 */
const GlobalStateContext = createContext()

export default GlobalStateContext
