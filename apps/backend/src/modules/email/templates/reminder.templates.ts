/**
 * @file reminder.templates.ts
 * @description Reminder email templates (HTML and plain text)
 * @task TASK-029
 */

export function getReminderEmailHtml(
  userName: string,
  deadlineTime: string,
  appUrl: string,
): string {
  const checkInUrl = `${appUrl}/check-in`;

  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f4f4f4;">
  <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; padding: 20px;">
    <h2 style="color: #4A90A4; margin-top: 0;">Good Morning!</h2>
    <p>Hi ${userName},</p>
    <p>This is a friendly reminder to check in today. Your deadline is <strong>${deadlineTime}</strong>.</p>
    <div style="text-align: center; margin: 30px 0;">
      <a href="${checkInUrl}"
         style="background: #28a745; color: white; padding: 15px 30px;
                text-decoration: none; border-radius: 5px; font-weight: bold; display: inline-block;">
        Check In Now
      </a>
    </div>
    <p style="color: #666;">Checking in takes just a second and helps your loved ones know you're safe.</p>
    <hr style="margin: 30px 0; border: none; border-top: 1px solid #dee2e6;">
    <p style="color: #6c757d; font-size: 12px; margin-bottom: 0;">
      This is an automated reminder from Solo Guardian.<br>
      You can adjust your reminder settings in the app.
    </p>
  </div>
</body>
</html>`.trim();
}

export function getReminderEmailText(
  userName: string,
  deadlineTime: string,
  appUrl: string,
): string {
  const checkInUrl = `${appUrl}/check-in`;

  return `
Good Morning!

Hi ${userName},

This is a friendly reminder to check in today. Your deadline is ${deadlineTime}.

Check in now: ${checkInUrl}

Checking in takes just a second and helps your loved ones know you're safe.

---
This is an automated reminder from Solo Guardian.
You can adjust your reminder settings in the app.
  `.trim();
}
