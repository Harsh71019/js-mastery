import { Router } from 'express'
import * as articleController from '../controllers/articleController'

const router = Router()

// Specific routes first
router.get('/', articleController.getArticles)
router.get('/stats', articleController.getArticleStats)
router.get('/daily', articleController.getDailyArticle)

// Parameterized routes
router.get('/:id', articleController.getArticleById)
router.post('/complete/:id', articleController.completeArticle)
router.post('/bookmark/:id', articleController.toggleBookmarkArticle)
router.post('/notes/:id', articleController.saveArticleNote)
router.post('/quiz/:id', articleController.submitArticleQuiz)

export default router
