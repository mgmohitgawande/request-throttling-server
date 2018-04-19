module.exports = function(app){
    var router = require('express').Router();
    
    app.use('/throttle', require('./throttle/api')(app).router(router))
    app.post('/test', function(req, res){
        console.log('hit test')
        res.status(500).json({...req.body, message : 'hiiii'})
    })
    return router
}