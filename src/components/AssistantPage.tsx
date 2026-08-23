import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ASSISTANT_INTRO,
  ASSISTANT_QUESTIONS,
  EXAMPLE_RECIPES,
  EXAMPLE_SCENARIOS,
} from '../data';
import { buildRecipe, countCombinations, nearestExample, optionApplies, questionApplies } from '../assistant';
import type { Answers } from '../assistant';
import RecipeBlock from './RecipeBlock';
import { ASSISTANT_ICONS, AskIcon, CheckIcon } from './AssistantIcons';

const COMBOS = countCombinations();

const DEMO_KEY = 'cart-rescue';

export default function AssistantPage() {
  const [answers, setAnswers] = useState<Answers>({});

  const visible = ASSISTANT_QUESTIONS.filter((q) => questionApplies(q.key, answers));
  const answered = visible.filter((q) => answers[q.key]).length;
  const complete = answered === visible.length && Boolean(answers.where && answers.who && answers.when);

  const recipe = complete ? buildRecipe(answers) : null;
  const near = complete ? nearestExample(answers) : null;

  const demo = EXAMPLE_SCENARIOS.find((e) => e.key === DEMO_KEY)!;
  const demoRecipe = EXAMPLE_RECIPES[DEMO_KEY];

  return (
    <div className="readout single-column">
      {/* ---- 1. the problem, shown rather than described ---- */}
      <div className="readout-inner">
        <h2>The gap, side by side</h2>
        <div className="explain">
          <p className="purpose">
            Both panels describe the same scenario — <b>{demo.title}</b>. The left is what an example says today. The
            right is the same information written as something you can act on.
          </p>

          <div className="compare-grid">
            <section className="compare-col compare-before">
              <span className="compare-tag">Today — a pointer</span>
              <div className="rule-config-row" style={{ marginBottom: 10 }}>
                <span className="rule-chip">Type:</span>
                <span className="inline-link">{demo.typeLabel} →</span>
              </div>
              <div className="rule-config-row">
                <span className="rule-chip">Rules:</span>
                {demo.rules.map((r) => (
                  <span className="inline-link" key={r}>
                    {r} →
                  </span>
                ))}
              </div>
              <p className="compare-verdict">
                Which operand? What value? Do both have to match? The reader has to leave and re-derive all three.
              </p>
            </section>

            <section className="compare-col compare-after">
              <span className="compare-tag compare-tag-on">Proposed — an instruction</span>
              <RecipeBlock recipe={demoRecipe} dense />
              <p className="compare-verdict">
                Same facts, same links — but the operand, the literal value and the AND are on the page.
              </p>
            </section>
          </div>
        </div>
      </div>

      {/* ---- 2. the assistant ---- */}
      <div className="readout-inner" style={{ marginTop: 20 }}>
        <h2>Mini setup assistant</h2>
        <div className="explain">
          <p className="purpose">{ASSISTANT_INTRO}</p>

          <p className="asst-coverage">
            <b>{COMBOS.paths}</b> answer paths lead to <b>{COMBOS.recipes}</b> distinct recipes across{' '}
            <b>{COMBOS.types}</b> intercept types — small enough that every one of them is a combination you could
            check by hand.
          </p>

          <div className="asst-progress">
            <span>
              {answered} / {visible.length} answered
            </span>
            <div className="asst-bar">
              <i style={{ width: `${(answered / visible.length) * 100}%` }} />
            </div>
            {answered > 0 && (
              <button className="inline-link" type="button" onClick={() => setAnswers({})}>
                Start over
              </button>
            )}
          </div>

          {visible.map((q, i) => {
            const chosen = answers[q.key];
            const options = q.options.filter((o) => optionApplies(o, answers));

            return (
              <fieldset className={`asst-q${chosen ? ' is-answered' : ''}`} key={q.key}>
                <legend>
                  <span className="asst-ask" aria-hidden="true">
                    {chosen ? <CheckIcon /> : <AskIcon />}
                  </span>
                  <span className="asst-q-count">Question {i + 1} of {visible.length}</span>
                </legend>
                <h4 className="asst-prompt">{q.prompt}</h4>
                <p className="asst-help">{q.help}</p>
                <div className="asst-options">
                  {options.map((o) => (
                    <button
                      key={o.value}
                      type="button"
                      className="asst-option"
                      aria-pressed={chosen === o.value}
                      onClick={() =>
                        setAnswers((prev) =>
                          prev[q.key] === o.value ? { ...prev, [q.key]: undefined } : { ...prev, [q.key]: o.value },
                        )
                      }
                    >
                      <span className="asst-option-icon">{ASSISTANT_ICONS[o.icon]}</span>
                      <span className="asst-option-text">
                        <b>{o.label}</b>
                        <small>{o.hint}</small>
                      </span>
                      <span className="asst-option-tick" aria-hidden="true">
                        <CheckIcon />
                      </span>
                    </button>
                  ))}
                </div>
              </fieldset>
            );
          })}
        </div>
      </div>

      {/* ---- 3. the output: the same component as the demo above ---- */}
      <div className="readout-inner" style={{ marginTop: 20 }}>
        <h2>Your intercept</h2>
        <div className="explain">
          {!recipe && (
            <p className="asst-empty">
              Answer the questions above and the recipe assembles here — the same block shown in the comparison, built
              from your answers.
            </p>
          )}

          {recipe && (
            <>
              <p className="purpose">{recipe.because}</p>
              <RecipeBlock recipe={recipe} />
              {near ? (
                <p className="asst-near">
                  Closest documented scenario: <Link to={`/examples/${near.key}`}>{near.title} →</Link>
                </p>
              ) : (
                <p className="asst-near">No documented example is close to this combination — worth adding one.</p>
              )}
              <p className="asst-near">
                Haven't installed the snippet yet? <Link to="/setup">Setup →</Link>
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
