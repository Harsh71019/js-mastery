import { Schema, model } from 'mongoose'

const TestCaseSchema = new Schema(
  {
    input: { type: Schema.Types.Mixed, required: true },
    expected: { type: Schema.Types.Mixed },
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
    id:    { type: String, required: true, unique: true },
    title: { type: String, required: true, unique: true },
    type: {
      type: String,
      enum: ['coding', 'mcq', 'trick'],
      default: 'coding',
    },
    category:   { type: String, required: true },
    difficulty: { type: String, enum: ['Beginner', 'Easy', 'Medium', 'Hard'], required: true },
    description: { type: String },
    patternTag:         { type: String, required: true },
    patternExplanation: { type: String, required: true },
    estimatedMinutes:   { type: Number, required: true },
    status: { type: String, enum: ['draft', 'published'], default: 'published' },

    // Coding-only (optional for mcq/trick)
    functionName:    { type: String },
    whatShouldHappen: { type: [String] },
    starterCode:     { type: String },
    solution:        { type: String },
    traceTable:      { type: TraceTableSchema },
    skeletonHint:    { type: String },
    tests:           { type: [TestCaseSchema] },

    // MCQ / trick fields
    options:          { type: [String], default: undefined },
    correctIndex:     { type: Number },
    explanation:      { type: String },

    // Trick-only fields
    codeSnippet:       { type: String },
    gotchaExplanation: { type: String },
  },
  { timestamps: true },
)

export const Problem = model('Problem', ProblemSchema)
