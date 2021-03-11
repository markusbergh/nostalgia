const dotenv = require('dotenv')

const env = dotenv.config().parsed

// Helper function to set environmental keys
const keys = Object.keys(env).reduce((prev, next) => {
  prev[`process.env.${next}`] = JSON.stringify(env[next])

  return prev
}, {})

module.exports = keys
