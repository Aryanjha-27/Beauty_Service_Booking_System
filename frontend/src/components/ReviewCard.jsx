import { imageUrl } from "@/utils/imageUrl";
import { formatDate } from "@/utils/formatDate";
import { RatingStars } from "./RatingStars";
function ReviewCard({ review }) {
  const reviewerName = review.user_name ?? review.user?.profile?.full_name ?? review.user?.username ?? "Verified client";
  const avatar = imageUrl(review.user_image ?? review.user?.profile?.image ?? null);
  return (
    <article className="gn-card p-5">
      <div className="flex items-center gap-3">
        {avatar ? (
          <img
            src={avatar}
            alt={reviewerName}
            loading="lazy"
            className="size-10 rounded-full object-cover"
          />
        ) : (
          <span className="grid size-10 place-items-center rounded-full bg-secondary text-primary">
            <i className="fa-solid fa-user" aria-hidden="true" />
          </span>
        )}
        <div className="min-w-0">
          <p className="truncate text-sm font-bold text-foreground">
            {reviewerName}
          </p>
          <p className="text-xs text-muted-foreground">{formatDate(review.date)}</p>
        </div>
        <span className="ml-auto">
          <RatingStars rating={review.rating} />
        </span>
      </div>
      <p className="mt-4 text-sm leading-relaxed text-muted-foreground">{review.review}</p>
      {review.is_verified ? (
        <span className="gn-badge mt-4 bg-secondary text-secondary-foreground">
          Verified booking
        </span>
      ) : null}
    </article>
  );
}
export { ReviewCard };
