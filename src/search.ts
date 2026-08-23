import { DATA_MAPPING_TYPES, EXAMPLE_SCENARIOS, IDENTITY_SECTIONS, INTERCEPT_SETTING_GROUPS, RULES, SETUP_STEPS, TABS } from './data';
import { Trie } from './trie';
import { slugify } from './slug';

export interface SearchItem {
  id: string;
  label: string;
  section: string;
  /** Where clicking this result should navigate to. */
  path: string;
}

function tokenize(text: string): string[] {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, ' ')
    .split(/\s+/)
    .filter(Boolean);
}

function buildItems(): SearchItem[] {
  const items: SearchItem[] = [];

  TABS.forEach((t) => items.push({ id: `tab:${t.key}`, label: t.label, section: 'Tabs', path: `/${t.key}` }));

  RULES.forEach((r) =>
    items.push({ id: `rule:${r.name}`, label: r.name, section: 'Targeting rules', path: `/rules/${slugify(r.name)}` }),
  );

  INTERCEPT_SETTING_GROUPS.flatMap((g) => g.settings).forEach((s) =>
    items.push({ id: `setting:${s.name}`, label: s.name, section: 'Intercept settings', path: `/settings/${slugify(s.name)}` }),
  );

  DATA_MAPPING_TYPES.forEach((m) =>
    items.push({ id: `mapping:${m.name}`, label: m.name, section: 'Data mapping', path: `/mapping/${slugify(m.name)}` }),
  );

  IDENTITY_SECTIONS.forEach((s) =>
    items.push({ id: `identity:${s.key}`, label: s.title, section: 'Visitor identity', path: `/identity/${s.key}` }),
  );

  EXAMPLE_SCENARIOS.forEach((e) =>
    items.push({ id: `example:${e.key}`, label: e.title, section: 'Examples', path: `/examples/${e.key}` }),
  );

  SETUP_STEPS.forEach((s) => items.push({ id: `setup:${s.key}`, label: s.title, section: 'Setup', path: '/setup' }));

  return items;
}

export const SEARCH_ITEMS: SearchItem[] = buildItems();

const itemsById = new Map<string, SearchItem>(SEARCH_ITEMS.map((item) => [item.id, item]));

const trie = new Trie();
SEARCH_ITEMS.forEach((item) => {
  tokenize(item.label).forEach((token) => trie.insert(token, item.id));
});

function intersect(a: Set<string>, b: Set<string>): Set<string> {
  const result = new Set<string>();
  for (const id of a) {
    if (b.has(id)) result.add(id);
  }
  return result;
}

/** Every query word must prefix-match at least one token of the same result (AND across words). */
export function searchItems(query: string, limit = 8): SearchItem[] {
  const words = tokenize(query);
  if (!words.length) return [];

  const idSetsPerWord: Set<string>[] = words.map((word) => trie.idsWithPrefix(word));
  const matchIds: Set<string> = idSetsPerWord.reduce((acc, ids) => intersect(acc, ids));

  return Array.from(matchIds)
    .map((id) => itemsById.get(id))
    .filter((item): item is SearchItem => item !== undefined)
    .slice(0, limit);
}
