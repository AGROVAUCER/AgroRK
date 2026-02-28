import { randomUUID } from 'crypto'
import { supabaseAdmin } from '../../src/lib/supabaseAdmin'

type CropRow = any
type CropVarietyRow = any

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
  const row = {
    id: randomUUID(),
    ...payload,
    aliases: payload?.aliases ?? [],
    orgId,
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
  const updateData: any = {}

  if (patch?.name !== undefined) updateData.name = patch.name
  if (patch?.aliases !== undefined) updateData.aliases = patch.aliases ?? []

  const { data, error } = await supabaseAdmin
    .from('Crop')
    .update(updateData)
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

/* ============================
   Crop Varieties (Hibridi/Sortе)
============================ */

export const listCropVarieties = async (orgId: string, cropId: string): Promise<CropVarietyRow[]> => {
  const { data, error } = await supabaseAdmin
    .from('CropVariety')
    .select('*')
    .eq('orgId', orgId)
    .eq('cropId', cropId)
    .order('name', { ascending: true })

  if (error) throw new Error(error.message)
  return data ?? []
}

export const createCropVariety = async (orgId: string, cropId: string, payload: any): Promise<CropVarietyRow> => {
  const row = {
    id: randomUUID(),
    orgId,
    cropId,
    name: String(payload?.name ?? '').trim(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }

  const { data, error } = await supabaseAdmin
    .from('CropVariety')
    .insert(row)
    .select('*')
    .single()

  if (error) throw new Error(error.message)
  return data
}

export const deleteCropVariety = async (orgId: string, cropId: string, varietyId: string): Promise<void> => {
  const { error } = await supabaseAdmin
    .from('CropVariety')
    .delete()
    .eq('orgId', orgId)
    .eq('cropId', cropId)
    .eq('id', varietyId)

  if (error) throw new Error(error.message)
}