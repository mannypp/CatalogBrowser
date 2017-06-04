var http = require('../ocapi');

exports.find = function(id, handler) {
	http.request('products/' + id, "GET", {expand: "availability,bundled_products,links,promotions,options,images,prices,variations,set_products"}, handler);	
};
