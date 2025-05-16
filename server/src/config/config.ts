import dotenv from 'dotenv'

dotenv.config()

interface Config {
    port: number
    mongoUrl: string
}

const config: Config = {
    port: Number(process.env.PORT) || 3000,
    mongoUrl: process.env.MONGO_URL || '',
}

export default config