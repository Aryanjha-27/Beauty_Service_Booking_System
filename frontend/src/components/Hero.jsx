import "./Hero.css";

const AVATARS = ["face1", "face2", "face3", "face4"];

function Hero() {
    return (
        <section id="home" className="hero">
            <div className="hero-blob hero-blob--rose"></div>
            <div className="hero-blob hero-blob--gold"></div>

            <div className="hero-grid">
                <div className="hero-text">

                    <h1 className="hero-title">
                        Your Beauty,
                        <br />
                        <span className="hero-title-accent">Booked</span> Perfectly
                    </h1>

                    <p className="hero-desc">
                        Discover top-rated beauty artists, customize your services, and book
                        appointments effortlessly. Your glow-up starts here.
                    </p>

                    <div className="hero-actions">
                        <button className="btn-primary">
                            <i className="fas fa-calendar-check" style={{ marginRight: "8px" }}></i>
                            Book Now
                        </button>
                        <button className="btn-outline">Explore Services</button>
                    </div>

                    <div className="hero-social-proof">
                        <div className="hero-avatars">
                            {AVATARS.map((seed, i) => (
                                <img
                                    key={i}
                                    className="hero-avatar"
                                    src={`https://picsum.photos/seed/${seed}/40/40.jpg`}
                                    alt=""
                                />
                            ))}
                        </div>
                        <div>
                            <div className="hero-stars">
                                <i className="fas fa-star"></i>
                                <i className="fas fa-star"></i>
                                <i className="fas fa-star"></i>
                                <i className="fas fa-star"></i>
                                <i className="fas fa-star-half-alt"></i>
                            </div>
                            <p className="hero-social-text">Loved by 12,000+ clients</p>
                        </div>
                    </div>
                </div>

                <div className="hero-image-side">
                    <div className="hero-image-wrap">
                        <img
                            src="https://picsum.photos/seed/beautyhero/600/750.jpg"
                            alt="Beauty Service"
                        />
                        <div className="hero-image-overlay"></div>
                    </div>
                </div>
            </div>
        </section>
    );
}

export default Hero;