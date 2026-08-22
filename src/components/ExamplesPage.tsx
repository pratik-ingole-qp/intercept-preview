import { useState } from 'react';
import { EXAMPLE_CATEGORIES, EXAMPLES_INTRO, EXAMPLE_SCENARIOS } from '../data';
import type { InterceptType } from '../types';

interface Props {
  onNavigateToPreview: (type: InterceptType) => void;
  onNavigateToRule: (ruleName: string) => void;
}

export default function ExamplesPage({ onNavigateToPreview, onNavigateToRule }: Props) {
  const [active, setActive] = useState(EXAMPLE_SCENARIOS[0].key);
  const example = EXAMPLE_SCENARIOS.find((e) => e.key === active) ?? EXAMPLE_SCENARIOS[0];

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
                  <button key={e.key} type="button" aria-pressed={active === e.key} onClick={() => setActive(e.key)}>
                    {e.title}
                  </button>
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
                  <button className="inline-link" type="button" onClick={() => onNavigateToPreview(example.type)}>
                    {example.typeLabel} →
                  </button>
                </div>
                {example.rules.length > 0 ? (
                  <div className="rule-config-row">
                    <span className="rule-chip">Rules:</span>
                    {example.rules.map((r) => (
                      <button key={r} className="inline-link" type="button" onClick={() => onNavigateToRule(r)}>
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
