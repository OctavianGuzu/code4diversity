var mongoose = require('mongoose');

var RequestSchema = new mongoose.Schema({
    type: {
        type: Number,
        required: true,
        trim: true
    },
    body: {
        type: Object,
        required: true,
        trim: true
    }
});

/**
 * Checks the type
 */
RequestSchema.pre('save', function (next) {
   /** TODO: Check type (one of the 4 types) */

    next();
});

var Request = mongoose.model('Request', RequestSchema);
module.exports = Request;

