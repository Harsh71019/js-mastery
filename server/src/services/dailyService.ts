import { format } from 'date-fns'
import * as problemRepo from '../repositories/problemRepository'
import * as progressRepo from '../repositories/progressRepository'
import { selectDailyIndex } from '../utils/daily'
import { updateDailyStreak } from '../utils/dailyStreak'
import { serializeProgress } from '../utils/serializeProgress'

export const getDailyProblem = async () => {
  const today  = format(new Date(), 'yyyy-MM-dd')
  const allIds = await problemRepo.findAllPublishedIds()

  if (allIds.length === 0) return null

  const index      = selectDailyIndex(allIds.length, new Date())
  const dailyEntry = allIds[index]
  if (!dailyEntry) return null

  const problem = await problemRepo.findByIdPublished(dailyEntry.id)
  if (!problem) return null

  const progress         = await progressRepo.findOneLean()
  const completedDailies = (progress?.completedDailies as string[]) ?? []
  const alreadyCompleted = completedDailies.includes(today)

  return { problem, date: today, alreadyCompleted }
}

export const completeDaily = async () => {
  const today = format(new Date(), 'yyyy-MM-dd')
  const doc   = await progressRepo.findOrCreate()

  const updated = updateDailyStreak(
    {
      dailyStreak:        doc.dailyStreak        ?? 0,
      longestDailyStreak: doc.longestDailyStreak ?? 0,
      lastDailySolvedAt:  doc.lastDailySolvedAt  as string | undefined,
      completedDailies:   (doc.completedDailies  as string[]) ?? [],
    },
    today,
  )

  doc.dailyStreak        = updated.dailyStreak
  doc.longestDailyStreak = updated.longestDailyStreak
  doc.lastDailySolvedAt  = updated.lastDailySolvedAt
  doc.completedDailies   = updated.completedDailies
  await doc.save()

  return serializeProgress(doc)
}
