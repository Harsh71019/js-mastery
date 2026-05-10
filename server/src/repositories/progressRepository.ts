import { Progress } from '../models/Progress'
import { USER_ID } from '../constants'

export const findOrCreate = async () => {
  const doc = await Progress.findOne({ userId: USER_ID })
  if (doc) return doc
  return Progress.create({ userId: USER_ID })
}

export const resetOne = () =>
  Progress.findOneAndUpdate(
    { userId: USER_ID },
    {
      solvedProblems:           {},
      lastActiveDate:           '',
      currentStreak:            0,
      longestStreak:            0,
      dismissedBackupMilestone: 0,
      dailyStreak:              0,
      longestDailyStreak:       0,
      lastDailySolvedAt:        null,
      completedDailies:         [],
    },
    { upsert: true },
  )

export const replaceProgress = (data: Record<string, unknown>) =>
  Progress.findOneAndUpdate(
    { userId: USER_ID },
    data,
    { upsert: true, new: true },
  )

export const findOne = () =>
  Progress.findOne({ userId: USER_ID })

export const findOneLean = () =>
  Progress.findOne({ userId: USER_ID }).lean()
