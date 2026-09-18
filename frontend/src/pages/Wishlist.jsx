import { useState, useEffect } from "react";
import { listWishlist } from "@/api/wishlistApi";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { DashboardNav } from "@/components/DashboardNav";
import { ServiceCard } from "@/components/ServiceCard";
import { SkeletonGrid } from "@/components/SkeletonCard";
import { ErrorMessage } from "@/components/ErrorMessage";
import { EmptyState } from "@/components/EmptyState";

/**
 * Wishlist Page - Shows user's saved/favorite services
 */
export default function Wishlist() {
  return (
    <ProtectedRoute>
      <WishlistContent />
    </ProtectedRoute>
  );
}

function WishlistContent() {
  const [items, setItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchWishlist = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await listWishlist();
      setItems(data?.results ?? data ?? []);
    } catch (err) {
      setError(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchWishlist();
  }, []);

  return (
    <div className="gn-container py-12">
      <span className="gn-eyebrow text-primary">Saved</span>
      <h1 className="mt-1 font-display text-4xl text-foreground">My Wishlist</h1>

      <div className="mt-6">
        <DashboardNav />
      </div>

      <div className="mt-8">
        {isLoading ? (
          <SkeletonGrid count={3} />
        ) : error ? (
          <ErrorMessage error={error} onRetry={fetchWishlist} />
        ) : items.length > 0 ? (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {items.map((item) => {
              const service = item.service_detail ?? item;
              return <ServiceCard key={String(service.sid ?? item.id)} service={service} />;
            })}
          </div>
        ) : (
          <EmptyState
            title="Your wishlist is empty"
            description="Explore services and tap the heart icon to save your favorite beauty treatments."
            actionLabel="Browse Services"
            actionTo="/services"
          />
        )}
      </div>
    </div>
  );
}
