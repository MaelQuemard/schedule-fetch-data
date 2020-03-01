const schedule = require('node-schedule')
const fetch = require('node-fetch')
const mongoClient = require('mongodb').MongoClient
const assert = require('assert')

require('dotenv').config()

const dbName = process.env.DB_MONGO_DBNAME
const url = process.env.DB_MONGO_CONNECTION_STRING

const flattenObject = (obj, prefix = '') =>
  Object.keys(obj).reduce((acc, k) => {
    const pre = prefix.length ? prefix + '_' : '';
    if (typeof obj[k] === 'object' && !(obj[k] instanceof Array)) Object.assign(acc, flattenObject(obj[k], pre + k));
    else acc[pre + k] = obj[k];
    return acc;
  }, {});

const insertDocuments = function (db, documents, callback) {
    // Get the documents collection
    const collection = db.collection(prcess.env.DB_MONGO_COLLECTION);
    // Insert some documents
    collection.insertMany(documents, function (err, result) {
        assert.equal(err, null);
        callback(result);
    });
}

var j = schedule.scheduleJob('0 */12 * * *', function () {
    mongoClient.connect(url, function (err, client) {
        assert.equal(null, err);
        console.log("Connected successfully to server");

        const db = client.db(dbName);

        fetch(process.env.API_URL)
            .then(result => result.json())
            .then(json => {
                var documents = []
                for (const key in json) {
                    var element = json[key]
                    element.createdDate = new Date()
                    element.nodeName = key
                    element = flattenObject(element)
                    documents.push(element)
                }
                insertDocuments(db, documents, () => {
                    client.close()
                })
            })
    });
});
