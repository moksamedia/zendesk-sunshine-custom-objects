const api = require('./zendeskApi');

const objectTypeKey = 'client2';

const customObject = {
    "data": {
        "key": objectTypeKey,
        "schema": {
            "properties": {
                "id": {
                    "type": "string",
                    "description": "Unique identifier"
                },
                "name": {
                    "type": "string",
                    "description": "Client name"
                }
            },
            "required": ["id", "name"]
        }
    }
};

const createTypeIfNecessary = async function () {

    try {
        //let deleteResponse = await api.deleteTypeByKey(objectTypeKey);
        console.log("Checking to see if object type exists.");
        let response = await api.getTypeByKey(objectTypeKey);
        console.log(response.status + ' ' + response.statusText);
        if (response.status == 404) {
            console.log("Creating object type.");
            response = await api.createType(customObject);
            console.log(response.status + ' ' + response.statusText);
        }
    }
    catch (error) {
        console.error(error.response.status + ' ' + error.response.statusText);
    }

};


module.exports = {
    createTypeIfNecessary,
    objectTypeKey
};