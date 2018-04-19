module.exports = function(req){
    var request = require('request');
    return new Promise(function(success, failure){
        var options = req.body.useDefault ? {
            uri : req.body.request.url,
            method : req.body.request.method,
            headers : req.body.request.headers,
            body : req.body.request.body,
            json: true
        } : {};
        if(!req.body.useDefault){
            for(key in request.body.request){
                options[key] = request.body.request[key]
            }
        }
        request(options, function(error, response, body){
            if(error)
                return failure(error)
            success(response)
        })
    })
}