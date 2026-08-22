import { useState } from 'react';
import { INTERCEPT_SETTING_GROUPS, INTERCEPT_SETTINGS_INTRO, ORDER_OF_EXECUTION_EXAMPLE } from '../data';

const ALL_SETTINGS = INTERCEPT_SETTING_GROUPS.flatMap((g) => g.settings);

export default function InterceptSettingsPage() {
  const [active, setActive] = useState(ALL_SETTINGS[0].name);
  const setting = ALL_SETTINGS.find((s) => s.name === active) ?? ALL_SETTINGS[0];

  return (
    <div className="workbench rules-workbench">
      <aside className="panel" aria-label="Intercept settings list">
        <h2>Intercept settings</h2>
        {INTERCEPT_SETTING_GROUPS.map((group) => (
          <div className="ctl" key={group.title}>
            <span className="ctl-label">{group.title}</span>
            <div className="stack" role="group">
              {group.settings.map((s) => (
                <button key={s.name} type="button" aria-pressed={active === s.name} onClick={() => setActive(s.name)}>
                  {s.name}
                </button>
              ))}
            </div>
          </div>
        ))}
        <p className="hint">{INTERCEPT_SETTINGS_INTRO}</p>
      </aside>

      <div className="rule-detail-wrap">
        <div className="readout-inner rule-detail" key={setting.name}>
          <h2>{setting.name}</h2>
          <div className="explain">
            <p className="purpose">{setting.understanding}</p>
            <div className="doc-grid">
              <section className="doc-block">
                <h4>Default</h4>
                <p><code>{setting.defaultValue}</code></p>
              </section>
              {setting.notes && (
                <section className="doc-block">
                  <h4>Worth knowing</h4>
                  <ul>
                    {setting.notes.map((n) => (
                      <li key={n} dangerouslySetInnerHTML={{ __html: n }} />
                    ))}
                  </ul>
                </section>
              )}
            </div>

            {setting.name === 'Order (priority)' && (
              <>
                <h4 className="code-heading">Worked example — three intercepts in one project</h4>
                <p>
                  All three could theoretically match the same visitor. Only one is shown, decided purely by order —
                  there is no weighting, priority score, or stacking.
                </p>
                <table className="operands-table settings-table">
                  <thead>
                    <tr><th>Order</th><th>Intercept</th><th>Trigger rule</th><th>Sampling</th><th>What happens</th></tr>
                  </thead>
                  <tbody>
                    {ORDER_OF_EXECUTION_EXAMPLE.map((row) => (
                      <tr key={row.order}>
                        <td><b>{row.order}</b></td>
                        <td>{row.name}</td>
                        <td><code>{row.trigger}</code></td>
                        <td>{row.samplingRate}</td>
                        <td>{row.outcome}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
