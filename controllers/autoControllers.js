angular.module("sportsStoreAdmin")
.constant("authUrl", "http://localhost:5500/autoservices/login")
.constant("regUrl", "http://localhost:5500/autoservices/")
.constant("ordersUrl", "http://localhost:5500/orders/")
.controller("authCtrl", function ($scope, $http, $location, $rootScope, $resource, authUrl, regUrl) {
    $scope.RegResource = $resource(regUrl + ":id", { id: "@id" });

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
            var date = new Date(new Date().getTime() + 60 * 1000000000);
            document.cookie = "autoid="+data.uid+"; path=/; expires=" + date.toUTCString();
        }).error(function (error) {
            $scope.authenticationError = error;
        });
    }
    $scope.user = {
        username: null,
        password: null,
    };
    $scope.registration = function (user, pass) {
        $scope.user.username = user;
        $scope.user.password = pass;
        new $scope.RegResource($scope.user).$save().then(function (newuser) {
            $location.path("/login");
        });
    }


})
.controller("mainCtrl", function ($scope) {

    $scope.screens = ["Заявки", "Мои ответы","Редактирование профиля"];
    $scope.current = $scope.screens[0];

    $scope.setScreen = function (index) {
        $scope.current = $scope.screens[index];
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
