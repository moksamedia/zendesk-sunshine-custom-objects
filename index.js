require('dotenv').config()
const {google} = require('googleapis');
const googleHelper = require('./googlehelper');
const keypress = require('keypress');
keypress(process.stdin);
const {createTypeIfNecessary, objectTypeKey} = require('./createZendeskObjectType');
const api = require('./zendeskApi');

const spreadsheetId = process.env.GOOGLE_SHEET_ID;


// our naive data structure that we use to keep a local sync
// between data in google doc and data in Zendesk
let data = [];

async function diffData(newData) {
    // iterate through new data, check for new records and records
    // that need to be updated
    for( let clientId in newData) {
        let clientName = newData[clientId];
        if (!data[clientId]) {
            // new record, add
            console.log(`New record found: ${clientId} - ${clientName}`)
            data[clientId] = clientName;
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
        else if (data[clientId] !== clientName) {
            // need to update
            console.log(`Updating record: ${clientId} - ${data[clientId]} to ${clientName}`)
            data[clientId] = clientName;
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
    };
    // iterate through old data, looking for deleted records
    for (let clientId in data) {
        if (!newData[clientId]) {
            // record exists in old data but not new data, delete
            console.log(`Deleting record: ${clientId} - ${data[clientId]}`)
            await api.deleteObjectRecordByExternalId(clientId, objectTypeKey);
        }
    }
}

async function checkForChanges(auth) {

    const sheets = google.sheets({version: 'v4', auth});

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
            console.log("**********************************************");
            console.log(`Headers: ${columnHeaders.join(', ')}`);
            let newDataById = [];
            rows.map((row, index) => {
                console.log(row.join(', '));
                newDataById[row[0]] = row[1]; // Store client names by ID
            });
            console.log("**********************************************");
            try {
                await diffData(newDataById);
            }
            catch (error) {
                console.error(error.response);
            }
            console.log("**********************************************");
        }
        console.log("Press any key to check for new data. Control-C to exit.");
    });

}

createTypeIfNecessary().then(async () => {

    googleHelper(checkForChanges);

    console.log("Press any key to check for new data. Control-C to exit.");

    process.stdin.on('keypress', function (ch, key) {
        if (key && key.ctrl && key.name == 'c') {
            process.stdin.pause();
        }
        else {
            console.log("Polling for data...");
            googleHelper(checkForChanges);
        }
    });

    process.stdin.setRawMode(true);
    process.stdin.resume();

});





