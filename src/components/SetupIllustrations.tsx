export function WorkspaceNavIllustration() {
  return (
    <div className="illus">
      <div className="illus-toolbar"><i /><i /><i /><span>app.questionpro.com/intercept</span></div>
      <div className="illus-body">
        <div className="illus-breadcrumb">
          <span>Workspaces</span>
          <span className="sep">›</span>
          <span>Acme Retail</span>
          <span className="sep">›</span>
          <span className="active">Meridian Supply</span>
        </div>
        <div className="illus-row">
          <div className="illus-project-list">
            <div className="illus-project-item active">Meridian Supply <small>3 intercepts</small></div>
            <div className="illus-project-item">Northgate App <small>1 intercept</small></div>
            <div className="illus-project-item">Docs Site <small>0 intercepts</small></div>
          </div>
          <button className="illus-btn-primary" type="button">+ Create Intercept</button>
        </div>
      </div>
    </div>
  );
}

const TYPES = [
  { label: 'Pop-up', icon: '▢' },
  { label: 'Feedback tab', icon: '▤' },
  { label: 'Exit intent', icon: '⇥' },
  { label: 'Inline embed', icon: '▥' },
  { label: 'Mobile prompt', icon: '▱' },
];

export function TypePickerIllustration() {
  return (
    <div className="illus">
      <div className="illus-body">
        <p className="illus-label">Choose an intercept type</p>
        <div className="illus-type-grid">
          {TYPES.map((t, i) => (
            <div className={`illus-type-card${i === 3 ? ' active' : ''}`} key={t.label}>
              <span className="illus-type-icon">{t.icon}</span>
              {t.label}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export function EmbedSelectorIllustration() {
  return (
    <div className="illus">
      <div className="illus-body">
        <p className="illus-label">Embed selector</p>
        <div className="illus-field">
          <span className="illus-field-prefix">data-qp-intercept=</span>
          <span className="illus-field-value">"my-survey"</span>
        </div>
        <p className="illus-hint-text">Targets [data-qp-intercept="my-survey"] on your page.</p>
      </div>
    </div>
  );
}

export function TriggerRulesIllustration() {
  return (
    <div className="illus">
      <div className="illus-body">
        <p className="illus-label">Trigger rules</p>
        <div className="illus-rule-row">
          <span className="illus-chip illus-chip-if">IF</span>
          <span className="illus-chip">Page URL</span>
          <span className="illus-chip illus-chip-op">Contains</span>
          <span className="illus-chip illus-chip-val">/checkout</span>
        </div>
        <div className="illus-rule-row">
          <span className="illus-chip illus-chip-if">AND</span>
          <span className="illus-chip">Time Spent</span>
          <span className="illus-chip illus-chip-op">Greater Than</span>
          <span className="illus-chip illus-chip-val">60s</span>
        </div>
        <button className="illus-btn-ghost" type="button">+ Add condition</button>
      </div>
    </div>
  );
}

export function HeadInsertionIllustration() {
  return (
    <div className="illus">
      <div className="illus-toolbar illus-toolbar-dark"><i /><i /><i /><span>theme.liquid</span></div>
      <pre className="illus-code">
{`  1  <html>
  2  <head>
  3    <meta charset="utf-8">
  4    <title>Meridian Supply</title>
`}<span className="illus-code-insert">{`  5    <script src=".../loader.js"></script>
  6    <script>var Intercept = { apiKey: [...] };</script>
`}</span>{`  7  </head>
  8  <body>...
`}
      </pre>
      <p className="illus-hint-text">Paste immediately before the closing &lt;/head&gt; tag.</p>
    </div>
  );
}
