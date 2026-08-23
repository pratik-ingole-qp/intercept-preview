/** Deterministic, URL-safe slug for a piece of content (e.g. a rule or setting name). */
export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

/** Builds a slug -> item lookup for a list, keyed by a name field. Throws on duplicate slugs so collisions surface immediately. */
export function bySlug<T>(items: T[], getName: (item: T) => string): Map<string, T> {
  const map = new Map<string, T>();
  for (const item of items) {
    const slug = slugify(getName(item));
    if (map.has(slug)) {
      throw new Error(`Duplicate slug "${slug}" from "${getName(item)}" — two items produce the same URL.`);
    }
    map.set(slug, item);
  }
  return map;
}
