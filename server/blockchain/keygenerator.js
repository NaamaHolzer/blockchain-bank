const EC = require("elliptic").ec;

module.exports.getKeys = function () {
  const ec = new EC("secp256k1"); // bitcoin wallets algorithm.
  const key = ec.genKeyPair();
  const public = key.getPublic("hex");
  const private = key.getPrivate("hex");
  return {
    privateKey: private,
    publicKey: public,
  };
};
