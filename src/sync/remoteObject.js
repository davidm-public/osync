var Changes = require('./changes');
var ChangeActions = require('./changeActions');
var ObservableObject = require('../observable/observableObject').ObservableObject;
var MessageBusAdapter = require('./messageBusAdapter');
var RemoteObjectTraverse = require('./remoteObjectTraverse');

function RemoteObject(data) {
    if (!data.uri) {
        throw 'Remote object must have "uri" identifier';
    }
    var observableObject = new ObservableObject(data);
    var remoteObjects = RemoteObjectTraverse.getRemoteObjects(data);

    function sendChange(evt) {
        var changeInfo = RemoteObjectTraverse.getLastUriByPath(data, evt.key);
        evt.key = changeInfo.path;
        var changes = Changes.mapObservableChange(evt);
        changes.filter(function(change) {
            return change.type === 'insert';
        }).forEach(function(change) {
            subscribeRecordChanges(change.object.uri);
        });
        MessageBusAdapter.sendChanges(changeInfo.object.uri, changes);
    }

    function receiveChanges(uri, changes) {
        changes.forEach(function(change) {
            //TODO: we need to trigger change event again, but without publish
            var descendentObject = RemoteObjectTraverse.getDescendentObject(observableObject, change.property);
            change = Object.assign({}, change, {
                property: descendentObject.property
            });
            ChangeActions[change.type].execute(descendentObject.object, change);
        });
    }

    function subscribeRecordChanges(uri) {
        var unsubscribe = MessageBusAdapter.subscribeChanges(uri, receiveChanges);
        observableObject.addDisposer(unsubscribe);
    }

    var unsubscribe = observableObject.on('change', sendChange);
    observableObject.addDisposer(unsubscribe);
    Object.keys(remoteObjects).forEach(subscribeRecordChanges);
    return observableObject;
}

module.exports = RemoteObject;
