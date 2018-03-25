/**
 * Created by constantin.andreescu on 3/24/2018.
 */
var UserProfile = require('../../models/userProfile.js');
var Event = require('../../models/event.js');

function compareByUserScore(a,b) {
    return a.userScore > b.userScore
        ? 1
        : (a.userScore < b.userScore ? -1 : 0);
}

function compareByDistance(a,b) {
    return a.distanceToUser > b.distanceToUser
        ? 1
        : (a.distanceToUser < b.distanceToUser ? -1 : 0);
}

function compareEventsByLikeliness(a, b)
{
    return a.likeliness > b.likeliness
        ? 1
        : (a.likeliness < b.likeliness ? -1 : 0);
}

/**
 * Returns the top noOfResults future Events based on the UserProfile
 * @param user
 * @param noOfResults
 * @param callback
 */
function getSuggestedEvents(user, noOfResults, callback) {
    var userPreference = null;
    UserProfile.getUserProfile(user, function (err, userProfile) {
        if (err || !userProfile) {
            return null;
        } else {
            userPreference = userProfile;
            var events = null;
            Event.getAllUpcomingEvents(function (err, upComingEvents) {
                if (err || !events) {
                    return null;
                } else {
                    events = upComingEvents;
                    var currentEvent;
                    for (var i = 0; i < events.length; i++) {
                        currentEvent = events[i];
                        events[i].userScore = computeProfilePredictionScore(userPreference, currentEvent);
                    }
                        

                    events.sort(compareByUserScore);
                    callback(events.slice(1, noOfResults));
                }
            });
        }
    });
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

/**
 * Returns the top noOfResults future Events based on the suggestions from users with similar preferences
 * @param user
 * @param noOfResults
 * @param callback
 */
function getOthersLikedEvents(user, noOfResults, callback)
{
    var userPreference = null;
    var partikip, allEvents ;
    UserProfile.getUserProfile(user, function (userErr, userProfile) {
        if (userErr || !userProfile) {
            return callback(userErr);
        } else {
            userPreference = userProfile;
            var otherUsers = null;
            UserProfile.getAllUsersProfiles(user, function (othersErr, userProfiles) {
                if (othersErr || !userProfiles) {
                    return callback(othersErr);
                } else {
                    otherUsers = userProfiles;
                    var events = null;
                    Event.getAllUpcomingEvents(function(eventErr, upComingEvents) {
                        if (eventErr || !events) {
                            return callback(eventErr);
                        } else {
                            events = upComingEvents;
                            for (var i = 0; i < otherUsers.length; i++) {
                                otherUsers[i].likeliness = computeLikelinessScore(userPreference, otherUsers[i]);
                                for (var j = 0; j < events.length; j++) {
                                    partikip = otherUsers[i].eventsInterested.indexOf(events[j]) === -1 ? 0 : 1 ;
                                    events[j].likeliness = otherUsers[i].likeliness * partikip;
                                }
                            }

                            events.sort(compareEventsByLikeliness);
                            callback(events.slice(1, noOfResults));
                        }
                    });
                }
            });
        }
    });
}

function computeLikelinessScore(loggedUser, targetUser)
{
    var EV_INTERESTED_FACTOR = 1;

    var likelinessScore = 0;
    var events = loggedUser.eventsInterested;

    for (var i=0; i<targetUser.eventsInterested.length; i++) {
        if (events.indexOf(targetUser.eventsInterested[i]) !== -1) {
            likelinessScore += EV_INTERESTED_FACTOR;
        }
    }

    return likelinessScore / targetUser.eventsInterested.length;
}

/**
 * Returns the closest noOfResults events based on a maximum radius
 * @param userLocation
 * @param noOfResults
 * @param callback
 */
function getNearEvents(userLocation, noOfResults, callback)
{
    var events = null;
    Event.getAllUpcomingEvents(function(err, upComingEvents) {
        if (err || !events) {
            callback(err);
        } else {
            events = upComingEvents;
            var currentEvent;
            for (var i = 0; i < events.length; i++) {
                currentEvent= events[i];
                currentEvent.loc = {
                    lat: currentEvent.lat,
                    lng: currentEvent.lng
                };
                events[i].distanceToUser = computeDistance(userLocation, currentEvent.loc);
            }

            events.sort(compareByDistance);
            callback(events.slice(1, noOfResults));
        }
    });

}

function computeDistance(loc1, loc2)
{
    return Math.sqrt((loc1.lat - loc2.lat)^2 + (loc1.lng - loc2.lng)^2);
}

module.exports.getNearEvents = getNearEvents;