import { Link, useNavigate, useParams } from 'react-router-dom';
import { EXAMPLE_CATEGORIES, EXAMPLES_INTRO, EXAMPLE_SCENARIOS } from '../data';
import { slugify } from '../slug';

export default function ExamplesPage() {
  const { key } = useParams<{ key?: string }>();
  const navigate = useNavigate();
  const example = EXAMPLE_SCENARIOS.find((e) => e.key === key) ?? EXAMPLE_SCENARIOS[0];

  return (
    <div className="workbench rules-workbench">
      <aside className="panel" aria-label="Example scenarios">
        <h2>Examples</h2>
        {EXAMPLE_CATEGORIES.map((category) => {
          const items = EXAMPLE_SCENARIOS.filter((e) => e.category === category);
          if (!items.length) return null;
          return (
            <div className="ctl" key={category}>
              <span className="ctl-label">{category}</span>
              <div className="stack" role="group">
                {items.map((e) => (
                  <Link key={e.key} to={`/examples/${e.key}`} aria-pressed={example.key === e.key}>
                    {e.title}
                  </Link>
                ))}
              </div>
            </div>
          );
        })}
        <p className="hint">{EXAMPLES_INTRO}</p>
      </aside>

      <div className="rule-detail-wrap">
        <div className="readout-inner rule-detail" key={example.key}>
          <h2>{example.title}</h2>
          <div className="explain">
            <p className="purpose">{example.persona}</p>

            <div className="doc-grid">
              <section className="doc-block">
                <h4>Goal</h4>
                <p>{example.goal}</p>
              </section>

              <section className="doc-block">
                <h4>Setup</h4>
                <div className="rule-config-row" style={{ marginBottom: 10 }}>
                  <span className="rule-chip">Type:</span>
                  <button className="inline-link" type="button" onClick={() => navigate(`/preview/${example.type}`)}>
                    {example.typeLabel} →
                  </button>
                </div>
                {example.rules.length > 0 ? (
                  <div className="rule-config-row">
                    <span className="rule-chip">Rules:</span>
                    {example.rules.map((r) => (
                      <button
                        key={r}
                        className="inline-link"
                        type="button"
                        onClick={() => navigate(`/rules/${slugify(r)}`)}
                      >
                        {r} →
                      </button>
                    ))}
                  </div>
                ) : (
                  <p style={{ margin: 0, color: 'var(--faint)', fontSize: '0.9rem' }}>Uses the Mobile SDK's own rule set, not the web targeting rules.</p>
                )}
              </section>

              <section className="doc-block" style={{ gridColumn: '1 / -1' }}>
                <h4>Why this combination works</h4>
                <p>{example.why}</p>
              </section>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
