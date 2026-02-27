import { randomUUID } from 'crypto'
import { supabaseAdmin } from '../../src/lib/supabaseAdmin'

type CropRow = any

export const listCrops = async (orgId: string): Promise<CropRow[]> => {
  const { data, error } = await supabaseAdmin
    .from('Crop')
    .select('*')
    .eq('orgId', orgId)
    .order('name', { ascending: true })

  if (error) throw new Error(error.message)
  return data ?? []
}

export const createCrop = async (orgId: string, payload: any): Promise<CropRow> => {
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
    .from('Crop')
    .insert(row)
    .select('*')
    .single()

  if (error) throw new Error(error.message)
  return data
}

export const updateCrop = async (orgId: string, id: string, patch: any): Promise<CropRow> => {
  const now = new Date().toISOString()

  const { data, error } = await supabaseAdmin
    .from('Crop')
    .update({
      ...patch,
      updatedAt: now,
    })
    .eq('orgId', orgId)
    .eq('id', id)
    .select('*')
    .single()

  if (error) throw new Error(error.message)
  return data
}

export const deleteCrop = async (orgId: string, id: string): Promise<void> => {
  const { error } = await supabaseAdmin
    .from('Crop')
    .delete()
    .eq('orgId', orgId)
    .eq('id', id)

  if (error) throw new Error(error.message)
}