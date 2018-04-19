module.exports = function(app){
    var requestsQueue = require('../../utility/requestsQueue')();
    var httpRequest = require('../../utility/throttlingHttpRequest')
    return {
        post : function(req, res, next){
            var executable = function(){
                return function(){
                    httpRequest(req).then(function(response){
                        requestsQueue.notifyRequestCompletion(req, executable)
                        res.status(response.statusCode).send(response.body)
                        // json({...response.body, 
                        //     active : requestsQueue.queue.active.length, 
                        //     waiting : requestsQueue.queue.waiting.length, 
                        //     currentWindowActiveReqCount : requestsQueue.queue.currentWindowActiveReqCount})
                    }, function(error){
                        requestsQueue.notifyRequestCompletion(req, executable)
                        res.status(500).json({message : 'Node Throttling Server Internal ERROR', error: error})
                    })
                }
            }
            requestsQueue.addRequestToQueue(req, executable())
        },
        router : function(router){
            router.use(requestsQueue.getRequestHandlingQueueTypeBasedOnRequest);
            router.post('/', this.post)
            return router;
        }
    }
}



var reqParam = {
    queueType : 'string (rateLimiting5PerMinsOutbrain)',
    request : {
        method : 'get/put/post/patch/delete...',
        useDefault : 'true if want to use default with limited option or false if want to send all options like in npm request module',
        url : 'string',
        headers : 'object{}',
        body : {
            // object
        }
    }
}