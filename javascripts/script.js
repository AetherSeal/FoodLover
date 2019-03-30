/*FoodLover javascript*/
(function (global) {
    const foodLover = {};
    /*
     * ES6
     ****************************/
    /*busca y remplaza expresiones en un string*/
    const searchAndReplace = (content, findThis, replaceWith) => {
        findThis = new RegExp(findThis, "g");
        return (content.replace(findThis, replaceWith));
    }
    /*inserta un string como innerHTML del target*/
    const insertHTML = (target, html) => {
        document.querySelector(target).innerHTML = html;
    }
    /*inserta el loader de css*/
    const insertLoader = target => {
        $ajaxTools.fetchGet("snippets/loader.html", (html) => {
            insertHTML(target, html);
        })
    }
    /*carga los items del menu*/
    const fillMenu = () => {
        $ajaxTools.fetchGet(
            "snippets/menuItem.html",
            (request) => {
                const {
                    categories
                } = foodLover.menuInfo
                const container = document.querySelector("#mainContent section.row")
                categories.map(category => {
                    let categoryTemplate = request;
                    categoryTemplate = searchAndReplace(categoryTemplate, '{{key}}', category.strCategory);
                    categoryTemplate = searchAndReplace(categoryTemplate, '{{name}}', category.strCategory);
                    categoryTemplate = searchAndReplace(categoryTemplate, '{{imgPath}}', category.strCategoryThumb);
                    categoryTemplate = searchAndReplace(categoryTemplate, '{{description}}', '"' + category.strCategoryDescription + '"');
                    container.innerHTML += categoryTemplate
                })
                document.querySelectorAll("#mainContent .itemTile")
                    .forEach(element => {
                        element.addEventListener('click', e => {
                            fillMenuItems(e.currentTarget.getAttribute('key'))
                        })
                    })
            }
        );
    }
    const fillMenuItems = category => {
        console.log('call to category  e.currentTarget.getAttribute("key"):' + category)
        /*cargamos informacion del restaurant en nuestro scope*/
        $ajaxTools.fetchGet('https://www.themealdb.com/api/json/v1/1/filter.php?c=' + category, request => {
                foodLover.menuMeals = request;
                $ajaxTools.fetchGet(
                    "snippets/dishes.html",
                    (request) => {
                        const {
                            meals
                        } = foodLover.menuMeals
                        const container = document.querySelector("#mainContent section.row")
                        container.innerHTML = ''
                        meals.map(meal => {
                            let mealTemplate = request;
                            mealTemplate = searchAndReplace(mealTemplate, '{{key}}', meal.idMeal);
                            mealTemplate = searchAndReplace(mealTemplate, '{{name}}', meal.strMeal);
                            mealTemplate = searchAndReplace(mealTemplate, '{{imgPath}}', meal.strMealThumb);
                            container.innerHTML += mealTemplate
                        })
                        document.querySelectorAll("#mainContent .dishWrapper")
                            .forEach(element => {
                                element.addEventListener('click', e => {
                                    console.log(e.currentTarget.getAttribute('key'))
                                    //fillMenuItems(e.currentTarget.getAttribute('key'))
                                })
                            })
                    }
                );
            },
            "json")
    }
    /*carga el contenido principal de la pagina*/
    const fillMainContent = request => {
        insertHTML("#mainContent", request);
        document.querySelectorAll('ul>li>a.nav-link').forEach(element => {
            element.addEventListener('click', menuHandler)
        })
    }
    /*maneja los eventos del menu y las redirecciones*/
    const menuHandler = e => {
        /*cambiamos el active element*/
        let old = document.querySelector('ul>li.nav-item.active')
        old.classList.remove('active')
        e.currentTarget.parentElement.classList.add('active')
        
        /*cargamos el loader*/
        insertLoader("#mainContent");
        const {
            id
        } = e.currentTarget
        switch (id) {
            case 'navItemMenu':
                console.log(id)
                $ajaxTools.fetchGet('./menu.html', request => {
                    insertHTML("#mainContent", request);
                    fillMenu()
                })
                break;
            case 'navItemAbout':
                console.log(id)
                $ajaxTools.fetchGet('./aboutUs.html', request => {
                    insertHTML("#mainContent", request);
                })
                break;
            case 'navItemReservation':
                console.log(id)
                $ajaxTools.fetchGet('./reservation.html', request => {
                    insertHTML("#mainContent", request);
                })
                break;
            case 'navItemCall':
                console.log(id)
                break;
            default:
                break;
        }
    }
    /***************************/

    /*Despues de ser cargado el html pero antes de que se carguen las imagenes y el css*/
    document.addEventListener("DOMContentLoaded", () => {
        /*cargamos informacion del restaurant en nuestro scope*/
        $ajaxTools.fetchGet('https://www.themealdb.com/api/json/v1/1/categories.php', request => {
                foodLover.menuInfo = request;
            },
            "json")
        /*insertamos un loader para mostrar algo mientras se resuelve la peticion*/
        insertLoader("#mainContent");
        /*llenamos el contenido principal de la pagina dentro del template*/
        $ajaxTools.fetchGet("snippets/mainContent.html", fillMainContent)
    });

})(window);