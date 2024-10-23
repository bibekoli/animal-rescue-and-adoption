import nodemailer from "nodemailer";


const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.GMAIL_ID,
    pass: process.env.GMAIL_PASSWORD,
  },
});

const mailTemplates = {
  rescue: {
    from: `ResQNest <no-reply@arocel.com>`,
    to: "{{email}}",
    subject: `New Rescue Request Near You`,
    html: `A new request has been posted near you.<br><br>
Name: {{name}}<br>
Location: {{location}}<br>
Description: {{description}}<br>
<br>
<br>
Click to <a href="https://animal-rescue-and-adoption.vercel.app/rescue/{{id}}">View Request</a>`,
  },
};

const Email = {
  SendRescueEmail: async (email: string, name: string, location: string, description: string, id: string) => {
    const mailOptions = mailTemplates.rescue;
    mailOptions.to = mailOptions.to.replace("{{email}}", email);
    mailOptions.html = mailOptions.html.replace("{{name}}", name);
    mailOptions.html = mailOptions.html.replace("{{location}}", location);
    mailOptions.html = mailOptions.html.replace("{{description}}", description);
    mailOptions.html = mailOptions.html.replace("{{id}}", id);

    transporter.sendMail(mailOptions, (error: any, info: any) => {
      if (error) {
        console.log(error);
      }
      else {
        console.log("Email sent: " + info.response);
      }
    });
  }
};

export default Email;