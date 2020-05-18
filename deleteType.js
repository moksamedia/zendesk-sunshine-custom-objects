require('dotenv').config()
const api = require('./zendeskApi');

// Usage: node ./deleteType.js <type name>
const objectTypeKey = process.argv[2];
console.log("Deleting type :" + objectTypeKey);

/*
    Deletes all the records for the type, then deletes
    the type itself.
 */
api.deleteAllObjectRecordsByType(objectTypeKey).then(() => {
    api.deleteTypeByKey(objectTypeKey);
});