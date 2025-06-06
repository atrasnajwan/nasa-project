import request from 'supertest'
import app from '../../app'
import { connectDb, closeDb } from '../../services/mongo'
import { loadPlanets } from '../../models/planets.model'
import { LaunchData } from '../../models/launches.model'

describe("Test /launches API", () => {
    beforeAll(async () => {
        await connectDb()
        await loadPlanets()
    })

    afterAll(async() => {
        await closeDb()
    })

    describe('GET /launches', () => {
        test('It should be OK', async () => {
            await request(app).get('/launches')
                .expect('Content-Type', /json/)
                .expect(200)
        })
    })

    describe('POST /launches', () => {
        const launchData: LaunchData = {
            mission: 'Test mission',
            rocket: 'Test rocket',
            target: 'Kepler-62 f',
            launchDate: new Date('2024-01-01')
        }
        const launchDataWithoutDate = {
            mission: 'Test mission',
            rocket: 'Test rocket',
            target: 'Kepler-62 f'
        }
        const launchDataWithInvalidDate = {
            mission: 'Test mission',
            rocket: 'Test rocket',
            target: 'Kepler-62 f',
            launchDate: 'test'
        }


        test('It should be CREATED(201)', async () => {
            const response = await request(app).post('/launches')
                .send(launchData)
                .expect('Content-Type', /json/)
                .expect(201)
            const requestDate = new Date(launchData.launchDate).valueOf()
            const responseDate = new Date(response.body.launchDate).valueOf()

            expect(responseDate).toBe(requestDate)
            expect(response.body).toMatchObject(launchDataWithoutDate)
        })


        test('It should be FAILED(400) missing attribute', async () => {
            const response = await request(app).post('/launches')
                .send(launchDataWithoutDate)
                .expect('Content-Type', /json/)
                .expect(400)
            expect(response.body).toStrictEqual({
                error: 'Missing required property'
            })
        })

        test('It should be FAILED(400) invalid launchDate', async () => {
            const response = await request(app).post('/launches')
                .send(launchDataWithInvalidDate)
                .expect('Content-Type', /json/)
                .expect(400)
            expect(response.body).toStrictEqual({
                error: 'Invalid launchDate'
            })
        })
    })
})
