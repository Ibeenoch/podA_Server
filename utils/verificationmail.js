
export const verificationMail = (name) => {
    const mailSend =  `
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <link rel="stylesheet" href="./index.css" />
    <title>PodA</title>
  </head>
  <body>
    <div class="holder">
      <div class="sub_holder">
        <!-- <div class="image_holder">
          <img src="header-logo.svg" alt="PodA" />
        </div> -->
        <div class="content">
          <p class="name">Dear ${name}</p>
          <p class="main">
            We're delighted to inform you that your subscription to our podcast
            system has been successfully processed. Welcome onboard!
          </p>
          <p class="main">
            PodA is a platform that simplifies the creation and consumption of
            podcasts and audiobooks.
          </p>
          <p class="main">
            You can read more about PodA from our
            <a href="https://chat.whatsapp.com/FyWvkDlbaZK6fVIvQgq1ct"
              >community.</a
            >
          </p>
          <p class="main">
            You will gain access to thought-provoking discussions and enriching
            content covering various topics
          </p>
          <p class="main">
            By being a part of our newsletter community, you will receive
            updates on the latest podcast releases, upcoming events, and
            exclusive offers.
          </p>
          <p class="main">
            Thank you for choosing to be part of our community. If you have any
            questions or feedback, please don't hesitate to reach out.
          </p>
          <p class="main">Regards,</p>
          <p class="end"><div>Joseph Chisom Ofonagoro</div> Co-founder, <div> PodA.</div></p>
        </div>
      </div>
    </div>
  </body>
</html>
`
return mailSend;
}