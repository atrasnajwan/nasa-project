const fs = require('fs')
const path = require('path')
const { parse } = require('csv-parse')
const Planet = require('./planets.mongo')

const planetsCsv = path.join(__dirname, '..', '..', 'data', 'kepler_data.csv')

const isHabitable = (planet) => {
    return planet['koi_disposition'] === 'CONFIRMED'
        && planet['koi_insol'] > 0.36
        && planet['koi_insol'] < 1.11
        && planet['koi_prad'] < 1.6
}

const loadPlanets = () => {
    return new Promise((resolve, reject) => {
        fs.createReadStream(planetsCsv)
            .pipe(parse({
                comment: '#',
                columns: true
            }))
            .on('data', async (data) => {
                if (isHabitable(data)) await updatePlanet(data)
            })
            .on('error', (error) => {
                console.log('ERROR: ', error)
                reject(error)
            })
            .on('end', async () => {
                const count = (await getAllPlanets()).length
                console.log(`${count} planets succesfully load`)
                resolve()
            })
    })
}

const updatePlanet = async (planet) => await Planet.updateOne({
    keplerName: planet.kepler_name // WHERE
}, {
    keplerName: planet.kepler_name // ACTION
}, {
    upsert: true    // UPSERT
})

const getAllPlanets = async () => await Planet.find({}, "keplerName -_id") // show field keplerName and exclude _id

module.exports = {
    loadPlanets,
    getAllPlanets
}