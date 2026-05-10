import { Router } from 'express'
import * as problemController from '../controllers/problemController'

const router = Router()

router.get('/',                      problemController.list)
router.get('/patterns',              problemController.patterns)
router.get('/categories/counts',     problemController.categoryCounts)
router.get('/collections/counts',    problemController.collectionCounts)
router.get('/:id/submit-tests',      problemController.submitTests)
router.get('/:id',                   problemController.getById)
router.post('/',                     problemController.createOne)
router.post('/bulk',                 problemController.bulkCreate)

export default router
