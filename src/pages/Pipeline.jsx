import Icon from '../components/Icon';
import { stages } from '../data/learning';

export default function Pipeline({ job, activeStage, onStart }) {
  if (!job) return <section className="view empty-view"><div className="empty-icon"><Icon name="pipeline" /></div><h1>Your pipeline is waiting</h1><p>Start a learning brief to see each stage move from context to a complete learning response.</p><button className="primary-button" onClick={onStart}>Start learning <Icon name="arrow" /></button></section>;
  const activeIndex = stages.findIndex(s => s[0] === activeStage);
  return <section className="view"><div className="page-heading"><div><div className="eyebrow">LIVE JOB · {job.job_id}</div><h1>Learning pipeline</h1><p>We’re turning your brief into a useful path. You can browse the workspace while it runs.</p></div><div className="progress-ring"><strong>{job.progress || 0}%</strong><span>complete</span></div></div><div className="pipeline-card">{stages.map((stage, index) => <div className={`stage-row ${index < activeIndex ? 'done' : ''} ${index === activeIndex ? 'current' : ''}`} key={stage[0]}><div className="stage-marker">{index < activeIndex ? <Icon name="check" /> : <span>{String(index + 1).padStart(2, '0')}</span>}</div><div className="stage-copy"><strong>{stage[1]}</strong><span>{stage[2]}</span></div><div className="stage-status">{index < activeIndex ? 'Complete' : index === activeIndex ? 'In progress' : 'Queued'}</div></div>)}</div></section>;
}
