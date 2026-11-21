import { Schema, model } from 'mongoose'

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
  },
  { timestamps: true }
)

ArticleSchema.index({ status: 1, company: 1 })
ArticleSchema.index({ status: 1, region: 1 })
ArticleSchema.index({ status: 1, tags: 1 })

export const Article = model('Article', ArticleSchema)
