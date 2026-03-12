/**
 * Character Quiz — Breaking Bad personality quiz mock data
 * Theme: Obsidian | Archetype: Linear wizard flow
 */

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface QuizResult {
  id: string
  character: string
  title: string
  description: string
  traits: string[]
  color: string
}

export interface QuizOption {
  text: string
  scores: Record<string, number>
}

export interface Question {
  id: string
  text: string
  options: QuizOption[]
}

export interface Quiz {
  id: string
  title: string
  description: string
  questions: Question[]
  results: QuizResult[]
}

// ---------------------------------------------------------------------------
// Results
// ---------------------------------------------------------------------------

const results: QuizResult[] = [
  {
    id: 'walter',
    character: 'Walter White',
    title: "You're Walter White",
    description: 'Brilliant, obsessive, and dangerously prideful. You refuse to be underestimated and will go to extraordinary lengths to prove your worth. Your intelligence is your greatest weapon, but your ego may be your undoing.',
    traits: ['Strategic', 'Prideful', 'Resourceful', 'Obsessive'],
    color: '#4ade80',
  },
  {
    id: 'jesse',
    character: 'Jesse Pinkman',
    title: "You're Jesse Pinkman",
    description: 'Sensitive and loyal beneath a rough exterior. You care deeply about the people around you and struggle with the moral weight of your choices. Your conscience is alive even when you wish it weren\'t.',
    traits: ['Empathetic', 'Loyal', 'Conflicted', 'Authentic'],
    color: '#f97316',
  },
  {
    id: 'gus',
    character: 'Gus Fring',
    title: "You're Gustavo Fring",
    description: 'Patient, calculating, and immaculately composed. You play the long game and never reveal your hand until the moment is right. Behind your polished exterior lies an iron will and a memory that forgives nothing.',
    traits: ['Disciplined', 'Patient', 'Calculating', 'Meticulous'],
    color: '#fbbf24',
  },
  {
    id: 'mike',
    character: 'Mike Ehrmantraut',
    title: "You're Mike Ehrmantraut",
    description: 'Pragmatic, competent, and weary. You\'ve seen enough to know how the world works and you approach every problem with quiet professionalism. You protect the people you care about, even when they don\'t deserve it.',
    traits: ['Pragmatic', 'Competent', 'Protective', 'World-weary'],
    color: '#94a3b8',
  },
  {
    id: 'hank',
    character: 'Hank Schrader',
    title: "You're Hank Schrader",
    description: 'Tenacious and driven by an unshakable sense of justice. You cover your vulnerabilities with humor and bravado, but when it matters, you are the most steadfast person in the room. You never, ever give up.',
    traits: ['Tenacious', 'Just', 'Brave', 'Determined'],
    color: '#60a5fa',
  },
  {
    id: 'saul',
    character: 'Saul Goodman',
    title: "You're Saul Goodman",
    description: 'Quick-witted, adaptable, and a born showman. You can talk your way into or out of anything. Your flash and humor mask a sharp legal mind and a survivor\'s instinct that keeps you one step ahead.',
    traits: ['Charismatic', 'Adaptable', 'Quick-witted', 'Survivor'],
    color: '#a78bfa',
  },
]

// ---------------------------------------------------------------------------
// Questions
// ---------------------------------------------------------------------------

const questions: Question[] = [
  {
    id: 'q1',
    text: 'You discover that someone you trusted has been lying to you for months. What do you do?',
    options: [
      { text: 'Plan a methodical response that turns their deception against them', scores: { walter: 3, gus: 2 } },
      { text: 'Confront them emotionally and demand the truth', scores: { jesse: 3, hank: 1 } },
      { text: 'File the information away. React when the time is right.', scores: { gus: 3, mike: 2 } },
      { text: 'Start building leverage in case you need it later', scores: { saul: 3, walter: 1 } },
    ],
  },
  {
    id: 'q2',
    text: 'You\'re offered an opportunity that would double your income but require cutting ethical corners. You...',
    options: [
      { text: 'Take it. You deserve success and you\'ll do what it takes to get it.', scores: { walter: 3, saul: 1 } },
      { text: 'Struggle with it, try it, then feel guilty about it constantly.', scores: { jesse: 3 } },
      { text: 'Evaluate the risk-reward ratio with cold precision.', scores: { gus: 2, mike: 2 } },
      { text: 'Refuse. Your integrity matters more than money.', scores: { hank: 3 } },
    ],
  },
  {
    id: 'q3',
    text: 'How do you handle a high-pressure deadline?',
    options: [
      { text: 'Enter a focused flow state. Pressure makes you sharper.', scores: { walter: 2, gus: 2 } },
      { text: 'Stress out, then rally at the last minute with raw effort.', scores: { jesse: 2, hank: 1 } },
      { text: 'Delegate efficiently — you planned for this weeks ago.', scores: { gus: 3, mike: 1 } },
      { text: 'Improvise creatively and charm whoever needs charming.', scores: { saul: 3 } },
    ],
  },
  {
    id: 'q4',
    text: 'Someone insults your work in front of others. Your reaction?',
    options: [
      { text: 'Seethe internally. You\'ll show them. You\'ll show them all.', scores: { walter: 3 } },
      { text: 'Take it personally but try to brush it off.', scores: { jesse: 2, hank: 1 } },
      { text: 'Smile politely. Make a mental note. Continue.', scores: { gus: 3 } },
      { text: 'Shrug and move on. You\'ve dealt with worse.', scores: { mike: 3 } },
    ],
  },
  {
    id: 'q5',
    text: 'What role do you naturally play in a group?',
    options: [
      { text: 'The expert — people come to you for answers.', scores: { walter: 2, gus: 1 } },
      { text: 'The heart — you keep people connected.', scores: { jesse: 3 } },
      { text: 'The leader — you set the vision and the rules.', scores: { gus: 2, hank: 2 } },
      { text: 'The fixer — you handle the problems no one else will touch.', scores: { mike: 3, saul: 1 } },
    ],
  },
  {
    id: 'q6',
    text: 'Pick the quality you value most in yourself:',
    options: [
      { text: 'Intelligence', scores: { walter: 3 } },
      { text: 'Loyalty', scores: { jesse: 2, mike: 2 } },
      { text: 'Self-control', scores: { gus: 3 } },
      { text: 'Persistence', scores: { hank: 3 } },
    ],
  },
  {
    id: 'q7',
    text: 'How do you spend a rare free Saturday?',
    options: [
      { text: 'Working on a personal project you\'re obsessed with.', scores: { walter: 3 } },
      { text: 'Hanging out with friends, keeping it low-key.', scores: { jesse: 3 } },
      { text: 'Catching up on things, maintaining your systems.', scores: { gus: 1, mike: 2 } },
      { text: 'Doing something physical or competitive.', scores: { hank: 3 } },
    ],
  },
  {
    id: 'q8',
    text: 'A friend asks you to do something risky to help them out of trouble. You...',
    options: [
      { text: 'Help, but only if it also serves your interests.', scores: { walter: 2, saul: 2 } },
      { text: 'Help without question — that\'s what friends do.', scores: { jesse: 3 } },
      { text: 'Assess the situation first. Recklessness helps no one.', scores: { mike: 3, gus: 1 } },
      { text: 'Help, then lecture them about getting into this mess.', scores: { hank: 2, mike: 1 } },
    ],
  },
  {
    id: 'q9',
    text: 'What\'s your biggest fear?',
    options: [
      { text: 'Being ordinary. Dying unremembered.', scores: { walter: 3 } },
      { text: 'Hurting the people you love.', scores: { jesse: 3 } },
      { text: 'Losing control of a situation you\'ve carefully built.', scores: { gus: 3 } },
      { text: 'Failing to protect someone who depends on you.', scores: { mike: 2, hank: 2 } },
    ],
  },
  {
    id: 'q10',
    text: 'Choose a motto:',
    options: [
      { text: '"I am the one who knocks."', scores: { walter: 3 } },
      { text: '"Yeah, science!"', scores: { jesse: 2, walter: 1 } },
      { text: '"A man provides."', scores: { gus: 2, mike: 2 } },
      { text: '"Better call Saul!"', scores: { saul: 3, hank: 1 } },
    ],
  },
]

// ---------------------------------------------------------------------------
// Quiz
// ---------------------------------------------------------------------------

export const quiz: Quiz = {
  id: 'breaking-bad',
  title: 'Which Breaking Bad Character Are You?',
  description: 'Answer ten questions to discover which character from Breaking Bad matches your personality. No half measures.',
  questions,
  results,
}

// ---------------------------------------------------------------------------
// Scoring
// ---------------------------------------------------------------------------

export function calculateResult(answers: Record<string, number>): QuizResult {
  const scores: Record<string, number> = {}

  for (const [resultId, score] of Object.entries(answers)) {
    scores[resultId] = (scores[resultId] ?? 0) + score
  }

  let maxId = results[0]!.id
  let maxScore = 0

  for (const [id, score] of Object.entries(scores)) {
    if (score > maxScore) {
      maxScore = score
      maxId = id
    }
  }

  return results.find((r) => r.id === maxId) ?? results[0]!
}

export function tallyScores(
  selectedAnswers: Map<string, number>,
  questions: Question[],
): Record<string, number> {
  const totals: Record<string, number> = {}

  for (const [questionId, optionIndex] of selectedAnswers.entries()) {
    const question = questions.find((q) => q.id === questionId)
    if (!question) continue
    const option = question.options[optionIndex]
    if (!option) continue

    for (const [resultId, score] of Object.entries(option.scores)) {
      totals[resultId] = (totals[resultId] ?? 0) + score
    }
  }

  return totals
}
