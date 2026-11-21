import { Schema, model } from 'mongoose'

const SubmissionSchema = new Schema(
  {
    userId: { type: String, required: true, default: 'default' },
    problemId: { type: String, required: true },
    submissionId: { type: String, required: true, unique: true },
    verdict: { type: String, required: true },
    code: { type: String, required: true },
    executionTimeMs: { type: Number },
    cpuTimeMs: { type: Number },
    memoryBytes: { type: Number },
    memoryUsageMb: { type: Number },
    beatsRuntime: { type: Number },
    beatsMemory: { type: Number },
    submittedAt: { type: String, required: true },
  },
  { timestamps: false },
)

SubmissionSchema.index({ userId: 1, problemId: 1 })
SubmissionSchema.index({ submittedAt: -1 })
SubmissionSchema.index({ problemId: 1, verdict: 1, executionTimeMs: 1 })
SubmissionSchema.index({ problemId: 1, verdict: 1, memoryUsageMb: 1 })

export const Submission = model('Submission', SubmissionSchema)
