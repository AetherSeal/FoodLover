/*jquery functions*/
$(function() {

    $("#header-nav button.navbar-toggle").blur(function(argument) {
        screenSize = window.innerWidth;
        if (screenSize < 768) {
            $("#collapsable-nav").collapse('hide');
        }
    })

});

/*FoodLover javascript*/
(function(global) {

    var foodLover = {};

    /*inserta html en un target*/
    var insertHTML = function(target, html) {
        var target = document.querySelector(target);
        target.innerHTML = html;
    }

    /*agrega html a un elemento*/
    var addHTML = function(target, html) {
        var target = document.querySelector(target);
        target.innerHTML += html;
    }

    /*inserta el loader de css*/
    var insertLoader = function(target) {
        var html = "<div class='loader'></div>";
        insertHTML(target, html);
    }

    /*busca y modifica partes en un texto*/
    var searchAndReplace = function(content, findThis, replaceWith) {
        findThis = new RegExp(findThis, "g");
        var x = content.replace(findThis, replaceWith);

        return x;
    }

    /*carga las categorias del menu para luego ir al detalle*/
    var insertCategories = function() {

        insertLoader("#mainContent");
        /*cargamos el container*/
        $ajaxTools.sendGetRequest(
            "snippets/menuItemContainer.html",
            function(request) {

                /*lo insertamos en el main content*/
                insertHTML("#mainContent", request.response);

                /*cargamos los items del menu de categorias*/
                $ajaxTools.sendGetRequest(
                    "snippets/menuItem.html",
                    function(request) {

                        for (var i = foodLover.menuInfo.categories.length - 1; i >= 0; i--) {
                            var myRequest = request.response;

                            myRequest = searchAndReplace(myRequest, '{{name}}', foodLover.menuInfo.categories[i].name);
                            myRequest = searchAndReplace(myRequest, '{{imgPath}}', foodLover.menuInfo.categories[i].imgPath);
                            myRequest = searchAndReplace(myRequest, '{{description}}', foodLover.menuInfo.categories[i].description);

                            addHTML("#mainContent section.row", myRequest);
                        }
                    }
                );
            }
        );
    }

    /*revisa los elementos del menu y remueve la clase active*/
    var clearNavItems = function() {
        var targets = document.querySelectorAll("#nav-list > li ");
        for (var i = targets.length - 1; i >= 0; i--) {
        	var target = document.getElementById(targets[i].id).className;
            if (target != "" && target != null && target != undefined) {
            	searchAndReplace(target, "active", "");
            }
        }
    }

    /*coloca como active un elemento del menu */
    var selectNavItems = function(target){
    	var targetElem = document.getElementById(target);
    	targetElem.className+= "active";
    }

    /*reordena los items del menu de navegacion*/
    var navBarItems = function (target) {
    	 clearNavItems();
    	 selectNavItems(target);
    	 console.log("we fix the nav bar !!!")
    }



    /*Despues de ser cargado el html pero antes de que se carguen las imagenes y el css*/
    document.addEventListener("DOMContentLoaded", function(event) {

        /*cargamos informacion del restaurant*/
        $ajaxTools.sendGetRequest(
            "snippets/info.json",
            function(request) {

                var menuInfo = JSON.parse(request.response);
                foodLover.menuInfo = menuInfo;
            }
        );

        /*cargamos Landing Page*/
        insertLoader("#mainContent");
        $ajaxTools.sendGetRequest(
            "snippets/mainContent.html",
            function(request) {
                /*cargamos el snippet del main container*/
                insertHTML("#mainContent", request.response);

                /*agregamos un listener al jumbotron*/
                document.querySelector("#mainJumbotron").addEventListener("click", function(event) {
                    console.log("they click the jumbotron");
                    var target = document.querySelector("#mainJumbotron h1");
                    target.innerHTML = "ay caramba!! ya no hay hello world";
                });

                /*listener al menuTile del landing page*/
                document.querySelector("#menuTile").addEventListener("click", function(event) {
                    console.log("they click the menu tile ! lets load the menu");
                    navBarItems("navButtonMenu");
                    insertCategories();
                });

                /*listener al menuTile del landing page*/
                document.querySelector("#menuMobile").addEventListener("click", function(event) {
                    console.log("they click the menu tile ! lets load the menu");
                    navBarItems("navButtonMenu");
                    insertCategories();
                });


            }
        );
    });

})(window);
