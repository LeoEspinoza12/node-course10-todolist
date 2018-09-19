

// instead of adding the secret key and the database url
// we will create the a new separate file where
// we can store our secret and and the database url

// then we can just require it when in the app.js

const dbName = 'toDo';


module.exports = {
  'secretKey': '12345-67890-09876-54321',
  'mongoUrl': `mongodb://localhost:27017/${dbName}`
}
