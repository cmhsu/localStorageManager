function getStorageManager() {
  var storageManager = Object.create(methods);
  return storageManager;
}

var methods = {};

methods.set = function(key, value, expiry) {
  //getTime() returns time in milliseconds so we have to multiply by 1000
  var obj = {key: value, time: new Date().getTime() + expiry*1000};
  localStorage.setItem(key, JSON.stringify(obj));
};

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

methods.remove = function(key) {
  localStorage.removeItem(key);
  return true;
};

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

