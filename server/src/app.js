const express = require('express')
const cors = require('cors')
const path = require('path')
const planetRoutes = require('./routes/planets/planets.router')

const app = express()

app.use(cors({
    origin: 'http://localhost:3000'
}))

// serve static files from builded react app
app.use(express.static(path.join(__dirname, "..", "public")))


app.use(express.json())
app.use(planetRoutes)

module.exports = app