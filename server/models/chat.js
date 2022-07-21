const mongo = require("mongoose");

module.exports = (db) => {
  let schema = new mongo.Schema(
    {
      from: { type: String, required: true, index: true },
      to: { type: String, required: true, index: true },
      content: { type: String, required: true },
      timestamp: { type: Date },
    },
    { autoIndex: false }
  );

  schema.statics.CREATE = async function (message) {
    return this.create({
      from: message.from,
      to: message.to,
      content: message.content,
      timestamp: message.timestamp,
    });
  };

  schema.statics.REQUEST = async function (currentUser, chatUser) {
    return {
      fromCurrentUser: await this.find({
        from: currentUser,
        to: chatUser,
      }).exec(),
      toCurrentUser: await this.find({
        from: chatUser,
        to: currentUser,
      }).exec(),
    };
  };

  db.model("Chat", schema, "Chat");
};
