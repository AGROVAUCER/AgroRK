import { supabaseAdmin } from '../../src/lib/supabaseAdmin'

export type EntryType = 'WORK' | 'SERVICE'
export type EntryStatus = 'IN_PROGRESS' | 'DONE'
export type EntrySource = 'VOICE' | 'WEB'

type ListFilters = {
  orgId: string
  dateFrom?: Date
  dateTo?: Date
  entryType?: EntryType
  fieldId?: string
  clientId?: string
  operationId?: string
  status?: EntryStatus
  executorId?: string
  search?: string
  limit?: number
  cursor?: string
}

type WorkEntryRow = any

const clamp = (n: number, min: number, max: number) => Math.min(Math.max(n, min), max)

export const listEntries = async (filters: ListFilters) => {
  const take = clamp(filters.limit ?? 20, 1, 100)

  let q = supabaseAdmin
    .from('WorkEntry')
    .select(
      `
      *,
      field:Field(*),
      client:Client(*),
      operation:Operation(*),
      crop:Crop(*),
      executor:Executor(*),
      createdBy:User(*)
    `
    )
    .eq('orgId', filters.orgId)
    .order('date', { ascending: false })
    .limit(take)

  if (filters.dateFrom) q = q.gte('date', filters.dateFrom.toISOString())
  if (filters.dateTo) q = q.lte('date', filters.dateTo.toISOString())

  if (filters.entryType) q = q.eq('entryType', filters.entryType)
  if (filters.fieldId) q = q.eq('fieldId', filters.fieldId)
  if (filters.clientId) q = q.eq('clientId', filters.clientId)
  if (filters.operationId) q = q.eq('operationId', filters.operationId)
  if (filters.status) q = q.eq('status', filters.status)
  if (filters.executorId) q = q.eq('executorId', filters.executorId)

  if (filters.search) {
    const s = String(filters.search).replace(/,/g, '\\,')
    q = q.or(`note.ilike.%${s}%,voiceOriginalText.ilike.%${s}%`)
  }

  if (filters.cursor) {
    const { data: cursorRow, error: cursorErr } = await supabaseAdmin
      .from('WorkEntry')
      .select('id,date')
      .eq('orgId', filters.orgId)
      .eq('id', filters.cursor)
      .maybeSingle<{ id: string; date: string }>()

    if (cursorErr) throw new Error(cursorErr.message)
    if (cursorRow?.date) {
      q = q.lt('date', cursorRow.date)
    }
  }

  const { data, error } = await q
  if (error) throw new Error(error.message)
  return (data ?? []) as WorkEntryRow[]
}

export const getEntry = async (orgId: string, id: string) => {
  const { data, error } = await supabaseAdmin
    .from('WorkEntry')
    .select(
      `
      *,
      field:Field(*),
      client:Client(*),
      operation:Operation(*),
      crop:Crop(*),
      executor:Executor(*),
      createdBy:User(*)
    `
    )
    .eq('orgId', orgId)
    .eq('id', id)
    .maybeSingle<WorkEntryRow>()

  if (error) throw new Error(error.message)
  return data ?? null
}

export const ensureEntryRules = async (orgId: string, data: any) => {
  const entryType = data.entryType as EntryType

  if (entryType === 'WORK') {
    if (!data.fieldId) throw { status: 400, message: 'fieldId is required for WORK' }
    data.clientId = null
  }

  if (entryType === 'SERVICE') {
    if (!data.clientId) throw { status: 400, message: 'clientId is required for SERVICE' }
    data.fieldId = null
  }

  if (!data.operationId) throw { status: 400, message: 'operationId is required' }
  if (!data.date) throw { status: 400, message: 'date is required' }
  if (!data.status) throw { status: 400, message: 'status is required' }

  const source = (data.source ?? 'WEB') as EntrySource
  if (source === 'VOICE' && !data.voiceOriginalText) {
    throw { status: 400, message: 'voiceOriginalText is required when source=VOICE' }
  }

  const { data: op, error } = await supabaseAdmin
    .from('Operation')
    .select('id,orgId,canonicalKey')
    .eq('orgId', orgId)
    .eq('id', data.operationId)
    .maybeSingle<{ id: string; orgId: string; canonicalKey: string | null }>()

  if (error) throw new Error(error.message)
  if (!op) throw { status: 400, message: 'Invalid operationId' }

  if (String(op.canonicalKey ?? '').toUpperCase() === 'SOWING' && !data.cropId) {
    throw { status: 400, message: 'cropId is required for SOWING operation' }
  }
}

export const createEntry = async (orgId: string, createdByUserId: string, data: any) => {
  const payload = {
    date: data.date ? new Date(data.date).toISOString() : new Date().toISOString(),
    entryType: data.entryType as EntryType,
    fieldId: data.fieldId ?? null,
    clientId: data.clientId ?? null,
    operationId: data.operationId,
    cropId: data.cropId ?? null,
    executorId: data.executorId ?? null,
    quantity: data.quantity ?? null,
    unit: data.unit ?? null,
    status: data.status as EntryStatus,
    note: data.note ?? null,
    source: (data.source ?? 'WEB') as EntrySource,
    voiceOriginalText: data.voiceOriginalText ?? null,

    // NEW
    variety: data.variety ?? null,

    createdByUserId,
    orgId,
  }

  const { data: row, error } = await supabaseAdmin
    .from('WorkEntry')
    .insert(payload)
    .select('*')
    .single<WorkEntryRow>()

  if (error) throw new Error(error.message)
  return row
}

export const updateEntry = async (orgId: string, id: string, data: any) => {
  const patch: any = {}

  if (data.entryType !== undefined) patch.entryType = data.entryType
  if (data.operationId !== undefined) patch.operationId = data.operationId
  if (data.quantity !== undefined) patch.quantity = data.quantity
  if (data.unit !== undefined) patch.unit = data.unit
  if (data.status !== undefined) patch.status = data.status
  if (data.note !== undefined) patch.note = data.note
  if (data.source !== undefined) patch.source = data.source
  if (data.voiceOriginalText !== undefined) patch.voiceOriginalText = data.voiceOriginalText

  // NEW
  if (data.variety !== undefined) patch.variety = data.variety

  if (data.date !== undefined) patch.date = data.date ? new Date(data.date).toISOString() : null
  if (data.fieldId !== undefined) patch.fieldId = data.fieldId ?? null
  if (data.clientId !== undefined) patch.clientId = data.clientId ?? null
  if (data.cropId !== undefined) patch.cropId = data.cropId ?? null
  if (data.executorId !== undefined) patch.executorId = data.executorId ?? null

  const { data: row, error } = await supabaseAdmin
    .from('WorkEntry')
    .update(patch)
    .eq('orgId', orgId)
    .eq('id', id)
    .select('*')
    .single<WorkEntryRow>()

  if (error) throw new Error(error.message)
  return row
}

export const deleteEntry = async (orgId: string, id: string) => {
  const { error } = await supabaseAdmin.from('WorkEntry').delete().eq('orgId', orgId).eq('id', id)
  if (error) throw new Error(error.message)
  return { success: true }
}