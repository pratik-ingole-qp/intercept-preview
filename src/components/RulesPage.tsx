import { useState } from 'react';
import { OPERANDS, OPERANDS_INTRO, RULES, RULE_GROUPS, RULE_TO_IDENTITY_SECTION } from '../data';

interface Props {
  initialRule?: string;
  onNavigateToIdentity: (sectionKey: string) => void;
}

export default function RulesPage({ initialRule, onNavigateToIdentity }: Props) {
  const [active, setActive] = useState(initialRule ?? RULES[0].name);
  const [showOperands, setShowOperands] = useState(false);

  const rule = RULES.find((r) => r.name === active) ?? RULES[0];
  const identitySection = RULE_TO_IDENTITY_SECTION[rule.name];

  return (
    <div className="workbench rules-workbench">
      <aside className="panel" aria-label="Targeting rules list">
        <h2>Targeting rules</h2>
        {RULE_GROUPS.map((group) => (
          <div className="ctl" key={group.title}>
            <span className="ctl-label">{group.title}</span>
            <div className="stack" role="group">
              {group.rules.map((name) => (
                <button key={name} type="button" aria-pressed={active === name} onClick={() => setActive(name)}>
                  {name}
                </button>
              ))}
            </div>
          </div>
        ))}
        <div className="divider" />
        <button className="replay" type="button" onClick={() => setShowOperands((v) => !v)}>
          {showOperands ? 'Hide operands reference' : 'Show operands reference'}
        </button>
      </aside>

      <div className="rule-detail-wrap">
        {showOperands ? (
          <div className="readout-inner rule-detail">
            <h2>Operands — how a rule compares its value</h2>
            <div className="explain">
              <p className="purpose">{OPERANDS_INTRO}</p>
              <table className="operands-table">
                <thead>
                  <tr><th>Operand</th><th>What it does</th></tr>
                </thead>
                <tbody>
                  {OPERANDS.map((o) => (
                    <tr key={o.name}>
                      <td><code>{o.name}</code></td>
                      <td>{o.meaning}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <div className="readout-inner rule-detail" key={rule.name}>
            <h2>{rule.name}</h2>
            <div className="explain">
              <p className="purpose" dangerouslySetInnerHTML={{ __html: rule.understanding }} />

              {identitySection && (
                <p className="rule-scenario" style={{ marginTop: -10, marginBottom: 20 }}>
                  This rule depends on how visitor uniqueness is defined —{' '}
                  <button className="inline-link" type="button" onClick={() => onNavigateToIdentity(identitySection)}>
                    see Visitor Identity →
                  </button>
                </p>
              )}

              <div className="doc-grid">
                <section className="doc-block">
                  <h4>Example scenario</h4>
                  <p dangerouslySetInnerHTML={{ __html: rule.scenario }} />
                </section>

                <section className="doc-block">
                  <h4>How it's configured</h4>
                  {rule.config.map((c, i) => (
                    <div className="rule-config-row" key={i}>
                      {c.key && (
                        <span className="rule-chip">
                          Key: <code dangerouslySetInnerHTML={{ __html: c.key }} />
                        </span>
                      )}
                      <span className="rule-chip">Operand: <code>{c.operand}</code></span>
                      {c.value !== '—' && (
                        <span className="rule-chip">
                          Value: <code dangerouslySetInnerHTML={{ __html: c.value }} />
                        </span>
                      )}
                    </div>
                  ))}
                </section>

                <section className="doc-block">
                  <h4>Result</h4>
                  <p>{rule.result}</p>
                </section>

                <section className="doc-block">
                  <h4>Operands this rule supports</h4>
                  <div className="rule-config-row">
                    {rule.operands.map((op) => (
                      <span className="rule-chip" key={op}>{op}</span>
                    ))}
                  </div>
                </section>

                {rule.limitations && (
                  <section className="doc-block">
                    <h4>Worth knowing</h4>
                    <ul>
                      {rule.limitations.map((l) => (
                        <li key={l} dangerouslySetInnerHTML={{ __html: l }} />
                      ))}
                    </ul>
                  </section>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
