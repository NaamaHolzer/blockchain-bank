const mongo = require("mongoose");

module.exports = (db) => {
  let schema = new mongo.Schema({
    chain: Array,
    chainType: String,
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
    let chain = await this.find({ chainType: chainType }).exec();
    chain = chain[0].chain.slice(1, chain[0].chain.length);
    return chain.filter(
      (block) => {return block.action.fromAddress == publicKey.toString() || block.action.toAddress == publicKey.toString()}
    );
  };

  schema.statics.REQUEST_BLOCKS_RANGE = async function (
    chainType,
    publicKey,
    range
  ) {
    let chain = (await this.find({ chainType: chainType }).exec())[0];

    chain = chain.chain.slice(1, chain.length);
    const today = new Date();
    const day = 86400000; // number of milliseconds in a day
    console.log(today);

    const startDate = new Date(today - range * day);

    return chain.filter(
      (block) =>
        (block.action.fromAddress == publicKey ||
          block.action.toAddress == publicKey) &&
        block.action.date >= startDate &&
        block.action.date <= today
    );
  };

  db.model("Blockchain", schema, "Blockchain");
};
