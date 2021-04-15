const express = require('express')
const app = express()
const port = 4000
const mongoose = require('mongoose')
const bodyParser = require('body-parser')
const config = require("./config/key")
const cookieParer = require("cookie-parser")
const usersRouter = require('./api/users')

app.use('/api/users', usersRouter)

//application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({extended: true}))

//application/json
app.use(bodyParser.json())
app.use(cookieParer())

app.get('/', (req, res) => {

})

mongoose.connect(config.mongoURI, {
    useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true, useFindAndModify: false
}).then(() => console.log('MongoDB Connected'))
    .catch(err => console.log(err))


app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
})
