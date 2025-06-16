import nodemailer from "nodemailer";
import fetch from "node-fetch";

export async function notifyFailure(subject: string, error: any) {
  const message = `❌ ${subject}\nError: ${error.message || error.toString()}`;

  await fetch(process.env.SLACK_WEBHOOK_URL!, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ text: message }),
  });

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.ALERT_EMAIL,
      pass: process.env.ALERT_EMAIL_PASSWORD,
    },
  });

  await transporter.sendMail({
    from: `QA Bot <${process.env.ALERT_EMAIL}>`,
    to: "qa-team@example.com",
    subject,
    text: message,
  });
}
