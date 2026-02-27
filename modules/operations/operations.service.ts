import { randomUUID } from 'crypto'
import { supabaseAdmin } from '../../src/lib/supabaseAdmin'

type OperationRow = any

export const listOperations = async (orgId: string): Promise<OperationRow[]> => {
  const { data, error } = await supabaseAdmin
    .from('Operation')
    .select('*')
    .eq('orgId', orgId)
    .order('name', { ascending: true })

  if (error) throw new Error(error.message)
  return data ?? []
}

export const createOperation = async (
  orgId: string,
  payload: any
): Promise<OperationRow> => {
  const now = new Date().toISOString()

  const row = {
    id: randomUUID(),
    ...payload,
    aliases: payload?.aliases ?? [],
    orgId,
    createdAt: now,
    updatedAt: now,
  }

  const { data, error } = await supabaseAdmin
    .from('Operation')
    .insert(row)
    .select('*')
    .single()

  if (error) throw new Error(error.message)
  return data
}

export const updateOperation = async (
  orgId: string,
  id: string,
  patch: any
): Promise<OperationRow> => {
  const now = new Date().toISOString()

  const updateData: any = { updatedAt: now }

  if (patch?.name !== undefined) updateData.name = patch.name
  if (patch?.userName !== undefined) updateData.userName = patch.userName
  if (patch?.applyTo !== undefined) updateData.applyTo = patch.applyTo
  if (patch?.aliases !== undefined) updateData.aliases = patch.aliases ?? []

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