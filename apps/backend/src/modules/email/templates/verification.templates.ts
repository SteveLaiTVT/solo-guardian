/**
 * @file verification.templates.ts
 * @description Verification email templates (HTML and plain text)
 * @task TASK-032
 */

export function getVerificationEmailHtml(
  contactName: string,
  userName: string,
  verificationLink: string,
): string {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f4f4f4;">
  <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; padding: 30px; border-radius: 8px;">
    <h2 style="color: #333; margin-top: 0;">Emergency Contact Request</h2>
    <p>Dear ${contactName},</p>
    <p><strong>${userName}</strong> has added you as an emergency contact on Solo Guardian.</p>
    <div style="background-color: #e8f4f8; padding: 15px; border-radius: 5px; margin: 20px 0;">
      <p style="margin: 0;"><strong>What is Solo Guardian?</strong></p>
      <p style="margin: 10px 0 0 0;">Solo Guardian helps people living alone stay safe by checking in daily. If ${userName} misses their check-in, you'll be notified so you can check on them.</p>
    </div>
    <p>Please verify that you agree to be an emergency contact:</p>
    <div style="text-align: center; margin: 30px 0;">
      <a href="${verificationLink}"
         style="background: #28a745; color: white; padding: 15px 30px;
                text-decoration: none; border-radius: 5px; font-weight: bold; display: inline-block;">
        Verify Now
      </a>
    </div>
    <p style="color: #666; font-size: 14px;">
      This link expires in 24 hours. If you didn't expect this email or don't wish to be an emergency contact, you can simply ignore it.
    </p>
    <hr style="margin: 30px 0; border: none; border-top: 1px solid #eee;">
    <p style="color: #999; font-size: 12px; margin-bottom: 0;">
      Solo Guardian - Keeping loved ones safe
    </p>
  </div>
</body>
</html>`.trim();
}

export function getVerificationEmailText(
  contactName: string,
  userName: string,
  verificationLink: string,
): string {
  return `
EMERGENCY CONTACT REQUEST

Dear ${contactName},

${userName} has added you as an emergency contact on Solo Guardian.

What is Solo Guardian?
Solo Guardian helps people living alone stay safe by checking in daily.
If ${userName} misses their check-in, you'll be notified so you can check on them.

Please verify that you agree to be an emergency contact by clicking this link:

${verificationLink}

This link expires in 24 hours.

If you didn't expect this email or don't wish to be an emergency contact,
you can simply ignore it.

---
Solo Guardian - Keeping loved ones safe
  `.trim();
}
