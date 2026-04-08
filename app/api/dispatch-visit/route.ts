import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { 
        companyName, 
        hrEmail, 
        hrName, 
        facultyName,
        facultyEmail, // Added to inject as Reply-To
        facultyDate, 
        startTime, 
        endTime, 
        facultyMessage, 
        magicLink,
        isCounterProposal,
        isConfirmation,
        isConfirmationFromHR,
        facultyDesignation,
        facultyInstitution,
        facultyDepartment
    } = body;

    const cleanFacultyName = facultyName.replace(/[0-9]/g, '').trim();

    const htmlTemplate = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
          <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
        </head>
        <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #f8fafc; margin: 0; padding: 0;">
          <div style="max-width: 600px; margin: 0 auto; padding: 40px 20px;">
            <div style="background-color: #ffffff; border-radius: 12px; border: 1px solid #e2e8f0; padding: 40px; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);">
              <h1 style="color: #0f172a; font-size: 24px; font-weight: 800; margin-top: 0; margin-bottom: 24px;">Company Visit Request: ${companyName}</h1>
              
              <p style="color: #475569; font-size: 16px; line-height: 1.6; margin-top: 0; margin-bottom: 16px;">Dear ${hrName},</p>
              
              ${isConfirmationFromHR
                ? `
                <div style="background-color: #ecfdf5; border: 1px solid #a7f3d0; border-radius: 8px; padding: 20px; margin-bottom: 24px; text-align: center;">
                  <h2 style="color: #059669; margin-top: 0; margin-bottom: 8px; font-size: 20px; font-weight: 800;">Visit Officially Confirmed! 🎉</h2>
                  <p style="color: #047857; margin: 0; font-size: 15px;">Thank you for your confirmation. The proposed schedule has been successfully locked.</p>
                </div>
                <p style="color: #475569; font-size: 16px; line-height: 1.6; margin-top: 0; margin-bottom: 16px;">
                  This email is a formal receipt to confirm that the proposed industry visit from the <strong style="color: #0f172a;">${facultyInstitution || 'UniVisit Institution'}</strong> has been fully authorized and mutually locked into the calendar.
                </p>
                <p style="color: #475569; font-size: 16px; line-height: 1.6; margin-top: 0; margin-bottom: 16px;">
                  The finalized schedule is set for <strong style="color: #059669; background-color: #ecfdf5; padding: 2px 6px; border-radius: 4px;">${facultyDate}</strong> during the timeframe of <strong style="color: #059669; background-color: #ecfdf5; padding: 2px 6px; border-radius: 4px;">${startTime} to ${endTime}</strong>. 
                </p>
                <p style="color: #475569; font-size: 16px; line-height: 1.6; margin-top: 0; margin-bottom: 16px;">
                  The academic team has been automatically notified of your approval. They will now publish this event to the students and proceed with final logistical preparations. We deeply appreciate your partnership!
                </p>
                `
                : isConfirmation
                ? `
                <div style="background-color: #ecfdf5; border: 1px solid #a7f3d0; border-radius: 8px; padding: 20px; margin-bottom: 24px; text-align: center;">
                  <h2 style="color: #059669; margin-top: 0; margin-bottom: 8px; font-size: 20px; font-weight: 800;">Visit Officially Confirmed! 🎉</h2>
                  <p style="color: #047857; margin: 0; font-size: 15px;">The proposed schedule has been fully validated and accepted by the academic team.</p>
                </div>
                <p style="color: #475569; font-size: 16px; line-height: 1.6; margin-top: 0; margin-bottom: 16px;">
                  I am writing to formally confirm that the <strong style="color: #0f172a;">${facultyInstitution || 'UniVisit Institution'}</strong> has authorized and locked in the industry visit to <strong style="color: #0f172a;">${companyName}</strong>. 
                </p>
                <p style="color: #475569; font-size: 16px; line-height: 1.6; margin-top: 0; margin-bottom: 16px;">
                  The finalized schedule is set for <strong style="color: #059669; background-color: #ecfdf5; padding: 2px 6px; border-radius: 4px;">${facultyDate}</strong> during the timeframe of <strong style="color: #059669; background-color: #ecfdf5; padding: 2px 6px; border-radius: 4px;">${startTime} to ${endTime}</strong>. 
                </p>
                <p style="color: #475569; font-size: 16px; line-height: 1.6; margin-top: 0; margin-bottom: 16px;">
                  We are now publishing this event to our students. We deeply appreciate your collaboration and look forward to an excellent visit.
                </p>
                `
                : isCounterProposal 
                ? `
                <p style="color: #475569; font-size: 16px; line-height: 1.6; margin-top: 0; margin-bottom: 16px;">
                  Thank you for your previous flexibility! I am reaching back out because the proposed date didn't quite work for our academic calendar. I would like to officially propose a counter-offer for <strong style="color: #4f46e5; background-color: #eef2ff; padding: 2px 6px; border-radius: 4px;">${facultyDate}</strong> under the timeframe of <strong style="color: #4f46e5; background-color: #eef2ff; padding: 2px 6px; border-radius: 4px;">${startTime} to ${endTime}</strong>.
                </p>
                `
                : `
                <p style="color: #475569; font-size: 16px; line-height: 1.6; margin-top: 0; margin-bottom: 16px;">
                  I am writing to you on behalf of the <strong style="color: #0f172a;">${facultyInstitution || 'UniVisit Institution'}</strong>. We are reaching out to explore the possibility of organizing a formal industry visit for our students at <strong style="color: #0f172a;">${companyName}</strong>.
                </p>
                <p style="color: #475569; font-size: 16px; line-height: 1.6; margin-top: 0; margin-bottom: 16px;">
                  We have tentatively proposed <strong style="color: #4f46e5; background-color: #eef2ff; padding: 2px 6px; border-radius: 4px;">${facultyDate}</strong> during the timeframe of <strong style="color: #4f46e5; background-color: #eef2ff; padding: 2px 6px; border-radius: 4px;">${startTime} to ${endTime}</strong> for this engagement. Our goal is to provide our students with practical industry exposure that directly aligns with their academic curriculum.
                </p>
                `
              }
              
              ${facultyMessage ? `
              <div style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 16px; margin: 24px 0;">
                <p style="font-size: 10px; font-weight: bold; color: #94a3b8; text-transform: uppercase; letter-spacing: 0.05em; margin: 0 0 8px 0;">Faculty Context</p>
                <p style="color: #475569; font-style: italic; font-size: 16px; margin: 0;">"${facultyMessage}"</p>
              </div>
              ` : ''}
              
              ${(!isConfirmation && !isConfirmationFromHR) ? `
              <div style="text-align: center; padding: 32px 0; margin: 32px 0; border-top: 1px solid #f1f5f9; border-bottom: 1px solid #f1f5f9;">
                <h4 style="color: #0f172a; font-size: 16px; font-weight: bold; margin-top: 0; margin-bottom: 8px;">Automated Action Link</h4>
                <p style="color: #64748b; font-size: 14px; margin-top: 0; margin-bottom: 24px;">The HR Representative will click the button below to securely Accept or Counter the proposal.</p>
                <a href="${magicLink}" style="display: inline-block; background-color: #4f46e5; color: #ffffff !important; font-size: 14px; font-weight: bold; text-decoration: none; padding: 14px 32px; border-radius: 8px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; box-shadow: 0 4px 6px -1px rgba(79, 70, 229, 0.2);">Open Secure Portal</a>
              </div>
              ` : `
              <div style="text-align: center; padding: 32px 0; margin: 32px 0; border-top: 1px solid #f1f5f9; border-bottom: 1px solid #f1f5f9;">
                <h4 style="color: #0f172a; font-size: 16px; font-weight: bold; margin-top: 0; margin-bottom: 8px;">Live Tracker Link</h4>
                <p style="color: #64748b; font-size: 14px; margin-top: 0; margin-bottom: 24px;">You can monitor the status of this verified visit via your dashboard below.</p>
                <a href="${magicLink}" style="display: inline-block; background-color: #059669; color: #ffffff !important; font-size: 14px; font-weight: bold; text-decoration: none; padding: 14px 32px; border-radius: 8px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; box-shadow: 0 4px 6px -1px rgba(5, 150, 105, 0.2);">View Tracker Portal</a>
              </div>
              `}
              
              
              <p style="color: #475569; font-size: 16px; line-height: 1.6; margin-top: 0; margin-bottom: 16px;">We look forward to collaborating with you.</p>
              
              <div style="margin-top: 40px; padding-top: 24px; border-top: 1px solid #e2e8f0;">
                <p style="color: #475569; font-size: 14px; margin: 0 0 4px 0;">Best regards,</p>
                <p style="color: #0f172a; font-size: 16px; font-weight: bold; margin: 0 0 2px 0;">${cleanFacultyName}</p>
                <p style="color: #475569; font-size: 14px; margin: 0 0 2px 0;">${facultyDesignation || 'Faculty Member'}${facultyDepartment ? `, ${facultyDepartment}` : ''}</p>
                <p style="color: #475569; font-size: 14px; font-weight: bold; margin: 0;">${facultyInstitution || 'University / Educational Institution'}</p>
              </div>
            </div>
          </div>
        </body>
      </html>
    `;

    if (!process.env.GMAIL_USER || !process.env.GMAIL_APP_PASSWORD) {
      console.log('======= [LOCAL DEV SIMULATOR: NODEMAILER CREDENTIALS MISSING] =======');
      console.log('Would have emailed:', hrEmail);
      console.log('With Reply-To:', facultyEmail);
      console.log('Magic Link:', magicLink);
      console.log('=====================================================================');
      
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      return NextResponse.json({ success: true, mock: true, id: 'simulated_success' });
    }

    // Initialize Nodemailer Transport with Gmail
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_APP_PASSWORD,
      },
    });

    // Dispatch the email
    const info = await transporter.sendMail({
      from: `"UniVisit Connect" <${process.env.GMAIL_USER}>`, 
      to: hrEmail,
      replyTo: facultyEmail || undefined, // Bounces replies directly back to the faculty member
      subject: (isConfirmation || isConfirmationFromHR) 
                ? `[Visit Confirmed] Official Schedule for ${companyName}`
                : isCounterProposal 
                    ? `[Visit Negotiation] Rescheduling Request - ${companyName}` 
                    : `[Visit Request] Initial Proposal for ${companyName}`,
      html: htmlTemplate,
    });

    return NextResponse.json({ success: true, messageId: info.messageId });
  } catch (error: any) {
    console.error('Error dispatching email with Nodemailer:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
