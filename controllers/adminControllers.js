angular.module("sportsStoreAdmin")
.controller("authCtrl", function ($scope, $http, $location, $rootScope, $resource, userRegUrl, autoUrl, Users, Functions) {
    $scope.error = null;
    $scope.isused = false;
    $scope.isusedmail = false;
    $scope.user = new Users();
    if ($location.search()['user'] == 'new'){
        Functions.alertAnimate($("#a-user-new"));
    }
    $scope.authenticate = function (mail, pass) {
        $scope.candidat = Users.query({email: mail}).then(function(user){
            console.log(user);
            if (user[0] != undefined){
                if (user[0].password == window.md5(pass)){
                    $location.path("/main");
                    $rootScope.userid = user[0]._id.$oid;
                    Functions.setCookie("userid", $rootScope.userid, {expires: new Date(new Date().getTime() + 60 * 10000000), path: '/'});            
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
    $scope.listProducts = function () {
        if ($rootScope.userid != undefined){
            $location.path("/main");
        }
        else{
            $rootScope.userid = Functions.getCookie('userid');
            if ($rootScope.userid != undefined){
                $location.path("/main");
            }
        }
      };
    $scope.listProducts();
    $scope.restorepassword = function(mail){
        var password='', user;
        Users.query({email: mail}).then(function(found){

            if (found[0] != undefined){
                user = found[0];
                password = (Date.now() + Functions.getRandomInt(1000000,10000000)*100000).toString(36);
                console.log(password);
                user.password = window.md5(password);
                user.$update().then(function(newuser){
                    console.log(newuser);
                    Functions.sendMail({
                        email: user.email,
                        username: user.username,
                        subject: 'Наш пароль изменен в Carsbir',
                        html: "Ваш логин (email): " + user.email + " Ваш новый пароль: " + password,
                    });
                    Functions.alertAnimate($("#a-user-email"));
                });

            }
            else{
                Functions.alertAnimate($("#a-user-noemail"));
            }
        });
    }
    $scope.registration = function (user) {
        var isused = false, temppassword = '',copieduser;
        Users.query({email: user.email}).then(function(found){
            if (found.length > 0){
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
.controller("mainCtrl", function ($scope, $rootScope, $location,Responds, Requests) {

    $scope.screens = ["Мои заявки","Автомобили","Оставить заявку","Редактирование профиля"];
    $scope.routes = ["main", "auto", "leaverequest", "edit"];
    $scope.current = $scope.screens[0];

    $scope.setScreen = function (index) {
        $scope.current = $scope.screens[index];
        Requests.query({userid: $rootScope.userid}).then(function(data){
            $scope.products = data;
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
});
