import { Router } from 'express'
import * as progressController from '../controllers/progressController'
import { validate } from '../middleware/validate'
import { SolveBodySchema, AttemptBodySchema, ImportBodySchema } from '../types/schemas/progressSchemas'

const router = Router()

router.get('/',                          progressController.get)
router.post('/solve/:problemId',         validate(SolveBodySchema),  progressController.solve)
router.post('/attempt/:problemId',       validate(AttemptBodySchema), progressController.attempt)
router.delete('/',                       progressController.reset)
router.get('/review-queue',              progressController.reviewQueue)
router.get('/activity',                  progressController.activity)
router.get('/execution-times',           progressController.executionTimes)
router.put('/dismiss-banner/:milestone', progressController.dismissBanner)
router.post('/import',                   validate(ImportBodySchema),  progressController.importProg)
router.get('/export',                    progressController.exportProg)

export default router
