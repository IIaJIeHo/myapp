angular.module("sportsStoreAdmin")
.constant("authUrl", "http://localhost:5500/users/login")
.constant("regUrl", "http://localhost:5500/users")
.constant("ordersUrl", "http://localhost:5500/orders")
.constant("autoUrl", "http://localhost:5500/auto")
.controller("authCtrl", function ($scope, $http, $location, $rootScope, $resource, authUrl, regUrl,autoUrl) {
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
    $scope.registration = function (user) {
        $scope.user = user;
        new $scope.RegResource($scope.user).$save().then(function (newuser) {
            $location.path("/login");
        });
    }


})
.controller("mainCtrl", function ($scope) {

    $scope.screens = ["Products", "Orders","Autos","Заявки"];
    $scope.current = $scope.screens[0];

    $scope.setScreen = function (index) {
        $scope.current = $scope.screens[index];
    };

    $scope.getScreen = function () {
        if ($scope.current == "Products"){
            return "views/adminProducts.html";
        }
        if ($scope.current == "Orders"){
            return "views/adminOrders.html";
        }
        if ($scope.current == "Autos"){
            return "views/adminAutos.html";
        }
        if ($scope.current == "Заявки"){
            return "views/adminRequests.html";
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
