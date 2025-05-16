import mongoose from 'mongoose'

const planetsSchema = new mongoose.Schema({
    keplerName: {
        type: String,
        required: true
    }
})

const Planet = mongoose.model("Planet", planetsSchema)

export default Planet
