/**
 * Created by constantin.andreescu on 3/24/2018.
 */
var UserProfile = require('../../models/userProfile.js');
var Event = require('../../models/event.js');
var Entity = require('../../models/entity.js');


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
                                allEvents = otherUsers[i].eventsWent.concat(
                                    otherUsers[i].eventsInterested.concat(otherUsers[i].eventsGoing)
                                );
                                for (var j = 0; j < events.length; j++) {
                                    partikip = allEvents.indexOf(events[j]) === -1 ? 0 : 1 ;
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
    var EV_WENT_FACTOR = 3;
    var EV_GOING_FACTOR = 2;
    var EV_INTERESTED_FACTOR = 1;

    var likelinessScore = 0;
    var events = loggedUser.eventsWent.concat(
        loggedUser.eventsInterested.concat(loggedUser.eventsGoing)
    );
    for (var i=0; i<targetUser.eventsWent.length; i++) {
        if (events.indexOf(targetUser.eventsWent[i]) !== -1) {
            likelinessScore += EV_WENT_FACTOR;
        }
    }
    for (i=0; i<targetUser.eventsGoing.length; i++) {
        if (events.indexOf(targetUser.eventsGoing[i]) !== -1) {
            likelinessScore += EV_GOING_FACTOR;
        }
    }
    for (i=0; i<targetUser.eventsInterested.length; i++) {
        if (events.indexOf(targetUser.eventsInterested[i]) !== -1) {
            likelinessScore += EV_INTERESTED_FACTOR;
        }
    }

    var allTargetEvents = targetUser.eventsGoing.length +
        targetUser.eventsWent.length +
        targetUser.eventsInterested.length;
    return likelinessScore / (allTargetEvents);
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
    console.log("i'm in getNearEvents");
    Event.getAllUpcomingEvents(function(err, upComingEvents) {
        console.log("getAllUpcoming")
        // console.log(upComingEvents);
        if (err || !upComingEvents) {
            callback(err);
        } else {
            events = upComingEvents;
            var currentEvent;
            for (var i = 0; i < events.length; i++) {
                currentEvent = events[i];
                console.log("Inainte de get");
                // Entity.find({ status: true});
                // console.log(entity);
                console.log(events[i]);
                currentEvent.loc = {
                    lat: events[i].entityLat,
                    lng: events[i].entityLng
                };
                // console.log()
                events[i].distanceToUser = computeDistance(userLocation, currentEvent.loc);
                console.log("events[" + i+ "]=" + events[i].distanceToUser);

            }

            events.sort(compareByDistance);
            callback(events.slice(0, noOfResults));
        }
    });

}

function getDistanceFromLatLonInKm(lat1,lon1,lat2,lon2) {
    var R = 6371; // Radius of the earth in km
    var dLat = deg2rad(lat2-lat1);  // deg2rad below
    var dLon = deg2rad(lon2-lon1);
    var a =
        Math.sin(dLat/2) * Math.sin(dLat/2) +
        Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
        Math.sin(dLon/2) * Math.sin(dLon/2)
    ;
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    var d = R * c; // Distance in km
    return d;
}

function deg2rad(deg) {
    return deg * (Math.PI/180)
}

function computeDistance(loc1, loc2)
{
    console.log(loc1.lat + "    " + loc2.lat);
    var f =getDistanceFromLatLonInKm(loc1.lat,loc1.lng, loc2.lat, loc2.lng);
    console.log("distanta e:" + f);
    return f;

}

module.exports.getNearEvents = getNearEvents;