const mongoose = require('mongoose')

const testSchema = mongoose.Schema({
    username:{
        type: String,
        unique: true,
        minLength: 3,
        maxLength: 30,
    },

    password: {
        type: String,
        require: true,
        minLength: 8,
        maxLength: 20,
    },

    startDate: {
        type: Date,
        require: true,
        default: Date.now()
    }
})

module.exports = mongoose.model('test', testSchema);
