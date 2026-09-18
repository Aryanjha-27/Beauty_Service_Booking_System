import { useEffect, useState } from "react";
function SearchBar({
  value = "",
  placeholder = "Search haircuts, spa, makeup\u2026",
  categories,
  category = "",
  onCategoryChange,
  onSearch,
  tone = "light",
  submitLabel = "Search",
}) {
  const [term, setTerm] = useState(value);
  useEffect(() => setTerm(value), [value]);
  useEffect(() => {
    if (term === value) return;
    const id = window.setTimeout(() => onSearch(term), 400);
    return () => window.clearTimeout(id);
  }, [term, value, onSearch]);
  const shell =
    tone === "light"
      ? "bg-cream/95 shadow-2xl shadow-black/40"
      : "bg-card border border-border shadow-[var(--shadow-soft)]";
  return (
    <form
      role="search"
      onSubmit={(e) => {
        e.preventDefault();
        onSearch(term);
      }}
      className={`flex w-full flex-col gap-2 rounded-3xl p-2 sm:flex-row sm:items-center sm:rounded-full ${shell}`}
    >
      <span className="hidden pl-4 text-muted-foreground sm:block">
        <i className="fa-solid fa-magnifying-glass" aria-hidden="true" />
      </span>
      <input
        value={term}
        onChange={(e) => setTerm(e.target.value)}
        placeholder={placeholder}
        aria-label="Search services"
        className="flex-1 bg-transparent px-3 py-3 text-sm text-ink outline-none placeholder:text-ink/45"
      />
      {categories && onCategoryChange ? (
        <select
          value={category}
          onChange={(e) => onCategoryChange(e.target.value)}
          aria-label="Filter by category"
          className="rounded-full bg-secondary px-4 py-3 text-xs font-bold text-secondary-foreground outline-none"
        >
          <option value="">All categories</option>
          {categories.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
      ) : null}
      <button type="submit" className="gn-btn gn-btn-ink px-6 py-3">
        {submitLabel}
      </button>
    </form>
  );
}
export { SearchBar };
