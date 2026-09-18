import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { addToWishlist } from "@/api/wishlistApi";
import { useAuth } from "@/hooks/useAuth";

function WishlistButton({ serviceId, variant = "icon", initialSaved = false }) {
  const { isAuthenticated, user } = useAuth();
  const navigate = useNavigate();
  const [saved, setSaved] = useState(initialSaved);
  const [message, setMessage] = useState(null);
  const [busy, setBusy] = useState(false);

  const onClick = async (event) => {
    event.preventDefault();
    event.stopPropagation();
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }
    setBusy(true);
    setSaved(true);
    try {
      await addToWishlist(serviceId);
      setMessage(null);
    } catch (error) {
      setSaved(false);
      setMessage(error instanceof Error ? error.message : "Couldn't save to wishlist.");
    } finally {
      setBusy(false);
    }
  };

  if (variant === "full") {
    return (
      <div>
        <button type="button" onClick={onClick} disabled={busy} className="gn-btn gn-btn-outline">
          <i className={saved ? "fa-solid fa-heart" : "fa-regular fa-heart"} aria-hidden="true" />
          {saved ? "Saved" : "Add to wishlist"}
        </button>
        {message ? <p className="mt-2 text-xs text-destructive">{message}</p> : null}
      </div>
    );
  }

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={busy}
      aria-label={saved ? "Saved to wishlist" : "Add to wishlist"}
      title={message ?? void 0}
      className="grid size-9 place-items-center rounded-full bg-ink/60 text-cream transition-colors hover:bg-ink"
    >
      <i className={saved ? "fa-solid fa-heart" : "fa-regular fa-heart"} aria-hidden="true" />
    </button>
  );
}

export { WishlistButton };
