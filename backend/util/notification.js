const nodemailer = require('nodemailer');
require('dotenv').config();

const from_email = process.env.NOTICE_EMAIL_ADDRESS;

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
	const emailMessage = {
		from: from_email,
		to: subscriberEmail,
		subject,
		text: message
	};

	try {
		const result = await transporter.sendMail(emailMessage);
		return result.accepted;
	} catch (err) {
		console.log('Cannot send the email: ' + err);
	}
};

module.exports = {
	sendEmailToSubscriber
};
