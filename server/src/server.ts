require('dotenv').config()
import http from 'http'
import app from './app'
import config from './config/config'
import { connectDb } from './services/mongo'
import { loadPlanets } from './models/planets.model'
import { loadLaunches } from './models/launches.model'

const PORT = config.port
const server = http.createServer(app)

async function startServer(): Promise<void> {
    // connect to db
    console.log("Connecting to db...")
    await connectDb()
    // Load data
    await loadPlanets()
    await loadLaunches()

    server.listen(PORT, () => {
        console.log(`Listening to ${PORT}...`)
    })
}

startServer()
