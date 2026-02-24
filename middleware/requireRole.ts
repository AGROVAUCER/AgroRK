import type { Response, NextFunction } from 'express'
import type { UserRole } from './auth'

export function requireRole(role: UserRole) {
  return (req: any, res: Response, next: NextFunction) => {
    if (!req.user?.role) return res.status(401).json({ message: 'Unauthorized' })
    if (req.user.role !== role) return res.status(403).json({ message: 'Forbidden' })
    return next()
  }
}