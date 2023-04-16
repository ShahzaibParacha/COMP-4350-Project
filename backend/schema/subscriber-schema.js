const mongoose = require('mongoose');
const ParamValidation = require('../util/ParamValidationUtil');

const subscriberSchema = mongoose.Schema({
	audience_id: { // the users who subscribe to you
		type: String,
		validate: (audience_id) => {
			return ParamValidation.isValidObjectId(audience_id);
		},
		required: true
	},

	creator_id: { // the users you subscribe to
		type: String,
		validate: (creator_id) => {
			return ParamValidation.isValidObjectId(creator_id);
		},
		required: true
	},

	subscription_date: {
		type: Date,
		default: Date.now(),
		required: true
	},

	receive_notification: {
		type: Boolean,
		default: true,
		validate: (receive_notification) => {
			return typeof receive_notification === 'boolean';
		},
		required: true
	}
});

module.exports = mongoose.model('subscriber', subscriberSchema);
