const dbPromise = require('./db');
function toJson(doc) {
return doc ? doc.toJSON() : null;
}
async function findByDeviceId(devicesCollection, DeviceId) {
return devicesCollection.findOne({
selector: { DeviceId }
}).exec();
}
async function ensureUniqueDevice(devicesCollection, DeviceId, excludedId = null) {
const existing = await findByEmail(devicesCollection, DeviceId);
if (existing && existing.primary !== excludedId) {
throw new Error('Device id déjà utilisée');
}
}
module.exports = {
device: async ({ id }) => {
const { devices } = await dbPromise;
const doc = await devices.findOne(id).exec();
return toJson(doc);
},
devices: async () => {
const { devices } = await dbPromise;
const docs = await devices.find().exec();
return docs.map((doc) => doc.toJSON());
},
addDevice: async ({ userId, name, type, serialNumber, status }) => {
const { devices, persistDevices, createId } = await dbPromise;
await ensureUniqueEmail(devices, email);
const inserted = await devices.insert({
id: createId(),
DeviceId,
name,
type,
serialNumber,
status
});
await persistDevices(devices);
return inserted.toJSON();
},
updateDevice: async ({ id,userId, name, type, serialNumber, status }) => {
const { devices, persistDevices } = await dbPromise;
const doc = await devices.findOne(id).exec();
if (!doc) {
return null;
}
await ensureUniqueUser(devices, userId, id);
const updatedDoc = await doc.incrementalPatch({
DeviceId,
name,
type,
serialNumber,
status
});
await persistDevices(devices);
return updatedDoc.toJSON();
},
deleteDevice: async ({ id }) => {
const { devices, persistDevices } = await dbPromise;
const doc = await devices.findOne(id).exec();
if (!doc) {
return false;
}
await doc.remove();
await persistDevices(devices);
return true;
}
};