import { useParams } from "react-router-dom";
import { useState, useEffect, useCallback } from "react";

import {
  getVendor,
  listVendorServices,
} from "@/api/vendorApi";

import { imageUrl } from "@/utils/imageUrl";
import { ServiceCard } from "@/components/ServiceCard";
import { RatingStars } from "@/components/RatingStars";
import { ErrorMessage } from "@/components/ErrorMessage";
import { LoadingSpinner } from "@/components/LoadingSpinner";

export default function SalonDetail() {
  const { slug } = useParams();

  const [vendor, setVendor] = useState(null);
  const [services, setServices] = useState([]);

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchVendor = useCallback(async () => {
    if (!slug) return;

    setIsLoading(true);
    setError(null);

    try {
      const [vendorData, servicesData] = await Promise.all([
        getVendor(slug),
        listVendorServices(slug),
      ]);

      setVendor(vendorData);
      setServices(servicesData ?? []);
    } catch (err) {
      setError(err);
    } finally {
      setIsLoading(false);
    }
  }, [slug]);

  useEffect(() => {
    fetchVendor();
  }, [fetchVendor]);

  if (isLoading) {
    return (
      <LoadingSpinner label="Loading salon details..." />
    );
  }

  if (error) {
    return (
      <ErrorMessage
        error={error}
        onRetry={fetchVendor}
      />
    );
  }

  if (!vendor) {
    return null;
  }

  const businessName =
    vendor.business_name ??
    vendor.store_name ??
    "Beauty Studio";

  const banner = imageUrl(
    vendor.banner_image ?? vendor.image,
  );

  const logo = imageUrl(
    vendor.logo ?? vendor.image,
  );

  return (
    <div>
      {/* Banner */}
      <div className="relative h-64 sm:h-80 w-full bg-ink">
        {banner ? (
          <img
            src={banner}
            alt={businessName}
            className="size-full object-cover opacity-60"
          />
        ) : (
          <div className="size-full bg-secondary" />
        )}
      </div>

      <div className="gn-container py-8">

        {/* Salon Header */}
        <div className="flex flex-col md:flex-row items-start md:items-end justify-between gap-6 -mt-20 relative z-10">

          <div className="flex items-end gap-5">

            {/* Logo */}
            <div className="size-24 sm:size-32 overflow-hidden rounded-3xl border-4 border-background bg-background shadow-xl">
              {logo ? (
                <img
                  src={logo}
                  alt={businessName}
                  className="size-full object-cover"
                />
              ) : (
                <div className="grid size-full place-items-center bg-primary text-primary-foreground font-display text-4xl">
                  {businessName?.[0] ?? "S"}
                </div>
              )}
            </div>

            {/* Name + Rating */}
            <div>
              <h1 className="font-display text-3xl sm:text-5xl text-foreground">
                {businessName}
              </h1>

              <div className="mt-2 flex flex-wrap items-center gap-3">
                <RatingStars
                  rating={vendor.average_rating}
                  count={vendor.review_count}
                />

                {vendor.is_verified ? (
                  <span className="gn-badge bg-primary text-primary-foreground">
                    Verified Studio
                  </span>
                ) : null}
              </div>
            </div>

          </div>
        </div>

        {/* Description */}
        <div className="mt-8 max-w-3xl">
          <h2 className="font-bold text-lg text-foreground">
            About the Studio
          </h2>

          <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
            {vendor.description ||
              "Welcome to our beauty studio! Book your appointments online."}
          </p>

          {/* Location */}
          {(vendor.city || vendor.country) ? (
            <div className="mt-4 flex items-center gap-2 text-sm text-muted-foreground">
              <i
                className="fa-solid fa-location-dot text-primary"
                aria-hidden="true"
              />

              <span>
                {[vendor.city, vendor.country]
                  .filter(Boolean)
                  .join(", ")}
              </span>
            </div>
          ) : null}
        </div>

        {/* Services */}
        <div className="mt-12">

          <div className="flex flex-wrap items-end justify-between gap-3">
            <div>
              <p className="gn-eyebrow text-primary">
                What we offer
              </p>

              <h2 className="font-display text-3xl text-foreground">
                Services Offered
              </h2>
            </div>

            <span className="text-sm text-muted-foreground">
              {services.length}{" "}
              {services.length === 1 ? "service" : "services"}
            </span>
          </div>

          {services.length > 0 ? (
            <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {services.map((service) => (
                <ServiceCard
                  key={String(
                    service.sid ?? service.id,
                  )}
                  service={service}
                />
              ))}
            </div>
          ) : (
            <div className="gn-card mt-6 p-8 text-center">
              <div className="mx-auto grid size-12 place-items-center rounded-full bg-secondary text-muted-foreground">
                <i
                  className="fa-solid fa-spa"
                  aria-hidden="true"
                />
              </div>

              <h3 className="mt-4 font-bold text-foreground">
                No services available
              </h3>

              <p className="mt-1 text-sm text-muted-foreground">
                This studio has not published any services yet.
              </p>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
