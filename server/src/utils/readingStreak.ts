import { differenceInCalendarDays } from 'date-fns'

interface ReadingStreakState {
  readingStreak: number
  longestReadingStreak: number
  lastArticleReadAt?: string | null
}

export const getUpdatedReadingStreak = (
  current: ReadingStreakState,
  todayDate: string, // YYYY-MM-DD
): { readingStreak: number; longestReadingStreak: number; lastArticleReadAt: string } => {
  // lastArticleReadAt is a full ISO timestamp in the DB, but we only care about the date for streaks
  const lastReadDate = current.lastArticleReadAt ? (current.lastArticleReadAt.split('T')[0] ?? '') : ''

  if (lastReadDate === todayDate) {
    return {
      readingStreak: current.readingStreak,
      longestReadingStreak: current.longestReadingStreak,
      lastArticleReadAt: current.lastArticleReadAt || new Date().toISOString()
    }
  }

  const daysDiff =
    lastReadDate === ''
      ? 1
      : differenceInCalendarDays(new Date(todayDate), new Date(lastReadDate))

  const nextStreak = daysDiff === 1 ? current.readingStreak + 1 : 1
  const nextLongest = Math.max(current.longestReadingStreak, nextStreak)

  return {
    readingStreak: nextStreak,
    longestReadingStreak: nextLongest,
    lastArticleReadAt: new Date().toISOString()
  }
}
