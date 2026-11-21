import { randomUUID } from 'crypto'
import * as submissionRepo from '../repositories/submissionRepository'
import { Verdict } from '../constants'

export interface CreateSubmissionInput {
  problemId: string
  verdict: string
  code: string
  executionTimeMs?: number
  cpuTimeMs?: number
  memoryBytes?: number
  memoryUsageMb?: number
}

const computeBaselineBeats = (timeMs?: number, memMb?: number) => {
  let beatsRuntime = 85.0
  if (typeof timeMs === 'number' && timeMs >= 0) {
    if (timeMs <= 5) beatsRuntime = 96.5
    else if (timeMs <= 15) beatsRuntime = 89.2
    else if (timeMs <= 35) beatsRuntime = 81.4
    else if (timeMs <= 70) beatsRuntime = 68.7
    else if (timeMs <= 120) beatsRuntime = 52.3
    else beatsRuntime = 38.5
  }

  let beatsMemory = 78.0
  if (typeof memMb === 'number' && memMb > 0) {
    if (memMb <= 45) beatsMemory = 92.4
    else if (memMb <= 49) beatsMemory = 84.1
    else if (memMb <= 53) beatsMemory = 74.8
    else if (memMb <= 57) beatsMemory = 61.2
    else beatsMemory = 42.0
  }

  return { beatsRuntime, beatsMemory }
}

export const createSubmission = async (input: CreateSubmissionInput) => {
  const { problemId, verdict, code, executionTimeMs, cpuTimeMs, memoryBytes, memoryUsageMb } = input
  const submissionId = randomUUID()
  const submittedAt = new Date().toISOString()

  let beatsRuntime: number | undefined
  let beatsMemory: number | undefined

  if (verdict === Verdict.Accepted) {
    const totalAccepted = await submissionRepo.countAccepted(problemId)

    if (totalAccepted >= 2) {
      if (typeof executionTimeMs === 'number') {
        const slower = await submissionRepo.countSlower(problemId, executionTimeMs)
        beatsRuntime = Math.min(99.9, Math.max(1.0, +(((slower + 0.5) / (totalAccepted + 1)) * 100).toFixed(1)))
      }
      if (typeof memoryUsageMb === 'number') {
        const higher = await submissionRepo.countHigherMemory(problemId, memoryUsageMb)
        beatsMemory = Math.min(99.9, Math.max(1.0, +(((higher + 0.5) / (totalAccepted + 1)) * 100).toFixed(1)))
      }
    } else {
      const baseline = computeBaselineBeats(executionTimeMs, memoryUsageMb)
      beatsRuntime = baseline.beatsRuntime
      beatsMemory = baseline.beatsMemory
    }
  }

  await submissionRepo.createOne({
    problemId,
    submissionId,
    verdict,
    code,
    executionTimeMs: typeof executionTimeMs === 'number' ? Math.round(executionTimeMs) : undefined,
    cpuTimeMs: typeof cpuTimeMs === 'number' ? +cpuTimeMs.toFixed(2) : undefined,
    memoryBytes: typeof memoryBytes === 'number' ? Math.round(memoryBytes) : undefined,
    memoryUsageMb: typeof memoryUsageMb === 'number' ? +memoryUsageMb.toFixed(2) : undefined,
    beatsRuntime,
    beatsMemory,
    submittedAt,
  })

  return {
    submissionId,
    submittedAt,
    verdict,
    executionTimeMs,
    memoryUsageMb,
    beatsRuntime,
    beatsMemory,
  }
}

export const listSubmissions = (problemId: string) =>
  submissionRepo.findByProblem(problemId).then((submissions) => ({ submissions }))

export const getSubmission = (problemId: string, submissionId: string) =>
  submissionRepo.findOne(problemId, submissionId)

export const getProblemDistribution = async (problemId: string) => {
  const accepted = await submissionRepo.findAcceptedByProblem(problemId)
  const totalAccepted = accepted.length

  // Bins for runtime histogram (in ms)
  const runtimeBins = [
    { label: '< 5 ms', min: 0, max: 5, count: 0 },
    { label: '5-15 ms', min: 5, max: 15, count: 0 },
    { label: '15-30 ms', min: 15, max: 30, count: 0 },
    { label: '30-60 ms', min: 30, max: 60, count: 0 },
    { label: '60-100 ms', min: 60, max: 100, count: 0 },
    { label: '100-200 ms', min: 100, max: 200, count: 0 },
    { label: '> 200 ms', min: 200, max: Infinity, count: 0 },
  ]

  // Bins for memory histogram (in MB)
  const memoryBins = [
    { label: '< 45 MB', min: 0, max: 45, count: 0 },
    { label: '45-48 MB', min: 45, max: 48, count: 0 },
    { label: '48-52 MB', min: 48, max: 52, count: 0 },
    { label: '52-56 MB', min: 52, max: 56, count: 0 },
    { label: '56-62 MB', min: 56, max: 62, count: 0 },
    { label: '> 62 MB', min: 62, max: Infinity, count: 0 },
  ]

  // If no submissions exist, populate a representative baseline curve
  if (totalAccepted === 0) {
    const defaultRuntimeWeights = [12, 28, 22, 14, 8, 4, 2]
    const defaultMemoryWeights = [8, 32, 26, 16, 7, 3]

    return {
      problemId,
      totalAccepted: 90,
      runtimeDistribution: runtimeBins.map((bin, i) => ({ ...bin, count: defaultRuntimeWeights[i] || 0 })),
      memoryDistribution: memoryBins.map((bin, i) => ({ ...bin, count: defaultMemoryWeights[i] || 0 })),
    }
  }

  for (const s of accepted) {
    if (typeof s.executionTimeMs === 'number') {
      const ms = s.executionTimeMs
      const bin = runtimeBins.find((b) => ms >= b.min && ms < b.max) || runtimeBins[runtimeBins.length - 1]
      if (bin) bin.count++
    }

    if (typeof s.memoryUsageMb === 'number') {
      const mb = s.memoryUsageMb
      const bin = memoryBins.find((b) => mb >= b.min && mb < b.max) || memoryBins[memoryBins.length - 1]
      if (bin) bin.count++
    }
  }

  return {
    problemId,
    totalAccepted,
    runtimeDistribution: runtimeBins,
    memoryDistribution: memoryBins,
  }
}
