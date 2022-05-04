const mongo = require("mongoose");

module.exports = db => {
    let schema = new mongo.Schema({
        firstName: { type: String, required: true, index: true },
        lastName: { type: String, required: true, index: true },
        username: { type: String, required: true, unique: true },
        password: { type: String, required: true },
        admin: Boolean,
        approved: Boolean,
    }, { autoIndex: false });

    schema.statics.CREATE = async function(user) {
        return this.create({
            firstName: user[0],
            lastName: user[1],
            username: user[2],
            password: user[3],
            admin: user[4],
            approved: user[5]
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

    db.model('User', schema, 'User'); // if model name === collection name
}