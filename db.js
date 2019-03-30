const { MongoClient, ObjectId } = require('mongodb');

/**
 * CUVita Server Side Implementations - Database CRUDs
 * @author relubwu
 * @version 0.1.5
 * @copyright  © CHINESE UNION 2019
 */

/**
 * FIELD
 */
const DATABASE_URL = 'mongodb://localhost:27017';
const DATABASE_NAME = 'cuvita';

/**
 * @see https://docs.mongodb.com/manual/reference/method/db.collection.find/
 */
async function find(collection, querySelector, queryProjections, querySort) {
  try {
    db = await MongoClient.connect(DATABASE_URL, { useNewUrlParser: true });
    if (!querySort)
      data = await db.db(DATABASE_NAME).collection(collection).find(querySelector).project(queryProjections).toArray();
    else
      data = await db.db(DATABASE_NAME).collection(collection).find(querySelector).sort(querySort).project(queryProjections).toArray();
    return data;
  } catch (e) {
    throw Error(e);
  }
}

/**
 * @see https://docs.mongodb.com/manual/reference/method/db.collection.findOne/
 */
async function findOne(collection, querySelector, queryProjections) {
  try {
    db = await MongoClient.connect(DATABASE_URL, { useNewUrlParser: true });
    data = await db.db(DATABASE_NAME).collection(collection).findOne(querySelector, { projection: { ...queryProjections } });
    return data;
  } catch (e) {
    throw Error(e);
  }
}

/**
 * @see https://docs.mongodb.com/manual/reference/method/db.collection.update/
 */
async function updateOne(collection, querySelector, updateData) {
  try {
    db = await MongoClient.connect(DATABASE_URL, { useNewUrlParser: true });
    result = await db.db(DATABASE_NAME).collection(collection).update(querySelector, updateData);
    return result;
  } catch (e) {
    throw Error(e);
  }
}

/**
 * @see https://docs.mongodb.com/manual/reference/method/db.collection.insert/
 */
async function insert(collection, insertionData) {
  try {
    db = await MongoClient.connect(DATABASE_URL, { useNewUrlParser: true });
    result = await db.db(DATABASE_NAME).collection(collection).insert(insertionData);
    return result;
  } catch (e) {
    throw Error(e);
  }
}

module.exports = {
  find,
  findOne,
  updateOne,
  insert,
  ObjectId
}
