import fs from 'fs'
import path from 'path'
import { parse } from 'csv-parse'
import Planet from './planets.mongo'

interface PlanetContent {
    koi_disposition: string
    koi_insol: number
    koi_prad: number
    kepler_name: string
}

const planetsCsv: string = path.join(__dirname, '..', '..', 'data', 'kepler_data.csv')

function isHabitable(planet: PlanetContent): boolean {
    return planet['koi_disposition'] === 'CONFIRMED'
        && planet['koi_insol'] > 0.36
        && planet['koi_insol'] < 1.11
        && planet['koi_prad'] < 1.6
}

function loadPlanets(): Promise<void> {
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

async function updatePlanet(planet: PlanetContent) {
    return await Planet.updateOne({
        keplerName: planet.kepler_name // WHERE
    }, {
        keplerName: planet.kepler_name // ACTION
    }, {
        upsert: true    // UPSERT
    })
}

async function getAllPlanets() {
    return await Planet.find({}, "keplerName -_id") // show field keplerName and exclude _id
}

export {
    loadPlanets,
    getAllPlanets
}