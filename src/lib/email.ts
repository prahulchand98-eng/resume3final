import nodemailer from 'nodemailer';

function createTransport() {
  const host = process.env.EMAIL_SERVER_HOST;
  if (!host) return null;

  return nodemailer.createTransport({
    host,
    port: parseInt(process.env.EMAIL_SERVER_PORT || '587'),
    secure: process.env.EMAIL_SERVER_PORT === '465',
    auth: {
      user: process.env.EMAIL_SERVER_USER,
      pass: process.env.EMAIL_SERVER_PASSWORD,
    },
  });
}

const FROM = process.env.EMAIL_FROM || 'VicksResume <noreply@resumetailor.ai>';

export async function sendVerificationEmail(to: string, verifyUrl: string) {
  const transport = createTransport();

  const html = `
    <!DOCTYPE html>
    <html>
    <head><meta charset="utf-8"></head>
    <body style="font-family:system-ui,sans-serif;background:#f9fafb;margin:0;padding:40px 20px;">
      <div style="max-width:480px;margin:0 auto;background:white;border-radius:16px;border:1px solid #e5e7eb;overflow:hidden;">
        <div style="background:#4f46e5;padding:28px 32px;">
          <h1 style="color:white;margin:0;font-size:22px;font-weight:700;">VicksResume</h1>
        </div>
        <div style="padding:32px;">
          <h2 style="margin:0 0 8px;font-size:20px;color:#111827;">Confirm your email</h2>
          <p style="color:#6b7280;margin:0 0 24px;line-height:1.6;">
            Thanks for signing up! Click the button below to verify your email address and activate your account.
            This link expires in <strong>24 hours</strong>.
          </p>
          <a href="${verifyUrl}"
             style="display:inline-block;background:#4f46e5;color:white;text-decoration:none;
                    padding:12px 28px;border-radius:8px;font-weight:600;font-size:15px;">
            Verify Email
          </a>
          <p style="color:#9ca3af;font-size:13px;margin:24px 0 0;line-height:1.6;">
            If you didn't create this account, you can safely ignore this email.<br><br>
            Or copy this link:<br>
            <span style="color:#4f46e5;word-break:break-all;">${verifyUrl}</span>
          </p>
        </div>
        <div style="background:#f9fafb;padding:16px 32px;border-top:1px solid #e5e7eb;">
          <p style="color:#9ca3af;font-size:12px;margin:0;">© ${new Date().getFullYear()} VicksResume</p>
        </div>
      </div>
    </body>
    </html>
  `;

  if (!transport) {
    console.log('\n─────────────────────────────────────');
    console.log('📧  VERIFICATION EMAIL (dev mode)');
    console.log(`To:  ${to}`);
    console.log(`URL: ${verifyUrl}`);
    console.log('─────────────────────────────────────\n');
    return;
  }

  await transport.sendMail({
    from: FROM,
    to,
    subject: 'Verify your VicksResume email',
    html,
  });
}

export async function sendPasswordResetEmail(to: string, resetUrl: string) {
  const transport = createTransport();

  const html = `
    <!DOCTYPE html>
    <html>
    <head><meta charset="utf-8"></head>
    <body style="font-family:system-ui,sans-serif;background:#f9fafb;margin:0;padding:40px 20px;">
      <div style="max-width:480px;margin:0 auto;background:white;border-radius:16px;border:1px solid #e5e7eb;overflow:hidden;">
        <div style="background:#4f46e5;padding:28px 32px;">
          <h1 style="color:white;margin:0;font-size:22px;font-weight:700;">VicksResume</h1>
        </div>
        <div style="padding:32px;">
          <h2 style="margin:0 0 8px;font-size:20px;color:#111827;">Reset your password</h2>
          <p style="color:#6b7280;margin:0 0 24px;line-height:1.6;">
            We received a request to reset your password. Click the button below to choose a new one.
            This link expires in <strong>1 hour</strong>.
          </p>
          <a href="${resetUrl}"
             style="display:inline-block;background:#4f46e5;color:white;text-decoration:none;
                    padding:12px 28px;border-radius:8px;font-weight:600;font-size:15px;">
            Reset Password
          </a>
          <p style="color:#9ca3af;font-size:13px;margin:24px 0 0;line-height:1.6;">
            If you didn't request this, you can safely ignore this email — your password won't change.<br><br>
            Or copy this link:<br>
            <span style="color:#4f46e5;word-break:break-all;">${resetUrl}</span>
          </p>
        </div>
        <div style="background:#f9fafb;padding:16px 32px;border-top:1px solid #e5e7eb;">
          <p style="color:#9ca3af;font-size:12px;margin:0;">© ${new Date().getFullYear()} VicksResume</p>
        </div>
      </div>
    </body>
    </html>
  `;

  if (!transport) {
    // Dev mode — log to console instead of sending
    console.log('\n─────────────────────────────────────');
    console.log('📧  PASSWORD RESET EMAIL (dev mode)');
    console.log(`To:  ${to}`);
    console.log(`URL: ${resetUrl}`);
    console.log('─────────────────────────────────────\n');
    return;
  }

  await transport.sendMail({
    from: FROM,
    to,
    subject: 'Reset your VicksResume password',
    html,
  });
}
