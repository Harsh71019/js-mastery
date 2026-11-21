export interface ProblemNote {
  readonly problemId: string
  readonly content: string
  readonly tags?: readonly string[]
  readonly createdAt?: string
  readonly updatedAt?: string
}

export type NoteSaveStatus = 'idle' | 'loading' | 'saving' | 'saved' | 'unsaved' | 'error'
