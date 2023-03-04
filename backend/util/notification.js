// const nodemailer = require('nodemailer');
const subscribeService = require('../service/subscriber-service')
require('dotenv').config();
const AWS = require('aws-sdk');

// set AWS region
AWS.config.update({region: 'us-west-2'});

// create SES object with your AWS credentials
const ses = new AWS.SES({
    accessKeyId: 'your_access_key_id',
    secretAccessKey: 'your_secret_access_key'
});

// send email using SES
const sendEmail = async (subject, message, toEmail) => {
    const params = {
        Destination: {
            ToAddresses: [toEmail]
        },
        Message: {
            Body: {
                Text: { Data: message }
            },
            Subject: { Data: subject }
        },
        Source: 'your_email_address@example.com'
    };
  
    // send email using SES
    const result = await ses.sendEmail(params).promise();
    console.log(result);
  };
  
// send email to all subscribers using SES
const sendEmailToAllSubscribers = async (subject, message, fromEmail) => {
    for (let subscriber of subscribers) {
      const params = {
          Destination: {
              ToAddresses: [subscriber.email]
          },
          Message: {
              Body: {
                  Text: { Data: message }
              },
              Subject: { Data: subject }
          },
          Source: fromEmail
      };
  
      // send email using SES
      const result = await ses.sendEmail(params).promise();
      console.log(`Email sent to ${subscriber.email}:`, result);
    }
  };
  

// create reusable transporter object using the default SMTP transport
// const transporter = nodemailer.createTransport({
//     host: 'smtp.gmail.com',
//     port: 465,
//     secure: true, // use TLS
//     auth: {
//         user: process.env.NOTICE_EMAIL_ADDRESS,
//         pass: process.env.NOTICE_EMAIL_PASSWORD
//     }
// });

// send email to all subscribers
// const sendEmailToSubscribers = async (user_id, post_id) => {
//     // get list of subscribers from database
//     //TODO: change the page size; what does this return? a list of user ids or objects?
//     const subscribers = await subscribeService.getUserAudiencePage(user_id, 0, 10);
  
//     // create email message
//     let emailMessage = {
//         from: process.env.NOTICE_EMAIL_ADDRESS,
//         subject: subject,
//         text: message
//     };
  
//     // add subscribers' email addresses to the email message
//     emailMessage.bcc = subscribers.map(subscriber => subscriber.email);
  
//     // send email
//     await transporter.sendMail(emailMessage);
//   };  

module.exports = sendEmail;