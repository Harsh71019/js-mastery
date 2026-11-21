import * as noteRepo from '../repositories/noteRepository'
import { type SaveNoteInput } from '../types/schemas/noteSchemas'

export const getNote = async (problemId: string, userId?: string) => {
  const note = await noteRepo.findByProblem(problemId, userId)
  return note ?? null
}

export const saveNote = async (problemId: string, input: SaveNoteInput, userId?: string) => {
  const note = await noteRepo.upsertOne(problemId, input.content, input.tags ?? [], userId)
  return note
}

export const deleteNote = async (problemId: string, userId?: string) => {
  await noteRepo.deleteOne(problemId, userId)
  return { deleted: true, problemId }
}

export const listAllNotes = async (userId?: string) => {
  return noteRepo.listAll(userId)
}
