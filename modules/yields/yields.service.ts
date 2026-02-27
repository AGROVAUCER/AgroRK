import { supabaseAdmin } from '../../src/lib/supabaseAdmin'

type YieldFilters = {
  orgId: string
  from?: string
  to?: string
  fieldId?: string
  cropId?: string
  status?: string // default DONE
}

type WorkEntryRow = any

type YieldRow = {
  cropId: string | null
  cropName: string | null
  fieldId: string | null
  fieldName: string | null
  unit: string | null
  totalQuantity: number
  countEntries: number
}

const toIso = (s: string) => new Date(s).toISOString()

export const buildYieldsReport = async (filters: YieldFilters): Promise<YieldRow[]> => {
  let q = supabaseAdmin
    .from('WorkEntry')
    .select(
      `
      id,
      date,
      entryType,
      status,
      quantity,
      unit,
      cropId,
      fieldId,
      crop:Crop(id,name),
      field:Field(id,name)
    `
    )
    .eq('orgId', filters.orgId)
    .eq('entryType', 'WORK')
    .eq('status', filters.status ?? 'DONE')

  if (filters.from) q = q.gte('date', toIso(filters.from))
  if (filters.to) q = q.lte('date', toIso(filters.to))

  if (filters.fieldId) q = q.eq('fieldId', filters.fieldId)
  if (filters.cropId) q = q.eq('cropId', filters.cropId)

  const { data, error } = await q
  if (error) throw new Error(error.message)

  const rows = (data ?? []) as WorkEntryRow[]

  // group by cropId + fieldId + unit (da ne mešamo jedinice)
  const map = new Map<string, YieldRow>()

  for (const r of rows) {
    const qty = typeof r.quantity === 'number' ? r.quantity : null
    if (qty === null) continue // nema prinosa bez količine

    const cropId = r.cropId ?? null
    const fieldId = r.fieldId ?? null
    const unit = r.unit ?? null

    const cropName = r.crop?.name ?? null
    const fieldName = r.field?.name ?? null

    const key = `${cropId ?? 'null'}|${fieldId ?? 'null'}|${unit ?? 'null'}`

    const prev = map.get(key)
    if (!prev) {
      map.set(key, {
        cropId,
        cropName,
        fieldId,
        fieldName,
        unit,
        totalQuantity: qty,
        countEntries: 1,
      })
    } else {
      prev.totalQuantity += qty
      prev.countEntries += 1
    }
  }

  // sort: cropName asc, fieldName asc
  const out = Array.from(map.values())
  out.sort((a, b) => {
    const ac = (a.cropName ?? '').localeCompare(b.cropName ?? '')
    if (ac !== 0) return ac
    return (a.fieldName ?? '').localeCompare(b.fieldName ?? '')
  })

  return out
}