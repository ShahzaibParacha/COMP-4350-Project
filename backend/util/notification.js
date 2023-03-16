const nodemailer = require('nodemailer');
// const subscribeService = require('../service/subscriber-service')
require('dotenv').config();

const from_email = process.env.NOTICE_EMAIL_ADDRESS;

// create reusable transporter object using the default SMTP transport
const transporter = nodemailer.createTransport({
	service: 'gmail',
	// host: 'smtp.gmail.com',
	port: 465,
	secure: true, // use TLS
	auth: {
		user: process.env.NOTICE_EMAIL_ADDRESS,
		pass: process.env.NOTICE_EMAIL_PASSWORD
	}
});

// send email to all subscribers
const sendEmailToSubscriber = async (subscriberEmail, subject, message) => {
	// create email message
	const emailMessage = {
		from: from_email,
		to: subscriberEmail,
		subject,
		text: message
		// html:
	};

	try {
		const result = await transporter.sendMail(emailMessage);
		// console.log("Email sent to: " + result.accepted);
		return result.accepted;
	} catch (err) {
		console.log('Cannot send the email: ' + err);
	}
};

module.exports = {
	sendEmailToSubscriber
};
