import { Router } from 'express'
import * as articleController from '../controllers/articleController'

const router = Router()

router.get('/', articleController.getArticles)
router.get('/daily', articleController.getDailyArticle)
router.post('/complete/:id', articleController.completeArticle)
router.post('/bookmark/:id', articleController.toggleBookmarkArticle)

export default router
