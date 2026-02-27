import { Router } from 'express'
import { listYields } from './yields.controller'

const router = Router()

router.get('/', listYields)

export default router
