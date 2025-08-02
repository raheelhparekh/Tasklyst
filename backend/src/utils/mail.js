import Mailgen from "mailgen";
import nodemailer from "nodemailer";
import logger from "./logger.js";
import { ApiError } from "./api-errors.js";

export const sendMail = async (options) => {
  var mailGenerator = new Mailgen({
    theme: "default",
    product: {
      // Appears in header & footer of e-mails
      name: "Task Manager",
      link: process.env.BASE_URL || "http://localhost:5173",
    },
  });

  // Generate an HTML email with the provided contents
  var emailHtml = mailGenerator.generate(options.mailGenContent);

  // Generate the plaintext version of the e-mail (for clients that do not support HTML)
  var emailText = mailGenerator.generatePlaintext(options.mailGenContent);

  // Create a transporter for SMTP
  const transporter = nodemailer.createTransport({
    host: process.env.MAILTRAP_HOST,
    port: process.env.MAILTRAP_PORT,
    secure: false, // upgrade later with STARTTLS
    auth: {
      user: process.env.MAILTRAP_USERNAME,
      pass: process.env.MAILTRAP_PASSWORD,
    },
  });

  const mail = {
    from: 'anyemail@email.com', // sender address
    to: options.email, // list of receivers
    subject: options.subject, // Subject line
    text: emailText, // plain text body
    html: emailHtml,
  };

  try {
    await transporter.sendMail(mail);
    logger.info(`Email sent successfully to: ${options.email}`);
  } catch (error) {
    logger.error(`Failed to send email to ${options.email}:`, error);
    throw new ApiError(500, "Failed to send email");
  }
};

export const emailVerificationMailGenContent = (username, verificationUrl) => {
  return {
    body: {
      name: username,
      intro:
        "Welcome to Task Manager! We're very excited to have you on board.",
      action: {
        instructions: "To get started with our app, please click here to verify your email:",
        button: {
          color: "#22BC66", // Optional action button color
          text: "Confirm your account",
          link: verificationUrl,
        },
      },
      outro:
        "Need help, or have questions? Just reply to this email, we'd love to help.",
    },
  };
};

export const forgotPasswordMailGenContent = (username, passwordResetUrl) => {
  return {
    body: {
      name: username,
      intro: "Change Your Password ?",
      action: {
        instructions: "To change your password, please click here:",
        button: {
          color: "#22BC66", // Optional action button color
          text: "Reset Password",
          link: passwordResetUrl,
        },
      },
    },
  };
};
