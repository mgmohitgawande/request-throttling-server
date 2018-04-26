module.exports = function(app){
    var router = require('express').Router()
    
    var proxy = require('express-http-proxy');
    var Bottleneck = require("bottleneck");

    var bottleneck_config = require('./bottelneckConfig')
    
    var outbrainLimiter = function(){
        var outbrainLimiterIdentifireMap = {}
        return function(identifire, req_id){
            console.log(new Date(), 'bottle neck configuration for outbrain', req_id, identifire, bottleneck_config[identifire] ? bottleneck_config[identifire] : bottleneck_config['default'])
            if(!outbrainLimiterIdentifireMap[identifire])
                outbrainLimiterIdentifireMap[identifire] = new Bottleneck(bottleneck_config[identifire] ? bottleneck_config[identifire] : bottleneck_config['default'])
            return outbrainLimiterIdentifireMap[identifire]
        }
    }()
    router.use(function(req, res, next){
        console.log(new Date(), 'logging req for outbrain', req.id, req.body, req.headers, req.url);
        next();
    })
    router.use('/', (req, res, next) => {
        var url_parts = req.url.split('/')
        console.log(new Date(), 'queueing request for outbrain', req.id, url_parts[5])
        outbrainLimiter(url_parts[5], req.id).submit((n) => {
            console.log(new Date(), 'firing request for outbrain', req.id, url_parts[5])
            n()
        }, next)
    }, function(req, res, next){
        var skipToNextHandlerFilter = function(req_id){
            return function(proxyRes){
                console.log(new Date(), 'sending response for outbrain', req_id, proxyRes.headers)
                return false;
            }
        }
        proxy('https://api.outbrain.com', {skipToNextHandlerFilter : skipToNextHandlerFilter(req.id)})(req, res, next)
    })
    return router;
}