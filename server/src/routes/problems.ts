import { Router } from 'express'
import * as problemController from '../controllers/problemController'
import { adminAuth } from '../middleware/adminAuth'
import { validate } from '../middleware/validate'
import { CreateProblemSchema, BulkCreateProblemSchema } from '../types/schemas/problemSchemas'

const router = Router()

router.get('/',                      problemController.list)
router.get('/patterns',              problemController.patterns)
router.get('/categories/counts',     problemController.categoryCounts)
router.get('/collections/counts',    problemController.collectionCounts)
router.get('/quiz/stats',            problemController.quizStats)
router.get('/:id/submit-tests',      problemController.submitTests)
router.get('/:id',                   problemController.getById)
router.post('/',                     adminAuth, validate(CreateProblemSchema), problemController.createOne)
router.post('/bulk',                 adminAuth, validate(BulkCreateProblemSchema), problemController.bulkCreate)

export default router
