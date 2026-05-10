import { Router } from 'express'
import * as dailyController from '../controllers/dailyController'

const router = Router()

router.get('/',           dailyController.getDaily)
router.post('/complete',  dailyController.complete)

export default router
