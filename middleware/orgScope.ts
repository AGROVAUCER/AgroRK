import type { NextFunction, Request, Response } from 'express'

export const orgScope = (req: Request, res: Response, next: NextFunction) => {
  const orgId = (req as any).user?.orgId

  if (!orgId || typeof orgId !== 'string') {
    return res.status(401).json({ message: 'Missing org scope' })
  }

  ;(req as any).orgId = orgId
  next()
}