require('dotenv').config();
const zendeskCredentials = {
    url: process.env.ZENDESK_URL,
    base64Basic: new Buffer.from(`${process.env.ZENDESK_EMAIL}/token:${process.env.ZENDESK_API_TOKEN}`).toString('base64')
};

console.log("Basic " + zendeskCredentials.base64Basic);