// Google Analytics utility functions
// Tracking ID: G-3TXYLMX47G

declare global {
  interface Window {
    gtag: (
      command: 'config' | 'event' | 'js',
      targetId: string | Date,
      config?: Record<string, any>
    ) => void;
    dataLayer: any[];
  }
}

// Track page views
export const trackPageView = (url: string) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('config', 'G-3TXYLMX47G', {
      page_path: url,
    });
  }
};

// Track custom events
export const trackEvent = (
  action: string,
  category: string,
  label?: string,
  value?: number
) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', action, {
      event_category: category,
      event_label: label,
      value: value,
    });
  }
};

// Specific event tracking functions
export const analytics = {
  // Property Events
  viewProperty: (propertyId: string, propertyName: string) => {
    trackEvent('view_property', 'Property', `${propertyName} (${propertyId})`);
  },

  viewPropertyDetails: (propertyId: string, propertyName: string) => {
    trackEvent('view_property_details', 'Property', `${propertyName} (${propertyId})`);
  },

  filterProperties: (filterType: string, filterValue: string) => {
    trackEvent('filter_properties', 'Property', `${filterType}: ${filterValue}`);
  },

  // Booking Events
  openBookingModal: (propertyId: string, roomType: string, price: number) => {
    trackEvent('open_booking_modal', 'Booking', `${propertyId} - ${roomType}`, price);
  },

  initiateBooking: (propertyId: string, roomType: string, amount: number) => {
    trackEvent('initiate_booking', 'Booking', `${propertyId} - ${roomType}`, amount);
  },

  completeBooking: (propertyId: string, roomType: string, amount: number, paymentId: string) => {
    trackEvent('complete_booking', 'Booking', `${propertyId} - ${roomType} - ${paymentId}`, amount);
  },

  cancelBooking: (propertyId: string, roomType: string) => {
    trackEvent('cancel_booking', 'Booking', `${propertyId} - ${roomType}`);
  },

  // Visit Scheduling Events
  openVisitModal: (propertyId: string, propertyName: string) => {
    trackEvent('open_visit_modal', 'Visit', `${propertyName} (${propertyId})`);
  },

  scheduleVisit: (propertyId: string, propertyName: string, visitDate: string) => {
    trackEvent('schedule_visit', 'Visit', `${propertyName} - ${visitDate}`);
  },

  // Payment Events
  initiatePayment: (amount: number, propertyId: string) => {
    trackEvent('initiate_payment', 'Payment', propertyId, amount);
  },

  paymentSuccess: (amount: number, paymentId: string) => {
    trackEvent('payment_success', 'Payment', paymentId, amount);
  },

  paymentFailed: (amount: number, reason: string) => {
    trackEvent('payment_failed', 'Payment', reason, amount);
  },

  // Contact Events
  openContactForm: () => {
    trackEvent('open_contact_form', 'Contact', 'Contact Form Opened');
  },

  submitContactForm: (subject: string) => {
    trackEvent('submit_contact_form', 'Contact', subject);
  },

  // Auth Events
  openAuthModal: (mode: 'login' | 'signup') => {
    trackEvent('open_auth_modal', 'Auth', mode);
  },

  login: (method: 'email' | 'google') => {
    trackEvent('login', 'Auth', method);
  },

  signup: (method: 'email' | 'google') => {
    trackEvent('signup', 'Auth', method);
  },

  logout: () => {
    trackEvent('logout', 'Auth', 'User Logged Out');
  },

  // Navigation Events
  clickNavLink: (linkName: string) => {
    trackEvent('click_nav_link', 'Navigation', linkName);
  },

  clickCTA: (ctaName: string, location: string) => {
    trackEvent('click_cta', 'CTA', `${ctaName} - ${location}`);
  },

  // Search Events
  search: (query: string, resultsCount: number) => {
    trackEvent('search', 'Search', query, resultsCount);
  },

  // Social Events
  clickWhatsApp: (location: string) => {
    trackEvent('click_whatsapp', 'Social', location);
  },

  clickSocialLink: (platform: string) => {
    trackEvent('click_social_link', 'Social', platform);
  },

  // Error Events
  error: (errorType: string, errorMessage: string) => {
    trackEvent('error', 'Error', `${errorType}: ${errorMessage}`);
  },
};
