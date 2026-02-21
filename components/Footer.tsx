import React from 'react';
import Image from 'next/image';

export const Footer: React.FC = () => {
  const footerLinks = [
    { title: 'About', href: '/about' },
    { title: 'Services', href: '/services' },
    { title: 'Contact', href: '/contact' },
  ];

  const socialLinks = [
    { icon: '📘', name: 'Facebook', href: '#' },
    { icon: '📷', name: 'Instagram', href: '#' },
    { icon: '🐦', name: 'Twitter', href: '#' },
    { icon: '💼', name: 'LinkedIn', href: '#' },
  ];

  return (
    <footer className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 py-16 lg:py-20 relative overflow-hidden">
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-0 left-0 w-96 h-96 bg-blue-500 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-purple-500 rounded-full blur-3xl" />
      </div>
      
      <div className="container mx-auto px-5 md:px-6 relative z-10">
        <div className="flex flex-col lg:flex-row items-start lg:justify-between gap-12 mb-12">
          <div className="flex flex-col gap-6 items-start max-w-md">
            <div className="relative w-32 h-20 transition-transform hover:scale-110">
              <Image
                src="/logo.png"
                alt="PGUncle Logo"
                fill
                className="object-contain"
                priority
              />
            </div>
            <p className="text-gray-400 leading-relaxed">
              Your trusted partner in finding the perfect PG accommodation in Tricity, Chandigarh. 
              Comfortable living, verified properties, and hassle-free booking.
            </p>
            <div className="flex gap-3">
              {socialLinks.map((social, index) => (
                <a
                  key={index}
                  href={social.href}
                  className="w-10 h-10 bg-white/10 hover:bg-white/20 rounded-lg flex items-center justify-center text-xl transition-all duration-300 hover:scale-110"
                  aria-label={social.name}
                >
                  {social.icon}
                </a>
              ))}
            </div>
          </div>
          
          <div>
            <h3 className="text-white font-bold mb-4">Quick Links</h3>
            <ul className="space-y-3">
              {footerLinks.map((link, index) => (
                <li key={index}>
                  <a
                    href={link.href}
                    className="text-gray-400 hover:text-white transition-colors duration-300 flex items-center gap-2 group"
                  >
                    <span className="w-0 group-hover:w-2 h-0.5 bg-blue-400 transition-all duration-300" />
                    {link.title}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
        
        <div className="pt-8 border-t border-white/10 text-center">
          <p className="text-gray-400 text-sm">
            © 2026 PGUNCLE. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};
