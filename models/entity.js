var mongoose = require('mongoose');
var util = require('routes/util/recomandation');

var EntitySchema = new mongoose.Schema({
    location: {
        type: String,
        required: true,
        trim: true
    },
    name: {
        type: String,
        required: true,
        trim: true
    },
    long: {
        type: Number,
        required: true,
        trim: true
    },
    lat: {
        type: Number,
        required: true,
        trim: true
    },
    femaleProc: {
        type: Number,
        required: true,
        trim: true
    },
    imageUrl: {
        type: String,
        required: true,
        trim: true
    },
    address: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        required: true,
        trim: true
    },
    rating: {
        type: Number,
        required: true,
        trim: true
    },
    type: {
        type: Number,
        required: true,
        trim: true
    }
});

/**
 * Check the female percentage, the type and rating
 */
EntitySchema.pre('save', function (next) {
   /** TODO: Check female_proc (percentage), type (one of the 4 types), rating */

    next();
});

var Entity = mongoose.model('Entity', EntitySchema);
module.exports = Entity;

