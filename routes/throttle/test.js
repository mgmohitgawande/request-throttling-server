var request = require('request')
var makeRequest = function(){
    request.post({uri: 'http://localhost:8080/throttle', json : true, body : {
        "queueType" : "mohit",
        "request" : {
            "method" : "POST",
            "url" : "http://localhost:8080/test",
            "headers" : {
                "id" : "MY_ID",
                "Content-Type" : "application/json"
            },
            "body" : {
                "body" : "here is My Body",
                aa : 'askdalks',
                date : new Date()
            }
        }
        
    }}, function(error, response, body){
        console.log(new Date(), body)
    })
}

for(var i = 0 ; i < 6; i++){
    makeRequest();
}