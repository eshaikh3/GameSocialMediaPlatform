// Nodemailer
const nodemailer = require("nodemailer");

// Google APIs
const { google } = require("googleapis");

// Confiquring Nodemailer and Google Ids
const oAuth2Client = new google.auth.OAuth2(process.env.OAUTH_CLIENT_ID, process.env.OAUTH_CLIENT_SECRET, process.env.OAUTH_REDIRECT_URL)

oAuth2Client.setCredentials({ refresh_token: process.env.OAUTH_REFRESH_TOKEN });

// Function to send emails
module.exports.sendMail = async (email, password) => {
    try {
        const accessToken = await oAuth2Client.getAccessToken();

        const transport = nodemailer.createTransport({
            service: "gmail",
            auth: {
                type: "OAuth2",
                user: "gsmpprj666@gmail.com",
                clientId: process.env.OAUTH_CLIENT_ID,
                clientSecret: process.env.OAUTH_CLIENT_SECRET,
                refreshToken: process.env.OAUTH_REFRESH_TOKEN,
                accessToken: accessToken
            }
        });

        const mailOptions = {
            from: "GSMP <gsmpprj666@gmail.com>",
            to: email,
            subject: "New Password for GSMP account",
            text: "Hello,\n\tThis is your new password to login.\n\tPassword: " + password.password + "\n\n\tPlease after logging in your account, go to settings and change your password.\n\nThank you,\nGaming Social Media Platform",
            html: "<h3>Hello GSMP account holder,</h3><p>This is your new password to login.</p><p>Password: " + password.password + "</p><p><strong>Please after logging in your account, go to settings and change your password.</strong></p><br/>Thank you,<br/>Gaming Social Media Platform"
        }

        const result = await transport.sendMail(mailOptions);

        return "Email was sent successfully!";
        
    } catch (error) {
        return error;
    }
};