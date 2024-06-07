const express = require('express')
const { getAllPlanets } = require('./planets.controller')

const planetRoutes = express.Router()

planetRoutes.get('/planets', getAllPlanets)

module.exports = planetRoutes