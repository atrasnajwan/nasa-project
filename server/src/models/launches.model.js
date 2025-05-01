const Launch = require('./launches.mongo')
const Planet = require('./planets.mongo')

const SPACEX_API_URL = "https://api.spacexdata.com/v4"
// UPSERT
const createLaunchDb = async (launch) => {
    //.updateOne will $setOnInsert on db and place it on launch variable
    await Launch.findOneAndUpdate({
        flightNumber: launch.flightNumber
    }, launch, {
        upsert: true
    })
}

const getAllLaunches = async (skip, limit) => await Launch
    .find({}, "-_id -__v") // '-' means exclude
    .sort({flightNumber: -1}) // '-' descending
    .skip(skip) // similar to offset
    .limit(limit)

const getLastFlightNumber = async () => {
    const lastLaunch = await Launch.findOne().sort('-flightNumber') // '-' means descending
    if (!lastLaunch) {
        return 1  // default flight number
    }

    return lastLaunch.flightNumber
}

const scheduleNewLaunch = async (launch) => {
    const planet = await Planet.findOne({ keplerName: launch.target })
    if (!planet) {
        throw new Error(`Planet ${launch.target} not found!`)
    }

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

const findLaunch = async (filter = {}) => await Launch.findOne(filter)

const isLaunchExist = async (id) => {
    const launch = await findLaunch({ flightNumber: id })
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

const getSpaceXLaunches = async () => {
    const response = await fetch(`${SPACEX_API_URL}/launches/query`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            // https://github.com/r-spacex/SpaceX-API/blob/master/docs/queries.md
            "query": {},
            "options": {
                "pagination": false,
                "populate": [
                    {
                        "path": "rocket",
                        "select": {
                            "name": 1
                        }
                    },
                    {
                        "path": "payloads",
                        "select": {
                            "customers": 1
                        }
                    }
                ]
            }
        }),
    })
    if (response.status !== 200) {
        throw new Error("Can't fetch from SpaceX open API")
    }
    const data = await response.json()
    const launchDataDocs = data.docs.map((d) => {
        const payloads = d.payloads
        // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/flatMap
        const customers = payloads.flatMap((payload) => payload.customers)
        return {
            flightNumber: d.flight_number,
            mission: d.name,
            rocket: d.rocket.name,
            launchDate: d.date_local,
            customers,
            upcoming: d.upcoming,
            success: d.success
        }
    })
    return launchDataDocs
}

const loadLaunches = async () => {
    console.log("Load launch data...")
    // TODO change to more appropiate way to reduce api calls
    const dataExist = await findLaunch({ flightNumber: 1, mission: "FalconSat" })
    if (dataExist) {
        console.log("done without insert new data")
        return
    }
    const apiResponse = await getSpaceXLaunches()

    for (const data of apiResponse) {
        // insert to db
        await createLaunchDb(data)
    }
    console.log("done")
}
module.exports = {
    getAllLaunches,
    scheduleNewLaunch,
    isLaunchExist,
    abortLaunch,
    loadLaunches
}