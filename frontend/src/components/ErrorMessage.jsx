import { ApiError } from "@/api/apiClient";
function ErrorMessage({ error, onRetry, title }) {
  const apiError = error instanceof ApiError ? error : null;
  const kind = apiError?.kind ?? "unknown";
  const isMissing = kind === "backend_missing";
  const heading =
    title ??
    (isMissing
      ? "Waiting on the backend"
      : kind === "forbidden"
        ? "Not authorised"
        : kind === "unauthorized"
          ? "Please log in"
          : kind === "network"
            ? "Can't reach the server"
            : "Something went wrong");
  const message =
    error instanceof Error ? error.message : "An unexpected error occurred. Please try again.";
  return (
    <div
      role="alert"
      className="gn-card flex flex-col items-start gap-3 border-dashed p-6 text-left"
    >
      <div className="flex items-center gap-3">
        <span className="grid size-10 place-items-center rounded-full bg-secondary text-primary">
          <i
            className={
              isMissing ? "fa-solid fa-plug-circle-exclamation" : "fa-solid fa-triangle-exclamation"
            }
            aria-hidden="true"
          />
        </span>
        <div>
          <h3 className="text-base font-bold text-foreground">{heading}</h3>
          {isMissing ? (
            <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
              Requires backend implementation
            </p>
          ) : null}
        </div>
      </div>
      <p className="max-w-prose text-sm text-muted-foreground">{message}</p>
      {apiError?.fieldErrors ? (
        <ul className="list-inside list-disc text-sm text-destructive">
          {Object.entries(apiError.fieldErrors).map(([field, messages]) => (
            <li key={field}>
              <span className="font-semibold">{field}</span>: {messages.join(", ")}
            </li>
          ))}
        </ul>
      ) : null}
      {onRetry && !isMissing ? (
        <button type="button" onClick={onRetry} className="gn-btn gn-btn-outline">
          <i className="fa-solid fa-rotate-right" aria-hidden="true" /> Try again
        </button>
      ) : null}
    </div>
  );
}
export { ErrorMessage };
