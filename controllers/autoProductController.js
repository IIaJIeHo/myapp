﻿angular.module("sportsStoreAdmin")
.constant("productUrl", "http://localhost:5500/products/")
.constant("regUrl", "http://localhost:5500/autoservices/")
.constant("respondUrl", "http://localhost:5500/responds/")
.constant("userUrl", "http://localhost:5500/users/")
.constant("fileupload", "http://localhost:5500/upload/")
.constant("autoUrl", "http://localhost:5500/autos/")
.config(function($httpProvider) {
    $httpProvider.defaults.withCredentials = true;
})
.directive('ngConfirmClick', [
        function(){
            return {
                link: function (scope, element, attr) {
                    var msg = attr.ngConfirmClick || "Are you sure?";
                    var clickAction = attr.confirmedClick;
                    element.bind('click',function (event) {
                        if ( window.confirm(msg) ) {
                            scope.$eval(clickAction)
                        }
                    });
                }
            };
}])
.controller("productCtrl", function ($scope, $rootScope, $resource, $location, productUrl, regUrl, respondUrl, userUrl, autoUrl, Autos, Users, Autoservices, Responds, Requests) {

    $scope.productsResource = $resource(productUrl + ":id", { id: "@id" });
    $scope.RegResource = $resource(regUrl + ":id", { id: "@id" });
    $scope.RespondResource = $resource(respondUrl + ":id", { id: "@id" });
    $scope.UserResource = $resource(userUrl + ":id", { id: "@id" });
    $scope.AutoResource = $resource(autoUrl + ":id", { id: "@id" });
    $scope.allitems = true;
    $scope.mainproduct = null;
    $scope.mainrespond = null;
    $scope.updatedRespond = null;
    $scope.products = null;
    $scope.autos = null;
    $scope.responds = null;
    $scope.users = null;
    $scope.myresponds = null;
    $scope.autoservices = null;
    $scope.autoservice = null;
    $scope.respondview = 1;
    $scope.texts = {};
    $scope.startEdit = false;
     $scope.requests = ['Заявка на ТО','Заявка на Ремонт','Кузовные работы'];
    $scope.texts.work = ['Контрольный осмотр',
        'Замена масла в двигателе (в каждом ТО)',
        'Замена масляного фильтра (в каждом ТО)',
        'Защита двигателя',
        'Замена салонного фильтра',
        'Замена тормозных колодок',
        'Замена тормозных дисков',
        'Замена свечей зажигания',
        'Замена тормозной жидкости', 
        'Замена топливного фильтра', 
        'Замена воздушного фильтра', 
        'Замена масла в коробке передач', 
        'Замена ремня ГРМ',
        'Помпа (замена)',
        'Охлаждающая жидкость (замена)'];
    $scope.texts.question = ['Масло в двигателе (замена)',
        'Масляный фильтр (замена)',
        'Масло в коробке передач (замена)', 
        'Сход-развал',
        'Свечи зажигания (замена)', 
        'Тормозные колодки (замена)', 
        'Тормозные диски (замена)', 
        'Тормозные барабаны (замена)', 
        'Топливный фильтр (замена)', 
        'Салонный фильтр (замена)', 
        'Заправка кондиционера', 
        'Тормозная жидкость (замена)', 
        'Охлаждающая жидкость (замена)', 
        'Жидкость гидроусилителя (ГУР) (замена)'];
        $scope.texts.diagnos = ['Контрольный осмотр',
        'Диагностика двигателя',
        'Диагностика коробки передач',
        'Диагностика подвески',
        'Диагностика электрики'];
        $scope.texts.engine = ['Замена масла',
        'Генератор',
        'Инжектор',
        'Кондиционер',
        'Маслосъемные колпачки (замена)',
        'Насос масляный',
        'Насос топливный', 
        'Помпа (замена)',
        'Радиатор',
        'Ремень ГРМ (замена)', 
        'Цепь ГРМ',
        'Свечи зажигания (замена)', 
        'Термостат (замена)',
        'Турбина',
        'Фильтр воздушный (замена)', 
        'Фильтр масляный (замена)',
        'Фильтр салона (замена)', 
        'Фильтр топливный (замена)', 
        'Форсунки'];
        $scope.texts.head = ['Амортизатор (замена)',
        'Втулка стабилизатора (замена)', 
        'Подшипник ступицы (замена)',
        'Пружина(замена)',
        'Рычаг передний(замена)', 
        'Рычаг задний (замена)', 
        'Сайлентблок переднего рычага (замена)', 
        'Сайлентблок заднего рычага (замена)', 
        'Стойка стабилизатора (замена)', 
        'Ступица (замена)', 
        'Тормозные колодки (замена)', 
        'Тормозные диски (замена)', 
        'Тормозные барабаны (замена)', 
        'Тормозная жидкость (замена)', 
        'Датчик ABS (замена)', 
        'Датчик ESP (замена)', 
        'Шаровые (замена)'];
        $scope.texts.wheel = ['Рулевая рейка',
        'Рулевая тяга (замена)', 
        'Наконечник рулевой тяги (замена)',
        'Жидкость гидроусилителя (замена)',
        'Насос гидроусилителя (замена)', 
        'Сцепление',
        'Шрус (замена)', 
        'Замена масла в коробке передач'];
        $scope.texts.addi = ['Тонировка',
        'Сигнализация (название в комментарии)',
        'Парктроник (описать в комментарии)', 
        'Химчистка салона',
        'Полировка', 
        'Противоугонный комплекс (описать в комментарии)',
        'Иммобилайзер (описать в комментарии)',
        'Защита картера (установка)', 
        'Отопитель двигателя (описать в комментарии)',
        'Шумоизоляция (описать в комментарии)'];
        $scope.texts.destructions = [{ title: 'Бампер',
        data: ['Задний', 
        'Передний']},
        { title: 'Дверь', 
        data: ['Задняя левая', 
        'Задняя правая', 
        'Передняя левая', 
        'Передняя правая']},
        { title: 'Зеркало боковое',
        data: ['Левое', 
        'Правое']},
        { title: 'Крыло', 
        data: ['Переднее правое', 
        'Переднее левое' ,
        'Заднее правое' ,
        'Заднее левое']},
        { title:'Порог', 
        data: ['Правый' ,
        'Левый']},
        { title:'Стекло',
        data: ['Лобовое без датчика дождя(замена)' ,
        'Лобовое с датчиком дождя(замена)' ,
        'Лобовое ремонт скола' ,
        'Лобовое ремонт трещины' ,
        'Передней правой двери' ,
        'Передней левой двери' ,
        'Задней правой двери' ,
        'Задней левой двери' ,
        'Заднее']},
        { title:'Фара', 
        data: ['Передняя правая' ,
        'Передняя левая']},
        { title:'Противотуманка', 
        data: ['Передняя правая',
        'Передняя левая' ,
        'Задняя']},
        { title:'Задний фонарь', 
        data: ['Правый' ,
        'Левый']}];
    
    function getCookie(name) {
      var matches = document.cookie.match(new RegExp(
        "(?:^|; )" + name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, '\\$1') + "=([^;]*)"
      ));
      return matches ? decodeURIComponent(matches[1]) : undefined;
    }
    /*$scope.logout = function(){
        document.cookie = "userid='' path=/; expires=''";
        $rootScope.userid = null;
        $location.path("/login");
    } */
    $scope.logout = function(){
        $rootScope.userid = undefined;
        document.cookie = "userid=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;";
        $scope.listProducts();
    }
        $scope.formatDate = function(date) {
            if (date != undefined){
                 date = new Date(date);
              var hours = date.getHours();
              var minutes = date.getMinutes();
              var seconds = date.getSeconds();
              minutes = minutes < 10 ? '0'+minutes : minutes;
              var strTime = hours + ':' + minutes + ':' + seconds;
              return date.getDate() + "/" + (date.getMonth()+1) + "/" + date.getFullYear() + "  " + strTime;               
            }
            else{
                return '';
            }

    }
    $scope.listProducts = function () {
        if ($rootScope.userid == undefined){
            $rootScope.userid = getCookie('autoid');
        }
        if ($rootScope.userid == undefined){
            $location.path("/login");
        }
        else{
           /* $scope.products = $scope.productsResource.query(function(data){
                $scope.autos = $scope.AutoResource.query(function(auto_data){
                    angular.forEach(data, function(value, key) {
                        value.type=$scope.requests[value.type - 1];
                        angular.forEach(auto_data, function(value_auto, key_auto) {
                            if (value.autoid == value_auto.id){
                                value.auto=value_auto;
                            }
                        });
                    });
                });
                $scope.responds = $scope.RespondResource.query(function(responds_data){
                     angular.forEach(data, function(value, key) {
                        value.responds = [];
                    angular.forEach(responds_data, function(value_res, key_res) {
                        if (value.id == value_res.productid){
                            value.responds.push(value_res);
                        }
                    });               
                });
            });       
            });*/
            Requests.query().then(function(data){
                $scope.products = data;

                Autos.query().then(function(auto_data){
                    $scope.autos = auto_data;
                    angular.forEach($scope.products, function(value, key) {
                        value.type=$scope.requests[value.type - 1];
                    angular.forEach($scope.autos, function(value_auto, key_auto) {
                        if (value.autoid == value_auto._id.$oid){
                            value.auto=value_auto;
                        }
                    });
                    });
                });
                Responds.query().then(function(responds_data){
                    $scope.responds = responds_data;
                    angular.forEach($scope.products, function(value, key) {
                        value.responds = [];
                        angular.forEach($scope.responds, function(value_res, key_res) {
                            if (value._id.$oid == value_res.productid){
                                value.responds.push(value_res);
                            }
                        });               
                });
                    console.log($scope.products);
            });       
            });
            Responds.query({ autoserviceid : $rootScope.userid }).then(function(responds_data){ $scope.myresponds = responds_data;}); /* ответы только на мою заявку сделать (добавить user_id и по нему выбирать)*/
            Users.query(function(users_data){ $scope.users = user_data;}); 
            /*$scope.responds = $scope.RespondResource.query({autoserviceid: $rootScope.userid});*/
            /*$scope.autoservice = $scope.RegResource.get({ id: $rootScope.userid },function(data){
            });*/

            Autoservices.getById($rootScope.userid).then(function(autoservice){
                console.log(autoservice);
                $scope.autoservice = autoservice;
                console.log($scope.autoservice);
            });

            Autoservices.query().then(function(autoservices){
                $scope.autoservices = autoservices;
                console.log($scope.autoservices);
                angular.forEach($scope.autoservices, function(value_auto, key_auto) {
                        console.log(value_auto);
                        if ($rootScope.userid == value_auto._id.$oid){
                            $scope.autoservice = value_auto;
                        }
                });
            });  
            console.log($rootScope.userid);            
        }

    }
        $('#navigation a').click(function (e) {
        e.preventDefault();
        $(this).tab('show');
    });
    $('#reque2 a').click(function (e) {
        e.preventDefault();
        $(this).tab('show');
    });

    $scope.deleteProduct = function (product) {
        product.$remove().then(function () {
            $scope.products.splice($scope.products.indexOf(product), 1);
        });
    }

    $scope.createProduct = function (product) {
        product.userid=$rootScope.userid;
        console.log(product);

        new $scope.productsResource(product).$save().then(function (newProduct) {
            $scope.products.push(newProduct);
            $scope.editedProduct = null;
        });
    }

    $scope.editUser = function(user){
        var temp = user.password;
        $scope.autoservice.$update().then(function(editeduser){
            $.ajax({ 
            type: "POST", 
            url: "https://mandrillapp.com/api/1.0/messages/send.json", 
            data: { 
            'key': 'SWwkrbd8NN0rJ54aAyYnZg', 
            'message': { 
            'from_email': 'info@carsbir.ru', 
            'to': [ 
            { 
            'email': user.email, 
            'name': user.username, 
            'type': 'to' 
            } 
            ], 
            'subject': 'Данные пользователя изменена', 
            'html': "Имя = " + user.name + "Фамилия = " + user.surname + "Телефон = "+user.phone+"Пароль = " + temp, 
            } 
            }});
            $("#a-user-edit-profile").show();
            $("#a-user-edit-profile").fadeTo(5000, 500).slideUp(500, function(){
               $("#a-user-edit-profile").hide();
            }); 
        });
    }

    $scope.createRespond = function (respond) {
        var userofrequest, keepgoing = true;
        respond.autoserviceid=$rootScope.userid;
        respond.productid=$scope.mainproduct._id.$oid;
        respond.date = Date.now();
        angular.forEach($scope.users,function(value,key){
                if (keepgoing){
                    if (value._id.$oid== $scope.mainproduct.userid){
                        respond.phone = value.phone;
                        keepgoing = false;
                    }                    
                }
            }); 
        console.log(respond);
        var candirespond = new Responds(respond);
        candirespond.$save().then(function (newRespond) {
             $scope.activeresponds.push(newRespond);
            $("#a-respond-new").show();
            $("#a-respond-new").fadeTo(5000, 500).slideUp(500, function(){
               $("#a-respond-new").hide();
            });
            $scope.editedRespond = {};
            $scope.mainproduct.replied = true;
            angular.forEach($scope.requests, function(value,key){
                if (value == $scope.mainproduct.type){
                    $scope.mainproduct.type= key + 1;
                }
            });
            $scope.mainproduct.$update();
            angular.forEach($scope.users,function(value,key){
                if (keepgoing){
                    if (value._id.$oid == $scope.mainproduct.userid){
                        userofrequest = value;
                        keepgoing = false;
                    }                    
                }
            }); 

            $.ajax({ 
            type: "POST", 
            url: "https://mandrillapp.com/api/1.0/messages/send.json", 
            data: { 
            'key': 'SWwkrbd8NN0rJ54aAyYnZg', 
            'message': { 
            'from_email': 'info@carsbir.ru', 
            'to': [ 
            { 
            'email': userofrequest.email, 
            'name': userofrequest.username, 
            'type': 'to' 
            } 
            ], 
            'subject': 'На вашу заявку откликнулись', 
            'html': $scope.autoservice.username + " Оставил заявку; Имя = "+respond.name+"Описание = "+respond.description+"Стоимость = " + respond.cost, 
            } 
            }});
        });
    }

    $scope.updateProduct = function (product) {
        product.date = Date.now();
        product.$update();
        $scope.editedProduct = null;
    }

    $scope.startEdit = function (product) {
        $scope.editedProduct = product;
    }
    $scope.predicate='date';
    $scope.reverse = true;
    $scope.order = function(predicate){
        $scope.reverse = ($scope.predicate === predicate) ? !$scope.reverse : false;
        $scope.predicate = predicate;
    }

    $scope.updateRespond = function (respond) {
        $scope.updatedRespond = $scope.mainrespond;
        respond.$update().then(function(){
            $scope.respondview = 1;
            $("#a-respond-edit").show();
            $("#a-respond-edit").fadeTo(5000, 500).slideUp(500, function(){
               $("#a-respond-edit").hide();
            });        
        });
        $scope.mainrespond = null;
    }

    $scope.deleteRespond = function (respond) {
        console.log(respond);
        $scope.updatedRespond = respond;
        respond.$rempve().then(function () {
            $scope.myresponds.splice($scope.myresponds.indexOf(respond), 1);
            $("#a-respond-delete").show();
            $("#a-respond-delete").fadeTo(5000, 500).slideUp(500, function(){
               $("#a-respond-delete").hide();
            }); 
        });
    }

    $scope.editRespond = function (respond,number) {
        $scope.mainrespond = respond;
        $scope.respondview = number;
    }

    $scope.viewRespond = function (respond,number) {
        $scope.respondview = number;
        $scope.mainrespond = respond;
        $scope.startEdit = false;
        angular.forEach($scope.products, function(value, key) {
            if (respond.productid == value._id.$oid){
                $scope.mainproduct = value;
                console.log($scope.mainproduct);
            }
        });
    }

    $scope.viewItem = function (product) {
        $scope.allitems = !$scope.allitems;
        $scope.mainproduct = product;
        $scope.startEdit = false;
        if (product){
            $scope.activeresponds = [];
            angular.forEach($scope.responds, function(value, key) {
              if (value.productid == product._id.$oid){
                if (value.approved && $scope.mainproduct.phone == undefined){ /* Если заявка подтверждена, то отображаем телефон юзера*/                 
                    angular.forEach($scope.users, function(value1, key1){
                        console.log(value1._id.$oid+"value");
                        console.log(product.userid+"pro");
                        if (value1._id.$oid == product.userid){
                            console.log(value1.phone);
                            $scope.mainproduct.phone = value1.phone;
                        }
                    });
                }
                angular.forEach($scope.autoservices, function(value1, key1){
                    if (value1._id.$oid == value.autoserviceid){
                        value.autoservice = value1;
                    }
                });

                $scope.activeresponds.push(value);
              }
            });           
        }
    }
    $scope.deleteItem = function (respond) {
        respond.$remove().then(function () {
            $scope.responds.splice($scope.responds.indexOf(respond), 1);
            
        });
    }

    $scope.cancelEdit = function () {
        $scope.editedProduct = null;
    }

    $scope.listProducts();
});
