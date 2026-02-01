import React from 'react';

export const Footer: React.FC = () => {
  const footerLinks = [
    { title: 'About', href: '#' },
    { title: 'Services', href: '#' },
    { title: 'Contact', href: '#' },
    { title: 'Privacy', href: '#' },
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
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center text-2xl">
                🏠
              </div>
              <h2 className="text-3xl font-bold text-white">pgUncle</h2>
            </div>
            <p className="text-gray-400 leading-relaxed">
              Your trusted partner in finding the perfect PG accommodation in Chandigarh. 
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
          
          <div className="flex flex-col lg:flex-row gap-12 lg:gap-20">
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
            
            <div>
              <h3 className="text-white font-bold mb-4">Newsletter</h3>
              <p className="text-gray-400 mb-4 max-w-xs">
                Subscribe to get updates on new PG listings and special offers.
              </p>
              <div className="flex gap-2">
                <input
                  type="email"
                  placeholder="Your email"
                  className="px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-blue-400 transition-colors"
                />
                <button className="px-4 py-2 bg-gradient-to-r from-blue-500 to-cyan-500 text-gray-900 rounded-lg font-semibold hover:from-blue-600 hover:to-cyan-600 transition-all duration-300">
                  →
                </button>
              </div>
            </div>
          </div>
        </div>
        
        <div className="pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-gray-400 text-sm">
            © 2024 pgUncle. All rights reserved.
          </p>
          <p className="text-gray-400 text-sm">
            <span>Made with </span>
            <a
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-400 hover:text-blue-300 transition-colors"
              href="https://durable.co"
            >
              Durable
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
};
