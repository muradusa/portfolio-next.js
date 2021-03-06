import nodemailer from "nodemailer";

export default async (req, res) => {
  const { name, email, subject, message } = req.body;

  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    // secureConnection: true,

    tls: {
      rejectUnauthorized: false,
    },
    port: 587,
    auth: {
      type: "OAuth2",
      user: process.env.EMAIL,
      clientId: process.env.CLIENT_ID,
      clientSecret: process.env.CLIENT_SECRET,
      refreshToken: process.env.GMAIL_REFRESH_TOKEN,
      accessToken: process.env.ACCESS_TOKEN,
    },

    // Usefull article for this https://dev.to/chandrapantachhetri/sending-emails-securely-using-node-js-nodemailer-smtp-gmail-and-oauth2-g3a
    // Access token came from https://developers.google.com/oauthplayground/
    // ClientId and Secret comes from https://console.cloud.google.com/apis
  });

  try {
    const emailRes = await transporter.sendMail({
      from: email,
      to: "mcholukov@welyons.com",
      subject: `Murad Webdev Portfolio contact form submission from ${name} `,
      html: `
      <p>First Name: ${name}</p>
      <p>Email: ${email}</p>
      <p>Subject: ${subject}</p>
      <p>Message: ${message}</p>

   `,
    });
    console.log("Message Sent", emailRes.messageId);
    res.status(200).json([emailRes.messageId, req.body]);
  } catch (error) {
    console.log(error);
  }

  console.log(req.body);
  // res.status(200).json(req.body);
};
