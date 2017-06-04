var baseProduct = require('../model/product');
var utils = require('../utils');

exports.product = Backbone.Model.extend({
    url: '/products',
    model_name: 'product',

    find: function(id) {
        return this.fetch(id);
    },
    
    sync: function(method, model, options) {
        utils.log('Product.sync', 'Sync: ' + method);
        
        var deferred = new _.Deferred();
        
        switch (method) {
            case "read":
            baseProduct.find(options.id, {
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
