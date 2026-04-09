import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { 
        action, // 'publish', 'accepted', 'rejected'
        companyName, 
        visitDate,
        magicLink, // Link to dashboard or specific visit
        applicationId, // To link to their specific final evaluation report
        recipients // Array of { email, name }
    } = body;

    if (!process.env.GMAIL_USER || !process.env.GMAIL_APP_PASSWORD) {
      console.log('======= [LOCAL DEV SIMULATOR: NODEMAILER MISSING] =======');
      console.log('Action:', action);
      console.log('Would have emailed:', recipients.length, 'students');
      console.log('Company:', companyName);
      console.log('===========================================================');
      await new Promise(resolve => setTimeout(resolve, 1500));
      return NextResponse.json({ success: true, mock: true, count: recipients.length });
    }

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_APP_PASSWORD,
      },
    });

    const emailPromises = recipients.map(async (student: { email: string, name: string }) => {
        let subject = '';
        let htmlTemplate = '';
        const baseUrl = magicLink ? magicLink.replace(/\/student$/, '') : '';
        const reportUrl = applicationId ? `${baseUrl}/student/report/${applicationId}` : magicLink;

        if (action === 'publish') {
            subject = `[New Visit Published] ${companyName} is recruiting for an Industry Visit`;
            htmlTemplate = `
              <!DOCTYPE html>
              <html>
                <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #f8fafc; margin: 0; padding: 0;">
                  <div style="max-width: 600px; margin: 0 auto; padding: 40px 20px;">
                    <div style="background-color: #ffffff; border-radius: 12px; border: 1px solid #e2e8f0; padding: 40px; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);">
                      <h1 style="color: #0f172a; font-size: 24px; font-weight: 800; margin-top: 0; margin-bottom: 24px;">New Priority Visit Available</h1>
                      <p style="color: #475569; font-size: 16px; line-height: 1.6; margin-top: 0; margin-bottom: 16px;">Dear ${student.name || 'Scholar'},</p>
                      <p style="color: #475569; font-size: 16px; line-height: 1.6; margin-top: 0; margin-bottom: 24px;">
                        The academic team has officially locked in and published a highly relevant industry visit to <strong style="color: #0f172a;">${companyName}</strong>, scheduled for <strong style="color: #0284c7; background-color: #f0f9ff; padding: 2px 6px; border-radius: 4px;">${visitDate}</strong>.
                      </p>
                      
                      <div style="text-align: center; padding: 32px 0; margin: 32px 0; border-top: 1px solid #f1f5f9; border-bottom: 1px solid #f1f5f9;">
                        <h4 style="color: #0f172a; font-size: 16px; font-weight: bold; margin-top: 0; margin-bottom: 8px;">View Application Link</h4>
                        <p style="color: #64748b; font-size: 14px; margin-top: 0; margin-bottom: 24px;">Head to your dashboard to review requirements and apply. Capacity is strictly limited.</p>
                        <a href="${magicLink}" style="display: inline-block; background-color: #0284c7; color: #ffffff !important; font-size: 14px; font-weight: bold; text-decoration: none; padding: 14px 32px; border-radius: 8px;">Open Student Portal</a>
                      </div>

                      <p style="color: #475569; font-size: 16px; line-height: 1.6; margin-top: 0; margin-bottom: 16px;">Best regards,<br/><strong>UniVisit Academic Office</strong></p>
                    </div>
                  </div>
                </body>
              </html>
            `;
        } else if (action === 'accepted') {
            subject = `[Application Accepted] You have been selected for the ${companyName} Visit`;
            htmlTemplate = `
              <!DOCTYPE html>
              <html>
                <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #f8fafc; margin: 0; padding: 0;">
                  <div style="max-width: 600px; margin: 0 auto; padding: 40px 20px;">
                    <div style="background-color: #ffffff; border-radius: 12px; border: 1px solid #e2e8f0; padding: 40px; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);">
                      <div style="background-color: #f0f9ff; border: 1px solid #bae6fd; border-radius: 8px; padding: 20px; margin-bottom: 24px; text-align: center;">
                        <h2 style="color: #0284c7; margin-top: 0; margin-bottom: 8px; font-size: 20px; font-weight: 800;">Application Accepted! 🎉</h2>
                        <p style="color: #0369a1; margin: 0; font-size: 15px;">Congratulations on passing the faculty review process.</p>
                      </div>
                      
                      <p style="color: #475569; font-size: 16px; line-height: 1.6; margin-top: 0; margin-bottom: 16px;">Dear ${student.name || 'Scholar'},</p>
                      <p style="color: #475569; font-size: 16px; line-height: 1.6; margin-top: 0; margin-bottom: 24px;">
                        We are thrilled to inform you that your application for the <strong style="color: #0f172a;">${companyName}</strong> industry visit on <strong style="color: #0284c7;">${visitDate}</strong> has been officially approved!
                      </p>
                      
                      <div style="text-align: center; padding: 32px 0; margin: 32px 0; border-top: 1px solid #f1f5f9; border-bottom: 1px solid #f1f5f9;">
                        <h4 style="color: #0f172a; font-size: 16px; font-weight: bold; margin-top: 0; margin-bottom: 8px;">View Your Detailed Faculty Evaluation</h4>
                        <p style="color: #64748b; font-size: 14px; margin-top: 0; margin-bottom: 24px;">Please review your dashboard immediately for any required clearance forms and download your finalized acceptance dossier.</p>
                        <a href="${reportUrl}" style="display: inline-block; background-color: #0284c7; color: #ffffff !important; font-size: 14px; font-weight: bold; text-decoration: none; padding: 14px 32px; border-radius: 8px; margin-right: 12px; margin-bottom: 12px;">View Application Report</a>
                        <a href="${magicLink}" style="display: inline-block; background-color: #f1f5f9; color: #0f172a !important; border: 1px solid #e2e8f0; font-size: 14px; font-weight: bold; text-decoration: none; padding: 13px 32px; border-radius: 8px; margin-bottom: 12px;">Open Student Portal</a>
                      </div>

                      <p style="color: #475569; font-size: 16px; line-height: 1.6; margin-top: 0; margin-bottom: 16px;">Best regards,<br/><strong>UniVisit Academic Office</strong></p>
                    </div>
                  </div>
                </body>
              </html>
            `;
        } else if (action === 'rejected') {
            subject = `[Application Update] Status regarding ${companyName} Visit`;
            htmlTemplate = `
              <!DOCTYPE html>
              <html>
                <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #f8fafc; margin: 0; padding: 0;">
                  <div style="max-width: 600px; margin: 0 auto; padding: 40px 20px;">
                    <div style="background-color: #ffffff; border-radius: 12px; border: 1px solid #e2e8f0; padding: 40px; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);">
                      <h1 style="color: #0f172a; font-size: 24px; font-weight: 800; margin-top: 0; margin-bottom: 24px;">Application Status Update</h1>
                      <p style="color: #475569; font-size: 16px; line-height: 1.6; margin-top: 0; margin-bottom: 16px;">Dear ${student.name || 'Scholar'},</p>
                      
                      <p style="color: #475569; font-size: 16px; line-height: 1.6; margin-top: 0; margin-bottom: 24px;">
                        Thank you for taking the time to apply for the <strong style="color: #0f172a;">${companyName}</strong> industry visit scheduled on <strong style="color: #0f172a;">${visitDate}</strong>.
                      </p>
                      
                      <p style="color: #475569; font-size: 16px; line-height: 1.6; margin-top: 0; margin-bottom: 24px;">
                        Unfortunately, while your profile was well presented, we encountered unprecedented demand and extremely limited operational capacity. Consequently, the faculty team was unable to accommodate your application for this specific excursion.
                      </p>

                      <div style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 20px; margin-bottom: 24px; text-align: center;">
                        <p style="color: #64748b; margin: 0; font-size: 15px; font-style: italic;">
                          "While you weren't selected this time round due to strict capacity constraints, we strongly encourage you to keep your profile updated and apply for future opportunities soon!"
                        </p>
                      </div>

                      <div style="text-align: center; padding: 24px 0; margin: 24px 0; border-top: 1px solid #f1f5f9; border-bottom: 1px solid #f1f5f9;">
                        <h4 style="color: #0f172a; font-size: 16px; font-weight: bold; margin-top: 0; margin-bottom: 8px;">Review Your Performance Metrics</h4>
                        <p style="color: #64748b; font-size: 14px; margin-top: 0; margin-bottom: 24px;">For transparency, the faculty board has compiled a detailed, data-driven dossier explaining how your application was algorithmically scored. Review your report for actionable feedback to improve your portfolio.</p>
                        <a href="${reportUrl}" style="display: inline-block; background-color: #0f172a; color: #ffffff !important; font-size: 14px; font-weight: bold; text-decoration: none; padding: 14px 32px; border-radius: 8px;">View Detailed Evaluation Report</a>
                      </div>

                      <p style="color: #475569; font-size: 16px; line-height: 1.6; margin-top: 0; margin-bottom: 16px;">Best regards,<br/><strong>UniVisit Academic Office</strong></p>
                    </div>
                  </div>
                </body>
              </html>
            `;
        }

        return transporter.sendMail({
            from: `"UniVisit Connect" <${process.env.GMAIL_USER}>`, 
            to: student.email,
            subject: subject,
            html: htmlTemplate,
        });
    });

    // Execute concurrently for performance
    await Promise.allSettled(emailPromises);

    return NextResponse.json({ success: true, count: emailPromises.length });
  } catch (error: any) {
    console.error('Error dispatching student emails:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
