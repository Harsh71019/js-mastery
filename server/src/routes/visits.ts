import { Router } from 'express'
import * as visitController from '../controllers/visitController'

const router = Router()

router.get('/stats',        visitController.stats)
router.post('/:problemId',  visitController.record)

export default router
