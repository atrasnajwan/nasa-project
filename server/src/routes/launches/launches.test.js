const request = require('supertest')
const app = require('../../app')
const { connectDb, closeDb } = require('../../services/mongo')

describe("Test /launches API", () => {
    beforeAll(async () => {
        await connectDb()
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
        const launchData = {
            mission: 'Test mission',
            rocket: 'Test rocket',
            target: 'Kepler-62 f',
            launchDate: '2024-01-01'
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
