import { Router } from 'express'
import * as adminController from '../controllers/adminController'
import { validate } from '../middleware/validate'
import { CreateProblemSchema, BulkCreateProblemSchema, PatchProblemSchema } from '../types/schemas/problemSchemas'

const router = Router()

router.get('/',               adminController.list)
router.get('/stats',          adminController.stats)
router.post('/',              validate(CreateProblemSchema),      adminController.create)
router.post('/bulk',          validate(BulkCreateProblemSchema),  adminController.bulkCreate)
router.get('/:id',            adminController.getById)
router.patch('/:id',          validate(PatchProblemSchema),       adminController.patch)
router.delete('/:id',         adminController.remove)
router.post('/:id/publish',   adminController.publish)
router.post('/:id/unpublish', adminController.unpublish)

export default router
