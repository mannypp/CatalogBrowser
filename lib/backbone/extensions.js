var utils = require("utils");

function readSync(model, options) {
    switch (model.model_name) {
        case "product":
        break;
        case "productSearch":
        break;
    }
}

function updateSync(model, options) {
    
}

function createSync(model, options) {
    
}

function deleteSync(model, options) {
    
}

Backbone.sync = function(method, model, options) {
    utils.log('Backbone.sync', 'Sync: ' + method);
    
    switch (method) {
        case "read":
        return readSync(model, options);
        
        case "update":
        return updateSync(model, options);
        
        case "create":
        return createSync(model, options);
        
        case "delete":
        return deleteSync(model, options);
    }
};