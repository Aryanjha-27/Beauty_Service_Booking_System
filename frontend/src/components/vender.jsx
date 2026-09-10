import { useEffect, useState } from "react";
import "./Vender.css";

const DJANGO_URL = "http://127.0.0.1:8000";
const DEFAULT_VENDOR_IMAGE = `${DJANGO_URL}/media/category/client-doing-hair-cut-barber-shop-salon_1303-20861.avif`;

function Vender() {
    const [vendors, setVendors] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        fetch(`${DJANGO_URL}/api/vendors/`)
            .then((response) => {
                if (!response.ok) {
                    throw new Error(`Vendors API returned ${response.status}`);
                }
                return response.json();
            })
            .then(setVendors)
            .catch((requestError) => {
                console.error("Vendors API Error:", requestError);
                setError("Unable to load vendors.");
            })
            .finally(() => setLoading(false));
    }, []);

    function mediaUrl(path) {
        return path ? `${DJANGO_URL}${path}` : "";
    }

    function handleImageError(event, vendor) {
        const profileImage = vendor.user?.profile?.image;
        const profileImageUrl = profileImage && !profileImage.endsWith("default-user.jpeg")
            ? mediaUrl(profileImage)
            : "";

        if (profileImageUrl && event.currentSrc !== profileImageUrl) {
            event.currentTarget.src = profileImageUrl;
            return;
        }

        if (event.currentSrc === DEFAULT_VENDOR_IMAGE) {
            event.currentTarget.onerror = null;
            return;
        }

        event.currentTarget.src = DEFAULT_VENDOR_IMAGE;
    }

    return (
        <section id="vender" className="vender">
            <div className="container">
                <div className="section-heading">
                    <span className="section-badge vender-badge">Vender</span>
                    <h2 className="section-title">Our Venders</h2>
                    <p className="section-desc">
                        We collaborate with top-notch vendors to ensure the best quality and service for our clients.
                    </p>
                </div>

                {loading && <p>Loading vendors...</p>}
                {error && <p>{error}</p>}

                {!loading && !error && vendors.length > 0 && (
                    <div className="vender-grid">
                        {vendors.map((vendor) => (
                            <article key={vendor.id} className="vender-card card-hover">
                                <div className="vender-image-wrap">
                                    <img
                                        className="vender-image"
                                        src={mediaUrl(vendor.image)}
                                        alt={vendor.store_name || "Verified vendor"}
                                        onError={(event) => handleImageError(event, vendor)}
                                    />
                                </div>
                                <div className="vender-info">
                                    <h3 className="vender-name">{vendor.store_name || "GlowNext vendor"}</h3>
                                    <p className="vender-location">
                                        <i className="fas fa-location-dot" aria-hidden="true"></i>{" "}
                                        {[vendor.city, vendor.country].filter(Boolean).join(", ") || "GlowNext"}
                                    </p>
                                    <p className="vender-description">
                                        {vendor.description || "Professional beauty services from a verified GlowNext vendor."}
                                    </p>
                                    <span className="vender-status">Verified vendor</span>
                                </div>
                            </article>
                        ))}
                    </div>
                )}

                {!loading && !error && vendors.length === 0 && <p>No verified vendors available yet.</p>}
            </div>
        </section>

    );
}

export default Vender;