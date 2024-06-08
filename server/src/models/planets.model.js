const fs = require('fs')
const path = require('path')
const { parse } = require('csv-parse')

const planetsCsv = path.join(__dirname, '..', '..', 'data', 'kepler_data.csv') 
const habitablePlanets = []

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
        .on('data', (data) => {
            if(isHabitable(data)) habitablePlanets.push(data)
        })
        .on('error', (error) => {
            console.log('ERROR: ', error)
            reject(error)
        })
        .on('end', () => {
            console.log("Planets succesfully load")
            resolve()
        })
    })
}

const getAllPlanets = () => habitablePlanets

module.exports = {
    loadPlanets,
    getAllPlanets
}