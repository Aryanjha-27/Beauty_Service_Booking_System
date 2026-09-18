import { Link } from "react-router-dom";

function EmptyState({
  icon = "fa-regular fa-face-smile",
  title,
  description,
  actionLabel,
  actionTo,
  onAction,
  children,
}) {
  return (
    <div className="gn-card flex flex-col items-center gap-4 border-dashed px-6 py-14 text-center">
      <span className="grid size-14 place-items-center rounded-full bg-secondary text-xl text-primary">
        <i className={icon} aria-hidden="true" />
      </span>
      <div>
        <h3 className="font-display text-2xl text-foreground">{title}</h3>
        {description ? (
          <p className="mx-auto mt-2 max-w-sm text-sm text-muted-foreground">{description}</p>
        ) : null}
      </div>
      {actionLabel && actionTo ? (
        <Link to={actionTo} className="gn-btn gn-btn-ink">
          {actionLabel}
        </Link>
      ) : null}
      {actionLabel && onAction ? (
        <button type="button" className="gn-btn gn-btn-ink" onClick={onAction}>
          {actionLabel}
        </button>
      ) : null}
      {children}
    </div>
  );
}

export { EmptyState };
