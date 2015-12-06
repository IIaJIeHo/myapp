angular.module("sportsStoreAdmin")
.constant("productUrl", "http://localhost:5500/products/")
.constant("regUrl", "http://localhost:5500/users/")
.constant("respondUrl", "http://localhost:5500/responds/")
.constant("autoUrl", "http://localhost:5500/autos/")
.constant("meUrl", "http://localhost:5500/users/")
.constant("serviceUrl", "http://localhost:5500/autoservices/")
.constant("fileupload", "http://localhost:5500/upload/")
.config(function($httpProvider) {
    $httpProvider.defaults.withCredentials = true;
})
.directive('ngConfirmClick', [
        function(){
            return {
                link: function (scope, element, attr) {
                    var msg = attr.ngConfirmClick || "Are you sure?";
                    var clickAction = attr.confirmedClick;
                    element.bind('click',function (event) {
                        if ( window.confirm(msg) ) {
                            scope.$eval(clickAction)
                        }
                    });
                }
            };
}])
.controller("productCtrl", function ($scope, $rootScope, $resource, $location, productUrl, regUrl, respondUrl, meUrl, serviceUrl, autoUrl, Autos, Users, Autoservices, Responds, Requests) {

    $scope.productsResource = $resource(productUrl + ":id", { id: "@id" });
    $scope.RegResource = $resource(regUrl + ":id", { id: "@id" });
    $scope.RespondResource = $resource(respondUrl + ":id", { id: "@id" });
    $scope.MeResource = $resource(meUrl + ":id", { id: "@id" });
    $scope.ServiceResource = $resource(serviceUrl + ":id", { id: "@id" });
    $scope.AutoResource = $resource(autoUrl + ":id", { id: "@id" });
    $scope.allitems = true;
    $scope.mainproduct = null;
    $scope.user = null;
    $scope.activeresponds = [];
    $scope.Allpartners = true;
    $scope.activeItem = null;
    $scope.partners = [];
    $scope.texts = {};
    $scope.startEdit = false;
    $scope.updatedRequest = null;
    $scope.products = null;
    $scope.autos = null;
    $scope.responds = null;
    $scope.partners = null;
    $scope.loading = false;
    $scope.toogleAutoservice = [];
    $scope.baseurl = "http://localhost/myapp";
    $scope.requests = ['Заявка на ТО','Заявка на Ремонт','Кузовные работы'];
    $scope.texts.work = ['Контрольный осмотр',
        'Замена масла в двигателе (в каждом ТО)',
        'Замена масляного фильтра (в каждом ТО)',
        'Защита двигателя',
        'Замена салонного фильтра',
        'Замена передних тормозных колодок',
        'Замена задних тормозных колодок',
        'Замена передних тормозных дисков',
        'Замена задних тормозных дисков',
        'Замена свечей зажигания',
        'Замена тормозной жидкости', 
        'Замена топливного фильтра', 
        'Замена воздушного фильтра', 
        'Замена масла в коробке передач', 
        'Замена ремня ГРМ',
        'Помпа (замена)',
        'Охлаждающая жидкость (замена)'];
    $scope.texts.question = ['Масло в двигателе (замена)',
        'Масляный фильтр (замена)',
        'Масло в коробке передач (замена)', 
        'Сход-развал',
        'Свечи зажигания (замена)', 
        'Тормозные колодки (замена)', 
        'Тормозные диски (замена)', 
        'Тормозные барабаны (замена)', 
        'Топливный фильтр (замена)', 
        'Салонный фильтр (замена)', 
        'Заправка кондиционера', 
        'Тормозная жидкость (замена)', 
        'Охлаждающая жидкость (замена)', 
        'Жидкость гидроусилителя (ГУР) (замена)'];
        $scope.texts.diagnos = ['Контрольный осмотр',
        'Диагностика двигателя',
        'Диагностика коробки передач',
        'Диагностика подвески',
        'Диагностика электрики'];
        $scope.texts.engine = ['Замена масла',
        'Генератор',
        'Инжектор',
        'Кондиционер',
        'Маслосъемные колпачки (замена)',
        'Насос масляный',
        'Насос топливный', 
        'Помпа (замена)',
        'Радиатор',
        'Ремень ГРМ (замена)', 
        'Цепь ГРМ',
        'Свечи зажигания (замена)', 
        'Термостат (замена)',
        'Турбина',
        'Фильтр воздушный (замена)', 
        'Фильтр масляный (замена)',
        'Фильтр салона (замена)', 
        'Фильтр топливный (замена)', 
        'Форсунки'];
        $scope.texts.head = ['Амортизатор (замена)',
        'Втулка стабилизатора (замена)', 
        'Подшипник ступицы (замена)',
        'Пружина(замена)',
        'Рычаг передний(замена)', 
        'Рычаг задний (замена)', 
        'Сайлентблок переднего рычага (замена)', 
        'Сайлентблок заднего рычага (замена)', 
        'Стойка стабилизатора (замена)', 
        'Ступица (замена)', 
        'Тормозные колодки (замена)', 
        'Тормозные диски (замена)', 
        'Тормозные барабаны (замена)', 
        'Тормозная жидкость (замена)', 
        'Датчик ABS (замена)', 
        'Датчик ESP (замена)', 
        'Шаровые (замена)'];
        $scope.texts.wheel = ['Рулевая рейка',
        'Рулевая тяга (замена)', 
        'Наконечник рулевой тяги (замена)',
        'Жидкость гидроусилителя (замена)',
        'Насос гидроусилителя (замена)', 
        'Сцепление',
        'Шрус (замена)', 
        'Замена масла в коробке передач'];
        $scope.texts.addi = ['Тонировка',
        'Сигнализация (название в комментарии)',
        'Парктроник (описать в комментарии)', 
        'Химчистка салона',
        'Полировка', 
        'Противоугонный комплекс (описать в комментарии)',
        'Иммобилайзер (описать в комментарии)',
        'Защита картера (установка)', 
        'Отопитель двигателя (описать в комментарии)',
        'Шумоизоляция (описать в комментарии)'];
        $scope.texts.destructions = [{ title: 'Бампер', eng: 'bamper',
        data: ['Задний', 
        'Передний']},
        { title: 'Дверь', eng: 'dver',
        data: ['Задняя левая', 
        'Задняя правая', 
        'Передняя левая', 
        'Передняя правая']},
        { title: 'Зеркало боковое', eng: 'zerkalo',
        data: ['Левое', 
        'Правое']},
        { title: 'Крыло', eng: 'krilo',
        data: ['Переднее правое', 
        'Переднее левое' ,
        'Заднее правое' ,
        'Заднее левое']},
        { title:'Порог', eng: 'porog',
        data: ['Правый' ,
        'Левый']},
        { title:'Стекло', eng: 'steklo',
        data: ['Лобовое без датчика дождя(замена)' ,
        'Лобовое с датчиком дождя(замена)' ,
        'Лобовое ремонт скола' ,
        'Лобовое ремонт трещины' ,
        'Передней правой двери' ,
        'Передней левой двери' ,
        'Задней правой двери' ,
        'Задней левой двери' ,
        'Заднее']},
        { title:'Фара', eng: 'fara',
        data: ['Передняя правая' ,
        'Передняя левая']},
        { title:'Противотуманка', eng: 'tuman',
        data: ['Передняя правая',
        'Передняя левая' ,
        'Задняя']},
        { title:'Задний фонарь', eng: 'fonar',
        data: ['Правый' ,
        'Левый']}];
    function getCookie(name) {
      var matches = document.cookie.match(new RegExp(
        "(?:^|; )" + name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, '\\$1') + "=([^;]*)"
      ));
      return matches ? decodeURIComponent(matches[1]) : undefined;
    }

    $('#navigation a').click(function (e) {
        e.preventDefault();
        $(this).tab('show');
    });
    $('#reque2 a').click(function (e) {
        e.preventDefault();
        $(this).tab('show');
    });
    $('.collapse').collapse();

    $scope.logout = function(){
        $rootScope.userid = undefined;
        document.cookie = "userid=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;";
        $rootScope.products = null;
        $scope.listProducts();
    }
    $scope.listProducts = function () {
        $scope.loading = true;
        if ($rootScope.userid == undefined){
            console.log($rootScope.userid);
            $rootScope.userid = getCookie('userid');
            console.log($rootScope.userid);
        }
        if ($rootScope.userid == undefined){
            $location.path("/login");
        }
        else{
        /*$scope.products = $scope.productsResource.query({userid: $rootScope.userid},function(data){
            $scope.autos = $scope.AutoResource.query({userid: $rootScope.userid},function(auto_data){
                angular.forEach(data, function(value, key) {
                    value.type=$scope.requests[value.type - 1];
                angular.forEach(auto_data, function(value_auto, key_auto) {
                    if (value.autoid == value_auto.id){
                        value.auto=value_auto;
                    }
                });
                });
            });
            $scope.responds = $scope.RespondResource.query(function(responds_data){
                 angular.forEach(data, function(value, key) {
                    value.responds = [];
                angular.forEach(responds_data, function(value_res, key_res) {
                    if (value.id == value_res.productid){
                        value.responds.push(value_res);
                    }
                });               
            });
        });       
        });*/
        if ($rootScope.products != null){
            $scope.products = $rootScope.products;
            $scope.autos = $rootScope.autos;
            $scope.responds = $rootScope.responds;
            $scope.user = $rootScope.user;
            $scope.partners = $rootScope.partners;
            console.log("from cache");
            $scope.loading = false;
        }
        else{
        Requests.query({userid: $rootScope.userid}).then(function(data){
            $scope.products = data;
            console.log(data);
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
        /*
        $scope.user = $scope.MeResource.get({ id: $rootScope.userid },function(data){
            console.log(data);
        });*/

        Users.getById($rootScope.userid).then(function(user){
            $scope.user = user;
            $rootScope.user = $scope.user; 
        });
        
        Autoservices.query().then(function(data){
            $scope.partners = data;
            $rootScope.partners = $scope.partners; 
        }); 
        }
          
        }

    }
        $scope.formatDate = function(date) {
            if (date != undefined){
                 date = new Date(date);
              var hours = date.getHours();
              hours = hours < 10 ? '0'+hours : hours;
              var minutes = date.getMinutes();
              var seconds = date.getSeconds();
              var day = date.getDate() < 10 ? '0'+date.getDate() : date.getDate();
              var month = (date.getMonth()+1) < 10 ? '0'+ (date.getMonth() + 1) : (date.getMonth() + 1);
              minutes = minutes < 10 ? '0'+minutes : minutes;
              var strTime = hours + ':' + minutes;
              return day + "." + month+ "." + date.getFullYear() + " / " + strTime + "";               
            }
            else{
                return '';
            }
    }

    $scope.viewPartner = function(item){
        $scope.activeItem = item;
        $scope.Allpartners = !$scope.Allpartners;
    }

    $scope.predicate='date';
    $scope.reverse = true;
    $scope.order = function(predicate){
        $scope.reverse = ($scope.predicate === predicate) ? !$scope.reverse : false;
        $scope.predicate = predicate;
    }

    $scope.editUser = function(user,passchange){
        $scope.loading = true;
        var temp = $scope.user.password;
        if (passchange){
            $scope.user.password = window.md5($scope.user.password);
        }
        $scope.user.$saveOrUpdate().then(function(editeduser){
            $rootScope.user = $scope.user; 
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
            'subject': 'Данные пользователя изменена', 
            'html': "Имя = " + user.name + "; Фамилия = " + user.surname + "; Телефон = "+user.phone+"; Пароль = " + temp, 
            } 
            }});
            $("#a-user-edit-profile").show();
            $("#a-user-edit-profile").fadeTo(5000, 500).slideUp(500, function(){
               $("#a-user-edit-profile").hide();
            });
            $scope.loading = false;
        });
        /*
        user.$save().then(function(editeduser){
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
            'subject': 'Данные пользователя изменена', 
            'html': "Имя = " + user.name + "Фамилия = " + user.surname + "Телефон = "+user.phone+"Пароль = " + temp, 
            } 
            }});
            $("#a-user-edit-profile").show();
            $("#a-user-edit-profile").fadeTo(5000, 500).slideUp(500, function(){
               $("#a-user-edit-profile").hide();
            }); 
        });
*/
    }

    $scope.deleteProduct = function (product) {
        product.$remove().then(function () {
            $scope.products.splice($scope.products.indexOf(product), 1);
            $rootScope.products = $scope.products;
            swal("Удален!", "Ваша заявка удалена", "success");
            $("#a-request-delete").show();
            $("#a-request-delete").fadeTo(5000, 500).slideUp(500, function(){
               $("#a-request-delete").hide();
            }); 
        });
    }

    $scope.createProduct = function (product) {
        $scope.loading = true;
        product.userid=$rootScope.userid;
        product.completed = false;
        var request = new Requests(product);
        requests.$save().then(function (newProduct) {
            $scope.products.push(newProduct);
            $rootScope.products = $scope.products; 
            $scope.editedProduct = null;
            $scope.loading = false;
        });
    }

    $scope.isdeleteProduct = function(product){
        console.log("fdf");
            swal({
              title: "Вы уверены?",
              text: "У вас не получится восстановить заявку!",
              type: "warning",
              showCancelButton: true,
              confirmButtonColor: "#DD6B55",
              confirmButtonText: "Да, удалить!",
              cancelButtonText: "Нет, я передумал!",
              closeOnConfirm: false,
              closeOnCancel: false
            },
            function(isConfirm){
              if (isConfirm) {
                $scope.deleteProduct(product);
              } else {
                    swal("Ура", "Всё в порядке", "error");
              }
            });
    }

    $scope.updateProduct = function (product) {
        $scope.loading = true;
        var auto = product.auto;
        var responds = product.responds;
        $scope.updatedRequest = product;
        product.date = Date.now();
        product.autoid = product.auto._id.$oid;
        console.log("autoid:"+product.autoid);
        product.auto = [];
        product.responds = [];
        product.$update().then(function(newProduct){ 
            newProduct.auto = auto;
            newProduct.responds = responds;
            $scope.products.push(newProduct);
            $scope.products.splice($scope.products.indexOf(product), 1);
            $rootScope.products = $scope.products;          
            $("#a-request-edit").show();
            $("#a-request-edit").fadeTo(5000, 500).slideUp(500, function(){
               $("#a-request-edit").hide();
            });
            $scope.allitems = !$scope.allitems;
            $scope.editedProduct = null;
            $scope.mainproduct = null;
            $scope.loading = false;         
        });
    }

    $scope.editItem = function (product) {
        console.log($scope.allitems);
        $scope.mainproduct = product;
        $scope.startEdit = true;
        $scope.allitems = !$scope.allitems;
    }

    $scope.completeItem = function(request,type,auto,responds){
        console.log(auto);
        $scope.updatedRequest = request;
        request.date = Date.now();
        request.completed = !request.completed;
        request.auto = [];
        request.responds = [];
        request.$update().then(function(newrequest){
            request.auto = auto;
            request.responds = responds;
            $scope.products[$scope.products.indexOf(request)] = request;
            $rootScope.products = $scope.products; 
            /*$scope.products.splice($scope.products.indexOf(request), 1);
            $scope.products.push(newrequest);*/
            if (newrequest.completed){
                $("#a-request-complete").show();
                $("#a-request-complete").fadeTo(5000, 500).slideUp(500, function(){
                   $("#a-request-complete").hide();
                });                   
            }
            else{
                $("#a-request-restore").show();
                $("#a-request-restore").fadeTo(5000, 500).slideUp(500, function(){
                   $("#a-request-restore").hide();
                });               
            }
     
        });           
    }

    $scope.viewItem = function (product) {
        console.log($scope.allitems);
        $scope.allitems = !$scope.allitems;
        $scope.startEdit = false;
        $scope.mainproduct = product;
        if (product){
            $scope.activeresponds = [];
            $scope.toogleAutoservice = [];
            angular.forEach($scope.responds, function(value, key) {
              if (value.productid == product._id.$oid){
                angular.forEach($scope.partners, function(value1, key1){
                    if (value1._id.$oid == value.autoserviceid){
                        value.autoservice = value1;
                    }
                });
                $scope.activeresponds.push(value);
                $scope.toogleAutoservice.push(false);
              }
            });
           
        }
    }

    $scope.approveItem = function(item,autoservice){
        var partner,keyProgress = true;
        item.approved = !item.approved;
        item.$update().then(function(data){
            angular.forEach($scope.partners, function(value,key){
                if (keyProgress){
                    if (value._id.$oid == item.autoserviceid){
                        partner = value;
                        keyProgress = false;
                    }
                }
            });
            /* Проверить*/
            angular.forEach($scope.activeresponds, function(value, key) {
                if (!value.viewed){
                    value.viewed = true;
                    if ($scope.activeresponds[key] != item){
                        value.approved = false;
                        $scope.activeresponds[key].$update();
                    }
                }
            });
            item.autoservice = autoservice;
            $scope.activeresponds[$scope.activeresponds.indexOf(item)] = item;
            $.ajax({ 
            type: "POST", 
            url: "https://mandrillapp.com/api/1.0/messages/send.json", 
            data: { 
            'key': 'SWwkrbd8NN0rJ54aAyYnZg', 
            'message': { 
            'from_email': 'info@carsbir.ru', 
            'to': [ 
            { 
            'email': partner.email, 
            'name': partner.username, 
            'type': 'to' 
            } 
            ], 
            'subject': 'На вашу заявку откликнулись', 
            'html': $scope.user.username + " подтвердил заявку; Имя = "+item.name+"; Описание = "+item.description+"; Стоимость = " + item.cost, 
            } 
            }});
        });
    }

    $scope.cancelEdit = function () {
        $scope.editedProduct = null;
    }

    $scope.listProducts();
})
.directive('fileFeed', [
        function() {
            return {
                restrict: 'A',
                require: 'ngModel',
				scope: {model:'=',error:'='},
                link: function(scope, element, attributes, controller) {
                    element.bind("change", function(changeEvent) {
                        var files = [];
						scope.model = [];
                        scope.error = null;
                        if (element[0].files.length > 4){
                            scope.error="Toomuch";
                            scope.$apply();
                        }
                        else{
                            for (var i = 0; i < element[0].files.length; i++) {
                                files.push(element[0].files[i]);
                                if (element[0].files[i].size > 1048576){
                                    scope.error="Toomuch1mb";
                                    scope.$apply();
                                }
                                if (element[0].files[i].type.indexOf("image/") !== 0){
                                    scope.error="Type";
                                    scope.$apply();
                                }
                            }
                            if (scope.error == null){
                                fileUploading(0,files[0],files);
                            }
                            /*scope.$apply(function(){
                                controller.$modelValue = files;
                            });*/
                            scope.$apply();
                        }
                        
					
                    });
					var fileUploading = function(number,file,files){
						var error = 0;
						console.log(file);
						if (file != undefined){
							if(!file.type.match('image.*')) {
								$("#drop-box").html("<p> Images only. Select another file</p>");
								error = 1;
							}else if(file.size > 1048576){
								$("#drop-box").html("<p> Too large Payload. Select another file</p>");
								error = 1;
							}else{
								data = new FormData();
								data.append('image', file, file.name);
								if(!error){
									var xhr = new XMLHttpRequest();
									xhr.open('POST', 'upload.php', true);
									xhr.send(data);
									xhr.onload = function () {
										if (xhr.status === 200) {
											console.log(xhr.responseText);
											scope.model.push(xhr.responseText);
											fileUploading(++number,files[number],files);
											$("#drop-box").html("<p> File Uploaded. Select more files</p>");
										} else {
											$("#drop-box").html("<p> Error in upload, try again.</p>");
										}
									};
								}
							}			
						}
						else{
							scope.$apply();
						}
					}
                }
            };
        }
    ])
.controller("autoCtrl", function ($scope, $rootScope, $resource, regUrl, autoUrl, productUrl, Autos, Users, Autoservices, Responds, Requests) {

    $scope.loading = false;
    $scope.RegResource = $resource(regUrl + ":id", { id: "@id" });
    $scope.AutoResource = $resource(autoUrl + ":id", { id: "@id" });
    $scope.ProductsResource = $resource(productUrl + ":id", { id: "@id" });
    $scope.allitems = true;
    $scope.texts = {};
    $scope.autos = null;
    $scope.mainproduct = {};
	$scope.baseurl = "http://localhost/myapp";
    $scope.requests_desc = ['Заявка на ТО','Заявка на Ремонт','Кузовные работы'];

    /*$scope.marks={
            "Opel":{
                "Astra" : ["1.4","1.6","Xsite"],
                "Ingnite" : ["Go","1.5","1.7"],
            },
            "Volvo":{
                "Morka" : ["1.1","1.6","Xsite"],
                "Porka" : ["Go","1.8","1.9"],
            },
        };*/
    $scope.marks = {
    "Audi" : { '100':['1'], '80':['1'], 'A1':['1'], 'A3':['1'], 'A4':['1'], 'A4 allroad':['1'], 'A5':['1'], 'A6':['1'], 'A6 allroad':['1'], 'A7':['1'], 'A8':['1'], 'Q3':['1'], 'Q5':['1'], 'Q7':['1'], 'R8':['1'], 'RS6':['1'], 'S5':['1'], 'S6':['1'], 'S8':['1'], 'TT':['1']},
    "BMW" : { '1er':['1'], '2er':['1'], '3er':['1'], '4er':['1'], '5er':['1'], '6er':['1'], '7er':['1'], '8er':['1'], 'M3':['1'], 'M4':['1'], 'M5':['1'], 'M6':['1'], 'X1':['1'], 'X3':['1'], 'X4':['1'], 'X5':['1'], 'X5 M':['1'], 'X6':['1'], 'X6 M':['1'], 'Z4':['1']},
    "Cadillac" : { 'ATS':['1'], 'BLS':['1'], 'CTS':['1'], 'De Ville':['1'], 'Escalade':['1'], 'Seville':['1'], 'SRX':['1'], 'STS':['1']}, 
    "Chery" : { 'Amulet (A15)':['1'], 'Arrizo 7':['1'], 'Bonus 3 (E3/A19)':['1'], 'Bonus (A13)':['1'], 'Fora (A21)':['1'], 'IndiS (S18D)':['1'], 'Kimo (A1)':['1'], 'M11 (A3)':['1'], 'QQ6 (S21)':['1'], 'Tiggo 5':['1'], 'Tiggo (T11)':['1'], 'Very':['1']}, 
    "Chevrolet" : { 'Aveo':['1'], 'Blazer':['1'], 'Camaro':['1'], 'Captiva':['1'], 'Cobalt':['1'], 'Corvette':['1'], 'Cruze':['1'], 'Epica':['1'], 'Evanda':['1'], 'Express':['1'], 'Lacetti':['1'], 'Lanos':['1'], 'Niva':['1'], 'Orlando':['1'], 'Rezzo':['1'], 'Silverado':['1'], 'Spark':['1'], 'Tahoe':['1'], 'Tracker':['1'], 'TrailBlazer':['1']}, 
    "Chrysler" : { '200':['1'], '300C':['1'], '300C SRT8':['1'], '300M':['1'], 'Cirrus':['1'], 'Concorde':['1'], 'Crossfire':['1'], 'Fifth Avenue':['1'], 'Intrepid':['1'], 'Le Baron':['1'], 'LHS':['1'], 'Neon':['1'], 'NEW Yorker':['1'], 'Pacifica':['1'], 'Prowler':['1'], 'PT Cruiser':['1'], 'Sebring':['1'], 'Stratus':['1'], 'Town & Country':['1'], 'Voyager':['1']}, 
    "Citroen" : { 'Berlingo':['1'], 'C1':['1'], 'C2':['1'], 'C3':['1'], 'C3 Picasso':['1'], 'C4':['1'], 'C4 Aircross':['1'], 'C4 Picasso':['1'], 'C5':['1'], 'C-Crosser':['1'], 'C-Elysee':['1'], 'DS3':['1'], 'DS4':['1'], 'DS5':['1'], 'Jumpy':['1'], 'Saxo':['1'], 'Xantia':['1'], 'Xsara':['1'], 'Xsara Picasso':['1']}, 
    "Daewoo" : { 'Damas':['1'], 'Espero':['1'], 'Evanda':['1'], 'Gentra':['1'], 'Kalos':['1'], 'Lacetti':['1'], 'Lanos (Sens)':['1'], 'Leganza':['1'], 'LE Mans':['1'], 'Magnus':['1'], 'Matiz':['1'], 'Nexia':['1'], 'Nubira':['1'], 'Racer':['1'], 'Rezzo':['1'], 'Tacuma':['1'], 'Tico':['1'], 'Tosca':['1'], 'Winstorm':['1']}, 
    "Dodge" : { 'Avenger':['1'], 'Caliber':['1'], 'Caravan':['1'], 'Challenger':['1'], 'Charger':['1'], 'Dakota':['1'], 'Dart':['1'], 'Daytona':['1'], 'Durango':['1'], 'Dynasty':['1'], 'Intrepid':['1'], 'Journey':['1'], 'Magnum':['1'], 'Neon':['1'], 'Nitro':['1'], 'RAM':['1'], 'Spirit':['1'], 'Stealth':['1'], 'Stratus':['1'], 'Viper':['1']}, 
    "Fiat" : { '500':['1'], 'Albea':['1'], 'Barchetta':['1'], 'Brava':['1'], 'Bravo':['1'], 'Coupe':['1'], 'Croma':['1'], 'Doblo':['1'], 'Freemont':['1'], 'Linea':['1'], 'Marea':['1'], 'Multipla':['1'], 'Palio':['1'], 'Panda':['1'], 'Punto':['1'], 'Scudo':['1'], 'Sedici':['1'], 'Stilo':['1'], 'Tempra':['1']}, 
    "Ford" : { 'C-MAX':['1'], 'EcoSport':['1'], 'Escape':['1'], 'Escort':['1'], 'Expedition':['1'], 'Explorer':['1'], 'F-150':['1'], 'Fiesta':['1'], 'Focus':['1'], 'Focus ST':['1'], 'Fusion':['1'], 'Galaxy':['1'], 'Kuga':['1'], 'Maverick':['1'], 'Mondeo':['1'], 'Mustang':['1'], 'Ranger':['1'], 'S-MAX':['1'], 'Tourneo Connect':['1']}, 
    "GreatWall" : { 'Coolbear':['1'], 'Cowry (V80)':['1'], 'Deer':['1'], 'Florid':['1'], 'Hover':['1'], 'Hover H3':['1'], 'Hover H5':['1'], 'Hover H6':['1'], 'Hover M1 (Peri 4x4)':['1'], 'Hover M2':['1'], 'Hover M4':['1'], 'Pegasus':['1'], 'Peri':['1'], 'Safe':['1'], 'Sailor':['1'], 'Sing RUV':['1'], 'Socool':['1'], 'Voleex C10 (Phenom)':['1'], 'Voleex C30':['1'], 'Wingle':['1']}, 
    "Honda" : { 'Accord':['1'], 'Airwave':['1'], 'Civic':['1'], 'Civic Ferio':['1'], 'Civic Type R':['1'], 'Crosstour':['1'], 'CR-V':['1'], 'Element':['1'], 'Fit':['1'], 'HR-V':['1'], 'Insight':['1'], 'Integra':['1'], 'Jazz':['1'], 'Legend':['1'], 'Odyssey':['1'], 'Pilot':['1'], 'Prelude':['1'], 'Ridgeline':['1'], 'Stepwgn':['1'], 'Stream':['1']}, 
    "Hyundai" : { 'Accent':['1'], 'Coupe':['1'], 'Elantra':['1'], 'Equus':['1'], 'Genesis':['1'], 'Getz':['1'], 'i20':['1'], 'i30':['1'], 'i40':['1'], 'ix35':['1'], 'ix55':['1'], 'Matrix':['1'], 'Santa Fe':['1'], 'Solaris':['1'], 'Sonata':['1'], 'Starex (H-1)':['1'], 'Terracan':['1'], 'Tucson':['1'], 'Veloster':['1']}, 
    "Infiniti" : { 'EX':['1'], 'FX':['1'], 'G':['1'], 'M':['1'], 'Q30':['1'], 'Q40':['1'], 'Q50':['1'], 'Q70':['1'], 'QX':['1'], 'QX50':['1'], 'QX60':['1'], 'QX70':['1'], 'QX80':['1']}, 
    "Jaguar" : { 'F-Pace':['1'], 'F-Type':['1'], 'S-Type':['1'], 'XF':['1'], 'XFR':['1'], 'XJ':['1'], 'XJS':['1'], 'XK':['1'], 'XKR':['1'], 'X-Type':['1']}, 
    "Jeep" : { 'Cherokee':['1'], 'Compass':['1'], 'Grand Cherokee':['1'], 'Grand Cherokee SRT8':['1'], 'Wrangler':['1']}, 
    "Kia" : { 'Carens':['1'], 'Carnival':['1'], 'Ceed':['1'], 'Cerato':['1'], 'Clarus':['1'], 'Magentis':['1'], 'Mohave (Borrego)':['1'], 'Opirus':['1'], 'Optima':['1'], 'Picanto':['1'], 'Quoris':['1'], 'Rio':['1'], 'Sephia':['1'], 'Shuma':['1'], 'Sorento':['1'], 'Soul':['1'], 'Spectra':['1'], 'Sportage':['1'], 'Venga':['1']}, 
    "LandRover" : { 'Defender':['1'], 'Discovery':['1'], 'Discovery Sport':['1'], 'Freelander':['1'], 'Range Rover':['1'], 'Range Rover Evoque':['1'], 'Range Rover Sport':['1']}, 
    "Lexus" : { 'CT':['1'], 'ES':['1'], 'GS':['1'], 'GX':['1'], 'HS':['1'], 'IS':['1'], 'IS F':['1'], 'LFA':['1'], 'LS':['1'], 'LX':['1'], 'NX':['1'], 'RC':['1'], 'RC F':['1'], 'RX':['1'], 'SC':['1']}, 
    "Lifan" : { 'Breez (520)':['1'], 'Cebrium (720)':['1'], 'Celliya (530)':['1'], 'Smily':['1'], 'Solano':['1'], 'X50':['1'], 'X60':['1']}, 
    "Mazda" : { '2':['1'], '3':['1'], '323':['1'], '3 MPS':['1'], '5':['1'], '6':['1'], '626':['1'], '6 MPS':['1'], 'B-series':['1'], 'BT-50':['1'], 'CX-5':['1'], 'CX-7':['1'], 'CX-9':['1'], 'Demio':['1'], 'MPV':['1'], 'MX-5':['1'], 'Protege':['1'], 'RX-8':['1'], 'Tribute':['1'], 'Xedos 6':['1']}, 
    "Mercedes-Benz" : { 'A-klasse':['1'], 'B-klasse':['1'], 'C-klasse':['1'], 'CLA-klasse':['1'], 'CLS-klasse':['1'], 'E-klasse':['1'], 'G-klasse':['1'], 'GLA-klasse':['1'], 'GLE':['1'], 'GLK-klasse':['1'], 'GL-klasse':['1'], 'M-klasse':['1'], 'R-klasse':['1'], 'S-klasse':['1'], 'S-klasse AMG':['1'], 'SLK-klasse':['1'], 'Viano':['1'], 'Vito':['1']}, 
    "MINI" : { 'Cabrio':['1'], 'Clubman':['1'], 'Clubvan':['1'], 'Countryman':['1'], 'Coupe':['1'], 'Hatch':['1'], 'Paceman':['1'], 'Roadster':['1']}, 
    "Mitsubishi" : { 'Airtrek':['1'], 'ASX':['1'], 'Carisma':['1'], 'Colt':['1'], 'Eclipse':['1'], 'Galant':['1'], 'Grandis':['1'], 'L200':['1'], 'Lancer':['1'], 'Lancer Evolution':['1'], 'Mirage':['1'], 'Montero':['1'], 'Montero Sport':['1'], 'Outlander':['1'], 'Pajero':['1'], 'Pajero Pinin':['1'], 'Pajero Sport':['1'], 'RVR':['1'], 'Space Star':['1'], 'Space Wagon':['1']}, 
    "Nissan" : { 'Almera':['1'], 'Almera Classic':['1'], 'Juke':['1'], 'Maxima':['1'], 'Micra':['1'], 'Murano':['1'], 'Navara (Frontier)':['1'], 'Note':['1'], 'Pathfinder':['1'], 'Patrol':['1'], 'Primera':['1'], 'Qashqai':['1'], 'Qashqai+2':['1'], 'Sentra':['1'], 'Serena':['1'], 'Skyline':['1'], 'Teana':['1'], 'Terrano':['1'], 'Tiida':['1'], 'X-Trail':['1']}, 
    "Opel" : { 'Agila':['1'], 'Antara':['1'], 'Astra':['1'], 'Astra OPC':['1'], 'Calibra':['1'], 'Combo':['1'], 'Corsa':['1'], 'Frontera':['1'], 'Insignia':['1'], 'Insignia OPC':['1'], 'Kadett':['1'], 'Meriva':['1'], 'Mokka':['1'], 'Monterey':['1'], 'Omega':['1'], 'Tigra':['1'], 'Vectra':['1'], 'Vita':['1'], 'Vivaro':['1'], 'Zafira':['1']}, 
    "Peugeot" : { '107':['1'], '2008':['1'], '206':['1'], '207':['1'], '208':['1'], '3008':['1'], '301':['1'], '307':['1'], '308':['1'], '4007':['1'], '4008':['1'], '406':['1'], '407':['1'], '408':['1'], '508':['1'], '607':['1'], 'Expert':['1'], 'Partner':['1']}, 
    "Porsche" : { '911':['1'], 'Panamera':['1'], 'Boxster':['1'], 'Cayenne':['1'], 'Cayman':['1'], 'Macan':['1']}, 
    "Renault" : { '19':['1'], 'Clio':['1'], 'Clio RS':['1'], 'Duster':['1'], 'Espace':['1'], 'Fluence':['1'], 'Kangoo':['1'], 'Koleos':['1'], 'Laguna':['1'], 'Latitude':['1'], 'Logan':['1'], 'Megane':['1'], 'Megane RS':['1'], 'Safrane':['1'], 'Sandero':['1'], 'Scenic':['1'], 'Symbol':['1'], 'Trafic':['1'], 'Twingo':['1']}, 
    "Saab" : { '900':['1'], '9000':['1'], '9-2X':['1'], '9-3':['1'], '9-5':['1'], '96':['1'], '9-7X':['1'], '99':['1']}, 
    "SEAT" : { 'Alhambra':['1'], 'Toledo':['1'], 'Altea':['1'], 'Cordoba':['1'], 'Ibiza':['1'], 'Leon':['1']}, 
    "Skoda" : { 'Fabia':['1'], 'Felicia':['1'], 'Octavia':['1'], 'Octavia RS':['1'], 'Rapid':['1'], 'Roomster':['1'], 'Superb':['1'], 'Yeti':['1']}, 
    "SsangYong" : { 'Actyon':['1'], 'Actyon Sports':['1'], 'Chairman':['1'], 'Korando':['1'], 'Korando Family':['1'], 'Kyron':['1'], 'Musso':['1'], 'Rexton':['1'], 'Stavic':['1']}, 
    "Subaru" : { 'BRZ':['1'], 'Dex':['1'], 'Exiga':['1'], 'Forester':['1'], 'Impreza':['1'], 'Impreza WRX':['1'], 'Impreza WRX STi':['1'], 'Justy':['1'], 'Legacy':['1'], 'Levorg':['1'], 'Outback':['1'], 'R2':['1'], 'Stella':['1'], 'SVX':['1'], 'Trezia':['1'], 'Tribeca':['1'], 'Vivio':['1'], 'WRX':['1'], 'WRX STi':['1'], 'XV':['1']}, 
    "Suzuki" : { 'Aerio':['1'], 'Alto':['1'], 'Baleno':['1'], 'Escudo':['1'], 'Every':['1'], 'Grand Vitara':['1'], 'Ignis':['1'], 'Jimny':['1'], 'Kei':['1'], 'Kizashi':['1'], 'Liana':['1'], 'Palette':['1'], 'Samurai':['1'], 'Solio':['1'], 'Splash':['1'], 'Swift':['1'], 'SX4':['1'], 'Verona':['1'], 'Vitara':['1'], 'Wagon R':['1']}, 
    "Toyota" : { '4Runner':['1'], 'Auris':['1'], 'Avensis':['1'], 'Camry':['1'], 'Carina':['1'], 'Celica':['1'], 'Corolla':['1'], 'Crown':['1'], 'Highlander':['1'], 'Hilux':['1'], 'Land Cruiser':['1'], 'Land Cruiser Prado':['1'], 'Mark II':['1'], 'Prius':['1'], 'RAV 4':['1'], 'Sienna':['1'], 'Tundra':['1'], 'Venza':['1'], 'Verso':['1'], 'Yaris':['1']}, 
    "Volkswagen" : { 'Amarok':['1'], 'Beetle':['1'], 'Bora':['1'], 'Caddy':['1'], 'Caravelle':['1'], 'Golf':['1'], 'Golf GTI':['1'], 'Golf Plus':['1'], 'Jetta':['1'], 'Multivan':['1'], 'Passat':['1'], 'Passat CC':['1'], 'Phaeton':['1'], 'Polo':['1'], 'Scirocco':['1'], 'Sharan':['1'], 'Tiguan':['1'], 'Touareg':['1'], 'Touran':['1'], 'Transporter':['1']}, 
    "Volvo" : { '240 Series':['1'], '460':['1'], '740':['1'], '850':['1'], '940':['1'], '960':['1'], 'C30':['1'], 'C70':['1'], 'S40':['1'], 'S60':['1'], 'S70':['1'], 'S80':['1'], 'V40':['1'], 'V40 Cross Country':['1'], 'V50':['1'], 'V60':['1'], 'V70':['1'], 'XC60':['1'], 'XC70':['1'], 'XC90':['1']}, 
    "VAZ" : { '2101':['1'], '2104':['1'], '2105':['1'], '2106':['1'], '2107':['1'], '2108':['1'], '2109':['1'], '21099':['1'], '2110':['1'], '2111':['1'], '2112':['1'], '2113':['1'], '2114':['1'], '2115':['1'], '2121 (4x4)':['1'], '2131 (4x4)':['1'], 'Granta':['1'], 'Kalina':['1'], 'Largus':['1'], 'Priora':['1']}, 
    "GAZ" : { '21 «Волга»':['1'], '24 «Волга»':['1'], '31029 «Волга»':['1'], '3102 «Волга»':['1'], '31105 «Волга»':['1'], '3110 «Волга»':['1'], '69':['1']}, 
    "ZAZ" : { '1102 «Таврия»':['1'], '1103 «Славута»':['1'], '1105 «Дана»':['1'], '965':['1'], '966':['1'], '968':['1'], 'Chance':['1'], 'Forza':['1'], 'Sens':['1'], 'Vida':['1']}, 
    "TAGAZ" : { 'Aquila':['1'], 'C10':['1'], 'C190':['1'], 'C-30':['1'], 'Road Partner':['1'], 'Tager':['1'], 'Vega':['1']}, 
    "UAZ" : { '3151':['1'], '3153':['1'], '3159':['1'], '3160':['1'], '3162 Simbir':['1'], '469':['1'], 'Hunter':['1'], 'Patriot':['1'], 'Pickup':['1']},
};
    $scope.texts.work = ['Контрольный осмотр',
        'Замена масла в двигателе (в каждом ТО)',
        'Замена масляного фильтра (в каждом ТО)',
        'Защита двигателя',
        'Замена салонного фильтра',
        'Замена передних тормозных колодок',
        'Замена задних тормозных колодок',
        'Замена передних тормозных дисков',
        'Замена задних тормозных дисков',
        'Замена свечей зажигания',
        'Замена тормозной жидкости', 
        'Замена топливного фильтра', 
        'Замена воздушного фильтра', 
        'Замена масла в коробке передач', 
        'Замена ремня ГРМ',
        'Помпа (замена)',
        'Охлаждающая жидкость (замена)'];
    $scope.texts.question = ['Масло в двигателе (замена)',
        'Масляный фильтр (замена)',
        'Масло в коробке передач (замена)', 
        'Сход-развал',
        'Свечи зажигания (замена)', 
        'Тормозные колодки (замена)', 
        'Тормозные диски (замена)', 
        'Тормозные барабаны (замена)', 
        'Топливный фильтр (замена)', 
        'Салонный фильтр (замена)', 
        'Заправка кондиционера', 
        'Тормозная жидкость (замена)', 
        'Охлаждающая жидкость (замена)', 
        'Жидкость гидроусилителя (ГУР) (замена)'];
    $scope.texts.diagnos = ['Контрольный осмотр',
        'Диагностика двигателя',
        'Диагностика коробки передач',
        'Диагностика подвески',
        'Диагностика электрики'];
    $scope.texts.engine = ['Замена масла',
        'Генератор',
        'Инжектор',
        'Кондиционер',
        'Маслосъемные колпачки (замена)',
        'Насос масляный',
        'Насос топливный', 
        'Помпа (замена)',
        'Радиатор',
        'Ремень ГРМ (замена)', 
        'Цепь ГРМ',
        'Свечи зажигания (замена)', 
        'Термостат (замена)',
        'Турбина',
        'Фильтр воздушный (замена)', 
        'Фильтр масляный (замена)',
        'Фильтр салона (замена)', 
        'Фильтр топливный (замена)', 
        'Форсунки'];
    $scope.texts.head = ['Амортизатор (замена)',
        'Втулка стабилизатора (замена)', 
        'Подшипник ступицы (замена)',
        'Пружина(замена)',
        'Рычаг передний(замена)', 
        'Рычаг задний (замена)', 
        'Сайлентблок переднего рычага (замена)', 
        'Сайлентблок заднего рычага (замена)', 
        'Стойка стабилизатора (замена)', 
        'Ступица (замена)', 
        'Тормозные колодки (замена)', 
        'Тормозные диски (замена)', 
        'Тормозные барабаны (замена)', 
        'Тормозная жидкость (замена)', 
        'Датчик ABS (замена)', 
        'Датчик ESP (замена)', 
        'Шаровые (замена)'];
    $scope.texts.wheel = ['Рулевая рейка',
        'Рулевая тяга (замена)', 
        'Наконечник рулевой тяги (замена)',
        'Жидкость гидроусилителя (замена)',
        'Насос гидроусилителя (замена)', 
        'Сцепление',
        'Шрус (замена)', 
        'Замена масла в коробке передач'];
    $scope.texts.addi = ['Тонировка',
        'Сигнализация (название в комментарии)',
        'Парктроник (описать в комментарии)', 
        'Химчистка салона',
        'Полировка', 
        'Противоугонный комплекс (описать в комментарии)',
        'Иммобилайзер (описать в комментарии)',
        'Защита картера (установка)', 
        'Отопитель двигателя (описать в комментарии)',
        'Шумоизоляция (описать в комментарии)'];
        $scope.texts.destructions = [{ title: 'Бампер', eng: 'bamper',
        data: ['Задний', 
        'Передний']},
        { title: 'Дверь', eng: 'dver',
        data: ['Задняя левая', 
        'Задняя правая', 
        'Передняя левая', 
        'Передняя правая']},
        { title: 'Зеркало боковое', eng: 'zerkalo',
        data: ['Левое', 
        'Правое']},
        { title: 'Крыло', eng: 'krilo',
        data: ['Переднее правое', 
        'Переднее левое' ,
        'Заднее правое' ,
        'Заднее левое']},
        { title:'Порог', eng: 'porog',
        data: ['Правый' ,
        'Левый']},
        { title:'Стекло', eng: 'steklo',
        data: ['Лобовое без датчика дождя(замена)' ,
        'Лобовое с датчиком дождя(замена)' ,
        'Лобовое ремонт скола' ,
        'Лобовое ремонт трещины' ,
        'Передней правой двери' ,
        'Передней левой двери' ,
        'Задней правой двери' ,
        'Задней левой двери' ,
        'Заднее']},
        { title:'Фара', eng: 'fara',
        data: ['Передняя правая' ,
        'Передняя левая']},
        { title:'Противотуманка', eng: 'tuman',
        data: ['Передняя правая',
        'Передняя левая' ,
        'Задняя']},
        { title:'Задний фонарь', eng: 'fonar',
        data: ['Правый' ,
        'Левый']}];
    $scope.activeresponds = [];
    function getCookie(name) {
      var matches = document.cookie.match(new RegExp(
        "(?:^|; )" + name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, '\\$1') + "=([^;]*)"
      ));
      return matches ? decodeURIComponent(matches[1]) : undefined;
    }
    /*$scope.AddOther = function(){
        $scope.marks.push("Other");
    }
    $scope.AddOther();*/

    function requesttonull(){
        $scope.mainproduct = {};
        $scope.mainproduct.details = {};
        $scope.mainproduct.details.question = [];
        $scope.mainproduct.details.engine = [];
        $scope.mainproduct.details.head = [];
        $scope.mainproduct.details.wheel = [];
        $scope.mainproduct.details.addi = [];
        $scope.mainproduct.details.diagnos = [];
        $scope.mainproduct.details.work = [];
        $scope.mainproduct.details.destructions = [[],[],[],[],[],[],[],[],[]];
        $scope.mainproduct.details.image = {};
        $scope.modelinput = false;
        $scope.markinput = false;
        $scope.generationinput = false;   
    }

    requesttonull();

    $scope.logout = function(){
        $rootScope.userid = undefined;
        document.cookie = "userid=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;";
        $rootScope.products = null;
        $scope.listProducts();
    }

    $scope.predicate='';
    $scope.reverse = true;
    $scope.order = function(predicate){
        $scope.reverse = ($scope.predicate === predicate) ? !$scope.reverse : false;
        $scope.predicate = predicate;
    }

    $scope.Search = function(number,object){
        console.log(object);
        if (number == 1){
            console.log(object);
            if (object == 'dif'){
                $scope.markinput = true;
                $scope.mainproduct.ismark = true;
                $scope.modelinput = true;
                $scope.mainproduct.ismodel = true;
                $scope.generationinput = true;
                $scope.mainproduct.isgeneration = true;
                $scope.mainproduct.mark = '';
            }
        }
        if (number == 2){
            console.log(object);
            if (object == 'dif'){
                console.log("model = null");
                $scope.modelinput = true;
                $scope.mainproduct.ismodel = true;
                $scope.generationinput = true;
                $scope.mainproduct.isgeneration = true;
                $scope.mainproduct.model = '';
            }
        }
        if (number == 3){
            console.log(object);
            if (object == 'Другая'){
                $scope.generationinput = true;
                $scope.mainproduct.isgeneration = true;
                $scope.mainproduct.generation = '';
            }
        }
    }
    $scope.BacktoSelect = function(number,object){
        if (number == 1){
            console.log(object);
            if (object == ''){
                $scope.markinput = false;
                $scope.mainproduct.ismark = false;
                $scope.modelinput = false;
                $scope.mainproduct.ismodel = false;
                $scope.generationinput = false;
                $scope.mainproduct.isgeneration = false;
            }
        }
        if (number == 2){
            if (object == ''){
                $scope.modelinput = false;
                $scope.mainproduct.ismodel = false;
                $scope.generationinput = false;
                $scope.mainproduct.isgeneration = false;
            }
        }
        if (number == 3){
            if (object == ''){
                $scope.generationinput = false;
                $scope.mainproduct.isgeneration = false;
            }
        }
    }
    $scope.listProducts = function () {
        $scope.loading = true;
        $scope.allitems = 1;
        if ($rootScope.userid == undefined){
            $rootScope.userid = getCookie('userid');
        }
        if ($rootScope.autos != null){
            $scope.autos = $rootScope.autos;
            console.log($scope.autos);
            console.log("from cache");
            $scope.loading = false;
        }
        else{
            Autos.query({userid: $rootScope.userid}).then(function(autos){
                $scope.autos = autos;
                $rootScope.autos = autos;
                console.log($scope.autos);
                $scope.loading = false;
            });        
        }

        /*$scope.autos = $scope.AutoResource.query({userid: $rootScope.userid});*/
    }
    $scope.base = -1;
    $scope.nice = function(){
        $scope.base = $scope.base + 1;
        console.log($scope.base);
        return $scope.base;
    }

    $scope.addItem = function (auto) {
        $scope.loading = true;
        auto.userid=$rootScope.userid;
        if (!$scope.markinput){
            auto.mark = document.getElementById("mark").value;
        }
        else{
            auto.ismark = true;
        }
        if (!$scope.modelinput){
            auto.model = document.getElementById("model").value;
        }
        else{
            auto.ismodel = true;
        }
        if (!$scope.generationinput){
            auto.generation = document.getElementById("generation").value;
        }
        else{
            auto.isgeneration = true;
        }
        console.log(auto);
        newauto = new Autos(auto);
        console.log(newauto);
        newauto.$saveOrUpdate().then(function (newAuto) {
            $scope.autos.push(newAuto);
            $rootScope.autos = $scope.autos;
            requesttonull();
            $scope.allitems = 1;
            $("#alert").show();
            $("#alert").fadeTo(5000, 500).slideUp(500, function(){
               $("#alert").hide();
            });
            $scope.loading = false;
        });
        /*
        new $scope.AutoResource(auto).$save().then(function (newAuto) {
            $scope.autos.push(newAuto);
            requesttonull();
            $scope.allitems = 1;
            $("#alert").show();
            $("#alert").fadeTo(5000, 500).slideUp(500, function(){
               $("#alert").hide();
            });
        });  */     
    }

    $scope.addRequest = function (request) {
        $scope.loading = true;
        var auto = request.autoid;
        request.userid=$rootScope.userid;
        request.type = $scope.requests_desc[$scope.allitems - 1];
        request.autoid = request.autoid._id.$oid;
        request.date = Date.now();
        request.completed = false;
        if ($scope.user.number === undefined){
            $scope.user.number = 0;
        }
        else{
            $scope.user.number += 1;
        }
        request.name = parseInt($scope.user.phone.substring(4),10).toString(32) + "-" + (1000000 + $scope.user.number);
        console.log(request.name);
        var newrequest2 = new Requests(request);
        newrequest2.$save().then(function (newrequest) {
            console.log(newrequest);
            newrequest.responds = [];
            newrequest.auto = auto;
            requesttonull();
            $rootScope.products.push(newrequest);
            $scope.allitems = 1;
            $scope.setScreen(0);
            $("#a-request-new").show();
            $("#a-request-new").fadeTo(5000, 500).slideUp(500, function(){
               $("#a-request-new").hide();
            });
            $scope.loading = false;
        });
        $scope.user.$update().then(function(user){
            $rootScope.user = $scope.user;
            console.log($scope.user);
            console.log(user);
        });         
    }


    
    $scope.updateProduct = function (auto) {
        $scope.loading = true;
        $scope.updatedAuto = $scope.mainproduct;
        if (!$scope.markinput){
            auto.mark = document.getElementById("mark").value;
        }
        else{
            auto.ismark = true;
        }
        if (!$scope.modelinput){
            auto.model = document.getElementById("model").value;
        }
        else{
            auto.ismodel = true;
        }
        if (!$scope.generationinput){
            auto.generation = document.getElementById("generation").value;
        }
        else{
            auto.isgeneration = true;
        } 
        if (auto.newpicture != null){
            auto.picture = auto.newpicture;
            auto.newpicture = null;
        }
        auto.$update().then(function(){
            $scope.allitems = 1;
            $rootScope.autos = $scope.autos;
            $("#a-auto-edit").show();
            $("#a-auto-edit").fadeTo(5000, 500).slideUp(500, function(){
               $("#a-auto-edit").hide();
            });
            $scope.editedProduct = null;
            $scope.mainproduct = null;
            $scope.startEdit = false; 
            $scope.loading = false;  
        });
        /*auto.$save().then(function(){
            $scope.allitems = 1;
            $("#a-auto-edit").show();
            $("#a-auto-edit").fadeTo(5000, 500).slideUp(500, function(){
               $("#a-auto-edit").hide();
            });        
        });*/

    }


    $scope.isdeleteAuto = function(auto){
        console.log("fdf");
            swal({
              title: "Вы уверены?",
              text: "У вас не получится его восстановить!",
              type: "warning",
              showCancelButton: true,
              confirmButtonColor: "#DD6B55",
              confirmButtonText: "Да, удалить!",
              cancelButtonText: "Нет, я передумал!",
              closeOnConfirm: false,
              closeOnCancel: false
            },
            function(isConfirm){
              if (isConfirm) {
                $scope.deleteAuto(auto);
              } else {
                    swal("Ура", "Всё в порядке", "error");
              }
            });
    }
    $scope.deleteAuto = function (auto) {
        $scope.updatedAuto = auto;
        /*auto.$delete().then(function () {
            $scope.autos.splice($scope.autos.indexOf(auto), 1);
            $("#a-auto-delete").show();
            $("#a-auto-delete").fadeTo(5000, 500).slideUp(500, function(){
               $("#a-auto-delete").hide();
            }); 
        });*/
        auto.$remove().then(function () {
            $scope.autos.splice($scope.autos.indexOf(auto), 1);
            $rootScope.autos = $scope.autos;
            swal("Удален!", "Ваша запись удалена", "success");
            $("#a-auto-delete").show();
            $("#a-auto-delete").fadeTo(5000, 500).slideUp(500, function(){
               $("#a-auto-delete").hide();
            }); 
        });
    }

    $scope.editItem = function (auto,number) {
        console.log(auto.model);
        $scope.mainproduct = auto;
        if (!$scope.mainproduct.ismodel && ($scope.mainproduct.mark != '') && ($scope.mainproduct.model != '')){
            $scope.mainproduct.model = $scope.marks[$scope.mainproduct.mark][$scope.mainproduct.model];
        }
        if (!$scope.mainproduct.ismark && ($scope.mainproduct.model != '')){
            $scope.mainproduct.mark = $scope.marks[$scope.mainproduct.mark];
        }
        $scope.markinput = $scope.mainproduct.ismark;
        $scope.modelinput = $scope.mainproduct.ismodel;
        $scope.generationinput = $scope.mainproduct.isgeneration;
        $scope.startEdit = true;
        $scope.allitems = number;
    }
	
	$scope.fileUpload = function(element, $scope){ 
		console.log("dfdf"+element.files);
		$scope.$apply(function(){
			files = element.files;
			var data = new FormData();
			var error = 0;
			if (files.length > 0){
				fileUploading(0,files[0],files);
			}			
		});
	}
	
	function fileUploading(number,file,files){
		var error = 0;
		console.log(file);
		if (file != undefined){
			if(!file.type.match('image.*')) {
		   		$("#drop-box").html("<p> Images only. Select another file</p>");
		   		error = 1;
		  	}else if(file.size > 1048576){
		  		$("#drop-box").html("<p> Too large Payload. Select another file</p>");
		   		error = 1;
		  	}else{
				data = new FormData();
		  		data.append('image', file, file.name);
				if(!error){
					var xhr = new XMLHttpRequest();
					xhr.open('POST', 'upload.php', true);
					xhr.send(data);
					xhr.onload = function () {
						if (xhr.status === 200) {
							console.log(xhr.responseText);
							fileUploading(++number,files[number],files);
							$("#drop-box").html("<p> File Uploaded. Select more files</p>");
						} else {
							$("#drop-box").html("<p> Error in upload, try again.</p>");
						}
					};
				}
		  	}			
		}
	}


    $scope.viewItem = function (auto,number) {
        $scope.allitems = number;
        $scope.mainproduct = auto;
        if (auto == null){
            $scope.mainproduct = {
                mark : '',
                model : '',
                name : '',
                generation : '',
                year : '',
                engine : '',
                box : '',
                body : '',
                volume : '',
                color : '',
                drive : '',
                mileage : '',
                vin : '',
            };
        }
        $scope.markinput = $scope.mainproduct.ismark;
        $scope.modelinput = $scope.mainproduct.ismodel;
        $scope.generationinput = $scope.mainproduct.isgeneration;
        if (number == 1){
            if (document.getElementById("mark")){
                auto.mark = document.getElementById("mark").value;
                auto.model = document.getElementById("model").value;              
            }    
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
});
angular.module("sportsStoreAdmin").directive('showtab',
    function () {
        return {
            link: function (scope, element, attrs) {
                element.click(function(e) {
                    e.preventDefault();
                    $(element).tab('show');
                });
            }
        };
    });
/*.controller('MyCtrl', ['$scope', 'Upload', '$timeout', function ($scope, Upload, $resource, $timeout) {
    $scope.uploadFiles = function(file, errFiles) {
        $scope.AutoResource = $resource("http://localhost:5500/auto/" + ":id", { id: "@id" });
        $scope.f = file;
        $scope.errFile = errFiles && errFiles[0];
        if (file) {
            file.upload = Upload.upload({
                url: 'http://localhost:5500/auto/',
                data: {uniqueFilename: file}
            });

            file.upload.then(function (response) {
                $timeout(function () {
                    file.result = response.data;
                });
            }, function (response) {
                if (response.status > 0)
                    $scope.errorMsg = response.status + ': ' + response.data;
            }, function (evt) {
                file.progress = Math.min(100, parseInt(100.0 * 
                                         evt.loaded / evt.total));
            });
        }   
    }

*/

$(function(){

	$("#drop-box").click(function(){
		$("#upl").click();
	});

	// To prevent Browsers from opening the file when its dragged and dropped on to the page
	$(document).on('drop dragover', function (e) {
        e.preventDefault();
    }); 

	// Add events
	$('input[type=file]').on('change', fileUpload);

	// File uploader function

	function fileUpload(event){  
		$("#drop-box").html("<p>"+event.target.value+" uploading...</p>");
		files = event.target.files;
		var data = new FormData();
		var error = 0;
		if (files.length > 0){
			fileUploading(0,files[0],files);
		}
	}
	
	function fileUploading(number,file,files){
		var error = 0;
		console.log(file);
		if (file != undefined){
			if(!file.type.match('image.*')) {
		   		$("#drop-box").html("<p> Images only. Select another file</p>");
		   		error = 1;
		  	}else if(file.size > 1048576){
		  		$("#drop-box").html("<p> Too large Payload. Select another file</p>");
		   		error = 1;
		  	}else{
				data = new FormData();
		  		data.append('image', file, file.name);
				if(!error){
					var xhr = new XMLHttpRequest();
					xhr.open('POST', 'upload.php', true);
					xhr.send(data);
					xhr.onload = function () {
						if (xhr.status === 200) {
							console.log(xhr.responseText);
							fileUploading(++number,files[number],files);
							$("#drop-box").html("<p> File Uploaded. Select more files</p>");
						} else {
							$("#drop-box").html("<p> Error in upload, try again.</p>");
						}
					};
				}
		  	}			
		}
	}

});
