module.exports = function(app){
    var router = require('express').Router();

    var proxy = require('express-http-proxy');
    var Bottleneck = require("bottleneck");
    
    var outbrainLimiterFactory = function(){
        var outbrainLimiterIdentifireMap = {}
        return function(identifire){
            return outbrainLimiterIdentifireMap[identifire] ? outbrainLimiterIdentifireMap[identifire] : (outbrainLimiterIdentifireMap[identifire] = new Bottleneck({maxConcurrent: 5, minTime: 12*1000}))
        }
    }
    var outbrainLimiter = outbrainLimiterFactory()
    app.use(function(req, res, next){
        console.log(new Date(), 'logging req', req.body, req.headers, req.url)
    })
    app.use('/outbrain', (req, res, next) => outbrainLimiter(req.url.split('/')[6]).submit((n) => n(), next), proxy('https://api.outbrain.com'))
    
    app.post('/test', function(req, res){
        console.log('hit test')
        res.status(500).json(req.body)
    })
    return router
}
