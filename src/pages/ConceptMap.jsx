import { EmptyState, PageTitle } from '../components/Shared';

export default function ConceptMap({ response }) {
  if (!response) return <section className="view"><PageTitle eyebrow="CONNECTIONS" title="Concept map" text="The relationships between the concepts in your response will be mapped here." /><EmptyState /></section>;
  return <section className="view"><PageTitle eyebrow="CONNECTIONS" title="Concept map" text="See the ideas as a system rather than a list of disconnected definitions." /><div className="map-panel"><div className="map-lines">{response.edges.map(([a, b]) => { const from = response.concepts.find(c => c.id === a); const to = response.concepts.find(c => c.id === b); return <svg key={`${a}-${b}`} className="edge" viewBox="0 0 100 100" preserveAspectRatio="none"><line x1={from.x} y1={from.y} x2={to.x} y2={to.y} /></svg>; })}</div>{response.concepts.map(node => <div className="concept-node" style={{ left: `${node.x}%`, top: `${node.y}%` }} key={node.id}><span /><strong>{node.label}</strong></div>)}</div></section>;
}
