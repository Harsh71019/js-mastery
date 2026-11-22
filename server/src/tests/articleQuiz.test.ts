import test, { describe } from 'node:test'
import assert from 'node:assert'

interface KnowledgeQuestion {
  question: string
  options: string[]
  correctIndex: number
  explanation: string
}

function evaluateQuiz(questions: KnowledgeQuestion[], userAnswers: number[]) {
  if (answersMismatch(questions.length, userAnswers.length)) {
    throw new Error(`Expected ${questions.length} answers, received ${userAnswers.length}`)
  }

  let score = 0
  const results = questions.map((q, idx) => {
    const userAnswer = userAnswers[idx]
    const isCorrect = userAnswer === q.correctIndex
    if (isCorrect) score++
    return {
      questionIndex: idx,
      question: q.question,
      userAnswer,
      correctIndex: q.correctIndex,
      isCorrect,
      explanation: q.explanation,
    }
  })

  const total = questions.length
  const percentage = Math.round((score / total) * 100)
  const passed = percentage >= 50

  return { score, total, percentage, passed, results }
}

function answersMismatch(expected: number, received: number) {
  return expected !== received
}

describe('Article Knowledge Check Scoring Logic', () => {
  const sampleQuestions: KnowledgeQuestion[] = [
    {
      question: 'Why does an idempotent API require atomic distributed locks?',
      options: ['To compress data', 'To prevent concurrent duplicate execution', 'To save disk space'],
      correctIndex: 1,
      explanation: 'Locks prevent race conditions when two retries arrive simultaneously.',
    },
    {
      question: 'What HTTP status code should be returned for an idempotency key payload conflict?',
      options: ['200 OK', '422 or 400', '500 Server Error'],
      correctIndex: 1,
      explanation: 'A modified payload with an existing key is an error.',
    },
    {
      question: 'How long should idempotency responses typically be cached?',
      options: ['1 second', '24 to 48 hours', 'Permanently forever'],
      correctIndex: 1,
      explanation: 'Typical retry windows span several hours up to a day.',
    },
  ]

  test('computes perfect score and passing grade on all correct answers', () => {
    const res = evaluateQuiz(sampleQuestions, [1, 1, 1])
    assert.strictEqual(res.score, 3)
    assert.strictEqual(res.total, 3)
    assert.strictEqual(res.percentage, 100)
    assert.strictEqual(res.passed, true)
    assert.strictEqual(res.results.every((r) => r.isCorrect), true)
  })

  test('computes partial score and passing grade when >= 50%', () => {
    const res = evaluateQuiz(sampleQuestions, [1, 1, 0])
    assert.strictEqual(res.score, 2)
    assert.strictEqual(res.percentage, 67)
    assert.strictEqual(res.passed, true)
    assert.strictEqual(res.results[2]?.isCorrect, false)
  })

  test('computes failing grade when < 50%', () => {
    const res = evaluateQuiz(sampleQuestions, [0, 0, 1])
    assert.strictEqual(res.score, 1)
    assert.strictEqual(res.percentage, 33)
    assert.strictEqual(res.passed, false)
  })

  test('throws error when answer count does not match question count', () => {
    assert.throws(() => evaluateQuiz(sampleQuestions, [1]))
  })
})
