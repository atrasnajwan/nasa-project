const express = require('express')
const { httpGetAllLaunches, httpCreateNewLaunch, httpAbortLaunch } = require('./launches.controller')

const launchesRouter = express.Router()

launchesRouter.get('/', httpGetAllLaunches)
launchesRouter.post('/', httpCreateNewLaunch)
launchesRouter.delete('/:id', httpAbortLaunch)

module.exports = launchesRouter