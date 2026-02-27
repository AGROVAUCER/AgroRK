import { randomUUID } from 'crypto'
import { supabaseAdmin } from '../../src/lib/supabaseAdmin'

type ClientRow = any

export const listClients = async (orgId: string): Promise<ClientRow[]> => {
  const { data, error } = await supabaseAdmin
    .from('Client')
    .select('*')
    .eq('orgId', orgId)
    .order('createdAt', { ascending: false })

  if (error) throw new Error(error.message)
  return data ?? []
}

export const createClient = async (orgId: string, payload: any): Promise<ClientRow> => {
  const row = {
  id: randomUUID(),
  ...payload,
  aliases: payload?.aliases ?? [],
  orgId,
}

  const { data, error } = await supabaseAdmin
    .from('Client')
    .insert(row)
    .select('*')
    .single()

  if (error) throw new Error(error.message)
  return data
}

export const updateClient = async (
  orgId: string,
  id: string,
  patch: any
): Promise<ClientRow> => {
  const { data, error } = await supabaseAdmin
    .from('Client')
    .update(patch)
    .eq('orgId', orgId)
    .eq('id', id)
    .select('*')
    .single()

  if (error) throw new Error(error.message)
  return data
}

export const deleteClient = async (orgId: string, id: string): Promise<void> => {
  const { error } = await supabaseAdmin
    .from('Client')
    .delete()
    .eq('orgId', orgId)
    .eq('id', id)

  if (error) throw new Error(error.message)
}