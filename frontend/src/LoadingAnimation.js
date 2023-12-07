// LoadingAnimation.js
import React from 'react';
import './LoadingAnimation.css'; // Create and import the CSS file for this component

// LoadingAnimation.js
// LoadingAnimation.js
const LoadingAnimation = () => {
    return (
      <div className="loading-container">
        <div className="loading-animation">
          <span className="letter" style={{ '--spread': -5 }}>S</span> {/* Move left */}
          <span className="letter" style={{ '--spread': 0 }}>M</span> {/* Stay */}
          <span className="letter" style={{ '--spread': 5 }}>C</span> {/* Move right */}
        </div>
      </div>
    );
  };
  

export default LoadingAnimation;
