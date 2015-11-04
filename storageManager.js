function getStorageManager() {
  var storageManager = Object.create(methods);
  return storageManager;
}

var methods = {};

//Sets the given value under the given key for given expiry seconds.
methods.set = function(key, value, expiry) {
  //getTime() returns time in milliseconds so we have to multiply by 1000
  var obj = {key: value, time: new Date().getTime() + expiry*1000};
  localStorage.setItem(key, JSON.stringify(obj));
};

//Returns the value stored under the given key. Returns undefined if it doesn't exist.
methods.get = function(key) {
  var time = new Date().getTime();
  var obj = JSON.parse(localStorage.getItem(key));
  if (obj != undefined) {
    if (time < obj.time) {
      return obj.key;
    }
  }
  return undefined;
};

//Removes the value that is stored under the given key
methods.remove = function(key) {
  localStorage.removeItem(key);
  return true;
};

// Depends what is stored under the given key:
// In case it is an object - add the given property with the given value to it. Expiry is updated to the given expiry value.
// In case nothing is stored - create an object with the given property and the value to it. Expiry is updated to the given expiry value.
// In case it is not an object - throw an exception.
methods.setProperty = function(key, property, value, expiry) {
  var stored = this.get(key);
  if (typeof stored === 'object' && stored != null) {
    stored[property] = value;
    this.set(key, stored, expiry);
  } else if (stored == undefined) {
    var obj = {};
    obj[property] = value;
    this.set(key, obj, expiry);
  } else if (typeof stored != 'object') {
    throw 'Error: The value stored at this key is not an object.';
  }
};

storageManager = getStorageManager();

