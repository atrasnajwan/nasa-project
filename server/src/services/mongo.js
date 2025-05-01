require('dotenv').config();
const mongoose = require('mongoose')

const MONGO_URL = process.env.MONGO_URL

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