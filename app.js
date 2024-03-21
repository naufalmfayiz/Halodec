const express = require('express')
const app = express()
const session = require('express-session')
const port = 3000

app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: true }))

app.use(session({
  secret: 'kepo',
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: false,
    sameSite: true
  }
}))

app.use(require('./routers'))



app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})