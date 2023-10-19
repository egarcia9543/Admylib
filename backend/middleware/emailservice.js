const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL,
        pass: process.env.EMAIL_PASS,
    },
});

exports.sendEmail = async (destinatary, subject, body) => {
    const mailOptions = {
        from: process.env.EMAIL,
        to: destinatary,
        subject: subject,
        text: body,
    };
    try {
        await transporter.sendMail(mailOptions);
        return true;
    } catch (error) {
        console.error(error);
        return false;
    }
};
