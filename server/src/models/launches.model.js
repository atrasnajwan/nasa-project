const launches = new Map()
const launch = {
    flightNumber: 100,
    mission: "Test mission",
    rocket: 'Rocker name',
    launchDate: new Date('28 December 2025'),
    destination: 'Kepler',
    customer: ['NASA'],
    upcoming: true,
    success: true
}

// init value
launches.set(launch.flightNumber, launch)

module.exports = {
    launches
}