import Launch from "./launches.mongo"
import Planet from "./planets.mongo"

const SPACEX_API_URL: string = "https://api.spacexdata.com/v4"

interface LaunchData {
    flightNumber?: number
    customers?: Array<string>
    upcoming?: boolean
    success?: boolean
    target?: string
    mission: string
    rocket: string
    launchDate: Date
}

interface LaunchFilter {
    flightNumber?: number
    mission?: string
}

interface SpaceXPayload {
    customers: string
}

interface SpaceXDocs {
    flight_number: number
    name: string
    rocket: { name: string }
    date_local: string
    payloads: Array<SpaceXPayload>
    upcoming: boolean
    success: boolean
}

interface SpaceXData {
    docs: Array<SpaceXDocs>
}


// UPSERT
async function createLaunchDb(launch: LaunchData): Promise<any> {
    //.updateOne will $setOnInsert on db and place it on launch variable
    return await Launch.findOneAndUpdate({
        flightNumber: launch.flightNumber
    }, launch, {
        upsert: true
    })
}

async function getAllLaunches(skip: number, limit: number): Promise<any> {
    return await Launch
        .find({}, "-_id -__v") // '-' means exclude
        .sort({ flightNumber: -1 }) // '-' descending
        .skip(skip) // similar to offset
        .limit(limit)
}

async function getLastFlightNumber(): Promise<number> {
    const lastLaunch = await Launch.findOne().sort('-flightNumber') // '-' means descending
    if (!lastLaunch) {
        return 1  // default flight number
    }

    return lastLaunch.flightNumber
}

async function scheduleNewLaunch(launch: LaunchData): Promise<LaunchData> {
    const planet = await Planet.findOne({ keplerName: launch.target })

    if (!planet) {
        throw new Error(`Planet ${launch.target} not found!`)
    }

    const lastFlightNumber = await getLastFlightNumber() + 1
    const newLaunchData: LaunchData = Object.assign(launch, {
        flightNumber: lastFlightNumber,
        customers: ['Silverkidd', 'NASA'],
        upcoming: true,
        success: true
    })

    await createLaunchDb(newLaunchData)
    return newLaunchData
}

async function findLaunch(filter: LaunchFilter): Promise<any> {
    return await Launch.findOne(filter)
}

async function isLaunchExist(id: number): Promise<boolean> {
    const launch = await findLaunch({ flightNumber: id })
    return launch !== null
}

async function abortLaunch(id: number): Promise<boolean> {
    const aborted = await Launch.updateOne({ flightNumber: id }, {
        upcoming: false,
        success: false
    })
    // https://mongoosejs.com/docs/api/model.html#Model.updateOne()
    return aborted.modifiedCount === 1
}

async function getSpaceXLaunches(): Promise<Array<LaunchData>> {
    const response: Response = await fetch(`${SPACEX_API_URL}/launches/query`, {
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

    const data: SpaceXData = await response.json()
    const launchDataDocs = data.docs.map((d) => {
        const payloads = d.payloads
        // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/flatMap
        const customers = payloads.flatMap((payload) => payload.customers)
        return {
            flightNumber: d.flight_number,
            mission: d.name,
            rocket: d.rocket.name,
            launchDate: new Date(d.date_local),
            customers,
            upcoming: d.upcoming,
            success: d.success
        }
    })
    return launchDataDocs
}

async function loadLaunches(): Promise<any> {
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

export {
    getAllLaunches,
    scheduleNewLaunch,
    isLaunchExist,
    abortLaunch,
    loadLaunches,
    LaunchData
}