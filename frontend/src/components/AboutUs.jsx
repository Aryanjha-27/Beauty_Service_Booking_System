import appData from "../data/appData";
import "./AboutUs.css";

function AboutUs() {
    return (
        <section id="about-us" className="about-us">
            <div className="section-heading">
                <span className="section-badge about-badge">About Us</span>
                <h2 className="section-title">Who We Are</h2>
                <p className="section-desc">
                    We built Glow Next to make beauty booking effortless, transparent, and delightful.
                </p>
            </div>

            <div className="about-content">
                <div className="about-image-wrap">
                    <img
                        src="https://picsum.photos/seed/aboutglowup/600/750.jpg"
                        alt="About GlowUp"
                    />
                    <div className="about-image-overlay"></div>
                </div>

                <div className="about-text">
                    <h3 className="about-title">
                        Beauty should be easy to
                        <span className="about-title-highlight"> book, </span>
                        not stressful to find.
                    </h3>

                    <p className="about-desc">
                        Glow Next connects you with verified, top-rated beauty professionals in your
                        area. Browse services, compare artists, pick your time, and show up looking
                        your best — no phone tag, no guesswork.
                    </p>

                    <div className="about-stats">
                        {appData.aboutStats.map((stat) => (
                            <div key={stat.label} className="about-stat">
                                <span className="about-stat-number">{stat.number}</span>
                                <span className="about-stat-label">{stat.label}</span>
                            </div>
                        ))}
                    </div>

                    <div className="about-features">
                        {appData.aboutFeatures.map((feat) => (
                            <div key={feat.title} className="about-feature">
                                <div className="about-feature-icon">
                                    <i className={`fas ${feat.icon}`}></i>
                                </div>
                                <div className="about-feature-text">
                                    <h4>{feat.title}</h4>
                                    <p>{feat.desc}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}

export default AboutUs;