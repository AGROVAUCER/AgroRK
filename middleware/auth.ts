import type { Response, NextFunction } from 'express'
import jwt from 'jsonwebtoken'

type JwtPayloadAny = { sub?: string; role?: string; orgId?: string | null }

const JWT_SECRET: string = (() => {
  const v = process.env.JWT_SECRET
  if (!v) throw new Error('JWT_SECRET missing')
  return v
})()

export function authMiddleware(req: any, res: Response, next: NextFunction) {
  const header = req.headers.authorization
  const authHeader = typeof header === 'string' ? header : ''
  const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : null

  if (!token) return res.status(401).json({ message: 'Unauthorized' })

  try {
    const payload = jwt.verify(token, JWT_SECRET) as JwtPayloadAny
    req.user = { id: payload.sub, role: payload.role, orgId: payload.orgId ?? null }
    return next()
  } catch {
    return res.status(401).json({ message: 'Unauthorized' })
  }
}

// routes uvoze { auth }
export const auth = authMiddleware