import React, { useEffect, useRef } from 'react';
import { useApp } from '../context/AppContext';

export default function Toast() {
  const { toasts, dismissToast } = useApp();

  return (
    <div className="toast-container" aria-live="polite">
      {toasts.map(t => (
        <ToastItem key={t.id} toast={t} onDismiss={dismissToast} />
      ))}
    </div>
  );
}

function ToastItem({ toast, onDismiss }) {
  const ref = useRef(null);

  useEffect(() => {
    requestAnimationFrame(() => {
      if (ref.current) ref.current.classList.add('visible');
    });
  }, []);

  return (
    <div
      ref={ref}
      className={`toast toast-${toast.type}`}
      onClick={() => onDismiss(toast.id)}
      role="alert"
    >
      {toast.message}
    </div>
  );
}
