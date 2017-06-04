var utils = require("./utils");
var cache = require("./cache");

var host = "https://development-instore-dw.demandware.net";
var base = "/s/SiteGenesis/dw/shop/";
var version = "v15_9";
var client_id = "8d66a325-89ff-462e-8416-89dd49196c64";
var cacheExpiration = 1;
var cacheEnabled = true;

function assembleUrl(resource, paramString) {
   return host + base + version + "/" + resource + "?"+ paramString + "client_id=" + client_id + "&locale=default";
}

function assembleParameterString(params) {
    var paramString = '';
    if (params) {
        for (var key in params) {
            paramString += encodeURI(key + '=' + params[key]) + "&";
        }
    }
    return paramString;
}

exports.request = function(resource, method, params, handler) {
	function handleRequestResult(e) {
	    var obj = JSON.parse(e);
	    cache.set(url, obj, cacheExpiration);
		handler.onload(obj);
	}
	
	function handleRequestError(error) {
        handler.onerror(error);
   	}
	
    function checkCache(url) {
        if (!cacheEnabled){
            return false;
        }
        
        var obj = cache.get(url);
        if (obj !== undefined) {
            utils.log("ocapi", "Cache hit: " + url);
            handler.onload(obj);
            return true;
        }
        utils.log("ocapi", "Cache miss: " + url);
        return false;
    }
    
    function sendRequest(url, method, handler) {
        if (checkCache(url)) {
            return;
        }
    
        utils.log("ocapi", "Sending request: " + url);
        fetch(url, {method: method})
            .then((response) => response.text())
            .then((responseText) => {
                handleRequestResult(responseText);
            })
            .catch((error) => {
                handleRequestError(error);
            })
            .done();
    }
    
	var parameterString = assembleParameterString(params);
	var url = assembleUrl(resource, parameterString);	
    sendRequest(url, method, handler);	
};