import { Router } from 'express'
import * as submissionController from '../controllers/submissionController'
import { validate } from '../middleware/validate'
import { CreateSubmissionSchema } from '../types/schemas/submissionSchemas'

const router = Router()

router.post('/:problemId',              validate(CreateSubmissionSchema), submissionController.create)
router.get('/:problemId',               submissionController.list)
router.get('/:problemId/:submissionId', submissionController.getOne)

export default router
