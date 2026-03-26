import React, { forwardRef } from 'react';
import './Instruction.css';

const Instruction = forwardRef(function Instruction({ visible = true }, ref) {
  if (!visible) return null;

  return (
    <div ref={ref} className="instruction-overlay" aria-hidden="true">
      <p className="instruction-title">Controls</p>
      <div className="instruction-keys">
        <div className="instruction-group">
          <div className="instruction-arrows">
            <span className="key key-up">↑</span>
            <span className="key key-left">←</span>
            <span className="key key-down">↓</span>
            <span className="key key-right">→</span>
          </div>
          <p className="instruction-label">Move</p>
        </div>
        <div className="instruction-group">
          <div className="key key-space">
            <span>SPACE</span>
          </div>
          <p className="instruction-label">Jump</p>
        </div>
        <div className="instruction-group">
          <div className="key-inline-row">
            <span className="key key-small">ENTER</span>
            <span className="key key-small">ESC</span>
          </div>
          <p className="instruction-label">Enter to interact • Esc to exit</p>
        </div>
      </div>
    </div>
  );
});

export default Instruction;