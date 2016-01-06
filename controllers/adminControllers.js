angular.module("sportsStoreAdmin")
.controller("authCtrl", function ($scope, $http, $location, $rootScope, $resource, userRegUrl,autoUrl, Users, Functions) {
    $scope.error = null;
    $scope.isused = false;
    $scope.user = new Users();
    if ($location.search()['user'] == 'new'){
        Functions.alertAnimate($("#a-user-new"));
    }
    $scope.authenticate = function (user, pass) {
        $scope.candidat = Users.query({username: user}).then(function(user){
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
    $scope.registration = function (user) {
        var isused = false, temppassword = '',copieduser;
        Users.query({username: user.username}).then(function(found){
            if (found.length > 0){
                $scope.isused = true;
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
                        html: "Добро пожаловать в Carsbir. Ваш логин: " + user.username + " Ваш пароль: " + temppassword,
                    });
                }, function(error){
                    $scope.error = error;
                });
            }
        });
    }
})
.controller("mainCtrl", function ($scope,$location) {

    $scope.screens = ["Мои заявки","Автомобили","Оставить заявку","Редактирование профиля"];
    $scope.routes = ["main", "auto", "leaverequest", "edit"];
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
});
