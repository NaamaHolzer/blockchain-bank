const mongo = require("mongoose");

module.exports = (db) => {
  let schema = new mongo.Schema(
    {
      amount: { type: Number, required: true, index: true },
      date: { type: Date, required: true, index: true },
      from: { type: String, required: true, unique: true },
      to: { type: String, required: true },
    },
    { autoIndex: false }
  );

  schema.statics.CREATE = async function (transaction) {
    return this.create({
      amount: transaction.amount,
      date: transaction.date,
      from: transaction.from,
      to: transaction.to,
    });
  };

  schema.statics.UPDATE = async function (idenifier, val) {
    return this.updateOne(idenifier, { $set: val });
  };

  schema.statics.REQUEST_ALL = async function () {
    return this.find({}).exec();
  };

  schema.statics.REQUEST_USER_TRANSACTIONS = async function (username) {
    return this.find({
      $or: [
        {
          from: username,
        },
        {
          to: username,
        },
      ],
    }).exec();
  };

  schema.statics.REQUEST_TRANSACTIONS_RANGE = async function (username, range) {
    console.log("in model");
    const today = new Date();
    const day = 86400000; // number of milliseconds in a day
    console.log(today);

    const startDate = new Date(today - range * day);

    console.log(startDate);

    return this.find({
      $or: [
        {
          from: username,
        },
        {
          to: username,
        },
      ],
      date: {
        $gte: startDate,
        $lt: today,
      },
    }).exec();
  };

  db.model("Transaction", schema, "Transaction"); // if model name === collection name
};
