import express, { Request, Response } from 'express'
import cors from 'cors'
import path from 'path'
import morgan from 'morgan'
import api from './routes/api'
import config from './config/config'
const app = express()

app.use(cors({
    origin: [
        `http://localhost:${config.port}`,
        `http://127.0.0.1:${config.port}`,
        `http://0.0.0.0:${config.port}`
    ]
}))

// logging
app.use(morgan('combined'))

// serve static files from builded react app
app.use(express.static(path.join(__dirname, "..", "public")))

app.use(express.json())
// API
app.use('/', api)

// fix routes on production mode
// https://create-react-app.dev/docs/deployment/
app.get('/*', (_: Request, res: Response) => {
    return res.sendFile(path.join(__dirname, "..", "public", "index.html"))
})

export default app