import appData from "../data/appData";
import "./Artists.css";

function Stars({ rating }) {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
        if (i <= Math.floor(rating)) {
            stars.push(<i key={i} className="fas fa-star filled"></i>);
        } else if (i - 0.5 <= rating) {
            stars.push(<i key={i} className="fas fa-star-half-alt half"></i>);
        } else {
            stars.push(<i key={i} className="far fa-star empty"></i>);
        }
    }
    return <div className="stars">{stars}</div>;
}

function Artists() {
    return (
        <section id="artists" className="artists">
            <div className="container">
                <div className="section-heading">
                    <span className="section-badge artists-badge">Top Artists</span>
                    <h2 className="section-title">Meet Our Experts</h2>
                    <p className="section-desc">
                        Handpicked professionals who bring your beauty vision to life.
                    </p>
                </div>

                <div className="artists-grid">
                    {appData.artists.map((artist) => (
                        <div key={artist.id} className="artist-card card-hover">
                            <div className="artist-image-wrap">
                                <img
                                    className="artist-image"
                                    src={artist.img}
                                    alt={artist.name}
                                />
                            </div>

                            <div className="artist-info">
                                <div className="artist-top-row">
                                    <h3 className="artist-name">{artist.name}</h3>
                                    <span className="artist-rating-badge">
                                        <i className="fas fa-star"></i>
                                        {artist.rating}
                                    </span>
                                </div>

                                <p className="artist-role">
                                    {artist.role} &middot; {artist.experience}
                                </p>
                                <p className="artist-bio">{artist.bio}</p>

                                <div className="artist-bottom-row">
                                    <Stars rating={artist.rating} />
                                    <span className="artist-reviews">{artist.reviews} reviews</span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}

export default Artists;