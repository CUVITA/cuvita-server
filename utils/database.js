const { MongoClient, ObjectId } = require('mongodb');

const DATABASE_NAME = require('minimist')(process.argv.slice(2)).d;
const DATABASE_URL = "mongodb://localhost:27017"
const DATABASE_AUTH = { username: "api", password: "EGKCyzI2nxVdjAveiAzsfwP9p" };
let db;

async function connect () {
  let connection = await MongoClient.connect(DATABASE_URL, {
    useNewUrlParser: true,
    authSource: DATABASE_NAME,
    auth: DATABASE_AUTH
  });
  db = connection.db(DATABASE_NAME);
}

connect();

module.exports = {
  find: async function (collection, querySelector, queryOptions) {
    try {
      return (await db.collection(collection).find(querySelector, queryOptions)).toArray();
    } catch (e) {
      throw Error(e);
    }
  },
  findOne: async function (collection, querySelector, queryOptions) {
    try {
      return await db.collection(collection).findOne(querySelector, queryOptions);
    } catch (e) {
      throw Error(e);
    }
  },
  findOneAndUpdate: async function (collection, querySelector, updateData, queryAndUpdateOptions) {
    try {
      return await db.collection(collection).findOneAndUpdate(querySelector, updateData, queryAndUpdateOptions);
    } catch (e) {
      throw Error(e);
    }
  },
  updateOne: async function (collection, querySelector, updateData, updateOptions) {
    try {
      return await db.collection(collection).updateOne(querySelector, updateData, updateOptions);
    } catch (e) {
      throw Error(e);
    }
  },
  insertOne: async function (collection, insertionData) {
    try {
      return await db.collection(collection).insertOne(insertionData);
    } catch (e) {
      throw Error(e);
    }
  },
  insertMany: async function(collection, insertionData) {
    try {
      return await db.collection(collection).insertMany(insertionData);
    } catch (e) {
      throw Error(e);
    }
  },
  ObjectId
}
