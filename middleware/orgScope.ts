import type { NextFunction, Request, Response } from 'express'

export const orgScope = (req: Request, res: Response, next: NextFunction) => {
  const orgId = (req as any).user?.orgId

  if (typeof orgId !== 'string' || orgId.trim().length === 0) {
    return res.status(401).json({ message: 'Missing orgId in token' })
  }

  ;(req as any).orgId = orgId
  next()
}
