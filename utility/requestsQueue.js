module.exports = function(){
    var queue = {
        rateLimiting5PerMins : {
            WINDOW_DURATION : 1*60*1000,
            WINDOW_SIZE : 6,
            active : [],
            waiting : [],
            currentWindowActiveReqCount : 0,
            queueRequest : function(executable){
                this.currentWindowActiveReqCount < this.WINDOW_SIZE ? this.active.push({executable : executable(), startTime : new Date()}) : this.waiting.push({executable : executable})
                if(this.currentWindowActiveReqCount < this.WINDOW_SIZE)
                    this.currentWindowActiveReqCount = this.currentWindowActiveReqCount +1;
            },
            notifyRequestCompletion : function(executable){
                this.active = this.active.filter(exec => exec != executable);
                setTimeout(() => {
                    this.currentWindowActiveReqCount = this.currentWindowActiveReqCount -1;
                    if(this.currentWindowActiveReqCount < this.WINDOW_SIZE)
                        this.waiting.splice(0, this.WINDOW_SIZE - this.currentWindowActiveReqCount).forEach(waiting => this.active.push({executable : waiting.executable(), startTime : new Date()}))
                }, this.WINDOW_DURATION)
            }
        }
    }
    return {
        getRequestHandlingQueueTypeBasedOnRequest : function(req, res, next){
            req.queueType = 'rateLimiting5PerMins';
            req.body.requestHandlingQueueType = 'rateLimiting5PerMins'
            next()
        },
        addRequestToQueue : function(req, executable){
            queue[req.body.requestHandlingQueueType].queueRequest(executable)
        },
        notifyRequestCompletion : function(req, executable){
            queue[req.body.requestHandlingQueueType].notifyRequestCompletion(executable)
        },
        queue : queue.rateLimiting5PerMins
    }
}