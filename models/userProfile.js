var mongoose = require('mongoose');
var util = require('routes/util/recomandation');
var ObjectID = require('mongodb').ObjectID;

var UserProfileSchema = new mongoose.Schema({
    learnFactor: {
        type: Number,
        required: true,
        trim: true
    },
    competeFactor: {
        type: Number,
        required: true,
        trim: true
    },
    buildFactor: {
        type: Number,
        required: true,
        trim: true
    },
    networkFactor: {
        type: Number,
        required: true,
        trim: true
    },
    teachFactor: {
        type: Number,
        required: true,
        trim: true
    },
    eventsWent: {
        type: Array,
        required: false,
        trim: true
    },
    eventsInterested: {
        type: Array,
        required: false,
        trim: true
    },
    eventsGoing: {
        type: Array,
        required: false,
        trim: true
    },
    userId: {
        type: Number,
        required: true,
        trim: true
    }
});

/**
 * Find user characteristics by user id
 * @param userId
 * @param callback
 */
UserProfileSchema.statics.getUserProfile = function (userId, callback) {
    UserProfile.findOne({ _id: userId })
        .exec (function (err, userProfiles) {
            callback(null, userProfiles);
        });
};

/**
 * Gets all user profiles except the logged one
 * @param userId
 * @param callback
 */
UserProfileSchema.statics.getAllUsersProfiles = function (userId, callback) {
    UserProfile.find({_id: { $nin: [ObjectID(userId)] } })
        .exec (function (err, userProfile) {
            callback(null, userProfile);
        });
};

/**
 * Normalizes the factors on the 5 preferences dimensions before persisting
 */
UserProfileSchema.pre('save', function (next) {
    var up = this;
    var TOTAL_FACTOR = 100;
    var sum = up.learnFactor + up.buildFactor + up.competeDimension
        + up.networkDimension + up.teachDimension;

    up.learnFactor = (TOTAL_FACTOR / up.learnFactor) * sum;
    up.teachFactor = (TOTAL_FACTOR / up.teachFactor) * sum;
    up.competeFactor = (TOTAL_FACTOR / up.learnFactor) * sum;
    up.buildFactor = (TOTAL_FACTOR / up.learnFactor) * sum;
    up.networkFactor = (TOTAL_FACTOR / up.learnFactor) * sum;

    next();
});


var UserProfile = mongoose.model('UserProfile', UserProfileSchema);
module.exports = UserProfile;

