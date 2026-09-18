function RatingStars({ rating, count, size = "sm", showEmpty = true }) {
  const value = typeof rating === "number" ? rating : null;
  const textSize = size === "sm" ? "text-xs" : "text-sm";
  if (value === null && !showEmpty) return null;
  return (
    <span className={`inline-flex items-center gap-1.5 font-semibold ${textSize}`}>
      <span className="flex items-center gap-0.5 text-accent" aria-hidden="true">
        {[1, 2, 3, 4, 5].map((star) => (
          <i
            key={star}
            className={
              value !== null && value >= star - 0.5 ? "fa-solid fa-star" : "fa-regular fa-star"
            }
          />
        ))}
      </span>
      <span className="text-foreground">{value !== null ? value.toFixed(1) : "New"}</span>
      {typeof count === "number" ? <span className="text-muted-foreground">({count})</span> : null}
    </span>
  );
}
export { RatingStars };
