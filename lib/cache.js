var cache = {};

module.exports = {  
    get: function(key) {
        var hash = key.hashCode();
        var obj = cache[hash];
        if (obj) {
            var now = (new Date()).getTime();
            if (now < obj.expires) {
                return obj.obj;
            }
            else {
                this.remove(key);
            }
        }
        return undefined;
    },
    
    has: function(key) {
        var hash = key.hashCode();
        var obj = cache[hash];
        if (obj) {
            var now = (new Date()).getTime();
            if (now < obj.expires) {
                return true;
            }
            else {
                this.remove(key);
            }
        }
        return false;
    },
    
    set: function(key, obj, expire) {
        var expirationTime = (new Date()).getTime();
        if (expire) {
            expirationTime += (expire * 60000);
        }
        else {
            expirationTime += 3600000; // 1 hour
        }
        cache[key.hashCode()] = {
            obj: obj,
            expires: expirationTime
        };
    },
    
    remove: function(key) {
        var hash = key.hashCode();
        if (cache[hash]) {
            delete cache[hash];
        }
    },
    
    clear: function() {
        cache = {};
    }
};
