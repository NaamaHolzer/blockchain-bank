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

  schema.statics.REQUEST_OPEN_LOANS = async function () {
    let chain = await this.find({ chainType: "loan" }).exec();
    chain = chain[0].chain.slice(1, chain[0].chain.length);
    if (chainType === "loan") {
      chain = chain.filter((block) => {
        return !block.action.isClosed;
      });
    }
    return chain;
  };

  schema.statics.REQUEST_ALL = async function (chainType) {
    let chain = await this.find({ chainType: chainType }).exec();
    chain = chain[0].chain.slice(1, chain[0].chain.length);
    return chain;
  };

  schema.statics.REQUEST_USER_BLOCKS = async function (chainType, publicKey) {
    let chain = await this.find({ chainType: chainType }).exec();
    chain = chain[0].chain.slice(1, chain[0].chain.length);

    chain = chain.filter((block) => {
      return (
        block.action.fromAddress === publicKey.toString() ||
        block.action.toAddress === publicKey.toString()
      );
    });
    if (chainType === "loan") {
      chain = chain.filter((block) => {
        return !block.action.isClosed;
      });
    }
    return chain;
  };

  schema.statics.REQUEST_USER_DEBTS = async function (publicKey) {
    let chain = await this.find({ chainType: "loan" }).exec();
    chain = chain[0].chain.slice(1, chain[0].chain.length);
    return chain.filter((block) => {
      return (
        block.action.toAddress === publicKey.toString() &&
        !block.action.isClosed
      );
    });
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
    const startDate = new Date(today - range * day);
    const res = chain.filter(
      (block) =>
        (block.action.fromAddress == publicKey ||
          block.action.toAddress == publicKey) &&
        block.action.date >= startDate &&
        block.action.date <= today
    );
    if (chainType === "loan") {
      res = res.filter((block) => {
        return !block.action.isClosed;
      });
    }
    return res;
  };

  schema.statics.REQUEST_ALL_BLOCKS_RANGE = async function (chainType, range) {
    let chain = (await this.find({ chainType: chainType }).exec())[0];

    chain = chain.chain.slice(1, chain.length);
    const today = new Date();
    const day = 86400000; // number of milliseconds in a day

    const startDate = new Date(today - range * day);

    chain = chain.filter(
      (block) => block.action.date >= startDate && block.action.date <= today
    );
    if (chainType === "loan") {
      chain = chain.filter((block) => {
        return !block.action.isClosed;
      });
    }
    return chain;
  };

  schema.statics.UPDATE_LOAN = async function (id) {
    let chain = await this.find({ chainType: "loan" }).exec();
    chain = chain[0].chain;
    for (let block in chain) {
      if (chain[block].action.id === id) {
        chain[block].action.isClosed = true;
        break;
      }
    }
    return this.updateOne({ chainType: "loan" }, { $set: { chain: chain } });
  };

  db.model("Blockchain", schema, "Blockchain");
};
