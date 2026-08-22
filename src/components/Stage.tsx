import { useEffect, useRef, useState } from 'react';
import type { Dispatch, SetStateAction } from 'react';
import { ArticleBackdrop, LandingBackdrop, SaasBackdrop, ShopBackdrop } from './Backdrops';
import { EmbedWidget, ExitArmedNote, FeedbackWidget, MobileWidget, PopupWidget } from './Widgets';
import { SAMPLE_KINDS, URLS } from '../data';
import type { WidgetState } from '../types';

interface Props {
  state: WidgetState;
  setState: Dispatch<SetStateAction<WidgetState>>;
  tabOpen: boolean;
  setTabOpen: Dispatch<SetStateAction<boolean>>;
  exitShown: boolean;
  setExitShown: Dispatch<SetStateAction<boolean>>;
  replayKey: number;
  pickInputRef: React.RefObject<HTMLInputElement | null>;
}

function normalizeUrl(raw: string): string {
  const value = (raw || '').trim();
  if (!value) return '';
  const withScheme = /^https?:\/\//i.test(value) ? value : `https://${value}`;
  try {
    const parsed = new URL(withScheme);
    if (parsed.protocol !== 'http:' && parsed.protocol !== 'https:') return '';
    return parsed.href;
  } catch {
    return '';
  }
}

export default function Stage({ state, setState, tabOpen, setTabOpen, exitShown, setExitShown, replayKey, pickInputRef }: Props) {
  const stageRef = useRef<HTMLDivElement>(null);
  const [dragover, setDragover] = useState(false);
  const [noteDismissed, setNoteDismissed] = useState(false);
  const [urlText, setUrlText] = useState(URLS[state.type]);
  const [loadError, setLoadError] = useState<string | null>(null);

  useEffect(() => {
    if (SAMPLE_KINDS[state.backdrop]) setUrlText(URLS[state.type]);
    else if (state.backdrop === 'shot') setUrlText(state.shot ? 'your-screenshot.png' : '');
    else setUrlText(state.liveUrl);
  }, [state.type, state.backdrop, state.shot, state.liveUrl]);

  useEffect(() => {
    if (state.type !== 'exit') return;
    function onMouseOut(event: MouseEvent) {
      if (exitShown || !stageRef.current) return;
      const bounds = stageRef.current.getBoundingClientRect();
      const related = event.relatedTarget as Node | null;
      if (event.clientY <= bounds.top + 2 && !(related && stageRef.current.contains(related))) {
        setExitShown(true);
      }
    }
    function onVisibility() {
      if (document.hidden) setExitShown(true);
    }
    const node = stageRef.current;
    node?.addEventListener('mouseout', onMouseOut);
    document.addEventListener('visibilitychange', onVisibility);
    return () => {
      node?.removeEventListener('mouseout', onMouseOut);
      document.removeEventListener('visibilitychange', onVisibility);
    };
  }, [state.type, exitShown, setExitShown]);

  useEffect(() => {
    function onPaste(event: ClipboardEvent) {
      const items = event.clipboardData?.items;
      if (!items) return;
      for (let i = 0; i < items.length; i++) {
        if (items[i].type && items[i].type.indexOf('image/') === 0) {
          const file = items[i].getAsFile();
          if (file) acceptImage(file);
          event.preventDefault();
          return;
        }
      }
    }
    document.addEventListener('paste', onPaste);
    return () => document.removeEventListener('paste', onPaste);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function acceptImage(file: File) {
    if (!file || !/^image\//.test(file.type)) return;
    const reader = new FileReader();
    reader.onload = () => {
      setState((s) => ({ ...s, shot: String(reader.result), backdrop: 'shot' }));
      setTabOpen(false);
      setExitShown(false);
    };
    reader.readAsDataURL(file);
  }

  function loadUrl() {
    const href = normalizeUrl(urlText);
    if (!href) {
      setLoadError('That does not look like a web address. Try something like example.com/pricing.');
      return;
    }
    setLoadError(null);
    setNoteDismissed(false);
    setState((s) => ({ ...s, liveUrl: href, backdrop: 'live' }));
    setTabOpen(false);
    setExitShown(false);
  }

  const embedSlot = state.type === 'embed' ? <EmbedWidget state={state} floating={false} /> : undefined;

  function renderBackdrop() {
    switch (state.backdrop) {
      case 'shop':
        return <ShopBackdrop embedSlot={embedSlot} />;
      case 'saas':
        return <SaasBackdrop embedSlot={embedSlot} />;
      case 'article':
        return <ArticleBackdrop embedSlot={embedSlot} />;
      case 'landing':
        return <LandingBackdrop embedSlot={embedSlot} />;
      case 'shot':
        return state.shot ? (
          <img className="backdrop-img" src={state.shot} alt="Screenshot of your page" />
        ) : (
          <div className="backdrop-empty">
            <p className="big">Drop a screenshot of your page here</p>
            <p>
              Drag an image onto this box, press Ctrl/⌘+V to paste one from your clipboard, or use{' '}
              <b>Choose image…</b> in the panel. Nothing is uploaded — the image never leaves your browser.
            </p>
          </div>
        );
      case 'live':
        return state.liveUrl ? (
          <iframe
            className="backdrop-frame"
            src={state.liveUrl}
            title="Your page"
            referrerPolicy="no-referrer"
            sandbox="allow-scripts allow-forms allow-popups allow-same-origin"
          />
        ) : (
          <div className="backdrop-empty">
            <p className="big">Paste your URL in the address bar above</p>
            <p>
              Then press <b>Load</b>. If your site refuses to be framed, switch to <b>Your screenshot</b> — that path
              always works.
            </p>
          </div>
        );
      default:
        return null;
    }
  }

  const floatingEmbed = state.type === 'embed' && !SAMPLE_KINDS[state.backdrop];

  return (
    <div className="stage-wrap">
      <div className="stage-bar">
        <div className="dots"><i /><i /><i /></div>
        <input
          className="urlbar-input"
          type="url"
          spellCheck={false}
          placeholder="Paste your site URL, or keep a sample below"
          value={urlText}
          aria-label="Site URL to preview against"
          onChange={(e) => setUrlText(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault();
              loadUrl();
            }
          }}
        />
        <button className="urlbar-go" type="button" onClick={loadUrl}>Load</button>
      </div>

      <div
        ref={stageRef}
        className={`stage${state.type === 'mobile' ? ' phone' : ''}${dragover ? ' dragover' : ''}`}
        onDragOver={(e) => {
          e.preventDefault();
          setDragover(true);
        }}
        onDragLeave={(e) => {
          if (e.target === stageRef.current) setDragover(false);
        }}
        onDrop={(e) => {
          e.preventDefault();
          setDragover(false);
          const file = e.dataTransfer?.files?.[0];
          if (file) acceptImage(file);
        }}
      >
        <div className="stage-scroll">{renderBackdrop()}</div>

        <div>
          {state.type === 'popup' && <PopupWidget key={replayKey} state={state} isExit={false} />}

          {state.type === 'exit' &&
            (exitShown ? (
              <PopupWidget key={replayKey} state={state} isExit onClose={() => setExitShown(false)} />
            ) : (
              <ExitArmedNote />
            ))}

          {state.type === 'feedback' && (
            <FeedbackWidget
              key={replayKey}
              state={state}
              tabOpen={tabOpen}
              onOpen={() => setTabOpen(true)}
              onClose={() => setTabOpen(false)}
            />
          )}

          {state.type === 'embed' && floatingEmbed && <EmbedWidget key={replayKey} state={state} floating />}

          {state.type === 'mobile' && <MobileWidget key={replayKey} state={state} />}
        </div>

        {state.backdrop === 'live' && state.liveUrl && !noteDismissed && (
          <div className="stage-note">
            <span>
              <b>Framing your live page.</b> If the area above stays blank, one of two things is true: your site sends
              an <code>X-Frame-Options</code> or <code>frame-ancestors</code> header forbidding embedding, or you are
              viewing this page inside a sandbox that blocks third-party frames. Browsers enforce both and no preview
              tool can work around either — switch to <b>Your screenshot</b>, which always works.
            </span>
            <button type="button" onClick={() => setNoteDismissed(true)}>Dismiss</button>
          </div>
        )}

        {loadError && (
          <div className="stage-note">
            <span>{loadError}</span>
            <button type="button" onClick={() => setLoadError(null)}>Dismiss</button>
          </div>
        )}
      </div>

      <input
        ref={pickInputRef}
        type="file"
        accept="image/*"
        hidden
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) acceptImage(file);
          e.target.value = '';
        }}
      />
    </div>
  );
}
