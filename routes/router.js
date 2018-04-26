module.exports = function(app){
    var router = require('express').Router();

    var proxy = require('express-http-proxy');
    var Bottleneck = require("bottleneck");
    
    var outbrainLimiter = new Bottleneck({maxConcurrent: 5, minTime: 12*1000});
    app.use(function(req, res, next){
	console.log(new Date(), 'logging req', req.body, req.headers, req.url)
    })
    app.use('/outbrain', (req, res, next) => outbrainLimiter.submit((n) => n(), next), proxy('https://api.outbrain.com'))
    
    app.post('/test', function(req, res){
        console.log('hit test')
        res.status(500).json(req.body)
    })
    return router
}
