import { useState } from 'react';
import { DATA_MAPPING_INTRO, DATA_MAPPING_TYPES } from '../data';

interface Props {
  onNavigateToRule: (ruleName: string) => void;
}

export default function DataMappingPage({ onNavigateToRule }: Props) {
  const [active, setActive] = useState(DATA_MAPPING_TYPES[0].name);
  const mapping = DATA_MAPPING_TYPES.find((m) => m.name === active) ?? DATA_MAPPING_TYPES[0];

  return (
    <div className="workbench rules-workbench">
      <aside className="panel" aria-label="Data mapping types">
        <h2>Data mapping</h2>
        <div className="ctl">
          <span className="ctl-label">Source</span>
          <div className="stack" role="group">
            {DATA_MAPPING_TYPES.map((m) => (
              <button key={m.name} type="button" aria-pressed={active === m.name} onClick={() => setActive(m.name)}>
                {m.name}
              </button>
            ))}
          </div>
        </div>
        <p className="hint">{DATA_MAPPING_INTRO}</p>
      </aside>

      <div className="rule-detail-wrap">
        <div className="readout-inner rule-detail" key={mapping.name}>
          <h2>{mapping.name}</h2>
          <div className="explain">
            <p className="purpose">{mapping.description}</p>
            <div className="doc-grid">
              <section className="doc-block">
                <h4>Example</h4>
                <p dangerouslySetInnerHTML={{ __html: mapping.example }} />
              </section>
              <section className="doc-block">
                <h4>Shared mechanics</h4>
                <p>
                  {mapping.sharedMechanicsPrefix}{' '}
                  <button className="inline-link" type="button" onClick={() => onNavigateToRule(mapping.relatedRule)}>
                    {mapping.relatedRule} targeting rule →
                  </button>
                  {mapping.sharedMechanicsSuffix && ` — ${mapping.sharedMechanicsSuffix}`}
                </p>
              </section>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
