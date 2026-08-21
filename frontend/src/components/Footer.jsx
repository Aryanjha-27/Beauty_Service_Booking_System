import "./Footer.css";

const SERVICE_LINKS = ["Hair Styling", "Makeup Artistry", "Nail Care", "Skin Treatments", "Massage Therapy"];
const COMPANY_LINKS = ["About Us", "Careers", "Blog", "Press", "Contact"];
const SOCIAL_ICONS = ["fab fa-instagram", "fab fa-tiktok", "fab fa-pinterest", "fab fa-twitter"];

function Footer() {
    return (
        <footer id="contact" className="footer">
            <div className="footer-grid">
                {/* Brand column */}
                <div>
                    <div className="footer-brand-logo">
                        <div className="footer-brand-icon">
                            <i className="fas fa-spa"></i>
                        </div>
                        <span className="footer-brand-name">Glow Next</span>
                    </div>
                    <p className="footer-brand-desc">
                        Your premier beauty booking platform. Connect with top artists and look your best,
                        every day.
                    </p>
                </div>

                {/* Services column */}
                <div>
                    <h4 className="footer-column-title">Services</h4>
                    <ul className="footer-links">
                        {SERVICE_LINKS.map((item) => (
                            <li key={item}>{item}</li>
                        ))}
                    </ul>
                </div>

                {/* Company column */}
                <div>
                    <h4 className="footer-column-title">Company</h4>
                    <ul className="footer-links">
                        {COMPANY_LINKS.map((item) => (
                            <li key={item}>{item}</li>
                        ))}
                    </ul>
                </div>

                {/* Newsletter column */}
                <div>
                    <h4 className="footer-column-title">Stay Connected</h4>
                    <p className="footer-newsletter-text">
                        Get beauty tips and exclusive offers.
                    </p>
                    <div className="footer-newsletter-form">
                        <input
                            type="email"
                            className="footer-newsletter-input"
                            placeholder="Your email"
                        />
                        <button className="footer-newsletter-btn" aria-label="Subscribe">
                            <i className="fas fa-arrow-right"></i>
                        </button>
                    </div>
                    <div className="footer-socials">
                        {SOCIAL_ICONS.map((icon, i) => (
                            <a key={i} href="#" className="footer-social-link" aria-label="Social link">
                                <i className={icon}></i>
                            </a>
                        ))}
                    </div>
                </div>
            </div>

            <div className="footer-bottom">
                2025 Glow Next. All rights reserved. Crafted with{" "}
                <i className="fas fa-heart heart"></i> for beauty lovers.
            </div>
        </footer>
    );
}

export default Footer;