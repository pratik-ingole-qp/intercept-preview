import { Link, useNavigate, useParams } from 'react-router-dom';
import { DATA_MAPPING_INTRO, DATA_MAPPING_TYPES } from '../data';
import { slugify } from '../slug';

export default function DataMappingPage() {
  const { slug } = useParams<{ slug?: string }>();
  const navigate = useNavigate();
  const mapping = DATA_MAPPING_TYPES.find((m) => slugify(m.name) === slug) ?? DATA_MAPPING_TYPES[0];

  return (
    <div className="workbench rules-workbench">
      <aside className="panel" aria-label="Data mapping types">
        <h2>Data mapping</h2>
        <div className="ctl">
          <span className="ctl-label">Source</span>
          <div className="stack" role="group">
            {DATA_MAPPING_TYPES.map((m) => (
              <Link key={m.name} to={`/mapping/${slugify(m.name)}`} aria-pressed={mapping.name === m.name}>
                {m.name}
              </Link>
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
                  <button
                    className="inline-link"
                    type="button"
                    onClick={() => navigate(`/rules/${slugify(mapping.relatedRule)}`)}
                  >
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
