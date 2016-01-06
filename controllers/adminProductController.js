angular.module("sportsStoreAdmin")

.controller("productCtrl", function ($scope, $rootScope, $resource, $location, productUrl, Data, userRegUrl, respondUrl, serviceUrl, autoUrl, Autos, Users, Autoservices, Responds, Requests, Functions) {
    $scope.productsResource = $resource(productUrl + ":id", { id: "@id" });
    $scope.RegResource = $resource(userRegUrl + ":id", { id: "@id" });
    $scope.RespondResource = $resource(respondUrl + ":id", { id: "@id" });
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
    $scope.formdetails = null;
	$scope.formdetails2 = null;
    $scope.showtable = false;
    $scope.toogleAutoservice = [];
    $scope.baseurl = $location.absUrl().substring(0,$location.absUrl().indexOf('/a'));
    $scope.requests = ['Заявка на ТО','Заявка на Ремонт','Кузовные работы'];
    $scope.texts = Data.getWorkTypes();

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
            $rootScope.userid = Functions.getCookie('userid');
        }
        if ($rootScope.userid == undefined){
            $location.path("/login");
        }
        else{
        if ($rootScope.products != null){
            $scope.products = $rootScope.products;
            $scope.autos = $rootScope.autos;
            $scope.responds = $rootScope.responds;
            $scope.user = $rootScope.user;
            $scope.partners = $rootScope.partners;
            $scope.loading = false;
        }
        else{
        Requests.query({userid: $rootScope.userid}).then(function(data){
            $scope.products = data;
            if (data.length == 0){
                $scope.setScreen(2);
            }
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

    $scope.editUser = function(user, passchange, password){
        $scope.loading = true;
        if (passchange){
            $scope.user.password = window.md5(password);
        }
        $scope.user.$saveOrUpdate().then(function(editeduser){
            $rootScope.user = $scope.user;
            if (user.name == undefined){
                user.name = '';
            }
            if (user.surname == undefined){
                user.surname = '';
            }
            if (user.phone == undefined){
                user.phone = '';
            }
            if (passchange){
                Functions.sendMail({
                    email: user.email,
                    username: user.username,
                    subject: user.username + ': данные пользователя изменены',
                    html: "Добро пожаловать в Carsbir. Ваш логин: " + user.username + " Ваш пароль: " + password,
                });
                Functions.alertAnimate($("#a-user-edit-profile"));            
            }
            else{
                Functions.sendMail({
                    email: user.email,
                    username: user.username,
                    subject: user.username + ': данные пользователя изменены',
                    html: "Имя = " + user.name + "; Фамилия = " + user.surname + "; Телефон = "+user.phone,
                    });
                Functions.alertAnimate($("#a-user-edit-profile"));         
            }
            $scope.loading = false;
        });
    }

    $scope.deleteProduct = function (product) {
        product.$remove().then(function () {
            $scope.products.splice($scope.products.indexOf(product), 1);
            $rootScope.products = $scope.products;
            swal("Удален!", "Ваша заявка удалена", "success");
            Functions.alertAnimate($("#a-request-delete"));  
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
        product.auto = [];
        product.responds = [];
        product.$update().then(function(newProduct){ 
            newProduct.auto = auto;
            newProduct.responds = responds;
            $scope.products.push(newProduct);
            $scope.products.splice($scope.products.indexOf(product), 1);
            $rootScope.products = $scope.products;
            Functions.alertAnimate($("#a-request-edit"));
            $scope.allitems = !$scope.allitems;
            $scope.editedProduct = null;
            $scope.mainproduct = null;
            $scope.loading = false;         
        });
    }

    $scope.editItem = function (product) {
        $scope.mainproduct = product;
        $scope.startEdit = true;
        $scope.allitems = !$scope.allitems;
    }

    $scope.checknegative = function(array,name) {
        var checking = false;
        angular.forEach(array, function(value){
            if ((value == true)){
                checking = true;
                $scope.showtable = true;
                $scope.formdetails = name;
            }
        });
        return checking;
    }
	
    $scope.checknegative2 = function(array,name) {
        var checking = false;
        angular.forEach(array, function(value){
            if ((value == true)){
                checking = true;
                $scope.showtable = true;
                $scope.formdetails2 = name;
            }
        });
        return checking;
    }

    $scope.completeItem = function(request,type,auto,responds){
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
            if (newrequest.completed){
                Functions.alertAnimate($("#a-request-complete"));                  
            }
            else{
                Functions.alertAnimate($("#a-request-restore"));              
            }
     
        });           
    }
    $scope.showtableit = function(){
        return $scope.showtable;
    }

    $scope.viewItem = function (product) {
        $scope.allitems = !$scope.allitems;
        $scope.startEdit = false;
        $scope.mainproduct = product;
        $scope.showtable = false;
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
            Functions.sendMail({
                email: partner.email,
                username: partner.username,
                subject: 'На вашу заявку откликнулись',
                html: $scope.user.username + " подтвердил заявку; Имя = "+item.name+"; Описание = "+item.description+"; Стоимость = " + item.cost, 
            });
        });
    }

    $scope.cancelEdit = function () {
        $scope.editedProduct = null;
    }

    $scope.listProducts();
})
.controller("autoCtrl", function ($scope, $rootScope, $location, $resource, userRegUrl, Data, autoUrl, Functions, productUrl, Autos, Users, Autoservices, Responds, Requests) {

    $scope.loading = false;
    $scope.RegResource = $resource(userRegUrl + ":id", { id: "@id" });
    $scope.AutoResource = $resource(autoUrl + ":id", { id: "@id" });
    $scope.ProductsResource = $resource(productUrl + ":id", { id: "@id" });
    $scope.allitems = true;
    $scope.texts = {};
    $scope.autos = null;
    $scope.mainproduct = {};
	$scope.baseurl = $location.absUrl().substring(0,$location.absUrl().indexOf('/a'));
    $scope.requests_desc = ['Заявка на ТО','Заявка на Ремонт','Кузовные работы'];
    $scope.marks = Data.getMarks();
    $scope.texts = Data.getWorkTypes();
    $scope.array_auto = Data.getAuto();

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
        if (number == 1){
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
            if (object == 'dif'){
                $scope.modelinput = true;
                $scope.mainproduct.ismodel = true;
                $scope.generationinput = true;
                $scope.mainproduct.isgeneration = true;
                $scope.mainproduct.model = '';
            }
        }
    }
    $scope.BacktoSelect = function(number,object){
        if (number == 1){
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
    }
    $scope.listProducts = function () {
        $scope.loading = true;
        $scope.allitems = 1;
        if ($rootScope.userid == undefined){
            $rootScope.userid = Functions.getCookie('userid');
        }
        if ($rootScope.autos != null){
            $scope.autos = $rootScope.autos;
            $scope.loading = false;
        }
        else{
            Autos.query({userid: $rootScope.userid}).then(function(autos){
                $scope.autos = autos;
                $rootScope.autos = autos;
                $scope.loading = false;
            });        
        }
    }
    $scope.base = -1;
    $scope.nice = function(){
        $scope.base = $scope.base + 1;
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
        newauto = new Autos(auto);
        newauto.$saveOrUpdate().then(function (newAuto) {
            $scope.autos.push(newAuto);
            $rootScope.autos = $scope.autos;
            requesttonull();
            $scope.allitems = 1;
            Functions.alertAnimate($("#alert"));
            $scope.loading = false;
        });     
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
        var newrequest2 = new Requests(request);
        newrequest2.$save().then(function (newrequest) {
            newrequest.responds = [];
            newrequest.auto = auto;
            requesttonull();
            $rootScope.products.push(newrequest);
            $scope.allitems = 1;
            $scope.setScreen(0);
            Functions.alertAnimate($("#a-request-new"));
            $scope.loading = false;
        });
        $scope.user.$update().then(function(user){
            $rootScope.user = $scope.user;
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
        if (auto.newpicture != null){
            auto.picture = auto.newpicture;
            auto.newpicture = null;
        }
        auto.$update().then(function(){
            $scope.allitems = 1;
            $rootScope.autos = $scope.autos;
            Functions.alertAnimate($("#a-auto-edit"));
            $scope.editedProduct = null;
            $scope.mainproduct = null;
            $scope.startEdit = false; 
            $scope.loading = false;  
        });
    }


    $scope.isdeleteAuto = function(auto){
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
        auto.$remove().then(function () {
            $scope.autos.splice($scope.autos.indexOf(auto), 1);
            $rootScope.autos = $scope.autos;
            swal("Удален!", "Ваша запись удалена", "success");
            Functions.alertAnimate($("#a-auto-delete"));
        });
    }

    $scope.editItem = function (auto,number) {
        $scope.mainproduct = auto;
        if (!$scope.mainproduct.ismodel && ($scope.mainproduct.mark != '') && ($scope.mainproduct.model != '')){
            $scope.mainproduct.model = $scope.marks[$scope.mainproduct.mark][$scope.mainproduct.model];
        }
        if (!$scope.mainproduct.ismark && ($scope.mainproduct.model != '')){
            $scope.mainproduct.mark = $scope.marks[$scope.mainproduct.mark];
        }
        $scope.markinput = $scope.mainproduct.ismark;
        $scope.modelinput = $scope.mainproduct.ismodel;
        $scope.startEdit = true;
        $scope.allitems = number;
    }
	
	$scope.fileUpload = function(element, $scope){ 
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
