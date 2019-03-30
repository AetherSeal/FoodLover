(function (global) {
    //global == window -- toma el scope general desde el que fue invocado que es el browser como tal por ello apunta a window
    var ajaxTools = {};

    const fetchURL = (request, callback, type = 'text') => {
        fetch(request)
            .then(response => {
                if (!response.ok) {
                    throw response.status
                }
                return type == 'json' ? response.json() : response.text()
            })
            .then(data => {
                callback(data)
            })
            .catch(error => {
                console.log(`------------>${error}`)
            })
    }

    ajaxTools.fetchGet = (url, callback, type) => {
        fetchURL(url, callback, type)
    }

    ajaxTools.fetchPost = (url, data, callback, type) => {
        let config = {
            method: 'POST',
            body: data,
            headers: new Headers()
        }
        let request = new request(url, config)
        fetchURL(request, callback, type)
    }


    global.$ajaxTools = ajaxTools;

})(window);

/****************************************************
 *https://www.themealdb.com/api.php
 ****************************************************/