'use client';

import { Navbar } from '@/components/Navbar';
import { AuthModal } from '@/components/AuthModal';
import { ReactNode, useState } from 'react';
import AuthModalContext from '@/contexts/AuthModalContext';

export default function PropertyLayout({ children }: { children: ReactNode }) {
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  return (
    <AuthModalContext.Provider value={{ openAuthModal: () => setIsAuthModalOpen(true) }}>
      <Navbar onAuthClick={() => setIsAuthModalOpen(true)} />
      {children}
      <AuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} />
    </AuthModalContext.Provider>
  );
}
