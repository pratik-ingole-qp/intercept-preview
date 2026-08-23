import { ASSISTANT_QUESTIONS, EXAMPLE_RECIPES, EXAMPLE_SCENARIOS } from './data';
import type { Recipe, RecipeRow } from './data';
import type { InterceptType } from './types';

export type Answers = Partial<Record<'where' | 'who' | 'when' | 'tone', string>>;

/**
 * The `tone` question is only worth asking when `when` hasn't already decided
 * the type. Exit intent is the one answer that fully settles it — "always
 * available" still has two forms (inline embed vs. edge tab), so it asks.
 */
export function needsTone(a: Answers): boolean {
  return a.when === 'arrival' || a.when === 'engaged' || a.when === 'always';
}

export function questionApplies(key: string, a: Answers): boolean {
  return key !== 'tone' || needsTone(a);
}

/** Some tone options are incoherent with some `when` answers — an always-on overlay isn't a thing. */
export function optionApplies(opt: { onlyWhen?: string[] }, a: Answers): boolean {
  return !opt.onlyWhen || (a.when !== undefined && opt.onlyWhen.includes(a.when));
}

function resolveType(a: Answers): { type: InterceptType; label: string; because: string } {
  if (a.when === 'leaving') {
    return { type: 'exit', label: 'Exit intent', because: 'Firing on departure is the exit-intent type — there is no rule that expresses it.' };
  }
  if (a.when === 'always') {
    if (a.tone === 'quiet') {
      return { type: 'embed', label: 'Inline embed', because: 'Always available and inside the content is what the inline embed is for.' };
    }
    return { type: 'feedback', label: 'Feedback tab', because: 'A standing, visitor-initiated channel is the edge tab — no timing rule to maintain.' };
  }
  if (a.tone === 'quiet') {
    return { type: 'embed', label: 'Inline embed', because: 'Sitting inside the page content means the inline embed, placed by an embed selector.' };
  }
  if (a.tone === 'passive') {
    return { type: 'feedback', label: 'Feedback tab', because: 'Staying out of the way means the edge tab, which the visitor opens themselves.' };
  }
  return { type: 'popup', label: 'Pop-up', because: 'Interrupting on a condition you control is the overlay pop-up.' };
}

function rowsFor(a: Answers): RecipeRow[] {
  const rows: RecipeRow[] = [];

  if (a.where === 'section') {
    rows.push({
      rule: 'Page URL',
      operand: 'Includes',
      value: '/pricing',
      note: 'Includes, not Equals — it survives query strings and trailing ids.',
    });
  } else if (a.where === 'exact') {
    rows.push({
      rule: 'Page URL',
      operand: 'Equals to',
      value: 'thank-you.html',
      note: 'Equals is only safe when the page is one fixed URL with no parameters.',
    });
  } else if (a.where === 'element') {
    rows.push({
      rule: 'HTML Selector',
      operand: 'Exists',
      value: '.feature-banner',
      note: 'A CSS selector — keep the leading dot for a class, # for an id.',
    });
  }

  if (a.who === 'new') {
    rows.push({
      rule: 'User Type',
      operand: 'Equals to',
      value: 'New Visitor',
      note: 'No prior visitor cookie. Incognito windows always read as new.',
    });
  } else if (a.who === 'returning') {
    rows.push({
      rule: 'User Type',
      operand: 'Equals to',
      value: 'Returning Visitor',
      note: 'Reads the visitor cookie set on the first session.',
    });
    rows.push({
      rule: 'Total Visits (Website Entry Count)',
      operand: 'Greater than',
      value: '3',
      note: 'Raise this to tighten the audience — clearing cookies resets the count.',
    });
  } else if (a.who === 'campaign') {
    rows.push({
      rule: 'Query Param (URL Parameter)',
      field: 'source',
      operand: 'Equals to',
      value: 'newsletter',
      note: 'The parameter name and its value are two separate inputs.',
    });
  }

  if (a.when === 'engaged') {
    rows.push({
      rule: 'Scroll Depth (Vertical)',
      operand: 'Greater than',
      value: '50',
      note: 'Percent of page height. On a short page this arrives instantly — swap for Time Spent (On Page) if the page is not long-form.',
    });
  }

  return rows;
}

export function buildRecipe(a: Answers): Recipe & { because: string } {
  const t = resolveType(a);
  const rows = rowsFor(a);
  return {
    type: t.type,
    typeLabel: t.label,
    because: t.because,
    match: rows.length ? 'all' : 'none',
    rows,
    verify:
      rows.length > 0
        ? 'Reproduce every row above in one session, then watch for the widget once — not on every page.'
        : 'Nothing to reproduce: with no rules the intercept fires anywhere the snippet is installed.',
  };
}

/** Nearest documented scenario, so the answer lands somewhere already written up. */
export function nearestExample(a: Answers) {
  const recipe = buildRecipe(a);
  const wanted = new Set(recipe.rows.map((r) => r.rule));
  let best: { key: string; title: string; score: number } | null = null;

  for (const s of EXAMPLE_SCENARIOS) {
    const r = EXAMPLE_RECIPES[s.key];
    if (!r) continue;
    let score = r.type === recipe.type ? 2 : 0;
    for (const row of r.rows) if (wanted.has(row.rule)) score += 1;
    if (!best || score > best.score) best = { key: s.key, title: s.title, score };
  }
  return best && best.score >= 2 ? best : null;
}

/**
 * How much ground the four questions actually cover. Enumerated rather than
 * multiplied out by hand, because two of the branches are conditional: `tone`
 * is skipped for exit intent, and the "interrupt" tone is withheld from the
 * always-on path.
 */
export function countCombinations() {
  const paths: Answers[] = [];
  const q = (k: string) => ASSISTANT_QUESTIONS.find((x) => x.key === k)!;

  for (const where of q('where').options) {
    for (const who of q('who').options) {
      for (const when of q('when').options) {
        const base: Answers = { where: where.value, who: who.value, when: when.value };
        if (!needsTone(base)) {
          paths.push(base);
          continue;
        }
        for (const tone of q('tone').options) {
          if (!optionApplies(tone, base)) continue;
          paths.push({ ...base, tone: tone.value });
        }
      }
    }
  }

  const recipes = new Set<string>();
  const types = new Set<string>();
  for (const p of paths) {
    const r = buildRecipe(p);
    types.add(r.type);
    recipes.add(`${r.type}|${r.rows.map((x) => `${x.rule}:${x.operand}:${x.value}`).join('+')}`);
  }

  return { paths: paths.length, recipes: recipes.size, types: types.size };
}
