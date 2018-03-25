var mongoose = require('mongoose');
var util = require('../routes/util/recomandation');

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
        trim: true
    },
    imageUrl: {
        type: String,
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
    },
    status: {
        type: Boolean,
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

EntitySchema.statics.getPendingEntities = function (callback) {
    Entity.find({ status: false })
        .exec (function (err, pendingEntities) {
            callback(null, pendingEntities);
        });
};

EntitySchema.statics.getEntityByEvent = function (callback) {
    Entity.findOne({})
        .exec (function (err, entity) {
            callback(null, entity);
        });
    
};

var Entity = mongoose.model('Entity', EntitySchema);
module.exports = Entity;

