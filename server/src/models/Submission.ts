import { Schema, model } from 'mongoose'

const SubmissionSchema = new Schema(
  {
    userId:          { type: String, required: true, default: 'default' },
    problemId:       { type: String, required: true },
    submissionId:    { type: String, required: true, unique: true },
    verdict:         { type: String, required: true },
    code:            { type: String, required: true },
    executionTimeMs: { type: Number },
    submittedAt:     { type: String, required: true },
  },
  { timestamps: false },
)

SubmissionSchema.index({ userId: 1, problemId: 1 })

export const Submission = model('Submission', SubmissionSchema)
