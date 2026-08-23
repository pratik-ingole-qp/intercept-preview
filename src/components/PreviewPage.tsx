import { useEffect, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import ControlPanel from './ControlPanel';
import Stage from './Stage';
import SpecReadout from './SpecReadout';
import { BACKDROP_HINTS, PREVIEW_FOOTNOTES } from '../data';
import { DEFAULT_STATE } from '../types';
import type { BackdropKind, InterceptType, WidgetState } from '../types';

const VALID_TYPES: InterceptType[] = ['popup', 'feedback', 'exit', 'embed', 'mobile'];

function isInterceptType(value: string | undefined): value is InterceptType {
  return !!value && (VALID_TYPES as string[]).includes(value);
}

function loadInitialState(typeParam: string | undefined): WidgetState {
  let state = { ...DEFAULT_STATE };
  if (isInterceptType(typeParam)) state.type = typeParam;
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

export default function PreviewPage() {
  const { type: typeParam } = useParams<{ type?: string }>();
  const navigate = useNavigate();
  const [state, setState] = useState<WidgetState>(() => loadInitialState(typeParam));
  const [tabOpen, setTabOpen] = useState(false);
  const [exitShown, setExitShown] = useState(false);
  const [replayKey, setReplayKey] = useState(0);
  const pickInputRef = useRef<HTMLInputElement>(null);

  // Keep local state in sync when the type changes via browser back/forward rather than a click.
  useEffect(() => {
    if (isInterceptType(typeParam) && typeParam !== state.type) {
      setState((s) => ({ ...s, type: typeParam }));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [typeParam]);

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

  function handleTypeChange(type: InterceptType) {
    setTabOpen(false);
    setExitShown(false);
    navigate(`/preview/${type}`, { replace: true });
  }

  function handleClearShot() {
    setState((s) => ({ ...s, shot: null, liveUrl: '', backdrop: 'shop' }));
  }

  function handleReplay() {
    setTabOpen(false);
    setExitShown(state.type === 'exit');
    setReplayKey((k) => k + 1);
  }

  return (
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
  );
}
