// pages/api/send-email.js
import nodemailer from 'nodemailer';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { recipient, subject, message, emailId, appPassword } = req.body;

  if (!recipient || !subject || !message || !emailId || !appPassword) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  // Set up Nodemailer with provided email ID and app password
  const transporter = nodemailer.createTransport({
    service: 'Gmail', // Change this if you're using another email service
    auth: {
      user: emailId,
      pass: appPassword,
    },
  });

  const mailOptions = {
    from: emailId, // Use the provided email ID as the sender
    to: recipient, // Send to the specified recipient
    subject,
    html: message, // Use 'html' for HTML content
  };

  try {
    await transporter.sendMail(mailOptions); // Attempt to send the email
    return res.status(200).json({ success: true, message: `Email sent to ${recipient}` });
  } catch (error) {
    console.error('Error sending email:', error);
    return res.status(500).json({ error: `Error sending email to ${recipient}` });
  }
}
