import { Link, useParams } from 'react-router-dom';
import { IDENTITY_COUNTERS, IDENTITY_INTRO, IDENTITY_SECTIONS } from '../data';

export default function VisitorIdentityPage() {
  const { key } = useParams<{ key?: string }>();
  const section = IDENTITY_SECTIONS.find((s) => s.key === key) ?? IDENTITY_SECTIONS[0];

  return (
    <div className="workbench rules-workbench">
      <aside className="panel" aria-label="Visitor identity sections">
        <h2>Visitor identity</h2>
        <div className="ctl">
          <span className="ctl-label">How uniqueness is defined</span>
          <div className="stack" role="group">
            {IDENTITY_SECTIONS.map((s) => (
              <Link key={s.key} to={`/identity/${s.key}`} aria-pressed={section.key === s.key}>
                {s.title}
              </Link>
            ))}
          </div>
        </div>
        <p className="hint">{IDENTITY_INTRO}</p>
      </aside>

      <div className="rule-detail-wrap">
        <div className="readout-inner rule-detail" key={section.key}>
          <h2>{section.title}</h2>
          <div className="explain">
            <p className="purpose" dangerouslySetInnerHTML={{ __html: section.body }} />

            {section.key === 'counters' && (
              <table className="operands-table settings-table">
                <thead>
                  <tr><th>Rule</th><th>Where it's stored</th><th>Increments on</th><th>Resets on</th></tr>
                </thead>
                <tbody>
                  {IDENTITY_COUNTERS.map((c) => (
                    <tr key={c.name}>
                      <td><b>{c.name}</b></td>
                      <td>{c.storage}</td>
                      <td>{c.incrementsOn}</td>
                      <td>{c.resetsOn}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}

            {section.notes && (
              <ul className="rule-limits" style={{ marginTop: 18 }}>
                {section.notes.map((n) => (
                  <li key={n} dangerouslySetInnerHTML={{ __html: n }} />
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
