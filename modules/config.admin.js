            angular.module("sportsStoreAdmin", ["ngRoute", "ngResource"])
            .config(function ($routeProvider) {

                $routeProvider.when("/login", {
                    templateUrl: "views/adminLogin.html"
                });

                $routeProvider.when("/registration", {
                    templateUrl: "views/adminRegistration.html"
                });

                $routeProvider.when("/main", {
                    templateUrl: "views/adminMain.html"
                });

                $routeProvider.when("/auto", {
                    templateUrl: "views/adminMain.html"
                });

                $routeProvider.when("/leaverequest", {
                    templateUrl: "views/adminMain.html"
                });

                $routeProvider.when("/edit", {
                    templateUrl: "views/adminMain.html"
                });

                $routeProvider.when("/forgetpassword", {
                    templateUrl: "views/adminForgetPassword.html"
                });

                $routeProvider.otherwise({
                    redirectTo: "login"
                });
            })
            .config(function($httpProvider) {
                $httpProvider.defaults.withCredentials = true;
            });