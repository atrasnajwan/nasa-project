const { getAllLaunches, createNewLaunch } = require("../../models/launches.model")

const httpGetAllLaunches = (req, res) => {
    return res.status(200).json(getAllLaunches)
}

const httpCreateNewLaunch = (req, res) => {
    const newLaunch = createNewLaunch(req.body)
    return res.status(201).json(newLaunch)
}
module.exports = {
    httpGetAllLaunches,
    httpCreateNewLaunch
}