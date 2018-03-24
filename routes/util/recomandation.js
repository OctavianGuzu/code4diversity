/**
 * Created by constantin.andreescu on 3/24/2018.
 */
var User = require('../models/user');
var UserProfile = require('../models/userProfile');


function getSuggestedEvents()
{

}

function getSimilarEvents()
{

}

function getNearEvents()
{

}

function computeProfilePredictionScore(user, event)
{
    var userPreference = null;
    UserProfile.getUserProfile(user._id, function (err, userProfile) {
        if (err || !userProfile) {
            return null;
        } else {
            userPreference = userProfile;
        }
    });

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