import { Schema, model } from 'mongoose'

const SolvedEntrySchema = new Schema(
  {
    solvedAt: { type: String, default: '' },
    attempts: { type: Number, default: 0 },
    title: String,
    category: String,
    difficulty: String,
    reviewInterval: { type: Number, default: 1 },
    lastReviewedAt: { type: String },
    nextReviewDue: { type: String },
    executionTimeMs: { type: Number },
    runCount: { type: Number, default: 1 },
    runTimings: { type: [Schema.Types.Mixed], default: [] },
    acceptedCode: { type: String },
  },
  { _id: false },
)

const ProgressSchema = new Schema(
  {
    userId: { type: String, required: true, unique: true, default: 'default' },
    solvedProblems: { type: Map, of: SolvedEntrySchema, default: {} },
    lastActiveDate: { type: String, default: '' },
    currentStreak: { type: Number, default: 0 },
    longestStreak: { type: Number, default: 0 },
    dismissedBackupMilestone: { type: Number, default: 0 },
    dailyStreak: { type: Number, default: 0 },
    longestDailyStreak: { type: Number, default: 0 },
    lastDailySolvedAt: { type: String },
    completedDailies: { type: [String], default: [] },
  },
  { timestamps: true },
)

export const Progress = model('Progress', ProgressSchema)
