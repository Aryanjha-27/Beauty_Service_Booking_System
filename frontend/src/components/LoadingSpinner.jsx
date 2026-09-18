function LoadingSpinner({ label }) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-12 text-muted-foreground">
      <i className="fa-solid fa-spinner fa-spin text-2xl text-primary" aria-hidden="true" />
      <span className="text-sm font-semibold">{label ?? "Loading\u2026"}</span>
    </div>
  );
}
export { LoadingSpinner };
