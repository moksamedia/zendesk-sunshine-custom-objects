require('dotenv').config()
const axios = require('axios');
const zendeskCredentials = require('./zendeskCredentials');
const {objectTypeKey} = require('./createZendeskObjectType');

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

const setObjectRecordByExternalId = function (data) {
    return axiosConfigured.patch(`/api/sunshine/objects/records`, data, {
        headers: {'Content-Type':'application/merge-patch+json'}
    });
};

const deleteObjectRecordByExternalId = function (clientId, key) {
    return axiosConfigured.delete(`/api/sunshine/objects/records?external_id=${clientId}&type=${key}`);
};

module.exports = {
    createType,
    deleteTypeByKey,
    getTypeByKey,
    createObjectRecord,
    updateObjectRecord,
    deleteObjectRecord,
    setObjectRecordByExternalId,
    deleteObjectRecordByExternalId
};
