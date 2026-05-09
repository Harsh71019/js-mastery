import { Schema, model } from 'mongoose'

const VisitSchema = new Schema(
  {
    userId:    { type: String, required: true, default: 'default' },
    problemId: { type: String, required: true },
    visitedAt: { type: String, required: true },
  },
  { timestamps: false },
)

VisitSchema.index({ userId: 1, problemId: 1 })

export const Visit = model('Visit', VisitSchema)
