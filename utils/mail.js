import nodemailer from 'nodemailer';
import ejs from 'ejs'
import path from 'path'

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  logger: true,
  debug: true,
  auth: {
    user: "fredenoch1@gmail.com",
    pass: process.env.GOOGLEAPPPASS,
  },
  tls: {
    rejectUnauthorized: true,
  },


});


export const sendEmail = async(to, subject, html) => {
  
  const mailOptions = {
    from: "fredenoch1@gmail.com",
    to,
    subject,
    html
  };

  return transporter.sendMail(mailOptions)

}
