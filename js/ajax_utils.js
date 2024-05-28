(function(global){
    var ajaxUtils = {};////set up a namespace for our utility
    
    //returns an http request object
    function getRequestObject(){
        if(window.XMLHttpRequest){
            return (new XMLHttpRequest())
        }else{
            global.alert("Ajax is not supported");
            return (null);
        }
    }

  

    ajaxUtils.sendGetRequest = 
        function(requestUrl, responseHandler, isJsonResponse){
            var request = getRequestObject();
            request.onreadystatechange = function(){
                handleResponse(request,responseHandler,isJsonResponse);
            };
            request.open("GET", requestUrl,true);
            request.send();
        };

    function handleResponse(request,responseHandler,isJsonResponse){
        if((request.readyState == 4)&& (request.status == 200)){
            if(isJsonResponse==undefined){
                isJsonResponse=false;
            }

            if(isJsonResponse){
                responseHandler(JSON.parse(request.responseText))
            }
            else{
                responseHandler(request);
            }
            
        }
    }

    global.$ajaxUtils = ajaxUtils;


})(window);