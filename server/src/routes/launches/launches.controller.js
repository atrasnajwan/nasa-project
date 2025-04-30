const { getAllLaunches, createNewLaunch, isLaunchExist, abortLaunch } = require("../../models/launches.model")

const httpGetAllLaunches = async (req, res) => {
    return res.status(200).json(await getAllLaunches())
}

const httpCreateNewLaunch = async (req, res) => {
    const launch = req.body
    // validation
    if (
        !launch.mission || !launch.rocket ||
        !launch.target || !launch.launchDate
    ) {
        return res.status(400).json({
            error: 'Missing required property'
        })
    }

    launch.launchDate = new Date(launch.launchDate)
    // is Not a Number
    if (isNaN(launch.launchDate)) {
        return res.status(400).json({
            error: 'Invalid launchDate'
        })
    }
    try {
        const newLaunch = await createNewLaunch(launch)
        return res.status(201).json(newLaunch)
    } catch (error) {
        return res.status(400).json({ error })
    }
}

const httpAbortLaunch = async (req, res) => {
    const launchId = Number(req.params.id)
    const exist = await isLaunchExist(launchId)

    if (!exist) {
        return res.status(404).json({
            error: 'Launch Not Found'
        })
    }
    const isAborted = abortLaunch(launchId)
    if (!isAborted) {
        return res.status(400).json({
            error: 'Can not abort the launch'
        })
    }
    return res.status(200).json({
        ok: true
    })
}

module.exports = {
    httpGetAllLaunches,
    httpCreateNewLaunch,
    httpAbortLaunch
}