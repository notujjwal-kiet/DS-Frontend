import Icon from './Icon';
import { navigation } from '../data/learning';

export function Sidebar({ page, onNavigate, job, mock, baseUrl }) {
  return <aside className="sidebar">
    <div className="brand"><div className="brand-mark">✦</div><div><strong>Dev<span>Scout</span></strong><small>LEARN WHILE YOU BUILD</small></div></div>
    <div className="sidebar-label">WORKSPACE</div>
    <nav>{navigation.map(([label, icon]) => <button key={label} className={page === label ? 'nav-item active' : 'nav-item'} onClick={() => onNavigate(label)}><Icon name={icon} /><span>{label}</span>{label === 'Pipeline' && job && <em>{job.progress || 0}%</em>}</button>)}</nav>
    <div className="sidebar-bottom"><div className="status-dot" /><div><strong>{mock ? 'Sample data enabled' : 'Connected workspace'}</strong><span>{mock ? 'VITE_USE_MOCK=true' : baseUrl || 'API base not set'}</span></div></div>
  </aside>;
}

export function TopBar({ page, query, onQueryChange, health }) {
  return <header className="topbar"><div className="crumb">DevScout <span>/</span> {page}</div><div className="search"><Icon name="search" /><input aria-label="Search sources and explanation" value={query} onChange={(event) => onQueryChange(event.target.value)} placeholder="Search concepts, sources, or project tasks..." /><kbd>⌘ K</kbd></div><div className={`connection ${health === 'unreachable' ? 'unreachable' : ''}`}><span /> {health === 'ready' ? 'API ready' : health === 'unreachable' ? 'API unreachable' : 'Checking API'}</div></header>;
}
