import { EXPLAIN, SPECS } from '../data';
import type { WidgetState } from '../types';

export default function SpecReadout({ state }: { state: WidgetState }) {
  const rows = SPECS[state.type](state);
  const e = EXPLAIN[state.type];

  return (
    <div className="readout">
      <div className="readout-inner">
        <h2>What's on screen right now</h2>
        <dl className="specs">
          {rows.map((r) => (
            <div className="spec" key={r[0]}>
              <dt>{r[0]}</dt>
              <dd>
                {r[1]}
                {r[2] && (
                  <>
                    <br />
                    <small>{r[2]}</small>
                  </>
                )}
              </dd>
            </div>
          ))}
        </dl>

        <div className="explain">
          <h3>{e.h}</h3>
          <p className="purpose">{e.purpose}</p>
          <div className="doc-grid">
            <section className="doc-block">
              <h4>Reach for it when</h4>
              <ul>
                {e.when.map((w) => (
                  <li key={w}>{w}</li>
                ))}
              </ul>
            </section>
            <section className="doc-block">
              <h4>How it behaves</h4>
              <p dangerouslySetInnerHTML={{ __html: e.behaves }} />
            </section>
            <section className="doc-block">
              <h4>What you can configure</h4>
              <p>{e.config}</p>
            </section>
            <section className="doc-block">
              <h4>Worth knowing</h4>
              <ul>
                {e.limits.map((l) => (
                  <li key={l} dangerouslySetInnerHTML={{ __html: l }} />
                ))}
              </ul>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
