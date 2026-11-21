import { Router } from 'express'
import * as noteController from '../controllers/noteController'
import { validate } from '../middleware/validate'
import { SaveNoteSchema } from '../types/schemas/noteSchemas'

const router = Router()

router.get('/', noteController.listAll)
router.get('/:problemId', noteController.getOne)
router.put('/:problemId', validate(SaveNoteSchema), noteController.save)
router.delete('/:problemId', noteController.remove)

export default router
