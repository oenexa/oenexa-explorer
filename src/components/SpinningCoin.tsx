import React from 'react';
import './SpinningCoin.css';

export const SpinningCoin: React.FC = () => {
  return (
    <div className="coin-container">
      <div className="coin-3d">
        <div className="coin-face coin-front">
          <div className="coin-inner">
            <span className="coin-symbol">Ø</span>
            <span className="coin-text">OENEXA</span>
          </div>
        </div>
        <div className="coin-face coin-back">
          <div className="coin-inner">
            <span className="coin-symbol">Ø</span>
            <span className="coin-text">OENEXA</span>
          </div>
        </div>
        {/* Edges to give the coin 3D thickness */}
        <div className="coin-edge"></div>
      </div>
    </div>
  );
};
