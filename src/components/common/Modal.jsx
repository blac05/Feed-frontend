import { useEffect, useRef } from "react";

export default function Modal({ open, onClose, children }) {
  const modalRef = useRef();

  useEffect(() => {
    if (open) {
      // Focus the modal when opened
      modalRef.current?.focus();
    }
  }, [open]);

  if (!open) return null;

  const handleKeyDown = (e) => {
    if (e.key === "Escape") {
      onClose();
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 transition-opacity duration-300"
      onClick={onClose}
      tabIndex={-1}
      onKeyDown={handleKeyDown}
    >
      <div
        ref={modalRef}
        className="bg-white rounded-2xl p-6 max-w-lg w-full focus:outline-none"
        onClick={(e) => e.stopPropagation()}
        tabIndex={0}
      >
        {children}
      </div>
    </div>
  );
}