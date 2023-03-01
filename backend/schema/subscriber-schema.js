const mongoose = require('mongoose')

const subscriberSchema = mongoose.Schema({
    audience_id: { // the users who subscribe to you
        type: String,
        require: true,
    },

    creator_id: { // the users you subscribe to
        type: String,
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
