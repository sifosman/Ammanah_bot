// Load environment variables from .env
require('dotenv').config();

// Import required packages
const express = require('express');
const bodyParser = require('body-parser');
const sgMail = require('@sendgrid/mail');

// Initialize Express app
const app = express();
const port = process.env.PORT || 3000;

// Set up SendGrid API Key
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

// Middleware to parse JSON request bodies
app.use(bodyParser.json());

// Webhook endpoint
app.post('/webhook', (req, res) => {
    const webhookData = req.body;  // Capture the webhook data

    console.log('Webhook data received:', webhookData);

    // Function to send an email using SendGrid
    async function sendEmail(data) {
        const msg = {
            to: 'sifosman@gmail.com', // Change to the recipient's email address
            from: 'dev@ampbutchery.co.za', // Use the email verified with SendGrid
            subject: 'New Webhook Data Received',
            text: `Here is the data from the webhook: ${JSON.stringify(data)}`, // Include the webhook data in the email
        };

        try {
            await sgMail.send(msg);
            console.log('Email sent successfully');
        } catch (error) {
            console.error('Error sending email:', error.response ? error.response.body.errors : error.message);
        }
    }

    // Send the email with the received data
    sendEmail(webhookData);

    // Respond to the webhook with a success message
    res.status(200).send('Webhook received and email sent.');
});

// Start the server
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
