import * as visitRepo from '../repositories/visitRepository'
import * as progressRepo from '../repositories/progressRepository'
import { Problem } from '../models/Problem'

export const recordVisit = (problemId: string) =>
  visitRepo.createOne(problemId, new Date().toISOString())

export const getVisitStats = async () => {
  const visitRows = await visitRepo.aggregateVisitCounts()

  if (visitRows.length === 0) return { byProblem: {}, byCategory: {} }

  const visitCounts: Record<string, number> = {}
  const visitedIds: string[] = []
  for (const row of visitRows) {
    const pid   = row.problemId as string
    const count = row.visitCount as number
    visitCounts[pid] = count
    visitedIds.push(pid)
  }

  const [problems, progress] = await Promise.all([
    Problem.find(
      { id: { $in: visitedIds }, status: 'published' },
      { id: 1, title: 1, category: 1, _id: 0 },
    ).lean(),
    progressRepo.findOneLean(),
  ])

  const problemMeta: Record<string, { title: string; category: string }> = {}
  for (const p of problems) {
    problemMeta[p.id as string] = { title: p.title as string, category: p.category as string }
  }

  const solvedIds = new Set(
    progress?.solvedProblems ? Object.keys(progress.solvedProblems as object) : [],
  )

  const byProblem: Record<string, { title: string; category: string; visitCount: number; isSolved: boolean }> = {}
  for (const problemId of visitedIds) {
    const meta = problemMeta[problemId]
    if (!meta) continue
    byProblem[problemId] = {
      title:      meta.title,
      category:   meta.category,
      visitCount: visitCounts[problemId] ?? 0,
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

  const byCategory: Record<string, { totalVisits: number; solvedVisits: number; ratio: number }> = {}
  for (const [slug, agg] of Object.entries(categoryAgg)) {
    byCategory[slug] = {
      totalVisits:  agg.totalVisits,
      solvedVisits: agg.solvedCount,
      ratio: agg.solvedCount > 0
        ? Math.round((agg.totalVisits / agg.solvedCount) * 10) / 10
        : 0,
    }
  }

  return { byProblem, byCategory }
}
