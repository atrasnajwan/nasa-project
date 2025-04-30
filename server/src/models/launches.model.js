const Launch = require('./launches.mongo')
const Planet = require('./planets.mongo')

// UPSERT
const createLaunchDb = async (launch) => {
    const planet = await Planet.findOne({ keplerName: launch.target })
    if (!planet) {
        throw new Error(`Planet ${launch.target} not found!`)
    }
    //.updateOne will $setOnInsert on db and place it on launch variable
    await Launch.findOneAndUpdate({
        flightNumber: launch.flightNumber
    }, launch, {
        upsert: true
    })
}

// init value, DEV
// const launch = {
//     flightNumber: 100,
//     mission: "Test mission",
//     rocket: 'Rocker name',
//     launchDate: new Date('28 December 2025'),
//     target: 'Kepler',
//     customers: ['NASA'],
//     upcoming: true,
//     success: true
// }
// createLaunchDb(launch)

const getAllLaunches = async () => await Launch.find({}, "-_id -__v") // '-' means exclude

const getLastFlightNumber = async () => {
    const lastLaunch = await Launch.findOne().sort('-flightNumber') // '-' means descending
    if (!lastLaunch) {
        return 1  // default flight number
    }

    return lastLaunch.flightNumber
}

const createNewLaunch = async (launch) => {
    const lastFlightNumber = await getLastFlightNumber() + 1
    const newLaunchData = Object.assign(launch, {
        flightNumber: lastFlightNumber,
        customers: ['Silverkidd', 'NASA'],
        upcoming: true,
        success: true
    })

    await createLaunchDb(newLaunchData)
    return newLaunchData
}



const isLaunchExist = async (id) => {
    const launch = await Launch.findOne({ flightNumber: id })
    return launch !== null
}

const abortLaunch = async (id) => {
    const aborted = await Launch.updateOne({ flightNumber: id }, {
        upcoming: false,
        success: false
    })
    // https://mongoosejs.com/docs/api/model.html#Model.updateOne()
    return aborted.modifiedCount === 1
}

module.exports = {
    getAllLaunches,
    createNewLaunch,
    isLaunchExist,
    abortLaunch
}