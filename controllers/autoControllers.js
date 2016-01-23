angular.module("sportsStoreAdmin")
.controller("authCtrl", function ($scope, $http, $location, $rootScope, $resource, autoRegUrl, Autoservices, Functions, Data) {
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
                    $scope.authenticate(user.username,temppassword);
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
.controller("mainCtrl", function ($scope,$rootScope,Autoservices,Requests,Autos,Responds,Users,Autoservices) {

    $scope.screens = ["Заявки", "Мои ответы","Редактирование профиля"];
    $scope.current = $scope.screens[0];

    $scope.setScreen = function (index) {
        $scope.current = $scope.screens[index];
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