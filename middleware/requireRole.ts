import type { Response, NextFunction } from 'express'
import type { AppRole } from '../config/auth'

export function requireRole(role: string | string[]) {
  const roles = Array.isArray(role) ? role : [role]

  return (req: any, res: Response, next: NextFunction) => {
    if (!req.user?.role) return res.status(401).json({ message: 'Unauthorized' })

    const userRole = req.user.role as AppRole
    if (userRole === 'SUPER_ADMIN') return next()

    if (!roles.includes(userRole)) return res.status(403).json({ message: 'Forbidden' })
    return next()
  }
}
