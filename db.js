const path = require('path');
const { URL, NAME, COLLECTIONS } = require(path.join(__dirname, 'config', 'db.json'));
const { MongoClient, ObjectId } = require('mongodb');

/**
 * CUVita Server Side Implementations - Database CRUDs
 * @version 0.1.6
 */

/**
 * [find description]
 * @param  {[type]} collection       [description]
 * @param  {[type]} querySelector    [description]
 * @param  {[type]} queryProjections [description]
 * @param  {[type]} querySort        [description]
 * @return {[type]}                  [description]
 */
async function find(collection, querySelector, queryProjections, querySort) {
  try {
    db = await MongoClient.connect(URL, { useNewUrlParser: true });
    if (!querySort)
      data = await db.db(NAME).collection(collection).find(querySelector).project(queryProjections).toArray();
    else
      data = await db.db(NAME).collection(collection).find(querySelector).sort(querySort).project(queryProjections).toArray();
    return data;
  } catch (e) {
    throw Error(e);
  }
}

/**
 * [findOne description]
 * @param  {[type]} collection       [description]
 * @param  {[type]} querySelector    [description]
 * @param  {[type]} queryProjections [description]
 * @return {[type]}                  [description]
 */
async function findOne(collection, querySelector, queryProjections) {
  try {
    db = await MongoClient.connect(URL, { useNewUrlParser: true });
    data = await db.db(NAME).collection(collection).findOne(querySelector, { projection: { ...queryProjections } });
    return data;
  } catch (e) {
    throw Error(e);
  }
}

/**
 * [updateOne description]
 * @param  {[type]} collection    [description]
 * @param  {[type]} querySelector [description]
 * @param  {[type]} updateData    [description]
 * @return {[type]}               [description]
 */
async function updateOne(collection, querySelector, updateData) {
  try {
    db = await MongoClient.connect(URL, { useNewUrlParser: true });
    result = await db.db(NAME).collection(collection).updateOne(querySelector, updateData);
    return result;
  } catch (e) {
    throw Error(e);
  }
}

/**
 * [insert description]
 * @param  {[type]} collection    [description]
 * @param  {[type]} insertionData [description]
 * @return {[type]}               [description]
 */
async function insert(collection, insertionData) {
  try {
    db = await MongoClient.connect(URL, { useNewUrlParser: true });
    result = await db.db(NAME).collection(collection).insert(insertionData);
    return result;
  } catch (e) {
    throw Error(e);
  }
}

/**
 * [exports description]
 * @type {Object}
 */
module.exports = {
  ObjectId,
  find,
  findOne,
  updateOne,
  insert,
  COLLECTIONS
}
