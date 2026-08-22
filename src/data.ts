import type { Anim, BackdropKind, Display, InterceptType, SampleBackdrop, Vertical, Horizontal, ViewKey, WidgetState } from './types';

export const WIDGET = {
  bg: '#1B87E6',
  text: '#FFFFFF',
  cardW: 435,
  cardH: 450,
  headerH: 35,
  radius: 12,
  mobileRadius: 0,
  edgeGap: 12,
  tabW: 35,
  tabH: 80,
  plusSize: 60,
  plusMargin: 24,
  btnW: 200,
  fontSize: 20,
  mobilePct: 80,
};

export const DEFAULT_DESCRIPTION =
  'We invite you to participate in a brief survey that will take only a few minutes of your time. Your responses will help us understand how we can improve our products and services to better meet your needs. To participate in the survey, please Launch the  survey. Thank you in advance for your time and valuable feedback.';

export const SAMPLE_KINDS: Record<string, boolean> = { shop: true, saas: true, article: true, landing: true };

export const BACKDROP_HINTS: Record<BackdropKind, string> = {
  shop: 'A stand-in online shop. Swap in your own site below.',
  saas: 'An app dashboard — useful for in-product feedback.',
  article: 'A long article, where scroll depth means something.',
  landing: 'A marketing page with a single call to action.',
  shot: 'Your own screenshot. Always works, never blocked.',
  live: 'Your real page in a frame. Many sites refuse to be framed — see the note.',
};

export const URLS: Record<InterceptType, string> = {
  popup: 'https://meridiansupply.example/collections/brewing',
  feedback: 'https://meridiansupply.example/collections/brewing',
  exit: 'https://meridiansupply.example/checkout/payment',
  embed: 'https://meridiansupply.example/journal/grind-size',
  mobile: 'https://meridiansupply.example/collections/brewing',
};

export const CONTROLS: Record<InterceptType, string[]> = {
  popup: ['ctlPosition', 'ctlOverlay', 'ctlAnim', 'ctlOptIn'],
  feedback: ['ctlPosition', 'ctlAnim', 'ctlDisplay'],
  exit: ['ctlAnim', 'ctlOptIn'],
  embed: ['ctlAnim', 'ctlAlign'],
  mobile: ['ctlAnim', 'ctlOptIn'],
};

export function label(x: string): string {
  return x.charAt(0).toUpperCase() + x.slice(1);
}

export function timing(a: Anim): string {
  if (a === 'fade') return '280 ms ease-out';
  if (a === 'slide') return '320 ms, 24 px travel';
  return '260 ms, overshoot';
}

export function displayLabel(display: Display): string {
  return { label: 'Text label', logo: 'Logo image', both: 'Label + logo', plusIcon: 'Plus icon' }[display];
}

export function slideOffset(v: Vertical, h: Horizontal): string {
  if (v === 'top') return 'translateY(-24px)';
  if (v === 'center' && h === 'left') return 'translateX(-24px)';
  if (v === 'center' && h === 'right') return 'translateX(24px)';
  return 'translateY(24px)';
}

export function isCenterSide(state: WidgetState): boolean {
  return state.v === 'center' && state.h !== 'center';
}

export function anchorStyle(state: WidgetState, opts: { flush?: boolean; margin?: number } = {}): React.CSSProperties {
  const margin = opts.margin != null ? opts.margin : opts.flush ? 0 : WIDGET.edgeGap;
  const style: Record<string, string | number> = {};
  const tx: string[] = [];

  if (state.v === 'top') style.top = 0;
  else if (state.v === 'bottom') style.bottom = 0;
  else {
    style.top = '50%';
    tx.push('translateY(-50%)');
  }

  if (state.h === 'left') style.left = margin;
  else if (state.h === 'right') style.right = margin;
  else {
    style.left = '50%';
    tx.push('translateX(-50%)');
  }

  if (state.v === 'center' && state.h === 'center') {
    tx.length = 0;
    tx.push('translate(-50%, -50%)');
  }

  const transform = tx.join(' ');
  style['--pos-t'] = transform || 'translate(0,0)';
  style['--slide'] = slideOffset(state.v, state.h);
  if (transform) style.transform = transform;
  return style as React.CSSProperties;
}

type SpecRow = [string, string, string?];

export const SPECS: Record<InterceptType, (state: WidgetState) => SpecRow[]> = {
  popup: (state) => [
    ['Card size', `${WIDGET.cardW} × ${WIDGET.cardH} px`, 'default, range 300–800'],
    ['Position', `${label(state.v)} ${label(state.h)}`, state.h === 'center' ? 'centred, no edge gap' : `${WIDGET.edgeGap} px horizontal gap`],
    ['Corner radius', `${WIDGET.radius} px`, 'desktop default'],
    ['Overlay', state.overlay ? `${state.opacity}%` : 'off', state.overlay ? `black at ${(state.opacity / 100).toFixed(2)} alpha` : 'card shadow only'],
    ['Header', `${WIDGET.headerH} px`, 'title left, close right'],
    ['Brand colour', WIDGET.bg, 'background + buttons'],
    ['Opt-in button', `${WIDGET.btnW} × 48 px`, 'height = width × 0.24'],
    ['Entrance', label(state.anim), state.anim === 'none' ? 'no animation' : timing(state.anim)],
  ],
  feedback: (state) => {
    if (state.display === 'plusIcon') {
      return [
        ['Trigger', `${WIDGET.plusSize} × ${WIDGET.plusSize} px`, 'radius 9 px'],
        ['Edge margin', `${WIDGET.plusMargin} px`, 'floating, not flush'],
        ['Position', `Bottom ${label(state.h)}`, 'bottom corners only'],
        ['Glyph colour', '#FFFFFF', 'fixed, not configurable'],
        ['Card on open', `${WIDGET.cardW} × ${WIDGET.cardH} px`, 'no dimming backdrop'],
        ['Brand colour', WIDGET.bg, 'button background'],
        ['Shadow', 'two-layer drop', 'launcher style'],
        ['Entrance', label(state.anim), state.anim === 'none' ? 'no animation' : timing(state.anim)],
      ];
    }
    const horizontal = isCenterSide(state);
    return [
      ['Tab size', `${horizontal ? `${WIDGET.tabH} × ${WIDGET.tabW}` : `${WIDGET.tabW} × ${WIDGET.tabH}`} px`, 'width × height as rendered'],
      ['Edge gap', '0 px', 'the tab is its own handle'],
      ['Label', horizontal ? 'rotated −90°' : 'upright', horizontal ? 'vertical edge' : 'horizontal edge'],
      ['Display as', displayLabel(state.display), 'four modes'],
      ['Position', `${label(state.v)} ${label(state.h)}`, 'nine anchors'],
      ['Card on open', `${WIDGET.cardW} × ${WIDGET.cardH} px`, 'page dims behind it'],
      ['Brand colour', WIDGET.bg, 'tab background'],
      ['Entrance', label(state.anim), state.anim === 'none' ? 'no animation' : timing(state.anim)],
    ];
  },
  exit: (state) => [
    ['Card size', `${WIDGET.cardW} × ${WIDGET.cardH} px`, 'same as pop-up'],
    ['Overlay', '31%', 'always dimmed'],
    ['Trigger A', 'pointer exits top', 'clientY ≤ 0, left the document'],
    ['Trigger B', 'tab hidden', 'switch tab or minimise'],
    ['Mobile', 'not armed', 'no cursor to track'],
    ['Position', 'Bottom right', 'pop-up anchors apply'],
    ['Brand colour', WIDGET.bg, 'header + buttons'],
    ['Entrance', label(state.anim), state.anim === 'none' ? 'no animation' : timing(state.anim)],
  ],
  embed: (state) => [
    ['Target', 'data-qp-intercept', 'or any CSS selector'],
    ['Min height', '300 px', 'on your container'],
    ['Iframe', '100% × 100%', 'fills the container'],
    ['Alignment', label(state.align), 'horizontal only'],
    ['Placement', 'wherever the div is', 'you control the position'],
    ['Overlay', 'none', 'it is page content'],
    ['Header', 'optional', 'off suits inline best'],
    ['Entrance', label(state.anim), state.anim === 'none' ? 'no animation' : timing(state.anim)],
  ],
  mobile: (state) => [
    ['Card size', `${WIDGET.mobilePct}% × ${WIDGET.mobilePct}%`, 'of the viewport'],
    ['Position', 'Centre', 'mobile default'],
    ['Corner radius', `${WIDGET.mobileRadius} px`, 'mobile default'],
    ['Header', '44 px', 'taller than web'],
    ['Overlay', '31%', 'dimmed'],
    ['Brand colour', WIDGET.bg, 'header + buttons'],
    ['Sizing', 'separate from desktop', 'its own width and height'],
    ['Entrance', label(state.anim), state.anim === 'none' ? 'no animation' : timing(state.anim)],
  ],
};

export interface ExplainEntry {
  h: string;
  purpose: string;
  when: string[];
  behaves: string;
  config: string;
  limits: string[];
}

export const EXPLAIN: Record<InterceptType, ExplainEntry> = {
  popup: {
    h: 'Pop-up',
    purpose:
      'An interruption you have earned. The pop-up is the only web type that puts itself in front of the visitor unprompted, which makes it the most effective and the easiest to misuse.',
    when: [
      'A moment has just passed that you want measured while it is fresh — an order confirmed, a booking changed, a support article read.',
      'You need a response rate high enough to segment on, and a passive channel will not produce one.',
      'The question is short. Anything past three questions belongs behind a link, not in a modal.',
    ],
    behaves:
      'Anchored to one of nine points and shown once the visitor matches your rules. With the overlay on, the page behind it dims to 31% black and the card carries no shadow of its own. Turn the overlay off and it gains a soft drop shadow instead, so it still reads as floating above the page rather than pasted onto it. Only one intercept is ever shown per page view.',
    config:
      'Nine positions; width and height in pixels (300–800) or percent, set separately for desktop and mobile; corner radius; shadow; overlay and its opacity; header visibility and colours; one of four entrance animations; font family and weight; and the opt-in box.',
    limits: [
      'The default opt-in copy is a 60-word paragraph. Switch <b>Custom copy</b> off to see it — it is the single most visible thing to change before going live.',
      'The card is 435 × 450 by default. A survey longer than a couple of questions will scroll inside it, which reads worse than a shorter survey does.',
    ],
  },
  feedback: {
    h: 'Feedback tab',
    purpose:
      'A standing invitation. It interrupts nobody, and it is the only type that lets a visitor tell you something you did not think to ask about.',
    when: [
      'You want a permanent channel for unsolicited feedback — bug reports, confusion, praise.',
      'The audience is small or high-value enough that you cannot afford to annoy them with a modal.',
      'You are collecting continuously rather than running a campaign with a start and an end.',
    ],
    behaves:
      'The tab loads with the page and stays put; the survey opens only when the visitor clicks it. That makes this the one type that needs no timing rule at all. On a left or right edge the label rotates −90° and the tab renders 35 × 80; on a top or bottom edge it renders 80 × 35 with the label upright. Tabs sit flush against the edge because the tab shape is its own handle.',
    config:
      'Four display modes — text label, logo image, label + logo, or plus icon. Tab position, length and width, transparent background, tab colour, label colour and label font. The survey card that opens has its own width and height.',
    limits: [
      'Plus icon is the exception to almost everything else here: a 60 px floating button with a 24 px clear margin, anchored bottom-left or bottom-right only, and its glyph is always white regardless of the tab colour.',
      'Because it is passive, expect a far lower response volume than a pop-up. Judge it on the quality of what comes in, not the count.',
    ],
  },
  exit: {
    h: 'Exit intent',
    purpose: 'The last question you get to ask. Its value is that it costs nothing — the visitor was leaving anyway.',
    when: [
      'Recovering an abandoned cart or an incomplete form, where a discount or an offer of help still has time to work.',
      'Learning why people leave a page you believe should convert.',
      'You want reach without interrupting anyone who is still engaged.',
    ],
    behaves:
      'It fires on <b>either</b> of two signals: the pointer leaving through the top of the window, or the tab becoming hidden — a tab switch or a minimise counts. Try moving your cursor up out of the stage. The card geometry is identical to the pop-up\'s, and the overlay is always on.',
    config: 'The same design surface as the pop-up — position, size, radius, shadow, overlay opacity, header, animation, typography and opt-in box.',
    limits: [
      'It is <b>never armed on mobile</b>. There is no cursor to track, so the listeners are not attached at all. If you need a last-chance prompt on phones, use a pop-up with a scroll-depth or session-duration rule.',
      'The tab-hidden trigger means it can fire when someone switches tabs intending to come back. Keep the copy useful rather than punitive.',
    ],
  },
  embed: {
    h: 'Inline embed',
    purpose:
      'Not an overlay at all. The survey becomes part of the page, which makes it the right choice when the question is content rather than an interruption.',
    when: [
      'The question belongs to a specific place — under an article, beside a product, at the end of a help page.',
      'You want it always visible without a modal, and without the visitor having to click a tab.',
      'You are collecting on a page people arrive at deliberately, so timing rules add nothing.',
    ],
    behaves:
      'You place <code>&lt;div data-qp-intercept="your-selector" style="min-height:300px"&gt;&lt;/div&gt;</code> where you want it. The widget finds that element at runtime and renders the survey inside it. Vertical placement is entirely yours — it is wherever the div sits in your markup.',
    config: 'The embed target selector, iframe width and height, and horizontal alignment within the container.',
    limits: [
      'Alignment moves the survey left, centre or right <b>within</b> its container. It does not move it up or down the page — that is what the div\'s position is for.',
      'The <code>min-height</code> matters. Without it, a container can collapse to zero before the survey mounts, and nothing appears.',
      'Because it is page content, it competes with your own layout. Give it room.',
    ],
  },
  mobile: {
    h: 'Mobile prompt',
    purpose:
      'The in-app equivalent of a pop-up, for native iOS and Android apps rather than a mobile browser. This is a <b>Mobile SDK</b> feature — it ships through the native app SDK, not the JavaScript loader.js snippet used everywhere else on this page, and needs the SDK integrated into the app build before any of this applies.',
    when: [
      'Measuring an in-app moment — a completed booking, a finished onboarding, a feature used for the first time.',
      'You need app-store-independent feedback that does not depend on a review prompt.',
      'The audience is app-only and would never see a web intercept.',
    ],
    behaves:
      'Its defaults are deliberately not the desktop ones: centred, 80% × 80% of the viewport, square corners, and a taller 44 px header. Desktop and mobile sizes are configured separately, so a card tuned for a 1440 px monitor is not squeezed onto a phone.',
    config:
      'Three mobile types — Prompt, Embed and Survey URL. Prompt position, width and height in percent, colours and header. Survey URL returns a link so you can build the experience entirely in your own UI.',
    limits: [
      'Mobile uses its own rule set — Time Spent, View Count, Day and Date — not the web rules.',
      'It requires the mobile SDK to be integrated. The web tracking snippet does not cover apps.',
      'Exit intent has no mobile equivalent, by design.',
    ],
  },
};

export const SAMPLE_BACKDROPS: SampleBackdrop[] = ['shop', 'saas', 'article', 'landing'];

export interface RuleConfigField {
  key?: string;
  operand: string;
  value: string;
}

export interface RuleEntry {
  name: string;
  understanding: string;
  scenario: string;
  config: RuleConfigField[];
  result: string;
  operands: string[];
  limitations?: string[];
}

export const RULES: RuleEntry[] = [
  {
    name: 'Country',
    understanding: 'Target or exclude visitors based on their physical location, evaluated server-side from IP geolocation.',
    scenario: 'Show a survey only to visitors in Canada.',
    config: [{ operand: 'Equals', value: 'Canada' }],
    result: 'Only visitors accessing the site from a Canadian IP address will see the intercept.',
    operands: ['Equals', 'Not Equals'],
  },
  {
    name: 'Browser Type',
    understanding: 'Target visitors based on the web browser they are using (Chrome, Safari, Firefox, etc.). Evaluated server-side.',
    scenario: 'Test a new feature that only works on Google Chrome.',
    config: [{ operand: 'Equals', value: 'Chrome' }],
    result: 'Visitors using Safari or Edge will not see the survey.',
    operands: ['Equals', 'Not Equals'],
  },
  {
    name: 'Device Type',
    understanding: 'Distinguish between visitors on Desktop, Mobile, or Tablet. Evaluated server-side.',
    scenario: 'Show a shorter, mobile-friendly survey to phone users.',
    config: [{ operand: 'Equals', value: 'Mobile' }],
    result: 'Desktop users are ignored; only smartphone users see the intercept.',
    operands: ['Equals', 'Not Equals'],
  },
  {
    name: 'OS (Operating System)',
    understanding: 'Target the underlying system of the device (Windows, macOS, iOS, Android). Evaluated server-side.',
    scenario: 'Ask for feedback on your new iPhone App.',
    config: [{ operand: 'Equals', value: 'iOS' }],
    result: 'Only users on Apple mobile devices will match.',
    operands: ['Equals', 'Not Equals'],
  },
  {
    name: 'User Type',
    understanding: 'Differentiates between someone visiting for the first time versus someone coming back. Evaluated server-side.',
    scenario: 'Offer a "Welcome" discount only to new people.',
    config: [{ operand: 'Equals', value: 'New Visitor' }],
    result: 'If the system recognizes the user\'s cookie from a previous visit, the rule fails.',
    operands: ['Equals', 'Not Equals'],
  },
  {
    name: 'IP Address',
    understanding: 'Target a specific network address, often used for internal testing. Evaluated server-side.',
    scenario: 'Test the survey live, but only for people in your office.',
    config: [{ operand: 'Equals', value: '192.168.1.50 (your specific IP)' }],
    result: 'The general public cannot see the survey; only your specific network matches.',
    operands: ['Equals', 'Not Equals', 'Includes', 'Excludes', 'Between'],
    limitations: ['Between lets you match an IP range rather than a single address — useful for an office or VPN block instead of one machine.'],
  },
  {
    name: 'Page URL',
    understanding: 'Checks the specific web address the visitor is currently looking at. Evaluated in the browser.',
    scenario: 'Show a survey only on the "Thank You" page after a purchase.',
    config: [{ operand: 'Contains', value: 'thank-you' }],
    result: 'Matches www.site.com/checkout/thank-you but ignores www.site.com/home.',
    operands: ['Equals', 'Not Equals', 'Includes', 'Excludes', 'Starts With', 'Ends With'],
  },
  {
    name: 'Time Spent (On Page)',
    understanding: 'Checks how long the user has been looking at the current page.',
    scenario: 'Offer help only if a user has been stuck on the checkout page for more than 60 seconds.',
    config: [{ operand: 'Greater Than', value: '60 (seconds)' }],
    result: 'The survey waits 60 seconds before appearing.',
    operands: ['Greater Than'],
  },
  {
    name: 'Session Duration (Total Time)',
    understanding: 'Checks the total time the user has been on your website across all pages combined.',
    scenario: 'Target highly engaged users who have been browsing your site for over 5 minutes.',
    config: [{ operand: 'Greater Than', value: '300 (seconds)' }],
    result: 'Triggers only after 5 minutes of total browsing.',
    operands: ['Greater Than'],
    limitations: ['Session Duration only supports Greater Than — there is no Less Than or Between option for this rule.'],
  },
  {
    name: 'Page Visited (History)',
    understanding: 'Checks how many pages the user has clicked through during this visit. Counted client-side and persisted in the browser, so — unlike Total Visits — it also increases on SPA route changes, not just full page loads.',
    scenario: 'Show a survey only after the user has browsed 3 different pages.',
    config: [{ operand: 'Greater Than', value: '3' }],
    result: 'The user browses Page A, then Page B, then Page C. On Page D, the survey appears.',
    operands: ['Greater Than'],
  },
  {
    name: 'Button Click',
    understanding: 'Triggers the intercept when a user clicks a specific button or link on your page. It matches only by the element\'s unique <code>id</code> attribute — never by its visible text or class.',
    scenario: 'Show a short survey immediately after a customer clicks "Download Report", whose ID is download-report-button.',
    config: [{ key: 'download-report-button', operand: 'Equals', value: '(the button\'s id)' }],
    result: 'The survey triggers immediately upon clicking that specific button.',
    operands: ['Equals', 'Not Equals'],
    limitations: [
      'Identify the element with your browser\'s developer tools (Right-click → Inspect) and use its unique <code>id</code> attribute as the key.',
      'Only <code>&lt;button&gt;</code> and <code>&lt;a&gt;</code> elements are matched (including a click on a child element that has one as its nearest ancestor). A <code>&lt;div&gt;</code> or <code>&lt;span&gt;</code> acting as a button will not fire this rule.',
    ],
  },
  {
    name: 'Data Layer',
    understanding:
      'Reads a value your page stores as a plain <code>window</code> global, via a dot-notation path, e.g. <code>dataLayer.animal.name</code>. This is a generic global-variable reader — it does not listen to a real Google Tag Manager <code>dataLayer</code> array of pushed events, only a literal object shape sitting on <code>window</code>.',
    scenario: 'A page defines <code>window.dataLayer.animal.name = "Lion"</code>; target visitors where that value is "Lion".',
    config: [{ key: 'dataLayer.animal.name', operand: 'Equals', value: 'Lion' }],
    result: 'The intercept looks at dataLayer → animal → name; if it finds "Lion", the rule matches.',
    operands: ['Equals', 'Not Equals', 'Includes', 'Excludes', 'Exists'],
    limitations: [
      'Dynamic keys are not supported — the key path must be exact, even if the data\'s position elsewhere (e.g. array index) changes.',
      'If you push events into a real GTM-style <code>dataLayer</code> array rather than setting a static object property, this rule will not see them.',
    ],
  },
  {
    name: 'Query Param (URL Parameter)',
    understanding: 'Reads marketing codes or tracking IDs appended to the URL after a "?", commonly used in emails, ads, or referral links.',
    scenario: 'A link reads site.com/home?campaign=summer_sale&source=newsletter; target visitors who came from the newsletter.',
    config: [{ key: 'source', operand: 'Equals', value: 'newsletter' }],
    result: 'When a visitor arrives, the intercept checks the address bar; if source equals newsletter, the rule matches.',
    operands: ['Equals', 'Not Equals', 'Includes', 'Excludes', 'Exists'],
    limitations: [
      'Checked only once the website is completely loaded.',
      'A parameter that is present but empty (<code>?source=</code>) is treated the same as a missing parameter — it will not match Equals or Exists.',
    ],
  },
  {
    name: 'HTML Selector',
    understanding: 'Checks for the presence, absence, or text content of a specific HTML element on the page, found via its CSS selector (ID or class). The search also recurses into shadow DOM.',
    scenario: 'Trigger a survey only when an "Error Message" box (e.g. <code>.error-message-box</code>) appears on screen.',
    config: [{ key: '#submit-button or .error-message-box', operand: 'Exists', value: '—' }],
    result: 'The intercept watches the page; if that element appears, the rule matches.',
    operands: ['Equals', 'Not Equals', 'Includes', 'Excludes', 'Exists'],
    limitations: [
      'Prefer IDs (<code>#id</code>) over classes — they are unique and most reliable.',
      'With <b>Exists</b>, only the element\'s presence is checked. With any other operand, a blank expected value always fails — you must supply text to compare against, even if the element\'s own text is empty.',
      'If the site\'s markup changes, the selector can break — re-check it if a rule stops firing.',
    ],
  },
  {
    name: 'Total Visits (Website Entry Count)',
    understanding:
      'Checks how many times the visitor has entered (or re-entered) the site across all sessions, evaluated server-side. It increments once per full widget bootstrap — a true page reload or a fresh tab — not on every internal click.',
    scenario: 'Show a survey only after the visitor has entered the website 3 or more times.',
    config: [{ operand: 'Greater Than', value: '2' }],
    result: 'Visit Monday (1), Wednesday (2), Friday (3) — on the Friday visit, the survey appears.',
    operands: ['Equals', 'Not Equals', 'Greater Than', 'Less Than', 'Between'],
    limitations: [
      'Confirmed against the widget\'s own navigation tracking: an SPA route change resets local page state but never re-triggers the bootstrap call that increments this count — only a genuine reload does. Traditional HTML sites reload on every page, so this counts up faster there than on an SPA.',
    ],
  },
  {
    name: 'Scroll Depth (Vertical)',
    understanding: 'Checks how far down the user has scrolled a page, expressed as a percentage of the page content\'s height.',
    scenario: 'Show a survey only after the user has scrolled at least 50% down the article content.',
    config: [{ operand: 'Greater Than', value: '50 (percent)' }],
    result: 'The survey waits until the visitor has scrolled past the halfway point of the page.',
    operands: ['Less Than', 'Greater Than'],
    limitations: ['Only Less Than and Greater Than (or equal) are supported for this rule — there is no Equals or Between.'],
  },
];

export interface OperandEntry {
  name: string;
  meaning: string;
}

export const OPERANDS_INTRO =
  'Not every operand applies to every rule type. Text rules (Country, Page URL, Browser Type…) typically use Equals / Contains; numeric rules (Time Spent, Total Visits, Scroll Depth…) use Greater Than / Less Than / Between.';

export const OPERANDS: OperandEntry[] = [
  { name: 'Equals to', meaning: 'Exact Match — the data must be identical to your value, character for character.' },
  { name: 'Not Equals To', meaning: 'Exclusion — triggers for anything except the value you provide.' },
  { name: 'Includes', meaning: 'Partial Match — looks for a specific word or phrase anywhere inside the data.' },
  { name: 'Excludes', meaning: 'Exclude Phrase — triggers only if the specific word is missing.' },
  { name: 'Starts With', meaning: 'Prefix — checks only the beginning of the data.' },
  { name: 'Ends With', meaning: 'Suffix — checks only the very end of the data.' },
  { name: 'Greater than', meaning: 'More than — checks if a number is larger than the value.' },
  { name: 'Less Than', meaning: 'Fewer than — checks if a number is smaller than the value.' },
  { name: 'Between', meaning: 'Range — checks if a number falls between two specific values.' },
  { name: 'Exists', meaning: 'Data is Present — checks if the specific data point exists at all (is not empty).' },
];


/* ============================================================
   DATA MAPPING — attaching visitor/site context to responses
   ============================================================ */
export interface DataMappingType {
  name: string;
  description: string;
  example: string;
  relatedRule: string;
  sharedMechanicsPrefix: string;
  sharedMechanicsSuffix?: string;
}

export const DATA_MAPPING_INTRO =
  'Data mapping captures visitor and site context and attaches it to their survey response — pulling a value from the site via a custom variable and sending it along with the response.';

export const DATA_MAPPING_TYPES: DataMappingType[] = [
  {
    name: 'HTML element',
    description: 'Pulls text from anywhere on the page using a CSS selector — the same selector mechanic as the HTML Selector targeting rule.',
    example: 'Map the text inside <code>.product-name</code> so every response is tagged with which product page the visitor was on.',
    relatedRule: 'HTML Selector',
    sharedMechanicsPrefix: 'Uses the same CSS-selector approach as the',
    sharedMechanicsSuffix: 'if a selector works there, it works here.',
  },
  {
    name: 'URL parameter',
    description: 'Pulls a value straight out of the address bar\'s query string.',
    example: 'Map <code>?utm_campaign=</code> so responses arrive already labelled with the marketing campaign that brought the visitor in.',
    relatedRule: 'Query Param (URL Parameter)',
    sharedMechanicsPrefix: 'Reads the same query-string key/value pairs as the',
  },
  {
    name: 'Data layer',
    description: 'Pulls a value from a variable your site stores on <code>window</code>, addressed by dot-notation path — the same mechanic as the Data Layer targeting rule.',
    example: 'Map <code>dataLayer.customer.plan</code> so every response carries the visitor\'s subscription tier.',
    relatedRule: 'Data Layer',
    sharedMechanicsPrefix: 'Uses the same dot-notation window path as the',
    sharedMechanicsSuffix: 'a generic global-variable reader, not a true GTM dataLayer array listener.',
  },
];

/* ============================================================
   SETUP — installing the snippet, per platform, troubleshooting
   ============================================================ */
export const SNIPPET_INTRO =
  'The snippet must run on every page load so the engine can track behaviour and evaluate rules. Place it as high as possible inside <code>&lt;head&gt;</code>, immediately before the closing tag.';

export const NEXTJS_INTRO =
  'A plain <code>&lt;script&gt;</code> tag can fail on internal route changes. Use <code>next/script</code> in your root layout instead, so it loads once and survives soft navigations:';

export const TROUBLESHOOTING_INTRO = "If the intercept isn't appearing, check these in order:";

export const TROUBLESHOOTING_OUTRO =
  'Then open DevTools (<code>F12</code>) → <b>Console</b>. A successful install logs a message confirming the Intercept engine has initialized.';

export const SNIPPET_CODE = `<!-- Start of async Intercept tracking code -->
<script type="text/javascript" src="https://intercept-widget.questionpro.com/static/js/loader.js"></script>
<script type="text/javascript">
   var Intercept = { apiKey: [YOUR_API_KEY] };
</script>
<!-- End of async Intercept tracking code -->`;

export const NEXTJS_CODE = `import Script from 'next/script'

<Script
  src="https://intercept-widget.questionpro.eu/static/js/loader.js"
  strategy="afterInteractive"
/>

<Script id="intercept-init" strategy="afterInteractive">
  {\`
    window.Intercept = { apiKey: 'YOUR_API_KEY' };
  \`}
</Script>`;

export const PLACEMENT_TABLE = [
  { site: 'Traditional HTML site', where: 'Inside the <head> of your global template (header/footer).', why: 'Loads and initialises before page content, so it can track the first page URL and session start.' },
  { site: 'Single Page Application (SPA)', where: 'In the main index.html, inside <head>.', why: 'The script persists across all soft navigations (internal route changes).' },
];

export const PLATFORM_TABLE = [
  { platform: 'Shopify', how: 'Online Store → Themes → Actions → Edit Code → theme.liquid' },
  { platform: 'WordPress', how: 'Appearance → Theme File Editor → header.php' },
  { platform: 'Custom Site', how: 'The shared template file that contains the opening <head> tag.' },
];

export const TROUBLESHOOTING_CHECKLIST = [
  'Placement — is the snippet correctly placed in the <head> section of the global template?',
  'Unique ID — was the API key in the snippet copied correctly and not edited?',
  'Rules — do your Total Visits or Time Spent rules require the user to wait or visit multiple pages before triggering?',
  'Console errors — are there any errors in the browser console preventing the script from loading?',
];

export const SITE_BEHAVIOUR = [
  {
    title: 'Traditional HTML websites',
    body: 'Each page load is a full server request and DOM reload. The snippet must be in a shared template (header/footer) to run on every physical page load, since it is destroyed when the page unloads.',
  },
  {
    title: 'Single Page Applications (SPAs)',
    body: 'A single HTML file loads once; subsequent navigation is "soft" JavaScript routing without a full reload. The snippet, injected once in index.html, persists across the entire session — but the widget must re-evaluate or re-trigger on soft route changes, typically via custom events or integration with the SPA\'s router lifecycle.',
  },
];

/* ============================================================
   INTERCEPT SETTINGS — configuration on the Intercept object
   itself (status, scheduling, matching, association), as
   distinct from a single widget's visual design or a single
   targeting rule. Verified against the product source.
   ============================================================ */
export interface InterceptSettingEntry {
  name: string;
  understanding: string;
  defaultValue: string;
  notes?: string[];
}

export interface InterceptSettingGroup {
  title: string;
  settings: InterceptSettingEntry[];
}

export const INTERCEPT_SETTINGS_INTRO =
  "Settings on the Intercept object itself — status, scheduling, matching and association — as distinct from a single widget's visual design or a single targeting rule.";

export const INTERCEPT_SETTING_GROUPS: InterceptSettingGroup[] = [
  {
    title: 'Project (one level up)',
    settings: [
      {
        name: 'Project status',
        understanding: 'Whether the project as a whole is active or paused — a level above any individual intercept\'s own status.',
        defaultValue: 'Active or Paused',
      },
      {
        name: 'Website URL',
        understanding: 'The domain this project is tracking. This single URL also functions as the project\'s entire embed allowlist.',
        defaultValue: '—',
        notes: [
          'Each project tracks exactly one domain — the widget checks the browser\'s Origin header against this URL and refuses to load on a mismatch. There is no list of multiple allowed domains per project; a second domain needs its own project.',
        ],
      },
      {
        name: 'App key',
        understanding: 'An auto-generated credential, sent as an x-app-key header, that the widget uses to identify which project it belongs to.',
        defaultValue: 'Auto-generated UUID',
      },
      {
        name: 'Tracking state',
        understanding: 'A hard kill switch for the entire project — every intercept in it, regardless of individual status.',
        defaultValue: 'Enabled',
        notes: ['When disabled, the widget\'s auth check rejects every request outright and nothing loads — this overrides every intercept\'s own Active status underneath it.'],
      },
      {
        name: 'Cookies expiry (days)',
        understanding: 'How many days the visitor identity cookie is remembered for before that browser looks like a brand-new visitor again. This is a real, working setting — labeled "Cookies expiry (days)" in Project Settings.',
        defaultValue: 'Blank → defaults to 365 days',
        notes: [
          'Accepts 1–365. Leaving it blank does not mean "no expiry" or "session only" — it falls back to a 365-day cookie, same as entering 365 explicitly.',
          'This single value drives both the visitor-identity cookie and the session-start cookie used for Session Duration / idle rules — see Visitor Identity for how those actually work.',
        ],
      },
      {
        name: 'Workspace (CX Feedback account)',
        understanding: 'The QuestionPro CX workspace this project is linked to — where responses ultimately land. Not a local concept; it\'s a reference to an external Feedback account, one per project.',
        defaultValue: '—',
      },
      {
        name: 'Show intercepts in random order',
        understanding: 'The one project-wide behavioural flag that exists today — when on, it randomizes matching order per visitor instead of using each intercept\'s fixed Order value.',
        defaultValue: 'Off',
        notes: [
          'Alongside Cookies expiry, this is one of only two project-level settings that actually change behaviour — everything else on this project level is identity/auth/bookkeeping. It does not add priority weighting, just shuffles the evaluation order shown in the Order (priority) setting below.',
          'There is no project-wide default branding, theme, or install-snippet configuration beyond the App key itself — a new intercept in this project starts from the product\'s hardcoded widget defaults, not anything inherited from the project.',
        ],
      },
    ],
  },
  {
    title: 'Status & scheduling',
    settings: [
      {
        name: 'Status',
        understanding: 'Whether the intercept is live on your site at all.',
        defaultValue: 'Active or Inactive',
        notes: [
          'Only two states exist — Active and Inactive. There is no separate Draft, Scheduled, Expired, or Archived status stored on the intercept; if the product UI shows those, they are computed on the fly from Status plus the date range below, not stored as their own state.',
        ],
      },
      {
        name: 'Date range',
        understanding: 'An optional start and end date that bounds when the intercept can match, checked against the current date at evaluation time.',
        defaultValue: 'Unset — no expiry',
        notes: [
          'If no date range is configured, the intercept is valid indefinitely — there is no implicit expiry after some default period.',
        ],
      },
    ],
  },
  {
    title: 'Matching & display',
    settings: [
      {
        name: 'Order (priority)',
        understanding: 'Intercepts in a project are evaluated in a fixed order (set by dragging to reorder in the UI). The first one whose rules match is shown, and evaluation stops there.',
        defaultValue: 'Ascending, by creation order',
        notes: [
          'This is strictly single-winner — matching intercepts do not stack or show together. If you need two surveys on one page, they need non-overlapping trigger rules or different pages.',
        ],
      },
      {
        name: 'Max intercepts per project',
        understanding: 'A hard ceiling on how many intercepts a single project can hold.',
        defaultValue: '20',
      },
      {
        name: 'Sampling rate',
        understanding: 'A percentage (1–100) used to show the intercept to only a random slice of the visitors who would otherwise match — the mechanism behind traffic-split / A-B style testing.',
        defaultValue: '100%',
        notes: [
          'This is probabilistic, not a fixed split: the widget tracks a running matched/excluded ratio and converges toward your target percentage over time rather than assigning a hard 1-in-N rotation.',
        ],
      },
      {
        name: 'Trigger delay',
        understanding: 'A pause, in seconds, between a trigger rule condition being met and the intercept actually appearing.',
        defaultValue: '0 seconds',
      },
    ],
  },
  {
    title: 'Close behaviour',
    settings: [
      {
        name: 'Allow multiple response',
        understanding: 'Controls whether a visitor can be shown the same intercept again after closing it, for the rest of that page session.',
        defaultValue: 'Off',
        notes: [
          'This is the closest thing to frequency capping the product has today — there is no "once per day" / "once per session" / "once ever" cookie-backed cap. The suppression when this is off lives in memory for the current page load and is not persisted, so it does not survive a reload or a new tab.',
        ],
      },
      {
        name: 'Auto close on completion',
        understanding: 'Automatically dismisses the widget once the visitor finishes the survey, instead of leaving it open until they close it manually.',
        defaultValue: 'Off',
      },
    ],
  },
  {
    title: 'Association',
    settings: [
      {
        name: 'Project',
        understanding: 'The project this intercept belongs to — see the "Project (one level up)" group for what that actually configures. Its feedback/workspace identity is copied onto the intercept once, at creation time.',
        defaultValue: '—',
      },
      {
        name: 'Survey',
        understanding: 'Which survey this intercept shows. Technically this lives on the root trigger-rule group rather than on the intercept record itself, along with an optional direct survey URL.',
        defaultValue: '—',
      },
      {
        name: 'Platform',
        understanding: 'Web or Mobile — determines whether this configuration is evaluated by the JS snippet or the native Mobile SDK.',
        defaultValue: 'Web',
      },
      {
        name: 'Auto language selection',
        understanding: 'Automatically detect and use the visitor\'s browser/device language for the survey.',
        defaultValue: 'Off',
        notes: ['There is no separate fixed locale/language-code field — this toggle is the only language-related setting found on the intercept.'],
      },
    ],
  },
];

/* ============================================================
   ORDER OF EXECUTION — worked example of the single-winner
   evaluation model (first match wins, evaluation then stops).
   ============================================================ */
export interface OrderExecutionRow {
  order: number;
  name: string;
  trigger: string;
  samplingRate: string;
  outcome: string;
}

export const ORDER_OF_EXECUTION_EXAMPLE: OrderExecutionRow[] = [
  {
    order: 1,
    name: 'Cart Rescue (Exit Intent)',
    trigger: 'Exit Intent AND Page URL Contains /checkout',
    samplingRate: '100%',
    outcome: 'Evaluated first. Visitor is on /checkout/payment and triggers exit intent — rules match, so this one shows and evaluation stops here.',
  },
  {
    order: 2,
    name: 'NPS Feedback Tab',
    trigger: 'Session Duration Greater Than 300 (seconds)',
    samplingRate: '100%',
    outcome: 'Never evaluated on this visit — the engine already stopped at order 1. Even though this visitor has been on-site for 6 minutes, the rule is never checked.',
  },
  {
    order: 3,
    name: 'New Visitor Welcome Popup',
    trigger: 'User Type Equals New Visitor',
    samplingRate: '50%',
    outcome: 'Also never reached. Its 50% sampling rate is irrelevant here — sampling only matters for an intercept that is actually reached in the order.',
  },
];

/* ============================================================
   VISITOR IDENTITY — how "unique visitor" is actually defined
   in the browser. Underpins User Type, Total Visits, Page
   Visited, and Session Duration / idle rules.
   ============================================================ */
export interface IdentitySection {
  key: string;
  title: string;
  body: string;
  notes?: string[];
}

export const IDENTITY_INTRO =
  'Underpins the User Type, Total Visits, Page Visited, and Session Duration rules — verified against the actual identity/cookie code, not assumed from the rule names alone.';

export const IDENTITY_SECTIONS: IdentitySection[] = [
  {
    key: 'cookie',
    title: 'The identity cookie',
    body:
      'A visitor is identified by a <code>visitorId</code> cookie holding a UUID. The UUID is <b>minted server-side</b>, not generated in the browser — on the widget\'s first bootstrap call, if no visitorId cookie is present, the server issues a new UUID in its response and the widget writes it to a cookie. A second cookie, <code>startTime</code>, stores the session-start timestamp and is used for Session Duration and idle rules.',
    notes: [
      'Because the UUID is only assigned once the first API call succeeds, a completely blocked or failed first request means no identity is ever assigned for that page view — connectivity to the widget API is a prerequisite for identification, not just for showing surveys.',
      'Both cookies are host-only — no domain attribute is set when writing them — so they do <b>not</b> carry over between subdomains. A visitor on www.site.com and app.site.com is tracked as two separate people.',
    ],
  },
  {
    key: 'localstorage',
    title: 'What lives in localStorage instead',
    body:
      'Two additional signals are tracked in <code>localStorage</code>, not cookies: the running count used by the Page Visited rule, and a page-history path used internally for navigation tracking. These are separate from the visitorId cookie and are not cleared when cookies are cleared, or vice versa.',
    notes: [
      'This means the three "how many times has this person been here" signals — the visitorId cookie, and these two localStorage keys — can drift out of sync with each other if a visitor clears one storage type but not the other.',
    ],
  },
  {
    key: 'expiry',
    title: 'How long identity lasts',
    body:
      'The <b>Cookies expiry (days)</b> project setting controls the Max-Age of both the visitorId and startTime cookies. It accepts 1–365 days. Left blank, it does not mean "no expiry" — the widget falls back to a 365-day default.',
    notes: [
      'A value of 0 (the field\'s underlying default before anyone touches it) is treated as "not configured" and also falls back to the 365-day default — it does not mean the cookie expires immediately or is session-only.',
    ],
  },
  {
    key: 'usertype',
    title: 'New vs. Returning (the User Type rule)',
    body:
      'Determined by one lookup, nothing more: does a Visitor record already exist matching this browser\'s visitorId? If not, this page view is recorded as a new visitor. If a match exists, it is Returning. There is no additional timestamp or session heuristic layered on top — it is entirely a function of whether a valid, unexpired visitorId cookie exists and matches a stored record.',
  },
  {
    key: 'counters',
    title: 'Total Visits vs. Page Visited vs. Session Duration',
    body: 'These three rules sound similar but are tracked completely differently — different storage, different reset triggers.',
  },
  {
    key: 'edgecases',
    title: 'Edge cases worth knowing',
    body: 'A few situations change what "the same visitor" means in practice:',
    notes: [
      '<b>Private/incognito browsing</b> — identity works fully within that session, but is wiped the moment the private window closes. The next incognito visit always looks brand new.',
      '<b>Clearing cookies (but not site data)</b> — wipes visitorId and startTime, resetting User Type and Total Visits, but leaves the Page Visited localStorage counter untouched — the two can disagree about how "returning" this visitor is.',
      '<b>Third-party cookie blocking</b> — does not affect this at all. Both cookies are set first-party, directly by the widget on your own domain.',
      '<b>Cross-subdomain visits</b> — treated as different visitors on each host, since no domain attribute widens the cookie\'s scope.',
      '<b>No identity reconciliation</b> — if your own site knows who a visitor is (a logged-in user ID), that is never merged with the anonymous visitorId. Data Mapping can attach a known user ID to a response, but it does not feed back into the visit-counting rules.',
    ],
  },
];

export interface IdentityCounterRow {
  name: string;
  storage: string;
  incrementsOn: string;
  resetsOn: string;
}

export const IDENTITY_COUNTERS: IdentityCounterRow[] = [
  {
    name: 'Total Visits',
    storage: 'Server-side, keyed to the visitorId cookie',
    incrementsOn: 'A full bootstrap — a real page load or reload',
    resetsOn: 'The visitorId cookie expiring or being cleared',
  },
  {
    name: 'Page Visited',
    storage: 'Browser localStorage (not a cookie)',
    incrementsOn: 'Any navigation to a new URL — including SPA soft-route changes',
    resetsOn: 'That localStorage key being cleared; unaffected by cookie clearing',
  },
  {
    name: 'Session Duration / idle',
    storage: 'The startTime cookie',
    incrementsOn: 'Elapsed time since that cookie was set',
    resetsOn: 'The startTime cookie expiring or being cleared — same expiry window as visitorId',
  },
];

/** Maps a rule name (from RULES) to the IDENTITY_SECTIONS key it depends on, for the cross-link shown on the rule's detail page. */
export const RULE_TO_IDENTITY_SECTION: Record<string, string> = {
  'User Type': 'usertype',
  'Total Visits (Website Entry Count)': 'counters',
  'Page Visited (History)': 'counters',
  'Session Duration (Total Time)': 'counters',
};

/* ============================================================
   EXAMPLES — 12 realistic use cases, each tying a persona/goal
   to a concrete intercept type + trigger rule combination.
   ============================================================ */
export interface ExampleScenario {
  key: string;
  category: string;
  title: string;
  persona: string;
  type: InterceptType;
  typeLabel: string;
  rules: string[];
  goal: string;
  why: string;
}

export const EXAMPLES_INTRO =
  '12 realistic use cases, each combining an intercept type with the trigger rules that make it work — a practical index into everything on this site, not a new mechanic.';

export const EXAMPLE_SCENARIOS: ExampleScenario[] = [
  {
    key: 'cart-rescue',
    category: 'E-commerce',
    title: 'Cart abandonment rescue',
    persona: 'A shopper with items in cart, moving their cursor toward the tab bar on the checkout page.',
    type: 'exit',
    typeLabel: 'Exit intent',
    rules: ['Page URL', 'Data Layer'],
    goal: 'Offer a discount code or ask what\'s stopping the purchase, right before the visitor leaves with a full cart.',
    why: 'Exit intent costs nothing — this visitor was leaving anyway — and combining Page URL (Contains /checkout) with a Data Layer check for cart_value > 0 keeps it from firing on browsers who never added anything.',
  },
  {
    key: 'post-purchase-nps',
    category: 'E-commerce',
    title: 'Post-purchase satisfaction score',
    persona: 'A customer who just completed checkout and landed on the confirmation page.',
    type: 'popup',
    typeLabel: 'Pop-up',
    rules: ['Page URL'],
    goal: 'Capture a quick NPS/CSAT score while the experience is still fresh.',
    why: 'Page URL Equals thank-you.html fires exactly once, at the one moment the outcome (successful purchase) is known — no need for a time or scroll condition.',
  },
  {
    key: 'loyalty-checkin',
    category: 'E-commerce',
    title: 'Repeat customer check-in',
    persona: 'Someone who has bought from you multiple times and just landed again.',
    type: 'popup',
    typeLabel: 'Pop-up',
    rules: ['Total Visits (Website Entry Count)', 'User Type'],
    goal: 'Ask a deeper loyalty/satisfaction question reserved for your most engaged customers.',
    why: 'Total Visits Greater Than 3 combined with User Type Equals Returning Visitor targets people who\'ve built a real relationship with the site, not first-time browsers.',
  },
  {
    key: 'pricing-objection',
    category: 'SaaS',
    title: 'Pricing page objection capture',
    persona: 'A prospect who read the pricing page and is leaving without starting a trial.',
    type: 'exit',
    typeLabel: 'Exit intent',
    rules: ['Page URL'],
    goal: 'Learn why they didn\'t convert — price, missing feature, unclear plan — while you still have their attention.',
    why: 'Exit Intent + Page URL Contains /pricing is the highest-leverage single-question survey most SaaS sites can run: it only reaches people who evaluated pricing and chose not to act.',
  },
  {
    key: 'feature-adoption',
    category: 'SaaS',
    title: 'In-app feature adoption feedback',
    persona: 'A logged-in user reading the help article for a newly launched feature.',
    type: 'embed',
    typeLabel: 'Inline embed',
    rules: ['HTML Selector'],
    goal: 'Collect feedback on the new feature as page content, without interrupting anyone.',
    why: 'HTML Selector Exists on a .feature-banner element scopes this to exactly the pages that mention the feature, and Inline Embed keeps it feeling like part of the article rather than a popup ambush.',
  },
  {
    key: 'bug-report-desktop',
    category: 'SaaS',
    title: 'Always-on bug reporting for desktop',
    persona: 'A power user on a desktop browser who hits something broken mid-task.',
    type: 'feedback',
    typeLabel: 'Feedback tab',
    rules: ['Device Type'],
    goal: 'Give technical users a persistent, low-friction way to report issues whenever they notice one.',
    why: 'Device Type Equals Desktop keeps this off mobile, where the same tab would eat valuable screen space and mobile users are less likely to be filing detailed bug reports anyway.',
  },
  {
    key: 'welcome-offer',
    category: 'Marketing',
    title: 'New visitor welcome offer',
    persona: 'Someone landing on the site for the first time who has stuck around past the bounce point.',
    type: 'popup',
    typeLabel: 'Pop-up',
    rules: ['User Type', 'Session Duration (Total Time)'],
    goal: 'Convert first-time attention into an email signup or first purchase with a welcome discount.',
    why: 'User Type Equals New Visitor targets acquisition, and pairing it with Session Duration Greater Than 30s filters out instant-bounce traffic that was never going to convert regardless of the offer.',
  },
  {
    key: 'campaign-attribution',
    category: 'Marketing',
    title: 'Newsletter campaign follow-up',
    persona: 'A subscriber who clicked through from a specific email campaign.',
    type: 'embed',
    typeLabel: 'Inline embed',
    rules: ['Query Param (URL Parameter)'],
    goal: 'Ask a question specific to that campaign\'s content, only to the people it was aimed at.',
    why: 'Query Param source Equals newsletter isolates exactly the traffic that arrived from your own link — nobody else on the site sees this survey at all.',
  },
  {
    key: 'article-helpfulness',
    category: 'Media & Content',
    title: 'Mid-article helpfulness check',
    persona: 'A reader who has actually engaged with a long article, not just landed and left.',
    type: 'popup',
    typeLabel: 'Pop-up',
    rules: ['Scroll Depth (Vertical)', 'Page URL'],
    goal: 'Ask whether the content answered their question, timed to when they\'ve read enough to have an opinion.',
    why: 'Scroll Depth Greater Than 50 combined with Page URL Contains /blog means this only reaches genuinely engaged readers on long-form pages — exactly where scroll depth as a signal is meaningful.',
  },
  {
    key: 'regional-feedback',
    category: 'General',
    title: 'Region-specific ongoing feedback channel',
    persona: 'Any visitor browsing from a specific country you\'re expanding support for.',
    type: 'feedback',
    typeLabel: 'Feedback tab',
    rules: ['Country'],
    goal: 'Run a standing feedback channel scoped to one market, without a start/end date.',
    why: 'Country Equals Canada plus a passive Feedback tab means there\'s no timing rule to maintain at all — it just sits there for the right audience indefinitely.',
  },
  {
    key: 'error-recovery',
    category: 'Support',
    title: 'Error-state context capture',
    persona: 'A visitor who just hit a visible error on the page.',
    type: 'popup',
    typeLabel: 'Pop-up',
    rules: ['HTML Selector'],
    goal: 'Capture what the visitor was doing right when something broke, instead of relying on them to file a support ticket.',
    why: 'HTML Selector Exists watching for .error-message-box triggers the moment the error renders — this is one of the few rules that reacts to page state rather than navigation or time.',
  },
  {
    key: 'mobile-onboarding',
    category: 'Mobile App',
    title: 'Post-onboarding in-app prompt',
    persona: 'A new app user who just finished the first-run setup flow.',
    type: 'mobile',
    typeLabel: 'Mobile prompt',
    rules: [],
    goal: 'Ask a quick onboarding-experience question right as the user reaches their first "aha" moment in the app.',
    why: 'This is a Mobile SDK feature, not the web snippet — it uses its own rule set (Time Spent, View Count, Day, Date) rather than the web targeting rules, and needs the SDK integrated into the app build first.',
  },
];

export const EXAMPLE_CATEGORIES: string[] = [
  'E-commerce',
  'SaaS',
  'Marketing',
  'Media & Content',
  'General',
  'Support',
  'Mobile App',
];

/* ============================================================
   SITE CHROME — tab labels/copy, rule sidebar grouping, and the
   preview page's footnote. Centralized here alongside everything
   else so all editable site content lives in this one file.
   ============================================================ */
export interface TabContent {
  key: ViewKey;
  label: string;
  title: string;
  subtitle: string;
}

export const SITE_KICKER = 'Intercept · on-site representation';

export const TABS: TabContent[] = [
  {
    key: 'preview',
    label: 'Widget preview',
    title: 'What an intercept actually looks like on your site',
    subtitle:
      "Every type below is drawn at the product's real defaults — #1B87E6, a 435 × 450 card, 12 px radius, 31% overlay, a 35 × 80 tab, 12 px edge gap. The site behind it is a stand-in for yours. Change the settings on the left and watch the same thing your visitor would see.",
  },
  {
    key: 'rules',
    label: 'Targeting rules',
    title: 'What decides when an intercept fires',
    subtitle:
      'Every rule the targeting engine supports, one at a time — what it checks, a worked example, exactly how to configure it, and which operands it actually accepts.',
  },
  {
    key: 'settings',
    label: 'Intercept settings',
    title: 'What lives on the Intercept object itself',
    subtitle:
      "Status, scheduling, matching order, sampling, and close behaviour — configuration on the Intercept record, separate from a widget's visual design or a single targeting rule. Verified against the product source, including what does not exist yet.",
  },
  {
    key: 'mapping',
    label: 'Data mapping',
    title: 'Attaching visitor context to a response',
    subtitle:
      'How to pull a value from the site — an on-page element, a URL parameter, or a data layer variable — and have it ride along with every survey response.',
  },
  {
    key: 'identity',
    label: 'Visitor identity',
    title: 'How "unique visitor" is actually defined',
    subtitle:
      'The cookie and localStorage mechanics behind User Type, Total Visits, Page Visited, and Session Duration — including what happens in incognito mode, when cookies are cleared, and across subdomains.',
  },
  {
    key: 'setup',
    label: 'Setup',
    title: 'Installing the tracking snippet',
    subtitle:
      'How to create an intercept, where the snippet goes on traditional sites vs. SPAs, platform-specific placement, and what to check if nothing shows up.',
  },
  {
    key: 'examples',
    label: 'Examples',
    title: '12 ways teams actually use Intercept',
    subtitle:
      'Real-world scenarios across e-commerce, SaaS, marketing, media, support, and mobile — each pairing an intercept type with the trigger rules that make it work. A practical index, not a new mechanic.',
  },
];

export interface RuleGroup {
  title: string;
  rules: string[];
}

export const RULE_GROUPS: RuleGroup[] = [
  {
    title: 'Visitor & device',
    rules: ['Country', 'Browser Type', 'Device Type', 'OS (Operating System)', 'User Type', 'IP Address'],
  },
  {
    title: 'Page & session behaviour',
    rules: [
      'Page URL',
      'Time Spent (On Page)',
      'Session Duration (Total Time)',
      'Page Visited (History)',
      'Scroll Depth (Vertical)',
      'Total Visits (Website Entry Count)',
    ],
  },
  {
    title: 'Interaction & site data',
    rules: ['Button Click', 'Data Layer', 'Query Param (URL Parameter)', 'HTML Selector'],
  },
];

export const PREVIEW_FOOTNOTES = {
  faithful:
    "<b>Faithful:</b> colours, card and tab dimensions, radii, overlay opacity, edge gaps, button sizing (width × 0.24 clamped 36–64) and the three entrance timings are the product's own default values.",
  standIn:
    '<b>Stand-in:</b> the survey inside the card is a sketch — the real widget loads your QuestionPro survey in a nested iframe. The stage is a bordered box rather than a real browser viewport, so anchors are measured against it instead of <code>position: fixed</code>.',
  notShown:
    '<b>Not shown:</b> targeting. Nothing here evaluates rules — this is what the visitor sees once an intercept has already matched.',
};

export interface SetupStep {
  key: string;
  title: string;
  body: string;
}

export const SETUP_STEPS: SetupStep[] = [
  {
    key: 'navigate',
    title: 'Navigate to the project',
    body: 'Open the Workspace, then the Project you want to add an intercept to.',
  },
  {
    key: 'type',
    title: 'Click Create Intercept, choose a type',
    body: 'Pop-up, Feedback tab, Exit intent, Inline embed, or Mobile prompt.',
  },
  {
    key: 'embed-selector',
    title: 'For Inline Embed, set the Embed Selector',
    body: 'A CSS selector or plain name — a plain name like my-survey targets [data-qp-intercept="my-survey"] on your page.',
  },
  {
    key: 'trigger-rules',
    title: 'Configure Trigger Rules',
    body: 'Set the conditions under which the survey should appear, then save the intercept.',
  },
];
