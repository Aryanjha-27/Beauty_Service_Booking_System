import { Link, useSearchParams } from "react-router-dom";

export default function PaymentFailure() {
  const [searchParams] = useSearchParams();
  const purchaseOrderId = searchParams.get("purchase_order_id");

  return (
    <div className="gn-container py-20 text-center">
      <div className="gn-card mx-auto max-w-md border border-border p-10">
        <div className="mx-auto mb-4 flex size-20 items-center justify-center rounded-full bg-red-100 text-4xl text-red-600">
          <i className="fa-solid fa-circle-xmark" aria-hidden="true" />
        </div>
        <h1 className="font-display text-4xl text-foreground">Payment Not Completed</h1>
        <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
          Khalti could not complete this payment. Your booking was not marked as paid.
        </p>
        {purchaseOrderId ? (
          <p className="mt-2 text-xs font-mono font-bold text-primary">Order: #{purchaseOrderId}</p>
        ) : null}
        <div className="mt-8 flex flex-col gap-3">
          <Link to="/bookings" className="gn-btn gn-btn-primary py-3">
            View My Bookings
          </Link>
          <Link to="/services" className="gn-btn gn-btn-outline py-3">
            Browse Services
          </Link>
        </div>
      </div>
    </div>
  );
}
