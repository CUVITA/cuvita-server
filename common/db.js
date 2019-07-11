const path = require('path');
const { MongoClient, ObjectId } = require('mongodb');

module.exports = class Database {
  constructor (url="mongodb://localhost:27017", dbname="productionDB") {
    this.url = url;
    this.dbname = dbname;
  }
  async connect () {
    try {
      let db = await MongoClient.connect(this.url, { useNewUrlParser: true });
      return db.db(this.dbname);
    } catch (e) {
      throw Error(e);
    }
  }
  async find(collection, querySelector, queryProjections, querySort) {
    try {
      let db = await this.connect();
      if (!querySort)
        return await db.collection(collection).find(querySelector).project(queryProjections).toArray();
      else
        return await db.collection(collection).find(querySelector).sort(querySort).project(queryProjections).toArray();
    } catch (e) {
      throw Error(e);
    }
  }
  async findOne(collection, querySelector, queryProjections) {
    try {
      let db = await this.connect();
      return await db.collection(collection).findOne(querySelector, { projection: { ...queryProjections } });
    } catch (e) {
      throw Error(e);
    }
  }
  async updateOne(collection, querySelector, updateData, upsert=false) {
    try {
      let db = await this.connect();
      return await db.collection(collection).updateOne(querySelector, updateData, { upsert });
    } catch (e) {
      throw Error(e);
    }
  }
  async insertOne(collection, insertionData) {
    try {
      let db = await this.connect();
      return await db.collection(collection).insertOne(insertionData);
    } catch (e) {
      throw Error(e);
    }
  }

  async insertMany(collection, insertionData) {
    try {
      let db = await this.connect();
      return await db.collection(collection).insertMany(insertionData);
    } catch (e) {
      throw Error(e);
    }
  }
}
