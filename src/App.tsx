import { useEffect, useRef, useState } from 'react';
import ControlPanel from './components/ControlPanel';
import Stage from './components/Stage';
import SpecReadout from './components/SpecReadout';
import RulesPage from './components/RulesPage';
import InterceptSettingsPage from './components/InterceptSettingsPage';
import DataMappingPage from './components/DataMappingPage';
import VisitorIdentityPage from './components/VisitorIdentityPage';
import SetupPage from './components/SetupPage';
import ExamplesPage from './components/ExamplesPage';
import { BACKDROP_HINTS, PREVIEW_FOOTNOTES, SITE_KICKER, TABS } from './data';
import { DEFAULT_STATE } from './types';
import type { BackdropKind, InterceptType, ViewKey, WidgetState } from './types';

function loadInitialState(): WidgetState {
  let state = { ...DEFAULT_STATE };
  try {
    const savedUrl = localStorage.getItem('qp-preview-url');
    if (savedUrl) state.liveUrl = savedUrl;
    const savedBackdrop = localStorage.getItem('qp-preview-backdrop') as BackdropKind | null;
    if (savedBackdrop && savedBackdrop !== 'shot' && BACKDROP_HINTS[savedBackdrop]) {
      state = { ...state, backdrop: savedBackdrop };
    }
  } catch {
    // localStorage unavailable — fall back to defaults
  }
  return state;
}

function App() {
  const [view, setView] = useState<ViewKey>('preview');
  const [ruleToOpen, setRuleToOpen] = useState<string | undefined>(undefined);
  const [identitySectionToOpen, setIdentitySectionToOpen] = useState<string | undefined>(undefined);
  const [state, setState] = useState<WidgetState>(loadInitialState);
  const [tabOpen, setTabOpen] = useState(false);
  const [exitShown, setExitShown] = useState(false);
  const [replayKey, setReplayKey] = useState(0);
  const pickInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    try {
      localStorage.setItem('qp-preview-backdrop', state.backdrop);
    } catch {
      // ignore
    }
  }, [state.backdrop]);

  useEffect(() => {
    if (!state.liveUrl) return;
    try {
      localStorage.setItem('qp-preview-url', state.liveUrl);
    } catch {
      // ignore
    }
  }, [state.liveUrl]);

  function handleTypeChange() {
    setTabOpen(false);
    setExitShown(false);
  }

  function handleClearShot() {
    setState((s) => ({ ...s, shot: null, liveUrl: '', backdrop: 'shop' }));
  }

  function handleReplay() {
    setTabOpen(false);
    setExitShown(state.type === 'exit');
    setReplayKey((k) => k + 1);
  }

  function goToRule(ruleName: string) {
    setRuleToOpen(ruleName);
    setView('rules');
  }

  function goToIdentity(sectionKey: string) {
    setIdentitySectionToOpen(sectionKey);
    setView('identity');
  }

  function goToPreviewType(type: InterceptType) {
    setState((s) => ({ ...s, type }));
    handleTypeChange();
    setView('preview');
  }

  const current = TABS.find((t) => t.key === view) ?? TABS[0];

  return (
    <>
      <header className="masthead">
        <p className="kicker">{SITE_KICKER}</p>
        <h1>{current.title}</h1>
        <p>{current.subtitle}</p>

        <div className="view-tabs" role="tablist">
          {TABS.map((t) => (
            <button key={t.key} type="button" role="tab" aria-selected={view === t.key} onClick={() => setView(t.key)}>
              {t.label}
            </button>
          ))}
        </div>
      </header>

      {view === 'preview' && (
        <>
          <div className="workbench">
            <ControlPanel
              state={state}
              setState={setState}
              onTypeChange={handleTypeChange}
              onPickShot={() => pickInputRef.current?.click()}
              onClearShot={handleClearShot}
              onReplay={handleReplay}
            />

            <Stage
              state={state}
              setState={setState}
              tabOpen={tabOpen}
              setTabOpen={setTabOpen}
              exitShown={exitShown}
              setExitShown={setExitShown}
              replayKey={replayKey}
              pickInputRef={pickInputRef}
            />
          </div>

          <SpecReadout state={state} />

          <p className="pagefoot">
            <span dangerouslySetInnerHTML={{ __html: PREVIEW_FOOTNOTES.faithful }} />
            <br />
            <span dangerouslySetInnerHTML={{ __html: PREVIEW_FOOTNOTES.standIn }} />
            <br />
            <span dangerouslySetInnerHTML={{ __html: PREVIEW_FOOTNOTES.notShown }} />
          </p>
        </>
      )}

      {view === 'rules' && <RulesPage initialRule={ruleToOpen} onNavigateToIdentity={goToIdentity} />}
      {view === 'settings' && <InterceptSettingsPage />}
      {view === 'mapping' && <DataMappingPage onNavigateToRule={goToRule} />}
      {view === 'identity' && <VisitorIdentityPage initialSection={identitySectionToOpen} />}
      {view === 'setup' && <SetupPage />}
      {view === 'examples' && <ExamplesPage onNavigateToPreview={goToPreviewType} onNavigateToRule={goToRule} />}
    </>
  );
}

export default App;
