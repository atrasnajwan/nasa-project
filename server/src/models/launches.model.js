const launches = new Map()
let lastFlightNumber = 100

const launch = {
    flightNumber: 100,
    mission: "Test mission",
    rocket: 'Rocker name',
    launchDate: new Date('28 December 2025'),
    target: 'Kepler',
    customers: ['NASA'],
    upcoming: true,
    success: true
}

// init value
launches.set(launch.flightNumber, launch)

const getAllLaunches = () => Array.from(launches.values())

const createNewLaunch = (launch) => {
    lastFlightNumber += 1
    launches.set(lastFlightNumber, Object.assign(launch, {
        flightNumber: lastFlightNumber,
        customers: ['NASA'],
        upcoming: true,
        success: true
    }))
    return launch
}

const isLaunchExist = (id) => launches.has(id)

const abortLaunch = (id) => {
    const aborted = launches.get(id)
    aborted.upcoming = false
    aborted.success = false
    
    return aborted
}

module.exports = {
    getAllLaunches,
    createNewLaunch,
    isLaunchExist,
    abortLaunch
}