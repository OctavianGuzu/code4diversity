/**
 * Created by constantin.andreescu on 3/24/2018.
 */
var async = require('async');

function getPendingRequests(callback)
{
    var events = null, entities = null;
    async.series({
        one: function(cb) {
            Event.getPendingEvents(function(err, pendingEvents) {
                if (err || !pendingEvents) {
                    return callback(err);
                } else {
                    events = pendingEvents;
                    cb(null);
                }
            });
        },
        two: function(cb){
            Entity.getPendingEntities(function(err, PendingEntities) {
                if (err || !PendingEntities) {
                    return callback(err);
                } else {
                    entities = PendingEntities;
                    cb(null);
                }
            });
        }
    }, function(err, results) {
        callback(entities.concat(events));
    });
}