import type { Request, Response } from 'express'
import { asyncHandler } from '../../utils/asyncHandler'
import { buildYieldsReport } from './yields.service'

export const listYields = asyncHandler(async (req: Request, res: Response) => {
  const orgId = (req as any).orgId as string

  const from = typeof req.query.from === 'string' ? req.query.from : undefined
  const to = typeof req.query.to === 'string' ? req.query.to : undefined
  const fieldId = typeof req.query.fieldId === 'string' ? req.query.fieldId : undefined
  const cropId = typeof req.query.cropId === 'string' ? req.query.cropId : undefined
  const status = typeof req.query.status === 'string' ? req.query.status : 'DONE'

  const data = await buildYieldsReport({
    orgId,
    from,
    to,
    fieldId,
    cropId,
    status,
  })

  res.json(data)
})