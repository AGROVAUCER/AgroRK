import 'express'

declare global {
  namespace Express {
    interface Request {
      user?: {
        id?: string
        role?: string
        orgId?: string | null
      }
      orgId?: string
    }
  }
}

export {}