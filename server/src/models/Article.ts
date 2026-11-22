import { Schema, model } from 'mongoose'

const CodeSnippetSchema = new Schema(
  {
    language: { type: String, default: 'javascript' },
    title: { type: String, required: true },
    code: { type: String, required: true },
    explanation: { type: String, required: true },
  },
  { _id: false },
)

const KnowledgeCheckSchema = new Schema(
  {
    id: { type: String },
    question: { type: String, required: true },
    options: { type: [String], required: true },
    correctIndex: { type: Number, required: true },
    explanation: { type: String, required: true },
  },
  { _id: false },
)

const InterviewQuestionSchema = new Schema(
  {
    question: { type: String, required: true },
    sampleAnswer: { type: String, required: true },
  },
  { _id: false },
)

const ArticleSchema = new Schema(
  {
    id: { type: String, required: true, unique: true },
    title: { type: String, required: true },
    url: { type: String, required: true },
    company: { type: String, required: true },
    region: { type: String, enum: ['Global', 'India'], required: true },
    tags: { type: [String], default: [] },
    summary: { type: String, required: true },
    difficulty: { type: String, enum: ['Intro', 'Intermediate', 'Advanced'], required: true },
    estimatedReadingTime: { type: Number, required: true }, // in minutes
    status: { type: String, enum: ['draft', 'published'], default: 'published' },
    domain: {
      type: String,
      enum: [
        'javascript-v8',
        'distributed-systems',
        'frontend-performance',
        'architecture-design',
        'databases-caching',
        'reliability-security',
      ],
      default: 'architecture-design',
    },
    content: { type: String, default: '' },
    takeaways: { type: [String], default: [] },
    codeSnippets: { type: [CodeSnippetSchema], default: [] },
    knowledgeCheck: { type: [KnowledgeCheckSchema], default: [] },
    interviewQuestions: { type: [InterviewQuestionSchema], default: [] },
  },
  { timestamps: true },
)

ArticleSchema.index({ status: 1, company: 1 })
ArticleSchema.index({ status: 1, region: 1 })
ArticleSchema.index({ status: 1, domain: 1 })
ArticleSchema.index({ status: 1, tags: 1 })

export const Article = model('Article', ArticleSchema)
