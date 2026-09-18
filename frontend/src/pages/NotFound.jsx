import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <div className="gn-container py-24 text-center">
      <div className="gn-card mx-auto max-w-md p-10 border border-border">
        <p className="font-display text-7xl text-primary">404</p>
        <h1 className="mt-4 font-display text-3xl text-foreground">Page Not Found</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          The page you are looking for doesn't exist or has been moved.
        </p>
        <div className="mt-8 flex justify-center gap-3">
          <Link to="/" className="gn-btn gn-btn-primary">
            Back to Home
          </Link>
          <Link to="/services" className="gn-btn gn-btn-outline">
            Browse Services
          </Link>
        </div>
      </div>
    </div>
  );
}
