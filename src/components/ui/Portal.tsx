import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';

interface PortalProps {
  children: React.ReactNode;
}

/**
 * Seluruh modal, overlay, dan dialog wajib dirender melalui React Portal ke document.body
 * dengan z-index tertinggi agar tidak pernah tertimpa canvas 3D atau gagal diklik.
 */
export const Portal: React.FC<PortalProps> = ({ children }) => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted || typeof document === 'undefined') return null;
  return createPortal(children, document.body);
};
