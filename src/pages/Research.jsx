import Icon from '../components/Icon';
import { EmptyState, Metric, PageTitle } from '../components/Shared';

export function Sources({ response, query }) {
  if (!response) return <section className="view"><PageTitle eyebrow="EVIDENCE LAYER" title="Sources" text="Every learning response is grounded in sources you can open, inspect, and evaluate." /><EmptyState /></section>;
  const q = query.trim().toLowerCase();
  const sources = response.sources.filter(source => !q || `${source.title} ${source.publisher} ${source.url}`.toLowerCase().includes(q));
  return <section className="view"><PageTitle eyebrow="EVIDENCE LAYER" title="Sources" text="A source trail for the ideas in your learning response." />{sources.length ? <div className="source-grid">{sources.map((source, index) => <article className="source-card" key={source.title}><div className="source-number">0{index + 1}</div><div className="source-top"><span className="source-type">REFERENCE</span><a href={source.url} target="_blank" rel="noreferrer"><Icon name="link" /></a></div><h2>{source.title}</h2><p>{source.publisher}</p><Metric label="Freshness" value={source.freshness} /><Metric label="Reliability" value={source.reliability} /></article>)}</div> : <EmptyState title="No matching sources" text="Try a different search term." />}</section>;
}

export function Explanation({ response, query }) {
  if (!response) return <section className="view"><PageTitle eyebrow="GROUNDED EXPLANATION" title="Explanation" text="Your cited explanation will appear here after the pipeline completes." /><EmptyState /></section>;
  const q = query.trim().toLowerCase();
  const sections = response.sections.filter(section => !q || `${section.heading} ${section.body}`.toLowerCase().includes(q));
  return <section className="view"><PageTitle eyebrow="GROUNDED EXPLANATION" title={response.title} text={response.summary} />{sections.length ? <div className="explanation-list">{sections.map((section, index) => <article className="explanation-card" key={section.heading}><div className="section-count">0{index + 1}</div><div><h2>{section.heading}</h2><p>{section.body}</p><div className="citations">{section.citations.map(i => <a href={response.sources[i].url} target="_blank" rel="noreferrer" key={i}>[{i + 1}] {response.sources[i].publisher}</a>)}</div></div></article>)}</div> : <EmptyState title="No matching explanation sections" text="Try a different search term." />}</section>;
}
