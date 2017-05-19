module.exports = function(PORT){
  return {
    development: {
      serverUrl: `http://localhost:${PORT}`,
      mongoUrl: process.env.PASSPORTDB_MONGO_URL
    },
    production: {
      serverUrl: 'https://passport-js-demo.herokuapp.com',
      mongoUrl: process.env.MONGODB_URI
    }
  }
}
