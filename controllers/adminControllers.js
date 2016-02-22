angular.module("sportsStoreAdmin")
.controller("authCtrl", function ($scope, $http, $location, $rootScope, $resource, userRegUrl, autoUrl, Users, Functions, $timeout) {
    $scope.error = null;
    $scope.isused = false;
    $scope.isusedmail = false;
    $scope.user = new Users();
    if ($location.search()['user'] == 'new'){
        Functions.alertAnimate($("#a-user-new"));
    }
    if ($location.search()['email'] != undefined){
        $timeout(function(){
            Functions.alertAnimate($("#a-user-email"));
        },1000);
        $scope.email = $location.search()['email'];
    }
    $scope.authenticate = function (mail, pass) {
        console.log(mail+" "+pass);
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
.controller("mainCtrl", function ($scope, $route, $rootScope, $location,Responds, Requests, Users, Data, Autos,$window) {
    $scope.$on('$routeChangeSuccess',function () {
        var path = $location.path();
        $scope.mainView = false;
        $scope.editView = false;
        $scope.requestView = false;
        $scope.autoView = false;
        console.log("path ="+path);
        switch(path){
            case '/auto':
                $scope.current = '/auto';
                $scope.autoView = true;
                break;
            case '/leaverequest':
                $scope.current = '/leaverequest';
                $scope.requestView = true;
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

    $scope.screens = ["Мои заявки","Автомобили","Оставить заявку","Редактирование профиля"];
    $scope.routes = [
    {path:"/main", name:"Мои заявки"},
    {path:"/auto", name:"Автомобили"},
    {path:"/leaverequest", name:"Оставить заявку"},
    {path:"/edit", name:"Редактирование профиля"}];
    $scope.subjects = Data.getSubjects();
    var w = angular.element($window);
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

   
    w.bind('resize', function () {
      if ($(window).width() > 768){
        $scope.shownav = true;
        $scope.$apply();
      }
      else{
        $scope.shownav = false;
        $scope.$apply();
      }
    });

    $scope.setScreen = function (index) {
    if ($(window).width() < 768){
        $scope.ToggleNav();
    }
        $location.path($scope.routes[index].path);
        Requests.query({userid: $rootScope.userid}).then(function(data){
            $scope.products = data;
            Autos.query({userid: $rootScope.userid}).then(function(auto_data){
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
        Users.getById($rootScope.userid).then(function(user){
            $scope.user = user;
            if (user.subjects != undefined){
            $scope.subjects = Data.getSubjects();
            $scope.subjects.data.map(function (x) {
                if (user.subjects.indexOf(x.id) >= 0){
                    x.checked = true;
                }
                else{
                    x.checked = false;
                }
                return x;
            });
            $rootScope.subjects = $scope.subjects;               
            }
            $rootScope.user = $scope.user; 
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
