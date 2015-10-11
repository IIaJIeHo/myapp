angular.module("sportsStoreAdmin")
.constant("productUrl", "http://localhost:5500/products/")
.constant("regUrl", "http://localhost:5500/autoservices")
.constant("respondUrl", "http://localhost:5500/responds/")
.constant("userUrl", "http://localhost:5500/users/")
.config(function($httpProvider) {
    $httpProvider.defaults.withCredentials = true;
})
.controller("productCtrl", function ($scope, $rootScope, $resource, productUrl, regUrl, respondUrl, userUrl) {

    $scope.productsResource = $resource(productUrl + ":id", { id: "@id" });
    $scope.RegResource = $resource(regUrl + ":id", { id: "@id" });
    $scope.RespondResource = $resource(respondUrl + ":id", { id: "@id" });
    $scope.UserResource = $resource(userUrl + ":id", { id: "@id" });
    $scope.allitems = true;
    $scope.mainproduct = null;
    function getCookie(name) {
      var matches = document.cookie.match(new RegExp(
        "(?:^|; )" + name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, '\\$1') + "=([^;]*)"
      ));
      return matches ? decodeURIComponent(matches[1]) : undefined;
    }

    $scope.listProducts = function () {
        if ($rootScope.userid == undefined){
            $rootScope.userid = getCookie('autoid');
        }
        $scope.products = $scope.productsResource.query();
        $scope.users = $scope.UserResource.query();
        $scope.responds = $scope.RespondResource.query({autoserviceid: $rootScope.userid});

        $scope.productsResource.query({name: "Kayak"}, function(data){
            console.log(data);
        });
        $scope.RegResource.query(function(data){
            console.log(data);
        });
        console.log($rootScope.userid+"111");
    }

    $scope.deleteProduct = function (product) {
        product.$delete().then(function () {
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

    $scope.createRespond = function (respond) {
        respond.autoserviceid=$rootScope.userid;
        respond.productid=$scope.mainproduct.id;
        console.log(respond);
        new $scope.RespondResource(respond).$save().then(function (newRespond) {
            $scope.responds.push(newRespond);
            $scope.allitems = !$scope.allitems;
        });
    }

    $scope.updateProduct = function (product) {
        product.$save();
        $scope.editedProduct = null;
    }

    $scope.startEdit = function (product) {
        $scope.editedProduct = product;
    }

    $scope.viewItem = function (product) {
        $scope.allitems = !$scope.allitems;
        $scope.mainproduct = product;
        if (product){
            $scope.activeresponds = [];
            angular.forEach($scope.responds, function(value, key) {
              if (value.productid == product.id){
                if (value.approved && $scope.mainproduct.phone == undefined){ /* Если заявка подтверждена, то отображаем телефон юзера*/                 
                    angular.forEach($scope.users, function(value1, key1){
                        console.log(value1.id+"value");
                        console.log(product.userid+"pro");
                        if (value1.id == product.userid){
                            console.log(value1.phone);
                            $scope.mainproduct.phone = value1.phone;
                        }
                    });
                }
                $scope.activeresponds.push(value);
              }
            });           
        }
    }

    $scope.cancelEdit = function () {
        $scope.editedProduct = null;
    }

    $scope.listProducts();
});
