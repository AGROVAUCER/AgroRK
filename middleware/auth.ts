import type { Response, NextFunction } from 'express'
import jwt from 'jsonwebtoken'
import type { AppRole } from '../config/auth'

type JwtPayloadAny = { sub?: string; role?: string; orgId?: string | null }

const JWT_SECRET: string = (() => {
  const v = process.env.JWT_SECRET
  if (!v) throw new Error('JWT_SECRET missing')
  return v
})()

export type AuthOptions = {
  optional?: boolean
}

const parseTokenPayload = (token: string) => {
  const payload = jwt.verify(token, JWT_SECRET) as JwtPayloadAny
  const sub = typeof payload.sub === 'string' ? payload.sub : ''
  const rawRole = typeof payload.role === 'string' ? payload.role : ''
  const role: AppRole | null =
    rawRole === 'SUPER_ADMIN' || rawRole === 'ADMIN' || rawRole === 'USER'
      ? (rawRole as AppRole)
      : null
  const orgId =
    typeof payload.orgId === 'string' && payload.orgId.trim().length > 0
      ? payload.orgId
      : null

  if (!sub || !role) throw new Error('Invalid token payload')

  return { id: sub, role, orgId }
}

export function authMiddleware(req: any, res: Response, next: NextFunction) {
  const header = req.headers.authorization
  const authHeader = typeof header === 'string' ? header : ''
  const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : null

  if (!token) return res.status(401).json({ message: 'Unauthorized' })

  try {
    req.user = parseTokenPayload(token)
    return next()
  } catch {
    return res.status(401).json({ message: 'Unauthorized' })
  }
}

// routes koriste auth() i auth({ optional: true })
export function auth(opts?: AuthOptions) {
  return (req: any, res: Response, next: NextFunction) => {
    if (opts?.optional) {
      const header = req.headers.authorization
      const authHeader = typeof header === 'string' ? header : ''
      const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : null

      if (!token) {
        req.user = undefined
        return next()
      }

      try {
        req.user = parseTokenPayload(token)
        return next()
      } catch {
        req.user = undefined
        return next()
      }
    }

    return authMiddleware(req, res, next)
  }
}
