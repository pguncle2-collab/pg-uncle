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

// Check if gtag is available
const isGtagAvailable = (): boolean => {
  return typeof window !== 'undefined' && typeof window.gtag === 'function';
};

// Wait for gtag to be available
const waitForGtag = (maxAttempts = 10): Promise<boolean> => {
  return new Promise((resolve) => {
    let attempts = 0;
    const checkGtag = () => {
      if (isGtagAvailable()) {
        resolve(true);
        return;
      }
      attempts++;
      if (attempts >= maxAttempts) {
        console.warn('Google Analytics (gtag) not available after', maxAttempts, 'attempts');
        resolve(false);
        return;
      }
      setTimeout(checkGtag, 100);
    };
    checkGtag();
  });
};

// Track page views
export const trackPageView = async (url: string) => {
  const available = await waitForGtag();
  if (available && window.gtag) {
    console.log('[Analytics] Page view:', url);
    window.gtag('config', 'G-3TXYLMX47G', {
      page_path: url,
    });
  }
};

// Track custom events
export const trackEvent = async (
  action: string,
  category: string,
  label?: string,
  value?: number
) => {
  const available = await waitForGtag();
  if (available && window.gtag) {
    console.log('[Analytics] Event:', { action, category, label, value });
    window.gtag('event', action, {
      event_category: category,
      event_label: label,
      value: value,
    });
  } else {
    console.warn('[Analytics] Event not sent (gtag unavailable):', { action, category, label, value });
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
