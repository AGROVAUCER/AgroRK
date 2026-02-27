import { supabaseAdmin } from '../../src/lib/supabaseAdmin'

type FieldRow = any

export const listFields = async (orgId: string): Promise<FieldRow[]> => {
  const { data, error } = await supabaseAdmin
    .from('Field')
    .select('*')
    .eq('orgId', orgId)
    .order('createdAt', { ascending: false })

  if (error) throw new Error(error.message)
  return data ?? []
}

export const createField = async (orgId: string, payload: any): Promise<FieldRow> => {
  const row = {
    ...payload,
    aliases: payload?.aliases ?? [],
    orgId,
  }

  const { data, error } = await supabaseAdmin
    .from('Field')
    .insert(row)
    .select('*')
    .single()

  if (error) throw new Error(error.message)
  return data
}

export const updateField = async (
  orgId: string,
  id: string,
  patch: any
): Promise<FieldRow> => {
  const { data, error } = await supabaseAdmin
    .from('Field')
    .update(patch)
    .eq('orgId', orgId)
    .eq('id', id)
    .select('*')
    .single()

  if (error) throw new Error(error.message)
  return data
}

export const deleteField = async (orgId: string, id: string): Promise<void> => {
  const { error } = await supabaseAdmin
    .from('Field')
    .delete()
    .eq('orgId', orgId)
    .eq('id', id)

  if (error) throw new Error(error.message)
}