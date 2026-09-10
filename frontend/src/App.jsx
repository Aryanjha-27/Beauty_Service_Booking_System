import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import AboutUs from "./components/AboutUs";
import Services from "./components/Services";
import Vender from "./components/vender";
import HowItWorks from "./components/HowItWorks";
import Footer from "./components/Footer";

import "./App.css";


function App() {

  return (

    <div className="app-root">

      {/* Navigation bar */}
      <Navbar />

      {/* Homepage hero section */}
      <Hero />

      {/* About GlowNext */}
      <AboutUs />

      {/* Services loaded from Django API */}
      <Services />

      {/* Verified vendors loaded from Django API */}
      <Vender />

      {/* How GlowNext works */}
      <HowItWorks />

      {/* Footer */}
      <Footer />

    </div>

  );
}


export default App;