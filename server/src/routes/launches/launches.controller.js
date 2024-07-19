const { getAllLaunches, createNewLaunch } = require("../../models/launches.model")

const httpGetAllLaunches = (req, res) => {
    return res.status(200).json(getAllLaunches())
}

const httpCreateNewLaunch = (req, res) => {
    const launch = req.body
    // validation
    if(
        !launch.mission || !launch.rocket ||
        !launch.target || !launch.launchDate
    ) {
        return res.status(400).json({
            error: 'Missing required property'
        })
    }

    launch.launchDate = new Date(launch.launchDate)
    // is Not a Number
    if(isNaN(launch.launchDate)) {
        return res.status(400).json({
            error: 'Invalid launchDate'
        })
    }
    const newLaunch = createNewLaunch(launch)
    return res.status(201).json(newLaunch)
}
module.exports = {
    httpGetAllLaunches,
    httpCreateNewLaunch
}