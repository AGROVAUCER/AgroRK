import { randomUUID } from 'crypto'
import { supabaseAdmin } from '../../src/lib/supabaseAdmin'

type OperationRow = any

const toCanonicalKey = (name: string) => {
  const s = String(name ?? '').trim().toLowerCase()

  // basic latinization for Serbian diacritics
  const latin = s
    .replace(/č/g, 'c')
    .replace(/ć/g, 'c')
    .replace(/š/g, 's')
    .replace(/đ/g, 'dj')
    .replace(/ž/g, 'z')

  return latin
    .replace(/[^a-z0-9]+/g, '_')
    .replace(/^_+|_+$/g, '')
    .toUpperCase()
}

type OperationCreate = {
  name: string
  applyTo: 'WORK' | 'SERVICE' | 'BOTH'
  aliases?: string[]
  userName?: string
  canonicalKey?: string
}

export const listOperations = async (orgId: string): Promise<OperationRow[]> => {
  const { data, error } = await supabaseAdmin
    .from('Operation')
    .select('*')
    .eq('orgId', orgId)
    .order('name', { ascending: true })

  if (error) throw new Error(error.message)
  return data ?? []
}

export const createOperation = async (orgId: string, payload: OperationCreate): Promise<OperationRow> => {
  const name = String(payload?.name ?? '').trim()
  const canonicalKey = String(payload?.canonicalKey ?? '').trim() || toCanonicalKey(name)

  const row = {
    id: randomUUID(),
    name,
    applyTo: payload.applyTo,
    canonicalKey, // REQUIRED by DB
    aliases: payload?.aliases ?? [],
    userName: payload?.userName ?? null,
    orgId,
  }

  const { data, error } = await supabaseAdmin
    .from('Operation')
    .insert(row)
    .select('*')
    .single()

  if (error) throw new Error(error.message)
  return data
}

export const updateOperation = async (orgId: string, id: string, patch: any): Promise<OperationRow> => {
  const updateData: any = {}

  if (patch?.name !== undefined) updateData.name = String(patch.name).trim()
  if (patch?.applyTo !== undefined) updateData.applyTo = patch.applyTo
  if (patch?.userName !== undefined) updateData.userName = patch.userName
  if (patch?.aliases !== undefined) updateData.aliases = patch.aliases ?? []

  // allow explicit canonicalKey change OR regenerate if name changed and canonicalKey not provided
  if (patch?.canonicalKey !== undefined) {
    updateData.canonicalKey = String(patch.canonicalKey).trim()
  } else if (patch?.name !== undefined) {
    updateData.canonicalKey = toCanonicalKey(String(patch.name))
  }

  const { data, error } = await supabaseAdmin
    .from('Operation')
    .update(updateData)
    .eq('orgId', orgId)
    .eq('id', id)
    .select('*')
    .single()

  if (error) throw new Error(error.message)
  return data
}

export const deleteOperation = async (orgId: string, id: string): Promise<void> => {
  const { error } = await supabaseAdmin
    .from('Operation')
    .delete()
    .eq('orgId', orgId)
    .eq('id', id)

  if (error) throw new Error(error.message)
}