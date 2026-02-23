import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { supabaseAdmin } from '../../lib/supabaseAdmin'

const JWT_SECRET = process.env.JWT_SECRET
if (!JWT_SECRET) throw new Error('JWT_SECRET missing')

export type AuthUser = {
  id: string
  name: string
  email: string | null
  phone: string | null
  passwordHash: string
  role: string
  isActive: boolean
  orgId: string | null
}

export async function findUserByEmailOrPhone(
  email?: string | null,
  phone?: string | null,
  userId?: string | null
): Promise<AuthUser | null> {
  // Prioritet: userId (za /me), pa email, pa phone
  if (userId) {
    const { data, error } = await supabaseAdmin
      .from('User')
      .select('id,name,email,phone,passwordHash,role,isActive,orgId')
      .eq('id', userId)
      .maybeSingle<AuthUser>()

    if (error) throw new Error(error.message)
    return data ?? null
  }

  if (email) {
    const { data, error } = await supabaseAdmin
      .from('User')
      .select('id,name,email,phone,passwordHash,role,isActive,orgId')
      .eq('email', email)
      .maybeSingle<AuthUser>()

    if (error) throw new Error(error.message)
    return data ?? null
  }

  if (phone) {
    const { data, error } = await supabaseAdmin
      .from('User')
      .select('id,name,email,phone,passwordHash,role,isActive,orgId')
      .eq('phone', phone)
      .maybeSingle<AuthUser>()

    if (error) throw new Error(error.message)
    return data ?? null
  }

  return null
}

export async function verifyPassword(passwordHash: string, password: string): Promise<boolean> {
  return bcrypt.compare(password, passwordHash)
}

export function signAccessToken(payload: { id: string; orgId: string | null; role: string }) {
  return jwt.sign({ sub: payload.id, orgId: payload.orgId, role: payload.role }, JWT_SECRET, {
    expiresIn: '7d',
  })
}