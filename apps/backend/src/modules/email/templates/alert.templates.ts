/**
 * @file alert.templates.ts
 * @description Alert email templates (HTML and plain text)
 * @task TASK-025
 */

export function getAlertEmailHtml(
  contactName: string,
  userName: string,
  alertDate: string,
  triggeredAt: string,
): string {
  const formattedTime = new Date(triggeredAt).toLocaleString('en-US', {
    dateStyle: 'full',
    timeStyle: 'short',
  });

  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f4f4f4;">
  <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; padding: 20px;">
    <h2 style="color: #dc3545; margin-top: 0;">⚠️ Safety Alert</h2>
    <p>Dear ${contactName},</p>
    <p><strong>${userName}</strong> has not checked in today.</p>
    <div style="background-color: #f8f9fa; padding: 15px; border-radius: 5px; margin: 20px 0;">
      <p style="margin: 5px 0;"><strong>Date:</strong> ${alertDate}</p>
      <p style="margin: 5px 0;"><strong>Expected by:</strong> ${formattedTime}</p>
    </div>
    <div style="background-color: #fff3cd; padding: 15px; border-radius: 5px; border-left: 4px solid #ffc107;">
      <p style="margin: 0;"><strong>Please check on ${userName} to ensure they are safe.</strong></p>
    </div>
    <hr style="margin: 30px 0; border: none; border-top: 1px solid #dee2e6;">
    <p style="color: #6c757d; font-size: 12px; margin-bottom: 0;">
      This is an automated safety alert from Solo Guardian.<br>
      You received this because you are listed as an emergency contact.
    </p>
  </div>
</body>
</html>`.trim();
}

export function getAlertEmailText(
  contactName: string,
  userName: string,
  alertDate: string,
  triggeredAt: string,
): string {
  const formattedTime = new Date(triggeredAt).toLocaleString('en-US', {
    dateStyle: 'full',
    timeStyle: 'short',
  });

  return `
SAFETY ALERT

Dear ${contactName},

${userName} has not checked in today.

Date: ${alertDate}
Expected by: ${formattedTime}

Please check on ${userName} to ensure they are safe.

---
This is an automated safety alert from Solo Guardian.
You received this because you are listed as an emergency contact.
  `.trim();
}
