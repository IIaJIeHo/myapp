angular.module("sportsStoreAdmin")
.controller("productCtrl", function ($scope, $rootScope, $resource, $location, productUrl, autoRegUrl, respondUrl, userRegUrl, autoUrl, Autos, Users, Autoservices, Responds, Requests, Functions, Data) {

    $scope.productsResource = $resource(productUrl + ":id", { id: "@id" });
    $scope.RegResource = $resource(autoRegUrl + ":id", { id: "@id" });
    $scope.RespondResource = $resource(respondUrl + ":id", { id: "@id" });
    $scope.UserResource = $resource(userRegUrl + ":id", { id: "@id" });
    $scope.AutoResource = $resource(autoUrl + ":id", { id: "@id" });
    $scope.allitems = true;
    $scope.toogleAutoservice = [];
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
	$scope.formdetails = null;
	$scope.formdetails2 = null;
    $scope.texts = {};
    $scope.startEdit = false;
    $scope.loading = false;
    $scope.answered = false;
    $scope.showtable = false;
    $scope.baseurl = $location.absUrl().substring(0,$location.absUrl().indexOf('/a'));
    $scope.requests = ['Заявка на ТО','Заявка на Ремонт','Кузовные работы'];
    $scope.texts = Data.getWorkTypes();
    $scope.metrostations = Data.getMetro();
    $scope.logout = function(){
        $rootScope.userid = undefined;
        document.cookie = "autoid=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;";
        $rootScope.products = null;
        $scope.listProducts();
    }
        $scope.formatDate = function(date) {
            if (date != undefined){
                 date = new Date(date);
              var hours = date.getHours();
              hours = hours < 10 ? '0'+hours : hours;
              var minutes = date.getMinutes();
              var seconds = date.getSeconds();
              var day = date.getDate() < 10 ? '0'+date.getDate() : date.getDate();
              var month = (date.getMonth()+1) < 10 ? '0'+ (date.getMonth() + 1) : (date.getMonth() + 1);
              minutes = minutes < 10 ? '0'+minutes : minutes;
              var strTime = hours + ':' + minutes;
              return day + "." + month+ "." + date.getFullYear() + " / " + strTime + "";               
            }
            else{
                return '';
            }
    }
    $scope.listProducts = function () {
        $scope.loading = true; 
        if ($rootScope.userid == undefined){
            $rootScope.userid = Functions.getCookie('autoid');
        }
        if ($rootScope.userid == undefined){
            $location.path("/login");
        }
        else{
            if ($rootScope.products != null){
                $scope.autos = $rootScope.autos
                $scope.products = $rootScope.products; 
                $scope.responds = $rootScope.responds;
                $scope.myresponds = $rootScope.myresponds;
                $scope.users = $rootScope.users;
                $scope.autoservice = $rootScope.autoservice; 
                $scope.autoservices = $rootScope.autoservices;              
                $scope.loading = false;
                console.log("cache");
            }
            else{
            Autoservices.getById($rootScope.userid).then(function(autoservice){
                $scope.autoservice = autoservice;
                $scope.autoservice.id = $scope.autoservice._id.$oid;
                $rootScope.autoservice = $scope.autoservice;
                    Requests.query().then(function(data){
                        var temp_time = $scope.autoservice.date - 30*1000*60*60*24;
                        data = data.filter(function(product){
                            return product.date > temp_time;
                        });
                        $scope.products = data;
                        Autos.query().then(function(auto_data){
                            $scope.autos = auto_data;
                            angular.forEach($scope.products, function(value, key) {
                            angular.forEach($scope.autos, function(value_auto, key_auto) {
                                if (value.autoid == value_auto._id.$oid){
                                    value.auto=value_auto;
                                }
                            });
                            });
                            $rootScope.autos = $scope.autos;
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
                            $rootScope.responds = $scope.responds;
                            $scope.loading = false; 
                    });
                    $rootScope.products = $scope.products;    
                    });
            });

            Responds.query({ autoserviceid : $rootScope.userid }).then(function(responds_data){ $scope.myresponds = responds_data; $rootScope.myresponds = $scope.myresponds;}); /* ответы только на мою заявку сделать (добавить user_id и по нему выбирать)*/
            Users.query().then(function(users_data){ $scope.users = users_data; $rootScope.users = $scope.users;}); 

            Autoservices.query().then(function(autoservices){
                $scope.autoservices = autoservices;
                $rootScope.autoservices = $scope.autoservices;
            });   
            }
                      
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
	
	$scope.checknegative = function(array,name) {
        var checking = false;
        angular.forEach(array, function(value){
            if ((value == true)){
                checking = true;
                $scope.showtable = true;
                $scope.formdetails = name;
            }
        });
        return checking;
    }
    $scope.changedetail = function(name){
        $scope.formdetails = name;
    }
    $scope.changedetail2 = function(name){
        $scope.formdetails2 = name;
    }
	
    $scope.checknegative2 = function(array,name) {
        var checking = false;
        angular.forEach(array, function(value){
            if ((value == true)){
                checking = true;
                $scope.showtable = true;
                $scope.formdetails2 = name;
            }
        });
        return checking;
    }

    $scope.createProduct = function (product) {
        product.userid=$rootScope.userid;
        $scope.loading = true; 
        new $scope.productsResource(product).$save().then(function (newProduct) {
            $scope.products.push(newProduct);
            $scope.editedProduct = null;
            $scope.loading = false; 
        });
    }
    $scope.editUser = function(user, passchange, password){
        $scope.loading = true;
        if (passchange){
            $scope.autoservice.password = window.md5(password);
        }
        $scope.autoservice.$saveOrUpdate().then(function(editeduser){
            $rootScope.user = $scope.user;
            if (user.name == undefined){
                user.name = '';
            }
            if (user.surname == undefined){
                user.surname = '';
            }
            if (user.phone == undefined){
                user.phone = '';
            }
            if (passchange){
                Functions.sendMail({
                    email: user.email,
                    username: user.username,
                    subject: user.username + ': данные организации изменены',
                    html: "Добро пожаловать в Carsbir. Ваш логин: " + user.username + " Ваш пароль: " + password,
                });
                Functions.alertAnimate($("#a-user-edit-profile"));            
            }
            else{
                Functions.sendMail({
                    email: user.email,
                    username: user.username,
                    subject: user.username + ': данные организации изменены',
                    html: "Имя = " + user.name + "; Описание = " + user.description + "; Телефон = "+user.phone,
                    });
                Functions.alertAnimate($("#a-user-edit-profile"));         
            }
            $scope.loading = false;
        });
    }

    $scope.createRespond = function (respond) {
        $scope.loading = true; 
        var userofrequest, auto, responds, keepgoing = true;
        respond.autoserviceid=$rootScope.userid;
        respond.productid=$scope.mainproduct._id.$oid;
        respond.type = $scope.mainproduct.type;
        respond.date = Date.now();
        if ($scope.autoservice.number === undefined){
            $scope.autoservice.number = 0;
        }
        else{
            $scope.autoservice.number += 1;
        }
        /*respond.name = parseInt($scope.autoservice.phone.substring(4),10).toString(32) + "-" + (2000000 + $scope.autoservice.number);*/
        respond.name = $scope.mainproduct.name;
        angular.forEach($scope.users,function(value,key){
                if (keepgoing){
                    if (value._id.$oid== $scope.mainproduct.userid){
                        respond.phone = value.phone;
                        respond.username = value.name;
                        userofrequest = value;
                        keepgoing = false;
                    }                    
                }
            }); 
        respond.viewed = false;
        var candirespond = new Responds(respond);
        candirespond.$save().then(function (newRespond) {
            $scope.responds.push(newRespond);
            $rootScope.responds = $scope.responds;
            $scope.mainproduct.responds.push(newRespond);
            newRespond.autoservice = $scope.autoservice;
             $scope.activeresponds.push(newRespond);
             $scope.myresponds.push(newRespond);
             $rootScope.myresponds = $scope.myresponds;
             Functions.alertAnimate($("#a-respond-new"));
            $scope.editedRespond = {};
            $scope.mainproduct.replied = true;
            auto = $scope.mainproduct.auto;
            responds = $scope.mainproduct.responds;
            $scope.mainproduct.auto = [];
            $scope.mainproduct.responds = [];
            $scope.mainproduct.$update();
            $scope.mainproduct.auto = auto;
            $scope.mainproduct.responds = responds;
            Functions.sendMail({
                email: userofrequest.email,
                username: userofrequest.username,
                subject: 'На вашу заявку № '+respond.name+' откликнулись',
                html: $scope.autoservice.username + " сервис ответил на заявку № " + respond.name + ", стоимость ремонта " + respond.cost + "руб. Комментарий: " + respond.description,
            });
            $scope.loading = false; 
        });
        $scope.autoservice.$update().then(function(autoservice){
            $rootScope.autoservice = $scope.autoservice;
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
        $scope.loading = true; 
        $scope.updatedRespond = $scope.mainrespond;
        respond.autoservice = null;
        respond.$update().then(function(){
            $scope.respondview = 1;
            Functions.alertAnimate($("#a-respond-edit"));
            $scope.loading = false;         
        });
        $scope.mainrespond = null;
    }
    $scope.isdeleteRespond = function(respond){
            swal({
              title: "Вы уверены?",
              text: "У вас не получится его восстановить!",
              type: "warning",
              showCancelButton: true,
              confirmButtonColor: "#DD6B55",
              confirmButtonText: "Да, удалить!",
              cancelButtonText: "Нет, я передумал!",
              closeOnConfirm: false,
              closeOnCancel: false
            },
            function(isConfirm){
              if (isConfirm) {
                $scope.deleteRespond(respond);
              } else {
                    swal("Ура", "Всё в порядке", "error");
              }
            });
    }
    $scope.deleteRespond = function (respond) {
        $scope.updatedRespond = respond;
        respond.$remove().then(function () {
            $scope.myresponds.splice($scope.myresponds.indexOf(respond), 1);
            $scope.responds.splice($scope.responds.indexOf(respond), 1);
            swal("Удален!", "Ваша запись удалена", "success");
            Functions.alertAnimate($("#a-respond-delete"));
        });
    }

    $scope.editRespond = function (respond,number) {
        $scope.mainrespond = respond;
        $scope.respondview = number;
    }

    $scope.viewRespond = function (respond,number) {
        $scope.respondview = number;
        $scope.showtable = false;
        $scope.mainrespond = respond;
        $scope.startEdit = false;
        angular.forEach($scope.products, function(value, key) {
            if (respond.productid == value._id.$oid){
                $scope.mainproduct = value;
            }
        });
    }

    $scope.checknegative = function(array,name) {
        var checking = false;
        angular.forEach(array, function(value){
            if ((value == true)&&(checking == false)){
                checking = true;
                $scope.showtable = true;
                if ($scope.formdetails == null){
                    $scope.formdetails = name;
                }
            }
        });
        return checking;
    }

    $scope.viewItem = function (product) {
        $scope.allitems = !$scope.allitems;
        $scope.answered = false;
        $scope.mainproduct = product;
        $scope.startEdit = false;
        $scope.showtable = false;
        if (product){
            $scope.toogleAutoservice = [];
            $scope.activeresponds = [];
            angular.forEach($scope.responds, function(value, key) {
              if (value.productid == product._id.$oid){
                if (value.approved && $scope.mainproduct.phone == undefined){ /* Если заявка подтверждена, то отображаем телефон юзера */                 
                    angular.forEach($scope.users, function(value1, key1){
                        if (value1._id.$oid == product.userid){
                            $scope.mainproduct.phone = value1.phone;
                        }
                    });
                }
                angular.forEach($scope.autoservices, function(value1, key1){
                    if (value1._id.$oid == value.autoserviceid){
                        value.autoservice = value1;
                    }
                });

                if (($scope.answered == false) && (value.autoserviceid == $scope.autoservice._id.$oid)){
                    $scope.answered = true;
                }
                console.log(value);
                $scope.activeresponds.push(value);
                $scope.toogleAutoservice.push(false);
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
