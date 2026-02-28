import { randomUUID } from 'crypto'
import { supabaseAdmin } from '../../src/lib/supabaseAdmin'

type FieldCropRow = any

export type UpsertFieldCropInput = {
  orgId: string
  fieldId: string
  cropId: string
  variety: string | null
  sownAt: string
  entryId: string
}

export const upsertActiveFieldCrop = async (input: UpsertFieldCropInput) => {
  // deactivate previous active crop on field
  const { error: deactivateErr } = await supabaseAdmin
    .from('FieldCrop')
    .update({ isActive: false, updatedAt: new Date().toISOString() })
    .eq('orgId', input.orgId)
    .eq('fieldId', input.fieldId)
    .eq('isActive', true)

  if (deactivateErr) throw new Error(deactivateErr.message)

  const row = {
    id: randomUUID(),
    orgId: input.orgId,
    fieldId: input.fieldId,
    cropId: input.cropId,
    variety: input.variety ?? null,
    sownAt: input.sownAt,
    entryId: input.entryId,
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }

  const { error } = await supabaseAdmin
    .from('FieldCrop')
    .insert(row)

  if (error) throw new Error(error.message)
}