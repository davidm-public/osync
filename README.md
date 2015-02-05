[![Build Status](https://travis-ci.org/fiolkaf/nsync.svg?branch=master)](https://travis-ci.org/fiolkaf/nsync)

# OSync - Javascript object synchronization

#### Transparently synchronize Javascript objects across application and clients

NSync provides object synchronization based on uris:

```javascript
var object1 = new NSync.RemoteObject({
   uri: '/remote/1',
   property: false;
});

var object2 = new NSync.RemoteObject({
   uri: '/remote/1',
   property: false;
});

object1.property = true;
assert(object2.property === true); // object2 will automatically update property
```


### Support

##### Nested properties:

```javascript
remoteObject.object.array[0].object2.property = true;
```

##### Array modifications:

```javascript
remoteObject.object.array.push(...);
remoteObject.object.array.pop(...);
remoteObject.object.array.shift(...);
remoteObject.object.array.unshift(...);
remoteObject.object.array.splice(...);

```
