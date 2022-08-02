const mongo = require("mongoose");

module.exports = (db) => {
  let schema = new mongo.Schema(
    {
      channelName: { type: String, required: true, index: true },
      messages: { type: Array },
    },
    { autoIndex: false }
  );

  schema.statics.CREATE = async function (channelName) {
    return this.create({
      channelName: channelName,
      messages: [],
    });
  };

  schema.statics.REQUEST = async function (channelName) {
    return this.find({ channelName: channelName }).exec();
  };

  schema.statics.UPDATE = async function (idenifier, val) {
    return this.updateOne(idenifier, { $set: val });
  };

  db.model("Chat", schema, "Chat");
};
