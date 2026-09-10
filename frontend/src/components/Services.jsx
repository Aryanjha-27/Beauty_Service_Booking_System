import { useEffect, useState } from "react";
import "./Services.css";

const DJANGO_URL = "http://127.0.0.1:8000";

function Services() {
  // Stores services received from Django
  const [services, setServices] = useState([]);

  // Shows loading message while API is being called
  const [loading, setLoading] = useState(true);

  // Stores API errors
  const [error, setError] = useState("");

  useEffect(() => {
    // Request services from Django
    fetch(`${DJANGO_URL}/api/services/`)
      .then((response) => {
        if (!response.ok) {
          throw new Error(`Services API returned ${response.status}`);
        }
        return response.json();
      })

      // Store the services in React state
      .then((data) => {
        setServices(data);
        setLoading(false);
      })

      // Handle connection/API errors
      .catch((error) => {
        console.error("Services API Error:", error);
        setError("Unable to load services.");
        setLoading(false);
      });
  }, []);

  // Show loading message while waiting for Django
  if (loading) {
    return (
      <section id="services" className="services">
        <div className="container">
          <p>Loading services...</p>
        </div>
      </section>
    );
  }

  // Show error if API request failed
  if (error) {
    return (
      <section id="services" className="services">
        <div className="container">
          <p>{error}</p>
        </div>
      </section>
    );
  }

  function mediaUrl(path) {
    return path ? `${DJANGO_URL}${path}` : "";
  }

  return (
    <section id="services" className="services">
      <div className="container">
        <div className="section-heading">
          <span className="section-badge services-badge">Our Services</span>

          <h2 className="section-title">Crafted for Your Glow</h2>

          <p className="section-desc">
            From head to toe, find every beauty service you need with
            customizable options.
          </p>
        </div>

        <div className="services-grid">
          {services.map((service) => (
            <div key={service.sid} className="service-card card-hover">
              <div className="service-icon">
                <img
                  src={mediaUrl(service.thumbnail)}
                  alt={service.thumbnail}
                />
              </div>

              <span className="service-category">
                {service.category_name || "Beauty"}
              </span>

              <h3 className="service-name">{service.title}</h3>

              <div
                className="service-description"
                dangerouslySetInnerHTML={{ __html: service.description }}
              />

              <div className="service-footer">
                <div className="service-price">
                  <span className="discounted-price">
                    Rs. {service.effective_price}
                  </span>

                  {service.discount_price &&
                    service.discount_price < service.price && (
                      <span className="original-price">
                        Rs. {service.price}
                      </span>
                    )}
                </div>

                <span className="service-rating">
                  ★ {service.average_rating || "New"}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Display this when Django returns no services */}
        {services.length === 0 && <p>No services available yet.</p>}
      </div>
    </section>
  );
}

export default Services;
