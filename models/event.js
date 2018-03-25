var mongoose = require('mongoose');
var util = require('../routes/util/recomandation');

var EventSchema = new mongoose.Schema({
    entityId: {
        type: String,
        required: true,
        trim: true
    },
    name: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        required: true,
        trim: true
    },
    dimensions: {
        type: Object,
        trim: true
    },
    status: {
        type: Boolean,
        required: true,
        trim: true
    },
    eventDate:{
        type: String,
        required: true,
        trim: true
    }
});

EventSchema.statics.getAllUpcomingEvents = function (callback) {
    Event.find({"date": {"$gte": new Date()}})
        .exec (function (err, events) {
            callback(null, events);
        });
};

EventSchema.statics.getPendingEvents = function (callback) {
    Event.find({ status: false })
        .exec (function (err, pendingEvents) {
            callback(null, pendingEvents);
        });
};

/**
 * Normalizes the preferences dimensions before persisting
 */
EventSchema.pre('save', function (next) {
    var ec = this;
    var sum = ec.learnFactor + ec.buildFactor + ec.competeDimension
        + ec.networkDimension + ec.teachDimension;
    var TOTAL_FACTOR = 100;
    ec.learnDimension = (TOTAL_FACTOR / ec.learnDimension) * sum;
    ec.teachDimension = (TOTAL_FACTOR / ec.teachDimension) * sum;
    ec.competeDimension = (TOTAL_FACTOR / ec.learnDimension) * sum;
    ec.buildDimension = (TOTAL_FACTOR / ec.learnDimension) * sum;
    ec.networkDimension = (TOTAL_FACTOR / ec.learnDimension) * sum;

    next();
});


var Event = mongoose.model('Event', EventSchema);
module.exports = Event;

