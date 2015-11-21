angular.module("sportsStoreAdmin")
.constant("authUrl", "http://localhost:5500/autoservices/login")
.constant("regUrl", "http://localhost:5500/autoservices/")
.constant("ordersUrl", "http://localhost:5500/orders/")
  .constant('MONGOLAB_CONFIG',{API_KEY:'eUE2PGyR-ac1ocaU_MDvddB4PUArfhPw', DB_NAME:'igormongo'})
        .factory('Users', ['$mongolabResourceHttp' ,function ($mongolabResourceHttp) {
            return $mongolabResourceHttp('Users');
        }])
        .factory('Autos', ['$mongolabResourceHttp' ,function ($mongolabResourceHttp) {
            return $mongolabResourceHttp('Autos');
        }])
        .factory('Autoservices', ['$mongolabResourceHttp' ,function ($mongolabResourceHttp) {
            return $mongolabResourceHttp('Autoservices');
        }])
        .factory('Requests', ['$mongolabResourceHttp' ,function ($mongolabResourceHttp) {
            return $mongolabResourceHttp('Requests');
        }])
        .factory('Responds', ['$mongolabResourceHttp' ,function ($mongolabResourceHttp) {
            return $mongolabResourceHttp('Responds');
        }])
.controller("authCtrl", function ($scope, $http, $location, $rootScope, $resource, authUrl, regUrl, Autoservices) {
    $scope.RegResource = $resource(regUrl + ":id", { id: "@id" });

    $scope.authenticate = function (user, pass) {
        /*
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
        });*/
        $scope.candidat = Autoservices.query({username: user}).then(function(user){
            if (user[0] != undefined){
                if (user[0].password == window.md5(pass)){
                    console.log(user[0]._id.$oid);
                    $location.path("/main");
                    $rootScope.userid = user[0]._id.$oid;
                    var date = new Date(new Date().getTime() + 60 * 10000000);
                    document.cookie = "autoid="+user[0]._id.$oid+"; path=/; expires=" + date.toUTCString();                
                }
                else{
                    $("#a-user-password").show();
                    $("#a-user-password").fadeTo(5000, 500).slideUp(500, function(){
                       $("#a-user-password").hide();
                    });
                }               
            }
            else{
                    $("#a-user-user").show();
                    $("#a-user-user").fadeTo(5000, 500).slideUp(500, function(){
                       $("#a-user-user").hide();
                    });
            }

        });
    }
    $scope.user = new Autoservices();

    if ($location.search()['user'] == 'new'){
            $("#a-user-new").show();
            $("#a-user-new").fadeTo(5000, 500).slideUp(500, function(){
               $("#a-user-new").hide();
            }); 
    }

    /*$scope.registration = function (user, pass) {
        $scope.user.username = user;
        $scope.user.password = pass;
        new $scope.RegResource($scope.user).$save().then(function (newuser) {
            $location.path("/login");
        });
    }*/
    $scope.isused = false;
    $scope.registration = function (user) {
        /*$scope.user = user;*/
        Autoservices.query({username: user.username}).then(function(autoservice){
            if (autoservice == []){
                console.log("isused");
                $scope.isused = true;
            }
            else{
                console.log("saved");
                $scope.user.password = window.md5($scope.user.password);
                $scope.user.$save().then(function (newuser) {
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

 angular.module('sportsStoreAdmin')
  .factory('$mongolabResourceHttp', ['MONGOLAB_CONFIG', '$http', '$q', function (MONGOLAB_CONFIG, $http, $q) {

    function MmongolabResourceFactory(collectionName) {

      var config = angular.extend({
        BASE_URL: 'https://api.mongolab.com/api/1/databases/'
      }, MONGOLAB_CONFIG);

      var dbUrl = config.BASE_URL + config.DB_NAME;
      var collectionUrl = dbUrl + '/collections/' + collectionName;
      var defaultParams = {apiKey: config.API_KEY};

      var resourceRespTransform = function (response) {
        return new Resource(response.data);
      };

      var resourcesArrayRespTransform = function (response) {
        return response.data.map(function(item){
          return new Resource(item);
        });
      };

      var preparyQueryParam = function (queryJson) {
        return angular.isObject(queryJson) && Object.keys(queryJson).length ? {q: JSON.stringify(queryJson)} : {};
      };

      var Resource = function (data) {
        angular.extend(this, data);
      };

      Resource.query = function (queryJson, options) {

        var prepareOptions = function (options) {

          var optionsMapping = {sort: 's', limit: 'l', fields: 'f', skip: 'sk'};
          var optionsTranslated = {};

          if (options && !angular.equals(options, {})) {
            angular.forEach(optionsMapping, function (targetOption, sourceOption) {
              if (angular.isDefined(options[sourceOption])) {
                if (angular.isObject(options[sourceOption])) {
                  optionsTranslated[targetOption] = JSON.stringify(options[sourceOption]);
                } else {
                  optionsTranslated[targetOption] = options[sourceOption];
                }
              }
            });
          }
          return optionsTranslated;
        };

        var requestParams = angular.extend({}, defaultParams, preparyQueryParam(queryJson), prepareOptions(options));

        return $http.get(collectionUrl, {params: requestParams}).then(resourcesArrayRespTransform);
      };

      Resource.all = function (options, successcb, errorcb) {
        return Resource.query({}, options || {});
      };

      Resource.count = function (queryJson) {
        return $http.get(collectionUrl, {
          params: angular.extend({}, defaultParams, preparyQueryParam(queryJson), {c: true})
        }).then(function(response){
          return response.data;
        });
      };

      Resource.distinct = function (field, queryJson) {
        return $http.post(dbUrl + '/runCommand', angular.extend({}, queryJson || {}, {
          distinct: collectionName,
          key: field}), {
          params: defaultParams
        }).then(function (response) {
          return response.data.values;
        });
      };

      Resource.getById = function (id) {
        return $http.get(collectionUrl + '/' + id, {params: defaultParams}).then(resourceRespTransform);
      };

      Resource.getByObjectIds = function (ids) {
        var qin = [];
        angular.forEach(ids, function (id) {
          qin.push({$oid: id});
        });
        return Resource.query({_id: {$in: qin}});
      };

      //instance methods

      Resource.prototype.$id = function () {
        if (this._id && this._id.$oid) {
          return this._id.$oid;
        } else if (this._id) {
          return this._id;
        }
      };

      Resource.prototype.$save = function () {
        return $http.post(collectionUrl, this, {params: defaultParams}).then(resourceRespTransform);
      };

      Resource.prototype.$update = function () {
        return  $http.put(collectionUrl + "/" + this.$id(), angular.extend({}, this, {_id: undefined}), {params: defaultParams})
          .then(resourceRespTransform);
      };

      Resource.prototype.$saveOrUpdate = function () {
        return this.$id() ? this.$update() : this.$save();
      };

      Resource.prototype.$remove = function () {
        return $http['delete'](collectionUrl + "/" + this.$id(), {params: defaultParams}).then(resourceRespTransform);
      };


      return Resource;
    }

    return MmongolabResourceFactory;
  }]);