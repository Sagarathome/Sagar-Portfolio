import React, { forwardRef } from 'react';
import './Dialog.css';

const Dialog = forwardRef(function Dialog({ message }, ref) {
  if (!message) return null;
  return (
    <div ref={ref} className="player-dialog" role="status" aria-live="polite">
      {message}
    </div>
  );
});

export default Dialog;
