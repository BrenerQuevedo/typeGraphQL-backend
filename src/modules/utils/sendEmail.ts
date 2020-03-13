import nodemailer from "nodemailer";

export async function sendEmail() {
  const testAccount = await nodemailer.createTestAccount();

  const transporter = nodemailer.createTransport({
    host: "smtp.ethereal.email",
    port: 587,
    secure: false, 
    auth: {
      user: testAccount.user, 
      pass: testAccount.pass 
    }
  });

  const info = await transporter.sendMail({
    from: '"Fred Foo 👻" <foo@example.com>', 
    to: "bar@example.com, baz@example.com", 
    subject: "Hello ✔", 
    text: "Hello world?", 
    html: "<b>Hello world?</b>" 
  });

  console.log("Message sent: %s", info.messageId);

  console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
}

