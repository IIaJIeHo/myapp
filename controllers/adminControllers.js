﻿angular.module("sportsStoreAdmin")
.constant("authUrl", "http://localhost:5500/users/login")
.constant("regUrl", "http://localhost:5500/users/")
.constant("ordersUrl", "http://localhost:5500/orders/")
.constant("autoUrl", "http://localhost:5500/autos/")
.controller("authCtrl", function ($scope, $http, $location, $rootScope, $resource, authUrl, regUrl,autoUrl) {
    $scope.RegResource = $resource(regUrl + ":id", { id: "@id" });
    $scope.error = null;

    $scope.authenticate = function (user, pass) {
        $http.post(authUrl, {
            username: user,
            password: pass
        }, {
            withCredentials: true
        }).success(function (data) {
            console.log(data.uid);
            $location.path("/main");
            $rootScope.userid = data.uid;
            var date = new Date(new Date().getTime() + 60 * 10000000);
            document.cookie = "userid="+data.uid+"; path=/; expires=" + date.toUTCString();
        }).error(function (error) {
            $scope.authenticationError = error;
        });
    }
    $scope.user = {
        username: null,
        password: null,
    };


    if ($location.search()['user'] == 'new'){
            $("#a-user-new").show();
            $("#a-user-new").fadeTo(5000, 500).slideUp(500, function(){
               $("#a-user-new").hide();
            }); 
    }
    $scope.registration = function (user) {
        $scope.user = user;
        new $scope.RegResource($scope.user).$save().then(function (newuser) {
            $location.url("/login?user=new");
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
            'subject': 'Добро пожаловать в Carsbir', 
            'html': "Добро пожаловать в Carsbir. Ваш логин: " + user.username + "Ваш пароль: " + user.password, 
            } 
            }});
        }, function(error){
            $scope.error = error;
        });
    }
})
.controller("mainCtrl", function ($scope) {

    $scope.screens = ["Мои заявки","Автомобили","Оставить заявку","Редактирование профиля"];
    $scope.current = $scope.screens[0];

    $scope.setScreen = function (index) {
        $scope.current = $scope.screens[index];
    };

    $scope.getScreen = function () {
        if ($scope.current == "Мои заявки"){
            return "views/adminProducts.html";
        }
        if ($scope.current == "Автомобили"){
            return "views/adminAutos.html";
        }
        if ($scope.current == "Оставить заявку"){
            return "views/adminRequests.html";
        }
        if ($scope.current == "Редактирование профиля"){
            return "views/adminEdit.html";
        }
        if ($scope.current == "Партнеры"){
            return "views/adminPartners.html";
        }
    };
})

.controller("ordersCtrl", function ($scope, $http, ordersUrl) {

    $http.get(ordersUrl, { withCredentials: true })
        .success(function (data) {
            $scope.orders = data;
        })
        .error(function (error) {
            $scope.error = error;
        });

    $scope.selectedOrder;

    $scope.selectOrder = function (order) {
        $scope.selectedOrder = order;
    };

    $scope.calcTotal = function (order) {
        var total = 0;
        for (var i = 0; i < order.products.length; i++) {
            total +=
                order.products[i].count * order.products[i].price;
        }
        return total;
    }
});
