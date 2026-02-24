import type { Response, NextFunction } from 'express'

export function requireRole(role: string | string[]) {
  const roles = Array.isArray(role) ? role : [role]

  return (req: any, res: Response, next: NextFunction) => {
    if (!req.user?.role) return res.status(401).json({ message: 'Unauthorized' })
    if (!roles.includes(req.user.role)) return res.status(403).json({ message: 'Forbidden' })
    return next()
  }
}