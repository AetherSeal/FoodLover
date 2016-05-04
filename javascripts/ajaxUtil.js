(function(global) {
    //global == window -- toma el scope general desde el que fue invocado que es el browser como tal por ello apunta a window
    var ajaxTools = {};

    /*chequea que se pueda hacer un request al server mediante ajax y devuelve el mismo */
    function makeRequest() {
        if (window.XMLHttpRequest) {
            return (new XMLHttpRequest());
        } else {
            global.alert("Ajax is not supported");
            return null;
        }
    }

    /*Chequea que el request esta bien y que el server da el ok*/
    function makeResponse(request, responseHandler) {
        if (request.readyState == 4 && request.status == 200) {
            responseHandler(request);
        }
    }

    /*Envia un GET request al server*/
    ajaxTools.sendGetRequest = function(requestUrl, responseHandler) {
        var request = makeRequest();
        request.onreadystatechange = function() {
            makeResponse(request, responseHandler);
        }
        request.open("GET", requestUrl, true);
        request.send(null);
    }

    /*Envia un POST request al server*/
    ajaxTools.sendPostRequest = function(requestUrl, responseHandler) {
        var request = makeRequest();
        request.onreadystatechange = function() {
            makeResponse(request, responseHandler);
        }
        request.open("POST", requestUrl, true);
        request.send(null); //content of post
    }

    global.$ajaxTools = ajaxTools;

})(window);
