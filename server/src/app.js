const express = require('express')
const cors = require('cors')
const path = require('path')
const morgan = require('morgan')
const api = require('./routes/api')


const app = express()

app.use(cors({
    origin: `http://localhost:${process.env.PORT || 3000}`
}))

// logging
app.use(morgan('combined'))

// serve static files from builded react app
app.use(express.static(path.join(__dirname, "..", "public")))

app.use(express.json())
// API
app.use('/', api)

// fix routes on production mode
// https://create-react-app.dev/docs/deployment/
app.get('/*', (req, res) => {
    return res.sendFile(path.join(__dirname, "..", "public", "index.html"))
})

module.exports = app