import type { ReactNode } from 'react';
import {
  NEXTJS_CODE,
  NEXTJS_INTRO,
  PLACEMENT_TABLE,
  PLATFORM_TABLE,
  SETUP_STEPS,
  SITE_BEHAVIOUR,
  SNIPPET_CODE,
  SNIPPET_INTRO,
  TROUBLESHOOTING_CHECKLIST,
  TROUBLESHOOTING_INTRO,
  TROUBLESHOOTING_OUTRO,
} from '../data';
import {
  CxSurveyPrerequisiteIllustration,
  EmbedSelectorIllustration,
  HeadInsertionIllustration,
  TriggerRulesIllustration,
  TypePickerIllustration,
  WebsiteUrlIllustration,
  WorkspaceNavIllustration,
} from './SetupIllustrations';

const STEP_ILLUSTRATIONS: Record<string, ReactNode> = {
  'cx-survey': <CxSurveyPrerequisiteIllustration />,
  'website-url': <WebsiteUrlIllustration />,
  navigate: <WorkspaceNavIllustration />,
  type: <TypePickerIllustration />,
  'embed-selector': <EmbedSelectorIllustration />,
  'trigger-rules': <TriggerRulesIllustration />,
};

export default function SetupPage() {
  return (
    <div className="readout single-column">
      <div className="readout-inner">
        <h2>Creating an intercept</h2>
        <div className="explain">
          <div className="setup-step-list">
            {SETUP_STEPS.map((s, i) => (
              <div className="setup-step" key={s.key}>
                <div className="setup-step-text">
                  <span className="setup-step-num">{i + 1}</span>
                  <div>
                    <h4>{s.title}</h4>
                    <p>{s.body}</p>
                  </div>
                </div>
                <div className="setup-step-illus">{STEP_ILLUSTRATIONS[s.key]}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="readout-inner" style={{ marginTop: 20 }}>
        <h2>Installing the tracking snippet</h2>
        <div className="explain">
          <p className="purpose" dangerouslySetInnerHTML={{ __html: SNIPPET_INTRO }} />

          <table className="operands-table settings-table">
            <thead><tr><th>Site type</th><th>Placement</th><th>Why</th></tr></thead>
            <tbody>
              {PLACEMENT_TABLE.map((row) => (
                <tr key={row.site}>
                  <td><b>{row.site}</b></td>
                  <td><code>{row.where}</code></td>
                  <td>{row.why}</td>
                </tr>
              ))}
            </tbody>
          </table>

          <h4 className="code-heading">Standard snippet</h4>
          <pre className="code-block"><code>{SNIPPET_CODE}</code></pre>

          <h4 className="code-heading">Where it goes</h4>
          <HeadInsertionIllustration />

          <h4 className="code-heading">Where to find the head tag, per platform</h4>
          <table className="operands-table settings-table">
            <thead><tr><th>Platform</th><th>How to access the code</th></tr></thead>
            <tbody>
              {PLATFORM_TABLE.map((row) => (
                <tr key={row.platform}>
                  <td><b>{row.platform}</b></td>
                  <td><code>{row.how}</code></td>
                </tr>
              ))}
            </tbody>
          </table>

          <h4 className="code-heading">Next.js — client-side navigation</h4>
          <p dangerouslySetInnerHTML={{ __html: NEXTJS_INTRO }} />
          <pre className="code-block"><code>{NEXTJS_CODE}</code></pre>
        </div>
      </div>

      <div className="readout-inner" style={{ marginTop: 20 }}>
        <h2>Traditional sites vs. SPAs</h2>
        <div className="explain">
          <div className="doc-grid">
            {SITE_BEHAVIOUR.map((s) => (
              <section className="doc-block" key={s.title}>
                <h4>{s.title}</h4>
                <p>{s.body}</p>
              </section>
            ))}
          </div>
        </div>
      </div>

      <div className="readout-inner" style={{ marginTop: 20 }}>
        <h2>Troubleshooting checklist</h2>
        <div className="explain">
          <p>{TROUBLESHOOTING_INTRO}</p>
          <ul>
            {TROUBLESHOOTING_CHECKLIST.map((t) => (
              <li key={t}>{t}</li>
            ))}
          </ul>
          <p dangerouslySetInnerHTML={{ __html: TROUBLESHOOTING_OUTRO }} />
        </div>
      </div>
    </div>
  );
}
