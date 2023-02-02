const mongoose = require('mongoose')

const subscriberSchema = mongoose.Schema({
    writer_id: {
        type: Number,
        require: true,
    },

    reader_id: {
        type: Number,
        require: true,
    },

    subscription_date: {
        type: Date,
        default: Date.now(),
        require: true,
    },

    receive_notification: {
        type: Boolean,
        default: true,
        require: true,
    }
})

module.exports = mongoose.model('subscriber', subscriberSchema);
