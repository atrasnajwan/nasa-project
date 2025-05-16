import { getAllPlanets } from '../../models/planets.model'
import { Request, Response } from 'express'

async function httpGetAllPlanets(_: Request, res: Response): Promise<any> {
    return res.status(200).json(await getAllPlanets())
}

export {
    httpGetAllPlanets
}