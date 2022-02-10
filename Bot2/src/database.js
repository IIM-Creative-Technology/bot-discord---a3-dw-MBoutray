const mysql = require('mysql')

const connection = mysql.createConnection({
  host: process.env.DATABASE_HOST,
  user: process.env.DATABASE_USER,
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE_NAME
})

module.exports.connect = () => {
  connection.connect((error) => {
    if (error) {
      console.error('An error occured while connecting to the database: ' + error)
    } else {
      console.log('Connection to the database established.')
    }
  })
}

module.exports.executeQuery = (query) => {
  return new Promise((resolve, reject) => {
    connection.query(query, (err, results) => {
      if (err) reject(err)
      resolve(results)
    })
  })
}
