﻿angular.module("sportsStoreAdmin")
.controller("authCtrl", function ($scope, $http, $location, $rootScope, $resource, autoRegUrl, Autoservices, Functions, Data) {
    if ($location.search()['email'] != undefined){
        Functions.alertAnimate($("#a-user-email"));
        $scope.email = $location.search()['email'];
    }
    $scope.RegResource = $resource(autoRegUrl + ":id", { id: "@id" });
    $scope.authenticate = function (mail, pass) {
        $scope.candidat = Autoservices.query({email: mail}).then(function(user){
            if (user[0] != undefined){
                if (user[0].password == window.md5(pass)){
                    $location.path("/main");
                    $rootScope.userid = user[0]._id.$oid;
                    var date = new Date(new Date().getTime() + 60 * 10000000);
                    document.cookie = "autoid="+user[0]._id.$oid+"; path=/; expires=" + date.toUTCString();                
                }
                else{
                    Functions.alertAnimate($("#a-user-password"));
                }               
            }
            else{
                Functions.alertAnimate($("#a-user-user"));
            }

        });
    }
    $scope.user = new Autoservices();
        $scope.listProducts = function () {
            if ($rootScope.userid != undefined){
                $location.path("/main");
            }
            else{
                $rootScope.userid = Functions.getCookie('autoid');
                if ($rootScope.userid != undefined){
                    $location.path("/main");
                }
            }
          };
          $scope.listProducts();
    if ($location.search()['user'] == 'new'){
        Functions.alertAnimate($("#a-user-new"));
    }

    $scope.isused = false;
    $scope.isusedmail = false;
    $scope.restorepassword = function(mail){
        var password='', user;
        Autoservices.query({email: mail}).then(function(found){

            if (found[0] != undefined){
                user = found[0];
                password = (Date.now() + Functions.getRandomInt(1000000,10000000)*100000).toString(36);
                user.password = window.md5(password);
                user.$update().then(function(newuser){
                    Functions.sendMail({
                        email: user.email,
                        username: user.username,
                        subject: 'Наш пароль изменен в Carsbir',
                        html: "Ваш логин (email): " + user.email + " Ваш новый пароль: " + password,
                    });
                    $location.url("/login?email="+mail);
                });
            }
            else{
                Functions.alertAnimate($("#a-user-noemail"));
            }
        });
    }
    $scope.registration = function (user) {
        var isused = false, temppassword = '',copieduser;
        Autoservices.query({email: user.email}).then(function(autoservice){
            if (autoservice.length > 0){
                console.log("isused");
                $scope.isusedmail = true;
            }
            else{
                $scope.validation.password = false;
                temppassword = $scope.user.password;
                copieduser = angular.copy($scope.user);
                copieduser.password = window.md5($scope.user.password);
                copieduser.date = Date.now();
                copieduser.$save().then(function (newuser) {
                    $scope.authenticate(user.email,temppassword);
                    Functions.sendMail({
                        email: user.email,
                        username: user.username,
                        subject: 'Добро пожаловать в Carsbir',
                        html: "Добро пожаловать в Carsbir. Ваш логин (email): " + user.email + " Ваш пароль: " + temppassword,
                    });
                }, function(error){
                    $scope.error = error;
                });
            }
        });
    }
})
.controller("mainCtrl", function ($scope,$route, $rootScope, $location, Autoservices,Requests,Autos,Responds,Users,Autoservices,Data) {

    $scope.$on('$routeChangeSuccess',function () {
        var path = $location.path();
        $scope.mainView = false;
        $scope.editView = false;
        $scope.respondsView = false;
        console.log("path ="+path);
        switch(path){
            case '/responds':
                $scope.current = '/responds';
                $scope.respondsView = true;
                break;
            case '/edit':
                $scope.current = '/edit';
                $scope.editView = true;
                break;
            default:
                $scope.current = '/main';
                $scope.mainView = true;
                break;
        }
    })

    $scope.screens = ["Заявки", "Мои ответы","Редактирование профиля"];
    $scope.routes = [
    {path:"/main", name:"Заявки"},
    {path:"/responds", name:"Мои ответы"},
    {path:"/edit", name:"Редактирование профиля"}];
    $scope.shownav = true;
    if ($(window).width() < 768){
        $scope.shownav = false;
    }
    else{
        $scope.shownav = true;
    }
    $scope.ToggleNav = function () {
        if ($scope.shownav){
            $scope.shownav = false;
        }
        else{
            $scope.shownav = true;
        }
    }

    $scope.setScreen = function (index) {
        if ($(window).width() < 768){
            $scope.ToggleNav();
        }
        $location.path($scope.routes[index].path);
        Autoservices.getById($rootScope.userid).then(function(autoservice){
            $scope.autoservice = autoservice;
            $scope.autoservice.id = $scope.autoservice._id.$oid;
            $scope.subjects = Data.getSubjects();
            $scope.subjects.data.map(function (x) {
                if (autoservice.subjects != undefined){
                    if (autoservice.subjects.indexOf(x.id) >= 0){
                        x.checked = true;
                    }
                    else{
                        x.checked = false;
                    }
                    return x;         
                }
            });
            $rootScope.subjects = $scope.subjects;
            $rootScope.autoservice = $scope.autoservice;
                Requests.query().then(function(data){
                    var temp_time = $scope.autoservice.date - 30*1000*60*60*24;
                    data = data.filter(function(product){
                        return product.date > temp_time;
                    });
                    if ($scope.autoservice.subjects != undefined){
                        data = data.filter(function(product){
                            return ((product.subjects == undefined) || (product.subjects.some(function (subject) {
                               return $scope.autoservice.subjects.indexOf(subject) >= 0
                            })));
                        });
                    }
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
                        Responds.query({ autoserviceid : $rootScope.userid }).then(function(responds_data){ 
                            $scope.myresponds = responds_data;
                            angular.forEach($scope.products, function(value, key) {
                                angular.forEach($scope.myresponds, function(value_res, key_res) {
                                    if(value._id.$oid == value_res.productid){
                                        value_res.auto = value.auto;
                                    }
                                });
                            });
                            $rootScope.myresponds = $scope.myresponds;
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
        Users.query().then(function(users_data){ $scope.users = users_data; $rootScope.users = $scope.users;}); 
        Autoservices.query().then(function(autoservices){
            $scope.autoservices = autoservices;
            $rootScope.autoservices = $scope.autoservices;
        });
    };

    $scope.getScreen = function () {
        if ($scope.current == "Заявки"){
            return "views/autoProducts.html";
        }
        if ($scope.current == "Мои ответы"){
            return "views/autoResponds.html";
        }
        if ($scope.current == "Оставить заявку"){
            return "views/adminRequests.html";
        }
        if ($scope.current == "Редактирование профиля"){
            return "views/autoEdit.html";
        }
        if ($scope.current == "Партнеры"){
            return "views/adminPartners.html";
        }
    };
});