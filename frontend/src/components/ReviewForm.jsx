import { useState } from "react";
import { createReview } from "@/api/reviewApi";
import { ErrorMessage } from "./ErrorMessage";
function ReviewForm({ sid, bid, onDone }) {
  const [rating, setRating] = useState(5);
  const [text, setText] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState(null);
  const [done, setDone] = useState(false);
  if (done) {
    return (
      <p className="text-sm font-semibold text-foreground">
        Thanks — your review was sent for verification.
      </p>
    );
  }
  return (
    <form
      className="gn-card space-y-4 p-6"
      onSubmit={async (e) => {
        e.preventDefault();
        setBusy(true);
        setError(null);
        try {
          await createReview({ service: sid, booking: bid, rating, review: text });
          setDone(true);
          onDone?.();
        } catch (err) {
          setError(err);
        } finally {
          setBusy(false);
        }
      }}
    >
      <h3 className="font-display text-2xl text-foreground">Leave a review</h3>

      <div>
        <span className="gn-label">Your rating</span>
        <div className="mt-2 flex gap-1">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              type="button"
              aria-label={`${star} star${star === 1 ? "" : "s"}`}
              onClick={() => setRating(star)}
              className="text-2xl text-accent"
            >
              <i className={star <= rating ? "fa-solid fa-star" : "fa-regular fa-star"} />
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="gn-label" htmlFor="review-text">
          How was your appointment?
        </label>
        <textarea
          id="review-text"
          value={text}
          required
          rows={4}
          onChange={(e) => setText(e.target.value)}
          className="gn-input mt-1"
          placeholder="Tell others what to expect…"
        />
      </div>

      {error ? <ErrorMessage error={error} /> : null}

      <button type="submit" className="gn-btn gn-btn-primary" disabled={busy}>
        {busy ? "Sending\u2026" : "Submit review"}
      </button>
    </form>
  );
}
export { ReviewForm };
