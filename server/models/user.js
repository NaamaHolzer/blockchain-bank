const mongo = require("mongoose");

module.exports = db => {
    let schema = new mongo.Schema({
        firstName: { type: String, required: true, index: true },
        lastName: { type: String, required: true, index: true },
        username: { type: String, required: true, unique: true },
        password: { type: String, required: true },
        admin: Boolean,
        approved: Boolean,
        balance: Number,
    }, { autoIndex: false });

    schema.statics.CREATE = async function(user) {
        console.log("In create", user)
        return this.create({
            firstName: user.firstName,
            lastName: user.lastName,
            username: user.username,
            password: user.password,
            admin: false,
            approved: false,
            balance: 0
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

    schema.statics.REQUEST_ONE = async function(username) {
        return this.findOne({ username: username });
    }

    schema.statics.DELETE = async function(username) {
        return this.deleteOne({ username: username })
    }


    db.model('User', schema, 'User');
}