module.exports = {
    emailAddress: process.env.ZENDESK_EMAIL,
    url: process.env.ZENDESK_URL,
    token: process.env.ZENDESK_API_TOKEN,
    base64Basic: new Buffer.from(`${process.env.ZENDESK_EMAIL}/token:${process.env.ZENDESK_API_TOKEN}`).toString('base64')
};


