# PGUNCLE - PG Accommodation Website

A modern, fully responsive React + Next.js + TypeScript + Tailwind CSS website for PG (Paying Guest) accommodations in Chandigarh.

## 🚀 Features

### Pages
- ✅ **Homepage** - Complete landing page with all sections
- ✅ **Auth Page** - Unified login/signup with tab switching
- ✅ **Properties Section** - Browse and filter PG accommodations

### Homepage Sections
- ✅ **Navbar** - Sticky navigation with scroll effects
- ✅ **Hero Section** - Full-screen hero with animated background and stats
- ✅ **Features Section** - 4 feature cards with images and hover effects
- ✅ **Properties Section** - Filterable property listings by city and type
- ✅ **Testimonials** - Customer reviews with ratings and avatars
- ✅ **Pricing Plans** - 3-tier pricing with popular badge
- ✅ **FAQ Section** - Accordion-style FAQs with smooth animations
- ✅ **Contact Form** - Modern form with floating labels
- ✅ **Footer** - Comprehensive footer with social links

### Properties Features
- 🏠 **6 Sample Properties** across different cities
- 🔍 **City Filter** - Chandigarh, Mohali, Panchkula, Zirakpur
- 🛏️ **Type Filter** - Single, Double, Triple sharing
- ⭐ **Ratings & Reviews** - Display property ratings
- 💰 **Price Display** - Monthly rent with currency
- 🏷️ **Amenities Tags** - Wi-Fi, AC, Meals, Gym, etc.
- 📍 **Location Info** - Sector and city details
- ✅ **Availability Status** - Shows if property is available

### Authentication
- 🔄 **Unified Auth Page** - Single page with login/signup tabs
- 📧 **Email/Password Login** - Traditional authentication
- 🔐 **Secure Signup** - Password confirmation validation
- 🌐 **Social Login** - Google and Facebook integration (UI ready)
- 🔒 **Remember Me** - Persistent login option
- 🔑 **Forgot Password** - Password recovery link
- 🎨 **Consistent Theme** - Yellow/Orange gradient design
- ✨ **Smooth Tab Switching** - Animated transitions between forms

### Design Features
- 🎨 Modern glassmorphism effects
- ✨ Smooth hover animations and transitions
- 📱 Fully responsive design
- 🎭 Gradient backgrounds and blur effects
- 🖼️ Optimized Next.js Image components
- 🎯 Accessibility-friendly
- ⚡ Performance optimized
- 🔗 Smooth scroll navigation

## 📁 Project Structure

```
app/
├── page.tsx             # Homepage
├── auth/
│   └── page.tsx        # Unified login/signup page
├── layout.tsx          # Root layout with navbar
└── globals.css         # Global styles

components/
├── Navbar.tsx          # Sticky navigation bar
├── Hero.tsx            # Hero section
├── Features.tsx        # Feature cards
├── Properties.tsx      # Property listings with filters
├── Testimonials.tsx    # Customer testimonials
├── Pricing.tsx         # Pricing tiers
├── FAQ.tsx            # Accordion FAQ
├── Contact.tsx        # Contact form
└── Footer.tsx         # Footer section
```

## 🎨 Component Highlights

### Navbar
- Sticky navigation with scroll detection
- Transparent on top, solid when scrolled
- Mobile responsive menu
- Login/Signup buttons
- Smooth scroll to sections

### Properties Section
- **City Filters**: All, Chandigarh, Mohali, Panchkula, Zirakpur
- **Type Filters**: All, Single, Double, Triple sharing
- **Property Cards** with:
  - High-quality images with hover zoom
  - Rating and review count
  - Location with map icon
  - Amenities tags
  - Price per month
  - Availability status
  - "View Details" CTA button
- **Empty State**: Shows when no properties match filters

### Auth Page
- **Tabbed Interface** with smooth transitions
- **Login Tab**:
  - Email/Password fields
  - Remember me checkbox
  - Forgot password link
  - Social login buttons
- **Signup Tab**:
  - Name, Email, Phone fields
  - Password with confirmation
  - Terms & conditions checkbox
  - Social signup buttons
- **Right Side**: Promotional content that changes based on active tab
- **Consistent Theme**: Yellow/Orange gradient matching homepage

## 🚀 Getting Started

### Install Dependencies
```bash
npm install
```

### Run Development Server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Build for Production
```bash
npm run build
```

### Start Production Server
```bash
npm start
```

## 🛠️ Technologies Used

- **Next.js 14** - React framework with App Router
- **TypeScript** - Type safety
- **Tailwind CSS** - Utility-first CSS
- **React Hooks** - State management
- **Next.js Image** - Optimized images
- **Next.js Link** - Client-side navigation

## 🎯 Key Features

- ⚡ Fast page loads with Next.js optimization
- 📱 Mobile-first responsive design
- 🎨 Modern UI with smooth animations
- ♿ Accessibility compliant
- 🔍 SEO optimized
- 🎭 Custom animations and transitions
- 🖼️ Optimized image loading
- 🔗 Smooth scroll navigation
- 🔐 Authentication pages ready
- 🏠 Property filtering system

## 📝 Routes

- `/` - Homepage
- `/auth` - Unified login/signup page
- `/#properties` - Properties section (scroll)
- `/#pricing` - Pricing section (scroll)
- `/#contact` - Contact section (scroll)

## 🎨 Customization

All components are modular and easy to customize:

- Update colors in Tailwind config
- Modify content in component files
- Add/remove sections as needed
- Customize animations in globals.css
- Add more properties to the array
- Extend filter options

## 🌐 Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## 📄 License

This project is built for demonstration purposes.
