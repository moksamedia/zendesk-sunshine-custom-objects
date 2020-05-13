const {google} = require('googleapis');
const googleHelper = require('./googlehelper');
const keypress = require('keypress');
keypress(process.stdin);

const spreadsheetId = '19E7OiERGMqtbDGlJxWbnzsPLIvaoUX1RQIrE68nYJbI';

const pollingIntervalSeconds = 30;

let lastLength = 1;

function watchChanges(auth) {

    const sheets = google.sheets({version: 'v4', auth});

    sheets.spreadsheets.values.get({
        spreadsheetId: spreadsheetId,
        range: 'A:C',
    }, (err, res) => {
        if (err) return console.log('The API returned an error: ' + err);
        const rows = res.data.values;
        if (!rows.length) {
            console.log('No data found.');
        }
        else if (rows.length <= lastLength) {
            console.log('No new data.');
        }
        else if (rows.length && rows.length > lastLength) {
            // Print columns A and E, which correspond to indices 0 and 4.
            const columnHeaders = rows[0];
            const newData = rows.slice(lastLength);
            console.log("**********************************************");
            console.log(`Headers: ${columnHeaders.join(', ')}`);
            newData.map((row, index) => {
                console.log(row.join(', '));
            });
            console.log("**********************************************");
            lastLength = rows.length;
        }
        console.log("Press any key to check for new data. Control-C to exit.");
    });

}

console.log("Press any key to check for new data. Control-C to exit.");

process.stdin.on('keypress', function (ch, key) {
    console.log("Polling for data...");
    googleHelper(watchChanges);
    if (key && key.ctrl && key.name == 'c') {
        process.stdin.pause();
    }
});

process.stdin.setRawMode(true);
process.stdin.resume();



