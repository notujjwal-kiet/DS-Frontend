export const stages = [
  ['goal', 'Developer goal & skill context', 'Clarify what you want to build'],
  ['plan', 'Intent & learning plan', 'Turn your goal into a focused path'],
  ['research', 'Research & source discovery', 'Find current, relevant material'],
  ['evidence', 'Evidence review', 'Separate support from uncertainty'],
  ['explain', 'Explanation & concept mapping', 'Build a grounded mental model'],
  ['project', 'Guided project work', 'Connect learning to implementation'],
  ['practice', 'Understanding check', 'Check what you can explain'],
  ['gate', 'Code assistance gate', 'Decide what support fits'],
  ['complete', 'Progress & reflection', 'Review your next recommended step'],
];

export const sampleResponse = {
  response_id: 'sample-response',
  title: 'Build a resilient task API',
  summary: 'Learn how to design a dependable API by modelling state transitions, validating boundaries, and making writes idempotent.',
  sources: [
    { title: 'HTTP Semantics and Idempotency', publisher: 'MDN Web Docs', freshness: 96, reliability: 94, url: 'https://developer.mozilla.org/' },
    { title: 'API Design Guidelines', publisher: 'Microsoft Learn', freshness: 88, reliability: 91, url: 'https://learn.microsoft.com/' },
    { title: 'Designing Robust Services', publisher: 'Google Cloud', freshness: 82, reliability: 89, url: 'https://cloud.google.com/' },
  ],
  sections: [
    { heading: 'Start with the state model', body: 'A task API becomes easier to reason about when its states and allowed transitions are explicit. Separate a request’s intent from the current persisted state.', citations: [0, 1] },
    { heading: 'Make retries safe', body: 'Network clients retry. Use idempotent methods where possible and accept an idempotency key for operations that create or mutate state.', citations: [0, 2] },
    { heading: 'Validate at the boundary', body: 'Reject malformed input before it reaches domain logic. Return stable error shapes so clients can recover without guessing.', citations: [1, 2] },
  ],
  concepts: [
    { id: 'state', label: 'State model', x: 50, y: 18 },
    { id: 'retry', label: 'Safe retries', x: 22, y: 55 },
    { id: 'validation', label: 'Validation', x: 78, y: 55 },
    { id: 'contract', label: 'API contract', x: 50, y: 82 },
  ],
  edges: [['state', 'retry'], ['state', 'validation'], ['retry', 'contract'], ['validation', 'contract']],
  questions: [
    { question_id: 'q1', prompt: 'Why should a state transition be explicit instead of inferred from request order?' },
    { question_id: 'q2', prompt: 'When would an idempotency key protect a client from a duplicate write?' },
    { question_id: 'q3', prompt: 'What belongs at an API boundary before domain logic runs?' },
  ],
  full_code: '',
  code_notice: 'Code is intentionally gated until you submit your understanding or request it explicitly.',
};

export const navigation = [
  ['Start Learning', 'compass'],
  ['Pipeline', 'pipeline'],
  ['Sources', 'source'],
  ['Explanation', 'book'],
  ['Concept Map', 'map'],
  ['Practice & Code Gate', 'practice'],
];
