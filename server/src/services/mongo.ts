import config from '../config/config'
import mongoose from 'mongoose'

const MONGO_URL: string = config.mongoUrl

// event emitter on mongoose
mongoose.connection.on("open", () => {
    console.log("MongoDB connect success")
})
mongoose.connection.on("error", (error: Error) => {
    console.error(error)
})

async function connectDb() {
    return mongoose.connect(MONGO_URL)
}

async function closeDb() {
    return mongoose.disconnect()
}

export {
    connectDb,
    closeDb
}