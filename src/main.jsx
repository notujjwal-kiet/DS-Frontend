import React, { useEffect, useMemo, useState } from 'react';
import { createRoot } from 'react-dom/client';
import './styles.css';

const stages = [
  ['goal', 'Goal & context', 'Clarify what you want to build'],
  ['research', 'Research sources', 'Find current, reliable material'],
  ['concepts', 'Extract concepts', 'Turn sources into key ideas'],
  ['explain', 'Explain the topic', 'Build a grounded mental model'],
  ['map', 'Map connections', 'Connect ideas and dependencies'],
  ['practice', 'Create practice', 'Check understanding with questions'],
  ['gate', 'Code readiness', 'Decide what code support fits'],
  ['response', 'Compose response', 'Assemble your learning guide'],
  ['complete', 'Ready to learn', 'Review your personalized path'],
];

const sampleResponse = {
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

function Icon({ name }) {
  const paths = {
    compass: 'M12 3l3 6 6 3-6 3-3 6-3-6-6-3 6-3 3-6z',
    pipeline: 'M4 7h16M4 12h16M4 17h16',
    source: 'M5 4h14v16H5z M8 8h8M8 12h8M8 16h5',
    book: 'M5 4h12a2 2 0 012 2v14H7a2 2 0 01-2-2V4z M7 4v16',
    map: 'M4 6l6-2 4 2 6-2v14l-6 2-4-2-6 2V6z M10 4v14M14 6v14',
    practice: 'M5 4h14v16H5z M8 8h8M8 12h5M8 16h7',
    search: 'M11 19a8 8 0 100-16 8 8 0 000 16z M21 21l-4.3-4.3',
    arrow: 'M5 12h14M13 6l6 6-6 6',
    check: 'M5 12l4 4L19 6',
    plus: 'M12 5v14M5 12h14',
    link: 'M10 13a5 5 0 007.5.5l1-1a5 5 0 00-7-7l-.6.6 M14 11a5 5 0 00-7.5-.5l-1 1a5 5 0 007 7l.6-.6',
  };
  return <svg className="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d={paths[name] || paths.compass} /></svg>;
}

function App() {
  const [page, setPage] = useState('Start Learning');
  const [form, setForm] = useState({ goal: '', description: '', project: '', experience_level: 'Intermediate', tech_stack: '', wants_snippet: false });
  const [job, setJob] = useState(null);
  const [response, setResponse] = useState(null);
  const [error, setError] = useState('');
  const [answers, setAnswers] = useState({});
  const mock = import.meta.env.VITE_USE_MOCK === 'true';
  const baseUrl = import.meta.env.VITE_API_BASE_URL || '';

  const activeStage = useMemo(() => job?.stage_id || job?.current_stage || 'goal', [job]);

  useEffect(() => {
    if (!job?.job_id || job.status === 'completed' || job.status === 'failed' || job.status === 'timed_out') return undefined;
    let cancelled = false;
    let timer;
    const poll = async () => {
      try {
        let next;
        if (mock) {
          const index = Math.min((job.progress || 0) + 1, 100);
          const stage = stages[Math.min(Math.floor(index / 12), stages.length - 1)];
          next = index >= 100 ? { status: 'completed', progress: 100, current_stage: 'complete', stage_id: 'complete', result: sampleResponse } : { ...job, status: 'running', progress: index, current_stage: stage[0], stage_id: stage[0] };
        } else {
          const res = await fetch(`${baseUrl}/api/learn/${job.job_id}`);
          if (res.status === 429) { timer = setTimeout(poll, 3000); return; }
          if (!res.ok) throw new Error(`Learning job returned ${res.status}.`);
          next = await res.json();
        }
        if (cancelled) return;
        setJob(next);
        if (next.status === 'completed') { setResponse(next.result || next.response || sampleResponse); setPage('Explanation'); return; }
        if (next.status === 'failed' || next.status === 'timed_out') { setError(next.error || 'The learning job could not be completed.'); return; }
        timer = setTimeout(poll, 2000);
      } catch (err) { if (!cancelled) setError(err.message || 'Unable to reach the learning service.'); }
    };
    timer = setTimeout(poll, mock ? 350 : 2000);
    return () => { cancelled = true; clearTimeout(timer); };
  }, [job, mock, baseUrl]);

  const startLearning = async (event) => {
    event.preventDefault();
    setError('');
    setPage('Pipeline');
    if (mock) { setJob({ job_id: 'sample-job', status: 'running', progress: 0, current_stage: 'goal', stage_id: 'goal' }); return; }
    try {
      const res = await fetch(`${baseUrl}/api/learn`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) });
      if (!res.ok) throw new Error(res.status === 429 ? 'Too many requests. Try again in a moment.' : `Unable to start learning (${res.status}).`);
      setJob(await res.json());
    } catch (err) { setError(err.message); }
  };

  const requestCode = async (wantsFullCode) => {
    setError('');
    if (mock) { setResponse({ ...response, full_code: wantsFullCode ? '// Your generated code will appear here.' : '', code_notice: 'Sample data: code output is illustrative.' }); return; }
    try {
      const res = await fetch(`${baseUrl}/api/code-request`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ response_id: response.response_id, wants_full_code: wantsFullCode, attempt_code: form.attempt_code, attempt_language: form.attempt_language, answers: Object.entries(answers).map(([question_id, answer]) => ({ question_id, answer })) }) });
      if (!res.ok) throw new Error(`Code request failed (${res.status}).`);
      setResponse(await res.json());
    } catch (err) { setError(err.message); }
  };

  const nav = [
    ['Start Learning', 'compass'], ['Pipeline', 'pipeline'], ['Sources', 'source'],
    ['Explanation', 'book'], ['Concept Map', 'map'], ['Practice & Code Gate', 'practice'],
  ];
  return <div className="app-shell">
    <aside className="sidebar">
      <div className="brand"><div className="brand-mark">L</div><div><strong>Learnboard</strong><span>BUILD WITH CONTEXT</span></div></div>
      <div className="sidebar-label">WORKSPACE</div>
      <nav>{nav.map(([label, icon]) => <button key={label} className={page === label ? 'nav-item active' : 'nav-item'} onClick={() => setPage(label)}><Icon name={icon} /><span>{label}</span>{label === 'Pipeline' && job && <em>{job.progress || 0}%</em>}</button>)}</nav>
      <div className="sidebar-bottom"><div className="status-dot" /><div><strong>{mock ? 'Sample data enabled' : 'Connected workspace'}</strong><span>{mock ? 'VITE_USE_MOCK=true' : baseUrl || 'API base not set'}</span></div></div>
    </aside>
    <main className="main">
      <header className="topbar"><div className="crumb">Learning workspace <span>/</span> {page}</div><div className="search"><Icon name="search" /><input placeholder="Search your learning workspace" /></div><div className="avatar">U</div></header>
      <div className="content">
        {mock && <div className="sample-label"><span /> Sample data</div>}
        {error && <div className="error-banner"><strong>Something went wrong.</strong> {error} <button onClick={() => { setError(''); setPage('Start Learning'); }}>Retry</button></div>}
        {page === 'Start Learning' && <StartLearning form={form} setForm={setForm} onSubmit={startLearning} />}
        {page === 'Pipeline' && <Pipeline job={job} activeStage={activeStage} onStart={() => setPage('Start Learning')} />}
        {page === 'Sources' && <Sources response={response} />}
        {page === 'Explanation' && <Explanation response={response} />}
        {page === 'Concept Map' && <ConceptMap response={response} />}
        {page === 'Practice & Code Gate' && <Practice response={response} answers={answers} setAnswers={setAnswers} onRequest={requestCode} />}
      </div>
    </main>
  </div>;
}

function StartLearning({ form, setForm, onSubmit }) {
  const update = (key, value) => setForm({ ...form, [key]: value });
  return <section className="view intro-view"><div className="eyebrow">PERSONALIZED LEARNING PATH</div><h1>Start with a goal.<br /><span>Build with understanding.</span></h1><p className="lede">Tell us what you want to learn and we’ll turn it into a focused, evidence-backed path you can actually apply.</p><form className="goal-card" onSubmit={onSubmit}><div className="section-heading"><div><span className="number">01</span><h2>Your learning brief</h2></div><span className="required">All fields marked * are required</span></div><div className="field-grid"><label className="wide">What do you want to learn? *<input required value={form.goal} onChange={e => update('goal', e.target.value)} placeholder="e.g. Build a production-ready task API" /></label><label className="wide">Describe the outcome you’re aiming for *<textarea required value={form.description} onChange={e => update('description', e.target.value)} placeholder="What should you be able to understand or do by the end?" rows="3" /></label><label>Project context<input required value={form.project} onChange={e => update('project', e.target.value)} placeholder="e.g. My first backend service" /></label><label>Experience level<select value={form.experience_level} onChange={e => update('experience_level', e.target.value)}><option>Beginner</option><option>Intermediate</option><option>Advanced</option></select></label><label className="wide">Tech stack <input value={form.tech_stack} onChange={e => update('tech_stack', e.target.value)} placeholder="e.g. TypeScript, Node.js, PostgreSQL" /></label></div><label className="toggle-row"><input type="checkbox" checked={form.wants_snippet} onChange={e => update('wants_snippet', e.target.checked)} /><span className="toggle" /><span>Include a small code snippet when it helps me understand</span></label><button className="primary-button" type="submit">Create my learning path <Icon name="arrow" /></button></form></section>;
}

function Pipeline({ job, activeStage, onStart }) {
  if (!job) return <section className="view empty-view"><div className="empty-icon"><Icon name="pipeline" /></div><h1>Your pipeline is waiting</h1><p>Start a learning brief to see each stage move from context to a complete learning response.</p><button className="primary-button" onClick={onStart}>Start learning <Icon name="arrow" /></button></section>;
  const activeIndex = stages.findIndex(s => s[0] === activeStage);
  return <section className="view"><div className="page-heading"><div><div className="eyebrow">LIVE JOB · {job.job_id}</div><h1>Learning pipeline</h1><p>We’re turning your brief into a useful path. You can browse the workspace while it runs.</p></div><div className="progress-ring"><strong>{job.progress || 0}%</strong><span>complete</span></div></div><div className="pipeline-card">{stages.map((stage, index) => <div className={`stage-row ${index < activeIndex ? 'done' : ''} ${index === activeIndex ? 'current' : ''}`} key={stage[0]}><div className="stage-marker">{index < activeIndex ? <Icon name="check" /> : <span>{String(index + 1).padStart(2, '0')}</span>}</div><div className="stage-copy"><strong>{stage[1]}</strong><span>{stage[2]}</span></div><div className="stage-status">{index < activeIndex ? 'Complete' : index === activeIndex ? 'In progress' : 'Queued'}</div></div>)}</div></section>;
}

function EmptyState({ title = 'Nothing here yet', text = 'Complete a learning brief and this space will populate with your grounded response.' }) { return <div className="panel empty-panel"><div className="empty-icon small"><Icon name="book" /></div><h2>{title}</h2><p>{text}</p></div>; }
function Sources({ response }) { if (!response) return <section className="view"><PageTitle eyebrow="EVIDENCE LAYER" title="Sources" text="Every learning response is grounded in sources you can open, inspect, and evaluate." /><EmptyState /></section>; return <section className="view"><PageTitle eyebrow="EVIDENCE LAYER" title="Sources" text="A source trail for the ideas in your learning response." /><div className="source-grid">{response.sources.map((source, index) => <article className="source-card" key={source.title}><div className="source-number">0{index + 1}</div><div className="source-top"><span className="source-type">REFERENCE</span><a href={source.url} target="_blank" rel="noreferrer"><Icon name="link" /></a></div><h2>{source.title}</h2><p>{source.publisher}</p><Metric label="Freshness" value={source.freshness} /><Metric label="Reliability" value={source.reliability} /></article>)}</div></section>; }
function Metric({ label, value }) { return <div className="metric"><div><span>{label}</span><strong>{value}%</strong></div><div className="meter"><i style={{ width: `${value}%` }} /></div></div>; }
function Explanation({ response }) { if (!response) return <section className="view"><PageTitle eyebrow="GROUNDED EXPLANATION" title="Explanation" text="Your cited explanation will appear here after the pipeline completes." /><EmptyState /></section>; return <section className="view"><PageTitle eyebrow="GROUNDED EXPLANATION" title={response.title} text={response.summary} /><div className="explanation-list">{response.sections.map(section => <article className="explanation-card" key={section.heading}><div className="section-count">0{response.sections.indexOf(section) + 1}</div><div><h2>{section.heading}</h2><p>{section.body}</p><div className="citations">{section.citations.map(i => <a href={response.sources[i].url} target="_blank" rel="noreferrer" key={i}>[{i + 1}] {response.sources[i].publisher}</a>)}</div></div></article>)}</div></section>; }
function ConceptMap({ response }) { if (!response) return <section className="view"><PageTitle eyebrow="CONNECTIONS" title="Concept map" text="The relationships between the concepts in your response will be mapped here." /><EmptyState /></section>; return <section className="view"><PageTitle eyebrow="CONNECTIONS" title="Concept map" text="See the ideas as a system rather than a list of disconnected definitions." /><div className="map-panel"><div className="map-lines">{response.edges.map(([a, b]) => { const from = response.concepts.find(c => c.id === a); const to = response.concepts.find(c => c.id === b); return <svg key={`${a}-${b}`} className="edge" viewBox="0 0 100 100" preserveAspectRatio="none"><line x1={from.x} y1={from.y} x2={to.x} y2={to.y} /></svg>; })}</div>{response.concepts.map(node => <div className="concept-node" style={{ left: `${node.x}%`, top: `${node.y}%` }} key={node.id}><span /><strong>{node.label}</strong></div>)}</div></section>; }
function Practice({ response, answers, setAnswers, onRequest }) { if (!response) return <section className="view"><PageTitle eyebrow="CHECK YOUR UNDERSTANDING" title="Practice & code gate" text="Questions will appear here once there is a learning response to work from." /><EmptyState /></section>; return <section className="view"><PageTitle eyebrow="CHECK YOUR UNDERSTANDING" title="Practice before code" text="Write what you understand first. Your attempt helps decide what code support is useful." /><div className="practice-layout"><div className="questions">{response.questions.map((q, i) => <label className="question" key={q.question_id}><span>0{i + 1}</span><strong>{q.prompt}</strong><textarea rows="4" value={answers[q.question_id] || ''} onChange={e => setAnswers({ ...answers, [q.question_id]: e.target.value })} placeholder="Write your answer in your own words..." /></label>)}<button className="secondary-button" onClick={() => onRequest(false)}>Submit answers <Icon name="arrow" /></button></div><aside className="code-gate"><div className="gate-icon"><Icon name="practice" /></div><h2>Code gate</h2><p>Try an explanation first, then choose the amount of implementation help you need.</p>{response.code_notice && <div className="notice">{response.code_notice}</div>}{response.full_code && <pre>{response.full_code}</pre>}<button className="primary-button" onClick={() => onRequest(true)}>Request full code <Icon name="arrow" /></button><button className="text-button" onClick={() => onRequest(false)}>Submit my attempt</button></aside></div></section>; }
function PageTitle({ eyebrow, title, text }) { return <div className="page-heading"><div><div className="eyebrow">{eyebrow}</div><h1>{title}</h1><p>{text}</p></div></div>; }

createRoot(document.getElementById('root')).render(<App />);
