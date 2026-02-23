import type { Request, Response, NextFunction } from 'express'
import jwt from 'jsonwebtoken'
import { loadEnv } from '../config/env'

const env = loadEnv()

declare global {
  // eslint-disable-next-line no-var
  var __authEnvLoaded: boolean | undefined
}

// minimalni req.user typing (ako već nemaš)
export type ReqUser = { id: string; role?: string; orgId?: string | null }

export function authMiddleware(req: Request & { user?: ReqUser }, res: Response, next: NextFunction) {
  const auth = req.headers.authorization || ''
  const token = auth.startsWith('Bearer ') ? auth.slice(7) : null
  if (!token) return res.status(401).json({ message: 'Unauthorized' })

  try {
    const payload: any = jwt.verify(token, env.JWT_SECRET)
    req.user = { id: payload.sub, role: payload.role, orgId: payload.orgId ?? null }
    return next()
  } catch {
    return res.status(401).json({ message: 'Unauthorized' })
  }
}