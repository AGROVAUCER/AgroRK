// middleware/requireAdmin.ts
import type { Request, Response, NextFunction } from 'express'

export function requireAdmin(req: any, res: Response, next: NextFunction) {
  if (!req.user?.id) return res.status(401).json({ message: 'Unauthorized' })
  if (req.user?.role !== 'ADMIN') return res.status(403).json({ message: 'Forbidden' })
  return next()
}