const mongo = require("mongoose");

module.exports = db => {
    let schema = new mongo.Schema({
        amount: { type: Float32Array, required: true, index: true },
        date: { type: Date, required: true, index: true },
        from: { type: String, required: true, unique: true },
        to: { type: String, required: true },
    }, { autoIndex: false });

    schema.statics.CREATE = async function(transaction) {
        return this.create({
            amount: transaction[0],
            date: transaction[1],
            from: transaction[2],
            to: transaction[3],
        });
    };

    schema.statics.UPDATE = async function(idenifier, val) {
        return this.updateOne(idenifier, { $set: val })
    }

    schema.statics.REQUEST = async function() {
        const args = Array.from(arguments);
        if (args.length === 0) {
            return this.find({}).exec();
        }
    }

    db.model('Transaction', schema, 'Transaction'); // if model name === collection name
}