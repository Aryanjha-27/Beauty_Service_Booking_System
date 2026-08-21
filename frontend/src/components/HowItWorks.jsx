import appData from "../data/appData";
import "./HowItWorks.css";

function HowItWorks() {
  return (
    <section id="how-it-works" className="how-it-works">
      <div className="container-narrow">
        <div className="section-heading">
          <span className="section-badge how-badge">Simple Process</span>
          <h2 className="section-title">How It Works</h2>
        </div>

        <div className="steps-grid">
          {appData.howItWorks.map((step, index) => (
            <div key={step.title} className="step-card">
              <div className={`step-icon step-icon--${index + 1}`}>
                <i className={`fas ${step.icon}`}></i>
              </div>
              <h3 className="step-title">{step.title}</h3>
              <p className="step-desc">{step.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default HowItWorks;