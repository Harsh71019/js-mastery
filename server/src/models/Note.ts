import { Schema, model } from 'mongoose'
import { USER_ID } from '../constants'

export interface INote {
  userId: string
  problemId: string
  content: string
  tags?: string[]
  createdAt?: string
  updatedAt?: string
}

const NoteSchema = new Schema(
  {
    userId: { type: String, required: true, default: USER_ID },
    problemId: { type: String, required: true },
    content: { type: String, default: '' },
    tags: { type: [String], default: [] },
  },
  {
    timestamps: true,
  },
)

NoteSchema.index({ userId: 1, problemId: 1 }, { unique: true })
NoteSchema.index({ userId: 1, updatedAt: -1 })

export const Note = model('Note', NoteSchema)
