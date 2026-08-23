import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { searchItems } from '../search';
import type { SearchItem } from '../search';

export default function SiteSearch() {
  const [query, setQuery] = useState('');
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  const results = searchItems(query);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  function handleSelect(item: SearchItem) {
    navigate(item.path);
    setQuery('');
    setOpen(false);
  }

  return (
    <div className="site-search" ref={containerRef}>
      <input
        type="search"
        className="site-search-input"
        placeholder="Search rules, settings, examples…"
        value={query}
        onChange={(e) => {
          setQuery(e.target.value);
          setOpen(true);
        }}
        onFocus={() => setOpen(true)}
        aria-label="Search this site"
      />
      {open && query.trim() !== '' && (
        <div className="site-search-results" role="listbox">
          {results.length === 0 ? (
            <div className="site-search-empty">No matches for "{query}"</div>
          ) : (
            results.map((item) => (
              <button
                key={item.id}
                type="button"
                className="site-search-result"
                role="option"
                onClick={() => handleSelect(item)}
              >
                <span className="site-search-label">{item.label}</span>
                <span className="site-search-section">{item.section}</span>
              </button>
            ))
          )}
        </div>
      )}
    </div>
  );
}
