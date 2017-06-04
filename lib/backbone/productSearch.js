var baseProductSearch = require('../model/productSearch');
var utils = require('../utils');
/*var AssociatedModel = require('backbone-associations').AssociatedModel;

var product = Backbone.Model.extend({
});*/

exports.productSearch = Backbone.Model.extend({ //AssociatedModel.extend({
    /*relations:[
        {
            type:Backbone.Many,
            key:'hits',
            relatedModel:product
        }
    ],*/
    
    url: '/product_search',
    model_name: 'productSearch',
    
    search: function(query) {
        return this.fetch({query: query});
    },
    
    sync: function(method, model, options) {
        utils.log('ProductSearch.sync', 'Sync: ' + method);
        
        var deferred = new _.Deferred();
        
        switch (method) {
            case "read":
            baseProductSearch.search(options.query, {
                onload: function(data) {
                    options.success(data);
                    deferred.resolveWith(model, [model, options]);
                },
                onerror: function(e) {
                    options.error();
                    deferred.reject();
                }
            });
            break;
            
            case "update":
            break;
            
            case "create":
            break;
            
            case "delete":
            break;
        }
        
        return deferred;
    }
});
