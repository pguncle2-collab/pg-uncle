#!/bin/bash

# Email Setup Installation Script for PGUNCLE

echo "📧 Installing Email Dependencies..."
echo ""

# Install nodemailer
npm install nodemailer
npm install --save-dev @types/nodemailer

echo ""
echo "✅ Installation Complete!"
echo ""
echo "📝 Next Steps:"
echo "1. Add SMTP credentials to .env.local (see EMAIL_SETUP_GUIDE.md)"
echo "2. Restart your development server: npm run dev"
echo "3. Test the contact form at http://localhost:3000/contact"
echo ""
echo "📧 Emails will be sent to: info@pguncle.com"
echo ""
