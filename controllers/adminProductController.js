angular.module("sportsStoreAdmin")
.constant("productUrl", "http://localhost:5500/products/")
.constant("regUrl", "http://localhost:5500/users")
.constant("respondUrl", "http://localhost:5500/responds/")
.constant("autoUrl", "http://localhost:5500/auto")
.config(function($httpProvider) {
    $httpProvider.defaults.withCredentials = true;
})
.controller("productCtrl", function ($scope, $rootScope, $resource, productUrl, regUrl, respondUrl) {

    $scope.productsResource = $resource(productUrl + ":id", { id: "@id" });
    $scope.RegResource = $resource(regUrl + ":id", { id: "@id" });
    $scope.RespondResource = $resource(respondUrl + ":id", { id: "@id" });
    $scope.allitems = true;
    $scope.mainproduct = null;
    $scope.activeresponds = [];
    function getCookie(name) {
      var matches = document.cookie.match(new RegExp(
        "(?:^|; )" + name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, '\\$1') + "=([^;]*)"
      ));
      return matches ? decodeURIComponent(matches[1]) : undefined;
    }

    $scope.listProducts = function () {
        if ($rootScope.userid == undefined){
            $rootScope.userid = getCookie('userid');
        }
        $scope.products = $scope.productsResource.query({userid: $rootScope.userid});
        $scope.responds = $scope.RespondResource.query(function(data){
            console.log(data);
        });
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
                $scope.activeresponds.push(value);
              }
            });           
        }
    }

    $scope.approveItem = function(item){
        item.approved = !item.approved;
        item.$save();
    }

    $scope.cancelEdit = function () {
        $scope.editedProduct = null;
    }

    $scope.listProducts();
})
.controller("autoCtrl", function ($scope, $rootScope, $resource, regUrl, autoUrl, productUrl) {

    $scope.RegResource = $resource(regUrl + ":id", { id: "@id" });
    $scope.AutoResource = $resource(autoUrl + ":id", { id: "@id" });
    $scope.ProductsResource = $resource(productUrl + ":id", { id: "@id" });
    $scope.allitems = true;
    $scope.mainproduct = {};
    $scope.mainproduct.details = {};
    $scope.mainproduct.details.question = [];
    $scope.mainproduct.details.engine = [];
    $scope.mainproduct.details.head = [];
    $scope.mainproduct.details.wheel = [];
    $scope.mainproduct.details.addi = [];
    $scope.mainproduct.details.diagnos = [];
    $scope.mainproduct.details.work = [];
    $scope.mainproduct.details.destructions = [];

    $scope.activeresponds = [];
    function getCookie(name) {
      var matches = document.cookie.match(new RegExp(
        "(?:^|; )" + name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, '\\$1') + "=([^;]*)"
      ));
      return matches ? decodeURIComponent(matches[1]) : undefined;
    }

    $scope.listProducts = function () {
        $scope.allitems = 1;
        if ($rootScope.userid == undefined){
            $rootScope.userid = getCookie('userid');
        }
        $scope.autos = $scope.AutoResource.query({userid: $rootScope.userid});
    }

    $scope.deleteProduct = function (product) {
        product.$delete().then(function () {
            $scope.products.splice($scope.products.indexOf(product), 1);
        });
    }

    $scope.addItem = function (auto) {
        auto.userid=$rootScope.userid;
        console.log(auto);
        new $scope.AutoResource(auto).$save().then(function (newAuto) {
            $scope.autos.push(newAuto);
            $scope.mainproduct = null;
            $scope.allitems = 1;
        });        
    }

    $scope.addRequest = function (request) {
        request.userid=$rootScope.userid;
        request.type = $scope.allitems;
        request.autoid = request.autoid.id;
        console.log(request);
        new $scope.ProductsResource(request).$save().then(function (newrequest) {
            $scope.mainproduct = null;
            $scope.allitems = 1;
            console.log(newrequest);
        });        
    }
    

    $scope.updateProduct = function (product) {
        product.$save();
        $scope.editedProduct = null;
    }

    $scope.startEdit = function (product) {
        $scope.editedProduct = product;
    }

    $scope.viewItem = function (auto,number) {
        $scope.allitems = number;
        console.log($scope.mainproduct.details);
    }

    $scope.approveItem = function(item){
        item.approved = !item.approved;
        item.$save();
    }

    $scope.cancelEdit = function () {
        $scope.editedProduct = null;
    }

    $scope.listProducts();
});
