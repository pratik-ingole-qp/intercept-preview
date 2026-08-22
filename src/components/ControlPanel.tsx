import type { Dispatch, SetStateAction } from 'react';
import { BACKDROP_HINTS, CONTROLS, label } from '../data';
import type { Align, Anim, BackdropKind, Display, Horizontal, InterceptType, OptInLayout, Vertical, WidgetState } from '../types';

interface Props {
  state: WidgetState;
  setState: Dispatch<SetStateAction<WidgetState>>;
  onTypeChange: (type: InterceptType) => void;
  onPickShot: () => void;
  onClearShot: () => void;
  onReplay: () => void;
}

const TYPES: { key: InterceptType; label: string }[] = [
  { key: 'popup', label: 'Pop-up' },
  { key: 'feedback', label: 'Feedback tab' },
  { key: 'exit', label: 'Exit intent' },
  { key: 'embed', label: 'Inline embed' },
  { key: 'mobile', label: 'Mobile prompt' },
];

const BACKDROPS: { key: BackdropKind; label: string }[] = [
  { key: 'shop', label: 'Sample · online shop' },
  { key: 'saas', label: 'Sample · app dashboard' },
  { key: 'article', label: 'Sample · long article' },
  { key: 'landing', label: 'Sample · landing page' },
  { key: 'shot', label: 'Your screenshot' },
  { key: 'live', label: 'Your URL, live' },
];

const ANCHORS: { v: Vertical; h: Horizontal; label: string }[] = [
  { v: 'top', h: 'left', label: 'Top left' },
  { v: 'top', h: 'center', label: 'Top center' },
  { v: 'top', h: 'right', label: 'Top right' },
  { v: 'center', h: 'left', label: 'Center left' },
  { v: 'center', h: 'center', label: 'Center' },
  { v: 'center', h: 'right', label: 'Center right' },
  { v: 'bottom', h: 'left', label: 'Bottom left' },
  { v: 'bottom', h: 'center', label: 'Bottom center' },
  { v: 'bottom', h: 'right', label: 'Bottom right' },
];

const ANIMS: { key: Anim; label: string }[] = [
  { key: 'none', label: 'None' },
  { key: 'fade', label: 'Fade' },
  { key: 'slide', label: 'Slide' },
  { key: 'pop', label: 'Pop' },
];

const DISPLAYS: { key: Display; label: string }[] = [
  { key: 'label', label: 'Text label' },
  { key: 'logo', label: 'Logo image' },
  { key: 'both', label: 'Label + logo' },
  { key: 'plusIcon', label: 'Plus icon' },
];

export default function ControlPanel({ state, setState, onTypeChange, onPickShot, onClearShot, onReplay }: Props) {
  const visible = new Set(CONTROLS[state.type]);
  const plusOnly = state.type === 'feedback' && state.display === 'plusIcon';

  const positionHint = plusOnly
    ? 'Plus icon is anchored bottom-left or bottom-right only.'
    : state.v === 'bottom' && state.h === 'right'
    ? 'Bottom right — the default.'
    : `${label(state.v)} ${label(state.h)}.`;

  const displayHint =
    state.display === 'plusIcon'
      ? 'A floating 60 px button, 24 px clear of the edge — not a tab.'
      : 'The tab sits flush against the edge, no gap.';

  function setType(t: InterceptType) {
    setState((s) => ({
      ...s,
      type: t,
      ...(t === 'exit' ? { v: 'bottom' as Vertical, h: 'right' as Horizontal } : {}),
    }));
    onTypeChange(t);
  }

  function setBackdrop(kind: BackdropKind) {
    if (kind === 'shot' && !state.shot) {
      onPickShot();
      return;
    }
    setState((s) => ({ ...s, backdrop: kind }));
  }

  function setAnchor(v: Vertical, h: Horizontal) {
    setState((s) => ({ ...s, v, h }));
  }

  function setDisplay(d: Display) {
    setState((s) => ({
      ...s,
      display: d,
      ...(d === 'plusIcon' ? { v: 'bottom' as Vertical, h: s.h === 'center' ? ('right' as Horizontal) : s.h } : {}),
    }));
  }

  return (
    <aside className="panel" aria-label="Intercept settings">
      <h2>Intercept</h2>

      <div className="ctl">
        <span className="ctl-label">Type</span>
        <div className="stack" role="group">
          {TYPES.map((t) => (
            <button key={t.key} type="button" aria-pressed={state.type === t.key} onClick={() => setType(t.key)}>
              {t.label}
            </button>
          ))}
        </div>
      </div>

      <div className="divider" />

      <div className="ctl">
        <span className="ctl-label">Preview against</span>
        <div className="stack" role="group">
          {BACKDROPS.map((b) => (
            <button key={b.key} type="button" aria-pressed={state.backdrop === b.key} onClick={() => setBackdrop(b.key)}>
              {b.label}
            </button>
          ))}
        </div>
        <p className="hint">{BACKDROP_HINTS[state.backdrop]}</p>
        <div className="seg" style={{ marginTop: 8 }}>
          <button type="button" onClick={onPickShot}>Choose image…</button>
          <button type="button" onClick={onClearShot}>Clear</button>
        </div>
        <p className="hint">
          Drop an image on the stage, or press <b>Ctrl/⌘+V</b> to paste a screenshot straight from your clipboard.
        </p>
      </div>

      <div className="divider" />

      {visible.has('ctlPosition') && (
        <div className="ctl">
          <span className="ctl-label">Position</span>
          <div className="anchors" role="group">
            {ANCHORS.map((a) => {
              const allowed = !plusOnly || (a.v === 'bottom' && a.h !== 'center');
              return (
                <button
                  key={a.label}
                  data-v={a.v}
                  data-h={a.h}
                  aria-pressed={state.v === a.v && state.h === a.h}
                  aria-label={a.label}
                  disabled={!allowed}
                  style={{ opacity: allowed ? 1 : 0.28, cursor: allowed ? 'pointer' : 'not-allowed' }}
                  onClick={() => setAnchor(a.v, a.h)}
                />
              );
            })}
          </div>
          <p className="hint">{positionHint}</p>
        </div>
      )}

      {visible.has('ctlOverlay') && (
        <div className="ctl">
          <div className="row">
            <span className="ctl-label" style={{ margin: 0 }}>Overlay</span>
            <input
              type="checkbox"
              className="switch"
              checked={state.overlay}
              aria-label="Show overlay"
              onChange={(e) => setState((s) => ({ ...s, overlay: e.target.checked }))}
            />
          </div>
          <p className="hint" style={{ marginBottom: 8 }}>Dim the page behind the pop-up.</p>
          <label>
            Opacity <span className="mono">{state.opacity}%</span>
          </label>
          <input
            type="range"
            min={0}
            max={100}
            value={state.opacity}
            onChange={(e) => setState((s) => ({ ...s, opacity: Number(e.target.value) }))}
          />
        </div>
      )}

      {visible.has('ctlAnim') && (
        <div className="ctl">
          <span className="ctl-label">Entrance</span>
          <div className="seg" role="group">
            {ANIMS.map((a) => (
              <button key={a.key} type="button" aria-pressed={state.anim === a.key} onClick={() => setState((s) => ({ ...s, anim: a.key }))}>
                {a.label}
              </button>
            ))}
          </div>
        </div>
      )}

      {visible.has('ctlOptIn') && (
        <div className="ctl">
          <span className="ctl-label">Opt-in box</span>
          <div className="seg" role="group" style={{ marginBottom: 6 }}>
            <button type="button" aria-pressed={state.buttons === 1} onClick={() => setState((s) => ({ ...s, buttons: 1 }))}>
              Single
            </button>
            <button type="button" aria-pressed={state.buttons === 2} onClick={() => setState((s) => ({ ...s, buttons: 2 }))}>
              Two buttons
            </button>
          </div>
          <div className="seg" role="group" style={{ opacity: state.buttons === 2 ? 1 : 0.4 }}>
            {(['row', 'column'] as OptInLayout[]).map((l) => (
              <button key={l} type="button" aria-pressed={state.layout === l} onClick={() => setState((s) => ({ ...s, layout: l }))}>
                {l === 'row' ? 'Horizontal' : 'Vertical'}
              </button>
            ))}
          </div>
          <div className="row" style={{ marginTop: 12 }}>
            <span className="ctl-label" style={{ margin: 0 }}>Custom copy</span>
            <input
              type="checkbox"
              className="switch"
              checked={state.customCopy}
              aria-label="Use custom opt-in copy"
              onChange={(e) => setState((s) => ({ ...s, customCopy: e.target.checked }))}
            />
          </div>
          <p className="hint">Turn this off to see the untouched default — the long paragraph every new intercept ships with.</p>
        </div>
      )}

      {visible.has('ctlDisplay') && (
        <div className="ctl">
          <span className="ctl-label">Display as</span>
          <div className="stack" role="group">
            {DISPLAYS.map((d) => (
              <button key={d.key} type="button" aria-pressed={state.display === d.key} onClick={() => setDisplay(d.key)}>
                {d.label}
              </button>
            ))}
          </div>
          <p className="hint">{displayHint}</p>
        </div>
      )}

      {visible.has('ctlAlign') && (
        <div className="ctl">
          <span className="ctl-label">Alignment in container</span>
          <div className="seg" role="group">
            {(['left', 'center', 'right'] as Align[]).map((a) => (
              <button key={a} type="button" aria-pressed={state.align === a} onClick={() => setState((s) => ({ ...s, align: a }))}>
                {label(a)}
              </button>
            ))}
          </div>
          <p className="hint">Horizontal only — it does not move the survey up or down the page.</p>
        </div>
      )}

      <div className="divider" />
      <button className="replay" type="button" onClick={onReplay}>Replay entrance</button>
    </aside>
  );
}
