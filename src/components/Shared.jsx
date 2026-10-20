import Icon from './Icon';

export function EmptyState({ title = 'Nothing here yet', text = 'Complete a learning brief and this space will populate with your grounded response.' }) {
  return <div className="panel empty-panel"><div className="empty-icon small"><Icon name="book" /></div><h2>{title}</h2><p>{text}</p></div>;
}

export function PageTitle({ eyebrow, title, text }) {
  return <div className="page-heading"><div><div className="eyebrow">{eyebrow}</div><h1>{title}</h1><p>{text}</p></div></div>;
}

export function Metric({ label, value }) {
  return <div className="metric"><div><span>{label}</span><strong>{value}%</strong></div><div className="meter"><i style={{ width: `${value}%` }} /></div></div>;
}
