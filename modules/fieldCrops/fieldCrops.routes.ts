import { Router } from 'express'
import { auth } from '../../middleware/auth'
import { orgScope } from '../../middleware/orgScope'
import { asyncHandler } from '../../utils/asyncHandler'
import { supabaseAdmin } from '../../src/lib/supabaseAdmin'

const router = Router()
router.use(auth({ optional: true }), orgScope)

router.get(
  '/',
  asyncHandler(async (req, res) => {
    const activeOnly = String((req.query as any)?.activeOnly ?? 'true') !== 'false'

    let q = supabaseAdmin
      .from('FieldCrop')
      .select(
        `
        *,
        field:Field(*),
        crop:Crop(*)
      `
      )
      .eq('orgId', req.orgId!)
      .order('sownAt', { ascending: false })
      .order('createdAt', { ascending: false })

    if (activeOnly) q = q.eq('isActive', true)

    const { data, error } = await q
    if (error) throw new Error(error.message)

    res.json(data ?? [])
  })
)

export default router