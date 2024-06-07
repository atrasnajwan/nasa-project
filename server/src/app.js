const express = require('express')
const cors = require('cors')
const path = require('path')
const morgan = require('morgan')
const planetRoutes = require('./routes/planets/planets.router')

const app = express()

app.use(cors({
    origin: 'http://localhost:3000'
}))

// logging
app.use(morgan('combined'))

// serve static files from builded react app
app.use(express.static(path.join(__dirname, "..", "public")))


app.use(express.json())
app.use(planetRoutes)

module.exports = app