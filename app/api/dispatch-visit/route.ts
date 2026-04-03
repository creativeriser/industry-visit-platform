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
              
              <p style="color: #475569; font-size: 16px; line-height: 1.6; margin-top: 0; margin-bottom: 16px;">
                ${isCounterProposal 
                  ? `Thank you for your previous flexibility! I am reaching back out because the proposed date didn't quite work for our academic calendar. I would like to officially propose a counter-offer for <strong style="color: #4f46e5; background-color: #eef2ff; padding: 2px 6px; border-radius: 4px;">${facultyDate}</strong> under the timeframe of <strong style="color: #4f46e5; background-color: #eef2ff; padding: 2px 6px; border-radius: 4px;">${startTime} to ${endTime}</strong>.` 
                  : `I am a faculty of <strong style="color: #0f172a;">${facultyInstitution || 'UniVisit Institution'}</strong>. I am reaching out to formally request an industry visit for our students on <strong style="color: #4f46e5; background-color: #eef2ff; padding: 2px 6px; border-radius: 4px;">${facultyDate}</strong> under the proposed timeframe of <strong style="color: #4f46e5; background-color: #eef2ff; padding: 2px 6px; border-radius: 4px;">${startTime} to ${endTime}</strong>.`
                }
              </p>
              
              ${facultyMessage ? `<div style="border-left: 4px solid #e2e8f0; padding-left: 16px; margin: 24px 0; color: #64748b; font-style: italic;">" ${facultyMessage} "</div>` : ''}
              
              <p style="color: #475569; font-size: 16px; line-height: 1.6; margin-top: 0; margin-bottom: 16px;">Please click the secure link below to <strong>${isCounterProposal ? "Review the Counter-Proposal and Accept" : "Review the Visit Proposal, Accept the date, or Propose an Alternate Time"}</strong> (no login required):</p>
              
              <div style="text-align: center; margin: 32px 0;">
                <a href="${magicLink}" style="display: inline-block; background-color: #4f46e5; color: #ffffff !important; font-size: 16px; font-weight: bold; text-decoration: none; padding: 16px 32px; border-radius: 8px; font-family: sans-serif;">Open Secure Portal</a>
              </div>
              
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
      subject: isCounterProposal ? `Re: Company Visit Request Counter-Proposal` : `Company Visit Request: ${companyName}`,
      html: htmlTemplate,
    });

    return NextResponse.json({ success: true, messageId: info.messageId });
  } catch (error: any) {
    console.error('Error dispatching email with Nodemailer:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
