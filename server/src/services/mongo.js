const mongoose = require('mongoose')

const MONGO_PASSWORD = process.env.MONGO_PASSWORD
const MONGO_APP = process.env.MONGO_APP || "nasa-cluster"
// const MONGO_URL = `mongodb://nasa-api:${MONGO_PASSWORD}@nasa-cluster.adkkiow.mongodb.net/?retryWrites=true&w=majority&appName=${MONGO_APP}`
// used older connection method
const MONGO_URL = `mongodb://nasa-api:${MONGO_PASSWORD}@ac-kesvamv-shard-00-00.adkkiow.mongodb.net:27017,ac-kesvamv-shard-00-01.adkkiow.mongodb.net:27017,ac-kesvamv-shard-00-02.adkkiow.mongodb.net:27017/?ssl=true&replicaSet=atlas-os23kt-shard-0&authSource=admin&retryWrites=true&w=majority&appName=${MONGO_APP}`

// event emitter on mongoose
mongoose.connection.on("open", () => {
    console.log("MongoDB connect success")
})
mongoose.connection.on("error", (error) => {
    console.error(error)
})

const connectDb = async () => mongoose.connect(MONGO_URL)

const closeDb = async () => mongoose.disconnect()

module.exports = {
    connectDb,
    closeDb
}