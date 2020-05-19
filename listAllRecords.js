require('dotenv').config()
const api = require('./zendeskApi');
const {objectTypeKey} = require('./createZendeskObjectType');

api.getObjectRecords(objectTypeKey).then(results => {
   if (results && results.data && results.data.data) {
       results.data.data.forEach(item => {
           console.log(`${item.attributes.id} ${item.attributes.name}`);
       });
   }
});