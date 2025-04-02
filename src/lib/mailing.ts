import nodemailer from "nodemailer";

const SENDER_EMAIL = process.env.SENDER_EMAIL;
const SENDER_APP_PASSWORD = process.env.SENDER_APP_PASSWORD;

if (!SENDER_EMAIL || !SENDER_APP_PASSWORD) {
  console.log("SENDER_EMAIL & SENDER_APP_PASSWORD are required");
  process.exit(1);
}

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  auth: {
    user: SENDER_EMAIL,
    pass: SENDER_APP_PASSWORD, 
  },
});

export async function sendMail(mails: string[], subject: string, message: string) {
  const info = await transporter.sendMail({
    from: `"Avyakt 4.0" <${SENDER_EMAIL}>`,
    to: mails.join(","),
    subject: subject, 
    text: message,
    html: `<b>${message}</b>`,
  });
}

export async function sendOTP(mail: string, otp: number) {
  return await sendMail([mail], otp)
}
