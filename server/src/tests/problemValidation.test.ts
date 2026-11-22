import test, { describe } from 'node:test'
import assert from 'node:assert'
import { validateProblem } from '../utils/problem-validation'

describe('Problem Validation (validateProblem)', () => {
  test('validates valid coding problem successfully', () => {
    const validCoding = {
      id: 'sum-numbers',
      title: 'Sum Numbers',
      type: 'coding',
      category: 'basic-loops',
      difficulty: 'Easy',
      description: 'Sum all numbers in array',
      patternTag: 'Accumulator',
      patternExplanation: 'Accumulate sum in a variable',
      estimatedMinutes: 10,
      functionName: 'sumNumbers',
      starterCode: 'function sumNumbers(arr) {}',
      solution: 'function sumNumbers(arr) { return arr.reduce((a, b) => a + b, 0); }',
      skeletonHint: 'Initialize sum to 0',
      whatShouldHappen: ['Return total sum of array'],
      traceTable: {
        inputLabel: 'arr = [1, 2, 3]',
        columns: ['i', 'sum'],
        rows: [[0, 1], [1, 3], [2, 6]],
      },
      tests: [
        { input: [[]], expected: 0 },
        { input: [[1, 2]], expected: 3 },
        { input: [[-1, 1]], expected: 0 },
        { input: [[10, 20, 30]], expected: 60 },
      ],
    }

    const errors = validateProblem(validCoding)
    assert.strictEqual(errors.length, 0)
  })

  test('rejects coding problem with fewer than 4 test cases', () => {
    const invalid = {
      id: 'test-prob',
      title: 'Test',
      type: 'coding',
      category: 'basic-loops',
      difficulty: 'Easy',
      description: 'Desc',
      patternTag: 'Tag',
      patternExplanation: 'Expl',
      estimatedMinutes: 5,
      functionName: 'fn',
      starterCode: 'code',
      solution: 'sol',
      skeletonHint: 'hint',
      whatShouldHappen: ['action'],
      traceTable: { inputLabel: 'in', columns: ['a'], rows: [[1]] },
      tests: [{ input: [1], expected: 1 }],
    }

    const errors = validateProblem(invalid)
    const testError = errors.find((e) => e.field === 'tests')
    assert.ok(testError)
  })

  test('validates valid MCQ problem successfully', () => {
    const validMcq = {
      id: 'mcq-1',
      title: 'What does typeof null return?',
      type: 'mcq',
      category: 'js-pro',
      difficulty: 'Easy',
      description: 'Understanding JS types',
      patternTag: 'Type Coercion',
      patternExplanation: 'JS typeof quirks',
      estimatedMinutes: 2,
      options: ['"null"', '"undefined"', '"object"', '"number"'],
      correctIndex: 2,
      explanation: 'In JavaScript, typeof null returns "object" due to a legacy bug in first JS implementation.',
    }

    const errors = validateProblem(validMcq)
    assert.strictEqual(errors.length, 0)
  })

  test('rejects MCQ problem with out-of-bounds correctIndex', () => {
    const invalidMcq = {
      id: 'mcq-2',
      title: 'MCQ out of bounds',
      type: 'mcq',
      category: 'js-pro',
      difficulty: 'Easy',
      description: 'Desc',
      patternTag: 'Tag',
      patternExplanation: 'Expl',
      estimatedMinutes: 2,
      options: ['Option A', 'Option B'],
      correctIndex: 5,
      explanation: 'Explanation',
    }

    const errors = validateProblem(invalidMcq)
    const idxError = errors.find((e) => e.field === 'correctIndex')
    assert.ok(idxError)
  })

  test('validates valid Trick problem successfully', () => {
    const validTrick = {
      id: 'trick-1',
      title: 'Array sorting gotcha',
      type: 'trick',
      category: 'tricky-patterns',
      difficulty: 'Medium',
      patternTag: 'Array Sorting',
      patternExplanation: 'Default array sort coerces elements to strings',
      estimatedMinutes: 3,
      codeSnippet: '[10, 2, 5].sort();',
      options: ['[2, 5, 10]', '[10, 2, 5]', '[2, 10, 5]', 'TypeError'],
      correctIndex: 1,
      gotchaExplanation: 'Default sort converts elements to strings, and "10" comes before "2".',
    }

    const errors = validateProblem(validTrick)
    assert.strictEqual(errors.length, 0)
  })
})
