import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY!)

export async function sendWelcomeEmail(email: string, name: string) {
  try {
    await resend.emails.send({
      from: process.env.RESEND_FROM_EMAIL!,
      to: email,
      subject: 'Welcome to BookShop!',
      html: `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <style>
              body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; line-height: 1.6; color: #333; }
              .container { max-width: 600px; margin: 0 auto; padding: 20px; }
              .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 40px 20px; text-align: center; border-radius: 8px 8px 0 0; }
              .content { background: #f9fafb; padding: 40px 20px; }
              .button { display: inline-block; background: #667eea; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; margin: 20px 0; }
              .footer { text-align: center; padding: 20px; color: #6b7280; font-size: 14px; }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="header">
                <h1 style="margin: 0;">Welcome to BookShop! 📚</h1>
              </div>
              <div class="content">
                <p>Hi ${name || 'there'},</p>
                <p>Thanks for joining BookShop! We're excited to have you as part of our reading community.</p>
                <p>You now have access to our entire library of books. Start your reading journey today!</p>
                <div style="text-align: center;">
                  <a href="${process.env.NEXT_PUBLIC_APP_URL}/reader" class="button">Start Reading</a>
                </div>
                <p>If you have any questions, just reply to this email. Happy reading!</p>
                <p>Best regards,<br>The BookShop Team</p>
              </div>
              <div class="footer">
                <p>BookShop - Your digital library</p>
              </div>
            </div>
          </body>
        </html>
      `,
    })
  } catch (error) {
    console.error('Failed to send welcome email:', error)
  }
}
