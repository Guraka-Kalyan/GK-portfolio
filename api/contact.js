import { Resend } from 'resend';
import mongoose from 'mongoose';

const resend = new Resend(process.env.RESEND_API_KEY);

// Cache the MongoDB connection for performance across serverless cold starts
let cachedDb = null;

async function connectToDatabase() {
  if (cachedDb && mongoose.connection.readyState === 1) return cachedDb;

  const uri = process.env.MONGODB_URI;
  if (!uri) {
    throw new Error('Please define the MONGODB_URI environment variable inside Vercel or .env');
  }

  const conn = await mongoose.connect(uri);
  cachedDb = conn;
  return conn;
}

const portfolioLeadSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, trim: true },
  phone: { type: String, trim: true },
  projectType: { type: String, trim: true },
  message: { type: String, default: '' },
  createdAt: { type: Date, default: Date.now },
  status: { type: String, default: 'New' }
}, { strict: false });
// Ensure it targets the exact collection: 'portfolio_leads'
const PortfolioLead = mongoose.models.PortfolioLead || mongoose.model('PortfolioLead', portfolioLeadSchema, 'portfolio_leads');

export default async function handler(req, res) {
  // Allow CORS for local testing if needed
  res.setHeader("Access-Control-Allow-Credentials", true);
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET,OPTIONS,PATCH,DELETE,POST,PUT");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version"
  );

  // Handle OPTIONS method for CORS preflight
  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  // Only allow POST
  if (req.method !== "POST") {
    return res.status(405).json({ success: false, message: "Method Not Allowed" });
  }

  // Extract variables
  const { firstName, lastName, email, phone, projectType, message } = req.body;

  if (!firstName || !lastName || !email || !message) {
    return res.status(400).json({ success: false, message: "Missing required fields." });
  }

  const fullName = `${firstName} ${lastName}`;
  // You can set ADMIN_EMAIL in Vercel to explicitly route it to your personal Gmail.
  // E.g., kalyangk7777@gmail.com
  const adminEmail = process.env.ADMIN_EMAIL || "kalyangk7777@gmail.com";
  const customDomainFrom = "hello@kalyangk.online";

  // Admin Notification Email HTML Template (sent to YOU)
  const adminHtml = `
    <div style="font-family: Arial, sans-serif; color: #333; max-width: 600px; margin: 0 auto; border: 1px solid #1a1a1a; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
      <div style="background-color: #1a1a1a; padding: 25px; text-align: center;">
        <h2 style="color: #ffffff; margin: 0; font-size: 24px;">New Portfolio Inquiry</h2>
        <p style="color: #aaaaaa; margin: 5px 0 0 0; font-size: 14px;">You have a new lead from your website.</p>
      </div>
      <div style="padding: 30px; background-color: #fcfcfc;">
        <h3 style="border-bottom: 1px solid #ddd; padding-bottom: 8px; margin-top: 0;">Contact Details</h3>
        <p style="margin: 10px 0;"><strong>Name:</strong> ${fullName}</p>
        <p style="margin: 10px 0;"><strong>Email:</strong> <a href="mailto:${email}" style="color: #1a1a1a;">${email}</a></p>
        <p style="margin: 10px 0;"><strong>Phone:</strong> ${phone || "N/A"}</p>
        <p style="margin: 10px 0;"><strong>Project Type:</strong> ${projectType || "General Inquiry"}</p>
        
        <h3 style="border-bottom: 1px solid #ddd; padding-bottom: 8px; margin-top: 30px;">Message</h3>
        <div style="background-color: #ffffff; padding: 20px; border-left: 4px solid #1a1a1a; border-radius: 4px; box-shadow: inset 0 0 5px rgba(0,0,0,0.05);">
          <p style="margin: 0; white-space: pre-wrap; line-height: 1.6;">${message}</p>
        </div>
      </div>
      <div style="background-color: #f1f1f1; padding: 15px; text-align: center; font-size: 12px; color: #777;">
        Sent via Guraka Kalyan Portfolio Contact Form
      </div>
    </div>
  `;

  // User Auto-Reply HTML Template (sent to the USER)
  const userHtml = `
    <div style="font-family: Arial, sans-serif; color: #333; max-width: 600px; margin: 0 auto; border: 1px solid #eaeaea; border-radius: 8px; overflow: hidden;">
      <div style="background-color: #1a1a1a; padding: 25px; text-align: center;">
        <h2 style="color: #ffffff; margin: 0; letter-spacing: 1px;">Thanks for Reaching Out!</h2>
      </div>
      <div style="padding: 30px; background-color: #ffffff; font-size: 16px; line-height: 1.6;">
        <p style="margin-top: 0;">Hi <strong>${firstName}</strong>,</p>
        <p>Thank you for submitting an inquiry through my portfolio! I have received your message regarding <strong>${projectType ? projectType : "your project"}</strong>.</p>
        
        <div style="background-color: #f9f9f9; border-left: 4px solid #1a1a1a; padding: 15px; margin: 25px 0;">
          <p style="margin: 0; font-size: 14px; color: #555;"><em>"I aim to respond to all inquiries within 24 to 48 hours. Looking forward to discussing how we can work together."</em></p>
        </div>
        
        <p>Best regards,</p>
        <p style="margin-bottom: 0;"><strong>Guraka Kalyan</strong></p>
        <p style="margin-top: 5px; font-size: 14px; color: #666;">Full Stack Developer</p>
      </div>
      <div style="background-color: #fcfcfc; padding: 20px; text-align: center; border-top: 1px solid #eee;">
        <a href="https://kalyangk.online" style="color: #1a1a1a; text-decoration: none; font-weight: bold; margin: 0 10px;">Website</a> | 
        <a href="https://www.linkedin.com/in/guraka-kalyan/" style="color: #1a1a1a; text-decoration: none; font-weight: bold; margin: 0 10px;">LinkedIn</a> |
        <a href="https://github.com/Guraka-Kalyan/" style="color: #1a1a1a; text-decoration: none; font-weight: bold; margin: 0 10px;">GitHub</a>
      </div>
    </div>
  `;

  try {
    // 0. Save lead information to MongoDB database
    try {
      await connectToDatabase();

      const newLead = new PortfolioLead({
        name: fullName,
        email,
        phone: phone || "N/A",
        projectType: projectType || "General Inquiry",
        message,
        status: "New"
      });

      await newLead.save();
      console.log('Successfully saved lead to MongoDB via Mongoose');
    } catch (dbError) {
      console.error("Database connection/saving error:", dbError);
      // We will gracefully continue to send the email so the lead is never fully lost
      // even if the database is temporarily down or IP whitelist is blocked.
    }

    // 1. Send administrative email to yourself (the Admin Lead)
    // 2. Send automated confirmation email to the user
    // Resend supports sending multiple emails concurrently using Promise.all or an array of objects

    const [adminResponse, userResponse] = await Promise.all([
      resend.emails.send({
        from: `Portfolio Alerts <${customDomainFrom}>`,
        to: adminEmail,
        subject: `New Lead: ${projectType || 'Inquiry'} from ${fullName}`,
        html: adminHtml,
        replyTo: email,
      }),
      resend.emails.send({
        from: `Guraka Kalyan <${customDomainFrom}>`,
        to: email,
        subject: "Thank You For Reaching Out - Received",
        html: userHtml,
      }),
    ]);

    if (adminResponse.error) {
      console.error("Resend Admin Error:", adminResponse.error);
      return res.status(500).json({ success: false, message: "Failed to send email to admin." });
    }

    if (userResponse.error) {
      console.error("Resend User Error:", userResponse.error);
      return res.status(500).json({ success: false, message: "Failed to send confirmation email." });
    }

    return res.status(200).json({ success: true, message: "Emails sent successfully!" });
  } catch (error) {
    console.error("Resend Server Error:", error);
    return res.status(500).json({ success: false, message: "Server error while sending email." });
  }
}
