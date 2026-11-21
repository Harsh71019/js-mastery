import { type Request, type Response } from 'express'
import { catchAsync } from '../middleware/catchAsync'
import * as noteService from '../services/noteService'
import { success } from '../utils/apiResponse'
import { param } from '../utils/param'
import { type SaveNoteInput } from '../types/schemas/noteSchemas'

export const getOne = catchAsync(async (req: Request, res: Response) => {
  const problemId = param(req, 'problemId')
  const note = await noteService.getNote(problemId)
  res.json(success(note))
})

export const save = catchAsync(async (req: Request, res: Response) => {
  const problemId = param(req, 'problemId')
  const input = req.body as SaveNoteInput
  const note = await noteService.saveNote(problemId, input)
  res.json(success(note))
})

export const remove = catchAsync(async (req: Request, res: Response) => {
  const problemId = param(req, 'problemId')
  const result = await noteService.deleteNote(problemId)
  res.json(success(result))
})

export const listAll = catchAsync(async (_req: Request, res: Response) => {
  const notes = await noteService.listAllNotes()
  res.json(success(notes))
})
