# Google Analytics Integration

This document describes the Google Analytics (GA4) integration for PGUNCLE.

## Tracking ID
`G-3TXYLMX47G`

## Setup

Google Analytics has been integrated into the application with comprehensive event tracking across all major user interactions.

### Files Modified

1. **app/layout.tsx** - Added GA4 scripts to the root layout
2. **lib/analytics.ts** - Created utility functions for event tracking
3. **All major components** - Added event tracking calls

## Tracked Events

### Property Events
- `view_property` - When a user views a property card
- `view_property_details` - When a user clicks to see property details
- `filter_properties` - When filters are applied (city, type, etc.)

### Booking Events
- `open_booking_modal` - When booking modal is opened
- `initiate_booking` - When user starts the booking process
- `complete_booking` - When booking is successfully completed
- `cancel_booking` - When user cancels/dismisses booking

### Visit Scheduling Events
- `open_visit_modal` - When visit scheduling modal is opened
- `schedule_visit` - When a visit is successfully scheduled

### Payment Events
- `initiate_payment` - When payment process starts
- `payment_success` - When payment is completed successfully
- `payment_failed` - When payment fails

### Contact Events
- `open_contact_form` - When contact form is accessed
- `submit_contact_form` - When contact form is submitted

### Authentication Events
- `open_auth_modal` - When login/signup modal is opened
- `login` - When user logs in (email or Google)
- `signup` - When user signs up (email or Google)
- `logout` - When user logs out

### Navigation Events
- `click_nav_link` - When navigation links are clicked
- `click_cta` - When call-to-action buttons are clicked

### Error Events
- `error` - When errors occur (with error type and message)

## Usage

### In Components

```typescript
import { analytics } from '@/lib/analytics';

// Track a property view
analytics.viewProperty(propertyId, propertyName);

// Track a booking
analytics.completeBooking(propertyId, roomType, amount, paymentId);

// Track custom events
analytics.trackEvent('custom_action', 'Category', 'Label', value);
```

### Viewing Analytics

1. Go to [Google Analytics](https://analytics.google.com/)
2. Select the PGUNCLE property
3. Navigate to Reports > Events to see all tracked events
4. Use the Realtime view to see events as they happen

## Event Parameters

Most events include relevant parameters:
- **Property events**: propertyId, propertyName
- **Booking events**: propertyId, roomType, amount
- **Payment events**: amount, paymentId
- **Filter events**: filterType, filterValue

## Best Practices

1. Events are only tracked in production (when gtag is available)
2. All events include meaningful labels for better analysis
3. Monetary values are tracked for conversion analysis
4. Error events help identify issues users face

## Testing

To test analytics in development:
1. Open browser DevTools
2. Go to Network tab
3. Filter by "google-analytics" or "gtag"
4. Perform actions and verify events are sent

## Privacy

- No personally identifiable information (PII) is tracked
- User emails and names are not sent to GA
- Only anonymous usage patterns are tracked
