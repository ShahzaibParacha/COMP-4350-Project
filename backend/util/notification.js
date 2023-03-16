 const nodemailer = require('nodemailer');
// const subscribeService = require('../service/subscriber-service')
require('dotenv').config();

const from_email = process.env.NOTICE_EMAIL_ADDRESS

// create reusable transporter object using the default SMTP transport
let transporter = nodemailer.createTransport({
    service: 'gmail',
    //host: 'smtp.gmail.com',
    port: 465,
    secure: true, // use TLS
    auth: {
        user: process.env.NOTICE_EMAIL_ADDRESS,
        pass: process.env.NOTICE_EMAIL_PASSWORD
    },
    tls: {
      rejectUnauthorized: false
    }
});

// send email to all subscribers
const sendEmailToSubscriber = async (subscriberEmail, subject, message) => {
  // create email message
  let emailMessage = {
      from: from_email,
      to: subscriberEmail,
      subject: subject,
      text: message,
      //html:
  };

  await transporter.sendMail(emailMessage)
  .then((result)=>{
    console.log(`Email sent to ${subscriberEmail}:`);
  })
  .catch((err)=>{
    console.log("Cannot send the email: " + err)
  })
};

//AWS SES BACKUP:
// const AWS = require('aws-sdk');
// set AWS region
// AWS.config.update({region: 'us-east-2'});

// create SES object with your AWS credentials
// const ses = new AWS.SES({
//     accessKeyId: process.env.SES_ACCESS_KEY_ID,
//     secretAccessKey: process.env.SES_SECRETE_ACCESS_KEY
// });
  
// // send email to all subscribers using SES
// const sendEmailToAllSubscribers = async ( subscriberEmails, subject, message) => {
//     for (let email of subscriberEmails ) {
//       const params = {
//           Destination: {
//               ToAddresses: [email]
//           },
//           Message: {
//             Body: {
//               Html: {
//                 Charset: 'UTF-8',
//                 Data: '<p>Notification message goes here</p>'
//               },
//               Text: {
//                 Charset: 'UTF-8',
//                 Data: 'Notification message goes here'
//               }
//             },
//             Subject: {
//               Charset: 'UTF-8',
//               Data: 'Notification subject goes here'
//             }
//           },
//           Source: from_email
//       };
  
//       // send email using SES
//       console.log("start to send email...")
//       console.log(params)
//       const result = await ses.sendEmail(params).promise()
//       .then((result)=>{
//         console.log(`Email sent to ${email}:`);
//       })
//       .catch((err)=>{
//         console.log(err)
//       })
      
//     }
//   };

module.exports = {
    sendEmailToSubscriber,
};