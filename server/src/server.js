const http = require('http')
const app = require('./app')
const mongoose = require('mongoose')
const { loadPlanets } = require('./models/planets.model')
const { log, error } = require('console')

const PORT = process.env.PORT || 8000
const server = http.createServer(app)
const MONGO_PASSWORD =  process.env.MONGO_PASSWORD 
const MONGO_APP =  process.env.MONGO_APP || "nasa-cluster"
const MONGO_URL = `mongodb+srv://nasa-api:${MONGO_PASSWORD}@nasa-cluster.adkkiow.mongodb.net/?retryWrites=true&w=majority&appName=${MONGO_APP}`

mongoose.connection.on("open", () => {
    console.log("MongoDB connect success")
})
mongoose.connection.on("error", (error) => {
    console.error(error)
})


const startServer = async () => {
    // connect to db
    await mongoose.connect(MONGO_URL)
    // Load data
    await loadPlanets()

    server.listen(PORT, () => {
        console.log(`Listening to ${PORT}...`)
    })
}

startServer()
