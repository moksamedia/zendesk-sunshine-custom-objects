## Requirements

**Zendesk**: You'll need to [register for a free trial with Zendesk](https://www.zendesk.com/register).

**Google Cloud Platform** account. You'll need this so that you can use the Google Sheets SDK to access your data on the google spreadsheet. Go to [Google Cloud Console](https://console.cloud.google.com/) to sign up.

**Node**: The tutorial was written with Node 12.14.0. You can download NodeJS from [their website](https://nodejs.org/en/download/).

**Yarn**: Head over to [Yarn's website](https://classic.yarnpkg.com/en/docs/install) and install it, if you don't already have it installed. Yarn is a package manager similar to NPM.

**Zapier** free trial account. If you don't already have an account, head over to [Zapier to sign up for a 14-day free trial](https://zapier.com/page/welcome-start/).

## .env file

You need to create a .env file with the following fields:

```bash
ZENDESK_EMAIL={yourZendeskAccountEmail}
ZENDESK_URL=https://{yourZendeskSubdomain}.zendesk.com
ZENDESK_API_TOKEN={yourApiToken}
GOOGLE_SHEET_ID={yourGoogleSheetId}
```

Zendesk account email and subdomain should be pretty clear. You will also need to create an API token 
for us with Zendesk. 

Finally, you need to create a Google sheet with some test data with an ID column and a name column. See below. 
Copy the sheet ID into the .env file.

| ID | Name     |
|----|----------|
| 1  | Liam     |
| 2  | Emma     |
| 3  | Noah     |
| 4  | Olivia   |
| 5  | Ava      |
| 6  | Isabella |
| 7  | James    |

## Enable Google Sheets API & Create OAuth Credentials

You need to enable the Google Sheets API in your Google Cloud Console and download an OAuth token as a  `credentials.json` file.

Open your [Google Cloud Console](https://console.cloud.google.com).

Create a new project for this demo or select the project you'd like to use.

Enable the Google Sheets API. From the **Navigation Menu**, select **API & Services** and click **Dashboard**. Click the blue text button at the top of the frame **ENABLE APIS & SERVICES**. Search for **Google Sheets API** in the search box. Select **Google Sheets API** and enable it.

Now you need to create your OAuth credentials and download them as a `credentials.json` file placed
in the project root directory.

First, configure your OAuth consent screen.
- From the **Navigation Menu**, select **API & Services** and click **OAuth consent screen.**
- Select **External** and click **Create**.
- Fill in the **Application name** with something like `Zendesk Demo`.

Next, create your OAuth credentials.
- From the **Navigation Menu**, select **API & Services** and click **Credentials**.
- Click **CREATE CREDENTIALS** at the top of the frame. Select **OAuth Client ID**.
- For **Application Type**, select **Other**.
- Give the credentials a name, such as `Zendesk Client`.
- Click **Create**.
- Click **OK** to dismiss the popup.
- In the  **OAuth 2.0 Client IDs** table, click the download arrow of the credentials you just created. Copy the 
JSON file to the project root directory and rename it `credentials.json`.

## Run the app

Run the application by opening a shell in the root project directory:

```bash
node index.js
```

The first time you run the application, you will be prompted to follow a link. Open this link in a 
browser. Follow the prompts on screen. When you see the warning that says, "This app isn't verified," 
click **Advanced**. Click **Go to Zendesk**. Review the permissions the app is requesting and click **Allow**. 
Copy the OAuth code from the webpage and past it back in the terminal. This allows the Node application to trade the 
code for a token that gives it read access to your Google sheets.
