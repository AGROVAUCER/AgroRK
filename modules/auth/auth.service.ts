// modules/auth/auth.service.ts
import jwt from 'jsonwebtoken'
import bcrypt from 'bcryptjs'
import { supabaseAdmin } from '../../src/lib/supabaseAdmin'

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

const JWT_SECRET: string = (() => {
  const v = process.env.JWT_SECRET
  if (!v) throw new Error('JWT_SECRET missing')
  return v
})()

export async function findUserByEmailOrPhone(email?: string | null, phone?: string | null) {
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

export async function findUserById(id: string) {
  const { data, error } = await supabaseAdmin
    .from('User')
    .select('id,name,email,phone,passwordHash,role,isActive,orgId')
    .eq('id', id)
    .maybeSingle<AuthUser>()

  if (error) throw new Error(error.message)
  return data ?? null
}

export async function verifyPassword(passwordHash: string, password: string) {
  return bcrypt.compare(password, passwordHash)
}

export function signAccessToken(payload: { id: string; orgId: string | null; role: string }) {
  return jwt.sign({ sub: payload.id, orgId: payload.orgId, role: payload.role }, JWT_SECRET, {
    expiresIn: '7d',
  })
}