require('dotenv').config()
const {google} = require('googleapis');
const googleHelper = require('./googlehelper');
const keypress = require('keypress');
keypress(process.stdin);
const {createTypeIfNecessary, objectTypeKey} = require('./createZendeskObjectType');
const api = require('./zendeskApi');

// Load the Google Sheet ID from the .env file
const spreadsheetId = process.env.GOOGLE_SHEET_ID;

// Our naive data structure that we use to keep a local sync
// between data in google doc and data in Zendesk
let data = [];

async function createOrUpdateRecord(clientId, clientName) {
    let response = await api.setObjectRecordByExternalId({ data: {
            type: objectTypeKey,
            external_id: clientId,
            attributes: {
                id: clientId,
                name: clientName
            }
        }});
    console.log(response.status + ' ' + response.statusText);
}

async function createNewRecord(clientId, clientName) {
    let response = await api.createObjectRecord({ data: {
            type: objectTypeKey,
            external_id: clientId,
            attributes: {
                id: clientId,
                name: clientName
            }
        }});
    console.log(response.status + ' ' + response.statusText);
}

async function deleteRecord(clientId) {
    let response = await api.deleteObjectRecordByExternalId(clientId, objectTypeKey);
    console.log(response.status + ' ' + response.statusText);
}

// This compares the google sheet to the data array using the ID
// column as a unique identifier, and if any differences are found,
// updates the data on Zendesk as required.
async function diffData(newData) {

    // iterate through new data, check for new records and records
    // that need to be updated
    for( let clientId in newData) {
        let clientName = newData[clientId];
        if (!data[clientId]) {
            // new record, add
            console.log(`New record found: ${clientId} - ${clientName}`)
            data[clientId] = clientName;
            await createNewRecord(clientId, clientName);
        }
        else if (data[clientId] !== clientName) {
            // need to update
            console.log(`Updating record: ${clientId} - ${data[clientId]} to ${clientName}`)
            data[clientId] = clientName;
            await createOrUpdateRecord(clientId, clientName);
        }
    };
    // iterate through old data, looking for deleted records
    for (let clientId in data) {
        if (!newData[clientId]) {
            // record exists in old data but not new data, delete
            console.log(`Deleting record: ${clientId} - ${data[clientId]}`);
            await deleteRecord(clientId);
        }
    }

}

// Retrieves the data from the google sheet
async function checkForChanges(auth) {

    const sheets = google.sheets({version: 'v4', auth});

    console.log("Loading data from Google sheet")
    sheets.spreadsheets.values.get({
        spreadsheetId: spreadsheetId,
        range: 'A:C',
    }, async (err, res) => {
        if (err) return console.log('The API returned an error: ' + err);
        const rows = res.data.values;
        if (!rows.length) {
            console.log('No data found.');
        }
        else if (rows.length) {
            // Print columns A and E, which correspond to indices 0 and 4.
            const columnHeaders = rows[0];
            console.log(`${columnHeaders.join(', ')}`);
            let newDataById = [];
            rows.slice(1).map((row, index) => {
                console.log(row.join(', '));
                newDataById[row[0]] = row[1]; // Store client names by ID
            });
            try {
                await diffData(newDataById);
            }
            catch (error) {
                console.error(error.response);
            }
        }
    });

}

// Creates the Sunshine custom object type, if it hasn't already been
// created, and then checks for updated data when user presses a key
createTypeIfNecessary().then(async () => {

    // load data into local cache
    console.log("Loading data from Zendesk into local cache");
    let results = await api.getObjectRecords(objectTypeKey);
    if (results && results.data && results.data.data) {
        results.data.data.forEach(record => {
           data[record.attributes.id] = record.attributes.name;
           console.log(`Record found: ${record.attributes.id} - ${record.attributes.name}`)
        });
    }

    googleHelper(checkForChanges)

});




