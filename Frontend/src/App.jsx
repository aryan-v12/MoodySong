import FaceExpressionDetector from "./components/FaceExpressionDetector";
import MoodSongs from "./components/MoodSongs";
import { useState, useEffect } from "react";
import "./App.css";

function App() {
  const [Songs, setSongs] = useState([]);
  const [isAppReady, setIsAppReady] = useState(false);
  const [isHeaderVisible, setIsHeaderVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [currentMood, setCurrentMood] = useState(null);

  // Simulate app initialization
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsAppReady(true);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  // Handle scroll for header visibility with smooth transitions
  useEffect(() => {
    let ticking = false;

    const handleScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          const currentScrollY = window.scrollY;
          const scrollDifference = Math.abs(currentScrollY - lastScrollY);

          // Only update if there's significant scroll movement
          if (scrollDifference > 5) {
            if (currentScrollY < 20) {
              // Always show header at top
              setIsHeaderVisible(true);
            } else if (currentScrollY > lastScrollY && currentScrollY > 80) {
              // Scrolling down - hide header
              setIsHeaderVisible(false);
            } else if (currentScrollY < lastScrollY) {
              // Scrolling up - show header
              setIsHeaderVisible(true);
            }

            setLastScrollY(currentScrollY);
          }

          ticking = false;
        });

        ticking = true;
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);

  if (!isAppReady) {
    return (
      <div className="app-loading">
        <div className="loading-content">
          <h1 className="text-gradient">MoodDetect</h1>
          <p>Initializing...</p>
          <div className="loading-bar">
            <div className="loading-progress"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="app-container animate-fade-in">
      {/* Header Section */}
      <header
        className={`app-header ${isHeaderVisible ? "visible" : "hidden"}`}
      >
        <div className="header-content">
          <div className="logo-section">
            <h1 className="app-title">
              <span className="text-gradient">MoodDetect</span>
            </h1>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="app-main">
        <div className="content-wrapper">
          {/* Detection Section */}
          <section className="detection-section">
            <div className="section-header">
              <h2>Detect Your Mood</h2>
              <p>Let AI analyze your facial expressions</p>
            </div>
            <FaceExpressionDetector
              setSongs={setSongs}
              setCurrentMood={setCurrentMood}
            />
          </section>

          {/* Songs Section */}
          <section className="songs-section">
            <MoodSongs Songs={Songs} currentMood={currentMood} />
          </section>
        </div>
      </main>

      {/* Footer */}
      <footer className="app-footer">
        <div className="footer-content">
          <p>Made with ❤️ by GhatakOps</p>
        </div>
      </footer>
    </div>
  );
}

export default App;
