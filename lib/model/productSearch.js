var http = require('../ocapi');

exports.search = function(queryString, handler) {
	http.request('product_search', "GET", {q: queryString, expand: "availability,images,prices,variations"}, handler);	
};
