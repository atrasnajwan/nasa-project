const http = require('http')
const app = require('./app')
const { connectDb } = require('./services/mongo')
const { loadPlanets } = require('./models/planets.model')

const PORT = process.env.PORT || 8000
const server = http.createServer(app)



const startServer = async () => {
    // connect to db
    console.log("Connecting to db...")
    await connectDb()
    // Load data
    await loadPlanets()

    server.listen(PORT, () => {
        console.log(`Listening to ${PORT}...`)
    })
}

startServer()
