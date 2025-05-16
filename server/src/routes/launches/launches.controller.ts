import { getAllLaunches, scheduleNewLaunch, isLaunchExist, abortLaunch, LaunchData } from "../../models/launches.model"
import { getPagination } from '../../services/apiQuery'
import { Request, Response } from 'express'

async function httpGetAllLaunches(req: Request, res: Response): Promise<any> {
    const { skip, limit } = getPagination(req.query)

    return res.status(200).json(await getAllLaunches(skip, limit))
}

async function httpCreateNewLaunch(req: Request, res: Response): Promise<any> {
    const launch: LaunchData = req.body
    // validation
    if (
        !launch.mission || !launch.rocket ||
        !launch.target || !launch.launchDate
    ) {
        return res.status(400).json({
            error: 'Missing required property'
        })
    }

    launch.launchDate = new Date(launch.launchDate)

    if (!isFinite(+launch.launchDate)) {
        return res.status(400).json({
            error: 'Invalid launchDate'
        })
    }
    try {
        const newLaunch = await scheduleNewLaunch(launch)
        return res.status(201).json(newLaunch)
    } catch (error) {
        return res.status(400).json({ error })
    }
}

async function httpAbortLaunch(req: Request, res: Response): Promise<any> {
    const launchId = Number(req.params.id)
    const exist = await isLaunchExist(launchId)

    if (!exist) {
        return res.status(404).json({
            error: 'Launch Not Found'
        })
    }
    const isAborted = abortLaunch(launchId)
    if (!isAborted) {
        return res.status(400).json({
            error: 'Can not abort the launch'
        })
    }
    return res.status(200).json({
        ok: true
    })
}

export {
    httpGetAllLaunches,
    httpCreateNewLaunch,
    httpAbortLaunch
}