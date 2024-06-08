const { launches } = require("../../models/launches.model")

const getAllLaunches = (req, res) => {
    const arrayLaunches = Array.from(launches.values())
    return res.status(200).json(arrayLaunches)
}

module.exports = {
    getAllLaunches
}