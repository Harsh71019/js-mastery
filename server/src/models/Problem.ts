import { Schema, model } from 'mongoose'

const TestCaseSchema = new Schema(
  {
    input: { type: Schema.Types.Mixed, required: true },
    expected: { type: Schema.Types.Mixed, required: true },
    label: { type: String },
  },
  { _id: false },
)

const TraceTableSchema = new Schema(
  {
    inputLabel: { type: String, required: true },
    columns: { type: [String], required: true },
    rows: { type: [Schema.Types.Mixed], required: true },
  },
  { _id: false },
)

const ProblemSchema = new Schema(
  {
    id: { type: String, required: true, unique: true },
    title: { type: String, required: true, unique: true },
    category: { type: String, required: true },
    difficulty: {
      type: String,
      enum: ['Beginner', 'Easy', 'Medium', 'Hard'],
      required: true,
    },
    functionName: { type: String, required: true },
    description: { type: String, required: true },
    whatShouldHappen: { type: [String], required: true },
    starterCode: { type: String, required: true },
    solution: { type: String, required: true },
    traceTable: { type: TraceTableSchema, required: true },
    skeletonHint: { type: String, required: true },
    tests: { type: [TestCaseSchema], required: true },
    patternTag: { type: String, required: true },
    patternExplanation: { type: String, required: true },
    estimatedMinutes: { type: Number, required: true },
    status: {
      type: String,
      enum: ['draft', 'published'],
      default: 'published',
    },
  },
  { timestamps: true },
)

export const Problem = model('Problem', ProblemSchema)
