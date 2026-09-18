import { Link, useParams } from "react-router-dom";
import { useState, useEffect, useCallback } from "react";
import { getBooking, cancelBooking } from "@/api/bookingApi";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { formatPrice } from "@/utils/formatPrice";
import { formatDate } from "@/utils/formatDate";
import { ErrorMessage } from "@/components/ErrorMessage";
import { LoadingSpinner } from "@/components/LoadingSpinner";
import { ReviewForm } from "@/components/ReviewForm";

export default function BookingDetail() {
  return (
    <ProtectedRoute>
      <BookingDetailContent />
    </ProtectedRoute>
  );
}

function BookingDetailContent() {
  const { bid } = useParams();

  const [booking, setBooking] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const [cancelling, setCancelling] = useState(false);
  const [cancelErr, setCancelErr] = useState(null);

  const fetchBooking = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await getBooking(bid);
      setBooking(data);
    } catch (err) {
      setError(err);
    } finally {
      setIsLoading(false);
    }
  }, [bid]);

  useEffect(() => {
    fetchBooking();
  }, [fetchBooking]);

  if (isLoading) return <LoadingSpinner label="Loading appointment details..." />;
  if (error) return <ErrorMessage error={error} onRetry={fetchBooking} />;
  if (!booking) return null;

  const handleCancel = async () => {
    if (!confirm("Are you sure you want to cancel this booking?")) return;
    setCancelling(true);
    setCancelErr(null);
    try {
      await cancelBooking(bid);
      await fetchBooking();
    } catch (err) {
      setCancelErr(err);
    } finally {
      setCancelling(false);
    }
  };

  return (
    <div className="gn-container py-12">
      <Link to="/bookings" className="text-sm font-semibold text-primary hover:underline">
        &larr; Back to my bookings
      </Link>

      <div className="mt-6 mx-auto max-w-2xl">
        <div className="gn-card p-8 border border-border">
          <div className="flex items-center justify-between border-b border-border pb-6">
            <div>
              <span className="gn-eyebrow text-primary">Booking #{booking.bid}</span>
              <h1 className="mt-1 font-display text-3xl text-foreground">
                {booking.service_title ?? "Beauty Appointment"}
              </h1>
            </div>
            <span className="gn-badge bg-secondary text-secondary-foreground font-bold text-sm">
              {booking.booking_status}
            </span>
          </div>

          <div className="mt-6 space-y-4 text-sm">
            <div className="flex justify-between py-2 border-b border-border/50">
              <span className="text-muted-foreground">Scheduled Date:</span>
              <span className="font-semibold text-foreground">{formatDate(booking.scheduled_date)}</span>
            </div>
            <div className="flex justify-between py-2 border-b border-border/50">
              <span className="text-muted-foreground">Time Slot:</span>
              <span className="font-semibold text-foreground">{booking.scheduled_time}</span>
            </div>
            <div className="flex justify-between py-2 border-b border-border/50">
              <span className="text-muted-foreground">Service Location:</span>
              <span className="font-semibold text-foreground">{booking.service_type} Visit</span>
            </div>
            {booking.address ? (
              <div className="flex justify-between py-2 border-b border-border/50">
                <span className="text-muted-foreground">Delivery Address:</span>
                <span className="font-semibold text-foreground">{booking.address}</span>
              </div>
            ) : null}
            <div className="flex justify-between py-2 border-b border-border/50">
              <span className="text-muted-foreground">Total Price:</span>
              <span className="font-display text-2xl text-primary">{formatPrice(booking.total)}</span>
            </div>
          </div>

          {cancelErr ? (
            <div className="mt-4">
              <ErrorMessage error={cancelErr} />
            </div>
          ) : null}

          {booking.booking_status === "Pending" || booking.booking_status === "Confirmed" ? (
            <div className="mt-8 pt-6 border-t border-border flex justify-end">
              <button
                type="button"
                onClick={handleCancel}
                disabled={cancelling}
                className="gn-btn bg-red-600 text-white hover:bg-red-700"
              >
                {cancelling ? "Cancelling..." : "Cancel Appointment"}
              </button>
            </div>
          ) : null}

          {booking.booking_status === "Completed" && !booking.has_review && booking.service ? (
            <div className="mt-8 border-t border-border pt-6">
              <ReviewForm
                sid={booking.service.slug}
                bid={booking.bid}
                onDone={fetchBooking}
              />
            </div>
          ) : null}
          {booking.booking_status === "Completed" && booking.has_review ? (
            <p className="mt-8 border-t border-border pt-6 text-sm font-semibold text-muted-foreground">
              You have already reviewed this completed appointment.
            </p>
          ) : null}
        </div>
      </div>
    </div>
  );
}
