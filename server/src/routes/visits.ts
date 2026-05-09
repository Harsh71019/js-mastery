import { Router, type Request, type Response } from 'express'
import { Visit } from '../models/Visit'
import { Progress } from '../models/Progress'
import { Problem } from '../models/Problem'

const router = Router()
const USER_ID = 'default'

interface ByProblemEntry {
  title:      string
  category:   string
  visitCount: number
  isSolved:   boolean
}

interface ByCategoryEntry {
  totalVisits:  number
  solvedVisits: number
  ratio:        number
}

router.get('/stats', async (_req: Request, res: Response): Promise<void> => {
  const visits = await Visit.find({ userId: USER_ID }, { problemId: 1, _id: 0 }).lean()

  const visitCounts: Record<string, number> = {}
  for (const v of visits) {
    const id = v.problemId as string
    visitCounts[id] = (visitCounts[id] ?? 0) + 1
  }

  const visitedIds = Object.keys(visitCounts)
  if (visitedIds.length === 0) {
    res.json({ byProblem: {}, byCategory: {} })
    return
  }

  const [problems, progress] = await Promise.all([
    Problem.find(
      { id: { $in: visitedIds }, status: 'published' },
      { id: 1, title: 1, category: 1, _id: 0 },
    ).lean(),
    Progress.findOne({ userId: USER_ID }),
  ])

  const problemMeta: Record<string, { title: string; category: string }> = {}
  for (const p of problems) {
    problemMeta[p.id as string] = { title: p.title as string, category: p.category as string }
  }

  const solvedIds = new Set(
    progress?.solvedProblems ? Array.from(progress.solvedProblems.keys()) : [],
  )

  const byProblem: Record<string, ByProblemEntry> = {}
  for (const problemId of visitedIds) {
    const meta = problemMeta[problemId]
    if (!meta) continue
    byProblem[problemId] = {
      title:      meta.title,
      category:   meta.category,
      visitCount: visitCounts[problemId],
      isSolved:   solvedIds.has(problemId),
    }
  }

  const categoryAgg: Record<string, { totalVisits: number; solvedCount: number }> = {}
  for (const data of Object.values(byProblem)) {
    const cat = data.category
    if (!categoryAgg[cat]) categoryAgg[cat] = { totalVisits: 0, solvedCount: 0 }
    categoryAgg[cat].totalVisits += data.visitCount
    if (data.isSolved) categoryAgg[cat].solvedCount++
  }

  const byCategory: Record<string, ByCategoryEntry> = {}
  for (const [slug, agg] of Object.entries(categoryAgg)) {
    byCategory[slug] = {
      totalVisits:  agg.totalVisits,
      solvedVisits: agg.solvedCount,
      ratio: agg.solvedCount > 0
        ? Math.round((agg.totalVisits / agg.solvedCount) * 10) / 10
        : 0,
    }
  }

  res.json({ byProblem, byCategory })
})

router.post('/:problemId', async (req: Request, res: Response): Promise<void> => {
  const { problemId } = req.params
  await Visit.create({ userId: USER_ID, problemId, visitedAt: new Date().toISOString() })
  res.status(201).json({ ok: true })
})

export default router
