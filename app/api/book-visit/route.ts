import { NextRequest, NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, phone, visitDate, visitTime, message, propertyId, propertyName } = body;

    // Validate required fields
    if (!name || !email || !phone || !visitDate || !visitTime || !propertyName) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Invalid email address' },
        { status: 400 }
      );
    }

    // Log the visit request
    console.log('Visit Booking Request:', {
      name,
      email,
      phone,
      visitDate,
      visitTime,
      propertyName,
      propertyId,
      timestamp: new Date().toISOString()
    });

    // Send email notification
    try {
      // Check if SMTP is configured
      if (!process.env.SMTP_HOST || !process.env.SMTP_USER || !process.env.SMTP_PASS) {
        console.warn('⚠️ SMTP not configured. Visit request logged but email not sent.');
        console.log('Visit data saved to console:', { name, email, phone, visitDate, visitTime, propertyName });
        
        // Still return success to user
        return NextResponse.json(
          { 
            success: true,
            message: 'Visit scheduled successfully! We will contact you shortly.' 
          },
          { status: 200 }
        );
      }

      const transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: parseInt(process.env.SMTP_PORT || '587'),
        secure: process.env.SMTP_PORT === '465',
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASS,
        },
      });

      // Format date for display
      const formattedDate = new Date(visitDate).toLocaleDateString('en-IN', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });

      // Send email to admin
      await transporter.sendMail({
        from: process.env.SMTP_FROM || process.env.SMTP_USER,
        to: process.env.ADMIN_EMAIL || process.env.SMTP_USER,
        replyTo: email,
        subject: `🏠 New Visit Request: ${propertyName}`,
        html: `
          <!DOCTYPE html>
          <html>
          <head>
            <style>
              body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
              .container { max-width: 600px; margin: 0 auto; padding: 20px; }
              .header { background: linear-gradient(135deg, #3b82f6 0%, #06b6d4 100%); color: white; padding: 30px; border-radius: 10px 10px 0 0; text-align: center; }
              .content { background: #f9fafb; padding: 30px; border: 1px solid #e5e7eb; }
              .field { margin-bottom: 20px; }
              .label { font-weight: bold; color: #1f2937; margin-bottom: 5px; display: block; }
              .value { color: #4b5563; padding: 12px; background: white; border-radius: 8px; border: 1px solid #e5e7eb; }
              .highlight { background: #dbeafe; border: 2px solid #3b82f6; padding: 15px; border-radius: 8px; margin: 20px 0; }
              .footer { background: #1f2937; color: #9ca3af; padding: 20px; text-align: center; border-radius: 0 0 10px 10px; font-size: 12px; }
              .button { display: inline-block; padding: 12px 24px; background: #3b82f6; color: white; text-decoration: none; border-radius: 8px; margin: 10px 0; }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="header">
                <h1 style="margin: 0; font-size: 28px;">🏠 New Property Visit Request</h1>
                <p style="margin: 10px 0 0 0; opacity: 0.9; font-size: 16px;">PGUNCLE - Property Visit Booking</p>
              </div>
              <div class="content">
                <div class="highlight">
                  <h2 style="margin: 0 0 10px 0; color: #1f2937;">📍 Property Details</h2>
                  <div class="value" style="font-size: 18px; font-weight: bold; color: #3b82f6;">
                    ${propertyName}
                  </div>
                  ${propertyId ? `<div style="margin-top: 5px; font-size: 12px; color: #6b7280;">Property ID: ${propertyId}</div>` : ''}
                </div>

                <div class="field">
                  <div class="label">👤 Visitor Name:</div>
                  <div class="value">${name}</div>
                </div>

                <div class="field">
                  <div class="label">📧 Email:</div>
                  <div class="value"><a href="mailto:${email}" style="color: #3b82f6;">${email}</a></div>
                </div>

                <div class="field">
                  <div class="label">📱 Phone:</div>
                  <div class="value"><a href="tel:${phone}" style="color: #3b82f6;">${phone}</a></div>
                </div>

                <div class="highlight">
                  <h3 style="margin: 0 0 15px 0; color: #1f2937;">📅 Visit Schedule</h3>
                  <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px;">
                    <div>
                      <div class="label">Date:</div>
                      <div class="value" style="font-weight: bold;">${formattedDate}</div>
                    </div>
                    <div>
                      <div class="label">Time:</div>
                      <div class="value" style="font-weight: bold;">${visitTime}</div>
                    </div>
                  </div>
                </div>

                ${message ? `
                <div class="field">
                  <div class="label">💬 Additional Message:</div>
                  <div class="value">${message.replace(/\n/g, '<br>')}</div>
                </div>
                ` : ''}

                <div class="field">
                  <div class="label">🕐 Request Received:</div>
                  <div class="value">${new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })}</div>
                </div>

                <div style="margin-top: 30px; padding: 20px; background: #fef3c7; border: 2px solid #f59e0b; border-radius: 8px;">
                  <p style="margin: 0; font-weight: bold; color: #92400e;">⚡ Action Required:</p>
                  <p style="margin: 10px 0 0 0; color: #92400e;">Please contact the visitor to confirm the visit schedule.</p>
                </div>
              </div>
              <div class="footer">
                <p style="margin: 0;">This email was sent from the PGUNCLE visit booking system</p>
                <p style="margin: 10px 0 0 0;">Reply directly to this email to respond to ${name}</p>
              </div>
            </div>
          </body>
          </html>
        `,
        text: `
New Property Visit Request - PGUNCLE

Property: ${propertyName}
${propertyId ? `Property ID: ${propertyId}` : ''}

Visitor Details:
Name: ${name}
Email: ${email}
Phone: ${phone}

Visit Schedule:
Date: ${formattedDate}
Time: ${visitTime}

${message ? `Additional Message:\n${message}\n` : ''}

Request Received: ${new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })}

Action Required: Please contact the visitor to confirm the visit schedule.
        `,
      });

      console.log('✅ Visit booking email sent successfully to', process.env.ADMIN_EMAIL || process.env.SMTP_USER);

      // Send confirmation email to user
      await transporter.sendMail({
        from: process.env.SMTP_FROM || process.env.SMTP_USER,
        to: email,
        subject: `✅ Visit Confirmed: ${propertyName} - PGUNCLE`,
        html: `
          <!DOCTYPE html>
          <html>
          <head>
            <style>
              body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
              .container { max-width: 600px; margin: 0 auto; padding: 20px; }
              .header { background: linear-gradient(135deg, #3b82f6 0%, #06b6d4 100%); color: white; padding: 30px; border-radius: 10px 10px 0 0; text-align: center; }
              .content { background: white; padding: 30px; border: 1px solid #e5e7eb; }
              .highlight { background: #dbeafe; border-left: 4px solid #3b82f6; padding: 15px; border-radius: 4px; margin: 20px 0; }
              .footer { background: #f9fafb; color: #6b7280; padding: 20px; text-align: center; border-radius: 0 0 10px 10px; font-size: 12px; }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="header">
                <h1 style="margin: 0; font-size: 28px;">✅ Visit Confirmed!</h1>
                <p style="margin: 10px 0 0 0; opacity: 0.9;">PGUNCLE - Property Visit</p>
              </div>
              <div class="content">
                <p style="font-size: 16px; color: #374151;">Dear ${name},</p>
                <p style="font-size: 16px; color: #374151;">
                  Thank you for scheduling a visit with PGUNCLE! Your visit request has been confirmed.
                </p>
                
                <div class="highlight">
                  <h3 style="margin: 0 0 15px 0; color: #1f2937;">📍 Property Details</h3>
                  <p style="margin: 5px 0; font-size: 18px; font-weight: bold; color: #3b82f6;">${propertyName}</p>
                </div>

                <div style="background: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
                  <h3 style="margin: 0 0 15px 0; color: #1f2937;">📅 Visit Schedule</h3>
                  <table style="width: 100%; border-collapse: collapse;">
                    <tr>
                      <td style="padding: 8px 0; color: #6b7280;">Date:</td>
                      <td style="padding: 8px 0; color: #1f2937; font-weight: 600;">${formattedDate}</td>
                    </tr>
                    <tr>
                      <td style="padding: 8px 0; color: #6b7280;">Time:</td>
                      <td style="padding: 8px 0; color: #1f2937; font-weight: 600;">${visitTime}</td>
                    </tr>
                  </table>
                </div>

                ${message ? `
                <div style="margin: 20px 0;">
                  <p style="margin: 0; color: #6b7280; font-size: 14px;">Your message:</p>
                  <p style="margin: 5px 0; color: #1f2937;">${message.replace(/\n/g, '<br>')}</p>
                </div>
                ` : ''}

                <div style="background: #fef3c7; border-left: 4px solid #f59e0b; padding: 15px; border-radius: 4px; margin: 20px 0;">
                  <p style="margin: 0; color: #92400e; font-weight: bold;">📞 Next Steps:</p>
                  <p style="margin: 10px 0 0 0; color: #92400e;">
                    Our team will contact you shortly to confirm the visit details and provide directions to the property.
                  </p>
                </div>

                <p style="color: #6b7280; font-size: 14px; margin-top: 30px; border-top: 1px solid #e5e7eb; padding-top: 20px;">
                  If you have any questions or need to reschedule, please contact us at 
                  <a href="mailto:${process.env.ADMIN_EMAIL || process.env.SMTP_USER}" style="color: #3b82f6;">${process.env.ADMIN_EMAIL || process.env.SMTP_USER}</a>
                </p>
                
                <p style="color: #1f2937; margin-top: 20px;">Best regards,<br><strong>Team PGUNCLE</strong></p>
              </div>
              <div class="footer">
                <p style="margin: 0;">This is an automated confirmation email from PGUNCLE</p>
                <p style="margin: 5px 0 0 0;">Please do not reply to this email</p>
              </div>
            </div>
          </body>
          </html>
        `,
        text: `
Visit Confirmed - PGUNCLE

Dear ${name},

Thank you for scheduling a visit with PGUNCLE! Your visit request has been confirmed.

Property: ${propertyName}

Visit Schedule:
Date: ${formattedDate}
Time: ${visitTime}

${message ? `Your message:\n${message}\n\n` : ''}

Next Steps:
Our team will contact you shortly to confirm the visit details and provide directions to the property.

If you have any questions or need to reschedule, please contact us at ${process.env.ADMIN_EMAIL || process.env.SMTP_USER}

Best regards,
Team PGUNCLE
        `,
      });

      console.log('✅ Visit confirmation email sent to user:', email);

    } catch (emailError) {
      console.error('Email sending error:', emailError);
      // Still return success to user, but log the error
    }

    return NextResponse.json(
      { 
        success: true,
        message: 'Visit scheduled successfully! We will contact you shortly.' 
      },
      { status: 200 }
    );

  } catch (error) {
    console.error('Visit booking error:', error);
    return NextResponse.json(
      { error: 'Failed to schedule visit' },
      { status: 500 }
    );
  }
}
