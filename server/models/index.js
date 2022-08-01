const mongoose = require("mongoose");
const uri =
  "mongodb+srv://naamaholzer:" + process.env.MONGO_PASSWORD + "@cluster0.xsp95.mongodb.net/blockchain-bank?retryWrites=true&w=majority";
mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });
const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.on("open", function () {
  console.log("Connection Successful!");
});
require("./user")(db);
require("./loan")(db);
require("./transaction")(db);
require("./blockchain")(db);
require("./chat")(db);
module.exports = (model) => db.model(model);
