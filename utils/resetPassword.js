
export const passwordRecovery = (name, id) => {
    const mailSend =  `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <style>
      body {
        font-family: Arial, sans-serif;
        background-color: #f4f4f4;
        margin: 0;
        padding: 0;
      }
      .container {
        width: 100%;
        max-width: 600px;
        margin: 0 auto;
        background-color: #ffffff;
        padding: 20px;
        box-shadow: 0 2px 3px rgba(0, 0, 0, 0.1);
      }
      .header {
        text-align: center;
        padding: 10px;
        background-color: #007bff;
        color: #ffffff;
      }
      .content {
        padding: 20px;
        line-height: 1.6;
      }
      .button {
        display: inline-block;
        padding: 10px 20px;
        margin: 20px 0;
        background-color: #007bff;
        color: #ffffff;
        text-decoration: none;
        border-radius: 5px;
      }
      .footer {
        text-align: center;
        padding: 10px;
        font-size: 12px;
        color: #777;
      }
    </style>
    <title>Password Recovery</title>
  </head>
  <body>
    <div class="container">
      <div class="header">
        <h1>Password Recovery</h1>
      </div>
      <div class="content">
        <p>Hi ${name},</p>
        <p>
          We received a request to reset your password. Click the button below to reset it:
        </p>
        <a href="http://localhost:3000/password/recovery/${id}" class="button">Reset Password</a>
        <p>
          If you did not request a password reset, please ignore this email or contact support.
        </p>
        <p>Thank you,<br />The PodA Team</p>
      </div>
      <div class="footer">
        <p>PodA © 2024. All rights reserved.</p>
      </div>
    </div>
  </body>
</html>
`
return mailSend;
}