import { Link, useSearchParams } from "react-router-dom";

export default function PaymentSuccess() {
  const [searchParams] = useSearchParams();
  const purchaseOrderId = searchParams.get("purchase_order_id");

  return (
    <div className="gn-container py-20 text-center">
      <div className="gn-card mx-auto max-w-md border border-border p-10">
        <div className="mx-auto mb-4 flex size-20 items-center justify-center rounded-full bg-emerald-100 text-4xl text-emerald-600">
          <i className="fa-solid fa-circle-check" aria-hidden="true" />
        </div>
        <h1 className="font-display text-4xl text-foreground">Payment Successful</h1>
        <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
          Your Khalti payment was verified successfully.
        </p>
        {purchaseOrderId ? (
          <p className="mt-2 text-xs font-mono font-bold text-primary">Order: #{purchaseOrderId}</p>
        ) : null}
        <Link to="/bookings" className="gn-btn gn-btn-primary mt-8 block py-3">
          View My Bookings
        </Link>
      </div>
    </div>
  );
}
