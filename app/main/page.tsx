'use client';

import React, { useState } from 'react';
import { Navbar } from '@/components/Navbar';
import { AuthModal } from '@/components/AuthModal';
import { Hero } from '@/components/Hero';
import { Features } from '@/components/Features';
import { Properties } from '@/components/Properties';
import { Testimonials } from '@/components/Testimonials';
import { Pricing } from '@/components/Pricing';
import { FAQ } from '@/components/FAQ';
import { Contact } from '@/components/Contact';
import { Footer } from '@/components/Footer';

export default function Home() {
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  return (
    <>
      <Navbar onAuthClick={() => setIsAuthModalOpen(true)} />
      <main className="min-h-screen">
        <Hero onAuthClick={() => setIsAuthModalOpen(true)} />
        <Features />
        <Properties />
        <Testimonials />
        <Pricing />
        <FAQ />
        <Contact />
        <Footer />
      </main>
      <AuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} />
    </>
  );
}
