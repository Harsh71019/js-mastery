import { z } from 'zod'

export const SaveNoteSchema = z.object({
  content: z.string().max(30000, 'Note content must be at most 30,000 characters'),
  tags: z.array(z.string().max(50)).optional(),
})

export type SaveNoteInput = z.infer<typeof SaveNoteSchema>
