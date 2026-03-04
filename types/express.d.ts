import 'express'
import type { AppRole } from '../config/auth'

declare global {
  namespace Express {
    interface Request {
      user?: {
        id?: string
        role?: AppRole
        orgId?: string | null
      }
      orgId?: string
    }
  }
}

export {}
