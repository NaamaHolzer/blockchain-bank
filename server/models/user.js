const mongo = require("mongoose");

module.exports = (db) => {
  let schema = new mongo.Schema(
    {
      firstName: { type: String, required: true, index: true },
      lastName: { type: String, required: true, index: true },
      username: { type: String, required: true, unique: true },
      password: { type: String, required: true },
      privateKey: { type: String },
      publicKey: { type: String },
      admin: Boolean,
      approved: Boolean,
      balance: Number,
      email: String,
      rate: Number,
    },
    { autoIndex: false }
  );

  schema.statics.CREATE = async function (user) {
    return this.create({
      firstName: user.firstName,
      lastName: user.lastName,
      username: user.username,
      password: user.password,
      privateKey: "",
      publicKey: "",
      email: user.email,
      rate: user.rate,
      admin: false,
      approved: false,
      balance: 0,
    });
  };

  schema.statics.UPDATE = async function (identifier, val) {
    return this.updateOne(identifier, { $set: val });
  };

  schema.statics.REQUEST = async function () {
    const args = Array.from(arguments);
    if (args.length === 0) {
      return this.find({}).exec();
    }
  };

  schema.statics.REQUEST_ONE = async function (username) {
    return this.findOne({ username: username });
  };

  schema.statics.DELETE = async function (username) {
    return this.deleteOne({ username: username });
  };

  schema.statics.REQUEST_REQUESTS = async function () {
    return this.find({ approved: false }).select("username").exec();
  };

  db.model("User", schema, "User");
};
