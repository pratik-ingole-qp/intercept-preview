import { anchorStyle, DEFAULT_DESCRIPTION, WIDGET, isCenterSide } from '../data';
import type { Anim, WidgetState } from '../types';

function animClass(anim: Anim): string {
  return anim === 'none' ? '' : ` anim-${anim}`;
}

export function MockSurvey() {
  return (
    <div className="mock-survey">
      <p className="q">How likely are you to recommend Meridian Supply to a friend?</p>
      <div className="scale">
        <span>0</span><span>1</span><span>2</span><span>3</span><span>4</span><span>5</span>
      </div>
      <p className="q">What made you choose that score?</p>
      <textarea placeholder="Optional" readOnly />
      <button className="submit" type="button">Submit</button>
    </div>
  );
}

function Header({ name, onClose }: { name: string; onClose?: () => void }) {
  return (
    <div className="wdg-head">
      <button className="wdg-x" type="button" aria-label="Close" onClick={onClose}>✕</button>
      <span className="name">{name}</span>
    </div>
  );
}

function OptInBody({ state }: { state: WidgetState }) {
  const btnClass = state.buttons === 2 ? `wdg-btns two-${state.layout}` : 'wdg-btns';
  return (
    <div className="wdg-body">
      {state.customCopy ? (
        <>
          <div className="wdg-title">Do you want to give feedback?</div>
          <div className="wdg-sub">It only takes a minute and helps us improve your experience.</div>
        </>
      ) : (
        <div className="wdg-title isdefault">{DEFAULT_DESCRIPTION}</div>
      )}
      <div className={btnClass}>
        <button className="wdg-btn" type="button">Launch survey</button>
        {state.buttons === 2 && <button className="wdg-btn ghost" type="button">No thanks</button>}
      </div>
    </div>
  );
}

export function PopupWidget({ state, isExit, onClose }: { state: WidgetState; isExit: boolean; onClose?: () => void }) {
  const overlayOn = isExit ? true : state.overlay;
  const wrapStyle = anchorStyle(state, {});
  return (
    <>
      {overlayOn && (
        <div className="wdg-overlay" style={{ background: `rgba(0, 0, 0, ${isExit ? 0.31 : state.opacity / 100})` }} />
      )}
      <div className={`wdg${animClass(state.anim)}`} style={wrapStyle}>
        <div className="wdg-card" style={!overlayOn ? { boxShadow: 'rgba(20, 24, 38, 0.34) 0px 18px 44px -14px' } : undefined}>
          <Header name={isExit ? 'Before you go' : 'Quick feedback'} onClose={onClose} />
          <OptInBody state={state} />
        </div>
      </div>
    </>
  );
}

export function FeedbackWidget({
  state,
  tabOpen,
  onOpen,
  onClose,
}: {
  state: WidgetState;
  tabOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
}) {
  const isPlus = state.display === 'plusIcon';
  const horizontal = isCenterSide(state);

  if (tabOpen) {
    const openStyle = anchorStyle(state, { flush: !isPlus, margin: isPlus ? WIDGET.plusMargin : 0 });
    return (
      <>
        <div className="wdg-overlay" style={{ background: 'rgba(0, 0, 0, 0.31)' }} />
        <div className={`wdg${animClass(state.anim)}`} style={openStyle}>
          <div className="wdg-card">
            <Header name="Share your feedback" onClose={onClose} />
            <MockSurvey />
          </div>
        </div>
      </>
    );
  }

  const wrapStyle = anchorStyle(state, { flush: !isPlus, margin: isPlus ? WIDGET.plusMargin : 0 });

  if (isPlus) {
    return (
      <div className={`wdg${animClass(state.anim)}`} style={wrapStyle}>
        <button className="wdg-plus" type="button" aria-label="Give feedback" onClick={onOpen}>+</button>
      </div>
    );
  }

  return (
    <div className={`wdg${animClass(state.anim)}`} style={wrapStyle}>
      <button
        className={`wdg-tab ${horizontal ? 'horizontal' : 'vertical'}`}
        type="button"
        aria-label="Give feedback"
        onClick={onOpen}
      >
        <div className="inner">
          {(state.display === 'logo' || state.display === 'both') && <i className="logo" />}
          {state.display !== 'logo' && <span className="lbl">Feedback</span>}
        </div>
      </button>
    </div>
  );
}

export function EmbedWidget({ state, floating }: { state: WidgetState; floating: boolean }) {
  const box = (
    <div className={`embed-box${animClass(state.anim)}`}>
      <MockSurvey />
    </div>
  );

  if (!floating) {
    return <div className={`embed-slot ${state.align}`}>{box}</div>;
  }

  return <div className={`embed-float ${state.align}`}>{box}</div>;
}

export function MobileWidget({ state, onClose }: { state: WidgetState; onClose?: () => void }) {
  return (
    <>
      <div className="wdg-overlay" style={{ background: 'rgba(0, 0, 0, 0.31)' }} />
      <div
        className={`wdg${animClass(state.anim)}`}
        style={{
          top: '50%',
          left: '50%',
          width: '100%',
          height: '100%',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          ['--pos-t' as string]: 'translate(-50%, -50%)',
          ['--slide' as string]: 'translateY(24px)',
          transform: 'translate(-50%, -50%)',
        }}
      >
        <div
          className="wdg-card"
          style={{
            width: `${WIDGET.mobilePct}%`,
            height: `${WIDGET.mobilePct}%`,
            maxWidth: '100%',
            maxHeight: '100%',
            borderRadius: WIDGET.mobileRadius,
          }}
        >
          <Header name="Quick feedback" onClose={onClose} />
          <OptInBody state={state} />
        </div>
      </div>
    </>
  );
}

export function ExitArmedNote() {
  return (
    <div className="wdg" style={{ left: '50%', bottom: 18, transform: 'translateX(-50%)', maxWidth: '84%' }}>
      <div
        style={{
          fontFamily: 'var(--mono)',
          fontSize: 11.5,
          lineHeight: 1.6,
          background: 'var(--chrome)',
          color: 'var(--chrome-ink)',
          padding: '10px 14px',
          borderRadius: 6,
          textAlign: 'center',
        }}
      >
        Armed — move your cursor up out of this box, or switch tabs.
        <br />
        <span style={{ color: 'var(--chrome-muted)' }}>Same two triggers the real widget listens for.</span>
      </div>
    </div>
  );
}
