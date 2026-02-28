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
    const orgId = req.orgId!
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
      .eq('orgId', orgId)
      .order('sownAt', { ascending: false })
      .order('createdAt', { ascending: false })

    if (activeOnly) q = q.eq('isActive', true)

    const { data, error } = await q

    if (error) {
      console.error('GET /field-crops failed', {
        orgId,
        activeOnly,
        message: error.message,
        details: (error as any).details,
        hint: (error as any).hint,
        code: (error as any).code,
      })

      // Najčešće: relation "FieldCrop" does not exist, ili permission denied
      return res.status(500).json({
        error: 'FIELD_CROPS_QUERY_FAILED',
        message: error.message,
        code: (error as any).code ?? null,
      })
    }

    res.json(data ?? [])
  })
)

export default router