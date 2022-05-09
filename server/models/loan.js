const mongo = require("mongoose");

module.exports = db => {
    let schema = new mongo.Schema({
        amount: { type: Number, required: true, index: true },
        date: { type: Date, required: true, index: true },
        endDate: { type: Date, required: true, index: true },
        from: { type: String, required: true, unique: true },
        to: { type: String, required: true },
    }, { autoIndex: false });

    schema.statics.CREATE = async function(loan) {
        return this.create({
            amount: loan.amount,
            date: loan.date,
            endDate: loan.endDate,
            from: loan.from,
            to: loan.to,
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

    schema.statics.REQUEST_USER_LOANS = async function(username) {
        return this.find({
            $or: [{
                    from: username
                },
                {
                    to: username
                }
            ]
        }).exec();
    }

    schema.statics.REQUEST_USER_DEBTS = async function(username) {
        return this.find({
            to: username
        }).exec();
    }
    db.model('Loan', schema, 'Loan'); // if model name === collection name
}