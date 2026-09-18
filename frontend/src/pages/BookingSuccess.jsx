import { Link, useSearchParams } from "react-router-dom";

export default function BookingSuccess() {
  const [searchParams] = useSearchParams();
  const bid = searchParams.get("bid");

  return (
    <div className="gn-container py-20 text-center">
      <div className="gn-card mx-auto max-w-md p-10 border border-border">
        <div className="size-20 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center text-4xl mx-auto mb-4">
          <i className="fa-solid fa-circle-check" />
        </div>
        <h1 className="font-display text-4xl text-foreground">Booking Confirmed!</h1>
        <p className="mt-3 text-sm text-muted-foreground leading-relaxed">
          Your appointment request has been sent to the salon specialist. You will receive confirmation details shortly.
        </p>

        {bid ? (
          <p className="mt-2 text-xs font-mono text-primary font-bold">
            Booking ID: #{bid}
          </p>
        ) : null}

        <div className="mt-8 flex flex-col gap-3">
          <Link to="/bookings" className="gn-btn gn-btn-primary py-3">
            View My Bookings
          </Link>
          <Link to="/" className="gn-btn gn-btn-outline py-3">
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}
