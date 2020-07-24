const MongoClient = require('mongodb');
const { MongoClient: MongoDB, Db } = require('mongodb');
const mongodbUri = require('mongodb-uri');

let _db;

function initDb(dbUrl, callback) {
    if (_db) {
        console.warn('Trying to init DB again!');
        return callback(null, _db);
    }
    MongoClient.connect(dbUrl, { useNewUrlParser: true, useUnifiedTopology: true }, connected)

    function connected(err, client) {
        if (err) {
            return callback(err);
        }

        dbUrl = getDbUri(dbUrl);
        const dbUriObj = mongodbUri.parse(dbUrl);
        
        /** @type {Db} */
        const db = client.db(dbUriObj.database);
        
        db.users = db.collection('users');
        db.sessions = db.collection('sessions');

        _db = db;
        return callback(null, _db);
    }
}

function getDb() {
    return _db;
}

function getDbUri(dbUrl) {
    const dbUriObj = mongodbUri.parse(dbUrl);
    // dbUriObj.database = 'epic-auto-claim';
    // dbUriObj.database = 'epic-auto';
    return mongodbUri.format(dbUriObj);
};

module.exports = {
    getDbUri,
    getDb,
    initDb
}