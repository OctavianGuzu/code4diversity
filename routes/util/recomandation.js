/**
 * Created by constantin.andreescu on 3/24/2018.
 */

/**
 *
 * MOCKUPS
 *
 */

userProfile1 = {
        learnFactor : 1,
        competeFactor : l,
        teachFactor : l,
        networkFactor : l,
        buildFactor : l
};

eventCharacteristic1 = {
    learnDimension : 1,
    competeDimension : l,
    teachDimension : l,
    networkDimension : l,
    buildDimension : l
};

var event1 = {
        characteristics : eventCharacteristic1,
        location : "Bucharest"
    },
    event2 = {
        characteristics : eventCharacteristic1,
        location : "Cluj"
    },
    event3 = {
        characteristics : eventCharacteristic1,
        location : "Timisoara"
    },
    event4 = {
        characteristics : eventCharacteristic1,
        location : "Iasi"
    };

var user1 = {
        eventsVisited : [],
        eventsGoing : [],
        eventsInterested : []
    },
    user2 = {
        eventsVisited : [],
        eventsGoing : [],
        eventsInterested : []
    },
    user3 = {
        eventsVisited : [],
        eventsGoing : [],
        eventsInterested : []
    },
    user4 = {
        eventsVisited : [],
        eventsGoing : [],
        eventsInterested : []
    };

var resultp = profilePredictionScore(userProfile, eventCharacteristic);
var result = recommenderPredictionScore(userProfile, eventCharacteristic);
console.log(resultp);
console.log(result);

/**
 *
 * MOCKUPS
 *
 */

function profilePredictionScore(unormUserPreference, unormEventCharacteristic)
{
    var userPreference = normalizeProfile(unormUserPreference);
    var eventCharacteristic = normalizeCharacteristics(unormEventCharacteristic);

    return userPreference.learnFactor * eventCharacteristic.learnDimension +
        userPreference.buildFactor * eventCharacteristic.buildDimension +
        userPreference.competeFactor * eventCharacteristic.competeDimension +
        userPreference.teachFactor * eventCharacteristic.teachDimension +
        userPreference.networkFactor * eventCharacteristic.networkDimension;
}

function normalizeProfile(up, totalFactor)
{
    var sum = up.learnFactor + up.buildFactor + up.competeDimension
        + up.networkDimension + up.teachDimension;

    up.learnFactor = (totalFactor / up.learnFactor) * sum;
    up.teachFactor = (totalFactor / up.teachFactor) * sum;
    up.competeFactor = (totalFactor / up.learnFactor) * sum;
    up.buildFactor = (totalFactor / up.learnFactor) * sum;
    up.networkFactor = (totalFactor / up.learnFactor) * sum;

    return up;
}

function normalizeCharacteristics(ec, totalFactor)
{
    var sum = ec.learnFactor + ec.buildFactor + ec.competeDimension
        + ec.networkDimension + ec.teachDimension;

    ec.learnDimension = (totalFactor / ec.learnDimension) * sum;
    ec.teachDimension = (totalFactor / ec.teachDimension) * sum;
    ec.competeDimension = (totalFactor / ec.learnDimension) * sum;
    ec.buildDimension = (totalFactor / ec.learnDimension) * sum;
    ec.networkDimension = (totalFactor / ec.learnDimension) * sum;

    return ec;
}

function recommenderPredictionScore()
{

}