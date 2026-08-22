import type { ReactNode } from 'react';

interface EmbedSlotProps {
  embedSlot?: ReactNode;
}

export function ShopBackdrop({ embedSlot }: EmbedSlotProps) {
  return (
    <div className="site">
      <nav className="site-nav">
        <span className="site-logo">Meridian Supply</span>
        <div className="site-links">
          <span>Brewing</span>
          <span>Grinders</span>
          <span>Beans</span>
          <span>Journal</span>
        </div>
        <span className="site-cart">Cart · 2</span>
      </nav>

      <div className="hero">
        <p className="tag">New season</p>
        <h2>Brewing gear that earns its counter space</h2>
        <p>Tested in our own café for a year before it reaches the shelf. Free shipping over $60.</p>
        <button className="btn-primary" type="button">Shop the collection</button>
      </div>

      <div className="grid-head">
        <h3>Best sellers</h3>
        <span>12 products</span>
      </div>

      <div className="products">
        <div className="product"><div className="swatch" /><h4>Kettle No. 4</h4><p className="price">$89</p></div>
        <div className="product"><div className="swatch" /><h4>Pour-over Set</h4><p className="price">$54 <em>· sale</em></p></div>
        <div className="product"><div className="swatch" /><h4>Burr Grinder</h4><p className="price">$210</p></div>
        <div className="product"><div className="swatch" /><h4>Scale &amp; Timer</h4><p className="price">$68</p></div>
        <div className="product"><div className="swatch" /><h4>Carafe, 600ml</h4><p className="price">$42</p></div>
        <div className="product"><div className="swatch" /><h4>Filter Pack</h4><p className="price">$12</p></div>
      </div>

      {embedSlot}

      <div className="editorial">
        <h3>Why grind size matters more than your machine</h3>
        <p>Most brewing problems trace back to grind consistency, not equipment. A burr grinder at $210 will outperform a $900 machine fed by a blade grinder, every time.</p>
        <p>Scroll a little further and the page keeps going — which is the point. Rules like scroll depth and session duration only mean something on a page with real length to it.</p>
      </div>

      <div className="site-foot">
        <span>© Meridian Supply</span><span>Shipping</span><span>Returns</span><span>Contact</span>
      </div>
    </div>
  );
}

export function SaasBackdrop({ embedSlot }: EmbedSlotProps) {
  return (
    <div className="app">
      <aside className="app-side">
        <div className="brand">Northgate</div>
        <ul>
          <li className="on">Overview</li>
          <li>Pipelines</li>
          <li>Billing</li>
          <li>Team</li>
          <li>Settings</li>
        </ul>
      </aside>
      <div className="app-main">
        <h2>Overview</h2>
        <dl className="kpis">
          <div className="kpi"><dt>Active runs</dt><dd>142<span>+8%</span></dd></div>
          <div className="kpi"><dt>Failed today</dt><dd>3</dd></div>
          <div className="kpi"><dt>Avg duration</dt><dd>4m 12s</dd></div>
        </dl>
        {embedSlot}
        <table className="app-table">
          <thead><tr><th>Pipeline</th><th>Status</th><th>Duration</th><th>Started</th></tr></thead>
          <tbody>
            <tr><td>web-deploy</td><td>Passed</td><td>3m 04s</td><td>12:41</td></tr>
            <tr><td>nightly-etl</td><td>Passed</td><td>11m 22s</td><td>02:00</td></tr>
            <tr><td>api-canary</td><td>Failed</td><td>0m 48s</td><td>11:07</td></tr>
            <tr><td>image-build</td><td>Passed</td><td>6m 15s</td><td>10:32</td></tr>
            <tr><td>docs-sync</td><td>Passed</td><td>0m 39s</td><td>09:58</td></tr>
            <tr><td>db-migrate</td><td>Queued</td><td>&mdash;</td><td>&mdash;</td></tr>
            <tr><td>lint-all</td><td>Passed</td><td>1m 51s</td><td>09:14</td></tr>
            <tr><td>e2e-suite</td><td>Passed</td><td>18m 07s</td><td>08:40</td></tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}

export function ArticleBackdrop({ embedSlot }: EmbedSlotProps) {
  return (
    <div className="longform">
      <p className="eyebrow-a">Field notes</p>
      <h1>The quiet cost of asking everyone the same question</h1>
      <p className="byline">By R. Alderman · 8 min read</p>
      <p>Survey fatigue is not really about surveys. It is about relevance. A visitor who is asked something that plainly does not apply to them learns, in about two seconds, that answering is not worth their time.</p>
      <p>That lesson generalises. The next prompt they see gets dismissed faster, and the one after that is invisible to them entirely. Response rates fall long before anyone notices, and the instinct is usually to ask more often rather than more precisely.</p>
      <h2>Precision is cheaper than volume</h2>
      <p>Narrowing who gets asked feels like giving up reach. In practice it usually raises absolute response counts, because the people who do see the prompt recognise it as being about them.</p>
      <div className="pull">The best-performing prompt is almost never the one shown to the most people.</div>
      <p>The mechanics matter here. A prompt tied to a page, a behaviour or a moment in a journey carries context the question itself does not have to spend words establishing.</p>
      {embedSlot}
      <h2>What to measure instead</h2>
      <p>Impressions are a vanity number on their own. The pairing worth watching is qualified visitors against completed responses, because it tells you whether your targeting or your question is the weak link.</p>
      <p>If plenty qualify and few respond, the question is wrong. If few qualify at all, the targeting is too narrow. The two failures look identical on a dashboard that only counts responses.</p>
      <p>Long pages like this one are also where scroll depth earns its keep — halfway down an article is a meaningfully different moment from the top of it.</p>
    </div>
  );
}

export function LandingBackdrop({ embedSlot }: EmbedSlotProps) {
  return (
    <div className="mkt">
      <div className="mkt-hero">
        <h1>Ship your onboarding in an afternoon</h1>
        <p>Drop-in flows, no backend to run, and analytics that arrive already joined up.</p>
        <button className="btn-primary" type="button">Start free trial</button>
      </div>
      <div className="mkt-feats">
        <div className="mkt-feat"><h3>Fast to install</h3><p>One script tag, and you are collecting on the next page load.</p></div>
        <div className="mkt-feat"><h3>Built to target</h3><p>Reach the visitors who matter, and leave everyone else alone.</p></div>
        <div className="mkt-feat"><h3>Honest reporting</h3><p>Qualified, shown and completed, counted separately.</p></div>
      </div>
      {embedSlot}
      <div className="mkt-price">
        <p className="num">$0</p>
        <p className="per">for the first 1,000 responses each month</p>
      </div>
    </div>
  );
}
