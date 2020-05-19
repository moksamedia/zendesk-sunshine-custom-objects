require('dotenv').config();
const axios = require('axios');
const zendeskCredentials = {
    url: process.env.ZENDESK_URL,
    base64Basic: new Buffer.from(`${process.env.ZENDESK_EMAIL}/token:${process.env.ZENDESK_API_TOKEN}`).toString('base64')
};
    
    

const axiosConfigured = axios.create({
    baseURL: zendeskCredentials.url,
    port: 443,
    headers: {
        'Content-Type': 'application/json',
        'Authorization' : "Basic " + zendeskCredentials.base64Basic
    }
});

const createType = function(customObjectType) {
    console.log("Creating object type with data: " + JSON.stringify(customObjectType));
    return axiosConfigured.post('/api/sunshine/objects/types', customObjectType);
};

const deleteTypeByKey = function(key) {
    return axiosConfigured.delete(`/api/sunshine/objects/types/${key}`);
};

const getTypeByKey = function(key) {
    return axiosConfigured.get(`/api/sunshine/objects/types/${key}`, {
        // override status validation so that 404 Not Found does not throw error
        validateStatus: (status) => (200 <= status < 300) || (status == 404)
    });
};

const createObjectRecord = function (data) {
    return axiosConfigured.post('/api/sunshine/objects/records', data);
};

const updateObjectRecord = function (zendeskId, data) {
    return axiosConfigured.put(`/api/sunshine/objects/records/${zendeskId}`, data);
};

const deleteObjectRecord = function (zendeskId) {
    return axiosConfigured.delete(`/api/sunshine/objects/records/${zendeskId}`);
};

const getObjectRecords = function (type) {
    return axiosConfigured.get(`/api/sunshine/objects/records?type=${type}`);
};


/*
    Creates the object, if object with external_id doesn't already exist,
    otherwise updates existing object.
 */
const setObjectRecordByExternalId = function (data) {
    return axiosConfigured.patch(`/api/sunshine/objects/records`, data, {
        headers: {'Content-Type':'application/merge-patch+json'}
    });
};

const deleteObjectRecordByExternalId = function (clientId, key) {
    return axiosConfigured.delete(`/api/sunshine/objects/records?external_id=${clientId}&type=${key}`);
};

async function asyncForEach(array, callback) {
    for (let index = 0; index < array.length; index++) {
        await callback(array[index], index, array);
    }
}

const deleteAllObjectRecordsByType = async function (key) {
    let results = await axiosConfigured.get(`/api/sunshine/objects/records?type=${key}`);
    if (results.data.data) {
        let ids = results.data.data.reduce( (acc, curr) => {
            acc.push(curr.id);
            return acc;
        }, []);
        await asyncForEach(ids, async id => {
            await axiosConfigured.delete(`/api/sunshine/objects/records/${id}`);
        });
    }
};

module.exports = {
    createType,
    deleteTypeByKey,
    getTypeByKey,
    createObjectRecord,
    updateObjectRecord,
    deleteObjectRecord,
    getObjectRecords,
    setObjectRecordByExternalId,
    deleteObjectRecordByExternalId,
    deleteAllObjectRecordsByType
};
