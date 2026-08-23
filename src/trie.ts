/**
 * Minimal prefix trie. Each node accumulates the ids of every word inserted
 * through it, so a prefix lookup is O(prefix length) instead of an insert-time
 * O(1) plus a search-time DFS — fine trade-off at this data size (a few
 * hundred indexed tokens at most).
 */
class TrieNode {
  children: Map<string, TrieNode> = new Map();
  ids: Set<string> = new Set();
}

export class Trie {
  private root = new TrieNode();

  insert(word: string, id: string): void {
    let node = this.root;
    for (const char of word.toLowerCase()) {
      let next = node.children.get(char);
      if (!next) {
        next = new TrieNode();
        node.children.set(char, next);
      }
      next.ids.add(id);
      node = next;
    }
  }

  /** Returns the ids of every word that starts with `prefix`. Empty prefix matches nothing. */
  idsWithPrefix(prefix: string): Set<string> {
    let node = this.root;
    const lower = prefix.toLowerCase();
    if (!lower) return new Set();
    for (const char of lower) {
      const next = node.children.get(char);
      if (!next) return new Set();
      node = next;
    }
    return node.ids;
  }
}
