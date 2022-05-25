const mongo = require("mongoose");

module.exports = (db) => {
  let schema = new mongo.Schema({
    chain: Array ,
    chainType: String ,
  });

  schema.statics.CREATE = async function (type, blockchain) {
    return this.create({
      chain: blockchain,
      chainType: type,
    });
  };

  schema.statics.UPDATE = async function (idenifier, val) {
    return this.updateOne(idenifier, { $set: val });
  };

  schema.statics.REQUEST = async function (chainType) {
    return this.find({ chainType: chainType }).exec();
  };

  schema.statics.REQUEST_USER_BLOCKS = async function (chainType, publicKey) {
    const chain = this.find({ chainType: chainType }).exec();
    return chain.filter(
      (block) => block.fromAddress == publicKey || block.toAddress == publicKey
    );
  };

  schema.statics.REQUEST_BLOCKS_RANGE = async function (chainType, publicKey, range) {
    const chain = this.find({ chainType: chainType }).exec();

    const today = new Date();
    const day = 86400000; // number of milliseconds in a day
    console.log(today);

    const startDate = new Date(today - range * day);

    return chain.filter(
      (block) => (block.action.fromAddress == publicKey || block.action.toAddress == publicKey)
      && (block.action.date >= startDate && block.action.date <= today));
  };

  db.model("Blockchain", schema, "Blockchain");
};
