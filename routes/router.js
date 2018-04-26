module.exports = function(app){
    var router = require('express').Router();
    
    app.use('/outbrain', require('./outbrain/api')(app))
    app.post('/test', function(req, res){
        console.log('hit test')
        res.status(500).json(req.body)
    })
    return router
}
