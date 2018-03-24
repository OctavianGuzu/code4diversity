/**
 * Created by constantin.andreescu on 3/24/2018.
 */
var User = require('../models/user');
var UserProfile = require('../models/userProfile');
var Event = require('../models/event');

function compareEvents(a,b) {
    return a.userScore > b.userScore
        ? 1
        : (a.userScore < b.userScore ? -1 : 0);
}

/**
 * Returns the top noOfResults future Events based on the UserProfile
 * @param noOfResults
 * @returns {*}
 */
function getSuggestedEvents(noOfResults)
{
    var userPreference = null;
    UserProfile.getUserProfile(user._id, function (err, userProfile) {
        if (err || !userProfile) {
            return null;
        } else {
            userPreference = userProfile;
        }
    });

    var events = null;
    Event.getAllUpcomingEvents(function(err, upComingEvents) {
        if (err || !events) {
            return null;
        } else {
            events = upComingEvents;
        }
    });

    var currentEvent;
    for (var i = 0; i < events.length; i++) {
        currentEvent= events[i];
        events[i].userScore = computeProfilePredictionScore(userPreference, currentEvent);
    }

    events.sort(compareEvents);
    return events.slice(1, noOfResults);
}

function getOthersLikedEvents(noOfResults)
{

}

function getNearEvents(noOfResults)
{

}

function computeProfilePredictionScore(userPreference, event)
{
    var eventCharacteristic = event.dimensions;
    return userPreference.learnFactor * eventCharacteristic.learnDimension +
        userPreference.buildFactor * eventCharacteristic.buildDimension +
        userPreference.competeFactor * eventCharacteristic.competeDimension +
        userPreference.teachFactor * eventCharacteristic.teachDimension +
        userPreference.networkFactor * eventCharacteristic.networkDimension;
}


function recommenderPredictionScore()
{

}